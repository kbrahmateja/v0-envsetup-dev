import { type NextRequest, NextResponse } from "next/server"
import { neon } from "@neondatabase/serverless"

const sql = neon(process.env.DATABASE_URL!)

async function getLocationFromIP(ip: string) {
  try {
    // Skip for local/unknown IPs
    if (ip === "unknown" || ip === "127.0.0.1" || ip.startsWith("192.168.") || ip.startsWith("10.")) {
      return { country: "Unknown", city: "Unknown", state: "Unknown" }
    }

    // Using ip-api.com free API (no key required, 45 requests/minute)
    const response = await fetch(`http://ip-api.com/json/${ip}?fields=status,country,regionName,city`, {
      headers: { Accept: "application/json" },
    })

    if (!response.ok) {
      throw new Error("Geolocation API failed")
    }

    const data = await response.json()

    if (data.status === "success") {
      return {
        country: data.country || "Unknown",
        state: data.regionName || "Unknown",
        city: data.city || "Unknown",
      }
    }

    return { country: "Unknown", city: "Unknown", state: "Unknown" }
  } catch (error) {
    console.error("Geolocation lookup failed:", error)
    return { country: "Unknown", city: "Unknown", state: "Unknown" }
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { page_url, referrer } = body

    const ip =
      req.headers.get("x-forwarded-for")?.split(",")[0].trim() ||
      req.headers.get("x-real-ip") ||
      req.headers.get("cf-connecting-ip") || // Cloudflare
      "unknown"

    const userAgent = req.headers.get("user-agent") || "unknown"

    const location = await getLocationFromIP(ip)

    await sql`
      INSERT INTO visitors (ip_address, user_agent, page_url, referrer, country, city, visited_at)
      VALUES (${ip}, ${userAgent}, ${page_url}, ${referrer || ""}, ${location.country}, ${location.city}, NOW())
    `

    return NextResponse.json({
      success: true,
      location: location,
    })
  } catch (error) {
    console.error("Error tracking visitor:", error)
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}
