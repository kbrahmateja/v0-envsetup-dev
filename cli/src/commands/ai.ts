import { text, select, multiselect, confirm, spinner, isCancel, cancel, note } from '@clack/prompts'
import { ideOptions, cicdOptions, testingOptions, getRecommended } from '../data/recommendations.js'
import pc from 'picocolors'
import { generateTemplates } from '../utils/templates.js'

const API_BASE = 'https://envsetup.dev'

interface Message { role: 'user' | 'assistant'; content: string }
interface DetectedStack {
  framework: string; language: string; database: string
  port: number; dockerImage: string; architecture: string; cloud: string
}

async function askAI(messages: Message[]): Promise<string> {
  try {
    const res = await fetch(`${API_BASE}/api/ai-assistant`, {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ messages }),
    })
    if (!res.ok) throw new Error(`HTTP ${res.status}`)
    const data = await res.json() as { message: string }
    return data.message ?? 'Could not get a response.'
  } catch { return 'Unable to connect. Check your internet.' }
}

function detectStack(messages: Message[]): DetectedStack {
  const all = messages.map(m => m.content).join(' ').toLowerCase()

  const fw = [
    ['spring boot', 'springboot'], ['quarkus', 'quarkus'], ['java', 'springboot'],
    ['fastapi', 'fastapi'], ['django', 'django'], ['flask', 'flask'], ['python', 'fastapi'],
    ['next.js', 'nextjs'], ['nextjs', 'nextjs'], ['nestjs', 'nestjs'],
    ['express', 'express'], ['node', 'express'],
    ['gin', 'gin'], ['fiber', 'fiber'], ['golang', 'gin'], ['go ', 'gin'],
    ['actix', 'actix'], ['axum', 'axum'], ['rust', 'actix'],
    ['laravel', 'laravel'], ['codeigniter', 'laravel'], ['php', 'laravel'],
    ['rails', 'rails'], ['ruby', 'rails'],
    ['aspnet', 'aspnet'], ['.net', 'aspnet'], ['csharp', 'aspnet'],
    ['phoenix', 'phoenix'], ['elixir', 'phoenix'],
  ]
  const db = [
    ['oracle', 'postgres'], ['postgresql', 'postgres'], ['postgres', 'postgres'],
    ['mysql', 'mysql'], ['mongodb', 'mongodb'], ['mongo', 'mongodb'],
    ['sqlite', 'sqlite'], ['redis', 'redis'],
  ]
  const lang = [
    ['java', 'java'], ['kotlin', 'kotlin'], ['python', 'python'],
    ['typescript', 'typescript'], ['javascript', 'javascript'], ['node', 'javascript'],
    ['go', 'go'], ['golang', 'go'], ['rust', 'rust'],
    ['php', 'php'], ['ruby', 'ruby'], ['c#', 'csharp'], ['.net', 'csharp'],
    ['elixir', 'elixir'],
  ]
  const clouds = [
    ['aws', 'aws'], ['amazon', 'aws'], ['gcp', 'gcp'], ['google cloud', 'gcp'],
    ['azure', 'azure'], ['vercel', 'vercel'], ['railway', 'railway'],
    ['fly.io', 'fly'], ['kubernetes', 'aws'],
  ]
  const archs = [
    ['microservice', 'microservices'], ['micro service', 'microservices'],
    ['serverless', 'serverless'], ['monorepo', 'monolith'],
  ]

  const find = (pairs: string[][], text: string) =>
    pairs.find(([k]) => text.includes(k))?.[1] ?? pairs[pairs.length - 1][1]

  const framework = find(fw, all) ?? 'express'
  const database = find(db, all) ?? 'postgres'
  const language = find(lang, all) ?? 'javascript'
  const cloud = find(clouds, all) ?? 'none'
  const architecture = find(archs, all) ?? 'monolith'

  const dockerImages: Record<string, string> = {
    springboot: 'eclipse-temurin:21-jdk-alpine', quarkus: 'eclipse-temurin:21-jdk-alpine',
    fastapi: 'python:3.12-slim', django: 'python:3.12-slim', flask: 'python:3.12-slim',
    nextjs: 'node:20-alpine', nestjs: 'node:20-alpine', express: 'node:20-alpine',
    gin: 'golang:1.22-alpine', fiber: 'golang:1.22-alpine',
    actix: 'rust:1.75-alpine', axum: 'rust:1.75-alpine',
    laravel: 'php:8.3-fpm-alpine', rails: 'ruby:3.3-alpine',
    aspnet: 'mcr.microsoft.com/dotnet/sdk:8.0-alpine', phoenix: 'elixir:1.16-alpine',
  }
  const ports: Record<string, number> = {
    springboot: 8080, quarkus: 8080, fastapi: 8000, django: 8000, flask: 8000,
    nextjs: 3000, nestjs: 3000, express: 3000, gin: 8080, fiber: 8080,
    actix: 8080, axum: 8080, laravel: 9000, rails: 3000, aspnet: 8080, phoenix: 4000,
  }

  return {
    framework, language, database, architecture, cloud,
    dockerImage: dockerImages[framework] ?? 'node:20-alpine',
    port: ports[framework] ?? 3000,
  }
}

