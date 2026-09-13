// ─── Quiz Service ─────────────────────────────────────────────────────────────
// Swap the mock implementations below with real fetch/axios calls when BE ready.

import type { QuizItem } from '@/types';
import type { PublishedQuiz } from '@/store/useQuizStore';
import type { CompletedTest } from '@/types';
import { defaultQuizzes } from '@/lib/mock/data';

export const quizService = {
  /**
   * Fetch the landing page quiz catalog.
   * TODO: replace with GET /api/quizzes
   */
  getLanding: async (): Promise<QuizItem[]> => {
    return defaultQuizzes;
  },

  /**
   * Fetch all published quizzes (listening + reading) from the community.
   * TODO: replace with GET /api/quizzes/published
   */
  getPublished: async (): Promise<{ listening: PublishedQuiz[]; reading: PublishedQuiz[] }> => {
    if (typeof window === 'undefined') return { listening: [], reading: [] };
    const listening: PublishedQuiz[] = JSON.parse(localStorage.getItem('published_listening_quizzes') || '[]');
    const reading: PublishedQuiz[] = JSON.parse(localStorage.getItem('published_reading_quizzes') || '[]');
    return { listening, reading };
  },

  /**
   * Publish a new quiz.
   * TODO: replace with POST /api/quizzes
   */
  publish: async (quiz: PublishedQuiz): Promise<PublishedQuiz> => {
    return quiz;
  },

  /**
   * Fetch a user's test history.
   * TODO: replace with GET /api/quizzes/history
   */
  getHistory: async (): Promise<CompletedTest[]> => {
    if (typeof window === 'undefined') return [];
    return JSON.parse(localStorage.getItem('completed_tests_history') || '[]');
  },

  /**
   * Save a completed test to history.
   * TODO: replace with POST /api/quizzes/history
   */
  saveHistory: async (_test: CompletedTest): Promise<void> => {
    // no-op in mock — handled by store directly
  },

  /**
   * Toggle like on a quiz.
   * TODO: replace with POST /api/quizzes/:id/like
   */
  toggleLike: async (_id: string): Promise<void> => {
    // no-op in mock
  },
};
