import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Lightbulb, Briefcase, GraduationCap, Users, Rocket } from "lucide-react"

export function UseCasesSection() {
  const useCases = [
    {
      icon: <Lightbulb className="h-10 w-10 text-amber-500" />,
      title: "Hackathons & MVPs",
      description:
        "Bootstrap your hackathon project or MVP in minutes instead of hours. Focus on building your idea, not setting up your environment.",
    },
    {
      icon: <GraduationCap className="h-10 w-10 text-emerald-500" />,
      title: "Teaching & Learning",
      description:
        "Create consistent environments for bootcamps and courses. Students get identical setups without installation headaches.",
    },
    {
      icon: <Briefcase className="h-10 w-10 text-violet-500" />,
      title: "Enterprise Development",
      description:
        "Standardize development environments across teams with pre-approved stacks that match your production environment.",
    },
    {
      icon: <Users className="h-10 w-10 text-cyan-500" />,
      title: "Developer Onboarding",
      description:
        "Get new team members up and running quickly with pre-configured environments that match your existing setup.",
    },
    {
      icon: <Rocket className="h-10 w-10 text-rose-500" />,
      title: "Open Source Projects",
      description:
        "Provide contributors with a ready-to-use development environment to lower the barrier to entry for your project.",
    },
  ]

  return (
    <section className="w-full py-12 md:py-24 lg:py-32">
      <div className="container px-4 md:px-6">
        <div className="flex flex-col items-center justify-center space-y-4 text-center">
          <div className="space-y-2">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">Real-World Use Cases</h2>
            <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
              See how EnvSetup.dev can help in various development scenarios
            </p>
          </div>
        </div>
        <div className="mx-auto grid max-w-5xl grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 mt-12">
          {useCases.map((useCase, index) => (
            <Card key={index} className="border-2 transition-all hover:border-primary/20 hover:shadow-md">
              <CardHeader>
                <div className="mb-2">{useCase.icon}</div>
                <CardTitle>{useCase.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base">{useCase.description}</CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
