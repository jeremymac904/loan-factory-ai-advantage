import Link from 'next/link';
import {
  ArrowRight,
  Clock,
  FileText,
  Globe,
  LayoutTemplate,
  PenSquare,
  ShieldCheck,
  UploadCloud,
  UserCircle,
  Image as ImageIcon,
  CheckSquare,
} from 'lucide-react';
import Topbar from '@/components/platform/Topbar';
import StatCard from '@/components/platform/StatCard';
import ComplianceBadge from '@/components/platform/ComplianceBadge';
import {
  contentDrafts,
  currentUserProfile,
  dashboardStats,
  marketingTemplates,
} from '@/lib/platform-mock-data';

export default function PlatformDashboardPage() {
  const u = currentUserProfile;
  const featuredTemplates = marketingTemplates.filter((t) => t.shared_with_team).slice(0, 3);
  const recentDrafts = [...contentDrafts]
    .sort((a, b) => (a.updated_at < b.updated_at ? 1 : -1))
    .slice(0, 4);

  const quickActions = [
    {
      title: 'Build Team Leader Website',
      icon: <Globe size={18} />,
      href: '/builder',
    },
    {
      title: 'Create Social Post',
      icon: <PenSquare size={18} />,
      href: '/content-studio',
    },
    {
      title: 'Upload Persona Document',
      icon: <FileText size={18} />,
      href: '/profile#persona',
    },
    {
      title: 'Upload Reference Image',
      icon: <ImageIcon size={18} />,
      href: '/profile#reference',
    },
    {
      title: 'Open Compliance Checklist',
      icon: <CheckSquare size={18} />,
      href: '/compliance',
    },
  ];

  return (
    <>
      <Topbar
        title={`Welcome back, ${u.preferred_display_name.split(' ')[0]}.`}
        subtitle={`${u.team_name ?? 'Solo'} · ${u.licensed_states.join(', ')} · Loan Factory NMLS #320841`}
      />

      <div className="px-5 sm:px-8 py-8 space-y-10">
        {/* Welcome / completion card */}
        <section className="bg-gradient-to-br from-[#003087] to-[#001a4d] text-white rounded-3xl p-6 sm:p-8 grid md:grid-cols-3 gap-6 items-center shadow-lg">
          <div className="md:col-span-2">
            <span className="inline-block bg-[var(--color-lf-orange)] text-white text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-full mb-3">
              1+1+1=5 Pilot
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold mb-2 leading-tight">
              Your marketing studio is ready.
            </h2>
            <p className="text-blue-100 text-sm leading-relaxed mb-5 max-w-lg">
              Build a Team Leader site, ship a compliant social post, and share your wins with the team —
              all from one workspace. Marketing reviews every public asset before it goes live.
            </p>
            <div className="flex flex-wrap gap-3">
              <Link
                href="/content-studio"
                className="inline-flex items-center gap-2 bg-[var(--color-lf-orange)] hover:bg-[var(--color-lf-orange-dark)] text-white font-bold px-5 py-2.5 rounded-xl text-sm transition-colors"
              >
                Create Social Post <ArrowRight size={14} />
              </Link>
              <Link
                href="/templates-examples"
                className="inline-flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white font-semibold px-5 py-2.5 rounded-xl text-sm transition-colors"
              >
                Browse Templates
              </Link>
            </div>
          </div>
          <div className="bg-white/10 rounded-2xl p-5 backdrop-blur">
            <div className="flex items-center justify-between mb-2">
              <p className="text-xs uppercase tracking-widest text-blue-200 font-semibold">
                Profile completion
              </p>
              <span className="text-2xl font-black text-white">{u.profile_completion_pct}%</span>
            </div>
            <div className="h-2 bg-white/10 rounded-full overflow-hidden">
              <div
                className="h-full bg-[var(--color-lf-orange)]"
                style={{ width: `${u.profile_completion_pct}%` }}
              />
            </div>
            <p className="text-[11px] text-blue-200 mt-3">
              Add your AI reference image and persona doc to hit 100%.
            </p>
            <Link
              href="/profile"
              className="mt-3 inline-flex items-center gap-1 text-xs font-semibold text-white hover:underline"
            >
              Finish profile <ArrowRight size={12} />
            </Link>
          </div>
        </section>

        {/* Stat row */}
        <section className="grid grid-cols-2 md:grid-cols-5 gap-4">
          <StatCard
            label="Profile completion"
            value={`${dashboardStats.profile_completion_pct}%`}
            icon={<UserCircle size={18} />}
            tone="navy"
            progressPct={dashboardStats.profile_completion_pct}
          />
          <StatCard
            label="Templates available"
            value={dashboardStats.templates_available}
            icon={<LayoutTemplate size={18} />}
            tone="orange"
            hint="Pre-approved by Marketing"
          />
          <StatCard
            label="Draft posts"
            value={dashboardStats.draft_posts}
            icon={<PenSquare size={18} />}
            tone="gold"
          />
          <StatCard
            label="Pending review"
            value={dashboardStats.pending_compliance_review}
            icon={<ShieldCheck size={18} />}
            tone="yellow"
            hint="Marketing review queue"
          />
          <StatCard
            label="Team assets live"
            value={dashboardStats.published_team_assets}
            icon={<Globe size={18} />}
            tone="green"
            delta="+3 this week"
          />
        </section>

        {/* Quick actions */}
        <section>
          <h3 className="text-sm font-bold uppercase tracking-widest text-gray-500 mb-3">
            Quick actions
          </h3>
          <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-3">
            {quickActions.map((a) => (
              <Link
                key={a.title}
                href={a.href}
                className="group bg-white border border-[var(--color-lf-border)] rounded-2xl p-5 hover:border-[var(--color-lf-orange)] hover:shadow-md transition-all"
              >
                <div className="w-10 h-10 rounded-lg bg-[var(--color-lf-orange-soft)] text-[var(--color-lf-orange-dark)] flex items-center justify-center mb-4 group-hover:bg-[var(--color-lf-orange)] group-hover:text-white transition-colors">
                  {a.icon}
                </div>
                <p className="text-sm font-semibold text-gray-800 leading-tight">{a.title}</p>
                <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-gray-400 mt-3 group-hover:text-[var(--color-lf-orange-dark)]">
                  Open <ArrowRight size={11} />
                </span>
              </Link>
            ))}
          </div>
        </section>

        {/* Two-column: drafts + featured templates */}
        <section className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 bg-white border border-[var(--color-lf-border)] rounded-2xl">
            <div className="px-5 py-4 border-b border-gray-50 flex items-center justify-between">
              <h3 className="font-semibold text-gray-800">Recent drafts</h3>
              <Link
                href="/content-studio"
                className="text-xs font-semibold text-[var(--color-lf-orange-dark)] hover:underline"
              >
                Open Content Studio →
              </Link>
            </div>
            {recentDrafts.length === 0 ? (
              <p className="px-5 py-10 text-sm text-gray-500 text-center">No drafts yet.</p>
            ) : (
              <ul className="divide-y divide-gray-50">
                {recentDrafts.map((d) => (
                  <li key={d.id} className="px-5 py-4 hover:bg-gray-50/60">
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <p className="font-semibold text-gray-800 text-sm truncate">{d.title}</p>
                        <p className="text-xs text-gray-500 mt-0.5 truncate">{d.campaign_goal}</p>
                        <div className="flex items-center gap-2 mt-2">
                          {d.channels.slice(0, 3).map((c) => (
                            <span
                              key={c}
                              className="text-[10px] font-medium text-gray-500 bg-gray-50 border border-gray-100 px-2 py-0.5 rounded-full"
                            >
                              {c}
                            </span>
                          ))}
                        </div>
                      </div>
                      <div className="text-right space-y-2 shrink-0">
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
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div className="bg-white border border-[var(--color-lf-border)] rounded-2xl">
            <div className="px-5 py-4 border-b border-gray-50 flex items-center justify-between">
              <h3 className="font-semibold text-gray-800">Featured templates</h3>
              <Link
                href="/templates-examples"
                className="text-xs font-semibold text-[var(--color-lf-orange-dark)] hover:underline"
              >
                All templates →
              </Link>
            </div>
            <ul className="divide-y divide-gray-50">
              {featuredTemplates.map((t) => (
                <li key={t.id} className="px-5 py-4 hover:bg-gray-50/60">
                  <p className="font-semibold text-gray-800 text-sm">{t.title}</p>
                  <p className="text-xs text-gray-500 mt-0.5">
                    {t.category} · {t.format}
                  </p>
                  <ComplianceBadge kind={t.compliance_status} className="mt-2" />
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* Bottom: profile + uploads CTA */}
        <section className="bg-white border border-[var(--color-lf-border)] rounded-2xl p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-lg bg-[var(--color-lf-orange-soft)] text-[var(--color-lf-orange-dark)] flex items-center justify-center">
              <UploadCloud size={18} />
            </div>
            <div>
              <p className="font-semibold text-gray-800 text-sm">
                Reference images & persona docs make every post sharper.
              </p>
              <p className="text-xs text-gray-500 mt-0.5">
                Upload your headshot, an AI reference image, and a short persona doc on your profile.
              </p>
            </div>
          </div>
          <Link
            href="/profile"
            className="inline-flex items-center gap-1 bg-[var(--color-lf-orange)] hover:bg-[var(--color-lf-orange-dark)] text-white font-bold text-sm px-4 py-2.5 rounded-xl transition-colors"
          >
            Go to Profile <ArrowRight size={13} />
          </Link>
        </section>
      </div>
    </>
  );
}
