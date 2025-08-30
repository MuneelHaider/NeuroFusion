"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { Calendar, Heart, FileText, MessageSquare, Clock, Activity, Pill } from "lucide-react"

interface Patient {
  id: string
  email: string
  name: string
  role: "doctor" | "patient"
}

export function PatientDashboard() {
  const [user, setUser] = useState<Patient | null>(null)

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
            <h1 className="text-3xl font-bold text-foreground">Welcome, {user.name}</h1>
            <p className="text-muted-foreground mt-1">Your health dashboard and medical records</p>
          </div>
          <Badge variant="secondary" className="bg-accent/10 text-accent">
            <Heart className="w-4 h-4 mr-2" />
            Healthy
          </Badge>
        </div>

        {/* Health Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Next Appointment</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">Dec 15</div>
              <p className="text-xs text-muted-foreground">Dr. Smith - Checkup</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Prescriptions</CardTitle>
              <Pill className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">3</div>
              <p className="text-xs text-muted-foreground">2 due for refill</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Health Score</CardTitle>
              <Activity className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">85</div>
              <p className="text-xs text-muted-foreground">Good health</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Last Visit</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">Nov 28</div>
              <p className="text-xs text-muted-foreground">2 weeks ago</p>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
              <CardDescription>Manage your healthcare needs</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button className="w-full justify-start bg-transparent" variant="outline">
                <Calendar className="mr-2 h-4 w-4" />
                Book Appointment
              </Button>
              <Button className="w-full justify-start bg-transparent" variant="outline">
                <MessageSquare className="mr-2 h-4 w-4" />
                Message Doctor
              </Button>
              <Button className="w-full justify-start bg-transparent" variant="outline">
                <FileText className="mr-2 h-4 w-4" />
                View Medical Records
              </Button>
              <Button className="w-full justify-start bg-transparent" variant="outline">
                <Pill className="mr-2 h-4 w-4" />
                Prescription Refills
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
              <CardDescription>Your latest health updates</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                <div>
                  <p className="font-medium">Blood Test Results</p>
                  <p className="text-sm text-muted-foreground">All values normal</p>
                </div>
                <Badge variant="outline" className="bg-success/10 text-success">
                  Normal
                </Badge>
              </div>

              <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                <div>
                  <p className="font-medium">Prescription Filled</p>
                  <p className="text-sm text-muted-foreground">Lisinopril 10mg</p>
                </div>
                <Badge variant="outline">Filled</Badge>
              </div>

              <Button variant="outline" className="w-full bg-transparent">
                View All Activity
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  )
}
