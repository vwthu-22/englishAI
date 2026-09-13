'use client';
import { create } from 'zustand';
import { Question } from '@/types';
import { PublishedQuiz, useQuizStore } from './useQuizStore';
import { questionService } from '@/services/questionService';

type Step = 'input' | 'configure' | 'practice' | 'results';

interface ListeningState {
  mode: 'ai' | 'search';
  searchQuery: string;
  isPublished: boolean;
  isPublishing: boolean;
  step: Step;
  audioUrl: string;
  youtubeId: string;   // populated when URL is a YouTube link
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
      set({ youtubeId: ytMatch[1], step: 'configure' });
    } else {
      set({ youtubeId: '', step: 'configure' });
    }
  },

  handleGenerate: async () => {
    const { questionCount, selectedTypes, difficulty, audioUrl } = get();
    set({ isLoading: true });
    const generated = await questionService.generate({ count: questionCount, difficulty, types: selectedTypes, audioUrl });
    set({ questions: generated, isLoading: false, step: 'practice' });
  },

  handleSubmit: () => {
    const { questions, answers, difficulty } = get();
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
      difficulty: difficulty,
    });
  },

  handleReset: () => {
    set({
      step: 'input',
      audioUrl: '',
      youtubeId: '',
      fileName: '',
      questions: [],
      answers: {},
      showResults: false,
      score: 0,
      isPublished: false,
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
    const { difficulty, audioUrl, youtubeId, questions } = get();
    set({ isPublishing: true });
    await new Promise((r) => setTimeout(r, 1200));
    const quiz: PublishedQuiz = {
      id: Date.now().toString(),
      title: meta?.title || `Listening Quiz – ${meta?.difficulty || difficulty}`,
      type: 'listening',
      topic: meta?.topic || 'General',
      audioUrl,
      youtubeId,
      questions,
      difficulty: meta?.difficulty || difficulty,
      questionCount: questions.length,
      author: 'You',
      publishedAt: new Date().toLocaleDateString('vi-VN'),
      plays: 0,
      likes: 0,
      rating: 4.5,
    };
    addPublishedListeningQuiz(quiz);
    set({ isPublishing: false, isPublished: true });
  },
}));
