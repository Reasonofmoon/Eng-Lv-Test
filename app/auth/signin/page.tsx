"use client"

import type React from "react"

import { useState } from "react"
import { signIn } from "next-auth/react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Lock, Mail, AlertCircle, Loader2 } from "lucide-react"
import Link from "next/link"

export default function SignInPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [debugInfo, setDebugInfo] = useState<any>(null)

  const router = useRouter()

  const fillDemoCredentials = (userType: "admin" | "teacher" | "student") => {
    setEmail(`${userType}@englishtest.com`)
    setPassword("password123")
    setError("")
  }

  const testAuthEndpoint = async () => {
    try {
      const response = await fetch("/api/auth/providers")
      const data = await response.text()
      setDebugInfo({ providers: data.substring(0, 200) + "..." })
    } catch (err: any) {
      setDebugInfo({ error: err.message })
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    try {
      console.log("Attempting sign in with:", email)

      const result = await signIn("credentials", {
        email: email.trim(),
        password,
        redirect: false,
      })

      console.log("Sign in result:", result)

      if (result?.error) {
        setError(`Authentication failed: ${result.error}`)
      } else if (result?.ok) {
        router.push("/")
        router.refresh()
      } else {
        setError("Unknown authentication error occurred")
      }
    } catch (error: any) {
      console.error("Sign in error:", error)
      setError(`Sign in failed: ${error.message}`)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 px-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-4">
            <Lock className="h-6 w-6 text-blue-600" />
          </div>
          <CardTitle className="text-2xl">Sign In</CardTitle>
          <CardDescription>Test authentication system</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {debugInfo && (
            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                <pre className="text-xs">{JSON.stringify(debugInfo, null, 2)}</pre>
              </AlertDescription>
            </Alert>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-10"
                  required
                  disabled={isLoading}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  id="password"
                  type="password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-10"
                  required
                  disabled={isLoading}
                />
              </div>
            </div>

            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Signing in...
                </>
              ) : (
                "Sign In"
              )}
            </Button>
          </form>

          {/* Demo Credentials */}
          <div className="space-y-3">
            <p className="text-sm font-medium text-center text-gray-700">Demo Accounts:</p>
            <div className="grid grid-cols-3 gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => fillDemoCredentials("admin")}
                disabled={isLoading}
                className="text-xs"
              >
                Admin
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => fillDemoCredentials("teacher")}
                disabled={isLoading}
                className="text-xs"
              >
                Teacher
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => fillDemoCredentials("student")}
                disabled={isLoading}
                className="text-xs"
              >
                Student
              </Button>
            </div>
          </div>

          {/* Debug Tools */}
          <div className="space-y-2">
            <Button variant="outline" size="sm" onClick={testAuthEndpoint} className="w-full text-xs">
              Test Auth Endpoint
            </Button>
          </div>

          <div className="text-center">
            <Link href="/" className="text-sm text-blue-600 hover:underline">
              ← Back to Home
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
