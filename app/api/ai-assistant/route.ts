import { streamText, tool } from "ai"
import { z } from "zod"

export const maxDuration = 30

// Knowledge base of software/tools with versions and requirements
const softwareDatabase = {
  languages: [
    { name: "Node.js", versions: ["20.x", "18.x", "16.x"], use: "JavaScript runtime" },
    { name: "Python", versions: ["3.12", "3.11", "3.10"], use: "General programming" },
    { name: "Java", versions: ["21", "17", "11"], use: "Enterprise applications" },
    { name: "Go", versions: ["1.22", "1.21"], use: "System programming" },
    { name: "Rust", versions: ["1.75", "1.74"], use: "System programming" },
  ],
  databases: [
    { name: "PostgreSQL", versions: ["16", "15", "14"], use: "Relational database" },
    { name: "MongoDB", versions: ["7.0", "6.0"], use: "NoSQL database" },
    { name: "Redis", versions: ["7.2", "7.0"], use: "In-memory cache" },
    { name: "MySQL", versions: ["8.3", "8.0"], use: "Relational database" },
  ],
  frameworks: [
    { name: "React", versions: ["18.2", "18.1"], language: "JavaScript/TypeScript" },
    { name: "Next.js", versions: ["14.1", "14.0"], language: "JavaScript/TypeScript" },
    { name: "Django", versions: ["5.0", "4.2"], language: "Python" },
    { name: "FastAPI", versions: ["0.109", "0.108"], language: "Python" },
    { name: "Spring Boot", versions: ["3.2", "3.1"], language: "Java" },
  ],
  tools: [
    { name: "Docker", versions: ["25.0", "24.0"], use: "Containerization" },
    { name: "Kubernetes", versions: ["1.29", "1.28"], use: "Container orchestration" },
    { name: "Nginx", versions: ["1.25", "1.24"], use: "Web server" },
    { name: "Git", versions: ["2.43", "2.42"], use: "Version control" },
  ],
}

export async function POST(req: Request) {
  const { messages } = await req.json()

  const result = streamText({
    model: "openai/gpt-5-mini",
    system: `You are an expert DevOps and software environment consultant helping users set up their development environments.

Your job is to:
1. Understand their project requirements through conversation
2. Recommend appropriate software, tools, frameworks, and versions
3. Explain compatibility and best practices
4. Help them configure server deployment options
5. Generate a complete environment configuration

Be conversational, helpful, and ask clarifying questions when needed. Use the tools to search the software database and create environment configurations.

When you have enough information, use the generateEnvironmentConfig tool to create the final configuration.`,
    messages,
    toolCallStreaming: true,
    maxSteps: 10,
    tools: {
      searchSoftware: tool({
        description: "Search the software database for languages, frameworks, databases, and tools",
        parameters: z.object({
          category: z.enum(["languages", "databases", "frameworks", "tools"]),
          query: z.string().optional(),
        }),
        execute: async ({ category, query }) => {
          const items = softwareDatabase[category]
          if (query) {
            return items.filter((item) => item.name.toLowerCase().includes(query.toLowerCase()))
          }
          return items
        },
      }),
      generateEnvironmentConfig: tool({
        description: "Generate the final environment configuration based on user requirements",
        parameters: z.object({
          projectName: z.string().describe("Name of the project"),
          language: z.string().describe("Primary programming language"),
          framework: z.string().optional().describe("Framework if any"),
          databases: z.array(z.string()).describe("Required databases"),
          tools: z.array(z.string()).describe("Required development tools"),
          serverType: z.enum(["cloud", "dedicated", "local"]).describe("Deployment target"),
          description: z.string().optional().describe("Project description"),
        }),
      }),
      recommendVersions: tool({
        description: "Recommend specific versions for software based on compatibility",
        parameters: z.object({
          software: z.string().describe("Name of the software"),
          useCase: z.string().optional().describe("Specific use case"),
        }),
        execute: async ({ software }) => {
          // Search across all categories
          for (const category of Object.values(softwareDatabase)) {
            const found = category.find((item) => item.name.toLowerCase() === software.toLowerCase())
            if (found) {
              return {
                software: found.name,
                recommendedVersion: found.versions[0],
                allVersions: found.versions,
                reason: `${found.versions[0]} is the latest stable version`,
              }
            }
          }
          return { error: "Software not found in database" }
        },
      }),
    },
  })

  return result.toUIMessageStreamResponse()
}
