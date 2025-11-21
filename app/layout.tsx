import type React from "react"
import { ThemeProvider } from "@/components/theme-provider"
import { Inter } from "next/font/google"
import "./globals.css"
import { cn } from "@/lib/utils"
import Script from "next/script"
import { PageTracker } from "@/components/analytics/page-tracker"
import { VisitorTracker } from "@/components/visitor-tracker"

const inter = Inter({ subsets: ["latin"] })

export const metadata = {
  title: "EnvSetup.dev - Generate Development Environments",
  description: "Generate customized, ready-to-use development environments for any programming language or framework.",
    generator: 'v0.app'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* Google tag (gtag.js) */}
        <Script src="https://www.googletagmanager.com/gtag/js?id=G-XZEY5749RC" strategy="afterInteractive" />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-XZEY5749RC');
          `}
        </Script>
      </head>
      <body className={cn("min-h-screen bg-background font-sans antialiased", inter.className)}>
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false} disableTransitionOnChange>
          <PageTracker />
          <VisitorTracker />
          {children}
        </ThemeProvider>
      </body>
    </html>
  )
}
