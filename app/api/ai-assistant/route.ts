// @ts-nocheck
import { generateText } from "ai"
import { createOpenAI } from "@ai-sdk/openai"
import { type NextRequest, NextResponse } from "next/server"
import { randomUUID } from "crypto"
import { searchKnowledge, buildContext, extractQuery } from "@/lib/rag"
import { sql } from "@/lib/db"

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

// ─────────────────────────────────────────
// Rate limiting: free tier gets 1 new AI conversation *session* per day and
// 3 per week (per IP address OR per browser, whichever is more restrictive).
// A session is only counted once, on its first message — every follow-up
// message in an already-approved conversation is always allowed, so the
// limit never interrupts a conversation mid-way.
// ─────────────────────────────────────────
const DAILY_SESSION_LIMIT = 1
const WEEKLY_SESSION_LIMIT = 3
const AI_UID_COOKIE = "ai_uid"

async function checkRateLimit(sessionId: string, ip: string, cookieId: string) {
  try {
    const existing = await sql`SELECT 1 FROM ai_assistant_usage WHERE session_id = ${sessionId} LIMIT 1`
    if (existing.length > 0) {
      // Continuing an already-approved conversation.
      return { allowed: true, alreadyRecorded: true }
    }

    const [daily, weekly] = await Promise.all([
      sql`
        SELECT COUNT(*)::int AS count FROM ai_assistant_usage
        WHERE (ip_address = ${ip} OR cookie_id = ${cookieId}) AND created_at > NOW() - INTERVAL '1 day'
      `,
      sql`
        SELECT COUNT(*)::int AS count FROM ai_assistant_usage
        WHERE (ip_address = ${ip} OR cookie_id = ${cookieId}) AND created_at > NOW() - INTERVAL '7 days'
      `,
    ])

    const dailyCount = daily[0]?.count ?? 0
    const weeklyCount = weekly[0]?.count ?? 0

    if (dailyCount >= DAILY_SESSION_LIMIT || weeklyCount >= WEEKLY_SESSION_LIMIT) {
      return { allowed: false, alreadyRecorded: false }
    }

    return { allowed: true, alreadyRecorded: false }
  } catch (err) {
    // If the usage table or DB isn't reachable, don't break the whole feature — allow it.
    console.error("AI rate limit check failed, allowing request:", err)
    return { allowed: true, alreadyRecorded: true }
  }
}

async function recordSession(sessionId: string, ip: string, cookieId: string) {
  try {
    await sql`
      INSERT INTO ai_assistant_usage (session_id, ip_address, cookie_id)
      VALUES (${sessionId}, ${ip}, ${cookieId})
      ON CONFLICT (session_id) DO NOTHING
    `
  } catch (err) {
    console.error("Failed to record AI usage session:", err)
  }
}

export const maxDuration = 45

const MAX_CHARS_PER_MESSAGE = 500

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const messages = (body.messages ?? []).slice(-8).map((m: { role: string; content: unknown }) => ({
      ...m,
      content: typeof m.content === "string" ? m.content.slice(0, MAX_CHARS_PER_MESSAGE) : m.content,
    }))
    const sessionId: string | undefined =
      typeof body.sessionId === "string" && body.sessionId.length > 0 ? body.sessionId.slice(0, 64) : undefined

    const ip =
      req.headers.get("x-forwarded-for")?.split(",")[0].trim() ||
      req.headers.get("x-real-ip") ||
      req.headers.get("cf-connecting-ip") ||
      "unknown"

    let cookieId = req.cookies.get(AI_UID_COOKIE)?.value
    const isNewCookie = !cookieId
    if (!cookieId) cookieId = randomUUID()

    const withCookie = (res: NextResponse) => {
      if (isNewCookie) {
        res.cookies.set(AI_UID_COOKIE, cookieId!, {
          httpOnly: true,
          sameSite: "lax",
          secure: process.env.NODE_ENV === "production",
          maxAge: 60 * 60 * 24 * 365,
          path: "/",
        })
      }
      return res
    }

    if (!messages.length) {
      return withCookie(
        NextResponse.json({
          message: "Hi! Tell me about your project and I'll help set up the perfect dev environment. What language/framework are you using?",
        }),
      )
    }

    if (sessionId) {
      const { allowed, alreadyRecorded } = await checkRateLimit(sessionId, ip, cookieId)
      if (!allowed) {
        return withCookie(
          NextResponse.json({
            message:
              "You've used up today's free AI conversations (1/day, 3/week). Come back later, or skip the chat — the generator already knows hundreds of stacks: envsetup.dev/generator or `npx @envsetup/cli init`.",
            rateLimited: true,
          }),
        )
      }
      if (!alreadyRecorded) {
        await recordSession(sessionId, ip, cookieId)
      }
    }

    // RAG: search knowledge base for relevant context
    const query = extractQuery(messages)
    const chunks = await searchKnowledge(query, 4)
    const context = buildContext(chunks)

    const model = getModel()
    let responsePayload: { message: string } | null = null

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
          responsePayload = { message: text }
        }
      } catch (aiErr) {
        console.error("LLM failed, using RAG fallback:", aiErr)
      }
    }

    if (!responsePayload) {
      // RAG-enhanced fallback: use retrieved context even without LLM
      if (chunks.length > 0) {
        const topChunk = chunks[0]
        responsePayload = {
          message: `Based on your request:\n\n**${topChunk.title}**\n${topChunk.content}\n\n→ Generate your environment: \`npx @envsetup/cli init\` or [envsetup.dev/generator](https://envsetup.dev/generator)`,
        }
      } else {
        responsePayload = { message: smartFallback(messages, context) }
      }
    }

    return withCookie(NextResponse.json(responsePayload))
  } catch (err) {
    console.error("Route error:", err)
    return NextResponse.json({ message: smartFallback([], "") })
  }
}
