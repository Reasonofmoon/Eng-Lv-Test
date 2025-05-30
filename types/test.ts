export interface Question {
  id: number
  question: string
  options: string[]
  correct: number
  level: "A1" | "A2" | "B1" | "B2" | "C1" | "C2"
  category: "grammar" | "vocabulary" | "reading" | "listening"
}

export interface TestResult {
  score: number
  level: string
  correctAnswers: number
  totalQuestions: number
  timeSpent: number
  breakdown: {
    grammar: number
    vocabulary: number
    reading: number
    listening: number
  }
}

export interface User {
  id: string
  name: string
  email: string
  testHistory: TestResult[]
}
