"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Download, TrendingUp, Users, Target, Clock } from "lucide-react"
import { format } from "date-fns"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area,
} from "recharts"

export function AnalyticsDashboard() {
  const [dateRange, setDateRange] = useState<{ from: Date; to: Date }>({
    from: new Date(2024, 0, 1),
    to: new Date(),
  })
  const [selectedPeriod, setSelectedPeriod] = useState("30d")

  // Mock data for charts
  const testScoreData = [
    { level: "A1", count: 45, avgScore: 78 },
    { level: "A2", count: 67, avgScore: 72 },
    { level: "B1", count: 89, avgScore: 68 },
    { level: "B2", count: 76, avgScore: 65 },
    { level: "C1", count: 34, avgScore: 71 },
    { level: "C2", count: 12, avgScore: 74 },
  ]

  const dailyTestsData = [
    { date: "2024-01-01", tests: 12, users: 8 },
    { date: "2024-01-02", tests: 19, users: 15 },
    { date: "2024-01-03", tests: 23, users: 18 },
    { date: "2024-01-04", tests: 17, users: 12 },
    { date: "2024-01-05", tests: 31, users: 24 },
    { date: "2024-01-06", tests: 28, users: 21 },
    { date: "2024-01-07", tests: 35, users: 27 },
  ]

  const skillPerformanceData = [
    { skill: "Grammar", score: 75, color: "#8884d8" },
    { skill: "Vocabulary", score: 68, color: "#82ca9d" },
    { skill: "Reading", score: 72, color: "#ffc658" },
    { skill: "Listening", score: 65, color: "#ff7300" },
  ]

  const questionTypeData = [
    { type: "Multiple Choice", count: 156, percentage: 45 },
    { type: "Fill Blank", count: 89, percentage: 26 },
    { type: "Reading", count: 67, percentage: 19 },
    { type: "Listening", count: 34, percentage: 10 },
  ]

  const completionRateData = [
    { month: "Jan", completed: 89, started: 120 },
    { month: "Feb", completed: 95, started: 135 },
    { month: "Mar", completed: 102, started: 145 },
    { month: "Apr", completed: 87, started: 128 },
    { month: "May", completed: 115, started: 156 },
    { month: "Jun", completed: 123, started: 167 },
  ]

  const exportData = (type: string) => {
    // Mock export functionality
    console.log(`Exporting ${type} data...`)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Analytics Dashboard</h2>
          <p className="text-gray-600">Comprehensive test performance analytics</p>
        </div>
        <div className="flex gap-2">
          <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7d">Last 7 days</SelectItem>
              <SelectItem value="30d">Last 30 days</SelectItem>
              <SelectItem value="90d">Last 90 days</SelectItem>
              <SelectItem value="1y">Last year</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Export Report
          </Button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Tests</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">3,891</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-green-600">+12.5%</span> from last month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Users</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">1,247</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-green-600">+8.2%</span> from last month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Average Score</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">72.4%</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-green-600">+2.1%</span> from last month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg. Completion Time</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">24m</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-red-600">+1.2m</span> from last month
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="performance">Performance</TabsTrigger>
          <TabsTrigger value="questions">Questions</TabsTrigger>
          <TabsTrigger value="users">Users</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Daily Tests Chart */}
            <Card>
              <CardHeader>
                <CardTitle>Daily Test Activity</CardTitle>
                <CardDescription>Tests completed and unique users per day</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <AreaChart data={dailyTestsData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" tickFormatter={(value) => format(new Date(value), "MMM dd")} />
                    <YAxis />
                    <Tooltip />
                    <Area type="monotone" dataKey="tests" stackId="1" stroke="#8884d8" fill="#8884d8" />
                    <Area type="monotone" dataKey="users" stackId="1" stroke="#82ca9d" fill="#82ca9d" />
                  </AreaChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Completion Rate Chart */}
            <Card>
              <CardHeader>
                <CardTitle>Test Completion Rate</CardTitle>
                <CardDescription>Started vs completed tests by month</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={completionRateData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="started" fill="#e5e7eb" name="Started" />
                    <Bar dataKey="completed" fill="#3b82f6" name="Completed" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="performance" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* CEFR Level Performance */}
            <Card>
              <CardHeader>
                <CardTitle>Performance by CEFR Level</CardTitle>
                <CardDescription>Average scores and test counts by level</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={testScoreData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="level" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="avgScore" fill="#8884d8" name="Average Score %" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Skill Performance */}
            <Card>
              <CardHeader>
                <CardTitle>Skill Area Performance</CardTitle>
                <CardDescription>Average performance by skill area</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={skillPerformanceData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ skill, score }) => `${skill}: ${score}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="score"
                    >
                      {skillPerformanceData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

          {/* Detailed Performance Table */}
          <Card>
            <CardHeader>
              <CardTitle>Detailed Performance Metrics</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {testScoreData.map((level) => (
                  <div key={level.level} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-4">
                      <Badge variant="secondary">{level.level}</Badge>
                      <div>
                        <div className="font-medium">CEFR Level {level.level}</div>
                        <div className="text-sm text-gray-600">{level.count} tests completed</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold">{level.avgScore}%</div>
                      <div className="text-sm text-gray-600">Average Score</div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="questions" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Question Type Distribution */}
            <Card>
              <CardHeader>
                <CardTitle>Question Type Distribution</CardTitle>
                <CardDescription>Breakdown of questions by type</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {questionTypeData.map((type) => (
                    <div key={type.type} className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-sm font-medium">{type.type}</span>
                        <span className="text-sm text-gray-600">{type.count} questions</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div className="bg-blue-600 h-2 rounded-full" style={{ width: `${type.percentage}%` }} />
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Question Difficulty Analysis */}
            <Card>
              <CardHeader>
                <CardTitle>Question Difficulty Analysis</CardTitle>
                <CardDescription>Success rates by question difficulty</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={testScoreData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="level" />
                    <YAxis />
                    <Tooltip />
                    <Line type="monotone" dataKey="avgScore" stroke="#8884d8" strokeWidth={2} />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="users" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>User Engagement</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span>Daily Active Users</span>
                    <span className="font-bold">342</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Weekly Active Users</span>
                    <span className="font-bold">1,247</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Monthly Active Users</span>
                    <span className="font-bold">3,891</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Average Tests per User</span>
                    <span className="font-bold">3.2</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>User Retention</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span>1-day retention</span>
                    <span className="font-bold text-green-600">78%</span>
                  </div>
                  <div className="flex justify-between">
                    <span>7-day retention</span>
                    <span className="font-bold text-green-600">45%</span>
                  </div>
                  <div className="flex justify-between">
                    <span>30-day retention</span>
                    <span className="font-bold text-yellow-600">23%</span>
                  </div>
                  <div className="flex justify-between">
                    <span>90-day retention</span>
                    <span className="font-bold text-red-600">12%</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>User Levels</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {testScoreData.map((level) => (
                    <div key={level.level} className="flex justify-between">
                      <span>{level.level} Level</span>
                      <span className="font-bold">{level.count} users</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
