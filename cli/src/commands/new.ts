import { text, select, multiselect, confirm, isCancel, cancel, spinner, intro, outro, note } from '@clack/prompts'
import pc from 'picocolors'
import fs from 'fs-extra'
import path from 'path'
import { ideOptions, getAllStackTools, getRecommended, type ToolOption, type ToolCategory } from '../data/recommendations.js'
import { generateTemplates } from '../utils/templates.js'
import { getInstallCommand, installTool } from '../utils/installer.js'
import { generateDeveloperSetup } from '../utils/developer-setup.js'

// ── Project type definitions ────────────────────────────────────────────────
const PROJECT_TYPES = [
  { value: 'mobile',    label: '📱  Mobile App',           hint: 'iOS / Android / Cross-platform' },
  { value: 'web',       label: '🌐  Web Application',      hint: 'Full stack / Frontend / Backend' },
  { value: 'backend',   label: '⚡  Backend Service / API', hint: 'REST / GraphQL / gRPC' },
  { value: 'frontend',  label: '🎨  Frontend Application',  hint: 'React / Vue / Angular / Svelte' },
  { value: 'cli',       label: '🔧  CLI Tool',              hint: 'Command-line application' },
  { value: 'data',      label: '📊  Data Pipeline / ML',   hint: 'ETL / ML / Analytics' },
  { value: 'desktop',   label: '🖥️   Desktop Application',  hint: 'Electron / Tauri / Native' },
]

const MOBILE_PLATFORMS = [
  { value: 'react-native', label: 'React Native',          hint: 'TypeScript · iOS + Android · Most popular' },
  { value: 'flutter',      label: 'Flutter',               hint: 'Dart · iOS + Android + Web · Google' },
  { value: 'expo',         label: 'Expo (React Native)',    hint: 'TypeScript · Managed workflow · Easiest' },
  { value: 'ios-swift',    label: 'iOS (Swift/SwiftUI)',    hint: 'Swift · iOS/macOS only · Native' },
  { value: 'android-kt',   label: 'Android (Kotlin)',       hint: 'Kotlin · Android only · Native' },
  { value: 'ionic',        label: 'Ionic',                  hint: 'TypeScript · Web-based hybrid' },
  { value: 'maui',         label: '.NET MAUI',              hint: 'C# · iOS + Android + Desktop · Microsoft' },
]

const MOBILE_BACKEND_OPTIONS = [
  { value: 'none',       label: 'No backend',              hint: 'Use BaaS only (Firebase/Supabase)' },
  { value: 'firebase',   label: 'Firebase (BaaS)',         hint: 'Google · Auth, DB, Storage — no server needed' },
  { value: 'supabase',   label: 'Supabase (BaaS)',         hint: 'Open source Firebase · Postgres' },
  { value: 'custom',     label: 'Custom API backend',      hint: 'Build your own REST/GraphQL server' },
]

// Features per project type
const FEATURES: Record<string, Array<{value:string, label:string, hint?:string}>> = {
  mobile: [
    { value: 'auth',           label: 'Authentication',      hint: 'Login, OAuth, Biometric' },
    { value: 'push',           label: 'Push Notifications',  hint: 'FCM / APNs' },
    { value: 'offline',        label: 'Offline Support',     hint: 'Local storage, sync' },
    { value: 'payments',       label: 'Payments',            hint: 'Stripe, In-app purchases' },
    { value: 'maps',           label: 'Maps / Location',     hint: 'Google Maps, GPS' },
    { value: 'camera',         label: 'Camera / Media',      hint: 'Photos, videos' },
    { value: 'analytics',      label: 'Analytics',           hint: 'Firebase Analytics, Mixpanel' },
    { value: 'backend',        label: 'Backend API needed',  hint: 'REST API to build' },
  ],
  web: [
    { value: 'auth',           label: 'Authentication',      hint: 'Login, OAuth, SSO' },
    { value: 'payments',       label: 'Payments',            hint: 'Stripe integration' },
    { value: 'realtime',       label: 'Real-time',           hint: 'WebSockets, live updates' },
    { value: 'search',         label: 'Search',              hint: 'Full-text, Elasticsearch' },
    { value: 'file-upload',    label: 'File Upload',         hint: 'S3, Cloudinary' },
    { value: 'email',          label: 'Email',               hint: 'Transactional email' },
    { value: 'analytics',      label: 'Analytics',           hint: 'GA4, Mixpanel, Posthog' },
    { value: 'i18n',           label: 'Internationalization', hint: 'Multi-language support' },
    { value: 'pwa',            label: 'PWA',                 hint: 'Installable web app' },
  ],
  backend: [
    { value: 'auth',           label: 'Authentication / JWT', hint: 'Auth middleware' },
    { value: 'caching',        label: 'Caching',             hint: 'Redis cache layer' },
    { value: 'queue',          label: 'Job Queue',           hint: 'Background jobs, workers' },
    { value: 'websocket',      label: 'WebSockets',          hint: 'Real-time connections' },
    { value: 'email',          label: 'Email service',       hint: 'SMTP, Brevo, SendGrid' },
    { value: 'file-storage',   label: 'File Storage',        hint: 'S3 / MinIO' },
    { value: 'monitoring',     label: 'Monitoring',          hint: 'Prometheus, Grafana' },
    { value: 'rate-limiting',  label: 'Rate Limiting',       hint: 'API protection' },
    { value: 'swagger',        label: 'API Docs',            hint: 'Swagger / OpenAPI' },
  ],
  frontend: [
    { value: 'auth',           label: 'Auth flows',          hint: 'Login, protected routes' },
    { value: 'state',          label: 'State Management',    hint: 'Redux/Zustand/Pinia' },
    { value: 'i18n',           label: 'i18n',                hint: 'Multi-language' },
    { value: 'storybook',      label: 'Storybook',           hint: 'Component documentation' },
    { value: 'analytics',      label: 'Analytics',           hint: 'User tracking' },
    { value: 'seo',            label: 'SEO',                 hint: 'Meta tags, sitemap' },
    { value: 'pwa',            label: 'PWA',                 hint: 'Service worker, offline' },
  ],
}

