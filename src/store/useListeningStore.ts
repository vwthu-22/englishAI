'use client';
import { create } from 'zustand';
import { generateQuestions, Question } from '@/lib/store';
import { PublishedQuiz, useQuizStore } from './useQuizStore';

type Step = 'input' | 'configure' | 'practice' | 'results';

interface ListeningState {
  mode: 'ai' | 'search';
  searchQuery: string;
  isPublished: boolean;
  isPublishing: boolean;
  step: Step;
  youtubeUrl: string;
  videoId: string;
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
  setYoutubeUrl: (url: string) => void;
  setVideoId: (id: string) => void;
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
  handleUrlSubmit: () => void;
  handleGenerate: () => Promise<void>;
  handleSubmit: () => void;
  handleReset: () => void;
  handleTakePublished: (quiz: PublishedQuiz) => void;
  handlePublish: (addPublishedListeningQuiz: (quiz: PublishedQuiz) => void, meta?: { title?: string; topic?: string; difficulty?: string }) => Promise<void>;
}

const extractVideoId = (url: string) => {
  const match = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\n?#]+)/);
  return match ? match[1] : null;
};

export const useListeningStore = create<ListeningState>((set, get) => ({
  mode: 'ai',
  searchQuery: '',
  isPublished: false,
  isPublishing: false,
  step: 'input',
  youtubeUrl: '',
  videoId: '',
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
  setYoutubeUrl: (youtubeUrl) => set({ youtubeUrl }),
  setVideoId: (videoId) => set({ videoId }),
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

  handleUrlSubmit: () => {
    const { youtubeUrl } = get();
    const id = extractVideoId(youtubeUrl);
    if (id) {
      set({ videoId: id, step: 'configure' });
    }
  },

  handleGenerate: async () => {
    const { questionCount, selectedTypes, difficulty } = get();
    set({ isLoading: true });
    // Simulate AI generation
    await new Promise((r) => setTimeout(r, 1500));
    const generated = generateQuestions(questionCount, selectedTypes[0], difficulty);
    set({
      questions: generated,
      isLoading: false,
      step: 'practice',
    });
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
    set({
      score: calculatedScore,
      showResults: true,
      step: 'results',
    });

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
      youtubeUrl: '',
      videoId: '',
      questions: [],
      answers: {},
      showResults: false,
      score: 0,
      isPublished: false,
    });
  },

  handleTakePublished: (quiz) => {
    set({
      youtubeUrl: quiz.youtubeUrl || '',
      videoId: quiz.videoId || '',
      questions: quiz.questions,
      difficulty: quiz.difficulty,
      answers: {},
      showResults: false,
      isPublished: false,
      mode: 'ai',
      step: 'practice',
    });
  },

  handlePublish: async (addPublishedListeningQuiz, meta?: { title?: string; topic?: string; difficulty?: string }) => {
    const { difficulty, videoId, youtubeUrl, questions } = get();
    set({ isPublishing: true });
    await new Promise((r) => setTimeout(r, 1200));
    const quiz: PublishedQuiz = {
      id: Date.now().toString(),
      title: meta?.title || `Listening Quiz – ${meta?.difficulty || difficulty}`,
      type: 'listening',
      topic: meta?.topic || 'General',
      videoId,
      youtubeUrl,
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
