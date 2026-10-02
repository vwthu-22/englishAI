// ─── Domain Types ───────────────────────────────────────────────────────────
// These are the canonical TypeScript interfaces for the app.
// When connecting a real backend, only the service layer changes — these stay.

export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  level: string;
  joinDate: string;
  streak: number;
}

export interface Exercise {
  id: string;
  type: 'listening' | 'reading';
  title: string;
  topic: string;
  difficulty: string;
  score?: number;
  totalQuestions: number;
  correctAnswers?: number;
  createdAt: string;
  completedAt?: string;
  status: 'draft' | 'completed' | 'in-progress';
}

export interface Question {
  id: string;
  type: 'multiple-choice' | 'gap-fill' | 'true-false' | 'matching' | 'short-answer';
  question: string;
  options?: string[];
  answer: string | string[];
  explanation: string;
  userAnswer?: string | string[];
}

export interface QuizItem {
  id: string;
  title: string;
  type: 'listening' | 'reading';
  topic: string;
  difficulty: string;
  questionCount: number;
  author: string;
  publishedAt: string;
  rating: number;
}

export interface WeeklyData {
  day: string;
  listening: number;
  reading: number;
  score: number;
}

export interface MonthlyProgress {
  month: string;
  score: number;
  exercises: number;
}

export interface CompletedTest {
  id: string;
  quizId?: string;
  title: string;
  type: 'listening' | 'reading';
  score: number;
  totalQuestions: number;
  correctAnswers: number;
  completedAt: string;
  difficulty: string;
}

// ─── Backend API Response Types (Studish) ─────────────────────────────────────
// These mirror the exact shapes returned by the Spring Boot backend.
// The service layer maps them into the FE domain types above.

export type BeExerciseType = 'LISTENING' | 'READING';
export type BeDifficulty = 'EASY' | 'MEDIUM' | 'HARD';
export type BeCefrLevel = 'A2' | 'A2B1' | 'B1' | 'B1B2' | 'B2' | 'B2C1' | 'C1';
export type BeQuestionType = 'MULTIPLE_CHOICE' | 'GAP_FILL' | 'TRUE_FALSE' | 'MATCHING' | 'SHORT_ANSWER';

/** Maps FE difficulty string (CEFR or EASY/MEDIUM/HARD) → BE Difficulty enum */
export function toBeDefficulty(d: string): BeDifficulty {
  const map: Record<string, BeDifficulty> = {
    easy: 'EASY', medium: 'MEDIUM', hard: 'HARD',
    a2: 'EASY', b1: 'MEDIUM', b2: 'MEDIUM', c1: 'HARD',
    a2b1: 'EASY', b1b2: 'MEDIUM', b2c1: 'HARD',
  };
  return map[d.toLowerCase()] ?? 'MEDIUM';
}

/** Maps FE selectedTypes string → BE QuestionType enum */
export function toBeQuestionType(t: string): BeQuestionType {
  const map: Record<string, BeQuestionType> = {
    'multiple-choice': 'MULTIPLE_CHOICE',
    'true-false': 'TRUE_FALSE',
    'gap-fill': 'GAP_FILL',
    matching: 'MATCHING',
    'short-answer': 'SHORT_ANSWER',
  };
  return map[t] ?? 'MULTIPLE_CHOICE';
}

export interface BeQuestionResponse {
  id: number;
  questionNumber: number;
  questionType: BeQuestionType;
  questionText: string;
  /** Pipe-delimited for MCQ/Matching: "A. Opt1|||B. Opt2|||C. Opt3|||D. Opt4" */
  options: string | null;
  correctAnswer: string;
  explanation: string;
}

export interface BeExerciseResponse {
  id: number;
  title: string;
  description: string;
  type: BeExerciseType;
  difficulty: BeDifficulty;
  questionCount: number;
  youtubeUrl?: string;
  content?: string;
  createdByUserId: number;
  createdByUsername: string;
  createdAt: string;
  updatedAt: string;
  questions: BeQuestionResponse[];
}

export interface BeExerciseSummaryResponse {
  id: number;
  title: string;
  description: string;
  type: BeExerciseType;
  difficulty: BeDifficulty;
  questionCount: number;
  createdByUserId: number;
  createdByUsername: string;
  createdAt: string;
}

export interface BeQuestionResultDetail {
  id: number;
  questionNumber: number;
  questionType: BeQuestionType;
  questionText: string;
  options: string | null;
  correctAnswer: string;
  userAnswer: string;
  correct: boolean;
  explanation: string;
}

export interface BeExerciseResultResponse {
  id: number;
  exerciseId: number;
  exerciseTitle: string;
  score: number;
  totalQuestions: number;
  correctCount: number;
  answers: string; // JSON string of { "1": "answer" }
  completed: boolean;
  questionResults: BeQuestionResultDetail[];
  createdAt: string;
}

export interface BeTranscriptResponse {
  transcript: string;
  language: string;
  durationSeconds: number;
}

export interface BeAuthResponse {
  accessToken: string;
  refreshToken: string;
  tokenType: string;
}

export interface BeUserStats {
  totalExercises: number;
  averageScore: number;
  correctRate: number;
  incorrectRate: number;
}

// ─── Mapper helpers ───────────────────────────────────────────────────────────

/** Convert a BE QuestionResponse into the FE Question type */
export function mapBeQuestion(q: BeQuestionResponse): Question {
  return {
    id: String(q.id),
    type: (() => {
      const m: Record<BeQuestionType, Question['type']> = {
        MULTIPLE_CHOICE: 'multiple-choice',
        TRUE_FALSE: 'true-false',
        GAP_FILL: 'gap-fill',
        MATCHING: 'matching',
        SHORT_ANSWER: 'short-answer',
      };
      return m[q.questionType] ?? 'multiple-choice';
    })(),
    question: q.questionText,
    options: q.options ? q.options.split('|||') : undefined,
    answer: q.correctAnswer,
    explanation: q.explanation,
  };
}

/** Convert a BE ExerciseSummary into the FE Exercise type */
export function mapBeExerciseSummary(e: BeExerciseSummaryResponse): Exercise {
  const diffMap: Record<BeDifficulty, string> = { EASY: 'easy', MEDIUM: 'medium', HARD: 'hard' };
  return {
    id: String(e.id),
    type: e.type === 'LISTENING' ? 'listening' : 'reading',
    title: e.title,
    topic: e.description ?? '',
    difficulty: diffMap[e.difficulty] ?? e.difficulty,
    totalQuestions: e.questionCount,
    createdAt: e.createdAt,
    status: 'draft',
  };
}
