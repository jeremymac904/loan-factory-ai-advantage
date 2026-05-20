'use client';

import { useMemo, useState } from 'react';
import {
  AlertTriangle,
  CheckCircle2,
  Save,
  Send,
  ShieldAlert,
  Sparkles,
  Target,
  Users,
} from 'lucide-react';
import Topbar from '@/components/platform/Topbar';
import ComplianceBadge from '@/components/platform/ComplianceBadge';
import { currentUserProfile, marketingTemplates } from '@/lib/platform-mock-data';
import {
  LOAN_FACTORY_COMPANY_NMLS,
  complianceSummary,
  runComplianceCheck,
} from '@/lib/compliance-rules';
import type { ContentChannel } from '@/lib/platform-types';

const GOAL_PRESETS = [
  'Educate veterans on VA benefit',
  'First-time buyer down-payment myths',
  'DSCR investor education',
  'Realtor co-marketing — workshop',
  'Recruit a Loan Officer',
  'Spanish-language consumer education',
];

const CHANNELS: ContentChannel[] = [
  'Instagram',
  'Facebook',
  'LinkedIn',
  'TikTok',
  'YouTube',
  'Email',
  'Website',
  'Google Business Profile',
];

// TODO(ai): Replace this with a real provider call (e.g. via a server action
// that hits Anthropic / OpenAI / Vertex). For the pilot, this is a deterministic
// placeholder so the UX shows what a draft will look like.
function generatePlaceholderDraft(input: {
  goal: string;
  audience: string;
  templateTitle: string;
  channels: string[];
  loName: string;
  loNmls: string;
}): string {
  const hook =
    'Here is the wholesale move most borrowers miss — and how I help my clients use it.';
  const body = `Goal: ${input.goal || 'educate borrowers'}. Audience: ${input.audience || 'local market'}. Channel: ${input.channels.join(', ') || 'social'}. Template: ${input.templateTitle || 'free-form'}.`;
  const cta = 'DM me or comment "INFO" and I will personally walk you through the numbers.';
  const footer = `${input.loName}, NMLS #${input.loNmls}. Loan Factory, NMLS #${LOAN_FACTORY_COMPANY_NMLS}. Equal Housing Lender.`;
  return `${hook}\n\n${body}\n\n${cta}\n\n${footer}`;
}

