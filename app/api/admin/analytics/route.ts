import { type NextRequest, NextResponse } from "next/server"
import { sql } from "@/lib/db"

// ─────────────────────────────────────────
// Real analytics for the admin dashboard, built from the `visitors` table
// (one row per page load: ip_address, user_agent, page_url, referrer,
// country, city, state, visited_at). No session concept exists yet, so
// "visitors" here means distinct IP addresses in the window, and
// "downloads"/"conversion rate" are intentionally omitted (null) rather
// than faked — nothing tracks template downloads or sessions today.
// ─────────────────────────────────────────

interface AggRow {
  page_views: number
  visitors: number
}
interface DailyRow {
  date: string
  page_views: number
  visitors: number
}
interface GeoRow {
  country: string
  visitors: number
}
interface ReferrerRow {
  referrer: string | null
  count: number
}
interface UaRow {
  user_agent: string | null
  count: number
}

function parseDevice(userAgent: string | null): "Desktop" | "Mobile" | "Tablet" {
  const ua = (userAgent || "").toLowerCase()
  if (/ipad|tablet|(android(?!.*mobile))/i.test(ua)) return "Tablet"
  if (/mobi|iphone|ipod|android/i.test(ua)) return "Mobile"
  return "Desktop"
}

function bucketReferrer(referrer: string | null): string {
  if (!referrer || referrer.trim() === "") return "Direct"
  let host = ""
  try {
    host = new URL(referrer).hostname.replace(/^www\./, "").toLowerCase()
  } catch {
    return "Direct"
  }
  if (host.includes("envsetup.dev")) return "Direct" // internal navigation
  if (host.includes("google")) return "Google"
  if (host.includes("github")) return "GitHub"
  if (host.includes("twitter") || host.includes("x.com")) return "Twitter / X"
  if (host.includes("linkedin")) return "LinkedIn"
  if (host.includes("facebook")) return "Facebook"
  return host || "Other"
}

function getRange(searchParams: URLSearchParams) {
  const now = new Date()
  const toParam = searchParams.get("to")
  const fromParam = searchParams.get("from")

  let to = toParam ? new Date(toParam) : now
  let from = fromParam ? new Date(fromParam) : new Date(to.getTime() - 29 * 24 * 60 * 60 * 1000)

  if (Number.isNaN(to.getTime())) to = now
  if (Number.isNaN(from.getTime())) from = new Date(to.getTime() - 29 * 24 * 60 * 60 * 1000)
  if (from > to) [from, to] = [to, from]

  const rangeMs = Math.max(to.getTime() - from.getTime(), 24 * 60 * 60 * 1000)
  const prevTo = new Date(from.getTime() - 1)
  const prevFrom = new Date(prevTo.getTime() - rangeMs)

  return { from, to, prevFrom, prevTo }
}

