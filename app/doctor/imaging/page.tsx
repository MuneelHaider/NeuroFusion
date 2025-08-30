import { MedicalImagingViewer } from "@/components/doctor/medical-imaging-viewer"
import { ProtectedRoute } from "@/components/auth/protected-route"

export default function MedicalImagingPage() {
  return (
    <ProtectedRoute allowedRoles={["doctor"]}>
      <MedicalImagingViewer />
    </ProtectedRoute>
  )
}
