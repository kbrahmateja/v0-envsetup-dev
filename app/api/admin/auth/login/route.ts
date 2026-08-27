import { type NextRequest, NextResponse } from "next/server"
import { verifyCredentials, createSessionToken } from "@/lib/auth"
import { checkRateLimit, getClientIp } from "@/lib/rate-limit"

// There's exactly one admin account, and until now this endpoint had no
// throttling at all - unlimited POSTs to try passwords against it. 10
// attempts per IP per 15 minutes is plenty for a real person who mistypes a
// few times, but turns brute-forcing the password into a multi-day exercise
// instead of a same-afternoon one.
const RATE_LIMIT = { limit: 10, windowMs: 15 * 60 * 1000 }

export async function POST(request: NextRequest) {
  try {
    const ip = getClientIp(request)
    const { allowed } = await checkRateLimit("admin-login", ip, RATE_LIMIT)
    if (!allowed) {
      return NextResponse.json(
        { error: "Too many login attempts. Please try again later." },
        { status: 429 },
      )
    }

    const body = await request.json()
    const { username, password } = body

    if (!username || !password) {
      return NextResponse.json({ error: "Username and password required" }, { status: 400 })
    }

    // Verify credentials
    if (!verifyCredentials(username, password)) {
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 })
    }

    // Generate a signed, expiring session token
    const token = await createSessionToken(username)

    // Create response with session cookie
    const response = NextResponse.json({ success: true, message: "Login successful" })

    response.cookies.set("admin_session", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7, // 7 days
      path: "/",
    })

    return response
  } catch (error) {
    console.error("Login error:", error)
    return NextResponse.json({ error: "Login failed" }, { status: 500 })
  }
}
