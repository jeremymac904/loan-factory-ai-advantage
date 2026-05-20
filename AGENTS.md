# Agent rules for Loan Factory AI Advantage

These rules apply to **every AI coding agent** working in this repository (Claude Code, Cursor, Copilot, Codex, etc.). They also apply to human contributors. Treat them as non-negotiable for the duration of the 1+1+1=5 pilot.

If a rule conflicts with a user request, **flag the conflict and ask** — do not silently violate it.

---

## 1. Framework rules

<!-- BEGIN:nextjs-agent-rules -->
### This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

Specific Next.js 16 conventions used in this repo:

- **`params` is a Promise.** Dynamic-route page and metadata functions must `await params` (or `use(params)` in a client component).
- **Route groups.** The main app chrome lives in `src/app/(main)/`. The standalone published Team Leader site lives at `src/app/site/[slug]/` with its own minimal `layout.tsx` and inherits **only** the root layout. Do not put the marketing Header/Footer on `/site/[slug]`.
- **Config is `.mjs`.** `next.config.mjs` — not `.ts`, not `.js`. Do not reintroduce `next.config.ts` without testing the build.
- **Turbopack root** is set explicitly in `next.config.mjs` to silence the multiple-lockfile warning. Keep it.

When in doubt, read `node_modules/next/dist/docs/01-app/` before changing framework code.

---

## 2. Loan Factory brand rules

These apply to anything visible on a public-facing page (`/`, `/showcase`, `/site/[slug]`) and to all marketing copy.

- **Brand colors are mandatory.** Navy `#003087` and gold `#C8960C` are the only primary brand colors. Tailwind tokens `lf-navy` / `lf-gold` exist for this. Do not introduce competing primary colors.
- **Logo treatment.** "Loan Factory" wordmark in navy. "AI Advantage" subline in gold uppercase tracking-widest. Never alter the wordmark, recolor it, or stylize it as anything other than these two faces.
- **Typography is Inter.** Loaded via `next/font/google` in the root layout. Do not swap.
- **Equal Housing Lender mark** must appear in the footer of every public-facing page. The SVG mark on `/site/[slug]` is the canonical rendering — do not delete it or replace it with raster.
- **Company NMLS #320841** must appear on every public-facing page. Individual Team Leader NMLS must appear on their own `/site/[slug]` in both the hero/utility bar and the footer.

---

## 3. Compliance rules

Mortgage lending is a regulated industry. These are not stylistic preferences.

- **Do not invent fake Loan Factory policies, products, rates, or guarantees.** If a feature is not in [`docs/PILOT_SCOPE.md`](./docs/PILOT_SCOPE.md) or already in the codebase, ask before adding it.
- **Do not add correspondent lending language.** Loan Factory operates as a **wholesale broker** in this pilot. Words like "correspondent," "we fund loans," "our investors," "in-house underwriting," "non-delegated correspondent," etc. are prohibited.
- **Use wholesale broker positioning only.** Loan Factory provides wholesale pricing and program access. Team Leaders originate. Loans are submitted to wholesale lender partners. Phrasing like "wholesale platform," "broker network," "wholesale rates," "lender partners" is correct.
- **Mortgage compliance must be visible on public-facing pages.** Every `/site/[slug]` and `/` must show: Team Leader NMLS, company NMLS #320841, Equal Housing Lender mark, the "not a commitment to lend" disclaimer, and licensing state. Do not remove, hide behind a click, or shrink any of these below readable.
- **Do not publish borrower or loan-specific data.** No real loan numbers, no real borrower names, no DTI / FICO / loan-amount specifics in marketing copy. Sample testimonials use first names + last initial only. If a real testimonial is added later, it must be reviewed by Marketing before commit.
- **Pre-approval letters, rate sheets, and loan estimates are out of scope** for this app. Do not add features that produce them.

---

## 4. Demo data rules

