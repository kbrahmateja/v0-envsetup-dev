// Generates DEVELOPER_SETUP.md with browser extensions + IDE plugins

interface SetupConfig {
  name: string
  stack: string
  language: string
  ide?: string
  testing?: string[]
}

const browserExtensions: Record<string, { chrome: string[]; firefox: string[] }> = {
  typescript: {
    chrome: [
      'React Developer Tools — facebook/react-devtools',
      'Redux DevTools — zalmoxisus/redux-devtools-extension',
      'JSON Viewer — chrome.google.com/webstore/detail/json-viewer',
      'Wappalyzer — Technology profiler',
      'Lighthouse — Performance auditing (built into Chrome DevTools)',
      'VisBug — Design debugger',
    ],
    firefox: [
      'React Developer Tools — addons.mozilla.org',
      'Redux DevTools — addons.mozilla.org',
      'JSON-Lite — lightweight JSON viewer',
    ],
  },
  javascript: {
    chrome: [
      'React/Vue/Angular DevTools (based on framework)',
      'JSON Viewer',
      'Wappalyzer',
      'Lighthouse (built-in)',
    ],
    firefox: ['React/Vue DevTools', 'JSON-Lite'],
  },
  python: {
    chrome: ['JSON Viewer', 'Wappalyzer', 'ModHeader — modify request headers'],
    firefox: ['JSON-Lite', 'ModHeader'],
  },
  java: {
    chrome: ['JSON Viewer', 'Wappalyzer', 'REST API Tester'],
    firefox: ['JSON-Lite', 'REST API Tester'],
  },
  go: {
    chrome: ['JSON Viewer', 'Wappalyzer'],
    firefox: ['JSON-Lite'],
  },
  rust: {
    chrome: ['JSON Viewer', 'Wappalyzer'],
    firefox: ['JSON-Lite'],
  },
}

const idePlugins: Record<string, Record<string, string[]>> = {
  vscode: {
    typescript: [
      'ESLint — dbaeumer.vscode-eslint',
      'Prettier — esbenp.prettier-vscode',
      'Tailwind CSS IntelliSense — bradlc.vscode-tailwindcss',
      'Path Intellisense — christian-kohler.path-intellisense',
      'Auto Import — steoates.autoimport',
      'Thunder Client — REST API client — rangav.vscode-thunder-client',
      'GitLens — eamodio.gitlens',
      'Docker — ms-azuretools.vscode-docker',
      'Error Lens — usernamehw.errorlens',
      'Prisma — prisma.prisma (if using Prisma)',
    ],
    python: [
      'Python — ms-python.python',
      'Pylance — ms-python.pylance',
      'Black Formatter — ms-python.black-formatter',
      'Ruff — charliermarsh.ruff',
      'Python Docstring Generator — njpwerner.autodocstring',
      'Thunder Client — rangav.vscode-thunder-client',
      'GitLens — eamodio.gitlens',
      'Docker — ms-azuretools.vscode-docker',
    ],
    java: [
      'Extension Pack for Java — vscjava.vscode-java-pack',
      'Spring Boot Extension Pack — vmware.vscode-boot-dev-pack',
      'Lombok Annotations — gabrielbb.vscode-lombok',
      'Thunder Client — rangav.vscode-thunder-client',
      'GitLens — eamodio.gitlens',
      'Docker — ms-azuretools.vscode-docker',
      'SonarLint — sonarsource.sonarlint-vscode',
    ],
    go: [
      'Go — golang.go',
      'Thunder Client — rangav.vscode-thunder-client',
      'GitLens — eamodio.gitlens',
      'Docker — ms-azuretools.vscode-docker',
      'Error Lens — usernamehw.errorlens',
    ],
    rust: [
      'rust-analyzer — rust-lang.rust-analyzer',
      'CodeLLDB debugger — vadimcn.vscode-lldb',
      'Even Better TOML — tamasfe.even-better-toml',
      'GitLens — eamodio.gitlens',
      'Docker — ms-azuretools.vscode-docker',
    ],
    php: [
      'PHP Intelephense — bmewburn.vscode-intelephense-client',
      'PHP Debug — xdebug.php-debug',
      'Laravel Blade Snippets — onecentlin.laravel-blade',
      'Laravel Extra Intellisense — amiralizadeh9480.laravel-extra-intellisense',
      'Thunder Client — rangav.vscode-thunder-client',
      'GitLens — eamodio.gitlens',
    ],
    ruby: [
      'Ruby LSP — Shopify.ruby-lsp',
      'VSCode Ruby — wingrunr21.vscode-ruby',
      'Rails — bung87.rails',
      'GitLens — eamodio.gitlens',
      'Docker — ms-azuretools.vscode-docker',
    ],
    csharp: [
      'C# Dev Kit — ms-dotnettools.csdevkit',
      'C# — ms-dotnettools.csharp',
      '.NET Install Tool — ms-dotnettools.vscode-dotnet-runtime',
      'NuGet Package Manager — aliasadidev.nugetpackagemanagergui',
      'GitLens — eamodio.gitlens',
    ],
  },
  intellij: {
    java: [
      'Lombok Plugin (built-in in recent versions)',
      'Spring Boot Plugin (bundled)',
      'Database Tools and SQL (bundled)',
      'HTTP Client (bundled) — test REST APIs in .http files',
      'SonarLint',
      'Checkstyle-IDEA',
      'GitToolBox',
    ],
    kotlin: [
      'Kotlin Plugin (bundled)',
      'Spring Boot Plugin (bundled)',
      'Detekt Plugin — code quality',
      'GitToolBox',
    ],
    python: [
      'Python Community Edition (in PyCharm free)',
      'Django Support',
      '.env files support — Borys Pierov',
      'GitToolBox',
    ],
    go: [
      'Go Plugin (in GoLand — bundled)',
      'File Watchers',
      'GitToolBox',
    ],
  },
  cursor: {
    typescript: ['Same as VS Code — Cursor uses VS Code extensions'],
    python: ['Same as VS Code — Cursor uses VS Code extensions'],
    java: ['Same as VS Code — Cursor uses VS Code extensions'],
    go: ['Same as VS Code — Cursor uses VS Code extensions'],
  },
}

