/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { PresidentialElectionData, ApiResponse } from './types/election';
import { initialPresidentialData } from './data/presidentialData';
import { TseHeader } from './components/TseHeader';
import { NationalSummary } from './components/NationalSummary';
import { StateCountryBreakdown } from './components/StateCountryBreakdown';
import { ImportDataModal } from './components/ImportDataModal';

export default function App() {
  const [presidentialData, setPresidentialData] = useState<PresidentialElectionData>(initialPresidentialData);
  const [currentTurn, setCurrentTurn] = useState<1 | 2>(2);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isImportModalOpen, setIsImportModalOpen] = useState<boolean>(false);
  const [lastFetchedAt, setLastFetchedAt] = useState<string | null>(null);
  const [dataUpdatedAt, setDataUpdatedAt] = useState<string | null>(
    initialPresidentialData.dataUpdatedAt || '2026-10-25T20:30:00.000Z'
  );
  const [darkMode, setDarkMode] = useState<boolean>(false);

  const isFetchingRef = useRef<boolean>(false);
  const abortControllerRef = useRef<AbortController | null>(null);

  const fetchData = useCallback(async () => {
    if (isFetchingRef.current) return;
    isFetchingRef.current = true;
    setIsLoading(true);

    const controller = new AbortController();
    abortControllerRef.current = controller;

    try {
      const response = await fetch('/api/data', { signal: controller.signal });
      if (response && response.ok) {
        const result: ApiResponse = await response.json();
        if (result && result.success) {
          if (result.presidentialData) {
            setPresidentialData(result.presidentialData);
          }
          setLastFetchedAt(result.lastFetchedAt);
          if (result.dataUpdatedAt) {
            setDataUpdatedAt(result.dataUpdatedAt);
          }
        }
      }
    } catch (err: any) {
      if (err.name !== 'AbortError') {
        console.warn('Erro ao consultar dados do TSE:', err);
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

  // Automatic 60s periodic polling
  useEffect(() => {
    const interval = setInterval(() => {
      fetchData();
    }, 60000);
    return () => clearInterval(interval);
  }, [fetchData]);

  const activeRoundData = currentTurn === 2 ? presidentialData.turno2 : presidentialData.turno1;

  return (
    <div className={darkMode ? 'dark' : ''}>
      <div className="min-h-screen bg-slate-100 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors pb-12">
        {/* TSE Official Header */}
        <TseHeader
          currentTurn={currentTurn}
          onTurnChange={(t) => setCurrentTurn(t)}
          totalizedSectionsPct={activeRoundData.totalizedSectionsPct}
          dataUpdatedAt={dataUpdatedAt}
          lastFetchedAt={lastFetchedAt}
          isLoading={isLoading}
          onRefresh={fetchData}
          onOpenImportModal={() => setIsImportModalOpen(true)}
          darkMode={darkMode}
          onToggleDarkMode={() => setDarkMode(!darkMode)}
        />

        {/* Main Portal Content */}
        <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
          {/* Key Highlights Banner */}
          <div className="bg-amber-500/10 dark:bg-amber-500/10 border border-amber-500/30 rounded-2xl p-4 text-xs font-medium text-amber-900 dark:text-amber-200">
            <span className="font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400 block mb-1">
              📢 Totalização Oficial das Eleições 2026 (Presidente da República):
            </span>
            <ul className="list-disc list-inside space-y-1">
              {presidentialData.keyHighlights.map((hl, idx) => (
                <li key={idx}>{hl}</li>
              ))}
            </ul>
          </div>

          {/* 1. National Candidate Cards & Electoral Metrics */}
          <NationalSummary roundData={activeRoundData} locationName="Brasil & Exterior — Eleições Presidenciais 2026" />

          {/* 2. Detailed Breakdown by State (UFs) & Exterior (Zona ZZ) */}
          <StateCountryBreakdown locations={activeRoundData.locations} />
        </main>

        {/* Import / Edit Data Modal */}
        <ImportDataModal
          isOpen={isImportModalOpen}
          onClose={() => setIsImportModalOpen(false)}
          currentData={presidentialData}
          onSaveData={(newData) => {
            setPresidentialData(newData);
            setDataUpdatedAt(newData.dataUpdatedAt || new Date().toISOString());
          }}
        />

        {/* TSE Official Footer */}
        <footer className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 mt-12 border-t border-slate-200 dark:border-slate-800 text-center text-xs text-slate-500 dark:text-slate-400">
          <p className="font-semibold text-slate-700 dark:text-slate-300">
            Tribunal Superior Eleitoral • Justiça Eleitoral (Eleições 2026)
          </p>
          <p className="mt-1">
            Fonte Oficial: Dados Abertos e Sistema de Divulgação de Resultados do TSE para Presidente da República ({presidentialData.source}).
          </p>
        </footer>
      </div>
    </div>
  );
}
