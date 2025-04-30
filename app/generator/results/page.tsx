"use client"

import { useEffect, useState } from "react"
import { useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Check, Download, Github, Terminal } from "lucide-react"
import { EnvironmentPreview } from "@/components/environment-preview"

export default function ResultsPage() {
  const searchParams = useSearchParams()
  const [formData, setFormData] = useState<any>(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const data = searchParams.get("data")
    if (data) {
      try {
        setFormData(JSON.parse(decodeURIComponent(data)))
      } catch (error) {
        console.error("Failed to parse form data:", error)
      }
    }
  }, [searchParams])

  const handleDownload = () => {
    setLoading(true)
    // Simulate file download
    setTimeout(() => {
      alert("Files downloaded successfully!")
      setLoading(false)
    }, 2000)
  }

  const handlePushToGitHub = () => {
    alert("Pushing to GitHub is not implemented yet!")
  }

  const handleCopyCLICommand = () => {
    navigator.clipboard.writeText("your-cli-command-here")
    alert("CLI command copied to clipboard!")
  }

  if (!formData) {
    return (
      <div className="container py-10">
        <div className="mx-auto max-w-4xl text-center">
          <h1 className="text-3xl font-bold">Loading environment details...</h1>
        </div>
      </div>
    )
  }

  return (
    <div className="container py-10">
      <div className="mx-auto max-w-4xl">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">Your Environment is Ready!</h1>
          <p className="mt-4 text-muted-foreground md:text-xl">
            Your development environment has been generated based on your specifications.
          </p>
        </div>

        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Environment Summary</CardTitle>
            <CardDescription>Here's a summary of your generated development environment.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h3 className="font-medium mb-2">Tech Stack</h3>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Language:</span>
                    <span className="font-medium">{formData.language}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Framework:</span>
                    <span className="font-medium">{formData.framework}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Package Manager:</span>
                    <span className="font-medium">{formData.packageManager}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Environment Type:</span>
                    <span className="font-medium">{formData.environment}</span>
                  </div>
                </div>
              </div>
              <div>
                <h3 className="font-medium mb-2">Included Features</h3>
                <div className="flex flex-wrap gap-2">
                  {formData.dependencies && formData.dependencies.length > 0 ? (
                    formData.dependencies.map((dep: string) => (
                      <Badge key={dep} variant="secondary">
                        {dep}
                      </Badge>
                    ))
                  ) : (
                    <span className="text-muted-foreground">No dependencies selected</span>
                  )}
                </div>

                <h3 className="font-medium mt-4 mb-2">DevOps Integration</h3>
                <div className="flex flex-wrap gap-2">
                  {formData.devOps && formData.devOps.length > 0 ? (
                    formData.devOps.map((tool: string) => (
                      <Badge key={tool} variant="outline">
                        {tool}
                      </Badge>
                    ))
                  ) : (
                    <span className="text-muted-foreground">No DevOps tools selected</span>
                  )}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Tabs defaultValue="preview">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="preview">Preview</TabsTrigger>
            <TabsTrigger value="files">Files</TabsTrigger>
            <TabsTrigger value="instructions">Instructions</TabsTrigger>
          </TabsList>
          <TabsContent value="preview" className="p-4 border rounded-md mt-4">
            <EnvironmentPreview formData={formData} />
          </TabsContent>
          <TabsContent value="files" className="p-4 border rounded-md mt-4">
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Generated Files</h3>
              <div className="space-y-2">
                <div className="flex items-center p-2 border rounded-md">
                  <Check className="h-4 w-4 text-green-500 mr-2" />
                  <span>README.md</span>
                </div>
                <div className="flex items-center p-2 border rounded-md">
                  <Check className="h-4 w-4 text-green-500 mr-2" />
                  {formData.environment === "docker"
                    ? "Dockerfile"
                    : formData.environment === "devcontainer"
                      ? ".devcontainer/devcontainer.json"
                      : formData.environment === "gitpod"
                        ? ".gitpod.yml"
                        : formData.environment === "local"
                          ? "setup.sh"
                          : "devbox.json"}
                </div>
                {formData.devOps && formData.devOps.includes("github-actions") && (
                  <div className="flex items-center p-2 border rounded-md">
                    <Check className="h-4 w-4 text-green-500 mr-2" />
                    <span>.github/workflows/ci.yml</span>
                  </div>
                )}
                {formData.devOps && formData.devOps.includes("gitlab-ci") && (
                  <div className="flex items-center p-2 border rounded-md">
                    <Check className="h-4 w-4 text-green-500 mr-2" />
                    <span>.gitlab-ci.yml</span>
                  </div>
                )}
                {formData.devOps && formData.devOps.includes("docker-compose") && (
                  <div className="flex items-center p-2 border rounded-md">
                    <Check className="h-4 w-4 text-green-500 mr-2" />
                    <span>docker-compose.yml</span>
                  </div>
                )}
                <div className="flex items-center p-2 border rounded-md">
                  <Check className="h-4 w-4 text-green-500 mr-2" />
                  <span>src/ (Project source files)</span>
                </div>
              </div>
            </div>
          </TabsContent>
          <TabsContent value="instructions" className="p-4 border rounded-md mt-4">
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Setup Instructions</h3>
              <div className="space-y-4">
                <div>
                  <h4 className="font-medium">1. Download the environment</h4>
                  <p className="text-muted-foreground mt-1">
                    Download the generated environment files to your local machine.
                  </p>
                </div>
                <div>
                  <h4 className="font-medium">2. Extract the files</h4>
                  <p className="text-muted-foreground mt-1">
                    Extract the downloaded ZIP file to your desired project location.
                  </p>
                </div>
                <div>
                  <h4 className="font-medium">3. Set up the environment</h4>
                  <p className="text-muted-foreground mt-1">
                    {formData.environment === "docker"
                      ? "Run 'docker build -t my-project .' to build the Docker image, then 'docker run -p 3000:3000 my-project' to start the container."
                      : formData.environment === "devcontainer"
                        ? "Open the folder in VS Code and click 'Reopen in Container' when prompted."
                        : formData.environment === "gitpod"
                          ? "Push the repository to GitHub and open it in GitPod."
                          : formData.environment === "local"
                            ? "Run './setup.sh' to set up your local environment."
                            : "Follow the instructions in the README.md file to set up your cloud-hosted devbox."}
                  </p>
                </div>
                <div>
                  <h4 className="font-medium">4. Start developing</h4>
                  <p className="text-muted-foreground mt-1">
                    Your environment is now ready for development. Refer to the README.md for more details.
                  </p>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>

        <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
          <Button className="flex items-center gap-2" onClick={handleDownload} disabled={loading}>
            <Download className="h-4 w-4" />
            {loading ? "Downloading..." : "Download Files"}
          </Button>
          <Button variant="outline" className="flex items-center gap-2" onClick={handlePushToGitHub}>
            <Github className="h-4 w-4" />
            Push to GitHub
          </Button>
          <Button variant="outline" className="flex items-center gap-2" onClick={handleCopyCLICommand}>
            <Terminal className="h-4 w-4" />
            Copy CLI Command
          </Button>
        </div>
      </div>
    </div>
  )
}
