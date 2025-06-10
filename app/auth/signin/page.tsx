"use client"

import { useState } from "react"
import { signIn, getSession } from "next-auth/react"
import { useRouter, useSearchParams } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Eye, EyeOff, Lock, Mail, AlertCircle, Loader2 } from "lucide-react"
import Link from "next/link"

export default function SignInPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")

  const router = useRouter()
  const searchParams = useSearchParams()
  const callbackUrl = searchParams.get("callbackUrl") || "/"
  const errorParam = searchParams.get("error")

  // Handle URL error parameter
  const useEffect = window.React.useEffect
  useEffect(() => {
    if (errorParam) {
      switch (errorParam) {
        case "CredentialsSignin":
          setError("Invalid email or password. Please try again.")
          break
        case "AccessDenied":
          setError("Access denied. You don't have permission to access this resource.")
          break
        case "Configuration":
          setError("Server configuration error. Please contact support.")
          break
        default:
          setError("An authentication error occurred. Please try again.")
      }
    }
  }, [errorParam])

  const handleSubmit = async (e) => {
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
        console.error("Sign in error:", result.error)
        switch (result.error) {
          case "CredentialsSignin":
            setError("Invalid email or password. Please check your credentials.")
            break
          case "AccessDenied":
            setError("Access denied. Your account may be inactive.")
            break
          default:
            setError("Authentication failed. Please try again.")
        }
      } else if (result?.ok) {
        console.log("Sign in successful, getting session...")

        // Get updated session to check role
        const session = await getSession()
        console.log("Session:", session)

        if (session?.user) {
          // Redirect based on user role
          if (session.user.role === "admin" || session.user.role === "teacher") {
            router.push("/admin")
          } else {
            router.push(callbackUrl)
          }
        } else {
          router.push(callbackUrl)
        }
      } else {
        setError("An unexpected error occurred. Please try again.")
      }
    } catch (error) {
      console.error("Sign in exception:", error)
      setError("Network error. Please check your connection and try again.")
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
          <CardDescription>Enter your credentials to access the English Level Test platform</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

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
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-10 pr-10"
                  required
                  disabled={isLoading}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
                  disabled={isLoading}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
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

          <div className="mt-6 text-center text-sm text-gray-600">
            <p className="font-medium mb-2">Demo Credentials:</p>
            <div className="space-y-1 text-xs bg-gray-50 p-3 rounded-lg">
              <p>
                <strong>Admin:</strong> admin@englishtest.com / password123
              </p>
              <p>
                <strong>Teacher:</strong> teacher@englishtest.com / password123
              </p>
              <p>
                <strong>Student:</strong> student@englishtest.com / password123
              </p>
            </div>
          </div>

          <div className="mt-6 text-center">
            <Link href="/" className="text-sm text-blue-600 hover:underline">
              Back to Home
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
