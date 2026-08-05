'use client';
import React, { useState, useRef, useEffect } from 'react';
import {
  FileText, Upload, Settings, CheckCircle, XCircle,
  Download, ChevronDown, ChevronRight, Lightbulb, RefreshCw,
  BookOpen, AlertCircle, File, Sparkles, Plus, Globe, ArrowRight,
  Search, Share2, Users, Star, Clock, Headphones, Bookmark,
  ListOrdered, CheckSquare, Link2, Edit3
} from 'lucide-react';
import { generateQuestions, Question } from '@/lib/store';
import { useApp } from '@/context/AppContext';
import { PublishedQuiz, useReadingStore } from '@/store/useAppStore';

type Step = 'input' | 'configure' | 'practice' | 'results';

const QUESTION_TYPES = [
  { id: 'multiple-choice', label: 'Multiple Choice', Icon: ListOrdered },
  { id: 'gap-fill', label: 'Gap Fill', Icon: FileText },
  { id: 'true-false', label: 'True / False', Icon: CheckSquare },
  { id: 'matching', label: 'Matching', Icon: Link2 },
  { id: 'short-answer', label: 'Short Answer', Icon: Edit3 },
];

const SAMPLE_PASSAGE = `Urban development has transformed cities around the world at an unprecedented pace. As populations continue to migrate from rural to urban areas, city planners face the challenge of accommodating millions of new residents while maintaining quality of life.

The concept of sustainable urban development has emerged as a key framework for addressing these challenges. This approach seeks to balance economic growth, environmental protection, and social equity. Cities like Singapore, Copenhagen, and Medellín have become global models for innovative urban planning, demonstrating that rapid development need not come at the expense of livability.

Green infrastructure plays a crucial role in sustainable cities. Urban forests, green roofs, and parks not only improve air quality and reduce the urban heat island effect, but also provide residents with vital recreational spaces. Research has consistently shown that access to green space improves mental health outcomes and strengthens community bonds.

Transportation networks are another critical consideration. Cities that invest heavily in public transit, cycling infrastructure, and pedestrian-friendly streetscapes tend to see reduced traffic congestion, lower carbon emissions, and improved public health. The shift away from car-centric planning represents one of the most significant transformations in urban design thinking.

Housing affordability remains one of the most pressing issues facing growing cities. As demand outpaces supply in desirable urban areas, prices rise and lower-income residents face displacement. Innovative solutions including community land trusts, inclusionary zoning, and modular construction are being explored as potential remedies.`;

