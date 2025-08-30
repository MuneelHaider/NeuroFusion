"use client"

import type React from "react"
import { DollarSign, FileImage } from "lucide-react"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Stethoscope,
  Home,
  Calendar,
  Users,
  Brain,
  FileText,
  MessageSquare,
  Settings,
  LogOut,
  Menu,
  X,
  Shield,
  BarChart3,
  UserCheck,
} from "lucide-react"

interface DashboardLayoutProps {
  children: React.ReactNode
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [user, setUser] = useState<any>(null)
  const router = useRouter()

  useEffect(() => {
    const userData = localStorage.getItem("user")
    if (userData) {
      setUser(JSON.parse(userData))
    }
  }, [])

  const handleLogout = () => {
    localStorage.removeItem("user")
    router.push("/")
  }

  const doctorNavItems = [
    { icon: Home, label: "Dashboard", href: "/doctor/dashboard" },
    { icon: Calendar, label: "Appointments", href: "/doctor/appointments" },
    { icon: Users, label: "Patients", href: "/doctor/patients" },
    { icon: Brain, label: "AI Diagnosis", href: "/doctor/ai-diagnosis" },
    { icon: FileImage, label: "Medical Imaging", href: "/doctor/imaging" },
    { icon: FileText, label: "Medical Records", href: "/doctor/records" },
    { icon: MessageSquare, label: "Teleconsultation", href: "/doctor/teleconsultation" },
    { icon: DollarSign, label: "Earnings", href: "/doctor/earnings" },
  ]

  const patientNavItems = [
    { icon: Home, label: "Dashboard", href: "/patient/dashboard" },
    { icon: Calendar, label: "Appointments", href: "/patient/appointments" },
    { icon: FileText, label: "Medical Records", href: "/patient/records" },
    { icon: MessageSquare, label: "Messages", href: "/patient/messages" },
    { icon: Users, label: "Find Doctors", href: "/patient/doctors" },
  ]

  const adminNavItems = [
    { icon: Home, label: "Dashboard", href: "/admin/dashboard" },
    { icon: UserCheck, label: "User Management", href: "/admin/users" },
    { icon: Shield, label: "Compliance", href: "/admin/compliance" },
    { icon: BarChart3, label: "Analytics", href: "/admin/analytics" },
    { icon: Settings, label: "System Settings", href: "/admin/settings" },
  ]

  if (!user) return null

  const navItems = user.role === "doctor" ? doctorNavItems : user.role === "admin" ? adminNavItems : patientNavItems

  return (
    <div className="min-h-screen bg-background">
      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-40 bg-black/50 lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      {/* Sidebar */}
      <div
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-card border-r transform transition-transform duration-200 ease-in-out lg:translate-x-0 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between p-4 border-b">
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-10 h-10 bg-primary rounded-lg">
              <Brain className="w-5 h-5 text-primary-foreground" />
            </div>
            <span className="font-bold text-lg">NeuroFusion</span>
          </div>
          <Button variant="ghost" size="sm" className="lg:hidden" onClick={() => setSidebarOpen(false)}>
            <X className="h-4 w-4" />
          </Button>
        </div>

        <nav className="p-4 space-y-2">
          {navItems.map((item) => (
            <Link key={item.href} href={item.href}>
              <Button variant="ghost" className="w-full justify-start" onClick={() => setSidebarOpen(false)}>
                <item.icon className="mr-3 h-4 w-4" />
                {item.label}
              </Button>
            </Link>
          ))}
        </nav>
      </div>

      {/* Main content */}
      <div className="lg:pl-64">
        {/* Top bar */}
        <header className="bg-card border-b px-4 py-3">
          <div className="flex items-center justify-between">
            <Button variant="ghost" size="sm" className="lg:hidden" onClick={() => setSidebarOpen(true)}>
              <Menu className="h-4 w-4" />
            </Button>

            <div className="flex items-center gap-4 ml-auto">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                    <Avatar className="h-8 w-8">
                      <AvatarFallback className="bg-primary text-primary-foreground">
                        {user.name.charAt(0).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end" forceMount>
                  <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium leading-none">{user.name}</p>
                      <p className="text-xs leading-none text-muted-foreground">{user.email}</p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link href="/profile">
                      <Users className="mr-2 h-4 w-4" />
                      Profile
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Settings className="mr-2 h-4 w-4" />
                    Settings
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleLogout}>
                    <LogOut className="mr-2 h-4 w-4" />
                    Log out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="p-6">{children}</main>
      </div>
    </div>
  )
}
