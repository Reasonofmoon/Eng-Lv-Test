'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { loadTestDataFromLocalStorage, loadTestData, saveTestDataToLocalStorage } from '@/lib/data/testDataService'
import { validateQuestion, QuestionSchema } from '@/lib/data/questions'
import type { TestData, Question } from '@/lib/data/questions'

export default function AdminPage() {
  const [testData, setTestData] = useState<TestData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState('vocabulary')
  const [editingQuestion, setEditingQuestion] = useState<Question | null>(null)
  const [validationErrors, setValidationErrors] = useState<string[]>([])
  const [successMessage, setSuccessMessage] = useState<string | null>(null)

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
        setError('테스트 데이터를 불러오는데 실패했습니다.')
      } finally {
        setLoading(false)
      }
    }
    
    fetchTestData()
  }, [])

  // 새 문항 생성
  const createNewQuestion = (section: string) => {
    const newId = `${section.charAt(0).toUpperCase()}${String(Date.now()).slice(-6)}`
    
    const newQuestion: Question = {
      id: newId,
      question_type: "객관식",
      difficulty: "초급",
      question: "",
      options: ["A) ", "B) ", "C) ", "D) "],
      answer: "A",
      explanation: ""
    }
    
    setEditingQuestion(newQuestion)
    setValidationErrors([])
    setSuccessMessage(null)
  }

  // 문항 편집
  const editQuestion = (question: Question) => {
    setEditingQuestion({...question})
    setValidationErrors([])
    setSuccessMessage(null)
  }

  // 문항 저장
  const saveQuestion = () => {
    if (!editingQuestion || !testData) return
    
    // 유효성 검증
    const validation = validateQuestion(editingQuestion)
    if (!validation.valid) {
      setValidationErrors(validation.errors || ['알 수 없는 오류가 발생했습니다'])
      return
    }
    
    // 새 문항인지 기존 문항 수정인지 확인
    const isNewQuestion = !testData[activeTab as keyof typeof testData]
      .some((q: any) => q.id === editingQuestion.id)
    
    // 테스트 데이터 복사 및 업데이트
    const updatedTestData = {...testData}
    
    if (isNewQuestion) {
      // 새 문항 추가
      if (Array.isArray(updatedTestData[activeTab as keyof typeof updatedTestData])) {
        (updatedTestData[activeTab as keyof typeof updatedTestData] as Question[]).push(editingQuestion)
      }
    } else {
      // 기존 문항 수정
      const index = (updatedTestData[activeTab as keyof typeof updatedTestData] as Question[])
        .findIndex((q: any) => q.id === editingQuestion.id)
      
      if (index !== -1) {
        (updatedTestData[activeTab as keyof typeof updatedTestData] as Question[])[index] = editingQuestion
      }
    }
    
    // 업데이트된 데이터 저장
    setTestData(updatedTestData)
    saveTestDataToLocalStorage(updatedTestData)
    
    // 성공 메시지 표시
    setSuccessMessage(isNewQuestion ? '새 문항이 추가되었습니다.' : '문항이 수정되었습니다.')
    setEditingQuestion(null)
    setValidationErrors([])
  }

  // 문항 삭제
  const deleteQuestion = (questionId: string) => {
    if (!testData) return
    
    // 확인 메시지
    if (!window.confirm('정말 이 문항을 삭제하시겠습니까?')) return
    
    // 테스트 데이터 복사 및 업데이트
    const updatedTestData = {...testData}
    
    if (Array.isArray(updatedTestData[activeTab as keyof typeof updatedTestData])) {
      const questions = updatedTestData[activeTab as keyof typeof updatedTestData] as Question[]
      const filteredQuestions = questions.filter((q: any) => q.id !== questionId)
      updatedTestData[activeTab as keyof typeof updatedTestData] = filteredQuestions as any
    }
    
    // 업데이트된 데이터 저장
    setTestData(updatedTestData)
    saveTestDataToLocalStorage(updatedTestData)
    
    // 성공 메시지 표시
    setSuccessMessage('문항이 삭제되었습니다.')
    
    // 현재 편집 중인 문항이 삭제된 문항이면 초기화
    if (editingQuestion && editingQuestion.id === questionId) {
      setEditingQuestion(null)
    }
  }

  // 옵션 업데이트
  const updateOption = (index: number, value: string) => {
    if (!editingQuestion) return
    
    const updatedOptions = [...editingQuestion.options]
    updatedOptions[index] = value
    
    setEditingQuestion({
      ...editingQuestion,
      options: updatedOptions
    })
  }

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">데이터 로딩 중...</h2>
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
            onClick={() => window.location.reload()}
          >
            새로고침
          </Button>
        </div>
      </div>
    )
  }

  return (
    <main className="flex min-h-screen flex-col p-4 bg-[#F5F5F5]">
      <div className="container mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-[#4A90E2]">관리자 패널</h1>
          <Link href="/">
            <Button variant="outline">홈으로 돌아가기</Button>
          </Link>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid grid-cols-2 md:grid-cols-4 mb-4">
            <TabsTrigger value="vocabulary">어휘</TabsTrigger>
            <TabsTrigger value="grammar">문법</TabsTrigger>
            <TabsTrigger value="reading_comprehension">독해</TabsTrigger>
            <TabsTrigger value="listening_comprehension">듣기</TabsTrigger>
          </TabsList>

          {['vocabulary', 'grammar'].map((section) => (
            <TabsContent key={section} value={section}>
              <Card>
                <CardHeader>
                  <CardTitle>{section === 'vocabulary' ? '어휘 문항' : '문법 문항'}</CardTitle>
                  <CardDescription>
                    {section === 'vocabulary' ? '어휘 관련 문항을 관리합니다.' : '문법 관련 문항을 관리합니다.'}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {successMessage && (
                    <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
                      {successMessage}
                    </div>
                  )}

                  {editingQuestion ? (
                    <div className="space-y-4 border p-4 rounded-lg">
                      <h3 className="text-lg font-semibold">문항 {editingQuestion.id} 편집</h3>
                      
                      {validationErrors.length > 0 && (
                        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                          <p className="font-bold">유효성 검증 오류:</p>
                          <ul className="list-disc list-inside">
                            {validationErrors.map((err, i) => (
                              <li key={i}>{err}</li>
                            ))}
                          </ul>
                        </div>
                      )}
                      
                      <div className="grid gap-4">
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <Label htmlFor="question-type">문제 유형</Label>
                            <Select 
                              value={editingQuestion.question_type} 
                              onValueChange={(value) => setEditingQuestion({...editingQuestion, question_type: value})}
                            >
                              <SelectTrigger>
                                <SelectValue placeholder="문제 유형 선택" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="객관식">객관식</SelectItem>
                                <SelectItem value="어휘 의미 파악">어휘 의미 파악</SelectItem>
                                <SelectItem value="문맥상 어휘 선택">문맥상 어휘 선택</SelectItem>
                                <SelectItem value="문장 완성">문장 완성</SelectItem>
                                <SelectItem value="문법 오류 식별">문법 오류 식별</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          
                          <div>
                            <Label htmlFor="difficulty">난이도</Label>
                            <Select 
                              value={editingQuestion.difficulty} 
                              onValueChange={(value) => setEditingQuestion({...editingQuestion, difficulty: value})}
                            >
                              <SelectTrigger>
                                <SelectValue placeholder="난이도 선택" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="초급">초급</SelectItem>
                                <SelectItem value="중급">중급</SelectItem>
                                <SelectItem value="고급">고급</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        </div>
                        
                        <div>
                          <Label htmlFor="question">문제 내용</Label>
                          <Input
                            id="question"
                            value={editingQuestion.question}
                            onChange={(e) => setEditingQuestion({...editingQuestion, question: e.target.value})}
                            className="h-20"
                          />
                        </div>
                        
                        <div>
                          <Label>선택지</Label>
                          <div className="space-y-2">
                            {editingQuestion.options.map((option, index) => (
                              <div key={index} className="flex items-center gap-2">
                                <Input
                                  value={option}
                                  onChange={(e) => updateOption(index, e.target.value)}
                                />
                                {index > 1 && (
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={() => {
                                      const newOptions = [...editingQuestion.options]
                                      newOptions.splice(index, 1)
                                      setEditingQuestion({...editingQuestion, options: newOptions})
                                    }}
                                  >
                                    ✕
                                  </Button>
                                )}
                              </div>
                            ))}
                            
                            <Button
                              variant="outline"
                              onClick={() => {
                                const newOptions = [...editingQuestion.options]
                                const nextLetter = String.fromCharCode(65 + newOptions.length)
                                newOptions.push(`${nextLetter}) `)
                                setEditingQuestion({...editingQuestion, options: newOptions})
                              }}
                            >
                              선택지 추가
                            </Button>
                          </div>
                        </div>
                        
                        <div>
                          <Label htmlFor="answer">정답</Label>
                          <Select 
                            value={editingQuestion.answer} 
                            onValueChange={(value) => setEditingQuestion({...editingQuestion, answer: value})}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="정답 선택" />
                            </SelectTrigger>
                            <SelectContent>
                              {editingQuestion.options.map((option, index) => {
                                const letter = String.fromCharCode(65 + index)
                                return (
                                  <SelectItem key={index} value={letter}>
                                    {letter}
                                  </SelectItem>
                                )
                              })}
                            </SelectContent>
                          </Select>
                        </div>
                        
                        <div>
                          <Label htmlFor="explanation">해설</Label>
                          <Input
                            id="explanation"
                            value={editingQuestion.explanation || ''}
                            onChange={(e) => setEditingQuestion({...editingQuestion, explanation: e.target.value})}
                            className="h-20"
                          />
                        </div>
                      </div>
                      
                      <div className="flex justify-end gap-2">
                        <Button variant="outline" onClick={() => setEditingQuestion(null)}>
                          취소
                        </Button>
                        <Button onClick={saveQuestion}>
                          저장
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <Button onClick={() => createNewQuestion(section)}>
                      새 문항 추가
                    </Button>
                  )}
                  
                  <div className="mt-6">
                    <h3 className="text-lg font-semibold mb-4">문항 목록</h3>
                    <div className="space-y-2">
                      {testData && testData[section as keyof typeof testData]?.map((question: any) => (
                        <div key={question.id} className="flex justify-between items-center p-3 border rounded-lg hover:bg-gray-50">
                          <div>
                            <p className="font-medium">{question.question.length > 50 ? question.question.substring(0, 50) + '...' : question.question}</p>
                            <p className="text-sm text-gray-500">ID: {question.id} | 난이도: {question.difficulty}</p>
                          </div>
                          <div className="flex gap-2">
                            <Button variant="outline" size="sm" onClick={() => editQuestion(question)}>
                              편집
                            </Button>
                            <Button variant="destructive" size="sm" onClick={() => deleteQuestion(question.id)}>
                              삭제
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          ))}

          <TabsContent value="reading_comprehension">
            <Card>
              <CardHeader>
                <CardTitle>독해 문항</CardTitle>
                <CardDescription>
                  독해 지문 및 관련 문항을 관리합니다.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center p-8">
                  <p className="mb-4">독해 문항은 복잡한 구조를 가지고 있어 별도의 편집기가 필요합니다.</p>
                  <Button>
                    독해 문항 편집기 열기
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="listening_comprehension">
            <Card>
              <CardHeader>
                <CardTitle>듣기 문항</CardTitle>
                <CardDescription>
                  듣기 스크립트 및 관련 문항을 관리합니다.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center p-8">
                  <p className="mb-4">듣기 문항은 오디오 파일 업로드 기능이 필요하여 별도의 편집기가 필요합니다.</p>
                  <Button>
                    듣기 문항 편집기 열기
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </main>
  )
}
