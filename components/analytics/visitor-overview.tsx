import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Users, Eye, Download, TrendingUp } from "lucide-react"

interface VisitorOverviewProps {
  data: {
    totalVisitors: number
    pageViews: number
    downloads: number
    conversionRate: number
    visitorChange: number
    pageViewChange: number
    downloadChange: number
    conversionChange: number
  }
}

export default function VisitorOverview({ data }: VisitorOverviewProps) {
  const metrics = [
    {
      title: "Total Visitors",
      value: data.totalVisitors.toLocaleString(),
      change: data.visitorChange,
      icon: Users,
      description: "Unique visitors this month",
    },
    {
      title: "Page Views",
      value: data.pageViews.toLocaleString(),
      change: data.pageViewChange,
      icon: Eye,
      description: "Total page views",
    },
    {
      title: "Downloads",
      value: data.downloads.toLocaleString(),
      change: data.downloadChange,
      icon: Download,
      description: "Environment downloads",
    },
    {
      title: "Conversion Rate",
      value: `${data.conversionRate}%`,
      change: data.conversionChange,
      icon: TrendingUp,
      description: "Visitor to download rate",
    },
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {metrics.map((metric, index) => (
        <Card key={index}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{metric.title}</CardTitle>
            <metric.icon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metric.value}</div>
            <p className="text-xs text-muted-foreground">
              <span className={metric.change >= 0 ? "text-green-600" : "text-red-600"}>
                {metric.change >= 0 ? "+" : ""}
                {metric.change}%
              </span>{" "}
              from last month
            </p>
            <CardDescription className="mt-1">{metric.description}</CardDescription>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
