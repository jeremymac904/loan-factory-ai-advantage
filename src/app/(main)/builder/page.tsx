'use client';
import { useState } from 'react';
import Image from 'next/image';
import { CheckCircle, ArrowRight, ArrowLeft, User, FileText, Star, Eye } from 'lucide-react';
import { BuilderFormData } from '@/lib/types';
import { generateTagline, formatNMLS, countWords } from '@/lib/utils';

const LANGUAGE_OPTIONS = ['English', 'Spanish', 'Vietnamese', 'Mandarin', 'Cantonese', 'Korean', 'Russian', 'Hindi', 'Punjabi', 'Other'];
const SPECIALTY_OPTIONS = ['VA', 'FHA', 'USDA', 'Conventional', 'Jumbo', 'DSCR', 'Fix & Flip', 'First-Time Buyer'];

const EMPTY_FORM: BuilderFormData = {
  full_name: '', nmls_number: '', email: '', phone: '', headshot_url: '',
  bio: '', service_areas: [], languages: [], specialties: [],
  google_review_url: '', zillow_review_url: '', additional_review_url: '',
};

const steps = [
  { id: 1, label: 'Your Info', icon: <User size={16} /> },
  { id: 2, label: 'Your Story', icon: <FileText size={16} /> },
  { id: 3, label: 'Reviews', icon: <Star size={16} /> },
  { id: 4, label: 'Preview', icon: <Eye size={16} /> },
];

