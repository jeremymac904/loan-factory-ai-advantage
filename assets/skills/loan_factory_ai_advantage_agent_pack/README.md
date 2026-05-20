# Loan Factory AI Advantage Agent And Skills Pack

## Purpose

This pack gives Claude Code, Codex, Cursor, or another coding agent a clean set of project agents and reusable skills for building the Loan Factory AI Advantage platform.

The platform is a Team Leader marketing workspace for the 1 plus 1 plus 1 equals 5 pilot. It should support team profile setup, website and landing page templates, content creation, compliance checks, shared team assets, marketing review, and future multimodal AI workflows.

## Source context used

1. Current project folder structure from the screenshot.
2. The uploaded AI Boardroom document.
3. Current app direction, which is an ALLY aligned platform with future TERA integration.
4. Jeremy McDonald and Legends Mortgage Team brand direction.
5. Loan Factory broker first, marketing first, compliance aware positioning.

## Core AI Boardroom lenses

1. MrBeast: Scale, Reinvestment, Audience Obsession
2. Gary Vaynerchuk: Speed, Platform, Macro Patience
3. Alex Hormozi: Offer Engineering, Value Density, Conversion Logic
4. Ali Abdaal: Systems, Evidence-Based Productivity, Calm Authority
5. Justin Welsh: Simplicity, Solopreneur Focus, Sustainable Growth
6. Codie Sanchez: Contrarian Investing, Boring Business, Cash Flow
7. Steven Bartlett: Brand Psychology, Founder Story, Emotional Depth
8. Seth Godin: Remarkable Ideas, Tribe Building, Permission Marketing
9. Naval Ravikant: Leverage, Equity, First Principles
10. Tony Robbins: Peak State, Human Needs, Massive Action
11. David Goggins: Mental Toughness, No Excuses, Callusing the Mind
12. Andrew Bustamante: Intelligence, Influence, Human Behavior
13. Jordan Peterson: Meaning, Responsibility, Archetypal Structure
14. Layne Norton: Evidence, Anti-Bullshit, Long-Term Consistency
15. Rory Sutherland: Behavioral Economics, Irrational Value, Reframing
16. Sam Parr: Media Business, Operator Thinking, Hustle Intelligence
17. Dickie Bush: Writing Systems, Audience Building, Ship30
18. Dan Koe: Digital Economics, One-Person Business, Philosophy
19. Ryan Holiday: Stoicism, Strategy, Ego Suppression
20. Chris Williamson: Modern Masculinity, Long-Form Depth, Social Reality

## How to install this pack locally

Copy these folders into the local repo root:

```text
agents
skills
knowledge
prompts
netlify
```

Recommended final repo locations:

```text
agents/                      project agent personas and operating roles
skills/                      reusable skill instructions
knowledge/                   source grounded reference notes
.claude/skills/              deploy ready Claude Code skills
.claude/commands/            optional Claude slash commands
```

## Recommended next move

Give Claude Code the prompt in:

```text
prompts/CLAUDE_CODE_BUILD_PROMPT.md
```

Tell it to read this pack first, then add the agent registry, MiniMax environment variable plan, and AI service abstraction without breaking the current Netlify demo.

## Hard platform rules

1. AI Advantage aligns with the ALLY stack direction.
2. The current Netlify app is a working prototype.
3. Production direction is React frontend, Python API, PostgreSQL, Loan Factory SSO, GKE, GitHub, and Claude Code workflow.
4. TERA is separate. Integrate through approved future APIs or adapter services only.
5. Do not build borrower LOS workflows.
6. Do not build rate quoting, AUS, pricing, or CRM functions into this marketing platform.
7. Do not expose API keys to the browser.
8. MiniMax API calls must happen server side.
9. Keep demo mode visible until live auth and persistence exist.
10. Compliance checks are guardrails, not legal approval.
