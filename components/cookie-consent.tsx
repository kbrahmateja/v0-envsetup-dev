"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { getConsent, setConsent, type ConsentValue } from "@/lib/consent"

export function CookieConsent() {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    setVisible(getConsent() === null)
  }, [])

  if (!visible) return null

  const choose = (value: ConsentValue) => {
    setConsent(value)
    setVisible(false)
  }

  return (
    <div className="fixed inset-x-0 bottom-0 z-50 border-t bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80">
      <div className="container mx-auto flex flex-col items-center gap-3 px-4 py-4 sm:flex-row sm:gap-6">
        <p className="flex-1 text-sm text-muted-foreground">
          We use cookies and basic analytics &mdash; page views, approximate location, referrer &mdash; to
          understand how EnvSetup.dev is used. See our{" "}
          <Link href="/privacy" className="underline hover:text-foreground">
            Privacy Policy
          </Link>{" "}
          for details.
        </p>
        <div className="flex flex-shrink-0 gap-2">
          <Button size="sm" variant="outline" onClick={() => choose("declined")}>
            Decline
          </Button>
          <Button size="sm" onClick={() => choose("accepted")}>
            Accept
          </Button>
        </div>
      </div>
    </div>
  )
}
