import { UserProfile } from "@/components/profile/user-profile"
import { ProtectedRoute } from "@/components/auth/protected-route"

export default function ProfilePage() {
  return (
    <ProtectedRoute allowedRoles={["doctor", "patient"]}>
      <UserProfile />
    </ProtectedRoute>
  )
}
