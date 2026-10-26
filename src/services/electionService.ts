/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import {
  PresidentialElectionData,
  ApiResponse,
  FetchStatus,
  DataProvenance,
  TseSnapshotMetadata
} from '../types/election.js';
import { initialPresidentialData } from '../data/presidentialData.js';
import { parseTseOfficialJson, TseRawJson } from '../utils/tseParser.js';
import * as fs from 'fs';
import * as path from 'path';
import * as crypto from 'crypto';

const SCOPED_CACHE_DIR = path.join('/tmp', 'tse_scoped_cache_v10');
const SNAPSHOTS_LEDGER_FILE = path.join(SCOPED_CACHE_DIR, 'snapshots_ledger.json');

// Ensure cache directory exists
try {
  if (!fs.existsSync(SCOPED_CACHE_DIR)) {
    fs.mkdirSync(SCOPED_CACHE_DIR, { recursive: true });
  }
} catch (err) {
  console.warn('Erro ao criar diretório de cache do TSE:', err);
}

// Whitelisted scopes and official TSE base URL
export const ALLOWED_SCOPES = [
  'BR', 'ZZ',
  'AC', 'AL', 'AP', 'AM', 'BA', 'CE', 'DF', 'ES', 'GO',
  'MA', 'MT', 'MS', 'MG', 'PA', 'PB', 'PR', 'PE', 'PI',
  'RJ', 'RN', 'RS', 'RO', 'RR', 'SC', 'SP', 'SE', 'TO'
] as const;

export type TseScope = typeof ALLOWED_SCOPES[number];

// Official TSE 2026 Election Codes
// 6257: Eleição Federal 2026 - 1º Turno (Presidente)
// 6258: Eleição Federal 2026 - 2º Turno (Presidente)
export const OFFICIAL_ELECTION_CODE_T1_2026 = '6257';
export const OFFICIAL_ELECTION_CODE_T2_2026 = '6258';

export const TSE_CONFIG_URL = 'https://resultados.tse.jus.br/oficial/ele2026/config/ele2026-config.json';

interface ActiveElectionConfig {
  discoveredAt: string;
  codeTurno1: string;
  codeTurno2: string;
  source: 'TSE_OFFICIAL_CONFIG' | 'VALIDATED_FALLBACK';
}

let activeConfigCache: ActiveElectionConfig | null = null;

/**
 * Reads official TSE election configuration if accessible,
 * with explicit fallback to 2026 federal codes (6257 / 6258).
 */
export async function resolveActiveElectionConfig(): Promise<ActiveElectionConfig> {
  if (activeConfigCache) {
    return activeConfigCache;
  }

  try {
    const response = await fetch(TSE_CONFIG_URL, {
      method: 'GET',
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
        'Accept': 'application/json, text/plain, */*'
      },
      redirect: 'error',
      signal: AbortSignal.timeout(5000)
    });

    if (response.ok) {
      const text = await response.text();
      const json = JSON.parse(text);

      // Extract active election code from official configuration if published
      const t1Code = json?.eleicoes?.find((e: any) => e.t === '1' && e.carag === '1')?.cd || OFFICIAL_ELECTION_CODE_T1_2026;
      const t2Code = json?.eleicoes?.find((e: any) => e.t === '2' && e.carag === '1')?.cd || OFFICIAL_ELECTION_CODE_T2_2026;

      activeConfigCache = {
        discoveredAt: new Date().toISOString(),
        codeTurno1: String(t1Code),
        codeTurno2: String(t2Code),
        source: 'TSE_OFFICIAL_CONFIG'
      };
      return activeConfigCache;
    }
  } catch (err) {
    // Config fetch error is expected ahead of election feed publication
  }

  activeConfigCache = {
    discoveredAt: new Date().toISOString(),
    codeTurno1: OFFICIAL_ELECTION_CODE_T1_2026,
    codeTurno2: OFFICIAL_ELECTION_CODE_T2_2026,
    source: 'VALIDATED_FALLBACK'
  };
  return activeConfigCache;
}

