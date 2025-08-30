"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { User, Mail, Stethoscope, Shield, Save } from "lucide-react"

interface UserData {
  id: string
  email: string
  name: string
  role: "doctor" | "patient"
  specialty?: string
  licenseNumber?: string
}

export function UserProfile() {
  const [user, setUser] = useState<UserData | null>(null)
  const [formData, setFormData] = useState<UserData | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [message, setMessage] = useState("")

  useEffect(() => {
    const userData = localStorage.getItem("user")
    if (userData) {
      const parsedUser = JSON.parse(userData)
      setUser(parsedUser)
      setFormData(parsedUser)
    }
  }, [])

  const handleSave = async () => {
    if (!formData) return

    setIsLoading(true)
    setMessage("")

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // Update localStorage
      localStorage.setItem("user", JSON.stringify(formData))
      setUser(formData)
      setMessage("Profile updated successfully!")
    } catch (error) {
      setMessage("Failed to update profile. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  if (!user || !formData) return null

  return (
    <DashboardLayout user={user}>
      <div className="max-w-2xl mx-auto space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Profile Settings</h1>
          <p className="text-muted-foreground">Manage your account information and preferences</p>
        </div>

        {message && (
          <Alert className={message.includes("successfully") ? "border-success" : "border-destructive"}>
            <AlertDescription>{message}</AlertDescription>
          </Alert>
        )}

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              Personal Information
            </CardTitle>
            <CardDescription>Update your personal details and contact information</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center gap-4">
              <Avatar className="h-20 w-20">
                <AvatarFallback className="bg-primary text-primary-foreground text-2xl">
                  {user.name.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div>
                <h3 className="font-semibold">{user.name}</h3>
                <p className="text-sm text-muted-foreground capitalize">{user.role}</p>
                {user.role === "doctor" && user.specialty && (
                  <p className="text-sm text-muted-foreground">{user.specialty}</p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <div className="relative">
                  <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="pl-10"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="pl-10"
                  />
                </div>
              </div>

              {user.role === "doctor" && (
                <>
                  <div className="space-y-2">
                    <Label htmlFor="specialty">Medical Specialty</Label>
                    <div className="relative">
                      <Stethoscope className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="specialty"
                        value={formData.specialty || ""}
                        onChange={(e) => setFormData({ ...formData, specialty: e.target.value })}
                        className="pl-10"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="licenseNumber">License Number</Label>
                    <div className="relative">
                      <Shield className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="licenseNumber"
                        value={formData.licenseNumber || ""}
                        onChange={(e) => setFormData({ ...formData, licenseNumber: e.target.value })}
                        className="pl-10"
                      />
                    </div>
                  </div>
                </>
              )}
            </div>

            <Button onClick={handleSave} disabled={isLoading} className="w-full md:w-auto">
              {isLoading ? (
                <>
                  <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="mr-2 h-4 w-4" />
                  Save Changes
                </>
              )}
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Account Security</CardTitle>
            <CardDescription>Manage your password and security settings</CardDescription>
          </CardHeader>
          <CardContent>
            <Button variant="outline">Change Password</Button>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}
