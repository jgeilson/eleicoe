/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { PresidentialElectionData, CandidateResult, RoundData, LocationResult } from '../types/election.js';

export interface TseRawJson {
  ele?: string; // Eleição ID (ex: "545")
  tpabr?: string; // Tipo de abrangência (BR, UF, ZZ)
  cdabr?: string; // Código de abrangência (BR, SP, ZZ, etc)
  t?: string; // Turno (1 ou 2)
  dg?: string; // Data da geração
  hg?: string; // Hora da geração
  pst?: string; // Percentual seções totalizadas (ex: "100,00")
  s?: string; // Total seções
  st?: string; // Seções totalizadas
  ea?: string; // Eleitores aptos
  a?: string; // Abstenção
  vvc?: string; // Votos válidos
  vb?: string; // Votos brancos
  vn?: string; // Votos nulos
  cand?: Array<{
    seq?: string;
    sqcand?: string;
    n?: string;
    nm?: string;
    nmp?: string;
    cc?: string;
    e?: string; // 's' para Eleito
    st?: string; // Status texto (ex: "Eleito", "2º Turno")
    vap?: string; // Votos apurados
    pvap?: string; // Porcentagem de votos apurados
  }>;
}

/**
 * Validates and converts official TSE JSON response into internal PresidentialElectionData
 */
export function parseTseOfficialJson(
  rawJson: TseRawJson,
  existingData?: PresidentialElectionData
): PresidentialElectionData | null {
  if (!rawJson || typeof rawJson !== 'object') {
    return null;
  }

  // Check required TSE properties
  if (!rawJson.cand || !Array.isArray(rawJson.cand) || rawJson.cand.length === 0) {
    return null;
  }

  const turnNumber = rawJson.t === '1' ? 1 : 2;
  const pstNumber = parseFloat((rawJson.pst || '0').replace(',', '.')) || 0;
  const validVotes = parseInt((rawJson.vvc || '0').replace(/\./g, ''), 10) || 0;
  const nullVotes = parseInt((rawJson.vn || '0').replace(/\./g, ''), 10) || 0;
  const blankVotes = parseInt((rawJson.vb || '0').replace(/\./g, ''), 10) || 0;
  const abstentions = parseInt((rawJson.a || '0').replace(/\./g, ''), 10) || 0;
  const votersEligible = parseInt((rawJson.ea || '0').replace(/\./g, ''), 10) || 0;

  const candidateResults: CandidateResult[] = rawJson.cand.map((c, idx) => {
    const votes = parseInt((c.vap || '0').replace(/\./g, ''), 10) || 0;
    const percentage = parseFloat((c.pvap || '0').replace(',', '.')) || 0;
    const num = parseInt(c.n || '0', 10);
    const fullName = c.nm || c.nmp || `Candidato ${num}`;

    let shortName = fullName;
    if (num === 13) shortName = 'Lula';
    else if (num === 22) shortName = 'Flávio Bolsonaro';
    else if (num === 15) shortName = 'Simone Tebet';
    else if (num === 12) shortName = 'Ciro Gomes';

    let color = '#6B7280';
    if (num === 13) color = '#DC2626';
    else if (num === 22) color = '#2563EB';
    else if (num === 15) color = '#059669';
    else if (num === 12) color = '#D97706';

    let statusText: 'Eleito' | '2º Turno' | 'Não eleito' | 'Empate' = 'Não eleito';
    if (c.e === 's' || c.st === 'Eleito') statusText = 'Eleito';
    else if (c.st === '2º Turno') statusText = '2º Turno';

    return {
      id: `cand-${num || idx}`,
      name: fullName,
      shortName,
      party: c.cc?.split('-')[0]?.trim() || 'Partido',
      number: num,
      color,
      votes,
      percentage,
      status: statusText
    };
  });

  const dataHoraTse = rawJson.dg && rawJson.hg ? `${rawJson.dg} às ${rawJson.hg}` : new Date().toLocaleTimeString('pt-BR');

  const newRoundData: RoundData = {
    turnNumber,
    status: pstNumber >= 100 ? 'ELEIÇÃO DEFINIDA' : 'EM APURAÇÃO',
    totalizedSectionsPct: pstNumber,
    totalSections: parseInt((rawJson.s || '0').replace(/\./g, ''), 10) || 472078,
    totalizedSections: parseInt((rawJson.st || '0').replace(/\./g, ''), 10) || 472078,
    totalValidVotes: validVotes,
    nullVotes,
    blankVotes,
    abstentions,
    votersEligible,
    nationalCandidates: candidateResults,
    locations: existingData ? (turnNumber === 2 ? existingData.turno2.locations : existingData.turno1.locations) : []
  };

  const base: PresidentialElectionData = existingData
    ? JSON.parse(JSON.stringify(existingData))
    : {
        source: 'Tribunal Superior Eleitoral - TSE (Dados Abertos)',
        lastFetchedAt: new Date().toISOString(),
        dataUpdatedAt: new Date().toISOString(),
        isOfficialValidated: true,
        dataHoraGeracaoTse: dataHoraTse,
        keyHighlights: [],
        turno1: newRoundData,
        turno2: newRoundData
      };

  base.isOfficialValidated = true;
  base.dataHoraGeracaoTse = dataHoraTse;
  base.dataUpdatedAt = new Date().toISOString();
  base.keyHighlights = [
    `Dados oficiais validados diretamente da Justiça Eleitoral (TSE).`,
    `Geração oficial TSE: ${dataHoraTse}.`,
    `Totalização nacional: ${pstNumber.toFixed(2).replace('.', ',')}% das seções apuradas.`,
    `Total de votos válidos contabilizados: ${validVotes.toLocaleString('pt-BR')}.`
  ];

  if (turnNumber === 2) {
    base.turno2 = newRoundData;
  } else {
    base.turno1 = newRoundData;
  }

  return base;
}
