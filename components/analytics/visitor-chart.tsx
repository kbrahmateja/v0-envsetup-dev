"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { Line, LineChart, ResponsiveContainer, XAxis, YAxis } from "recharts"

interface VisitorChartProps {
  data: Array<{
    date: string
    visitors: number
    pageViews: number
  }>
}

export default function VisitorChart({ data }: VisitorChartProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Visitor Trends</CardTitle>
        <CardDescription>Daily visitors and page views over the last 30 days</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer
          config={{
            visitors: {
              label: "Visitors",
              color: "hsl(var(--chart-1))",
            },
            pageViews: {
              label: "Page Views",
              color: "hsl(var(--chart-2))",
            },
          }}
          className="h-[300px]"
        >
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data}>
              <XAxis
                dataKey="date"
                tickFormatter={(value) =>
                  new Date(value).toLocaleDateString("en-US", { month: "short", day: "numeric" })
                }
              />
              <YAxis />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Line type="monotone" dataKey="visitors" stroke="var(--color-visitors)" strokeWidth={2} name="Visitors" />
              <Line
                type="monotone"
                dataKey="pageViews"
                stroke="var(--color-pageViews)"
                strokeWidth={2}
                name="Page Views"
              />
            </LineChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
