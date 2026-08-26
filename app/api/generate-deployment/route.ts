import { generateDockerCompose, generateDockerfile, generateEnvExample, generateGitignore, generateReadme, generateToolFiles, type EnvironmentConfig } from "@/lib/deployment-config"
import JSZip from "jszip"
import { sql } from "@/lib/db"
import { checkRateLimit, getClientIp } from "@/lib/rate-limit"

// Generous but real cap - a legitimate visitor might generate several
// environments while experimenting, but nothing should be able to script
// unlimited ZIP builds against this endpoint.
const RATE_LIMIT = { limit: 30, windowMs: 60 * 60 * 1000 }

// Logs one row per successful generation so the homepage's "Environments
// Generated" stat (components/hero-section.tsx) is a real count instead of
// the hardcoded "10k+" placeholder it used to be. Self-heals the table on
// first use so no manual migration step is required; never blocks or fails
// the actual download if logging has a problem.
async function logGeneration(config: EnvironmentConfig) {
  try {
    await sql`INSERT INTO generations (language, framework) VALUES (${config.language}, ${config.framework ?? null})`
  } catch {
    try {
      await sql`
        CREATE TABLE IF NOT EXISTS generations (
          id SERIAL PRIMARY KEY,
          language VARCHAR(100),
          framework VARCHAR(100),
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
      `
      await sql`INSERT INTO generations (language, framework) VALUES (${config.language}, ${config.framework ?? null})`
    } catch (retryErr) {
      console.error("Failed to log generation (after create-table retry):", retryErr)
    }
  }
}

export async function POST(req: Request) {
  const ip = getClientIp(req)
  const { allowed } = await checkRateLimit("generate-deployment", ip, RATE_LIMIT)
  if (!allowed) {
    return new Response(JSON.stringify({ error: "Too many requests. Please try again in a bit." }), {
      status: 429,
      headers: { "Content-Type": "application/json" },
    })
  }

  const config: EnvironmentConfig = await req.json()
  const tools = config.tools ?? []

  const zip = new JSZip()

  // Dockerfile/docker-compose.yml and .gitignore are gated on the "Docker"
  // and "Git" Development Tools checkboxes (components/generator-form.tsx).
  // These used to be written unconditionally, so unchecking "Docker" still
  // produced a Dockerfile - a user caught this exact mismatch. .env.example
  // and README.md stay unconditional: nothing in the UI implies they're
  // optional, and they're useful with or without Docker.
  if (tools.includes("docker")) {
    zip.file("Dockerfile",         generateDockerfile(config))
    zip.file("docker-compose.yml", generateDockerCompose(config))
  }
  zip.file(".env.example", generateEnvExample(config))
  zip.file("README.md",    generateReadme(config))

  // Development Tools checkboxes (ESLint, Jest, GitHub Actions, etc.) -> real config files
  for (const [path, content] of Object.entries(generateToolFiles(config))) {
    zip.file(path, content)
  }

  if (tools.includes("git")) {
    zip.file(".gitignore", generateGitignore())
  }

  const zipBlob = await zip.generateAsync({ type: "nodebuffer", compression: "DEFLATE" })

  await logGeneration(config)

  return new Response(zipBlob, {
    headers: {
      "Content-Type": "application/zip",
      "Content-Disposition": `attachment; filename="${config.projectName}-environment.zip"`,
    },
  })
}
