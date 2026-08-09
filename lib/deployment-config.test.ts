import { describe, expect, it } from "vitest"
import {
  generateToolFiles,
  generateDockerfile,
  generateDockerCompose,
  generateEnvExample,
  generateReadme,
  type EnvironmentConfig,
} from "./deployment-config"

function baseConfig(overrides: Partial<EnvironmentConfig> = {}): EnvironmentConfig {
  return {
    projectName: "demo",
    language: "javascript",
    framework: "express",
    databases: [],
    tools: [],
    serverType: "local",
    ...overrides,
  }
}

describe("generateToolFiles", () => {
  it("emits eslint, prettier, jest, cypress, husky files for a JS project that selects them", () => {
    const files = generateToolFiles(
      baseConfig({ tools: ["eslint", "prettier", "jest", "cypress", "husky", "github-actions"] }),
    )
    expect(Object.keys(files)).toEqual(
      expect.arrayContaining([
        ".eslintrc.json",
        ".prettierrc",
        "jest.config.js",
        "__tests__/example.test.js",
        "cypress.config.js",
        "cypress/e2e/example.cy.js",
        ".husky/pre-commit",
        ".github/workflows/ci.yml",
      ]),
    )
  })

  it("uses TypeScript-flavored jest config and test extension for typescript", () => {
    const files = generateToolFiles(baseConfig({ language: "typescript", tools: ["jest"] }))
    expect(files["jest.config.js"]).toContain("ts-jest")
    expect(files["__tests__/example.test.ts"]).toBeDefined()
  })

  it("does not emit JS-only tool files for a non-JS language even if requested", () => {
    const files = generateToolFiles(baseConfig({ language: "python", tools: ["eslint", "jest", "cypress", "husky"] }))
    expect(files[".eslintrc.json"]).toBeUndefined()
    expect(files["jest.config.js"]).toBeUndefined()
  })

  it("emits language-appropriate tool files (python black/pytest)", () => {
    const files = generateToolFiles(baseConfig({ language: "python", tools: ["black", "pytest"] }))
    expect(files["pyproject.toml"]).toContain("[tool.black]")
    expect(files["pytest.ini"]).toBeDefined()
    expect(files["tests/test_example.py"]).toBeDefined()
  })

  it("tailors the GitHub Actions workflow setup step per language", () => {
    const jsFiles = generateToolFiles(baseConfig({ language: "javascript", tools: ["github-actions"] }))
    expect(jsFiles[".github/workflows/ci.yml"]).toContain("actions/setup-node")

    const goFiles = generateToolFiles(baseConfig({ language: "go", tools: ["github-actions"] }))
    expect(goFiles[".github/workflows/ci.yml"]).toContain("actions/setup-go")

    const javaFiles = generateToolFiles(baseConfig({ language: "java", tools: ["github-actions"] }))
    expect(javaFiles[".github/workflows/ci.yml"]).toContain("actions/setup-java")
  })

  it("returns no files when no tools are selected", () => {
    const files = generateToolFiles(baseConfig({ tools: [] }))
    expect(Object.keys(files)).toHaveLength(0)
  })

  it("ignores unknown tool ids without throwing", () => {
    expect(() => generateToolFiles(baseConfig({ tools: ["some-made-up-tool"] }))).not.toThrow()
  })
})

// ─── Combination coverage ───────────────────────────────────────────────────
// generateToolFiles previously only had targeted tests for JS/Python's dev
// tools. This section covers every language generator-form.tsx offers, every
// database lib/versions.ts knows about, and every infra/messaging tool the
// "Infrastructure & Messaging" checklist offers -- mirroring how the CLI
// package's own combinations.test.ts / infra-gen.test.ts cover its stacks.
// Full cross-product (10 languages x every framework x every tool) would be
// thousands of cases for little extra signal; one representative
// language+framework pairing per language, plus one test per independent
// tool/db, catches the real failure mode here (a whole branch never firing)
// without the combinatorial explosion.

const LANGUAGE_FRAMEWORK_CASES: Array<{ language: string; framework: string }> = [
  { language: "javascript", framework: "Express" },
  { language: "typescript", framework: "NestJS" },
  { language: "python", framework: "FastAPI" },
  { language: "java", framework: "Spring Boot" },
  { language: "csharp", framework: ".NET Core" },
  { language: "go", framework: "Gin" },
  { language: "rust", framework: "Actix" },
  { language: "php", framework: "Laravel" },
  { language: "ruby", framework: "Rails" },
  // Swift has no dedicated branch in generateDockerfile -- it's expected to
  // fall through to the generic fallback. Included specifically to lock in
  // that it degrades gracefully instead of throwing or emitting garbage.
  { language: "swift", framework: "Vapor" },
]

