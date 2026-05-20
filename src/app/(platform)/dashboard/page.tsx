'use client';

import Link from 'next/link';
import {
  ArrowRight,
  CheckCircle2,
  Clock,
  Sparkles,
} from 'lucide-react';
import Topbar from '@/components/platform/Topbar';
import ComplianceBadge from '@/components/platform/ComplianceBadge';
import { useDemoRole } from '@/components/platform/useDemoRole';
import {
  contentDrafts,
  currentUserProfile,
  sharedTeamAssets,
} from '@/lib/platform-mock-data';
import {
  THREE_ACTIONS,
  TODAYS_NEXT_MOVE,
  getRoleById,
} from '@/lib/demo-roles';

export default function PlatformDashboardPage() {
  const u = currentUserProfile;
  const role = useDemoRole();
  const activeRole = getRoleById(role);

  const next = TODAYS_NEXT_MOVE[role];
  const actions = THREE_ACTIONS[role];

  // Workspace setup checklist — same source of truth for the progress card.
  const setupSteps = [
    { key: 'profile', label: 'Complete profile basics', done: u.profile_completion_pct >= 60 },
    { key: 'photo', label: 'Upload profile photo', done: !!u.profile_image_url },
    { key: 'ai-ref', label: 'Upload AI reference image', done: !!u.ai_reference_image_url },
    { key: 'persona', label: 'Upload persona document', done: !!u.persona_document_url },
    { key: 'brand-voice', label: 'Upload brand voice document', done: !!u.brand_voice_document_url },
    { key: 'first-template', label: 'Choose first template', done: false },
    { key: 'ai-twin', label: 'Start AI Twin chat', done: false },
    {
      key: 'first-submit',
      label: 'Submit first asset for review',
      done: contentDrafts.some((d) => d.status === 'Needs Review'),
    },
  ];
  const setupDone = setupSteps.filter((s) => s.done).length;
  const setupTotal = setupSteps.length;
  const setupPct = Math.round((setupDone / setupTotal) * 100);

  // Pending review queue
  const pendingReview = contentDrafts.filter((d) => d.status === 'Needs Review');

  // Recent activity — most recent drafts + library shares, merged + sorted
  const activity = [
    ...contentDrafts.map((d) => ({
      key: `draft-${d.id}`,
      kind: 'Draft updated',
      title: d.title,
      at: d.updated_at,
    })),
    ...sharedTeamAssets.map((a) => ({
      key: `share-${a.id}`,
      kind: 'Team Library share',
      title: a.title,
      at: a.shared_at,
    })),
  ]
    .sort((a, b) => (a.at < b.at ? 1 : -1))
    .slice(0, 5);

  return (
    <>
      <Topbar
        title={`Welcome back, ${u.preferred_display_name.split(' ')[0]}.`}
        subtitle={`Viewing as ${activeRole.name} · ${u.licensed_states.join(', ')} · Loan Factory NMLS #320841`}
      />

      <div className="px-5 sm:px-8 py-8 space-y-8">
        {/* ============================ TODAY'S NEXT MOVE ============================ */}
        <section className="bg-white border border-[var(--color-lf-border)] rounded-3xl p-6 sm:p-8 flex flex-col lg:flex-row items-start lg:items-center gap-6 justify-between">
          <div className="flex-1 min-w-0">
            <span className="inline-flex items-center gap-1.5 bg-[var(--color-lf-orange-soft)] text-[var(--color-lf-orange-dark)] text-[10px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-full mb-2">
              <Sparkles size={11} /> Today&apos;s next move
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-[var(--color-lf-black)] tracking-tight leading-tight">
              {next.title}
            </h2>
            <p className="text-[var(--color-lf-muted)] mt-2 max-w-xl text-sm leading-relaxed">
              {next.body}
            </p>
          </div>
          <Link
            href={next.cta_href}
            className="inline-flex items-center gap-2 bg-[var(--color-lf-orange)] hover:bg-[var(--color-lf-orange-dark)] text-white font-bold px-6 py-3.5 rounded-xl text-sm transition-colors shadow-sm shadow-[var(--color-lf-orange)]/20 shrink-0"
          >
            {next.cta_label} <ArrowRight size={14} />
          </Link>
        </section>

        {/* ============================ THREE ACTIONS ============================ */}
        <section>
          <h3 className="text-xs font-bold uppercase tracking-widest text-[var(--color-lf-muted)] mb-3">
            Pick one
          </h3>
          <div className="grid sm:grid-cols-3 gap-4">
            {actions.map((a, idx) => (
              <Link
                key={a.title}
                href={a.href}
                className="group bg-white border border-[var(--color-lf-border)] rounded-2xl p-6 hover:border-[var(--color-lf-orange)] hover:shadow-md transition-all"
              >
                <div className="text-3xl font-black text-gray-100 tracking-tighter leading-none mb-3">
                  0{idx + 1}
                </div>
                <p className="text-base font-bold text-[var(--color-lf-black)] leading-tight">
                  {a.title}
                </p>
                <span className="inline-flex items-center gap-1 text-[11px] font-bold text-[var(--color-lf-orange-dark)] mt-3 group-hover:underline">
                  Open <ArrowRight size={11} />
                </span>
              </Link>
            ))}
          </div>
        </section>

        {/* ============================ THREE STATUS CARDS ============================ */}
        <section className="grid lg:grid-cols-3 gap-4">
          {/* Progress */}
          <div className="bg-white border border-[var(--color-lf-border)] rounded-2xl p-6">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-xs font-bold uppercase tracking-widest text-[var(--color-lf-muted)]">
                Workspace setup
              </h3>
              <span className="text-2xl font-black text-[var(--color-lf-black)]">
                {setupPct}%
              </span>
            </div>
            <div className="h-2 bg-[var(--color-lf-surface)] rounded-full overflow-hidden mb-3">
              <div
                className="h-full bg-[var(--color-lf-orange)] transition-all"
                style={{ width: `${setupPct}%` }}
              />
            </div>
            <p className="text-[11px] text-[var(--color-lf-muted)] mb-3">
              {setupDone} of {setupTotal} complete
            </p>
            <Link
              href="/profile"
              className="inline-flex items-center gap-1 text-xs font-bold text-[var(--color-lf-orange-dark)] hover:underline"
            >
              Continue setup <ArrowRight size={11} />
            </Link>
          </div>

          {/* Pending review queue */}
          <div className="bg-white border border-[var(--color-lf-border)] rounded-2xl p-6">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-xs font-bold uppercase tracking-widest text-[var(--color-lf-muted)]">
                Pending review
              </h3>
              <span className="text-2xl font-black text-[var(--color-lf-black)]">
                {pendingReview.length}
              </span>
            </div>
            {pendingReview.length === 0 ? (
              <p className="text-sm text-[var(--color-lf-muted)]">Nothing waiting.</p>
            ) : (
              <ul className="space-y-2">
                {pendingReview.slice(0, 3).map((d) => (
                  <li key={d.id} className="flex items-start gap-2">
                    <CheckCircle2
                      size={12}
                      className="text-[var(--color-lf-orange)] mt-0.5 shrink-0"
                    />
                    <span className="text-[12px] text-[var(--color-lf-black)] line-clamp-1">
                      {d.title}
                    </span>
                  </li>
                ))}
              </ul>
            )}
            <Link
              href="/admin"
              className="mt-3 inline-flex items-center gap-1 text-xs font-bold text-[var(--color-lf-orange-dark)] hover:underline"
            >
              Open Marketing review queue <ArrowRight size={11} />
            </Link>
          </div>

          {/* Recent activity */}
          <div className="bg-white border border-[var(--color-lf-border)] rounded-2xl p-6">
            <h3 className="text-xs font-bold uppercase tracking-widest text-[var(--color-lf-muted)] mb-3">
              Recent activity
            </h3>
            <ul className="space-y-2.5">
              {activity.map((a) => (
                <li key={a.key} className="flex items-start gap-2">
                  <Clock size={12} className="text-gray-400 mt-0.5 shrink-0" />
                  <div className="min-w-0 flex-1">
                    <p className="text-[12px] font-semibold text-[var(--color-lf-black)] line-clamp-1">
                      {a.title}
                    </p>
                    <p className="text-[10px] text-[var(--color-lf-muted)]">
                      {a.kind} ·{' '}
                      {new Date(a.at).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                      })}
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* Compliance footer */}
        <section className="bg-[var(--color-lf-surface)] border border-[var(--color-lf-border)] rounded-2xl p-4 flex items-start gap-3">
          <ComplianceBadge kind="approved" label="Compliance" />
          <p className="text-[11px] text-[var(--color-lf-muted)] leading-relaxed flex-1">
            Every public asset routes through Marketing review before publish. Loan Factory NMLS
            #320841 · Equal Housing Lender · APR required if rates appear · No unsupported claims ·
            No borrower data.
          </p>
        </section>
      </div>
    </>
  );
}
