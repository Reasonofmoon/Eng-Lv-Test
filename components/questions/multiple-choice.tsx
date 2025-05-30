"use client"

import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import type { MultipleChoiceQuestion } from "@/types/enhanced-test"

interface MultipleChoiceComponentProps {
  question: MultipleChoiceQuestion
  answer?: number
  onChange: (answer: number) => void
}

export function MultipleChoiceComponent({ question, answer, onChange }: MultipleChoiceComponentProps) {
  return (
    <div className="space-y-6">
      <div className="text-lg font-medium text-gray-900">{question.question}</div>

      <RadioGroup
        value={answer?.toString()}
        onValueChange={(value) => onChange(Number.parseInt(value))}
        className="space-y-3"
      >
        {question.options.map((option, index) => (
          <div
            key={index}
            className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-50 border border-transparent hover:border-gray-200"
          >
            <RadioGroupItem value={index.toString()} id={`option-${index}`} />
            <Label htmlFor={`option-${index}`} className="flex-1 cursor-pointer text-base">
              {option}
            </Label>
          </div>
        ))}
      </RadioGroup>

      {question.explanation && answer !== undefined && (
        <div className="mt-4 p-4 bg-blue-50 rounded-lg">
          <div className="text-sm font-medium text-blue-900 mb-1">Explanation:</div>
          <div className="text-sm text-blue-800">{question.explanation}</div>
        </div>
      )}
    </div>
  )
}
