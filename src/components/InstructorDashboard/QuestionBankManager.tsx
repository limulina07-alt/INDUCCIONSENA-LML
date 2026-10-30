import React, { useState } from 'react';
import { QuizQuestion } from '../../types/induction';
import { Plus, CheckCircle2, BookOpen, AlertCircle, Trash2, ArrowLeft } from 'lucide-react';
import { soundFx } from '../../utils/audioSynth';
import { SenaLogo } from '../../assets/senaLogo';

interface QuestionBankManagerProps {
  questions: QuizQuestion[];
  onUpdateQuestions: (questions: QuizQuestion[]) => void;
  onBack: () => void;
}

export const QuestionBankManager: React.FC<QuestionBankManagerProps> = ({
  questions,
  onUpdateQuestions,
  onBack,
}) => {
  const [showAddForm, setShowAddForm] = useState(false);
  const [category, setCategory] = useState<'identidad' | 'derechos' | 'deberes' | 'faltas_debido_proceso' | 'bienestar_ruta'>('derechos');
  const [scenario, setScenario] = useState('');
  const [questionText, setQuestionText] = useState('');
  const [optionA, setOptionA] = useState('');
  const [optionB, setOptionB] = useState('');
  const [optionC, setOptionC] = useState('');
  const [optionD, setOptionD] = useState('');
  const [correctId, setCorrectId] = useState('a');
  const [explanation, setExplanation] = useState('');
  const [regulationReference, setRegulationReference] = useState('');

  const handleAddQuestion = (e: React.FormEvent) => {
    e.preventDefault();
    if (!questionText.trim() || !optionA.trim() || !optionB.trim() || !explanation.trim()) return;

    const newQ: QuizQuestion = {
      id: `q-${Date.now()}`,
      category,
      scenario: scenario.trim() || undefined,
      question: questionText.trim(),
      options: [
        { id: 'a', text: optionA.trim() },
        { id: 'b', text: optionB.trim() },
        { id: 'c', text: optionC.trim() || 'No aplica' },
        { id: 'd', text: optionD.trim() || 'Todas las anteriores' },
      ],
      correctAnswerId: correctId,
      explanation: explanation.trim(),
      regulationReference: regulationReference.trim() || 'Reglamento del Aprendiz SENA',
    };

    const updated = [...questions, newQ];
    onUpdateQuestions(updated);
    soundFx.playSuccessChime();
    setShowAddForm(false);

    // Reset form
    setScenario('');
    setQuestionText('');
    setOptionA('');
    setOptionB('');
    setOptionC('');
    setOptionD('');
    setExplanation('');
    setRegulationReference('');
  };

  const handleDeleteQuestion = (id: string) => {
    if (questions.length <= 4) {
      alert('Debe haber al menos 4 preguntas en el banco de evaluación.');
      return;
    }
    const updated = questions.filter((q) => q.id !== id);
    onUpdateQuestions(updated);
  };

  return (
    <div className="max-w-5xl mx-auto py-8 px-4 sm:px-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div className="flex items-start gap-4">
          <SenaLogo className="w-10 h-10 mt-1 shrink-0" />
          <div>
            <div className="flex items-center gap-2 text-xs text-slate-500 mb-1">
              <span>Coordinación Académica</span>
              <span aria-hidden="true">·</span>
              <span>Evaluación de Conocimientos</span>
              <span aria-hidden="true">·</span>
              <span>{questions.length} preguntas activas</span>
            </div>
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
              Banco de Preguntas para Inducción SENA
            </h1>
            <p className="text-xs text-slate-600 mt-0.5">
              Administra los casos de estudio y reactivos de selección múltiple con retroalimentación formativa y soporte reglamentario.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowAddForm(!showAddForm)}
            className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold rounded-lg bg-[#39A900] hover:bg-[#329600] text-white transition-colors cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>{showAddForm ? 'Cancelar' : 'Agregar Nueva Pregunta'}</span>
          </button>
        </div>
      </div>

      {/* Add Question Form */}
      {showAddForm && (
        <form
          onSubmit={handleAddQuestion}
          className="bg-white rounded-2xl border border-emerald-300 p-6 shadow-sm space-y-4 text-xs"
        >
          <div className="font-bold text-sm text-slate-900 pb-2 border-b border-slate-100 flex items-center justify-between">
            <span>Formular Nuevo Reactivo Evaluativo</span>
            <span className="text-xs text-emerald-700 font-semibold">Reglamento del Aprendiz</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Categoría Temática</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as any)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#39A900]"
              >
                <option value="identidad">Identidad y Símbolos</option>
                <option value="derechos">Derechos del Aprendiz (Art. 7)</option>
                <option value="deberes">Deberes y Convivencia (Art. 9)</option>
                <option value="faltas_debido_proceso">Faltas, Deserción y Debido Proceso</option>
                <option value="bienestar_ruta">Bienestar y Etapa Productiva</option>
              </select>
            </div>
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Referencia Normativa *</label>
              <input
                type="text"
                placeholder="Ej: Reglamento del Aprendiz, Artículo 9, Numeral 4"
                value={regulationReference}
                onChange={(e) => setRegulationReference(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#39A900]"
                required
              />
            </div>
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">
              Caso Situacional (Opcional - Contexto de la vida en el SENA)
            </label>
            <textarea
              rows={2}
              placeholder="Ej: Durante la etapa lectiva, un aprendiz necesita ausentarse 3 días por quebrantos de salud..."
              value={scenario}
              onChange={(e) => setScenario(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#39A900]"
            />
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">Pregunta Principal *</label>
            <input
              type="text"
              required
              placeholder="Ej: ¿Cuál es el plazo reglamentario para justificar formalmente una inasistencia?"
              value={questionText}
              onChange={(e) => setQuestionText(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#39A900]"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Opción A *</label>
              <input
                type="text"
                required
                value={optionA}
                onChange={(e) => setOptionA(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#39A900]"
              />
            </div>
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Opción B *</label>
              <input
                type="text"
                required
                value={optionB}
                onChange={(e) => setOptionB(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#39A900]"
              />
            </div>
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Opción C</label>
              <input
                type="text"
                value={optionC}
                onChange={(e) => setOptionC(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#39A900]"
              />
            </div>
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Opción D</label>
              <input
                type="text"
                value={optionD}
                onChange={(e) => setOptionD(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#39A900]"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Opción Correcta *</label>
              <select
                value={correctId}
                onChange={(e) => setCorrectId(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#39A900]"
              >
                <option value="a">Opción A</option>
                <option value="b">Opción B</option>
                <option value="c">Opción C</option>
                <option value="d">Opción D</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">
              Retroalimentación Pedagógica Explicativa *
            </label>
            <textarea
              rows={2}
              required
              placeholder="Explica pedagógicamente al aprendiz por qué esta es la respuesta adecuada y cómo fortalece su proceso."
              value={explanation}
              onChange={(e) => setExplanation(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#39A900]"
            />
          </div>

          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={() => setShowAddForm(false)}
              className="px-4 py-2 font-semibold text-slate-600 hover:bg-slate-100 rounded-lg"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-4 py-2 font-semibold text-white bg-[#39A900] hover:bg-[#329600] rounded-lg cursor-pointer"
            >
              Guardar Pregunta en el Banco
            </button>
          </div>
        </form>
      )}

      {/* List of Questions */}
      <div className="space-y-4">
        {questions.map((q, idx) => (
          <div
            key={q.id}
            className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs space-y-3"
          >
            <div className="flex items-center justify-between text-xs text-slate-500">
              <div className="flex items-center gap-2">
                <span className="font-bold text-slate-900">Pregunta {idx + 1}</span>
                <span aria-hidden="true">·</span>
                <span className="capitalize text-emerald-800 font-medium">{q.category.replace('_', ' ')}</span>
                <span aria-hidden="true">·</span>
                <span className="text-slate-400 font-mono">{q.regulationReference}</span>
              </div>
              <button
                onClick={() => handleDeleteQuestion(q.id)}
                title="Eliminar pregunta"
                className="p-1 text-slate-400 hover:text-red-600 transition-colors cursor-pointer"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>

            {q.scenario && (
              <div className="p-2.5 rounded-lg bg-slate-50 text-slate-600 text-xs italic">
                Caso: {q.scenario}
              </div>
            )}

            <div className="text-sm font-bold text-slate-900">
              {q.question}
            </div>

            {/* Options list */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
              {q.options.map((opt) => {
                const isCorrect = opt.id === q.correctAnswerId;
                return (
                  <div
                    key={opt.id}
                    className={`p-2.5 rounded-lg border flex items-center justify-between ${
                      isCorrect
                        ? 'border-emerald-300 bg-emerald-50/70 font-semibold text-emerald-950'
                        : 'border-slate-200 bg-white text-slate-700'
                    }`}
                  >
                    <span>{opt.id.toUpperCase()}. {opt.text}</span>
                    {isCorrect && (
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 ml-2" />
                    )}
                  </div>
                );
              })}
            </div>

            {/* Explanation */}
            <div className="text-[11px] text-slate-600 pt-2 border-t border-slate-100">
              <span className="font-semibold text-slate-800">Sustento Pedagógico: </span>
              {q.explanation}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
