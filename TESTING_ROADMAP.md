# Testing Roadmap — EnvSetup.dev

## Current State (as of 2026-07-06)

`.github/workflows/daily-test.yml` runs on every push/PR to `main` and daily at 6 AM IST.
It has 4 jobs, but none of them are real tests in the unit/integration/E2E sense:

| Job | What it's named | What it actually does |
|---|---|---|
| TypeScript Check | Compile check | `tsc --noEmit` + `next build` — genuinely useful, catches type errors and build breaks |
| API Route Tests | Sounds like functional tests | Only checks that ~9 specific files exist on disk (`[ -f "$f" ]`). Never calls an endpoint. |
| Security Check | Sounds like a security scan | Grep for hardcoded secret patterns (`sk-`, `gsk_`, `xkeysib-`) and a couple of string checks. No SAST tool, no dependency audit. |
| CLI Tests | Sounds like CLI tests | Builds the CLI, runs `doctor` once with `|| true` (masks failures — job passes even if it crashes), prints the version. No assertions. |

There is no unit test suite, no regression tests, no A/B testing infrastructure, and no
performance testing anywhere in the repo. `cli/src/tests/combinations.test.ts` exists (a
plain Node script, not a real test framework) but isn't wired into CI at all.

This document lays out a phased plan to build a real testing pyramid without over-investing
before the product needs it.

---

## Phase 1 — Make the existing CI checks honest (quick win, do first)

Effort: small. These are misleading today; fixing them is higher value than adding anything new.

- **API Route Tests**: replace the file-existence check with real HTTP calls against a
  `next start` instance in CI — e.g. hit `/api/admin/auth/check` (expect 401 without a
  cookie, now that middleware actually protects it), `POST /api/subscribe` with a test
  email against a throwaway/test `DATABASE_URL`, `GET /` and a couple of key pages for a
  200 status.
- **Security Check**: keep the secret-pattern grep (cheap, catches real accidents) but add
  `npm audit --audit-level=high` (or a proper tool like `osv-scanner`) for dependency
  vulnerabilities — the project currently ships with unreviewed audit warnings.
- **CLI Tests**: remove the `|| true` — a crash should fail the job. Add a couple of
  `doctor --stack <x>` runs across 2-3 representative stacks instead of just the default.

## Phase 2 — Unit tests for core logic

Effort: medium. Introduce **Vitest** (lighter than Jest, native ESM/TS support, fast) for
both the web app and the CLI.

Priority targets (pure logic, no framework/DB coupling, highest bug-to-effort ratio):
- `lib/auth.ts` — `verifyCredentials`, `createSessionToken`/`verifySessionToken` (valid
  token accepted, tampered signature rejected, expired token rejected, wrong secret rejected).
- `cli/src/data/recommendations.ts` — the stack/testing-matrix lookup logic.
- `cli/src/commands/doctor.ts` / `installer.ts` — the per-stack command-selection logic
  (mock the actual shell execution, test that the right install command is chosen per OS/stack).
- `lib/versions.ts` — version-parsing/comparison logic if it has pure functions.

Wire `npm test` into CI as its own job once it exists on both `cli/` and the root app.

## Phase 3 — Integration tests for API routes

Effort: medium-large. Test routes against a real (test) Postgres instance rather than mocks
— this project got burned once already by an unverified-domain email issue, so prefer
real dependencies over mocks where feasible (spin up a throwaway Neon branch or a local
Postgres container in CI).

Priority targets: `/api/subscribe` (dedupe logic, Brevo call failure shouldn't break the
subscribe response), `/api/admin/auth/login` + middleware (reject bad creds, accept good
ones, expired session redirects), `/api/admin/newsletters/send` (now that it requires
auth — verify unauthenticated requests are actually rejected, this was the bug we just fixed).

## Phase 4 — End-to-end tests for critical user flows

Effort: large. Use **Playwright** (good Next.js support, can run in GitHub Actions).

Priority flows, in order:
1. Generator flow: land on `/generator` → pick a stack → generate → download ZIP.
2. Subscribe flow: waitlist/coming-soon email capture → confirmation.
3. Admin flow: login → view dashboard → create+send a newsletter → logout → confirm
   logged-out state can't reach `/admin/*`.

Run this as a separate, slower CI job (or nightly only) rather than blocking every push,
since E2E suites are the most flaky/slowest tier.

## Phase 5 — Performance testing

Effort: medium. Add **Lighthouse CI** as a GitHub Action against the deployed Vercel
preview URL for at least `/` and `/generator` (the two pages that matter most for
first-impression and core-task speed). Set a budget (e.g. performance score floor,
max JS bundle size) that fails CI if regressed — this also guards against dependency
bloat like the three.js packages we just removed after they went unused.

## Phase 6 — A/B testing / experimentation (defer)

No infrastructure exists today (no GrowthBook/LaunchDarkly/etc.), and there's nothing to
experiment on yet — pricing page only has a Free tier, no live traffic-splitting need.
**Recommendation: don't build this until there's an actual experiment to run** (e.g. once
[[payment/billing decision]] is made and there's a pricing page worth A/B testing). Building
experimentation infra speculatively is a common way to burn effort with no payoff.

---

## Suggested order of work

1. Phase 1 (fix the fake checks) — do this regardless of everything else, it's actively
   misleading right now.
2. Phase 2 (unit tests on `lib/auth.ts` especially, given it was just rewritten).
3. Phase 3 and 4 can follow once the product surface stabilizes a bit more — no point
   writing E2E tests for flows that are still actively changing (e.g. pricing/billing,
   which is still an open decision).
4. Phase 5 (perf) is cheap to add and worth doing early since it's a tripwire, not
   ongoing maintenance burden.
5. Phase 6 — revisit only when there's a concrete experiment to run.
