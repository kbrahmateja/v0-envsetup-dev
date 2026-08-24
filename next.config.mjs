/** @type {import('next').NextConfig} */

// Content-Security-Policy: allows what the app actually loads today -
// Google Analytics (gtag.js, only injected after cookie consent), Vercel
// Analytics/Speed Insights (same-origin via Vercel's proxy), and the app's
// own scripts/styles/fonts. 'unsafe-inline' stays in script-src because
// Next.js App Router injects small inline bootstrap/streaming scripts and
// the GA init snippet is inlined via next/script - removing it would need a
// nonce-based setup this environment can't build-test end to end. Every
// other directive is locked down (no plugins, no framing, no arbitrary
// form targets).
const cspDirectives = [
  "default-src 'self'",
  "script-src 'self' 'unsafe-inline' https://www.googletagmanager.com https://va.vercel-scripts.com",
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data: https:",
  "font-src 'self' data:",
  "connect-src 'self' https://www.google-analytics.com https://region1.google-analytics.com https://vitals.vercel-insights.com",
  "frame-src 'none'",
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  "frame-ancestors 'none'",
  "upgrade-insecure-requests",
].join("; ")

const securityHeaders = [
  { key: "Content-Security-Policy", value: cspDirectives },
  { key: "X-Frame-Options", value: "DENY" },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
  { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains; preload" },
]

const nextConfig = {
  images: {
    unoptimized: true,
  },
  async headers() {
    return [
      {
        source: "/:path*",
        headers: securityHeaders,
      },
    ]
  },
}

export default nextConfig
