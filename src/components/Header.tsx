'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useState } from 'react';
import { Menu, X } from 'lucide-react';
import { AI_ADVANTAGE_LOGO } from '@/lib/brand-assets';

const navLinks = [
  { href: '/', label: 'Home' },
  { href: '/request-access', label: 'Request Access' },
  { href: '/builder', label: 'Builder' },
  { href: '/templates-examples', label: 'Templates' },
  { href: '/dashboard', label: 'Dashboard' },
  { href: '/admin', label: 'Admin' },
];

function Logo() {
  const [errored, setErrored] = useState(false);

  if (errored) {
    return (
      <span className="text-[var(--color-lf-black)] font-black text-lg leading-tight tracking-tight">
        LOAN FACTORY
        <span className="block text-[var(--color-lf-orange)] text-[10px] font-bold tracking-[0.22em] mt-0.5">
          AI ADVANTAGE
        </span>
      </span>
    );
  }

  return (
    <Image
      src={AI_ADVANTAGE_LOGO}
      alt="Loan Factory AI Advantage"
      width={180}
      height={40}
      priority
      onError={() => setErrored(true)}
      className="h-9 w-auto object-contain"
    />
  );
}

export default function Header() {
  const [open, setOpen] = useState(false);

  return (
    <header className="bg-white border-b border-[var(--color-lf-border)] sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link
            href="/"
            className="flex items-center"
            aria-label="Loan Factory AI Advantage home"
          >
            <Logo />
          </Link>
          <nav className="hidden md:flex items-center gap-7" aria-label="Primary">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-[var(--color-lf-muted)] hover:text-[var(--color-lf-black)] font-medium text-sm transition-colors"
              >
                {link.label}
              </Link>
            ))}
            <Link
              href="/builder"
              className="bg-[var(--color-lf-orange)] hover:bg-[var(--color-lf-orange-dark)] text-white px-4 py-2 rounded-xl text-sm font-bold transition-colors"
            >
              Build My Site
            </Link>
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
          <Link
            href="/builder"
            className="block bg-[var(--color-lf-orange)] hover:bg-[var(--color-lf-orange-dark)] text-white px-4 py-2 rounded-xl text-sm font-bold text-center"
            onClick={() => setOpen(false)}
          >
            Build My Site
          </Link>
        </div>
      )}
    </header>
  );
}
