"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { BookOpen, LogIn, AlertCircle, CheckCircle, XCircle } from "lucide-react"
import Link from "next/link"
import { useSession, signOut } from "next-auth/react"
import { Alert, AlertDescription } from "@/components/ui/alert"

export default function HomePage() {
  const { data: session, status, error } = useSession()
  const [mounted, setMounted] = useState(false)
  const [apiTest, setApiTest] = useState<any>(null)

  useEffect(() => {
    setMounted(true)

    // Test API routes
    fetch("/api/test-auth")
      .then((res) => res.json())
      .then((data) => setApiTest(data))
      .catch((err) => setApiTest({ error: err.message }))
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
                  <span className="text-gray-700">Welcome, {session.user?.name}</span>
                  <Button variant="outline" size="sm" onClick={handleSignOut}>
                    Sign Out
                  </Button>
                </div>
              ) : (
                <Button asChild>
                  <Link href="/auth/signin">
                    <LogIn className="h-4 w-4 mr-2" />
                    Sign In
                  </Link>
                </Button>
              )}
            </nav>
          </div>
        </div>
      </header>

      {/* Debug Section */}
      <div className="bg-gray-100 border-b p-4">
        <div className="max-w-7xl mx-auto space-y-4">
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                <div>
                  <strong>Session Status:</strong> {status}
                  {status === "authenticated" && <CheckCircle className="inline h-4 w-4 text-green-500 ml-1" />}
                  {status === "unauthenticated" && <XCircle className="inline h-4 w-4 text-red-500 ml-1" />}
                </div>
                <div>
                  <strong>User:</strong> {session?.user?.email || "None"}
                </div>
                <div>
                  <strong>Role:</strong> {session?.user?.role || "N/A"}
                </div>
              </div>
            </AlertDescription>
          </Alert>

          {apiTest && (
            <Alert variant={apiTest.error ? "destructive" : "default"}>
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                <div className="text-sm">
                  <strong>API Test:</strong> {apiTest.error ? "Failed" : "Success"}
                  {apiTest.env && (
                    <div className="mt-2 space-y-1">
                      <div>NEXTAUTH_URL: {apiTest.env.NEXTAUTH_URL || "NOT SET"}</div>
                      <div>NEXTAUTH_SECRET: {apiTest.env.NEXTAUTH_SECRET}</div>
                      <div>NODE_ENV: {apiTest.env.NODE_ENV}</div>
                    </div>
                  )}
                </div>
              </AlertDescription>
            </Alert>
          )}

          {error && (
            <Alert variant="destructive">
              <XCircle className="h-4 w-4" />
              <AlertDescription>
                <strong>NextAuth Error:</strong> {error}
              </AlertDescription>
            </Alert>
          )}
        </div>
      </div>

      {/* Hero Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-extrabold text-gray-900 sm:text-5xl">
            Test Your English
            <span className="block text-blue-600">Proficiency Level</span>
          </h2>
          <p className="mt-3 max-w-md mx-auto text-base text-gray-500 sm:text-lg md:mt-5 md:text-xl md:max-w-3xl">
            Discover your English language skills with our comprehensive assessment.
          </p>
          <div className="mt-5 max-w-md mx-auto sm:flex sm:justify-center md:mt-8">
            <Button size="lg" asChild>
              <Link href="/test">Start Test Now</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Quick Test Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h3 className="text-2xl font-bold text-gray-900 mb-8">Test Authentication</h3>
            <div className="space-y-4">
              <Button onClick={() => window.open("/api/auth/providers", "_blank")} variant="outline">
                Check Auth Providers
              </Button>
              <Button onClick={() => window.open("/api/auth/session", "_blank")} variant="outline">
                Check Session Endpoint
              </Button>
              <Button onClick={() => window.open("/api/test-auth", "_blank")} variant="outline">
                Test API Routes
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
