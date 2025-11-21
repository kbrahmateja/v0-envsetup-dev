import { neon } from "@neondatabase/serverless"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"

export async function VisitorsChart() {
  const sql = neon(process.env.DATABASE_URL!)

  const chartData = await sql`
    SELECT 
      DATE(visited_at) as date,
      COUNT(*)::int as visits
    FROM visitors
    WHERE visited_at > NOW() - INTERVAL '30 days'
    GROUP BY DATE(visited_at)
    ORDER BY date ASC
  `

  const formattedData = chartData.map((item) => ({
    date: new Date(item.date).toLocaleDateString("en-US", { month: "short", day: "numeric" }),
    visits: item.visits,
  }))

  return (
    <Card>
      <CardHeader>
        <CardTitle>Visitor Trend (Last 30 Days)</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={formattedData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Line type="monotone" dataKey="visits" stroke="hsl(var(--primary))" strokeWidth={2} />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}
