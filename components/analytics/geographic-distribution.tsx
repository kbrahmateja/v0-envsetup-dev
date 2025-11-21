import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"

interface GeographicDistributionProps {
  data: Array<{
    country: string
    visitors: number
    percentage: number
  }>
}

export default function GeographicDistribution({ data }: GeographicDistributionProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Geographic Distribution</CardTitle>
        <CardDescription>Visitors by country</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {data.map((country, index) => (
            <div key={index} className="flex items-center justify-between">
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium mb-1">{country.country}</p>
                <Progress value={country.percentage} className="h-2" />
              </div>
              <div className="ml-4 text-right">
                <p className="text-sm font-medium">{country.visitors.toLocaleString()}</p>
                <p className="text-xs text-muted-foreground">{country.percentage}%</p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
