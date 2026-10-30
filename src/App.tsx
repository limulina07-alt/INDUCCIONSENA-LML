import React, { useState, useEffect } from 'react';
import { UserRole, Apprentice, Ficha, InductionModule, QuizQuestion } from './types/induction';
import {
  getStoredApprentices,
  saveStoredApprentices,
  getStoredFichas,
  saveStoredFichas,
  getActiveApprenticeId,
  setActiveApprenticeId,
  getStoredQuestions,
  saveStoredQuestions,
  resetToDemoData,
} from './utils/storage';
import { Header } from './components/Header';
import { RoleSelectionLanding } from './components/Landing/RoleSelectionLanding';
import { InductionHome } from './components/ApprenticePortal/InductionHome';
import { ModuleViewer } from './components/ApprenticePortal/ModuleViewer';
import { RegulationExplorer } from './components/ApprenticePortal/RegulationExplorer';
import { HymnPlayer } from './components/ApprenticePortal/HymnPlayer';
import { InteractiveQuiz } from './components/ApprenticePortal/InteractiveQuiz';
import { CertificateModal } from './components/ApprenticePortal/CertificateModal';
import { CommitmentActModal } from './components/ApprenticePortal/CommitmentActModal';
import { CohortOverview } from './components/InstructorDashboard/CohortOverview';
import { ApprenticeTable } from './components/InstructorDashboard/ApprenticeTable';
import { ApprenticeDetailModal } from './components/InstructorDashboard/ApprenticeDetailModal';
import { AddApprenticeModal } from './components/InstructorDashboard/AddApprenticeModal';
import { QuestionBankManager } from './components/InstructorDashboard/QuestionBankManager';
import { GoogleSyncCard } from './components/InstructorDashboard/GoogleSyncCard';
import { GoogleDriveModal } from './components/GoogleDrive/GoogleDriveModal';
import { SenaLogo } from './assets/senaLogo';
import { soundFx } from './utils/audioSynth';
import { User } from 'firebase/auth';
import { auth, googleSignIn, logout, getAccessToken, initAuth } from './utils/googleAuth';
import { findOrCreateInductionSheet, syncAllApprenticesToSheet, syncSingleApprenticeToSheet } from './services/googleSheetsService';
import { saveCohortSpreadsheetToDrive } from './services/googleDrive';

