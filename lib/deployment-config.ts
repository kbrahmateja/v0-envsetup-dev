import { getDockerImage, getPackageManager, getVersionInfo, dbVersions } from "./versions"

export interface EnvironmentConfig {
  projectName: string
  language: string
  framework?: string
  databases: string[]
  tools: string[]
  serverType: "cloud" | "dedicated" | "local"
  description?: string
}

// ─── Dockerfile Generator ────────────────────────────────────────────────────
export function generateDockerfile(config: EnvironmentConfig): string {
  const lang = config.language.toLowerCase()
  const fw = config.framework?.toLowerCase() ?? ""
  const baseImage = getDockerImage(lang, fw)
  const pm = getPackageManager(lang, fw)
  const info = getVersionInfo(lang, fw)

  if (lang === "javascript" || lang === "typescript") {
    const isBun = baseImage.includes("bun")
    if (isBun) {
      return `FROM oven/bun:1-alpine
WORKDIR /app
COPY package*.json bun.lockb ./
RUN bun install --frozen-lockfile
COPY . .
EXPOSE 3000
CMD ["bun", "run", "start"]
`
    }
    const buildStep = fw.includes("next") || fw.includes("remix") || fw.includes("svelte") || fw.includes("nuxt") || fw.includes("astro")
      ? `RUN ${pm} run build\nEXPOSE 3000\nCMD ["${pm}", "run", "start"]`
      : `EXPOSE 3000\nCMD ["node", "src/index.js"]`
    return `FROM ${baseImage}
WORKDIR /app
COPY package*.json ./
RUN ${pm} ci --only=production
COPY . .
${buildStep}
`
  }

  if (lang === "python") {
    const cmd = fw.includes("fastapi") || fw.includes("starlette") || fw.includes("litestar")
      ? 'CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]'
      : fw.includes("django")
      ? 'CMD ["gunicorn", "config.wsgi:application", "--bind", "0.0.0.0:8000"]'
      : fw.includes("flask")
      ? 'CMD ["gunicorn", "app:app", "--bind", "0.0.0.0:8000"]'
      : 'CMD ["python", "main.py"]'
    return `FROM ${baseImage}
WORKDIR /app
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt
COPY . .
EXPOSE 8000
${cmd}
`
  }

  if (lang === "java" || lang === "kotlin") {
    const isGradle = pm === "gradle"
    return `FROM ${baseImage} AS builder
WORKDIR /app
COPY ${isGradle ? "build.gradle* settings.gradle* gradlew gradlew.bat" : "pom.xml"} ./
${isGradle ? "COPY gradle gradle\nRUN ./gradlew dependencies --no-daemon" : "RUN mvn dependency:go-offline -B"}
COPY src ./src
RUN ${isGradle ? "./gradlew bootJar --no-daemon" : "mvn package -DskipTests"}

FROM eclipse-temurin:${info?.languageVersion ?? "21"}-jre-alpine
WORKDIR /app
COPY --from=builder /app/${isGradle ? "build/libs/*.jar" : "target/*.jar"} app.jar
EXPOSE 8080
CMD ["java", "-jar", "app.jar"]
`
  }

  if (lang === "go") {
    return `FROM ${baseImage} AS builder
WORKDIR /app
COPY go.mod go.sum ./
RUN go mod download
COPY . .
RUN CGO_ENABLED=0 GOOS=linux go build -o main ./cmd/main.go

FROM alpine:3.19
RUN apk --no-cache add ca-certificates
WORKDIR /root/
COPY --from=builder /app/main .
EXPOSE 8080
CMD ["./main"]
`
  }

  if (lang === "rust") {
    return `FROM ${baseImage} AS builder
WORKDIR /app
COPY Cargo.toml Cargo.lock ./
RUN mkdir src && echo "fn main() {}" > src/main.rs
RUN cargo build --release && rm -f target/release/deps/app*
COPY . .
RUN cargo build --release

FROM debian:bookworm-slim
RUN apt-get update && apt-get install -y ca-certificates && rm -rf /var/lib/apt/lists/*
COPY --from=builder /app/target/release/app /usr/local/bin/
EXPOSE 8080
CMD ["app"]
`
  }

  if (lang === "php") {
    return `FROM ${baseImage}
RUN docker-php-ext-install pdo pdo_mysql pdo_pgsql
WORKDIR /var/www/html
COPY composer.json composer.lock ./
RUN curl -sS https://getcomposer.org/installer | php -- --install-dir=/usr/local/bin --filename=composer
RUN composer install --no-dev --optimize-autoloader
COPY . .
RUN chown -R www-data:www-data /var/www/html
EXPOSE 9000
CMD ["php-fpm"]
`
  }

  if (lang === "ruby") {
    return `FROM ${baseImage}
WORKDIR /app
COPY Gemfile Gemfile.lock ./
RUN bundle config --global frozen 1 && bundle install
COPY . .
EXPOSE 3000
CMD ${fw.includes("rails") ? '["bundle", "exec", "rails", "server", "-b", "0.0.0.0"]' : '["bundle", "exec", "ruby", "app.rb"]'}
`
  }

  if (lang === "csharp") {
    return `FROM ${baseImage} AS build
WORKDIR /src
COPY *.csproj ./
RUN dotnet restore
COPY . .
RUN dotnet build -c Release -o /app/build
RUN dotnet publish -c Release -o /app/publish

FROM mcr.microsoft.com/dotnet/aspnet:8.0-alpine AS runtime
WORKDIR /app
COPY --from=build /app/publish .
EXPOSE 8080
ENTRYPOINT ["dotnet", "app.dll"]
`
  }

  if (lang === "elixir") {
    return `FROM ${baseImage} AS builder
WORKDIR /app
ENV MIX_ENV=prod
COPY mix.exs mix.lock ./
RUN mix local.hex --force && mix local.rebar --force
RUN mix deps.get --only prod
COPY . .
RUN mix compile
RUN mix phx.digest 2>/dev/null || true
RUN mix release

FROM elixir:${info?.languageVersion ?? "1.16"}-alpine
WORKDIR /app
COPY --from=builder /app/_build/prod/rel/app ./
EXPOSE 4000
CMD ["./bin/app", "start"]
`
  }

  // Generic fallback
  return `FROM ${baseImage}
WORKDIR /app
COPY . .
EXPOSE 8080
CMD ["/bin/sh", "-c", "echo 'Configure CMD for your app'"]
`
}

