import { type NextRequest, NextResponse } from "next/server"
import { verifySessionToken } from "@/lib/auth"

export async function GET(request: NextRequest) {
  const session = request.cookies.get("admin_session")?.value
  const authenticated = await verifySessionToken(session)

  return NextResponse.json({ authenticated })
}
