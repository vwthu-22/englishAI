'use client';
import React, { useState } from 'react';
import {
  X,
  Mail,
  Lock,
  User,
  Eye,
  EyeOff,
  Zap,
  Loader2,
  AlertCircle,
  CheckCircle,
  Sparkles,
} from 'lucide-react';
import { useAuthStore } from '@/store/useAuthStore';
import { TEST_ACCOUNT } from '@/services/authService';

interface AuthModalProps {
  onClose: () => void;
  initialMode?: 'login' | 'register';
}

/** Inline Google G logo */
function GoogleIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
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

export default function AuthModal({ onClose, initialMode = 'login' }: AuthModalProps) {
  const [mode, setMode] = useState<'login' | 'register'>(initialMode);
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);

  const {
    login,
    loginWithGoogle,
    isLoading,
    error,
    successMessage,
    clearError,
  } = useAuthStore();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await login(email, password);
    const { isLoggedIn } = useAuthStore.getState();
    if (isLoggedIn) onClose();
  };

  const handleQuickTestLogin = async () => {
    setEmail(TEST_ACCOUNT.email);
    setPassword(TEST_ACCOUNT.password);
    await login(TEST_ACCOUNT.email, TEST_ACCOUNT.password);
    const { isLoggedIn } = useAuthStore.getState();
    if (isLoggedIn) onClose();
  };

  const handleGoogleClick = () => {
    clearError();
    setIsGoogleLoading(true);
    loginWithGoogle();
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
        zIndex: 9000,
        padding: '16px',
      }}
    >
      <div
        className="modal-content"
        style={{
          maxWidth: '430px',
          width: '100%',
          position: 'relative',
          background: 'var(--bg-card)',
          borderRadius: '24px',
          border: '1px solid var(--border-strong)',
          padding: '32px 28px',
          boxShadow: '0 25px 60px rgba(0,0,0,0.3)',
        }}
      >
        {/* Logo */}
        <div className="text-center mb-5">
          <div
            style={{
              width: '56px',
              height: '56px',
              background: 'linear-gradient(135deg, #6c63ff, #a78bfa)',
              borderRadius: '16px',
              margin: '0 auto 12px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 0 30px rgba(108,99,255,0.4)',
            }}
          >
            <Zap size={28} color="white" />
          </div>
          <h2 style={{ fontSize: '24px', fontWeight: 800 }} className="gradient-text">
            {mode === 'login' ? 'Chào mừng bạn!' : 'Tạo tài khoản mới'}
          </h2>
          <p className="text-sm mt-1" style={{ color: 'var(--text-muted)' }}>
            {mode === 'login'
              ? 'Đăng nhập để vào hệ thống luyện thi EnglishAI'
              : 'Bắt đầu nâng cao kỹ năng Tiếng Anh'}
          </p>
        </div>

        {/* Test Account Quick Banner */}
        <div
          style={{
            background: 'rgba(108,99,255,0.08)',
            border: '1px dashed rgba(108,99,255,0.4)',
            borderRadius: '14px',
            padding: '12px 14px',
            marginBottom: '18px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '10px',
          }}
        >
          <div style={{ fontSize: '12px', color: 'var(--text-primary)', lineHeight: 1.4 }}>
            <div style={{ fontWeight: 700, color: '#5b5bd6', display: 'flex', alignItems: 'center', gap: '4px' }}>
              <Sparkles size={13} /> Tài khoản Test:
            </div>
            <div style={{ color: 'var(--text-secondary)', marginTop: '2px' }}>
              Email: <b>{TEST_ACCOUNT.email}</b> | Pass: <b>{TEST_ACCOUNT.password}</b>
            </div>
          </div>
          <button
            type="button"
            onClick={handleQuickTestLogin}
            disabled={isLoading}
            style={{
              background: 'linear-gradient(135deg, #5b5bd6, #7c3aed)',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              padding: '6px 12px',
              fontSize: '11px',
              fontWeight: 700,
              cursor: 'pointer',
              whiteSpace: 'nowrap',
              boxShadow: '0 2px 8px rgba(91,91,214,0.3)',
            }}
          >
            Đăng nhập ngay
          </button>
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

        {/* Error Banner */}
        {error && (
          <div
            style={{
              display: 'flex',
              alignItems: 'flex-start',
              gap: '10px',
              padding: '12px 14px',
              borderRadius: '12px',
              marginBottom: '16px',
              background: 'rgba(239,68,68,0.08)',
              border: '1px solid rgba(239,68,68,0.2)',
            }}
          >
            <AlertCircle size={16} color="#ef4444" style={{ marginTop: '2px', flexShrink: 0 }} />
            <div style={{ flex: 1 }}>
              <p style={{ fontSize: '13px', color: '#ef4444', margin: 0, lineHeight: 1.4 }}>
                {error}
              </p>
            </div>
          </div>
        )}

        {/* Success Banner */}
        {successMessage && (
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              padding: '12px 14px',
              borderRadius: '12px',
              marginBottom: '16px',
              background: 'rgba(34,197,94,0.08)',
              border: '1px solid rgba(34,197,94,0.2)',
            }}
          >
            <CheckCircle size={16} color="#22c55e" style={{ flexShrink: 0 }} />
            <p style={{ fontSize: '13px', color: '#22c55e', margin: 0 }}>
              {successMessage}
            </p>
          </div>
        )}

        {/* Google OAuth Button */}
        <button
          id="btn-google-signin"
          type="button"
          onClick={handleGoogleClick}
          disabled={isGoogleLoading || isLoading}
          className="w-full flex items-center justify-center gap-3 transition-all"
          style={{
            width: '100%',
            padding: '12px 16px',
            borderRadius: '12px',
            border: '1.5px solid var(--border-strong)',
            background: 'var(--bg-secondary)',
            cursor: isGoogleLoading ? 'wait' : 'pointer',
            fontSize: '14px',
            fontWeight: 600,
            color: 'var(--text-primary)',
            boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
            marginBottom: '18px',
            opacity: isGoogleLoading ? 0.75 : 1,
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.boxShadow = '0 6px 18px rgba(0,0,0,0.08)';
            e.currentTarget.style.borderColor = '#5b5bd6';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.04)';
            e.currentTarget.style.borderColor = 'var(--border-strong)';
          }}
        >
          {isGoogleLoading ? (
            <Loader2 size={20} color="#5b5bd6" style={{ animation: 'spin 1s linear infinite' }} />
          ) : (
            <GoogleIcon />
          )}
          <span>{isGoogleLoading ? 'Đang kết nối Google…' : 'Tiếp tục với Google'}</span>
        </button>

        {/* Divider */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            marginBottom: '18px',
          }}
        >
          <div style={{ flex: 1, height: '1px', background: 'var(--border)' }} />
          <span style={{ fontSize: '12px', color: 'var(--text-muted)', fontWeight: 500 }}>
            hoặc với Email
          </span>
          <div style={{ flex: 1, height: '1px', background: 'var(--border)' }} />
        </div>

        {/* Email / Password Form */}
        <form onSubmit={handleSubmit}>
          {mode === 'register' && (
            <div className="mb-3">
              <label
                className="block text-xs font-semibold mb-1"
                style={{ color: 'var(--text-secondary)' }}
              >
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
                  style={{
                    paddingLeft: '42px',
                    width: '100%',
                    borderRadius: '10px',
                    paddingTop: '9px',
                    paddingBottom: '9px',
                  }}
                />
              </div>
            </div>
          )}

          <div className="mb-3">
            <label
              className="block text-xs font-semibold mb-1"
              style={{ color: 'var(--text-secondary)' }}
            >
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
                placeholder="demo@studish.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                style={{
                  paddingLeft: '42px',
                  width: '100%',
                  borderRadius: '10px',
                  paddingTop: '9px',
                  paddingBottom: '9px',
                }}
              />
            </div>
          </div>

          <div className="mb-5">
            <label
              className="block text-xs font-semibold mb-1"
              style={{ color: 'var(--text-secondary)' }}
            >
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
                  paddingTop: '9px',
                  paddingBottom: '9px',
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
            {isLoading && (
              <Loader2 size={16} style={{ animation: 'spin 1s linear infinite' }} />
            )}
            {mode === 'login' ? 'Đăng nhập' : 'Đăng ký tài khoản'}
          </button>
        </form>

        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 w-8 h-8 flex items-center justify-center rounded-lg"
          style={{
            background: 'rgba(0,0,0,0.05)',
            border: 'none',
            cursor: 'pointer',
            color: 'var(--text-secondary)',
          }}
        >
          <X size={16} />
        </button>
      </div>
    </div>
  );
}
