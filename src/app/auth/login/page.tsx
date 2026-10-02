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
  ArrowLeft,
  Loader2,
  User,
} from 'lucide-react';
import { useAuthStore } from '@/store/useAuthStore';

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
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);

  const {
    login,
    loginWithGoogle,
    isLoading,
    error,
    successMessage,
    clearError,
  } = useAuthStore();

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await login(email, password);
    const { isLoggedIn } = useAuthStore.getState();
    if (isLoggedIn) {
      router.push('/');
    }
  };

  const handleGoogleSignIn = () => {
    clearError();
    setIsGoogleLoading(true);
    loginWithGoogle();
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
      <div style={{ width: '100%', maxWidth: '440px', marginBottom: '16px' }}>
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
          maxWidth: '440px',
          background: 'var(--bg-card)',
          borderRadius: '28px',
          border: '1px solid var(--border-strong)',
          boxShadow: '0 20px 60px rgba(0,0,0,0.12)',
          padding: '36px 32px',
          position: 'relative',
        }}
      >
        {/* Logo & Title */}
        <div style={{ textAlign: 'center', marginBottom: '24px' }}>
          <div
            style={{
              width: '60px',
              height: '60px',
              background: 'linear-gradient(135deg, #6c63ff, #8b5cf6)',
              borderRadius: '18px',
              margin: '0 auto 14px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 10px 25px rgba(108,99,255,0.35)',
            }}
          >
            <Zap size={30} color="white" />
          </div>
          <h1 style={{ fontSize: '24px', fontWeight: 800, margin: '0 0 6px 0' }} className="gradient-text">
            {mode === 'login' ? 'Chào mừng trở lại!' : 'Tạo tài khoản mới'}
          </h1>
          <p style={{ fontSize: '13px', color: 'var(--text-secondary)', margin: 0 }}>
            {mode === 'login'
              ? 'Đăng nhập để tiếp tục luyện tập Listening & Reading'
              : 'Bắt đầu hành trình nâng cao trình độ Tiếng Anh cùng AI'}
          </p>
        </div>

        {/* Mode Switch Tabs */}
        <div
          className="flex p-1 rounded-xl mb-5"
          style={{ background: 'rgba(0,0,0,0.05)', border: '1px solid var(--border)' }}
        >
          {(['login', 'register'] as const).map((m) => (
            <button
              key={m}
              onClick={() => setMode(m)}
              className="flex-1 py-2 rounded-lg text-sm font-semibold transition-all"
              style={{
                border: 'none',
                cursor: 'pointer',
                background:
                  mode === m ? 'linear-gradient(135deg, #6c63ff, #8b5cf6)' : 'transparent',
                color: mode === m ? 'white' : 'var(--text-secondary)',
                boxShadow: mode === m ? '0 2px 10px rgba(108,99,255,0.3)' : 'none',
              }}
            >
              {m === 'login' ? 'Đăng nhập' : 'Đăng ký'}
            </button>
          ))}
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

        {/* GOOGLE SIGN-IN BUTTON */}
        <button
          id="btn-google-login-page"
          onClick={handleGoogleSignIn}
          disabled={isGoogleLoading || isLoading}
          style={{
            width: '100%',
            padding: '13px 20px',
            borderRadius: '14px',
            border: '1.5px solid var(--border-strong)',
            background: 'var(--bg-secondary)',
            cursor: isGoogleLoading ? 'wait' : 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '12px',
            fontSize: '14px',
            fontWeight: 600,
            color: 'var(--text-primary)',
            boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
            transition: 'all 0.2s ease',
            marginBottom: '20px',
            opacity: isGoogleLoading ? 0.75 : 1,
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'translateY(-1px)';
            e.currentTarget.style.boxShadow = '0 6px 18px rgba(0,0,0,0.08)';
            e.currentTarget.style.borderColor = '#5b5bd6';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.04)';
            e.currentTarget.style.borderColor = 'var(--border-strong)';
          }}
        >
          {isGoogleLoading ? (
            <Loader2 size={20} color="#5b5bd6" style={{ animation: 'spin 1s linear infinite' }} />
          ) : (
            <GoogleIcon />
          )}
          <span>{isGoogleLoading ? 'Đang kết nối với Google…' : 'Đăng nhập với Google'}</span>
        </button>

        {/* Divider */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            marginBottom: '20px',
          }}
        >
          <div style={{ flex: 1, height: '1px', background: 'var(--border)' }} />
          <span style={{ fontSize: '12px', color: 'var(--text-muted)', fontWeight: 500 }}>
            hoặc với Email
          </span>
          <div style={{ flex: 1, height: '1px', background: 'var(--border)' }} />
        </div>

        {/* EMAIL FORM */}
        <form onSubmit={handleEmailSubmit}>
          {mode === 'register' && (
            <div className="mb-4">
              <label className="block text-xs font-semibold mb-1.5" style={{ color: 'var(--text-secondary)' }}>
                Họ và tên
              </label>
              <div className="relative">
                <User
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
                  placeholder="Nguyễn Văn A"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  style={{ paddingLeft: '42px', width: '100%', borderRadius: '10px', padding: '10px 14px 10px 42px' }}
                />
              </div>
            </div>
          )}

          <div className="mb-4">
            <label className="block text-xs font-semibold mb-1.5" style={{ color: 'var(--text-secondary)' }}>
              Email
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
                type="email"
                className="input-field"
                placeholder="name@example.com"
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
            {mode === 'login' ? 'Đăng nhập' : 'Đăng ký tài khoản'}
          </button>
        </form>
      </div>
    </div>
  );
}
