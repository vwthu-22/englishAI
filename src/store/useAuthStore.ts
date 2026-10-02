'use client';
import { create } from 'zustand';
import { User } from '@/types';
import { authService } from '@/services/authService';

interface AuthState {
  user: User | null;
  isLoggedIn: boolean;
  isLoading: boolean;
  error: string | null;
  successMessage: string | null;

  /** Email/password login → calls POST /api/auth/login */
  login: (username: string, password: string) => Promise<void>;
  
  /** Triggers Google OAuth redirect — browser navigates away */
  loginWithGoogle: (customClientId?: string, customRedirectUri?: string) => void;
  
  /** Called by the /auth/callback page after Google redirects back with ?code=... */
  handleGoogleCallback: (
    code: string,
    endpoint?: string,
    redirectUri?: string
  ) => Promise<void>;
  
  /** Direct exchange with Google ID Token (from GSI / One-Tap / Popup) */
  loginWithGoogleToken: (idToken: string, endpoint?: string) => Promise<void>;
  
  /** Save direct tokens from URL redirect (Spring OAuth2 client) */
  loginWithDirectToken: (accessToken: string, refreshToken?: string) => void;
  
  logout: () => Promise<void>;
  clearError: () => void;
  clearSuccessMessage: () => void;
  setError: (msg: string | null) => void;
  
  /** Restore session from stored token on app load */
  restoreSession: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isLoggedIn: false,
  isLoading: false,
  error: null,
  successMessage: null,

  login: async (username, password) => {
    set({ isLoading: true, error: null, successMessage: null });
    try {
      const user = await authService.login(username, password);
      set({ user, isLoggedIn: true, isLoading: false, successMessage: `Welcome back, ${user.name}!` });
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Login failed.';
      set({ isLoading: false, error: message, isLoggedIn: false });
    }
  },

  loginWithGoogle: (customClientId?: string, customRedirectUri?: string) => {
    set({ error: null });
    try {
      authService.redirectToGoogle(customClientId, customRedirectUri);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to initialize Google login.';
      set({ error: message, isLoading: false });
    }
  },

  handleGoogleCallback: async (code: string, endpoint?: string, redirectUri?: string) => {
    set({ isLoading: true, error: null, successMessage: null });
    try {
      const user = await authService.handleGoogleCallback(code, endpoint, redirectUri);
      set({ user, isLoggedIn: true, isLoading: false, successMessage: `Signed in as ${user.name}` });
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Google authentication failed.';
      set({ isLoading: false, error: message, isLoggedIn: false });
      throw err;
    }
  },

  loginWithGoogleToken: async (idToken: string, endpoint?: string) => {
    set({ isLoading: true, error: null, successMessage: null });
    try {
      const user = await authService.loginWithGoogleIdToken(idToken, endpoint);
      set({ user, isLoggedIn: true, isLoading: false, successMessage: `Signed in as ${user.name}` });
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to verify Google token with backend.';
      set({ isLoading: false, error: message, isLoggedIn: false });
      throw err;
    }
  },

  loginWithDirectToken: (accessToken: string, refreshToken?: string) => {
    try {
      const user = authService.loginWithDirectToken(accessToken, refreshToken);
      set({ user, isLoggedIn: true, isLoading: false, error: null, successMessage: `Welcome back, ${user.name}!` });
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Invalid auth token.';
      set({ isLoading: false, error: message, isLoggedIn: false });
    }
  },

  logout: async () => {
    await authService.logout();
    set({ isLoggedIn: false, user: null, error: null, successMessage: null });
  },

  clearError: () => set({ error: null }),
  clearSuccessMessage: () => set({ successMessage: null }),
  setError: (msg: string | null) => set({ error: msg }),

  restoreSession: async () => {
    try {
      const user = await authService.getMe();
      if (user) {
        set({ user, isLoggedIn: true });
      }
    } catch {
      // Ignore token restore failures
    }
  },
}));
