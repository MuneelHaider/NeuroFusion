import { EarningsTracker } from "@/components/doctor/earnings-tracker"
import { ProtectedRoute } from "@/components/auth/protected-route"

export default function DoctorEarningsPage() {
  return (
    <ProtectedRoute allowedRoles={["doctor"]}>
      <EarningsTracker />
    </ProtectedRoute>
  )
}
