"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ExternalLink } from "lucide-react"
import { AFFILIATE_LINKS, getAffiliateUrl } from "@/lib/affiliate-links"

function trackClick(platform: string) {
  try {
    // keepalive lets this fetch survive the page navigating away right
    // after the click - and we never preventDefault or await it, so the
    // real link click is never delayed by tracking.
    fetch("/api/track-affiliate-click", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ platform, pageUrl: window.location.href }),
      keepalive: true,
    }).catch(() => {})
  } catch {
    // Tracking must never block or break the actual navigation.
  }
}

export function AffiliateLinksCard() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Deploy This Environment</CardTitle>
        <CardDescription>Take your Dockerfile straight to a host</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {AFFILIATE_LINKS.map((link) => (
            <a
              key={link.id}
              href={getAffiliateUrl(link)}
              target="_blank"
              rel="sponsored noopener noreferrer"
              onClick={() => trackClick(link.id)}
              className="flex flex-col gap-1 rounded-lg border p-3 hover:bg-muted/50 transition-colors"
            >
              <span className="flex items-center gap-1.5 font-medium text-sm">
                {link.name}
                <ExternalLink className="h-3 w-3 text-muted-foreground" />
              </span>
              <span className="text-xs text-muted-foreground">{link.blurb}</span>
            </a>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
