import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Check if accessing admin routes (except login page and auth API)
  if (pathname.startsWith("/admin")) {
    // Allow login page and auth API
    if (pathname === "/admin/login" || pathname.startsWith("/api/admin/auth")) {
      return NextResponse.next()
    }

    // Check for admin session cookie
    const session = request.cookies.get("admin_session")

    console.log("Middleware check for path:", pathname, "Session exists:", !!session)

    if (!session) {
      // Redirect to login if no session
      console.log("No session found, redirecting to login")
      const loginUrl = new URL("/admin/login", request.url)
      return NextResponse.redirect(loginUrl)
    }

    console.log("Session found, allowing access")
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/admin/:path*"],
}
