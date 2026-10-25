import type { VercelRequest, VercelResponse } from '@vercel/node';
import { parseG1Html } from '../src/utils/parser';
import { ElectionData } from '../src/types/election';
import * as fs from 'fs';
import * as path from 'path';

// Memory cache across warm function calls
let cachedData: ElectionData | null = null;
let lastKnownDataUpdatedAt = '2026-10-25T14:32:00.000Z';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const lastFetchedAt = new Date().toISOString();
  let fetchError: string | null = null;
  let isLive = false;

  try {
    const url = (req.body?.url || req.query?.url || 'https://g1.globo.com/mundo/noticia/2026/10/25/votacao-no-exterior-confira-os-resultados-do-2o-turno-entre-lula-e-flavio-bolsonaro.ghtml') as string;
    let htmlContent = req.body?.rawHtml || '';

    if (!htmlContent) {
      try {
        const response = await fetch(url, {
          headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
            'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
            'Accept-Language': 'pt-BR,pt;q=0.9,en-US;q=0.8'
          },
          signal: AbortSignal.timeout(8000)
        });

        if (response.ok) {
          htmlContent = await response.text();
          isLive = true;
        } else {
          fetchError = `HTTP ${response.status}: ${response.statusText}`;
        }
      } catch (err: any) {
        fetchError = err.message || 'Erro ou tempo limite na consulta ao G1';
      }
    }

    if (htmlContent) {
      const parsed = parseG1Html(htmlContent);
      if (parsed && Array.isArray(parsed.countries) && parsed.countries.length > 0) {
        // Compare reported countries count or total votes to detect real changes
        const currentT2Count = parsed.countries.filter(c => c.turno2.disponivel).length;
        const previousT2Count = cachedData ? cachedData.countries.filter(c => c.turno2.disponivel).length : 0;

        if (!cachedData || currentT2Count !== previousT2Count) {
          lastKnownDataUpdatedAt = new Date().toISOString();
        }

        cachedData = parsed;
      }
    }

    if (!cachedData) {
      // Load fallback file if available
      const fallbackPath = path.resolve(process.cwd(), 'tmp_g1.html');
      if (fs.existsSync(fallbackPath)) {
        cachedData = parseG1Html(fs.readFileSync(fallbackPath, 'utf8'));
      } else {
        const localPath = '/tmp/g1_page.html';
        if (fs.existsSync(localPath)) {
          cachedData = parseG1Html(fs.readFileSync(localPath, 'utf8'));
        }
      }
    }

    if (cachedData) {
      cachedData.lastFetchedAt = lastFetchedAt;
      cachedData.dataUpdatedAt = lastKnownDataUpdatedAt;
    }

    return res.status(200).json({
      success: true,
      isLive,
      fetchError,
      lastFetchedAt,
      dataUpdatedAt: lastKnownDataUpdatedAt,
      data: cachedData
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      isLive: false,
      fetchError: error.message,
      lastFetchedAt,
      dataUpdatedAt: lastKnownDataUpdatedAt,
      data: cachedData
    });
  }
}