// ─── docker-compose.yml Generator ───────────────────────────────────────────
export function generateDockerCompose(config: EnvironmentConfig): string {
  const port = ["java", "kotlin", "csharp", "go", "rust", "elixir"].includes(config.language.toLowerCase()) ? 8080 : 3000
  const dbServices: string[] = []
  const depends: string[] = []
  const envVars: string[] = []

  config.databases.forEach((db) => {
    const key = db.toLowerCase().replace(/[^a-z]/g, "")
    const dbInfo = dbVersions[key]
    if (!dbInfo || !dbInfo.image) return // embedded DBs (sqlite, h2) need no service

    depends.push(key)
    const envEntries = Object.entries(dbInfo.envVars)
      .map(([k, v]) => `      - ${k}=${v.replace("${PROJECT_NAME}", config.projectName)}`)
      .join("\n")

    const healthCheck = dbInfo.healthCheck
      ? `\n    healthcheck:\n      test: ["CMD", "sh", "-c", "${dbInfo.healthCheck}"]\n      interval: 10s\n      retries: 5`
      : ""

    dbServices.push(`  ${key}:
    image: ${dbInfo.image}
    restart: unless-stopped
    environment:
${envEntries}
    ports:
      - "${dbInfo.port}:${dbInfo.port}"
    volumes:
      - ${key}_data:/var/lib/${key === "postgres" ? "postgresql/data" : key === "mysql" ? "mysql" : key}${healthCheck}`)

    // Connection string env vars for app
    if (key === "postgres") {
      envVars.push(`      - DATABASE_URL=postgresql://postgres:password@postgres:5432/${config.projectName}`)
    } else if (key === "mysql") {
      envVars.push(`      - DATABASE_URL=mysql://app:password@mysql:3306/${config.projectName}`)
    } else if (key === "mongodb") {
      envVars.push(`      - DATABASE_URL=mongodb://root:password@mongodb:27017/${config.projectName}?authSource=admin`)
    } else if (key === "redis") {
      envVars.push(`      - REDIS_URL=redis://redis:6379`)
    }
  })

  const volumes = depends.length > 0
    ? `\nvolumes:\n${depends.map(d => `  ${d}_data:`).join("\n")}`
    : ""

  const dependsSection = depends.length > 0
    ? `\n    depends_on:\n${depends.map(d => `      ${d}:\n        condition: service_healthy`).join("\n")}`
    : ""

  return `version: '3.9'

services:
  app:
    build: .
    restart: unless-stopped
    ports:
      - "${port}:${port}"
    environment:
      - NODE_ENV=production
${envVars.join("\n")}${dependsSection}

${dbServices.join("\n\n")}${volumes}
`
}

