"use client"

import { useState, useRef, useEffect, type FormEvent } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Bot, User, Loader2, Send, Download, Cloud, ArrowRight } from "lucide-react"
import { useRouter } from "next/navigation"
import type { EnvironmentConfig } from "@/lib/deployment-config"
import { DeploymentDialog } from "./deployment-dialog"

interface Message {
  id: string
  role: "user" | "assistant"
  content: string
}

export function AIAssistantChat() {
  const router = useRouter()
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [envConfig, setEnvConfig] = useState<EnvironmentConfig | null>(null)
  const [showDeployment, setShowDeployment] = useState(false)
  const bottomRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    const text = input.trim()
    if (!text || isLoading) return

    const userMsg: Message = { id: String(Date.now()), role: "user", content: text }
    const newMessages = [...messages, userMsg]
    setMessages(newMessages)
    setInput("")
    setIsLoading(true)

    try {
      const res = await fetch("/api/ai-assistant", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: newMessages.map(({ role, content }) => ({ role, content }))
        }),
      })

      if (!res.ok) throw new Error(`HTTP ${res.status}`)

      const data = await res.json()
      const reply: Message = {
        id: String(Date.now() + 1),
        role: "assistant",
        content: data.message || "Sorry, something went wrong."
      }
      setMessages([...newMessages, reply])
    } catch (err) {
      console.error("Chat error:", err)
      setMessages([...newMessages, {
        id: String(Date.now() + 1),
        role: "assistant",
        content: "Sorry, I couldn't connect. Please try again."
      }])
    } finally {
      setIsLoading(false)
    }
  }

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

  return (
    <>
      <Card className="h-[600px] flex flex-col">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bot className="h-5 w-5" /> AI Environment Assistant
          </CardTitle>
          <CardDescription>Tell me about your project and I&apos;ll help you set up the perfect environment</CardDescription>
        </CardHeader>
        <CardContent className="flex-1 flex flex-col p-0 overflow-hidden">
          <ScrollArea className="flex-1 px-6">
            <div className="space-y-4 py-4">
              {messages.length === 0 && (
                <div className="text-center text-muted-foreground py-8">
                  <Bot className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p className="text-sm">Start by telling me about your project!</p>
                  <p className="text-xs mt-2">e.g. &quot;I&apos;m building a web app with React and PostgreSQL&quot;</p>
                </div>
              )}
              {messages.map((msg) => (
                <div key={msg.id} className={`flex gap-3 ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                  {msg.role === "assistant" && (
                    <div className="h-8 w-8 rounded-full bg-primary flex items-center justify-center flex-shrink-0">
                      <Bot className="h-4 w-4 text-primary-foreground" />
                    </div>
                  )}
                  <div className={`rounded-lg px-4 py-2 max-w-[80%] text-sm whitespace-pre-wrap ${
                    msg.role === "user" ? "bg-primary text-primary-foreground" : "bg-muted"
                  }`}>
                    {msg.content}
                  </div>
                  {msg.role === "user" && (
                    <div className="h-8 w-8 rounded-full bg-secondary flex items-center justify-center flex-shrink-0">
                      <User className="h-4 w-4" />
                    </div>
                  )}
                </div>
              ))}
              {isLoading && (
                <div className="flex gap-3 justify-start">
                  <div className="h-8 w-8 rounded-full bg-primary flex items-center justify-center flex-shrink-0">
                    <Bot className="h-4 w-4 text-primary-foreground" />
                  </div>
                  <div className="rounded-lg px-4 py-2 bg-muted flex items-center">
                    <Loader2 className="h-4 w-4 animate-spin" />
                  </div>
                </div>
              )}
              <div ref={bottomRef} />
            </div>
          </ScrollArea>

          {envConfig && (
            <div className="px-6 pb-2">
              <Card className="bg-accent/50">
                <CardContent className="pt-4 flex items-center justify-between gap-4">
                  <div>
                    <h4 className="font-semibold text-sm">Environment Ready!</h4>
                    <p className="text-xs text-muted-foreground">{envConfig.projectName} • {envConfig.language}</p>
                  </div>
                  <div className="flex gap-2">
                    <Button size="sm" onClick={handleDownload}>
                      <Download className="h-4 w-4 mr-1" /> ZIP
                    </Button>
                    <Button size="sm" variant="secondary"
                      onClick={() => router.push(`/generator?language=${envConfig.language}`)}>
                      <ArrowRight className="h-4 w-4 mr-1" /> Generator
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          <form onSubmit={handleSubmit} className="px-6 pb-6 pt-2 flex gap-2">
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Describe your project requirements..."
              disabled={isLoading}
              className="flex-1"
            />
            <Button type="submit" size="icon" disabled={isLoading || !input.trim()}>
              {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
            </Button>
          </form>
        </CardContent>
      </Card>
      {envConfig && <DeploymentDialog open={showDeployment} onOpenChange={setShowDeployment} config={envConfig} />}
    </>
  )
}
