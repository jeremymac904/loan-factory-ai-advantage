'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { MapPin, Globe, Filter, X } from 'lucide-react';
import { getPublishedTeamLeaders } from '@/lib/mock-data';
import { generateTagline, formatNMLS } from '@/lib/utils';

export default function ShowcasePage() {
  const leaders = useMemo(() => getPublishedTeamLeaders(), []);

  const allLanguages = useMemo(
    () => Array.from(new Set(leaders.flatMap((l) => l.languages))).sort(),
    [leaders],
  );
  const allSpecialties = useMemo(
    () => Array.from(new Set(leaders.flatMap((l) => l.specialties))).sort(),
    [leaders],
  );

  const [selectedLanguage, setSelectedLanguage] = useState<string | null>(null);
  const [selectedSpecialty, setSelectedSpecialty] = useState<string | null>(null);

  const filtered = useMemo(() => {
    return leaders.filter((tl) => {
      if (selectedLanguage && !tl.languages.includes(selectedLanguage)) return false;
      if (selectedSpecialty && !tl.specialties.includes(selectedSpecialty)) return false;
      return true;
    });
  }, [leaders, selectedLanguage, selectedSpecialty]);

  const hasFilters = selectedLanguage !== null || selectedSpecialty !== null;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <div className="text-center mb-12">
        <span className="inline-block bg-[#003087]/10 text-[#003087] text-xs font-bold uppercase tracking-widest px-4 py-1 rounded-full mb-4">
          Live Sites
        </span>
        <h1 className="text-4xl font-bold text-[#003087] mb-4">Team Leader Directory</h1>
        <p className="text-gray-500 max-w-xl mx-auto">
          Every site below was built with the Loan Factory AI Advantage platform.
          Click any card to see the full published website.
        </p>
      </div>

      {/* Filters */}
      <div className="bg-white border border-gray-100 rounded-2xl shadow-sm p-5 mb-10">
        <div className="flex items-center gap-2 mb-4">
          <Filter size={16} className="text-[#003087]" />
          <span className="text-sm font-semibold text-[#003087]">Filter by</span>
          {hasFilters && (
            <button
              type="button"
              onClick={() => {
                setSelectedLanguage(null);
                setSelectedSpecialty(null);
              }}
              className="ml-auto inline-flex items-center gap-1 text-xs font-medium text-gray-500 hover:text-red-600 transition-colors"
            >
              <X size={12} /> Clear filters
            </button>
          )}
        </div>

        <div className="space-y-4">
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-2">Language</p>
            <div className="flex flex-wrap gap-2">
              {allLanguages.map((lang) => {
                const active = selectedLanguage === lang;
                return (
                  <button
                    type="button"
                    key={lang}
                    onClick={() => setSelectedLanguage(active ? null : lang)}
                    className={`text-xs font-medium px-3 py-1.5 rounded-full border transition-colors ${
                      active
                        ? 'bg-[#003087] text-white border-[#003087]'
                        : 'bg-white text-gray-600 border-gray-200 hover:border-[#003087] hover:text-[#003087]'
                    }`}
                  >
                    {lang}
                  </button>
                );
              })}
            </div>
          </div>

          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-2">Specialty</p>
            <div className="flex flex-wrap gap-2">
              {allSpecialties.map((spec) => {
                const active = selectedSpecialty === spec;
                return (
                  <button
                    type="button"
                    key={spec}
                    onClick={() => setSelectedSpecialty(active ? null : spec)}
                    className={`text-xs font-medium px-3 py-1.5 rounded-full border transition-colors ${
                      active
                        ? 'bg-[#C8960C] text-white border-[#C8960C]'
                        : 'bg-white text-gray-600 border-gray-200 hover:border-[#C8960C] hover:text-[#a87a0a]'
                    }`}
                  >
                    {spec}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        <p className="text-xs text-gray-400 mt-4">
          Showing <span className="font-semibold text-[#003087]">{filtered.length}</span> of {leaders.length} Team Leaders
        </p>
      </div>

      {filtered.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-2xl border border-gray-100">
          <p className="text-gray-500 text-lg mb-2">No Team Leaders match these filters.</p>
          <button
            type="button"
            onClick={() => {
              setSelectedLanguage(null);
              setSelectedSpecialty(null);
            }}
            className="text-[#003087] font-semibold text-sm hover:underline"
          >
            Clear filters →
          </button>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filtered.map((tl) => (
            <div
              key={tl.id}
              className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all overflow-hidden group"
            >
              <div className="bg-[#003087] h-20 relative">
                <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2">
                  <div className="w-16 h-16 rounded-full border-4 border-white overflow-hidden bg-gray-200">
                    {tl.headshot_url ? (
                      <Image
                        src={tl.headshot_url}
                        alt={tl.full_name}
                        width={64}
                        height={64}
                        className="w-full h-full object-cover"
                      />
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
                    <span key={spec} className="bg-amber-50 text-amber-800 text-xs font-medium px-2 py-0.5 rounded-full">
                      {spec}
                    </span>
                  ))}
                </div>

                <Link
                  href={`/site/${tl.slug}`}
                  className="block bg-[#003087] text-white text-sm font-semibold py-2 rounded-lg hover:bg-[#002060] transition-colors"
                >
                  View Live Site
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="mt-20 text-center bg-[#003087] text-white rounded-3xl p-12">
        <h2 className="text-2xl font-bold mb-3">Don&apos;t see your site here?</h2>
        <p className="text-blue-200 mb-6">Build yours in 10 minutes. Marketing reviews it, TERA publishes it.</p>
        <Link
          href="/builder"
          className="inline-block bg-[#C8960C] text-white font-bold px-8 py-3 rounded-xl hover:bg-[#a87a0a] transition-colors"
        >
          Build My Website
        </Link>
      </div>
    </div>
  );
}
