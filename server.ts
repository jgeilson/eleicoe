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

async function refreshG1InBackground(url = 'https://g1.globo.com/mundo/noticia/2026/10/25/votacao-no-exterior-confira-os-resultados-do-2o-turno-entre-lula-e-flavio-bolsonaro.ghtml') {
  try {
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        Accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8'
      },
      signal: AbortSignal.timeout(5000)
    });
    if (response.ok) {
      const html = await response.text();
      const freshData = parseG1Html(html);
      if (freshData && freshData.countries.length > 0) {
        cachedElectionData = freshData;
      }
    }
  } catch (err) {
    console.warn('Background refresh:', err);
  }
}

app.get('/api/data', (_req, res) => {
  if (!cachedElectionData) {
    try {
      const fs = require('fs');
      if (fs.existsSync('/tmp/g1_page.html')) {
        const localHtml = fs.readFileSync('/tmp/g1_page.html', 'utf8');
        cachedElectionData = parseG1Html(localHtml);
      }
    } catch (e) {
      console.warn('Fallback error:', e);
    }
  }
  refreshG1InBackground();
  return res.json({ success: true, data: cachedElectionData });
});

const handleScrape = async (req: express.Request, res: express.Response) => {
  try {
    const url = req.body?.url || req.query?.url || 'https://g1.globo.com/mundo/noticia/2026/10/25/votacao-no-exterior-confira-os-resultados-do-2o-turno-entre-lula-e-flavio-bolsonaro.ghtml';
    let htmlContent = req.body?.rawHtml || '';

    if (!htmlContent && !cachedElectionData) {
      try {
        const fs = require('fs');
        if (fs.existsSync('/tmp/g1_page.html')) {
          const localHtml = fs.readFileSync('/tmp/g1_page.html', 'utf8');
          cachedElectionData = parseG1Html(localHtml);
        }
      } catch (e) {
        console.warn('Fallback load:', e);
      }
    }

    if (htmlContent) {
      cachedElectionData = parseG1Html(htmlContent);
    } else {
      refreshG1InBackground(url as string);
    }

    if (cachedElectionData) {
      cachedElectionData.updatedAt = new Date().toISOString();
    }

    return res.json({
      success: true,
      fetchedUrl: url,
      fetchedAt: cachedElectionData?.updatedAt || new Date().toISOString(),
      data: cachedElectionData
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
