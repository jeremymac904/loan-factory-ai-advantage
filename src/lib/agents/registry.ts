// Static registry for the AI Advantage agent system.
//
// Each agent is a NAMED ROLE with a defined responsibility. The registry is
// intentionally a flat, in-memory list — no DB, no orchestration framework
// yet. Phase 1 will swap this for a Supabase-backed registry once role
// assignment per Team Leader / Marketing reviewer is real.
//
// Hard rules baked in:
//   - These agents do NOT touch borrower data, loan files, or LOS/CRM
//     systems. The pilot is a wholesale-broker marketing platform.
//   - Every agent that generates public-facing copy MUST flow through
//     `routesPublicly: true` AND `requiresMarketingReview: true` so the
//     Content Studio + Admin queues see the output before any publish.
//   - The MiniMax Multimodal Agent is the ONLY agent that may call an
//     external multimodal provider. Other agents draft text only.

export type AgentRoleId =
  | 'chief-orchestrator'
  | 'ai-twin'
  | 'ui-ux-design'
  | 'brand-compliance'
  | 'seo-geo-aeo-content'
  | 'market-research'
  | 'competitor-intel'
  | 'youtube-research'
  | 'content-strategy'
  | 'template-architect'
  | 'minimax-multimodal';

export type AgentCapability =
  | 'plan'
  | 'draft-text'
  | 'review-text'
  | 'generate-image-prompt'
  | 'generate-video-prompt'
  | 'analyze-external-content'
  | 'design-suggestion'
  | 'compliance-suggestion'
  | 'route-to-agent';

export interface AgentRole {
  /** Stable identifier. Used in API requests and downstream routing. */
  id: AgentRoleId;
  /** Human-friendly display name. */
  name: string;
  /** One-sentence purpose. */
  description: string;
  /** Long-form responsibility. */
  responsibility: string;
  /** What this agent can do, semantically. */
  capabilities: AgentCapability[];
  /**
   * Whether output is shown to the public after Marketing review. If `true`,
   * the orchestration layer must attach `requiresMarketingReview: true` on
   * the response.
   */
  routesPublicly: boolean;
  /**
   * Forces Marketing review even if `routesPublicly` is false. Use this for
   * any agent whose output the Team Leader might publish indirectly.
   */
  requiresMarketingReview: boolean;
  /** Order of preference for orchestration when multiple agents could handle a task. */
  priority: number;
}

