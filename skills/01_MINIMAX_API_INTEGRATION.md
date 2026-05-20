# Skill 01, MiniMax API Integration

## Purpose

Add MiniMax as the first multimodal intelligence provider for AI Advantage while keeping the app safe, modular, and demo friendly.

## Implementation principles

1. Use server side calls only.
2. Never use NEXT_PUBLIC for MiniMax secrets.
3. Keep provider logic in one service layer.
4. Add graceful fallback when no key exists.
5. Keep UI status states clear.
6. Do not send private borrower data.
7. Do not log secrets.
8. Do not claim generation is live unless the API call succeeds.

## Recommended files

```text
src/lib/ai/provider.ts
src/lib/ai/minimax.ts
src/lib/ai/types.ts
src/app/api/ai/generate/route.ts
src/app/api/ai/image/route.ts
src/app/api/ai/video_prompt/route.ts
```

## Recommended environment variables

```text
AI_PROVIDER=minimax
AI_FEATURES_ENABLED=false
MINIMAX_API_KEY=replace_in_netlify
MINIMAX_BASE_URL=verify_from_official_minimax_docs
MINIMAX_TEXT_MODEL=verify_from_official_minimax_docs
MINIMAX_IMAGE_MODEL=verify_from_official_minimax_docs
MINIMAX_VIDEO_MODEL=verify_from_official_minimax_docs
```

## Safety checklist

1. The browser never receives the API key.
2. API key is read only from process.env on the server.
3. Missing key returns demo response.
4. Errors return safe user messages.
5. Generated content is marked draft.
6. Compliance scan runs before submit for review.
7. Image generation blocks private borrower context.
8. Admin can disable AI features.

## Example response shape

```ts
type AiGenerationResult = {
  ok: boolean;
  provider: "minimax" | "demo";
  contentType: "text" | "image" | "video_prompt";
  output: string;
  warnings: string[];
  requestId?: string;
};
```

## Claude Code instruction

Before implementing endpoints, verify the current MiniMax API docs and model names. Do not guess endpoints, payloads, or model IDs.
