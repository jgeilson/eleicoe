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

const SCOPED_CACHE_DIR = path.join('/tmp', 'tse_scoped_cache_v11');
const SNAPSHOTS_LEDGER_FILE = path.join(SCOPED_CACHE_DIR, 'snapshots_ledger_v11.json');

try {
  if (!fs.existsSync(SCOPED_CACHE_DIR)) {
    fs.mkdirSync(SCOPED_CACHE_DIR, { recursive: true });
  }
} catch (err) {
  console.warn('Erro ao criar diretório de cache do TSE:', err);
}

// Whitelisted scopes (National BR, Exterior ZZ, and all 27 UFs)
export const ALLOWED_SCOPES = [
  'BR', 'ZZ',
  'AC', 'AL', 'AP', 'AM', 'BA', 'CE', 'DF', 'ES', 'GO',
  'MA', 'MT', 'MS', 'MG', 'PA', 'PB', 'PR', 'PE', 'PI',
  'RJ', 'RN', 'RS', 'RO', 'RR', 'SC', 'SP', 'SE', 'TO'
] as const;

export type TseScope = typeof ALLOWED_SCOPES[number];

// Official Documented Election Codes for 2026
// 6257: Eleição Ordinária Federal 2026 - 1º Turno (Presidente da República)
// 6258: Eleição Ordinária Federal 2026 - 2º Turno (Presidente da República)
export const OFFICIAL_ELECTION_CODE_T1_2026 = '6257';
export const OFFICIAL_ELECTION_CODE_T2_2026 = '6258';

// Official Catalog URL documented by TSE
export const TSE_CATALOG_URL = 'https://resultados.tse.jus.br/oficial/comum/config/ele-c.json';

export interface ActiveElectionConfig {
  discoveredAt: string;
  codeTurno1: string;
  codeTurno2: string;
  source: 'TSE_OFFICIAL_CONFIG' | 'VALIDATED_FALLBACK';
  details?: string;
}

let activeConfigCache: ActiveElectionConfig | null = null;

/**
 * P0: Consults and parses the official general catalog of elections (ele-c.json)
 * according to TSE specification.
 */
export async function resolveActiveElectionConfig(): Promise<ActiveElectionConfig> {
  if (activeConfigCache) {
    return activeConfigCache;
  }

  try {
    const response = await fetch(TSE_CATALOG_URL, {
      method: 'GET',
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
        'Accept': 'application/json, text/plain, */*'
      },
      redirect: 'error',
      signal: AbortSignal.timeout(6000)
    });

    if (response.ok) {
      const text = await response.text();
      const catalog = JSON.parse(text);

      let foundT1: string | null = null;
      let foundT2: string | null = null;

      // Navigate pleitos (pl) -> eleições (e)
      if (Array.isArray(catalog?.pl)) {
        for (const pleito of catalog.pl) {
          if (Array.isArray(pleito?.e)) {
            for (const eleicao of pleito.e) {
              const hasPresident = Array.isArray(eleicao?.car)
                ? eleicao.car.some((c: any) => String(c.cd) === '1')
                : eleicao?.tp === 'F' || eleicao?.tp === '1';

              if (hasPresident) {
                if (eleicao.t === '1' && !foundT1 && eleicao.cd) {
                  foundT1 = String(eleicao.cd);
                }
                if (eleicao.t === '2' && !foundT2 && eleicao.cd) {
                  foundT2 = String(eleicao.cd);
                }
              }
            }
          }
        }
      }

      if (foundT1 && foundT2) {
        activeConfigCache = {
          discoveredAt: new Date().toISOString(),
          codeTurno1: foundT1,
          codeTurno2: foundT2,
          source: 'TSE_OFFICIAL_CONFIG',
          details: `Configuração oficial do catálogo ele-c.json (1ºT: ${foundT1}, 2ºT: ${foundT2})`
        };
        return activeConfigCache;
      }
    }
  } catch (err: any) {
    // Expected when CDN has not yet published or during offline dev
  }

  // Explicit documented fallback - marked as VALIDATED_FALLBACK
  activeConfigCache = {
    discoveredAt: new Date().toISOString(),
    codeTurno1: OFFICIAL_ELECTION_CODE_T1_2026,
    codeTurno2: OFFICIAL_ELECTION_CODE_T2_2026,
    source: 'VALIDATED_FALLBACK',
    details: `Códigos oficiais documentados para 2026 (1ºT: ${OFFICIAL_ELECTION_CODE_T1_2026}, 2ºT: ${OFFICIAL_ELECTION_CODE_T2_2026})`
  };
  return activeConfigCache;
}

