/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { PresidentialElectionData } from '../types/election';
import { parseTseOfficialJson, TseRawJson } from '../utils/tseParser';
import { X, Check, Upload, AlertCircle, FileCode } from 'lucide-react';

interface ImportDataModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentData: PresidentialElectionData;
  onSaveData: (newData: PresidentialElectionData) => void;
}

export const ImportDataModal: React.FC<ImportDataModalProps> = ({
  isOpen,
  onClose,
  currentData,
  onSaveData
}) => {
  const [pasteText, setPasteText] = useState('');
  const [lula2026Votes, setLula2026Votes] = useState(currentData.turno2.nationalCandidates[0]?.votes || 62407800);
  const [flavio2026Votes, setFlavio2026Votes] = useState(currentData.turno2.nationalCandidates[1]?.votes || 60442200);
  const [statusMsg, setStatusMsg] = useState<{ type: 'success' | 'error' | 'info'; text: string } | null>(null);

  if (!isOpen) return null;

  const handleApplyManualEdit = () => {
    const totalValid = lula2026Votes + flavio2026Votes;
    const lulaPct = totalValid > 0 ? (lula2026Votes / totalValid) * 100 : 50;
    const flavioPct = totalValid > 0 ? (flavio2026Votes / totalValid) * 100 : 50;

    const updated: PresidentialElectionData = JSON.parse(JSON.stringify(currentData));
    updated.dataUpdatedAt = new Date().toISOString();
    updated.isOfficialValidated = false;
    updated.isDemonstrative = true;
    updated.source = 'Dados Inseridos Manualmente (Não Verificados pelo TSE)';
    updated.turno2.totalValidVotes = totalValid;

    // Update 2nd round national candidates
    if (updated.turno2.nationalCandidates[0]) {
      updated.turno2.nationalCandidates[0].votes = lula2026Votes;
      updated.turno2.nationalCandidates[0].percentage = lulaPct;
      updated.turno2.nationalCandidates[0].status = lula2026Votes > flavio2026Votes ? 'Eleito' : 'Não eleito';
    }
    if (updated.turno2.nationalCandidates[1]) {
      updated.turno2.nationalCandidates[1].votes = flavio2026Votes;
      updated.turno2.nationalCandidates[1].percentage = flavioPct;
      updated.turno2.nationalCandidates[1].status = flavio2026Votes > lula2026Votes ? 'Eleito' : 'Não eleito';
    }

    onSaveData(updated);
    setStatusMsg({ type: 'info', text: 'Dados manuais aplicados como "Demonstrativos / Não Verificados".' });
    setTimeout(() => {
      onClose();
    }, 800);
  };

  const handlePasteParse = () => {
    if (!pasteText.trim()) {
      setStatusMsg({ type: 'error', text: 'Cole o arquivo JSON retornado pelo TSE.' });
      return;
    }

    try {
      if (pasteText.trim().startsWith('{')) {
        const rawJson: TseRawJson = JSON.parse(pasteText);
        const parsedTse = parseTseOfficialJson(rawJson, currentData);

        if (parsedTse) {
          onSaveData(parsedTse);
          setStatusMsg({ type: 'success', text: 'JSON do TSE validado e importado oficialmente com sucesso!' });
          setTimeout(() => onClose(), 800);
          return;
        } else {
          setStatusMsg({ type: 'error', text: 'O JSON fornecido não contém o esquema de candidatos/votos oficial do TSE (propriedade "cand").' });
          return;
        }
      } else {
        setStatusMsg({ type: 'error', text: 'O conteúdo colado precisa ser um JSON válido retornado pelo TSE.' });
      }
    } catch (err: any) {
      setStatusMsg({ type: 'error', text: `Erro de validação no JSON: ${err.message}` });
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fade-in">
      <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-xl w-full border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden p-6 space-y-5">
        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-500/10 text-amber-500 flex items-center justify-center font-bold text-xl border border-amber-500/20">
              📥
            </div>
            <div>
              <h3 className="font-extrabold text-slate-900 dark:text-white text-lg tracking-tight">
                Importar ou Ajustar Boletim Oficial do TSE
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Apenas JSONs no esquema oficial do TSE são validados como autênticos
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Option 1: Import Official TSE JSON */}
        <div className="space-y-2">
          <label className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
            <FileCode className="w-4 h-4 text-emerald-500" />
            1. Importar JSON Oficial do TSE (Validação Rígida):
          </label>
          <textarea
            rows={4}
            value={pasteText}
            onChange={(e) => setPasteText(e.target.value)}
            placeholder='Cole o JSON oficial do TSE (contendo propriedades "cand", "pst", "vvc")...'
            className="w-full bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-2xl p-3 text-xs text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-500 font-mono"
          />
          <button
            onClick={handlePasteParse}
            className="w-full py-2.5 rounded-xl bg-emerald-600 text-white font-extrabold text-xs hover:bg-emerald-500 transition-colors flex items-center justify-center gap-1.5 shadow-sm"
          >
            <Upload className="w-4 h-4" />
            Validar e Importar JSON Oficial do TSE
          </button>
        </div>

        {/* Option 2: Manual Edit (Marked as Demonstrative) */}
        <div className="space-y-3 bg-slate-50 dark:bg-slate-800/50 p-4 rounded-2xl border border-slate-200 dark:border-slate-700/60">
          <span className="text-xs font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400 block">
            2. Ajuste Manual Demonstrativo (Marca como Não Verificado)
          </span>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                Votos Lula:
              </label>
              <input
                type="number"
                value={lula2026Votes}
                onChange={(e) => setLula2026Votes(Number(e.target.value))}
                className="w-full bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl px-3 py-2 text-xs font-bold text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                Votos Flávio Bolsonaro:
              </label>
              <input
                type="number"
                value={flavio2026Votes}
                onChange={(e) => setFlavio2026Votes(Number(e.target.value))}
                className="w-full bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl px-3 py-2 text-xs font-bold text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
            </div>
          </div>
        </div>

        {statusMsg && (
          <div
            className={`p-3 rounded-xl text-xs font-semibold flex items-center gap-2 border ${
              statusMsg.type === 'success'
                ? 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border-emerald-500/30'
                : statusMsg.type === 'error'
                ? 'bg-red-500/10 text-red-700 dark:text-red-300 border-red-500/30'
                : 'bg-amber-500/10 text-amber-700 dark:text-amber-300 border-amber-500/30'
            }`}
          >
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{statusMsg.text}</span>
          </div>
        )}

        {/* Footer Actions */}
        <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100 dark:border-slate-800">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs font-bold text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            Fechar
          </button>
          <button
            onClick={handleApplyManualEdit}
            className="px-5 py-2 rounded-xl bg-amber-500 text-slate-950 font-black text-xs hover:bg-amber-400 transition-all shadow-md flex items-center gap-1.5"
          >
            <Check className="w-4 h-4" />
            Aplicar Ajuste Demonstrativo
          </button>
        </div>
      </div>
    </div>
  );
};
