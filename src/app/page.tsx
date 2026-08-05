'use client';
import React, { useState, useMemo } from 'react';
import {
  Search, BookOpen, Headphones, ChevronRight, Bookmark,
  Clock, Star, TrendingUp, Flame, Sparkles, Globe, Heart, Play,
  X, ArrowLeft, Zap, Trophy, Filter
} from 'lucide-react';
import { useApp } from '@/context/AppContext';
import { useQuizStore, PublishedQuiz } from '@/store/useQuizStore';
import { defaultQuizzes } from '@/lib/store';
import Link from 'next/link';

/* ─── Mock community quizzes seeded from defaultQuizzes ─── */
const SEED_COMMUNITY: PublishedQuiz[] = defaultQuizzes.map((q, i) => ({
  id: q.id,
  title: q.title,
  type: q.type,
  topic: q.topic,
  questions: [],
  difficulty: q.difficulty,
  questionCount: q.questionCount,
  author: q.author,
  publishedAt: q.publishedAt,
  plays: [1240, 980, 740, 560, 320, 890][i] ?? 400,
  likes: [248, 192, 156, 97, 64, 178][i] ?? 80,
  rating: q.rating,
}));

type FilterType = 'all' | 'listening' | 'reading';
type SortType = 'popular' | 'newest' | 'most-liked';

export default function HomePage() {
  const { user, exercises } = useApp();
  const { publishedListeningQuizzes, publishedReadingQuizzes, likedIds, toggleLike } = useQuizStore();

  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState<FilterType>('all');
  const [sortBy, setSortBy] = useState<SortType>('popular');
  const [selected, setSelected] = useState<PublishedQuiz | null>(null);
  const [saved, setSaved] = useState<Set<string>>(new Set());

  // In-progress exercises
  const inProgress = exercises.filter(e => e.status === 'in-progress');

  // Merge all published & community quizzes
  const allQuizzes = useMemo<PublishedQuiz[]>(() => {
    const userPublished = [...publishedListeningQuizzes, ...publishedReadingQuizzes];
    const ids = new Set(userPublished.map(q => q.id));
    const seed = SEED_COMMUNITY.filter(q => !ids.has(q.id));
    return [...userPublished, ...seed];
  }, [publishedListeningQuizzes, publishedReadingQuizzes]);

  // Filtered & sorted list
  const filteredQuizzes = useMemo(() => {
    let list = allQuizzes;
    if (filterType !== 'all') list = list.filter(q => q.type === filterType);
    if (searchQuery.trim()) {
      const qLower = searchQuery.toLowerCase();
      list = list.filter(q =>
        q.title.toLowerCase().includes(qLower) ||
        q.author.toLowerCase().includes(qLower) ||
        (q.topic ?? '').toLowerCase().includes(qLower)
      );
    }
    if (sortBy === 'popular') list = [...list].sort((a, b) => (b.plays ?? 0) - (a.plays ?? 0));
    if (sortBy === 'newest') list = [...list].sort((a, b) => b.publishedAt.localeCompare(a.publishedAt));
    if (sortBy === 'most-liked') list = [...list].sort((a, b) => b.likes - a.likes);
    return list;
  }, [allQuizzes, filterType, sortBy, searchQuery]);

  const handleToggleSave = (id: string) => {
    setSaved(prev => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  return (
    <div className="flex flex-col gap-5 md:gap-7 w-full max-w-5xl mx-auto">
      {/* Global Search Bar */}
      <div className="relative">
        <input
          type="text"
          placeholder="Search for courses, quizzes, or documents..."
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

      {/* Continue reading / In progress */}
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
                    <div className="absolute bottom-0 left-0 right-0 h-1" style={{ background: 'rgba(0,0,0,0.08)' }}>
                      <div style={{ width: '40%', height: '100%', background: ex.type === 'listening' ? '#6c63ff' : '#10b981', borderRadius: '0 2px 0 0' }} />
                    </div>
                  </div>
                  <p className="text-xs font-medium truncate group-hover:text-violet-600 transition-colors">{ex.title}</p>
                  <div className="flex items-center gap-1 mt-0.5">
                    <span className="text-[10px]" style={{ color: 'var(--text-muted)' }}>{ex.topic}</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </Section>
      )}

      {/* ─── Community & Published Quizzes Section ─── */}
      <div className="flex flex-col gap-3">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg flex items-center justify-center"
              style={{ background: 'linear-gradient(135deg, #6c63ff, #a78bfa)', color: 'white' }}>
              <Globe size={15} />
            </div>
            <div>
              <h3 className="text-base font-bold" style={{ letterSpacing: '-0.2px' }}>Community Tests</h3>
              <p className="text-[11px]" style={{ color: 'var(--text-muted)' }}>Explore quizzes shared by community members & creators</p>
            </div>
          </div>

          {/* Filters & Sort */}
          <div className="flex items-center gap-2 flex-wrap w-full sm:w-auto justify-between sm:justify-end">
            <div className="flex gap-1">
              {(['all', 'listening', 'reading'] as FilterType[]).map(f => (
                <button key={f} onClick={() => setFilterType(f)}
                  className="px-2.5 py-1 rounded-lg text-xs font-semibold flex items-center gap-1 transition-all"
                  style={{
                    background: filterType === f ? '#6c63ff' : 'var(--bg-card)',
                    color: filterType === f ? 'white' : 'var(--text-secondary)',
                    border: `1px solid ${filterType === f ? '#6c63ff' : 'var(--border)'}`,
                    cursor: 'pointer'
                  }}>
                  {f === 'listening' && <Headphones size={12} />}
                  {f === 'reading' && <BookOpen size={12} />}
                  {f === 'all' ? 'All' : f === 'listening' ? 'Listening' : 'Reading'}
                </button>
              ))}
            </div>

            <select
              value={sortBy}
              onChange={e => setSortBy(e.target.value as SortType)}
              style={{
                padding: '5px 10px', borderRadius: '8px', fontSize: '11px', fontWeight: 600,
                background: 'var(--bg-card)', border: '1px solid var(--border)',
                color: 'var(--text-secondary)', outline: 'none', cursor: 'pointer'
              }}
            >
              <option value="popular">Most Played</option>
              <option value="newest">Newest</option>
              <option value="most-liked">Most Liked</option>
            </select>
          </div>
        </div>

        {/* Card Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {filteredQuizzes.map(quiz => (
            <QuizCard
              key={quiz.id}
              quiz={quiz}
              isLiked={likedIds.has(quiz.id)}
              isSaved={saved.has(quiz.id)}
              onLike={() => toggleLike(quiz.id, quiz.type)}
              onSave={() => handleToggleSave(quiz.id)}
              onOpen={() => setSelected(quiz)}
            />
          ))}
          {filteredQuizzes.length === 0 && (
            <div className="col-span-full text-center py-12" style={{ color: 'var(--text-muted)' }}>
              <Globe size={32} style={{ margin: '0 auto 8px', opacity: 0.3 }} />
              <p className="text-xs">No tests found for the selected filter.</p>
            </div>
          )}
        </div>
      </div>

      {/* Slide-in Detail Modal */}
      {selected && (
        <DetailPanel
          quiz={selected}
          isLiked={likedIds.has(selected.id)}
          isSaved={saved.has(selected.id)}
          onLike={() => toggleLike(selected.id, selected.type)}
          onSave={() => handleToggleSave(selected.id)}
          onClose={() => setSelected(null)}
        />
      )}
    </div>
  );
}

