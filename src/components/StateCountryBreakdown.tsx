/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo } from 'react';
import { LocationResult } from '../types/election';
import { Search, Filter, Globe, MapPin, CheckCircle, ArrowUpDown } from 'lucide-react';

interface StateCountryBreakdownProps {
  locations: LocationResult[];
  onSelectLocation?: (location: LocationResult | null) => void;
}

export const StateCountryBreakdown: React.FC<StateCountryBreakdownProps> = ({ locations }) => {
  const [search, setSearch] = useState('');
  const [selectedRegion, setSelectedRegion] = useState<string>('Todas');
  const [filterType, setFilterType] = useState<'TODOS' | 'ESTADO' | 'EXTERIOR'>('TODOS');
  const [sortBy, setSortBy] = useState<'name' | 'votes' | 'lulaPct' | 'bolsonaroPct'>('votes');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  const regions = ['Todas', 'Sudeste', 'Nordeste', 'Sul', 'Centro-Oeste', 'Norte', 'Exterior'];

  const filteredLocations = useMemo(() => {
    return locations
      .filter((loc) => {
        const matchesSearch =
          loc.name.toLowerCase().includes(search.toLowerCase()) ||
          loc.ufOrCode.toLowerCase().includes(search.toLowerCase());

        const matchesRegion = selectedRegion === 'Todas' || loc.region === selectedRegion;

        let matchesType = true;
        if (filterType === 'ESTADO') matchesType = loc.type === 'ESTADO';
        if (filterType === 'EXTERIOR') matchesType = loc.type === 'EXTERIOR';

        return matchesSearch && matchesRegion && matchesType;
      })
      .sort((a, b) => {
        let comp = 0;
        if (sortBy === 'name') {
          comp = a.name.localeCompare(b.name);
        } else if (sortBy === 'votes') {
          comp = a.totalValidVotes - b.totalValidVotes;
        } else if (sortBy === 'lulaPct') {
          const pA = a.candidates.find((c) => c.id === 'lula')?.percentage || 0;
          const pB = b.candidates.find((c) => c.id === 'lula')?.percentage || 0;
          comp = pA - pB;
        } else if (sortBy === 'bolsonaroPct') {
          const pA = a.candidates.find((c) => c.id === 'bolsonaro')?.percentage || 0;
          const pB = b.candidates.find((c) => c.id === 'bolsonaro')?.percentage || 0;
          comp = pA - pB;
        }
        return sortOrder === 'desc' ? -comp : comp;
      });
  }, [locations, search, selectedRegion, filterType, sortBy, sortOrder]);

  const toggleSort = (field: 'name' | 'votes' | 'lulaPct' | 'bolsonaroPct') => {
    if (sortBy === field) {
      setSortOrder((prev) => (prev === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortBy(field);
      setSortOrder('desc');
    }
  };

  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden p-5 space-y-4">
      {/* Header & Filter Controls */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 dark:border-slate-800 pb-4">
        <div>
          <h3 className="text-lg font-black text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
            <MapPin className="w-5 h-5 text-amber-500" />
            Resultados por Estado e Exterior
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Detalhamento de votação nas 27 UFs do Brasil e Exterior (Zona ZZ)
          </p>
        </div>

        {/* Filter Type Pills */}
        <div className="flex items-center gap-1.5 bg-slate-100 dark:bg-slate-800 p-1 rounded-xl">
          <button
            onClick={() => setFilterType('TODOS')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              filterType === 'TODOS'
                ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-sm'
                : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            Todos
          </button>
          <button
            onClick={() => setFilterType('ESTADO')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              filterType === 'ESTADO'
                ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-sm'
                : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            🗺️ Estados (UFs)
          </button>
          <button
            onClick={() => setFilterType('EXTERIOR')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              filterType === 'EXTERIOR'
                ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-sm'
                : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            🌐 Exterior (ZZ)
          </button>
        </div>
      </div>

      {/* Search and Region Selector */}
      <div className="flex flex-col sm:flex-row items-center gap-3">
        {/* Search */}
        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Buscar por Estado ou UF (ex: SP, Bahia)..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl pl-9 pr-4 py-2 text-xs font-medium text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-500"
          />
        </div>

        {/* Region Pills */}
        <div className="flex items-center gap-1 overflow-x-auto w-full pb-1 sm:pb-0 scrollbar-none">
          <Filter className="w-3.5 h-3.5 text-slate-400 shrink-0 mr-1" />
          {regions.map((reg) => (
            <button
              key={reg}
              onClick={() => setSelectedRegion(reg)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold shrink-0 transition-all ${
                selectedRegion === reg
                  ? 'bg-amber-500 text-slate-950 shadow-sm'
                  : 'bg-slate-100 dark:bg-slate-800/60 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              {reg}
            </button>
          ))}
        </div>
      </div>

      {/* Grid of Location Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 pt-2">
        {filteredLocations.map((loc) => {
          const lula = loc.candidates.find((c) => c.id === 'lula');
          const bolsonaro = loc.candidates.find((c) => c.id === 'bolsonaro');
          const winner = loc.candidates.reduce((max, c) => (c.percentage > max.percentage ? c : max), loc.candidates[0]);

          return (
            <div
              key={loc.id}
              className="bg-slate-50 dark:bg-slate-800/50 rounded-xl p-4 border border-slate-200 dark:border-slate-700/80 hover:border-amber-500/50 transition-all shadow-2xs"
            >
              <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-700/60 pb-2.5 mb-3">
                <div className="flex items-center gap-2">
                  <span className="text-xl">{loc.flagOrIcon}</span>
                  <div>
                    <h4 className="font-extrabold text-slate-900 dark:text-white text-sm tracking-tight leading-none">
                      {loc.name}
                    </h4>
                    <span className="text-[10px] text-slate-500 dark:text-slate-400 font-semibold">
                      {loc.ufOrCode} • {loc.region}
                    </span>
                  </div>
                </div>

                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                  {loc.totalizedSectionsPct.toFixed(0)}% Apurado
                </span>
              </div>

              {/* Candidates Breakdown in Region */}
              <div className="space-y-2">
                {lula && (
                  <div>
                    <div className="flex justify-between text-xs font-bold mb-1">
                      <span className="text-slate-800 dark:text-slate-200">{lula.shortName}</span>
                      <span style={{ color: lula.color }}>
                        {lula.percentage.toFixed(1).replace('.', ',')}%
                      </span>
                    </div>
                    <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-1.5 overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all"
                        style={{ width: `${lula.percentage}%`, backgroundColor: lula.color }}
                      ></div>
                    </div>
                  </div>
                )}

                {bolsonaro && (
                  <div>
                    <div className="flex justify-between text-xs font-bold mb-1">
                      <span className="text-slate-800 dark:text-slate-200">{bolsonaro.shortName}</span>
                      <span style={{ color: bolsonaro.color }}>
                        {bolsonaro.percentage.toFixed(1).replace('.', ',')}%
                      </span>
                    </div>
                    <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-1.5 overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all"
                        style={{ width: `${bolsonaro.percentage}%`, backgroundColor: bolsonaro.color }}
                      ></div>
                    </div>
                  </div>
                )}
              </div>

              {/* Total Votes */}
              <div className="mt-3 pt-2 border-t border-slate-200 dark:border-slate-700/60 flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400 font-medium">
                <span>Votos Válidos: {loc.totalValidVotes.toLocaleString('pt-BR')}</span>
                {winner && (
                  <span className="font-bold" style={{ color: winner.color }}>
                    Líder: {winner.shortName}
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