export default function BuilderPage() {
  const [step, setStep] = useState(1);
  const [form, setForm] = useState<BuilderFormData>(EMPTY_FORM);
  const [areaInput, setAreaInput] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const set = (key: keyof BuilderFormData, value: string | string[]) =>
    setForm((f) => ({ ...f, [key]: value }));

  const toggleArr = (key: keyof BuilderFormData, value: string) => {
    const arr = form[key] as string[];
    set(key, arr.includes(value) ? arr.filter((v) => v !== value) : [...arr, value]);
  };

  const addArea = () => {
    if (areaInput.trim() && !form.service_areas.includes(areaInput.trim())) {
      set('service_areas', [...form.service_areas, areaInput.trim()]);
    }
    setAreaInput('');
  };

  const wordCount = countWords(form.bio);
  const progress = ((step - 1) / (steps.length - 1)) * 100;

  if (submitted) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center px-4">
        <div className="max-w-lg text-center">
          <CheckCircle size={64} className="text-green-500 mx-auto mb-6" />
          <h1 className="text-3xl font-bold text-[#003087] mb-4">Site Submitted for Review!</h1>
          <p className="text-gray-600 mb-6">
            Marketing will review your site within 1–2 business days.
            You&apos;ll receive an email when it&apos;s approved and ready to publish.
          </p>
          <div className="bg-blue-50 rounded-xl p-6 text-left space-y-3 mb-8">
            <h3 className="font-bold text-[#003087]">What happens next:</h3>
            <div className="flex gap-3 text-sm text-gray-700"><CheckCircle size={16} className="text-green-500 shrink-0 mt-0.5" /><span>Marketing reviews your site for brand and compliance</span></div>
            <div className="flex gap-3 text-sm text-gray-700"><CheckCircle size={16} className="text-green-500 shrink-0 mt-0.5" /><span>TERA installs your Meta pixel and assigns your URL</span></div>
            <div className="flex gap-3 text-sm text-gray-700"><CheckCircle size={16} className="text-green-500 shrink-0 mt-0.5" /><span>You get an email with your live site link</span></div>
          </div>
          <button onClick={() => { setSubmitted(false); setStep(1); setForm(EMPTY_FORM); }}
            className="text-[#003087] font-semibold hover:underline text-sm">
            ← Start a new submission
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center mb-10">
        <h1 className="text-3xl font-bold text-[#003087] mb-2">Build Your Team Leader Website</h1>
        <p className="text-gray-500">Fill in 4 quick steps. Marketing handles the rest.</p>
      </div>

      {/* Progress Bar */}
      <div className="mb-10">
        <div className="flex justify-between mb-2">
          {steps.map((s) => (
            <div key={s.id} className={`flex items-center gap-1.5 text-sm font-medium transition-colors ${step >= s.id ? 'text-[#003087]' : 'text-gray-400'}`}>
              <span className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-colors ${step > s.id ? 'bg-green-500 text-white' : step === s.id ? 'bg-[#003087] text-white' : 'bg-gray-200 text-gray-500'}`}>
                {step > s.id ? '✓' : s.id}
              </span>
              <span className="hidden sm:block">{s.label}</span>
            </div>
          ))}
        </div>
        <div className="h-2 bg-gray-200 rounded-full">
          <div className="h-2 bg-[#003087] rounded-full transition-all duration-500" style={{ width: `${progress}%` }} />
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Form Panel */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-gray-100 shadow-sm p-8">

          {step === 1 && (
            <div className="space-y-5">
              <h2 className="text-xl font-bold text-[#003087] mb-6">Step 1 — Your Info</h2>
              {[
                { label: 'Full Name *', key: 'full_name', type: 'text', placeholder: 'Jeremy McDonald' },
                { label: 'NMLS Number *', key: 'nmls_number', type: 'text', placeholder: '1195266' },
                { label: 'Email Address *', key: 'email', type: 'email', placeholder: 'you@loanfactory.com' },
                { label: 'Phone Number', key: 'phone', type: 'tel', placeholder: '(904) 555-0100' },
                { label: 'Headshot URL', key: 'headshot_url', type: 'url', placeholder: 'https://your-photo-url.com/headshot.jpg' },
              ].map((field) => (
                <div key={field.key}>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">{field.label}</label>
                  <input type={field.type} placeholder={field.placeholder}
                    value={form[field.key as keyof BuilderFormData] as string}
                    onChange={(e) => set(field.key as keyof BuilderFormData, e.target.value)}
                    className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#003087]" />
                </div>
              ))}
            </div>
          )}

          {step === 2 && (
            <div className="space-y-6">
              <h2 className="text-xl font-bold text-[#003087] mb-6">Step 2 — Your Story</h2>
              <div>
                <div className="flex justify-between mb-1">
                  <label className="text-sm font-semibold text-gray-700">Bio *</label>
                  <span className={`text-xs font-medium ${wordCount > 250 ? 'text-red-500' : 'text-gray-400'}`}>{wordCount}/250 words</span>
                </div>
                <textarea rows={6} placeholder="Tell clients who you are, what you specialize in, and why they should work with you..."
                  value={form.bio} onChange={(e) => set('bio', e.target.value)}
                  className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#003087] resize-none" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Service Areas</label>
                <div className="flex gap-2 mb-2">
                  <input type="text" placeholder="Jacksonville FL" value={areaInput}
                    onChange={(e) => setAreaInput(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addArea())}
                    className="flex-1 border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#003087]" />
                  <button onClick={addArea} className="bg-[#003087] text-white px-4 py-2.5 rounded-lg text-sm font-semibold hover:bg-[#002060]">Add</button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {form.service_areas.map((area) => (
                    <span key={area} className="bg-blue-50 text-[#003087] text-xs font-medium px-3 py-1 rounded-full flex items-center gap-1">
                      {area}
                      <button onClick={() => set('service_areas', form.service_areas.filter((a) => a !== area))} className="ml-1 text-blue-400 hover:text-red-500">×</button>
                    </span>
                  ))}
                </div>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Languages Spoken</label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {LANGUAGE_OPTIONS.map((lang) => (
                    <label key={lang} className={`flex items-center gap-2 px-3 py-2 rounded-lg border cursor-pointer text-sm transition-colors ${form.languages.includes(lang) ? 'border-[#003087] bg-blue-50 text-[#003087] font-semibold' : 'border-gray-200 text-gray-600'}`}>
                      <input type="checkbox" className="hidden" checked={form.languages.includes(lang)} onChange={() => toggleArr('languages', lang)} />
                      {form.languages.includes(lang) ? '✓' : '○'} {lang}
                    </label>
                  ))}
                </div>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Loan Specialties</label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {SPECIALTY_OPTIONS.map((spec) => (
                    <label key={spec} className={`flex items-center gap-2 px-3 py-2 rounded-lg border cursor-pointer text-sm transition-colors ${form.specialties.includes(spec) ? 'border-[#C8960C] bg-amber-50 text-amber-800 font-semibold' : 'border-gray-200 text-gray-600'}`}>
                      <input type="checkbox" className="hidden" checked={form.specialties.includes(spec)} onChange={() => toggleArr('specialties', spec)} />
                      {form.specialties.includes(spec) ? '✓' : '○'} {spec}
                    </label>
                  ))}
                </div>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-5">
              <h2 className="text-xl font-bold text-[#003087] mb-6">Step 3 — Your Reviews</h2>
              <p className="text-sm text-gray-500">Add links to your review profiles. These will appear as buttons on your site.</p>
              {[
                { label: 'Google Review Link', key: 'google_review_url', placeholder: 'https://g.page/r/your-profile' },
                { label: 'Zillow Review Link', key: 'zillow_review_url', placeholder: 'https://www.zillow.com/profile/yourname' },
                { label: 'Additional Review Link', key: 'additional_review_url', placeholder: 'https://...' },
              ].map((field) => (
                <div key={field.key}>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">{field.label}</label>
                  <input type="url" placeholder={field.placeholder}
                    value={form[field.key as keyof BuilderFormData] as string}
                    onChange={(e) => set(field.key as keyof BuilderFormData, e.target.value)}
                    className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#003087]" />
                </div>
              ))}
            </div>
          )}

          {step === 4 && (
            <div>
              <h2 className="text-xl font-bold text-[#003087] mb-2">Step 4 — Review & Submit</h2>
              <p className="text-sm text-gray-500 mb-6">This is your site summary. Once submitted, Marketing will review it within 1–2 business days.</p>
              <div className="bg-gray-50 rounded-xl p-5 space-y-3 text-sm mb-6">
                <div className="flex justify-between"><span className="text-gray-500">Name</span><span className="font-semibold">{form.full_name || '—'}</span></div>
                <div className="flex justify-between"><span className="text-gray-500">NMLS</span><span className="font-semibold">{form.nmls_number ? formatNMLS(form.nmls_number) : '—'}</span></div>
                <div className="flex justify-between"><span className="text-gray-500">Service Areas</span><span className="font-semibold">{form.service_areas.join(', ') || '—'}</span></div>
                <div className="flex justify-between"><span className="text-gray-500">Languages</span><span className="font-semibold">{form.languages.join(', ') || '—'}</span></div>
                <div className="flex justify-between"><span className="text-gray-500">Specialties</span><span className="font-semibold">{form.specialties.join(', ') || '—'}</span></div>
                <div className="flex justify-between"><span className="text-gray-500">Bio Words</span><span className={`font-semibold ${wordCount > 250 ? 'text-red-500' : 'text-green-600'}`}>{wordCount}/250</span></div>
              </div>
              <button onClick={() => setSubmitted(true)}
                disabled={!form.full_name || !form.nmls_number || !form.email}
                className="w-full bg-[#C8960C] disabled:bg-gray-300 text-white font-bold py-4 rounded-xl hover:bg-[#a87a0a] transition-colors flex items-center justify-center gap-2">
                Submit for Marketing Review <ArrowRight size={18} />
              </button>
              {(!form.full_name || !form.nmls_number || !form.email) && (
                <p className="text-xs text-red-500 text-center mt-2">Name, NMLS number, and email are required.</p>
              )}
            </div>
          )}

          {/* Nav Buttons */}
          <div className="flex justify-between mt-8 pt-6 border-t border-gray-100">
            <button onClick={() => setStep(Math.max(1, step - 1))} disabled={step === 1}
              className="inline-flex items-center gap-2 text-sm font-semibold text-gray-600 hover:text-[#003087] disabled:opacity-30 transition-colors">
              <ArrowLeft size={16} /> Back
            </button>
            {step < 4 && (
              <button onClick={() => setStep(step + 1)}
                className="inline-flex items-center gap-2 bg-[#003087] text-white text-sm font-bold px-6 py-2.5 rounded-lg hover:bg-[#002060] transition-colors">
                Next <ArrowRight size={16} />
              </button>
            )}
          </div>
        </div>

        {/* Live Preview Panel */}
        <div className="lg:col-span-1">
          <div className="bg-[#003087] text-white rounded-2xl overflow-hidden shadow-lg sticky top-20">
            <div className="px-5 py-4 border-b border-blue-800 text-xs font-bold uppercase tracking-widest text-blue-300">Live Preview</div>
            <div className="bg-[#001a4d] p-5">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-14 h-14 rounded-full overflow-hidden bg-[#C8960C] border-2 border-[#C8960C] shrink-0 flex items-center justify-center">
                  {form.headshot_url ? (
                    <Image src={form.headshot_url} alt="Preview" width={56} height={56} className="w-full h-full object-cover" />
                  ) : (
                    <span className="text-white font-black text-xl">{form.full_name?.[0] || '?'}</span>
                  )}
                </div>
                <div>
                  <p className="font-bold text-white text-sm">{form.full_name || 'Your Name'}</p>
                  <p className="text-blue-300 text-xs">{form.nmls_number ? formatNMLS(form.nmls_number) : 'NMLS #'}</p>
                </div>
              </div>
              <p className="text-blue-200 text-xs italic mb-4">
                {form.languages.length && form.specialties.length && form.service_areas.length
                  ? generateTagline({ languages: form.languages, specialties: form.specialties, service_areas: form.service_areas })
                  : 'Your tagline will appear here based on your languages and specialties'}
              </p>
              {form.service_areas.length > 0 && (
                <div className="flex flex-wrap gap-1 mb-3">
                  {form.service_areas.slice(0, 2).map((a) => (
                    <span key={a} className="bg-white/10 text-blue-200 text-xs px-2 py-0.5 rounded-full">{a}</span>
                  ))}
                </div>
              )}
              {form.specialties.length > 0 && (
                <div className="flex flex-wrap gap-1">
                  {form.specialties.slice(0, 3).map((s) => (
                    <span key={s} className="bg-[#C8960C]/20 text-amber-300 text-xs px-2 py-0.5 rounded-full">{s}</span>
                  ))}
                </div>
              )}
            </div>
            <div className="px-5 py-4 text-xs text-blue-300 text-center">
              Your published site will look like the Team Leader sites in the <span className="text-white">Showcase</span>.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
