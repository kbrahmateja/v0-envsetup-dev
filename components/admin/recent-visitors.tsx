import { sql } from "@/lib/db"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { formatDistanceToNow } from "date-fns"

export async function RecentVisitors() {

  let visitors: any[] = []

  try {
    visitors = await sql`
      SELECT page_url, country, city, visited_at
      FROM visitors
      ORDER BY visited_at DESC
      LIMIT 10
    `
  } catch (error) {
    console.error("Error fetching recent visitors:", error)
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Visitors</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {visitors.length === 0 ? (
            <div className="flex items-center justify-center h-40 text-muted-foreground">No visitors tracked yet</div>
          ) : (
            visitors.map((visitor, idx) => (
              <div key={idx} className="flex items-center justify-between border-b pb-3 last:border-0">
                <div>
                  <p className="font-medium text-sm">{visitor.page_url}</p>
                  <p className="text-sm text-muted-foreground">
                    {visitor.city}, {visitor.country} •{" "}
                    {formatDistanceToNow(new Date(visitor.visited_at), { addSuffix: true })}
                  </p>
                </div>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  )
}
