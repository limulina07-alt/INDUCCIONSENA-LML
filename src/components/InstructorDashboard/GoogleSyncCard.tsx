import React, { useState } from 'react';
import { User } from 'firebase/auth';
import {
  FileSpreadsheet,
  ExternalLink,
  RefreshCw,
  CheckCircle2,
  AlertCircle,
  HardDrive,
  LogOut,
  Sparkles,
  Users,
} from 'lucide-react';
import { soundFx } from '../../utils/audioSynth';

interface GoogleSyncCardProps {
  currentUser: User | null;
  accessToken: string | null;
  spreadsheetId: string | null;
  spreadsheetUrl: string | null;
  isConnecting: boolean;
  isSyncing: boolean;
  lastSyncTime: string | null;
  errorMsg: string | null;
  totalApprentices: number;
  onConnectGoogle: () => void;
  onDisconnectGoogle: () => void;
  onSyncAll: () => void;
}

export const GoogleSyncCard: React.FC<GoogleSyncCardProps> = ({
  currentUser,
  accessToken,
  spreadsheetId,
  spreadsheetUrl,
  isConnecting,
  isSyncing,
  lastSyncTime,
  errorMsg,
  totalApprentices,
  onConnectGoogle,
  onDisconnectGoogle,
  onSyncAll,
}) => {
  const isConnected = !!currentUser && !!accessToken;

  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-xs transition-colors">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-5 border-b border-slate-100 dark:border-slate-800">
        <div className="flex items-start sm:items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800/80 flex items-center justify-center shrink-0">
            <FileSpreadsheet className="w-6 h-6 text-[#0F9D58]" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-emerald-800 dark:text-emerald-400 uppercase tracking-wide">
                Google Workspace Cloud
              </span>
              <span className="text-slate-300 dark:text-slate-700">·</span>
              <span className="text-xs text-slate-500 dark:text-slate-400">
                Drive & Sheets API
              </span>
            </div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">
              Sincronización en Tiempo Real con Google Drive
            </h3>
          </div>
        </div>

        {/* Live sync pill */}
        <div className="flex items-center gap-2">
          {isConnected ? (
            <div className="flex items-center gap-1.5 px-3 py-1 bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200 dark:border-emerald-800/80 text-emerald-800 dark:text-emerald-300 rounded-full text-xs font-semibold">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>Sincronización en Vivo Activa</span>
            </div>
          ) : (
            <div className="flex items-center gap-1.5 px-3 py-1 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 rounded-full text-xs font-medium">
              <span className="w-2 h-2 rounded-full bg-slate-400" />
              <span>No Conectado</span>
            </div>
          )}
        </div>
      </div>

      {errorMsg && (
        <div className="mt-4 p-3 bg-red-50 dark:bg-red-950/50 border border-red-200 dark:border-red-900 text-red-700 dark:text-red-400 rounded-xl text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      <div className="pt-5 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div className="space-y-1.5 max-w-xl">
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
            {isConnected
              ? 'Todos los datos de caracterización, avance en módulos y resultados evaluativos que completen los aprendices se reflejan instantáneamente en tu hoja de cálculo alojada en Google Drive.'
              : 'Conecta tu cuenta de Google para habilitar el guardado y sincronización automática de aprendices en una hoja de Google Sheets en tu unidad de Google Drive.'}
          </p>

          {isConnected && (
            <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500 dark:text-slate-400 pt-1">
              <span className="flex items-center gap-1">
                <HardDrive className="w-3.5 h-3.5 text-slate-400" />
                <span>Cuenta: <strong>{currentUser.email}</strong></span>
              </span>
              <span className="text-slate-300 dark:text-slate-700">·</span>
              {lastSyncTime && (
                <span>Último guardado: <span className="font-medium text-slate-700 dark:text-slate-300">{lastSyncTime}</span></span>
              )}
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center gap-3 shrink-0">
          {!isConnected ? (
            <button
              onClick={() => {
                soundFx.playSuccessChime();
                onConnectGoogle();
              }}
              disabled={isConnecting}
              className="flex items-center gap-2 px-4 py-2.5 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-750 text-slate-800 dark:text-slate-100 rounded-xl border border-slate-300 dark:border-slate-700 text-xs font-semibold shadow-xs hover:shadow-md transition-all cursor-pointer disabled:opacity-50"
            >
              {/* Official Google G Logo */}
              <svg className="w-4 h-4 shrink-0" viewBox="0 0 48 48">
                <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z" />
                <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z" />
                <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z" />
                <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z" />
              </svg>
              <span>{isConnecting ? 'Conectando con Google...' : 'Conectar con Google Drive / Sheets'}</span>
            </button>
          ) : (
            <>
              {spreadsheetUrl && (
                <a
                  href={spreadsheetUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold shadow-xs transition-colors"
                >
                  <FileSpreadsheet className="w-4 h-4" />
                  <span>Abrir Hoja en Google Drive</span>
                  <ExternalLink className="w-3.5 h-3.5 opacity-80" />
                </a>
              )}

              <button
                onClick={onSyncAll}
                disabled={isSyncing}
                title="Sincronizar todos los registros actuales de la ficha hacia Google Sheets"
                className="flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 text-xs font-semibold transition-colors cursor-pointer disabled:opacity-50"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${isSyncing ? 'animate-spin text-[#39A900]' : ''}`} />
                <span>{isSyncing ? 'Sincronizando...' : `Sincronizar Cohorte (${totalApprentices})`}</span>
              </button>

              <button
                onClick={onDisconnectGoogle}
                title="Cerrar sesión de Google Workspace"
                className="p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 transition-colors cursor-pointer"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