describe("generateDockerfile across every language the generator UI offers", () => {
  for (const { language, framework } of LANGUAGE_FRAMEWORK_CASES) {
    it(`generates a non-empty Dockerfile for ${language} (${framework}) without throwing`, () => {
      let dockerfile = ""
      expect(() => {
        dockerfile = generateDockerfile({
          projectName: "combo-app",
          language,
          framework,
          databases: [],
          tools: [],
          serverType: "local",
        })
      }).not.toThrow()
      expect(dockerfile).toContain("FROM")
      expect(dockerfile.length).toBeGreaterThan(0)
    })
  }

  it("swift falls back to the generic Dockerfile template (no dedicated branch exists)", () => {
    const dockerfile = generateDockerfile({
      projectName: "combo-app",
      language: "swift",
      framework: "Vapor",
      databases: [],
      tools: [],
      serverType: "local",
    })
    expect(dockerfile).toContain("Configure CMD for your app")
  })

  it("uses a multi-stage build with the JRE runtime for java", () => {
    const dockerfile = generateDockerfile({
      projectName: "combo-app",
      language: "java",
      framework: "Spring Boot",
      databases: [],
      tools: [],
      serverType: "local",
    })
    expect(dockerfile).toContain("AS builder")
    expect(dockerfile).toContain("-jre-alpine")
  })

  it("uses uvicorn for FastAPI, gunicorn+wsgi for Django, gunicorn+app for Flask", () => {
    const fastapi = generateDockerfile({ projectName: "p", language: "python", framework: "FastAPI", databases: [], tools: [], serverType: "local" })
    expect(fastapi).toContain("uvicorn")

    const django = generateDockerfile({ projectName: "p", language: "python", framework: "Django", databases: [], tools: [], serverType: "local" })
    expect(django).toContain("gunicorn")
    expect(django).toContain("wsgi")

    const flask = generateDockerfile({ projectName: "p", language: "python", framework: "Flask", databases: [], tools: [], serverType: "local" })
    expect(flask).toContain("gunicorn")
    expect(flask).toContain("app:app")
  })
})

describe("generateDockerCompose across every database lib/versions.ts supports", () => {
  const DB_CASES: Array<{ db: string; expectImage?: string; expectEnv?: string }> = [
    { db: "postgres", expectImage: "postgres:16-alpine", expectEnv: "DATABASE_URL=postgresql://" },
    { db: "mysql", expectImage: "mysql:8.3", expectEnv: "DATABASE_URL=mysql://" },
    { db: "mongodb", expectImage: "mongo:7.0", expectEnv: "DATABASE_URL=mongodb://" },
    { db: "redis", expectImage: "redis:7.2-alpine", expectEnv: "REDIS_URL=redis://" },
    { db: "supabase", expectImage: "supabase/postgres" },
    { db: "sqlserver", expectImage: "mssql/server" },
    { db: "cassandra", expectImage: "cassandra:4.1" },
    // Embedded DBs have no Docker image at all -- generateDockerCompose must
    // skip the service block entirely rather than emit a broken empty image.
    { db: "sqlite" },
    { db: "h2" },
  ]

  for (const { db, expectImage, expectEnv } of DB_CASES) {
    it(`handles "${db}" without throwing${expectImage ? " and includes its image" : " (embedded, no service expected)"}`, () => {
      let compose = ""
      expect(() => {
        compose = generateDockerCompose({
          projectName: "combo-app",
          language: "javascript",
          framework: "Express",
          databases: [db],
          tools: [],
          serverType: "local",
        })
      }).not.toThrow()

      if (expectImage) {
        expect(compose).toContain(expectImage)
      } else {
        // Embedded engines (sqlite/h2) contribute no service/volume block.
        expect(compose).not.toContain(`${db}:`)
      }
      if (expectEnv) {
        expect(compose).toContain(expectEnv)
      }
    })
  }

  it("uses port 8080 for backend languages and 3000 for JS/TS", () => {
    const jvm = generateDockerCompose({ projectName: "p", language: "java", framework: "", databases: [], tools: [], serverType: "local" })
    expect(jvm).toContain('"8080:8080"')

    const node = generateDockerCompose({ projectName: "p", language: "javascript", framework: "", databases: [], tools: [], serverType: "local" })
    expect(node).toContain('"3000:3000"')
  })

  it("combines multiple databases into one compose file with all their services", () => {
    const compose = generateDockerCompose({
      projectName: "combo-app",
      language: "python",
      framework: "FastAPI",
      databases: ["postgres", "redis"],
      tools: [],
      serverType: "local",
    })
    expect(compose).toContain("postgres:16-alpine")
    expect(compose).toContain("redis:7.2-alpine")
    expect(compose).toContain("condition: service_healthy")
  })
})

