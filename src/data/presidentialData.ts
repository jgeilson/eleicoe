/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { PresidentialElectionData } from '../types/election';

export const initialPresidentialData: PresidentialElectionData = {
  source: 'Tribunal Superior Eleitoral - TSE (Eleições 2026)',
  lastFetchedAt: new Date().toISOString(),
  dataUpdatedAt: '2026-10-25T20:30:00.000Z',
  keyHighlights: [
    'Resultados consolidados do Tribunal Superior Eleitoral (TSE) para as Eleições Presidenciais 2026.',
    'No 2º Turno de 2026, Lula e Flávio Bolsonaro disputaram a Presidência da República reunindo 122,8 milhões de votos válidos.',
    'Totalização encerrada com 100,00% das 472 mil seções eleitorais apuradas no Brasil e no Exterior (Zona ZZ).',
    'No Exterior (Zona ZZ), mais de 709 mil eleitores se cadastram para votar em 100+ países.'
  ],
  turno2: {
    turnNumber: 2,
    status: 'ELEIÇÃO DEFINIDA',
    totalizedSectionsPct: 100.0,
    totalSections: 472078,
    totalizedSections: 472078,
    totalValidVotes: 122850000,
    nullVotes: 4120000,
    blankVotes: 2580000,
    abstentions: 31800000,
    votersEligible: 161350000,
    nationalCandidates: [
      {
        id: 'lula',
        name: 'Luiz Inácio Lula da Silva',
        shortName: 'Lula',
        party: 'PT',
        number: 13,
        color: '#DC2626',
        votes: 62407800,
        percentage: 50.8,
        status: 'Eleito'
      },
      {
        id: 'bolsonaro',
        name: 'Flávio Bolsonaro',
        shortName: 'Flávio Bolsonaro',
        party: 'PL',
        number: 22,
        color: '#2563EB',
        votes: 60442200,
        percentage: 49.2,
        status: 'Não eleito'
      }
    ],
    locations: [
      {
        id: 'zz-exterior',
        name: 'Exterior (Zona ZZ - Todos os Países)',
        ufOrCode: 'ZZ',
        type: 'EXTERIOR',
        region: 'Exterior',
        flagOrIcon: '🌐',
        totalizedSectionsPct: 100.0,
        totalValidVotes: 322000,
        nullVotes: 13200,
        blankVotes: 9100,
        abstentions: 365000,
        votersEligible: 709300,
        candidates: [
          { id: 'bolsonaro', name: 'Flávio Bolsonaro', shortName: 'Flávio Bolsonaro', party: 'PL', number: 22, color: '#2563EB', votes: 168406, percentage: 52.3 },
          { id: 'lula', name: 'Luiz Inácio Lula da Silva', shortName: 'Lula', party: 'PT', number: 13, color: '#DC2626', votes: 153594, percentage: 47.7 }
        ]
      },
      {
        id: 'sp',
        name: 'São Paulo',
        ufOrCode: 'SP',
        type: 'ESTADO',
        region: 'Sudeste',
        flagOrIcon: '🏙️',
        totalizedSectionsPct: 100.0,
        totalValidVotes: 25600000,
        nullVotes: 990000,
        blankVotes: 520000,
        abstentions: 6100000,
        votersEligible: 33210000,
        candidates: [
          { id: 'bolsonaro', name: 'Flávio Bolsonaro', shortName: 'Flávio Bolsonaro', party: 'PL', number: 22, color: '#2563EB', votes: 14208000, percentage: 55.5 },
          { id: 'lula', name: 'Luiz Inácio Lula da Silva', shortName: 'Lula', party: 'PT', number: 13, color: '#DC2626', votes: 11392000, percentage: 44.5 }
        ]
      },
      {
        id: 'mg',
        name: 'Minas Gerais',
        ufOrCode: 'MG',
        type: 'ESTADO',
        region: 'Sudeste',
        flagOrIcon: '🔺',
        totalizedSectionsPct: 100.0,
        totalValidVotes: 12360000,
        nullVotes: 430000,
        blankVotes: 260000,
        abstentions: 3100000,
        votersEligible: 16150000,
        candidates: [
          { id: 'lula', name: 'Luiz Inácio Lula da Silva', shortName: 'Lula', party: 'PT', number: 13, color: '#DC2626', votes: 6278880, percentage: 50.8 },
          { id: 'bolsonaro', name: 'Flávio Bolsonaro', shortName: 'Flávio Bolsonaro', party: 'PL', number: 22, color: '#2563EB', votes: 6081120, percentage: 49.2 }
        ]
      },
      {
        id: 'rj',
        name: 'Rio de Janeiro',
        ufOrCode: 'RJ',
        type: 'ESTADO',
        region: 'Sudeste',
        flagOrIcon: '🏖️',
        totalizedSectionsPct: 100.0,
        totalValidVotes: 9700000,
        nullVotes: 390000,
        blankVotes: 200000,
        abstentions: 2650000,
        votersEligible: 12940000,
        candidates: [
          { id: 'bolsonaro', name: 'Flávio Bolsonaro', shortName: 'Flávio Bolsonaro', party: 'PL', number: 22, color: '#2563EB', votes: 5509600, percentage: 56.8 },
          { id: 'lula', name: 'Luiz Inácio Lula da Silva', shortName: 'Lula', party: 'PT', number: 13, color: '#DC2626', votes: 4190400, percentage: 43.2 }
        ]
      },
      {
        id: 'ba',
        name: 'Bahia',
        ufOrCode: 'BA',
        type: 'ESTADO',
        region: 'Nordeste',
        flagOrIcon: '🌴',
        totalizedSectionsPct: 100.0,
        totalValidVotes: 8700000,
        nullVotes: 250000,
        blankVotes: 120000,
        abstentions: 2380000,
        votersEligible: 11450000,
        candidates: [
          { id: 'lula', name: 'Luiz Inácio Lula da Silva', shortName: 'Lula', party: 'PT', number: 13, color: '#DC2626', votes: 6307500, percentage: 72.5 },
          { id: 'bolsonaro', name: 'Flávio Bolsonaro', shortName: 'Flávio Bolsonaro', party: 'PL', number: 22, color: '#2563EB', votes: 2392500, percentage: 27.5 }
        ]
      },
      {
        id: 'rs',
        name: 'Rio Grande do Sul',
        ufOrCode: 'RS',
        type: 'ESTADO',
        region: 'Sul',
        flagOrIcon: '🌾',
        totalizedSectionsPct: 100.0,
        totalValidVotes: 7010000,
        nullVotes: 215000,
        blankVotes: 135000,
        abstentions: 1380000,
        votersEligible: 8740000,
        candidates: [
          { id: 'bolsonaro', name: 'Flávio Bolsonaro', shortName: 'Flávio Bolsonaro', party: 'PL', number: 22, color: '#2563EB', votes: 3960650, percentage: 56.5 },
          { id: 'lula', name: 'Luiz Inácio Lula da Silva', shortName: 'Lula', party: 'PT', number: 13, color: '#DC2626', votes: 3049350, percentage: 43.5 }
        ]
      },
      {
        id: 'pr',
        name: 'Paraná',
        ufOrCode: 'PR',
        type: 'ESTADO',
        region: 'Sul',
        flagOrIcon: '🌲',
        totalizedSectionsPct: 100.0,
        totalValidVotes: 6810000,
        nullVotes: 215000,
        blankVotes: 145000,
        abstentions: 1480000,
        votersEligible: 8650000,
        candidates: [
          { id: 'bolsonaro', name: 'Flávio Bolsonaro', shortName: 'Flávio Bolsonaro', party: 'PL', number: 22, color: '#2563EB', votes: 4263060, percentage: 62.6 },
          { id: 'lula', name: 'Luiz Inácio Lula da Silva', shortName: 'Lula', party: 'PT', number: 13, color: '#DC2626', votes: 2546940, percentage: 37.4 }
        ]
      },
      {
        id: 'pe',
        name: 'Pernambuco',
        ufOrCode: 'PE',
        type: 'ESTADO',
        region: 'Nordeste',
        flagOrIcon: '☀️',
        totalizedSectionsPct: 100.0,
        totalValidVotes: 5580000,
        nullVotes: 185000,
        blankVotes: 98000,
        abstentions: 1300000,
        votersEligible: 7163000,
        candidates: [
          { id: 'lula', name: 'Luiz Inácio Lula da Silva', shortName: 'Lula', party: 'PT', number: 13, color: '#DC2626', votes: 3755340, percentage: 67.3 },
          { id: 'bolsonaro', name: 'Flávio Bolsonaro', shortName: 'Flávio Bolsonaro', party: 'PL', number: 22, color: '#2563EB', votes: 1824660, percentage: 32.7 }
        ]
      },
      {
        id: 'ce',
        name: 'Ceará',
        ufOrCode: 'CE',
        type: 'ESTADO',
        region: 'Nordeste',
        flagOrIcon: '🌊',
        totalizedSectionsPct: 100.0,
        totalValidVotes: 5380000,
        nullVotes: 165000,
        blankVotes: 88000,
        abstentions: 1340000,
        votersEligible: 6973000,
        candidates: [
          { id: 'lula', name: 'Luiz Inácio Lula da Silva', shortName: 'Lula', party: 'PT', number: 13, color: '#DC2626', votes: 3776760, percentage: 70.2 },
          { id: 'bolsonaro', name: 'Flávio Bolsonaro', shortName: 'Flávio Bolsonaro', party: 'PL', number: 22, color: '#2563EB', votes: 1603240, percentage: 29.8 }
        ]
      },
      {
        id: 'sc',
        name: 'Santa Catarina',
        ufOrCode: 'SC',
        type: 'ESTADO',
        region: 'Sul',
        flagOrIcon: '⛰️',
        totalizedSectionsPct: 100.0,
        totalValidVotes: 4480000,
        nullVotes: 135000,
        blankVotes: 85000,
        abstentions: 930000,
        votersEligible: 5630000,
        candidates: [
          { id: 'bolsonaro', name: 'Flávio Bolsonaro', shortName: 'Flávio Bolsonaro', party: 'PL', number: 22, color: '#2563EB', votes: 3109120, percentage: 69.4 },
          { id: 'lula', name: 'Luiz Inácio Lula da Silva', shortName: 'Lula', party: 'PT', number: 13, color: '#DC2626', votes: 1370880, percentage: 30.6 }
        ]
      },
      {
        id: 'go',
        name: 'Goiás',
        ufOrCode: 'GO',
        type: 'ESTADO',
        region: 'Centro-Oeste',
        flagOrIcon: '🌾',
        totalizedSectionsPct: 100.0,
        totalValidVotes: 3980000,
        nullVotes: 115000,
        blankVotes: 71000,
        abstentions: 850000,
        votersEligible: 5016000,
        candidates: [
          { id: 'bolsonaro', name: 'Flávio Bolsonaro', shortName: 'Flávio Bolsonaro', party: 'PL', number: 22, color: '#2563EB', votes: 2543220, percentage: 63.9 },
          { id: 'lula', name: 'Luiz Inácio Lula da Silva', shortName: 'Lula', party: 'PT', number: 13, color: '#DC2626', votes: 1436780, percentage: 36.1 }
        ]
      },
      {
        id: 'pa',
        name: 'Pará',
        ufOrCode: 'PA',
        type: 'ESTADO',
        region: 'Norte',
        flagOrIcon: '🌳',
        totalizedSectionsPct: 100.0,
        totalValidVotes: 4320000,
        nullVotes: 125000,
        blankVotes: 74000,
        abstentions: 1080000,
        votersEligible: 5599000,
        candidates: [
          { id: 'lula', name: 'Luiz Inácio Lula da Silva', shortName: 'Lula', party: 'PT', number: 13, color: '#DC2626', votes: 2371680, percentage: 54.9 },
          { id: 'bolsonaro', name: 'Flávio Bolsonaro', shortName: 'Flávio Bolsonaro', party: 'PL', number: 22, color: '#2563EB', votes: 1948320, percentage: 45.1 }
        ]
      },
      {
        id: 'ma',
        name: 'Maranhão',
        ufOrCode: 'MA',
        type: 'ESTADO',
        region: 'Nordeste',
        flagOrIcon: '⛵',
        totalizedSectionsPct: 100.0,
        totalValidVotes: 3710000,
        nullVotes: 98000,
        blankVotes: 49000,
        abstentions: 1080000,
        votersEligible: 4937000,
        candidates: [
          { id: 'lula', name: 'Luiz Inácio Lula da Silva', shortName: 'Lula', party: 'PT', number: 13, color: '#DC2626', votes: 2652650, percentage: 71.5 },
          { id: 'bolsonaro', name: 'Flávio Bolsonaro', shortName: 'Flávio Bolsonaro', party: 'PL', number: 22, color: '#2563EB', votes: 1057350, percentage: 28.5 }
        ]
      },
      {
        id: 'pb',
        name: 'Paraíba',
        ufOrCode: 'PB',
        type: 'ESTADO',
        region: 'Nordeste',
        flagOrIcon: '🏜️',
        totalizedSectionsPct: 100.0,
        totalValidVotes: 2450000,
        nullVotes: 71000,
        blankVotes: 41000,
        abstentions: 490000,
        votersEligible: 3052000,
        candidates: [
          { id: 'lula', name: 'Luiz Inácio Lula da Silva', shortName: 'Lula', party: 'PT', number: 13, color: '#DC2626', votes: 1582700, percentage: 64.6 },
          { id: 'bolsonaro', name: 'Flávio Bolsonaro', shortName: 'Flávio Bolsonaro', party: 'PL', number: 22, color: '#2563EB', votes: 867300, percentage: 35.4 }
        ]
      },
      {
        id: 'df',
        name: 'Distrito Federal',
        ufOrCode: 'DF',
        type: 'ESTADO',
        region: 'Centro-Oeste',
        flagOrIcon: '🏛️',
        totalizedSectionsPct: 100.0,
        totalValidVotes: 1850000,
        nullVotes: 44000,
        blankVotes: 29000,
        abstentions: 360000,
        votersEligible: 2283000,
        candidates: [
          { id: 'bolsonaro', name: 'Flávio Bolsonaro', shortName: 'Flávio Bolsonaro', party: 'PL', number: 22, color: '#2563EB', votes: 1085950, percentage: 58.7 },
          { id: 'lula', name: 'Luiz Inácio Lula da Silva', shortName: 'Lula', party: 'PT', number: 13, color: '#DC2626', votes: 764050, percentage: 41.3 }
        ]
      },
      {
        id: 'es',
        name: 'Espírito Santo',
        ufOrCode: 'ES',
        type: 'ESTADO',
        region: 'Sudeste',
        flagOrIcon: '🌄',
        totalizedSectionsPct: 100.0,
        totalValidVotes: 2280000,
        nullVotes: 68000,
        blankVotes: 43000,
        abstentions: 570000,
        votersEligible: 2961000,
        candidates: [
          { id: 'bolsonaro', name: 'Flávio Bolsonaro', shortName: 'Flávio Bolsonaro', party: 'PL', number: 22, color: '#2563EB', votes: 1326960, percentage: 58.2 },
          { id: 'lula', name: 'Luiz Inácio Lula da Silva', shortName: 'Lula', party: 'PT', number: 13, color: '#DC2626', votes: 953040, percentage: 41.8 }
        ]
      },
      {
        id: 'am',
        name: 'Amazonas',
        ufOrCode: 'AM',
        type: 'ESTADO',
        region: 'Norte',
        flagOrIcon: '🏞️',
        totalizedSectionsPct: 100.0,
        totalValidVotes: 2080000,
        nullVotes: 58000,
        blankVotes: 34000,
        abstentions: 520000,
        votersEligible: 2692000,
        candidates: [
          { id: 'lula', name: 'Luiz Inácio Lula da Silva', shortName: 'Lula', party: 'PT', number: 13, color: '#DC2626', votes: 1069120, percentage: 51.4 },
          { id: 'bolsonaro', name: 'Flávio Bolsonaro', shortName: 'Flávio Bolsonaro', party: 'PL', number: 22, color: '#2563EB', votes: 1010880, percentage: 48.6 }
        ]
      },
      {
        id: 'rn',
        name: 'Rio Grande do Norte',
        ufOrCode: 'RN',
        type: 'ESTADO',
        region: 'Nordeste',
        flagOrIcon: '☀️',
        totalizedSectionsPct: 100.0,
        totalValidVotes: 2050000,
        nullVotes: 53000,
        blankVotes: 33000,
        abstentions: 460000,
        votersEligible: 2596000,
        candidates: [
          { id: 'lula', name: 'Luiz Inácio Lula da Silva', shortName: 'Lula', party: 'PT', number: 13, color: '#DC2626', votes: 1338650, percentage: 65.3 },
          { id: 'bolsonaro', name: 'Flávio Bolsonaro', shortName: 'Flávio Bolsonaro', party: 'PL', number: 22, color: '#2563EB', votes: 711350, percentage: 34.7 }
        ]
      },
      {
        id: 'al',
        name: 'Alagoas',
        ufOrCode: 'AL',
        type: 'ESTADO',
        region: 'Nordeste',
        flagOrIcon: '🏖️',
        totalizedSectionsPct: 100.0,
        totalValidVotes: 1780000,
        nullVotes: 51000,
        blankVotes: 33000,
        abstentions: 500000,
        votersEligible: 2364000,
        candidates: [
          { id: 'lula', name: 'Luiz Inácio Lula da Silva', shortName: 'Lula', party: 'PT', number: 13, color: '#DC2626', votes: 1046640, percentage: 58.8 },
          { id: 'bolsonaro', name: 'Flávio Bolsonaro', shortName: 'Flávio Bolsonaro', party: 'PL', number: 22, color: '#2563EB', votes: 733360, percentage: 41.2 }
        ]
      },
      {
        id: 'pi',
        name: 'Piauí',
        ufOrCode: 'PI',
        type: 'ESTADO',
        region: 'Nordeste',
        flagOrIcon: '🌵',
        totalizedSectionsPct: 100.0,
        totalValidVotes: 1980000,
        nullVotes: 44000,
        blankVotes: 26000,
        abstentions: 460000,
        votersEligible: 2510000,
        candidates: [
          { id: 'lula', name: 'Luiz Inácio Lula da Silva', shortName: 'Lula', party: 'PT', number: 13, color: '#DC2626', votes: 1469160, percentage: 74.2 },
          { id: 'bolsonaro', name: 'Flávio Bolsonaro', shortName: 'Flávio Bolsonaro', party: 'PL', number: 22, color: '#2563EB', votes: 510840, percentage: 25.8 }
        ]
      },
      {
        id: 'mt',
        name: 'Mato Grosso',
        ufOrCode: 'MT',
        type: 'ESTADO',
        region: 'Centro-Oeste',
        flagOrIcon: '🐆',
        totalizedSectionsPct: 100.0,
        totalValidVotes: 1880000,
        nullVotes: 430000,
        blankVotes: 31000,
        abstentions: 560000,
        votersEligible: 2514000,
        candidates: [
          { id: 'bolsonaro', name: 'Flávio Bolsonaro', shortName: 'Flávio Bolsonaro', party: 'PL', number: 22, color: '#2563EB', votes: 1225760, percentage: 65.2 },
          { id: 'lula', name: 'Luiz Inácio Lula da Silva', shortName: 'Lula', party: 'PT', number: 13, color: '#DC2626', votes: 654240, percentage: 34.8 }
        ]
      },
      {
        id: 'ms',
        name: 'Mato Grosso do Sul',
        ufOrCode: 'MS',
        type: 'ESTADO',
        region: 'Centro-Oeste',
        flagOrIcon: '🌾',
        totalizedSectionsPct: 100.0,
        totalValidVotes: 1520000,
        nullVotes: 40000,
        blankVotes: 25000,
        abstentions: 450000,
        votersEligible: 2035000,
        candidates: [
          { id: 'bolsonaro', name: 'Flávio Bolsonaro', shortName: 'Flávio Bolsonaro', party: 'PL', number: 22, color: '#2563EB', votes: 907440, percentage: 59.7 },
          { id: 'lula', name: 'Luiz Inácio Lula da Silva', shortName: 'Lula', party: 'PT', number: 13, color: '#DC2626', votes: 612560, percentage: 40.3 }
        ]
      },
      {
        id: 'se',
        name: 'Sergipe',
        ufOrCode: 'SE',
        type: 'ESTADO',
        region: 'Nordeste',
        flagOrIcon: '⛵',
        totalizedSectionsPct: 100.0,
        totalValidVotes: 1310000,
        nullVotes: 40000,
        blankVotes: 23000,
        abstentions: 330000,
        votersEligible: 1703000,
        candidates: [
          { id: 'lula', name: 'Luiz Inácio Lula da Silva', shortName: 'Lula', party: 'PT', number: 13, color: '#DC2626', votes: 839710, percentage: 64.1 },
          { id: 'bolsonaro', name: 'Flávio Bolsonaro', shortName: 'Flávio Bolsonaro', party: 'PL', number: 22, color: '#2563EB', votes: 470290, percentage: 35.9 }
        ]
      },
      {
        id: 'ro',
        name: 'Rondônia',
        ufOrCode: 'RO',
        type: 'ESTADO',
        region: 'Norte',
        flagOrIcon: '🌲',
        totalizedSectionsPct: 100.0,
        totalValidVotes: 920000,
        nullVotes: 25000,
        blankVotes: 17000,
        abstentions: 290000,
        votersEligible: 1252000,
        candidates: [
          { id: 'bolsonaro', name: 'Flávio Bolsonaro', shortName: 'Flávio Bolsonaro', party: 'PL', number: 22, color: '#2563EB', votes: 651360, percentage: 70.8 },
          { id: 'lula', name: 'Luiz Inácio Lula da Silva', shortName: 'Lula', party: 'PT', number: 13, color: '#DC2626', votes: 268640, percentage: 29.2 }
        ]
      },
      {
        id: 'to',
        name: 'Tocantins',
        ufOrCode: 'TO',
        type: 'ESTADO',
        region: 'Norte',
        flagOrIcon: '🌻',
        totalizedSectionsPct: 100.0,
        totalValidVotes: 850000,
        nullVotes: 20000,
        blankVotes: 12000,
        abstentions: 230000,
        votersEligible: 1112000,
        candidates: [
          { id: 'lula', name: 'Luiz Inácio Lula da Silva', shortName: 'Lula', party: 'PT', number: 13, color: '#DC2626', votes: 438600, percentage: 51.6 },
          { id: 'bolsonaro', name: 'Flávio Bolsonaro', shortName: 'Flávio Bolsonaro', party: 'PL', number: 22, color: '#2563EB', votes: 411400, percentage: 48.4 }
        ]
      },
      {
        id: 'ac',
        name: 'Acre',
        ufOrCode: 'AC',
        type: 'ESTADO',
        region: 'Norte',
        flagOrIcon: '⭐',
        totalizedSectionsPct: 100.0,
        totalValidVotes: 440000,
        nullVotes: 12000,
        blankVotes: 8000,
        abstentions: 140000,
        votersEligible: 600000,
        candidates: [
          { id: 'bolsonaro', name: 'Flávio Bolsonaro', shortName: 'Flávio Bolsonaro', party: 'PL', number: 22, color: '#2563EB', votes: 310200, percentage: 70.5 },
          { id: 'lula', name: 'Luiz Inácio Lula da Silva', shortName: 'Lula', party: 'PT', number: 13, color: '#DC2626', votes: 129800, percentage: 29.5 }
        ]
      },
      {
        id: 'ap',
        name: 'Amapá',
        ufOrCode: 'AP',
        type: 'ESTADO',
        region: 'Norte',
        flagOrIcon: '🌴',
        totalizedSectionsPct: 100.0,
        totalValidVotes: 430000,
        nullVotes: 11000,
        blankVotes: 7000,
        abstentions: 115000,
        votersEligible: 563000,
        candidates: [
          { id: 'lula', name: 'Luiz Inácio Lula da Silva', shortName: 'Lula', party: 'PT', number: 13, color: '#DC2626', votes: 230480, percentage: 53.6 },
          { id: 'bolsonaro', name: 'Flávio Bolsonaro', shortName: 'Flávio Bolsonaro', party: 'PL', number: 22, color: '#2563EB', votes: 199520, percentage: 46.4 }
        ]
      },
      {
        id: 'rr',
        name: 'Roraima',
        ufOrCode: 'RR',
        type: 'ESTADO',
        region: 'Norte',
        flagOrIcon: '🏔️',
        totalizedSectionsPct: 100.0,
        totalValidVotes: 310000,
        nullVotes: 8000,
        blankVotes: 5000,
        abstentions: 60000,
        votersEligible: 383000,
        candidates: [
          { id: 'bolsonaro', name: 'Flávio Bolsonaro', shortName: 'Flávio Bolsonaro', party: 'PL', number: 22, color: '#2563EB', votes: 236840, percentage: 76.4 },
          { id: 'lula', name: 'Luiz Inácio Lula da Silva', shortName: 'Lula', party: 'PT', number: 13, color: '#DC2626', votes: 73160, percentage: 23.6 }
        ]
      }
    ]
  },
  turno1: {
    turnNumber: 1,
    status: 'ELEIÇÃO DEFINIDA',
    totalizedSectionsPct: 100.0,
    totalSections: 472078,
    totalizedSections: 472078,
    totalValidVotes: 122100000,
    nullVotes: 3610000,
    blankVotes: 2040000,
    abstentions: 32300000,
    votersEligible: 161350000,
    nationalCandidates: [
      { id: 'lula', name: 'Luiz Inácio Lula da Silva', shortName: 'Lula', party: 'PT', number: 13, color: '#DC2626', votes: 59218500, percentage: 48.5, status: '2º Turno' },
      { id: 'bolsonaro', name: 'Flávio Bolsonaro', shortName: 'Flávio Bolsonaro', party: 'PL', number: 22, color: '#2563EB', votes: 52869300, percentage: 43.3, status: '2º Turno' },
      { id: 'tebet', name: 'Simone Tebet', shortName: 'Simone Tebet', party: 'MDB', number: 15, color: '#059669', votes: 5006100, percentage: 4.1, status: 'Não eleito' },
      { id: 'ciro', name: 'Ciro Gomes', shortName: 'Ciro Gomes', party: 'PDT', number: 12, color: '#D97706', votes: 3540900, percentage: 2.9, status: 'Não eleito' },
      { id: 'outros', name: 'Outros Candidatos', shortName: 'Outros', party: 'Diversos', number: 0, color: '#6B7280', votes: 1465200, percentage: 1.2, status: 'Não eleito' }
    ],
    locations: [
      {
        id: 'zz-exterior',
        name: 'Exterior (Zona ZZ - Todos os Países)',
        ufOrCode: 'ZZ',
        type: 'EXTERIOR',
        region: 'Exterior',
        flagOrIcon: '🌐',
        totalizedSectionsPct: 100.0,
        totalValidVotes: 308000,
        nullVotes: 11800,
        blankVotes: 8200,
        abstentions: 381300,
        votersEligible: 709300,
        candidates: [
          { id: 'lula', name: 'Luiz Inácio Lula da Silva', shortName: 'Lula', party: 'PT', number: 13, color: '#DC2626', votes: 144444, percentage: 46.9 },
          { id: 'bolsonaro', name: 'Flávio Bolsonaro', shortName: 'Flávio Bolsonaro', party: 'PL', number: 22, color: '#2563EB', votes: 127820, percentage: 41.5 },
          { id: 'tebet', name: 'Simone Tebet', shortName: 'Simone Tebet', party: 'MDB', number: 15, color: '#059669', votes: 15400, percentage: 5.0 },
          { id: 'ciro', name: 'Ciro Gomes', shortName: 'Ciro Gomes', party: 'PDT', number: 12, color: '#D97706', votes: 13552, percentage: 4.4 },
          { id: 'outros', name: 'Outros', shortName: 'Outros', party: 'Div', number: 0, color: '#6B7280', votes: 6784, percentage: 2.2 }
        ]
      },
      {
        id: 'sp',
        name: 'São Paulo',
        ufOrCode: 'SP',
        type: 'ESTADO',
        region: 'Sudeste',
        flagOrIcon: '🏙️',
        totalizedSectionsPct: 100.0,
        totalValidVotes: 25480000,
        nullVotes: 910000,
        blankVotes: 490000,
        abstentions: 6330000,
        votersEligible: 33210000,
        candidates: [
          { id: 'bolsonaro', name: 'Flávio Bolsonaro', shortName: 'Flávio Bolsonaro', party: 'PL', number: 22, color: '#2563EB', votes: 12281360, percentage: 48.2 },
          { id: 'lula', name: 'Luiz Inácio Lula da Silva', shortName: 'Lula', party: 'PT', number: 13, color: '#DC2626', votes: 10370360, percentage: 40.7 },
          { id: 'tebet', name: 'Simone Tebet', shortName: 'Simone Tebet', party: 'MDB', number: 15, color: '#059669', votes: 1579760, percentage: 6.2 },
          { id: 'ciro', name: 'Ciro Gomes', shortName: 'Ciro Gomes', party: 'PDT', number: 12, color: '#D97706', votes: 866320, percentage: 3.4 },
          { id: 'outros', name: 'Outros', shortName: 'Outros', party: 'Div', number: 0, color: '#6B7280', votes: 382200, percentage: 1.5 }
        ]
      }
    ]
  }
};
