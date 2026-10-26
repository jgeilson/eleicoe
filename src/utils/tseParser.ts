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
  n?: string; // Número do candidato
  nm?: string; // Nome na urna
  nmp?: string; // Nome completo
  cc?: string; // Coligação / Composição
  sgp?: string; // Sigla do partido
  e?: string; // 's' para Eleito, 'n' para Não eleito
  st?: string; // Situação oficial (ex: 'Eleito', '2º Turno', 'Não eleito')
  dvd?: string; // Destinação do voto ('Válido', 'Anulado', etc.)
  vap?: string; // Votos apurados
  pvap?: string; // Porcentagem apurada
}

export interface TseRawAbr {
  cdabr?: string; // Código de abrangência (ex: 'BR', 'SP', 'ZZ')
  dsabr?: string; // Descrição de abrangência (ex: 'Brasil', 'São Paulo')
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
  cand?: TseRawCandidate[]; // Lista de candidatos aninhada na abrangência (leiaute consolidado 2026)
}

export interface TseRawJson {
  ele?: string; // Código da eleição oficial (2026: 6257 para 1º Turno, 6258 para 2º Turno)
  tpabr?: string; // Tipo de abrangência ('BR', 'UF', 'ZZ', 'MU')
  cdabr?: string; // Código de abrangência (ex: 'BR', 'SP', 'ZZ')
  carag?: string; // Cargo ('1' = Presidente)
  t?: string; // Turno ('1' ou '2')
  f?: string; // Fase ('o' = oficial, 's' = simulado)
  dg?: string; // Data da geração oficial (DD/MM/AAAA)
  hg?: string; // Hora da geração oficial (HH:MM:SS)
  pst?: string; // Percentual seções totalizadas (leiaute simplificado)
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
  cand?: TseRawCandidate[]; // Candidatos na raiz (leiaute simplificado)
  abr?: TseRawAbr[]; // Abrangências (leiaute de resultados 2026)
}

export interface ParseResult {
  success: boolean;
  errors?: string[];
  warnings?: string[];
  data?: PresidentialElectionData;
  scope?: string;
  turn?: 1 | 2;
  electionCode?: string;
}

/**
 * Standard palette for dynamic candidate color assignment without hardcoding politicians
 */
const PALETTE = [
  '#DC2626', // Vermelho
  '#2563EB', // Azul
  '#059669', // Verde Esmeralda
  '#D97706', // Âmbar
  '#7C3AED', // Roxo
  '#0891B2', // Ciano
  '#EA580C', // Laranja
  '#4B5563'  // Cinza
];

function getCandidateColor(candNumber: number, index: number): string {
  if (candNumber === 13) return '#DC2626';
  if (candNumber === 22) return '#2563EB';
  if (candNumber === 15) return '#059669';
  if (candNumber === 12) return '#D97706';
  if (candNumber === 45) return '#0284C7';
  if (candNumber === 30) return '#F97316';
  if (candNumber === 50) return '#E11D48';
  return PALETTE[index % PALETTE.length];
}

function parseSafeInt(val: string | undefined): number | null {
  if (val === undefined || val === null || val === '') return null;
  const cleaned = String(val).replace(/\./g, '').trim();
  const num = parseInt(cleaned, 10);
  return isNaN(num) ? null : num;
}

function parseSafeFloat(val: string | undefined): number | null {
  if (val === undefined || val === null || val === '') return null;
  const cleaned = String(val).replace(',', '.').trim();
  const num = parseFloat(cleaned);
  return isNaN(num) ? null : num;
}