function pctChange(current: number, previous: number): number {
  if (previous === 0) return current > 0 ? 100 : 0
  return Math.round(((current - previous) / previous) * 100)
}

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const { from, to, prevFrom, prevTo } = getRange(searchParams)
    const fromIso = from.toISOString()
    const toIso = to.toISOString()
    const prevFromIso = prevFrom.toISOString()
    const prevToIso = prevTo.toISOString()

    const [currentAgg, previousAgg, dailyRows, geoRows, referrerRows, uaRows] = await Promise.all([
      sql`
        SELECT COUNT(*)::int AS page_views, COUNT(DISTINCT ip_address)::int AS visitors
        FROM visitors
        WHERE visited_at BETWEEN ${fromIso}::timestamptz AND ${toIso}::timestamptz
      ` as unknown as Promise<AggRow[]>,
      sql`
        SELECT COUNT(*)::int AS page_views, COUNT(DISTINCT ip_address)::int AS visitors
        FROM visitors
        WHERE visited_at BETWEEN ${prevFromIso}::timestamptz AND ${prevToIso}::timestamptz
      ` as unknown as Promise<AggRow[]>,
      sql`
        SELECT DATE(visited_at) AS date, COUNT(*)::int AS page_views, COUNT(DISTINCT ip_address)::int AS visitors
        FROM visitors
        WHERE visited_at BETWEEN ${fromIso}::timestamptz AND ${toIso}::timestamptz
        GROUP BY DATE(visited_at)
        ORDER BY date ASC
      ` as unknown as Promise<DailyRow[]>,
      sql`
        SELECT COALESCE(NULLIF(country, ''), 'Unknown') AS country, COUNT(DISTINCT ip_address)::int AS visitors
        FROM visitors
        WHERE visited_at BETWEEN ${fromIso}::timestamptz AND ${toIso}::timestamptz
        GROUP BY COALESCE(NULLIF(country, ''), 'Unknown')
        ORDER BY visitors DESC
      ` as unknown as Promise<GeoRow[]>,
      sql`
        SELECT referrer, COUNT(*)::int AS count
        FROM visitors
        WHERE visited_at BETWEEN ${fromIso}::timestamptz AND ${toIso}::timestamptz
        GROUP BY referrer
      ` as unknown as Promise<ReferrerRow[]>,
      sql`
        SELECT user_agent, COUNT(*)::int AS count
        FROM visitors
        WHERE visited_at BETWEEN ${fromIso}::timestamptz AND ${toIso}::timestamptz
        GROUP BY user_agent
      ` as unknown as Promise<UaRow[]>,
    ])

    const curr = currentAgg[0] ?? { page_views: 0, visitors: 0 }
    const prev = previousAgg[0] ?? { page_views: 0, visitors: 0 }

    const overview = {
      totalVisitors: curr.visitors,
      pageViews: curr.page_views,
      visitorChange: pctChange(curr.visitors, prev.visitors),
      pageViewChange: pctChange(curr.page_views, prev.page_views),
      // No download/session tracking exists yet — report as untracked rather than fabricating a number.
      downloads: null as number | null,
      downloadChange: null as number | null,
      conversionRate: null as number | null,
      conversionChange: null as number | null,
    }

    const visitorTrends = dailyRows.map((r) => ({
      date: new Date(r.date).toISOString().split("T")[0],
      visitors: r.visitors,
      pageViews: r.page_views,
    }))

    const totalGeoVisitors = geoRows.reduce((sum, r) => sum + r.visitors, 0) || 1
    const topGeo = geoRows.slice(0, 5)
    const otherGeo = geoRows.slice(5)
    const otherGeoVisitors = otherGeo.reduce((sum, r) => sum + r.visitors, 0)
    const geographicDistribution = [
      ...topGeo.map((r) => ({
        country: r.country as string,
        visitors: r.visitors as number,
        percentage: Math.round((r.visitors / totalGeoVisitors) * 100),
      })),
      ...(otherGeoVisitors > 0
        ? [
            {
              country: "Others",
              visitors: otherGeoVisitors,
              percentage: Math.round((otherGeoVisitors / totalGeoVisitors) * 100),
            },
          ]
        : []),
    ]

    const deviceCounts: Record<"Desktop" | "Mobile" | "Tablet", number> = { Desktop: 0, Mobile: 0, Tablet: 0 }
    for (const row of uaRows) {
      deviceCounts[parseDevice(row.user_agent)] += row.count
    }
    const totalDeviceCount = deviceCounts.Desktop + deviceCounts.Mobile + deviceCounts.Tablet || 1
    const deviceColors = { Desktop: "#8884d8", Mobile: "#82ca9d", Tablet: "#ffc658" } as const
    const deviceStats = (["Desktop", "Mobile", "Tablet"] as const).map((device) => ({
      device,
      visitors: deviceCounts[device],
      percentage: Math.round((deviceCounts[device] / totalDeviceCount) * 100),
      color: deviceColors[device],
    }))

    const referrerCounts: Record<string, number> = {}
    for (const row of referrerRows) {
      const bucket = bucketReferrer(row.referrer)
      referrerCounts[bucket] = (referrerCounts[bucket] || 0) + row.count
    }
    const totalReferrerCount = Object.values(referrerCounts).reduce((a, b) => a + b, 0) || 1
    const referralSources = Object.entries(referrerCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 6)
      .map(([source, count]) => ({
        source,
        visitors: count,
        percentage: Math.round((count / totalReferrerCount) * 100),
      }))

    return NextResponse.json({
      overview,
      visitorTrends,
      geographicDistribution,
      deviceStats,
      referralSources,
    })
  } catch (error) {
    console.error("Error building admin analytics:", error)
    return NextResponse.json({ error: "Failed to load analytics" }, { status: 500 })
  }
}
