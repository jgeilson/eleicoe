/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import {
  PresidentialElectionData,
  CandidateResult,
  RoundData,
  LocationResult,
  ProvenanceAudit,
  DataProvenance
} from '../types/election.js';

export interface TseRawCandidate {
  seq?: string;
  sqcand?: string;
  n?: string; // Número
  nm?: string; // Nome na urna
  nmp?: string; // Nome completo
  cc?: string; // Coligação / Composição
  sgp?: string; // Sigla do partido
  e?: string; // 's' para Eleito
  st?: string; // Situação (ex: 'Eleito', '2º Turno', 'Não eleito')
  vap?: string; // Votos apurados
  pvap?: string; // Porcentagem apurada
}

export interface TseRawJson {
  ele?: string; // Código da eleição
  tpabr?: string; // Tipo de abrangência ('BR', 'UF', 'ZZ', 'MU')
  cdabr?: string; // Código de abrangência (ex: 'BR', 'SP', 'ZZ')
  carag?: string; // Cargo ('1' = Presidente)
  t?: string; // Turno ('1' ou '2')
  f?: string; // Fase
  dg?: string; // Data da geração
  hg?: string; // Hora da geração
  pst?: string; // Percentual seções totalizadas
  s?: string; // Total de seções
  st?: string; // Seções totalizadas
  ea?: string; // Eleitores aptos
  c?: string; // Comparecimento
  a?: string; // Abstenção
  vvc?: string; // Votos válidos a candidatos
  vb?: string; // Votos brancos
  vn?: string; // Votos nulos
  tf?: string; // Totalização finalizada ('s'/'n')
  esae?: string; // Situação apurada ('s'/'n')
  cand?: TseRawCandidate[];
}

export interface ParseResult {
  success: boolean;
  errors?: string[];
  warnings?: string[];
  data?: PresidentialElectionData;
  scope?: string;
  turn?: 1 | 2;
}

/**
 * Standard palette for dynamic candidate color assignment without hardcoding politicians
 */
const PALETTE = [
  '#DC2626', // Red
  '#2563EB', // Blue
  '#059669', // Emerald
  '#D97706', // Amber
  '#7C3AED', // Purple
  '#0891B2', // Cyan
  '#EA580C', // Orange
  '#4B5563'  // Gray
];

function getCandidateColor(candNumber: number, index: number): string {
  // Common Brazilian political colors mapped by official ballot number conventions
  if (candNumber === 13) return '#DC2626'; // PT
  if (candNumber === 22) return '#2563EB'; // PL
  if (candNumber === 15) return '#059669'; // MDB
  if (candNumber === 12) return '#D97706'; // PDT
  if (candNumber === 45) return '#0284C7'; // PSDB
  if (candNumber === 30) return '#F97316'; // NOVO
  if (candNumber === 50) return '#E11D48'; // PSOL
  return PALETTE[index % PALETTE.length];
}

/**
 * Parses integer safely without assigning fake electoral fallback numbers.
 * Returns null if missing or invalid.
 */
function parseSafeInt(val: string | undefined): number | null {
  if (val === undefined || val === null || val === '') return null;
  const cleaned = String(val).replace(/\./g, '').trim();
  const num = parseInt(cleaned, 10);
  return isNaN(num) ? null : num;
}

/**
 * Parses float percentage safely without assigning fake electoral fallback numbers.
 * Returns null if missing or invalid.
 */
function parseSafeFloat(val: string | undefined): number | null {
  if (val === undefined || val === null || val === '') return null;
  const cleaned = String(val).replace(',', '.').trim();
  const num = parseFloat(cleaned);
  return isNaN(num) ? null : num;
}

/**
 * Strictly parses and validates raw TSE JSON.
 * Rejects corrupt/invalid payloads, validates turn/schema, and preserves provenance.
 */
