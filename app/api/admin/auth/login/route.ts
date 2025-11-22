import { type NextRequest, NextResponse } from "next/server"
import { verifyCredentials, generateSessionToken } from "@/lib/auth"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { username, password } = body

    console.log("Login attempt for username:", username)

    if (!username || !password) {
      return NextResponse.json({ error: "Username and password required" }, { status: 400 })
    }

    // Verify credentials
    if (!verifyCredentials(username, password)) {
      console.log("Invalid credentials for username:", username)
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 })
    }

    // Generate session token
    const token = generateSessionToken()
    console.log("Session token generated:", token)

    // Create response with session cookie
    const response = NextResponse.json({ success: true, message: "Login successful" })

    response.cookies.set("admin_session", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7, // 7 days
      path: "/",
    })

    console.log("Login successful, cookie set")
    return response
  } catch (error) {
    console.error("Login error:", error)
    return NextResponse.json({ error: "Login failed" }, { status: 500 })
  }
}
