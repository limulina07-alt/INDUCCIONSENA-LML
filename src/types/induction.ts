export type UserRole = 'aprendiz' | 'instructor';

export interface Apprentice {
  id: string;
  name: string;
  documentType: 'CC' | 'TI' | 'CE' | 'PEP';
  documentNumber: string;
  email: string;
  phone: string;
  fichaId: string;
  progressPercent: number;
  completedModules: string[];
  evaluationScore?: number;
  evaluationPassed?: boolean;
  evaluationAttempts: number;
  evaluationDate?: string;
  commitmentSigned: boolean;
  commitmentDate?: string;
  certificateCode?: string;
  status: 'completado' | 'en_progreso' | 'no_iniciado' | 'requiere_refuerzo';
}

export interface Ficha {
  id: string;
  code: string; // e.g. "2824910"
  programName: string; // e.g. "Análisis y Desarrollo de Software (ADSO)"
  level: 'Tecnólogo' | 'Técnico' | 'Especialización Tecnológica';
  centerName: string; // e.g. "Centro de Servicios y Gestión Empresarial"
  regional: string; // e.g. "Regional Antioquia"
  instructorLeader: string;
  startDate: string;
  totalApprentices: number;
}

export interface InductionModule {
  id: string;
  title: string;
  subtitle: string;
  estimatedMinutes: number;
  category: 'identidad' | 'reglamento' | 'bienestar' | 'ruta';
  summary: string;
  topics: {
    id: string;
    title: string;
    content: string;
    keyTakeaway: string;
    badgeLabel?: string;
    actionableTips?: string[];
  }[];
}

export interface QuizQuestion {
  id: string;
  category: 'identidad' | 'derechos' | 'deberes' | 'faltas_debido_proceso' | 'bienestar_ruta';
  scenario?: string; // Situational case study
  question: string;
  options: {
    id: string;
    text: string;
  }[];
  correctAnswerId: string;
  explanation: string; // Pedagogical explanation with reference to SENA regulation
  regulationReference: string; // e.g. "Reglamento del Aprendiz, Artículo 9, Numeral 3"
}

export interface MatchingChallenge {
  id: string;
  concept: string;
  correctCategory: 'Derecho' | 'Deber' | 'Prohibición';
  description: string;
}

export interface EvaluationSubmission {
  apprenticeId: string;
  apprenticeName: string;
  fichaCode: string;
  date: string;
  score: number;
  maxScore: number;
  percentage: number;
  passed: boolean;
  answers: {
    questionId: string;
    selectedOptionId: string;
    isCorrect: boolean;
  }[];
}
