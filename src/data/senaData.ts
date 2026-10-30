import { Ficha, Apprentice, InductionModule, QuizQuestion, MatchingChallenge } from '../types/induction';

export const INITIAL_FICHAS: Ficha[] = [
  {
    id: 'f-2824910',
    code: '2824910',
    programName: 'Análisis y Desarrollo de Software (ADSO)',
    level: 'Tecnólogo',
    centerName: 'Centro de Formación Técnica y Tecnológica',
    regional: 'Regional Distrito Capital',
    instructorLeader: 'Ing. Carlos Alberto Morales',
    startDate: '2026-02-15',
    totalApprentices: 28,
  },
  {
    id: 'f-2718920',
    code: '2718920',
    programName: 'Gestión Contable y de Información Financiera',
    level: 'Tecnólogo',
    centerName: 'Centro de Servicios y Gestión Empresarial',
    regional: 'Regional Antioquia',
    instructorLeader: 'Dra. María Elena Restrepo',
    startDate: '2026-02-18',
    totalApprentices: 24,
  },
  {
    id: 'f-2901422',
    code: '2901422',
    programName: 'Mantenimiento Mecatrónico y Robótica',
    level: 'Tecnólogo',
    centerName: 'Centro de Electricidad y Automatización Industrial',
    regional: 'Regional Valle',
    instructorLeader: 'Ing. Fernando Gómez',
    startDate: '2026-03-01',
    totalApprentices: 22,
  },
];

export const INITIAL_APPRENTICES: Apprentice[] = [
  {
    id: 'app-01',
    name: 'Valentina Rodríguez Sierra',
    documentType: 'CC',
    documentNumber: '1023948512',
    email: 'vrodriguez@soy.sena.edu.co',
    phone: '312 458 9012',
    fichaId: 'f-2824910',
    progressPercent: 100,
    completedModules: ['mod-identidad', 'mod-reglamento-derechos', 'mod-reglamento-deberes', 'mod-bienestar', 'mod-ruta'],
    evaluationScore: 92,
    evaluationPassed: true,
    evaluationAttempts: 1,
    evaluationDate: '2026-10-25 14:32',
    commitmentSigned: true,
    commitmentDate: '2026-10-25',
    certificateCode: 'SENA-IND-2026-VR891',
    status: 'completado',
  },
  {
    id: 'app-02',
    name: 'Juan David Henao Ospina',
    documentType: 'TI',
    documentNumber: '1098234710',
    email: 'jdhenao@soy.sena.edu.co',
    phone: '315 789 2314',
    fichaId: 'f-2824910',
    progressPercent: 80,
    completedModules: ['mod-identidad', 'mod-reglamento-derechos', 'mod-reglamento-deberes', 'mod-bienestar'],
    evaluationScore: 68,
    evaluationPassed: false,
    evaluationAttempts: 1,
    evaluationDate: '2026-10-26 10:15',
    commitmentSigned: false,
    status: 'requiere_refuerzo',
  },
  {
    id: 'app-03',
    name: 'Camila Andrea Torres Méndez',
    documentType: 'CC',
    documentNumber: '1014876543',
    email: 'catorres@soy.sena.edu.co',
    phone: '320 654 3218',
    fichaId: 'f-2824910',
    progressPercent: 60,
    completedModules: ['mod-identidad', 'mod-reglamento-derechos', 'mod-reglamento-deberes'],
    evaluationAttempts: 0,
    commitmentSigned: false,
    status: 'en_progreso',
  },
  {
    id: 'app-04',
    name: 'Mateo Alejandro Vargas Silva',
    documentType: 'CC',
    documentNumber: '1032987112',
    email: 'mavargas@soy.sena.edu.co',
    phone: '311 987 6543',
    fichaId: 'f-2824910',
    progressPercent: 100,
    completedModules: ['mod-identidad', 'mod-reglamento-derechos', 'mod-reglamento-deberes', 'mod-bienestar', 'mod-ruta'],
    evaluationScore: 96,
    evaluationPassed: true,
    evaluationAttempts: 1,
    evaluationDate: '2026-10-26 16:40',
    commitmentSigned: true,
    commitmentDate: '2026-10-26',
    certificateCode: 'SENA-IND-2026-MV412',
    status: 'completado',
  },
  {
    id: 'app-05',
    name: 'Daniela Sofía Castro Rojas',
    documentType: 'CC',
    documentNumber: '1088741256',
    email: 'dscastro@soy.sena.edu.co',
    phone: '318 234 5678',
    fichaId: 'f-2824910',
    progressPercent: 20,
    completedModules: ['mod-identidad'],
    evaluationAttempts: 0,
    commitmentSigned: false,
    status: 'en_progreso',
  },
  {
    id: 'app-06',
    name: 'Sebastián Morales Pardo',
    documentType: 'CC',
    documentNumber: '1075632190',
    email: 'smoralesp@soy.sena.edu.co',
    phone: '314 555 8899',
    fichaId: 'f-2824910',
    progressPercent: 0,
    completedModules: [],
    evaluationAttempts: 0,
    commitmentSigned: false,
    status: 'no_iniciado',
  },
];

