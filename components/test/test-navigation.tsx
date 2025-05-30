"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { CheckCircle, Circle, AlertCircle, Flag } from "lucide-react"
import type { Question } from "@/types/enhanced-test"

interface TestNavigationProps {
  questions: Question[]
  currentIndex: number
  answers: Record<string, any>
  onNavigate: (index: number) => void
  onComplete: () => void
}

export function TestNavigation({ questions, currentIndex, answers, onNavigate, onComplete }: TestNavigationProps) {
  const getQuestionStatus = (question: Question, index: number) => {
    const hasAnswer = answers[question.id] !== undefined
    const isCurrent = index === currentIndex

    if (isCurrent) return "current"
    if (hasAnswer) return "answered"
    return "unanswered"
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "current":
        return <AlertCircle className="h-4 w-4 text-blue-600" />
      case "answered":
        return <CheckCircle className="h-4 w-4 text-green-600" />
      default:
        return <Circle className="h-4 w-4 text-gray-400" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "current":
        return "bg-blue-100 border-blue-300"
      case "answered":
        return "bg-green-100 border-green-300"
      default:
        return "bg-gray-50 border-gray-200"
    }
  }

  const answeredCount = questions.filter((q) => answers[q.id] !== undefined).length
  const completionPercentage = Math.round((answeredCount / questions.length) * 100)

  return (
    <Card className="sticky top-4">
      <CardHeader>
        <CardTitle className="text-lg">Test Progress</CardTitle>
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>
              Answered: {answeredCount}/{questions.length}
            </span>
            <span>{completionPercentage}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-green-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${completionPercentage}%` }}
            />
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Question Grid */}
        <div className="grid grid-cols-4 gap-2">
          {questions.map((question, index) => {
            const status = getQuestionStatus(question, index)
            return (
              <button
                key={question.id}
                onClick={() => onNavigate(index)}
                className={`p-2 rounded border text-sm font-medium transition-all hover:scale-105 ${getStatusColor(status)}`}
              >
                {index + 1}
              </button>
            )
          })}
        </div>

        {/* Legend */}
        <div className="space-y-2 text-xs">
          <div className="flex items-center gap-2">
            <CheckCircle className="h-3 w-3 text-green-600" />
            <span>Answered</span>
          </div>
          <div className="flex items-center gap-2">
            <AlertCircle className="h-3 w-3 text-blue-600" />
            <span>Current</span>
          </div>
          <div className="flex items-center gap-2">
            <Circle className="h-3 w-3 text-gray-400" />
            <span>Not answered</span>
          </div>
        </div>

        {/* Navigation Buttons */}
        <div className="space-y-2">
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => onNavigate(currentIndex - 1)}
              disabled={currentIndex === 0}
              className="flex-1"
            >
              Previous
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => onNavigate(currentIndex + 1)}
              disabled={currentIndex === questions.length - 1}
              className="flex-1"
            >
              Next
            </Button>
          </div>

          <Button
            onClick={onComplete}
            className="w-full"
            variant={answeredCount === questions.length ? "default" : "outline"}
          >
            <Flag className="h-4 w-4 mr-2" />
            {answeredCount === questions.length ? "Complete Test" : "Finish Early"}
          </Button>
        </div>

        {/* Skill Breakdown */}
        <div className="space-y-2">
          <div className="text-sm font-medium">Skills Covered:</div>
          {["grammar", "vocabulary", "reading", "listening"].map((skill) => {
            const skillQuestions = questions.filter((q) => q.skillArea === skill)
            const skillAnswered = skillQuestions.filter((q) => answers[q.id] !== undefined).length

            if (skillQuestions.length === 0) return null

            return (
              <div key={skill} className="flex justify-between text-xs">
                <span className="capitalize">{skill}</span>
                <span>
                  {skillAnswered}/{skillQuestions.length}
                </span>
              </div>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}
