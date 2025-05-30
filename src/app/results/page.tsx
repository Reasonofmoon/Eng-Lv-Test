'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'

export default function ResultsPage() {
  const router = useRouter()
  const [results, setResults] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  
  useEffect(() => {
    // 클라이언트 사이드에서만 실행
    if (typeof window !== 'undefined') {
      const storedResults = localStorage.getItem('testResults')
      if (storedResults) {
        setResults(JSON.parse(storedResults))
      }
      setLoading(false)
    }
  }, [])
  
  // CEFR 레벨 추정 함수
  const estimateCEFR = (score: number, totalQuestions: number) => {
    if (totalQuestions === 0) return 'N/A'
    const percentage = (score / totalQuestions) * 100
    
    if (percentage <= 16) return 'A1 (Beginner)'
    if (percentage <= 33) return 'A2 (Elementary)'
    if (percentage <= 50) return 'B1 (Intermediate)'
    if (percentage <= 66) return 'B2 (Upper Intermediate)'
    if (percentage <= 83) return 'C1 (Advanced)'
    return 'C2 (Proficiency)'
  }
  
  // 테스트 다시 시작
  const handleRetakeTest = () => {
    router.push('/')
  }
  
  // 답안 검토
  const handleReviewAnswers = () => {
    router.push('/review')
  }
  
  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">결과 로딩 중...</h2>
          <Progress value={30} className="w-60" />
        </div>
      </div>
    )
  }
  
  if (!results) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">테스트 결과를 찾을 수 없습니다</h2>
          <p className="mb-4">테스트를 먼저 완료해주세요.</p>
          <Button onClick={() => router.push('/')}>
            홈으로 돌아가기
          </Button>
        </div>
      </div>
    )
  }
  
  const { score, totalQuestions, sectionScores } = results
  const cefrLevel = estimateCEFR(score, totalQuestions)
  
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-4 bg-[#F5F5F5]">
      <Card className="w-full max-w-3xl text-center bg-white rounded-xl shadow-2xl">
        <CardHeader>
          <CardTitle className="text-3xl font-bold text-[#4A90E2]">테스트 결과</CardTitle>
          <CardDescription className="text-lg">영어 능력 평가 결과입니다</CardDescription>
        </CardHeader>
        
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8 text-lg">
            <div className="bg-gray-100 p-6 rounded-lg shadow-md">
              <p className="text-gray-600">총점:</p>
              <p className="text-4xl font-bold text-[#F5A623]">{score} / {totalQuestions}</p>
            </div>
            <div className="bg-gray-100 p-6 rounded-lg shadow-md">
              <p className="text-gray-600">추정 CEFR 레벨:</p>
              <p className="text-4xl font-bold text-[#50E3C2]">{cefrLevel}</p>
            </div>
          </div>
          
          <div className="mb-8">
            <h3 className="text-2xl font-semibold text-[#4A90E2] mb-4">섹션별 점수</h3>
            <div className="space-y-3">
              {Object.entries(sectionScores).map(([section, data]: [string, any]) => (
                <div key={section} className="text-left">
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-gray-700 font-medium">{section}</span>
                    <span className="text-sm font-semibold text-[#4A90E2]">
                      {data.score}/{data.total} ({data.percentage}%)
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-5 shadow-inner overflow-hidden">
                    <div 
                      className="bg-[#50E3C2] h-5 rounded-full transition-all duration-1000 ease-out text-xs text-white flex items-center justify-center"
                      style={{ width: `${data.percentage}%` }}
                    >
                      {data.percentage > 10 ? `${data.percentage}%` : ''}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          <div className="mb-8">
            <h3 className="text-2xl font-semibold text-[#4A90E2] mb-4">학습 추천</h3>
            <div className="bg-blue-50 p-4 rounded-lg text-left">
              <p className="mb-2">
                <strong>현재 레벨:</strong> {cefrLevel}
              </p>
              <p className="mb-2">
                <strong>강점:</strong> {
                  Object.entries(sectionScores)
                    .sort((a, b) => b[1].percentage - a[1].percentage)
                    .slice(0, 1)
                    .map(([section]) => section)
                    .join(', ')
                }
              </p>
              <p className="mb-2">
                <strong>개선 필요:</strong> {
                  Object.entries(sectionScores)
                    .sort((a, b) => a[1].percentage - b[1].percentage)
                    .slice(0, 1)
                    .map(([section]) => section)
                    .join(', ')
                }
              </p>
              <p>
                <strong>다음 단계:</strong> {
                  score / totalQuestions < 0.5 
                    ? '기초 문법과 어휘 학습에 집중하세요.' 
                    : score / totalQuestions < 0.7
                      ? '중급 독해와 듣기 연습을 추천합니다.'
                      : '고급 작문과 회화 능력 향상에 집중하세요.'
                }
              </p>
            </div>
          </div>
        </CardContent>
        
        <CardFooter className="flex justify-center space-x-4">
          <Button 
            className="bg-[#50E3C2] hover:bg-[#3dbaa2]"
            onClick={handleReviewAnswers}
          >
            답안 검토
          </Button>
          <Button 
            variant="secondary"
            onClick={handleRetakeTest}
          >
            테스트 다시 시작
          </Button>
        </CardFooter>
      </Card>
    </main>
  )
}
