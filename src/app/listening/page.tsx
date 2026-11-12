'use client';
import React, { useState, useEffect, useRef } from 'react';
import {
  Music, Settings, CheckCircle, XCircle, Download,
  ChevronDown, ChevronRight, Lightbulb, RefreshCw,
  Headphones, Sparkles, ArrowRight, Upload, Link2 as LinkIcon,
  Search, Share2, Bookmark, BookOpen, Users, Star, Clock,
  ListOrdered, FileText, CheckSquare, Link2, Edit3, AlertCircle
} from 'lucide-react';
import { useListeningStore } from '@/store/useListeningStore';
import { useBookmarkStore } from '@/store/useBookmarkStore';
import { useQuizStore } from '@/store/useQuizStore';
import SuggestedExercises from '@/components/SuggestedExercises';
import { sampleAudios } from '@/lib/mock/data';

const Youtube = ({ size = 20, className = '' }: { size?: number; className?: string }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
  </svg>
);

const DIFFICULTY_LEVELS = ['A2', 'B1', 'B2', 'C1', 'Easy', 'Medium', 'Hard'];
const QUESTION_TYPES = [
  { id: 'multiple-choice', label: 'Multiple Choice', Icon: ListOrdered },
  { id: 'gap-fill', label: 'Gap Fill', Icon: FileText },
  { id: 'true-false', label: 'True / False', Icon: CheckSquare },
  { id: 'matching', label: 'Matching', Icon: Link2 },
  { id: 'short-answer', label: 'Short Answer', Icon: Edit3 },
];

