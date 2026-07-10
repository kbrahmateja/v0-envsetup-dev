import { sql } from "@/lib/db"
import { NextResponse } from "next/server"

const knowledge = [
  { category: "language", tags: ["java","spring boot","jvm","enterprise"], title: "Java Spring Boot", content: "Java Spring Boot 3.2 with PostgreSQL. Requires Java 17+. Docker: eclipse-temurin:21-jdk-alpine. Maven/Gradle build. Spring Security for auth, Spring Data JPA ORM. Port 8080. Environment variables: SPRING_DATASOURCE_URL, SPRING_DATASOURCE_USERNAME, SPRING_DATASOURCE_PASSWORD." },
  { category: "language", tags: ["python","fastapi","async","modern"], title: "Python FastAPI", content: "FastAPI modern async Python framework. Python 3.12, python:3.12-slim Docker. SQLAlchemy 2.x + Alembic migrations. Auto Swagger/OpenAPI docs at /docs. Port 8000. uvicorn for server." },
  { category: "language", tags: ["python","django","batteries","full-stack"], title: "Python Django", content: "Django 5.0 requires Python 3.10+. python:3.12-slim Docker. Django REST Framework for APIs. Built-in admin, auth, ORM. Celery+Redis for async tasks. Port 8000." },
  { category: "language", tags: ["python","flask","minimal","lightweight"], title: "Python Flask", content: "Flask minimal Python framework. python:3.12-slim. Simple and flexible. SQLAlchemy ORM. Good for small APIs." },
  { category: "language", tags: ["typescript","nestjs","enterprise","scalable"], title: "TypeScript NestJS", content: "NestJS enterprise Node.js TypeScript framework. node:20-alpine Docker. Modular, decorators-based. TypeORM or Prisma. Port 3000." },
  { category: "language", tags: ["typescript","nextjs","react","fullstack","vercel"], title: "TypeScript Next.js", content: "Next.js 15 fullstack React. TypeScript, SSR, App Router. node:20-alpine. Prisma ORM, Tailwind CSS. Deploy free on Vercel. Port 3000." },
  { category: "language", tags: ["go","golang","gin","fast","high-performance"], title: "Go Gin", content: "Go Gin web framework. golang:1.22-alpine multi-stage build. GORM ORM. Very fast, minimal memory. Port 8080." },
  { category: "language", tags: ["go","golang","fiber","express-like"], title: "Go Fiber", content: "Go Fiber fastest Go framework. golang:1.22-alpine. Express-inspired API. Port 8080." },
  { category: "language", tags: ["rust","actix","blazing-fast","systems"], title: "Rust Actix Web", content: "Rust Actix-web ultra-fast. rust:1.75-alpine multi-stage. SQLx async DB. Port 8080." },
  { category: "language", tags: ["php","laravel","mysql","full-featured"], title: "PHP Laravel", content: "Laravel 11, PHP 8.2+. php:8.3-fpm-alpine. MySQL or PostgreSQL. Eloquent ORM. Redis queues. Port 9000 with nginx." },
  { category: "language", tags: ["ruby","rails","convention","mvc"], title: "Ruby on Rails", content: "Rails 7.1, Ruby 3.1+. ruby:3.3-alpine. ActiveRecord ORM, convention-over-configuration. Port 3000." },
  { category: "language", tags: ["csharp","dotnet","microsoft","aspnet"], title: "C# ASP.NET Core", content: ".NET 8 LTS. mcr.microsoft.com/dotnet/sdk:8.0-alpine. Entity Framework Core. SQL Server or PostgreSQL. Port 8080." },
  { category: "language", tags: ["elixir","phoenix","realtime","concurrent"], title: "Elixir Phoenix", content: "Phoenix 1.7, Elixir 1.16. elixir:1.16-alpine. Ecto ORM, LiveView realtime. PostgreSQL. Port 4000." },
  { category: "database", tags: ["postgres","postgresql","relational","recommended"], title: "PostgreSQL", content: "PostgreSQL 16-alpine Docker. Port 5432. Best choice for most apps. ACID, complex queries. Free on Neon, Supabase, Railway." },
  { category: "database", tags: ["mysql","relational","popular"], title: "MySQL", content: "MySQL 8.3 Docker. Port 3306. Popular relational DB." },
  { category: "database", tags: ["mongodb","nosql","document","flexible"], title: "MongoDB", content: "MongoDB 7.0 Docker. Port 27017. NoSQL document DB. Flexible schema." },
  { category: "database", tags: ["redis","cache","queue","session"], title: "Redis", content: "Redis 7.2-alpine Docker. Port 6379. Cache, pub/sub, job queues. Use with Celery or Bull." },
  { category: "database", tags: ["sqlite","embedded","simple","zero-config"], title: "SQLite", content: "SQLite embedded, no separate service. Good for dev, small apps." },
  { category: "architecture", tags: ["monolith","simple","startup","single-app"], title: "Monolithic Architecture", content: "Single deployable unit. Simple to develop. Best for startups. docker-compose with app + DB." },
  { category: "architecture", tags: ["microservices","scalable","distributed","complex"], title: "Microservices", content: "Multiple independent services with own DBs. API gateway. Complex but scalable. Use Docker Compose or Kubernetes." },
  { category: "architecture", tags: ["monorepo","turborepo","shared","typescript"], title: "Monorepo", content: "Single repo, multiple apps. Turborepo or Nx. Shared TypeScript types between FE and BE." },
  { category: "stack", tags: ["spring boot","react","java","monorepo","fullstack"], title: "Spring Boot + React", content: "Java Spring Boot backend (port 8080) + React frontend (port 3000). docker-compose both. eclipse-temurin:21 backend, node:20 frontend. PostgreSQL. Maven build." },
  { category: "stack", tags: ["fastapi","nextjs","python","typescript","fullstack"], title: "FastAPI + Next.js", content: "FastAPI Python backend (port 8000) + Next.js frontend (port 3000). CORS needed. PostgreSQL shared." },
  { category: "stack", tags: ["mern","mongodb","express","react","nodejs"], title: "MERN Stack", content: "MongoDB + Express + React + Node.js. All JavaScript. MongoDB for DB, Express REST API, React frontend. node:20-alpine." },
  { category: "stack", tags: ["t3","trpc","prisma","nextauth","nextjs"], title: "T3 Stack", content: "Next.js + tRPC + Prisma + NextAuth. TypeScript end-to-end type safety. PostgreSQL. Vercel deploy." },
  { category: "cloud", tags: ["vercel","free","nextjs","serverless"], title: "Vercel", content: "Vercel free for personal projects. Best for Next.js. Serverless functions. Auto HTTPS CDN." },
  { category: "cloud", tags: ["railway","easy","full-stack","docker"], title: "Railway", content: "Railway easy deployment. Free $5/month. Docker support. PostgreSQL, Redis built-in." },
  { category: "cloud", tags: ["aws","amazon","ecs","lambda","rds"], title: "AWS", content: "AWS ECS for Docker, Lambda serverless, RDS for PostgreSQL/MySQL. Complex but powerful." },
  { category: "versions", tags: ["node","nodejs","20","lts"], title: "Node.js Versions", content: "Node.js 20 LTS recommended. Next.js 15 needs Node 18.17+. Docker: node:20-alpine." },
  { category: "versions", tags: ["python","3.12","latest"], title: "Python Versions", content: "Python 3.12 recommended. Django 5 needs 3.10+. Docker: python:3.12-slim." },
  { category: "versions", tags: ["java","21","lts","17"], title: "Java Versions", content: "Java 21 LTS recommended. Spring Boot 3 needs Java 17+. Docker: eclipse-temurin:21-jdk-alpine." },
]

