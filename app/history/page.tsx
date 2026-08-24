import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/next-auth-options"
import { sql } from "@/lib/db"
import { HistorySignInCard } from "@/components/history-sign-in-card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Your Generations",
  description: "Environments you've generated with EnvSetup.dev.",
}

interface GenerationRow {
  id: number
  language: string | null
  framework: string | null
  created_at: string
}

async function getGenerations(login: string): Promise<GenerationRow[] | null> {
  try {
    const rows = await sql`
      SELECT id, language, framework, created_at
      FROM generations
      WHERE user_login = ${login}
      ORDER BY created_at DESC
      LIMIT 100
    `
    return rows as GenerationRow[]
  } catch (err) {
    // Table/columns may not exist yet if no generation has ever been logged
    // with an identity attached (self-healed on first write in the
    // generate-deployment route) - treat that the same as "no history yet"
    // rather than showing an error to a signed-in user.
    console.error("Failed to load generation history:", err)
    return null
  }
}

export default async function HistoryPage() {
  const session = await getServerSession(authOptions)

  if (!session?.user?.login) {
    return (
      <div className="container mx-auto px-4 py-16">
        <HistorySignInCard />
      </div>
    )
  }

  const generations = await getGenerations(session.user.login)

  return (
    <div className="container mx-auto px-4 py-12 max-w-3xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Your generations</h1>
        <p className="text-muted-foreground mt-1">
          Signed in as <span className="font-medium">@{session.user.login}</span>. Only environments generated
          while signed in show up here.
        </p>
      </div>

      {generations === null && (
        <Card>
          <CardContent className="py-10 text-center text-sm text-muted-foreground">
            Couldn&apos;t load your history right now. Please try again in a moment.
          </CardContent>
        </Card>
      )}

      {generations !== null && generations.length === 0 && (
        <Card>
          <CardContent className="py-12 text-center space-y-4">
            <p className="text-muted-foreground">
              No generations yet since signing in. Build your first environment to see it here.
            </p>
            <Button asChild>
              <Link href="/generator">Open the Generator</Link>
            </Button>
          </CardContent>
        </Card>
      )}

      {generations !== null && generations.length > 0 && (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Language</TableHead>
              <TableHead>Framework</TableHead>
              <TableHead className="text-right">Generated</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {generations.map((g) => (
              <TableRow key={g.id}>
                <TableCell>
                  <Badge variant="secondary">{g.language ?? "—"}</Badge>
                </TableCell>
                <TableCell>{g.framework ?? "—"}</TableCell>
                <TableCell className="text-right text-muted-foreground">
                  {new Date(g.created_at).toLocaleString(undefined, {
                    dateStyle: "medium",
                    timeStyle: "short",
                  })}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </div>
  )
}
