# Netlify Environment Variables For AI Advantage

## Purpose

This file lists the variables needed to test AI Advantage with MiniMax and future provider routing.

## Add these in Netlify

Go to:

```text
Netlify project
Project configuration
Environment variables
Add a variable
```

## Required production variables

```text
AI_PROVIDER=minimax
AI_FEATURES_ENABLED=true
MINIMAX_API_KEY=your_key_here
MINIMAX_BASE_URL=verify_from_official_minimax_docs
MINIMAX_TEXT_MODEL=verify_from_official_minimax_docs
MINIMAX_IMAGE_MODEL=verify_from_official_minimax_docs
MINIMAX_VIDEO_MODEL=verify_from_official_minimax_docs
NEXT_PUBLIC_APP_URL=https://loan-factory-ai-advantage.netlify.app
```

## Optional variables

```text
AI_DRAFTS_REQUIRE_REVIEW=true
AI_IMAGE_GENERATION_ENABLED=false
AI_VIDEO_PROMPT_GENERATION_ENABLED=true
AI_DEBUG_LOGS=false
```

## Important secret rule

Never create a variable named:

```text
NEXT_PUBLIC_MINIMAX_API_KEY
```

Anything starting with NEXT_PUBLIC can be exposed to browser code in Next based apps. API keys must stay server side.

## Recommended deploy context setup

Production should use the real key when testing is approved.

Deploy Previews can use either a test key or AI_FEATURES_ENABLED=false.

Local development should use a local .env file that is never committed.

## Local .env example

```text
AI_PROVIDER=minimax
AI_FEATURES_ENABLED=false
MINIMAX_API_KEY=
MINIMAX_BASE_URL=
MINIMAX_TEXT_MODEL=
MINIMAX_IMAGE_MODEL=
MINIMAX_VIDEO_MODEL=
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

## Netlify safety notes

1. Store sensitive values in the Netlify UI, not in the repository.
2. Scope secrets to the functions or build contexts that need them when available.
3. Use different values for Production and Deploy Previews when possible.
4. Review audit logs after changes.
5. Redeploy after adding environment variables.
