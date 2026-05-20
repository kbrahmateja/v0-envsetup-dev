"use client"

import { useState } from "react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Check, Plus, Search } from "lucide-react"

const stacks = {
  "JavaScript / TypeScript": {
    color: "bg-yellow-100 text-yellow-800 border-yellow-200",
    dot: "bg-yellow-400",
    frameworks: [
      { name: "Next.js", supported: true, tags: ["Full Stack", "SSR"] },
      { name: "NestJS", supported: true, tags: ["Backend", "Enterprise"] },
      { name: "Express.js", supported: true, tags: ["Backend", "Minimal"] },
      { name: "Fastify", supported: true, tags: ["Backend", "Fast"] },
      { name: "SvelteKit", supported: true, tags: ["Full Stack"] },
      { name: "Nuxt.js", supported: true, tags: ["Full Stack", "Vue"] },
      { name: "Remix", supported: true, tags: ["Full Stack"] },
      { name: "Hono", supported: true, tags: ["Backend", "Edge"] },
      { name: "Astro", supported: true, tags: ["Frontend", "Static"] },
      { name: "Elysia + Bun", supported: true, tags: ["Backend", "Fast"] },
      { name: "Angular", supported: true, tags: ["Frontend"] },
      { name: "tRPC + Next.js", supported: true, tags: ["Full Stack", "Type-safe"] },
      { name: "AdonisJS", supported: true, tags: ["Full Stack"] },
      { name: "Koa", supported: true, tags: ["Backend"] },
      { name: "Strapi", supported: true, tags: ["CMS", "Backend"] },
      { name: "Medusa", supported: true, tags: ["E-commerce"] },
      { name: "Deno / Fresh", supported: false, tags: ["Backend"] },
      { name: "Qwik", supported: false, tags: ["Frontend"] },
    ]
  },
  "Python": {
    color: "bg-blue-100 text-blue-800 border-blue-200",
    dot: "bg-blue-400",
    frameworks: [
      { name: "FastAPI", supported: true, tags: ["Backend", "Async"] },
      { name: "Django", supported: true, tags: ["Full Stack"] },
      { name: "Flask", supported: true, tags: ["Backend", "Minimal"] },
      { name: "Litestar", supported: true, tags: ["Backend"] },
      { name: "Tornado", supported: true, tags: ["Backend", "Async"] },
      { name: "Sanic", supported: true, tags: ["Backend", "Fast"] },
      { name: "Falcon", supported: true, tags: ["Backend", "REST"] },
      { name: "Starlette", supported: true, tags: ["Backend"] },
      { name: "Pyramid", supported: true, tags: ["Backend"] },
    ]
  },
  "Java": {
    color: "bg-orange-100 text-orange-800 border-orange-200",
    dot: "bg-orange-400",
    frameworks: [
      { name: "Spring Boot", supported: true, tags: ["Backend", "Enterprise"] },
      { name: "Quarkus", supported: true, tags: ["Backend", "Cloud-Native"] },
      { name: "Micronaut", supported: true, tags: ["Backend"] },
      { name: "Vert.x", supported: true, tags: ["Backend", "Reactive"] },
      { name: "Helidon", supported: true, tags: ["Backend"] },
      { name: "Javalin", supported: true, tags: ["Backend", "Minimal"] },
      { name: "Dropwizard", supported: true, tags: ["Backend"] },
      { name: "Play Framework", supported: false, tags: ["Full Stack"] },
    ]
  },
  "Kotlin": {
    color: "bg-purple-100 text-purple-800 border-purple-200",
    dot: "bg-purple-400",
    frameworks: [
      { name: "Spring Boot", supported: true, tags: ["Backend", "Enterprise"] },
      { name: "Ktor", supported: true, tags: ["Backend", "Async"] },
      { name: "Micronaut", supported: true, tags: ["Backend"] },
      { name: "http4k", supported: false, tags: ["Backend"] },
    ]
  },
  "Go": {
    color: "bg-cyan-100 text-cyan-800 border-cyan-200",
    dot: "bg-cyan-400",
    frameworks: [
      { name: "Gin", supported: true, tags: ["Backend", "Fast"] },
      { name: "Fiber", supported: true, tags: ["Backend", "Express-like"] },
      { name: "Echo", supported: true, tags: ["Backend", "Minimal"] },
      { name: "Chi", supported: true, tags: ["Backend"] },
      { name: "Gorilla Mux", supported: true, tags: ["Backend"] },
      { name: "Beego", supported: true, tags: ["Full Stack"] },
      { name: "Buffalo", supported: true, tags: ["Full Stack"] },
      { name: "Iris", supported: true, tags: ["Backend", "Fast"] },
    ]
  },
  "Rust": {
    color: "bg-red-100 text-red-800 border-red-200",
    dot: "bg-red-400",
    frameworks: [
      { name: "Actix Web", supported: true, tags: ["Backend", "Fast"] },
      { name: "Axum", supported: true, tags: ["Backend", "Tokio"] },
      { name: "Rocket", supported: true, tags: ["Backend"] },
      { name: "Tide", supported: true, tags: ["Backend", "Async"] },
      { name: "Warp", supported: true, tags: ["Backend"] },
      { name: "Poem", supported: false, tags: ["Backend"] },
    ]
  },
  "PHP": {
    color: "bg-indigo-100 text-indigo-800 border-indigo-200",
    dot: "bg-indigo-400",
    frameworks: [
      { name: "Laravel", supported: true, tags: ["Full Stack"] },
      { name: "Symfony", supported: true, tags: ["Backend", "Enterprise"] },
      { name: "CodeIgniter", supported: true, tags: ["Backend"] },
      { name: "Slim", supported: true, tags: ["Backend", "Minimal"] },
      { name: "Yii", supported: true, tags: ["Full Stack"] },
      { name: "CakePHP", supported: true, tags: ["Full Stack"] },
      { name: "Phalcon", supported: true, tags: ["Backend", "Fast"] },
      { name: "Laminas", supported: false, tags: ["Backend"] },
    ]
  },
  "Ruby": {
    color: "bg-rose-100 text-rose-800 border-rose-200",
    dot: "bg-rose-400",
    frameworks: [
      { name: "Ruby on Rails", supported: true, tags: ["Full Stack"] },
      { name: "Sinatra", supported: true, tags: ["Backend", "Minimal"] },
      { name: "Hanami", supported: true, tags: ["Full Stack"] },
      { name: "Grape", supported: true, tags: ["Backend", "API"] },
      { name: "Roda", supported: true, tags: ["Backend"] },
    ]
  },
  "C# / .NET": {
    color: "bg-violet-100 text-violet-800 border-violet-200",
    dot: "bg-violet-400",
    frameworks: [
      { name: "ASP.NET Core", supported: true, tags: ["Backend", "Enterprise"] },
      { name: "Blazor", supported: true, tags: ["Full Stack"] },
      { name: "Minimal API", supported: true, tags: ["Backend"] },
      { name: "Orleans", supported: true, tags: ["Backend", "Distributed"] },
      { name: "MAUI", supported: false, tags: ["Mobile", "Desktop"] },
    ]
  },
  "Elixir": {
    color: "bg-fuchsia-100 text-fuchsia-800 border-fuchsia-200",
    dot: "bg-fuchsia-400",
    frameworks: [
      { name: "Phoenix", supported: true, tags: ["Full Stack", "Real-time"] },
      { name: "Plug", supported: true, tags: ["Backend", "Minimal"] },
      { name: "Absinthe (GraphQL)", supported: false, tags: ["Backend", "GraphQL"] },
    ]
  },
  "Others": {
    color: "bg-gray-100 text-gray-700 border-gray-200",
    dot: "bg-gray-400",
    frameworks: [
      { name: "Swift (Vapor)", supported: true, tags: ["Backend"] },
      { name: "Dart (Shelf)", supported: true, tags: ["Backend"] },
      { name: "Scala (Play)", supported: true, tags: ["Backend"] },
      { name: "Haskell (Servant)", supported: true, tags: ["Backend"] },
      { name: "Clojure (Ring)", supported: true, tags: ["Backend"] },
      { name: "Perl (Dancer2)", supported: true, tags: ["Backend"] },
      { name: "R (Plumber)", supported: true, tags: ["Backend", "Data"] },
      { name: "Julia (Genie.jl)", supported: true, tags: ["Backend", "Data"] },
      { name: "Crystal (Kemal)", supported: true, tags: ["Backend"] },
      { name: "Zig (Zap)", supported: true, tags: ["Backend"] },
    ]
  },
}

