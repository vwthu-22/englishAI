// ─── Question Service ─────────────────────────────────────────────────────────
// Connects to Studish AI generation endpoints:
//   Listening → POST /api/listening/generate
//   Reading   → POST /api/reading/generate
//
// Also exposes:
//   Transcript → POST /api/listening/transcript
//   Submit     → POST /api/exercises/{id}/results/submit

import type {
  Question,
  BeExerciseResponse,
  BeTranscriptResponse,
  BeExerciseResultResponse,
  toBeDefficulty as _toBeDefficulty,
  toBeQuestionType as _toBeQuestionType,
  mapBeQuestion as _mapBeQuestion,
} from '@/types';
import {
  mapBeQuestion,
  toBeDefficulty,
  toBeQuestionType,
} from '@/types';
import { api } from '@/lib/api';

export const questionService = {
  /**
   * Extract transcript from a YouTube video.
   * POST /api/listening/transcript
   */
  getTranscript: async (youtubeUrl: string): Promise<BeTranscriptResponse> => {
    return api.post<BeTranscriptResponse>('/api/listening/transcript', { youtubeUrl });
  },

  /**
   * Generate questions for listening (YouTube) content via AI.
   * POST /api/listening/generate
   */
  generateListening: async (params: {
    title: string;
    description?: string;
    youtubeUrl: string;
    difficulty: string;
    cefrLevel?: string;
    questionCount: number;
    types: string[];
  }): Promise<{ exerciseId: number; questions: Question[] }> => {
    const data = await api.post<BeExerciseResponse>('/api/listening/generate', {
      title: params.title,
      description: params.description ?? '',
      youtubeUrl: params.youtubeUrl,
      difficulty: toBeDefficulty(params.difficulty),
      cefrLevel: params.cefrLevel ?? params.difficulty.toUpperCase(),
      questionCount: params.questionCount,
      questionTypes: params.types.map(toBeQuestionType),
    });
    return {
      exerciseId: data.id,
      questions: data.questions.map(mapBeQuestion),
    };
  },

  /**
   * Generate questions for reading (passage text) content via AI.
   * POST /api/reading/generate
   */
  generateReading: async (params: {
    title: string;
    description?: string;
    readingText: string;
    difficulty: string;
    cefrLevel?: string;
    questionCount: number;
    types: string[];
  }): Promise<{ exerciseId: number; questions: Question[] }> => {
    const data = await api.post<BeExerciseResponse>('/api/reading/generate', {
      title: params.title,
      description: params.description ?? '',
      readingText: params.readingText,
      difficulty: toBeDefficulty(params.difficulty),
      cefrLevel: params.cefrLevel ?? params.difficulty.toUpperCase(),
      questionCount: params.questionCount,
      questionTypes: params.types.map(toBeQuestionType),
    });
    return {
      exerciseId: data.id,
      questions: data.questions.map(mapBeQuestion),
    };
  },

  /**
   * Submit user answers for an exercise.
   * POST /api/exercises/{exerciseId}/results/submit
   *
   * @param exerciseId  - Numeric exercise ID from the backend
   * @param answers     - Map of questionNumber (1-based) → user answer string
   */
  submitAnswers: async (
    exerciseId: number,
    answers: Record<string, string>,
  ): Promise<BeExerciseResultResponse> => {
    return api.post<BeExerciseResultResponse>(
      `/api/exercises/${exerciseId}/results/submit`,
      { answers },
    );
  },

  /**
   * Get all results for a given exercise.
   * GET /api/exercises/{exerciseId}/results
   */
  getResults: async (exerciseId: number): Promise<BeExerciseResultResponse[]> => {
    return api.get<BeExerciseResultResponse[]>(`/api/exercises/${exerciseId}/results`);
  },

  // ─── Legacy shim ─────────────────────────────────────────────────────────
  // Kept so any callers that still use `questionService.generate()` don't break.
  // Remove once stores are updated to use generateListening / generateReading.
  generate: async (params: {
    count: number;
    difficulty: string;
    types: string[];
    audioUrl?: string;
    videoId?: string;
    passage?: string;
  }): Promise<Question[]> => {
    if (params.passage) {
      const res = await questionService.generateReading({
        title: 'Reading Practice',
        readingText: params.passage,
        difficulty: params.difficulty,
        questionCount: params.count,
        types: params.types,
      });
      return res.questions;
    } else {
      const youtubeUrl = params.audioUrl ?? '';
      const res = await questionService.generateListening({
        title: 'Listening Practice',
        youtubeUrl,
        difficulty: params.difficulty,
        questionCount: params.count,
        types: params.types,
      });
      return res.questions;
    }
  },
};
