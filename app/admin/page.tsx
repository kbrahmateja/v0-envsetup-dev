import { Suspense } from "react"
import { AdminDashboardStats } from "@/components/admin/dashboard-stats"
import { RecentSubscribers } from "@/components/admin/recent-subscribers"
import { RecentVisitors } from "@/components/admin/recent-visitors"
import { Skeleton } from "@/components/ui/skeleton"

export default function AdminDashboard() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <p className="text-muted-foreground">Welcome to your admin dashboard</p>
      </div>

      <Suspense fallback={<StatsLoadingSkeleton />}>
        <AdminDashboardStats />
      </Suspense>

      <div className="grid gap-6 md:grid-cols-2">
        <Suspense fallback={<TableLoadingSkeleton />}>
          <RecentSubscribers />
        </Suspense>

        <Suspense fallback={<TableLoadingSkeleton />}>
          <RecentVisitors />
        </Suspense>
      </div>
    </div>
  )
}

function StatsLoadingSkeleton() {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {[1, 2, 3, 4].map((i) => (
        <Skeleton key={i} className="h-32 w-full" />
      ))}
    </div>
  )
}

function TableLoadingSkeleton() {
  return <Skeleton className="h-96 w-full" />
}
