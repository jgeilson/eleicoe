/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { PresidentialElectionData, LocationResult, CandidateResult } from '../types/election.js';

interface UfMeta {
  id: string;
  name: string;
  ufOrCode: string;
  type: 'ESTADO' | 'EXTERIOR';
  region: 'Sudeste' | 'Nordeste' | 'Sul' | 'Centro-Oeste' | 'Norte' | 'Exterior';
  flag: string;
  baseEligible: number;
}

const UFS: UfMeta[] = [
  { id: 'zz-exterior', name: 'Exterior (Zona ZZ)', ufOrCode: 'ZZ', type: 'EXTERIOR', region: 'Exterior', flag: '🌐', baseEligible: 650000 },
  { id: 'sp', name: 'São Paulo', ufOrCode: 'SP', type: 'ESTADO', region: 'Sudeste', flag: '🏙️', baseEligible: 34600000 },
  { id: 'mg', name: 'Minas Gerais', ufOrCode: 'MG', type: 'ESTADO', region: 'Sudeste', flag: '🔺', baseEligible: 16300000 },
  { id: 'rj', name: 'Rio de Janeiro', ufOrCode: 'RJ', type: 'ESTADO', region: 'Sudeste', flag: '🏖️', baseEligible: 12800000 },
  { id: 'ba', name: 'Bahia', ufOrCode: 'BA', type: 'ESTADO', region: 'Nordeste', flag: '🌴', baseEligible: 11300000 },
  { id: 'rs', name: 'Rio Grande do Sul', ufOrCode: 'RS', type: 'ESTADO', region: 'Sul', flag: '🌾', baseEligible: 8700000 },
  { id: 'pr', name: 'Paraná', ufOrCode: 'PR', type: 'ESTADO', region: 'Sul', flag: '🌲', baseEligible: 8500000 },
  { id: 'pe', name: 'Pernambuco', ufOrCode: 'PE', type: 'ESTADO', region: 'Nordeste', flag: '☀️', baseEligible: 7000000 },
  { id: 'ce', name: 'Ceará', ufOrCode: 'CE', type: 'ESTADO', region: 'Nordeste', flag: '🌊', baseEligible: 6900000 },
  { id: 'sc', name: 'Santa Catarina', ufOrCode: 'SC', type: 'ESTADO', region: 'Sul', flag: '⛰️', baseEligible: 5600000 },
  { id: 'go', name: 'Goiás', ufOrCode: 'GO', type: 'ESTADO', region: 'Centro-Oeste', flag: '🌾', baseEligible: 5100000 },
  { id: 'ma', name: 'Maranhão', ufOrCode: 'MA', type: 'ESTADO', region: 'Nordeste', flag: '⛵', baseEligible: 5000000 },
  { id: 'pb', name: 'Paraíba', ufOrCode: 'PB', type: 'ESTADO', region: 'Nordeste', flag: '🏜️', baseEligible: 3100000 },
  { id: 'pa', name: 'Pará', ufOrCode: 'PA', type: 'ESTADO', region: 'Norte', flag: '🌳', baseEligible: 6100000 },
  { id: 'es', name: 'Espírito Santo', ufOrCode: 'ES', type: 'ESTADO', region: 'Sudeste', flag: '🌄', baseEligible: 2900000 },
  { id: 'am', name: 'Amazonas', ufOrCode: 'AM', type: 'ESTADO', region: 'Norte', flag: '🏞️', baseEligible: 2700000 },
  { id: 'rn', name: 'Rio Grande do Norte', ufOrCode: 'RN', type: 'ESTADO', region: 'Nordeste', flag: '☀️', baseEligible: 2600000 },
  { id: 'al', name: 'Alagoas', ufOrCode: 'AL', type: 'ESTADO', region: 'Nordeste', flag: '🏖️', baseEligible: 2300000 },
  { id: 'pi', name: 'Piauí', ufOrCode: 'PI', type: 'ESTADO', region: 'Nordeste', flag: '🌵', baseEligible: 2700000 },
  { id: 'mt', name: 'Mato Grosso', ufOrCode: 'MT', type: 'ESTADO', region: 'Centro-Oeste', flag: '🐆', baseEligible: 2500000 },
  { id: 'df', name: 'Distrito Federal', ufOrCode: 'DF', type: 'ESTADO', region: 'Centro-Oeste', flag: '🏛️', baseEligible: 2200000 },
  { id: 'ms', name: 'Mato Grosso do Sul', ufOrCode: 'MS', type: 'ESTADO', region: 'Centro-Oeste', flag: '🌾', baseEligible: 2000000 },
  { id: 'se', name: 'Sergipe', ufOrCode: 'SE', type: 'ESTADO', region: 'Nordeste', flag: '⛵', baseEligible: 1700000 },
  { id: 'ro', name: 'Rondônia', ufOrCode: 'RO', type: 'ESTADO', region: 'Norte', flag: '🌲', baseEligible: 1300000 },
  { id: 'to', name: 'Tocantins', ufOrCode: 'TO', type: 'ESTADO', region: 'Norte', flag: '🌻', baseEligible: 1100000 },
  { id: 'ac', name: 'Acre', ufOrCode: 'AC', type: 'ESTADO', region: 'Norte', flag: '⭐', baseEligible: 600000 },
  { id: 'ap', name: 'Amapá', ufOrCode: 'AP', type: 'ESTADO', region: 'Norte', flag: '🌴', baseEligible: 550000 },
  { id: 'rr', name: 'Roraima', ufOrCode: 'RR', type: 'ESTADO', region: 'Norte', flag: '🏔️', baseEligible: 400000 }
];