describe("generateEnvExample across every database option", () => {
  const ENV_CASES: Array<[string, string]> = [
    ["postgres", "DATABASE_URL=postgresql://"],
    ["mysql", "DATABASE_URL=mysql://"],
    ["mongodb", "DATABASE_URL=mongodb://"],
    ["redis", "REDIS_URL=redis://"],
    ["sqlite", "DATABASE_URL=file:"],
    ["sqlserver", "DATABASE_URL=Server="],
  ]

  for (const [db, expected] of ENV_CASES) {
    it(`emits the right connection var for "${db}"`, () => {
      const env = generateEnvExample({
        projectName: "combo-app",
        language: "javascript",
        framework: "Express",
        databases: [db],
        tools: [],
        serverType: "local",
      })
      expect(env).toContain(expected)
    })
  }
})

describe("generateReadme sanity across every language", () => {
  for (const { language, framework } of LANGUAGE_FRAMEWORK_CASES) {
    it(`renders a README for ${language} without throwing`, () => {
      let readme = ""
      expect(() => {
        readme = generateReadme({
          projectName: "combo-app",
          language,
          framework,
          databases: [],
          tools: [],
          serverType: "local",
        })
      }).not.toThrow()
      expect(readme).toContain("combo-app")
      expect(readme).toContain(language)
    })
  }
})

describe("generateToolFiles: Infrastructure & Messaging tools", () => {
  // One test per checkbox in generator-form.tsx's `infraTools` list. "helm"
  // is included deliberately -- it was checkable in the UI but had NO
  // handler in generateToolFiles at all, a silent no-op identical in kind
  // to the dead "Download ZIP" button E2E caught. Fixed alongside adding
  // this coverage; these assertions are what keep it fixed.
  const INFRA_TOOL_CASES: Array<{ tool: string; expectedFile: string; expectedContent?: string }> = [
    { tool: "kubernetes", expectedFile: "k8s/deployment.yaml", expectedContent: "kind: Deployment" },
    { tool: "nginx", expectedFile: "nginx/nginx.conf", expectedContent: "upstream app" },
    { tool: "traefik", expectedFile: "traefik/traefik.yml", expectedContent: "entryPoints" },
    { tool: "kafka", expectedFile: "kafka-compose.yml", expectedContent: "confluentinc/cp-kafka" },
    { tool: "rabbitmq", expectedFile: "rabbitmq-compose.yml", expectedContent: "rabbitmq:3.13-management" },
    { tool: "redis-infra", expectedFile: "redis.conf", expectedContent: "maxmemory" },
    { tool: "helm", expectedFile: "helm/combo-app/Chart.yaml", expectedContent: "apiVersion: v2" },
    { tool: "argo-cd", expectedFile: "argocd/application.yaml", expectedContent: "kind: Application" },
  ]

  for (const { tool, expectedFile, expectedContent } of INFRA_TOOL_CASES) {
    it(`"${tool}" generates ${expectedFile}`, () => {
      const files = generateToolFiles({
        projectName: "combo-app",
        language: "javascript",
        framework: "Express",
        databases: [],
        tools: [tool],
        serverType: "local",
      })
      expect(files[expectedFile]).toBeDefined()
      if (expectedContent) {
        expect(files[expectedFile]).toContain(expectedContent)
      }
    })

    it(`"${tool}" produces no files when NOT selected`, () => {
      const files = generateToolFiles({
        projectName: "combo-app",
        language: "javascript",
        framework: "Express",
        databases: [],
        tools: [],
        serverType: "local",
      })
      expect(files[expectedFile]).toBeUndefined()
    })
  }

  it("emits files for every infra tool at once when all are selected together", () => {
    const files = generateToolFiles({
      projectName: "combo-app",
      language: "python",
      framework: "FastAPI",
      databases: [],
      tools: ["kubernetes", "nginx", "traefik", "kafka", "rabbitmq", "redis-infra", "helm", "argo-cd"],
      serverType: "local",
    })
    for (const { expectedFile } of INFRA_TOOL_CASES) {
      expect(files[expectedFile]).toBeDefined()
    }
    // Helm's chart should target the same app port convention as the raw
    // k8s manifests (8000 for python) -- catches the two staying in sync.
    expect(files["helm/combo-app/values.yaml"]).toContain("targetPort: 8000")
    expect(files["k8s/deployment.yaml"]).toContain("containerPort: 8000")
  })

  it("infra tools work independently of language (unlike dev tools, they're not language-filtered)", () => {
    const files = generateToolFiles({
      projectName: "combo-app",
      language: "rust",
      framework: "Actix",
      databases: [],
      tools: ["kubernetes", "helm"],
      serverType: "local",
    })
    expect(files["k8s/deployment.yaml"]).toBeDefined()
    expect(files["helm/combo-app/Chart.yaml"]).toBeDefined()
  })
})
