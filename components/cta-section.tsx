import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"

export default function CTASection() {
  return (
    <section className="py-20 bg-primary text-primary-foreground">
      <div className="container mx-auto px-4 text-center">
        <h2 className="text-3xl lg:text-4xl font-bold mb-4">Ready to Skip the Setup?</h2>
        <p className="text-xl opacity-90 mb-8 max-w-2xl mx-auto">
          Join thousands of developers who save hours every week with EnvSetup.dev. Generate your first environment in
          under 30 seconds.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button asChild size="lg" variant="secondary" className="text-lg px-8">
            <Link href="/generator">
              Start Generating Now
              <ArrowRight className="ml-2 w-5 h-5" />
            </Link>
          </Button>

          <Button
            asChild
            size="lg"
            variant="outline"
            className="text-lg px-8 border-primary-foreground text-primary-foreground hover:bg-primary-foreground hover:text-primary bg-transparent"
          >
            <Link href="/pricing">View Pricing</Link>
          </Button>
        </div>

        <p className="text-sm opacity-75 mt-6">No credit card required • Free tier available • Cancel anytime</p>
      </div>
    </section>
  )
}
