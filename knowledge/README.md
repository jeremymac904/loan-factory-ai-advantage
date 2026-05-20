# `knowledge/` — reference documents for agents

Reference material the agent system can attach to prompts: marketing policy excerpts, persona summaries, brand voice docs, state-specific compliance notes, and similar long-lived context.

Tracked in git. Treat as internal but versioned.

## What belongs here

- **Marketing policy excerpts** — short, agent-readable summaries of the Loan Factory Marketing & Advertising Policy. The full policy lives in `assets/knowledge/` (which is also tracked) and in Marketing's Drive.
- **Persona docs** — brand voice and tone documents for individual Team Leaders.
- **State-specific compliance notes** — concise reference cards for NJ, RI, MA, TX, AZ (and any future states added in `LoState` in `src/lib/platform-types.ts`).
- **Glossaries** — wholesale-broker terminology, allowed phrasing, prohibited phrasing.

## What does NOT belong here

- Borrower data, loan files, PII, or non-public personal information.
- Production secrets, API keys, tokens.
- Heavy raw source files (`.psd`, `.ai`, `.sketch`, `.zip`, raw video) — those belong in `assets/brand_guide/` or `assets/video_source/` per `ASSETS.md`.
- Anything Marketing has not approved for agent consumption.

## How knowledge will be loaded (Phase 1)

Today the provider does not read knowledge files. In Phase 1, `provider.generate()` will attach matching knowledge by:

1. Looking up the requesting agent in `src/lib/agents/registry.ts`.
2. Filtering knowledge files by frontmatter tags (`agent:` and `topic:`).
3. Splicing short excerpts into the system prompt — not full documents.

Until then, treat these files as the canonical human-readable reference the team and reviewers consult.

## Frontmatter convention

```markdown
---
title: <Short title>
topic: marketing-policy | brand-voice | state-compliance | glossary
agent: any | <agent role id>
state: any | NJ | RI | MA | TX | AZ | …
status: draft | active
---

# <Title>

Body content. Keep each file under ~1000 words. Split if longer.
```

## Cross-references

- `AGENTS.md` (repo root) — the non-negotiable agent rule set.
- `ASSETS.md` — what lives where (public vs internal vs Claude tooling).
- `docs/AGENT_SYSTEM_PLAN.md` — how agents, skills, and knowledge work together.
- `docs/PILOT_SCOPE.md` — what is and is not in the 1+1+1=5 pilot.
