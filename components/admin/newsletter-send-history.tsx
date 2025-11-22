"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { History, Mail, CheckCircle2, XCircle, Clock } from "lucide-react"
import { formatDistanceToNow } from "date-fns"

type SendBatch = {
  id: number
  total_recipients: number
  successful_sends: number
  failed_sends: number
  mail_service: string
  recipient_mode: string
  sent_at: string
}

export function NewsletterSendHistory({ batches }: { batches: SendBatch[] }) {
  if (batches.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <History className="h-5 w-5" />
            Send History
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground text-center py-8">This newsletter has not been sent yet</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <History className="h-5 w-5" />
          Send History ({batches.length})
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[400px] pr-4">
          <div className="space-y-3">
            {batches.map((batch, index) => {
              const successRate =
                batch.total_recipients > 0 ? Math.round((batch.successful_sends / batch.total_recipients) * 100) : 0

              return (
                <div
                  key={batch.id}
                  className="p-4 rounded-lg border bg-card hover:bg-accent/50 transition-colors space-y-3"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <Badge variant={index === 0 ? "default" : "secondary"}>
                          {index === 0 ? "Latest" : `Send #${batches.length - index}`}
                        </Badge>
                        <Badge variant="outline" className="capitalize">
                          <Mail className="h-3 w-3 mr-1" />
                          {batch.mail_service}
                        </Badge>
                        <Badge variant="outline" className="capitalize">
                          {batch.recipient_mode === "all" ? "All Subscribers" : "Selected Recipients"}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-1 text-xs text-muted-foreground">
                        <Clock className="h-3 w-3" />
                        {formatDistanceToNow(new Date(batch.sent_at), { addSuffix: true })}
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-3">
                    <div className="space-y-1">
                      <p className="text-xs text-muted-foreground">Total Sent</p>
                      <p className="text-2xl font-bold">{batch.total_recipients}</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-xs text-muted-foreground flex items-center gap-1">
                        <CheckCircle2 className="h-3 w-3 text-green-600" />
                        Success
                      </p>
                      <p className="text-2xl font-bold text-green-600">{batch.successful_sends}</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-xs text-muted-foreground flex items-center gap-1">
                        <XCircle className="h-3 w-3 text-red-600" />
                        Failed
                      </p>
                      <p className="text-2xl font-bold text-red-600">{batch.failed_sends}</p>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-muted-foreground">Success Rate</span>
                      <span className="font-medium">{successRate}%</span>
                    </div>
                    <div className="w-full bg-secondary rounded-full h-2 overflow-hidden">
                      <div className="bg-green-600 h-full transition-all" style={{ width: `${successRate}%` }} />
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  )
}
