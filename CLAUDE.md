# Claude Code — project orientation

This file is read first by Claude Code when working in this repo. The full ruleset for every AI agent (Claude included) is in [`AGENTS.md`](./AGENTS.md). Read that next.

@AGENTS.md

---

## What this project is

**Loan Factory AI Advantage** — the Team Leader website builder for Loan Factory's **1+1+1=5** pilot program. A Team Leader fills in a 4-step form, Marketing reviews the submission, TERA publishes it to a professional URL. The published page (`/site/[slug]`) is the actual product borrowers see — everything else is plumbing.

Pilot context, scope, and roadmap live in:

- [`README.md`](./README.md) — the canonical project overview
- [`docs/PILOT_SCOPE.md`](./docs/PILOT_SCOPE.md) — what is and is not in the pilot
- [`docs/ROADMAP.md`](./docs/ROADMAP.md) — phased delivery plan
- [`docs/SUPABASE_SCHEMA_PLAN.md`](./docs/SUPABASE_SCHEMA_PLAN.md) — the persistence work that ends demo mode

Always reread these when the user asks you to plan, scope, or extend the app.

---

## How this app is laid out

```
src/app/
  layout.tsx              # minimal root layout — html/body + Inter font only
  (main)/                 # marketing-app route group — has Header + Footer
    layout.tsx
    page.tsx              # /        — AI Advantage marketing home
    builder/page.tsx      # /builder — 4-step submission form
    showcase/page.tsx     # /showcase — public TL directory
    admin/page.tsx        # /admin   — Marketing approval dashboard
  site/[slug]/
    layout.tsx            # minimal — NO AI Advantage chrome
    page.tsx              # /site/[slug] — published Team Leader site (SSG)

src/components/           # Header, Footer (only used inside (main))
src/lib/
  mock-data.ts            # source of truth in demo mode
  types.ts                # TeamLeader, BuilderFormData, statuses
  utils.ts                # cn, tagline, status helpers
supabase/
  schema.sql              # planned persistence layer
  seed.sql                # matches mock-data.ts
docs/                     # ROADMAP, SUPABASE_SCHEMA_PLAN, PILOT_SCOPE
```

The route-group split is intentional: `/site/[slug]` must look like a real standalone mortgage advisor website with no AI Advantage tooling around it. Do not break this layout boundary.

---

## Development workflow

1. **Plan, then read, then write.** For anything beyond a trivial typo, sketch the change, read the affected file(s), and read the relevant Next.js doc under `node_modules/next/dist/docs/01-app/`. Next.js 16 has breaking changes your training data does not reflect (`params` is a `Promise`, route segment config keys have moved, etc.).
2. **Stay inside the existing route groups.** New marketing-app routes go under `src/app/(main)/`. New published-site variations go under `src/app/site/`.
3. **Demo mode is the default.** Until `docs/SUPABASE_SCHEMA_PLAN.md` is implemented, all data flows through `src/lib/mock-data.ts`. Do not introduce a partial Supabase integration that leaves the app in a broken half-state — wire it end-to-end or not at all.
4. **Verify before declaring done.**
   ```bash
   npm run lint
   npm run build
   ```
   Both must succeed cleanly. If a change is observable in the browser, take a preview screenshot.
5. **Commit messages** describe the *why*, not the *what*. Use conventional prefixes: `feat:`, `fix:`, `chore:`, `docs:`, `refactor:`. Do not invent scopes that do not match the work.
6. **Do not push to `main`** unless the user explicitly asks. Branches + PRs for anything non-trivial.

---

## The brand & compliance bar

This is a regulated-industry product. The guardrails are in [`AGENTS.md`](./AGENTS.md) §2 and §3. Quick version:

- Navy `#003087` and gold `#C8960C` are the only primary brand colors.
- Loan Factory operates as a **wholesale broker** in this pilot. No correspondent lending language.
- NMLS (individual + company `#320841`), Equal Housing Lender mark, and the "not a commitment to lend" disclaimer must appear on every public-facing page.
- Do not invent products, rates, guarantees, or borrower-specific data.
- Demo data stays clearly marked until persistence is real.

---

## When to ask vs. when to ship

**Ask first** when:
- The user is asking for something that touches loan products, rates, calculators, or borrower applications.
- The change would alter `/site/[slug]` chrome, footer disclosures, or brand presentation.
- A feature might violate the pilot scope in `docs/PILOT_SCOPE.md`.
- You would need to bypass lint/build to make something work.
- You are tempted to delete an entry from `mock-data.ts`.

**Ship without checking** when:
- The user has given you explicit, scoped instructions (like this hardening pass).
- It is a clear bug fix in the framework layer.
- It is a doc-only change.
- It is a CI/tooling improvement that does not change app behavior.

---

## Useful local commands

```bash
npm run dev      # Turbopack dev server on :3000 (or auto-picked free port in preview tooling)
npm run lint     # eslint via next lint config
npm run build    # production build — must pass before any commit that touched app code
```

The Claude Code preview tool launch config is in `.claude/launch.json` — the server is named `loan-factory`.
