import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"

interface AffiliateClicksProps {
  data: Array<{ platform: string; clicks: number; percentage: number }>
}

export default function AffiliateClicks({ data }: AffiliateClicksProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Deploy Link Clicks</CardTitle>
        <CardDescription>Which hosting platforms visitors click through to from results pages</CardDescription>
      </CardHeader>
      <CardContent>
        {data.length === 0 ? (
          <p className="text-sm text-muted-foreground py-10 text-center">
            No deploy link clicks yet in this period.
          </p>
        ) : (
          <div className="space-y-4">
            {data.map((item, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium mb-1">{item.platform}</p>
                  <Progress value={item.percentage} className="h-2" />
                </div>
                <div className="ml-4 text-right">
                  <p className="text-sm font-medium">{item.clicks.toLocaleString()}</p>
                  <p className="text-xs text-muted-foreground">{item.percentage}%</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
