"use client"

import { useEffect, useState } from "react"
import Script from "next/script"
import { getConsent, onConsentChange } from "@/lib/consent"
import { GA_TRACKING_ID } from "@/lib/gtag"

// Google Analytics is only injected after the visitor accepts the cookie
// banner (components/cookie-consent.tsx) - see /privacy for what it's used
// for. Declining, or not having answered yet, means gtag.js never loads.
export function AnalyticsScripts() {
  const [enabled, setEnabled] = useState(false)

  useEffect(() => {
    setEnabled(getConsent() === "accepted")
    return onConsentChange((value) => setEnabled(value === "accepted"))
  }, [])

  if (!enabled) return null

  return (
    <>
      <Script src={`https://www.googletagmanager.com/gtag/js?id=${GA_TRACKING_ID}`} strategy="afterInteractive" />
      <Script id="google-analytics" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', '${GA_TRACKING_ID}');
        `}
      </Script>
    </>
  )
}
