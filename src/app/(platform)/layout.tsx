import PlatformShell from '@/components/platform/PlatformShell';

export const metadata = {
  title: 'Loan Factory AI Advantage — Workspace',
  description:
    'Ally-inspired marketing platform for Loan Factory Team Leaders in the 1+1+1=5 pilot.',
};

/**
 * (platform) route group — the authenticated app shell for the pilot.
 *
 * Auth is not yet wired. Until Supabase auth and role gating are in place,
 * every (platform) page renders with a visible "Demo Mode" indicator in the
 * Topbar. Do NOT remove that indicator until real auth + RLS gates are live.
 *
 * TODO(auth): replace this layout with a guard that:
 *   1. Verifies a Supabase session cookie.
 *   2. Loads the PlatformUserProfile for the session user.
 *   3. Redirects to a login page when missing.
 */
export default function PlatformLayout({ children }: { children: React.ReactNode }) {
  return <PlatformShell>{children}</PlatformShell>;
}
