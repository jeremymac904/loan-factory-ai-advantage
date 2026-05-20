# Claude Code Build Prompt For AI Advantage Agent Pack

Use this prompt in Claude Code from the repo root.

```text
You are working in:

/Users/JeremyMcDonald/Desktop/JEREMY’S MASTER BUILD FOLDER/Loan Factory AI Advantage

Project:
Loan Factory AI Advantage

Read these folders and files first:

README.md
AGENTS.md
CLAUDE.md
ASSETS.md
docs/ROADMAP.md
docs/PILOT_SCOPE.md
docs/SUPABASE_SCHEMA_PLAN.md
agents/
skills/
knowledge/
netlify/ENVIRONMENT_VARIABLES.md

Goal:
Wire the new agents, skills, and MiniMax provider plan into the repo without breaking the current Netlify prototype.

Do not rebuild the whole app.
Do not break existing routes.
Do not expose API keys.
Do not create fake MiniMax endpoints.
Do not guess MiniMax model IDs.
Do not build borrower workflows.
Do not add rate quote workflows.
Do not build inside TERA.

Tasks:

1. Add docs/AGENT_SYSTEM_PLAN.md summarizing how the agents and skills work together.

2. Add src/lib/agents/registry.ts with a simple static registry for the agent roles:
Chief Orchestrator
AI Twin Agent
UI UX Design Agent
Brand Compliance Agent
SEO GEO AEO Content Agent
Market Research Agent
Competitor Intelligence Agent
YouTube Research Agent
Content Strategy Agent
Template Architect Agent
MiniMax Multimodal Agent

3. Add src/lib/ai/types.ts defining shared AI request and response types.

4. Add src/lib/ai/provider.ts with a provider selection wrapper:
If AI_PROVIDER is minimax and AI_FEATURES_ENABLED is true, call the MiniMax service.
Otherwise return a clear demo response.

5. Add src/lib/ai/minimax.ts as a server side only placeholder integration.
Important:
Do not guess the real MiniMax endpoint or payload.
Add TODO comments that say to verify official MiniMax docs before wiring live calls.
Read process.env.MINIMAX_API_KEY only server side.
Never expose the key to client components.

6. Add src/app/api/ai/generate/route.ts.
It should accept a basic JSON request and return a demo response unless MiniMax is fully configured.
Keep the endpoint safe and simple.

7. Update .env.example with:
AI_PROVIDER
AI_FEATURES_ENABLED
MINIMAX_API_KEY
MINIMAX_BASE_URL
MINIMAX_TEXT_MODEL
MINIMAX_IMAGE_MODEL
MINIMAX_VIDEO_MODEL
AI_DRAFTS_REQUIRE_REVIEW
AI_IMAGE_GENERATION_ENABLED
AI_VIDEO_PROMPT_GENERATION_ENABLED
AI_DEBUG_LOGS

8. Update README.md with a short MiniMax and Agent System section.

9. Do not wire live generation into buttons yet unless the provider abstraction is stable and build passes.

10. Run:
npm run lint
npm run build

11. Fix all errors.

12. Commit and push with:
feat: add agent registry and minimax provider scaffold

Final report:
Files created
Files changed
Lint result
Build result
Commit hash
What is still demo
What environment variables Jeremy must add in Netlify
```
