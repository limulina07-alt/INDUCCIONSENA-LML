import React, { useState } from 'react';
import { Apprentice, Ficha } from '../../types/induction';
import { Printer, Download, X, CheckCircle, ShieldCheck, HardDrive, ExternalLink } from 'lucide-react';
import { SenaLogo, SenaEscudo } from '../../assets/senaLogo';
import { uploadCertificateToDrive } from '../../services/googleDrive';
import { getAccessToken, googleSignIn } from '../../utils/googleAuth';
import { soundFx } from '../../utils/audioSynth';

interface CertificateModalProps {
  apprentice: Apprentice;
  ficha?: Ficha;
  isOpen: boolean;
  onClose: () => void;
}

export const CertificateModal: React.FC<CertificateModalProps> = ({
  apprentice,
  ficha,
  isOpen,
  onClose,
}) => {
  const [isSavingToDrive, setIsSavingToDrive] = useState(false);
  const [driveResult, setDriveResult] = useState<{ url?: string; success?: boolean; msg?: string } | null>(null);

  if (!isOpen) return null;

  const handlePrint = () => {
    window.print();
  };

  const programName = ficha ? ficha.programName : 'Análisis y Desarrollo de Software (ADSO)';
  const centerName = ficha ? ficha.centerName : 'Centro de Formación Técnica y Tecnológica';
  const regionalName = ficha ? ficha.regional : 'Regional Distrito Capital';
  const fichaCode = ficha ? ficha.code : '2824910';
  const certDate = apprentice.evaluationDate || new Date().toISOString().split('T')[0];
  const certCode = apprentice.certificateCode || `SENA-IND-2026-${apprentice.id.toUpperCase()}`;

  const handleSaveToDrive = async () => {
    setIsSavingToDrive(true);
    setDriveResult(null);
    try {
      let token = await getAccessToken();
      if (!token) {
        const signResult = await googleSignIn();
        token = signResult?.accessToken || null;
      }
      if (!token) throw new Error('No se pudo autenticar con Google');

      const htmlContent = `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>Certificado de Inducción SENA - ${apprentice.name}</title>
  <style>
    body { font-family: sans-serif; padding: 40px; color: #1e293b; background: #f8fafc; }
    .card { border: 4px double #065f46; padding: 30px; border-radius: 12px; background: #fff; max-width: 700px; margin: 0 auto; }
    h1 { color: #047857; margin-bottom: 4px; font-size: 22px; }
    .cert-code { font-family: monospace; font-weight: bold; background: #ecfdf5; padding: 2px 6px; border-radius: 4px; }
  </style>
</head>
<body>
  <div class="card">
    <h1>Servicio Nacional de Aprendizaje - SENA</h1>
    <h3>Constancia Oficial de Aprobación de Inducción FPI</h3>
    <p>Se hace constar que <strong>${apprentice.name}</strong> identificado con <strong>${apprentice.documentType} ${apprentice.documentNumber}</strong> ha culminado y aprobado satisfactoriamente el proceso de inducción institucional bajo el Acuerdo 009 de 2024.</p>
    <p><strong>Programa:</strong> ${programName} (Ficha ${fichaCode})</p>
    <p><strong>Centro:</strong> ${centerName} - ${regionalName}</p>
    <p><strong>Código de Verificación:</strong> <span class="cert-code">${certCode}</span></p>
    <p><strong>Fecha de Expedición:</strong> ${certDate}</p>
  </div>
</body>
</html>`;

      const uploaded = await uploadCertificateToDrive(apprentice.name, apprentice.documentNumber, certCode, htmlContent);
      soundFx.playSuccessChime();
      setDriveResult({
        success: true,
        url: uploaded.webViewLink,
        msg: `Certificado guardado en tu Google Drive (Carpeta: SENA - Inducción FPI 2026).`,
      });
    } catch (err: any) {
      soundFx.playErrorChime();
      setDriveResult({
        success: false,
        msg: err.message || 'Error al respaldar en Google Drive',
      });
    } finally {
      setIsSavingToDrive(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 flex items-center justify-center p-4">
      {/* Container */}
      <div className="bg-white rounded-2xl max-w-3xl w-full shadow-2xl overflow-hidden relative animate-in fade-in zoom-in-95 duration-150">
        {/* Modal Top Bar (Non-printable) */}
        <div className="no-print flex flex-col sm:flex-row sm:items-center justify-between px-6 py-4 border-b border-slate-200 bg-slate-50 gap-3">
          <div className="flex items-center gap-2.5">
            <SenaEscudo className="w-6 h-6" />
            <span className="text-sm font-bold text-slate-800">
              Constancia de Aprobación de Inducción SENA
            </span>
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            <button
              onClick={handleSaveToDrive}
              disabled={isSavingToDrive}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200 transition-colors cursor-pointer disabled:opacity-60"
              title="Guardar copia oficial en Google Drive"
            >
              <HardDrive className="w-3.5 h-3.5 text-[#4285F4]" />
              <span>{isSavingToDrive ? 'Guardando en Drive...' : 'Guardar en Google Drive'}</span>
            </button>
            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg bg-[#39A900] hover:bg-[#329600] text-white transition-colors cursor-pointer"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Imprimir / PDF</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-200/50 transition-colors cursor-pointer"
              aria-label="Cerrar modal"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Drive Result Notification Banner */}
        {driveResult && (
          <div
            className={`no-print px-6 py-2.5 text-xs flex items-center justify-between border-b ${
              driveResult.success
                ? 'bg-blue-50 border-blue-200 text-blue-800'
                : 'bg-red-50 border-red-200 text-red-800'
            }`}
          >
            <div className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-[#4285F4] shrink-0" />
              <span>{driveResult.msg}</span>
            </div>
            {driveResult.url && (
              <a
                href={driveResult.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1 font-bold underline text-blue-700 hover:text-blue-900"
              >
                <span>Ver en Google Drive</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            )}
          </div>
        )}

        {/* Certificate Sheet (Printable Area) */}
        <div
          id="sena-certificate-print"
          className="p-8 sm:p-12 bg-white text-slate-900 border-8 border-double border-emerald-800 m-2 sm:m-4 relative"
        >
          {/* Subtle Watermark Background with Official SENA Logo */}
          <div className="absolute inset-0 flex items-center justify-center opacity-6 pointer-events-none select-none">
            <SenaLogo className="w-80 h-80" />
          </div>

          {/* Certificate Header with Official Escudo and Logo */}
          <div className="text-center pb-6 border-b-2 border-emerald-800/40 relative">
            <div className="flex items-center justify-center gap-6 mb-3">
              <SenaEscudo className="w-16 h-16 object-contain drop-shadow-xs" />
              <div className="h-12 w-px bg-emerald-800/20" />
              <SenaLogo className="w-14 h-14 drop-shadow-xs" />
            </div>
            <div className="text-xs uppercase tracking-widest font-bold text-emerald-900">
              República de Colombia
            </div>
            <div className="text-sm font-extrabold text-slate-900 tracking-wider">
              SERVICIO NACIONAL DE APRENDIZAJE - SENA
            </div>
            <div className="text-xs text-slate-600 mt-0.5">
              {regionalName} · {centerName}
            </div>
          </div>

          {/* Title */}
          <div className="text-center my-6">
            <div className="text-xs uppercase tracking-widest text-[#39A900] font-bold mb-1">
              Certificación Institucional
            </div>
            <h2 className="text-xl sm:text-2xl font-serif font-bold text-slate-900">
              CONSTANCIA DE APROPIACIÓN E INDUCCIÓN
            </h2>
          </div>

          {/* Body Content */}
          <div className="text-center max-w-xl mx-auto space-y-4 my-8 text-sm leading-relaxed text-slate-700">
            <p>El Centro de Formación hace constar que el(la) aprendiz:</p>
            <div className="text-xl sm:text-2xl font-bold text-slate-900 underline decoration-[#39A900] decoration-2 underline-offset-4">
              {apprentice.name}
            </div>
            <p className="text-xs text-slate-600">
              Identificado(a) con {apprentice.documentType} No. <span className="font-semibold text-slate-800">{apprentice.documentNumber}</span>
            </p>
            <p className="text-xs sm:text-sm text-slate-700">
              Ha cursado, culminado y aprobado satisfactoriamente el{' '}
              <span className="font-semibold text-slate-900">Proceso de Inducción Institucional</span> para el programa:{' '}
              <span className="font-bold text-emerald-900 block mt-1">{programName}</span>
              <span className="text-xs text-slate-500 block mt-0.5">Ficha de Caracterización No. {fichaCode}</span>
            </p>
            <p className="text-xs text-slate-600">
              Demostrando conocimiento y apropiación del Reglamento del Aprendiz (Acuerdo 009 de 2024), los deberes, derechos, valores corporativos y la ruta de formación integral con una calificación del{' '}
              <span className="font-bold text-[#39A900]">{apprentice.evaluationScore ?? 92}%</span>.
            </p>
          </div>

          {/* Signatures Row (Institutional authorities without instructor personal profile) */}
          <div className="grid grid-cols-2 gap-8 pt-8 mt-8 border-t border-slate-200 text-center">
            <div>
              <div className="font-serif italic text-sm text-slate-800 mb-1">Coordinación de Formación Integral</div>
              <div className="w-40 h-px bg-slate-400 mx-auto my-1" />
              <div className="text-[11px] font-bold text-slate-800">Coordinación Académica de Centro</div>
              <div className="text-[10px] text-slate-500">Servicio Nacional de Aprendizaje</div>
            </div>
            <div>
              <div className="font-serif italic text-sm text-slate-800 mb-1">Dra. Claudia Patricia Gómez</div>
              <div className="w-40 h-px bg-slate-400 mx-auto my-1" />
              <div className="text-[11px] font-bold text-slate-800">Subdirección de Centro</div>
              <div className="text-[10px] text-slate-500">Servicio Nacional de Aprendizaje</div>
            </div>
          </div>

          {/* Certificate Footer Metadata */}
          <div className="mt-8 pt-4 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between text-[10px] text-slate-500 gap-2">
            <div>
              <span>Código de Verificación: </span>
              <span className="font-mono font-bold text-slate-700">{certCode}</span>
            </div>
            <div>
              <span>Fecha de Expedición: </span>
              <span className="font-semibold text-slate-700">{certDate}</span>
            </div>
            <div className="text-emerald-700 font-semibold flex items-center gap-1">
              <CheckCircle className="w-3 h-3 text-emerald-600" />
              <span>Validez Institucional Certificada</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
