import React from 'react';
import { ElectionData } from '../types/election';
import { TrendingUp, TrendingDown } from 'lucide-react';

interface ScorecardProps {
  data: ElectionData;
}

export const Scorecard: React.FC<ScorecardProps> = ({ data }) => {
  const { countries, candidates } = data;

  // Countries with 2nd round already reported today
  const countriesT2 = countries.filter((c) => c.turno2.disponivel);
  const countriesPending = countries.filter((c) => !c.turno2.disponivel);

  // Turno 2 (Hoje) - ONLY 2nd round votes
  const t2VotosLula = countriesT2.reduce((acc, c) => acc + c.turno2.votosLula, 0);
  const t2VotosBolsonaro = countriesT2.reduce((acc, c) => acc + c.turno2.votosBolsonaro, 0);
  const t2Validos = t2VotosLula + t2VotosBolsonaro;
  const t2PctLula = t2Validos > 0 ? (t2VotosLula / t2Validos) * 100 : 0;
  const t2PctBolsonaro = t2Validos > 0 ? (t2VotosBolsonaro / t2Validos) * 100 : 0;

  // Turno 1 (in the SAME countries where 2nd round is already closed, for fair 1:1 comparison)
  const t1SameLula = countriesT2.reduce((acc, c) => acc + c.turno1.votosLula, 0);
  const t1SameBolsonaro = countriesT2.reduce((acc, c) => acc + c.turno1.votosBolsonaro, 0);
  const t1SameValidos = t1SameLula + t1SameBolsonaro;
  const t1SamePctLula = t1SameValidos > 0 ? (t1SameLula / t1SameValidos) * 100 : 0;
  const t1SamePctBolsonaro = t1SameValidos > 0 ? (t1SameBolsonaro / t1SameValidos) * 100 : 0;

  // 1º Turno Total across all 100+ countries
  const t1TotalLula = countries.reduce((acc, c) => acc + c.turno1.votosLula, 0);
  const t1TotalBolsonaro = countries.reduce((acc, c) => acc + c.turno1.votosBolsonaro, 0);
  const t1TotalValidos = t1TotalLula + t1TotalBolsonaro;

  const deltaLula = t2PctLula - t1SamePctLula;
  const deltaBolsonaro = t2PctBolsonaro - t1SamePctBolsonaro;
  const deltaLulaVotos = t2VotosLula - t1SameLula;
  const deltaBolsonaroVotos = t2VotosBolsonaro - t1SameBolsonaro;

  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 p-5 md:p-6 mb-6">
      {/* Status Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 mb-5 border-b border-slate-100 dark:border-slate-800">
        <div>
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            Apuração Parcial do 2º Turno (Hoje)
          </span>
          <h2 className="text-xl md:text-2xl font-black text-slate-900 dark:text-white mt-1">
            Comparação Geral da Votação no Exterior
          </h2>
        </div>

        <div className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-2">
          <span className="font-semibold text-slate-800 dark:text-slate-200">
            {countriesT2.length} países apurados no 2ºT
          </span>
          <span>•</span>
          <span>{countriesPending.length} aguardando apuração</span>
        </div>
      </div>

      {/* Main Candidate Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-5">
        {/* LULA */}
        <div className="rounded-xl border border-red-200 dark:border-red-950/80 bg-red-50/30 dark:bg-red-950/20 p-4">
          <div className="flex justify-between items-start">
            <div>
              <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-red-600 text-white">
                13 • PT
              </span>
              <h3 className="text-lg font-black text-slate-900 dark:text-white mt-1">
                {candidates.lula.name}
              </h3>
            </div>
            <div className="text-right">
              <div className="text-2xl md:text-3xl font-black text-red-600 dark:text-red-400">
                {t2PctLula.toFixed(2)}%
              </div>
              <div className="text-[11px] text-slate-500 font-medium">no 2º turno hoje</div>
            </div>
          </div>

          <div className="mt-3 pt-3 border-t border-red-100 dark:border-red-900/40 grid grid-cols-2 gap-2 text-xs">
            <div>
              <span className="text-slate-500 block">Votos no 2º Turno:</span>
              <span className="font-bold text-slate-900 dark:text-white text-base">
                {t2VotosLula.toLocaleString('pt-BR')}
              </span>
            </div>
            <div>
              <span className="text-slate-500 block">1ºT (mesmos países):</span>
              <span className="font-bold text-slate-700 dark:text-slate-300 text-base">
                {t1SameLula.toLocaleString('pt-BR')} ({t1SamePctLula.toFixed(1)}%)
              </span>
            </div>
          </div>

          <div className="mt-2 pt-2 border-t border-red-100/60 dark:border-red-900/20 flex items-center justify-between text-xs">
            <span className="text-slate-500">Variação frente ao 1ºT:</span>
            <div className="flex items-center gap-1.5 font-bold">
              <span className={`flex items-center ${deltaLula >= 0 ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'}`}>
                {deltaLula >= 0 ? <TrendingUp className="w-3.5 h-3.5 mr-0.5" /> : <TrendingDown className="w-3.5 h-3.5 mr-0.5" />}
                {deltaLula >= 0 ? `+${deltaLula.toFixed(2)}%` : `${deltaLula.toFixed(2)}%`}
              </span>
              <span className={`text-[11px] font-semibold ${deltaLulaVotos >= 0 ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'}`}>
                ({deltaLulaVotos >= 0 ? `+${deltaLulaVotos.toLocaleString('pt-BR')}` : deltaLulaVotos.toLocaleString('pt-BR')})
              </span>
            </div>
          </div>
        </div>

        {/* FLÁVIO BOLSONARO */}
        <div className="rounded-xl border border-blue-200 dark:border-blue-950/80 bg-blue-50/30 dark:bg-blue-950/20 p-4">
          <div className="flex justify-between items-start">
            <div>
              <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-blue-600 text-white">
                22 • PL
              </span>
              <h3 className="text-lg font-black text-slate-900 dark:text-white mt-1">
                {candidates.bolsonaro.name}
              </h3>
            </div>
            <div className="text-right">
              <div className="text-2xl md:text-3xl font-black text-blue-600 dark:text-blue-400">
                {t2PctBolsonaro.toFixed(2)}%
              </div>
              <div className="text-[11px] text-slate-500 font-medium">no 2º turno hoje</div>
            </div>
          </div>

          <div className="mt-3 pt-3 border-t border-blue-100 dark:border-blue-900/40 grid grid-cols-2 gap-2 text-xs">
            <div>
              <span className="text-slate-500 block">Votos no 2º Turno:</span>
              <span className="font-bold text-slate-900 dark:text-white text-base">
                {t2VotosBolsonaro.toLocaleString('pt-BR')}
              </span>
            </div>
            <div>
              <span className="text-slate-500 block">1ºT (mesmos países):</span>
              <span className="font-bold text-slate-700 dark:text-slate-300 text-base">
                {t1SameBolsonaro.toLocaleString('pt-BR')} ({t1SamePctBolsonaro.toFixed(1)}%)
              </span>
            </div>
          </div>

          <div className="mt-2 pt-2 border-t border-blue-100/60 dark:border-blue-900/20 flex items-center justify-between text-xs">
            <span className="text-slate-500">Variação frente ao 1ºT:</span>
            <div className="flex items-center gap-1.5 font-bold">
              <span className={`flex items-center ${deltaBolsonaro >= 0 ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'}`}>
                {deltaBolsonaro >= 0 ? <TrendingUp className="w-3.5 h-3.5 mr-0.5" /> : <TrendingDown className="w-3.5 h-3.5 mr-0.5" />}
                {deltaBolsonaro >= 0 ? `+${deltaBolsonaro.toFixed(2)}%` : `${deltaBolsonaro.toFixed(2)}%`}
              </span>
              <span className={`text-[11px] font-semibold ${deltaBolsonaroVotos >= 0 ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'}`}>
                ({deltaBolsonaroVotos >= 0 ? `+${deltaBolsonaroVotos.toLocaleString('pt-BR')}` : deltaBolsonaroVotos.toLocaleString('pt-BR')})
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Progress Bar 2º Turno */}
      <div className="space-y-1.5">
        <div className="flex justify-between text-xs font-bold text-slate-600 dark:text-slate-400">
          <span className="text-red-600 dark:text-red-400">Lula: {t2PctLula.toFixed(1)}%</span>
          <span className="text-slate-400 font-normal">Placar Provisório 2ºT</span>
          <span className="text-blue-600 dark:text-blue-400">Flávio: {t2PctBolsonaro.toFixed(1)}%</span>
        </div>

        <div className="h-3.5 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden flex relative">
          <div
            className="h-full bg-red-600 transition-all duration-500"
            style={{ width: `${t2PctLula}%` }}
          ></div>
          <div className="absolute top-0 bottom-0 left-1/2 w-0.5 bg-slate-900/40 dark:bg-white/50 z-10 pointer-events-none"></div>
          <div
            className="h-full bg-blue-600 transition-all duration-500"
            style={{ width: `${t2PctBolsonaro}%` }}
          ></div>
        </div>

        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center text-[11px] text-slate-500 dark:text-slate-400 pt-1 gap-1">
          <span>
            Total apurado no 2ºT hoje: <strong>{t2Validos.toLocaleString('pt-BR')}</strong> votos válidos ({countriesT2.length} países).
          </span>
          <span className="font-semibold text-slate-600 dark:text-slate-300">
            Total consolidado 1ºT (todos os 100 países): {t1TotalValidos.toLocaleString('pt-BR')} votos válidos
          </span>
        </div>
      </div>
    </div>
  );
};
