import { test, expect } from "@playwright/test"

// The one flow the existing suite (admin-auth, feedback-widget, generator,
// waitlist) never touched: the AI assistant chat, including the "download
// detected stack" handoff that used to be permanently dead code (envConfig
// was hardcoded to null — see components/ai-assistant-chat.tsx history).
//
// This test suite doesn't need real LLM credentials to be meaningful: CI
// (.github/workflows/e2e.yml) points DATABASE_URL at an unreachable local
// Postgres and sets no GROQ_API_KEY/OPENAI_API_KEY, so app/api/ai-assistant's
// getModel() always returns null and every reply comes from the deterministic
// smartFallback() keyword matcher — the same fail-open behavior the DB-backed
// rate limiter already relies on. That determinism is what makes asserting
// on a specific detected stack safe here.
test.describe("AI Assistant chat flow", () => {
  test("shows an empty state and disables sending a blank message", async ({ page }) => {
    await page.goto("/ai-assistant")

    await expect(page.getByText("Start by telling me about your project!")).toBeVisible()
    await expect(page.locator('form button[type="submit"]')).toBeDisabled()
  })

  test("detects a stack from the conversation and downloads a matching ZIP", async ({ page }) => {
    await page.goto("/ai-assistant")

    const input = page.getByPlaceholder("Describe your project...")
    await input.fill("I need a Spring Boot API with PostgreSQL")
    await input.press("Enter")

    // Echoes the user's own message back into the chat log.
    await expect(page.getByText("I need a Spring Boot API with PostgreSQL")).toBeVisible()

    // The assistant replies, and the stack it detected (Java + Spring Boot,
    // via lib/stacks.ts detectStackFromText) populates the "Environment
    // Ready!" download card below the chat.
    await expect(page.getByText("Environment Ready!")).toBeVisible({ timeout: 15_000 })

    const downloadPromise = page.waitForEvent("download")
    await page.getByRole("button", { name: "ZIP" }).click()
    const download = await downloadPromise

    expect(download.suggestedFilename()).toBe("spring-boot-project-environment.zip")
    const path = await download.path()
    expect(path).toBeTruthy()
  })

  test("enforces the per-message character limit", async ({ page }) => {
    await page.goto("/ai-assistant")

    const input = page.getByPlaceholder("Describe your project...")
    await input.fill("x".repeat(600))

    // MAX_CHARS_PER_MESSAGE in components/ai-assistant-chat.tsx is 500 --
    // the input itself should truncate, not just the server.
    await expect(input).toHaveValue("x".repeat(500))
  })
})
