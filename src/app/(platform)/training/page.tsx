'use client';

import { useState } from 'react';
import { ArrowRight, ClipboardCopy, FileText, Sparkles, Target, Users } from 'lucide-react';
import Topbar from '@/components/platform/Topbar';
import ComplianceBadge from '@/components/platform/ComplianceBadge';

interface TrainingKit {
  id: string;
  title: string;
  audience: string;
  goal: string;
  format: 'Webinar' | 'Workshop' | 'Class' | 'Lunch & Learn' | 'Strategy Session' | 'Presentation';
  length: string;
  includes: string[];
  followUps: string[];
  compliance: 'pre-approved' | 'needs-personalization' | 'state-restricted';
}

const KITS: TrainingKit[] = [
  {
    id: 'tr_ftb_webinar',
    title: 'First-Time Homebuyer Webinar',
    audience: 'Realtor partners + first-time buyers',
    goal: 'Generate first-time buyer leads through Realtor co-marketing.',
    format: 'Webinar',
    length: '45 min',
    includes: ['Slide deck', 'Email invite copy', 'Registration landing page', 'Q&A script'],
    followUps: ['Thank-you email', 'Pre-approval invitation', '14-day nurture sequence'],
    compliance: 'pre-approved',
  },
  {
    id: 'tr_va_buyer_workshop',
    title: 'VA Buyer Workshop',
    audience: 'Veterans + Realtor partners',
    goal: 'Teach the real benefits of VA zero-down and convert into pre-approvals.',
    format: 'Workshop',
    length: '60 min',
    includes: ['Slide deck', '"VA myths vs. facts" handout', 'Veteran intake worksheet'],
    followUps: ['Follow-up email', 'VA scenario one-pager', 'Realtor partner deck'],
    compliance: 'pre-approved',
  },
  {
    id: 'tr_realtor_lunch_learn',
    title: 'Realtor Lunch & Learn',
    audience: 'Local Realtor partners',
    goal: 'Open Realtor referral relationships with a low-pressure 30-minute session.',
    format: 'Lunch & Learn',
    length: '30 min',
    includes: ['Slide deck', 'Co-marketing flyer template', 'Conversation guide'],
    followUps: ['Thank-you note copy', 'Joint listing flyer template', 'Quarterly review prompt'],
    compliance: 'pre-approved',
  },
  {
    id: 'tr_dscr_basics',
    title: 'Investor DSCR Basics',
    audience: 'Buy-and-hold investors, real-estate groups',
    goal: 'Educate investors on DSCR qualifying so they bring deals to you.',
    format: 'Lunch & Learn',
    length: '40 min',
    includes: ['Slide deck', 'DSCR sample scenarios', 'Investor checklist'],
    followUps: ['Portfolio review invite', 'DSCR rate explainer (with APR)', '1031 timeline'],
    compliance: 'needs-personalization',
  },
  {
    id: 'tr_credit_readiness',
    title: 'Credit Readiness Class',
    audience: 'Future buyers + Realtor partners',
    goal: 'Move pre-qualified prospects into mortgage-ready territory.',
    format: 'Class',
    length: '45 min',
    includes: ['Slide deck', '"What lenders see" worksheet', '90-day credit-prep plan'],
    followUps: ['Follow-up email', 'Refer-a-buyer prompt', 'Credit-review invitation'],
    compliance: 'pre-approved',
  },
  {
    id: 'tr_new_construction',
    title: 'New Construction Buyer Class',
    audience: 'New-construction shoppers + builder reps',
    goal: 'Position your team as the go-to LO for new-build financing.',
    format: 'Class',
    length: '40 min',
    includes: ['Slide deck', 'Builder-partner conversation guide', 'Timeline handout'],
    followUps: ['Builder lunch invite', 'Construction-loan one-pager', '30-day check-in'],
    compliance: 'pre-approved',
  },
  {
    id: 'tr_spanish_buyer',
    title: 'Spanish Buyer Education',
    audience: 'Spanish-speaking first-time buyers',
    goal: 'Make homeownership math accessible to Spanish-speaking buyers.',
    format: 'Class',
    length: '45 min',
    includes: ['Slide deck (Español)', 'Plain-language down-payment guide', 'Invite copy (Español)'],
    followUps: ['Bilingual follow-up email', 'WhatsApp-ready summary', 'Realtor referral handoff'],
    compliance: 'pre-approved',
  },
  {
    id: 'tr_recruiting',
    title: 'Recruiting Presentation',
    audience: 'Prospective LOs joining your team',
    goal: 'Show prospective LOs why your team + Loan Factory beats their current setup.',
    format: 'Presentation',
    length: '30 min',
    includes: ['Slide deck', 'Wholesale comp explainer', 'Team support overview'],
    followUps: ['Recruiter follow-up email', '1:1 interview agenda', 'Onboarding checklist'],
    compliance: 'pre-approved',
  },
  {
    id: 'tr_ai_for_los',
    title: 'AI for Loan Officers',
    audience: 'Your team LOs',
    goal: 'Get the team using AI Twin + Content Studio safely inside the compliance loop.',
    format: 'Workshop',
    length: '90 min',
    includes: ['Slide deck', 'AI Twin setup checklist', 'Compliance recap'],
    followUps: ['Practice exercise', 'Office hours invite', 'First-week feedback survey'],
    compliance: 'pre-approved',
  },
];

