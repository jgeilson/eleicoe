/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo } from 'react';
import { LocationResult } from '../types/election';
import { Search, Filter, MapPin, ShieldCheck, Clock } from 'lucide-react';

interface StateCountryBreakdownProps {
  locations: LocationResult[];
}

export const StateCountryBreakdown: React.FC<StateCountryBreakdownProps> = ({
  locations
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

  const regionSummary = useMemo(() => {
    if (selectedRegion === 'Todas') return null;
    const regionLocs = locations.filter((loc) => loc.region === selectedRegion);
    if (regionLocs.length === 0) return null;

    let totalValid = 0;
    let totalNull = 0;
    let totalBlank = 0;
    let totalAbst = 0;
    let totalEligible = 0;
    let totalSections = 0;
    let totalizedSections = 0;
    let hasAnyVotes = false;

    const candidateMap = new Map<string, { id: string; name: string; shortName: string; party: string; color: string; number: number | null; votes: number }>();

    for (const loc of regionLocs) {
      if (loc.totalValidVotes !== null) {
        totalValid += loc.totalValidVotes;
        hasAnyVotes = true;
      }
      if (loc.nullVotes !== null) totalNull += loc.nullVotes;
      if (loc.blankVotes !== null) totalBlank += loc.blankVotes;
      if (loc.abstentions !== null) totalAbst += loc.abstentions;
      if (loc.votersEligible !== null) totalEligible += loc.votersEligible;
      if (loc.totalSections !== null) totalSections += loc.totalSections;
      if (loc.totalizedSections !== null) totalizedSections += loc.totalizedSections;

      for (const c of loc.candidates) {
        const candKey = c.number !== null && c.number !== undefined ? `num-${c.number}` : (c.shortName || c.name);
        const existing = candidateMap.get(candKey) || {
          id: c.id,
          name: c.name,
          shortName: c.shortName,
          party: c.party,
          color: c.color,
          number: c.number,
          votes: 0
        };
        if (c.votes !== null) {
          existing.votes += c.votes;
          hasAnyVotes = true;
        }
        candidateMap.set(candKey, existing);
      }
    }

    const sectionsPct = totalSections > 0 ? (totalizedSections / totalSections) * 100 : 0;
    const validPct = totalEligible > 0 ? (totalValid / totalEligible) * 100 : null;
    const blankPct = totalEligible > 0 ? (totalBlank / totalEligible) * 100 : null;
    const nullPct = totalEligible > 0 ? (totalNull / totalEligible) * 100 : null;
    const abstPct = totalEligible > 0 ? (totalAbst / totalEligible) * 100 : null;

    const aggregatedCandidates = Array.from(candidateMap.values())
      .map(c => ({
        ...c,
        percentage: totalValid > 0 ? (c.votes / totalValid) * 100 : 0
      }))
      .sort((a, b) => b.votes - a.votes);

    return {
      regionName: selectedRegion,
      totalValid: hasAnyVotes ? totalValid : null,
      totalNull: hasAnyVotes ? totalNull : null,
      totalBlank: hasAnyVotes ? totalBlank : null,
      totalAbst: hasAnyVotes ? totalAbst : null,
      totalEligible: totalEligible > 0 ? totalEligible : null,
      sectionsPct,
      validPct,
      blankPct,
      nullPct,
      abstPct,
      candidates: aggregatedCandidates,
      hasData: hasAnyVotes,
      locationCount: regionLocs.length
    };
  }, [locations, selectedRegion]);

  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden p-5 space-y-4">
      {/* Header & Filter Controls */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 dark:border-slate-800 pb-4">
        <div>
          <h3 className="text-lg font-black text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
            <MapPin className="w-5 h-5 text-amber-500" />
            Resultados por Estado e Exterior
          </h3>
        </div>
      </div>

      {/* Search and Region Selector */}
      <div className="flex flex-col sm:flex-row items-center gap-3">
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

      {/* Region Summary Card at Top */}
      {regionSummary && (
        <div className="bg-gradient-to-br from-amber-500/10 via-amber-500/5 to-transparent dark:from-amber-500/20 dark:via-slate-900 dark:to-slate-900 border-2 border-amber-500/40 rounded-2xl p-5 shadow-sm space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-amber-500/20 pb-3">
            <div>
              <h4 className="text-xl font-black text-slate-900 dark:text-white tracking-tight mt-1">
                {regionSummary.regionName === 'Exterior' ? 'Exterior (ZZ)' : `Região ${regionSummary.regionName}`}
                <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 ml-2 font-normal">
                  ({regionSummary.locationCount} {regionSummary.locationCount === 1 ? 'localidade' : 'localidades'})
                </span>
              </h4>
            </div>

            <div className="flex items-center gap-2 bg-white/80 dark:bg-slate-900/80 px-3 py-1.5 rounded-xl border border-amber-500/30 text-xs font-bold text-slate-700 dark:text-slate-300">
              <ShieldCheck className="w-4 h-4 text-emerald-500" />
              <span>Seções Totalizadas: <strong>{regionSummary.sectionsPct.toFixed(1).replace('.', ',')}%</strong></span>
            </div>
          </div>

          {/* Candidate breakdown for region */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {regionSummary.candidates.map((candidate) => (
              <div key={candidate.id} className="bg-white dark:bg-slate-900 p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 shadow-2xs">
                <div className="flex items-center justify-between mb-1.5">
                  <div className="flex items-center gap-2">
                    <span
                      className="w-3 h-3 rounded-full shrink-0"
                      style={{ backgroundColor: candidate.color }}
                    ></span>
                    <span className="text-xs font-black text-slate-900 dark:text-white">
                      {candidate.name} ({candidate.party})
                    </span>
                  </div>
                  <span className="text-sm font-black" style={{ color: candidate.color }}>
                    {candidate.percentage.toFixed(1).replace('.', ',')}%
                  </span>
                </div>
                <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-2 overflow-hidden mb-1">
                  <div
                    className="h-full rounded-full transition-all"
                    style={{
                      width: `${Math.min(100, Math.max(0, candidate.percentage))}%`,
                      backgroundColor: candidate.color
                    }}
                  ></div>
                </div>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 text-right">
                  {candidate.votes.toLocaleString('pt-BR')} votos
                </p>
              </div>
            ))}
          </div>

          {/* Region Stats Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 pt-1">
            <div className="bg-white/80 dark:bg-slate-900/80 p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 text-center">
              <span className="text-[10px] font-semibold text-slate-500 block">Votos Válidos</span>
              <span className="text-xs font-extrabold text-slate-900 dark:text-white">
                {regionSummary.totalValid !== null ? regionSummary.totalValid.toLocaleString('pt-BR') : '—'}
              </span>
            </div>
            <div className="bg-white/80 dark:bg-slate-900/80 p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 text-center">
              <span className="text-[10px] font-semibold text-slate-500 block">Votos Brancos (Taxa)</span>
              <span className="text-xs font-extrabold text-slate-900 dark:text-white">
                {regionSummary.blankPct !== null ? `${regionSummary.blankPct.toFixed(1).replace('.', ',')}%` : '—'}
              </span>
            </div>
            <div className="bg-white/80 dark:bg-slate-900/80 p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 text-center">
              <span className="text-[10px] font-semibold text-slate-500 block">Votos Nulos (Taxa)</span>
              <span className="text-xs font-extrabold text-slate-900 dark:text-white">
                {regionSummary.nullPct !== null ? `${regionSummary.nullPct.toFixed(1).replace('.', ',')}%` : '—'}
              </span>
            </div>
            <div className="bg-white/80 dark:bg-slate-900/80 p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 text-center">
              <span className="text-[10px] font-semibold text-slate-500 block">Abstenção (Taxa)</span>
              <span className="text-xs font-extrabold text-slate-900 dark:text-white">
                {regionSummary.abstPct !== null ? `${regionSummary.abstPct.toFixed(1).replace('.', ',')}%` : '—'}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Grid of Location Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 pt-2">
        {filteredLocations.map((loc) => {
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
                  <div>
                    <h4 className="font-extrabold text-slate-900 dark:text-white text-sm tracking-tight leading-none">
                      {loc.name}
                    </h4>
                    <span className="text-[10px] text-slate-500 dark:text-slate-400 font-semibold">
                      {loc.ufOrCode} • {loc.region}
                    </span>
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

                {/* Candidate Bars */}
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

              {/* Electoral Metrics & Rates for State */}
              {isGenuinelyImportedWithData && (
                <div className="grid grid-cols-3 gap-1.5 mt-3 pt-2.5 border-t border-slate-200 dark:border-slate-700/60 text-[10px] text-slate-600 dark:text-slate-300">
                  <div className="bg-slate-100 dark:bg-slate-800/80 p-1.5 rounded-lg text-center">
                    <span className="text-slate-400 block text-[9px]">Brancos</span>
                    <span className="font-bold">
                      {loc.votersEligible && loc.blankVotes !== null && loc.votersEligible > 0
                        ? `${((loc.blankVotes / loc.votersEligible) * 100).toFixed(1).replace('.', ',')}%`
                        : '—'}
                    </span>
                  </div>
                  <div className="bg-slate-100 dark:bg-slate-800/80 p-1.5 rounded-lg text-center">
                    <span className="text-slate-400 block text-[9px]">Nulos</span>
                    <span className="font-bold">
                      {loc.votersEligible && loc.nullVotes !== null && loc.votersEligible > 0
                        ? `${((loc.nullVotes / loc.votersEligible) * 100).toFixed(1).replace('.', ',')}%`
                        : '—'}
                    </span>
                  </div>
                  <div className="bg-slate-100 dark:bg-slate-800/80 p-1.5 rounded-lg text-center">
                    <span className="text-slate-400 block text-[9px]">Ausentes</span>
                    <span className="font-bold">
                      {loc.votersEligible && loc.abstentions !== null && loc.votersEligible > 0
                        ? `${((loc.abstentions / loc.votersEligible) * 100).toFixed(1).replace('.', ',')}%`
                        : '—'}
                    </span>
                  </div>
                </div>
              )}

              {/* Card Footer */}
              <div className="mt-3 pt-2 border-t border-slate-200 dark:border-slate-700/60 flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400 font-medium">
                <span>
                  {isGenuinelyImportedWithData && loc.totalValidVotes !== null
                    ? `Votos Válidos: ${loc.totalValidVotes.toLocaleString('pt-BR')}`
                    : 'Votos: —'}
                </span>
                <span className="font-bold text-slate-600 dark:text-slate-400">
                  {loc.ufOrCode === 'ZZ' ? 'Exterior' : `UF: ${loc.ufOrCode}`}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
