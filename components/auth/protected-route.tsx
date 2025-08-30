"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Loader2 } from "lucide-react"

interface User {
  id: string
  email: string
  name: string
  role: "doctor" | "patient" | "admin" // Added admin role
  specialty?: string
  licenseNumber?: string
}

interface ProtectedRouteProps {
  children: React.ReactNode
  allowedRoles?: ("doctor" | "patient" | "admin")[] // Made optional and added admin role
  requiredRole?: "doctor" | "patient" | "admin" // Added single role requirement option
}

export function ProtectedRoute({ children, allowedRoles, requiredRole }: ProtectedRouteProps) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const checkAuth = () => {
      try {
        const userData = localStorage.getItem("user")
        if (!userData) {
          router.push("/auth/login")
          return
        }

        const parsedUser = JSON.parse(userData) as User

        const hasAccess = requiredRole
          ? parsedUser.role === requiredRole
          : allowedRoles
            ? allowedRoles.includes(parsedUser.role)
            : true

        if (!hasAccess) {
          router.push("/auth/login")
          return
        }

        setUser(parsedUser)
      } catch (error) {
        console.error("Auth check failed:", error)
        router.push("/auth/login")
      } finally {
        setIsLoading(false)
      }
    }

    checkAuth()
  }, [router, allowedRoles, requiredRole])

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex items-center gap-2">
          <Loader2 className="h-6 w-6 animate-spin text-primary" />
          <span className="text-muted-foreground">Loading...</span>
        </div>
      </div>
    )
  }

  if (!user) {
    return null
  }

  return <>{children}</>
}
