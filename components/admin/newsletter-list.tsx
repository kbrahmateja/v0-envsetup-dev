import { neon } from "@neondatabase/serverless"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Edit, Send } from "lucide-react"
import Link from "next/link"
import { formatDistanceToNow } from "date-fns"

export async function NewsletterList() {
  const sql = neon(process.env.DATABASE_URL!)

  let newsletters: any[] = []

  try {
    newsletters = await sql`
      SELECT 
        n.*,
        COUNT(ns.id) as sent_count
      FROM newsletters n
      LEFT JOIN newsletter_sends ns ON n.id = ns.newsletter_id AND ns.status = 'sent'
      GROUP BY n.id
      ORDER BY n.created_at DESC
    `
  } catch (error) {
    console.error("Error fetching newsletters:", error)
  }

  return (
    <div className="space-y-4">
      {newsletters.map((newsletter) => (
        <Card key={newsletter.id}>
          <CardContent className="p-6">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h3 className="text-lg font-semibold">{newsletter.title}</h3>
                  <Badge
                    variant={
                      newsletter.status === "sent"
                        ? "default"
                        : newsletter.status === "scheduled"
                          ? "secondary"
                          : "outline"
                    }
                  >
                    {newsletter.status}
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground mb-2">{newsletter.subject}</p>
                <div className="flex items-center gap-4 text-xs text-muted-foreground">
                  <span>Created {formatDistanceToNow(new Date(newsletter.created_at), { addSuffix: true })}</span>
                  {newsletter.sent_at && (
                    <span>Sent {formatDistanceToNow(new Date(newsletter.sent_at), { addSuffix: true })}</span>
                  )}
                  <span>{newsletter.sent_count} recipients</span>
                </div>
              </div>

              <div className="flex gap-2">
                <Link href={`/admin/newsletters/${newsletter.id}/edit`}>
                  <Button variant="outline" size="sm">
                    <Edit className="h-4 w-4" />
                  </Button>
                </Link>
                {newsletter.status !== "sent" && (
                  <Link href={`/admin/newsletters/${newsletter.id}/send`}>
                    <Button size="sm">
                      <Send className="h-4 w-4 mr-2" />
                      Send
                    </Button>
                  </Link>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      ))}

      {newsletters.length === 0 && (
        <Card>
          <CardContent className="p-12 text-center">
            <p className="text-muted-foreground mb-4">No newsletters yet</p>
            <Link href="/admin/newsletters/create">
              <Button>Create your first newsletter</Button>
            </Link>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