export default function TrainingPage() {
  const [created, setCreated] = useState<Set<string>>(new Set());
  const [busy, setBusy] = useState<string | null>(null);

  function createKit(id: string) {
    setBusy(id);
    // TODO(supabase): insert into training_kits with status='draft' + assigned reviewer.
    setTimeout(() => {
      setCreated((prev) => new Set(prev).add(id));
      setBusy(null);
    }, 700);
  }

  return (
    <>
      <Topbar
        title="Training & Webinars"
        subtitle="Plug-and-play kits for teaching Realtors, buyers, and your own team. Demo mode — Create Training Kit copies the kit into your workspace as Draft."
      />

      <div className="px-5 sm:px-8 py-8 space-y-6">
        <section className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {KITS.map((kit) => {
            const wasCreated = created.has(kit.id);
            return (
              <article
                key={kit.id}
                className="bg-white border border-[var(--color-lf-border)] rounded-2xl overflow-hidden flex flex-col"
              >
                <div className="bg-gradient-to-br from-[var(--color-lf-orange)] to-[var(--color-lf-orange-dark)] h-24 px-5 py-4 text-white flex flex-col justify-between">
                  <span className="text-[10px] font-bold uppercase tracking-widest opacity-90">
                    {kit.format} · {kit.length}
                  </span>
                  <p className="text-sm font-bold leading-tight">{kit.title}</p>
                </div>
                <div className="p-5 flex-1 flex flex-col">
                  <div className="flex items-center gap-2 mb-1">
                    <Users size={12} className="text-[var(--color-lf-orange)]" />
                    <p className="text-[11px] text-[var(--color-lf-muted)] uppercase tracking-widest font-bold">
                      {kit.audience}
                    </p>
                  </div>
                  <div className="flex items-start gap-2 mb-2">
                    <Target size={12} className="text-[var(--color-lf-orange)] mt-0.5 shrink-0" />
                    <p className="text-[12px] text-[var(--color-lf-black)] leading-snug">
                      {kit.goal}
                    </p>
                  </div>
                  <ComplianceBadge kind={kit.compliance} className="mb-3" />

                  <p className="text-[10px] font-bold uppercase tracking-widest text-[var(--color-lf-muted)] mb-1.5">
                    Included
                  </p>
                  <ul className="space-y-1 text-xs text-[var(--color-lf-muted)] mb-3">
                    {kit.includes.map((inc) => (
                      <li key={inc} className="flex items-start gap-2">
                        <FileText size={11} className="mt-0.5 text-[var(--color-lf-orange)]" />
                        <span>{inc}</span>
                      </li>
                    ))}
                  </ul>

                  <p className="text-[10px] font-bold uppercase tracking-widest text-[var(--color-lf-muted)] mb-1.5">
                    Follow-ups
                  </p>
                  <ul className="space-y-1 text-xs text-[var(--color-lf-muted)] mb-4">
                    {kit.followUps.map((f) => (
                      <li key={f} className="flex items-start gap-2">
                        <ArrowRight size={11} className="mt-0.5 text-[var(--color-lf-orange)]" />
                        <span>{f}</span>
                      </li>
                    ))}
                  </ul>

                  <div className="mt-auto flex items-center gap-2 pt-3 border-t border-gray-50">
                    <button
                      type="button"
                      onClick={() => createKit(kit.id)}
                      disabled={busy === kit.id || wasCreated}
                      className={`inline-flex items-center gap-1 text-xs font-bold px-3 py-1.5 rounded-lg transition-colors ${
                        wasCreated
                          ? 'bg-green-50 text-green-700 border border-green-100'
                          : 'text-white bg-[var(--color-lf-orange)] hover:bg-[var(--color-lf-orange-dark)] disabled:bg-gray-300'
                      }`}
                    >
                      {wasCreated ? (
                        <>
                          <Sparkles size={12} /> Kit created
                        </>
                      ) : busy === kit.id ? (
                        'Creating…'
                      ) : (
                        <>
                          <ClipboardCopy size={12} /> Create Training Kit
                        </>
                      )}
                    </button>
                    <span className="text-[10px] text-[var(--color-lf-muted)] ml-auto">
                      Draft → Needs Marketing Review
                    </span>
                  </div>
                </div>
              </article>
            );
          })}
        </section>

        <section className="bg-[var(--color-lf-orange-soft)] border border-orange-100 rounded-3xl p-8 text-center">
          <h2 className="text-2xl font-black text-[var(--color-lf-black)] tracking-tight mb-2">
            Need a custom kit?
          </h2>
          <p className="text-[var(--color-lf-muted)] mb-5">
            Ask Marketing to spin up a Realtor-partner or pilot-launch training tailored to your team.
          </p>
          <a
            href="mailto:marketing@loanfactory.com?subject=Custom%20training%20kit%20request"
            className="inline-flex items-center gap-2 bg-[var(--color-lf-orange)] hover:bg-[var(--color-lf-orange-dark)] text-white font-bold px-5 py-2.5 rounded-xl"
          >
            Request a custom kit <ArrowRight size={14} />
          </a>
        </section>
      </div>
    </>
  );
}