export const SENA_INSTITUTIONAL_INFO = {
  name: 'Servicio Nacional de Aprendizaje - SENA',
  motto: 'Conocimiento y emprendimiento para todos los colombianos',
  foundedYear: '1957',
  founder: 'Rodolfo Martínez Tono',
  mission:
    'El SENA está encargado de cumplir la función que le corresponde al Estado de invertir en el desarrollo social y técnico de los trabajadores colombianos, ofreciendo y ejecutando la formación profesional integral, para la incorporación y el desarrollo de las personas en actividades productivas que contribuyan al desarrollo social, económico y tecnológico del país.',
  vision:
    'En el 2026, el SENA se consolidará como una entidad referente de formación integral para el trabajo, con innovación tecnológica, inclusión social y pertinencia, fortaleciendo el tejido empresarial y la empleabilidad de los colombianos.',
  symbols: [
    {
      name: 'El Escudo',
      meaning:
        'Representa los tres sectores de la economía nacional: la rueda dentada (sector industria y construcción), el caduceo (sector comercio y servicios) y la espiga de café (sector primario y extractivo).',
      highlight: 'Sectores Económicos de Colombia',
    },
    {
      name: 'La Bandera',
      meaning:
        'Su fondo blanco simboliza la paz, la transparencia, la armonía y la tranquilidad que el SENA promueve en toda Colombia. Lleva en el centro el escudo oficial en verde institucional.',
      highlight: 'Paz y Transparencia',
    },
    {
      name: 'El Logo-símbolo',
      meaning:
        'Diseñado en la década de 1970, representa al aprendiz que va por un sendero hacia el futuro, erguido, superando barreras con conocimiento y trabajo, proyectándose a la sociedad.',
      highlight: 'El Aprendiz caminando hacia el futuro',
    },
  ],
  values: [
    { name: 'Respeto', description: 'Reconocimiento y valoración de la dignidad y diversidad de todas las personas.' },
    { name: 'Librepensamiento y Actitud Crítica', description: 'Capacidad de discernir, proponer y construir con criterio propio constructivo.' },
    { name: 'Liderazgo', description: 'Iniciativa y compromiso para impulsar cambios positivos en el entorno laboral y social.' },
    { name: 'Solidaridad', description: 'Cooperación activa y empatía con los compañeros y la comunidad educativa.' },
    { name: 'Justicia y Equidad', description: 'Igualdad de oportunidades y rectitud en las decisiones y valoraciones.' },
    { name: 'Transparencia', description: 'Honestidad, veracidad y rectitud en cada actuación académica y personal.' },
    { name: 'Creatividad e Innovación', description: 'Búsqueda constante de soluciones eficaces a los desafíos productivos.' },
  ],
  hymn: {
    chorus: 'Estudiantes del SENA, ¡adelante!\nPor Colombia luchad con amor,\ncon el ánimo noble y constante\nque la patria en nosotros confió.',
    stanzas: [
      {
        number: 1,
        lyrics:
          'Hoy la patria nos llama a la lucha,\ncon empuje de fuerza y vigor,\nen el campo o taller o en la industria\nes el triunfo del noble valor.',
      },
      {
        number: 2,
        lyrics:
          'En la forja del alma templada\npor la ciencia, el trabajo y la fe,\nlevantemos la frente serena\ny el progreso triunfante se ve.',
      },
      {
        number: 3,
        lyrics:
          'Nuestras manos unidas al ritmo\nde los pueblos que marchan en pos,\nde la paz, la justicia y la gloria,\nbajo el cielo bendito de Dios.',
      },
    ],
  },
};

