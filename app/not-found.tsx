"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { useEffect } from "react"
import { usePlausible } from "next-plausible"
import { underConstructionRoutes } from "@/lib/underConstructionRoutes"

export default function NotFound() {
    const pathname = usePathname()
    const plausible = usePlausible()
    const isUnderConstruction = underConstructionRoutes.includes(pathname || "")

    // Track not-found page visits
    useEffect(() => {
        // Track the not-found event with Plausible
        plausible('not-found', {
            props: {
                path: pathname,
                referrer: document?.referrer || 'direct',
                isUnderConstruction: isUnderConstruction
            }
        })
    }, [pathname, plausible, isUnderConstruction])

    if (isUnderConstruction) {
        return (
            <div className="container py-20 text-center">
                <h1 className="text-4xl font-bold mb-4">🚧 Under Construction 🚧</h1>
                <p className="text-muted-foreground text-lg mb-8">
                    This page is currently being built. Please check back soon!
                </p>
                <Link
                    href="/"
                    className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90"
                >
                    Return to Home
                </Link>
            </div>
        )
    }

    return (
        <div className="container py-20 text-center">
            <h1 className="text-4xl font-bold mb-4">404 - Page Not Found</h1>
            <p className="text-muted-foreground text-lg mb-8">
                The page you are looking for doesn't exist.
            </p>
            <Link
                href="/"
                className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90"
            >
                Return to Home
            </Link>
        </div>
    )
}