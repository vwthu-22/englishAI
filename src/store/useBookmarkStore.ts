'use client';
import { create } from 'zustand';

export interface Bookmark {
  id: string;
  title: string;
  type: 'listening' | 'reading';
  difficulty: string;
  questionCount: number;
  author: string;
  publishedAt: string;
  videoId?: string;
  passage?: string;
  questions: any[];
}

interface BookmarkState {
  bookmarks: Bookmark[];
  toggleBookmark: (item: Omit<Bookmark, 'type'> & { type: 'listening' | 'reading' }) => void;
  isBookmarked: (id: string) => boolean;
  setBookmarks: (bookmarks: Bookmark[]) => void;
  loadBookmarks: () => void;
}

export const useBookmarkStore = create<BookmarkState>((set, get) => ({
  bookmarks: [],

  toggleBookmark: (item) => {
    set((state) => {
      const isAlreadyBookmarked = state.bookmarks.some((b) => b.id === item.id);
      let updatedBookmarks: Bookmark[];

      if (isAlreadyBookmarked) {
        updatedBookmarks = state.bookmarks.filter((b) => b.id !== item.id);
      } else {
        updatedBookmarks = [...state.bookmarks, item as Bookmark];
      }

      if (typeof window !== 'undefined') {
        localStorage.setItem('english_app_bookmarks', JSON.stringify(updatedBookmarks));
      }

      return { bookmarks: updatedBookmarks };
    });
  },

  isBookmarked: (id) => {
    return get().bookmarks.some((b) => b.id === id);
  },

  setBookmarks: (bookmarks) => set({ bookmarks }),

  loadBookmarks: () => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('english_app_bookmarks');
      if (stored) {
        try {
          const parsed = JSON.parse(stored);
          set({ bookmarks: parsed });
        } catch (e) {
          console.error('Failed to parse bookmarks from localStorage', e);
        }
      }
    }
  },
}));