export const INDUCTION_MODULES: InductionModule[] = [
  {
    id: 'mod-identidad',
    title: 'Identidad Institucional SENA',
    subtitle: 'Historia, Misión, Visión, Símbolos y Valores',
    estimatedMinutes: 15,
    category: 'identidad',
    summary:
      'Comprende el origen del SENA desde 1957 por Rodolfo Martínez Tono, su impacto en Colombia, los tres símbolos emblemáticos y los 7 valores éticos que rigen la comunidad.',
    topics: [
      {
        id: 'top-origen',
        title: 'Historia y Propósito Fundacional',
        content:
          'El SENA nació en 1957 bajo la iniciativa del economista Rodolfo Martínez Tono, respaldado por sindicatos y empresarios colombianos. Su meta: capacitar técnicamente a los trabajadores colombianos y brindar oportunidades a todos los estratos socioeconómicos.',
        keyTakeaway: 'El SENA es educación pública, gratuita y de calidad que transforma vidas en los 32 departamentos de Colombia.',
        badgeLabel: 'Fundación 1957',
        actionableTips: [
          'La formación en el SENA es 100% gratuita y no requiere intermediarios.',
          'El SENA articula la formación técnica con las necesidades reales del sector productivo nacional.',
        ],
      },
      {
        id: 'top-simbolos',
        title: 'Los Tres Símbolos Institucionales',
        content:
          'El Escudo congrega los tres sectores de la economía colombiana (primario/agropecuario, secundario/industrial y terciario/servicios). La Bandera blanca proclama la paz y armonía. El Logo-símbolo plasma al aprendiz que avanza con paso firme hacia el horizonte.',
        keyTakeaway: 'Cada símbolo encarna la responsabilidad social del aprendiz frente al país.',
        badgeLabel: 'Escudo, Bandera y Logo-símbolo',
      },
      {
        id: 'top-valores',
        title: 'Decálogo de Valores del Aprendiz',
        content:
          'Respeto, librepensamiento, liderazgo, solidaridad, justicia, transparencia y creatividad son los pilares éticos no negociables en cada ambiente de aprendizaje presencial o virtual.',
        keyTakeaway: 'Ser aprendiz SENA es un estilo de vida fundamentado en la ética profesional.',
        badgeLabel: 'Ética y Valores',
      },
    ],
  },
  {
    id: 'mod-reglamento-derechos',
    title: 'Reglamento: Derechos del Aprendiz',
    subtitle: 'Acuerdo 009 de 2024 - Tus Garantías Formativas',
    estimatedMinutes: 20,
    category: 'reglamento',
    summary:
      'Conoce a fondo las garantías académicas, acceso a bienestar, derecho a la defensa y debido proceso que te respaldan en cada momento de tu formación.',
    topics: [
      {
        id: 'top-derechos-academicos',
        title: 'Derechos Académicos y Evaluación',
        content:
          'Tienes derecho a recibir inducción completa, conocer oportunamente el diseño curricular, la programación formativa y las rubricas de evaluación. Tienes derecho a conocer tus calificaciones a tiempo y solicitar revisión justificada dentro de los 2 días hábiles siguientes.',
        keyTakeaway: 'Transparencia pedagógica: siempre debes saber qué se evalúa y bajo qué criterios objetivos.',
        badgeLabel: 'Artículo 7 - Derechos',
        actionableTips: [
          'Puedes solicitar revisión por escrito si consideras que una calificación no corresponde a la evidencia.',
          'El instructor debe concertar el plan de formación al inicio de cada resultado de aprendizaje.',
        ],
      },
      {
        id: 'top-derechos-representacion',
        title: 'Representación, Vocería y Participación',
        content:
          'Cada ficha elige democráticamente a su Vocero de Aprendices para representarlos ante el Comité de Evaluación y el Centro. Además, puedes postularte como Representante de Aprendices del Centro ante el Consejo Directivo.',
        keyTakeaway: 'Voz activa en la toma de decisiones institucionales.',
        badgeLabel: 'Liderazgo y Vocería',
      },
      {
        id: 'top-derechos-bienestar',
        title: 'Acceso a Bienestar y Apoyos',
        content:
          'Derecho a disfrutar de actividades deportivas, culturales, de salud preventiva, orientación psicosocial y postularte a apoyos de sostenimiento (FIC, monitorías, auxilio de transporte o alimentación según convocatorias).',
        keyTakeaway: 'Formación holística que cuida tu mente, cuerpo y bienestar socioeconómico.',
        badgeLabel: 'Bienestar Integral',
      },
    ],
  },
  {
    id: 'mod-reglamento-deberes',
    title: 'Reglamento: Deberes, Faltas y Medidas',
    subtitle: 'Compromiso Ético, Convivencia y Régimen Disciplinario',
    estimatedMinutes: 25,
    category: 'reglamento',
    summary:
      'Identifica tus responsabilidades: porte de carné, asistencia, cuidado de infraestructura, clasificación de faltas, debido proceso y medidas formativas.',
    topics: [
      {
        id: 'top-deberes-principales',
        title: 'Deberes Fundamentales y Convivencia',
        content:
          'Portar permanentemente el carné institucional en lugar visible, vestir la indumentaria o elementos de protección personal (EPP) según el taller, asistir puntualmente a todas las sesiones y cuidar equipos e instalaciones.',
        keyTakeaway: 'La disciplina y la puntualidad son competencias laborales primordiales para la industria.',
        badgeLabel: 'Artículo 9 - Deberes',
      },
      {
        id: 'top-faltas-desercion',
        title: 'Faltas Académicas, Disciplinarias y Deserción',
        content:
          'Las faltas pueden ser leves, graves o gravísimas (ej: plagio, porte de armas, consumo de sustancias, agresiones). La deserción se configura cuando un aprendiz acumula 3 días consecutivos de inasistencia injustificada sin soporte médico o justificación válida dentro de los 3 días hábiles siguientes.',
        keyTakeaway: 'Si tienes una emergencia, notifica formalmente a tu instructor dentro de los 3 días hábiles.',
        badgeLabel: 'Artículo 22 - Deserción',
        actionableTips: [
          'La incapacidad médica debe ser expedida por la EPS o validada debidamente.',
          'La deserción genera bloqueo en el sistema por un periodo de hasta seis (6) meses según normativa.',
        ],
      },
      {
        id: 'top-medidas-formativas',
        title: 'Medidas Formativas vs Sanciones',
        content:
          'Las medidas formativas buscan corregir y fortalecer (llamado de atención verbal pedagógico, plan de mejoramiento académico o disciplinario). Las sanciones se aplican tras Comité con debido proceso (llamado por escrito, condicionamiento de matrícula o cancelación de matrícula).',
        keyTakeaway: 'El debido proceso garantiza derecho a la defensa y presentación de descargos.',
        badgeLabel: 'Comité de Evaluación',
      },
    ],
  },
  {
    id: 'mod-bienestar',
    title: 'Bienestar al Aprendiz y Servicios',
    subtitle: 'Salud, Cultura, Deportes, SENNOVA y Emprendimiento',
    estimatedMinutes: 15,
    category: 'bienestar',
    summary:
      'Explora el portafolio integral de Bienestar: apoyos de sostenimiento, monitorías académicas, semilleros de investigación SENNOVA y el Fondo Emprender.',
    topics: [
      {
        id: 'top-apoyos-economicos',
        title: 'Apoyos de Sostenimiento y Monitorías',
        content:
          'Los aprendices en situación de vulnerabilidad de estratos 1 y 2 que no tengan contrato de aprendizaje pueden postularse a los Apoyos de Sostenimiento Regular o FIC. Además, los aprendices con rendimiento sobresaliente pueden ser Monitores remunerados.',
        keyTakeaway: 'Apoyos diseñados para garantizar la permanencia y graduación exitosa de los aprendices.',
        badgeLabel: 'Convocatorias de Bienestar',
      },
      {
        id: 'top-sennova-emprender',
        title: 'Investigación SENNOVA y Fondo Emprender',
        content:
          'En SENNOVA puedes vincularte a semilleros de investigación aplicada, desarrollo tecnológico y patentes. Si tienes una idea de negocio, el Centro de Desarrollo Empresarial (SBDC) y Fondo Emprender te brindan capital semilla no reembolsable.',
        keyTakeaway: 'Transforma tus proyectos de formación en patentes o empresas viables.',
        badgeLabel: 'Innovación y Emprendimiento',
      },
    ],
  },
  {
    id: 'mod-ruta',
    title: 'Ruta Formativa y Etapa Productiva',
    subtitle: 'Formación por Proyectos, Sofia Plus / Zajuna y Alternativas de Práctica',
    estimatedMinutes: 20,
    category: 'ruta',
    summary:
      'Comprende el ciclo formativo completo: etapa lectiva mediante proyectos reales y las 5 alternativas oficiales para desarrollar tu etapa productiva en la empresa.',
    topics: [
      {
        id: 'top-fpi-proyectos',
        title: 'Formación Profesional Integral (FPI)',
        content:
          'El modelo pedagógico SENA no es memorístico: se basa en competencias laborales y aprendizaje por proyectos donde resuelves problemas auténticos de la industria a lo largo de 4 a 6 trimestres lectivos.',
        keyTakeaway: 'Aprender haciendo: teoría aplicada de forma directa a la práctica real.',
        badgeLabel: 'Modelo por Competencias',
      },
      {
        id: 'top-etapa-productiva',
        title: 'Alternativas de Etapa Productiva',
        content:
          'Existen 5 modalidades reconocidas: 1) Contrato de Aprendizaje (vía SGVA), 2) Vínculo Laboral o contractual, 3) Proyecto Productivo institucional o empresarial, 4) Pasantía o práctica comunitaria/estatal, 5) Monitoría en el centro de formación.',
        keyTakeaway: 'Debes concertar y legalizar tu modalidad productiva antes de iniciar.',
        badgeLabel: '5 Modalidades Productivas',
        actionableTips: [
          'Regístrate en el Sistema de Gestión Virtual de Aprendices (SGVA) para postularte a empresas.',
          'La etapa productiva cuenta con el acompañamiento de un instructor de seguimiento.',
        ],
      },
    ],
  },
];

