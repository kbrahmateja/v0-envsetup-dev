"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Check } from "lucide-react"
import { trackPricingView } from "@/lib/gtag"
import { useEffect } from "react"
import { useRouter } from "next/navigation"

const plans = [
  {
    name: "Free",
    price: "$0",
    description: "Perfect for getting started",
    features: ["Unlimited environments", "Basic templates", "ZIP download", "Community support"],
    popular: false,
  },
  {
    name: "Pro",
    price: "$9",
    description: "For professional developers",
    features: [
      "Unlimited environments",
      "All templates",
      "GitHub integration",
      "Priority support",
      "Custom templates",
      "Team collaboration",
    ],
    popular: true,
  },
  {
    name: "Team",
    price: "$29",
    description: "For development teams",
    features: [
      "Everything in Pro",
      "Team management",
      "Advanced analytics",
      "Custom branding",
      "SSO integration",
      "Dedicated support",
    ],
    popular: false,
  },
]

export default function PricingPage() {
  useEffect(() => {
    trackPricingView()
  }, [])

  const router = useRouter()

  const handlePlanClick = (planName: string) => {
    trackPricingView(planName.toLowerCase())
    if (planName === "Free") {
      router.push("/generator")
    } else {
      router.push(`/waitlist?plan=${planName.toLowerCase()}`)
    }
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold mb-4">Free — Always</h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            EnvSetup.dev is completely free to use. Pro and Team plans are coming soon.
          </p>
        </div>

        <div className="flex justify-center">
          {plans.filter(p => p.name === "Free").map((plan, index) => (
          <div key={index} className="w-full max-w-md">
            <Card key={index} className={`relative ${plan.popular ? "border-primary shadow-lg scale-105" : ""}`}>
              {plan.popular && (
                <Badge className="absolute -top-3 left-1/2 transform -translate-x-1/2">Most Popular</Badge>
              )}

              <CardHeader className="text-center">
                <CardTitle className="text-2xl">{plan.name}</CardTitle>
                <div className="text-4xl font-bold">
                  {plan.price}
                  <span className="text-lg font-normal text-muted-foreground"> forever</span>
                </div>
                <CardDescription>{plan.description}</CardDescription>
              </CardHeader>

              <CardContent className="space-y-6">
                <ul className="space-y-3">
                  {plan.features.map((feature, i) => (
                    <li key={i} className="flex items-center">
                      <Check className="w-5 h-5 text-primary mr-3 flex-shrink-0" />
                      <span className="text-sm">{feature}</span>
                    </li>
                  ))}
                </ul>

                <Button
                  className="w-full"
                  variant={plan.popular ? "default" : "outline"}
                  onClick={() => handlePlanClick(plan.name)}
                >
                  {plan.name === "Free" ? "Get Started" : "Start Free Trial"}
                </Button>
              </CardContent>
            </Card>
          </div>
          ))}
        </div>

        {/* Coming soon */}
        <div className="mt-12 p-6 border border-dashed rounded-xl text-center max-w-2xl mx-auto">
          <p className="text-sm font-medium text-muted-foreground mb-1">🚀 Pro & Team plans — coming soon</p>
          <p className="text-sm text-muted-foreground mb-4">Unlimited environments, GitHub integration, team features, priority support.</p>
          <a href="/waitlist" className="text-sm text-primary hover:underline font-medium">Join the waitlist → get 3 months free when we launch</a>
        </div>

        <div className="text-center mt-16">
          <h2 className="text-2xl font-bold mb-4">Frequently Asked Questions</h2>
          <div className="max-w-3xl mx-auto space-y-6">
            <div className="text-left">
              <h3 className="font-semibold mb-2">Is there a limit on how many environments I can generate?</h3>
              <p className="text-muted-foreground">
                No. The Free plan is unlimited &mdash; generate as many environments as you need, with no caps or
                sign-up required.
              </p>
            </div>

            <div className="text-left">
              <h3 className="font-semibold mb-2">When will Pro and Team plans launch?</h3>
              <p className="text-muted-foreground">
                We&apos;re still building them out. Join the waitlist above and we&apos;ll email you as soon as
                they&apos;re available, along with your early-access discount.
              </p>
            </div>

            <div className="text-left">
              <h3 className="font-semibold mb-2">Do you offer refunds?</h3>
              <p className="text-muted-foreground">
                There are no paid plans yet, so there&apos;s nothing to refund. Once Pro and Team launch, we&apos;ll
                publish a clear refund policy here.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
