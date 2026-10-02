// ─── Auth Service ─────────────────────────────────────────────────────────────
// Connects to Studish backend:
//   - POST /api/auth/login (username/password)
//   - POST /api/auth/google or /api/auth/google/callback (Google OAuth code/token)

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
   * POST /api/auth/login  →  { accessToken, refreshToken, tokenType }
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
      throw new Error(
        'Google Client ID is missing. Please configure NEXT_PUBLIC_GOOGLE_CLIENT_ID or set it in the Google API Settings.'
      );
    }
    const url = this.getGoogleAuthUrl(clientId, customRedirectUri);
    window.location.href = url;
  },

  /**
   * Exchange Google authorization code with the backend API.
   * POST to backend (default: /api/auth/google or /api/auth/google/callback)
   */
  async handleGoogleCallback(
    code: string,
    endpointOverride?: string,
    redirectUriOverride?: string
  ): Promise<User> {
    const endpoint = endpointOverride || config.googleBackendEndpoint;
    const redirectUri = redirectUriOverride || config.googleRedirectUri;

    const payloadVariants = [
      { code, redirectUri },
      { authorizationCode: code, redirectUri },
      { code },
    ];

    let lastError: Error | null = null;

    // Try payload formats
    for (const body of payloadVariants) {
      try {
        const data = await api.post<BeAuthResponse>(endpoint, body, { public: true });
        if (data && data.accessToken) {
          saveTokens(data.accessToken, data.refreshToken);
          return userFromToken(data.accessToken);
        }
      } catch (err) {
        lastError = err instanceof Error ? err : new Error(String(err));
      }
    }

    // If main endpoint failed, try fallback endpoint /api/auth/google/callback if different
    if (endpoint !== '/api/auth/google/callback') {
      try {
        const data = await api.post<BeAuthResponse>(
          '/api/auth/google/callback',
          { code, redirectUri },
          { public: true }
        );
        if (data && data.accessToken) {
          saveTokens(data.accessToken, data.refreshToken);
          return userFromToken(data.accessToken);
        }
      } catch (fallbackErr) {
        // preserve original error or use fallback error
      }
    }

    throw new Error(
      lastError?.message ||
        'Failed to authenticate with backend Google API. Please check backend configuration.'
    );
  },

  /**
   * Exchange Google ID Token / Credential (from Google Identity Services / One-Tap / Popup)
   * with the backend API.
   */
  async loginWithGoogleIdToken(
    idToken: string,
    endpointOverride?: string
  ): Promise<User> {
    const endpoint = endpointOverride || config.googleBackendEndpoint;

    const payloadVariants = [
      { idToken },
      { token: idToken },
      { credential: idToken },
    ];

    let lastError: Error | null = null;

    for (const body of payloadVariants) {
      try {
        const data = await api.post<BeAuthResponse>(endpoint, body, { public: true });
        if (data && data.accessToken) {
          saveTokens(data.accessToken, data.refreshToken);
          return userFromToken(data.accessToken);
        }
      } catch (err) {
        lastError = err instanceof Error ? err : new Error(String(err));
      }
    }

    throw new Error(
      lastError?.message ||
        'Failed to verify Google ID Token with backend API.'
    );
  },

  /**
   * Directly save access & refresh tokens (e.g. from redirect query parameters or direct token response)
   */
  loginWithDirectToken(accessToken: string, refreshToken?: string): User {
    saveTokens(accessToken, refreshToken);
    return userFromToken(accessToken);
  },
};
