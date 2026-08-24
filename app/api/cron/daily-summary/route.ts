import { sendDailySummaryEmail } from "@/lib/daily-summary-email"
import { NextResponse } from "next/server"

export async function GET(request: Request) {
  // Verify the request is from Vercel Cron
  const authHeader = request.headers.get("authorization")
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return new NextResponse("Unauthorized", { status: 401 })
  }

  try {
    const { stats } = await sendDailySummaryEmail()
    return NextResponse.json({ success: true, message: "Daily summary sent", stats })
  } catch (error) {
    console.error("Error sending daily summary:", error)
    return NextResponse.json({ error: "Failed to send daily summary" }, { status: 500 })
  }
}
