'use client'

import { useEffect } from 'react'
import { usePathname, useSearchParams } from 'next/navigation'

export function PageTracker() {
    const pathname = usePathname()
    const searchParams = useSearchParams()

    useEffect(() => {
        // Function to handle page view tracking
        const handlePageView = () => {
            // Make sure plausible is available
            if (typeof window !== 'undefined' && typeof window.plausible === 'function') {
                // Track the page view
                window.plausible('pageview', {
                    props: {
                        path: pathname ?? "",
                        search: searchParams?.toString() ?? "",
                        timestamp: new Date().toISOString()
                    }
                })

                console.log('[Plausible] Tracked pageview:', pathname)
            } else {
                console.error('[Plausible] Failed to track pageview - plausible not available')

                // Set up a retry mechanism
                setTimeout(() => {
                    if (typeof window !== 'undefined' && typeof window.plausible === 'function') {
                        window.plausible('pageview', {
                            props: {
                                path: pathname ?? "",
                                search: searchParams?.toString() ?? "",
                                timestamp: new Date().toISOString(),
                                retried: 'true'
                            }
                        })
                        console.log('[Plausible] Retried tracking pageview:', pathname)
                    }
                }, 2000) // Retry after 2 seconds
            }
        }

        // Call the tracking function
        handlePageView()

        // Also track via direct script tag for maximum reliability
        const script = document.createElement('script')
        script.async = true
        script.defer = true
        script.setAttribute('data-domain', 'envsetup.dev')
        script.src = 'https://plausible.io/js/script.outbound-links.js'
        document.head.appendChild(script)

        return () => {
            // Clean up script if component unmounts
            if (script.parentNode) {
                script.parentNode.removeChild(script)
            }
        }
    }, [pathname, searchParams])

    return null // This component doesn't render anything
}