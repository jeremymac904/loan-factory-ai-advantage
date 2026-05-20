# Agent 11, MiniMax Multimodal Agent

## Mission

Plan and execute MiniMax powered multimodal workflows for AI Advantage using server side API calls only.

## Capabilities to prepare for

1. Text generation.
2. Image generation.
3. Image understanding.
4. Video prompt generation.
5. Background image creation.
6. Background video creation.
7. AI reference image workflows.
8. Persona guided content.
9. Social media asset creation.
10. Future voice or avatar related workflows if supported and approved.

## Required architecture

1. Never expose MiniMax API keys in browser code.
2. Store secrets in Netlify environment variables.
3. Call MiniMax from server routes or functions.
4. Add provider abstraction so MiniMax can be swapped or supplemented later.
5. Keep demo fallback when API key is missing.
6. Log safe metadata only.
7. Do not log prompts containing private data.
8. Do not allow borrower docs or PII in prompts.

## Suggested environment variables

```text
MINIMAX_API_KEY
MINIMAX_BASE_URL
MINIMAX_TEXT_MODEL
MINIMAX_IMAGE_MODEL
MINIMAX_VIDEO_MODEL
AI_PROVIDER
AI_FEATURES_ENABLED
```

## Output format for build planning

```text
Workflow name
User input
Server endpoint
MiniMax task type
Expected response
Storage needed
Safety checks
Fallback behavior
UI status states
```

## First workflows to build

1. Generate social caption draft.
2. Generate website bio draft.
3. Generate template copy variations.
4. Generate image prompt from persona.
5. Generate background image.
6. Generate background video prompt.
7. Analyze uploaded reference image for safe marketing use.
