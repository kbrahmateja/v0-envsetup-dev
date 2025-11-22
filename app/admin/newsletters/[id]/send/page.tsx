import { neon } from "@neondatabase/serverless"
import { redirect } from "next/navigation"
import { SendNewsletterForm } from "@/components/admin/send-newsletter-form"

export const dynamic = "force-dynamic"

export default async function SendNewsletterPage({ params }: { params: { id: string } }) {
  const sql = neon(process.env.DATABASE_URL!)

  let newsletters
  try {
    newsletters = await sql`
      SELECT * FROM newsletters WHERE id = ${params.id}
    `
  } catch (error) {
    console.error("Error fetching newsletter:", error)
    redirect("/admin/newsletters")
  }

  if (newsletters.length === 0) {
    redirect("/admin/newsletters")
  }

  const newsletter = newsletters[0]

  let subscribers
  try {
    subscribers = await sql`
      SELECT id, email, subscribed_at FROM subscribers WHERE status = 'active'
      ORDER BY subscribed_at DESC
    `
  } catch (error) {
    console.error("Error fetching subscribers:", error)
    subscribers = []
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Send Newsletter</h1>
        <p className="text-muted-foreground">Select recipients and send your newsletter</p>
      </div>

      <SendNewsletterForm newsletter={newsletter} subscribers={subscribers} />
    </div>
  )
}
