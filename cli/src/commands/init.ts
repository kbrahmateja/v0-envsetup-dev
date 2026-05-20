import { group, text, select, multiselect, confirm, isCancel, cancel, spinner, intro, outro, note } from '@clack/prompts'
import { ideOptions, cicdOptions, testingOptions, qualityOptions, getRecommended } from '../data/recommendations.js'
import pc from 'picocolors'
import { generateTemplates } from '../utils/templates.js'

// ── Pre-defined Templates ──────────────────────────────────────────────────
const TEMPLATES = [
  // Full Stack
  { id: 'nextjs-postgres',     label: 'Next.js + PostgreSQL',          hint: 'TypeScript · Full Stack', tags: ['nextjs','postgres','typescript'] },
  { id: 'nextjs-supabase',     label: 'Next.js + Supabase',            hint: 'TypeScript · Auth included', tags: ['nextjs','supabase','typescript'] },
  { id: 't3-stack',            label: 'T3 Stack',                      hint: 'Next.js + tRPC + Prisma + NextAuth', tags: ['nextjs','postgres','typescript'] },
  { id: 'mern',                label: 'MERN Stack',                    hint: 'MongoDB + Express + React + Node', tags: ['express','mongodb','javascript'] },
  { id: 'spring-react',        label: 'Spring Boot + React',           hint: 'Java · Enterprise Full Stack', tags: ['springboot','postgres','java'] },
  { id: 'fastapi-nextjs',      label: 'FastAPI + Next.js',             hint: 'Python BE + TypeScript FE', tags: ['fastapi','postgres','python'] },
  { id: 'django-react',        label: 'Django + React',                hint: 'Python · REST API', tags: ['django','postgres','python'] },
  // Backend only
  { id: 'fastapi-pg',          label: 'FastAPI + PostgreSQL',          hint: 'Python · Async API', tags: ['fastapi','postgres','python'] },
  { id: 'spring-boot-pg',      label: 'Spring Boot + PostgreSQL',      hint: 'Java · Enterprise API', tags: ['springboot','postgres','java'] },
  { id: 'go-gin-pg',           label: 'Go + Gin + PostgreSQL',         hint: 'Go · High Performance', tags: ['gin','postgres','go'] },
  { id: 'nestjs-pg',           label: 'NestJS + PostgreSQL',           hint: 'TypeScript · Scalable', tags: ['nestjs','postgres','typescript'] },
  { id: 'laravel-mysql',       label: 'Laravel + MySQL',               hint: 'PHP · Full Featured', tags: ['laravel','mysql','php'] },
  { id: 'rails-pg',            label: 'Ruby on Rails + PostgreSQL',    hint: 'Ruby · Convention', tags: ['rails','postgres','ruby'] },
  // Microservices
  { id: 'microservices-node',  label: 'Microservices (Node.js)',       hint: 'NestJS · Docker · Gateway', tags: ['nestjs','postgres','typescript'] },
  { id: 'microservices-go',    label: 'Microservices (Go)',            hint: 'Gin · gRPC · Docker', tags: ['gin','postgres','go'] },
]

