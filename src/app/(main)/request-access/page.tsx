'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  ArrowRight,
  CheckCircle2,
  ClipboardCheck,
  Globe,
  ShieldCheck,
  Sparkles,
  Users,
} from 'lucide-react';
import type {
  AccessRequestInput,
  GroupType,
  RequesterRole,
} from '@/lib/request-access-types';
import { APPROVAL_AUDIENCE } from '@/lib/request-access-types';

const ROLES: RequesterRole[] = [
  'Team Leader',
  'Group Leader',
  'Loan Officer',
  'Marketing',
  'Corporate Coach',
  'Other',
];

const GROUP_TYPES: GroupType[] = ['Solo LO', 'Team', 'Group', 'Branch', 'Corporate'];

const EMPTY: AccessRequestInput = {
  full_name: '',
  preferred_display_name: '',
  loan_factory_email: '',
  phone: '',
  nmls_number: '',
  licensed_states: '',
  current_role: '',
  is_team_or_group_leader: false,
  corporate_coach: '',
  team_name: '',
  group_type: '',
  primary_markets: '',
  languages_served: '',
  loan_focus_areas: '',
  expected_team_members: '',
  is_pilot_request: true,
  marketing_goals: '',
  current_website: '',
  google_business_profile_url: '',
  social_profile_links: '',
  support_needs: '',
  notes: '',
};

const inputClass =
  'w-full bg-white border border-[var(--color-lf-border)] rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-lf-orange)]/30 focus:border-[var(--color-lf-orange)]';

function FieldLabel({ children, required }: { children: React.ReactNode; required?: boolean }) {
  return (
    <span className="block text-xs font-bold uppercase tracking-widest text-[var(--color-lf-muted)] mb-1.5">
      {children}
      {required && <span className="text-[var(--color-lf-orange)] ml-1">*</span>}
    </span>
  );
}

