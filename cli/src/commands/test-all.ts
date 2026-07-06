import { execSync } from 'child_process'
import pc from 'picocolors'

// All supported stacks with their check command
const ALL_STACKS: Record<string, { label: string; category: string; check: string; install?: string }[]> = {

  // ── Mobile ────────────────────────────────────────────────────────────
  'Mobile': [
    { label: 'iOS (Swift)',       category: 'Mobile', check: 'swift --version',           install: 'xcode-select --install' },
    { label: 'Android (Kotlin)',  category: 'Mobile', check: 'kotlin -version',            install: 'https://kotlinlang.org/' },
    { label: 'React Native',      category: 'Mobile', check: 'npx react-native --version', install: 'npm install -g react-native-cli' },
    { label: 'Expo',              category: 'Mobile', check: 'npx expo --version',          install: 'npm install -g expo-cli' },
    { label: 'Flutter',           category: 'Mobile', check: 'flutter --version',           install: 'https://flutter.dev' },
    { label: 'Ionic',             category: 'Mobile', check: 'ionic --version',             install: 'npm install -g @ionic/cli' },
  ],

  // ── Frontend ──────────────────────────────────────────────────────────
  'Frontend (TypeScript/JS)': [
    { label: 'Node.js',    category: 'Frontend', check: 'node --version',  install: 'https://nodejs.org/' },
    { label: 'npm',        category: 'Frontend', check: 'npm --version',   install: 'Included with Node.js' },
    { label: 'pnpm',       category: 'Frontend', check: 'pnpm --version',  install: 'npm install -g pnpm' },
    { label: 'bun',        category: 'Frontend', check: 'bun --version',   install: 'https://bun.sh/' },
    { label: 'Deno',       category: 'Frontend', check: 'deno --version',  install: 'https://deno.com/' },
  ],

  // ── Backend — Node.js / TS ────────────────────────────────────────────
  'Backend (TypeScript/JS)': [
    { label: 'Node.js 20+', category: 'Backend', check: 'node --version',  install: 'https://nodejs.org/' },
    { label: 'npm',          category: 'Backend', check: 'npm --version',   install: 'Included with Node.js' },
  ],

  // ── Python ────────────────────────────────────────────────────────────
  'Backend (Python)': [
    { label: 'Python 3.10+', category: 'Python', check: 'python3 --version',  install: 'https://python.org/' },
    { label: 'pip',          category: 'Python', check: 'pip3 --version',     install: 'Included with Python' },
    { label: 'Poetry',       category: 'Python', check: 'poetry --version',   install: 'pip install poetry' },
    { label: 'pyenv',        category: 'Python', check: 'pyenv --version',    install: 'https://github.com/pyenv/pyenv' },
    { label: 'uv',           category: 'Python', check: 'uv --version',       install: 'pip install uv' },
  ],

  // ── Java / Kotlin ─────────────────────────────────────────────────────
  'Backend (Java/Kotlin)': [
    { label: 'Java 17+',  category: 'Java', check: 'java -version 2>&1',  install: 'https://adoptium.net/' },
    { label: 'Maven',     category: 'Java', check: 'mvn --version',       install: 'https://maven.apache.org/' },
    { label: 'Gradle',    category: 'Java', check: 'gradle --version',    install: 'https://gradle.org/' },
    { label: 'SDKMAN',    category: 'Java', check: 'sdk version',         install: 'https://sdkman.io/' },
    { label: 'Kotlin',    category: 'Java', check: 'kotlin -version',     install: 'https://kotlinlang.org/' },
  ],

  // ── Go ────────────────────────────────────────────────────────────────
  'Backend (Go)': [
    { label: 'Go 1.21+',  category: 'Go', check: 'go version',           install: 'https://go.dev/' },
    { label: 'golangci',  category: 'Go', check: 'golangci-lint --version', install: 'https://golangci-lint.run/' },
  ],

  // ── Rust ──────────────────────────────────────────────────────────────
  'Backend (Rust)': [
    { label: 'Rust 1.75+', category: 'Rust', check: 'rustc --version',   install: 'curl --proto=https https://sh.rustup.rs | sh' },
    { label: 'Cargo',      category: 'Rust', check: 'cargo --version',   install: 'Included with Rust' },
    { label: 'rustfmt',    category: 'Rust', check: 'rustfmt --version', install: 'rustup component add rustfmt' },
  ],

  // ── PHP ───────────────────────────────────────────────────────────────
  'Backend (PHP)': [
    { label: 'PHP 8.2+',  category: 'PHP', check: 'php --version',      install: 'https://php.net/' },
    { label: 'Composer',  category: 'PHP', check: 'composer --version', install: 'https://getcomposer.org/' },
    { label: 'Laravel CLI', category: 'PHP', check: 'laravel --version', install: 'composer global require laravel/installer' },
  ],

  // ── Ruby ──────────────────────────────────────────────────────────────
  'Backend (Ruby)': [
    { label: 'Ruby 3.1+', category: 'Ruby', check: 'ruby --version | grep -E "ruby [3-9]"',   install: 'rbenv install 3.3.0 or https://www.ruby-lang.org/' },
    { label: 'Bundler',   category: 'Ruby', check: 'bundle --version', install: 'gem install bundler' },
    { label: 'rbenv',     category: 'Ruby', check: 'rbenv --version',  install: 'https://github.com/rbenv/rbenv' },
    { label: 'Rails',     category: 'Ruby', check: 'rails --version 2>&1 | grep -v "not currently"',  install: 'gem install rails' },
  ],

  // ── C# / .NET ─────────────────────────────────────────────────────────
  'Backend (C#/.NET)': [
    { label: '.NET 8+',   category: 'CSharp', check: 'dotnet --version', install: 'https://dotnet.microsoft.com/' },
    { label: 'dotnet-ef', category: 'CSharp', check: 'dotnet ef',        install: 'dotnet tool install --global dotnet-ef' },
  ],

  // ── Elixir ────────────────────────────────────────────────────────────
  'Backend (Elixir)': [
    { label: 'Elixir 1.14+', category: 'Elixir', check: 'elixir --version', install: 'https://elixir-lang.org/' },
    { label: 'Mix',           category: 'Elixir', check: 'mix --version',    install: 'Included with Elixir' },
    { label: 'Hex',           category: 'Elixir', check: 'mix hex.info',     install: 'mix local.hex' },
  ],

  // ── Swift (Vapor) ─────────────────────────────────────────────────────
  'Backend (Swift)': [
    { label: 'Swift 5.9+', category: 'Swift', check: 'swift --version', install: 'xcode-select --install' },
    { label: 'Vapor CLI',  category: 'Swift', check: 'vapor --version', install: 'brew install vapor' },
  ],

  // ── Dart ──────────────────────────────────────────────────────────────
  'Backend (Dart)': [
    { label: 'Dart 3+',   category: 'Dart', check: 'dart --version',    install: 'https://dart.dev/' },
    { label: 'pub',       category: 'Dart', check: 'dart pub --version', install: 'Included with Dart' },
  ],

  // ── Scala ─────────────────────────────────────────────────────────────
  'Backend (Scala)': [
    { label: 'Scala 3+',  category: 'Scala', check: 'scala --version',  install: 'https://scala-lang.org/' },
    { label: 'sbt',       category: 'Scala', check: 'sbt --version',    install: 'https://www.scala-sbt.org/' },
  ],

  // ── DevOps / Tools ────────────────────────────────────────────────────
  'DevOps / Tools': [
    { label: 'Git',             category: 'DevOps', check: 'git --version',            install: 'https://git-scm.com/' },
    { label: 'Docker',          category: 'DevOps', check: 'docker --version',         install: 'https://docker.com/' },
    { label: 'Docker Compose',  category: 'DevOps', check: 'docker compose version',   install: 'Included with Docker Desktop' },
    { label: 'kubectl',         category: 'DevOps', check: 'kubectl version --client', install: 'https://kubernetes.io/docs/tasks/tools/' },
    { label: 'Podman',          category: 'DevOps', check: 'podman --version',         install: 'https://podman.io/' },
    { label: 'GitHub CLI',      category: 'DevOps', check: 'gh --version',             install: 'https://cli.github.com/' },
    { label: 'jq',              category: 'DevOps', check: 'jq --version',             install: 'brew install jq / apt install jq' },
  ],
}

