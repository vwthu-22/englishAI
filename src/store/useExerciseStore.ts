'use client';
import { create } from 'zustand';
import { Exercise } from '@/types';
import { mockExercises } from '@/lib/mock/data';
import { exerciseService } from '@/services/exerciseService';

interface ExerciseState {
  exercises: Exercise[];
  isLoaded: boolean;
  addExercise: (exercise: Exercise) => void;
  deleteExercise: (id: string) => void;
  setExercises: (exercises: Exercise[]) => void;
  /** Fetch user's exercises from backend, falls back to mock on error */
  fetchFromBackend: () => Promise<void>;
}

export const useExerciseStore = create<ExerciseState>((set, get) => ({
  exercises: mockExercises,
  isLoaded: false,

  addExercise: (exercise) => {
    set((state) => ({
      exercises: [exercise, ...state.exercises]
    }));
  },

  deleteExercise: (id) => {
    set((state) => ({
      exercises: state.exercises.filter((ex) => ex.id !== id)
    }));
  },

  setExercises: (exercises) => set({ exercises }),

  fetchFromBackend: async () => {
    if (get().isLoaded) return; // only fetch once per session
    try {
      const exercises = await exerciseService.getAll();
      // If BE returns exercises, use them; otherwise keep mock
      if (exercises.length > 0) {
        set({ exercises, isLoaded: true });
      } else {
        set({ isLoaded: true });
      }
    } catch {
      // Network / auth failed — keep mock data, mark as tried
      set({ isLoaded: true });
    }
  },
}));
