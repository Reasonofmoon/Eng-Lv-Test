import type { Question } from "@/types/enhanced-test"

export const enhancedQuestions: Question[] = [
  // Multiple Choice Questions
  {
    id: "mc-1",
    type: "multiple-choice",
    level: "A1",
    skillArea: "grammar",
    points: 5,
    question: "What _____ your name?",
    options: ["is", "are", "am", "be"],
    correctAnswer: 0,
    explanation: "We use 'is' with singular subjects like 'your name'.",
    timeLimit: 30,
    createdAt: new Date(),
    updatedAt: new Date(),
    createdBy: "system",
  },
  {
    id: "mc-2",
    type: "multiple-choice",
    level: "B1",
    skillArea: "grammar",
    points: 5,
    question: "If I _____ you, I would study harder.",
    options: ["am", "was", "were", "be"],
    correctAnswer: 2,
    explanation: "In second conditional, we use 'were' for all persons after 'if'.",
    timeLimit: 45,
    createdAt: new Date(),
    updatedAt: new Date(),
    createdBy: "system",
  },

  // Fill in the Blank Questions
  {
    id: "fb-1",
    type: "fill-blank",
    level: "A2",
    skillArea: "grammar",
    points: 10,
    passage: "Yesterday I _____ to the store and _____ some groceries. It _____ a beautiful day.",
    blanks: [
      {
        position: 12,
        correctAnswers: ["went", "walked", "drove"],
      },
      {
        position: 35,
        correctAnswers: ["bought", "purchased", "got"],
      },
      {
        position: 58,
        correctAnswers: ["was"],
      },
    ],
    timeLimit: 120,
    createdAt: new Date(),
    updatedAt: new Date(),
    createdBy: "system",
  },

  // Reading Comprehension
  {
    id: "rc-1",
    type: "reading-comprehension",
    level: "B2",
    skillArea: "reading",
    points: 15,
    passage: {
      title: "The Future of Remote Work",
      content: `The COVID-19 pandemic has fundamentally changed how we think about work. What started as an emergency measure has evolved into a permanent shift for many companies. Remote work, once considered a luxury or exception, has become the norm for millions of employees worldwide.

Studies show that remote workers are often more productive than their office-based counterparts. Without the distractions of office chatter and lengthy commute times, employees can focus better on their tasks. However, this shift isn't without challenges. Many workers report feeling isolated and struggle with work-life balance when their home becomes their office.

Companies are now investing heavily in digital infrastructure and collaboration tools. Video conferencing platforms, project management software, and cloud-based systems have become essential business tools. The question isn't whether remote work will continue, but how it will evolve to address current limitations while maintaining its benefits.`,
      wordCount: 156,
    },
    questions: [
      {
        id: "rc-1-q1",
        question: "According to the passage, what was the original reason for the shift to remote work?",
        options: [
          "Companies wanted to save money on office space",
          "It was an emergency response to the pandemic",
          "Employees demanded more flexibility",
          "Technology made it more feasible",
        ],
        correctAnswer: 1,
      },
      {
        id: "rc-1-q2",
        question: "What challenge of remote work is mentioned in the passage?",
        options: [
          "Decreased productivity",
          "Higher costs for companies",
          "Difficulty with work-life balance",
          "Lack of available technology",
        ],
        correctAnswer: 2,
      },
    ],
    timeLimit: 300,
    createdAt: new Date(),
    updatedAt: new Date(),
    createdBy: "system",
  },

  // Listening Comprehension
  {
    id: "lc-1",
    type: "listening-comprehension",
    level: "B1",
    skillArea: "listening",
    points: 12,
    audioUrl: "/audio/conversation-restaurant.mp3",
    transcript:
      "A: Good evening, do you have a reservation? B: Yes, we have a table for two under the name Johnson. A: Perfect, right this way please. Here's your table by the window. B: Thank you, this is lovely. Could we see the menu? A: Of course, here you are. Our special today is grilled salmon with vegetables. B: That sounds delicious. We'll need a few minutes to decide.",
    duration: 45,
    questions: [
      {
        id: "lc-1-q1",
        question: "How many people is the reservation for?",
        options: ["One", "Two", "Three", "Four"],
        correctAnswer: 1,
      },
      {
        id: "lc-1-q2",
        question: "What is the special dish today?",
        options: ["Grilled chicken", "Grilled salmon", "Beef steak", "Vegetarian pasta"],
        correctAnswer: 1,
      },
    ],
    timeLimit: 180,
    createdAt: new Date(),
    updatedAt: new Date(),
    createdBy: "system",
  },

  // Vocabulary Match
  {
    id: "vm-1",
    type: "vocabulary-match",
    level: "C1",
    skillArea: "vocabulary",
    points: 10,
    words: ["Eloquent", "Meticulous", "Pragmatic", "Resilient", "Versatile"],
    definitions: [
      "Able to adapt to many different functions or activities",
      "Showing great attention to detail; very careful and precise",
      "Dealing with things sensibly and realistically",
      "Able to withstand or recover quickly from difficult conditions",
      "Fluent and persuasive in speaking or writing",
    ],
    correctMatches: [4, 1, 2, 3, 0],
    timeLimit: 240,
    createdAt: new Date(),
    updatedAt: new Date(),
    createdBy: "system",
  },
]
