// @ts-nocheck
import { generateText } from "ai"
import { createOpenAI } from "@ai-sdk/openai"
import { searchKnowledge, buildContext, extractQuery } from "@/lib/rag"

function getModel() {
  if (process.env.GROQ_API_KEY) {
    const groq = createOpenAI({
      baseURL: "https://api.groq.com/openai/v1",
      apiKey: process.env.GROQ_API_KEY,
    })
    return groq("llama-3.1-8b-instant")
  }
  if (process.env.OPENAI_API_KEY) {
    const openai = createOpenAI({ apiKey: process.env.OPENAI_API_KEY })
    return openai("gpt-4o-mini")
  }
  return null
}

// Smart fallback using our knowledge base data
function smartFallback(messages: { role: string; content: string }[], context: string): string {
  const query = extractQuery(messages).toLowerCase()

  const patterns: [RegExp, string][] = [
    [/java|spring\s*boot|jvm/i, "**Spring Boot + PostgreSQL** is the go-to for Java!\n\n- Java 21, `eclipse-temurin:21-jdk-alpine`\n- Spring Boot 3.2 (needs Java 17+)\n- Spring Data JPA + PostgreSQL\n\nMonolith or microservices? Need React frontend too?\n\n→ Generate now: `npx @envsetup/cli init`"],
    [/python|fastapi|django|flask/i, "Great Python choices:\n- **FastAPI** — async, auto docs, modern\n- **Django** — batteries included, admin panel\n- **Flask** — minimal, flexible\n\nAll use `python:3.12-slim` Docker.\n\nWhich database? PostgreSQL recommended.\n\n→ `npx @envsetup/cli init`"],
    [/go|golang|gin|fiber/i, "**Go + Gin + PostgreSQL** — blazing fast!\n\n- `golang:1.22-alpine` multi-stage build\n- GORM ORM, minimal memory footprint\n- Port 8080\n\n→ `npx @envsetup/cli init` or [envsetup.dev/generator](https://envsetup.dev/generator)"],
    [/rust|actix|axum/i, "**Rust + Axum/Actix** — ultra-fast systems programming!\n\n- `rust:1.75-alpine` multi-stage build\n- SQLx for async database queries\n- Zero-cost abstractions\n\n→ `npx @envsetup/cli init`"],
    [/next\.?js|nextjs|react\s*framework/i, "**Next.js + PostgreSQL** — top full-stack choice!\n\n- Node 20, TypeScript, App Router\n- Prisma ORM + Tailwind CSS\n- Deploy FREE on Vercel\n\n→ [One-click generate](https://envsetup.dev/generator?template=nextjs-postgres) or `npx @envsetup/cli init`"],
    [/node|express|nestjs|typescript\s*backend/i, "**NestJS** (enterprise) or **Express** (minimal) for Node.js backend.\n\nBoth use `node:20-alpine`. PostgreSQL + Prisma recommended.\n\nWhat's your use case? REST API, GraphQL, or microservices?\n\n→ `npx @envsetup/cli init`"],
    [/php|laravel|symfony/i, "**Laravel + MySQL** — popular PHP stack!\n\n- PHP 8.3, `php:8.3-fpm-alpine`\n- Laravel 11 (needs PHP 8.2+)\n- Eloquent ORM, Redis queues\n\n→ `npx @envsetup/cli init`"],
    [/ruby|rails/i, "**Ruby on Rails + PostgreSQL** — convention over configuration!\n\n- Ruby 3.3, `ruby:3.3-alpine`\n- Rails 7.1, ActiveRecord ORM\n- Port 3000\n\n→ `npx @envsetup/cli init`"],
    [/microservice|distributed/i, "For **microservices**, I recommend:\n\n- NestJS or Go services (fast, lightweight)\n- Each service with own PostgreSQL database\n- Redis for inter-service messaging\n- Docker Compose to run locally\n\nWhat language for services? Java/Go/TypeScript?\n\n→ `npx @envsetup/cli init`"],
    [/monorepo/i, "**Monorepo** setup with Turborepo:\n\n- Frontend (Next.js) + Backend (NestJS) in one repo\n- Shared TypeScript types\n- Single `docker-compose.yml`\n\n→ `npx @envsetup/cli init`"],
  ]

  for (const [pattern, response] of patterns) {
    if (pattern.test(query)) return response
  }

  return `I can help set up your dev environment! Tell me:\n\n1. **Language** — Java, Python, Go, TypeScript, Rust, PHP, Ruby?\n2. **Framework** — Spring Boot, FastAPI, NestJS, Gin?\n3. **Database** — PostgreSQL, MySQL, MongoDB?\n4. **Architecture** — Monolith, Microservices?\n\nOr run interactively: \`npx @envsetup/cli init\` 🚀`
}

export const maxDuration = 45

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const messages = (body.messages ?? []).slice(-8)

    if (!messages.length) {
      return Response.json({ message: "Hi! Tell me about your project and I'll help set up the perfect dev environment. What language/framework are you using?" })
    }

    // RAG: search knowledge base for relevant context
    const query = extractQuery(messages)
    const chunks = await searchKnowledge(query, 4)
    const context = buildContext(chunks)

    const model = getModel()

    if (model) {
      try {
        const systemPrompt = `You are an expert DevOps consultant for envsetup.dev — a tool that generates Dockerfiles, docker-compose.yml, and .env files for any tech stack.

${context}

Guidelines:
- Be conversational and helpful (2-4 sentences)
- Use the knowledge above to give accurate version and Docker image info
- When you know the full stack (language + framework + DB), suggest:
  "Ready to generate! Try: npx @envsetup/cli init or visit envsetup.dev/generator"
- Support natural language: understand "I need java project" = Spring Boot
- Ask clarifying questions if needed (monolith vs microservices, DB choice)`

        const { text } = await generateText({
          model,
          system: systemPrompt,
          messages,
          maxTokens: 400,
        })

        if (text?.trim()) {
          return Response.json({ message: text })
        }
      } catch (aiErr) {
        console.error("LLM failed, using RAG fallback:", aiErr)
      }
    }

    // RAG-enhanced fallback: use retrieved context even without LLM
    if (chunks.length > 0) {
      const topChunk = chunks[0]
      return Response.json({
        message: `Based on your request:\n\n**${topChunk.title}**\n${topChunk.content}\n\n→ Generate your environment: \`npx @envsetup/cli init\` or [envsetup.dev/generator](https://envsetup.dev/generator)`
      })
    }

    return Response.json({ message: smartFallback(messages, context) })

  } catch (err) {
    console.error("Route error:", err)
    return Response.json({ message: smartFallback([], "") })
  }
}