export default function ContentStudioPage() {
  const u = currentUserProfile;
  const [goal, setGoal] = useState('');
  const [audience, setAudience] = useState('');
  const [templateId, setTemplateId] = useState<string>('');
  const [channels, setChannels] = useState<ContentChannel[]>(['Instagram']);
  const [caption, setCaption] = useState('');
  const [visualNotes, setVisualNotes] = useState('');
  const [usingTeamName, setUsingTeamName] = useState(false);
  const [saved, setSaved] = useState<'idle' | 'saved' | 'submitted'>('idle');

  const chosenTemplate = useMemo(
    () => marketingTemplates.find((t) => t.id === templateId),
    [templateId],
  );

  const checks = useMemo(() => {
    if (!caption && !visualNotes) return [];
    return runComplianceCheck({
      content: `${caption}\n${visualNotes}`,
      caption,
      licensedStates: u.licensed_states,
      loNmls: u.nmls_number,
      usingTeamName,
      companyNmls: LOAN_FACTORY_COMPANY_NMLS,
    });
  }, [caption, visualNotes, u.licensed_states, u.nmls_number, usingTeamName]);

  const summary = complianceSummary(checks);

  function toggleChannel(c: ContentChannel) {
    setChannels((prev) =>
      prev.includes(c) ? prev.filter((x) => x !== c) : [...prev, c],
    );
  }

  function handleGenerate() {
    // TODO(ai): server action to a real provider. No PII or borrower data in prompts.
    const draft = generatePlaceholderDraft({
      goal,
      audience,
      templateTitle: chosenTemplate?.title ?? '',
      channels,
      loName: u.preferred_display_name,
      loNmls: u.nmls_number,
    });
    setCaption(draft);
    setVisualNotes(
      `Visual: Loan Factory wordmark equal-or-larger than ${u.preferred_display_name}. Include Equal Housing Lender mark. NMLS #${u.nmls_number} and Loan Factory NMLS #${LOAN_FACTORY_COMPANY_NMLS} visible.`,
    );
    setSaved('idle');
  }

  function handleSaveDraft() {
    // TODO(supabase): insert into content_drafts.
    setSaved('saved');
    setTimeout(() => setSaved('idle'), 2400);
  }

  function handleSubmitForReview() {
    if (!summary.canSubmit) return;
    // TODO(supabase): update status to 'Needs Review' and notify Marketing.
    setSaved('submitted');
    setTimeout(() => setSaved('idle'), 3000);
  }

  const complianceFooter = `${u.preferred_display_name} | NMLS #${u.nmls_number} | Loan Factory | NMLS #${LOAN_FACTORY_COMPANY_NMLS} | Equal Housing Lender`;

  return (
    <>
      <Topbar
        title="Content Studio"
        subtitle="Draft a compliant social post. Generation is a placeholder until the AI provider is wired."
      />

      <div className="px-5 sm:px-8 py-8 grid lg:grid-cols-3 gap-6">
        {/* Left: form */}
        <section className="lg:col-span-2 space-y-5">
          {/* Top: goal & audience */}
          <div className="bg-white border border-[var(--color-lf-border)] rounded-2xl p-5">
            <div className="grid md:grid-cols-2 gap-5">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-widest text-gray-500 mb-1.5">
                  Campaign goal
                </label>
                <div className="relative">
                  <Target
                    size={14}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-300"
                  />
                  <input
                    type="text"
                    value={goal}
                    onChange={(e) => setGoal(e.target.value)}
                    placeholder="What is this post supposed to do?"
                    className="w-full bg-white border border-gray-200 rounded-xl pl-10 pr-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-lf-orange)]/30 focus:border-[var(--color-lf-orange)]"
                  />
                </div>
                <div className="flex flex-wrap gap-1 mt-2">
                  {GOAL_PRESETS.map((p) => (
                    <button
                      key={p}
                      type="button"
                      onClick={() => setGoal(p)}
                      className="text-[10px] font-medium text-gray-500 bg-gray-50 hover:bg-[var(--color-lf-orange-soft)] hover:text-[var(--color-lf-orange-dark)] border border-gray-100 px-2 py-0.5 rounded-full"
                    >
                      {p}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold uppercase tracking-widest text-gray-500 mb-1.5">
                  Audience
                </label>
                <div className="relative">
                  <Users
                    size={14}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-300"
                  />
                  <input
                    type="text"
                    value={audience}
                    onChange={(e) => setAudience(e.target.value)}
                    placeholder="Who are you talking to?"
                    className="w-full bg-white border border-gray-200 rounded-xl pl-10 pr-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-lf-orange)]/30 focus:border-[var(--color-lf-orange)]"
                  />
                </div>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-5 mt-5">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-widest text-gray-500 mb-1.5">
                  Template
                </label>
                <select
                  value={templateId}
                  onChange={(e) => setTemplateId(e.target.value)}
                  className="w-full bg-white border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-lf-orange)]/30 focus:border-[var(--color-lf-orange)]"
                >
                  <option value="">No template (free-form)</option>
                  {marketingTemplates.map((t) => (
                    <option key={t.id} value={t.id}>
                      {t.title}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold uppercase tracking-widest text-gray-500 mb-1.5">
                  Channels
                </label>
                <div className="flex flex-wrap gap-1.5">
                  {CHANNELS.map((c) => {
                    const on = channels.includes(c);
                    return (
                      <button
                        key={c}
                        type="button"
                        onClick={() => toggleChannel(c)}
                        className={`text-xs font-semibold px-2.5 py-1 rounded-full border transition-colors ${
                          on
                            ? 'bg-[#003087] border-[#003087] text-white'
                            : 'bg-white border-gray-200 text-gray-600 hover:border-[#003087] hover:text-[#003087]'
                        }`}
                      >
                        {c}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            <div className="mt-5">
              <label className="flex items-center gap-2 text-xs text-gray-600">
                <input
                  type="checkbox"
                  checked={usingTeamName}
                  onChange={(e) => setUsingTeamName(e.target.checked)}
                  className="rounded border-gray-300"
                />
                Using a team name or DBA on this asset
                <span className="text-[10px] text-gray-400">
                  (NJ / RI restrictions apply automatically)
                </span>
              </label>
            </div>

            <div className="mt-5">
              <button
                type="button"
                onClick={handleGenerate}
                className="inline-flex items-center gap-2 bg-[#003087] hover:bg-[#001a4d] text-white font-semibold text-sm px-4 py-2.5 rounded-xl transition-colors"
              >
                <Sparkles size={14} />
                Generate Draft
                <span className="text-[10px] uppercase font-bold tracking-widest bg-white/10 px-1.5 py-0.5 rounded">
                  Placeholder
                </span>
              </button>
              <p className="text-[11px] text-gray-400 mt-2">
                Live AI generation lands when the provider is wired. For now this drops in a
                structured starter draft.
              </p>
            </div>
          </div>

          {/* Caption */}
          <div className="bg-white border border-[var(--color-lf-border)] rounded-2xl p-5">
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-semibold uppercase tracking-widest text-gray-500">
                Caption / Script
              </label>
              <span className="text-[10px] text-gray-400">{caption.length} chars</span>
            </div>
            <textarea
              rows={8}
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
              placeholder="Write the post copy here. Compliance checks run automatically as you type."
              className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-lf-orange)]/30 focus:border-[var(--color-lf-orange)] resize-y leading-relaxed font-mono"
            />
          </div>

          {/* Visual notes */}
          <div className="bg-white border border-[var(--color-lf-border)] rounded-2xl p-5">
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-semibold uppercase tracking-widest text-gray-500">
                Visual notes
              </label>
              <span className="text-[10px] text-gray-400">
                Loan Factory wordmark equal-or-larger than your name. EHL mark required.
              </span>
            </div>
            <textarea
              rows={4}
              value={visualNotes}
              onChange={(e) => setVisualNotes(e.target.value)}
              placeholder="Describe the image, layout, B-roll, on-screen text."
              className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-lf-orange)]/30 focus:border-[var(--color-lf-orange)] resize-y"
            />
          </div>

          {/* Actions */}
          <div className="bg-white border border-[var(--color-lf-border)] rounded-2xl p-5 flex items-center justify-between flex-wrap gap-3">
            <p className="text-xs text-gray-500">
              {summary.canSubmit
                ? 'Compliance checks passed. You can submit for Marketing review.'
                : `Resolve ${summary.blockingCount} blocking issue${summary.blockingCount === 1 ? '' : 's'} before submitting.`}
            </p>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleSaveDraft}
                className="inline-flex items-center gap-1 bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm font-semibold px-4 py-2.5 rounded-xl"
              >
                <Save size={14} />
                {saved === 'saved' ? 'Saved' : 'Save Draft'}
              </button>
              <button
                type="button"
                onClick={handleSubmitForReview}
                disabled={!summary.canSubmit}
                className="inline-flex items-center gap-1 bg-[var(--color-lf-orange)] hover:bg-[var(--color-lf-orange-dark)] disabled:bg-gray-300 disabled:cursor-not-allowed text-white text-sm font-bold px-4 py-2.5 rounded-xl transition-colors"
              >
                <Send size={14} />
                {saved === 'submitted' ? 'Submitted' : 'Submit For Review'}
              </button>
            </div>
          </div>
        </section>

        {/* Right: compliance sidebar */}
        <aside className="space-y-5 lg:sticky lg:top-20 self-start">
          {/* Score */}
          <div
            className={`rounded-2xl p-5 border ${
              summary.canSubmit
                ? 'bg-green-50 border-green-100'
                : 'bg-red-50 border-red-100'
            }`}
          >
            <div className="flex items-center gap-2">
              {summary.canSubmit ? (
                <CheckCircle2 size={18} className="text-green-600" />
              ) : (
                <ShieldAlert size={18} className="text-red-600" />
              )}
              <p className="font-semibold text-gray-800 text-sm">
                {summary.canSubmit ? 'Compliance: clear' : 'Compliance: action required'}
              </p>
            </div>
            <p className="text-xs text-gray-500 mt-1">
              {summary.blockingCount} blocking · {summary.warningCount} warnings · {summary.infoCount}{' '}
              info
            </p>
            <p className="text-[11px] text-gray-400 mt-3">
              Heuristic checks only. Marketing review is still required before publish.
            </p>
          </div>

          {/* Findings */}
          <div className="bg-white border border-[var(--color-lf-border)] rounded-2xl">
            <div className="px-5 py-3 border-b border-gray-50 flex items-center justify-between">
              <h3 className="text-sm font-semibold text-gray-800">Findings</h3>
              <span className="text-[10px] text-gray-400">{checks.length}</span>
            </div>
            {checks.length === 0 ? (
              <p className="px-5 py-8 text-sm text-gray-500 text-center">
                Write a draft to run compliance checks.
              </p>
            ) : (
              <ul className="divide-y divide-gray-50">
                {checks.map((c, i) => (
                  <li key={`${c.ruleId}-${i}`} className="px-5 py-4">
                    <div className="flex items-start gap-2">
                      {c.severity === 'blocking' ? (
                        <ShieldAlert size={14} className="text-red-600 mt-0.5 shrink-0" />
                      ) : c.severity === 'warning' ? (
                        <AlertTriangle size={14} className="text-amber-600 mt-0.5 shrink-0" />
                      ) : (
                        <CheckCircle2 size={14} className="text-blue-600 mt-0.5 shrink-0" />
                      )}
                      <div className="min-w-0">
                        <div className="flex items-center gap-2 flex-wrap mb-0.5">
                          <p className="text-xs font-semibold text-gray-800">{c.rule}</p>
                          <ComplianceBadge severity={c.severity} />
                        </div>
                        <p className="text-xs text-gray-600 leading-snug">{c.message}</p>
                        {c.suggestedFix && (
                          <p className="text-[11px] text-[var(--color-lf-orange-dark)] mt-1">
                            Fix: {c.suggestedFix}
                          </p>
                        )}
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* Compliance footer preview */}
          <div className="bg-white border border-[var(--color-lf-border)] rounded-2xl p-5">
            <h3 className="text-xs font-semibold uppercase tracking-widest text-gray-500 mb-2">
              Compliance footer preview
            </h3>
            <p className="text-[11px] text-gray-700 leading-relaxed font-mono bg-gray-50 border border-gray-100 rounded-md p-3">
              {complianceFooter}
            </p>
            <p className="text-[11px] text-gray-400 mt-2">
              Auto-attached on submit when{' '}
              <span className="font-semibold">auto_attach_disclosures</span> is on (Settings).
            </p>
          </div>
        </aside>
      </div>
    </>
  );
}
