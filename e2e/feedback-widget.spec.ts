import { test, expect } from "@playwright/test"

// The floating feedback widget is rendered in the root layout, so it should
// be present and usable on any page.
test.describe("Feedback widget", () => {
  test("opens, validates, and submits a suggestion from any page", async ({ page }) => {
    await page.goto("/")

    await page.getByTestId("feedback-widget-trigger").click()
    await expect(page.getByRole("heading", { name: "Got a suggestion?" })).toBeVisible()

    // Submitting empty shows a validation message instead of calling the API.
    await page.getByRole("button", { name: "Send Suggestion" }).click()
    await expect(page.getByText(/enter a suggestion/i)).toBeVisible()

    await page.getByLabel("Your suggestion").fill("Add support for Deno")
    await page.getByRole("button", { name: "Send Suggestion" }).click()

    await expect(page.getByRole("heading", { name: /Thanks for the suggestion/i })).toBeVisible()
    await page.getByRole("button", { name: "Done" }).click()
    await expect(page.getByRole("heading", { name: "Got a suggestion?" })).not.toBeVisible()
  })
})
