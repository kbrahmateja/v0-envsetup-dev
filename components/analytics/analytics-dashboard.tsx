"use client"

import { useState } from "react"
import type { DateRange } from "react-day-picker"
import VisitorOverview from "./visitor-overview"
import VisitorChart from "./visitor-chart"
import TopTemplates from "./top-templates"
import GeographicDistribution from "./geographic-distribution"
import DeviceStats from "./device-stats"
import ReferralSources from "./referral-sources"
import UserEngagement from "./user-engagement"
import DateRangePicker from "./date-range-picker"
import { mockAnalyticsData } from "@/lib/analytics-data"

export default function AnalyticsDashboard() {
  const [dateRange, setDateRange] = useState<DateRange | undefined>({
    from: new Date(2024, 0, 1),
    to: new Date(),
  })

  const handleDateRangeChange = (newDateRange: DateRange | undefined) => {
    setDateRange(newDateRange)
    // In a real app, this would trigger a data refresh
    console.log("Date range changed:", newDateRange)
  }

  return (
    <div className="space-y-8">
      {/* Date Range Picker */}
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Analytics Overview</h2>
        <DateRangePicker onDateRangeChange={handleDateRangeChange} />
      </div>

      {/* Overview Cards */}
      <VisitorOverview data={mockAnalyticsData.overview} />

      {/* Charts Row 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <VisitorChart data={mockAnalyticsData.visitorTrends} />
        <TopTemplates data={mockAnalyticsData.topTemplates} />
      </div>

      {/* Charts Row 2 */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <GeographicDistribution data={mockAnalyticsData.geographicDistribution} />
        <DeviceStats data={mockAnalyticsData.deviceStats} />
        <ReferralSources data={mockAnalyticsData.referralSources} />
      </div>

      {/* User Engagement */}
      <UserEngagement data={mockAnalyticsData.userEngagement} />
    </div>
  )
}
