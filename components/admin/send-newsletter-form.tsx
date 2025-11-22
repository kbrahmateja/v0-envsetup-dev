"use client"

import { useState, useMemo } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { AlertTriangle, Send, Users, Search } from "lucide-react"
import { toast } from "sonner"

type Subscriber = {
  id: number
  email: string
  subscribed_at: string
}

export function SendNewsletterForm({ newsletter, subscribers }: { newsletter: any; subscribers: Subscriber[] }) {
  const router = useRouter()
  const [isSending, setIsSending] = useState(false)
  const [recipientMode, setRecipientMode] = useState<"all" | "selected">("all")
  const [selectedEmails, setSelectedEmails] = useState<Set<string>>(new Set())
  const [searchQuery, setSearchQuery] = useState("")

  // Filter subscribers based on search
  const filteredSubscribers = useMemo(() => {
    if (!searchQuery) return subscribers
    const query = searchQuery.toLowerCase()
    return subscribers.filter((sub) => sub.email.toLowerCase().includes(query))
  }, [subscribers, searchQuery])

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedEmails(new Set(filteredSubscribers.map((s) => s.email)))
    } else {
      setSelectedEmails(new Set())
    }
  }

  const handleSelectEmail = (email: string, checked: boolean) => {
    const newSelected = new Set(selectedEmails)
    if (checked) {
      newSelected.add(email)
    } else {
      newSelected.delete(email)
    }
    setSelectedEmails(newSelected)
  }

  const recipientCount = recipientMode === "all" ? subscribers.length : selectedEmails.size

  const handleSend = async () => {
    if (recipientMode === "selected" && selectedEmails.size === 0) {
      toast.error("Please select at least one recipient")
      return
    }

    if (
      !confirm(
        `Are you sure you want to send this newsletter to ${recipientCount} subscriber${recipientCount !== 1 ? "s" : ""}? This action cannot be undone.`,
      )
    ) {
      return
    }

    setIsSending(true)

    try {
      const response = await fetch("/api/admin/newsletters/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          newsletterId: newsletter.id,
          recipientMode,
          selectedEmails: recipientMode === "selected" ? Array.from(selectedEmails) : undefined,
        }),
      })

      if (!response.ok) throw new Error("Failed to send newsletter")

      toast.success(`Newsletter sent to ${recipientCount} subscriber${recipientCount !== 1 ? "s" : ""}`)
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
          This will send the newsletter to {recipientCount} subscriber{recipientCount !== 1 ? "s" : ""}. This action
          cannot be undone.
        </AlertDescription>
      </Alert>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Select Recipients
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <RadioGroup value={recipientMode} onValueChange={(value) => setRecipientMode(value as "all" | "selected")}>
            <div className="flex items-center space-x-2 p-3 rounded-lg border hover:bg-accent transition-colors">
              <RadioGroupItem value="all" id="all" />
              <Label htmlFor="all" className="flex-1 cursor-pointer">
                <div className="font-medium">All Active Subscribers</div>
                <div className="text-sm text-muted-foreground">Send to all {subscribers.length} active subscribers</div>
              </Label>
            </div>
            <div className="flex items-center space-x-2 p-3 rounded-lg border hover:bg-accent transition-colors">
              <RadioGroupItem value="selected" id="selected" />
              <Label htmlFor="selected" className="flex-1 cursor-pointer">
                <div className="font-medium">Selected Subscribers</div>
                <div className="text-sm text-muted-foreground">Choose specific recipients</div>
              </Label>
            </div>
          </RadioGroup>

          {recipientMode === "selected" && (
            <div className="space-y-3 pt-4 border-t">
              <div className="flex items-center gap-2">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search subscribers..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-9"
                  />
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleSelectAll(selectedEmails.size !== filteredSubscribers.length)}
                >
                  {selectedEmails.size === filteredSubscribers.length ? "Deselect All" : "Select All"}
                </Button>
              </div>

              <div className="text-sm text-muted-foreground">
                {selectedEmails.size} of {subscribers.length} selected
              </div>

              <ScrollArea className="h-[300px] rounded-md border p-4">
                <div className="space-y-2">
                  {filteredSubscribers.length === 0 ? (
                    <p className="text-center text-sm text-muted-foreground py-8">No subscribers found</p>
                  ) : (
                    filteredSubscribers.map((subscriber) => (
                      <div
                        key={subscriber.id}
                        className="flex items-center space-x-2 p-2 rounded hover:bg-accent transition-colors"
                      >
                        <Checkbox
                          id={`subscriber-${subscriber.id}`}
                          checked={selectedEmails.has(subscriber.email)}
                          onCheckedChange={(checked) => handleSelectEmail(subscriber.email, checked as boolean)}
                        />
                        <Label htmlFor={`subscriber-${subscriber.id}`} className="flex-1 cursor-pointer">
                          <div className="font-medium">{subscriber.email}</div>
                          <div className="text-xs text-muted-foreground">
                            Subscribed {new Date(subscriber.subscribed_at).toLocaleDateString()}
                          </div>
                        </Label>
                      </div>
                    ))
                  )}
                </div>
              </ScrollArea>
            </div>
          )}
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
        <Button
          onClick={handleSend}
          disabled={isSending || (recipientMode === "selected" && selectedEmails.size === 0)}
          size="lg"
        >
          <Send className="mr-2 h-4 w-4" />
          {isSending ? "Sending..." : `Send to ${recipientCount} Subscriber${recipientCount !== 1 ? "s" : ""}`}
        </Button>
        <Button variant="outline" onClick={() => router.back()} disabled={isSending} size="lg">
          Cancel
        </Button>
      </div>
    </div>
  )
}
