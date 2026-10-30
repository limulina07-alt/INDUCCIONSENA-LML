import { Apprentice, Ficha, QuizQuestion } from '../types/induction';
import { INITIAL_APPRENTICES, INITIAL_FICHAS, QUIZ_QUESTIONS } from '../data/senaData';

const APPRENTICES_KEY = 'sena_induction_apprentices';
const FICHAS_KEY = 'sena_induction_fichas';
const CURRENT_APP_KEY = 'sena_induction_active_apprentice_id';
const QUESTIONS_KEY = 'sena_induction_custom_questions';

export function getStoredFichas(): Ficha[] {
  if (typeof window === 'undefined') return INITIAL_FICHAS;
  const raw = localStorage.getItem(FICHAS_KEY);
  if (!raw) {
    localStorage.setItem(FICHAS_KEY, JSON.stringify(INITIAL_FICHAS));
    return INITIAL_FICHAS;
  }
  try {
    return JSON.parse(raw);
  } catch {
    return INITIAL_FICHAS;
  }
}

export function saveStoredFichas(fichas: Ficha[]) {
  if (typeof window !== 'undefined') {
    localStorage.setItem(FICHAS_KEY, JSON.stringify(fichas));
  }
}

export function getStoredApprentices(): Apprentice[] {
  if (typeof window === 'undefined') return INITIAL_APPRENTICES;
  const raw = localStorage.getItem(APPRENTICES_KEY);
  if (!raw) {
    localStorage.setItem(APPRENTICES_KEY, JSON.stringify(INITIAL_APPRENTICES));
    return INITIAL_APPRENTICES;
  }
  try {
    return JSON.parse(raw);
  } catch {
    return INITIAL_APPRENTICES;
  }
}

export function saveStoredApprentices(apprentices: Apprentice[]) {
  if (typeof window !== 'undefined') {
    localStorage.setItem(APPRENTICES_KEY, JSON.stringify(apprentices));
  }
}

export function getActiveApprenticeId(): string {
  if (typeof window === 'undefined') return INITIAL_APPRENTICES[0].id;
  const stored = localStorage.getItem(CURRENT_APP_KEY);
  return stored || INITIAL_APPRENTICES[0].id;
}

export function setActiveApprenticeId(id: string) {
  if (typeof window !== 'undefined') {
    localStorage.setItem(CURRENT_APP_KEY, id);
  }
}

export function getStoredQuestions(): QuizQuestion[] {
  if (typeof window === 'undefined') return QUIZ_QUESTIONS;
  const raw = localStorage.getItem(QUESTIONS_KEY);
  if (!raw) {
    localStorage.setItem(QUESTIONS_KEY, JSON.stringify(QUIZ_QUESTIONS));
    return QUIZ_QUESTIONS;
  }
  try {
    return JSON.parse(raw);
  } catch {
    return QUIZ_QUESTIONS;
  }
}

export function saveStoredQuestions(questions: QuizQuestion[]) {
  if (typeof window !== 'undefined') {
    localStorage.setItem(QUESTIONS_KEY, JSON.stringify(questions));
  }
}

export function resetToDemoData() {
  if (typeof window !== 'undefined') {
    localStorage.setItem(FICHAS_KEY, JSON.stringify(INITIAL_FICHAS));
    localStorage.setItem(APPRENTICES_KEY, JSON.stringify(INITIAL_APPRENTICES));
    localStorage.setItem(QUESTIONS_KEY, JSON.stringify(QUIZ_QUESTIONS));
    localStorage.setItem(CURRENT_APP_KEY, INITIAL_APPRENTICES[0].id);
  }
}
