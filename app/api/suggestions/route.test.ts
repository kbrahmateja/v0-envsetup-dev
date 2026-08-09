import { describe, it, expect } from "vitest"
import { validateSuggestion } from "./route"

describe("validateSuggestion", () => {
  it("accepts a valid message with no email", () => {
    const result = validateSuggestion({ message: "Add dark mode toggle" })
    expect(result.valid).toBe(true)
    if (result.valid) {
      expect(result.message).toBe("Add dark mode toggle")
      expect(result.email).toBeNull()
    }
  })

  it("accepts a valid message with a valid email", () => {
    const result = validateSuggestion({ message: "Please add X", email: "user@example.com" })
    expect(result.valid).toBe(true)
    if (result.valid) {
      expect(result.email).toBe("user@example.com")
    }
  })

  it("trims whitespace from message and email", () => {
    const result = validateSuggestion({ message: "  trimmed  ", email: "  user@example.com  " })
    expect(result.valid).toBe(true)
    if (result.valid) {
      expect(result.message).toBe("trimmed")
      expect(result.email).toBe("user@example.com")
    }
  })

  it("rejects an empty message", () => {
    const result = validateSuggestion({ message: "" })
    expect(result.valid).toBe(false)
  })

  it("rejects a missing message", () => {
    const result = validateSuggestion({})
    expect(result.valid).toBe(false)
  })

  it("rejects a whitespace-only message", () => {
    const result = validateSuggestion({ message: "   " })
    expect(result.valid).toBe(false)
  })

  it("rejects a non-string message", () => {
    const result = validateSuggestion({ message: 12345 as unknown as string })
    expect(result.valid).toBe(false)
  })

  it("rejects an invalid email when provided", () => {
    const result = validateSuggestion({ message: "hello", email: "not-an-email" })
    expect(result.valid).toBe(false)
    if (!result.valid) {
      expect(result.error).toMatch(/email/i)
    }
  })

  it("rejects a message over the max length", () => {
    const longMessage = "a".repeat(5001)
    const result = validateSuggestion({ message: longMessage })
    expect(result.valid).toBe(false)
  })

  it("accepts a message right at the max length", () => {
    const maxMessage = "a".repeat(5000)
    const result = validateSuggestion({ message: maxMessage })
    expect(result.valid).toBe(true)
  })
})
