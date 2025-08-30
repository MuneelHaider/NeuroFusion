"use client"

import { ComplianceMonitoring } from "@/components/admin/compliance-monitoring"
import { ProtectedRoute } from "@/components/auth/protected-route"

export default function AdminCompliancePage() {
  return (
    <ProtectedRoute requiredRole="admin">
      <ComplianceMonitoring />
    </ProtectedRoute>
  )
}
