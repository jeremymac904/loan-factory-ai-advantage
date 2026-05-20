'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import {
  AlertTriangle,
  ArrowRight,
  CheckCircle2,
  ImageIcon,
  Mic,
  ShieldAlert,
  ShieldCheck,
  Sparkles,
  Wand2,
} from 'lucide-react';
import Topbar from '@/components/platform/Topbar';
import UploadCard from '@/components/platform/UploadCard';
import { currentUserProfile } from '@/lib/platform-mock-data';

const inputClass =
  'w-full bg-white border border-[var(--color-lf-border)] rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-lf-orange)]/30 focus:border-[var(--color-lf-orange)]';

export default function AiTwinPage() {
  const u = currentUserProfile;

  const [persona, setPersona] = useState(u.persona_summary ?? '');
  const [tone, setTone] = useState('Confident, plainspoken, family-first.');
  const [doNotSay, setDoNotSay] = useState(
    'lowest rate · best rate · guaranteed approval · no closing costs · we fund · we underwrite',
  );
  const [audience, setAudience] = useState(
    'First-time buyers in Northeast Florida; VA-eligible veterans; small-portfolio investors.',
  );
  const [topics, setTopics] = useState(
    'VA zero-down strategy, FHA down-payment reality, DSCR myths, wholesale broker advantage.',
  );
  const [sampleCaption, setSampleCaption] = useState('');
  const [sampleScript, setSampleScript] = useState('');
  const [offLimitTopics, setOffLimitTopics] = useState(
    'Borrower names, loan numbers, credit scores, income docs, rate guarantees.',
  );
  const [generated, setGenerated] = useState(false);

  function generatePreview() {
    // TODO(ai): swap for a server action that hits /api/ai/generate with task='agent-response'.
    setGenerated(true);
  }

  // Readiness model — every check filled = +1.
  const readinessItems = useMemo(
    () => [
      { key: 'persona', label: 'Persona summary', done: persona.trim().length > 20 },
      { key: 'tone', label: 'Tone preferences', done: tone.trim().length > 5 },
      { key: 'audience', label: 'Preferred audience', done: audience.trim().length > 5 },
      { key: 'topics', label: 'Approved topics', done: topics.trim().length > 5 },
      { key: 'do-not-say', label: 'Do-not-say list', done: doNotSay.trim().length > 5 },
      { key: 'off-limits', label: 'Off-limit topics', done: offLimitTopics.trim().length > 5 },
      { key: 'sample-caption', label: 'Sample social caption', done: sampleCaption.trim().length > 20 },
      { key: 'sample-script', label: 'Sample video script', done: sampleScript.trim().length > 20 },
      { key: 'headshot', label: 'Headshot on file', done: !!u.profile_image_url },
      { key: 'ai-reference', label: 'AI reference image uploaded', done: !!u.ai_reference_image_url },
      { key: 'brand-voice', label: 'Brand voice document uploaded', done: !!u.brand_voice_document_url },
      { key: 'persona-doc', label: 'Persona document uploaded', done: !!u.persona_document_url },
    ],
    [
      persona,
      tone,
      audience,
      topics,
      doNotSay,
      offLimitTopics,
      sampleCaption,
      sampleScript,
      u.profile_image_url,
      u.ai_reference_image_url,
      u.brand_voice_document_url,
      u.persona_document_url,
    ],
  );
  const readyCount = readinessItems.filter((i) => i.done).length;
  const readyPct = Math.round((readyCount / readinessItems.length) * 100);
  const missing = readinessItems.filter((i) => !i.done);

  return (
    <>
      <Topbar
        title="AI Twin Setup"
        subtitle="Set up your AI content voice. The provider stays in demo mode until MiniMax is approved — outputs below are deterministic previews."
      />

      <div className="px-5 sm:px-8 py-8 grid lg:grid-cols-3 gap-6">
        {/* Inputs */}
        <section className="lg:col-span-2 space-y-5">
          {/* Sensitive-data warning */}
          <div className="bg-red-50 border border-red-100 rounded-2xl p-4 flex items-start gap-3">
            <ShieldAlert size={18} className="text-red-600 mt-0.5 shrink-0" />
            <div>
              <p className="font-bold text-red-800 text-sm">
                Never upload borrower documents or private loan data.
              </p>
              <p className="text-xs text-red-700 mt-1 leading-relaxed">
                The AI Twin only consumes your <span className="font-bold">own</span> persona,
                tone, samples, and reference photos. Do not upload borrower files, credit reports,
                income docs, IDs, statements, loan numbers, or non-public personal information of
                any client. If something has client data on it, redact it before uploading or do
                not upload it at all.
              </p>
            </div>
          </div>

          <div className="bg-white border border-[var(--color-lf-border)] rounded-2xl p-6 space-y-5">
            <h2 className="text-sm font-bold uppercase tracking-widest text-[var(--color-lf-muted)]">
              Voice inputs
            </h2>
            <Field label="Persona summary" hint="2–4 sentences. Tone, audience, what you stand for.">
              <textarea
                rows={3}
                className={`${inputClass} resize-y leading-relaxed`}
                value={persona}
                onChange={(e) => setPersona(e.target.value)}
              />
            </Field>
            <div className="grid sm:grid-cols-2 gap-4">
              <Field label="Tone preferences">
                <input
                  className={inputClass}
                  value={tone}
                  onChange={(e) => setTone(e.target.value)}
                />
              </Field>
              <Field label="Preferred audience">
                <input
                  className={inputClass}
                  value={audience}
                  onChange={(e) => setAudience(e.target.value)}
                />
              </Field>
            </div>
            <Field
              label="Do-not-say list"
              hint="Phrases the AI Twin must never produce. Comma- or pipe-separated."
            >
              <input
                className={inputClass}
                value={doNotSay}
                onChange={(e) => setDoNotSay(e.target.value)}
              />
            </Field>
            <Field label="Approved topics" hint="What you want most of your content to cover.">
              <input
                className={inputClass}
                value={topics}
                onChange={(e) => setTopics(e.target.value)}
              />
            </Field>
            <Field
              label="Off-limit topics"
              hint="Topics the AI Twin must never produce — even if asked."
            >
              <input
                className={inputClass}
                value={offLimitTopics}
                onChange={(e) => setOffLimitTopics(e.target.value)}
              />
            </Field>
          </div>

          <div className="bg-white border border-[var(--color-lf-border)] rounded-2xl p-6 space-y-5">
            <h2 className="text-sm font-bold uppercase tracking-widest text-[var(--color-lf-muted)]">
              Samples (optional)
            </h2>
            <Field label="Sample social caption">
              <textarea
                rows={3}
                className={`${inputClass} resize-y leading-relaxed`}
                value={sampleCaption}
                onChange={(e) => setSampleCaption(e.target.value)}
                placeholder="Drop one of your best posts here. The AI Twin uses it to match your cadence."
              />
            </Field>
            <Field label="Sample video script">
              <textarea
                rows={3}
                className={`${inputClass} resize-y leading-relaxed`}
                value={sampleScript}
                onChange={(e) => setSampleScript(e.target.value)}
                placeholder="A 30–60 second script that sounds like you on camera."
              />
            </Field>
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            <UploadCard
              title="Headshot"
              bucket="profile-images"
              accept="image/*"
              description="Used across your site and dashboard."
              existingFileName={u.profile_image_url ? 'current-headshot.jpg' : undefined}
            />
            <UploadCard
              title="AI reference image"
              bucket="reference-images"
              accept="image/*"
              description="A clear photo of you. Used to generate consistent marketing visuals."
              helperText="No borrower data or private loan information in reference images."
            />
            <UploadCard
              title="Brand voice document"
              bucket="brand-assets"
              accept=".pdf,.docx,.md,.txt"
              description="Optional. Sample posts, taglines, off-limits phrases."
            />
            <UploadCard
              title="Persona document"
              bucket="persona-documents"
              accept=".pdf,.docx,.md,.txt"
              description="Tone, audience, brand voice, compliance preferences."
            />
          </div>

          <div className="flex items-center justify-between flex-wrap gap-3">
            <p className="text-[11px] text-[var(--color-lf-muted)] max-w-md leading-relaxed">
              {u.licensed_states.join(', ')} · NMLS #{u.nmls_number} · Loan Factory, NMLS #320841 ·
              Equal Housing Lender. Compliance footer auto-attached to every AI Twin draft.
            </p>
            <button
              type="button"
              onClick={generatePreview}
              className="inline-flex items-center gap-2 bg-[var(--color-lf-orange)] hover:bg-[var(--color-lf-orange-dark)] text-white font-bold px-5 py-2.5 rounded-xl"
            >
              <Wand2 size={14} /> Generate Preview
              <span className="text-[10px] uppercase font-bold tracking-widest bg-white/20 px-1.5 py-0.5 rounded">
                Demo
              </span>
            </button>
          </div>
        </section>

        {/* Outputs */}
        <aside className="space-y-5 lg:sticky lg:top-20 self-start">
          {/* Readiness score */}
          <div className="bg-white border border-[var(--color-lf-border)] rounded-2xl p-5">
            <div className="flex items-center justify-between mb-3">
              <p className="text-xs font-bold uppercase tracking-widest text-[var(--color-lf-muted)]">
                AI Twin readiness
              </p>
              <span className="text-2xl font-black text-[var(--color-lf-black)]">{readyPct}%</span>
            </div>
            <div className="h-2 bg-[var(--color-lf-surface)] rounded-full overflow-hidden mb-3">
              <div
                className="h-full bg-[var(--color-lf-orange)] transition-all"
                style={{ width: `${readyPct}%` }}
              />
            </div>
            <p className="text-[11px] text-[var(--color-lf-muted)] mb-2">
              {readyCount} of {readinessItems.length} inputs complete
            </p>
            {missing.length > 0 && (
              <ul className="space-y-1 text-[11px] mt-3 max-h-40 overflow-auto">
                {missing.slice(0, 6).map((m) => (
                  <li key={m.key} className="flex items-start gap-2 text-[var(--color-lf-muted)]">
                    <AlertTriangle size={11} className="mt-0.5 text-amber-500 shrink-0" />
                    <span>{m.label}</span>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* MiniMax provider status */}
          <div className="bg-white border border-[var(--color-lf-border)] rounded-2xl p-5">
            <div className="flex items-center gap-2 mb-2">
              <ShieldCheck size={14} className="text-[var(--color-lf-orange)]" />
              <p className="text-xs font-bold uppercase tracking-widest text-[var(--color-lf-muted)]">
                MiniMax status
              </p>
            </div>
            <div className="flex items-center gap-2 mb-1">
              <span className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wide px-2 py-0.5 rounded-full bg-yellow-50 text-yellow-800 border border-yellow-100">
                <span className="w-1.5 h-1.5 rounded-full bg-yellow-500" /> Demo mode
              </span>
            </div>
            <p className="text-[11px] text-[var(--color-lf-muted)] leading-relaxed">
              The MiniMax provider stays in demo mode until <code className="font-bold">AI_PROVIDER=minimax</code>,{' '}
              <code className="font-bold">AI_FEATURES_ENABLED=true</code>, plus the server-side
              MiniMax env vars are set in Netlify. Live MiniMax calls require Marketing &amp; IT
              approval first.
            </p>
            <Link
              href="/settings"
              className="mt-2 inline-flex items-center gap-1 text-[11px] font-bold text-[var(--color-lf-orange-dark)] hover:underline"
            >
              Provider settings <ArrowRight size={10} />
            </Link>
          </div>

          {!generated ? (
            <div className="bg-[var(--color-lf-orange-soft)] border border-orange-100 rounded-2xl p-5 text-center">
              <Sparkles
                size={20}
                className="mx-auto text-[var(--color-lf-orange)] mb-2"
              />
              <p className="text-sm font-bold text-[var(--color-lf-black)]">
                AI Twin preview will appear here.
              </p>
              <p className="text-xs text-[var(--color-lf-muted)] mt-1 leading-relaxed">
                Fill in the inputs and click <span className="font-bold">Generate Preview</span>.
                Demo only — live MiniMax generation lands once approved.
              </p>
            </div>
          ) : (
            <>
              <PreviewCard
                title="Content voice profile"
                icon={<Mic size={14} />}
                body={persona || 'Confident, plainspoken, family-first.'}
              />
              <PreviewCard
                title="Social post style guide"
                icon={<Sparkles size={14} />}
                body={`Opening hook → specific number → CTA + compliance footer. Tone: ${tone}. Avoid: ${doNotSay}.`}
              />
              <PreviewCard
                title="Video script style guide"
                icon={<Mic size={14} />}
                body="3-second hook → relatable scenario → wholesale-broker insight → soft CTA. 30–60s. Sub-titles required."
              />
              <PreviewCard
                title="Image prompt style guide"
                icon={<ImageIcon size={14} />}
                body="Reference subject is the LO. Loan Factory navy + orange brand. Clean modern composition. No fake metrics, no rate numbers in image."
              />
              <PreviewCard
                title="Reusable campaign angles"
                icon={<Sparkles size={14} />}
                body="VA zero-down, FHA reality check, DSCR myths, Realtor co-marketing, first-time buyer roadmap."
              />
            </>
          )}

          <div className="bg-white border border-[var(--color-lf-border)] rounded-2xl p-5">
            <p className="text-xs font-bold uppercase tracking-widest text-[var(--color-lf-muted)] mb-2">
              Ready to draft?
            </p>
            <p className="text-xs text-[var(--color-lf-muted)] mb-3 leading-relaxed">
              Take this profile into Content Studio and start drafting compliant posts in your voice.
            </p>
            <Link
              href="/content-studio"
              className="inline-flex items-center gap-1 text-xs font-bold text-[var(--color-lf-orange-dark)] hover:underline"
            >
              Open Content Studio <ArrowRight size={11} />
            </Link>
          </div>
        </aside>
      </div>
    </>
  );
}

function Field({
  label,
  hint,
  children,
}: {
  label: string;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="block text-[10px] font-bold uppercase tracking-widest text-[var(--color-lf-muted)] mb-1.5">
        {label}
      </span>
      {children}
      {hint && <p className="text-[11px] text-[var(--color-lf-muted)] mt-1">{hint}</p>}
    </label>
  );
}

function PreviewCard({
  title,
  icon,
  body,
}: {
  title: string;
  icon: React.ReactNode;
  body: string;
}) {
  return (
    <div className="bg-white border border-[var(--color-lf-border)] rounded-2xl p-4">
      <div className="flex items-center gap-2 mb-1">
        <span className="w-7 h-7 rounded-md bg-[var(--color-lf-orange-soft)] text-[var(--color-lf-orange-dark)] flex items-center justify-center">
          {icon}
        </span>
        <p className="text-xs font-bold uppercase tracking-widest text-[var(--color-lf-muted)]">
          {title}
        </p>
        <CheckCircle2 size={12} className="ml-auto text-green-600" />
      </div>
      <p className="text-sm text-[var(--color-lf-black)] leading-relaxed">{body}</p>
    </div>
  );
}
