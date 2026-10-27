/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { RefreshCw, Sun, Moon, ShieldCheck, AlertTriangle, Database, Globe, MapPin, Clock } from 'lucide-react';
import { DataProvenance } from '../types/election';

interface TseHeaderProps {
  currentTurn: 1 | 2;
  onTurnChange: (turn: 1 | 2) => void;
  totalizedSectionsPct: number | null;
  provenance: DataProvenance;
  isStale: boolean;
  dataHoraGeracaoTse: string | null;
  lastSuccessfulFetchAt: string | null;
  dataAgeSeconds: number | null;
  requestSucceeded: boolean;
  isLoading: boolean;
  onRefresh: () => void;
  darkMode: boolean;
  onToggleDarkMode: () => void;
}

export const TseHeader: React.FC<TseHeaderProps> = ({
  currentTurn,
  onTurnChange,
  totalizedSectionsPct,
  provenance,
  isStale,
  dataHoraGeracaoTse,
  lastSuccessfulFetchAt,
  dataAgeSeconds,
  isLoading,
  onRefresh,
  darkMode,
  onToggleDarkMode
}) => {
  const formattedSyncTime = lastSuccessfulFetchAt
    ? new Date(lastSuccessfulFetchAt).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit', second: '2-digit' })
    : null;

  const formatAge = (seconds: number | null): string => {
    if (seconds === null) return 'Desconhecida';
    if (seconds < 60) return `${seconds}s atrás`;
    const mins = Math.floor(seconds / 60);
    if (mins < 60) return `${mins}m atrás`;
    const hours = Math.floor(mins / 60);
    return `${hours}h atrás`;
  };

  return (
    <header className="sticky top-0 z-40 bg-slate-900 text-white border-b border-slate-800 shadow-md">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Top Branding & Provenance Bar */}
        <div className="h-16 flex items-center justify-between border-b border-slate-800/80 gap-3">
          <div className="flex items-center gap-3">
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="font-extrabold text-white text-base md:text-lg tracking-tight leading-tight">
                  Divulgação de Resultados
                </h1>

                {/* Provenance Badge */}
                {provenance === 'OFFICIAL_TSE_LIVE' && (
                  <span className="bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 text-[10px] font-extrabold px-2 py-0.5 rounded-full flex items-center gap-1 uppercase tracking-wider">
                    <ShieldCheck className="w-3 h-3 text-emerald-400" />
                    Conectado
                  </span>
                )}
                {provenance === 'OFFICIAL_TSE_CACHE' && (
                  <span className="bg-blue-500/20 text-blue-300 border border-blue-500/40 text-[10px] font-extrabold px-2 py-0.5 rounded-full flex items-center gap-1 uppercase tracking-wider">
                    <Database className="w-3 h-3 text-blue-400" />
                    Histórico Oficial TSE (Cache)
                  </span>
                )}
                {provenance === 'DEMONSTRATIVE_BASELINE' && (
                  <span className="bg-amber-500/20 text-amber-300 border border-amber-500/40 text-[10px] font-extrabold px-2 py-0.5 rounded-full flex items-center gap-1 uppercase tracking-wider">
                    <AlertTriangle className="w-3 h-3 text-amber-400" />
                    Base Demonstrativa
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-400">
                Eleição Presidencial 2026
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Separate Audit Timestamps & Data Age */}
            <div className="hidden lg:flex flex-col text-right px-2 border-r border-slate-800 text-[11px]">
              <span className="font-semibold text-slate-200">
                {dataHoraGeracaoTse ? `Geração TSE: ${dataHoraGeracaoTse}` : 'Aguardando Geração Oficial'}
              </span>
              <span className="text-[10px] text-slate-400 flex items-center gap-1 justify-end">
                <Clock className="w-2.5 h-2.5 text-slate-400" />
                {formattedSyncTime ? `Consulta: ${formattedSyncTime}` : 'Sem consulta ao vivo'}
                {dataAgeSeconds !== null && (
                  <span className="text-slate-300 font-medium">({formatAge(dataAgeSeconds)})</span>
                )}
                {isStale && <span className="text-amber-400 font-bold">(dados salvos)</span>}
              </span>
            </div>

            <button
              onClick={onRefresh}
              disabled={isLoading}
              title="Consultar servidor oficial do TSE"
              className="p-2 rounded-xl text-slate-300 hover:text-white hover:bg-slate-800 transition-colors disabled:opacity-50"
            >
              <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
            </button>

            <button
              onClick={onToggleDarkMode}
              className="p-2 rounded-xl text-slate-300 hover:text-white hover:bg-slate-800 transition-colors"
              title={darkMode ? 'Modo claro' : 'Modo escuro'}
            >
              {darkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* Turn & Scope Filter Controls Bar */}
        <div className="py-2.5 flex flex-col md:flex-row items-center justify-between gap-3 text-xs">
          {/* Turn Tabs */}
          <div className="flex items-center gap-2 flex-wrap">
            <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-xl border border-slate-800">
              <button
                onClick={() => onTurnChange(2)}
                className={`px-3 py-1.5 rounded-lg font-bold transition-all ${
                  currentTurn === 2
                    ? 'bg-amber-500 text-slate-950 shadow-sm'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                2º Turno 
              </button>
              <button
                onClick={() => onTurnChange(1)}
                className={`px-3 py-1.5 rounded-lg font-bold transition-all ${
                  currentTurn === 1
                    ? 'bg-amber-500 text-slate-950 shadow-sm'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                1º Turno
              </button>
            </div>
          </div>

          {/* Section Progress Bar */}
          <div className="w-full md:w-auto flex items-center justify-between md:justify-start gap-3 bg-slate-800/60 px-3 py-1.5 rounded-xl border border-slate-700/50">
            <span className="text-slate-300 font-medium text-nowrap">
              Seções Apuradas (Brasil):
            </span>
            {totalizedSectionsPct !== null ? (
              <>
                <div className="w-28 sm:w-36 bg-slate-950 rounded-full h-2 overflow-hidden border border-slate-700/50">
                  <div
                    className="bg-emerald-500 h-full rounded-full transition-all duration-500"
                    style={{ width: `${Math.min(100, Math.max(0, totalizedSectionsPct))}%` }}
                  ></div>
                </div>
                <span className="font-extrabold text-emerald-400 text-nowrap">
                  {totalizedSectionsPct.toFixed(2).replace('.', ',')}%
                </span>
              </>
            ) : (
              <span className="font-semibold text-amber-400 text-nowrap text-[11px]">
                Aguardando Apuração
              </span>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