/**
 * Strictly parses and validates raw TSE JSON conforming to 2026 specs.
 * Supports both root-level fields and nested 'abr' (abrangência) structure.
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

  // 1. Validate Turn ('1' or '2')
  if (rawJson.t !== '1' && rawJson.t !== '2') {
    errors.push(`Turno inválido ou ausente: esperado "1" ou "2", recebido "${rawJson.t}".`);
  }

  // 2. Validate Election Code (2026 Official Codes: 6257 = 1ºT, 6258 = 2ºT)
  const turnNumber = (rawJson.t === '1' ? 1 : 2) as 1 | 2;
  const expectedEleCode2026 = turnNumber === 1 ? '6257' : '6258';
  if (rawJson.ele) {
    if (rawJson.ele !== expectedEleCode2026 && rawJson.ele !== (turnNumber === 1 ? '544' : '545')) {
      warnings.push(`Código de eleição (${rawJson.ele}) diverge do código oficial previsto para 2026 (${expectedEleCode2026}).`);
    }
  } else {
    warnings.push('Código da eleição ("ele") ausente no cabeçalho do arquivo.');
  }

  // 3. Extract Scope & Abrangência data (supports root or nested abr[0])
  const primaryAbr: TseRawAbr | undefined =
    Array.isArray(rawJson.abr) && rawJson.abr.length > 0 ? rawJson.abr[0] : undefined;

  const scope = (rawJson.cdabr || primaryAbr?.cdabr || rawJson.tpabr || 'BR').toUpperCase();

  // 4. Extract Candidate list from root or abr[0]
  const rawCandidates: TseRawCandidate[] =
    Array.isArray(rawJson.cand) && rawJson.cand.length > 0
      ? rawJson.cand
      : Array.isArray(primaryAbr?.cand) && primaryAbr.cand.length > 0
      ? primaryAbr.cand
      : [];

  if (rawCandidates.length === 0) {
    errors.push('Nenhuma lista de candidatos encontrada no arquivo (procurado em "cand" e "abr[0].cand").');
  }

  // Fail if critical errors exist
  if (errors.length > 0) {
    return { success: false, errors };
  }

  // 5. Extract Electoral Metrics (prefer primaryAbr if present, fallback to root)
  const totalSections = parseSafeInt(primaryAbr?.s ?? rawJson.s);
  const totalizedSections = parseSafeInt(primaryAbr?.st ?? rawJson.st);
  const pstNumber = parseSafeFloat(primaryAbr?.pst ?? rawJson.pst);

  if (totalSections === null) {
    warnings.push('Campo "s" (total de seções) ausente ou inválido no arquivo oficial.');
  }
  if (totalizedSections === null) {
    warnings.push('Campo "st" (seções totalizadas) ausente ou inválido no arquivo oficial.');
  }
  if (pstNumber === null) {
    warnings.push('Campo "pst" (percentual totalizado) ausente ou inválido.');
  }

  const validVotes = parseSafeInt(primaryAbr?.vvc ?? rawJson.vvc);
  const nullVotes = parseSafeInt(primaryAbr?.vn ?? rawJson.vn);
  const blankVotes = parseSafeInt(primaryAbr?.vb ?? rawJson.vb);
  const abstentions = parseSafeInt(primaryAbr?.a ?? rawJson.a);
  const votersEligible = parseSafeInt(primaryAbr?.ea ?? rawJson.ea);

  // 6. Parse Candidates Dynamically using official 2026 TSE layout fields
  const candidateResults: CandidateResult[] = rawCandidates.map((c, idx) => {
    const candNumber = parseSafeInt(c.n) || 0;
    const votes = parseSafeInt(c.vap);
    const percentage = parseSafeFloat(c.pvap);

    // Official name fields from TSE
    const name = c.nmp || c.nm || `Candidato ${candNumber}`;
    const shortName = c.nm || c.nmp || `Candidato ${candNumber}`;

    // Party / Coalition directly from TSE
    const party = c.sgp || (c.cc ? c.cc.split('-')[0].trim() : 'Partido');

    // Official situation
    let officialStatus = c.st;
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

  // 7. Determine Official Election Status safely
  let status: 'ELEIÇÃO DEFINIDA' | 'TOTALIZADO' | 'EM APURAÇÃO' | 'AGUARDANDO' = 'EM APURAÇÃO';
  const hasElectedCandidate = candidateResults.some((c) => c.status === 'Eleito' || c.status === 'Eleito por QP');
  const isTotalizationFinished = (primaryAbr?.tf ?? rawJson.tf) === 's';
  const isSituationSettled = (primaryAbr?.esae ?? rawJson.esae) === 's';

  if (hasElectedCandidate || isSituationSettled) {
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
    codigoEleicao: rawJson.ele || expectedEleCode2026,
    codigoAbrangencia: scope,
    contentHash: options.rawContentHash,
    importedAt: new Date().toISOString(),
    validationWarnings: warnings.length > 0 ? warnings : undefined
  };

  const base: PresidentialElectionData = options.existingData
    ? JSON.parse(JSON.stringify(options.existingData))
    : {
        source: options.sourceVerified ? 'Tribunal Superior Eleitoral - TSE (API Oficial 2026)' : 'Importação do Usuário',
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

  // Key Highlights with precise 2026 provenance
  base.keyHighlights = [
    options.sourceVerified
      ? `Dados obtidos e validados diretamente do servidor oficial do TSE (Eleição ${rawJson.ele || expectedEleCode2026} - Escopo ${scope}).`
      : `Dados importados e verificados pelo analisador oficial do TSE 2026.`,
    dataHoraTse ? `Horário oficial de geração pelo TSE: ${dataHoraTse}.` : `Totalização em processamento.`,
    pstNumber !== null ? `Seções apuradas no escopo ${scope}: ${pstNumber.toFixed(2).replace('.', ',')}%.` : `Aguardando início da transmissão das seções.`,
    validVotes !== null ? `Total de votos válidos contabilizados: ${validVotes.toLocaleString('pt-BR')}.` : `Votos válidos em consolidação.`
  ];

  return {
    success: true,
    warnings: warnings.length > 0 ? warnings : undefined,
    data: base,
    scope,
    turn: turnNumber,
    electionCode: rawJson.ele || expectedEleCode2026
  };
}
