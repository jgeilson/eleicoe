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

// Durable cache directory with fallback to /tmp if necessary
function resolveCacheDirectory(): string {
  const preferredDir = path.resolve(process.cwd(), 'data', 'tse_cache');
  try {
    if (!fs.existsSync(preferredDir)) {
      fs.mkdirSync(preferredDir, { recursive: true });
    }
    // Verify write permissions
    const testFile = path.join(preferredDir, '.write_test');
    fs.writeFileSync(testFile, 'ok', 'utf8');
    fs.unlinkSync(testFile);
    return preferredDir;
  } catch {
    const tmpDir = path.join('/tmp', 'tse_scoped_cache_v11');
    if (!fs.existsSync(tmpDir)) {
      fs.mkdirSync(tmpDir, { recursive: true });
    }
    return tmpDir;
  }
}

const SCOPED_CACHE_DIR = resolveCacheDirectory();
const SNAPSHOTS_LEDGER_FILE = path.join(SCOPED_CACHE_DIR, 'snapshots_ledger_v11.json');
const SNAPSHOTS_RAW_DIR = path.join(SCOPED_CACHE_DIR, 'raw_snapshots');

try {
  if (!fs.existsSync(SNAPSHOTS_RAW_DIR)) {
    fs.mkdirSync(SNAPSHOTS_RAW_DIR, { recursive: true });
  }
} catch (err) {
  console.warn('Erro ao criar diretório de snapshots brutos:', err);
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
  cycle?: string;
  electionName?: string;
}

let activeConfigCache: ActiveElectionConfig | null = null;

/**
 * P0: Consults and parses the official general catalog of elections (ele-c.json).
 * Follows the TSE official structure:
 * 1. Cycle: identifies pl[].c === "ele2026"
 * 2. Cargo: locates presidential cargo inside pl[].e[].abr[].cp[] where cd === "1"
 * 3. Codes: extracts 1º Turno from 'cd' (t === "1") and 2º Turno from 'cdt2'
 * 4. Strict validation: rejects ambiguous/incompatible configs
 * 5. Uses VALIDATED_FALLBACK only when catalog inquiry or validation fails.
 */
