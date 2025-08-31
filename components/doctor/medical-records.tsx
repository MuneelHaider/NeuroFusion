"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { DashboardLayout } from "@/components/layout/dashboard-layout"
import {
  Search,
  Plus,
  Filter,
  FileText,
  Calendar,
  User,
  Download,
  Eye,
  Edit,
  Trash2,
  AlertTriangle,
  CheckCircle,
  Clock,
  Heart,
  Brain,
  FileImage,
} from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

interface MedicalRecord {
  id: string
  patientName: string
  patientId: string
  recordType: "consultation" | "lab-result" | "imaging" | "prescription" | "procedure" | "vaccination"
  date: string
  doctor: string
  status: "active" | "archived" | "pending"
  priority: "low" | "medium" | "high" | "urgent"
  summary: string
  attachments: number
  lastUpdated: string
}

const mockMedicalRecords: MedicalRecord[] = [
  {
    id: "MR001",
    patientName: "Sarah Johnson",
    patientId: "P001",
    recordType: "consultation",
    date: "2024-12-15",
    doctor: "Dr. Haider",
    status: "active",
    priority: "medium",
    summary: "Routine checkup - Blood pressure elevated, prescribed ACE inhibitor",
    attachments: 3,
    lastUpdated: "2024-12-15T10:30:00Z",
  },
  {
    id: "MR002",
    patientName: "Michael Chen",
    patientId: "P002",
    recordType: "lab-result",
    date: "2024-12-14",
    doctor: "Dr. Haider",
    status: "active",
    priority: "high",
    summary: "Blood glucose levels elevated - HbA1c: 7.2%, requires medication adjustment",
    attachments: 2,
    lastUpdated: "2024-12-14T14:20:00Z",
  },
  {
    id: "MR003",
    patientName: "Emily Rodriguez",
    patientId: "P003",
    recordType: "imaging",
    date: "2024-12-13",
    doctor: "Dr. Haider",
    status: "active",
    priority: "medium",
    summary: "Chest X-ray - Normal heart size, clear lung fields, no acute abnormalities",
    attachments: 1,
    lastUpdated: "2024-12-13T11:15:00Z",
  },
  {
    id: "MR004",
    patientName: "David Wilson",
    patientId: "P004",
    recordType: "prescription",
    date: "2024-12-12",
    doctor: "Dr. Haider",
    status: "active",
    priority: "low",
    summary: "Prescription renewal - Metformin 500mg twice daily for diabetes management",
    attachments: 1,
    lastUpdated: "2024-12-12T16:45:00Z",
  },
  {
    id: "MR005",
    patientName: "Jennifer Lee",
    patientId: "P005",
    recordType: "procedure",
    date: "2024-12-10",
    doctor: "Dr. Haider",
    status: "active",
    priority: "high",
    summary: "Cardiac stress test - Positive for ischemia, recommended cardiac catheterization",
    attachments: 4,
    lastUpdated: "2024-12-10T09:30:00Z",
  },
  {
    id: "MR006",
    patientName: "Robert Brown",
    patientId: "P006",
    recordType: "vaccination",
    date: "2024-12-08",
    doctor: "Dr. Haider",
    status: "active",
    priority: "low",
    summary: "Annual flu vaccination - No adverse reactions, patient tolerated well",
    attachments: 1,
    lastUpdated: "2024-12-08T13:20:00Z",
  },
]

