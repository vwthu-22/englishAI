'use client';
import { create } from 'zustand';
import { QuizItem, Question, CompletedTest } from '@/types';
import { defaultQuizzes, seedCompletedTests } from '@/lib/mock/data';

export interface PublishedQuiz {
  id: string;
  title: string;
  type: 'listening' | 'reading';
  topic?: string;
  audioUrl?: string;   // listening: audio file URL
  youtubeId?: string;  // listening: YouTube video ID (audio-only playback)
  videoId?: string;    // legacy, keep for backward compat
  youtubeUrl?: string; // legacy, keep for backward compat
  passage?: string;    // reading: text passage
  questions: Question[];
  difficulty: string;
  questionCount: number;
  author: string;
  publishedAt: string;
  plays?: number;
  likes: number;
  rating: number;
}


interface QuizState {
  landingQuizzes: QuizItem[];
  publishedListeningQuizzes: PublishedQuiz[];
  publishedReadingQuizzes: PublishedQuiz[];
  completedTests: CompletedTest[];
  likedIds: Set<string>;
  setLandingQuizzes: (quizzes: QuizItem[]) => void;
  addPublishedListeningQuiz: (quiz: PublishedQuiz) => void;
  addPublishedReadingQuiz: (quiz: PublishedQuiz) => void;
  addCompletedTest: (test: CompletedTest) => void;
  setPublishedListeningQuizzes: (quizzes: PublishedQuiz[]) => void;
  setPublishedReadingQuizzes: (quizzes: PublishedQuiz[]) => void;
  loadPublishedQuizzes: () => void;
  toggleLike: (id: string, type: 'listening' | 'reading') => void;
}


export const useQuizStore = create<QuizState>((set) => ({
  landingQuizzes: defaultQuizzes,
  publishedListeningQuizzes: [],
  publishedReadingQuizzes: [],
  completedTests: [],
  likedIds: new Set<string>(),

  setLandingQuizzes: (landingQuizzes) => set({ landingQuizzes }),

  addCompletedTest: (test) => {
    set((state) => {
      const updated = [test, ...state.completedTests];
      if (typeof window !== 'undefined') {
        localStorage.setItem('completed_tests_history', JSON.stringify(updated));
      }
      return { completedTests: updated };
    });
  },

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
        } catch {}
      }
      const reading = localStorage.getItem('published_reading_quizzes');
      if (reading) {
        try {
          set({ publishedReadingQuizzes: JSON.parse(reading) });
        } catch {}
      }
      const history = localStorage.getItem('completed_tests_history');
      if (history) {
        try {
          set({ completedTests: JSON.parse(history) });
        } catch {}
      } else {
        set({ completedTests: seedCompletedTests });
      }
    }
  },

  toggleLike: (id, type) => {
    set((state) => {
      const newLiked = new Set(state.likedIds);
      const isLiked = newLiked.has(id);
      if (isLiked) { newLiked.delete(id); } else { newLiked.add(id); }
      const delta = isLiked ? -1 : 1;
      if (type === 'listening') {
        const updated = state.publishedListeningQuizzes.map(q =>
          q.id === id ? { ...q, likes: q.likes + delta } : q
        );
        return { likedIds: newLiked, publishedListeningQuizzes: updated };
      } else {
        const updated = state.publishedReadingQuizzes.map(q =>
          q.id === id ? { ...q, likes: q.likes + delta } : q
        );
        return { likedIds: newLiked, publishedReadingQuizzes: updated };
      }
    });
  },
}));