/**
 * Builds candidate URLs for the exact scope, election code, and turn
 */
function buildOfficialTseUrls(scope: TseScope, turn: 1 | 2, electionCode: string): string[] {
  const scopeLower = scope.toLowerCase();
  return [
    `https://resultados.tse.jus.br/oficial/ele2026/${electionCode}/dados/${scopeLower}/${scopeLower}-c0001-e00${electionCode}-r.json`,
    `https://resultados.tse.jus.br/oficial/ele2026/${electionCode}/dados-simplificados/${scopeLower}/${scopeLower}-c0001-e00${electionCode}-r.json`
  ];
}

interface ScopedCacheEntry {
  cacheKey: string; // e.g. "6258_t2_BR"
  electionCode: string;
  turn: 1 | 2;
  scope: string;
  data: PresidentialElectionData;
  contentHash: string;
  lastSuccessfulFetchAt: string | null;
  lastAttemptedFetchAt: string;
}

// Memory cache sharded strictly by query key (Issue 4: Never share cache across scopes/turns)
const memoryCacheMap = new Map<string, ScopedCacheEntry>();

function getCacheFilePath(key: string): string {
  return path.join(SCOPED_CACHE_DIR, `cache_${key}.json`);
}

function loadScopedCache(key: string, electionCode: string, turn: 1 | 2, scope: string): ScopedCacheEntry {
  const inMemory = memoryCacheMap.get(key);
  if (inMemory) return inMemory;

  const filePath = getCacheFilePath(key);
  try {
    if (fs.existsSync(filePath)) {
      const raw = fs.readFileSync(filePath, 'utf8');
      const parsed = JSON.parse(raw);
      if (parsed && parsed.data && parsed.scope === scope && parsed.turn === turn) {
        memoryCacheMap.set(key, parsed);
        return parsed;
      }
    }
  } catch (err) {
    console.warn(`Erro ao carregar cache para ${key}:`, err);
  }

  // Create isolated baseline specifically for this scope and turn
  const baselineHash = crypto.createHash('sha256').update(key).digest('hex');
  const isolatedData: PresidentialElectionData = JSON.parse(JSON.stringify(initialPresidentialData));
  isolatedData.audit.codigoAbrangencia = scope;
  isolatedData.audit.codigoEleicao = electionCode;

  const baseline: ScopedCacheEntry = {
    cacheKey: key,
    electionCode,
    turn,
    scope,
    data: isolatedData,
    contentHash: baselineHash,
    lastSuccessfulFetchAt: null,
    lastAttemptedFetchAt: new Date().toISOString()
  };

  memoryCacheMap.set(key, baseline);
  return baseline;
}

function saveScopedCache(entry: ScopedCacheEntry) {
  memoryCacheMap.set(entry.cacheKey, entry);
  const filePath = getCacheFilePath(entry.cacheKey);
  try {
    fs.writeFileSync(filePath, JSON.stringify(entry), 'utf8');
  } catch (err) {
    console.warn(`Erro ao salvar cache em disco para ${entry.cacheKey}:`, err);
  }
}

/**
 * Snapshots Ledger Persistence (Issue 6)
 */
function recordSnapshot(metadata: TseSnapshotMetadata) {
  try {
    let ledger: TseSnapshotMetadata[] = [];
    if (fs.existsSync(SNAPSHOTS_LEDGER_FILE)) {
      const raw = fs.readFileSync(SNAPSHOTS_LEDGER_FILE, 'utf8');
      ledger = JSON.parse(raw);
    }
    ledger.unshift(metadata);
    // Keep last 50 snapshots
    if (ledger.length > 50) ledger = ledger.slice(0, 50);
    fs.writeFileSync(SNAPSHOTS_LEDGER_FILE, JSON.stringify(ledger, null, 2), 'utf8');
  } catch (err) {
    console.warn('Erro ao registrar snapshot de auditoria:', err);
  }
}

