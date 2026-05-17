"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { useEffect } from "react"
import { underConstructionRoutes } from "@/lib/underConstructionRoutes"

export default function NotFound() {
  const pathname = usePathname()
  const isUnderConstruction = underConstructionRoutes.includes(pathname || "")

  useEffect(() => {
    if (typeof window !== "undefined" && window.plausible) {
      window.plausible("not-found", {
        props: { path: pathname ?? "", isUnderConstruction: String(isUnderConstruction) },
      })
    }
  }, [pathname, isUnderConstruction])

  if (isUnderConstruction) {
    return (
      <div className="container py-20 text-center">
        <h1 className="text-4xl font-bold mb-4">🚧 Under Construction 🚧</h1>
        <p className="text-muted-foreground text-lg mb-8">This page is currently being built. Check back soon!</p>
        <Link href="/" className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90">
          Return to Home
        </Link>
      </div>
    )
  }

  return (
    <div className="container py-20 text-center">
      <h1 className="text-4xl font-bold mb-4">404 - Page Not Found</h1>
      <p className="text-muted-foreground text-lg mb-8">The page you are looking for does not exist.</p>
      <Link href="/" className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90">
        Return to Home
      </Link>
    </div>
  )
}
