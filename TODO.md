# envsetup.dev — Pending work

Last checked: 2026-08-27. Supersedes `SESSION_HANDOFF.md` (2026-07-10) — that file is now
stale in several places (see "Already done" below); safe to delete once you've skimmed it
for anything not captured here.

## MCP server — the biggest real gap

`/mcp-server` is a skeleton, not a shipped feature:

- [ ] Only 2 tools implemented (`get_project_status`, `propose_environment_fix`), both
      shallow — `propose_environment_fix` is a hardcoded keyword match (`if error.includes
      ("docker")`), not connected to the CLI's actual `doctor`/`recommendations` logic.
- [ ] Not published to npm under any name — nobody outside this repo can install/run it.
- [ ] No README — no instructions for adding it to Claude Desktop's or Claude Code's MCP
      config, so even someone with the source can't easily use it.
- [ ] Version pinned at `1.0.0` despite being unreleased — should start at `0.1.0` when
      it ships.
- [ ] `dist/` is stale (last built Jul 10) — needs a rebuild before anything else.
- [ ] Not wired into the CLI or web app anywhere — the README's roadmap entry links to it,
      but there's no way for a user coming from the CLI or site to discover it exists.

Decision needed before building further: what should this actually do that the CLI/web app
don't already cover? Candidates worth considering: let an agent *call* the generator
directly (skip the interactive prompts entirely — hand it a stack + options, get files
back), or read a project's existing config and suggest fixes using the same knowledge base
`/api/ai-assistant` already has (`lib/rag.ts`) instead of the current hardcoded keywords.

## Other pending / undecided (from the old handoff, verified against current code)

- [ ] **Payment/billing** — still nothing built. No Stripe or any billing backend in the
      code (confirmed — no `stripe` references anywhere). Pricing page is Free-tier only;
      Pro/Team routes to `/waitlist`. `/admin/subscribers` now tracks real plan interest
      (fixed a bug where it wasn't), so there's actual signal to look at before deciding
      whether/when to build this.
- [ ] **`envsetup.com` domain strategy** — registered, no content or redirect, intended as
      a possible future commercial/paid counterpart to the free `envsetup.dev`. Tied to
      the billing decision above; not decided.
- [ ] **Optional local-AI-CLI enhancement idea** — let the CLI detect a locally-installed
      AI CLI (e.g. `claude -p`) as an optional smarter layer on top of the deterministic
      wizard, falling back: local AI → hosted Groq (`cli/src/commands/ai.ts`) →
      deterministic wizard. Discussed once, never scoped. Low priority.
- [ ] **A/B testing / experimentation infra** — intentionally not built. Correctly waiting
      until there's an actual experiment to run (e.g. once a real pricing page exists) —
      not a gap, just don't build it speculatively before then.

## Already done (the old handoff said these were open — they're not anymore)

- ~~AI assistant hallucinations~~ — fixed (`c8fa8c9`): deduped the knowledge base (was
  6x duplicated per row), fixed RAG search to use OR instead of AND for compound
  multi-technology queries, strengthened the system prompt, unified the no-LLM fallback
  message.
- ~~No end-user authentication~~ — not true anymore. Optional "Sign in with GitHub" exists
  (`lib/next-auth-options.ts`) with incremental OAuth consent — profile-only by default,
  asks for `repo` scope separately only when someone clicks Push to GitHub. Perks: `/history`
  + a higher rate limit. Separate from the admin login on purpose.
- ~~Testing Roadmap Phases 1–5~~ — all shipped: CI checks are real (actual HTTP calls, not
  file-existence checks), unit tests exist for auth/deployment-config/rag/generator-form,
  DB integration tests run against an ephemeral Neon branch per CI run, Playwright E2E
  covers admin-auth/ai-assistant/feedback-widget/generator/waitlist, and Lighthouse CI runs
  as its own workflow with a real perf budget. Only Phase 6 (A/B testing) remains, and
  that's the intentionally-deferred one above, not a gap.
