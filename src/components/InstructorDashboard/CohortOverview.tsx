import React from 'react';
import { Ficha, Apprentice } from '../../types/induction';
import { Users, CheckCircle, AlertTriangle, FileCheck, Download, Plus, RotateCcw, HardDrive } from 'lucide-react';
import { SenaLogo } from '../../assets/senaLogo';

interface CohortOverviewProps {
  fichas: Ficha[];
  activeFicha: Ficha;
  onSelectFicha: (fichaId: string) => void;
  cohortApprentices: Apprentice[];
  onOpenAddModal: () => void;
  onExportCSV: () => void;
  onResetDemo: () => void;
  onOpenGoogleDrive?: () => void;
}

export const CohortOverview: React.FC<CohortOverviewProps> = ({
  fichas,
  activeFicha,
  onSelectFicha,
  cohortApprentices,
  onOpenAddModal,
  onExportCSV,
  onResetDemo,
  onOpenGoogleDrive,
}) => {
  const total = cohortApprentices.length;
  const approvedCount = cohortApprentices.filter((a) => a.evaluationPassed).length;
  const requiresReinforcementCount = cohortApprentices.filter((a) => a.status === 'requiere_refuerzo').length;
  const inProgressCount = cohortApprentices.filter((a) => a.status === 'en_progreso').length;
  const signedCommitmentCount = cohortApprentices.filter((a) => a.commitmentSigned).length;

  const approvalRate = total > 0 ? Math.round((approvedCount / total) * 100) : 0;
  const scores = cohortApprentices.filter((a) => a.evaluationScore !== undefined).map((a) => a.evaluationScore!);
  const avgScore = scores.length > 0 ? Math.round(scores.reduce((a, b) => a + b, 0) / scores.length) : 0;

  return (
    <div className="space-y-6">
      {/* Header and Ficha Selector Bar */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4 transition-colors">
        <div className="flex items-start gap-4">
          <SenaLogo className="w-10 h-10 mt-1" />
          <div>
            <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 mb-1">
              <span>Coordinación de Formación Profesional</span>
              <span aria-hidden="true">·</span>
              <span>Gestión y Monitoreo de Inducción</span>
              <span aria-hidden="true">·</span>
              <span className="text-[#39A900] font-semibold">Rol Instructor / Líder</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-slate-100 tracking-tight">
              Panel de Control de Cohortes e Inducción
            </h1>
            <p className="text-xs text-slate-600 dark:text-slate-300 mt-0.5">
              {activeFicha.centerName} · {activeFicha.regional} · Instructor: {activeFicha.instructorLeader}
            </p>
          </div>
        </div>

        {/* Ficha Selector Dropdown and Actions */}
        <div className="flex flex-wrap items-center gap-2">
          <div className="flex items-center gap-2">
            <label className="text-xs font-semibold text-slate-600 dark:text-slate-400 whitespace-nowrap">
              Ficha Activa:
            </label>
            <select
              value={activeFicha.id}
              onChange={(e) => onSelectFicha(e.target.value)}
              className="text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg px-3 py-2 font-bold text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-[#39A900]"
            >
              {fichas.map((f) => (
                <option key={f.id} value={f.id}>
                  Ficha {f.code} - {f.programName}
                </option>
              ))}
            </select>
          </div>

          <button
            onClick={onOpenAddModal}
            className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold rounded-lg bg-[#39A900] hover:bg-[#329600] text-white transition-colors cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Nuevo Aprendiz</span>
          </button>

          <button
            onClick={onExportCSV}
            className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 transition-colors cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Exportar CSV</span>
          </button>

          {onOpenGoogleDrive && (
            <button
              onClick={onOpenGoogleDrive}
              className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold rounded-lg border border-blue-200 dark:border-blue-900/60 bg-blue-50 dark:bg-blue-950/40 hover:bg-blue-100 dark:hover:bg-blue-900/50 text-blue-700 dark:text-blue-300 transition-colors cursor-pointer"
              title="Respaldar datos en Google Drive"
            >
              <HardDrive className="w-3.5 h-3.5 text-[#4285F4]" />
              <span>Google Drive</span>
            </button>
          )}

          <button
            onClick={onResetDemo}
            title="Restablecer datos originales de prueba"
            className="p-2 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Analytics KPI Row */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        {/* Total Aprendices */}
        <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-5 shadow-xs transition-colors">
          <div className="text-xs text-slate-500 dark:text-slate-400 mb-1">Aprendices en Cohorte</div>
          <div className="text-2xl font-bold text-slate-900 dark:text-slate-100 tabular-nums">{total}</div>
          <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-2">
            Matriculados formalmente
          </div>
        </div>

        {/* Aprobación */}
        <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-5 shadow-xs transition-colors">
          <div className="text-xs text-slate-500 dark:text-slate-400 mb-1">Aprobación de Inducción</div>
          <div className="text-2xl font-bold text-emerald-700 dark:text-emerald-400 tabular-nums">{approvalRate}%</div>
          <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-2">
            {approvedCount} de {total} certificados
          </div>
        </div>

        {/* Promedio Calificación */}
        <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-5 shadow-xs transition-colors">
          <div className="text-xs text-slate-500 dark:text-slate-400 mb-1">Promedio Evaluación</div>
          <div className="text-2xl font-bold text-[#39A900] tabular-nums">
            {avgScore > 0 ? `${avgScore}%` : 'N/A'}
          </div>
          <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-2">
            Mínimo exigido: 80%
          </div>
        </div>

        {/* Requiere Refuerzo */}
        <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-5 shadow-xs transition-colors">
          <div className="text-xs text-slate-500 dark:text-slate-400 mb-1">Requieren Refuerzo</div>
          <div className="text-2xl font-bold text-amber-600 dark:text-amber-400 tabular-nums">
            {requiresReinforcementCount}
          </div>
          <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-2">
            Plan pedagógico pendiente
          </div>
        </div>

        {/* Actas de Compromiso */}
        <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-5 shadow-xs transition-colors">
          <div className="text-xs text-slate-500 dark:text-slate-400 mb-1">Actas Firmadas</div>
          <div className="text-2xl font-bold text-slate-900 dark:text-slate-100 tabular-nums">
            {signedCommitmentCount} <span className="text-xs font-normal text-slate-400">/ {total}</span>
          </div>
          <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-2">
            Legalización de matrícula
          </div>
        </div>
      </div>
    </div>
  );
};
