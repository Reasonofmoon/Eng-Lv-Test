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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Search, Download, Eye, Edit, Trash2, Mail, UserPlus } from "lucide-react"
import { format } from "date-fns"

interface User {
  id: string
  name: string
  email: string
  role: "student" | "admin"
  level: string
  testsCompleted: number
  averageScore: number
  lastActive: Date
  joinDate: Date
  status: "active" | "inactive"
}

export function UserManager() {
  const [users] = useState<User[]>([
    {
      id: "1",
      name: "김민수",
      email: "minsu.kim@email.com",
      role: "student",
      level: "B2",
      testsCompleted: 5,
      averageScore: 78,
      lastActive: new Date("2024-01-15"),
      joinDate: new Date("2023-12-01"),
      status: "active",
    },
    {
      id: "2",
      name: "이영희",
      email: "younghee.lee@email.com",
      role: "student",
      level: "B1",
      testsCompleted: 3,
      averageScore: 65,
      lastActive: new Date("2024-01-14"),
      joinDate: new Date("2024-01-01"),
      status: "active",
    },
    {
      id: "3",
      name: "박철수",
      email: "chulsoo.park@email.com",
      role: "admin",
      level: "C1",
      testsCompleted: 12,
      averageScore: 89,
      lastActive: new Date("2024-01-16"),
      joinDate: new Date("2023-06-15"),
      status: "active",
    },
    {
      id: "4",
      name: "정수진",
      email: "sujin.jung@email.com",
      role: "student",
      level: "A2",
      testsCompleted: 2,
      averageScore: 52,
      lastActive: new Date("2024-01-10"),
      joinDate: new Date("2024-01-05"),
      status: "inactive",
    },
  ])

  const [searchTerm, setSearchTerm] = useState("")
  const [filterRole, setFilterRole] = useState<"all" | "student" | "admin">("all")
  const [filterStatus, setFilterStatus] = useState<"all" | "active" | "inactive">("all")
  const [selectedUser, setSelectedUser] = useState<User | null>(null)

  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesRole = filterRole === "all" || user.role === filterRole
    const matchesStatus = filterStatus === "all" || user.status === filterStatus

    return matchesSearch && matchesRole && matchesStatus
  })

  const exportUsers = () => {
    const dataStr = JSON.stringify(filteredUsers, null, 2)
    const dataBlob = new Blob([dataStr], { type: "application/json" })
    const url = URL.createObjectURL(dataBlob)
    const link = document.createElement("a")
    link.href = url
    link.download = "users-export.json"
    link.click()
  }

  const sendEmail = (user: User) => {
    // Mock email functionality
    console.log(`Sending email to ${user.email}`)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">User Management</h2>
          <p className="text-gray-600">Manage users and view their progress</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={exportUsers}>
            <Download className="h-4 w-4 mr-2" />
            Export Users
          </Button>
          <Button>
            <UserPlus className="h-4 w-4 mr-2" />
            Add User
          </Button>
        </div>
      </div>

      {/* Search and Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Search className="h-5 w-5" />
            Search & Filter Users
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="md:col-span-2">
              <Input
                placeholder="Search by name or email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Select value={filterRole} onValueChange={(value: "all" | "student" | "admin") => setFilterRole(value)}>
              <SelectTrigger>
                <SelectValue placeholder="Role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Roles</SelectItem>
                <SelectItem value="student">Students</SelectItem>
                <SelectItem value="admin">Admins</SelectItem>
              </SelectContent>
            </Select>
            <Select
              value={filterStatus}
              onValueChange={(value: "all" | "active" | "inactive") => setFilterStatus(value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="inactive">Inactive</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* User Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold">{filteredUsers.length}</div>
            <div className="text-sm text-gray-600">Total Users</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold">{filteredUsers.filter((u) => u.status === "active").length}</div>
            <div className="text-sm text-gray-600">Active Users</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold">
              {Math.round(filteredUsers.reduce((sum, u) => sum + u.averageScore, 0) / filteredUsers.length)}%
            </div>
            <div className="text-sm text-gray-600">Avg Score</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold">{filteredUsers.reduce((sum, u) => sum + u.testsCompleted, 0)}</div>
            <div className="text-sm text-gray-600">Total Tests</div>
          </CardContent>
        </Card>
      </div>

      {/* Users Table */}
      <Card>
        <CardHeader>
          <CardTitle>Users ({filteredUsers.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Level</TableHead>
                <TableHead>Tests</TableHead>
                <TableHead>Avg Score</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Last Active</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredUsers.map((user) => (
                <TableRow key={user.id}>
                  <TableCell className="font-medium">{user.name}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>
                    <Badge variant={user.role === "admin" ? "default" : "secondary"}>{user.role}</Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">{user.level}</Badge>
                  </TableCell>
                  <TableCell>{user.testsCompleted}</TableCell>
                  <TableCell>{user.averageScore}%</TableCell>
                  <TableCell>
                    <Badge variant={user.status === "active" ? "default" : "secondary"}>{user.status}</Badge>
                  </TableCell>
                  <TableCell>{format(user.lastActive, "MMM dd, yyyy")}</TableCell>
                  <TableCell>
                    <div className="flex gap-1">
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button variant="outline" size="sm" onClick={() => setSelectedUser(user)}>
                            <Eye className="h-4 w-4" />
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-2xl">
                          <DialogHeader>
                            <DialogTitle>User Details</DialogTitle>
                            <DialogDescription>Detailed information about {user.name}</DialogDescription>
                          </DialogHeader>
                          {selectedUser && <UserDetails user={selectedUser} />}
                        </DialogContent>
                      </Dialog>
                      <Button variant="outline" size="sm" onClick={() => sendEmail(user)}>
                        <Mail className="h-4 w-4" />
                      </Button>
                      <Button variant="outline" size="sm">
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="outline" size="sm">
                        <Trash2 className="h-4 w-4" />
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

function UserDetails({ user }: { user: User }) {
  return (
    <Tabs defaultValue="overview" className="w-full">
      <TabsList className="grid w-full grid-cols-3">
        <TabsTrigger value="overview">Overview</TabsTrigger>
        <TabsTrigger value="tests">Test History</TabsTrigger>
        <TabsTrigger value="progress">Progress</TabsTrigger>
      </TabsList>

      <TabsContent value="overview" className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-medium">Name</label>
            <div className="text-lg">{user.name}</div>
          </div>
          <div>
            <label className="text-sm font-medium">Email</label>
            <div className="text-lg">{user.email}</div>
          </div>
          <div>
            <label className="text-sm font-medium">Current Level</label>
            <Badge variant="outline" className="text-lg">
              {user.level}
            </Badge>
          </div>
          <div>
            <label className="text-sm font-medium">Role</label>
            <Badge variant={user.role === "admin" ? "default" : "secondary"}>{user.role}</Badge>
          </div>
          <div>
            <label className="text-sm font-medium">Join Date</label>
            <div>{format(user.joinDate, "MMMM dd, yyyy")}</div>
          </div>
          <div>
            <label className="text-sm font-medium">Last Active</label>
            <div>{format(user.lastActive, "MMMM dd, yyyy")}</div>
          </div>
        </div>
      </TabsContent>

      <TabsContent value="tests" className="space-y-4">
        <div className="text-center py-8 text-gray-500">Test history would be displayed here</div>
      </TabsContent>

      <TabsContent value="progress" className="space-y-4">
        <div className="text-center py-8 text-gray-500">Progress charts would be displayed here</div>
      </TabsContent>
    </Tabs>
  )
}
