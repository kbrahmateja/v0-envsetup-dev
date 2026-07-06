/**
 * Combination Tests — validates tool suggestions for all language/platform combos
 * Run: node dist/tests/combinations.test.js
 */

import { getAllStackTools } from '../data/recommendations.js'

interface TestCase {
  label: string
  projectType: string
  mobilePlatform: string
  mobileBackend: string
  language: string
  stack: string
  expect: {
    hasCategory: string[]
    hasTool: string[]
    notHasTool?: string[]
    minTools: number
  }
}

const cases: TestCase[] = [
  // Mobile — no backend
  { label: 'iOS Swift',          projectType: 'mobile', mobilePlatform: 'ios-swift',    mobileBackend: 'none',   language: 'swift',      stack: 'ios-swift',   expect: { hasCategory: ['Testing','Code Quality & Linting'], hasTool: ['xctest','swiftlint'],                     notHasTool: ['jest','junit5','pytest'], minTools: 5 } },
  { label: 'Android Kotlin',     projectType: 'mobile', mobilePlatform: 'android-kt',   mobileBackend: 'none',   language: 'kotlin',     stack: 'android-kt',  expect: { hasCategory: ['Testing','Code Quality & Linting'], hasTool: ['junit5','mockk','espresso','detekt'],      notHasTool: ['xctest','pytest'],        minTools: 5 } },
  { label: 'React Native',       projectType: 'mobile', mobilePlatform: 'react-native', mobileBackend: 'none',   language: 'typescript', stack: 'react-native',expect: { hasCategory: ['Testing','Code Quality & Linting'], hasTool: ['jest','rntl','eslint','prettier','firebase-crashlytics'], notHasTool: ['xctest','junit5','pytest'], minTools: 8 } },
  { label: 'Flutter',            projectType: 'mobile', mobilePlatform: 'flutter',      mobileBackend: 'none',   language: 'dart',       stack: 'flutter',     expect: { hasCategory: ['Testing','Code Quality & Linting'], hasTool: ['flutter-test','flutter-analyze'],         notHasTool: ['xctest','jest','junit5'], minTools: 5 } },
  { label: 'Expo',               projectType: 'mobile', mobilePlatform: 'expo',         mobileBackend: 'none',   language: 'typescript', stack: 'expo',        expect: { hasCategory: ['Testing'],                          hasTool: ['jest','eslint'],                          notHasTool: ['xctest','junit5'],        minTools: 4 } },
  // Mobile — custom backend
  { label: 'iOS + Java BE',      projectType: 'mobile', mobilePlatform: 'ios-swift',    mobileBackend: 'custom', language: 'java',       stack: 'springboot',  expect: { hasCategory: ['Testing','Code Quality & Linting','Documentation'], hasTool: ['xctest','junit5','mockito','testcontainers','swiftlint','swagger'], notHasTool: ['jest','pytest'], minTools: 12 } },
  { label: 'RN + Python BE',     projectType: 'mobile', mobilePlatform: 'react-native', mobileBackend: 'custom', language: 'python',     stack: 'fastapi',     expect: { hasCategory: ['Testing','Code Quality & Linting','Documentation'], hasTool: ['jest','pytest','httpx-pytest','eslint','ruff','swagger'],          notHasTool: ['xctest','junit5'],       minTools: 12 } },
  { label: 'Flutter + Go BE',    projectType: 'mobile', mobilePlatform: 'flutter',      mobileBackend: 'custom', language: 'go',         stack: 'gin',         expect: { hasCategory: ['Testing','Code Quality & Linting'],                hasTool: ['flutter-test','gotest','testify','golangci-lint'],                 notHasTool: ['xctest','jest','junit5'], minTools: 8 } },
  { label: 'Android + Rust BE',  projectType: 'mobile', mobilePlatform: 'android-kt',   mobileBackend: 'custom', language: 'rust',       stack: 'actix',       expect: { hasCategory: ['Testing'],                                          hasTool: ['junit5','mockk','cargo-test','clippy'],                           notHasTool: ['xctest','jest','pytest'], minTools: 8 } },
  // Web / Backend
  { label: 'Next.js (TS)',       projectType: 'web',     mobilePlatform: '', mobileBackend: 'none', language: 'typescript', stack: 'nextjs',      expect: { hasCategory: ['Testing','Code Quality & Linting','CI/CD','DevOps & Infrastructure','Documentation'], hasTool: ['jest','vitest','playwright','eslint','prettier','swagger'], notHasTool: ['xctest','junit5','pytest'], minTools: 15 } },
  { label: 'FastAPI (Python)',   projectType: 'backend', mobilePlatform: '', mobileBackend: 'none', language: 'python',     stack: 'fastapi',     expect: { hasCategory: ['Testing','Code Quality & Linting'],  hasTool: ['pytest','httpx-pytest','ruff','mypy'],              notHasTool: ['jest','xctest','junit5','rspec'], minTools: 10 } },
  { label: 'Django (Python)',    projectType: 'web',     mobilePlatform: '', mobileBackend: 'none', language: 'python',     stack: 'django',      expect: { hasCategory: ['Testing'],                            hasTool: ['pytest','ruff'],                                   notHasTool: ['jest','xctest','junit5'],         minTools: 8  } },
  { label: 'Spring Boot (Java)', projectType: 'backend', mobilePlatform: '', mobileBackend: 'none', language: 'java',       stack: 'springboot',  expect: { hasCategory: ['Testing','Code Quality & Linting'],  hasTool: ['junit5','mockito','testcontainers','rest-assured','checkstyle'], notHasTool: ['jest','xctest','pytest','rspec'], minTools: 10 } },
  { label: 'Go Gin',             projectType: 'backend', mobilePlatform: '', mobileBackend: 'none', language: 'go',         stack: 'gin',         expect: { hasCategory: ['Testing','Code Quality & Linting'],  hasTool: ['gotest','testify','golangci-lint'],                 notHasTool: ['jest','xctest','junit5','pytest'], minTools: 8 } },
  { label: 'Rust Actix',        projectType: 'backend', mobilePlatform: '', mobileBackend: 'none', language: 'rust',       stack: 'actix',       expect: { hasCategory: ['Testing','Code Quality & Linting'],  hasTool: ['cargo-test','mockall','clippy','rustfmt'],          notHasTool: ['jest','junit5','pytest'],         minTools: 8 } },
  { label: 'PHP Laravel',        projectType: 'web',     mobilePlatform: '', mobileBackend: 'none', language: 'php',        stack: 'laravel',     expect: { hasCategory: ['Testing','Code Quality & Linting'],  hasTool: ['phpunit','pest','phpstan'],                         notHasTool: ['jest','xctest','junit5','pytest'], minTools: 8 } },
  { label: 'Ruby Rails',         projectType: 'web',     mobilePlatform: '', mobileBackend: 'none', language: 'ruby',       stack: 'rails',       expect: { hasCategory: ['Testing','Code Quality & Linting'],  hasTool: ['rspec','factory-bot','rubocop'],                    notHasTool: ['jest','xctest','junit5','pytest'], minTools: 8 } },
  { label: 'C# ASP.NET',         projectType: 'backend', mobilePlatform: '', mobileBackend: 'none', language: 'csharp',     stack: 'aspnet',      expect: { hasCategory: ['Testing','Code Quality & Linting'],  hasTool: ['xunit','moq','roslyn-analyzers'],                   notHasTool: ['jest','xctest','junit5','pytest'], minTools: 8 } },
  { label: 'Elixir Phoenix',     projectType: 'web',     mobilePlatform: '', mobileBackend: 'none', language: 'elixir',     stack: 'phoenix',     expect: { hasCategory: ['Testing','Code Quality & Linting'],  hasTool: ['exunit','mox','credo'],                             notHasTool: ['jest','xctest','junit5','pytest'], minTools: 8 } },
  { label: 'Kotlin Ktor',        projectType: 'backend', mobilePlatform: '', mobileBackend: 'none', language: 'kotlin',     stack: 'ktor',        expect: { hasCategory: ['Testing','Code Quality & Linting'],  hasTool: ['junit5','kotest','mockk','detekt','ktlint'],        notHasTool: ['jest','xctest','pytest','rspec'],  minTools: 8 } },
  { label: 'Scala Play',         projectType: 'backend', mobilePlatform: '', mobileBackend: 'none', language: 'scala',      stack: 'play',        expect: { hasCategory: ['Testing','Code Quality & Linting'],  hasTool: ['scalatest','scalafmt'],                             notHasTool: ['jest','xctest','junit5','pytest'], minTools: 5 } },
  { label: 'Haskell Servant',    projectType: 'backend', mobilePlatform: '', mobileBackend: 'none', language: 'haskell',    stack: 'servant',     expect: { hasCategory: ['Testing'],                            hasTool: ['hspec','hlint'],                                   notHasTool: ['jest','xctest','junit5'],         minTools: 3 } },
  { label: 'Clojure Ring',       projectType: 'backend', mobilePlatform: '', mobileBackend: 'none', language: 'clojure',    stack: 'ring',        expect: { hasCategory: ['Testing'],                            hasTool: ['clojure-test'],                                    notHasTool: ['jest','xctest','junit5'],         minTools: 2 } },
  { label: 'R Plumber',          projectType: 'backend', mobilePlatform: '', mobileBackend: 'none', language: 'r',          stack: 'plumber',     expect: { hasCategory: ['Testing'],                            hasTool: ['testthat','lintr'],                                notHasTool: ['jest','xctest'],                  minTools: 2 } },
  { label: 'Dart Shelf',         projectType: 'backend', mobilePlatform: '', mobileBackend: 'none', language: 'dart',       stack: 'shelf',       expect: { hasCategory: ['Testing'],                            hasTool: ['dart-test'],                                      notHasTool: ['jest','xctest','junit5'],         minTools: 2 } },
  { label: 'Zig Zap',            projectType: 'backend', mobilePlatform: '', mobileBackend: 'none', language: 'zig',        stack: 'zap',         expect: { hasCategory: ['Testing'],                            hasTool: ['zig-test'],                                       notHasTool: ['jest','xctest','junit5'],         minTools: 2 } },
]

