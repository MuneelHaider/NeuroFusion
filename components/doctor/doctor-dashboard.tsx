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
    <DashboardLayout 
      headerContent={{
        title: `Welcome back, Dr. ${user.name.split(" ")[1] || user.name}`,
        description: `${user.specialty} • License: ${user.licenseNumber}`,
        actions: (
          <Badge variant="secondary" className="bg-primary/10 text-primary text-base px-4 py-2">
            <Activity className="w-5 h-5 mr-2" />
            Active
          </Badge>
        )
      }}
    >
      <div className="space-y-6">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
              <CardTitle className="text-base font-medium">Today's Appointments</CardTitle>
              <Calendar className="h-5 w-5 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">8</div>
              <p className="text-sm text-muted-foreground">+2 from yesterday</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
              <CardTitle className="text-base font-medium">Active Patients</CardTitle>
              <Users className="h-5 w-5 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">247</div>
              <p className="text-sm text-muted-foreground">+12 this month</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
              <CardTitle className="text-base font-medium">AI Diagnoses</CardTitle>
              <Brain className="h-5 w-5 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">34</div>
              <p className="text-sm text-muted-foreground">This week</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
              <CardTitle className="text-base font-medium">Revenue</CardTitle>
              <TrendingUp className="h-5 w-5 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">$12,450</div>
              <p className="text-sm text-muted-foreground">+8% from last month</p>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-xl">Quick Actions</CardTitle>
              <CardDescription className="text-base">Common tasks and shortcuts</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button className="w-full justify-start bg-transparent h-12 text-base" variant="outline">
                <Calendar className="mr-3 h-5 w-5" />
                Schedule Appointment
              </Button>
              <Button className="w-full justify-start bg-transparent h-12 text-base" variant="outline">
                <Brain className="mr-3 h-5 w-5" />
                AI Diagnosis Tool
              </Button>
              <Button className="w-full justify-start bg-transparent h-12 text-base" variant="outline">
                <FileText className="mr-3 h-5 w-5" />
                View Medical Records
              </Button>
              <Button className="w-full justify-start bg-transparent h-12 text-base" variant="outline">
                <MessageSquare className="mr-3 h-5 w-5" />
                Start Teleconsultation
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-xl">Upcoming Appointments</CardTitle>
              <CardDescription className="text-base">Next appointments today</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
                <div>
                  <p className="font-medium text-base">Sarah Johnson</p>
                  <p className="text-base text-muted-foreground">Routine Checkup</p>
                </div>
                <div className="text-right">
                  <p className="text-base font-medium">10:30 AM</p>
                  <Badge variant="outline" className="text-sm px-3 py-1">
                    <Clock className="w-4 h-4 mr-2" />
                    In 30 min
                  </Badge>
                </div>
              </div>

              <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
                <div>
                  <p className="font-medium text-base">Michael Chen</p>
                  <p className="text-base text-muted-foreground">Follow-up</p>
                </div>
                <div className="text-right">
                  <p className="text-base font-medium">2:00 PM</p>
                  <Badge variant="outline" className="text-sm px-3 py-1">
                    <Clock className="w-4 h-4 mr-2" />
                    In 4 hours
                  </Badge>
                </div>
              </div>

              <Button variant="outline" className="w-full bg-transparent h-12 text-base">
                View All Appointments
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  )
}
