'use client';

import { useState } from 'react';
import { Save, Sparkles } from 'lucide-react';
import Topbar from '@/components/platform/Topbar';
import UploadCard from '@/components/platform/UploadCard';
import { currentUserProfile } from '@/lib/platform-mock-data';
import type { LoState } from '@/lib/platform-types';

const ALL_STATES: LoState[] = [
  'AZ',
  'CA',
  'FL',
  'GA',
  'MA',
  'NJ',
  'NY',
  'RI',
  'TX',
  'WA',
  'OR',
  'CO',
  'NV',
  'NC',
  'SC',
  'OH',
];

const SPECIALTIES = [
  'VA',
  'FHA',
  'Conventional',
  'Jumbo',
  'USDA',
  'DSCR',
  'Non-QM',
  'Bank Statement',
  'Construction',
  'First-Time Buyer',
  'Investor',
];

const LANGUAGES = [
  'English',
  'Spanish',
  'Mandarin',
  'Cantonese',
  'Vietnamese',
  'Korean',
  'Tagalog',
  'Portuguese',
  'Russian',
  'Arabic',
];

function FieldLabel({ children, hint }: { children: React.ReactNode; hint?: string }) {
  return (
    <div className="mb-1.5">
      <span className="text-xs font-semibold uppercase tracking-widest text-gray-500">
        {children}
      </span>
      {hint && <p className="text-[11px] text-gray-400 mt-0.5">{hint}</p>}
    </div>
  );
}

const inputClass =
  'w-full bg-white border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-lf-orange)]/30 focus:border-[var(--color-lf-orange)]';

function ChipMulti({
  options,
  selected,
  onChange,
}: {
  options: string[];
  selected: string[];
  onChange: (next: string[]) => void;
}) {
  return (
    <div className="flex flex-wrap gap-1.5">
      {options.map((opt) => {
        const on = selected.includes(opt);
        return (
          <button
            type="button"
            key={opt}
            onClick={() =>
              onChange(on ? selected.filter((s) => s !== opt) : [...selected, opt])
            }
            className={`text-xs font-semibold px-2.5 py-1 rounded-full border transition-colors ${
              on
                ? 'bg-[#003087] border-[#003087] text-white'
                : 'bg-white border-gray-200 text-gray-600 hover:border-[#003087] hover:text-[#003087]'
            }`}
          >
            {opt}
          </button>
        );
      })}
    </div>
  );
}

