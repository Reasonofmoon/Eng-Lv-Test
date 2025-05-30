'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { loadTestDataFromLocalStorage, loadTestData, saveTestDataToLocalStorage } from '@/lib/data/testDataService'
import { validateQuestion } from '@/lib/data/questions'
import type { TestData, ReadingPassage, ListeningScript } from '@/lib/data/questions'

export default function AdvancedEditorPage() {
  const [testData, setTestData] = useState<TestData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState('reading')
  const [editingPassage, setEditingPassage] = useState<ReadingPassage | null>(null)
  const [editingScript, setEditingScript] = useState<ListeningScript | null>(null)
  const [validationErrors, setValidationErrors] = useState<string[]>([])
  const [successMessage, setSuccessMessage] = useState<string | null>(null)
  const [showAIDialog, setShowAIDialog] = useState(false)
  const [aiPrompt, setAiPrompt] = useState('')
  const [aiResponse, setAiResponse] = useState('')
  const [aiLoading, setAiLoading] = useState(false)

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

  // 새 독해 지문 생성
  const createNewPassage = () => {
    const newId = `R${String(Date.now()).slice(-6)}`
    
    const newPassage: ReadingPassage = {
      id: newId,
      passage_title: "",
      passage_text: "",
      questions: [{
        question_id_in_passage: `${newId}_Q1`,
        question: "",
        options: ["A) ", "B) ", "C) ", "D) "],
        answer: "A",
        explanation: ""
      }]
    }
    
    setEditingPassage(newPassage)
    setEditingScript(null)
    setValidationErrors([])
    setSuccessMessage(null)
  }

  // 새 듣기 스크립트 생성
  const createNewScript = () => {
    const newId = `L${String(Date.now()).slice(-6)}`
    
    const newScript: ListeningScript = {
      id: newId,
      script_title: "",
      script: "",
      audioSrc: "https://example.com/audio.mp3", // 임시 URL
      questions: [{
        question_id_in_script: `${newId}_Q1`,
        question: "",
        options: ["A) ", "B) ", "C) ", "D) "],
        answer: "A",
        explanation: ""
      }]
    }
    
    setEditingScript(newScript)
    setEditingPassage(null)
    setValidationErrors([])
    setSuccessMessage(null)
  }

  // 독해 지문 편집
  const editPassage = (passage: ReadingPassage) => {
    setEditingPassage({...passage})
    setEditingScript(null)
    setValidationErrors([])
    setSuccessMessage(null)
  }

  // 듣기 스크립트 편집
  const editScript = (script: ListeningScript) => {
    setEditingScript({...script})
    setEditingPassage(null)
    setValidationErrors([])
    setSuccessMessage(null)
  }

  // 독해 지문 저장
  const savePassage = () => {
    if (!editingPassage || !testData) return
    
    // 유효성 검증 (간단한 검증만 수행)
    if (!editingPassage.passage_title.trim()) {
      setValidationErrors(['지문 제목은 필수입니다.'])
      return
    }
    
    if (!editingPassage.passage_text.trim()) {
      setValidationErrors(['지문 내용은 필수입니다.'])
      return
    }
    
    if (editingPassage.questions.length === 0) {
      setValidationErrors(['최소 1개 이상의 문제가 필요합니다.'])
      return
    }
    
    // 각 문제 유효성 검증
    for (const question of editingPassage.questions) {
      if (!question.question.trim()) {
        setValidationErrors(['모든 문제는 내용이 있어야 합니다.'])
        return
      }
      
      if (question.options.length < 2) {
        setValidationErrors(['모든 문제는 최소 2개 이상의 선택지가 필요합니다.'])
        return
      }
    }
    
    // 새 지문인지 기존 지문 수정인지 확인
    const isNewPassage = !testData.reading_comprehension
      .some(p => p.id === editingPassage.id)
    
    // 테스트 데이터 복사 및 업데이트
    const updatedTestData = {...testData}
    
    if (isNewPassage) {
      // 새 지문 추가
      updatedTestData.reading_comprehension.push(editingPassage)
    } else {
      // 기존 지문 수정
      const index = updatedTestData.reading_comprehension
        .findIndex(p => p.id === editingPassage.id)
      
      if (index !== -1) {
        updatedTestData.reading_comprehension[index] = editingPassage
      }
    }
    
    // 업데이트된 데이터 저장
    setTestData(updatedTestData)
    saveTestDataToLocalStorage(updatedTestData)
    
    // 성공 메시지 표시
    setSuccessMessage(isNewPassage ? '새 독해 지문이 추가되었습니다.' : '독해 지문이 수정되었습니다.')
    setEditingPassage(null)
    setValidationErrors([])
  }

  // 듣기 스크립트 저장
  const saveScript = () => {
    if (!editingScript || !testData) return
    
    // 유효성 검증 (간단한 검증만 수행)
    if (!editingScript.script_title.trim()) {
      setValidationErrors(['스크립트 제목은 필수입니다.'])
      return
    }
    
    if (!editingScript.script.trim()) {
      setValidationErrors(['스크립트 내용은 필수입니다.'])
      return
    }
    
    if (!editingScript.audioSrc.trim()) {
      setValidationErrors(['오디오 소스는 필수입니다.'])
      return
    }
    
    if (editingScript.questions.length === 0) {
      setValidationErrors(['최소 1개 이상의 문제가 필요합니다.'])
      return
    }
    
    // 각 문제 유효성 검증
    for (const question of editingScript.questions) {
      if (!question.question.trim()) {
        setValidationErrors(['모든 문제는 내용이 있어야 합니다.'])
        return
      }
      
      if (question.options.length < 2) {
        setValidationErrors(['모든 문제는 최소 2개 이상의 선택지가 필요합니다.'])
        return
      }
    }
    
    // 새 스크립트인지 기존 스크립트 수정인지 확인
    const isNewScript = !testData.listening_comprehension
      .some(s => s.id === editingScript.id)
    
    // 테스트 데이터 복사 및 업데이트
    const updatedTestData = {...testData}
    
    if (isNewScript) {
      // 새 스크립트 추가
      updatedTestData.listening_comprehension.push(editingScript)
    } else {
      // 기존 스크립트 수정
      const index = updatedTestData.listening_comprehension
        .findIndex(s => s.id === editingScript.id)
      
      if (index !== -1) {
        updatedTestData.listening_comprehension[index] = editingScript
      }
    }
    
    // 업데이트된 데이터 저장
    setTestData(updatedTestData)
    saveTestDataToLocalStorage(updatedTestData)
    
    // 성공 메시지 표시
    setSuccessMessage(isNewScript ? '새 듣기 스크립트가 추가되었습니다.' : '듣기 스크립트가 수정되었습니다.')
    setEditingScript(null)
    setValidationErrors([])
  }

  // 독해 지문 삭제
  const deletePassage = (passageId: string) => {
    if (!testData) return
    
    // 확인 메시지
    if (!window.confirm('정말 이 독해 지문을 삭제하시겠습니까? 관련된 모든 문제도 함께 삭제됩니다.')) return
    
    // 테스트 데이터 복사 및 업데이트
    const updatedTestData = {...testData}
    updatedTestData.reading_comprehension = updatedTestData.reading_comprehension
      .filter(p => p.id !== passageId)
    
    // 업데이트된 데이터 저장
    setTestData(updatedTestData)
    saveTestDataToLocalStorage(updatedTestData)
    
    // 성공 메시지 표시
    setSuccessMessage('독해 지문이 삭제되었습니다.')
    
    // 현재 편집 중인 지문이 삭제된 지문이면 초기화
    if (editingPassage && editingPassage.id === passageId) {
      setEditingPassage(null)
    }
  }

  // 듣기 스크립트 삭제
  const deleteScript = (scriptId: string) => {
    if (!testData) return
    
    // 확인 메시지
    if (!window.confirm('정말 이 듣기 스크립트를 삭제하시겠습니까? 관련된 모든 문제도 함께 삭제됩니다.')) return
    
    // 테스트 데이터 복사 및 업데이트
    const updatedTestData = {...testData}
    updatedTestData.listening_comprehension = updatedTestData.listening_comprehension
      .filter(s => s.id !== scriptId)
    
    // 업데이트된 데이터 저장
    setTestData(updatedTestData)
    saveTestDataToLocalStorage(updatedTestData)
    
    // 성공 메시지 표시
    setSuccessMessage('듣기 스크립트가 삭제되었습니다.')
    
    // 현재 편집 중인 스크립트가 삭제된 스크립트이면 초기화
    if (editingScript && editingScript.id === scriptId) {
      setEditingScript(null)
    }
  }

  // 독해 지문에 문제 추가
  const addQuestionToPassage = () => {
    if (!editingPassage) return
    
    const newQuestionId = `${editingPassage.id}_Q${editingPassage.questions.length + 1}`
    
    setEditingPassage({
      ...editingPassage,
      questions: [
        ...editingPassage.questions,
        {
          question_id_in_passage: newQuestionId,
          question: "",
          options: ["A) ", "B) ", "C) ", "D) "],
          answer: "A",
          explanation: ""
        }
      ]
    })
  }

  // 듣기 스크립트에 문제 추가
  const addQuestionToScript = () => {
    if (!editingScript) return
    
    const newQuestionId = `${editingScript.id}_Q${editingScript.questions.length + 1}`
    
    setEditingScript({
      ...editingScript,
      questions: [
        ...editingScript.questions,
        {
          question_id_in_script: newQuestionId,
          question: "",
          options: ["A) ", "B) ", "C) ", "D) "],
          answer: "A",
          explanation: ""
        }
      ]
    })
  }

  // 독해 지문에서 문제 삭제
  const removeQuestionFromPassage = (index: number) => {
    if (!editingPassage) return
    
    if (editingPassage.questions.length <= 1) {
      alert('독해 지문에는 최소 1개 이상의 문제가 필요합니다.')
      return
    }
    
    const updatedQuestions = [...editingPassage.questions]
    updatedQuestions.splice(index, 1)
    
    setEditingPassage({
      ...editingPassage,
      questions: updatedQuestions
    })
  }

  // 듣기 스크립트에서 문제 삭제
  const removeQuestionFromScript = (index: number) => {
    if (!editingScript) return
    
    if (editingScript.questions.length <= 1) {
      alert('듣기 스크립트에는 최소 1개 이상의 문제가 필요합니다.')
      return
    }
    
    const updatedQuestions = [...editingScript.questions]
    updatedQuestions.splice(index, 1)
    
    setEditingScript({
      ...editingScript,
      questions: updatedQuestions
    })
  }

  // AI 도우미 대화상자 열기
  const openAIDialog = () => {
    setShowAIDialog(true)
    setAiPrompt('')
    setAiResponse('')
  }

  // AI 응답 생성 (모의 구현)
  const generateAIResponse = () => {
    if (!aiPrompt.trim()) return
    
    setAiLoading(true)
    
    // 실제 구현에서는 API 호출이 필요하지만, 여기서는 모의 응답을 생성
    setTimeout(() => {
      let response = ''
      
      if (aiPrompt.includes('독해') || aiPrompt.includes('지문')) {
        response = `# 독해 지문 예시

제목: 환경 보호의 중요성

현대 사회에서 환경 보호는 더 이상 선택이 아닌 필수가 되었습니다. 지구 온난화, 대기 오염, 해양 오염 등 다양한 환경 문제가 인류의 생존을 위협하고 있기 때문입니다. 특히 플라스틱 쓰레기로 인한 해양 오염은 심각한 수준에 이르렀습니다. 연구에 따르면, 매년 약 800만 톤의 플라스틱이 바다로 유입되고 있으며, 이는 해양 생태계에 치명적인 영향을 미치고 있습니다.

환경 보호를 위한 개인의 작은 실천도 중요합니다. 일회용품 사용 줄이기, 대중교통 이용하기, 에너지 절약하기 등 일상에서의 작은 변화가 모여 큰 차이를 만들 수 있습니다. 또한 정부와 기업의 역할도 중요합니다. 환경 친화적인 정책과 제품 개발은 지속 가능한 발전을 위한 필수 요소입니다.

환경 보호는 현 세대뿐만 아니라 미래 세대를 위한 우리의 책임입니다. 지구는 우리가 잠시 빌려 쓰는 것이며, 더 나은 상태로 다음 세대에게 물려줄 의무가 있습니다.

## 문제 예시:
1. 이 글의 주제로 가장 적절한 것은?
   A) 플라스틱 쓰레기의 위험성
   B) 환경 보호의 중요성과 실천 방안
   C) 정부와 기업의 환경 정책
   D) 지구 온난화의 원인과 결과

2. 글에 따르면, 매년 바다로 유입되는 플라스틱의 양은 약 얼마인가?
   A) 800만 톤
   B) 8000만 톤
   C) 80만 톤
   D) 8억 톤`;
      } else if (aiPrompt.includes('듣기') || aiPrompt.includes('스크립트')) {
        response = `# 듣기 스크립트 예시

제목: 직장 내 의사소통

[남성] 안녕하세요, 오늘 회의에서 마케팅 전략에 대해 논의하고 싶은데요.
[여성] 네, 좋습니다. 제가 준비한 자료가 있어요. 우리 제품의 타겟 고객층에 대한 분석인데, 한번 살펴보시겠어요?
[남성] 물론이죠. 음, 이 데이터를 보니 20대와 30대 초반이 주요 고객층이네요.
[여성] 맞아요. 그리고 온라인 쇼핑을 선호하는 경향이 강해요. 그래서 저는 소셜 미디어 마케팅을 강화하는 것이 좋겠다고 생각해요.
[남성] 좋은 제안이네요. 구체적으로 어떤 플랫폼을 활용할 계획인가요?
[여성] 인스타그램과 유튜브가 가장 효과적일 것 같아요. 특히 인플루언서를 활용한 마케팅이 요즘 트렌드잖아요.
[남성] 동의합니다. 예산은 어느 정도로 생각하고 계신가요?
[여성] 전체 마케팅 예산의 약 30%를 소셜 미디어에 할당하면 좋을 것 같아요.
[남성] 네, 합리적인 것 같습니다. 다음 주 경영진 회의에서 이 안을 제안해 보죠.

## 문제 예시:
1. 여성이 제안한 마케팅 전략은 무엇인가?
   A) TV 광고 캠페인
   B) 소셜 미디어 마케팅 강화
   C) 오프라인 매장 확대
   D) 이메일 마케팅

2. 주요 고객층의 연령대는?
   A) 10대와 20대
   B) 20대와 30대 초반
   C) 30대와 40대
   D) 40대 이상`;
      } else {
        response = `안녕하세요! 영어 능력 테스트 앱의 AI 도우미입니다. 독해 지문이나 듣기 스크립트 작성에 도움이 필요하시면 구체적으로 요청해 주세요. 예를 들어:

1. "초급 수준의 환경 주제 독해 지문을 만들어줘"
2. "비즈니스 미팅 상황의 듣기 스크립트 예시를 제공해줘"
3. "여행 관련 어휘를 테스트하는 문제 5개를 만들어줘"

더 구체적인 요청일수록 더 적합한 내용을 제공해 드릴 수 있습니다.`;
      }
      
      setAiResponse(response)
      setAiLoading(false)
    }, 1500)
  }

  // AI 응답 적용 (독해 지문)
  const applyAIResponseToPassage = () => {
    if (!editingPassage || !aiResponse) return
    
    // 간단한 파싱 로직 (실제 구현에서는 더 정교한 파싱이 필요)
    const lines = aiResponse.split('\n')
    let title = ''
    let text = ''
    let questions = []
    
    let currentSection = 'title'
    
    for (const line of lines) {
      if (line.startsWith('# ')) {
        title = line.replace('# ', '')
        currentSection = 'text'
      } else if (line.startsWith('## 문제 예시:')) {
        currentSection = 'questions'
      } else if (currentSection === 'text' && line.trim()) {
        text += line + '\n'
      } else if (currentSection === 'questions' && line.match(/^\d+\./)) {
        const questionMatch = line.match(/^\d+\.\s+(.+)/)
        if (questionMatch) {
          questions.push({
            question: questionMatch[1],
            options: [],
            answer: '',
            explanation: ''
          })
        }
      } else if (currentSection === 'questions' && line.match(/^\s+[A-D]\)/)) {
        const optionMatch = line.match(/^\s+([A-D])\)\s+(.+)/)
        if (optionMatch && questions.length > 0) {
          const currentQuestion = questions[questions.length - 1]
          currentQuestion.options.push(`${optionMatch[1]}) ${optionMatch[2]}`)
          
          // 첫 번째 옵션을 기본 정답으로 설정
          if (currentQuestion.options.length === 1) {
            currentQuestion.answer = optionMatch[1]
          }
        }
      }
    }
    
    // 업데이트된 지문 설정
    if (title) {
      setEditingPassage({
        ...editingPassage,
        passage_title: title,
        passage_text: text.trim()
      })
    }
    
    // 문제가 파싱되었으면 적용
    if (questions.length > 0) {
      const updatedQuestions = questions.map((q, index) => {
        return {
          question_id_in_passage: `${editingPassage.id}_Q${index + 1}`,
          question: q.question,
          options: q.options.length > 0 ? q.options : ["A) ", "B) ", "C) ", "D) "],
          answer: q.answer || "A",
          explanation: ""
        }
      })
      
      setEditingPassage({
        ...editingPassage,
        passage_title: title || editingPassage.passage_title,
        passage_text: text.trim() || editingPassage.passage_text,
        questions: updatedQuestions
      })
    }
    
    setShowAIDialog(false)
  }

  // AI 응답 적용 (듣기 스크립트)
  const applyAIResponseToScript = () => {
    if (!editingScript || !aiResponse) return
    
    // 간단한 파싱 로직 (실제 구현에서는 더 정교한 파싱이 필요)
    const lines = aiResponse.split('\n')
    let title = ''
    let script = ''
    let questions = []
    
    let currentSection = 'title'
    
    for (const line of lines) {
      if (line.startsWith('# ')) {
        title = line.replace('# ', '')
        currentSection = 'script'
      } else if (line.startsWith('## 문제 예시:')) {
        currentSection = 'questions'
      } else if (currentSection === 'script' && line.trim()) {
        script += line + '\n'
      } else if (currentSection === 'questions' && line.match(/^\d+\./)) {
        const questionMatch = line.match(/^\d+\.\s+(.+)/)
        if (questionMatch) {
          questions.push({
            question: questionMatch[1],
            options: [],
            answer: '',
            explanation: ''
          })
        }
      } else if (currentSection === 'questions' && line.match(/^\s+[A-D]\)/)) {
        const optionMatch = line.match(/^\s+([A-D])\)\s+(.+)/)
        if (optionMatch && questions.length > 0) {
          const currentQuestion = questions[questions.length - 1]
          currentQuestion.options.push(`${optionMatch[1]}) ${optionMatch[2]}`)
          
          // 첫 번째 옵션을 기본 정답으로 설정
          if (currentQuestion.options.length === 1) {
            currentQuestion.answer = optionMatch[1]
          }
        }
      }
    }
    
    // 업데이트된 스크립트 설정
    if (title) {
      setEditingScript({
        ...editingScript,
        script_title: title,
        script: script.trim()
      })
    }
    
    // 문제가 파싱되었으면 적용
    if (questions.length > 0) {
      const updatedQuestions = questions.map((q, index) => {
        return {
          question_id_in_script: `${editingScript.id}_Q${index + 1}`,
          question: q.question,
          options: q.options.length > 0 ? q.options : ["A) ", "B) ", "C) ", "D) "],
          answer: q.answer || "A",
          explanation: ""
        }
      })
      
      setEditingScript({
        ...editingScript,
        script_title: title || editingScript.script_title,
        script: script.trim() || editingScript.script,
        questions: updatedQuestions
      })
    }
    
    setShowAIDialog(false)
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
          <h1 className="text-3xl font-bold text-[#4A90E2]">고급 편집기</h1>
          <div className="flex gap-2">
            <Button variant="outline" onClick={openAIDialog}>
              AI 도우미
            </Button>
            <Button variant="outline" onClick={() => window.history.back()}>
              뒤로 가기
            </Button>
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid grid-cols-2 mb-4">
            <TabsTrigger value="reading">독해 지문</TabsTrigger>
            <TabsTrigger value="listening">듣기 스크립트</TabsTrigger>
          </TabsList>

          <TabsContent value="reading">
            <Card>
              <CardHeader>
                <CardTitle>독해 지문 편집</CardTitle>
              </CardHeader>
              <CardContent>
                {successMessage && (
                  <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
                    {successMessage}
                  </div>
                )}

                {editingPassage ? (
                  <div className="space-y-4 border p-4 rounded-lg">
                    <h3 className="text-lg font-semibold">독해 지문 {editingPassage.id} 편집</h3>
                    
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
                      <div>
                        <Label htmlFor="passage-title">지문 제목</Label>
                        <Input
                          id="passage-title"
                          value={editingPassage.passage_title}
                          onChange={(e) => setEditingPassage({...editingPassage, passage_title: e.target.value})}
                        />
                      </div>
                      
                      <div>
                        <Label htmlFor="passage-text">지문 내용</Label>
                        <Textarea
                          id="passage-text"
                          value={editingPassage.passage_text}
                          onChange={(e) => setEditingPassage({...editingPassage, passage_text: e.target.value})}
                          className="min-h-[200px]"
                        />
                      </div>
                      
                      <div>
                        <div className="flex justify-between items-center mb-2">
                          <Label>문제</Label>
                          <Button variant="outline" size="sm" onClick={addQuestionToPassage}>
                            문제 추가
                          </Button>
                        </div>
                        
                        <div className="space-y-6">
                          {editingPassage.questions.map((question, qIndex) => (
                            <div key={qIndex} className="border p-4 rounded-lg">
                              <div className="flex justify-between items-center mb-2">
                                <h4 className="font-medium">문제 {qIndex + 1}</h4>
                                <Button 
                                  variant="ghost" 
                                  size="sm"
                                  onClick={() => removeQuestionFromPassage(qIndex)}
                                >
                                  삭제
                                </Button>
                              </div>
                              
                              <div className="space-y-3">
                                <div>
                                  <Label htmlFor={`question-${qIndex}`}>문제 내용</Label>
                                  <Input
                                    id={`question-${qIndex}`}
                                    value={question.question}
                                    onChange={(e) => {
                                      const updatedQuestions = [...editingPassage.questions]
                                      updatedQuestions[qIndex].question = e.target.value
                                      setEditingPassage({...editingPassage, questions: updatedQuestions})
                                    }}
                                  />
                                </div>
                                
                                <div>
                                  <Label>선택지</Label>
                                  <div className="space-y-2">
                                    {question.options.map((option, oIndex) => (
                                      <div key={oIndex} className="flex items-center gap-2">
                                        <Input
                                          value={option}
                                          onChange={(e) => {
                                            const updatedQuestions = [...editingPassage.questions]
                                            updatedQuestions[qIndex].options[oIndex] = e.target.value
                                            setEditingPassage({...editingPassage, questions: updatedQuestions})
                                          }}
                                        />
                                        {oIndex > 1 && (
                                          <Button
                                            variant="ghost"
                                            size="icon"
                                            onClick={() => {
                                              const updatedQuestions = [...editingPassage.questions]
                                              updatedQuestions[qIndex].options.splice(oIndex, 1)
                                              setEditingPassage({...editingPassage, questions: updatedQuestions})
                                            }}
                                          >
                                            ✕
                                          </Button>
                                        )}
                                      </div>
                                    ))}
                                    
                                    <Button
                                      variant="outline"
                                      size="sm"
                                      onClick={() => {
                                        const updatedQuestions = [...editingPassage.questions]
                                        const nextLetter = String.fromCharCode(65 + updatedQuestions[qIndex].options.length)
                                        updatedQuestions[qIndex].options.push(`${nextLetter}) `)
                                        setEditingPassage({...editingPassage, questions: updatedQuestions})
                                      }}
                                    >
                                      선택지 추가
                                    </Button>
                                  </div>
                                </div>
                                
                                <div>
                                  <Label htmlFor={`answer-${qIndex}`}>정답</Label>
                                  <select
                                    id={`answer-${qIndex}`}
                                    value={question.answer}
                                    onChange={(e) => {
                                      const updatedQuestions = [...editingPassage.questions]
                                      updatedQuestions[qIndex].answer = e.target.value
                                      setEditingPassage({...editingPassage, questions: updatedQuestions})
                                    }}
                                    className="w-full p-2 border rounded-md"
                                  >
                                    {question.options.map((_, oIndex) => {
                                      const letter = String.fromCharCode(65 + oIndex)
                                      return (
                                        <option key={oIndex} value={letter}>
                                          {letter}
                                        </option>
                                      )
                                    })}
                                  </select>
                                </div>
                                
                                <div>
                                  <Label htmlFor={`explanation-${qIndex}`}>해설</Label>
                                  <Input
                                    id={`explanation-${qIndex}`}
                                    value={question.explanation || ''}
                                    onChange={(e) => {
                                      const updatedQuestions = [...editingPassage.questions]
                                      updatedQuestions[qIndex].explanation = e.target.value
                                      setEditingPassage({...editingPassage, questions: updatedQuestions})
                                    }}
                                  />
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex justify-end gap-2">
                      <Button variant="outline" onClick={() => setEditingPassage(null)}>
                        취소
                      </Button>
                      <Button onClick={savePassage}>
                        저장
                      </Button>
                    </div>
                  </div>
                ) : (
                  <Button onClick={createNewPassage}>
                    새 독해 지문 추가
                  </Button>
                )}
                
                <div className="mt-6">
                  <h3 className="text-lg font-semibold mb-4">독해 지문 목록</h3>
                  <div className="space-y-2">
                    {testData && testData.reading_comprehension.map((passage) => (
                      <div key={passage.id} className="flex justify-between items-center p-3 border rounded-lg hover:bg-gray-50">
                        <div>
                          <p className="font-medium">{passage.passage_title || '(제목 없음)'}</p>
                          <p className="text-sm text-gray-500">
                            ID: {passage.id} | 문제 수: {passage.questions.length}
                          </p>
                        </div>
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm" onClick={() => editPassage(passage)}>
                            편집
                          </Button>
                          <Button variant="destructive" size="sm" onClick={() => deletePassage(passage.id)}>
                            삭제
                          </Button>
                        </div>
                      </div>
                    ))}
                    
                    {testData && testData.reading_comprehension.length === 0 && (
                      <p className="text-gray-500 text-center p-4">
                        등록된 독해 지문이 없습니다.
                      </p>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="listening">
            <Card>
              <CardHeader>
                <CardTitle>듣기 스크립트 편집</CardTitle>
              </CardHeader>
              <CardContent>
                {successMessage && (
                  <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
                    {successMessage}
                  </div>
                )}

                {editingScript ? (
                  <div className="space-y-4 border p-4 rounded-lg">
                    <h3 className="text-lg font-semibold">듣기 스크립트 {editingScript.id} 편집</h3>
                    
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
                      <div>
                        <Label htmlFor="script-title">스크립트 제목</Label>
                        <Input
                          id="script-title"
                          value={editingScript.script_title}
                          onChange={(e) => setEditingScript({...editingScript, script_title: e.target.value})}
                        />
                      </div>
                      
                      <div>
                        <Label htmlFor="script-text">스크립트 내용</Label>
                        <Textarea
                          id="script-text"
                          value={editingScript.script}
                          onChange={(e) => setEditingScript({...editingScript, script: e.target.value})}
                          className="min-h-[200px]"
                        />
                      </div>
                      
                      <div>
                        <Label htmlFor="audio-src">오디오 소스 URL</Label>
                        <Input
                          id="audio-src"
                          value={editingScript.audioSrc}
                          onChange={(e) => setEditingScript({...editingScript, audioSrc: e.target.value})}
                          placeholder="https://example.com/audio.mp3"
                        />
                        <p className="text-sm text-gray-500 mt-1">
                          실제 오디오 파일의 URL을 입력하세요. 테스트를 위해 임시 URL을 사용할 수 있습니다.
                        </p>
                      </div>
                      
                      <div>
                        <div className="flex justify-between items-center mb-2">
                          <Label>문제</Label>
                          <Button variant="outline" size="sm" onClick={addQuestionToScript}>
                            문제 추가
                          </Button>
                        </div>
                        
                        <div className="space-y-6">
                          {editingScript.questions.map((question, qIndex) => (
                            <div key={qIndex} className="border p-4 rounded-lg">
                              <div className="flex justify-between items-center mb-2">
                                <h4 className="font-medium">문제 {qIndex + 1}</h4>
                                <Button 
                                  variant="ghost" 
                                  size="sm"
                                  onClick={() => removeQuestionFromScript(qIndex)}
                                >
                                  삭제
                                </Button>
                              </div>
                              
                              <div className="space-y-3">
                                <div>
                                  <Label htmlFor={`question-${qIndex}`}>문제 내용</Label>
                                  <Input
                                    id={`question-${qIndex}`}
                                    value={question.question}
                                    onChange={(e) => {
                                      const updatedQuestions = [...editingScript.questions]
                                      updatedQuestions[qIndex].question = e.target.value
                                      setEditingScript({...editingScript, questions: updatedQuestions})
                                    }}
                                  />
                                </div>
                                
                                <div>
                                  <Label>선택지</Label>
                                  <div className="space-y-2">
                                    {question.options.map((option, oIndex) => (
                                      <div key={oIndex} className="flex items-center gap-2">
                                        <Input
                                          value={option}
                                          onChange={(e) => {
                                            const updatedQuestions = [...editingScript.questions]
                                            updatedQuestions[qIndex].options[oIndex] = e.target.value
                                            setEditingScript({...editingScript, questions: updatedQuestions})
                                          }}
                                        />
                                        {oIndex > 1 && (
                                          <Button
                                            variant="ghost"
                                            size="icon"
                                            onClick={() => {
                                              const updatedQuestions = [...editingScript.questions]
                                              updatedQuestions[qIndex].options.splice(oIndex, 1)
                                              setEditingScript({...editingScript, questions: updatedQuestions})
                                            }}
                                          >
                                            ✕
                                          </Button>
                                        )}
                                      </div>
                                    ))}
                                    
                                    <Button
                                      variant="outline"
                                      size="sm"
                                      onClick={() => {
                                        const updatedQuestions = [...editingScript.questions]
                                        const nextLetter = String.fromCharCode(65 + updatedQuestions[qIndex].options.length)
                                        updatedQuestions[qIndex].options.push(`${nextLetter}) `)
                                        setEditingScript({...editingScript, questions: updatedQuestions})
                                      }}
                                    >
                                      선택지 추가
                                    </Button>
                                  </div>
                                </div>
                                
                                <div>
                                  <Label htmlFor={`answer-${qIndex}`}>정답</Label>
                                  <select
                                    id={`answer-${qIndex}`}
                                    value={question.answer}
                                    onChange={(e) => {
                                      const updatedQuestions = [...editingScript.questions]
                                      updatedQuestions[qIndex].answer = e.target.value
                                      setEditingScript({...editingScript, questions: updatedQuestions})
                                    }}
                                    className="w-full p-2 border rounded-md"
                                  >
                                    {question.options.map((_, oIndex) => {
                                      const letter = String.fromCharCode(65 + oIndex)
                                      return (
                                        <option key={oIndex} value={letter}>
                                          {letter}
                                        </option>
                                      )
                                    })}
                                  </select>
                                </div>
                                
                                <div>
                                  <Label htmlFor={`explanation-${qIndex}`}>해설</Label>
                                  <Input
                                    id={`explanation-${qIndex}`}
                                    value={question.explanation || ''}
                                    onChange={(e) => {
                                      const updatedQuestions = [...editingScript.questions]
                                      updatedQuestions[qIndex].explanation = e.target.value
                                      setEditingScript({...editingScript, questions: updatedQuestions})
                                    }}
                                  />
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex justify-end gap-2">
                      <Button variant="outline" onClick={() => setEditingScript(null)}>
                        취소
                      </Button>
                      <Button onClick={saveScript}>
                        저장
                      </Button>
                    </div>
                  </div>
                ) : (
                  <Button onClick={createNewScript}>
                    새 듣기 스크립트 추가
                  </Button>
                )}
                
                <div className="mt-6">
                  <h3 className="text-lg font-semibold mb-4">듣기 스크립트 목록</h3>
                  <div className="space-y-2">
                    {testData && testData.listening_comprehension.map((script) => (
                      <div key={script.id} className="flex justify-between items-center p-3 border rounded-lg hover:bg-gray-50">
                        <div>
                          <p className="font-medium">{script.script_title || '(제목 없음)'}</p>
                          <p className="text-sm text-gray-500">
                            ID: {script.id} | 문제 수: {script.questions.length}
                          </p>
                        </div>
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm" onClick={() => editScript(script)}>
                            편집
                          </Button>
                          <Button variant="destructive" size="sm" onClick={() => deleteScript(script.id)}>
                            삭제
                          </Button>
                        </div>
                      </div>
                    ))}
                    
                    {testData && testData.listening_comprehension.length === 0 && (
                      <p className="text-gray-500 text-center p-4">
                        등록된 듣기 스크립트가 없습니다.
                      </p>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
      
      <Dialog open={showAIDialog} onOpenChange={setShowAIDialog}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>AI 도우미</DialogTitle>
            <DialogDescription>
              독해 지문이나 듣기 스크립트 작성에 도움이 필요하신가요? AI 도우미에게 요청해보세요.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            <div>
              <Label htmlFor="ai-prompt">요청 내용</Label>
              <Textarea
                id="ai-prompt"
                value={aiPrompt}
                onChange={(e) => setAiPrompt(e.target.value)}
                placeholder="예: '초급 수준의 환경 주제 독해 지문을 만들어줘' 또는 '비즈니스 미팅 상황의 듣기 스크립트 예시를 제공해줘'"
                className="min-h-[100px]"
              />
            </div>
            
            <div className="flex justify-end">
              <Button 
                onClick={generateAIResponse}
                disabled={aiLoading || !aiPrompt.trim()}
              >
                {aiLoading ? '생성 중...' : '생성하기'}
              </Button>
            </div>
            
            {aiResponse && (
              <div>
                <Label>AI 응답</Label>
                <div className="border p-4 rounded-lg bg-gray-50 max-h-[300px] overflow-y-auto">
                  <pre className="whitespace-pre-wrap font-sans">{aiResponse}</pre>
                </div>
                
                <div className="flex justify-end mt-4 gap-2">
                  <Button variant="outline" onClick={() => setShowAIDialog(false)}>
                    취소
                  </Button>
                  <Button 
                    onClick={activeTab === 'reading' ? applyAIResponseToPassage : applyAIResponseToScript}
                    disabled={!aiResponse || (activeTab === 'reading' ? !editingPassage : !editingScript)}
                  >
                    적용하기
                  </Button>
                </div>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </main>
  )
}
