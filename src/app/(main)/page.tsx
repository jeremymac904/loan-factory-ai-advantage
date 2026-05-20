import Link from 'next/link';
import Image from 'next/image';
import {
  ArrowRight,
  CheckCircle2,
  Globe,
  LayoutTemplate,
  PenSquare,
  ShieldCheck,
  Sparkles,
  Users,
} from 'lucide-react';
import { getPublishedTeamLeaders } from '@/lib/mock-data';
import { generateTagline, formatNMLS } from '@/lib/utils';

export default function HomePage() {
  const featured = getPublishedTeamLeaders().slice(0, 3);

  return (
    <div className="bg-white text-[var(--color-lf-black)]">
      {/* Hero */}
      <section className="bg-white border-b border-[var(--color-lf-border)] py-20 px-4">
        <div className="max-w-6xl mx-auto grid lg:grid-cols-5 gap-12 items-center">
          <div className="lg:col-span-3">
            <span className="inline-flex items-center gap-1.5 bg-[var(--color-lf-orange-soft)] text-[var(--color-lf-orange-dark)] text-[11px] font-bold uppercase tracking-[0.18em] px-3 py-1 rounded-full mb-5">
              <Sparkles size={11} /> 1+1+1=5 Pilot Platform
            </span>
            <h1 className="text-4xl md:text-5xl font-black leading-tight mb-5 tracking-tight">
              The Loan Factory Team Leader<br />
              <span className="text-[var(--color-lf-orange)]">Marketing Platform</span>.
            </h1>
            <p className="text-lg text-[var(--color-lf-muted)] mb-8 max-w-xl leading-relaxed">
              Build a Team Leader website, ship a compliant social post, and share assets across
              your group — all from one workspace. Marketing reviews every public asset before it
              goes live.
            </p>
            <div className="flex flex-wrap gap-3 mb-8">
              <Link
                href="/builder"
                className="inline-flex items-center gap-2 bg-[var(--color-lf-orange)] hover:bg-[var(--color-lf-orange-dark)] text-white font-bold px-6 py-3.5 rounded-xl transition-colors shadow-sm"
              >
                Start a Site <ArrowRight size={16} />
              </Link>
              <Link
                href="/templates-examples"
                className="inline-flex items-center gap-2 bg-[var(--color-lf-surface)] hover:bg-gray-100 text-[var(--color-lf-black)] font-semibold px-6 py-3.5 rounded-xl border border-[var(--color-lf-border)]"
              >
                Browse Templates
              </Link>
              <Link
                href="/dashboard"
                className="inline-flex items-center gap-2 text-[var(--color-lf-muted)] hover:text-[var(--color-lf-black)] font-semibold px-3 py-3.5 text-sm"
              >
                Open Workspace →
              </Link>
            </div>
            <div className="flex flex-wrap items-center gap-5 text-xs text-[var(--color-lf-muted)] pt-5 border-t border-[var(--color-lf-border)]">
              <span className="flex items-center gap-1.5">
                <ShieldCheck size={13} className="text-[var(--color-lf-orange)]" />
                Marketing-approved
              </span>
              <span className="flex items-center gap-1.5">
                <Users size={13} className="text-[var(--color-lf-orange)]" />
                Team sharing
              </span>
              <span className="flex items-center gap-1.5">
                <LayoutTemplate size={13} className="text-[var(--color-lf-orange)]" />
                Website + funnel templates
              </span>
            </div>
          </div>
          <div className="lg:col-span-2">
            <div className="rounded-3xl border border-[var(--color-lf-border)] bg-[var(--color-lf-surface)] p-6">
              <p className="text-xs font-semibold uppercase tracking-widest text-[var(--color-lf-muted)] mb-3">
                What you get
              </p>
              <ul className="space-y-3">
                {[
                  'Cloneable website, landing page, and funnel templates',
                  'AI reference image + persona document uploads',
                  'Built-in compliance checks (NMLS, APR, state rules)',
                  'Marketing review queue with reviewer notes',
                  'Team Library for shared captions, brand assets, and personas',
                ].map((feat) => (
                  <li key={feat} className="flex items-start gap-2 text-sm text-[var(--color-lf-black)]">
                    <CheckCircle2
                      size={16}
                      className="text-[var(--color-lf-orange)] mt-0.5 shrink-0"
                    />
                    <span>{feat}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* 3-Step Process */}
      <section className="py-20 px-4 bg-[var(--color-lf-surface)]">
        <div className="max-w-5xl mx-auto">
          <p className="text-center text-xs font-bold uppercase tracking-widest text-[var(--color-lf-orange-dark)] mb-2">
            How it works
          </p>
          <h2 className="text-3xl font-black text-center text-[var(--color-lf-black)] mb-3">
            Three steps from blank page to live site.
          </h2>
          <p className="text-center text-[var(--color-lf-muted)] mb-12">
            No fake automation in this pilot — just a real Marketing review loop.
          </p>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                step: '01',
                icon: <PenSquare size={20} className="text-[var(--color-lf-orange)]" />,
                title: 'Pick a template and fill in your info',
                desc: 'Start from a Team Leader website, landing page, or funnel template. Add bio, specialties, languages, NMLS, and licensed states.',
              },
              {
                step: '02',
                icon: <ShieldCheck size={20} className="text-[var(--color-lf-orange)]" />,
                title: 'Marketing reviews for brand and compliance',
                desc: 'Your draft enters the review queue with built-in NMLS, APR, and state-specific checks. Reviewers can request changes inline.',
              },
              {
                step: '03',
                icon: <Globe size={20} className="text-[var(--color-lf-orange)]" />,
                title: 'Marketing publishes after approval',
                desc: 'Publishing happens only after a reviewer approves. You get a shareable URL once it goes live. No automated external posting in this pilot.',
              },
            ].map((item) => (
              <div
                key={item.step}
                className="bg-white border border-[var(--color-lf-border)] rounded-2xl p-7"
              >
                <div className="text-4xl font-black text-gray-100 mb-3 tracking-tighter">
                  {item.step}
                </div>
                <div className="mb-4">{item.icon}</div>
                <h3 className="text-lg font-bold text-[var(--color-lf-black)] mb-2 leading-snug">
                  {item.title}
                </h3>
                <p className="text-sm text-[var(--color-lf-muted)] leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Team Leaders */}
      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-end justify-between mb-10 flex-wrap gap-3">
            <div>
              <p className="text-xs font-bold uppercase tracking-widest text-[var(--color-lf-orange-dark)] mb-2">
                Live examples
              </p>
              <h2 className="text-3xl font-black text-[var(--color-lf-black)]">
                Real Team Leader sites in the wild.
              </h2>
            </div>
            <Link
              href="/templates-examples"
              className="text-sm font-bold text-[var(--color-lf-orange-dark)] hover:underline"
            >
              See all templates and examples →
            </Link>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {featured.map((tl) => (
              <Link
                key={tl.id}
                href={`/site/${tl.slug}`}
                className="block bg-white border border-[var(--color-lf-border)] rounded-2xl overflow-hidden hover:shadow-md hover:border-[var(--color-lf-orange)] transition-all"
              >
                <div className="h-28 bg-[var(--color-lf-surface)] flex items-end justify-center relative">
                  <div className="w-20 h-20 rounded-full border-4 border-white overflow-hidden translate-y-10 bg-gray-200">
                    {tl.headshot_url && (
                      <Image
                        src={tl.headshot_url}
                        alt={tl.full_name}
                        width={80}
                        height={80}
                        className="w-full h-full object-cover"
                      />
                    )}
                  </div>
                </div>
                <div className="pt-12 px-6 pb-6">
                  <h3 className="text-lg font-bold text-[var(--color-lf-black)]">{tl.full_name}</h3>
                  <p className="text-xs text-[var(--color-lf-muted)] mb-3">
                    {formatNMLS(tl.nmls_number)}
                  </p>
                  <p className="text-sm text-[var(--color-lf-muted)] italic mb-4 leading-snug line-clamp-2">
                    {generateTagline(tl)}
                  </p>
                  <div className="flex flex-wrap gap-1 mb-4">
                    {tl.languages.slice(0, 3).map((lang) => (
                      <span
                        key={lang}
                        className="bg-[var(--color-lf-surface)] text-[var(--color-lf-black)] text-[10px] font-semibold px-2 py-0.5 rounded-full border border-[var(--color-lf-border)]"
                      >
                        {lang}
                      </span>
                    ))}
                    {tl.specialties.slice(0, 2).map((spec) => (
                      <span
                        key={spec}
                        className="bg-[var(--color-lf-orange-soft)] text-[var(--color-lf-orange-dark)] text-[10px] font-semibold px-2 py-0.5 rounded-full"
                      >
                        {spec}
                      </span>
                    ))}
                  </div>
                  <span className="inline-flex items-center gap-1 text-xs font-bold text-[var(--color-lf-orange-dark)]">
                    View site <ArrowRight size={12} />
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Banner */}
      <section className="py-16 px-4 bg-[var(--color-lf-orange-soft)] border-t border-[var(--color-lf-border)]">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl font-black text-[var(--color-lf-black)] mb-3 tracking-tight">
            Ready to build your site?
          </h2>
          <p className="text-[var(--color-lf-muted)] mb-8 text-lg">
            Pick a template, fill in your details, and submit to Marketing review.
          </p>
          <Link
            href="/builder"
            className="inline-flex items-center gap-2 bg-[var(--color-lf-orange)] hover:bg-[var(--color-lf-orange-dark)] text-white font-bold px-8 py-4 rounded-xl text-lg transition-colors shadow-sm"
          >
            Start Building <ArrowRight size={20} />
          </Link>
        </div>
      </section>
    </div>
  );
}
