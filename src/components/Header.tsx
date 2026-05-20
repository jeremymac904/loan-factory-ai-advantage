'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useState } from 'react';
import { Menu, X, ArrowRight } from 'lucide-react';
import { AI_ADVANTAGE_LOGO } from '@/lib/brand-assets';

const navLinks = [
  { href: '/', label: 'Home' },
  { href: '/request-access', label: 'Request Access' },
  { href: '/templates-examples', label: 'Templates' },
  { href: '/login', label: 'Login' },
];

function Logo() {
  const [errored, setErrored] = useState(false);

  if (errored) {
    return (
      <span className="text-[var(--color-lf-black)] font-black text-xl leading-tight tracking-tight">
        LOAN FACTORY
        <span className="block text-[var(--color-lf-orange)] text-[11px] font-bold tracking-[0.22em] mt-0.5">
          AI ADVANTAGE
        </span>
      </span>
    );
  }

  return (
    <Image
      src={AI_ADVANTAGE_LOGO}
      alt="Loan Factory AI Advantage"
      width={260}
      height={56}
      priority
      onError={() => setErrored(true)}
      className="h-12 w-auto object-contain"
    />
  );
}

interface QuickSignupState {
  name: string;
  email: string;
  role: string;
  pilot: boolean;
}

const QUICK_ROLES = ['Team Leader', 'Group Leader', 'Loan Officer', 'Marketing', 'Other'];

function QuickSignupModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [form, setForm] = useState<QuickSignupState>({
    name: '',
    email: '',
    role: 'Team Leader',
    pilot: true,
  });
  const [submitted, setSubmitted] = useState(false);

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    // TODO(supabase): persist to access_requests with status='new' and notify
    // Jeremy / Victoria / Andre / Marketing.
    try {
      if (typeof window !== 'undefined') {
        sessionStorage.setItem(
          'lfa_quick_signup',
          JSON.stringify({ ...form, submitted_at: new Date().toISOString() }),
        );
      }
    } catch {
      /* ignore */
    }
    setSubmitted(true);
  }

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[60] bg-black/40 backdrop-blur-sm flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-3xl shadow-2xl max-w-md w-full p-6"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between mb-4">
          <div>
            <span className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-widest text-[var(--color-lf-orange-dark)] bg-[var(--color-lf-orange-soft)] px-2 py-0.5 rounded-full mb-2">
              1+1+1=5 Pilot
            </span>
            <h3 className="text-xl font-black text-[var(--color-lf-black)] tracking-tight">
              {submitted ? "You're on the list." : 'Sign up for AI Advantage.'}
            </h3>
            <p className="text-xs text-[var(--color-lf-muted)] mt-0.5">
              {submitted
                ? 'Jeremy, Victoria, Andre, and Marketing will be in touch.'
                : 'Quick form — under 30 seconds. We follow up with the full application.'}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1 text-[var(--color-lf-muted)] hover:text-red-600"
            aria-label="Close"
          >
            <X size={18} />
          </button>
        </div>

        {submitted ? (
          <div className="space-y-4">
            <p className="text-sm text-[var(--color-lf-black)] leading-relaxed">
              Thanks {form.name.split(' ')[0] || 'there'} — we&apos;ll reach out within 1–2 business
              days. Want to give us more detail now?
            </p>
            <div className="flex gap-2">
              <Link
                href="/request-access"
                onClick={onClose}
                className="flex-1 inline-flex items-center justify-center gap-1.5 bg-[var(--color-lf-orange)] hover:bg-[var(--color-lf-orange-dark)] text-white text-sm font-bold px-4 py-2.5 rounded-xl"
              >
                Full application <ArrowRight size={13} />
              </Link>
              <button
                type="button"
                onClick={onClose}
                className="inline-flex items-center justify-center gap-1.5 bg-[var(--color-lf-surface)] hover:bg-gray-100 text-[var(--color-lf-black)] text-sm font-semibold px-4 py-2.5 rounded-xl border border-[var(--color-lf-border)]"
              >
                Later
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={onSubmit} className="space-y-3">
            <label className="block">
              <span className="block text-[10px] font-bold uppercase tracking-widest text-[var(--color-lf-muted)] mb-1">
                Full name
              </span>
              <input
                type="text"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                required
                className="w-full border border-[var(--color-lf-border)] rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-lf-orange)]/30 focus:border-[var(--color-lf-orange)]"
                placeholder="Jeremy McDonald"
              />
            </label>
            <label className="block">
              <span className="block text-[10px] font-bold uppercase tracking-widest text-[var(--color-lf-muted)] mb-1">
                Loan Factory email
              </span>
              <input
                type="email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                required
                className="w-full border border-[var(--color-lf-border)] rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-lf-orange)]/30 focus:border-[var(--color-lf-orange)]"
                placeholder="you@loanfactory.com"
              />
            </label>
            <label className="block">
              <span className="block text-[10px] font-bold uppercase tracking-widest text-[var(--color-lf-muted)] mb-1">
                Role
              </span>
              <select
                value={form.role}
                onChange={(e) => setForm({ ...form, role: e.target.value })}
                className="w-full border border-[var(--color-lf-border)] rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-lf-orange)]/30 focus:border-[var(--color-lf-orange)] bg-white"
              >
                {QUICK_ROLES.map((r) => (
                  <option key={r} value={r}>
                    {r}
                  </option>
                ))}
              </select>
            </label>
            <label className="flex items-start gap-2 text-xs pt-1">
              <input
                type="checkbox"
                checked={form.pilot}
                onChange={(e) => setForm({ ...form, pilot: e.target.checked })}
                className="mt-1"
              />
              <span className="text-[var(--color-lf-black)]">
                I want access to the <span className="font-bold">1+1+1=5 pilot</span>.
              </span>
            </label>
            <button
              type="submit"
              className="w-full inline-flex items-center justify-center gap-2 bg-[var(--color-lf-orange)] hover:bg-[var(--color-lf-orange-dark)] text-white font-bold px-4 py-3 rounded-xl text-sm transition-colors"
            >
              Sign Up <ArrowRight size={14} />
            </button>
            <p className="text-[10px] text-[var(--color-lf-muted)] text-center pt-1 leading-relaxed">
              Demo mode — requests stay in browser state until Supabase is wired. By signing up, you
              agree to follow the Loan Factory Marketing Policy.
            </p>
          </form>
        )}
      </div>
    </div>
  );
}