// ─── .env.example Generator ─────────────────────────────────────────────────
export function generateEnvExample(config: EnvironmentConfig): string {
  const lines: string[] = [
    `# ${config.projectName} — Environment Variables`,
    `# Copy to .env and fill in your values`,
    "",
    "# App",
    "NODE_ENV=development",
    `PORT=${["java","kotlin","csharp","go","rust","elixir"].includes(config.language.toLowerCase()) ? 8080 : 3000}`,
    "",
  ]

  config.databases.forEach((db) => {
    const key = db.toLowerCase().replace(/[^a-z]/g, "")
    if (key === "postgres" || key === "supabase") {
      lines.push("# Database (PostgreSQL)", `DATABASE_URL=postgresql://postgres:password@localhost:5432/${config.projectName}`, "")
    } else if (key === "mysql") {
      lines.push("# Database (MySQL)", `DATABASE_URL=mysql://app:password@localhost:3306/${config.projectName}`, "")
    } else if (key === "mongodb") {
      lines.push("# Database (MongoDB)", `DATABASE_URL=mongodb://localhost:27017/${config.projectName}`, "")
    } else if (key === "redis") {
      lines.push("# Cache (Redis)", "REDIS_URL=redis://localhost:6379", "")
    } else if (key === "sqlite") {
      lines.push("# Database (SQLite)", "DATABASE_URL=file:./dev.db", "")
    } else if (key === "sqlserver") {
      lines.push("# Database (SQL Server)", `DATABASE_URL=Server=localhost,1433;Database=${config.projectName};User Id=sa;Password=Password123!`, "")
    }
  })

  lines.push("# Secrets", "SECRET_KEY=change_me_in_production", "JWT_SECRET=change_me_in_production")
  return lines.join("\n")
}

// ─── README Generator ────────────────────────────────────────────────────────
export function generateReadme(config: EnvironmentConfig): string {
  const info = getVersionInfo(config.language, config.framework ?? "")
  const pm = getPackageManager(config.language, config.framework ?? "")

  const prereqs = [
    "Docker & Docker Compose",
    info ? `${config.language.charAt(0).toUpperCase() + config.language.slice(1)} ${info.languageVersion}` : null,
    config.framework ? `${config.framework} ${info?.frameworkVersion ?? ""}` : null,
  ].filter(Boolean).map(p => `- ${p}`).join("\n")

  return `# ${config.projectName}

> Generated by [EnvSetup.dev](https://envsetup.dev)

## Stack
- **Language**: ${config.language} ${info?.languageVersion ?? ""}
- **Framework**: ${config.framework ?? "none"} ${info?.frameworkVersion ?? ""}
- **Databases**: ${config.databases.join(", ") || "none"}
${info?.notes ? `\n> ⚠️ ${info.notes}\n` : ""}

## Prerequisites
${prereqs}

## Quick Start

\`\`\`bash
# 1. Clone and setup
cp .env.example .env

# 2. Start with Docker
docker compose up -d

# 3. Install dependencies
${pm === "npm" ? "npm install" : pm === "pip" ? "pip install -r requirements.txt" : pm === "maven" ? "mvn install" : pm === "gradle" ? "./gradlew build" : pm === "cargo" ? "cargo build" : pm === "composer" ? "composer install" : pm === "bundler" ? "bundle install" : pm === "mix" ? "mix deps.get" : pm + " install"}

# 4. Run development server
${pm === "npm" ? "npm run dev" : pm === "pip" ? "uvicorn main:app --reload" : pm === "maven" ? "mvn spring-boot:run" : pm === "gradle" ? "./gradlew bootRun" : pm === "cargo" ? "cargo run" : pm === "composer" ? "php artisan serve" : pm === "bundler" ? "bundle exec rails server" : pm === "mix" ? "mix phx.server" : pm + " run dev"}
\`\`\`

## Generated by EnvSetup.dev CLI

\`\`\`bash
npx @envsetup/cli init
\`\`\`
`
}
