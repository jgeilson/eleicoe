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
        requestSucceeded: false,
        dataAvailable: false,
        dataIsOfficial: false,
        status: 'FETCH_ERROR',
        provenance: 'DEMONSTRATIVE_BASELINE',
        scope: 'BR',
        turn: 2,
        isLive: false,
        isStale: false,
        dataAgeSeconds: null,
        fetchError: 'Segurança (SSRF): Parâmetro "url" arbitrário é estritamente proibido. Use "scope" (ex: BR, SP, RJ, ZZ).',
        lastSuccessfulFetchAt: null,
        lastContentChangeAt: null,
        lastAttemptedFetchAt: new Date().toISOString(),
        dataHoraGeracaoTse: null,
        presidentialData: null
      });
    }

    // P1: Validate scope strictly - Reject invalid scopes instead of silently substituting BR (Issue 7)
    const rawScope = ((req.query?.scope || req.body?.scope || 'BR') as string).toUpperCase();
    if (!(ALLOWED_SCOPES as readonly string[]).includes(rawScope)) {
      return res.status(400).json({
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
        fetchError: `Abrangência inválida: "${rawScope}". Escopos permitidos são [BR, ZZ, e as 27 UFs].`,
        lastSuccessfulFetchAt: null,
        lastContentChangeAt: null,
        lastAttemptedFetchAt: new Date().toISOString(),
        dataHoraGeracaoTse: null,
        presidentialData: null
      });
    }

    // P0: Strict Turn Validation - Rejects any turn different from 1 or 2
    let turn: 1 | 2 = 2;
    const providedTurn = req.query?.turn ?? req.body?.turn;
    if (providedTurn !== undefined) {
      const turnStr = String(providedTurn).trim();
      if (turnStr !== '1' && turnStr !== '2') {
        return res.status(400).json({
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
          fetchError: `Turno inválido: "${providedTurn}". O turno da eleição presidencial deve ser estritamente 1 ou 2.`,
          lastSuccessfulFetchAt: null,
          lastContentChangeAt: null,
          lastAttemptedFetchAt: new Date().toISOString(),
          dataHoraGeracaoTse: null,
          presidentialData: null
        });
      }
      turn = turnStr === '1' ? 1 : 2;
    }

    const result = await getOrFetchElectionData({ scope: rawScope, turn });

    return res.status(200).json(result);
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      requestSucceeded: false,
      dataAvailable: false,
      dataIsOfficial: false,
      status: 'FETCH_ERROR',
      provenance: 'DEMONSTRATIVE_BASELINE',
      scope: 'BR',
      turn: 2,
      isLive: false,
      isStale: false,
      dataAgeSeconds: null,
      fetchError: error.message || 'Erro interno no servidor de consulta ao TSE.',
      lastSuccessfulFetchAt: null,
      lastContentChangeAt: null,
      lastAttemptedFetchAt: new Date().toISOString(),
      dataHoraGeracaoTse: null,
      presidentialData: null
    });
  }
}
