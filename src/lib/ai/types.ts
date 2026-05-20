// Shared request / response shapes for the AI layer.
//
// These types are consumed by both the provider abstraction (`provider.ts`)
// and the safe server-side API route (`src/app/api/ai/generate/route.ts`).
// Keep them stable — server actions and future client hooks will rely on
// the shape contract here, not on any one provider's wire format.

import type { AgentRole } from '../agents/registry';

// --- Inputs --------------------------------------------------------------

export type AiTaskKind =
  | 'social-post-draft'
  | 'caption-rewrite'
  | 'bio-rewrite'
  | 'compliance-check-summary'
  | 'template-suggestion'
  | 'image-prompt'
  | 'video-prompt'
  | 'agent-response';

export interface AiRequest {
  /** The kind of task the caller is asking for. Determines which prompt scaffold and validators run. */
  task: AiTaskKind;
  /** Free-text user prompt. Never include borrower PII or loan-specific data. */
  prompt: string;
  /** Optional agent role to bias the response. */
  agent?: AgentRole['id'];
  /** Optional structured context (no PII). */
  context?: Record<string, string | number | boolean | null>;
  /** Optional override of the default model from env. */
  model?: string;
  /** Sampling temperature. Provider may ignore. */
  temperature?: number;
  /** Hard upper bound on output length. Provider may clamp lower. */
  maxOutputTokens?: number;
}

// --- Outputs -------------------------------------------------------------

export type AiResponseStatus = 'demo' | 'ok' | 'error';

export interface AiResponse {
  status: AiResponseStatus;
  /** The generated text. For non-text tasks this is a JSON-encoded payload. */
  output: string;
  /** Which provider produced this response. */
  provider: 'demo' | 'minimax';
  /** Which model produced this response, if applicable. */
  model?: string;
  /** Provider-side request id, when available. */
  requestId?: string;
  /**
   * If the provider streamed a usage block, surface it here. Token counts are
   * the only data we surface to clients — never raw provider response bodies.
   */
  usage?: {
    inputTokens?: number;
    outputTokens?: number;
  };
  /** Human-readable error message, only set when status === 'error'. */
  errorMessage?: string;
  /** When true, the platform should hold the output for Marketing review before publish. */
  requiresMarketingReview?: boolean;
  /** Any compliance warnings produced server-side before returning. */
  complianceWarnings?: string[];
}

// --- Feature flags (derived from env) ------------------------------------

export interface AiFeatureFlags {
  /** Master switch. When false, every request returns a demo response. */
  enabled: boolean;
  /** Active provider name. */
  provider: 'demo' | 'minimax';
  /** When true, every AI draft is marked requiresMarketingReview. */
  draftsRequireReview: boolean;
  /** When true, image generation tasks are permitted. */
  imageGenerationEnabled: boolean;
  /** When true, video prompt generation tasks are permitted. */
  videoPromptGenerationEnabled: boolean;
  /** When true, verbose logging is emitted server-side. Never log secrets. */
  debugLogs: boolean;
}
