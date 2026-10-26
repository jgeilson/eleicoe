/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo } from 'react';
import { LocationResult } from '../types/election';
import { Search, Filter, MapPin, ArrowRight, ShieldCheck, Clock } from 'lucide-react';

interface StateCountryBreakdownProps {
  locations: LocationResult[];
  onSelectScope?: (scope: string) => void;
}

export const StateCountryBreakdown: React.FC<StateCountryBreakdownProps> = ({
  locations,
  onSelectScope
}) => {
  const [search, setSearch] = useState('');
  const [selectedRegion, setSelectedRegion] = useState<string>('Todas');
  const [filterType, setFilterType] = useState<'TODOS' | 'ESTADO' | 'EXTERIOR'>('TODOS');
  const [sortBy, setSortBy] = useState<'name' | 'votes' | 'pct'>('name');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');

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
          comp = (a.totalValidVotes || 0) - (b.totalValidVotes || 0);
        } else if (sortBy === 'pct') {
          comp = (a.totalizedSectionsPct || 0) - (b.totalizedSectionsPct || 0);
        }
        return sortOrder === 'desc' ? -comp : comp;
      });
  }, [locations, search, selectedRegion, filterType, sortBy, sortOrder]);

  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden p-5 space-y-4">
      {/* Header & Filter Controls */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 dark:border-slate-800 pb-4">
        <div>
          <h3 className="text-lg font-black text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
            <MapPin className="w-5 h-5 text-amber-500" />
            Resultados por Estado (UFs) e Exterior (ZZ)
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Detalhamento oficial por Unidade da Federação. Percentuais só são exibidos quando há apuração oficial.
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
            placeholder="Buscar por Estado ou UF (ex: SP, MG, BA, ZZ)..."
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
          // STRICT RULE: candidate percentages and bars are ONLY shown if the location is genuinely imported with valid votes > 0
          const isGenuinelyImportedWithData =
            loc.isImported &&
            loc.totalValidVotes !== null &&
            loc.totalValidVotes > 0 &&
            loc.candidates.length > 0 &&
            loc.candidates.some((c) => c.percentage !== null && c.percentage > 0);

          return (
            <div
              key={loc.id}
              className="bg-slate-50 dark:bg-slate-800/50 rounded-xl p-4 border border-slate-200 dark:border-slate-700/80 hover:border-amber-500/50 transition-all shadow-2xs flex flex-col justify-between"
            >
              <div>
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

                  <div className="text-right">
                    {isGenuinelyImportedWithData ? (
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 flex items-center gap-1">
                        <ShieldCheck className="w-2.5 h-2.5" />
                        {loc.totalizedSectionsPct !== null ? `${loc.totalizedSectionsPct.toFixed(0)}% Apurado` : 'Oficial'}
                      </span>
                    ) : (
                      <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-slate-200/80 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border border-slate-300 dark:border-slate-700 flex items-center gap-1">
                        <Clock className="w-2.5 h-2.5 text-slate-400" />
                        Aguardando Apuração
                      </span>
                    )}
                  </div>
                </div>

                {/* Candidate Bars: ONLY if genuine official candidate data was received */}
                {isGenuinelyImportedWithData ? (
                  <div className="space-y-2">
                    {loc.candidates.slice(0, 3).map((candidate) => (
                      <div key={candidate.id}>
                        <div className="flex justify-between text-xs font-bold mb-1">
                          <span className="text-slate-800 dark:text-slate-200 truncate max-w-[140px]">
                            {candidate.shortName} ({candidate.party})
                          </span>
                          <span style={{ color: candidate.color }}>
                            {candidate.percentage !== null ? `${candidate.percentage.toFixed(1).replace('.', ',')}%` : '—'}
                          </span>
                        </div>
                        <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-1.5 overflow-hidden">
                          <div
                            className="h-full rounded-full transition-all"
                            style={{
                              width: `${candidate.percentage !== null ? Math.min(100, Math.max(0, candidate.percentage)) : 0}%`,
                              backgroundColor: candidate.color
                            }}
                          ></div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="py-5 text-center text-xs text-slate-400 bg-white/40 dark:bg-slate-900/40 rounded-xl border border-dashed border-slate-200 dark:border-slate-800">
                    <p className="font-semibold text-slate-600 dark:text-slate-400">
                      Nenhum voto apurado nesta UF
                    </p>
                    <p className="text-[10px] text-slate-400 mt-0.5">
                      Os percentuais só serão exibidos quando os boletins forem transmitidos pelo TSE.
                    </p>
                  </div>
                )}
              </div>

              {/* Card Footer with Direct Scope Query Trigger */}
              <div className="mt-4 pt-2.5 border-t border-slate-200 dark:border-slate-700/60 flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400 font-medium">
                <span>
                  {isGenuinelyImportedWithData && loc.totalValidVotes !== null
                    ? `Votos: ${loc.totalValidVotes.toLocaleString('pt-BR')}`
                    : 'Votos: —'}
                </span>

                {onSelectScope && (
                  <button
                    onClick={() => onSelectScope(loc.ufOrCode)}
                    className="inline-flex items-center gap-1 font-bold text-amber-600 dark:text-amber-400 hover:underline"
                  >
                    Consultar {loc.ufOrCode} no TSE
                    <ArrowRight className="w-3 h-3" />
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
