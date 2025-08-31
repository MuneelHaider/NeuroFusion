"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { DashboardLayout } from "@/components/layout/dashboard-layout"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
} from "recharts"
import { TrendingUp, Activity, DollarSign, Calendar, Download } from "lucide-react"

interface AnalyticsData {
  userGrowth: Array<{ month: string; doctors: number; patients: number }>
  consultationTrends: Array<{ date: string; consultations: number; revenue: number }>
  specialtyDistribution: Array<{ specialty: string; count: number; color: string }>
  platformMetrics: {
    totalRevenue: number
    averageConsultationTime: number
    userSatisfaction: number
    systemUptime: number
  }
}

export function PlatformAnalytics() {
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null)
  const [timeRange, setTimeRange] = useState("30d")

  useEffect(() => {
    // Mock analytics data
    setAnalytics({
      userGrowth: [
        { month: "Jan", doctors: 120, patients: 450 },
        { month: "Feb", doctors: 145, patients: 520 },
        { month: "Mar", doctors: 168, patients: 610 },
        { month: "Apr", doctors: 192, patients: 720 },
        { month: "May", doctors: 215, patients: 840 },
        { month: "Jun", doctors: 238, patients: 950 },
      ],
      consultationTrends: [
        { date: "Week 1", consultations: 245, revenue: 12250 },
        { date: "Week 2", consultations: 289, revenue: 14450 },
        { date: "Week 3", consultations: 312, revenue: 15600 },
        { date: "Week 4", consultations: 356, revenue: 17800 },
      ],
      specialtyDistribution: [
        { specialty: "Cardiology", count: 45, color: "#0088FE" },
        { specialty: "Dermatology", count: 38, color: "#00C49F" },
        { specialty: "Neurology", count: 32, color: "#FFBB28" },
        { specialty: "Pediatrics", count: 28, color: "#FF8042" },
        { specialty: "Orthopedics", count: 25, color: "#8884D8" },
        { specialty: "Other", count: 42, color: "#82CA9D" },
      ],
      platformMetrics: {
        totalRevenue: 284750,
        averageConsultationTime: 28.5,
        userSatisfaction: 4.7,
        systemUptime: 99.8,
      },
    })
  }, [timeRange])

  if (!analytics) return null

  return (
    <DashboardLayout 
      headerContent={{
        title: "Platform Analytics",
        description: "Comprehensive platform performance and usage analytics",
        actions: (
          <>
            <select
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value)}
              className="px-3 py-2 border rounded-lg text-sm"
            >
              <option value="7d">Last 7 days</option>
              <option value="30d">Last 30 days</option>
              <option value="90d">Last 90 days</option>
              <option value="1y">Last year</option>
            </select>
            <Button variant="outline">
              <Download className="w-4 h-4 mr-2" />
              Export Data
            </Button>
          </>
        )
      }}
    >
      <div className="space-y-6">
        {/* Platform Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">${analytics.platformMetrics.totalRevenue.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">
                <span className="text-success">+12.5%</span> from last month
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Avg. Consultation Time</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{analytics.platformMetrics.averageConsultationTime} min</div>
              <p className="text-xs text-muted-foreground">
                <span className="text-success">-2.3%</span> from last month
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">User Satisfaction</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{analytics.platformMetrics.userSatisfaction}/5.0</div>
              <p className="text-xs text-muted-foreground">
                <span className="text-success">+0.2</span> from last month
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">System Uptime</CardTitle>
              <Activity className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{analytics.platformMetrics.systemUptime}%</div>
              <p className="text-xs text-muted-foreground">
                <span className="text-success">+0.1%</span> from last month
              </p>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="growth" className="space-y-4">
          <TabsList>
            <TabsTrigger value="growth">User Growth</TabsTrigger>
            <TabsTrigger value="consultations">Consultations</TabsTrigger>
            <TabsTrigger value="specialties">Specialties</TabsTrigger>
          </TabsList>

          <TabsContent value="growth" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>User Growth Trends</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={400}>
                  <BarChart data={analytics.userGrowth}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="doctors" fill="#0088FE" name="Doctors" />
                    <Bar dataKey="patients" fill="#00C49F" name="Patients" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="consultations" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Consultation & Revenue Trends</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={400}>
                  <LineChart data={analytics.consultationTrends}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis yAxisId="left" />
                    <YAxis yAxisId="right" orientation="right" />
                    <Tooltip />
                    <Line
                      yAxisId="left"
                      type="monotone"
                      dataKey="consultations"
                      stroke="#0088FE"
                      name="Consultations"
                    />
                    <Line yAxisId="right" type="monotone" dataKey="revenue" stroke="#00C49F" name="Revenue ($)" />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="specialties" className="space-y-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Doctor Specialties Distribution</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={analytics.specialtyDistribution}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="count"
                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      >
                        {analytics.specialtyDistribution.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Specialty Statistics</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {analytics.specialtyDistribution.map((specialty) => (
                      <div key={specialty.specialty} className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-4 h-4 rounded-full" style={{ backgroundColor: specialty.color }} />
                          <span className="font-medium">{specialty.specialty}</span>
                        </div>
                        <Badge variant="outline">{specialty.count} doctors</Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  )
}
