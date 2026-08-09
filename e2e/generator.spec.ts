import { test, expect } from "@playwright/test"

// Priority flow #1 from TESTING_ROADMAP.md Phase 4:
// land on /generator -> pick a stack -> generate -> download ZIP.
test.describe("Generator flow", () => {
  test("fills out the form, reaches the results page, and downloads a ZIP", async ({ page }) => {
    await page.goto("/generator")

    await page.getByLabel("Project Name").fill("e2e-test-project")

    // Radix Select renders as a button-like trigger, not a native <select>.
    await page.getByRole("combobox", { name: /Programming Language/i }).click()
    await page.getByRole("option", { name: "TypeScript" }).click()

    await page.getByRole("combobox", { name: /Framework/i }).click()
    await page.getByRole("option", { name: "Next.js" }).click()

    await page.getByRole("button", { name: /Generate Environment|Generate/i }).click()

    await expect(page).toHaveURL(/\/generator\/results\?/)
    await expect(page.getByText(/Your Environment is Ready/i)).toBeVisible()

    const downloadPromise = page.waitForEvent("download")
    await page.getByRole("button", { name: /Download ZIP/i }).click()
    const download = await downloadPromise

    expect(download.suggestedFilename()).toBe("e2e-test-project-environment.zip")
    const path = await download.path()
    expect(path).toBeTruthy()
  })

  test("rejects an empty submission by staying on the form (no project name/language)", async ({ page }) => {
    await page.goto("/generator")
    // Submitting without required fields should not silently navigate to
    // a results page with a blank/garbage config.
    const generateButton = page.getByRole("button", { name: /Generate Environment|Generate/i })
    await generateButton.click()
    // HTML5 `required` validation (or equivalent) should keep us on /generator.
    await expect(page).toHaveURL(/\/generator$/)
  })
})
