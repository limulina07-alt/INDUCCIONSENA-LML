import React from 'react';
import { Apprentice, Ficha } from '../../types/induction';
import { INDUCTION_MODULES } from '../../data/senaData';
import { X, CheckCircle2, Clock, Award, AlertCircle, FileCheck, Mail, Phone } from 'lucide-react';
import { SenaLogo } from '../../assets/senaLogo';

interface ApprenticeDetailModalProps {
  apprentice: Apprentice | null;
  ficha?: Ficha;
  isOpen: boolean;
  onClose: () => void;
  onOpenCertificate: (app: Apprentice) => void;
}

export const ApprenticeDetailModal: React.FC<ApprenticeDetailModalProps> = ({
  apprentice,
  ficha,
  isOpen,
  onClose,
  onOpenCertificate,
}) => {
  if (!isOpen || !apprentice) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-2xl w-full shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 bg-slate-50">
          <div className="flex items-center gap-3">
            <SenaLogo className="w-7 h-7" />
            <div>
              <div className="text-[11px] text-slate-500 font-semibold uppercase tracking-wider">
                Hoja de Seguimiento de Inducción
              </div>
              <div className="text-base font-bold text-slate-900">
                {apprentice.name}
              </div>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-200/50 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6 max-h-[75vh] overflow-y-auto text-xs">
          {/* Metadata Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 p-4 bg-slate-50 rounded-xl border border-slate-200">
            <div>
              <div className="text-slate-400 text-[10px]">Identificación</div>
              <div className="font-semibold text-slate-800 font-mono">
                {apprentice.documentType} {apprentice.documentNumber}
              </div>
            </div>
            <div>
              <div className="text-slate-400 text-[10px]">Correo Electrónico</div>
              <div className="font-medium text-slate-800 truncate">{apprentice.email}</div>
            </div>
            <div>
              <div className="text-slate-400 text-[10px]">Teléfono</div>
              <div className="font-medium text-slate-800">{apprentice.phone}</div>
            </div>
            <div>
              <div className="text-slate-400 text-[10px]">Ficha de Formación</div>
              <div className="font-semibold text-emerald-800">
                {ficha ? `${ficha.code} - ${ficha.level}` : '2824910'}
              </div>
            </div>
            <div>
              <div className="text-slate-400 text-[10px]">Fecha Evaluación</div>
              <div className="font-medium text-slate-800">{apprentice.evaluationDate || 'Pendiente'}</div>
            </div>
            <div>
              <div className="text-slate-400 text-[10px]">Acta de Compromiso</div>
              <div className="font-semibold text-slate-800">
                {apprentice.commitmentSigned ? 'Legalizada ✓' : 'Pendiente por firmar'}
              </div>
            </div>
          </div>

          {/* Module Breakdown */}
          <div>
            <div className="text-xs font-bold text-slate-900 mb-2">
              Apropiación por Módulos Temáticos
            </div>
            <div className="space-y-2">
              {INDUCTION_MODULES.map((mod) => {
                const isDone = apprentice.completedModules.includes(mod.id);
                return (
                  <div
                    key={mod.id}
                    className="flex items-center justify-between p-3 rounded-xl border border-slate-200 bg-white"
                  >
                    <div className="flex items-center gap-2">
                      {isDone ? (
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                      ) : (
                        <Clock className="w-4 h-4 text-slate-300 shrink-0" />
                      )}
                      <div>
                        <div className="font-semibold text-slate-800">{mod.title}</div>
                        <div className="text-[11px] text-slate-500">{mod.subtitle}</div>
                      </div>
                    </div>
                    <span className="text-[11px] font-medium text-slate-600">
                      {isDone ? 'Apropiado' : 'Sin finalizar'}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Evaluation Diagnostics & Pedagogical Feedback */}
          <div className="p-4 rounded-xl border border-slate-200 bg-white">
            <div className="flex items-center justify-between mb-2">
              <div className="font-bold text-slate-900">
                Resultado de la Evaluación de Apropiación
              </div>
              <div className="text-sm font-bold text-[#39A900] tabular-nums">
                {apprentice.evaluationScore !== undefined ? `${apprentice.evaluationScore}%` : 'Sin presentar'}
              </div>
            </div>

            {apprentice.evaluationPassed ? (
              <div className="text-emerald-800 bg-emerald-50/60 p-3 rounded-lg border border-emerald-200 text-xs">
                El aprendiz ha demostrado apropiación suficiente del marco legal institucional (Reglamento del Aprendiz, derechos, deberes, debido proceso y alternativas de etapa productiva). Constancia habilitada.
              </div>
            ) : apprentice.status === 'requiere_refuerzo' ? (
              <div className="text-amber-900 bg-amber-50/60 p-3 rounded-lg border border-amber-200 text-xs space-y-1">
                <div className="font-bold">Recomendación Pedagógica del Instructor:</div>
                <p>
                  El aprendiz obtuvo un puntaje inferior al 80%. Se sugiere realizar sesión de tutoría sincrónica o presencial reforzando los artículos 7 (Derechos de revisión), 9 (Uso de carné/EPP) y 22 (Causales de deserción por 3 días injustificados) previo a su segundo intento.
                </p>
              </div>
            ) : (
              <div className="text-slate-600 bg-slate-50 p-3 rounded-lg border border-slate-200 text-xs">
                El aprendiz aún se encuentra navegando los módulos introductorios de la inducción.
              </div>
            )}
          </div>

          {/* Action Footer */}
          <div className="flex items-center justify-between pt-4 border-t border-slate-100">
            <button
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 transition-colors"
            >
              Cerrar
            </button>
            {apprentice.evaluationPassed && (
              <button
                onClick={() => {
                  onClose();
                  onOpenCertificate(apprentice);
                }}
                className="flex items-center gap-1.5 px-4 py-2 text-xs font-semibold rounded-lg bg-[#39A900] hover:bg-[#329600] text-white transition-colors cursor-pointer"
              >
                <Award className="w-3.5 h-3.5" />
                <span>Ver Constancia Institucional</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
