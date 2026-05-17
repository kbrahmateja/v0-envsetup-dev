"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis } from "recharts"

interface UserEngagementProps {
  data: Array<{
    page: string
    avgTimeOnPage: number
    bounceRate: number
  }>
}

export default function UserEngagement({ data }: UserEngagementProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>User Engagement</CardTitle>
        <CardDescription>Average time on page and bounce rates</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer
          config={{
            avgTimeOnPage: {
              label: "Avg Time (minutes)",
              color: "hsl(var(--chart-1))",
            },
          }}
          className="h-[300px]"
        >
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data}>
              <XAxis dataKey="page" />
              <YAxis />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Bar dataKey="avgTimeOnPage" fill="var(--color-avgTimeOnPage)" name="Avg Time (min)" />
            </BarChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
