import { generateDockerCompose, generateDockerfile, generateEnvExample, generateReadme, generateToolFiles, type EnvironmentConfig } from "@/lib/deployment-config"
import JSZip from "jszip"
import { sql } from "@/lib/db"
import { checkRateLimit, getClientIp } from "@/lib/rate-limit"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/next-auth-options"

// Generous but real cap - a legitimate visitor might generate several
// environments while experimenting, but nothing should be able to script
// unlimited ZIP builds against this endpoint. Signed-in users get a higher
// cap as one of the perks of the (optional) GitHub sign-in.
const ANON_RATE_LIMIT = { limit: 30, windowMs: 60 * 60 * 1000 }
const AUTH_RATE_LIMIT = { limit: 100, windowMs: 60 * 60 * 1000 }

type Identity = { login?: string; email?: string }

// Logs one row per successful generation so the homepage's "Environments
// Generated" stat (components/hero-section.tsx) is a real count instead of
// the hardcoded "10k+" placeholder it used to be. Self-heals the table on
// first use so no manual migration step is required; never blocks or fails
// the actual download if logging has a problem.
//
// user_login/user_email are nullable — anonymous generations (the common
// case, since sign-in is optional) simply log NULL there. Existing rows
// predate these columns entirely, so both the INSERT and the CREATE TABLE
// fallback need an ADD COLUMN IF NOT EXISTS step for databases that already
// have the table from before this feature shipped.
async function logGeneration(config: EnvironmentConfig, identity: Identity) {
  const insert = () => sql`
    INSERT INTO generations (language, framework, user_login, user_email)
    VALUES (${config.language}, ${config.framework ?? null}, ${identity.login ?? null}, ${identity.email ?? null})
  `

  try {
    await insert()
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
      await sql`ALTER TABLE generations ADD COLUMN IF NOT EXISTS user_login VARCHAR(255)`
      await sql`ALTER TABLE generations ADD COLUMN IF NOT EXISTS user_email VARCHAR(255)`
      await insert()
    } catch (retryErr) {
      console.error("Failed to log generation (after create-table/add-column retry):", retryErr)
    }
  }
}

export async function POST(req: Request) {
  const ip = getClientIp(req)
  const session = await getServerSession(authOptions)
  const identity: Identity = { login: session?.user?.login, email: session?.user?.email ?? undefined }

  const rateLimitOpts = session ? AUTH_RATE_LIMIT : ANON_RATE_LIMIT
  const { allowed } = await checkRateLimit("generate-deployment", ip, rateLimitOpts)
  if (!allowed) {
    return new Response(JSON.stringify({ error: "Too many requests. Please try again in a bit." }), {
      status: 429,
      headers: { "Content-Type": "application/json" },
    })
  }

  const config: EnvironmentConfig = await req.json()

  const zip = new JSZip()

  zip.file("Dockerfile",         generateDockerfile(config))
  zip.file("docker-compose.yml", generateDockerCompose(config))
  zip.file(".env.example",       generateEnvExample(config))
  zip.file("README.md",          generateReadme(config))

  // Development Tools checkboxes (ESLint, Jest, GitHub Actions, etc.) -> real config files
  for (const [path, content] of Object.entries(generateToolFiles(config))) {
    zip.file(path, content)
  }
  zip.file(".gitignore", `# Dependencies
node_modules/
vendor/
target/
.gradle/
__pycache__/
*.pyc
.venv/

# Environment
.env
.env.local
.env.*.local

# Build
dist/
build/
.next/
out/

# IDE
.idea/
.vscode/
*.suo
*.swp

# Logs
*.log
logs/

# OS
.DS_Store
Thumbs.db
`)

  const zipBlob = await zip.generateAsync({ type: "nodebuffer", compression: "DEFLATE" })

  await logGeneration(config, identity)

  return new Response(zipBlob, {
    headers: {
      "Content-Type": "application/zip",
      "Content-Disposition": `attachment; filename="${config.projectName}-environment.zip"`,
    },
  })
}
