"use client"

import { signIn } from "next-auth/react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Github, History } from "lucide-react"

export function HistorySignInCard() {
  return (
    <Card className="max-w-md mx-auto">
      <CardHeader className="text-center">
        <div className="mx-auto mb-2 flex h-12 w-12 items-center justify-center rounded-full bg-muted">
          <History className="h-6 w-6 text-muted-foreground" />
        </div>
        <CardTitle>See your past generations</CardTitle>
        <CardDescription>
          Sign in with GitHub to keep a history of every environment you&apos;ve generated, and get a higher
          rate limit on downloads. Sign-in is optional — the Generator, AI Assistant, and CLI all work without it.
        </CardDescription>
      </CardHeader>
      <CardContent className="flex justify-center">
        <Button onClick={() => signIn("github", { callbackUrl: "/history" })} className="gap-2">
          <Github className="h-4 w-4" />
          Sign in with GitHub
        </Button>
      </CardContent>
    </Card>
  )
}
