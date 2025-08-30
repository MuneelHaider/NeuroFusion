"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { Calendar, Users, Brain, TrendingUp, Clock, MessageSquare, FileText, Activity } from "lucide-react"

interface User {
  id: string
  email: string
  name: string
  role: "doctor" | "patient"
  specialty?: string
  licenseNumber?: string
}

export function DoctorDashboard() {
  const [user, setUser] = useState<User | null>(null)

  useEffect(() => {
    const userData = localStorage.getItem("user")
    if (userData) {
      setUser(JSON.parse(userData))
    }
  }, [])

  if (!user) return null

  return (
    <DashboardLayout user={user}>
      <div className="space-y-6">
        {/* Welcome Section */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">
              Welcome back, Dr. {user.name.split(" ")[1] || user.name}
            </h1>
            <p className="text-muted-foreground mt-1">
              {user.specialty} • License: {user.licenseNumber}
            </p>
          </div>
          <Badge variant="secondary" className="bg-primary/10 text-primary">
            <Activity className="w-4 h-4 mr-2" />
            Active
          </Badge>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Today's Appointments</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">8</div>
              <p className="text-xs text-muted-foreground">+2 from yesterday</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Patients</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">247</div>
              <p className="text-xs text-muted-foreground">+12 this month</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">AI Diagnoses</CardTitle>
              <Brain className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">34</div>
              <p className="text-xs text-muted-foreground">This week</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Revenue</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">$12,450</div>
              <p className="text-xs text-muted-foreground">+8% from last month</p>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
              <CardDescription>Common tasks and shortcuts</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button className="w-full justify-start bg-transparent" variant="outline">
                <Calendar className="mr-2 h-4 w-4" />
                Schedule Appointment
              </Button>
              <Button className="w-full justify-start bg-transparent" variant="outline">
                <Brain className="mr-2 h-4 w-4" />
                AI Diagnosis Tool
              </Button>
              <Button className="w-full justify-start bg-transparent" variant="outline">
                <FileText className="mr-2 h-4 w-4" />
                View Medical Records
              </Button>
              <Button className="w-full justify-start bg-transparent" variant="outline">
                <MessageSquare className="mr-2 h-4 w-4" />
                Start Teleconsultation
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Upcoming Appointments</CardTitle>
              <CardDescription>Next appointments today</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                <div>
                  <p className="font-medium">Sarah Johnson</p>
                  <p className="text-sm text-muted-foreground">Routine Checkup</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium">10:30 AM</p>
                  <Badge variant="outline" className="text-xs">
                    <Clock className="w-3 h-3 mr-1" />
                    In 30 min
                  </Badge>
                </div>
              </div>

              <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                <div>
                  <p className="font-medium">Michael Chen</p>
                  <p className="text-sm text-muted-foreground">Follow-up</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium">2:00 PM</p>
                  <Badge variant="outline" className="text-xs">
                    <Clock className="w-3 h-3 mr-1" />
                    In 4 hours
                  </Badge>
                </div>
              </div>

              <Button variant="outline" className="w-full bg-transparent">
                View All Appointments
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  )
}
