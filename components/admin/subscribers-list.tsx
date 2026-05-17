import { sql } from "@/lib/db"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { formatDistanceToNow } from "date-fns"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

export async function SubscribersList() {

  let subscribers: any[] = []

  try {
    subscribers = await sql`
      SELECT * FROM subscribers
      ORDER BY subscribed_at DESC
      LIMIT 100
    `
  } catch (error) {
    console.error("Error fetching subscribers list:", error)
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>All Subscribers</CardTitle>
      </CardHeader>
      <CardContent>
        {subscribers.length === 0 ? (
          <div className="flex items-center justify-center h-40 text-muted-foreground">No subscribers yet</div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Email</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Subscribed</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {subscribers.map((subscriber) => (
                <TableRow key={subscriber.id}>
                  <TableCell className="font-medium">{subscriber.email}</TableCell>
                  <TableCell>
                    <Badge variant={subscriber.status === "active" ? "default" : "secondary"}>
                      {subscriber.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {formatDistanceToNow(new Date(subscriber.subscribed_at), { addSuffix: true })}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  )
}