export function getSnapshotsLedger(): TseSnapshotMetadata[] {
  try {
    if (fs.existsSync(SNAPSHOTS_LEDGER_FILE)) {
      const raw = fs.readFileSync(SNAPSHOTS_LEDGER_FILE, 'utf8');
      return JSON.parse(raw);
    }
  } catch (err) {
    console.warn('Erro ao ler ledger de snapshots:', err);
  }
  return [];
}

async function fetchTseEndpointSecurely(url: string): Promise<{ ok: boolean; status: number; text: string; error?: string }> {
  try {
    const parsed = new URL(url);
    if (parsed.protocol !== 'https:') {
      return { ok: false, status: 400, text: '', error: 'Protocolo inválido: Somente HTTPS é permitido.' };
    }
    if (parsed.hostname !== 'resultados.tse.jus.br') {
      return { ok: false, status: 400, text: '', error: 'Destino rejeitado: Somente resultados.tse.jus.br é permitido.' };
    }

    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
        'Accept': 'application/json, text/plain, */*',
        'Accept-Language': 'pt-BR,pt;q=0.9,en-US;q=0.8'
      },
      redirect: 'error',
      signal: AbortSignal.timeout(8000)
    });

    if (response.ok) {
      const text = await response.text();
      return { ok: true, status: response.status, text };
    } else {
      return { ok: false, status: response.status, text: '', error: `HTTP ${response.status}: ${response.statusText}` };
    }
  } catch (err: any) {
    return { ok: false, status: 0, text: '', error: err.message || 'Falha de conexão com os servidores do TSE' };
  }
}

/**
 * Service orchestrator for fetching TSE official 2026 data.
 * Solves:
 * - P0: Scoped cache isolation (key: ${electionCode}_t${turn}_${scope})
 * - P0: Strict election code & scope validation
 * - P1: Configuration-driven election codes
 * - P1: Exact scope matching within abr[]
 * - P1: Explicit requestSucceeded, dataAvailable, dataIsOfficial
 * - P2: Snapshot history recording
 */
