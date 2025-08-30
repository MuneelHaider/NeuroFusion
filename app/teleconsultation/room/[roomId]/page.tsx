import { VideoCallRoom } from "@/components/teleconsultation/video-call-room"
import { ProtectedRoute } from "@/components/auth/protected-route"

interface VideoCallPageProps {
  params: {
    roomId: string
  }
}

export default function VideoCallPage({ params }: VideoCallPageProps) {
  return (
    <ProtectedRoute allowedRoles={["doctor", "patient"]}>
      <VideoCallRoom roomId={params.roomId} />
    </ProtectedRoute>
  )
}
