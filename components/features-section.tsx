import { Box, Code, Cpu, FileCode, GitBranch, Package } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export function FeaturesSection() {
  const features = [
    {
      icon: <FileCode className="h-10 w-10 text-violet-500" />,
      title: "Smart Stack Generator",
      description:
        "Select your programming language, framework, package manager, and dependencies to generate a custom development environment.",
    },
    {
      icon: <Box className="h-10 w-10 text-cyan-500" />,
      title: "Environment Packaging",
      description:
        "Get your environment as Docker, VS Code Dev Container, GitPod, local setup script, or cloud-hosted devbox.",
    },
    {
      icon: <Package className="h-10 w-10 text-emerald-500" />,
      title: "Presets & Templates",
      description: "Choose from popular pre-built stacks like MERN, LAMP, T3, or create and share your own templates.",
    },
    {
      icon: <GitBranch className="h-10 w-10 text-amber-500" />,
      title: "DevOps Integration",
      description: "Add CI/CD pipelines, deployment targets, and testing setups to your development environment.",
    },
    {
      icon: <Cpu className="h-10 w-10 text-rose-500" />,
      title: "AI Suggestions",
      description:
        "Get AI-powered recommendations for best practices, dependencies, security configs, and folder structures.",
    },
    {
      icon: <Code className="h-10 w-10 text-indigo-500" />,
      title: "CLI Tool",
      description: "Use our CLI to pull templates directly into your local system and automate environment setup.",
    },
  ]

  return (
    <section className="w-full py-12 md:py-24 lg:py-32 bg-muted/50">
      <div className="container px-4 md:px-6">
        <div className="flex flex-col items-center justify-center space-y-4 text-center">
          <div className="space-y-2">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">Key Features</h2>
            <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
              Everything you need to create, configure, and deploy your development environments
            </p>
          </div>
        </div>
        <div className="mx-auto grid max-w-5xl grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 mt-12">
          {features.map((feature, index) => (
            <Card key={index} className="border-2 transition-all hover:border-primary/20 hover:shadow-md">
              <CardHeader>
                <div className="mb-2">{feature.icon}</div>
                <CardTitle>{feature.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base">{feature.description}</CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
