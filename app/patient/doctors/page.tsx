import { DoctorDiscovery } from "@/components/patient/doctor-discovery"
import { ProtectedRoute } from "@/components/auth/protected-route"

export default function PatientDoctorsPage() {
  return (
    <ProtectedRoute allowedRoles={["patient"]}>
      <DoctorDiscovery />
    </ProtectedRoute>
  )
}
