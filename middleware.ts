import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { getToken } from "next-auth/jwt"

export async function middleware(request: NextRequest) {
  try {
    const token = await getToken({
      req: request,
      secret: process.env.NEXTAUTH_SECRET || "fallback-secret-for-development",
    })

    const { pathname } = request.nextUrl

    // Allow access to auth pages and API routes
    if (pathname.startsWith("/auth") || pathname.startsWith("/api")) {
      return NextResponse.next()
    }

    // Protect admin routes
    if (pathname.startsWith("/admin")) {
      if (!token) {
        return NextResponse.redirect(new URL("/auth/signin", request.url))
      }

      // Check if user has admin or teacher role
      if (token.role !== "admin" && token.role !== "teacher") {
        return NextResponse.redirect(new URL("/", request.url))
      }
    }

    return NextResponse.next()
  } catch (error) {
    console.error("Middleware error:", error)
    return NextResponse.next()
  }
}

export const config = {
  matcher: ["/admin/:path*"],
}