export const QUIZ_QUESTIONS: QuizQuestion[] = [
  {
    id: 'q1',
    category: 'identidad',
    scenario:
      'Durante un recorrido de bienvenida, el instructor pregunta sobre el significado de los elementos visuales que identifican al SENA en todo el país.',
    question: '¿Qué representa específicamente el Logo-símbolo institucional del SENA?',
    options: [
      { id: 'a', text: 'Una fábrica industrial automatizada con chimeneas y engranajes.' },
      { id: 'b', text: 'Un aprendiz caminando erguido por un sendero hacia el futuro, superando obstáculos.' },
      { id: 'c', text: 'Tres montañas colombianas que representan las cordilleras andinas.' },
      { id: 'd', text: 'Un libro abierto con una antorcha encendida en el centro.' },
    ],
    correctAnswerId: 'b',
    explanation:
      'El logo-símbolo representa la silueta de un aprendiz avanzando con decisión por un camino que se proyecta al porvenir, simbolizando la superación personal y la mirada firme hacia el desarrollo del país.',
    regulationReference: 'Manual de Identidad Visual SENA, Sección Símbolos Institucionales',
  },
  {
    id: 'q2',
    category: 'identidad',
    scenario:
      'Un grupo de nuevos aprendices investiga sobre los sectores productivos que impulsan la economía colombiana y cómo se reflejan en la institución.',
    question: 'En el Escudo del SENA, ¿qué sectores económicos están representados por la rueda dentada y el caduceo?',
    options: [
      { id: 'a', text: 'La rueda representa la industria/construcción y el caduceo representa el comercio/servicios.' },
      { id: 'b', text: 'La rueda representa la agricultura y el caduceo representa la medicina militar.' },
      { id: 'c', text: 'La rueda representa el transporte aéreo y el caduceo el sector financiero.' },
      { id: 'd', text: 'Ambos representan exclusivamente el sector minero y energético.' },
    ],
    correctAnswerId: 'a',
    explanation:
      'El escudo integra los tres sectores económicos: la rueda dentada (industria y construcción), el caduceo (comercio y servicios) y la rama con espiga/café (sector agropecuario y extractivo).',
    regulationReference: 'Estatuto Docente y Simbología Institucional SENA',
  },
  {
    id: 'q3',
    category: 'derechos',
    scenario:
      'Carlos recibió una calificación "D" (No Aprobado) en una evidencia de aprendizaje y considera que sus entregables cumplían cabalmente con la rúbrica concertada.',
    question: 'Según el Reglamento del Aprendiz, ¿cuál es el procedimiento y plazo para solicitar la revisión de una evaluación?',
    options: [
      { id: 'a', text: 'Debe interponer una demanda civil dentro de los 30 días calendario siguientes.' },
      { id: 'b', text: 'Solicitar por escrito la revisión debidamente motivada ante el instructor dentro de los dos (2) días hábiles siguientes.' },
      { id: 'c', text: 'Esperar a que finalice el año lectivo para apelar ante la Dirección General.' },
      { id: 'd', text: 'No existe derecho a revisión ya que la decisión del instructor es irrevocable.' },
    ],
    correctAnswerId: 'b',
    explanation:
      'El Artículo 7 del Reglamento estipula que el aprendiz puede solicitar al instructor la revisión de sus evaluaciones dentro de los dos (2) días hábiles siguientes a la publicación de las notas. Si subsiste el desacuerdo, puede acudir al Coordinador Académico para nombrar un segundo evaluador.',
    regulationReference: 'Reglamento del Aprendiz SENA (Acuerdo 009/2024), Artículo 7, Numeral 5',
  },
  {
    id: 'q4',
    category: 'deberes',
    scenario:
      'Un aprendiz ingresa a los talleres de robótica y manufactura sin su carné institucional y en calzado informal abierto (sandalias), argumentando que olvidó sus implementos en casa.',
    question: '¿Qué deber reglamentario está incumpliendo este aprendiz?',
    options: [
      { id: 'a', text: 'Ninguno, el uso del carné y botas de seguridad es opcional para los aprendices matriculados.' },
      { id: 'b', text: 'Portar permanentemente el carné en lugar visible y vestir los Elementos de Protección Personal (EPP) reglamentarios.' },
      { id: 'c', text: 'Únicamente el deber de llegar temprano los días lunes.' },
      { id: 'd', text: 'El deber de traer refrigerio propio al ambiente de aprendizaje.' },
    ],
    correctAnswerId: 'b',
    explanation:
      'El Artículo 9 establece como deberes ineludibles portar de forma visible el carné institucional que lo identifica como aprendiz SENA y hacer uso de los elementos de seguridad y prendas adecuadas requeridas para el ingreso seguro a talleres y laboratorios.',
    regulationReference: 'Reglamento del Aprendiz SENA, Artículo 9, Numerales 4 y 7',
  },
  {
    id: 'q5',
    category: 'faltas_debido_proceso',
    scenario:
      'Andrés ha faltado a su formación durante tres (3) días hábiles consecutivos sin comunicarse con su instructor ni presentar justificación médica o laboral.',
    question: 'En este caso, ¿qué causal reglamentaria se configura y qué procedimiento debe adelantar el centro?',
    options: [
      { id: 'a', text: 'Se le premia con una semana de descanso adicional.' },
      { id: 'b', text: 'Se configura causal de deserción; el centro enviará comunicación solicitando justificar en máximo 5 días hábiles antes de cancelar matrícula.' },
      { id: 'c', text: 'El centro le traslada automáticamente a otra regional sin consultarle.' },
      { id: 'd', text: 'Se le asigna inmediatamente un contrato de aprendizaje obligatorio.' },
    ],
    correctAnswerId: 'b',
    explanation:
      'El Artículo 22 tipifica como deserción la inasistencia injustificada durante tres (3) días continuos. El Coordinador emite un requerimiento al aprendiz para que presente soportes válidos; si no responde en el término legal, se procede con la cancelación de matrícula respetando el debido proceso.',
    regulationReference: 'Reglamento del Aprendiz SENA, Artículo 22 (Deserción)',
  },
  {
    id: 'q6',
    category: 'faltas_debido_proceso',
    scenario:
      'Mariana fue remitida a Comité de Evaluación y Seguimiento por una falta disciplinaria. Ella desea saber qué garantías procesales tiene durante la audiencia.',
    question: '¿Cuál de las siguientes afirmaciones describe el Debido Proceso en el SENA?',
    options: [
      { id: 'a', text: 'La sanción se aplica sin escuchar a la persona ni permitirle ver las pruebas en su contra.' },
      { id: 'b', text: 'Tiene derecho a ser notificada previamente de los cargos, presentar descargos, aportar pruebas y ejercer el recurso de reposición.' },
      { id: 'c', text: 'El comité es secreto y no queda constancia en acta escrita.' },
      { id: 'd', text: 'Solo los instructores pueden hablar durante la sesión del comité.' },
    ],
    correctAnswerId: 'b',
    explanation:
      'El Capítulo IX del Reglamento garantiza el Debido Proceso: presunción de inocencia, notificación formal por escrito de los hechos, derecho a presentar descargos y pruebas, y posibilidad de radicar recurso de reposición frente a la decisión del Subdirector de Centro.',
    regulationReference: 'Reglamento del Aprendiz SENA, Artículos 29 al 35 (Procedimiento para Sanciones)',
  },
  {
    id: 'q7',
    category: 'bienestar_ruta',
    scenario:
      'Felipe finalizó su etapa lectiva de 4 trimestres y se prepara para aplicar sus conocimientos en el mundo productivo real.',
    question: '¿Cuál de las siguientes opciones NO constituye una alternativa válida para realizar la Etapa Productiva en el SENA?',
    options: [
      { id: 'a', text: 'Contrato de Aprendizaje patrocinado por una empresa a través del SGVA.' },
      { id: 'b', text: 'Vínculo laboral o contractual relacionado directamente con el programa de formación.' },
      { id: 'c', text: 'Proyecto Productivo o apoyo a una Unidad Productiva del SENNOVA / Fondo Emprender.' },
      { id: 'd', text: 'Trabajar como vendedor informal en una actividad no relacionada con su carrera técnica sin concertar con el SENA.' },
    ],
    correctAnswerId: 'd',
    explanation:
      'Las alternativas de etapa productiva deben estar directamente vinculadas a las competencias del programa y avaladas formalmente por el Centro de Formación (Contrato de aprendizaje, vínculo laboral, proyecto productivo, pasantía o monitoría).',
    regulationReference: 'Reglamento del Aprendiz SENA, Artículo 12 (Alternativas de Etapa Productiva)',
  },
  {
    id: 'q8',
    category: 'bienestar_ruta',
    scenario:
      'Una aprendiz requiere orientación psicosocial por una situación personal difícil y además desea postularse a una beca de sostenimiento económico.',
    question: '¿A qué dependencia del Centro de Formación debe acudir para acceder a estos beneficios institucionales?',
    options: [
      { id: 'a', text: 'A la Oficina de Bienestar al Aprendiz del Centro.' },
      { id: 'b', text: 'A la portería principal del complejo educativo.' },
      { id: 'c', text: 'Al Ministerio de Hacienda en Bogotá.' },
      { id: 'd', text: 'A la estación de policía más cercana.' },
    ],
    correctAnswerId: 'a',
    explanation:
      'Bienestar al Aprendiz es el área encargada de brindar acompañamiento en salud mental, deporte, cultura, apoyos económicos (FIC, sostenimiento regular) y velar por la permanencia exitosa de los aprendices durante todo su ciclo formativo.',
    regulationReference: 'Plan Nacional de Bienestar al Aprendiz SENA',
  },
];

