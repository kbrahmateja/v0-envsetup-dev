"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Check } from "lucide-react"
import { trackPricingView } from "@/lib/gtag"
import { useEffect } from "react"

const plans = [
  {
    name: "Free",
    price: "$0",
    description: "Perfect for getting started",
    features: [
      "5 environments per month",
      "Basic templates",
      "ZIP download",
      "Community support",
      "Public templates only",
    ],
    popular: false,
    cta: "Get Started",
  },
  {
    name: "Pro",
    price: "$9",
    description: "For professional developers",
    features: [
      "Unlimited environments",
      "All templates & frameworks",
      "GitHub integration",
      "Custom templates",
      "Priority email support",
      "Advanced customization",
    ],
    popular: true,
    cta: "Start Free Trial",
  },
  {
    name: "Team",
    price: "$29",
    description: "For development teams",
    features: [
      "Everything in Pro",
      "Up to 25 team members",
      "Team collaboration tools",
      "Advanced analytics",
      "SSO integration",
      "Priority chat support",
    ],
    popular: false,
    cta: "Start Free Trial",
  },
]

export function PricingSection() {
  useEffect(() => {
    trackPricingView()
  }, [])

  const handlePlanClick = (planName: string) => {
    trackPricingView(planName.toLowerCase())
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
      {plans.map((plan, index) => (
        <Card key={index} className={`relative ${plan.popular ? "border-primary shadow-lg md:scale-105" : ""}`}>
          {plan.popular && <Badge className="absolute -top-3 left-1/2 transform -translate-x-1/2">Most Popular</Badge>}

          <CardHeader className="text-center">
            <CardTitle className="text-2xl">{plan.name}</CardTitle>
            <div className="text-4xl font-bold mt-4">
              {plan.price}
              <span className="text-lg font-normal text-muted-foreground">/month</span>
            </div>
            <CardDescription className="mt-2">{plan.description}</CardDescription>
          </CardHeader>

          <CardContent className="space-y-6">
            <ul className="space-y-3">
              {plan.features.map((feature, i) => (
                <li key={i} className="flex items-start">
                  <Check className="w-5 h-5 text-primary mr-3 flex-shrink-0 mt-0.5" />
                  <span className="text-sm leading-relaxed">{feature}</span>
                </li>
              ))}
            </ul>

            <Button
              className="w-full"
              variant={plan.popular ? "default" : "outline"}
              onClick={() => handlePlanClick(plan.name)}
            >
              {plan.cta}
            </Button>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
