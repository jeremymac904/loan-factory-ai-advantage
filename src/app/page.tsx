import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, CheckCircle, Globe, Shield, Zap } from 'lucide-react';
import { getPublishedTeamLeaders } from '@/lib/mock-data';
import { generateTagline, formatNMLS } from '@/lib/utils';

export default function HomePage() {
  const featured = getPublishedTeamLeaders().slice(0, 3);

  return (
    <div>
      {/* Hero */}
      <section className="bg-gradient-to-br from-[#003087] to-[#001a4d] text-white py-24 px-4">
        <div className="max-w-5xl mx-auto text-center">
          <span className="inline-block bg-[#C8960C] text-white text-xs font-bold uppercase tracking-widest px-4 py-1 rounded-full mb-6">
            1+1+1=5 Program
          </span>
          <h1 className="text-4xl md:text-6xl font-bold leading-tight mb-6">
            Every Team Leader.<br />
            <span className="text-[#C8960C]">One Professional Website.</span><br />
            Zero Design Headaches.
          </h1>
          <p className="text-xl text-blue-200 max-w-2xl mx-auto mb-10">
            Loan Factory Team Leaders get a branded, compliant, beautiful website — built by you in minutes,
            reviewed by Marketing, published by TERA. Your clients deserve a professional first impression.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/builder"
              className="bg-[#C8960C] hover:bg-[#a87a0a] text-white font-bold px-8 py-4 rounded-xl text-lg flex items-center justify-center gap-2 transition-colors">
              Build My Website <ArrowRight size={20} />
            </Link>
            <Link href="/showcase"
              className="bg-white/10 hover:bg-white/20 text-white font-semibold px-8 py-4 rounded-xl text-lg transition-colors">
              See Live Examples
            </Link>
          </div>
        </div>
      </section>

      {/* 3-Step Process */}
      <section className="py-20 px-4 bg-gray-50">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-[#003087] mb-4">How It Works</h2>
          <p className="text-center text-gray-500 mb-14">Three steps from blank page to live site.</p>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { step: '01', icon: <Zap size={28} className="text-[#C8960C]" />, title: 'Fill In Your Info', desc: 'Enter your name, NMLS, bio, service areas, languages, and specialties. Takes about 10 minutes.' },
              { step: '02', icon: <Shield size={28} className="text-[#C8960C]" />, title: 'Marketing Reviews', desc: 'Our Marketing team reviews your site for brand consistency and compliance. Approval typically in 1–2 business days.' },
              { step: '03', icon: <Globe size={28} className="text-[#C8960C]" />, title: 'You Go Live', desc: 'TERA publishes your site to a professional URL. You get a link to share with clients, Realtors, and on social media.' },
            ].map((item) => (
              <div key={item.step} className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100 text-center">
                <div className="text-5xl font-black text-gray-100 mb-4">{item.step}</div>
                <div className="flex justify-center mb-4">{item.icon}</div>
                <h3 className="text-xl font-bold text-[#003087] mb-2">{item.title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* What You Get */}
      <section className="py-20 px-4">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-[#003087] mb-14">What&apos;s Included</h2>
          <div className="grid md:grid-cols-2 gap-4 max-w-3xl mx-auto">
            {[
              'Professional headshot hero section',
              'NMLS-compliant bio and credentials',
              'Service area and language badges',
              'Specialty icons (VA, FHA, DSCR, and more)',
              'Google and Zillow review links',
              'Contact form for leads',
              'Equal Housing Lender footer',
              'Mobile-responsive design',
              'Meta pixel installed before launch',
              'Loan Factory brand system — always on-brand',
            ].map((item) => (
              <div key={item} className="flex items-center gap-3 bg-blue-50 rounded-xl px-5 py-3">
                <CheckCircle size={18} className="text-[#003087] shrink-0" />
                <span className="text-gray-700 text-sm font-medium">{item}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Team Leaders */}
      <section className="py-20 px-4 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-[#003087] mb-4">Live Team Leader Sites</h2>
          <p className="text-center text-gray-500 mb-14">These are real, published sites built with the AI Advantage platform.</p>
          <div className="grid md:grid-cols-3 gap-6">
            {featured.map((tl) => (
              <div key={tl.id} className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                <div className="bg-[#003087] h-24 flex items-end px-6 pb-0">
                  <div className="w-20 h-20 rounded-full border-4 border-white overflow-hidden translate-y-10 bg-gray-200">
                    {tl.headshot_url && (
                      <Image src={tl.headshot_url} alt={tl.full_name} width={80} height={80} className="w-full h-full object-cover" />
                    )}
                  </div>
                </div>
                <div className="pt-12 px-6 pb-6">
                  <h3 className="text-xl font-bold text-[#003087]">{tl.full_name}</h3>
                  <p className="text-sm text-gray-500 mb-3">{formatNMLS(tl.nmls_number)}</p>
                  <p className="text-sm text-gray-600 italic mb-4">{generateTagline(tl)}</p>
                  <div className="flex flex-wrap gap-1 mb-4">
                    {tl.languages.map((lang) => (
                      <span key={lang} className="bg-blue-50 text-[#003087] text-xs font-medium px-2 py-1 rounded-full">{lang}</span>
                    ))}
                    {tl.specialties.slice(0, 2).map((spec) => (
                      <span key={spec} className="bg-amber-50 text-amber-800 text-xs font-medium px-2 py-1 rounded-full">{spec}</span>
                    ))}
                  </div>
                  <Link href={`/site/${tl.slug}`}
                    className="block text-center bg-[#003087] text-white text-sm font-semibold py-2 rounded-lg hover:bg-[#002060] transition-colors">
                    View Site
                  </Link>
                </div>
              </div>
            ))}
          </div>
          <div className="text-center mt-10">
            <Link href="/showcase" className="text-[#003087] font-semibold hover:underline">
              See all Team Leader sites →
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Banner */}
      <section className="bg-[#C8960C] py-16 px-4">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-white mb-4">Ready to build your site?</h2>
          <p className="text-white/80 mb-8 text-lg">Takes 10 minutes. Marketing handles the rest.</p>
          <Link href="/builder"
            className="inline-flex items-center gap-2 bg-white text-[#003087] font-bold px-8 py-4 rounded-xl text-lg hover:bg-gray-100 transition-colors">
            Start Building <ArrowRight size={20} />
          </Link>
        </div>
      </section>
    </div>
  );
}
