'use client';

import { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  ArrowLeft,
  ArrowRight,
  Check,
  CheckCircle2,
  FileText,
  LayoutTemplate,
  Star,
  Upload,
  User,
  Eye,
  Sparkles,
  X,
} from 'lucide-react';
import UploadCard from '@/components/platform/UploadCard';
import { builderTemplates } from '@/lib/platform-mock-data';
import type { BuilderTemplate } from '@/lib/platform-types';
import { generateTagline, formatNMLS, countWords } from '@/lib/utils';

const LANGUAGE_OPTIONS = [
  'English',
  'Spanish',
  'Vietnamese',
  'Mandarin',
  'Cantonese',
  'Korean',
  'Russian',
  'Hindi',
  'Punjabi',
  'Other',
];

const SPECIALTY_OPTIONS = [
  'VA',
  'FHA',
  'USDA',
  'Conventional',
  'Jumbo',
  'DSCR',
  'Fix & Flip',
  'First-Time Buyer',
];

const STATE_OPTIONS = [
  'AZ', 'CA', 'FL', 'GA', 'MA', 'NJ', 'NY', 'RI', 'TX', 'WA', 'OR', 'CO', 'NV', 'NC', 'SC', 'OH',
];

const REVIEW_PROVIDERS = [
  { key: 'google_review_url', label: 'Google' },
  { key: 'zillow_review_url', label: 'Zillow' },
  { key: 'facebook_review_url', label: 'Facebook' },
  { key: 'yelp_review_url', label: 'Yelp' },
  { key: 'linkedin_review_url', label: 'LinkedIn' },
  { key: 'additional_review_url', label: 'Custom' },
] as const;

type ReviewKey = (typeof REVIEW_PROVIDERS)[number]['key'];

interface BuilderState {
  template_id: string | null;
  full_name: string;
  preferred_display_name: string;
  nmls_number: string;
  email: string;
  phone: string;
  website: string;
  // Uploads (demo-mode: filenames only)
  profile_photo_filename: string | null;
  /** Browser object URL for the uploaded headshot — lives only in this tab. */
  profile_photo_preview_url: string | null;
  ai_reference_image_filename: string | null;
  ai_reference_image_preview_url: string | null;
  /** Optional fallback URL when no upload is available. */
  headshot_url_fallback: string;
  persona_document_filename: string | null;
  brand_voice_document_filename: string | null;
  team_logo_filename: string | null;
  compliance_doc_filename: string | null;
  // Profile
  licensed_states: string[];
  service_areas: string[];
  languages: string[];
  specialties: string[];
  short_bio: string;
  long_bio: string;
  team_name: string;
  persona_summary: string;
  compliance_notes: string;
  // Social proof
  reviews: Record<ReviewKey, string>;
  testimonial: string;
}

const EMPTY: BuilderState = {
  template_id: null,
  full_name: '',
  preferred_display_name: '',
  nmls_number: '',
  email: '',
  phone: '',
  website: '',
  profile_photo_filename: null,
  profile_photo_preview_url: null,
  ai_reference_image_filename: null,
  ai_reference_image_preview_url: null,
  headshot_url_fallback: '',
  persona_document_filename: null,
  brand_voice_document_filename: null,
  team_logo_filename: null,
  compliance_doc_filename: null,
  licensed_states: [],
  service_areas: [],
  languages: [],
  specialties: [],
  short_bio: '',
  long_bio: '',
  team_name: '',
  persona_summary: '',
  compliance_notes: '',
  reviews: {
    google_review_url: '',
    zillow_review_url: '',
    facebook_review_url: '',
    yelp_review_url: '',
    linkedin_review_url: '',
    additional_review_url: '',
  },
  testimonial: '',
};

const STEPS = [
  { id: 1, label: 'Template', icon: LayoutTemplate },
  { id: 2, label: 'Your Info', icon: User },
  { id: 3, label: 'Your Story', icon: FileText },
  { id: 4, label: 'Social Proof', icon: Star },
  { id: 5, label: 'Review & Submit', icon: Eye },
];

function isValidUrl(s: string): boolean {
  if (!s) return true;
  try {
    new URL(s);
    return true;
  } catch {
    return false;
  }
}

