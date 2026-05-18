"use client"

import { useEffect, useState } from "react"
import { X, Sparkles, ExternalLink } from "lucide-react"
import { Button } from "@/components/ui/button"

interface VersionUpdate {
  display_name: string
  language: string
  current_version: string
  latest_version: string
  changelog_url: string
}

export function VersionsBanner() {
  const [updates, setUpdates] = useState<VersionUpdate[]>([])
  const [dismissed, setDismissed] = useState<Set<string>>(new Set())
  const [loaded, setLoaded] = useState(false)

  useEffect(() => {
    // Load dismissed versions from localStorage
    try {
      const saved = JSON.parse(localStorage.getItem("dismissed_versions") ?? "[]")
      setDismissed(new Set(saved))
    } catch {}

    // Fetch new versions
    fetch("/api/versions")
      .then(r => r.json())
      .then(data => {
        setUpdates(data.newVersions ?? [])
        setLoaded(true)
      })
      .catch(() => setLoaded(true))
  }, [])

  const dismiss = (key: string) => {
    const next = new Set([...dismissed, key])
    setDismissed(next)
    localStorage.setItem("dismissed_versions", JSON.stringify([...next]))
  }

  const visible = updates.filter(u => !dismissed.has(`${u.display_name}-${u.latest_version}`))

  if (!loaded || visible.length === 0) return null

  return (
    <div className="w-full bg-gradient-to-r from-blue-600 to-violet-600 text-white">
      <div className="container mx-auto px-4 py-2">
        {visible.slice(0, 3).map((update) => {
          const key = `${update.display_name}-${update.latest_version}`
          return (
            <div key={key} className="flex items-center justify-between gap-4 py-1">
              <div className="flex items-center gap-2 text-sm">
                <Sparkles className="h-4 w-4 shrink-0" />
                <span className="font-medium">{update.display_name} {update.latest_version}</span>
                <span className="opacity-80">is now available!</span>
                <span className="text-xs opacity-60">(was {update.current_version})</span>
                {update.changelog_url && (
                  <a href={update.changelog_url} target="_blank" rel="noopener noreferrer"
                    className="flex items-center gap-1 text-xs underline opacity-80 hover:opacity-100">
                    Changelog <ExternalLink className="h-3 w-3" />
                  </a>
                )}
              </div>
              <Button variant="ghost" size="icon" className="h-5 w-5 text-white hover:bg-white/20"
                onClick={() => dismiss(key)}>
                <X className="h-3 w-3" />
              </Button>
            </div>
          )
        })}
        {visible.length > 3 && (
          <p className="text-xs opacity-70 text-center pb-1">
            +{visible.length - 3} more updates available
          </p>
        )}
      </div>
    </div>
  )
}
