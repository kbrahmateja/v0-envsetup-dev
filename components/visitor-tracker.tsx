"use client"

import { useEffect } from "react"
import { usePathname } from "next/navigation"

export function VisitorTracker() {
  const pathname = usePathname()

  useEffect(() => {
    // Track page view
    const trackVisit = async () => {
      try {
        const controller = new AbortController()
        const timeoutId = setTimeout(() => controller.abort(), 5000)

        await fetch("/api/track-visitor", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            page_url: window.location.href,
            referrer: document.referrer,
          }),
          signal: controller.signal,
        })

        clearTimeout(timeoutId)
      } catch (error) {
        if (error instanceof Error && error.name !== "AbortError") {
          console.error("Failed to track visit:", error)
        }
      }
    }

    trackVisit()
  }, [pathname])

  return null
}
