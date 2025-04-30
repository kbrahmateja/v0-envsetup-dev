import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Check } from "lucide-react"
import Link from "next/link"

export default function PricingPage() {
  const plans = [
    {
      name: "Free",
      description: "For individuals and small projects",
      price: "$0",
      period: "forever",
      features: [
        "Basic templates",
        "Docker environments",
        "Local setup scripts",
        "5 environments per month",
        "Community support",
      ],
      limitations: ["No custom templates", "No team sharing", "No cloud-hosted devboxes", "No priority support"],
      cta: "Get Started",
      popular: false,
    },
    {
      name: "Pro",
      description: "For professional developers",
      price: "$9",
      period: "per month",
      features: [
        "All Free features",
        "Unlimited environments",
        "Custom templates",
        "VS Code Dev Containers",
        "GitPod integration",
        "CI/CD pipeline generation",
        "Email support",
      ],
      limitations: ["Limited team sharing", "Basic cloud-hosted devboxes"],
      cta: "Start Free Trial",
      popular: true,
    },
    {
      name: "Team",
      description: "For teams and organizations",
      price: "$29",
      period: "per user/month",
      features: [
        "All Pro features",
        "Team template library",
        "Shared environments",
        "Advanced cloud-hosted devboxes",
        "Custom domain for devboxes",
        "SSO authentication",
        "Priority support",
        "Dedicated account manager",
      ],
      limitations: [],
      cta: "Contact Sales",
      popular: false,
    },
  ]

  return (
    <div className="container py-10">
      <div className="mb-12 text-center">
        <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">Simple, Transparent Pricing</h1>
        <p className="mt-4 text-muted-foreground md:text-xl">Choose the plan that's right for you or your team.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {plans.map((plan, index) => (
          <Card
            key={index}
            className={`flex flex-col h-full ${plan.popular ? "border-primary shadow-md relative" : ""}`}
          >
            {plan.popular && (
              <div className="absolute top-0 right-0 transform translate-x-2 -translate-y-2">
                <span className="bg-primary text-primary-foreground text-xs font-medium px-2 py-1 rounded-md">
                  Most Popular
                </span>
              </div>
            )}
            <CardHeader>
              <CardTitle>{plan.name}</CardTitle>
              <CardDescription>{plan.description}</CardDescription>
              <div className="mt-4">
                <span className="text-4xl font-bold">{plan.price}</span>
                <span className="text-muted-foreground ml-2">{plan.period}</span>
              </div>
            </CardHeader>
            <CardContent className="flex-grow">
              <div className="space-y-4">
                <h4 className="text-sm font-medium">What's included:</h4>
                <ul className="space-y-2">
                  {plan.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-center">
                      <Check className="h-4 w-4 text-green-500 mr-2" />
                      <span className="text-sm">{feature}</span>
                    </li>
                  ))}
                </ul>
                {plan.limitations.length > 0 && (
                  <>
                    <h4 className="text-sm font-medium mt-4">Limitations:</h4>
                    <ul className="space-y-2">
                      {plan.limitations.map((limitation, limitationIndex) => (
                        <li key={limitationIndex} className="flex items-center text-muted-foreground">
                          <span className="text-sm">{limitation}</span>
                        </li>
                      ))}
                    </ul>
                  </>
                )}
              </div>
            </CardContent>
            <CardFooter>
              <Button asChild className="w-full" variant={plan.popular ? "default" : "outline"}>
                <Link href={plan.name === "Team" ? "/contact" : "/signup"}>{plan.cta}</Link>
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>

      <div className="mt-16 text-center">
        <h2 className="text-2xl font-bold mb-4">Need a custom plan?</h2>
        <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
          We offer custom plans for enterprises with specific requirements. Contact our sales team to discuss your
          needs.
        </p>
        <Button asChild size="lg" variant="outline">
          <Link href="/contact">Contact Sales</Link>
        </Button>
      </div>
    </div>
  )
}
