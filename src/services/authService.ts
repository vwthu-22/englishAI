// ─── Auth Service ────────────────────────────────────────────────────────────
// Swap the mock implementations below with real fetch/axios calls when BE ready.
//
// Example with real backend:
//   login: (email, password) =>
//     fetch('/api/auth/login', { method: 'POST', body: JSON.stringify({ email, password }) })
//       .then(r => r.json()),

import type { User } from '@/types';
import { mockUser } from '@/lib/mock/data';

export const authService = {
  /**
   * Authenticate a user.
   * TODO: replace with POST /api/auth/login
   */
  login: async (_email: string, _password: string): Promise<User> => {
    // Mock: always succeed
    return mockUser;
  },

  /**
   * Fetch the currently logged-in user's profile.
   * TODO: replace with GET /api/auth/me
   */
  getMe: async (): Promise<User | null> => {
    return mockUser;
  },

  /**
   * Log out the current session.
   * TODO: replace with POST /api/auth/logout
   */
  logout: async (): Promise<void> => {
    // no-op in mock
  },
};
