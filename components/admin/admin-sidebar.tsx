"use client"

import { useSession } from "next-auth/react"
import { usePathname } from "next/navigation"
import Link from "next/link"
import { cn } from "@/lib/utils"
import { hasPermission, PERMISSIONS } from "@/lib/permissions"
import { BarChart3, FileText, Users, Bot, ClipboardList, Settings, Shield, Activity } from "lucide-react"

const navigation = [
  {
    name: "Dashboard",
    href: "/admin",
    icon: BarChart3,
    permission: PERMISSIONS.ANALYTICS_READ,
  },
  {
    name: "Questions",
    href: "/admin/questions",
    icon: FileText,
    permission: PERMISSIONS.QUESTIONS_READ,
  },
  {
    name: "Users",
    href: "/admin/users",
    icon: Users,
    permission: PERMISSIONS.USERS_READ,
  },
  {
    name: "Test Results",
    href: "/admin/results",
    icon: ClipboardList,
    permission: PERMISSIONS.RESULTS_READ,
  },
  {
    name: "AI Generator",
    href: "/admin/ai-generator",
    icon: Bot,
    permission: PERMISSIONS.AI_GENERATE,
  },
  {
    name: "Security",
    href: "/admin/security",
    icon: Shield,
    permission: PERMISSIONS.ADMIN_FULL,
  },
  {
    name: "Audit Logs",
    href: "/admin/audit",
    icon: Activity,
    permission: PERMISSIONS.ADMIN_FULL,
  },
  {
    name: "Settings",
    href: "/admin/settings",
    icon: Settings,
    permission: PERMISSIONS.ANALYTICS_READ,
  },
]

export function AdminSidebar() {
  const { data: session } = useSession()
  const pathname = usePathname()
  const userPermissions = session?.user.permissions || []

  const filteredNavigation = navigation.filter((item) => hasPermission(userPermissions, item.permission))

  return (
    <div className="w-64 bg-white border-r border-gray-200 min-h-screen">
      <nav className="mt-8 px-4">
        <ul className="space-y-2">
          {filteredNavigation.map((item) => {
            const isActive = pathname === item.href
            return (
              <li key={item.name}>
                <Link
                  href={item.href}
                  className={cn(
                    "group flex items-center px-2 py-2 text-sm font-medium rounded-md transition-colors",
                    isActive ? "bg-blue-100 text-blue-700" : "text-gray-600 hover:bg-gray-50 hover:text-gray-900",
                  )}
                >
                  <item.icon
                    className={cn(
                      "mr-3 h-5 w-5 flex-shrink-0",
                      isActive ? "text-blue-500" : "text-gray-400 group-hover:text-gray-500",
                    )}
                  />
                  {item.name}
                </Link>
              </li>
            )
          })}
        </ul>
      </nav>
    </div>
  )
}
