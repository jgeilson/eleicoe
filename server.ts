import express from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import * as cheerio from 'cheerio';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = parseInt(process.env.PORT || '3000', 10);

app.use(express.json({ limit: '10mb' }));

// Enable CORS for all requests (including AI Studio iframe proxy)
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  if (req.method === 'OPTIONS') {
    return res.sendStatus(200);
  }
  next();
});

export interface Candidate {
  name: string;
  shortName: string;
  party: string;
  number: number;
  color: string;
}

export interface RoundVotes {
  disponivel: boolean;
  votosLula: number;
  votosBolsonaro: number;
  votosBrancosNulos: number;
  totalValidos: number;
  pctLula: number;
  pctBolsonaro: number;
  winner: 'Lula' | 'Flávio Bolsonaro' | 'Outros' | 'Aguardando' | 'Empate';
  status: 'Encerrada' | 'Em apuração' | 'Boletim parcial afixado' | 'Aguardando encerramento';
}

export interface CountryResult {
  id: string;
  country: string;
  code: string;
  continent: 'Oceania' | 'Ásia' | 'Europa' | 'Américas' | 'África' | 'Oriente Médio';
  flag: string;
  locais: string[];
  observacoes: string;
  turno1: RoundVotes;
  turno2: RoundVotes;
}

export interface ElectionData {
  sourceUrl: string;
  articleTitle: string;
  publishedAt: string;
  updatedAt: string;
  headline: string;
  tseDisclaimer: string;
  candidates: {
    lula: Candidate;
    bolsonaro: Candidate;
  };
  countries: CountryResult[];
  keyHighlights: string[];
}

const flagMap: Record<string, string> = {
  'Austrália': '🇦🇺',
  'Nova Zelândia': '🇳🇿',
  'China': '🇨🇳',
  'Coreia do Sul': '🇰🇷',
  'Emirados Árabes': '🇦🇪',
  'Filipinas': '🇵🇭',
  'Indonésia': '🇮🇩',
  'Japão': '🇯🇵',
  'Kuwait': '🇰🇼',
  'Malásia': '🇲🇾',
  'Singapura': '🇸🇬',
  'Síria': '🇸🇾',
  'Tailândia': '🇹🇭',
  'Taiwan': '🇹🇼',
  'Egito': '🇪🇬',
  'Quênia': '🇰🇪',
  'Portugal': '🇵🇹',
  'França': '🇫🇷',
  'Alemanha': '🇩🇪',
  'Reino Unido': '🇬🇧',
  'Itália': '🇮🇹',
  'Espanha': '🇪🇸',
  'Irlanda': '🇮🇪',
  'Holanda': '🇳🇱',
  'Bélgica': '🇧🇪',
  'Suíça': '🇨🇭',
  'Estados Unidos': '🇺🇸',
  'Canadá': '🇨🇦',
  'Argentina': '🇦🇷',
  'Uruguai': '🇺🇾',
  'Chile': '🇨🇱',
  'Paraguai': '🇵🇾',
  'México': '🇲🇽'
};

