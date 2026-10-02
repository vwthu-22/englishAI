// ─── Exercise Service ─────────────────────────────────────────────────────────
// Connects to Studish backend /api/exercises endpoints.

import type { Exercise, BeExerciseSummaryResponse, mapBeExerciseSummary } from '@/types';
import { mapBeExerciseSummary as _mapBeExerciseSummary } from '@/types';
import type { PageResponse } from '@/lib/api';
import { api } from '@/lib/api';

export const exerciseService = {
  /**
   * Fetch the current user's own exercises.
   * GET /api/exercises/my?page=0&size=50
   */
  getAll: async (): Promise<Exercise[]> => {
    const page = await api.get<PageResponse<BeExerciseSummaryResponse>>(
      '/api/exercises/my?page=0&size=50',
    );
    return page.content.map(_mapBeExerciseSummary);
  },

  /**
   * Search / browse community exercises with optional filters.
   * GET /api/exercises?type=&difficulty=&keyword=&page=0&size=20
   */
  search: async (params?: {
    type?: 'LISTENING' | 'READING';
    difficulty?: 'EASY' | 'MEDIUM' | 'HARD';
    keyword?: string;
    page?: number;
    size?: number;
  }): Promise<PageResponse<BeExerciseSummaryResponse>> => {
    const qs = new URLSearchParams();
    if (params?.type) qs.set('type', params.type);
    if (params?.difficulty) qs.set('difficulty', params.difficulty);
    if (params?.keyword) qs.set('keyword', params.keyword);
    qs.set('page', String(params?.page ?? 0));
    qs.set('size', String(params?.size ?? 20));
    qs.set('sortBy', 'createdAt');
    qs.set('sortDir', 'desc');
    return api.get<PageResponse<BeExerciseSummaryResponse>>(`/api/exercises?${qs}`);
  },

  /**
   * Delete an exercise by ID.
   * DELETE /api/exercises/{id}
   */
  delete: async (id: string): Promise<void> => {
    await api.delete<void>(`/api/exercises/${id}`);
  },
};
