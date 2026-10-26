/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import type { VercelRequest, VercelResponse } from '@vercel/node';
import { getOrFetchElectionData, ALLOWED_SCOPES } from '../src/services/electionService.js';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // CORS & Cache-Control (Strict no-store for accurate live verification)
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
    // SSRF Immunity: Reject any attempt to supply external or custom URLs.
    if (req.query?.url || req.body?.url) {
      return res.status(400).json({
        success: false,
        status: 'FETCH_ERROR',
        provenance: 'DEMONSTRATIVE_BASELINE',
        scope: 'BR',
        isLive: false,
        isStale: false,
        fetchError: 'Segurança (SSRF): Parâmetro "url" arbitrário é estritamente proibido. Use "scope" (ex: BR, SP, RJ, ZZ).',
        lastSuccessfulFetchAt: null,
        lastAttemptedFetchAt: new Date().toISOString(),
        dataHoraGeracaoTse: null,
        presidentialData: null
      });
    }

    // Validate scope (defaults to 'BR')
    const rawScope = ((req.query?.scope || req.body?.scope || 'BR') as string).toUpperCase();
    const scope = (ALLOWED_SCOPES as readonly string[]).includes(rawScope) ? rawScope : 'BR';

    // Validate turn (defaults to 2)
    const rawTurn = Number(req.query?.turn || req.body?.turn || 2);
    const turn = rawTurn === 1 ? 1 : 2;

    const result = await getOrFetchElectionData({ scope, turn });

    return res.status(200).json(result);
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      status: 'FETCH_ERROR',
      provenance: 'DEMONSTRATIVE_BASELINE',
      scope: 'BR',
      isLive: false,
      isStale: false,
      fetchError: error.message || 'Erro interno no servidor de consulta ao TSE.',
      lastSuccessfulFetchAt: null,
      lastAttemptedFetchAt: new Date().toISOString(),
      dataHoraGeracaoTse: null,
      presidentialData: null
    });
  }
}
