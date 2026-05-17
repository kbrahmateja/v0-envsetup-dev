import {
  generateDockerCompose,
  generateDeploymentScript,
  generateReadme,
  type EnvironmentConfig,
} from "@/lib/deployment-config"
import JSZip from "jszip"

export async function POST(req: Request) {
  const config: EnvironmentConfig = await req.json()

  // Generate all configuration files
  const dockerCompose = generateDockerCompose(config)
  const deployScript = generateDeploymentScript(config)
  const readme = generateReadme(config)

  // Generate Dockerfile
  const dockerfile = `FROM node:20-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install --production

COPY . .

EXPOSE 3000

CMD ["npm", "start"]
`

  // Generate .env.example
  const envExample = `# Database
DATABASE_URL=postgresql://user:password@localhost:5432/${config.projectName}

# Application
NODE_ENV=production
PORT=3000

# Add your environment variables here
`

  // Create package.json
  const packageJson = {
    name: config.projectName,
    version: "1.0.0",
    description: config.description || "",
    scripts: {
      start: "node index.js",
      dev: "nodemon index.js",
      migrate: "node migrate.js",
    },
    dependencies: {},
  }

  // Create ZIP file
  const zip = new JSZip()
  zip.file("docker-compose.yml", dockerCompose)
  zip.file("Dockerfile", dockerfile)
  zip.file("deploy.sh", deployScript)
  zip.file("README.md", readme)
  zip.file(".env.example", envExample)
  zip.file("package.json", JSON.stringify(packageJson, null, 2))
  zip.file(".gitignore", "node_modules\n.env\n*.log\n.DS_Store\n")

  // Generate ZIP
  const zipBlob = await zip.generateAsync({ type: "nodebuffer" })

  return new Response(zipBlob, {
    headers: {
      "Content-Type": "application/zip",
      "Content-Disposition": `attachment; filename="${config.projectName}-environment.zip"`,
    },
  })
}