// Timeline estimates per project type + complexity
function estimateTimeline(type: string, features: string[], teamSize: string): string {
  const base: Record<string, number> = { mobile: 12, web: 8, backend: 6, frontend: 4, cli: 3, data: 10, desktop: 14 }
  let weeks = base[type] ?? 8
  weeks += features.length * 1.5
  if (teamSize === 'solo') weeks *= 1.5
  if (teamSize === 'team') weeks *= 0.6

  const sprints = Math.ceil(weeks / 2)
  return `~${Math.round(weeks)} weeks (${sprints} sprints of 2 weeks)`
}

// ── Document generators ─────────────────────────────────────────────────────
function generateUserStories(name: string, type: string, features: string[]): string {
  const stories: string[] = [
    `# ${name} — User Stories\n`,
    `## Epic 1: Project Setup & Infrastructure`,
    `- **US-001**: As a developer, I want a local Docker environment so I can develop without installing dependencies globally`,
    `- **US-002**: As a developer, I want CI/CD pipelines so code is automatically tested and deployed`,
    `- **US-003**: As a developer, I want environment configuration documented so onboarding is fast`,
    ``,
  ]

  if (features.includes('auth')) {
    stories.push(
      `## Epic 2: Authentication`,
      `- **US-010**: As a user, I want to register with email/password`,
      `- **US-011**: As a user, I want to login and receive a session/token`,
      `- **US-012**: As a user, I want to reset my password via email`,
      `- **US-013**: As a user, I want to login with Google/GitHub OAuth`,
      `- **US-014**: As an admin, I want to manage user accounts and roles`,
      ``,
    )
  }
  if (features.includes('payments')) {
    stories.push(
      `## Epic 3: Payments`,
      `- **US-020**: As a user, I want to add a payment method securely`,
      `- **US-021**: As a user, I want to subscribe to a plan`,
      `- **US-022**: As a user, I want to view my billing history`,
      `- **US-023**: As a user, I want to cancel my subscription`,
      ``,
    )
  }
  if (features.includes('realtime') || features.includes('websocket')) {
    stories.push(
      `## Epic 4: Real-time Features`,
      `- **US-030**: As a user, I want to see live updates without refreshing`,
      `- **US-031**: As a user, I want to receive notifications in real-time`,
      ``,
    )
  }
  if (type === 'mobile') {
    stories.push(
      `## Epic 5: Mobile Specific`,
      `- **US-040**: As a user, I want the app to work offline with cached data`,
      `- **US-041**: As a user, I want to receive push notifications`,
      `- **US-042**: As a user, I want a smooth experience on both iOS and Android`,
      ``,
    )
  }

  stories.push(
    `## Epic: Non-Functional Requirements`,
    `- **US-090**: As a user, I want page loads under 3 seconds`,
    `- **US-091**: As a user, I want the app to be secure (HTTPS, input validation)`,
    `- **US-092**: As a user, I want the app to be accessible (WCAG 2.1 AA)`,
    ``,
    `---`,
    `*Generated by [envsetup.dev](https://envsetup.dev)*`,
  )

  return stories.join('\n')
}

function generateTasks(name: string, type: string, stack: string, features: string[], cicd: string): string {
  const tasks = [
    `# ${name} — Task Breakdown\n`,
    `## Sprint 0: Project Setup (Week 1-2)`,
    `### Infrastructure`,
    `- [ ] Initialize repository (${type === 'web' ? 'monorepo' : 'single repo'})`,
    `- [ ] Set up Docker + docker-compose`,
    `- [ ] Configure environment variables (.env.example)`,
    `- [ ] Set up ${cicd !== 'none' ? cicd : 'GitHub Actions'} CI pipeline`,
    `- [ ] Configure code formatter (Prettier) + linter`,
    `- [ ] Set up pre-commit hooks (Husky)`,
    `- [ ] Create branch protection rules`,
    `- [ ] Set up project management (GitHub Issues / Linear / Jira)`,
    ``,
    `### Database`,
    `- [ ] Design initial schema / data model`,
    `- [ ] Set up migrations`,
    `- [ ] Seed development data`,
    ``,
    `## Sprint 1: Core Foundation (Week 3-4)`,
    `- [ ] Project structure and folder organization`,
    `- [ ] Base API setup with error handling`,
    `- [ ] Logging setup (structured logs)`,
    `- [ ] Health check endpoint`,
    `- [ ] API documentation setup`,
    `- [ ] Unit test setup and first tests`,
    ``,
  ]

  if (features.includes('auth')) {
    tasks.push(
      `## Sprint 2: Authentication (Week 5-6)`,
      `- [ ] User model and migrations`,
      `- [ ] Registration endpoint / form`,
      `- [ ] Login endpoint / form`,
      `- [ ] JWT token generation and validation`,
      `- [ ] Password reset flow`,
      `- [ ] OAuth integration (Google)`,
      `- [ ] Auth middleware / guards`,
      `- [ ] Auth tests`,
      ``,
    )
  }

  tasks.push(
    `## Sprint 3+: Feature Development`,
    `*(Define specific tasks based on your user stories)*`,
    ``,
    `## Pre-Launch Checklist`,
    `- [ ] Security audit (OWASP Top 10)`,
    `- [ ] Performance testing`,
    `- [ ] Error monitoring setup (Sentry)`,
    `- [ ] Backup strategy`,
    `- [ ] Load testing`,
    `- [ ] Documentation review`,
    `- [ ] Staging environment testing`,
    `- [ ] Production deployment runbook`,
    ``,
    `---`,
    `*Generated by [envsetup.dev](https://envsetup.dev)*`,
  )

  return tasks.join('\n')
}

