# EnvSetup.dev — Testing Plan

## Automated Tests (GitHub Actions)
Runs automatically on every `git push` to `main` + every day at 6 AM IST.

| Check | What it tests |
|-------|--------------|
| 🔷 TypeScript | `tsc --noEmit` — zero compile errors |
| 🏗️ Build | `next build` — production build succeeds |
| 🧪 API | generate-deployment, critical files exist |
| 🔐 Security | No hardcoded secrets in code |
| ⚡ CLI | CLI builds + doctor command runs |

---

## Daily Manual Checklist (before pushing)

### 1. Web App — Core Flow
- [ ] Homepage loads — Hero, Features, UseCases, CTA visible
- [ ] Generator form works end-to-end:
  - Select language + framework + packages → click Generate
  - Results page shows summary correctly
  - **Download ZIP button** → actual ZIP file downloads
  - ZIP contains: `Dockerfile`, `docker-compose.yml`, `.env.example`, `README.md`
- [ ] AI Assistant page loads + chat works (Groq responds)
- [ ] Templates page → click "Use Template" → Generator pre-fills correctly
- [ ] Pricing page loads, buttons link to `/contact` (not 404)
- [ ] Contact page loads

### 2. Navigation
- [ ] Header links work: Generator / AI Assistant / Templates / Pricing
- [ ] `npx @envsetup/cli` button links to npm
- [ ] Footer: GitHub link, npm link work
- [ ] Mobile menu opens/closes correctly

### 3. CLI
```bash
# Run these locally every day before pushing
cd cli
npm run build          # should succeed with 0 errors
node dist/index.js doctor   # should check Node, Docker, Git
```
- [ ] `envsetup doctor` — all checks run without crash
- [ ] `envsetup init` — interactive prompts show correctly
- [ ] Generated files created in output directory

### 4. Security (every push)
- [ ] No plain text passwords in any `.ts`/`.tsx` file
- [ ] `.env.local` is NOT committed (check `git status`)
- [ ] Admin route `/admin` not accessible without login

---

## Per-Day Checks (This Week)

| Day | Focus | Pass Criteria |
|-----|-------|--------------|
| Day 1 | Security + Merge | `tsc` errors < 10 after `npm install` |
| Day 2 | Landing Page | Homepage renders, all sections visible |
| Day 3 | Generator E2E | ZIP download works with real files |
| Day 4 | AI Assistant | Groq responds, config generated |
| Day 5 | DB + Email | Neon connected, newsletter signup works |
| Day 6 | CLI Polish | `npx @envsetup/cli init` works end-to-end |
| Day 7 | Go Live | Vercel deploy green, domain live |

---

## How to run TypeScript check locally
```bash
npm install          # first time / after package.json changes
npx tsc --noEmit     # should show 0 errors
npm run build        # full production build test
```

## Known Issues (to fix before Day 7)
- `@react-three/fiber` components (coming-soon-scene, animated-logos, computer-3d) — not used in main app, excluded from tsconfig
- `page-backup.tsx` — excluded from tsconfig, delete when git permits
- `embla-carousel-autoplay` — needed for presentation page (install locally)
