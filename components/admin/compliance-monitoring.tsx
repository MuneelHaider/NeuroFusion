"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { Shield, FileText, AlertTriangle, CheckCircle, Clock, Download, Eye } from "lucide-react"

interface ComplianceReport {
  id: string
  type: "HIPAA" | "GDPR" | "Security" | "Privacy"
  status: "compliant" | "warning" | "non-compliant"
  score: number
  lastAudit: string
  nextAudit: string
  issues: number
}

interface AuditLog {
  id: string
  action: string
  user: string
  timestamp: string
  details: string
  category: "access" | "modification" | "deletion" | "creation"
}

export function ComplianceMonitoring() {
  const [reports, setReports] = useState<ComplianceReport[]>([])
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([])

  useEffect(() => {
    // Mock compliance reports
    setReports([
      {
        id: "1",
        type: "HIPAA",
        status: "compliant",
        score: 98.5,
        lastAudit: "2024-01-10",
        nextAudit: "2024-04-10",
        issues: 0,
      },
      {
        id: "2",
        type: "GDPR",
        status: "warning",
        score: 85.2,
        lastAudit: "2024-01-08",
        nextAudit: "2024-04-08",
        issues: 3,
      },
      {
        id: "3",
        type: "Security",
        status: "compliant",
        score: 96.8,
        lastAudit: "2024-01-12",
        nextAudit: "2024-02-12",
        issues: 1,
      },
      {
        id: "4",
        type: "Privacy",
        status: "non-compliant",
        score: 72.1,
        lastAudit: "2024-01-05",
        nextAudit: "2024-01-20",
        issues: 8,
      },
    ])

    // Mock audit logs
    setAuditLogs([
      {
        id: "1",
        action: "Patient record accessed",
        user: "Dr. Sarah Mitchell",
        timestamp: "2024-01-15T10:30:00Z",
        details: "Accessed patient ID: 12345 for consultation",
        category: "access",
      },
      {
        id: "2",
        action: "Medical record updated",
        user: "Dr. Michael Chen",
        timestamp: "2024-01-15T09:15:00Z",
        details: "Updated diagnosis for patient ID: 67890",
        category: "modification",
      },
      {
        id: "3",
        action: "User account created",
        user: "Admin User",
        timestamp: "2024-01-15T08:45:00Z",
        details: "Created new doctor account for Dr. Jennifer Lee",
        category: "creation",
      },
      {
        id: "4",
        action: "Prescription deleted",
        user: "Dr. Sarah Mitchell",
        timestamp: "2024-01-14T16:20:00Z",
        details: "Deleted incorrect prescription for patient ID: 11111",
        category: "deletion",
      },
    ])
  }, [])

  const getStatusColor = (status: string) => {
    switch (status) {
      case "compliant":
        return "default"
      case "warning":
        return "secondary"
      case "non-compliant":
        return "destructive"
      default:
        return "secondary"
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "compliant":
        return <CheckCircle className="w-4 h-4" />
      case "warning":
        return <Clock className="w-4 h-4" />
      case "non-compliant":
        return <AlertTriangle className="w-4 h-4" />
      default:
        return <AlertTriangle className="w-4 h-4" />
    }
  }

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "access":
        return "default"
      case "modification":
        return "secondary"
      case "deletion":
        return "destructive"
      case "creation":
        return "default"
      default:
        return "secondary"
    }
  }

  return (
    <DashboardLayout 
      headerContent={{
        title: "Compliance Monitoring",
        description: "Monitor regulatory compliance and audit trails",
        actions: (
          <>
            <Button variant="outline">
              <Download className="w-4 h-4 mr-2" />
              Export Report
            </Button>
            <Button>Run Audit</Button>
          </>
        )
      }}
    >
      <div className="space-y-6">
        <Tabs defaultValue="reports" className="space-y-4">
          <TabsList>
            <TabsTrigger value="reports">Compliance Reports</TabsTrigger>
            <TabsTrigger value="audit">Audit Logs</TabsTrigger>
            <TabsTrigger value="policies">Policies</TabsTrigger>
          </TabsList>

          <TabsContent value="reports" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {reports.map((report) => (
                <Card key={report.id}>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="flex items-center gap-2">
                        <Shield className="w-5 h-5" />
                        {report.type} Compliance
                      </CardTitle>
                      <Badge variant={getStatusColor(report.status)} className="flex items-center gap-1">
                        {getStatusIcon(report.status)}
                        {report.status}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium">Compliance Score</span>
                        <span className="text-2xl font-bold">{report.score}%</span>
                      </div>
                      <div className="w-full bg-muted rounded-full h-2">
                        <div
                          className={`h-2 rounded-full ${
                            report.score >= 90 ? "bg-success" : report.score >= 75 ? "bg-warning" : "bg-destructive"
                          }`}
                          style={{ width: `${report.score}%` }}
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-muted-foreground">Last Audit</span>
                        <p className="font-medium">{new Date(report.lastAudit).toLocaleDateString()}</p>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Next Audit</span>
                        <p className="font-medium">{new Date(report.nextAudit).toLocaleDateString()}</p>
                      </div>
                    </div>

                    {report.issues > 0 && (
                      <div className="flex items-center gap-2 p-3 bg-destructive/10 rounded-lg">
                        <AlertTriangle className="w-4 h-4 text-destructive" />
                        <span className="text-sm">
                          <strong>{report.issues}</strong> issues require attention
                        </span>
                      </div>
                    )}

                    <div className="flex gap-2">
                      <Button size="sm" variant="outline" className="flex-1 bg-transparent">
                        <Eye className="w-4 h-4 mr-2" />
                        View Details
                      </Button>
                      <Button size="sm" variant="outline" className="flex-1 bg-transparent">
                        <Download className="w-4 h-4 mr-2" />
                        Download
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="audit" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Audit Trail</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {auditLogs.map((log) => (
                    <div key={log.id} className="flex items-start justify-between p-4 border rounded-lg">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <h4 className="font-medium">{log.action}</h4>
                          <Badge variant={getCategoryColor(log.category)}>{log.category}</Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">{log.details}</p>
                        <div className="flex items-center gap-4 text-xs text-muted-foreground">
                          <span>User: {log.user}</span>
                          <span>Time: {new Date(log.timestamp).toLocaleString()}</span>
                        </div>
                      </div>
                      <Button size="sm" variant="outline">
                        <Eye className="w-4 h-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="policies" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Compliance Policies</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="p-4 border rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-medium">HIPAA Privacy Policy</h4>
                      <Badge variant="default">Active</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mb-3">
                      Comprehensive privacy policy ensuring HIPAA compliance for patient data protection.
                    </p>
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline" className="bg-transparent">
                        <FileText className="w-4 h-4 mr-2" />
                        View Policy
                      </Button>
                      <Button size="sm" variant="outline" className="bg-transparent">
                        Edit
                      </Button>
                    </div>
                  </div>

                  <div className="p-4 border rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-medium">Data Security Standards</h4>
                      <Badge variant="default">Active</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mb-3">
                      Security standards and protocols for protecting sensitive medical information.
                    </p>
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline" className="bg-transparent">
                        <FileText className="w-4 h-4 mr-2" />
                        View Policy
                      </Button>
                      <Button size="sm" variant="outline" className="bg-transparent">
                        Edit
                      </Button>
                    </div>
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