function checkTool(cmd: string): { ok: boolean; version?: string } {
  try {
    const out = execSync(cmd, { stdio: 'pipe', timeout: 5000 }).toString().trim().split('\n')[0]
    return { ok: true, version: out.substring(0, 60) }
  } catch {
    return { ok: false }
  }
}

export async function testAllCommand() {
  console.log()
  console.log(pc.bold('  Environment Check — All Supported Stacks'))
  console.log(pc.dim('  ✔ installed  ✘ not found  (optional shown dimmed)\n'))

  let totalOk = 0, totalMissing = 0

  for (const [section, tools] of Object.entries(ALL_STACKS)) {
    console.log(pc.bold(`\n  ${section}`))
    console.log(pc.dim('  ' + '─'.repeat(50)))

    for (const tool of tools) {
      const result = checkTool(tool.check)
      if (result.ok) {
        totalOk++
        console.log(`  ${pc.green('✔')} ${pc.bold(tool.label.padEnd(22))} ${pc.dim(result.version ?? '')}`)
      } else {
        totalMissing++
        console.log(`  ${pc.red('✘')} ${pc.bold(tool.label.padEnd(22))} ${pc.dim('→ ' + (tool.install ?? 'not installed'))}`)
      }
    }
  }

  console.log()
  console.log(pc.dim('  ' + '─'.repeat(50)))
  console.log(`  ${pc.green(`✔ ${totalOk} installed`)}  ${totalMissing > 0 ? pc.red(`✘ ${totalMissing} missing`) : pc.green('all tools present!')}`)
  console.log()

  if (totalMissing === 0) return

  console.log(pc.dim('  Run: npx @envsetup/cli doctor --stack <stack> to install missing tools for a specific stack'))
  console.log()
}
