/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useCallback } from 'react';
import { ElectionData } from './types/election';
import { initialElectionData } from './data/initialData';
import { Scorecard } from './components/Scorecard';
import { CountryTable } from './components/CountryTable';
import { RefreshCw, Sun, Moon } from 'lucide-react';

export default function App() {
  const [data, setData] = useState<ElectionData>(initialElectionData);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [lastUpdated, setLastUpdated] = useState<string>(initialElectionData.updatedAt || new Date().toISOString());
  const [darkMode, setDarkMode] = useState<boolean>(false);

  const fetchData = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/data').catch(() =>
        fetch('/api/scrape-g1', { method: 'GET' })
      );

      if (response && response.ok) {
        const result = await response.json();
        if (result && result.data && Array.isArray(result.data.countries) && result.data.countries.length > 0) {
          setData(result.data);
          setLastUpdated(new Date().toISOString());
        }
      }
    } catch (err) {
      // Kept silent with fallback to local cached dataset
      console.warn('Usando dados eleitorais locais em cache:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Auto-refresh quietly in the background every 60 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      fetchData();
    }, 60000);
    return () => clearInterval(interval);
  }, [fetchData]);

  return (
    <div className={darkMode ? 'dark' : ''}>
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors">
        {/* Simple & Clean Header */}
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
              <span className="hidden sm:inline-flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 px-3 py-1.5 rounded-xl">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                Atualizado: {new Date(lastUpdated).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
              </span>

              <button
                onClick={() => fetchData()}
                disabled={isLoading}
                title="Atualizar dados agora"
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

        {/* Main Content: Just the General Comparison and Country/Region Comparison */}
        <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="space-y-6">
            {/* 1. Comparação Geral */}
            <Scorecard data={data} />

            {/* 2. Comparação por Países e Região */}
            <CountryTable countries={data.countries} />
          </div>
        </main>

        {/* Minimal Footer */}
        <footer className="border-t border-slate-200 dark:border-slate-800 py-6 mt-12 text-center text-xs text-slate-500 dark:text-slate-400">
          <p>
            Fonte de dados: https://g1.globo.com/mundo/noticia/2026/10/25/votacao-no-exterior-confira-os-resultados-do-2o-turno-entre-lula-e-flavio-bolsonaro.ghtml
          </p>
        </footer>
      </div>
    </div>
  );
}