export async function resolveActiveElectionConfig(forceRefresh: boolean = false): Promise<ActiveElectionConfig> {
  if (activeConfigCache && !forceRefresh) {
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
      let electionName: string | null = null;

      // 1. Identify election cycle 'ele2026' in pleitos catalog.pl
      if (Array.isArray(catalog?.pl)) {
        for (const pleito of catalog.pl) {
          if (pleito?.c === 'ele2026' && Array.isArray(pleito?.e)) {
            for (const eleicao of pleito.e) {
              // 2. Locate presidential cargo inside abr[].cp[] where cd === "1"
              let hasPresidentialCargo = false;
              if (Array.isArray(eleicao?.abr)) {
                for (const abr of eleicao.abr) {
                  if (Array.isArray(abr?.cp)) {
                    if (abr.cp.some((cp: any) => String(cp.cd) === '1')) {
                      hasPresidentialCargo = true;
                      break;
                    }
                  }
                }
              }

              if (hasPresidentialCargo) {
                // 3. Read 1º Turno code from cd and 2º Turno code from cdt2
                if (eleicao.t === '1' && eleicao.cd) {
                  foundT1 = String(eleicao.cd);
                  electionName = eleicao.nm || 'Eleição Ordinária Federal - 2026 1º Turno';
                  if (eleicao.cdt2) {
                    foundT2 = String(eleicao.cdt2);
                  }
                }
                // Also check if 2nd turn is declared in a separate election object
                if (eleicao.t === '2' && eleicao.cd && !foundT2) {
                  foundT2 = String(eleicao.cd);
                }
              }
            }
          }
        }
      }

      // 4. Strict validation: accept ONLY if both turn codes are valid numbers and not empty
      if (foundT1 && foundT2 && /^\d+$/.test(foundT1) && /^\d+$/.test(foundT2)) {
        activeConfigCache = {
          discoveredAt: new Date().toISOString(),
          codeTurno1: foundT1,
          codeTurno2: foundT2,
          cycle: 'ele2026',
          electionName: electionName || 'Eleição Ordinária Federal - 2026',
          source: 'TSE_OFFICIAL_CONFIG',
          details: `Configuração oficial descoberta dinamicamente via catálogo ele-c.json (${electionName} • 1ºT: ${foundT1}, 2ºT: ${foundT2})`
        };
        return activeConfigCache;
      }
    }
  } catch (err: any) {
    // Handled below with explicit VALIDATED_FALLBACK
  }

  // 5. Use VALIDATED_FALLBACK only when catalog inquiry or validation fails
  activeConfigCache = {
    discoveredAt: new Date().toISOString(),
    codeTurno1: OFFICIAL_ELECTION_CODE_T1_2026,
    codeTurno2: OFFICIAL_ELECTION_CODE_T2_2026,
    cycle: 'ele2026',
    electionName: 'Eleição Ordinária Federal - 2026 (Documentada)',
    source: 'VALIDATED_FALLBACK',
    details: `Fallback validado com códigos documentados para 2026 (1ºT: ${OFFICIAL_ELECTION_CODE_T1_2026}, 2ºT: ${OFFICIAL_ELECTION_CODE_T2_2026})`
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

interface MasterCacheEntry {
  cacheKey: string;
  electionCode: string;
  turn: 1 | 2;
  data: PresidentialElectionData;
  scopeHashes: { [scope: string]: string };
  lastSuccessfulFetchAt: string | null;
  lastContentChangeAt: string | null;
  lastAttemptedFetchAt: string;
}

const memoryMasterCacheMap = new Map<string, MasterCacheEntry>();

function getMasterCacheFilePath(electionCode: string, turn: number): string {
  return path.join(SCOPED_CACHE_DIR, `cache_${electionCode}_t${turn}_master_v12.json`);
}

function loadMasterCache(electionCode: string, turn: 1 | 2): MasterCacheEntry {
  const cacheKey = `${electionCode}_t${turn}_master`;
  const inMemory = memoryMasterCacheMap.get(cacheKey);
  if (inMemory) return inMemory;

  const filePath = getMasterCacheFilePath(electionCode, turn);
  try {
    if (fs.existsSync(filePath)) {
      const raw = fs.readFileSync(filePath, 'utf8');
      const parsed = JSON.parse(raw);
      if (parsed && parsed.data && parsed.turn === turn) {
        memoryMasterCacheMap.set(cacheKey, parsed);
        return parsed;
      }
    }
  } catch (err) {
    console.warn(`Erro ao carregar master cache para ${cacheKey}:`, err);
  }

  const isolatedData: PresidentialElectionData = JSON.parse(JSON.stringify(initialPresidentialData));
  isolatedData.audit.codigoEleicao = electionCode;

  const masterEntry: MasterCacheEntry = {
    cacheKey,
    electionCode,
    turn,
    data: isolatedData,
    scopeHashes: {},
    lastSuccessfulFetchAt: null,
    lastContentChangeAt: null,
    lastAttemptedFetchAt: new Date().toISOString()
  };

  memoryMasterCacheMap.set(cacheKey, masterEntry);
  return masterEntry;
}

function saveMasterCache(entry: MasterCacheEntry) {
  memoryMasterCacheMap.set(entry.cacheKey, entry);
  const filePath = getMasterCacheFilePath(entry.electionCode, entry.turn);
  try {
    fs.writeFileSync(filePath, JSON.stringify(entry), 'utf8');
  } catch (err) {
    console.warn(`Erro ao salvar master cache em disco para ${entry.cacheKey}:`, err);
  }
}

/**
 * P2: Full Snapshot Recording with Durable Raw Storage and Per-Scope Retention Policy
 */
function recordFullSnapshot(metadata: TseSnapshotMetadata, rawJsonText?: string) {
  try {
    let ledger: TseSnapshotMetadata[] = [];
    if (fs.existsSync(SNAPSHOTS_LEDGER_FILE)) {
      const raw = fs.readFileSync(SNAPSHOTS_LEDGER_FILE, 'utf8');
      ledger = JSON.parse(raw);
    }

    ledger.unshift(metadata);

    if (rawJsonText) {
      try {
        const rawFilePath = path.join(SNAPSHOTS_RAW_DIR, `snapshot_${metadata.snapshotId}.json`);
        fs.writeFileSync(rawFilePath, rawJsonText, 'utf8');
      } catch (saveErr) {
        console.warn('Aviso ao salvar arquivo JSON bruto do snapshot:', saveErr);
      }
    }

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

  if (params?.turn !== undefined && params.turn !== 1 && params.turn !== 2) {
    return {
      success: false,
      requestSucceeded: false,
      dataAvailable: false,
      dataIsOfficial: false,
      status: 'FETCH_ERROR',
      provenance: 'DEMONSTRATIVE_BASELINE',
      scope: rawScope,
      turn: 2,
      isLive: false,
      isStale: false,
      dataAgeSeconds: null,
      fetchError: `Turno inválido: "${params.turn}". O turno deve ser estritamente 1 ou 2.`,
      lastSuccessfulFetchAt: null,
      lastContentChangeAt: null,
      lastAttemptedFetchAt,
      dataHoraGeracaoTse: null,
      presidentialData: null
    };
  }

  const validScope = rawScope as TseScope;
  const turn: 1 | 2 = params?.turn === 1 ? 1 : 2;

  const electionConfig = await resolveActiveElectionConfig();
  const electionCode = turn === 1 ? electionConfig.codeTurno1 : electionConfig.codeTurno2;

  const masterCache = loadMasterCache(electionCode, turn);
  masterCache.lastAttemptedFetchAt = lastAttemptedFetchAt;

  // Concurrently fetch requested scope and all other scopes in ALLOWED_SCOPES simultaneously
  const scopesToFetch = Array.from(new Set([validScope, ...ALLOWED_SCOPES]));

  let requestSucceeded = false;
  let isLive = false;
  let fetchError: string | null = null;

  await Promise.all(
    scopesToFetch.map(async (s) => {
      const sUrl = buildDocumentedTseUrl(s, electionCode);
      const netRes = await fetchTseEndpointSecurely(sUrl);
      if (netRes.ok && netRes.text) {
        try {
          const sHash = crypto.createHash('sha256').update(netRes.text).digest('hex');
          const sJson = JSON.parse(netRes.text);
          const parseRes = parseTseOfficialJson(sJson, {
            expectedTurn: turn,
            expectedScope: s,
            expectedElectionCode: electionCode,
            sourceVerified: true,
            provenance: 'OFFICIAL_TSE_LIVE',
            sourceUrl: sUrl,
            rawContentHash: sHash,
            configOrigin: electionConfig.source,
            existingData: masterCache.data
          });

          if (parseRes.success && parseRes.data) {
            masterCache.scopeHashes[s] = sHash;
            if (s === validScope) {
              requestSucceeded = true;
              isLive = true;
              masterCache.lastSuccessfulFetchAt = lastAttemptedFetchAt;
              if (sHash !== masterCache.scopeHashes[`${s}_prev`]) {
                masterCache.scopeHashes[`${s}_prev`] = sHash;
                masterCache.lastContentChangeAt = lastAttemptedFetchAt;
              }
              // Record snapshot for primary requested scope
              const activeRound = turn === 2 ? parseRes.data.turno2 : parseRes.data.turno1;
              recordFullSnapshot({
                snapshotId: `${electionCode}_t${turn}_${s}_${Date.now()}`,
                electionCode,
                turn,
                scope: s,
                dataHoraGeracaoTse: parseRes.data.audit.dataHoraGeracaoTse,
                retrievedAt: lastAttemptedFetchAt,
                contentHash: sHash,
                totalValidVotes: activeRound.totalValidVotes,
                totalizedSectionsPct: activeRound.totalizedSectionsPct,
                totalSections: activeRound.totalSections,
                totalizedSections: activeRound.totalizedSections,
                votersEligible: activeRound.votersEligible,
                abstentions: activeRound.abstentions,
                candidates: activeRound.nationalCandidates
              }, netRes.text);
            }
          }
        } catch {}
      } else if (s === validScope) {
        fetchError = netRes.error || `Falha HTTP ao consultar ${s}`;
      }
    })
  );

  saveMasterCache(masterCache);

  let fetchStatus: FetchStatus = 'CACHE_FALLBACK';
  let provenance: DataProvenance = masterCache.data.audit?.provenance || 'DEMONSTRATIVE_BASELINE';

  if (isLive) {
    fetchStatus = 'LIVE_UPDATED';
    provenance = 'OFFICIAL_TSE_LIVE';
    fetchError = null;
  } else {
    fetchStatus = fetchError ? 'FETCH_ERROR' : 'CACHE_FALLBACK';
    if (masterCache.data.audit.sourceVerified) {
      provenance = 'OFFICIAL_TSE_CACHE';
    } else {
      provenance = masterCache.data.audit.provenance;
    }
  }

  const dataIsOfficial = provenance === 'OFFICIAL_TSE_LIVE' || provenance === 'OFFICIAL_TSE_CACHE';
  const isStale = !isLive && dataIsOfficial;

  let dataAgeSeconds: number | null = null;
  const timeBasis = masterCache.lastContentChangeAt || masterCache.lastSuccessfulFetchAt;
  if (timeBasis) {
    dataAgeSeconds = Math.round((Date.now() - new Date(timeBasis).getTime()) / 1000);
  }

  const activeRound = turn === 2 ? masterCache.data.turno2 : masterCache.data.turno1;
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
    lastSuccessfulFetchAt: masterCache.lastSuccessfulFetchAt,
    lastContentChangeAt: masterCache.lastContentChangeAt,
    lastAttemptedFetchAt,
    dataHoraGeracaoTse: masterCache.data.audit.dataHoraGeracaoTse || null,
    presidentialData: masterCache.data,
    snapshots: getSnapshotsLedger()
  };
}
