"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Trophy, Target, BookOpen, TrendingUp } from "lucide-react"
import Link from "next/link"

export default function ResultsPage() {
  // Mock data - in a real app, this would come from props or state management
  const result = {
    score: 85,
    level: "B2 - Upper Intermediate",
    correctAnswers: 17,
    totalQuestions: 20,
    timeSpent: 1245, // seconds
    breakdown: {
      grammar: 90,
      vocabulary: 80,
      reading: 85,
      listening: 80,
    },
  }

  const recommendations = [
    {
      area: "Vocabulary",
      score: 80,
      suggestion: "Focus on advanced vocabulary and idiomatic expressions",
    },
    {
      area: "Listening",
      score: 80,
      suggestion: "Practice with native speaker audio materials",
    },
  ]

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}m ${secs}s`
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12">
      <div className="max-w-4xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Your Test Results</h1>
          <p className="text-gray-600">Detailed analysis of your English proficiency</p>
        </div>

        {/* Overall Score */}
        <Card className="mb-8">
          <CardHeader className="text-center">
            <div className="flex justify-center mb-4">
              <Trophy className="h-16 w-16 text-yellow-500" />
            </div>
            <CardTitle className="text-4xl text-blue-600">{result.score}%</CardTitle>
            <CardDescription className="text-xl font-semibold">{result.level}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
              <div>
                <div className="text-2xl font-bold text-gray-800">
                  {result.correctAnswers}/{result.totalQuestions}
                </div>
                <div className="text-gray-600">Correct Answers</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-800">{formatTime(result.timeSpent)}</div>
                <div className="text-gray-600">Time Spent</div>
              </div>
              <div>
                <Badge variant="secondary" className="text-lg px-4 py-2">
                  {result.level.split(" - ")[0]}
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Skill Breakdown */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="h-5 w-5" />
              Skill Breakdown
            </CardTitle>
            <CardDescription>Your performance in different areas</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {Object.entries(result.breakdown).map(([skill, score]) => (
              <div key={skill}>
                <div className="flex justify-between mb-2">
                  <span className="capitalize font-medium">{skill}</span>
                  <span className="font-bold">{score}%</span>
                </div>
                <Progress value={score} className="h-3" />
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Recommendations */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Recommendations for Improvement
            </CardTitle>
            <CardDescription>Areas to focus on for better results</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {recommendations.map((rec, index) => (
              <div key={index} className="border-l-4 border-blue-500 pl-4">
                <div className="font-semibold">
                  {rec.area} ({rec.score}%)
                </div>
                <div className="text-gray-600">{rec.suggestion}</div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Level Description */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BookOpen className="h-5 w-5" />
              Your Level: {result.level}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-700">
              At the B2 level, you can understand the main ideas of complex text on both concrete and abstract topics.
              You can interact with a degree of fluency and spontaneity that makes regular interaction with native
              speakers quite possible without strain for either party. You can produce clear, detailed text on a wide
              range of subjects and explain a viewpoint on a topical issue giving the advantages and disadvantages of
              various options.
            </p>
          </CardContent>
        </Card>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button asChild size="lg">
            <Link href="/test">Take Another Test</Link>
          </Button>
          <Button variant="outline" size="lg" asChild>
            <Link href="/">Back to Home</Link>
          </Button>
          <Button variant="outline" size="lg">
            Download Certificate
          </Button>
        </div>
      </div>
    </div>
  )
}
