import { describe, it, expect } from "vitest"
import { sanitizeLanguage, sanitizeFramework } from "./generator-form"

describe("sanitizeLanguage", () => {
  it("accepts a known language value", () => {
    expect(sanitizeLanguage("java")).toBe("java")
  })

  it("is case-insensitive", () => {
    expect(sanitizeLanguage("Java")).toBe("java")
    expect(sanitizeLanguage("JAVA")).toBe("java")
  })

  it("trims whitespace", () => {
    expect(sanitizeLanguage("  python  ")).toBe("python")
  })

  it("rejects an unknown language", () => {
    expect(sanitizeLanguage("cobol")).toBe("")
  })

  it("rejects null/undefined/empty", () => {
    expect(sanitizeLanguage(null)).toBe("")
    expect(sanitizeLanguage(undefined)).toBe("")
    expect(sanitizeLanguage("")).toBe("")
  })
})

describe("sanitizeFramework", () => {
  it("accepts a framework that's valid for the given language", () => {
    expect(sanitizeFramework("java", "Spring Boot")).toBe("spring boot")
  })

  it("is case-insensitive", () => {
    expect(sanitizeFramework("javascript", "REACT")).toBe("react")
  })

  // The bug this was written to catch: ?language=java&framework=Angular
  // previously sailed straight through into form state even though Angular
  // isn't one of Java's frameworks.
  it("rejects a framework that belongs to a different language (java + Angular)", () => {
    expect(sanitizeFramework("java", "Angular")).toBe("")
  })

  it("rejects a framework when no language is set", () => {
    expect(sanitizeFramework("", "React")).toBe("")
  })

  it("rejects a completely made-up framework", () => {
    expect(sanitizeFramework("python", "NotARealFramework")).toBe("")
  })

  it("rejects a framework for a language with no framework list", () => {
    // (every language in `languages` currently has a `frameworks` entry, but
    // the function should still fail safe if that ever changes)
    expect(sanitizeFramework("cobol", "React")).toBe("")
  })
})
