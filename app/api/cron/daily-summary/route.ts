import { neon } from "@neondatabase/serverless"
import { NextResponse } from "next/server"

const sql = neon(process.env.DATABASE_URL!)

export async function GET(request: Request) {
  // Verify the request is from Vercel Cron
  const authHeader = request.headers.get("authorization")
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return new NextResponse("Unauthorized", { status: 401 })
  }

  try {
    // Get today's stats
    const [subscribers] = await sql`
      SELECT COUNT(*) as count 
      FROM subscribers 
      WHERE DATE(subscribed_at) = CURRENT_DATE
    `

    const [visitors] = await sql`
      SELECT COUNT(*) as count 
      FROM visitors 
      WHERE DATE(visited_at) = CURRENT_DATE
    `

    // Send email summary using Brevo
    const brevoResponse = await fetch("https://api.brevo.com/v3/smtp/email", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        "api-key": process.env.BREVO_API_KEY!,
      },
      body: JSON.stringify({
        sender: {
          name: "EnvSetup Daily Report",
          email: "info@envsetup.dev",
        },
        to: [
          {
            email: "kbrahmateja@gmail.com",
            name: "Admin",
          },
        ],
        subject: `Daily Summary - ${new Date().toLocaleDateString()}`,
        htmlContent: `
          <h2>EnvSetup.dev Daily Summary</h2>
          <p><strong>Date:</strong> ${new Date().toLocaleDateString()}</p>
          <ul>
            <li><strong>New Subscribers:</strong> ${subscribers.count}</li>
            <li><strong>Total Visitors:</strong> ${visitors.count}</li>
          </ul>
          <p>View full analytics at <a href="https://envsetup.dev/admin">Admin Dashboard</a></p>
        `,
      }),
    })

    if (!brevoResponse.ok) {
      throw new Error("Failed to send email")
    }

    return NextResponse.json({
      success: true,
      message: "Daily summary sent",
      stats: {
        newSubscribers: subscribers.count,
        totalVisitors: visitors.count,
      },
    })
  } catch (error) {
    console.error("Error sending daily summary:", error)
    return NextResponse.json({ error: "Failed to send daily summary" }, { status: 500 })
  }
}
