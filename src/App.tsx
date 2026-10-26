/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { PresidentialElectionData, ApiResponse, DataProvenance, FetchStatus } from './types/election';
import { initialPresidentialData } from './data/presidentialData';
import { TseHeader } from './components/TseHeader';
import { NationalSummary } from './components/NationalSummary';
import { StateCountryBreakdown } from './components/StateCountryBreakdown';
import { ImportDataModal } from './components/ImportDataModal';
import { WifiOff, ShieldCheck, Database, History } from 'lucide-react';

export default function App() {
  const [presidentialData, setPresidentialData] = useState<PresidentialElectionData>(initialPresidentialData);
  const [currentTurn, setCurrentTurn] = useState<1 | 2>(2);
  const [selectedScope, setSelectedScope] = useState<string>('BR');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isImportModalOpen, setIsImportModalOpen] = useState<boolean>(false);
  const [fetchStatus, setFetchStatus] = useState<FetchStatus>('CACHE_FALLBACK');
  const [provenance, setProvenance] = useState<DataProvenance>('DEMONSTRATIVE_BASELINE');
  const [requestSucceeded, setRequestSucceeded] = useState<boolean>(false);
  const [dataAgeSeconds, setDataAgeSeconds] = useState<number | null>(null);
  const [fetchError, setFetchError] = useState<string | null>(null);
  const [isStale, setIsStale] = useState<boolean>(false);
  const [lastSuccessfulFetchAt, setLastSuccessfulFetchAt] = useState<string | null>(null);
  const [darkMode, setDarkMode] = useState<boolean>(false);

  const isFetchingRef = useRef<boolean>(false);
  const abortControllerRef = useRef<AbortController | null>(null);

  const fetchData = useCallback(async (scope: string = selectedScope, turn: 1 | 2 = currentTurn) => {
    if (isFetchingRef.current) return;
    isFetchingRef.current = true;
    setIsLoading(true);

    const controller = new AbortController();
    abortControllerRef.current = controller;

    try {
      const response = await fetch(`/api/data?scope=${encodeURIComponent(scope)}&turn=${turn}`, {
        signal: controller.signal
      });

      if (response && response.ok) {
        const result: ApiResponse = await response.json();
        if (result) {
          setFetchStatus(result.status);
          setProvenance(result.provenance);
          setRequestSucceeded(result.requestSucceeded);
          setDataAgeSeconds(result.dataAgeSeconds);
          setFetchError(result.fetchError);
          setIsStale(result.isStale);
          setLastSuccessfulFetchAt(result.lastSuccessfulFetchAt);

          if (result.presidentialData) {
            setPresidentialData(result.presidentialData);
          }
        }
      } else {
        setFetchStatus('FETCH_ERROR');
        setRequestSucceeded(false);
        setFetchError(`Erro HTTP ${response.status} ao conectar à API do TSE.`);
      }
    } catch (err: any) {
      if (err.name !== 'AbortError') {
        setFetchStatus('FETCH_ERROR');
        setRequestSucceeded(false);
        setFetchError(err.message || 'Falha ao consultar serviço de apuração.');
      }
    } finally {
      setIsLoading(false);
      isFetchingRef.current = false;
    }
  }, [selectedScope, currentTurn]);

  // Initial fetch on mount
  useEffect(() => {
    fetchData(selectedScope, currentTurn);
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, []);

  // Scope or turn change
  const handleTurnChange = (newTurn: 1 | 2) => {
    setCurrentTurn(newTurn);
    fetchData(selectedScope, newTurn);
  };

  const handleScopeChange = (newScope: string) => {
    setSelectedScope(newScope);
    fetchData(newScope, currentTurn);
  };

  // Automatic 60s periodic polling
  useEffect(() => {
    const interval = setInterval(() => {
      fetchData(selectedScope, currentTurn);
    }, 60000);
    return () => clearInterval(interval);
  }, [fetchData, selectedScope, currentTurn]);

  const activeRoundData = currentTurn === 2 ? presidentialData.turno2 : presidentialData.turno1;

  return (
    <div className={darkMode ? 'dark' : ''}>
      <div className="min-h-screen bg-slate-100 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors pb-12">
        {/* TSE Official Header */}
        <TseHeader
          currentTurn={currentTurn}
          onTurnChange={handleTurnChange}
          selectedScope={selectedScope}
          onScopeChange={handleScopeChange}
          totalizedSectionsPct={activeRoundData.totalizedSectionsPct}
          provenance={provenance}
          isStale={isStale}
          dataHoraGeracaoTse={presidentialData.audit?.dataHoraGeracaoTse || null}
          lastSuccessfulFetchAt={lastSuccessfulFetchAt}
          dataAgeSeconds={dataAgeSeconds}
          requestSucceeded={requestSucceeded}
          isLoading={isLoading}
          onRefresh={() => fetchData(selectedScope, currentTurn)}
          onOpenImportModal={() => setIsImportModalOpen(true)}
          darkMode={darkMode}
          onToggleDarkMode={() => setDarkMode(!darkMode)}
        />

        {/* Main Portal Content */}
        <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
          {/* Live Fetch Failure / Fallback Notice Banner */}
          {fetchError && (
            <div className="bg-amber-500/10 border-2 border-amber-500/40 rounded-2xl p-4 text-xs font-semibold text-amber-900 dark:text-amber-200 flex items-start gap-3 shadow-xs">
              <WifiOff className="w-5 h-5 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
              <div>
                <p className="font-extrabold text-amber-800 dark:text-amber-300">
                  Status da Conexão Oficial: {provenance === 'OFFICIAL_TSE_CACHE' ? 'Histórico em Cache' : 'Base de Espera'}
                </p>
                <p className="mt-0.5 text-amber-700 dark:text-amber-300/90">
                  A consulta ao servidor do TSE para o escopo <strong>{selectedScope}</strong> retornou: <em>{fetchError}</em>.
                  O painel está apresentando os dados isolados deste escopo e continuará tentando conectar automaticamente a cada 60s.
                </p>
              </div>
            </div>
          )}

          {/* Key Highlights Banner */}
          <div className="bg-slate-900 text-white border border-slate-800 rounded-2xl p-4 text-xs font-medium shadow-sm">
            <span className="font-bold uppercase tracking-wider text-amber-400 block mb-1">
              📢 Painel de Apuração e Auditoria Oficial (Eleição {currentTurn === 2 ? '6258' : '6257'} • Escopo: {selectedScope}):
            </span>
            <ul className="list-disc list-inside space-y-1 text-slate-300">
              {presidentialData.keyHighlights.map((hl, idx) => (
                <li key={idx}>{hl}</li>
              ))}
            </ul>
          </div>

          {/* 1. Candidate Cards & Electoral Metrics */}
          <NationalSummary
            roundData={activeRoundData}
            locationName={
              selectedScope === 'BR'
                ? 'Brasil (Totalização Nacional)'
                : selectedScope === 'ZZ'
                ? 'Exterior (Zona ZZ)'
                : `Estado: ${selectedScope}`
            }
            audit={presidentialData.audit}
          />

          {/* 2. Detailed Breakdown by State (UFs) & Exterior (Zona ZZ) */}
          <StateCountryBreakdown
            locations={activeRoundData.locations}
            onSelectScope={handleScopeChange}
          />
        </main>

        {/* Import / Edit Data Modal */}
        <ImportDataModal
          isOpen={isImportModalOpen}
          onClose={() => setIsImportModalOpen(false)}
          currentData={presidentialData}
          onSaveData={(newData) => {
            setPresidentialData(newData);
            setProvenance('MANUAL_IMPORT_UNVERIFIED');
            setFetchStatus('MANUAL_IMPORTED');
            setRequestSucceeded(false); // Manual import must never pretend to be a live official fetch (Issue 7)
          }}
        />

        {/* TSE Official Footer */}
        <footer className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 mt-12 border-t border-slate-200 dark:border-slate-800 text-center text-xs text-slate-500 dark:text-slate-400">
          <p className="font-semibold text-slate-700 dark:text-slate-300">
            Tribunal Superior Eleitoral • Justiça Eleitoral (Eleições 2026)
          </p>
          <p className="mt-1">
            Fonte: Sistema de Resultados da Justiça Eleitoral ({presidentialData.source}).
          </p>
          <p className="text-[11px] text-slate-400 mt-1">
            Procedência do Registro: <strong>{provenance}</strong>
            {presidentialData.audit?.contentHash && ` • Hash SHA-256: ${presidentialData.audit.contentHash.slice(0, 12)}...`}
          </p>
        </footer>
      </div>
    </div>
  );
}
