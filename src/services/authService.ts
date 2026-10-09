// ─── Auth Service ─────────────────────────────────────────────────────────────
// Connects to Studish backend:
//   - POST /api/auth/login (username/password)
//   - POST /api/auth/google or /api/auth/google/callback (Google OAuth)

import type { User } from '@/types';
import { BeAuthResponse } from '@/types';
import { api, saveTokens, clearTokens } from '@/lib/api';
import { config } from '@/lib/config';

// ─── Helpers ──────────────────────────────────────────────────────────────────

/**
 * Decode the JWT payload (base64) to extract basic user info.
 * Falls back gracefully if the token is malformed.
 */
export function decodeJwtPayload(token: string): Record<string, unknown> {
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
   * Calls backend API: POST /api/auth/login
   */
  login: async (username: string, password: string): Promise<User> => {
    const data = await api.post<BeAuthResponse>(
      '/api/auth/login',
      { username, password },
      { public: true }
    );
    saveTokens(data.accessToken, data.refreshToken);
    return userFromToken(data.accessToken);
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

  /** Redirect browser to Google consent screen */
  redirectToGoogle(customClientId?: string, customRedirectUri?: string): void {
    const clientId = customClientId || config.googleClientId;
    if (!clientId) {
      window.location.href = `${window.location.origin}/auth/callback?code=demo_google_auth_code`;
      return;
    }
    const url = this.getGoogleAuthUrl(clientId, customRedirectUri);
    window.location.href = url;
  },

  /**
   * Exchange Google authorization code with the backend API.
   */
  async handleGoogleCallback(
    code: string,
    endpointOverride?: string,
    redirectUriOverride?: string
  ): Promise<User> {
    const endpoint = endpointOverride || config.googleBackendEndpoint;
    const redirectUri = redirectUriOverride || config.googleRedirectUri;

    const data = await api.post<BeAuthResponse>(
      endpoint,
      { code, redirectUri },
      { public: true }
    );
    if (data && data.accessToken) {
      saveTokens(data.accessToken, data.refreshToken);
      return userFromToken(data.accessToken);
    }

    throw new Error('Không nhận được token từ máy chủ.');
  },

  /**
   * Exchange Google ID Token / Credential with backend API.
   */
  async loginWithGoogleIdToken(
    idToken: string,
    endpointOverride?: string
  ): Promise<User> {
    const endpoint = endpointOverride || config.googleBackendEndpoint;
    const data = await api.post<BeAuthResponse>(endpoint, { idToken }, { public: true });
    if (data && data.accessToken) {
      saveTokens(data.accessToken, data.refreshToken);
      return userFromToken(data.accessToken);
    }
    throw new Error('Xác thực Google ID Token thất bại.');
  },

  /**
   * Directly save access & refresh tokens
   */
  loginWithDirectToken(accessToken: string, refreshToken?: string): User {
    saveTokens(accessToken, refreshToken);
    return userFromToken(accessToken);
  },
};
