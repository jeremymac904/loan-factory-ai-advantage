import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import type { Metadata } from 'next';
import { getTeamLeaderBySlug, getPublishedTeamLeaders } from '@/lib/mock-data';
import { generateTagline, formatNMLS } from '@/lib/utils';
import {
  Star,
  Home,
  Shield,
  DollarSign,
  Building2,
  Leaf,
  UserCheck,
  Award,
  ArrowRight,
  Phone,
  Mail,
  MapPin,
  Globe,
  ExternalLink,
  ChevronRight,
  Quote,
} from 'lucide-react';

export async function generateStaticParams() {
  return getPublishedTeamLeaders().map((tl) => ({ slug: tl.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const tl = getTeamLeaderBySlug(slug);
  if (!tl) return { title: 'Team Leader Not Found' };
  const tagline = generateTagline(tl);
  return {
    title: `${tl.full_name} | ${formatNMLS(tl.nmls_number)} | Loan Factory`,
    description: `${tagline}. ${tl.bio.slice(0, 140)}...`,
  };
}

const specialtyIcons: Record<string, React.ReactNode> = {
  VA: <Shield size={28} className="text-[#C8960C]" />,
  FHA: <Home size={28} className="text-[#C8960C]" />,
  Conventional: <Award size={28} className="text-[#C8960C]" />,
  Jumbo: <DollarSign size={28} className="text-[#C8960C]" />,
  DSCR: <Building2 size={28} className="text-[#C8960C]" />,
  USDA: <Leaf size={28} className="text-[#C8960C]" />,
  'Fix & Flip': <Building2 size={28} className="text-[#C8960C]" />,
  'First-Time Buyer': <UserCheck size={28} className="text-[#C8960C]" />,
  Investor: <Building2 size={28} className="text-[#C8960C]" />,
  'Non-QM': <Star size={28} className="text-[#C8960C]" />,
};

const specialtyDescriptions: Record<string, string> = {
  VA: 'Zero-down purchase and rate-and-term refinance for active duty, veterans, and qualifying spouses.',
  FHA: 'Low down payment, flexible credit. The traditional path to homeownership for first-time buyers.',
  Conventional: 'Conforming loans up to standard limits with competitive rates and PMI options.',
  Jumbo: 'Premium financing above conforming limits, with portfolio rates and flexible underwriting.',
  DSCR: 'Investment property loans qualified on rental income — no personal income docs required.',
  USDA: '100% financing in eligible rural and suburban areas with low MI.',
  'First-Time Buyer': 'Down payment assistance, education, and patient guidance through every step.',
  Investor: 'BRRRR, fix-and-flip bridge, DSCR portfolio, and 1031 exchange strategy.',
  'Non-QM': 'Bank statement, asset depletion, and ITIN loans for self-employed and complex profiles.',
  'Bank Statement': '12 or 24 months of statements as income — built for self-employed borrowers.',
  Construction: 'One-time and two-time-close construction financing for new builds and renovations.',
  Reverse: 'HECM and proprietary reverse mortgages for borrowers 62+.',
};

export default async function TeamLeaderSitePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const tl = getTeamLeaderBySlug(slug);
  if (!tl) notFound();

  const tagline = generateTagline(tl);
  const firstName = tl.full_name.split(' ')[0];
  const initials = tl.full_name
    .split(' ')
    .map((p) => p[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();

  const phoneDigits = tl.phone?.replace(/\D/g, '') || '';

  return (
    <div className="bg-white">
      {/* Top utility bar */}
      <div className="bg-[#001a4d] text-white text-xs">
        <div className="max-w-6xl mx-auto px-4 py-2 flex items-center justify-between">
          <span className="text-blue-200">Loan Factory · {formatNMLS(tl.nmls_number)}</span>
          <div className="flex items-center gap-4">
            {tl.phone && (
              <a href={`tel:${phoneDigits}`} className="text-blue-100 hover:text-white flex items-center gap-1">
                <Phone size={11} /> {tl.phone}
              </a>
            )}
            <a href={`mailto:${tl.email}`} className="hidden sm:flex text-blue-100 hover:text-white items-center gap-1">
              <Mail size={11} /> {tl.email}
            </a>
          </div>
        </div>
      </div>

      {/* Personal nav */}
      <nav className="bg-white border-b border-gray-100 sticky top-0 z-40">
        <div className="max-w-6xl mx-auto px-4 flex items-center justify-between h-16">
          <Link href={`/site/${tl.slug}`} className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-[#003087] text-white flex items-center justify-center font-bold text-sm shadow">
              {initials}
            </div>
            <div className="leading-tight">
              <p className="font-bold text-[#003087] text-sm">{tl.full_name}</p>
              <p className="text-[10px] uppercase tracking-widest text-gray-400">
                Senior Mortgage Advisor
              </p>
            </div>
          </Link>
          <div className="hidden md:flex items-center gap-6">
            <a href="#about" className="text-sm text-gray-600 hover:text-[#003087] font-medium">
              About
            </a>
            <a href="#programs" className="text-sm text-gray-600 hover:text-[#003087] font-medium">
              Loan Programs
            </a>
            <a href="#reviews" className="text-sm text-gray-600 hover:text-[#003087] font-medium">
              Reviews
            </a>
            <a href="#contact" className="text-sm text-gray-600 hover:text-[#003087] font-medium">
              Contact
            </a>
            <a
              href="#contact"
              className="inline-flex items-center gap-2 bg-[#003087] text-white text-sm font-semibold px-4 py-2 rounded-lg hover:bg-[#002060] transition-colors"
            >
              Get Pre-Approved <ArrowRight size={14} />
            </a>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-br from-[#003087] via-[#002060] to-[#001a4d] text-white">
        <div className="absolute inset-0 opacity-10" aria-hidden>
          <div className="absolute -top-32 -right-32 w-96 h-96 rounded-full bg-[#C8960C] blur-3xl" />
          <div className="absolute -bottom-40 -left-40 w-96 h-96 rounded-full bg-blue-400 blur-3xl" />
        </div>

        <div className="relative max-w-6xl mx-auto px-4 py-20 grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <span className="inline-block bg-[#C8960C] text-white text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-full mb-5">
              Loan Factory Team Leader
            </span>
            <h1 className="text-4xl md:text-5xl font-black leading-tight mb-3">{tl.full_name}</h1>
            <p className="text-[#C8960C] font-semibold text-lg mb-4">{tagline}</p>
            <p className="text-blue-100 text-base leading-relaxed mb-8 max-w-lg">
              I help families and investors across {tl.service_areas[0]} navigate the mortgage process
              with clarity, honesty, and a sharp pencil on the rates.
            </p>

            <div className="flex flex-wrap gap-3 mb-8">
              {tl.phone && (
                <a
                  href={`tel:${phoneDigits}`}
                  className="inline-flex items-center gap-2 bg-[#C8960C] text-white font-bold px-6 py-3.5 rounded-xl hover:bg-[#a87a0a] transition-colors shadow-lg shadow-[#C8960C]/20"
                >
                  <Phone size={18} /> Call {firstName}
                </a>
              )}
              <a
                href="#contact"
                className="inline-flex items-center gap-2 bg-white/10 backdrop-blur text-white font-semibold px-6 py-3.5 rounded-xl hover:bg-white/20 transition-colors"
              >
                Start My Application <ArrowRight size={16} />
              </a>
            </div>

            <div className="flex items-center gap-6 text-xs text-blue-200 pt-4 border-t border-white/10">
              <div className="flex items-center gap-1.5">
                <Shield size={14} className="text-[#C8960C]" /> {formatNMLS(tl.nmls_number)}
              </div>
              <div className="flex items-center gap-1.5">
                <Award size={14} className="text-[#C8960C]" /> Equal Housing Lender
              </div>
            </div>
          </div>

          <div className="relative flex justify-center lg:justify-end">
            <div className="relative">
              <div className="absolute -inset-4 bg-gradient-to-br from-[#C8960C] to-amber-400 rounded-[2.5rem] rotate-3 opacity-30 blur-2xl" />
              <div className="relative w-64 h-72 md:w-80 md:h-96 rounded-[2rem] overflow-hidden border-4 border-white/30 bg-gray-200 shadow-2xl">
                {tl.headshot_url ? (
                  <Image
                    src={tl.headshot_url}
                    alt={tl.full_name}
                    fill
                    sizes="(min-width: 1024px) 320px, 256px"
                    className="object-cover"
                    priority
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-[#C8960C] text-white text-7xl font-black">
                    {initials}
                  </div>
                )}
              </div>
              <div className="absolute -bottom-5 -left-5 bg-white text-[#003087] px-4 py-3 rounded-2xl shadow-xl">
                <div className="flex items-center gap-2">
                  <div className="flex">
                    {[0, 1, 2, 3, 4].map((i) => (
                      <Star key={i} size={14} className="fill-[#C8960C] text-[#C8960C]" />
                    ))}
                  </div>
                  <span className="text-xs font-bold">5.0 Rating</span>
                </div>
                <p className="text-[10px] text-gray-500 mt-0.5">Based on verified reviews</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Trust strip */}
      <section className="bg-gray-50 border-y border-gray-100">
        <div className="max-w-6xl mx-auto px-4 py-6 grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          {[
            { value: tl.service_areas.length + '+', label: 'Cities Served' },
            { value: tl.languages.length, label: 'Languages' },
            { value: tl.specialties.length, label: 'Loan Programs' },
            { value: '1–2 Days', label: 'Pre-Approval' },
          ].map((stat) => (
            <div key={stat.label}>
              <p className="text-3xl font-black text-[#003087]">{stat.value}</p>
              <p className="text-xs uppercase tracking-widest text-gray-500 mt-1">{stat.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* About */}
      <section id="about" className="py-20 px-4">
        <div className="max-w-5xl mx-auto grid md:grid-cols-3 gap-10">
          <div>
            <span className="text-xs uppercase tracking-widest text-[#C8960C] font-bold">
              About
            </span>
            <h2 className="text-3xl md:text-4xl font-bold text-[#003087] mt-2">
              Meet {firstName}.
            </h2>
            <p className="text-sm text-gray-500 mt-3">
              Your local mortgage expert, backed by the Loan Factory wholesale platform.
            </p>
          </div>
          <div className="md:col-span-2">
            <p className="text-gray-700 text-lg leading-relaxed whitespace-pre-line">{tl.bio}</p>
            <div className="grid sm:grid-cols-2 gap-4 mt-10">
              <div className="rounded-2xl border border-gray-100 p-5">
                <div className="flex items-center gap-2 mb-3">
                  <MapPin size={18} className="text-[#C8960C]" />
                  <span className="font-semibold text-[#003087] text-sm uppercase tracking-wide">
                    Service Areas
                  </span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {tl.service_areas.map((area) => (
                    <span
                      key={area}
                      className="bg-blue-50 text-[#003087] text-sm px-3 py-1 rounded-full"
                    >
                      {area}
                    </span>
                  ))}
                </div>
              </div>
              <div className="rounded-2xl border border-gray-100 p-5">
                <div className="flex items-center gap-2 mb-3">
                  <Globe size={18} className="text-[#C8960C]" />
                  <span className="font-semibold text-[#003087] text-sm uppercase tracking-wide">
                    Languages
                  </span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {tl.languages.map((lang) => (
                    <span
                      key={lang}
                      className="bg-amber-50 text-amber-900 text-sm px-3 py-1 rounded-full"
                    >
                      {lang}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Programs */}
      <section id="programs" className="py-20 px-4 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <span className="text-xs uppercase tracking-widest text-[#C8960C] font-bold">
              Loan Programs
            </span>
            <h2 className="text-3xl md:text-4xl font-bold text-[#003087] mt-2 mb-3">
              The programs I run every day.
            </h2>
            <p className="text-gray-500">
              Wholesale pricing through Loan Factory, paired with hands-on guidance for every loan
              type that fits your situation.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {tl.specialties.map((spec) => (
              <div
                key={spec}
                className="bg-white rounded-2xl p-6 border border-gray-100 hover:border-[#003087] hover:shadow-lg transition-all"
              >
                <div className="w-12 h-12 rounded-xl bg-amber-50 flex items-center justify-center mb-4">
                  {specialtyIcons[spec] ?? <Star size={28} className="text-[#C8960C]" />}
                </div>
                <h3 className="font-bold text-[#003087] text-lg mb-2">{spec}</h3>
                <p className="text-sm text-gray-500 leading-relaxed">
                  {specialtyDescriptions[spec] ??
                    `Tailored ${spec} financing strategies with competitive rates and clear guidance.`}
                </p>
                <a
                  href="#contact"
                  className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-[#003087] hover:text-[#C8960C] transition-colors"
                >
                  Ask about {spec} <ChevronRight size={14} />
                </a>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Reviews */}
      <section id="reviews" className="py-20 px-4">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <span className="text-xs uppercase tracking-widest text-[#C8960C] font-bold">
              Client Stories
            </span>
            <h2 className="text-3xl md:text-4xl font-bold text-[#003087] mt-2 mb-3">
              Trusted by families and investors.
            </h2>
            <p className="text-gray-500">Verified reviews on the platforms borrowers actually check.</p>
          </div>

          <div className="grid md:grid-cols-2 gap-6 mb-10">
            <div className="bg-gradient-to-br from-blue-50 to-white rounded-2xl border border-blue-100 p-8 relative">
              <Quote size={36} className="text-[#003087]/10 absolute top-6 right-6" />
              <div className="flex mb-3">
                {[0, 1, 2, 3, 4].map((i) => (
                  <Star key={i} size={16} className="fill-[#C8960C] text-[#C8960C]" />
                ))}
              </div>
              <p className="text-gray-700 leading-relaxed mb-4">
                &ldquo;{firstName} made what felt impossible — actually doable. Closed in 21 days,
                under budget, and answered every late-night question. Could not recommend more.&rdquo;
              </p>
              <p className="text-xs font-semibold text-[#003087]">— Maria & Daniel R., {tl.service_areas[0]}</p>
            </div>
            <div className="bg-gradient-to-br from-amber-50 to-white rounded-2xl border border-amber-100 p-8 relative">
              <Quote size={36} className="text-[#C8960C]/10 absolute top-6 right-6" />
              <div className="flex mb-3">
                {[0, 1, 2, 3, 4].map((i) => (
                  <Star key={i} size={16} className="fill-[#C8960C] text-[#C8960C]" />
                ))}
              </div>
              <p className="text-gray-700 leading-relaxed mb-4">
                &ldquo;Three lenders quoted us. {firstName} was the cheapest, the fastest, and the
                only one who actually picked up the phone on a Saturday. Real pro.&rdquo;
              </p>
              <p className="text-xs font-semibold text-[#003087]">
                — Investor client, {tl.service_areas[tl.service_areas.length - 1]}
              </p>
            </div>
          </div>

          {(tl.google_review_url || tl.zillow_review_url || tl.additional_review_url) && (
            <div className="flex flex-wrap justify-center gap-3">
              {tl.google_review_url && (
                <a
                  href={tl.google_review_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 bg-white border-2 border-gray-200 hover:border-[#003087] text-gray-700 font-semibold px-5 py-2.5 rounded-xl transition-colors"
                >
                  <Star size={16} className="text-yellow-500 fill-yellow-500" /> Read Google Reviews{' '}
                  <ExternalLink size={13} className="text-gray-400" />
                </a>
              )}
              {tl.zillow_review_url && (
                <a
                  href={tl.zillow_review_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 bg-white border-2 border-gray-200 hover:border-[#003087] text-gray-700 font-semibold px-5 py-2.5 rounded-xl transition-colors"
                >
                  <Home size={16} className="text-blue-600" /> Zillow Reviews{' '}
                  <ExternalLink size={13} className="text-gray-400" />
                </a>
              )}
              {tl.additional_review_url && (
                <a
                  href={tl.additional_review_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 bg-white border-2 border-gray-200 hover:border-[#003087] text-gray-700 font-semibold px-5 py-2.5 rounded-xl transition-colors"
                >
                  <Award size={16} className="text-[#C8960C]" /> More Reviews{' '}
                  <ExternalLink size={13} className="text-gray-400" />
                </a>
              )}
            </div>
          )}
        </div>
      </section>

      {/* Contact */}
      <section id="contact" className="py-20 px-4 bg-[#003087]">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-10">
            <span className="text-xs uppercase tracking-widest text-[#C8960C] font-bold">
              Get Started
            </span>
            <h2 className="text-3xl md:text-4xl font-bold text-white mt-2 mb-3">
              Let&apos;s talk about your loan.
            </h2>
            <p className="text-blue-200">
              Drop your info below. {firstName} will personally reach out within one business day.
            </p>
          </div>

          <div className="bg-white rounded-3xl p-8 shadow-2xl">
            <form className="space-y-4">
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1.5 uppercase tracking-wide">
                    First Name
                  </label>
                  <input
                    type="text"
                    placeholder="John"
                    className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#003087]/30 focus:border-[#003087]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1.5 uppercase tracking-wide">
                    Last Name
                  </label>
                  <input
                    type="text"
                    placeholder="Smith"
                    className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#003087]/30 focus:border-[#003087]"
                  />
                </div>
              </div>
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1.5 uppercase tracking-wide">
                    Phone
                  </label>
                  <input
                    type="tel"
                    placeholder="(555) 000-0000"
                    className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#003087]/30 focus:border-[#003087]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1.5 uppercase tracking-wide">
                    Email
                  </label>
                  <input
                    type="email"
                    placeholder="john@email.com"
                    className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#003087]/30 focus:border-[#003087]"
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1.5 uppercase tracking-wide">
                  Loan Type
                </label>
                <select className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#003087]/30 focus:border-[#003087] bg-white">
                  <option>I&apos;m not sure yet — help me decide</option>
                  {tl.specialties.map((s) => (
                    <option key={s}>{s}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1.5 uppercase tracking-wide">
                  How can I help?
                </label>
                <textarea
                  rows={3}
                  placeholder="Tell me about your situation, timeline, and goals..."
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#003087]/30 focus:border-[#003087] resize-none"
                />
              </div>
              <button
                type="button"
                className="w-full bg-[#C8960C] text-white font-bold py-4 rounded-xl hover:bg-[#a87a0a] transition-colors flex items-center justify-center gap-2 shadow-lg shadow-[#C8960C]/20"
              >
                Send to {firstName} <ArrowRight size={18} />
              </button>
              <p className="text-[11px] text-gray-400 text-center pt-2">
                Demo only — messages are not sent. By submitting, you consent to be contacted by{' '}
                {tl.full_name}, {formatNMLS(tl.nmls_number)}.
              </p>
            </form>
          </div>
        </div>
      </section>

      {/* NMLS / Equal Housing footer */}
      <footer className="bg-[#001a4d] text-blue-200">
        <div className="max-w-6xl mx-auto px-4 py-12">
          <div className="grid md:grid-cols-3 gap-10 mb-10">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-full bg-[#C8960C] text-white flex items-center justify-center font-bold text-sm">
                  {initials}
                </div>
                <div>
                  <p className="font-bold text-white">{tl.full_name}</p>
                  <p className="text-xs">{formatNMLS(tl.nmls_number)}</p>
                </div>
              </div>
              <p className="text-sm leading-relaxed">
                Senior Mortgage Advisor with Loan Factory. Serving {tl.service_areas[0]} and
                surrounding areas.
              </p>
            </div>

            <div>
              <p className="text-white font-semibold mb-3 text-sm uppercase tracking-wide">
                Contact
              </p>
              <ul className="space-y-2 text-sm">
                {tl.phone && (
                  <li>
                    <a href={`tel:${phoneDigits}`} className="hover:text-white flex items-center gap-2">
                      <Phone size={13} /> {tl.phone}
                    </a>
                  </li>
                )}
                <li>
                  <a href={`mailto:${tl.email}`} className="hover:text-white flex items-center gap-2">
                    <Mail size={13} /> {tl.email}
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <p className="text-white font-semibold mb-3 text-sm uppercase tracking-wide">
                Powered by
              </p>
              <p className="text-sm leading-relaxed">
                Loan Factory, Inc. <br />
                Company NMLS #320841 <br />
                Wholesale mortgage platform.
              </p>
            </div>
          </div>

          <div className="border-t border-blue-900 pt-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              {/* Equal Housing Lender logo (SVG) */}
              <svg
                viewBox="0 0 40 40"
                className="w-12 h-12 text-blue-200 shrink-0"
                aria-label="Equal Housing Lender"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.6"
              >
                <rect x="3" y="3" width="34" height="34" rx="2" />
                <path d="M20 9 L9 20 H13 V31 H27 V20 H31 Z" strokeLinejoin="round" />
                <line x1="13" y1="26" x2="27" y2="26" />
                <line x1="13" y1="22" x2="27" y2="22" />
              </svg>
              <div className="text-xs">
                <p className="text-white font-semibold uppercase tracking-widest">
                  Equal Housing Lender
                </p>
                <p>Licensed in FL · Loan Factory, Inc. NMLS #320841</p>
              </div>
            </div>
            <div className="text-[11px] text-blue-300 max-w-md leading-relaxed">
              This is not a commitment to lend. All loan applications are subject to credit and
              property approval. Rates, terms, and programs are subject to change without notice.
              Programs may vary by state.
            </div>
          </div>

          <div className="text-center text-[11px] text-blue-400 mt-8 pt-6 border-t border-blue-900">
            © {new Date().getFullYear()} {tl.full_name} · Site built with{' '}
            <Link href="/" className="text-white hover:underline">
              Loan Factory AI Advantage
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
