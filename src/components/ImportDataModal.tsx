/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { PresidentialElectionData } from '../types/election';
import { parseTseOfficialJson, TseRawJson } from '../utils/tseParser';
import { X, Check, Upload, AlertCircle, FileCode, ShieldAlert } from 'lucide-react';

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
  const [cand1Votes, setCand1Votes] = useState(currentData.turno2.nationalCandidates[0]?.votes || 0);
  const [cand2Votes, setCand2Votes] = useState(currentData.turno2.nationalCandidates[1]?.votes || 0);
  const [statusMsg, setStatusMsg] = useState<{ type: 'success' | 'error' | 'info'; text: string } | null>(null);

  if (!isOpen) return null;

  const handleApplyManualEdit = () => {
    const totalValid = cand1Votes + cand2Votes;
    const p1 = totalValid > 0 ? (cand1Votes / totalValid) * 100 : 50;
    const p2 = totalValid > 0 ? (cand2Votes / totalValid) * 100 : 50;

    const updated: PresidentialElectionData = JSON.parse(JSON.stringify(currentData));
    updated.dataUpdatedAt = new Date().toISOString();
    updated.audit = {
      provenance: 'MANUAL_IMPORT_UNVERIFIED',
      schemaValid: false,
      sourceVerified: false,
      officiallyPublished: false,
      importedAt: new Date().toISOString(),
      validationWarnings: ['Dados editados manualmente pelo usuário no painel. Não verificados pelo TSE.']
    };
    updated.source = 'Ajuste Manual do Usuário (Não Verificado pelo TSE)';
    updated.turno2.totalValidVotes = totalValid;

    // Update 2nd round national candidates
    if (updated.turno2.nationalCandidates[0]) {
      updated.turno2.nationalCandidates[0].votes = cand1Votes;
      updated.turno2.nationalCandidates[0].percentage = p1;
      updated.turno2.nationalCandidates[0].status = cand1Votes > cand2Votes ? 'Liderando' : 'Segundo';
    }
    if (updated.turno2.nationalCandidates[1]) {
      updated.turno2.nationalCandidates[1].votes = cand2Votes;
      updated.turno2.nationalCandidates[1].percentage = p2;
      updated.turno2.nationalCandidates[1].status = cand2Votes > cand1Votes ? 'Liderando' : 'Segundo';
    }

    onSaveData(updated);
    setStatusMsg({ type: 'info', text: 'Dados manuais aplicados como "MANUAL_IMPORT_UNVERIFIED".' });
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
        const parseResult = parseTseOfficialJson(rawJson, {
          sourceVerified: false, // User pasted content is NOT sourceVerified by server
          provenance: 'MANUAL_IMPORT_UNVERIFIED',
          existingData: currentData
        });

        if (parseResult.success && parseResult.data) {
          onSaveData(parseResult.data);
          setStatusMsg({
            type: 'success',
            text: `JSON validado no esquema do TSE (${parseResult.scope || 'BR'} - ${parseResult.turn}ºT)! Marcado como MANUAL_IMPORT_UNVERIFIED.`
          });
          setTimeout(() => onClose(), 1200);
          return;
        } else {
          setStatusMsg({
            type: 'error',
            text: parseResult.errors?.join('; ') || 'Esquema incompatível com a estrutura oficial do TSE.'
          });
          return;
        }
      } else {
        setStatusMsg({ type: 'error', text: 'O conteúdo precisa ser um objeto JSON formatado.' });
      }
    } catch (err: any) {
      setStatusMsg({ type: 'error', text: `Erro de sintaxe no JSON: ${err.message}` });
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
                Importador de Dados Eleitorais do TSE
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Diferenciação estrita de procedência (Validação de Esquema vs. Fonte Oficial)
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

        {/* Notice on Provenance */}
        <div className="p-3 bg-slate-100 dark:bg-slate-800/80 rounded-xl text-[11px] text-slate-600 dark:text-slate-300 flex items-start gap-2 border border-slate-200 dark:border-slate-700">
          <ShieldAlert className="w-4 h-4 text-purple-500 shrink-0 mt-0.5" />
          <span>
            <strong>Auditoria de Procedência:</strong> Arquivos importados manualmente são validados no esquema oficial do TSE, mas classificados com procedência <code>MANUAL_IMPORT_UNVERIFIED</code>, pois a origem não é autenticada diretamente pelo servidor.
          </span>
        </div>

        {/* Option 1: Import Official TSE JSON */}
        <div className="space-y-2">
          <label className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
            <FileCode className="w-4 h-4 text-emerald-500" />
            1. Colar JSON do TSE (Validação de Esquema e Turno):
          </label>
          <textarea
            rows={4}
            value={pasteText}
            onChange={(e) => setPasteText(e.target.value)}
            placeholder='Cole o arquivo JSON baixado do TSE (ex: dados-simplificados/br/...)...'
            className="w-full bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-2xl p-3 text-xs text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-500 font-mono"
          />
          <button
            onClick={handlePasteParse}
            className="w-full py-2.5 rounded-xl bg-emerald-600 text-white font-extrabold text-xs hover:bg-emerald-500 transition-colors flex items-center justify-center gap-1.5 shadow-sm"
          >
            <Upload className="w-4 h-4" />
            Validar Esquema e Carregar JSON
          </button>
        </div>

        {/* Option 2: Manual Edit */}
        <div className="space-y-3 bg-slate-50 dark:bg-slate-800/50 p-4 rounded-2xl border border-slate-200 dark:border-slate-700/60">
          <span className="text-xs font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400 block">
            2. Ajuste Rápido de Simulação
          </span>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                Votos {currentData.turno2.nationalCandidates[0]?.shortName || 'Candidato 1'}:
              </label>
              <input
                type="number"
                value={cand1Votes}
                onChange={(e) => setCand1Votes(Number(e.target.value))}
                className="w-full bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl px-3 py-2 text-xs font-bold text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                Votos {currentData.turno2.nationalCandidates[1]?.shortName || 'Candidato 2'}:
              </label>
              <input
                type="number"
                value={cand2Votes}
                onChange={(e) => setCand2Votes(Number(e.target.value))}
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
            Aplicar Dados Manuais
          </button>
        </div>
      </div>
    </div>
  );
};
