import { sql } from "@/lib/db"

const NPM_PACKAGE = "@envsetup/cli"

interface NpmDownloads {
  today: number | null
  last7Days: number | null
}

export interface DailySummaryStats {
  newSubscribers: number
  visitorsToday: number
  visitorsYesterday: number
  visitorChange: string
  npmDownloadsLastDay: number | null
  npmDownloadsLast7Days: number | null
}

// npm's downloads API is public and unauthenticated - no API key needed.
// Failures here (npm having a bad day, network hiccup) should never take
// down the whole daily email, so every field defaults to null on error
// and the email just shows "unavailable" for that line instead of crashing.
async function getNpmDownloads(): Promise<NpmDownloads> {
  const fetchCount = async (range: "last-day" | "last-week"): Promise<number | null> => {
    try {
      const res = await fetch(`https://api.npmjs.org/downloads/point/${range}/${NPM_PACKAGE}`, {
        // Don't let a slow npm registry hold up the whole cron run.
        signal: AbortSignal.timeout(8000),
      })
      if (!res.ok) return null
      const data = await res.json()
      return typeof data.downloads === "number" ? data.downloads : null
    } catch (err) {
      console.error(`Failed to fetch npm ${range} downloads:`, err)
      return null
    }
  }

  const [today, last7Days] = await Promise.all([fetchCount("last-day"), fetchCount("last-week")])
  return { today, last7Days }
}

function formatChange(today: number, yesterday: number): string {
  if (yesterday === 0) {
    return today > 0 ? "new (0 yesterday)" : "no change"
  }
  const pct = ((today - yesterday) / yesterday) * 100
  const sign = pct > 0 ? "+" : ""
  return `${sign}${pct.toFixed(0)}% vs yesterday`
}

export async function collectDailySummaryStats(): Promise<DailySummaryStats> {
  const [subscribers] = await sql`
    SELECT COUNT(*) as count
    FROM subscribers
    WHERE DATE(subscribed_at) = CURRENT_DATE
  `

  const [visitorsToday] = await sql`
    SELECT COUNT(*) as count
    FROM visitors
    WHERE DATE(visited_at) = CURRENT_DATE
  `

  const [visitorsYesterday] = await sql`
    SELECT COUNT(*) as count
    FROM visitors
    WHERE DATE(visited_at) = CURRENT_DATE - INTERVAL '1 day'
  `

  const todayCount = Number(visitorsToday.count)
  const yesterdayCount = Number(visitorsYesterday.count)
  const npmDownloads = await getNpmDownloads()

  return {
    newSubscribers: Number(subscribers.count),
    visitorsToday: todayCount,
    visitorsYesterday: yesterdayCount,
    visitorChange: formatChange(todayCount, yesterdayCount),
    npmDownloadsLastDay: npmDownloads.today,
    npmDownloadsLast7Days: npmDownloads.last7Days,
  }
}

// Table-based layout with inline styles throughout - not because it's
// pretty to read as source, but because Gmail/Outlook strip <style>
// blocks and modern CSS (flex/grid) from email HTML, so anything not
// inlined silently renders unstyled.
export function renderDailySummaryEmail(stats: DailySummaryStats, options?: { isTest?: boolean }): string {
  const dateLabel = new Date().toLocaleDateString(undefined, {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  })

  const statRow = (label: string, value: string, sub?: string) => `
    <tr>
      <td style="padding:14px 20px;border-bottom:1px solid #e6e9ef;">
        <div style="font:13px -apple-system,Segoe UI,Roboto,sans-serif;color:#6b7280;letter-spacing:.02em;text-transform:uppercase;">${label}</div>
        <div style="font:600 22px -apple-system,Segoe UI,Roboto,sans-serif;color:#111827;margin-top:2px;">${value}</div>
        ${sub ? `<div style="font:13px -apple-system,Segoe UI,Roboto,sans-serif;color:#9ca3af;margin-top:2px;">${sub}</div>` : ""}
      </td>
    </tr>`

  return `
<div style="background:#f3f4f6;padding:32px 16px;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:560px;margin:0 auto;background:#ffffff;border-radius:12px;overflow:hidden;border:1px solid #e6e9ef;">
    <tr>
      <td style="background:#0f172a;padding:24px 28px;">
        <div style="font:700 18px -apple-system,Segoe UI,Roboto,sans-serif;color:#ffffff;">EnvSetup.dev</div>
        <div style="font:13px -apple-system,Segoe UI,Roboto,sans-serif;color:#94a3b8;margin-top:2px;">${options?.isTest ? "Daily report (test send) · " : "Daily report · "}${dateLabel}</div>
      </td>
    </tr>
    <tr>
      <td>
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
          ${statRow("Website visitors today", String(stats.visitorsToday), `${stats.visitorChange} · ${stats.visitorsYesterday} yesterday`)}
          ${statRow("New subscribers today", String(stats.newSubscribers))}
          ${statRow(
            "npm downloads (last 24h)",
            stats.npmDownloadsLastDay !== null ? String(stats.npmDownloadsLastDay) : "unavailable",
          )}
          ${statRow(
            "npm downloads (last 7 days)",
            stats.npmDownloadsLast7Days !== null ? String(stats.npmDownloadsLast7Days) : "unavailable",
          )}
        </table>
      </td>
    </tr>
    <tr>
      <td style="padding:18px 28px;background:#f9fafb;">
        <a href="https://envsetup.dev/admin" style="font:600 13px -apple-system,Segoe UI,Roboto,sans-serif;color:#2563eb;text-decoration:none;">Open admin dashboard</a>
        <span style="color:#d1d5db;padding:0 8px;">|</span>
        <a href="https://www.npmjs.com/package/${NPM_PACKAGE}" style="font:600 13px -apple-system,Segoe UI,Roboto,sans-serif;color:#2563eb;text-decoration:none;">View npm package</a>
      </td>
    </tr>
  </table>
</div>`
}

export async function sendDailySummaryEmail(options?: { isTest?: boolean }): Promise<{ stats: DailySummaryStats }> {
  const stats = await collectDailySummaryStats()
  const htmlContent = renderDailySummaryEmail(stats, options)
  const dateShort = new Date().toLocaleDateString()

  const brevoResponse = await fetch("https://api.brevo.com/v3/smtp/email", {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      "api-key": process.env.BREVO_API_KEY!,
    },
    body: JSON.stringify({
      sender: {
        name: "EnvSetup.dev",
        email: "info@envsetup.dev",
      },
      to: [
        {
          email: "kbrahmateja@gmail.com",
          name: "Admin",
        },
      ],
      subject: options?.isTest
        ? `[Test] EnvSetup.dev daily report — ${dateShort}`
        : `EnvSetup.dev daily report — ${dateShort}`,
      htmlContent,
    }),
  })

  if (!brevoResponse.ok) {
    const errBody = await brevoResponse.text().catch(() => "")
    throw new Error(`Failed to send email via Brevo: ${errBody}`)
  }

  return { stats }
}