export function MedicalRecords() {
  const [user, setUser] = useState<any>(null)
  const [records, setRecords] = useState<MedicalRecord[]>(mockMedicalRecords)
  const [searchTerm, setSearchTerm] = useState("")
  const [filterType, setFilterType] = useState<string>("all")
  const [filterStatus, setFilterStatus] = useState<string>("all")
  const [filterPriority, setFilterPriority] = useState<string>("all")

  useEffect(() => {
    const userData = localStorage.getItem("user")
    if (userData) {
      setUser(JSON.parse(userData))
    }
  }, [])

  const filteredRecords = records.filter((record) => {
    const matchesSearch =
      record.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      record.summary.toLowerCase().includes(searchTerm.toLowerCase()) ||
      record.patientId.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesType = filterType === "all" || record.recordType === filterType
    const matchesStatus = filterStatus === "all" || record.status === filterStatus
    const matchesPriority = filterPriority === "all" || record.priority === filterPriority
    return matchesSearch && matchesType && matchesStatus && matchesPriority
  })

  const getRecordTypeIcon = (type: string) => {
    switch (type) {
      case "consultation":
        return <User className="w-4 h-4" />
      case "lab-result":
        return <FileText className="w-4 h-4" />
      case "imaging":
        return <FileImage className="w-4 h-4" />
      case "prescription":
        return <FileText className="w-4 h-4" />
      case "procedure":
        return <Heart className="w-4 h-4" />
      case "vaccination":
        return <CheckCircle className="w-4 h-4" />
      default:
        return <FileText className="w-4 h-4" />
    }
  }

  const getRecordTypeColor = (type: string) => {
    switch (type) {
      case "consultation":
        return "bg-blue-100 text-blue-800"
      case "lab-result":
        return "bg-green-100 text-green-800"
      case "imaging":
        return "bg-purple-100 text-purple-800"
      case "prescription":
        return "bg-orange-100 text-orange-800"
      case "procedure":
        return "bg-red-100 text-red-800"
      case "vaccination":
        return "bg-teal-100 text-teal-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "urgent":
        return "bg-red-100 text-red-800"
      case "high":
        return "bg-orange-100 text-orange-800"
      case "medium":
        return "bg-yellow-100 text-yellow-800"
      case "low":
        return "bg-green-100 text-green-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800"
      case "archived":
        return "bg-gray-100 text-gray-800"
      case "pending":
        return "bg-yellow-100 text-yellow-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getRecordTypeLabel = (type: string) => {
    return type.charAt(0).toUpperCase() + type.slice(1).replace("-", " ")
  }

  if (!user) return null

  return (
    <DashboardLayout 
      headerContent={{
        title: "Medical Records",
        description: "Manage and access patient medical records and documentation",
        actions: (
          <Button>
            <Plus className="w-4 h-4 mr-2" />
            New Record
          </Button>
        )
      }}
    >
      <div className="space-y-6">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Total Records</p>
                  <p className="text-2xl font-bold">{records.length}</p>
                </div>
                <FileText className="w-8 h-8 text-primary" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Active</p>
                  <p className="text-2xl font-bold text-success">
                    {records.filter((r) => r.status === "active").length}
                  </p>
                </div>
                <div className="w-8 h-8 bg-success/10 rounded-full flex items-center justify-center">
                  <CheckCircle className="w-4 h-4 text-success" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">High Priority</p>
                  <p className="text-2xl font-bold text-warning">
                    {records.filter((r) => r.priority === "high" || r.priority === "urgent").length}
                  </p>
                </div>
                <div className="w-8 h-8 bg-warning/10 rounded-full flex items-center justify-center">
                  <AlertTriangle className="w-4 h-4 text-warning" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">This Week</p>
                  <p className="text-2xl font-bold">8</p>
                </div>
                <Calendar className="w-8 h-8 text-accent" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Search and Filters */}
        <Card>
          <CardHeader>
            <CardTitle>Search Records</CardTitle>
            <CardDescription>Find specific medical records by patient, type, or content</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search by patient name, ID, or record content..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                className="px-3 py-2 border rounded-lg text-sm"
              >
                <option value="all">All Types</option>
                <option value="consultation">Consultations</option>
                <option value="lab-result">Lab Results</option>
                <option value="imaging">Imaging</option>
                <option value="prescription">Prescriptions</option>
                <option value="procedure">Procedures</option>
                <option value="vaccination">Vaccinations</option>
              </select>
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="px-3 py-2 border rounded-lg text-sm"
              >
                <option value="all">All Status</option>
                <option value="active">Active</option>
                <option value="archived">Archived</option>
                <option value="pending">Pending</option>
              </select>
              <select
                value={filterPriority}
                onChange={(e) => setFilterPriority(e.target.value)}
                className="px-3 py-2 border rounded-lg text-sm"
              >
                <option value="all">All Priorities</option>
                <option value="urgent">Urgent</option>
                <option value="high">High</option>
                <option value="medium">Medium</option>
                <option value="low">Low</option>
              </select>
            </div>
          </CardContent>
        </Card>

        {/* Records List */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Medical Records ({filteredRecords.length})</CardTitle>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm">
                  <Download className="w-4 h-4 mr-2" />
                  Export
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {filteredRecords.map((record) => (
                <div key={record.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                      {getRecordTypeIcon(record.recordType)}
                    </div>
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="font-medium">{record.patientName}</h4>
                        <Badge className={getRecordTypeColor(record.recordType)}>
                          {getRecordTypeLabel(record.recordType)}
                        </Badge>
                        <Badge className={getPriorityColor(record.priority)}>
                          {record.priority}
                        </Badge>
                        <Badge className={getStatusColor(record.status)}>
                          {record.status}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground mb-1">{record.summary}</p>
                      <div className="flex items-center gap-4 text-xs text-muted-foreground">
                        <span>Date: {new Date(record.date).toLocaleDateString()}</span>
                        <span>Attachments: {record.attachments}</span>
                        <span>Last updated: {new Date(record.lastUpdated).toLocaleDateString()}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button size="sm" variant="outline">
                      <Eye className="w-4 h-4" />
                    </Button>
                    <Button size="sm" variant="outline">
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button size="sm" variant="outline">
                      <Download className="w-4 h-4" />
                    </Button>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button size="sm" variant="outline">
                          <Filter className="w-4 h-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent>
                        <DropdownMenuItem>
                          <Eye className="w-4 h-4 mr-2" />
                          View Details
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Edit className="w-4 h-4 mr-2" />
                          Edit Record
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Download className="w-4 h-4 mr-2" />
                          Download
                        </DropdownMenuItem>
                        <DropdownMenuItem className="text-destructive">
                          <Trash2 className="w-4 h-4 mr-2" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
} 