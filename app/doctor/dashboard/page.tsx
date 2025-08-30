import { DoctorDashboard } from "@/components/doctor/doctor-dashboard"
import { ProtectedRoute } from "@/components/auth/protected-route"

export default function DoctorDashboardPage() {
  return (
    <ProtectedRoute allowedRoles={["doctor"]}>
      <DoctorDashboard />
    </ProtectedRoute>
  )
}
