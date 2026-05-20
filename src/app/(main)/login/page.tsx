'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, LogIn, ShieldAlert, Sparkles } from 'lucide-react';
import {
  DEMO_ROLES,
  getRoleById,
  writeDemoRole,
  type DemoRoleId,
} from '@/lib/demo-roles';
import { useDemoRole } from '@/components/platform/useDemoRole';
import { AI_ADVANTAGE_LOGO } from '@/lib/brand-assets';

export default function LoginPage() {
  const router = useRouter();
  const persistedRole = useDemoRole();
  const [email, setEmail] = useState('jeremy@mcdonald-mtg.com');
  const [role, setRole] = useState<DemoRoleId>(persistedRole);
  const [logoErrored, setLogoErrored] = useState(false);

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    writeDemoRole(role);
    const destination = getRoleById(role).primary_path;
    router.push(destination);
  }

  return (
    <div className="max-w-md mx-auto px-4 sm:px-6 py-16">
      <div className="text-center mb-8">
        <Link
          href="/"
          className="inline-block mb-6"
          aria-label="Loan Factory AI Advantage home"
        >
          {logoErrored ? (
            <span className="text-[var(--color-lf-black)] font-black text-2xl leading-tight tracking-tight">
              LOAN FACTORY
              <span className="block text-[var(--color-lf-orange)] text-xs font-bold tracking-[0.22em] mt-0.5">
                AI ADVANTAGE
              </span>
            </span>
          ) : (
            <Image
              src={AI_ADVANTAGE_LOGO}
              alt="Loan Factory AI Advantage"
              width={260}
              height={56}
              priority
              onError={() => setLogoErrored(true)}
              className="h-12 w-auto object-contain"
            />
          )}
        </Link>
        <span className="inline-flex items-center gap-1.5 bg-[var(--color-lf-orange-soft)] text-[var(--color-lf-orange-dark)] text-[11px] font-bold uppercase tracking-[0.18em] px-3 py-1 rounded-full mb-3">
          <Sparkles size={11} /> Demo login
        </span>
        <h1 className="text-3xl font-black text-[var(--color-lf-black)] tracking-tight">
          Welcome back.
        </h1>
        <p className="text-sm text-[var(--color-lf-muted)] mt-1">
          Pick a role to impersonate. Real SSO + Supabase auth land in Phase 1.
        </p>
      </div>

      <form
        onSubmit={onSubmit}
        className="bg-white border border-[var(--color-lf-border)] rounded-3xl p-6 sm:p-7 space-y-5"
      >
        <label className="block">
          <span className="block text-[10px] font-bold uppercase tracking-widest text-[var(--color-lf-muted)] mb-1.5">
            Loan Factory email
          </span>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full border border-[var(--color-lf-border)] rounded-xl px-3 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-lf-orange)]/30 focus:border-[var(--color-lf-orange)]"
            placeholder="you@loanfactory.com"
            autoComplete="email"
          />
        </label>

        <div>
          <span className="block text-[10px] font-bold uppercase tracking-widest text-[var(--color-lf-muted)] mb-2">
            Role (demo)
          </span>
          <div className="grid sm:grid-cols-2 gap-2">
            {DEMO_ROLES.map((r) => {
              const active = r.id === role;
              return (
                <button
                  key={r.id}
                  type="button"
                  onClick={() => setRole(r.id)}
                  className={`text-left rounded-xl border px-3 py-2.5 transition-colors ${
                    active
                      ? 'border-[var(--color-lf-orange)] bg-[var(--color-lf-orange-soft)]'
                      : 'border-[var(--color-lf-border)] hover:border-[var(--color-lf-orange)]'
                  }`}
                >
                  <p className="text-sm font-bold text-[var(--color-lf-black)]">{r.name}</p>
                  <p className="text-[11px] text-[var(--color-lf-muted)] mt-0.5 leading-snug">
                    {r.description}
                  </p>
                </button>
              );
            })}
          </div>
        </div>

        <button
          type="submit"
          className="w-full inline-flex items-center justify-center gap-2 bg-[var(--color-lf-orange)] hover:bg-[var(--color-lf-orange-dark)] text-white font-bold px-4 py-3 rounded-xl text-sm transition-colors shadow-sm shadow-[var(--color-lf-orange)]/20"
        >
          <LogIn size={14} /> Continue as {getRoleById(role).name} <ArrowRight size={14} />
        </button>

        <div className="bg-yellow-50 border border-yellow-100 rounded-xl p-3 flex items-start gap-2">
          <ShieldAlert size={13} className="text-yellow-700 mt-0.5 shrink-0" />
          <p className="text-[11px] text-yellow-800 leading-relaxed">
            <span className="font-bold">Demo only.</span> No password is collected. Real Loan
            Factory SSO + Supabase auth land in Phase 1 — this page exists to give you the right
            dashboard view while we build.
          </p>
        </div>
      </form>

      <p className="text-center text-[11px] text-[var(--color-lf-muted)] mt-6">
        Don&apos;t have access yet?{' '}
        <Link href="/request-access" className="font-bold text-[var(--color-lf-orange-dark)] hover:underline">
          Request access
        </Link>{' '}
        — Jeremy, Victoria, Andre, and Marketing review every request.
      </p>
    </div>
  );
}
