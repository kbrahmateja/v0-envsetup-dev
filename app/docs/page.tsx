import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { languages, frameworks } from "@/lib/stacks"
import { Wand2, Bot, Terminal, Check, ArrowRight } from "lucide-react"
import Link from "next/link"

// Everything on this page is generated from - or cross-checked against -
// the actual generator code (lib/stacks.ts, components/generator-form.tsx,
// lib/versions.ts, cli/src/commands/init.ts), not written from memory. Where
// the web app and the CLI genuinely differ in what they can produce, that
// difference is stated rather than smoothed over - see the database note
// below, which is a real, current gap: the web Wizard and AI Assistant
// don't yet have a database picker, only the CLI does.

const databases = [
  { name: "PostgreSQL", web: false, cli: true, note: "Recommended default" },
  { name: "MySQL", web: false, cli: true, note: "" },
  { name: "MongoDB", web: false, cli: true, note: "NoSQL" },
  { name: "SQLite", web: false, cli: true, note: "Embedded, zero config" },
  { name: "Redis", web: false, cli: true, note: "Cache / queue" },
  { name: "SQL Server", web: false, cli: false, note: "Generator backend only, not yet in CLI prompts" },
  { name: "Cassandra", web: false, cli: false, note: "Generator backend only, not yet in CLI prompts" },
  { name: "Supabase (Postgres-compatible)", web: false, cli: false, note: "Generator backend only, not yet in CLI prompts" },
]

const devTools = [
  { name: "Docker", languages: "Every language" },
  { name: "Git", languages: "Every language" },
  { name: "GitHub Actions", languages: "Every language" },
  { name: "ESLint", languages: "JavaScript, TypeScript" },
  { name: "Prettier", languages: "JavaScript, TypeScript" },
  { name: "Jest", languages: "JavaScript, TypeScript" },
  { name: "Cypress", languages: "JavaScript, TypeScript" },
  { name: "Husky", languages: "JavaScript, TypeScript" },
  { name: "Black (formatter)", languages: "Python" },
  { name: "Pytest", languages: "Python" },
  { name: "JUnit", languages: "Java" },
  { name: "NUnit", languages: "C#" },
  { name: "golangci-lint", languages: "Go" },
  { name: "Clippy", languages: "Rust" },
  { name: "RSpec", languages: "Ruby" },
  { name: "PHPUnit", languages: "PHP" },
]

const infraTools = [
  "Kubernetes", "Nginx", "Traefik", "Apache Kafka", "RabbitMQ", "Redis (cache)", "Helm", "ArgoCD",
]

