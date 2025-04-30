import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowRight, Code, Package, Rocket } from "lucide-react"

export function HeroSection() {
  return (
    <section className="w-full py-12 md:py-24 lg:py-32 xl:py-48">
      <div className="container px-4 md:px-6">
        <div className="grid gap-6 lg:grid-cols-[1fr_400px] lg:gap-12 xl:grid-cols-[1fr_600px]">
          <div className="flex flex-col justify-center space-y-4">
            <div className="space-y-2">
              <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none">
                Generate Development Environments in Seconds
              </h1>
              <p className="max-w-[600px] text-muted-foreground md:text-xl">
                Create customized, ready-to-use development environments for any programming language or
                framework—complete with dependencies, configurations, and deployment pipelines.
              </p>
            </div>
            <div className="flex flex-col gap-2 min-[400px]:flex-row">
              <Button asChild size="lg">
                <Link href="/generator">
                  Get Started
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button variant="outline" size="lg" asChild>
                <Link href="/templates">Explore Templates</Link>
              </Button>
            </div>
            <div className="flex items-center space-x-4 text-sm">
              <div className="flex items-center space-x-1">
                <Package className="h-4 w-4" />
                <span className="text-muted-foreground">20+ Languages</span>
              </div>
              <div className="flex items-center space-x-1">
                <Code className="h-4 w-4" />
                <span className="text-muted-foreground">50+ Frameworks</span>
              </div>
              <div className="flex items-center space-x-1">
                <Rocket className="h-4 w-4" />
                <span className="text-muted-foreground">Multiple Outputs</span>
              </div>
            </div>
          </div>
          <div className="flex items-center justify-center">
            <div className="relative w-full h-[350px] lg:h-[400px] xl:h-[500px] rounded-lg overflow-hidden border bg-muted/50">
              <div className="absolute inset-0 bg-gradient-to-br from-violet-500/20 to-cyan-500/20 dark:from-violet-500/10 dark:to-cyan-500/10" />
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-[80%] h-[80%] bg-background rounded-lg shadow-lg p-4 overflow-hidden">
                  <div className="flex items-center space-x-2 mb-4">
                    <div className="h-3 w-3 rounded-full bg-red-500" />
                    <div className="h-3 w-3 rounded-full bg-yellow-500" />
                    <div className="h-3 w-3 rounded-full bg-green-500" />
                    <div className="ml-2 text-xs text-muted-foreground">Terminal</div>
                  </div>
                  <div className="font-mono text-xs space-y-2 text-muted-foreground">
                    <p>$ envsetup init</p>
                    <p className="text-green-500">✓ Project type: Web Application</p>
                    <p className="text-green-500">✓ Language: JavaScript</p>
                    <p className="text-green-500">✓ Framework: React</p>
                    <p className="text-green-500">✓ Package Manager: npm</p>
                    <p className="text-green-500">✓ Dependencies: tailwindcss, axios, redux</p>
                    <p className="text-green-500">✓ Environment: Docker</p>
                    <p className="animate-pulse">Generating development environment...</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
