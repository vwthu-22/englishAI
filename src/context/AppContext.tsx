'use client';
import React, { createContext, useContext, useEffect, ReactNode } from 'react';
import { useAuthStore } from '@/store/useAuthStore';
import { useUiStore } from '@/store/useUiStore';
import { useExerciseStore } from '@/store/useExerciseStore';
import { useBookmarkStore, Bookmark } from '@/store/useBookmarkStore';
import { useQuizStore, PublishedQuiz } from '@/store/useQuizStore';
import { User, Exercise } from '@/lib/store';

interface AppContextType {
  user: User | null;
  isLoggedIn: boolean;
  exercises: Exercise[];
  bookmarks: Bookmark[];
  currentPage: string;
  sidebarOpen: boolean;
  publishedListeningQuizzes: PublishedQuiz[];
  publishedReadingQuizzes: PublishedQuiz[];
  setCurrentPage: (page: string) => void;
  setSidebarOpen: (open: boolean) => void;
  login: (email: string, password: string) => void;
  logout: () => void;
  addExercise: (exercise: Exercise) => void;
  deleteExercise: (id: string) => void;
  toggleBookmark: (bookmark: Omit<Bookmark, 'type'> & { type: 'listening' | 'reading' }) => void;
  isBookmarked: (id: string) => boolean;
  addPublishedListeningQuiz: (quiz: PublishedQuiz) => void;
  addPublishedReadingQuiz: (quiz: PublishedQuiz) => void;
  setPublishedListeningQuizzes: (quizzes: PublishedQuiz[]) => void;
  setPublishedReadingQuizzes: (quizzes: PublishedQuiz[]) => void;
}

const AppContext = createContext<AppContextType | null>(null);

export function AppProvider({ children }: { children: ReactNode }) {
  // Consume separate stores
  const auth = useAuthStore();
  const ui = useUiStore();
  const exercise = useExerciseStore();
  const bookmark = useBookmarkStore();
  const quiz = useQuizStore();

  // Load bookmarks and published quizzes on mount
  useEffect(() => {
    bookmark.loadBookmarks();
    quiz.loadPublishedQuizzes();
  }, []);

  return (
    <AppContext.Provider value={{
      user: auth.user,
      isLoggedIn: auth.isLoggedIn,
      exercises: exercise.exercises,
      bookmarks: bookmark.bookmarks,
      currentPage: ui.currentPage,
      sidebarOpen: ui.sidebarOpen,
      publishedListeningQuizzes: quiz.publishedListeningQuizzes,
      publishedReadingQuizzes: quiz.publishedReadingQuizzes,
      setCurrentPage: ui.setCurrentPage,
      setSidebarOpen: ui.setSidebarOpen,
      login: auth.login,
      logout: auth.logout,
      addExercise: exercise.addExercise,
      deleteExercise: exercise.deleteExercise,
      toggleBookmark: bookmark.toggleBookmark,
      isBookmarked: bookmark.isBookmarked,
      addPublishedListeningQuiz: quiz.addPublishedListeningQuiz,
      addPublishedReadingQuiz: quiz.addPublishedReadingQuiz,
      setPublishedListeningQuizzes: quiz.setPublishedListeningQuizzes,
      setPublishedReadingQuizzes: quiz.setPublishedReadingQuizzes
    }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
}
