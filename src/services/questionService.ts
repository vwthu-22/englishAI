// ─── Question Service ─────────────────────────────────────────────────────────
// Currently simulates AI question generation with mock data.
// When BE is ready: replace with POST /api/questions/generate (AI endpoint).

import type { Question } from '@/types';
import { mockQuestions } from '@/lib/mock/data';

export const questionService = {
  /**
   * Generate questions for a given content (video/passage).
   * TODO: replace with POST /api/questions/generate
   * Body: { contentType, content, count, difficulty, types }
   */
  generate: async (params: {
    count: number;
    difficulty: string;
    types: string[];
    /** For listening: YouTube video ID */
    videoId?: string;
    /** For reading: passage text */
    passage?: string;
  }): Promise<Question[]> => {
    // Mock: simulate network delay then return placeholder questions
    await new Promise((r) => setTimeout(r, 1500));
    return mockQuestions.slice(0, Math.min(params.count, mockQuestions.length));
  },
};
