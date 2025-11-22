import { Badge } from "@/components/ui/badge"
import { Card } from "@/components/ui/card"

export function TechStackSection() {
  const categories = [
    {
      title: "Frontend",
      icon: "⚛️",
      stacks: ["React", "Next.js", "Angular", "Vue", "Svelte", "Qwik", "Remix", "SolidJS", "Astro"],
    },
    {
      title: "Backend",
      icon: "🔧",
      stacks: ["Express", "NestJS", "Django", "FastAPI", "Spring Boot", "Laravel", "Rails", "Go Gin", ".NET"],
    },
    {
      title: "Databases",
      icon: "🗄️",
      stacks: ["PostgreSQL", "MySQL", "MongoDB", "Redis", "DynamoDB", "Neo4j", "Elasticsearch"],
    },
    {
      title: "DevOps",
      icon: "🚀",
      stacks: ["Docker", "Kubernetes", "Terraform", "GitHub Actions", "GitLab CI", "Jenkins", "ArgoCD"],
    },
    {
      title: "Cloud",
      icon: "☁️",
      stacks: ["AWS", "Azure", "GCP", "Cloudflare", "DigitalOcean", "Vercel", "Netlify"],
    },
    {
      title: "Languages",
      icon: "💻",
      stacks: ["JavaScript", "TypeScript", "Python", "Java", "Go", "Rust", "PHP", "Ruby", "C#"],
    },
  ]

  return (
    <section id="tech-stacks" className="py-20 md:py-32">
      <div className="container">
        <div className="mx-auto max-w-3xl text-center mb-16">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl mb-4">200+ Supported Tech Stacks</h2>
          <p className="text-lg text-muted-foreground">
            The most comprehensive environment automation tool. Our AI detection engine identifies your entire stack
            from code, dependencies, and config files.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map((category, i) => (
            <Card key={i} className="p-6 hover:shadow-lg transition-shadow">
              <div className="flex items-center gap-3 mb-4">
                <span className="text-3xl">{category.icon}</span>
                <h3 className="text-xl font-semibold">{category.title}</h3>
              </div>
              <div className="flex flex-wrap gap-2">
                {category.stacks.map((stack, j) => (
                  <Badge key={j} variant="secondary">
                    {stack}
                  </Badge>
                ))}
              </div>
            </Card>
          ))}
        </div>

        <div className="text-center mt-12">
          <p className="text-sm text-muted-foreground">
            And many more... 15 programming languages, 9 frontend frameworks, 19 backend frameworks, 10 databases, 7
            cloud providers
          </p>
        </div>
      </div>
    </section>
  )
}
