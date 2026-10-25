import React, { useState, useMemo } from 'react';
import { CountryResult } from '../types/election';
import { Search, Filter, ArrowUpDown, Clock, TrendingUp, TrendingDown } from 'lucide-react';

interface CountryTableProps {
  countries: CountryResult[];
}

export const CountryTable: React.FC<CountryTableProps> = ({ countries }) => {
  const [search, setSearch] = useState('');
  const [selectedRegion, setSelectedRegion] = useState<string>('Todas');
  const [statusFilter, setStatusFilter] = useState<'todos' | 'com_t2' | 'pendente_t2'>('todos');
  const [sortBy, setSortBy] = useState<'country' | 't2Total' | 't1Total' | 't2PctLula'>('t2Total');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  const regions = ['Todas', 'Oceania e Ásia', 'Europa', 'América', 'África'];

  const filteredCountries = useMemo(() => {
    return countries
      .filter((item) => {
        const matchesSearch =
          item.country.toLowerCase().includes(search.toLowerCase()) ||
          item.continent.toLowerCase().includes(search.toLowerCase());

        let matchesRegion = true;
        if (selectedRegion === 'Oceania e Ásia') {
          matchesRegion = item.continent === 'Oceania' || item.continent === 'Ásia' || item.continent === 'Oriente Médio';
        } else if (selectedRegion === 'Europa') {
          matchesRegion = item.continent === 'Europa';
        } else if (selectedRegion === 'América') {
          matchesRegion = item.continent === 'Américas';
        } else if (selectedRegion === 'África') {
          matchesRegion = item.continent === 'África';
        }

        let matchesStatus = true;
        if (statusFilter === 'com_t2') {
          matchesStatus = item.turno2.disponivel;
        } else if (statusFilter === 'pendente_t2') {
          matchesStatus = !item.turno2.disponivel;
        }

        return matchesSearch && matchesRegion && matchesStatus;
      })
      .sort((a, b) => {
        let comp = 0;
        if (sortBy === 'country') {
          comp = a.country.localeCompare(b.country);
        } else if (sortBy === 't2Total') {
          if (a.turno2.disponivel && !b.turno2.disponivel) return -1;
          if (!a.turno2.disponivel && b.turno2.disponivel) return 1;
          const totA = a.turno2.disponivel ? a.turno2.totalValidos : 0;
          const totB = b.turno2.disponivel ? b.turno2.totalValidos : 0;
          comp = totA - totB;
        } else if (sortBy === 't1Total') {
          comp = a.turno1.totalValidos - b.turno1.totalValidos;
        } else if (sortBy === 't2PctLula') {
          const pA = a.turno2.disponivel ? a.turno2.pctLula : -1;
          const pB = b.turno2.disponivel ? b.turno2.pctLula : -1;
          comp = pA - pB;
        }
        return sortOrder === 'desc' ? -comp : comp;
      });
  }, [countries, search, selectedRegion, statusFilter, sortBy, sortOrder]);

  const toggleSort = (field: 'country' | 't2Total' | 't1Total' | 't2PctLula') => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'desc' ? 'asc' : 'desc');
    } else {
      setSortBy(field);
      setSortOrder('desc');
    }
  };

  const countT2 = countries.filter((c) => c.turno2.disponivel).length;
  const countPending = countries.filter((c) => !c.turno2.disponivel).length;

  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 p-5 md:p-6">
      {/* Table Header and Search */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-5">
        <div>
          <h3 className="text-xl font-bold text-slate-900 dark:text-white">
            Comparação por País e Região
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            {filteredCountries.length} países listados ({countT2} com 2º turno apurado hoje, {countPending} aguardando)
          </p>
        </div>

        <div className="relative w-full md:w-64">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Buscar país..."
            className="w-full pl-9 pr-3 py-1.5 text-xs md:text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-red-500/30"
          />
        </div>
      </div>

      {/* Region and Status Filters */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-4 mb-4 border-b border-slate-100 dark:border-slate-800">
        {/* Region Pills */}
        <div className="flex items-center gap-1.5 flex-wrap">
          <span className="text-xs font-semibold text-slate-400 mr-1 flex items-center gap-1">
            <Filter className="w-3.5 h-3.5" />
            Região:
          </span>
          {regions.map((reg) => (
            <button
              key={reg}
              onClick={() => setSelectedRegion(reg)}
              className={`px-3 py-1 text-xs font-medium rounded-lg transition-all ${
                selectedRegion === reg
                  ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900 shadow-sm'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
              }`}
            >
              {reg}
            </button>
          ))}
        </div>

        {/* Status Toggle */}
        <div className="flex items-center gap-1.5">
          <button
            onClick={() => setStatusFilter('todos')}
            className={`px-2.5 py-1 text-xs font-medium rounded-lg transition-all ${
              statusFilter === 'todos'
                ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'
            }`}
          >
            Todos ({countries.length})
          </button>
          <button
            onClick={() => setStatusFilter('com_t2')}
            className={`px-2.5 py-1 text-xs font-medium rounded-lg transition-all ${
              statusFilter === 'com_t2'
                ? 'bg-emerald-600 text-white'
                : 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300'
            }`}
          >
            Apurados 2ºT ({countT2})
          </button>
          <button
            onClick={() => setStatusFilter('pendente_t2')}
            className={`px-2.5 py-1 text-xs font-medium rounded-lg transition-all ${
              statusFilter === 'pendente_t2'
                ? 'bg-amber-600 text-white'
                : 'bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-300'
            }`}
          >
            Aguardando ({countPending})
          </button>
        </div>
      </div>

      {/* Clean Comparison Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs md:text-sm">
          <thead>
            <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 font-semibold">
              <th
                onClick={() => toggleSort('country')}
                className="py-3 px-3 cursor-pointer hover:text-slate-900 dark:hover:text-white"
              >
                <div className="flex items-center gap-1">
                  País e Região
                  <ArrowUpDown className="w-3.5 h-3.5" />
                </div>
              </th>
              <th className="py-3 px-3 text-center bg-slate-50/70 dark:bg-slate-800/40 rounded-t-lg">
                <span className="font-bold text-slate-700 dark:text-slate-300">1º Turno</span>
                <div className="text-[10px] text-slate-400 font-normal">Lula x Flávio</div>
              </th>
              <th
                onClick={() => toggleSort('t2Total')}
                className="py-3 px-3 text-center bg-red-50/40 dark:bg-red-950/20 rounded-t-lg cursor-pointer"
              >
                <div className="flex items-center justify-center gap-1">
                  <span className="font-bold text-red-700 dark:text-red-300">2º Turno (Hoje)</span>
                  <ArrowUpDown className="w-3.5 h-3.5" />
                </div>
                <div className="text-[10px] text-red-500 font-normal">Lula x Flávio</div>
              </th>
              <th className="py-3 px-3 text-center">
                <span>Variação (1ºT ➔ 2ºT)</span>
                <div className="text-[10px] text-slate-400 font-normal">% e saldo de votos</div>
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
            {filteredCountries.map((c) => {
              const hasT2 = c.turno2.disponivel;
              const deltaLulaPct = hasT2 ? c.turno2.pctLula - c.turno1.pctLula : 0;
              const deltaBolsonaroPct = hasT2 ? c.turno2.pctBolsonaro - c.turno1.pctBolsonaro : 0;
              const deltaLulaVotos = hasT2 ? c.turno2.votosLula - c.turno1.votosLula : 0;
              const deltaBolsonaroVotos = hasT2 ? c.turno2.votosBolsonaro - c.turno1.votosBolsonaro : 0;

              return (
                <tr
                  key={c.id}
                  className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors"
                >
                  {/* Country Name & Region */}
                  <td className="py-3 px-3">
                    <div className="flex items-center gap-2">
                      <span className="text-xl">{c.flag}</span>
                      <div>
                        <div className="font-bold text-slate-900 dark:text-white">
                          {c.country}
                        </div>
                        <span className="text-[11px] text-slate-400">
                          {c.continent}
                        </span>
                      </div>
                    </div>
                  </td>

                  {/* 1º Turno (Separado) */}
                  <td className="py-3 px-3 bg-slate-50/40 dark:bg-slate-800/20 text-center">
                    <div className="flex items-center justify-center gap-1.5 font-bold text-xs">
                      <span className="text-red-600">
                        {c.turno1.votosLula.toLocaleString('pt-BR')} ({c.turno1.pctLula.toFixed(1)}%)
                      </span>
                      <span className="text-slate-300 font-normal">x</span>
                      <span className="text-blue-600">
                        {c.turno1.votosBolsonaro.toLocaleString('pt-BR')} ({c.turno1.pctBolsonaro.toFixed(1)}%)
                      </span>
                    </div>
                    <div className="text-[10px] text-slate-400 mt-0.5">
                      Total: {c.turno1.totalValidos.toLocaleString('pt-BR')} válidos
                    </div>
                  </td>

                  {/* 2º Turno (Separado) */}
                  <td className="py-3 px-3 bg-red-50/20 dark:bg-red-950/10 text-center">
                    {hasT2 ? (
                      <div>
                        <div className="flex items-center justify-center gap-1.5 font-black text-xs md:text-sm">
                          <span className="text-red-600 dark:text-red-400">
                            {c.turno2.votosLula.toLocaleString('pt-BR')} ({c.turno2.pctLula.toFixed(1)}%)
                          </span>
                          <span className="text-slate-300 font-normal">x</span>
                          <span className="text-blue-600 dark:text-blue-400">
                            {c.turno2.votosBolsonaro.toLocaleString('pt-BR')} ({c.turno2.pctBolsonaro.toFixed(1)}%)
                          </span>
                        </div>
                        <div className="text-[10px] font-medium text-slate-500 mt-0.5">
                          Total: {c.turno2.totalValidos.toLocaleString('pt-BR')} válidos
                        </div>
                      </div>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-[11px] font-medium text-amber-700 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/40 px-2.5 py-0.5 rounded-full border border-amber-200 dark:border-amber-900/50">
                        <Clock className="w-3 h-3" />
                        Aguardando apuração
                      </span>
                    )}
                  </td>

                  {/* Variation (% and absolute votes delta colored) */}
                  <td className="py-3 px-3 text-center">
                    {hasT2 ? (
                      <div className="text-xs space-y-1">
                        <div className="flex items-center justify-center gap-1.5">
                          <span className="text-slate-400 text-[11px] font-medium">Lula:</span>
                          <span className={`font-bold flex items-center ${deltaLulaPct >= 0 ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'}`}>
                            {deltaLulaPct >= 0 ? <TrendingUp className="w-3 h-3 mr-0.5" /> : <TrendingDown className="w-3 h-3 mr-0.5" />}
                            {deltaLulaPct >= 0 ? `+${deltaLulaPct.toFixed(1)}%` : `${deltaLulaPct.toFixed(1)}%`}
                          </span>
                          <span className={`text-[11px] font-semibold ${deltaLulaVotos >= 0 ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'}`}>
                            ({deltaLulaVotos >= 0 ? `+${deltaLulaVotos.toLocaleString('pt-BR')}` : deltaLulaVotos.toLocaleString('pt-BR')})
                          </span>
                        </div>
                        <div className="flex items-center justify-center gap-1.5">
                          <span className="text-slate-400 text-[11px] font-medium">Flávio:</span>
                          <span className={`font-bold flex items-center ${deltaBolsonaroPct >= 0 ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'}`}>
                            {deltaBolsonaroPct >= 0 ? <TrendingUp className="w-3 h-3 mr-0.5" /> : <TrendingDown className="w-3 h-3 mr-0.5" />}
                            {deltaBolsonaroPct >= 0 ? `+${deltaBolsonaroPct.toFixed(1)}%` : `${deltaBolsonaroPct.toFixed(1)}%`}
                          </span>
                          <span className={`text-[11px] font-semibold ${deltaBolsonaroVotos >= 0 ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'}`}>
                            ({deltaBolsonaroVotos >= 0 ? `+${deltaBolsonaroVotos.toLocaleString('pt-BR')}` : deltaBolsonaroVotos.toLocaleString('pt-BR')})
                          </span>
                        </div>
                      </div>
                    ) : (
                      <span className="text-slate-300 dark:text-slate-700 text-xs">—</span>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};
