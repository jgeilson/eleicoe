/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { RoundData, ProvenanceAudit } from '../types/election';
import { Award, Users, FileX, CheckCircle, BarChart3, AlertTriangle, ShieldCheck, Database, Upload, TrendingUp, MapPin } from 'lucide-react';

interface NationalSummaryProps {
  roundData: RoundData;
  locationName: string;
  audit?: ProvenanceAudit;
  cargoCode?: string;
  selectedState?: string;
  onStateChange?: (uf: string) => void;
}

const CARGO_TITLES: { [key: string]: string } = {
  '0001': 'Presidente da República',
  '0003': 'Governador',
  '0005': 'Senador',
  '0006': 'Deputado Federal',
  '0007': 'Deputado Estadual'
};

const ALL_UFS = [
  'SP', 'MG', 'RJ', 'BA', 'RS', 'PR', 'PE', 'CE', 'SC', 'GO',
  'MA', 'PB', 'PA', 'ES', 'AM', 'RN', 'AL', 'PI', 'MT', 'DF',
  'MS', 'SE', 'RO', 'TO', 'AC', 'AP', 'RR'
];

export const NationalSummary: React.FC<NationalSummaryProps> = ({
  roundData,
  locationName,
  audit,
  cargoCode = '0001',
  selectedState = 'SP',
  onStateChange
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

            <span className="bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-bold px-2.5 py-0.5 rounded-full border border-slate-200 dark:border-slate-700">
              {roundData.status}
            </span>
          </div>

          <div className="flex items-center gap-3 flex-wrap">
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight">
              {cargoCode === '0001' ? locationName : `${CARGO_TITLES[cargoCode] || 'Cargo'} em ${selectedState}`} — {roundData.turnNumber}º Turno
            </h2>
            {cargoCode !== '0001' && onStateChange && (
              <div className="flex items-center gap-2 bg-amber-500/10 border border-amber-500/30 px-3 py-1.5 rounded-xl shadow-xs">
                <MapPin className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400 shrink-0" />
                <span className="text-xs font-bold text-amber-900 dark:text-amber-300">UF:</span>
                <select
                  value={selectedState}
                  onChange={(e) => onStateChange(e.target.value)}
                  className="bg-transparent text-sm font-black text-amber-950 dark:text-amber-200 focus:outline-hidden cursor-pointer"
                >
                  {ALL_UFS.map((uf) => (
                    <option key={uf} value={uf} className="bg-white dark:bg-slate-900 text-slate-900 dark:text-white">
                      {uf}
                    </option>
                  ))}
                </select>
              </div>
            )}
          </div>
        </div>

        <div className="flex items-center gap-2 text-xs text-slate-600 dark:text-slate-400 bg-slate-50 dark:bg-slate-800/60 px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700">
          <Award className="w-4 h-4 text-amber-500" />
          <span>Cargo: <strong>{CARGO_TITLES[cargoCode] || 'Presidente da República'}</strong></span>
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
                    {candidate.number !== null && candidate.number > 0 ? candidate.number : '—'}
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
            <span className="text-xs font-semibold">Votos Brancos (Taxa)</span>
          </div>
          <p className="text-lg font-extrabold text-slate-900 dark:text-white">
            {blankVotes !== null ? blankVotes.toLocaleString('pt-BR') : '—'}
          </p>
          <span className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">
            {blankPct !== null ? `${blankPct.toFixed(1).replace('.', ',')}% do eleitorado` : 'Aguardando apuração'}
          </span>
        </div>

        <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400 mb-1">
            <FileX className="w-4 h-4 text-rose-500" />
            <span className="text-xs font-semibold">Votos Nulos (Taxa)</span>
          </div>
          <p className="text-lg font-extrabold text-slate-900 dark:text-white">
            {nullVotes !== null ? nullVotes.toLocaleString('pt-BR') : '—'}
          </p>
          <span className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">
            {nullPct !== null ? `${nullPct.toFixed(1).replace('.', ',')}% do eleitorado` : 'Aguardando apuração'}
          </span>
        </div>

        <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400 mb-1">
            <Users className="w-4 h-4 text-blue-500" />
            <span className="text-xs font-semibold">Ausentes / Abstenção</span>
          </div>
          <p className="text-lg font-extrabold text-slate-900 dark:text-white">
            {abstentions !== null ? abstentions.toLocaleString('pt-BR') : '—'}
          </p>
          <span className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">
            {abstentionPct !== null ? `${abstentionPct.toFixed(1).replace('.', ',')}% de abstenção` : 'Aguardando apuração'}
          </span>
        </div>
      </div>

      {/* Future Perspective / Projection Card - Only for Presidente (cargoCode === '0001') */}
      {cargoCode === '0001' && (
        <div className="bg-gradient-to-br from-slate-900 via-slate-900 to-indigo-950 dark:from-slate-900 dark:via-slate-900 dark:to-slate-950 rounded-2xl border border-indigo-500/30 p-6 text-white shadow-xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none"></div>
          
          <div className="flex items-center justify-between mb-4 relative z-10 flex-wrap gap-3">
            <div className="flex items-center gap-2.5">
              <div className="p-2 bg-indigo-500/20 border border-indigo-500/40 rounded-xl text-indigo-400">
                <TrendingUp className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base sm:text-lg font-black tracking-tight text-white">
                  Projeção Estatística Baseada no Peso das UFs
                </h3>
                <p className="text-xs text-indigo-200/80 font-medium">
                  {roundData.totalizedSectionsPct !== null ? `${roundData.totalizedSectionsPct.toFixed(1).replace('.', ',')}% totalizados` : '100% totalizados'}
                </p>
              </div>
            </div>
          </div>

          {/* State-Weighted Projection Calculation Helper */}
          {(() => {
            const candidateProjections: { [candidateId: string]: { projectedVotes: number; name: string; party: string; color: string } } = {};
            nationalCandidates.forEach(c => {
              candidateProjections[c.id] = {
                projectedVotes: 0,
                name: c.name,
                party: c.party,
                color: c.color
              };
            });

            let totalProjectedValid = 0;
            let hasValidLocations = false;

            if (roundData.locations && roundData.locations.length > 0) {
              roundData.locations.forEach(loc => {
                const pct = loc.totalizedSectionsPct;
                const scaleFactor = (pct !== null && pct > 0 && pct < 100) ? (100 / pct) : 1;
                if (pct !== null && pct > 0) {
                  hasValidLocations = true;
                }

                const locValid = loc.totalValidVotes || 0;
                totalProjectedValid += Math.round(locValid * scaleFactor);

                loc.candidates.forEach(cand => {
                  const baseCand = nationalCandidates.find(nc => nc.shortName === cand.shortName || nc.number === cand.number);
                  if (baseCand && candidateProjections[baseCand.id]) {
                    const currentVotes = cand.votes || 0;
                    candidateProjections[baseCand.id].projectedVotes += Math.round(currentVotes * scaleFactor);
                  }
                });
              });
            }

            // Fallback if no location breakdown is present
            const projectionsList = (!hasValidLocations || Object.keys(candidateProjections).length === 0)
              ? nationalCandidates.map(c => {
                  const globalPct = roundData.totalizedSectionsPct;
                  const scale = (globalPct !== null && globalPct > 0 && globalPct < 100) ? (100 / globalPct) : 1;
                  const pVotes = c.votes !== null ? Math.round(c.votes * scale) : 0;
                  const pTotal = totalValidVotes !== null ? Math.round(totalValidVotes * scale) : 0;
                  const pPct = pTotal > 0 ? (pVotes / pTotal) * 100 : c.percentage;
                  return {
                    id: c.id,
                    name: c.name,
                    party: c.party,
                    color: c.color,
                    projectedVotes: pVotes,
                    projectedPercentage: pPct
                  };
                })
              : Object.entries(candidateProjections).map(([id, data]) => {
                  const pPct = totalProjectedValid > 0 ? (data.projectedVotes / totalProjectedValid) * 100 : 0;
                  return {
                    id,
                    name: data.name,
                    party: data.party,
                    color: data.color,
                    projectedVotes: data.projectedVotes,
                    projectedPercentage: pPct
                  };
                });

            return (
              <>
                {/* Projection content cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 relative z-10 mt-4">
                  {projectionsList.map((proj) => (
                    <div key={proj.id} className="bg-white/5 dark:bg-slate-800/60 border border-white/10 rounded-xl p-4 backdrop-blur-xs">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <span
                            className="w-3 h-3 rounded-full shrink-0"
                            style={{ backgroundColor: proj.color }}
                          ></span>
                          <span className="text-sm font-bold text-white truncate max-w-[180px] sm:max-w-[220px]">
                            {proj.name}
                          </span>
                        </div>
                        <span className="text-xs font-semibold text-slate-400">
                          {proj.party}
                        </span>
                      </div>

                      <div className="flex items-baseline justify-between mt-3">
                        <div>
                          <p className="text-xs text-slate-400">Projeção de Votos</p>
                          <p className="text-lg font-extrabold text-white tracking-tight mt-0.5 tabular-nums">
                            {proj.projectedVotes.toLocaleString('pt-BR')}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-xs text-slate-400">Percentual Estimado</p>
                          <p className="text-xl font-black text-indigo-400 tracking-tight mt-0.5 tabular-nums">
                            {proj.projectedPercentage !== null ? `${proj.projectedPercentage.toFixed(1).replace('.', ',')}%` : '—'}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            );
          })()}

          <div className="mt-4 pt-3 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-400 gap-2 relative z-10">
            <span>
              {roundData.totalizedSectionsPct !== null && roundData.totalizedSectionsPct < 100
                ? `Restam aproximadamente ${(100 - roundData.totalizedSectionsPct).toFixed(1).replace('.', ',')}% das seções eleitorais.`
                : 'Apuração 100% concluída.'}
            </span>
          </div>
        </div>
      )}
    </div>
  );
};
