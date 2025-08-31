"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { Calendar, Clock, Plus, Video, Phone, User, MapPin, MoreHorizontal, MessageSquare } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

interface Appointment {
  id: string
  doctorName: string
  doctorSpecialty: string
  date: string
  time: string
  type: "in-person" | "video" | "phone"
  status: "upcoming" | "completed" | "cancelled"
  reason: string
  location?: string
  notes?: string
  fee: number
}

const mockAppointments: Appointment[] = [
  {
    id: "A001",
    doctorName: "Dr. Sarah Mitchell",
    doctorSpecialty: "Cardiology",
    date: "2024-12-20",
    time: "10:00 AM",
    type: "in-person",
    status: "upcoming",
    reason: "Routine Checkup",
    location: "Downtown Medical Center",
    fee: 200,
  },
  {
    id: "A002",
    doctorName: "Dr. Michael Chen",
    doctorSpecialty: "Neurology",
    date: "2024-12-18",
    time: "2:30 PM",
    type: "video",
    status: "upcoming",
    reason: "Follow-up Consultation",
    fee: 225,
  },
  {
    id: "A003",
    doctorName: "Dr. Emily Rodriguez",
    doctorSpecialty: "Dermatology",
    date: "2024-12-10",
    time: "11:00 AM",
    type: "in-person",
    status: "completed",
    reason: "Skin Consultation",
    location: "Skin Care Specialists",
    fee: 180,
  },
  {
    id: "A004",
    doctorName: "Dr. James Wilson",
    doctorSpecialty: "Orthopedics",
    date: "2024-11-28",
    time: "3:00 PM",
    type: "phone",
    status: "completed",
    reason: "Prescription Review",
    fee: 176,
  },
]

