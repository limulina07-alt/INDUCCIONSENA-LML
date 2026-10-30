import React, { useState } from 'react';
import { QuizQuestion, Apprentice } from '../../types/induction';
import { soundFx } from '../../utils/audioSynth';
import confetti from 'canvas-confetti';
import { CheckCircle2, XCircle, ArrowRight, RotateCcw, Award, FileText, AlertCircle, HelpCircle } from 'lucide-react';
import { SenaLogo } from '../../assets/senaLogo';

interface InteractiveQuizProps {
  questions: QuizQuestion[];
  apprentice: Apprentice;
  onUpdateApprentice: (updated: Apprentice) => void;
  onOpenCertificate: () => void;
  onOpenCommitment: () => void;
}

export const InteractiveQuiz: React.FC<InteractiveQuizProps> = ({
  questions,
  apprentice,
  onUpdateApprentice,
  onOpenCertificate,
  onOpenCommitment,
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, string>>({});
  const [showExplanation, setShowExplanation] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);
  const [lastScore, setLastScore] = useState<number | null>(apprentice.evaluationScore ?? null);

  const currentQuestion = questions[currentIndex];
  const isAnswered = selectedAnswers[currentQuestion.id] !== undefined;
  const isCurrentCorrect = selectedAnswers[currentQuestion.id] === currentQuestion.correctAnswerId;

  const handleSelectOption = (optionId: string) => {
    if (showExplanation) return;
    setSelectedAnswers((prev) => ({
      ...prev,
      [currentQuestion.id]: optionId,
    }));
    setShowExplanation(true);

    if (optionId === currentQuestion.correctAnswerId) {
      soundFx.playSuccessChime();
    } else {
      soundFx.playErrorChime();
    }
  };

  const handleNext = () => {
    setShowExplanation(false);
    if (currentIndex < questions.length - 1) {
      setCurrentIndex((prev) => prev + 1);
    } else {
      finishQuiz();
    }
  };

  const finishQuiz = () => {
    let correctCount = 0;
    questions.forEach((q) => {
      if (selectedAnswers[q.id] === q.correctAnswerId) {
        correctCount++;
      }
    });

    const scorePercentage = Math.round((correctCount / questions.length) * 100);
    const passed = scorePercentage >= 80;
    setLastScore(scorePercentage);
    setIsCompleted(true);

    const now = new Date();
    const formattedDate = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(
      now.getDate()
    ).padStart(2, '0')} ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;

    const certCode =
      apprentice.certificateCode ||
      `SENA-IND-${now.getFullYear()}-${Math.random().toString(36).substring(2, 7).toUpperCase()}`;

    const updated: Apprentice = {
      ...apprentice,
      evaluationScore: scorePercentage,
      evaluationPassed: passed,
      evaluationAttempts: (apprentice.evaluationAttempts || 0) + 1,
      evaluationDate: formattedDate,
      certificateCode: passed ? certCode : apprentice.certificateCode,
      status: passed ? 'completado' : 'requiere_refuerzo',
      progressPercent: passed ? 100 : Math.max(apprentice.progressPercent, 80),
    };

    onUpdateApprentice(updated);

    if (passed) {
      soundFx.playSuccessChime();
      try {
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#39A900', '#00324D', '#FCD116', '#FFFFFF'],
        });
      } catch {
        // Confetti fallback
      }
    } else {
      soundFx.playErrorChime();
    }
  };

  const handleRestart = () => {
    setSelectedAnswers({});
    setCurrentIndex(0);
    setShowExplanation(false);
    setIsCompleted(false);
  };

  return (
    <div className="max-w-3xl mx-auto py-8 px-4 sm:px-6">
      {/* Editorial Header */}
      <div className="mb-6 flex items-start gap-4">
        <SenaLogo className="w-12 h-12 mt-1 shrink-0" />
        <div>
          <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 mb-1">
            <span>Evaluación Formativa</span>
            <span aria-hidden="true">·</span>
            <span>Apropiación del Proceso de Inducción</span>
            <span aria-hidden="true">·</span>
            <span>Calificación mínima: 80%</span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
            Evaluación Interactiva de Inducción SENA
          </h1>
          <p className="text-sm text-slate-600 dark:text-slate-300 mt-1">
            Esta prueba evalúa tu comprensión de la identidad institucional, derechos, deberes, bienestar y debido proceso a través de casos situacionales reales.
          </p>
        </div>
      </div>

      {!isCompleted ? (
        <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-6 sm:p-8 shadow-xs transition-colors">
          {/* Progress Header */}
          <div className="flex items-center justify-between pb-4 mb-6 border-b border-slate-100 dark:border-slate-800">
            <div className="text-xs font-semibold text-slate-500 dark:text-slate-400">
              Pregunta <span className="text-slate-900 dark:text-slate-100 font-bold">{currentIndex + 1}</span> de{' '}
              <span className="text-slate-900 dark:text-slate-100 font-bold">{questions.length}</span>
            </div>
            <div className="text-xs font-medium text-emerald-700 dark:text-emerald-400 capitalize">
              Área: {currentQuestion.category.replace('_', ' ')}
            </div>
          </div>

          {/* Linear Progress Indicator */}
          <div className="w-full bg-slate-100 dark:bg-slate-800 h-1.5 rounded-full overflow-hidden mb-6">
            <div
              className="bg-[#39A900] h-full transition-all duration-300"
              style={{ width: `${((currentIndex + 1) / questions.length) * 100}%` }}
            />
          </div>

          {/* Situational Scenario Box if exists */}
          {currentQuestion.scenario && (
            <div className="bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-lg p-4 mb-5 text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
              <span className="font-semibold text-slate-900 dark:text-slate-100 block mb-1">
                Caso Situacional de Aprendizaje:
              </span>
              {currentQuestion.scenario}
            </div>
          )}

          {/* Question Text */}
          <h2 className="text-base font-bold text-slate-900 dark:text-slate-100 mb-6 leading-snug">
            {currentQuestion.question}
          </h2>

          {/* Options */}
          <div className="space-y-3 mb-6">
            {currentQuestion.options.map((option) => {
              const isSelected = selectedAnswers[currentQuestion.id] === option.id;
              const isCorrect = option.id === currentQuestion.correctAnswerId;

              let optionStyle =
                'border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 hover:bg-slate-50/60 dark:hover:bg-slate-750';
              if (showExplanation) {
                if (isCorrect) {
                  optionStyle = 'border-emerald-500 dark:border-emerald-600 bg-emerald-50/70 dark:bg-emerald-950/40 text-emerald-900 dark:text-emerald-200 font-medium';
                } else if (isSelected && !isCorrect) {
                  optionStyle = 'border-red-400 dark:border-red-600 bg-red-50/70 dark:bg-red-950/40 text-red-900 dark:text-red-200';
                } else {
                  optionStyle = 'border-slate-200 dark:border-slate-800 bg-slate-50/40 dark:bg-slate-800/40 text-slate-400 dark:text-slate-500 opacity-60';
                }
              } else if (isSelected) {
                optionStyle = 'border-[#39A900] dark:border-[#39A900] bg-emerald-50/40 dark:bg-emerald-950/30 text-[#39A900] dark:text-[#39A900]';
              }

              return (
                <button
                  key={option.id}
                  disabled={showExplanation}
                  onClick={() => handleSelectOption(option.id)}
                  className={`w-full text-left p-4 rounded-xl border text-xs sm:text-sm transition-all flex items-start gap-3 cursor-pointer ${optionStyle}`}
                >
                  <span className="w-6 h-6 rounded-md bg-slate-100 dark:bg-slate-700 flex items-center justify-center font-bold text-xs shrink-0 text-slate-600 dark:text-slate-300">
                    {option.id.toUpperCase()}
                  </span>
                  <span className="flex-1 leading-snug">{option.text}</span>
                  {showExplanation && isCorrect && (
                    <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400 shrink-0" />
                  )}
                  {showExplanation && isSelected && !isCorrect && (
                    <XCircle className="w-5 h-5 text-red-600 dark:text-red-400 shrink-0" />
                  )}
                </button>
              );
            })}
          </div>

          {/* Pedagogical Feedback Card */}
          {showExplanation && (
            <div
              className={`p-4 rounded-xl border mb-6 text-xs leading-relaxed ${
                isCurrentCorrect
                  ? 'border-emerald-200 dark:border-emerald-800 bg-emerald-50/40 dark:bg-emerald-950/40 text-emerald-900 dark:text-emerald-200'
                  : 'border-red-200 dark:border-red-800 bg-red-50/40 dark:bg-red-950/40 text-red-900 dark:text-red-200'
              }`}
            >
              <div className="font-bold mb-1 flex items-center gap-1.5">
                {isCurrentCorrect ? (
                  <>
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                    <span>¡Correcto! Apropiación verificada.</span>
                  </>
                ) : (
                  <>
                    <AlertCircle className="w-4 h-4 text-red-600 dark:text-red-400" />
                    <span>Retroalimentación pedagógica:</span>
                  </>
                )}
              </div>
              <p className="text-slate-700 dark:text-slate-300">{currentQuestion.explanation}</p>
              <div className="mt-2 pt-2 border-t border-slate-200/60 dark:border-slate-700/60 font-semibold text-slate-600 dark:text-slate-400 text-[11px]">
                Sustento normativo: {currentQuestion.regulationReference}
              </div>
            </div>
          )}

          {/* Action Row */}
          <div className="flex items-center justify-between pt-4 border-t border-slate-100 dark:border-slate-800">
            <div className="text-xs text-slate-500 dark:text-slate-400">
              {showExplanation ? 'Presiona siguiente para avanzar' : 'Selecciona la opción correcta'}
            </div>
            {showExplanation && (
              <button
                onClick={handleNext}
                className="flex items-center gap-2 px-5 py-2 text-xs font-semibold rounded-lg bg-[#39A900] hover:bg-[#329600] text-white transition-colors cursor-pointer"
              >
                <span>{currentIndex < questions.length - 1 ? 'Siguiente Pregunta' : 'Finalizar Evaluación'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      ) : (
        /* Result Summary Card */
        <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-6 sm:p-8 shadow-xs text-center transition-colors">
          <div className="max-w-md mx-auto">
            {lastScore !== null && lastScore >= 80 ? (
              <>
                <div className="w-16 h-16 rounded-2xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 flex items-center justify-center mx-auto mb-4 p-2 shadow-xs">
                  <SenaLogo className="w-full h-full" />
                </div>
                <div className="text-xs uppercase tracking-wider text-emerald-700 dark:text-emerald-400 font-bold mb-1">
                  Apropiación Satisfactoria
                </div>
                <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100 mb-2">
                  ¡Felicitaciones, {apprentice.name}!
                </h2>
                <p className="text-sm text-slate-600 dark:text-slate-300 mb-6">
                  Has demostrado dominio completo de los derechos, deberes y valores institucionales del SENA con una calificación sobresaliente.
                </p>

                {/* Score KPI Display */}
                <div className="p-4 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200 dark:border-slate-700 mb-6 flex justify-around">
                  <div>
                    <div className="text-xs text-slate-500 dark:text-slate-400">Puntaje Final</div>
                    <div className="text-2xl font-bold text-[#39A900] tabular-nums">{lastScore}%</div>
                  </div>
                  <div className="w-px bg-slate-200 dark:bg-slate-700" />
                  <div>
                    <div className="text-xs text-slate-500 dark:text-slate-400">Estado</div>
                    <div className="text-sm font-bold text-emerald-700 dark:text-emerald-400 mt-1">APROBADO</div>
                  </div>
                  <div className="w-px bg-slate-200 dark:bg-slate-700" />
                  <div>
                    <div className="text-xs text-slate-500 dark:text-slate-400">Intentos</div>
                    <div className="text-2xl font-bold text-slate-800 dark:text-slate-200 tabular-nums">
                      {apprentice.evaluationAttempts}
                    </div>
                  </div>
                </div>

                {/* Next Steps CTA */}
                <div className="flex flex-col sm:flex-row gap-3 justify-center mb-4">
                  <button
                    onClick={onOpenCertificate}
                    className="flex items-center justify-center gap-2 px-5 py-2.5 text-xs font-semibold rounded-lg bg-[#39A900] hover:bg-[#329600] text-white transition-colors cursor-pointer"
                  >
                    <Award className="w-4 h-4" />
                    <span>Ver y Descargar Certificado</span>
                  </button>
                  <button
                    onClick={onOpenCommitment}
                    className="flex items-center justify-center gap-2 px-5 py-2.5 text-xs font-semibold rounded-lg bg-slate-900 dark:bg-slate-800 hover:bg-slate-800 dark:hover:bg-slate-700 text-white transition-colors cursor-pointer border border-transparent dark:border-slate-700"
                  >
                    <FileText className="w-4 h-4" />
                    <span>{apprentice.commitmentSigned ? 'Ver Acta Firmada' : 'Firmar Acta de Compromiso'}</span>
                  </button>
                </div>
              </>
            ) : (
              <>
                <div className="w-16 h-16 rounded-full bg-amber-100 dark:bg-amber-950/60 text-amber-700 dark:text-amber-400 flex items-center justify-center mx-auto mb-4 border border-amber-300 dark:border-amber-800">
                  <HelpCircle className="w-8 h-8" />
                </div>
                <div className="text-xs uppercase tracking-wider text-amber-700 dark:text-amber-400 font-bold mb-1">
                  Requiere Refuerzo
                </div>
                <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100 mb-2">
                  Puntaje Obtenido: {lastScore}%
                </h2>
                <p className="text-sm text-slate-600 dark:text-slate-300 mb-6">
                  Para aprobar la inducción y expedir tu constancia oficial necesitas alcanzar un mínimo del 80%. Te recomendamos repasar los capítulos del Reglamento antes de volver a presentarla.
                </p>

                <div className="flex justify-center gap-3">
                  <button
                    onClick={handleRestart}
                    className="flex items-center gap-2 px-5 py-2.5 text-xs font-semibold rounded-lg bg-[#39A900] hover:bg-[#329600] text-white transition-colors cursor-pointer"
                  >
                    <RotateCcw className="w-4 h-4" />
                    <span>Intentar la Evaluación Nuevamente</span>
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
