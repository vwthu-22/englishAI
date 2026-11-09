// ─── Question Service ─────────────────────────────────────────────────────────
// Connects to Studish AI generation endpoints:
//   Listening → POST /api/listening/generate
//   Reading   → POST /api/reading/generate
//
// Also exposes:
//   Transcript → POST /api/listening/transcript
//   Submit     → POST /api/exercises/{id}/results/submit
//   Results    → GET  /api/exercises/{id}/results
//
// API Doc: https://compatibility-armed-updated-historic.trycloudflare.com/swagger-ui.html

import type {
  Question,
  BeExerciseResponse,
  BeTranscriptResponse,
  BeExerciseResultResponse,
} from '@/types';
import {
  mapBeQuestion,
  toBeDefficulty,
  toBeQuestionType,
  toBeCefrLevel,
} from '@/types';
import { api } from '@/lib/api';

/** Clamp questionCount to BE validation rules: min 5, max 20 */
function clampCount(n: number): number {
  return Math.min(20, Math.max(5, n));
}

export const questionService = {
  /**
   * Extract transcript from a YouTube video.
   * POST /api/listening/transcript
   * Response: { transcript, language, durationSeconds }
   */
  getTranscript: async (youtubeUrl: string): Promise<BeTranscriptResponse> => {
    return api.post<BeTranscriptResponse>('/api/listening/transcript', { youtubeUrl });
  },

  /**
   * Generate listening exercise (AI + YouTube).
   * POST /api/listening/generate
   *
   * BE receives:
   *   title, description?, youtubeUrl, difficulty (EASY|MEDIUM|HARD),
   *   cefrLevel? (A2|B1|B2…), questionCount (5–20),
   *   questionTypes (MULTIPLE_CHOICE|TRUE_FALSE|GAP_FILL|MATCHING|SHORT_ANSWER)[]
   *
   * Returns exerciseId (for submit) + mapped FE questions.
   * ExerciseResponse.content holds the extracted transcript.
   */
  generateListening: async (params: {
    title: string;
    description?: string;
    youtubeUrl: string;
    difficulty: string;
    cefrLevel?: string;
    questionCount: number;
    types: string[];
  }): Promise<{ exerciseId: number; transcript: string; questions: Question[] }> => {
    const data = await api.post<BeExerciseResponse>('/api/listening/generate', {
      title: params.title,
      description: params.description ?? '',
      youtubeUrl: params.youtubeUrl,
      difficulty: toBeDefficulty(params.difficulty),
      cefrLevel: toBeCefrLevel(params.cefrLevel ?? params.difficulty),
      questionCount: clampCount(params.questionCount),
      questionTypes: params.types.map(toBeQuestionType),
    });
    return {
      exerciseId: data.id,
      transcript: data.content ?? '',
      questions: data.questions.map(mapBeQuestion),
    };
  },

  /**
   * Generate reading exercise (AI + passage text).
   * POST /api/reading/generate
   *
   * BE receives:
   *   title, description?, readingText, difficulty (EASY|MEDIUM|HARD),
   *   cefrLevel? (A2|B1|B2…), questionCount (5–20),
   *   questionTypes []
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
      cefrLevel: toBeCefrLevel(params.cefrLevel ?? params.difficulty),
      questionCount: clampCount(params.questionCount),
      questionTypes: params.types.map(toBeQuestionType),
    });
    return {
      exerciseId: data.id,
      questions: data.questions.map(mapBeQuestion),
    };
  },

  /**
   * Submit user answers & get auto-graded score.
   * POST /api/exercises/{exerciseId}/results/submit
   *
   * answers: { "1": "B", "2": "TRUE", "3": "climate change" }
   *   key   = questionNumber (1-based string, from BE)
   *   value = user's answer string
   *
   * Returns ExerciseResultResponse with score, correctCount, questionResults[].
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
   * Get all submissions for the current user on a specific exercise.
   * GET /api/exercises/{exerciseId}/results
   */
  getResults: async (exerciseId: number): Promise<BeExerciseResultResponse[]> => {
    return api.get<BeExerciseResultResponse[]>(`/api/exercises/${exerciseId}/results`);
  },
};