function generateRoadmap(name: string, timeline: string, features: string[]): string {
  return `# ${name} — Roadmap\n
## Timeline: ${timeline}\n
## Phase 1: MVP (Months 1-2)
- ✅ Project setup & infrastructure
- ✅ Core data models & API
${features.includes('auth') ? '- ✅ Authentication & authorization' : ''}
- ✅ Basic UI/UX
- ✅ Unit & integration tests
- ✅ Staging environment

## Phase 2: Beta (Month 3)
- ✅ Feature complete for beta users
${features.includes('payments') ? '- ✅ Payment integration' : ''}
${features.includes('analytics') ? '- ✅ Analytics & tracking' : ''}
- ✅ Performance optimization
- ✅ User feedback integration
- ✅ Bug fixes

## Phase 3: Launch (Month 4)
- ✅ Production hardening
- ✅ Security audit
- ✅ Load testing
- ✅ Monitoring & alerting
- ✅ Launch! 🚀

## Phase 4: Growth (Month 5+)
- 📋 User feedback features
- 📋 Performance improvements
- 📋 Scale infrastructure
- 📋 New feature development

---
*Generated by [envsetup.dev](https://envsetup.dev)*`
}

function generateArchDocs(name: string, type: string, stack: string, features: string[]): string {
  return `# ${name} — Architecture\n
## Overview
${type === 'web' ? 'Full-stack web application' : type === 'backend' ? 'Backend API service' : type === 'mobile' ? 'Mobile application with backend' : 'Application'} built with **${stack}**.

## System Design

\`\`\`
┌─────────────────────────────────────────┐
│                 Client                   │
│         (Browser / Mobile App)          │
└──────────────────┬──────────────────────┘
                   │ HTTPS
┌──────────────────▼──────────────────────┐
│              API Gateway                │
│          (Rate limiting, Auth)          │
└──────────────────┬──────────────────────┘
                   │
┌──────────────────▼──────────────────────┐
│            Application Layer            │
│              (${stack})                 │
└────────┬─────────────────────┬──────────┘
         │                     │
┌────────▼────────┐   ┌────────▼────────┐
│    Database      │   │     Cache       │
│  (PostgreSQL)    │   │    (Redis)      │
└─────────────────┘   └─────────────────┘
\`\`\`

## Key Decisions
| Decision | Choice | Reason |
|---|---|---|
| Framework | ${stack} | Performance, ecosystem, team familiarity |
| Database | PostgreSQL | ACID compliance, reliability |
| Caching | Redis | Fast in-memory cache |
| Auth | JWT | Stateless, scalable |

## Non-Functional Requirements
- **Performance**: < 200ms API response (p95)
- **Availability**: 99.9% uptime
- **Security**: OWASP Top 10 compliance
- **Scalability**: Horizontal scaling via Docker/K8s

---
*Generated by [envsetup.dev](https://envsetup.dev)*`
}

function generateVSCodeConfig(ide: string, language: string, testing: string[]): string {
  const extensions: string[] = ['EditorConfig.EditorConfig', 'streetsidesoftware.code-spell-checker']

  if (language === 'java' || language === 'kotlin') extensions.push('vscjava.vscode-java-pack', 'vmware.vscode-spring-boot')
  if (language === 'python') extensions.push('ms-python.python', 'ms-python.pylance', 'ms-python.black-formatter')
  if (language === 'typescript' || language === 'javascript') extensions.push('dbaeumer.vscode-eslint', 'esbenp.prettier-vscode', 'bradlc.vscode-tailwindcss')
  if (language === 'go') extensions.push('golang.go')
  if (language === 'rust') extensions.push('rust-lang.rust-analyzer')
  if (language === 'php') extensions.push('bmewburn.vscode-intelephense-client')
  if (language === 'ruby') extensions.push('Shopify.ruby-lsp')

  extensions.push('ms-azuretools.vscode-docker', 'humao.rest-client', 'eamodio.gitlens')

  if (testing.includes('jest')) extensions.push('Orta.vscode-jest')
  if (testing.includes('playwright')) extensions.push('ms-playwright.playwright')

  return JSON.stringify({ recommendations: extensions }, null, 2)
}

// ── Main command ────────────────────────────────────────────────────────────

// Generate mobile-specific setup files

