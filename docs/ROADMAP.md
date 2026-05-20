# Roadmap

Living document. Update as phases ship. Keep dates relative ("this quarter," "next sprint") — calendar dates rot fast.

---

## Phase 0 — Foundation (in progress)

Goal: a repo and demo flow that Marketing and the first pilot cohort can credibly click through.

- [x] Next.js 16 scaffold (App Router, Turbopack, Tailwind v4, TS strict)
- [x] Five core routes: `/`, `/builder`, `/showcase`, `/site/[slug]`, `/admin`
- [x] Route groups: `(main)/` for app chrome, `site/[slug]` standalone
- [x] Mock data with four published Team Leaders + admin demo entries
- [x] Brand tokens (`lf-navy`, `lf-gold`), Equal Housing Lender mark, NMLS in footers
- [x] Hardened repo foundation: README, AGENTS.md, CLAUDE.md, .env.example, docs/, CI
- [ ] Pilot-cohort kickoff doc + Marketing review SLA written down

Exit criteria: a Team Leader can run through `/builder`, see a realistic preview, and the success screen feels like a real handoff to Marketing — even though nothing persists yet.

---

## Phase 1 — Persistence

Goal: end demo mode. Submissions and approvals are real Supabase rows.

- [ ] Apply `supabase/schema.sql` to the pilot project
- [ ] Seed the four published Team Leaders from `supabase/seed.sql`
- [ ] Server action: `/builder` submit → `insert ... returning slug` with `status='pending_review'`
- [ ] Server route: `/admin` reads via service role; approve / revise / publish mutate the row
- [ ] `/showcase` and `/site/[slug]` switch from `mock-data.ts` to Supabase reads (RLS-gated to `status='published'`)
- [ ] Feature flag the cutover so we can flip back to mock data if needed
- [ ] Remove "Demo Mode" pill and "Demo only" disclaimers from pages that are now real

Exit criteria: a real submission survives a server restart and shows up in `/admin` with a working approve button.

---

## Phase 2 — Marketing review loop

Goal: the human review step has real teeth.

- [ ] Email notification to Marketing when a submission lands (`pending_review`)
- [ ] Email notification to the Team Leader on approval, revise-request, and publish
- [ ] Audit trail: who approved, when, with what notes — stored on the row
- [ ] Lightweight Marketing-only login (Supabase auth or shared admin secret) on `/admin`
- [ ] Slug uniqueness + collision handling on submit
- [ ] Image hosting for real headshots (Supabase Storage bucket, signed URLs)
- [ ] Contact form on `/site/[slug]` routes to the Team Leader's email (and/or CRM) with bot protection

Exit criteria: Marketing can run the full approval loop without any developer in the room.

---

## Phase 3 — Pilot launch

Goal: 5–10 real Team Leaders live with their own URLs.

- [ ] Onboarding worksheet for the first cohort (real NMLS, real bio, real headshot)
- [ ] TERA workflow doc: DNS, Meta pixel, GA, SSL per site
- [ ] Site preview link sharing (`/site/[slug]?preview=token` before DNS cutover)
- [ ] Pilot metrics dashboard (basic): submissions per week, time-to-approval, live sites
- [ ] Post-launch retro doc template

Exit criteria: 5+ Team Leaders published, none requiring developer intervention to ship.

---

## Phase 4 — Network rollout

Goal: open the platform to the full Loan Factory Team Leader network.

- [ ] Self-serve recruiting page (separate from `/builder`) with the value prop
- [ ] Multi-state license display per Team Leader
- [ ] Site analytics surfaced back to each Team Leader (page views, contact submissions)
- [ ] Optional second template (clean photography-first, vs. current modern-professional)
- [ ] Quarterly compliance recheck workflow (auto-flag sites with stale NMLS or expired licenses)

Exit criteria: any approved Team Leader in the Loan Factory network can self-serve a site without the pilot bottleneck.

---

## Explicitly deferred (post-network)

Documented here so they do not creep into earlier phases:

- Borrower application flows / pre-approval
- Rate display
- LOS / AUS integrations
- E-sign / e-disclosure
- Live chat or AI conversational assistant on TL sites
- Recruiting CRM beyond the basic value-prop page

See [`PILOT_SCOPE.md`](./PILOT_SCOPE.md) for the full guardrails.
