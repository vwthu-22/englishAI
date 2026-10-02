'use client';
import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Zap,
  Lock,
  Mail,
  Eye,
  EyeOff,
  AlertCircle,
  CheckCircle,
  Settings,
  Sparkles,
  ArrowLeft,
  Loader2,
  Code2,
  Play,
  Key,
  Globe,
  Link as LinkIcon,
} from 'lucide-react';
import { useAuthStore } from '@/store/useAuthStore';
import { config } from '@/lib/config';
import GoogleApiConfigModal from '@/components/GoogleApiConfigModal';

function GoogleIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
      <path
        fill="#EA4335"
        d="M24 9.5c3.5 0 6.6 1.2 9.1 3.2l6.8-6.8C35.9 2.5 30.3 0 24 0 14.7 0 6.7 5.4 2.8 13.3l7.9 6.1C12.5 13.1 17.8 9.5 24 9.5z"
      />
      <path
        fill="#4285F4"
        d="M46.5 24.5c0-1.6-.1-3.1-.4-4.5H24v8.5h12.7C35.9 32 33 34.9 29.5 36.6l7.7 6c4.5-4.2 7.3-10.4 7.3-18.1z"
      />
      <path
        fill="#FBBC05"
        d="M10.7 28.6A14.9 14.9 0 0 1 9.5 24c0-1.6.3-3.1.7-4.6L2.4 13.3A23.9 23.9 0 0 0 0 24c0 3.9.9 7.5 2.5 10.8l8.2-6.2z"
      />
      <path
        fill="#34A853"
        d="M24 48c6.5 0 11.9-2.1 15.9-5.8l-7.7-6C30.1 37.8 27.2 38.5 24 38.5c-6.2 0-11.5-4.2-13.4-9.9l-7.9 6.1C6.8 42.7 14.7 48 24 48z"
      />
    </svg>
  );
}

