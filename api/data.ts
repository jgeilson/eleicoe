import type { VercelRequest, VercelResponse } from '@vercel/node';
import { getOrFetchElectionData } from '../src/services/electionService.js';

const ALLOWED_TSE_HOSTS = ['resultados.tse.jus.br', 'dadosabertos.tse.jus.br', 'divulga.tse.jus.br'];

export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
  res.setHeader('Pragma', 'no-cache');
  res.setHeader('Expires', '0');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {
    let targetUrl: string | undefined = undefined;
    const requestedUrl = (req.body?.url || req.query?.url) as string | undefined;

    if (requestedUrl) {
      try {
        const parsedUrl = new URL(requestedUrl);
        if (ALLOWED_TSE_HOSTS.includes(parsedUrl.hostname.toLowerCase())) {
          targetUrl = requestedUrl;
        } else {
          return res.status(400).json({
            success: false,
            status: 'CACHE_FALLBACK',
            isLive: false,
            fetchError: 'Segurança (SSRF): Apenas URLs oficiais do domínio tse.jus.br são permitidas.',
            lastFetchedAt: new Date().toISOString(),
            dataUpdatedAt: null,
            presidentialData: null
          });
        }
      } catch {
        return res.status(400).json({
          success: false,
          status: 'CACHE_FALLBACK',
          isLive: false,
          fetchError: 'URL fornecida é inválida.',
          lastFetchedAt: new Date().toISOString(),
          dataUpdatedAt: null,
          presidentialData: null
        });
      }
    }

    const providedContent = req.body?.rawHtml || req.body?.rawJson as string | undefined;
    const result = await getOrFetchElectionData(targetUrl, providedContent);

    // If there was a fetch error and we are returning fallback data, communicate HTTP status transparently
    const httpStatus = result.isLive ? 200 : 200; // Return payload with fetchError intact so UI displays fallback banner
    return res.status(httpStatus).json(result);
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      status: 'CACHE_FALLBACK',
      isLive: false,
      fetchError: error.message || 'Erro interno no servidor de consulta ao TSE',
      lastFetchedAt: new Date().toISOString(),
      dataUpdatedAt: null,
      presidentialData: null
    });
  }
}
