"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { Calendar, Clock, Plus, ChevronLeft, ChevronRight, Video, MapPin, Phone } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface Appointment {
  id: string
  patientName: string
  patientId: string
  date: string
  time: string
  duration: number
  type: "in-person" | "video" | "phone"
  status: "scheduled" | "confirmed" | "completed" | "cancelled"
  reason: string
  notes?: string
}

const mockAppointments: Appointment[] = [
  // Today's appointments (January 2025)
  {
    id: "1",
    patientName: "Sarah Johnson",
    patientId: "P001",
    date: "2025-01-27",
    time: "09:00",
    duration: 30,
    type: "in-person",
    status: "confirmed",
    reason: "Routine Checkup",
    notes: "Patient reports mild chest discomfort"
  },
  {
    id: "2",
    patientName: "Michael Chen",
    patientId: "P002",
    date: "2025-01-27",
    time: "10:30",
    duration: 45,
    type: "video",
    status: "scheduled",
    reason: "Follow-up Consultation",
    notes: "Post-surgery recovery check"
  },
  {
    id: "3",
    patientName: "Emily Rodriguez",
    patientId: "P003",
    date: "2025-01-27",
    time: "14:00",
    duration: 60,
    type: "in-person",
    status: "confirmed",
    reason: "Specialist Consultation",
    notes: "Cardiac stress test results review"
  },
  {
    id: "4",
    patientName: "David Wilson",
    patientId: "P004",
    date: "2025-01-27",
    time: "15:30",
    duration: 30,
    type: "phone",
    status: "scheduled",
    reason: "Prescription Review",
    notes: "Blood pressure medication adjustment"
  },
  {
    id: "5",
    patientName: "Jennifer Lee",
    patientId: "P005",
    date: "2025-01-27",
    time: "16:00",
    duration: 45,
    type: "video",
    status: "confirmed",
    reason: "Emergency Consultation",
    notes: "Severe chest pain symptoms"
  },
  {
    id: "6",
    patientName: "Robert Brown",
    patientId: "P006",
    date: "2025-01-27",
    time: "17:00",
    duration: 30,
    type: "in-person",
    status: "scheduled",
    reason: "Routine Checkup",
    notes: "Annual physical examination"
  },

  // Tomorrow's appointments
  {
    id: "7",
    patientName: "Lisa Anderson",
    patientId: "P007",
    date: "2025-01-28",
    time: "08:00",
    duration: 60,
    type: "in-person",
    status: "confirmed",
    reason: "Cardiac Catheterization",
    notes: "Pre-procedure consultation"
  },
  {
    id: "8",
    patientName: "James Martinez",
    patientId: "P008",
    date: "2025-01-28",
    time: "09:30",
    duration: 45,
    type: "video",
    status: "scheduled",
    reason: "Follow-up Consultation",
    notes: "Post-angioplasty recovery"
  },
  {
    id: "9",
    patientName: "Amanda Taylor",
    patientId: "P009",
    date: "2025-01-28",
    time: "11:00",
    duration: 30,
    type: "in-person",
    status: "confirmed",
    reason: "Routine Checkup",
    notes: "Diabetes management review"
  },
  {
    id: "10",
    patientName: "Christopher Garcia",
    patientId: "P010",
    date: "2025-01-28",
    time: "13:00",
    duration: 45,
    type: "phone",
    status: "scheduled",
    reason: "Prescription Review",
    notes: "Cholesterol medication check"
  },
  {
    id: "11",
    patientName: "Nicole White",
    patientId: "P011",
    date: "2025-01-28",
    time: "14:30",
    duration: 60,
    type: "in-person",
    status: "confirmed",
    reason: "Specialist Consultation",
    notes: "Echocardiogram results discussion"
  },
  {
    id: "12",
    patientName: "Kevin Johnson",
    patientId: "P012",
    date: "2025-01-28",
    time: "16:00",
    duration: 30,
    type: "video",
    status: "scheduled",
    reason: "Follow-up Consultation",
    notes: "Post-heart attack recovery"
  },

  // This week's appointments
  {
    id: "13",
    patientName: "Rachel Davis",
    patientId: "P013",
    date: "2025-01-29",
    time: "09:00",
    duration: 45,
    type: "in-person",
    status: "confirmed",
    reason: "Routine Checkup",
    notes: "Hypertension monitoring"
  },
  {
    id: "14",
    patientName: "Thomas Miller",
    patientId: "P014",
    date: "2025-01-29",
    time: "10:30",
    duration: 60,
    type: "video",
    status: "scheduled",
    reason: "Emergency Consultation",
    notes: "Irregular heartbeat concerns"
  },
  {
    id: "15",
    patientName: "Jessica Thompson",
    patientId: "P015",
    date: "2025-01-29",
    time: "14:00",
    duration: 30,
    type: "in-person",
    status: "confirmed",
    reason: "Follow-up Consultation",
    notes: "Post-cardiac surgery check"
  },
  {
    id: "16",
    patientName: "Daniel Clark",
    patientId: "P016",
    date: "2025-01-30",
    time: "08:30",
    duration: 45,
    type: "phone",
    status: "scheduled",
    reason: "Prescription Review",
    notes: "Blood thinner dosage adjustment"
  },
  {
    id: "17",
    patientName: "Stephanie Lewis",
    patientId: "P017",
    date: "2025-01-30",
    time: "11:00",
    duration: 60,
    type: "in-person",
    status: "confirmed",
    reason: "Specialist Consultation",
    notes: "Cardiac MRI results review"
  },
  {
    id: "18",
    patientName: "Ryan Hall",
    patientId: "P018",
    date: "2025-01-30",
    time: "15:00",
    duration: 30,
    type: "video",
    status: "scheduled",
    reason: "Routine Checkup",
    notes: "Annual cardiac assessment"
  },
  {
    id: "19",
    patientName: "Megan Allen",
    patientId: "P019",
    date: "2025-01-31",
    time: "09:00",
    duration: 45,
    type: "in-person",
    status: "confirmed",
    reason: "Follow-up Consultation",
    notes: "Post-stent placement recovery"
  },
  {
    id: "20",
    patientName: "Andrew Young",
    patientId: "P020",
    date: "2025-01-31",
    time: "13:30",
    duration: 60,
    type: "video",
    status: "scheduled",
    reason: "Emergency Consultation",
    notes: "Chest pain evaluation"
  },
  {
    id: "21",
    patientName: "Lauren King",
    patientId: "P021",
    date: "2025-01-31",
    time: "16:00",
    duration: 30,
    type: "in-person",
    status: "confirmed",
    reason: "Routine Checkup",
    notes: "Cardiac risk assessment"
  },
  {
    id: "22",
    patientName: "Brandon Scott",
    patientId: "P022",
    date: "2025-02-01",
    time: "08:00",
    duration: 45,
    type: "phone",
    status: "scheduled",
    reason: "Prescription Review",
    notes: "Beta blocker medication check"
  },
  {
    id: "23",
    patientName: "Ashley Green",
    patientId: "P023",
    date: "2025-02-01",
    time: "10:00",
    duration: 60,
    type: "in-person",
    status: "confirmed",
    reason: "Specialist Consultation",
    notes: "Stress test preparation"
  },
  {
    id: "24",
    patientName: "Matthew Baker",
    patientId: "P024",
    date: "2025-02-01",
    time: "14:00",
    duration: 30,
    type: "video",
    status: "scheduled",
    reason: "Follow-up Consultation",
    notes: "Post-cardiac rehabilitation"
  },
  {
    id: "25",
    patientName: "Samantha Adams",
    patientId: "P025",
    date: "2025-02-01",
    time: "16:30",
    duration: 45,
    type: "in-person",
    status: "confirmed",
    reason: "Routine Checkup",
    notes: "Heart failure management"
  },
  
  // Additional appointments for next week
  {
    id: "26",
    patientName: "Alex Thompson",
    patientId: "P026",
    date: "2025-02-03",
    time: "09:00",
    duration: 45,
    type: "in-person",
    status: "confirmed",
    reason: "Cardiac Consultation",
    notes: "New patient with family history"
  },
  {
    id: "27",
    patientName: "Maria Garcia",
    patientId: "P027",
    date: "2025-02-03",
    time: "11:00",
    duration: 60,
    type: "video",
    status: "scheduled",
    reason: "Follow-up Consultation",
    notes: "Post-cardiac event monitoring"
  },
  {
    id: "28",
    patientName: "John Smith",
    patientId: "P028",
    date: "2025-02-04",
    time: "14:00",
    duration: 30,
    type: "phone",
    status: "scheduled",
    reason: "Prescription Review",
    notes: "Medication side effects discussion"
  },
  {
    id: "29",
    patientName: "Emma Wilson",
    patientId: "P029",
    date: "2025-02-04",
    time: "16:00",
    duration: 45,
    type: "in-person",
    status: "confirmed",
    reason: "Emergency Consultation",
    notes: "Chest tightness evaluation"
  },
  {
    id: "30",
    patientName: "Carlos Rodriguez",
    patientId: "P030",
    date: "2025-02-05",
    time: "08:30",
    duration: 60,
    type: "video",
    status: "scheduled",
    reason: "Specialist Consultation",
    notes: "Cardiac imaging results review"
  }
]

