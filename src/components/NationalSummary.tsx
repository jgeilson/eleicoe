/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { RoundData, ProvenanceAudit } from '../types/election';
import { Award, Users, FileX, CheckCircle, BarChart3, AlertTriangle, ShieldCheck, Database, Upload } from 'lucide-react';

interface NationalSummaryProps {
  roundData: RoundData;
  locationName: string;
  audit?: ProvenanceAudit;
}

export const NationalSummary: React.FC<NationalSummaryProps> = ({
  roundData,
  locationName,
  audit
}) => {
  const { nationalCandidates, totalValidVotes, nullVotes, blankVotes, abstentions, votersEligible } = roundData;

  const hasData = totalValidVotes !== null && totalValidVotes > 0;
  const validPct = votersEligible && votersEligible > 0 && totalValidVotes !== null ? (totalValidVotes / votersEligible) * 100 : null;
  const nullPct = votersEligible && votersEligible > 0 && nullVotes !== null ? (nullVotes / votersEligible) * 100 : null;
  const blankPct = votersEligible && votersEligible > 0 && blankVotes !== null ? (blankVotes / votersEligible) * 100 : null;
  const abstentionPct = votersEligible && votersEligible > 0 && abstentions !== null ? (abstentions / votersEligible) * 100 : null;

  return (
    <div className="space-y-6">
      {/* Title & Status Badge */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
        <div>
          <div className="flex items-center gap-2 flex-wrap mb-1">
            {audit?.provenance === 'OFFICIAL_TSE_LIVE' && (
              <span className="bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-500/30 text-xs font-bold px-2.5 py-0.5 rounded-full flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
                Dados Oficiais Validados pelo TSE {audit.dataHoraGeracaoTse ? `(${audit.dataHoraGeracaoTse})` : ''}
              </span>
            )}
            {audit?.provenance === 'OFFICIAL_TSE_CACHE' && (
              <span className="bg-blue-500/10 text-blue-700 dark:text-blue-300 border border-blue-500/30 text-xs font-bold px-2.5 py-0.5 rounded-full flex items-center gap-1">
                <Database className="w-3.5 h-3.5 text-blue-500" />
                Histórico Oficial TSE (Cache Salvo)
              </span>
            )}
            {audit?.provenance === 'MANUAL_IMPORT_UNVERIFIED' && (
              <span className="bg-purple-500/10 text-purple-700 dark:text-purple-300 border border-purple-500/30 text-xs font-bold px-2.5 py-0.5 rounded-full flex items-center gap-1">
                <Upload className="w-3.5 h-3.5 text-purple-500" />
                Importação Manual (Não Verificada pelo TSE)
              </span>
            )}
            {(!audit || audit.provenance === 'DEMONSTRATIVE_BASELINE') && (
              <span className="bg-amber-500/10 text-amber-700 dark:text-amber-400 border border-amber-500/30 text-xs font-bold px-2.5 py-0.5 rounded-full flex items-center gap-1">
                <AlertTriangle className="w-3.5 h-3.5 text-amber-500" />
                Aguardando Apuração Oficial
              </span>
            )}

            <span className="bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-bold px-2.5 py-0.5 rounded-full border border-slate-200 dark:border-slate-700">
              {roundData.status}
            </span>
          </div>

          <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight">
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
                {candidate.percentage !== null ? (
                  <span className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
                    {candidate.percentage.toFixed(1).replace('.', ',')}%
                  </span>
                ) : (
                  <span className="text-3xl font-extrabold tracking-tight text-slate-400">
                    —
                  </span>
                )}
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  {candidate.votes !== null ? `${candidate.votes.toLocaleString('pt-BR')} votos` : 'Aguardando apuração'}
                </p>
              </div>

              <div className="w-1/2">
                <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-3 overflow-hidden p-0.5 border border-slate-200 dark:border-slate-700">
                  <div
                    className="h-full rounded-full transition-all duration-700"
                    style={{
                      width: `${candidate.percentage !== null ? Math.min(100, Math.max(0, candidate.percentage)) : 0}%`,
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
            {totalValidVotes !== null ? totalValidVotes.toLocaleString('pt-BR') : '—'}
          </p>
          <span className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">
            {validPct !== null ? `${validPct.toFixed(1).replace('.', ',')}% do eleitorado` : 'Aguardando apuração'}
          </span>
        </div>

        <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400 mb-1">
            <FileX className="w-4 h-4 text-amber-500" />
            <span className="text-xs font-semibold">Brancos & Nulos</span>
          </div>
          <p className="text-lg font-extrabold text-slate-900 dark:text-white">
            {blankVotes !== null && nullVotes !== null ? (blankVotes + nullVotes).toLocaleString('pt-BR') : '—'}
          </p>
          <span className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">
            {blankPct !== null && nullPct !== null ? `${(blankPct + nullPct).toFixed(1).replace('.', ',')}% do total` : 'Aguardando apuração'}
          </span>
        </div>

        <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400 mb-1">
            <Users className="w-4 h-4 text-blue-500" />
            <span className="text-xs font-semibold">Abstenção</span>
          </div>
          <p className="text-lg font-extrabold text-slate-900 dark:text-white">
            {abstentions !== null ? abstentions.toLocaleString('pt-BR') : '—'}
          </p>
          <span className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">
            {abstentionPct !== null ? `${abstentionPct.toFixed(1).replace('.', ',')}% de abstenção` : 'Aguardando apuração'}
          </span>
        </div>

        <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400 mb-1">
            <CheckCircle className="w-4 h-4 text-purple-500" />
            <span className="text-xs font-semibold">Aptos a Votar</span>
          </div>
          <p className="text-lg font-extrabold text-slate-900 dark:text-white">
            {votersEligible !== null ? votersEligible.toLocaleString('pt-BR') : '—'}
          </p>
          <span className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">
            {votersEligible !== null ? '100% Eleitorado' : 'Aguardando'}
          </span>
        </div>
      </div>
    </div>
  );
};
