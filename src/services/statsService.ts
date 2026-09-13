// ─── Stats Service ─────────────────────────────────────────────────────────────
// Swap the mock implementations below with real fetch/axios calls when BE ready.

import type { WeeklyData, MonthlyProgress } from '@/types';
import { mockWeeklyData, mockMonthlyProgress } from '@/lib/mock/data';

export const statsService = {
  /**
   * Fetch weekly activity data for the current user.
   * TODO: replace with GET /api/stats/weekly
   */
  getWeekly: async (): Promise<WeeklyData[]> => {
    return mockWeeklyData;
  },

  /**
   * Fetch monthly progress data for the current user.
   * TODO: replace with GET /api/stats/monthly
   */
  getMonthly: async (): Promise<MonthlyProgress[]> => {
    return mockMonthlyProgress;
  },
};
