import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Code, Download, GitBranch, Layers, Settings, Zap, Bot, Cloud } from "lucide-react"

const features = [
  {
    icon: Bot,
    title: "AI-Powered Assistant",
    description: "Chat with AI to discover the perfect software stack and versions for your project.",
  },
  {
    icon: Zap,
    title: "Instant Generation",
    description: "Generate complete development environments in seconds, not hours.",
  },
  {
    icon: Cloud,
    title: "Auto Deployment",
    description: "Deploy directly to cloud providers or dedicated servers with one click.",
  },
  {
    icon: Code,
    title: "50+ Languages",
    description: "Support for all major programming languages and frameworks.",
  },
  {
    icon: Settings,
    title: "Fully Customizable",
    description: "Tailor every aspect of your environment to your specific needs.",
  },
  {
    icon: Download,
    title: "Multiple Formats",
    description: "Download as ZIP, push to GitHub, or use our CLI tool.",
  },
  {
    icon: GitBranch,
    title: "Git Integration",
    description: "Automatic Git initialization with proper .gitignore files.",
  },
  {
    icon: Layers,
    title: "Best Practices",
    description: "Follows industry standards and best practices out of the box.",
  },
]

export default function FeaturesSection() {
  return (
    <section className="py-20 bg-muted/50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl lg:text-4xl font-bold mb-4">Everything You Need to Start Coding</h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Our platform provides all the tools and configurations you need to jump straight into development.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <Card key={index} className="border-0 shadow-sm hover:shadow-md transition-shadow">
              <CardHeader>
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                  <feature.icon className="w-6 h-6 text-primary" />
                </div>
                <CardTitle className="text-xl">{feature.title}</CardTitle>
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
