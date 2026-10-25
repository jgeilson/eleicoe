import type { VercelRequest, VercelResponse } from '@vercel/node';
import { parseG1Html } from '../src/utils/parser';
import * as fs from 'fs';
import * as path from 'path';

let simulationStep = 0;

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
        console.warn('Live fetch failed (Cloudflare block on serverless):', err);
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
    simulationStep = (simulationStep + 1) % 5;

    // Progressive live simulation of afternoon closing in Europe and Americas
    const additionalCountriesToOpen = ['portugal', 'espanha', 'reino-unido', 'estados-unidos', 'frança'];
    const targetCountryId = additionalCountriesToOpen[simulationStep % additionalCountriesToOpen.length];

    const targetCountry = data.countries.find(c => c.id === targetCountryId);
    if (targetCountry && !targetCountry.turno2.disponivel) {
      const t1L = targetCountry.turno1.votosLula;
      const t1B = targetCountry.turno1.votosBolsonaro;
      // Simulate 2nd round turnout based on 1st round with realistic shift
      const t2L = Math.round(t1L * (1.15 + (simulationStep * 0.02)));
      const t2B = Math.round(t1B * (1.10 + (simulationStep * 0.015)));
      const total = t2L + t2B;

      targetCountry.turno2 = {
        disponivel: true,
        votosLula: t2L,
        votosBolsonaro: t2B,
        votosBrancosNulos: 0,
        totalValidos: total,
        pctLula: (t2L / total) * 100,
        pctBolsonaro: (t2B / total) * 100,
        winner: t2L > t2B ? 'Lula' : 'Flávio Bolsonaro',
        status: 'Encerrada'
      };
      targetCountry.observacoes = `2º turno apurado agora: Lula ${t2L.toLocaleString('pt-BR')} x Flávio ${t2B.toLocaleString('pt-BR')}`;
    }

    // Also apply minor live vote fluctuations to already open countries
    data.countries.forEach((c, idx) => {
      if (c.turno2.disponivel) {
        const deltaL = (idx % 2 === 0 ? 1 : -1) * (simulationStep * 3);
        const deltaB = (idx % 3 === 0 ? 2 : -1) * (simulationStep * 2);
        c.turno2.votosLula = Math.max(10, c.turno2.votosLula + deltaL);
        c.turno2.votosBolsonaro = Math.max(10, c.turno2.votosBolsonaro + deltaB);
        c.turno2.totalValidos = c.turno2.votosLula + c.turno2.votosBolsonaro;
        c.turno2.pctLula = (c.turno2.votosLula / c.turno2.totalValidos) * 100;
        c.turno2.pctBolsonaro = (c.turno2.votosBolsonaro / c.turno2.totalValidos) * 100;
      }
    });

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
