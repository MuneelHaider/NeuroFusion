"use client"

import type React from "react"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Loader2, Mail, Lock, User, Stethoscope, Users, Shield } from "lucide-react"
import { useAuth } from "@/hooks/useAuth"

export function RegisterForm() {
  const [formData, setFormData] = useState({
    role: "patient",
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
    specialty: "",
    licenseNumber: "",
  })
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const router = useRouter()
  const { signup } = useAuth()

  // Helper function to normalize role for comparison
  const normalizeRole = (role: string): string => {
    return role.toLowerCase()
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    try {
      // Validation
      if (formData.password !== formData.confirmPassword) {
        setError("Passwords do not match")
        return
      }

      if (formData.password.length < 6) {
        setError("Password must be at least 6 characters")
        return
      }

      // Check if role is doctor (case-insensitive)
      if (normalizeRole(formData.role) === "doctor" && (!formData.specialty || !formData.licenseNumber)) {
        setError("Specialty and license number are required for doctors")
        return
      }

      const result = await signup(formData)
      
      if (result.success) {
        // Redirect to login page after successful registration
        router.push("/auth/login?message=Account created successfully! Please log in.")
      } else {
        setError(result.message)
      }
    } catch (err) {
      setError("Registration failed. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <div className="space-y-2">
        <Label htmlFor="role">Account Type</Label>
        <Select value={formData.role} onValueChange={(value) => setFormData({ ...formData, role: value })}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="doctor">
              <div className="flex items-center gap-2">
                <Stethoscope className="h-4 w-4" />
                Healthcare Provider
              </div>
            </SelectItem>
            <SelectItem value="patient">
              <div className="flex items-center gap-2">
                <Users className="h-4 w-4" />
                Patient
              </div>
            </SelectItem>
            <SelectItem value="admin">
              <div className="flex items-center gap-2">
                <Shield className="h-4 w-4" />
                Administrator
              </div>
            </SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="fullName">Full Name</Label>
        <div className="relative">
          <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            id="fullName"
            type="text"
            placeholder="Dr. John Smith"
            value={formData.fullName}
            onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
            className="pl-10"
            required
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <div className="relative">
          <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            id="email"
            type="email"
            placeholder="doctor@example.com"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            className="pl-10"
            required
          />
        </div>
      </div>

      {/* Show specialty and license fields for doctors (case-insensitive) */}
      {normalizeRole(formData.role) === "doctor" && (
        <>
          <div className="space-y-2">
            <Label htmlFor="specialty">Medical Specialty</Label>
            <Input
              id="specialty"
              type="text"
              placeholder="Cardiology, Neurology, etc."
              value={formData.specialty}
              onChange={(e) => setFormData({ ...formData, specialty: e.target.value })}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="licenseNumber">Medical License Number</Label>
            <Input
              id="licenseNumber"
              type="text"
              placeholder="License number"
              value={formData.licenseNumber}
              onChange={(e) => setFormData({ ...formData, licenseNumber: e.target.value })}
              required
            />
          </div>
        </>
      )}

      <div className="space-y-2">
        <Label htmlFor="password">Password</Label>
        <div className="relative">
          <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            id="password"
            type="password"
            placeholder="Create a password"
            value={formData.password}
            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            className="pl-10"
            required
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="confirmPassword">Confirm Password</Label>
        <div className="relative">
          <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            id="confirmPassword"
            type="password"
            placeholder="Confirm your password"
            value={formData.confirmPassword}
            onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
            className="pl-10"
            required
          />
        </div>
      </div>

      <Button type="submit" className="w-full" disabled={isLoading}>
        {isLoading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Creating account...
          </>
        ) : (
          "Create Account"
        )}
      </Button>
    </form>
  )
}
