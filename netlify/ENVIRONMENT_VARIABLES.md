# Netlify environment variables

What Jeremy (or any deployer) needs to paste into the **Netlify site settings → Environment variables** panel before the AI Advantage prototype can run beyond demo mode.

> **Two rules that cannot be broken:**
>
> 1. **Never** add `NEXT_PUBLIC_MINIMAX_API_KEY`. A `NEXT_PUBLIC_` prefix bakes the secret into the browser bundle. Use the **non-prefixed** name `MINIMAX_API_KEY` so it stays server-side only.
> 2. Mark every secret variable as **encrypted** in Netlify. The Supabase service role key and the MiniMax API key are full-power production credentials.

---

## Quick checklist

Paste each row below. The local `.env.example` file at the repo root carries the same set and is the source of truth for naming.

### Supabase (already in `.env.example`)

| Name | Required | Where to find it | Notes |
| --- | --- | --- | --- |
| `NEXT_PUBLIC_SUPABASE_URL` | Yes (prod) | Supabase → Project Settings → API → Project URL | Safe to expose. |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Yes (prod) | Supabase → Project Settings → API → anon public | Safe to expose. Paired with RLS. |
| `SUPABASE_SERVICE_ROLE_KEY` | Yes (server) | Supabase → Project Settings → API → service_role | **Encrypted. Server only.** |

### App

| Name | Required | Value | Notes |
| --- | --- | --- | --- |
| `NEXT_PUBLIC_APP_URL` | Yes | `https://loan-factory-ai-advantage.netlify.app` | Used in metadata, share links. |

### AI feature flags (server-side)

All five of these default to **off / demo**. Until you flip them, every AI call returns a placeholder response. Drop them in BEFORE going live with MiniMax.

| Name | Default | What it does |
| --- | --- | --- |
| `AI_PROVIDER` | `demo` | Set to `minimax` to route through the MiniMax provider. Any other value keeps demo mode. |
| `AI_FEATURES_ENABLED` | `false` | Master kill-switch. Must be exactly `true` to route to a live provider. |
| `AI_DRAFTS_REQUIRE_REVIEW` | `true` | Keep `true`. Every AI-generated draft is marked for Marketing review. |
| `AI_IMAGE_GENERATION_ENABLED` | `false` | Set to `true` only after Marketing & IT approve image generation. |
| `AI_VIDEO_PROMPT_GENERATION_ENABLED` | `false` | Same gate as image generation. |
| `AI_DEBUG_LOGS` | `false` | Verbose server-side logs. Never includes secrets, but still — leave off in prod unless investigating. |

### MiniMax (server-side only)

> The application does **not** make any live MiniMax call yet. `src/lib/ai/minimax.ts` carries a TODO checklist that must be completed before live wiring. These env vars exist so the provider can self-check whether it's "configured."

| Name | Required when going live | What it is |
| --- | --- | --- |
| `MINIMAX_API_KEY` | Yes | **Encrypted.** The MiniMax account API key. **Never** use a `NEXT_PUBLIC_` prefix. |
| `MINIMAX_BASE_URL` | Yes | The base URL of the official MiniMax API. **Verify against current MiniMax docs — do not guess.** |
| `MINIMAX_TEXT_MODEL` | Yes | The model ID for text completions. **Verify on the Loan Factory MiniMax account — do not guess.** |
| `MINIMAX_IMAGE_MODEL` | When image gen is on | Model ID for image generation. **Verify on the account — do not guess.** |
| `MINIMAX_VIDEO_MODEL` | When video gen is on | Model ID for video generation. **Verify on the account — do not guess.** |

---

## Adding the variables in Netlify

1. Go to **Site settings → Environment variables → Add a variable**.
2. For each row above:
   - **Key** = the name in the table.
   - **Value** = your real value.
   - **Scopes** = leave at default (All scopes).
   - For any secret (anything that is *not* prefixed `NEXT_PUBLIC_`), check **Contains secret values** so Netlify treats it as encrypted at rest and never logs it.
3. After adding, trigger a **Clear cache and deploy site** so the next build picks up the new env.

## After deploying

- The MiniMax provider will keep returning placeholder responses until **all of** `MINIMAX_API_KEY`, `MINIMAX_BASE_URL`, and `MINIMAX_TEXT_MODEL` are set **and** `AI_PROVIDER=minimax` **and** `AI_FEATURES_ENABLED=true`. This is intentional.
- The `/api/ai/generate` route works in demo mode without any of these. POST a JSON body shaped like `AiRequest` (see `src/lib/ai/types.ts`) and you'll get a demo response back.
- `GET /api/ai/generate` returns metadata (no secrets) so you can sanity-check the route is live.

## When in doubt

If you're about to flip `AI_FEATURES_ENABLED=true` and you can't tick every box in the TODO checklist inside `src/lib/ai/minimax.ts`, **stop**. The placeholder is the safe default.
