/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type DataProvenance =
  | 'OFFICIAL_TSE_LIVE'
  | 'OFFICIAL_TSE_CACHE'
  | 'MANUAL_IMPORT_UNVERIFIED'
  | 'DEMONSTRATIVE_BASELINE';

export interface ProvenanceAudit {
  provenance: DataProvenance;
  schemaValid: boolean;
  sourceVerified: boolean; // True ONLY if fetched from official server-configured TSE endpoint
  officiallyPublished: boolean; // True if dg/hg/tse headers are present and validated
  sourceUrl?: string;
  dataHoraGeracaoTse?: string; // from dg + hg
  codigoEleicao?: string; // from ele
  codigoAbrangencia?: string; // BR, ZZ, SP, etc.
  contentHash?: string; // sha256 of raw received content
  importedAt: string;
  validationWarnings?: string[];
}

export interface CandidateResult {
  id: string;
  name: string;
  shortName: string;
  party: string;
  number: number;
  color: string;
  votes: number | null;
  percentage: number | null;
  status?: string; // Official TSE status (e.g., 'Eleito', '2º Turno', 'Não eleito')
}

export interface LocationResult {
  id: string;
  name: string;
  ufOrCode: string;
  type: 'ESTADO' | 'EXTERIOR' | 'BRASIL';
  region: 'Norte' | 'Nordeste' | 'Centro-Oeste' | 'Sudeste' | 'Sul' | 'Exterior';
  flagOrIcon: string;
  totalizedSectionsPct: number | null;
  totalSections: number | null;
  totalizedSections: number | null;
  totalValidVotes: number | null;
  nullVotes: number | null;
  blankVotes: number | null;
  abstentions: number | null;
  votersEligible: number | null;
  candidates: CandidateResult[];
  statusDescription: string;
  isImported: boolean;
}

export interface RoundData {
  turnNumber: 1 | 2;
  status: 'ELEIÇÃO DEFINIDA' | 'TOTALIZADO' | 'EM APURAÇÃO' | 'AGUARDANDO';
  totalizedSectionsPct: number | null;
  totalSections: number | null;
  totalizedSections: number | null;
  totalValidVotes: number | null;
  nullVotes: number | null;
  blankVotes: number | null;
  abstentions: number | null;
  votersEligible: number | null;
  nationalCandidates: CandidateResult[];
  locations: LocationResult[];
  integrityCheck?: {
    validVotesSumUfs: number;
    matchesNational: boolean;
    difference: number;
  };
}

export interface TseSnapshotMetadata {
  snapshotId: string;
  electionCode: string;
  turn: 1 | 2;
  scope: string;
  dataHoraGeracaoTse?: string;
  retrievedAt: string;
  contentHash: string;
  totalValidVotes: number | null;
}

export interface PresidentialElectionData {
  source: string;
  lastFetchedAt: string;
  dataUpdatedAt: string;
  audit: ProvenanceAudit;
  turno1: RoundData;
  turno2: RoundData;
  keyHighlights: string[];
}

export type FetchStatus = 'LIVE_UPDATED' | 'LIVE_UNCHANGED' | 'CACHE_FALLBACK' | 'FETCH_ERROR';

export interface ApiResponse {
  success: boolean; // Backward compatibility
  requestSucceeded: boolean; // True ONLY if current HTTP request succeeded
  dataAvailable: boolean; // True if valid data is present for requested scope
  dataIsOfficial: boolean; // True if data has official provenance
  status: FetchStatus;
  provenance: DataProvenance;
  scope: string; // 'BR', 'ZZ', 'SP', etc.
  turn: 1 | 2;
  isLive: boolean;
  isStale: boolean;
  dataAgeSeconds: number | null;
  fetchError: string | null;
  lastSuccessfulFetchAt: string | null;
  lastAttemptedFetchAt: string;
  dataHoraGeracaoTse: string | null;
  presidentialData: PresidentialElectionData | null;
  snapshots?: TseSnapshotMetadata[];
}
