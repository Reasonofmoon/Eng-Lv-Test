import type { NextAuthOptions } from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"

export interface User {
  id: string
  email: string
  name: string
  role: "admin" | "teacher" | "student"
  permissions: string[]
  isActive: boolean
  lastLogin?: Date
  createdAt: Date
  updatedAt: Date
}

// Mock user database - in production, this would be a real database
const users: User[] = [
  {
    id: "1",
    email: "admin@englishtest.com",
    name: "System Administrator",
    role: "admin",
    permissions: ["*"], // All permissions
    isActive: true,
    createdAt: new Date("2023-01-01"),
    updatedAt: new Date(),
  },
  {
    id: "2",
    email: "teacher@englishtest.com",
    name: "English Teacher",
    role: "teacher",
    permissions: ["questions:read", "questions:write", "results:read", "users:read", "analytics:read"],
    isActive: true,
    createdAt: new Date("2023-06-01"),
    updatedAt: new Date(),
  },
  {
    id: "3",
    email: "student@englishtest.com",
    name: "Test Student",
    role: "student",
    permissions: ["tests:take", "results:own"],
    isActive: true,
    createdAt: new Date("2024-01-01"),
    updatedAt: new Date(),
  },
]

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null
        }

        // In production, verify password hash
        const user = users.find((u) => u.email === credentials.email && u.isActive)

        if (!user) {
          return null
        }

        // Mock password verification - in production use bcrypt
        const isValidPassword = credentials.password === "password123"

        if (!isValidPassword) {
          return null
        }

        // Update last login
        user.lastLogin = new Date()

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
          permissions: user.permissions,
        }
      },
    }),
  ],
  session: {
    strategy: "jwt",
    maxAge: 24 * 60 * 60, // 24 hours
  },
  jwt: {
    maxAge: 24 * 60 * 60, // 24 hours
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = user.role
        token.permissions = user.permissions
      }
      return token
    },
    async session({ session, token }) {
      if (token) {
        session.user.id = token.sub!
        session.user.role = token.role as string
        session.user.permissions = token.permissions as string[]
      }
      return session
    },
  },
  pages: {
    signIn: "/auth/signin",
    error: "/auth/error",
  },
}

export async function getUserById(id: string): Promise<User | null> {
  return users.find((user) => user.id === id) || null
}

export async function getUserByEmail(email: string): Promise<User | null> {
  return users.find((user) => user.email === email) || null
}