// ── Runner ───────────────────────────────────────────────────────────────────
let passed = 0, failed = 0
const failures: string[] = []

console.log('\n envsetup CLI — Combination Tests')
console.log(' ' + '─'.repeat(55) + '\n')

for (const tc of cases) {
  const categories = getAllStackTools(tc.language, tc.stack, tc.projectType, tc.mobilePlatform, tc.mobileBackend)
  const allTools = categories.flatMap(c => c.tools.map(t => t.value))
  const categoryNames = categories.map(c => c.category)
  const errors: string[] = []

  tc.expect.hasCategory.forEach(cat => { if (!categoryNames.includes(cat)) errors.push(`Missing category: "${cat}"`) })
  tc.expect.hasTool.forEach(tool => { if (!allTools.includes(tool)) errors.push(`Missing tool: "${tool}"`) })
  ;(tc.expect.notHasTool ?? []).forEach(tool => { if (allTools.includes(tool)) errors.push(`Wrong tool present: "${tool}"`) })
  if (allTools.length < tc.expect.minTools) errors.push(`Too few tools: got ${allTools.length}, need ${tc.expect.minTools}+`)

  if (errors.length) {
    failed++
    failures.push(`\n  ❌ ${tc.label}:\n     ${errors.join('\n     ')}`)
    console.log(`  ❌  ${tc.label.padEnd(24)} ${errors.length} error(s)`)
    errors.forEach(e => console.log(`        → ${e}`))
  } else {
    passed++
    console.log(`  ✅  ${tc.label.padEnd(24)} ${allTools.length} tools across ${categories.length} categories`)
  }
}

console.log('\n ' + '─'.repeat(55))
console.log(`  ✅ ${passed} passed   ❌ ${failed} failed   📊 ${cases.length} total\n`)
process.exit(failed > 0 ? 1 : 0)
