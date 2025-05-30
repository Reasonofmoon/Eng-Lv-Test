import { z } from "zod"
import DOMPurify from "isomorphic-dompurify"
import rateLimit from "express-rate-limit"

// Input validation schemas
export const emailSchema = z.string().email().max(255)
export const passwordSchema = z
  .string()
  .min(8)
  .max(128)
  .regex(
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/,
    "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character",
  )

export const userCreateSchema = z.object({
  email: emailSchema,
  password: passwordSchema,
  name: z.string().min(1).max(100),
  role: z.enum(["admin", "teacher", "student"]),
})

export const userUpdateSchema = z.object({
  email: emailSchema.optional(),
  name: z.string().min(1).max(100).optional(),
  role: z.enum(["admin", "teacher", "student"]).optional(),
  isActive: z.boolean().optional(),
})

export const questionCreateSchema = z.object({
  type: z.enum([
    "multiple-choice",
    "fill-blank",
    "reading-comprehension",
    "listening-comprehension",
    "vocabulary-match",
  ]),
  level: z.enum(["A1", "A2", "B1", "B2", "C1", "C2"]),
  skillArea: z.enum(["grammar", "vocabulary", "reading", "listening", "writing"]),
  points: z.number().min(1).max(100),
  timeLimit: z.number().min(10).max(3600).optional(),
  question: z.string().min(1).max(1000),
  options: z.array(z.string().min(1).max(500)).min(2).max(6).optional(),
  correctAnswer: z.number().min(0).optional(),
  explanation: z.string().max(1000).optional(),
})

// Sanitization functions
export function sanitizeHtml(input: string): string {
  return DOMPurify.sanitize(input, {
    ALLOWED_TAGS: ["b", "i", "em", "strong", "p", "br"],
    ALLOWED_ATTR: [],
  })
}

export function sanitizeInput(input: string): string {
  return input.trim().replace(/[<>]/g, "")
}

// Rate limiting configurations
export const authRateLimit = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // 5 attempts per window
  message: "Too many authentication attempts, please try again later",
  standardHeaders: true,
  legacyHeaders: false,
})

export const apiRateLimit = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // 100 requests per window
  message: "Too many API requests, please try again later",
  standardHeaders: true,
  legacyHeaders: false,
})

// Security headers
export const securityHeaders = {
  "X-Content-Type-Options": "nosniff",
  "X-Frame-Options": "DENY",
  "X-XSS-Protection": "1; mode=block",
  "Referrer-Policy": "strict-origin-when-cross-origin",
  "Content-Security-Policy":
    "default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; font-src 'self' data:;",
}

// CSRF protection
export function generateCSRFToken(): string {
  return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15)
}

export function validateCSRFToken(token: string, sessionToken: string): boolean {
  return token === sessionToken
}

// Audit logging
export interface AuditLog {
  id: string
  userId: string
  action: string
  resource: string
  details: Record<string, any>
  ipAddress: string
  userAgent: string
  timestamp: Date
}

const auditLogs: AuditLog[] = []

export function logAuditEvent(
  userId: string,
  action: string,
  resource: string,
  details: Record<string, any> = {},
  request?: Request,
): void {
  const log: AuditLog = {
    id: Math.random().toString(36).substring(2, 15),
    userId,
    action,
    resource,
    details,
    ipAddress: request?.headers.get("x-forwarded-for") || "unknown",
    userAgent: request?.headers.get("user-agent") || "unknown",
    timestamp: new Date(),
  }

  auditLogs.push(log)

  // In production, save to database
  console.log("Audit Log:", log)
}

export function getAuditLogs(filters?: {
  userId?: string
  action?: string
  resource?: string
  startDate?: Date
  endDate?: Date
}): AuditLog[] {
  let filtered = auditLogs

  if (filters?.userId) {
    filtered = filtered.filter((log) => log.userId === filters.userId)
  }

  if (filters?.action) {
    filtered = filtered.filter((log) => log.action === filters.action)
  }

  if (filters?.resource) {
    filtered = filtered.filter((log) => log.resource === filters.resource)
  }

  if (filters?.startDate) {
    filtered = filtered.filter((log) => log.timestamp >= filters.startDate!)
  }

  if (filters?.endDate) {
    filtered = filtered.filter((log) => log.timestamp <= filters.endDate!)
  }

  return filtered.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
}
