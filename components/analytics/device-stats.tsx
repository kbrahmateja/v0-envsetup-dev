"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { Cell, Pie, PieChart, ResponsiveContainer } from "recharts"

interface DeviceStatsProps {
  data: Array<{
    device: string
    visitors: number
    percentage: number
    color: string
  }>
}

export default function DeviceStats({ data }: DeviceStatsProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Device Types</CardTitle>
        <CardDescription>Visitor breakdown by device type</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer
          config={{
            visitors: {
              label: "Visitors",
            },
          }}
          className="h-[200px]"
        >
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie data={data} cx="50%" cy="50%" innerRadius={40} outerRadius={80} paddingAngle={5} dataKey="visitors">
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <ChartTooltip content={<ChartTooltipContent />} />
            </PieChart>
          </ResponsiveContainer>
        </ChartContainer>

        <div className="mt-4 space-y-2">
          {data.map((device, index) => (
            <div key={index} className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: device.color }} />
                <span className="text-sm">{device.device}</span>
              </div>
              <span className="text-sm font-medium">{device.percentage}%</span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
