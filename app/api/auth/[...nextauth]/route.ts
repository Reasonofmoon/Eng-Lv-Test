import NextAuth from "next-auth"
import type { NextAuthOptions } from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"

// Mock user database - in production, this would be a real database
const users = [
  {
    id: "1",
    email: "admin@englishtest.com",
    name: "System Administrator",
    role: "admin",
    permissions: ["*"], // All permissions
    isActive: true,
  },
  {
    id: "2",
    email: "teacher@englishtest.com",
    name: "English Teacher",
    role: "teacher",
    permissions: ["questions:read", "questions:write", "results:read", "users:read", "analytics:read"],
    isActive: true,
  },
  {
    id: "3",
    email: "student@englishtest.com",
    name: "Test Student",
    role: "student",
    permissions: ["tests:take", "results:own"],
    isActive: true,
  },
]

const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      id: "credentials",
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email", placeholder: "your@email.com" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials, req) {
        try {
          console.log("Authorize called with:", { email: credentials?.email })

          if (!credentials?.email || !credentials?.password) {
            console.log("Missing credentials")
            throw new Error("Please enter both email and password")
          }

          // Find user by email
          const user = users.find((u) => u.email.toLowerCase() === credentials.email.toLowerCase() && u.isActive)

          if (!user) {
            console.log("User not found:", credentials.email)
            throw new Error("No account found with this email address")
          }

          // Mock password verification - in production use bcrypt
          const isValidPassword = credentials.password === "password123"

          if (!isValidPassword) {
            console.log("Invalid password for user:", credentials.email)
            throw new Error("Invalid password")
          }

          console.log("Authentication successful for:", user.email)

          return {
            id: user.id,
            email: user.email,
            name: user.name,
            role: user.role,
            permissions: user.permissions,
          }
        } catch (error) {
          console.error("Auth error:", error)
          // Return null instead of throwing to prevent NextAuth from showing generic error
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
    async signIn({ user, account, profile, email, credentials }) {
      try {
        console.log("SignIn callback:", { user: user?.email, account: account?.provider })
        return true
      } catch (error) {
        console.error("SignIn callback error:", error)
        return false
      }
    },
    async jwt({ token, user, account }) {
      try {
        if (user) {
          console.log("JWT callback - adding user data to token")
          token.role = user.role
          token.permissions = user.permissions
        }
        return token
      } catch (error) {
        console.error("JWT callback error:", error)
        return token
      }
    },
    async session({ session, token }) {
      try {
        if (token && session.user) {
          console.log("Session callback - building session")
          session.user.id = token.sub!
          session.user.role = token.role as string
          session.user.permissions = token.permissions as string[]
        }
        return session
      } catch (error) {
        console.error("Session callback error:", error)
        return session
      }
    },
  },
  pages: {
    signIn: "/auth/signin",
    error: "/auth/error",
  },
  events: {
    async signIn(message) {
      console.log("User signed in:", message.user.email)
    },
    async signOut(message) {
      console.log("User signed out")
    },
  },
  logger: {
    error(code, metadata) {
      console.error("NextAuth Error:", code, metadata)
    },
    warn(code) {
      console.warn("NextAuth Warning:", code)
    },
    debug(code, metadata) {
      if (process.env.NODE_ENV === "development") {
        console.log("NextAuth Debug:", code, metadata)
      }
    },
  },
  secret: process.env.NEXTAUTH_SECRET || "fallback-secret-for-development-only",
  debug: process.env.NODE_ENV === "development",
}

const handler = NextAuth(authOptions)

export { handler as GET, handler as POST }
