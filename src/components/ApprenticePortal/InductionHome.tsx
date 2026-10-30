import React from 'react';
import { Apprentice, Ficha, InductionModule } from '../../types/induction';
import { SENA_INSTITUTIONAL_INFO, INDUCTION_MODULES } from '../../data/senaData';
import { SenaLogo, SenaEscudo } from '../../assets/senaLogo';
import {
  BookOpen,
  CheckCircle2,
  Clock,
  Award,
  FileText,
  ArrowRight,
  ShieldAlert,
  Users,
  Compass,
  Sparkles,
  ChevronRight,
} from 'lucide-react';

interface InductionHomeProps {
  apprentice: Apprentice;
  allApprentices?: Apprentice[];
  ficha: Ficha;
  onSelectApprentice?: (apprenticeId: string) => void;
  onSelectModule: (module: InductionModule) => void;
  onNavigateToQuiz: () => void;
  onNavigateToReglamento: () => void;
  onNavigateToHimno: () => void;
  onOpenCertificate: () => void;
  onOpenCommitment: () => void;
}

export const InductionHome: React.FC<InductionHomeProps> = ({
  apprentice,
  allApprentices,
  ficha,
  onSelectApprentice,
  onSelectModule,
  onNavigateToQuiz,
  onNavigateToReglamento,
  onNavigateToHimno,
  onOpenCertificate,
  onOpenCommitment,
}) => {
  const isApproved = apprentice.evaluationPassed === true;
  const requiresReinforcement = apprentice.status === 'requiere_refuerzo';
  const completedCount = apprentice.completedModules.length;
  const totalModules = INDUCTION_MODULES.length;

  return (
    <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8 space-y-8">
      {/* Apprentice Identity Selector Banner */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-4 sm:p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4 transition-colors">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800/60 flex items-center justify-center p-1.5 shrink-0 shadow-xs">
            <SenaLogo className="w-full h-full" />
          </div>
          <div>
            <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 mb-0.5">
              <span>{ficha.programName}</span>
              <span aria-hidden="true">·</span>
              <span className="font-semibold text-emerald-800 dark:text-emerald-400">Ficha {ficha.code}</span>
              <span aria-hidden="true">·</span>
              <span>{apprentice.documentType} {apprentice.documentNumber}</span>
            </div>
            <h1 className="text-xl font-bold text-slate-900 dark:text-slate-100 leading-tight">
              {apprentice.name}
            </h1>
            <div className="flex items-center gap-3 text-xs text-slate-600 dark:text-slate-400 mt-1">
              <span>{ficha.centerName}</span>
              <span aria-hidden="true">·</span>
              <span>{ficha.regional}</span>
            </div>
          </div>
        </div>

        {/* Apprentice Status & Profile Badges (Completely isolated from instructor data) */}
        <div className="flex flex-wrap items-center gap-2 border-t md:border-t-0 pt-3 md:pt-0 border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-2">
            <span
              className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold ${
                apprentice.status === 'completado'
                  ? 'bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800'
                  : apprentice.status === 'requiere_refuerzo'
                  ? 'bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 border border-amber-300 dark:border-amber-800'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700'
              }`}
            >
              <span
                className={`w-2 h-2 rounded-full ${
                  apprentice.status === 'completado'
                    ? 'bg-emerald-500'
                    : apprentice.status === 'requiere_refuerzo'
                    ? 'bg-amber-500'
                    : 'bg-blue-500'
                }`}
              />
              {apprentice.status === 'completado'
                ? 'Inducción Aprobada'
                : apprentice.status === 'requiere_refuerzo'
                ? 'Requiere Refuerzo'
                : 'En Inducción'}
            </span>

            {apprentice.email && (
              <span className="hidden lg:inline-flex text-[11px] font-medium text-slate-500 dark:text-slate-400 bg-slate-50 dark:bg-slate-800/60 px-2.5 py-1 rounded-lg border border-slate-200/60 dark:border-slate-700/60">
                {apprentice.email}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Hero Presentation Split */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-xs transition-colors">
        <div className="grid grid-cols-1 lg:grid-cols-12 items-stretch">
          <div className="lg:col-span-7 p-6 sm:p-10 flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-3 mb-3">
                <SenaLogo className="w-9 h-9" />
                <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
                  <span className="text-[#39A900] font-semibold">Bienvenido al SENA</span>
                  <span aria-hidden="true">·</span>
                  <span>Formación Profesional Integral</span>
                  <span aria-hidden="true">·</span>
                  <span>Vigencia 2026</span>
                </div>
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 dark:text-slate-100 mb-3 text-balance">
                Inicia con Éxito tu Inducción y Conoce tus Derechos y Deberes
              </h2>
              <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed mb-6">
                El proceso de inducción te conecta con la historia, los valores institucionales, el Reglamento del Aprendiz y las oportunidades que transformarán tu proyecto de vida. Completa cada módulo y realiza la evaluación interactiva para obtener tu constancia oficial.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3 pt-4 border-t border-slate-100 dark:border-slate-800">
              <button
                onClick={() => onSelectModule(INDUCTION_MODULES[0])}
                className="flex items-center gap-2 px-5 py-2.5 text-xs font-semibold rounded-lg bg-[#39A900] hover:bg-[#329600] text-white transition-colors cursor-pointer"
              >
                <span>Explorar Módulos de Inducción</span>
                <ArrowRight className="w-4 h-4" />
              </button>
              <button
                onClick={onNavigateToReglamento}
                className="flex items-center gap-2 px-4 py-2.5 text-xs font-semibold rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 transition-colors cursor-pointer"
              >
                <BookOpen className="w-4 h-4 text-[#39A900]" />
                <span>Explorar Reglamento & Casos</span>
              </button>
              <button
                onClick={onNavigateToHimno}
                className="flex items-center gap-2 px-4 py-2.5 text-xs font-semibold rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 transition-colors cursor-pointer"
              >
                <Sparkles className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                <span>Himno y Símbolos</span>
              </button>
            </div>
          </div>

          <div className="lg:col-span-5 bg-slate-100 dark:bg-slate-800 relative min-h-[260px] lg:min-h-full">
            <img
              src="/src/assets/images/hero_sena_induction_1793117853260.jpg"
              alt="Aprendices SENA en ambiente de formación tecnológica"
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent flex items-end p-6">
              <div className="text-white text-xs font-medium">
                Centro de Formación Técnica y Tecnológica · Colombia
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 4-Column KPI Strip */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {/* KPI 1 */}
        <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-5 shadow-xs transition-colors">
          <div className="text-xs text-slate-500 dark:text-slate-400 mb-1">Avance Global</div>
          <div className="text-2xl font-bold text-slate-900 dark:text-slate-100 tabular-nums">
            {apprentice.progressPercent}%
          </div>
          <div className="w-full bg-slate-100 dark:bg-slate-800 h-1.5 rounded-full overflow-hidden mt-3">
            <div
              className="bg-[#39A900] h-full transition-all duration-300"
              style={{ width: `${apprentice.progressPercent}%` }}
            />
          </div>
        </div>

        {/* KPI 2 */}
        <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-5 shadow-xs transition-colors">
          <div className="text-xs text-slate-500 dark:text-slate-400 mb-1">Módulos Apropiados</div>
          <div className="text-2xl font-bold text-slate-900 dark:text-slate-100 tabular-nums">
            {completedCount} <span className="text-xs font-normal text-slate-400">/ {totalModules}</span>
          </div>
          <div className="text-xs text-slate-500 dark:text-slate-400 mt-3">
            {completedCount === totalModules ? 'Todos completados' : `${totalModules - completedCount} por revisar`}
          </div>
        </div>

        {/* KPI 3 */}
        <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-5 shadow-xs transition-colors">
          <div className="text-xs text-slate-500 dark:text-slate-400 mb-1">Evaluación de Apropiación</div>
          <div className="text-2xl font-bold text-slate-900 dark:text-slate-100 tabular-nums">
            {apprentice.evaluationScore !== undefined ? `${apprentice.evaluationScore}%` : 'Pendiente'}
          </div>
          <div className="text-xs mt-3">
            {isApproved ? (
              <span className="text-emerald-700 dark:text-emerald-400 font-semibold">Aprobado ✓</span>
            ) : requiresReinforcement ? (
              <span className="text-amber-700 dark:text-amber-400 font-semibold">Requiere Refuerzo</span>
            ) : (
              <span className="text-slate-500 dark:text-slate-400">Mínimo 80%</span>
            )}
          </div>
        </div>

        {/* KPI 4 */}
        <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-5 shadow-xs transition-colors">
          <div className="text-xs text-slate-500 dark:text-slate-400 mb-1">Acta de Compromiso</div>
          <div className="text-lg font-bold text-slate-900 dark:text-slate-100 truncate mt-1">
            {apprentice.commitmentSigned ? 'Suscrita' : 'Sin Firmar'}
          </div>
          <div className="text-xs text-slate-500 dark:text-slate-400 mt-4">
            {apprentice.commitmentSigned ? (
              <button
                onClick={onOpenCommitment}
                className="text-emerald-700 dark:text-emerald-400 hover:underline font-semibold cursor-pointer"
              >
                Ver documento
              </button>
            ) : (
              <button
                onClick={onOpenCommitment}
                className="text-slate-700 dark:text-slate-300 hover:text-[#39A900] dark:hover:text-[#39A900] font-semibold cursor-pointer"
              >
                Firmar ahora →
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Interactive Evaluation Showcase Box */}
      <div className={`rounded-2xl border p-6 sm:p-8 flex flex-col md:flex-row md:items-center justify-between gap-6 transition-all ${
        isApproved
          ? 'bg-emerald-50/70 dark:bg-emerald-950/40 border-emerald-300 dark:border-emerald-800'
          : requiresReinforcement
          ? 'bg-amber-50/70 dark:bg-amber-950/40 border-amber-300 dark:border-amber-800'
          : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 shadow-xs'
      }`}>
        <div className="space-y-1 max-w-xl">
          <div className="flex items-center gap-2 text-xs font-semibold text-emerald-800 dark:text-emerald-400">
            <Award className="w-4 h-4 text-[#39A900]" />
            <span>Etapa Culminante: Evaluación de Conocimientos Interactiva</span>
          </div>
          <h3 className="text-xl font-bold text-slate-900 dark:text-slate-100">
            {isApproved
              ? '¡Apropiación de Inducción Verificada y Certificada!'
              : 'Demuestra tu Apropiación de la Inducción'}
          </h3>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
            {isApproved
              ? `Has aprobado la evaluación con un puntaje de ${apprentice.evaluationScore}%. Tu constancia oficial con código de verificación está lista para ser descargada e impresa.`
              : 'Responde a los casos situacionales sobre derechos, deberes, bienestar, deserción y el régimen disciplinario. Obtén 80% o más para habilitar tu certificación.'}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3 shrink-0">
          {isApproved ? (
            <>
              <button
                onClick={onOpenCertificate}
                className="flex items-center gap-2 px-5 py-2.5 text-xs font-semibold rounded-lg bg-[#39A900] hover:bg-[#329600] text-white transition-colors cursor-pointer"
              >
                <Award className="w-4 h-4" />
                <span>Ver Constancia Oficial</span>
              </button>
              <button
                onClick={onNavigateToQuiz}
                className="px-4 py-2.5 text-xs font-medium rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors cursor-pointer"
              >
                Repetir Prueba
              </button>
            </>
          ) : (
            <button
              onClick={onNavigateToQuiz}
              className="flex items-center gap-2 px-5 py-2.5 text-xs font-semibold rounded-lg bg-[#39A900] hover:bg-[#329600] text-white transition-colors cursor-pointer"
            >
              <span>{requiresReinforcement ? 'Presentar Refuerzo del Examen' : 'Comenzar Evaluación de Apropiación'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Modules Roadmap Grid */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">
              Ruta Formativa de Inducción
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Recorre cada módulo interactivo para apropiar la cultura y la normatividad SENA
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {INDUCTION_MODULES.map((mod, index) => {
            const isCompleted = apprentice.completedModules.includes(mod.id);
            return (
              <div
                key={mod.id}
                onClick={() => onSelectModule(mod)}
                className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-6 flex flex-col justify-between hover:border-slate-300 dark:hover:border-slate-700 hover:shadow-xs transition-all cursor-pointer group"
              >
                <div>
                  <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 mb-3">
                    <span className="font-semibold text-emerald-700 dark:text-emerald-400">Módulo 0{index + 1}</span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-slate-400" />
                      {mod.estimatedMinutes} min
                    </span>
                  </div>

                  <h4 className="text-base font-bold text-slate-900 dark:text-slate-100 mb-1 group-hover:text-[#39A900] dark:group-hover:text-[#39A900] transition-colors">
                    {mod.title}
                  </h4>
                  <div className="text-xs font-medium text-slate-500 dark:text-slate-400 mb-3">
                    {mod.subtitle}
                  </div>
                  <p className="text-xs text-slate-600 dark:text-slate-300 line-clamp-3 leading-relaxed mb-4">
                    {mod.summary}
                  </p>
                </div>

                <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                  {isCompleted ? (
                    <span className="text-xs font-semibold text-emerald-700 dark:text-emerald-400 flex items-center gap-1">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                      Apropiado
                    </span>
                  ) : (
                    <span className="text-xs text-slate-500 dark:text-slate-400">
                      {mod.topics.length} temas clave
                    </span>
                  )}
                  <div className="flex items-center gap-1 text-xs font-semibold text-[#39A900] group-hover:translate-x-1 transition-transform">
                    <span>Estudiar</span>
                    <ChevronRight className="w-4 h-4" />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Símbolos Institucionales Oficiales */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 sm:p-8 shadow-xs transition-colors">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <div className="text-xs font-bold uppercase tracking-wider text-[#39A900] mb-1">
              Símbolos Oficiales del SENA
            </div>
            <h3 className="text-xl font-bold text-slate-900 dark:text-slate-100">
              El Escudo y el Logo-símbolo
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-xl">
              Emblemas oficiales que representan la fuerza productiva, los tres sectores de la economía nacional y la proyección del aprendiz hacia el futuro.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Escudo Oficial */}
          <div className="p-5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 flex flex-col justify-between">
            <div>
              <div className="w-24 h-24 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-center p-2.5 mb-4 shadow-xs">
                <SenaEscudo className="w-full h-full object-contain" />
              </div>
              <div className="text-xs font-bold uppercase tracking-wide text-emerald-800 dark:text-emerald-400 mb-1">
                El Escudo del SENA
              </div>
              <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
                Refleja los tres sectores económicos de Colombia: la rueda dentada (industria y construcción), el caduceo (comercio y servicios) y la rama con espiga de café (sector primario y agropecuario).
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-slate-200/60 dark:border-slate-700/60 text-[11px] text-slate-500 dark:text-slate-400 font-medium">
              Símbolo de la producción nacional
            </div>
          </div>

          {/* Logo-símbolo Oficial */}
          <div className="p-5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 flex flex-col justify-between">
            <div>
              <div className="w-24 h-24 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-center p-2.5 mb-4 shadow-xs">
                <SenaLogo className="w-full h-full object-contain" />
              </div>
              <div className="text-xs font-bold uppercase tracking-wide text-emerald-800 dark:text-emerald-400 mb-1">
                El Logo-símbolo Oficial
              </div>
              <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
                Plasma al aprendiz que marcha erguido por un sendero hacia el horizonte, superando obstáculos con conocimiento y disciplina para liderar el progreso social y tecnológico.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-slate-200/60 dark:border-slate-700/60 text-[11px] text-slate-500 dark:text-slate-400 font-medium">
              Símbolo del aprendiz hacia el futuro
            </div>
          </div>
        </div>
      </div>

      {/* SENA Institutional Values Strip */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 sm:p-8 shadow-xs transition-colors">
        <div className="mb-6">
          <div className="text-xs font-bold uppercase tracking-wider text-[#39A900] mb-1">
            Identidad y Convivencia
          </div>
          <h3 className="text-xl font-bold text-slate-900 dark:text-slate-100">
            Decálogo de Valores Institucionales SENA
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-xl">
            Principios irrenunciables que guían las actitudes, el liderazgo y el comportamiento ético de los aprendices en su formación integral.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {SENA_INSTITUTIONAL_INFO.values.map((val) => (
            <div
              key={val.name}
              className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 hover:bg-white dark:hover:bg-slate-800 transition-colors"
            >
              <div className="font-bold text-xs text-slate-900 dark:text-slate-100 mb-1">
                {val.name}
              </div>
              <div className="text-xs text-slate-600 dark:text-slate-400 leading-snug">
                {val.description}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
