"use client"

import { useState } from "react"
import { AuthGuard } from "@/components/auth/auth-guard"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Shield, AlertTriangle, CheckCircle, Activity, Lock, Eye, Download, RefreshCw } from "lucide-react"
import { PERMISSIONS } from "@/lib/permissions"
import { getAuditLogs, type AuditLog } from "@/lib/security"
import { format } from "date-fns"

export default function SecurityPage() {
  const [auditLogs] = useState<AuditLog[]>(getAuditLogs())
  const [securityAlerts] = useState([
    {
      id: "1",
      type: "warning",
      title: "Multiple Failed Login Attempts",
      description: "User teacher@englishtest.com has 3 failed login attempts in the last hour",
      timestamp: new Date(),
      resolved: false,
    },
    {
      id: "2",
      type: "info",
      title: "New Admin User Created",
      description: "New admin user was created by system administrator",
      timestamp: new Date(Date.now() - 3600000),
      resolved: true,
    },
  ])

  const [systemStatus] = useState({
    authenticationSystem: "healthy",
    rateLimiting: "active",
    inputValidation: "active",
    auditLogging: "active",
    encryptionStatus: "active",
    lastSecurityScan: new Date(Date.now() - 86400000), // 24 hours ago
  })

  return (
    <AuthGuard requiredPermissions={[PERMISSIONS.ADMIN_FULL]}>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Security Dashboard</h1>
          <p className="text-gray-600">Monitor and manage system security</p>
        </div>

        {/* Security Status Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Security Status</CardTitle>
              <Shield className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">Secure</div>
              <p className="text-xs text-muted-foreground">All systems operational</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Threats</CardTitle>
              <AlertTriangle className="h-4 w-4 text-yellow-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-yellow-600">1</div>
              <p className="text-xs text-muted-foreground">Requires attention</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Last Security Scan</CardTitle>
              <Activity className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">24h</div>
              <p className="text-xs text-muted-foreground">ago</p>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="overview" className="space-y-4">
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="alerts">Security Alerts</TabsTrigger>
            <TabsTrigger value="audit">Audit Logs</TabsTrigger>
            <TabsTrigger value="settings">Security Settings</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            {/* System Status */}
            <Card>
              <CardHeader>
                <CardTitle>System Security Status</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex justify-between items-center p-3 border rounded">
                    <span>Authentication System</span>
                    <Badge variant="default">
                      <CheckCircle className="h-3 w-3 mr-1" />
                      Healthy
                    </Badge>
                  </div>
                  <div className="flex justify-between items-center p-3 border rounded">
                    <span>Rate Limiting</span>
                    <Badge variant="default">
                      <CheckCircle className="h-3 w-3 mr-1" />
                      Active
                    </Badge>
                  </div>
                  <div className="flex justify-between items-center p-3 border rounded">
                    <span>Input Validation</span>
                    <Badge variant="default">
                      <CheckCircle className="h-3 w-3 mr-1" />
                      Active
                    </Badge>
                  </div>
                  <div className="flex justify-between items-center p-3 border rounded">
                    <span>Audit Logging</span>
                    <Badge variant="default">
                      <CheckCircle className="h-3 w-3 mr-1" />
                      Active
                    </Badge>
                  </div>
                  <div className="flex justify-between items-center p-3 border rounded">
                    <span>Data Encryption</span>
                    <Badge variant="default">
                      <CheckCircle className="h-3 w-3 mr-1" />
                      Active
                    </Badge>
                  </div>
                  <div className="flex justify-between items-center p-3 border rounded">
                    <span>HTTPS/TLS</span>
                    <Badge variant="default">
                      <CheckCircle className="h-3 w-3 mr-1" />
                      Enabled
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Security Recommendations */}
            <Card>
              <CardHeader>
                <CardTitle>Security Recommendations</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <Alert>
                    <CheckCircle className="h-4 w-4" />
                    <AlertDescription>
                      All critical security measures are properly configured and active.
                    </AlertDescription>
                  </Alert>
                  <Alert>
                    <AlertTriangle className="h-4 w-4" />
                    <AlertDescription>
                      Consider implementing 2FA for all admin accounts for enhanced security.
                    </AlertDescription>
                  </Alert>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="alerts" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Security Alerts</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {securityAlerts.map((alert) => (
                    <Alert key={alert.id} variant={alert.type === "warning" ? "destructive" : "default"}>
                      <AlertTriangle className="h-4 w-4" />
                      <AlertDescription>
                        <div className="flex justify-between items-start">
                          <div>
                            <div className="font-medium">{alert.title}</div>
                            <div className="text-sm">{alert.description}</div>
                            <div className="text-xs text-gray-500 mt-1">
                              {format(alert.timestamp, "MMM dd, yyyy HH:mm")}
                            </div>
                          </div>
                          <Badge variant={alert.resolved ? "default" : "destructive"}>
                            {alert.resolved ? "Resolved" : "Active"}
                          </Badge>
                        </div>
                      </AlertDescription>
                    </Alert>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="audit" className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <CardTitle>Audit Logs</CardTitle>
                  <Button variant="outline" size="sm">
                    <Download className="h-4 w-4 mr-2" />
                    Export Logs
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Timestamp</TableHead>
                      <TableHead>User</TableHead>
                      <TableHead>Action</TableHead>
                      <TableHead>Resource</TableHead>
                      <TableHead>IP Address</TableHead>
                      <TableHead>Details</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {auditLogs.slice(0, 10).map((log) => (
                      <TableRow key={log.id}>
                        <TableCell className="font-mono text-sm">{format(log.timestamp, "MMM dd HH:mm:ss")}</TableCell>
                        <TableCell>{log.userId}</TableCell>
                        <TableCell>
                          <Badge variant="outline">{log.action}</Badge>
                        </TableCell>
                        <TableCell>{log.resource}</TableCell>
                        <TableCell className="font-mono text-sm">{log.ipAddress}</TableCell>
                        <TableCell>
                          <Button variant="ghost" size="sm">
                            <Eye className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="settings" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Security Configuration</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {/* Password Policy */}
                  <div>
                    <h3 className="text-lg font-medium mb-3">Password Policy</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="flex justify-between items-center p-3 border rounded">
                        <span>Minimum Length</span>
                        <Badge variant="outline">8 characters</Badge>
                      </div>
                      <div className="flex justify-between items-center p-3 border rounded">
                        <span>Complexity Required</span>
                        <Badge variant="default">
                          <CheckCircle className="h-3 w-3 mr-1" />
                          Enabled
                        </Badge>
                      </div>
                      <div className="flex justify-between items-center p-3 border rounded">
                        <span>Password Expiry</span>
                        <Badge variant="outline">90 days</Badge>
                      </div>
                      <div className="flex justify-between items-center p-3 border rounded">
                        <span>Account Lockout</span>
                        <Badge variant="default">
                          <CheckCircle className="h-3 w-3 mr-1" />5 attempts
                        </Badge>
                      </div>
                    </div>
                  </div>

                  {/* Session Management */}
                  <div>
                    <h3 className="text-lg font-medium mb-3">Session Management</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="flex justify-between items-center p-3 border rounded">
                        <span>Session Timeout</span>
                        <Badge variant="outline">24 hours</Badge>
                      </div>
                      <div className="flex justify-between items-center p-3 border rounded">
                        <span>Concurrent Sessions</span>
                        <Badge variant="outline">Limited</Badge>
                      </div>
                      <div className="flex justify-between items-center p-3 border rounded">
                        <span>Secure Cookies</span>
                        <Badge variant="default">
                          <CheckCircle className="h-3 w-3 mr-1" />
                          Enabled
                        </Badge>
                      </div>
                      <div className="flex justify-between items-center p-3 border rounded">
                        <span>CSRF Protection</span>
                        <Badge variant="default">
                          <CheckCircle className="h-3 w-3 mr-1" />
                          Active
                        </Badge>
                      </div>
                    </div>
                  </div>

                  {/* Security Actions */}
                  <div>
                    <h3 className="text-lg font-medium mb-3">Security Actions</h3>
                    <div className="flex gap-4">
                      <Button variant="outline">
                        <RefreshCw className="h-4 w-4 mr-2" />
                        Run Security Scan
                      </Button>
                      <Button variant="outline">
                        <Lock className="h-4 w-4 mr-2" />
                        Force Password Reset
                      </Button>
                      <Button variant="outline">
                        <Download className="h-4 w-4 mr-2" />
                        Export Security Report
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </AuthGuard>
  )
}
