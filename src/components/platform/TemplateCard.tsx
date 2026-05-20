'use client';

import { Share2, Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { MarketingTemplate } from '@/lib/platform-types';
import ComplianceBadge from './ComplianceBadge';

const tones: Record<MarketingTemplate['thumbnail_color'], string> = {
  navy: 'from-[#003087] to-[#001a4d]',
  gold: 'from-[#C8960C] to-[#a87a0a]',
  orange: 'from-[#FF6B2C] to-[#e35314]',
  green: 'from-emerald-600 to-emerald-800',
  purple: 'from-purple-700 to-indigo-900',
};

export interface TemplateCardProps {
  template: MarketingTemplate;
  onUse?: (id: string) => void;
  onShare?: (id: string) => void;
}

export default function TemplateCard({ template, onUse, onShare }: TemplateCardProps) {
  return (
    <article className="bg-white border border-[var(--color-lf-border)] rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow flex flex-col">
      {/* Thumbnail */}
      <div
        className={cn(
          'h-28 bg-gradient-to-br relative px-5 py-4 text-white flex flex-col justify-between',
          tones[template.thumbnail_color],
        )}
      >
        <span className="text-[10px] font-bold uppercase tracking-widest opacity-80">
          {template.format}
        </span>
        <p className="text-sm font-semibold leading-tight line-clamp-2">{template.title}</p>
      </div>

      {/* Body */}
      <div className="p-5 flex-1 flex flex-col">
        <div className="flex items-center gap-2 mb-2 flex-wrap">
          <span className="text-[10px] font-bold uppercase tracking-widest text-[var(--color-lf-orange-dark)] bg-[var(--color-lf-orange-soft)] px-2 py-0.5 rounded-full">
            {template.category}
          </span>
          <ComplianceBadge kind={template.compliance_status} />
        </div>

        <p className="text-sm text-gray-600 leading-relaxed line-clamp-3 mb-4">
          {template.description}
        </p>

        <div className="flex flex-wrap gap-1 mb-4">
          {template.channels.slice(0, 3).map((ch) => (
            <span
              key={ch}
              className="text-[10px] font-medium text-gray-500 bg-gray-50 border border-gray-100 px-2 py-0.5 rounded-full"
            >
              {ch}
            </span>
          ))}
        </div>

        {template.state_restrictions && template.state_restrictions.length > 0 && (
          <p className="text-[11px] text-purple-700 bg-purple-50 border border-purple-100 rounded-md px-2 py-1 mb-3">
            Restricted to: {template.state_restrictions.join(', ')}
          </p>
        )}

        <div className="flex items-center justify-between mt-auto pt-3 border-t border-gray-50">
          <p className="text-[11px] text-gray-400">{template.use_count.toLocaleString()} uses</p>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => onShare?.(template.id)}
              className="inline-flex items-center gap-1 text-xs font-semibold text-gray-600 hover:text-[#003087] px-2.5 py-1.5 rounded-lg hover:bg-gray-50 transition-colors"
              aria-label={`Share ${template.title} with team`}
            >
              <Share2 size={13} /> Share
            </button>
            <button
              type="button"
              onClick={() => onUse?.(template.id)}
              className="inline-flex items-center gap-1 text-xs font-bold text-white bg-[var(--color-lf-orange)] hover:bg-[var(--color-lf-orange-dark)] px-3 py-1.5 rounded-lg transition-colors"
              aria-label={`Use ${template.title}`}
            >
              <Sparkles size={13} /> Use Template
            </button>
          </div>
        </div>
      </div>
    </article>
  );
}