// Check and offer to install missing prerequisites for selected stack
async function checkAndInstallPrereqs(stack: string, language: string, projectType: string): Promise<void> {
  // Map stack to required tools with their check commands
  const stackRequirements: Record<string, Array<{ label: string; key: string; cmd: string; required: boolean }>> = {
    // Mobile
    'ios-swift':    [{ label: 'Xcode', key: 'xcode', cmd: 'xcodebuild -version', required: true }, { label: 'Swift', key: 'swift', cmd: 'swift --version', required: true }],
    'android-kt':  [{ label: 'Java 17+', key: 'java', cmd: 'java -version 2>&1', required: true }, { label: 'Kotlin', key: 'kotlin', cmd: 'kotlin -version', required: true }],
    'react-native': [{ label: 'Node.js', key: 'nodejs', cmd: 'node --version', required: true }, { label: 'React Native CLI', key: 'react-native', cmd: 'npx react-native --version', required: false }],
    'expo':        [{ label: 'Node.js', key: 'nodejs', cmd: 'node --version', required: true }, { label: 'Expo CLI', key: 'expo', cmd: 'npx expo --version', required: false }],
    'flutter':     [{ label: 'Flutter SDK', key: 'flutter', cmd: 'flutter --version', required: true }],
    'ionic':       [{ label: 'Node.js', key: 'nodejs', cmd: 'node --version', required: true }, { label: 'Ionic CLI', key: 'ionic', cmd: 'ionic --version', required: false }],
    // Backend
    'fastapi':     [{ label: 'Python 3.10+', key: 'python3', cmd: 'python3 --version', required: true }, { label: 'pip', key: 'pip', cmd: 'pip3 --version', required: true }],
    'django':      [{ label: 'Python 3.10+', key: 'python3', cmd: 'python3 --version', required: true }, { label: 'pip', key: 'pip', cmd: 'pip3 --version', required: true }],
    'flask':       [{ label: 'Python 3.10+', key: 'python3', cmd: 'python3 --version', required: true }],
    'springboot':  [{ label: 'Java 17+', key: 'java', cmd: 'java -version 2>&1', required: true }, { label: 'Maven', key: 'mvn', cmd: 'mvn --version', required: false }],
    'quarkus':     [{ label: 'Java 17+', key: 'java', cmd: 'java -version 2>&1', required: true }],
    'ktor':        [{ label: 'Java 17+', key: 'java', cmd: 'java -version 2>&1', required: true }, { label: 'Kotlin', key: 'kotlin', cmd: 'kotlin -version', required: true }],
    'gin':         [{ label: 'Go 1.21+', key: 'go', cmd: 'go version', required: true }],
    'fiber':       [{ label: 'Go 1.21+', key: 'go', cmd: 'go version', required: true }],
    'echo':        [{ label: 'Go 1.21+', key: 'go', cmd: 'go version', required: true }],
    'actix':       [{ label: 'Rust', key: 'rust', cmd: 'rustc --version', required: true }, { label: 'Cargo', key: 'cargo', cmd: 'cargo --version', required: true }],
    'axum':        [{ label: 'Rust', key: 'rust', cmd: 'rustc --version', required: true }],
    'rocket':      [{ label: 'Rust', key: 'rust', cmd: 'rustc --version', required: true }],
    'laravel':     [{ label: 'PHP 8.2+', key: 'php', cmd: 'php --version', required: true }, { label: 'Composer', key: 'composer', cmd: 'composer --version', required: true }],
    'symfony':     [{ label: 'PHP 8.2+', key: 'php', cmd: 'php --version', required: true }, { label: 'Composer', key: 'composer', cmd: 'composer --version', required: true }],
    'rails':       [{ label: 'Ruby 3.1+', key: 'ruby', cmd: 'ruby --version', required: true }, { label: 'Bundler', key: 'bundler', cmd: 'bundle --version', required: true }],
    'sinatra':     [{ label: 'Ruby 3.1+', key: 'ruby', cmd: 'ruby --version', required: true }],
    'phoenix':     [{ label: 'Elixir', key: 'elixir', cmd: 'elixir --version', required: true }, { label: 'Mix', key: 'mix', cmd: 'mix --version', required: true }],
    'aspnet':      [{ label: '.NET 8+', key: 'dotnet', cmd: 'dotnet --version', required: true }],
    'vapor':       [{ label: 'Swift', key: 'swift', cmd: 'swift --version', required: true }, { label: 'Vapor CLI', key: 'vapor', cmd: 'vapor --version', required: false }],
    'nestjs':      [{ label: 'Node.js 18+', key: 'nodejs', cmd: 'node --version', required: true }],
    'express':     [{ label: 'Node.js 18+', key: 'nodejs', cmd: 'node --version', required: true }],
    'nextjs':      [{ label: 'Node.js 18+', key: 'nodejs', cmd: 'node --version', required: true }],
  }

  const { execSync } = await import('child_process')
  const reqs = stackRequirements[stack] ?? []
  if (!reqs.length) return

  // Check which are missing
  const missing: typeof reqs = []
  for (const req of reqs) {
    try { execSync(req.cmd, { stdio: 'pipe', timeout: 3000 }) }
    catch { missing.push(req) }
  }

  if (!missing.length) return

  console.log()
  console.log(pc.yellow(`  ⚠️  Missing prerequisites for ${pc.bold(stack)}:`))
  missing.forEach(m => console.log(`     ${pc.red('✘')} ${m.label}${m.required ? '' : pc.dim(' (optional)')} `))
  console.log()

  // Offer to install each missing tool
  for (const tool of missing) {
    const installCmd = getInstallCommand(tool.key)
    if (!installCmd) {
      console.log(pc.dim(`  ${tool.label}: install manually`))
      continue
    }

    const doInstall = await confirm({
      message: `Install ${tool.label}? ${pc.dim('(' + installCmd.substring(0, 60) + ')')}`,
    })
    if (isCancel(doInstall)) break
    if (doInstall) {
      console.log()
      installTool(tool.key, tool.label)
      console.log()
    }
  }
}

