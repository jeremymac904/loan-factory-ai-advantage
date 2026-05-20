'use client';

import { useState } from 'react';
import {
  FileText,
  Files,
  Image as ImageIcon,
  LayoutTemplate,
  MessageSquareQuote,
  Palette,
  Share2,
  Copy,
  CheckCheck,
} from 'lucide-react';
import Topbar from '@/components/platform/Topbar';
import { sharedTeamAssets } from '@/lib/platform-mock-data';
import type { SharedAssetKind } from '@/lib/platform-types';

const SECTIONS: { key: SharedAssetKind; label: string; icon: React.ReactNode; description: string }[] = [
  {
    key: 'template',
    label: 'Shared Templates',
    icon: <LayoutTemplate size={16} />,
    description: 'Pre-approved post and email templates the whole team can use.',
  },
  {
    key: 'caption',
    label: 'Shared Captions',
    icon: <MessageSquareQuote size={16} />,
    description: 'Plug-and-play caption blocks for common content patterns.',
  },
  {
    key: 'brand-asset',
    label: 'Shared Brand Assets',
    icon: <Palette size={16} />,
    description: 'Loan Factory wordmarks, Equal Housing Lender marks, color tokens.',
  },
  {
    key: 'persona-file',
    label: 'Shared Persona Files',
    icon: <FileText size={16} />,
    description: 'Brand voice and persona documents shared by Team Leaders.',
  },
  {
    key: 'reference-image',
    label: 'Shared Reference Images',
    icon: <ImageIcon size={16} />,
    description: 'B-roll and image libraries cleared for marketing use.',
  },
];

export default function TeamLibraryPage() {
  const [activeKind, setActiveKind] = useState<SharedAssetKind | 'all'>('all');
  const [busy, setBusy] = useState<string | null>(null);

  function flash(id: string) {
    setBusy(id);
    setTimeout(() => setBusy(null), 1500);
  }

  return (
    <>
      <Topbar
        title="Team Library"
        subtitle="Shared assets across The Legends Mortgage Team. Borrow, duplicate, or request a review."
        rightSlot={
          <button
            type="button"
            className="inline-flex items-center gap-1.5 bg-[var(--color-lf-orange)] hover:bg-[var(--color-lf-orange-dark)] text-white text-sm font-bold px-4 py-2 rounded-xl transition-colors"
          >
            <Share2 size={14} /> Share Template
          </button>
        }
      />

      <div className="px-5 sm:px-8 py-8 space-y-6">
        {/* Section chips */}
        <section className="flex items-center gap-2 flex-wrap">
          <button
            type="button"
            onClick={() => setActiveKind('all')}
            className={`text-xs font-semibold px-3 py-1.5 rounded-full border ${
              activeKind === 'all'
                ? 'bg-[#003087] border-[#003087] text-white'
                : 'bg-white border-gray-200 text-gray-600 hover:border-[#003087] hover:text-[#003087]'
            }`}
          >
            All
          </button>
          {SECTIONS.map((s) => (
            <button
              key={s.key}
              type="button"
              onClick={() => setActiveKind(s.key)}
              className={`text-xs font-semibold px-3 py-1.5 rounded-full border inline-flex items-center gap-1 ${
                activeKind === s.key
                  ? 'bg-[#003087] border-[#003087] text-white'
                  : 'bg-white border-gray-200 text-gray-600 hover:border-[#003087] hover:text-[#003087]'
              }`}
            >
              {s.icon}
              {s.label.replace('Shared ', '')}
            </button>
          ))}
        </section>

        {/* Sectioned cards */}
        {SECTIONS.filter((s) => activeKind === 'all' || s.key === activeKind).map((section) => {
          const items = sharedTeamAssets.filter((a) => a.kind === section.key);
          if (items.length === 0 && activeKind !== 'all') return null;

          return (
            <section
              key={section.key}
              className="bg-white border border-[var(--color-lf-border)] rounded-2xl"
            >
              <div className="px-5 py-4 border-b border-gray-50 flex items-center justify-between gap-3">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-9 h-9 rounded-lg bg-[var(--color-lf-orange-soft)] text-[var(--color-lf-orange-dark)] flex items-center justify-center">
                    {section.icon}
                  </div>
                  <div className="min-w-0">
                    <h3 className="font-semibold text-gray-800 text-sm">{section.label}</h3>
                    <p className="text-xs text-gray-500 truncate">{section.description}</p>
                  </div>
                </div>
                <span className="text-[10px] font-semibold text-gray-400 uppercase tracking-widest">
                  {items.length}
                </span>
              </div>

              {items.length === 0 ? (
                <p className="px-5 py-10 text-sm text-gray-500 text-center">
                  Nothing shared in this section yet.
                </p>
              ) : (
                <ul className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 p-5">
                  {items.map((a) => (
                    <li
                      key={a.id}
                      className="border border-gray-100 rounded-xl p-4 hover:border-[var(--color-lf-orange)] hover:shadow-sm transition-all"
                    >
                      <div className="flex items-center gap-2 mb-2">
                        <Files size={13} className="text-gray-400" />
                        <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400">
                          {section.label.replace('Shared ', '')}
                        </span>
                      </div>
                      <p className="font-semibold text-gray-800 text-sm leading-snug">{a.title}</p>
                      <p className="text-xs text-gray-500 mt-1 leading-relaxed line-clamp-3">
                        {a.description}
                      </p>
                      <p className="text-[10px] text-gray-400 mt-3">
                        Shared by {a.shared_by_display_name} ·{' '}
                        {new Date(a.shared_at).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric',
                        })}
                      </p>
                      <div className="flex items-center gap-2 mt-4 pt-3 border-t border-gray-50">
                        <button
                          type="button"
                          onClick={() => flash(`${a.id}-dup`)}
                          className="inline-flex items-center gap-1 text-xs font-semibold text-gray-700 bg-gray-50 hover:bg-gray-100 px-2.5 py-1.5 rounded-lg"
                        >
                          {busy === `${a.id}-dup` ? (
                            <CheckCheck size={12} className="text-green-600" />
                          ) : (
                            <Copy size={12} />
                          )}
                          {busy === `${a.id}-dup` ? 'Duplicated' : 'Duplicate to my workspace'}
                        </button>
                        <button
                          type="button"
                          onClick={() => flash(`${a.id}-rev`)}
                          className="inline-flex items-center gap-1 text-xs font-semibold text-[var(--color-lf-orange-dark)] hover:underline ml-auto"
                        >
                          {busy === `${a.id}-rev` ? 'Sent' : 'Request review'}
                        </button>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </section>
          );
        })}
      </div>
    </>
  );
}
