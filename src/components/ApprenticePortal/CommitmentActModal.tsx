import React, { useState } from 'react';
import { Apprentice, Ficha } from '../../types/induction';
import { FileCheck, X, PenTool, CheckCircle } from 'lucide-react';
import { soundFx } from '../../utils/audioSynth';
import { SenaLogo } from '../../assets/senaLogo';

interface CommitmentActModalProps {
  apprentice: Apprentice;
  ficha?: Ficha;
  isOpen: boolean;
  onClose: () => void;
  onSignCommitment: (signatureName: string) => void;
}

export const CommitmentActModal: React.FC<CommitmentActModalProps> = ({
  apprentice,
  ficha,
  isOpen,
  onClose,
  onSignCommitment,
}) => {
  const [signatureInput, setSignatureInput] = useState(apprentice.name);
  const [termsAccepted, setTermsAccepted] = useState(apprentice.commitmentSigned);

  if (!isOpen) return null;

  const handleSign = (e: React.FormEvent) => {
    e.preventDefault();
    if (!termsAccepted || !signatureInput.trim()) return;
    onSignCommitment(signatureInput.trim());
    soundFx.playSuccessChime();
    onClose();
  };

  const programName = ficha ? ficha.programName : 'Análisis y Desarrollo de Software (ADSO)';
  const fichaCode = ficha ? ficha.code : '2824910';

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-2xl w-full shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 bg-slate-50">
          <div className="flex items-center gap-2.5">
            <SenaLogo className="w-6 h-6" />
            <span className="text-sm font-bold text-slate-800">
              Acta de Compromiso del Aprendiz SENA
            </span>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-200/50 transition-colors cursor-pointer"
            aria-label="Cerrar modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 text-xs text-slate-700 space-y-4 max-h-[70vh] overflow-y-auto">
          <div className="bg-emerald-50/60 border border-emerald-200 rounded-xl p-4">
            <div className="text-xs font-bold text-emerald-900 mb-1">
              Compromiso Ético y Disciplinario Institucional
            </div>
            <p className="text-emerald-800 leading-relaxed text-[11px]">
              Al suscribir este documento, yo, <span className="font-bold">{apprentice.name}</span>, identificado con {apprentice.documentType} {apprentice.documentNumber}, aprendiz de la ficha {fichaCode} del programa <span className="font-semibold">{programName}</span>, manifiesto libre y conscientemente que conozco, comprendo y acato el Reglamento del Aprendiz SENA (Acuerdo 009 de 2024).
            </p>
          </div>

          <div className="space-y-2 border border-slate-200 rounded-xl p-4 bg-white">
            <div className="font-bold text-slate-900 mb-2">Puntos del Compromiso:</div>
            <ul className="space-y-1.5 list-disc list-inside leading-relaxed text-slate-600">
              <li>Portar permanentemente en lugar visible el carné institucional del SENA.</li>
              <li>Cumplir con el horario, asistencia puntual y entrega rigurosa de evidencias de aprendizaje.</li>
              <li>Preservar y cuidar los equipos, herramientas y la infraestructura física y tecnológica.</li>
              <li>Mantener un trato respetuoso y armónico hacia la comunidad educativa, compañeros y directivos.</li>
              <li>No incurrir en plagio ni en faltas disciplinarias leves, graves o gravísimas.</li>
              <li>Desarrollar la etapa productiva con ética y responsabilidad profesional en la empresa patrocinadora.</li>
            </ul>
          </div>

          <form onSubmit={handleSign} className="space-y-4 pt-2">
            <label className="flex items-start gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={termsAccepted}
                onChange={(e) => setTermsAccepted(e.target.checked)}
                className="mt-0.5 rounded border-slate-300 text-[#39A900] focus:ring-[#39A900]"
              />
              <span className="text-xs text-slate-800 leading-snug">
                He leído y acepto en su totalidad los términos del Reglamento del Aprendiz SENA y me comprometo a cumplir con los deberes consagrados durante toda mi permanencia en la institución.
              </span>
            </label>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Firma Digital (Escribe tu nombre completo como constancia legal):
              </label>
              <div className="relative">
                <PenTool className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={signatureInput}
                  onChange={(e) => setSignatureInput(e.target.value)}
                  placeholder="Tu nombre completo aquí"
                  className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#39A900]"
                  required
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-xs font-medium text-slate-600 hover:text-slate-800 transition-colors"
              >
                Cerrar
              </button>
              <button
                type="submit"
                disabled={!termsAccepted || !signatureInput.trim()}
                className="flex items-center gap-2 px-5 py-2 text-xs font-semibold rounded-lg bg-[#39A900] hover:bg-[#329600] disabled:bg-slate-200 disabled:text-slate-400 text-white transition-colors cursor-pointer"
              >
                <CheckCircle className="w-4 h-4" />
                <span>{apprentice.commitmentSigned ? 'Actualizar Firma' : 'Firmar y Legalizar Acta'}</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
