"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Copy, Download, Github, Terminal } from "lucide-react"
import { trackDownload } from "@/lib/gtag"
import { generateDockerfile, generateReadme, generateToolFiles, type EnvironmentConfig } from "@/lib/deployment-config"

interface EnvironmentPreviewProps {
  projectData: EnvironmentConfig
  // Real ZIP download handler, wired in by the results page. Optional so
  // this component still renders (falling back to a console.log stub)
  // if ever reused somewhere that hasn't wired a real download yet.
  onDownloadZip?: () => void | Promise<void>
  // Opens the results page's GithubPushDialog. "Push to GitHub" used to
  // just console.log("Creating GitHub repository...") - a user asked what
  // was going on with these buttons alongside the working ZIP download, and
  // this (plus the real /api/github/create-repo route) is the actual fix.
  onPushToGithub?: () => void
}

export default function EnvironmentPreview({ projectData, onDownloadZip, onPushToGithub }: EnvironmentPreviewProps) {
  const [copied, setCopied] = useState(false)
  const [cliCopied, setCliCopied] = useState(false)

  // This preview used to hand-roll its own file tree, package.json, and
  // README - all independent guesses that didn't call the same functions
  // app/api/generate-deployment/route.ts uses for the actual ZIP. That's
  // how a user could uncheck "Docker" and still get a Dockerfile: the
  // preview's file tree hid Dockerfile/docker-compose.yml behind that
  // checkbox, while the real route (at the time) always included them
  // unconditionally regardless. That's fixed on both sides now: the route
  // really does skip Dockerfile/docker-compose.yml/.gitignore when "docker"/
  // "git" aren't selected, and this preview mirrors that same condition
  // instead of guessing. The package.json tab was removed entirely -
  // EnvSetup doesn't generate a package.json at all.
  const toolFiles = generateToolFiles(projectData)
  const hasDocker = projectData.tools.includes("docker")
  const hasGit = projectData.tools.includes("git")

  const generateFileStructure = () => {
    // Mirrors app/api/generate-deployment/route.ts exactly: Dockerfile/
    // docker-compose.yml only when "docker" is checked, .gitignore only
    // when "git" is checked, .env.example/README.md always, everything
    // else from the same generateToolFiles() call the real ZIP uses.
    const structure = [`${projectData.projectName}/`]
    if (hasDocker) {
      structure.push("├── Dockerfile", "├── docker-compose.yml")
    }
    structure.push("├── .env.example", "├── README.md")
    if (hasGit) {
      structure.push("├── .gitignore")
    }
    for (const path of Object.keys(toolFiles)) {
      structure.push(`├── ${path}`)
    }
    return structure.join("\n")
  }

  const copyToClipboard = async (text: string) => {
    await navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  // The actual, currently-published `envsetup init` command is fully
  // interactive (@clack/prompts) - it takes no --name/--language/--framework
  // flags, so a pre-filled command would just error with "unknown option".
  // This is the real command; it can't be pre-filled from the web form's
  // choices until the CLI itself grows flags for that.
  const cliCommand = "npx @envsetup/cli init"

  const handleDownload = (type: "zip" | "github" | "cli") => {
    trackDownload(type, `${projectData.language}-${projectData.framework || "basic"}`)

    if (type === "zip") {
      if (onDownloadZip) {
        onDownloadZip()
      } else {
        console.log("Downloading ZIP...")
      }
    } else if (type === "github") {
      if (onPushToGithub) {
        onPushToGithub()
      } else {
        console.log("Creating GitHub repository...")
      }
    } else if (type === "cli") {
      navigator.clipboard.writeText(cliCommand)
      setCliCopied(true)
      setTimeout(() => setCliCopied(false), 2000)
    }
  }

  return (
    <div className="space-y-8">
      {/* Project Overview */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            {projectData.projectName}
            <div className="flex gap-2">
              <Badge variant="secondary">{projectData.language}</Badge>
              {projectData.framework && <Badge variant="outline">{projectData.framework}</Badge>}
            </div>
          </CardTitle>
          {projectData.description && <CardDescription>{projectData.description}</CardDescription>}
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            {projectData.tools.map((tool) => (
              <Badge key={tool} variant="secondary" className="text-xs">
                {tool}
              </Badge>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Download Options */}
      <Card>
        <CardHeader>
          <CardTitle>Download Your Environment</CardTitle>
          <CardDescription>Choose how you&apos;d like to get your development environment</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Button onClick={() => handleDownload("zip")} className="h-auto p-4 flex flex-col items-center gap-2">
              <Download className="w-6 h-6" />
              <div className="text-center">
                <div className="font-semibold">Download ZIP</div>
                <div className="text-xs opacity-75">Get all files in a ZIP archive</div>
              </div>
            </Button>

            <Button
              onClick={() => handleDownload("github")}
              variant="outline"
              className="h-auto p-4 flex flex-col items-center gap-2"
            >
              <Github className="w-6 h-6" />
              <div className="text-center">
                <div className="font-semibold">Push to GitHub</div>
                <div className="text-xs opacity-75">Create a new repository</div>
              </div>
            </Button>

            <Button
              onClick={() => handleDownload("cli")}
              variant="outline"
              className="h-auto p-4 flex flex-col items-center gap-2"
            >
              <Terminal className="w-6 h-6" />
              <div className="text-center">
                <div className="font-semibold">{cliCopied ? "Command copied!" : "Use CLI"}</div>
                <div className="text-xs opacity-75">{cliCopied ? cliCommand : "Copies the CLI command"}</div>
              </div>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* File Preview */}
      <Card>
        <CardHeader>
          <CardTitle>File Structure & Configuration</CardTitle>
          <CardDescription>Preview of the files and structure that will be generated</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="structure" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="structure">File Structure</TabsTrigger>
              <TabsTrigger value="dockerfile">Dockerfile</TabsTrigger>
              <TabsTrigger value="readme">README.md</TabsTrigger>
            </TabsList>

            <TabsContent value="structure" className="mt-4">
              <div className="relative">
                <pre className="bg-muted p-4 rounded-lg text-sm overflow-x-auto">
                  <code>{generateFileStructure()}</code>
                </pre>
                <Button
                  size="sm"
                  variant="outline"
                  className="absolute top-2 right-2 bg-transparent"
                  onClick={() => copyToClipboard(generateFileStructure())}
                >
                  <Copy className="w-4 h-4" />
                  {copied ? "Copied!" : "Copy"}
                </Button>
              </div>
            </TabsContent>

            <TabsContent value="dockerfile" className="mt-4">
              <div className="relative">
                {!hasDocker && (
                  <p className="text-xs text-muted-foreground mb-2">
                    The &quot;Docker&quot; tool isn&apos;t checked, so this file won&apos;t be in your download. Shown here as a preview only.
                  </p>
                )}
                <pre className="bg-muted p-4 rounded-lg text-sm overflow-x-auto">
                  <code>{generateDockerfile(projectData)}</code>
                </pre>
                <Button
                  size="sm"
                  variant="outline"
                  className="absolute top-2 right-2 bg-transparent"
                  onClick={() => copyToClipboard(generateDockerfile(projectData))}
                >
                  <Copy className="w-4 h-4" />
                  {copied ? "Copied!" : "Copy"}
                </Button>
              </div>
            </TabsContent>

            <TabsContent value="readme" className="mt-4">
              <div className="relative">
                <pre className="bg-muted p-4 rounded-lg text-sm overflow-x-auto">
                  <code>{generateReadme(projectData)}</code>
                </pre>
                <Button
                  size="sm"
                  variant="outline"
                  className="absolute top-2 right-2 bg-transparent"
                  onClick={() => copyToClipboard(generateReadme(projectData))}
                >
                  <Copy className="w-4 h-4" />
                  {copied ? "Copied!" : "Copy"}
                </Button>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}
