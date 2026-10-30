import React, { useState, useEffect } from 'react';
import { UserRole, Ficha, Apprentice } from '../../types/induction';
import {
  GraduationCap,
  LayoutDashboard,
  UserCheck,
  Award,
  BookOpen,
  ShieldCheck,
  ArrowRight,
  CheckCircle2,
  Trash2,
  AlertTriangle,
  Search,
  Filter,
  UserMinus,
  X,
  Play,
  Video,
  ExternalLink,
} from 'lucide-react';
import { SenaLogo } from '../../assets/senaLogo';
import { soundFx } from '../../utils/audioSynth';

interface RoleSelectionLandingProps {
  fichas: Ficha[];
  apprentices: Apprentice[];
  onSelectRoleAndStart: (role: UserRole, apprentice?: Apprentice) => void;
  onDeleteApprentice: (apprenticeId: string) => void;
}

export const RoleSelectionLanding: React.FC<RoleSelectionLandingProps> = ({
  fichas,
  apprentices,
  onSelectRoleAndStart,
  onDeleteApprentice,
}) => {
  const [selectedRoleType, setSelectedRoleType] = useState<'none' | 'aprendiz' | 'instructor_eliminar'>('none');
  const [isVideoModalOpen, setIsVideoModalOpen] = useState(false);

  // Close video modal on Escape key press
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isVideoModalOpen) {
        setIsVideoModalOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isVideoModalOpen]);

  // Characterization Form State for Apprentice
  const [name, setName] = useState('');
  const [documentType, setDocumentType] = useState<'CC' | 'TI' | 'CE' | 'PEP'>('CC');
  const [documentNumber, setDocumentNumber] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [fichaId, setFichaId] = useState(fichas[0]?.id || 'f-2824910');
  const [employmentStatus, setEmploymentStatus] = useState<string>('Desempleado buscando empleo');
  const [expectations, setExpectations] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  // Delete & Filter State for Instructor on Landing Page
  const [searchQuery, setSearchQuery] = useState('');
  const [filterFichaId, setFilterFichaId] = useState<string>('all');
  const [apprenticeToDelete, setApprenticeToDelete] = useState<Apprentice | null>(null);
  const [deleteSuccessMsg, setDeleteSuccessMsg] = useState<string>('');

  const handleApprenticeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !documentNumber.trim() || !email.trim()) {
      setErrorMsg('Por favor completa los campos obligatorios (Nombre, Documento y Correo).');
      soundFx.playErrorChime();
      return;
    }
    soundFx.playSuccessChime();

    const newApprentice: Apprentice = {
      id: `app-${Date.now().toString().slice(-4)}`,
      name: name.trim(),
      documentType,
      documentNumber: documentNumber.trim(),
      email: email.trim(),
      phone: phone.trim() || '300 000 0000',
      fichaId,
      progressPercent: 0,
      completedModules: [],
      evaluationAttempts: 0,
      commitmentSigned: false,
      status: 'no_iniciado',
    };

    onSelectRoleAndStart('aprendiz', newApprentice);
  };

  const handleConfirmDelete = () => {
    if (!apprenticeToDelete) return;
    const deletedName = apprenticeToDelete.name;
    const deletedDoc = apprenticeToDelete.documentNumber;
    onDeleteApprentice(apprenticeToDelete.id);
    soundFx.playDeleteSound();
    setApprenticeToDelete(null);
    setDeleteSuccessMsg(`El aprendiz "${deletedName}" (Doc: ${deletedDoc}) fue eliminado exitosamente del listado.`);
    setTimeout(() => {
      setDeleteSuccessMsg('');
    }, 4500);
  };

  // Filter apprentices for the deletion view
  const filteredApprentices = apprentices.filter((app) => {
    const matchesFicha = filterFichaId === 'all' || app.fichaId === filterFichaId;
    const q = searchQuery.toLowerCase().trim();
    const matchesSearch =
      !q ||
      app.name.toLowerCase().includes(q) ||
      app.documentNumber.includes(q) ||
      app.email.toLowerCase().includes(q);
    return matchesFicha && matchesSearch;
  });

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-gradient-to-b from-slate-50 via-white to-emerald-50/30 dark:from-slate-950 dark:via-slate-900 dark:to-emerald-950/20 py-12 px-4 sm:px-6 lg:px-8 flex flex-col justify-center items-center">
      <div className="max-w-4xl w-full mx-auto space-y-8">
        {/* Header Branding */}
        <div className="text-center space-y-3">
          <div className="inline-flex items-center justify-center p-3 bg-emerald-50 dark:bg-emerald-950/50 rounded-2xl border border-emerald-200 dark:border-emerald-800 shadow-xs mb-2">
            <SenaLogo className="w-16 h-16 object-contain" />
          </div>
          <div className="inline-block px-3 py-1 rounded-full bg-emerald-100 dark:bg-emerald-900/50 text-emerald-800 dark:text-emerald-300 text-xs font-semibold uppercase tracking-wider mb-1">
            Inducción FPI · Acuerdo 009 de 2024
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight">
            Portal Institucional de Inducción SENA
          </h1>
          <p className="text-base text-slate-600 dark:text-slate-300 max-w-2xl mx-auto">
            Conoce tu institución, tus derechos y deberes bajo el nuevo reglamento, evalúa tus conocimientos y obtén tu certificación oficial.
          </p>

          {/* Video Tutorial Button */}
          <div className="pt-2 flex justify-center items-center">
            <button
              type="button"
              onClick={() => {
                soundFx.playCardFlip();
                setIsVideoModalOpen(true);
              }}
              className="inline-flex items-center gap-2.5 px-5 py-2.5 rounded-xl font-bold text-sm text-emerald-800 dark:text-emerald-200 bg-white dark:bg-slate-900 border-2 border-emerald-500/40 hover:border-emerald-600 hover:bg-emerald-50/80 dark:hover:bg-emerald-950/40 shadow-xs hover:shadow-md transition-all duration-200 cursor-pointer group"
            >
              <span className="w-7 h-7 rounded-lg bg-[#39A900] text-white flex items-center justify-center group-hover:scale-110 transition-transform shadow-xs">
                <Play className="w-3.5 h-3.5 fill-current ml-0.5" />
              </span>
              <span>Video Tutorial</span>
            </button>
          </div>
        </div>

        {/* Role Cards when no role selected */}
        {selectedRoleType === 'none' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
            {/* Role Card: Aprendiz */}
            <div
              onClick={() => {
                soundFx.playCardFlip();
                setSelectedRoleType('aprendiz');
              }}
              className="group relative bg-white dark:bg-slate-900 rounded-2xl border-2 border-slate-200 dark:border-slate-800 hover:border-[#39A900] dark:hover:border-[#39A900] p-8 shadow-sm hover:shadow-xl transition-all duration-300 cursor-pointer flex flex-col justify-between"
            >
              <div className="space-y-4">
                <div className="w-12 h-12 rounded-xl bg-emerald-100 dark:bg-emerald-950 flex items-center justify-center text-[#39A900] group-hover:scale-110 transition-transform">
                  <GraduationCap className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 dark:text-slate-100 group-hover:text-[#39A900] transition-colors">
                  Soy Aprendiz SENA
                </h3>
                <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                  Regístrate con tus datos de caracterización, recorre los módulos de identidad y reglamento (Acuerdo 009 de 2024), presenta la evaluación interactiva y descarga tu certificado.
                </p>
              </div>

              <div className="mt-8 pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-sm font-semibold text-[#39A900]">
                <span>Ingresar como Aprendiz</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>

            {/* Role Card: Instructor with Delete Button */}
            <div className="group relative bg-white dark:bg-slate-900 rounded-2xl border-2 border-slate-200 dark:border-slate-800 hover:border-slate-400 dark:hover:border-slate-700 p-8 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between">
              <div className="space-y-4">
                <div className="w-12 h-12 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-700 dark:text-slate-300 group-hover:scale-110 transition-transform">
                  <LayoutDashboard className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 dark:text-slate-100 group-hover:text-slate-800 dark:group-hover:text-slate-200 transition-colors">
                  Soy Instructor / Administrador
                </h3>
                <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                  Supervisa avances, revisa caracterizaciones de aprendices matriculados, exporta reportes y administra o depura aprendices del listado oficial.
                </p>
              </div>

              <div className="mt-8 pt-4 border-t border-slate-100 dark:border-slate-800 space-y-2.5">
                {/* Primary Button: Go to Dashboard */}
                <button
                  type="button"
                  onClick={() => {
                    soundFx.playCardFlip();
                    onSelectRoleAndStart('instructor');
                  }}
                  className="w-full flex items-center justify-between px-4 py-2.5 text-xs font-bold text-slate-800 dark:text-slate-100 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-xl transition-all cursor-pointer"
                >
                  <span>Ingresar al Panel de Instructor</span>
                  <ArrowRight className="w-4 h-4" />
                </button>

                {/* Direct Action Button: Delete Apprentices from list */}
                <button
                  type="button"
                  onClick={() => {
                    soundFx.playCardFlip();
                    setSelectedRoleType('instructor_eliminar');
                  }}
                  className="w-full flex items-center justify-between px-4 py-2.5 text-xs font-bold text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-950/40 hover:bg-red-100 dark:hover:bg-red-900/50 border border-red-200 dark:border-red-800/60 rounded-xl transition-all cursor-pointer group/btn"
                >
                  <span className="flex items-center gap-2">
                    <Trash2 className="w-4 h-4 text-red-500 group-hover/btn:scale-110 transition-transform" />
                    <span>Eliminar Aprendices del Listado</span>
                  </span>
                  <span className="text-[11px] font-semibold bg-red-100 dark:bg-red-900/60 text-red-700 dark:text-red-300 px-2 py-0.5 rounded-full">
                    {apprentices.length} aprendices
                  </span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Apprentice Deletion View for Instructor on Landing Page */}
        {selectedRoleType === 'instructor_eliminar' && (
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 sm:p-8 shadow-lg transition-all animate-fadeIn space-y-6">
            {/* Top Bar with Navigation */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-red-100 dark:bg-red-950/60 text-red-600 dark:text-red-400 rounded-xl">
                  <UserMinus className="w-6 h-6" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100">
                      Eliminar Aprendices del Listado
                    </h2>
                    <span className="text-xs px-2.5 py-0.5 font-bold bg-red-100 dark:bg-red-900/50 text-red-700 dark:text-red-300 rounded-full">
                      Rol Instructor
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Selecciona y elimina aprendices registrados en las fichas del centro formativo.
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setSelectedRoleType('none')}
                  className="px-3.5 py-2 text-xs font-semibold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors cursor-pointer"
                >
                  ← Volver a roles
                </button>
                <button
                  type="button"
                  onClick={() => {
                    soundFx.playCardFlip();
                    onSelectRoleAndStart('instructor');
                  }}
                  className="px-3.5 py-2 text-xs font-bold text-white bg-slate-800 hover:bg-slate-900 dark:bg-slate-700 dark:hover:bg-slate-600 rounded-xl transition-colors cursor-pointer flex items-center gap-1.5"
                >
                  <span>Ir al Panel</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Notification Banner when apprentice deleted */}
            {deleteSuccessMsg && (
              <div className="p-3.5 bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300 text-xs rounded-xl flex items-center justify-between animate-fadeIn">
                <div className="flex items-center gap-2 font-medium">
                  <CheckCircle2 className="w-4 h-4 text-[#39A900] shrink-0" />
                  <span>{deleteSuccessMsg}</span>
                </div>
                <button
                  type="button"
                  onClick={() => setDeleteSuccessMsg('')}
                  className="text-emerald-600 hover:text-emerald-800 dark:hover:text-emerald-200 cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            )}

            {/* Search and Ficha Filters */}
            <div className="flex flex-col sm:flex-row items-center gap-3">
              <div className="relative flex-1 w-full">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Buscar aprendiz por nombre, número de documento o correo..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-8 py-2.5 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500"
                />
                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => setSearchQuery('')}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>

              <div className="w-full sm:w-auto shrink-0 flex items-center gap-2">
                <Filter className="w-4 h-4 text-slate-400 shrink-0 hidden sm:block" />
                <select
                  value={filterFichaId}
                  onChange={(e) => setFilterFichaId(e.target.value)}
                  className="w-full sm:w-56 px-3 py-2.5 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500"
                >
                  <option value="all">Todas las Fichas ({apprentices.length})</option>
                  {fichas.map((f) => (
                    <option key={f.id} value={f.id}>
                      Ficha {f.code} - {f.programName.slice(0, 20)}...
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* List / Table of Apprentices */}
            <div className="border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden">
              <div className="bg-slate-50 dark:bg-slate-800/60 px-4 py-2.5 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between text-xs font-semibold text-slate-600 dark:text-slate-300">
                <span>Aprendices Registrados ({filteredApprentices.length})</span>
                <span className="text-[11px] text-slate-400 font-normal">Acción irreversible al eliminar</span>
              </div>

              {filteredApprentices.length === 0 ? (
                <div className="p-8 text-center text-slate-500 dark:text-slate-400 text-xs">
                  No se encontraron aprendices que coincidan con la búsqueda o la ficha seleccionada.
                </div>
              ) : (
                <div className="divide-y divide-slate-100 dark:divide-slate-800 max-h-[380px] overflow-y-auto">
                  {filteredApprentices.map((app) => {
                    const ficha = fichas.find((f) => f.id === app.fichaId);
                    return (
                      <div
                        key={app.id}
                        className="p-3.5 sm:px-4 sm:py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-slate-50/70 dark:hover:bg-slate-800/40 transition-colors"
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          <div className="w-9 h-9 rounded-full bg-emerald-100 dark:bg-emerald-950/70 text-[#39A900] font-bold text-xs flex items-center justify-center shrink-0">
                            {app.name
                              .split(' ')
                              .map((n) => n[0])
                              .slice(0, 2)
                              .join('')
                              .toUpperCase()}
                          </div>
                          <div className="min-w-0">
                            <div className="flex items-center gap-2 flex-wrap">
                              <span className="font-semibold text-xs text-slate-900 dark:text-slate-100 truncate">
                                {app.name}
                              </span>
                              <span className="text-[11px] px-2 py-0.5 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 rounded font-mono">
                                {app.documentType} {app.documentNumber}
                              </span>
                            </div>
                            <div className="text-[11px] text-slate-500 dark:text-slate-400 flex items-center gap-2 flex-wrap mt-0.5">
                              <span>{app.email}</span>
                              <span>•</span>
                              <span className="text-emerald-700 dark:text-emerald-400 font-medium">
                                Ficha {ficha ? ficha.code : 'SENA'}
                              </span>
                              <span>•</span>
                              <span>
                                {app.status === 'completado' ? (
                                  <span className="text-emerald-600 dark:text-emerald-400 font-medium">Aprobado</span>
                                ) : app.status === 'requiere_refuerzo' ? (
                                  <span className="text-amber-600 dark:text-amber-400 font-medium">Requiere Refuerzo</span>
                                ) : app.status === 'en_progreso' ? (
                                  <span className="text-sky-600 dark:text-sky-400 font-medium">En Progreso ({app.progressPercent}%)</span>
                                ) : (
                                  <span className="text-slate-400">No Iniciado</span>
                                )}
                              </span>
                            </div>
                          </div>
                        </div>

                        {/* Delete Button for this apprentice */}
                        <div className="shrink-0 flex items-center justify-end">
                          <button
                            type="button"
                            onClick={() => {
                              soundFx.playCardFlip();
                              setApprenticeToDelete(app);
                            }}
                            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-950/40 hover:bg-red-100 dark:hover:bg-red-900/60 border border-red-200 dark:border-red-900/60 rounded-lg transition-colors cursor-pointer"
                            title={`Eliminar aprendiz ${app.name} del listado`}
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                            <span>Eliminar</span>
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Bottom Actions */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-4 border-t border-slate-100 dark:border-slate-800 text-xs text-slate-500 dark:text-slate-400">
              <span>
                Total registrados en el sistema: <strong>{apprentices.length}</strong> aprendices
              </span>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setSelectedRoleType('none')}
                  className="px-4 py-2 font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors cursor-pointer"
                >
                  Volver a selección de rol
                </button>
                <button
                  type="button"
                  onClick={() => {
                    soundFx.playCardFlip();
                    onSelectRoleAndStart('instructor');
                  }}
                  className="px-4 py-2 font-bold text-white bg-[#39A900] hover:bg-[#329600] rounded-xl shadow-xs transition-colors cursor-pointer flex items-center gap-1.5"
                >
                  <span>Ir al Panel de Instructor</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Characterization Form when Aprendiz selected */}
        {selectedRoleType === 'aprendiz' && (
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-8 shadow-lg transition-all animate-fadeIn">
            <div className="flex items-center justify-between pb-6 mb-6 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-emerald-100 dark:bg-emerald-950 text-[#39A900] rounded-xl">
                  <UserCheck className="w-6 h-6" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100">
                    Formulario de Caracterización de Aprendiz
                  </h2>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Ingresa tus datos personales y académicos para personalizar tu experiencia de inducción.
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setSelectedRoleType('none')}
                className="text-xs font-semibold text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 cursor-pointer"
              >
                ← Volver a selección de rol
              </button>
            </div>

            {errorMsg && (
              <div className="mb-6 p-3 bg-red-50 dark:bg-red-950/50 border border-red-200 dark:border-red-900 text-red-700 dark:text-red-400 text-xs rounded-lg">
                {errorMsg}
              </div>
            )}

            <form onSubmit={handleApprenticeSubmit} className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                    Nombre Completo *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Ej. Luisa Fernanda Gómez"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-3.5 py-2.5 text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#39A900]"
                  />
                </div>

                <div className="grid grid-cols-3 gap-2">
                  <div className="col-span-1">
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                      Tipo Doc.
                    </label>
                    <select
                      value={documentType}
                      onChange={(e) => setDocumentType(e.target.value as any)}
                      className="w-full px-2.5 py-2.5 text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#39A900]"
                    >
                      <option value="CC">CC</option>
                      <option value="TI">TI</option>
                      <option value="CE">CE</option>
                      <option value="PEP">PEP</option>
                    </select>
                  </div>
                  <div className="col-span-2">
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                      Número de Documento *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="Ej. 1098234123"
                      value={documentNumber}
                      onChange={(e) => setDocumentNumber(e.target.value)}
                      className="w-full px-3.5 py-2.5 text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#39A900]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                    Correo Electrónico Institucional / Personal *
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="tucorreo@soy.sena.edu.co"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-3.5 py-2.5 text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#39A900]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                    Teléfono / Celular de Contacto
                  </label>
                  <input
                    type="tel"
                    placeholder="310 456 7890"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full px-3.5 py-2.5 text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#39A900]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                    Ficha y Programa de Formación
                  </label>
                  <select
                    value={fichaId}
                    onChange={(e) => setFichaId(e.target.value)}
                    className="w-full px-3.5 py-2.5 text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#39A900]"
                  >
                    {fichas.map((f) => (
                      <option key={f.id} value={f.id}>
                        Ficha {f.code} - {f.programName} ({f.level})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                    Situación Laboral Actual
                  </label>
                  <select
                    value={employmentStatus}
                    onChange={(e) => setEmploymentStatus(e.target.value)}
                    className="w-full px-3.5 py-2.5 text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#39A900]"
                  >
                    <option value="Desempleado buscando empleo">Desempleado buscando empleo</option>
                    <option value="Empleado tiempo parcial">Empleado tiempo parcial</option>
                    <option value="Empleado tiempo completo">Empleado tiempo completo</option>
                    <option value="Independiente / Emprendedor">Independiente / Emprendedor</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                  Expectativas frente a la formación en el SENA
                </label>
                <textarea
                  rows={2}
                  placeholder="Escribe brevemente qué esperas lograr con tu programa de formación..."
                  value={expectations}
                  onChange={(e) => setExpectations(e.target.value)}
                  className="w-full px-3.5 py-2.5 text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#39A900]"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setSelectedRoleType('none')}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="flex items-center gap-2 px-6 py-2.5 text-xs font-bold text-white bg-[#39A900] hover:bg-[#329600] rounded-xl shadow-md transition-all cursor-pointer"
                >
                  <span>Guardar Caracterización e Iniciar Inducción</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </form>
          </div>
        )}
      </div>

      {/* Confirmation Modal for Apprentice Deletion */}
      {apprenticeToDelete && (
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
                  Esta acción retirará al aprendiz del listado oficial.
                </p>
              </div>
            </div>

            <div className="p-3.5 bg-slate-50 dark:bg-slate-800/80 rounded-xl border border-slate-200 dark:border-slate-700 space-y-1.5 text-xs">
              <div className="flex justify-between">
                <span className="text-slate-500 dark:text-slate-400">Nombre:</span>
                <span className="font-bold text-slate-900 dark:text-slate-100 text-right">{apprenticeToDelete.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500 dark:text-slate-400">Documento:</span>
                <span className="font-mono text-slate-700 dark:text-slate-300">
                  {apprenticeToDelete.documentType} {apprenticeToDelete.documentNumber}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500 dark:text-slate-400">Correo:</span>
                <span className="text-slate-700 dark:text-slate-300 truncate max-w-[200px]">{apprenticeToDelete.email}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500 dark:text-slate-400">Avance:</span>
                <span className="font-semibold text-emerald-600 dark:text-emerald-400">{apprenticeToDelete.progressPercent}%</span>
              </div>
            </div>

            <p className="text-[11px] text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-950/30 p-2.5 rounded-lg border border-red-200/60 dark:border-red-900/40">
              Advertencia: Los datos de caracterización, progreso y acta de compromiso del aprendiz se eliminarán del sistema local.
            </p>

            <div className="flex items-center justify-end gap-2.5 pt-2">
              <button
                type="button"
                onClick={() => setApprenticeToDelete(null)}
                className="px-4 py-2 text-xs font-semibold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors cursor-pointer"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={handleConfirmDelete}
                className="flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-white bg-red-600 hover:bg-red-700 rounded-xl shadow-xs transition-colors cursor-pointer"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Sí, eliminar del listado</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Floating Video Tutorial Modal */}
      {isVideoModalOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Video Tutorial de Inducción"
          className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/75 backdrop-blur-sm animate-fadeIn"
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              soundFx.playCardFlip();
              setIsVideoModalOpen(false);
            }
          }}
        >
          <div className="relative w-full max-w-4xl bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden flex flex-col max-h-[92vh]">
            {/* Modal Header */}
            <div className="flex items-center justify-between px-5 py-3.5 border-b border-slate-200 dark:border-slate-800 bg-slate-50/80 dark:bg-slate-850">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-emerald-100 dark:bg-emerald-950/70 text-[#39A900] flex items-center justify-center shrink-0">
                  <Video className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">
                      Video Tutorial de Inducción
                    </h3>
                    <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300">
                      Guía Paso a Paso
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Aprende cómo utilizar la herramienta, sus módulos y completar tu proceso formativo.
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <a
                  href="https://docs.google.com/videos/d/1rNkePkaXl7VTovq5d4H6emLpsrRH74LTa92J1pE1NQU/edit?usp=sharing"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-600 dark:text-slate-300 hover:text-[#39A900] dark:hover:text-[#39A900] bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-lg transition-colors"
                  title="Abrir en pestaña nueva"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  <span>Abrir en Drive</span>
                </a>
                <button
                  type="button"
                  onClick={() => {
                    soundFx.playCardFlip();
                    setIsVideoModalOpen(false);
                  }}
                  className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
                  title="Cerrar video"
                  aria-label="Cerrar modal de video"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Video Player Container */}
            <div className="relative w-full aspect-video bg-black flex items-center justify-center">
              <iframe
                src="https://drive.google.com/file/d/1rNkePkaXl7VTovq5d4H6emLpsrRH74LTa92J1pE1NQU/preview"
                title="Video Tutorial de Inducción SENA"
                allow="autoplay; encrypted-media; picture-in-picture; fullscreen"
                allowFullScreen
                className="w-full h-full border-0"
              />
            </div>

            {/* Modal Footer with Controls Help */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 px-5 py-3 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-850 text-xs text-slate-500 dark:text-slate-400">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#39A900] animate-pulse"></span>
                <span>
                  El reproductor cuenta con controles completos: reproducción, pausa, barra de tiempo, volumen, velocidad y pantalla completa.
                </span>
              </div>
              <button
                type="button"
                onClick={() => {
                  soundFx.playCardFlip();
                  setIsVideoModalOpen(false);
                }}
                className="px-4 py-1.5 text-xs font-semibold text-slate-700 dark:text-slate-200 bg-slate-200/80 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700 rounded-lg transition-colors cursor-pointer shrink-0"
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
