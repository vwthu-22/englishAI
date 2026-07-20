// Simple in-memory store for demo purposes
// In production, this would be replaced with a real backend

export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  level: string;
  joinDate: string;
  streak: number;
}

export interface Exercise {
  id: string;
  type: 'listening' | 'reading';
  title: string;
  topic: string;
  difficulty: string;
  score?: number;
  totalQuestions: number;
  correctAnswers?: number;
  createdAt: string;
  completedAt?: string;
  status: 'draft' | 'completed' | 'in-progress';
}

export interface Question {
  id: string;
  type: 'multiple-choice' | 'gap-fill' | 'true-false' | 'matching' | 'short-answer';
  question: string;
  options?: string[];
  answer: string | string[];
  explanation: string;
  userAnswer?: string | string[];
}

// Mock data
export const mockUser: User = {
  id: '1',
  name: 'Nguyễn Văn An',
  email: 'nguyenvanan@email.com',
  level: 'B2',
  joinDate: '2025-01-15',
  streak: 12,
};

export const mockExercises: Exercise[] = [
  {
    id: '1',
    type: 'listening',
    title: 'TED Talk: The Power of Introverts',
    topic: 'Psychology',
    difficulty: 'B2',
    score: 85,
    totalQuestions: 10,
    correctAnswers: 9,
    createdAt: '2026-07-10T08:00:00Z',
    completedAt: '2026-07-10T08:30:00Z',
    status: 'completed',
  },
  {
    id: '2',
    type: 'reading',
    title: 'Climate Change and Future Generations',
    topic: 'Environment',
    difficulty: 'C1',
    score: 72,
    totalQuestions: 15,
    correctAnswers: 11,
    createdAt: '2026-07-11T10:00:00Z',
    completedAt: '2026-07-11T11:00:00Z',
    status: 'completed',
  },
  {
    id: '3',
    type: 'listening',
    title: 'BBC News: Technology in 2025',
    topic: 'Technology',
    difficulty: 'B1',
    score: 90,
    totalQuestions: 8,
    correctAnswers: 7,
    createdAt: '2026-07-12T14:00:00Z',
    completedAt: '2026-07-12T14:25:00Z',
    status: 'completed',
  },
  {
    id: '4',
    type: 'reading',
    title: 'IELTS Academic: Urban Development',
    topic: 'Urban Planning',
    difficulty: 'C1',
    totalQuestions: 20,
    createdAt: '2026-07-14T09:00:00Z',
    status: 'in-progress',
  },
  {
    id: '5',
    type: 'listening',
    title: 'Podcast: Learning Languages Fast',
    topic: 'Education',
    difficulty: 'A2',
    score: 95,
    totalQuestions: 5,
    correctAnswers: 5,
    createdAt: '2026-07-15T07:00:00Z',
    completedAt: '2026-07-15T07:15:00Z',
    status: 'completed',
  },
];

export const mockWeeklyData = [
  { day: 'Mon', listening: 2, reading: 1, score: 78 },
  { day: 'Tue', listening: 1, reading: 2, score: 82 },
  { day: 'Wed', listening: 3, reading: 1, score: 85 },
  { day: 'Thu', listening: 0, reading: 3, score: 80 },
  { day: 'Fri', listening: 2, reading: 2, score: 88 },
  { day: 'Sat', listening: 1, reading: 0, score: 92 },
  { day: 'Sun', listening: 2, reading: 1, score: 86 },
];

export const mockMonthlyProgress = [
  { month: 'Feb', score: 65, exercises: 12 },
  { month: 'Mar', score: 70, exercises: 18 },
  { month: 'Apr', score: 72, exercises: 22 },
  { month: 'May', score: 75, exercises: 25 },
  { month: 'Jun', score: 80, exercises: 30 },
  { month: 'Jul', score: 85, exercises: 35 },
];

