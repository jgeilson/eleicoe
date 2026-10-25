import express from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { getOrFetchElectionData } from './src/services/electionService';

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

const handleApiRequest = async (req: express.Request, res: express.Response) => {
  try {
    const url = (req.body?.url || req.query?.url) as string | undefined;
    const rawHtml = req.body?.rawHtml as string | undefined;

    const result = await getOrFetchElectionData(url, rawHtml);
    return res.json(result);
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      status: 'CACHE_FALLBACK',
      isLive: false,
      fetchError: error.message,
      lastFetchedAt: new Date().toISOString(),
      dataUpdatedAt: null,
      data: null
    });
  }
};

app.get('/api/data', handleApiRequest);
app.get('/api/scrape-g1', handleApiRequest);
app.post('/api/scrape-g1', handleApiRequest);

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
