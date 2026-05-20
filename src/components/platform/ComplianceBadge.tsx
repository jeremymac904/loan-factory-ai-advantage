import { AlertTriangle, CheckCircle2, ShieldAlert } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { ComplianceSeverity } from '@/lib/platform-types';

export type ComplianceBadgeKind =
  | 'pre-approved'
  | 'needs-personalization'
  | 'state-restricted'
  | 'pending-review'
  | 'approved'
  | 'blocked';

export interface ComplianceBadgeProps {
  kind?: ComplianceBadgeKind;
  severity?: ComplianceSeverity;
  /** Override label. */
  label?: string;
  className?: string;
}

const kindStyles: Record<ComplianceBadgeKind, { label: string; classes: string; icon: React.ReactNode }> = {
  'pre-approved': {
    label: 'Pre-approved',
    classes: 'bg-green-50 text-green-700 border border-green-100',
    icon: <CheckCircle2 size={11} />,
  },
  'needs-personalization': {
    label: 'Needs personalization',
    classes: 'bg-amber-50 text-amber-700 border border-amber-100',
    icon: <AlertTriangle size={11} />,
  },
  'state-restricted': {
    label: 'State-restricted',
    classes: 'bg-purple-50 text-purple-700 border border-purple-100',
    icon: <ShieldAlert size={11} />,
  },
  'pending-review': {
    label: 'Pending review',
    classes: 'bg-yellow-50 text-yellow-700 border border-yellow-100',
    icon: <AlertTriangle size={11} />,
  },
  approved: {
    label: 'Approved',
    classes: 'bg-blue-50 text-blue-700 border border-blue-100',
    icon: <CheckCircle2 size={11} />,
  },
  blocked: {
    label: 'Blocked',
    classes: 'bg-red-50 text-red-700 border border-red-100',
    icon: <ShieldAlert size={11} />,
  },
};

const severityStyles: Record<ComplianceSeverity, { label: string; classes: string; icon: React.ReactNode }> = {
  info: {
    label: 'Info',
    classes: 'bg-blue-50 text-blue-700 border border-blue-100',
    icon: <CheckCircle2 size={11} />,
  },
  warning: {
    label: 'Warning',
    classes: 'bg-amber-50 text-amber-700 border border-amber-100',
    icon: <AlertTriangle size={11} />,
  },
  blocking: {
    label: 'Blocking',
    classes: 'bg-red-50 text-red-700 border border-red-100',
    icon: <ShieldAlert size={11} />,
  },
};

export default function ComplianceBadge({ kind, severity, label, className }: ComplianceBadgeProps) {
  const spec = kind
    ? kindStyles[kind]
    : severity
    ? severityStyles[severity]
    : kindStyles.approved;

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wide px-2 py-0.5 rounded-full',
        spec.classes,
        className,
      )}
    >
      {spec.icon}
      {label ?? spec.label}
    </span>
  );
}
