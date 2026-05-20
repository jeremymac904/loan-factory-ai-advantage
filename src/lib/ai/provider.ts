// Provider selection wrapper for the AI layer.
//
// Boundaries:
//   • This module is SERVER-SIDE ONLY. Importing it from a client component
//     will cause Next to bundle MiniMax wiring into the browser — don't.
//   • The selection logic intentionally treats missing env or `AI_FEATURES_ENABLED !== 'true'`
//     as a hard "demo mode" — no provider is called and a deterministic
//     placeholder response is returned.
//   • Never log API keys. `getFlags()` reads keys only to know whether MiniMax
//     is "configured," then discards them.
//
// Why this matters: until Marketing and IT sign off, the AI layer must be a
// preview-only surface. Demo mode is the default; live calls require an
// explicit env flip on the server.

import 'server-only';

import {
  type AiFeatureFlags,
  type AiRequest,
  type AiResponse,
} from './types';
import { generateWithMinimax, isMinimaxConfigured } from './minimax';
import { getAgentById, requiresMarketingReview } from '../agents/registry';

/**
 * Parse process.env into structured feature flags. Defaults are conservative:
 * if a flag is unset or anything other than 'true', the feature is off.
 */
export function getFlags(): AiFeatureFlags {
  const enabledRaw = (process.env.AI_FEATURES_ENABLED ?? '').toLowerCase();
  const enabled = enabledRaw === 'true';

  const providerRaw = (process.env.AI_PROVIDER ?? 'demo').toLowerCase();
  const provider: AiFeatureFlags['provider'] = providerRaw === 'minimax' ? 'minimax' : 'demo';

  return {
    enabled,
    provider,
    draftsRequireReview: (process.env.AI_DRAFTS_REQUIRE_REVIEW ?? 'true').toLowerCase() === 'true',
    imageGenerationEnabled:
      (process.env.AI_IMAGE_GENERATION_ENABLED ?? 'false').toLowerCase() === 'true',
    videoPromptGenerationEnabled:
      (process.env.AI_VIDEO_PROMPT_GENERATION_ENABLED ?? 'false').toLowerCase() === 'true',
    debugLogs: (process.env.AI_DEBUG_LOGS ?? 'false').toLowerCase() === 'true',
  };
}

function debug(message: string, extra?: Record<string, unknown>): void {
  if (!getFlags().debugLogs) return;
  if (extra) {
    // Never log keys or full payloads. Stringify only known-safe extras.
    console.info(`[ai] ${message}`, extra);
  } else {
    console.info(`[ai] ${message}`);
  }
}

function demoResponse(req: AiRequest, reason: string): AiResponse {
  const agent = req.agent ? getAgentById(req.agent) : undefined;
  const header = agent
    ? `[Demo response from ${agent.name}]`
    : `[Demo response — ${req.task}]`;
  const prompt = req.prompt.slice(0, 240);
  return {
    status: 'demo',
    provider: 'demo',
    output: `${header}\n\n${prompt}\n\nReason: ${reason}.\n\nThis is a placeholder. Live generation lands once the MiniMax provider is wired and Marketing & IT approve.`,
    requiresMarketingReview: requiresMarketingReview(req.agent),
  };
}

/**
 * Validate that a request is shaped correctly and does not violate the
 * scope guardrails (no borrower data, no rate quote workflows, etc.).
 * Returns a string error message if the request should be rejected.
 */
function rejectIfOutOfScope(req: AiRequest): string | null {
  if (typeof req.prompt !== 'string' || !req.prompt.trim()) {
    return 'Empty prompt.';
  }
  const lc = req.prompt.toLowerCase();
  // Defense-in-depth pattern matches. These are coarse — Marketing review
  // remains the source of truth.
  if (
    /\bssn\b|\bsocial security\b|\bdate of birth\b|\bdob\b/.test(lc) ||
    /borrower\s+(file|name|application)/.test(lc) ||
    /loan\s+number/.test(lc)
  ) {
    return 'Request appears to contain borrower PII or a loan-file reference. AI features in this pilot do not handle borrower data.';
  }
  if (/lock my rate|rate quote|today'?s rates|guaranteed rate/.test(lc)) {
    return 'Rate quote and rate guarantee language is out of scope for this pilot.';
  }
  return null;
}

/**
 * Main entry point. Routes to the active provider, or returns a demo
 * response when the feature is disabled / the provider is not configured.
 */
export async function generate(req: AiRequest): Promise<AiResponse> {
  const flags = getFlags();
  debug('generate', {
    task: req.task,
    agent: req.agent,
    provider: flags.provider,
    enabled: flags.enabled,
  });

  const scopeError = rejectIfOutOfScope(req);
  if (scopeError) {
    return {
      status: 'error',
      provider: 'demo',
      output: '',
      errorMessage: scopeError,
    };
  }

  if (!flags.enabled) return demoResponse(req, 'AI_FEATURES_ENABLED is not true');
  if (flags.provider !== 'minimax') {
    return demoResponse(req, `Active provider is "${flags.provider}", not a wired live provider`);
  }
  if (!isMinimaxConfigured()) {
    return demoResponse(req, 'MiniMax is selected but not fully configured (missing key, base URL, or model)');
  }

  // Per-task gating.
  if (req.task === 'image-prompt' && !flags.imageGenerationEnabled) {
    return demoResponse(req, 'Image generation is disabled (AI_IMAGE_GENERATION_ENABLED=false)');
  }
  if (req.task === 'video-prompt' && !flags.videoPromptGenerationEnabled) {
    return demoResponse(req, 'Video-prompt generation is disabled (AI_VIDEO_PROMPT_GENERATION_ENABLED=false)');
  }

  try {
    const response = await generateWithMinimax(req, flags);
    if (flags.draftsRequireReview) {
      response.requiresMarketingReview = true;
    }
    return response;
  } catch (err) {
    debug('minimax failed', { message: (err as Error).message });
    return {
      status: 'error',
      provider: 'minimax',
      output: '',
      errorMessage: 'MiniMax provider call failed. Falling back to demo mode is recommended.',
    };
  }
}
