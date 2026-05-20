import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowRight, Code, Zap, Bot } from "lucide-react"

export default function HeroSection() {
  return (
    <section className="relative py-20 lg:py-32 overflow-hidden">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto text-center">
          <div className="flex justify-center mb-6">
            <div className="flex items-center space-x-2 bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-medium">
              <Zap className="w-4 h-4" />
              <span>Generate environments in seconds</span>
            </div>
          </div>

          <h1 className="text-4xl lg:text-6xl font-bold tracking-tight mb-6">
            Generate Perfect <span className="text-primary">Development Environments</span>
          </h1>

          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Skip the setup hassle. Generate customized, ready-to-use development environments for any programming
            language or framework in seconds.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Button asChild size="lg" className="text-lg px-8">
              <Link href="/ai-assistant">
                <Bot className="mr-2 w-5 h-5" />
                Try AI Assistant
              </Link>
            </Button>

            <Button asChild variant="outline" size="lg" className="text-lg px-8 bg-transparent">
              <Link href="/generator">
                Start Generating
                <ArrowRight className="ml-2 w-5 h-5" />
              </Link>
            </Button>

            <Button asChild variant="outline" size="lg" className="text-lg px-8 bg-transparent">
              <Link href="/templates">
                Browse Templates
                <Code className="ml-2 w-5 h-5" />
              </Link>
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div>
              <div className="text-3xl font-bold text-primary mb-2">322+</div>
              <div className="text-muted-foreground">Templates &amp; Stacks</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-primary mb-2">10k+</div>
              <div className="text-muted-foreground">Environments Generated</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-primary mb-2">5min</div>
              <div className="text-muted-foreground">Average Setup Time Saved</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
