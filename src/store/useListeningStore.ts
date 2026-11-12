'use client';
import { create } from 'zustand';
import { Question } from '@/types';
import { PublishedQuiz, useQuizStore } from './useQuizStore';
import { questionService } from '@/services/questionService';
import { useAuthStore } from './useAuthStore';

type Step = 'input' | 'configure' | 'practice' | 'results';

interface ListeningState {
  mode: 'ai' | 'search';
  searchQuery: string;
  isPublished: boolean;
  isPublishing: boolean;
  step: Step;
  audioUrl: string;
  youtubeId: string;   // populated when URL is a YouTube link
  transcript: string;  // extracted transcript from BE (content field)
  inputMode: 'url' | 'upload';
  fileName: string;
  questionCount: number;
  difficulty: string;
  selectedTypes: string[];
  questions: Question[];
  answers: Record<string, string>;
  showResults: boolean;
  score: number;
  expandedExplanation: string | null;
  isLoading: boolean;
  error: string | null;
  exerciseId: number | null;  // ID from backend after generate

  setMode: (mode: 'ai' | 'search') => void;
  setSearchQuery: (query: string) => void;
  setAudioUrl: (url: string) => void;
  setYoutubeId: (id: string) => void;
  setInputMode: (mode: 'url' | 'upload') => void;
  setFileName: (name: string) => void;
  setQuestionCount: (count: number) => void;
  setDifficulty: (difficulty: string) => void;
  setSelectedTypes: (types: string[]) => void;
  setQuestions: (questions: Question[]) => void;
  setAnswers: (answers: Record<string, string>) => void;
  setStep: (step: Step) => void;
  setIsPublished: (isPublished: boolean) => void;
  setExpandedExplanation: (id: string | null) => void;
  setError: (error: string | null) => void;

  toggleType: (type: string) => void;
  handleAnswer: (questionId: string, answer: string) => void;
  handleFileUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleAudioSubmit: () => void;
  handleGenerate: () => Promise<void>;
  handleSubmit: () => void;
  handleReset: () => void;
  handleTakePublished: (quiz: PublishedQuiz) => void;
  handlePublish: (addPublishedListeningQuiz: (quiz: PublishedQuiz) => void, meta?: { title?: string; topic?: string; difficulty?: string }) => Promise<void>;
}

