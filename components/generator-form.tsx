"use client"

import type React from "react"

import { useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { trackEnvironmentGeneration } from "@/lib/gtag"
import { Bot } from "lucide-react"
import Link from "next/link"
import { languages, frameworks, sanitizeLanguage, sanitizeFramework } from "@/lib/stacks"

// Re-exported for backward compatibility - components/generator-form.test.ts
// imports sanitizeLanguage/sanitizeFramework from this module. The actual
// catalog + validation now live in lib/stacks.ts so the AI assistant
// (app/api/ai-assistant/route.ts) can reuse the same source of truth.
export { sanitizeLanguage, sanitizeFramework }

// Tools available for every language.
//
// "Docker" and "Git" used to be listed here as checkboxes that did nothing -
// app/api/generate-deployment/route.ts unconditionally added Dockerfile/
// docker-compose.yml/.gitignore to every download regardless of what was
// checked. Unchecking "Docker" still produced a Dockerfile, which a user
// correctly flagged as a bug. That's now fixed by actually gating those
// files on these two checkboxes in the route - see route.ts. Checked by
// default (DEFAULT_TOOLS below) since most visitors come here specifically
// for the Docker setup.
const universalTools = [
  { id: "docker", label: "Docker (Dockerfile + docker-compose.yml)" },
  { id: "git", label: "Git (.gitignore)" },
  { id: "github-actions", label: "GitHub Actions" },
]

// Checked by default on a fresh form, so the common case (visitor picks a
// language and clicks Generate without touching any checkbox) still gets
// the Docker setup this site exists to produce. Templates/AI-assistant
// hand-offs still get to override with an explicit tools param.
const DEFAULT_TOOLS = ["docker", "git"]

// Infrastructure tools — language-agnostic, shown as a separate section.
const infraTools = [
  { id: "kubernetes", label: "Kubernetes" },
  { id: "nginx",      label: "Nginx" },
  { id: "traefik",    label: "Traefik" },
  { id: "kafka",      label: "Apache Kafka" },
  { id: "rabbitmq",   label: "RabbitMQ" },
  { id: "redis-infra", label: "Redis (cache)" },
  { id: "helm",       label: "Helm" },
  { id: "argo-cd",    label: "ArgoCD" },
]

// Tools only meaningful for specific languages — shown in addition to the
// universal ones once a matching language is selected.
const toolsByLanguage: Record<string, { id: string; label: string }[]> = {
  javascript: [
    { id: "eslint", label: "ESLint" },
    { id: "prettier", label: "Prettier" },
    { id: "jest", label: "Jest" },
    { id: "cypress", label: "Cypress" },
    { id: "husky", label: "Husky" },
  ],
  typescript: [
    { id: "eslint", label: "ESLint" },
    { id: "prettier", label: "Prettier" },
    { id: "jest", label: "Jest" },
    { id: "cypress", label: "Cypress" },
    { id: "husky", label: "Husky" },
  ],
  python: [
    { id: "black", label: "Black (formatter)" },
    { id: "pytest", label: "Pytest" },
  ],
  java: [{ id: "junit", label: "JUnit" }],
  csharp: [{ id: "nunit", label: "NUnit" }],
  go: [{ id: "golangci-lint", label: "golangci-lint" }],
  rust: [{ id: "clippy", label: "Clippy" }],
  ruby: [{ id: "rspec", label: "RSpec" }],
  php: [{ id: "phpunit", label: "PHPUnit" }],
}

function getAvailableTools(language: string) {
  return [...universalTools, ...(toolsByLanguage[language] ?? [])]
}

export default function GeneratorForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  
  // Pre-fill from URL params (from templates page or AI assistant)
  const getInitialData = () => {
    const templateParam = searchParams?.get("template")
    if (templateParam) {
      try {
        const t = JSON.parse(decodeURIComponent(templateParam))
        const langMap: Record<string, string> = {
          "JavaScript": "javascript", "TypeScript": "typescript", "Python": "python",
          "Java": "java", "Go": "go", "PHP": "php", "Ruby": "ruby"
        }
        const firstTag = t.tags?.[0] || ""
        const language = sanitizeLanguage(langMap[firstTag] || searchParams?.get("language"))
        const framework = sanitizeFramework(language, t.tags?.[1] || searchParams?.get("framework"))
        return {
          projectName: t.name?.toLowerCase().replace(/[^a-z0-9]+/g, "-") || "",
          language,
          framework,
          description: t.description || "",
          tools: [...DEFAULT_TOOLS] as string[],
        }
      } catch { /* ignore */ }
    }
    const language = sanitizeLanguage(searchParams?.get("language"))
    const framework = sanitizeFramework(language, searchParams?.get("framework"))
    return {
      projectName: searchParams?.get("projectName") || "",
      language,
      framework,
      description: searchParams?.get("description") || "",
      tools: [...DEFAULT_TOOLS] as string[],
    }
  }

  const [formData, setFormData] = useState(getInitialData)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    // Track the environment generation
    trackEnvironmentGeneration(formData.language, formData.framework)

    // Navigate to results page with form data
    const params = new URLSearchParams({
      projectName: formData.projectName,
      language: formData.language,
      framework: formData.framework || "",
      description: formData.description,
      tools: formData.tools.join(","),
    })

    router.push(`/generator/results?${params.toString()}`)
  }

  const handleToolChange = (toolId: string, checked: boolean) => {
    setFormData((prev) => ({
      ...prev,
      tools: checked ? [...prev.tools, toolId] : prev.tools.filter((t) => t !== toolId),
    }))
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Project Configuration</CardTitle>
        <CardDescription>
          Tell us about your project and we&apos;ll generate the perfect development environment
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="projectName">Project Name</Label>
              <Input
                id="projectName"
                placeholder="my-awesome-project"
                value={formData.projectName}
                onChange={(e) => setFormData((prev) => ({ ...prev, projectName: e.target.value }))}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="language">Programming Language</Label>
              <Select
                value={formData.language}
                onValueChange={(value) =>
                  setFormData((prev) => {
                    const availableIds = new Set(getAvailableTools(value).map((t) => t.id))
                    return {
                      ...prev,
                      language: value,
                      framework: "",
                      tools: prev.tools.filter((t) => availableIds.has(t)),
                    }
                  })
                }
                required
              >
                <SelectTrigger id="language">
                  <SelectValue placeholder="Select a language" />
                </SelectTrigger>
                <SelectContent>
                  {languages.map((lang) => (
                    <SelectItem key={lang.value} value={lang.value}>
                      {lang.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {formData.language && frameworks[formData.language as keyof typeof frameworks] && (
            <div className="space-y-2">
              <Label htmlFor="framework">Framework (Optional)</Label>
              <Select
                value={formData.framework}
                onValueChange={(value) => setFormData((prev) => ({ ...prev, framework: value }))}
              >
                <SelectTrigger id="framework">
                  <SelectValue placeholder="Select a framework" />
                </SelectTrigger>
                <SelectContent>
                  {frameworks[formData.language as keyof typeof frameworks].map((framework) => (
                    <SelectItem key={framework} value={framework.toLowerCase()}>
                      {framework}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="description">Project Description (Optional)</Label>
            <Textarea
              id="description"
              placeholder="Describe your project..."
              value={formData.description}
              onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))}
              rows={3}
            />
          </div>

          <div className="space-y-4">
            <Label>Development Tools</Label>
            {!formData.language && (
              <p className="text-xs text-muted-foreground">Pick a language above to see language-specific tools.</p>
            )}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {getAvailableTools(formData.language).map((tool) => (
                <div key={tool.id} className="flex items-center space-x-2">
                  <Checkbox
                    id={tool.id}
                    checked={formData.tools.includes(tool.id)}
                    onCheckedChange={(checked) => handleToolChange(tool.id, checked as boolean)}
                  />
                  <Label htmlFor={tool.id} className="text-sm font-normal">
                    {tool.label}
                  </Label>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-4">
            <Label>Infrastructure & Messaging</Label>
            <p className="text-xs text-muted-foreground">Generates ready-to-use config files (k8s manifests, nginx.conf, kafka-compose.yml, etc.)</p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {infraTools.map((tool) => (
                <div key={tool.id} className="flex items-center space-x-2">
                  <Checkbox
                    id={tool.id}
                    checked={formData.tools.includes(tool.id)}
                    onCheckedChange={(checked) => handleToolChange(tool.id, checked as boolean)}
                  />
                  <Label htmlFor={tool.id} className="text-sm font-normal">
                    {tool.label}
                  </Label>
                </div>
              ))}
            </div>
          </div>

          <div className="flex gap-3">
            <Button type="submit" className="flex-1" size="lg">
              Generate Environment
            </Button>
            <Button type="button" variant="outline" size="lg" asChild>
              <Link href="/ai-assistant">
                <Bot className="h-4 w-4 mr-2" />
                Get AI Help
              </Link>
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
