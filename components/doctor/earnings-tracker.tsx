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

// Monthly revenue data for the chart
const monthlyRevenueData = [
  { month: "Jan", revenue: 11800, appointments: 84 },
  { month: "Feb", revenue: 12200, appointments: 87 },
  { month: "Mar", revenue: 11900, appointments: 85 },
  { month: "Apr", revenue: 12500, appointments: 89 },
  { month: "May", revenue: 12800, appointments: 91 },
  { month: "Jun", revenue: 13100, appointments: 93 },
  { month: "Jul", revenue: 12900, appointments: 92 },
  { month: "Aug", revenue: 13300, appointments: 95 },
  { month: "Sep", revenue: 13600, appointments: 97 },
  { month: "Oct", revenue: 13900, appointments: 99 },
  { month: "Nov", revenue: 14200, appointments: 101 },
  { month: "Dec", revenue: 12450, appointments: 89 },
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
    date: "2024-12-13",
    patientName: "David Wilson",
    service: "Prescription Review",
    amount: 80,
    status: "overdue",
    paymentMethod: "Credit Card",
  },
  {
    id: "T005",
    date: "2024-12-12",
    patientName: "Jennifer Lee",
    service: "Emergency Consultation",
    amount: 250,
    status: "paid",
    paymentMethod: "Insurance",
  },
  {
    id: "T006",
    date: "2024-12-12",
    patientName: "Robert Brown",
    service: "Cardiac Stress Test",
    amount: 300,
    status: "paid",
    paymentMethod: "Credit Card",
  },
  {
    id: "T007",
    date: "2024-12-11",
    patientName: "Lisa Anderson",
    service: "Routine Checkup",
    amount: 150,
    status: "paid",
    paymentMethod: "Cash",
  },
  {
    id: "T008",
    date: "2024-12-11",
    patientName: "James Martinez",
    service: "Follow-up Visit",
    amount: 120,
    status: "pending",
    paymentMethod: "Insurance",
  },
  {
    id: "T009",
    date: "2024-12-10",
    patientName: "Amanda Taylor",
    service: "Specialist Consultation",
    amount: 200,
    status: "paid",
    paymentMethod: "Credit Card",
  },
  {
    id: "T010",
    date: "2024-12-10",
    patientName: "Christopher Garcia",
    service: "Prescription Review",
    amount: 80,
    status: "paid",
    paymentMethod: "Cash",
  },
  {
    id: "T011",
    date: "2024-12-09",
    patientName: "Nicole White",
    service: "Echocardiogram",
    amount: 400,
    status: "paid",
    paymentMethod: "Insurance",
  },
  {
    id: "T012",
    date: "2024-12-09",
    patientName: "Kevin Johnson",
    service: "Routine Checkup",
    amount: 150,
    status: "overdue",
    paymentMethod: "Credit Card",
  },
  {
    id: "T013",
    date: "2024-12-08",
    patientName: "Rachel Davis",
    service: "Follow-up Visit",
    amount: 120,
    status: "paid",
    paymentMethod: "Insurance",
  },
  {
    id: "T014",
    date: "2024-12-08",
    patientName: "Thomas Miller",
    service: "Emergency Consultation",
    amount: 250,
    status: "paid",
    paymentMethod: "Credit Card",
  },
  {
    id: "T015",
    date: "2024-12-07",
    patientName: "Jessica Thompson",
    service: "Cardiac MRI",
    amount: 600,
    status: "pending",
    paymentMethod: "Insurance",
  },
  {
    id: "T016",
    date: "2024-12-07",
    patientName: "Daniel Clark",
    service: "Prescription Review",
    amount: 80,
    status: "paid",
    paymentMethod: "Cash",
  },
  {
    id: "T017",
    date: "2024-12-06",
    patientName: "Stephanie Lewis",
    service: "Routine Checkup",
    amount: 150,
    status: "paid",
    paymentMethod: "Credit Card",
  },
  {
    id: "T018",
    date: "2024-12-06",
    patientName: "Ryan Hall",
    service: "Specialist Consultation",
    amount: 200,
    status: "paid",
    paymentMethod: "Insurance",
  },
  {
    id: "T019",
    date: "2024-12-05",
    patientName: "Megan Allen",
    service: "Follow-up Visit",
    amount: 120,
    status: "paid",
    paymentMethod: "Cash",
  },
  {
    id: "T020",
    date: "2024-12-05",
    patientName: "Andrew Young",
    service: "Emergency Consultation",
    amount: 250,
    status: "overdue",
    paymentMethod: "Credit Card",
  }
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
    <DashboardLayout 
      headerContent={{
        title: "Earnings & Revenue",
        description: "Track your practice revenue and financial performance",
        actions: (
          <>
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
          </>
        )
      }}
    >
      <div className="space-y-6">
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

        {/* Revenue Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Revenue Trends</CardTitle>
            <CardDescription>Monthly revenue performance over the last 12 months</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-80 w-full">
              <svg width="100%" height="100%" viewBox="0 0 800 300" className="overflow-visible">
                {/* Chart background */}
                <rect width="800" height="300" fill="transparent" />
                
                {/* Y-axis labels */}
                <text x="20" y="20" fill="#6b7280" fontSize="12" textAnchor="end">$15k</text>
                <text x="20" y="80" fill="#6b7280" fontSize="12" textAnchor="end">$12k</text>
                <text x="20" y="140" fill="#6b7280" fontSize="12" textAnchor="end">$9k</text>
                <text x="20" y="200" fill="#6b7280" fontSize="12" textAnchor="end">$6k</text>
                <text x="20" y="260" fill="#6b7280" fontSize="12" textAnchor="end">$3k</text>
                
                {/* Grid lines */}
                <line x1="60" y1="20" x2="800" y2="20" stroke="#e5e7eb" strokeWidth="1" />
                <line x1="60" y1="80" x2="800" y2="80" stroke="#e5e7eb" strokeWidth="1" />
                <line x1="60" y1="140" x2="800" y2="140" stroke="#e5e7eb" strokeWidth="1" />
                <line x1="60" y1="200" x2="800" y2="200" stroke="#e5e7eb" strokeWidth="1" />
                <line x1="60" y1="260" x2="800" y2="260" stroke="#e5e7eb" strokeWidth="1" />
                
                {/* Revenue line chart */}
                <polyline
                  points={monthlyRevenueData.map((data, index) => {
                    const x = 60 + (index * 60)
                    const y = 260 - ((data.revenue - 3000) / 12000) * 240
                    return `${x},${y}`
                  }).join(' ')}
                  fill="none"
                  stroke="#3b82f6"
                  strokeWidth="3"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                
                {/* Data points */}
                {monthlyRevenueData.map((data, index) => {
                  const x = 60 + (index * 60)
                  const y = 260 - ((data.revenue - 3000) / 12000) * 240
                  return (
                    <g key={index}>
                      <circle cx={x} cy={y} r="4" fill="#3b82f6" />
                      <circle cx={x} cy={y} r="8" fill="#3b82f6" fillOpacity="0.2" />
                    </g>
                  )
                })}
                
                {/* X-axis labels */}
                {monthlyRevenueData.map((data, index) => {
                  const x = 60 + (index * 60)
                  return (
                    <g key={index}>
                      <text x={x} y="290" fill="#6b7280" fontSize="12" textAnchor="middle">
                        {data.month}
                      </text>
                      <text x={x} y="305" fill="#6b7280" fontSize="10" textAnchor="middle">
                        ${(data.revenue / 1000).toFixed(1)}k
                      </text>
                    </g>
                  )
                })}
                
                {/* Chart title */}
                <text x="400" y="15" fill="#111827" fontSize="16" fontWeight="600" textAnchor="middle">
                  Monthly Revenue Trend
                </text>
              </svg>
            </div>
            
            {/* Chart legend */}
            <div className="flex items-center justify-center gap-6 mt-4 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                <span>Revenue</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-blue-500/20 rounded-full"></div>
                <span>Data Points</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Financial Summary */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Payment Methods Breakdown</CardTitle>
              <CardDescription>Revenue distribution by payment method</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-4 h-4 bg-blue-500 rounded-full"></div>
                  <span className="text-sm">Insurance</span>
                </div>
                <div className="text-right">
                  <p className="font-medium">$8,450</p>
                  <p className="text-xs text-muted-foreground">68% of total</p>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-4 h-4 bg-green-500 rounded-full"></div>
                  <span className="text-sm">Credit Card</span>
                </div>
                <div className="text-right">
                  <p className="font-medium">$2,800</p>
                  <p className="text-xs text-muted-foreground">22% of total</p>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-4 h-4 bg-yellow-500 rounded-full"></div>
                  <span className="text-sm">Cash</span>
                </div>
                <div className="text-right">
                  <p className="font-medium">$1,200</p>
                  <p className="text-xs text-muted-foreground">10% of total</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Service Revenue Breakdown</CardTitle>
              <CardDescription>Revenue by service type</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm">Routine Checkups</span>
                <div className="text-right">
                  <p className="font-medium">$4,200</p>
                  <p className="text-xs text-muted-foreground">34%</p>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Specialist Consultations</span>
                <div className="text-right">
                  <p className="font-medium">$3,600</p>
                  <p className="text-xs text-muted-foreground">29%</p>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Emergency Consultations</span>
                <div className="text-right">
                  <p className="font-medium">$2,250</p>
                  <p className="text-xs text-muted-foreground">18%</p>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Diagnostic Tests</span>
                <div className="text-right">
                  <p className="font-medium">$1,800</p>
                  <p className="text-xs text-muted-foreground">14%</p>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Other Services</span>
                <div className="text-right">
                  <p className="font-medium">$600</p>
                  <p className="text-xs text-muted-foreground">5%</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  )
}
