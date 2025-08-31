"use client"

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { UserProfile, LoginRequest, SignupRequest } from '@/types/auth'

// Helper function to normalize role for comparison
const normalizeRole = (role: string): string => {
  return role.toLowerCase()
}

export function useAuth() {
  const [user, setUser] = useState<UserProfile | null>(null)
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  // Check localStorage on mount
  useEffect(() => {
    const userData = localStorage.getItem("user")
    if (userData) {
      try {
        setUser(JSON.parse(userData))
      } catch (error) {
        console.error("Failed to parse user data:", error)
        localStorage.removeItem("user")
      }
    }
  }, [])

  const login = async (credentials: LoginRequest) => {
    try {
      setLoading(true)
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(credentials),
      })

      const data = await response.json()

      if (response.ok) {
        // Store user data in localStorage
        localStorage.setItem("user", JSON.stringify(data.user))
        setUser(data.user)
        return { success: true, message: data.message }
      } else {
        return { success: false, message: data.message }
      }
    } catch (error) {
      return { success: false, message: 'Login failed. Please try again.' }
    } finally {
      setLoading(false)
    }
  }

  const signup = async (userData: SignupRequest) => {
    try {
      const response = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      })

      const data = await response.json()

      if (response.ok) {
        return { success: true, message: data.message }
      } else {
        return { success: false, message: data.message }
      }
    } catch (error) {
      return { success: false, message: 'Signup failed. Please try again.' }
    }
  }

  const logout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' })
      localStorage.removeItem("user")
      setUser(null)
      router.push('/')
    } catch (error) {
      console.error('Logout failed:', error)
    }
  }

  const isAuthenticated = !!user
  
  // Case-insensitive role checking
  const isDoctor = user ? normalizeRole(user.role) === 'doctor' : false
  const isPatient = user ? normalizeRole(user.role) === 'patient' : false
  const isAdmin = user ? normalizeRole(user.role) === 'admin' : false

  return {
    user,
    loading,
    login,
    signup,
    logout,
    isAuthenticated,
    isDoctor,
    isPatient,
    isAdmin,
  }
} 