"use client"

import { Input } from "@/components/ui/input"
import type { FillBlankQuestion } from "@/types/enhanced-test"

interface FillBlankComponentProps {
  question: FillBlankQuestion
  answer?: string[]
  onChange: (answer: string[]) => void
}

export function FillBlankComponent({ question, answer = [], onChange }: FillBlankComponentProps) {
  const handleBlankChange = (index: number, value: string) => {
    const newAnswer = [...answer]
    newAnswer[index] = value
    onChange(newAnswer)
  }

  const renderPassageWithBlanks = () => {
    const parts = []
    let lastIndex = 0

    question.blanks.forEach((blank, blankIndex) => {
      // Add text before the blank
      parts.push(<span key={`text-${blankIndex}`}>{question.passage.substring(lastIndex, blank.position)}</span>)

      // Add the input for the blank
      parts.push(
        <Input
          key={`blank-${blankIndex}`}
          value={answer[blankIndex] || ""}
          onChange={(e) => handleBlankChange(blankIndex, e.target.value)}
          className="inline-block w-32 mx-1"
          placeholder={`Blank ${blankIndex + 1}`}
        />,
      )

      lastIndex = blank.position
    })

    // Add remaining text
    parts.push(<span key="text-end">{question.passage.substring(lastIndex)}</span>)

    return parts
  }

  return (
    <div className="space-y-6">
      <div className="text-lg font-medium text-gray-900 mb-4">Fill in the blanks with the most appropriate words:</div>

      <div className="text-base leading-relaxed p-4 bg-gray-50 rounded-lg">{renderPassageWithBlanks()}</div>

      <div className="text-sm text-gray-600">
        Fill in {question.blanks.length} blank{question.blanks.length > 1 ? "s" : ""} in the passage above.
      </div>
    </div>
  )
}
