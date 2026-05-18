import { sql } from "@/lib/db"
import { NextResponse } from "next/server"

async function fetchNpmVersion(pkg: string): Promise<string | null> {
  try {
    const res = await fetch(`https://registry.npmjs.org/${encodeURIComponent(pkg)}/latest`, { next: { revalidate: 0 } })
    if (!res.ok) return null
    return (await res.json()).version ?? null
  } catch { return null }
}

async function fetchPypiVersion(pkg: string): Promise<string | null> {
  try {
    const res = await fetch(`https://pypi.org/pypi/${pkg}/json`, { next: { revalidate: 0 } })
    if (!res.ok) return null
    return (await res.json()).info?.version ?? null
  } catch { return null }
}

async function fetchCratesVersion(pkg: string): Promise<string | null> {
  try {
    const res = await fetch(`https://crates.io/api/v1/crates/${pkg}`,
      { headers: { "User-Agent": "envsetup.dev/1.0" }, next: { revalidate: 0 } })
    if (!res.ok) return null
    return (await res.json()).crate?.newest_version ?? null
  } catch { return null }
}

async function fetchGoVersion(mod: string): Promise<string | null> {
  try {
    const res = await fetch(`https://proxy.golang.org/${encodeURIComponent(mod)}/@latest`, { next: { revalidate: 0 } })
    if (!res.ok) return null
    return (await res.json()).Version ?? null
  } catch { return null }
}

async function fetchRubyGemsVersion(gem: string): Promise<string | null> {
  try {
    const res = await fetch(`https://rubygems.org/api/v1/gems/${gem}.json`, { next: { revalidate: 0 } })
    if (!res.ok) return null
    return (await res.json()).version ?? null
  } catch { return null }
}

async function fetchPackagistVersion(pkg: string): Promise<string | null> {
  try {
    const res = await fetch(`https://packagist.org/packages/${pkg}.json`, { next: { revalidate: 0 } })
    if (!res.ok) return null
    const versions = Object.keys((await res.json()).package?.versions ?? {})
      .filter(v => /^\d+\.\d+/.test(v.replace(/^v/, "")) && !v.includes("dev"))
      .sort().reverse()
    return versions[0]?.replace(/^v/, "") ?? null
  } catch { return null }
}

function isNewer(current: string, latest: string): boolean {
  const parse = (v: string) => v.replace(/^v/, "").split(".").map(Number)
  const [c, l] = [parse(current), parse(latest)]
  for (let i = 0; i < Math.max(c.length, l.length); i++) {
    if ((l[i] ?? 0) > (c[i] ?? 0)) return true
    if ((l[i] ?? 0) < (c[i] ?? 0)) return false
  }
  return false
}

export async function GET(req: Request) {
  const auth = req.headers.get("authorization")
  if (process.env.CRON_SECRET && auth !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const packages = await sql`SELECT * FROM version_tracking`
  const results = []

  for (const pkg of packages as any[]) {
    let latest: string | null = null
    const { ecosystem, package_name, display_name, current_version, id } = pkg

    if (ecosystem === "npm")         latest = await fetchNpmVersion(package_name)
    else if (ecosystem === "pypi")   latest = await fetchPypiVersion(package_name)
    else if (ecosystem === "crates") latest = await fetchCratesVersion(package_name)
    else if (ecosystem === "go")     latest = await fetchGoVersion(package_name)
    else if (ecosystem === "rubygems") latest = await fetchRubyGemsVersion(package_name)
    else if (ecosystem === "packagist") latest = await fetchPackagistVersion(package_name)

    if (!latest) continue

    const isNew = current_version ? isNewer(current_version, latest) : false
    await sql`UPDATE version_tracking SET latest_version=${latest}, is_new=${isNew}, checked_at=NOW() WHERE id=${id}`
    if (isNew) results.push({ package: display_name, from: current_version, to: latest })
  }

  return NextResponse.json({ checked: (packages as any[]).length, newVersions: results.length, updates: results })
}
