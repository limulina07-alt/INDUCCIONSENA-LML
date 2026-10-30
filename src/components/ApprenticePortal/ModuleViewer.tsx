import React, { useState } from 'react';
import { InductionModule, Apprentice } from '../../types/induction';
import { CheckCircle2, Clock, ChevronRight, BookOpen, Award, ArrowLeft, Lightbulb } from 'lucide-react';
import { soundFx } from '../../utils/audioSynth';
import { SenaLogo, SenaEscudo } from '../../assets/senaLogo';

interface ModuleViewerProps {
  module: InductionModule;
  apprentice: Apprentice;
  onUpdateApprentice: (updated: Apprentice) => void;
  onBack: () => void;
  onNavigateToQuiz: () => void;
}

export const ModuleViewer: React.FC<ModuleViewerProps> = ({
  module,
  apprentice,
  onUpdateApprentice,
  onBack,
  onNavigateToQuiz,
}) => {
  const [selectedTopicIndex, setSelectedTopicIndex] = useState(0);

  const isModuleCompleted = apprentice.completedModules.includes(module.id);
  const currentTopic = module.topics[selectedTopicIndex];

  const handleCompleteModule = () => {
    if (isModuleCompleted) return;

    const newCompleted = [...apprentice.completedModules, module.id];
    // Each module contributes 16% to progress, up to 80% before exam
    const calculatedProgress = Math.min(80, newCompleted.length * 20);

    const updated: Apprentice = {
      ...apprentice,
      completedModules: newCompleted,
      progressPercent: Math.max(apprentice.progressPercent, calculatedProgress),
    };

    onUpdateApprentice(updated);
    soundFx.playSuccessChime();
  };

  // Image pairing based on module
  let illustrationPath = '/src/assets/images/sena_symbols_identity_1793117853110.jpg';
  if (module.category === 'ruta') {
    illustrationPath = '/src/assets/images/sena_training_journey_1793117854307.jpg';
  } else if (module.category === 'identidad') {
    illustrationPath = '/src/assets/images/sena_symbols_identity_1793117853110.jpg';
  } else {
    illustrationPath = '/src/assets/images/hero_sena_induction_1793117853260.jpg';
  }

  return (
    <div className="max-w-5xl mx-auto py-8 px-4 sm:px-6">
      {/* Back Button and Breadcrumbs */}
      <div className="flex items-center gap-3 mb-6">
        <button
          onClick={onBack}
          className="flex items-center gap-1.5 text-xs font-semibold text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-slate-100 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Volver a la Ruta</span>
        </button>
        <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
          <SenaLogo className="w-4 h-4 inline-block" />
          <span>Inducción SENA</span>
          <span aria-hidden="true">·</span>
          <span>Módulo {module.id.replace('mod-', '')}</span>
          <span aria-hidden="true">·</span>
          <span className="text-slate-800 dark:text-slate-200 font-medium">{module.title}</span>
        </div>
      </div>

      {/* Module Title Banner */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-xs mb-8 transition-colors">
        <div className="grid grid-cols-1 lg:grid-cols-3">
          <div className="p-6 sm:p-8 lg:col-span-2 flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-3 text-xs text-slate-500 dark:text-slate-400 mb-2">
                <span className="flex items-center gap-1 text-emerald-700 dark:text-emerald-400 font-semibold">
                  <Clock className="w-3.5 h-3.5" />
                  {module.estimatedMinutes} minutos estimados
                </span>
                <span aria-hidden="true">·</span>
                <span>{module.topics.length} temas clave</span>
                {isModuleCompleted && (
                  <>
                    <span aria-hidden="true">·</span>
                    <span className="text-emerald-700 dark:text-emerald-400 font-bold flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      Completado
                    </span>
                  </>
                )}
              </div>
              <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-100 mb-2">
                {module.title}
              </h1>
              <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed max-w-xl">
                {module.summary}
              </p>
            </div>

            {/* Complete button */}
            <div className="pt-6 mt-6 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
              <span className="text-xs text-slate-500 dark:text-slate-400">
                Tema {selectedTopicIndex + 1} de {module.topics.length}
              </span>
              <button
                onClick={handleCompleteModule}
                className={`flex items-center gap-2 px-4 py-2 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
                  isModuleCompleted
                    ? 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800'
                    : 'bg-[#39A900] hover:bg-[#329600] text-white shadow-xs'
                }`}
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>{isModuleCompleted ? 'Módulo Completado ✓' : 'Marcar Módulo como Apropiado'}</span>
              </button>
            </div>
          </div>

          {/* Module Illustration */}
          <div className="bg-slate-100 dark:bg-slate-800 relative min-h-[220px] lg:min-h-full">
            <img
              src={illustrationPath}
              alt={module.title}
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
          </div>
        </div>
      </div>

      {/* Topics Split Navigator */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Sidebar Topics Nav */}
        <div className="space-y-2">
          <div className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-3 px-1">
            Contenidos del Módulo
          </div>
          {module.topics.map((t, idx) => {
            const isSelected = selectedTopicIndex === idx;
            return (
              <button
                key={t.id}
                onClick={() => setSelectedTopicIndex(idx)}
                className={`w-full text-left p-3 rounded-xl border text-xs font-medium transition-all flex items-center justify-between cursor-pointer ${
                  isSelected
                    ? 'bg-emerald-50/80 dark:bg-emerald-950/50 border-emerald-300 dark:border-emerald-800 text-emerald-950 dark:text-emerald-200 font-semibold shadow-xs'
                    : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:border-slate-300 dark:hover:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800'
                }`}
              >
                <div className="flex items-center gap-2 truncate">
                  <span className="w-5 h-5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 flex items-center justify-center text-[10px] shrink-0 font-bold">
                    {idx + 1}
                  </span>
                  <span className="truncate">{t.title}</span>
                </div>
                <ChevronRight className="w-3.5 h-3.5 text-slate-400 shrink-0" />
              </button>
            );
          })}

          {/* Quick Exam Shortcut */}
          <div className="pt-4 mt-4 border-t border-slate-200 dark:border-slate-800">
            <button
              onClick={onNavigateToQuiz}
              className="w-full p-3 rounded-xl bg-slate-900 dark:bg-slate-800 hover:bg-slate-800 dark:hover:bg-slate-700 text-white text-xs font-semibold flex items-center justify-between transition-colors cursor-pointer border border-transparent dark:border-slate-700"
            >
              <span>Ir a Evaluación de Inducción</span>
              <Award className="w-4 h-4 text-[#39A900]" />
            </button>
          </div>
        </div>

        {/* Topic Detail View */}
        <div className="lg:col-span-3 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-6 sm:p-8 shadow-xs transition-colors">
          <div className="flex items-center justify-between pb-4 mb-6 border-b border-slate-100 dark:border-slate-800">
            <div>
              <span className="text-xs font-semibold text-emerald-700 dark:text-emerald-400 uppercase tracking-wide">
                Tema {selectedTopicIndex + 1}
              </span>
              <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100 mt-1">
                {currentTopic.title}
              </h2>
            </div>
            {currentTopic.badgeLabel && (
              <div className="text-xs font-medium text-slate-500 dark:text-slate-400">
                {currentTopic.badgeLabel}
              </div>
            )}
          </div>

          {/* Prose Content */}
          <div className="prose prose-slate max-w-none text-sm leading-relaxed text-slate-700 dark:text-slate-300 mb-6">
            <p className="whitespace-pre-line leading-relaxed">
              {currentTopic.content}
            </p>
          </div>

          {/* Visual Showcase for Symbols topic */}
          {currentTopic.id === 'top-simbolos' && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
              <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/40 flex items-center gap-3">
                <div className="w-20 h-20 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 p-2 flex items-center justify-center shrink-0 shadow-xs">
                  <SenaEscudo className="w-full h-full object-contain" />
                </div>
                <div>
                  <div className="text-xs font-bold text-slate-900 dark:text-slate-100">Escudo Oficial del SENA</div>
                  <div className="text-[11px] text-slate-600 dark:text-slate-400 leading-snug mt-0.5">
                    Rueda dentada (industria), caduceo (comercio/servicios) y espiga de café (agropecuario).
                  </div>
                </div>
              </div>

              <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/40 flex items-center gap-3">
                <div className="w-20 h-20 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 p-2 flex items-center justify-center shrink-0 shadow-xs">
                  <SenaLogo className="w-full h-full object-contain" />
                </div>
                <div>
                  <div className="text-xs font-bold text-slate-900 dark:text-slate-100">Logo-símbolo Oficial</div>
                  <div className="text-[11px] text-slate-600 dark:text-slate-400 leading-snug mt-0.5">
                    Silueta del aprendiz marchando erguido con paso firme hacia el futuro.
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Key Takeaway Box */}
          <div className="p-4 rounded-xl bg-emerald-50/60 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 mb-6">
            <div className="flex items-start gap-3">
              <Lightbulb className="w-5 h-5 text-[#39A900] shrink-0 mt-0.5" />
              <div>
                <div className="text-xs font-bold text-emerald-950 dark:text-emerald-300 mb-1">
                  Concepto Clave para la Apropiación:
                </div>
                <div className="text-xs text-emerald-900 dark:text-emerald-200 leading-relaxed font-medium">
                  {currentTopic.keyTakeaway}
                </div>
              </div>
            </div>
          </div>

          {/* Actionable Tips if present */}
          {currentTopic.actionableTips && currentTopic.actionableTips.length > 0 && (
            <div className="border border-slate-200 dark:border-slate-800 rounded-xl p-4 bg-slate-50/50 dark:bg-slate-800/40 mb-6">
              <div className="text-xs font-bold text-slate-900 dark:text-slate-100 mb-2">
                Recomendaciones Prácticas para el Aprendiz:
              </div>
              <ul className="space-y-1.5 text-xs text-slate-600 dark:text-slate-400">
                {currentTopic.actionableTips.map((tip, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="text-[#39A900] font-bold">›</span>
                    <span>{tip}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Topic Pagination */}
          <div className="flex items-center justify-between pt-6 border-t border-slate-100 dark:border-slate-800">
            <button
              disabled={selectedTopicIndex === 0}
              onClick={() => setSelectedTopicIndex((prev) => Math.max(0, prev - 1))}
              className="text-xs font-semibold px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-700 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 transition-colors cursor-pointer"
            >
              Tema Anterior
            </button>
            {selectedTopicIndex < module.topics.length - 1 ? (
              <button
                onClick={() => setSelectedTopicIndex((prev) => Math.min(module.topics.length - 1, prev + 1))}
                className="text-xs font-semibold px-4 py-2 rounded-lg bg-slate-900 dark:bg-slate-800 hover:bg-slate-800 dark:hover:bg-slate-700 text-white transition-colors cursor-pointer border border-transparent dark:border-slate-700"
              >
                Siguiente Tema
              </button>
            ) : (
              <button
                onClick={handleCompleteModule}
                className="text-xs font-semibold px-4 py-2 rounded-lg bg-[#39A900] hover:bg-[#329600] text-white transition-colors cursor-pointer"
              >
                {isModuleCompleted ? 'Módulo Completado ✓' : 'Finalizar Este Módulo'}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
