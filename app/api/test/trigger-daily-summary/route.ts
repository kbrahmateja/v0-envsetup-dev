import { sendDailySummaryEmail } from "@/lib/daily-summary-email"
import { NextResponse } from "next/server"

// Manual test trigger for the daily summary email - lets you check formatting
// and current numbers without waiting for the midnight cron. Gated behind the
// same CRON_SECRET as the real cron endpoint: this sends a real email through
// Brevo on every call, so it can't be left open to anyone who finds the URL.
export async function GET(request: Request) {
  const authHeader = request.headers.get("authorization")
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return new NextResponse("Unauthorized", { status: 401 })
  }

  try {
    console.log("Triggering daily summary email test...")
    const { stats } = await sendDailySummaryEmail({ isTest: true })
    console.log("Test email sent successfully:", stats)

    return NextResponse.json({
      success: true,
      message: "Daily summary test email sent! Check kbrahmateja@gmail.com",
      stats,
    })
  } catch (error) {
    console.error("Error sending daily summary test:", error)
    return NextResponse.json(
      {
        error: "Failed to send daily summary",
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 },
    )
  }
}
