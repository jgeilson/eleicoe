/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { ElectionData, ApiResponse, FetchStatus } from './types/election';
import { initialElectionData } from './data/initialData';
import { Scorecard } from './components/Scorecard';
import { CountryTable } from './components/CountryTable';
import { RefreshCw, Sun, Moon, CheckCircle, AlertCircle, Clock } from 'lucide-react';

export default function App() {
  const [data, setData] = useState<ElectionData>(initialElectionData);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [lastFetchedAt, setLastFetchedAt] = useState<string | null>(null);
  const [dataUpdatedAt, setDataUpdatedAt] = useState<string | null>(
    initialElectionData.dataUpdatedAt || '2026-10-25T14:32:00.000Z'
  );
  const [fetchStatus, setFetchStatus] = useState<FetchStatus>('CACHE_FALLBACK');
  const [fetchError, setFetchError] = useState<string | null>(null);
  const [darkMode, setDarkMode] = useState<boolean>(false);

  const isFetchingRef = useRef<boolean>(false);
  const abortControllerRef = useRef<AbortController | null>(null);

  const fetchData = useCallback(async () => {
    // Prevent overlapping queries
    if (isFetchingRef.current) return;
    isFetchingRef.current = true;
    setIsLoading(true);

    // Cancel previous in-flight request if any
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    const controller = new AbortController();
    abortControllerRef.current = controller;

    try {
      const response = await fetch('/api/data', { signal: controller.signal });
      if (response && response.ok) {
        const result: ApiResponse = await response.json();
        if (result && result.success && result.data) {
          setData(result.data);
          setFetchStatus(result.status);
          setFetchError(result.fetchError);
          setLastFetchedAt(result.lastFetchedAt);
          if (result.dataUpdatedAt) {
            setDataUpdatedAt(result.dataUpdatedAt);
          }
        }
      } else {
        setFetchStatus('CACHE_FALLBACK');
      }
    } catch (err: any) {
      if (err.name !== 'AbortError') {
        console.warn('Erro ao consultar dados:', err);
        setFetchStatus('CACHE_FALLBACK');
      }
    } finally {
      setIsLoading(false);
      isFetchingRef.current = false;
    }
  }, []);

  // Initial fetch on mount
  useEffect(() => {
    fetchData();
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, [fetchData]);

  // Automatic periodic refresh every 60 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      fetchData();
    }, 60000);
    return () => clearInterval(interval);
  }, [fetchData]);

  const formattedLastFetched = lastFetchedAt
    ? new Date(lastFetchedAt).toLocaleTimeString('pt-BR', {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
      })
    : null;

  const formattedDataUpdated = dataUpdatedAt
    ? new Date(dataUpdatedAt).toLocaleTimeString('pt-BR', {
        hour: '2-digit',
        minute: '2-digit'
      })
    : 'Desconhecido';

  return (
    <div className={darkMode ? 'dark' : ''}>
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors">
        {/* Header */}
        <header className="sticky top-0 z-40 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-b border-slate-200 dark:border-slate-800">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-slate-900 dark:bg-slate-800 flex items-center justify-center text-white shadow-sm text-lg">
                🗳️
              </div>
              <div>
                <h1 className="font-extrabold text-slate-900 dark:text-white text-base md:text-lg tracking-tight leading-tight">
                  Eleições 2026 • Votação no Exterior
                </h1>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Comparação do 1º Turno vs 2º Turno (Lula x Flávio Bolsonaro)
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <div className="hidden sm:flex flex-col text-right pr-2 border-r border-slate-200 dark:border-slate-800">
                <span className="text-[11px] font-bold text-slate-700 dark:text-slate-200">
                  Dados dos Votos: {formattedDataUpdated}
                </span>
                <span className="text-[10px] text-slate-400 flex items-center gap-1 justify-end mt-0.5">
                  {fetchStatus === 'LIVE_UPDATED' && (
                    <>
                      <CheckCircle className="w-2.5 h-2.5 text-emerald-500" />
                      <span className="text-emerald-600 dark:text-emerald-400 font-semibold">
                        Novos votos validados
                      </span>
                    </>
                  )}
                  {fetchStatus === 'LIVE_UNCHANGED' && (
                    <>
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                      <span>Checado às {formattedLastFetched} (sem alterações)</span>
                    </>
                  )}
                  {fetchStatus === 'CACHE_FALLBACK' && (
                    <>
                      <Clock className="w-2.5 h-2.5 text-slate-400" />
                      <span>
                        {formattedLastFetched ? `Checado às ${formattedLastFetched}` : 'Fonte salva'}
                      </span>
                    </>
                  )}
                </span>
              </div>

              <button
                onClick={() => fetchData()}
                disabled={isLoading}
                title="Consultar novas parciais agora"
                className="p-2 rounded-xl text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors disabled:opacity-50"
              >
                <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
              </button>

              <button
                onClick={() => setDarkMode(!darkMode)}
                className="p-2 rounded-xl text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                title={darkMode ? 'Tema claro' : 'Tema escuro'}
              >
                {darkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4" />}
              </button>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="space-y-6">
            {/* 1. Comparação Geral */}
            <Scorecard data={data} />

            {/* 2. Comparação por Países e Região */}
            <CountryTable countries={data.countries} />
          </div>
        </main>

        {/* Footer */}
        <footer className="border-t border-slate-200 dark:border-slate-800 py-6 mt-12 text-center text-xs text-slate-500 dark:text-slate-400">
          <p>
            Fonte de dados: https://g1.globo.com/mundo/noticia/2026/10/25/votacao-no-exterior-confira-os-resultados-do-2o-turno-entre-lula-e-flavio-bolsonaro.ghtml
          </p>
        </footer>
      </div>
    </div>
  );
}
