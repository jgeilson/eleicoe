import express from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { getOrFetchElectionData } from './src/services/electionService.js';

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
  if (req.path.startsWith('/api')) {
    res.header('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
    res.header('Pragma', 'no-cache');
    res.header('Expires', '0');
  }
  if (req.method === 'OPTIONS') {
    return res.sendStatus(200);
  }
  next();
});

const handleApiRequest = async (req: express.Request, res: express.Response) => {
  try {
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

    const rawScope = ((req.query?.scope || req.body?.scope || 'BR') as string).toUpperCase();
    const rawTurn = Number(req.query?.turn || req.body?.turn || 2);
    const turn = rawTurn === 1 ? 1 : 2;

    const result = await getOrFetchElectionData({ scope: rawScope, turn });
    return res.json(result);
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
};

app.get('/api/data', handleApiRequest);
app.get('/api/tse-data', handleApiRequest);

async function startServer() {
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
