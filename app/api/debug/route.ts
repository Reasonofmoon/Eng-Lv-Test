import { NextResponse } from "next/server"

export async function GET() {
  return NextResponse.json({
    message: "환경 변수 확인",
    environment: {
      NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET ? "✅ 설정됨" : "❌ 설정되지 않음",
      NEXTAUTH_URL: process.env.NEXTAUTH_URL || "❌ 설정되지 않음",
      NODE_ENV: process.env.NODE_ENV || "❌ 설정되지 않음",
      secretLength: process.env.NEXTAUTH_SECRET?.length || 0,
    },
    timestamp: new Date().toISOString(),
  })
}
