'use client';
import { Suspense, useEffect, useState, useRef } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuthStore } from '@/store/useAuthStore';
import {
  Zap,
  AlertCircle,
  Loader2,
  CheckCircle2,
  ArrowRight,
  RefreshCw,
} from 'lucide-react';

function CallbackContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { handleGoogleCallback, loginWithDirectToken } = useAuthStore();
  
  const [step, setStep] = useState<'reading' | 'backend' | 'success' | 'error'>('reading');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const calledRef = useRef(false);

  useEffect(() => {
    if (calledRef.current) return;
    calledRef.current = true;

    const code = searchParams.get('code');
    const token = searchParams.get('token') || searchParams.get('accessToken');
    const refreshToken = searchParams.get('refreshToken') || searchParams.get('refresh_token');
    const errorParam = searchParams.get('error') || searchParams.get('error_description');

    if (errorParam) {
      setStep('error');
      setErrorMessage(`Google OAuth: ${errorParam}`);
      return;
    }

    // Direct token provided by backend redirect
    if (token) {
      setStep('backend');
      try {
        loginWithDirectToken(token, refreshToken || undefined);
        setStep('success');
        setTimeout(() => router.replace('/'), 1500);
      } catch (err: unknown) {
        setStep('error');
        setErrorMessage(err instanceof Error ? err.message : 'Invalid token received.');
      }
      return;
    }

    if (!code) {
      setStep('error');
      setErrorMessage('Không tìm thấy Authorization Code từ Google trong URL callback.');
      return;
    }

    // Authorization code flow
    setStep('backend');
    handleGoogleCallback(code)
      .then(() => {
        setStep('success');
        setTimeout(() => {
          router.replace('/');
        }, 1200);
      })
      .catch((err) => {
        setStep('error');
        setErrorMessage(
          err instanceof Error
            ? err.message
            : 'Xác thực với tài khoản Google thất bại.'
        );
      });
  }, [searchParams, handleGoogleCallback, loginWithDirectToken, router]);

  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'var(--bg-primary)',
        padding: '20px',
      }}
    >
      <div
        style={{
          width: '100%',
          maxWidth: '420px',
          background: 'var(--bg-card)',
          borderRadius: '24px',
          border: '1px solid var(--border-strong)',
          boxShadow: '0 20px 50px rgba(0,0,0,0.12)',
          padding: '36px 30px',
          textAlign: 'center',
        }}
      >
        {/* Brand Icon */}
        <div
          style={{
            width: '60px',
            height: '60px',
            background:
              step === 'error'
                ? 'rgba(239,68,68,0.1)'
                : step === 'success'
                ? 'rgba(34,197,94,0.1)'
                : 'linear-gradient(135deg, #6c63ff, #a78bfa)',
            borderRadius: '18px',
            margin: '0 auto 20px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow:
              step === 'error'
                ? '0 0 20px rgba(239,68,68,0.2)'
                : step === 'success'
                ? '0 0 20px rgba(34,197,94,0.2)'
                : '0 0 30px rgba(108,99,255,0.35)',
            transition: 'all 0.3s ease',
          }}
        >
          {step === 'error' ? (
            <AlertCircle size={30} color="#ef4444" />
          ) : step === 'success' ? (
            <CheckCircle2 size={32} color="#22c55e" />
          ) : (
            <Zap size={30} color="white" />
          )}
        </div>

        {/* Status Heading */}
        <h2
          style={{
            fontSize: '20px',
            fontWeight: 800,
            color: 'var(--text-primary)',
            marginBottom: '8px',
          }}
        >
          {step === 'reading' && 'Đang tiếp nhận mã từ Google…'}
          {step === 'backend' && 'Đang xác thực tài khoản…'}
          {step === 'success' && 'Đăng nhập thành công!'}
          {step === 'error' && 'Đăng nhập không thành công'}
        </h2>

        {/* Status Subtitle */}
        <p
          style={{
            fontSize: '14px',
            color: step === 'error' ? '#ef4444' : 'var(--text-secondary)',
            marginBottom: '24px',
            lineHeight: 1.5,
          }}
        >
          {step === 'reading' && 'Đã nhận xác nhận từ Google, đang chuẩn bị kết nối…'}
          {step === 'backend' && 'Đang hoàn tất phiên làm việc…'}
          {step === 'success' && 'Hệ thống đã nhận diện tài khoản. Đang chuyển hướng về trang chủ…'}
          {step === 'error' && (errorMessage || 'Đã có lỗi xảy ra trong quá trình đăng nhập.')}
        </p>

        {/* Action Buttons */}
        {step === 'error' ? (
          <button
            onClick={() => router.replace('/')}
            className="btn-secondary"
            style={{
              width: '100%',
              padding: '11px',
              fontSize: '14px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
            }}
          >
            <RefreshCw size={15} /> Quay về Trang chủ
          </button>
        ) : step === 'success' ? (
          <button
            onClick={() => router.replace('/')}
            className="btn-primary"
            style={{
              width: '100%',
              padding: '12px',
              fontSize: '14px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
            }}
          >
            Vào học ngay <ArrowRight size={16} />
          </button>
        ) : (
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', color: 'var(--text-muted)', fontSize: '13px' }}>
            <Loader2 size={16} style={{ animation: 'spin 1s linear infinite' }} /> Vui lòng đợi trong giây lát…
          </div>
        )}
      </div>

      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to   { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}

export default function AuthCallbackPage() {
  return (
    <Suspense
      fallback={
        <div
          style={{
            minHeight: '100vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'var(--bg-primary)',
          }}
        >
          <div style={{ textAlign: 'center' }}>
            <Loader2 size={36} color="#6c63ff" style={{ animation: 'spin 1s linear infinite' }} />
            <p style={{ marginTop: '12px', color: 'var(--text-secondary)', fontSize: '14px' }}>
              Đang tải xác thực…
            </p>
          </div>
        </div>
      }
    >
      <CallbackContent />
    </Suspense>
  );
}
