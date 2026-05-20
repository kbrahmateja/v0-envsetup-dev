import fs from 'fs-extra';
import path from 'path';

interface ProjectConfig {
  name: string;
  stack: string;
  language?: string;
  framework?: string;
  database: string;
  tools: string[];
  devops: string[];
  ide?: string;
  testing?: string[];
  architecture?: string;
  cloud?: string;
}

// Version matrix — same as web app lib/versions.ts
const dockerImages: Record<string, string> = {
  nextjs: 'node:20-alpine', nestjs: 'node:20-alpine', express: 'node:20-alpine',
  fastify: 'node:20-alpine', sveltekit: 'node:20-alpine', nuxtjs: 'node:20-alpine',
  remix: 'node:20-alpine', hono: 'node:20-alpine',
  fastapi: 'python:3.12-slim', django: 'python:3.12-slim', flask: 'python:3.12-slim',
  springboot: 'eclipse-temurin:21-jdk-alpine', quarkus: 'eclipse-temurin:21-jdk-alpine',
  ktor: 'eclipse-temurin:21-jdk-alpine',
  gin: 'golang:1.22-alpine', fiber: 'golang:1.22-alpine', echo: 'golang:1.22-alpine',
  actix: 'rust:1.75-alpine', axum: 'rust:1.75-alpine',
  laravel: 'php:8.3-fpm-alpine', rails: 'ruby:3.3-alpine',
  aspnet: 'mcr.microsoft.com/dotnet/sdk:8.0-alpine',
  phoenix: 'elixir:1.16-alpine',
}

const ports: Record<string, number> = {
  nextjs: 3000, nestjs: 3000, express: 3000, fastify: 3000, sveltekit: 5173,
  nuxtjs: 3000, remix: 3000, hono: 3000,
  fastapi: 8000, django: 8000, flask: 8000,
  springboot: 8080, quarkus: 8080, ktor: 8080,
  gin: 8080, fiber: 8080, echo: 8080,
  actix: 8080, axum: 8080,
  laravel: 9000, rails: 3000, aspnet: 8080, phoenix: 4000,
}

const startCmds: Record<string, string> = {
  nextjs: 'npm run dev', nestjs: 'npm run start:dev', express: 'node src/index.js',
  fastify: 'node src/index.js', sveltekit: 'npm run dev', nuxtjs: 'npm run dev',
  remix: 'npm run dev', hono: 'npm run dev',
  fastapi: 'uvicorn main:app --host 0.0.0.0 --port 8000 --reload',
  django: 'python manage.py runserver 0.0.0.0:8000',
  flask: 'flask run --host 0.0.0.0 --port 8000',
  springboot: 'java -jar app.jar', quarkus: './mvnw quarkus:dev',
  ktor: './gradlew run', gin: './main', fiber: './main', echo: './main',
  actix: './app', axum: './app',
  laravel: 'php artisan serve --host 0.0.0.0 --port 9000',
  rails: 'rails server -b 0.0.0.0', aspnet: 'dotnet run', phoenix: 'mix phx.server',
}

function isNodeStack(stack: string): boolean {
  return ['nextjs','nestjs','express','fastify','sveltekit','nuxtjs','remix','hono'].includes(stack)
}
function isPythonStack(stack: string): boolean {
  return ['fastapi','django','flask'].includes(stack)
}
function isJvmStack(stack: string): boolean {
  return ['springboot','quarkus','ktor'].includes(stack)
}
function isGoStack(stack: string): boolean {
  return ['gin','fiber','echo'].includes(stack)
}

function generateDockerfile(cfg: ProjectConfig): string {
  const img = dockerImages[cfg.stack] ?? 'node:20-alpine'
  const port = ports[cfg.stack] ?? 3000
  const cmd = startCmds[cfg.stack] ?? 'npm start'

  if (isNodeStack(cfg.stack)) {
    return `FROM ${img}
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
EXPOSE ${port}
CMD ["sh", "-c", "${cmd}"]
`
  }
  if (isPythonStack(cfg.stack)) {
    return `FROM ${img}
WORKDIR /app
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt
COPY . .
EXPOSE ${port}
CMD ["sh", "-c", "${cmd}"]
`
  }
  if (isJvmStack(cfg.stack)) {
    const isKtor = cfg.stack === 'ktor'
    return `FROM ${img} AS builder
WORKDIR /app
COPY ${isKtor ? 'build.gradle* settings.gradle* gradlew' : 'pom.xml'} ./
${isKtor ? 'COPY gradle gradle\nRUN ./gradlew dependencies' : 'RUN mvn dependency:go-offline'}
COPY src ./src
RUN ${isKtor ? './gradlew shadowJar' : 'mvn package -DskipTests'}

FROM eclipse-temurin:21-jre-alpine
WORKDIR /app
COPY --from=builder /app/${isKtor ? 'build/libs/*.jar' : 'target/*.jar'} app.jar
EXPOSE ${port}
CMD ["java", "-jar", "app.jar"]
`
  }
  if (isGoStack(cfg.stack)) {
    return `FROM ${img} AS builder
WORKDIR /app
COPY go.mod go.sum ./
RUN go mod download
COPY . .
RUN CGO_ENABLED=0 GOOS=linux go build -o main .

FROM alpine:3.19
COPY --from=builder /app/main .
EXPOSE ${port}
CMD ["./main"]
`
  }
  return `FROM ${img}
WORKDIR /app
COPY . .
EXPOSE ${port}
CMD ["sh", "-c", "${cmd}"]
`
}

