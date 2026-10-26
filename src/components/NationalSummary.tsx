/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { RoundData } from '../types/election';
import { Award, Users, FileX, CheckCircle, BarChart3, AlertTriangle, ShieldCheck } from 'lucide-react';

interface NationalSummaryProps {
  roundData: RoundData;
  locationName: string;
  isOfficialValidated?: boolean;
  dataHoraGeracaoTse?: string;
  isDemonstrative?: boolean;
}

export const NationalSummary: React.FC<NationalSummaryProps> = ({
  roundData,
  locationName,
  isOfficialValidated,
  dataHoraGeracaoTse,
  isDemonstrative
}) => {
  const { nationalCandidates, totalValidVotes, nullVotes, blankVotes, abstentions, votersEligible } = roundData;

  const validPct = votersEligible > 0 ? (totalValidVotes / votersEligible) * 100 : 0;
  const nullPct = votersEligible > 0 ? (nullVotes / votersEligible) * 100 : 0;
  const blankPct = votersEligible > 0 ? (blankVotes / votersEligible) * 100 : 0;
  const abstentionPct = votersEligible > 0 ? (abstentions / votersEligible) * 100 : 0;

  return (
    <div className="space-y-6">
      {/* Title & Status Badge */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
        <div>
          <div className="flex items-center gap-2 flex-wrap">
            {isOfficialValidated ? (
              <span className="bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-500/30 text-xs font-bold px-2.5 py-0.5 rounded-full flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
                Dados Oficiais Validados pelo TSE {dataHoraGeracaoTse ? `(${dataHoraGeracaoTse})` : ''}
              </span>
            ) : (
              <span className="bg-amber-500/10 text-amber-700 dark:text-amber-400 border border-amber-500/30 text-xs font-bold px-2.5 py-0.5 rounded-full flex items-center gap-1">
                <AlertTriangle className="w-3.5 h-3.5 text-amber-500" />
                {isDemonstrative ? 'Dados Demonstrativos / Não Verificados' : 'Aguardando Totalização Oficial do TSE'}
              </span>
            )}

            <span className="bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-bold px-2.5 py-0.5 rounded-full border border-slate-200 dark:border-slate-700">
              {roundData.status}
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight mt-1">
            {locationName} — {roundData.turnNumber}º Turno
          </h2>
        </div>

        <div className="flex items-center gap-2 text-xs text-slate-600 dark:text-slate-400 bg-slate-50 dark:bg-slate-800/60 px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700">
          <Award className="w-4 h-4 text-amber-500" />
          <span>Cargo: <strong>Presidente da República</strong></span>
        </div>
      </div>

      {/* Main Candidate Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {nationalCandidates.map((candidate) => (
          <div
            key={candidate.id}
            className="bg-white dark:bg-slate-900 rounded-2xl border-2 p-5 shadow-sm transition-all relative overflow-hidden"
            style={{
              borderColor: candidate.status === 'Eleito' ? candidate.color : 'rgba(226, 232, 240, 0.8)'
            }}
          >
            {/* Candidate Color Strip Header */}
            <div
              className="absolute top-0 left-0 right-0 h-1.5"
              style={{ backgroundColor: candidate.color }}
            ></div>

            <div className="flex items-start justify-between gap-3 mt-1">
              <div>
                <div className="flex items-center gap-2">
                  <span
                    className="text-xs font-extrabold px-2 py-0.5 rounded-md text-white shadow-sm"
                    style={{ backgroundColor: candidate.color }}
                  >
                    {candidate.number > 0 ? candidate.number : '—'}
                  </span>
                  <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide">
                    {candidate.party}
                  </span>
                </div>
                <h3 className="text-lg font-black text-slate-900 dark:text-white tracking-tight mt-1">
                  {candidate.name}
                </h3>
              </div>

              {candidate.status && (
                <span
                  className={`text-xs font-black px-3 py-1 rounded-xl border flex items-center gap-1 shadow-sm ${
                    candidate.status === 'Eleito'
                      ? 'bg-emerald-500 text-white border-emerald-600'
                      : candidate.status === '2º Turno'
                      ? 'bg-amber-500 text-slate-950 border-amber-600'
                      : 'bg-slate-100 text-slate-600 border-slate-300 dark:bg-slate-800 dark:text-slate-400 dark:border-slate-700'
                  }`}
                >
                  {candidate.status === 'Eleito' && <CheckCircle className="w-3.5 h-3.5" />}
                  {candidate.status}
                </span>
              )}
            </div>

            {/* Percentage & Vote Count */}
            <div className="mt-4 flex items-baseline justify-between border-t border-slate-100 dark:border-slate-800 pt-3">
              <div>
                <span className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
                  {candidate.percentage.toFixed(1).replace('.', ',')}%
                </span>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  {candidate.votes.toLocaleString('pt-BR')} votos
                </p>
              </div>

              <div className="w-1/2">
                <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-3 overflow-hidden p-0.5 border border-slate-200 dark:border-slate-700">
                  <div
                    className="h-full rounded-full transition-all duration-700"
                    style={{
                      width: `${Math.min(100, candidate.percentage)}%`,
                      backgroundColor: candidate.color
                    }}
                  ></div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* TSE Electoral Statistics Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400 mb-1">
            <BarChart3 className="w-4 h-4 text-emerald-500" />
            <span className="text-xs font-semibold">Votos Válidos</span>
          </div>
          <p className="text-lg font-extrabold text-slate-900 dark:text-white">
            {totalValidVotes.toLocaleString('pt-BR')}
          </p>
          <span className="text-[11px] text-emerald-600 dark:text-emerald-400 font-bold">
            {validPct.toFixed(1).replace('.', ',')}% do total
          </span>
        </div>

        <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400 mb-1">
            <FileX className="w-4 h-4 text-amber-500" />
            <span className="text-xs font-semibold">Brancos & Nulos</span>
          </div>
          <p className="text-lg font-extrabold text-slate-900 dark:text-white">
            {(blankVotes + nullVotes).toLocaleString('pt-BR')}
          </p>
          <span className="text-[11px] text-amber-600 dark:text-amber-400 font-bold">
            {(blankPct + nullPct).toFixed(1).replace('.', ',')}% do total
          </span>
        </div>

        <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400 mb-1">
            <Users className="w-4 h-4 text-blue-500" />
            <span className="text-xs font-semibold">Abstenção</span>
          </div>
          <p className="text-lg font-extrabold text-slate-900 dark:text-white">
            {abstentions.toLocaleString('pt-BR')}
          </p>
          <span className="text-[11px] text-blue-600 dark:text-blue-400 font-bold">
            {abstentionPct.toFixed(1).replace('.', ',')}% de abstenção
          </span>
        </div>

        <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400 mb-1">
            <CheckCircle className="w-4 h-4 text-purple-500" />
            <span className="text-xs font-semibold">Aptos a Votar</span>
          </div>
          <p className="text-lg font-extrabold text-slate-900 dark:text-white">
            {votersEligible.toLocaleString('pt-BR')}
          </p>
          <span className="text-[11px] text-purple-600 dark:text-purple-400 font-bold">
            100% Eleitorado
          </span>
        </div>
      </div>
    </div>
  );
};
