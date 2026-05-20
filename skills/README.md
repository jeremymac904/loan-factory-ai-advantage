# `skills/` — agent skill files

Markdown files that describe how an agent in `src/lib/agents/registry.ts` should behave on a specific task.

Pattern: one skill per file, named with a short kebab-case identifier matching the task it solves. Skills are tracked in git so the whole team gets the same agent behavior when they pull the repo.

## What a skill file looks like

```markdown
---
title: <Short verb-phrase title>
agent: <agent role id from registry.ts>
task: <AiTaskKind from src/lib/ai/types.ts>
status: draft | active
---

# <Title>

## When to use
…what user request this skill answers, in plain language.

## Inputs the agent needs
- ...
- ...

## How to respond
- Step-by-step instructions for the model.
- Output format the agent must produce.

## Guardrails
- No borrower data.
- No correspondent lending language.
- Always wholesale-broker positioning.
- Always include compliance footer when output is public-facing.
```

## How skills will be loaded (Phase 1)

Today the provider does not read skill files. In Phase 1, `provider.generate()` will attach the matching skill markdown to the system prompt when:

1. `req.agent` is set.
2. A skill file in this folder has matching `agent:` + `task:` frontmatter.

Until then, treat these files as the human-readable behavior contract for each agent. The code in `src/lib/agents/registry.ts` already mirrors the role definitions.

## Where to put drafts

- Drafts (not yet ready for daily use) → `assets/skills/`
- Deploy-ready, code-loaded skills → this folder (`skills/`)

This mirrors the split in `ASSETS.md` between internal source files and runtime-tracked content.

## Hard rules

- No borrower data, loan files, PII, or non-public personal information.
- No live rate quotes, rate locks, or rate guarantees.
- No correspondent / direct-lender language.
- Every public-facing skill output must default to "requires Marketing review."

See [`docs/AGENT_SYSTEM_PLAN.md`](../docs/AGENT_SYSTEM_PLAN.md) for the full agent system, and [`AGENTS.md`](../AGENTS.md) at the repo root for non-negotiable agent rules.
