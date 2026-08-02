# Session Handoff — envsetup.dev remediation (Cowork session, 2026-07-06 to 2026-07-10)

This file summarizes a multi-day remediation session done via Claude in Cowork mode, so
a fresh Claude Code session picking up this repo has full context. Read this once, then
it's safe to delete/ignore — it's a handoff note, not permanent project documentation
(though nothing stops you from keeping it).

## Repo / deployment facts
- GitHub: `kbrahmateja/v0-envsetup-dev`, branch `main`.
- Vercel project: `kbrahamtejas-projects/v0-envsetup-dev-hn` (production deploys from `main`,
  aliased to `envsetup.dev` + `www.envsetup.dev`). **Correction as of 2026-07-10**: an
  earlier version of this doc said the project was `v0-envsetup-dev` (no `-hn` suffix) —
  that's a separate, stale duplicate project in the same Vercel team whose deploys only
  ever reach `.vercel.app` URLs, never the real domain. Confirmed via `vercel inspect`
  on a live deployment showing the `envsetup.dev` aliases. Don't `vercel link` to the
  no-suffix project.
- Stack: Next.js 15 (App Router) web app + a separate `@envsetup/cli` npm package under `cli/`.
- DB: Neon Postgres via `@neondatabase/serverless` (`lib/db.ts`), fails gracefully if
  `DATABASE_URL` is unset rather than crashing the app.
- Email: Brevo, sender `info@envsetup.dev` (domain is verified/authenticated in Brevo).

## What was found broken at the start of this session (initial audit)
- Admin API routes (`/api/admin/newsletters`, `/api/admin/newsletters/send`,
  `/api/admin/visitors/chart`) had **no auth check at all** — middleware only matched
  `/admin/*` page routes, not `/api/admin/*`. Anyone could POST to send a newsletter
  blast without logging in.
- Admin session cookie was checked for *presence only*, not signature — trivially
  forgeable (`document.cookie = "admin_session=x"` bypassed login).
- `app/layout.tsx` shipped a literal placeholder Google Search Console token.
- Both `vercel.json` (cron jobs) and `amplify.yml` (static export config) existed —
  conflicting deploy targets; `amplify.yml` was stale/broken (build no longer produces
  a static `out/` dir).
- CLI had finished, uncommitted feature work sitting on disk (stack-aware `doctor`,
  auto-`installer`, `test-env` command) and was 1 commit ahead of `origin/main`, unpushed.
- Unused `coming-soon` 3D homepage components (`react-three-fiber`) and `page-backup.tsx`
  dead code still in the repo.
- CI (`.github/workflows/daily-test.yml`) had misleading job names: "API Route Tests"
  only checked files existed on disk (never called an endpoint), "Security Check" was
  grep-only, "CLI Tests" masked failures with `|| true`.
- No unit/integration/E2E/perf tests anywhere; no A/B testing infra (not needed yet).

## What was found broken *mid-session*, unrelated to the above
- **Every Vercel production deployment had failed for ~7 weeks** (since ~2026-05-17),
  npm `ERESOLVE` on `react-day-picker@8.10.1` (wants React 16-18) vs the project's
  React 19. Fixed with a root `.npmrc` containing `legacy-peer-deps=true`. **This means
  none of this session's earlier fixes were actually live in production until that
  `.npmrc` commit landed** — confirm the deploy history looks healthy from `0de4a20`
  onward before assuming anything before that was ever live.
- `next@15.5.9` had a HIGH-severity CVE (`GHSA-492v-c6pp-mqqv` / CVE-2026-44574) —
  a middleware/proxy bypass via crafted route params, directly relevant since admin
  auth relies on middleware. Bumped to `15.5.20` (patch-level, same minor line).
- Unused `expo`/`react-native`/`expo-*` dependencies (not referenced anywhere in
  `app/`/`components/`/`lib/`) were pulling in most of the dependency vulnerabilities
  (critical `shell-quote`, high `lodash`/`ws`). Removed; added `overrides` for `lodash`
  and `next`'s bundled `postcss`. Went from 16 audit findings to 1 low (an
  `@babel/core` build-tool-only issue, not worth force-fixing — it conflicts with
  `react-day-picker`'s peer deps).
