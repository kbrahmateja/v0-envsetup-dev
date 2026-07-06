import { afterEach, beforeEach, describe, expect, it, vi } from "vitest"
import { createSessionToken, verifyCredentials, verifySessionToken } from "./auth"

const ORIGINAL_ENV = { ...process.env }

beforeEach(() => {
  process.env = { ...ORIGINAL_ENV }
  process.env.ADMIN_USERNAME = "admin"
  process.env.ADMIN_PASSWORD = "correct-horse-battery-staple"
  process.env.ADMIN_SESSION_SECRET = "test-session-secret-value"
})

afterEach(() => {
  process.env = { ...ORIGINAL_ENV }
  vi.useRealTimers()
})

describe("verifyCredentials", () => {
  it("accepts the correct username and password", () => {
    expect(verifyCredentials("admin", "correct-horse-battery-staple")).toBe(true)
  })

  it("rejects a wrong password", () => {
    expect(verifyCredentials("admin", "wrong-password")).toBe(false)
  })

  it("rejects a wrong username", () => {
    expect(verifyCredentials("someone-else", "correct-horse-battery-staple")).toBe(false)
  })

  it("rejects everything if ADMIN_PASSWORD is not configured", () => {
    delete process.env.ADMIN_PASSWORD
    expect(verifyCredentials("admin", "correct-horse-battery-staple")).toBe(false)
  })
})

describe("createSessionToken / verifySessionToken", () => {
  it("issues a token that verifies as valid", async () => {
    const token = await createSessionToken("admin")
    expect(await verifySessionToken(token)).toBe(true)
  })

  it("rejects a missing token", async () => {
    expect(await verifySessionToken(undefined)).toBe(false)
    expect(await verifySessionToken(null)).toBe(false)
    expect(await verifySessionToken("")).toBe(false)
  })

  it("rejects a malformed token", async () => {
    expect(await verifySessionToken("not-a-real-token")).toBe(false)
    expect(await verifySessionToken("only.two-parts")).toBe(false)
  })

  it("rejects a token with a tampered signature", async () => {
    const token = await createSessionToken("admin")
    const [username, expiresAt] = token.split(".")
    const tampered = `${username}.${expiresAt}.${"0".repeat(64)}`
    expect(await verifySessionToken(tampered)).toBe(false)
  })

  it("rejects a token with a tampered username but the original signature", async () => {
    const token = await createSessionToken("admin")
    const [, expiresAt, signature] = token.split(".")
    const tampered = `attacker.${expiresAt}.${signature}`
    expect(await verifySessionToken(tampered)).toBe(false)
  })

  it("rejects an expired token", async () => {
    vi.useFakeTimers()
    vi.setSystemTime(new Date("2026-01-01T00:00:00Z"))
    const token = await createSessionToken("admin")

    // Advance 8 days, past the 7-day session TTL
    vi.setSystemTime(new Date("2026-01-09T00:00:00Z"))
    expect(await verifySessionToken(token)).toBe(false)
  })

  it("rejects a token signed with a different secret", async () => {
    const token = await createSessionToken("admin")
    process.env.ADMIN_SESSION_SECRET = "a-completely-different-secret"
    expect(await verifySessionToken(token)).toBe(false)
  })

  it("falls back to ADMIN_PASSWORD as the signing secret when ADMIN_SESSION_SECRET is unset", async () => {
    delete process.env.ADMIN_SESSION_SECRET
    const token = await createSessionToken("admin")
    expect(await verifySessionToken(token)).toBe(true)
  })
})