/**
 * P0: Builds the exact official documented URL for results:
 * Pattern: .../ele2026/${electionCode}/dados/${scopeLower}/${scopeLower}-c0001-e00${electionCode}-u.json
 * Suffix: -u.json (Totalização de cargo)
 */
export function buildDocumentedTseUrl(scope: TseScope, electionCode: string): string {
  const scopeLower = scope.toLowerCase();
  return `https://resultados.tse.jus.br/oficial/ele2026/${electionCode}/dados/${scopeLower}/${scopeLower}-c0001-e00${electionCode}-u.json`;
}

interface ScopedCacheEntry {
  cacheKey: string; // e.g. "6258_t2_BR"
  electionCode: string;
  turn: 1 | 2;
  scope: string;
  data: PresidentialElectionData;
  contentHash: string;
  lastSuccessfulFetchAt: string | null;
  lastContentChangeAt: string | null;
  lastAttemptedFetchAt: string;
}

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
    lastContentChangeAt: null,
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
 * P2: Full Snapshot Recording with Per-Scope Retention Policy
 */
function recordFullSnapshot(metadata: TseSnapshotMetadata) {
  try {
    let ledger: TseSnapshotMetadata[] = [];
    if (fs.existsSync(SNAPSHOTS_LEDGER_FILE)) {
      const raw = fs.readFileSync(SNAPSHOTS_LEDGER_FILE, 'utf8');
      ledger = JSON.parse(raw);
    }

    ledger.unshift(metadata);

    // Retention policy: keep up to 100 total snapshots, and at most 20 snapshots per scope
    const scopeCountMap: { [key: string]: number } = {};
    const filteredLedger = ledger.filter((snap) => {
      const key = `${snap.scope}_t${snap.turn}`;
      scopeCountMap[key] = (scopeCountMap[key] || 0) + 1;
      return scopeCountMap[key] <= 20;
    }).slice(0, 100);

    fs.writeFileSync(SNAPSHOTS_LEDGER_FILE, JSON.stringify(filteredLedger, null, 2), 'utf8');
  } catch (err) {
    console.warn('Erro ao registrar snapshot completo de auditoria:', err);
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
 */
export async function getOrFetchElectionData(params?: {
  scope?: string;
  turn?: 1 | 2;
}): Promise<ApiResponse> {
  const lastAttemptedFetchAt = new Date().toISOString();

  // P1: Strict validation of requested scope - REJECT invalid scopes, never silently substitute (Issue 7)
  const rawScope = (params?.scope || 'BR').toUpperCase();
  if (!(ALLOWED_SCOPES as readonly string[]).includes(rawScope)) {
    return {
      success: false,
      requestSucceeded: false,
      dataAvailable: false,
      dataIsOfficial: false,
      status: 'FETCH_ERROR',
      provenance: 'DEMONSTRATIVE_BASELINE',
      scope: rawScope,
      turn: params?.turn === 1 ? 1 : 2,
      isLive: false,
      isStale: false,
      dataAgeSeconds: null,
      fetchError: `Abrangência inválida: "${rawScope}". Escopos permitidos são [BR, ZZ, e as 27 UFs].`,
      lastSuccessfulFetchAt: null,
      lastContentChangeAt: null,
      lastAttemptedFetchAt,
      dataHoraGeracaoTse: null,
      presidentialData: null
    };
  }

  const validScope = rawScope as TseScope;
  const turn: 1 | 2 = params?.turn === 1 ? 1 : 2;

  // 1. Resolve official election code from TSE catalog (P0 & P1)
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

  // 3. Official Documented URL pattern (-u.json) - No speculative alternatives (P0)
  const officialDocumentedUrl = buildDocumentedTseUrl(validScope, electionCode);
  const networkResult = await fetchTseEndpointSecurely(officialDocumentedUrl);

  if (networkResult.ok && networkResult.text) {
    try {
      const rawHash = crypto.createHash('sha256').update(networkResult.text).digest('hex');
      const rawJson: TseRawJson = JSON.parse(networkResult.text);

      // Strict parse with mandatory expectedElectionCode & expectedScope
      const parsedResult = parseTseOfficialJson(rawJson, {
        expectedTurn: turn,
        expectedScope: validScope,
        expectedElectionCode: electionCode,
        sourceVerified: true,
        provenance: 'OFFICIAL_TSE_LIVE',
        sourceUrl: officialDocumentedUrl,
        rawContentHash: rawHash,
        configOrigin: electionConfig.source,
        existingData: scopedCache.data
      });

      if (parsedResult.success && parsedResult.data) {
        requestSucceeded = true;
        isLive = true;
        provenance = 'OFFICIAL_TSE_LIVE';
        scopedCache.lastSuccessfulFetchAt = lastAttemptedFetchAt;

        // P1: Check if content ACTUALLY changed to update lastContentChangeAt correctly
        if (rawHash !== scopedCache.contentHash) {
          fetchStatus = 'LIVE_UPDATED';
          scopedCache.contentHash = rawHash;
          scopedCache.lastContentChangeAt = lastAttemptedFetchAt;
          scopedCache.data = parsedResult.data;
          scopedCache.data.lastContentChangeAt = lastAttemptedFetchAt;
          saveScopedCache(scopedCache);

          // P2: Record full snapshot with candidate list and metrics
          const activeRound = turn === 2 ? parsedResult.data.turno2 : parsedResult.data.turno1;
          recordFullSnapshot({
            snapshotId: `${cacheKey}_${Date.now()}`,
            electionCode,
            turn,
            scope: validScope,
            dataHoraGeracaoTse: parsedResult.data.audit.dataHoraGeracaoTse,
            retrievedAt: lastAttemptedFetchAt,
            contentHash: rawHash,
            totalValidVotes: activeRound.totalValidVotes,
            totalizedSectionsPct: activeRound.totalizedSectionsPct,
            totalSections: activeRound.totalSections,
            totalizedSections: activeRound.totalizedSections,
            votersEligible: activeRound.votersEligible,
            abstentions: activeRound.abstentions,
            candidates: activeRound.nationalCandidates
          });
        } else {
          fetchStatus = 'LIVE_UNCHANGED';
        }
        fetchError = null;
      } else {
        fetchError = parsedResult.errors?.join('; ') || 'Formato de resposta incompatível com o leiaute oficial do TSE.';
      }
    } catch (parseErr: any) {
      fetchError = `Falha ao interpretar resposta do TSE: ${parseErr.message}`;
    }
  } else {
    fetchError = networkResult.error || `Servidor do TSE indisponível (HTTP ${networkResult.status}).`;
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

  // P1: Calculate dataAgeSeconds from lastContentChangeAt (or dataHoraGeracaoTse)
  let dataAgeSeconds: number | null = null;
  const timeBasis = scopedCache.lastContentChangeAt || scopedCache.lastSuccessfulFetchAt;
  if (timeBasis) {
    dataAgeSeconds = Math.round((Date.now() - new Date(timeBasis).getTime()) / 1000);
  }

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
    lastContentChangeAt: scopedCache.lastContentChangeAt,
    lastAttemptedFetchAt,
    dataHoraGeracaoTse: scopedCache.data.audit.dataHoraGeracaoTse || null,
    presidentialData: scopedCache.data,
    snapshots: getSnapshotsLedger()
  };
}
