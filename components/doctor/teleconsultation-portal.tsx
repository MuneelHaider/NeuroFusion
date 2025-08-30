"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { Video, Phone, Calendar, Clock, FileText, Settings, Play, Users } from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

interface TeleconsultationSession {
  id: string
  patientName: string
  patientId: string
  scheduledTime: string
  duration: number
  status: "scheduled" | "waiting" | "in-progress" | "completed" | "missed"
  type: "video" | "phone"
  reason: string
  roomId?: string
}

interface CallHistory {
  id: string
  patientName: string
  date: string
  duration: number
  type: "video" | "phone"
  status: "completed" | "missed"
  notes?: string
}

const mockSessions: TeleconsultationSession[] = [
  {
    id: "TC001",
    patientName: "Sarah Johnson",
    patientId: "P001",
    scheduledTime: "2024-12-16T10:00:00Z",
    duration: 30,
    status: "waiting",
    type: "video",
    reason: "Follow-up consultation",
    roomId: "room-tc001",
  },
  {
    id: "TC002",
    patientName: "Michael Chen",
    patientId: "P002",
    scheduledTime: "2024-12-16T14:30:00Z",
    duration: 45,
    status: "scheduled",
    type: "video",
    reason: "Specialist consultation",
    roomId: "room-tc002",
  },
  {
    id: "TC003",
    patientName: "Emily Rodriguez",
    patientId: "P003",
    scheduledTime: "2024-12-16T16:00:00Z",
    duration: 30,
    status: "scheduled",
    type: "phone",
    reason: "Prescription review",
  },
]

const mockCallHistory: CallHistory[] = [
  {
    id: "CH001",
    patientName: "David Wilson",
    date: "2024-12-15T11:00:00Z",
    duration: 25,
    type: "video",
    status: "completed",
    notes: "Discussed medication adjustments. Patient responding well to treatment.",
  },
  {
    id: "CH002",
    patientName: "Lisa Anderson",
    date: "2024-12-15T15:30:00Z",
    duration: 35,
    type: "video",
    status: "completed",
    notes: "Routine checkup. All vitals normal. Scheduled follow-up in 3 months.",
  },
  {
    id: "CH003",
    patientName: "Robert Kim",
    date: "2024-12-14T09:15:00Z",
    duration: 0,
    type: "video",
    status: "missed",
  },
]

