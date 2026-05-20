'use client';

import { useMemo, useState } from 'react';
import {
  AlertTriangle,
  ArrowRight,
  CheckCircle2,
  Save,
  Send,
  ShieldAlert,
  Sparkles,
  Target,
  Users,
  Wand2,
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

type StudioMode = 'guided' | 'advanced';

type Format = 'Social' | 'Email' | 'Video' | 'Landing Page' | 'Webinar';

const FORMATS: { key: Format; channels: ContentChannel[] }[] = [
  { key: 'Social', channels: ['Instagram', 'Facebook', 'LinkedIn', 'TikTok'] },
  { key: 'Email', channels: ['Email'] },
  { key: 'Video', channels: ['YouTube', 'TikTok', 'Instagram'] },
  { key: 'Landing Page', channels: ['Website'] },
  { key: 'Webinar', channels: ['Website', 'Email'] },
];

const GUIDED_GOALS = [
  'Educate consumers',
  'Get Realtor meetings',
  'Recruit LOs',
  'Promote a webinar',
  'Create weekly team content',
  'Create listing partner content',
  'Create Spanish content',
  'Create video script',
];

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

// Demo-mode content generator. Deterministic — runs entirely client-side. The
// compliance guardrails in src/lib/compliance-rules.ts catch any required
// disclosure that's missing from the output, so the user (and Marketing) can
// trust the draft they see here. When MiniMax / OpenAI / Anthropic is wired,
// this function gets replaced by a server action — the shape of the output
// stays the same.
//
// The draft is built by composing fragments keyed off the user's actual
// inputs: format, goal, audience, topic, template, persona. No "placeholder"
// energy — the output is meant to be a usable starting draft that just needs
// a quick human pass.

type DraftInputs = {
  format: Format;
  goal: string;
  audience: string;
  topic: string;
  templateTitle: string;
  channels: string[];
  loName: string;
  loNmls: string;
  persona: string;
  licensedStates: string[];
};

function pick<T>(arr: readonly T[], seed: string): T {
  let h = 0;
  for (let i = 0; i < seed.length; i++) h = (h * 31 + seed.charCodeAt(i)) >>> 0;
  return arr[h % arr.length];
}

function generateDraft(input: DraftInputs): { caption: string; visual: string } {
  const seed = `${input.format}|${input.goal}|${input.topic}|${input.audience}`;
  const topic = input.topic || 'wholesale-broker positioning';
  const audience = input.audience || 'local market';
  const persona = input.persona ? input.persona.split('.')[0].trim() : '';
  const stateList = input.licensedStates.length ? input.licensedStates.join(', ') : '';

  // Hook variants
  const HOOKS: readonly string[] = [
    `If you're ${audience.toLowerCase()} and you've been told ${topic} isn't for you — read this.`,
    `Three things ${audience.toLowerCase()} miss about ${topic}. (Most LOs won't tell you #3.)`,
    `${topic} — explained in plain English by your local wholesale broker.`,
    `The ${topic} mistake costing ${audience.toLowerCase()} real money.`,
    `What I wish ${audience.toLowerCase()} knew about ${topic} before talking to a bank.`,
  ];

  // Bodies by format
  const BODIES: Record<Format, readonly string[]> = {
    Social: [
      `Here's the wholesale move most borrowers miss: working with a broker who shops 60+ wholesale lenders instead of one bank desk. That's how I help ${audience.toLowerCase()} get pricing the retail side can't match.`,
      `Most banks have ONE pricing engine. I have access to 60+ wholesale lender partners. For ${audience.toLowerCase()}, that usually means more program options and a sharper rate.`,
      `Quick math on ${topic}: same borrower, same scenario, two pricing paths — wholesale broker vs. retail bank. The wholesale path almost always wins.`,
    ],
    Email: [
      `Quick note from ${input.loName}.\n\nA lot of ${audience.toLowerCase()} are sitting on questions about ${topic}. I'd rather you ask me than guess. Below is the plain-English rundown.\n\n1. What ${topic} actually means for your situation.\n2. The wholesale-broker advantage — 60+ lender partners, one application.\n3. What we'd need from you to give you real numbers (no rate quotes until we run them).`,
      `Hey — I put together a short guide on ${topic} for ${audience.toLowerCase()} in our market. Plain language, no fluff. Reply "send it" and I'll forward.`,
    ],
    Video: [
      `[Hook on camera, 3 sec] "${HOOKS[0]}"\n\n[Cut to b-roll, 5–8 sec] Visual: ${audience.toLowerCase()} in your local market.\n\n[On camera] One short story about a real client (no PII, no loan number). What they were told vs. what we actually did.\n\n[On camera, close] CTA: "DM me 'INFO' — I'll walk you through it."\n\n[End card] Loan Factory wordmark + your NMLS + Equal Housing Lender.`,
    ],
    'Landing Page': [
      `H1: ${topic} for ${audience.toLowerCase()}.\nSub: Wholesale-broker pricing through Loan Factory's 60+ lender partners. Real numbers. No surprise fees baked into rate.\n\nSection 1 — Why ${audience.toLowerCase()} ask me about ${topic}.\nSection 2 — How a wholesale broker is different from a bank loan officer.\nSection 3 — What we need from you to get specific numbers.\nSection 4 — Quick contact form (no SSN, no income docs — that comes later).`,
    ],
    Webinar: [
      `Title: ${topic} for ${audience.toLowerCase()}.\n\nDuration: 45 min · format: Zoom\n\nAgenda:\n• Why ${topic} matters right now\n• Three myths ${audience.toLowerCase()} hear (and what's actually true)\n• Walk-through of a real wholesale-broker scenario (anonymized — no PII)\n• Q&A — I stay until every question is answered\n• Next steps: how to get real numbers if you're ready`,
    ],
  };

  // CTAs by format
  const CTAS: Record<Format, readonly string[]> = {
    Social: [
      `Comment "INFO" and I'll send you the plain-English breakdown.`,
      `DM me — happy to walk through your numbers, no pressure.`,
      `Tap the link in bio to schedule a 15-minute call.`,
    ],
    Email: [
      `Reply with a good time to call and I'll get on the phone.`,
      `Forward this to anyone in ${audience.toLowerCase()} who might want it.`,
    ],
    Video: [`DM me "INFO" and I'll walk you through it personally.`],
    'Landing Page': [`Tell me about your situation — I'll get back within one business day.`],
    Webinar: [`Save your seat — limited to 50 people so I can answer every question.`],
  };

  const hook = pick(HOOKS, seed);
  const body = pick(BODIES[input.format], seed + 'b');
  const cta = pick(CTAS[input.format], seed + 'c');

  const personaLine = persona ? `\n\n(In ${persona.toLowerCase()} — staying on-brand.)` : '';

  const footerBits = [
    `${input.loName}, NMLS #${input.loNmls}`,
    `Loan Factory, NMLS #${LOAN_FACTORY_COMPANY_NMLS}`,
    'Equal Housing Lender',
  ];
  if (stateList) footerBits.push(`Licensed: ${stateList}`);
  const footer = footerBits.join(' · ');

  const caption = `${hook}\n\n${body}\n\n${cta}${personaLine}\n\n${footer}`;
  const visual = `Visual: ${
    input.templateTitle ? input.templateTitle + ' base layout. ' : ''
  }Loan Factory wordmark equal-or-larger than ${input.loName}. Include Equal Housing Lender mark in footer. NMLS #${input.loNmls} and Loan Factory NMLS #${LOAN_FACTORY_COMPANY_NMLS} visible. No rate numbers in the image unless APR shown at same size.`;

  return { caption, visual };
}

export default function ContentStudioPage() {
  const u = currentUserProfile;
  const [mode, setMode] = useState<StudioMode>('guided');
  const [guidedStep, setGuidedStep] = useState(0);

  const [goal, setGoal] = useState('');
  const [audience, setAudience] = useState('');
  const [templateId, setTemplateId] = useState<string>('');
  const [channels, setChannels] = useState<ContentChannel[]>(['Instagram']);
  const [format, setFormat] = useState<Format>('Social');
  const [topicOrOffer, setTopicOrOffer] = useState('');
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
    // Server-action swap-in point: when MiniMax / OpenAI is wired, POST these
    // same fields to /api/ai/generate and use its caption + visual in place
    // of the local generateDraft call. The compliance sidebar already runs
    // against whatever is rendered into the caption + visualNotes fields.
    const { caption: draftCaption, visual } = generateDraft({
      format,
      goal,
      audience,
      topic: topicOrOffer,
      templateTitle: chosenTemplate?.title ?? '',
      channels,
      loName: u.preferred_display_name,
      loNmls: u.nmls_number,
      persona: u.persona_summary ?? '',
      licensedStates: u.licensed_states,
    });
    setCaption(draftCaption);
    setVisualNotes(visual);
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

  function applyGuidedFormat(f: Format) {
    setFormat(f);
    const matched = FORMATS.find((x) => x.key === f);
    if (matched) setChannels(matched.channels);
  }

  function finishGuided() {
    // Merge guided answers into the underlying state.
    const goalText = goal || (topicOrOffer ? `Educate around: ${topicOrOffer}` : '');
    if (!goal) setGoal(goalText);
    // Switch to advanced for caption editing + compliance review.
    setMode('advanced');
  }

  return (
    <>
      <Topbar
        title="Content Studio"
        subtitle="Draft a compliant asset. Generation is a placeholder — every output is marked Draft, requires Marketing review, and never publishes externally."
        rightSlot={
          <div className="inline-flex items-center bg-[var(--color-lf-surface)] border border-[var(--color-lf-border)] rounded-full p-0.5 text-xs font-bold">
            <button
              type="button"
              onClick={() => setMode('guided')}
              className={`px-3 py-1.5 rounded-full transition-colors ${
                mode === 'guided'
                  ? 'bg-[var(--color-lf-orange)] text-white'
                  : 'text-[var(--color-lf-muted)] hover:text-[var(--color-lf-black)]'
              }`}
            >
              Guided
            </button>
            <button
              type="button"
              onClick={() => setMode('advanced')}
              className={`px-3 py-1.5 rounded-full transition-colors ${
                mode === 'advanced'
                  ? 'bg-[var(--color-lf-black)] text-white'
                  : 'text-[var(--color-lf-muted)] hover:text-[var(--color-lf-black)]'
              }`}
            >
              Advanced
            </button>
          </div>
        }
      />

      <div className="px-5 sm:px-8 py-8 grid lg:grid-cols-3 gap-6">
        {/* Left: form */}
        <section className="lg:col-span-2 space-y-5">
          {/* ============== GUIDED WIZARD — 4 simple steps ============== */}
          {mode === 'guided' && (
            <div className="bg-white border border-[var(--color-lf-border)] rounded-2xl p-6 sm:p-7">
              <div className="flex items-center justify-between mb-4">
                <span className="inline-flex items-center gap-1.5 bg-[var(--color-lf-orange-soft)] text-[var(--color-lf-orange-dark)] text-[10px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-full">
                  <Wand2 size={11} /> Guided Mode · 4 steps
                </span>
                <p className="text-[11px] text-[var(--color-lf-muted)]">
                  Step {guidedStep + 1} of 4
                </p>
              </div>

              {/* Progress bar */}
              <div className="h-1.5 bg-[var(--color-lf-surface)] rounded-full overflow-hidden mb-6">
                <div
                  className="h-full bg-[var(--color-lf-orange)] transition-all"
                  style={{ width: `${((guidedStep + 1) / 4) * 100}%` }}
                />
              </div>

              {/* Step 1 — Format + Audience (combined) */}
              {guidedStep === 0 && (
                <GuidedStep
                  question="What are we creating, and for who?"
                  hint="Pick a format, then write a one-line audience."
                >
                  <p className="text-[10px] font-bold uppercase tracking-widest text-[var(--color-lf-muted)] mb-2">
                    Format
                  </p>
                  <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 mb-5">
                    {FORMATS.map((f) => (
                      <button
                        key={f.key}
                        type="button"
                        onClick={() => applyGuidedFormat(f.key)}
                        className={`text-xs font-semibold px-3 py-3 rounded-xl border transition-colors ${
                          format === f.key
                            ? 'bg-[var(--color-lf-orange)] border-[var(--color-lf-orange)] text-white'
                            : 'bg-white border-[var(--color-lf-border)] text-[var(--color-lf-muted)] hover:border-[var(--color-lf-orange)] hover:text-[var(--color-lf-orange-dark)]'
                        }`}
                      >
                        {f.key}
                      </button>
                    ))}
                  </div>
                  <p className="text-[10px] font-bold uppercase tracking-widest text-[var(--color-lf-muted)] mb-2">
                    Audience
                  </p>
                  <input
                    type="text"
                    value={audience}
                    onChange={(e) => setAudience(e.target.value)}
                    placeholder="Veterans in Jacksonville, first-time buyers in St. Augustine, etc."
                    className="w-full bg-white border border-[var(--color-lf-border)] rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-lf-orange)]/30 focus:border-[var(--color-lf-orange)]"
                  />
                </GuidedStep>
              )}

              {/* Step 2 — Goal */}
              {guidedStep === 1 && (
                <GuidedStep
                  question="What is the goal?"
                  hint="Pick the closest fit — you can tweak the wording."
                >
                  <div className="flex flex-wrap gap-2 mb-3">
                    {GUIDED_GOALS.map((g) => (
                      <button
                        key={g}
                        type="button"
                        onClick={() => setGoal(g)}
                        className={`text-xs font-semibold px-3 py-1.5 rounded-full border transition-colors ${
                          goal === g
                            ? 'bg-[var(--color-lf-black)] border-[var(--color-lf-black)] text-white'
                            : 'bg-white border-[var(--color-lf-border)] text-[var(--color-lf-muted)] hover:border-[var(--color-lf-black)] hover:text-[var(--color-lf-black)]'
                        }`}
                      >
                        {g}
                      </button>
                    ))}
                  </div>
                  <input
                    type="text"
                    value={goal}
                    onChange={(e) => setGoal(e.target.value)}
                    placeholder="Or write your own goal."
                    className="w-full bg-white border border-[var(--color-lf-border)] rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-lf-orange)]/30 focus:border-[var(--color-lf-orange)]"
                  />
                </GuidedStep>
              )}

              {/* Step 3 — Topic + Template (combined) */}
              {guidedStep === 2 && (
                <GuidedStep
                  question="What's the topic, and any template to start from?"
                  hint="One short phrase for the topic. Skip the template if you'd rather start fresh."
                >
                  <p className="text-[10px] font-bold uppercase tracking-widest text-[var(--color-lf-muted)] mb-2">
                    Topic or offer
                  </p>
                  <input
                    type="text"
                    value={topicOrOffer}
                    onChange={(e) => setTopicOrOffer(e.target.value)}
                    placeholder="VA zero-down, FHA down-payment myths, DSCR portfolio strategy…"
                    className="w-full bg-white border border-[var(--color-lf-border)] rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-lf-orange)]/30 focus:border-[var(--color-lf-orange)] mb-5"
                  />
                  <p className="text-[10px] font-bold uppercase tracking-widest text-[var(--color-lf-muted)] mb-2">
                    Template (optional)
                  </p>
                  <select
                    value={templateId}
                    onChange={(e) => setTemplateId(e.target.value)}
                    className="w-full bg-white border border-[var(--color-lf-border)] rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-lf-orange)]/30 focus:border-[var(--color-lf-orange)]"
                  >
                    <option value="">No template — free-form</option>
                    {marketingTemplates.map((t) => (
                      <option key={t.id} value={t.id}>
                        {t.title}
                      </option>
                    ))}
                  </select>
                </GuidedStep>
              )}

              {/* Step 4 — Review answers + generate */}
              {guidedStep === 3 && (
                <GuidedStep
                  question="Ready to generate your draft?"
                  hint="We'll compose a starting draft from your answers. Compliance checks run as it appears."
                >
                  <ul className="space-y-1.5 text-sm text-[var(--color-lf-black)] bg-[var(--color-lf-surface)] border border-[var(--color-lf-border)] rounded-xl p-4 mb-4">
                    <li>
                      <span className="text-[var(--color-lf-muted)]">Format: </span>
                      <span className="font-bold">{format}</span>
                    </li>
                    <li>
                      <span className="text-[var(--color-lf-muted)]">Audience: </span>
                      <span className="font-bold">{audience || '—'}</span>
                    </li>
                    <li>
                      <span className="text-[var(--color-lf-muted)]">Goal: </span>
                      <span className="font-bold">{goal || '—'}</span>
                    </li>
                    <li>
                      <span className="text-[var(--color-lf-muted)]">Topic: </span>
                      <span className="font-bold">{topicOrOffer || '—'}</span>
                    </li>
                    <li>
                      <span className="text-[var(--color-lf-muted)]">Template: </span>
                      <span className="font-bold">
                        {chosenTemplate?.title || 'Free-form'}
                      </span>
                    </li>
                    <li>
                      <span className="text-[var(--color-lf-muted)]">Channels: </span>
                      <span className="font-bold">{channels.join(', ')}</span>
                    </li>
                  </ul>
                </GuidedStep>
              )}

              {/* Nav */}
              <div className="flex items-center justify-between mt-6 pt-5 border-t border-[var(--color-lf-border)]">
                <button
                  type="button"
                  onClick={() => setGuidedStep((s) => Math.max(0, s - 1))}
                  disabled={guidedStep === 0}
                  className="text-xs font-semibold text-[var(--color-lf-muted)] hover:text-[var(--color-lf-black)] disabled:opacity-30"
                >
                  ← Back
                </button>
                {guidedStep < 3 ? (
                  <button
                    type="button"
                    onClick={() => setGuidedStep((s) => Math.min(3, s + 1))}
                    className="inline-flex items-center gap-1 bg-[var(--color-lf-orange)] hover:bg-[var(--color-lf-orange-dark)] text-white text-sm font-bold px-5 py-2.5 rounded-xl"
                  >
                    Continue <ArrowRight size={13} />
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={() => {
                      handleGenerate();
                      finishGuided();
                    }}
                    className="inline-flex items-center gap-1.5 bg-[var(--color-lf-orange)] hover:bg-[var(--color-lf-orange-dark)] text-white text-sm font-bold px-5 py-2.5 rounded-xl shadow-sm shadow-[var(--color-lf-orange)]/20"
                  >
                    <Sparkles size={14} /> Generate Draft
                  </button>
                )}
              </div>

              <p className="text-[11px] text-[var(--color-lf-muted)] mt-4 leading-relaxed">
                Every output is a <span className="font-bold">Draft</span>, requires{' '}
                <span className="font-bold">Marketing review</span>, and is{' '}
                <span className="font-bold">never auto-posted</span>.
              </p>
            </div>
          )}

          {/* ============== ADVANCED MODE: full form ============== */}
          {mode === 'advanced' && (
            <>
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
                className="inline-flex items-center gap-2 bg-[var(--color-lf-orange)] hover:bg-[var(--color-lf-orange-dark)] text-white font-bold text-sm px-5 py-2.5 rounded-xl transition-colors shadow-sm shadow-[var(--color-lf-orange)]/20"
              >
                <Sparkles size={14} />
                Generate Draft
              </button>
              <p className="text-[11px] text-[var(--color-lf-muted)] mt-2 leading-relaxed">
                Generates a starting draft from your inputs. Compliance checks run as it appears in
                the caption box. MiniMax provider takes over when env vars are enabled.
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
            </>
          )}
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

function GuidedStep({
  question,
  hint,
  children,
}: {
  question: string;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <h3 className="text-lg font-black text-[var(--color-lf-black)] tracking-tight mb-1">
        {question}
      </h3>
      {hint && (
        <p className="text-xs text-[var(--color-lf-muted)] mb-4 leading-relaxed">{hint}</p>
      )}
      <div>{children}</div>
    </div>
  );
}
