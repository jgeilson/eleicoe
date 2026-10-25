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
  outrosCandidatos?: number;
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
  // Os turnos são rigorosamente independentes e NÃO se somam:
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
