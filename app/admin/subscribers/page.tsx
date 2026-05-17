import { Suspense } from "react"
import { SubscribersList } from "@/components/admin/subscribers-list"
import { Skeleton } from "@/components/ui/skeleton"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { sql } from "@/lib/db"

export const dynamic = "force-dynamic"

export default async function SubscribersPage() {

  let stats
  try {
    stats = await sql`
      SELECT 
        COUNT(*)::int as total,
        COUNT(*) FILTER (WHERE status = 'active')::int as active,
        COUNT(*) FILTER (WHERE subscribed_at > NOW() - INTERVAL '30 days')::int as recent
      FROM subscribers
    `
  } catch (error) {
    console.error("Error fetching subscriber stats:", error)
    stats = [{ total: 0, active: 0, recent: 0 }]
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Subscribers</h1>
        <p className="text-muted-foreground">Manage your newsletter subscribers</p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Subscribers</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats[0].total}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Active Subscribers</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats[0].active}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Last 30 Days</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats[0].recent}</div>
          </CardContent>
        </Card>
      </div>

      <Suspense fallback={<Skeleton className="h-96 w-full" />}>
        <SubscribersList />
      </Suspense>
    </div>
  )
}
