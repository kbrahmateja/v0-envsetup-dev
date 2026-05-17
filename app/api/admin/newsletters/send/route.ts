import { type NextRequest, NextResponse } from "next/server"
import { sql } from "@/lib/db"

export async function POST(req: NextRequest) {
  try {
    const { newsletterId } = await req.json()

    // Get newsletter
    const newsletters = await sql`
      SELECT * FROM newsletters WHERE id = ${newsletterId}
    `

    if (newsletters.length === 0) {
      return NextResponse.json({ error: "Newsletter not found" }, { status: 404 })
    }

    const newsletter = newsletters[0]

    // Get active subscribers
    const subscribers = await sql`
      SELECT email FROM subscribers WHERE status = 'active'
    `

    if (subscribers.length === 0) {
      return NextResponse.json({ error: "No active subscribers" }, { status: 400 })
    }

    // Send emails using Brevo
    const brevoApiKey = process.env.BREVO_API_KEY

    if (!brevoApiKey) {
      console.error("BREVO_API_KEY not configured")
      return NextResponse.json({ error: "Email service not configured" }, { status: 500 })
    }

    // Send to all subscribers (in production, use a queue for this)
    const sendPromises = subscribers.map(async (subscriber) => {
      try {
        const response = await fetch("https://api.brevo.com/v3/smtp/email", {
          method: "POST",
          headers: {
            "api-key": brevoApiKey,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            sender: { name: "EnvSetup Team", email: "info@envsetup.dev" },
            to: [{ email: subscriber.email }],
            subject: newsletter.subject,
            htmlContent: newsletter.html_content,
          }),
        })

        const status = response.ok ? "sent" : "failed"
        const errorMessage = response.ok ? null : await response.text()

        // Log send status
        await sql`
          INSERT INTO newsletter_sends (newsletter_id, subscriber_email, status, sent_at, error_message)
          VALUES (${newsletterId}, ${subscriber.email}, ${status}, NOW(), ${errorMessage})
        `

        return { email: subscriber.email, status }
      } catch (error) {
        console.error(`Error sending to ${subscriber.email}:`, error)
        await sql`
          INSERT INTO newsletter_sends (newsletter_id, subscriber_email, status, error_message)
          VALUES (${newsletterId}, ${subscriber.email}, 'failed', ${String(error)})
        `
        return { email: subscriber.email, status: "failed" }
      }
    })

    const results = await Promise.all(sendPromises)

    // Update newsletter status
    await sql`
      UPDATE newsletters
      SET status = 'sent', sent_at = NOW()
      WHERE id = ${newsletterId}
    `

    const successful = results.filter((r) => r.status === "sent").length
    const failed = results.filter((r) => r.status === "failed").length

    return NextResponse.json({
      success: true,
      sent: successful,
      failed,
      total: subscribers.length,
    })
  } catch (error) {
    console.error("Error sending newsletter:", error)
    return NextResponse.json({ error: "Failed to send newsletter" }, { status: 500 })
  }
}
