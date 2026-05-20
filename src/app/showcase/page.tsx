import Link from 'next/link';
import Image from 'next/image';
import { getPublishedTeamLeaders } from '@/lib/mock-data';
import { generateTagline, formatNMLS } from '@/lib/utils';
import { MapPin, Globe } from 'lucide-react';

export const metadata = {
  title: 'Team Leader Showcase | Loan Factory AI Advantage',
};

export default function ShowcasePage() {
  const leaders = getPublishedTeamLeaders();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <div className="text-center mb-14">
        <span className="inline-block bg-[#003087]/10 text-[#003087] text-xs font-bold uppercase tracking-widest px-4 py-1 rounded-full mb-4">
          Live Sites
        </span>
        <h1 className="text-4xl font-bold text-[#003087] mb-4">Team Leader Directory</h1>
        <p className="text-gray-500 max-w-xl mx-auto">
          Every site below was built with the Loan Factory AI Advantage platform.
          Click any card to see the full published website.
        </p>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {leaders.map((tl) => (
          <div key={tl.id}
            className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all overflow-hidden group">
            <div className="bg-[#003087] h-20 relative">
              <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2">
                <div className="w-16 h-16 rounded-full border-4 border-white overflow-hidden bg-gray-200">
                  {tl.headshot_url ? (
                    <Image src={tl.headshot_url} alt={tl.full_name} width={64} height={64} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-[#C8960C] text-white font-bold text-xl">
                      {tl.full_name[0]}
                    </div>
                  )}
                </div>
              </div>
            </div>
            <div className="pt-10 px-5 pb-5 text-center">
              <h3 className="font-bold text-[#003087] text-lg">{tl.full_name}</h3>
              <p className="text-xs text-gray-400 mb-2">{formatNMLS(tl.nmls_number)}</p>
              <p className="text-xs text-gray-500 italic mb-4 leading-relaxed">{generateTagline(tl)}</p>

              <div className="flex items-center gap-1 justify-center text-xs text-gray-500 mb-2">
                <MapPin size={12} className="text-[#C8960C]" />
                <span>{tl.service_areas[0]}</span>
              </div>
              <div className="flex items-center gap-1 justify-center text-xs text-gray-500 mb-4">
                <Globe size={12} className="text-[#C8960C]" />
                <span>{tl.languages.join(', ')}</span>
              </div>

              <div className="flex flex-wrap gap-1 justify-center mb-5">
                {tl.specialties.slice(0, 3).map((spec) => (
                  <span key={spec} className="bg-amber-50 text-amber-800 text-xs font-medium px-2 py-0.5 rounded-full">{spec}</span>
                ))}
              </div>

              <Link href={`/site/${tl.slug}`}
                className="block bg-[#003087] text-white text-sm font-semibold py-2 rounded-lg hover:bg-[#002060] transition-colors">
                View Live Site
              </Link>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-20 text-center bg-[#003087] text-white rounded-3xl p-12">
        <h2 className="text-2xl font-bold mb-3">Don&apos;t see your site here?</h2>
        <p className="text-blue-200 mb-6">Build yours in 10 minutes. Marketing reviews it, TERA publishes it.</p>
        <Link href="/builder"
          className="inline-block bg-[#C8960C] text-white font-bold px-8 py-3 rounded-xl hover:bg-[#a87a0a] transition-colors">
          Build My Website
        </Link>
      </div>
    </div>
  );
}
