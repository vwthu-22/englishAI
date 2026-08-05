'use client';
import { create } from 'zustand';
import { QuizItem, Question, defaultQuizzes } from '@/lib/store';

export interface PublishedQuiz {
  id: string;
  title: string;
  type: 'listening' | 'reading';
  topic?: string;
  videoId?: string;
  youtubeUrl?: string;
  passage?: string;
  questions: Question[];
  difficulty: string;
  questionCount: number;
  author: string;
  publishedAt: string;
  plays?: number;
  likes: number;
  rating: number;
}

export interface CompletedTest {
  id: string;
  quizId?: string;
  title: string;
  type: 'listening' | 'reading';
  score: number; // percentage
  totalQuestions: number;
  correctAnswers: number;
  completedAt: string;
  difficulty: string;
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

export const SEED_COMPLETED_TESTS: CompletedTest[] = [
  {
    id: 'comp-1',
    title: 'TED Talk: The Power of Introverts',
    type: 'listening',
    score: 90,
    totalQuestions: 10,
    correctAnswers: 9,
    completedAt: '28/07/2026 14:30',
    difficulty: 'B2',
  },
  {
    id: 'comp-2',
    title: 'IELTS Academic: Urban Development and Planning',
    type: 'reading',
    score: 85,
    totalQuestions: 20,
    correctAnswers: 17,
    completedAt: '26/07/2026 09:15',
    difficulty: 'C1',
  },
  {
    id: 'comp-3',
    title: 'BBC News: Technology and Society in 2025',
    type: 'listening',
    score: 75,
    totalQuestions: 8,
    correctAnswers: 6,
    completedAt: '24/07/2026 16:45',
    difficulty: 'B1',
  },
  {
    id: 'comp-4',
    title: 'Climate Change: Impact on Future Generations',
    type: 'reading',
    score: 80,
    totalQuestions: 15,
    correctAnswers: 12,
    completedAt: '20/07/2026 11:20',
    difficulty: 'C1',
  },
];

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
        } catch (e) {}
      }
      const reading = localStorage.getItem('published_reading_quizzes');
      if (reading) {
        try {
          set({ publishedReadingQuizzes: JSON.parse(reading) });
        } catch (e) {}
      }
      const history = localStorage.getItem('completed_tests_history');
      if (history) {
        try {
          set({ completedTests: JSON.parse(history) });
        } catch (e) {}
      } else {
        set({ completedTests: SEED_COMPLETED_TESTS });
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
