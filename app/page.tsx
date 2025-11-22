import { HeroSection } from "@/components/landing/hero-section"
import { TechStackSection } from "@/components/landing/tech-stack-section"
import { FeaturesSection } from "@/components/landing/features-section"
import { StatsSection } from "@/components/landing/stats-section"
import { TrustedBySection } from "@/components/landing/trusted-by-section"
import { PricingSection } from "@/components/landing/pricing-section"
import { CTASection } from "@/components/landing/cta-section"
import { LandingHeader } from "@/components/landing/landing-header"
import { LandingFooter } from "@/components/landing/landing-footer"

export default function Home() {
  return (
    <div className="min-h-screen bg-background">
      <LandingHeader />
      <main>
        <HeroSection />
        <TrustedBySection />
        <TechStackSection />
        <FeaturesSection />
        <StatsSection />
        <PricingSection />
        <CTASection />
      </main>
      <LandingFooter />
    </div>
  )
}
