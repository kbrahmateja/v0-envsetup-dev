import { test, expect } from "@playwright/test"

// Priority flow #3 from TESTING_ROADMAP.md Phase 4: login -> view dashboard ->
// logout -> confirm logged-out state can't reach /admin/*. Also covers the
// auth-gate regression this project already got burned by once
// (admin API routes with no auth check) from the other direction: does the
// *page* redirect an unauthenticated visitor, not just the API.
//
// Requires ADMIN_USERNAME/ADMIN_PASSWORD (or ADMIN_SESSION_SECRET) set in the
// environment the app under test is running in — same as CI's other jobs.
const ADMIN_USERNAME = process.env.ADMIN_USERNAME || "admin"
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "ci-test-password"

test.describe("Admin auth flow", () => {
  test("unauthenticated visitor hitting /admin is redirected to /admin/login", async ({ page }) => {
    await page.goto("/admin")
    await expect(page).toHaveURL(/\/admin\/login/)
  })

  test("rejects bad credentials with an error, not a redirect", async ({ page }) => {
    await page.goto("/admin/login")
    await page.getByLabel("Username").fill("admin")
    await page.getByLabel("Password").fill("definitely-wrong-password")
    await page.getByRole("button", { name: /Sign in|Log in|Login/i }).click()

    await expect(page.getByText(/failed|invalid|incorrect/i)).toBeVisible()
    await expect(page).toHaveURL(/\/admin\/login/)
  })

  test("logs in, reaches the dashboard, logs out, and can no longer reach /admin", async ({ page }) => {
    await page.goto("/admin/login")
    await page.getByLabel("Username").fill(ADMIN_USERNAME)
    await page.getByLabel("Password").fill(ADMIN_PASSWORD)
    await page.getByRole("button", { name: /Sign in|Log in|Login/i }).click()

    await expect(page).toHaveURL(/\/admin$/)
    // Several elements contain "Dashboard" (nav link, header, page h1) —
    // pin to the page's own h1 to avoid a Playwright strict-mode violation.
    await expect(page.getByRole("heading", { name: "Dashboard", exact: true })).toBeVisible()

    // Open the user menu and log out.
    await page.getByTestId("admin-user-menu").click()
    await page.getByRole("menuitem", { name: /Logout/i }).click()

    await expect(page).toHaveURL(/\/admin\/login/)

    // Confirm the session is actually gone server-side, not just a client redirect.
    await page.goto("/admin")
    await expect(page).toHaveURL(/\/admin\/login/)
  })
})