export async function getOrFetchElectionData(params?: {
  scope?: string;
  turn?: 1 | 2;
}): Promise<ApiResponse> {
  const lastAttemptedFetchAt = new Date().toISOString();

  // Validate scope against strict whitelist
  const requestedScope = (params?.scope || 'BR').toUpperCase();
  const validScope: TseScope = ALLOWED_SCOPES.includes(requestedScope as TseScope)
    ? (requestedScope as TseScope)
    : 'BR';

  const turn: 1 | 2 = params?.turn === 1 ? 1 : 2;

  // 1. Resolve official election code from TSE configuration (P1)
  const electionConfig = await resolveActiveElectionConfig();
  const electionCode = turn === 1 ? electionConfig.codeTurno1 : electionConfig.codeTurno2;

  // 2. Load strictly scoped cache (P0)
  const cacheKey = `${electionCode}_t${turn}_${validScope}`;
  const scopedCache = loadScopedCache(cacheKey, electionCode, turn, validScope);
  scopedCache.lastAttemptedFetchAt = lastAttemptedFetchAt;

  let requestSucceeded = false;
  let fetchStatus: FetchStatus = 'CACHE_FALLBACK';
  let isLive = false;
  let fetchError: string | null = null;
  let provenance: DataProvenance = scopedCache.data.audit?.provenance || 'DEMONSTRATIVE_BASELINE';

  const candidateUrls = buildOfficialTseUrls(validScope, turn, electionCode);

  for (const officialUrl of candidateUrls) {
    const networkResult = await fetchTseEndpointSecurely(officialUrl);

    if (networkResult.ok && networkResult.text) {
      try {
        const rawHash = crypto.createHash('sha256').update(networkResult.text).digest('hex');
        const rawJson: TseRawJson = JSON.parse(networkResult.text);

        // Strict 2026 Parse: validates expectedTurn, expectedScope, and expectedElectionCode!
        const parsedResult = parseTseOfficialJson(rawJson, {
          expectedTurn: turn,
          expectedScope: validScope,
          expectedElectionCode: electionCode,
          sourceVerified: true,
          provenance: 'OFFICIAL_TSE_LIVE',
          sourceUrl: officialUrl,
          rawContentHash: rawHash,
          existingData: scopedCache.data
        });

        if (parsedResult.success && parsedResult.data) {
          requestSucceeded = true;
          isLive = true;
          provenance = 'OFFICIAL_TSE_LIVE';
          scopedCache.lastSuccessfulFetchAt = lastAttemptedFetchAt;

          if (rawHash !== scopedCache.contentHash) {
            fetchStatus = 'LIVE_UPDATED';
            scopedCache.contentHash = rawHash;
            scopedCache.data = parsedResult.data;
            saveScopedCache(scopedCache);

            // Record snapshot in persistent ledger (P2)
            const activeRound = turn === 2 ? parsedResult.data.turno2 : parsedResult.data.turno1;
            recordSnapshot({
              snapshotId: `${cacheKey}_${Date.now()}`,
              electionCode,
              turn,
              scope: validScope,
              dataHoraGeracaoTse: parsedResult.data.audit.dataHoraGeracaoTse,
              retrievedAt: lastAttemptedFetchAt,
              contentHash: rawHash,
              totalValidVotes: activeRound.totalValidVotes
            });
          } else {
            fetchStatus = 'LIVE_UNCHANGED';
          }
          fetchError = null;
          break;
        } else {
          fetchError = parsedResult.errors?.join('; ') || 'Formato de resposta incompatível com o leiaute do TSE.';
        }
      } catch (parseErr: any) {
        fetchError = `Falha ao interpretar resposta do TSE: ${parseErr.message}`;
      }
    } else {
      fetchError = networkResult.error || `Servidor do TSE indisponível (HTTP ${networkResult.status}).`;
    }
  }

  if (!isLive) {
    fetchStatus = fetchError ? 'FETCH_ERROR' : 'CACHE_FALLBACK';
    if (scopedCache.data.audit.sourceVerified) {
      provenance = 'OFFICIAL_TSE_CACHE';
    } else {
      provenance = scopedCache.data.audit.provenance;
    }
  }

  const dataIsOfficial = provenance === 'OFFICIAL_TSE_LIVE' || provenance === 'OFFICIAL_TSE_CACHE';
  const isStale = !isLive && dataIsOfficial;

  // Calculate data age in seconds if timestamp exists
  let dataAgeSeconds: number | null = null;
  if (scopedCache.lastSuccessfulFetchAt) {
    dataAgeSeconds = Math.round((Date.now() - new Date(scopedCache.lastSuccessfulFetchAt).getTime()) / 1000);
  }

  // Check if data is genuinely available (non-empty candidates and valid votes)
  const activeRound = turn === 2 ? scopedCache.data.turno2 : scopedCache.data.turno1;
  const dataAvailable = activeRound.totalValidVotes !== null && activeRound.totalValidVotes > 0;

  return {
    success: requestSucceeded || dataIsOfficial,
    requestSucceeded,
    dataAvailable,
    dataIsOfficial,
    status: fetchStatus,
    provenance,
    scope: validScope,
    turn,
    isLive,
    isStale,
    dataAgeSeconds,
    fetchError,
    lastSuccessfulFetchAt: scopedCache.lastSuccessfulFetchAt,
    lastAttemptedFetchAt,
    dataHoraGeracaoTse: scopedCache.data.audit.dataHoraGeracaoTse || null,
    presidentialData: scopedCache.data,
    snapshots: getSnapshotsLedger()
  };
}
