import { neon } from "@neondatabase/serverless"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Users, Mail, Eye, TrendingUp } from "lucide-react"

export async function AdminDashboardStats() {
  const sql = neon(process.env.DATABASE_URL!)

  // Fetch stats in parallel
  const [subscribersResult, visitorsResult, newslettersResult] = await Promise.all([
    sql`SELECT COUNT(*)::int as count FROM subscribers WHERE status = 'active'`,
    sql`SELECT COUNT(*)::int as count FROM visitors WHERE visited_at > NOW() - INTERVAL '30 days'`,
    sql`SELECT COUNT(*)::int as count FROM newsletters WHERE sent_at IS NOT NULL`,
  ])

  const stats = [
    {
      title: "Total Subscribers",
      value: subscribersResult[0]?.count || 0,
      icon: Users,
      description: "Active newsletter subscribers",
    },
    {
      title: "Monthly Visitors",
      value: visitorsResult[0]?.count || 0,
      icon: Eye,
      description: "Last 30 days",
    },
    {
      title: "Newsletters Sent",
      value: newslettersResult[0]?.count || 0,
      icon: Mail,
      description: "Total sent",
    },
    {
      title: "Growth Rate",
      value: "+12%",
      icon: TrendingUp,
      description: "vs last month",
    },
  ]

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat) => (
        <Card key={stat.title}>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">{stat.title}</CardTitle>
            <stat.icon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stat.value}</div>
            <p className="text-xs text-muted-foreground">{stat.description}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
