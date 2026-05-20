'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  ArrowRight,
  Copy,
  Eye,
  Globe,
  MapPin,
  Send,
  Share2,
  Sparkles,
} from 'lucide-react';
import { getPublishedTeamLeaders } from '@/lib/mock-data';
import { builderTemplates } from '@/lib/platform-mock-data';
import { generateTagline, formatNMLS } from '@/lib/utils';
import type { BuilderTemplate, BuilderKind } from '@/lib/platform-types';

const CATEGORY_LABELS: { kind: BuilderKind; label: string }[] = [
  { kind: 'team-leader-website', label: 'Team Leader Website' },
  { kind: 'landing-page', label: 'Landing Page' },
  { kind: 'recruiting-page', label: 'Recruiting' },
  { kind: 'realtor-partner-page', label: 'Realtor Partner' },
  { kind: 'consumer-education-page', label: 'Consumer Education' },
  { kind: 'funnel-page', label: 'Open House Funnel' },
  { kind: 'spanish-language-page', label: 'Spanish Content' },
  { kind: 'investor-dscr-page', label: 'DSCR & Investor' },
];

const PSEUDO_AUDIENCES = ['First Time Buyer', 'Investor', 'Realtor Partner', 'Veteran', 'General'];

export default function TemplatesExamplesPage() {
  const [activeKind, setActiveKind] = useState<BuilderKind | null>(null);
  const [activeLanguage, setActiveLanguage] = useState<'English' | 'Spanish' | null>(null);

  const filtered = useMemo(() => {
    return builderTemplates.filter((t) => {
      if (activeKind && t.kind !== activeKind) return false;
      if (activeLanguage && t.language !== activeLanguage && t.language !== 'Bilingual') return false;
      return true;
    });
  }, [activeKind, activeLanguage]);

  const leaders = getPublishedTeamLeaders();

  function flash(action: string, t: BuilderTemplate) {
    console.info(`[demo] ${action}`, t.id);
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Header */}
      <div className="text-center mb-10">
        <span className="inline-flex items-center gap-1.5 bg-[var(--color-lf-orange-soft)] text-[var(--color-lf-orange-dark)] text-[11px] font-bold uppercase tracking-[0.18em] px-3 py-1 rounded-full mb-3">
          <Sparkles size={11} /> Templates & Examples
        </span>
        <h1 className="text-4xl font-black text-[var(--color-lf-black)] mb-2 tracking-tight">
          Cloneable templates and live examples
        </h1>
        <p className="text-[var(--color-lf-muted)] max-w-2xl mx-auto">
          Pick a template to clone into the builder, or scroll down to see real Team Leader sites
          shipping today. Every public asset goes through Marketing review before publish.
        </p>
      </div>

      {/* Filters */}
      <div className="bg-white border border-[var(--color-lf-border)] rounded-2xl p-5 mb-10">
        <div className="space-y-4">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-widest text-[var(--color-lf-muted)] mb-2">
              Category
            </p>
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => setActiveKind(null)}
                className={`text-xs font-semibold px-3 py-1.5 rounded-full border ${
                  activeKind === null
                    ? 'bg-[var(--color-lf-black)] border-[var(--color-lf-black)] text-white'
                    : 'bg-white border-[var(--color-lf-border)] text-[var(--color-lf-muted)] hover:border-[var(--color-lf-black)] hover:text-[var(--color-lf-black)]'
                }`}
              >
                All
              </button>
              {CATEGORY_LABELS.map((c) => (
                <button
                  type="button"
                  key={c.kind}
                  onClick={() => setActiveKind(activeKind === c.kind ? null : c.kind)}
                  className={`text-xs font-semibold px-3 py-1.5 rounded-full border ${
                    activeKind === c.kind
                      ? 'bg-[var(--color-lf-black)] border-[var(--color-lf-black)] text-white'
                      : 'bg-white border-[var(--color-lf-border)] text-[var(--color-lf-muted)] hover:border-[var(--color-lf-black)] hover:text-[var(--color-lf-black)]'
                  }`}
                >
                  {c.label}
                </button>
              ))}
            </div>
          </div>

          <div>
            <p className="text-[10px] font-bold uppercase tracking-widest text-[var(--color-lf-muted)] mb-2">
              Language
            </p>
            <div className="flex flex-wrap gap-2">
              {(['English', 'Spanish'] as const).map((l) => (
                <button
                  type="button"
                  key={l}
                  onClick={() => setActiveLanguage(activeLanguage === l ? null : l)}
                  className={`text-xs font-semibold px-3 py-1.5 rounded-full border ${
                    activeLanguage === l
                      ? 'bg-[var(--color-lf-orange)] border-[var(--color-lf-orange)] text-white'
                      : 'bg-white border-[var(--color-lf-border)] text-[var(--color-lf-muted)] hover:border-[var(--color-lf-orange)] hover:text-[var(--color-lf-orange-dark)]'
                  }`}
                >
                  {l}
                </button>
              ))}
            </div>
          </div>
        </div>
        <p className="text-[11px] text-[var(--color-lf-muted)] mt-4">
          Showing <span className="font-bold text-[var(--color-lf-black)]">{filtered.length}</span>{' '}
          of {builderTemplates.length} templates
        </p>
      </div>

      {/* Template cards */}
      <section className="mb-16">
        <h2 className="text-xs font-bold uppercase tracking-widest text-[var(--color-lf-orange-dark)] mb-3">
          Cloneable Templates
        </h2>
        {filtered.length === 0 ? (
          <div className="bg-white border border-[var(--color-lf-border)] rounded-2xl py-16 text-center">
            <p className="text-sm text-[var(--color-lf-muted)]">
              No templates match those filters.
            </p>
            <button
              type="button"
              onClick={() => {
                setActiveKind(null);
                setActiveLanguage(null);
              }}
              className="mt-3 text-xs font-semibold text-[var(--color-lf-orange-dark)] hover:underline"
            >
              Clear filters →
            </button>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {filtered.map((t) => {
              const audience =
                PSEUDO_AUDIENCES[
                  Math.abs(t.id.split('').reduce((a, c) => a + c.charCodeAt(0), 0)) %
                    PSEUDO_AUDIENCES.length
                ];
              return (
                <article
                  key={t.id}
                  className="bg-white border border-[var(--color-lf-border)] rounded-2xl overflow-hidden hover:shadow-md transition-shadow flex flex-col"
                >
                  <div
                    className={`h-28 px-5 py-4 flex flex-col justify-between text-white ${
                      t.accent === 'orange'
                        ? 'bg-gradient-to-br from-[var(--color-lf-orange)] to-[var(--color-lf-orange-dark)]'
                        : t.accent === 'black'
                        ? 'bg-gradient-to-br from-[var(--color-lf-black)] to-[#2b2b2b]'
                        : 'bg-gradient-to-br from-gray-500 to-gray-700'
                    }`}
                  >
                    <span className="text-[10px] font-bold uppercase tracking-widest opacity-90">
                      {t.kind.replace(/-/g, ' ')}
                    </span>
                    <p className="text-base font-bold leading-tight">{t.title}</p>
                  </div>
                  <div className="p-5 flex-1 flex flex-col">
                    <div className="flex items-center gap-2 flex-wrap mb-2">
                      <span className="text-[10px] font-bold uppercase tracking-widest text-[var(--color-lf-orange-dark)] bg-[var(--color-lf-orange-soft)] px-2 py-0.5 rounded-full">
                        {audience}
                      </span>
                      <span className="text-[10px] font-semibold text-[var(--color-lf-muted)] bg-[var(--color-lf-surface)] border border-[var(--color-lf-border)] px-2 py-0.5 rounded-full">
                        {t.language}
                      </span>
                      <span
                        className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                          t.compliance_status === 'pre-approved'
                            ? 'bg-green-50 text-green-700'
                            : t.compliance_status === 'needs-personalization'
                            ? 'bg-amber-50 text-amber-700'
                            : 'bg-purple-50 text-purple-700'
                        }`}
                      >
                        {t.compliance_status.replace(/-/g, ' ')}
                      </span>
                    </div>
                    <p className="text-sm text-[var(--color-lf-muted)] leading-relaxed line-clamp-3 mb-4">
                      {t.description}
                    </p>

                    <div className="mt-auto flex flex-wrap items-center gap-2 pt-3 border-t border-[var(--color-lf-border)]">
                      <button
                        type="button"
                        onClick={() => flash('preview', t)}
                        className="inline-flex items-center gap-1 text-xs font-semibold text-[var(--color-lf-black)] bg-[var(--color-lf-surface)] hover:bg-gray-100 px-2.5 py-1.5 rounded-lg border border-[var(--color-lf-border)]"
                      >
                        <Eye size={13} /> Preview
                      </button>
                      <Link
                        href={`/builder?template=${t.id}`}
                        onClick={() => flash('clone', t)}
                        className="inline-flex items-center gap-1 text-xs font-bold text-white bg-[var(--color-lf-orange)] hover:bg-[var(--color-lf-orange-dark)] px-3 py-1.5 rounded-lg"
                      >
                        <Copy size={13} /> Clone
                      </Link>
                      <button
                        type="button"
                        onClick={() => flash('share', t)}
                        className="inline-flex items-center gap-1 text-xs font-semibold text-[var(--color-lf-muted)] hover:text-[var(--color-lf-black)] px-2 py-1.5"
                      >
                        <Share2 size={13} /> Share
                      </button>
                      <button
                        type="button"
                        onClick={() => flash('submit', t)}
                        className="inline-flex items-center gap-1 text-xs font-semibold text-[var(--color-lf-muted)] hover:text-[var(--color-lf-black)] px-2 py-1.5 ml-auto"
                      >
                        <Send size={13} /> Submit
                      </button>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </section>

      {/* Live Team Leader examples */}
      <section>
        <h2 className="text-xs font-bold uppercase tracking-widest text-[var(--color-lf-orange-dark)] mb-3">
          Live Team Leader sites
        </h2>
        <p className="text-sm text-[var(--color-lf-muted)] mb-5">
          Real sites built with the Loan Factory AI Advantage platform. Click a card to view the
          full published page.
        </p>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {leaders.map((tl) => (
            <Link
              key={tl.id}
              href={`/site/${tl.slug}`}
              className="block bg-white border border-[var(--color-lf-border)] rounded-2xl overflow-hidden hover:shadow-md hover:border-[var(--color-lf-orange)] transition-all"
            >
              <div className="h-20 bg-[var(--color-lf-surface)] relative">
                <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2">
                  <div className="w-16 h-16 rounded-full border-4 border-white overflow-hidden bg-gray-200">
                    {tl.headshot_url ? (
                      <Image
                        src={tl.headshot_url}
                        alt={tl.full_name}
                        width={64}
                        height={64}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-[var(--color-lf-orange)] text-white font-bold text-xl">
                        {tl.full_name[0]}
                      </div>
                    )}
                  </div>
                </div>
              </div>
              <div className="pt-10 px-5 pb-5 text-center">
                <h3 className="font-bold text-[var(--color-lf-black)]">{tl.full_name}</h3>
                <p className="text-xs text-[var(--color-lf-muted)] mb-2">
                  {formatNMLS(tl.nmls_number)}
                </p>
                <p className="text-xs text-[var(--color-lf-muted)] italic mb-3 leading-snug line-clamp-2">
                  {generateTagline(tl)}
                </p>
                <div className="flex items-center justify-center gap-1 text-[11px] text-[var(--color-lf-muted)] mb-2">
                  <MapPin size={11} className="text-[var(--color-lf-orange)]" />
                  {tl.service_areas[0]}
                </div>
                <div className="flex flex-wrap gap-1 justify-center mb-3">
                  {tl.specialties.slice(0, 3).map((spec) => (
                    <span
                      key={spec}
                      className="bg-[var(--color-lf-orange-soft)] text-[var(--color-lf-orange-dark)] text-[10px] font-semibold px-2 py-0.5 rounded-full"
                    >
                      {spec}
                    </span>
                  ))}
                </div>
                <span className="inline-flex items-center justify-center gap-1 text-xs font-bold text-[var(--color-lf-orange-dark)]">
                  <Globe size={12} /> View Live Site
                </span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <div className="mt-16 text-center bg-[var(--color-lf-orange-soft)] border border-[var(--color-lf-border)] rounded-3xl p-12">
        <h2 className="text-2xl font-black text-[var(--color-lf-black)] mb-3 tracking-tight">
          Your site doesn&apos;t exist yet?
        </h2>
        <p className="text-[var(--color-lf-muted)] mb-6">
          Pick a template, fill in your info, and submit to Marketing review.
        </p>
        <Link
          href="/builder"
          className="inline-flex items-center gap-2 bg-[var(--color-lf-orange)] hover:bg-[var(--color-lf-orange-dark)] text-white font-bold px-8 py-3 rounded-xl transition-colors"
        >
          Start Building <ArrowRight size={16} />
        </Link>
      </div>
    </div>
  );
}
