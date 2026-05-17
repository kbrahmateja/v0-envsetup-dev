'use client'

import { useEffect } from 'react'
import { usePathname, useSearchParams } from 'next/navigation'
import { usePlausible } from 'next-plausible'

type PageVisitOptions = {
    eventName?: string;
    customProps?: Record<string, any>;
    trackSearchParams?: boolean;
}

/**
 * Hook to track page visits with Plausible Analytics
 * @param options Configuration options
 * @param options.eventName Custom event name (defaults to 'pageview')
 * @param options.customProps Additional custom properties to track
 * @param options.trackSearchParams Whether to include search parameters in tracking (defaults to false)
 */
export function usePageVisit({
    eventName = 'pageview',
    customProps = {},
    trackSearchParams = false
}: PageVisitOptions = {}) {
    const pathname = usePathname()
    const searchParams = useSearchParams()
    const plausible = usePlausible()

    useEffect(() => {
        // Skip tracking during development if needed
        // if (process.env.NODE_ENV === 'development') return;

        const props = {
            path: pathname,
            ...customProps
        }

        // Include search params if requested
        if (trackSearchParams && searchParams.toString()) {
            props.searchParams = searchParams.toString()
        }

        // Track the page visit
        plausible(eventName, { props })
    }, [pathname, searchParams, eventName, customProps, trackSearchParams, plausible])
}