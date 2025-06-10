"use client"

import { Suspense } from "react"
import { useSearchParams } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertTriangle, RefreshCw, Home, LogIn } from "lucide-react"
import Link from "next/link"

function ErrorContent() {
  const searchParams = useSearchParams()
  const error = searchParams.get("error")

  const getErrorMessage = (errorCode: string | null) => {
    switch (errorCode) {
      case "Configuration":
        return {
          title: "Configuration Error",
          message: "There is a problem with the server configuration. Please contact support.",
          suggestion: "This is usually a temporary issue. Please try again later.",
        }
      case "AccessDenied":
        return {
          title: "Access Denied",
          message: "You do not have permission to access this resource.",
          suggestion: "Please contact an administrator if you believe this is an error.",
        }
      case "Verification":
        return {
          title: "Verification Error",
          message: "The verification link may have expired or has already been used.",
          suggestion: "Please request a new verification link.",
        }
      case "CredentialsSignin":
        return {
          title: "Invalid Credentials",
          message: "The email or password you entered is incorrect.",
          suggestion: "Please check your credentials and try again.",
        }
      case "SessionRequired":
        return {
          title: "Session Required",
          message: "You must be signed in to access this page.",
          suggestion: "Please sign in to continue.",
        }
      case "Callback":
        return {
          title: "Callback Error",
          message: "There was an error in the authentication callback.",
          suggestion: "Please try signing in again.",
        }
      default:
        return {
          title: "Authentication Error",
          message: "An unexpected error occurred during authentication.",
          suggestion: "Please try again or contact support if the problem persists.",
        }
    }
  }

  const errorInfo = getErrorMessage(error)

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 px-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mb-4">
            <AlertTriangle className="h-6 w-6 text-red-600" />
          </div>
          <CardTitle className="text-2xl text-red-600">{errorInfo.title}</CardTitle>
          <CardDescription>Authentication failed</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Error Details */}
          <Alert variant="destructive">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              <div className="space-y-2">
                <p className="font-medium">{errorInfo.message}</p>
                <p className="text-sm">{errorInfo.suggestion}</p>
                {error && <p className="text-xs font-mono bg-red-50 p-2 rounded">Error Code: {error}</p>}
              </div>
            </AlertDescription>
          </Alert>

          {/* Demo Credentials */}
          <Alert>
            <LogIn className="h-4 w-4" />
            <AlertDescription>
              <div className="space-y-2">
                <p className="font-medium">Demo Credentials:</p>
                <div className="text-sm space-y-1 font-mono">
                  <p>📧 admin@englishtest.com</p>
                  <p>🔑 password123</p>
                  <hr className="my-2" />
                  <p>📧 teacher@englishtest.com</p>
                  <p>🔑 password123</p>
                  <hr className="my-2" />
                  <p>📧 student@englishtest.com</p>
                  <p>🔑 password123</p>
                </div>
              </div>
            </AlertDescription>
          </Alert>

          {/* Action Buttons */}
          <div className="flex flex-col space-y-3">
            <Button asChild className="w-full">
              <Link href="/auth/signin">
                <RefreshCw className="h-4 w-4 mr-2" />
                Try Again
              </Link>
            </Button>
            <Button variant="outline" asChild className="w-full">
              <Link href="/">
                <Home className="h-4 w-4 mr-2" />
                Back to Home
              </Link>
            </Button>
          </div>

          {/* Troubleshooting */}
          <div className="text-sm text-gray-600 bg-gray-50 p-3 rounded-lg">
            <p className="font-medium mb-2">💡 Troubleshooting Tips:</p>
            <ul className="list-disc list-inside space-y-1 text-xs">
              <li>Double-check your email and password</li>
              <li>Make sure your account is active</li>
              <li>Try refreshing the page</li>
              <li>Clear your browser cache if issues persist</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default function AuthErrorPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      }
    >
      <ErrorContent />
    </Suspense>
  )
}
