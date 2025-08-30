"use client"

import { UserManagement } from "@/components/admin/user-management"
import { ProtectedRoute } from "@/components/auth/protected-route"

export default function AdminUsersPage() {
  return (
    <ProtectedRoute requiredRole="admin">
      <UserManagement />
    </ProtectedRoute>
  )
}
