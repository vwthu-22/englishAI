// ─── Quiz Service ─────────────────────────────────────────────────────────────
// Maps "published quizzes" (community exercises) to backend /api/exercises.
// Like / bookmark features remain local-only (no backend endpoint).

import type { QuizItem, CompletedTest, BeExerciseSummaryResponse } from '@/types';
import type { PublishedQuiz } from '@/store/useQuizStore';
import type { PageResponse } from '@/lib/api';
import { api } from '@/lib/api';
import { defaultQuizzes } from '@/lib/mock/data';

// ─── Helpers ──────────────────────────────────────────────────────────────────

function beExerciseToPublishedQuiz(e: BeExerciseSummaryResponse): PublishedQuiz {
  const diffMap: Record<string, string> = { EASY: 'easy', MEDIUM: 'medium', HARD: 'hard' };
  return {
    id: String(e.id),
    title: e.title,
    type: e.type === 'LISTENING' ? 'listening' : 'reading',
    topic: e.description ?? '',
    difficulty: diffMap[e.difficulty] ?? e.difficulty,
    questionCount: e.questionCount,
    author: e.createdByUsername,
    publishedAt: e.createdAt.split('T')[0],
    plays: 0,
    likes: 0,
    rating: 4.5,
    questions: [],
  };
}

// ─── Service ──────────────────────────────────────────────────────────────────
export const quizService = {
  /**
   * Fetch landing-page quiz catalog (community exercises from backend).
   * GET /api/exercises?page=0&size=20&sortDir=desc
   * Falls back to seed data if the request fails.
   */
  getLanding: async (): Promise<QuizItem[]> => {
    try {
      const page = await api.get<PageResponse<BeExerciseSummaryResponse>>(
        '/api/exercises?page=0&size=20&sortBy=createdAt&sortDir=desc',
      );
      return page.content.map((e) => ({
        id: String(e.id),
        title: e.title,
        type: e.type === 'LISTENING' ? 'listening' : 'reading',
        topic: e.description ?? '',
        difficulty: e.difficulty,
        questionCount: e.questionCount,
        author: e.createdByUsername,
        publishedAt: e.createdAt.split('T')[0],
        rating: 4.5,
      }));
    } catch {
      return defaultQuizzes;
    }
  },

  /**
   * Fetch published exercises split by type.
   * GET /api/exercises?type=LISTENING  +  GET /api/exercises?type=READING
   */
  getPublished: async (): Promise<{ listening: PublishedQuiz[]; reading: PublishedQuiz[] }> => {
    try {
      const [listeningPage, readingPage] = await Promise.all([
        api.get<PageResponse<BeExerciseSummaryResponse>>(
          '/api/exercises?type=LISTENING&page=0&size=50&sortDir=desc',
        ),
        api.get<PageResponse<BeExerciseSummaryResponse>>(
          '/api/exercises?type=READING&page=0&size=50&sortDir=desc',
        ),
      ]);
      return {
        listening: listeningPage.content.map(beExerciseToPublishedQuiz),
        reading: readingPage.content.map(beExerciseToPublishedQuiz),
      };
    } catch {
      // Fallback to localStorage cache
      if (typeof window === 'undefined') return { listening: [], reading: [] };
      const listening: PublishedQuiz[] = JSON.parse(localStorage.getItem('published_listening_quizzes') || '[]');
      const reading: PublishedQuiz[] = JSON.parse(localStorage.getItem('published_reading_quizzes') || '[]');
      return { listening, reading };
    }
  },

  /**
   * Publish (create) a quiz.
   * POST /api/exercises  (the generate endpoints already persist the exercise)
   * This is a no-op if the exercise was created via /generate — already saved.
   */
  publish: async (quiz: PublishedQuiz): Promise<PublishedQuiz> => {
    return quiz;
  },

  /**
   * Fetch completed test history.
   * TODO: replace with GET /api/exercises/{id}/results when we track exerciseId
   */
  getHistory: async (): Promise<CompletedTest[]> => {
    if (typeof window === 'undefined') return [];
    return JSON.parse(localStorage.getItem('completed_tests_history') || '[]');
  },

  /** Save a completed test to localStorage (until a history endpoint exists) */
  saveHistory: async (_test: CompletedTest): Promise<void> => {
    // handled by store directly
  },

  /** Like toggle — no backend endpoint, stays local */
  toggleLike: async (_id: string): Promise<void> => {
    // no-op
  },
};
