"use client"

import { useState } from "react"
import { useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Download, Github, Terminal, Cloud } from "lucide-react"
import EnvironmentPreview from "@/components/environment-preview"
import { Suspense } from "react"
import type { EnvironmentConfig } from "@/lib/deployment-config"
import { DeploymentDialog } from "@/components/deployment-dialog"

function ResultsContent() {
  const searchParams = useSearchParams()
  const [showDeployment, setShowDeployment] = useState(false)

  const projectData = {
    projectName: searchParams.get("projectName") || "",
    language: searchParams.get("language") || "",
    framework: searchParams.get("framework") || "",
    description: searchParams.get("description") || "",
    tools: searchParams.get("tools")?.split(",").filter(Boolean) || [],
  }

  const envConfig: EnvironmentConfig = {
    projectName: projectData.projectName,
    language: projectData.language,
    framework: projectData.framework,
    databases: [],
    tools: projectData.tools,
    serverType: "local",
    description: projectData.description,
  }

  const handleDownload = async () => {
    try {
      const response = await fetch("/api/generate-deployment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(envConfig),
      })

      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = `${envConfig.projectName}-environment.zip`
      a.click()
    } catch (error) {
      console.error("Download failed:", error)
    }
  }

  return (
    <>
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold mb-4">Your Environment is Ready!</h1>
            <p className="text-xl text-muted-foreground">
              Here's your customized development environment for {projectData.projectName}
            </p>
          </div>

          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Environment Summary</CardTitle>
              <CardDescription>Configuration details for your development environment</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-medium mb-3">Tech Stack</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Language:</span>
                      <span className="font-medium capitalize">{projectData.language}</span>
                    </div>
                    {projectData.framework && (
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Framework:</span>
                        <span className="font-medium capitalize">{projectData.framework}</span>
                      </div>
                    )}
                  </div>
                </div>
                <div>
                  <h3 className="font-medium mb-3">Development Tools</h3>
                  <div className="flex flex-wrap gap-2">
                    {projectData.tools.length > 0 ? (
                      projectData.tools.map((tool) => (
                        <Badge key={tool} variant="secondary">
                          {tool}
                        </Badge>
                      ))
                    ) : (
                      <span className="text-sm text-muted-foreground">No tools selected</span>
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <EnvironmentPreview projectData={projectData} />

          <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
            <Button onClick={handleDownload} className="flex items-center gap-2">
              <Download className="h-4 w-4" />
              Download ZIP
            </Button>
            <Button onClick={() => setShowDeployment(true)} variant="outline" className="flex items-center gap-2">
              <Cloud className="h-4 w-4" />
              Deploy to Server
            </Button>
            <Button variant="outline" className="flex items-center gap-2 bg-transparent">
              <Github className="h-4 w-4" />
              Push to GitHub
            </Button>
            <Button variant="outline" className="flex items-center gap-2 bg-transparent">
              <Terminal className="h-4 w-4" />
              Copy CLI Command
            </Button>
          </div>
        </div>
      </div>

      <DeploymentDialog open={showDeployment} onOpenChange={setShowDeployment} config={envConfig} />
    </>
  )
}

export default function ResultsPage() {
  return (
    <Suspense
      fallback={
        <div className="container py-10">
          <div className="mx-auto max-w-4xl text-center">
            <h1 className="text-3xl font-bold">Loading environment details...</h1>
          </div>
        </div>
      }
    >
      <ResultsContent />
    </Suspense>
  )
}
