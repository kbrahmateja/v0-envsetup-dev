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
    { value: 'httpx-pytest', label: 'httpx + pytest-asyncio', hint: 'Async API testing' },
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


// ── Comprehensive Testing Matrix ─────────────────────────────────────────────
// Returns ALL relevant testing tools based on combined stack in one list
export function getComprehensiveTestingOptions(
  language: string,
  stack: string,
  projectType: string,
  mobilePlatform: string,
  mobileBackend: string
): ToolOption[] {

  const options: ToolOption[] = []

  // ── Mobile testing ─────────────────────────────────────────────────────
  if (projectType === 'mobile') {
    const mobileTools: Record<string, ToolOption[]> = {
      'ios-swift': [
        { value: 'xctest',       label: 'XCTest',               hint: 'Unit + UI · Apple built-in',      recommended: true },
        { value: 'quick-nimble', label: 'Quick + Nimble',        hint: 'BDD style testing' },
        { value: 'xcuitest',     label: 'XCUITest',              hint: 'UI automation testing' },
        { value: 'snapshot-testing', label: 'SnapshotTesting',   hint: 'Visual regression testing' },
      ],
      'android-kt': [
        { value: 'junit5',     label: 'JUnit 5',                 hint: 'Unit testing · Android standard',  recommended: true },
        { value: 'mockk',      label: 'MockK',                   hint: 'Kotlin mocking' },
        { value: 'espresso',   label: 'Espresso',                hint: 'UI testing · Google' },
        { value: 'robolectric',label: 'Robolectric',             hint: 'Fast Android unit tests' },
      ],
      'react-native': [
        { value: 'jest',              label: 'Jest',                      hint: 'Unit testing · standard',    recommended: true },
        { value: 'rntl',              label: 'React Native Testing Library', hint: 'Component testing' },
        { value: 'detox',             label: 'Detox',                     hint: 'E2E mobile automation' },
        { value: 'maestro',           label: 'Maestro',                   hint: 'Mobile E2E · easy setup' },
      ],
      'expo': [
        { value: 'jest',   label: 'Jest + Expo',                  hint: 'Unit testing',                    recommended: true },
        { value: 'rntl',   label: 'React Native Testing Library',  hint: 'Component testing' },
        { value: 'maestro', label: 'Maestro',                     hint: 'E2E mobile automation' },
      ],
      'flutter': [
        { value: 'flutter-test',       label: 'flutter test',         hint: 'Unit + widget testing · built-in', recommended: true },
        { value: 'mockito-dart',        label: 'Mockito (Dart)',        hint: 'Mocking' },
        { value: 'integration-test',    label: 'integration_test',     hint: 'E2E testing' },
        { value: 'golden-toolkit',      label: 'golden_toolkit',       hint: 'Visual/golden testing' },
      ],
      'ionic': [
        { value: 'jest',    label: 'Jest',                          hint: 'Unit testing',                    recommended: true },
        { value: 'cypress', label: 'Cypress',                       hint: 'E2E web + mobile' },
      ],
    }
    const mobilePlatformTools = mobileTools[mobilePlatform] ?? []
    options.push(...mobilePlatformTools)
  }

  // ── Backend / Full stack testing ────────────────────────────────────────
  const backendLang = (projectType === 'mobile' && mobileBackend === 'custom') ? language
    : (projectType !== 'mobile' ? language : '')

  if (backendLang) {
    const unitTools: Record<string, ToolOption[]> = {
      typescript: [
        { value: 'jest',      label: 'Jest',          hint: 'Unit + integration · most popular', recommended: true },
        { value: 'vitest',    label: 'Vitest',         hint: 'Jest-compatible · 10x faster' },
        { value: 'mocha',     label: 'Mocha + Chai',   hint: 'Flexible test runner' },
      ],
      javascript: [
        { value: 'jest',      label: 'Jest',           hint: 'Unit + integration',               recommended: true },
        { value: 'mocha',     label: 'Mocha + Chai',   hint: 'Flexible' },
      ],
      python: [
        { value: 'pytest',       label: 'pytest',         hint: 'Unit + integration · standard',   recommended: true },
        { value: 'pytest-cov',   label: 'pytest-cov',     hint: 'Coverage reports' },
        { value: 'factory-boy',  label: 'factory_boy',    hint: 'Test data generation' },
        { value: 'hypothesis',   label: 'Hypothesis',     hint: 'Property-based testing' },
      ],
      java: [
        { value: 'junit5',          label: 'JUnit 5',          hint: 'Unit testing · standard',         recommended: true },
        { value: 'mockito',         label: 'Mockito',           hint: 'Mocking framework' },
        { value: 'testcontainers',  label: 'Testcontainers',   hint: 'Integration with real DB/services', recommended: true },
        { value: 'assertj',         label: 'AssertJ',           hint: 'Fluent assertions' },
        { value: 'archunit',        label: 'ArchUnit',          hint: 'Architecture rule testing' },
      ],
      kotlin: [
        { value: 'junit5',    label: 'JUnit 5',       hint: 'Unit testing',                       recommended: true },
        { value: 'kotest',    label: 'Kotest',         hint: 'Kotlin-idiomatic BDD testing' },
        { value: 'mockk',     label: 'MockK',          hint: 'Kotlin mocking',                    recommended: true },
      ],
      go: [
        { value: 'gotest',    label: 'go test (built-in)', hint: 'No setup needed',              recommended: true },
        { value: 'testify',   label: 'Testify',             hint: 'Assertions + mocking' },
        { value: 'gomock',    label: 'GoMock',              hint: 'Interface mocking' },
      ],
      rust: [
        { value: 'cargo-test', label: 'cargo test (built-in)', hint: 'No setup needed',          recommended: true },
        { value: 'mockall',    label: 'mockall',               hint: 'Auto-generate mocks' },
        { value: 'proptest',   label: 'proptest',              hint: 'Property-based testing' },
      ],
      php: [
        { value: 'phpunit',  label: 'PHPUnit',        hint: 'Unit testing · standard',             recommended: true },
        { value: 'pest',     label: 'Pest',            hint: 'Modern PHP testing · elegant' },
        { value: 'mockery',  label: 'Mockery',         hint: 'Mocking' },
      ],
      ruby: [
        { value: 'rspec',        label: 'RSpec',         hint: 'BDD · standard for Rails',        recommended: true },
        { value: 'factory-bot',  label: 'FactoryBot',    hint: 'Test data generation',            recommended: true },
        { value: 'shoulda',      label: 'Shoulda Matchers', hint: 'Rails-specific matchers' },
      ],
      csharp: [
        { value: 'xunit',  label: 'xUnit',             hint: 'Unit testing · most popular',        recommended: true },
        { value: 'moq',    label: 'Moq',                hint: 'Mocking framework',                 recommended: true },
        { value: 'nunit',  label: 'NUnit',              hint: 'Alternative test runner' },
      ],
      elixir: [
        { value: 'exunit', label: 'ExUnit (built-in)',  hint: 'No setup needed',                  recommended: true },
        { value: 'mox',    label: 'Mox',                hint: 'Concurrent mocking' },
        { value: 'stream-data', label: 'StreamData',   hint: 'Property-based testing' },
      ],
    }
    const backendUnitTools = unitTools[backendLang] ?? []
    // Add separator label if both mobile and backend tools exist
    if (options.length > 0 && backendUnitTools.length > 0) {
      options.push({ value: '__sep_unit', label: '── Backend: Unit testing ──', hint: '' })
    }
    options.push(...backendUnitTools)
  }

  // ── API / Integration testing (for any backend) ────────────────────────
  if (backendLang || projectType === 'web' || projectType === 'backend') {
    const apiTools: ToolOption[] = [
      { value: 'supertest',    label: 'Supertest',           hint: 'HTTP endpoint testing · Node.js', ...(backendLang === 'typescript' || backendLang === 'javascript' ? { recommended: true } : {}) },
      { value: 'httpx-pytest', label: 'httpx + pytest',      hint: 'Async HTTP testing · Python', ...(backendLang === 'python' ? { recommended: true } : {}) },
      { value: 'rest-assured', label: 'REST Assured',        hint: 'API testing · Java', ...(backendLang === 'java' || backendLang === 'kotlin' ? { recommended: true } : {}) },
      { value: 'postman-newman', label: 'Postman + Newman',  hint: 'API testing + CI/CD automation' },
      { value: 'hoppscotch',   label: 'Hoppscotch',          hint: 'Open-source API testing' },
    ].filter(t =>
      (backendLang === 'typescript' || backendLang === 'javascript') && t.value === 'supertest' ||
      backendLang === 'python' && t.value === 'httpx-pytest' ||
      (backendLang === 'java' || backendLang === 'kotlin') && t.value === 'rest-assured' ||
      t.value === 'postman-newman' || t.value === 'hoppscotch'
    )
    if (apiTools.length) {
      options.push({ value: '__sep_api', label: '── API / Integration testing ──', hint: '' })
      options.push(...apiTools)
    }
  }

  // ── E2E / Browser testing (for web/mobile) ─────────────────────────────
  if (projectType === 'web' || projectType === 'frontend' || (projectType === 'mobile' && mobileBackend !== 'none')) {
    options.push({ value: '__sep_e2e', label: '── E2E / Browser testing ──', hint: '' })
    options.push(
      { value: 'playwright', label: 'Playwright',   hint: 'E2E · multi-browser · Microsoft',      recommended: true },
      { value: 'cypress',    label: 'Cypress',      hint: 'E2E · developer friendly' },
      { value: 'selenium',   label: 'Selenium',     hint: 'E2E · cross-browser · classic' },
    )
  }

  // ── Performance / Load testing ──────────────────────────────────────────
  options.push({ value: '__sep_load', label: '── Performance / Load testing ──', hint: '' })
  options.push(
    { value: 'k6',       label: 'k6',         hint: 'Modern load testing · JavaScript scripts', recommended: true },
    { value: 'artillery', label: 'Artillery',  hint: 'Load testing · YAML config · Node.js' },
    { value: 'locust',   label: 'Locust',      hint: 'Load testing · Python scripts' },
  )

  // ── Code quality / Coverage ─────────────────────────────────────────────
  options.push({ value: '__sep_quality', label: '── Code quality / Coverage ──', hint: '' })
  options.push(
    { value: 'sonarqube', label: 'SonarQube',   hint: 'Code quality + security analysis' },
    { value: 'codecov',   label: 'Codecov',     hint: 'Coverage reporting + PR comments' },
    { value: 'snyk',      label: 'Snyk',        hint: 'Dependency vulnerability scanning' },
  )

  // Filter out separator entries from initialValues selection
  return options
}


