"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Trophy, Target, BookOpen, TrendingUp, Download, Share2 } from "lucide-react"
import Link from "next/link"
import type { TestResult, TestSession } from "@/types/enhanced-test"

interface TestResultsProps {
  result: TestResult
  session: TestSession
}

export function TestResults({ result, session }: TestResultsProps) {
  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600)
    const mins = Math.floor((seconds % 3600) / 60)
    const secs = seconds % 60

    if (hours > 0) {
      return `${hours}h ${mins}m ${secs}s`
    }
    return `${mins}m ${secs}s`
  }

  const getCEFRDescription = (level: string) => {
    const descriptions = {
      A1: "Can understand and use familiar everyday expressions and very basic phrases.",
      A2: "Can understand sentences and frequently used expressions related to areas of most immediate relevance.",
      B1: "Can understand the main points of clear standard input on familiar matters regularly encountered.",
      B2: "Can understand the main ideas of complex text on both concrete and abstract topics.",
      C1: "Can understand a wide range of demanding, longer texts, and recognize implicit meaning.",
      C2: "Can understand with ease virtually everything heard or read.",
    }
    return descriptions[level as keyof typeof descriptions] || ""
  }

  const getGradeColor = (percentage: number) => {
    if (percentage >= 90) return "text-green-600"
    if (percentage >= 80) return "text-blue-600"
    if (percentage >= 70) return "text-yellow-600"
    if (percentage >= 60) return "text-orange-600"
    return "text-red-600"
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12">
      <div className="max-w-4xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Test Results</h1>
          <p className="text-gray-600">Comprehensive analysis of your English proficiency</p>
        </div>

        {/* Overall Score */}
        <Card className="mb-8">
          <CardHeader className="text-center">
            <div className="flex justify-center mb-4">
              <Trophy className="h-20 w-20 text-yellow-500" />
            </div>
            <CardTitle className={`text-6xl font-bold ${getGradeColor(result.percentage)}`}>
              {result.percentage}%
            </CardTitle>
            <CardDescription className="text-2xl font-semibold mt-2">CEFR Level: {result.cefrLevel}</CardDescription>
            <Badge variant="secondary" className="text-lg px-4 py-2 mt-2">
              {result.totalScore} / {result.maxScore} points
            </Badge>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
              <div>
                <div className="text-3xl font-bold text-gray-800">{session.questions.length}</div>
                <div className="text-gray-600">Total Questions</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-gray-800">{formatTime(result.timeSpent)}</div>
                <div className="text-gray-600">Time Spent</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-gray-800">
                  {new Date(result.completedAt).toLocaleDateString()}
                </div>
                <div className="text-gray-600">Completed</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* CEFR Level Description */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BookOpen className="h-5 w-5" />
              Your CEFR Level: {result.cefrLevel}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-700 leading-relaxed">{getCEFRDescription(result.cefrLevel)}</p>
          </CardContent>
        </Card>

        {/* Skill Breakdown */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="h-5 w-5" />
              Skill Analysis
            </CardTitle>
            <CardDescription>Your performance across different language skills</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {Object.entries(result.skillBreakdown).map(([skill, scores]) => {
              if (scores.maxScore === 0) return null

              return (
                <div key={skill}>
                  <div className="flex justify-between items-center mb-2">
                    <span className="capitalize font-medium text-lg">{skill}</span>
                    <div className="text-right">
                      <span className={`font-bold text-lg ${getGradeColor(scores.percentage)}`}>
                        {scores.percentage}%
                      </span>
                      <div className="text-sm text-gray-500">
                        {scores.score}/{scores.maxScore} points
                      </div>
                    </div>
                  </div>
                  <Progress value={scores.percentage} className="h-3" />
                </div>
              )
            })}
          </CardContent>
        </Card>

        {/* Recommendations */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Personalized Recommendations
            </CardTitle>
            <CardDescription>Areas to focus on for improvement</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {result.recommendations.map((recommendation, index) => (
                <div key={index} className="flex items-start gap-3 p-4 bg-blue-50 rounded-lg">
                  <div className="w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold mt-0.5">
                    {index + 1}
                  </div>
                  <div className="text-gray-700">{recommendation}</div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Question Type Performance */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Question Type Performance</CardTitle>
            <CardDescription>How you performed on different question types</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[
                "multiple-choice",
                "fill-blank",
                "reading-comprehension",
                "listening-comprehension",
                "vocabulary-match",
              ].map((type) => {
                const typeQuestions = session.questions.filter((q) => q.type === type)
                if (typeQuestions.length === 0) return null

                const typeAnswered = typeQuestions.filter((q) => session.answers[q.id] !== undefined).length
                const typePercentage = Math.round((typeAnswered / typeQuestions.length) * 100)

                return (
                  <div key={type} className="p-4 border rounded-lg">
                    <div className="flex justify-between items-center mb-2">
                      <span className="font-medium capitalize">{type.replace("-", " ")}</span>
                      <span className="font-bold">{typePercentage}%</span>
                    </div>
                    <Progress value={typePercentage} className="h-2" />
                    <div className="text-sm text-gray-500 mt-1">
                      {typeAnswered}/{typeQuestions.length} questions
                    </div>
                  </div>
                )
              })}
            </div>
          </CardContent>
        </Card>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button asChild size="lg">
            <Link href="/test/enhanced">Take Another Test</Link>
          </Button>
          <Button variant="outline" size="lg" asChild>
            <Link href="/">Back to Home</Link>
          </Button>
          <Button variant="outline" size="lg">
            <Download className="h-4 w-4 mr-2" />
            Download Certificate
          </Button>
          <Button variant="outline" size="lg">
            <Share2 className="h-4 w-4 mr-2" />
            Share Results
          </Button>
        </div>
      </div>
    </div>
  )
}
