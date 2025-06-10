import NextAuth from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"

// 간단한 사용자 데이터 (실제 프로덕션에서는 데이터베이스 사용)
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
        console.log("🔐 NextAuth authorize 호출됨:", credentials?.email)

        if (!credentials?.email || !credentials?.password) {
          console.log("❌ 자격증명 누락")
          return null
        }

        // 하드코딩된 사용자 목록에서 찾기
        const user = users.find((u) => u.email === credentials.email && u.password === credentials.password)

        if (user) {
          console.log("✅ 사용자 찾음:", user.email)
          return {
            id: user.id,
            email: user.email,
            name: user.name,
            role: user.role,
          }
        }

        console.log("❌ 사용자를 찾을 수 없음")
        return null
      },
    }),
  ],
  session: {
    strategy: "jwt" as const,
    maxAge: 24 * 60 * 60, // 24시간
  },
  callbacks: {
    async jwt({ token, user }: any) {
      if (user) {
        token.role = user.role
        console.log("🎫 JWT 토큰 생성:", user.email)
      }
      return token
    },
    async session({ session, token }: any) {
      if (session.user) {
        session.user.id = token.sub
        session.user.role = token.role
        console.log("📋 세션 생성:", session.user.email)
      }
      return session
    },
  },
  pages: {
    signIn: "/auth/signin",
    error: "/auth/error",
  },
  // 🔑 여기서 키를 설정합니다
  secret: process.env.NEXTAUTH_SECRET || "development-fallback-secret-key-12345",
  debug: process.env.NODE_ENV === "development",
}

const handler = NextAuth(authOptions)

export { handler as GET, handler as POST }
