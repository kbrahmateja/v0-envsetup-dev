import { Card } from "@/components/ui/card"
import { Code2, Database, GitBranch, Layers, FileCode, BookOpen } from "lucide-react"

export function FeaturesSection() {
  const features = [
    {
      icon: Code2,
      title: "Local Development Setup",
      description:
        "Complete environment with package managers, linting, formatting, and testing suites configured automatically.",
      items: ["Node/Python/Java environments", "Package managers", "Linting + Formatting", "Testing suites"],
    },
    {
      icon: Layers,
      title: "Project Scaffolding",
      description:
        "Perfect folder structures, routing, API layers, and configuration files generated based on best practices.",
      items: ["Folder structure", "Routing setup", "API layers", "ENV templates"],
    },
    {
      icon: Database,
      title: "Infrastructure-as-Code",
      description: "Production-ready Terraform modules for AWS, Azure, GCP with VPC, databases, storage, and security.",
      items: ["Terraform modules", "VPC, ECS, Lambda", "RDS, DynamoDB, S3", "IAM, Secrets Manager"],
    },
    {
      icon: GitBranch,
      title: "CI/CD Pipelines",
      description:
        "Complete deployment pipelines with testing, building, scanning, and automated deployment workflows.",
      items: ["GitHub Actions / GitLab CI", "Test → Build → Deploy", "Auto-versioning", "Artifact management"],
    },
    {
      icon: FileCode,
      title: "Deployment Automation",
      description: "Dockerfiles, Kubernetes manifests, Helm charts, and zero-downtime deployment strategies.",
      items: ["Docker + Compose", "Kubernetes manifests", "Helm charts", "Zero-downtime deploys"],
    },
    {
      icon: BookOpen,
      title: "Auto Documentation",
      description: "Generated OpenAPI specs, Postman collections, README files, and architecture diagrams.",
      items: ["OpenAPI specs", "Postman collection", "README.md", "Architecture diagrams"],
    },
  ]

  return (
    <section id="features" className="py-20 md:py-32 bg-muted/30">
      <div className="container">
        <div className="mx-auto max-w-3xl text-center mb-16">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl mb-4">
            What Envsetup.dev Generates for You
          </h2>
          <p className="text-lg text-muted-foreground">
            From local development to production deployment, get everything you need in minutes.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, i) => (
            <Card key={i} className="p-6 hover:shadow-lg transition-shadow">
              <feature.icon className="h-10 w-10 text-primary mb-4" />
              <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
              <p className="text-muted-foreground text-sm mb-4">{feature.description}</p>
              <ul className="space-y-1">
                {feature.items.map((item, j) => (
                  <li key={j} className="text-sm flex items-center gap-2">
                    <span className="h-1.5 w-1.5 rounded-full bg-primary" />
                    {item}
                  </li>
                ))}
              </ul>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
