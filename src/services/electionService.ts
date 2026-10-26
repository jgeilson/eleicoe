/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { PresidentialElectionData, ApiResponse, FetchStatus, DataProvenance } from '../types/election.js';
import { initialPresidentialData } from '../data/presidentialData.js';
import { parseTseOfficialJson, TseRawJson } from '../utils/tseParser.js';
import * as fs from 'fs';
import * as path from 'path';
import * as crypto from 'crypto';

const PERSISTENT_CACHE_FILE = path.join('/tmp', 'tse_clean_cache_v9.json');

// Whitelisted scopes and official TSE base URL
export const ALLOWED_SCOPES = [
  'BR', 'ZZ',
  'AC', 'AL', 'AP', 'AM', 'BA', 'CE', 'DF', 'ES', 'GO',
  'MA', 'MT', 'MS', 'MG', 'PA', 'PB', 'PR', 'PE', 'PI',
  'RJ', 'RN', 'RS', 'RO', 'RR', 'SC', 'SP', 'SE', 'TO'
] as const;

export type TseScope = typeof ALLOWED_SCOPES[number];

// Official TSE 2026 Election Codes
// 6257: Eleição Federal Ordinária 2026 - 1º Turno (Presidente da República)
// 6258: Eleição Federal Ordinária 2026 - 2º Turno (Presidente da República)
export const OFFICIAL_ELECTION_CODE_T1_2026 = '6257';
export const OFFICIAL_ELECTION_CODE_T2_2026 = '6258';

export const TSE_CONFIG_URL = 'https://resultados.tse.jus.br/oficial/ele2026/config/ele2026-config.json';

function getOfficialElectionCode(turn: 1 | 2): string {
  return turn === 1 ? OFFICIAL_ELECTION_CODE_T1_2026 : OFFICIAL_ELECTION_CODE_T2_2026;
}

/**
 * Builds official 2026 TSE URLs for full results and simplified results
 */
function buildOfficialTseUrls(scope: TseScope, turn: 1 | 2 = 2): string[] {
  const scopeLower = scope.toLowerCase();
  const eleCode = getOfficialElectionCode(turn);

  return [
    // 1. Leiaute completo de resultados 2026 (dados com 'abr' e 'cand')
    `https://resultados.tse.jus.br/oficial/ele2026/${eleCode}/dados/${scopeLower}/${scopeLower}-c0001-e00${eleCode}-r.json`,
    // 2. Leiaute simplificado 2026
    `https://resultados.tse.jus.br/oficial/ele2026/${eleCode}/dados-simplificados/${scopeLower}/${scopeLower}-c0001-e00${eleCode}-r.json`
  ];
}

interface CacheState {
  version: number;
  data: PresidentialElectionData;
  contentHash: string;
  lastSuccessfulFetchAt: string | null;
  lastAttemptedFetchAt: string;
  sourceScope: string;
}

let memoryCache: CacheState | null = null;

function loadPersistentCache(): CacheState {
  if (memoryCache) {
    return memoryCache;
  }

  try {
    if (fs.existsSync(PERSISTENT_CACHE_FILE)) {
      const raw = fs.readFileSync(PERSISTENT_CACHE_FILE, 'utf8');
      const parsed = JSON.parse(raw);
      if (parsed && parsed.data && parsed.contentHash) {
        memoryCache = parsed;
        return parsed;
      }
    }
  } catch (err) {
    console.warn('Erro ao carregar cache do TSE:', err);
  }

  const baselineHash = crypto.createHash('sha256').update(JSON.stringify(initialPresidentialData)).digest('hex');
  const baseline: CacheState = {
    version: 1,
    data: initialPresidentialData,
    contentHash: baselineHash,
    lastSuccessfulFetchAt: null,
    lastAttemptedFetchAt: new Date().toISOString(),
    sourceScope: 'BR'
  };

  memoryCache = baseline;
  savePersistentCache(baseline);
  return baseline;
}

function savePersistentCache(state: CacheState) {
  memoryCache = state;
  try {
    fs.writeFileSync(PERSISTENT_CACHE_FILE, JSON.stringify(state), 'utf8');
  } catch (err) {
    console.warn('Erro ao salvar cache em disco:', err);
  }
}

/**
 * Executes a strictly secured fetch to an official TSE endpoint.
 * Disallows arbitrary user URLs, prevents redirect following, enforces HTTPS and 8s timeout.
 */
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
      redirect: 'error', // PREVENTS SSRF redirect pivots
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
 * Attempts to discover active election configuration published by TSE
 */
