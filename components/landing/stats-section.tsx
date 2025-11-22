import { Card } from "@/components/ui/card"
import { TrendingUp, Clock, DollarSign, Users } from "lucide-react"

export function StatsSection() {
  const stats = [
    {
      icon: Clock,
      value: "90%",
      label: "Time Saved",
      description: "Reduce setup time from days to minutes",
    },
    {
      icon: DollarSign,
      value: "$3K-$10K",
      label: "Cost Savings",
      description: "Per project on DevOps resources",
    },
    {
      icon: TrendingUp,
      value: "10x",
      label: "Faster Setup",
      description: "Go from idea to production faster",
    },
    {
      icon: Users,
      value: "Zero",
      label: "Expertise Required",
      description: "No DevOps knowledge needed",
    },
  ]

  return (
    <section className="py-20 md:py-32">
      <div className="container">
        <div className="mx-auto max-w-3xl text-center mb-16">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl mb-4">Save Time, Save Money</h2>
          <p className="text-lg text-muted-foreground">
            Envsetup.dev is like having a DevOps engineer, backend architect, and cloud architect all in one tool.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, i) => (
            <Card key={i} className="p-6 text-center hover:shadow-lg transition-shadow">
              <stat.icon className="h-10 w-10 text-primary mx-auto mb-4" />
              <div className="text-4xl font-bold mb-2">{stat.value}</div>
              <div className="text-sm font-semibold mb-1">{stat.label}</div>
              <div className="text-xs text-muted-foreground">{stat.description}</div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
