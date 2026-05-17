import { streamText, tool } from "ai"
import { z } from "zod"

async function getModel() {
  if (process.env.GROQ_API_KEY) {
    const { createGroq } = await import("@ai-sdk/groq")
    const groq = createGroq({ apiKey: process.env.GROQ_API_KEY })
    return groq("llama-3.1-8b-instant")
  }
  const { createOpenAI } = await import("@ai-sdk/openai")
  const openai = createOpenAI({ apiKey: process.env.OPENAI_API_KEY })
  return openai("gpt-4o-mini")
}

export const maxDuration = 30

const softwareDatabase = {
  languages: [
    { name: "Node.js", versions: ["20.x", "18.x"], use: "JavaScript runtime" },
    { name: "Python", versions: ["3.12", "3.11"], use: "General programming" },
    { name: "Java", versions: ["21", "17"], use: "Enterprise applications" },
    { name: "Go", versions: ["1.22", "1.21"], use: "System programming" },
    { name: "PHP", versions: ["8.3", "8.2"], use: "Web development" },
    { name: "Ruby", versions: ["3.3", "3.2"], use: "Web development" },
  ],
  databases: [
    { name: "PostgreSQL", versions: ["16", "15"], use: "Relational database" },
    { name: "MongoDB", versions: ["7.0", "6.0"], use: "NoSQL database" },
    { name: "Redis", versions: ["7.2"], use: "In-memory cache" },
    { name: "MySQL", versions: ["8.3"], use: "Relational database" },
  ],
  frameworks: [
    { name: "Next.js", versions: ["15.x", "14.x"], language: "TypeScript" },
    { name: "Django", versions: ["5.0", "4.2"], language: "Python" },
    { name: "FastAPI", versions: ["0.109"], language: "Python" },
    { name: "Spring Boot", versions: ["3.2"], language: "Java" },
    { name: "Laravel", versions: ["11.x"], language: "PHP" },
    { name: "NestJS", versions: ["10.x"], language: "TypeScript" },
    { name: "Gin", versions: ["1.9"], language: "Go" },
  ],
  tools: [
    { name: "Docker", versions: ["25.0"], use: "Containerization" },
    { name: "Kubernetes", versions: ["1.29"], use: "Orchestration" },
    { name: "Nginx", versions: ["1.25"], use: "Web server" },
  ],
}

export async function POST(req: Request) {
  const { messages } = await req.json()
  const model = await getModel()

  const result = streamText({
    model,
    system: `You are an expert DevOps consultant for envsetup.dev.
Help users set up development environments by asking about their project, then calling generateEnvironmentConfig.`,
    messages,
    maxSteps: 10,
    tools: {
      searchSoftware: tool({
        description: "Search the software database",
        parameters: z.object({
          category: z.enum(["languages", "databases", "frameworks", "tools"]),
          query: z.string().optional(),
        }),
        execute: async ({ category, query }) => {
          const items = softwareDatabase[category] as Array<Record<string, unknown>>
          if (query) {
            return items.filter((item) =>
              String(item.name).toLowerCase().includes(query.toLowerCase())
            )
          }
          return items
        },
      }),
      generateEnvironmentConfig: tool({
        description: "Generate the final environment configuration",
        parameters: z.object({
          projectName: z.string(),
          language: z.string(),
          framework: z.string().optional(),
          databases: z.array(z.string()),
          tools: z.array(z.string()),
          serverType: z.enum(["cloud", "dedicated", "local"]),
          description: z.string().optional(),
        }),
      }),
      recommendVersions: tool({
        description: "Recommend versions for software",
        parameters: z.object({
          software: z.string(),
          useCase: z.string().optional(),
        }),
        execute: async ({ software }) => {
          for (const category of Object.values(softwareDatabase)) {
            const found = (category as Array<Record<string, unknown>>).find(
              (item) => String(item.name).toLowerCase() === software.toLowerCase()
            )
            if (found) {
              const versions = found.versions as string[]
              return { software: found.name, recommendedVersion: versions[0], allVersions: versions }
            }
          }
          return { error: "Software not found" }
        },
      }),
    },
  })

  return result.toDataStreamResponse()
}
