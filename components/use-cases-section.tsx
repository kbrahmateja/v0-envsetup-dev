import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { BookOpen, Briefcase, GraduationCap, Users } from "lucide-react"

const useCases = [
  {
    icon: Briefcase,
    title: "Professional Development",
    description: "Quickly spin up environments for client projects, prototypes, and production applications.",
    examples: ["Client projects", "MVP development", "API prototyping"],
  },
  {
    icon: GraduationCap,
    title: "Learning & Education",
    description: "Perfect for students and educators who need consistent, ready-to-use development setups.",
    examples: ["Coding bootcamps", "University courses", "Self-learning"],
  },
  {
    icon: Users,
    title: "Team Collaboration",
    description: "Ensure all team members start with identical development environments.",
    examples: ["Onboarding new developers", "Hackathons", "Team projects"],
  },
  {
    icon: BookOpen,
    title: "Tutorial & Content Creation",
    description: "Create consistent environments for tutorials, courses, and educational content.",
    examples: ["YouTube tutorials", "Blog posts", "Online courses"],
  },
]

export default function UseCasesSection() {
  return (
    <section className="py-20">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl lg:text-4xl font-bold mb-4">Perfect for Every Use Case</h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Whether you're a student, professional developer, or educator, EnvSetup.dev adapts to your needs.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {useCases.map((useCase, index) => (
            <Card key={index} className="border-0 shadow-sm hover:shadow-md transition-shadow">
              <CardHeader>
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                  <useCase.icon className="w-6 h-6 text-primary" />
                </div>
                <CardTitle className="text-xl">{useCase.title}</CardTitle>
                <CardDescription className="text-base">{useCase.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <p className="text-sm font-medium text-muted-foreground">Perfect for:</p>
                  <ul className="text-sm space-y-1">
                    {useCase.examples.map((example, i) => (
                      <li key={i} className="flex items-center">
                        <div className="w-1.5 h-1.5 bg-primary rounded-full mr-2" />
                        {example}
                      </li>
                    ))}
                  </ul>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
