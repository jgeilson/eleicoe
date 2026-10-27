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
  [key: string]: any;
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
  abr?: TseRawAbr[]; // Abrangências (estrutura oficial)
  [key: string]: any;
}

export interface ParseOptions {
  expectedTurn: 1 | 2;
  expectedScope: string; // 'BR', 'SP', 'ZZ', etc.
  expectedElectionCode: string; // '6257' ou '6258' (Mandatory for strict validation - Issue 6.1)
  sourceVerified: boolean;
  provenance: DataProvenance;
  sourceUrl?: string;
  rawContentHash?: string;
  configOrigin?: 'TSE_OFFICIAL_CONFIG' | 'VALIDATED_FALLBACK';
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
 * Objective, deterministic color palette.
 * Colors are assigned by hashing candidate identity,
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
 * - Election Code (rejects if mismatch)
 * - Turn (rejects if mismatch)
 * - Scope / Abrangência (searches specifically for expectedScope in abr[], rejects if divergent)
 * - Candidate Numbers: never defaults to 0 (preserves null if missing)
 * - Election Status: preserves distinctions between partial result, totalization finished, and settled election
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

  // 2. Strict Election Code Validation (P0 / Issue 6.1: Mandatory check)
  if (!rawJson.ele) {
    errors.push('Código da eleição ("ele") ausente no cabeçalho do arquivo.');
  } else if (rawJson.ele !== options.expectedElectionCode) {
    errors.push(
      `Código de eleição rejeitado: esperado "${options.expectedElectionCode}", recebido "${rawJson.ele}".`
    );
  }

  // 2.5. Strict Presidential Cargo Validation (Issue 6.1: Mandatory when present)
  if (rawJson.carag !== undefined && rawJson.carag !== null && String(rawJson.carag).trim() !== '') {
    const caragStr = String(rawJson.carag).trim();
    if (caragStr !== '1') {
      errors.push(
        `Cargo incompatível: esperado código "1" (Presidente da República), recebido "${rawJson.carag}".`
      );
    }
  }

  // 3. Strict Scope / Abrangência Matching (P0 & P1)
  const targetScope = options.expectedScope.toUpperCase();
  let matchedAbr: TseRawAbr | undefined;
  let rootMatchesScope = false;