function generateDockerCompose(cfg: ProjectConfig): string {
  const port = ports[cfg.stack] ?? 3000
  const dbServices: string[] = []
  const depends: string[] = []
  const envLines: string[] = ['      - NODE_ENV=development']

  if (cfg.database === 'postgres') {
    depends.push('postgres')
    envLines.push('      - DATABASE_URL=postgresql://postgres:password@postgres:5432/' + cfg.name)
    dbServices.push(`  postgres:
    image: postgres:16-alpine
    environment:
      POSTGRES_PASSWORD: password
      POSTGRES_DB: ${cfg.name}
    ports: ['5432:5432']
    volumes: [postgres_data:/var/lib/postgresql/data]`)
  } else if (cfg.database === 'mysql') {
    depends.push('mysql')
    envLines.push('      - DATABASE_URL=mysql://app:password@mysql:3306/' + cfg.name)
    dbServices.push(`  mysql:
    image: mysql:8.3
    environment:
      MYSQL_ROOT_PASSWORD: password
      MYSQL_DATABASE: ${cfg.name}
    ports: ['3306:3306']
    volumes: [mysql_data:/var/lib/mysql]`)
  } else if (cfg.database === 'mongodb') {
    depends.push('mongodb')
    envLines.push('      - DATABASE_URL=mongodb://root:password@mongodb:27017/' + cfg.name)
    dbServices.push(`  mongodb:
    image: mongo:7.0
    environment:
      MONGO_INITDB_ROOT_USERNAME: root
      MONGO_INITDB_ROOT_PASSWORD: password
    ports: ['27017:27017']
    volumes: [mongo_data:/data/db]`)
  }

  if (cfg.tools.includes('redis') || cfg.database === 'redis') {
    depends.push('redis')
    envLines.push('      - REDIS_URL=redis://redis:6379')
    dbServices.push(`  redis:
    image: redis:7.2-alpine
    ports: ['6379:6379']`)
  }
  if (cfg.tools.includes('meilisearch')) {
    depends.push('meilisearch')
    dbServices.push(`  meilisearch:
    image: getmeili/meilisearch:latest
    ports: ['7700:7700']`)
  }
  if (cfg.tools.includes('minio')) {
    depends.push('minio')
    dbServices.push(`  minio:
    image: minio/minio
    command: server /data
    ports: ['9000:9000']
    volumes: [minio_data:/data]`)
  }

  const depStr = depends.length > 0
    ? `\n    depends_on: [${depends.join(', ')}]`
    : ''
  const volNames = [...depends.filter(d => !['redis','meilisearch'].includes(d)).map(d => d + '_data')]
  const volStr = volNames.length > 0 ? `\nvolumes:\n${volNames.map(v => `  ${v}:`).join('\n')}` : ''

  return `version: '3.9'

services:
  app:
    build: .
    ports: ['${port}:${port}']
    environment:
${envLines.join('\n')}${depStr}

${dbServices.join('\n\n')}${volStr}
`
}

function generateEnvExample(cfg: ProjectConfig): string {
  const port = ports[cfg.stack] ?? 3000
  const lines = [
    `# ${cfg.name} environment variables`,
    `NODE_ENV=development`,
    `PORT=${port}`,
    '',
  ]
  if (cfg.database === 'postgres') lines.push('DATABASE_URL=postgresql://postgres:password@localhost:5432/' + cfg.name, '')
  if (cfg.database === 'mysql') lines.push('DATABASE_URL=mysql://app:password@localhost:3306/' + cfg.name, '')
  if (cfg.database === 'mongodb') lines.push('DATABASE_URL=mongodb://localhost:27017/' + cfg.name, '')
  if (cfg.tools.includes('redis') || cfg.database === 'redis') lines.push('REDIS_URL=redis://localhost:6379', '')
  lines.push('SECRET_KEY=change_me_in_production')
  return lines.join('\n')
}

function generateReadme(cfg: ProjectConfig): string {
  const port = ports[cfg.stack] ?? 3000
  return `# ${cfg.name}

> Generated by [envsetup.dev](https://envsetup.dev) CLI

## Stack
- **Framework**: ${cfg.stack}
- **Database**: ${cfg.database}

## Quick start
\`\`\`bash
cp .env.example .env
docker compose up -d
\`\`\`

App runs on http://localhost:${port}

---
Generated with: \`npx @envsetup/cli init\`
`
}




