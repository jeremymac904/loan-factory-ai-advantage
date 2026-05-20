// Demo-mode role system. Used by the role switcher in Topbar, the /login
// demo page, and role-aware dashboards. State is stored in localStorage so it
// survives a page reload but never touches the server.
//
// Phase 1 will swap this for a real Supabase auth + RBAC layer.

export type DemoRoleId =
  | 'owner'
  | 'marketing-admin'
  | 'recruiting-admin'
  | 'lo-development-admin'
  | 'team-leader'
  | 'loan-officer';

export interface DemoRole {
  id: DemoRoleId;
  name: string;
  description: string;
  primary_path: string;
  badge_tone: 'orange' | 'black' | 'gray';
}

export const DEMO_ROLES: DemoRole[] = [
  {
    id: 'owner',
    name: 'Owner',
    description: 'Platform-wide visibility. Impersonate any other role.',
    primary_path: '/owner',
    badge_tone: 'orange',
  },
  {
    id: 'marketing-admin',
    name: 'Marketing Admin',
    description: 'Marketing review queue, branding, content, compliance.',
    primary_path: '/admin',
    badge_tone: 'orange',
  },
  {
    id: 'recruiting-admin',
    name: 'Recruiting Admin',
    description: 'Recruiting templates, campaigns, pipeline visibility.',
    primary_path: '/admin',
    badge_tone: 'orange',
  },
  {
    id: 'lo-development-admin',
    name: 'LO Development Admin',
    description: 'Team Leader readiness, training, coaching follow-up.',
    primary_path: '/admin',
    badge_tone: 'orange',
  },
  {
    id: 'team-leader',
    name: 'Team Leader',
    description: 'Team workspace, templates, content, marketing review.',
    primary_path: '/dashboard',
    badge_tone: 'black',
  },
  {
    id: 'loan-officer',
    name: 'Loan Officer',
    description: 'My profile, my templates, my drafts, my AI Twin, my training.',
    primary_path: '/dashboard',
    badge_tone: 'gray',
  },
];

// Today's next move — copy varies by role. Keep it to a single string per role.
export const TODAYS_NEXT_MOVE: Record<DemoRoleId, { title: string; body: string; cta_label: string; cta_href: string }> = {
  owner: {
    title: 'Review pending access requests',
    body: 'There are pilot applications waiting. Triage, approve, or send for more info.',
    cta_label: 'Open Admin Intake',
    cta_href: '/admin/intake',
  },
  'marketing-admin': {
    title: 'Clear the Marketing review queue',
    body: 'Drafts and templates are waiting on your approval before they ship.',
    cta_label: 'Open Review Queue',
    cta_href: '/admin',
  },
  'recruiting-admin': {
    title: 'Push out this week\'s recruiting kit',
    body: 'Update the recruiting deck, clone the recruiting post template, and assign Team Leaders.',
    cta_label: 'Open Templates',
    cta_href: '/templates-examples',
  },
  'lo-development-admin': {
    title: 'Check Team Leader workspace readiness',
    body: 'Three Team Leaders are still under 60% setup. Nudge them through the next checklist item.',
    cta_label: 'Open Dashboard',
    cta_href: '/dashboard',
  },
  'team-leader': {
    title: 'Finish your workspace setup',
    body: 'Upload your AI reference image and persona doc, then submit your first asset for Marketing review.',
    cta_label: 'Go to Profile',
    cta_href: '/profile',
  },
  'loan-officer': {
    title: 'Create your first post',
    body: 'Pick an approved template and draft a compliant post — your Team Leader or Marketing will review.',
    cta_label: 'Open Content Studio',
    cta_href: '/content-studio',
  },
};

// Dashboard "Three Actions" — three primary action cards above the fold,
// keyed by role. Keeps the dashboard ADHD-friendly: three boxes, no decisions.
export const THREE_ACTIONS: Record<
  DemoRoleId,
  { title: string; href: string }[]
> = {
  owner: [
    { title: 'Review access requests', href: '/admin/intake' },
    { title: 'Create a workspace', href: '/admin/intake' },
    { title: 'Approve marketing review items', href: '/admin' },
  ],
  'marketing-admin': [
    { title: 'Review content drafts', href: '/admin' },
    { title: 'Approve template revisions', href: '/admin' },
    { title: 'Flag compliance issues', href: '/compliance' },
  ],
  'recruiting-admin': [
    { title: 'Clone a recruiting template', href: '/templates-examples' },
    { title: 'Send a recruiting campaign', href: '/content-studio' },
    { title: 'Assign Team Leaders', href: '/admin/intake' },
  ],
  'lo-development-admin': [
    { title: 'Check Team Leader readiness', href: '/dashboard' },
    { title: 'Assign a training kit', href: '/training' },
    { title: 'Open the launch checklist', href: '/compliance' },
  ],
  'team-leader': [
    { title: 'Create first template', href: '/templates-examples' },
    { title: 'Build a campaign', href: '/content-studio' },
    { title: 'Submit for Marketing review', href: '/admin' },
  ],
  'loan-officer': [
    { title: 'Complete profile', href: '/profile' },
    { title: 'Choose approved template', href: '/templates-examples' },
    { title: 'Create first post', href: '/content-studio' },
  ],
};

// LocalStorage key. Reading is safe everywhere (returns default on SSR / missing).
const STORAGE_KEY = 'lfa_demo_role';

export function readDemoRole(): DemoRoleId {
  if (typeof window === 'undefined') return 'team-leader';
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (raw && DEMO_ROLES.some((r) => r.id === raw)) return raw as DemoRoleId;
  } catch {
    /* ignore */
  }
  return 'team-leader';
}

export function writeDemoRole(role: DemoRoleId): void {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.setItem(STORAGE_KEY, role);
    // Fire a same-tab notification so other components can react.
    window.dispatchEvent(new CustomEvent('lfa-role-changed', { detail: role }));
  } catch {
    /* ignore */
  }
}

export function getRoleById(id: DemoRoleId): DemoRole {
  return DEMO_ROLES.find((r) => r.id === id) ?? DEMO_ROLES[0];
}