const terminalTools: Record<string, string[]> = {
  typescript: [
    'nvm — Node version manager (nvm.sh)',
    'pnpm — Fast package manager (pnpm.io)',
    'turbo — Monorepo build system (turbo.build)',
    'ts-node — Run TypeScript directly',
  ],
  python: [
    'pyenv — Python version manager (pyenv.io)',
    'pipx — Install Python CLI tools',
    'poetry — Modern Python packaging (python-poetry.org)',
    'uv — Ultra-fast Python package installer',
  ],
  java: [
    'SDKMAN — JVM version manager (sdkman.io) — install Java, Gradle, Maven',
    'jenv — Java version manager',
  ],
  go: ['gvm — Go version manager', 'golangci-lint — Fast Go linter'],
  rust: ['rustup — Rust toolchain manager (rustup.rs)', 'cargo-watch — Auto-rebuild on changes'],
  php: ['Composer — PHP package manager', 'Laravel Valet — Local dev environment (Mac)'],
  ruby: ['rbenv — Ruby version manager', 'bundler — Ruby dependency manager'],
  all: [
    'Docker Desktop — Container management UI',
    'k9s — Kubernetes CLI dashboard',
    'lazygit — Terminal UI for git',
    'gh — GitHub CLI',
    'jq — JSON processor for CLI',
    'httpie — API testing CLI (httpie.io)',
  ],
}

export function generateDeveloperSetup(cfg: SetupConfig): string {
  const lang = cfg.language?.toLowerCase() ?? 'typescript'
  const ide = cfg.ide ?? 'vscode'
  const browserExt = browserExtensions[lang] ?? browserExtensions.typescript

  const idePluginList = (idePlugins[ide]?.[lang] ?? idePlugins.vscode?.[lang] ?? [])
  const termTools = [...(terminalTools[lang] ?? []), ...terminalTools.all]

  return `# ${cfg.name} — Developer Setup Guide

This guide helps every team member set up their development environment consistently.

## Quick Start
\`\`\`bash
git clone <repo-url>
cd ${cfg.name}
cp .env.example .env
docker compose up -d
\`\`\`

---

## Browser Extensions

### Chrome
${browserExt.chrome.map(e => `- **${e.split(' — ')[0]}** — ${e.split(' — ')[1] ?? ''}`).join('\n')}

### Firefox
${browserExt.firefox.map(e => `- ${e}`).join('\n')}

### Universal (Both)
- **REST Client** — Test APIs directly from browser
- **JSON Formatter** — Pretty-print JSON responses
- **ModHeader** — Add/modify request headers for testing auth

---

## IDE / Editor

### ${ide === 'vscode' ? 'VS Code' : ide === 'intellij' ? 'IntelliJ IDEA' : ide.charAt(0).toUpperCase() + ide.slice(1)} Plugins

${idePluginList.map(p => `- **${p.split(' — ')[0]}** — \`${p.split(' — ')[1] ?? ''}\``).join('\n')}

${ide === 'vscode' ? `### VS Code Settings (already configured in \`.vscode/settings.json\`)
- Format on save: ✅
- Default formatter: Prettier
- Trim trailing whitespace: ✅` : ''}

---

## Terminal Tools

### Language-specific
${(terminalTools[lang] ?? []).map(t => `- **${t.split(' — ')[0]}** — ${t.split(' — ')[1] ?? ''}`).join('\n')}

### Universal
${terminalTools.all.map(t => `- **${t.split(' — ')[0]}** — ${t.split(' — ')[1] ?? ''}`).join('\n')}

---

## Recommended Workflow

\`\`\`bash
# 1. Create feature branch
git checkout -b feature/my-feature

# 2. Start dev environment
docker compose up -d

# 3. Run tests in watch mode
${lang === 'python' ? 'pytest --watch' : lang === 'java' ? './mvnw test' : lang === 'go' ? 'go test ./...' : lang === 'rust' ? 'cargo test' : 'npm test -- --watch'}

# 4. Commit (pre-commit hooks run automatically)
git add .
git commit -m "feat: my feature"

# 5. Push and open PR
git push origin feature/my-feature
\`\`\`

---

## Troubleshooting

| Issue | Solution |
|-------|---------|
| Port already in use | \`docker compose down && docker compose up -d\` |
| DB connection failed | Check \`.env\` DATABASE_URL |
| Tests failing | \`docker compose restart\` |

---
*Generated by [envsetup.dev](https://envsetup.dev)*`
}
