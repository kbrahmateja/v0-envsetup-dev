import fs from 'fs-extra';
import path from 'path';

interface ProjectConfig {
  name: string;
  stack: string;
  database: string;
  tools: string[];
  devops: string[];
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

export async function generateTemplates(cfg: ProjectConfig): Promise<string[]> {
  const dir = path.join(process.cwd(), cfg.name)
  await fs.ensureDir(dir)
  const created: string[] = []

  const write = async (name: string, content: string) => {
    await fs.writeFile(path.join(dir, name), content)
    created.push(`${cfg.name}/${name}`)
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
