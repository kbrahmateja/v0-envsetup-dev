"use client"

import { useEffect } from "react"
import { usePathname } from "next/navigation"

export function VisitorTracker() {
  const pathname = usePathname()

  useEffect(() => {
    // Track page view
    const trackVisit = async () => {
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

    trackVisit()
  }, [pathname])

  return null
}
