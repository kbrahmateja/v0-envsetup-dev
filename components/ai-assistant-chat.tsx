"use client"

import { useChat } from "@ai-sdk/react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Bot, User, Loader2, Send, Download, Cloud, Server, Laptop, ArrowRight } from "lucide-react"
import { useState } from "react"
import { useRouter } from "next/navigation"
import type { EnvironmentConfig } from "@/lib/deployment-config"
import { DeploymentDialog } from "./deployment-dialog"

export function AIAssistantChat() {
  const router = useRouter()
  const [envConfig, setEnvConfig] = useState<EnvironmentConfig | null>(null)
  const [showDeployment, setShowDeployment] = useState(false)

  const { messages, input, setInput, handleSubmit, status } = useChat({
    api: "/api/ai-assistant",
    maxSteps: 10,
    async onToolCall({ toolCall }) {
      // Handle tool calls from the AI
      if (toolCall.toolName === "generateEnvironmentConfig") {
        const config = toolCall.args as EnvironmentConfig
        setEnvConfig(config)
      }
    },
  })

  const handleDownload = async () => {
    if (!envConfig) return

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

  const handleUseInGenerator = () => {
    if (!envConfig) return

    const params = new URLSearchParams({
      projectName: envConfig.projectName,
      language: envConfig.language,
      framework: envConfig.framework || "",
      description: envConfig.description || "",
      tools: envConfig.tools.join(","),
    })

    router.push(`/generator?${params.toString()}`)
  }

  const getServerIcon = (type: string) => {
    switch (type) {
      case "cloud":
        return <Cloud className="h-4 w-4" />
      case "dedicated":
        return <Server className="h-4 w-4" />
      case "local":
        return <Laptop className="h-4 w-4" />
      default:
        return null
    }
  }

  return (
    <>
      <Card className="h-[600px] flex flex-col">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bot className="h-5 w-5" />
            AI Environment Assistant
          </CardTitle>
          <CardDescription>Tell me about your project and I'll help you set up the perfect environment</CardDescription>
        </CardHeader>
        <CardContent className="flex-1 flex flex-col gap-4 p-0">
          <ScrollArea className="flex-1 px-6">
            <div className="space-y-4 pb-4">
              {messages.length === 0 && (
                <div className="text-center text-muted-foreground py-8">
                  <Bot className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p className="text-sm">Start by telling me about your project!</p>
                  <p className="text-xs mt-2">For example: "I'm building a web app with React and PostgreSQL"</p>
                </div>
              )}

              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex gap-3 ${message.role === "user" ? "justify-end" : "justify-start"}`}
                >
                  {message.role === "assistant" && (
                    <div className="h-8 w-8 rounded-full bg-primary flex items-center justify-center flex-shrink-0">
                      <Bot className="h-4 w-4 text-primary-foreground" />
                    </div>
                  )}
                  <div
                    className={`rounded-lg px-4 py-2 max-w-[80%] ${
                      message.role === "user" ? "bg-primary text-primary-foreground" : "bg-muted"
                    }`}
                  >
                    <div className="text-sm whitespace-pre-wrap">{message.content}</div>

                    {/* Show tool calls */}
                    {message.parts?.map((part, idx) => {
                      if (part.type === "tool-invocation") {
                        const { toolInvocation } = part
                        if (
                          toolInvocation.state === "call" &&
                          toolInvocation.toolName !== "generateEnvironmentConfig"
                        ) {
                          return (
                            <div key={idx} className="text-xs mt-2 opacity-70 flex items-center gap-1">
                              <Loader2 className="h-3 w-3 animate-spin" />
                              Searching {toolInvocation.toolName}...
                            </div>
                          )
                        }
                      }
                      return null
                    })}
                  </div>
                  {message.role === "user" && (
                    <div className="h-8 w-8 rounded-full bg-secondary flex items-center justify-center flex-shrink-0">
                      <User className="h-4 w-4" />
                    </div>
                  )}
                </div>
              ))}

              {status === "streaming" && (
                <div className="flex gap-3 justify-start">
                  <div className="h-8 w-8 rounded-full bg-primary flex items-center justify-center flex-shrink-0">
                    <Bot className="h-4 w-4 text-primary-foreground" />
                  </div>
                  <div className="rounded-lg px-4 py-2 bg-muted">
                    <Loader2 className="h-4 w-4 animate-spin" />
                  </div>
                </div>
              )}
            </div>
          </ScrollArea>

          {envConfig && (
            <div className="px-6 pb-4">
              <Card className="bg-accent/50">
                <CardContent className="pt-4">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <h4 className="font-semibold mb-2">Environment Ready!</h4>
                      <div className="text-sm text-muted-foreground space-y-1">
                        <p>
                          <strong>Project:</strong> {envConfig.projectName}
                        </p>
                        <p>
                          <strong>Stack:</strong> {envConfig.language}
                          {envConfig.framework && ` + ${envConfig.framework}`}
                        </p>
                        <p className="flex items-center gap-1">
                          <strong>Deployment:</strong>
                          {getServerIcon(envConfig.serverType)}
                          {envConfig.serverType}
                        </p>
                      </div>
                    </div>
                    <div className="flex flex-col gap-2">
                      <Button size="sm" onClick={handleDownload}>
                        <Download className="h-4 w-4 mr-2" />
                        Download ZIP
                      </Button>
                      {envConfig.serverType !== "local" && (
                        <Button size="sm" variant="outline" onClick={() => setShowDeployment(true)}>
                          <Cloud className="h-4 w-4 mr-2" />
                          Auto Deploy
                        </Button>
                      )}
                      <Button size="sm" variant="secondary" onClick={handleUseInGenerator}>
                        <ArrowRight className="h-4 w-4 mr-2" />
                        Edit in Generator
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          <form onSubmit={handleSubmit} className="px-6 pb-6">
            <div className="flex gap-2">
              <Input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Describe your project requirements..."
                disabled={status === "streaming"}
                className="flex-1"
              />
              <Button type="submit" size="icon" disabled={status === "streaming" || !input || input.trim().length === 0}>
                {status === "streaming" ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      {envConfig && <DeploymentDialog open={showDeployment} onOpenChange={setShowDeployment} config={envConfig} />}
    </>
  )
}
