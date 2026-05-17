'use client'

import { useEffect } from 'react'
import { usePathname, useSearchParams } from 'next/navigation'
import Script from 'next/script'

/**
 * Component that automatically tracks page visits
 * Includes a direct Plausible script to ensure tracking works
 */
export function SiteVisitTracker() {
    const pathname = usePathname()
    const searchParams = useSearchParams()

    // Track page views directly
    useEffect(() => {
        // Only run if the window object is available and plausible is defined
        if (typeof window !== 'undefined' && window.plausible) {
            // Send pageview event
            window.plausible('pageview')

            // For debugging - check if Plausible is loaded
            console.log('Plausible pageview tracked:', pathname)
        }
    }, [pathname, searchParams])

    return (
        <>
            {/* Add additional tracking script directly */}
            <Script
                id="plausible-tracking-debug"
                strategy="afterInteractive"
                dangerouslySetInnerHTML={{
                    __html: `
            window.addEventListener('load', function() {
              if (window.plausible) {
                console.log('Plausible is available');
              } else {
                console.error('Plausible not loaded');
              }
            });
          `
                }}
            />
        </>
    )
}