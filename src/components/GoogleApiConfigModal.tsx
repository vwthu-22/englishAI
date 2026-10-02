'use client';
import React, { useState, useEffect } from 'react';
import {
  X,
  Settings,
  Globe,
  Key,
  Link as LinkIcon,
  CheckCircle2,
  AlertCircle,
  Play,
  RotateCcw,
  Sparkles,
  ExternalLink,
  Code2,
} from 'lucide-react';
import { config } from '@/lib/config';
import { useAuthStore } from '@/store/useAuthStore';

interface GoogleApiConfigModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess?: () => void;
}

export default function GoogleApiConfigModal({
  isOpen,
  onClose,
  onLoginSuccess,
}: GoogleApiConfigModalProps) {
  const [clientId, setClientId] = useState('');
  const [redirectUri, setRedirectUri] = useState('');
  const [backendEndpoint, setBackendEndpoint] = useState('/api/auth/google');
  const [apiBaseUrl, setApiBaseUrl] = useState('http://localhost:8080');

  // Manual tester inputs
  const [testCode, setTestCode] = useState('');
  const [testIdToken, setTestIdToken] = useState('');
  const [testResponse, setTestResponse] = useState<string | null>(null);
  const [isTesting, setIsTesting] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  const { loginWithGoogleToken, handleGoogleCallback } = useAuthStore();

  useEffect(() => {
    if (typeof window !== 'undefined' && isOpen) {
      setClientId(localStorage.getItem('studish_google_client_id') || process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || '');
      setRedirectUri(
        localStorage.getItem('studish_google_redirect_uri') ||
          process.env.NEXT_PUBLIC_GOOGLE_REDIRECT_URI ||
          `${window.location.origin}/auth/callback`
      );
      setBackendEndpoint(
        localStorage.getItem('studish_google_backend_endpoint') ||
          process.env.NEXT_PUBLIC_GOOGLE_BACKEND_ENDPOINT ||
          '/api/auth/google'
      );
      setApiBaseUrl(
        localStorage.getItem('studish_api_base_url') ||
          process.env.NEXT_PUBLIC_API_BASE_URL ||
          'http://localhost:8080'
      );
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSaveConfig = (e: React.FormEvent) => {
    e.preventDefault();
    if (typeof window !== 'undefined') {
      localStorage.setItem('studish_google_client_id', clientId.trim());
      localStorage.setItem('studish_google_redirect_uri', redirectUri.trim());
      localStorage.setItem('studish_google_backend_endpoint', backendEndpoint.trim());
      localStorage.setItem('studish_api_base_url', apiBaseUrl.trim());
    }
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2500);
  };

  const handleResetDefaults = () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('studish_google_client_id');
      localStorage.removeItem('studish_google_redirect_uri');
      localStorage.removeItem('studish_google_backend_endpoint');
      localStorage.removeItem('studish_api_base_url');
      setClientId(process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || '');
      setRedirectUri(`${window.location.origin}/auth/callback`);
      setBackendEndpoint('/api/auth/google');
      setApiBaseUrl('http://localhost:8080');
    }
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2000);
  };

  const handleTestIdToken = async () => {
    if (!testIdToken.trim()) return;
    setIsTesting(true);
    setTestResponse(null);
    try {
      await loginWithGoogleToken(testIdToken.trim(), backendEndpoint.trim());
      setTestResponse(JSON.stringify({ status: 200, message: 'Đăng nhập thành công với ID Token!' }, null, 2));
      if (onLoginSuccess) onLoginSuccess();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      setTestResponse(JSON.stringify({ error: true, message: msg }, null, 2));
    } finally {
      setIsTesting(false);
    }
  };

  const handleTestAuthCode = async () => {
    if (!testCode.trim()) return;
    setIsTesting(true);
    setTestResponse(null);
    try {
      await handleGoogleCallback(testCode.trim(), backendEndpoint.trim(), redirectUri.trim());
      setTestResponse(JSON.stringify({ status: 200, message: 'Xác thực Code thành công với Backend API!' }, null, 2));
      if (onLoginSuccess) onLoginSuccess();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      setTestResponse(JSON.stringify({ error: true, message: msg }, null, 2));
    } finally {
      setIsTesting(false);
    }
  };

  return (
    <div
      className="modal-overlay"
      onClick={(e) => e.target === e.currentTarget && onClose()}
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.65)',
        backdropFilter: 'blur(8px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 9999,
        padding: '16px',
      }}
    >
      <div
        className="modal-content"
        style={{
          width: '100%',
          maxWidth: '560px',
          maxHeight: '90vh',
          overflowY: 'auto',
          background: 'var(--bg-card)',
          borderRadius: '20px',
          border: '1px solid var(--border-strong)',
          boxShadow: '0 20px 50px rgba(0,0,0,0.3)',
          position: 'relative',
          padding: '28px',
        }}
      >
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div
              style={{
                width: '40px',
                height: '40px',
                borderRadius: '12px',
                background: 'linear-gradient(135deg, #4285F4, #34A853)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'white',
              }}
            >
              <Settings size={20} />
            </div>
            <div>
              <h3 style={{ fontSize: '18px', fontWeight: 700, margin: 0, color: 'var(--text-primary)' }}>
                Cấu hình & Test Google API
              </h3>
              <p style={{ fontSize: '13px', color: 'var(--text-secondary)', margin: 0 }}>
                Tùy chỉnh Endpoint Backend & Client ID Google OAuth
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            style={{
              background: 'rgba(255,255,255,0.06)',
              border: 'none',
              borderRadius: '8px',
              padding: '6px',
              cursor: 'pointer',
              color: 'var(--text-secondary)',
            }}
          >
            <X size={18} />
          </button>
        </div>

        {/* Configuration Form */}
        <form onSubmit={handleSaveConfig} style={{ marginBottom: '24px' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {/* Backend Base URL */}
            <div>
              <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '6px' }}>
                <Globe size={14} color="#5b5bd6" /> Backend Base URL
              </label>
              <input
                type="text"
                className="input-field"
                value={apiBaseUrl}
                onChange={(e) => setApiBaseUrl(e.target.value)}
                placeholder="http://localhost:8080"
                style={{
                  width: '100%',
                  padding: '10px 14px',
                  borderRadius: '10px',
                  border: '1px solid var(--border)',
                  background: 'var(--bg-primary)',
                  fontSize: '13px',
                  color: 'var(--text-primary)',
                }}
              />
            </div>

            {/* Google Backend Auth Endpoint */}
            <div>
              <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '6px' }}>
                <Code2 size={14} color="#5b5bd6" /> Google Auth Endpoint Backend (POST)
              </label>
              <div style={{ display: 'flex', gap: '8px' }}>
                <input
                  type="text"
                  className="input-field"
                  value={backendEndpoint}
                  onChange={(e) => setBackendEndpoint(e.target.value)}
                  placeholder="/api/auth/google hoặc /api/auth/google/callback"
                  style={{
                    flex: 1,
                    padding: '10px 14px',
                    borderRadius: '10px',
                    border: '1px solid var(--border)',
                    background: 'var(--bg-primary)',
                    fontSize: '13px',
                    color: 'var(--text-primary)',
                  }}
                />
              </div>
              <div style={{ display: 'flex', gap: '6px', marginTop: '6px', flexWrap: 'wrap' }}>
                {['/api/auth/google', '/api/auth/google/callback', '/api/auth/oauth2/google'].map((ep) => (
                  <button
                    key={ep}
                    type="button"
                    onClick={() => setBackendEndpoint(ep)}
                    style={{
                      fontSize: '11px',
                      padding: '3px 8px',
                      borderRadius: '6px',
                      background: backendEndpoint === ep ? 'rgba(91,91,214,0.15)' : 'var(--bg-card-hover)',
                      color: backendEndpoint === ep ? '#5b5bd6' : 'var(--text-secondary)',
                      border: backendEndpoint === ep ? '1px solid #5b5bd6' : '1px solid var(--border)',
                      cursor: 'pointer',
                    }}
                  >
                    {ep}
                  </button>
                ))}
              </div>
            </div>

            {/* Google Client ID */}
            <div>
              <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '6px' }}>
                <Key size={14} color="#5b5bd6" /> Google Client ID
              </label>
              <input
                type="text"
                className="input-field"
                value={clientId}
                onChange={(e) => setClientId(e.target.value)}
                placeholder="xxxx.apps.googleusercontent.com"
                style={{
                  width: '100%',
                  padding: '10px 14px',
                  borderRadius: '10px',
                  border: '1px solid var(--border)',
                  background: 'var(--bg-primary)',
                  fontSize: '13px',
                  color: 'var(--text-primary)',
                }}
              />
              <span style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '4px', display: 'block' }}>
                Lấy từ Google Cloud Console (OAuth 2.0 Client IDs).
              </span>
            </div>

            {/* Google Redirect URI */}
            <div>
              <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '6px' }}>
                <LinkIcon size={14} color="#5b5bd6" /> Google Redirect URI (Authorized redirect URIs)
              </label>
              <input
                type="text"
                className="input-field"
                value={redirectUri}
                onChange={(e) => setRedirectUri(e.target.value)}
                placeholder="http://localhost:3000/auth/callback"
                style={{
                  width: '100%',
                  padding: '10px 14px',
                  borderRadius: '10px',
                  border: '1px solid var(--border)',
                  background: 'var(--bg-primary)',
                  fontSize: '13px',
                  color: 'var(--text-primary)',
                }}
              />
            </div>
          </div>

          {/* Action buttons */}
          <div style={{ display: 'flex', gap: '10px', marginTop: '20px' }}>
            <button
              type="submit"
              className="btn-primary"
              style={{
                flex: 1,
                padding: '10px 16px',
                fontSize: '14px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
              }}
            >
              {savedSuccess ? (
                <>
                  <CheckCircle2 size={16} /> Đã lưu cấu hình!
                </>
              ) : (
                <>
                  <Sparkles size={16} /> Lưu cấu hình
                </>
              )}
            </button>
            <button
              type="button"
              onClick={handleResetDefaults}
              className="btn-secondary"
              style={{
                padding: '10px 14px',
                fontSize: '13px',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
              }}
              title="Đặt lại mặc định"
            >
              <RotateCcw size={15} /> Reset
            </button>
          </div>
        </form>

        {/* Section: Direct API Testing */}
        <div
          style={{
            padding: '18px',
            borderRadius: '14px',
            background: 'rgba(91,91,214,0.05)',
            border: '1px solid rgba(91,91,214,0.15)',
          }}
        >
          <h4
            style={{
              fontSize: '14px',
              fontWeight: 700,
              color: 'var(--text-primary)',
              marginBottom: '10px',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
            }}
          >
            <Play size={15} color="#5b5bd6" /> Kiểm thử kết nối API Backend
          </h4>

          {/* Test Auth Code */}
          <div style={{ marginBottom: '14px' }}>
            <label style={{ fontSize: '12px', color: 'var(--text-secondary)', display: 'block', marginBottom: '4px' }}>
              Test gửi Auth Code (`{'{'} code: "..." {'}'}`)
            </label>
            <div style={{ display: 'flex', gap: '8px' }}>
              <input
                type="text"
                value={testCode}
                onChange={(e) => setTestCode(e.target.value)}
                placeholder="Dán Authorization Code từ Google vào đây..."
                style={{
                  flex: 1,
                  padding: '8px 12px',
                  borderRadius: '8px',
                  border: '1px solid var(--border)',
                  background: 'var(--bg-primary)',
                  fontSize: '12px',
                  color: 'var(--text-primary)',
                }}
              />
              <button
                type="button"
                onClick={handleTestAuthCode}
                disabled={isTesting || !testCode.trim()}
                className="btn-primary"
                style={{
                  padding: '8px 14px',
                  fontSize: '12px',
                  whiteSpace: 'nowrap',
                  opacity: !testCode.trim() || isTesting ? 0.6 : 1,
                }}
              >
                Gửi Code
              </button>
            </div>
          </div>

          {/* Test ID Token */}
          <div style={{ marginBottom: '14px' }}>
            <label style={{ fontSize: '12px', color: 'var(--text-secondary)', display: 'block', marginBottom: '4px' }}>
              Test gửi Google ID Token (`{'{'} idToken: "..." {'}'}`)
            </label>
            <div style={{ display: 'flex', gap: '8px' }}>
              <input
                type="text"
                value={testIdToken}
                onChange={(e) => setTestIdToken(e.target.value)}
                placeholder="Dán Google JWT ID Token vào đây..."
                style={{
                  flex: 1,
                  padding: '8px 12px',
                  borderRadius: '8px',
                  border: '1px solid var(--border)',
                  background: 'var(--bg-primary)',
                  fontSize: '12px',
                  color: 'var(--text-primary)',
                }}
              />
              <button
                type="button"
                onClick={handleTestIdToken}
                disabled={isTesting || !testIdToken.trim()}
                className="btn-primary"
                style={{
                  padding: '8px 14px',
                  fontSize: '12px',
                  whiteSpace: 'nowrap',
                  opacity: !testIdToken.trim() || isTesting ? 0.6 : 1,
                }}
              >
                Gửi Token
              </button>
            </div>
          </div>

          {/* Response Box */}
          {testResponse && (
            <div style={{ marginTop: '12px' }}>
              <div style={{ fontSize: '11px', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '4px' }}>
                Phản hồi từ Backend API:
              </div>
              <pre
                style={{
                  background: 'rgba(0,0,0,0.85)',
                  color: testResponse.includes('"error": true') ? '#ff8080' : '#4ade80',
                  padding: '10px',
                  borderRadius: '8px',
                  fontSize: '11px',
                  maxHeight: '140px',
                  overflowY: 'auto',
                  margin: 0,
                  fontFamily: 'monospace',
                }}
              >
                {testResponse}
              </pre>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
