import { NextResponse } from "next/server"
import { sql } from "@/lib/db"
import { escapeHtml } from "@/lib/html-escape"

const ADMIN_EMAIL = "kbrahmateja@gmail.com"
const MAX_MESSAGE_LENGTH = 5000

export function validateSuggestion(body: { message?: unknown; email?: unknown }) {
  const message = typeof body.message === "string" ? body.message.trim() : ""
  const email = typeof body.email === "string" ? body.email.trim() : ""

  if (!message) {
    return { valid: false as const, error: "Suggestion message is required" }
  }

  if (message.length > MAX_MESSAGE_LENGTH) {
    return { valid: false as const, error: `Suggestion message must be under ${MAX_MESSAGE_LENGTH} characters` }
  }

  if (email && !email.includes("@")) {
    return { valid: false as const, error: "Invalid email address" }
  }

  return { valid: true as const, message, email: email || null }
}

export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => ({}))
    const result = validateSuggestion(body)

    if (!result.valid) {
      return NextResponse.json({ error: result.error }, { status: 400 })
    }

    const { message, email } = result
    const pageUrl = typeof body.pageUrl === "string" ? body.pageUrl.slice(0, 500) : null
    const timestamp = new Date().toISOString()

    try {
      await sql`
        INSERT INTO suggestions (message, email, page_url, submitted_at, status)
        VALUES (${message}, ${email}, ${pageUrl}, NOW(), 'new')
      `
    } catch (dbError) {
      // Don't block the user's feedback on a DB hiccup -- still try to email it.
      console.error("Failed to store suggestion in DB:", dbError instanceof Error ? dbError.message : dbError)
    }

    const brevoApiKey = process.env.BREVO_API_KEY

    if (brevoApiKey) {
      try {
        const notifyResponse = await fetch("https://api.brevo.com/v3/smtp/email", {
          method: "POST",
          headers: {
            accept: "application/json",
            "api-key": brevoApiKey,
            "content-type": "application/json",
          },
          body: JSON.stringify({
            sender: {
              name: "EnvSetup Feedback",
              email: "info@envsetup.dev",
            },
            to: [{ email: ADMIN_EMAIL, name: "Admin" }],
            subject: "💡 New Suggestion - EnvSetup.dev",
            htmlContent: `
              <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background: #ffffff;">
                <div style="text-align: center; margin-bottom: 30px;">
                  <h1 style="color: #3b82f6; font-size: 28px; margin: 0;">EnvSetup.dev</h1>
                  <p style="color: #6b7280; font-size: 14px; margin: 5px 0;">New Suggestion Received</p>
                </div>
                <div style="background: #f9fafb; padding: 25px; border-radius: 12px; margin: 25px 0;">
                  <p style="margin: 0 0 15px 0; color: #374151; font-weight: 600;">Message:</p>
                  <div style="background: white; padding: 15px; border-radius: 8px; border: 2px solid #e5e7eb; white-space: pre-wrap;">${escapeHtml(message)}</div>
                  <p style="margin: 15px 0 0 0;"><strong style="color: #6b7280;">From:</strong> <span style="color: #1f2937;">${email ? escapeHtml(email) : "(anonymous)"}</span></p>
                  <p style="margin: 5px 0 0 0;"><strong style="color: #6b7280;">Page:</strong> <span style="color: #1f2937;">${pageUrl ? escapeHtml(pageUrl) : "unknown"}</span></p>
                  <p style="margin: 5px 0 0 0;"><strong style="color: #6b7280;">Timestamp:</strong> <span style="color: #1f2937;">${timestamp}</span></p>
                </div>
              </div>
            `,
          }),
        })

        if (!notifyResponse.ok) {
          const errText = await notifyResponse.text()
          console.error("Suggestion email failed:", notifyResponse.status, errText)
        }
      } catch (emailError) {
        console.error("Suggestion email error:", emailError)
      }
    }

    return NextResponse.json({ success: true, message: "Thanks for the suggestion!" })
  } catch (error) {
    console.error("Suggestion submission error:", error)
    return NextResponse.json({ error: "Failed to submit suggestion" }, { status: 500 })
  }
}
