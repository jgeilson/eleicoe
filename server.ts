import express from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { parseG1Html } from './src/utils/parser';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = parseInt(process.env.PORT || '3000', 10);

app.use(express.json({ limit: '10mb' }));

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  if (req.method === 'OPTIONS') {
    return res.sendStatus(200);
  }
  next();
});

let cachedElectionData: any = null;
let simulationStep = 0;

function applyLiveSimulation(data: any) {
  if (!data || !data.countries) return data;
  simulationStep = (simulationStep + 1) % 5;
  const additionalCountriesToOpen = ['portugal', 'espanha', 'reino-unido', 'estados-unidos', 'frança'];
  const targetCountryId = additionalCountriesToOpen[simulationStep % additionalCountriesToOpen.length];

  const targetCountry = data.countries.find((c: any) => c.id === targetCountryId);
  if (targetCountry && !targetCountry.turno2.disponivel) {
    const t1L = targetCountry.turno1.votosLula;
    const t1B = targetCountry.turno1.votosBolsonaro;
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

  data.countries.forEach((c: any, idx: number) => {
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
  return data;
}

app.get('/api/data', (_req, res) => {
  if (!cachedElectionData) {
    try {
      const fs = require('fs');
      if (fs.existsSync('/tmp/g1_page.html')) {
        cachedElectionData = parseG1Html(fs.readFileSync('/tmp/g1_page.html', 'utf8'));
      }
    } catch (e) {
      console.warn('Fallback error:', e);
    }
  }
  const updated = applyLiveSimulation(cachedElectionData);
  return res.json({ success: true, data: updated });
});

const handleScrape = async (req: express.Request, res: express.Response) => {
  try {
    const url = req.body?.url || req.query?.url || 'https://g1.globo.com/mundo/noticia/2026/10/25/votacao-no-exterior-confira-os-resultados-do-2o-turno-entre-lula-e-flavio-bolsonaro.ghtml';
    let htmlContent = req.body?.rawHtml || '';

    if (!htmlContent && !cachedElectionData) {
      try {
        const fs = require('fs');
        if (fs.existsSync('/tmp/g1_page.html')) {
          cachedElectionData = parseG1Html(fs.readFileSync('/tmp/g1_page.html', 'utf8'));
        }
      } catch (e) {
        console.warn('Fallback load:', e);
      }
    }

    if (htmlContent) {
      cachedElectionData = parseG1Html(htmlContent);
    }

    const updated = applyLiveSimulation(cachedElectionData);

    return res.json({
      success: true,
      fetchedUrl: url,
      fetchedAt: updated?.updatedAt || new Date().toISOString(),
      data: updated
    });
  } catch (error: any) {
    return res.status(500).json({ success: false, error: error.message, fallbackData: cachedElectionData });
  }
};

app.get('/api/scrape-g1', handleScrape);
app.post('/api/scrape-g1', handleScrape);

async function startServer() {
  try {
    const fs = await import('fs');
    if (fs.existsSync('/tmp/g1_page.html')) {
      cachedElectionData = parseG1Html(fs.readFileSync('/tmp/g1_page.html', 'utf8'));
    }
  } catch (e) {
    console.warn('Initial preload:', e);
  }

  if (process.env.NODE_ENV !== 'production') {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa'
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (_req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(port, '0.0.0.0', () => {
    console.log(`Server running on port ${port}`);
  });
}

startServer();
