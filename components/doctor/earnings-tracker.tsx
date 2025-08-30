"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { DollarSign, TrendingUp, Calendar, CreditCard, FileText, Download, Filter } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

interface EarningsData {
  period: string
  revenue: number
  appointments: number
  avgPerAppointment: number
  growth: number
}

interface Transaction {
  id: string
  date: string
  patientName: string
  service: string
  amount: number
  status: "paid" | "pending" | "overdue"
  paymentMethod: string
}

const mockEarningsData: EarningsData[] = [
  { period: "This Month", revenue: 12450, appointments: 89, avgPerAppointment: 140, growth: 8.2 },
  { period: "Last Month", revenue: 11520, appointments: 82, avgPerAppointment: 140, growth: 5.1 },
  { period: "This Quarter", revenue: 35670, appointments: 255, avgPerAppointment: 140, growth: 12.3 },
  { period: "This Year", revenue: 142800, appointments: 1020, avgPerAppointment: 140, growth: 15.7 },
]

const mockTransactions: Transaction[] = [
  {
    id: "T001",
    date: "2024-12-14",
    patientName: "Sarah Johnson",
    service: "Routine Checkup",
    amount: 150,
    status: "paid",
    paymentMethod: "Credit Card",
  },
  {
    id: "T002",
    date: "2024-12-14",
    patientName: "Michael Chen",
    service: "Specialist Consultation",
    amount: 200,
    status: "paid",
    paymentMethod: "Insurance",
  },
  {
    id: "T003",
    date: "2024-12-13",
    patientName: "Emily Rodriguez",
    service: "Follow-up Visit",
    amount: 120,
    status: "pending",
    paymentMethod: "Cash",
  },
  {
    id: "T004",
    date: "2024-12-12",
    patientName: "David Wilson",
    service: "Prescription Review",
    amount: 80,
    status: "overdue",
    paymentMethod: "Credit Card",
  },
]

export function EarningsTracker() {
  const [user, setUser] = useState<any>(null)
  const [selectedPeriod, setSelectedPeriod] = useState("This Month")
  const [transactions, setTransactions] = useState<Transaction[]>(mockTransactions)

  useEffect(() => {
    const userData = localStorage.getItem("user")
    if (userData) {
      setUser(JSON.parse(userData))
    }
  }, [])

  const currentData = mockEarningsData.find((data) => data.period === selectedPeriod) || mockEarningsData[0]

  const getStatusColor = (status: string) => {
    switch (status) {
      case "paid":
        return "bg-success/10 text-success"
      case "pending":
        return "bg-warning/10 text-warning"
      case "overdue":
        return "bg-destructive/10 text-destructive"
      default:
        return "bg-muted text-muted-foreground"
    }
  }

  const totalPending = transactions.filter((t) => t.status === "pending").reduce((sum, t) => sum + t.amount, 0)

  const totalOverdue = transactions.filter((t) => t.status === "overdue").reduce((sum, t) => sum + t.amount, 0)

  if (!user) return null

  return (
    <DashboardLayout user={user}>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Earnings & Revenue</h1>
            <p className="text-muted-foreground">Track your practice revenue and financial performance</p>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline">
              <Download className="w-4 h-4 mr-2" />
              Export Report
            </Button>
            <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
              <SelectTrigger className="w-40">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="This Month">This Month</SelectItem>
                <SelectItem value="Last Month">Last Month</SelectItem>
                <SelectItem value="This Quarter">This Quarter</SelectItem>
                <SelectItem value="This Year">This Year</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Revenue Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Total Revenue</p>
                  <p className="text-3xl font-bold">${currentData.revenue.toLocaleString()}</p>
                  <div className="flex items-center gap-1 mt-2">
                    <TrendingUp className="w-4 h-4 text-success" />
                    <span className="text-sm text-success">+{currentData.growth}%</span>
                    <span className="text-sm text-muted-foreground">vs last period</span>
                  </div>
                </div>
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                  <DollarSign className="w-6 h-6 text-primary" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Appointments</p>
                  <p className="text-3xl font-bold">{currentData.appointments}</p>
                  <div className="flex items-center gap-1 mt-2">
                    <Calendar className="w-4 h-4 text-accent" />
                    <span className="text-sm text-muted-foreground">completed</span>
                  </div>
                </div>
                <div className="w-12 h-12 bg-accent/10 rounded-full flex items-center justify-center">
                  <Calendar className="w-6 h-6 text-accent" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Avg per Visit</p>
                  <p className="text-3xl font-bold">${currentData.avgPerAppointment}</p>
                  <div className="flex items-center gap-1 mt-2">
                    <TrendingUp className="w-4 h-4 text-success" />
                    <span className="text-sm text-success">Stable</span>
                  </div>
                </div>
                <div className="w-12 h-12 bg-success/10 rounded-full flex items-center justify-center">
                  <TrendingUp className="w-6 h-6 text-success" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Outstanding</p>
                  <p className="text-3xl font-bold">${(totalPending + totalOverdue).toLocaleString()}</p>
                  <div className="flex items-center gap-1 mt-2">
                    <span className="text-sm text-warning">${totalPending} pending</span>
                    <span className="text-sm text-destructive">${totalOverdue} overdue</span>
                  </div>
                </div>
                <div className="w-12 h-12 bg-warning/10 rounded-full flex items-center justify-center">
                  <CreditCard className="w-6 h-6 text-warning" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Recent Transactions */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Recent Transactions</CardTitle>
                <CardDescription>Latest payments and billing activity</CardDescription>
              </div>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm">
                  <Filter className="w-4 h-4 mr-2" />
                  Filter
                </Button>
                <Button variant="outline" size="sm">
                  <FileText className="w-4 h-4 mr-2" />
                  Generate Invoice
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Patient</TableHead>
                  <TableHead>Service</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Payment Method</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {transactions.map((transaction) => (
                  <TableRow key={transaction.id}>
                    <TableCell>{new Date(transaction.date).toLocaleDateString()}</TableCell>
                    <TableCell className="font-medium">{transaction.patientName}</TableCell>
                    <TableCell>{transaction.service}</TableCell>
                    <TableCell className="font-medium">${transaction.amount}</TableCell>
                    <TableCell>{transaction.paymentMethod}</TableCell>
                    <TableCell>
                      <Badge className={getStatusColor(transaction.status)}>{transaction.status}</Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Revenue Chart Placeholder */}
        <Card>
          <CardHeader>
            <CardTitle>Revenue Trends</CardTitle>
            <CardDescription>Monthly revenue performance over time</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-64 bg-muted/20 rounded-lg flex items-center justify-center">
              <div className="text-center text-muted-foreground">
                <TrendingUp className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p>Revenue chart will be displayed here</p>
                <p className="text-sm">Integration with charting library needed</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}
