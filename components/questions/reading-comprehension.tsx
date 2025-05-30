"use client"

import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { BookOpen } from "lucide-react"
import type { ReadingComprehensionQuestion } from "@/types/enhanced-test"

interface ReadingComprehensionComponentProps {
  question: ReadingComprehensionQuestion
  answer?: number[]
  onChange: (answer: number[]) => void
}

export function ReadingComprehensionComponent({ question, answer = [], onChange }: ReadingComprehensionComponentProps) {
  const handleAnswerChange = (questionIndex: number, selectedAnswer: number) => {
    const newAnswer = [...answer]
    newAnswer[questionIndex] = selectedAnswer
    onChange(newAnswer)
  }

  return (
    <div className="space-y-6">
      {/* Reading Passage */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BookOpen className="h-5 w-5" />
            {question.passage.title}
          </CardTitle>
          <div className="text-sm text-gray-500">Word count: {question.passage.wordCount}</div>
        </CardHeader>
        <CardContent>
          <div className="prose max-w-none text-base leading-relaxed">
            {question.passage.content.split("\n").map((paragraph, index) => (
              <p key={index} className="mb-4">
                {paragraph}
              </p>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Questions */}
      <div className="space-y-6">
        <h3 className="text-lg font-medium text-gray-900">Answer the following questions based on the passage:</h3>

        {question.questions.map((q, questionIndex) => (
          <Card key={q.id}>
            <CardContent className="pt-6">
              <div className="space-y-4">
                <div className="font-medium text-gray-900">
                  {questionIndex + 1}. {q.question}
                </div>

                <RadioGroup
                  value={answer[questionIndex]?.toString()}
                  onValueChange={(value) => handleAnswerChange(questionIndex, Number.parseInt(value))}
                  className="space-y-2"
                >
                  {q.options.map((option, optionIndex) => (
                    <div key={optionIndex} className="flex items-center space-x-3 p-2 rounded hover:bg-gray-50">
                      <RadioGroupItem value={optionIndex.toString()} id={`q${questionIndex}-option-${optionIndex}`} />
                      <Label htmlFor={`q${questionIndex}-option-${optionIndex}`} className="flex-1 cursor-pointer">
                        {option}
                      </Label>
                    </div>
                  ))}
                </RadioGroup>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
