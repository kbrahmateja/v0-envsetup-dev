import { LandingHeader } from "@/components/landing/landing-header"
import { LandingFooter } from "@/components/landing/landing-footer"
import { PricingSection } from "@/components/pricing-section"

export const metadata = {
  title: "Pricing - EnvSetup.dev",
  description: "Simple, transparent pricing for EnvSetup.dev. Choose the plan that fits your development workflow.",
}

export default function PricingPage() {
  return (
    <div className="min-h-screen bg-background">
      <LandingHeader />
      <main className="container py-12 md:py-24">
        <div className="mx-auto max-w-7xl">
          {/* Header */}
          <div className="text-center mb-12 md:mb-16">
            <h1 className="text-4xl md:text-5xl font-bold mb-4 text-balance">Simple, Transparent Pricing</h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto text-pretty">
              Choose the plan that fits your needs. Start free, upgrade as you grow. All plans include our core features
              with no hidden fees.
            </p>
          </div>

          {/* Pricing Cards */}
          <PricingSection />

          {/* Enterprise Section */}
          <div className="mt-20 text-center">
            <div className="p-8 md:p-12 rounded-2xl bg-gradient-to-br from-primary/10 to-secondary/10 border border-border">
              <h2 className="text-3xl font-bold mb-4">Need a Custom Solution?</h2>
              <p className="text-lg text-muted-foreground mb-6 max-w-2xl mx-auto">
                For large teams and enterprises, we offer custom plans with dedicated support, advanced security
                features, and tailored integrations.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <a
                  href="/contact"
                  className="inline-flex items-center justify-center rounded-lg bg-primary px-8 py-3 text-sm font-semibold text-primary-foreground hover:bg-primary/90 transition-colors"
                >
                  Contact Sales
                </a>
                <a
                  href="mailto:sales@envsetup.dev"
                  className="inline-flex items-center justify-center rounded-lg border border-border bg-background px-8 py-3 text-sm font-semibold hover:bg-muted transition-colors"
                >
                  Email: sales@envsetup.dev
                </a>
              </div>
            </div>
          </div>

          {/* Features Comparison */}
          <div className="mt-20">
            <h2 className="text-3xl font-bold text-center mb-12">Feature Comparison</h2>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left p-4 font-semibold">Features</th>
                    <th className="text-center p-4 font-semibold">Free</th>
                    <th className="text-center p-4 font-semibold">Pro</th>
                    <th className="text-center p-4 font-semibold">Team</th>
                    <th className="text-center p-4 font-semibold">Enterprise</th>
                  </tr>
                </thead>
                <tbody className="text-sm">
                  <tr className="border-b border-border/50">
                    <td className="p-4">Environments per month</td>
                    <td className="text-center p-4 text-muted-foreground">5</td>
                    <td className="text-center p-4 text-primary font-semibold">Unlimited</td>
                    <td className="text-center p-4 text-primary font-semibold">Unlimited</td>
                    <td className="text-center p-4 text-primary font-semibold">Unlimited</td>
                  </tr>
                  <tr className="border-b border-border/50">
                    <td className="p-4">Template library access</td>
                    <td className="text-center p-4 text-muted-foreground">Basic</td>
                    <td className="text-center p-4 text-primary font-semibold">All templates</td>
                    <td className="text-center p-4 text-primary font-semibold">All templates</td>
                    <td className="text-center p-4 text-primary font-semibold">All templates</td>
                  </tr>
                  <tr className="border-b border-border/50">
                    <td className="p-4">Export options</td>
                    <td className="text-center p-4">ZIP download</td>
                    <td className="text-center p-4">ZIP + GitHub</td>
                    <td className="text-center p-4">ZIP + GitHub + GitLab</td>
                    <td className="text-center p-4">All integrations</td>
                  </tr>
                  <tr className="border-b border-border/50">
                    <td className="p-4">Custom templates</td>
                    <td className="text-center p-4">—</td>
                    <td className="text-center p-4">✓</td>
                    <td className="text-center p-4">✓</td>
                    <td className="text-center p-4">✓</td>
                  </tr>
                  <tr className="border-b border-border/50">
                    <td className="p-4">Team collaboration</td>
                    <td className="text-center p-4">—</td>
                    <td className="text-center p-4">Up to 3</td>
                    <td className="text-center p-4">Up to 25</td>
                    <td className="text-center p-4">Unlimited</td>
                  </tr>
                  <tr className="border-b border-border/50">
                    <td className="p-4">Advanced analytics</td>
                    <td className="text-center p-4">—</td>
                    <td className="text-center p-4">—</td>
                    <td className="text-center p-4">✓</td>
                    <td className="text-center p-4">✓</td>
                  </tr>
                  <tr className="border-b border-border/50">
                    <td className="p-4">API access</td>
                    <td className="text-center p-4">—</td>
                    <td className="text-center p-4">Limited</td>
                    <td className="text-center p-4">Full access</td>
                    <td className="text-center p-4">Full access</td>
                  </tr>
                  <tr className="border-b border-border/50">
                    <td className="p-4">SSO integration</td>
                    <td className="text-center p-4">—</td>
                    <td className="text-center p-4">—</td>
                    <td className="text-center p-4">✓</td>
                    <td className="text-center p-4">✓</td>
                  </tr>
                  <tr className="border-b border-border/50">
                    <td className="p-4">Priority support</td>
                    <td className="text-center p-4">—</td>
                    <td className="text-center p-4">Email</td>
                    <td className="text-center p-4">Email + Chat</td>
                    <td className="text-center p-4">Dedicated</td>
                  </tr>
                  <tr className="border-b border-border/50">
                    <td className="p-4">SLA guarantee</td>
                    <td className="text-center p-4">—</td>
                    <td className="text-center p-4">—</td>
                    <td className="text-center p-4">99.9%</td>
                    <td className="text-center p-4">99.99%</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* FAQ Section */}
          <div className="mt-20">
            <h2 className="text-3xl font-bold text-center mb-12">Frequently Asked Questions</h2>
            <div className="max-w-3xl mx-auto space-y-8">
              <div>
                <h3 className="text-xl font-semibold mb-3">Can I change plans anytime?</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Yes, you can upgrade or downgrade your plan at any time from your account settings. Upgrades take
                  effect immediately, while downgrades take effect at the start of your next billing cycle. You won't
                  lose any data when changing plans.
                </p>
              </div>

              <div>
                <h3 className="text-xl font-semibold mb-3">What payment methods do you accept?</h3>
                <p className="text-muted-foreground leading-relaxed">
                  We accept all major credit cards (Visa, Mastercard, American Express, Discover), PayPal, and bank
                  transfers for Enterprise plans. All payments are processed securely through industry-leading payment
                  providers.
                </p>
              </div>

              <div>
                <h3 className="text-xl font-semibold mb-3">Is there a free trial for paid plans?</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Yes! All paid plans include a 14-day free trial with full access to all features. No credit card
                  required to start your trial. You can cancel anytime during the trial period without being charged.
                </p>
              </div>

              <div>
                <h3 className="text-xl font-semibold mb-3">What happens if I exceed my limits on the Free plan?</h3>
                <p className="text-muted-foreground leading-relaxed">
                  If you reach the 5 environment limit on the Free plan, you'll be prompted to upgrade to continue
                  creating environments. Your existing environments remain accessible, and you can upgrade at any time
                  to unlock unlimited access.
                </p>
              </div>

              <div>
                <h3 className="text-xl font-semibold mb-3">Do you offer refunds?</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Yes, we offer a 14-day money-back guarantee on all paid plans. If you're not satisfied for any reason,
                  contact us at refunds@envsetup.dev within 14 days of your purchase for a full refund. See our{" "}
                  <a href="/refund" className="text-primary hover:underline">
                    Refund Policy
                  </a>{" "}
                  for details.
                </p>
              </div>

              <div>
                <h3 className="text-xl font-semibold mb-3">Can I get a discount for annual billing?</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Yes! Annual plans receive a 20% discount compared to monthly billing. You'll save approximately 2
                  months of fees when you choose annual billing. Contact sales@envsetup.dev to set up annual billing.
                </p>
              </div>

              <div>
                <h3 className="text-xl font-semibold mb-3">What kind of support do you offer?</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Free plans include community support through our documentation and forums. Pro plans include email
                  support with 24-hour response times. Team plans add live chat support. Enterprise plans receive
                  dedicated account management and 24/7 priority support.
                </p>
              </div>

              <div>
                <h3 className="text-xl font-semibold mb-3">Are there any setup fees or hidden costs?</h3>
                <p className="text-muted-foreground leading-relaxed">
                  No. The price you see is the price you pay. There are no setup fees, hidden charges, or surprise
                  costs. All features listed in your plan are included in the monthly price. Enterprise plans may have
                  custom pricing based on specific requirements.
                </p>
              </div>
            </div>
          </div>

          {/* Trust Section */}
          <div className="mt-20 text-center">
            <p className="text-sm text-muted-foreground mb-4">Trusted by thousands of developers worldwide</p>
            <p className="text-xs text-muted-foreground">
              Questions?{" "}
              <a href="/contact" className="text-primary hover:underline">
                Contact us
              </a>{" "}
              or read our{" "}
              <a href="/terms" className="text-primary hover:underline">
                Terms & Conditions
              </a>
            </p>
          </div>
        </div>
      </main>
      <LandingFooter />
    </div>
  )
}
