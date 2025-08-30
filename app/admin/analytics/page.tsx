"use client"

import { PlatformAnalytics } from "@/components/admin/platform-analytics"
import { ProtectedRoute } from "@/components/auth/protected-route"

export default function AdminAnalyticsPage() {
  return (
    <ProtectedRoute requiredRole="admin">
      <PlatformAnalytics />
    </ProtectedRoute>
  )
}
