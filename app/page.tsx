import HeroSection from "@/components/hero-section"
import FeaturesSection from "@/components/features-section"
import { UseCasesSection } from "@/components/use-cases-section"
import { CTASection } from "@/components/cta-section"

// Nothing in this route (or the root layout) uses cookies()/headers()/a
// dynamic fetch, so without this Next.js prerenders the homepage once at
// BUILD time and serves that static HTML to everyone until the next deploy.
// That would silently turn the real "Environments Generated" count in
// HeroSection back into a frozen number that only updates on a redeploy -
// the same flavor of stale/misleading number this fix was meant to remove.
// Revalidate every 60s so it actually reflects real usage without hitting
// the DB on every single page view.
export const revalidate = 60

// SoftwareApplication structured data for SEO rich results. Deliberately
// leaves out aggregateRating/review fields - there's no real review data
// behind this app, and a fabricated rating would be exactly the kind of
// made-up number the rest of this launch-readiness pass has been removing.
const jsonLd = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  name: "EnvSetup.dev",
  url: "https://envsetup.dev",
  applicationCategory: "DeveloperApplication",
  operatingSystem: "Web",
  description:
    "Generate production-ready development environments for any language or framework. 322+ templates and stacks. Dockerfile, docker-compose, and .env files auto-generated. Free forever.",
  offers: {
    "@type": "Offer",
    price: "0",
    priceCurrency: "USD",
  },
}

export default function Home() {
  return (
    <div className="flex flex-col items-center">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <HeroSection />
      <FeaturesSection />
      <UseCasesSection />
      <CTASection />
    </div>
  )
}
