import React, { useState } from 'react';
import { Apprentice, Ficha } from '../../types/induction';
import { Search, Award, CheckCircle2, RotateCcw, AlertTriangle, FileText, ChevronRight, Eye, Trash2 } from 'lucide-react';
import { soundFx } from '../../utils/audioSynth';

interface ApprenticeTableProps {
  apprentices: Apprentice[];
  activeFicha: Ficha;
  onUpdateApprentice: (updated: Apprentice) => void;
  onViewCertificate: (apprentice: Apprentice) => void;
  onViewDetails: (apprentice: Apprentice) => void;
  onDeleteApprentice?: (apprenticeId: string) => void;
}

export const ApprenticeTable: React.FC<ApprenticeTableProps> = ({
  apprentices,
  activeFicha,
  onUpdateApprentice,
  onViewCertificate,
  onViewDetails,
  onDeleteApprentice,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'todos' | 'completado' | 'en_progreso' | 'requiere_refuerzo' | 'no_iniciado'>('todos');
  const [appToDelete, setAppToDelete] = useState<Apprentice | null>(null);

  const filtered = apprentices.filter((app) => {
    const matchesFicha = app.fichaId === activeFicha.id;
    const matchesSearch =
      searchTerm.trim() === '' ||
      app.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      app.documentNumber.includes(searchTerm) ||
      app.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'todos' || app.status === statusFilter;
    return matchesFicha && matchesSearch && matchesStatus;
  });

  const handleResetAttempts = (app: Apprentice) => {
    const updated: Apprentice = {
      ...app,
      evaluationScore: undefined,
      evaluationPassed: false,
      status: 'en_progreso',
    };
    onUpdateApprentice(updated);
  };

  const handleManualApproval = (app: Apprentice) => {
    const now = new Date();
    const certCode = app.certificateCode || `SENA-IND-2026-${Math.random().toString(36).substring(2, 7).toUpperCase()}`;
    const updated: Apprentice = {
      ...app,
      evaluationScore: 100,
      evaluationPassed: true,
      status: 'completado',
      progressPercent: 100,
      certificateCode: certCode,
      evaluationDate: now.toISOString().replace('T', ' ').substring(0, 16),
      commitmentSigned: true,
      commitmentDate: now.toISOString().split('T')[0],
    };
    onUpdateApprentice(updated);
  };

  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-xs transition-colors">
      {/* Table Controls Bar */}
      <div className="p-4 sm:p-6 border-b border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        {/* Interactive Segmented Status Controls */}
        <div className="flex items-center gap-1 p-1 bg-slate-100 dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 overflow-x-auto">
          <button
            onClick={() => setStatusFilter('todos')}
            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
              statusFilter === 'todos' ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 shadow-xs' : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
            }`}
          >
            Todos ({apprentices.filter((a) => a.fichaId === activeFicha.id).length})
          </button>
          <button
            onClick={() => setStatusFilter('completado')}
            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
              statusFilter === 'completado' ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 shadow-xs' : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
            }`}
          >
            Aprobados ({apprentices.filter((a) => a.fichaId === activeFicha.id && a.status === 'completado').length})
          </button>
          <button
            onClick={() => setStatusFilter('requiere_refuerzo')}
            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
              statusFilter === 'requiere_refuerzo' ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 shadow-xs' : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
            }`}
          >
            Requiere Refuerzo ({apprentices.filter((a) => a.fichaId === activeFicha.id && a.status === 'requiere_refuerzo').length})
          </button>
          <button
            onClick={() => setStatusFilter('en_progreso')}
            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
              statusFilter === 'en_progreso' ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 shadow-xs' : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
            }`}
          >
            En Curso ({apprentices.filter((a) => a.fichaId === activeFicha.id && a.status === 'en_progreso').length})
          </button>
        </div>

        {/* Search */}
        <div className="relative min-w-[260px]">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Buscar por nombre o documento..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#39A900] text-slate-800 dark:text-slate-200 placeholder-slate-400 dark:placeholder-slate-500"
          />
        </div>
      </div>

      {/* Table Data */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="bg-slate-50/75 dark:bg-slate-800/60 border-b border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 font-semibold">
              <th className="py-3.5 px-4">Aprendiz</th>
              <th className="py-3.5 px-4">Documento</th>
              <th className="py-3.5 px-4">Avance Inducción</th>
              <th className="py-3.5 px-4">Evaluación</th>
              <th className="py-3.5 px-4">Acta</th>
              <th className="py-3.5 px-4">Estado</th>
              <th className="py-3.5 px-4 text-right">Acciones de Instructor</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={7} className="py-12 text-center text-slate-500 dark:text-slate-400">
                  No se encontraron aprendices en la ficha seleccionada con los filtros actuales.
                </td>
              </tr>
            ) : (
              filtered.map((app) => {
                const isPassed = app.evaluationPassed;
                const isFailed = app.status === 'requiere_refuerzo';

                return (
                  <tr key={app.id} className="hover:bg-slate-50/60 dark:hover:bg-slate-800/40 transition-colors">
                    {/* Name */}
                    <td className="py-3.5 px-4">
                      <div className="font-semibold text-slate-900 dark:text-slate-100">{app.name}</div>
                      <div className="text-[11px] text-slate-500 dark:text-slate-400">{app.email}</div>
                    </td>

                    {/* Document */}
                    <td className="py-3.5 px-4 tabular-nums text-slate-600 dark:text-slate-300 font-mono">
                      {app.documentType} {app.documentNumber}
                    </td>

                    {/* Progress */}
                    <td className="py-3.5 px-4 min-w-[140px]">
                      <div className="flex items-center justify-between text-[11px] mb-1">
                        <span className="font-semibold text-slate-700 dark:text-slate-300 tabular-nums">{app.progressPercent}%</span>
                        <span className="text-slate-400 dark:text-slate-500">{app.completedModules.length}/5 módulos</span>
                      </div>
                      <div className="w-full bg-slate-100 dark:bg-slate-800 h-1.5 rounded-full overflow-hidden">
                        <div
                          className="bg-[#39A900] h-full transition-all"
                          style={{ width: `${app.progressPercent}%` }}
                        />
                      </div>
                    </td>

                    {/* Evaluation */}
                    <td className="py-3.5 px-4">
                      {app.evaluationScore !== undefined ? (
                        <div>
                          <div className={`font-bold tabular-nums ${isPassed ? 'text-emerald-700 dark:text-emerald-400' : 'text-amber-700 dark:text-amber-400'}`}>
                            {app.evaluationScore}%
                          </div>
                          <div className="text-[10px] text-slate-400 dark:text-slate-500">
                            {app.evaluationAttempts} {app.evaluationAttempts === 1 ? 'intento' : 'intentos'}
                          </div>
                        </div>
                      ) : (
                        <span className="text-slate-400 dark:text-slate-500 italic">No presentada</span>
                      )}
                    </td>

                    {/* Commitment Act */}
                    <td className="py-3.5 px-4">
                      {app.commitmentSigned ? (
                        <span className="text-emerald-700 dark:text-emerald-400 font-semibold flex items-center gap-1">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>Firmada</span>
                        </span>
                      ) : (
                        <span className="text-slate-400 dark:text-slate-500">Pendiente</span>
                      )}
                    </td>

                    {/* Status (Unboxed per Anti-slop zero pill rules) */}
                    <td className="py-3.5 px-4">
                      {app.status === 'completado' ? (
                        <div className="text-emerald-700 dark:text-emerald-400 font-bold text-xs flex items-center gap-1">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>Aprobado</span>
                        </div>
                      ) : app.status === 'requiere_refuerzo' ? (
                        <div className="text-amber-700 dark:text-amber-400 font-semibold text-xs flex items-center gap-1">
                          <AlertTriangle className="w-3.5 h-3.5" />
                          <span>Requiere Refuerzo</span>
                        </div>
                      ) : app.status === 'en_progreso' ? (
                        <div className="text-sky-700 dark:text-sky-400 font-medium text-xs">
                          En Progreso
                        </div>
                      ) : (
                        <div className="text-slate-400 dark:text-slate-500 text-xs">
                          No Iniciado
                        </div>
                      )}
                    </td>

                    {/* Actions */}
                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => onViewDetails(app)}
                          title="Ver ficha y respuestas del aprendiz"
                          className="p-1.5 text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 rounded-md hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                        >
                          <Eye className="w-4 h-4" />
                        </button>

                        {isPassed && (
                          <button
                            onClick={() => onViewCertificate(app)}
                            title="Ver constancia de inducción"
                            className="p-1.5 text-emerald-700 dark:text-emerald-400 hover:text-emerald-900 dark:hover:text-emerald-300 rounded-md hover:bg-emerald-50 dark:hover:bg-emerald-950/50 transition-colors cursor-pointer"
                          >
                            <Award className="w-4 h-4" />
                          </button>
                        )}

                        {isFailed && (
                          <button
                            onClick={() => handleResetAttempts(app)}
                            title="Habilitar nuevo intento de evaluación"
                            className="p-1.5 text-amber-700 dark:text-amber-400 hover:text-amber-900 dark:hover:text-amber-300 rounded-md hover:bg-amber-50 dark:hover:bg-amber-950/50 transition-colors cursor-pointer"
                          >
                            <RotateCcw className="w-4 h-4" />
                          </button>
                        )}

                        {!isPassed && (
                          <button
                            onClick={() => handleManualApproval(app)}
                            title="Validar inducción por sustentación oral o taller presencial"
                            className="px-2 py-1 text-[11px] font-semibold text-[#39A900] hover:text-[#329600] rounded hover:bg-emerald-50 dark:hover:bg-emerald-950/50 transition-colors cursor-pointer"
                          >
                            Aprobar
                          </button>
                        )}

                        {onDeleteApprentice && (
                          <button
                            onClick={() => {
                              soundFx.playCardFlip();
                              setAppToDelete(app);
                            }}
                            title={`Eliminar aprendiz ${app.name} del listado`}
                            className="p-1.5 text-red-500 hover:text-red-700 dark:hover:text-red-400 rounded-md hover:bg-red-50 dark:hover:bg-red-950/50 transition-colors cursor-pointer"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Confirmation Modal for deletion inside dashboard table */}
      {appToDelete && onDeleteApprentice && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fadeIn">
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-red-200 dark:border-red-900/60 shadow-2xl max-w-md w-full p-6 space-y-4">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-red-100 dark:bg-red-950/80 text-red-600 dark:text-red-400 rounded-xl shrink-0">
                <AlertTriangle className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">
                  ¿Confirmar eliminación de aprendiz?
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Esta acción retirará permanentemente al aprendiz del listado de la ficha.
                </p>
              </div>
            </div>

            <div className="p-3.5 bg-slate-50 dark:bg-slate-800/80 rounded-xl border border-slate-200 dark:border-slate-700 space-y-1.5 text-xs">
              <div className="flex justify-between">
                <span className="text-slate-500 dark:text-slate-400">Nombre:</span>
                <span className="font-bold text-slate-900 dark:text-slate-100 text-right">{appToDelete.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500 dark:text-slate-400">Documento:</span>
                <span className="font-mono text-slate-700 dark:text-slate-300">
                  {appToDelete.documentType} {appToDelete.documentNumber}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500 dark:text-slate-400">Estado:</span>
                <span className="font-semibold text-slate-700 dark:text-slate-300">{appToDelete.status}</span>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2.5 pt-2">
              <button
                type="button"
                onClick={() => setAppToDelete(null)}
                className="px-4 py-2 text-xs font-semibold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors cursor-pointer"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={() => {
                  onDeleteApprentice(appToDelete.id);
                  soundFx.playDeleteSound();
                  setAppToDelete(null);
                }}
                className="flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-white bg-red-600 hover:bg-red-700 rounded-xl shadow-xs transition-colors cursor-pointer"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Sí, eliminar aprendiz</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
