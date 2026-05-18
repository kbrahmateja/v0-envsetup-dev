// @ts-nocheck
import { generateText } from "ai"
import { createOpenAI } from "@ai-sdk/openai"

function getModel() {
  if (process.env.GROQ_API_KEY) {
    const groq = createOpenAI({
      baseURL: "https://api.groq.com/openai/v1",
      apiKey: process.env.GROQ_API_KEY,
    })
    return groq("llama-3.1-70b-versatile") // Better model for multi-turn
  }
  const openai = createOpenAI({ apiKey: process.env.OPENAI_API_KEY ?? "" })
  return openai("gpt-4o-mini")
}

export const maxDuration = 60 // Increase timeout

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const messages = body.messages ?? []

    if (!messages.length) {
      return Response.json({ message: "Please tell me about your project!" })
    }

    // Keep last 10 messages to avoid context overflow
    const recentMessages = messages.slice(-10)

    const { text } = await generateText({
      model: getModel(),
      system: `You are an expert DevOps consultant for envsetup.dev — a tool that generates Dockerfiles, docker-compose.yml, and .env files.

Help users set up their development environment. Be conversational and concise (2-4 sentences).
When you have enough info (language, framework, database), suggest: "Ready to generate your environment? Visit /generator or try the CLI: npx @envsetup/cli init"`,
      messages: recentMessages,
    })

    return Response.json({ message: text })
  } catch (error: unknown) {
    console.error("AI assistant error:", error)
    
    // Return helpful error instead of connection error
    const errMsg = error instanceof Error ? error.message : String(error)
    
    if (errMsg.includes("rate") || errMsg.includes("429")) {
      return Response.json({ message: "I'm getting too many requests right now. Please wait a moment and try again." })
    }
    if (errMsg.includes("timeout") || errMsg.includes("ETIMEDOUT")) {
      return Response.json({ message: "Response took too long. Please try a shorter message." })
    }

    return Response.json(
      { message: "I ran into an issue. Please try again.", error: errMsg },
      { status: 500 }
    )
  }
}
