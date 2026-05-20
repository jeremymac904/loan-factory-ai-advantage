'use client';

import { useState } from 'react';
import { Bell, Lock, ShieldCheck, Users, Wand2 } from 'lucide-react';
import Topbar from '@/components/platform/Topbar';
import { defaultPlatformSettings } from '@/lib/platform-mock-data';
import type { PlatformSettings } from '@/lib/platform-types';

function Toggle({
  on,
  onChange,
  ariaLabel,
}: {
  on: boolean;
  onChange: (v: boolean) => void;
  ariaLabel: string;
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={on}
      aria-label={ariaLabel}
      onClick={() => onChange(!on)}
      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
        on ? 'bg-[var(--color-lf-orange)]' : 'bg-gray-200'
      }`}
    >
      <span
        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
          on ? 'translate-x-6' : 'translate-x-1'
        }`}
      />
    </button>
  );
}

function Row({
  title,
  description,
  on,
  onChange,
  locked,
  lockedReason,
}: {
  title: string;
  description: string;
  on: boolean;
  onChange: (v: boolean) => void;
  locked?: boolean;
  lockedReason?: string;
}) {
  return (
    <div className="flex items-start gap-4 px-5 py-4 border-b border-gray-50 last:border-b-0">
      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold text-gray-800">{title}</p>
        <p className="text-xs text-gray-500 mt-0.5">{description}</p>
        {locked && lockedReason && (
          <p className="text-[11px] text-amber-700 bg-amber-50 border border-amber-100 rounded-md px-2 py-1 mt-2 inline-flex items-center gap-1">
            <Lock size={11} /> {lockedReason}
          </p>
        )}
      </div>
      {locked ? (
        <span className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-widest text-gray-500 bg-gray-100 px-2 py-1 rounded-full whitespace-nowrap">
          <Lock size={10} /> Locked
        </span>
      ) : (
        <Toggle on={on} onChange={onChange} ariaLabel={title} />
      )}
    </div>
  );
}

