import { VisitorsList } from "@/components/admin/visitors-list"
import { VisitorsChart } from "@/components/admin/visitors-chart"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { neon } from "@neondatabase/serverless"

export const dynamic = "force-dynamic"

export default async function VisitorsPage() {
  const sql = neon(process.env.DATABASE_URL!)

  let stats = [{ total: 0, unique_visitors: 0, today: 0 }]

  try {
    const result = await sql`
      SELECT 
        COUNT(*)::int as total,
        COUNT(DISTINCT ip_address)::int as unique_visitors,
        COUNT(*) FILTER (WHERE visited_at > NOW() - INTERVAL '24 hours')::int as today
      FROM visitors
    `
    stats = result
  } catch (error) {
    console.error("Error fetching visitor stats:", error)
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Visitor Analytics</h1>
        <p className="text-muted-foreground">Track and analyze site visitors</p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Visits</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats[0].total}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Unique Visitors</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats[0].unique_visitors}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Today</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats[0].today}</div>
          </CardContent>
        </Card>
      </div>

      <VisitorsChart />

      <VisitorsList />
    </div>
  )
}
