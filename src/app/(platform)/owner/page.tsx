'use client';

import Link from 'next/link';
import {
  ArrowRight,
  Bot,
  CheckCircle2,
  CircleDashed,
  Cloud,
  Database,
  Inbox,
  ShieldCheck,
  Sparkles,
  UserCog,
  Users,
  Workflow,
} from 'lucide-react';
import Topbar from '@/components/platform/Topbar';
import { useDemoRole } from '@/components/platform/useDemoRole';
import {
  contentDrafts,
  marketingTemplates,
  sharedTeamAssets,
} from '@/lib/platform-mock-data';
import { mockAccessRequests } from '@/lib/access-request-mock-data';
import { DEMO_ROLES, getRoleById, writeDemoRole } from '@/lib/demo-roles';
import { mockTeamLeaders } from '@/lib/mock-data';

interface SystemStatus {
  label: string;
  state: 'demo' | 'live' | 'planned';
  hint: string;
}

const SYSTEMS: SystemStatus[] = [
  {
    label: 'MiniMax provider',
    state: 'demo',
    hint: 'AI_FEATURES_ENABLED=false. Drafts come from local generator.',
  },
  {
    label: 'Netlify deploy',
    state: 'live',
    hint: 'Auto-deploys from main. Status checks happen in Netlify dashboard.',
  },
  {
    label: 'Supabase persistence',
    state: 'planned',
    hint: 'Phase 1 — schema in supabase/schema.sql, not wired yet.',
  },
  {
    label: 'n8n workflows',
    state: 'planned',
    hint: 'Channel connection + outbound publishing land later.',
  },
];

