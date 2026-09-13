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
