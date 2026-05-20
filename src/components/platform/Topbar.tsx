'use client';

import { useState } from 'react';
import { Bell, ChevronDown, Search, UserCog } from 'lucide-react';
import Image from 'next/image';
import { currentUserProfile } from '@/lib/platform-mock-data';
import { DEMO_ROLES, getRoleById, writeDemoRole } from '@/lib/demo-roles';
import { useDemoRole } from './useDemoRole';

export interface TopbarProps {
  title: string;
  subtitle?: string;
  rightSlot?: React.ReactNode;
}

export default function Topbar({ title, subtitle, rightSlot }: TopbarProps) {
  const u = currentUserProfile;
  const role = useDemoRole();
  const activeRole = getRoleById(role);
  const [roleOpen, setRoleOpen] = useState(false);

  const initials = u.full_name
    .split(' ')
    .map((p) => p[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();

  return (
    <header className="sticky top-0 z-30 bg-white/95 backdrop-blur border-b border-[var(--color-lf-border)]">
      <div className="flex items-center gap-4 px-5 sm:px-8 h-16">
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-3 flex-wrap">
            <h1 className="text-lg sm:text-xl font-bold text-[var(--color-lf-black)] truncate">
              {title}
            </h1>
            <span
              className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-full bg-yellow-100 text-yellow-800"
              title="No external posting. All data is local until Supabase is wired."
            >
              <span className="w-1.5 h-1.5 rounded-full bg-yellow-500" />
              Demo Mode
            </span>
          </div>
          {subtitle && (
            <p className="text-xs text-[var(--color-lf-muted)] mt-0.5 truncate">{subtitle}</p>
          )}
        </div>

        <div className="hidden lg:flex items-center gap-2 bg-[var(--color-lf-surface)] border border-[var(--color-lf-border)] rounded-lg px-3 py-1.5 w-64">
          <Search size={14} className="text-gray-400 shrink-0" />
          <input
            type="text"
            placeholder="Search templates, drafts, team..."
            className="bg-transparent text-sm focus:outline-none w-full text-[var(--color-lf-black)] placeholder:text-gray-400"
            aria-label="Search workspace"
          />
        </div>

        {/* Demo-mode role switcher */}
        <div className="relative">
          <button
            type="button"
            onClick={() => setRoleOpen((v) => !v)}
            className="inline-flex items-center gap-1.5 bg-[var(--color-lf-orange-soft)] hover:bg-[var(--color-lf-orange-soft)]/80 text-[var(--color-lf-orange-dark)] text-[11px] font-bold uppercase tracking-wide px-2.5 py-1.5 rounded-lg border border-orange-100"
            aria-haspopup="menu"
            aria-expanded={roleOpen}
          >
            <UserCog size={13} />
            <span className="hidden sm:inline">{activeRole.name}</span>
            <ChevronDown size={11} />
          </button>
          {roleOpen && (
            <>
              <div
                className="fixed inset-0 z-20"
                onClick={() => setRoleOpen(false)}
                aria-hidden
              />
              <div
                className="absolute right-0 top-full mt-2 w-72 bg-white border border-[var(--color-lf-border)] rounded-xl shadow-lg z-30 overflow-hidden"
                role="menu"
              >
                <div className="px-4 py-3 border-b border-gray-50 bg-[var(--color-lf-surface)]">
                  <p className="text-[10px] font-bold uppercase tracking-widest text-[var(--color-lf-muted)]">
                    Impersonate role · Demo only
                  </p>
                </div>
                <ul className="divide-y divide-gray-50">
                  {DEMO_ROLES.map((r) => (
                    <li key={r.id}>
                      <button
                        type="button"
                        onClick={() => {
                          writeDemoRole(r.id);
                          setRoleOpen(false);
                          // Navigate to the role's primary path so the view
                          // change is visible immediately.
                          if (typeof window !== 'undefined') {
                            window.location.assign(r.primary_path);
                          }
                        }}
                        className={`w-full text-left px-4 py-2.5 hover:bg-gray-50 ${
                          r.id === role ? 'bg-[var(--color-lf-orange-soft)]/40' : ''
                        }`}
                      >
                        <p className="text-sm font-bold text-[var(--color-lf-black)] flex items-center gap-2">
                          {r.name}
                          {r.id === role && (
                            <span className="text-[9px] font-bold uppercase tracking-wide text-[var(--color-lf-orange-dark)] bg-[var(--color-lf-orange-soft)] px-1.5 py-0.5 rounded-full">
                              Active
                            </span>
                          )}
                        </p>
                        <p className="text-[11px] text-[var(--color-lf-muted)] mt-0.5 leading-snug">
                          {r.description}
                        </p>
                      </button>
                    </li>
                  ))}
                </ul>
                <div className="px-4 py-2.5 text-[10px] text-[var(--color-lf-muted)] bg-[var(--color-lf-surface)] border-t border-gray-50">
                  Real auth + RBAC lands with Supabase. This switcher only changes the local demo view.
                </div>
              </div>
            </>
          )}
        </div>

        <button
          type="button"
          className="relative p-2 rounded-lg text-gray-500 hover:text-[var(--color-lf-black)] hover:bg-gray-50"
          aria-label="Notifications"
        >
          <Bell size={18} />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-[var(--color-lf-orange)]" />
        </button>

        {rightSlot}

        <div className="flex items-center gap-3 pl-2 border-l border-gray-100">
          <div className="text-right hidden sm:block leading-tight">
            <p className="text-xs font-semibold text-[var(--color-lf-black)]">
              {u.preferred_display_name}
            </p>
            <p className="text-[10px] text-gray-400">NMLS #{u.nmls_number}</p>
          </div>
          <div className="w-9 h-9 rounded-full bg-[var(--color-lf-black)] text-white flex items-center justify-center font-bold text-sm overflow-hidden">
            {u.profile_image_url ? (
              <Image
                src={u.profile_image_url}
                alt={u.full_name}
                width={36}
                height={36}
                className="w-full h-full object-cover"
              />
            ) : (
              initials
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