export default function Header() {
  const [open, setOpen] = useState(false);
  const [signupOpen, setSignupOpen] = useState(false);

  return (
    <>
      <header className="bg-white border-b border-[var(--color-lf-border)] sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            <Link
              href="/"
              className="flex items-center"
              aria-label="Loan Factory AI Advantage home"
            >
              <Logo />
            </Link>
            <nav className="hidden md:flex items-center gap-6" aria-label="Primary">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="text-[var(--color-lf-muted)] hover:text-[var(--color-lf-black)] font-medium text-sm transition-colors"
                >
                  {link.label}
                </Link>
              ))}
              <button
                type="button"
                onClick={() => setSignupOpen(true)}
                className="inline-flex items-center gap-1.5 bg-[var(--color-lf-orange)] hover:bg-[var(--color-lf-orange-dark)] text-white px-5 py-2.5 rounded-xl text-sm font-bold transition-colors shadow-sm shadow-[var(--color-lf-orange)]/20"
              >
                Sign Up <ArrowRight size={14} />
              </button>
            </nav>
            <button
              className="md:hidden text-[var(--color-lf-black)]"
              onClick={() => setOpen(!open)}
              aria-label="Toggle menu"
            >
              {open ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
        {open && (
          <div className="md:hidden border-t border-[var(--color-lf-border)] bg-white px-4 py-4 space-y-3">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="block text-[var(--color-lf-black)] font-medium py-1"
                onClick={() => setOpen(false)}
              >
                {link.label}
              </Link>
            ))}
            <button
              type="button"
              onClick={() => {
                setOpen(false);
                setSignupOpen(true);
              }}
              className="block w-full bg-[var(--color-lf-orange)] hover:bg-[var(--color-lf-orange-dark)] text-white px-4 py-2.5 rounded-xl text-sm font-bold text-center"
            >
              Sign Up
            </button>
          </div>
        )}
      </header>
      <QuickSignupModal open={signupOpen} onClose={() => setSignupOpen(false)} />
    </>
  );
}