export default function ProfilePage() {
  const initial = currentUserProfile;
  const [fullName, setFullName] = useState(initial.full_name);
  const [displayName, setDisplayName] = useState(initial.preferred_display_name);
  const [nmls, setNmls] = useState(initial.nmls_number);
  const [email, setEmail] = useState(initial.loan_factory_email);
  const [phone, setPhone] = useState(initial.phone);
  const [website, setWebsite] = useState(initial.personal_website ?? '');
  const [states, setStates] = useState<LoState[]>(initial.licensed_states);
  const [serviceAreas, setServiceAreas] = useState(initial.service_areas.join(', '));
  const [languages, setLanguages] = useState<string[]>(initial.languages);
  const [specialties, setSpecialties] = useState<string[]>(initial.specialties);
  const [shortBio, setShortBio] = useState(initial.short_bio);
  const [longBio, setLongBio] = useState(initial.long_bio);
  const [teamName, setTeamName] = useState(initial.team_name ?? '');
  const [personaSummary, setPersonaSummary] = useState(initial.persona_summary ?? '');
  const [complianceNotes, setComplianceNotes] = useState(initial.compliance_notes ?? '');
  const [saved, setSaved] = useState<'idle' | 'saved'>('idle');

  function handleSave() {
    // TODO(supabase): persist updates via server action.
    console.info('[demo] save profile', {
      fullName,
      displayName,
      nmls,
      email,
      phone,
      website,
      states,
      serviceAreas,
      languages,
      specialties,
      shortBio,
      longBio,
      teamName,
      personaSummary,
      complianceNotes,
    });
    setSaved('saved');
    setTimeout(() => setSaved('idle'), 2400);
  }

  return (
    <>
      <Topbar
        title="Profile"
        subtitle="Your identity, licensure, brand voice, and the assets that power AI-generated marketing."
        rightSlot={
          <button
            type="button"
            onClick={handleSave}
            className="inline-flex items-center gap-1.5 bg-[var(--color-lf-orange)] hover:bg-[var(--color-lf-orange-dark)] text-white text-sm font-bold px-4 py-2 rounded-xl transition-colors"
          >
            <Save size={14} /> {saved === 'saved' ? 'Saved' : 'Save Profile'}
          </button>
        }
      />

      <div className="px-5 sm:px-8 py-8 space-y-6">
        {/* Identity */}
        <section className="bg-white border border-[var(--color-lf-border)] rounded-2xl p-6">
          <h2 className="text-sm font-bold uppercase tracking-widest text-gray-500 mb-5">
            Identity
          </h2>
          <div className="grid md:grid-cols-2 gap-5">
            <div>
              <FieldLabel>Full name</FieldLabel>
              <input className={inputClass} value={fullName} onChange={(e) => setFullName(e.target.value)} />
            </div>
            <div>
              <FieldLabel hint="Shown publicly on your site and posts.">Preferred display name</FieldLabel>
              <input
                className={inputClass}
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
              />
            </div>
            <div>
              <FieldLabel hint="Numbers only. Auto-attached to every post.">NMLS number</FieldLabel>
              <input className={inputClass} value={nmls} onChange={(e) => setNmls(e.target.value)} />
            </div>
            <div>
              <FieldLabel hint="Must be your Loan Factory company email for mortgage communications.">
                Loan Factory email
              </FieldLabel>
              <input
                type="email"
                className={inputClass}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div>
              <FieldLabel>Phone</FieldLabel>
              <input className={inputClass} value={phone} onChange={(e) => setPhone(e.target.value)} />
            </div>
            <div>
              <FieldLabel hint="Your published Team Leader site URL.">Website</FieldLabel>
              <input
                className={inputClass}
                value={website}
                onChange={(e) => setWebsite(e.target.value)}
              />
            </div>
            <div className="md:col-span-2">
              <FieldLabel>Team name</FieldLabel>
              <input
                className={inputClass}
                value={teamName}
                onChange={(e) => setTeamName(e.target.value)}
                placeholder="Leave blank if you do not use one."
              />
              <p className="text-[11px] text-amber-700 bg-amber-50 border border-amber-100 rounded-md px-2 py-1 mt-2">
                Team names are <span className="font-bold">not allowed</span> on marketing materials
                for LOs licensed in NJ or RI. Use your individual licensed name or DBA in those states.
              </p>
            </div>
          </div>
        </section>

        {/* Licensure & geography */}
        <section className="bg-white border border-[var(--color-lf-border)] rounded-2xl p-6">
          <h2 className="text-sm font-bold uppercase tracking-widest text-gray-500 mb-5">
            Licensure & geography
          </h2>
          <div className="space-y-5">
            <div>
              <FieldLabel hint="State-specific compliance rules activate automatically based on this list.">
                Licensed states
              </FieldLabel>
              <ChipMulti
                options={ALL_STATES}
                selected={states}
                onChange={(next) => setStates(next as LoState[])}
              />
            </div>
            <div>
              <FieldLabel hint="Comma-separated cities you serve.">Service areas</FieldLabel>
              <input
                className={inputClass}
                value={serviceAreas}
                onChange={(e) => setServiceAreas(e.target.value)}
                placeholder="Jacksonville FL, Orange Park FL, ..."
              />
            </div>
            <div className="grid md:grid-cols-2 gap-5">
              <div>
                <FieldLabel>Languages</FieldLabel>
                <ChipMulti options={LANGUAGES} selected={languages} onChange={setLanguages} />
              </div>
              <div>
                <FieldLabel>Specialties</FieldLabel>
                <ChipMulti options={SPECIALTIES} selected={specialties} onChange={setSpecialties} />
              </div>
            </div>
          </div>
        </section>

        {/* Bio */}
        <section className="bg-white border border-[var(--color-lf-border)] rounded-2xl p-6">
          <h2 className="text-sm font-bold uppercase tracking-widest text-gray-500 mb-5">Bio</h2>
          <div className="space-y-5">
            <div>
              <FieldLabel hint="One line under your name on most assets.">Short bio</FieldLabel>
              <textarea
                rows={2}
                className={`${inputClass} resize-y`}
                value={shortBio}
                onChange={(e) => setShortBio(e.target.value)}
              />
            </div>
            <div>
              <FieldLabel hint="The full bio shown on your published Team Leader site.">
                Long bio
              </FieldLabel>
              <textarea
                rows={5}
                className={`${inputClass} resize-y leading-relaxed`}
                value={longBio}
                onChange={(e) => setLongBio(e.target.value)}
              />
            </div>
          </div>
        </section>

        {/* Persona / brand voice */}
        <section id="persona" className="bg-white border border-[var(--color-lf-border)] rounded-2xl p-6">
          <div className="flex items-start justify-between mb-5 flex-wrap gap-2">
            <div>
              <h2 className="text-sm font-bold uppercase tracking-widest text-gray-500">
                Persona & brand voice
              </h2>
              <p className="text-xs text-gray-500 mt-1">
                These shape every AI-generated draft from Content Studio. Be specific, not generic.
              </p>
            </div>
            <span className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-widest text-[var(--color-lf-orange-dark)] bg-[var(--color-lf-orange-soft)] px-2 py-0.5 rounded-full">
              <Sparkles size={11} /> Drives AI output
            </span>
          </div>
          <div className="space-y-5">
            <div>
              <FieldLabel hint="Tone, audience, do/don't list. 2–4 sentences.">
                Persona summary
              </FieldLabel>
              <textarea
                rows={4}
                className={`${inputClass} resize-y`}
                value={personaSummary}
                onChange={(e) => setPersonaSummary(e.target.value)}
              />
            </div>
            <div>
              <FieldLabel hint="Anything Marketing needs to know about your states / specialties / approvals.">
                Compliance notes
              </FieldLabel>
              <textarea
                rows={3}
                className={`${inputClass} resize-y`}
                value={complianceNotes}
                onChange={(e) => setComplianceNotes(e.target.value)}
              />
            </div>
          </div>
        </section>

        {/* Uploads */}
        <section id="reference" className="space-y-5">
          <div>
            <h2 className="text-sm font-bold uppercase tracking-widest text-gray-500 mb-1">
              Assets & uploads
            </h2>
            <p className="text-xs text-gray-500">
              Files are stored locally in demo mode. Once Supabase Storage is wired, they will sync to
              the named buckets shown on each card.
            </p>
          </div>
          <div className="grid sm:grid-cols-2 gap-4">
            <UploadCard
              title="Profile picture"
              bucket="profile-images"
              accept="image/*"
              description="Your headshot — used across your site and in your dashboard."
              existingFileName="jeremy-headshot-2026.jpg"
            />
            <UploadCard
              title="AI reference image"
              bucket="reference-images"
              accept="image/*"
              description="A high-quality reference photo for AI-generated marketing visuals."
              helperText="Reference images are for generating consistent marketing visuals. Do not upload borrower data or private loan information."
            />
            <UploadCard
              title="Persona document"
              bucket="persona-documents"
              accept=".pdf,.docx,.txt,.md"
              description="A short doc describing tone, audience, brand voice, specialties, and compliance preferences."
              helperText="Persona documents should describe tone, audience, brand voice, specialties, and compliance preferences."
            />
            <UploadCard
              title="Brand voice document"
              bucket="brand-assets"
              accept=".pdf,.docx,.txt,.md"
              description="Optional second doc — sample posts, taglines, off-limits phrases."
            />
            <UploadCard
              title="Logo / team logo"
              bucket="brand-assets"
              accept="image/svg+xml,image/png"
              description="Your team or DBA logo. Must comply with the Loan-Factory-equal-or-larger rule on every public asset."
            />
            <UploadCard
              title="Compliance approval document"
              bucket="compliance-documents"
              accept=".pdf"
              description="Any Marketing-issued approval letters for your brand assets."
              helperText="Treat as internal — never includes borrower or loan-specific data."
            />
          </div>
        </section>
      </div>
    </>
  );
}
