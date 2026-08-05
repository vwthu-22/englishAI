'use client';
import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  Home, Headphones, BookOpen, FolderOpen, 
  User, Zap, Menu, Clock, ChevronDown, ChevronUp, FileText, Folder,
  Sparkles, Globe
} from 'lucide-react';
import { useApp } from '@/context/AppContext';

export default function Sidebar() {
  const { user, sidebarOpen, setSidebarOpen, exercises } = useApp();
  const pathname = usePathname();
  const [recentOpen, setRecentOpen] = React.useState(true);
  const [quizOpen, setQuizOpen] = React.useState(true);

  const recentExercises = [...(exercises || [])]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 3);

  const isQuizActive = pathname === '/listening' || pathname === '/reading';

  return (
    <>
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <aside className={`sidebar ${sidebarOpen ? 'open' : ''}`} style={{ width: sidebarOpen ? '260px' : '72px' }}>
        {/* Logo */}
        <div className="flex items-center justify-between p-5 pb-4" style={{ borderBottom: '1px solid rgba(0,0,0,0.07)', flexDirection: sidebarOpen ? 'row' : 'column', gap: sidebarOpen ? '0' : '14px' }}>
          {sidebarOpen && (
            <div className="flex items-center gap-3 animate-fade-in">
              <div style={{
                width: '38px', height: '38px', flexShrink: 0,
                background: 'linear-gradient(135deg, #6c63ff, #a78bfa)',
                borderRadius: '10px',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                boxShadow: '0 0 20px rgba(108,99,255,0.4)',
                cursor: 'pointer'
              }}>
                <Zap size={20} color="white" />
              </div>
              <div>
                <span style={{ fontWeight: 800, fontSize: '18px', fontFamily: 'Plus Jakarta Sans' }} className="gradient-text">
                  EnglishAI
                </span>
                <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '-2px' }}>
                  Smart Learning
                </div>
              </div>
            </div>
          )}
          <button 
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="flex items-center justify-center rounded-lg hover:bg-white/10 transition-colors"
            style={{ 
              background: 'none', border: 'none', cursor: 'pointer', 
              color: 'var(--text-secondary)', width: '32px', height: '32px'
            }}
          >
            <Menu size={20} />
          </button>
        </div>

        {/* Nav Items */}
        <nav style={{ padding: '8px 12px', flex: 1, overflow: 'hidden auto' }}>
          {sidebarOpen && (
            <div style={{ fontSize: '10px', color: 'var(--text-muted)', fontWeight: 700, padding: '8px 4px 6px', textTransform: 'uppercase', letterSpacing: '0.07em' }}>
              Main Menu
            </div>
          )}

          {/* Home */}
          <Link href="/" className={`sidebar-item ${pathname === '/' ? 'active' : ''}`}
            style={{ marginBottom: '4px', justifyContent: sidebarOpen ? 'flex-start' : 'center' }}
            title={!sidebarOpen ? 'Home' : undefined}>
            <Home size={20} style={{ flexShrink: 0 }} />
            {sidebarOpen && <span style={{ fontSize: '14px', fontWeight: 500 }}>Home</span>}
          </Link>

          {/* AI Quiz — collapsible group */}
          {sidebarOpen ? (
            <div style={{ marginBottom: '4px' }}>
              <button
                onClick={() => setQuizOpen(!quizOpen)}
                className={`sidebar-item ${isQuizActive ? 'active' : ''}`}
                style={{
                  width: '100%', justifyContent: 'space-between',
                  background: isQuizActive ? 'rgba(91,91,214,0.12)' : 'none',
                  border: 'none', cursor: 'pointer'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <Sparkles size={20} style={{ flexShrink: 0 }} />
                  <span style={{ fontSize: '14px', fontWeight: 500 }}>AI Quiz</span>
                </div>
                {quizOpen ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
              </button>
              {quizOpen && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '2px', marginTop: '2px', paddingLeft: '20px' }}>
                  <Link href="/listening" className={`sidebar-item ${pathname === '/listening' ? 'active' : ''}`}
                    style={{ justifyContent: 'flex-start', padding: '8px 12px' }}>
                    <Headphones size={16} style={{ flexShrink: 0 }} />
                    <span style={{ fontSize: '13px', fontWeight: 500 }}>Listening</span>
                  </Link>
                  <Link href="/reading" className={`sidebar-item ${pathname === '/reading' ? 'active' : ''}`}
                    style={{ justifyContent: 'flex-start', padding: '8px 12px' }}>
                    <BookOpen size={16} style={{ flexShrink: 0 }} />
                    <span style={{ fontSize: '13px', fontWeight: 500 }}>Reading</span>
                  </Link>
                </div>
              )}
            </div>
          ) : (
            <Link href="/listening" className={`sidebar-item ${isQuizActive ? 'active' : ''}`}
              style={{ marginBottom: '4px', justifyContent: 'center' }}
              title="AI Quiz">
              <Sparkles size={20} style={{ flexShrink: 0 }} />
            </Link>
          )}

          {/* My Tests */}
          <Link href="/mytests" className={`sidebar-item ${pathname === '/mytests' ? 'active' : ''}`}
            style={{ marginBottom: '4px', justifyContent: sidebarOpen ? 'flex-start' : 'center' }}
            title={!sidebarOpen ? 'My Tests' : undefined}>
            <FolderOpen size={20} style={{ flexShrink: 0 }} />
            {sidebarOpen && <span style={{ fontSize: '14px', fontWeight: 500 }}>My Tests</span>}
          </Link>

          {/* Profile */}
          <Link href="/profile" className={`sidebar-item ${pathname === '/profile' ? 'active' : ''}`}
            style={{ marginBottom: '4px', justifyContent: sidebarOpen ? 'flex-start' : 'center' }}
            title={!sidebarOpen ? 'Profile' : undefined}>
            <User size={20} style={{ flexShrink: 0 }} />
            {sidebarOpen && <span style={{ fontSize: '14px', fontWeight: 500 }}>Profile</span>}
          </Link>

          {/* ── Collapsible Recent Section ── */}
          {sidebarOpen && (
            <div>
              <button
                onClick={() => setRecentOpen(!recentOpen)}
                style={{
                  width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                  padding: '10px 12px', borderRadius: '10px',
                  background: 'rgba(91,91,214,0.06)', border: 'none', cursor: 'pointer',
                  color: 'var(--text-secondary)', fontWeight: 600, fontSize: '13px'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Clock size={16} />
                  <span>Recent</span>
                </div>
                {recentOpen ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
              </button>

              {recentOpen && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', marginTop: '8px', padding: '0 4px' }}>
                  {recentExercises.map(ex => {
                    const isListening = ex.type === 'listening';
                    const iconColor = isListening ? '#3b82f6' : '#22c55e';
                    const Icon = isListening ? FileText : Folder;
                    return (
                      <Link key={ex.id} href={isListening ? '/listening' : '/reading'}
                        style={{
                          display: 'flex', alignItems: 'flex-start', gap: '10px',
                          padding: '8px 10px', borderRadius: '8px', textDecoration: 'none',
                          color: 'var(--text-primary)', transition: 'background 0.2s', cursor: 'pointer'
                        }}
                        className="hover:bg-gray-100"
                      >
                        <div style={{ marginTop: '2px', flexShrink: 0 }}>
                          <Icon size={16} style={{ color: iconColor }} />
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', minWidth: 0 }}>
                          <span style={{ fontSize: '12px', fontWeight: 500, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', display: 'block' }} title={ex.title}>
                            {ex.title}
                          </span>
                          <span style={{ fontSize: '10px', color: 'var(--text-muted)', marginTop: '2px' }}>
                            {ex.type === 'listening' ? 'Listening' : 'Reading'} • {ex.difficulty}
                          </span>
                        </div>
                      </Link>
                    );
                  })}
                  {recentExercises.length === 0 && (
                    <span style={{ fontSize: '11px', color: 'var(--text-muted)', padding: '8px 12px', textAlign: 'center' }}>
                      No recent exercises
                    </span>
                  )}
                </div>
              )}
            </div>
          )}
        </nav>
      </aside>
    </>
  );
}