// ── Manual flow options ────────────────────────────────────────────────────
const APP_TYPES = [
  { value: 'web',     label: 'Web Application',    hint: 'Browser-based app' },
  { value: 'api',     label: 'API / Backend only',  hint: 'REST / GraphQL / gRPC' },
  { value: 'mobile',  label: 'Mobile App Backend',  hint: 'API for iOS/Android' },
  { value: 'cli',     label: 'CLI Tool',             hint: 'Command-line app' },
]
const ARCHITECTURES = [
  { value: 'monolith',       label: 'Monolithic',      hint: 'Single deployable unit — simple & fast to build' },
  { value: 'microservices',  label: 'Microservices',   hint: 'Multiple services — scalable but complex' },
  { value: 'serverless',     label: 'Serverless',      hint: 'Function-based — pay per use' },
]
const FE_FRAMEWORKS: Record<string, string[]> = {
  typescript: ['Next.js', 'Remix', 'Nuxt.js', 'SvelteKit', 'Astro', 'Angular'],
  javascript: ['React + Vite', 'Vue + Vite', 'Svelte', 'Vanilla JS'],
}
const DESIGN_SYSTEMS = [
  { value: 'tailwind',   label: 'Tailwind CSS',     hint: 'Utility-first — most popular' },
  { value: 'shadcn',     label: 'shadcn/ui',         hint: 'Tailwind + Radix — beautiful components' },
  { value: 'bootstrap',  label: 'Bootstrap',         hint: 'Classic CSS framework' },
  { value: 'mui',        label: 'Material UI',       hint: 'Google Material Design' },
  { value: 'none',       label: 'No UI library',     hint: 'Plain CSS / Custom' },
]
const BE_LANGUAGES = [
  { value: 'typescript', label: 'TypeScript / Node.js' },
  { value: 'python',     label: 'Python' },
  { value: 'java',       label: 'Java' },
  { value: 'go',         label: 'Go' },
  { value: 'rust',       label: 'Rust' },
  { value: 'php',        label: 'PHP' },
  { value: 'ruby',       label: 'Ruby' },
  { value: 'csharp',     label: 'C# / .NET' },
]
const BE_FRAMEWORKS: Record<string, Array<{value:string, label:string, hint?:string}>> = {
  typescript: [
    { value: 'nestjs',   label: 'NestJS',    hint: 'Enterprise · Opinionated' },
    { value: 'express',  label: 'Express',   hint: 'Minimal · Flexible' },
    { value: 'fastify',  label: 'Fastify',   hint: 'Fast · Schema-based' },
    { value: 'hono',     label: 'Hono',      hint: 'Edge · Lightweight' },
  ],
  python: [
    { value: 'fastapi',  label: 'FastAPI',   hint: 'Modern · Async · Auto docs' },
    { value: 'django',   label: 'Django',    hint: 'Batteries included' },
    { value: 'flask',    label: 'Flask',     hint: 'Minimal · Simple' },
  ],
  java: [
    { value: 'springboot', label: 'Spring Boot', hint: 'Enterprise standard' },
    { value: 'quarkus',    label: 'Quarkus',     hint: 'Cloud native · Fast startup' },
  ],
  go: [
    { value: 'gin',   label: 'Gin',   hint: 'Fast · Popular' },
    { value: 'fiber', label: 'Fiber', hint: 'Express-inspired' },
    { value: 'echo',  label: 'Echo',  hint: 'Minimal' },
  ],
  rust: [
    { value: 'actix', label: 'Actix Web', hint: 'Blazing fast' },
    { value: 'axum',  label: 'Axum',      hint: 'Tokio-based' },
  ],
  php: [
    { value: 'laravel',  label: 'Laravel',   hint: 'Full featured' },
    { value: 'symfony',  label: 'Symfony',   hint: 'Enterprise' },
  ],
  ruby: [{ value: 'rails', label: 'Ruby on Rails', hint: 'Convention > config' }],
  csharp: [{ value: 'aspnet', label: 'ASP.NET Core', hint: 'Microsoft stack' }],
}
const DATABASES = [
  { value: 'postgres',  label: 'PostgreSQL',  hint: 'Reliable · Feature-rich — Recommended' },
  { value: 'mysql',     label: 'MySQL',       hint: 'Popular · Wide support' },
  { value: 'mongodb',   label: 'MongoDB',     hint: 'NoSQL · Flexible schema' },
  { value: 'sqlite',    label: 'SQLite',      hint: 'Embedded · Zero config' },
  { value: 'redis',     label: 'Redis',       hint: 'Cache + Queue' },
  { value: 'none',      label: 'No database', hint: 'Stateless API' },
]
const CLOUDS = [
  { value: 'none',    label: 'Local / Docker only',  hint: 'docker compose up' },
  { value: 'vercel',  label: 'Vercel',               hint: 'FE + Serverless — free tier' },
  { value: 'railway', label: 'Railway',              hint: 'Full stack — easy deploy' },
  { value: 'aws',     label: 'AWS',                  hint: 'ECS / Lambda / RDS' },
  { value: 'gcp',     label: 'Google Cloud',         hint: 'Cloud Run / Cloud SQL' },
  { value: 'azure',   label: 'Azure',                hint: 'App Service / AKS' },
  { value: 'fly',     label: 'Fly.io',               hint: 'Global edge · Developer friendly' },
]

