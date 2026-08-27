"use client"

import { useCallback, useEffect, useState } from "react"
import type { DateRange } from "react-day-picker"
import { Loader2 } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import VisitorOverview from "./visitor-overview"
import VisitorChart from "./visitor-chart"
import GeographicDistribution from "./geographic-distribution"
import DeviceStats from "./device-stats"
import ReferralSources from "./referral-sources"
import AffiliateClicks from "./affiliate-clicks"
import DateRangePicker from "./date-range-picker"

interface AnalyticsResponse {
  overview: {
    totalVisitors: number
    pageViews: number
    visitorChange: number
    pageViewChange: number
    downloads: number | null
    downloadChange: number | null
    conversionRate: number | null
    conversionChange: number | null
  }
  visitorTrends: { date: string; visitors: number; pageViews: number }[]
  geographicDistribution: { country: string; visitors: number; percentage: number }[]
  deviceStats: { device: string; visitors: number; percentage: number; color: string }[]
  referralSources: { source: string; visitors: number; percentage: number }[]
  affiliateClicks: { platform: string; clicks: number; percentage: number }[]
}

function defaultRange(): DateRange {
  const to = new Date()
  const from = new Date()
  from.setDate(from.getDate() - 29)
  return { from, to }
}

function NotYetTrackedCard({ title, description }: { title: string; description: string }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground py-10 text-center">
          Not tracked yet — this needs dedicated instrumentation that does not exist in the app today.
        </p>
      </CardContent>
    </Card>
  )
}

export default function AnalyticsDashboard() {
  const [dateRange, setDateRange] = useState<DateRange | undefined>(defaultRange())
  const [data, setData] = useState<AnalyticsResponse | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchData = useCallback(async (range: DateRange | undefined) => {
    if (!range?.from) return
    setLoading(true)
    setError(null)
    try {
      const params = new URLSearchParams({
        from: range.from.toISOString(),
        to: (range.to ?? range.from).toISOString(),
      })
      const res = await fetch(`/api/admin/analytics?${params.toString()}`)
      if (!res.ok) throw new Error(`Request failed (${res.status})`)
      const json = (await res.json()) as AnalyticsResponse
      setData(json)
    } catch (err) {
      console.error("Failed to load analytics:", err)
      setError("Couldn't load analytics data. Please try again.")
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchData(dateRange)
    // Only run once on mount — subsequent loads are triggered by the date picker.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const handleDateRangeChange = (newRange: DateRange | undefined) => {
    setDateRange(newRange)
    if (newRange?.from && newRange?.to) {
      fetchData(newRange)
    }
  }

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Analytics Overview</h2>
        <DateRangePicker onDateRangeChange={handleDateRangeChange} />
      </div>

      {error && (
        <Card className="border-destructive/50">
          <CardContent className="pt-6 text-sm text-destructive">{error}</CardContent>
        </Card>
      )}

      {loading && !data ? (
        <div className="flex items-center justify-center gap-2 py-16 text-muted-foreground">
          <Loader2 className="h-5 w-5 animate-spin" /> Loading real traffic data...
        </div>
      ) : data ? (
        <>
          <VisitorOverview data={data.overview} />

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <VisitorChart data={data.visitorTrends} />
            <NotYetTrackedCard
              title="Popular Templates"
              description="Most downloaded templates this period"
            />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <GeographicDistribution data={data.geographicDistribution} />
            <DeviceStats data={data.deviceStats} />
            <ReferralSources data={data.referralSources} />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <AffiliateClicks data={data.affiliateClicks} />
            <NotYetTrackedCard
              title="User Engagement"
              description="Average time on page and bounce rates"
            />
          </div>
        </>
      ) : null}
    </div>
  )
}