export const maxDuration = 30

export async function GET(_req: Request) {
  try {
    await sql`
      CREATE TABLE IF NOT EXISTS knowledge_base (
        id SERIAL PRIMARY KEY,
        category VARCHAR(50) NOT NULL,
        tags TEXT[] NOT NULL DEFAULT '{}',
        title VARCHAR(200) NOT NULL,
        content TEXT NOT NULL,
        created_at TIMESTAMPTZ DEFAULT NOW()
      )
    `
    // Functional GIN index — no generated column needed
    await sql`
      CREATE INDEX IF NOT EXISTS idx_kb_fts ON knowledge_base
      USING GIN(to_tsvector('english', title || ' ' || content))
    `
    await sql`CREATE INDEX IF NOT EXISTS idx_kb_tags ON knowledge_base USING GIN(tags)`

    // Dedupe any rows left over from before `title` was unique (repeated GET calls
    // used to insert the same seed data again every time — ON CONFLICT DO NOTHING
    // with no unique constraint never actually conflicted).
    await sql`
      DELETE FROM knowledge_base a USING knowledge_base b
      WHERE a.id > b.id AND a.title = b.title
    `
    await sql`
      ALTER TABLE knowledge_base ADD CONSTRAINT knowledge_base_title_key UNIQUE (title)
    `.catch(() => {})

    for (const item of knowledge) {
      await sql`
        INSERT INTO knowledge_base (category, tags, title, content)
        VALUES (${item.category}, ${item.tags}, ${item.title}, ${item.content})
        ON CONFLICT (title) DO UPDATE SET
          category = EXCLUDED.category,
          tags = EXCLUDED.tags,
          content = EXCLUDED.content
      `
    }

    const rows = await sql`SELECT COUNT(*) as total FROM knowledge_base`
    return Response.json({ success: true, total: (rows as any[])[0]?.total, seeded: knowledge.length })
  } catch (err) {
    return Response.json({ error: String(err) }, { status: 500 })
  }
}
