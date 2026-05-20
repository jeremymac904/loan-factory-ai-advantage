'use client';
import Link from 'next/link';
import { useState } from 'react';
import { Menu, X } from 'lucide-react';

const navLinks = [
  { href: '/', label: 'Home' },
  { href: '/builder', label: 'Builder' },
  { href: '/showcase', label: 'Showcase' },
  { href: '/dashboard', label: 'Dashboard' },
  { href: '/admin', label: 'Admin' },
];

export default function Header() {
  const [open, setOpen] = useState(false);

  return (
    <header className="bg-white border-b border-gray-100 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="flex items-center gap-2">
            <span className="text-[#003087] font-bold text-lg leading-tight">
              Loan Factory<br />
              <span className="text-[#C8960C] text-sm font-semibold tracking-wide">AI ADVANTAGE</span>
            </span>
          </Link>
          <nav className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link key={link.href} href={link.href}
                className="text-gray-600 hover:text-[#003087] font-medium text-sm transition-colors">
                {link.label}
              </Link>
            ))}
            <Link href="/builder"
              className="bg-[#003087] text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-[#002060] transition-colors">
              Build My Site
            </Link>
          </nav>
          <button className="md:hidden" onClick={() => setOpen(!open)}>
            {open ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>
      {open && (
        <div className="md:hidden border-t border-gray-100 bg-white px-4 py-4 space-y-3">
          {navLinks.map((link) => (
            <Link key={link.href} href={link.href}
              className="block text-gray-700 font-medium py-1" onClick={() => setOpen(false)}>
              {link.label}
            </Link>
          ))}
          <Link href="/builder"
            className="block bg-[#003087] text-white px-4 py-2 rounded-lg text-sm font-semibold text-center"
            onClick={() => setOpen(false)}>
            Build My Site
          </Link>
        </div>
      )}
    </header>
  );
}
