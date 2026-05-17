'use client'

import { PlausibleProvider } from 'next-plausible'

export function PlausibleAnalyticsProvider({ children }: { children: React.ReactNode }) {
    return (
        <PlausibleProvider domain="envsetup.dev" trackOutboundLinks={true} trackFileDownloads={true}>
            {children}
        </PlausibleProvider>
    )
}