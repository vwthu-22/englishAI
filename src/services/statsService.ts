// ─── Stats Service ────────────────────────────────────────────────────────────
// GET /api/users/me/stats  →  { totalExercises, averageScore, correctRate, incorrectRate }
//
// NOTE: Backend does NOT provide weekly/monthly chart breakdowns.
// getWeekly() and getMonthly() remain mock until backend adds those endpoints.

import type { WeeklyData, MonthlyProgress, BeUserStats } from '@/types';
import { mockWeeklyData, mockMonthlyProgress } from '@/lib/mock/data';
import { api } from '@/lib/api';

export const statsService = {
  /**
   * Fetch aggregate learning stats for the current user.
   * GET /api/users/me/stats
   */
  getStats: async (): Promise<BeUserStats> => {
    return api.get<BeUserStats>('/api/users/me/stats');
  },

  /**
   * Weekly activity data for charts.
   * TODO: replace mock when backend provides a weekly breakdown endpoint.
   */
  getWeekly: async (): Promise<WeeklyData[]> => {
    return mockWeeklyData;
  },

  /**
   * Monthly progress data for charts.
   * TODO: replace mock when backend provides a monthly breakdown endpoint.
   */
  getMonthly: async (): Promise<MonthlyProgress[]> => {
    return mockMonthlyProgress;
  },
};
