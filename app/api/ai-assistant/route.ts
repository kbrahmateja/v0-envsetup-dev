// @ts-nocheck
import { generateText } from "ai"
import { createOpenAI } from "@ai-sdk/openai"

function getModel() {
  if (process.env.GROQ_API_KEY) {
    const groq = createOpenAI({
      baseURL: "https://api.groq.com/openai/v1",
      apiKey: process.env.GROQ_API_KEY,
    })
    return groq("llama-3.1-8b-instant")
  }
  const openai = createOpenAI({ apiKey: process.env.OPENAI_API_KEY ?? "" })
  return openai("gpt-4o-mini")
}

export const maxDuration = 30

export async function POST(req: Request) {
  const { messages } = await req.json()

  const { text } = await generateText({
    model: getModel(),
    system: `You are an expert DevOps consultant for envsetup.dev.
Help users set up development environments. Ask about their project, then recommend a stack.
Be concise — max 3 sentences per response.`,
    messages,
  })

  return Response.json({ message: text })
}
