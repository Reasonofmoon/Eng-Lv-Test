"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { BookOpen, LogIn, AlertCircle, CheckCircle, XCircle, Key, Server } from "lucide-react"
import Link from "next/link"
import { useSession, signOut } from "next-auth/react"
import { Alert, AlertDescription } from "@/components/ui/alert"

export default function HomePage() {
  const { data: session, status, error } = useSession()
  const [mounted, setMounted] = useState(false)
  const [debugInfo, setDebugInfo] = useState<any>(null)

  useEffect(() => {
    setMounted(true)

    // 환경 변수 확인
    fetch("/api/debug")
      .then((res) => res.json())
      .then((data) => setDebugInfo(data))
      .catch((err) => setDebugInfo({ error: err.message }))
  }, [])

  const handleSignOut = () => {
    signOut({ callbackUrl: "/" })
  }

  if (!mounted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center">
              <BookOpen className="h-8 w-8 text-blue-600 mr-3" />
              <h1 className="text-2xl font-bold text-gray-900">English Level Test</h1>
            </div>
            <nav className="flex items-center space-x-4">
              {status === "loading" ? (
                <div className="animate-pulse bg-gray-200 h-8 w-20 rounded"></div>
              ) : session ? (
                <div className="flex items-center space-x-4">
                  <span className="text-gray-700">환영합니다, {session.user?.name}</span>
                  <Button variant="outline" size="sm" onClick={handleSignOut}>
                    로그아웃
                  </Button>
                </div>
              ) : (
                <Button asChild>
                  <Link href="/auth/signin">
                    <LogIn className="h-4 w-4 mr-2" />
                    로그인
                  </Link>
                </Button>
              )}
            </nav>
          </div>
        </div>
      </header>

      {/* 디버그 정보 */}
      <div className="bg-gray-100 border-b p-4">
        <div className="max-w-7xl mx-auto space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Key className="h-5 w-5" />
                NextAuth 키 설정 상태
              </CardTitle>
            </CardHeader>
            <CardContent>
              {debugInfo ? (
                <div className="space-y-3">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex items-center gap-2">
                      <span className="font-medium">NEXTAUTH_SECRET:</span>
                      <span
                        className={
                          debugInfo.environment?.NEXTAUTH_SECRET?.includes("✅") ? "text-green-600" : "text-red-600"
                        }
                      >
                        {debugInfo.environment?.NEXTAUTH_SECRET}
                      </span>
                      {debugInfo.environment?.secretLength && (
                        <span className="text-sm text-gray-500">({debugInfo.environment.secretLength}자)</span>
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="font-medium">NEXTAUTH_URL:</span>
                      <span
                        className={
                          debugInfo.environment?.NEXTAUTH_URL?.includes("❌") ? "text-red-600" : "text-green-600"
                        }
                      >
                        {debugInfo.environment?.NEXTAUTH_URL}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="font-medium">NODE_ENV:</span>
                      <span className="text-blue-600">{debugInfo.environment?.NODE_ENV}</span>
                    </div>
                  </div>

                  <Alert variant={debugInfo.environment?.NEXTAUTH_SECRET?.includes("❌") ? "destructive" : "default"}>
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>
                      {debugInfo.environment?.NEXTAUTH_SECRET?.includes("❌") ? (
                        <div>
                          <strong>❌ NEXTAUTH_SECRET이 설정되지 않았습니다!</strong>
                          <br />
                          .env.local 파일에 NEXTAUTH_SECRET을 추가하세요.
                        </div>
                      ) : (
                        <div>
                          <strong>✅ NextAuth 키가 올바르게 설정되었습니다!</strong>
                          <br />키 길이: {debugInfo.environment?.secretLength}자
                        </div>
                      )}
                    </AlertDescription>
                  </Alert>
                </div>
              ) : (
                <div className="animate-pulse">환경 변수 확인 중...</div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Server className="h-5 w-5" />
                인증 상태
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="flex items-center gap-2">
                  <span className="font-medium">세션 상태:</span>
                  <span
                    className={`flex items-center gap-1 ${
                      status === "authenticated"
                        ? "text-green-600"
                        : status === "unauthenticated"
                          ? "text-red-600"
                          : "text-yellow-600"
                    }`}
                  >
                    {status === "authenticated" && <CheckCircle className="h-4 w-4" />}
                    {status === "unauthenticated" && <XCircle className="h-4 w-4" />}
                    {status === "loading" && <AlertCircle className="h-4 w-4" />}
                    {status}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-medium">사용자:</span>
                  <span>{session?.user?.email || "없음"}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-medium">역할:</span>
                  <span>{session?.user?.role || "없음"}</span>
                </div>
              </div>

              {error && (
                <Alert variant="destructive" className="mt-4">
                  <XCircle className="h-4 w-4" />
                  <AlertDescription>
                    <strong>NextAuth 오류:</strong> {error}
                  </AlertDescription>
                </Alert>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Hero Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-extrabold text-gray-900 sm:text-5xl">
            영어 실력을
            <span className="block text-blue-600">테스트하세요</span>
          </h2>
          <p className="mt-3 max-w-md mx-auto text-base text-gray-500 sm:text-lg md:mt-5 md:text-xl md:max-w-3xl">
            포괄적인 평가를 통해 영어 실력을 확인하고 개선하세요.
          </p>
          <div className="mt-5 max-w-md mx-auto sm:flex sm:justify-center md:mt-8">
            <Button size="lg" asChild>
              <Link href="/test">테스트 시작하기</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* 테스트 계정 정보 */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h3 className="text-2xl font-bold text-gray-900 mb-8">테스트 계정</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">관리자 계정</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 text-sm">
                    <div>
                      <strong>이메일:</strong> admin@englishtest.com
                    </div>
                    <div>
                      <strong>비밀번호:</strong> password123
                    </div>
                    <div>
                      <strong>권한:</strong> 모든 기능 접근
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">교사 계정</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 text-sm">
                    <div>
                      <strong>이메일:</strong> teacher@englishtest.com
                    </div>
                    <div>
                      <strong>비밀번호:</strong> password123
                    </div>
                    <div>
                      <strong>권한:</strong> 문제 관리, 결과 확인
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">학생 계정</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 text-sm">
                    <div>
                      <strong>이메일:</strong> student@englishtest.com
                    </div>
                    <div>
                      <strong>비밀번호:</strong> password123
                    </div>
                    <div>
                      <strong>권한:</strong> 테스트 응시
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
