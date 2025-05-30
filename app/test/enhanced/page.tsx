"use client"

import { useState, useEffect, useCallback } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Clock, Play, Pause } from "lucide-react"
import { MultipleChoiceComponent } from "@/components/questions/multiple-choice"
import { FillBlankComponent } from "@/components/questions/fill-blank"
import { ReadingComprehensionComponent } from "@/components/questions/reading-comprehension"
import { ListeningComprehensionComponent } from "@/components/questions/listening-comprehension"
import { VocabularyMatchComponent } from "@/components/questions/vocabulary-match"
import { TestTimer } from "@/components/test/test-timer"
import { TestNavigation } from "@/components/test/test-navigation"
import { TestResults } from "@/components/test/test-results"
import { enhancedQuestions } from "@/lib/enhanced-questions"
import { CEFRCalculator } from "@/lib/cefr-calculator"
import type { Question, TestSession, TestResult } from "@/types/enhanced-test"

export default function EnhancedTestPage() {
  const [session, setSession] = useState<TestSession>({
    id: `test-${Date.now()}`,
    questions: enhancedQuestions.slice(0, 20), // Take first 20 questions
    answers: {},
    startTime: new Date(),
    timeLimit: 3600, // 60 minutes
    currentQuestionIndex: 0,
    isCompleted: false,
  })

  const [timeLeft, setTimeLeft] = useState(session.timeLimit)
  const [isTimerRunning, setIsTimerRunning] = useState(true)
  const [result, setResult] = useState<TestResult | null>(null)

  // Timer effect
  useEffect(() => {
    if (!isTimerRunning || session.isCompleted || timeLeft <= 0) return

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          handleTimeUp()
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [isTimerRunning, session.isCompleted, timeLeft])

  const handleTimeUp = useCallback(() => {
    setIsTimerRunning(false)
    completeTest()
  }, [])

  const handleAnswerChange = (questionId: string, answer: any) => {
    setSession((prev) => ({
      ...prev,
      answers: {
        ...prev.answers,
        [questionId]: answer,
      },
    }))
  }

  const navigateToQuestion = (index: number) => {
    if (index >= 0 && index < session.questions.length) {
      setSession((prev) => ({
        ...prev,
        currentQuestionIndex: index,
      }))
    }
  }

  const completeTest = () => {
    const endTime = new Date()
    const timeSpent = Math.floor((endTime.getTime() - session.startTime.getTime()) / 1000)

    const calculatedResult = CEFRCalculator.calculateDetailedResults(session.questions, session.answers)

    const finalResult: TestResult = {
      id: `result-${Date.now()}`,
      sessionId: session.id,
      ...calculatedResult,
      timeSpent,
      completedAt: endTime,
    }

    setResult(finalResult)
    setSession((prev) => ({
      ...prev,
      isCompleted: true,
      endTime,
    }))
    setIsTimerRunning(false)
  }

  const renderQuestion = (question: Question) => {
    const answer = session.answers[question.id]

    switch (question.type) {
      case "multiple-choice":
        return (
          <MultipleChoiceComponent
            question={question as any}
            answer={answer}
            onChange={(answer) => handleAnswerChange(question.id, answer)}
          />
        )
      case "fill-blank":
        return (
          <FillBlankComponent
            question={question as any}
            answer={answer}
            onChange={(answer) => handleAnswerChange(question.id, answer)}
          />
        )
      case "reading-comprehension":
        return (
          <ReadingComprehensionComponent
            question={question as any}
            answer={answer}
            onChange={(answer) => handleAnswerChange(question.id, answer)}
          />
        )
      case "listening-comprehension":
        return (
          <ListeningComprehensionComponent
            question={question as any}
            answer={answer}
            onChange={(answer) => handleAnswerChange(question.id, answer)}
          />
        )
      case "vocabulary-match":
        return (
          <VocabularyMatchComponent
            question={question as any}
            answer={answer}
            onChange={(answer) => handleAnswerChange(question.id, answer)}
          />
        )
      default:
        return <div>Unsupported question type</div>
    }
  }

  if (result) {
    return <TestResults result={result} session={session} />
  }

  const currentQuestion = session.questions[session.currentQuestionIndex]
  const progress = ((session.currentQuestionIndex + 1) / session.questions.length) * 100

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-4">
              <h1 className="text-xl font-bold">Enhanced English Test</h1>
              <Badge variant="outline">
                Question {session.currentQuestionIndex + 1} of {session.questions.length}
              </Badge>
            </div>

            <div className="flex items-center gap-4">
              <TestTimer
                timeLeft={timeLeft}
                isRunning={isTimerRunning}
                onToggle={() => setIsTimerRunning(!isTimerRunning)}
              />
              <Button variant="outline" size="sm" onClick={() => setIsTimerRunning(!isTimerRunning)}>
                {isTimerRunning ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
              </Button>
            </div>
          </div>

          <div className="mt-4">
            <Progress value={progress} className="h-2" />
            <div className="flex justify-between text-sm text-gray-600 mt-1">
              <span>{Math.round(progress)}% Complete</span>
              <span>{session.questions.length - session.currentQuestionIndex - 1} questions remaining</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Question Content */}
          <div className="lg:col-span-3">
            <Card>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      Question {session.currentQuestionIndex + 1}
                      <Badge variant="secondary">{currentQuestion.level}</Badge>
                      <Badge variant="outline">{currentQuestion.skillArea}</Badge>
                    </CardTitle>
                    <CardDescription>
                      {currentQuestion.type.replace("-", " ").replace(/\b\w/g, (l) => l.toUpperCase())} •{" "}
                      {currentQuestion.points} points
                    </CardDescription>
                  </div>
                  {currentQuestion.timeLimit && (
                    <div className="flex items-center gap-1 text-sm text-gray-500">
                      <Clock className="h-4 w-4" />
                      {currentQuestion.timeLimit}s
                    </div>
                  )}
                </div>
              </CardHeader>
              <CardContent>{renderQuestion(currentQuestion)}</CardContent>
            </Card>
          </div>

          {/* Navigation Sidebar */}
          <div className="lg:col-span-1">
            <TestNavigation
              questions={session.questions}
              currentIndex={session.currentQuestionIndex}
              answers={session.answers}
              onNavigate={navigateToQuestion}
              onComplete={completeTest}
            />
          </div>
        </div>
      </div>
    </div>
  )
}
