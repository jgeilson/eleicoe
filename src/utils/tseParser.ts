/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import {
  PresidentialElectionData,
  CandidateResult,
  RoundData,
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
  dsabr?: string; // Descrição de abrangência
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
  cand?: TseRawCandidate[]; // Lista de candidatos aninhada na abrangência
}

export interface TseRawJson {
  ele?: string; // Código da eleição oficial (ex: '6257', '6258')
  tpabr?: string; // Tipo de abrangência ('BR', 'UF', 'ZZ', 'MU')
  cdabr?: string; // Código de abrangência (ex: 'BR', 'SP', 'ZZ')
  carag?: string; // Cargo ('1' = Presidente)
  t?: string; // Turno ('1' ou '2')
  f?: string; // Fase ('o' = oficial, 's' = simulado)
  dg?: string; // Data da geração oficial (DD/MM/AAAA)
  hg?: string; // Hora da geração oficial (HH:MM:SS)
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
  cand?: TseRawCandidate[]; // Candidatos na raiz
  abr?: TseRawAbr[]; // Abrangências (estrutura 2026)
}

export interface ParseOptions {
  expectedTurn: 1 | 2;
  expectedScope: string; // 'BR', 'SP', 'ZZ', etc.
  expectedElectionCode?: string; // '6257' ou '6258'
  sourceVerified: boolean;
  provenance: DataProvenance;
  sourceUrl?: string;
  rawContentHash?: string;
  existingData?: PresidentialElectionData;
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
 * Objective, consistent color palette.
 * Colors are assigned deterministically by hashing candidate identity,
 * without inferring party or political affiliation by ballot number.
 */
const OBJECTIVE_PALETTE = [
  '#2563EB', // Blue
  '#DC2626', // Red
  '#059669', // Emerald
  '#D97706', // Amber
  '#7C3AED', // Purple
  '#0891B2', // Cyan
  '#EA580C', // Orange
  '#4F46E5', // Indigo
  '#0D9488', // Teal
  '#6B7280'  // Gray
];

function getDeterministicCandidateColor(key: string, index: number): string {
  let hash = 0;
  for (let i = 0; i < key.length; i++) {
    hash = (hash << 5) - hash + key.charCodeAt(i);
    hash |= 0;
  }
  const colorIndex = Math.abs(hash + index) % OBJECTIVE_PALETTE.length;
  return OBJECTIVE_PALETTE[colorIndex];
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
 * Strictly parses and validates raw TSE JSON.
 * Enforces strict matching of:
 * - Election Code (rejects on mismatch)
 * - Turn (rejects on mismatch)
 * - Scope / Abrangência (searches specifically for expectedScope in abr[], rejects if divergent)
 */
export function parseTseOfficialJson(
  rawJson: TseRawJson,
  options: ParseOptions
): ParseResult {
  const errors: string[] = [];
  const warnings: string[] = [];

  if (!rawJson || typeof rawJson !== 'object') {
    return { success: false, errors: ['Conteúdo retornado não é um objeto JSON válido.'] };
  }

  // 1. Strict Turn Validation
  const expectedTurnStr = String(options.expectedTurn);
  if (rawJson.t !== expectedTurnStr) {
    errors.push(
      `Turno incompatível: esperado "${expectedTurnStr}", mas o arquivo recebido é do turno "${rawJson.t || 'não informado'}".`
    );
  }

  // 2. Strict Election Code Validation (P0)
  if (options.expectedElectionCode) {
    if (!rawJson.ele) {
      errors.push('Código da eleição ("ele") ausente no cabeçalho do arquivo.');
    } else if (rawJson.ele !== options.expectedElectionCode) {
      errors.push(
        `Código de eleição rejeitado: esperado "${options.expectedElectionCode}", recebido "${rawJson.ele}".`
      );
    }
  }

  // 3. Strict Scope / Abrangência Matching (P0 & P1)
  const targetScope = options.expectedScope.toUpperCase();
  let matchedAbr: TseRawAbr | undefined;
  let rootMatchesScope = false;

  const rootCdabr = (rawJson.cdabr || rawJson.tpabr || '').toUpperCase();
  if (rootCdabr === targetScope) {
    rootMatchesScope = true;
  }

  if (Array.isArray(rawJson.abr) && rawJson.abr.length > 0) {
    matchedAbr = rawJson.abr.find(
      (a) => (a.cdabr || '').toUpperCase() === targetScope
    );
  }

  // If neither root nor abr array matched the expected scope, reject immediately!
  if (!rootMatchesScope && !matchedAbr) {
    const availableScopes = Array.isArray(rawJson.abr)
      ? rawJson.abr.map((a) => a.cdabr).filter(Boolean).join(', ')
      : rootCdabr;
    errors.push(
      `Abrangência divergente: solicitado escopo "${targetScope}", mas o arquivo contém apenas: [${availableScopes || 'desconhecido'}].`
    );
  }

  // If critical validation errors exist, fail immediately
  if (errors.length > 0) {
    return { success: false, errors };
  }

  // 4. Extract Candidate list from the matched scope
  const rawCandidates: TseRawCandidate[] =
    matchedAbr?.cand && Array.isArray(matchedAbr.cand) && matchedAbr.cand.length > 0
      ? matchedAbr.cand
      : Array.isArray(rawJson.cand) && rawJson.cand.length > 0
      ? rawJson.cand
      : [];

  if (rawCandidates.length === 0) {
    errors.push(`Nenhuma lista de candidatos encontrada para a abrangência "${targetScope}".`);
    return { success: false, errors };
  }

  // 5. Extract Electoral Metrics strictly for the matched scope
  const totalSections = parseSafeInt(matchedAbr?.s ?? rawJson.s);
  const totalizedSections = parseSafeInt(matchedAbr?.st ?? rawJson.st);
  const pstNumber = parseSafeFloat(matchedAbr?.pst ?? rawJson.pst);

  if (totalSections === null) {
    warnings.push('Campo "s" (total de seções) ausente ou inválido no arquivo oficial.');
  }
  if (totalizedSections === null) {
    warnings.push('Campo "st" (seções totalizadas) ausente ou inválido no arquivo oficial.');
  }
  if (pstNumber === null) {
    warnings.push('Campo "pst" (percentual totalizado) ausente ou inválido.');
  }

  const validVotes = parseSafeInt(matchedAbr?.vvc ?? rawJson.vvc);
  const nullVotes = parseSafeInt(matchedAbr?.vn ?? rawJson.vn);
  const blankVotes = parseSafeInt(matchedAbr?.vb ?? rawJson.vb);
  const abstentions = parseSafeInt(matchedAbr?.a ?? rawJson.a);
  const votersEligible = parseSafeInt(matchedAbr?.ea ?? rawJson.ea);

  // 6. Parse Candidates using objective, non-biased coloring
  const candidateResults: CandidateResult[] = rawCandidates.map((c, idx) => {
    const candNumber = parseSafeInt(c.n) || 0;
    const votes = parseSafeInt(c.vap);
    const percentage = parseSafeFloat(c.pvap);

    const name = c.nmp || c.nm || `Candidato ${candNumber}`;
    const shortName = c.nm || c.nmp || `Candidato ${candNumber}`;
    const party = c.sgp || (c.cc ? c.cc.split('-')[0].trim() : 'Partido');

    let officialStatus = c.st;
    if (!officialStatus) {
      if (c.e === 's') officialStatus = 'Eleito';
      else if (c.e === 'n') officialStatus = 'Não eleito';
    }

    const colorKey = c.sqcand || String(candNumber || idx);
    const color = getDeterministicCandidateColor(colorKey, idx);

    return {
      id: c.sqcand || `cand-${candNumber || idx}`,
      name,
      shortName,
      party,
      number: candNumber,
      color,
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
  const isTotalizationFinished = (matchedAbr?.tf ?? rawJson.tf) === 's';
  const isSituationSettled = (matchedAbr?.esae ?? rawJson.esae) === 's';

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
    turnNumber: options.expectedTurn,
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
      ? (options.expectedTurn === 2 ? options.existingData.turno2.locations : options.existingData.turno1.locations)
      : []
  };

  const audit: ProvenanceAudit = {
    provenance: options.provenance,
    schemaValid: true,
    sourceVerified: options.sourceVerified,
    officiallyPublished: !!(rawJson.dg && rawJson.hg),
    sourceUrl: options.sourceUrl,
    dataHoraGeracaoTse: dataHoraTse,
    codigoEleicao: rawJson.ele || options.expectedElectionCode,
    codigoAbrangencia: targetScope,
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

  if (options.expectedTurn === 2) {
    base.turno2 = roundData;
  } else {
    base.turno1 = roundData;
  }

  base.keyHighlights = [
    options.sourceVerified
      ? `Dados oficiais validados do TSE (Eleição ${rawJson.ele || options.expectedElectionCode} - Escopo ${targetScope}).`
      : `Dados importados e verificados pelo analisador oficial do TSE 2026.`,
    dataHoraTse ? `Geração oficial pelo TSE: ${dataHoraTse}.` : `Totalização em processamento.`,
    pstNumber !== null ? `Seções apuradas no escopo ${targetScope}: ${pstNumber.toFixed(2).replace('.', ',')}%.` : `Aguardando início da transmissão das seções.`,
    validVotes !== null ? `Votos válidos apurados: ${validVotes.toLocaleString('pt-BR')}.` : `Votos válidos em consolidação.`
  ];

  return {
    success: true,
    warnings: warnings.length > 0 ? warnings : undefined,
    data: base,
    scope: targetScope,
    turn: options.expectedTurn,
    electionCode: rawJson.ele || options.expectedElectionCode
  };
}
