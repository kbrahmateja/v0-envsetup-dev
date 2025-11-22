import { type NextRequest, NextResponse } from "next/server"
import { neon } from "@neondatabase/serverless"

let sql: ReturnType<typeof neon>

try {
  if (!process.env.DATABASE_URL) {
    throw new Error("DATABASE_URL is not configured")
  }
  sql = neon(process.env.DATABASE_URL)
} catch (error) {
  console.error("Failed to initialize database connection:", error)
}

async function getLocationFromIP(ip: string) {
  try {
    // Skip for local/unknown IPs
    if (ip === "unknown" || ip === "127.0.0.1" || ip.startsWith("192.168.") || ip.startsWith("10.")) {
      return { country: "Unknown", city: "Unknown", state: "Unknown" }
    }

    // Using ip-api.com free API (no key required, 45 requests/minute)
    const response = await fetch(`http://ip-api.com/json/${ip}?fields=status,country,regionName,city`, {
      headers: { Accept: "application/json" },
      signal: AbortSignal.timeout(5000),
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
    if (!sql) {
      console.error("Database connection not initialized")
      return NextResponse.json(
        {
          success: false,
          error: "Database connection not available",
        },
        { status: 503 },
      )
    }

    const body = await req.json()
    const { page_url, referrer } = body

    const ip =
      req.headers.get("x-forwarded-for")?.split(",")[0].trim() ||
      req.headers.get("x-real-ip") ||
      req.headers.get("cf-connecting-ip") || // Cloudflare
      "unknown"

    const userAgent = req.headers.get("user-agent") || "unknown"

    const location = await getLocationFromIP(ip)

    const insertPromise = sql`
      INSERT INTO visitors (ip_address, user_agent, page_url, referrer, country, city, state, visited_at)
      VALUES (${ip}, ${userAgent}, ${page_url}, ${referrer || ""}, ${location.country}, ${location.city}, ${location.state}, NOW())
    `

    await Promise.race([
      insertPromise,
      new Promise((_, reject) => setTimeout(() => reject(new Error("Database query timeout")), 10000)),
    ])

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
        details: error instanceof Error ? error.stack : undefined,
      },
      { status: 500 },
    )
  }
}
