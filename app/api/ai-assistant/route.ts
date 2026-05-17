// @ts-nocheck
import { streamText } from "ai"
import { z } from "zod"
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

const softwareDatabase: Record<string, Array<Record<string, unknown>>> = {
  languages: [
    { name: "Node.js", versions: ["20.x", "18.x"] },
    { name: "Python", versions: ["3.12", "3.11"] },
    { name: "Go", versions: ["1.22", "1.21"] },
    { name: "PHP", versions: ["8.3", "8.2"] },
  ],
  databases: [
    { name: "PostgreSQL", versions: ["16", "15"] },
    { name: "MongoDB", versions: ["7.0", "6.0"] },
    { name: "Redis", versions: ["7.2"] },
  ],
  frameworks: [
    { name: "Next.js", versions: ["15.x", "14.x"] },
    { name: "Django", versions: ["5.0", "4.2"] },
    { name: "FastAPI", versions: ["0.109"] },
    { name: "Gin", versions: ["1.9"] },
  ],
  tools: [
    { name: "Docker", versions: ["25.0"] },
    { name: "Kubernetes", versions: ["1.29"] },
  ],
}

const searchSchema = z.object({
  category: z.enum(["languages", "databases", "frameworks", "tools"]),
  query: z.string().optional(),
})

const configSchema = z.object({
  projectName: z.string(),
  language: z.string(),
  framework: z.string().optional(),
  databases: z.array(z.string()),
  tools: z.array(z.string()),
  serverType: z.enum(["cloud", "dedicated", "local"]),
  description: z.string().optional(),
})

const versionSchema = z.object({
  software: z.string(),
})

export async function POST(req: Request) {
  const { messages } = await req.json()

  const result = await streamText({
    model: getModel(),
    system: `You are a DevOps consultant for envsetup.dev. Help users set up dev environments.`,
    messages,
    tools: {
      searchSoftware: {
        description: "Search the software database",
        inputSchema: searchSchema,
        execute: async (input: z.infer<typeof searchSchema>) => {
          const items = softwareDatabase[input.category] ?? []
          if (input.query) {
            return items.filter((i) =>
              String(i.name).toLowerCase().includes(input.query!.toLowerCase())
            )
          }
          return items
        },
      },
      generateEnvironmentConfig: {
        description: "Generate the final environment configuration",
        inputSchema: configSchema,
        execute: async (input: z.infer<typeof configSchema>) => {
          return { success: true, config: input }
        },
      },
      recommendVersions: {
        description: "Recommend versions for a tool",
        inputSchema: versionSchema,
        execute: async (input: z.infer<typeof versionSchema>) => {
          for (const category of Object.values(softwareDatabase)) {
            const found = category.find(
              (i) => String(i.name).toLowerCase() === input.software.toLowerCase()
            )
            if (found) {
              const versions = found.versions as string[]
              return { name: found.name, recommended: versions[0], all: versions }
            }
          }
          return { error: "Not found" }
        },
      },
    },
  })

  return result.toTextStreamResponse()
}