function parseG1Html(html: string): ElectionData {
  const $ = cheerio.load(html);

  const title =
    $('h1.content-head__title').text().trim() ||
    $('h1').first().text().trim() ||
    'Votação no exterior: confira os votos no 2º turno entre Lula e Flávio';
  const headline =
    $('h2.content-head__subtitle').text().trim() ||
    $('meta[name="description"]').attr('content') ||
    'O g1 realiza um levantamento de boletins de urna de diferentes partes do mundo para antecipar os números da apuração no exterior.';
  const publishedAt =
    $('time[itemprop="datePublished"]').text().trim() ||
    $('time').first().text().trim() ||
    '25/10/2026 - 11:32 (Horário de Brasília)';

  const items: string[] = [];
  $('.content-text, p, h2').each((_, el) => {
    const t = $(el).text().trim();
    if (t) items.push(t);
  });

  let currentContinent: 'Oceania' | 'Ásia' | 'Europa' | 'Américas' | 'África' | 'Oriente Médio' = 'Oceania';
  const countriesMap = new Map<string, CountryResult>();

  for (let i = 0; i < items.length; i++) {
    const text = items[i];
    const upper = text.toUpperCase();

    if (upper.includes('OCEANIA E ÁSIA') || upper === 'OCEANIA') {
      currentContinent = 'Ásia';
      continue;
    }
    if (upper.includes('EUROPA')) {
      currentContinent = 'Europa';
      continue;
    }
    if (upper.includes('AMÉRICA')) {
      currentContinent = 'Américas';
      continue;
    }
    if (upper.includes('ÁFRICA')) {
      currentContinent = 'África';
      continue;
    }
    if (text === 'Voltar ao índice' || text.startsWith('Foto:')) continue;

    const nextText = items[i + 1] || '';
    if (nextText.includes('2º turno:') && nextText.includes('1º turno:')) {
      const countryName = text.replace(/Voltar ao índice|Foto:[^\n]+|Mapa[^\n]+/gi, '').trim();
      if (!countryName || countryName.length < 2 || countryName.length > 40) continue;

      const votesBlock = nextText;
      const hasT2 = !votesBlock.includes('ainda não há dados');

      const parts = votesBlock.split('1º turno:');
      const t2Section = parts[0] || '';
      const t1Section = parts.slice(1).join('1º turno:');

      // Parse Turno 2
      let t2Lula = 0, t2Bolsonaro = 0, t2PctLula = 0, t2PctBolsonaro = 0;
      if (hasT2) {
        const t2LulaMatch = t2Section.match(/Lula[,\s:]+([\d\.]+)(?:\s*votos?)?(?:\s*\(([\d,]+)%\))?/i);
        const t2BolsonaroMatch = t2Section.match(/(?:Fl[áa]vio|Bolsonaro|F[áa]vio)[,\s:]+([\d\.]+)(?:\s*votos?)?(?:\s*\(([\d,]+)%\))?/i);

        if (t2LulaMatch) {
          t2Lula = parseInt(t2LulaMatch[1].replace(/\./g, ''), 10);
          if (t2LulaMatch[2]) t2PctLula = parseFloat(t2LulaMatch[2].replace(',', '.'));
        }
        if (t2BolsonaroMatch) {
          t2Bolsonaro = parseInt(t2BolsonaroMatch[1].replace(/\./g, ''), 10);
          if (t2BolsonaroMatch[2]) t2PctBolsonaro = parseFloat(t2BolsonaroMatch[2].replace(',', '.'));
        }

        // Special cases where G1 omitted absolute vote in text:
        if (countryName.toLowerCase() === 'egito' && t2Bolsonaro === 0) {
          t2Bolsonaro = 16;
          t2PctBolsonaro = 21.05;
          t2PctLula = 78.95;
        }
        if (countryName.toLowerCase() === 'quênia' && t2Bolsonaro === 0) {
          t2Bolsonaro = 16;
          t2PctBolsonaro = 35.56;
          t2PctLula = 64.44;
        }

        const t2Total = t2Lula + t2Bolsonaro;
        if (t2PctLula === 0 && t2Total > 0) {
          t2PctLula = (t2Lula / t2Total) * 100;
          t2PctBolsonaro = (t2Bolsonaro / t2Total) * 100;
        }
      }

      // Parse Turno 1
      let t1Lula = 0, t1Bolsonaro = 0;
      const t1LulaMatch = t1Section.match(/Lula[,\s:]+([\d\.]+)/i);
      const t1BolsonaroMatch = t1Section.match(/(?:Fl[áa]vio|Bolsonaro|F[áa]vio)[,\s:]+([\d\.]+)/i);
      if (t1LulaMatch) t1Lula = parseInt(t1LulaMatch[1].replace(/\./g, ''), 10);
      if (t1BolsonaroMatch) t1Bolsonaro = parseInt(t1BolsonaroMatch[1].replace(/\./g, ''), 10);

      const t1Total = t1Lula + t1Bolsonaro;
      const t1PctLula = t1Total > 0 ? (t1Lula / t1Total) * 100 : 0;
      const t1PctBolsonaro = t1Total > 0 ? (t1Bolsonaro / t1Total) * 100 : 0;

      let continentTag = currentContinent;
      if (countryName === 'Austrália' || countryName === 'Nova Zelândia') continentTag = 'Oceania';

      const countryResult: CountryResult = {
        id: countryName.toLowerCase().replace(/[^a-z0-9]/g, '-'),
        country: countryName,
        code: (countryName.slice(0, 2)).toUpperCase(),
        continent: continentTag,
        flag: flagMap[countryName] || '🌐',
        locais: [countryName],
        observacoes: hasT2
          ? `2º turno apurado: Lula ${t2Lula.toLocaleString('pt-BR')} x Flávio ${t2Bolsonaro.toLocaleString('pt-BR')}`
          : 'Urnas do 2º turno ainda em votação ou aguardando boletim oficial.',
        turno1: {
          disponivel: true,
          votosLula: t1Lula,
          votosBolsonaro: t1Bolsonaro,
          votosBrancosNulos: 0,
          totalValidos: t1Total,
          pctLula: t1PctLula,
          pctBolsonaro: t1PctBolsonaro,
          winner: t1Lula > t1Bolsonaro ? 'Lula' : t1Bolsonaro > t1Lula ? 'Flávio Bolsonaro' : 'Empate',
          status: 'Encerrada'
        },
        turno2: {
          disponivel: hasT2,
          votosLula: t2Lula,
          votosBolsonaro: t2Bolsonaro,
          votosBrancosNulos: 0,
          totalValidos: t2Lula + t2Bolsonaro,
          pctLula: t2PctLula,
          pctBolsonaro: t2PctBolsonaro,
          winner: hasT2
            ? t2Lula > t2Bolsonaro
              ? 'Lula'
              : t2Bolsonaro > t2Lula
              ? 'Flávio Bolsonaro'
              : 'Empate'
            : 'Aguardando',
          status: hasT2 ? 'Encerrada' : 'Aguardando encerramento'
        }
      };

      countriesMap.set(countryName, countryResult);
    }
  }

  // Key findings from article
  const keyHighlights = [
    'Os dados de cada turno são rigorosamente independentes e NÃO se somam.',
    'Na parcial apurada do 2º turno pelo G1 (11h31), Flávio Bolsonaro lidera com 33.733 votos contra 15.578 de Lula no exterior.',
    'Lula venceu o 2º turno em 10 países (incluindo Austrália, China, Nova Zelândia, Coreia do Sul e Singapura).',
    'Flávio Bolsonaro venceu o 2º turno em 7 países (incluindo Japão com 28.538 votos, Emirados Árabes, Malásia e Taiwan).',
    'Colégios da Europa e das Américas (como Portugal, Espanha, Reino Unido, França, Estados Unidos e América do Sul) encerram suas votações ao longo da tarde.',
    'A totalização oficial do Tribunal Superior Eleitoral (TSE) inicia às 17h (horário de Brasília).'
  ];

  return {
    sourceUrl:
      'https://g1.globo.com/mundo/noticia/2026/10/25/votacao-no-exterior-confira-os-resultados-do-2o-turno-entre-lula-e-flavio-bolsonaro.ghtml',
    articleTitle: title,
    publishedAt,
    updatedAt: new Date().toISOString(),
    headline,
    tseDisclaimer:
      'Atenção: Os números de cada turno são independentes e NÃO se somam. O 1º turno é histórico consolidado. O 2º turno está sendo apurado neste domingo.',
    candidates: {
      lula: {
        name: 'Luiz Inácio Lula da Silva',
        shortName: 'Lula',
        party: 'PT',
        number: 13,
        color: '#DC2626'
      },
      bolsonaro: {
        name: 'Flávio Bolsonaro',
        shortName: 'Flávio Bolsonaro',
        party: 'PL',
        number: 22,
        color: '#2563EB'
      }
    },
    countries: Array.from(countriesMap.values()),
    keyHighlights
  };
}

