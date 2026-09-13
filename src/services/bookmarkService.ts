// ─── Bookmark Service ─────────────────────────────────────────────────────────
// Swap the mock implementations below with real fetch/axios calls when BE ready.

import type { Bookmark } from '@/store/useBookmarkStore';

export const bookmarkService = {
  /**
   * Fetch all bookmarks for the current user.
   * TODO: replace with GET /api/bookmarks
   */
  getAll: async (): Promise<Bookmark[]> => {
    if (typeof window === 'undefined') return [];
    try {
      return JSON.parse(localStorage.getItem('english_app_bookmarks') || '[]');
    } catch {
      return [];
    }
  },

  /**
   * Save the full bookmark list (after a toggle).
   * TODO: replace with PUT /api/bookmarks or POST/DELETE /api/bookmarks/:id
   */
  save: async (bookmarks: Bookmark[]): Promise<void> => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('english_app_bookmarks', JSON.stringify(bookmarks));
    }
  },
};
