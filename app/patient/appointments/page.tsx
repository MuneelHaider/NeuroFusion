import { PatientAppointments } from "@/components/patient/patient-appointments"
import { ProtectedRoute } from "@/components/auth/protected-route"

export default function PatientAppointmentsPage() {
  return (
    <ProtectedRoute allowedRoles={["patient"]}>
      <PatientAppointments />
    </ProtectedRoute>
  )
}
