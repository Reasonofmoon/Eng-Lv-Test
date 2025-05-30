'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { parseOptionValue } from '@/lib/data/questions'

export default function ReviewPage() {
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
  
  // 결과 페이지로 돌아가기
  const handleBackToResults = () => {
    router.push('/results')
  }
  
  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">답안 로딩 중...</h2>
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
  
  const { allQuestions, userAnswers } = results
  
  return (
    <main className="flex min-h-screen flex-col p-4 bg-[#F5F5F5]">
      <Card className="bg-white p-6 md:p-8 rounded-xl shadow-2xl flex-grow mb-6">
        <CardHeader>
          <CardTitle className="text-3xl font-bold text-[#4A90E2] mb-6 text-center">
            답안 검토
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-8">
            {allQuestions.map((question: any, index: number) => {
              const userAnswer = userAnswers[index]
              const isCorrect = userAnswer === question.answer
              
              return (
                <div key={index} className="border-b pb-6 mb-6 last:border-b-0">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="text-lg font-semibold">
                      문제 {index + 1}: {question.section}
                    </h3>
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                      isCorrect ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                    }`}>
                      {isCorrect ? '정답' : '오답'}
                    </span>
                  </div>
                  
                  {question.section === "Reading Comprehension" && (
                    <div className="mb-4 p-3 border rounded-lg bg-gray-50 max-h-[200px] overflow-y-auto">
                      <h4 className="text-md font-semibold text-[#4A90E2] mb-2">{question.passageTitle}</h4>
                      <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-line">{question.passageText}</p>
                    </div>
                  )}
                  
                  {question.section === "Listening Comprehension" && (
                    <div className="mb-4">
                      <p className="text-sm text-gray-500 mb-1">오디오: {question.scriptTitle || '오디오 클립'}</p>
                      <div className="audio-player-container my-2 p-3 bg-gray-100 rounded-lg">
                        <audio controls className="w-full">
                          <source src={question.audioSrc} type="audio/mpeg" />
                          브라우저가 오디오 재생을 지원하지 않습니다.
                        </audio>
                      </div>
                    </div>
                  )}
                  
                  <p className="text-gray-800 mb-4">{question.questionText}</p>
                  
                  <div className="space-y-2">
                    {question.options.map((option: string, optIndex: number) => {
                      const optionValue = parseOptionValue(option)
                      const isUserSelected = userAnswer === optionValue
                      const isCorrectOption = question.answer === optionValue
                      
                      let optionClass = 'border-2 p-3 rounded-lg'
                      
                      if (isUserSelected && isCorrectOption) {
                        optionClass += ' bg-green-100 border-green-500 text-green-800'
                      } else if (isUserSelected && !isCorrectOption) {
                        optionClass += ' bg-red-100 border-red-500 text-red-800'
                      } else if (isCorrectOption) {
                        optionClass += ' bg-green-50 border-green-300 text-green-800'
                      } else {
                        optionClass += ' border-gray-300 text-gray-700'
                      }
                      
                      return (
                        <div key={optIndex} className={optionClass}>
                          {option}
                        </div>
                      )
                    })}
                  </div>
                  
                  {question.explanation && (
                    <div className="mt-4 p-3 bg-blue-50 rounded-lg text-gray-800">
                      <p className="font-medium text-blue-800 mb-1">해설:</p>
                      <p>{question.explanation}</p>
                    </div>
                  )}
                </div>
              )
            })}
          </div>
          
          <div className="mt-8 text-center">
            <Button 
              className="bg-[#4A90E2] hover:bg-[#357ABD]"
              onClick={handleBackToResults}
            >
              결과로 돌아가기
            </Button>
          </div>
        </CardContent>
      </Card>
    </main>
  )
}
