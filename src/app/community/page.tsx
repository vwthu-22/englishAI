'use client';
import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import {
  Headphones, BookOpen, Heart, Users, Search, SlidersHorizontal,
  ChevronRight, Star, X, Bookmark, Play, ArrowLeft, Zap, Trophy,
  Clock, Globe, Filter
} from 'lucide-react';
import { useQuizStore, PublishedQuiz } from '@/store/useQuizStore';
import { defaultQuizzes, QuizItem } from '@/lib/store';

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

export default function CommunityPage() {
  const { publishedListeningQuizzes, publishedReadingQuizzes, likedIds, toggleLike } = useQuizStore();
  const [filterType, setFilterType] = useState<FilterType>('all');
  const [sortBy, setSortBy] = useState<SortType>('popular');
  const [search, setSearch] = useState('');
  const [selected, setSelected] = useState<PublishedQuiz | null>(null);
  const [saved, setSaved] = useState<Set<string>>(new Set());

  // Merge all quizzes: seed defaults + user-published
  const allQuizzes = useMemo<PublishedQuiz[]>(() => {
    const userPublished = [...publishedListeningQuizzes, ...publishedReadingQuizzes];
    const ids = new Set(userPublished.map(q => q.id));
    const seed = SEED_COMMUNITY.filter(q => !ids.has(q.id));
    return [...userPublished, ...seed];
  }, [publishedListeningQuizzes, publishedReadingQuizzes]);

  const filtered = useMemo(() => {
    let list = allQuizzes;
    if (filterType !== 'all') list = list.filter(q => q.type === filterType);
    if (search.trim()) list = list.filter(q =>
      q.title.toLowerCase().includes(search.toLowerCase()) ||
      q.author.toLowerCase().includes(search.toLowerCase()) ||
      (q.topic ?? '').toLowerCase().includes(search.toLowerCase())
    );
    if (sortBy === 'popular') list = [...list].sort((a, b) => (b.plays ?? 0) - (a.plays ?? 0));
    if (sortBy === 'newest') list = [...list].sort((a, b) => b.publishedAt.localeCompare(a.publishedAt));
    if (sortBy === 'most-liked') list = [...list].sort((a, b) => b.likes - a.likes);
    return list;
  }, [allQuizzes, filterType, sortBy, search]);

  const handleToggleSave = (id: string) => {
    setSaved(prev => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  return (
    <div className="flex flex-col gap-5 w-full max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex flex-col gap-1">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl flex items-center justify-center"
            style={{ background: 'linear-gradient(135deg, #6c63ff, #a78bfa)' }}>
            <Globe size={16} color="white" />
          </div>
          <h1 className="text-lg font-bold" style={{ letterSpacing: '-0.3px' }}>
            Community Tests
          </h1>
        </div>
        <p className="text-xs" style={{ color: 'var(--text-muted)', paddingLeft: '40px' }}>
          Discover tests created by the community — practice anytime
        </p>
      </div>

      {/* Stats strip */}
      <div className="grid grid-cols-3 gap-3">
        {[
          { label: 'Tests Published', value: allQuizzes.length, icon: <Zap size={14} />, color: '#6c63ff' },
          { label: 'Total Plays', value: allQuizzes.reduce((s, q) => s + (q.plays ?? 0), 0).toLocaleString('en-US'), icon: <Play size={14} />, color: '#10b981' },
          { label: 'Community Likes', value: allQuizzes.reduce((s, q) => s + q.likes, 0).toLocaleString('en-US'), icon: <Heart size={14} />, color: '#f43f5e' },
        ].map(stat => (
          <div key={stat.label} className="card p-3 flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0"
              style={{ background: stat.color + '18', color: stat.color }}>
              {stat.icon}
            </div>
            <div>
              <div className="text-sm font-bold" style={{ color: 'var(--text-primary)' }}>{stat.value}</div>
              <div className="text-[10px]" style={{ color: 'var(--text-muted)' }}>{stat.label}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Search + Filters */}
      <div className="flex flex-col sm:flex-row gap-2">
        <div className="relative flex-1">
          <Search size={14} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search by title, author, topic..."
            style={{
              width: '100%', padding: '9px 12px 9px 36px',
              background: 'var(--bg-card)', border: '1px solid var(--border)',
              borderRadius: '10px', fontSize: '13px', outline: 'none',
              color: 'var(--text-primary)',
            }}
          />
        </div>
        {/* Type filter */}
        <div className="flex gap-1.5 shrink-0">
          {(['all', 'listening', 'reading'] as FilterType[]).map(f => (
            <button key={f} onClick={() => setFilterType(f)}
              className="px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all"
              style={{
                background: filterType === f ? '#6c63ff' : 'var(--bg-card)',
                color: filterType === f ? 'white' : 'var(--text-secondary)',
                border: `1px solid ${filterType === f ? '#6c63ff' : 'var(--border)'}`,
              }}>
              {f === 'listening' && <Headphones size={13} />}
              {f === 'reading' && <BookOpen size={13} />}
              {f === 'all' ? 'All' : f === 'listening' ? 'Listening' : 'Reading'}
            </button>
          ))}
        </div>
        {/* Sort */}
        <select
          value={sortBy}
          onChange={e => setSortBy(e.target.value as SortType)}
          style={{
            padding: '8px 12px', borderRadius: '10px', fontSize: '12px', fontWeight: 600,
            background: 'var(--bg-card)', border: '1px solid var(--border)',
            color: 'var(--text-secondary)', outline: 'none', cursor: 'pointer'
          }}
        >
          <option value="popular">Most Played</option>
          <option value="newest">Newest</option>
          <option value="most-liked">Most Liked</option>
        </select>
      </div>

      {/* Card Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {filtered.map(quiz => (
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
        {filtered.length === 0 && (
          <div className="col-span-3 text-center py-16" style={{ color: 'var(--text-muted)' }}>
            <Globe size={36} style={{ margin: '0 auto 12px', opacity: 0.3 }} />
            <p className="text-sm">No tests found. Try a different filter.</p>
          </div>
        )}
      </div>

      {/* Detail Slide-in Panel */}
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

/* ─── Quiz Card ─── */
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
  const bgColor = isListening ? 'rgba(108,99,255,0.10)' : 'rgba(16,185,129,0.10)';

  return (
    <div
      className="card cursor-pointer group"
      style={{ padding: 0, overflow: 'hidden', border: '1px solid var(--border)', transition: 'all 0.2s' }}
      onClick={onOpen}
    >
      {/* Top banner */}
      <div className="relative flex items-center justify-center"
        style={{ height: '80px', background: bgColor }}>
        <div className="w-12 h-12 rounded-2xl flex items-center justify-center"
          style={{ background: accentColor + '22' }}>
          {isListening
            ? <Headphones size={22} color={accentColor} />
            : <BookOpen size={22} color={accentColor} />}
        </div>
        {/* Difficulty badge */}
        <span className="absolute top-2.5 right-2.5 text-[10px] font-bold px-2 py-0.5 rounded-full"
          style={{ background: accentColor + '20', color: accentColor, border: `1px solid ${accentColor}30` }}>
          {quiz.difficulty}
        </span>
        {/* Type pill */}
        <span className="absolute top-2.5 left-2.5 text-[10px] font-bold px-2 py-0.5 rounded-full capitalize"
          style={{ background: 'rgba(255,255,255,0.85)', color: accentColor, border: `1px solid ${accentColor}20` }}>
          {isListening ? 'Listening' : 'Reading'}
        </span>
      </div>

      {/* Body */}
      <div className="p-3 flex flex-col gap-2">
        <p className="text-xs font-semibold leading-snug line-clamp-2 group-hover:text-indigo-600 transition-colors"
          style={{ color: 'var(--text-primary)' }}>
          {quiz.title}
        </p>
        {quiz.topic && (
          <span className="text-[10px]" style={{ color: 'var(--text-muted)' }}>{quiz.topic}</span>
        )}

        {/* Author row */}
        <div className="flex items-center gap-1.5">
          <div className="w-5 h-5 rounded-full flex items-center justify-center text-[8px] font-bold text-white"
            style={{ background: 'linear-gradient(135deg, #6c63ff, #a78bfa)', flexShrink: 0 }}>
            {quiz.author.charAt(0)}
          </div>
          <span className="text-[10px] font-medium truncate" style={{ color: 'var(--text-secondary)' }}>
            {quiz.author}
          </span>
          <span className="text-[10px] ml-auto" style={{ color: 'var(--text-muted)' }}>
            {quiz.publishedAt}
          </span>
        </div>

        {/* Stats row */}
        <div className="flex items-center gap-3 pt-1.5 border-t" style={{ borderColor: 'var(--border)' }}>
          <span className="flex items-center gap-1 text-[10px]" style={{ color: 'var(--text-muted)' }}>
            <Play size={10} /> {(quiz.plays ?? 0).toLocaleString('en-US')}
          </span>
          <div className="flex items-center gap-2 ml-auto" onClick={e => e.stopPropagation()}>
            <button
              onClick={onSave}
              className="w-6 h-6 rounded-lg flex items-center justify-center transition-all hover:scale-110"
              style={{ background: isSaved ? 'rgba(108,99,255,0.12)' : 'var(--bg-card)', border: '1px solid var(--border)' }}
            >
              <Bookmark size={11} color={isSaved ? '#6c63ff' : 'var(--text-muted)'} fill={isSaved ? '#6c63ff' : 'none'} />
            </button>
            <button
              onClick={onLike}
              className="flex items-center gap-1 px-2 py-1 rounded-lg transition-all hover:scale-105"
              style={{ background: isLiked ? 'rgba(244,63,94,0.1)' : 'var(--bg-card)', border: `1px solid ${isLiked ? 'rgba(244,63,94,0.25)' : 'var(--border)'}` }}
            >
              <Heart size={11} color={isLiked ? '#f43f5e' : 'var(--text-muted)'} fill={isLiked ? '#f43f5e' : 'none'} />
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
          boxShadow: '-8px 0 40px rgba(0,0,0,0.12)',
          animation: 'slideInRight 0.25s ease',
          overflowY: 'auto',
        }}
      >
        {/* Banner */}
        <div className="relative flex items-center justify-center"
          style={{ height: '160px', background: `linear-gradient(135deg, ${accentColor}18, ${accentColor}08)`, flexShrink: 0 }}>
          <div className="w-20 h-20 rounded-3xl flex items-center justify-center shadow-lg"
            style={{ background: accentColor + '20', boxShadow: `0 0 40px ${accentColor}30` }}>
            {isListening
              ? <Headphones size={38} color={accentColor} />
              : <BookOpen size={38} color={accentColor} />}
          </div>
          {/* Back button */}
          <button
            onClick={onClose}
            className="absolute top-4 left-4 w-8 h-8 rounded-xl flex items-center justify-center transition-all hover:bg-black/10"
            style={{ background: 'rgba(255,255,255,0.7)', border: '1px solid rgba(0,0,0,0.06)', cursor: 'pointer' }}
          >
            <X size={16} style={{ color: 'var(--text-secondary)' }} />
          </button>
        </div>

        {/* Content */}
        <div className="flex flex-col gap-4 p-5 flex-1">
          {/* Type + Level */}
          <div className="flex items-center gap-2 flex-wrap">
            <span className="flex items-center gap-1.5 text-xs font-bold px-3 py-1 rounded-full"
              style={{ background: accentColor + '15', color: accentColor, border: `1px solid ${accentColor}25` }}>
              {isListening ? <Headphones size={12} /> : <BookOpen size={12} />}
              {isListening ? 'Listening' : 'Reading'}
            </span>
            <span className="text-xs font-bold px-3 py-1 rounded-full"
              style={{ background: 'rgba(108,99,255,0.1)', color: '#6c63ff', border: '1px solid rgba(108,99,255,0.2)' }}>
              Level {quiz.difficulty}
            </span>
            {quiz.topic && (
              <span className="text-xs px-3 py-1 rounded-full"
                style={{ background: 'var(--bg-primary)', color: 'var(--text-secondary)', border: '1px solid var(--border)' }}>
                {quiz.topic}
              </span>
            )}
          </div>

          {/* Title */}
          <h2 className="text-base font-bold leading-snug" style={{ color: 'var(--text-primary)', letterSpacing: '-0.2px' }}>
            {quiz.title}
          </h2>

          {/* Author */}
          <div className="flex items-center gap-2.5 p-3 rounded-xl" style={{ background: 'var(--bg-primary)', border: '1px solid var(--border)' }}>
            <div className="w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold text-white shrink-0"
              style={{ background: 'linear-gradient(135deg, #6c63ff, #a78bfa)' }}>
              {quiz.author.charAt(0)}
            </div>
            <div>
              <p className="text-xs font-semibold" style={{ color: 'var(--text-primary)' }}>{quiz.author}</p>
              <p className="text-[10px]" style={{ color: 'var(--text-muted)' }}>Published {quiz.publishedAt}</p>
            </div>
          </div>

          {/* Metadata grid */}
          <div className="grid grid-cols-2 gap-2.5">
            {[
              { label: 'Questions', value: quiz.questionCount, icon: <Trophy size={13} />, color: '#fbbf24' },
              { label: 'Plays', value: (quiz.plays ?? 0).toLocaleString('en-US'), icon: <Play size={13} />, color: accentColor },
            ].map(item => (
              <div key={item.label} className="flex flex-col items-center gap-1 p-2.5 rounded-xl" style={{ background: 'var(--bg-primary)', border: '1px solid var(--border)' }}>
                <span style={{ color: item.color }}>{item.icon}</span>
                <span className="text-sm font-bold" style={{ color: 'var(--text-primary)' }}>{item.value}</span>
                <span className="text-[9px]" style={{ color: 'var(--text-muted)' }}>{item.label}</span>
              </div>
            ))}
          </div>

          {/* Like/Save strip */}
          <div className="flex gap-2">
            <button
              onClick={onLike}
              className="flex-1 flex items-center justify-center gap-2 py-2 rounded-xl text-xs font-semibold transition-all"
              style={{
                background: isLiked ? 'rgba(244,63,94,0.1)' : 'var(--bg-primary)',
                border: `1px solid ${isLiked ? 'rgba(244,63,94,0.3)' : 'var(--border)'}`,
                color: isLiked ? '#f43f5e' : 'var(--text-secondary)',
                cursor: 'pointer',
              }}
            >
              <Heart size={14} fill={isLiked ? '#f43f5e' : 'none'} />
              {quiz.likes} {isLiked ? 'Liked' : 'Like'}
            </button>
            <button
              onClick={onSave}
              className="flex-1 flex items-center justify-center gap-2 py-2 rounded-xl text-xs font-semibold transition-all"
              style={{
                background: isSaved ? 'rgba(108,99,255,0.1)' : 'var(--bg-primary)',
                border: `1px solid ${isSaved ? 'rgba(108,99,255,0.3)' : 'var(--border)'}`,
                color: isSaved ? '#6c63ff' : 'var(--text-secondary)',
                cursor: 'pointer',
              }}
            >
              <Bookmark size={14} fill={isSaved ? '#6c63ff' : 'none'} />
              {isSaved ? 'Saved' : 'Save'}
            </button>
          </div>
        </div>

        {/* Action Buttons — sticky bottom */}
        <div className="p-5 pt-0 flex flex-col gap-2.5" style={{ flexShrink: 0 }}>
          <Link href={href} className="w-full">
            <button
              className="w-full flex items-center justify-center gap-2 py-3 rounded-2xl text-sm font-bold text-white transition-all hover:opacity-90 active:scale-95"
              style={{
                background: `linear-gradient(135deg, ${accentColor}, ${isListening ? '#a78bfa' : '#34d399'})`,
                boxShadow: `0 4px 20px ${accentColor}40`,
                border: 'none', cursor: 'pointer',
              }}
            >
              <Play size={16} fill="white" /> Start Quiz
            </button>
          </Link>
          <button
            onClick={onClose}
            className="w-full flex items-center justify-center gap-2 py-2.5 rounded-2xl text-sm font-semibold transition-all hover:bg-gray-100"
            style={{
              background: 'var(--bg-primary)', border: '1px solid var(--border)',
              color: 'var(--text-secondary)', cursor: 'pointer',
            }}
          >
            <ArrowLeft size={15} /> Back
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
