"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { DashboardLayout } from "@/components/layout/dashboard-layout"
import {
  Search,
  Plus,
  Filter,
  MoreHorizontal,
  Phone,
  Mail,
  Calendar,
  FileText,
  Heart,
  AlertTriangle,
} from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

interface Patient {
  id: string
  name: string
  email: string
  phone: string
  age: number
  lastVisit: string
  nextAppointment?: string
  condition: string
  status: "active" | "inactive" | "critical"
  avatar?: string
}

const mockPatients: Patient[] = [
  {
    id: "1",
    name: "Sarah Johnson",
    email: "sarah.j@email.com",
    phone: "(555) 123-4567",
    age: 34,
    lastVisit: "2024-12-10",
    nextAppointment: "2024-12-20",
    condition: "Hypertension",
    status: "active",
  },
  {
    id: "2",
    name: "Michael Chen",
    email: "m.chen@email.com",
    phone: "(555) 234-5678",
    age: 45,
    lastVisit: "2024-12-08",
    nextAppointment: "2024-12-18",
    condition: "Diabetes Type 2",
    status: "active",
  },
  {
    id: "3",
    name: "Emily Rodriguez",
    email: "emily.r@email.com",
    phone: "(555) 345-6789",
    age: 28,
    lastVisit: "2024-12-05",
    condition: "Asthma",
    status: "critical",
  },
  {
    id: "4",
    name: "David Wilson",
    email: "d.wilson@email.com",
    phone: "(555) 456-7890",
    age: 52,
    lastVisit: "2024-11-28",
    condition: "Routine Checkup",
    status: "inactive",
  },
]

export function PatientManagement() {
  const [user, setUser] = useState<any>(null)
  const [patients, setPatients] = useState<Patient[]>(mockPatients)
  const [searchTerm, setSearchTerm] = useState("")
  const [filterStatus, setFilterStatus] = useState<string>("all")

  useEffect(() => {
    const userData = localStorage.getItem("user")
    if (userData) {
      setUser(JSON.parse(userData))
    }
  }, [])

  const filteredPatients = patients.filter((patient) => {
    const matchesSearch =
      patient.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      patient.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      patient.condition.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesFilter = filterStatus === "all" || patient.status === filterStatus
    return matchesSearch && matchesFilter
  })

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-success/10 text-success"
      case "critical":
        return "bg-destructive/10 text-destructive"
      case "inactive":
        return "bg-muted text-muted-foreground"
      default:
        return "bg-muted text-muted-foreground"
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "active":
        return <Heart className="w-3 h-3" />
      case "critical":
        return <AlertTriangle className="w-3 h-3" />
      default:
        return null
    }
  }

  if (!user) return null

  return (
    <DashboardLayout user={user}>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Patient Management</h1>
            <p className="text-muted-foreground">Manage your patient records and appointments</p>
          </div>
          <Button>
            <Plus className="w-4 h-4 mr-2" />
            Add Patient
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Total Patients</p>
                  <p className="text-2xl font-bold">{patients.length}</p>
                </div>
                <Heart className="w-8 h-8 text-primary" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Active</p>
                  <p className="text-2xl font-bold text-success">
                    {patients.filter((p) => p.status === "active").length}
                  </p>
                </div>
                <div className="w-8 h-8 bg-success/10 rounded-full flex items-center justify-center">
                  <Heart className="w-4 h-4 text-success" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Critical</p>
                  <p className="text-2xl font-bold text-destructive">
                    {patients.filter((p) => p.status === "critical").length}
                  </p>
                </div>
                <div className="w-8 h-8 bg-destructive/10 rounded-full flex items-center justify-center">
                  <AlertTriangle className="w-4 h-4 text-destructive" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">This Week</p>
                  <p className="text-2xl font-bold">12</p>
                </div>
                <Calendar className="w-8 h-8 text-accent" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Search and Filter */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Patient List</CardTitle>
              <div className="flex items-center gap-2">
                <div className="relative">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search patients..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 w-64"
                  />
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" size="sm">
                      <Filter className="w-4 h-4 mr-2" />
                      Filter
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    <DropdownMenuItem onClick={() => setFilterStatus("all")}>All Patients</DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setFilterStatus("active")}>Active Only</DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setFilterStatus("critical")}>Critical Only</DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setFilterStatus("inactive")}>Inactive Only</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Patient</TableHead>
                  <TableHead>Contact</TableHead>
                  <TableHead>Age</TableHead>
                  <TableHead>Condition</TableHead>
                  <TableHead>Last Visit</TableHead>
                  <TableHead>Next Appointment</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="w-[50px]"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredPatients.map((patient) => (
                  <TableRow key={patient.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar className="h-8 w-8">
                          <AvatarFallback className="bg-primary/10 text-primary">
                            {patient.name
                              .split(" ")
                              .map((n) => n[0])
                              .join("")}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium">{patient.name}</p>
                          <p className="text-sm text-muted-foreground">ID: {patient.id}</p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        <div className="flex items-center gap-1 text-sm">
                          <Mail className="w-3 h-3" />
                          {patient.email}
                        </div>
                        <div className="flex items-center gap-1 text-sm">
                          <Phone className="w-3 h-3" />
                          {patient.phone}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>{patient.age}</TableCell>
                    <TableCell>{patient.condition}</TableCell>
                    <TableCell>{new Date(patient.lastVisit).toLocaleDateString()}</TableCell>
                    <TableCell>
                      {patient.nextAppointment ? (
                        <Badge variant="outline" className="bg-primary/10 text-primary">
                          {new Date(patient.nextAppointment).toLocaleDateString()}
                        </Badge>
                      ) : (
                        <span className="text-muted-foreground">None scheduled</span>
                      )}
                    </TableCell>
                    <TableCell>
                      <Badge className={getStatusColor(patient.status)}>
                        {getStatusIcon(patient.status)}
                        <span className="ml-1 capitalize">{patient.status}</span>
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm">
                            <MoreHorizontal className="w-4 h-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem>
                            <FileText className="w-4 h-4 mr-2" />
                            View Records
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Calendar className="w-4 h-4 mr-2" />
                            Schedule Appointment
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Phone className="w-4 h-4 mr-2" />
                            Contact Patient
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}
