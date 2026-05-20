// MiniMax provider — SERVER-SIDE ONLY placeholder.
//
// ╔══════════════════════════════════════════════════════════════════════╗
// ║  DO NOT GO LIVE WITHOUT VERIFYING OFFICIAL MINIMAX DOCS.              ║
// ║                                                                       ║
// ║  • Verify the real base URL.                                          ║
// ║  • Verify the real endpoint paths for chat/completions, image, video. ║
// ║  • Verify the actual model IDs available on the account.              ║
// ║  • Verify the request and response body shapes.                       ║
// ║  • Verify auth header format and rate limits.                         ║
// ║                                                                       ║
// ║  This file deliberately does NOT call any HTTP endpoint. The wiring   ║
// ║  is gated behind a "fully configured" check so live calls cannot      ║
// ║  happen by accident before the env is filled out AND the TODOs below  ║
// ║  are resolved.                                                        ║
// ╚══════════════════════════════════════════════════════════════════════╝
//
// Boundaries:
//   • This module is imported by `provider.ts`, which is `server-only`. The
//     API key is read here from process.env and NEVER returned to the caller.
//   • Never echo the key in logs, errors, or responses.
//   • Never use a `NEXT_PUBLIC_` prefix for the MiniMax key. Doing so would
//     bake the secret into the client bundle.

import 'server-only';

import type { AiFeatureFlags, AiRequest, AiResponse } from './types';

/**
 * Read the MiniMax env vars. Returns the loose union of what we found so the
 * caller can decide whether to proceed. Never returns the API key — only a
 * boolean about its presence.
 */
function readMinimaxEnv(): {
  hasKey: boolean;
  baseUrl: string | null;
  textModel: string | null;
  imageModel: string | null;
  videoModel: string | null;
} {
  const key = process.env.MINIMAX_API_KEY?.trim();
  const baseUrl = process.env.MINIMAX_BASE_URL?.trim() || null;
  const textModel = process.env.MINIMAX_TEXT_MODEL?.trim() || null;
  const imageModel = process.env.MINIMAX_IMAGE_MODEL?.trim() || null;
  const videoModel = process.env.MINIMAX_VIDEO_MODEL?.trim() || null;
  return {
    hasKey: !!key && key.length > 8,
    baseUrl,
    textModel,
    imageModel,
    videoModel,
  };
}

/**
 * The provider is "configured" when ALL of these hold:
 *   1. MINIMAX_API_KEY is set and looks plausible (length > 8).
 *   2. MINIMAX_BASE_URL is set.
 *   3. MINIMAX_TEXT_MODEL is set (the minimum-viable surface is text).
 *
 * Image and video models are checked per-task in `provider.ts`.
 */
export function isMinimaxConfigured(): boolean {
  const env = readMinimaxEnv();
  return env.hasKey && !!env.baseUrl && !!env.textModel;
}

/**
 * Server-side entry point for MiniMax. Today this is a placeholder that
 * returns an explicit "not yet wired" response. Replace the body with a real
 * `fetch` to the MiniMax API once the TODOs below are resolved.
 *
 * TODO(minimax-live-wiring): Before flipping AI_FEATURES_ENABLED=true and
 *   AI_PROVIDER=minimax in production:
 *
 *   [ ] Read the current MiniMax API reference. Capture:
 *         - Auth header format (e.g. `Authorization: Bearer <key>` vs custom).
 *         - The chat / completions endpoint path under MINIMAX_BASE_URL.
 *         - The image generation endpoint path.
 *         - The video generation endpoint path.
 *         - Request body schemas for each.
 *         - Response body schemas for each.
 *         - Rate-limit and retry behavior.
 *
 *   [ ] Confirm MINIMAX_TEXT_MODEL / MINIMAX_IMAGE_MODEL / MINIMAX_VIDEO_MODEL
 *       env values map to model IDs that actually exist on the Loan Factory
 *       MiniMax account. DO NOT guess from training data — read the docs.
 *
 *   [ ] Add a network adapter (e.g. a tiny `fetchMinimax` helper) that:
 *         - Sends auth header from process.env.MINIMAX_API_KEY only.
 *         - Times out cleanly (e.g. 20s) and surfaces a clear error.
 *         - Never logs the key, request body, or full response body.
 *         - Returns only the fields needed to construct an AiResponse.
 *
 *   [ ] Add server-side rate limiting (per-IP and per-user) before exposing
 *       the route to authenticated users.
 *
 *   [ ] Add a Marketing-review gate on any output that touches a public page.
 *
 *   [ ] Add Sentry / equivalent error reporting; never include the API key.
 *
 *   [ ] Confirm with Marketing & IT that AI-generated drafts default to
 *       `requiresMarketingReview: true` until policy explicitly relaxes it.
 *
 * Until the items above are checked off, this function intentionally does NOT
 * make a network request — it returns a structured "not yet wired" response so
 * the rest of the app keeps working in demo mode.
 */
export async function generateWithMinimax(
  req: AiRequest,
  flags: AiFeatureFlags,
): Promise<AiResponse> {
  const env = readMinimaxEnv();
  const model =
    req.model ??
    (req.task === 'image-prompt'
      ? env.imageModel ?? undefined
      : req.task === 'video-prompt'
      ? env.videoModel ?? undefined
      : env.textModel ?? undefined);

  // Even though provider.ts already checked isMinimaxConfigured(), keep a
  // belt-and-suspenders guard here so this module can never silently 200 on
  // a missing key if it is ever called directly from a future code path.
  if (!isMinimaxConfigured()) {
    return {
      status: 'demo',
      provider: 'minimax',
      output:
        '[MiniMax not configured] Missing one of: MINIMAX_API_KEY, MINIMAX_BASE_URL, MINIMAX_TEXT_MODEL.',
      model,
      requiresMarketingReview: flags.draftsRequireReview,
    };
  }

  // INTENTIONAL: no real `fetch` call. See the TODO block above.
  return {
    status: 'demo',
    provider: 'minimax',
    output:
      `[MiniMax stub] Request for task "${req.task}" was received with model "${model ?? 'unknown'}". ` +
      'Live wiring is intentionally not active until the TODO checklist in src/lib/ai/minimax.ts is resolved. ' +
      'The rest of the platform is unaffected — keep using demo mode.',
    model,
    requiresMarketingReview: flags.draftsRequireReview,
    complianceWarnings: [
      'Output is a placeholder. Do not use as public-facing copy.',
      'Live MiniMax calls require Marketing & IT approval before flipping AI_FEATURES_ENABLED=true.',
    ],
  };
}
