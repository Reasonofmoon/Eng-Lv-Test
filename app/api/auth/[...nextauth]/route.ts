import NextAuth from "next-auth"
import type { NextAuthOptions } from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"

// Mock user database - in production, this would be a real database
const users = [
  {
    id: "1",
    email: "admin@englishtest.com",
    password: "password123",
    name: "System Administrator",
    role: "admin",
    permissions: ["*"],
    isActive: true,
  },
  {
    id: "2",
    email: "teacher@englishtest.com",
    password: "password123",
    name: "English Teacher",
    role: "teacher",
    permissions: ["questions:read", "questions:write", "results:read", "users:read", "analytics:read"],
    isActive: true,
  },
  {
    id: "3",
    email: "student@englishtest.com",
    password: "password123",
    name: "Test Student",
    role: "student",
    permissions: ["tests:take", "results:own"],
    isActive: true,
  },
]

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      id: "credentials",
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        try {
          if (!credentials?.email || !credentials?.password) {
            return null
          }

          // Find user by email
          const user = users.find((u) => u.email.toLowerCase() === credentials.email.toLowerCase() && u.isActive)

          if (!user) {
            return null
          }

          // Check password
          if (user.password !== credentials.password) {
            return null
          }

          // Return user object (without password)
          return {
            id: user.id,
            email: user.email,
            name: user.name,
            role: user.role,
            permissions: user.permissions,
          }
        } catch (error) {
          console.error("Authorization error:", error)
          return null
        }
      },
    }),
  ],
  session: {
    strategy: "jwt",
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
      if (token && session.user) {
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
  secret: process.env.NEXTAUTH_SECRET,
  debug: process.env.NODE_ENV === "development",
}

const handler = NextAuth(authOptions)

export { handler as GET, handler as POST }
