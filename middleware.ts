import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { verifySessionToken } from "@/lib/auth"

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  const isAdminArea = pathname.startsWith("/admin") || pathname.startsWith("/api/admin")
  if (!isAdminArea) {
    return NextResponse.next()
  }

  // Allow the login page and the auth endpoints themselves through unauthenticated.
  const isAuthRoute = pathname === "/admin/login" || pathname.startsWith("/api/admin/auth")
  if (isAuthRoute) {
    return NextResponse.next()
  }

  const session = request.cookies.get("admin_session")?.value
  const isValid = await verifySessionToken(session)

  if (!isValid) {
    if (pathname.startsWith("/api/admin")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }
    const loginUrl = new URL("/admin/login", request.url)
    return NextResponse.redirect(loginUrl)
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/admin/:path*", "/api/admin/:path*"],
}
