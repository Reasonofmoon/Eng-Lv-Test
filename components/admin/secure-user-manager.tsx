"use client"

import type React from "react"

import { useState } from "react"
import { useSession } from "next-auth/react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Search, UserPlus, Edit, Trash2, Shield, Eye, AlertTriangle, CheckCircle, XCircle } from "lucide-react"
import { hasPermission, PERMISSIONS, ROLE_PERMISSIONS } from "@/lib/permissions"
import { userCreateSchema, userUpdateSchema, sanitizeInput } from "@/lib/security"
import { logAuditEvent } from "@/lib/security"
import { format } from "date-fns"

interface SecureUser {
  id: string
  email: string
  name: string
  role: "admin" | "teacher" | "student"
  permissions: string[]
  isActive: boolean
  lastLogin?: Date
  createdAt: Date
  updatedAt: Date
  loginAttempts: number
  lockedUntil?: Date
}

export function SecureUserManager() {
  const { data: session } = useSession()
  const [users, setUsers] = useState<SecureUser[]>([
    {
      id: "1",
      email: "admin@englishtest.com",
      name: "System Administrator",
      role: "admin",
      permissions: ["*"],
      isActive: true,
      createdAt: new Date("2023-01-01"),
      updatedAt: new Date(),
      loginAttempts: 0,
    },
    {
      id: "2",
      email: "teacher@englishtest.com",
      name: "English Teacher",
      role: "teacher",
      permissions: ROLE_PERMISSIONS.teacher,
      isActive: true,
      createdAt: new Date("2023-06-01"),
      updatedAt: new Date(),
      loginAttempts: 0,
    },
  ])

  const [searchTerm, setSearchTerm] = useState("")
  const [filterRole, setFilterRole] = useState<"all" | "admin" | "teacher" | "student">("all")
  const [filterStatus, setFilterStatus] = useState<"all" | "active" | "inactive" | "locked">("all")
  const [selectedUser, setSelectedUser] = useState<SecureUser | null>(null)
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")

  const userPermissions = session?.user.permissions || []
  const canCreateUsers = hasPermission(userPermissions, PERMISSIONS.USERS_WRITE)
  const canEditUsers = hasPermission(userPermissions, PERMISSIONS.USERS_WRITE)
  const canDeleteUsers = hasPermission(userPermissions, PERMISSIONS.USERS_DELETE)

  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesRole = filterRole === "all" || user.role === filterRole

    let matchesStatus = true
    if (filterStatus === "active") matchesStatus = user.isActive && !user.lockedUntil
    else if (filterStatus === "inactive") matchesStatus = !user.isActive
    else if (filterStatus === "locked") matchesStatus = !!user.lockedUntil

    return matchesSearch && matchesRole && matchesStatus
  })

  const handleCreateUser = async (userData: any) => {
    try {
      // Validate input
      const validatedData = userCreateSchema.parse({
        ...userData,
        email: sanitizeInput(userData.email),
        name: sanitizeInput(userData.name),
      })

      // Check if email already exists
      if (users.some((u) => u.email === validatedData.email)) {
        setError("Email already exists")
        return
      }

      const newUser: SecureUser = {
        id: Math.random().toString(36).substring(2, 15),
        email: validatedData.email,
        name: validatedData.name,
        role: validatedData.role,
        permissions: ROLE_PERMISSIONS[validatedData.role],
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date(),
        loginAttempts: 0,
      }

      setUsers([...users, newUser])
      setSuccess("User created successfully")
      setIsCreateDialogOpen(false)

      // Log audit event
      logAuditEvent(session?.user.id || "unknown", "CREATE", "USER", {
        userId: newUser.id,
        email: newUser.email,
        role: newUser.role,
      })
    } catch (error) {
      setError("Invalid user data")
    }
  }

  const handleUpdateUser = async (userId: string, userData: any) => {
    try {
      const validatedData = userUpdateSchema.parse({
        ...userData,
        email: userData.email ? sanitizeInput(userData.email) : undefined,
        name: userData.name ? sanitizeInput(userData.name) : undefined,
      })

      setUsers(
        users.map((user) =>
          user.id === userId
            ? {
                ...user,
                ...validatedData,
                permissions: validatedData.role ? ROLE_PERMISSIONS[validatedData.role] : user.permissions,
                updatedAt: new Date(),
              }
            : user,
        ),
      )

      setSuccess("User updated successfully")
      setIsEditDialogOpen(false)

      // Log audit event
      logAuditEvent(session?.user.id || "unknown", "UPDATE", "USER", { userId, changes: validatedData })
    } catch (error) {
      setError("Invalid user data")
    }
  }

  const handleDeleteUser = async (userId: string) => {
    if (!canDeleteUsers) {
      setError("You don't have permission to delete users")
      return
    }

    // Prevent deleting own account
    if (userId === session?.user.id) {
      setError("You cannot delete your own account")
      return
    }

    const user = users.find((u) => u.id === userId)
    if (!user) return

    setUsers(users.filter((u) => u.id !== userId))
    setSuccess("User deleted successfully")

    // Log audit event
    logAuditEvent(session?.user.id || "unknown", "DELETE", "USER", { userId, email: user.email })
  }

  const handleLockUser = async (userId: string) => {
    const lockUntil = new Date()
    lockUntil.setHours(lockUntil.getHours() + 24) // Lock for 24 hours

    setUsers(
      users.map((user) => (user.id === userId ? { ...user, lockedUntil: lockUntil, updatedAt: new Date() } : user)),
    )

    // Log audit event
    logAuditEvent(session?.user.id || "unknown", "LOCK", "USER", { userId, lockUntil })
  }

  const handleUnlockUser = async (userId: string) => {
    setUsers(
      users.map((user) =>
        user.id === userId ? { ...user, lockedUntil: undefined, loginAttempts: 0, updatedAt: new Date() } : user,
      ),
    )

    // Log audit event
    logAuditEvent(session?.user.id || "unknown", "UNLOCK", "USER", { userId })
  }

  return (
    <div className="space-y-6">
      {/* Alerts */}
      {error && (
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {success && (
        <Alert>
          <CheckCircle className="h-4 w-4" />
          <AlertDescription>{success}</AlertDescription>
        </Alert>
      )}

      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Secure User Management</h2>
          <p className="text-gray-600">Manage user accounts with role-based access control</p>
        </div>
        {canCreateUsers && (
          <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <UserPlus className="h-4 w-4 mr-2" />
                Create User
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Create New User</DialogTitle>
                <DialogDescription>Add a new user to the system with appropriate permissions</DialogDescription>
              </DialogHeader>
              <UserForm onSubmit={handleCreateUser} />
            </DialogContent>
          </Dialog>
        )}
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
            <div>
              <Input
                placeholder="Search by name or email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Select value={filterRole} onValueChange={(value: any) => setFilterRole(value)}>
              <SelectTrigger>
                <SelectValue placeholder="Role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Roles</SelectItem>
                <SelectItem value="admin">Admin</SelectItem>
                <SelectItem value="teacher">Teacher</SelectItem>
                <SelectItem value="student">Student</SelectItem>
              </SelectContent>
            </Select>
            <Select value={filterStatus} onValueChange={(value: any) => setFilterStatus(value)}>
              <SelectTrigger>
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="inactive">Inactive</SelectItem>
                <SelectItem value="locked">Locked</SelectItem>
              </SelectContent>
            </Select>
            <Button
              variant="outline"
              onClick={() => {
                setSearchTerm("")
                setFilterRole("all")
                setFilterStatus("all")
                setError("")
                setSuccess("")
              }}
            >
              Clear Filters
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Users Table */}
      <Card>
        <CardHeader>
          <CardTitle>Users ({filteredUsers.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>User</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Last Login</TableHead>
                <TableHead>Login Attempts</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredUsers.map((user) => (
                <TableRow key={user.id}>
                  <TableCell>
                    <div>
                      <div className="font-medium">{user.name}</div>
                      <div className="text-sm text-gray-600">{user.email}</div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant={user.role === "admin" ? "default" : "secondary"}>
                      <Shield className="h-3 w-3 mr-1" />
                      {user.role}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-col gap-1">
                      <Badge variant={user.isActive ? "default" : "secondary"}>
                        {user.isActive ? "Active" : "Inactive"}
                      </Badge>
                      {user.lockedUntil && <Badge variant="destructive">Locked</Badge>}
                    </div>
                  </TableCell>
                  <TableCell>{user.lastLogin ? format(user.lastLogin, "MMM dd, yyyy HH:mm") : "Never"}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <span>{user.loginAttempts}</span>
                      {user.loginAttempts >= 3 && <AlertTriangle className="h-4 w-4 text-red-500" />}
                    </div>
                  </TableCell>
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
                          </DialogHeader>
                          {selectedUser && <UserDetails user={selectedUser} />}
                        </DialogContent>
                      </Dialog>

                      {canEditUsers && (
                        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
                          <DialogTrigger asChild>
                            <Button variant="outline" size="sm" onClick={() => setSelectedUser(user)}>
                              <Edit className="h-4 w-4" />
                            </Button>
                          </DialogTrigger>
                          <DialogContent>
                            <DialogHeader>
                              <DialogTitle>Edit User</DialogTitle>
                            </DialogHeader>
                            {selectedUser && (
                              <UserForm
                                user={selectedUser}
                                onSubmit={(data) => handleUpdateUser(selectedUser.id, data)}
                              />
                            )}
                          </DialogContent>
                        </Dialog>
                      )}

                      {user.lockedUntil ? (
                        <Button variant="outline" size="sm" onClick={() => handleUnlockUser(user.id)}>
                          <CheckCircle className="h-4 w-4" />
                        </Button>
                      ) : (
                        <Button variant="outline" size="sm" onClick={() => handleLockUser(user.id)}>
                          <XCircle className="h-4 w-4" />
                        </Button>
                      )}

                      {canDeleteUsers && user.id !== session?.user.id && (
                        <Button variant="outline" size="sm" onClick={() => handleDeleteUser(user.id)}>
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      )}
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

function UserForm({ user, onSubmit }: { user?: SecureUser; onSubmit: (data: any) => void }) {
  const [formData, setFormData] = useState({
    email: user?.email || "",
    name: user?.name || "",
    role: user?.role || "student",
    isActive: user?.isActive ?? true,
  })
  const [showPassword, setShowPassword] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit(formData)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          type="email"
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          required
        />
      </div>

      <div>
        <Label htmlFor="name">Name</Label>
        <Input
          id="name"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          required
        />
      </div>

      <div>
        <Label htmlFor="role">Role</Label>
        <Select value={formData.role} onValueChange={(value: any) => setFormData({ ...formData, role: value })}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="student">Student</SelectItem>
            <SelectItem value="teacher">Teacher</SelectItem>
            <SelectItem value="admin">Admin</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {user && (
        <div className="flex items-center space-x-2">
          <Switch
            id="isActive"
            checked={formData.isActive}
            onCheckedChange={(checked) => setFormData({ ...formData, isActive: checked })}
          />
          <Label htmlFor="isActive">Active</Label>
        </div>
      )}

      <div className="flex justify-end gap-2">
        <Button type="submit">{user ? "Update User" : "Create User"}</Button>
      </div>
    </form>
  )
}

function UserDetails({ user }: { user: SecureUser }) {
  return (
    <Tabs defaultValue="overview" className="w-full">
      <TabsList className="grid w-full grid-cols-3">
        <TabsTrigger value="overview">Overview</TabsTrigger>
        <TabsTrigger value="permissions">Permissions</TabsTrigger>
        <TabsTrigger value="security">Security</TabsTrigger>
      </TabsList>

      <TabsContent value="overview" className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label>Name</Label>
            <div className="font-medium">{user.name}</div>
          </div>
          <div>
            <Label>Email</Label>
            <div className="font-medium">{user.email}</div>
          </div>
          <div>
            <Label>Role</Label>
            <Badge variant={user.role === "admin" ? "default" : "secondary"}>{user.role}</Badge>
          </div>
          <div>
            <Label>Status</Label>
            <Badge variant={user.isActive ? "default" : "secondary"}>{user.isActive ? "Active" : "Inactive"}</Badge>
          </div>
          <div>
            <Label>Created</Label>
            <div>{format(user.createdAt, "MMMM dd, yyyy")}</div>
          </div>
          <div>
            <Label>Last Updated</Label>
            <div>{format(user.updatedAt, "MMMM dd, yyyy")}</div>
          </div>
        </div>
      </TabsContent>

      <TabsContent value="permissions" className="space-y-4">
        <div>
          <Label>Assigned Permissions</Label>
          <div className="mt-2 space-y-2">
            {user.permissions.map((permission) => (
              <Badge key={permission} variant="outline">
                {permission}
              </Badge>
            ))}
          </div>
        </div>
      </TabsContent>

      <TabsContent value="security" className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label>Login Attempts</Label>
            <div className="font-medium">{user.loginAttempts}</div>
          </div>
          <div>
            <Label>Last Login</Label>
            <div>{user.lastLogin ? format(user.lastLogin, "MMMM dd, yyyy HH:mm") : "Never"}</div>
          </div>
          {user.lockedUntil && (
            <div className="col-span-2">
              <Label>Locked Until</Label>
              <div className="font-medium text-red-600">{format(user.lockedUntil, "MMMM dd, yyyy HH:mm")}</div>
            </div>
          )}
        </div>
      </TabsContent>
    </Tabs>
  )
}
