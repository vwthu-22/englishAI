'use client';
import React from 'react';
import {
  Search, BookOpen, Headphones, ChevronRight, Bookmark,
  Clock, Star, TrendingUp, Flame, Sparkles
} from 'lucide-react';
import { useApp } from '@/context/AppContext';
import { useQuizStore } from '@/store/useQuizStore';
import { defaultQuizzes } from '@/lib/store';
import Link from 'next/link';

export default function HomePage() {
  const { user, exercises } = useApp();
  const [searchQuery, setSearchQuery] = React.useState('');

  // Continue reading = in-progress exercises
  const inProgress = exercises.filter(e => e.status === 'in-progress');
  // Recently completed
  const recentCompleted = [...exercises]
    .filter(e => e.status === 'completed')
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 6);
  // Best quizzes (from default quizzes)
  const bestQuizzes = defaultQuizzes.slice(0, 5);
  // Trending = exercises sorted by score
  const trending = [...exercises]
    .filter(e => e.status === 'completed' && e.score)
    .sort((a, b) => (b.score || 0) - (a.score || 0))
    .slice(0, 6);

  return (
    <div className="flex flex-col gap-5 md:gap-7 w-full max-w-5xl mx-auto">
      {/* Search Bar */}
      <div className="relative">
        <input
          type="text"
          placeholder="Search for courses, quizzes, or documents"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full"
          style={{
            padding: '12px 16px 12px 44px',
            background: 'var(--bg-card)',
            border: '1px solid var(--border)',
            borderRadius: '12px',
            fontSize: '14px',
            color: 'var(--text-primary)',
            outline: 'none',
          }}
        />
        <Search size={16} style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
      </div>

      {/* Welcome strip */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg md:text-xl font-bold" style={{ letterSpacing: '-0.3px' }}>
            Welcome back, <span className="gradient-text">{user?.name?.split(' ').pop()}</span> 👋
          </h2>
          <p className="text-xs md:text-sm mt-0.5" style={{ color: 'var(--text-muted)' }}>
            Keep your <span style={{ color: '#fbbf24' }}>{user?.streak}-day</span> streak going!
          </p>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold"
            style={{ background: 'rgba(245,158,11,0.12)', border: '1px solid rgba(245,158,11,0.2)', color: '#fbbf24' }}>
            <Flame size={13} /> {user?.streak} days
          </div>
          <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold"
            style={{ background: 'rgba(108,99,255,0.12)', border: '1px solid rgba(108,99,255,0.2)', color: '#a78bfa' }}>
            <Star size={13} /> {user?.level}
          </div>
        </div>
      </div>

      {/* Continue Reading */}
      {inProgress.length > 0 && (
        <Section title="Continue reading" icon={<BookOpen size={16} />}>
          <div className="flex gap-3 overflow-x-auto pb-2" style={{ scrollbarWidth: 'thin' }}>
            {inProgress.map(ex => (
              <Link key={ex.id} href={ex.type === 'listening' ? '/listening' : '/reading'}>
                <div className="flex-shrink-0 w-36 md:w-44 cursor-pointer group">
                  <div className="w-full h-24 md:h-28 rounded-xl mb-2 flex items-center justify-center relative overflow-hidden"
                    style={{
                      background: ex.type === 'listening'
                        ? 'linear-gradient(135deg, rgba(108,99,255,0.15), rgba(167,139,250,0.1))'
                        : 'linear-gradient(135deg, rgba(16,185,129,0.15), rgba(52,211,153,0.1))',
                      border: '1px solid var(--border)',
                    }}>
                    {ex.type === 'listening'
                      ? <Headphones size={28} color="#a78bfa" style={{ opacity: 0.6 }} />
                      : <BookOpen size={28} color="#34d399" style={{ opacity: 0.6 }} />
                    }
                    {/* Progress indicator */}
                    <div className="absolute bottom-0 left-0 right-0 h-1" style={{ background: 'rgba(0,0,0,0.08)' }}>
                      <div style={{ width: '40%', height: '100%', background: ex.type === 'listening' ? '#6c63ff' : '#10b981', borderRadius: '0 2px 0 0' }} />
                    </div>
                  </div>
                  <p className="text-xs font-medium truncate group-hover:text-violet-600 transition-colors">{ex.title}</p>
                  <div className="flex items-center gap-1 mt-0.5">
                    <span className="text-[10px]" style={{ color: 'var(--text-muted)' }}>{ex.topic}</span>
                  </div>
                  <button className="mt-1.5 flex items-center gap-1 text-[10px] font-semibold" style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#6c63ff', padding: 0 }}>
                    <Bookmark size={10} /> Save
                  </button>
                </div>
              </Link>
            ))}
          </div>
        </Section>
      )}

      {/* Recently Viewed / Completed */}
      {recentCompleted.length > 0 && (
        <Section title="Recently viewed" icon={<Clock size={16} />}>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
            {recentCompleted.map(ex => (
              <Link key={ex.id} href={ex.type === 'listening' ? '/listening' : '/reading'}>
                <div className="card p-3 cursor-pointer hover:border-violet-200 transition-all group" style={{ border: '1px solid var(--border)' }}>
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0"
                      style={{ background: ex.type === 'listening' ? 'rgba(108,99,255,0.12)' : 'rgba(16,185,129,0.12)' }}>
                      {ex.type === 'listening' ? <Headphones size={13} color="#a78bfa" /> : <BookOpen size={13} color="#34d399" />}
                    </div>
                    {ex.score && (
                      <span className="text-[10px] font-bold ml-auto" style={{ color: ex.score >= 80 ? '#34d399' : '#fbbf24' }}>
                        {ex.score}%
                      </span>
                    )}
                  </div>
                  <p className="text-xs font-semibold truncate group-hover:text-violet-600 transition-colors">{ex.title}</p>
                  <p className="text-[10px] mt-0.5 truncate" style={{ color: 'var(--text-muted)' }}>
                    {ex.type === 'listening' ? 'Listening' : 'Reading'} • {ex.difficulty}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </Section>
      )}

      {/* Best quizzes for you */}
      <Section title="Best quizzes for you" icon={<Sparkles size={16} />}>
        <div className="flex gap-3 overflow-x-auto pb-2" style={{ scrollbarWidth: 'thin' }}>
          {bestQuizzes.map((quiz) => (
            <Link key={quiz.id} href={quiz.type === 'listening' ? '/listening' : '/reading'}>
              <div className="flex-shrink-0 w-44 md:w-52 card p-3 cursor-pointer hover:border-violet-200 transition-all group" style={{ border: '1px solid var(--border)' }}>
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-8 h-8 rounded-lg flex items-center justify-center"
                    style={{ background: quiz.type === 'listening' ? 'rgba(108,99,255,0.12)' : 'rgba(16,185,129,0.12)' }}>
                    {quiz.type === 'listening' ? <Headphones size={14} color="#a78bfa" /> : <BookOpen size={14} color="#34d399" />}
                  </div>
                </div>
                <p className="text-xs font-semibold truncate group-hover:text-violet-600 transition-colors">{quiz.title}</p>
                <p className="text-[10px] mt-0.5 truncate" style={{ color: 'var(--text-muted)' }}>{quiz.topic}</p>
                <div className="flex items-center gap-1 mt-2">
                  <span className="text-[10px] font-semibold" style={{ color: '#6c63ff' }}>Start quiz →</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </Section>

      {/* Trending in your courses */}
      {trending.length > 0 && (
        <Section title="Trending in your courses" icon={<TrendingUp size={16} />}>
          <div className="flex gap-3 overflow-x-auto pb-2" style={{ scrollbarWidth: 'thin' }}>
            {trending.map(ex => (
              <Link key={ex.id} href={ex.type === 'listening' ? '/listening' : '/reading'}>
                <div className="flex-shrink-0 w-36 md:w-44 cursor-pointer group">
                  <div className="w-full h-24 md:h-28 rounded-xl mb-2 flex items-center justify-center"
                    style={{
                      background: ex.type === 'listening'
                        ? 'linear-gradient(135deg, rgba(108,99,255,0.1), rgba(167,139,250,0.05))'
                        : 'linear-gradient(135deg, rgba(16,185,129,0.1), rgba(52,211,153,0.05))',
                      border: '1px solid var(--border)',
                    }}>
                    {ex.type === 'listening'
                      ? <Headphones size={26} color="#a78bfa" style={{ opacity: 0.5 }} />
                      : <BookOpen size={26} color="#34d399" style={{ opacity: 0.5 }} />
                    }
                  </div>
                  <p className="text-xs font-medium truncate group-hover:text-violet-600 transition-colors">{ex.title}</p>
                  <div className="flex items-center gap-1 mt-0.5">
                    <span className="text-[10px]" style={{ color: 'var(--text-muted)' }}>{ex.difficulty}</span>
                    {ex.score && (
                      <span className="text-[10px] font-bold ml-auto" style={{ color: '#34d399' }}>{ex.score}%</span>
                    )}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </Section>
      )}
    </div>
  );
}

/* Reusable section wrapper */
function Section({ title, icon, children }: { title: string; icon: React.ReactNode; children: React.ReactNode }) {
  return (
    <div>
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <span style={{ color: 'var(--text-secondary)' }}>{icon}</span>
          <h3 className="text-sm md:text-base font-bold" style={{ letterSpacing: '-0.2px' }}>{title}</h3>
        </div>
        <button className="flex items-center gap-0.5 text-xs font-medium"
          style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}>
          See all <ChevronRight size={13} />
        </button>
      </div>
      {children}
    </div>
  );
}
