"use client"

import { useEffect } from "react"
import { usePathname } from "next/navigation"
import { getConsent, onConsentChange } from "@/lib/consent"

async function trackVisit() {
  try {
    await fetch("/api/track-visitor", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        page_url: window.location.href,
        referrer: document.referrer,
      }),
    })
  } catch (error) {
    console.error("Failed to track visit:", error)
  }
}

// Only sends a page hit once the visitor has accepted the cookie banner
// (components/cookie-consent.tsx) - see /privacy for what this is used for.
export function VisitorTracker() {
  const pathname = usePathname()

  useEffect(() => {
    if (getConsent() === "accepted") {
      trackVisit()
    }
  }, [pathname])

  useEffect(() => {
    return onConsentChange((value) => {
      if (value === "accepted") trackVisit()
    })
  }, [])

  return null
}
