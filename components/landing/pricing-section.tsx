import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Check } from "lucide-react"
import Link from "next/link"

export function PricingSection() {
  const plans = [
    {
      name: "Free",
      price: "$0",
      description: "Perfect for trying out Envsetup.dev",
      features: [
        "5 environments per month",
        "Basic tech stack detection",
        "Local development setup",
        "Community support",
      ],
    },
    {
      name: "Pro",
      price: "$29",
      description: "For professional developers",
      features: [
        "Unlimited environments",
        "Advanced AI detection",
        "Full infrastructure generation",
        "CI/CD pipeline automation",
        "Priority support",
        "Custom templates",
      ],
      popular: true,
    },
    {
      name: "Enterprise",
      price: "Custom",
      description: "For teams and organizations",
      features: [
        "Everything in Pro",
        "Team collaboration",
        "Custom integrations",
        "Dedicated support",
        "SLA guarantees",
        "On-premise deployment",
      ],
    },
  ]

  return (
    <section id="pricing" className="py-20 md:py-32 bg-muted/30">
      <div className="container">
        <div className="mx-auto max-w-3xl text-center mb-16">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl mb-4">
            Simple, Transparent Pricing
          </h2>
          <p className="text-lg text-muted-foreground">Start free, upgrade as you grow. No hidden fees.</p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {plans.map((plan, i) => (
            <Card key={i} className={`p-6 ${plan.popular ? "border-primary shadow-lg scale-105" : ""}`}>
              {plan.popular && (
                <div className="bg-primary text-primary-foreground text-xs font-semibold px-3 py-1 rounded-full inline-block mb-4">
                  Most Popular
                </div>
              )}
              <h3 className="text-2xl font-bold mb-2">{plan.name}</h3>
              <div className="text-4xl font-bold mb-2">
                {plan.price}
                {plan.price !== "Custom" && <span className="text-lg font-normal text-muted-foreground">/month</span>}
              </div>
              <p className="text-sm text-muted-foreground mb-6">{plan.description}</p>
              <Button className="w-full mb-6" variant={plan.popular ? "default" : "outline"} asChild>
                <Link href="/generator">{plan.price === "Custom" ? "Contact Sales" : "Get Started"}</Link>
              </Button>
              <ul className="space-y-3">
                {plan.features.map((feature, j) => (
                  <li key={j} className="flex items-start gap-2 text-sm">
                    <Check className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