export default function App() {
  const [currentRole, setCurrentRole] = useState<UserRole>('aprendiz');
  const [activeTab, setActiveTab] = useState<string>('modulos');
  const [showLanding, setShowLanding] = useState<boolean>(true);

  // Core Data State
  const [fichas, setFichas] = useState<Ficha[]>([]);
  const [activeFichaId, setActiveFichaId] = useState<string>('f-2824910');
  const [apprentices, setApprentices] = useState<Apprentice[]>([]);
  const [activeApprenticeId, setActiveApprenticeState] = useState<string>('app-01');
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);

  // Modals & Navigation State
  const [selectedModule, setSelectedModule] = useState<InductionModule | null>(null);
  const [isCertificateOpen, setIsCertificateOpen] = useState(false);
  const [isCommitmentOpen, setIsCommitmentOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [detailApprentice, setDetailApprentice] = useState<Apprentice | null>(null);
  const [certificateTargetApprentice, setCertificateTargetApprentice] = useState<Apprentice | null>(null);
  const [isDriveModalOpen, setIsDriveModalOpen] = useState(false);

  // Google Drive & Sheets Synchronization State
  const [googleUser, setGoogleUser] = useState<User | null>(auth.currentUser);
  const [googleToken, setGoogleToken] = useState<string | null>(null);
  const [spreadsheetId, setSpreadsheetId] = useState<string | null>(() => localStorage.getItem('sena_drive_sheet_id'));
  const [spreadsheetUrl, setSpreadsheetUrl] = useState<string | null>(() => localStorage.getItem('sena_drive_sheet_url'));
  const [lastSyncTime, setLastSyncTime] = useState<string | null>(() => localStorage.getItem('sena_drive_last_sync'));
  const [isConnectingGoogle, setIsConnectingGoogle] = useState(false);
  const [isSyncingGoogle, setIsSyncingGoogle] = useState(false);
  const [syncError, setSyncError] = useState<string | null>(null);

  // Sync Google Auth listener
  useEffect(() => {
    const unsubscribe = initAuth(
      (u, token) => {
        setGoogleUser(u);
        setGoogleToken(token);
      },
      () => {
        setGoogleUser(null);
        setGoogleToken(null);
      }
    );

    getAccessToken().then((token) => {
      if (token && auth.currentUser) {
        setGoogleUser(auth.currentUser);
        setGoogleToken(token);
      }
    });

    return () => unsubscribe();
  }, []);

  const handleConnectGoogle = async () => {
    setIsConnectingGoogle(true);
    setSyncError(null);
    try {
      const res = await googleSignIn();
      if (res) {
        setGoogleUser(res.user);
        setGoogleToken(res.accessToken);
        soundFx.playSuccessChime();
      }
    } catch (err: any) {
      console.error('Google connect error:', err);
      soundFx.playErrorChime();
      setSyncError(err.message || 'Error al conectar con Google.');
    } finally {
      setIsConnectingGoogle(false);
    }
  };

  const handleDisconnectGoogle = async () => {
    try {
      await logout();
      setGoogleUser(null);
      setGoogleToken(null);
      soundFx.playCardFlip();
    } catch (err: any) {
      console.error('Google logout error:', err);
    }
  };

  const handleSyncAllToGoogleDrive = async () => {
    let token = googleToken || (await getAccessToken());
    if (!token) {
      try {
        setIsConnectingGoogle(true);
        const res = await googleSignIn();
        if (res) {
          setGoogleUser(res.user);
          setGoogleToken(res.accessToken);
          token = res.accessToken;
        }
      } catch (err: any) {
        setSyncError(err.message || 'Por favor conecta tu cuenta de Google.');
        return;
      } finally {
        setIsConnectingGoogle(false);
      }
    }

    if (!token) return;

    setIsSyncingGoogle(true);
    setSyncError(null);
    try {
      // 1. Find or create official 3-sheet workbook in Google Drive
      const sheet = await findOrCreateInductionSheet(token);
      setSpreadsheetId(sheet.id);
      setSpreadsheetUrl(sheet.url);
      localStorage.setItem('sena_drive_sheet_id', sheet.id);
      localStorage.setItem('sena_drive_sheet_url', sheet.url);

      // 2. Synchronize all apprentices and fichas into Google Sheets
      const syncRes = await syncAllApprenticesToSheet(token, sheet.id, apprentices, fichas);

      // 3. Save / update the dedicated cohort spreadsheet directly in Google Drive SENA folder
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
      const csvContent = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
      await saveCohortSpreadsheetToDrive(activeFicha.code, activeFicha.programName, csvContent);

      setLastSyncTime(syncRes.timestamp);
      localStorage.setItem('sena_drive_last_sync', syncRes.timestamp);
      soundFx.playSuccessChime();
    } catch (err: any) {
      console.error('Error al sincronizar con Google Drive:', err);
      soundFx.playErrorChime();
      setSyncError(err.message || 'Error al guardar la hoja de cálculo en Google Drive.');
    } finally {
      setIsSyncingGoogle(false);
    }
  };

  // Theme & Blur Transition State
  const [isDarkMode, setIsDarkMode] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('sena_dark_mode');
      if (saved !== null) {
        return saved === 'true';
      }
      return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    }
    return false;
  });
  const [isBlurTransitioning, setIsBlurTransitioning] = useState<boolean>(false);

  // Sync theme with html document element on mount and change
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('sena_dark_mode', String(isDarkMode));
  }, [isDarkMode]);

  const handleToggleTheme = () => {
    soundFx.playThemeToggleSound();
    setIsBlurTransitioning(true);
    // Switch dark mode state
    setIsDarkMode((prev) => !prev);
    // Clear blur transition class after animation duration
    setTimeout(() => {
      setIsBlurTransitioning(false);
    }, 450);
  };

  // Initialize from storage
  useEffect(() => {
    const loadedFichas = getStoredFichas();
    const loadedApprentices = getStoredApprentices();
    const loadedQuestions = getStoredQuestions();
    const loadedActiveAppId = getActiveApprenticeId();

    setFichas(loadedFichas);
    setApprentices(loadedApprentices);
    setQuestions(loadedQuestions);
    setActiveApprenticeState(loadedActiveAppId);

    if (loadedFichas.length > 0) {
      setActiveFichaId(loadedFichas[0].id);
    }
  }, []);

  const activeApprentice =
    apprentices.find((a) => a.id === activeApprenticeId) ||
    apprentices[0] || {
      id: 'app-01',
      name: 'Valentina Rodríguez Sierra',
      documentType: 'CC',
      documentNumber: '1023948512',
      email: 'vrodriguez@soy.sena.edu.co',
      phone: '312 458 9012',
      fichaId: 'f-2824910',
      progressPercent: 100,
      completedModules: [],
      evaluationScore: 92,
      evaluationPassed: true,
      evaluationAttempts: 1,
      commitmentSigned: true,
      status: 'completado',
    };

  const activeFicha =
    fichas.find((f) => f.id === (currentRole === 'aprendiz' ? activeApprentice.fichaId : activeFichaId)) ||
    fichas[0] || {
      id: 'f-2824910',
      code: '2824910',
      programName: 'Análisis y Desarrollo de Software (ADSO)',
      level: 'Tecnólogo',
      centerName: 'Centro de Formación Técnica y Tecnológica',
      regional: 'Regional Distrito Capital',
      instructorLeader: 'Ing. Carlos Alberto Morales',
      startDate: '2026-02-15',
      totalApprentices: 28,
    };

  const cohortApprentices = apprentices.filter((a) => a.fichaId === activeFicha.id);

  const handleUpdateApprentice = (updated: Apprentice) => {
    const nextList = apprentices.map((a) => (a.id === updated.id ? updated : a));
    setApprentices(nextList);
    saveStoredApprentices(nextList);

    // If connected with Google Drive, sync updated apprentice directly
    if (googleToken && spreadsheetId) {
      syncSingleApprenticeToSheet(googleToken, spreadsheetId, updated, activeFicha)
        .catch((e) => console.warn('Background sync error:', e));
    }
  };

  const handleSelectApprentice = (appId: string) => {
    setActiveApprenticeState(appId);
    setActiveApprenticeId(appId);
  };

  const handleSignCommitment = (signatureName: string) => {
    const today = new Date().toISOString().split('T')[0];
    const updated: Apprentice = {
      ...activeApprentice,
      commitmentSigned: true,
      commitmentDate: today,
    };
    handleUpdateApprentice(updated);
  };

  const handleAddApprentice = (newApp: Apprentice) => {
    const nextList = [newApp, ...apprentices];
    setApprentices(nextList);
    saveStoredApprentices(nextList);

    // If connected with Google Drive, sync new apprentice directly
    if (googleToken && spreadsheetId) {
      syncSingleApprenticeToSheet(googleToken, spreadsheetId, newApp, activeFicha)
        .catch((e) => console.warn('Background sync error on add:', e));
    }
  };

  const handleDeleteApprentice = (appId: string) => {
    const nextList = apprentices.filter((a) => a.id !== appId);
    setApprentices(nextList);
    saveStoredApprentices(nextList);
    if (activeApprenticeId === appId) {
      const nextActive = nextList[0]?.id || 'app-01';
      setActiveApprenticeState(nextActive);
      setActiveApprenticeId(nextActive);
    }
  };

  const handleUpdateQuestions = (newQuestions: QuizQuestion[]) => {
    setQuestions(newQuestions);
    saveStoredQuestions(newQuestions);
  };

  const handleResetDemoData = () => {
    if (confirm('¿Deseas restablecer los aprendices y evaluaciones a los datos iniciales de demostración?')) {
      resetToDemoData();
      setFichas(getStoredFichas());
      setApprentices(getStoredApprentices());
      setQuestions(getStoredQuestions());
      setActiveApprenticeState(getActiveApprenticeId());
    }
  };

  const handleExportCSV = () => {
    const headers = [
      'ID',
      'Nombre Completo',
      'Tipo Doc',
      'Numero Doc',
      'Correo',
      'Ficha',
      'Programa',
      'Avance %',
      'Calificacion Evaluacion',
      'Aprobado',
      'Intentos',
      'Acta Firmada',
      'Codigo Certificado',
      'Estado',
    ];

    const rows = cohortApprentices.map((a) => [
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

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `reporte_induccion_sena_ficha_${activeFicha.code}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const openApprenticeCertificate = (app: Apprentice) => {
    setCertificateTargetApprentice(app);
    setIsCertificateOpen(true);
  };

  if (showLanding) {
    return (
      <div className={`min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col font-sans transition-colors duration-300 ${isBlurTransitioning ? 'theme-blur-active' : ''}`}>
        <RoleSelectionLanding
          fichas={fichas}
          apprentices={apprentices}
          onDeleteApprentice={handleDeleteApprentice}
          onSelectRoleAndStart={(role, newApp) => {
            if (role === 'aprendiz' && newApp) {
              const nextList = [newApp, ...apprentices];
              setApprentices(nextList);
              saveStoredApprentices(nextList);
              handleSelectApprentice(newApp.id);
            }
            setCurrentRole(role);
            setShowLanding(false);
            if (role === 'instructor') {
              setActiveTab('instructor_cohort');
            } else {
              setActiveTab('modulos');
            }
          }}
        />
      </div>
    );
  }

  return (
    <div className={`min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col font-sans transition-colors duration-300 ${isBlurTransitioning ? 'theme-blur-active' : ''}`}>
      {/* Institutional Top Bar adhering to Top Bar Contract */}
      <Header
        currentRole={currentRole}
        onRoleChange={(role) => {
          setCurrentRole(role);
          if (role === 'instructor') setActiveTab('instructor_cohort');
          else setActiveTab('modulos');
        }}
        activeTab={activeTab}
        onTabChange={(tab) => {
          setActiveTab(tab);
          setSelectedModule(null);
        }}
        hasCertificate={activeApprentice.evaluationPassed === true}
        onOpenCertificate={() => openApprenticeCertificate(activeApprentice)}
        isDarkMode={isDarkMode}
        onToggleTheme={handleToggleTheme}
        onGoToLanding={() => setShowLanding(true)}
        onOpenGoogleDrive={() => setIsDriveModalOpen(true)}
      />

      {/* Main Viewport Workspace */}
      <main className="flex-1 pb-16">
        {currentRole === 'aprendiz' ? (
          /* Apprentice Workspace Views */
          selectedModule ? (
            <ModuleViewer
              module={selectedModule}
              apprentice={activeApprentice}
              onUpdateApprentice={handleUpdateApprentice}
              onBack={() => setSelectedModule(null)}
              onNavigateToQuiz={() => {
                setSelectedModule(null);
                setActiveTab('evaluacion');
              }}
            />
          ) : activeTab === 'modulos' ? (
            <InductionHome
              apprentice={activeApprentice}
              allApprentices={apprentices}
              ficha={activeFicha}
              onSelectApprentice={handleSelectApprentice}
              onSelectModule={(mod) => setSelectedModule(mod)}
              onNavigateToQuiz={() => setActiveTab('evaluacion')}
              onNavigateToReglamento={() => setActiveTab('reglamento')}
              onNavigateToHimno={() => setActiveTab('himno')}
              onOpenCertificate={() => openApprenticeCertificate(activeApprentice)}
              onOpenCommitment={() => setIsCommitmentOpen(true)}
            />
          ) : activeTab === 'reglamento' ? (
            <RegulationExplorer />
          ) : activeTab === 'himno' ? (
            <HymnPlayer />
          ) : activeTab === 'evaluacion' ? (
            <InteractiveQuiz
              questions={questions}
              apprentice={activeApprentice}
              onUpdateApprentice={handleUpdateApprentice}
              onOpenCertificate={() => openApprenticeCertificate(activeApprentice)}
              onOpenCommitment={() => setIsCommitmentOpen(true)}
            />
          ) : null
        ) : (
          /* Instructor / Management Workspace Views */
          <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8 space-y-8">
            {activeTab === 'instructor_cohort' ? (
              <>
                <CohortOverview
                  fichas={fichas}
                  activeFicha={activeFicha}
                  onSelectFicha={setActiveFichaId}
                  cohortApprentices={cohortApprentices}
                  onOpenAddModal={() => setIsAddModalOpen(true)}
                  onExportCSV={handleExportCSV}
                  onResetDemo={handleResetDemoData}
                  onOpenGoogleDrive={() => setIsDriveModalOpen(true)}
                />
                <GoogleSyncCard
                  currentUser={googleUser}
                  accessToken={googleToken}
                  spreadsheetId={spreadsheetId}
                  spreadsheetUrl={spreadsheetUrl}
                  isConnecting={isConnectingGoogle}
                  isSyncing={isSyncingGoogle}
                  lastSyncTime={lastSyncTime}
                  errorMsg={syncError}
                  totalApprentices={cohortApprentices.length}
                  onConnectGoogle={handleConnectGoogle}
                  onDisconnectGoogle={handleDisconnectGoogle}
                  onSyncAll={handleSyncAllToGoogleDrive}
                />
                <ApprenticeTable
                  apprentices={apprentices}
                  activeFicha={activeFicha}
                  onUpdateApprentice={handleUpdateApprentice}
                  onViewCertificate={openApprenticeCertificate}
                  onViewDetails={(app) => setDetailApprentice(app)}
                  onDeleteApprentice={handleDeleteApprentice}
                />
              </>
            ) : activeTab === 'instructor_questions' ? (
              <QuestionBankManager
                questions={questions}
                onUpdateQuestions={handleUpdateQuestions}
                onBack={() => setActiveTab('instructor_cohort')}
              />
            ) : activeTab === 'evaluacion' ? (
              <div>
                <div className="max-w-3xl mx-auto mb-4 bg-emerald-50 border border-emerald-200 text-emerald-900 rounded-xl p-4 text-xs flex items-center justify-between">
                  <span>
                    <strong>Modo Previsualización:</strong> Estás probando la evaluación exactamente como la experimentan los aprendices de la Ficha {activeFicha.code}.
                  </span>
                  <button
                    onClick={() => setActiveTab('instructor_cohort')}
                    className="font-bold underline cursor-pointer"
                  >
                    Volver al Panel
                  </button>
                </div>
                <InteractiveQuiz
                  questions={questions}
                  apprentice={activeApprentice}
                  onUpdateApprentice={handleUpdateApprentice}
                  onOpenCertificate={() => openApprenticeCertificate(activeApprentice)}
                  onOpenCommitment={() => setIsCommitmentOpen(true)}
                />
              </div>
            ) : null}
          </div>
        )}
      </main>

      {/* Official SENA Certificate Modal */}
      <CertificateModal
        apprentice={certificateTargetApprentice || activeApprentice}
        ficha={activeFicha}
        isOpen={isCertificateOpen}
        onClose={() => setIsCertificateOpen(false)}
      />

      {/* Official SENA Commitment Act Modal */}
      <CommitmentActModal
        apprentice={activeApprentice}
        ficha={activeFicha}
        isOpen={isCommitmentOpen}
        onClose={() => setIsCommitmentOpen(false)}
        onSignCommitment={handleSignCommitment}
      />

      {/* Add Apprentice Modal */}
      <AddApprenticeModal
        activeFicha={activeFicha}
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onAddApprentice={handleAddApprentice}
      />

      {/* Apprentice Diagnostics Detail Modal */}
      <ApprenticeDetailModal
        apprentice={detailApprentice}
        ficha={activeFicha}
        isOpen={detailApprentice !== null}
        onClose={() => setDetailApprentice(null)}
        onOpenCertificate={openApprenticeCertificate}
      />

      {/* Google Drive Workspace Modal */}
      <GoogleDriveModal
        isOpen={isDriveModalOpen}
        onClose={() => setIsDriveModalOpen(false)}
        activeFicha={activeFicha}
        apprentices={cohortApprentices}
      />

      {/* Institutional Quiet Footer with Official SENA Logo */}
      <footer className="no-print border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 py-6 mt-auto transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500 dark:text-slate-400">
          <div className="flex items-center gap-2.5">
            <SenaLogo className="w-5 h-5" />
            <span className="font-bold text-slate-700 dark:text-slate-200">Servicio Nacional de Aprendizaje - SENA</span>
            <span aria-hidden="true">·</span>
            <span>Ministerio del Trabajo de Colombia</span>
          </div>
          <div>
            <span>Sistema Integrado de Gestión y Formación Profesional Integral (FPI) · 2026</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