  const rootCdabr = (rawJson.cdabr || rawJson.tpabr || '').toUpperCase();
  if (rootCdabr === targetScope || rootCdabr === 'BR') {
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

  // 4. Extract Candidate list strictly from matched scope or official carg structure
  let rawCandidates: TseRawCandidate[] = [];
  if (matchedAbr?.cand && Array.isArray(matchedAbr.cand) && matchedAbr.cand.length > 0) {
    rawCandidates = matchedAbr.cand;
  } else if (matchedAbr?.cp && Array.isArray(matchedAbr.cp)) {
    for (const cp of matchedAbr.cp) {
      if (Array.isArray(cp?.cand) && cp.cand.length > 0) {
        rawCandidates = cp.cand;
        break;
      }
      if (Array.isArray(cp?.agr)) {
        for (const agr of cp.agr) {
          if (Array.isArray(agr?.par)) {
            for (const par of agr.par) {
              if (Array.isArray(par?.cand)) {
                for (const c of par.cand) {
                  rawCandidates.push({
                    n: c.n,
                    nm: c.nmu || c.nm,
                    nmp: c.nm,
                    sgp: par.sg || c.sgp,
                    vap: c.vap,
                    pvap: c.pvap,
                    st: c.st,
                    e: c.e,
                    sqcand: c.sqcand
                  });
                }
              }
            }
          }
        }
      }
    }
  }

  if (rawCandidates.length === 0 && Array.isArray(rawJson.cand) && rawJson.cand.length > 0) {
    rawCandidates = rawJson.cand;
  }

  if (rawCandidates.length === 0 && Array.isArray(rawJson.carg) && rawJson.carg.length > 0) {
    // Official 2026 layout: carg[0] -> agr[] -> par[] -> cand[] or cp[]
    for (const carg of rawJson.carg) {
      if (Array.isArray(carg?.cand) && carg.cand.length > 0) {
        rawCandidates = carg.cand;
        break;
      }
      if (Array.isArray(carg?.agr)) {
        for (const agr of carg.agr) {
          if (Array.isArray(agr?.par)) {
            for (const par of agr.par) {
              if (Array.isArray(par?.cand)) {
                for (const c of par.cand) {
                  rawCandidates.push({
                    n: c.n,
                    nm: c.nmu || c.nm,
                    nmp: c.nm,
                    sgp: par.sg || c.sgp,
                    vap: c.vap,
                    pvap: c.pvap,
                    st: c.st,
                    e: c.e,
                    sqcand: c.sqcand
                  });
                }
              }
            }
          }
        }
      }
      if (Array.isArray(carg?.cp)) {
        for (const cp of carg.cp) {
          if (Array.isArray(cp?.cand) && cp.cand.length > 0) {
            rawCandidates = cp.cand;
            break;
          }
        }
      }
    }
  }

  if (rawCandidates.length === 0) {
    errors.push(`Nenhuma lista de candidatos encontrada para a abrangência "${targetScope}".`);
    return { success: false, errors };
  }

  // 5. Extract Electoral Metrics strictly for the matched scope (Issue 6.2)
  const metricsSource = matchedAbr || (rootMatchesScope ? rawJson : null);

  const totalSections = parseSafeInt(
    matchedAbr?.s ?? (typeof rawJson.s === 'object' && rawJson.s !== null ? (rawJson.s as any).ts : rawJson.s)
  );
  const totalizedSections = parseSafeInt(
    matchedAbr?.st ?? (typeof rawJson.s === 'object' && rawJson.s !== null ? (rawJson.s as any).st : rawJson.st)
  );
  const pstNumber = parseSafeFloat(
    matchedAbr?.pst ?? (typeof rawJson.s === 'object' && rawJson.s !== null ? (rawJson.s as any).pst : rawJson.pst)
  );

  if (totalSections === null) {
    warnings.push('Campo "s" (total de seções) ausente ou inválido no arquivo oficial.');
  }
  if (totalizedSections === null) {
    warnings.push('Campo "st" (seções totalizadas) ausente ou inválido no arquivo oficial.');
  }
  if (pstNumber === null) {
    warnings.push('Campo "pst" (percentual totalizado) ausente ou inválido.');
  }

  const validVotes = parseSafeInt(
    matchedAbr?.vvc ?? (typeof rawJson.v === 'object' && rawJson.v !== null ? (rawJson.v as any).vvc : rawJson.vvc)
  );
  const nullVotes = parseSafeInt(
    matchedAbr?.vn ?? (typeof rawJson.v === 'object' && rawJson.v !== null ? (rawJson.v as any).vn : rawJson.vn)
  );
  const blankVotes = parseSafeInt(
    matchedAbr?.vb ?? (typeof rawJson.v === 'object' && rawJson.v !== null ? (rawJson.v as any).vb : rawJson.vb)
  );
  const abstentions = parseSafeInt(
    matchedAbr?.a ?? (typeof rawJson.e === 'object' && rawJson.e !== null ? (rawJson.e as any).a : rawJson.e)
  );
  const votersEligible = parseSafeInt(
    matchedAbr?.ea ?? (typeof rawJson.e === 'object' && rawJson.e !== null ? (rawJson.e as any).te : rawJson.ea)
  );

  // 6. Parse Candidates safely: candidate number is null if missing, NEVER 0 (Issue 6.2)
  const candidateResults: CandidateResult[] = rawCandidates.map((c, idx) => {
    const candNumber = parseSafeInt(c.n); // null if missing/invalid, never converted to 0
    const votes = parseSafeInt(c.vap);
    const percentage = parseSafeFloat(c.pvap);

    const name = c.nmp || c.nm || (candNumber !== null ? `Candidato ${candNumber}` : `Candidato ${idx + 1}`);
    const shortName = c.nm || c.nmp || (candNumber !== null ? `Candidato ${candNumber}` : `Candidato ${idx + 1}`);
    const party = c.sgp || (c.cc ? c.cc.split('-')[0].trim() : 'Partido');

    let officialStatus = c.st;
    if (!officialStatus) {
      if (c.e === 's') officialStatus = 'Eleito';
      else if (c.e === 'n') officialStatus = 'Não eleito';
    }

    const colorKey = c.sqcand || String(candNumber !== null ? candNumber : idx);
    const color = getDeterministicCandidateColor(colorKey, idx);

    return {
      id: c.sqcand || `cand-${candNumber !== null ? candNumber : idx}`,
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

  // 7. Determine Official Election Status safely (Issue 6.3: preserve distinctions)
  let status: 'ELEIÇÃO DEFINIDA' | 'TOTALIZADO' | 'EM APURAÇÃO' | 'AGUARDANDO' = 'EM APURAÇÃO';

  const isTotalizationFinished = (metricsSource?.tf) === 's' || (pstNumber !== null && pstNumber >= 100);
  const isSituationSettled = (metricsSource?.esae) === 's';
  const hasElectedCandidate = candidateResults.some((c) => c.status === 'Eleito' || c.status === 'Eleito por QP');

  if (isSituationSettled || (hasElectedCandidate && isTotalizationFinished)) {
    status = 'ELEIÇÃO DEFINIDA';
  } else if (isTotalizationFinished) {
    status = 'TOTALIZADO';
  } else if (pstNumber === null || pstNumber === 0) {
    status = 'AGUARDANDO';
  } else {
    status = 'EM APURAÇÃO';
  }

  const dataHoraTse =
    rawJson.dg && rawJson.hg ? `${rawJson.dg} às ${rawJson.hg}` : undefined;

  // Update existingData (BR national totals or UF locations)
  if (options.existingData) {
    const targetRound = options.expectedTurn === 2 ? options.existingData.turno2 : options.existingData.turno1;
    if (targetRound) {
      if (targetScope === 'BR') {
        targetRound.status = status;
        targetRound.totalizedSectionsPct = pstNumber !== null ? pstNumber : targetRound.totalizedSectionsPct;
        targetRound.totalSections = totalSections !== null ? totalSections : targetRound.totalSections;
        targetRound.totalizedSections = totalizedSections !== null ? totalizedSections : targetRound.totalizedSections;
        targetRound.totalValidVotes = validVotes !== null ? validVotes : targetRound.totalValidVotes;
        targetRound.nullVotes = nullVotes !== null ? nullVotes : targetRound.nullVotes;
        targetRound.blankVotes = blankVotes !== null ? blankVotes : targetRound.blankVotes;
        targetRound.abstentions = abstentions !== null ? abstentions : targetRound.abstentions;
        targetRound.votersEligible = votersEligible !== null ? votersEligible : targetRound.votersEligible;
        targetRound.nationalCandidates = candidateResults;
      } else if (Array.isArray(targetRound.locations)) {
        for (const loc of targetRound.locations) {
          if (loc.ufOrCode.toUpperCase() === targetScope) {
            loc.totalizedSectionsPct = pstNumber !== null ? pstNumber : loc.totalizedSectionsPct;
            loc.totalSections = totalSections !== null ? totalSections : loc.totalSections;
            loc.totalizedSections = totalizedSections !== null ? totalizedSections : loc.totalizedSections;
            loc.totalValidVotes = validVotes !== null ? validVotes : loc.totalValidVotes;
            loc.nullVotes = nullVotes !== null ? nullVotes : loc.nullVotes;
            loc.blankVotes = blankVotes !== null ? blankVotes : loc.blankVotes;
            loc.abstentions = abstentions !== null ? abstentions : loc.abstentions;
            loc.votersEligible = votersEligible !== null ? votersEligible : loc.votersEligible;
            loc.statusDescription = status === 'ELEIÇÃO DEFINIDA' ? 'Apuração Concluída (Eleição Definida)' : status;
            loc.isImported = true;
            loc.candidates = candidateResults;
          }
        }
      }
    }
  }

  const updatedLocations = options.existingData
    ? (options.expectedTurn === 2 ? options.existingData.turno2.locations : options.existingData.turno1.locations)
    : [];

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
    locations: updatedLocations
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
    configOrigin: options.configOrigin,
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
