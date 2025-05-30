import type { Question } from "@/types/test"

export const questionBank: Question[] = [
  // A1 Level Questions
  {
    id: 1,
    question: "What _____ your name?",
    options: ["is", "are", "am", "be"],
    correct: 0,
    level: "A1",
    category: "grammar",
  },
  {
    id: 2,
    question: "I _____ from Korea.",
    options: ["am", "is", "are", "be"],
    correct: 0,
    level: "A1",
    category: "grammar",
  },
  {
    id: 3,
    question: "She _____ to school every day.",
    options: ["go", "goes", "going", "went"],
    correct: 1,
    level: "A1",
    category: "grammar",
  },

  // A2 Level Questions
  {
    id: 4,
    question: "I have been living here _____ five years.",
    options: ["since", "for", "during", "while"],
    correct: 1,
    level: "A2",
    category: "grammar",
  },
  {
    id: 5,
    question: "Yesterday I _____ to the cinema.",
    options: ["go", "went", "going", "goes"],
    correct: 1,
    level: "A2",
    category: "grammar",
  },

  // B1 Level Questions
  {
    id: 6,
    question: "If I _____ you, I would study harder.",
    options: ["am", "was", "were", "be"],
    correct: 2,
    level: "B1",
    category: "grammar",
  },
  {
    id: 7,
    question: "The book _____ by millions of people.",
    options: ["has read", "has been read", "have read", "have been read"],
    correct: 1,
    level: "B1",
    category: "grammar",
  },

  // B2 Level Questions
  {
    id: 8,
    question: "The project _____ by the team next month.",
    options: ["will complete", "will be completed", "will completing", "will have completed"],
    correct: 1,
    level: "B2",
    category: "grammar",
  },
  {
    id: 9,
    question: "I wish I _____ more time to finish this work.",
    options: ["have", "had", "will have", "would have"],
    correct: 1,
    level: "B2",
    category: "grammar",
  },

  // C1 Level Questions
  {
    id: 10,
    question: "_____ the weather been like recently?",
    options: ["How", "What", "Which", "Where"],
    correct: 1,
    level: "C1",
    category: "grammar",
  },
  {
    id: 11,
    question: "The company's profits have _____ significantly this year.",
    options: ["raised", "risen", "aroused", "arisen"],
    correct: 1,
    level: "C1",
    category: "vocabulary",
  },

  // C2 Level Questions
  {
    id: 12,
    question: "The politician's speech was so _____ that it convinced even his harshest critics.",
    options: ["eloquent", "elegant", "elaborate", "elusive"],
    correct: 0,
    level: "C2",
    category: "vocabulary",
  },
]

export function getRandomQuestions(count = 20): Question[] {
  const shuffled = [...questionBank].sort(() => 0.5 - Math.random())
  return shuffled.slice(0, count)
}

export function getQuestionsByLevel(level: Question["level"]): Question[] {
  return questionBank.filter((q) => q.level === level)
}