export default function BuilderPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [form, setForm] = useState<BuilderState>(EMPTY);
  const [areaInput, setAreaInput] = useState('');
  const [submitting, setSubmitting] = useState(false);

  function setField<K extends keyof BuilderState>(key: K, value: BuilderState[K]) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  /**
   * Drop a fresh object URL onto a preview slot, revoking any previous URL
   * so we don't leak. Browser object URLs live only for this tab — they are
   * never persisted and never sent to a server.
   */
  function setPreviewUrl(
    key: 'profile_photo_preview_url' | 'ai_reference_image_preview_url',
    file: File | null,
  ) {
    setForm((f) => {
      const prev = f[key];
      if (prev) {
        try {
          URL.revokeObjectURL(prev);
        } catch {
          /* ignore */
        }
      }
      const next = file ? URL.createObjectURL(file) : null;
      return { ...f, [key]: next };
    });
  }

  // Revoke any in-flight object URLs when the builder unmounts.
  useEffect(() => {
    return () => {
      [form.profile_photo_preview_url, form.ai_reference_image_preview_url].forEach((u) => {
        if (u) {
          try {
            URL.revokeObjectURL(u);
          } catch {
            /* ignore */
          }
        }
      });
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function toggleArr(key: 'languages' | 'specialties' | 'licensed_states', value: string) {
    setForm((f) => {
      const arr = f[key];
      const next = arr.includes(value) ? arr.filter((v) => v !== value) : [...arr, value];
      return { ...f, [key]: next };
    });
  }

  function addArea() {
    const v = areaInput.trim();
    if (!v) return;
    if (!form.service_areas.includes(v)) {
      setForm((f) => ({ ...f, service_areas: [...f.service_areas, v] }));
    }
    setAreaInput('');
  }

  function setReview(key: ReviewKey, value: string) {
    setForm((f) => ({ ...f, reviews: { ...f.reviews, [key]: value } }));
  }

  const chosenTemplate: BuilderTemplate | undefined = useMemo(
    () => builderTemplates.find((t) => t.id === form.template_id),
    [form.template_id],
  );

  const wordCount = countWords(form.long_bio);
  const progress = ((step - 1) / (STEPS.length - 1)) * 100;

  const invalidReviewKeys = (Object.entries(form.reviews) as [ReviewKey, string][]).filter(
    ([, v]) => v && !isValidUrl(v),
  );

  const requiredOk =
    !!form.template_id &&
    !!form.full_name.trim() &&
    !!form.nmls_number.trim() &&
    !!form.email.trim() &&
    invalidReviewKeys.length === 0;

  function next() {
    setStep((s) => Math.min(s + 1, STEPS.length));
  }
  function back() {
    setStep((s) => Math.max(s - 1, 1));
  }

  function submitToReview() {
    if (!requiredOk) return;
    setSubmitting(true);
    // TODO(supabase): insert into team_leader_profiles with status='pending_review'
    // plus insert an AuditEvent (action='Submitted'). For now, persist to
    // sessionStorage so /builder/submitted can read a summary.
    try {
      const summary = {
        template: chosenTemplate?.title ?? 'Custom template',
        full_name: form.full_name,
        preferred_display_name: form.preferred_display_name || form.full_name,
        nmls_number: form.nmls_number,
        email: form.email,
        submitted_at: new Date().toISOString(),
      };
      if (typeof window !== 'undefined') {
        sessionStorage.setItem('lfa_last_submission', JSON.stringify(summary));
      }
      router.push('/builder/submitted');
    } catch {
      router.push('/builder/submitted');
    }
  }

  /* ----------------------------- render ----------------------------- */

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center mb-10">
        <span className="inline-flex items-center gap-1.5 bg-[var(--color-lf-orange-soft)] text-[var(--color-lf-orange-dark)] text-[11px] font-bold uppercase tracking-[0.18em] px-3 py-1 rounded-full mb-3">
          <Sparkles size={11} /> 1+1+1=5 Pilot
        </span>
        <h1 className="text-3xl font-black text-[var(--color-lf-black)] mb-2 tracking-tight">
          Build Your Team Leader Marketing Asset
        </h1>
        <p className="text-[var(--color-lf-muted)]">
          Pick a template, fill in your info, and submit to Marketing review.
        </p>
      </div>

      {/* Progress */}
      <div className="mb-10">
        <div className="flex justify-between mb-2 gap-2">
          {STEPS.map((s) => {
            const Icon = s.icon;
            const done = step > s.id;
            const active = step === s.id;
            return (
              <div
                key={s.id}
                className={`flex items-center gap-1.5 text-sm font-semibold transition-colors ${
                  done || active ? 'text-[var(--color-lf-black)]' : 'text-gray-400'
                }`}
              >
                <span
                  className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-colors ${
                    done
                      ? 'bg-[var(--color-lf-orange)] text-white'
                      : active
                      ? 'bg-[var(--color-lf-black)] text-white'
                      : 'bg-[var(--color-lf-surface)] text-gray-500 border border-[var(--color-lf-border)]'
                  }`}
                >
                  {done ? <Check size={14} /> : <Icon size={13} />}
                </span>
                <span className="hidden sm:block">{s.label}</span>
              </div>
            );
          })}
        </div>
        <div className="h-1.5 bg-[var(--color-lf-surface)] rounded-full overflow-hidden">
          <div
            className="h-full bg-[var(--color-lf-orange)] transition-all duration-500"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* ----- LEFT: form ----- */}
        <div className="lg:col-span-2 bg-white border border-[var(--color-lf-border)] rounded-2xl p-8">
          {step === 1 && (
            <TemplateStep
              templates={builderTemplates}
              selected={form.template_id}
              onSelect={(id) => setField('template_id', id)}
            />
          )}

          {step === 2 && (
            <InfoStep form={form} setField={setField} setPreviewUrl={setPreviewUrl} />
          )}

          {step === 3 && (
            <StoryStep
              form={form}
              setField={setField}
              toggleArr={toggleArr}
              areaInput={areaInput}
              setAreaInput={setAreaInput}
              addArea={addArea}
              wordCount={wordCount}
            />
          )}

          {step === 4 && (
            <SocialProofStep form={form} setReview={setReview} setField={setField} />
          )}

          {step === 5 && (
            <ReviewStep
              form={form}
              chosenTemplate={chosenTemplate}
              wordCount={wordCount}
              requiredOk={requiredOk}
              invalidReviewKeys={invalidReviewKeys.length}
              submitting={submitting}
              onSubmit={submitToReview}
            />
          )}

          {/* Nav */}
          <div className="flex justify-between mt-10 pt-6 border-t border-[var(--color-lf-border)]">
            <button
              type="button"
              onClick={back}
              disabled={step === 1}
              className="inline-flex items-center gap-2 text-sm font-semibold text-[var(--color-lf-muted)] hover:text-[var(--color-lf-black)] disabled:opacity-30"
            >
              <ArrowLeft size={16} /> Back
            </button>
            {step < STEPS.length && (
              <button
                type="button"
                onClick={next}
                disabled={step === 1 && !form.template_id}
                className="inline-flex items-center gap-2 bg-[var(--color-lf-orange)] hover:bg-[var(--color-lf-orange-dark)] disabled:bg-gray-300 disabled:cursor-not-allowed text-white text-sm font-bold px-5 py-2.5 rounded-xl transition-colors"
              >
                Next <ArrowRight size={16} />
              </button>
            )}
          </div>
        </div>

        {/* ----- RIGHT: live preview ----- */}
        <aside className="lg:col-span-1">
          <div className="bg-white border border-[var(--color-lf-border)] rounded-2xl overflow-hidden sticky top-20">
            <div className="px-5 py-3 border-b border-[var(--color-lf-border)] text-xs font-bold uppercase tracking-widest text-[var(--color-lf-muted)] flex items-center justify-between">
              <span>Live Preview</span>
              {chosenTemplate && (
                <span className="text-[10px] font-semibold text-[var(--color-lf-orange-dark)] bg-[var(--color-lf-orange-soft)] px-2 py-0.5 rounded-full">
                  {chosenTemplate.title.split(' ').slice(0, 3).join(' ')}
                </span>
              )}
            </div>
            <div className="p-5">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-14 h-14 rounded-full overflow-hidden bg-[var(--color-lf-orange)] border-2 border-[var(--color-lf-orange)] shrink-0 flex items-center justify-center text-white font-black text-xl">
                  {form.profile_photo_preview_url ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={form.profile_photo_preview_url}
                      alt="Uploaded headshot preview"
                      className="w-full h-full object-cover"
                    />
                  ) : form.headshot_url_fallback ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={form.headshot_url_fallback}
                      alt="Headshot preview"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    form.full_name?.[0] || '?'
                  )}
                </div>
                <div>
                  <p className="font-bold text-[var(--color-lf-black)] text-sm">
                    {form.preferred_display_name || form.full_name || 'Your Name'}
                  </p>
                  <p className="text-[var(--color-lf-muted)] text-xs">
                    {form.nmls_number ? formatNMLS(form.nmls_number) : 'NMLS #—'}
                  </p>
                </div>
              </div>
              <p className="text-[var(--color-lf-muted)] text-xs italic mb-4 leading-relaxed">
                {form.languages.length && form.specialties.length && form.service_areas.length
                  ? generateTagline({
                      languages: form.languages,
                      specialties: form.specialties,
                      service_areas: form.service_areas,
                    })
                  : 'Your tagline will appear here based on languages, specialties, and service areas.'}
              </p>
              {form.service_areas.length > 0 && (
                <div className="flex flex-wrap gap-1 mb-3">
                  {form.service_areas.slice(0, 3).map((a) => (
                    <span
                      key={a}
                      className="bg-[var(--color-lf-surface)] text-[var(--color-lf-muted)] text-[10px] font-semibold px-2 py-0.5 rounded-full border border-[var(--color-lf-border)]"
                    >
                      {a}
                    </span>
                  ))}
                </div>
              )}
              {form.specialties.length > 0 && (
                <div className="flex flex-wrap gap-1">
                  {form.specialties.slice(0, 4).map((s) => (
                    <span
                      key={s}
                      className="bg-[var(--color-lf-orange-soft)] text-[var(--color-lf-orange-dark)] text-[10px] font-semibold px-2 py-0.5 rounded-full"
                    >
                      {s}
                    </span>
                  ))}
                </div>
              )}
              {form.profile_photo_filename && (
                <p className="text-[10px] text-[var(--color-lf-muted)] mt-4 truncate">
                  📷 {form.profile_photo_filename}
                </p>
              )}
              {form.ai_reference_image_filename && (
                <p className="text-[10px] text-[var(--color-lf-muted)] truncate">
                  ✨ AI ref: {form.ai_reference_image_filename}
                </p>
              )}
            </div>
            <div className="px-5 py-3 border-t border-[var(--color-lf-border)] text-[10px] text-[var(--color-lf-muted)] text-center">
              Final layout matches the published Team Leader site at <span className="font-semibold">/site/[slug]</span>.
            </div>
          </div>
        </aside>
      </div>
    </div>
  );

  /* --------------------------- subcomponents --------------------------- */
}

/* Step 1 — Template */
function TemplateStep({
  templates,
  selected,
  onSelect,
}: {
  templates: BuilderTemplate[];
  selected: string | null;
  onSelect: (id: string) => void;
}) {
  return (
    <div>
      <div className="flex items-start justify-between flex-wrap gap-3 mb-6">
        <div>
          <span className="inline-flex items-center gap-1.5 bg-[var(--color-lf-orange-soft)] text-[var(--color-lf-orange-dark)] text-[10px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-full mb-2">
            <Sparkles size={11} /> Step 1 of 5
          </span>
          <h2 className="text-2xl sm:text-3xl font-black text-[var(--color-lf-black)] tracking-tight">
            Pick what you&apos;re building.
          </h2>
          <p className="text-sm text-[var(--color-lf-muted)] mt-1 max-w-xl">
            Every template is brand-locked and compliance-aware. Marketing reviews before publish.
          </p>
        </div>
      </div>
      <div className="grid sm:grid-cols-2 gap-4">
        {templates.map((t) => {
          const active = selected === t.id;
          const accentBg =
            t.accent === 'orange'
              ? 'from-[var(--color-lf-orange)] to-[var(--color-lf-orange-dark)]'
              : t.accent === 'black'
              ? 'from-[var(--color-lf-black)] to-[#2b2b2b]'
              : 'from-gray-500 to-gray-700';
          return (
            <button
              type="button"
              key={t.id}
              onClick={() => onSelect(t.id)}
              className={`group text-left bg-white border-2 rounded-2xl overflow-hidden transition-all ${
                active
                  ? 'border-[var(--color-lf-orange)] shadow-lg shadow-[var(--color-lf-orange)]/15 ring-1 ring-[var(--color-lf-orange)]/40'
                  : 'border-[var(--color-lf-border)] hover:border-[var(--color-lf-orange)] hover:shadow-md'
              }`}
            >
              {/* Visual header — gradient + kind label */}
              <div
                className={`relative bg-gradient-to-br ${accentBg} h-24 px-5 py-4 text-white flex flex-col justify-between`}
              >
                <div className="flex items-start justify-between">
                  <span className="text-[10px] font-bold uppercase tracking-widest opacity-90">
                    {t.kind.replace(/-/g, ' ')}
                  </span>
                  {t.featured && (
                    <span className="text-[10px] font-bold uppercase tracking-widest bg-white/20 backdrop-blur px-2 py-0.5 rounded-full">
                      ★ Featured
                    </span>
                  )}
                </div>
                <p className="text-base font-bold leading-tight">{t.title}</p>

                {active && (
                  <span className="absolute top-2 right-2 inline-flex items-center gap-1 text-[10px] font-bold text-[var(--color-lf-orange-dark)] bg-white px-2 py-0.5 rounded-full shadow-sm">
                    <Check size={11} /> Selected
                  </span>
                )}
              </div>

              {/* Body */}
              <div className="p-5">
                <p className="text-sm text-[var(--color-lf-muted)] leading-relaxed line-clamp-3 mb-3">
                  {t.description}
                </p>
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-[var(--color-lf-surface)] text-[var(--color-lf-muted)] border border-[var(--color-lf-border)]">
                    {t.language}
                  </span>
                  <span
                    className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                      t.compliance_status === 'pre-approved'
                        ? 'bg-green-50 text-green-700 border border-green-100'
                        : t.compliance_status === 'needs-personalization'
                        ? 'bg-amber-50 text-amber-700 border border-amber-100'
                        : 'bg-purple-50 text-purple-700 border border-purple-100'
                    }`}
                  >
                    {t.compliance_status.replace(/-/g, ' ')}
                  </span>
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}

/* Step 2 — Info + uploads */
function InfoStep({
  form,
  setField,
  setPreviewUrl,
}: {
  form: BuilderState;
  setField: <K extends keyof BuilderState>(key: K, value: BuilderState[K]) => void;
  setPreviewUrl: (
    key: 'profile_photo_preview_url' | 'ai_reference_image_preview_url',
    file: File | null,
  ) => void;
}) {
  return (
    <div className="space-y-6">
      <h2 className="text-xl font-bold text-[var(--color-lf-black)]">Step 2 — Your Info</h2>
      <div className="grid sm:grid-cols-2 gap-4">
        {[
          { label: 'Full Name *', key: 'full_name' as const, placeholder: 'Jeremy McDonald' },
          {
            label: 'Preferred Display Name',
            key: 'preferred_display_name' as const,
            placeholder: 'Shown on your site',
          },
          { label: 'NMLS Number *', key: 'nmls_number' as const, placeholder: '1195266' },
          {
            label: 'Loan Factory Email *',
            key: 'email' as const,
            type: 'email',
            placeholder: 'you@loanfactory.com',
          },
          { label: 'Phone', key: 'phone' as const, type: 'tel', placeholder: '(904) 555-0100' },
          { label: 'Website', key: 'website' as const, placeholder: 'loanfactory.com/yourname' },
        ].map((field) => (
          <div key={field.key}>
            <label className="block text-xs font-bold uppercase tracking-widest text-[var(--color-lf-muted)] mb-1.5">
              {field.label}
            </label>
            <input
              type={field.type ?? 'text'}
              placeholder={field.placeholder}
              value={form[field.key] as string}
              onChange={(e) => setField(field.key, e.target.value)}
              className="w-full border border-[var(--color-lf-border)] rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-lf-orange)]/30 focus:border-[var(--color-lf-orange)]"
            />
          </div>
        ))}
      </div>

      {/* Uploads */}
      <div className="pt-2">
        <h3 className="text-sm font-bold text-[var(--color-lf-black)] mb-1">
          Profile photo & AI reference image
        </h3>
        <p className="text-xs text-[var(--color-lf-muted)] mb-4">
          Upload a professional headshot or paste an image URL below. Supabase Storage will be wired
          in the production phase. Reference images are for future AI-generated marketing visuals —
          do not include borrower data or private loan information in any upload.
        </p>
        <div className="grid sm:grid-cols-2 gap-4">
          <BuilderUpload
            title="Profile photo"
            bucket="profile-images"
            accept="image/*"
            description="Your professional headshot. Preview shows immediately on the right."
            existing={form.profile_photo_filename}
            previewUrl={form.profile_photo_preview_url}
            onPick={(name) => setField('profile_photo_filename', name)}
            onFile={(file) => setPreviewUrl('profile_photo_preview_url', file)}
            onClear={() => {
              setField('profile_photo_filename', null);
              setPreviewUrl('profile_photo_preview_url', null);
            }}
          />
          <BuilderUpload
            title="AI reference image"
            bucket="reference-images"
            accept="image/*"
            description="A clear photo of you used to generate consistent marketing visuals."
            existing={form.ai_reference_image_filename}
            previewUrl={form.ai_reference_image_preview_url}
            onPick={(name) => setField('ai_reference_image_filename', name)}
            onFile={(file) => setPreviewUrl('ai_reference_image_preview_url', file)}
            onClear={() => {
              setField('ai_reference_image_filename', null);
              setPreviewUrl('ai_reference_image_preview_url', null);
            }}
          />
        </div>
        <div className="mt-4">
          <label className="block text-xs font-bold uppercase tracking-widest text-[var(--color-lf-muted)] mb-1.5">
            Or paste image URL
          </label>
          <input
            type="url"
            placeholder="https://your-headshot.example.com/photo.jpg"
            value={form.headshot_url_fallback}
            onChange={(e) => setField('headshot_url_fallback', e.target.value)}
            className="w-full border border-[var(--color-lf-border)] rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-lf-orange)]/30 focus:border-[var(--color-lf-orange)]"
          />
          <p className="text-[11px] text-[var(--color-lf-muted)] mt-1">
            Use this if your headshot is already hosted elsewhere. The uploaded photo takes priority
            in the preview if both are provided.
          </p>
        </div>
      </div>
    </div>
  );
}

/* Step 3 — Story + brand voice */
function StoryStep({
  form,
  setField,
  toggleArr,
  areaInput,
  setAreaInput,
  addArea,
  wordCount,
}: {
  form: BuilderState;
  setField: <K extends keyof BuilderState>(key: K, value: BuilderState[K]) => void;
  toggleArr: (key: 'languages' | 'specialties' | 'licensed_states', value: string) => void;
  areaInput: string;
  setAreaInput: (s: string) => void;
  addArea: () => void;
  wordCount: number;
}) {
  return (
    <div className="space-y-6">
      <h2 className="text-xl font-bold text-[var(--color-lf-black)]">Step 3 — Your Story</h2>

      <div className="grid sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-bold uppercase tracking-widest text-[var(--color-lf-muted)] mb-1.5">
            Team name
          </label>
          <input
            value={form.team_name}
            onChange={(e) => setField('team_name', e.target.value)}
            placeholder="The Legends Mortgage Team"
            className="w-full border border-[var(--color-lf-border)] rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-lf-orange)]/30 focus:border-[var(--color-lf-orange)]"
          />
          <p className="text-[11px] text-amber-700 bg-amber-50 border border-amber-100 rounded-md px-2 py-1 mt-2">
            Team names are <span className="font-bold">not allowed</span> on NJ or RI marketing.
          </p>
        </div>
        <div>
          <label className="block text-xs font-bold uppercase tracking-widest text-[var(--color-lf-muted)] mb-1.5">
            Short bio
          </label>
          <input
            value={form.short_bio}
            onChange={(e) => setField('short_bio', e.target.value)}
            placeholder="One line under your name."
            className="w-full border border-[var(--color-lf-border)] rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-lf-orange)]/30 focus:border-[var(--color-lf-orange)]"
          />
        </div>
      </div>

      <BioImporter
        currentBio={form.long_bio}
        onImport={(text) => setField('long_bio', text)}
      />

      <div>
        <div className="flex justify-between mb-1">
          <label className="block text-xs font-bold uppercase tracking-widest text-[var(--color-lf-muted)]">
            Long bio *
          </label>
          <span
            className={`text-[11px] font-medium ${
              wordCount > 250 ? 'text-red-500' : 'text-[var(--color-lf-muted)]'
            }`}
          >
            {wordCount}/250 words
          </span>
        </div>
        <textarea
          rows={6}
          placeholder="Tell clients who you are, who you help, and why they should work with you. No rate guarantees, no superlative claims."
          value={form.long_bio}
          onChange={(e) => setField('long_bio', e.target.value)}
          className="w-full border border-[var(--color-lf-border)] rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-lf-orange)]/30 focus:border-[var(--color-lf-orange)] resize-y leading-relaxed"
        />
      </div>

      <div className="grid sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-bold uppercase tracking-widest text-[var(--color-lf-muted)] mb-1.5">
            Persona summary
          </label>
          <textarea
            rows={3}
            placeholder="Tone, audience, do/don't list."
            value={form.persona_summary}
            onChange={(e) => setField('persona_summary', e.target.value)}
            className="w-full border border-[var(--color-lf-border)] rounded-xl px-4 py-2.5 text-sm resize-y focus:outline-none focus:ring-2 focus:ring-[var(--color-lf-orange)]/30 focus:border-[var(--color-lf-orange)]"
          />
        </div>
        <div>
          <label className="block text-xs font-bold uppercase tracking-widest text-[var(--color-lf-muted)] mb-1.5">
            Compliance notes
          </label>
          <textarea
            rows={3}
            placeholder="State exposure, prior reviewer feedback, brand caveats."
            value={form.compliance_notes}
            onChange={(e) => setField('compliance_notes', e.target.value)}
            className="w-full border border-[var(--color-lf-border)] rounded-xl px-4 py-2.5 text-sm resize-y focus:outline-none focus:ring-2 focus:ring-[var(--color-lf-orange)]/30 focus:border-[var(--color-lf-orange)]"
          />
        </div>
      </div>

      {/* Service areas */}
      <div>
        <label className="block text-xs font-bold uppercase tracking-widest text-[var(--color-lf-muted)] mb-1.5">
          Service areas
        </label>
        <div className="flex gap-2 mb-2">
          <input
            type="text"
            placeholder="Jacksonville FL"
            value={areaInput}
            onChange={(e) => setAreaInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                addArea();
              }
            }}
            className="flex-1 border border-[var(--color-lf-border)] rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-lf-orange)]/30 focus:border-[var(--color-lf-orange)]"
          />
          <button
            type="button"
            onClick={addArea}
            className="bg-[var(--color-lf-black)] text-white px-4 py-2.5 rounded-xl text-sm font-semibold hover:bg-gray-800"
          >
            Add
          </button>
        </div>
        <div className="flex flex-wrap gap-2">
          {form.service_areas.map((area) => (
            <span
              key={area}
              className="bg-[var(--color-lf-surface)] text-[var(--color-lf-black)] text-xs font-medium px-3 py-1 rounded-full border border-[var(--color-lf-border)] flex items-center gap-1"
            >
              {area}
              <button
                type="button"
                onClick={() =>
                  setField(
                    'service_areas',
                    form.service_areas.filter((a) => a !== area),
                  )
                }
                className="ml-1 text-gray-400 hover:text-red-500"
                aria-label={`Remove ${area}`}
              >
                ×
              </button>
            </span>
          ))}
        </div>
      </div>

      {/* Licensed states */}
      <div>
        <label className="block text-xs font-bold uppercase tracking-widest text-[var(--color-lf-muted)] mb-2">
          Licensed states
        </label>
        <div className="flex flex-wrap gap-2">
          {STATE_OPTIONS.map((s) => {
            const on = form.licensed_states.includes(s);
            return (
              <button
                type="button"
                key={s}
                onClick={() => toggleArr('licensed_states', s)}
                className={`text-xs font-semibold px-2.5 py-1 rounded-full border transition-colors ${
                  on
                    ? 'bg-[var(--color-lf-black)] border-[var(--color-lf-black)] text-white'
                    : 'bg-white border-[var(--color-lf-border)] text-[var(--color-lf-muted)] hover:border-[var(--color-lf-black)] hover:text-[var(--color-lf-black)]'
                }`}
              >
                {s}
              </button>
            );
          })}
        </div>
      </div>

      {/* Languages + specialties */}
      <div className="grid sm:grid-cols-2 gap-6">
        <div>
          <label className="block text-xs font-bold uppercase tracking-widest text-[var(--color-lf-muted)] mb-2">
            Languages spoken
          </label>
          <div className="flex flex-wrap gap-2">
            {LANGUAGE_OPTIONS.map((lang) => {
              const on = form.languages.includes(lang);
              return (
                <button
                  type="button"
                  key={lang}
                  onClick={() => toggleArr('languages', lang)}
                  className={`text-xs font-semibold px-2.5 py-1 rounded-full border transition-colors ${
                    on
                      ? 'bg-[var(--color-lf-orange)] border-[var(--color-lf-orange)] text-white'
                      : 'bg-white border-[var(--color-lf-border)] text-[var(--color-lf-muted)] hover:border-[var(--color-lf-orange)] hover:text-[var(--color-lf-orange-dark)]'
                  }`}
                >
                  {lang}
                </button>
              );
            })}
          </div>
        </div>
        <div>
          <label className="block text-xs font-bold uppercase tracking-widest text-[var(--color-lf-muted)] mb-2">
            Loan specialties
          </label>
          <div className="flex flex-wrap gap-2">
            {SPECIALTY_OPTIONS.map((spec) => {
              const on = form.specialties.includes(spec);
              return (
                <button
                  type="button"
                  key={spec}
                  onClick={() => toggleArr('specialties', spec)}
                  className={`text-xs font-semibold px-2.5 py-1 rounded-full border transition-colors ${
                    on
                      ? 'bg-[var(--color-lf-orange)] border-[var(--color-lf-orange)] text-white'
                      : 'bg-white border-[var(--color-lf-border)] text-[var(--color-lf-muted)] hover:border-[var(--color-lf-orange)] hover:text-[var(--color-lf-orange-dark)]'
                  }`}
                >
                  {spec}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Document uploads */}
      <div className="pt-2">
        <h3 className="text-sm font-bold text-[var(--color-lf-black)] mb-1">
          Persona, brand voice, and compliance documents
        </h3>
        <p className="text-xs text-[var(--color-lf-muted)] mb-4">
          These help future AI-generated drafts sound like you. Never upload borrower or loan-file
          documents.
        </p>
        <div className="grid sm:grid-cols-2 gap-4">
          <BuilderUpload
            title="Persona document"
            bucket="persona-documents"
            accept=".pdf,.docx,.txt,.md"
            description="Tone, audience, do/don't list."
            existing={form.persona_document_filename}
            onPick={(n) => setField('persona_document_filename', n)}
            onClear={() => setField('persona_document_filename', null)}
          />
          <BuilderUpload
            title="Brand voice document"
            bucket="brand-assets"
            accept=".pdf,.docx,.txt,.md"
            description="Sample posts, taglines, off-limits phrases."
            existing={form.brand_voice_document_filename}
            onPick={(n) => setField('brand_voice_document_filename', n)}
            onClear={() => setField('brand_voice_document_filename', null)}
          />
          <BuilderUpload
            title="Logo or team logo"
            bucket="brand-assets"
            accept="image/svg+xml,image/png"
            description="Must comply with the Loan-Factory-equal-or-larger rule."
            existing={form.team_logo_filename}
            onPick={(n) => setField('team_logo_filename', n)}
            onClear={() => setField('team_logo_filename', null)}
          />
          <BuilderUpload
            title="Compliance approval document"
            bucket="compliance-documents"
            accept=".pdf"
            description="Any Marketing-issued approval letters."
            existing={form.compliance_doc_filename}
            onPick={(n) => setField('compliance_doc_filename', n)}
            onClear={() => setField('compliance_doc_filename', null)}
          />
        </div>
      </div>
    </div>
  );
}

/* Step 4 — Social Proof */
function SocialProofStep({
  form,
  setReview,
  setField,
}: {
  form: BuilderState;
  setReview: (key: ReviewKey, value: string) => void;
  setField: <K extends keyof BuilderState>(key: K, value: BuilderState[K]) => void;
}) {
  return (
    <div className="space-y-5">
      <h2 className="text-xl font-bold text-[var(--color-lf-black)]">Step 4 — Social Proof</h2>
      <p className="text-sm text-[var(--color-lf-muted)]">
        Add review profiles. URLs are validated. Marketing must review every site before public
        publish.
      </p>

      {REVIEW_PROVIDERS.map((p) => {
        const value = form.reviews[p.key];
        const invalid = !!value && !isValidUrl(value);
        return (
          <div key={p.key}>
            <label className="block text-xs font-bold uppercase tracking-widest text-[var(--color-lf-muted)] mb-1.5">
              {p.label} review link
            </label>
            <input
              type="url"
              placeholder={`https://...`}
              value={value}
              onChange={(e) => setReview(p.key, e.target.value)}
              className={`w-full border rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 ${
                invalid
                  ? 'border-red-300 focus:ring-red-400/30 focus:border-red-500'
                  : 'border-[var(--color-lf-border)] focus:ring-[var(--color-lf-orange)]/30 focus:border-[var(--color-lf-orange)]'
              }`}
            />
            {invalid && (
              <p className="text-xs text-red-600 mt-1">Enter a valid URL (starts with https://).</p>
            )}
          </div>
        );
      })}

      <div>
        <label className="block text-xs font-bold uppercase tracking-widest text-[var(--color-lf-muted)] mb-1.5">
          Testimonial snippet (optional)
        </label>
        <textarea
          rows={3}
          placeholder="Short quote from a real client (first name + last initial)."
          value={form.testimonial}
          onChange={(e) => setField('testimonial', e.target.value)}
          className="w-full border border-[var(--color-lf-border)] rounded-xl px-4 py-2.5 text-sm resize-y focus:outline-none focus:ring-2 focus:ring-[var(--color-lf-orange)]/30 focus:border-[var(--color-lf-orange)]"
        />
        <p className="text-[11px] text-[var(--color-lf-muted)] mt-1.5">
          Use first name + last initial only. Marketing may require additional consent before
          publish.
        </p>
      </div>
    </div>
  );
}

/* Step 5 — Review & Submit */
function ReviewStep({
  form,
  chosenTemplate,
  wordCount,
  requiredOk,
  invalidReviewKeys,
  submitting,
  onSubmit,
}: {
  form: BuilderState;
  chosenTemplate: BuilderTemplate | undefined;
  wordCount: number;
  requiredOk: boolean;
  invalidReviewKeys: number;
  submitting: boolean;
  onSubmit: () => void;
}) {
  return (
    <div>
      <h2 className="text-xl font-bold text-[var(--color-lf-black)] mb-2">
        Step 5 — Review &amp; Submit
      </h2>
      <p className="text-sm text-[var(--color-lf-muted)] mb-6">
        Marketing typically reviews within 1–2 business days. Publishing happens only after a
        reviewer approves.
      </p>

      <div className="bg-[var(--color-lf-surface)] rounded-2xl p-5 space-y-3 text-sm border border-[var(--color-lf-border)]">
        <SummaryRow label="Template" value={chosenTemplate?.title ?? '—'} />
        <SummaryRow label="Name" value={form.full_name || '—'} />
        <SummaryRow label="Display name" value={form.preferred_display_name || form.full_name || '—'} />
        <SummaryRow
          label="NMLS"
          value={form.nmls_number ? formatNMLS(form.nmls_number) : '—'}
        />
        <SummaryRow label="Loan Factory email" value={form.email || '—'} />
        <SummaryRow label="Licensed states" value={form.licensed_states.join(', ') || '—'} />
        <SummaryRow label="Service areas" value={form.service_areas.join(', ') || '—'} />
        <SummaryRow label="Languages" value={form.languages.join(', ') || '—'} />
        <SummaryRow label="Specialties" value={form.specialties.join(', ') || '—'} />
        <SummaryRow
          label="Bio length"
          value={
            <span
              className={`font-semibold ${
                wordCount > 250 ? 'text-red-500' : 'text-green-600'
              }`}
            >
              {wordCount}/250 words
            </span>
          }
        />
        <SummaryRow
          label="Uploads"
          value={
            [
              form.profile_photo_filename && 'Profile photo',
              form.ai_reference_image_filename && 'AI reference image',
              form.persona_document_filename && 'Persona doc',
              form.brand_voice_document_filename && 'Brand voice doc',
              form.team_logo_filename && 'Logo',
              form.compliance_doc_filename && 'Compliance doc',
            ]
              .filter(Boolean)
              .join(' · ') || '—'
          }
        />
      </div>

      {invalidReviewKeys > 0 && (
        <p className="text-xs text-red-600 mt-4">
          Fix {invalidReviewKeys} invalid review URL{invalidReviewKeys === 1 ? '' : 's'} before
          submitting.
        </p>
      )}

      <button
        type="button"
        onClick={onSubmit}
        disabled={!requiredOk || submitting}
        className="mt-6 w-full inline-flex items-center justify-center gap-2 bg-[var(--color-lf-orange)] hover:bg-[var(--color-lf-orange-dark)] disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-bold py-4 rounded-xl transition-colors"
      >
        {submitting ? 'Submitting…' : 'Submit to Marketing Review'} <ArrowRight size={18} />
      </button>

      {!requiredOk && invalidReviewKeys === 0 && (
        <p className="text-[11px] text-red-500 text-center mt-2">
          Template, full name, NMLS number, and Loan Factory email are required.
        </p>
      )}
      <p className="text-[11px] text-[var(--color-lf-muted)] text-center mt-3">
        Submitting creates a Pending Review draft. Nothing is published until a reviewer approves.
      </p>
    </div>
  );
}

function SummaryRow({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="flex justify-between gap-3">
      <span className="text-[var(--color-lf-muted)]">{label}</span>
      <span className="font-semibold text-[var(--color-lf-black)] text-right">{value}</span>
    </div>
  );
}

/* Builder-facing upload — wraps the shared UploadCard with onSelect / onFile /
   onClear callbacks so the builder mirrors the chosen filename and a fresh
   object-URL preview in its state. */
function BuilderUpload({
  title,
  description,
  bucket,
  accept,
  existing,
  previewUrl,
  onPick,
  onFile,
  onClear,
}: {
  title: string;
  description: string;
  bucket: import('@/lib/platform-types').UploadBucket;
  accept?: string;
  existing: string | null;
  previewUrl?: string | null;
  onPick: (name: string) => void;
  onFile?: (file: File) => void;
  onClear: () => void;
}) {
  return (
    <div>
      {previewUrl && (
        <div className="mb-2 flex items-center gap-3">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={previewUrl}
            alt="Upload preview"
            className="w-12 h-12 rounded-lg object-cover border border-[var(--color-lf-border)]"
          />
          <span className="text-[11px] text-[var(--color-lf-muted)]">
            Live preview ready. The published site will use this image after Marketing approval.
          </span>
        </div>
      )}
      <UploadCard
        title={title}
        description={description}
        bucket={bucket}
        accept={accept}
        existingFileName={existing ?? undefined}
        onSelect={onPick}
        onFile={onFile}
        onClear={onClear}
        helperText="Demo upload — file does not leave the browser. Will sync to Supabase Storage once wired."
      />
    </div>
  );
}

/* ------------------------------------------------------------------ *
 *  BioImporter — drop a .txt / .md / .pdf / .docx persona doc into
 *  the bio textarea. Text and markdown are parsed client-side via
 *  FileReader. PDF and DOCX show a "demo: server parse pending" note
 *  and surface the filename — server-side parsing will land with the
 *  Supabase Storage + extract pipeline.
 * ------------------------------------------------------------------ */

function BioImporter({
  currentBio,
  onImport,
}: {
  currentBio: string;
  onImport: (text: string) => void;
}) {
  const [importedName, setImportedName] = useState<string | null>(null);
  const [importedKind, setImportedKind] = useState<'text' | 'binary' | null>(null);
  const [hover, setHover] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function clear() {
    setImportedName(null);
    setImportedKind(null);
    setError(null);
  }

  async function readFile(file: File) {
    setError(null);
    setBusy(true);
    try {
      const name = file.name.toLowerCase();
      const isTextLike =
        name.endsWith('.txt') ||
        name.endsWith('.md') ||
        name.endsWith('.markdown') ||
        file.type === 'text/plain' ||
        file.type === 'text/markdown';
      if (isTextLike) {
        const text = await file.text();
        const cleaned = text.trim().slice(0, 4000); // keep bio reasonably bounded
        if (currentBio && !confirm('Replace existing bio with imported text?')) {
          setBusy(false);
          return;
        }
        onImport(cleaned);
        setImportedName(file.name);
        setImportedKind('text');
      } else if (
        name.endsWith('.pdf') ||
        name.endsWith('.docx') ||
        name.endsWith('.doc') ||
        file.type === 'application/pdf' ||
        file.type ===
          'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
      ) {
        // TODO(parser): server-side extract via /api/parse-doc once Supabase
        // Storage + a pdf/docx parser are wired. For demo, just stash the
        // filename so the user knows it was received.
        setImportedName(file.name);
        setImportedKind('binary');
      } else {
        setError(`Unsupported file type. Accepts .txt, .md, .pdf, .docx, .doc.`);
      }
    } catch (err) {
      setError((err as Error).message || 'Could not read file.');
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="bg-[var(--color-lf-orange-soft)] border border-orange-100 rounded-2xl p-4">
      <div className="flex items-start justify-between gap-3 mb-3">
        <div>
          <p className="text-xs font-bold uppercase tracking-widest text-[var(--color-lf-orange-dark)]">
            Import bio from a document
          </p>
          <p className="text-[11px] text-[var(--color-lf-muted)] mt-0.5">
            Drop a persona doc, brand voice doc, or any short write-up. We&apos;ll prefill the bio.
          </p>
        </div>
        {importedName && (
          <button
            type="button"
            onClick={clear}
            className="p-1 text-[var(--color-lf-muted)] hover:text-red-600"
            aria-label="Remove imported file"
          >
            <X size={14} />
          </button>
        )}
      </div>

      <label
        onDragOver={(e) => {
          e.preventDefault();
          setHover(true);
        }}
        onDragLeave={() => setHover(false)}
        onDrop={(e) => {
          e.preventDefault();
          setHover(false);
          const f = e.dataTransfer.files?.[0];
          if (f) void readFile(f);
        }}
        className={`flex items-center gap-3 border-2 border-dashed rounded-xl p-3 cursor-pointer transition-colors bg-white ${
          importedName
            ? 'border-green-200'
            : hover
            ? 'border-[var(--color-lf-orange)] bg-[var(--color-lf-orange-soft)]'
            : 'border-[var(--color-lf-border)] hover:border-[var(--color-lf-orange)]'
        }`}
      >
        <div
          className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 ${
            importedName
              ? 'bg-green-100 text-green-700'
              : 'bg-[var(--color-lf-orange-soft)] text-[var(--color-lf-orange-dark)]'
          }`}
        >
          {importedName ? <CheckCircle2 size={16} /> : <Upload size={16} />}
        </div>
        <div className="min-w-0 flex-1">
          {importedName ? (
            <>
              <p className="text-sm font-semibold text-[var(--color-lf-black)] truncate">
                {importedName}
              </p>
              <p className="text-[11px] text-[var(--color-lf-muted)]">
                {importedKind === 'text'
                  ? 'Imported into your bio — edit below.'
                  : 'Received. Server-side extract will land when Supabase Storage is wired.'}
              </p>
            </>
          ) : (
            <>
              <p className="text-sm font-semibold text-[var(--color-lf-black)]">
                {busy ? 'Reading…' : 'Drop file or '}
                {!busy && (
                  <span className="text-[var(--color-lf-orange-dark)] underline">browse</span>
                )}
              </p>
              <p className="text-[11px] text-[var(--color-lf-muted)]">
                Accepts .txt, .md, .pdf, .docx, .doc — never upload borrower data or private loan
                files.
              </p>
            </>
          )}
        </div>
        <input
          type="file"
          accept=".txt,.md,.markdown,.pdf,.docx,.doc,text/plain,text/markdown,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
          className="sr-only"
          onChange={(e) => {
            const f = e.target.files?.[0];
            if (f) void readFile(f);
          }}
        />
      </label>

      {error && (
        <p className="text-[11px] text-red-700 bg-red-50 border border-red-100 rounded-md px-2 py-1 mt-2">
          {error}
        </p>
      )}
    </div>
  );
}
