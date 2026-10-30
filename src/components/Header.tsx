import React from 'react';
import { UserRole } from '../types/induction';
import { Volume2, VolumeX, ShieldCheck, GraduationCap, LayoutDashboard, Award, Sun, Moon, LogOut, HardDrive } from 'lucide-react';
import { soundFx } from '../utils/audioSynth';
import { SenaLogo } from '../assets/senaLogo';

interface HeaderProps {
  currentRole: UserRole;
  onRoleChange: (role: UserRole) => void;
  activeTab: string;
  onTabChange: (tab: string) => void;
  hasCertificate: boolean;
  onOpenCertificate: () => void;
  isDarkMode: boolean;
  onToggleTheme: () => void;
  onGoToLanding?: () => void;
  onOpenGoogleDrive?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentRole,
  onRoleChange,
  activeTab,
  onTabChange,
  hasCertificate,
  onOpenCertificate,
  isDarkMode,
  onToggleTheme,
  onGoToLanding,
  onOpenGoogleDrive,
}) => {
  const [isMuted, setIsMuted] = React.useState(soundFx.getIsMuted());

  const toggleSound = () => {
    const next = !isMuted;
    setIsMuted(next);
    soundFx.setMuted(next);
  };

  return (
    <header className="no-print bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 sticky top-0 z-40 transition-colors duration-300 shadow-xs">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-3 sm:gap-4 lg:gap-6 h-16 overflow-x-auto no-scrollbar">
          {/* Zone 1: Single text element wordmark with official SENA logo */}
          <div className="flex items-center gap-2 shrink-0">
            <a
              href="#home"
              onClick={(e) => {
                e.preventDefault();
                if (onGoToLanding) onGoToLanding();
                else onTabChange('modulos');
              }}
              className="flex items-center gap-2 hover:opacity-90 transition-opacity"
              title="Ir a selección de rol / inicio"
            >
              <SenaLogo className="w-7 h-7 sm:w-8 sm:h-8 object-contain shrink-0" />
              <span className="text-xs sm:text-sm lg:text-base font-bold tracking-tight text-slate-900 dark:text-slate-100 whitespace-nowrap shrink-0 hover:text-[#39A900] dark:hover:text-[#39A900] transition-colors">
                Inducción SENA
              </span>
            </a>
          </div>

          {/* Zone 2: Clean single-line text navigation links */}
          <nav className="hidden xl:flex items-center gap-4 text-xs lg:text-sm font-medium text-slate-600 dark:text-slate-300 shrink-0">
            {currentRole === 'aprendiz' ? (
              <>
                <button
                  onClick={() => onTabChange('modulos')}
                  className={`hover:text-[#39A900] transition-colors whitespace-nowrap shrink-0 py-1 ${
                    activeTab === 'modulos' ? 'text-[#39A900] font-semibold border-b-2 border-[#39A900]' : ''
                  }`}
                >
                  Ruta de Inducción
                </button>
                <button
                  onClick={() => onTabChange('reglamento')}
                  className={`hover:text-[#39A900] transition-colors whitespace-nowrap shrink-0 py-1 ${
                    activeTab === 'reglamento' ? 'text-[#39A900] font-semibold border-b-2 border-[#39A900]' : ''
                  }`}
                >
                  Reglamento & Derechos
                </button>
                <button
                  onClick={() => onTabChange('himno')}
                  className={`hover:text-[#39A900] transition-colors whitespace-nowrap shrink-0 py-1 ${
                    activeTab === 'himno' ? 'text-[#39A900] font-semibold border-b-2 border-[#39A900]' : ''
                  }`}
                >
                  Himno y Símbolos
                </button>
                <button
                  onClick={() => onTabChange('evaluacion')}
                  className={`hover:text-[#39A900] transition-colors whitespace-nowrap shrink-0 py-1 ${
                    activeTab === 'evaluacion' ? 'text-[#39A900] font-semibold border-b-2 border-[#39A900]' : ''
                  }`}
                >
                  Evaluación
                </button>
                {hasCertificate && (
                  <button
                    onClick={onOpenCertificate}
                    className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400 hover:text-emerald-700 dark:hover:text-emerald-300 transition-colors whitespace-nowrap shrink-0 font-semibold"
                  >
                    <Award className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                    <span>Certificado</span>
                  </button>
                )}
              </>
            ) : (
              <>
                <button
                  onClick={() => onTabChange('instructor_cohort')}
                  className={`hover:text-[#39A900] transition-colors whitespace-nowrap shrink-0 py-1 ${
                    activeTab === 'instructor_cohort' ? 'text-[#39A900] font-semibold border-b-2 border-[#39A900]' : ''
                  }`}
                >
                  Cohortes
                </button>
                <button
                  onClick={() => onTabChange('instructor_questions')}
                  className={`hover:text-[#39A900] transition-colors whitespace-nowrap shrink-0 py-1 ${
                    activeTab === 'instructor_questions' ? 'text-[#39A900] font-semibold border-b-2 border-[#39A900]' : ''
                  }`}
                >
                  Preguntas
                </button>
                <button
                  onClick={() => onTabChange('evaluacion')}
                  className="hover:text-[#39A900] transition-colors whitespace-nowrap shrink-0 py-1"
                >
                  Examen
                </button>
              </>
            )}
          </nav>

          {/* Zone 3: Audio, Theme toggle, Google Drive, and Role switch */}
          <div className="flex items-center gap-2.5 shrink-0">
            {/* Google Drive Workspace Button */}
            {onOpenGoogleDrive && (
              <button
                type="button"
                onClick={onOpenGoogleDrive}
                title="Google Drive: respaldar y gestionar archivos"
                className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border border-blue-200 dark:border-blue-900/60 bg-blue-50/80 dark:bg-blue-950/40 text-blue-700 dark:text-blue-300 hover:bg-blue-100 dark:hover:bg-blue-900/60 text-xs font-semibold transition-all cursor-pointer shadow-xs active:scale-95"
                aria-label="Abrir Google Drive"
              >
                <HardDrive className="w-3.5 h-3.5 text-[#4285F4]" />
                <span className="hidden md:inline">Google Drive</span>
              </button>
            )}

            {/* Dark / Light Mode Toggle Button with Blur Transition */}
            <button
              onClick={onToggleTheme}
              title={isDarkMode ? 'Cambiar a modo claro (Transición Blur)' : 'Cambiar a modo oscuro (Transición Blur)'}
              className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border text-xs font-medium transition-all cursor-pointer shadow-xs active:scale-95 ${
                isDarkMode
                  ? 'bg-slate-800 text-amber-300 border-slate-700 hover:bg-slate-750 hover:text-amber-200 hover:border-amber-500/40'
                  : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100 hover:text-slate-900'
              }`}
              aria-label="Alternar modo claro u oscuro"
            >
              {isDarkMode ? (
                <>
                  <Sun className="w-4 h-4 text-amber-400 animate-spin-slow transition-transform" />
                  <span className="hidden sm:inline">Modo Claro</span>
                </>
              ) : (
                <>
                  <Moon className="w-4 h-4 text-slate-600 transition-transform" />
                  <span className="hidden sm:inline">Modo Oscuro</span>
                </>
              )}
            </button>

            {/* Audio Toggle */}
            <button
              onClick={toggleSound}
              title={isMuted ? 'Activar sonido educativo' : 'Silenciar sonido'}
              className="p-2 text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 transition-colors cursor-pointer"
              aria-label="Alternar sonido"
            >
              {isMuted ? <VolumeX className="w-4 h-4 text-slate-400" /> : <Volume2 className="w-4 h-4 text-[#39A900]" />}
            </button>

            {/* Role-isolated View Controls */}
            {currentRole === 'aprendiz' ? (
              <div className="flex items-center gap-2">
                <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300 rounded-lg">
                  <GraduationCap className="w-3.5 h-3.5 text-[#39A900]" />
                  <span>Portal Aprendiz</span>
                </div>
                {onGoToLanding && (
                  <button
                    onClick={onGoToLanding}
                    className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-750 transition-colors cursor-pointer"
                    title="Cerrar sesión de aprendiz y volver a inicio"
                  >
                    <LogOut className="w-3.5 h-3.5 text-slate-500" />
                    <span className="hidden sm:inline">Cerrar Sesión</span>
                  </button>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 rounded-lg">
                  <LayoutDashboard className="w-3.5 h-3.5 text-slate-600 dark:text-slate-400" />
                  <span>Panel Instructor</span>
                </div>
                {onGoToLanding && (
                  <button
                    onClick={onGoToLanding}
                    className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-750 transition-colors cursor-pointer"
                    title="Salir del panel de instructor y volver a inicio"
                  >
                    <LogOut className="w-3.5 h-3.5 text-slate-500" />
                    <span className="hidden sm:inline">Salir</span>
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
