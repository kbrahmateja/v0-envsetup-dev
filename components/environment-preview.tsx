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
}

export default function EnvironmentPreview({ projectData, onDownloadZip }: EnvironmentPreviewProps) {
  const [copied, setCopied] = useState(false)

  // This preview used to hand-roll its own file tree, package.json, and
  // README - all independent guesses that didn't call the same functions
  // app/api/generate-deployment/route.ts uses for the actual ZIP. That's
  // how a user could uncheck "Docker" and still get a Dockerfile: the
  // preview's file tree hid Dockerfile/docker-compose.yml behind that
  // checkbox, while the real route always includes them unconditionally.
  // The package.json tab was worse - EnvSetup doesn't generate a
  // package.json at all, so that tab was previewing a file that would
  // never actually be in the download. Calling the real generator
  // functions here means the preview can't drift from reality again.
  const toolFiles = generateToolFiles(projectData)

  const generateFileStructure = () => {
    // Mirrors app/api/generate-deployment/route.ts exactly: these five are
    // unconditional, everything else comes from the same generateToolFiles()
    // call the real ZIP uses.
    const structure = [
      `${projectData.projectName}/`,
      "├── Dockerfile",
      "├── docker-compose.yml",
      "├── .env.example",
      "├── README.md",
      "├── .gitignore",
    ]
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

  const handleDownload = (type: "zip" | "github" | "cli") => {
    trackDownload(type, `${projectData.language}-${projectData.framework || "basic"}`)

    if (type === "zip") {
      if (onDownloadZip) {
        onDownloadZip()
      } else {
        console.log("Downloading ZIP...")
      }
    } else if (type === "github") {
      // In a real app, this would create a GitHub repo
      console.log("Creating GitHub repository...")
    } else if (type === "cli") {
      // In a real app, this would show CLI instructions
      console.log("Showing CLI instructions...")
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
                <div className="font-semibold">Use CLI</div>
                <div className="text-xs opacity-75">Generate with our CLI tool</div>
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
