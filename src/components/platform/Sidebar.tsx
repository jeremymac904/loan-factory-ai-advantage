'use client';

import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import {
  CalendarDays,
  ClipboardCheck,
  Globe,
  LayoutDashboard,
  LayoutTemplate,
  Library,
  PenSquare,
  Settings,
  ShieldCheck,
  User,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { AI_ADVANTAGE_LOGO } from '@/lib/brand-assets';

const items = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/builder', label: 'Website Builder', icon: Globe },
  { href: '/templates-examples', label: 'Templates & Examples', icon: LayoutTemplate },
  { href: '/content-studio', label: 'Content Studio', icon: PenSquare },
  { href: '/calendar', label: 'Calendar', icon: CalendarDays },
  { href: '/team-library', label: 'Team Library', icon: Library },
  { href: '/profile', label: 'Profile', icon: User },
  { href: '/compliance', label: 'Compliance', icon: ClipboardCheck },
  { href: '/admin', label: 'Admin', icon: ShieldCheck },
  { href: '/settings', label: 'Settings', icon: Settings },
];

function SidebarBrand() {
  const [errored, setErrored] = useState(false);

  return (
    <Link href="/dashboard" className="px-6 py-5 border-b border-[var(--color-lf-border)] block">
      {errored ? (
        <div className="leading-tight">
          <span className="block font-black text-[var(--color-lf-black)] text-base tracking-tight">
            LOAN FACTORY
          </span>
          <span className="block text-[10px] font-bold uppercase tracking-[0.22em] text-[var(--color-lf-orange)] mt-0.5">
            AI Advantage
          </span>
        </div>
      ) : (
        <Image
          src={AI_ADVANTAGE_LOGO}
          alt="Loan Factory AI Advantage"
          width={180}
          height={40}
          priority
          onError={() => setErrored(true)}
          className="h-9 w-auto object-contain"
        />
      )}
      <span className="mt-2 inline-block text-[10px] font-semibold uppercase tracking-widest text-[var(--color-lf-muted)]">
        1+1+1=5 Pilot
      </span>
    </Link>
  );
}

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside
      className="hidden md:flex md:flex-col md:w-64 md:shrink-0 bg-white border-r border-[var(--color-lf-border)] sticky top-0 h-screen"
      aria-label="Platform navigation"
    >
      {/* Brand block */}
      <SidebarBrand />

      <nav className="flex-1 overflow-y-auto px-3 py-4">
        <p className="px-3 mb-2 text-[10px] font-semibold uppercase tracking-widest text-gray-400">
          Workspace
        </p>
        <ul className="space-y-0.5">
          {items.map((it) => {
            const Icon = it.icon;
            const active = pathname === it.href || pathname.startsWith(it.href + '/');
            return (
              <li key={it.href}>
                <Link
                  href={it.href}
                  className={cn(
                    'flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors',
                    active
                      ? 'bg-[var(--color-lf-orange-soft)] text-[var(--color-lf-orange-dark)]'
                      : 'text-gray-600 hover:text-[#003087] hover:bg-gray-50',
                  )}
                >
                  <Icon
                    size={16}
                    className={cn(
                      active ? 'text-[var(--color-lf-orange)]' : 'text-gray-400',
                    )}
                  />
                  <span>{it.label}</span>
                </Link>
              </li>
            );
          })}
        </ul>

        <p className="mt-8 px-3 mb-2 text-[10px] font-semibold uppercase tracking-widest text-gray-400">
          Public site
        </p>
        <ul className="space-y-0.5">
          <li>
            <Link
              href="/"
              className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium text-[var(--color-lf-muted)] hover:text-[var(--color-lf-black)] hover:bg-gray-50"
            >
              <span className="w-2 h-2 rounded-full bg-gray-300" />
              AI Advantage Home
            </Link>
          </li>
        </ul>
      </nav>

      <div className="px-4 py-4 border-t border-[var(--color-lf-border)] text-[11px] text-gray-400">
        <p className="font-semibold text-gray-600">Loan Factory, Inc.</p>
        <p>NMLS #320841 · Equal Housing Lender</p>
      </div>
    </aside>
  );
}
