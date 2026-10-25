import type { VercelRequest, VercelResponse } from '@vercel/node';
import { getOrFetchElectionData } from '../src/services/electionService';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {
    const url = (req.body?.url || req.query?.url) as string | undefined;
    const rawHtml = req.body?.rawHtml as string | undefined;

    const result = await getOrFetchElectionData(url, rawHtml);
    return res.status(200).json(result);
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      status: 'CACHE_FALLBACK',
      isLive: false,
      fetchError: error.message || 'Erro interno na função serverless',
      lastFetchedAt: new Date().toISOString(),
      dataUpdatedAt: null,
      data: null
    });
  }
}