export default function DocsPage() {
  return (
    <div className="container mx-auto px-4 py-12 max-w-5xl">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4">Docs</h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          What EnvSetup.dev actually supports today, and the three ways to use it.
        </p>
      </div>

      {/* Three ways to use it */}
      <section className="mb-16">
        <h2 className="text-2xl font-semibold mb-2">Three ways to build an environment</h2>
        <p className="text-muted-foreground mb-6">All three produce the same core output: a Dockerfile, docker-compose.yml, .env.example, and a README.</p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardHeader>
              <div className="p-2 rounded-lg bg-primary/10 w-fit mb-2">
                <Wand2 className="h-5 w-5 text-primary" />
              </div>
              <CardTitle className="text-lg">Wizard</CardTitle>
              <CardDescription>Point-and-click, in your browser</CardDescription>
            </CardHeader>
            <CardContent>
              <ol className="space-y-2 text-sm text-muted-foreground list-decimal list-inside">
                <li>Open <Link href="/generator" className="text-primary hover:underline">/generator</Link></li>
                <li>Name your project</li>
                <li>Pick a language, optionally a framework</li>
                <li>Check any dev tools or infra you want</li>
                <li>Click <strong className="text-foreground">Generate Environment</strong></li>
              </ol>
              <p className="text-xs text-muted-foreground mt-4">No database picker yet — see the databases table below.</p>
              <Button asChild size="sm" variant="outline" className="mt-4 w-full">
                <Link href="/generator">Open the Wizard <ArrowRight className="h-3.5 w-3.5 ml-1" /></Link>
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="p-2 rounded-lg bg-primary/10 w-fit mb-2">
                <Bot className="h-5 w-5 text-primary" />
              </div>
              <CardTitle className="text-lg">AI Assistant</CardTitle>
              <CardDescription>Describe it in plain English</CardDescription>
            </CardHeader>
            <CardContent>
              <ol className="space-y-2 text-sm text-muted-foreground list-decimal list-inside">
                <li>Open <Link href="/ai-assistant" className="text-primary hover:underline">/ai-assistant</Link></li>
                <li>Type what you&apos;re building, e.g. <em>&ldquo;a Spring Boot API in Java&rdquo;</em></li>
                <li>The assistant detects your stack from the conversation</li>
                <li>An <strong className="text-foreground">Environment Ready</strong> card appears</li>
                <li>Click Download for the same ZIP the Wizard makes</li>
              </ol>
              <p className="text-xs text-muted-foreground mt-4">Good when you&apos;re not sure which framework to pick.</p>
              <Button asChild size="sm" variant="outline" className="mt-4 w-full">
                <Link href="/ai-assistant">Try the AI Assistant <ArrowRight className="h-3.5 w-3.5 ml-1" /></Link>
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="p-2 rounded-lg bg-primary/10 w-fit mb-2">
                <Terminal className="h-5 w-5 text-primary" />
              </div>
              <CardTitle className="text-lg">CLI</CardTitle>
              <CardDescription>Stay in your terminal</CardDescription>
            </CardHeader>
            <CardContent>
              <code className="block text-xs bg-muted rounded-md p-2 mb-3 overflow-x-auto">npx @envsetup/cli init</code>
              <p className="text-sm text-muted-foreground">Answers prompts for stack, <strong className="text-foreground">database</strong>, and tools, then writes the files straight into a project folder — no browser round-trip.</p>
              <p className="text-xs text-muted-foreground mt-4">Currently the only way to get a database wired into docker-compose automatically.</p>
              <Button asChild size="sm" variant="outline" className="mt-4 w-full">
                <Link href="https://www.npmjs.com/package/@envsetup/cli" target="_blank">View on npm <ArrowRight className="h-3.5 w-3.5 ml-1" /></Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* CLI commands */}
      <section className="mb-16">
        <h2 className="text-2xl font-semibold mb-2">CLI commands</h2>
        <p className="text-muted-foreground mb-6">Everything below runs via <code className="text-xs bg-muted rounded px-1 py-0.5">npx @envsetup/cli &lt;command&gt;</code> — nothing to install first.</p>
        <Card>
          <CardContent className="pt-6">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Command</TableHead>
                  <TableHead>What it does</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow>
                  <TableCell><code className="text-xs">init</code></TableCell>
                  <TableCell className="whitespace-normal">Quick setup — pick a template or configure manually. Prompts for stack, database, and tools.</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell><code className="text-xs">init --ai</code></TableCell>
                  <TableCell className="whitespace-normal">Same as <code className="text-xs">init</code>, with AI-suggested defaults for your prompts.</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell><code className="text-xs">new</code></TableCell>
                  <TableCell className="whitespace-normal">Fuller project wizard — also scaffolds docs, user stories, tasks, a timeline, and editor config.</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell><code className="text-xs">ai</code></TableCell>
                  <TableCell className="whitespace-normal">Natural-language setup — describe the project and it generates the environment directly.</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell><code className="text-xs">doctor</code></TableCell>
                  <TableCell className="whitespace-normal">Checks your system has what your stack needs (Docker, Node, Git, etc). Takes <code className="text-xs">--stack</code> to check a specific one.</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell><code className="text-xs">test-env</code></TableCell>
                  <TableCell className="whitespace-normal">Checks every supported stack against what&apos;s actually installed on your machine.</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </section>

      {/* Languages & frameworks */}
      <section className="mb-16">
        <h2 className="text-2xl font-semibold mb-2">Languages &amp; frameworks</h2>
        <p className="text-muted-foreground mb-6">Selectable in the Wizard, the AI Assistant, and the CLI alike — {languages.length} languages today.</p>
        <Card>
          <CardContent className="pt-6">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Language</TableHead>
                  <TableHead>Frameworks (optional)</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {languages.map((lang) => (
                  <TableRow key={lang.value}>
                    <TableCell className="font-medium">{lang.label}</TableCell>
                    <TableCell className="whitespace-normal text-muted-foreground">
                      {frameworks[lang.value]?.join(", ") ?? "—"}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </section>

      {/* Databases */}
      <section className="mb-16">
        <h2 className="text-2xl font-semibold mb-2">Databases</h2>
        <p className="text-muted-foreground mb-6">
          Honest state as of today: database wiring (docker-compose service + <code className="text-xs bg-muted rounded px-1 py-0.5">.env</code> connection string) is generated by the <strong className="text-foreground">CLI only</strong>. The Wizard and AI Assistant don&apos;t have a database picker yet.
        </p>
        <Card>
          <CardContent className="pt-6">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Database</TableHead>
                  <TableHead>CLI</TableHead>
                  <TableHead>Wizard / AI Assistant</TableHead>
                  <TableHead>Note</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {databases.map((db) => (
                  <TableRow key={db.name}>
                    <TableCell className="font-medium">{db.name}</TableCell>
                    <TableCell>
                      {db.cli
                        ? <Badge variant="secondary" className="gap-1"><Check className="h-3 w-3" /> Yes</Badge>
                        : <span className="text-muted-foreground text-xs">Not yet</span>}
                    </TableCell>
                    <TableCell><span className="text-muted-foreground text-xs">Not yet</span></TableCell>
                    <TableCell className="whitespace-normal text-muted-foreground text-xs">{db.note}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </section>

      {/* Tools */}
      <section className="mb-16">
        <h2 className="text-2xl font-semibold mb-2">Development tools</h2>
        <p className="text-muted-foreground mb-6">Checked in the Wizard&apos;s &ldquo;Development Tools&rdquo; section — config files are generated for whatever you select.</p>
        <Card className="mb-6">
          <CardContent className="pt-6">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Tool</TableHead>
                  <TableHead>Available for</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {devTools.map((tool) => (
                  <TableRow key={tool.name}>
                    <TableCell className="font-medium">{tool.name}</TableCell>
                    <TableCell className="text-muted-foreground">{tool.languages}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        <h3 className="text-lg font-semibold mb-2">Infrastructure &amp; messaging</h3>
        <p className="text-muted-foreground mb-4 text-sm">Language-agnostic — generates ready-to-use config files (k8s manifests, nginx.conf, kafka-compose.yml, etc).</p>
        <div className="flex flex-wrap gap-2">
          {infraTools.map((tool) => (
            <Badge key={tool} variant="outline">{tool}</Badge>
          ))}
        </div>
      </section>

      <Card className="border-dashed">
        <CardContent className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <p className="font-medium">Don&apos;t see your stack?</p>
            <p className="text-sm text-muted-foreground">The full compatibility list — including what&apos;s coming next — lives on the Stacks page.</p>
          </div>
          <Button asChild variant="outline">
            <Link href="/stacks">See all stacks <ArrowRight className="h-3.5 w-3.5 ml-1" /></Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
