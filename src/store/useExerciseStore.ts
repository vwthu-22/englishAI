'use client';
import { create } from 'zustand';
import { Exercise, mockExercises } from '@/lib/store';

interface ExerciseState {
  exercises: Exercise[];
  addExercise: (exercise: Exercise) => void;
  deleteExercise: (id: string) => void;
  setExercises: (exercises: Exercise[]) => void;
}

export const useExerciseStore = create<ExerciseState>((set) => ({
  exercises: mockExercises,

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
}));
