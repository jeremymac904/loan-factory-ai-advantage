import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { getTeamLeaderBySlug, getPublishedTeamLeaders } from '@/lib/mock-data';
import { generateTagline, formatNMLS } from '@/lib/utils';
import { Star, Home, Shield, DollarSign, Building2, Leaf, UserCheck, Award, ArrowRight, Phone, Mail, MapPin, Globe, ExternalLink } from 'lucide-react';

export async function generateStaticParams() {
  return getPublishedTeamLeaders().map((tl) => ({ slug: tl.slug }));
}

const specialtyIcons: Record<string, React.ReactNode> = {
  'VA': <Shield size={28} className="text-[#C8960C]" />,
  'FHA': <Home size={28} className="text-[#C8960C]" />,
  'Conventional': <Award size={28} className="text-[#C8960C]" />,
  'Jumbo': <DollarSign size={28} className="text-[#C8960C]" />,
  'DSCR': <Building2 size={28} className="text-[#C8960C]" />,
  'USDA': <Leaf size={28} className="text-[#C8960C]" />,
  'Fix & Flip': <Building2 size={28} className="text-[#C8960C]" />,
  'First-Time Buyer': <UserCheck size={28} className="text-[#C8960C]" />,
};

export default async function TeamLeaderSitePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const tl = getTeamLeaderBySlug(slug);
  if (!tl) notFound();
  const tagline = generateTagline(tl);
  const firstName = tl.full_name.split(' ')[0];

  return (
    <div className="bg-white">
      <header className="bg-[#003087] text-white py-3 px-6">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <span className="font-bold text-sm">Loan Factory — Team Leader Network</span>
          <Link href="/showcase" className="text-blue-200 text-xs hover:text-white">← All Team Leaders</Link>
        </div>
      </header>

      {/* Hero */}
      <section className="bg-gradient-to-br from-[#003087] to-[#001a4d] text-white py-20 px-4">
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center gap-10">
          <div className="shrink-0">
            <div className="w-44 h-44 rounded-full border-4 border-[#C8960C] overflow-hidden bg-gray-200 shadow-2xl">
              {tl.headshot_url ? (
                <Image src={tl.headshot_url} alt={tl.full_name} width={176} height={176} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-[#C8960C] text-white text-5xl font-black">
                  {tl.full_name[0]}
                </div>
              )}
            </div>
          </div>
          <div>
            <p className="text-[#C8960C] text-sm font-semibold uppercase tracking-widest mb-2">Loan Factory Team Leader</p>
            <h1 className="text-4xl md:text-5xl font-black mb-2">{tl.full_name}</h1>
            <p className="text-blue-200 text-lg mb-1">{formatNMLS(tl.nmls_number)}</p>
            <p className="text-xl text-blue-100 italic mb-6">{tagline}</p>
            <div className="flex flex-wrap gap-3">
              {tl.phone && (
                <a href={`tel:${tl.phone}`} className="inline-flex items-center gap-2 bg-[#C8960C] text-white font-bold px-6 py-3 rounded-xl hover:bg-[#a87a0a] transition-colors">
                  <Phone size={18} /> Call Now
                </a>
              )}
              <a href="#contact" className="inline-flex items-center gap-2 bg-white/10 text-white font-semibold px-6 py-3 rounded-xl hover:bg-white/20 transition-colors">
                <Mail size={18} /> Send a Message
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* About */}
      <section className="py-16 px-4">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-[#003087] mb-6">About {firstName}</h2>
          <p className="text-gray-600 text-lg leading-relaxed mb-8">{tl.bio}</p>
          <div className="grid sm:grid-cols-2 gap-4">
            <div className="bg-blue-50 rounded-xl p-5">
              <div className="flex items-center gap-2 mb-3">
                <MapPin size={18} className="text-[#C8960C]" />
                <span className="font-semibold text-[#003087]">Service Areas</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {tl.service_areas.map((area) => (
                  <span key={area} className="bg-white text-gray-700 text-sm px-3 py-1 rounded-full border border-blue-100">{area}</span>
                ))}
              </div>
            </div>
            <div className="bg-amber-50 rounded-xl p-5">
              <div className="flex items-center gap-2 mb-3">
                <Globe size={18} className="text-[#C8960C]" />
                <span className="font-semibold text-[#003087]">Languages Spoken</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {tl.languages.map((lang) => (
                  <span key={lang} className="bg-white text-gray-700 text-sm px-3 py-1 rounded-full border border-amber-100">{lang}</span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Specialties */}
      <section className="py-16 px-4 bg-gray-50">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-[#003087] mb-3">Loan Programs</h2>
          <p className="text-gray-500 mb-10">I specialize in the programs that get my clients the best results.</p>
          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4">
            {tl.specialties.map((spec) => (
              <div key={spec} className="bg-white rounded-xl p-6 border border-gray-100 shadow-sm text-center hover:shadow-md transition-shadow">
                <div className="flex justify-center mb-3">
                  {specialtyIcons[spec] ?? <Star size={28} className="text-[#C8960C]" />}
                </div>
                <h3 className="font-bold text-[#003087] text-lg">{spec}</h3>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Reviews */}
      {(tl.google_review_url || tl.zillow_review_url || tl.additional_review_url) && (
        <section className="py-16 px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl font-bold text-[#003087] mb-3">What Clients Say</h2>
            <p className="text-gray-500 mb-10">Read verified reviews from real clients on trusted platforms.</p>
            <div className="flex flex-wrap justify-center gap-4">
              {tl.google_review_url && (
                <a href={tl.google_review_url} target="_blank" rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 bg-white border-2 border-gray-200 hover:border-[#003087] text-gray-700 font-semibold px-6 py-3 rounded-xl transition-colors">
                  <Star size={18} className="text-yellow-500" /> Google Reviews <ExternalLink size={14} className="text-gray-400" />
                </a>
              )}
              {tl.zillow_review_url && (
                <a href={tl.zillow_review_url} target="_blank" rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 bg-white border-2 border-gray-200 hover:border-[#003087] text-gray-700 font-semibold px-6 py-3 rounded-xl transition-colors">
                  <Home size={18} className="text-blue-600" /> Zillow Reviews <ExternalLink size={14} className="text-gray-400" />
                </a>
              )}
            </div>
          </div>
        </section>
      )}

      {/* Contact */}
      <section id="contact" className="py-16 px-4 bg-[#003087]">
        <div className="max-w-2xl mx-auto">
          <h2 className="text-3xl font-bold text-white mb-3">Ready to Get Started?</h2>
          <p className="text-blue-200 mb-8">{firstName} will reach out within one business day.</p>
          <div className="bg-white rounded-2xl p-8 shadow-xl">
            <div className="grid sm:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">First Name</label>
                <input type="text" placeholder="John" className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#003087]" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Last Name</label>
                <input type="text" placeholder="Smith" className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#003087]" />
              </div>
            </div>
            <div className="grid sm:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Phone</label>
                <input type="tel" placeholder="(555) 000-0000" className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#003087]" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Email</label>
                <input type="email" placeholder="john@email.com" className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#003087]" />
              </div>
            </div>
            <div className="mb-6">
              <label className="block text-sm font-semibold text-gray-700 mb-1">How can I help you?</label>
              <textarea rows={3} placeholder="Tell me about your situation..." className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#003087] resize-none" />
            </div>
            <button className="w-full bg-[#C8960C] text-white font-bold py-3 rounded-xl hover:bg-[#a87a0a] transition-colors flex items-center justify-center gap-2">
              Send Message <ArrowRight size={18} />
            </button>
            <p className="text-xs text-gray-400 text-center mt-3">Demo only — messages are not sent.</p>
          </div>
        </div>
      </section>

      {/* Compliance Footer */}
      <section className="bg-[#001a4d] text-blue-200 py-10 px-4">
        <div className="max-w-4xl mx-auto text-center space-y-2">
          <p className="font-semibold text-white">{tl.full_name} | {formatNMLS(tl.nmls_number)}</p>
          <p className="text-sm">Loan Factory, Inc. | Company NMLS #320841</p>
          <p className="text-sm">Equal Housing Lender | Licensed in FL</p>
          <p className="text-xs mt-4 text-blue-300 max-w-2xl mx-auto">
            This is not a commitment to lend. All loan applications are subject to credit and property approval.
            Rates, terms, and programs are subject to change without notice.
          </p>
          <div className="pt-4">
            <Link href="/showcase" className="text-blue-400 text-xs hover:text-white">← Back to Team Leader Directory</Link>
          </div>
        </div>
      </section>
    </div>
  );
}
