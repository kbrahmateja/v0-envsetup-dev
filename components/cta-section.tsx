"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ArrowRight, Mail } from "lucide-react"
import { useState } from "react"

export function CTASection() {
  const [email, setEmail] = useState("")
  const [status, setStatus] = useState<"idle" | "loading" | "done" | "error">("idle")

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email) return
    setStatus("loading")
    try {
      const res = await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      })
      setStatus(res.ok ? "done" : "error")
    } catch {
      setStatus("error")
    }
  }

  return (
    <section className="w-full py-12 md:py-24 lg:py-32 bg-muted/50">
      <div className="container px-4 md:px-6">
        <div className="flex flex-col items-center justify-center space-y-4 text-center">
          <div className="space-y-2">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
              Ready to Streamline Your Development?
            </h2>
            <p className="max-w-[900px] text-muted-foreground md:text-xl">
              Start generating customized development environments in seconds. 322 templates, 21 languages, free forever.
            </p>
          </div>

          <div className="flex flex-col gap-2 min-[400px]:flex-row mt-2">
            <Button asChild size="lg">
              <Link href="/generator">
                Start Generating <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Button variant="outline" size="lg" asChild>
              <Link href="/templates">Browse Templates</Link>
            </Button>
          </div>

          {/* Newsletter signup */}
          <div className="w-full max-w-md mt-8 pt-8 border-t">
            <p className="text-sm font-medium mb-3 flex items-center justify-center gap-2">
              <Mail className="h-4 w-4" />
              Get notified about new templates & features
            </p>
            {status === "done" ? (
              <p className="text-sm text-green-600 font-medium">✅ You&apos;re on the list!</p>
            ) : (
              <form onSubmit={handleSubscribe} className="flex gap-2">
                <Input
                  type="email"
                  placeholder="your@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="flex-1"
                  required
                />
                <Button type="submit" size="sm" disabled={status === "loading"}>
                  {status === "loading" ? "..." : "Subscribe"}
                </Button>
              </form>
            )}
            {status === "error" && (
              <p className="text-xs text-red-500 mt-1">Something went wrong. Please try again.</p>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}
