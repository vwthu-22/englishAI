'use client';
import { create } from 'zustand';
import { QuizItem, Question, defaultQuizzes } from '@/lib/store';

export interface PublishedQuiz {
  id: string;
  title: string;
  videoId?: string;
  youtubeUrl?: string;
  passage?: string;
  questions: Question[];
  difficulty: string;
  questionCount: number;
  author: string;
  publishedAt: string;
  plays?: number;
  rating: number;
}

interface QuizState {
  landingQuizzes: QuizItem[];
  publishedListeningQuizzes: PublishedQuiz[];
  publishedReadingQuizzes: PublishedQuiz[];
  setLandingQuizzes: (quizzes: QuizItem[]) => void;
  addPublishedListeningQuiz: (quiz: PublishedQuiz) => void;
  addPublishedReadingQuiz: (quiz: PublishedQuiz) => void;
  setPublishedListeningQuizzes: (quizzes: PublishedQuiz[]) => void;
  setPublishedReadingQuizzes: (quizzes: PublishedQuiz[]) => void;
  loadPublishedQuizzes: () => void;
}

export const useQuizStore = create<QuizState>((set) => ({
  landingQuizzes: defaultQuizzes,
  publishedListeningQuizzes: [],
  publishedReadingQuizzes: [],

  setLandingQuizzes: (landingQuizzes) => set({ landingQuizzes }),

  addPublishedListeningQuiz: (quiz) => {
    set((state) => {
      const updated = [quiz, ...state.publishedListeningQuizzes];
      if (typeof window !== 'undefined') {
        localStorage.setItem('published_listening_quizzes', JSON.stringify(updated));
      }
      return { publishedListeningQuizzes: updated };
    });
  },

  addPublishedReadingQuiz: (quiz) => {
    set((state) => {
      const updated = [quiz, ...state.publishedReadingQuizzes];
      if (typeof window !== 'undefined') {
        localStorage.setItem('published_reading_quizzes', JSON.stringify(updated));
      }
      return { publishedReadingQuizzes: updated };
    });
  },

  setPublishedListeningQuizzes: (quizzes) => set({ publishedListeningQuizzes: quizzes }),
  setPublishedReadingQuizzes: (quizzes) => set({ publishedReadingQuizzes: quizzes }),

  loadPublishedQuizzes: () => {
    if (typeof window !== 'undefined') {
      const listening = localStorage.getItem('published_listening_quizzes');
      if (listening) {
        try {
          set({ publishedListeningQuizzes: JSON.parse(listening) });
        } catch (e) {}
      }
      const reading = localStorage.getItem('published_reading_quizzes');
      if (reading) {
        try {
          set({ publishedReadingQuizzes: JSON.parse(reading) });
        } catch (e) {}
      }
    }
  },
}));