// ── Complete Dependency Generator — All 21 Languages ────────────────────────
function generateDependencies(cfg: ProjectConfig): string | null {
  const stack = cfg.stack?.toLowerCase() ?? ''
  const lang = (cfg.language ?? '').toLowerCase()
  const features = [...(cfg.tools ?? []), ...(cfg.testing ?? [])]
  const db = cfg.database ?? 'none'

  const hasAuth    = features.some(f => ['auth','jwt','oauth'].includes(f))
  const hasRedis   = features.includes('redis') || db === 'redis'
  const hasMail    = features.some(f => ['email','mail'].includes(f))
  const hasQueue   = features.some(f => ['queue','worker','celery','bull'].includes(f))
  const hasCache   = features.includes('caching') || hasRedis
  const testing    = cfg.testing ?? []

  // ── JavaScript / TypeScript ─────────────────────────────────────────────
  if (['express','fastify','nestjs','nextjs','nuxtjs','hono','elysia','sveltekit','remix','astro','koa','adonis'].includes(stack)) {
    const deps: Record<string,string> = {}
    const devDeps: Record<string,string> = {}

    // Framework core
    if (stack === 'nestjs')   Object.assign(deps, { "@nestjs/common":"^10.0.0","@nestjs/core":"^10.0.0","@nestjs/platform-express":"^10.0.0","reflect-metadata":"^0.1.13","rxjs":"^7.8.0","class-validator":"^0.14.0","class-transformer":"^0.5.1" })
    if (stack === 'express')  Object.assign(deps, { "express":"^4.18.0","cors":"^2.8.5","helmet":"^7.0.0","morgan":"^1.10.0","express-validator":"^7.0.0" })
    if (stack === 'fastify')  Object.assign(deps, { "fastify":"^4.24.0","@fastify/cors":"^8.4.0","@fastify/helmet":"^11.1.0","@fastify/jwt":"^7.2.0" })
    if (stack === 'nextjs')   Object.assign(deps, { "next":"^15.0.0","react":"^19.0.0","react-dom":"^19.0.0" })
    if (stack === 'nuxtjs')   Object.assign(deps, { "nuxt":"^3.9.0","vue":"^3.4.0","@nuxt/ui":"^2.12.0" })
    if (stack === 'sveltekit') Object.assign(deps, { "@sveltejs/kit":"^2.0.0","svelte":"^4.0.0" })
    if (stack === 'remix')    Object.assign(deps, { "@remix-run/node":"^2.4.0","@remix-run/react":"^2.4.0","@remix-run/serve":"^2.4.0","react":"^18.2.0","react-dom":"^18.2.0" })
    if (stack === 'hono')     Object.assign(deps, { "hono":"^4.0.0" })
    if (stack === 'elysia')   Object.assign(deps, { "elysia":"^1.0.0","@elysiajs/cors":"^1.0.0","@elysiajs/swagger":"^1.0.0" })
    if (stack === 'koa')      Object.assign(deps, { "koa":"^2.15.0","koa-router":"^12.0.0","koa-cors":"^0.0.16","koa-bodyparser":"^4.4.0" })
    if (stack === 'astro')    Object.assign(deps, { "astro":"^4.0.0" })

    // Database
    if (db === 'postgres') Object.assign(deps, stack === 'nestjs'
      ? { "@nestjs/typeorm":"^10.0.0","typeorm":"^0.3.0","pg":"^8.11.0" }
      : stack === 'nextjs' ? { "@prisma/client":"^5.0.0","prisma":"^5.0.0" }
      : { "pg":"^8.11.0","knex":"^3.0.0" })
    if (db === 'mysql')    Object.assign(deps, { "mysql2":"^3.6.0" })
    if (db === 'mongodb')  Object.assign(deps, stack === 'nestjs' ? { "@nestjs/mongoose":"^10.0.0","mongoose":"^8.0.0" } : { "mongoose":"^8.0.0" })
    if (db === 'sqlite')   Object.assign(deps, { "better-sqlite3":"^9.4.0" })
    if (db === 'redis' || hasRedis) Object.assign(deps, { "ioredis":"^5.3.0" })

    // Auth
    if (hasAuth) Object.assign(deps, stack === 'nestjs'
      ? { "@nestjs/jwt":"^10.0.0","@nestjs/passport":"^10.0.0","passport-jwt":"^4.0.0","bcryptjs":"^2.4.3" }
      : { "jsonwebtoken":"^9.0.0","bcryptjs":"^2.4.3" })

    // Queue
    if (hasQueue) Object.assign(deps, stack === 'nestjs' ? { "@nestjs/bull":"^10.0.0","bull":"^4.12.0" } : { "bull":"^4.12.0" })
    if (hasMail) Object.assign(deps, stack === 'nestjs' ? { "@nestjs-modules/mailer":"^2.0.0","nodemailer":"^6.9.0" } : { "nodemailer":"^6.9.0" })

    // TypeScript devDeps
    Object.assign(devDeps, { "typescript":"^5.0.0","@types/node":"^20.0.0","ts-node":"^10.9.0","nodemon":"^3.0.0","eslint":"^8.0.0","prettier":"^3.0.0" })
    if (testing.includes('jest'))       Object.assign(devDeps, { "jest":"^29.0.0","@types/jest":"^29.0.0","ts-jest":"^29.0.0","supertest":"^6.3.0" })
    if (testing.includes('vitest'))     Object.assign(devDeps, { "vitest":"^1.0.0","@vitest/ui":"^1.0.0" })
    if (testing.includes('playwright')) Object.assign(devDeps, { "@playwright/test":"^1.40.0" })

    return JSON.stringify({
      name: cfg.name, version: "0.1.0", private: true,
      scripts: {
        start: stack === 'nextjs' ? "next start" : stack === 'nestjs' ? "node dist/main.js" : "node src/index.js",
        dev: stack === 'nextjs' ? "next dev" : stack === 'nestjs' ? "nest start --watch" : "nodemon src/index.ts",
        build: stack === 'nextjs' ? "next build" : "tsc -p tsconfig.json",
        test: testing.length ? (testing.includes('vitest') ? "vitest" : "jest") : "echo \"No tests configured\"",
        lint: "eslint . --ext .ts,.tsx"
      },
      dependencies: deps, devDependencies: devDeps
    }, null, 2)
  }

  // ── Python ──────────────────────────────────────────────────────────────
  if (['fastapi','django','flask','litestar','tornado','sanic','falcon','starlette'].includes(stack)) {
    const reqs: string[] = []
    if (stack === 'fastapi')    reqs.push('fastapi>=0.109.0', 'uvicorn[standard]>=0.27.0', 'pydantic>=2.0.0', 'pydantic-settings>=2.0.0')
    if (stack === 'django')     reqs.push('django>=5.0', 'djangorestframework>=3.14.0', 'django-cors-headers>=4.0.0', 'gunicorn>=21.0.0')
    if (stack === 'flask')      reqs.push('flask>=3.0.0', 'flask-restx>=1.3.0', 'flask-cors>=4.0.0', 'gunicorn>=21.0.0')
    if (stack === 'litestar')   reqs.push('litestar>=2.0.0', 'uvicorn>=0.27.0')
    if (stack === 'tornado')    reqs.push('tornado>=6.4')
    if (stack === 'sanic')      reqs.push('sanic>=23.12.0', 'sanic-ext>=23.12.0')
    if (stack === 'falcon')     reqs.push('falcon>=3.1.0', 'gunicorn>=21.0.0')
    if (stack === 'starlette')  reqs.push('starlette>=0.36.0', 'uvicorn>=0.27.0')

    if (db === 'postgres') reqs.push('sqlalchemy>=2.0.0', 'alembic>=1.13.0', 'psycopg2-binary>=2.9.0')
    if (db === 'mysql')    reqs.push('sqlalchemy>=2.0.0', 'mysqlclient>=2.2.0')
    if (db === 'mongodb')  reqs.push('motor>=3.3.0', 'beanie>=1.25.0')
    if (db === 'sqlite')   reqs.push('sqlalchemy>=2.0.0', 'aiosqlite>=0.19.0')
    if (hasAuth)   reqs.push('python-jose[cryptography]>=3.3.0', 'passlib[bcrypt]>=1.7.4', 'python-multipart>=0.0.9')
    if (hasRedis)  reqs.push('redis>=5.0.0')
    if (hasQueue)  reqs.push('celery[redis]>=5.3.0')
    if (hasMail)   reqs.push('fastapi-mail>=1.4.0')
    reqs.push('', '# Dev / Testing')
    if (testing.includes('pytest')) reqs.push('pytest>=7.4.0', 'pytest-asyncio>=0.23.0', 'pytest-cov>=4.1.0', 'httpx>=0.27.0')
    if (testing.includes('factory-boy')) reqs.push('factory-boy>=3.3.0')
    reqs.push('black>=23.0.0', 'ruff>=0.1.0', 'mypy>=1.8.0')
    return reqs.join('\n')
  }

  // ── Java (Maven) ────────────────────────────────────────────────────────
  if (['springboot','quarkus','micronaut','javalin','sparkjava','dropwizard','vertx'].includes(stack)) {
    const starters: string[] = ['spring-boot-starter-web', 'spring-boot-starter-actuator', 'spring-boot-starter-validation']
    if (db === 'postgres')  starters.push('spring-boot-starter-data-jpa', 'postgresql')
    if (db === 'mysql')     starters.push('spring-boot-starter-data-jpa', 'mysql-connector-j')
    if (db === 'mongodb')   starters.push('spring-boot-starter-data-mongodb')
    if (db === 'redis' || hasRedis) starters.push('spring-boot-starter-data-redis')
    if (hasAuth) starters.push('spring-boot-starter-security', 'jjwt-api', 'jjwt-impl')
    if (hasQueue) starters.push('spring-boot-starter-amqp')
    if (hasMail) starters.push('spring-boot-starter-mail')
    if (testing.includes('junit5')) starters.push('spring-boot-starter-test')
    if (testing.includes('testcontainers')) starters.push('testcontainers', 'testcontainers-junit-jupiter')

    const groupIds: Record<string,string> = {
      'spring-boot-starter-web': 'org.springframework.boot',
      'spring-boot-starter-data-jpa': 'org.springframework.boot',
      'spring-boot-starter-security': 'org.springframework.boot',
      'spring-boot-starter-data-redis': 'org.springframework.boot',
      'spring-boot-starter-test': 'org.springframework.boot',
      'spring-boot-starter-mail': 'org.springframework.boot',
      'spring-boot-starter-actuator': 'org.springframework.boot',
      'spring-boot-starter-validation': 'org.springframework.boot',
      'spring-boot-starter-data-mongodb': 'org.springframework.boot',
      'spring-boot-starter-amqp': 'org.springframework.boot',
      'postgresql': 'org.postgresql',
      'mysql-connector-j': 'com.mysql',
      'jjwt-api': 'io.jsonwebtoken',
      'jjwt-impl': 'io.jsonwebtoken',
      'testcontainers': 'org.testcontainers',
      'testcontainers-junit-jupiter': 'org.testcontainers',
    }
    const depXml = starters.map(d =>
      `    <dependency>\n      <groupId>${groupIds[d] ?? 'org.springframework.boot'}</groupId>\n      <artifactId>${d}</artifactId>\n    </dependency>`
    ).join('\n')

    return `<?xml version="1.0" encoding="UTF-8"?>
<project xmlns="http://maven.apache.org/POM/4.0.0" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
  xsi:schemaLocation="http://maven.apache.org/POM/4.0.0 https://maven.apache.org/xsd/maven-4.0.0.xsd">
  <modelVersion>4.0.0</modelVersion>
  <parent>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-parent</artifactId>
    <version>3.2.0</version>
  </parent>
  <groupId>com.example</groupId>
  <artifactId>${cfg.name}</artifactId>
  <version>0.0.1-SNAPSHOT</version>
  <properties><java.version>21</java.version></properties>
  <dependencies>
${depXml}
  </dependencies>
  <build><plugins><plugin>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-maven-plugin</artifactId>
  </plugin></plugins></build>
</project>`
  }

  // ── Kotlin (Gradle) ─────────────────────────────────────────────────────
  if (lang === 'kotlin') {
    const libs: string[] = [
      'implementation("org.springframework.boot:spring-boot-starter-web")',
      'implementation("com.fasterxml.jackson.module:jackson-module-kotlin")',
      'implementation("org.jetbrains.kotlin:kotlin-reflect")',
    ]
    if (db === 'postgres') libs.push('implementation("org.springframework.boot:spring-boot-starter-data-jpa")', 'runtimeOnly("org.postgresql:postgresql")')
    if (db === 'mongodb') libs.push('implementation("org.springframework.boot:spring-boot-starter-data-mongodb")')
    if (hasAuth) libs.push('implementation("org.springframework.boot:spring-boot-starter-security")', 'implementation("io.jsonwebtoken:jjwt-api:0.12.3")')
    if (hasRedis) libs.push('implementation("org.springframework.boot:spring-boot-starter-data-redis")')
    if (testing.includes('junit5')) libs.push('testImplementation("org.springframework.boot:spring-boot-starter-test")', 'testImplementation("io.mockk:mockk:1.13.8")')

    return `plugins {
  id("org.springframework.boot") version "3.2.0"
  id("io.spring.dependency-management") version "1.1.4"
  kotlin("jvm") version "1.9.22"
  kotlin("plugin.spring") version "1.9.22"
}

group = "com.example"
version = "0.0.1-SNAPSHOT"

java { sourceCompatibility = JavaVersion.VERSION_21 }

dependencies {
${libs.map(l => '  ' + l).join('\n')}
}

tasks.withType<Test> { useJUnitPlatform() }`
  }

  // ── Go ──────────────────────────────────────────────────────────────────
  if (['gin','fiber','echo','chi','gorilla','beego','buffalo','iris','mux'].includes(stack)) {
    const goMods: string[] = []
    if (stack === 'gin')     goMods.push('github.com/gin-gonic/gin v1.9.1')
    if (stack === 'fiber')   goMods.push('github.com/gofiber/fiber/v2 v2.52.0')
    if (stack === 'echo')    goMods.push('github.com/labstack/echo/v4 v4.11.0')
    if (stack === 'chi')     goMods.push('github.com/go-chi/chi/v5 v5.0.11')
    if (stack === 'gorilla' || stack === 'mux') goMods.push('github.com/gorilla/mux v1.8.1')
    if (stack === 'beego')   goMods.push('github.com/beego/beego/v2 v2.1.1')
    if (stack === 'iris')    goMods.push('github.com/kataras/iris/v12 v12.2.9')

    if (db === 'postgres') goMods.push('gorm.io/gorm v1.25.5', 'gorm.io/driver/postgres v1.5.4')
    if (db === 'mysql')    goMods.push('gorm.io/gorm v1.25.5', 'gorm.io/driver/mysql v1.5.2')
    if (db === 'mongodb')  goMods.push('go.mongodb.org/mongo-driver v1.13.1')
    if (db === 'sqlite')   goMods.push('gorm.io/driver/sqlite v1.5.4')
    if (hasAuth) goMods.push('github.com/golang-jwt/jwt/v5 v5.2.0', 'golang.org/x/crypto v0.17.0')
    if (hasRedis) goMods.push('github.com/redis/go-redis/v9 v9.3.1')
    if (testing.includes('testify')) goMods.push('github.com/stretchr/testify v1.8.4')
    if (testing.includes('mockery') || testing.includes('mockall')) goMods.push('github.com/stretchr/testify/mock v1.8.4')

    return `module ${cfg.name}

go 1.22

require (
${goMods.map(m => '\t' + m).join('\n')}
)`
  }

  // ── Rust ────────────────────────────────────────────────────────────────
  if (['actix','axum','rocket','tide','warp'].includes(stack)) {
    const cargoDeps: string[] = [
      'tokio = { version = "1", features = ["full"] }',
      'serde = { version = "1", features = ["derive"] }',
      'serde_json = "1"',
      'tracing = "0.1"',
      'tracing-subscriber = "0.3"',
      'dotenv = "0.15"',
      'anyhow = "1"',
    ]
    if (stack === 'actix') cargoDeps.push('actix-web = "4"', 'actix-cors = "0.7"', 'actix-web-httpauth = "0.8"')
    if (stack === 'axum')  cargoDeps.push('axum = "0.7"', 'tower-http = { version = "0.5", features = ["cors","trace"] }', 'tower = "0.4"')
    if (stack === 'rocket') cargoDeps.push('rocket = { version = "0.5", features = ["json"] }')
    if (stack === 'warp')  cargoDeps.push('warp = "0.3"')

    if (db === 'postgres') cargoDeps.push('sqlx = { version = "0.7", features = ["runtime-tokio-rustls","postgres","migrate","uuid"] }')
    if (db === 'mysql')    cargoDeps.push('sqlx = { version = "0.7", features = ["runtime-tokio-rustls","mysql"] }')
    if (db === 'sqlite')   cargoDeps.push('sqlx = { version = "0.7", features = ["runtime-tokio-rustls","sqlite"] }')
    if (db === 'mongodb')  cargoDeps.push('mongodb = "2.8"')
    if (hasAuth) cargoDeps.push('jsonwebtoken = "9"', 'bcrypt = "0.15"', 'uuid = { version = "1", features = ["v4"] }')
    if (hasRedis) cargoDeps.push('redis = { version = "0.24", features = ["tokio-comp"] }')
    if (testing.includes('mockall')) cargoDeps.push('[dev-dependencies]\nmockall = "0.12"')

    return `[package]
name = "${cfg.name}"
version = "0.1.0"
edition = "2021"

[dependencies]
${cargoDeps.join('\n')}`
  }

  // ── PHP ─────────────────────────────────────────────────────────────────
  if (['laravel','symfony','slim','codeigniter','yii','cakephp','phalcon'].includes(stack)) {
    const require: Record<string,string> = { "php": "^8.2" }
    const requireDev: Record<string,string> = {}

    if (stack === 'laravel')     Object.assign(require, { "laravel/framework":"^11.0","laravel/tinker":"^2.8" })
    if (stack === 'symfony')     Object.assign(require, { "symfony/framework-bundle":"^7.0","symfony/runtime":"^7.0","doctrine/orm":"^3.0" })
    if (stack === 'slim')        Object.assign(require, { "slim/slim":"^4.12","slim/psr7":"^1.6","php-di/php-di":"^7.0" })
    if (stack === 'codeigniter') Object.assign(require, { "codeigniter4/framework":"^4.4" })

    if (db === 'mysql' || db === 'postgres') Object.assign(require, { "doctrine/dbal":"^3.0" })
    if (db === 'mongodb') Object.assign(require, { "mongodb/laravel-mongodb":"^4.0" })
    if (hasAuth && stack === 'laravel') Object.assign(require, { "laravel/sanctum":"^4.0","laravel/passport":"^12.0" })
    if (hasRedis) Object.assign(require, { "predis/predis":"^2.0" })
    if (hasQueue && stack === 'laravel') Object.assign(require, { "laravel/horizon":"^5.0" })
    if (hasMail && stack === 'laravel') Object.assign(require, { "symfony/mailer":"^7.0" })

    if (testing.includes('phpunit')) Object.assign(requireDev, { "phpunit/phpunit":"^11.0","laravel/pint":"^1.13" })
    if (testing.includes('pest'))    Object.assign(requireDev, { "pestphp/pest":"^2.0","pestphp/pest-plugin-laravel":"^2.0" })

    return JSON.stringify({ require, "require-dev": requireDev }, null, 2)
  }

  // ── Ruby ────────────────────────────────────────────────────────────────
  if (['rails','sinatra','hanami','grape','roda'].includes(stack)) {
    const gems: string[] = ['# frozen_string_literal: true\n', `source "https://rubygems.org"\n`, `ruby "3.3.0"\n`]
    if (stack === 'rails')   gems.push('gem "rails", "~> 7.1.0"', 'gem "puma", ">= 5.0"')
    if (stack === 'sinatra') gems.push('gem "sinatra", "~> 3.2"', 'gem "puma", "~> 6.0"', 'gem "rack-cors"')
    if (stack === 'hanami')  gems.push('gem "hanami", "~> 2.1"')
    if (stack === 'grape')   gems.push('gem "grape", "~> 2.0"', 'gem "rack-cors"')

    if (db === 'postgres') gems.push('gem "pg", "~> 1.5"')
    if (db === 'mysql')    gems.push('gem "mysql2", "~> 0.5"')
    if (db === 'mongodb')  gems.push('gem "mongoid", "~> 8.1"')
    if (db === 'sqlite')   gems.push('gem "sqlite3", "~> 1.4"')
    if (hasAuth)  gems.push('gem "bcrypt", "~> 3.1"', 'gem "jwt", "~> 2.7"')
    if (hasRedis) gems.push('gem "redis", "~> 5.0"')
    if (hasQueue) gems.push('gem "sidekiq", "~> 7.0"')
    if (hasMail && stack === 'rails') gems.push('# mail gem included in Rails')

    gems.push('\ngroup :development, :test do')
    if (testing.includes('rspec')) gems.push('  gem "rspec-rails"', '  gem "factory_bot_rails"', '  gem "faker"')
    gems.push('  gem "rubocop-rails-omakase", require: false', 'end')

    return gems.join('\n')
  }

  // ── C# / .NET ───────────────────────────────────────────────────────────
  if (['aspnet','blazor','minimal_api','orleans'].includes(stack)) {
    const pkgs: string[] = []
    if (db === 'postgres')  pkgs.push('<PackageReference Include="Npgsql.EntityFrameworkCore.PostgreSQL" Version="8.0.0" />')
    if (db === 'mysql')     pkgs.push('<PackageReference Include="Pomelo.EntityFrameworkCore.MySql" Version="8.0.0" />')
    if (db === 'mongodb')   pkgs.push('<PackageReference Include="MongoDB.Driver" Version="2.23.0" />')
    if (db === 'sqlite')    pkgs.push('<PackageReference Include="Microsoft.EntityFrameworkCore.Sqlite" Version="8.0.0" />')
    if (hasAuth) pkgs.push('<PackageReference Include="Microsoft.AspNetCore.Authentication.JwtBearer" Version="8.0.0" />', '<PackageReference Include="BCrypt.Net-Next" Version="4.0.3" />')
    if (hasRedis) pkgs.push('<PackageReference Include="StackExchange.Redis" Version="2.7.4" />')
    if (hasMail) pkgs.push('<PackageReference Include="MailKit" Version="4.3.0" />')
    if (testing.includes('xunit')) pkgs.push('<PackageReference Include="xunit" Version="2.6.4" />', '<PackageReference Include="Moq" Version="4.20.70" />')

    return `<Project Sdk="Microsoft.NET.Sdk.Web">
  <PropertyGroup>
    <TargetFramework>net8.0</TargetFramework>
    <Nullable>enable</Nullable>
    <ImplicitUsings>enable</ImplicitUsings>
  </PropertyGroup>
  <ItemGroup>
    <PackageReference Include="Microsoft.EntityFrameworkCore" Version="8.0.0" />
    <PackageReference Include="Swashbuckle.AspNetCore" Version="6.5.0" />
    <PackageReference Include="Serilog.AspNetCore" Version="8.0.0" />
${pkgs.map(p => '    ' + p).join('\n')}
  </ItemGroup>
</Project>`
  }

  // ── Elixir ──────────────────────────────────────────────────────────────
  if (['phoenix','plug'].includes(stack)) {
    const mixDeps: string[] = [
      `{:phoenix, "~> 1.7.0"}`,
      `{:phoenix_html, "~> 4.0"}`,
      `{:phoenix_live_reload, "~> 1.4", only: :dev}`,
      `{:phoenix_live_view, "~> 0.20.0"}`,
    ]
    if (db === 'postgres') mixDeps.push(`{:ecto_sql, "~> 3.10"}`, `{:postgrex, ">= 0.0.0"}`)
    if (db === 'mysql')    mixDeps.push(`{:ecto_sql, "~> 3.10"}`, `{:myxql, ">= 0.0.0"}`)
    if (hasAuth)  mixDeps.push(`{:bcrypt_elixir, "~> 3.0"}`, `{:comeonin, "~> 5.4"}`)
    if (hasRedis) mixDeps.push(`{:redix, "~> 1.3"}`)
    if (hasMail)  mixDeps.push(`{:swoosh, "~> 1.15"}`)
    if (testing.includes('exunit')) mixDeps.push(`{:mox, "~> 1.1", only: :test}`)

    return `defmodule ${cfg.name}.MixProject do
  use Mix.Project

  def project do
    [app: :${cfg.name.toLowerCase().replace(/-/g,'_')}, version: "0.1.0", elixir: "~> 1.16",
     start_permanent: Mix.env() == :prod, deps: deps()]
  end

  def application do
    [mod: {${cfg.name}.Application, []}, extra_applications: [:logger, :runtime_tools]]
  end

  defp deps do
    [
${mixDeps.map(d => '      ' + d).join(',\n')}
    ]
  end
end`
  }

  // ── Swift ───────────────────────────────────────────────────────────────
  if (['vapor','hummingbird'].includes(stack)) {
    return `// swift-tools-version:5.9
import PackageDescription

let package = Package(
  name: "${cfg.name}",
  platforms: [.macOS(.v13)],
  dependencies: [
    .package(url: "https://github.com/vapor/vapor.git", from: "4.89.0"),
    ${db === 'postgres' ? '.package(url: "https://github.com/vapor/fluent-postgres-driver.git", from: "2.8.0"),' : ''}
    ${hasAuth ? '.package(url: "https://github.com/vapor/jwt.git", from: "4.2.2"),' : ''}
    ${testing.includes('xctest') ? '' : ''}
  ],
  targets: [
    .executableTarget(name: "App", dependencies: [
      .product(name: "Vapor", package: "vapor"),
      ${db === 'postgres' ? '.product(name: "FluentPostgresDriver", package: "fluent-postgres-driver"),' : ''}
    ])
  ]
)`
  }

  // ── Dart / Flutter ──────────────────────────────────────────────────────
  if (['shelf','serverpod'].includes(stack)) {
    return `name: ${cfg.name}
description: ${cfg.name} Dart server
version: 1.0.0
environment:
  sdk: ^3.3.0

dependencies:
  shelf: ^1.4.0
  shelf_router: ^1.1.0
  ${db === 'postgres' ? 'postgres: ^3.3.0' : ''}
  ${hasAuth ? 'dart_jsonwebtoken: ^2.7.0' : ''}
  dotenv: ^4.1.0

dev_dependencies:
  test: ^1.24.0
  lints: ^3.0.0`
  }

  // ── Scala ───────────────────────────────────────────────────────────────
  if (['play','akka','zio'].includes(stack)) {
    return `ThisBuild / scalaVersion := "3.3.1"
ThisBuild / version := "0.1.0-SNAPSHOT"

lazy val root = (project in file("."))
  .settings(
    name := "${cfg.name}",
    libraryDependencies ++= Seq(
      ${stack === 'play' ? '"com.typesafe.play" %% "play" % "3.0.1",' : ''}
      ${stack === 'akka' ? '"com.typesafe.akka" %% "akka-http" % "10.5.3",' : ''}
      ${db === 'postgres' ? '"org.postgresql" % "postgresql" % "42.7.1",' : ''}
      ${db === 'mongodb' ? '"org.mongodb.scala" %% "mongo-scala-driver" % "4.11.1",' : ''}
      ${hasAuth ? '"com.github.jwt-scala" %% "jwt-core" % "10.0.1",' : ''}
      "com.typesafe" % "config" % "1.4.3",
    )
  )`
  }

  // ── Haskell ─────────────────────────────────────────────────────────────
  if (lang === 'haskell') {
    return `cabal-version: 3.0
name: ${cfg.name}
version: 0.1.0.0
executable ${cfg.name}
  main-is: Main.hs
  build-depends:
    base ^>=4.17,
    servant-server ^>=0.20,
    warp ^>=3.3,
    aeson ^>=2.2,
    ${db === 'postgres' ? 'postgresql-simple ^>=0.7,' : ''}
    ${hasAuth ? 'jose ^>=0.11,' : ''}
  default-language: GHC2021`
  }

  // ── Clojure ─────────────────────────────────────────────────────────────
  if (lang === 'clojure') {
    return `{:deps {org.clojure/clojure {:mvn/version "1.11.1"}
        ring/ring-core {:mvn/version "1.11.0"}
        compojure {:mvn/version "1.7.1"}
        ${db === 'postgres' ? 'org.postgresql/postgresql {:mvn/version "42.7.1"}' : ''}
        ${hasAuth ? 'buddy/buddy-auth {:mvn/version "3.0.1"}' : ''}}
 :aliases
 {:dev {:extra-deps {com.bhauman/figwheel-main {:mvn/version "0.2.18"}}}
  :test {:extra-deps {io.github.cognitect-labs/test-runner {:git/tag "v0.5.1"}}}}}`
  }

  // ── Perl ────────────────────────────────────────────────────────────────
  if (lang === 'perl') {
    return `requires "Dancer2", "1.0.0";
requires "Plack", "1.0050";
${db === 'postgres' ? 'requires "DBD::Pg", "3.18.0";' : ''}
${db === 'mysql' ? 'requires "DBD::mysql", "4.050";' : ''}
requires "DBI", "1.643";
${hasAuth ? 'requires "Crypt::Bcrypt", "0.11";' : ''}
on test => sub {
  requires "Test::More", "1.302";
};`
  }

  // ── R ───────────────────────────────────────────────────────────────────
  if (lang === 'r') {
    return `Package: ${cfg.name}
Version: 0.1.0
Imports:
  plumber (>= 1.2.0),
  ${db === 'postgres' ? 'RPostgres (>= 1.4.0),' : ''}
  ${db === 'mongodb' ? 'mongolite (>= 2.7.0),' : ''}
  dplyr (>= 1.1.0),
  jsonlite (>= 1.8.0)
Suggests:
  testthat (>= 3.2.0)`
  }

  // ── Julia ───────────────────────────────────────────────────────────────
  if (lang === 'julia') {
    return `[deps]
Genie = "c43c736e-a2d1-11e8-161f-af95117fbd1e"
${db === 'postgres' ? 'LibPQ = "194296ae-ab2e-5f79-8cd4-7183a0a5a0d7"' : ''}
${db === 'mongodb' ? 'Mongoc = "4fe8b98c-fc19-5c23-8ec2-168ff83495f2"' : ''}
JSON3 = "0f8b85d8-7e73-4b9d-8e23-68e52b7b8088"

[compat]
julia = "1.10"`
  }

  return null
}

