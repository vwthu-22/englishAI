'use client';
import React, { useState } from 'react';
import {
  Search, Filter, Trash2, RotateCcw, Headphones, BookOpen,
  Calendar, ChevronDown, Eye, CheckCircle, Clock, MoreVertical, Bookmark
} from 'lucide-react';
import { useApp } from '@/context/AppContext';
import { Exercise } from '@/lib/store';
import Link from 'next/link';

type FilterType = 'all' | 'listening' | 'reading' | 'saved';
type FilterStatus = 'all' | 'completed' | 'in-progress';

export default function ExercisesPage() {
  const { exercises, deleteExercise, bookmarks, toggleBookmark } = useApp();
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState<FilterType>('all');
  const [statusFilter, setStatusFilter] = useState<FilterStatus>('all');
  const [sortBy, setSortBy] = useState<'date' | 'score'>('date');
  const [openMenu, setOpenMenu] = useState<string | null>(null);

  const isSavedMode = typeFilter === 'saved';

  const filtered = isSavedMode
    ? bookmarks.filter(b => b.title.toLowerCase().includes(search.toLowerCase()))
    : exercises.filter(ex => {
        const matchSearch = ex.title.toLowerCase().includes(search.toLowerCase()) ||
          ex.topic.toLowerCase().includes(search.toLowerCase());
        const matchType = typeFilter === 'all' || ex.type === typeFilter;
        const matchStatus = statusFilter === 'all' || ex.status === statusFilter;
        return matchSearch && matchType && matchStatus;
      }).sort((a, b) => {
    if (sortBy === 'date') return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    return (b.score || 0) - (a.score || 0);
  });

  const getDifficultyColor = (d: string) => {
    if (d === 'A2' || d === 'Easy') return 'badge-green';
    if (d === 'B1' || d === 'Medium') return 'badge-blue';
    if (d === 'B2') return 'badge-orange';
    return 'badge-red';
  };

  const formatDate = (dateStr: string) => {
    const d = new Date(dateStr);
    return d.toLocaleDateString('en-US', { day: '2-digit', month: '2-digit', year: 'numeric' });
  };

  const stats = [
    { label: 'Total', value: exercises.length, color: '#a78bfa' },
    { label: 'Completed', value: exercises.filter(e => e.status === 'completed').length, color: '#34d399' },
    { label: 'In Progress', value: exercises.filter(e => e.status === 'in-progress').length, color: '#fbbf24' },
    { label: 'Avg. Score', value: `${Math.round(exercises.filter(e => e.score).reduce((s, e) => s + (e.score || 0), 0) / (exercises.filter(e => e.score).length || 1))}%`, color: '#60a5fa' },
  ];

  return (
    <div className="flex flex-col gap-4 md:gap-6 w-full">
      {/* Summary stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {stats.map((s, i) => (
          <div key={i} className="card p-3 md:p-4 text-center">
            <div className="text-xl md:text-2xl" style={{ fontWeight: 800, color: s.color }}>{s.value}</div>
            <div className="text-xs md:text-sm mt-0.5" style={{ color: 'var(--text-muted)' }}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="card p-3 md:p-4 flex flex-wrap gap-2 md:gap-3 items-center">
        {/* Search */}
        <div className="flex items-center gap-2 flex-1 min-w-36 md:min-w-48" style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid var(--border)', borderRadius: '8px', padding: '6px 10px' }}>
          <Search size={13} color="var(--text-muted)" />
          <input
            className="bg-transparent border-none outline-none text-xs md:text-sm w-full"
            placeholder="Search by title, topic..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            style={{ color: 'var(--text-primary)' }}
          />
        </div>

        {/* Type filter */}
        <div className="flex gap-1.5 md:gap-2 flex-wrap">
          {(['all', 'listening', 'reading', 'saved'] as FilterType[]).map(t => (
            <button
              key={t}
              onClick={() => setTypeFilter(t)}
              className="flex items-center gap-1 px-2 md:px-3 py-1.5 rounded-lg text-xs md:text-sm font-medium transition-all"
              style={{
                border: `1px solid ${typeFilter === t ? '#6c63ff' : 'var(--border)'}`,
                background: typeFilter === t ? 'rgba(108,99,255,0.2)' : 'rgba(255,255,255,0.03)',
                color: typeFilter === t ? '#a78bfa' : 'var(--text-secondary)',
                cursor: 'pointer'
              }}
            >
              {t === 'listening' && <Headphones size={12} />}
              {t === 'reading' && <BookOpen size={12} />}
              {t === 'saved' && <Bookmark size={12} />}
              <span className="hidden sm:inline">{t === 'all' ? 'All' : t === 'listening' ? 'Listening' : t === 'reading' ? 'Reading' : 'Saved'}</span>
              <span className="sm:hidden">{t === 'all' ? 'All' : t.charAt(0).toUpperCase()}</span>
            </button>
          ))}
        </div>

        {/* Status & Sorting filters */}
        {!isSavedMode && (
          <>
            <select value={statusFilter} onChange={e => setStatusFilter(e.target.value as FilterStatus)} className="input-field text-xs md:text-sm" style={{ width: 'auto', padding: '6px 10px' }}>
              <option value="all">All Statuses</option>
              <option value="completed">Completed</option>
              <option value="in-progress">In Progress</option>
            </select>

            <select value={sortBy} onChange={e => setSortBy(e.target.value as 'date' | 'score')} className="input-field text-xs md:text-sm" style={{ width: 'auto', padding: '6px 10px' }}>
              <option value="date">Newest First</option>
              <option value="score">Highest Score</option>
            </select>
          </>
        )}
      </div>

      {/* Exercise list */}
      <div className="flex flex-col gap-2 md:gap-3">
        {filtered.length === 0 ? (
          <div className="card p-16 text-center">
            <div className="text-5xl mb-4">📭</div>
            <p className="font-semibold text-lg mb-2">No exercises found</p>
            <p className="text-sm" style={{ color: 'var(--text-muted)' }}>Try adjusting filters or create a new exercise</p>
            <div className="flex gap-3 justify-center mt-6">
              <Link href="/listening"><button className="btn-primary px-5 py-2.5 text-sm flex items-center gap-2"><Headphones size={15} /> Listening Practice</button></Link>
              <Link href="/reading"><button className="btn-secondary px-5 py-2.5 text-sm flex items-center gap-2"><BookOpen size={15} /> Reading Practice</button></Link>
            </div>
          </div>
        ) : (
          filtered.map(ex => {
            if (isSavedMode) {
              const b = ex as any;
              return (
                <div key={b.id} className="card p-4 flex items-start sm:items-center gap-3 sm:gap-4 hover:border-purple-500/30 transition-all cursor-pointer" style={{ position: 'relative' }}>
                  {/* Icon */}
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0" style={{
                    background: b.type === 'listening' ? 'rgba(108,99,255,0.15)' : 'rgba(16,185,129,0.15)'
                  }}>
                    {b.type === 'listening'
                      ? <Headphones size={18} color="#a78bfa" />
                      : <BookOpen size={18} color="#34d399" />}
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2 mb-1.5">
                      <span className="font-semibold text-sm text-gray-800 leading-snug break-words">{b.title}</span>
                      <span className="badge badge-blue shrink-0 text-xs flex items-center gap-1"><Bookmark size={10} fill="currentColor" /> Saved</span>
                    </div>
                    <div className="flex flex-wrap items-center gap-1.5 text-xs" style={{ color: 'var(--text-muted)' }}>
                      <span className="px-2 py-0.5 rounded-md" style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid var(--border)' }}>By {b.author}</span>
                      <span className="px-2 py-0.5 rounded-md" style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid var(--border)' }}>{b.publishedAt}</span>
                      <span className={`badge ${getDifficultyColor(b.difficulty)} text-xs px-2 py-0.5`}>{b.difficulty}</span>
                      <span className="px-2 py-0.5 rounded-md" style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid var(--border)' }}>{b.questionCount} Qs</span>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex items-center gap-1.5 shrink-0">
                    <Link href={`${b.type === 'listening' ? '/listening' : '/reading'}?take=${b.id}`}>
                      <button className="btn-primary text-xs px-3 py-1.5 flex items-center gap-1.5" style={{ borderRadius: '8px' }}>
                        Start<span className="hidden sm:inline"> Quiz</span>
                      </button>
                    </Link>
                    <button
                      onClick={(e) => { e.stopPropagation(); toggleBookmark(b); }}
                      className="p-1.5 rounded-lg text-red-400 hover:bg-red-500/10 transition-all cursor-pointer"
                      title="Remove Bookmark"
                      style={{ background: 'none', border: 'none' }}
                    >
                      <Trash2 size={16} color="#f87171" />
                    </button>
                  </div>
                </div>
              );
            }

            const exercise = ex as Exercise;
            return (
              <div key={exercise.id} className="card p-4 flex gap-3 sm:gap-4 hover:border-purple-500/30 transition-all cursor-pointer relative">
                {/* Left: Icon */}
                <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0" style={{
                  background: exercise.type === 'listening' ? 'rgba(108,99,255,0.15)' : 'rgba(16,185,129,0.15)'
                }}>
                  {exercise.type === 'listening'
                    ? <Headphones size={18} color="#a78bfa" />
                    : <BookOpen size={18} color="#34d399" />}
                </div>

                {/* Right: Content container */}
                <div className="flex-1 min-w-0 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                  
                  {/* Info Column */}
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2 mb-1.5">
                      <span className="font-semibold text-sm text-gray-800 leading-snug break-words">{exercise.title}</span>
                      {exercise.status === 'in-progress' && (
                        <span className="badge badge-orange shrink-0 text-xs"><Clock size={10} /> In Progress</span>
                      )}
                      {exercise.status === 'completed' && (
                        <span className="badge badge-green shrink-0 text-xs"><CheckCircle size={10} /> Completed</span>
                      )}
                    </div>
                    
                    {/* Metadata tags */}
                    <div className="flex flex-wrap items-center gap-1.5 text-xs" style={{ color: 'var(--text-muted)' }}>
                      <span className="flex items-center gap-1 px-2 py-0.5 rounded-md" style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid var(--border)' }}>
                        <Calendar size={11} /> {formatDate(exercise.createdAt)}
                      </span>
                      <span className="px-2 py-0.5 rounded-md" style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid var(--border)' }}>{exercise.topic}</span>
                      <span className={`badge ${getDifficultyColor(exercise.difficulty)} text-xs px-2 py-0.5`}>{exercise.difficulty}</span>
                      <span className="px-2 py-0.5 rounded-md" style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid var(--border)' }}>{exercise.totalQuestions} Qs</span>
                    </div>
                  </div>

                  {/* Score & Action Buttons Column */}
                  <div className="flex items-center justify-between sm:justify-end gap-3 shrink-0 pt-2 sm:pt-0 border-t border-dashed border-gray-100 dark:border-gray-800 sm:border-t-0">
                    {/* Score (only on completed) */}
                    {exercise.status === 'completed' && exercise.score !== undefined ? (
                      <div className="text-left sm:text-right">
                        <div className="text-base sm:text-lg font-bold" style={{ color: exercise.score >= 80 ? '#34d399' : exercise.score >= 60 ? '#fbbf24' : '#f87171' }}>
                          {exercise.score}%
                        </div>
                        <div className="text-[10px] sm:text-xs" style={{ color: 'var(--text-muted)' }}>{exercise.correctAnswers}/{exercise.totalQuestions} correct</div>
                      </div>
                    ) : (
                      <div className="sm:hidden text-xs text-amber-500 font-medium flex items-center gap-1">
                        <Clock size={11} /> In progress
                      </div>
                    )}

                    {/* Actions menu */}
                    <div style={{ position: 'relative' }}>
                      <button
                        onClick={(e) => { e.stopPropagation(); setOpenMenu(openMenu === exercise.id ? null : exercise.id); }}
                        className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-white/5 transition-all"
                        style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}
                      >
                        <MoreVertical size={16} />
                      </button>
                      {openMenu === exercise.id && (
                        <div style={{
                          position: 'absolute', right: 0, top: '100%', marginTop: '4px', zIndex: 20,
                          background: 'var(--bg-card)', border: '1px solid var(--border-strong)',
                          borderRadius: '12px', padding: '6px', minWidth: '160px',
                          boxShadow: '0 8px 30px rgba(0,0,0,0.4)'
                        }}>
                          <button className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm" style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-secondary)' }} onClick={() => setOpenMenu(null)}>
                            <Eye size={14} /> View
                          </button>
                          <Link href={exercise.type === 'listening' ? '/listening' : '/reading'}>
                            <button className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm" style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-secondary)' }}>
                              <RotateCcw size={14} /> Retry
                            </button>
                          </Link>
                          <button className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm" style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#f87171' }} onClick={() => { deleteExercise(exercise.id); setOpenMenu(null); }}>
                            <Trash2 size={14} /> Delete
                          </button>
                        </div>
                      )}
                    </div>
                  </div>

                </div>
              </div>
            );
          })
        )}
      </div>

      {filtered.length > 0 && (
        <p className="text-center text-sm" style={{ color: 'var(--text-muted)' }}>
          {isSavedMode
            ? `Showing ${filtered.length} of ${bookmarks.length} saved exercises`
            : `Showing ${filtered.length} of ${exercises.length} exercises`
          }
        </p>
      )}
    </div>
  );
}
