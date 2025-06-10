"use client"

import { useSearchParams } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertTriangle, RefreshCw, Home, LogIn } from "lucide-react"
import Link from "next/link"
import { useEffect, useState } from "react"

const errorMessages = {
  Configuration: "There is a problem with the server configuration. Please contact support.",
  AccessDenied: "You do not have permission to access this resource.",
  Verification: "The verification link may have expired or has already been used.",
  Default: "An unexpected error occurred during authentication.",
  CredentialsSignin: "Invalid email or password. Please check your credentials and try again.",
  SessionRequired: "You must be signed in to access this page.",
  Callback: "There was an error in the authentication callback.",
  OAuthSignin: "Error in constructing an authorization URL.",
  OAuthCallback: "Error in handling the response from an OAuth provider.",
  OAuthCreateAccount: "Could not create OAuth account in the database.",
  EmailCreateAccount: "Could not create email provider account in the database.",
  OAuthAccountNotLinked: "To confirm your identity, sign in with the same account you used originally.",
}

export default function AuthErrorPage() {
  const searchParams = useSearchParams()
  const [error, setError] = useState<string | null>(null)
  const [errorDetails, setErrorDetails] = useState<string>("")

  useEffect(() => {
    const errorParam = searchParams.get("error")
    setError(errorParam)

    if (errorParam) {
      const message = errorMessages[errorParam as keyof typeof errorMessages] || errorMessages.Default
      setErrorDetails(message)
    } else {
      setErrorDetails("An unknown authentication error occurred.")
    }
  }, [searchParams])

  const handleRetry = () => {
    // Clear any cached authentication state
    if (typeof window !== "undefined") {
      window.location.href = "/auth/signin"
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 px-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mb-4">
            <AlertTriangle className="h-6 w-6 text-red-600" />
          </div>
          <CardTitle className="text-2xl text-red-600">Authentication Error</CardTitle>
          <CardDescription>There was a problem signing you in</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Error Details */}
          <Alert variant="destructive">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              <div className="space-y-2">
                <p className="font-medium">Error: {error || "Unknown"}</p>
                <p className="text-sm">{errorDetails}</p>
              </div>
            </AlertDescription>
          </Alert>

          {/* Demo Credentials Reminder */}
          <Alert>
            <LogIn className="h-4 w-4" />
            <AlertDescription>
              <div className="space-y-2">
                <p className="font-medium">Demo Credentials:</p>
                <div className="text-sm space-y-1">
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
            </AlertDescription>
          </Alert>

          {/* Action Buttons */}
          <div className="flex flex-col space-y-3">
            <Button onClick={handleRetry} className="w-full">
              <RefreshCw className="h-4 w-4 mr-2" />
              Try Again
            </Button>
            <Button variant="outline" asChild className="w-full">
              <Link href="/">
                <Home className="h-4 w-4 mr-2" />
                Back to Home
              </Link>
            </Button>
          </div>

          {/* Troubleshooting Tips */}
          <div className="text-sm text-gray-600 space-y-2">
            <p className="font-medium">Troubleshooting Tips:</p>
            <ul className="list-disc list-inside space-y-1 text-xs">
              <li>Make sure you're using the correct email and password</li>
              <li>Check if your account is active</li>
              <li>Try clearing your browser cache and cookies</li>
              <li>Disable browser extensions that might interfere</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