export default function RequestAccessPage() {
  const [form, setForm] = useState<AccessRequestInput>(EMPTY);
  const [submitted, setSubmitted] = useState(false);

  function setField<K extends keyof AccessRequestInput>(
    key: K,
    value: AccessRequestInput[K],
  ) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    // TODO(supabase): insert into access_requests with status='new' and notify
    // the approval audience listed in APPROVAL_AUDIENCE.
    try {
      if (typeof window !== 'undefined') {
        sessionStorage.setItem(
          'lfa_last_access_request',
          JSON.stringify({ ...form, submitted_at: new Date().toISOString() }),
        );
      }
    } catch {
      /* ignore */
    }
    setSubmitted(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  const requiredOk =
    !!form.full_name.trim() &&
    !!form.loan_factory_email.trim() &&
    !!form.nmls_number.trim() &&
    !!form.current_role &&
    !!form.group_type &&
    !!form.licensed_states.trim() &&
    !!form.primary_markets.trim();

  if (submitted) {
    return (
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-16">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-[var(--color-lf-orange-soft)] text-[var(--color-lf-orange)] mb-5">
            <ClipboardCheck size={28} />
          </div>
          <h1 className="text-3xl font-black text-[var(--color-lf-black)] mb-2 tracking-tight">
            Your request has been submitted for review.
          </h1>
          <p className="text-[var(--color-lf-muted)] max-w-lg mx-auto">
            Jeremy, Victoria, Andre, and Marketing can review your request in the admin intake queue.
            You will hear back within 1–2 business days.
          </p>
        </div>

        <div className="bg-white border border-[var(--color-lf-border)] rounded-2xl p-6 mb-6">
          <p className="text-xs font-bold uppercase tracking-widest text-[var(--color-lf-muted)] mb-3">
            What happens next
          </p>
          <ul className="space-y-3 text-sm text-[var(--color-lf-black)]">
            {[
              'Your request enters the admin intake inbox.',
              'A reviewer checks NMLS, licensed states, and pilot fit.',
              'Reviewer may request more info, approve, or send back.',
              'When approved, a workspace is created and you get a notification.',
            ].map((line) => (
              <li key={line} className="flex items-start gap-2.5">
                <CheckCircle2 size={16} className="text-[var(--color-lf-orange)] mt-0.5 shrink-0" />
                <span>{line}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="bg-[var(--color-lf-surface)] border border-[var(--color-lf-border)] rounded-2xl p-6 mb-6">
          <p className="text-xs font-bold uppercase tracking-widest text-[var(--color-lf-muted)] mb-3">
            Who reviews your request
          </p>
          <ul className="grid sm:grid-cols-2 gap-2 text-sm">
            {APPROVAL_AUDIENCE.map((reviewer) => (
              <li key={reviewer} className="flex items-center gap-2">
                <Users size={13} className="text-[var(--color-lf-orange)]" />
                <span className="text-[var(--color-lf-black)]">{reviewer}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="grid sm:grid-cols-2 gap-3">
          <Link
            href="/"
            className="inline-flex items-center justify-center gap-2 bg-[var(--color-lf-orange)] hover:bg-[var(--color-lf-orange-dark)] text-white font-bold px-4 py-3 rounded-xl"
          >
            Back to Home <ArrowRight size={15} />
          </Link>
          <Link
            href="/templates-examples"
            className="inline-flex items-center justify-center gap-2 bg-[var(--color-lf-surface)] hover:bg-gray-100 text-[var(--color-lf-black)] font-semibold px-4 py-3 rounded-xl border border-[var(--color-lf-border)]"
          >
            Browse Templates
          </Link>
        </div>

        <p className="text-[11px] text-[var(--color-lf-muted)] text-center mt-8 leading-relaxed">
          Loan Factory, NMLS #320841 · Equal Housing Lender · Demo mode: requests are not yet
          persisted server-side. Marketing reviews every pilot participant before workspace creation.
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12">
      {/* Header */}
      <div className="text-center mb-10">
        <span className="inline-flex items-center gap-1.5 bg-[var(--color-lf-orange-soft)] text-[var(--color-lf-orange-dark)] text-[11px] font-bold uppercase tracking-[0.18em] px-3 py-1 rounded-full mb-3">
          <Sparkles size={11} /> 1+1+1=5 Pilot
        </span>
        <h1 className="text-4xl font-black text-[var(--color-lf-black)] mb-3 tracking-tight">
          Request access to AI Advantage.
        </h1>
        <p className="text-[var(--color-lf-muted)] max-w-2xl mx-auto">
          Tell us about your team. Marketing will review your request and, when approved, spin up
          your Team Leader workspace with branded templates, compliance checks, and the shared Team
          Library.
        </p>
      </div>

      {/* Why-row */}
      <section className="grid sm:grid-cols-3 gap-3 mb-10">
        {[
          {
            icon: <Globe size={16} className="text-[var(--color-lf-orange)]" />,
            title: 'Built for Team Leaders',
            body: 'Website, landing-page, funnel, and recruiting templates — wholesale-broker positioning.',
          },
          {
            icon: <ShieldCheck size={16} className="text-[var(--color-lf-orange)]" />,
            title: 'Compliance baked in',
            body: 'NMLS, APR parity, Equal Housing Lender, and state-specific rules checked on every draft.',
          },
          {
            icon: <Users size={16} className="text-[var(--color-lf-orange)]" />,
            title: 'Marketing-reviewed',
            body: 'Every public asset goes through a real reviewer before publish. No live external posting.',
          },
        ].map((c) => (
          <div
            key={c.title}
            className="bg-white border border-[var(--color-lf-border)] rounded-2xl p-4"
          >
            <div className="w-8 h-8 rounded-lg bg-[var(--color-lf-orange-soft)] flex items-center justify-center mb-2">
              {c.icon}
            </div>
            <p className="text-sm font-bold text-[var(--color-lf-black)]">{c.title}</p>
            <p className="text-xs text-[var(--color-lf-muted)] mt-1 leading-relaxed">{c.body}</p>
          </div>
        ))}
      </section>

      {/* Form */}
      <form
        onSubmit={onSubmit}
        className="bg-white border border-[var(--color-lf-border)] rounded-3xl p-6 sm:p-8 space-y-8"
      >
        {/* Identity */}
        <section>
          <h2 className="text-sm font-bold uppercase tracking-widest text-[var(--color-lf-muted)] mb-4">
            Your identity
          </h2>
          <div className="grid sm:grid-cols-2 gap-4">
            <label>
              <FieldLabel required>Full name</FieldLabel>
              <input
                className={inputClass}
                value={form.full_name}
                onChange={(e) => setField('full_name', e.target.value)}
                placeholder="Jeremy McDonald"
                autoComplete="name"
              />
            </label>
            <label>
              <FieldLabel>Preferred display name</FieldLabel>
              <input
                className={inputClass}
                value={form.preferred_display_name}
                onChange={(e) => setField('preferred_display_name', e.target.value)}
                placeholder="What clients call you"
              />
            </label>
            <label>
              <FieldLabel required>Loan Factory email</FieldLabel>
              <input
                type="email"
                className={inputClass}
                value={form.loan_factory_email}
                onChange={(e) => setField('loan_factory_email', e.target.value)}
                placeholder="you@loanfactory.com"
                autoComplete="email"
              />
            </label>
            <label>
              <FieldLabel>Phone</FieldLabel>
              <input
                className={inputClass}
                value={form.phone}
                onChange={(e) => setField('phone', e.target.value)}
                placeholder="(904) 555-0100"
                autoComplete="tel"
              />
            </label>
            <label>
              <FieldLabel required>NMLS number</FieldLabel>
              <input
                className={inputClass}
                value={form.nmls_number}
                onChange={(e) => setField('nmls_number', e.target.value)}
                placeholder="1195266"
              />
            </label>
            <label>
              <FieldLabel required>Licensed states</FieldLabel>
              <input
                className={inputClass}
                value={form.licensed_states}
                onChange={(e) => setField('licensed_states', e.target.value)}
                placeholder="FL, GA"
              />
            </label>
          </div>
        </section>

        {/* Role */}
        <section>
          <h2 className="text-sm font-bold uppercase tracking-widest text-[var(--color-lf-muted)] mb-4">
            Your role
          </h2>
          <div className="grid sm:grid-cols-2 gap-4">
            <label>
              <FieldLabel required>Current role</FieldLabel>
              <select
                className={`${inputClass} bg-white`}
                value={form.current_role}
                onChange={(e) => setField('current_role', e.target.value as RequesterRole)}
              >
                <option value="">Pick one…</option>
                {ROLES.map((r) => (
                  <option key={r} value={r}>
                    {r}
                  </option>
                ))}
              </select>
            </label>
            <label>
              <FieldLabel required>Group type</FieldLabel>
              <select
                className={`${inputClass} bg-white`}
                value={form.group_type}
                onChange={(e) => setField('group_type', e.target.value as GroupType)}
              >
                <option value="">Pick one…</option>
                {GROUP_TYPES.map((g) => (
                  <option key={g} value={g}>
                    {g}
                  </option>
                ))}
              </select>
            </label>
            <label className="flex items-start gap-2 sm:col-span-2 text-sm pt-2">
              <input
                type="checkbox"
                className="mt-1"
                checked={form.is_team_or_group_leader}
                onChange={(e) => setField('is_team_or_group_leader', e.target.checked)}
              />
              <span className="text-[var(--color-lf-black)]">
                I am a Team Leader or Group Leader (not a solo LO).
              </span>
            </label>
            <label>
              <FieldLabel>Corporate coach</FieldLabel>
              <input
                className={inputClass}
                value={form.corporate_coach}
                onChange={(e) => setField('corporate_coach', e.target.value)}
                placeholder="If you have one"
              />
            </label>
            <label>
              <FieldLabel>Team name</FieldLabel>
              <input
                className={inputClass}
                value={form.team_name}
                onChange={(e) => setField('team_name', e.target.value)}
                placeholder="The Legends Mortgage Team"
              />
            </label>
          </div>
          <p className="text-[11px] text-amber-700 bg-amber-50 border border-amber-100 rounded-md px-2 py-1.5 mt-3">
            Team names are <span className="font-bold">not allowed</span> on marketing materials for
            LOs licensed in NJ or RI. Marketing will confirm during review.
          </p>
        </section>

        {/* Market */}
        <section>
          <h2 className="text-sm font-bold uppercase tracking-widest text-[var(--color-lf-muted)] mb-4">
            Market & focus
          </h2>
          <div className="grid sm:grid-cols-2 gap-4">
            <label className="sm:col-span-2">
              <FieldLabel required>Primary markets</FieldLabel>
              <input
                className={inputClass}
                value={form.primary_markets}
                onChange={(e) => setField('primary_markets', e.target.value)}
                placeholder="Jacksonville FL, St. Augustine FL, Fleming Island FL"
              />
            </label>
            <label>
              <FieldLabel>Languages served</FieldLabel>
              <input
                className={inputClass}
                value={form.languages_served}
                onChange={(e) => setField('languages_served', e.target.value)}
                placeholder="English, Spanish"
              />
            </label>
            <label>
              <FieldLabel>Loan focus areas</FieldLabel>
              <input
                className={inputClass}
                value={form.loan_focus_areas}
                onChange={(e) => setField('loan_focus_areas', e.target.value)}
                placeholder="VA, FHA, DSCR, First-Time Buyer"
              />
            </label>
            <label>
              <FieldLabel>Expected team members</FieldLabel>
              <input
                className={inputClass}
                value={form.expected_team_members}
                onChange={(e) => setField('expected_team_members', e.target.value)}
                placeholder="1, 3, 10…"
              />
            </label>
            <label className="flex items-start gap-2 sm:col-span-2 text-sm pt-2">
              <input
                type="checkbox"
                className="mt-1"
                checked={form.is_pilot_request}
                onChange={(e) => setField('is_pilot_request', e.target.checked)}
              />
              <span className="text-[var(--color-lf-black)]">
                This is for the <span className="font-bold">1+1+1=5 pilot</span>.
              </span>
            </label>
          </div>
        </section>

        {/* Goals + presence */}
        <section>
          <h2 className="text-sm font-bold uppercase tracking-widest text-[var(--color-lf-muted)] mb-4">
            Goals & online presence
          </h2>
          <div className="space-y-4">
            <label className="block">
              <FieldLabel>Marketing goals</FieldLabel>
              <textarea
                rows={3}
                className={`${inputClass} resize-y leading-relaxed`}
                value={form.marketing_goals}
                onChange={(e) => setField('marketing_goals', e.target.value)}
                placeholder="What are you trying to accomplish in the next 90 days?"
              />
            </label>
            <div className="grid sm:grid-cols-2 gap-4">
              <label>
                <FieldLabel>Current website</FieldLabel>
                <input
                  className={inputClass}
                  value={form.current_website}
                  onChange={(e) => setField('current_website', e.target.value)}
                  placeholder="https://yoursite.com"
                />
              </label>
              <label>
                <FieldLabel>Google Business Profile</FieldLabel>
                <input
                  className={inputClass}
                  value={form.google_business_profile_url}
                  onChange={(e) => setField('google_business_profile_url', e.target.value)}
                  placeholder="https://g.page/r/..."
                />
              </label>
              <label className="sm:col-span-2">
                <FieldLabel>Social profile links</FieldLabel>
                <input
                  className={inputClass}
                  value={form.social_profile_links}
                  onChange={(e) => setField('social_profile_links', e.target.value)}
                  placeholder="Instagram, Facebook, LinkedIn, TikTok — comma-separated"
                />
              </label>
              <label className="sm:col-span-2">
                <FieldLabel>Support needs</FieldLabel>
                <textarea
                  rows={3}
                  className={`${inputClass} resize-y`}
                  value={form.support_needs}
                  onChange={(e) => setField('support_needs', e.target.value)}
                  placeholder="What help do you need from Marketing or Training?"
                />
              </label>
              <label className="sm:col-span-2">
                <FieldLabel>Notes</FieldLabel>
                <textarea
                  rows={2}
                  className={`${inputClass} resize-y`}
                  value={form.notes}
                  onChange={(e) => setField('notes', e.target.value)}
                  placeholder="Anything else we should know."
                />
              </label>
            </div>
          </div>
        </section>

        {/* Submit */}
        <div className="border-t border-[var(--color-lf-border)] pt-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <p className="text-[11px] text-[var(--color-lf-muted)] max-w-md leading-relaxed">
            Loan Factory, NMLS #320841 · Equal Housing Lender · By submitting you agree to follow the
            Loan Factory Marketing Policy. Demo mode — requests stay in browser state until Supabase
            persistence lands.
          </p>
          <button
            type="submit"
            disabled={!requiredOk}
            className="inline-flex items-center gap-2 bg-[var(--color-lf-orange)] hover:bg-[var(--color-lf-orange-dark)] disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-bold px-6 py-3 rounded-xl transition-colors"
          >
            Submit request <ArrowRight size={16} />
          </button>
        </div>
      </form>
    </div>
  );
}
