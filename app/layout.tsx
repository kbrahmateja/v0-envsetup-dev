import type React from "react"
import type { Metadata } from "next"
import { ThemeProvider } from "@/components/theme-provider"
import { Inter } from "next/font/google"
import "./globals.css"
import { cn } from "@/lib/utils"
import Script from "next/script"
import { Analytics } from "@vercel/analytics/react"
import { PageTracker } from "@/components/analytics/page-tracker"
import { VisitorTracker } from "@/components/visitor-tracker"
import { Suspense } from "react"
import Header from "@/components/header"
import { VersionsBanner } from "@/components/versions-banner"
import Footer from "@/components/footer"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  metadataBase: new URL("https://envsetup.dev"),
  title: {
    default: "EnvSetup.dev — Generate Dev Environments in Seconds",
    template: "%s | EnvSetup.dev",
  },
  description: "Generate production-ready development environments for any language or framework. 322+ templates across 21 languages. Dockerfile, docker-compose, .env — all auto-generated. Free forever.",
  keywords: ["development environment", "docker", "dockerfile", "devcontainer", "next.js", "fastapi", "django", "spring boot", "go", "rust", "dev setup generator"],
  authors: [{ name: "EnvSetup.dev", url: "https://envsetup.dev" }],
  creator: "EnvSetup.dev",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://envsetup.dev",
    siteName: "EnvSetup.dev",
    title: "EnvSetup.dev — Generate Dev Environments in Seconds",
    description: "Production-ready Dockerfiles, docker-compose, and .env files generated for 300+ framework + database combinations.",
    images: [{ url: "/opengraph-image", width: 1200, height: 630, alt: "EnvSetup.dev — Generate Dev Environments in Seconds" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "EnvSetup.dev — Generate Dev Environments in Seconds",
    description: "300+ templates. AI-powered. Dockerized. Free.",
    images: ["/opengraph-image"],
    creator: "@envsetupdev",
  },
  robots: {
    index: true, follow: true,
    googleBot: { index: true, follow: true, "max-video-preview": -1, "max-image-preview": "large", "max-snippet": -1 },
  },
  verification: {
    google: "add-google-search-console-token-here",
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
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
          <Suspense fallback={null}>
            <PageTracker />
          </Suspense>
          <VisitorTracker />
          <div className="flex min-h-screen flex-col">
            <VersionsBanner />
            <Header />
            <main className="flex-1">
              {children}
            </main>
            <Footer />
          </div>
        </ThemeProvider>
        <Analytics />
      </body>
    </html>
  )
}
