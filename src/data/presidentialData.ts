/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { PresidentialElectionData, LocationResult } from '../types/election.js';

const UFS = [
  { id: 'zz-exterior', name: 'Exterior (Zona ZZ)', ufOrCode: 'ZZ', type: 'EXTERIOR' as const, region: 'Exterior' as const, flag: '🌐' },
  { id: 'sp', name: 'São Paulo', ufOrCode: 'SP', type: 'ESTADO' as const, region: 'Sudeste' as const, flag: '🏙️' },
  { id: 'mg', name: 'Minas Gerais', ufOrCode: 'MG', type: 'ESTADO' as const, region: 'Sudeste' as const, flag: '🔺' },
  { id: 'rj', name: 'Rio de Janeiro', ufOrCode: 'RJ', type: 'ESTADO' as const, region: 'Sudeste' as const, flag: '🏖️' },
  { id: 'ba', name: 'Bahia', ufOrCode: 'BA', type: 'ESTADO' as const, region: 'Nordeste' as const, flag: '🌴' },
  { id: 'rs', name: 'Rio Grande do Sul', ufOrCode: 'RS', type: 'ESTADO' as const, region: 'Sul' as const, flag: '🌾' },
  { id: 'pr', name: 'Paraná', ufOrCode: 'PR', type: 'ESTADO' as const, region: 'Sul' as const, flag: '🌲' },
  { id: 'pe', name: 'Pernambuco', ufOrCode: 'PE', type: 'ESTADO' as const, region: 'Nordeste' as const, flag: '☀️' },
  { id: 'ce', name: 'Ceará', ufOrCode: 'CE', type: 'ESTADO' as const, region: 'Nordeste' as const, flag: '🌊' },
  { id: 'sc', name: 'Santa Catarina', ufOrCode: 'SC', type: 'ESTADO' as const, region: 'Sul' as const, flag: '⛰️' },
  { id: 'go', name: 'Goiás', ufOrCode: 'GO', type: 'ESTADO' as const, region: 'Centro-Oeste' as const, flag: '🌾' },
  { id: 'ma', name: 'Maranhão', ufOrCode: 'MA', type: 'ESTADO' as const, region: 'Nordeste' as const, flag: '⛵' },
  { id: 'pb', name: 'Paraíba', ufOrCode: 'PB', type: 'ESTADO' as const, region: 'Nordeste' as const, flag: '🏜️' },
  { id: 'pa', name: 'Pará', ufOrCode: 'PA', type: 'ESTADO' as const, region: 'Norte' as const, flag: '🌳' },
  { id: 'es', name: 'Espírito Santo', ufOrCode: 'ES', type: 'ESTADO' as const, region: 'Sudeste' as const, flag: '🌄' },
  { id: 'am', name: 'Amazonas', ufOrCode: 'AM', type: 'ESTADO' as const, region: 'Norte' as const, flag: '🏞️' },
  { id: 'rn', name: 'Rio Grande do Norte', ufOrCode: 'RN', type: 'ESTADO' as const, region: 'Nordeste' as const, flag: '☀️' },
  { id: 'al', name: 'Alagoas', ufOrCode: 'AL', type: 'ESTADO' as const, region: 'Nordeste' as const, flag: '🏖️' },
  { id: 'pi', name: 'Piauí', ufOrCode: 'PI', type: 'ESTADO' as const, region: 'Nordeste' as const, flag: '🌵' },
  { id: 'mt', name: 'Mato Grosso', ufOrCode: 'MT', type: 'ESTADO' as const, region: 'Centro-Oeste' as const, flag: '🐆' },
  { id: 'df', name: 'Distrito Federal', ufOrCode: 'DF', type: 'ESTADO' as const, region: 'Centro-Oeste' as const, flag: '🏛️' },
  { id: 'ms', name: 'Mato Grosso do Sul', ufOrCode: 'MS', type: 'ESTADO' as const, region: 'Centro-Oeste' as const, flag: '🌾' },
  { id: 'se', name: 'Sergipe', ufOrCode: 'SE', type: 'ESTADO' as const, region: 'Nordeste' as const, flag: '⛵' },
  { id: 'ro', name: 'Rondônia', ufOrCode: 'RO', type: 'ESTADO' as const, region: 'Norte' as const, flag: '🌲' },
  { id: 'to', name: 'Tocantins', ufOrCode: 'TO', type: 'ESTADO' as const, region: 'Norte' as const, flag: '🌻' },
  { id: 'ac', name: 'Acre', ufOrCode: 'AC', type: 'ESTADO' as const, region: 'Norte' as const, flag: '⭐' },
  { id: 'ap', name: 'Amapá', ufOrCode: 'AP', type: 'ESTADO' as const, region: 'Norte' as const, flag: '🌴' },
  { id: 'rr', name: 'Roraima', ufOrCode: 'RR', type: 'ESTADO' as const, region: 'Norte' as const, flag: '🏔️' }
];

