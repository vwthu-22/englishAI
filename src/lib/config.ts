// ─── App Configuration ────────────────────────────────────────────────────────
// Centralises all environment variables. Configure via .env.local for local dev
// or via Vercel Dashboard environment variables for production.

export const config = {
  /** Base URL of the Studish backend (Spring Boot) */
  get apiBaseUrl(): string {
    return (
      process.env.NEXT_PUBLIC_API_BASE_URL ??
      'https://desperate-selective-nam-performances.trycloudflare.com'
    );
  },

  /** Google OAuth 2.0 Client ID (from Google Cloud Console) */
  get googleClientId(): string {
    return process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID ?? '';
  },

  /** Where Google should redirect after the user consents */
  get googleRedirectUri(): string {
    if (typeof window !== 'undefined') {
      return `${window.location.origin}/auth/callback`;
    }
    return (
      process.env.NEXT_PUBLIC_GOOGLE_REDIRECT_URI ??
      'http://localhost:3000/auth/callback'
    );
  },

  /** Backend endpoint handling Google Auth code / token exchange */
  get googleBackendEndpoint(): string {
    return process.env.NEXT_PUBLIC_GOOGLE_BACKEND_ENDPOINT ?? '/api/auth/google';
  },
} as const;
