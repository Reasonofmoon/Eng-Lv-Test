import NextAuth from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"

// Simple user data
const users = [
  { id: "1", email: "admin@englishtest.com", password: "password123", name: "Admin", role: "admin" },
  { id: "2", email: "teacher@englishtest.com", password: "password123", name: "Teacher", role: "teacher" },
  { id: "3", email: "student@englishtest.com", password: "password123", name: "Student", role: "student" },
]

const authOptions = {
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        console.log("NextAuth authorize called with:", credentials?.email)

        if (!credentials?.email || !credentials?.password) {
          console.log("Missing credentials")
          return null
        }

        const user = users.find((u) => u.email === credentials.email && u.password === credentials.password)

        if (user) {
          console.log("User found:", user.email)
          return {
            id: user.id,
            email: user.email,
            name: user.name,
            role: user.role,
          }
        }

        console.log("User not found")
        return null
      },
    }),
  ],
  session: {
    strategy: "jwt" as const,
  },
  callbacks: {
    async jwt({ token, user }: any) {
      if (user) {
        token.role = user.role
      }
      return token
    },
    async session({ session, token }: any) {
      if (session.user) {
        session.user.id = token.sub
        session.user.role = token.role
      }
      return session
    },
  },
  pages: {
    signIn: "/auth/signin",
    error: "/auth/error",
  },
  secret: process.env.NEXTAUTH_SECRET || "fallback-secret-key",
  debug: true,
}

const handler = NextAuth(authOptions)

export { handler as GET, handler as POST }
