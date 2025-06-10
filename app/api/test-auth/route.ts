import { NextResponse } from "next/server"

export async function GET() {
  try {
    return NextResponse.json({
      message: "API routes are working",
      timestamp: new Date().toISOString(),
      env: {
        NEXTAUTH_URL: process.env.NEXTAUTH_URL,
        NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET ? "SET" : "NOT SET",
        NODE_ENV: process.env.NODE_ENV,
      },
    })
  } catch (error) {
    console.error("Test API error:", error)
    return NextResponse.json({ error: "API test failed" }, { status: 500 })
  }
}