const turno2NationalCandidates: CandidateResult[] = [
  {
    id: 'cand-13',
    name: 'LUIZ INÁCIO LULA DA SILVA',
    shortName: 'Lula',
    party: 'PT',
    number: 13,
    color: '#2563EB',
    votes: null,
    percentage: null,
    status: 'Aguardando apuração'
  },
  {
    id: 'cand-22',
    name: 'FLÁVIO NANTES BOLSONARO',
    shortName: 'Flávio Bolsonaro',
    party: 'PL',
    number: 22,
    color: '#DC2626',
    votes: null,
    percentage: null,
    status: 'Aguardando apuração'
  }
];

const turno1NationalCandidates: CandidateResult[] = [
  {
    id: 'cand-13-t1',
    name: 'LUIZ INÁCIO LULA DA SILVA',
    shortName: 'Lula',
    party: 'PT',
    number: 13,
    color: '#2563EB',
    votes: null,
    percentage: null,
    status: 'Aguardando apuração'
  },
  {
    id: 'cand-22-t1',
    name: 'FLÁVIO NANTES BOLSONARO',
    shortName: 'Flávio Bolsonaro',
    party: 'PL',
    number: 22,
    color: '#DC2626',
    votes: null,
    percentage: null,
    status: 'Aguardando apuração'
  },
  {
    id: 'cand-other-t1',
    name: 'OUTROS CANDIDATOS',
    shortName: 'Demais',
    party: 'OUTROS',
    number: 99,
    color: '#059669',
    votes: null,
    percentage: null,
    status: 'Aguardando apuração'
  }
];

// Locations for Turno 2 (Zeroed/Empty baseline awaiting TSE transmission)
const turno2Locations: LocationResult[] = UFS.map((u) => ({
  id: u.id,
  name: u.name,
  ufOrCode: u.ufOrCode,
  type: u.type,
  region: u.region,
  flagOrIcon: u.flag,
  totalizedSectionsPct: 0.0,
  totalSections: 0,
  totalizedSections: 0,
  totalValidVotes: null,
  nullVotes: null,
  blankVotes: null,
  abstentions: null,
  votersEligible: u.baseEligible,
  statusDescription: 'Aguardando apuração',
  isImported: false,
  candidates: [
    {
      id: `cand-13-${u.ufOrCode}`,
      name: 'LUIZ INÁCIO LULA DA SILVA',
      shortName: 'Lula',
      party: 'PT',
      number: 13,
      color: '#2563EB',
      votes: null,
      percentage: null,
      status: 'Aguardando apuração'
    },
    {
      id: `cand-22-${u.ufOrCode}`,
      name: 'FLÁVIO NANTES BOLSONARO',
      shortName: 'Flávio Bolsonaro',
      party: 'PL',
      number: 22,
      color: '#DC2626',
      votes: null,
      percentage: null,
      status: 'Aguardando apuração'
    }
  ]
}));

