"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import type { VocabularyMatchQuestion } from "@/types/enhanced-test"

interface VocabularyMatchComponentProps {
  question: VocabularyMatchQuestion
  answer?: number[]
  onChange: (answer: number[]) => void
}

export function VocabularyMatchComponent({ question, answer = [], onChange }: VocabularyMatchComponentProps) {
  const [selectedWord, setSelectedWord] = useState<number | null>(null)
  const [selectedDefinition, setSelectedDefinition] = useState<number | null>(null)

  const handleWordClick = (index: number) => {
    if (answer[index] !== undefined) {
      // If already matched, clear the match
      const newAnswer = [...answer]
      newAnswer[index] = undefined as any
      onChange(newAnswer)
      return
    }

    setSelectedWord(index)
    setSelectedDefinition(null)
  }

  const handleDefinitionClick = (index: number) => {
    if (selectedWord !== null) {
      // Create match
      const newAnswer = [...answer]
      newAnswer[selectedWord] = index
      onChange(newAnswer)
      setSelectedWord(null)
      setSelectedDefinition(null)
    } else {
      setSelectedDefinition(index)
      setSelectedWord(null)
    }
  }

  const clearMatches = () => {
    onChange(new Array(question.words.length).fill(undefined))
    setSelectedWord(null)
    setSelectedDefinition(null)
  }

  const isDefinitionUsed = (defIndex: number) => {
    return answer.includes(defIndex)
  }

  return (
    <div className="space-y-6">
      <div className="text-lg font-medium text-gray-900 mb-4">Match each word with its correct definition:</div>

      <div className="flex justify-between items-center">
        <div className="text-sm text-gray-600">Click a word, then click its matching definition</div>
        <Button onClick={clearMatches} variant="outline" size="sm">
          Clear All Matches
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Words Column */}
        <div className="space-y-3">
          <h3 className="font-medium text-gray-900 mb-3">Words</h3>
          {question.words.map((word, index) => (
            <Card
              key={index}
              className={`cursor-pointer transition-all ${
                selectedWord === index
                  ? "ring-2 ring-blue-500 bg-blue-50"
                  : answer[index] !== undefined
                    ? "bg-green-50 border-green-200"
                    : "hover:bg-gray-50"
              }`}
              onClick={() => handleWordClick(index)}
            >
              <CardContent className="p-4">
                <div className="flex justify-between items-center">
                  <span className="font-medium">{word}</span>
                  {answer[index] !== undefined && <Badge variant="secondary">Matched</Badge>}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Definitions Column */}
        <div className="space-y-3">
          <h3 className="font-medium text-gray-900 mb-3">Definitions</h3>
          {question.definitions.map((definition, index) => (
            <Card
              key={index}
              className={`cursor-pointer transition-all ${
                selectedDefinition === index
                  ? "ring-2 ring-blue-500 bg-blue-50"
                  : isDefinitionUsed(index)
                    ? "bg-green-50 border-green-200"
                    : "hover:bg-gray-50"
              }`}
              onClick={() => handleDefinitionClick(index)}
            >
              <CardContent className="p-4">
                <div className="flex justify-between items-start">
                  <span className="text-sm">{definition}</span>
                  {isDefinitionUsed(index) && <Badge variant="secondary">Used</Badge>}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      <div className="text-sm text-gray-600">
        Matches: {answer.filter((a) => a !== undefined).length} / {question.words.length}
      </div>
    </div>
  )
}
