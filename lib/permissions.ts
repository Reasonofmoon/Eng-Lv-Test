export const PERMISSIONS = {
  // Admin permissions
  ADMIN_FULL: "*",

  // User management
  USERS_READ: "users:read",
  USERS_WRITE: "users:write",
  USERS_DELETE: "users:delete",

  // Question management
  QUESTIONS_READ: "questions:read",
  QUESTIONS_WRITE: "questions:write",
  QUESTIONS_DELETE: "questions:delete",

  // Test results
  RESULTS_READ: "results:read",
  RESULTS_WRITE: "results:write",
  RESULTS_DELETE: "results:delete",
  RESULTS_OWN: "results:own", // Can only view own results

  // Analytics
  ANALYTICS_READ: "analytics:read",
  ANALYTICS_WRITE: "analytics:write",

  // Tests
  TESTS_TAKE: "tests:take",
  TESTS_CREATE: "tests:create",

  // AI Features
  AI_GENERATE: "ai:generate",
} as const

export type Permission = (typeof PERMISSIONS)[keyof typeof PERMISSIONS]

export const ROLE_PERMISSIONS = {
  admin: ["*"],
  teacher: [
    PERMISSIONS.QUESTIONS_READ,
    PERMISSIONS.QUESTIONS_WRITE,
    PERMISSIONS.RESULTS_READ,
    PERMISSIONS.USERS_READ,
    PERMISSIONS.ANALYTICS_READ,
    PERMISSIONS.AI_GENERATE,
  ],
  student: [PERMISSIONS.TESTS_TAKE, PERMISSIONS.RESULTS_OWN],
} as const

export function hasPermission(userPermissions: string[], requiredPermission: string): boolean {
  // Admin has all permissions
  if (userPermissions.includes("*")) {
    return true
  }

  return userPermissions.includes(requiredPermission)
}

export function hasAnyPermission(userPermissions: string[], requiredPermissions: string[]): boolean {
  return requiredPermissions.some((permission) => hasPermission(userPermissions, permission))
}

export function hasAllPermissions(userPermissions: string[], requiredPermissions: string[]): boolean {
  return requiredPermissions.every((permission) => hasPermission(userPermissions, permission))
}