// ── Suggested Exercises Component ──────────────────────────────────────────
function SuggestedExercises({ currentType }: { currentType: 'listening' | 'reading' }) {
  const [communityQuizzes, setCommunityQuizzes] = useState<any[]>([]);

  useEffect(() => {
    const listening = JSON.parse(localStorage.getItem('published_listening_quizzes') || '[]');
    const reading = JSON.parse(localStorage.getItem('published_reading_quizzes') || '[]');
    const all = [
      ...listening.map((q: any) => ({ ...q, moduleType: 'listening' })),
      ...reading.map((q: any) => ({ ...q, moduleType: 'reading' })),
    ].sort(() => Math.random() - 0.5).slice(0, 4);
    setCommunityQuizzes(all);
  }, []);

  const suggestions = [
    { title: 'TED Talk: Future of AI', difficulty: 'B2', type: 'listening', qs: 10, tag: 'Listening' },
    { title: 'IELTS Reading: Climate', difficulty: 'C1', type: 'reading', qs: 15, tag: 'Reading' },
    { title: 'BBC News Comprehension', difficulty: 'B1', type: 'listening', qs: 8, tag: 'Listening' },
    { title: 'Academic Vocabulary Boost', difficulty: 'B2', type: 'reading', qs: 12, tag: 'Reading' },
  ];

  return (
    <div style={{ marginTop: '32px', borderTop: '1px solid #f1f3f6', paddingTop: '32px' }}>
      {/* Try Next */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 style={{ fontSize: '15px', fontWeight: 700, color: 'var(--text-primary)' }}>Try Next</h3>
            <p style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '2px' }}>AI-curated exercises based on your level</p>
          </div>
        </div>
        <div className="suggested-exercises-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '14px' }}>
          {suggestions.map((s, i) => (
            <a key={i} href={s.type === 'listening' ? '/listening' : '/reading'} style={{ textDecoration: 'none' }}>
              <div className="card p-4 group" style={{ cursor: 'pointer', transition: 'all 0.2s' }}>
                <div style={{
                  width: '38px', height: '38px', borderRadius: '10px', marginBottom: '10px',
                  background: s.type === 'listening' ? 'rgba(108,99,255,0.1)' : 'rgba(16,185,129,0.1)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center'
                }}>
                  {s.type === 'listening'
                    ? <Headphones size={17} color="#a78bfa" />
                    : <BookOpen size={17} color="#34d399" />}
                </div>
                <p style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '6px', lineHeight: 1.3 }}>{s.title}</p>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '10px' }}>
                  <span style={{
                    fontSize: '10px', fontWeight: 600, padding: '2px 7px', borderRadius: '20px',
                    background: s.type === 'listening' ? 'rgba(108,99,255,0.08)' : 'rgba(16,185,129,0.08)',
                    color: s.type === 'listening' ? '#a78bfa' : '#34d399',
                    border: `1px solid ${s.type === 'listening' ? 'rgba(108,99,255,0.2)' : 'rgba(16,185,129,0.2)'}`
                  }}>{s.difficulty}</span>
                  <span style={{ fontSize: '10px', color: 'var(--text-muted)' }}>{s.qs} Qs</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '11px', fontWeight: 600, color: s.type === 'listening' ? '#a78bfa' : '#34d399' }}>
                  Start <ArrowRight size={11} />
                </div>
              </div>
            </a>
          ))}
        </div>
      </div>

      {/* Community Exercises */}
      {communityQuizzes.length > 0 && (
        <div>
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 style={{ fontSize: '15px', fontWeight: 700, color: 'var(--text-primary)' }}>From the Community</h3>
              <p style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '2px' }}>Exercises shared by other learners</p>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '5px', fontSize: '11px', color: 'var(--text-muted)' }}>
              <Users size={12} /> Community picks
            </div>
          </div>
          <div className="suggested-exercises-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '14px' }}>
            {communityQuizzes.map((quiz, i) => {
              const isL = quiz.moduleType === 'listening';
              return (
                <a key={i} href={isL ? '/listening' : '/reading'} style={{ textDecoration: 'none' }}>
                  <div className="card p-4 group" style={{ cursor: 'pointer', transition: 'all 0.2s' }}>
                    <div style={{
                      width: '38px', height: '38px', borderRadius: '10px', marginBottom: '10px',
                      background: isL ? 'rgba(108,99,255,0.1)' : 'rgba(16,185,129,0.1)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center'
                    }}>
                      {isL ? <Headphones size={17} color="#a78bfa" /> : <BookOpen size={17} color="#34d399" />}
                    </div>
                    <p style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '6px', lineHeight: 1.3, overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' as any }}>{quiz.title}</p>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '10px' }}>
                      <span style={{
                        fontSize: '10px', fontWeight: 600, padding: '2px 7px', borderRadius: '20px',
                        background: isL ? 'rgba(108,99,255,0.08)' : 'rgba(16,185,129,0.08)',
                        color: isL ? '#a78bfa' : '#34d399',
                        border: `1px solid ${isL ? 'rgba(108,99,255,0.2)' : 'rgba(16,185,129,0.2)'}`
                      }}>{quiz.difficulty}</span>
                      {quiz.questionCount && <span style={{ fontSize: '10px', color: 'var(--text-muted)' }}>{quiz.questionCount} Qs</span>}
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '11px', fontWeight: 600, color: isL ? '#a78bfa' : '#34d399' }}>
                      Start quiz <ArrowRight size={11} />
                    </div>
                  </div>
                </a>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

export default function ReadingPage() {
  const { 
    toggleBookmark, 
    isBookmarked, 
    publishedReadingQuizzes: publishedQuizzes, 
    addPublishedReadingQuiz 
  } = useApp();

  const {
    mode, searchQuery, isPublished, isPublishing, step,
    passage, questionCount, difficulty, selectedTypes,
    questions, answers, score, expandedExplanation, isLoading,
    inputMode, fileName,
    setMode, setSearchQuery, setPassage, setQuestionCount,
    setDifficulty, setSelectedTypes, setQuestions, setAnswers, setStep,
    setIsPublished, setInputMode, setFileName, setExpandedExplanation,
    toggleType, handleAnswer, handleFileUpload, handleGenerate,
    handleSubmit, handleReset, handleTakePublished, handlePublish: storeHandlePublish
  } = useReadingStore();

  const fileRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const takeId = params.get('take');
      if (takeId) {
        const allQuizzes = [...publishedQuizzes];
        const stored = localStorage.getItem('published_reading_quizzes');
        if (stored) {
          try {
            allQuizzes.push(...JSON.parse(stored));
          } catch(e){}
        }
        const bookmarkedRaw = localStorage.getItem('english_app_bookmarks');
        if (bookmarkedRaw) {
          try {
            allQuizzes.push(...JSON.parse(bookmarkedRaw));
          } catch(e){}
        }
        const targetQuiz = allQuizzes.find(q => q.id === takeId);
        if (targetQuiz) {
          handleTakePublished(targetQuiz);
          window.history.replaceState({}, '', window.location.pathname);
        }
      }
    }
  }, [publishedQuizzes]);

  const [showPublishModal, setShowPublishModal] = useState(false);
  const [pubTitle, setPubTitle] = useState('');
  const [pubTopic, setPubTopic] = useState('General');
  const [pubDifficulty, setPubDifficulty] = useState(difficulty);

  const openPublishModal = () => {
    setPubTitle(`Reading Quiz – ${difficulty}`);
    setPubTopic('General');
    setPubDifficulty(difficulty);
    setShowPublishModal(true);
  };

  const handleConfirmPublish = async () => {
    setShowPublishModal(false);
    await storeHandlePublish(addPublishedReadingQuiz, {
      title: pubTitle || `Reading Quiz – ${pubDifficulty}`,
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
                mode === 'ai' ? 'bg-emerald-600 text-white shadow-md' : 'text-gray-500 hover:text-gray-800'
              }`}
            >
              <Sparkles size={14} /> AI mode
            </button>
            <button
              onClick={() => setMode('search')}
              className={`flex items-center gap-2 px-5 py-2 rounded-full text-sm font-semibold transition-all duration-200 ${
                mode === 'search' ? 'bg-emerald-600 text-white shadow-md' : 'text-gray-500 hover:text-gray-800'
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
              placeholder="Search passages by title, difficulty, or author..."
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
                    <div className="w-12 h-12 rounded-xl bg-emerald-50 flex items-center justify-center shrink-0 border border-emerald-100">
                      <FileText size={20} className="text-emerald-500" />
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
                          <span className="text-xs bg-emerald-50/60 text-emerald-600 border border-emerald-100 px-2 py-0.5 rounded-full font-medium">{quiz.difficulty}</span>
                          <span className="text-xs bg-gray-50 text-gray-500 px-2 py-0.5 rounded-full font-medium">{quiz.questionCount} Qs</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => toggleBookmark({
                              id: quiz.id,
                              title: quiz.title,
                              type: 'reading',
                              difficulty: quiz.difficulty,
                              questionCount: quiz.questionCount,
                              author: quiz.author,
                              publishedAt: quiz.publishedAt,
                              passage: quiz.passage,
                              questions: quiz.questions
                            })}
                            className={`p-1.5 rounded-lg border transition-all cursor-pointer ${
                              isBookmarked(quiz.id)
                                ? 'bg-emerald-50 text-emerald-600 border-emerald-200'
                                : 'bg-transparent text-gray-400 border-gray-200 hover:text-gray-600 hover:bg-gray-50'
                            }`}
                            title={isBookmarked(quiz.id) ? 'Saved' : 'Save for later'}
                          >
                            <Bookmark size={14} fill={isBookmarked(quiz.id) ? 'currentColor' : 'none'} />
                          </button>
                          <button
                            onClick={() => handleTakePublished(quiz)}
                            className="flex items-center gap-1.5 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-500 px-3.5 py-2 rounded-xl transition-all shadow-[0_2px_8px_rgba(16,185,129,0.2)] hover:shadow-[0_4px_12px_rgba(16,185,129,0.3)]"
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

      {/* Step 1: Input (AI mode only) */}
      {step === 'input' && mode === 'ai' && (
        <div className="w-full max-w-4xl mx-auto flex flex-col items-center py-2 animate-fade-in-up">
          {/* Tagline Header */}
          <div className="text-center mb-6">
            <h1 className="sg text-xl md:text-2xl font-bold tracking-tight mb-1 text-gray-800 flex items-center justify-center gap-2">
              <span>Other AI tools guess.</span>
              <span className="hero-gradient-text !from-emerald-600 !to-teal-500" style={{ WebkitTextFillColor: 'unset', background: 'linear-gradient(135deg, #059669, #0d9488)', WebkitBackgroundClip: 'text', backgroundClip: 'text', color: 'transparent' }}>EnglishAI knows.</span>
            </h1>
            <p className="text-xs max-w-md mx-auto text-gray-400 leading-relaxed">
              Paste an English passage or upload a document to instantly generate IELTS-standard exercises.
            </p>
          </div>

          {/* Mode Toggle */}
          <div className="flex bg-gray-100/60 p-0.5 rounded-xl border border-gray-100/80 w-full max-w-md mb-5 shadow-sm">
            {[{ id: 'paste', label: 'Paste Text' }, { id: 'upload', label: 'Upload File' }].map(m => (
              <button
                key={m.id}
                onClick={() => setInputMode(m.id as 'paste' | 'upload')}
                className={`flex-1 py-1.5 rounded-lg text-xs font-semibold transition-all duration-200 ${
                  inputMode === m.id
                    ? 'bg-emerald-600 text-white shadow'
                    : 'bg-transparent text-gray-500 hover:text-gray-800'
                }`}
              >
                {m.label}
              </button>
            ))}
          </div>

          {/* Glowing Studocu-style Input / Upload Container */}
          <div className="w-full max-w-xl bg-white border border-gray-100 rounded-2xl p-4 shadow-[0_8px_24px_rgba(0,0,0,0.02)] hover:border-emerald-300 hover:shadow-[0_10px_30px_rgba(16,185,129,0.06)] transition-all duration-300 mb-8">
            {inputMode === 'paste' ? (
              <>
                {/* Top row: Badge */}
                <div className="flex items-center justify-between mb-2.5">
                  <span className="flex items-center gap-1 text-[10px] font-bold text-emerald-600 bg-emerald-50/50 px-2 py-0.5 rounded border border-emerald-100/60">
                    <Plus size={10} /> Add Text Passage
                  </span>
                  <button
                    onClick={() => setPassage(SAMPLE_PASSAGE)}
                    className="text-[10px] text-emerald-600 hover:underline bg-transparent border-none cursor-pointer font-semibold"
                  >
                    Use Sample Passage
                  </button>
                </div>

                {/* Input field */}
                <div className="relative mb-3 bg-gray-50/40 border border-gray-100 rounded-xl px-3 py-1">
                  <textarea
                    className="w-full bg-transparent border-none outline-none text-xs py-1.5 min-h-[140px] resize-none leading-relaxed"
                    style={{ color: 'var(--text-primary)' }}
                    rows={4}
                    placeholder="Paste your English text here (minimum 50 words)..."
                    value={passage}
                    onChange={e => setPassage(e.target.value)}
                  />
                </div>

                {/* Error/Warning Message */}
                {passage.trim().length > 0 && passage.split(' ').filter(Boolean).length < 50 && (
                  <div className="flex items-center gap-2 text-[10px] text-amber-600 bg-amber-50 border border-amber-200 px-2.5 py-1 rounded-lg mb-3">
                    <AlertCircle size={12} />
                    <span>Text is too short. Please add at least 50 words for optimal question generation.</span>
                  </div>
                )}

                {/* Bottom Row: Tags + Submit button */}
                <div className="flex items-center justify-between border-t border-gray-50 pt-3">
                  <div className="flex flex-wrap items-center gap-1.5">
                    <span className="text-[10px] font-semibold text-gray-400 bg-gray-50 px-2 py-0.5 rounded">
                      {passage.split(' ').filter(Boolean).length} words
                    </span>
                    <span className="text-[10px] font-semibold text-gray-400 bg-gray-50 px-2 py-0.5 rounded">
                      Diff: {difficulty}
                    </span>
                    <span className="text-[10px] font-semibold text-gray-400 bg-gray-50 px-2 py-0.5 rounded">
                      {questionCount} Questions
                    </span>
                  </div>

                  <button
                    onClick={() => setStep('configure')}
                    disabled={passage.trim().split(' ').filter(Boolean).length < 20}
                    className="w-8 h-8 rounded-full bg-emerald-600 hover:bg-emerald-500 disabled:opacity-40 disabled:hover:bg-emerald-600 text-white flex items-center justify-center transition-all duration-200 shadow-sm shadow-emerald-100"
                  >
                    <ArrowRight size={14} />
                  </button>
                </div>
              </>
            ) : (
              <>
                {/* Drag and Drop Box exactly like Studocu */}
                <div
                  onClick={() => fileRef.current?.click()}
                  className="border border-dashed border-gray-200 hover:border-emerald-300 rounded-xl p-6 text-center cursor-pointer transition-all duration-300 bg-gray-50/30 flex flex-col items-center justify-center min-h-[160px]"
                >
                  <div className="w-9 h-9 rounded-full bg-emerald-50 flex items-center justify-center mb-2.5 border border-emerald-100">
                    <Upload size={16} className="text-emerald-600" />
                  </div>
                  <h3 className="text-xs font-bold mb-0.5 text-gray-700">
                    {fileName ? fileName : 'Drag & Drop anything'}
                  </h3>
                  <p className="text-[10px] max-w-sm mx-auto leading-relaxed text-gray-400">
                    Or <span className="text-emerald-600 font-semibold underline">choose files</span> from your device. PDF, DOCX, TXT.
                  </p>
                  <input
                    ref={fileRef}
                    type="file"
                    accept=".txt,.pdf,.docx"
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                </div>

                {/* Continue button for upload */}
                {fileName && (
                  <div className="flex justify-end mt-3">
                    <button
                      onClick={() => setStep('configure')}
                      className="flex items-center gap-1 px-4 py-2 rounded-xl font-semibold text-xs text-white bg-emerald-600 hover:bg-emerald-500 shadow-sm"
                    >
                      Continue <ArrowRight size={12} />
                    </button>
                  </div>
                )}
              </>
            )}
          </div>

          {/* Sample Passages Grid */}
          <div className="w-full">
            <h3 className="text-[11px] font-bold uppercase tracking-wider mb-3 flex items-center gap-2 text-gray-400">
              <span>Try a sample passage</span>
              <div className="flex-1 h-px bg-gray-100" />
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {[
                { title: 'Urban Development & Smart Cities', passage: SAMPLE_PASSAGE, words: '280 words', difficulty: 'B2' },
                { title: 'Climate Change & Ecosystems', passage: 'Climate change represents one of the defining challenges of our time. Rising global temperatures, driven primarily by human greenhouse gas emissions, are causing glaciers to melt, sea levels to rise, and weather patterns to become increasingly volatile. Ecosystems around the world are struggling to adapt to these rapid shifts, leading to changes in species distributions and placing biodiversity at risk. Solutions must incorporate both mitigation policies and local adaptation planning.', words: '120 words', difficulty: 'C1' },
                { title: 'The Evolution of English Education', passage: 'The methods of teaching English as a second language have undergone dramatic modifications in the digital age. Moving away from rote grammar translation, modern educators leverage interactive software, peer dialogue, and real-time AI conversation partners. This shifts focus toward communicative competence and active speaking practice, which increases student motivation and accelerates fluency development.', words: '95 words', difficulty: 'B2' },
              ].map(ex => (
                <div
                  key={ex.title}
                  onClick={() => {
                    setPassage(ex.passage);
                    setInputMode('paste');
                  }}
                  className="card flex items-start gap-3 p-3.5 cursor-pointer hover:border-emerald-300 hover:-translate-y-0.5 transition-all duration-300 bg-white border border-gray-100 shadow-[0_2px_10px_rgba(0,0,0,0.01)] rounded-2xl"
                >
                  {/* Icon Left */}
                  <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center shrink-0 border border-emerald-100 shadow-[0_2px_8px_rgba(16,185,129,0.1)]">
                    <FileText size={18} className="text-emerald-600" />
                  </div>
                  {/* Right Content */}
                  <div className="flex-1 min-w-0 flex flex-col justify-between h-full">
                    <div>
                      <h4 className="text-[11px] font-bold truncate mb-0.5 text-gray-700">{ex.title}</h4>
                      <span className="text-[10px] font-semibold text-emerald-600 hover:underline">
                        + Load sample
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-[9px] mt-2 pt-1.5 border-t border-gray-50 text-gray-400">
                      <span>{ex.words} • {ex.difficulty}</span>
                      <Globe size={10} />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Step 2: Configure */}
      {step === 'configure' && (
        <div className="mx-auto w-full" style={{ maxWidth: '680px' }}>
          <div className="card" style={{ padding: '32px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px' }}>
              <div style={{ width: '48px', height: '48px', borderRadius: '14px', background: 'rgba(108,99,255,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Settings size={22} color="#a78bfa" />
              </div>
              <div>
                <h2 style={{ fontSize: '18px', fontWeight: 700 }}>Customize Exercise</h2>
                <p style={{ fontSize: '13px', color: 'var(--text-muted)' }}>IELTS Reading Standard</p>
              </div>
            </div>

            <div style={{ marginBottom: '24px' }}>
              <label style={{ fontSize: '14px', fontWeight: 600, display: 'block', marginBottom: '12px' }}>
                Number of questions: <span style={{ color: 'var(--accent-primary)' }}>{questionCount}</span>
              </label>
              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                {[5, 8, 10, 15, 20].map(n => (
                  <button key={n} onClick={() => setQuestionCount(n)} style={{
                    padding: '8px 18px', borderRadius: '10px',
                    border: `1px solid ${questionCount === n ? '#6c63ff' : 'var(--border)'}`,
                    background: questionCount === n ? 'rgba(108,99,255,0.2)' : 'rgba(255,255,255,0.03)',
                    color: questionCount === n ? '#a78bfa' : 'var(--text-secondary)',
                    cursor: 'pointer', fontWeight: 600, fontSize: '14px', transition: 'all 0.2s'
                  }}>{n}</button>
                ))}
              </div>
            </div>

            <div style={{ marginBottom: '24px' }}>
              <label style={{ fontSize: '14px', fontWeight: 600, display: 'block', marginBottom: '12px' }}>
                Difficulty: <span style={{ color: 'var(--accent-primary)' }}>{difficulty}</span>
              </label>
              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                {['A2', 'B1', 'B2', 'C1', 'Easy', 'Medium', 'Hard'].map(d => (
                  <button key={d} onClick={() => setDifficulty(d)} style={{
                    padding: '7px 14px', borderRadius: '10px',
                    border: `1px solid ${difficulty === d ? '#6c63ff' : 'var(--border)'}`,
                    background: difficulty === d ? 'rgba(108,99,255,0.2)' : 'rgba(255,255,255,0.03)',
                    color: difficulty === d ? '#a78bfa' : 'var(--text-secondary)',
                    cursor: 'pointer', fontWeight: 500, fontSize: '13px', transition: 'all 0.2s'
                  }}>{d}</button>
                ))}
              </div>
            </div>

            <div style={{ marginBottom: '28px' }}>
              <label style={{ fontSize: '14px', fontWeight: 600, display: 'block', marginBottom: '12px' }}>Question Types</label>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '8px' }}>
                {QUESTION_TYPES.map(type => (
                  <button key={type.id} onClick={() => toggleType(type.id)} style={{
                    padding: '10px 14px', borderRadius: '10px',
                    border: `1px solid ${selectedTypes.includes(type.id) ? '#6c63ff' : 'var(--border)'}`,
                    background: selectedTypes.includes(type.id) ? 'rgba(108,99,255,0.15)' : 'rgba(255,255,255,0.02)',
                    color: selectedTypes.includes(type.id) ? '#a78bfa' : 'var(--text-secondary)',
                    cursor: 'pointer', fontSize: '13px', fontWeight: 500,
                    display: 'flex', alignItems: 'center', gap: '8px', transition: 'all 0.2s'
                  }}>
                    <type.Icon size={15} /><span>{type.label}</span>
                    {selectedTypes.includes(type.id) && <CheckCircle size={14} style={{ marginLeft: 'auto' }} />}
                  </button>
                ))}
              </div>
            </div>

            <div style={{ display: 'flex', gap: '10px' }}>
              <button className="btn-secondary" onClick={() => setStep('input')} style={{ flex: 1 }}>Back</button>
              <button className="btn-primary" onClick={handleGenerate} disabled={selectedTypes.length === 0 || isLoading}
                style={{ flex: 2, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                {isLoading ? (
                  <><div style={{ width: '16px', height: '16px', border: '2px solid rgba(255,255,255,0.3)', borderTopColor: 'white', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />AI is generating...</>
                ) : 'Generate Exercise'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Step 3: Practice - Split screen */}
      {step === 'practice' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 lg:h-[calc(100vh-160px)] h-auto">
          {/* Left: Passage */}
          <div className="card p-6 overflow-y-auto lg:h-full h-auto">
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px', paddingBottom: '16px', borderBottom: '1px solid var(--border)' }}>
              <BookOpen size={18} color="#34d399" />
              <h3 style={{ fontSize: '16px', fontWeight: 700 }}>Passage</h3>
              <span className="badge badge-green" style={{ marginLeft: 'auto' }}>{difficulty}</span>
            </div>
            <div style={{ fontSize: '15px', lineHeight: 1.9, color: 'var(--text-secondary)', whiteSpace: 'pre-wrap' }}>
              {passage}
            </div>
          </div>

          {/* Right: Questions */}
          <div className="flex flex-col gap-3 overflow-y-auto lg:h-full h-auto pr-1">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', position: 'sticky', top: 0, background: 'var(--bg-primary)', paddingBottom: '12px', zIndex: 5 }}>
              <h3 style={{ fontSize: '16px', fontWeight: 700 }}>Questions ({questions.length})</h3>
              <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{Object.keys(answers).length}/{questions.length}</span>
                <button className="btn-primary" onClick={handleSubmit} style={{ padding: '8px 18px', fontSize: '13px' }}>Submit</button>
              </div>
            </div>
            {questions.map((q, idx) => (
              <div key={q.id} className="question-card">
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', marginBottom: '14px' }}>
                  <div style={{ width: '28px', height: '28px', borderRadius: '8px', flexShrink: 0, background: answers[q.id] ? 'rgba(108,99,255,0.2)' : 'rgba(255,255,255,0.06)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px', fontWeight: 700, color: answers[q.id] ? '#a78bfa' : 'var(--text-muted)' }}>
                    {idx + 1}
                  </div>
                  <p style={{ fontSize: '14px', lineHeight: 1.6 }}>{q.question}</p>
                </div>
                {q.type === 'multiple-choice' || q.type === 'true-false' || q.type === 'matching' ? (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', paddingLeft: '38px' }}>
                    {(q.options || []).map((opt, i) => (
                      <button key={i} className={`option-btn ${answers[q.id] === opt ? 'selected' : ''}`} onClick={() => handleAnswer(q.id, opt)}>
                        <span style={{ width: '22px', height: '22px', borderRadius: '50%', flexShrink: 0, background: answers[q.id] === opt ? 'rgba(108,99,255,0.3)' : 'rgba(255,255,255,0.05)', border: `1px solid ${answers[q.id] === opt ? '#6c63ff' : 'var(--border)'}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '11px', fontWeight: 700 }}>
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

      {/* Step 4: Results */}
      {step === 'results' && (
        <div className="mx-auto w-full" style={{ maxWidth: '800px' }}>
          <div style={{
            background: score >= 80 ? 'linear-gradient(135deg, rgba(16,185,129,0.2), rgba(52,211,153,0.1))' : score >= 60 ? 'linear-gradient(135deg, rgba(245,158,11,0.2), rgba(251,191,36,0.1))' : 'linear-gradient(135deg, rgba(239,68,68,0.2), rgba(248,113,113,0.1))',
            border: `1px solid ${score >= 80 ? 'rgba(16,185,129,0.3)' : score >= 60 ? 'rgba(245,158,11,0.3)' : 'rgba(239,68,68,0.3)'}`,
            borderRadius: '20px', padding: '32px', textAlign: 'center', marginBottom: '24px'
          }}>
            <div style={{ fontSize: '48px', fontWeight: 900, marginBottom: '8px', color: score >= 80 ? '#34d399' : score >= 60 ? '#fbbf24' : '#f87171' }}>{score}%</div>
            <p style={{ fontSize: '16px', color: 'var(--text-secondary)' }}>{score >= 80 ? 'Excellent! You did great!' : score >= 60 ? 'Good job! Keep going!' : 'Keep practicing!'}</p>
          </div>
          <div style={{ display: 'flex', gap: '10px', marginBottom: '16px' }}>
            <button className="btn-primary" onClick={handleReset} style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}><RefreshCw size={15} /> New Exercise</button>
            <button className="btn-secondary" style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}><Download size={15} /> Download Worksheet</button>
          </div>

          {/* Publish banner */}
          {!isPublished ? (
            <div style={{
              background: 'linear-gradient(135deg, rgba(16,185,129,0.08), rgba(52,211,153,0.06))',
              border: '1px solid rgba(16,185,129,0.25)',
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
                  background: 'linear-gradient(135deg, #059669, #10b981)',
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
                <p style={{ fontWeight: 700, fontSize: '14px', color: '#059669', marginBottom: '2px' }}>Successfully Published!</p>
                <p style={{ fontSize: '13px', color: 'var(--text-muted)' }}>This exercise is now available in the Search tab.</p>
              </div>
            </div>
          )}

          <h3 style={{ fontSize: '16px', fontWeight: 700, marginBottom: '16px' }}>Detailed Results</h3>
          {questions.map((q, idx) => {
            const userAnswer = answers[q.id] || '';
            const correctAnswer = Array.isArray(q.answer) ? q.answer[0] : q.answer;
            const isCorrect = userAnswer.toLowerCase().includes(correctAnswer.toLowerCase()) || correctAnswer.toLowerCase().includes(userAnswer.toLowerCase());
            return (
              <div key={q.id} className="question-card" style={{ borderColor: isCorrect ? 'rgba(16,185,129,0.3)' : 'rgba(239,68,68,0.3)' }}>
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
                  <div style={{ marginTop: '2px', flexShrink: 0 }}>
                    {isCorrect ? <CheckCircle size={20} color="#34d399" /> : <XCircle size={20} color="#f87171" />}
                  </div>
                  <div style={{ flex: 1 }}>
                    <p style={{ fontSize: '14px', fontWeight: 600, marginBottom: '8px' }}>Q{idx + 1}: {q.question}</p>
                    {!isCorrect && <div style={{ fontSize: '13px', marginBottom: '8px' }}><span style={{ color: '#f87171' }}>Your answer: {userAnswer || '(no answer)'}</span><br /><span style={{ color: '#34d399' }}>Correct answer: {correctAnswer}</span></div>}
                    <button onClick={() => setExpandedExplanation(expandedExplanation === q.id ? null : q.id)} style={{ background: 'rgba(108,99,255,0.1)', border: '1px solid rgba(108,99,255,0.2)', borderRadius: '8px', padding: '6px 12px', cursor: 'pointer', color: '#a78bfa', fontSize: '12px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <Lightbulb size={13} /> AI Explanation {expandedExplanation === q.id ? <ChevronDown size={13} /> : <ChevronRight size={13} />}
                    </button>
                    {expandedExplanation === q.id && <div style={{ marginTop: '10px', padding: '12px', background: 'rgba(108,99,255,0.08)', border: '1px solid rgba(108,99,255,0.15)', borderRadius: '10px', fontSize: '13px', color: 'var(--text-secondary)', lineHeight: 1.6 }}>{q.explanation}</div>}
                  </div>
                </div>
              </div>
            );
          })}

          {/* ── More Community Exercises ── */}
          <SuggestedExercises currentType="reading" />
        </div>
      )}
      {/* ── Publish Modal Popup ── */}
      {showPublishModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
          <div className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-2xl p-6 w-full max-w-md shadow-2xl animate-fade-in-up">
            <h3 className="text-base font-bold mb-4 text-gray-900 dark:text-white flex items-center gap-2">
              🚀 Publish Test to Community
            </h3>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1">
                  Test Title
                </label>
                <input
                  type="text"
                  value={pubTitle}
                  onChange={e => setPubTitle(e.target.value)}
                  placeholder="e.g. IELTS Reading: Urban Development"
                  className="w-full px-3 py-2 text-xs border border-gray-200 dark:border-gray-700 rounded-xl bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1">
                  Topic / Category
                </label>
                <select
                  value={pubTopic}
                  onChange={e => setPubTopic(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-gray-200 dark:border-gray-700 rounded-xl bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white outline-none focus:border-emerald-500"
                >
                  <option value="General">General</option>
                  <option value="Urban Planning">Urban Planning</option>
                  <option value="Technology">Technology</option>
                  <option value="Environment">Environment</option>
                  <option value="Psychology">Psychology</option>
                  <option value="Education">Education</option>
                  <option value="Science">Science</option>
                  <option value="Culture">Culture</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1">
                  Difficulty Level
                </label>
                <select
                  value={pubDifficulty}
                  onChange={e => setPubDifficulty(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-gray-200 dark:border-gray-700 rounded-xl bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white outline-none focus:border-emerald-500"
                >
                  {['A1', 'A2', 'B1', 'B2', 'C1', 'C2'].map(lvl => (
                    <option key={lvl} value={lvl}>{lvl}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="flex gap-2.5 justify-end mt-6">
              <button
                onClick={() => setShowPublishModal(false)}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-gray-600 dark:text-gray-400 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmPublish}
                className="px-4 py-2 rounded-xl text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-500 shadow-md"
              >
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
