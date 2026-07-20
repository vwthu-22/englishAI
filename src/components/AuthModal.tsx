'use client';
import React, { useState } from 'react';
import { X, Mail, Lock, User, Eye, EyeOff, Zap } from 'lucide-react';
import { useApp } from '@/context/AppContext';

interface AuthModalProps {
  onClose: () => void;
  initialMode?: 'login' | 'register';
}

export default function AuthModal({ onClose, initialMode = 'login' }: AuthModalProps) {
  const [mode, setMode] = useState<'login' | 'register'>(initialMode);
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const { login } = useApp();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    login(email, password);
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="modal-content" style={{ maxWidth: '420px', position: 'relative' }}>
        {/* Logo */}
        <div className="text-center mb-7">
          <div style={{
            width: '56px', height: '56px',
            background: 'linear-gradient(135deg, #6c63ff, #a78bfa)',
            borderRadius: '16px', margin: '0 auto 12px',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: '0 0 30px rgba(108,99,255,0.4)'
          }}>
            <Zap size={28} color="white" />
          </div>
          <h2 style={{ fontSize: '24px', fontWeight: 800 }} className="gradient-text">
            {mode === 'login' ? 'Welcome back!' : 'Create an account'}
          </h2>
          <p className="text-sm mt-1" style={{ color: 'var(--text-muted)' }}>
            {mode === 'login' ? 'Sign in to continue learning' : 'Start your English learning journey'}
          </p>
        </div>

        {/* Tabs */}
        <div className="flex p-1 rounded-xl mb-6" style={{ background: 'rgba(255,255,255,0.04)' }}>
          {(['login', 'register'] as const).map(m => (
            <button
              key={m}
              onClick={() => setMode(m)}
              className="flex-1 py-2 rounded-lg text-sm font-semibold transition-all"
              style={{
                border: 'none', cursor: 'pointer',
                background: mode === m ? 'linear-gradient(135deg, #6c63ff, #8b5cf6)' : 'transparent',
                color: mode === m ? 'white' : 'var(--text-secondary)',
              }}
            >
              {m === 'login' ? 'Sign In' : 'Sign Up'}
            </button>
          ))}
        </div>

        <form onSubmit={handleSubmit}>
          {mode === 'register' && (
            <div className="mb-4">
              <label className="block text-sm mb-1.5" style={{ color: 'var(--text-secondary)' }}>Full Name</label>
              <div className="relative">
                <User size={16} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                <input type="text" className="input-field" placeholder="John Smith" value={name} onChange={e => setName(e.target.value)} style={{ paddingLeft: '42px' }} />
              </div>
            </div>
          )}

          <div className="mb-4">
            <label className="block text-sm mb-1.5" style={{ color: 'var(--text-secondary)' }}>Email</label>
            <div className="relative">
              <Mail size={16} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
              <input type="email" className="input-field" placeholder="email@example.com" value={email} onChange={e => setEmail(e.target.value)} style={{ paddingLeft: '42px' }} />
            </div>
          </div>

          <div className="mb-6">
            <label className="block text-sm mb-1.5" style={{ color: 'var(--text-secondary)' }}>Password</label>
            <div className="relative">
              <Lock size={16} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
              <input type={showPassword ? 'text' : 'password'} className="input-field" placeholder="••••••••" value={password} onChange={e => setPassword(e.target.value)} style={{ paddingLeft: '42px', paddingRight: '42px' }} />
              <button type="button" onClick={() => setShowPassword(!showPassword)}
                style={{ position: 'absolute', right: '14px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}>
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          <button type="submit" className="btn-primary w-full" style={{ padding: '13px', fontSize: '15px' }}>
            {mode === 'login' ? 'Sign In' : 'Create Account'}
          </button>
        </form>

        <button onClick={onClose} className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-lg"
          style={{ background: 'rgba(255,255,255,0.06)', border: 'none', cursor: 'pointer', color: 'var(--text-secondary)' }}>
          <X size={16} />
        </button>
      </div>
    </div>
  );
}