const databases = [
  { name: "PostgreSQL", supported: true },
  { name: "MySQL", supported: true },
  { name: "MongoDB", supported: true },
  { name: "SQLite", supported: true },
  { name: "Redis", supported: true },
  { name: "Supabase", supported: true },
  { name: "Neon (Serverless PG)", supported: true },
  { name: "PlanetScale", supported: true },
  { name: "Cloudflare D1", supported: true },
  { name: "SQL Server", supported: true },
  { name: "Oracle", supported: false },
  { name: "Cassandra", supported: false },
  { name: "DynamoDB", supported: false },
  { name: "CockroachDB", supported: false },
  { name: "Firebase", supported: false },
]

const tools = [
  { name: "Docker + docker-compose", supported: true },
  { name: "GitHub Actions CI", supported: true },
  { name: "GitLab CI", supported: true },
  { name: "VS Code Dev Container", supported: true },
  { name: "Redis (Cache/Queue)", supported: true },
  { name: "MinIO (S3)", supported: true },
  { name: "Meilisearch", supported: true },
  { name: "Nginx (Reverse Proxy)", supported: true },
  { name: "Prometheus + Grafana", supported: false },
  { name: "Kubernetes configs", supported: false },
  { name: "Terraform", supported: false },
  { name: "Jenkins CI", supported: false },
]

