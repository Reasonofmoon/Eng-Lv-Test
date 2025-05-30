"use client"

import type React from "react"

import { AuthGuard, RoleGuard } from "@/components/auth/auth-guard"
import { AdminSidebar } from "@/components/admin/admin-sidebar"
import { AdminHeader } from "@/components/admin/admin-header"

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <AuthGuard>
      <RoleGuard allowedRoles={["admin", "teacher"]}>
        <div className="min-h-screen bg-gray-50">
          <AdminHeader />
          <div className="flex">
            <AdminSidebar />
            <main className="flex-1 p-6">{children}</main>
          </div>
        </div>
      </RoleGuard>
    </AuthGuard>
  )
}
