"use client"

import { useEffect } from "react"
import { usePathname, useSearchParams } from "next/navigation"
import { pageview } from "@/lib/gtag"
import { getConsent, onConsentChange } from "@/lib/consent"

// Only reports a pageview once the visitor has accepted the cookie banner
// (components/cookie-consent.tsx). pageview() itself is a no-op until
// gtag.js has loaded, which analytics-scripts.tsx also gates on consent.
export function PageTracker() {
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const url = (pathname ?? "") + (searchParams?.toString() ?? "")

  useEffect(() => {
    if (getConsent() === "accepted") pageview(url)
  }, [url])

  useEffect(() => {
    return onConsentChange((value) => {
      if (value === "accepted") pageview(url)
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return null
}
