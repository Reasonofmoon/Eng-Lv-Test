export type QuestionType =
  | "multiple-choice"
  | "fill-blank"
  | "reading-comprehension"
  | "listening-comprehension"
  | "vocabulary-match"

export type CEFRLevel = "A1" | "A2" | "B1" | "B2" | "C1" | "C2"

export type SkillArea = "grammar" | "vocabulary" | "reading" | "listening" | "writing"

export interface BaseQuestion {
  id: string
  type: QuestionType
  level: CEFRLevel
  skillArea: SkillArea
  points: number
  timeLimit?: number
  createdAt: Date
  updatedAt: Date
  createdBy: string
}

export interface MultipleChoiceQuestion extends BaseQuestion {
  type: "multiple-choice"
  question: string
  options: string[]
  correctAnswer: number
  explanation?: string
}

export interface FillBlankQuestion extends BaseQuestion {
  type: "fill-blank"
  passage: string
  blanks: {
    position: number
    correctAnswers: string[]
    options?: string[]
  }[]
}

export interface ReadingComprehensionQuestion extends BaseQuestion {
  type: "reading-comprehension"
  passage: {
    title: string
    content: string
    wordCount: number
  }
  questions: {
    id: string
    question: string
    options: string[]
    correctAnswer: number
  }[]
}

export interface ListeningComprehensionQuestion extends BaseQuestion {
  type: "listening-comprehension"
  audioUrl: string
  transcript: string
  duration: number
  questions: {
    id: string
    question: string
    options: string[]
    correctAnswer: number
  }[]
}

export interface VocabularyMatchQuestion extends BaseQuestion {
  type: "vocabulary-match"
  words: string[]
  definitions: string[]
  correctMatches: number[]
}

export type Question =
  | MultipleChoiceQuestion
  | FillBlankQuestion
  | ReadingComprehensionQuestion
  | ListeningComprehensionQuestion
  | VocabularyMatchQuestion

export interface TestSession {
  id: string
  userId?: string
  questions: Question[]
  answers: Record<string, any>
  startTime: Date
  endTime?: Date
  timeLimit: number
  currentQuestionIndex: number
  isCompleted: boolean
}

export interface TestResult {
  id: string
  sessionId: string
  userId?: string
  totalScore: number
  maxScore: number
  percentage: number
  cefrLevel: CEFRLevel
  skillBreakdown: Record<
    SkillArea,
    {
      score: number
      maxScore: number
      percentage: number
    }
  >
  timeSpent: number
  completedAt: Date
  recommendations: string[]
}

export interface User {
  id: string
  name: string
  email: string
  role: "student" | "admin"
  testHistory: TestResult[]
  createdAt: Date
}
