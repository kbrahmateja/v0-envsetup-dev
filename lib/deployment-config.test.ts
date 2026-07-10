import { describe, expect, it } from "vitest"
import { generateToolFiles, type EnvironmentConfig } from "./deployment-config"

function baseConfig(overrides: Partial<EnvironmentConfig> = {}): EnvironmentConfig {
  return {
    projectName: "demo",
    language: "javascript",
    framework: "express",
    databases: [],
    tools: [],
    serverType: "local",
    ...overrides,
  }
}

describe("generateToolFiles", () => {
  it("emits eslint, prettier, jest, cypress, husky files for a JS project that selects them", () => {
    const files = generateToolFiles(
      baseConfig({ tools: ["eslint", "prettier", "jest", "cypress", "husky", "github-actions"] }),
    )
    expect(Object.keys(files)).toEqual(
      expect.arrayContaining([
        ".eslintrc.json",
        ".prettierrc",
        "jest.config.js",
        "__tests__/example.test.js",
        "cypress.config.js",
        "cypress/e2e/example.cy.js",
        ".husky/pre-commit",
        ".github/workflows/ci.yml",
      ]),
    )
  })

  it("uses TypeScript-flavored jest config and test extension for typescript", () => {
    const files = generateToolFiles(baseConfig({ language: "typescript", tools: ["jest"] }))
    expect(files["jest.config.js"]).toContain("ts-jest")
    expect(files["__tests__/example.test.ts"]).toBeDefined()
  })

  it("does not emit JS-only tool files for a non-JS language even if requested", () => {
    const files = generateToolFiles(baseConfig({ language: "python", tools: ["eslint", "jest", "cypress", "husky"] }))
    expect(files[".eslintrc.json"]).toBeUndefined()
    expect(files["jest.config.js"]).toBeUndefined()
  })

  it("emits language-appropriate tool files (python black/pytest)", () => {
    const files = generateToolFiles(baseConfig({ language: "python", tools: ["black", "pytest"] }))
    expect(files["pyproject.toml"]).toContain("[tool.black]")
    expect(files["pytest.ini"]).toBeDefined()
    expect(files["tests/test_example.py"]).toBeDefined()
  })

  it("tailors the GitHub Actions workflow setup step per language", () => {
    const jsFiles = generateToolFiles(baseConfig({ language: "javascript", tools: ["github-actions"] }))
    expect(jsFiles[".github/workflows/ci.yml"]).toContain("actions/setup-node")

    const goFiles = generateToolFiles(baseConfig({ language: "go", tools: ["github-actions"] }))
    expect(goFiles[".github/workflows/ci.yml"]).toContain("actions/setup-go")

    const javaFiles = generateToolFiles(baseConfig({ language: "java", tools: ["github-actions"] }))
    expect(javaFiles[".github/workflows/ci.yml"]).toContain("actions/setup-java")
  })

  it("returns no files when no tools are selected", () => {
    const files = generateToolFiles(baseConfig({ tools: [] }))
    expect(Object.keys(files)).toHaveLength(0)
  })

  it("ignores unknown tool ids without throwing", () => {
    expect(() => generateToolFiles(baseConfig({ tools: ["some-made-up-tool"] }))).not.toThrow()
  })
})
