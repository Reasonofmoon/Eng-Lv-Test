import { getServerSession } from "next-auth"
import { NextResponse } from "next/server"

export async function GET() {
  try {
    const session = await getServerSession()
    return NextResponse.json(session)
  } catch (error) {
    console.error("Session API error:", error)
    return NextResponse.json({ error: "Failed to get session" }, { status: 500 })
  }
}
