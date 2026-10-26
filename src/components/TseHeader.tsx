/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { RefreshCw, Sun, Moon, CheckCircle2, Upload } from 'lucide-react';

interface TseHeaderProps {
  currentTurn: 1 | 2;
  onTurnChange: (turn: 1 | 2) => void;
  totalizedSectionsPct: number;
  dataUpdatedAt: string | null;
  lastFetchedAt: string | null;
  isLoading: boolean;
  onRefresh: () => void;
  onOpenImportModal: () => void;
  darkMode: boolean;
  onToggleDarkMode: () => void;
}

export const TseHeader: React.FC<TseHeaderProps> = ({
  currentTurn,
  onTurnChange,
  totalizedSectionsPct,
  dataUpdatedAt,
  lastFetchedAt,
  isLoading,
  onRefresh,
  onOpenImportModal,
  darkMode,
  onToggleDarkMode
}) => {
  const formattedDataUpdated = dataUpdatedAt
    ? new Date(dataUpdatedAt).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })
    : '20:30';

  const formattedLastFetched = lastFetchedAt
    ? new Date(lastFetchedAt).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit', second: '2-digit' })
    : null;

  return (
    <header className="sticky top-0 z-40 bg-slate-900 text-white border-b border-slate-800 shadow-md">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Top Branding & Controls Bar */}
        <div className="h-16 flex items-center justify-between border-b border-slate-800/80">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-amber-500 flex items-center justify-center text-slate-950 font-black text-xl shadow-md">
              ⚖️
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="font-extrabold text-white text-base md:text-lg tracking-tight leading-tight">
                  TSE • Divulgação de Resultados
                </h1>
                <span className="bg-amber-500/20 text-amber-400 border border-amber-500/30 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">
                  Presidente
                </span>
              </div>
              <p className="text-xs text-amber-400 font-semibold">
                Eleição Presidencial 2026 • Apuração do TSE (Brasil & Exterior)
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            <button
              onClick={onOpenImportModal}
              className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-500 text-slate-950 font-extrabold text-xs hover:bg-amber-400 transition-all shadow-sm"
              title="Carregar ou colar boletim oficial de 2026"
            >
              <Upload className="w-3.5 h-3.5" />
              Carregar Dados 2026
            </button>

            <div className="hidden lg:flex flex-col text-right px-2 border-r border-slate-800">
              <span className="text-[11px] font-semibold text-slate-200">
                Totalização: {formattedDataUpdated}
              </span>
              <span className="text-[10px] text-slate-400 flex items-center gap-1 justify-end">
                <CheckCircle2 className="w-2.5 h-2.5 text-emerald-400" />
                {formattedLastFetched ? `Sincronizado às ${formattedLastFetched}` : 'Dados Oficiais'}
              </span>
            </div>

            <button
              onClick={onRefresh}
              disabled={isLoading}
              title="Consultar totalização no TSE"
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

        {/* Turn Switcher & Progress Bar */}
        <div className="py-2.5 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
          {/* Turn Tabs */}
          <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-xl border border-slate-800">
            <button
              onClick={() => onTurnChange(2)}
              className={`px-3.5 py-1.5 rounded-lg font-bold transition-all ${
                currentTurn === 2
                  ? 'bg-amber-500 text-slate-950 shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              2º Turno (Presidente)
            </button>
            <button
              onClick={() => onTurnChange(1)}
              className={`px-3.5 py-1.5 rounded-lg font-bold transition-all ${
                currentTurn === 1
                  ? 'bg-amber-500 text-slate-950 shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              1º Turno (Presidente)
            </button>
          </div>

          {/* Section Progress Bar */}
          <div className="w-full sm:w-auto flex items-center justify-between sm:justify-start gap-3 bg-slate-800/60 px-3 py-1.5 rounded-xl border border-slate-700/50">
            <span className="text-slate-300 font-medium text-nowrap">
              Seções Apuradas:
            </span>
            <div className="w-28 sm:w-36 bg-slate-950 rounded-full h-2 overflow-hidden border border-slate-700/50">
              <div
                className="bg-emerald-500 h-full rounded-full transition-all duration-500"
                style={{ width: `${totalizedSectionsPct}%` }}
              ></div>
            </div>
            <span className="font-extrabold text-emerald-400 text-nowrap">
              {totalizedSectionsPct.toFixed(2).replace('.', ',')}%
            </span>
          </div>
        </div>
      </div>
    </header>
  );
};
