import { sql } from "@/lib/db"
import { NextResponse } from "next/server"

export const revalidate = 0 // no cache for debugging

export async function GET() {
  try {
    const newVersions = await sql`
      SELECT display_name, language, current_version, latest_version, changelog_url
      FROM version_tracking
      WHERE is_new = true
      ORDER BY checked_at DESC
      LIMIT 10
    `
    const allVersions = await sql`
      SELECT display_name, language, ecosystem, current_version, latest_version, checked_at
      FROM version_tracking
      ORDER BY language, display_name
    `
    return NextResponse.json({
      newVersions,
      allVersions,
      total: (allVersions as any[]).length
    })
  } catch (err) {
    console.error("versions API error:", err)
    return NextResponse.json({
      newVersions: [],
      allVersions: [],
      error: String(err)
    })
  }
}
