// ─── Mock Data ───────────────────────────────────────────────────────────────
// Temporary placeholder data for development / demo purposes.
// When connecting a real backend, delete this file and update the services.

import type { User, Exercise, Question, QuizItem, WeeklyData, MonthlyProgress, CompletedTest } from '@/types';

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

export const mockWeeklyData: WeeklyData[] = [
  { day: 'Mon', listening: 2, reading: 1, score: 78 },
  { day: 'Tue', listening: 1, reading: 2, score: 82 },
  { day: 'Wed', listening: 3, reading: 1, score: 85 },
  { day: 'Thu', listening: 0, reading: 3, score: 80 },
  { day: 'Fri', listening: 2, reading: 2, score: 88 },
  { day: 'Sat', listening: 1, reading: 0, score: 92 },
  { day: 'Sun', listening: 2, reading: 1, score: 86 },
];

export const mockMonthlyProgress: MonthlyProgress[] = [
  { month: 'Feb', score: 65, exercises: 12 },
  { month: 'Mar', score: 70, exercises: 18 },
  { month: 'Apr', score: 72, exercises: 22 },
  { month: 'May', score: 75, exercises: 25 },
  { month: 'Jun', score: 80, exercises: 30 },
  { month: 'Jul', score: 85, exercises: 35 },
];

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
    rating: 4.8,
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
    rating: 4.9,
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
    rating: 4.7,
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
    rating: 4.6,
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
    rating: 4.5,
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
    rating: 4.6,
  },
];

// Placeholder questions — replace with AI-generated content from backend
export const mockQuestions: Question[] = [
  {
    id: '1',
    type: 'multiple-choice',
    question: 'What is the main theme discussed in the passage?',
    options: [
      'The importance of technology in education',
      'How introverts contribute to society',
      'The benefits of extroversion in leadership',
      "Social media's impact on relationships",
    ],
    answer: 'How introverts contribute to society',
    explanation:
      'The passage primarily discusses how introverts, despite societal preferences for extroversion, contribute significantly to society through deep thinking and creativity.',
  },
  {
    id: '2',
    type: 'true-false',
    question: 'The author suggests that introversion is a weakness that needs to be overcome.',
    options: ['True', 'False'],
    answer: 'False',
    explanation:
      'The author argues the opposite — that introversion is a strength, and society should value the unique contributions of introverts.',
  },
  {
    id: '3',
    type: 'gap-fill',
    question: 'Introverts often prefer working in _______ environments where they can focus deeply.',
    answer: 'quiet',
    explanation: 'The text explicitly states that introverts thrive in quiet environments.',
  },
  {
    id: '4',
    type: 'multiple-choice',
    question: 'According to the passage, what percentage of people are introverts?',
    options: ['One-quarter', 'One-third', 'One-half', 'Two-thirds'],
    answer: 'One-third',
    explanation: 'The author states that approximately one-third to one-half of the population are introverts.',
  },
  {
    id: '5',
    type: 'short-answer',
    question: 'Name TWO famous introverts mentioned in the passage and their contributions.',
    answer: 'Albert Einstein (physicist) and Rosa Parks (civil rights activist)',
    explanation: 'The passage cites Einstein and Rosa Parks as examples of introverts who changed the world.',
  },
  {
    id: '6',
    type: 'multiple-choice',
    question: 'What does the author recommend for schools?',
    options: [
      'More group projects and team activities',
      'Creating spaces for solitary work and reflection',
      'Eliminating all collaborative activities',
      'Separating introverted and extroverted students',
    ],
    answer: 'Creating spaces for solitary work and reflection',
    explanation: 'The author advocates for educational environments that accommodate both collaborative and individual learning styles.',
  },
  {
    id: '7',
    type: 'true-false',
    question: 'The passage implies that modern workplaces are well-designed for introverts.',
    options: ['True', 'False'],
    answer: 'False',
    explanation: 'The author criticizes open-plan offices as unsuitable for introverts.',
  },
  {
    id: '8',
    type: 'gap-fill',
    question: 'The author calls for a _______ revolution in how we think about introversion.',
    answer: 'quiet',
    explanation: "This references the book 'Quiet' by Susan Cain.",
  },
  {
    id: '9',
    type: 'multiple-choice',
    question: "Which of the following best describes the author's tone?",
    options: ['Neutral and objective', 'Persuasive and passionate', 'Humorous and light-hearted', 'Pessimistic and critical'],
    answer: 'Persuasive and passionate',
    explanation: 'The author uses persuasive language and shows clear passion for the topic.',
  },
  {
    id: '10',
    type: 'matching',
    question: 'Match each term with its correct definition: Introversion, Ambiversion, Extroversion',
    options: [
      'Introversion - Energized by social interaction',
      'Ambiversion - Balanced mix of both',
      'Extroversion - Energized by solitude',
    ],
    answer: 'Ambiversion - Balanced mix of both',
    explanation: 'Ambiversion refers to people who exhibit qualities of both introversion and extroversion.',
  },
];