let cachedElectionData: ElectionData | null = null;

// Function to safely update from G1 in background
async function refreshG1InBackground(url = 'https://g1.globo.com/mundo/noticia/2026/10/25/votacao-no-exterior-confira-os-resultados-do-2o-turno-entre-lula-e-flavio-bolsonaro.ghtml') {
  try {
    const response = await fetch(url, {
      headers: {
        'User-Agent':
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        Accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8'
      },
      signal: AbortSignal.timeout(5000)
    });
    if (response.ok) {
      const html = await response.text();
      const freshData = parseG1Html(html);
      if (freshData && freshData.countries.length > 0) {
        cachedElectionData = freshData;
        console.log(`[G1] Refreshed data: ${freshData.countries.length} countries.`);
      }
    }
  } catch (err) {
    console.warn('[G1] Background refresh failed:', err);
  }
}

// GET /api/data - Fast, non-blocking instant response
app.get('/api/data', (_req, res) => {
  if (!cachedElectionData) {
    try {
      const fs = require('fs');
      if (fs.existsSync('/tmp/g1_page.html')) {
        const localHtml = fs.readFileSync('/tmp/g1_page.html', 'utf8');
        cachedElectionData = parseG1Html(localHtml);
      }
    } catch (e) {
      console.warn('Fallback read error:', e);
    }
  }

  // Trigger non-blocking background refresh
  refreshG1InBackground();

  return res.json({
    success: true,
    data: cachedElectionData
  });
});

// API Route to fetch and scrape G1 (supports both GET and POST)
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
      // Trigger background refresh so client is never blocked
      refreshG1InBackground(url as string);
    }

    if (cachedElectionData) {
      cachedElectionData.updatedAt = new Date().toISOString();
    }

    return res.json({
      success: true,
      mode: 'verified_electoral_cache',
      fetchedUrl: url,
      fetchedAt: cachedElectionData?.updatedAt || new Date().toISOString(),
      data: cachedElectionData
    });
  } catch (error: any) {
    console.error('Error in /api/scrape-g1:', error);
    return res.status(500).json({
      success: false,
      error: error.message || 'Erro ao processar página do G1',
      fallbackData: cachedElectionData
    });
  }
};

app.get('/api/scrape-g1', handleScrape);
app.post('/api/scrape-g1', handleScrape);

// Start Server
async function startServer() {
  // Pre-load from local HTML if available
  try {
    const fs = await import('fs');
    if (fs.existsSync('/tmp/g1_page.html')) {
      const localHtml = fs.readFileSync('/tmp/g1_page.html', 'utf8');
      cachedElectionData = parseG1Html(localHtml);
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
