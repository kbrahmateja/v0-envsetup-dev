// @ts-nocheck
import { generateText } from "ai"
import { createOpenAI } from "@ai-sdk/openai"

function getModel(modelName = "llama-3.1-8b-instant") {
  if (process.env.GROQ_API_KEY) {
    const groq = createOpenAI({
      baseURL: "https://api.groq.com/openai/v1",
      apiKey: process.env.GROQ_API_KEY,
    })
    return groq(modelName)
  }
  if (process.env.OPENAI_API_KEY) {
    const openai = createOpenAI({ apiKey: process.env.OPENAI_API_KEY })
    return openai("gpt-4o-mini")
  }
  return null
}

// ── Rule-based fallback ────────────────────────────────────────────────────
function smartFallback(messages: { role: string; content: string }[]): string {
  const lastMsg = messages[messages.length - 1]?.content?.toLowerCase() ?? ""
  const allText = messages.map(m => m.content).join(" ").toLowerCase()

  const stacks: Record<string, string> = {
    java: "For Java, I recommend **Spring Boot + PostgreSQL**.\n\n- `eclipse-temurin:21-jdk-alpine` Docker image\n- Spring Boot 3.x (requires Java 17+)\n- Spring Data JPA + Hibernate\n\nWant a monolithic API or microservices?\n\nReady to generate? Try: `npx @envsetup/cli init` or [envsetup.dev/generator](https://envsetup.dev/generator)",
    python: "For Python, I recommend **FastAPI + PostgreSQL** for modern APIs or **Django** for full-featured apps.\n\n- `python:3.12-slim` Docker image\n- Alembic for migrations\n\nWhat kind of app? REST API, web app, or data service?\n\nGenerate now: `npx @envsetup/cli init`",
    node: "For Node.js, great choices are:\n- **NestJS** — enterprise, TypeScript\n- **Express** — minimal, flexible\n- **Fastify** — fast, schema-based\n\nWhich database? PostgreSQL, MongoDB, or SQLite?\n\nGenerate: `npx @envsetup/cli init`",
    go: "For Go, I recommend **Gin + PostgreSQL** — fast, simple, production-ready.\n\n- `golang:1.22-alpine` with multi-stage build\n- GORM for ORM\n\nGenerate your environment: `npx @envsetup/cli init`",
    react: "For React, I recommend **Next.js + PostgreSQL** (full-stack) or **React + Vite** (SPA with separate API).\n\nDo you need a backend too? If yes, which language — Node.js, Python, or Java?\n\nTry: `npx @envsetup/cli init`",
    nextjs: "**Next.js + PostgreSQL** is a great choice!\n\n- Node 20, Prisma ORM, Tailwind CSS\n- Docker with `node:20-alpine`\n\nDeploy to Vercel (free) or Railway.\n\nGenerate now: [envsetup.dev/generator?template=nextjs-postgres](https://envsetup.dev/generator?template=nextjs-postgres)",
    spring: "**Spring Boot + PostgreSQL** — excellent choice for enterprise Java!\n\n- Java 21 + Spring Boot 3.2\n- `eclipse-temurin:21-jdk-alpine` Docker\n- Spring Security + JPA\n\nMonolithic or microservices?\n\nGenerate: `npx @envsetup/cli init`",
    django: "**Django + PostgreSQL** — batteries included!\n\n- Python 3.12, Django 5.0\n- Django REST Framework for APIs\n- Celery + Redis for async tasks\n\nGenerate: `npx @envsetup/cli init`",
    fastapi: "**FastAPI + PostgreSQL** — modern Python API!\n\n- Python 3.12, async support\n- SQLAlchemy 2.x + Alembic\n- Auto-generated Swagger docs\n\nGenerate: [envsetup.dev/generator?template=fastapi-pg](https://envsetup.dev/generator?template=fastapi-pg)",
    rust: "**Axum + PostgreSQL** — blazing fast Rust API!\n\n- `rust:1.75-alpine` multi-stage build\n- SQLx for async DB queries\n- Tokio async runtime\n\nGenerate: `npx @envsetup/cli init`",
    php: "**Laravel + MySQL** — popular PHP stack!\n\n- PHP 8.3, Laravel 11\n- Eloquent ORM, Artisan CLI\n- Redis for queues/cache\n\nGenerate: `npx @envsetup/cli init`",
  }

  // Check for keywords
  for (const [key, response] of Object.entries(stacks)) {
    if (lastMsg.includes(key) || allText.includes(key)) {
      return response
    }
  }

  // Generic helpful response
  return `I can help you set up a development environment! Tell me:

1. **Language/Framework** — Java (Spring Boot), Python (FastAPI/Django), TypeScript (Next.js/NestJS), Go (Gin), Rust, PHP (Laravel), Ruby (Rails)?
2. **Database** — PostgreSQL, MySQL, MongoDB, SQLite?
3. **Deployment** — Local Docker, AWS, Vercel, Railway?

Or jump straight to: \`npx @envsetup/cli init\` for an interactive setup! 🚀`
}

export const maxDuration = 45

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const messages = (body.messages ?? []).slice(-8) // last 8 messages

    if (!messages.length) {
      return Response.json({ message: "Please tell me about your project!" })
    }

    const model = getModel("llama-3.1-8b-instant")

    // Try AI first
    if (model) {
      try {
        const { text } = await generateText({
          model,
          system: `You are an expert DevOps consultant for envsetup.dev — generates Dockerfiles and docker-compose files.
Be concise (2-3 sentences). When you know the stack, suggest: "Generate at envsetup.dev/generator or run: npx @envsetup/cli init"`,
          messages,
          maxTokens: 300,
        })
        if (text?.trim()) {
          return Response.json({ message: text })
        }
      } catch (aiError) {
        console.error("AI failed, using fallback:", aiError)
        // Fall through to fallback
      }
    }

    // Fallback — always works
    const fallbackResponse = smartFallback(messages)
    return Response.json({ message: fallbackResponse })

  } catch (error: unknown) {
    console.error("Route error:", error)
    return Response.json({
      message: smartFallback([{ role: "user", content: "" }])
    })
  }
}
