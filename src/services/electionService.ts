import { ElectionData, ApiResponse, FetchStatus } from '../types/election.js';
import { initialElectionData } from '../data/initialData.js';
import { parseG1Html } from '../utils/parser.js';
import * as fs from 'fs';
import * as path from 'path';

const PERSISTENT_CACHE_FILE = path.join('/tmp', 'election_cache_v2.json');

interface PersistentState {
  data: ElectionData;
  signature: string;
  dataUpdatedAt: string | null;
}

let memoryState: PersistentState | null = null;

function loadPersistentState(): PersistentState {
  if (memoryState) {
    return memoryState;
  }

  try {
    if (fs.existsSync(PERSISTENT_CACHE_FILE)) {
      const raw = fs.readFileSync(PERSISTENT_CACHE_FILE, 'utf8');
      const parsed = JSON.parse(raw);
      if (parsed && parsed.data && parsed.signature) {
        memoryState = parsed;
        return parsed;
      }
    }
  } catch (err) {
    console.warn('Erro ao carregar cache persistente de disco:', err);
  }

  // Initial baseline if no persistent cache file exists
  const initialSig = computeElectionSignature(initialElectionData);
  const baseline: PersistentState = {
    data: initialElectionData,
    signature: initialSig,
    dataUpdatedAt: '2026-10-25T14:32:00.000Z' // Official publication timestamp
  };

  memoryState = baseline;
  savePersistentState(baseline);
  return baseline;
}

function savePersistentState(state: PersistentState) {
  memoryState = state;
  try {
    fs.writeFileSync(PERSISTENT_CACHE_FILE, JSON.stringify(state), 'utf8');
  } catch (err) {
    console.warn('Erro ao salvar cache em disco:', err);
  }
}

export function computeElectionSignature(data: ElectionData): string {
  if (!data || !Array.isArray(data.countries)) return '';
  return data.countries
    .map(
      (c) =>
        `${c.id}:${c.turno2.disponivel ? '1' : '0'}:${c.turno2.votosLula}:${c.turno2.votosBolsonaro}:${c.turno1.votosLula}:${c.turno1.votosBolsonaro}`
    )
    .join('|');
}

export async function getOrFetchElectionData(
  targetUrl?: string,
  providedHtml?: string
): Promise<ApiResponse> {
  const lastFetchedAt = new Date().toISOString();
  const url =
    targetUrl ||
    'https://g1.globo.com/mundo/noticia/2026/10/25/votacao-no-exterior-confira-os-resultados-do-2o-turno-entre-lula-e-flavio-bolsonaro.ghtml';

  const currentState = loadPersistentState();

  let htmlContent = providedHtml || '';
  let isLive = false;
  let fetchError: string | null = null;

  // Attempt live HTTP fetch if no HTML provided directly
  if (!htmlContent) {
    try {
      const response = await fetch(url, {
        headers: {
          'User-Agent':
            'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
          Accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
          'Accept-Language': 'pt-BR,pt;q=0.9,en-US;q=0.8'
        },
        signal: AbortSignal.timeout(8000)
      });

      if (response.ok) {
        htmlContent = await response.text();
      } else {
        fetchError = `HTTP ${response.status}: ${response.statusText}`;
      }
    } catch (err: any) {
      fetchError = err.message || 'Erro ou tempo limite na consulta ao G1';
    }
  }

  let status: FetchStatus = 'CACHE_FALLBACK';

  if (htmlContent) {
    try {
      const parsed = parseG1Html(htmlContent);
      if (parsed && Array.isArray(parsed.countries) && parsed.countries.length > 0) {
        isLive = true;
        const newSignature = computeElectionSignature(parsed);

        if (newSignature !== currentState.signature) {
          status = 'LIVE_UPDATED';
          currentState.dataUpdatedAt = new Date().toISOString();
          currentState.signature = newSignature;
          currentState.data = parsed;
          savePersistentState(currentState);
        } else {
          status = 'LIVE_UNCHANGED';
        }
      } else {
        fetchError = 'Conteúdo HTML retornado não contém dados de países válidos';
      }
    } catch (parseErr: any) {
      fetchError = `Falha ao processar HTML: ${parseErr.message}`;
    }
  }

  // Populate metadata
  const finalData: ElectionData = {
    ...currentState.data,
    lastFetchedAt,
    dataUpdatedAt: currentState.dataUpdatedAt
  };

  return {
    success: true,
    status,
    isLive,
    fetchError,
    lastFetchedAt,
    dataUpdatedAt: currentState.dataUpdatedAt,
    data: finalData
  };
}
