import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"
import Link from "next/link"

export function CTASection() {
  return (
    <section className="py-20 md:py-32">
      <div className="container">
        <div className="mx-auto max-w-3xl text-center space-y-8 rounded-2xl bg-gradient-to-br from-primary/10 to-secondary/10 p-12 border border-primary/20">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl">
            Ready to Experience the Future of Environment Setup?
          </h2>
          <p className="text-lg text-muted-foreground">
            Join thousands of developers who are shipping faster with Envsetup.dev. Configure nothing, ship everything.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button size="lg" className="text-base h-12 px-8" asChild>
              <Link href="/generator">
                Start for Free <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" className="text-base h-12 px-8 bg-transparent" asChild>
              <Link href="#features">View Documentation</Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
}
