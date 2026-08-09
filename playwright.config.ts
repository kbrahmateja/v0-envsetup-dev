import { defineConfig, devices } from "@playwright/test"

// Phase 4 of TESTING_ROADMAP.md — E2E tests for the two flows most likely
// to silently break: generating+downloading an environment, and admin auth.
// Deliberately kept separate from `npm test` (vitest/unit) and from the
// per-push CI job — see .github/workflows/e2e.yml, which runs this on a
// schedule/manual trigger rather than on every push, since E2E is the
// slowest/flakiest tier and the product surface (pricing/billing) is still
// actively changing per SESSION_HANDOFF.md.
export default defineConfig({
  testDir: "./e2e",
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  reporter: process.env.CI ? "github" : "list",
  use: {
    baseURL: process.env.E2E_BASE_URL || "http://localhost:3000",
    trace: "retain-on-failure",
  },
  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] },
    },
  ],
  webServer: process.env.E2E_BASE_URL
    ? undefined
    : {
        command: "npm run start",
        url: "http://localhost:3000",
        reuseExistingServer: !process.env.CI,
        timeout: 120_000,
      },
})
