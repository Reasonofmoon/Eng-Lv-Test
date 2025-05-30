"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Progress } from "@/components/ui/progress"
import { ArrowLeft, ArrowRight, Clock } from "lucide-react"
import Link from "next/link"

interface Question {
  id: number
  question: string
  options: string[]
  correct: number
  level: string
}

const questions: Question[] = [
  {
    id: 1,
    question: "What _____ you do yesterday?",
    options: ["do", "did", "does", "doing"],
    correct: 1,
    level: "A1",
  },
  {
    id: 2,
    question: "I have been living here _____ five years.",
    options: ["since", "for", "during", "while"],
    correct: 1,
    level: "A2",
  },
  {
    id: 3,
    question: "If I _____ you, I would study harder.",
    options: ["am", "was", "were", "be"],
    correct: 2,
    level: "B1",
  },
  {
    id: 4,
    question: "The project _____ by the team next month.",
    options: ["will complete", "will be completed", "will completing", "will have completed"],
    correct: 1,
    level: "B2",
  },
  {
    id: 5,
    question: "_____ the weather been like recently?",
    options: ["How", "What", "Which", "Where"],
    correct: 1,
    level: "C1",
  },
]

export default function TestPage() {
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [answers, setAnswers] = useState<number[]>(new Array(questions.length).fill(-1))
  const [timeLeft, setTimeLeft] = useState(1800) // 30 minutes
  const [isCompleted, setIsCompleted] = useState(false)

  const handleAnswerSelect = (answerIndex: number) => {
    const newAnswers = [...answers]
    newAnswers[currentQuestion] = answerIndex
    setAnswers(newAnswers)
  }

  const handleNext = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1)
    } else {
      setIsCompleted(true)
    }
  }

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1)
    }
  }

  const calculateScore = () => {
    let correct = 0
    answers.forEach((answer, index) => {
      if (answer === questions[index].correct) {
        correct++
      }
    })
    return Math.round((correct / questions.length) * 100)
  }

  const getLevel = (score: number) => {
    if (score >= 90) return "C2 - Proficient"
    if (score >= 80) return "C1 - Advanced"
    if (score >= 70) return "B2 - Upper Intermediate"
    if (score >= 60) return "B1 - Intermediate"
    if (score >= 50) return "A2 - Elementary"
    return "A1 - Beginner"
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, "0")}`
  }

  if (isCompleted) {
    const score = calculateScore()
    const level = getLevel(score)

    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12">
        <div className="max-w-2xl mx-auto px-4">
          <Card>
            <CardHeader className="text-center">
              <CardTitle className="text-3xl text-green-600">Test Completed!</CardTitle>
              <CardDescription>Here are your results</CardDescription>
            </CardHeader>
            <CardContent className="text-center space-y-6">
              <div className="text-6xl font-bold text-blue-600">{score}%</div>
              <div className="text-2xl font-semibold text-gray-800">{level}</div>
              <div className="text-gray-600">
                You answered {answers.filter((answer, index) => answer === questions[index].correct).length} out of{" "}
                {questions.length} questions correctly.
              </div>
              <div className="flex gap-4 justify-center">
                <Button asChild>
                  <Link href="/test">Retake Test</Link>
                </Button>
                <Button variant="outline" asChild>
                  <Link href="/">Back to Home</Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12">
      <div className="max-w-4xl mx-auto px-4">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <Link href="/">
            <Button variant="ghost" className="flex items-center gap-2">
              <ArrowLeft className="h-4 w-4" />
              Back to Home
            </Button>
          </Link>
          <div className="flex items-center gap-2 text-gray-600">
            <Clock className="h-4 w-4" />
            <span>{formatTime(timeLeft)}</span>
          </div>
        </div>

        {/* Progress */}
        <div className="mb-8">
          <div className="flex justify-between text-sm text-gray-600 mb-2">
            <span>
              Question {currentQuestion + 1} of {questions.length}
            </span>
            <span>{Math.round(((currentQuestion + 1) / questions.length) * 100)}% Complete</span>
          </div>
          <Progress value={((currentQuestion + 1) / questions.length) * 100} />
        </div>

        {/* Question Card */}
        <Card className="mb-8">
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle className="text-xl">Question {currentQuestion + 1}</CardTitle>
              <span className="text-sm bg-blue-100 text-blue-800 px-2 py-1 rounded">
                Level: {questions[currentQuestion].level}
              </span>
            </div>
            <CardDescription className="text-lg font-medium text-gray-800">
              {questions[currentQuestion].question}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <RadioGroup
              value={answers[currentQuestion]?.toString()}
              onValueChange={(value) => handleAnswerSelect(Number.parseInt(value))}
            >
              {questions[currentQuestion].options.map((option, index) => (
                <div key={index} className="flex items-center space-x-2 p-3 rounded-lg hover:bg-gray-50">
                  <RadioGroupItem value={index.toString()} id={`option-${index}`} />
                  <Label htmlFor={`option-${index}`} className="flex-1 cursor-pointer">
                    {option}
                  </Label>
                </div>
              ))}
            </RadioGroup>
          </CardContent>
        </Card>

        {/* Navigation */}
        <div className="flex justify-between">
          <Button
            variant="outline"
            onClick={handlePrevious}
            disabled={currentQuestion === 0}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Previous
          </Button>
          <Button onClick={handleNext} disabled={answers[currentQuestion] === -1} className="flex items-center gap-2">
            {currentQuestion === questions.length - 1 ? "Finish Test" : "Next"}
            <ArrowRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  )
}