export const useListeningStore = create<ListeningState>((set, get) => ({
  mode: 'ai',
  searchQuery: '',
  isPublished: false,
  isPublishing: false,
  step: 'input',
  audioUrl: '',
  youtubeId: '',
  transcript: '',
  inputMode: 'url',
  fileName: '',
  questionCount: 10,
  difficulty: 'B2',
  selectedTypes: ['multiple-choice', 'true-false'],
  questions: [],
  answers: {},
  showResults: false,
  score: 0,
  expandedExplanation: null,
  isLoading: false,
  error: null,
  exerciseId: null,

  setMode: (mode) => set({ mode }),
  setSearchQuery: (searchQuery) => set({ searchQuery }),
  setAudioUrl: (audioUrl) => set({ audioUrl }),
  setYoutubeId: (youtubeId) => set({ youtubeId }),
  setInputMode: (inputMode) => set({ inputMode }),
  setFileName: (fileName) => set({ fileName }),
  setQuestionCount: (questionCount) => set({ questionCount }),
  setDifficulty: (difficulty) => set({ difficulty }),
  setSelectedTypes: (selectedTypes) => set({ selectedTypes }),
  setQuestions: (questions) => set({ questions }),
  setAnswers: (answers) => set({ answers }),
  setStep: (step) => set({ step }),
  setIsPublished: (isPublished) => set({ isPublished }),
  setExpandedExplanation: (expandedExplanation) => set({ expandedExplanation }),
  setError: (error) => set({ error }),

  toggleType: (type) => {
    const { selectedTypes } = get();
    set({
      selectedTypes: selectedTypes.includes(type)
        ? selectedTypes.filter((t) => t !== type)
        : [...selectedTypes, type],
    });
  },

  handleAnswer: (questionId, answer) => {
    set((state) => ({
      answers: { ...state.answers, [questionId]: answer },
    }));
  },

  handleFileUpload: (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      set({ audioUrl: url, fileName: file.name, step: 'configure' });
    }
  },

  handleAudioSubmit: () => {
    const { audioUrl } = get();
    if (!audioUrl.trim()) return;
    // Auto-detect YouTube URL and extract video ID
    const ytMatch = audioUrl.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\n?#]+)/);
    if (ytMatch) {
      set({ youtubeId: ytMatch[1], error: null, step: 'configure' });
    } else {
      set({
        error: 'AI Listening practice requires a valid YouTube video URL (e.g. https://www.youtube.com/watch?v=... or https://youtu.be/...). Audio files are not yet supported.',
      });
    }
  },

  handleGenerate: async () => {
    const { questionCount, selectedTypes, difficulty, audioUrl, youtubeId, fileName } = get();

    // AI generation requires a YouTube URL — build it from youtubeId (extracted on submit)
    // or validate that audioUrl itself is a YouTube link.
    const ytIdFromUrl = audioUrl.match(
      /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\n?#]+)/
    )?.[1];
    const resolvedYoutubeId = youtubeId || ytIdFromUrl || '';
    const youtubeUrl = resolvedYoutubeId
      ? `https://www.youtube.com/watch?v=${resolvedYoutubeId}`
      : '';

    if (!youtubeUrl) {
      set({
        isLoading: false,
        error: 'AI generation requires a YouTube URL. Please paste a valid YouTube link (e.g. https://www.youtube.com/watch?v=...).',
      });
      return;
    }

    set({ isLoading: true, error: null });
    try {
      const result = await questionService.generateListening({
        title: fileName || `Listening Practice – ${difficulty}`,
        youtubeUrl,
        difficulty,
        questionCount: Math.min(20, Math.max(5, questionCount)),
        types: selectedTypes,
      });
      set({
        questions: result.questions,
        exerciseId: result.exerciseId,
        transcript: result.transcript,
        isLoading: false,
        error: null,
        step: 'practice',
      });
    } catch (err: unknown) {
      console.error('Generate listening failed:', err);
      const message =
        err instanceof Error ? err.message : 'Failed to generate listening exercise.';
      set({ isLoading: false, error: message });
    }
  },

  handleSubmit: async () => {
    const { questions, answers, difficulty, exerciseId } = get();

    // 1. Submit to backend — answers keyed by questionNumber (from BE)
    if (exerciseId) {
      try {
        const beAnswers: Record<string, string> = {};
        questions.forEach((q) => {
          // q.questionNumber is the 1-based key the BE expects
          beAnswers[String(q.questionNumber)] = answers[q.id] ?? '';
        });
        const result = await questionService.submitAnswers(exerciseId, beAnswers);
        set({ score: Math.round(result.score), showResults: true, step: 'results' });

        // Record streak activity after a successful submission
        try {
          const streakInfo = await (await import('@/services/authService')).authService.recordStreakActivity();
          if (streakInfo) {
            const authStore = useAuthStore.getState();
            if (authStore.user) {
              authStore.updateUserLocal({
                streak: streakInfo.currentStreak,
                maxStreak: streakInfo.maxStreak,
              });
            }
          }
        } catch {
          // ignore streak errors
        }

        const now = new Date();
        const formattedDate = `${now.getDate().toString().padStart(2, '0')}/${(now.getMonth() + 1).toString().padStart(2, '0')}/${now.getFullYear()} ${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
        useQuizStore.getState().addCompletedTest({
          id: 'hist-' + Date.now(),
          title: result.exerciseTitle || `Listening Practice (${difficulty})`,
          type: 'listening',
          score: Math.round(result.score),
          totalQuestions: result.totalQuestions,
          correctAnswers: result.correctCount,
          completedAt: formattedDate,
          difficulty,
        });
        return;
      } catch (err) {
        console.warn('Submit to backend failed, falling back to local scoring:', err);
      }
    }

    // 2. Fallback: local scoring
    let correct = 0;
    questions.forEach((q) => {
      const userAnswer = answers[q.id] || '';
      const correctAnswer = Array.isArray(q.answer) ? q.answer[0] : q.answer;
      if (
        userAnswer.toLowerCase().includes(correctAnswer.toLowerCase()) ||
        correctAnswer.toLowerCase().includes(userAnswer.toLowerCase())
      ) {
        correct++;
      }
    });
    const calculatedScore = questions.length > 0 ? Math.round((correct / questions.length) * 100) : 0;
    set({ score: calculatedScore, showResults: true, step: 'results' });

    const now = new Date();
    const formattedDate = `${now.getDate().toString().padStart(2, '0')}/${(now.getMonth() + 1).toString().padStart(2, '0')}/${now.getFullYear()} ${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
    useQuizStore.getState().addCompletedTest({
      id: 'hist-' + Date.now(),
      title: `Listening Practice (${difficulty})`,
      type: 'listening',
      score: calculatedScore,
      totalQuestions: questions.length,
      correctAnswers: correct,
      completedAt: formattedDate,
      difficulty,
    });
  },

  handleReset: () => {
    set({
      step: 'input',
      audioUrl: '',
      youtubeId: '',
      transcript: '',
      fileName: '',
      questions: [],
      answers: {},
      showResults: false,
      score: 0,
      isPublished: false,
      error: null,
      exerciseId: null,
    });
  },

  handleTakePublished: (quiz) => {
    const storedYoutubeId = quiz.youtubeId || '';
    set({
      audioUrl: quiz.audioUrl || '',
      youtubeId: storedYoutubeId,
      fileName: quiz.title || '',
      questions: quiz.questions,
      difficulty: quiz.difficulty,
      answers: {},
      showResults: false,
      isPublished: false,
      mode: 'ai',
      step: 'practice',
    });
  },

  handlePublish: async (addPublishedListeningQuiz, meta) => {
    const { difficulty, audioUrl, youtubeId, questions, exerciseId } = get();
    set({ isPublishing: true });
    const user = useAuthStore.getState().user;
    const author = user?.name ?? 'You';
    await new Promise((r) => setTimeout(r, 800));
    const quiz: PublishedQuiz = {
      id: exerciseId ? String(exerciseId) : Date.now().toString(),
      title: meta?.title || `Listening Quiz – ${meta?.difficulty || difficulty}`,
      type: 'listening',
      topic: meta?.topic || 'General',
      audioUrl,
      youtubeId,
      questions,
      difficulty: meta?.difficulty || difficulty,
      questionCount: questions.length,
      author,
      publishedAt: new Date().toLocaleDateString('vi-VN'),
      plays: 0,
      likes: 0,
      rating: 4.5,
    };
    addPublishedListeningQuiz(quiz);
    set({ isPublishing: false, isPublished: true });
  },
}));
