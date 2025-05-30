import type { CEFRLevel, SkillArea, TestResult, Question } from "@/types/enhanced-test"

export class CEFRCalculator {
  private static readonly LEVEL_THRESHOLDS = {
    A1: { min: 0, max: 35 },
    A2: { min: 36, max: 50 },
    B1: { min: 51, max: 65 },
    B2: { min: 66, max: 80 },
    C1: { min: 81, max: 90 },
    C2: { min: 91, max: 100 },
  }

  private static readonly SKILL_WEIGHTS = {
    grammar: 0.25,
    vocabulary: 0.25,
    reading: 0.25,
    listening: 0.25,
    writing: 0.0, // Not implemented yet
  }

  static calculateCEFRLevel(percentage: number): CEFRLevel {
    for (const [level, threshold] of Object.entries(this.LEVEL_THRESHOLDS)) {
      if (percentage >= threshold.min && percentage <= threshold.max) {
        return level as CEFRLevel
      }
    }
    return "A1" // Default fallback
  }

  static calculateDetailedResults(
    questions: Question[],
    answers: Record<string, any>,
  ): Omit<TestResult, "id" | "sessionId" | "userId" | "completedAt"> {
    let totalScore = 0
    let maxScore = 0
    const skillScores: Record<SkillArea, { score: number; maxScore: number }> = {
      grammar: { score: 0, maxScore: 0 },
      vocabulary: { score: 0, maxScore: 0 },
      reading: { score: 0, maxScore: 0 },
      listening: { score: 0, maxScore: 0 },
      writing: { score: 0, maxScore: 0 },
    }

    questions.forEach((question) => {
      const answer = answers[question.id]
      const questionScore = this.scoreQuestion(question, answer)

      totalScore += questionScore
      maxScore += question.points

      skillScores[question.skillArea].score += questionScore
      skillScores[question.skillArea].maxScore += question.points
    })

    const percentage = maxScore > 0 ? Math.round((totalScore / maxScore) * 100) : 0
    const cefrLevel = this.calculateCEFRLevel(percentage)

    const skillBreakdown: Record<SkillArea, { score: number; maxScore: number; percentage: number }> =
      Object.fromEntries(
        Object.entries(skillScores).map(([skill, scores]) => [
          skill,
          {
            ...scores,
            percentage: scores.maxScore > 0 ? Math.round((scores.score / scores.maxScore) * 100) : 0,
          },
        ]),
      ) as any

    const recommendations = this.generateRecommendations(skillBreakdown, cefrLevel)

    return {
      totalScore,
      maxScore,
      percentage,
      cefrLevel,
      skillBreakdown,
      timeSpent: 0, // Will be calculated elsewhere
      recommendations,
    }
  }

  private static scoreQuestion(question: Question, answer: any): number {
    if (!answer) return 0

    switch (question.type) {
      case "multiple-choice":
        return answer === (question as any).correctAnswer ? question.points : 0

      case "fill-blank":
        const fillBlankQ = question as any
        let correctBlanks = 0
        fillBlankQ.blanks.forEach((blank: any, index: number) => {
          const userAnswer = answer[index]?.toLowerCase().trim()
          if (blank.correctAnswers.some((correct: string) => correct.toLowerCase().trim() === userAnswer)) {
            correctBlanks++
          }
        })
        return Math.round((correctBlanks / fillBlankQ.blanks.length) * question.points)

      case "reading-comprehension":
      case "listening-comprehension":
        const comprehensionQ = question as any
        let correctAnswers = 0
        comprehensionQ.questions.forEach((q: any, index: number) => {
          if (answer[index] === q.correctAnswer) {
            correctAnswers++
          }
        })
        return Math.round((correctAnswers / comprehensionQ.questions.length) * question.points)

      case "vocabulary-match":
        const vocabQ = question as any
        let correctMatches = 0
        vocabQ.correctMatches.forEach((correct: number, index: number) => {
          if (answer[index] === correct) {
            correctMatches++
          }
        })
        return Math.round((correctMatches / vocabQ.correctMatches.length) * question.points)

      default:
        return 0
    }
  }

  private static generateRecommendations(
    skillBreakdown: Record<SkillArea, { score: number; maxScore: number; percentage: number }>,
    cefrLevel: CEFRLevel,
  ): string[] {
    const recommendations: string[] = []

    // Skill-specific recommendations
    Object.entries(skillBreakdown).forEach(([skill, scores]) => {
      if (scores.maxScore > 0 && scores.percentage < 70) {
        switch (skill as SkillArea) {
          case "grammar":
            recommendations.push("Focus on grammar fundamentals and sentence structure")
            break
          case "vocabulary":
            recommendations.push("Expand your vocabulary with daily word learning")
            break
          case "reading":
            recommendations.push("Practice reading comprehension with varied texts")
            break
          case "listening":
            recommendations.push("Improve listening skills with native speaker content")
            break
        }
      }
    })

    // Level-specific recommendations
    switch (cefrLevel) {
      case "A1":
        recommendations.push("Start with basic vocabulary and simple sentence patterns")
        break
      case "A2":
        recommendations.push("Focus on everyday situations and common expressions")
        break
      case "B1":
        recommendations.push("Practice expressing opinions and describing experiences")
        break
      case "B2":
        recommendations.push("Work on complex texts and abstract topics")
        break
      case "C1":
        recommendations.push("Refine your language for academic and professional contexts")
        break
      case "C2":
        recommendations.push("Perfect your nuanced understanding and expression")
        break
    }

    return recommendations
  }
}
