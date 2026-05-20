# Agent System Plan

How the AI Advantage agent registry, skills, knowledge files, and the MiniMax provider scaffold fit together during the 1+1+1=5 pilot.

This is a **plan** — most of it is not wired yet. Demo mode is the default. Nothing in this document changes the rule that Marketing reviews every public asset before publish.

---

## What exists today

| Piece | Where | What it does |
| --- | --- | --- |
| Agent registry | `src/lib/agents/registry.ts` | Static, in-memory list of the 11 agent roles + helpers. No DB, no orchestration framework yet. |
| AI types | `src/lib/ai/types.ts` | Shared `AiRequest` / `AiResponse` shapes and feature-flag struct. |
| Provider wrapper | `src/lib/ai/provider.ts` | Server-only. Reads env, runs scope checks, dispatches to demo or MiniMax. |
| MiniMax placeholder | `src/lib/ai/minimax.ts` | Server-only. Never makes a real network call until the TODO checklist inside it is resolved. |
| API route | `src/app/api/ai/generate/route.ts` | `POST /api/ai/generate`. Validates input, calls the provider, returns a typed response. |
| Compliance helpers | `src/lib/compliance-rules.ts` | Already shipped. Flags NMLS/APR/state-specific risk before the user can submit. |
| Skills folder | `skills/` (repo root) | Markdown skill files that humans and tooling read for context. Tracked. |
| Knowledge folder | `knowledge/` (repo root) | Reference docs (marketing policy excerpts, persona notes, etc.). Tracked. |
| Netlify env doc | `netlify/ENVIRONMENT_VARIABLES.md` | One-pager of what to paste into Netlify before flipping live. |

Nothing above wires live generation into a UI button. That's deliberate.

---

## The 11 agents

The registry is the canonical list. Quick map of *who is responsible for what*:

| Agent | Owns |
| --- | --- |
| **Chief Orchestrator** | Routes a request to the smallest set of specialist agents and assembles their output. Never produces final copy. |
| **AI Twin Agent** | First-draft text in the Team Leader's own voice. Reads persona doc + brand voice doc. Always wholesale-broker positioning. |
| **UI/UX Design Agent** | Layout / token / component suggestions that stay inside the Loan Factory brand system. |
| **Brand & Compliance Agent** | Runs `runComplianceCheck` and surfaces blocking findings before Marketing sees the draft. |
| **SEO / GEO / AEO Content Agent** | Headlines, H2/H3 structure, local geo cues, answer-engine snippets. |
| **Market Research Agent** | Audience + pain-point + objection briefs. Flags low-confidence claims. |
| **Competitor Intelligence Agent** | Honest competitor positioning summaries. Never lifts copy. |
| **YouTube Research Agent** | Public video hooks / formats / themes — metadata only, no transcription of protected content. |
| **Content Strategy Agent** | Turns research into a weekly / monthly calendar tied to Marketing review SLAs. |
| **Template Architect Agent** | Designs and refactors builder templates. |
| **MiniMax Multimodal Agent** | The **only** agent allowed to call MiniMax. Text, image-prompt, and video-prompt generation. Gated behind feature flags. |

The registry exposes:

- `listAgents()` — sorted by priority.
- `listPublicFacingAgents()` — agents whose output reaches the public.
- `requiresMarketingReview(id)` — boolean, defaults to `true` when unknown.

---

## Request flow

```
client / server action
        │
        ▼
POST /api/ai/generate     ← validates shape, length, allowed task & agent
        │
        ▼
provider.generate(req)    ← scope filter (no PII, no rate quotes)
        │
        ├── flags.enabled === false ────────► demoResponse(...)
        ├── flags.provider !== 'minimax' ───► demoResponse(...)
        ├── isMinimaxConfigured() === false ► demoResponse(...)
        ├── task gated off by feature flag ─► demoResponse(...)
        │
        ▼
generateWithMinimax(req, flags)
        │
        └── currently returns a *placeholder* "MiniMax stub" response
            because the live-wiring TODO checklist in minimax.ts has not
            been resolved.
```

Every path returns a typed `AiResponse`. When `draftsRequireReview === true` (the default), the response carries `requiresMarketingReview: true` so the Content Studio and Admin queues know not to publish.

---

## Skills, knowledge, and the registry — who reads what

- **`agents/`** — human-readable "boardroom" persona docs (research material). Not loaded by code today; available for an editor or a human reviewer to consult.
- **`skills/`** — Markdown skill files describing how an agent should behave on specific tasks (e.g. "draft a Spanish-language VA reel"). Pattern matches how Claude Code's skill system works locally. Phase 1 may load them at request time to bias the prompt for a given agent.
- **`knowledge/`** — Reference docs (Marketing Policy excerpts, persona summaries, brand voice docs). Surfaced to agents that need them. Same Phase 1 plan as `skills/`.
- **`src/lib/agents/registry.ts`** — The canonical role list. Code reads this; the other folders are content the code can attach.

The pattern: **registry decides *who* answers, skills decide *how* they answer, knowledge decides *what* they know.**

---

## Going live with MiniMax

`src/lib/ai/minimax.ts` contains a `TODO(minimax-live-wiring)` checklist. Until every item there is checked, the provider returns a placeholder instead of a real call. The required pre-flight:

1. Read the current official MiniMax API reference. Capture endpoints, payloads, auth, rate limits.
2. Confirm `MINIMAX_TEXT_MODEL` / `MINIMAX_IMAGE_MODEL` / `MINIMAX_VIDEO_MODEL` are real IDs on the Loan Factory MiniMax account.
3. Implement a `fetchMinimax` helper that times out, never logs the key, and surfaces clean errors.
4. Add server-side rate limiting per IP and per user.
5. Add error reporting; never include the API key.
6. Marketing & IT explicitly approve flipping `AI_FEATURES_ENABLED=true` and `AI_PROVIDER=minimax` in Netlify.
7. Roll out: pilot Team Leaders only, with `AI_DRAFTS_REQUIRE_REVIEW=true` non-negotiable.

---

## Out of scope

The agent system does NOT touch:

- Borrower data, loan files, applications, IDs, paystubs, statements.
- LOS, AUS, pricing engines, CRM.
- Rate quotes, rate locks, rate alerts.
- Outbound publishing (Meta, LinkedIn, TikTok APIs, email send).

If a future request would need any of the above, it stops at the request-validator inside `src/app/api/ai/generate/route.ts` or the `rejectIfOutOfScope` check inside `provider.ts` — both return a typed `error` response before any provider is reached.
