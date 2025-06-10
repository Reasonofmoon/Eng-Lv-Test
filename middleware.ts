import { withAuth } from "next-auth/middleware"

export default withAuth(
  function middleware(req) {
    // Add any additional middleware logic here
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        // Allow access to public routes
        if (req.nextUrl.pathname.startsWith("/auth")) {
          return true
        }

        // Require authentication for admin routes
        if (req.nextUrl.pathname.startsWith("/admin")) {
          return !!token && (token.role === "admin" || token.role === "teacher")
        }

        // Allow access to other routes if authenticated or public
        return true
      },
    },
  },
)

export const config = {
  matcher: ["/admin/:path*", "/auth/:path*"],
}
