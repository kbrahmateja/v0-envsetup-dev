import { type NextRequest, NextResponse } from "next/server"
import { sql } from "@/lib/db"

export async function GET() {
  try {
    const newsletters = await sql`
      SELECT * FROM newsletters
      ORDER BY created_at DESC
    `

    return NextResponse.json({ newsletters })
  } catch (error) {
    console.error("Error fetching newsletters:", error)
    return NextResponse.json({ error: "Failed to fetch newsletters" }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { title, subject, content, status = "draft" } = body

    // Generate basic HTML from content
    const html_content = `
      <!DOCTYPE html>
      <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px; }
            h1 { color: #2563eb; }
            p { margin-bottom: 15px; }
            .footer { margin-top: 40px; padding-top: 20px; border-top: 1px solid #e5e7eb; font-size: 12px; color: #6b7280; }
          </style>
        </head>
        <body>
          <h1>${subject}</h1>
          ${content
            .split("\n\n")
            .map((p: string) => `<p>${p}</p>`)
            .join("")}
          <div class="footer">
            <p>You're receiving this email because you subscribed to EnvSetup.dev updates.</p>
            <p>© ${new Date().getFullYear()} EnvSetup.dev. All rights reserved.</p>
          </div>
        </body>
      </html>
    `

    const result = await sql`
      INSERT INTO newsletters (title, subject, content, html_content, status, created_at, updated_at)
      VALUES (${title}, ${subject}, ${content}, ${html_content}, ${status}, NOW(), NOW())
      RETURNING id
    `

    return NextResponse.json({ success: true, id: result[0].id })
  } catch (error) {
    console.error("Error creating newsletter:", error)
    return NextResponse.json({ error: "Failed to create newsletter" }, { status: 500 })
  }
}

export async function PUT(req: NextRequest) {
  try {
    const body = await req.json()
    const { id, title, subject, content, status } = body

    const html_content = `
      <!DOCTYPE html>
      <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px; }
            h1 { color: #2563eb; }
            p { margin-bottom: 15px; }
            .footer { margin-top: 40px; padding-top: 20px; border-top: 1px solid #e5e7eb; font-size: 12px; color: #6b7280; }
          </style>
        </head>
        <body>
          <h1>${subject}</h1>
          ${content
            .split("\n\n")
            .map((p: string) => `<p>${p}</p>`)
            .join("")}
          <div class="footer">
            <p>You're receiving this email because you subscribed to EnvSetup.dev updates.</p>
            <p>© ${new Date().getFullYear()} EnvSetup.dev. All rights reserved.</p>
          </div>
        </body>
      </html>
    `

    await sql`
      UPDATE newsletters
      SET title = ${title}, subject = ${subject}, content = ${content}, 
          html_content = ${html_content}, status = ${status}, updated_at = NOW()
      WHERE id = ${id}
    `

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error updating newsletter:", error)
    return NextResponse.json({ error: "Failed to update newsletter" }, { status: 500 })
  }
}
