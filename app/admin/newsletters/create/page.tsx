import { NewsletterForm } from "@/components/admin/newsletter-form"

export default function CreateNewsletterPage() {
  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Create Newsletter</h1>
        <p className="text-muted-foreground">Create a new newsletter to send to subscribers</p>
      </div>

      <NewsletterForm />
    </div>
  )
}
