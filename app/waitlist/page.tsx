"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Check, Sparkles, ArrowRight } from "lucide-react"
import Link from "next/link"

export default function WaitlistPage() {
  const [email, setEmail] = useState("")
  const [plan, setPlan] = useState("")
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)

  const searchParams = typeof window !== "undefined"
    ? new URLSearchParams(window.location.search)
    : null
  const planParam = searchParams?.get("plan") ?? "pro"

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email) return
    setLoading(true)
    try {
      await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, plan: planParam }),
      })
      setSubmitted(true)
    } finally {
      setLoading(false)
    }
  }

  if (submitted) {
    return (
      <div className="container mx-auto px-4 py-24 max-w-lg text-center">
        <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-6">
          <Check className="h-8 w-8 text-green-600" />
        </div>
        <h1 className="text-3xl font-bold mb-3">You&apos;re on the list!</h1>
        <p className="text-muted-foreground text-lg mb-8">
          We&apos;ll notify you at <strong>{email}</strong> when {planParam === "team" ? "Team" : "Pro"} launches.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Button asChild>
            <Link href="/generator">
              Use Free Plan Now <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
          <Button variant="outline" asChild>
            <Link href="/">Back to Home</Link>
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-16 max-w-lg">
      <div className="text-center mb-10">
        <div className="inline-flex items-center gap-2 bg-violet-100 text-violet-700 px-4 py-1.5 rounded-full text-sm font-medium mb-4">
          <Sparkles className="h-4 w-4" />
          Coming Soon
        </div>
        <h1 className="text-4xl font-bold mb-3">
          {planParam === "team" ? "Team Plan" : "Pro Plan"} — Early Access
        </h1>
        <p className="text-muted-foreground text-lg">
          Be the first to know when we launch. Join the waitlist and get{" "}
          <strong>3 months free</strong> when we go live.
        </p>
      </div>

      <Card>
        <CardContent className="pt-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-sm font-medium mb-1.5 block">Email address</label>
              <Input
                type="email"
                placeholder="you@company.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Joining..." : "Join Waitlist"}
              {!loading && <ArrowRight className="ml-2 h-4 w-4" />}
            </Button>
          </form>

          <div className="mt-6 pt-6 border-t space-y-2">
            {(planParam === "team"
              ? ["Everything in Pro", "Team template library", "Shared environments", "SSO authentication", "Priority support"]
              : ["Unlimited environments", "All 322 templates", "GitHub integration", "AI Assistant", "Priority support"]
            ).map(f => (
              <div key={f} className="flex items-center gap-2 text-sm">
                <Check className="h-4 w-4 text-green-500 shrink-0" />
                <span>{f}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <p className="text-center text-sm text-muted-foreground mt-4">
        Want to use EnvSetup.dev now?{" "}
        <Link href="/generator" className="text-primary hover:underline">
          Try the free plan →
        </Link>
      </p>
    </div>
  )
}
