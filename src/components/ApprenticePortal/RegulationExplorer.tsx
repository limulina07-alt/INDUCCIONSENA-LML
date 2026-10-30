import React, { useState } from 'react';
import { MATCHING_CHALLENGES } from '../../data/senaData';
import { Search, ShieldAlert, CheckCircle2, BookOpen, AlertTriangle, Scale, RefreshCw } from 'lucide-react';
import { soundFx } from '../../utils/audioSynth';
import { SenaLogo } from '../../assets/senaLogo';

export const RegulationExplorer: React.FC = () => {
  const [activeFilter, setActiveFilter] = useState<'todos' | 'cap1' | 'cap4' | 'cap5' | 'derechos' | 'deberes' | 'desafio'>('todos');
  const [searchTerm, setSearchTerm] = useState('');

  // Interactive Challenge State
  const [challengeAnswers, setChallengeAnswers] = useState<Record<string, 'Derecho' | 'Deber' | 'Prohibición'>>({});
  const [submittedChallenge, setSubmittedChallenge] = useState(false);

  const handleSelectOption = (challengeId: string, option: 'Derecho' | 'Deber' | 'Prohibición') => {
    if (submittedChallenge) return;
    setChallengeAnswers((prev) => ({ ...prev, [challengeId]: option }));
  };

  const handleEvaluateChallenge = () => {
    setSubmittedChallenge(true);
    let correctCount = 0;
    MATCHING_CHALLENGES.forEach((item) => {
      if (challengeAnswers[item.id] === item.correctCategory) {
        correctCount++;
      }
    });

    if (correctCount >= 4) {
      soundFx.playSuccessChime();
    } else {
      soundFx.playErrorChime();
    }
  };

  const handleResetChallenge = () => {
    setChallengeAnswers({});
    setSubmittedChallenge(false);
  };

  const articles = [
    {
      id: 'cap-01',
      category: 'cap1',
      number: 'Capítulo I',
      title: 'Definiciones y Principios Generales',
      summary: 'Marco conceptual, ámbito de aplicación y principios orientadores del Reglamento del Aprendiz SENA (Acuerdo 009 de 2024).',
      items: [
        'Ámbito de aplicación: Rige a todos los aspirantes matriculados en programas de formación profesional integral en modalidades presencial, virtual y a distancia.',
        'Formación Profesional Integral (FPI): Proceso educativo teórico-práctico que desarrolla competencias técnicas, socioemocionales y ciudadanas.',
        'Principios orientadores: Dignidad humana, inclusión social y productiva, libertad con responsabilidad, autonomía y equidad.',
        'Comunidad Educativa: Integrada por aprendices, instructores, coordinadores, personal administrativo y egresados.',
      ],
    },
    {
      id: 'art-07',
      category: 'derechos',
      number: 'Capítulo II - Artículo 7',
      title: 'Derechos del Aprendiz SENA',
      summary: 'Garantías y prerrogativas fundamentales para un proceso de aprendizaje libre y con calidad.',
      items: [
        'Recibir inducción integral sobre la institución y el programa de formación.',
        'Formación profesional acorde al diseño curricular y tecnología de vanguardia.',
        'Conocer previamente los criterios y resultados de evaluación antes de su registro definitivo.',
        'Solicitar revisión justificada de evaluaciones dentro de los dos (2) días hábiles siguientes a la publicación.',
        'Acceso equitativo a los programas y servicios de Bienestar al Aprendiz (salud, deporte, cultura, apoyos).',
        'Elegir y ser elegido democráticamente como Vocero de Ficha o Representante de Centro.',
        'Hacer uso adecuado y oportuno de bibliotecas, ambientes virtuales y talleres del SENA.',
        'Respeto irrestricto a su dignidad, intimidad y libre desarrollo de la personalidad.',
      ],
    },
    {
      id: 'art-09',
      category: 'deberes',
      number: 'Capítulo III - Artículos 9 y 10',
      title: 'Deberes y Prohibiciones del Aprendiz',
      summary: 'Obligaciones éticas, académicas y ciudadanas que aseguran el orden y la sana convivencia.',
      items: [
        'Portar permanentemente en lugar visible el carné institucional dentro de las instalaciones.',
        'Vestir los Elementos de Protección Personal (EPP) y uniforme exigido según las normas del taller.',
        'Asistir puntualmente a todas las actividades formativas teóricas y prácticas programadas.',
        'Justificar inasistencias dentro de los tres (3) días hábiles siguientes con el respectivo soporte.',
        'Cuidar y mantener en perfecto estado equipos, herramientas y la infraestructura física.',
        'Acatar las instrucciones técnicas y directrices formativas de instructores y directivos.',
        'Prohibición de plagio, fraude, porte de sustancias psicoactivas o armas en la institución.',
      ],
    },
    {
      id: 'cap-04',
      category: 'cap4',
      number: 'Capítulo IV',
      title: 'Proceso de Ingreso, Permanencia, Trámites y Certificación',
      summary: 'Normas sobre inscripción, selección, matrícula, traslados, aplazamientos, reingreso, etapas y titulación.',
      items: [
        'Matrícula: Acto formal que vincula al aspirante como aprendiz SENA, aceptando el reglamento y compromisos.',
        'Trámites académicos: Aplazamiento (hasta por el tiempo que falte de formación), traslado de centro/programa y reingreso.',
        'Etapa Lectiva y Productiva: Desarrollo de competencias en centros de formación y posterior aplicación práctica en empresas u otras 4 alternativas.',
        'Requisitos de Certificación: Aprobación de todos los resultados de aprendizaje de las etapas lectiva y productiva, y paz y salvo institucional.',
      ],
    },
    {
      id: 'cap-05',
      category: 'cap5',
      number: 'Capítulo V',
      title: 'Régimen de Faltas, Medidas Formativas, Disciplinarias y Sancionatorias',
      summary: 'Debido proceso, clasificación de faltas (leves, graves, gravísimas), medidas pedagógicas y sanciones.',
      items: [
        'Clasificación de faltas: Académicas o disciplinarias, tipificadas como leves, graves o gravísimas según la afectación.',
        'Medidas Formativas (Pedagógicas): Llamado de atención verbal y plan de mejoramiento académico o disciplinario.',
        'Comité de Evaluación y Seguimiento: Instancia que garantiza el debido proceso, escucha descargos y analiza pruebas.',
        'Medidas Sancionatorias: Llamado de atención por escrito, condicionamiento de matrícula o cancelación definitiva de matrícula.',
        'Recursos: Derecho a interponer recurso de reposición por escrito dentro de los cinco (5) días hábiles siguientes a la decisión.',
      ],
    },
  ];

  const filteredArticles = articles.filter((art) => {
    const matchesCategory =
      activeFilter === 'todos' ||
      (activeFilter === 'cap1' && art.category === 'cap1') ||
      (activeFilter === 'cap4' && art.category === 'cap4') ||
      (activeFilter === 'cap5' && art.category === 'cap5') ||
      (activeFilter === 'derechos' && art.category === 'derechos') ||
      (activeFilter === 'deberes' && art.category === 'deberes');

    const matchesSearch =
      searchTerm.trim() === '' ||
      art.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      art.summary.toLowerCase().includes(searchTerm.toLowerCase()) ||
      art.items.some((item) => item.toLowerCase().includes(searchTerm.toLowerCase()));

    return matchesCategory && matchesSearch;
  });

  return (
    <div className="max-w-6xl mx-auto py-8 px-4 sm:px-6">
      {/* Editorial Header */}
      <div className="mb-6 flex items-start gap-4">
        <SenaLogo className="w-12 h-12 mt-1 shrink-0" />
        <div>
          <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 mb-1">
            <span>Marco Normativo</span>
            <span aria-hidden="true">·</span>
            <span>Acuerdo 009 de 2024</span>
            <span aria-hidden="true">·</span>
            <span>Reglamento del Aprendiz SENA</span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
            Derechos, Deberes y Convivencia (Capítulos 1 a 5)
          </h1>
          <p className="text-sm text-slate-600 dark:text-slate-300 mt-1 max-w-2xl">
            Conoce en detalle los Capítulos I, IV y V junto con todo el marco normativo actualizado del Acuerdo 009 de 2024 que guía tu estancia formativa.
          </p>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 mb-8">
        {/* Interactive Segmented Filter Controls */}
        <div className="flex items-center gap-1 p-1 bg-slate-100 dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 overflow-x-auto">
          <button
            onClick={() => setActiveFilter('todos')}
            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
              activeFilter === 'todos' ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 shadow-xs' : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
            }`}
          >
            Todos
          </button>
          <button
            onClick={() => setActiveFilter('cap1')}
            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
              activeFilter === 'cap1' ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 shadow-xs' : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
            }`}
          >
            Cap. I (Principios)
          </button>
          <button
            onClick={() => setActiveFilter('cap4')}
            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
              activeFilter === 'cap4' ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 shadow-xs' : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
            }`}
          >
            Cap. IV (Permanencia)
          </button>
          <button
            onClick={() => setActiveFilter('cap5')}
            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
              activeFilter === 'cap5' ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 shadow-xs' : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
            }`}
          >
            Cap. V (Faltas/Sanciones)
          </button>
          <button
            onClick={() => setActiveFilter('derechos')}
            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
              activeFilter === 'derechos' ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 shadow-xs' : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
            }`}
          >
            Derechos (Cap. II)
          </button>
          <button
            onClick={() => setActiveFilter('deberes')}
            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
              activeFilter === 'deberes' ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 shadow-xs' : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
            }`}
          >
            Deberes (Cap. III)
          </button>
          <button
            onClick={() => setActiveFilter('desafio')}
            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
              activeFilter === 'desafio'
                ? 'bg-emerald-700 text-white shadow-xs'
                : 'text-emerald-800 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 hover:bg-emerald-100 dark:hover:bg-emerald-900/50'
            }`}
          >
            Desafío Práctico
          </button>
        </div>

        {/* Search Input */}
        {activeFilter !== 'desafio' && (
          <div className="relative min-w-[260px]">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Buscar por palabra clave (ej. matrícula, plagio)..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-xs bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#39A900] focus:border-transparent text-slate-800 dark:text-slate-200 placeholder-slate-400 dark:placeholder-slate-500"
            />
          </div>
        )}
      </div>

      {/* Main Content Area */}
      {activeFilter === 'desafio' ? (
        /* Interactive Matching Sandbox */
        <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-6 shadow-xs transition-colors">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 mb-6 border-b border-slate-100 dark:border-slate-800 gap-3">
            <div>
              <div className="flex items-center gap-2 text-xs text-emerald-700 dark:text-emerald-400 font-semibold mb-1">
                <Scale className="w-4 h-4" />
                <span>Simulador de Casos Reales del Reglamento</span>
              </div>
              <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100">
                ¿Derecho, Deber o Prohibición?
              </h2>
              <p className="text-xs text-slate-600 dark:text-slate-400 mt-0.5">
                Clasifica cada situación cotidiana para comprobar si apropiaste las normas antes de la evaluación oficial.
              </p>
            </div>
            {submittedChallenge && (
              <button
                onClick={handleResetChallenge}
                className="flex items-center gap-1.5 text-xs font-semibold px-3 py-2 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors cursor-pointer"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Reiniciar Desafío</span>
              </button>
            )}
          </div>

          <div className="space-y-4">
            {MATCHING_CHALLENGES.map((item, idx) => {
              const selected = challengeAnswers[item.id];
              const isCorrect = selected === item.correctCategory;

              return (
                <div
                  key={item.id}
                  className={`p-4 rounded-xl border transition-all ${
                    submittedChallenge
                      ? isCorrect
                        ? 'border-emerald-300 dark:border-emerald-800 bg-emerald-50/40 dark:bg-emerald-950/30'
                        : 'border-red-300 dark:border-red-800 bg-red-50/40 dark:bg-red-950/30'
                      : 'border-slate-200 dark:border-slate-800 bg-slate-50/40 dark:bg-slate-800/40 hover:bg-slate-50 dark:hover:bg-slate-800/70'
                  }`}
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
                        <span>Situación {idx + 1} de {MATCHING_CHALLENGES.length}</span>
                        {submittedChallenge && (
                          <>
                            <span aria-hidden="true">·</span>
                            <span className={isCorrect ? 'text-emerald-700 dark:text-emerald-400 font-semibold' : 'text-red-700 dark:text-red-400 font-semibold'}>
                              {isCorrect ? 'Correcto' : `Incorrecto (Es ${item.correctCategory})`}
                            </span>
                          </>
                        )}
                      </div>
                      <p className="text-sm font-medium text-slate-900 dark:text-slate-100 leading-snug">
                        {item.concept}
                      </p>
                      {submittedChallenge && (
                        <p className="text-xs text-slate-600 dark:text-slate-400 mt-1 italic">
                          Fundamento: {item.description}
                        </p>
                      )}
                    </div>

                    {/* Option Buttons */}
                    <div className="flex items-center gap-1.5 shrink-0">
                      {(['Derecho', 'Deber', 'Prohibición'] as const).map((cat) => {
                        const isChosen = selected === cat;
                        return (
                          <button
                            key={cat}
                            disabled={submittedChallenge}
                            onClick={() => handleSelectOption(item.id, cat)}
                            className={`px-3 py-1.5 text-xs font-medium rounded-lg border transition-all cursor-pointer ${
                              isChosen
                                ? cat === 'Derecho'
                                  ? 'bg-blue-600 border-blue-600 text-white'
                                  : cat === 'Deber'
                                  ? 'bg-emerald-700 border-emerald-700 text-white'
                                  : 'bg-rose-700 border-rose-700 text-white'
                                : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:border-slate-300 dark:hover:border-slate-600'
                            }`}
                          >
                            {cat}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
            <span className="text-xs text-slate-500 dark:text-slate-400">
              {Object.keys(challengeAnswers).length} de {MATCHING_CHALLENGES.length} situaciones clasificadas
            </span>
            {!submittedChallenge ? (
              <button
                onClick={handleEvaluateChallenge}
                disabled={Object.keys(challengeAnswers).length < MATCHING_CHALLENGES.length}
                className="px-4 py-2 text-xs font-semibold rounded-lg bg-[#39A900] hover:bg-[#329600] disabled:bg-slate-200 dark:disabled:bg-slate-800 disabled:text-slate-400 text-white transition-colors cursor-pointer"
              >
                Comprobar Mis Respuestas
              </button>
            ) : (
              <div className="text-xs font-bold text-slate-800 dark:text-slate-200">
                Puntaje obtenido: {
                  Object.values(challengeAnswers).filter((ans, i) => ans === MATCHING_CHALLENGES[i].correctCategory).length
                } / {MATCHING_CHALLENGES.length}
              </div>
            )}
          </div>
        </div>
      ) : (
        /* Articles Cards List */
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredArticles.length === 0 ? (
            <div className="col-span-2 py-12 text-center text-slate-500 dark:text-slate-400 text-sm bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800">
              No se encontraron artículos con la palabra clave &quot;{searchTerm}&quot;.
            </div>
          ) : (
            filteredArticles.map((art) => (
              <div
                key={art.id}
                className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-6 flex flex-col justify-between shadow-xs transition-all hover:border-slate-300 dark:hover:border-slate-700"
              >
                <div>
                  <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 mb-2">
                    <span className="font-semibold text-emerald-700 dark:text-emerald-400">{art.number}</span>
                    <span className="capitalize">{art.category}</span>
                  </div>
                  <h3 className="text-base font-bold text-slate-900 dark:text-slate-100 mb-2">
                    {art.title}
                  </h3>
                  <p className="text-xs text-slate-600 dark:text-slate-400 mb-4">
                    {art.summary}
                  </p>
                  <ul className="space-y-2 text-xs text-slate-700 dark:text-slate-300">
                    {art.items.map((it, idx) => (
                      <li key={idx} className="flex items-start gap-2 leading-relaxed">
                        <span className="text-emerald-600 dark:text-emerald-400 font-bold shrink-0">✓</span>
                        <span>{it}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};
