"use client"

import { useState } from "react"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { MessageSquarePlus } from "lucide-react"

type SubmitState = "idle" | "submitting" | "success" | "error"

export default function FeedbackWidget() {
  const pathname = usePathname()
  const [open, setOpen] = useState(false)
  const [message, setMessage] = useState("")
  const [email, setEmail] = useState("")
  const [state, setState] = useState<SubmitState>("idle")
  const [errorText, setErrorText] = useState("")

  const resetAndClose = () => {
    setOpen(false)
    setState("idle")
    setMessage("")
    setEmail("")
    setErrorText("")
  }

  const handleSubmit = async () => {
    if (!message.trim()) {
      setState("error")
      setErrorText("Please enter a suggestion before submitting.")
      return
    }

    setState("submitting")
    setErrorText("")

    try {
      const response = await fetch("/api/suggestions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: message.trim(),
          email: email.trim() || undefined,
          pageUrl: pathname,
        }),
      })

      const data = await response.json().catch(() => ({}))

      if (!response.ok) {
        setState("error")
        setErrorText(data?.error || "Something went wrong. Please try again.")
        return
      }

      setState("success")
    } catch {
      setState("error")
      setErrorText("Network error. Please try again.")
    }
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(next) => {
        setOpen(next)
        if (!next) {
          setState("idle")
          setErrorText("")
        }
      }}
    >
      <DialogTrigger asChild>
        <Button
          data-testid="feedback-widget-trigger"
          className="fixed bottom-6 right-6 z-50 h-12 rounded-full shadow-lg gap-2 px-4"
          aria-label="Send a suggestion"
        >
          <MessageSquarePlus className="h-5 w-5" />
          <span className="hidden sm:inline">Feedback</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        {state === "success" ? (
          <>
            <DialogHeader>
              <DialogTitle>Thanks for the suggestion! 🎉</DialogTitle>
              <DialogDescription>We read every suggestion and really appreciate it.</DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button onClick={resetAndClose}>Close</Button>
            </DialogFooter>
          </>
        ) : (
          <>
            <DialogHeader>
              <DialogTitle>Got a suggestion?</DialogTitle>
              <DialogDescription>
                Tell us what you'd like to see, or what's not working. It goes straight to our team.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-2">
              <div className="space-y-2">
                <Label htmlFor="feedback-message">Your suggestion</Label>
                <Textarea
                  id="feedback-message"
                  placeholder="I'd love to see..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  rows={5}
                  maxLength={5000}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="feedback-email">Email (optional, if you'd like a reply)</Label>
                <Input
                  id="feedback-email"
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              {state === "error" && errorText && <p className="text-sm text-destructive">{errorText}</p>}
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={resetAndClose}>
                Cancel
              </Button>
              <Button onClick={handleSubmit} disabled={state === "submitting"}>
                {state === "submitting" ? "Sending..." : "Send Suggestion"}
              </Button>
            </DialogFooter>
          </>
        )}
      </DialogContent>
    </Dialog>
  )
}