// ── Main command ───────────────────────────────────────────────────────────
export async function initCommand(options: { ai?: boolean }) {
  intro(pc.bgCyan(pc.black(' envsetup.dev ')))

  // Project name
  const name = await text({
    message: 'Project name?',
    placeholder: 'my-awesome-app',
    validate: (v: string) => (!v.trim() ? 'Name is required' : undefined),
  })
  if (isCancel(name)) { cancel('Cancelled'); process.exit(0) }

  // Mode selection
  const mode = await select({
    message: 'How do you want to set up?',
    options: [
      { value: 'template', label: '📦  Use a template',      hint: 'Pre-defined stacks — quick start' },
      { value: 'manual',   label: '🔧  Manual setup',        hint: 'Step-by-step guided questions' },
    ],
  })
  if (isCancel(mode)) { cancel('Cancelled'); process.exit(0) }

  let config: any = { name }

  if (mode === 'template') {
    config = await templateFlow(config)
  } else {
    config = await manualFlow(config)
  }

  if (!config) return

  // Generate
  const s = spinner()
  s.start('Generating your environment...')
  const files = await generateTemplates(config)
  s.stop(pc.green(`✓ Generated ${files.length} files`))

  console.log(pc.cyan('\n  Files created:'))
  files.forEach((f: string) => console.log(pc.dim(`    ${f}`)))

  console.log(`\n  ${pc.bold('Next steps:')}`)
  console.log(pc.dim(`    cd ${String(name)}`))
  console.log(pc.dim('    cp .env.example .env'))
  console.log(pc.dim('    docker compose up -d'))
  console.log(`\n  ${pc.dim('More templates: https://envsetup.dev/templates')}`)

  outro(pc.green('Happy coding! 🚀'))
}

// ── Template flow ──────────────────────────────────────────────────────────
async function templateFlow(base: any) {
  const templateId = await select({
    message: 'Choose a template:',
    options: TEMPLATES.map(t => ({ value: t.id, label: t.label, hint: t.hint })),
  })
  if (isCancel(templateId)) { cancel('Cancelled'); process.exit(0) }

  const tpl = TEMPLATES.find(t => t.id === templateId)!

  const cloud = await select({
    message: 'Deploy target?',
    options: CLOUDS,
  })
  if (isCancel(cloud)) { cancel('Cancelled'); process.exit(0) }

  const devops = await multiselect({
    message: 'Additional DevOps? (space to select)',
    options: [
      { value: 'github-actions', label: 'GitHub Actions CI' },
      { value: 'devcontainer',   label: 'VS Code Dev Container' },
    ],
    required: false,
  }) as string[]

  // Map template to config
  const [stack, db] = [tpl.tags[0], tpl.tags[1] ?? 'none']
  return { ...base, stack, database: db, cloud, tools: [], devops: devops ?? [], language: tpl.tags[2] ?? 'typescript' }
}

