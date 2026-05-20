import { cn } from '@/lib/utils';

export type StatTone = 'navy' | 'orange' | 'gold' | 'green' | 'yellow' | 'gray';

const toneStyles: Record<StatTone, string> = {
  navy: 'bg-blue-50 text-[#003087]',
  orange: 'bg-[var(--color-lf-orange-soft)] text-[var(--color-lf-orange-dark)]',
  gold: 'bg-amber-50 text-amber-700',
  green: 'bg-green-50 text-green-700',
  yellow: 'bg-yellow-50 text-yellow-700',
  gray: 'bg-gray-50 text-gray-600',
};

export interface StatCardProps {
  label: string;
  value: string | number;
  icon: React.ReactNode;
  tone?: StatTone;
  delta?: string;
  hint?: string;
  /** When true, render with a subtle progress bar (for completion-style stats). */
  progressPct?: number;
}

export default function StatCard({
  label,
  value,
  icon,
  tone = 'navy',
  delta,
  hint,
  progressPct,
}: StatCardProps) {
  return (
    <div className="bg-white border border-[var(--color-lf-border)] rounded-2xl p-5 shadow-sm">
      <div className="flex items-start justify-between">
        <div
          className={cn(
            'inline-flex items-center justify-center w-10 h-10 rounded-lg',
            toneStyles[tone],
          )}
        >
          {icon}
        </div>
        {delta && (
          <span className="text-[11px] font-semibold text-green-600 bg-green-50 px-2 py-0.5 rounded-full">
            {delta}
          </span>
        )}
      </div>
      <p className="text-3xl font-black text-gray-900 mt-4 leading-none">{value}</p>
      <p className="text-sm text-gray-500 mt-1">{label}</p>
      {hint && <p className="text-[11px] text-gray-400 mt-2">{hint}</p>}
      {typeof progressPct === 'number' && (
        <div className="mt-4">
          <div className="h-1.5 w-full bg-gray-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-[var(--color-lf-orange)] transition-all"
              style={{ width: `${Math.max(0, Math.min(100, progressPct))}%` }}
              role="progressbar"
              aria-valuenow={progressPct}
              aria-valuemin={0}
              aria-valuemax={100}
            />
          </div>
        </div>
      )}
    </div>
  );
}
