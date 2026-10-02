// ─── API Client ───────────────────────────────────────────────────────────────
// Centralised fetch wrapper that:
//  - Prefixes all requests with the backend base URL
//  - Attaches the JWT Bearer token from localStorage automatically
//  - Unwraps the ApiResponse<T> envelope  →  returns data directly
//  - Throws a typed ApiError on 4xx / 5xx so callers can handle cleanly

import { config } from './config';

// ─── Types ────────────────────────────────────────────────────────────────────

/** The unified wrapper every Studish endpoint returns */
export interface ApiResponse<T> {
  status: number;
  message: string;
  data: T;
  timestamp: string;
}

/** Paginated list wrapper */
export interface PageResponse<T> {
  content: T[];
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
  first: boolean;
  last: boolean;
}

export class ApiError extends Error {
  constructor(
    public readonly status: number,
    message: string,
    public readonly data?: unknown,
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

// ─── Token helpers ────────────────────────────────────────────────────────────

export function getAccessToken(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('access_token');
}

export function saveTokens(accessToken: string, refreshToken?: string) {
  if (typeof window === 'undefined') return;
  localStorage.setItem('access_token', accessToken);
  if (refreshToken) localStorage.setItem('refresh_token', refreshToken);
}

export function clearTokens() {
  if (typeof window === 'undefined') return;
  localStorage.removeItem('access_token');
  localStorage.removeItem('refresh_token');
}

// ─── Core fetch ───────────────────────────────────────────────────────────────

type RequestOptions = Omit<RequestInit, 'body'> & {
  /** Parsed body — will be JSON.stringify-ed */
  body?: unknown;
  /** If true, skip the Authorization header */
  public?: boolean;
};

/**
 * Make an authenticated request to the Studish backend.
 * Unwraps ApiResponse<T>.data and throws ApiError on failure.
 */
export async function apiFetch<T>(path: string, options: RequestOptions = {}): Promise<T> {
  const { body, public: isPublic, ...init } = options;

  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...(init.headers as Record<string, string> ?? {}),
  };

  if (!isPublic) {
    const token = getAccessToken();
    if (token) {
      (headers as Record<string, string>)['Authorization'] = `Bearer ${token}`;
    }
  }

  const response = await fetch(`${config.apiBaseUrl}${path}`, {
    ...init,
    headers,
    body: body !== undefined ? JSON.stringify(body) : undefined,
  });

  // Parse the unified ApiResponse envelope
  const json: ApiResponse<T> = await response.json().catch(() => ({
    status: response.status,
    message: response.statusText,
    data: null,
    timestamp: new Date().toISOString(),
  }));

  if (!response.ok) {
    throw new ApiError(
      json.status ?? response.status,
      json.message ?? 'An unexpected error occurred.',
      json.data,
    );
  }

  return json.data;
}

// ─── Convenience methods ──────────────────────────────────────────────────────

export const api = {
  get: <T>(path: string, opts?: Omit<RequestOptions, 'method' | 'body'>) =>
    apiFetch<T>(path, { ...opts, method: 'GET' }),

  post: <T>(path: string, body?: unknown, opts?: Omit<RequestOptions, 'method' | 'body'>) =>
    apiFetch<T>(path, { ...opts, method: 'POST', body }),

  put: <T>(path: string, body?: unknown, opts?: Omit<RequestOptions, 'method' | 'body'>) =>
    apiFetch<T>(path, { ...opts, method: 'PUT', body }),

  delete: <T>(path: string, opts?: Omit<RequestOptions, 'method' | 'body'>) =>
    apiFetch<T>(path, { ...opts, method: 'DELETE' }),
};
