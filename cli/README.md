# @envsetup/cli

> Generate production-ready development environments in seconds.

```bash
npx @envsetup/cli init
```

**Dockerfile · docker-compose.yml · .env.example · README** — all auto-generated for your stack.

---

## Quick Start

```bash
npx @envsetup/cli init
```

Answer a few prompts → get a fully configured dev environment.

```
✔ Project name: my-api
✔ Tech stack: FastAPI (Python)
✔ Database: PostgreSQL
✔ Additional tools: Redis Cache
✔ Generate files? Yes

✓ Generated 5 files

  Files created:
    my-api/Dockerfile
    my-api/docker-compose.yml
    my-api/.env.example
    my-api/README.md
    my-api/.gitignore

  Next steps:
    cd my-api
    docker compose up -d
```

---

## Supported Stacks

| Language | Frameworks |
|---|---|
| **TypeScript** | Next.js, NestJS, SvelteKit, Nuxt.js, Remix, Astro, Hono, Elysia+Bun |
| **JavaScript** | Express.js, Fastify, Koa, Hapi, AdonisJS |
| **Python** | FastAPI, Django, Flask, Litestar |
| **Java** | Spring Boot, Quarkus, Micronaut |
| **Kotlin** | Ktor, Spring Boot |
| **Go** | Gin, Fiber, Echo, Chi |
| **Rust** | Actix Web, Axum, Rocket |
| **PHP** | Laravel, Symfony, CodeIgniter |
| **Ruby** | Ruby on Rails, Sinatra |
| **C#** | ASP.NET Core, Minimal API |
| **Elixir** | Phoenix |

## Supported Databases

PostgreSQL · MySQL · MongoDB · SQLite · Redis

## What Gets Generated

| File | Description |
|---|---|
| `Dockerfile` | Version-correct base image for your stack |
| `docker-compose.yml` | App + database services wired up |
| `.env.example` | All required environment variables |
| `README.md` | Setup instructions |
| `.gitignore` | Sensible defaults |
| `.github/workflows/ci.yml` | *(optional)* GitHub Actions CI |
| `.devcontainer/devcontainer.json` | *(optional)* VS Code Dev Container |

## Version Compatibility

The CLI uses the correct base Docker images for each stack:

```
FastAPI → python:3.12-slim
Django  → python:3.12-slim
Next.js → node:20-alpine
Gin     → golang:1.22-alpine
Actix   → rust:1.75-alpine
Spring  → eclipse-temurin:21-jdk-alpine  (Java 17+ required)
Laravel → php:8.3-fpm-alpine
Rails   → ruby:3.3-alpine
```

## Commands

```bash
# Interactive setup
npx @envsetup/cli init

# With AI recommendations
npx @envsetup/cli init --ai

# Check system prerequisites
npx @envsetup/cli doctor
```

### `doctor` — Check your system

```bash
npx @envsetup/cli doctor

  ✔ Node.js: v20.11.0
  ✔ Docker: Docker version 25.0.3
  ✔ Docker Compose (v2): Docker Compose version v2.24.5
  ✔ Git: git version 2.43.0
  
  ✨ Your system is ready for envsetup.dev!
```

---

## Web App

Prefer a visual interface? Try **[envsetup.dev](https://envsetup.dev)** — 322 templates, AI assistant, browser-based generator.

---

## License

MIT © [envsetup.dev](https://envsetup.dev)