export function parseTseOfficialJson(
  rawJson: TseRawJson,
  options: {
    sourceVerified: boolean;
    provenance: DataProvenance;
    sourceUrl?: string;
    rawContentHash?: string;
    existingData?: PresidentialElectionData;
  }
): ParseResult {
  const errors: string[] = [];
  const warnings: string[] = [];

  if (!rawJson || typeof rawJson !== 'object') {
    return { success: false, errors: ['Conteúdo retornado não é um objeto JSON válido.'] };
  }

  // 1. Validate Turn
  if (rawJson.t !== '1' && rawJson.t !== '2') {
    errors.push(`Turno inválido ou ausente: esperado "1" ou "2", recebido "${rawJson.t}".`);
  }

  // 2. Validate Candidates Array
  if (!rawJson.cand || !Array.isArray(rawJson.cand)) {
    errors.push('Campo obrigatório "cand" (lista de candidatos) ausente.');
  } else if (rawJson.cand.length === 0) {
    errors.push('Lista de candidatos "cand" está vazia.');
  }

  // If critical schema errors exist, fail immediately
  if (errors.length > 0) {
    return { success: false, errors };
  }

  const turnNumber = (rawJson.t === '1' ? 1 : 2) as 1 | 2;
  const scope = (rawJson.cdabr || rawJson.tpabr || 'BR').toUpperCase();

  // 3. Parse electoral metrics without fake fallbacks
  const totalSections = parseSafeInt(rawJson.s);
  const totalizedSections = parseSafeInt(rawJson.st);
  const pstNumber = parseSafeFloat(rawJson.pst);

  if (totalSections === null) {
    warnings.push('Campo "s" (total de seções) ausente ou inválido no JSON oficial.');
  }
  if (totalizedSections === null) {
    warnings.push('Campo "st" (seções totalizadas) ausente ou inválido no JSON oficial.');
  }
  if (pstNumber === null) {
    warnings.push('Campo "pst" (percentual totalizado) ausente ou inválido.');
  }

  const validVotes = parseSafeInt(rawJson.vvc);
  const nullVotes = parseSafeInt(rawJson.vn);
  const blankVotes = parseSafeInt(rawJson.vb);
  const abstentions = parseSafeInt(rawJson.a);
  const votersEligible = parseSafeInt(rawJson.ea);

  // 4. Parse candidates dynamically using official TSE fields
  const candidateResults: CandidateResult[] = (rawJson.cand || []).map((c, idx) => {
    const candNumber = parseSafeInt(c.n) || 0;
    const votes = parseSafeInt(c.vap) || 0;
    const percentage = parseSafeFloat(c.pvap) || 0;

    // Use official name from TSE (nm = urna, nmp = nome completo)
    const name = c.nmp || c.nm || `Candidato ${candNumber}`;
    const shortName = c.nm || c.nmp || `Candidato ${candNumber}`;

    // Party / Coalition directly from TSE
    const party = c.sgp || (c.cc ? c.cc.split('-')[0].trim() : 'Partido');

    // Official status directly from TSE
    let officialStatus = c.st || (c.e === 's' ? 'Eleito' : undefined);
    if (!officialStatus) {
      if (c.e === 's') officialStatus = 'Eleito';
      else if (c.e === 'n') officialStatus = 'Não eleito';
    }

    return {
      id: c.sqcand || `cand-${candNumber || idx}`,
      name,
      shortName,
      party,
      number: candNumber,
      color: getCandidateColor(candNumber, idx),
      votes,
      percentage,
      status: officialStatus
    };
  });

  // Sort candidates by votes descending
  candidateResults.sort((a, b) => (b.votes || 0) - (a.votes || 0));

  // 5. Determine Election Status safely (TF, ESAE, or Candidate status, not merely pst === 100)
  let status: 'ELEIÇÃO DEFINIDA' | 'TOTALIZADO' | 'EM APURAÇÃO' | 'AGUARDANDO' = 'EM APURAÇÃO';
  const hasElectedCandidate = candidateResults.some((c) => c.status === 'Eleito' || c.status === 'Eleito por QP');
  const isTotalizationFinished = rawJson.tf === 's';

  if (hasElectedCandidate || rawJson.esae === 's') {
    status = 'ELEIÇÃO DEFINIDA';
  } else if (isTotalizationFinished || (pstNumber !== null && pstNumber >= 100)) {
    status = 'TOTALIZADO';
  } else if (pstNumber === null || pstNumber === 0) {
    status = 'AGUARDANDO';
  }

  const dataHoraTse =
    rawJson.dg && rawJson.hg ? `${rawJson.dg} às ${rawJson.hg}` : undefined;

  const roundData: RoundData = {
    turnNumber,
    status,
    totalizedSectionsPct: pstNumber,
    totalSections,
    totalizedSections,
    totalValidVotes: validVotes,
    nullVotes,
    blankVotes,
    abstentions,
    votersEligible,
    nationalCandidates: candidateResults,
    locations: options.existingData
      ? (turnNumber === 2 ? options.existingData.turno2.locations : options.existingData.turno1.locations)
      : []
  };

  const audit: ProvenanceAudit = {
    provenance: options.provenance,
    schemaValid: true,
    sourceVerified: options.sourceVerified,
    officiallyPublished: !!(rawJson.dg && rawJson.hg),
    sourceUrl: options.sourceUrl,
    dataHoraGeracaoTse: dataHoraTse,
    codigoEleicao: rawJson.ele,
    codigoAbrangencia: scope,
    contentHash: options.rawContentHash,
    importedAt: new Date().toISOString(),
    validationWarnings: warnings.length > 0 ? warnings : undefined
  };

  const base: PresidentialElectionData = options.existingData
    ? JSON.parse(JSON.stringify(options.existingData))
    : {
        source: options.sourceVerified ? 'Tribunal Superior Eleitoral - TSE (API Oficial)' : 'Importação do Usuário',
        lastFetchedAt: new Date().toISOString(),
        dataUpdatedAt: new Date().toISOString(),
        audit,
        keyHighlights: [],
        turno1: roundData,
        turno2: roundData
      };

  base.audit = audit;
  base.dataUpdatedAt = new Date().toISOString();
  base.lastFetchedAt = new Date().toISOString();

  if (turnNumber === 2) {
    base.turno2 = roundData;
  } else {
    base.turno1 = roundData;
  }

  // Key Highlights with precise provenance
  base.keyHighlights = [
    options.sourceVerified
      ? `Dados obtidos e validados diretamente do servidor oficial do TSE (${scope}).`
      : `Dados importados e verificados pelo analisador de esquema do TSE.`,
    dataHoraTse ? `Horário oficial de geração pelo TSE: ${dataHoraTse}.` : `Totalização em processamento.`,
    pstNumber !== null ? `Seções apuradas no escopo ${scope}: ${pstNumber.toFixed(2).replace('.', ',')}%.` : `Aguardando início da transmissão das seções.`,
    validVotes !== null ? `Total de votos válidos contabilizados: ${validVotes.toLocaleString('pt-BR')}.` : `Votos válidos em consolidação.`
  ];

  return {
    success: true,
    warnings: warnings.length > 0 ? warnings : undefined,
    data: base,
    scope,
    turn: turnNumber
  };
}
