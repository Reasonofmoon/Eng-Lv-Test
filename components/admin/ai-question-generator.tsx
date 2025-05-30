"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Loader2, Bot, Wand2, CheckCircle, Copy } from "lucide-react"
import type { CEFRLevel, SkillArea, QuestionType } from "@/types/enhanced-test"

export function AIQuestionGenerator() {
  const [isGenerating, setIsGenerating] = useState(false)
  const [prompt, setPrompt] = useState("")
  const [level, setLevel] = useState<CEFRLevel>("B1")
  const [skillArea, setSkillArea] = useState<SkillArea>("grammar")
  const [questionType, setQuestionType] = useState<QuestionType>("multiple-choice")
  const [generatedQuestions, setGeneratedQuestions] = useState<any[]>([])

  const handleGenerate = async () => {
    if (!prompt.trim()) return

    setIsGenerating(true)

    // Simulate AI generation (in real app, this would call an AI service)
    await new Promise((resolve) => setTimeout(resolve, 3000))

    const mockQuestions = [
      {
        id: `ai-${Date.now()}-1`,
        type: questionType,
        level,
        skillArea,
        points: 5,
        question: "Which sentence correctly uses the present perfect tense?",
        options: [
          "I have been to Paris last year.",
          "I have visited Paris last year.",
          "I have been to Paris before.",
          "I was to Paris last year.",
        ],
        correctAnswer: 2,
        explanation: "The present perfect tense is used for experiences without specific time references.",
      },
      {
        id: `ai-${Date.now()}-2`,
        type: questionType,
        level,
        skillArea,
        points: 5,
        question: "Complete the sentence: 'If I _____ more time, I would learn Spanish.'",
        options: ["have", "had", "will have", "would have"],
        correctAnswer: 1,
        explanation: "Second conditional uses 'if + past simple' in the condition clause.",
      },
    ]

    setGeneratedQuestions(mockQuestions)
    setIsGenerating(false)
  }

  const copyToClipboard = (question: any) => {
    navigator.clipboard.writeText(JSON.stringify(question, null, 2))
  }

  const addToQuestionBank = (question: any) => {
    // In real app, this would save to database
    console.log("Adding to question bank:", question)
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bot className="h-5 w-5" />
            AI Question Generator
          </CardTitle>
          <CardDescription>Generate high-quality test questions using AI assistance</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Generation Form */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="text-sm font-medium mb-2 block">CEFR Level</label>
              <Select value={level} onValueChange={(value: CEFRLevel) => setLevel(value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="A1">A1 - Beginner</SelectItem>
                  <SelectItem value="A2">A2 - Elementary</SelectItem>
                  <SelectItem value="B1">B1 - Intermediate</SelectItem>
                  <SelectItem value="B2">B2 - Upper Intermediate</SelectItem>
                  <SelectItem value="C1">C1 - Advanced</SelectItem>
                  <SelectItem value="C2">C2 - Proficient</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="text-sm font-medium mb-2 block">Skill Area</label>
              <Select value={skillArea} onValueChange={(value: SkillArea) => setSkillArea(value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="grammar">Grammar</SelectItem>
                  <SelectItem value="vocabulary">Vocabulary</SelectItem>
                  <SelectItem value="reading">Reading</SelectItem>
                  <SelectItem value="listening">Listening</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="text-sm font-medium mb-2 block">Question Type</label>
              <Select value={questionType} onValueChange={(value: QuestionType) => setQuestionType(value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="multiple-choice">Multiple Choice</SelectItem>
                  <SelectItem value="fill-blank">Fill in the Blank</SelectItem>
                  <SelectItem value="reading-comprehension">Reading Comprehension</SelectItem>
                  <SelectItem value="listening-comprehension">Listening Comprehension</SelectItem>
                  <SelectItem value="vocabulary-match">Vocabulary Match</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div>
            <label className="text-sm font-medium mb-2 block">Generation Prompt</label>
            <Textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="Describe what kind of questions you want to generate. For example: 'Create questions about present perfect tense with real-life scenarios' or 'Generate vocabulary questions about business English'"
              rows={4}
            />
          </div>

          <Button onClick={handleGenerate} disabled={isGenerating || !prompt.trim()} className="w-full">
            {isGenerating ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Generating Questions...
              </>
            ) : (
              <>
                <Wand2 className="h-4 w-4 mr-2" />
                Generate Questions
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      {/* Generated Questions */}
      {generatedQuestions.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Generated Questions</CardTitle>
            <CardDescription>Review and add the AI-generated questions to your question bank</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {generatedQuestions.map((question, index) => (
              <Card key={question.id} className="border-l-4 border-l-blue-500">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-lg">Question {index + 1}</CardTitle>
                      <div className="flex gap-2 mt-2">
                        <Badge variant="secondary">{question.level}</Badge>
                        <Badge variant="outline">{question.skillArea}</Badge>
                        <Badge variant="outline">{question.type}</Badge>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" onClick={() => copyToClipboard(question)}>
                        <Copy className="h-4 w-4" />
                      </Button>
                      <Button size="sm" onClick={() => addToQuestionBank(question)}>
                        <CheckCircle className="h-4 w-4 mr-2" />
                        Add to Bank
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <div className="font-medium text-gray-900 mb-2">{question.question}</div>
                      <div className="space-y-1">
                        {question.options.map((option: string, optionIndex: number) => (
                          <div
                            key={optionIndex}
                            className={`p-2 rounded text-sm ${
                              optionIndex === question.correctAnswer
                                ? "bg-green-100 border border-green-300"
                                : "bg-gray-50"
                            }`}
                          >
                            {String.fromCharCode(65 + optionIndex)}. {option}
                            {optionIndex === question.correctAnswer && (
                              <Badge variant="secondary" className="ml-2">
                                Correct
                              </Badge>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>

                    {question.explanation && (
                      <div className="p-3 bg-blue-50 rounded-lg">
                        <div className="text-sm font-medium text-blue-900 mb-1">Explanation:</div>
                        <div className="text-sm text-blue-800">{question.explanation}</div>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </CardContent>
        </Card>
      )}

      {/* AI Tips */}
      <Card>
        <CardHeader>
          <CardTitle>AI Generation Tips</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3 text-sm">
            <div className="flex items-start gap-2">
              <div className="w-2 h-2 bg-blue-600 rounded-full mt-2"></div>
              <div>
                <strong>Be specific:</strong> Include details about the topic, context, or specific grammar points you
                want to test.
              </div>
            </div>
            <div className="flex items-start gap-2">
              <div className="w-2 h-2 bg-blue-600 rounded-full mt-2"></div>
              <div>
                <strong>Provide context:</strong> Mention if you want business English, academic English, or everyday
                situations.
              </div>
            </div>
            <div className="flex items-start gap-2">
              <div className="w-2 h-2 bg-blue-600 rounded-full mt-2"></div>
              <div>
                <strong>Set difficulty:</strong> The AI will adjust complexity based on the CEFR level you select.
              </div>
            </div>
            <div className="flex items-start gap-2">
              <div className="w-2 h-2 bg-blue-600 rounded-full mt-2"></div>
              <div>
                <strong>Review carefully:</strong> Always review generated questions for accuracy and appropriateness
                before adding to your question bank.
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
