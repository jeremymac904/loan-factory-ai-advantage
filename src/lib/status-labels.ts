// Standardized status labels and color tones used across the app.
//
// All asset / submission / workspace / request surfaces should pull from
// here so the visual language stays consistent between Builder, Admin,
// Admin Intake, Content Studio, Dashboard, and Templates.
//
// Hard rule (pilot policy): every public-facing asset defaults to
// `needs-marketing-review`. Surfaces that auto-bump to `draft` must show
// an explicit "submit for review" action — never skip review.

export type PlatformStatus =
  | 'draft'
  | 'needs-info'
  | 'needs-marketing-review'
  | 'approved'
  | 'workspace-ready'
  | 'published';

export const PLATFORM_STATUSES: PlatformStatus[] = [
  'draft',
  'needs-info',
  'needs-marketing-review',
  'approved',
  'workspace-ready',
  'published',
];

export const STATUS_LABEL: Record<PlatformStatus, string> = {
  draft: 'Draft',
  'needs-info': 'Needs Info',
  'needs-marketing-review': 'Needs Marketing Review',
  approved: 'Approved',
  'workspace-ready': 'Workspace Ready',
  published: 'Published',
};

/** Tailwind class string for badges. Pair with shared chip styles. */
export const STATUS_TONE: Record<PlatformStatus, string> = {
  draft: 'bg-gray-100 text-gray-700 border border-gray-200',
  'needs-info': 'bg-amber-50 text-amber-700 border border-amber-100',
  'needs-marketing-review':
    'bg-[var(--color-lf-orange-soft)] text-[var(--color-lf-orange-dark)] border border-orange-100',
  approved: 'bg-blue-50 text-blue-700 border border-blue-100',
  'workspace-ready': 'bg-indigo-50 text-indigo-700 border border-indigo-100',
  published: 'bg-emerald-50 text-emerald-700 border border-emerald-100',
};

/** Required compliance reminders surfaced anywhere a mortgage asset is composed. */
export const COMPLIANCE_REMINDERS = [
  'Loan Factory, NMLS #320841',
  'Individual LO NMLS',
  'Equal Housing Lender',
  'APR shown alongside any rate mentioned',
  'No unsupported claims (lowest rate, best rate, guaranteed approval, no closing costs)',
  'No borrower data or private loan information',
] as const;
