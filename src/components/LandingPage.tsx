'use client';
import React, { useState, useEffect } from 'react';
import {
  Search, Headphones, BookOpen, Star, ArrowRight,
  Zap, Users, FileText, ChevronDown, CheckCircle,
  HelpCircle, Sparkles, MessageSquare, Award, Clock
} from 'lucide-react';
import AuthModal from './AuthModal';
import { useQuizStore } from '@/store/useQuizStore';
import { QuizItem, defaultQuizzes } from '@/lib/store';
import { useApp } from '@/context/AppContext';
import Link from 'next/link';


const tags = [
  'IELTS Reading',
  'TED Talks',
  'BBC Learning',
  'Psychology',
  'Technology',
  'Climate Change',
  'Academic Passage',
  'B2 Listening',
  'C1 Advanced',
  'Beginner A2'
];

export default function LandingPage() {
  const { isLoggedIn } = useApp();
  const [showAuth, setShowAuth] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');
  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState<'all' | 'listening' | 'reading'>('all');
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const quizzes = useQuizStore((state) => state.landingQuizzes);
  const setLandingQuizzes = useQuizStore((state) => state.setLandingQuizzes);
  const [showHeaderSearch, setShowHeaderSearch] = useState(false);

  // Load any published community quizzes on mount and listen to scroll
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const listening = JSON.parse(localStorage.getItem('published_listening_quizzes') || '[]');
      const reading = JSON.parse(localStorage.getItem('published_reading_quizzes') || '[]');
      const community = [
        ...listening.map((q: any) => ({
          id: q.id,
          title: q.title,
          type: 'listening' as const,
          topic: 'Listening Practice',
          difficulty: q.difficulty,
          questionCount: q.questionCount || 10,
          author: q.author || 'Community',
          publishedAt: q.publishedAt || 'Recent',
          rating: q.rating || 4.5
        })),
        ...reading.map((q: any) => ({
          id: q.id,
          title: q.title,
          type: 'reading' as const,
          topic: 'Reading Passage',
          difficulty: q.difficulty,
          questionCount: q.questionCount || 10,
          author: q.author || 'Community',
          publishedAt: q.publishedAt || 'Recent',
          rating: q.rating || 4.5
        }))
      ];
      if (community.length > 0) {
        setLandingQuizzes([...defaultQuizzes, ...community]);
      }
    }
  }, [setLandingQuizzes]);

  useEffect(() => {
    const handleScroll = () => {
      const heroSearchElement = document.getElementById('hero-search-form');
      if (heroSearchElement) {
        const rect = heroSearchElement.getBoundingClientRect();
        // If bottom of hero search is above 70px (header height), show header search
        setShowHeaderSearch(rect.bottom < 70);
      } else {
        setShowHeaderSearch(window.scrollY > 300);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const target = document.getElementById('explore-section');
    if (target) {
      target.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleTagClick = (tag: string) => {
    if (selectedTag === tag) {
      setSelectedTag(null);
      setSearchQuery('');
    } else {
      setSelectedTag(tag);
      setSearchQuery(tag);
      const target = document.getElementById('explore-section');
      if (target) {
        target.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  const filteredQuizzes = quizzes.filter(q => {
    const matchesSearch =
      q.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      q.topic.toLowerCase().includes(searchQuery.toLowerCase()) ||
      q.difficulty.toLowerCase().includes(searchQuery.toLowerCase()) ||
      q.author.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesType =
      typeFilter === 'all' || q.type === typeFilter;

    return matchesSearch && matchesType;
  });

  return (
    <div style={{ background: '#f9fafb', minHeight: '100vh' }}>
      <style>{`
        .sg { font-family: 'Space Grotesk', sans-serif; }

        @keyframes float-1 { 0%,100%{transform:translate(0,0) scale(1)} 50%{transform:translate(-30px,20px) scale(1.05)} }
        @keyframes float-2 { 0%,100%{transform:translate(0,0) scale(1)} 50%{transform:translate(40px,-30px) scale(1.1)} }
        @keyframes float-3 { 0%,100%{transform:translate(0,0) scale(1)} 50%{transform:translate(-20px,-40px) scale(.95)} }
        @keyframes float-4 { 0%,100%{transform:translate(0,0) scale(1)} 50%{transform:translate(30px,30px) scale(1.05)} }
        @keyframes shimmer { 0%{background-position:-200% 0} 100%{background-position:200% 0} }
        @keyframes pulse-glow { 0%,100%{box-shadow:0 0 20px rgba(139,92,246,0.15)} 50%{box-shadow:0 0 40px rgba(139,92,246,0.3)} }
        @keyframes gradient-shift { 0%{background-position:0% 50%} 50%{background-position:100% 50%} 100%{background-position:0% 50%} }

        .blob-float-1 { animation: float-1 12s ease-in-out infinite; }
        .blob-float-2 { animation: float-2 15s ease-in-out infinite; }
        .blob-float-3 { animation: float-3 10s ease-in-out infinite; }
        .blob-float-4 { animation: float-4 14s ease-in-out infinite; }

        .landing-card-hover { transition: all 0.3s cubic-bezier(0.4,0,0.2,1); }
        .landing-card-hover:hover { transform: translateY(-4px); box-shadow: 0 20px 40px rgba(0,0,0,0.08) !important; border-color: rgba(139,92,246,0.2) !important; }

        .hero-gradient-text {
          background: linear-gradient(135deg, #fff 0%, #c4b5fd 40%, #a78bfa 60%, #fff 100%);
          background-size: 200% auto;
          -webkit-background-clip: text; background-clip: text; -webkit-text-fill-color: transparent;
          animation: shimmer 4s linear infinite;
        }
        .cta-glow { animation: pulse-glow 3s ease-in-out infinite; }

        .grain-overlay::after {
          content:''; position:absolute; inset:0; opacity:0.03; pointer-events:none;
          background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E");
        }

        /* Responsive */
        .landing-header { padding: 14px 40px !important; }
        .landing-header-search { display: block !important; }
        .landing-signin-btn { display: inline-block !important; }
        .landing-hero { padding: 150px 24px 100px !important; }
        .landing-hero h1 { font-size: 52px !important; }
        .landing-section { padding: 80px 40px !important; }
        .landing-explore { padding: 80px 40px !important; }
        .landing-quiz-grid { grid-template-columns: repeat(auto-fill, minmax(320px, 1fr)) !important; }
        .landing-footer { padding: 80px 40px !important; }
        .landing-footer-bottom { flex-direction: row !important; }

        @media (max-width: 768px) {
          .landing-header { padding: 12px 16px !important; }
          .landing-header-search { display: none !important; }
          .landing-signin-btn { display: none !important; }
          .landing-hero { padding: 110px 16px 70px !important; }
          .landing-hero h1 { font-size: 32px !important; letter-spacing: -0.5px !important; }
          .landing-hero p { font-size: 14px !important; }
          .landing-hero-search input { font-size: 14px !important; padding: 14px 16px 14px 44px !important; }
          .landing-hero-search button { padding: 8px 16px !important; font-size: 12px !important; }
          .landing-section { padding: 50px 16px !important; }
          .landing-explore { padding: 50px 16px !important; }
          .landing-quiz-grid { grid-template-columns: 1fr !important; }
          .landing-features-grid { grid-template-columns: 1fr !important; gap: 24px !important; }
          .landing-reviews-grid { grid-template-columns: 1fr !important; }
          .landing-stats-grid { grid-template-columns: 1fr !important; gap: 12px !important; }
          .landing-footer { padding: 50px 16px !important; }
          .landing-footer h2 { font-size: 22px !important; }
          .landing-footer-bottom { flex-direction: column !important; gap: 10px !important; text-align: center !important; }
          .landing-filter-row { flex-direction: column !important; align-items: flex-start !important; gap: 8px !important; }
        }
        @media (max-width: 480px) {
          .landing-hero h1 { font-size: 26px !important; }
          .landing-hero-search button { display: none !important; }
          .landing-stats-num { font-size: 32px !important; }
        }
      `}</style>

      {/* --- HEADER --- */}
      <header className="landing-header" style={{
        background: 'rgba(26,11,46,0.85)',
        backdropFilter: 'blur(20px)',
        padding: '14px 40px',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        borderBottom: '1px solid rgba(255,255,255,0.06)',
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 50
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '28px', flex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }} onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
            <div style={{
              width: '32px', height: '32px',
              background: 'linear-gradient(135deg, #8b5cf6, #a78bfa)',
              borderRadius: '9px',
              display: 'flex', alignItems: 'center', justifyContent: 'center'
            }}>
              <Zap size={16} color="white" />
            </div>
            <span className="sg" style={{ fontSize: '18px', fontWeight: 700, color: 'white', letterSpacing: '-0.3px' }}>EnglishAI</span>
          </div>

          <form onSubmit={handleSearchSubmit} style={{
            position: 'relative', width: '280px',
            opacity: showHeaderSearch ? 1 : 0,
            transform: showHeaderSearch ? 'translateX(0)' : 'translateX(-10px)',
            pointerEvents: showHeaderSearch ? 'auto' : 'none',
            transition: 'opacity 0.2s, transform 0.2s'
          }} className="landing-header-search hidden md:block">
            <input type="text" placeholder="Search quizzes..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}
              style={{
                width: '100%', padding: '8px 14px 8px 36px',
                background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.15)',
                borderRadius: '9999px', fontSize: '13px', color: 'white', outline: 'none'
              }}
              onFocus={(e) => { e.target.style.borderColor = '#a78bfa'; }}
              onBlur={(e) => { e.target.style.borderColor = 'rgba(255,255,255,0.15)'; }}
            />
            <Search size={13} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#9ca3af' }} />
          </form>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          {isLoggedIn ? (
            <Link href="/"
              style={{
                background: 'linear-gradient(135deg, #8b5cf6, #7c3aed)',
                color: 'white', border: 'none', borderRadius: '9999px',
                padding: '7px 20px', fontSize: '13px', fontWeight: 600, cursor: 'pointer',
                boxShadow: '0 2px 12px rgba(139,92,246,0.3)',
                display: 'flex', alignItems: 'center', gap: '6px',
                textDecoration: 'none'
              }}>
              Go to Dashboard <ArrowRight size={14} />
            </Link>
          ) : (
            <>
              <button onClick={() => { setAuthMode('login'); setShowAuth(true); }}
                className="landing-signin-btn"
                style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.8)', fontSize: '13px', fontWeight: 500, cursor: 'pointer' }}>
                Sign In
              </button>
              <button onClick={() => { setAuthMode('register'); setShowAuth(true); }}
                style={{
                  background: 'linear-gradient(135deg, #8b5cf6, #7c3aed)',
                  color: 'white', border: 'none', borderRadius: '9999px',
                  padding: '7px 18px', fontSize: '13px', fontWeight: 600, cursor: 'pointer',
                  boxShadow: '0 2px 12px rgba(139,92,246,0.3)'
                }}>
                Get Started
              </button>
            </>
          )}
        </div>
      </header>

      {/* --- HERO SECTION --- */}
      <section className="landing-hero grain-overlay" style={{
        background: 'linear-gradient(160deg, #1A0B2E 0%, #2d1654 40%, #1A0B2E 100%)',
        padding: '150px 20px 100px',
        position: 'relative', overflow: 'hidden', textAlign: 'center'
      }}>
        {/* Floating blobs */}
        <div className="blob-float-1" style={{ position:'absolute', left:'-50px', top:'20%', width:'160px', height:'160px', borderRadius:'50%', background:'#8b5cf6', filter:'blur(80px)', opacity:0.2, pointerEvents:'none' }} />
        <div className="blob-float-2" style={{ position:'absolute', right:'5%', top:'5%', width:'200px', height:'200px', borderRadius:'50%', background:'#f472b6', filter:'blur(100px)', opacity:0.15, pointerEvents:'none' }} />
        <div className="blob-float-3" style={{ position:'absolute', right:'-40px', top:'40%', width:'180px', height:'180px', borderRadius:'50%', background:'#34d399', filter:'blur(90px)', opacity:0.12, pointerEvents:'none' }} />
        <div className="blob-float-4" style={{ position:'absolute', left:'15%', top:'65%', width:'120px', height:'120px', borderRadius:'50%', background:'#fbbf24', filter:'blur(70px)', opacity:0.15, pointerEvents:'none' }} />

        <div style={{ maxWidth: '720px', margin: '0 auto', position: 'relative', zIndex: 10 }}>
          <div style={{ display: 'inline-block', padding: '4px 14px', borderRadius: '9999px', background: 'rgba(139,92,246,0.15)', border: '1px solid rgba(139,92,246,0.25)', fontSize: '12px', fontWeight: 600, color: '#c4b5fd', marginBottom: '20px', letterSpacing: '0.5px' }}>
            ✨ AI-Powered Learning Platform
          </div>
          <h1 className="sg" style={{
            fontSize: '52px', fontWeight: 700, color: 'white',
            marginBottom: '14px', lineHeight: 1.1, letterSpacing: '-1.5px'
          }}>
            Grow smarter,{' '}
            <span className="hero-gradient-text">together</span>
          </h1>
          <p style={{ fontSize: '16px', color: 'rgba(255,255,255,0.6)', maxWidth: '480px', margin: '0 auto 32px', lineHeight: 1.6 }}>
            Find top-rated listening transcripts and reading passages from students worldwide.
          </p>

          {/* Search bar */}
          <form id="hero-search-form" onSubmit={handleSearchSubmit} className="landing-hero-search" style={{
            maxWidth: '580px', margin: '0 auto', position: 'relative',
            boxShadow: '0 8px 32px rgba(0,0,0,0.3), 0 0 0 1px rgba(255,255,255,0.05)', borderRadius: '9999px'
          }}>
            <input type="text" placeholder="Search for listening videos, IELTS readings, or topics..."
              value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}
              style={{
                width: '100%', padding: '16px 20px 16px 50px',
                background: 'rgba(255,255,255,0.95)', border: 'none',
                borderRadius: '9999px', fontSize: '14px', color: '#1f2937', outline: 'none'
              }}
            />
            <Search size={18} style={{ position: 'absolute', left: '18px', top: '50%', transform: 'translateY(-50%)', color: '#9ca3af' }} />
            <button type="submit" style={{
              position: 'absolute', right: '6px', top: '50%', transform: 'translateY(-50%)',
              background: 'linear-gradient(135deg, #8b5cf6, #7c3aed)', color: 'white',
              border: 'none', borderRadius: '9999px', padding: '10px 22px',
              fontWeight: 600, fontSize: '13px', cursor: 'pointer'
            }}>
              Search
            </button>
          </form>

          <div style={{ marginTop: '50px', cursor: 'pointer', color: 'rgba(255,255,255,0.25)', display: 'flex', justifyContent: 'center' }}
            onClick={() => document.getElementById('stats-section')?.scrollIntoView({ behavior: 'smooth' })}>
            <ChevronDown size={24} className="animate-bounce" />
          </div>
        </div>
      </section>

      {/* --- STATISTICS SECTION --- */}
      <section id="stats-section" className="landing-section" style={{
        background: '#ffffff',
        padding: '70px 40px',
        borderBottom: '1px solid #f3f4f6',
        textAlign: 'center'
      }}>
        <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
          <h2 className="sg" style={{ fontSize: '24px', fontWeight: 700, color: '#1f2937', marginBottom: '6px', letterSpacing: '-0.5px' }}>
            Millions of students helped, and counting
          </h2>
          <p style={{ fontSize: '14px', color: '#9ca3af', marginBottom: '40px' }}>
            New study materials added every day, from the world's most active student communities
          </p>

          <div className="landing-stats-grid" style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
            gap: '30px'
          }}>
            {[
              { num: '65M+', label: 'Study resources', badge: 'Free study material', bg: '#fef3c7', color: '#d97706' },
              { num: '180K+', label: 'Institutions', badge: 'In 180+ countries', bg: '#d1fae5', color: '#059669' },
              { num: '35M+', label: 'Active Users', badge: 'Every month', bg: '#ffedd5', color: '#ea580c' }
            ].map((stat, i) => (
              <div key={i} className="card landing-card-hover" style={{
                padding: '28px 24px',
                border: '1px solid rgba(0,0,0,0.06)',
                borderRadius: '14px',
                textAlign: 'center',
                boxShadow: '0 2px 12px rgba(0,0,0,0.03)'
              }}>
                <div className="landing-stats-num sg" style={{ fontSize: '40px', fontWeight: 700, color: '#1A0B2E', marginBottom: '2px' }}>{stat.num}</div>
                <div style={{ fontSize: '14px', fontWeight: 600, color: '#4b5563', marginBottom: '12px' }}>{stat.label}</div>
                <span style={{
                  display: 'inline-block',
                  padding: '4px 12px',
                  borderRadius: '9999px',
                  background: stat.bg,
                  color: stat.color,
                  fontSize: '11px',
                  fontWeight: 700
                }}>
                  {stat.badge}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* --- EXPLORE SECTION / ONLY THE BEST FOR THE BEST --- */}
      <section id="explore-section" className="landing-explore" style={{
        padding: '80px 40px',
        maxWidth: '1200px',
        margin: '0 auto'
      }}>
        <div style={{ textAlign: 'center', marginBottom: '48px' }}>
          <h2 className="sg" style={{ fontSize: '26px', fontWeight: 700, color: '#1f2937', marginBottom: '6px', letterSpacing: '-0.5px' }}>
            Only the best for the best
          </h2>
          <p style={{ fontSize: '14px', color: '#9ca3af' }}>
            Find the best study documents to see your way through education.
          </p>
        </div>

        {/* Tags cloud */}
        <div style={{
          display: 'flex',
          flexWrap: 'wrap',
          justifyContent: 'center',
          gap: '10px',
          maxWidth: '850px',
          margin: '0 auto 36px'
        }}>
          {tags.map((tag) => {
            const isActive = selectedTag === tag;
            return (
              <button
                key={tag}
                onClick={() => handleTagClick(tag)}
                style={{
                  background: isActive ? '#8b5cf6' : 'white',
                  color: isActive ? 'white' : '#4b5563',
                  border: `1px solid ${isActive ? '#8b5cf6' : '#e5e7eb'}`,
                  borderRadius: '9999px',
                  padding: '8px 18px',
                  fontSize: '13px',
                  fontWeight: 500,
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.03)'
                }}
                className="hover:border-violet-400"
              >
                {tag}
              </button>
            );
          })}
        </div>

        {/* Module Filter Switcher & Counter */}
        <div className="landing-filter-row" style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          borderBottom: '1px solid #e5e7eb',
          paddingBottom: '16px',
          marginBottom: '28px'
        }}>
          <div style={{ display: 'flex', gap: '8px' }}>
            {(['all', 'listening', 'reading'] as const).map((filter) => (
              <button
                key={filter}
                onClick={() => setTypeFilter(filter)}
                style={{
                  background: typeFilter === filter ? 'rgba(139, 92, 246, 0.1)' : 'transparent',
                  color: typeFilter === filter ? '#8b5cf6' : '#6b7280',
                  border: 'none',
                  borderRadius: '8px',
                  padding: '8px 16px',
                  fontSize: '14px',
                  fontWeight: 600,
                  cursor: 'pointer',
                  textTransform: 'capitalize'
                }}
              >
                {filter}
              </button>
            ))}
          </div>

          <div style={{ fontSize: '13px', color: '#9ca3af' }}>
            Showing {filteredQuizzes.length} exercises
          </div>
        </div>

        {/* Quizzes List */}
        {filteredQuizzes.length > 0 ? (
          <div className="landing-quiz-grid" style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))',
            gap: '20px'
          }}>
            {filteredQuizzes.map((quiz) => (
              <div
                key={quiz.id}
                className="card landing-card-hover group flex flex-col justify-between"
                style={{
                  padding: '18px',
                  border: '1px solid rgba(0,0,0,0.06)',
                  borderRadius: '14px',
                  background: 'white',
                  cursor: 'pointer',
                  transition: 'all 0.2s'
                }}
                onClick={() => { setAuthMode('login'); setShowAuth(true); }}
              >
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '14px' }}>
                    <div style={{
                      width: '40px', height: '40px', borderRadius: '12px',
                      background: quiz.type === 'listening' ? 'rgba(108,99,255,0.1)' : 'rgba(16,185,129,0.1)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center'
                    }}>
                      {quiz.type === 'listening'
                        ? <Headphones size={18} color="#6c63ff" />
                        : <BookOpen size={18} color="#10b981" />
                      }
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px', background: '#fef08a', color: '#854d0e', padding: '3px 8px', borderRadius: '6px', fontSize: '11px', fontWeight: 700 }}>
                      <Star size={11} fill="#854d0e" /> {quiz.rating.toFixed(1)}
                    </div>
                  </div>

                  <h3 style={{
                    fontSize: '16px',
                    fontWeight: 700,
                    color: '#1f2937',
                    lineHeight: '1.4',
                    marginBottom: '8px'
                  }} className="group-hover:text-violet-600 transition-colors">
                    {quiz.title}
                  </h3>

                  <p style={{ fontSize: '12px', color: '#9ca3af', marginBottom: '16px' }}>
                    Topic: {quiz.topic}
                  </p>
                </div>

                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
                    <span style={{
                      fontSize: '11px', fontWeight: 600, padding: '3px 8px', borderRadius: '6px',
                      background: quiz.type === 'listening' ? 'rgba(108,99,255,0.08)' : 'rgba(16,185,129,0.08)',
                      color: quiz.type === 'listening' ? '#6c63ff' : '#10b981',
                      border: `1px solid ${quiz.type === 'listening' ? 'rgba(108,99,255,0.15)' : 'rgba(16,185,129,0.15)'}`
                    }}>
                      {quiz.difficulty}
                    </span>
                    <span style={{ fontSize: '12px', color: '#6b7280', display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <Clock size={12} /> {quiz.questionCount} Questions
                    </span>
                  </div>

                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    borderTop: '1px solid #f3f4f6',
                    paddingTop: '12px',
                    fontSize: '12px',
                    color: '#9ca3af'
                  }}>
                    <span>By {quiz.author}</span>
                    <span>{quiz.publishedAt}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div style={{ textAlign: 'center', padding: '60px 20px', background: 'white', borderRadius: '16px', border: '1px dashed #d1d5db' }}>
            <HelpCircle size={40} style={{ color: '#9ca3af', margin: '0 auto 12px' }} />
            <h3 style={{ fontSize: '16px', fontWeight: 600, color: '#4b5563', marginBottom: '4px' }}>No documents matched your search</h3>
            <p style={{ fontSize: '13px', color: '#9ca3af' }}>Try looking for "IELTS", "TED" or click "All" to reset filters.</p>
          </div>
        )}
      </section>

      {/* --- FEATURE HIGHLIGHTS SECTION --- */}
      <section style={{
        background: '#ffffff',
        padding: '90px 40px',
        borderTop: '1px solid #f3f4f6',
        borderBottom: '1px solid #f3f4f6'
      }}>
        <div style={{ maxWidth: '1000px', margin: '0 auto', textAlign: 'center' }}>
          <h2 className="sg" style={{ fontSize: '26px', fontWeight: 700, color: '#1f2937', marginBottom: '6px', letterSpacing: '-0.5px' }}>
            Ace your studies with EnglishAI
          </h2>
          <p style={{ fontSize: '14px', color: '#9ca3af', marginBottom: '48px' }}>
            We turn your study materials into interactive tools that help you study better.
          </p>

          <div className="landing-features-grid" style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: '40px',
            textAlign: 'left'
          }}>
            {[
              {
                icon: <CheckCircle size={22} color="#10b981" />,
                title: 'Practice with Quizzes & Exams',
                desc: 'Instantly generate vocabulary, multiple-choice, true/false, or matching questions from videos and reading articles.'
              },
              {
                icon: <Sparkles size={22} color="#8b5cf6" />,
                title: 'Get Free AI Summaries',
                desc: 'Generate smart insights, vocabulary lists, and concise summaries so you can review key points in minutes.'
              },
              {
                icon: <MessageSquare size={22} color="#3b82f6" />,
                title: 'Study with your friends',
                desc: 'Share, save, bookmark, and publish your generated exercises to build a combined knowledge base.'
              }
            ].map((feat, i) => (
              <div key={i} style={{ display: 'flex', gap: '16px' }}>
                <div style={{
                  width: '44px', height: '44px', borderRadius: '12px',
                  background: '#f3f4f6', display: 'flex', alignItems: 'center', justifyContent: 'center',
                  flexShrink: 0
                }}>
                  {feat.icon}
                </div>
                <div>
                  <h3 style={{ fontSize: '16px', fontWeight: 700, color: '#1f2937', marginBottom: '6px' }}>
                    {feat.title}
                  </h3>
                  <p style={{ fontSize: '13px', color: '#6b7280', lineHeight: '1.5' }}>
                    {feat.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>

          <button
            onClick={() => { setAuthMode('register'); setShowAuth(true); }}
            style={{
              background: '#1f2937',
              color: 'white',
              border: 'none',
              borderRadius: '9999px',
              padding: '12px 36px',
              fontSize: '15px',
              fontWeight: 600,
              cursor: 'pointer',
              marginTop: '56px',
              boxShadow: '0 4px 14px rgba(31, 41, 55, 0.25)',
              transition: 'all 0.2s'
            }}
            className="hover:bg-gray-800"
          >
            Try EnglishAI
          </button>
        </div>
      </section>

      {/* --- STUDENT REVIEWS SECTION --- */}
      <section style={{
        padding: '80px 40px',
        background: '#f9fafb',
        textAlign: 'center'
      }}>
        <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
          <h2 className="sg" style={{ fontSize: '26px', fontWeight: 700, color: '#1f2937', marginBottom: '36px', letterSpacing: '-0.5px' }}>
            What students love about EnglishAI
          </h2>

          <div className="landing-reviews-grid" style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: '24px'
          }}>
            {[
              {
                title: 'Excellent structure!',
                content: 'It completely changed how I practice my English. AI-generated questions are spot on and let me practice listening on any topic.',
                stars: 5,
                author: 'Trần Minh H.',
                role: 'High School Student'
              },
              {
                title: 'A complete game changer ⚡',
                content: 'Being able to turn any YouTube video or news passage into an interactive quiz is mind-blowing. Highly recommended.',
                stars: 5,
                author: 'Lê Thuỳ L.',
                role: 'University Student'
              },
              {
                title: 'Great for IELTS prep',
                content: 'The reading section is extremely close to the real exams. I can practice and preview answers with detailed explanations.',
                stars: 5,
                author: 'Nguyễn Quốc A.',
                role: 'IELTS candidate'
              }
            ].map((rev, i) => (
              <div key={i} className="card landing-card-hover" style={{
                padding: '22px',
                background: 'white',
                border: '1px solid rgba(0,0,0,0.06)',
                borderRadius: '14px',
                textAlign: 'left',
                boxShadow: '0 2px 12px rgba(0,0,0,0.02)'
              }}>
                <div style={{ display: 'flex', gap: '2px', marginBottom: '12px' }}>
                  {Array.from({ length: rev.stars }).map((_, s) => (
                    <Star key={s} size={14} fill="#fbbf24" color="#fbbf24" />
                  ))}
                </div>
                <h4 style={{ fontSize: '15px', fontWeight: 700, color: '#1f2937', marginBottom: '8px' }}>{rev.title}</h4>
                <p style={{ fontSize: '13px', color: '#6b7280', lineHeight: '1.5', marginBottom: '16px' }}>"{rev.content}"</p>
                <div style={{ borderTop: '1px solid #f3f4f6', paddingTop: '12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '12px', fontWeight: 600, color: '#4b5563' }}>{rev.author}</span>
                  <span style={{ fontSize: '11px', color: '#9ca3af' }}>{rev.role}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* --- FOOTER SECTION --- */}
      <footer className="landing-footer grain-overlay" style={{
        background: 'linear-gradient(160deg, #1A0B2E, #2d1654)',
        padding: '80px 40px',
        textAlign: 'center',
        color: 'white',
        position: 'relative'
      }}>
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
          <h2 className="sg" style={{ fontSize: '30px', fontWeight: 700, marginBottom: '14px', letterSpacing: '-0.5px' }}>
            Ready to level up?
          </h2>
          <p style={{ fontSize: '14px', color: 'rgba(255,255,255,0.6)', maxWidth: '440px', margin: '0 auto 36px', lineHeight: 1.6 }}>
            Join millions of students worldwide who are level up their English skills using artificial intelligence.
          </p>

          <button
            onClick={() => { setAuthMode('register'); setShowAuth(true); }}
            className="cta-glow"
            style={{
              background: 'linear-gradient(135deg, #8b5cf6, #7c3aed)',
              color: 'white',
              border: 'none',
              borderRadius: '9999px',
              padding: '14px 36px',
              fontSize: '15px',
              fontWeight: 600,
              cursor: 'pointer',
              transition: 'all 0.2s'
            }}
          >
            Get Started For Free
          </button>

          <div className="landing-footer-bottom" style={{ marginTop: '80px', borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '32px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '13px', color: 'rgba(255,255,255,0.6)' }}>
            <span>© 2026 EnglishAI. All rights reserved.</span>
            <div style={{ display: 'flex', gap: '20px' }}>
              <span style={{ cursor: 'pointer' }} onClick={() => { setAuthMode('login'); setShowAuth(true); }}>Privacy Policy</span>
              <span style={{ cursor: 'pointer' }} onClick={() => { setAuthMode('login'); setShowAuth(true); }}>Terms of Service</span>
            </div>
          </div>
        </div>
      </footer>

      {showAuth && <AuthModal onClose={() => setShowAuth(false)} initialMode={authMode} />}
    </div>
  );
}
