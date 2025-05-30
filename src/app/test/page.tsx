'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { loadTestDataFromLocalStorage, loadTestData } from '@/lib/data/testDataService'
import { parseOptionValue } from '@/lib/data/questions'
import type { TestData } from '@/lib/data/questions'

export default function TestPage() {
  const router = useRouter()
  const [testData, setTestData] = useState<TestData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  
  const [allQuestions, setAllQuestions] = useState<any[]>([])
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [userAnswers, setUserAnswers] = useState<(string | null)[]>([])
  const [timeRemaining, setTimeRemaining] = useState(0)
  const [totalTestTime, setTotalTestTime] = useState(0)
  const [showSubmitDialog, setShowSubmitDialog] = useState(false)
  const [isEarlyExit, setIsEarlyExit] = useState(false)
  
  // 테스트 데이터 로드
  useEffect(() => {
    async function fetchTestData() {
      try {
        // 먼저 로컬 스토리지에서 시도
        const localData = loadTestDataFromLocalStorage()
        if (localData) {
          setTestData(localData)
          return
        }
        
        // 로컬 스토리지에 없으면 서버에서 로드
        const data = await loadTestData()
        setTestData(data)
      } catch (err) {
        console.error('테스트 데이터 로드 실패:', err)
        setError('테스트 데이터를 불러오는데 실패했습니다. 페이지를 새로고침 해주세요.')
      } finally {
        setLoading(false)
      }
    }
    
    fetchTestData()
  }, [])
  
  // 테스트 데이터가 로드되면 문제 준비
  useEffect(() => {
    if (!testData) return
    
    const prepared: any[] = []
    const { vocabulary, grammar, reading_comprehension, listening_comprehension } = testData
    
    vocabulary.forEach(q => prepared.push({ ...q, questionText: q.question, section: "Vocabulary" }))
    grammar.forEach(q => prepared.push({ ...q, questionText: q.question, section: "Grammar" }))
    
    reading_comprehension.forEach(passage => {
      passage.questions.forEach(q => {
        prepared.push({
          ...q,
          id: q.question_id_in_passage,
          questionText: q.question,
          passageTitle: passage.passage_title,
          passageText: passage.passage_text,
          section: "Reading Comprehension"
        })
      })
    })
    
    listening_comprehension.forEach(script => {
      script.questions.forEach(q => {
        prepared.push({
          ...q,
          id: q.question_id_in_script,
          questionText: q.question,
          scriptTitle: script.script_title,
          scriptText: script.script,
          audioSrc: script.audioSrc,
          section: "Listening Comprehension"
        })
      })
    })
    
    setAllQuestions(prepared)
    setUserAnswers(new Array(prepared.length).fill(null))
    
    // 테스트 시간 설정
    const minutes = testData.testSettings?.totalTimeMinutes || 40
    setTotalTestTime(minutes * 60)
    setTimeRemaining(minutes * 60)
  }, [testData])
  
  // 타이머 설정
  useEffect(() => {
    if (timeRemaining <= 0 || !allQuestions.length) return
    
    const timer = setInterval(() => {
      setTimeRemaining(prev => {
        if (prev <= 1) {
          clearInterval(timer)
          handleSubmitTest()
          return 0
        }
        return prev - 1
      })
    }, 1000)
    
    return () => clearInterval(timer)
  }, [timeRemaining, allQuestions.length])
  
  // 현재 문제 표시
  const currentQuestion = allQuestions[currentQuestionIndex]
  
  // 옵션 선택 처리
  const handleOptionSelect = (optionValue: string) => {
    const newAnswers = [...userAnswers]
    newAnswers[currentQuestionIndex] = optionValue
    setUserAnswers(newAnswers)
  }
  
  // 다음 문제로 이동
  const handleNextQuestion = () => {
    if (currentQuestionIndex < allQuestions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1)
    } else {
      setIsEarlyExit(false)
      setShowSubmitDialog(true)
    }
  }
  
  // 이전 문제로 이동
  const handlePrevQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1)
    }
  }
  
  // 테스트 조기 종료 확인
  const handleEndTestEarly = () => {
    setIsEarlyExit(true)
    setShowSubmitDialog(true)
  }
  
  // 테스트 제출 처리
  const handleSubmitTest = () => {
    // 결과 계산 및 저장
    const score = userAnswers.reduce((total, answer, index) => {
      if (answer !== null && answer === allQuestions[index].answer) {
        return total + 1
      }
      return total
    }, 0)
    
    // 섹션별 점수 계산
    const sectionScores: Record<string, { score: number, total: number, percentage: number }> = {}
    const sectionTotals: Record<string, number> = {}
    
    testData?.testSettings.sections.forEach(secName => {
      sectionScores[secName] = { score: 0, total: 0, percentage: 0 }
      sectionTotals[secName] = 0
    })
    
    allQuestions.forEach((q, index) => {
      sectionTotals[q.section]++
      if (userAnswers[index] !== null && userAnswers[index] === q.answer) {
        sectionScores[q.section].score++
      }
    })
    
    Object.keys(sectionScores).forEach(section => {
      sectionScores[section].total = sectionTotals[section]
      sectionScores[section].percentage = sectionTotals[section] > 0 
        ? Math.round((sectionScores[section].score / sectionTotals[section]) * 100) 
        : 0
    })
    
    // 결과 저장 및 결과 페이지로 이동
    localStorage.setItem('testResults', JSON.stringify({
      score,
      totalQuestions: allQuestions.length,
      userAnswers,
      allQuestions,
      sectionScores,
      timeSpent: totalTestTime - timeRemaining
    }))
    
    router.push('/results')
  }
  
  // 시간 포맷팅 함수
  const formatTime = (seconds: number) => {
    if (seconds < 0) seconds = 0
    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = seconds % 60
    return `${String(minutes).padStart(2, '0')}:${String(remainingSeconds).padStart(2, '0')}`
  }
  
  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">테스트 로딩 중...</h2>
          <Progress value={30} className="w-60" />
        </div>
      </div>
    )
  }
  
  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center text-red-500 p-8">
          <h2 className="text-2xl font-bold mb-4">오류 발생</h2>
          <p>{error}</p>
          <Button 
            className="mt-4" 
            onClick={() => router.push('/')}
          >
            홈으로 돌아가기
          </Button>
        </div>
      </div>
    )
  }
  
  if (!currentQuestion) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">테스트 준비 중...</h2>
          <Button 
            className="mt-4" 
            onClick={() => router.push('/')}
          >
            홈으로 돌아가기
          </Button>
        </div>
      </div>
    )
  }
  
  const progressPercentage = ((currentQuestionIndex + 1) / allQuestions.length) * 100
  
  return (
    <main className="flex min-h-screen flex-col p-4 bg-[#F5F5F5]">
      <div className="sticky top-0 z-10 bg-white/80 backdrop-blur-md p-4 mb-6 rounded-b-xl shadow-lg flex justify-between items-center">
        <div>
          <span className="font-semibold text-[#4A90E2] text-lg">{currentQuestion.section}</span>
        </div>
        <div className="flex items-center space-x-4">
          <div className={`text-xl font-bold px-3 py-1 rounded-md ${
            timeRemaining <= totalTestTime * 0.1 
              ? 'text-red-500 animate-pulse bg-red-100' 
              : timeRemaining <= totalTestTime * 0.25 
                ? 'text-orange-500 bg-orange-100' 
                : 'text-gray-700 bg-gray-200'
          }`}>
            {formatTime(timeRemaining)}
          </div>
          <div className="text-sm text-gray-600">
            문제 {currentQuestionIndex + 1}/{allQuestions.length}
          </div>
        </div>
        <Button 
          variant="destructive" 
          size="sm"
          onClick={handleEndTestEarly}
        >
          테스트 종료
        </Button>
      </div>
      
      <div className="w-full h-2 bg-gray-200 rounded-full mb-6 overflow-hidden">
        <div 
          className="h-full bg-[#50E3C2] transition-all duration-300 ease-linear"
          style={{ width: `${progressPercentage}%` }}
        ></div>
      </div>
      
      <Card className="bg-white p-6 md:p-8 rounded-xl shadow-2xl flex-grow mb-6">
        <CardHeader>
          <CardTitle className="text-xl md:text-2xl font-semibold text-gray-800">
            문제 {currentQuestionIndex + 1} / {allQuestions.length}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {currentQuestion.section === "Reading Comprehension" ? (
            <div className="md:flex md:space-x-6">
              <div className="md:w-1/2 mb-4 md:mb-0 max-h-[300px] md:max-h-[500px] overflow-y-auto p-3 border rounded-lg bg-gray-50">
                <h3 className="text-lg font-semibold text-[#4A90E2] mb-2">{currentQuestion.passageTitle}</h3>
                <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-line">{currentQuestion.passageText}</p>
              </div>
              <div className="md:w-1/2">
                <p className="text-lg text-gray-700 mb-4 leading-relaxed">{currentQuestion.questionText}</p>
                <div className="space-y-3">
                  {currentQuestion.options.map((option: string, index: number) => {
                    const optionValue = parseOptionValue(option);
                    const isSelected = userAnswers[currentQuestionIndex] === optionValue;
                    
                    return (
                      <div 
                        key={index}
                        onClick={() => handleOptionSelect(optionValue)}
                        className={`border-2 p-4 rounded-lg text-gray-700 hover:border-[#4A90E2] cursor-pointer transition-all ${
                          isSelected 
                            ? 'bg-[#4A90E2] border-[#357ABD] text-white transform translate-y-[-2px] shadow-md' 
                            : 'border-gray-300'
                        }`}
                      >
                        {option}
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          ) : currentQuestion.section === "Listening Comprehension" ? (
            <div>
              <p className="text-lg text-gray-700 mb-4 leading-relaxed">{currentQuestion.questionText || "오디오를 듣고 질문에 답하세요."}</p>
              <p className="text-sm text-gray-500 mb-1">오디오: {currentQuestion.scriptTitle || '오디오 클립'}</p>
              
              <div className="audio-player-container my-4 p-4 bg-gray-100 rounded-lg shadow flex items-center space-x-3">
                <audio controls className="w-full">
                  <source src={currentQuestion.audioSrc} type="audio/mpeg" />
                  브라우저가 오디오 재생을 지원하지 않습니다.
                </audio>
              </div>
              
              <div className="space-y-3 mt-4">
                {currentQuestion.options.map((option: string, index: number) => {
                  const optionValue = parseOptionValue(option);
                  const isSelected = userAnswers[currentQuestionIndex] === optionValue;
                  
                  return (
                    <div 
                      key={index}
                      onClick={() => handleOptionSelect(optionValue)}
                      className={`border-2 p-4 rounded-lg text-gray-700 hover:border-[#4A90E2] cursor-pointer transition-all ${
                        isSelected 
                          ? 'bg-[#4A90E2] border-[#357ABD] text-white transform translate-y-[-2px] shadow-md' 
                          : 'border-gray-300'
                      }`}
                    >
                      {option}
                    </div>
                  );
                })}
              </div>
            </div>
          ) : (
            <div>
              <p className="text-lg text-gray-700 mb-6 leading-relaxed">{currentQuestion.questionText}</p>
              <div className="space-y-3">
                {currentQuestion.options.map((option: string, index: number) => {
                  const optionValue = parseOptionValue(option);
                  const isSelected = userAnswers[currentQuestionIndex] === optionValue;
                  
                  return (
                    <div 
                      key={index}
                      onClick={() => handleOptionSelect(optionValue)}
                      className={`border-2 p-4 rounded-lg text-gray-700 hover:border-[#4A90E2] cursor-pointer transition-all ${
                        isSelected 
                          ? 'bg-[#4A90E2] border-[#357ABD] text-white transform translate-y-[-2px] shadow-md' 
                          : 'border-gray-300'
                      }`}
                    >
                      {option}
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
      
      <div className="flex justify-between items-center mt-auto pt-4">
        <Button
          variant="secondary"
          onClick={handlePrevQuestion}
          disabled={currentQuestionIndex === 0}
          className={currentQuestionIndex === 0 ? 'opacity-50 cursor-not-allowed' : ''}
        >
          이전 문제
        </Button>
        
        <Button
          onClick={handleNextQuestion}
          className={currentQuestionIndex === allQuestions.length - 1 
            ? 'bg-[#F5A623] hover:bg-[#d98e1f]' 
            : 'bg-[#4A90E2] hover:bg-[#357ABD]'}
        >
          {currentQuestionIndex === allQuestions.length - 1 ? '테스트 제출' : '다음 문제'}
        </Button>
      </div>
      
      <Dialog open={showSubmitDialog} onOpenChange={setShowSubmitDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>제출 확인</DialogTitle>
            <DialogDescription>
              {isEarlyExit 
                ? "정말 테스트를 종료하시겠습니까? 현재까지의 진행 상황이 채점됩니다."
                : "테스트를 제출하시겠습니까? 제출 후에는 답변을 변경할 수 없습니다."}
            </DialogDescription>
          </DialogHeader>
          <div className="text-sm text-gray-500 mb-6">
            남은 시간: {formatTime(timeRemaining)}
          </div>
          <DialogFooter className="flex justify-around">
            <Button variant="outline" onClick={() => setShowSubmitDialog(false)}>
              취소
            </Button>
            <Button variant="destructive" onClick={handleSubmitTest}>
              제출
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </main>
  )
}
