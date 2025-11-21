import { neon } from "@neondatabase/serverless"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { formatDistanceToNow } from "date-fns"

export async function RecentSubscribers() {
  const sql = neon(process.env.DATABASE_URL!)

  const subscribers = await sql`
    SELECT email, subscribed_at, status
    FROM subscribers
    ORDER BY subscribed_at DESC
    LIMIT 10
  `

  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Subscribers</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {subscribers.map((sub, idx) => (
            <div key={idx} className="flex items-center justify-between border-b pb-3 last:border-0">
              <div>
                <p className="font-medium">{sub.email}</p>
                <p className="text-sm text-muted-foreground">
                  {formatDistanceToNow(new Date(sub.subscribed_at), { addSuffix: true })}
                </p>
              </div>
              <span
                className={`text-xs px-2 py-1 rounded ${
                  sub.status === "active" ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"
                }`}
              >
                {sub.status}
              </span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
