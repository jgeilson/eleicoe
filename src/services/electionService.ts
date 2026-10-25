import { ElectionData, ApiResponse, FetchStatus } from '../types/election';
import { initialElectionData } from '../data/initialData';
import { parseG1Html } from '../utils/parser';
import * as fs from 'fs';
import * as path from 'path';

let cachedData: ElectionData | null = null;
let lastElectionSignature: string | null = null;
let dataUpdatedAt: string | null = null;

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

  let htmlContent = providedHtml || '';
  let isLive = false;
  let fetchError: string | null = null;

  // Initialize cache with initial verified dataset if not present
  if (!cachedData) {
    cachedData = initialElectionData;
    lastElectionSignature = computeElectionSignature(initialElectionData);
    dataUpdatedAt = '2026-10-25T14:32:00.000Z'; // Time of original G1 publishing
  }

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

        if (lastElectionSignature === null || newSignature !== lastElectionSignature) {
          status = 'LIVE_UPDATED';
          lastElectionSignature = newSignature;
          dataUpdatedAt = new Date().toISOString();
        } else {
          status = 'LIVE_UNCHANGED';
        }

        cachedData = parsed;
      } else {
        fetchError = 'Conteúdo HTML retornado não contém dados de países válidos';
      }
    } catch (parseErr: any) {
      fetchError = `Falha ao processar HTML: ${parseErr.message}`;
    }
  }

  // Ensure local file fallback if cache is somehow null
  if (!cachedData) {
    try {
      const fallbackPath = path.resolve(process.cwd(), 'tmp_g1.html');
      if (fs.existsSync(fallbackPath)) {
        cachedData = parseG1Html(fs.readFileSync(fallbackPath, 'utf8'));
      }
    } catch (e) {
      // Ignore file read error
    }
  }

  // Guaranteed fallback
  if (!cachedData) {
    cachedData = initialElectionData;
  }

  // Populate metadata
  const finalData: ElectionData = {
    ...cachedData,
    lastFetchedAt,
    dataUpdatedAt: dataUpdatedAt || '2026-10-25T14:32:00.000Z'
  };

  return {
    success: true,
    status,
    isLive,
    fetchError,
    lastFetchedAt,
    dataUpdatedAt: dataUpdatedAt || '2026-10-25T14:32:00.000Z',
    data: finalData
  };
}