export default function OwnerDashboardPage() {
  const role = useDemoRole();
  const active = getRoleById(role);

  const accessRequests = mockAccessRequests.length;
  const accessNew = mockAccessRequests.filter((r) => r.status === 'new').length;
  const workspaces = mockTeamLeaders.length;
  const drafts = contentDrafts.length;
  const pendingReview = contentDrafts.filter((d) => d.status === 'Needs Review').length;
  const templates = marketingTemplates.length;
  const teamShares = sharedTeamAssets.length;

  return (
    <>
      <Topbar
        title="Owner — Platform Overview"
        subtitle={`Viewing as ${active.name}. Impersonate any role to see what they see.`}
      />

      <div className="px-5 sm:px-8 py-8 space-y-8">
        {/* Stats row */}
        <section className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            {
              label: 'Access requests',
              value: accessRequests,
              hint: `${accessNew} new`,
              icon: <Inbox size={16} />,
              href: '/admin/intake',
            },
            {
              label: 'Workspaces',
              value: workspaces,
              hint: 'Approved Team Leaders',
              icon: <Users size={16} />,
              href: '/showcase',
            },
            {
              label: 'Drafts in flight',
              value: drafts,
              hint: `${pendingReview} pending review`,
              icon: <Workflow size={16} />,
              href: '/admin',
            },
            {
              label: 'Templates available',
              value: templates,
              hint: `${teamShares} library shares`,
              icon: <Sparkles size={16} />,
              href: '/templates-examples',
            },
          ].map((s) => (
            <Link
              key={s.label}
              href={s.href}
              className="bg-white border border-[var(--color-lf-border)] rounded-2xl p-5 hover:border-[var(--color-lf-orange)] hover:shadow-md transition-all"
            >
              <div className="w-9 h-9 rounded-md bg-[var(--color-lf-orange-soft)] text-[var(--color-lf-orange-dark)] flex items-center justify-center mb-3">
                {s.icon}
              </div>
              <p className="text-2xl font-black text-[var(--color-lf-black)]">{s.value}</p>
              <p className="text-sm text-[var(--color-lf-muted)] mt-0.5">{s.label}</p>
              <p className="text-[11px] text-[var(--color-lf-muted)] mt-1">{s.hint}</p>
            </Link>
          ))}
        </section>

        {/* Two-column: impersonate + system status */}
        <section className="grid lg:grid-cols-2 gap-5">
          {/* Impersonate */}
          <div className="bg-white border border-[var(--color-lf-border)] rounded-2xl p-6">
            <div className="flex items-center gap-2 mb-2">
              <UserCog size={14} className="text-[var(--color-lf-orange)]" />
              <h3 className="text-sm font-bold uppercase tracking-widest text-[var(--color-lf-muted)]">
                Impersonate role
              </h3>
            </div>
            <p className="text-xs text-[var(--color-lf-muted)] mb-4 leading-relaxed">
              Switch into any role to see what that user sees. Real auth + RBAC lands with Supabase.
            </p>
            <ul className="grid sm:grid-cols-2 gap-2">
              {DEMO_ROLES.map((r) => (
                <li key={r.id}>
                  <button
                    type="button"
                    onClick={() => {
                      writeDemoRole(r.id);
                      if (typeof window !== 'undefined') {
                        window.location.assign(r.primary_path);
                      }
                    }}
                    className={`w-full text-left border rounded-xl px-3 py-2.5 transition-colors ${
                      r.id === role
                        ? 'border-[var(--color-lf-orange)] bg-[var(--color-lf-orange-soft)]'
                        : 'border-[var(--color-lf-border)] hover:border-[var(--color-lf-orange)]'
                    }`}
                  >
                    <p className="text-sm font-bold text-[var(--color-lf-black)]">{r.name}</p>
                    <p className="text-[11px] text-[var(--color-lf-muted)] mt-0.5 leading-snug">
                      {r.description}
                    </p>
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* System status */}
          <div className="bg-white border border-[var(--color-lf-border)] rounded-2xl p-6">
            <div className="flex items-center gap-2 mb-2">
              <ShieldCheck size={14} className="text-[var(--color-lf-orange)]" />
              <h3 className="text-sm font-bold uppercase tracking-widest text-[var(--color-lf-muted)]">
                System status
              </h3>
            </div>
            <p className="text-xs text-[var(--color-lf-muted)] mb-4 leading-relaxed">
              Snapshot of which platform layers are demo, live, or planned.
            </p>
            <ul className="space-y-3">
              {SYSTEMS.map((s) => {
                const Icon =
                  s.state === 'live'
                    ? CheckCircle2
                    : s.state === 'planned'
                    ? CircleDashed
                    : Cloud;
                const tone =
                  s.state === 'live'
                    ? 'bg-green-50 text-green-700 border-green-100'
                    : s.state === 'planned'
                    ? 'bg-gray-50 text-gray-600 border-gray-100'
                    : 'bg-yellow-50 text-yellow-800 border-yellow-100';
                return (
                  <li
                    key={s.label}
                    className="flex items-start gap-3 border border-gray-50 rounded-xl p-3"
                  >
                    <Icon
                      size={14}
                      className={`mt-0.5 ${
                        s.state === 'live'
                          ? 'text-green-600'
                          : s.state === 'planned'
                          ? 'text-gray-400'
                          : 'text-yellow-600'
                      }`}
                    />
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-bold text-[var(--color-lf-black)] flex items-center gap-2">
                        {s.label}
                        <span
                          className={`text-[9px] font-bold uppercase tracking-wide px-1.5 py-0.5 rounded-full border ${tone}`}
                        >
                          {s.state}
                        </span>
                      </p>
                      <p className="text-[11px] text-[var(--color-lf-muted)] mt-0.5 leading-snug">
                        {s.hint}
                      </p>
                    </div>
                  </li>
                );
              })}
            </ul>
          </div>
        </section>

        {/* Bottom: quick links to admin tools */}
        <section className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            {
              title: 'Admin intake',
              icon: <Inbox size={16} />,
              href: '/admin/intake',
              desc: `Review ${accessNew} new pilot applications`,
            },
            {
              title: 'Marketing queue',
              icon: <ShieldCheck size={16} />,
              href: '/admin',
              desc: `${pendingReview} drafts pending review`,
            },
            {
              title: 'Agent boardroom',
              icon: <Bot size={16} />,
              href: '/agents',
              desc: 'Eleven specialist agents',
            },
            {
              title: 'Settings & flags',
              icon: <Database size={16} />,
              href: '/settings',
              desc: 'Provider, publishing, compliance toggles',
            },
          ].map((l) => (
            <Link
              key={l.title}
              href={l.href}
              className="bg-white border border-[var(--color-lf-border)] rounded-2xl p-5 hover:border-[var(--color-lf-orange)] hover:shadow-md transition-all"
            >
              <div className="w-9 h-9 rounded-md bg-[var(--color-lf-orange-soft)] text-[var(--color-lf-orange-dark)] flex items-center justify-center mb-3">
                {l.icon}
              </div>
              <p className="text-sm font-bold text-[var(--color-lf-black)]">{l.title}</p>
              <p className="text-[11px] text-[var(--color-lf-muted)] mt-1 leading-snug">{l.desc}</p>
              <span className="inline-flex items-center gap-1 text-[11px] font-bold text-[var(--color-lf-orange-dark)] mt-3">
                Open <ArrowRight size={11} />
              </span>
            </Link>
          ))}
        </section>
      </div>
    </>
  );
}