async function generateMobileSetup(cfg: { name: string; stack: string; mobileBackend: string }): Promise<string[]> {
  const dir = path.join(process.cwd(), cfg.name)
  await fs.ensureDir(dir)
  const created: string[] = []

  const write = async (name: string, content: string) => {
    await fs.writeFile(path.join(dir, name), content)
    created.push(`${cfg.name}/${name}`)
  }

  // .gitignore
  const gitignoreMap: Record<string, string> = {
    'ios-swift':    'build/\n*.xcuserdata\n.DS_Store\nDerivedData/\n*.ipa\n',
    'android-kt':  '*.apk\n*.aab\nbuild/\n.gradle/\nlocal.properties\n',
    'react-native': 'node_modules/\n.expo/\n*.apk\n*.ipa\n.DS_Store\n',
    'expo':         'node_modules/\n.expo/\ndist/\n.DS_Store\n',
    'flutter':      '.dart_tool/\nbuild/\n*.apk\n*.ipa\n.DS_Store\n',
    'ionic':        'node_modules/\nwww/\n*.apk\n*.ipa\n',
  }
  await write('.gitignore', gitignoreMap[cfg.stack] ?? 'node_modules/\n.DS_Store\n')

  // README with mobile-specific setup
  const setupMap: Record<string, string> = {
    'ios-swift':    '## Setup\n\n1. Install Xcode from App Store\n2. `xcode-select --install`\n3. `pod install` (if using CocoaPods)\n4. Open `.xcworkspace` in Xcode\n5. Select simulator and run',
    'android-kt':  '## Setup\n\n1. Install Android Studio\n2. Install JDK 17+\n3. Open project in Android Studio\n4. Sync Gradle\n5. Run on emulator or device',
    'react-native': '## Setup\n\n1. Install Node.js 18+\n2. `npm install`\n3. Install Expo Go on device or use simulator\n4. `npx expo start`',
    'expo':         '## Setup\n\n1. Install Node.js 18+\n2. `npm install -g expo-cli`\n3. `npm install`\n4. `npx expo start`',
    'flutter':      '## Setup\n\n1. Install Flutter SDK: https://flutter.dev/docs/get-started/install\n2. `flutter doctor` (fix any issues)\n3. `flutter pub get`\n4. `flutter run`',
    'ionic':        '## Setup\n\n1. Install Node.js 18+\n2. `npm install -g @ionic/cli`\n3. `npm install`\n4. `ionic serve`',
  }

  const backendInfo = cfg.mobileBackend === 'firebase'
    ? '\n## Backend: Firebase\n- Create project: https://console.firebase.google.com\n- Add `google-services.json` (Android) / `GoogleService-Info.plist` (iOS)\n'
    : cfg.mobileBackend === 'supabase'
    ? '\n## Backend: Supabase\n- Create project: https://supabase.com\n- Add `SUPABASE_URL` and `SUPABASE_ANON_KEY` to `.env`\n'
    : cfg.mobileBackend === 'custom'
    ? '\n## Backend: Custom API\n- Set `API_URL` in `.env`\n'
    : ''

  await write('README.md', `# ${cfg.name}\n\n> Generated by [envsetup.dev](https://envsetup.dev)\n\n## Platform\n${cfg.stack}\n\n${setupMap[cfg.stack] ?? ''}${backendInfo}\n---\nGenerated with: \`npx @envsetup/cli new\`\n`)

  // .env.example for backend
  if (cfg.mobileBackend !== 'none') {
    const envMap: Record<string, string> = {
      firebase: 'FIREBASE_API_KEY=\nFIREBASE_PROJECT_ID=\nFIREBASE_APP_ID=\n',
      supabase: 'SUPABASE_URL=https://your-project.supabase.co\nSUPABASE_ANON_KEY=\n',
      custom: 'API_URL=https://api.yourdomain.com\nAPI_KEY=\n',
    }
    await write('.env.example', envMap[cfg.mobileBackend] ?? '')
  }

  return created
}