export default function StacksPage() {
  const [search, setSearch] = useState("")
  const [requestText, setRequestText] = useState("")
  const [submitted, setSubmitted] = useState(false)
  const [submitting, setSubmitting] = useState(false)

  const totalSupported = Object.values(stacks).reduce((acc, s) =>
    acc + s.frameworks.filter(f => f.supported).length, 0)
  const totalFrameworks = Object.values(stacks).reduce((acc, s) => acc + s.frameworks.length, 0)

  const handleRequest = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!requestText.trim()) return
    setSubmitting(true)
    try {
      await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: `request:${requestText}`, type: "stack_request" }),
      })
      setSubmitted(true)
      setRequestText("")
    } finally {
      setSubmitting(false)
    }
  }

  const filterFn = (name: string) =>
    !search || name.toLowerCase().includes(search.toLowerCase())

  return (
    <div className="container mx-auto px-4 py-12 max-w-7xl">
      {/* Header */}
      <div className="text-center mb-10">
        <h1 className="text-4xl font-bold mb-3">Supported Stacks</h1>
        <p className="text-muted-foreground text-lg mb-2">
          <span className="font-semibold text-foreground">{totalSupported}</span> frameworks supported across{" "}
          <span className="font-semibold text-foreground">{Object.keys(stacks).length}</span> languages
        </p>
        <p className="text-sm text-muted-foreground">
          ✅ Supported &nbsp;·&nbsp; 📋 Coming soon (vote to prioritize)
        </p>
      </div>

      {/* Search */}
      <div className="relative max-w-sm mx-auto mb-10">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search framework..."
          className="pl-9"
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
      </div>

      {/* Frameworks by language */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 mb-12">
        {Object.entries(stacks).map(([lang, data]) => {
          const filtered = data.frameworks.filter(f => filterFn(f.name))
          if (!filtered.length) return null
          return (
            <Card key={lang} className="overflow-hidden">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-base">
                  <span className={`w-2.5 h-2.5 rounded-full ${data.dot}`} />
                  {lang}
                  <span className="ml-auto text-xs text-muted-foreground font-normal">
                    {data.frameworks.filter(f => f.supported).length}/{data.frameworks.length}
                  </span>
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="space-y-1.5">
                  {filtered.map(fw => (
                    <div key={fw.name} className={`flex items-center gap-2 py-1 px-2 rounded-md text-sm
                      ${fw.supported ? "opacity-100" : "opacity-50"}`}>
                      {fw.supported
                        ? <Check className="h-3.5 w-3.5 text-green-500 flex-shrink-0" />
                        : <span className="text-xs flex-shrink-0">📋</span>}
                      <span className={fw.supported ? "" : "text-muted-foreground"}>{fw.name}</span>
                      <div className="ml-auto flex gap-1 flex-wrap justify-end">
                        {fw.tags.slice(0, 1).map(t => (
                          <span key={t} className={`text-xs px-1.5 py-0.5 rounded border ${data.color}`}>{t}</span>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Databases + Tools */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
        <Card>
          <CardHeader><CardTitle className="text-base">🗄️ Databases</CardTitle></CardHeader>
          <CardContent className="pt-0">
            <div className="grid grid-cols-2 gap-1">
              {databases.filter(d => filterFn(d.name)).map(db => (
                <div key={db.name} className={`flex items-center gap-2 py-1 text-sm ${db.supported ? "" : "opacity-50"}`}>
                  {db.supported ? <Check className="h-3.5 w-3.5 text-green-500 flex-shrink-0" /> : <span className="text-xs">📋</span>}
                  <span className={db.supported ? "" : "text-muted-foreground"}>{db.name}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle className="text-base">🔧 DevOps Tools</CardTitle></CardHeader>
          <CardContent className="pt-0">
            <div className="space-y-1">
              {tools.filter(t => filterFn(t.name)).map(tool => (
                <div key={tool.name} className={`flex items-center gap-2 py-1 text-sm ${tool.supported ? "" : "opacity-50"}`}>
                  {tool.supported ? <Check className="h-3.5 w-3.5 text-green-500 flex-shrink-0" /> : <span className="text-xs">📋</span>}
                  <span className={tool.supported ? "" : "text-muted-foreground"}>{tool.name}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Request form */}
      <Card className="max-w-xl mx-auto border-dashed">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <Plus className="h-4 w-4" /> Request a Stack
          </CardTitle>
          <p className="text-sm text-muted-foreground">
            Missing something? Tell us what you need — most requested get built first.
          </p>
        </CardHeader>
        <CardContent>
          {submitted ? (
            <div className="text-center py-4">
              <p className="text-green-600 font-medium">✅ Submitted! We&apos;ll prioritize based on requests.</p>
              <Button variant="ghost" size="sm" className="mt-2" onClick={() => setSubmitted(false)}>
                Request another
              </Button>
            </div>
          ) : (
            <form onSubmit={handleRequest} className="flex gap-2">
              <Input
                placeholder="e.g. Bun + Hono + Drizzle, Deno + Oak..."
                value={requestText}
                onChange={e => setRequestText(e.target.value)}
                className="flex-1"
                required
              />
              <Button type="submit" disabled={submitting}>
                {submitting ? "..." : "Request"}
              </Button>
            </form>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
