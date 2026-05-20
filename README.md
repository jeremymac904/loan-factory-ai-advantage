# Loan Factory AI Advantage

> Team Leader website builder for the Loan Factory **1+1+1=5** pilot program.

The AI Advantage platform lets a Loan Factory Team Leader (TL) build a branded, compliant, professional personal website in under ten minutes. Marketing reviews it, TERA installs the pixel and DNS, and the TL gets a shareable URL within one business day of approval.

This repo contains the pilot-stage Next.js application that powers that flow.

---

## Why this exists — the 1+1+1=5 pilot

Loan Factory's 1+1+1=5 program is the wholesale broker network's growth model:

- **1** strong national platform (Loan Factory, Inc. — NMLS #320841)
- **+1** professional Team Leader presence in every market
- **+1** centralized marketing, compliance, and tech support
- **= 5x** lead conversion, retention, and recruiting leverage

Most Team Leaders cannot produce a high-quality, compliant personal website on their own. Some never launch one. The TLs who do launch one usually look generic, off-brand, or non-compliant. **AI Advantage** removes that bottleneck — it gives every Team Leader the same professional surface area, while keeping Marketing in the loop on every published URL.

This pilot exists to prove the workflow with a small cohort of Team Leaders before expanding to the full network.

---

## Core routes

| Route | Purpose | Notes |
| --- | --- | --- |
| `/` | Marketing homepage for the AI Advantage platform itself — sells the workflow to Team Leaders. | Static. |
| `/builder` | 4-step intake form: Info → Story → Reviews → Preview. Generates a draft submission for Marketing. | Client component with live preview. |
| `/showcase` | Public directory of all published Team Leader sites. Filterable by language and specialty. | Static-first; reads from Supabase once wired. |
| `/site/[slug]` | **The money page.** Standalone published Team Leader site — headshot hero, bio, specialties, reviews, contact form, NMLS + Equal Housing Lender footer. | SSG via `generateStaticParams`. Uses its own minimal layout — no AI Advantage chrome. |
| `/admin` | Marketing approval dashboard. Filters by status, supports approve / revise / publish actions. | Client component; in-memory state during the demo phase. |

The `/site/[slug]` route is the actual product the borrower sees. Everything else exists to serve that page.

---

## Tech stack

- **Next.js 16.2.6** (App Router, Turbopack, route groups)
- **React 19.2**
- **TypeScript** (strict)
- **Tailwind CSS v4** with brand tokens (`lf-navy` `#003087`, `lf-gold` `#C8960C`)
- **lucide-react** for icons
- **clsx** + **tailwind-merge** for class composition
- **react-hook-form** + **zod** + **@hookform/resolvers** for validated forms
- **framer-motion** for step transitions
- **Supabase** (planned) — Postgres + RLS for Team Leader profiles, status, and approvals
- **GitHub Actions** for lint + build CI on every push and PR

> **Next.js 16 has breaking changes vs. older training data.** Dynamic route `params` are `Promise`s and must be awaited. See [AGENTS.md](./AGENTS.md) for agent rules.

---

## Local setup

```bash
# 1. Install
npm install

# 2. Copy env template
cp .env.example .env.local
# (Supabase values are optional during demo mode — see below.)

# 3. Dev server (Turbopack)
npm run dev

# 4. Lint + production build
npm run lint
npm run build
```

Open <http://localhost:3000>.

---

## Environment variables

All env vars are documented in [`.env.example`](./.env.example). Copy it to `.env.local` for local development.

| Variable | Required | Purpose |
| --- | --- | --- |
| `NEXT_PUBLIC_SUPABASE_URL` | Production only | Public Supabase project URL. |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Production only | Public anon key. Safe to ship to the browser — paired with Row Level Security. |
| `SUPABASE_SERVICE_ROLE_KEY` | Server-side only | Service role key. **Never** expose to the browser. Used by admin server routes to bypass RLS. |
| `NEXT_PUBLIC_APP_URL` | Recommended | Canonical app URL (e.g. `https://aiadvantage.loanfactory.com`). Used for absolute URLs in metadata and share links. |

Demo mode (no Supabase configured) is fully functional — see below.

---

## Supabase setup

The schema lives in [`supabase/schema.sql`](./supabase/schema.sql) and seed data in [`supabase/seed.sql`](./supabase/seed.sql). The plan for full schema evolution is in [`docs/SUPABASE_SCHEMA_PLAN.md`](./docs/SUPABASE_SCHEMA_PLAN.md).

Quick start:

```bash
# Option A: Supabase CLI (recommended)
supabase link --project-ref <your-project-ref>
supabase db push                              # apply schema.sql
psql "$SUPABASE_DB_URL" -f supabase/seed.sql  # load demo Team Leaders
```

```sql
-- Option B: Supabase SQL editor
-- Paste contents of supabase/schema.sql, then supabase/seed.sql
```

Row Level Security is **on** for the `team_leader_profiles` table:

- `published` rows are publicly readable.
- All other rows require `service_role`.
- Writes always go through service-role server routes — never directly from the browser.

---

## Demo mode limits

When no Supabase credentials are configured, the app runs in **demo mode** off the mock data in [`src/lib/mock-data.ts`](./src/lib/mock-data.ts). This is the current pilot state.

Demo mode means:

- The four published Team Leaders (Jeremy McDonald, Carlos Rivera, Mei Chen, Nguyen Van Duc) are hard-coded.
- `/builder` submissions are logged to the browser console and **not persisted**. The success screen is real, but nothing reaches Marketing.
- `/admin` approve / revise / publish actions live in React state only and reset on page reload. There is a visible **Reset demo** button.
- `/showcase` and `/site/[slug]` build statically from mock data at compile time.
- Contact-form submissions on `/site/[slug]` are **inert** — the button does nothing. A "Demo only — messages are not sent" disclaimer is shown.

These limits go away when [`docs/SUPABASE_SCHEMA_PLAN.md`](./docs/SUPABASE_SCHEMA_PLAN.md) is fully implemented.

---

## Roadmap

Full living roadmap in [`docs/ROADMAP.md`](./docs/ROADMAP.md). Pilot scope is locked in [`docs/PILOT_SCOPE.md`](./docs/PILOT_SCOPE.md).

The short version:

1. **Phase 0 — Foundation (now).** Hardened repo, CI, docs, demo flow that real Team Leaders can click through.
2. **Phase 1 — Persistence.** Wire Supabase. Builder writes drafts. Admin reads/writes status.
3. **Phase 2 — Marketing review loop.** Email notifications to Marketing on submission. Approval → publish flow with audit trail.
4. **Phase 3 — Pilot launch.** First cohort of Team Leaders (5–10) onboarded with real headshots, real bios, real NMLS data. TERA handles DNS and pixel install per site.
5. **Phase 4 — Network rollout.** Open to the full Team Leader network after pilot metrics clear.

---

## Deployment

The app is a standard Next.js 16 application and deploys cleanly to **Vercel**, **Netlify**, or any Node 20+ host.

Recommended: **Vercel**.

```bash
# Production checklist
npm run lint          # must pass
npm run build         # must produce a clean static build
```

Required platform env vars on the host:

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY` (server-only — mark as encrypted)
- `NEXT_PUBLIC_APP_URL`

DNS for production Team Leader sites is handled by TERA per the pilot agreement. Marketing controls the publish step — no Team Leader ships a site without Marketing approval.

---

## License & branding

Internal Loan Factory pilot. All Loan Factory branding (navy `#003087`, gold `#C8960C`, NMLS #320841, Equal Housing Lender mark) is **not optional** on public-facing pages. See [AGENTS.md](./AGENTS.md) for the full set of brand and compliance rules that apply to all contributors — human and AI.
