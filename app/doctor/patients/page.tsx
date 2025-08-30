import { PatientManagement } from "@/components/doctor/patient-management"
import { ProtectedRoute } from "@/components/auth/protected-route"

export default function DoctorPatientsPage() {
  return (
    <ProtectedRoute allowedRoles={["doctor"]}>
      <PatientManagement />
    </ProtectedRoute>
  )
}
