import { sql } from "@/lib/db"

// Shared IP-based rate limiter for public endpoints that cost money or can
// be used to spam third parties (email sends, ZIP generation). Same
// self-healing pattern as generations/ai_assistant_usage: no local
// migration tooling is available, so the table is created on first use.
// Fails OPEN on a DB error - an outage should never block the feature
// itself, only real abuse should.
async function ensureTable() {
  await sql`
    CREATE TABLE IF NOT EXISTS rate_limit_events (
      id SERIAL PRIMARY KEY,
      bucket VARCHAR(64) NOT NULL,
      ip_address VARCHAR(64) NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `
  await sql`
    CREATE INDEX IF NOT EXISTS idx_rate_limit_bucket_ip_created
    ON rate_limit_events(bucket, ip_address, created_at DESC)
  `
}

export async function checkRateLimit(
  bucket: string,
  ip: string,
  opts: { limit: number; windowMs: number },
): Promise<{ allowed: boolean }> {
  const windowSeconds = Math.ceil(opts.windowMs / 1000)

  const attempt = async () => {
    const result = await sql`
      SELECT COUNT(*)::int AS count FROM rate_limit_events
      WHERE bucket = ${bucket} AND ip_address = ${ip}
        AND created_at > NOW() - make_interval(secs => ${windowSeconds})
    `
    const count = (result[0] as { count: number } | undefined)?.count ?? 0
    if (count >= opts.limit) return { allowed: false }
    await sql`INSERT INTO rate_limit_events (bucket, ip_address) VALUES (${bucket}, ${ip})`
    return { allowed: true }
  }

  try {
    return await attempt()
  } catch {
    try {
      await ensureTable()
      return await attempt()
    } catch (retryErr) {
      console.error(`Rate limit check failed for bucket "${bucket}", allowing request:`, retryErr)
      return { allowed: true }
    }
  }
}

export function getClientIp(req: Request): string {
  const h = (name: string) => req.headers.get(name)
  return h("x-forwarded-for")?.split(",")[0].trim() || h("x-real-ip") || h("cf-connecting-ip") || "unknown"
}
