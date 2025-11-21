export interface DeploymentConfig {
  serverType: "cloud" | "dedicated" | "local"
  provider?: string
  region?: string
  instanceType?: string
  credentials?: {
    host?: string
    username?: string
    sshKey?: string
  }
}

export interface EnvironmentConfig {
  projectName: string
  language: string
  framework?: string
  databases: string[]
  tools: string[]
  serverType: "cloud" | "dedicated" | "local"
  description?: string
  deployment?: DeploymentConfig
}

export function generateDockerCompose(config: EnvironmentConfig): string {
  const services: string[] = []

  // Add application service
  services.push(`  app:
    build: .
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=production
    depends_on:
${config.databases.map((db) => `      - ${db.toLowerCase()}`).join("\n")}`)

  // Add database services
  config.databases.forEach((db) => {
    if (db.toLowerCase().includes("postgres")) {
      services.push(`  postgres:
    image: postgres:16
    environment:
      POSTGRES_PASSWORD: password
      POSTGRES_DB: ${config.projectName}
    ports:
      - "5432:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data`)
    } else if (db.toLowerCase().includes("mongodb")) {
      services.push(`  mongodb:
    image: mongo:7.0
    ports:
      - "27017:27017"
    volumes:
      - mongo_data:/data/db`)
    } else if (db.toLowerCase().includes("redis")) {
      services.push(`  redis:
    image: redis:7.2
    ports:
      - "6379:6379"`)
    }
  })

  return `version: '3.8'

services:
${services.join("\n\n")}

volumes:
${config.databases
  .map((db) => {
    if (db.toLowerCase().includes("postgres")) return "  postgres_data:"
    if (db.toLowerCase().includes("mongodb")) return "  mongo_data:"
    return null
  })
  .filter(Boolean)
  .join("\n")}`
}

export function generateDeploymentScript(config: EnvironmentConfig): string {
  const { serverType, deployment } = config

  if (serverType === "cloud") {
    return `#!/bin/bash
# Cloud Deployment Script for ${config.projectName}

echo "Deploying to ${deployment?.provider || "cloud provider"}..."

# Build Docker image
docker build -t ${config.projectName}:latest .

# Push to container registry
docker tag ${config.projectName}:latest registry.example.com/${config.projectName}:latest
docker push registry.example.com/${config.projectName}:latest

# Deploy to cloud
kubectl apply -f k8s/deployment.yaml

echo "Deployment complete!"
`
  } else if (serverType === "dedicated") {
    return `#!/bin/bash
# Dedicated Server Deployment Script for ${config.projectName}

HOST="${deployment?.credentials?.host || "your-server.com"}"
USER="${deployment?.credentials?.username || "deploy"}"

echo "Deploying to dedicated server $HOST..."

# Copy files to server
rsync -avz --exclude 'node_modules' ./ $USER@$HOST:/var/www/${config.projectName}/

# SSH and run deployment
ssh $USER@$HOST << 'ENDSSH'
cd /var/www/${config.projectName}
docker-compose down
docker-compose up -d --build
ENDSSH

echo "Deployment complete!"
`
  } else {
    return `#!/bin/bash
# Local Setup Script for ${config.projectName}

echo "Setting up local environment..."

# Start services with Docker Compose
docker-compose up -d

# Install dependencies
npm install

# Run database migrations
npm run migrate

echo "Local environment ready! Access at http://localhost:3000"
`
  }
}

export function generateReadme(config: EnvironmentConfig): string {
  return `# ${config.projectName}

${config.description || "A development environment setup"}

## Technology Stack

- **Language**: ${config.language}
${config.framework ? `- **Framework**: ${config.framework}` : ""}
- **Databases**: ${config.databases.join(", ")}
- **Tools**: ${config.tools.join(", ")}

## Deployment Type

**${config.serverType.charAt(0).toUpperCase() + config.serverType.slice(1)}** deployment

## Quick Start

### Prerequisites

${config.tools.map((tool) => `- ${tool}`).join("\n")}

### Installation

1. Clone this repository
2. Install dependencies:
   \`\`\`bash
   npm install
   \`\`\`

3. Start services:
   \`\`\`bash
   docker-compose up -d
   \`\`\`

4. Run the application:
   \`\`\`bash
   npm run dev
   \`\`\`

## Deployment

${
  config.serverType === "local"
    ? "This environment is configured for local development only."
    : `Run the deployment script:

\`\`\`bash
chmod +x deploy.sh
./deploy.sh
\`\`\``
}

## Environment Variables

Create a \`.env\` file with the following variables:

\`\`\`
DATABASE_URL=your_database_url
API_KEY=your_api_key
\`\`\`

## Support

For issues and questions, please open an issue in this repository.
`
}
