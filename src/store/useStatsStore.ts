'use client';
import { create } from 'zustand';
import { mockWeeklyData, mockMonthlyProgress } from '@/lib/mock/data';

interface StatsState {
  weeklyData: typeof mockWeeklyData;
  monthlyProgress: typeof mockMonthlyProgress;
  setWeeklyData: (data: typeof mockWeeklyData) => void;
  setMonthlyProgress: (progress: typeof mockMonthlyProgress) => void;
}

export const useStatsStore = create<StatsState>((set) => ({
  weeklyData: mockWeeklyData,
  monthlyProgress: mockMonthlyProgress,

  setWeeklyData: (weeklyData) => set({ weeklyData }),
  setMonthlyProgress: (monthlyProgress) => set({ monthlyProgress }),
}));
