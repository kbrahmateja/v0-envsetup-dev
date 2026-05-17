import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { ExternalLink } from "lucide-react"

interface ReferralSourcesProps {
  data: Array<{
    source: string
    visitors: number
    percentage: number
  }>
}

export default function ReferralSources({ data }: ReferralSourcesProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Traffic Sources</CardTitle>
        <CardDescription>Where your visitors are coming from</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {data.map((source, index) => (
            <div key={index} className="flex items-center justify-between">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <p className="text-sm font-medium">{source.source}</p>
                  {source.source !== "Direct" && <ExternalLink className="w-3 h-3 text-muted-foreground" />}
                </div>
                <Progress value={source.percentage} className="h-2" />
              </div>
              <div className="ml-4 text-right">
                <p className="text-sm font-medium">{source.visitors.toLocaleString()}</p>
                <p className="text-xs text-muted-foreground">{source.percentage}%</p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
