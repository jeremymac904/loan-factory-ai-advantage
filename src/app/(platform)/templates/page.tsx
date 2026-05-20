'use client';

import { useMemo, useState } from 'react';
import Topbar from '@/components/platform/Topbar';
import TemplateCard from '@/components/platform/TemplateCard';
import { marketingTemplates } from '@/lib/platform-mock-data';
import type { TemplateCategory, TemplateFormat } from '@/lib/platform-types';

const CATEGORIES: TemplateCategory[] = [
  'Recruiting',
  'Realtor Partner',
  'Consumer Education',
  'First Time Buyer',
  'VA Loans',
  'FHA Loans',
  'DSCR and Investor',
  'Spanish Content',
  'Team Leader Marketing',
];

const FORMATS: TemplateFormat[] = [
  'Reel',
  'Static Post',
  'Carousel',
  'Story',
  'Email',
  'Landing Page',
  'Flyer',
  'Video Script',
];

export default function TemplatesPage() {
  const [category, setCategory] = useState<TemplateCategory | null>(null);
  const [format, setFormat] = useState<TemplateFormat | null>(null);

  const filtered = useMemo(() => {
    return marketingTemplates.filter((t) => {
      if (category && t.category !== category) return false;
      if (format && t.format !== format) return false;
      return true;
    });
  }, [category, format]);

  function handleUse(id: string) {
    console.info(`[demo] Use template ${id} — would prefill Content Studio.`);
  }

  function handleShare(id: string) {
    console.info(`[demo] Share template ${id} — would add to Team Library.`);
  }

  return (
    <>
      <Topbar
        title="Template Library"
        subtitle="Pre-approved Loan Factory marketing assets. Pick a starting point, then personalize in Content Studio."
      />

      <div className="px-5 sm:px-8 py-8 space-y-6">
        {/* Filters */}
        <section className="bg-white border border-[var(--color-lf-border)] rounded-2xl p-5">
          <div className="flex items-center justify-between mb-3 flex-wrap gap-2">
            <h3 className="text-sm font-semibold text-gray-800">Browse</h3>
            <p className="text-[11px] text-gray-400">
              Showing <span className="font-bold text-gray-800">{filtered.length}</span> of{' '}
              {marketingTemplates.length}
            </p>
          </div>

          <div className="mb-3">
            <p className="text-[10px] font-semibold uppercase tracking-widest text-gray-400 mb-2">
              Category
            </p>
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => setCategory(null)}
                className={`text-xs font-semibold px-3 py-1.5 rounded-full border transition-colors ${
                  category === null
                    ? 'bg-[#003087] border-[#003087] text-white'
                    : 'bg-white border-gray-200 text-gray-600 hover:border-[#003087] hover:text-[#003087]'
                }`}
              >
                All
              </button>
              {CATEGORIES.map((c) => (
                <button
                  type="button"
                  key={c}
                  onClick={() => setCategory(category === c ? null : c)}
                  className={`text-xs font-semibold px-3 py-1.5 rounded-full border transition-colors ${
                    category === c
                      ? 'bg-[#003087] border-[#003087] text-white'
                      : 'bg-white border-gray-200 text-gray-600 hover:border-[#003087] hover:text-[#003087]'
                  }`}
                >
                  {c}
                </button>
              ))}
            </div>
          </div>

          <div>
            <p className="text-[10px] font-semibold uppercase tracking-widest text-gray-400 mb-2">
              Format
            </p>
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => setFormat(null)}
                className={`text-xs font-semibold px-3 py-1.5 rounded-full border transition-colors ${
                  format === null
                    ? 'bg-[var(--color-lf-orange)] border-[var(--color-lf-orange)] text-white'
                    : 'bg-white border-gray-200 text-gray-600 hover:border-[var(--color-lf-orange)] hover:text-[var(--color-lf-orange-dark)]'
                }`}
              >
                All
              </button>
              {FORMATS.map((f) => (
                <button
                  type="button"
                  key={f}
                  onClick={() => setFormat(format === f ? null : f)}
                  className={`text-xs font-semibold px-3 py-1.5 rounded-full border transition-colors ${
                    format === f
                      ? 'bg-[var(--color-lf-orange)] border-[var(--color-lf-orange)] text-white'
                      : 'bg-white border-gray-200 text-gray-600 hover:border-[var(--color-lf-orange)] hover:text-[var(--color-lf-orange-dark)]'
                  }`}
                >
                  {f}
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* Grid */}
        {filtered.length === 0 ? (
          <div className="bg-white border border-[var(--color-lf-border)] rounded-2xl py-20 text-center">
            <p className="text-sm text-gray-500">No templates match those filters.</p>
            <button
              type="button"
              onClick={() => {
                setCategory(null);
                setFormat(null);
              }}
              className="mt-3 text-xs font-semibold text-[var(--color-lf-orange-dark)] hover:underline"
            >
              Clear filters →
            </button>
          </div>
        ) : (
          <section className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {filtered.map((t) => (
              <TemplateCard
                key={t.id}
                template={t}
                onUse={handleUse}
                onShare={handleShare}
              />
            ))}
          </section>
        )}

        <p className="text-[11px] text-gray-400 text-center pt-2">
          All templates carry Loan Factory NMLS #320841 and the Equal Housing Lender mark. Marketing
          may require additional state-specific language before publish.
        </p>
      </div>
    </>
  );
}
