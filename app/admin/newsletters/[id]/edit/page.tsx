import { neon } from "@neondatabase/serverless"
import { redirect } from "next/navigation"
import { NewsletterForm } from "@/components/admin/newsletter-form"

export const dynamic = "force-dynamic"

export default async function EditNewsletterPage({ params }: { params: { id: string } }) {
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

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Edit Newsletter</h1>
        <p className="text-muted-foreground">Make changes to your newsletter</p>
      </div>

      <NewsletterForm newsletter={newsletter} />
    </div>
  )
}
