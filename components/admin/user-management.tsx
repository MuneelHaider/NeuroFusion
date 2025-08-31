"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { Users, Search, Shield, Eye, Edit, Trash2 } from "lucide-react"

interface User {
  id: string
  name: string
  email: string
  role: "doctor" | "patient" | "admin"
  status: "active" | "inactive" | "suspended"
  joinDate: string
  lastActive: string
  verificationStatus: "verified" | "pending" | "rejected"
}

export function UserManagement() {
  const [users, setUsers] = useState<User[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [filterRole, setFilterRole] = useState<string>("all")
  const [filterStatus, setFilterStatus] = useState<string>("all")

  useEffect(() => {
    // Mock user data
    setUsers([
      {
        id: "1",
        name: "Dr. Sarah Mitchell",
        email: "sarah.mitchell@email.com",
        role: "doctor",
        status: "active",
        joinDate: "2024-01-10",
        lastActive: "2024-01-15T10:30:00Z",
        verificationStatus: "verified",
      },
      {
        id: "2",
        name: "John Smith",
        email: "john.smith@email.com",
        role: "patient",
        status: "active",
        joinDate: "2024-01-12",
        lastActive: "2024-01-15T09:15:00Z",
        verificationStatus: "verified",
      },
      {
        id: "3",
        name: "Dr. Michael Chen",
        email: "michael.chen@email.com",
        role: "doctor",
        status: "inactive",
        joinDate: "2024-01-08",
        lastActive: "2024-01-13T14:20:00Z",
        verificationStatus: "pending",
      },
      {
        id: "4",
        name: "Emily Johnson",
        email: "emily.johnson@email.com",
        role: "patient",
        status: "suspended",
        joinDate: "2024-01-05",
        lastActive: "2024-01-14T16:45:00Z",
        verificationStatus: "rejected",
      },
    ])
  }, [])

  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesRole = filterRole === "all" || user.role === filterRole
    const matchesStatus = filterStatus === "all" || user.status === filterStatus
    return matchesSearch && matchesRole && matchesStatus
  })

  const getRoleColor = (role: string) => {
    switch (role) {
      case "doctor":
        return "default"
      case "patient":
        return "secondary"
      case "admin":
        return "destructive"
      default:
        return "secondary"
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "default"
      case "inactive":
        return "secondary"
      case "suspended":
        return "destructive"
      default:
        return "secondary"
    }
  }

  const getVerificationColor = (status: string) => {
    switch (status) {
      case "verified":
        return "default"
      case "pending":
        return "secondary"
      case "rejected":
        return "destructive"
      default:
        return "secondary"
    }
  }

  return (
    <DashboardLayout 
      headerContent={{
        title: "User Management",
        description: "Manage platform users and their permissions",
        actions: (
          <Button>
            <Users className="w-4 h-4 mr-2" />
            Add User
          </Button>
        )
      }}
    >
      <div className="space-y-6">
        {/* Filters */}
        <Card>
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                  <Input
                    placeholder="Search users..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              <div className="flex gap-2">
                <select
                  value={filterRole}
                  onChange={(e) => setFilterRole(e.target.value)}
                  className="px-3 py-2 border rounded-lg text-sm"
                >
                  <option value="all">All Roles</option>
                  <option value="doctor">Doctors</option>
                  <option value="patient">Patients</option>
                  <option value="admin">Admins</option>
                </select>
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="px-3 py-2 border rounded-lg text-sm"
                >
                  <option value="all">All Status</option>
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                  <option value="suspended">Suspended</option>
                </select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Users Table */}
        <Card>
          <CardHeader>
            <CardTitle>Users ({filteredUsers.length})</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {filteredUsers.map((user) => (
                <div key={user.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                      <Users className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="font-medium">{user.name}</h4>
                        <Badge variant={getRoleColor(user.role)}>{user.role}</Badge>
                        <Badge variant={getStatusColor(user.status)}>{user.status}</Badge>
                        <Badge variant={getVerificationColor(user.verificationStatus)}>{user.verificationStatus}</Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">{user.email}</p>
                      <div className="flex items-center gap-4 text-xs text-muted-foreground mt-1">
                        <span>Joined: {new Date(user.joinDate).toLocaleDateString()}</span>
                        <span>Last active: {new Date(user.lastActive).toLocaleDateString()}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button size="sm" variant="outline">
                      <Eye className="w-4 h-4" />
                    </Button>
                    <Button size="sm" variant="outline">
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button size="sm" variant="outline">
                      <Shield className="w-4 h-4" />
                    </Button>
                    <Button size="sm" variant="outline" className="text-destructive bg-transparent">
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}
