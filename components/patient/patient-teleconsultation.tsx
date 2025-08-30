"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { Video, Phone, Calendar, Clock, Settings, Play, CheckCircle } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"

interface PatientSession {
  id: string
  doctorName: string
  doctorSpecialty: string
  scheduledTime: string
  duration: number
  status: "scheduled" | "ready" | "in-progress" | "completed"
  type: "video" | "phone"
  reason: string
  roomId?: string
  instructions?: string
}

const mockSessions: PatientSession[] = [
  {
    id: "PS001",
    doctorName: "Dr. Sarah Mitchell",
    doctorSpecialty: "Cardiology",
    scheduledTime: "2024-12-16T10:00:00Z",
    duration: 30,
    status: "ready",
    type: "video",
    reason: "Follow-up consultation",
    roomId: "room-ps001",
    instructions: "Please have your blood pressure readings ready for discussion.",
  },
  {
    id: "PS002",
    doctorName: "Dr. Michael Chen",
    doctorSpecialty: "Neurology",
    scheduledTime: "2024-12-18T14:30:00Z",
    duration: 45,
    status: "scheduled",
    type: "video",
    reason: "Specialist consultation",
    roomId: "room-ps002",
  },
]

export function PatientTeleconsultation() {
  const [user, setUser] = useState<any>(null)
  const [sessions, setSessions] = useState<PatientSession[]>(mockSessions)
  const [currentTime, setCurrentTime] = useState(new Date())

  useEffect(() => {
    const userData = localStorage.getItem("user")
    if (userData) {
      setUser(JSON.parse(userData))
    }

    const interval = setInterval(() => {
      setCurrentTime(new Date())
    }, 60000)

    return () => clearInterval(interval)
  }, [])

  const getStatusColor = (status: string) => {
    switch (status) {
      case "ready":
        return "bg-success/10 text-success"
      case "in-progress":
        return "bg-primary/10 text-primary"
      case "scheduled":
        return "bg-muted text-muted-foreground"
      case "completed":
        return "bg-accent/10 text-accent"
      default:
        return "bg-muted text-muted-foreground"
    }
  }

  const getTypeIcon = (type: string) => {
    return type === "video" ? <Video className="w-4 h-4" /> : <Phone className="w-4 h-4" />
  }

  const readySessions = sessions.filter((s) => s.status === "ready")
  const upcomingSessions = sessions.filter((s) => s.status === "scheduled")

  if (!user) return null

  return (
    <DashboardLayout user={user}>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-3">
            <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
              <Video className="w-6 h-6 text-primary" />
            </div>
            My Teleconsultations
          </h1>
          <p className="text-muted-foreground">Join your virtual appointments with healthcare providers</p>
        </div>

        {/* Ready Sessions Alert */}
        {readySessions.length > 0 && (
          <Alert className="border-success bg-success/5">
            <CheckCircle className="h-4 w-4 text-success" />
            <AlertDescription>
              <div className="flex items-center justify-between">
                <span>Your doctor is ready for your appointment!</span>
                <Link href={`/teleconsultation/room/${readySessions[0].roomId}`}>
                  <Button size="sm" className="ml-4">
                    <Play className="w-4 h-4 mr-2" />
                    Join Now
                  </Button>
                </Link>
              </div>
            </AlertDescription>
          </Alert>
        )}

        {/* System Check */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings className="w-5 h-5" />
              System Check
            </CardTitle>
            <CardDescription>Ensure your device is ready for teleconsultation</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="flex items-center gap-3 p-3 bg-success/10 rounded-lg">
                <div className="w-8 h-8 bg-success rounded-full flex items-center justify-center">
                  <CheckCircle className="w-4 h-4 text-white" />
                </div>
                <div>
                  <p className="font-medium text-success">Camera</p>
                  <p className="text-sm text-muted-foreground">Working</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 bg-success/10 rounded-lg">
                <div className="w-8 h-8 bg-success rounded-full flex items-center justify-center">
                  <CheckCircle className="w-4 h-4 text-white" />
                </div>
                <div>
                  <p className="font-medium text-success">Microphone</p>
                  <p className="text-sm text-muted-foreground">Working</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 bg-success/10 rounded-lg">
                <div className="w-8 h-8 bg-success rounded-full flex items-center justify-center">
                  <CheckCircle className="w-4 h-4 text-white" />
                </div>
                <div>
                  <p className="font-medium text-success">Connection</p>
                  <p className="text-sm text-muted-foreground">Stable</p>
                </div>
              </div>
            </div>
            <Button variant="outline" className="mt-4 bg-transparent">
              <Settings className="w-4 h-4 mr-2" />
              Test Audio & Video
            </Button>
          </CardContent>
        </Card>

        {/* Upcoming Sessions */}
        <Card>
          <CardHeader>
            <CardTitle>Upcoming Appointments</CardTitle>
            <CardDescription>Your scheduled teleconsultations</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {sessions.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <Video className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p>No upcoming teleconsultations</p>
                <Link href="/patient/doctors">
                  <Button className="mt-4">Book Appointment</Button>
                </Link>
              </div>
            ) : (
              sessions.map((session) => (
                <div key={session.id} className="border rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <Avatar className="h-12 w-12">
                        <AvatarFallback className="bg-primary/10 text-primary">
                          {session.doctorName
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <h3 className="font-semibold">{session.doctorName}</h3>
                        <p className="text-sm text-primary">{session.doctorSpecialty}</p>
                        <p className="text-sm text-muted-foreground">{session.reason}</p>
                        <div className="flex items-center gap-4 mt-2 text-sm">
                          <div className="flex items-center gap-1">
                            <Calendar className="w-4 h-4" />
                            <span>{new Date(session.scheduledTime).toLocaleDateString()}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Clock className="w-4 h-4" />
                            <span>{new Date(session.scheduledTime).toLocaleTimeString()}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            {getTypeIcon(session.type)}
                            <span className="capitalize">{session.type}</span>
                          </div>
                          <span>{session.duration} min</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <Badge className={getStatusColor(session.status)}>{session.status}</Badge>
                      {session.status === "ready" && session.roomId && (
                        <Link href={`/teleconsultation/room/${session.roomId}`}>
                          <Button>
                            <Play className="w-4 h-4 mr-2" />
                            Join Call
                          </Button>
                        </Link>
                      )}
                      {session.status === "scheduled" && (
                        <Button variant="outline" disabled>
                          <Clock className="w-4 h-4 mr-2" />
                          Waiting
                        </Button>
                      )}
                    </div>
                  </div>

                  {session.instructions && (
                    <div className="mt-4 p-3 bg-muted/50 rounded-lg">
                      <p className="text-sm">
                        <span className="font-medium">Instructions:</span> {session.instructions}
                      </p>
                    </div>
                  )}
                </div>
              ))
            )}
          </CardContent>
        </Card>

        {/* Preparation Tips */}
        <Card>
          <CardHeader>
            <CardTitle>Preparation Tips</CardTitle>
            <CardDescription>Get the most out of your teleconsultation</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-3">
                <h4 className="font-medium">Before Your Call:</h4>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li className="flex items-start gap-2">
                    <span className="text-primary">•</span>
                    Test your camera and microphone
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary">•</span>
                    Find a quiet, well-lit space
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary">•</span>
                    Prepare your questions and concerns
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary">•</span>
                    Have your medications ready
                  </li>
                </ul>
              </div>
              <div className="space-y-3">
                <h4 className="font-medium">During Your Call:</h4>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li className="flex items-start gap-2">
                    <span className="text-primary">•</span>
                    Speak clearly and look at the camera
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary">•</span>
                    Take notes of important information
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary">•</span>
                    Ask questions if something is unclear
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary">•</span>
                    Follow your doctor's instructions
                  </li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}
