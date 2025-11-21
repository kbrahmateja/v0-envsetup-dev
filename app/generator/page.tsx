import GeneratorForm from "@/components/generator-form"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Bot, Sparkles } from "lucide-react"

export default function GeneratorPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">Environment Generator</h1>
          <p className="text-xl text-muted-foreground">
            Generate a customized development environment tailored to your needs
          </p>
        </div>

        <Card className="mb-8 bg-gradient-to-r from-primary/10 to-primary/5 border-primary/20">
          <CardContent className="pt-6">
            <div className="flex items-start gap-4">
              <div className="p-3 rounded-lg bg-primary/10">
                <Bot className="h-6 w-6 text-primary" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-lg mb-1">Need help choosing?</h3>
                <p className="text-sm text-muted-foreground mb-3">
                  Not sure which tools and versions to pick? Let our AI assistant guide you through the perfect setup
                  for your project.
                </p>
                <Button asChild size="sm">
                  <Link href="/ai-assistant">
                    <Sparkles className="h-4 w-4 mr-2" />
                    Try AI Assistant
                  </Link>
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        <GeneratorForm />
      </div>
    </div>
  )
}
