"use client"

import { useState } from "react"
import { useSession, signIn } from "next-auth/react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Github, Loader2, CheckCircle2, ExternalLink, AlertTriangle } from "lucide-react"
import type { EnvironmentConfig } from "@/lib/deployment-config"

interface GithubPushDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  config: EnvironmentConfig
}

function sanitizeRepoName(name: string) {
  return name.toLowerCase().replace(/[^a-z0-9._-]+/g, "-").replace(/^-+|-+$/g, "") || "envsetup-project"
}

interface CreateResult {
  url: string
  fullName: string
  filesFailed: string[]
}

// The general site sign-in only requests profile scope (see
// lib/next-auth-options.ts) - repo access is asked for right here instead,
// only from people who actually open this dialog. Passing `scope` as
// signIn()'s authorizationParams overrides the provider's default for just
// this one call; GitHub merges it into whatever the user already granted
// rather than replacing it, so this works whether they've never signed in,
// or already have a profile-only grant and need to add repo access.
const REPO_SCOPE = "read:user user:email repo"

// Talks to app/api/github/create-repo/route.ts to actually create a repo
// and push the generated files - replaces what used to be a "Push to
// GitHub" button that only did `console.log("Creating GitHub
// repository...")`. Requires GitHub's `repo` scope, requested inline by
// this component (see REPO_SCOPE above); this dialog handles all three
// states: not signed in, the create form, and the result.
export function GithubPushDialog({ open, onOpenChange, config }: GithubPushDialogProps) {
  const { status } = useSession()
  const [repoName, setRepoName] = useState(() => sanitizeRepoName(config.projectName))
  const [isPrivate, setIsPrivate] = useState(false)
  const [creating, setCreating] = useState(false)
  const [error, setError] = useState<string | null>(null)
  // True when the API rejected the request because this session's token
  // lacks GitHub repo access (stale session from before the `repo` scope was
  // added, or a scope GitHub itself rejected) rather than a normal input
  // error like a taken repo name. Retrying "Create & push files" as-is would
  // just fail the same way again, so this swaps in a one-click fix instead.
  const [needsReauth, setNeedsReauth] = useState(false)
  const [result, setResult] = useState<CreateResult | null>(null)

  const handleCreate = async () => {
    setCreating(true)
    setError(null)
    setNeedsReauth(false)
    try {
      const res = await fetch("/api/github/create-repo", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ repoName, isPrivate, config }),
      })
      const data = await res.json()
      if (!res.ok) {
        setError(data.error || "Something went wrong creating the repository.")
        setNeedsReauth(data.code === "REAUTH_REQUIRED")
        return
      }
      setResult(data)
    } catch {
      setError("Couldn't reach EnvSetup's server. Check your connection and try again.")
    } finally {
      setCreating(false)
    }
  }

  const reset = () => {
    setError(null)
    setNeedsReauth(false)
    setResult(null)
    setCreating(false)
    setRepoName(sanitizeRepoName(config.projectName))
    setIsPrivate(false)
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(next) => {
        onOpenChange(next)
        if (!next) reset()
      }}
    >
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Github className="h-5 w-5" />
            Push to GitHub
          </DialogTitle>
          <DialogDescription>
            Creates a new repository on your GitHub account and pushes the generated files to it.
          </DialogDescription>
        </DialogHeader>

        {result ? (
          <div className="py-6 text-center space-y-4">
            <CheckCircle2 className="h-14 w-14 text-green-500 mx-auto" />
            <h3 className="text-lg font-semibold">Repository created</h3>
            <div className="bg-muted p-4 rounded-lg text-left">
              <p className="text-sm font-medium mb-1">{result.fullName}</p>
              <a
                href={result.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary hover:underline text-sm inline-flex items-center gap-1"
              >
                {result.url}
                <ExternalLink className="h-3 w-3" />
              </a>
            </div>
            {result.filesFailed.length > 0 && (
              <p className="text-sm text-amber-600 dark:text-amber-500">
                {result.filesFailed.length} file{result.filesFailed.length > 1 ? "s" : ""} didn&apos;t push:{" "}
                {result.filesFailed.join(", ")}. You can add {result.filesFailed.length > 1 ? "them" : "it"} manually
                on GitHub.
              </p>
            )}
            <Button onClick={() => onOpenChange(false)} className="w-full">
              Close
            </Button>
          </div>
        ) : status === "loading" ? (
          <div className="py-10 flex justify-center">
            <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
          </div>
        ) : status !== "authenticated" ? (
          <div className="py-6 text-center space-y-4">
            <p className="text-sm text-muted-foreground">
              Sign in with GitHub to create a repository in your account.
            </p>
            <Button
              onClick={() => signIn("github", undefined, { scope: REPO_SCOPE })}
              className="w-full"
            >
              <Github className="h-4 w-4 mr-2" />
              Sign in with GitHub
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="repo-name">Repository name</Label>
              <Input
                id="repo-name"
                value={repoName}
                onChange={(e) => setRepoName(sanitizeRepoName(e.target.value))}
                disabled={creating}
              />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="repo-private">Private repository</Label>
                <p className="text-xs text-muted-foreground">Only you can see it on GitHub</p>
              </div>
              <Switch id="repo-private" checked={isPrivate} onCheckedChange={setIsPrivate} disabled={creating} />
            </div>

            {error && (
              <div className="flex items-start gap-2 text-sm text-destructive bg-destructive/10 p-3 rounded-lg">
                <AlertTriangle className="h-4 w-4 mt-0.5 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            {needsReauth ? (
              // signIn() re-runs the OAuth handshake even for an already
              // signed-in user - no need to sign out first. GitHub merges
              // the requested `repo` scope into the user's existing grant,
              // and the resulting fresh account.access_token flows into a
              // new JWT via the jwt() callback in lib/next-auth-options.ts.
              // A plain retry of "Create & push files" would just hit the
              // same 401/403 again, since nothing about the old token changes
              // on its own.
              <Button
                onClick={() => signIn("github", undefined, { scope: REPO_SCOPE })}
                className="w-full"
                size="lg"
              >
                <Github className="h-4 w-4 mr-2" />
                Reconnect GitHub with repo access
              </Button>
            ) : (
              <Button onClick={handleCreate} disabled={creating || !repoName} className="w-full" size="lg">
                {creating ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Creating repository…
                  </>
                ) : (
                  <>
                    <Github className="h-4 w-4 mr-2" />
                    Create &amp; push files
                  </>
                )}
              </Button>
            )}
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}
