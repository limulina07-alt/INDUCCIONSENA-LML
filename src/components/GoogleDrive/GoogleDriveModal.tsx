import React, { useState, useEffect } from 'react';
import { User } from 'firebase/auth';
import {
  X,
  HardDrive,
  FolderPlus,
  Upload,
  RefreshCw,
  FileSpreadsheet,
  FileText,
  Folder,
  ExternalLink,
  Trash2,
  AlertTriangle,
  CheckCircle2,
  LogOut,
  Search,
} from 'lucide-react';
import { auth, googleSignIn, logout, getAccessToken, initAuth } from '../../utils/googleAuth';
import {
  listDriveFiles,
  GoogleDriveFile,
  backupCohortCsvToDrive,
  saveCohortSpreadsheetToDrive,
  uploadFileToDrive,
  deleteFileFromDrive,
  findOrCreateSenaFolder,
} from '../../services/googleDrive';
import { GoogleSignInButton } from './GoogleSignInButton';
import { Apprentice, Ficha } from '../../types/induction';
import { soundFx } from '../../utils/audioSynth';

interface GoogleDriveModalProps {
  isOpen: boolean;
  onClose: () => void;
  activeFicha?: Ficha;
  apprentices?: Apprentice[];
}

export const GoogleDriveModal: React.FC<GoogleDriveModalProps> = ({
  isOpen,
  onClose,
  activeFicha,
  apprentices = [],
}) => {
  const [user, setUser] = useState<User | null>(auth.currentUser);
  const [hasToken, setHasToken] = useState<boolean>(false);
  const [isLoggingIn, setIsLoggingIn] = useState<boolean>(false);
  const [isLoadingFiles, setIsLoadingFiles] = useState<boolean>(false);
  const [files, setFiles] = useState<GoogleDriveFile[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [statusMessage, setStatusMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Destructive delete confirmation modal state
  const [fileToDelete, setFileToDelete] = useState<GoogleDriveFile | null>(null);
  const [isDeleting, setIsDeleting] = useState<boolean>(false);

  // New file modal / prompt
  const [isUploadingReport, setIsUploadingReport] = useState<boolean>(false);
  const [newNoteTitle, setNewNoteTitle] = useState('');
  const [newNoteContent, setNewNoteContent] = useState('');
  const [showNoteForm, setShowNoteForm] = useState(false);
  const [isSubmittingNote, setIsSubmittingNote] = useState(false);

  // Check auth on open and init
  useEffect(() => {
    if (!isOpen) return;

    let isMounted = true;

    // Check if token already exists in memory
    getAccessToken().then((token) => {
      if (!isMounted) return;
      if (token && auth.currentUser) {
        setUser(auth.currentUser);
        setHasToken(true);
        fetchFiles();
      } else {
        setHasToken(false);
      }
    });

    const unsubscribe = initAuth(
      (u, token) => {
        if (!isMounted) return;
        setUser(u);
        setHasToken(Boolean(token));
        if (token) {
          fetchFiles();
        }
      },
      () => {
        if (!isMounted) return;
        setUser(null);
        setHasToken(false);
        setFiles([]);
      }
    );

    return () => {
      isMounted = false;
      unsubscribe();
    };
  }, [isOpen]);

  const fetchFiles = async () => {
    const token = await getAccessToken();
    if (!token) {
      setHasToken(false);
      setIsLoadingFiles(false);
      return;
    }

    setIsLoadingFiles(true);
    setStatusMessage(null);
    try {
      const driveFiles = await listDriveFiles(searchQuery);
      setFiles(driveFiles);
    } catch (err: any) {
      console.warn('Error fetching Drive files:', err);
      const isAuthErr =
        err.message?.includes('expirado') ||
        err.message?.includes('sesión') ||
        err.message?.includes('401') ||
        err.message?.includes('autenticación');

      if (isAuthErr) {
        setHasToken(false);
      }

      setStatusMessage({
        type: 'error',
        text: err.message || 'No se pudieron cargar los archivos de Google Drive.',
      });
    } finally {
      setIsLoadingFiles(false);
    }
  };

  const handleLogin = async () => {
    setIsLoggingIn(true);
    setStatusMessage(null);
    try {
      const result = await googleSignIn();
      if (result) {
        setUser(result.user);
        setHasToken(true);
        soundFx.playSuccessChime();
        setStatusMessage({
          type: 'success',
          text: 'Conexión con Google Drive realizada correctamente.',
        });
        await fetchFiles();
      }
    } catch (err: any) {
      console.error('Login error:', err);
      soundFx.playErrorChime();
      setStatusMessage({
        type: 'error',
        text: err.message || 'Error al iniciar sesión con Google.',
      });
    } finally {
      setIsLoggingIn(false);
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
      setUser(null);
      setHasToken(false);
      setFiles([]);
      soundFx.playCardFlip();
      setStatusMessage({
        type: 'success',
        text: 'Sesión de Google cerrada.',
      });
    } catch (err: any) {
      console.error('Logout error:', err);
    }
  };

  const handleBackupCohortToDrive = async () => {
    if (!activeFicha) return;
    setIsUploadingReport(true);
    setStatusMessage(null);
    try {
      const cohortApps = apprentices.filter((a) => a.fichaId === activeFicha.id);
      const headers = [
        'ID Aprendiz',
        'Nombre Completo',
        'Tipo Documento',
        'Número Documento',
        'Correo Institucional',
        'Ficha',
        'Programa de Formación',
        'Avance %',
        'Calificación Evaluación',
        'Aprobado (80%+)',
        'Intentos Realizados',
        'Acta Firmada',
        'Código Certificado',
        'Estado Actual',
      ];

      const rows = cohortApps.map((a) => [
        a.id,
        `"${a.name}"`,
        a.documentType,
        a.documentNumber,
        a.email,
        activeFicha.code,
        `"${activeFicha.programName}"`,
        a.progressPercent,
        a.evaluationScore ?? 'N/A',
        a.evaluationPassed ? 'SI' : 'NO',
        a.evaluationAttempts,
        a.commitmentSigned ? 'SI' : 'NO',
        a.certificateCode || 'N/A',
        a.status,
      ]);

      const csvContent = [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
      const uploaded = await saveCohortSpreadsheetToDrive(activeFicha.code, activeFicha.programName, csvContent);

      soundFx.playSuccessChime();
      setStatusMessage({
        type: 'success',
        text: `Hoja de cálculo "${uploaded.name}" guardada y sincronizada exitosamente en la carpeta "SENA - Inducción FPI 2026" de Google Drive.`,
      });
      await fetchFiles();
    } catch (err: any) {
      console.error('Backup error:', err);
      soundFx.playErrorChime();
      setStatusMessage({
        type: 'error',
        text: err.message || 'Error al guardar la hoja de cálculo en Google Drive.',
      });
    } finally {
      setIsUploadingReport(false);
    }
  };

  const handleCreateNote = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newNoteTitle.trim() || !newNoteContent.trim()) return;
    setIsSubmittingNote(true);
    try {
      const folderId = await findOrCreateSenaFolder();
      const fileName = `${newNoteTitle.trim().replace(/\s+/g, '_')}.txt`;
      await uploadFileToDrive(fileName, newNoteContent, 'text/plain', folderId);
      soundFx.playSuccessChime();
      setStatusMessage({
        type: 'success',
        text: `Documento "${fileName}" creado en Google Drive.`,
      });
      setNewNoteTitle('');
      setNewNoteContent('');
      setShowNoteForm(false);
      await fetchFiles();
    } catch (err: any) {
      soundFx.playErrorChime();
      setStatusMessage({
        type: 'error',
        text: err.message || 'Error al crear el documento.',
      });
    } finally {
      setIsSubmittingNote(false);
    }
  };

  const handleConfirmDelete = async () => {
    if (!fileToDelete) return;
    setIsDeleting(true);
    try {
      await deleteFileFromDrive(fileToDelete.id);
      soundFx.playDeleteSound();
      setStatusMessage({
        type: 'success',
        text: `Archivo "${fileToDelete.name}" eliminado de Google Drive.`,
      });
      setFileToDelete(null);
      await fetchFiles();
    } catch (err: any) {
      soundFx.playErrorChime();
      setStatusMessage({
        type: 'error',
        text: err.message || 'No se pudo eliminar el archivo de Google Drive.',
      });
    } finally {
      setIsDeleting(false);
    }
  };

  if (!isOpen) return null;

  const getFileIcon = (mimeType: string) => {
    if (mimeType.includes('folder')) {
      return <Folder className="w-4 h-4 text-amber-500" />;
    }
    if (mimeType.includes('spreadsheet') || mimeType.includes('csv')) {
      return <FileSpreadsheet className="w-4 h-4 text-emerald-600" />;
    }
    return <FileText className="w-4 h-4 text-sky-600" />;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-xs animate-fadeIn">
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xl max-w-2xl w-full max-h-[90vh] flex flex-col overflow-hidden">
        
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-blue-50 dark:bg-blue-950/60 text-[#4285F4] rounded-xl">
              <HardDrive className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-slate-100">
                  Google Drive · Respaldo y Archivos
                </h2>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-100 dark:bg-blue-900/50 text-blue-800 dark:text-blue-300">
                  Workspace
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Sincroniza y almacena reportes, actas y certificados oficiales de la inducción SENA.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-5 flex-1">
          {/* Status feedback banner */}
          {statusMessage && (
            <div
              className={`p-3.5 rounded-xl text-xs flex items-center justify-between animate-fadeIn ${
                statusMessage.type === 'success'
                  ? 'bg-emerald-50 dark:bg-emerald-950/50 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800'
                  : 'bg-red-50 dark:bg-red-950/50 text-red-700 dark:text-red-400 border border-red-200 dark:border-red-900'
              }`}
            >
              <div className="flex items-center gap-2">
                {statusMessage.type === 'success' ? (
                  <CheckCircle2 className="w-4 h-4 text-[#39A900] shrink-0" />
                ) : (
                  <AlertTriangle className="w-4 h-4 text-red-500 shrink-0" />
                )}
                <span>{statusMessage.text}</span>
              </div>
              <button
                type="button"
                onClick={() => setStatusMessage(null)}
                className="text-slate-400 hover:text-slate-600 ml-2"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          )}

          {/* Authentication State */}
          {!user || !hasToken ? (
            <div className="bg-slate-50 dark:bg-slate-800/60 rounded-2xl p-6 text-center space-y-4 border border-slate-200 dark:border-slate-700">
              <div className="w-12 h-12 mx-auto rounded-full bg-blue-100 dark:bg-blue-900/50 flex items-center justify-center text-[#4285F4]">
                <HardDrive className="w-6 h-6" />
              </div>
              <div className="max-w-md mx-auto space-y-1">
                <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">
                  Conecta tu cuenta de Google
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                  Para guardar constancias de inducción, exportar reportes de fichas y consultar documentos institucionales en tu Google Drive, inicia sesión con los permisos correspondientes.
                </p>
              </div>

              <div className="pt-2">
                <GoogleSignInButton
                  onClick={handleLogin}
                  isLoading={isLoggingIn}
                  text="Iniciar sesión con Google para usar Drive"
                />
              </div>
            </div>
          ) : (
            <div className="space-y-5">
              {/* Connected User Bar */}
              <div className="p-3.5 bg-slate-50 dark:bg-slate-800/70 rounded-xl border border-slate-200 dark:border-slate-700 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  {user.photoURL ? (
                    <img
                      src={user.photoURL}
                      alt={user.displayName || 'Google User'}
                      className="w-9 h-9 rounded-full object-cover border border-slate-200"
                    />
                  ) : (
                    <div className="w-9 h-9 rounded-full bg-blue-100 text-blue-700 font-bold text-xs flex items-center justify-center">
                      {(user.displayName || user.email || 'G')[0].toUpperCase()}
                    </div>
                  )}
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-slate-900 dark:text-slate-100">
                        {user.displayName || 'Usuario de Google'}
                      </span>
                      <span className="text-[10px] px-2 py-0.2 bg-emerald-100 dark:bg-emerald-900/60 text-emerald-800 dark:text-emerald-300 rounded font-semibold">
                        Conectado
                      </span>
                    </div>
                    <span className="text-[11px] text-slate-500 dark:text-slate-400">{user.email}</span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handleLogout}
                  className="flex items-center gap-1.5 px-3 py-1.5 text-xs text-slate-600 dark:text-slate-300 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/40 rounded-lg transition-colors cursor-pointer"
                  title="Cerrar sesión de Google"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Desconectar</span>
                </button>
              </div>

              {/* Fast Action Buttons */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {activeFicha && (
                  <button
                    type="button"
                    onClick={handleBackupCohortToDrive}
                    disabled={isUploadingReport}
                    className="flex items-center justify-between p-3.5 bg-emerald-50 dark:bg-emerald-950/40 hover:bg-emerald-100 dark:hover:bg-emerald-900/50 border border-emerald-200 dark:border-emerald-800 rounded-xl text-left transition-colors cursor-pointer disabled:opacity-60"
                  >
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-emerald-100 dark:bg-emerald-900/60 text-[#39A900] rounded-lg">
                        <FileSpreadsheet className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="text-xs font-bold text-slate-900 dark:text-slate-100">
                          {isUploadingReport ? 'Guardando Hoja en Drive...' : 'Sincronizar Hoja de Cálculo en Drive'}
                        </div>
                        <div className="text-[11px] text-slate-500 dark:text-slate-400">
                          Ficha {activeFicha.code} ({apprentices.filter((a) => a.fichaId === activeFicha.id).length} aprendices)
                        </div>
                      </div>
                    </div>
                  </button>
                )}

                <button
                  type="button"
                  onClick={() => setShowNoteForm(!showNoteForm)}
                  className="flex items-center justify-between p-3.5 bg-blue-50 dark:bg-blue-950/40 hover:bg-blue-100 dark:hover:bg-blue-900/50 border border-blue-200 dark:border-blue-800 rounded-xl text-left transition-colors cursor-pointer"
                >
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-blue-100 dark:bg-blue-900/60 text-[#4285F4] rounded-lg">
                      <FolderPlus className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="text-xs font-bold text-slate-900 dark:text-slate-100">
                        {showNoteForm ? 'Ocultar Formulario' : 'Crear Acta / Nota en Drive'}
                      </div>
                      <div className="text-[11px] text-slate-500 dark:text-slate-400">
                        Guardar documento en la carpeta SENA
                      </div>
                    </div>
                  </div>
                </button>
              </div>

              {/* Note / Document Form */}
              {showNoteForm && (
                <form
                  onSubmit={handleCreateNote}
                  className="p-4 bg-slate-50 dark:bg-slate-800/80 rounded-xl border border-slate-200 dark:border-slate-700 space-y-3 animate-fadeIn"
                >
                  <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200">
                    Nuevo Documento en Google Drive
                  </h4>
                  <input
                    type="text"
                    required
                    placeholder="Título del documento (ej. Acta_Induccion_Grupo_A)"
                    value={newNoteTitle}
                    onChange={(e) => setNewNoteTitle(e.target.value)}
                    className="w-full px-3 py-2 text-xs bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4285F4]"
                  />
                  <textarea
                    rows={3}
                    required
                    placeholder="Contenido del acta o nota institucional..."
                    value={newNoteContent}
                    onChange={(e) => setNewNoteContent(e.target.value)}
                    className="w-full px-3 py-2 text-xs bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4285F4]"
                  />
                  <div className="flex justify-end gap-2 pt-1">
                    <button
                      type="button"
                      onClick={() => setShowNoteForm(false)}
                      className="px-3 py-1.5 text-xs text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-lg"
                    >
                      Cancelar
                    </button>
                    <button
                      type="submit"
                      disabled={isSubmittingNote}
                      className="px-4 py-1.5 text-xs font-bold text-white bg-[#4285F4] hover:bg-blue-600 rounded-lg shadow-xs disabled:opacity-60"
                    >
                      {isSubmittingNote ? 'Guardando...' : 'Guardar en Drive'}
                    </button>
                  </div>
                </form>
              )}

              {/* File Explorer Section */}
              <div className="space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <h4 className="text-xs font-bold text-slate-900 dark:text-slate-100">
                      Archivos en tu Google Drive ({files.length})
                    </h4>
                  </div>

                  <div className="flex items-center gap-2">
                    <div className="relative flex-1 sm:w-56">
                      <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
                      <input
                        type="text"
                        placeholder="Buscar archivo..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && fetchFiles()}
                        className="w-full pl-8 pr-2.5 py-1.5 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500"
                      />
                    </div>
                    <button
                      type="button"
                      onClick={fetchFiles}
                      disabled={isLoadingFiles}
                      className="p-1.5 text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                      title="Refrescar lista de archivos"
                    >
                      <RefreshCw className={`w-3.5 h-3.5 ${isLoadingFiles ? 'animate-spin' : ''}`} />
                    </button>
                  </div>
                </div>

                {isLoadingFiles ? (
                  <div className="py-8 text-center text-xs text-slate-400 flex items-center justify-center gap-2">
                    <div className="w-4 h-4 border-2 border-slate-300 border-t-[#4285F4] rounded-full animate-spin" />
                    <span>Cargando archivos de Google Drive...</span>
                  </div>
                ) : files.length === 0 ? (
                  <div className="p-6 text-center text-xs text-slate-400 bg-slate-50 dark:bg-slate-800/40 rounded-xl border border-slate-200 dark:border-slate-800">
                    No se encontraron archivos en Google Drive con el criterio actual.
                  </div>
                ) : (
                  <div className="border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden max-h-64 overflow-y-auto divide-y divide-slate-100 dark:divide-slate-800">
                    {files.map((file) => (
                      <div
                        key={file.id}
                        className="p-3 flex items-center justify-between gap-3 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors text-xs"
                      >
                        <div className="flex items-center gap-2.5 min-w-0">
                          {getFileIcon(file.mimeType)}
                          <div className="min-w-0">
                            <span className="font-medium text-slate-800 dark:text-slate-200 truncate block">
                              {file.name}
                            </span>
                            <span className="text-[10px] text-slate-400">
                              {file.modifiedTime ? new Date(file.modifiedTime).toLocaleDateString() : 'N/A'}
                            </span>
                          </div>
                        </div>

                        <div className="flex items-center gap-2 shrink-0">
                          {file.webViewLink && (
                            <a
                              href={file.webViewLink}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="p-1.5 text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-950/60 rounded-lg transition-colors"
                              title="Abrir archivo en Google Drive"
                            >
                              <ExternalLink className="w-3.5 h-3.5" />
                            </a>
                          )}

                          {/* Delete File Button - Triggers Mandatory Confirmation Dialog */}
                          <button
                            type="button"
                            onClick={() => {
                              soundFx.playCardFlip();
                              setFileToDelete(file);
                            }}
                            className="p-1.5 text-red-500 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950/50 rounded-lg transition-colors cursor-pointer"
                            title={`Eliminar "${file.name}" de Google Drive`}
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-3.5 px-5 bg-slate-50 dark:bg-slate-800/60 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
          <span>Integración con API oficial de Google Drive v3</span>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-1.5 font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-lg transition-colors cursor-pointer"
          >
            Cerrar
          </button>
        </div>
      </div>

      {/* MANDATORY USER CONFIRMATION DIALOG FOR DESTRUCTIVE DRIVE OPERATIONS */}
      {fileToDelete && (
        <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs animate-fadeIn">
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-red-200 dark:border-red-900/60 shadow-2xl max-w-md w-full p-6 space-y-4">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-red-100 dark:bg-red-950/80 text-red-600 dark:text-red-400 rounded-xl shrink-0">
                <AlertTriangle className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">
                  ¿Eliminar archivo de Google Drive?
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Esta acción eliminará el archivo de tu cuenta de Google.
                </p>
              </div>
            </div>

            <div className="p-3.5 bg-slate-50 dark:bg-slate-800/80 rounded-xl border border-slate-200 dark:border-slate-700 space-y-1.5 text-xs">
              <div className="flex justify-between">
                <span className="text-slate-500 dark:text-slate-400">Archivo:</span>
                <span className="font-bold text-slate-900 dark:text-slate-100 text-right truncate max-w-[220px]">
                  {fileToDelete.name}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500 dark:text-slate-400">Tipo:</span>
                <span className="font-mono text-slate-700 dark:text-slate-300 text-[11px] truncate max-w-[220px]">
                  {fileToDelete.mimeType}
                </span>
              </div>
            </div>

            <p className="text-[11px] text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-950/30 p-2.5 rounded-lg border border-red-200/60 dark:border-red-900/40">
              Advertencia: La eliminación es permanente en Google Drive y no se puede deshacer desde esta aplicación.
            </p>

            <div className="flex items-center justify-end gap-2.5 pt-2">
              <button
                type="button"
                disabled={isDeleting}
                onClick={() => setFileToDelete(null)}
                className="px-4 py-2 text-xs font-semibold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors cursor-pointer"
              >
                Cancelar
              </button>
              <button
                type="button"
                disabled={isDeleting}
                onClick={handleConfirmDelete}
                className="flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-white bg-red-600 hover:bg-red-700 rounded-xl shadow-xs transition-colors cursor-pointer disabled:opacity-60"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>{isDeleting ? 'Eliminando...' : 'Sí, eliminar archivo'}</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