export const seedCompletedTests: CompletedTest[] = [
  {
    id: 'comp-1',
    title: 'TED Talk: The Power of Introverts',
    type: 'listening',
    score: 90,
    totalQuestions: 10,
    correctAnswers: 9,
    completedAt: '28/07/2026 14:30',
    difficulty: 'B2',
  },
  {
    id: 'comp-2',
    title: 'IELTS Academic: Urban Development and Planning',
    type: 'reading',
    score: 85,
    totalQuestions: 20,
    correctAnswers: 17,
    completedAt: '26/07/2026 09:15',
    difficulty: 'C1',
  },
  {
    id: 'comp-3',
    title: 'BBC News: Technology and Society in 2025',
    type: 'listening',
    score: 75,
    totalQuestions: 8,
    correctAnswers: 6,
    completedAt: '24/07/2026 16:45',
    difficulty: 'B1',
  },
  {
    id: 'comp-4',
    title: 'Climate Change: Impact on Future Generations',
    type: 'reading',
    score: 80,
    totalQuestions: 15,
    correctAnswers: 12,
    completedAt: '20/07/2026 11:20',
    difficulty: 'C1',
  },
];

export interface SamplePassage {
  title: string;
  passage: string;
  words: string;
  difficulty: string;
}

export const samplePassages: SamplePassage[] = [
  {
    title: 'Urban Development & Smart Cities',
    words: '280 words',
    difficulty: 'B2',
    passage: `Urban development has transformed cities around the world at an unprecedented pace. As populations continue to migrate from rural to urban areas, city planners face the challenge of accommodating millions of new residents while maintaining quality of life.

The concept of sustainable urban development has emerged as a key framework for addressing these challenges. This approach seeks to balance economic growth, environmental protection, and social equity. Cities like Singapore, Copenhagen, and Medellín have become global models for innovative urban planning, demonstrating that rapid development need not come at the expense of livability.

Green infrastructure plays a crucial role in sustainable cities. Urban forests, green roofs, and parks not only improve air quality and reduce the urban heat island effect, but also provide residents with vital recreational spaces. Research has consistently shown that access to green space improves mental health outcomes and strengthens community bonds.

Transportation networks are another critical consideration. Cities that invest heavily in public transit, cycling infrastructure, and pedestrian-friendly streetscapes tend to see reduced traffic congestion, lower carbon emissions, and improved public health. The shift away from car-centric planning represents one of the most significant transformations in urban design thinking.

Housing affordability remains one of the most pressing issues facing growing cities. As demand outpaces supply in desirable urban areas, prices rise and lower-income residents face displacement. Innovative solutions including community land trusts, inclusionary zoning, and modular construction are being explored as potential remedies.`,
  },
  {
    title: 'Climate Change & Ecosystems',
    words: '120 words',
    difficulty: 'C1',
    passage: 'Climate change represents one of the defining challenges of our time. Rising global temperatures, driven primarily by human greenhouse gas emissions, are causing glaciers to melt, sea levels to rise, and weather patterns to become increasingly volatile. Ecosystems around the world are struggling to adapt to these rapid shifts, leading to changes in species distributions and placing biodiversity at risk. Solutions must incorporate both mitigation policies and local adaptation planning.',
  },
  {
    title: 'The Evolution of English Education',
    words: '95 words',
    difficulty: 'B2',
    passage: 'The methods of teaching English as a second language have undergone dramatic modifications in the digital age. Moving away from rote grammar translation, modern educators leverage interactive software, peer dialogue, and real-time AI conversation partners. This shifts focus toward communicative competence and active speaking practice, which increases student motivation and accelerates fluency development.',
  },
];

export interface SampleAudio {
  title: string;
  duration: string;
  difficulty: string;
  url: string;
}

export const sampleAudios: SampleAudio[] = [
  {
    title: 'IELTS Listening Practice Test 1',
    duration: '30 mins',
    difficulty: 'B2',
    url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3',
  },
  {
    title: 'BBC 6 Minute English – AI & Jobs',
    duration: '6 mins',
    difficulty: 'B1',
    url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3',
  },
  {
    title: 'TED Talk Audio: Power of Introverts',
    duration: '12 mins',
    difficulty: 'C1',
    url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3',
  },
];
