import Link from 'next/link';
import {
  ArrowRight,
  Bot,
  CalendarDays,
  CheckCircle2,
  Clock,
  FileText,
  Globe,
  GraduationCap,
  ImageIcon,
  LayoutTemplate,
  Library,
  PenSquare,
  ShieldCheck,
  Sparkles,
  UserCircle,
  Wand2,
} from 'lucide-react';
import Topbar from '@/components/platform/Topbar';
import ComplianceBadge from '@/components/platform/ComplianceBadge';
import {
  calendarItems,
  contentDrafts,
  currentUserProfile,
  dashboardStats,
  marketingTemplates,
  sharedTeamAssets,
} from '@/lib/platform-mock-data';
import { STATUS_LABEL, STATUS_TONE } from '@/lib/status-labels';

export default function PlatformDashboardPage() {
  const u = currentUserProfile;
  const featuredTemplates = marketingTemplates.filter((t) => t.shared_with_team).slice(0, 4);
  const recentDrafts = [...contentDrafts]
    .sort((a, b) => (a.updated_at < b.updated_at ? 1 : -1))
    .slice(0, 4);
  const upcomingCalendar = [...calendarItems]
    .sort((a, b) => a.scheduled_for.localeCompare(b.scheduled_for))
    .slice(0, 4);
  const recentLibrary = [...sharedTeamAssets]
    .sort((a, b) => (a.shared_at < b.shared_at ? 1 : -1))
    .slice(0, 4);

  // Workspace setup checklist — derived from profile completion + uploads.
  const setupSteps: { key: string; label: string; done: boolean; href: string }[] = [
    { key: 'profile', label: 'Complete profile basics', done: u.profile_completion_pct >= 60, href: '/profile' },
    { key: 'photo', label: 'Upload profile photo', done: !!u.profile_image_url, href: '/profile' },
    {
      key: 'ai-ref',
      label: 'Upload AI reference image',
      done: !!u.ai_reference_image_url,
      href: '/profile#reference',
    },
    {
      key: 'persona',
      label: 'Upload persona document',
      done: !!u.persona_document_url,
      href: '/profile#persona',
    },
    {
      key: 'brand-voice',
      label: 'Upload brand voice document',
      done: !!u.brand_voice_document_url,
      href: '/profile#persona',
    },
    {
      key: 'first-template',
      label: 'Choose your first template',
      done: false,
      href: '/templates-examples',
    },
    {
      key: 'ai-twin',
      label: 'Start AI Twin setup',
      done: false,
      href: '/ai-twin',
    },
    {
      key: 'first-submit',
      label: 'Submit first asset for Marketing review',
      done: contentDrafts.some((d) => d.status === 'Needs Review'),
      href: '/content-studio',
    },
  ];
  const setupDone = setupSteps.filter((s) => s.done).length;
  const setupTotal = setupSteps.length;
  const setupPct = Math.round((setupDone / setupTotal) * 100);

  const nextBest = setupSteps.find((s) => !s.done);

  // Quick action grid (per spec).
  const quickActions = [
    { title: 'Finish profile', icon: <UserCircle size={18} />, href: '/profile' },
    { title: 'Upload reference image', icon: <ImageIcon size={18} />, href: '/profile#reference' },
    { title: 'Upload persona document', icon: <FileText size={18} />, href: '/profile#persona' },
    { title: 'Choose first template', icon: <LayoutTemplate size={18} />, href: '/templates-examples' },
    { title: 'Create first social post', icon: <PenSquare size={18} />, href: '/content-studio' },
    { title: 'Build webinar kit', icon: <GraduationCap size={18} />, href: '/training' },
    { title: 'Submit for Marketing review', icon: <ShieldCheck size={18} />, href: '/admin' },
  ];

  // Mock review queue subset (drafts flagged for review).
  const pendingReview = contentDrafts.filter((d) => d.status === 'Needs Review');

  return (
    <>
      <Topbar
        title={`Welcome back, ${u.preferred_display_name.split(' ')[0]}.`}
        subtitle={`${u.team_name ?? 'Solo'} · ${u.licensed_states.join(', ')} · Loan Factory NMLS #320841`}
      />

      <div className="px-5 sm:px-8 py-8 space-y-10">
        {/* ====================== START HERE / NEXT BEST ACTION ====================== */}
        <section className="grid lg:grid-cols-3 gap-5">
          <div className="lg:col-span-2 bg-white border border-[var(--color-lf-border)] rounded-3xl p-6 sm:p-7 flex flex-col">
            <div className="flex items-start justify-between gap-3 mb-3">
              <span className="inline-flex items-center gap-1.5 bg-[var(--color-lf-orange-soft)] text-[var(--color-lf-orange-dark)] text-[10px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-full">
                <Sparkles size={11} /> Start here
              </span>
              <span className="bg-yellow-100 text-yellow-800 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wide">
                Demo Mode
              </span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-[var(--color-lf-black)] tracking-tight leading-tight mb-2">
              {nextBest ? nextBest.label : 'Your workspace setup is complete.'}
            </h2>
            <p className="text-[var(--color-lf-muted)] text-sm leading-relaxed mb-5 max-w-lg">
              {nextBest
                ? 'This is your next best action. Knock it out, then come back for the next one.'
                : 'Move on to drafting content and submitting your first asset for Marketing review.'}
            </p>
            <div className="flex flex-wrap gap-3 mt-auto">
              <Link
                href={nextBest?.href ?? '/content-studio'}
                className="inline-flex items-center gap-2 bg-[var(--color-lf-orange)] hover:bg-[var(--color-lf-orange-dark)] text-white font-bold px-5 py-2.5 rounded-xl text-sm transition-colors"
              >
                {nextBest ? 'Take this step' : 'Open Content Studio'} <ArrowRight size={14} />
              </Link>
              <Link
                href="/builder"
                className="inline-flex items-center gap-2 bg-[var(--color-lf-surface)] hover:bg-gray-100 text-[var(--color-lf-black)] font-semibold px-5 py-2.5 rounded-xl text-sm border border-[var(--color-lf-border)]"
              >
                Build Team Leader site
              </Link>
              <Link
                href="/templates-examples"
                className="inline-flex items-center gap-2 text-[var(--color-lf-muted)] hover:text-[var(--color-lf-black)] font-semibold px-2 py-2.5 text-sm"
              >
                Browse Templates →
              </Link>
            </div>
          </div>

          {/* Workspace setup progress */}
          <div className="bg-white border border-[var(--color-lf-border)] rounded-3xl p-6">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-xs font-bold uppercase tracking-widest text-[var(--color-lf-muted)]">
                Workspace setup
              </h3>
              <span className="text-2xl font-black text-[var(--color-lf-black)]">{setupPct}%</span>
            </div>
            <div className="h-2 bg-[var(--color-lf-surface)] rounded-full overflow-hidden mb-4">
              <div
                className="h-full bg-[var(--color-lf-orange)] transition-all"
                style={{ width: `${setupPct}%` }}
              />
            </div>
            <ul className="space-y-2 text-[13px]">
              {setupSteps.slice(0, 5).map((s) => (
                <li key={s.key} className="flex items-start gap-2">
                  {s.done ? (
                    <CheckCircle2 size={14} className="text-green-600 mt-0.5 shrink-0" />
                  ) : (
                    <span className="w-3.5 h-3.5 rounded-full border border-gray-300 mt-0.5 shrink-0" />
                  )}
                  <Link
                    href={s.href}
                    className={`hover:text-[var(--color-lf-orange-dark)] ${
                      s.done ? 'text-[var(--color-lf-muted)] line-through' : 'text-[var(--color-lf-black)]'
                    }`}
                  >
                    {s.label}
                  </Link>
                </li>
              ))}
            </ul>
            <Link
              href="/profile"
              className="mt-4 inline-flex items-center gap-1 text-xs font-bold text-[var(--color-lf-orange-dark)] hover:underline"
            >
              See full checklist <ArrowRight size={11} />
            </Link>
          </div>
        </section>

        {/* ====================== STAT ROW ====================== */}
        <section className="grid grid-cols-2 md:grid-cols-5 gap-3">
          {[
            {
              label: 'Profile completion',
              value: `${u.profile_completion_pct}%`,
              icon: <UserCircle size={16} />,
            },
            {
              label: 'Templates available',
              value: dashboardStats.templates_available,
              icon: <LayoutTemplate size={16} />,
              hint: 'Pre-approved by Marketing',
            },
            {
              label: 'Draft posts',
              value: dashboardStats.draft_posts,
              icon: <PenSquare size={16} />,
            },
            {
              label: 'Pending review',
              value: dashboardStats.pending_compliance_review,
              icon: <ShieldCheck size={16} />,
              hint: 'In Marketing queue',
            },
            {
              label: 'Team assets live',
              value: dashboardStats.published_team_assets,
              icon: <Globe size={16} />,
            },
          ].map((s) => (
            <div
              key={s.label}
              className="bg-white border border-[var(--color-lf-border)] rounded-2xl p-4"
            >
              <div className="w-8 h-8 rounded-md bg-[var(--color-lf-orange-soft)] text-[var(--color-lf-orange-dark)] flex items-center justify-center mb-2">
                {s.icon}
              </div>
              <p className="text-2xl font-black text-[var(--color-lf-black)] leading-none">
                {s.value}
              </p>
              <p className="text-[11px] text-[var(--color-lf-muted)] mt-1">{s.label}</p>
              {s.hint && (
                <p className="text-[10px] text-[var(--color-lf-muted)] mt-1">{s.hint}</p>
              )}
            </div>
          ))}
        </section>

        {/* ====================== QUICK ACTIONS ====================== */}
        <section>
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-xs font-bold uppercase tracking-widest text-[var(--color-lf-muted)]">
              Quick actions
            </h3>
            <Link
              href="/content-studio"
              className="text-xs font-bold text-[var(--color-lf-orange-dark)] hover:underline"
            >
              Open Content Studio →
            </Link>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-7 gap-3">
            {quickActions.map((a) => (
              <Link
                key={a.title}
                href={a.href}
                className="group bg-white border border-[var(--color-lf-border)] rounded-2xl p-4 hover:border-[var(--color-lf-orange)] hover:shadow-md transition-all"
              >
                <div className="w-9 h-9 rounded-md bg-[var(--color-lf-orange-soft)] text-[var(--color-lf-orange-dark)] flex items-center justify-center mb-3 group-hover:bg-[var(--color-lf-orange)] group-hover:text-white transition-colors">
                  {a.icon}
                </div>
                <p className="text-[12px] font-bold text-[var(--color-lf-black)] leading-tight">
                  {a.title}
                </p>
                <span className="inline-flex items-center gap-1 text-[10px] font-bold text-gray-400 mt-2 group-hover:text-[var(--color-lf-orange-dark)]">
                  Open <ArrowRight size={9} />
                </span>
              </Link>
            ))}
          </div>
        </section>

        {/* ====================== PENDING REVIEW + CONTENT PIPELINE ====================== */}
        <section className="grid lg:grid-cols-3 gap-5">
          {/* Pending Marketing Review */}
          <div className="lg:col-span-1 bg-white border border-[var(--color-lf-border)] rounded-2xl">
            <div className="px-5 py-4 border-b border-gray-50 flex items-center justify-between">
              <h3 className="font-semibold text-[var(--color-lf-black)] text-sm">
                Pending Marketing review
              </h3>
              <Link
                href="/admin"
                className="text-xs font-semibold text-[var(--color-lf-orange-dark)] hover:underline"
              >
                Queue →
              </Link>
            </div>
            {pendingReview.length === 0 ? (
              <p className="px-5 py-10 text-sm text-[var(--color-lf-muted)] text-center">
                Nothing in review.
              </p>
            ) : (
              <ul className="divide-y divide-gray-50">
                {pendingReview.map((d) => (
                  <li key={d.id} className="px-5 py-4">
                    <p className="font-semibold text-[var(--color-lf-black)] text-sm leading-tight">
                      {d.title}
                    </p>
                    <p className="text-[11px] text-[var(--color-lf-muted)] mt-1 line-clamp-2">
                      {d.campaign_goal}
                    </p>
                    <div className="flex items-center gap-2 mt-2">
                      <span
                        className={`inline-block text-[10px] font-bold uppercase tracking-wide px-2 py-0.5 rounded-full ${STATUS_TONE['needs-marketing-review']}`}
                      >
                        {STATUS_LABEL['needs-marketing-review']}
                      </span>
                      <p className="text-[10px] text-[var(--color-lf-muted)] flex items-center gap-1 ml-auto">
                        <Clock size={9} />
                        {new Date(d.updated_at).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                        })}
                      </p>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* Content pipeline (recent drafts) */}
          <div className="lg:col-span-2 bg-white border border-[var(--color-lf-border)] rounded-2xl">
            <div className="px-5 py-4 border-b border-gray-50 flex items-center justify-between">
              <h3 className="font-semibold text-[var(--color-lf-black)] text-sm">
                Content pipeline
              </h3>
              <Link
                href="/content-studio"
                className="text-xs font-semibold text-[var(--color-lf-orange-dark)] hover:underline"
              >
                Add a draft →
              </Link>
            </div>
            {recentDrafts.length === 0 ? (
              <p className="px-5 py-10 text-sm text-[var(--color-lf-muted)] text-center">
                No drafts yet.
              </p>
            ) : (
              <ul className="divide-y divide-gray-50">
                {recentDrafts.map((d) => (
                  <li
                    key={d.id}
                    className="px-5 py-4 hover:bg-gray-50/60 flex items-start gap-3"
                  >
                    <div className="min-w-0 flex-1">
                      <p className="font-semibold text-[var(--color-lf-black)] text-sm truncate">
                        {d.title}
                      </p>
                      <p className="text-xs text-[var(--color-lf-muted)] mt-0.5 truncate">
                        {d.campaign_goal}
                      </p>
                      <div className="flex items-center gap-2 mt-2 flex-wrap">
                        {d.channels.slice(0, 3).map((c) => (
                          <span
                            key={c}
                            className="text-[10px] font-medium text-[var(--color-lf-muted)] bg-[var(--color-lf-surface)] border border-gray-100 px-2 py-0.5 rounded-full"
                          >
                            {c}
                          </span>
                        ))}
                      </div>
                    </div>
                    <div className="text-right shrink-0 space-y-2">
                      <ComplianceBadge
                        kind={
                          d.status === 'Needs Review'
                            ? 'pending-review'
                            : d.status === 'Approved'
                            ? 'approved'
                            : 'pre-approved'
                        }
                        label={d.status}
                      />
                      <p className="text-[10px] text-gray-400 flex items-center justify-end gap-1">
                        <Clock size={10} />
                        {new Date(d.updated_at).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                        })}
                      </p>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </section>

        {/* ====================== TEMPLATES + TRAINING + AI TWIN ====================== */}
        <section className="grid lg:grid-cols-3 gap-5">
          {/* Template recommendations */}
          <div className="bg-white border border-[var(--color-lf-border)] rounded-2xl flex flex-col">
            <div className="px-5 py-4 border-b border-gray-50 flex items-center gap-2">
              <div className="w-8 h-8 rounded-md bg-[var(--color-lf-orange-soft)] text-[var(--color-lf-orange-dark)] flex items-center justify-center">
                <LayoutTemplate size={14} />
              </div>
              <h3 className="font-semibold text-[var(--color-lf-black)] text-sm">
                Template recommendations
              </h3>
            </div>
            <ul className="divide-y divide-gray-50">
              {featuredTemplates.slice(0, 3).map((t) => (
                <li key={t.id} className="px-5 py-3.5 hover:bg-gray-50/60">
                  <p className="text-[13px] font-bold text-[var(--color-lf-black)] leading-tight">
                    {t.title}
                  </p>
                  <p className="text-[11px] text-[var(--color-lf-muted)] mt-0.5">
                    {t.category} · {t.format}
                  </p>
                  <ComplianceBadge kind={t.compliance_status} className="mt-2" />
                </li>
              ))}
            </ul>
            <Link
              href="/templates-examples"
              className="block px-5 py-3 text-center text-[11px] font-bold text-[var(--color-lf-orange-dark)] hover:underline border-t border-gray-50 mt-auto"
            >
              All templates →
            </Link>
          </div>

          {/* Training kits */}
          <div className="bg-white border border-[var(--color-lf-border)] rounded-2xl flex flex-col">
            <div className="px-5 py-4 border-b border-gray-50 flex items-center gap-2">
              <div className="w-8 h-8 rounded-md bg-[var(--color-lf-orange-soft)] text-[var(--color-lf-orange-dark)] flex items-center justify-center">
                <GraduationCap size={14} />
              </div>
              <h3 className="font-semibold text-[var(--color-lf-black)] text-sm">Training kits</h3>
            </div>
            <ul className="divide-y divide-gray-50 flex-1">
              {[
                { title: 'First-Time Homebuyer Webinar', audience: 'Realtor partners + buyers' },
                { title: 'VA Buyer Workshop', audience: 'Veterans + Realtors' },
                { title: 'AI for Loan Officers Training', audience: 'Your team' },
              ].map((k) => (
                <li key={k.title} className="px-5 py-3.5 hover:bg-gray-50/60">
                  <p className="text-[13px] font-bold text-[var(--color-lf-black)] leading-tight">
                    {k.title}
                  </p>
                  <p className="text-[11px] text-[var(--color-lf-muted)] mt-0.5">{k.audience}</p>
                </li>
              ))}
            </ul>
            <Link
              href="/training"
              className="block px-5 py-3 text-center text-[11px] font-bold text-[var(--color-lf-orange-dark)] hover:underline border-t border-gray-50"
            >
              Open Training & Webinars →
            </Link>
          </div>

          {/* AI Twin readiness */}
          <div className="bg-white border border-[var(--color-lf-border)] rounded-2xl flex flex-col">
            <div className="px-5 py-4 border-b border-gray-50 flex items-center gap-2">
              <div className="w-8 h-8 rounded-md bg-[var(--color-lf-orange-soft)] text-[var(--color-lf-orange-dark)] flex items-center justify-center">
                <Wand2 size={14} />
              </div>
              <h3 className="font-semibold text-[var(--color-lf-black)] text-sm">
                AI Twin readiness
              </h3>
            </div>
            <div className="px-5 py-4 space-y-3 flex-1">
              {[
                { label: 'Persona summary', done: !!u.persona_summary },
                { label: 'Reference image', done: !!u.ai_reference_image_url },
                { label: 'Brand voice document', done: !!u.brand_voice_document_url },
                { label: 'Sample posts', done: false },
                { label: 'Sample video scripts', done: false },
              ].map((item) => (
                <div
                  key={item.label}
                  className="flex items-center gap-2 text-[12px] text-[var(--color-lf-black)]"
                >
                  {item.done ? (
                    <CheckCircle2 size={13} className="text-green-600" />
                  ) : (
                    <span className="w-3 h-3 rounded-full border border-gray-300" />
                  )}
                  <span className={item.done ? 'text-[var(--color-lf-muted)]' : ''}>
                    {item.label}
                  </span>
                </div>
              ))}
              <p className="text-[10px] text-[var(--color-lf-muted)] pt-2 border-t border-gray-50">
                MiniMax is in demo mode. Outputs are placeholders until env is enabled.
              </p>
            </div>
            <Link
              href="/ai-twin"
              className="block px-5 py-3 text-center text-[11px] font-bold text-[var(--color-lf-orange-dark)] hover:underline border-t border-gray-50"
            >
              Continue AI Twin setup →
            </Link>
          </div>
        </section>

        {/* ====================== AGENT BOARDROOM + TEAM LIBRARY + CALENDAR ====================== */}
        <section className="grid lg:grid-cols-3 gap-5">
          {/* Agent boardroom shortcuts */}
          <div className="bg-white border border-[var(--color-lf-border)] rounded-2xl flex flex-col">
            <div className="px-5 py-4 border-b border-gray-50 flex items-center gap-2">
              <div className="w-8 h-8 rounded-md bg-[var(--color-lf-orange-soft)] text-[var(--color-lf-orange-dark)] flex items-center justify-center">
                <Bot size={14} />
              </div>
              <h3 className="font-semibold text-[var(--color-lf-black)] text-sm">
                Agent boardroom
              </h3>
            </div>
            <ul className="divide-y divide-gray-50 flex-1">
              {[
                { name: 'AI Twin', desc: 'Drafts in your voice' },
                { name: 'Brand & Compliance', desc: 'NMLS, APR, state rules' },
                { name: 'Content Strategy', desc: 'Weekly calendar plan' },
                { name: 'MiniMax Multimodal', desc: 'Text, image, video prompts' },
              ].map((a) => (
                <li key={a.name} className="px-5 py-3 hover:bg-gray-50/60">
                  <p className="text-[13px] font-bold text-[var(--color-lf-black)] leading-tight">
                    {a.name}
                  </p>
                  <p className="text-[11px] text-[var(--color-lf-muted)] mt-0.5">{a.desc}</p>
                </li>
              ))}
            </ul>
            <Link
              href="/agents"
              className="block px-5 py-3 text-center text-[11px] font-bold text-[var(--color-lf-orange-dark)] hover:underline border-t border-gray-50"
            >
              Open Agent boardroom →
            </Link>
          </div>

          {/* Team library activity */}
          <div className="bg-white border border-[var(--color-lf-border)] rounded-2xl flex flex-col">
            <div className="px-5 py-4 border-b border-gray-50 flex items-center gap-2">
              <div className="w-8 h-8 rounded-md bg-[var(--color-lf-orange-soft)] text-[var(--color-lf-orange-dark)] flex items-center justify-center">
                <Library size={14} />
              </div>
              <h3 className="font-semibold text-[var(--color-lf-black)] text-sm">
                Team Library activity
              </h3>
            </div>
            <ul className="divide-y divide-gray-50 flex-1">
              {recentLibrary.map((a) => (
                <li key={a.id} className="px-5 py-3 hover:bg-gray-50/60">
                  <p className="text-[13px] font-bold text-[var(--color-lf-black)] leading-tight line-clamp-1">
                    {a.title}
                  </p>
                  <p className="text-[11px] text-[var(--color-lf-muted)] mt-0.5">
                    Shared by {a.shared_by_display_name} ·{' '}
                    {new Date(a.shared_at).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                    })}
                  </p>
                </li>
              ))}
            </ul>
            <Link
              href="/team-library"
              className="block px-5 py-3 text-center text-[11px] font-bold text-[var(--color-lf-orange-dark)] hover:underline border-t border-gray-50"
            >
              Open Team Library →
            </Link>
          </div>

          {/* Upcoming calendar */}
          <div className="bg-white border border-[var(--color-lf-border)] rounded-2xl flex flex-col">
            <div className="px-5 py-4 border-b border-gray-50 flex items-center gap-2">
              <div className="w-8 h-8 rounded-md bg-[var(--color-lf-orange-soft)] text-[var(--color-lf-orange-dark)] flex items-center justify-center">
                <CalendarDays size={14} />
              </div>
              <h3 className="font-semibold text-[var(--color-lf-black)] text-sm">
                Upcoming on calendar
              </h3>
            </div>
            <ul className="divide-y divide-gray-50 flex-1">
              {upcomingCalendar.map((item) => (
                <li key={item.id} className="px-5 py-3 hover:bg-gray-50/60">
                  <p className="text-[13px] font-bold text-[var(--color-lf-black)] leading-tight line-clamp-1">
                    {item.title}
                  </p>
                  <p className="text-[11px] text-[var(--color-lf-muted)] mt-0.5">
                    {item.channel} ·{' '}
                    {new Date(item.scheduled_for).toLocaleString('en-US', {
                      month: 'short',
                      day: 'numeric',
                      hour: 'numeric',
                      minute: '2-digit',
                    })}
                  </p>
                </li>
              ))}
            </ul>
            <Link
              href="/calendar"
              className="block px-5 py-3 text-center text-[11px] font-bold text-[var(--color-lf-orange-dark)] hover:underline border-t border-gray-50"
            >
              Open calendar →
            </Link>
          </div>
        </section>

        <p className="text-[11px] text-[var(--color-lf-muted)] text-center pt-6">
          Loan Factory, NMLS #320841 · Equal Housing Lender · Every public asset goes through
          Marketing review. No external posting in this pilot.
        </p>
      </div>
    </>
  );
}
