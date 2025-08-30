import { AppointmentScheduling } from "@/components/doctor/appointment-scheduling"
import { ProtectedRoute } from "@/components/auth/protected-route"

export default function DoctorAppointmentsPage() {
  return (
    <ProtectedRoute allowedRoles={["doctor"]}>
      <AppointmentScheduling />
    </ProtectedRoute>
  )
}
