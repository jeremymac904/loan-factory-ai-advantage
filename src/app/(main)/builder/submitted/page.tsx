'use client';

import { useSyncExternalStore } from 'react';
import Link from 'next/link';
import {
  ArrowRight,
  CheckCircle2,
  ClipboardCheck,
  LayoutDashboard,
  Pencil,
  RotateCw,
} from 'lucide-react';

interface SubmissionSummary {
  template: string;
  full_name: string;
  preferred_display_name: string;
  nmls_number: string;
  email: string;
  submitted_at: string;
}

/**
 * Read the last submission summary from sessionStorage. SSR snapshot is null —
 * the value materializes after hydration. Using useSyncExternalStore is the
 * idiomatic way to bridge a non-React data source without triggering the
 * react-hooks/set-state-in-effect lint.
 *
 * The snapshot is cached so referential identity is stable between renders —
 * without this, useSyncExternalStore would infinite-loop because JSON.parse
 * returns a new object every call.
 */
let cachedSnapshotRaw: string | null = null;
let cachedSnapshotValue: SubmissionSummary | null = null;

function subscribe(callback: () => void): () => void {
  if (typeof window === 'undefined') return () => {};
  window.addEventListener('storage', callback);
  return () => window.removeEventListener('storage', callback);
}

function readSummary(): SubmissionSummary | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = window.sessionStorage.getItem('lfa_last_submission');
    if (raw === cachedSnapshotRaw) return cachedSnapshotValue;
    cachedSnapshotRaw = raw;
    cachedSnapshotValue = raw ? (JSON.parse(raw) as SubmissionSummary) : null;
    return cachedSnapshotValue;
  } catch {
    cachedSnapshotRaw = null;
    cachedSnapshotValue = null;
    return null;
  }
}

export default function BuilderSubmittedPage() {
  const summary = useSyncExternalStore<SubmissionSummary | null>(
    subscribe,
    readSummary,
    () => null,
  );

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-16">
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-[var(--color-lf-orange-soft)] text-[var(--color-lf-orange)] mb-5">
          <ClipboardCheck size={28} />
        </div>
        <h1 className="text-3xl font-black text-[var(--color-lf-black)] mb-2 tracking-tight">
          Draft submitted for Marketing review
        </h1>
        <p className="text-[var(--color-lf-muted)] max-w-lg mx-auto">
          Marketing will review your draft for brand and compliance. You will get a notification when
          there is an update. Publishing happens only after a reviewer approves.
        </p>
      </div>

      {/* Status card */}
      <div className="bg-white border border-[var(--color-lf-border)] rounded-2xl p-6 mb-6">
        <div className="flex items-center justify-between gap-3 mb-5">
          <p className="text-xs font-bold uppercase tracking-widest text-[var(--color-lf-muted)]">
            Current status
          </p>
          <span className="inline-flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wide px-3 py-1 rounded-full bg-yellow-50 text-yellow-800 border border-yellow-100">
            <span className="w-1.5 h-1.5 rounded-full bg-yellow-500" />
            Pending Review
          </span>
        </div>
        <ul className="space-y-3 text-sm text-[var(--color-lf-black)]">
          {[
            'Draft entered the Marketing review queue.',
            'A reviewer will check brand consistency, NMLS, state-specific disclosures, and the Equal Housing Lender mark.',
            'The reviewer may approve, request changes, or send the draft back to you.',
            'Publishing happens only after a reviewer approves — there is no automated external posting in this pilot.',
          ].map((line) => (
            <li key={line} className="flex items-start gap-2.5">
              <CheckCircle2
                size={16}
                className="text-[var(--color-lf-orange)] mt-0.5 shrink-0"
              />
              <span>{line}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Submission summary */}
      {summary && (
        <div className="bg-[var(--color-lf-surface)] border border-[var(--color-lf-border)] rounded-2xl p-6 mb-6">
          <p className="text-xs font-bold uppercase tracking-widest text-[var(--color-lf-muted)] mb-3">
            Your submission
          </p>
          <dl className="grid sm:grid-cols-2 gap-3 text-sm">
            <div>
              <dt className="text-[var(--color-lf-muted)]">Template</dt>
              <dd className="font-semibold text-[var(--color-lf-black)]">{summary.template}</dd>
            </div>
            <div>
              <dt className="text-[var(--color-lf-muted)]">Name</dt>
              <dd className="font-semibold text-[var(--color-lf-black)]">
                {summary.preferred_display_name || summary.full_name}
              </dd>
            </div>
            <div>
              <dt className="text-[var(--color-lf-muted)]">NMLS</dt>
              <dd className="font-semibold text-[var(--color-lf-black)]">
                #{summary.nmls_number}
              </dd>
            </div>
            <div>
              <dt className="text-[var(--color-lf-muted)]">Submitted</dt>
              <dd className="font-semibold text-[var(--color-lf-black)]">
                {new Date(summary.submitted_at).toLocaleString('en-US', {
                  month: 'short',
                  day: 'numeric',
                  hour: 'numeric',
                  minute: '2-digit',
                })}
              </dd>
            </div>
            <div className="sm:col-span-2">
              <dt className="text-[var(--color-lf-muted)]">Confirmation email</dt>
              <dd className="font-semibold text-[var(--color-lf-black)]">{summary.email}</dd>
            </div>
          </dl>
        </div>
      )}

      {/* Actions */}
      <div className="grid sm:grid-cols-3 gap-3">
        <Link
          href="/dashboard"
          className="inline-flex items-center justify-center gap-2 bg-[var(--color-lf-orange)] hover:bg-[var(--color-lf-orange-dark)] text-white font-bold px-4 py-3 rounded-xl"
        >
          <LayoutDashboard size={16} /> Open Dashboard
        </Link>
        <Link
          href="/builder"
          className="inline-flex items-center justify-center gap-2 bg-[var(--color-lf-surface)] hover:bg-gray-100 text-[var(--color-lf-black)] font-semibold px-4 py-3 rounded-xl border border-[var(--color-lf-border)]"
        >
          <Pencil size={15} /> Edit Submission
        </Link>
        <Link
          href="/builder"
          className="inline-flex items-center justify-center gap-2 text-[var(--color-lf-muted)] hover:text-[var(--color-lf-black)] font-semibold px-4 py-3"
        >
          <RotateCw size={15} /> Start Another Draft
        </Link>
      </div>

      <p className="text-[11px] text-[var(--color-lf-muted)] text-center mt-8 leading-relaxed">
        Loan Factory, NMLS #320841 · Equal Housing Lender · This is not a commitment to lend. All
        loan applications are subject to credit and property approval.
      </p>

      <p className="text-[11px] text-[var(--color-lf-muted)] text-center mt-4">
        Demo note: until Supabase persistence is wired, this confirmation is the only record. Once
        wired, the draft will appear in the Marketing admin queue with an audit trail.
      </p>

      <Link
        href="/templates-examples"
        className="mt-8 mx-auto block w-fit text-sm font-semibold text-[var(--color-lf-orange-dark)] hover:underline inline-flex items-center gap-1"
      >
        Browse more templates <ArrowRight size={13} />
      </Link>
    </div>
  );
}
