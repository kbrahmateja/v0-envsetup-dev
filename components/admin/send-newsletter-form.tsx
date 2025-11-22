"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { AlertTriangle, Send, Mail } from "lucide-react"
import { toast } from "sonner"

export function SendNewsletterForm({ newsletter, subscriberCount }: { newsletter: any; subscriberCount: number }) {
  const router = useRouter()
  const [isSending, setIsSending] = useState(false)
  const [mailService, setMailService] = useState<"brevo" | "resend">("brevo")

  const handleSend = async () => {
    if (
      !confirm(
        `Are you sure you want to send this newsletter to ${subscriberCount} subscribers via ${mailService.toUpperCase()}? This action cannot be undone.`,
      )
    ) {
      return
    }

    setIsSending(true)

    try {
      const response = await fetch("/api/admin/newsletters/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ newsletterId: newsletter.id, mailService }),
      })

      if (!response.ok) throw new Error("Failed to send newsletter")

      toast.success("Newsletter is being sent to subscribers")
      router.push("/admin/newsletters")
      router.refresh()
    } catch (error) {
      toast.error("Failed to send newsletter")
    } finally {
      setIsSending(false)
    }
  }

  return (
    <div className="space-y-6">
      <Alert>
        <AlertTriangle className="h-4 w-4" />
        <AlertDescription>
          This will send the newsletter to all {subscriberCount} active subscribers. This action cannot be undone.
        </AlertDescription>
      </Alert>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Mail className="h-5 w-5" />
            Mail Service
          </CardTitle>
        </CardHeader>
        <CardContent>
          <RadioGroup value={mailService} onValueChange={(value) => setMailService(value as "brevo" | "resend")}>
            <div className="flex items-center space-x-2 p-3 rounded-lg border hover:bg-accent transition-colors">
              <RadioGroupItem value="brevo" id="brevo" />
              <Label htmlFor="brevo" className="flex-1 cursor-pointer">
                <div className="font-medium">Brevo</div>
                <div className="text-sm text-muted-foreground">Send via Brevo SMTP service</div>
              </Label>
            </div>
            <div className="flex items-center space-x-2 p-3 rounded-lg border hover:bg-accent transition-colors">
              <RadioGroupItem value="resend" id="resend" />
              <Label htmlFor="resend" className="flex-1 cursor-pointer">
                <div className="font-medium">Resend</div>
                <div className="text-sm text-muted-foreground">Send via Resend API</div>
              </Label>
            </div>
          </RadioGroup>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Newsletter Preview</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h3 className="text-sm font-medium text-muted-foreground">Subject</h3>
            <p className="text-lg font-semibold">{newsletter.subject}</p>
          </div>

          <div>
            <h3 className="text-sm font-medium text-muted-foreground mb-2">Content</h3>
            <div className="prose prose-sm max-w-none">
              {newsletter.content.split("\n\n").map((paragraph: string, idx: number) => (
                <p key={idx}>{paragraph}</p>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="flex gap-3">
        <Button onClick={handleSend} disabled={isSending} size="lg">
          <Send className="mr-2 h-4 w-4" />
          {isSending
            ? "Sending..."
            : `Send to ${subscriberCount} Subscribers via ${mailService === "brevo" ? "Brevo" : "Resend"}`}
        </Button>
        <Button variant="outline" onClick={() => router.back()} disabled={isSending} size="lg">
          Cancel
        </Button>
      </div>
    </div>
  )
}