export function PatientAppointments() {
  const [user, setUser] = useState<any>(null)
  const [appointments, setAppointments] = useState<Appointment[]>(mockAppointments)

  useEffect(() => {
    const userData = localStorage.getItem("user")
    if (userData) {
      setUser(JSON.parse(userData))
    }
  }, [])

  const upcomingAppointments = appointments.filter((apt) => apt.status === "upcoming")
  const completedAppointments = appointments.filter((apt) => apt.status === "completed")
  const cancelledAppointments = appointments.filter((apt) => apt.status === "cancelled")

  const getStatusColor = (status: string) => {
    switch (status) {
      case "upcoming":
        return "bg-primary/10 text-primary"
      case "completed":
        return "bg-success/10 text-success"
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
      default:
        return <User className="w-4 h-4" />
    }
  }

  const AppointmentCard = ({ appointment }: { appointment: Appointment }) => (
    <Card className="hover:shadow-md transition-shadow">
      <CardContent className="p-6">
        <div className="flex items-start justify-between">
          <div className="flex items-start gap-4 flex-1">
            <Avatar className="h-12 w-12">
              <AvatarFallback className="bg-primary/10 text-primary">
                {appointment.doctorName
                  .split(" ")
                  .map((n) => n[0])
                  .join("")}
              </AvatarFallback>
            </Avatar>

            <div className="flex-1 space-y-2">
              <div>
                <h3 className="font-semibold text-lg">{appointment.doctorName}</h3>
                <p className="text-primary text-sm">{appointment.doctorSpecialty}</p>
              </div>

              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <div className="flex items-center gap-1">
                  <Calendar className="w-4 h-4" />
                  <span>{new Date(appointment.date).toLocaleDateString()}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Clock className="w-4 h-4" />
                  <span>{appointment.time}</span>
                </div>
                <div className="flex items-center gap-1">
                  {getTypeIcon(appointment.type)}
                  <span className="capitalize">{appointment.type}</span>
                </div>
              </div>

              <div className="space-y-1">
                <p className="text-sm">
                  <span className="font-medium">Reason:</span> {appointment.reason}
                </p>
                {appointment.location && (
                  <div className="flex items-center gap-1 text-sm text-muted-foreground">
                    <MapPin className="w-4 h-4" />
                    <span>{appointment.location}</span>
                  </div>
                )}
              </div>

              <div className="flex items-center gap-2">
                <Badge className={getStatusColor(appointment.status)}>{appointment.status}</Badge>
                <span className="text-sm font-medium">${appointment.fee}</span>
              </div>
            </div>
          </div>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm">
                <MoreHorizontal className="w-4 h-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {appointment.status === "upcoming" && (
                <>
                  {appointment.type === "video" && (
                    <DropdownMenuItem>
                      <Video className="w-4 h-4 mr-2" />
                      Join Video Call
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuItem>
                    <MessageSquare className="w-4 h-4 mr-2" />
                    Message Doctor
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Calendar className="w-4 h-4 mr-2" />
                    Reschedule
                  </DropdownMenuItem>
                  <DropdownMenuItem className="text-destructive">Cancel Appointment</DropdownMenuItem>
                </>
              )}
              {appointment.status === "completed" && (
                <>
                  <DropdownMenuItem>View Medical Records</DropdownMenuItem>
                  <DropdownMenuItem>
                    <Calendar className="w-4 h-4 mr-2" />
                    Book Follow-up
                  </DropdownMenuItem>
                </>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardContent>
    </Card>
  )

  if (!user) return null

  return (
    <DashboardLayout 
      headerContent={{
        title: "My Appointments",
        description: "Manage your healthcare appointments",
        actions: (
          <Link href="/patient/doctors">
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Book New Appointment
            </Button>
          </Link>
        )
      }}
    >
      <div className="space-y-6">
        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Upcoming</p>
                  <p className="text-2xl font-bold text-primary">{upcomingAppointments.length}</p>
                </div>
                <Calendar className="w-8 h-8 text-primary" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Completed</p>
                  <p className="text-2xl font-bold text-success">{completedAppointments.length}</p>
                </div>
                <div className="w-8 h-8 bg-success/10 rounded-full flex items-center justify-center">
                  <Clock className="w-4 h-4 text-success" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">This Month</p>
                  <p className="text-2xl font-bold">
                    {appointments.filter((a) => new Date(a.date).getMonth() === new Date().getMonth()).length}
                  </p>
                </div>
                <Calendar className="w-8 h-8 text-accent" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Appointments Tabs */}
        <Tabs defaultValue="upcoming" className="space-y-6">
          <TabsList>
            <TabsTrigger value="upcoming">Upcoming ({upcomingAppointments.length})</TabsTrigger>
            <TabsTrigger value="completed">Completed ({completedAppointments.length})</TabsTrigger>
            <TabsTrigger value="cancelled">Cancelled ({cancelledAppointments.length})</TabsTrigger>
          </TabsList>

          <TabsContent value="upcoming" className="space-y-4">
            {upcomingAppointments.length === 0 ? (
              <Card>
                <CardContent className="p-12 text-center">
                  <Calendar className="w-12 h-12 mx-auto mb-4 text-muted-foreground opacity-50" />
                  <h3 className="text-lg font-semibold mb-2">No upcoming appointments</h3>
                  <p className="text-muted-foreground mb-4">
                    Book your next appointment with a healthcare professional
                  </p>
                  <Link href="/patient/doctors">
                    <Button>Find Doctors</Button>
                  </Link>
                </CardContent>
              </Card>
            ) : (
              upcomingAppointments.map((appointment) => (
                <AppointmentCard key={appointment.id} appointment={appointment} />
              ))
            )}
          </TabsContent>

          <TabsContent value="completed" className="space-y-4">
            {completedAppointments.map((appointment) => (
              <AppointmentCard key={appointment.id} appointment={appointment} />
            ))}
          </TabsContent>

          <TabsContent value="cancelled" className="space-y-4">
            {cancelledAppointments.length === 0 ? (
              <Card>
                <CardContent className="p-12 text-center">
                  <p className="text-muted-foreground">No cancelled appointments</p>
                </CardContent>
              </Card>
            ) : (
              cancelledAppointments.map((appointment) => (
                <AppointmentCard key={appointment.id} appointment={appointment} />
              ))
            )}
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  )
}
