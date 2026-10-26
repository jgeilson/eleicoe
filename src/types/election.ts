/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface CandidateResult {
  id: string;
  name: string;
  shortName: string;
  party: string;
  number: number;
  color: string;
  votes: number;
  percentage: number;
  status?: 'Eleito' | '2º Turno' | 'Não eleito' | 'Empate';
}

export interface LocationResult {
  id: string;
  name: string;
  ufOrCode: string;
  type: 'ESTADO' | 'EXTERIOR' | 'BRASIL';
  region: 'Norte' | 'Nordeste' | 'Centro-Oeste' | 'Sudeste' | 'Sul' | 'Exterior';
  flagOrIcon: string;
  totalizedSectionsPct: number;
  totalValidVotes: number;
  nullVotes: number;
  blankVotes: number;
  abstentions: number;
  votersEligible: number;
  candidates: CandidateResult[];
}

export interface RoundData {
  turnNumber: 1 | 2;
  status: 'ELEIÇÃO DEFINIDA' | 'EM APURAÇÃO' | 'AGUARDANDO';
  totalizedSectionsPct: number;
  totalSections: number;
  totalizedSections: number;
  totalValidVotes: number;
  nullVotes: number;
  blankVotes: number;
  abstentions: number;
  votersEligible: number;
  nationalCandidates: CandidateResult[];
  locations: LocationResult[];
}

export interface PresidentialElectionData {
  source: string;
  lastFetchedAt: string;
  dataUpdatedAt: string;
  isOfficialValidated?: boolean;
  isDemonstrative?: boolean;
  dataHoraGeracaoTse?: string;
  turno1: RoundData;
  turno2: RoundData;
  keyHighlights: string[];
}

export type FetchStatus = 'LIVE_UPDATED' | 'LIVE_UNCHANGED' | 'CACHE_FALLBACK';

export interface ApiResponse {
  success: boolean;
  status: FetchStatus;
  isLive: boolean;
  fetchError: string | null;
  lastFetchedAt: string;
  dataUpdatedAt: string | null;
  presidentialData?: PresidentialElectionData;
}
