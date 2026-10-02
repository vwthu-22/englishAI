// ─── App Configuration ────────────────────────────────────────────────────────
// Centralises all environment variables. Swap values in .env.local for prod,
// or configure dynamically via localStorage during development/testing.

export const config = {
  /** Base URL of the Studish backend (Spring Boot) */
  get apiBaseUrl(): string {
    if (typeof window !== 'undefined') {
      const custom = localStorage.getItem('studish_api_base_url');
      if (custom) return custom;
    }
    return process.env.NEXT_PUBLIC_API_BASE_URL ?? 'http://localhost:8080';
  },

  /** Google OAuth 2.0 Client ID (from Google Cloud Console) */
  get googleClientId(): string {
    if (typeof window !== 'undefined') {
      const custom = localStorage.getItem('studish_google_client_id');
      if (custom) return custom;
    }
    return process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID ?? '';
  },

  /** Where Google should redirect after the user consents */
  get googleRedirectUri(): string {
    if (typeof window !== 'undefined') {
      const custom = localStorage.getItem('studish_google_redirect_uri');
      if (custom) return custom;
      return `${window.location.origin}/auth/callback`;
    }
    return (
      process.env.NEXT_PUBLIC_GOOGLE_REDIRECT_URI ??
      'http://localhost:3000/auth/callback'
    );
  },

  /** Backend endpoint handling Google Auth code / token exchange */
  get googleBackendEndpoint(): string {
    if (typeof window !== 'undefined') {
      const custom = localStorage.getItem('studish_google_backend_endpoint');
      if (custom) return custom;
    }
    return process.env.NEXT_PUBLIC_GOOGLE_BACKEND_ENDPOINT ?? '/api/auth/google';
  },
} as const;