// Locations for Turno 1 (Zeroed/Empty baseline awaiting TSE transmission)
const turno1Locations: LocationResult[] = UFS.map((u) => ({
  id: u.id,
  name: u.name,
  ufOrCode: u.ufOrCode,
  type: u.type,
  region: u.region,
  flagOrIcon: u.flag,
  totalizedSectionsPct: 0.0,
  totalSections: 0,
  totalizedSections: 0,
  totalValidVotes: null,
  nullVotes: null,
  blankVotes: null,
  abstentions: null,
  votersEligible: u.baseEligible,
  statusDescription: 'Aguardando apuração',
  isImported: false,
  candidates: [
    {
      id: `cand-13-${u.ufOrCode}-t1`,
      name: 'LUIZ INÁCIO LULA DA SILVA',
      shortName: 'Lula',
      party: 'PT',
      number: 13,
      color: '#2563EB',
      votes: null,
      percentage: null,
      status: 'Aguardando apuração'
    },
    {
      id: `cand-22-${u.ufOrCode}-t1`,
      name: 'FLÁVIO NANTES BOLSONARO',
      shortName: 'Flávio Bolsonaro',
      party: 'PL',
      number: 22,
      color: '#DC2626',
      votes: null,
      percentage: null,
      status: 'Aguardando apuração'
    },
    {
      id: `cand-other-${u.ufOrCode}-t1`,
      name: 'OUTROS CANDIDATOS',
      shortName: 'Demais',
      party: 'OUTROS',
      number: 99,
      color: '#059669',
      votes: null,
      percentage: null,
      status: 'Aguardando apuração'
    }
  ]
}));

export const initialPresidentialData: PresidentialElectionData = {
  source: 'Tribunal Superior Eleitoral - TSE (Aguardando Dados Oficiais 2026)',
  lastFetchedAt: new Date().toISOString(),
  dataUpdatedAt: new Date().toISOString(),
  audit: {
    provenance: 'DEMONSTRATIVE_BASELINE',
    schemaValid: true,
    sourceVerified: false,
    officiallyPublished: false,
    dataHoraGeracaoTse: undefined,
    codigoEleicao: '6258',
    codigoAbrangencia: 'BR',
    importedAt: new Date().toISOString(),
    validationWarnings: ['Aguardando disponibilização dos dados oficiais pelo TSE.']
  },
  keyHighlights: [
    'Sistema conectado à API do Tribunal Superior Eleitoral (TSE).',
    'Aguardando disponibilização dos arquivos de apuração oficial para a Eleição Presidencial de 2026.',
    'Atualização automática ativa a cada 60 segundos.'
  ],
  turno2: {
    turnNumber: 2,
    status: 'AGUARDANDO',
    totalizedSectionsPct: 0.0,
    totalSections: 0,
    totalizedSections: 0,
    totalValidVotes: null,
    nullVotes: null,
    blankVotes: null,
    abstentions: null,
    votersEligible: 161350000,
    nationalCandidates: turno2NationalCandidates,
    locations: turno2Locations
  },
  turno1: {
    turnNumber: 1,
    status: 'AGUARDANDO',
    totalizedSectionsPct: 0.0,
    totalSections: 0,
    totalizedSections: 0,
    totalValidVotes: null,
    nullVotes: null,
    blankVotes: null,
    abstentions: null,
    votersEligible: 161350000,
    nationalCandidates: turno1NationalCandidates,
    locations: turno1Locations
  }
};

export function getInitialDataForCargo(cargo: string, electionCode?: string): PresidentialElectionData {
  const base: PresidentialElectionData = JSON.parse(JSON.stringify(initialPresidentialData));
  base.audit.codigoEleicao = electionCode || (cargo === '0001' ? '6258' : '6260');
  return base;
}