async function showConfirmTable(stack: DetectedStack): Promise<DetectedStack> {
  note(
    [
      `  Framework    : ${pc.cyan(stack.framework)}`,
      `  Language     : ${pc.cyan(stack.language)}`,
      `  Database     : ${pc.cyan(stack.database)}`,
      `  Architecture : ${pc.cyan(stack.architecture)}`,
      `  Docker image : ${pc.dim(stack.dockerImage)}`,
      `  Port         : ${pc.dim(String(stack.port))}`,
      `  Cloud        : ${pc.dim(stack.cloud === 'none' ? 'Local Docker' : stack.cloud)}`,
    ].join('\n'),
    pc.bold('Detected Stack')
  )

  const ok = await confirm({ message: 'Does this look right?' })
  if (isCancel(ok)) { cancel('Cancelled'); process.exit(0) }

  if (ok) return stack

  // Allow user to modify
  console.log(pc.dim('\n  What would you like to change?\n'))

  const field = await select({
    message: 'Which field to modify?',
    options: [
      { value: 'framework', label: `Framework  (${stack.framework})` },
      { value: 'language',  label: `Language   (${stack.language})` },
      { value: 'database',  label: `Database   (${stack.database})` },
      { value: 'architecture', label: `Architecture (${stack.architecture})` },
      { value: 'cloud',     label: `Cloud      (${stack.cloud})` },
      { value: 'done',      label: 'Nothing — proceed with current' },
    ],
  })
  if (isCancel(field) || field === 'done') return stack

  const newVal = await text({
    message: `New value for ${field as string}:`,
    placeholder: (stack as any)[field as string],
  })
  if (isCancel(newVal)) return stack

  const updated = { ...stack, [field as string]: newVal as string }
  // Recursively show table again to confirm final version
  return showConfirmTable(updated)
}

