'use client';
import { create } from 'zustand';
import { generateQuestions, Question } from '@/lib/store';
import { PublishedQuiz, useQuizStore } from './useQuizStore';

type Step = 'input' | 'configure' | 'practice' | 'results';

interface ReadingState {
  mode: 'ai' | 'search';
  searchQuery: string;
  isPublished: boolean;
  isPublishing: boolean;
  step: Step;
  passage: string;
  questionCount: number;
  difficulty: string;
  selectedTypes: string[];
  questions: Question[];
  answers: Record<string, string>;
  score: number;
  expandedExplanation: string | null;
  isLoading: boolean;
  inputMode: 'paste' | 'upload';
  fileName: string;

  setMode: (mode: 'ai' | 'search') => void;
  setSearchQuery: (query: string) => void;
  setPassage: (passage: string) => void;
  setQuestionCount: (count: number) => void;
  setDifficulty: (difficulty: string) => void;
  setSelectedTypes: (types: string[]) => void;
  setQuestions: (questions: Question[]) => void;
  setAnswers: (answers: Record<string, string>) => void;
  setStep: (step: Step) => void;
  setIsPublished: (isPublished: boolean) => void;
  setInputMode: (mode: 'paste' | 'upload') => void;
  setFileName: (fileName: string) => void;
  setExpandedExplanation: (id: string | null) => void;

  toggleType: (type: string) => void;
  handleAnswer: (questionId: string, answer: string) => void;
  handleFileUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleGenerate: () => Promise<void>;
  handleSubmit: () => void;
  handleReset: () => void;
  handleTakePublished: (quiz: PublishedQuiz) => void;
  handlePublish: (addPublishedReadingQuiz: (quiz: PublishedQuiz) => void, meta?: { title?: string; topic?: string; difficulty?: string }) => Promise<void>;
}

export const useReadingStore = create<ReadingState>((set, get) => ({
  mode: 'ai',
  searchQuery: '',
  isPublished: false,
  isPublishing: false,
  step: 'input',
  passage: '',
  questionCount: 10,
  difficulty: 'B2',
  selectedTypes: ['multiple-choice', 'true-false'],
  questions: [],
  answers: {},
  score: 0,
  expandedExplanation: null,
  isLoading: false,
  inputMode: 'paste',
  fileName: '',

  setMode: (mode) => set({ mode }),
  setSearchQuery: (searchQuery) => set({ searchQuery }),
  setPassage: (passage) => set({ passage }),
  setQuestionCount: (questionCount) => set({ questionCount }),
  setDifficulty: (difficulty) => set({ difficulty }),
  setSelectedTypes: (selectedTypes) => set({ selectedTypes }),
  setQuestions: (questions) => set({ questions }),
  setAnswers: (answers) => set({ answers }),
  setStep: (step) => set({ step }),
  setIsPublished: (isPublished) => set({ isPublished }),
  setInputMode: (inputMode) => set({ inputMode }),
  setFileName: (fileName) => set({ fileName }),
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
      set({ fileName: file.name });
      const reader = new FileReader();
      reader.onload = (ev) => set({ passage: (ev.target?.result as string) || '' });
      reader.readAsText(file);
    }
  },

  handleGenerate: async () => {
    const { questionCount, selectedTypes, difficulty } = get();
    set({ isLoading: true });
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
      step: 'results',
    });

    const now = new Date();
    const formattedDate = `${now.getDate().toString().padStart(2, '0')}/${(now.getMonth() + 1).toString().padStart(2, '0')}/${now.getFullYear()} ${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
    useQuizStore.getState().addCompletedTest({
      id: 'hist-' + Date.now(),
      title: `Reading Practice (${difficulty})`,
      type: 'reading',
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
      passage: '',
      questions: [],
      answers: {},
      score: 0,
      fileName: '',
      isPublished: false,
    });
  },

  handleTakePublished: (quiz) => {
    set({
      passage: quiz.passage || '',
      questions: quiz.questions,
      difficulty: quiz.difficulty,
      answers: {},
      isPublished: false,
      mode: 'ai',
      step: 'practice',
    });
  },

  handlePublish: async (addPublishedReadingQuiz, meta?: { title?: string; topic?: string; difficulty?: string }) => {
    const { difficulty, passage, questions } = get();
    set({ isPublishing: true });
    await new Promise((r) => setTimeout(r, 1200));
    const quiz: PublishedQuiz = {
      id: Date.now().toString(),
      title: meta?.title || `Reading Quiz – ${meta?.difficulty || difficulty}`,
      type: 'reading',
      topic: meta?.topic || 'General',
      passage,
      questions,
      difficulty: meta?.difficulty || difficulty,
      questionCount: questions.length,
      author: 'You',
      publishedAt: new Date().toLocaleDateString('vi-VN'),
      plays: 0,
      likes: 0,
      rating: 4.5,
    };
    addPublishedReadingQuiz(quiz);
    set({ isPublishing: false, isPublished: true });
  },
}));