- Generator's "Development Tools" checkboxes (Docker/Git/ESLint/Prettier/Jest/Cypress/
  Husky/GitHub Actions) were **fully static regardless of selected language** (Jest
  shown for Java/C#/Go projects) **and had zero effect on the downloaded ZIP** — pure
  decorative UI. Fixed both: list now filters by language, and selections generate
  real config files (`lib/deployment-config.ts`'s new `generateToolFiles`).
- AI assistant (`app/api/ai-assistant/route.ts`, `components/ai-assistant-chat.tsx`)
  had no rate limiting at all (free LLM calls, unbounded cost) and no conversation
  length/message-size caps. Added: 1 new session/day + 3/week (per IP address OR a
  long-lived cookie, whichever is more restrictive), 20-message conversation cap with
  a warning at 2 remaining, 500-char per-message cap. `scripts/create-ai-usage-table.sql`
  was run against the production Neon DB on 2026-07-10 (via `vercel env pull` + `psql`
  against the correct `v0-envsetup-dev-hn` project — see correction above);
  `ai_assistant_usage` table + both indexes now exist in prod, so rate limiting is
  actually enforced, not just fail-open.

## Known but NOT yet fixed — real product/quality bugs
- The AI assistant's live LLM responses (Groq `llama-3.1-8b-instant`) can hallucinate
  even with RAG context injected: seen giving "Spring Boot 3.0 latest" (KB actually
  says 3.2), "React 18" (project itself is on React 19), and an invented, invalid
  Docker tag `eclipse-temurin:17-jdk17-java-17` (no such string exists in the codebase —
  pure model hallucination, likely because RAG retrieval doesn't surface the right
  chunks well for compound multi-technology queries like "spring react mysql latest").
- Separately, when the LLM call fails/isn't configured, the route silently falls back
  to a raw `"Based on your request: **{title}**\n{content}"` dump (see
  `app/api/ai-assistant/route.ts` lines ~92-98) instead of a conversational answer —
  inconsistent UX depending on whether the LLM call happened to succeed that request.
- Neither of these has been fixed yet — flagged and discussed, not yet scoped into a
  concrete implementation plan.

## Fully completed this session (chronological, with commit hashes on `main`)
1. `399a0e6` — Add Vercel Analytics (`@vercel/analytics` was installed but never rendered).
2. `8b891ea` — Committed+pushed the CLI's pending stack-aware doctor/installer/test-env work.
3. `63f97f2` — Removed placeholder GSC token; real verification done via DNS TXT record
   in Vercel's DNS panel instead of an in-code meta tag.
4. Brevo domain verification — turned out to already be authenticated, no code change needed.
5. `3aad9cc` — Removed stale `amplify.yml`.
6. `3c88a96` — Hardened admin auth: HMAC-signed+verified session tokens (`lib/auth.ts`),
   `middleware.ts` now protects `/api/admin/*` too, dropped debug `console.log`s, fixed
   a stale doc claiming "Stack Auth already integrated" (false, no such code exists).
7. `81896db` — Removed unused 3D coming-soon components + `page-backup.tsx`, dropped
   `three`/`@react-three/*` deps, fixed a stale `swiftstrikesolutions.com` sender email
   shown in the admin settings UI (real sender is `info@envsetup.dev`).
8. `47bebb9` — Added `TESTING_ROADMAP.md` (6-phase plan: fix fake CI checks → unit tests
   → integration tests → E2E → perf budget → A/B testing deferred).
9. `1883e2b` — Roadmap Phase 1: made CI checks real (actual HTTP calls including an
   auth-gate regression test hitting `/api/admin/newsletters` unauthenticated and
   expecting 401, `npm audit --audit-level=high` gate, removed `|| true` masking).
10. `b03a681` — Security: `next` 15.5.9→15.5.20 (CVE fix), dropped `expo`/`react-native`,
    added `overrides` for `lodash`/`postcss`.
11. `beb53b7` — Roadmap Phase 2 (started): Vitest + 12 unit tests for `lib/auth.ts`.
12. `0de4a20` — **The big one**: `.npmrc` with `legacy-peer-deps=true`, fixing the
    7-week-long silent Vercel production deploy outage.
13. `48fbba8` — AI assistant rate limiting + conversation/message caps (DB migration
    script written but not yet applied to prod — see above).
14. `523dc3d` — Generator "Development Tools" now language-filtered and actually wired
    into the generated ZIP; added 7 more unit tests (19 total across `lib/auth.test.ts`
    + `lib/deployment-config.test.ts`).

## Still open / not yet decided
- Fix the AI assistant hallucination + inconsistent-fallback issues described above.
- `TESTING_ROADMAP.md` Phases 3-6: integration tests against a real test DB, Playwright
  E2E for generator/subscribe/admin flows, Lighthouse CI perf budget, A/B testing
  (intentionally deferred until there's an actual experiment to run).
- Payment/billing integration — no Stripe or any billing backend exists; Pricing page
  is Free-tier only, Pro/Team are "coming soon" routing to `/waitlist`. Not decided.
- End-user authentication system — none exists (only the admin password gate). Not decided.
- Domain strategy: user owns both `envsetup.dev` (community/free, already live app —
  keep as-is) and `envsetup.com` (intended commercial/paid side, currently just
  registered with no content/redirect). Tied to the billing decision above.
- An idea was discussed (not built): let the CLI detect a locally-installed AI CLI
  (e.g. Claude Code headless mode via `claude -p`) as an optional enhancement layer on
  top of the existing deterministic wizard, falling back through: local AI → hosted
  Groq/OpenAI (`cli/src/commands/ai.ts`, `app/api/ai-assistant`) → fully deterministic
  wizard. Not scoped into concrete implementation.

## Environment notes for whoever picks this up locally
- Local dev should NOT need any of Cowork's sandbox workarounds (stale git lock files,
  file-delete permission prompts, `node_modules/next` extraction corruption) — those
  were artifacts specific to that sandboxed environment's filesystem, not real project
  issues. A normal local machine or GitHub Actions runner won't hit them.
- `.env.example` lists all required env vars; note the newer `ADMIN_SESSION_SECRET`
  (falls back to `ADMIN_PASSWORD` if unset, but should be set separately in production).
- `npm install` needs `--legacy-peer-deps` OR just rely on the repo's `.npmrc` (already
  sets it globally for this project as of `0de4a20`).
