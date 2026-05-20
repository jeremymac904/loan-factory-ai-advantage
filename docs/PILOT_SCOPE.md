# Pilot scope

The 1+1+1=5 pilot has a deliberate, narrow scope. This document is the source of truth for **what is in** and **what is explicitly out**. If a request, ticket, or AI suggestion conflicts with this document, the document wins — push back and ask.

---

## In scope

### Product surface

- Marketing homepage at `/` that sells the AI Advantage workflow to Team Leaders.
- A self-serve `/builder` for a Team Leader to draft their site in under ten minutes.
- A `/showcase` directory of all currently published Team Leader sites.
- A standalone `/site/[slug]` published site per Team Leader with: hero (headshot, name, NMLS, tagline), about/bio, service areas, languages, specialties, reviews / social proof, contact form, NMLS + Equal Housing Lender footer.
- A `/admin` dashboard for Marketing to review, approve, request revisions, and publish.

### Data model

- A single `team_leader_profiles` table with the fields shown in `supabase/schema.sql`.
- An append-only `submission_events` audit log (Phase 1+).
- A `contact_submissions` table for leads from `/site/[slug]` (Phase 2+).

### People + process

- A small **pilot cohort** of 5–10 Team Leaders for the first launch.
- **Marketing** is the single gatekeeper for publishing. No site goes live without their explicit approval.
- **TERA** handles DNS, SSL, Meta pixel, and GA install per site.
- Loan Factory positions as a **wholesale broker network**. Team Leaders originate; loans submit to wholesale lender partners.

### Compliance baseline (mandatory on every public-facing page)

- Team Leader NMLS displayed prominently.
- Company NMLS `#320841` displayed in footer.
- Equal Housing Lender mark in footer.
- "Not a commitment to lend" disclaimer.
- State licensing list (or single state during pilot).

---

## Out of scope (pilot)

These will be revisited post-pilot. Adding any of them now requires:

1. An explicit Marketing sign-off.
2. A roadmap entry in [`ROADMAP.md`](./ROADMAP.md).
3. An AGENTS.md update if the new feature changes the agent guardrails.

### Borrower-facing flows

- Loan applications (full 1003, abbreviated, or otherwise).
- Pre-approval letter generation.
- Document upload / e-vault.
- E-sign or e-disclosure.
- Conditions tracking or status pages for in-flight loans.

### Rate / pricing display

- "Today's rates" widgets, rate alerts, or rate locks.
- LOS, AUS, or pricing engine integration (Optimal Blue, Polly, Mortech, etc.).
- Loan-specific monthly payment calculators tied to a Team Leader's actual pricing.

> Generic affordability sliders (income → max purchase price) are reviewable case-by-case but **default to deferred**.

### Correspondent or in-house funding language

- Loan Factory is positioned as a **wholesale broker** in this pilot.
- No "we fund loans," "non-delegated correspondent," "in-house underwriting," "our investors," or any phrasing that implies the company holds the loan beyond brokerage.
- Removing this restriction requires a legal review + Marketing sign-off, not just a developer judgment call.

### Recruiting

- A self-serve recruiting page is **out** of the pilot. There is no public CTA to "Join Loan Factory" on any page in this app.
- Recruiting is handled outside this product surface during the pilot.

### CRM / marketing automation

- No HubSpot, Salesforce, GHL, Mailchimp, etc. integration on any public page.
- Contact form submissions in Phase 2 land in Supabase and email — that is the full extent.

### Multi-tenant theming

- Every Team Leader site uses the same `modern-professional` template during the pilot. A second template is planned post-network (see ROADMAP Phase 4).
- Team Leaders cannot upload custom CSS, JS, or HTML. Headshot URL and bio text are the only freeform fields.

### Third-party widgets

- No live chat widgets (Intercom, Drift, etc.) on `/site/[slug]`.
- No social embeds (Facebook feed, Instagram grid, TikTok, etc.).
- No third-party review widgets — link out to Google / Zillow / Trustpilot instead.

### AI features

- The "AI" in "AI Advantage" refers to the platform helping Team Leaders bootstrap a site quickly — **not** an AI agent that talks to borrowers.
- No conversational AI on `/site/[slug]`.
- No AI-generated bios shown to the public without Marketing review (writing assistance during `/builder` drafting is fine if added later, but the final published bio is human-reviewed).

---

## How to handle in-scope requests that look like out-of-scope

Some requests will be ambiguous. Examples and the correct read:

| Request | In or out? | Why |
| --- | --- | --- |
| "Add a downloadable PDF of the Team Leader's bio." | **In**, low priority. | No borrower data, no compliance risk. Defer until Phase 3. |
| "Show today's average 30-year rate on every TL site." | **Out.** | Rate display — see deferred list. |
| "Add a 'request a pre-approval' button." | **Out.** | Pre-approval flow — see deferred list. The existing 'Get Pre-Approved' button on `/site/[slug]` is a contact-form anchor; it must not turn into a 1003 form. |
| "Add a generic affordability slider." | **Case-by-case.** | Allowed only with explicit Marketing sign-off and a clear "estimate only" disclaimer. |
| "Pull Team Leader social posts onto their site." | **Out.** | Social embeds — see deferred list. |
| "Wire the contact form to email the Team Leader." | **In, Phase 2.** | Core review-loop functionality. |
| "Add a recruiting page for new Loan Officers." | **Out.** | Recruiting flow — see deferred list. |

When in doubt, write the request down here, get Marketing on it, and update the table.
