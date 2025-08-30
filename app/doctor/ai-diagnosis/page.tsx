import { AIDiagnosisService } from "@/components/doctor/ai-diagnosis-service"
import { ProtectedRoute } from "@/components/auth/protected-route"

export default function AIDiagnosisPage() {
  return (
    <ProtectedRoute allowedRoles={["doctor"]}>
      <AIDiagnosisService />
    </ProtectedRoute>
  )
}
