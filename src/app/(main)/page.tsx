import Link from 'next/link';
import Image from 'next/image';
import {
  ArrowRight,
  Bot,
  CheckCircle2,
  ClipboardCheck,
  GraduationCap,
  Inbox,
  LayoutTemplate,
  PenSquare,
  ShieldCheck,
  Sparkles,
  Users,
} from 'lucide-react';
import { getPublishedTeamLeaders } from '@/lib/mock-data';
import { generateTagline, formatNMLS } from '@/lib/utils';
import {
  PLATFORM_MOTION_VIDEO,
  TEAM_MARKETING_IMAGE,
} from '@/lib/brand-assets';

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
              Request access, get approved, and your Team Leader workspace turns on — branded
              templates, compliance-checked content, webinar kits, and an AI Twin in your own voice.
              Marketing reviews every public asset before it goes live.
            </p>
            <div className="flex flex-wrap gap-3 mb-8">
              <Link
                href="/request-access"
                className="inline-flex items-center gap-2 bg-[var(--color-lf-orange)] hover:bg-[var(--color-lf-orange-dark)] text-white font-bold px-6 py-3.5 rounded-xl transition-colors shadow-sm"
              >
                Request Access <ArrowRight size={16} />
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
                View Demo Dashboard →
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
            <div className="rounded-3xl border border-[var(--color-lf-border)] bg-white overflow-hidden shadow-sm">
              {/* Visual preview — subtle motion loop with a static fallback image
                  layered underneath. The <video> sits above the <Image> so the
                  poster is what shows if autoplay is blocked or the file is
                  missing on the host. */}
              <div className="relative aspect-[16/10] bg-[var(--color-lf-surface)] overflow-hidden">
                <Image
                  src={TEAM_MARKETING_IMAGE}
                  alt="Loan Factory AI Advantage team marketing workspace preview"
                  fill
                  sizes="(min-width: 1024px) 40vw, 100vw"
                  className="object-cover"
                  priority
                />
                <video
                  src={PLATFORM_MOTION_VIDEO}
                  autoPlay
                  muted
                  loop
                  playsInline
                  preload="metadata"
                  aria-hidden
                  className="absolute inset-0 w-full h-full object-cover mix-blend-multiply opacity-90"
                />
                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/20 to-transparent h-1/3 pointer-events-none" />
                <span className="absolute top-3 left-3 inline-flex items-center gap-1 bg-white/90 backdrop-blur text-[10px] font-bold uppercase tracking-widest text-[var(--color-lf-orange-dark)] px-2 py-1 rounded-full">
                  <Sparkles size={10} /> Platform preview
                </span>
              </div>

              <div className="p-6">
                <p className="text-xs font-semibold uppercase tracking-widest text-[var(--color-lf-muted)] mb-3">
                  What you get
                </p>
                <ul className="space-y-2.5">
                  {[
                    'Cloneable website, landing page, and funnel templates',
                    'AI reference image and persona document uploads',
                    'Built-in compliance checks (NMLS, APR, state rules)',
                    'Marketing review queue with reviewer notes',
                    'Team Library for shared templates and assets',
                  ].map((feat) => (
                    <li
                      key={feat}
                      className="flex items-start gap-2 text-sm text-[var(--color-lf-black)]"
                    >
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
        </div>
      </section>

      {/* What's inside the platform — workflow grid */}
      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <p className="text-xs font-bold uppercase tracking-widest text-[var(--color-lf-orange-dark)] mb-2">
              What&apos;s inside
            </p>
            <h2 className="text-3xl md:text-4xl font-black text-[var(--color-lf-black)] tracking-tight mb-3">
              A real operating system for Team Leader marketing.
            </h2>
            <p className="text-[var(--color-lf-muted)] max-w-2xl mx-auto">
              Not another website builder. A guided workflow that takes you from access request to
              published, compliant assets — with Marketing in the loop every step.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {[
              {
                icon: <Inbox size={18} />,
                title: 'Request access & get approved',
                desc: 'Submit a short application. Jeremy, Victoria, Andre, and Marketing review and create your workspace.',
                href: '/request-access',
                href_label: 'Request access',
              },
              {
                icon: <Sparkles size={18} />,
                title: 'Workspace turned on',
                desc: 'Profile draft, branding checklist, template access, AI Twin setup, and a Marketing review queue — all pre-staged.',
                href: '/dashboard',
                href_label: 'See the dashboard',
              },
              {
                icon: <LayoutTemplate size={18} />,
                title: 'Clone a template',
                desc: 'Pick a Team Leader website, landing page, funnel, recruiting, Realtor partner, or Spanish-language template. Personalize in minutes.',
                href: '/templates-examples',
                href_label: 'Browse templates',
              },
              {
                icon: <PenSquare size={18} />,
                title: 'Create compliant content',
                desc: 'Guided Content Studio drafts posts in your voice with NMLS, APR, and state-specific checks running live as you type.',
                href: '/content-studio',
                href_label: 'Open Content Studio',
              },
              {
                icon: <GraduationCap size={18} />,
                title: 'Prepare webinars & training',
                desc: 'Clone teaching kits for first-time buyers, VA, FHA, DSCR, credit prep, and Realtor lunch-and-learns.',
                href: '/training',
                href_label: 'View training kits',
              },
              {
                icon: <Bot size={18} />,
                title: 'AI Twin + agent boardroom',
                desc: 'Set up your AI content voice. Eleven specialist agents — strategy, creative, compliance, research — ready when MiniMax is approved.',
                href: '/ai-twin',
                href_label: 'Set up AI Twin',
              },
              {
                icon: <Users size={18} />,
                title: 'Share with your team',
                desc: 'Push approved templates, captions, brand assets, persona files, and reference images into the Team Library.',
                href: '/team-library',
                href_label: 'Open Team Library',
              },
              {
                icon: <ShieldCheck size={18} />,
                title: 'Submit for Marketing review',
                desc: 'No external posting. Every public asset routes through a reviewer who can approve, request changes, or publish.',
                href: '/admin',
                href_label: 'View review queue',
              },
              {
                icon: <ClipboardCheck size={18} />,
                title: 'Compliance baked in',
                desc: 'Loan Factory NMLS #320841, Equal Housing Lender, state-specific rules (NJ / RI / MA / TX / AZ), wholesale broker positioning — locked in.',
                href: '/compliance',
                href_label: 'Open compliance checklist',
              },
            ].map((item) => (
              <Link
                key={item.title}
                href={item.href}
                className="group bg-white border border-[var(--color-lf-border)] rounded-2xl p-5 hover:border-[var(--color-lf-orange)] hover:shadow-md transition-all"
              >
                <div className="w-10 h-10 rounded-lg bg-[var(--color-lf-orange-soft)] text-[var(--color-lf-orange-dark)] flex items-center justify-center mb-3 group-hover:bg-[var(--color-lf-orange)] group-hover:text-white transition-colors">
                  {item.icon}
                </div>
                <h3 className="font-bold text-[var(--color-lf-black)] text-base leading-tight mb-1.5">
                  {item.title}
                </h3>
                <p className="text-sm text-[var(--color-lf-muted)] leading-relaxed mb-3">
                  {item.desc}
                </p>
                <span className="inline-flex items-center gap-1 text-xs font-bold text-[var(--color-lf-orange-dark)] group-hover:underline">
                  {item.href_label} <ArrowRight size={11} />
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Who this is for / pilot framing */}
      <section className="py-16 px-4 bg-[var(--color-lf-surface)] border-y border-[var(--color-lf-border)]">
        <div className="max-w-6xl mx-auto grid lg:grid-cols-3 gap-8 items-center">
          <div className="lg:col-span-1">
            <p className="text-xs font-bold uppercase tracking-widest text-[var(--color-lf-orange-dark)] mb-2">
              Who this is for
            </p>
            <h2 className="text-2xl md:text-3xl font-black text-[var(--color-lf-black)] tracking-tight mb-3">
              Team Leaders running the 1+1+1=5 play.
            </h2>
            <p className="text-[var(--color-lf-muted)] text-sm leading-relaxed">
              Built for Loan Factory Team Leaders and Group Leaders who want a branded, compliant
              presence — without a marketing department of their own. Pilot reviewers: Jeremy,
              Victoria, Andre, and Marketing.
            </p>
          </div>
          <div className="lg:col-span-2 grid sm:grid-cols-2 gap-4">
            {[
              {
                title: 'Team Leaders',
                body: 'Build a personal site + landing page, run Realtor co-marketing, and recruit LOs to your team.',
              },
              {
                title: 'Group Leaders',
                body: 'Roll out branded templates across multiple LOs. Track who has shipped what.',
              },
              {
                title: 'Bilingual / multilingual LOs',
                body: 'Spanish, Vietnamese, Mandarin, Cantonese, Korean — first-class content templates.',
              },
              {
                title: 'Investor / DSCR specialists',
                body: 'DSCR investor education, jumbo positioning, listing-agent co-marketing kits.',
              },
            ].map((c) => (
              <div
                key={c.title}
                className="bg-white border border-[var(--color-lf-border)] rounded-2xl p-5"
              >
                <p className="font-bold text-[var(--color-lf-black)] text-sm">{c.title}</p>
                <p className="text-xs text-[var(--color-lf-muted)] mt-1 leading-relaxed">
                  {c.body}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works — workflow timeline */}
      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <p className="text-xs font-bold uppercase tracking-widest text-[var(--color-lf-orange-dark)] mb-2">
              How it works
            </p>
            <h2 className="text-3xl md:text-4xl font-black text-[var(--color-lf-black)] tracking-tight mb-3">
              Six clear steps. No fake automation.
            </h2>
            <p className="text-[var(--color-lf-muted)] max-w-2xl mx-auto">
              Every step is a real action taken by a real person. Marketing reviews before any
              public asset ships.
            </p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {[
              {
                step: '01',
                title: 'Request access',
                body: 'Submit the program application. Tell us about your team, markets, and goals.',
              },
              {
                step: '02',
                title: 'Get approved',
                body: 'Reviewers check NMLS, licensed states, and pilot fit. Status moves to Approved.',
              },
              {
                step: '03',
                title: 'Workspace created',
                body: 'Branding checklist, template access, AI Twin setup, and review queue all turn on.',
              },
              {
                step: '04',
                title: 'Build & clone',
                body: 'Spin up your Team Leader site, clone a landing page or funnel, create a webinar kit.',
              },
              {
                step: '05',
                title: 'Marketing review',
                body: 'Submit assets. Reviewer can approve, request changes, or send back to draft.',
              },
              {
                step: '06',
                title: 'Publish',
                body: 'Approved sites go live. No automatic external posting — publishing is a deliberate action.',
              },
            ].map((item) => (
              <div
                key={item.step}
                className="bg-white border border-[var(--color-lf-border)] rounded-2xl p-6 relative"
              >
                <div className="text-4xl font-black text-gray-100 tracking-tighter leading-none mb-3">
                  {item.step}
                </div>
                <h3 className="font-bold text-[var(--color-lf-black)] text-base leading-tight mb-1.5">
                  {item.title}
                </h3>
                <p className="text-sm text-[var(--color-lf-muted)] leading-relaxed">{item.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Team Leaders — Live Examples */}
      <section className="py-20 px-4 bg-[var(--color-lf-surface)] border-t border-[var(--color-lf-border)]">
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
            Ready to join the pilot?
          </h2>
          <p className="text-[var(--color-lf-muted)] mb-8 text-lg">
            Submit a short request. Once approved, your Team Leader workspace turns on.
          </p>
          <div className="flex flex-wrap gap-3 justify-center">
            <Link
              href="/request-access"
              className="inline-flex items-center gap-2 bg-[var(--color-lf-orange)] hover:bg-[var(--color-lf-orange-dark)] text-white font-bold px-8 py-4 rounded-xl text-lg transition-colors shadow-sm"
            >
              Request Access <ArrowRight size={20} />
            </Link>
            <Link
              href="/dashboard"
              className="inline-flex items-center gap-2 bg-white hover:bg-gray-50 text-[var(--color-lf-black)] font-semibold px-8 py-4 rounded-xl text-lg border border-[var(--color-lf-border)]"
            >
              View Demo Dashboard
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