export async function generateTemplates(cfg: ProjectConfig): Promise<string[]> {
  const dir = path.join(process.cwd(), cfg.name)
  await fs.ensureDir(dir)
  const created: string[] = []

  const write = async (name: string, content: string) => {
    await fs.writeFile(path.join(dir, name), content)
    created.push(`${cfg.name}/${name}`)
  }

  // Generate dependency file (package.json, requirements.txt, pom.xml, go.mod, Cargo.toml)
  const depFile = generateDependencies(cfg)
  if (depFile) {
    const depFileName =
      ['express','fastify','nestjs','nextjs','hono','elysia'].includes(cfg.stack) ? 'package.json' :
      ['fastapi','django','flask','litestar'].includes(cfg.stack) ? 'requirements.txt' :
      ['springboot','quarkus'].includes(cfg.stack) ? 'pom.xml' :
      ['gin','fiber','echo','chi'].includes(cfg.stack) ? 'go.mod' :
      ['actix','axum','rocket'].includes(cfg.stack) ? 'Cargo.toml' :
      ['laravel','symfony','slim'].includes(cfg.stack) ? 'composer.json' : null
    if (depFileName) await write(depFileName, depFile)
  }
  await write('Dockerfile',          generateDockerfile(cfg))
  await write('docker-compose.yml',  generateDockerCompose(cfg))
  await write('.env.example',        generateEnvExample(cfg))
  await write('README.md',           generateReadme(cfg))
  await write('.gitignore',          `node_modules\n.env\n*.log\ndist\nbuild\n.next\n__pycache__\n.DS_Store\n`)

  // GitHub Actions CI
  if (cfg.devops.includes('github-actions')) {
    await fs.ensureDir(path.join(dir, '.github/workflows'))
    await fs.writeFile(path.join(dir, '.github/workflows/ci.yml'), `name: CI
on: [push, pull_request]
jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - name: Build Docker image
        run: docker build -t ${cfg.name} .
`)
    created.push(`${cfg.name}/.github/workflows/ci.yml`)
  }

  // VS Code Dev Container
  if (cfg.devops.includes('devcontainer')) {
    await fs.ensureDir(path.join(dir, '.devcontainer'))
    await fs.writeFile(path.join(dir, '.devcontainer/devcontainer.json'), JSON.stringify({
      name: cfg.name,
      dockerComposeFile: '../docker-compose.yml',
      service: 'app',
      workspaceFolder: '/app',
    }, null, 2))
    created.push(`${cfg.name}/.devcontainer/devcontainer.json`)
  }

  return created
}
