// POST /api/ai/generate
//
// Server-side AI entry point. Until MiniMax is wired and approved, this
// route returns DEMO responses regardless of input. That's by design:
//   - Marketing and IT have not signed off on live generation.
//   - We don't want any UI button to accidentally hit a paid provider.
//
// Request shape: see `AiRequest` in src/lib/ai/types.ts
// Response shape: see `AiResponse` in src/lib/ai/types.ts
//
// Guardrails:
//   - Method-restricted to POST.
//   - Body is validated before dispatch.
//   - Compliance / scope filter runs in `provider.generate()` before any
//     provider is reached.
//   - The MINIMAX_API_KEY is read only inside `src/lib/ai/minimax.ts` on
//     the server; this route never returns the key in any form.

import { NextResponse } from 'next/server';

import { generate } from '@/lib/ai/provider';
import type { AiRequest, AiResponse, AiTaskKind } from '@/lib/ai/types';
import type { AgentRoleId } from '@/lib/agents/registry';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const VALID_TASKS: ReadonlySet<AiTaskKind> = new Set<AiTaskKind>([
  'social-post-draft',
  'caption-rewrite',
  'bio-rewrite',
  'compliance-check-summary',
  'template-suggestion',
  'image-prompt',
  'video-prompt',
  'agent-response',
]);

const VALID_AGENTS: ReadonlySet<AgentRoleId> = new Set<AgentRoleId>([
  'chief-orchestrator',
  'ai-twin',
  'ui-ux-design',
  'brand-compliance',
  'seo-geo-aeo-content',
  'market-research',
  'competitor-intel',
  'youtube-research',
  'content-strategy',
  'template-architect',
  'minimax-multimodal',
]);

const MAX_PROMPT_LENGTH = 6000;

function asRecord(input: unknown): Record<string, unknown> | null {
  if (input && typeof input === 'object' && !Array.isArray(input)) {
    return input as Record<string, unknown>;
  }
  return null;
}

function parseRequest(body: unknown): { req: AiRequest } | { error: string } {
  const obj = asRecord(body);
  if (!obj) return { error: 'Request body must be a JSON object.' };

  const task = obj.task;
  if (typeof task !== 'string' || !VALID_TASKS.has(task as AiTaskKind)) {
    return { error: 'Field "task" is required and must be a known AiTaskKind.' };
  }

  const prompt = obj.prompt;
  if (typeof prompt !== 'string' || !prompt.trim()) {
    return { error: 'Field "prompt" is required and must be a non-empty string.' };
  }
  if (prompt.length > MAX_PROMPT_LENGTH) {
    return { error: `Field "prompt" is too long (max ${MAX_PROMPT_LENGTH} characters).` };
  }

  const agent = obj.agent;
  if (agent !== undefined && (typeof agent !== 'string' || !VALID_AGENTS.has(agent as AgentRoleId))) {
    return { error: 'Field "agent" must be a known AgentRoleId if provided.' };
  }

  // Lightweight context shape check — keep this strict so we don't accept
  // anything that could carry borrower PII or large payloads.
  let context: AiRequest['context'];
  if (obj.context !== undefined) {
    const ctx = asRecord(obj.context);
    if (!ctx) return { error: 'Field "context" must be an object if provided.' };
    const safe: NonNullable<AiRequest['context']> = {};
    for (const [k, v] of Object.entries(ctx)) {
      if (typeof k !== 'string') continue;
      if (k.length > 64) continue;
      if (
        v === null ||
        typeof v === 'string' ||
        typeof v === 'number' ||
        typeof v === 'boolean'
      ) {
        safe[k] = v;
      }
    }
    context = safe;
  }

  const model = typeof obj.model === 'string' ? obj.model : undefined;
  const temperature = typeof obj.temperature === 'number' ? obj.temperature : undefined;
  const maxOutputTokens =
    typeof obj.maxOutputTokens === 'number' ? obj.maxOutputTokens : undefined;

  const req: AiRequest = {
    task: task as AiTaskKind,
    prompt,
    agent: agent as AgentRoleId | undefined,
    context,
    model,
    temperature,
    maxOutputTokens,
  };

  return { req };
}

export async function POST(request: Request): Promise<NextResponse<AiResponse | { error: string }>> {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { error: 'Body must be valid JSON.' },
      { status: 400 },
    );
  }

  const parsed = parseRequest(body);
  if ('error' in parsed) {
    return NextResponse.json({ error: parsed.error }, { status: 400 });
  }

  const response = await generate(parsed.req);
  const status = response.status === 'error' ? 400 : 200;
  return NextResponse.json(response, { status });
}

// Friendly GET for sanity-checking the route in a browser. Returns metadata
// only — never invokes the provider, never echoes env secrets.
export async function GET(): Promise<NextResponse> {
  return NextResponse.json({
    route: '/api/ai/generate',
    method: 'POST',
    requestType: 'AiRequest (see src/lib/ai/types.ts)',
    responseType: 'AiResponse (see src/lib/ai/types.ts)',
    note:
      'POST a JSON body with { task, prompt, agent? }. Until AI_FEATURES_ENABLED=true and MiniMax is fully configured, every response is a demo response.',
  });
}