export const generateQuestions = (count: number, type: string, difficulty: string): Question[] => {
  const baseQuestions: Question[] = [
    {
      id: '1',
      type: 'multiple-choice',
      question: "What is the main theme discussed in the passage?",
      options: [
        "The importance of technology in education",
        "How introverts contribute to society",
        "The benefits of extroversion in leadership",
        "Social media's impact on relationships"
      ],
      answer: "How introverts contribute to society",
      explanation: "The passage primarily discusses how introverts, despite societal preferences for extroversion, contribute significantly to society through deep thinking and creativity."
    },
    {
      id: '2',
      type: 'true-false',
      question: "The author suggests that introversion is a weakness that needs to be overcome.",
      options: ["True", "False"],
      answer: "False",
      explanation: "The author argues the opposite - that introversion is a strength, and society should value the unique contributions of introverts rather than pushing them to become extroverted."
    },
    {
      id: '3',
      type: 'gap-fill',
      question: "Introverts often prefer working in _______ environments where they can focus deeply.",
      answer: "quiet",
      explanation: "The text explicitly states that introverts thrive in quiet environments that allow for deep concentration and thoughtful work."
    },
    {
      id: '4',
      type: 'multiple-choice',
      question: "According to the passage, what percentage of people are introverts?",
      options: ["One-quarter", "One-third", "One-half", "Two-thirds"],
      answer: "One-third",
      explanation: "The author states that approximately one-third to one-half of the population are introverts, challenging the notion that introversion is rare."
    },
    {
      id: '5',
      type: 'short-answer',
      question: "Name TWO famous introverts mentioned in the passage and their contributions.",
      answer: "Albert Einstein (physicist) and Rosa Parks (civil rights activist)",
      explanation: "The passage cites Einstein's groundbreaking physics theories and Rosa Parks' pivotal role in the civil rights movement as examples of introverts who changed the world."
    },
    {
      id: '6',
      type: 'multiple-choice',
      question: "What does the author recommend for schools?",
      options: [
        "More group projects and team activities",
        "Creating spaces for solitary work and reflection",
        "Eliminating all collaborative activities",
        "Separating introverted and extroverted students"
      ],
      answer: "Creating spaces for solitary work and reflection",
      explanation: "The author advocates for educational environments that accommodate both collaborative and individual learning styles."
    },
    {
      id: '7',
      type: 'true-false',
      question: "The passage implies that modern workplaces are well-designed for introverts.",
      options: ["True", "False"],
      answer: "False",
      explanation: "The author criticizes open-plan offices as unsuitable for introverts, who need quiet spaces to do their best work."
    },
    {
      id: '8',
      type: 'gap-fill',
      question: "The author calls for a _______ revolution in how we think about introversion.",
      answer: "quiet",
      explanation: "This is a direct reference to the book 'Quiet' by Susan Cain, which advocates for recognizing and valuing introverted personalities."
    },
    {
      id: '9',
      type: 'multiple-choice',
      question: "Which of the following best describes the author's tone?",
      options: [
        "Neutral and objective",
        "Persuasive and passionate",
        "Humorous and light-hearted",
        "Pessimistic and critical"
      ],
      answer: "Persuasive and passionate",
      explanation: "The author uses persuasive language and shows clear passion for the topic, aiming to change readers' perspectives on introversion."
    },
    {
      id: '10',
      type: 'matching',
      question: "Match each term with its correct definition: Introversion, Ambiversion, Extroversion",
      options: [
        "Introversion - Energized by social interaction",
        "Ambiversion - Balanced mix of both",
        "Extroversion - Energized by solitude"
      ],
      answer: "Ambiversion - Balanced mix of both",
      explanation: "Ambiversion refers to people who exhibit qualities of both introversion and extroversion. The other terms are deliberately mismatched in the options."
    },
  ];

  return baseQuestions.slice(0, Math.min(count, baseQuestions.length));
};

export interface QuizItem {
  id: string;
  title: string;
  type: 'listening' | 'reading';
  topic: string;
  difficulty: string;
  questionCount: number;
  author: string;
  publishedAt: string;
  rating: number;
}

export const defaultQuizzes: QuizItem[] = [
  {
    id: 'ted-introverts',
    title: 'TED Talk: The Power of Introverts',
    type: 'listening',
    topic: 'Psychology',
    difficulty: 'B2',
    questionCount: 10,
    author: 'Susan Cain',
    publishedAt: '12/07/2026',
    rating: 4.8
  },
  {
    id: 'ielts-urban',
    title: 'IELTS Academic: Urban Development and Planning',
    type: 'reading',
    topic: 'Urban Planning',
    difficulty: 'C1',
    questionCount: 20,
    author: 'Cambridge English',
    publishedAt: '14/07/2026',
    rating: 4.9
  },
  {
    id: 'bbc-tech',
    title: 'BBC News: Technology and Society in 2025',
    type: 'listening',
    topic: 'Technology',
    difficulty: 'B1',
    questionCount: 8,
    author: 'BBC Learning English',
    publishedAt: '10/07/2026',
    rating: 4.7
  },
  {
    id: 'climate-change',
    title: 'Climate Change: Impact on Future Generations',
    type: 'reading',
    topic: 'Environment',
    difficulty: 'C1',
    questionCount: 15,
    author: 'National Geographic',
    publishedAt: '11/07/2026',
    rating: 4.6
  },
  {
    id: 'lang-fast',
    title: 'Podcast: Secret Methods to Learn Languages Fast',
    type: 'listening',
    topic: 'Education',
    difficulty: 'A2',
    questionCount: 5,
    author: 'Polyglot Club',
    publishedAt: '15/07/2026',
    rating: 4.5
  },
  {
    id: 'ielts-migration',
    title: 'IELTS Reading: History of Human Migration',
    type: 'reading',
    topic: 'History',
    difficulty: 'B2',
    questionCount: 12,
    author: 'IELTS Practice',
    publishedAt: '09/07/2026',
    rating: 4.6
  }
];

