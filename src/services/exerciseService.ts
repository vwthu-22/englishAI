// ─── Exercise Service ─────────────────────────────────────────────────────────
// Swap the mock implementations below with real fetch/axios calls when BE ready.
//
// Example with real backend:
//   getAll: () => fetch('/api/exercises').then(r => r.json()),

import type { Exercise } from '@/types';
import { mockExercises } from '@/lib/mock/data';

export const exerciseService = {
  /**
   * Fetch all exercises for the current user.
   * TODO: replace with GET /api/exercises
   */
  getAll: async (): Promise<Exercise[]> => {
    return mockExercises;
  },

  /**
   * Create a new exercise record.
   * TODO: replace with POST /api/exercises
   */
  create: async (exercise: Exercise): Promise<Exercise> => {
    return exercise;
  },

  /**
   * Delete an exercise by ID.
   * TODO: replace with DELETE /api/exercises/:id
   */
  delete: async (_id: string): Promise<void> => {
    // no-op in mock
  },
};