export const AGENT_REGISTRY: readonly AgentRole[] = [
  {
    id: 'chief-orchestrator',
    name: 'Chief Orchestrator',
    description:
      'Routes incoming requests to the right specialist agent and gathers their outputs.',
    responsibility:
      'Receives a Team Leader or Marketing reviewer request, picks the smallest set of specialist agents that can answer it, sequences them, and assembles the final response. Never produces user-facing copy directly.',
    capabilities: ['plan', 'route-to-agent'],
    routesPublicly: false,
    requiresMarketingReview: false,
    priority: 0,
  },
  {
    id: 'ai-twin',
    name: 'AI Twin Agent',
    description:
      "Drafts in the Team Leader's own voice — persona doc, brand voice doc, and Loan Factory wholesale-broker tone.",
    responsibility:
      "Generates first-draft captions, bios, and post copy that reflect the Team Leader's persona summary, brand voice doc, and licensed states. Never invents loan products, rates, or guarantees. Always wholesale-broker positioning.",
    capabilities: ['draft-text'],
    routesPublicly: true,
    requiresMarketingReview: true,
    priority: 10,
  },
  {
    id: 'ui-ux-design',
    name: 'UI/UX Design Agent',
    description:
      'Proposes layouts, design tokens, and component-level changes that stay inside the Loan Factory brand system.',
    responsibility:
      'Suggests structural and visual changes for the marketing platform and published Team Leader pages. Uses the LoanFactory.com-aligned tokens (orange #FF671F primary, black #111111 text, soft gray #F7F8FA surface). Never introduces competing primary colors.',
    capabilities: ['design-suggestion'],
    routesPublicly: false,
    requiresMarketingReview: false,
    priority: 20,
  },
  {
    id: 'brand-compliance',
    name: 'Brand & Compliance Agent',
    description:
      'Reviews draft copy against the Loan Factory Marketing Policy before it reaches the Marketing queue.',
    responsibility:
      'Runs the heuristic checks from src/lib/compliance-rules.ts and surfaces blocking findings (NMLS, APR parity, prohibited claims, NJ/RI/MA/TX/AZ state rules, team-name restrictions, company email requirement, Equal Housing Lender presence). Does not approve — only flags.',
    capabilities: ['review-text', 'compliance-suggestion'],
    routesPublicly: false,
    requiresMarketingReview: false,
    priority: 5,
  },
  {
    id: 'seo-geo-aeo-content',
    name: 'SEO / GEO / AEO Content Agent',
    description:
      'Optimizes drafts for traditional SEO, geographic intent, and answer-engine optimization.',
    responsibility:
      'Tightens headlines, on-page H2/H3 structure, schema-friendly Q&A snippets, and local-market geo cues (cities, neighborhoods, languages). Suggests internal links between Team Leader pages and Templates & Examples. Never adds keyword stuffing or off-brand language.',
    capabilities: ['draft-text', 'review-text'],
    routesPublicly: true,
    requiresMarketingReview: true,
    priority: 30,
  },
  {
    id: 'market-research',
    name: 'Market Research Agent',
    description:
      'Sources real-world consumer trends, search demand signals, and audience insights to feed strategy briefs.',
    responsibility:
      'Returns a structured market brief (audience, pain points, language, top objections) given a Team Leader profile and target market. Does not invent statistics — uses external knowledge cautiously and flags low-confidence claims.',
    capabilities: ['analyze-external-content', 'draft-text'],
    routesPublicly: false,
    requiresMarketingReview: false,
    priority: 40,
  },
  {
    id: 'competitor-intel',
    name: 'Competitor Intelligence Agent',
    description:
      'Summarizes how peer Loan Factory Team Leaders and outside brokers position similar offerings.',
    responsibility:
      'Maps competitor positioning (without scraping protected content), notes the consensus they sell, and finds gaps the Team Leader can occupy honestly. Never produces direct copy lifted from a competitor.',
    capabilities: ['analyze-external-content', 'draft-text'],
    routesPublicly: false,
    requiresMarketingReview: false,
    priority: 50,
  },
  {
    id: 'youtube-research',
    name: 'YouTube Research Agent',
    description:
      'Mines public YouTube content for hooks, formats, and angles that resonate with the target audience.',
    responsibility:
      'Returns a list of public video themes (titles, formats, hooks) that map to a given pain point or specialty. Does not download or transcribe protected content. Surfaces only public metadata and known patterns.',
    capabilities: ['analyze-external-content'],
    routesPublicly: false,
    requiresMarketingReview: false,
    priority: 55,
  },
  {
    id: 'content-strategy',
    name: 'Content Strategy Agent',
    description:
      'Turns research into a weekly / monthly content plan tied to the Team Leader\'s specialties and review queue capacity.',
    responsibility:
      'Generates a calendar plan with hooks, channels, and a draft per slot, tagged with the right compliance footer template. Aligns with the platform Calendar and Marketing review SLAs.',
    capabilities: ['plan', 'draft-text'],
    routesPublicly: true,
    requiresMarketingReview: true,
    priority: 35,
  },
  {
    id: 'template-architect',
    name: 'Template Architect Agent',
    description:
      'Designs and refactors reusable templates (Team Leader website, landing page, funnel page, recruiting page).',
    responsibility:
      'Proposes structural improvements to the existing builderTemplates and produces new template specs (sections, fields, compliance footer slots). Outputs are reviewed before they land in platform-mock-data / Supabase.',
    capabilities: ['plan', 'design-suggestion', 'draft-text'],
    routesPublicly: false,
    requiresMarketingReview: false,
    priority: 25,
  },
  {
    id: 'minimax-multimodal',
    name: 'MiniMax Multimodal Agent',
    description:
      'Bridges to the MiniMax provider for text, image-prompt, and video-prompt generation.',
    responsibility:
      "Owns the only external multimodal call path. Reads model IDs and endpoint from server-side env. Returns demo responses whenever AI_FEATURES_ENABLED is false or the MiniMax wiring isn't complete. Image and video generation are gated behind their own feature flags.",
    capabilities: ['draft-text', 'generate-image-prompt', 'generate-video-prompt'],
    routesPublicly: true,
    requiresMarketingReview: true,
    priority: 15,
  },
] as const;

const AGENT_BY_ID: Map<AgentRoleId, AgentRole> = new Map(
  AGENT_REGISTRY.map((a) => [a.id, a]),
);

export function getAgentById(id: AgentRoleId): AgentRole | undefined {
  return AGENT_BY_ID.get(id);
}

export function listAgents(): AgentRole[] {
  return [...AGENT_REGISTRY].sort((a, b) => a.priority - b.priority);
}

export function listPublicFacingAgents(): AgentRole[] {
  return listAgents().filter((a) => a.routesPublicly);
}

export function requiresMarketingReview(id: AgentRoleId | undefined): boolean {
  if (!id) return true; // be safe — default to review
  const a = AGENT_BY_ID.get(id);
  return a?.requiresMarketingReview ?? true;
}
