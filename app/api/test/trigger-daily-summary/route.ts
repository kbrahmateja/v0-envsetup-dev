import { sql } from "@/lib/db"
import { NextResponse } from "next/server"

export async function GET() {
  try {
    console.log("Triggering daily summary email test...")

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

    console.log("Stats retrieved:", {
      newSubscribers: subscribers.count,
      totalVisitors: visitors.count,
    })

    // Send email summary using Brevo
    const emailPayload = {
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
      subject: `Daily Summary Test - ${new Date().toLocaleDateString()}`,
      htmlContent: `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; border-radius: 8px 8px 0 0; }
            .content { background: #f9fafb; padding: 30px; border-radius: 0 0 8px 8px; }
            .stat-card { background: white; padding: 20px; margin: 10px 0; border-radius: 8px; box-shadow: 0 1px 3px rgba(0,0,0,0.1); }
            .stat-number { font-size: 32px; font-weight: bold; color: #667eea; }
            .button { display: inline-block; background: #667eea; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; margin-top: 20px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1 style="margin:0;">EnvSetup.dev Daily Summary</h1>
              <p style="margin:10px 0 0 0; opacity: 0.9;">Test Email - ${new Date().toLocaleDateString()}</p>
            </div>
            <div class="content">
              <div class="stat-card">
                <h3 style="margin-top:0;">📧 New Subscribers</h3>
                <div class="stat-number">${subscribers.count}</div>
                <p style="color:#666; margin-bottom:0;">subscribers joined today</p>
              </div>
              
              <div class="stat-card">
                <h3 style="margin-top:0;">👥 Total Visitors</h3>
                <div class="stat-number">${visitors.count}</div>
                <p style="color:#666; margin-bottom:0;">visitors today</p>
              </div>

              <p style="margin-top: 30px;">
                <a href="https://envsetup.dev/admin" class="button">View Admin Dashboard</a>
              </p>

              <p style="color:#666; font-size: 12px; margin-top: 30px; border-top: 1px solid #ddd; padding-top: 20px;">
                This is a test email from your daily summary automation. The actual automated email will be sent daily at midnight UTC by your cron service.
              </p>
            </div>
          </div>
        </body>
        </html>
      `,
    }

    console.log("Sending email via Brevo...")

    const brevoResponse = await fetch("https://api.brevo.com/v3/smtp/email", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        "api-key": process.env.BREVO_API_KEY!,
      },
      body: JSON.stringify(emailPayload),
    })

    const brevoData = await brevoResponse.json()

    if (!brevoResponse.ok) {
      console.error("Brevo API error:", brevoData)
      throw new Error(brevoData.message || "Failed to send email")
    }

    console.log("Email sent successfully:", brevoData)

    return NextResponse.json({
      success: true,
      message: "Daily summary email sent successfully! Check kbrahmateja@gmail.com",
      stats: {
        newSubscribers: subscribers.count,
        totalVisitors: visitors.count,
      },
      emailId: brevoData.messageId,
    })
  } catch (error: any) {
    console.error("Error sending daily summary:", error)
    return NextResponse.json(
      {
        error: "Failed to send daily summary",
        details: error.message,
      },
      { status: 500 },
    )
  }
}
