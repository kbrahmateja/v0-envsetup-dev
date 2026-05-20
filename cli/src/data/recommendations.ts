// IDE, CI/CD, Testing recommendations per stack

export interface ToolOption {
  value: string
  label: string
  hint?: string
  recommended?: boolean
}

export const ideOptions: Record<string, ToolOption[]> = {
  java: [
    { value: 'intellij', label: 'IntelliJ IDEA', hint: 'Best for Java/Kotlin', recommended: true },
    { value: 'vscode', label: 'VS Code', hint: '+ Extension Pack for Java' },
    { value: 'eclipse', label: 'Eclipse', hint: 'Free, battle-tested' },
  ],
  kotlin: [
    { value: 'intellij', label: 'IntelliJ IDEA', hint: 'Made by JetBrains', recommended: true },
    { value: 'vscode', label: 'VS Code', hint: '+ Kotlin extension' },
  ],
  python: [
    { value: 'pycharm', label: 'PyCharm', hint: 'Best Python IDE', recommended: true },
    { value: 'vscode', label: 'VS Code', hint: '+ Python + Pylance extensions' },
    { value: 'jupyter', label: 'Jupyter Lab', hint: 'For data science' },
  ],
  typescript: [
    { value: 'vscode', label: 'VS Code', hint: 'Most popular for TS/JS', recommended: true },
    { value: 'webstorm', label: 'WebStorm', hint: 'JetBrains — best JS IDE' },
    { value: 'cursor', label: 'Cursor', hint: 'AI-powered editor' },
  ],
  javascript: [
    { value: 'vscode', label: 'VS Code', hint: 'Most popular', recommended: true },
    { value: 'webstorm', label: 'WebStorm', hint: 'JetBrains — powerful' },
    { value: 'cursor', label: 'Cursor', hint: 'AI-powered editor' },
  ],
  go: [
    { value: 'vscode', label: 'VS Code', hint: '+ Go extension', recommended: true },
    { value: 'goland', label: 'GoLand', hint: 'JetBrains — full Go IDE' },
  ],
  rust: [
    { value: 'vscode', label: 'VS Code', hint: '+ rust-analyzer', recommended: true },
    { value: 'clion', label: 'CLion', hint: 'JetBrains — systems IDE' },
  ],
  php: [
    { value: 'phpstorm', label: 'PhpStorm', hint: 'Best PHP IDE', recommended: true },
    { value: 'vscode', label: 'VS Code', hint: '+ PHP Intelephense' },
  ],
  ruby: [
    { value: 'rubymine', label: 'RubyMine', hint: 'JetBrains — best for Rails', recommended: true },
    { value: 'vscode', label: 'VS Code', hint: '+ Ruby LSP' },
  ],
  csharp: [
    { value: 'rider', label: 'JetBrains Rider', hint: 'Best .NET IDE', recommended: true },
    { value: 'vscode', label: 'VS Code', hint: '+ C# Dev Kit' },
  ],
  elixir: [
    { value: 'vscode', label: 'VS Code', hint: '+ ElixirLS', recommended: true },
  ],
}

export const cicdOptions: ToolOption[] = [
  { value: 'github-actions', label: 'GitHub Actions', hint: 'Free, integrates with GitHub', recommended: true },
  { value: 'gitlab-ci', label: 'GitLab CI', hint: 'Free, built-in container registry' },
  { value: 'jenkins', label: 'Jenkins', hint: 'Self-hosted, highly customizable' },
  { value: 'circleci', label: 'CircleCI', hint: 'Fast, good free tier' },
  { value: 'aws-codepipeline', label: 'AWS CodePipeline', hint: 'If deploying to AWS' },
  { value: 'none', label: 'Skip for now', hint: 'Add later' },
]

export const testingOptions: Record<string, ToolOption[]> = {
  java: [
    { value: 'junit5', label: 'JUnit 5', hint: 'Standard unit testing', recommended: true },
    { value: 'mockito', label: 'Mockito', hint: 'Mocking framework' },
    { value: 'testcontainers', label: 'Testcontainers', hint: 'Integration tests with real DBs' },
    { value: 'rest-assured', label: 'REST Assured', hint: 'API testing' },
  ],
  kotlin: [
    { value: 'junit5', label: 'JUnit 5', hint: 'Standard', recommended: true },
    { value: 'kotest', label: 'Kotest', hint: 'Kotlin-idiomatic testing' },
    { value: 'mockk', label: 'MockK', hint: 'Kotlin mocking' },
  ],
  python: [
    { value: 'pytest', label: 'pytest', hint: 'Most popular Python testing', recommended: true },
    { value: 'coverage', label: 'coverage.py', hint: 'Code coverage' },
    { value: 'httpx', label: 'httpx + pytest-asyncio', hint: 'Async API testing' },
    { value: 'factory-boy', label: 'factory_boy', hint: 'Test data generation' },
  ],
  typescript: [
    { value: 'jest', label: 'Jest', hint: 'Most popular JS testing', recommended: true },
    { value: 'vitest', label: 'Vitest', hint: 'Faster, Vite-based' },
    { value: 'supertest', label: 'Supertest', hint: 'HTTP endpoint testing' },
    { value: 'playwright', label: 'Playwright', hint: 'E2E browser testing' },
  ],
  javascript: [
    { value: 'jest', label: 'Jest', hint: 'Standard', recommended: true },
    { value: 'mocha', label: 'Mocha + Chai', hint: 'Flexible test runner' },
    { value: 'supertest', label: 'Supertest', hint: 'API testing' },
  ],
  go: [
    { value: 'gotest', label: 'go test (built-in)', hint: 'No extra setup', recommended: true },
    { value: 'testify', label: 'Testify', hint: 'Assertions + mocking' },
  ],
  rust: [
    { value: 'cargo-test', label: 'cargo test (built-in)', hint: 'No setup needed', recommended: true },
    { value: 'mockall', label: 'mockall', hint: 'Auto-generate mocks' },
  ],
  php: [
    { value: 'phpunit', label: 'PHPUnit', hint: 'Standard PHP testing', recommended: true },
    { value: 'pest', label: 'Pest', hint: 'Modern, elegant testing' },
  ],
  ruby: [
    { value: 'rspec', label: 'RSpec', hint: 'BDD for Ruby', recommended: true },
    { value: 'factory-bot', label: 'FactoryBot', hint: 'Test data generation' },
  ],
  csharp: [
    { value: 'xunit', label: 'xUnit', hint: 'Most popular .NET testing', recommended: true },
    { value: 'moq', label: 'Moq', hint: 'Mocking framework' },
  ],
  elixir: [
    { value: 'exunit', label: 'ExUnit (built-in)', hint: 'No setup needed', recommended: true },
    { value: 'mox', label: 'Mox', hint: 'Concurrent mocking' },
  ],
}

export const qualityOptions: ToolOption[] = [
  { value: 'prettier', label: 'Prettier', hint: 'Code formatter', recommended: true },
  { value: 'eslint', label: 'ESLint', hint: 'JS/TS linting' },
  { value: 'husky', label: 'Husky', hint: 'Git hooks (pre-commit lint/test)' },
  { value: 'sonarqube', label: 'SonarQube', hint: 'Code quality analysis' },
  { value: 'codecov', label: 'Codecov', hint: 'Coverage reporting' },
  { value: 'none', label: 'Skip', hint: 'Add later' },
]

export function getRecommended(options: ToolOption[]): string[] {
  return options.filter(o => o.recommended).map(o => o.value)
}