export default function LoginPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'google' | 'email' | 'api-test'>('google');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isConfigModalOpen, setIsConfigModalOpen] = useState(false);

  // Quick API Test states
  const [testEndpoint, setTestEndpoint] = useState('/api/auth/google');
  const [testPayloadType, setTestPayloadType] = useState<'code' | 'idToken'>('code');
  const [testValue, setTestValue] = useState('');
  const [testResponse, setTestResponse] = useState<string | null>(null);
  const [isTesting, setIsTesting] = useState(false);

  const {
    login,
    loginWithGoogle,
    loginWithGoogleToken,
    handleGoogleCallback,
    isLoading,
    error,
    successMessage,
    clearError,
    setError,
  } = useAuthStore();

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    await login(email, password);
    const { isLoggedIn } = useAuthStore.getState();
    if (isLoggedIn) {
      router.push('/');
    }
  };

  const handleGoogleSignIn = () => {
    clearError();
    const clientId = config.googleClientId;
    if (!clientId) {
      setError(
        'Chưa thiết lập Google Client ID. Vui lòng chuyển sang tab "Kiểm thử & Cấu hình API" hoặc bấm nút Cài đặt để thiết lập!'
      );
      return;
    }
    loginWithGoogle();
  };

  const handleRunApiTest = async () => {
    if (!testValue.trim()) return;
    setIsTesting(true);
    setTestResponse(null);
    clearError();

    try {
      if (testPayloadType === 'code') {
        await handleGoogleCallback(testValue.trim(), testEndpoint.trim());
        setTestResponse(
          JSON.stringify(
            {
              status: 200,
              message: 'Xác thực Google Authorization Code thành công với Backend!',
              data: {
                user: useAuthStore.getState().user,
                tokenStored: true,
              },
            },
            null,
            2
          )
        );
      } else {
        await loginWithGoogleToken(testValue.trim(), testEndpoint.trim());
        setTestResponse(
          JSON.stringify(
            {
              status: 200,
              message: 'Xác thực Google ID Token thành công với Backend!',
              data: {
                user: useAuthStore.getState().user,
                tokenStored: true,
              },
            },
            null,
            2
          )
        );
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      setTestResponse(
        JSON.stringify(
          {
            error: true,
            status: 400,
            message: msg,
            tip: 'Hãy đảm bảo Backend Spring Boot đã bật endpoint này và Google Client ID/Secret trùng khớp.',
          },
          null,
          2
        )
      );
    } finally {
      setIsTesting(false);
    }
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        background: 'radial-gradient(ellipse at top, rgba(108,99,255,0.08) 0%, var(--bg-primary) 70%)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '24px 16px',
      }}
    >
      {/* Top Bar Back Link */}
      <div style={{ width: '100%', maxWidth: '520px', marginBottom: '16px' }}>
        <Link
          href="/"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            fontSize: '13px',
            fontWeight: 600,
            color: 'var(--text-secondary)',
            textDecoration: 'none',
          }}
        >
          <ArrowLeft size={16} /> Quay về Trang chủ
        </Link>
      </div>

      {/* Main Card */}
      <div
        style={{
          width: '100%',
          maxWidth: '520px',
          background: 'var(--bg-card)',
          borderRadius: '28px',
          border: '1px solid var(--border-strong)',
          boxShadow: '0 20px 60px rgba(0,0,0,0.12)',
          padding: '36px 32px',
          position: 'relative',
        }}
      >
        {/* Logo & Title */}
        <div style={{ textAlign: 'center', marginBottom: '28px' }}>
          <div
            style={{
              width: '64px',
              height: '64px',
              background: 'linear-gradient(135deg, #6c63ff, #8b5cf6)',
              borderRadius: '20px',
              margin: '0 auto 16px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 10px 30px rgba(108,99,255,0.4)',
            }}
          >
            <Zap size={32} color="white" />
          </div>
          <h1 style={{ fontSize: '26px', fontWeight: 800, margin: '0 0 6px 0' }} className="gradient-text">
            Studish English AI
          </h1>
          <p style={{ fontSize: '14px', color: 'var(--text-secondary)', margin: 0 }}>
            Đăng nhập & Kết nối Backend API với Google Authentication
          </p>
        </div>

        {/* Navigation Tabs */}
        <div
          style={{
            display: 'flex',
            background: 'rgba(0,0,0,0.05)',
            padding: '4px',
            borderRadius: '14px',
            marginBottom: '24px',
            border: '1px solid var(--border)',
          }}
        >
          <button
            onClick={() => setActiveTab('google')}
            style={{
              flex: 1,
              padding: '10px 8px',
              borderRadius: '10px',
              fontSize: '13px',
              fontWeight: 600,
              border: 'none',
              cursor: 'pointer',
              background: activeTab === 'google' ? 'var(--bg-card)' : 'transparent',
              color: activeTab === 'google' ? '#5b5bd6' : 'var(--text-secondary)',
              boxShadow: activeTab === 'google' ? '0 2px 8px rgba(0,0,0,0.08)' : 'none',
              transition: 'all 0.2s',
            }}
          >
            Google Sign-In
          </button>
          <button
            onClick={() => setActiveTab('api-test')}
            style={{
              flex: 1,
              padding: '10px 8px',
              borderRadius: '10px',
              fontSize: '13px',
              fontWeight: 600,
              border: 'none',
              cursor: 'pointer',
              background: activeTab === 'api-test' ? 'var(--bg-card)' : 'transparent',
              color: activeTab === 'api-test' ? '#5b5bd6' : 'var(--text-secondary)',
              boxShadow: activeTab === 'api-test' ? '0 2px 8px rgba(0,0,0,0.08)' : 'none',
              transition: 'all 0.2s',
            }}
          >
            Test API Backend
          </button>
          <button
            onClick={() => setActiveTab('email')}
            style={{
              flex: 1,
              padding: '10px 8px',
              borderRadius: '10px',
              fontSize: '13px',
              fontWeight: 600,
              border: 'none',
              cursor: 'pointer',
              background: activeTab === 'email' ? 'var(--bg-card)' : 'transparent',
              color: activeTab === 'email' ? '#5b5bd6' : 'var(--text-secondary)',
              boxShadow: activeTab === 'email' ? '0 2px 8px rgba(0,0,0,0.08)' : 'none',
              transition: 'all 0.2s',
            }}
          >
            Email / Pass
          </button>
        </div>

        {/* Global Notifications */}
        {error && (
          <div
            style={{
              display: 'flex',
              alignItems: 'flex-start',
              gap: '10px',
              padding: '12px 14px',
              borderRadius: '12px',
              marginBottom: '20px',
              background: 'rgba(239,68,68,0.08)',
              border: '1px solid rgba(239,68,68,0.2)',
            }}
          >
            <AlertCircle size={16} color="#ef4444" style={{ marginTop: '2px', flexShrink: 0 }} />
            <p style={{ fontSize: '13px', color: '#ef4444', margin: 0, lineHeight: 1.4 }}>{error}</p>
          </div>
        )}

        {successMessage && (
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              padding: '12px 14px',
              borderRadius: '12px',
              marginBottom: '20px',
              background: 'rgba(34,197,94,0.08)',
              border: '1px solid rgba(34,197,94,0.2)',
            }}
          >
            <CheckCircle size={16} color="#22c55e" style={{ flexShrink: 0 }} />
            <p style={{ fontSize: '13px', color: '#22c55e', margin: 0 }}>{successMessage}</p>
          </div>
        )}

        {/* TAB 1: GOOGLE SIGN-IN */}
        {activeTab === 'google' && (
          <div>
            <div
              style={{
                background: 'linear-gradient(135deg, rgba(66,133,244,0.06), rgba(52,168,83,0.06))',
                borderRadius: '18px',
                border: '1px solid rgba(66,133,244,0.2)',
                padding: '24px 20px',
                textAlign: 'center',
                marginBottom: '24px',
              }}
            >
              <div style={{ marginBottom: '16px' }}>
                <h3 style={{ fontSize: '16px', fontWeight: 700, margin: '0 0 6px 0', color: 'var(--text-primary)' }}>
                  Đăng nhập 1-Chạm qua Google
                </h3>
                <p style={{ fontSize: '13px', color: 'var(--text-secondary)', margin: 0 }}>
                  Xác thực tài khoản Google và tạo phiên làm việc với Backend Studish API ({config.apiBaseUrl})
                </p>
              </div>

              <button
                id="btn-google-login-page"
                onClick={handleGoogleSignIn}
                disabled={isLoading}
                style={{
                  width: '100%',
                  padding: '14px 20px',
                  borderRadius: '14px',
                  border: '1.5px solid var(--border-strong)',
                  background: 'var(--bg-card)',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '12px',
                  fontSize: '15px',
                  fontWeight: 700,
                  color: 'var(--text-primary)',
                  boxShadow: '0 4px 14px rgba(0,0,0,0.08)',
                  transition: 'all 0.2s ease',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-1px)';
                  e.currentTarget.style.boxShadow = '0 6px 20px rgba(0,0,0,0.12)';
                  e.currentTarget.style.borderColor = '#4285F4';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '0 4px 14px rgba(0,0,0,0.08)';
                  e.currentTarget.style.borderColor = 'var(--border-strong)';
                }}
              >
                <GoogleIcon />
                <span>Tiếp tục với Google</span>
              </button>

              <div style={{ marginTop: '16px', display: 'flex', justifyContent: 'center' }}>
                <button
                  onClick={() => setIsConfigModalOpen(true)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    fontSize: '12px',
                    fontWeight: 600,
                    color: '#5b5bd6',
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    padding: '4px 8px',
                  }}
                >
                  <Settings size={14} /> Cấu hình Endpoint & Google Client ID
                </button>
              </div>
            </div>

            {/* Quick config preview */}
            <div
              style={{
                background: 'var(--bg-primary)',
                borderRadius: '14px',
                padding: '14px 16px',
                border: '1px solid var(--border)',
                fontSize: '12px',
              }}
            >
              <div style={{ fontWeight: 600, color: 'var(--text-primary)', marginBottom: '8px' }}>
                Thông số cấu hình hiện tại:
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', color: 'var(--text-secondary)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span>Backend Base:</span>
                  <code style={{ color: '#5b5bd6' }}>{config.apiBaseUrl}</code>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span>Google Endpoint:</span>
                  <code style={{ color: '#5b5bd6' }}>{config.googleBackendEndpoint}</code>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span>Google Client ID:</span>
                  <span style={{ color: config.googleClientId ? '#22c55e' : '#ef4444' }}>
                    {config.googleClientId ? `${config.googleClientId.slice(0, 16)}...` : 'Chưa cấu hình'}
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: API BACKEND TESTER */}
        {activeTab === 'api-test' && (
          <div>
            <div style={{ marginBottom: '16px' }}>
              <label style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-primary)', display: 'block', marginBottom: '6px' }}>
                Backend Endpoint
              </label>
              <input
                type="text"
                value={testEndpoint}
                onChange={(e) => setTestEndpoint(e.target.value)}
                placeholder="/api/auth/google"
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

            <div style={{ marginBottom: '16px' }}>
              <label style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-primary)', display: 'block', marginBottom: '6px' }}>
                Loại dữ liệu gửi test
              </label>
              <div style={{ display: 'flex', gap: '10px' }}>
                <label style={{ fontSize: '13px', display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer' }}>
                  <input
                    type="radio"
                    name="payloadType"
                    checked={testPayloadType === 'code'}
                    onChange={() => setTestPayloadType('code')}
                  />
                  Authorization Code (`{'{'} code: "..." {'}'}`)
                </label>
                <label style={{ fontSize: '13px', display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer' }}>
                  <input
                    type="radio"
                    name="payloadType"
                    checked={testPayloadType === 'idToken'}
                    onChange={() => setTestPayloadType('idToken')}
                  />
                  Google ID Token (`{'{'} idToken: "..." {'}'}`)
                </label>
              </div>
            </div>

            <div style={{ marginBottom: '16px' }}>
              <label style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-primary)', display: 'block', marginBottom: '6px' }}>
                Giá trị Token / Code
              </label>
              <textarea
                rows={3}
                value={testValue}
                onChange={(e) => setTestValue(e.target.value)}
                placeholder={
                  testPayloadType === 'code'
                    ? 'Dán Authorization code (4/0A...)...'
                    : 'Dán Google JWT ID token (eyJhbGciOi...)...'
                }
                style={{
                  width: '100%',
                  padding: '10px 14px',
                  borderRadius: '10px',
                  border: '1px solid var(--border)',
                  background: 'var(--bg-primary)',
                  fontSize: '12px',
                  color: 'var(--text-primary)',
                  fontFamily: 'monospace',
                  resize: 'vertical',
                }}
              />
            </div>

            <button
              onClick={handleRunApiTest}
              disabled={isTesting || !testValue.trim()}
              className="btn-primary"
              style={{
                width: '100%',
                padding: '12px',
                fontSize: '14px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                opacity: !testValue.trim() || isTesting ? 0.6 : 1,
              }}
            >
              {isTesting ? <Loader2 size={16} style={{ animation: 'spin 1s linear infinite' }} /> : <Play size={16} />}
              Gửi yêu cầu kiểm tra Backend API
            </button>

            {testResponse && (
              <div style={{ marginTop: '16px' }}>
                <div style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '4px' }}>
                  Kết quả trả về từ Backend:
                </div>
                <pre
                  style={{
                    background: 'rgba(0,0,0,0.85)',
                    color: testResponse.includes('"error": true') ? '#ff8080' : '#4ade80',
                    padding: '12px',
                    borderRadius: '10px',
                    fontSize: '11px',
                    maxHeight: '180px',
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
        )}

        {/* TAB 3: EMAIL / PASSWORD */}
        {activeTab === 'email' && (
          <form onSubmit={handleEmailLogin}>
            <div className="mb-4">
              <label className="block text-xs font-semibold mb-1.5" style={{ color: 'var(--text-secondary)' }}>
                Email / Username
              </label>
              <div className="relative">
                <Mail
                  size={16}
                  style={{
                    position: 'absolute',
                    left: '14px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    color: 'var(--text-muted)',
                  }}
                />
                <input
                  type="text"
                  className="input-field"
                  placeholder="user@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  style={{ paddingLeft: '42px', width: '100%', borderRadius: '10px', padding: '10px 14px 10px 42px' }}
                />
              </div>
            </div>

            <div className="mb-6">
              <label className="block text-xs font-semibold mb-1.5" style={{ color: 'var(--text-secondary)' }}>
                Mật khẩu
              </label>
              <div className="relative">
                <Lock
                  size={16}
                  style={{
                    position: 'absolute',
                    left: '14px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    color: 'var(--text-muted)',
                  }}
                />
                <input
                  type={showPassword ? 'text' : 'password'}
                  className="input-field"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  style={{
                    paddingLeft: '42px',
                    paddingRight: '42px',
                    width: '100%',
                    borderRadius: '10px',
                    padding: '10px 42px 10px 42px',
                  }}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  style={{
                    position: 'absolute',
                    right: '14px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    color: 'var(--text-muted)',
                  }}
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              className="btn-primary w-full"
              style={{
                padding: '12px',
                fontSize: '15px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                opacity: isLoading ? 0.7 : 1,
                borderRadius: '12px',
              }}
              disabled={isLoading}
            >
              {isLoading && <Loader2 size={16} style={{ animation: 'spin 1s linear infinite' }} />}
              Đăng nhập với Email
            </button>
          </form>
        )}
      </div>

      <GoogleApiConfigModal
        isOpen={isConfigModalOpen}
        onClose={() => setIsConfigModalOpen(false)}
        onLoginSuccess={() => {
          setIsConfigModalOpen(false);
          router.push('/');
        }}
      />
    </div>
  );
}
