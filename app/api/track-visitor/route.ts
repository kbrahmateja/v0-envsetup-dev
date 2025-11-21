import { type NextRequest, NextResponse } from "next/server"
import { neon } from "@neondatabase/serverless"

const sql = neon(process.env.DATABASE_URL!)

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { page_url, referrer } = body

    // Get IP address
    const ip = req.headers.get("x-forwarded-for") || req.headers.get("x-real-ip") || "unknown"
    const userAgent = req.headers.get("user-agent") || "unknown"

    // In production, you would use a GeoIP service to get location
    // For now, we'll use placeholder data
    const country = "Unknown"
    const city = "Unknown"

    await sql`
      INSERT INTO visitors (ip_address, user_agent, page_url, referrer, country, city, visited_at)
      VALUES (${ip}, ${userAgent}, ${page_url}, ${referrer}, ${country}, ${city}, NOW())
    `

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error tracking visitor:", error)
    return NextResponse.json({ success: false }, { status: 500 })
  }
}