export async function newCommand() {
  console.log()
  console.log(pc.cyan('  Complete project setup from scratch'))
  console.log(pc.dim('  Generates: Docker, docs, user stories, tasks, timeline, IDE config\n'))

  // 1. Project name
  const name = await text({ message: 'Project name?', placeholder: 'my-awesome-app',
    validate: (v: string) => (!v.trim() ? 'Required' : undefined) })
  if (isCancel(name)) { cancel('Cancelled'); process.exit(0) }

  // 2. Project type
  const projectType = await select({ message: 'What are you building?', options: PROJECT_TYPES })
  if (isCancel(projectType)) { cancel('Cancelled'); process.exit(0) }

  // 3. Features
  const featureList = FEATURES[projectType as string] ?? FEATURES.web
  const features = await multiselect({
    message: 'Which features do you need? (space to select)',
    options: featureList,
    required: false,
  }) as string[]
  if (isCancel(features)) { cancel('Cancelled'); process.exit(0) }

  // 4. Team size (for timeline)
  const teamSize = await select({
    message: 'Team size?',
    options: [
      { value: 'solo',  label: 'Solo developer',   hint: 'Just me' },
      { value: 'small', label: 'Small team',        hint: '2-5 people' },
      { value: 'team',  label: 'Full team',         hint: '6+ people' },
    ],
  }) as string
  if (isCancel(teamSize)) { cancel('Cancelled'); process.exit(0) }

  // Mobile platform selection
  let mobilePlatform = ''
  let mobileBackend = 'none'
  if (projectType === 'mobile') {
    const platform = await select({ message: 'Mobile platform?', options: MOBILE_PLATFORMS })
    if (isCancel(platform)) { cancel('Cancelled'); process.exit(0) }
    mobilePlatform = platform as string

    const backendChoice = await select({
      message: 'Backend / API?',
      options: MOBILE_BACKEND_OPTIONS,
    })
    if (isCancel(backendChoice)) { cancel('Cancelled'); process.exit(0) }
    mobileBackend = backendChoice as string
  }

  // 5. Backend stack (skip for frontend-only and mobile with BaaS)
  let stack = 'express', language = 'typescript', database = 'postgres'
  const needsCustomBackend = projectType !== 'frontend' &&
    !(projectType === 'mobile' && mobileBackend !== 'custom')
  if (needsCustomBackend) {
    const langOpts = [
      { value: 'typescript', label: 'TypeScript / Node.js', hint: 'Express, NestJS, Next.js' },
      { value: 'python',     label: 'Python',               hint: 'FastAPI, Django, Flask' },
      { value: 'java',       label: 'Java',                 hint: 'Spring Boot, Quarkus' },
      { value: 'go',         label: 'Go',                   hint: 'Gin, Fiber, Echo' },
      { value: 'rust',       label: 'Rust',                 hint: 'Actix, Axum' },
      { value: 'php',        label: 'PHP',                  hint: 'Laravel, Symfony' },
      { value: 'ruby',       label: 'Ruby',                 hint: 'Rails, Sinatra' },
    ]
    const lang = await select({ message: 'Backend language?', options: langOpts }) as string
    if (isCancel(lang)) { cancel('Cancelled'); process.exit(0) }
    language = lang

    const fwOpts: Record<string, Array<{value:string,label:string,hint?:string}>> = {
      typescript: [{value:'nestjs',label:'NestJS',hint:'Enterprise'},{value:'express',label:'Express',hint:'Minimal'},{value:'nextjs',label:'Next.js',hint:'Full-stack'}],
      python: [{value:'fastapi',label:'FastAPI',hint:'Modern async'},{value:'django',label:'Django',hint:'Full-featured'},{value:'flask',label:'Flask',hint:'Minimal'}],
      java: [{value:'springboot',label:'Spring Boot',hint:'Enterprise'},{value:'quarkus',label:'Quarkus',hint:'Cloud-native'}],
      go: [{value:'gin',label:'Gin',hint:'Fast'},{value:'fiber',label:'Fiber',hint:'Express-like'}],
      rust: [{value:'actix',label:'Actix Web',hint:'Blazing fast'},{value:'axum',label:'Axum',hint:'Tokio-based'}],
      php: [{value:'laravel',label:'Laravel',hint:'Full-featured'},{value:'symfony',label:'Symfony',hint:'Enterprise'}],
      ruby: [{value:'rails',label:'Ruby on Rails',hint:'Convention'}],
    }
    const fw = await select({ message: 'Framework?', options: fwOpts[lang] ?? fwOpts.typescript }) as string
    if (isCancel(fw)) { cancel('Cancelled'); process.exit(0) }
    stack = fw

    const db = await select({
      message: 'Database?',
      options: [
        { value: 'postgres', label: 'PostgreSQL', hint: 'Recommended — reliable, feature-rich' },
        { value: 'mysql',    label: 'MySQL',      hint: 'Popular, wide support' },
        { value: 'mongodb',  label: 'MongoDB',    hint: 'NoSQL, flexible schema' },
        { value: 'sqlite',   label: 'SQLite',     hint: 'Embedded — best for mobile device storage, not backend' },
        { value: 'redis',    label: 'Redis',      hint: 'Cache + Queue' },
        { value: 'none',     label: 'No database', hint: 'Stateless service' },
      ],
    }) as string
    if (isCancel(db)) { cancel('Cancelled'); process.exit(0) }
    // Warn if SQLite chosen for backend
    if (db === 'sqlite' && projectType !== 'mobile') {
      console.log(pc.yellow('\n  ⚠️  SQLite is embedded — for production backends, PostgreSQL is recommended.'))
      const keepSqlite = await confirm({ message: 'Continue with SQLite anyway?', initialValue: false })
      if (isCancel(keepSqlite)) { cancel('Cancelled'); process.exit(0) }
      if (!keepSqlite) {
        console.log(pc.dim('  → Switching to PostgreSQL'))
        database = 'postgres'
      } else {
        database = db
      }
    } else {
      database = db
    }
  }

  // For mobile BaaS, set appropriate stack
  if (projectType === 'mobile' && mobileBackend === 'firebase') {
    stack = 'firebase'; language = 'typescript'; database = 'firebase'
  } else if (projectType === 'mobile' && mobileBackend === 'supabase') {
    stack = 'supabase'; language = 'typescript'; database = 'postgres'
  } else if (projectType === 'mobile' && mobileBackend === 'none') {
    stack = mobilePlatform; language = mobilePlatform.includes('flutter') ? 'dart' :
      mobilePlatform.includes('swift') ? 'swift' :
      mobilePlatform.includes('android') ? 'kotlin' : 'typescript'
    database = 'none'
  }

  // Check prerequisites for selected stack and offer to install
  await checkAndInstallPrereqs(
    projectType === 'mobile' ? mobilePlatform : stack,
    language,
    projectType as string
  )

  // ── All tools in ONE comprehensive selection ──────────────────────────
  const allToolCategories = getAllStackTools(
    language, stack, projectType as string, mobilePlatform, mobileBackend
  )

  console.log()
  console.log(pc.bold('  Select tools for your project'))
  console.log(pc.dim('  (star = recommended, space to toggle)'))

  const selectedTools: string[] = []

  for (const cat of allToolCategories) {
    // Skip separator-only or empty categories
    const realTools = cat.tools.filter(t => !t.value.startsWith('__sep'))
    if (!realTools.length) continue

    const selected = await multiselect({
      message: `${cat.icon}  ${cat.category}`,
      options: realTools.map((o: ToolOption) => ({
        value: o.value,
        label: `${o.label}${o.recommended ? pc.green(' ★') : ''}`,
        hint: o.hint,
      })),
      initialValues: getRecommended(realTools),
      required: false,
    }) as string[]

    if (isCancel(selected)) { cancel('Cancelled'); process.exit(0) }
    selectedTools.push(...(selected ?? []))
  }

  // Extract specific tool categories from selectedTools
  const cicdTools = ['github-actions','gitlab-ci','jenkins','circleci','aws-codepipeline','bitbucket-pipelines','argo-cd']
  const devopsTools = ['docker','kubernetes','terraform','ansible','helm']
  const lintingTools = ['eslint','prettier','husky','swiftlint','swiftformat','flutter-analyze','very-good-analysis','detekt','ktlint','rubocop','ruff','mypy','black','checkstyle','spotbugs','pmd','archunit','phpcs','phpstan','pint','phpstan','golangci-lint','gofmt','clippy','rustfmt','credo','dialyxir','roslyn-analyzers','stylecop']
  const qualityTools = ['sonarqube','codecov','snyk','deepsource']
  const monitoringTools = ['sentry','grafana','datadog','opentelemetry','elastic-apm','firebase-crashlytics','firebase-analytics']
  const securityTools = ['owasp-zap','trivy','dependabot','vault','gitleaks']
  const docTools = ['swagger','storybook','docusaurus','readme-ai','notion']
  const nonTestingTools = [...cicdTools, ...devopsTools, ...lintingTools, ...qualityTools, ...monitoringTools, ...securityTools, ...docTools]

  const testingTools = selectedTools.filter((t: string) => !nonTestingTools.includes(t))
  const cicd = selectedTools.filter((t: string) => cicdTools.includes(t))
  const useDocker = selectedTools.includes('docker')

  // IDE selection (keep simple)
  const ideList = ideOptions[language] ?? ideOptions[mobilePlatform] ?? ideOptions.typescript
  const ide = await select({
    message: '🖥️  Primary IDE?',
    options: ideList.map((o: ToolOption) => ({
      value: o.value,
      label: `${o.label}${o.recommended ? pc.green(' ★') : ''}`,
      hint: o.hint,
    })),
  }) as string
  if (isCancel(ide)) { cancel('Cancelled'); process.exit(0) }

    // 9. Docs to generate
  const docs = await multiselect({
    message: 'Generate which documents?',
    options: [
      { value: 'user-stories',  label: 'User Stories',           hint: 'PLANNING/USER_STORIES.md' },
      { value: 'tasks',         label: 'Task Breakdown',         hint: 'PLANNING/TASKS.md' },
      { value: 'roadmap',       label: 'Roadmap / Timeline',     hint: 'PLANNING/ROADMAP.md' },
      { value: 'architecture',  label: 'Architecture Docs',      hint: 'docs/ARCHITECTURE.md' },
      { value: 'api-docs',      label: 'API Documentation',      hint: 'docs/API.md template' },
      { value: 'contributing',  label: 'CONTRIBUTING.md',        hint: 'Contribution guide' },
      { value: 'github-templates', label: 'GitHub Templates',   hint: 'PR + Issue templates' },
    ],
    initialValues: ['user-stories', 'tasks', 'roadmap', 'architecture'],
    required: false,
  }) as string[]
  if (isCancel(docs)) { cancel('Cancelled'); process.exit(0) }

  // ── Summary ──────────────────────────────────────────────────────────────
  const timeline = estimateTimeline(projectType as string, features as string[], teamSize)
  note(
    [
      `  Project      : ${pc.bold(name as string)}`,
      `  Type         : ${pc.cyan(projectType as string)}`,
      `  Stack        : ${pc.cyan(projectType === 'mobile' ? mobilePlatform + (mobileBackend !== 'none' ? ' + ' + mobileBackend + ' backend' : '') : language + ' / ' + stack)}`,
      `  Database     : ${pc.cyan(projectType === 'mobile' && mobileBackend !== 'custom' ? mobileBackend === 'none' ? 'none' : mobileBackend : database)}`,
      `  Features     : ${pc.dim((features as string[]).join(', ') || 'none')}`,
      `  IDE          : ${pc.dim(ide)}`,
      `  CI/CD        : ${pc.dim(cicd.join(', ') || 'none')}`,
      `  Testing      : ${pc.dim(testingTools.join(', ') || 'none')}`,
      `  Linting      : ${pc.dim(selectedTools.filter((t: string) => lintingTools.includes(t)).join(', ') || 'none')}`,
      `  Monitoring   : ${pc.dim(selectedTools.filter((t: string) => monitoringTools.includes(t)).join(', ') || 'none')}`,
      `  Timeline     : ${pc.yellow(timeline)}`,
      `  Docs         : ${pc.dim((docs as string[]).join(', '))}`,
    ].join('\n'),
    pc.bold('Project Summary')
  )

  const proceed = await confirm({ message: 'Generate everything?' })
  if (isCancel(proceed) || !proceed) { cancel('Cancelled'); process.exit(0) }

  // ── Generate all files ───────────────────────────────────────────────────
  const s = spinner()
  s.start('Generating your complete project setup...')

  const projectDir = path.join(process.cwd(), name as string)
  await fs.ensureDir(projectDir)

  // 1. Docker files
  const devops = [...cicd]  // already array from selectedTools
  // For mobile, generate mobile-specific files instead of Docker
  const infraFiles = projectType === 'mobile'
    ? await generateMobileSetup({ name: name as string, stack: mobilePlatform, mobileBackend })
    : await generateTemplates({
        name: name as string, stack, language, database,
        tools: testingTools.filter((t: string) => !['github-actions','devcontainer'].includes(t)),
        devops: useDocker ? devops : devops.filter(d => d !== 'docker'),
      })

  // 2. User stories
  if ((docs as string[]).includes('user-stories')) {
    await fs.ensureDir(path.join(projectDir, 'planning'))
    await fs.writeFile(
      path.join(projectDir, 'planning', 'USER_STORIES.md'),
      generateUserStories(name as string, projectType as string, features as string[])
    )
  }

  // 3. Tasks
  if ((docs as string[]).includes('tasks')) {
    await fs.ensureDir(path.join(projectDir, 'planning'))
    await fs.writeFile(
      path.join(projectDir, 'planning', 'TASKS.md'),
      generateTasks(name as string, projectType as string, stack, features as string[], cicd[0] ?? 'none')
    )
  }

  // 4. Roadmap
  if ((docs as string[]).includes('roadmap')) {
    await fs.ensureDir(path.join(projectDir, 'planning'))
    await fs.writeFile(
      path.join(projectDir, 'planning', 'ROADMAP.md'),
      generateRoadmap(name as string, timeline, features as string[])
    )
  }

  // 5. Architecture
  if ((docs as string[]).includes('architecture')) {
    await fs.ensureDir(path.join(projectDir, 'docs'))
    await fs.writeFile(
      path.join(projectDir, 'docs', 'ARCHITECTURE.md'),
      generateArchDocs(name as string, projectType as string, stack, features as string[])
    )
  }

  // 6. API docs template
  if ((docs as string[]).includes('api-docs')) {
    await fs.ensureDir(path.join(projectDir, 'docs'))
    await fs.writeFile(path.join(projectDir, 'docs', 'API.md'), `# ${name} API Documentation\n\n## Base URL\n\`\`\`\nhttps://api.yourdomain.com/v1\n\`\`\`\n\n## Authentication\nAll requests require \`Authorization: Bearer <token>\` header.\n\n## Endpoints\n\n### GET /health\nHealth check endpoint.\n\n**Response**\n\`\`\`json\n{ "status": "ok", "timestamp": "2025-01-01T00:00:00Z" }\n\`\`\`\n\n*Add your endpoints here*\n`)
  }

  // 7. Contributing guide
  if ((docs as string[]).includes('contributing')) {
    await fs.writeFile(path.join(projectDir, 'CONTRIBUTING.md'), `# Contributing to ${name}\n\n## Setup\n1. Fork the repo\n2. Clone: \`git clone ...\`\n3. Copy env: \`cp .env.example .env\`\n4. Start: \`docker compose up -d\`\n\n## Branch Strategy\n- \`main\` — production\n- \`develop\` — integration\n- \`feature/*\` — features\n- \`fix/*\` — bug fixes\n\n## Commit Format\n\`\`\`\nfeat: add user authentication\nfix: correct pagination bug\ndocs: update API reference\n\`\`\`\n\n## Pull Request Process\n1. Create feature branch from \`develop\`\n2. Write tests for new code\n3. Ensure CI passes\n4. Request review from 1+ team member\n`)
  }

  // 8. GitHub templates
  if ((docs as string[]).includes('github-templates')) {
    await fs.ensureDir(path.join(projectDir, '.github', 'ISSUE_TEMPLATE'))
    await fs.writeFile(path.join(projectDir, '.github', 'ISSUE_TEMPLATE', 'bug_report.md'),
      `---\nname: Bug Report\nabout: Something not working\n---\n\n**Describe the bug**\n\n**Steps to reproduce**\n1. \n2. \n\n**Expected behavior**\n\n**Environment**\n- OS: \n- Version: \n`)
    await fs.writeFile(path.join(projectDir, '.github', 'ISSUE_TEMPLATE', 'feature_request.md'),
      `---\nname: Feature Request\nabout: Suggest an idea\n---\n\n**Problem this solves**\n\n**Proposed solution**\n\n**Alternatives considered**\n`)
    await fs.writeFile(path.join(projectDir, '.github', 'pull_request_template.md'),
      `## Summary\n\n## Changes\n- \n\n## Testing\n- [ ] Unit tests pass\n- [ ] Manual testing done\n\n## Screenshots (if UI)\n`)
  }

  // 9. VS Code config
  if (ide === 'vscode') {
    await fs.ensureDir(path.join(projectDir, '.vscode'))
    await fs.writeFile(
      path.join(projectDir, '.vscode', 'extensions.json'),
      generateVSCodeConfig(ide, language, testingTools)
    )
    await fs.writeFile(path.join(projectDir, '.vscode', 'settings.json'), JSON.stringify({
      "editor.formatOnSave": true,
      "editor.defaultFormatter": "esbenp.prettier-vscode",
      "files.trimTrailingWhitespace": true,
    }, null, 2))
  }

  // 10. .editorconfig
  await fs.writeFile(path.join(projectDir, '.editorconfig'), `root = true\n\n[*]\nindent_style = space\nindent_size = 2\nend_of_line = lf\ncharset = utf-8\ntrim_trailing_whitespace = true\ninsert_final_newline = true\n\n[*.md]\ntrim_trailing_whitespace = false\n`)

  // Generate DEVELOPER_SETUP.md
  await fs.writeFile(path.join(projectDir, 'docs', 'DEVELOPER_SETUP.md'),
    generateDeveloperSetup({ name: name as string, stack, language, ide, testing: testingTools })
  )

  s.stop(pc.green('✓ Project generated!'))

  // Summary of all files
  console.log(pc.cyan('\n  Infrastructure:'))
  infraFiles.forEach((f: string) => console.log(pc.dim(`    ${f}`)))

  const extraFiles = [
    (docs as string[]).includes('user-stories') && `    ${name}/planning/USER_STORIES.md`,
    (docs as string[]).includes('tasks')        && `    ${name}/planning/TASKS.md`,
    (docs as string[]).includes('roadmap')      && `    ${name}/planning/ROADMAP.md`,
    (docs as string[]).includes('architecture') && `    ${name}/docs/ARCHITECTURE.md`,
    (docs as string[]).includes('api-docs')     && `    ${name}/docs/API.md`,
    (docs as string[]).includes('contributing') && `    ${name}/CONTRIBUTING.md`,
    ide === 'vscode'                            && `    ${name}/.vscode/extensions.json`,
  ].filter(Boolean)

  if (extraFiles.length) {
    console.log(pc.cyan('\n  Documentation & Planning:'))
    extraFiles.forEach(f => console.log(pc.dim(f as string)))
  }

  console.log()
  note(
    [
      `${pc.bold('Estimated Timeline:')} ${timeline}`,
      `${pc.bold('Next steps:')}`,
      `  cd ${name}`,
      `  cp .env.example .env`,
      `  docker compose up -d`,
      `  cat planning/TASKS.md   # Start with Sprint 0`,
    ].join('\n'),
    '🚀 You\'re ready!'
  )

  outro(pc.green(`Happy building ${name as string}!`))
}