const emptyLocations: LocationResult[] = UFS.map((u) => ({
  id: u.id,
  name: u.name,
  ufOrCode: u.ufOrCode,
  type: u.type,
  region: u.region,
  flagOrIcon: u.flag,
  totalizedSectionsPct: null,
  totalSections: null,
  totalizedSections: null,
  totalValidVotes: null,
  nullVotes: null,
  blankVotes: null,
  abstentions: null,
  votersEligible: null,
  statusDescription: 'Aguardando totalização oficial da UF',
  isImported: false,
  candidates: []
}));

export const initialPresidentialData: PresidentialElectionData = {
  source: 'Tribunal Superior Eleitoral - TSE (Aguardando Conexão Oficial)',
  lastFetchedAt: new Date().toISOString(),
  dataUpdatedAt: new Date().toISOString(),
  audit: {
    provenance: 'DEMONSTRATIVE_BASELINE',
    schemaValid: true,
    sourceVerified: false,
    officiallyPublished: false,
    importedAt: new Date().toISOString(),
    validationWarnings: ['Aguardando recebimento do feed oficial do TSE ou importação de JSON pelo usuário.']
  },
  keyHighlights: [
    'Sistema preparado para a apuração da Eleição Presidencial de 2026.',
    'Aguardando publicação do feed de dados ao vivo pelo Tribunal Superior Eleitoral (TSE).',
    'Nenhum percentual ou voto artificial é exibido antes da validação oficial.',
    'Clique em "Importar TSE" caso deseje carregar o boletim JSON da Justiça Eleitoral.'
  ],
  turno2: {
    turnNumber: 2,
    status: 'AGUARDANDO',
    totalizedSectionsPct: null,
    totalSections: null,
    totalizedSections: null,
    totalValidVotes: null,
    nullVotes: null,
    blankVotes: null,
    abstentions: null,
    votersEligible: null,
    nationalCandidates: [
      {
        id: 'cand-1',
        name: 'Aguardando Totalização',
        shortName: 'Candidato A',
        party: '—',
        number: 0,
        color: '#DC2626',
        votes: null,
        percentage: null,
        status: 'Aguardando'
      },
      {
        id: 'cand-2',
        name: 'Aguardando Totalização',
        shortName: 'Candidato B',
        party: '—',
        number: 0,
        color: '#2563EB',
        votes: null,
        percentage: null,
        status: 'Aguardando'
      }
    ],
    locations: emptyLocations
  },
  turno1: {
    turnNumber: 1,
    status: 'AGUARDANDO',
    totalizedSectionsPct: null,
    totalSections: null,
    totalizedSections: null,
    totalValidVotes: null,
    nullVotes: null,
    blankVotes: null,
    abstentions: null,
    votersEligible: null,
    nationalCandidates: [
      {
        id: 'cand-1',
        name: 'Aguardando Totalização',
        shortName: 'Candidato A',
        party: '—',
        number: 0,
        color: '#DC2626',
        votes: null,
        percentage: null,
        status: 'Aguardando'
      },
      {
        id: 'cand-2',
        name: 'Aguardando Totalização',
        shortName: 'Candidato B',
        party: '—',
        number: 0,
        color: '#2563EB',
        votes: null,
        percentage: null,
        status: 'Aguardando'
      }
    ],
    locations: emptyLocations
  }
};