export interface ToolCategory {
  category: string
  icon: string
  tools: ToolOption[]
}

export function getAllStackTools(
  language: string,
  stack: string,
  projectType: string,
  mobilePlatform: string,
  mobileBackend: string
): ToolCategory[] {
  const isMobile = projectType === 'mobile'
  const hasBackend = !isMobile || mobileBackend === 'custom'
  const backendLang = isMobile && mobileBackend === 'custom' ? language : (!isMobile ? language : '')
  const isWeb = projectType === 'web' || projectType === 'frontend' || projectType === 'backend'

  const categories: ToolCategory[] = []

  // ── Testing ─────────────────────────────────────────────────────────────
  const testingTools: ToolOption[] = []

  // Mobile testing
  if (isMobile) {
    const mobileTests: Record<string, ToolOption[]> = {
      'ios-swift':    [{ value: 'xctest', label: 'XCTest', hint: 'Unit + UI · built-in', recommended: true }, { value: 'quick', label: 'Quick + Nimble', hint: 'BDD' }, { value: 'xcuitest', label: 'XCUITest', hint: 'UI automation' }],
      'android-kt':   [{ value: 'junit5', label: 'JUnit 5', hint: 'Unit · standard', recommended: true }, { value: 'mockk', label: 'MockK', hint: 'Kotlin mocking' }, { value: 'espresso', label: 'Espresso', hint: 'UI testing' }],
      'react-native': [{ value: 'jest', label: 'Jest', hint: 'Unit testing', recommended: true }, { value: 'rntl', label: 'RN Testing Library', hint: 'Component testing' }, { value: 'detox', label: 'Detox', hint: 'E2E mobile' }],
      'expo':         [{ value: 'jest', label: 'Jest + Expo', hint: 'Unit testing', recommended: true }, { value: 'maestro', label: 'Maestro', hint: 'E2E easy setup' }],
      'flutter':      [{ value: 'flutter-test', label: 'flutter test', hint: 'Built-in', recommended: true }, { value: 'integration-test', label: 'integration_test', hint: 'E2E' }, { value: 'golden-toolkit', label: 'golden_toolkit', hint: 'Visual testing' }],
    }
    testingTools.push(...(mobileTests[mobilePlatform] ?? []))
  }

  // Backend testing by language
  const backendTests: Record<string, ToolOption[]> = {
    typescript: [{ value: 'jest', label: 'Jest', hint: 'Unit + integration', recommended: true }, { value: 'vitest', label: 'Vitest', hint: 'Faster alternative' }, { value: 'supertest', label: 'Supertest', hint: 'HTTP endpoint testing', recommended: true }],
    javascript: [{ value: 'jest', label: 'Jest', hint: 'Unit testing', recommended: true }, { value: 'mocha', label: 'Mocha + Chai', hint: 'Flexible' }],
    python:     [{ value: 'pytest', label: 'pytest', hint: 'Standard', recommended: true }, { value: 'pytest-cov', label: 'pytest-cov', hint: 'Coverage' }, { value: 'httpx-pytest', label: 'httpx + pytest', hint: 'Async API testing', recommended: true }, { value: 'factory-boy', label: 'factory_boy', hint: 'Test data' }],
    java:       [{ value: 'junit5', label: 'JUnit 5', hint: 'Standard', recommended: true }, { value: 'mockito', label: 'Mockito', hint: 'Mocking', recommended: true }, { value: 'testcontainers', label: 'Testcontainers', hint: 'Real DB in tests', recommended: true }, { value: 'rest-assured', label: 'REST Assured', hint: 'API testing' }],
    kotlin:     [{ value: 'junit5', label: 'JUnit 5', hint: 'Standard', recommended: true }, { value: 'kotest', label: 'Kotest', hint: 'Kotlin-native BDD' }, { value: 'mockk', label: 'MockK', hint: 'Kotlin mocking', recommended: true }],
    go:         [{ value: 'gotest', label: 'go test', hint: 'Built-in · no setup', recommended: true }, { value: 'testify', label: 'Testify', hint: 'Assertions + mocking' }, { value: 'httptest', label: 'httptest', hint: 'HTTP handler testing' }],
    rust:       [{ value: 'cargo-test', label: 'cargo test', hint: 'Built-in', recommended: true }, { value: 'mockall', label: 'mockall', hint: 'Auto-generate mocks' }],
    php:        [{ value: 'phpunit', label: 'PHPUnit', hint: 'Standard', recommended: true }, { value: 'pest', label: 'Pest', hint: 'Modern elegant testing' }],
    ruby:       [{ value: 'rspec', label: 'RSpec', hint: 'BDD · Rails standard', recommended: true }, { value: 'factory-bot', label: 'FactoryBot', hint: 'Test data', recommended: true }],
    csharp:     [{ value: 'xunit', label: 'xUnit', hint: 'Most popular .NET', recommended: true }, { value: 'moq', label: 'Moq', hint: 'Mocking', recommended: true }],
    elixir:     [{ value: 'exunit', label: 'ExUnit', hint: 'Built-in', recommended: true }, { value: 'mox', label: 'Mox', hint: 'Concurrent mocking' }],
    scala:      [{ value: 'scalatest', label: 'ScalaTest', hint: 'Flexible testing', recommended: true }, { value: 'scalacheck', label: 'ScalaCheck', hint: 'Property-based' }],
    haskell:    [{ value: 'hspec', label: 'HSpec', hint: 'BDD', recommended: true }, { value: 'quickcheck', label: 'QuickCheck', hint: 'Property-based' }],
    clojure:    [{ value: 'clojure-test', label: 'clojure.test', hint: 'Built-in', recommended: true }, { value: 'midje', label: 'Midje', hint: 'BDD' }],
    r:          [{ value: 'testthat', label: 'testthat', hint: 'Standard R testing', recommended: true }],
    dart:       [{ value: 'dart-test', label: 'dart test', hint: 'Built-in', recommended: true }, { value: 'mockito-dart', label: 'Mockito (Dart)', hint: 'Mocking' }],
    julia:      [{ value: 'julia-test', label: 'Test.jl', hint: 'Built-in', recommended: true }],
    crystal:    [{ value: 'crystal-spec', label: 'crystal spec', hint: 'Built-in', recommended: true }],
    zig:        [{ value: 'zig-test', label: 'zig test', hint: 'Built-in', recommended: true }],
    swift:      [{ value: 'xctest', label: 'XCTest', hint: 'Built-in Apple', recommended: true }],
    perl:       [{ value: 'test-more', label: 'Test::More', hint: 'Standard', recommended: true }],
  }

  if (backendLang && backendTests[backendLang]) {
    testingTools.push(...backendTests[backendLang].filter(t => !testingTools.find(e => e.value === t.value)))
  }

  // E2E for web
  if (isWeb) {
    testingTools.push(
      { value: 'playwright', label: 'Playwright', hint: 'E2E · multi-browser', recommended: true },
      { value: 'cypress', label: 'Cypress', hint: 'E2E · developer friendly' },
    )
  }

  // Load testing (all)
  testingTools.push(
    { value: 'k6', label: 'k6', hint: 'Load testing · JS scripts', recommended: true },
    { value: 'artillery', label: 'Artillery', hint: 'Load testing · YAML config' },
  )

  if (testingTools.length) categories.push({ category: 'Testing', icon: '🧪', tools: testingTools })

  // ── Code Quality & Linting ──────────────────────────────────────────────
  const qualityTools: ToolOption[] = []
  const linters: Record<string, ToolOption[]> = {
    typescript: [{ value: 'eslint', label: 'ESLint', hint: 'JS/TS linting', recommended: true }, { value: 'prettier', label: 'Prettier', hint: 'Code formatter', recommended: true }, { value: 'husky', label: 'Husky', hint: 'Pre-commit hooks', recommended: true }],
    javascript: [{ value: 'eslint', label: 'ESLint', hint: 'Linting', recommended: true }, { value: 'prettier', label: 'Prettier', hint: 'Formatter', recommended: true }],
    python:     [{ value: 'ruff', label: 'Ruff', hint: 'Fast linter + formatter', recommended: true }, { value: 'mypy', label: 'mypy', hint: 'Type checking', recommended: true }, { value: 'black', label: 'Black', hint: 'Code formatter' }],
    java:       [{ value: 'checkstyle', label: 'Checkstyle', hint: 'Code style checking' }, { value: 'spotbugs', label: 'SpotBugs', hint: 'Bug detection' }, { value: 'pmd', label: 'PMD', hint: 'Static analysis' }],
    kotlin:     [{ value: 'detekt', label: 'Detekt', hint: 'Kotlin static analysis', recommended: true }, { value: 'ktlint', label: 'ktlint', hint: 'Kotlin formatter' }],
    go:         [{ value: 'golangci-lint', label: 'golangci-lint', hint: 'Fast linter aggregator', recommended: true }, { value: 'gofmt', label: 'gofmt', hint: 'Built-in formatter' }],
    rust:       [{ value: 'clippy', label: 'Clippy', hint: 'Rust linter · built-in', recommended: true }, { value: 'rustfmt', label: 'rustfmt', hint: 'Built-in formatter' }],
    php:        [{ value: 'phpcs', label: 'PHP_CodeSniffer', hint: 'Code style' }, { value: 'phpstan', label: 'PHPStan', hint: 'Static analysis', recommended: true }, { value: 'pint', label: 'Laravel Pint', hint: 'Laravel formatter' }],
    ruby:       [{ value: 'rubocop', label: 'RuboCop', hint: 'Ruby linter + formatter', recommended: true }],
    csharp:     [{ value: 'roslyn-analyzers', label: 'Roslyn Analyzers', hint: 'Built-in', recommended: true }, { value: 'stylecop', label: 'StyleCop', hint: 'Code style' }],
    elixir:     [{ value: 'credo', label: 'Credo', hint: 'Static code analysis', recommended: true }, { value: 'dialyxir', label: 'Dialyxir', hint: 'Type analysis' }],
    swift:      [{ value: 'swiftlint', label: 'SwiftLint', hint: 'Linter', recommended: true }, { value: 'swiftformat', label: 'SwiftFormat', hint: 'Formatter' }],
    dart:       [{ value: 'dart-analyze', label: 'dart analyze', hint: 'Built-in', recommended: true }, { value: 'dart-format', label: 'dart format', hint: 'Built-in formatter' }],
    scala:      [{ value: 'scalafmt', label: 'Scalafmt', hint: 'Formatter', recommended: true }, { value: 'scalafix', label: 'Scalafix', hint: 'Linting + refactoring' }, { value: 'wartremover', label: 'WartRemover', hint: 'Linter' }],
    haskell:    [{ value: 'hlint', label: 'HLint', hint: 'Suggestions linter', recommended: true }, { value: 'ormolu', label: 'Ormolu', hint: 'Formatter' }],
    r:          [{ value: 'lintr', label: 'lintr', hint: 'R linting', recommended: true }, { value: 'styler', label: 'styler', hint: 'R formatter' }],
    julia:      [{ value: 'julia-formatter', label: 'JuliaFormatter.jl', hint: 'Formatter', recommended: true }],
    crystal:    [{ value: 'ameba', label: 'Ameba', hint: 'Crystal linter', recommended: true }],
    'ios-swift':    [{ value: 'swiftlint', label: 'SwiftLint', hint: 'Swift linter', recommended: true }, { value: 'swiftformat', label: 'SwiftFormat', hint: 'Code formatter' }],
    'android-kt':   [{ value: 'detekt', label: 'Detekt', hint: 'Kotlin static analysis', recommended: true }, { value: 'ktlint', label: 'ktlint', hint: 'Kotlin formatter' }],
    'react-native': [{ value: 'eslint', label: 'ESLint', hint: 'JS/TS linting', recommended: true }, { value: 'prettier', label: 'Prettier', hint: 'Code formatter', recommended: true }, { value: 'husky', label: 'Husky', hint: 'Pre-commit hooks', recommended: true }],
    'expo':         [{ value: 'eslint', label: 'ESLint', hint: 'JS/TS linting', recommended: true }, { value: 'prettier', label: 'Prettier', hint: 'Code formatter', recommended: true }],
    'flutter':      [{ value: 'flutter-analyze', label: 'flutter analyze', hint: 'Built-in analyzer', recommended: true }, { value: 'very-good-analysis', label: 'very_good_analysis', hint: 'Strict lint rules' }],
    'ionic':        [{ value: 'eslint', label: 'ESLint', hint: 'Linting', recommended: true }, { value: 'prettier', label: 'Prettier', hint: 'Formatter', recommended: true }],
  }

  // For mobile + custom backend: add BOTH mobile platform linters AND backend lang linters
  const mobileLangKey = isMobile ? mobilePlatform : null
  const backendLangKey = backendLang || null
  
  if (mobileLangKey && linters[mobileLangKey]) qualityTools.push(...linters[mobileLangKey])
  if (backendLangKey && backendLangKey !== mobileLangKey && linters[backendLangKey]) {
    qualityTools.push(...linters[backendLangKey].filter((l: ToolOption) => !qualityTools.find((q: ToolOption) => q.value === l.value)))
  }
  // Fallback for standalone backend
  if (!mobileLangKey && !backendLangKey && linters[backendLang]) qualityTools.push(...linters[backendLang])
  qualityTools.push(
    { value: 'sonarqube', label: 'SonarQube', hint: 'Code quality + security gate' },
    { value: 'codecov', label: 'Codecov', hint: 'Coverage reports + PR comments' },
    { value: 'snyk', label: 'Snyk', hint: 'Vulnerability scanning' },
    { value: 'deepsource', label: 'DeepSource', hint: 'Auto-fix code issues' },
  )
  if (qualityTools.length) categories.push({ category: 'Code Quality & Linting', icon: '✨', tools: qualityTools })

  // ── CI/CD ───────────────────────────────────────────────────────────────
  categories.push({
    category: 'CI/CD',
    icon: '🔄',
    tools: [
      { value: 'github-actions', label: 'GitHub Actions', hint: 'Free · integrates with GitHub', recommended: true },
      { value: 'gitlab-ci', label: 'GitLab CI', hint: 'Free · built-in registry' },
      { value: 'jenkins', label: 'Jenkins', hint: 'Self-hosted · flexible' },
      { value: 'circleci', label: 'CircleCI', hint: 'Fast · good free tier' },
      { value: 'aws-codepipeline', label: 'AWS CodePipeline', hint: 'If deploying to AWS' },
      { value: 'bitbucket-pipelines', label: 'Bitbucket Pipelines', hint: 'If using Bitbucket' },
      { value: 'argo-cd', label: 'ArgoCD', hint: 'GitOps · Kubernetes' },
    ]
  })

  // ── DevOps & Infrastructure ─────────────────────────────────────────────
  categories.push({
    category: 'DevOps & Infrastructure',
    icon: '🐳',
    tools: [
      { value: 'docker', label: 'Docker + Compose', hint: 'Containerization', recommended: true },
      { value: 'kubernetes', label: 'Kubernetes', hint: 'Container orchestration' },
      { value: 'terraform', label: 'Terraform', hint: 'Infrastructure as Code' },
      { value: 'ansible', label: 'Ansible', hint: 'Configuration management' },
      { value: 'helm', label: 'Helm', hint: 'Kubernetes package manager' },
    ]
  })

  // ── Monitoring & Observability ──────────────────────────────────────────
  categories.push({
    category: 'Monitoring & Observability',
    icon: '📊',
    tools: [
      { value: 'sentry', label: 'Sentry', hint: 'Error tracking + performance', recommended: true },
      { value: 'grafana', label: 'Prometheus + Grafana', hint: 'Metrics dashboard' },
      { value: 'datadog', label: 'Datadog', hint: 'Full observability platform' },
      { value: 'opentelemetry', label: 'OpenTelemetry', hint: 'Distributed tracing · standard' },
      { value: 'elastic-apm', label: 'Elastic APM', hint: 'Application performance monitoring' },
      ...(isMobile ? [
        { value: 'firebase-crashlytics', label: 'Firebase Crashlytics', hint: 'Mobile crash reporting', recommended: true },
        { value: 'firebase-analytics', label: 'Firebase Analytics', hint: 'Mobile analytics' },
      ] : []),
    ]
  })

  // ── Documentation ───────────────────────────────────────────────────────
  categories.push({
    category: 'Documentation',
    icon: '📚',
    tools: [
      { value: 'swagger', label: 'Swagger / OpenAPI', hint: 'API documentation', ...(hasBackend ? { recommended: true } : {}) },
      { value: 'storybook', label: 'Storybook', hint: 'UI component docs', ...(isWeb ? { recommended: true } : {}) },
      { value: 'docusaurus', label: 'Docusaurus', hint: 'Project documentation site' },
      { value: 'readme-ai', label: 'readme-ai', hint: 'AI-generated README' },
      { value: 'notion', label: 'Notion', hint: 'Team knowledge base' },
    ]
  })

  // ── Security ────────────────────────────────────────────────────────────
  categories.push({
    category: 'Security',
    icon: '🔐',
    tools: [
      { value: 'owasp-zap', label: 'OWASP ZAP', hint: 'Security testing scanner' },
      { value: 'trivy', label: 'Trivy', hint: 'Container vulnerability scanning', recommended: true },
      { value: 'dependabot', label: 'Dependabot', hint: 'Auto dependency updates', recommended: true },
      { value: 'vault', label: 'HashiCorp Vault', hint: 'Secrets management' },
      { value: 'gitleaks', label: 'Gitleaks', hint: 'Secret scanning in git' },
    ]
  })

  return categories
}
