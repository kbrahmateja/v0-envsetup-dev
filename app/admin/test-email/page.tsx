"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { CheckCircle2, XCircle, Loader2, Mail } from "lucide-react"

export default function TestEmailPage() {
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<{ success: boolean; message: string; stats?: any } | null>(null)

  const testDailySummary = async () => {
    setLoading(true)
    setResult(null)

    try {
      const response = await fetch("/api/test/trigger-daily-summary")
      const data = await response.json()

      if (response.ok) {
        setResult({ success: true, message: data.message, stats: data.stats })
      } else {
        setResult({ success: false, message: data.error || "Failed to send email" })
      }
    } catch (error) {
      setResult({ success: false, message: "Network error - could not connect to server" })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container max-w-2xl py-8">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Mail className="h-6 w-6" />
            Test Daily Email Summary
          </CardTitle>
          <CardDescription>Manually trigger the daily summary email to kbrahmateja@gmail.com</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <p className="text-sm text-muted-foreground">This will send a test email with today's statistics:</p>
            <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1 ml-2">
              <li>Number of new subscribers today</li>
              <li>Total visitors today</li>
              <li>Link to admin dashboard</li>
            </ul>
          </div>

          <Button onClick={testDailySummary} disabled={loading} size="lg" className="w-full">
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Sending Email...
              </>
            ) : (
              <>
                <Mail className="mr-2 h-4 w-4" />
                Send Test Email Now
              </>
            )}
          </Button>

          {result && (
            <Alert variant={result.success ? "default" : "destructive"}>
              <div className="flex items-start gap-2">
                {result.success ? (
                  <CheckCircle2 className="h-5 w-5 text-green-600 mt-0.5" />
                ) : (
                  <XCircle className="h-5 w-5 mt-0.5" />
                )}
                <div className="flex-1">
                  <AlertDescription>
                    <div className="font-semibold mb-1">{result.message}</div>
                    {result.success && result.stats && (
                      <div className="text-sm mt-2 space-y-1">
                        <p>New Subscribers Today: {result.stats.newSubscribers}</p>
                        <p>Total Visitors Today: {result.stats.totalVisitors}</p>
                        <p className="mt-2 text-muted-foreground">Check your email at kbrahmateja@gmail.com</p>
                      </div>
                    )}
                  </AlertDescription>
                </div>
              </div>
            </Alert>
          )}

          <div className="border-t pt-4 mt-4">
            <p className="text-xs text-muted-foreground">
              <strong>Note:</strong> The automated cron job will send this email daily at midnight UTC. Your external
              cron service should call:{" "}
              <code className="bg-muted px-1 py-0.5 rounded">GET /api/cron/daily-summary</code> with header{" "}
              <code className="bg-muted px-1 py-0.5 rounded">Authorization: Bearer YOUR_CRON_SECRET</code>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