/* ─── Quiz Card Component ─── */
function QuizCard({
  quiz, isLiked, isSaved, onLike, onSave, onOpen
}: {
  quiz: PublishedQuiz;
  isLiked: boolean;
  isSaved: boolean;
  onLike: () => void;
  onSave: () => void;
  onOpen: () => void;
}) {
  const isListening = quiz.type === 'listening';
  const accentColor = isListening ? '#6c63ff' : '#10b981';
  const bgColor = isListening ? 'rgba(108,99,255,0.08)' : 'rgba(16,185,129,0.08)';

  return (
    <div
      className="card cursor-pointer group hover:border-violet-300 transition-all"
      style={{ padding: 0, overflow: 'hidden', border: '1px solid var(--border)' }}
      onClick={onOpen}
    >
      {/* Top Banner */}
      <div className="relative flex items-center justify-center"
        style={{ height: '76px', background: bgColor }}>
        <div className="w-11 h-11 rounded-xl flex items-center justify-center"
          style={{ background: accentColor + '20' }}>
          {isListening
            ? <Headphones size={20} color={accentColor} />
            : <BookOpen size={20} color={accentColor} />}
        </div>
        <span className="absolute top-2 right-2 text-[10px] font-bold px-2 py-0.5 rounded-full"
          style={{ background: accentColor + '20', color: accentColor }}>
          {quiz.difficulty}
        </span>
        <span className="absolute top-2 left-2 text-[10px] font-bold px-2 py-0.5 rounded-full capitalize"
          style={{ background: 'rgba(255,255,255,0.9)', color: accentColor }}>
          {isListening ? 'Listening' : 'Reading'}
        </span>
      </div>

      {/* Body */}
      <div className="p-3 flex flex-col gap-1.5">
        <p className="text-xs font-semibold leading-snug line-clamp-2 group-hover:text-violet-600 transition-colors"
          style={{ color: 'var(--text-primary)' }}>
          {quiz.title}
        </p>
        {quiz.topic && (
          <span className="text-[10px]" style={{ color: 'var(--text-muted)' }}>{quiz.topic}</span>
        )}

        {/* Author row */}
        <div className="flex items-center gap-1.5 mt-0.5">
          <div className="w-4 h-4 rounded-full flex items-center justify-center text-[7px] font-bold text-white shrink-0"
            style={{ background: 'linear-gradient(135deg, #6c63ff, #a78bfa)' }}>
            {quiz.author.charAt(0)}
          </div>
          <span className="text-[10px] font-medium truncate" style={{ color: 'var(--text-secondary)' }}>
            {quiz.author}
          </span>
          <span className="text-[10px] ml-auto" style={{ color: 'var(--text-muted)' }}>
            {quiz.publishedAt}
          </span>
        </div>

        {/* Stats & Actions */}
        <div className="flex items-center gap-2 pt-1.5 mt-1 border-t" style={{ borderColor: 'var(--border)' }}>
          <span className="flex items-center gap-0.5 text-[10px]" style={{ color: 'var(--text-muted)' }}>
            <Play size={10} /> {(quiz.plays ?? 0).toLocaleString('en-US')}
          </span>

          <div className="flex items-center gap-1.5 ml-auto" onClick={e => e.stopPropagation()}>
            <button
              onClick={onSave}
              className="w-6 h-6 rounded-md flex items-center justify-center transition-all hover:scale-110"
              style={{ background: isSaved ? 'rgba(108,99,255,0.12)' : 'var(--bg-card)', border: '1px solid var(--border)', cursor: 'pointer' }}
            >
              <Bookmark size={10} color={isSaved ? '#6c63ff' : 'var(--text-muted)'} fill={isSaved ? '#6c63ff' : 'none'} />
            </button>
            <button
              onClick={onLike}
              className="flex items-center gap-1 px-1.5 py-0.5 rounded-md transition-all hover:scale-105"
              style={{
                background: isLiked ? 'rgba(244,63,94,0.1)' : 'var(--bg-card)',
                border: `1px solid ${isLiked ? 'rgba(244,63,94,0.25)' : 'var(--border)'}`,
                cursor: 'pointer'
              }}
            >
              <Heart size={10} color={isLiked ? '#f43f5e' : 'var(--text-muted)'} fill={isLiked ? '#f43f5e' : 'none'} />
              <span className="text-[10px] font-bold" style={{ color: isLiked ? '#f43f5e' : 'var(--text-muted)' }}>
                {quiz.likes}
              </span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─── Detail Slide-in Panel ─── */
function DetailPanel({
  quiz, isLiked, isSaved, onLike, onSave, onClose
}: {
  quiz: PublishedQuiz;
  isLiked: boolean;
  isSaved: boolean;
  onLike: () => void;
  onSave: () => void;
  onClose: () => void;
}) {
  const isListening = quiz.type === 'listening';
  const accentColor = isListening ? '#6c63ff' : '#10b981';
  const href = isListening ? '/listening' : '/reading';

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/40 z-40 backdrop-blur-[2px]"
        onClick={onClose}
        style={{ animation: 'fadeIn 0.2s ease' }}
      />
      {/* Panel */}
      <div
        className="fixed right-0 top-0 bottom-0 z-50 flex flex-col"
        style={{
          width: 'min(420px, 100vw)',
          background: 'var(--bg-card)',
          boxShadow: '-8px 0 40px rgba(0,0,0,0.15)',
          animation: 'slideInRight 0.25s ease',
          overflowY: 'auto',
        }}
      >
        {/* Banner */}
        <div className="relative flex items-center justify-center"
          style={{ height: '150px', background: `linear-gradient(135deg, ${accentColor}20, ${accentColor}08)`, flexShrink: 0 }}>
          <div className="w-18 h-18 rounded-2xl flex items-center justify-center shadow-lg"
            style={{ background: accentColor + '25', boxShadow: `0 0 30px ${accentColor}35` }}>
            {isListening
              ? <Headphones size={34} color={accentColor} />
              : <BookOpen size={34} color={accentColor} />}
          </div>
          <button
            onClick={onClose}
            className="absolute top-4 left-4 w-8 h-8 rounded-xl flex items-center justify-center transition-all hover:bg-black/10"
            style={{ background: 'rgba(255,255,255,0.8)', border: '1px solid rgba(0,0,0,0.06)', cursor: 'pointer' }}
          >
            <X size={15} style={{ color: 'var(--text-secondary)' }} />
          </button>
        </div>

        {/* Content */}
        <div className="flex flex-col gap-4 p-5 flex-1">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="flex items-center gap-1 text-xs font-bold px-2.5 py-1 rounded-full"
              style={{ background: accentColor + '15', color: accentColor, border: `1px solid ${accentColor}25` }}>
              {isListening ? <Headphones size={11} /> : <BookOpen size={11} />}
              {isListening ? 'Listening' : 'Reading'}
            </span>
            <span className="text-xs font-bold px-2.5 py-1 rounded-full"
              style={{ background: 'rgba(108,99,255,0.1)', color: '#6c63ff', border: '1px solid rgba(108,99,255,0.2)' }}>
              Level {quiz.difficulty}
            </span>
            {quiz.topic && (
              <span className="text-xs px-2.5 py-1 rounded-full"
                style={{ background: 'var(--bg-primary)', color: 'var(--text-secondary)', border: '1px solid var(--border)' }}>
                {quiz.topic}
              </span>
            )}
          </div>

          <h2 className="text-base font-bold leading-snug" style={{ color: 'var(--text-primary)', letterSpacing: '-0.2px' }}>
            {quiz.title}
          </h2>

          <div className="flex items-center gap-2.5 p-3 rounded-xl" style={{ background: 'var(--bg-primary)', border: '1px solid var(--border)' }}>
            <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white shrink-0"
              style={{ background: 'linear-gradient(135deg, #6c63ff, #a78bfa)' }}>
              {quiz.author.charAt(0)}
            </div>
            <div>
              <p className="text-xs font-semibold" style={{ color: 'var(--text-primary)' }}>{quiz.author}</p>
              <p className="text-[10px]" style={{ color: 'var(--text-muted)' }}>Published {quiz.publishedAt}</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2">
            {[
              { label: 'Questions', value: quiz.questionCount, icon: <Trophy size={12} />, color: '#fbbf24' },
              { label: 'Plays', value: (quiz.plays ?? 0).toLocaleString('en-US'), icon: <Play size={12} />, color: accentColor },
            ].map(item => (
              <div key={item.label} className="flex flex-col items-center gap-0.5 p-2 rounded-xl" style={{ background: 'var(--bg-primary)', border: '1px solid var(--border)' }}>
                <span style={{ color: item.color }}>{item.icon}</span>
                <span className="text-xs font-bold" style={{ color: 'var(--text-primary)' }}>{item.value}</span>
                <span className="text-[9px]" style={{ color: 'var(--text-muted)' }}>{item.label}</span>
              </div>
            ))}
          </div>

          <div className="flex gap-2">
            <button
              onClick={onLike}
              className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl text-xs font-semibold transition-all"
              style={{
                background: isLiked ? 'rgba(244,63,94,0.1)' : 'var(--bg-primary)',
                border: `1px solid ${isLiked ? 'rgba(244,63,94,0.3)' : 'var(--border)'}`,
                color: isLiked ? '#f43f5e' : 'var(--text-secondary)',
                cursor: 'pointer',
              }}
            >
              <Heart size={13} fill={isLiked ? '#f43f5e' : 'none'} />
              {quiz.likes} {isLiked ? 'Liked' : 'Like'}
            </button>
            <button
              onClick={onSave}
              className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl text-xs font-semibold transition-all"
              style={{
                background: isSaved ? 'rgba(108,99,255,0.1)' : 'var(--bg-primary)',
                border: `1px solid ${isSaved ? 'rgba(108,99,255,0.3)' : 'var(--border)'}`,
                color: isSaved ? '#6c63ff' : 'var(--text-secondary)',
                cursor: 'pointer',
              }}
            >
              <Bookmark size={13} fill={isSaved ? '#6c63ff' : 'none'} />
              {isSaved ? 'Saved' : 'Save'}
            </button>
          </div>
        </div>

        {/* Action Buttons — Sticky Bottom */}
        <div className="p-4 pt-0 flex flex-col gap-2" style={{ flexShrink: 0 }}>
          <Link href={href} className="w-full">
            <button
              className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs font-bold text-white transition-all hover:opacity-90 active:scale-95"
              style={{
                background: `linear-gradient(135deg, ${accentColor}, ${isListening ? '#a78bfa' : '#34d399'})`,
                boxShadow: `0 4px 16px ${accentColor}35`,
                border: 'none', cursor: 'pointer',
              }}
            >
              <Play size={14} fill="white" /> Start Quiz
            </button>
          </Link>
          <button
            onClick={onClose}
            className="w-full flex items-center justify-center gap-1.5 py-2 rounded-xl text-xs font-semibold transition-all hover:bg-gray-100"
            style={{
              background: 'var(--bg-primary)', border: '1px solid var(--border)',
              color: 'var(--text-secondary)', cursor: 'pointer',
            }}
          >
            <ArrowLeft size={13} /> Back
          </button>
        </div>
      </div>

      <style>{`
        @keyframes slideInRight {
          from { transform: translateX(100%); opacity: 0; }
          to   { transform: translateX(0);    opacity: 1; }
        }
        @keyframes fadeIn {
          from { opacity: 0; }
          to   { opacity: 1; }
        }
      `}</style>
    </>
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
