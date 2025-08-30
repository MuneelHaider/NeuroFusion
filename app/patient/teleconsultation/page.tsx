import { PatientTeleconsultation } from "@/components/patient/patient-teleconsultation"
import { ProtectedRoute } from "@/components/auth/protected-route"

export default function PatientTeleconsultationPage() {
  return (
    <ProtectedRoute allowedRoles={["patient"]}>
      <PatientTeleconsultation />
    </ProtectedRoute>
  )
}
