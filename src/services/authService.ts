// ─── Auth Service ─────────────────────────────────────────────────────────────
// Connects to Studish backend:
//   - POST /api/auth/login (username/password)
//   - POST /api/auth/google or /api/auth/google/callback (Google OAuth)

import type { User, BeUserProfile, BeStreakResponse, BeStreakActivityResult } from '@/types';
import { BeAuthResponse } from '@/types';
import { api, saveTokens, clearTokens } from '@/lib/api';
import { config } from '@/lib/config';

// ─── Helpers ──────────────────────────────────────────────────────────────────

const PROFILE_STORAGE_KEY = 'studish_user_profile';

export function getStoredProfile(): Partial<User> | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = localStorage.getItem(PROFILE_STORAGE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function saveStoredProfile(user: Partial<User>) {
  if (typeof window === 'undefined') return;
  try {
    const existing = getStoredProfile() || {};
    localStorage.setItem(PROFILE_STORAGE_KEY, JSON.stringify({ ...existing, ...user }));
  } catch {
    // Ignore storage errors
  }
}

export function clearStoredProfile() {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(PROFILE_STORAGE_KEY);
}

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

/** Build a User from token payload, optional BE user, and local stored profile */
export function buildUser(token?: string, beUser?: BeAuthResponse['user']): User {
  const payload = token ? decodeJwtPayload(token) : {};
  const stored = getStoredProfile();

  const id = String(
    stored?.id ??
    beUser?.id ??
    payload.sub ??
    payload.userId ??
    payload.id ??
    'user-1'
  );

  const name = String(
    stored?.name ??
    beUser?.name ??
    beUser?.fullName ??
    beUser?.username ??
    payload.name ??
    payload.fullName ??
    payload.username ??
    payload.email ??
    beUser?.email ??
    'Studish Learner'
  );

  const email = String(
    stored?.email ??
    beUser?.email ??
    payload.email ??
    ''
  );

  const avatar =
    stored?.avatar ??
    beUser?.avatar ??
    beUser?.picture ??
    (typeof payload.picture === 'string' ? payload.picture : typeof payload.avatar === 'string' ? payload.avatar : undefined);

  const level = String(
    stored?.level ??
    beUser?.level ??
    payload.level ??
    'B1'
  );

  const joinDate = String(
    stored?.joinDate ??
    beUser?.joinDate ??
    beUser?.createdAt?.split('T')[0] ??
    payload.joinDate ??
    new Date().toISOString().split('T')[0]
  );

  const streak = Number(
    stored?.streak ??
    beUser?.streak ??
    payload.streak ??
    1
  );

  const maxStreak = Number(
    stored?.maxStreak ??
    beUser?.maxStreak ??
    payload.maxStreak ??
    streak
  );

  const user: User = { id, name, email, avatar, level, joinDate, streak, maxStreak };
  saveStoredProfile(user);
  return user;
}

export function userFromToken(token: string): User {
  return buildUser(token);
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
      { usernameOrEmail: username, username, password },
      { public: true }
    );
    saveTokens(data.accessToken, data.refreshToken);
    return buildUser(data.accessToken, data.user);
  },

  /**
   * Register a new user.
   * Calls backend API: POST /api/auth/register
   */
  register: async (data: {
    username?: string;
    email: string;
    password: string;
    fullName?: string;
  }): Promise<User> => {
    const rawUsername = data.username || data.email.split('@')[0].replace(/[^a-zA-Z0-9_]/g, '');
    const username = rawUsername.length < 3 ? `${rawUsername}123` : rawUsername.slice(0, 50);
    const res = await api.post<BeAuthResponse>(
      '/api/auth/register',
      {
        username,
        email: data.email,
        password: data.password,
        fullName: data.fullName || username,
      },
      { public: true }
    );
    saveTokens(res.accessToken, res.refreshToken);
    return buildUser(res.accessToken, res.user);
  },

  /**
   * Get current streak info.
   * Calls: GET /api/users/me/streak
   */
  getStreak: async (): Promise<BeStreakResponse> => {
    return api.get<BeStreakResponse>('/api/users/me/streak');
  },

  /**
   * Record learning activity to increase streak.
   * Calls: POST /api/users/me/streak/activity
   */
  recordStreakActivity: async (): Promise<BeStreakActivityResult> => {
    return api.post<BeStreakActivityResult>('/api/users/me/streak/activity', {});
  },

  /**
   * Fetch the currently logged-in user's profile from the backend.
   * Calls: GET /api/users/me/profile
   * Falls back to stored profile / JWT decode if the request fails.
   */
  getMe: async (): Promise<User | null> => {
    if (typeof window === 'undefined') return null;
    const token = localStorage.getItem('access_token');
    if (!token) return null;

    const stored = getStoredProfile();

    try {
      const profile = await api.get<BeUserProfile>('/api/users/me/profile');

      const user: User = {
        id: String(profile.id ?? stored?.id ?? 'user-1'),
        name: profile.name ?? stored?.name ?? profile.email ?? 'Studish Learner',
        email: profile.email ?? stored?.email ?? '',
        avatar: profile.avatar ?? stored?.avatar,
        level: profile.level ?? stored?.level ?? 'B1',
        joinDate: profile.joinDate ?? stored?.joinDate ?? new Date().toISOString().split('T')[0],
        streak: profile.streak ?? stored?.streak ?? 1,
        maxStreak: profile.maxStreak ?? stored?.maxStreak ?? profile.streak ?? stored?.streak ?? 1,
      };

      saveStoredProfile(user);
      return user;
    } catch {
      // API failed — fall back to stored profile or decoding the token
      return buildUser(token);
    }
  },

  /**
   * Update user profile (name, level, etc.)
   */
  updateProfile: async (data: Partial<User>): Promise<User> => {
    saveStoredProfile(data);

    try {
      await api.put('/api/users/me/profile', data);
    } catch {
      try {
        await api.patch('/api/users/me/profile', data);
      } catch {
        // Backend update endpoint might not be available yet; local storage preserves it
      }
    }

    const current = getStoredProfile() || {};
    return {
      id: current.id || 'user-1',
      name: current.name || 'Studish Learner',
      email: current.email || '',
      avatar: current.avatar,
      level: current.level || 'B1',
      joinDate: current.joinDate || new Date().toISOString().split('T')[0],
      streak: current.streak || 1,
      ...data,
    } as User;
  },

  /**
   * Log out: clear tokens & stored profile from localStorage.
   */
  logout: async (): Promise<void> => {
    clearTokens();
    clearStoredProfile();
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
      throw new Error('Google Client ID is not configured. Please contact administrator.');
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
      return buildUser(data.accessToken, data.user);
    }

    throw new Error('No token received from server.');
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
      return buildUser(data.accessToken, data.user);
    }
    throw new Error('Google ID Token authentication failed.');
  },

  /**
   * Directly save access & refresh tokens
   */
  loginWithDirectToken(accessToken: string, refreshToken?: string): User {
    saveTokens(accessToken, refreshToken);
    return buildUser(accessToken);
  },
};
