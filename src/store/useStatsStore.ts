'use client';
import { create } from 'zustand';
import { WeeklyData, MonthlyProgress } from '@/types';
import { mockWeeklyData, mockMonthlyProgress } from '@/lib/mock/data';

interface StatsState {
  weeklyData: WeeklyData[];
  monthlyProgress: MonthlyProgress[];
  setWeeklyData: (data: WeeklyData[]) => void;
  setMonthlyProgress: (progress: MonthlyProgress[]) => void;
}

export const useStatsStore = create<StatsState>((set) => ({
  weeklyData: mockWeeklyData,
  monthlyProgress: mockMonthlyProgress,

  setWeeklyData: (weeklyData) => set({ weeklyData }),
  setMonthlyProgress: (monthlyProgress) => set({ monthlyProgress }),
}));
