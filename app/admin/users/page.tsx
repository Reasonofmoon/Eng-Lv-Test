"use client"

import { AuthGuard } from "@/components/auth/auth-guard"
import { SecureUserManager } from "@/components/admin/secure-user-manager"
import { PERMISSIONS } from "@/lib/permissions"

export default function AdminUsersPage() {
  return (
    <AuthGuard requiredPermissions={[PERMISSIONS.USERS_READ]}>
      <SecureUserManager />
    </AuthGuard>
  )
}