export default function ListeningPage() {
  const { toggleBookmark, isBookmarked } = useBookmarkStore();
  const publishedQuizzes = useQuizStore((s) => s.publishedListeningQuizzes);
  const addPublishedListeningQuiz = useQuizStore((s) => s.addPublishedListeningQuiz);

  const {
    mode, searchQuery, isPublished, isPublishing, step,
    audioUrl, youtubeId, transcript, inputMode, fileName, questionCount, difficulty, selectedTypes,
    questions, answers, score, expandedExplanation, isLoading, error,
    setMode, setSearchQuery, setAudioUrl, setInputMode, setFileName,
    setQuestionCount, setDifficulty,
    setStep, setExpandedExplanation,
    toggleType, handleAnswer, handleFileUpload, handleAudioSubmit,
    handleGenerate, handleSubmit, handleReset,
    handleTakePublished, handlePublish: storeHandlePublish
  } = useListeningStore();

  // Check if the current source is a valid YouTube URL for AI generation
  const isYouTubeSource = !!(youtubeId || audioUrl.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)/));

  const [showTranscript, setShowTranscript] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const takeId = params.get('take');
      if (takeId) {
        const allQuizzes = [...publishedQuizzes];
        const stored = localStorage.getItem('published_listening_quizzes');
        if (stored) { try { allQuizzes.push(...JSON.parse(stored)); } catch {} }
        const bookmarkedRaw = localStorage.getItem('english_app_bookmarks');
        if (bookmarkedRaw) { try { allQuizzes.push(...JSON.parse(bookmarkedRaw)); } catch {} }
        const targetQuiz = allQuizzes.find(q => q.id === takeId);
        if (targetQuiz) {
          handleTakePublished(targetQuiz);
          window.history.replaceState({}, '', window.location.pathname);
        }
      }
    }
  }, [publishedQuizzes, handleTakePublished]);

  const [showPublishModal, setShowPublishModal] = useState(false);
  const [pubTitle, setPubTitle] = useState('');
  const [pubTopic, setPubTopic] = useState('General');
  const [pubDifficulty, setPubDifficulty] = useState(difficulty);

  const openPublishModal = () => {
    setPubTitle(`Listening Quiz – ${difficulty}`);
    setPubTopic('General');
    setPubDifficulty(difficulty);
    setShowPublishModal(true);
  };

  const handleConfirmPublish = async () => {
    setShowPublishModal(false);
    await storeHandlePublish(addPublishedListeningQuiz, {
      title: pubTitle || `Listening Quiz – ${pubDifficulty}`,
      topic: pubTopic || 'General',
      difficulty: pubDifficulty || difficulty,
    });
  };

  const filteredQuizzes = publishedQuizzes.filter(q =>
    q.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    q.difficulty.toLowerCase().includes(searchQuery.toLowerCase()) ||
    q.author.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="w-full">

      {/* ── Mode Toggle ── */}
      {step === 'input' && (
        <div className="flex justify-center mb-8">
          <div className="inline-flex bg-white border border-gray-100 rounded-full p-1 shadow-[0_2px_10px_rgba(0,0,0,0.03)]">
            <button
              onClick={() => setMode('ai')}
              className={`flex items-center gap-2 px-5 py-2 rounded-full text-sm font-semibold transition-all duration-200 ${
                mode === 'ai' ? 'bg-violet-600 text-white shadow-md' : 'text-gray-500 hover:text-gray-800'
              }`}
            >
              <Sparkles size={14} /> AI mode
            </button>
            <button
              onClick={() => setMode('search')}
              className={`flex items-center gap-2 px-5 py-2 rounded-full text-sm font-semibold transition-all duration-200 ${
                mode === 'search' ? 'bg-violet-600 text-white shadow-md' : 'text-gray-500 hover:text-gray-800'
              }`}
            >
              <Search size={14} /> Search
            </button>
          </div>
        </div>
      )}

      {/* ── Search Panel ── */}
      {step === 'input' && mode === 'search' && (
        <div className="w-full max-w-4xl mx-auto animate-fade-in-up">
          <div className="flex items-center gap-3 bg-white border border-gray-100 rounded-2xl px-5 py-4 shadow-[0_4px_20px_rgba(0,0,0,0.02)] mb-8">
            <Search size={18} className="text-gray-400 shrink-0" />
            <input
              className="flex-1 outline-none bg-transparent text-sm"
              style={{ color: 'var(--text-primary)' }}
              placeholder="Search quizzes by title, difficulty, or author..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
            />
            {searchQuery && (
              <button onClick={() => setSearchQuery('')} className="text-xs text-gray-400 hover:text-gray-600">Clear</button>
            )}
          </div>

          {filteredQuizzes.length === 0 ? (
            <div className="text-center py-20">
              <div className="w-16 h-16 rounded-2xl bg-gray-50 flex items-center justify-center mx-auto mb-4 border border-gray-100">
                <BookOpen size={28} className="text-gray-400" />
              </div>
              <p className="font-semibold text-gray-600 mb-1">No quizzes found</p>
              <p className="text-sm text-gray-400">Be the first! Create a quiz with AI and publish it.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredQuizzes.map(quiz => (
                <div key={quiz.id} className="card p-5 hover:-translate-y-1 transition-all duration-300 border border-gray-100/80 shadow-[0_4px_20px_rgba(0,0,0,0.02)] hover:shadow-[0_12px_24px_rgba(0,0,0,0.06)] rounded-2xl bg-white">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-xl bg-violet-50 flex items-center justify-center shrink-0 border border-violet-100">
                      <Music size={20} className="text-violet-500" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-bold text-sm mb-1 truncate text-gray-800">{quiz.title}</h4>
                      <div className="flex items-center gap-3 text-xs mb-3 text-gray-400">
                        <span className="flex items-center gap-1"><Users size={11} /> {quiz.author}</span>
                        <span className="flex items-center gap-1"><Star size={11} className="text-amber-400 fill-amber-400" /> {quiz.rating}</span>
                        <span className="flex items-center gap-1"><Clock size={11} /> {quiz.publishedAt}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex gap-2">
                          <span className="text-xs bg-violet-50/60 text-violet-600 border border-violet-100 px-2 py-0.5 rounded-full font-medium">{quiz.difficulty}</span>
                          <span className="text-xs bg-gray-50 text-gray-500 px-2 py-0.5 rounded-full font-medium">{quiz.questionCount} Qs</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => toggleBookmark({
                              id: quiz.id,
                              title: quiz.title,
                              type: 'listening',
                              difficulty: quiz.difficulty,
                              questionCount: quiz.questionCount,
                              author: quiz.author,
                              publishedAt: quiz.publishedAt,
                              audioUrl: quiz.audioUrl,
                              questions: quiz.questions
                            })}
                            className={`p-1.5 rounded-lg border transition-all cursor-pointer ${
                              isBookmarked(quiz.id)
                                ? 'bg-violet-50 text-violet-600 border-violet-200'
                                : 'bg-transparent text-gray-400 border-gray-200 hover:text-gray-600 hover:bg-gray-50'
                            }`}
                          >
                            <Bookmark size={14} fill={isBookmarked(quiz.id) ? 'currentColor' : 'none'} />
                          </button>
                          <button
                            onClick={() => handleTakePublished(quiz)}
                            className="flex items-center gap-1.5 text-xs font-semibold text-white bg-violet-600 hover:bg-violet-500 px-3.5 py-2 rounded-xl transition-all shadow-[0_2px_8px_rgba(108,99,255,0.2)] hover:shadow-[0_4px_12px_rgba(108,99,255,0.3)]"
                          >
                            Practice <ArrowRight size={12} />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ── Step 1: Input (AI mode) ── */}
      {step === 'input' && mode === 'ai' && (
        <div className="w-full max-w-4xl mx-auto flex flex-col items-center py-2 animate-fade-in-up">

          {/* Header */}
          <div className="text-center mb-6">
            <h1 className="text-xl font-bold text-gray-800 dark:text-gray-100 mb-1">
              AI Listening Practice with YouTube
            </h1>
            <p className="text-xs md:text-sm text-gray-500 dark:text-gray-400 max-w-md mx-auto leading-relaxed">
              Paste any English YouTube video link. Our AI will automatically extract the transcript and generate customized listening exercises for you.
            </p>
          </div>

          {/* Main YouTube Input Card */}
          <div className="w-full max-w-xl mb-6">
            <div className="w-full bg-white dark:bg-gray-900 border border-gray-200/80 dark:border-gray-800 rounded-2xl p-5 shadow-[0_4px_24px_rgba(0,0,0,0.03)]">
              <div className="flex items-center justify-between mb-2.5">
                <label className="flex items-center gap-1.5 text-xs font-bold text-gray-700 dark:text-gray-300">
                  <Youtube size={15} className="text-red-600" />
                  <span>YouTube Video URL</span>
                </label>
                <span className="text-[10px] font-medium text-emerald-600 bg-emerald-50 dark:bg-emerald-950/40 px-2 py-0.5 rounded-full border border-emerald-200/50">
                  Auto-transcription
                </span>
              </div>

              <div className="relative flex items-center gap-2">
                <div className="flex-1 flex items-center gap-2.5 bg-gray-50 dark:bg-gray-800/60 border border-gray-200/70 dark:border-gray-700 rounded-xl px-3.5 py-2.5 focus-within:border-red-500 focus-within:ring-2 focus-within:ring-red-500/10 transition-all">
                  <LinkIcon size={15} className="text-gray-400 shrink-0" />
                  <input
                    className="flex-1 bg-transparent border-none outline-none text-xs text-gray-800 dark:text-gray-200 placeholder:text-gray-400"
                    placeholder="https://www.youtube.com/watch?v=... or https://youtu.be/..." 
                    value={audioUrl}
                    onChange={e => {
                      setAudioUrl(e.target.value);
                      if (error) useListeningStore.getState().setError(null);
                    }}
                    onKeyDown={e => e.key === 'Enter' && handleAudioSubmit()}
                  />
                </div>
                <button
                  onClick={handleAudioSubmit}
                  disabled={!audioUrl.trim()}
                  className="px-4 h-10 rounded-xl bg-red-600 hover:bg-red-500 disabled:opacity-40 text-white text-xs font-bold flex items-center gap-1.5 transition-all shadow-sm shadow-red-200 cursor-pointer"
                >
                  <span>Continue</span>
                  <ArrowRight size={14} />
                </button>
              </div>

              {/* Error if present */}
              {error && (
                <div className="mt-3 p-3 rounded-xl bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900/50 text-red-600 dark:text-red-400 text-xs flex items-center gap-2">
                  <AlertCircle size={15} className="shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              {/* Supported format badges */}
              <div className="flex flex-wrap items-center gap-1.5 mt-3 pt-3 border-t border-gray-100 dark:border-gray-800/80">
                <span className="text-[10px] text-gray-400 font-medium">Supported formats:</span>
                <span className="text-[10px] font-medium text-gray-500 dark:text-gray-400 bg-gray-50 dark:bg-gray-800 border border-gray-100 dark:border-gray-700 px-2 py-0.5 rounded-md">youtube.com/watch?v=ID</span>
                <span className="text-[10px] font-medium text-gray-500 dark:text-gray-400 bg-gray-50 dark:bg-gray-800 border border-gray-100 dark:border-gray-700 px-2 py-0.5 rounded-md">youtu.be/ID</span>
                <span className="text-[10px] font-medium text-gray-500 dark:text-gray-400 bg-gray-50 dark:bg-gray-800 border border-gray-100 dark:border-gray-700 px-2 py-0.5 rounded-md">youtube.com/embed/ID</span>
              </div>
            </div>
          </div>

          {/* Sample YouTube Videos */}
          <div className="w-full max-w-xl">
            <h3 className="text-[11px] font-bold uppercase tracking-wider mb-3 flex items-center gap-2 text-gray-400">
              <Youtube size={13} className="text-red-500" />
              <span>Or choose a sample YouTube video with captions</span>
              <div className="flex-1 h-px bg-gray-100 dark:bg-gray-800" />
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {sampleAudios.map(ex => (
                <div
                  key={ex.title}
                  onClick={() => {
                    setAudioUrl(ex.url);
                    setFileName(ex.title);
                    const ytMatch = ex.url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\n?#]+)/);
                    if (ytMatch) {
                      useListeningStore.getState().setYoutubeId(ytMatch[1]);
                    }
                    useListeningStore.getState().setError(null);
                    setStep('configure');
                  }}
                  className="card flex items-start gap-3 p-3.5 cursor-pointer hover:border-red-200 dark:hover:border-red-900/60 hover:-translate-y-0.5 transition-all duration-300 bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 shadow-[0_2px_10px_rgba(0,0,0,0.01)] rounded-2xl group"
                >
                  <div className="w-10 h-10 rounded-xl bg-red-50 dark:bg-red-950/30 flex items-center justify-center shrink-0 border border-red-100/60 dark:border-red-900/40 group-hover:scale-105 transition-transform">
                    <Youtube size={20} className="text-red-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="text-[11px] font-bold truncate mb-0.5 text-gray-700 dark:text-gray-200">{ex.title}</h4>
                    <span className="text-[10px] font-semibold text-red-600 hover:underline">
                      + Select this video
                    </span>
                    <div className="flex items-center justify-between text-[9px] mt-2 pt-1.5 border-t border-gray-50 dark:border-gray-800 text-gray-400">
                      <span>{ex.duration} • {ex.difficulty}</span>
                      <Headphones size={10} />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ── Step 2: Configure ── */}
      {step === 'configure' && (
        <div className="mx-auto w-full" style={{ maxWidth: '680px' }}>
          <div className="card" style={{ padding: '32px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px' }}>
              <div style={{ width: '48px', height: '48px', borderRadius: '14px', background: 'rgba(108,99,255,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Settings size={22} color="#a78bfa" />
              </div>
              <div>
                <h2 style={{ fontSize: '18px', fontWeight: 700 }}>Customize Exercise</h2>
                <p className="text-xs text-gray-500 dark:text-gray-400 flex items-center gap-1.5 mt-0.5 truncate max-w-md">
                  <Youtube size={14} className="text-red-600 shrink-0" />
                  <span className="truncate">{fileName || (youtubeId ? `YouTube (ID: ${youtubeId})` : audioUrl)}</span>
                </p>
              </div>
            </div>

            {/* Question count */}
            <div style={{ marginBottom: '24px' }}>
              <label style={{ fontSize: '14px', fontWeight: 600, display: 'block', marginBottom: '12px' }}>
                Number of questions: <span style={{ color: 'var(--accent-primary)' }}>{questionCount}</span>
              </label>
              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                {[5, 8, 10, 15, 20].map(n => (
                  <button
                    key={n}
                    onClick={() => setQuestionCount(n)}
                    style={{
                      padding: '8px 18px', borderRadius: '10px', border: `1px solid ${questionCount === n ? '#6c63ff' : 'var(--border)'}`,
                      background: questionCount === n ? 'rgba(108,99,255,0.2)' : 'rgba(255,255,255,0.03)',
                      color: questionCount === n ? '#a78bfa' : 'var(--text-secondary)',
                      cursor: 'pointer', fontWeight: 600, fontSize: '14px', transition: 'all 0.2s'
                    }}
                  >{n}</button>
                ))}
              </div>
            </div>

            {/* Difficulty */}
            <div style={{ marginBottom: '24px' }}>
              <label style={{ fontSize: '14px', fontWeight: 600, display: 'block', marginBottom: '12px' }}>
                Difficulty: <span style={{ color: 'var(--accent-primary)' }}>{difficulty}</span>
              </label>
              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                {DIFFICULTY_LEVELS.map(d => (
                  <button
                    key={d}
                    onClick={() => setDifficulty(d)}
                    style={{
                      padding: '7px 14px', borderRadius: '10px', border: `1px solid ${difficulty === d ? '#6c63ff' : 'var(--border)'}`,
                      background: difficulty === d ? 'rgba(108,99,255,0.2)' : 'rgba(255,255,255,0.03)',
                      color: difficulty === d ? '#a78bfa' : 'var(--text-secondary)',
                      cursor: 'pointer', fontWeight: 500, fontSize: '13px', transition: 'all 0.2s'
                    }}
                  >{d}</button>
                ))}
              </div>
            </div>

            {/* Question types */}
            <div style={{ marginBottom: '28px' }}>
              <label style={{ fontSize: '14px', fontWeight: 600, display: 'block', marginBottom: '12px' }}>
                Question types (select multiple)
              </label>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '8px' }}>
                {QUESTION_TYPES.map(type => (
                  <button
                    key={type.id}
                    onClick={() => toggleType(type.id)}
                    style={{
                      padding: '10px 14px', borderRadius: '10px',
                      border: `1px solid ${selectedTypes.includes(type.id) ? '#6c63ff' : 'var(--border)'}`,
                      background: selectedTypes.includes(type.id) ? 'rgba(108,99,255,0.15)' : 'rgba(255,255,255,0.02)',
                      color: selectedTypes.includes(type.id) ? '#a78bfa' : 'var(--text-secondary)',
                      cursor: 'pointer', fontSize: '13px', fontWeight: 500,
                      display: 'flex', alignItems: 'center', gap: '8px',
                      transition: 'all 0.2s', textAlign: 'left'
                    }}
                  >
                    <type.Icon size={15} />
                    <span>{type.label}</span>
                    {selectedTypes.includes(type.id) && <CheckCircle size={14} style={{ marginLeft: 'auto' }} />}
                  </button>
                ))}
              </div>
            </div>

            {error && (
              <div className="p-3 mb-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-600 dark:text-red-400 text-xs flex items-center gap-2">
                <AlertCircle size={15} className="shrink-0" />
                <span>{error}</span>
              </div>
            )}

            {!isYouTubeSource && !error && (
              <div className="p-3 mb-4 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-700 dark:text-amber-400 text-xs flex items-center gap-2">
                <AlertCircle size={15} className="shrink-0" />
                <span>AI generation requires a <b>YouTube URL</b>. Uploaded audio files are not supported — please paste a YouTube link instead.</span>
              </div>
            )}

            <div style={{ display: 'flex', gap: '10px' }}>
              <button className="btn-secondary" onClick={() => setStep('input')} style={{ flex: 1 }}>Back</button>
              <button
                className="btn-primary"
                onClick={handleGenerate}
                disabled={selectedTypes.length === 0 || isLoading || !isYouTubeSource}
                style={{ flex: 2, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}
              >
                {isLoading ? (
                  <><div style={{ width: '16px', height: '16px', border: '2px solid rgba(255,255,255,0.3)', borderTopColor: 'white', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
                  AI is generating...</>
                ) : (
                  <>Generate Exercise</>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Step 3: Practice ── */}
      {step === 'practice' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">

          {/* Left: Audio Player */}
          <div className="flex flex-col gap-4">
            {/* Player card */}
            <div className="card" style={{ padding: '32px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '20px' }}>
              {/* Visual */}
              <div style={{
                width: '80px', height: '80px', borderRadius: '20px',
                background: 'linear-gradient(135deg, rgba(108,99,255,0.2), rgba(139,92,246,0.15))',
                border: '1px solid rgba(108,99,255,0.2)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                boxShadow: '0 8px 24px rgba(108,99,255,0.15)'
              }}>
                <Headphones size={36} color="#a78bfa" />
              </div>

              {/* Title */}
              <div style={{ textAlign: 'center' }}>
                <p style={{ fontSize: '14px', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '4px' }}>
                  {fileName || 'Audio Exercise'}
                </p>
                <p style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Listen carefully and answer the questions</p>
              </div>

              {/* Audio / YouTube Player */}
              {youtubeId ? (
                <div className="w-full aspect-video rounded-xl overflow-hidden bg-black shadow-md border border-gray-200/50 dark:border-gray-800">
                  <iframe
                    src={`https://www.youtube.com/embed/${youtubeId}?rel=0`}
                    className="w-full h-full border-none"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                </div>
              ) : audioUrl ? (
                <audio
                  controls
                  src={audioUrl}
                  style={{ width: '100%', borderRadius: '12px', outline: 'none' }}
                >
                  Your browser does not support the audio element.
                </audio>
              ) : (
                <div style={{
                  width: '100%', padding: '16px', background: 'rgba(108,99,255,0.05)',
                  border: '1px dashed rgba(108,99,255,0.3)', borderRadius: '12px',
                  textAlign: 'center', fontSize: '13px', color: 'var(--text-muted)'
                }}>
                  No audio source — questions are still available below
                </div>
              )}

              {/* Transcript accordion if available */}
              {transcript && (
                <div className="w-full mt-2 rounded-xl border border-gray-200/60 dark:border-gray-800 bg-white/50 dark:bg-gray-900/50 overflow-hidden">
                  <button
                    onClick={() => setShowTranscript(!showTranscript)}
                    className="w-full px-4 py-2.5 flex items-center justify-between text-xs font-semibold text-gray-700 dark:text-gray-300 hover:bg-gray-50/60 dark:hover:bg-gray-800/40 transition-colors"
                  >
                    <span className="flex items-center gap-2">
                      <FileText size={14} className="text-indigo-500" />
                      <span>Video Transcript</span>
                    </span>
                    <ChevronDown size={14} className={`text-gray-400 transition-transform duration-200 ${showTranscript ? 'rotate-180' : ''}`} />
                  </button>
                  {showTranscript && (
                    <div className="px-4 py-3 text-xs leading-relaxed text-gray-600 dark:text-gray-300 border-t border-gray-100 dark:border-gray-800/60 max-h-56 overflow-y-auto whitespace-pre-wrap">
                      {transcript}
                    </div>
                  )}
                </div>
              )}

              {/* Tips */}
              <div style={{
                width: '100%', padding: '12px 16px', background: 'rgba(245,158,11,0.08)',
                border: '1px solid rgba(245,158,11,0.2)', borderRadius: '12px',
                display: 'flex', alignItems: 'flex-start', gap: '10px'
              }}>
                <Lightbulb size={15} color="#f59e0b" style={{ marginTop: '2px', flexShrink: 0 }} />
                <div>
                  <p style={{ fontSize: '12px', fontWeight: 600, color: '#d97706', marginBottom: '2px' }}>Tip</p>
                  <p style={{ fontSize: '11px', color: 'var(--text-muted)', lineHeight: 1.5 }}>
                    Listen to the audio first, then answer the questions. You can pause and replay as needed.
                  </p>
                </div>
              </div>
            </div>

            {/* Stats card */}
            <div className="card" style={{ padding: '16px', display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{ display: 'flex', gap: '8px' }}>
                <span className="badge badge-purple"><Headphones size={12} /> Listening</span>
                <span className="badge badge-blue">{difficulty}</span>
              </div>
              <div style={{ marginLeft: 'auto', fontSize: '13px', color: 'var(--text-muted)' }}>
                {Object.keys(answers).length}/{questions.length} answered
              </div>
            </div>
          </div>

          {/* Right: Questions */}
          <div className="flex flex-col gap-3 overflow-y-auto lg:max-h-[calc(100vh-160px)] pr-1">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', position: 'sticky', top: 0, background: 'var(--bg-primary)', paddingBottom: '12px', zIndex: 5 }}>
              <h3 style={{ fontSize: '16px', fontWeight: 700 }}>Questions ({questions.length})</h3>
              <button className="btn-primary" onClick={handleSubmit} style={{ padding: '8px 18px', fontSize: '13px' }}>Submit</button>
            </div>

            {questions.map((q, idx) => (
              <div key={q.id} className="question-card">
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', marginBottom: '14px' }}>
                  <div style={{
                    width: '28px', height: '28px', borderRadius: '8px', flexShrink: 0,
                    background: answers[q.id] ? 'rgba(108,99,255,0.2)' : 'rgba(255,255,255,0.06)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: '12px', fontWeight: 700, color: answers[q.id] ? '#a78bfa' : 'var(--text-muted)'
                  }}>
                    {idx + 1}
                  </div>
                  <p style={{ fontSize: '14px', lineHeight: 1.6 }}>{q.question}</p>
                </div>

                {q.type === 'multiple-choice' || q.type === 'true-false' || q.type === 'matching' ? (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', paddingLeft: '38px' }}>
                    {(q.type === 'true-false' && (!q.options || q.options.length === 0) ? ['TRUE', 'FALSE'] : (q.options || [])).map((opt, i) => (
                      <button
                        key={i}
                        className={`option-btn ${answers[q.id] === opt ? 'selected' : ''}`}
                        onClick={() => handleAnswer(q.id, opt)}
                      >
                        <span style={{
                          width: '22px', height: '22px', borderRadius: '50%', flexShrink: 0,
                          background: answers[q.id] === opt ? 'rgba(108,99,255,0.3)' : 'rgba(255,255,255,0.05)',
                          border: `1px solid ${answers[q.id] === opt ? '#6c63ff' : 'var(--border)'}`,
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                          fontSize: '11px', fontWeight: 700
                        }}>
                          {String.fromCharCode(65 + i)}
                        </span>
                        {opt}
                      </button>
                    ))}
                  </div>
                ) : (
                  <div style={{ paddingLeft: '38px' }}>
                    <input className="input-field" placeholder="Type your answer..." value={answers[q.id] || ''} onChange={e => handleAnswer(q.id, e.target.value)} />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── Step 4: Results ── */}
      {step === 'results' && (
        <div className="mx-auto w-full" style={{ maxWidth: '800px' }}>
          {/* Score Card */}
          <div style={{
            background: score >= 80
              ? 'linear-gradient(135deg, rgba(16,185,129,0.2), rgba(52,211,153,0.1))'
              : score >= 60
              ? 'linear-gradient(135deg, rgba(245,158,11,0.2), rgba(251,191,36,0.1))'
              : 'linear-gradient(135deg, rgba(239,68,68,0.2), rgba(248,113,113,0.1))',
            border: `1px solid ${score >= 80 ? 'rgba(16,185,129,0.3)' : score >= 60 ? 'rgba(245,158,11,0.3)' : 'rgba(239,68,68,0.3)'}`,
            borderRadius: '20px', padding: '32px', textAlign: 'center', marginBottom: '24px'
          }}>
            <div style={{ fontSize: '48px', fontWeight: 900, marginBottom: '8px', color: score >= 80 ? '#34d399' : score >= 60 ? '#fbbf24' : '#f87171' }}>
              {score}%
            </div>
            <p style={{ fontSize: '16px', color: 'var(--text-secondary)', marginBottom: '8px' }}>
              {score >= 80 ? 'Excellent! You did great!' : score >= 60 ? 'Good job! Keep going!' : 'Keep practicing!'}
            </p>
            <div style={{ display: 'flex', justifyContent: 'center', gap: '24px', marginTop: '16px' }}>
              <div>
                <div style={{ fontSize: '22px', fontWeight: 800, color: '#34d399' }}>
                  {questions.filter(q => {
                    const ans = answers[q.id] || '';
                    const correct = Array.isArray(q.answer) ? q.answer[0] : q.answer;
                    return ans.toLowerCase().includes(correct.toLowerCase()) || correct.toLowerCase().includes(ans.toLowerCase());
                  }).length}
                </div>
                <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Correct</div>
              </div>
              <div style={{ width: '1px', background: 'var(--border)' }} />
              <div>
                <div style={{ fontSize: '22px', fontWeight: 800, color: '#f87171' }}>
                  {questions.length - questions.filter(q => {
                    const ans = answers[q.id] || '';
                    const correct = Array.isArray(q.answer) ? q.answer[0] : q.answer;
                    return ans.toLowerCase().includes(correct.toLowerCase()) || correct.toLowerCase().includes(ans.toLowerCase());
                  }).length}
                </div>
                <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Wrong</div>
              </div>
              <div style={{ width: '1px', background: 'var(--border)' }} />
              <div>
                <div style={{ fontSize: '22px', fontWeight: 800 }}>{questions.length}</div>
                <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Total</div>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div style={{ display: 'flex', gap: '10px', marginBottom: '16px' }}>
            <button className="btn-primary" onClick={handleReset} style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}><RefreshCw size={15} /> New Exercise</button>
            <button className="btn-secondary" style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}><Download size={15} /> Download Worksheet</button>
          </div>

          {/* Publish banner */}
          {!isPublished ? (
            <div style={{
              background: 'linear-gradient(135deg, rgba(108,99,255,0.08), rgba(139,92,246,0.06))',
              border: '1px solid rgba(108,99,255,0.2)',
              borderRadius: '16px', padding: '20px', marginBottom: '24px',
              display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '16px'
            }}>
              <div>
                <p style={{ fontWeight: 700, fontSize: '14px', marginBottom: '4px' }}>Share this exercise</p>
                <p style={{ fontSize: '13px', color: 'var(--text-muted)' }}>Publish this exercise for the community to practice</p>
              </div>
              <button
                onClick={openPublishModal}
                disabled={isPublishing}
                style={{
                  background: 'linear-gradient(135deg, #6c63ff, #8b5cf6)',
                  color: 'white', border: 'none', borderRadius: '12px',
                  padding: '10px 20px', cursor: 'pointer', fontWeight: 700, fontSize: '13px',
                  display: 'flex', alignItems: 'center', gap: '8px',
                  opacity: isPublishing ? 0.7 : 1, whiteSpace: 'nowrap'
                }}
              >
                {isPublishing
                  ? <><div style={{ width: '14px', height: '14px', border: '2px solid rgba(255,255,255,0.3)', borderTopColor: 'white', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} /> Publishing...</>
                  : <><Share2 size={14} /> Publish</>
                }
              </button>
            </div>
          ) : (
            <div style={{
              background: 'linear-gradient(135deg, rgba(16,185,129,0.1), rgba(52,211,153,0.07))',
              border: '1px solid rgba(16,185,129,0.3)',
              borderRadius: '16px', padding: '20px', marginBottom: '24px',
              display: 'flex', alignItems: 'center', gap: '12px'
            }}>
              <CheckCircle size={22} color="#34d399" />
              <div>
                <p style={{ fontWeight: 700, fontSize: '14px', color: '#34d399', marginBottom: '2px' }}>Successfully Published!</p>
                <p style={{ fontSize: '13px', color: 'var(--text-muted)' }}>This exercise is now available in the Search tab.</p>
              </div>
            </div>
          )}

          {/* Detailed Results */}
          <h3 style={{ fontSize: '16px', fontWeight: 700, marginBottom: '16px' }}>Detailed Results</h3>
          {questions.map((q, idx) => {
            const userAnswer = answers[q.id] || '';
            const correctAnswer = Array.isArray(q.answer) ? q.answer[0] : q.answer;
            const isCorrect = userAnswer.toLowerCase().includes(correctAnswer.toLowerCase()) ||
              correctAnswer.toLowerCase().includes(userAnswer.toLowerCase());

            return (
              <div key={q.id} className="question-card" style={{ borderColor: isCorrect ? 'rgba(16,185,129,0.3)' : 'rgba(239,68,68,0.3)' }}>
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
                  <div style={{ marginTop: '2px', flexShrink: 0 }}>
                    {isCorrect ? <CheckCircle size={20} color="#34d399" /> : <XCircle size={20} color="#f87171" />}
                  </div>
                  <div style={{ flex: 1 }}>
                    <p style={{ fontSize: '14px', fontWeight: 600, marginBottom: '8px' }}>Q{idx + 1}: {q.question}</p>
                    {!isCorrect && (
                      <div style={{ fontSize: '13px', marginBottom: '8px' }}>
                        <span style={{ color: '#f87171' }}>Your answer: {userAnswer || '(no answer)'}</span>
                        <br />
                        <span style={{ color: '#34d399' }}>Correct answer: {correctAnswer}</span>
                      </div>
                    )}
                    <button
                      onClick={() => setExpandedExplanation(expandedExplanation === q.id ? null : q.id)}
                      style={{
                        background: 'rgba(108,99,255,0.1)', border: '1px solid rgba(108,99,255,0.2)',
                        borderRadius: '8px', padding: '6px 12px', cursor: 'pointer',
                        color: '#a78bfa', fontSize: '12px', display: 'flex', alignItems: 'center', gap: '6px'
                      }}
                    >
                      <Lightbulb size={13} /> AI Explanation
                      {expandedExplanation === q.id ? <ChevronDown size={13} /> : <ChevronRight size={13} />}
                    </button>
                    {expandedExplanation === q.id && (
                      <div style={{
                        marginTop: '10px', padding: '12px', background: 'rgba(108,99,255,0.08)',
                        border: '1px solid rgba(108,99,255,0.15)', borderRadius: '10px',
                        fontSize: '13px', color: 'var(--text-secondary)', lineHeight: 1.6
                      }}>
                        {q.explanation}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* ── Suggested Exercises after results ── */}
      {step === 'results' && <SuggestedExercises />}

      {/* ── Publish Modal ── */}
      {showPublishModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
          <div className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-2xl p-6 w-full max-w-md shadow-2xl animate-fade-in-up">
            <h3 className="text-base font-bold mb-4 text-gray-900 dark:text-white">Publish Test to Community</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1">Test Title</label>
                <input type="text" value={pubTitle} onChange={e => setPubTitle(e.target.value)}
                  placeholder="e.g. BBC Listening – Environment"
                  className="w-full px-3 py-2 text-xs border border-gray-200 dark:border-gray-700 rounded-xl bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white outline-none focus:border-violet-500"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1">Topic / Category</label>
                <select value={pubTopic} onChange={e => setPubTopic(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-gray-200 dark:border-gray-700 rounded-xl bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white outline-none focus:border-violet-500">
                  <option value="General">General</option>
                  <option value="Technology">Technology</option>
                  <option value="Psychology">Psychology</option>
                  <option value="Environment">Environment</option>
                  <option value="Urban Planning">Urban Planning</option>
                  <option value="Education">Education</option>
                  <option value="Science">Science</option>
                  <option value="Culture">Culture</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1">Difficulty Level</label>
                <select value={pubDifficulty} onChange={e => setPubDifficulty(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-gray-200 dark:border-gray-700 rounded-xl bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white outline-none focus:border-violet-500">
                  {['A1', 'A2', 'B1', 'B2', 'C1', 'C2'].map(lvl => <option key={lvl} value={lvl}>{lvl}</option>)}
                </select>
              </div>
            </div>
            <div className="flex gap-2.5 justify-end mt-6">
              <button onClick={() => setShowPublishModal(false)}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-gray-600 dark:text-gray-400 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200">
                Cancel
              </button>
              <button onClick={handleConfirmPublish}
                className="px-4 py-2 rounded-xl text-xs font-bold text-white bg-violet-600 hover:bg-violet-500 shadow-md">
                Confirm & Publish
              </button>
            </div>
          </div>
        </div>
      )}

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}