export async function fetchTseElectionConfig(): Promise<{ success: boolean; config?: any; error?: string }> {
  const result = await fetchTseEndpointSecurely(TSE_CONFIG_URL);
  if (result.ok && result.text) {
    try {
      const json = JSON.parse(result.text);
      return { success: true, config: json };
    } catch (e: any) {
      return { success: false, error: e.message };
    }
  }
  return { success: false, error: result.error };
}

/**
 * Service orchestrator for fetching TSE official 2026 data with multi-scope support,
 * strict provenance attribution, and safe fallback.
 */
export async function getOrFetchElectionData(params?: {
  scope?: string;
  turn?: 1 | 2;
}): Promise<ApiResponse> {
  const lastAttemptedFetchAt = new Date().toISOString();

  // Validate scope against whitelist
  const requestedScope = (params?.scope || 'BR').toUpperCase();
  const validScope: TseScope = ALLOWED_SCOPES.includes(requestedScope as TseScope)
    ? (requestedScope as TseScope)
    : 'BR';

  const turn: 1 | 2 = params?.turn === 1 ? 1 : 2;
  const officialCandidateUrls = buildOfficialTseUrls(validScope, turn);

  const cache = loadPersistentCache();
  cache.lastAttemptedFetchAt = lastAttemptedFetchAt;

  let fetchStatus: FetchStatus = 'CACHE_FALLBACK';
  let isLive = false;
  let fetchError: string | null = null;
  let provenance: DataProvenance = cache.data.audit?.provenance || 'DEMONSTRATIVE_BASELINE';

  // Try candidate URLs in order (full results first, then simplified)
  for (const officialUrl of officialCandidateUrls) {
    const networkResult = await fetchTseEndpointSecurely(officialUrl);

    if (networkResult.ok && networkResult.text) {
      try {
        const rawHash = crypto.createHash('sha256').update(networkResult.text).digest('hex');
        const rawJson: TseRawJson = JSON.parse(networkResult.text);

        // Parse with strict TSE 2026 parser
        const parsedResult = parseTseOfficialJson(rawJson, {
          sourceVerified: true,
          provenance: 'OFFICIAL_TSE_LIVE',
          sourceUrl: officialUrl,
          rawContentHash: rawHash,
          existingData: cache.data
        });

        if (parsedResult.success && parsedResult.data) {
          isLive = true;
          provenance = 'OFFICIAL_TSE_LIVE';
          cache.lastSuccessfulFetchAt = lastAttemptedFetchAt;

          if (rawHash !== cache.contentHash) {
            fetchStatus = 'LIVE_UPDATED';
            cache.contentHash = rawHash;
            cache.version += 1;
            cache.data = parsedResult.data;
            cache.sourceScope = validScope;
            savePersistentCache(cache);
          } else {
            fetchStatus = 'LIVE_UNCHANGED';
          }
          fetchError = null;
          break; // Successfully loaded official data
        } else {
          fetchError = parsedResult.errors?.join('; ') || 'Formato de resposta incompatível com o leiaute TSE 2026.';
        }
      } catch (parseErr: any) {
        fetchError = `Falha ao interpretar resposta do TSE 2026: ${parseErr.message}`;
      }
    } else {
      fetchError = networkResult.error || `Servidor do TSE indisponível (HTTP ${networkResult.status}).`;
    }
  }

  // If live fetch failed, distinguish between official cached data vs demonstrative baseline
  if (!isLive) {
    fetchStatus = fetchError ? 'FETCH_ERROR' : 'CACHE_FALLBACK';
    if (cache.data.audit.sourceVerified) {
      provenance = 'OFFICIAL_TSE_CACHE';
    } else {
      provenance = cache.data.audit.provenance;
    }
  }

  const isStale = !isLive && provenance !== 'DEMONSTRATIVE_BASELINE';

  return {
    success: isLive || !!cache.data,
    status: fetchStatus,
    provenance,
    scope: validScope,
    isLive,
    isStale,
    fetchError,
    lastSuccessfulFetchAt: cache.lastSuccessfulFetchAt,
    lastAttemptedFetchAt,
    dataHoraGeracaoTse: cache.data.audit.dataHoraGeracaoTse || null,
    presidentialData: cache.data
  };
}
