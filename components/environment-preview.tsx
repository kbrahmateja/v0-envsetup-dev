"use client"

import { useState } from "react"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card } from "@/components/ui/card"

interface EnvironmentPreviewProps {
  formData: any
}

export function EnvironmentPreview({ formData }: EnvironmentPreviewProps) {
  const [activeTab, setActiveTab] = useState("dockerfile")

  // Generate different file previews based on environment type
  const getDockerfileContent = () => {
    if (formData.language === "javascript" || formData.language === "typescript") {
      return `FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN ${formData.packageManager} install

COPY . .

${
  formData.framework === "next.js"
    ? `RUN ${formData.packageManager} run build

EXPOSE 3000

CMD ["${formData.packageManager === "npm" ? "npm" : formData.packageManager}", "start"]`
    : `EXPOSE 3000

CMD ["${formData.packageManager === "npm" ? "npm" : formData.packageManager}", "run", "dev"]`
}`
    } else if (formData.language === "python") {
      return `FROM python:3.9-slim

WORKDIR /app

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

${
  formData.framework === "django"
    ? `EXPOSE 8000

CMD ["python", "manage.py", "runserver", "0.0.0.0:8000"]`
    : `EXPOSE 5000

CMD ["gunicorn", "--bind", "0.0.0.0:5000", "app:app"]`
}`
    } else if (formData.language === "java") {
      return `FROM maven:3.8.4-openjdk-17 AS build

WORKDIR /app

COPY pom.xml .
COPY src ./src

RUN mvn clean package -DskipTests

FROM openjdk:17-jdk-slim

WORKDIR /app

COPY --from=build /app/target/*.jar app.jar

EXPOSE 8080

CMD ["java", "-jar", "app.jar"]`
    } else if (formData.language === "go") {
      return `FROM golang:1.18-alpine AS build

WORKDIR /app

COPY go.mod ./
COPY go.sum ./
RUN go mod download

COPY . .

RUN go build -o /app/server

FROM alpine:latest

WORKDIR /app

COPY --from=build /app/server /app/server

EXPOSE 8080

CMD ["/app/server"]`
    } else {
      return `# Dockerfile for ${formData.language} with ${formData.framework}
# This is a placeholder. The actual Dockerfile would be generated based on your selections.`
    }
  }

  const getDevContainerContent = () => {
    return `{
  "name": "${formData.language}-${formData.framework}-dev",
  "image": "${
    formData.language === "javascript" || formData.language === "typescript"
      ? "mcr.microsoft.com/devcontainers/javascript-node:18"
      : formData.language === "python"
        ? "mcr.microsoft.com/devcontainers/python:3.9"
        : formData.language === "java"
          ? "mcr.microsoft.com/devcontainers/java:17"
          : formData.language === "go"
            ? "mcr.microsoft.com/devcontainers/go:1.18"
            : "mcr.microsoft.com/devcontainers/base:ubuntu"
  }",
  "features": {
    ${
      formData.language === "javascript" || formData.language === "typescript"
        ? `"ghcr.io/devcontainers/features/node:1": {
      "version": "18"
    },`
        : ""
    }
    ${
      formData.language === "python"
        ? `"ghcr.io/devcontainers/features/python:1": {
      "version": "3.9"
    },`
        : ""
    }
    ${
      formData.devOps && formData.devOps.includes("docker-compose")
        ? `"ghcr.io/devcontainers/features/docker-in-docker:2": {},`
        : ""
    }
    "ghcr.io/devcontainers/features/git:1": {}
  },
  "customizations": {
    "vscode": {
      "extensions": [
        ${
          formData.language === "javascript" || formData.language === "typescript"
            ? `"dbaeumer.vscode-eslint",
        "esbenp.prettier-vscode",`
            : ""
        }
        ${
          formData.language === "python"
            ? `"ms-python.python",
        "ms-python.vscode-pylance",`
            : ""
        }
        ${
          formData.language === "java"
            ? `"vscjava.vscode-java-pack",
        "vscjava.vscode-maven",`
            : ""
        }
        ${formData.language === "go" ? `"golang.go",` : ""}
        "github.copilot"
      ]
    }
  },
  "forwardPorts": [${
    formData.language === "javascript" || formData.language === "typescript"
      ? "3000"
      : formData.language === "python" && formData.framework === "django"
        ? "8000"
        : formData.language === "python"
          ? "5000"
          : formData.language === "java"
            ? "8080"
            : formData.language === "go"
              ? "8080"
              : "3000"
  }],
  "postCreateCommand": "${
    formData.language === "javascript" || formData.language === "typescript"
      ? `${formData.packageManager} install`
      : formData.language === "python"
        ? "pip install -r requirements.txt"
        : formData.language === "java"
          ? "mvn install"
          : formData.language === "go"
            ? "go mod download"
            : "echo 'Setup complete'"
  }"
}`
  }

  const getReadmeContent = () => {
    return `# ${formData.framework.charAt(0).toUpperCase() + formData.framework.slice(1)} ${formData.language.charAt(0).toUpperCase() + formData.language.slice(1)} Project

This project was generated with EnvSetup.dev.

## Tech Stack

- **Language:** ${formData.language}
- **Framework:** ${formData.framework}
- **Package Manager:** ${formData.packageManager}
- **Environment:** ${formData.environment}
${
  formData.dependencies && formData.dependencies.length > 0
    ? `- **Dependencies:** ${formData.dependencies.join(", ")}`
    : ""
}
${formData.devOps && formData.devOps.length > 0 ? `- **DevOps Tools:** ${formData.devOps.join(", ")}` : ""}

## Getting Started

### Prerequisites

${
  formData.language === "javascript" || formData.language === "typescript"
    ? `- Node.js
- ${formData.packageManager}`
    : formData.language === "python"
      ? `- Python 3.9+
- pip`
      : formData.language === "java"
        ? `- JDK 17+
- Maven/Gradle`
        : formData.language === "go"
          ? `- Go 1.18+`
          : `- Required runtime for ${formData.language}`
}
${
  formData.environment === "docker"
    ? `- Docker`
    : formData.environment === "devcontainer"
      ? `- VS Code
- Docker
- Remote Containers extension`
      : formData.environment === "gitpod"
        ? `- GitHub account
- GitPod account`
        : ""
}

### Setup

${
  formData.environment === "docker"
    ? `1. Build the Docker image:
   \`\`\`
   docker build -t my-project .
   \`\`\`

2. Run the container:
   \`\`\`
   docker run -p ${
     formData.language === "javascript" || formData.language === "typescript"
       ? "3000:3000"
       : formData.language === "python" && formData.framework === "django"
         ? "8000:8000"
         : formData.language === "python"
           ? "5000:5000"
           : "8080:8080"
   } my-project
   \`\`\`
`
    : formData.environment === "devcontainer"
      ? `1. Open the project folder in VS Code
2. When prompted, click "Reopen in Container"
3. VS Code will build and start the development container
`
      : formData.environment === "gitpod"
        ? `1. Push this repository to GitHub
2. Open the repository in GitPod
3. GitPod will automatically set up the development environment
`
        : formData.environment === "local"
          ? `1. Run the setup script:
   \`\`\`
   ./setup.sh
   \`\`\`

2. Start the development server:
   \`\`\`
   ${
     formData.language === "javascript" || formData.language === "typescript"
       ? `${formData.packageManager} run dev`
       : formData.language === "python" && formData.framework === "django"
         ? "python manage.py runserver"
         : formData.language === "python"
           ? "flask run"
           : formData.language === "java"
             ? "mvn spring-boot:run"
             : formData.language === "go"
               ? "go run main.go"
               : "Start the application"
   }
   \`\`\`
`
          : `Follow the instructions in the documentation for setting up your cloud-hosted devbox.`
}

## Development

${
  formData.language === "javascript" || formData.language === "typescript"
    ? `- Start the development server: \`${formData.packageManager} run dev\`
- Build for production: \`${formData.packageManager} run build\`
- Run tests: \`${formData.packageManager} test\``
    : formData.language === "python" && formData.framework === "django"
      ? `- Start the development server: \`python manage.py runserver\`
- Create migrations: \`python manage.py makemigrations\`
- Apply migrations: \`python manage.py migrate\`
- Run tests: \`python manage.py test\``
      : formData.language === "python"
        ? `- Start the development server: \`flask run\` or \`gunicorn app:app\`
- Run tests: \`pytest\``
        : formData.language === "java"
          ? `- Build the project: \`mvn clean install\`
- Run the application: \`mvn spring-boot:run\`
- Run tests: \`mvn test\``
          : formData.language === "go"
            ? `- Run the application: \`go run main.go\`
- Build the binary: \`go build\`
- Run tests: \`go test ./...\``
            : `- Follow the standard development workflow for ${formData.language} projects`
}

## Deployment

${
  formData.devOps && formData.devOps.includes("github-actions")
    ? `This project includes GitHub Actions workflows for CI/CD. Push to the main branch to trigger the deployment pipeline.`
    : ""
}
${
  formData.devOps && formData.devOps.includes("vercel")
    ? `This project is configured for deployment on Vercel. Connect your repository to Vercel for automatic deployments.`
    : ""
}
${
  formData.devOps && formData.devOps.includes("netlify")
    ? `This project is configured for deployment on Netlify. Connect your repository to Netlify for automatic deployments.`
    : ""
}
${
  formData.devOps && formData.devOps.includes("aws")
    ? `This project includes configuration for AWS deployment. See the deployment documentation for details.`
    : ""
}

## License

MIT
`
  }

  const getGitHubWorkflowContent = () => {
    return `name: CI/CD Pipeline

on:
  push:
    branches: [ main ]
  pull_request:
    branches: [ main ]

jobs:
  build:
    runs-on: ubuntu-latest
    
    steps:
    - uses: actions/checkout@v3
    
    ${
      formData.language === "javascript" || formData.language === "typescript"
        ? `- name: Setup Node.js
      uses: actions/setup-node@v3
      with:
        node-version: '18'
        cache: '${formData.packageManager}'
    
    - name: Install dependencies
      run: ${formData.packageManager} install
    
    - name: Run tests
      run: ${formData.packageManager} test
    
    - name: Build
      run: ${formData.packageManager} run build`
        : formData.language === "python"
          ? `- name: Setup Python
      uses: actions/setup-python@v4
      with:
        python-version: '3.9'
        cache: 'pip'
    
    - name: Install dependencies
      run: |
        python -m pip install --upgrade pip
        pip install -r requirements.txt
    
    - name: Run tests
      run: ${formData.framework === "django" ? "python manage.py test" : "pytest"}`
          : formData.language === "java"
            ? `- name: Setup Java
      uses: actions/setup-java@v3
      with:
        distribution: 'temurin'
        java-version: '17'
        cache: 'maven'
    
    - name: Build with Maven
      run: mvn -B package --file pom.xml
    
    - name: Run tests
      run: mvn test`
            : formData.language === "go"
              ? `- name: Setup Go
      uses: actions/setup-go@v4
      with:
        go-version: '1.18'
    
    - name: Build
      run: go build -v ./...
    
    - name: Test
      run: go test -v ./...`
              : `# Add build steps for ${formData.language}`
    }
    
    ${
      formData.devOps && formData.devOps.includes("docker-compose")
        ? `- name: Build and test with Docker Compose
      run: |
        docker-compose build
        docker-compose up -d
        docker-compose down`
        : ""
    }
    
    ${
      formData.devOps && formData.devOps.includes("vercel")
        ? `- name: Deploy to Vercel
      if: github.ref == 'refs/heads/main'
      uses: amondnet/vercel-action@v20
      with:
        vercel-token: \${{ secrets.VERCEL_TOKEN }}
        vercel-org-id: \${{ secrets.VERCEL_ORG_ID }}
        vercel-project-id: \${{ secrets.VERCEL_PROJECT_ID }}
        vercel-args: '--prod'`
        : ""
    }
    
    ${
      formData.devOps && formData.devOps.includes("aws")
        ? `- name: Deploy to AWS
      if: github.ref == 'refs/heads/main'
      uses: aws-actions/configure-aws-credentials@v1
      with:
        aws-access-key-id: \${{ secrets.AWS_ACCESS_KEY_ID }}
        aws-secret-access-key: \${{ secrets.AWS_SECRET_ACCESS_KEY }}
        aws-region: us-east-1
        
    - name: Deploy to AWS
      run: |
        # Add AWS deployment steps here`
        : ""
    }
`
  }

  return (
    <div className="space-y-4">
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid grid-cols-4">
          <TabsTrigger value="dockerfile">
            {formData.environment === "docker"
              ? "Dockerfile"
              : formData.environment === "devcontainer"
                ? "devcontainer.json"
                : formData.environment === "gitpod"
                  ? "gitpod.yml"
                  : "Config"}
          </TabsTrigger>
          <TabsTrigger value="readme">README.md</TabsTrigger>
          <TabsTrigger value="github-workflow">GitHub Workflow</TabsTrigger>
          <TabsTrigger value="project-structure">Project Structure</TabsTrigger>
        </TabsList>
      </Tabs>

      <Card className="p-4 bg-muted/50 overflow-auto">
        <pre className="text-xs md:text-sm font-mono whitespace-pre-wrap">
          {activeTab === "dockerfile" && formData.environment === "docker" && getDockerfileContent()}
          {activeTab === "dockerfile" && formData.environment === "devcontainer" && getDevContainerContent()}
          {activeTab === "readme" && getReadmeContent()}
          {activeTab === "github-workflow" && getGitHubWorkflowContent()}
          {activeTab === "project-structure" &&
            `
📁 project-root/
├── 📄 README.md
${formData.environment === "docker" ? "├── 📄 Dockerfile\n" : ""}
${formData.environment === "devcontainer" ? "├── 📁 .devcontainer/\n│   └── 📄 devcontainer.json\n" : ""}
${formData.environment === "gitpod" ? "├── 📄 .gitpod.yml\n" : ""}
${formData.devOps && formData.devOps.includes("github-actions") ? "├── 📁 .github/\n│   └── 📁 workflows/\n│       └── 📄 ci.yml\n" : ""}
${formData.devOps && formData.devOps.includes("gitlab-ci") ? "├── 📄 .gitlab-ci.yml\n" : ""}
${formData.devOps && formData.devOps.includes("docker-compose") ? "├── 📄 docker-compose.yml\n" : ""}
${
  formData.language === "javascript" || formData.language === "typescript"
    ? `├── 📄 package.json
├── 📄 ${formData.language === "typescript" ? "tsconfig.json" : ""}
├── 📁 src/
${
  formData.framework === "react" || formData.framework === "next.js"
    ? `│   ├── 📁 components/
│   ├── 📁 ${formData.framework === "next.js" ? "app/" : "pages/"}
│   └── 📁 ${formData.framework === "next.js" ? "public/" : "assets/"}`
    : formData.framework === "vue" || formData.framework === "nuxt.js"
      ? `│   ├── 📁 components/
│   ├── 📁 ${formData.framework === "nuxt.js" ? "pages/" : "views/"}
│   └── 📁 assets/`
      : formData.framework === "express" || formData.framework === "nestjs"
        ? `│   ├── 📁 controllers/
│   ├── 📁 models/
│   ├── 📁 routes/
│   └── 📄 index.${formData.language === "typescript" ? "ts" : "js"}`
        : `│   └── 📄 index.${formData.language === "typescript" ? "ts" : "js"}`
}`
    : formData.language === "python"
      ? `├── 📄 requirements.txt
${
  formData.framework === "django"
    ? `├── 📄 manage.py
├── 📁 project_name/
│   ├── 📄 settings.py
│   ├── 📄 urls.py
│   └── 📄 wsgi.py
└── 📁 app_name/
    ├── 📁 migrations/
    ├── 📄 models.py
    ├── 📄 views.py
    └── 📄 tests.py`
    : formData.framework === "flask" || formData.framework === "fastapi"
      ? `├── 📄 app.py
├── 📁 templates/
├── 📁 static/
└── 📁 tests/`
      : `├── 📄 main.py
└── 📁 tests/`
}`
      : formData.language === "java"
        ? `├── 📄 pom.xml
└── 📁 src/
    ├── 📁 main/
    │   ├── 📁 java/
    │   │   └── 📁 com/example/project/
    │   │       ├── 📄 Application.java
    │   │       ├── 📁 controllers/
    │   │       ├── 📁 models/
    │   │       └── �� services/
    │   └── 📁 resources/
    └── 📁 test/
        └── 📁 java/
            └── 📁 com/example/project/`
        : formData.language === "go"
          ? `├── 📄 go.mod
├── 📄 go.sum
├── 📄 main.go
├── 📁 pkg/
│   ├── 📁 handlers/
│   ├── 📁 models/
│   └── 📁 services/
└── 📁 cmd/
    └── 📁 server/`
          : `├── 📁 src/
└── 📁 tests/`
}
`}
        </pre>
      </Card>
    </div>
  )
}
