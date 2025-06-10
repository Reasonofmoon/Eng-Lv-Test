"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { BookOpen, Clock, Trophy, Users, LogIn, Settings } from "lucide-react"
import Link from "next/link"
import { useSession, signOut } from "next-auth/react"

export default function HomePage() {
  const { data: session, status } = useSession()

  const handleSignOut = () => {
    signOut({ callbackUrl: "/" })
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
            <nav className="hidden md:flex space-x-8 items-center">
              <Link href="#" className="text-gray-500 hover:text-gray-900">
                Home
              </Link>
              <Link href="/test" className="text-gray-500 hover:text-gray-900">
                Tests
              </Link>
              <Link href="/results" className="text-gray-500 hover:text-gray-900">
                Results
              </Link>

              {status === "loading" ? (
                <div className="animate-pulse bg-gray-200 h-8 w-20 rounded"></div>
              ) : session ? (
                <div className="flex items-center space-x-4">
                  <span className="text-gray-700">Welcome, {session.user.name}</span>
                  {(session.user.role === "admin" || session.user.role === "teacher") && (
                    <Button variant="outline" size="sm" asChild>
                      <Link href="/admin">
                        <Settings className="h-4 w-4 mr-2" />
                        Admin
                      </Link>
                    </Button>
                  )}
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

      {/* Hero Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-extrabold text-gray-900 sm:text-5xl md:text-6xl">
            Test Your English
            <span className="block text-blue-600">Proficiency Level</span>
          </h2>
          <p className="mt-3 max-w-md mx-auto text-base text-gray-500 sm:text-lg md:mt-5 md:text-xl md:max-w-3xl">
            Discover your English language skills with our comprehensive assessment. Get personalized feedback and
            improve your language abilities.
          </p>
          <div className="mt-5 max-w-md mx-auto sm:flex sm:justify-center md:mt-8">
            <div className="rounded-md shadow">
              <Button size="lg" asChild>
                <Link href="/test">Start Test Now</Link>
              </Button>
            </div>
            <div className="mt-3 rounded-md shadow sm:mt-0 sm:ml-3">
              <Button variant="outline" size="lg">
                View Sample Questions
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h3 className="text-3xl font-extrabold text-gray-900">Why Choose Our English Test?</h3>
            <p className="mt-4 text-lg text-gray-500">
              Comprehensive assessment with instant results and detailed feedback
            </p>
          </div>

          <div className="mt-16 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="text-center">
                <Clock className="h-12 w-12 text-blue-600 mx-auto mb-4" />
                <CardTitle>Quick Assessment</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-center">
                  Complete the test in just 30 minutes and get instant results
                </CardDescription>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="text-center">
                <Trophy className="h-12 w-12 text-blue-600 mx-auto mb-4" />
                <CardTitle>Accurate Results</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-center">
                  Get precise level assessment from A1 to C2 based on CEFR standards
                </CardDescription>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="text-center">
                <BookOpen className="h-12 w-12 text-blue-600 mx-auto mb-4" />
                <CardTitle>Detailed Feedback</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-center">
                  Receive comprehensive analysis of your strengths and areas for improvement
                </CardDescription>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="text-center">
                <Users className="h-12 w-12 text-blue-600 mx-auto mb-4" />
                <CardTitle>Trusted by Thousands</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-center">
                  Join over 10,000 learners who have improved their English with us
                </CardDescription>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Session Debug Info (Development Only) */}
      {process.env.NODE_ENV === "development" && (
        <section className="py-8 bg-gray-100">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Debug Info (Development)</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-xs space-y-2">
                  <p>
                    <strong>Status:</strong> {status}
                  </p>
                  <p>
                    <strong>User:</strong> {session?.user?.email || "Not signed in"}
                  </p>
                  <p>
                    <strong>Role:</strong> {session?.user?.role || "N/A"}
                  </p>
                  <p>
                    <strong>Session:</strong> {session ? "Active" : "None"}
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>
      )}

      {/* CTA Section */}
      <section className="py-16 bg-blue-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h3 className="text-3xl font-extrabold text-white">Ready to Test Your English Level?</h3>
          <p className="mt-4 text-xl text-blue-100">Start your assessment now and discover your true potential</p>
          <div className="mt-8">
            <Button size="lg" variant="secondary" asChild>
              <Link href="/test">Begin Assessment</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center">
            <div className="flex items-center justify-center mb-4">
              <BookOpen className="h-8 w-8 text-blue-400 mr-3" />
              <span className="text-xl font-bold text-white">English Level Test</span>
            </div>
            <p className="text-gray-400">© 2024 English Level Test. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
