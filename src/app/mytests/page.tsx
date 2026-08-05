'use client';
import React, { useState, useMemo } from 'react';
import {
  Search, Headphones, BookOpen, Heart, Play, Trash2, Zap,
  X, ArrowLeft, Bookmark,
  Clock,
  RotateCcw,
  CheckCircle
} from 'lucide-react';
import { useApp } from '@/context/AppContext';
import { useQuizStore, PublishedQuiz, CompletedTest } from '@/store/useQuizStore';
import { defaultQuizzes } from '@/lib/store';
import Link from 'next/link';

/* Seed tests for "My Tests" if user hasn't published custom ones yet */
const SEED_MY_TESTS: PublishedQuiz[] = [
  {
    id: 'my-1',
    title: 'TED Talk: The Power of Introverts',
    type: 'listening',
    topic: 'Psychology',
    questions: [],
    difficulty: 'B2',
    questionCount: 10,
    author: 'Nguyễn Văn An',
    publishedAt: '12/07/2026',
    plays: 1240,
    likes: 248,
    rating: 4.8,
  },
  {
    id: 'my-2',
    title: 'IELTS Academic: Urban Development and Planning',
    type: 'reading',
    topic: 'Urban Planning',
    questions: [],
    difficulty: 'C1',
    questionCount: 20,
    author: 'Nguyễn Văn An',
    publishedAt: '14/07/2026',
    plays: 980,
    likes: 192,
    rating: 4.9,
  },
  {
    id: 'my-3',
    title: 'BBC News: Technology and Society in 2025',
    type: 'listening',
    topic: 'Technology',
    questions: [],
    difficulty: 'B1',
    questionCount: 8,
    author: 'Nguyễn Văn An',
    publishedAt: '10/07/2026',
    plays: 740,
    likes: 156,
    rating: 4.7,
  },
  {
    id: 'my-4',
    title: 'Climate Change: Impact on Future Generations',
    type: 'reading',
    topic: 'Environment',
    questions: [],
    difficulty: 'C1',
    questionCount: 15,
    author: 'Nguyễn Văn An',
    publishedAt: '11/07/2026',
    plays: 560,
    likes: 97,
    rating: 4.6,
  },
];

const SEED_COMPLETED_TESTS: CompletedTest[] = [
  {
    id: 'c-1',
    title: 'TED Talk: The Power of Introverts',
    type: 'listening',
    difficulty: 'B2',
    score: 90,
    correctAnswers: 9,
    totalQuestions: 10,
    completedAt: '28/07/2026 14:30'
  },
  {
    id: 'c-2',
    title: 'IELTS Academic: Urban Development and Planning',
    type: 'reading',
    difficulty: 'C1',
    score: 85,
    correctAnswers: 17,
    totalQuestions: 20,
    completedAt: '26/07/2026 09:15'
  },
  {
    id: 'c-3',
    title: 'BBC News: Technology and Society in 2025',
    type: 'listening',
    difficulty: 'B1',
    score: 75,
    correctAnswers: 6,
    totalQuestions: 8,
    completedAt: '24/07/2026 16:45'
  },
  {
    id: 'c-4',
    title: 'Climate Change: Impact on Future Generations',
    type: 'reading',
    difficulty: 'C1',
    score: 80,
    correctAnswers: 12,
    totalQuestions: 15,
    completedAt: '20/07/2026 11:20'
  }
];

type FilterType = 'all' | 'listening' | 'reading';

