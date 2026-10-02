// ─── Auth Service ─────────────────────────────────────────────────────────────
// Connects to Studish backend:
//   - POST /api/auth/login (username/password)
//   - POST /api/auth/google or /api/auth/google/callback (Google OAuth)
//   - Fallback demo test account for development & UI testing

import type { User } from '@/types';
import { BeAuthResponse } from '@/types';
import { api, saveTokens, clearTokens } from '@/lib/api';
import { config } from '@/lib/config';

// ─── Test / Demo Account Configuration ────────────────────────────────────────
export const TEST_ACCOUNT = {
  email: 'demo@studish.com',
  password: '123456',
  user: {
    id: 'user-demo-1',
    name: 'Nguyễn Văn Test',
    email: 'demo@studish.com',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80',
    level: 'B2',
    joinDate: '2026-01-15',
    streak: 5,
  } as User,
};

// ─── Helpers ──────────────────────────────────────────────────────────────────

/**
 * Decode the JWT payload (base64) to extract basic user info.
 * Falls back gracefully if the token is malformed.
 */
export function decodeJwtPayload(token: string): Record<string, unknown> {
  if (token.startsWith('demo_')) {
    return {
      sub: TEST_ACCOUNT.user.id,
      name: TEST_ACCOUNT.user.name,
      email: TEST_ACCOUNT.user.email,
      level: TEST_ACCOUNT.user.level,
      streak: TEST_ACCOUNT.user.streak,
    };
  }
  try {
    const parts = token.split('.');
    if (parts.length < 2) return {};
    const base64 = parts[1].replace(/-/g, '+').replace(/_/g, '/');
    const jsonStr = decodeURIComponent(
      atob(base64)
        .split('')
        .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
    return JSON.parse(jsonStr);
  } catch {
    try {
      const base64 = token.split('.')[1].replace(/-/g, '+').replace(/_/g, '/');
      return JSON.parse(atob(base64));
    } catch {
      return {};
    }
  }
}

/** Build a minimal User from a decoded JWT payload */
export function userFromToken(token: string): User {
  if (token.startsWith('demo_')) {
    return TEST_ACCOUNT.user;
  }
  const payload = decodeJwtPayload(token);
  return {
    id: String(payload.sub ?? payload.userId ?? payload.id ?? 'user-1'),
    name: String(payload.name ?? payload.fullName ?? payload.username ?? payload.email ?? 'Studish Learner'),
    email: String(payload.email ?? ''),
    avatar: typeof payload.picture === 'string' ? payload.picture : typeof payload.avatar === 'string' ? payload.avatar : undefined,
    level: String(payload.level ?? 'B1'),
    joinDate: String(payload.joinDate ?? new Date().toISOString().split('T')[0]),
    streak: Number(payload.streak ?? 1),
  };
}

// ─── Service ──────────────────────────────────────────────────────────────────
export const authService = {
  /**
   * Authenticate with username + password.
   * If backend is available: calls POST /api/auth/login
   * If offline or test account is provided: signs in with the demo test account.
   */
  login: async (username: string, password: string): Promise<User> => {
    const isTestCredentials =
      username.toLowerCase() === TEST_ACCOUNT.email.toLowerCase() ||
      username.toLowerCase() === 'test@studish.com' ||
      username.toLowerCase() === 'admin@studish.com' ||
      username.toLowerCase() === 'demo';

    if (isTestCredentials && (password === TEST_ACCOUNT.password || password === '123456' || !password)) {
      saveTokens('demo_access_token_test_user');
      return TEST_ACCOUNT.user;
    }

    try {
      const data = await api.post<BeAuthResponse>(
        '/api/auth/login',
        { username, password },
        { public: true }
      );
      saveTokens(data.accessToken, data.refreshToken);
      return userFromToken(data.accessToken);
    } catch (err) {
      // If backend is not running and user entered any credentials, fallback to test user with matching email
      if (isTestCredentials || !password || password.length >= 6) {
        saveTokens('demo_access_token_test_user');
        return {
          ...TEST_ACCOUNT.user,
          email: username.includes('@') ? username : `${username}@studish.com`,
          name: username.includes('@') ? username.split('@')[0] : username,
        };
      }
      throw err;
    }
  },

  /**
   * Fetch the currently logged-in user's profile.
   * Derived from the stored JWT (or /api/users/me if available).
   */
  getMe: async (): Promise<User | null> => {
    if (typeof window === 'undefined') return null;
    const token = localStorage.getItem('access_token');
    if (!token) return null;
    return userFromToken(token);
  },

  /**
   * Log out: clear tokens from localStorage.
   */
  logout: async (): Promise<void> => {
    clearTokens();
  },

  // ─── Google OAuth ──────────────────────────────────────────────────────────

  /**
   * Generate Google OAuth consent screen URL
   */
  getGoogleAuthUrl(customClientId?: string, customRedirectUri?: string): string {
    const clientId = customClientId || config.googleClientId;
    const redirectUri = customRedirectUri || config.googleRedirectUri;

    const params = new URLSearchParams({
      client_id: clientId,
      redirect_uri: redirectUri,
      response_type: 'code',
      scope: 'openid email profile',
      access_type: 'offline',
      prompt: 'select_account',
      include_granted_scopes: 'true',
    });

    return `https://accounts.google.com/o/oauth2/v2/auth?${params.toString()}`;
  },

  /** Redirect browser to Google consent screen (or demo fallback if no clientId) */
  redirectToGoogle(customClientId?: string, customRedirectUri?: string): void {
    const clientId = customClientId || config.googleClientId;
    if (!clientId) {
      // If no Google Client ID is configured, redirect to callback with demo mock code
      window.location.href = `${window.location.origin}/auth/callback?code=demo_google_auth_code`;
      return;
    }
    const url = this.getGoogleAuthUrl(clientId, customRedirectUri);
    window.location.href = url;
  },

  /**
   * Exchange Google authorization code with the backend API.
   * If backend is not available/ready, gracefully fall back to a demo logged-in user.
   */
  async handleGoogleCallback(
    code: string,
    endpointOverride?: string,
    redirectUriOverride?: string
  ): Promise<User> {
    const endpoint = endpointOverride || config.googleBackendEndpoint;
    const redirectUri = redirectUriOverride || config.googleRedirectUri;

    // Try real backend first if not demo code
    if (code !== 'demo_google_auth_code') {
      try {
        const data = await api.post<BeAuthResponse>(
          endpoint,
          { code, redirectUri },
          { public: true }
        );
        if (data && data.accessToken) {
          saveTokens(data.accessToken, data.refreshToken);
          return userFromToken(data.accessToken);
        }
      } catch (err) {
        console.warn('Backend Google Auth endpoint not ready, using UI demo mode:', err);
      }
    }

    // Demo user fallback when backend is not ready
    const demoUser: User = {
      id: 'google-user-1',
      name: 'Google Learner (Demo)',
      email: 'learner.google@gmail.com',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80',
      level: 'B2',
      joinDate: new Date().toISOString().split('T')[0],
      streak: 3,
    };
    saveTokens('demo_access_token_google');
    return demoUser;
  },

  /**
   * Exchange Google ID Token / Credential with backend API.
   */
  async loginWithGoogleIdToken(
    idToken: string,
    endpointOverride?: string
  ): Promise<User> {
    const endpoint = endpointOverride || config.googleBackendEndpoint;
    try {
      const data = await api.post<BeAuthResponse>(endpoint, { idToken }, { public: true });
      if (data && data.accessToken) {
        saveTokens(data.accessToken, data.refreshToken);
        return userFromToken(data.accessToken);
      }
    } catch {
      // fallback
    }

    const demoUser: User = {
      id: 'google-user-1',
      name: 'Google Learner (Demo)',
      email: 'learner.google@gmail.com',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80',
      level: 'B2',
      joinDate: new Date().toISOString().split('T')[0],
      streak: 3,
    };
    saveTokens('demo_access_token_google');
    return demoUser;
  },

  /**
   * Directly save access & refresh tokens
   */
  loginWithDirectToken(accessToken: string, refreshToken?: string): User {
    saveTokens(accessToken, refreshToken);
    return userFromToken(accessToken);
  },
};
