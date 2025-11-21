import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"

interface TopTemplatesProps {
  data: Array<{
    name: string
    language: string
    downloads: number
    percentage: number
  }>
}

export default function TopTemplates({ data }: TopTemplatesProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Popular Templates</CardTitle>
        <CardDescription>Most downloaded templates this month</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {data.map((template, index) => (
            <div key={index} className="flex items-center justify-between">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <p className="text-sm font-medium truncate">{template.name}</p>
                  <Badge variant="secondary" className="text-xs">
                    {template.language}
                  </Badge>
                </div>
                <Progress value={template.percentage} className="h-2" />
              </div>
              <div className="ml-4 text-right">
                <p className="text-sm font-medium">{template.downloads.toLocaleString()}</p>
                <p className="text-xs text-muted-foreground">{template.percentage}%</p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