The app is in demo mode until Supabase persistence is wired (see [`docs/SUPABASE_SCHEMA_PLAN.md`](./docs/SUPABASE_SCHEMA_PLAN.md)).

- **Keep demo data clearly marked.** The `/admin` page must display its "Demo Mode" pill until the app reads from Supabase. The `/site/[slug]` contact form must show its "Demo only — messages are not sent" disclaimer until the form is wired.
- **The four published Team Leaders** in `src/lib/mock-data.ts` are: Jeremy McDonald (NMLS #1195266), Carlos Rivera (NMLS #1234567), Mei Chen (NMLS #2345678), Nguyen Van Duc (NMLS #3456789). Additional `pending_review` and `draft` entries exist to demo the admin flow. Do not delete these. Edits to NMLS numbers or names require explicit user approval.
- **Do not replace mock data with real Team Leader PII** until Marketing has signed off on each profile.
- **Headshot URLs in mock data point to Unsplash.** This is intentional — they are placeholder portraits with permissive licensing. Replace with real headshots only when the real Team Leader is being onboarded for production.

---

## 5. UI rules

- **Do not change the app UI on a foundation-hardening, doc-only, or CI task unless required to fix a build.** UI changes need a separate intent.
- **The `/site/[slug]` page is the money page.** It must look like a real, professional, standalone mortgage advisor website — not like an AI Advantage demo. Do not add AI Advantage Header/Footer, build-tooling badges, or "powered by" chrome above the fold. A subtle "Site built with Loan Factory AI Advantage" link in the deep footer is OK.
- **Accessibility floor.** All buttons must have accessible labels. All images must have meaningful `alt` text. Hero portraits use the Team Leader's full name as alt. Do not use color-only state indicators.
- **Mobile-first.** Every public-facing page must be usable on a 375px viewport.

---

## 6. Workflow rules

- **Read before writing.** Before editing any framework-level file (`next.config.mjs`, `src/app/layout.tsx`, route layouts, `tsconfig.json`, `eslint.config.mjs`), read it first and read the relevant Next.js doc under `node_modules/next/dist/docs/`.
- **Run lint and build before final handoff.** Any agent ending a task that touched application code must:
  ```bash
  npm run lint
  npm run build
  ```
  Both must succeed cleanly. Fix all TypeScript errors. Do not silence errors with `// @ts-ignore` or `any` without explicit user approval.
- **Do not commit `.env.local`.** Only `.env.example` belongs in version control.
- **Do not commit `node_modules/`, `.next/`, or build artifacts.**
- **Verify by preview when possible.** If the change is observable in a browser, take a screenshot via the preview tooling before declaring it done.
- **Use the existing route group structure.** New marketing-app routes go under `src/app/(main)/`. New published-site variations belong under `src/app/site/`. Do not create top-level routes that bypass either group without a documented reason.

---

## 7. Out of scope for the pilot

These exist as guardrails. Adding any of them requires a roadmap update and Marketing sign-off:

- Borrower-facing application flows (loan application, pre-approval, document upload).
- Rate display, rate quotes, rate alerts, or any "today's rates" widget.
- Loan calculators that produce specific monthly payments tied to a Team Leader (generic affordability sliders are OK if reviewed).
- Integration with LOS, AUS, or pricing engines.
- Real-time chat or AI-assisted borrower conversations on `/site/[slug]`.
- E-signature or e-disclosure flows.
- Recruiting / loan officer onboarding flows beyond what's in the builder.

When in doubt — ask before building.

---

## 8. Quick reference

```
Brand              navy #003087   gold #C8960C
Company NMLS       #320841
Equal Housing      required on every public page
Framework          Next.js 16.2.6 (App Router, Turbopack)
Params             Promise<...> — must be awaited
Route groups       (main)/ for app chrome · site/ for published TL sites
Config file        next.config.mjs (not .ts)
Demo mode          mock-data.ts — persists nothing
Lint + build       must pass before any commit
```
