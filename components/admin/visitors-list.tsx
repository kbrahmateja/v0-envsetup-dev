import { neon } from "@neondatabase/serverless"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { formatDistanceToNow } from "date-fns"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

export async function VisitorsList() {
  const sql = neon(process.env.DATABASE_URL!)

  let visitors: any[] = []

  try {
    visitors = await sql`
      SELECT * FROM visitors
      ORDER BY visited_at DESC
      LIMIT 100
    `
  } catch (error) {
    console.error("Error fetching visitors list:", error)
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Visitors</CardTitle>
      </CardHeader>
      <CardContent>
        {visitors.length === 0 ? (
          <div className="flex items-center justify-center h-40 text-muted-foreground">No visitors tracked yet</div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Page</TableHead>
                <TableHead>Location</TableHead>
                <TableHead>IP Address</TableHead>
                <TableHead>Time</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {visitors.map((visitor) => (
                <TableRow key={visitor.id}>
                  <TableCell className="font-medium max-w-xs truncate">{visitor.page_url}</TableCell>
                  <TableCell>
                    {visitor.city}, {visitor.country}
                  </TableCell>
                  <TableCell className="text-muted-foreground">{visitor.ip_address}</TableCell>
                  <TableCell className="text-muted-foreground">
                    {formatDistanceToNow(new Date(visitor.visited_at), { addSuffix: true })}
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
