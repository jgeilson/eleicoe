import type { VercelRequest, VercelResponse } from '@vercel/node';
import { parseG1Html } from '../src/utils/parser';
import * as fs from 'fs';
import * as path from 'path';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {
    const url = (req.body?.url || req.query?.url || 'https://g1.globo.com/mundo/noticia/2026/10/25/votacao-no-exterior-confira-os-resultados-do-2o-turno-entre-lula-e-flavio-bolsonaro.ghtml') as string;
    let htmlContent = req.body?.rawHtml || '';

    if (!htmlContent) {
      try {
        const response = await fetch(url, {
          headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
            'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8'
          },
          signal: AbortSignal.timeout(5000)
        });
        if (response.ok) {
          htmlContent = await response.text();
        }
      } catch (err) {
        console.warn('Live fetch failed:', err);
      }
    }

    if (!htmlContent) {
      const fallbackPath = path.resolve(process.cwd(), 'tmp_g1.html');
      if (fs.existsSync(fallbackPath)) {
        htmlContent = fs.readFileSync(fallbackPath, 'utf8');
      } else {
        const localHtmlPath = '/tmp/g1_page.html';
        if (fs.existsSync(localHtmlPath)) {
          htmlContent = fs.readFileSync(localHtmlPath, 'utf8');
        }
      }
    }

    const data = parseG1Html(htmlContent);
    data.updatedAt = new Date().toISOString();

    return res.status(200).json({
      success: true,
      fetchedAt: data.updatedAt,
      data
    });
  } catch (error: any) {
    return res.status(500).json({ success: false, error: error.message });
  }
}