// ── Manual flow ────────────────────────────────────────────────────────────
async function manualFlow(base: any) {
  // 1. App type
  const appType = await select({ message: 'What are you building?', options: APP_TYPES })
  if (isCancel(appType)) { cancel('Cancelled'); process.exit(0) }

  // 2. Architecture (for web/api)
  let architecture = 'monolith'
  if (appType === 'web' || appType === 'api') {
    const arch = await select({ message: 'Architecture?', options: ARCHITECTURES })
    if (isCancel(arch)) { cancel('Cancelled'); process.exit(0) }
    architecture = arch as string
  }

  // 3. Frontend?
  let feStack: string | null = null
  let designSystem: string | null = null
  if (appType === 'web') {
    const hasFE = await confirm({ message: 'Include a frontend?' })
    if (isCancel(hasFE)) { cancel('Cancelled'); process.exit(0) }
    if (hasFE) {
      const feLang = await select({
        message: 'Frontend language?',
        options: [
          { value: 'typescript', label: 'TypeScript', hint: 'Recommended' },
          { value: 'javascript', label: 'JavaScript' },
        ],
      }) as string
      if (isCancel(feLang)) { cancel('Cancelled'); process.exit(0) }

      const feFramework = await select({
        message: 'Frontend framework?',
        options: (FE_FRAMEWORKS[feLang] ?? FE_FRAMEWORKS.typescript).map(f => ({ value: f.toLowerCase().replace(/[^a-z]/g,''), label: f })),
      }) as string
      if (isCancel(feFramework)) { cancel('Cancelled'); process.exit(0) }
      feStack = feFramework

      const ds = await select({ message: 'UI / Design system?', options: DESIGN_SYSTEMS })
      if (isCancel(ds)) { cancel('Cancelled'); process.exit(0) }
      designSystem = ds as string
    }
  }

  // 4. Backend
  const beLang = await select({ message: 'Backend language?', options: BE_LANGUAGES }) as string
  if (isCancel(beLang)) { cancel('Cancelled'); process.exit(0) }

  const beOptions = BE_FRAMEWORKS[beLang] ?? []
  const beFramework = await select({
    message: 'Backend framework?',
    options: beOptions,
  }) as string
  if (isCancel(beFramework)) { cancel('Cancelled'); process.exit(0) }

  // 5. Database
  const database = await select({ message: 'Database?', options: DATABASES }) as string
  if (isCancel(database)) { cancel('Cancelled'); process.exit(0) }

  // 6. Cloud
  const cloud = await select({ message: 'Deploy target?', options: CLOUDS }) as string
  if (isCancel(cloud)) { cancel('Cancelled'); process.exit(0) }

  // 7. IDE recommendation
  const langKey = beLang as string
  const ideList = ideOptions[langKey] ?? ideOptions.typescript
  const ideChoices = ideList.map(o => ({
    value: o.value,
    label: o.label + (o.recommended ? pc.green(' ★ Recommended') : ''),
    hint: o.hint,
  }))
  const ide = await select({ message: 'Preferred IDE?', options: ideChoices }) as string
  if (isCancel(ide)) { cancel('Cancelled'); process.exit(0) }

  // 8. CI/CD
  const cicd = await select({
    message: 'CI/CD pipeline?',
    options: cicdOptions.map(o => ({
      value: o.value,
      label: o.label + (o.recommended ? pc.green(' ★ Recommended') : ''),
      hint: o.hint,
    })),
  }) as string
  if (isCancel(cicd)) { cancel('Cancelled'); process.exit(0) }

  // 9. Testing tools
  const testList = testingOptions[langKey] ?? testingOptions.typescript
  const testing = await multiselect({
    message: 'Testing tools? (space to select, ★ = recommended)',
    options: testList.map(o => ({
      value: o.value,
      label: o.label + (o.recommended ? pc.green(' ★') : ''),
      hint: o.hint,
    })),
    initialValues: getRecommended(testList),
    required: false,
  }) as string[]
  if (isCancel(testing)) { cancel('Cancelled'); process.exit(0) }

  // 10. Extra tools
  const tools = await multiselect({
    message: 'Additional tools? (space to select)',
    options: [
      { value: 'redis',           label: 'Redis',           hint: 'Cache / Queue' },
      { value: 'minio',           label: 'MinIO',           hint: 'S3-compatible storage' },
      { value: 'meilisearch',     label: 'Meilisearch',     hint: 'Search engine' },
      { value: 'github-actions',  label: 'GitHub Actions',  hint: 'CI/CD pipeline' },
      { value: 'devcontainer',    label: 'Dev Container',   hint: 'VS Code remote dev' },
    ],
    required: false,
  }) as string[]

  // Summary
  const toolList = tools ?? []
  note(
    [
      `App type:     ${appType} · ${architecture}`,
      feStack ? `Frontend:     ${feStack}${designSystem !== 'none' ? ` + ${designSystem}` : ''}` : '',
      `Backend:      ${beLang} / ${beFramework}`,
      `Database:     ${database}`,
      `Cloud:        ${cloud}`,
      toolList.length ? `Tools:        ${toolList.join(', ')}` : '',
    ].filter(Boolean).join('\n'),
    'Your stack'
  )

  const proceed = await confirm({ message: 'Generate files?' })
  if (isCancel(proceed) || !proceed) { cancel('Cancelled'); process.exit(0) }

  const devopsTools = toolList.filter((t: string) => ['github-actions','devcontainer'].includes(t))
  if (cicd !== 'none' && !devopsTools.includes(cicd)) devopsTools.push(cicd)

  return {
    ...base,
    appType,
    architecture,
    feStack,
    designSystem,
    stack: feStack ?? beFramework,
    language: beLang,
    framework: beFramework,
    database,
    cloud,
    ide,
    testing: (testing ?? []) as string[],
    tools: toolList.filter((t: string) => !['github-actions','devcontainer'].includes(t)),
    devops: devopsTools,
  }
}
