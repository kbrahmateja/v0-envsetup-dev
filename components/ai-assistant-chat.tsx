"use client"

import { useState, useRef, useEffect, type FormEvent } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Bot, User, Loader2, Send, Download, Cloud, ArrowRight } from "lucide-react"
import { useRouter } from "next/navigation"
import type { EnvironmentConfig } from "@/lib/deployment-config"
import { DeploymentDialog } from "./deployment-dialog"

interface Message {
  id: string
  role: "user" | "assistant"
  content: string
}

const MAX_MESSAGES = 20
const WARNING_THRESHOLD = 2
const MAX_CHARS_PER_MESSAGE = 500

function makeSessionId(): string {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) return crypto.randomUUID()
  return `${Date.now()}-${Math.random().toString(36).slice(2)}`
}

export function AIAssistantChat() {
  const router = useRouter()
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [isRateLimited, setIsRateLimited] = useState(false)
  const [envConfig, setEnvConfig] = useState<EnvironmentConfig | null>(null)
  const [showDeployment, setShowDeployment] = useState(false)
  // One id per conversation (resets on page reload) — lets the server count this
  // as a single "session" against the daily/weekly free-tier limit.
  const sessionIdRef = useRef<string>("")
  if (!sessionIdRef.current) sessionIdRef.current = makeSessionId()
  // Scroll to bottom of chat area (not window)
  const chatEndRef = useRef<HTMLDivElement>(null)
  const scrollAreaRef = useRef<HTMLDivElement>(null)

  const messagesRemaining = MAX_MESSAGES - messages.length
  const isConversationFull = messagesRemaining <= 0
  const showLengthWarning = messagesRemaining > 0 && messagesRemaining <= WARNING_THRESHOLD
  const isInputDisabled = isLoading || isConversationFull || isRateLimited

  const scrollToBottom = () => {
    // Scroll inside the chat container, not the page
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight
    }
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages, isLoading])

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    const text = input.trim().slice(0, MAX_CHARS_PER_MESSAGE)
    if (!text || isLoading || isConversationFull || isRateLimited) return

    const userMsg: Message = { id: String(Date.now()), role: "user", content: text }
    const newMessages = [...messages, userMsg]
    setMessages(newMessages)
    setInput("")
    setIsLoading(true)

    try {
      // Only send role + content (clean format for API)
      const apiMessages = newMessages.map(({ role, content }) => ({ role, content }))

      const res = await fetch("/api/ai-assistant", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: apiMessages, sessionId: sessionIdRef.current }),
      })

      if (!res.ok) {
        throw new Error(`API error: ${res.status}`)
      }

      const data = await res.json()
      if (data.rateLimited) setIsRateLimited(true)
      const reply: Message = {
        id: String(Date.now() + 1),
        role: "assistant",
        content: data.message ?? "Sorry, I couldn't generate a response. Please try again.",
      }
      setMessages([...newMessages, reply])
    } catch (err) {
      console.error("Chat error:", err)
      setMessages([...newMessages, {
        id: String(Date.now() + 1),
        role: "assistant",
        content: "Connection issue. Please check your internet and try again.",
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
      <Card className="flex flex-col" style={{ height: "600px" }}>
        <CardHeader className="flex-shrink-0">
          <CardTitle className="flex items-center gap-2">
            <Bot className="h-5 w-5" /> AI Environment Assistant
          </CardTitle>
          <CardDescription>Tell me about your project and I&apos;ll help you set up the perfect environment</CardDescription>
        </CardHeader>

        <CardContent className="flex-1 flex flex-col p-0 min-h-0">
          {/* Scrollable chat area — fixed height, internal scroll only */}
          <div
            ref={scrollAreaRef}
            className="flex-1 overflow-y-auto px-6 min-h-0"
            style={{ overscrollBehavior: "contain" }}
          >
            <div className="space-y-4 py-4">
              {messages.length === 0 && (
                <div className="text-center text-muted-foreground py-8">
                  <Bot className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p className="text-sm">Start by telling me about your project!</p>
                  <p className="text-xs mt-2">e.g. &quot;I need a Spring Boot API with PostgreSQL&quot;</p>
                </div>
              )}
              {messages.map((msg) => (
                <div key={msg.id} className={`flex gap-3 ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                  {msg.role === "assistant" && (
                    <div className="h-8 w-8 rounded-full bg-primary flex items-center justify-center flex-shrink-0 mt-1">
                      <Bot className="h-4 w-4 text-primary-foreground" />
                    </div>
                  )}
                  <div className={`rounded-lg px-4 py-2 max-w-[80%] text-sm whitespace-pre-wrap break-words ${
                    msg.role === "user" ? "bg-primary text-primary-foreground" : "bg-muted"
                  }`}>
                    {msg.content}
                  </div>
                  {msg.role === "user" && (
                    <div className="h-8 w-8 rounded-full bg-secondary flex items-center justify-center flex-shrink-0 mt-1">
                      <User className="h-4 w-4" />
                    </div>
                  )}
                </div>
              ))}
              {isLoading && (
                <div className="flex gap-3 justify-start">
                  <div className="h-8 w-8 rounded-full bg-primary flex items-center justify-center flex-shrink-0 mt-1">
                    <Bot className="h-4 w-4 text-primary-foreground" />
                  </div>
                  <div className="rounded-lg px-4 py-3 bg-muted flex items-center gap-2">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span className="text-sm text-muted-foreground">Thinking...</span>
                  </div>
                </div>
              )}
              <div ref={chatEndRef} />
            </div>
          </div>

          {envConfig && (
            <div className="px-6 pb-2 flex-shrink-0">
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
                    {envConfig.serverType !== "local" && (
                      <Button size="sm" variant="outline" onClick={() => setShowDeployment(true)}>
                        <Cloud className="h-4 w-4 mr-1" /> Deploy
                      </Button>
                    )}
                    <Button size="sm" variant="secondary"
                      onClick={() => router.push(`/generator?language=${envConfig.language}`)}>
                      <ArrowRight className="h-4 w-4 mr-1" /> Generator
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {isRateLimited && (
            <div className="px-6 pb-2 flex-shrink-0">
              <p className="text-xs text-muted-foreground bg-muted rounded-md px-3 py-2">
                You&apos;ve reached today&apos;s free AI conversation limit. Try the generator directly at{" "}
                <span className="font-medium">envsetup.dev/generator</span> — no AI needed for known stacks.
              </p>
            </div>
          )}
          {!isRateLimited && isConversationFull && (
            <div className="px-6 pb-2 flex-shrink-0">
              <p className="text-xs text-muted-foreground bg-muted rounded-md px-3 py-2">
                This conversation has reached its {MAX_MESSAGES}-message limit. Reload the page to start a new one.
              </p>
            </div>
          )}
          {!isRateLimited && showLengthWarning && (
            <div className="px-6 pb-2 flex-shrink-0">
              <p className="text-xs text-amber-600 dark:text-amber-500 bg-amber-50 dark:bg-amber-950/30 rounded-md px-3 py-2">
                Heads up: only {messagesRemaining} message{messagesRemaining === 1 ? "" : "s"} left in this conversation.
              </p>
            </div>
          )}

          {/* Input — fixed at bottom, never scrolls */}
          <form onSubmit={handleSubmit} className="px-6 pb-4 pt-2 flex flex-col gap-1 flex-shrink-0 border-t">
            <div className="flex gap-2">
              <Input
                value={input}
                onChange={(e) => setInput(e.target.value.slice(0, MAX_CHARS_PER_MESSAGE))}
                placeholder={isConversationFull ? "Conversation limit reached" : "Describe your project..."}
                disabled={isInputDisabled}
                maxLength={MAX_CHARS_PER_MESSAGE}
                className="flex-1"
                autoComplete="off"
              />
              <Button type="submit" size="icon" disabled={isInputDisabled || !input.trim()}>
                {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
              </Button>
            </div>
            {input.length > MAX_CHARS_PER_MESSAGE * 0.8 && (
              <span className="text-[10px] text-muted-foreground self-end">
                {input.length}/{MAX_CHARS_PER_MESSAGE}
              </span>
            )}
          </form>
        </CardContent>
      </Card>
      {envConfig && <DeploymentDialog open={showDeployment} onOpenChange={setShowDeployment} config={envConfig} />}
    </>
  )
}
