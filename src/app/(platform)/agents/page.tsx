'use client';

import { useState } from 'react';
import { Bot, Play, Settings, Sparkles } from 'lucide-react';
import Topbar from '@/components/platform/Topbar';
import { listAgents, type AgentRole } from '@/lib/agents/registry';

const INPUTS_FOR_AGENT: Record<AgentRole['id'], string[]> = {
  'chief-orchestrator': ['Goal', 'Constraints', 'Deadline'],
  'ai-twin': ['Persona summary', 'Tone preferences', 'Topic', 'Channel'],
  'ui-ux-design': ['Page or component', 'Audience', 'Brand tokens'],
  'brand-compliance': ['Draft text', 'Licensed states', 'NMLS', 'Team-name flag'],
  'seo-geo-aeo-content': ['Page topic', 'Target city', 'Top keywords'],
  'market-research': ['Audience', 'Market', 'Specialty'],
  'competitor-intel': ['Specialty', 'Geography', 'Channels in scope'],
  'youtube-research': ['Topic', 'Audience', 'Region'],
  'content-strategy': ['Goal', 'Weeks in plan', 'Channels'],
  'template-architect': ['Template kind', 'Audience', 'Compliance flags'],
  'minimax-multimodal': ['Task', 'Prompt', 'Reference image (optional)'],
};

const OUTPUTS_FOR_AGENT: Record<AgentRole['id'], string[]> = {
  'chief-orchestrator': ['Plan with delegated sub-tasks', 'Agent-by-agent routing notes'],
  'ai-twin': ['First-draft post', 'Bio rewrite', 'Caption variations'],
  'ui-ux-design': ['Layout suggestion', 'Token / token-pair recommendation'],
  'brand-compliance': ['Findings list (severity + suggested fix)'],
  'seo-geo-aeo-content': ['Headlines', 'H2/H3 outline', 'Schema-friendly Q&A'],
  'market-research': ['Audience brief', 'Top objections', 'Common language'],
  'competitor-intel': ['Positioning map', 'Gap analysis', 'Honest differentiator candidates'],
  'youtube-research': ['Top hooks', 'Format patterns', 'Title styles'],
  'content-strategy': ['Weekly calendar', 'Per-slot draft seed', 'Channel mix'],
  'template-architect': ['Template spec', 'Section list', 'Compliance footer slot'],
  'minimax-multimodal': ['Generated text', 'Image prompt', 'Video prompt'],
};

export default function AgentsPage() {
  const agents = listAgents();
  const [activeId, setActiveId] = useState<AgentRole['id'] | null>(null);

  function runDemo(a: AgentRole) {
    // TODO(ai): swap for /api/ai/generate with agent=<a.id>.
    setActiveId(a.id);
    setTimeout(() => setActiveId(null), 2200);
  }

  return (
    <>
      <Topbar
        title="Agent Boardroom"
        subtitle="The named agent roles your workspace can call on. Demo mode — every Run Demo button is local. Live generation lands when MiniMax is approved."
      />

      <div className="px-5 sm:px-8 py-8 space-y-6">
        <section className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {agents.map((a) => (
            <article
              key={a.id}
              className="bg-white border border-[var(--color-lf-border)] rounded-2xl p-5 flex flex-col"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-[var(--color-lf-orange-soft)] text-[var(--color-lf-orange-dark)] flex items-center justify-center">
                    <Bot size={18} />
                  </div>
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-widest text-[var(--color-lf-muted)]">
                      {a.id}
                    </p>
                    <h3 className="font-bold text-[var(--color-lf-black)] text-base leading-tight">
                      {a.name}
                    </h3>
                  </div>
                </div>
                <span
                  className={`text-[10px] font-bold uppercase tracking-wide px-2 py-0.5 rounded-full ${
                    a.routesPublicly
                      ? 'bg-blue-50 text-blue-700 border border-blue-100'
                      : 'bg-gray-50 text-gray-500 border border-gray-100'
                  }`}
                >
                  {a.routesPublicly ? 'Public-facing' : 'Internal'}
                </span>
              </div>

              <p className="text-sm text-[var(--color-lf-muted)] leading-relaxed mb-4">
                {a.description}
              </p>

              <div className="grid grid-cols-2 gap-3 mb-4">
                <Bullet label="Inputs" items={INPUTS_FOR_AGENT[a.id]} />
                <Bullet label="Outputs" items={OUTPUTS_FOR_AGENT[a.id]} />
              </div>

              <div className="mt-auto flex items-center gap-2 pt-3 border-t border-gray-50">
                {a.requiresMarketingReview && (
                  <span className="text-[10px] font-semibold text-amber-700 bg-amber-50 border border-amber-100 px-2 py-0.5 rounded-full">
                    Marketing review required
                  </span>
                )}
                <button
                  type="button"
                  onClick={() => runDemo(a)}
                  disabled={activeId === a.id}
                  className="inline-flex items-center gap-1 text-xs font-bold text-white bg-[var(--color-lf-orange)] hover:bg-[var(--color-lf-orange-dark)] disabled:bg-gray-300 px-3 py-1.5 rounded-lg ml-auto"
                >
                  <Play size={11} />
                  {activeId === a.id ? 'Running demo…' : 'Run Demo'}
                </button>
              </div>
            </article>
          ))}
        </section>

        <section className="bg-[var(--color-lf-surface)] border border-[var(--color-lf-border)] rounded-2xl p-5 text-sm text-[var(--color-lf-muted)] flex items-start gap-3">
          <Settings size={16} className="text-[var(--color-lf-orange)] mt-0.5 shrink-0" />
          <p>
            Provider status, model selection, and per-task feature flags are managed in{' '}
            <a
              href="/settings"
              className="font-bold text-[var(--color-lf-orange-dark)] hover:underline"
            >
              Settings → Publishing Controls
            </a>
            . Until MiniMax is wired and approved by Marketing &amp; IT, every Run Demo above stays
            local.
          </p>
        </section>

        <p className="text-[11px] text-[var(--color-lf-muted)] text-center inline-flex items-center justify-center gap-2 w-full">
          <Sparkles size={11} className="text-[var(--color-lf-orange)]" /> Read{' '}
          <a
            href="/docs/AGENT_SYSTEM_PLAN.md"
            className="font-semibold text-[var(--color-lf-orange-dark)] hover:underline"
          >
            docs/AGENT_SYSTEM_PLAN.md
          </a>{' '}
          for the full architecture.
        </p>
      </div>
    </>
  );
}

function Bullet({ label, items }: { label: string; items: string[] }) {
  return (
    <div>
      <p className="text-[10px] font-bold uppercase tracking-widest text-[var(--color-lf-muted)] mb-1.5">
        {label}
      </p>
      <ul className="space-y-0.5 text-[11px] text-[var(--color-lf-black)]">
        {items.map((it) => (
          <li key={it} className="leading-tight">
            • {it}
          </li>
        ))}
      </ul>
    </div>
  );
}
