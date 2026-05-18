import { group, text, select, multiselect, confirm, isCancel, cancel, spinner, note } from '@clack/prompts';
import pc from 'picocolors';
import { generateTemplates } from '../utils/templates.js';

const stacks: Record<string, { label: string; hint?: string }> = {
  // JavaScript / TypeScript
  nextjs:      { label: 'Next.js',       hint: 'TypeScript · Recommended' },
  nestjs:      { label: 'NestJS',        hint: 'TypeScript · Enterprise' },
  express:     { label: 'Express.js',    hint: 'JavaScript · Minimal' },
  fastify:     { label: 'Fastify',       hint: 'JavaScript · Fast' },
  sveltekit:   { label: 'SvelteKit',     hint: 'TypeScript · Modern' },
  nuxtjs:      { label: 'Nuxt.js',       hint: 'TypeScript · Vue' },
  remix:       { label: 'Remix',         hint: 'TypeScript · Full-stack' },
  hono:        { label: 'Hono',          hint: 'TypeScript · Edge' },
  // Python
  fastapi:     { label: 'FastAPI',       hint: 'Python · Async' },
  django:      { label: 'Django',        hint: 'Python · Batteries included' },
  flask:       { label: 'Flask',         hint: 'Python · Lightweight' },
  // Java / Kotlin
  springboot:  { label: 'Spring Boot',   hint: 'Java · Enterprise' },
  quarkus:     { label: 'Quarkus',       hint: 'Java · Cloud-native' },
  ktor:        { label: 'Ktor',          hint: 'Kotlin · Async' },
  // Go
  gin:         { label: 'Gin',           hint: 'Go · Fast' },
  fiber:       { label: 'Fiber',         hint: 'Go · Express-inspired' },
  echo:        { label: 'Echo',          hint: 'Go · Minimal' },
  // Rust
  actix:       { label: 'Actix Web',     hint: 'Rust · Blazing fast' },
  axum:        { label: 'Axum',          hint: 'Rust · Tokio-based' },
  // PHP / Ruby
  laravel:     { label: 'Laravel',       hint: 'PHP · Full-stack' },
  rails:       { label: 'Ruby on Rails', hint: 'Ruby · Convention over config' },
  // .NET
  aspnet:      { label: 'ASP.NET Core',  hint: 'C# · Microsoft' },
  // Elixir
  phoenix:     { label: 'Phoenix',       hint: 'Elixir · Real-time' },
}

const databases: Record<string, string> = {
  postgres:  'PostgreSQL',
  mysql:     'MySQL',
  mongodb:   'MongoDB',
  sqlite:    'SQLite (embedded)',
  redis:     'Redis (cache/queue)',
  none:      'None',
}

export async function initCommand(options: { ai?: boolean }) {
  if (options.ai) {
    note(
      'AI mode will recommend the best stack for your use case.\nVisit https://envsetup.dev/ai-assistant for the full AI experience.',
      pc.cyan('✨ AI Mode')
    )
  }

  // Group stacks by language for better UX
  const stackGroups = [
    { group: 'TypeScript / JavaScript', keys: ['nextjs','nestjs','express','fastify','sveltekit','nuxtjs','remix','hono'] },
    { group: 'Python', keys: ['fastapi','django','flask'] },
    { group: 'Java / Kotlin', keys: ['springboot','quarkus','ktor'] },
    { group: 'Go', keys: ['gin','fiber','echo'] },
    { group: 'Rust', keys: ['actix','axum'] },
    { group: 'PHP / Ruby / .NET / Elixir', keys: ['laravel','rails','aspnet','phoenix'] },
  ]

  const stackOptions = stackGroups.flatMap(g => [
    // Group separator
    ...g.keys.map(k => ({
      value: k,
      label: stacks[k].label,
      hint: stacks[k].hint,
    }))
  ])

  const project = await group(
    {
      name: () =>
        text({
          message: 'Project name?',
          placeholder: 'my-awesome-app',
          validate: (v: string) => (!v ? 'Project name is required' : undefined),
        }),

      stack: () =>
        select({
          message: 'Tech stack:',
          options: stackOptions,
        }),

      database: () =>
        select({
          message: 'Database:',
          options: Object.entries(databases).map(([v, l]) => ({ value: v, label: l })),
        }),

      tools: () =>
        multiselect({
          message: 'Additional tools: (space to select)',
          options: [
            { value: 'redis',       label: 'Redis',           hint: 'Cache / Queue' },
            { value: 'minio',       label: 'MinIO',           hint: 'S3-compatible storage' },
            { value: 'meilisearch', label: 'Meilisearch',     hint: 'Search engine' },
            { value: 'mailhog',     label: 'MailHog',         hint: 'Email testing' },
            { value: 'prometheus',  label: 'Prometheus',      hint: 'Metrics' },
          ],
          required: false,
        }),

      devops: () =>
        multiselect({
          message: 'DevOps / CI: (space to select)',
          options: [
            { value: 'github-actions', label: 'GitHub Actions' },
            { value: 'dockerfile',     label: 'Optimized Dockerfile', hint: 'Multi-stage build' },
            { value: 'devcontainer',   label: 'VS Code Dev Container' },
          ],
          required: false,
        }),

      proceed: () =>
        confirm({ message: 'Generate files?' }),
    },
    {
      onCancel: () => { cancel('Cancelled.'); process.exit(0) },
    }
  )

  if (!project.proceed) { cancel('Cancelled.'); return }

  const s = spinner()
  s.start('Generating configuration files...')

  const files = await generateTemplates({
    name: project.name as string,
    stack: project.stack as string,
    database: project.database as string,
    tools: (project.tools as string[]) ?? [],
    devops: (project.devops as string[]) ?? [],
  })

  s.stop(pc.green(`✓ Generated ${files.length} files`))

  console.log(pc.cyan('\n  Files created:'))
  files.forEach(f => console.log(pc.dim(`    ${f}`)))

  console.log(`\n  ${pc.bold('Next steps:')}`)
  console.log(pc.dim(`    cd ${project.name}`))
  console.log(pc.dim('    docker compose up -d'))
  console.log(pc.dim('    # Happy coding! 🚀'))
  console.log(`\n  ${pc.dim('Docs: https://envsetup.dev')}`)
}