export async function aiCommand() {
  console.log()
  console.log(pc.cyan('  🤖 AI Mode — describe your project in any language'))
  console.log(pc.dim('  Type your requirements. I\'ll ask questions and confirm the stack before generating.\n'))

  const messages: Message[] = []

  // Conversation loop
  while (true) {
    const input = await text({
      message: pc.cyan('You'),
      placeholder: 'e.g. java microservices with oracle and mysql on aws...',
      validate: (v: string) => (!v.trim() ? 'Please describe your project' : undefined),
    })
    if (isCancel(input)) { cancel('Cancelled'); process.exit(0) }

    messages.push({ role: 'user', content: input as string })

    const s = spinner()
    s.start('Thinking...')
    const response = await askAI(messages)
    s.stop('')
    messages.push({ role: 'assistant', content: response })

    // Display response
    console.log()
    response.split('\n').forEach(line => {
      const cleaned = line.replace(/\*\*/g, '')
      if (line.startsWith('**') || line.startsWith('##')) {
        console.log('  ' + pc.bold(pc.cyan(cleaned.replace(/^#+\s*/, ''))))
      } else if (line.match(/^[-•]\s/)) {
        console.log('  ' + pc.dim(line))
      } else if (line.startsWith('```')) {
        // skip code fences
      } else if (line.trim()) {
        console.log('  ' + line)
      }
    })
    console.log()

    // Only move to confirm/generate when AI indicates it has enough info
    // OR when user says yes/go/generate
    const aiReady = response.toLowerCase().includes('ready to generate') ||
                    response.toLowerCase().includes('shall i generate') ||
                    response.toLowerCase().includes('let me generate') ||
                    (response.toLowerCase().includes('generate') && messages.length >= 4 && !response.includes('?'))

    const lastUserMsg = (input as string).trim().toLowerCase()
    const userReady = ['yes', 'yeah', 'yep', 'ok', 'go', 'generate', 'proceed', 'sure', 'do it'].includes(lastUserMsg)

    if (aiReady || userReady || messages.length >= 10) {
      break
    }
    // Otherwise keep chatting
  }

  // ── Confirm stack before generating ────────────────────────────────────
  let detectedStack = detectStack(messages)
  detectedStack = await showConfirmTable(detectedStack)

  // IDE recommendation
  const langKey = detectedStack.language
  const ideList = ideOptions[langKey] ?? ideOptions.typescript
  const ide = await select({
    message: 'Preferred IDE?',
    options: ideList.map(o => ({
      value: o.value,
      label: o.label + (o.recommended ? ' ★' : ''),
      hint: o.hint,
    })),
  }) as string
  if (isCancel(ide)) { cancel('Cancelled'); process.exit(0) }

  // CI/CD
  const cicd = await select({
    message: 'CI/CD pipeline?',
    options: cicdOptions.map(o => ({
      value: o.value,
      label: o.label + (o.recommended ? ' ★' : ''),
      hint: o.hint,
    })),
  }) as string
  if (isCancel(cicd)) { cancel('Cancelled'); process.exit(0) }

  // Testing
  const testList = testingOptions[langKey] ?? testingOptions.typescript
  const testing = await multiselect({
    message: 'Testing tools? (★ = recommended)',
    options: testList.map(o => ({
      value: o.value,
      label: o.label + (o.recommended ? ' ★' : ''),
      hint: o.hint,
    })),
    initialValues: getRecommended(testList),
    required: false,
  }) as string[]
  if (isCancel(testing)) { cancel('Cancelled'); process.exit(0) }

  const doGenerate = await confirm({ message: 'Generate environment files now?' })
  if (isCancel(doGenerate) || !doGenerate) {
    console.log(pc.dim('\n  Visit https://envsetup.dev for more options.\n'))
    return
  }

  const projName = await text({
    message: 'Project name?',
    placeholder: 'my-project',
    validate: (v: string) => (!v.trim() ? 'Required' : undefined),
  })
  if (isCancel(projName)) { cancel('Cancelled'); process.exit(0) }

  const s = spinner()
  s.start(`Generating ${detectedStack.framework} + ${detectedStack.database} environment...`)

  const devops: string[] = []
  if (cicd && cicd !== 'none') devops.push(cicd)

  const files = await generateTemplates({
    name: projName as string,
    stack: detectedStack.framework,
    language: detectedStack.language,
    database: detectedStack.database,
    tools: (testing ?? []) as string[],
    devops,
  })
  s.stop(pc.green(`✓ Generated ${files.length} files!`))

  console.log(pc.cyan('\n  Files created:'))
  files.forEach((f: string) => console.log(pc.dim(`    ${f}`)))

  console.log(`\n  ${pc.bold('Next steps:')}`)
  console.log(pc.dim(`    cd ${String(projName)}`))
  console.log(pc.dim('    cp .env.example .env'))
  console.log(pc.dim('    docker compose up -d\n'))
}
