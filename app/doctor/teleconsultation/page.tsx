import { TeleconsultationPortal } from "@/components/doctor/teleconsultation-portal"
import { ProtectedRoute } from "@/components/auth/protected-route"

export default function TeleconsultationPage() {
  return (
    <ProtectedRoute allowedRoles={["doctor"]}>
      <TeleconsultationPortal />
    </ProtectedRoute>
  )
}