export default function SettingsPage() {
  const [settings, setSettings] = useState<PlatformSettings>(defaultPlatformSettings);

  function update<T extends keyof PlatformSettings>(key: T, value: PlatformSettings[T]) {
    setSettings((prev) => ({ ...prev, [key]: value }));
  }

  function patch<T extends 'notifications' | 'compliance_review' | 'publishing_controls'>(
    section: T,
    sub: PlatformSettings[T] extends infer S ? keyof S : never,
    value: boolean,
  ) {
    setSettings((prev) => ({
      ...prev,
      [section]: {
        ...prev[section],
        [sub]: value,
      },
    }));
  }

  return (
    <>
      <Topbar
        title="Settings"
        subtitle="Workspace controls for the pilot. Publishing controls are intentionally locked off."
      />

      <div className="px-5 sm:px-8 py-8 space-y-6 max-w-3xl">
        {/* Demo mode */}
        <section className="bg-white border border-[var(--color-lf-border)] rounded-2xl">
          <header className="px-5 py-4 border-b border-gray-50 flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-yellow-50 text-yellow-700 flex items-center justify-center">
              <Wand2 size={16} />
            </div>
            <div>
              <h2 className="font-semibold text-gray-800 text-sm">Demo Mode</h2>
              <p className="text-xs text-gray-500">
                Demo mode is on whenever Supabase persistence is not configured. Read-only badge.
              </p>
            </div>
          </header>
          <Row
            title="Demo mode active"
            description="The app reads from local mock data. Submissions and approvals do not persist."
            on={settings.demo_mode}
            onChange={() => {}}
            locked
            lockedReason="Becomes editable once Supabase is wired."
          />
        </section>

        {/* Team sharing */}
        <section className="bg-white border border-[var(--color-lf-border)] rounded-2xl">
          <header className="px-5 py-4 border-b border-gray-50 flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-[var(--color-lf-orange-soft)] text-[var(--color-lf-orange-dark)] flex items-center justify-center">
              <Users size={16} />
            </div>
            <div>
              <h2 className="font-semibold text-gray-800 text-sm">Team Sharing</h2>
              <p className="text-xs text-gray-500">
                Controls how this workspace contributes to the Team Library.
              </p>
            </div>
          </header>
          <Row
            title="Team sharing enabled"
            description="Templates and assets I mark as shared appear in the Team Library."
            on={settings.team_sharing_enabled}
            onChange={(v) => update('team_sharing_enabled', v)}
          />
        </section>

        {/* Notifications */}
        <section className="bg-white border border-[var(--color-lf-border)] rounded-2xl">
          <header className="px-5 py-4 border-b border-gray-50 flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-blue-50 text-blue-700 flex items-center justify-center">
              <Bell size={16} />
            </div>
            <div>
              <h2 className="font-semibold text-gray-800 text-sm">Notifications</h2>
              <p className="text-xs text-gray-500">Email alerts only — no SMS in the pilot.</p>
            </div>
          </header>
          <Row
            title="Email me when Marketing finishes review"
            description="Sent to your Loan Factory company email."
            on={settings.notifications.email_on_review_complete}
            onChange={(v) => patch('notifications', 'email_on_review_complete', v)}
          />
          <Row
            title="Email me when a teammate shares an asset"
            description="One email per share. No digests."
            on={settings.notifications.email_on_team_shares}
            onChange={(v) => patch('notifications', 'email_on_team_shares', v)}
          />
          <Row
            title="Weekly digest"
            description="Monday morning summary of drafts, approvals, and scheduled posts."
            on={settings.notifications.weekly_digest}
            onChange={(v) => patch('notifications', 'weekly_digest', v)}
          />
        </section>

        {/* Compliance review */}
        <section className="bg-white border border-[var(--color-lf-border)] rounded-2xl">
          <header className="px-5 py-4 border-b border-gray-50 flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-green-50 text-green-700 flex items-center justify-center">
              <ShieldCheck size={16} />
            </div>
            <div>
              <h2 className="font-semibold text-gray-800 text-sm">Compliance Review</h2>
              <p className="text-xs text-gray-500">
                How aggressively the workspace gates publishes behind Marketing review.
              </p>
            </div>
          </header>
          <Row
            title="Require Marketing approval before any public publish"
            description="Strongly recommended for the pilot."
            on={settings.compliance_review.require_marketing_approval}
            onChange={(v) => patch('compliance_review', 'require_marketing_approval', v)}
            locked
            lockedReason="Required by pilot policy — cannot be disabled."
          />
          <Row
            title="Auto-attach NMLS and Equal Housing Lender disclosures on submit"
            description="Appends the standard compliance footer to every submitted draft."
            on={settings.compliance_review.auto_attach_disclosures}
            onChange={(v) => patch('compliance_review', 'auto_attach_disclosures', v)}
          />
        </section>

        {/* Publishing controls */}
        <section className="bg-white border border-[var(--color-lf-border)] rounded-2xl">
          <header className="px-5 py-4 border-b border-gray-50 flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-red-50 text-red-700 flex items-center justify-center">
              <Lock size={16} />
            </div>
            <div>
              <h2 className="font-semibold text-gray-800 text-sm">Publishing Controls</h2>
              <p className="text-xs text-gray-500">
                External posting and outbound email are <span className="font-bold">disabled</span>{' '}
                by policy during the pilot.
              </p>
            </div>
          </header>
          <Row
            title="External posting to social platforms"
            description="Direct API publishing to Meta, LinkedIn, TikTok, etc."
            on={settings.publishing_controls.external_posting_enabled}
            onChange={(v) => patch('publishing_controls', 'external_posting_enabled', v)}
            locked
            lockedReason="Disabled for the pilot. Requires Marketing & IT sign-off to enable."
          />
          <Row
            title="Outbound email sending"
            description="Programmatic sends through SendGrid or the Loan Factory mail relay."
            on={settings.publishing_controls.email_sending_enabled}
            onChange={(v) => patch('publishing_controls', 'email_sending_enabled', v)}
            locked
            lockedReason="Disabled for the pilot. Email comms must go through your Loan Factory account."
          />
          <Row
            title="Public publish requires approval"
            description="Even after the kill-switches above are flipped, every public asset still requires Marketing approval."
            on={settings.publishing_controls.public_publish_requires_approval}
            onChange={(v) => patch('publishing_controls', 'public_publish_requires_approval', v)}
            locked
            lockedReason="Required by pilot policy — cannot be disabled."
          />
        </section>

        <p className="text-[11px] text-gray-400 text-center pt-2">
          Changes persist in this browser only until Supabase auth and the Settings table are wired.
        </p>
      </div>
    </>
  );
}