export const MATCHING_CHALLENGES: MatchingChallenge[] = [
  {
    id: 'mc1',
    concept: 'Recibir oportunamente el carné institucional y los elementos de protección personal (EPP) requeridos.',
    correctCategory: 'Derecho',
    description: 'Garantía fundamental para la seguridad y la identificación digna del aprendiz en el SENA.',
  },
  {
    id: 'mc2',
    concept: 'Ingresar o comercializar bebidas alcohólicas o sustancias psicoactivas dentro de los centros o ambientes SENA.',
    correctCategory: 'Prohibición',
    description: 'Conducta catalogada como falta gravísima que atenta contra la integridad de la comunidad educativa.',
  },
  {
    id: 'mc3',
    concept: 'Justificar las inasistencias a formación dentro de los tres (3) días hábiles siguientes con el debido soporte médico o laboral.',
    correctCategory: 'Deber',
    description: 'Obligación formal para evitar que se configure causal de deserción de la formación.',
  },
  {
    id: 'mc4',
    concept: 'Participar activamente en los semilleros de investigación SENNOVA, actividades culturales y torneos deportivos.',
    correctCategory: 'Derecho',
    description: 'Facultad de todo aprendiz de formarse de manera integral en ciencia, cultura y bienestar.',
  },
  {
    id: 'mc5',
    concept: 'Plagiar documentos, proyectos, códigos fuente o evidencias de aprendizaje de compañeros o autores externos.',
    correctCategory: 'Prohibición',
    description: 'Falta académica y disciplinaria grave que vulnera la ética y los derechos de autor.',
  },
  {
    id: 'mc6',
    concept: 'Cuidar con esmero las instalaciones, herramientas, maquinaria y recursos físicos puestos a disposición en el taller.',
    correctCategory: 'Deber',
    description: 'Responsabilidad ciudadana para preservar el patrimonio público que beneficia a todos los colombianos.',
  },
];
