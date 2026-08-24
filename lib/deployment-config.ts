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
    // React/Vue/Angular are static SPAs, not Node servers - they were falling
    // through to the generic "npm ci --only=production" + "node src/index.js"
    // branch below, which produces a Dockerfile that can't actually run (no
    // such entrypoint exists in a Vite/CRA/Angular-CLI project). Build the
    // static output and serve it with Nginx instead, same pattern used for
    // every other production static-site deploy.
    if (fw === "react" || fw === "vue" || fw === "angular") {
      const buildOutDir = fw === "angular" ? `dist/${config.projectName}` : "dist"
      return `FROM ${baseImage} AS builder
WORKDIR /app
COPY package*.json ./
RUN ${pm} ci
COPY . .
RUN ${pm} run build

FROM nginx:alpine
COPY --from=builder /app/${buildOutDir} /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
`
    }
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
  const fw = config.framework?.toLowerCase() ?? ""
  const isFrontend = fw === "react" || fw === "vue" || fw === "angular"
  const port = isFrontend
    ? 80
    : ["java", "kotlin", "csharp", "go", "rust", "elixir"].includes(config.language.toLowerCase()) ? 8080 : 3000
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
  const fw = config.framework?.toLowerCase() ?? ""
  const isFrontend = fw === "react" || fw === "vue" || fw === "angular"
  const lines: string[] = [
    `# ${config.projectName} — Environment Variables`,
    `# Copy to .env and fill in your values`,
    "",
    "# App",
    "NODE_ENV=development",
    `PORT=${isFrontend ? 80 : ["java","kotlin","csharp","go","rust","elixir"].includes(config.language.toLowerCase()) ? 8080 : 3000}`,
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

// ─── Development Tools Generator ────────────────────────────────────────────
// Turns the selected "Development Tools" checkboxes into real config files.
// Language-specific tools (jest, eslint, etc.) are only emitted when they
// actually match config.language, as a defensive backstop to the UI filter.
export function generateToolFiles(config: EnvironmentConfig): Record<string, string> {
  const files: Record<string, string> = {}
  const lang = config.language.toLowerCase()
  const selected = new Set(config.tools ?? [])
  const isJs = lang === "javascript" || lang === "typescript"
  const ts = lang === "typescript"

  if (selected.has("github-actions")) {
    files[".github/workflows/ci.yml"] = generateGithubActionsWorkflow(config)
  }

  if (selected.has("eslint") && isJs) {
    files[".eslintrc.json"] = JSON.stringify(
      {
        env: { node: true, es2021: true },
        extends: ts ? ["eslint:recommended", "plugin:@typescript-eslint/recommended"] : ["eslint:recommended"],
        parserOptions: { ecmaVersion: "latest", sourceType: "module" },
        ...(ts ? { parser: "@typescript-eslint/parser", plugins: ["@typescript-eslint"] } : {}),
        rules: {},
      },
      null,
      2,
    )
  }

  if (selected.has("prettier") && isJs) {
    files[".prettierrc"] = JSON.stringify({ semi: false, singleQuote: true, trailingComma: "es5", printWidth: 100 }, null, 2)
  }

  if (selected.has("jest") && isJs) {
    const ext = ts ? "ts" : "js"
    files["jest.config.js"] = `module.exports = {
  testEnvironment: "node",
${ts ? '  preset: "ts-jest",\n' : ""}  testMatch: ["**/*.test.${ext}"],
}
`
    files[`__tests__/example.test.${ext}`] = `test("example", () => {
  expect(1 + 1).toBe(2)
})
`
  }

  if (selected.has("cypress") && isJs) {
    files["cypress.config.js"] = `const { defineConfig } = require("cypress")

module.exports = defineConfig({
  e2e: {
    baseUrl: "http://localhost:3000",
    setupNodeEvents(on, config) {},
  },
})
`
    files["cypress/e2e/example.cy.js"] = `describe("smoke test", () => {
  it("loads the homepage", () => {
    cy.visit("/")
  })
})
`
  }

  if (selected.has("husky") && isJs) {
    files[".husky/pre-commit"] = `#!/usr/bin/env sh
. "$(dirname -- "$0")/_/husky.sh"

npx lint-staged
`
  }

  if (selected.has("black") && lang === "python") {
    files["pyproject.toml"] = `[tool.black]
line-length = 88
target-version = ["py312"]
`
  }

  if (selected.has("pytest") && lang === "python") {
    files["pytest.ini"] = `[pytest]
testpaths = tests
python_files = test_*.py
`
    files["tests/test_example.py"] = `def test_example():
    assert 1 + 1 == 2
`
  }

  if (selected.has("junit") && lang === "java") {
    files["src/test/java/ExampleTest.java"] = `import org.junit.jupiter.api.Test;
import static org.junit.jupiter.api.Assertions.assertEquals;

class ExampleTest {
    @Test
    void example() {
        assertEquals(2, 1 + 1);
    }
}
`
  }

  if (selected.has("nunit") && lang === "csharp") {
    files["Tests/ExampleTests.cs"] = `using NUnit.Framework;

namespace Tests
{
    public class ExampleTests
    {
        [Test]
        public void Example()
        {
            Assert.AreEqual(2, 1 + 1);
        }
    }
}
`
  }

  if (selected.has("golangci-lint") && lang === "go") {
    files[".golangci.yml"] = `run:
  timeout: 5m
linters:
  enable:
    - govet
    - staticcheck
    - unused
`
  }

  if (selected.has("clippy") && lang === "rust") {
    files["clippy.toml"] = `# See https://doc.rust-lang.org/clippy/configuration.html
avoid-breaking-exported-api = true
`
  }

  if (selected.has("rspec") && lang === "ruby") {
    files["spec/spec_helper.rb"] = `RSpec.configure do |config|
  config.expect_with :rspec do |expectations|
    expectations.include_chain_clauses_in_custom_matcher_descriptions = true
  end
end
`
    files["spec/example_spec.rb"] = `RSpec.describe "example" do
  it "works" do
    expect(1 + 1).to eq(2)
  end
end
`
  }

  // ── Infrastructure & Messaging ──────────────────────────────────────────────
  const appPort = ["python"].includes(lang) ? 8000 : ["go","rust","java","kotlin","csharp","elixir"].includes(lang) ? 8080 : 3000
  const projName = config.projectName || "myapp"

  if (selected.has("kubernetes")) {
    files["k8s/deployment.yaml"] = `apiVersion: apps/v1
kind: Deployment
metadata:
  name: ${projName}
  labels:
    app: ${projName}
spec:
  replicas: 2
  selector:
    matchLabels:
      app: ${projName}
  template:
    metadata:
      labels:
        app: ${projName}
    spec:
      containers:
        - name: ${projName}
          image: ${projName}:latest
          ports:
            - containerPort: ${appPort}
          envFrom:
            - secretRef:
                name: ${projName}-secrets
          resources:
            requests:
              cpu: "100m"
              memory: "128Mi"
            limits:
              cpu: "500m"
              memory: "512Mi"
          readinessProbe:
            httpGet:
              path: /health
              port: ${appPort}
            initialDelaySeconds: 10
            periodSeconds: 5
`
    files["k8s/service.yaml"] = `apiVersion: v1
kind: Service
metadata:
  name: ${projName}-svc
spec:
  selector:
    app: ${projName}
  ports:
    - protocol: TCP
      port: 80
      targetPort: ${appPort}
  type: ClusterIP
`
    files["k8s/ingress.yaml"] = `apiVersion: networking.k8s.io/v1
kind: Ingress
metadata:
  name: ${projName}-ingress
  annotations:
    nginx.ingress.kubernetes.io/rewrite-target: /
    cert-manager.io/cluster-issuer: letsencrypt-prod
spec:
  ingressClassName: nginx
  tls:
    - hosts:
        - yourdomain.com
      secretName: ${projName}-tls
  rules:
    - host: yourdomain.com
      http:
        paths:
          - path: /
            pathType: Prefix
            backend:
              service:
                name: ${projName}-svc
                port:
                  number: 80
`
    files["k8s/hpa.yaml"] = `apiVersion: autoscaling/v2
kind: HorizontalPodAutoscaler
metadata:
  name: ${projName}-hpa
spec:
  scaleTargetRef:
    apiVersion: apps/v1
    kind: Deployment
    name: ${projName}
  minReplicas: 2
  maxReplicas: 10
  metrics:
    - type: Resource
      resource:
        name: cpu
        target:
          type: Utilization
          averageUtilization: 70
`
    files["k8s/secret.yaml"] = `apiVersion: v1
kind: Secret
metadata:
  name: ${projName}-secrets
type: Opaque
stringData:
  DATABASE_URL: "postgresql://user:pass@postgres:5432/${projName}"
  SECRET_KEY: "change-me-in-production"
`
  }

  if (selected.has("nginx")) {
    files["nginx/nginx.conf"] = `events {
  worker_connections 1024;
}

http {
  upstream app {
    least_conn;
    server app:${appPort};
  }

  limit_req_zone $binary_remote_addr zone=api:10m rate=10r/s;
  limit_conn_zone $binary_remote_addr zone=conn:10m;

  server {
    listen 80;
    server_name _;
    return 301 https://$host$request_uri;
  }

  server {
    listen 443 ssl http2;
    server_name yourdomain.com;

    ssl_certificate     /etc/nginx/certs/cert.pem;
    ssl_certificate_key /etc/nginx/certs/key.pem;
    ssl_protocols       TLSv1.2 TLSv1.3;

    location /api/ {
      limit_req zone=api burst=20 nodelay;
      limit_conn conn 10;
      proxy_pass http://app;
      proxy_set_header Host $host;
      proxy_set_header X-Real-IP $remote_addr;
      proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
      proxy_set_header X-Forwarded-Proto $scheme;
    }

    location / {
      proxy_pass http://app;
      proxy_set_header Host $host;
      proxy_set_header X-Real-IP $remote_addr;
    }
  }
}
`
  }

  if (selected.has("traefik")) {
    files["traefik/traefik.yml"] = `api:
  dashboard: true
  insecure: false

entryPoints:
  web:
    address: ":80"
    http:
      redirections:
        entryPoint:
          to: websecure
          scheme: https
  websecure:
    address: ":443"

certificatesResolvers:
  letsencrypt:
    acme:
      email: your@email.com
      storage: /letsencrypt/acme.json
      httpChallenge:
        entryPoint: web

providers:
  docker:
    exposedByDefault: false
  file:
    directory: /traefik/dynamic

log:
  level: INFO
`
    files["traefik/dynamic.yml"] = `http:
  middlewares:
    rateLimit:
      rateLimit:
        average: 100
        burst: 50
    secureHeaders:
      headers:
        sslRedirect: true
        stsSeconds: 31536000
        contentTypeNosniff: true
        browserXssFilter: true
`
  }

  if (selected.has("kafka")) {
    files["kafka-compose.yml"] = `# Add these services to your docker-compose.yml
services:
  zookeeper:
    image: confluentinc/cp-zookeeper:7.5.0
    environment:
      ZOOKEEPER_CLIENT_PORT: 2181
    ports:
      - "2181:2181"

  kafka:
    image: confluentinc/cp-kafka:7.5.0
    depends_on:
      - zookeeper
    ports:
      - "9092:9092"
    environment:
      KAFKA_BROKER_ID: 1
      KAFKA_ZOOKEEPER_CONNECT: zookeeper:2181
      KAFKA_ADVERTISED_LISTENERS: PLAINTEXT://localhost:9092
      KAFKA_OFFSETS_TOPIC_REPLICATION_FACTOR: 1
      KAFKA_AUTO_CREATE_TOPICS_ENABLE: "true"

  kafka-ui:
    image: provectuslabs/kafka-ui:latest
    depends_on:
      - kafka
    ports:
      - "8090:8080"
    environment:
      KAFKA_CLUSTERS_0_NAME: local
      KAFKA_CLUSTERS_0_BOOTSTRAPSERVERS: kafka:9092
`
  }

  if (selected.has("rabbitmq")) {
    files["rabbitmq-compose.yml"] = `# Add these services to your docker-compose.yml
services:
  rabbitmq:
    image: rabbitmq:3.13-management
    ports:
      - "5672:5672"
      - "15672:15672"
    environment:
      RABBITMQ_DEFAULT_USER: admin
      RABBITMQ_DEFAULT_PASS: password
    volumes:
      - rabbitmq_data:/var/lib/rabbitmq
    healthcheck:
      test: rabbitmq-diagnostics -q ping
      interval: 30s
      timeout: 10s
      retries: 5

volumes:
  rabbitmq_data:
`
  }

  if (selected.has("redis-infra")) {
    files["redis.conf"] = `# Redis configuration
bind 127.0.0.1
port 6379
maxmemory 256mb
maxmemory-policy allkeys-lru
save 900 1
save 300 10
save 60 10000
`
  }

  if (selected.has("argo-cd")) {
    files["argocd/application.yaml"] = `apiVersion: argoproj.io/v1alpha1
kind: Application
metadata:
  name: ${projName}
  namespace: argocd
spec:
  project: default
  source:
    repoURL: https://github.com/your-org/${projName}.git
    targetRevision: main
    path: k8s
  destination:
    server: https://kubernetes.default.svc
    namespace: ${projName}
  syncPolicy:
    automated:
      prune: true
      selfHeal: true
`
  }

  // "Helm" was checkable in the UI (infraTools list in generator-form.tsx)
  // but had no handler here at all -- checking it silently produced no
  // files. Found while writing combination test coverage.
  if (selected.has("helm")) {
    files[`helm/${projName}/Chart.yaml`] = `apiVersion: v2
name: ${projName}
description: A Helm chart for ${projName}
type: application
version: 0.1.0
appVersion: "1.0.0"
`
    files[`helm/${projName}/values.yaml`] = `replicaCount: 2

image:
  repository: ${projName}
  tag: latest
  pullPolicy: IfNotPresent

service:
  type: ClusterIP
  port: 80
  targetPort: ${appPort}

resources:
  requests:
    cpu: 100m
    memory: 128Mi
  limits:
    cpu: 500m
    memory: 512Mi

ingress:
  enabled: false
  host: yourdomain.com
`
    files[`helm/${projName}/templates/deployment.yaml`] = `apiVersion: apps/v1
kind: Deployment
metadata:
  name: {{ .Release.Name }}-${projName}
spec:
  replicas: {{ .Values.replicaCount }}
  selector:
    matchLabels:
      app: ${projName}
  template:
    metadata:
      labels:
        app: ${projName}
    spec:
      containers:
        - name: ${projName}
          image: "{{ .Values.image.repository }}:{{ .Values.image.tag }}"
          imagePullPolicy: {{ .Values.image.pullPolicy }}
          ports:
            - containerPort: {{ .Values.service.targetPort }}
          resources:
            {{- toYaml .Values.resources | nindent 12 }}
`
    files[`helm/${projName}/templates/service.yaml`] = `apiVersion: v1
kind: Service
metadata:
  name: {{ .Release.Name }}-${projName}-svc
spec:
  type: {{ .Values.service.type }}
  selector:
    app: ${projName}
  ports:
    - port: {{ .Values.service.port }}
      targetPort: {{ .Values.service.targetPort }}
`
  }

  if (selected.has("phpunit") && lang === "php") {
    files["phpunit.xml"] = `<?xml version="1.0" encoding="UTF-8"?>
<phpunit bootstrap="vendor/autoload.php">
  <testsuites>
    <testsuite name="Tests">
      <directory>tests</directory>
    </testsuite>
  </testsuites>
</phpunit>
`
    files["tests/ExampleTest.php"] = `<?php
use PHPUnit\\Framework\\TestCase;

class ExampleTest extends TestCase
{
    public function testExample(): void
    {
        $this->assertEquals(2, 1 + 1);
    }
}
`
  }

  return files
}

function generateGithubActionsWorkflow(config: EnvironmentConfig): string {
  const lang = config.language.toLowerCase()
  const setupStep =
    lang === "javascript" || lang === "typescript"
      ? `      - uses: actions/setup-node@v4
        with:
          node-version: '20'
      - run: npm ci
      - run: npm test --if-present`
      : lang === "python"
      ? `      - uses: actions/setup-python@v5
        with:
          python-version: '3.12'
      - run: pip install -r requirements.txt
      - run: pytest || true`
      : lang === "java"
      ? `      - uses: actions/setup-java@v4
        with:
          distribution: 'temurin'
          java-version: '21'
      - run: mvn -B test || ./gradlew test`
      : lang === "go"
      ? `      - uses: actions/setup-go@v5
        with:
          go-version: '1.22'
      - run: go build ./...
      - run: go test ./...`
      : lang === "rust"
      ? `      - uses: actions-rs/toolchain@v1
        with:
          toolchain: stable
      - run: cargo build --release
      - run: cargo test`
      : lang === "csharp"
      ? `      - uses: actions/setup-dotnet@v4
        with:
          dotnet-version: '8.0.x'
      - run: dotnet build
      - run: dotnet test`
      : lang === "ruby"
      ? `      - uses: ruby/setup-ruby@v1
        with:
          ruby-version: '3.3'
          bundler-cache: true
      - run: bundle exec rspec || true`
      : lang === "php"
      ? `      - uses: shivammathur/setup-php@v2
        with:
          php-version: '8.3'
      - run: composer install
      - run: vendor/bin/phpunit || true`
      : `      - run: echo "Add your build/test steps here"`

  return `name: CI

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
${setupStep}
`
}
