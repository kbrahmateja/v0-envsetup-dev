import { sql } from "@/lib/db"
import { NextResponse } from "next/server"

async function fetchNpmVersion(pkg: string): Promise<string | null> {
  try {
    // Fetch dist-tags to get stable 'latest' (not canary/next/alpha)
    const res = await fetch(`https://registry.npmjs.org/${encodeURIComponent(pkg)}`, { next: { revalidate: 0 } })
    if (!res.ok) return null
    const data = await res.json()
    // Use 'latest' dist-tag which is the stable release
    const latestTag = data['dist-tags']?.latest
    if (!latestTag) return null
    // Skip if it looks like a pre-release
    if (/alpha|beta|rc|canary|next|dev|pre/.test(latestTag)) return null
    return latestTag
  } catch { return null }
}

async function fetchPypiVersion(pkg: string): Promise<string | null> {
  try {
    const res = await fetch(`https://pypi.org/pypi/${pkg}/json`, { next: { revalidate: 0 } })
    if (!res.ok) return null
    const data = await res.json()
    // Get stable releases only (no alpha, beta, rc, dev)
    const releases = Object.keys(data.releases ?? {})
      .filter(v => !v.includes('a') && !v.includes('b') && !v.includes('rc') && !v.includes('dev') && !v.includes('.post'))
      .sort((a, b) => {
        const pa = a.split('.').map(Number)
        const pb = b.split('.').map(Number)
        for (let i = 0; i < Math.max(pa.length, pb.length); i++) {
          if ((pb[i] ?? 0) !== (pa[i] ?? 0)) return (pb[i] ?? 0) - (pa[i] ?? 0)
        }
        return 0
      })
    return releases[0] ?? data.info?.version ?? null
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
    const data = await res.json()
    const versions = Object.keys(data.package?.versions ?? {})
      .filter(v => {
        const clean = v.replace(/^v/, "")
        return /^\d+\.\d+/.test(clean) &&
               !v.includes("dev") && !v.includes("alpha") &&
               !v.includes("beta") && !v.includes("RC") && !v.includes("patch")
      })
      .sort((a, b) => {
        const pa = a.replace(/^v/,"").split('.').map(Number)
        const pb = b.replace(/^v/,"").split('.').map(Number)
        for (let i = 0; i < 3; i++) {
          if ((pb[i]??0) !== (pa[i]??0)) return (pb[i]??0) - (pa[i]??0)
        }
        return 0
      })
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
