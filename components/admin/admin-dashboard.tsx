"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { DashboardLayout } from "@/components/layout/dashboard-layout"
import {
  Users,
  UserCheck,
  Activity,
  AlertTriangle,
  Shield,
  FileText,
  Clock,
  CheckCircle,
  Eye,
  Settings,
} from "lucide-react"

interface SystemMetrics {
  totalUsers: number
  activeUsers: number
  totalConsultations: number
  complianceScore: number
  criticalAlerts: number
  pendingReviews: number
}

interface ComplianceAlert {
  id: string
  type: "security" | "privacy" | "medical" | "system"
  severity: "low" | "medium" | "high" | "critical"
  message: string
  timestamp: string
  status: "open" | "investigating" | "resolved"
}

export function AdminDashboard() {
  const [metrics, setMetrics] = useState<SystemMetrics>({
    totalUsers: 0,
    activeUsers: 0,
    totalConsultations: 0,
    complianceScore: 0,
    criticalAlerts: 0,
    pendingReviews: 0,
  })

  const [alerts, setAlerts] = useState<ComplianceAlert[]>([])

  useEffect(() => {
    // Mock data
    setMetrics({
      totalUsers: 2847,
      activeUsers: 1923,
      totalConsultations: 15642,
      complianceScore: 98.5,
      criticalAlerts: 3,
      pendingReviews: 12,
    })

    setAlerts([
      {
        id: "1",
        type: "security",
        severity: "high",
        message: "Multiple failed login attempts detected from IP 192.168.1.100",
        timestamp: "2024-01-15T10:30:00Z",
        status: "open",
      },
      {
        id: "2",
        type: "privacy",
        severity: "medium",
        message: "Patient data access without proper authorization logged",
        timestamp: "2024-01-15T09:15:00Z",
        status: "investigating",
      },
      {
        id: "3",
        type: "medical",
        severity: "critical",
        message: "Prescription issued without proper verification",
        timestamp: "2024-01-15T08:45:00Z",
        status: "open",
      },
    ])
  }, [])

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "critical":
        return "destructive"
      case "high":
        return "destructive"
      case "medium":
        return "default"
      case "low":
        return "secondary"
      default:
        return "secondary"
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "open":
        return <AlertTriangle className="w-4 h-4" />
      case "investigating":
        return <Eye className="w-4 h-4" />
      case "resolved":
        return <CheckCircle className="w-4 h-4" />
      default:
        return <AlertTriangle className="w-4 h-4" />
    }
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Admin Dashboard</h1>
            <p className="text-muted-foreground">Platform management and compliance monitoring</p>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline">
              <Settings className="w-4 h-4 mr-2" />
              System Settings
            </Button>
            <Button>Generate Report</Button>
          </div>
        </div>

        {/* Critical Alerts */}
        {alerts.filter((alert) => alert.severity === "critical").length > 0 && (
          <Alert className="border-destructive">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              <strong>Critical Alert:</strong> {alerts.filter((alert) => alert.severity === "critical").length} critical
              issues require immediate attention.
            </AlertDescription>
          </Alert>
        )}

        {/* Metrics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Users</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{metrics.totalUsers.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">
                <span className="text-success">+12%</span> from last month
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Users</CardTitle>
              <UserCheck className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{metrics.activeUsers.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">
                <span className="text-success">+8%</span> from last week
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Consultations</CardTitle>
              <Activity className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{metrics.totalConsultations.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">
                <span className="text-success">+23%</span> from last month
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Compliance Score</CardTitle>
              <Shield className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{metrics.complianceScore}%</div>
              <p className="text-xs text-muted-foreground">
                <span className="text-success">+0.5%</span> from last audit
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Critical Alerts</CardTitle>
              <AlertTriangle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-destructive">{metrics.criticalAlerts}</div>
              <p className="text-xs text-muted-foreground">Require immediate attention</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pending Reviews</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{metrics.pendingReviews}</div>
              <p className="text-xs text-muted-foreground">Awaiting admin review</p>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <Tabs defaultValue="alerts" className="space-y-4">
          <TabsList>
            <TabsTrigger value="alerts">Security Alerts</TabsTrigger>
            <TabsTrigger value="activity">Recent Activity</TabsTrigger>
            <TabsTrigger value="reports">Compliance Reports</TabsTrigger>
          </TabsList>

          <TabsContent value="alerts" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Security & Compliance Alerts</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {alerts.map((alert) => (
                    <div key={alert.id} className="flex items-start justify-between p-4 border rounded-lg">
                      <div className="flex items-start gap-3">
                        {getStatusIcon(alert.status)}
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <Badge variant={getSeverityColor(alert.severity)}>{alert.severity.toUpperCase()}</Badge>
                            <Badge variant="outline">{alert.type}</Badge>
                          </div>
                          <p className="text-sm">{alert.message}</p>
                          <p className="text-xs text-muted-foreground">{new Date(alert.timestamp).toLocaleString()}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button size="sm" variant="outline">
                          Investigate
                        </Button>
                        <Button size="sm">Resolve</Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="activity" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Recent System Activity</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center gap-3 p-3 border rounded-lg">
                    <UserCheck className="w-5 h-5 text-success" />
                    <div>
                      <p className="text-sm font-medium">New doctor registration approved</p>
                      <p className="text-xs text-muted-foreground">Dr. Sarah Mitchell - Cardiology</p>
                    </div>
                    <span className="text-xs text-muted-foreground ml-auto">2 hours ago</span>
                  </div>
                  <div className="flex items-center gap-3 p-3 border rounded-lg">
                    <Activity className="w-5 h-5 text-primary" />
                    <div>
                      <p className="text-sm font-medium">System maintenance completed</p>
                      <p className="text-xs text-muted-foreground">Database optimization and security updates</p>
                    </div>
                    <span className="text-xs text-muted-foreground ml-auto">4 hours ago</span>
                  </div>
                  <div className="flex items-center gap-3 p-3 border rounded-lg">
                    <Shield className="w-5 h-5 text-success" />
                    <div>
                      <p className="text-sm font-medium">Compliance audit passed</p>
                      <p className="text-xs text-muted-foreground">HIPAA compliance verification successful</p>
                    </div>
                    <span className="text-xs text-muted-foreground ml-auto">1 day ago</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="reports" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Compliance Reports</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 border rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-medium">HIPAA Compliance</h4>
                      <Badge variant="default" className="bg-success text-success-foreground">
                        Compliant
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mb-3">Last audit: January 10, 2024</p>
                    <Button size="sm" variant="outline" className="w-full bg-transparent">
                      <FileText className="w-4 h-4 mr-2" />
                      View Report
                    </Button>
                  </div>
                  <div className="p-4 border rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-medium">Data Security</h4>
                      <Badge variant="default" className="bg-success text-success-foreground">
                        Secure
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mb-3">Last scan: January 14, 2024</p>
                    <Button size="sm" variant="outline" className="w-full bg-transparent">
                      <FileText className="w-4 h-4 mr-2" />
                      View Report
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  )
}