export function TeleconsultationPortal() {
  const [user, setUser] = useState<any>(null)
  const [sessions, setSessions] = useState<TeleconsultationSession[]>(mockSessions)
  const [callHistory, setCallHistory] = useState<CallHistory[]>(mockCallHistory)
  const [currentTime, setCurrentTime] = useState(new Date())

  useEffect(() => {
    const userData = localStorage.getItem("user")
    if (userData) {
      setUser(JSON.parse(userData))
    }

    // Update current time every minute
    const interval = setInterval(() => {
      setCurrentTime(new Date())
    }, 60000)

    return () => clearInterval(interval)
  }, [])

  const getStatusColor = (status: string) => {
    switch (status) {
      case "waiting":
        return "bg-warning/10 text-warning"
      case "in-progress":
        return "bg-success/10 text-success"
      case "scheduled":
        return "bg-primary/10 text-primary"
      case "completed":
        return "bg-muted text-muted-foreground"
      case "missed":
        return "bg-destructive/10 text-destructive"
      default:
        return "bg-muted text-muted-foreground"
    }
  }

  const getTypeIcon = (type: string) => {
    return type === "video" ? <Video className="w-4 h-4" /> : <Phone className="w-4 h-4" />
  }

  const isSessionActive = (session: TeleconsultationSession) => {
    const sessionTime = new Date(session.scheduledTime)
    const timeDiff = Math.abs(currentTime.getTime() - sessionTime.getTime())
    return timeDiff <= 15 * 60 * 1000 // Within 15 minutes
  }

  const waitingSessions = sessions.filter((s) => s.status === "waiting")
  const upcomingSessions = sessions.filter((s) => s.status === "scheduled")

  if (!user) return null

  return (
    <DashboardLayout user={user}>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold flex items-center gap-3">
              <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                <Video className="w-6 h-6 text-primary" />
              </div>
              Teleconsultation Portal
            </h1>
            <p className="text-muted-foreground">Manage your virtual consultations and video calls</p>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline">
              <Settings className="w-4 h-4 mr-2" />
              Call Settings
            </Button>
            <Button>
              <Calendar className="w-4 h-4 mr-2" />
              Schedule Session
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Waiting Patients</p>
                  <p className="text-2xl font-bold text-warning">{waitingSessions.length}</p>
                </div>
                <div className="w-8 h-8 bg-warning/10 rounded-full flex items-center justify-center">
                  <Users className="w-4 h-4 text-warning" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Today's Sessions</p>
                  <p className="text-2xl font-bold">{sessions.length}</p>
                </div>
                <Video className="w-8 h-8 text-primary" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Completed Today</p>
                  <p className="text-2xl font-bold text-success">
                    {callHistory.filter((c) => c.status === "completed").length}
                  </p>
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
                  <p className="text-sm text-muted-foreground">Avg Duration</p>
                  <p className="text-2xl font-bold">28min</p>
                </div>
                <Clock className="w-8 h-8 text-accent" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Waiting Patients Alert */}
        {waitingSessions.length > 0 && (
          <Card className="border-warning bg-warning/5">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-warning">
                <Users className="w-5 h-5" />
                Patients Waiting ({waitingSessions.length})
              </CardTitle>
              <CardDescription>Patients are ready for their teleconsultation</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {waitingSessions.map((session) => (
                <div key={session.id} className="flex items-center justify-between p-3 bg-background rounded-lg">
                  <div className="flex items-center gap-3">
                    <Avatar className="h-10 w-10">
                      <AvatarFallback className="bg-primary/10 text-primary">
                        {session.patientName
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium">{session.patientName}</p>
                      <p className="text-sm text-muted-foreground">{session.reason}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge className={getStatusColor(session.status)}>
                      {getTypeIcon(session.type)}
                      <span className="ml-1">Waiting</span>
                    </Badge>
                    <Link href={`/teleconsultation/room/${session.roomId}`}>
                      <Button size="sm">
                        <Play className="w-4 h-4 mr-2" />
                        Join Call
                      </Button>
                    </Link>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        )}

        <Tabs defaultValue="upcoming" className="space-y-6">
          <TabsList>
            <TabsTrigger value="upcoming">Upcoming Sessions ({upcomingSessions.length})</TabsTrigger>
            <TabsTrigger value="history">Call History ({callHistory.length})</TabsTrigger>
          </TabsList>

          <TabsContent value="upcoming" className="space-y-4">
            {upcomingSessions.length === 0 ? (
              <Card>
                <CardContent className="p-12 text-center">
                  <Video className="w-12 h-12 mx-auto mb-4 text-muted-foreground opacity-50" />
                  <h3 className="text-lg font-semibold mb-2">No upcoming sessions</h3>
                  <p className="text-muted-foreground">Your teleconsultation schedule is clear</p>
                </CardContent>
              </Card>
            ) : (
              upcomingSessions.map((session) => (
                <Card key={session.id}>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <Avatar className="h-12 w-12">
                          <AvatarFallback className="bg-primary/10 text-primary">
                            {session.patientName
                              .split(" ")
                              .map((n) => n[0])
                              .join("")}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <h3 className="font-semibold text-lg">{session.patientName}</h3>
                          <p className="text-muted-foreground">{session.reason}</p>
                          <div className="flex items-center gap-4 mt-2 text-sm">
                            <div className="flex items-center gap-1">
                              <Clock className="w-4 h-4" />
                              <span>{new Date(session.scheduledTime).toLocaleTimeString()}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              {getTypeIcon(session.type)}
                              <span className="capitalize">{session.type} call</span>
                            </div>
                            <span>{session.duration} minutes</span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <Badge className={getStatusColor(session.status)}>{session.status}</Badge>
                        {isSessionActive(session) && session.roomId && (
                          <Link href={`/teleconsultation/room/${session.roomId}`}>
                            <Button>
                              <Play className="w-4 h-4 mr-2" />
                              Start Call
                            </Button>
                          </Link>
                        )}
                        {!isSessionActive(session) && (
                          <Button variant="outline" disabled>
                            <Clock className="w-4 h-4 mr-2" />
                            Scheduled
                          </Button>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </TabsContent>

          <TabsContent value="history" className="space-y-4">
            {callHistory.map((call) => (
              <Card key={call.id}>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <Avatar className="h-12 w-12">
                        <AvatarFallback className="bg-muted">
                          {call.patientName
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <h3 className="font-semibold">{call.patientName}</h3>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <span>{new Date(call.date).toLocaleDateString()}</span>
                          <div className="flex items-center gap-1">
                            {getTypeIcon(call.type)}
                            <span className="capitalize">{call.type}</span>
                          </div>
                          <span>{call.status === "completed" ? `${call.duration} minutes` : "No answer"}</span>
                        </div>
                        {call.notes && <p className="text-sm text-muted-foreground mt-1 max-w-md">{call.notes}</p>}
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <Badge className={getStatusColor(call.status)}>{call.status}</Badge>
                      <Button variant="outline" size="sm">
                        <FileText className="w-4 h-4 mr-2" />
                        View Notes
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  )
}
