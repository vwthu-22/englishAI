'use client';
import { create } from 'zustand';
import { Question } from '@/types';
import { PublishedQuiz, useQuizStore } from './useQuizStore';
import { questionService } from '@/services/questionService';
import { useAuthStore } from './useAuthStore';

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
  error: string | null;
  inputMode: 'paste' | 'upload';
  fileName: string;
  exerciseId: number | null;  // ID from backend after generate

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
  setError: (error: string | null) => void;

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
  error: null,
  inputMode: 'paste',
  fileName: '',
  exerciseId: null,

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
      set({ fileName: file.name });
      const reader = new FileReader();
      reader.onload = (ev) => set({ passage: (ev.target?.result as string) || '' });
      reader.readAsText(file);
    }
  },

  handleGenerate: async () => {
    const { questionCount, selectedTypes, difficulty, passage, fileName } = get();
    set({ isLoading: true, error: null });
    try {
      const result = await questionService.generateReading({
        title: fileName || `Reading Practice – ${difficulty}`,
        readingText: passage,
        difficulty,
        questionCount: Math.min(20, Math.max(5, questionCount)),
        types: selectedTypes,
      });
      set({ questions: result.questions, exerciseId: result.exerciseId, isLoading: false, error: null, step: 'practice' });
    } catch (err: unknown) {
      console.error('Generate reading failed:', err);
      const message = err instanceof Error ? err.message : 'Có lỗi xảy ra khi tạo bài tập reading.';
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
          beAnswers[String(q.questionNumber)] = answers[q.id] ?? '';
        });
        const result = await questionService.submitAnswers(exerciseId, beAnswers);
        set({ score: Math.round(result.score), step: 'results' });

        // Record streak activity after successful submission
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
          title: result.exerciseTitle || `Reading Practice (${difficulty})`,
          type: 'reading',
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
    set({ score: calculatedScore, step: 'results' });

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
      difficulty,
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
      error: null,
      exerciseId: null,
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
    const { difficulty, passage, questions, exerciseId } = get();
    set({ isPublishing: true });
    const user = useAuthStore.getState().user;
    const author = user?.name ?? 'You';
    await new Promise((r) => setTimeout(r, 800));
    const quiz: PublishedQuiz = {
      id: exerciseId ? String(exerciseId) : Date.now().toString(),
      title: meta?.title || `Reading Quiz – ${meta?.difficulty || difficulty}`,
      type: 'reading',
      topic: meta?.topic || 'General',
      passage,
      questions,
      difficulty: meta?.difficulty || difficulty,
      questionCount: questions.length,
      author,
      publishedAt: new Date().toLocaleDateString('vi-VN'),
      plays: 0,
      likes: 0,
      rating: 4.5,
    };
    addPublishedReadingQuiz(quiz);
    set({ isPublishing: false, isPublished: true });
  },
}));
