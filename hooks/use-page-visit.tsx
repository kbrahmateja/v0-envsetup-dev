"use client"

import { useEffect } from "react"
import { usePathname } from "next/navigation"

export function usePageVisit() {
  const pathname = usePathname()

  useEffect(() => {
    if (typeof window !== "undefined" && window.plausible) {
      window.plausible("pageview", { props: { path: pathname } })
    }
  }, [pathname])
}
