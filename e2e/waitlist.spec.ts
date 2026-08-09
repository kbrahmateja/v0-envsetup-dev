import { test, expect } from "@playwright/test"

// Priority flow #2 from TESTING_ROADMAP.md Phase 4: "Subscribe flow:
// waitlist/coming-soon email capture -> confirmation."
test.describe("Waitlist / subscribe flow", () => {
  test("joins the Pro waitlist and sees a confirmation with the submitted email", async ({ page }) => {
    await page.goto("/waitlist")

    await expect(page.getByRole("heading", { name: /Pro Plan.*Early Access/i })).toBeVisible()

    await page.getByPlaceholder("you@company.com").fill("e2e-waitlist@example.com")
    await page.getByRole("button", { name: /Join Waitlist/i }).click()

    await expect(page.getByRole("heading", { name: "You're on the list!" })).toBeVisible()
    await expect(page.getByText("e2e-waitlist@example.com")).toBeVisible()

    // Confirmation state offers a way back into the product, not a dead end.
    await expect(page.getByRole("link", { name: /Use Free Plan Now/i })).toBeVisible()
  })

  test("joins the Team waitlist via ?plan=team and confirms the right plan name", async ({ page }) => {
    await page.goto("/waitlist?plan=team")

    await expect(page.getByRole("heading", { name: /Team Plan.*Early Access/i })).toBeVisible()

    await page.getByPlaceholder("you@company.com").fill("e2e-team-waitlist@example.com")
    await page.getByRole("button", { name: /Join Waitlist/i }).click()

    await expect(page.getByText(/Team.*launches/i)).toBeVisible()
  })

  test("rejects an empty submission by staying on the form (no confirmation shown)", async ({ page }) => {
    await page.goto("/waitlist")

    await page.getByRole("button", { name: /Join Waitlist/i }).click()

    // HTML5 `required` on the email input should block submission entirely --
    // no confirmation heading, still on the form.
    await expect(page.getByRole("heading", { name: "You're on the list!" })).not.toBeVisible()
    await expect(page.getByPlaceholder("you@company.com")).toBeVisible()
  })
})
