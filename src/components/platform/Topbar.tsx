'use client';

import { Bell, Search } from 'lucide-react';
import Image from 'next/image';
import { currentUserProfile } from '@/lib/platform-mock-data';

export interface TopbarProps {
  title: string;
  subtitle?: string;
  rightSlot?: React.ReactNode;
}

export default function Topbar({ title, subtitle, rightSlot }: TopbarProps) {
  const u = currentUserProfile;
  const initials = u.full_name
    .split(' ')
    .map((p) => p[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();

  return (
    <header className="sticky top-0 z-30 bg-white/90 backdrop-blur border-b border-[var(--color-lf-border)]">
      <div className="flex items-center gap-4 px-5 sm:px-8 h-16">
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-3">
            <h1 className="text-lg sm:text-xl font-bold text-[#003087] truncate">{title}</h1>
            <span
              className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-full bg-yellow-100 text-yellow-800"
              title="No external posting. All data is local until Supabase is wired."
            >
              <span className="w-1.5 h-1.5 rounded-full bg-yellow-500" />
              Demo Mode
            </span>
          </div>
          {subtitle && <p className="text-xs text-gray-500 mt-0.5 truncate">{subtitle}</p>}
        </div>

        <div className="hidden lg:flex items-center gap-2 bg-gray-50 border border-gray-200 rounded-lg px-3 py-1.5 w-72">
          <Search size={14} className="text-gray-400 shrink-0" />
          <input
            type="text"
            placeholder="Search templates, drafts, team..."
            className="bg-transparent text-sm focus:outline-none w-full text-gray-700 placeholder:text-gray-400"
            aria-label="Search workspace"
          />
        </div>

        <button
          type="button"
          className="relative p-2 rounded-lg text-gray-500 hover:text-[#003087] hover:bg-gray-50"
          aria-label="Notifications"
        >
          <Bell size={18} />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-[var(--color-lf-orange)]" />
        </button>

        {rightSlot}

        <div className="flex items-center gap-3 pl-2 border-l border-gray-100">
          <div className="text-right hidden sm:block leading-tight">
            <p className="text-xs font-semibold text-gray-800">{u.preferred_display_name}</p>
            <p className="text-[10px] text-gray-400">NMLS #{u.nmls_number}</p>
          </div>
          <div className="w-9 h-9 rounded-full bg-[#003087] text-white flex items-center justify-center font-bold text-sm overflow-hidden">
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
