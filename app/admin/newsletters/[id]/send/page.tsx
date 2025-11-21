import { neon } from "@neondatabase/serverless"
import { redirect } from "next/navigation"
import { SendNewsletterForm } from "@/components/admin/send-newsletter-form"

export default async function SendNewsletterPage({ params }: { params: { id: string } }) {
  const sql = neon(process.env.DATABASE_URL!)

  const newsletters = await sql`
    SELECT * FROM newsletters WHERE id = ${params.id}
  `

  if (newsletters.length === 0) {
    redirect("/admin/newsletters")
  }

  const newsletter = newsletters[0]

  const subscribers = await sql`
    SELECT COUNT(*)::int as count FROM subscribers WHERE status = 'active'
  `

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Send Newsletter</h1>
        <p className="text-muted-foreground">Review and send to {subscribers[0].count} active subscribers</p>
      </div>

      <SendNewsletterForm newsletter={newsletter} subscriberCount={subscribers[0].count} />
    </div>
  )
}
