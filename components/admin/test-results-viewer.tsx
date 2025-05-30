"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Search, Download, Eye, CalendarIcon, FileText, Printer } from "lucide-react"
import { format } from "date-fns"
import type { TestResult } from "@/types/enhanced-test"

interface TestResultWithUser extends TestResult {
  userName: string
  userEmail: string
}

export function TestResultsViewer() {
  const [results] = useState<TestResultWithUser[]>([
    {
      id: "result-1",
      sessionId: "session-1",
      userId: "user-1",
      userName: "김민수",
      userEmail: "minsu.kim@email.com",
      totalScore: 78,
      maxScore: 100,
      percentage: 78,
      cefrLevel: "B2",
      skillBreakdown: {
        grammar: { score: 20, maxScore: 25, percentage: 80 },
        vocabulary: { score: 18, maxScore: 25, percentage: 72 },
        reading: { score: 22, maxScore: 25, percentage: 88 },
        listening: { score: 18, maxScore: 25, percentage: 72 },
        writing: { score: 0, maxScore: 0, percentage: 0 },
      },
      timeSpent: 1845,
      completedAt: new Date("2024-01-15T10:30:00"),
      recommendations: ["Focus on vocabulary expansion", "Practice listening comprehension"],
    },
    {
      id: "result-2",
      sessionId: "session-2",
      userId: "user-2",
      userName: "이영희",
      userEmail: "younghee.lee@email.com",
      totalScore: 65,
      maxScore: 100,
      percentage: 65,
      cefrLevel: "B1",
      skillBreakdown: {
        grammar: { score: 16, maxScore: 25, percentage: 64 },
        vocabulary: { score: 15, maxScore: 25, percentage: 60 },
        reading: { score: 18, maxScore: 25, percentage: 72 },
        listening: { score: 16, maxScore: 25, percentage: 64 },
        writing: { score: 0, maxScore: 0, percentage: 0 },
      },
      timeSpent: 2100,
      completedAt: new Date("2024-01-14T14:20:00"),
      recommendations: ["Strengthen grammar fundamentals", "Expand vocabulary"],
    },
  ])

  const [searchTerm, setSearchTerm] = useState("")
  const [filterLevel, setFilterLevel] = useState<string>("all")
  const [dateRange, setDateRange] = useState<{ from?: Date; to?: Date }>({})
  const [selectedResult, setSelectedResult] = useState<TestResultWithUser | null>(null)

  const filteredResults = results.filter((result) => {
    const matchesSearch =
      result.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      result.userEmail.toLowerCase().includes(searchTerm.toLowerCase()) ||
      result.id.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesLevel = filterLevel === "all" || result.cefrLevel === filterLevel

    const matchesDate =
      !dateRange.from || !dateRange.to || (result.completedAt >= dateRange.from && result.completedAt <= dateRange.to)

    return matchesSearch && matchesLevel && matchesDate
  })

  const exportResults = () => {
    const dataStr = JSON.stringify(filteredResults, null, 2)
    const dataBlob = new Blob([dataStr], { type: "application/json" })
    const url = URL.createObjectURL(dataBlob)
    const link = document.createElement("a")
    link.href = url
    link.download = "test-results-export.json"
    link.click()
  }

  const exportToPDF = (result: TestResultWithUser) => {
    // Mock PDF export functionality
    console.log(`Exporting result ${result.id} to PDF`)
  }

  const printResult = (result: TestResultWithUser) => {
    // Mock print functionality
    console.log(`Printing result ${result.id}`)
  }

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600)
    const mins = Math.floor((seconds % 3600) / 60)
    const secs = seconds % 60

    if (hours > 0) {
      return `${hours}h ${mins}m ${secs}s`
    }
    return `${mins}m ${secs}s`
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Test Results</h2>
          <p className="text-gray-600">View and manage test results</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={exportResults}>
            <Download className="h-4 w-4 mr-2" />
            Export All
          </Button>
        </div>
      </div>

      {/* Search and Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Search className="h-5 w-5" />
            Search & Filter Results
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <Input
                placeholder="Search by name, email, or ID..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Select value={filterLevel} onValueChange={setFilterLevel}>
              <SelectTrigger>
                <SelectValue placeholder="CEFR Level" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Levels</SelectItem>
                <SelectItem value="A1">A1</SelectItem>
                <SelectItem value="A2">A2</SelectItem>
                <SelectItem value="B1">B1</SelectItem>
                <SelectItem value="B2">B2</SelectItem>
                <SelectItem value="C1">C1</SelectItem>
                <SelectItem value="C2">C2</SelectItem>
              </SelectContent>
            </Select>
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" className="justify-start text-left font-normal">
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {dateRange.from ? (
                    dateRange.to ? (
                      <>
                        {format(dateRange.from, "LLL dd, y")} - {format(dateRange.to, "LLL dd, y")}
                      </>
                    ) : (
                      format(dateRange.from, "LLL dd, y")
                    )
                  ) : (
                    <span>Pick a date range</span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  initialFocus
                  mode="range"
                  defaultMonth={dateRange.from}
                  selected={dateRange}
                  onSelect={setDateRange}
                  numberOfMonths={2}
                />
              </PopoverContent>
            </Popover>
            <Button
              variant="outline"
              onClick={() => {
                setSearchTerm("")
                setFilterLevel("all")
                setDateRange({})
              }}
            >
              Clear Filters
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Results Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold">{filteredResults.length}</div>
            <div className="text-sm text-gray-600">Total Results</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold">
              {Math.round(filteredResults.reduce((sum, r) => sum + r.percentage, 0) / filteredResults.length)}%
            </div>
            <div className="text-sm text-gray-600">Average Score</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold">
              {Math.round(filteredResults.reduce((sum, r) => sum + r.timeSpent, 0) / filteredResults.length / 60)}m
            </div>
            <div className="text-sm text-gray-600">Avg Time</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold">{filteredResults.filter((r) => r.percentage >= 70).length}</div>
            <div className="text-sm text-gray-600">Passed (≥70%)</div>
          </CardContent>
        </Card>
      </div>

      {/* Results Table */}
      <Card>
        <CardHeader>
          <CardTitle>Test Results ({filteredResults.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>User</TableHead>
                <TableHead>Score</TableHead>
                <TableHead>CEFR Level</TableHead>
                <TableHead>Time Spent</TableHead>
                <TableHead>Completed</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredResults.map((result) => (
                <TableRow key={result.id}>
                  <TableCell>
                    <div>
                      <div className="font-medium">{result.userName}</div>
                      <div className="text-sm text-gray-600">{result.userEmail}</div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <span className="text-lg font-bold">{result.percentage}%</span>
                      <Badge variant={result.percentage >= 70 ? "default" : "secondary"}>
                        {result.percentage >= 70 ? "Pass" : "Fail"}
                      </Badge>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">{result.cefrLevel}</Badge>
                  </TableCell>
                  <TableCell>{formatTime(result.timeSpent)}</TableCell>
                  <TableCell>{format(result.completedAt, "MMM dd, yyyy HH:mm")}</TableCell>
                  <TableCell>
                    <div className="flex gap-1">
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button variant="outline" size="sm" onClick={() => setSelectedResult(result)}>
                            <Eye className="h-4 w-4" />
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                          <DialogHeader>
                            <DialogTitle>Test Result Details</DialogTitle>
                            <DialogDescription>Detailed analysis for {result.userName}</DialogDescription>
                          </DialogHeader>
                          {selectedResult && <TestResultDetails result={selectedResult} />}
                        </DialogContent>
                      </Dialog>
                      <Button variant="outline" size="sm" onClick={() => exportToPDF(result)}>
                        <FileText className="h-4 w-4" />
                      </Button>
                      <Button variant="outline" size="sm" onClick={() => printResult(result)}>
                        <Printer className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}

function TestResultDetails({ result }: { result: TestResultWithUser }) {
  const getGradeColor = (percentage: number) => {
    if (percentage >= 90) return "text-green-600"
    if (percentage >= 80) return "text-blue-600"
    if (percentage >= 70) return "text-yellow-600"
    if (percentage >= 60) return "text-orange-600"
    return "text-red-600"
  }

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600)
    const mins = Math.floor((seconds % 3600) / 60)
    const secs = seconds % 60

    if (hours > 0) {
      return `${hours}h ${mins}m ${secs}s`
    }
    return `${mins}m ${secs}s`
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <h3 className="text-2xl font-bold mb-2">{result.userName}</h3>
        <p className="text-gray-600">{result.userEmail}</p>
        <div className="flex justify-center gap-4 mt-4">
          <div className="text-center">
            <div className={`text-4xl font-bold ${getGradeColor(result.percentage)}`}>{result.percentage}%</div>
            <div className="text-sm text-gray-600">Overall Score</div>
          </div>
          <div className="text-center">
            <div className="text-4xl font-bold text-blue-600">{result.cefrLevel}</div>
            <div className="text-sm text-gray-600">CEFR Level</div>
          </div>
          <div className="text-center">
            <div className="text-4xl font-bold text-gray-800">{formatTime(result.timeSpent)}</div>
            <div className="text-sm text-gray-600">Time Spent</div>
          </div>
        </div>
      </div>

      {/* Skill Breakdown */}
      <Card>
        <CardHeader>
          <CardTitle>Skill Breakdown</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {Object.entries(result.skillBreakdown).map(([skill, scores]) => {
            if (scores.maxScore === 0) return null

            return (
              <div key={skill}>
                <div className="flex justify-between items-center mb-2">
                  <span className="capitalize font-medium">{skill}</span>
                  <div className="text-right">
                    <span className={`font-bold ${getGradeColor(scores.percentage)}`}>{scores.percentage}%</span>
                    <div className="text-sm text-gray-500">
                      {scores.score}/{scores.maxScore} points
                    </div>
                  </div>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div
                    className="bg-blue-600 h-3 rounded-full transition-all duration-300"
                    style={{ width: `${scores.percentage}%` }}
                  />
                </div>
              </div>
            )
          })}
        </CardContent>
      </Card>

      {/* Recommendations */}
      <Card>
        <CardHeader>
          <CardTitle>Recommendations</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {result.recommendations.map((recommendation, index) => (
              <div key={index} className="flex items-start gap-3 p-3 bg-blue-50 rounded-lg">
                <div className="w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold">
                  {index + 1}
                </div>
                <div className="text-gray-700">{recommendation}</div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Test Information */}
      <Card>
        <CardHeader>
          <CardTitle>Test Information</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-gray-600">Test ID</label>
              <div className="font-mono text-sm">{result.id}</div>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-600">Session ID</label>
              <div className="font-mono text-sm">{result.sessionId}</div>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-600">Completed At</label>
              <div>{format(result.completedAt, "MMMM dd, yyyy HH:mm:ss")}</div>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-600">Total Points</label>
              <div>
                {result.totalScore} / {result.maxScore}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Actions */}
      <div className="flex justify-end gap-2">
        <Button variant="outline">
          <FileText className="h-4 w-4 mr-2" />
          Export PDF
        </Button>
        <Button variant="outline">
          <Printer className="h-4 w-4 mr-2" />
          Print
        </Button>
        <Button variant="outline">
          <Download className="h-4 w-4 mr-2" />
          Download Data
        </Button>
      </div>
    </div>
  )
}