export function AppointmentScheduling() {
  const [user, setUser] = useState<any>(null)
  const [appointments, setAppointments] = useState<Appointment[]>(mockAppointments)
  const [selectedDate, setSelectedDate] = useState(new Date())
  const [viewMode, setViewMode] = useState<"day" | "week" | "month">("day")

  useEffect(() => {
    const userData = localStorage.getItem("user")
    if (userData) {
      setUser(JSON.parse(userData))
    }
  }, [])

  const getStatusColor = (status: string) => {
    switch (status) {
      case "confirmed":
        return "bg-success/10 text-success"
      case "scheduled":
        return "bg-primary/10 text-primary"
      case "completed":
        return "bg-muted text-muted-foreground"
      case "cancelled":
        return "bg-destructive/10 text-destructive"
      default:
        return "bg-muted text-muted-foreground"
    }
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "video":
        return <Video className="w-4 h-4" />
      case "phone":
        return <Phone className="w-4 h-4" />
      case "in-person":
        return <MapPin className="w-4 h-4" />
      default:
        return <Calendar className="w-4 h-4" />
    }
  }

  const todayAppointments = appointments.filter((apt) => apt.date === selectedDate.toISOString().split("T")[0])

  const upcomingAppointments = appointments
    .filter((apt) => new Date(apt.date) > new Date() && apt.status !== "cancelled")
    .slice(0, 5)

  if (!user) return null

  return (
    <DashboardLayout 
      headerContent={{
        title: "Appointment Scheduling",
        description: "Manage your appointments and schedule",
        actions: (
          <Button>
            <Plus className="w-4 h-4 mr-2" />
            New Appointment
          </Button>
        )
      }}
    >
      <div className="space-y-6">
        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Today</p>
                  <p className="text-2xl font-bold">{todayAppointments.length}</p>
                </div>
                <Calendar className="w-8 h-8 text-primary" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">This Week</p>
                  <p className="text-2xl font-bold">30</p>
                </div>
                <Clock className="w-8 h-8 text-accent" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Confirmed</p>
                  <p className="text-2xl font-bold text-success">
                    {appointments.filter((a) => a.status === "confirmed").length}
                  </p>
                </div>
                <div className="w-8 h-8 bg-success/10 rounded-full flex items-center justify-center">
                  <Calendar className="w-4 w-4 text-success" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Video Calls</p>
                  <p className="text-2xl font-bold">{appointments.filter((a) => a.type === "video").length}</p>
                </div>
                <Video className="w-8 h-8 text-primary" />
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Calendar View */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Schedule</CardTitle>
                <div className="flex items-center gap-2">
                  <Select value={viewMode} onValueChange={(value: any) => setViewMode(value)}>
                    <SelectTrigger className="w-32">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="day">Day</SelectItem>
                      <SelectItem value="week">Week</SelectItem>
                      <SelectItem value="month">Month</SelectItem>
                    </SelectContent>
                  </Select>
                  <div className="flex items-center gap-1">
                    <Button variant="outline" size="sm">
                      <ChevronLeft className="w-4 h-4" />
                    </Button>
                    <Button variant="outline" size="sm">
                      <ChevronRight className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </div>
              <CardDescription>
                {selectedDate.toLocaleDateString("en-US", {
                  weekday: "long",
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {todayAppointments.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    <Calendar className="w-12 h-12 mx-auto mb-4 opacity-50" />
                    <p>No appointments scheduled for today</p>
                  </div>
                ) : (
                  todayAppointments.map((appointment) => (
                    <div key={appointment.id} className="flex items-center gap-4 p-4 bg-muted/50 rounded-lg">
                      <div className="flex items-center gap-2 text-sm font-medium min-w-[80px]">
                        <Clock className="w-4 h-4" />
                        {appointment.time}
                      </div>

                      <div className="flex items-center gap-3 flex-1">
                        <Avatar className="h-8 w-8">
                          <AvatarFallback className="bg-primary/10 text-primary">
                            {appointment.patientName
                              .split(" ")
                              .map((n) => n[0])
                              .join("")}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <p className="font-medium">{appointment.patientName}</p>
                          <p className="text-sm text-muted-foreground">{appointment.reason}</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className="bg-transparent">
                          {getTypeIcon(appointment.type)}
                          <span className="ml-1 capitalize">{appointment.type}</span>
                        </Badge>
                        <Badge className={getStatusColor(appointment.status)}>{appointment.status}</Badge>
                      </div>

                      <div className="text-sm text-muted-foreground">{appointment.duration}min</div>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>

          {/* Upcoming Appointments */}
          <Card>
            <CardHeader>
              <CardTitle>Upcoming</CardTitle>
              <CardDescription>Next appointments this week</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {upcomingAppointments.map((appointment) => (
                <div key={appointment.id} className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                  <Avatar className="h-8 w-8">
                    <AvatarFallback className="bg-primary/10 text-primary">
                      {appointment.patientName
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <p className="font-medium text-sm">{appointment.patientName}</p>
                    <p className="text-xs text-muted-foreground">{appointment.reason}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <Badge variant="outline" className="text-xs bg-transparent">
                        {new Date(appointment.date).toLocaleDateString()}
                      </Badge>
                      <span className="text-xs text-muted-foreground">{appointment.time}</span>
                    </div>
                  </div>
                  {getTypeIcon(appointment.type)}
                </div>
              ))}

              <Button variant="outline" className="w-full bg-transparent">
                View All Upcoming
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  )
}
