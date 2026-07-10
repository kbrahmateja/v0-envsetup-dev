import { generateDockerCompose, generateDockerfile, generateEnvExample, generateReadme, generateToolFiles, type EnvironmentConfig } from "@/lib/deployment-config"
import JSZip from "jszip"

export async function POST(req: Request) {
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

  return new Response(zipBlob, {
    headers: {
      "Content-Type": "application/zip",
      "Content-Disposition": `attachment; filename="${config.projectName}-environment.zip"`,
    },
  })
}
