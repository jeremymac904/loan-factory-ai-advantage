'use client';

import { ArrowRight, ClipboardCopy, FileText, Send, Users, Video } from 'lucide-react';
import Topbar from '@/components/platform/Topbar';
import ComplianceBadge from '@/components/platform/ComplianceBadge';

interface TrainingKit {
  id: string;
  title: string;
  audience: string;
  format: 'Webinar' | 'Workshop' | 'Class' | 'Lunch & Learn' | 'Strategy Session';
  length: string;
  includes: string[];
  compliance: 'pre-approved' | 'needs-personalization' | 'state-restricted';
}

const KITS: TrainingKit[] = [
  {
    id: 'tr_ftb_webinar',
    title: 'First-Time Homebuyer Realtor Webinar',
    audience: 'Realtor partners + first-time buyers',
    format: 'Webinar',
    length: '45 min',
    includes: ['Slide deck', 'Email invite copy', 'Follow-up email', 'Q&A script'],
    compliance: 'pre-approved',
  },
  {
    id: 'tr_va_realtor',
    title: 'VA Buyer Realtor Training',
    audience: 'Realtor partners',
    format: 'Workshop',
    length: '60 min',
    includes: ['Slide deck', '"VA myths" handout', 'Follow-up email'],
    compliance: 'pre-approved',
  },
  {
    id: 'tr_fha_basics',
    title: 'FHA Buyer Basics Class',
    audience: 'First-time buyers',
    format: 'Class',
    length: '30 min',
    includes: ['Slide deck', 'Down-payment scenarios', 'Invite copy'],
    compliance: 'pre-approved',
  },
  {
    id: 'tr_credit_prep',
    title: 'Credit Prep Workshop',
    audience: 'Future buyers, partner Realtors',
    format: 'Workshop',
    length: '45 min',
    includes: ['Slide deck', '"What lenders see" worksheet', 'Follow-up email'],
    compliance: 'pre-approved',
  },
  {
    id: 'tr_dscr_lunch',
    title: 'DSCR Investor Lunch & Learn',
    audience: 'Investors, real-estate groups',
    format: 'Lunch & Learn',
    length: '40 min',
    includes: ['Slide deck', 'DSCR scenarios', 'Calendar invite copy'],
    compliance: 'needs-personalization',
  },
  {
    id: 'tr_listing_strategy',
    title: 'Listing Agent Marketing Strategy Session',
    audience: 'Listing agents',
    format: 'Strategy Session',
    length: '60 min',
    includes: ['Workbook', 'Co-marketing flyer', 'Follow-up email'],
    compliance: 'pre-approved',
  },
  {
    id: 'tr_ai_for_los',
    title: 'AI for Loan Officers Training',
    audience: 'Team LOs',
    format: 'Workshop',
    length: '90 min',
    includes: ['Slide deck', 'AI Twin setup guide', 'Compliance recap'],
    compliance: 'pre-approved',
  },
  {
    id: 'tr_111_5_launch',
    title: '1+1+1=5 Team Launch Training',
    audience: 'New pilot Team Leaders',
    format: 'Workshop',
    length: '120 min',
    includes: ['Onboarding deck', 'Workspace checklist', 'Marketing review walkthrough'],
    compliance: 'pre-approved',
  },
];

export default function TrainingPage() {
  function flash(id: string, action: string) {
    console.info(`[demo] ${action} training kit ${id}`);
  }

  return (
    <>
      <Topbar
        title="Training & Webinars"
        subtitle="Plug-and-play kits for teaching Realtors, buyers, and your own team. Demo mode — all actions are local until publishing is wired."
      />

      <div className="px-5 sm:px-8 py-8 space-y-6">
        <section className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {KITS.map((kit) => (
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
                <div className="flex items-center gap-2 mb-2">
                  <Users size={12} className="text-[var(--color-lf-orange)]" />
                  <p className="text-[11px] text-[var(--color-lf-muted)] uppercase tracking-widest font-bold">
                    {kit.audience}
                  </p>
                </div>
                <ComplianceBadge kind={kit.compliance} className="mb-3" />
                <ul className="space-y-1.5 text-xs text-[var(--color-lf-muted)] mb-4">
                  {kit.includes.map((inc) => (
                    <li key={inc} className="flex items-start gap-2">
                      <FileText size={11} className="mt-0.5 text-[var(--color-lf-orange)]" />
                      <span>{inc}</span>
                    </li>
                  ))}
                </ul>

                <div className="mt-auto flex flex-wrap gap-2 pt-3 border-t border-gray-50">
                  <button
                    type="button"
                    onClick={() => flash(kit.id, 'clone')}
                    className="inline-flex items-center gap-1 text-xs font-bold text-white bg-[var(--color-lf-orange)] hover:bg-[var(--color-lf-orange-dark)] px-3 py-1.5 rounded-lg"
                  >
                    <ClipboardCopy size={12} /> Clone Kit
                  </button>
                  <button
                    type="button"
                    onClick={() => flash(kit.id, 'invite copy')}
                    className="inline-flex items-center gap-1 text-xs font-semibold text-[var(--color-lf-muted)] hover:text-[var(--color-lf-black)]"
                  >
                    <Send size={12} /> Invite copy
                  </button>
                  <button
                    type="button"
                    onClick={() => flash(kit.id, 'follow-up')}
                    className="inline-flex items-center gap-1 text-xs font-semibold text-[var(--color-lf-muted)] hover:text-[var(--color-lf-black)] ml-auto"
                  >
                    <Video size={12} /> Follow-up
                  </button>
                </div>
              </div>
            </article>
          ))}
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