export default function MyTestsPage() {
  const { user } = useApp();
  const { publishedListeningQuizzes, publishedReadingQuizzes, completedTests, likedIds, toggleLike } = useQuizStore();

  const [mainTab, setMainTab] = useState<'posted' | 'history'>('posted');
  const [search, setSearch] = useState('');
  const [filterType, setFilterType] = useState<FilterType>('all');
  const [selected, setSelected] = useState<PublishedQuiz | null>(null);

  // Combine user-created published quizzes from store + seed quizzes
  const myTestsList = useMemo<PublishedQuiz[]>(() => {
    const userCreated = [...publishedListeningQuizzes, ...publishedReadingQuizzes];
    if (userCreated.length > 0) return userCreated;
    return SEED_MY_TESTS;
  }, [publishedListeningQuizzes, publishedReadingQuizzes]);

  // Completed tests list
  const completedList = useMemo<CompletedTest[]>(() => {
    if (completedTests && completedTests.length > 0) return completedTests;
    return SEED_COMPLETED_TESTS;
  }, [completedTests]);

  // Filtered posted list
  const filtered = useMemo(() => {
    let list = myTestsList;
    if (filterType !== 'all') list = list.filter(q => q.type === filterType);
    if (search.trim()) {
      const qLower = search.toLowerCase();
      list = list.filter(q =>
        q.title.toLowerCase().includes(qLower) ||
        (q.topic ?? '').toLowerCase().includes(qLower)
      );
    }
    return list;
  }, [myTestsList, filterType, search]);

  // Filtered history list
  const filteredHistory = useMemo(() => {
    let list = completedList;
    if (filterType !== 'all') list = list.filter(q => q.type === filterType);
    if (search.trim()) {
      const qLower = search.toLowerCase();
      list = list.filter(q =>
        q.title.toLowerCase().includes(qLower)
      );
    }
    return list;
  }, [completedList, filterType, search]);

  const totalPlays = myTestsList.reduce((acc, q) => acc + (q.plays ?? 0), 0);
  const totalLikes = myTestsList.reduce((acc, q) => acc + (q.likes ?? 0), 0);

  return (
    <div className="flex flex-col gap-5 w-full max-w-5xl mx-auto">
      {/* Summary Header Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <div className="card p-3 md:p-4 text-center">
          <div className="text-xl md:text-2xl font-bold" style={{ color: '#6c63ff' }}>
            {myTestsList.length}
          </div>
          <div className="text-xs mt-0.5" style={{ color: 'var(--text-muted)' }}>Posted Tests</div>
        </div>

        <div className="card p-3 md:p-4 text-center">
          <div className="text-xl md:text-2xl font-bold" style={{ color: '#3b82f6' }}>
            {completedList.length}
          </div>
          <div className="text-xs mt-0.5" style={{ color: 'var(--text-muted)' }}>Completed Tests</div>
        </div>

        <div className="card p-3 md:p-4 text-center">
          <div className="text-xl md:text-2xl font-bold" style={{ color: '#10b981' }}>
            {totalPlays.toLocaleString('en-US')}
          </div>
          <div className="text-xs mt-0.5" style={{ color: 'var(--text-muted)' }}>Total Plays</div>
        </div>

        <div className="card p-3 md:p-4 text-center">
          <div className="text-xl md:text-2xl font-bold" style={{ color: '#f43f5e' }}>
            {totalLikes.toLocaleString('en-US')}
          </div>
          <div className="text-xs mt-0.5" style={{ color: 'var(--text-muted)' }}>Total Likes</div>
        </div>
      </div>

      {/* Main Tab Navigation */}
      <div className="flex border-b border-gray-200 dark:border-gray-800 gap-6 mt-1">
        <button
          onClick={() => setMainTab('posted')}
          className={`pb-3 text-xs md:text-sm font-bold border-b-2 transition-all cursor-pointer ${
            mainTab === 'posted'
              ? 'border-violet-600 text-violet-600 dark:text-violet-400'
              : 'border-transparent text-gray-400 hover:text-gray-600'
          }`}
        >
          My Posted Tests ({myTestsList.length})
        </button>
        <button
          onClick={() => setMainTab('history')}
          className={`pb-3 text-xs md:text-sm font-bold border-b-2 transition-all cursor-pointer ${
            mainTab === 'history'
              ? 'border-violet-600 text-violet-600 dark:text-violet-400'
              : 'border-transparent text-gray-400 hover:text-gray-600'
          }`}
        >
          Test History & Scores ({completedList.length})
        </button>
      </div>

      {/* Search & Filters */}
      <div className="flex flex-col sm:flex-row gap-2.5 items-center justify-between">
        <div className="relative flex-1 w-full">
          <Search size={14} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
          <input
            className="w-full"
            placeholder={mainTab === 'posted' ? "Search my posted tests..." : "Search test history..."}
            value={search}
            onChange={e => setSearch(e.target.value)}
            style={{
              padding: '9px 12px 9px 36px',
              background: 'var(--bg-card)',
              border: '1px solid var(--border)',
              borderRadius: '10px',
              fontSize: '13px',
              outline: 'none',
              color: 'var(--text-primary)',
            }}
          />
        </div>

        <div className="flex gap-1.5 shrink-0">
          {(['all', 'listening', 'reading'] as FilterType[]).map(t => (
            <button
              key={t}
              onClick={() => setFilterType(t)}
              className="px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all"
              style={{
                border: `1px solid ${filterType === t ? '#6c63ff' : 'var(--border)'}`,
                background: filterType === t ? '#6c63ff' : 'var(--bg-card)',
                color: filterType === t ? 'white' : 'var(--text-secondary)',
                cursor: 'pointer'
              }}
            >
              {t === 'listening' && <Headphones size={13} />}
              {t === 'reading' && <BookOpen size={13} />}
              {t === 'all' ? 'All' : t === 'listening' ? 'Listening' : 'Reading'}
            </button>
          ))}
        </div>
      </div>

      {/* Tab Content: Posted Tests */}
      {mainTab === 'posted' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {filtered.map(quiz => (
            <MyTestCard
              key={quiz.id}
              quiz={quiz}
              isLiked={likedIds.has(quiz.id)}
              onLike={() => toggleLike(quiz.id, quiz.type)}
              onOpen={() => setSelected(quiz)}
            />
          ))}

          {filtered.length === 0 && (
            <div className="col-span-full text-center py-16" style={{ color: 'var(--text-muted)' }}>
              <Zap size={36} style={{ margin: '0 auto 10px', opacity: 0.3 }} />
              <p className="text-sm font-semibold">No posted tests found.</p>
              <p className="text-xs mt-1">Create a test in AI Quiz to publish it!</p>
            </div>
          )}
        </div>
      )}

      {/* Tab Content: Test History & Scores */}
      {mainTab === 'history' && (
        <div className="flex flex-col gap-3">
          {filteredHistory.length === 0 ? (
            <div className="text-center py-16 text-gray-400 text-xs">
              <Clock size={36} style={{ margin: '0 auto 10px', opacity: 0.3 }} />
              <p className="text-sm font-semibold">No test history found.</p>
              <p className="text-xs mt-1">Take a practice quiz to view your score history here!</p>
            </div>
          ) : (
            filteredHistory.map(item => (
              <div
                key={item.id}
                className="card p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:border-violet-200 transition-all rounded-2xl bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800"
              >
                <div className="flex items-start gap-3.5">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                    item.type === 'listening' ? 'bg-violet-50 text-violet-600 border border-violet-100' : 'bg-emerald-50 text-emerald-600 border border-emerald-100'
                  }`}>
                    {item.type === 'listening' ? <Headphones size={18} /> : <BookOpen size={18} />}
                  </div>
                  <div>
                    <div className="flex items-center gap-2 flex-wrap mb-1">
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full capitalize ${
                        item.type === 'listening' ? 'bg-violet-50 text-violet-600' : 'bg-emerald-50 text-emerald-600'
                      }`}>
                        {item.type}
                      </span>
                      <span className="text-[10px] font-semibold text-gray-400 bg-gray-50 dark:bg-gray-800 px-2 py-0.5 rounded">
                        {item.difficulty}
                      </span>
                      <span className="text-[10px] text-gray-400 flex items-center gap-1">
                        <Clock size={11} /> {item.completedAt}
                      </span>
                    </div>
                    <h4 className="text-xs md:text-sm font-bold text-gray-800 dark:text-gray-100">
                      {item.title}
                    </h4>
                  </div>
                </div>

                <div className="flex items-center justify-between sm:justify-end gap-4 border-t sm:border-t-0 pt-3 sm:pt-0 border-gray-100 dark:border-gray-800">
                  <div className="text-right">
                    <div className="flex items-center gap-1.5 justify-end">
                      <span className={`text-base md:text-lg font-extrabold ${
                        item.score >= 80 ? 'text-emerald-500' : item.score >= 60 ? 'text-amber-500' : 'text-red-500'
                      }`}>
                        {item.score}%
                      </span>
                    </div>
                    <span className="text-[10px] text-gray-400">
                      {item.correctAnswers}/{item.totalQuestions} correct
                    </span>
                  </div>

                  <Link
                    href={item.type === 'listening' ? '/listening' : '/reading'}
                    className="flex items-center gap-1 px-3.5 py-2 rounded-xl text-xs font-semibold text-violet-600 bg-violet-50 hover:bg-violet-100 dark:bg-violet-950/40 dark:text-violet-300 transition-all"
                  >
                    <RotateCcw size={12} /> Retake
                  </Link>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* Slide-in Detail Panel */}
      {selected && (
        <DetailPanel
          quiz={selected}
          isLiked={likedIds.has(selected.id)}
          onLike={() => toggleLike(selected.id, selected.type)}
          onClose={() => setSelected(null)}
        />
      )}
    </div>
  );
}

/* ─── My Test Card (No Rating Star) ─── */
function MyTestCard({
  quiz, isLiked, onLike, onOpen
}: {
  quiz: PublishedQuiz;
  isLiked: boolean;
  onLike: () => void;
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

        {/* Author & Published date */}
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

        {/* Plays & Likes Stats Row (No Star Rating) */}
        <div className="flex items-center justify-between pt-1.5 mt-1 border-t" style={{ borderColor: 'var(--border)' }}>
          <span className="flex items-center gap-1 text-[10px] font-semibold" style={{ color: 'var(--text-muted)' }}>
            <Play size={10} color={accentColor} /> {(quiz.plays ?? 0).toLocaleString('en-US')} plays
          </span>

          <button
            onClick={(e) => { e.stopPropagation(); onLike(); }}
            className="flex items-center gap-1 px-2 py-0.5 rounded-md transition-all hover:scale-105"
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
  );
}

/* ─── Detail Slide-in Panel (No Star Rating) ─── */
function DetailPanel({
  quiz, isLiked, onLike, onClose
}: {
  quiz: PublishedQuiz;
  isLiked: boolean;
  onLike: () => void;
  onClose: () => void;
}) {
  const isListening = quiz.type === 'listening';
  const accentColor = isListening ? '#6c63ff' : '#10b981';
  const href = isListening ? '/listening' : '/reading';

  return (
    <>
      <div
        className="fixed inset-0 bg-black/40 z-40 backdrop-blur-[2px]"
        onClick={onClose}
        style={{ animation: 'fadeIn 0.2s ease' }}
      />
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

          {/* Stat metrics (No rating star) */}
          <div className="grid grid-cols-2 gap-2.5">
            <div className="flex flex-col items-center gap-0.5 p-3 rounded-xl" style={{ background: 'var(--bg-primary)', border: '1px solid var(--border)' }}>
              <Play size={14} color={accentColor} />
              <span className="text-sm font-bold" style={{ color: 'var(--text-primary)' }}>{(quiz.plays ?? 0).toLocaleString('en-US')}</span>
              <span className="text-[10px]" style={{ color: 'var(--text-muted)' }}>Total Plays</span>
            </div>
            <div className="flex flex-col items-center gap-0.5 p-3 rounded-xl" style={{ background: 'var(--bg-primary)', border: '1px solid var(--border)' }}>
              <Heart size={14} color="#f43f5e" fill="#f43f5e" />
              <span className="text-sm font-bold" style={{ color: 'var(--text-primary)' }}>{quiz.likes}</span>
              <span className="text-[10px]" style={{ color: 'var(--text-muted)' }}>Likes</span>
            </div>
          </div>

          <button
            onClick={onLike}
            className="w-full flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-xs font-semibold transition-all"
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
        </div>

        {/* Sticky Action Buttons */}
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
