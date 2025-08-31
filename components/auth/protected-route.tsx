"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Loader2 } from "lucide-react"

interface User {
  id: string
  email: string
  name: string
  role: string // Flexible string to handle both cases
  specialty?: string
  licenseNumber?: string
}

interface ProtectedRouteProps {
  children: React.ReactNode
  allowedRoles?: string[] // Flexible string array to handle both cases
  requiredRole?: string // Flexible string to handle both cases
}

export function ProtectedRoute({ children, allowedRoles, requiredRole }: ProtectedRouteProps) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

  // Helper function to normalize role for comparison
  const normalizeRole = (role: string): string => {
    return role.toLowerCase()
  }

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
          ? normalizeRole(parsedUser.role) === normalizeRole(requiredRole)
          : allowedRoles
            ? allowedRoles.some(allowedRole => 
                normalizeRole(allowedRole) === normalizeRole(parsedUser.role)
              )
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
