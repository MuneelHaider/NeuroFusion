import { AppointmentBooking } from "@/components/patient/appointment-booking"
import { ProtectedRoute } from "@/components/auth/protected-route"

interface BookingPageProps {
  params: {
    doctorId: string
  }
}

export default function BookingPage({ params }: BookingPageProps) {
  return (
    <ProtectedRoute allowedRoles={["patient"]}>
      <AppointmentBooking doctorId={params.doctorId} />
    </ProtectedRoute>
  )
}
