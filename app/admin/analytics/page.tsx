import AnalyticsDashboard from "@/components/analytics/analytics-dashboard"

export default function AdminAnalyticsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Analytics Dashboard</h1>
        <p className="text-muted-foreground">
          Real traffic data from the visitors table — visible to admins only.
        </p>
      </div>

      <AnalyticsDashboard />
    </div>
  )
}
