import { type NextRequest, NextResponse } from "next/server"
import { sql } from "@/lib/db"
import { checkRateLimit, getClientIp } from "@/lib/rate-limit"
import { AFFILIATE_LINKS } from "@/lib/affiliate-links"

// Non-blocking click tracking for the "Deploy This Environment" links.
// Called with fetch(..., { keepalive: true }) from the client right as the
// user's browser is also navigating to the real deploy link - this route
// must never be slow or throw in a way that could be perceived as blocking
// that navigation, so every failure path still returns 200.
const RATE_LIMIT = { limit: 60, windowMs: 60 * 1000 }

async function ensureTable() {
  await sql`
    CREATE TABLE IF NOT EXISTS affiliate_clicks (
      id SERIAL PRIMARY KEY,
      platform VARCHAR(64) NOT NULL,
      page_url TEXT,
      clicked_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `
  await sql`
    CREATE INDEX IF NOT EXISTS idx_affiliate_clicks_platform_clicked
    ON affiliate_clicks(platform, clicked_at DESC)
  `
}

export async function POST(req: NextRequest) {
  try {
    const ip = getClientIp(req)
    const { allowed } = await checkRateLimit("affiliate-click", ip, RATE_LIMIT)
    if (!allowed) {
      return NextResponse.json({ ok: false }, { status: 429 })
    }

    const body = await req.json().catch(() => ({}) as Record<string, unknown>)
    const platform = typeof body?.platform === "string" ? body.platform : ""
    const pageUrl = typeof body?.pageUrl === "string" ? body.pageUrl.slice(0, 500) : null

    // Only ever log platform ids we actually know about, never an
    // arbitrary string a client could send.
    if (!AFFILIATE_LINKS.some((link) => link.id === platform)) {
      return NextResponse.json({ ok: false, error: "Unknown platform" }, { status: 400 })
    }

    const insert = () => sql`
      INSERT INTO affiliate_clicks (platform, page_url) VALUES (${platform}, ${pageUrl})
    `

    try {
      await insert()
    } catch {
      await ensureTable()
      await insert()
    }

    return NextResponse.json({ ok: true })
  } catch (error) {
    console.error("Error tracking affiliate click:", error)
    // A tracking failure must never surface as an error to the click -
    // the user has already navigated to the real deploy link by then.
    return NextResponse.json({ ok: false }, { status: 200 })
  }
}
