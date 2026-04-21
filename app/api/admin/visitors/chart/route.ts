import { sql } from "@/lib/db"
import { NextResponse } from "next/server"

export async function GET() {
  try {

    const chartData = await sql`
      SELECT 
        DATE(visited_at) as date,
        COUNT(*)::int as visits
      FROM visitors
      WHERE visited_at > NOW() - INTERVAL '30 days'
      GROUP BY DATE(visited_at)
      ORDER BY date ASC
    `

    const formattedData = chartData.map((item) => ({
      date: new Date(item.date).toLocaleDateString("en-US", { month: "short", day: "numeric" }),
      visits: item.visits,
    }))

    return NextResponse.json(formattedData)
  } catch (error) {
    console.error("Error fetching visitor chart data:", error)
    return NextResponse.json([])
  }
}
