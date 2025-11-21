import AnalyticsDashboard from "@/components/analytics/analytics-dashboard"

export default function DashboardPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Analytics Dashboard</h1>
          <p className="text-muted-foreground">Monitor your development environment usage and performance metrics</p>
        </div>

        <AnalyticsDashboard />
      </div>
    </div>
  )
}
