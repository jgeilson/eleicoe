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
import { WifiOff, Globe, MapPin } from 'lucide-react';

export default function App() {
  const [presidentialData, setPresidentialData] = useState<PresidentialElectionData>(initialPresidentialData);
  const [currentTurn, setCurrentTurn] = useState<1 | 2>(2);
  const [activeTab, setActiveTab] = useState<'nacional' | 'estados'>('nacional');
  const [isLoading, setIsLoading] = useState<boolean>(false);
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
  const currentTurnRef = useRef<1 | 2>(currentTurn);

  useEffect(() => {
    currentTurnRef.current = currentTurn;
  }, [currentTurn]);

  const fetchData = useCallback(async (turn: 1 | 2 = currentTurnRef.current) => {
    if (isFetchingRef.current) return;
    isFetchingRef.current = true;
    setIsLoading(true);

    const controller = new AbortController();
    abortControllerRef.current = controller;

    try {
      const response = await fetch(`/api/data?scope=BR&turn=${turn}&cargo=0001`, {
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
  }, []);

  // Initial fetch on mount
  useEffect(() => {
    fetchData(currentTurn);
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, []);

  // Turn change
  const handleTurnChange = (newTurn: 1 | 2) => {
    setCurrentTurn(newTurn);
    fetchData(newTurn);
  };

  // Automatic 60s periodic polling
  useEffect(() => {
    const interval = setInterval(() => {
      fetchData(currentTurnRef.current);
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
          onTurnChange={handleTurnChange}
          totalizedSectionsPct={activeRoundData.totalizedSectionsPct}
          provenance={provenance}
          isStale={isStale}
          dataHoraGeracaoTse={presidentialData.audit?.dataHoraGeracaoTse || null}
          lastSuccessfulFetchAt={lastSuccessfulFetchAt}
          dataAgeSeconds={dataAgeSeconds}
          requestSucceeded={requestSucceeded}
          isLoading={isLoading}
          onRefresh={() => fetchData(currentTurn)}
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
                  A consulta ao servidor do TSE para o escopo <strong>Brasil (Nacional)</strong> retornou: <em>{fetchError}</em>.
                  O painel está apresentando os dados oficiais consolidados e continuará tentando conectar automaticamente a cada 60s.
                </p>
              </div>
            </div>
          )}

          {/* Tab Navigation: Resultado Nacional e Resultados por Estado e Exterior */}
          <div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-4">
            <button
              onClick={() => setActiveTab('nacional')}
              className={`px-4 py-2.5 rounded-xl font-extrabold text-sm transition-all flex items-center gap-2 ${
                activeTab === 'nacional'
                  ? 'bg-amber-500 text-slate-950 shadow-md'
                  : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white border border-slate-200 dark:border-slate-800'
              }`}
            >
              <Globe className="w-4 h-4" />
              Resultado Nacional
            </button>
            <button
              onClick={() => setActiveTab('estados')}
              className={`px-4 py-2.5 rounded-xl font-extrabold text-sm transition-all flex items-center gap-2 ${
                activeTab === 'estados'
                  ? 'bg-amber-500 text-slate-950 shadow-md'
                  : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white border border-slate-200 dark:border-slate-800'
              }`}
            >
              <MapPin className="w-4 h-4" />
              Resultados por Estado e Exterior
            </button>
          </div>

          {/* Tab Content */}
          {activeTab === 'nacional' ? (
            <NationalSummary
              roundData={activeRoundData}
              locationName="Brasil"
              audit={presidentialData.audit}
            />
          ) : (
            <StateCountryBreakdown
              locations={activeRoundData.locations}
            />
          )}
        </main>
      </div>
    </div>
  );
}
