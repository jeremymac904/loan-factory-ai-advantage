// Mock data for the (platform) route group. Phase 1 will replace these
// exports with Supabase reads — keep return shapes stable.
//
// Demo-mode contract: any consumer of this file MUST gracefully handle a
// future swap to async data sources. Do not embed UI assumptions about
// data being synchronously available beyond initial render.

import type {
  AuditEvent,
  BuilderTemplate,
  ContentCalendarItem,
  ContentDraft,
  DashboardStats,
  MarketingTemplate,
  PlatformSettings,
  PlatformUserProfile,
  SharedTeamAsset,
  UploadedAsset,
} from './platform-types';

// --- Current pilot user --------------------------------------------------

export const currentUserProfile: PlatformUserProfile = {
  id: 'user_jeremy',
  full_name: 'Jeremy McDonald',
  preferred_display_name: 'Jeremy McDonald',
  nmls_number: '1195266',
  loan_factory_email: 'jeremy@mcdonald-mtg.com',
  phone: '(904) 555-0100',
  personal_website: 'https://aiadvantage.loanfactory.com/site/jeremy-mcdonald',
  licensed_states: ['FL', 'GA'],
  service_areas: [
    'Jacksonville FL',
    'St. Augustine FL',
    'Fleming Island FL',
    'Orange Park FL',
    'Ponte Vedra FL',
  ],
  languages: ['English'],
  specialties: ['VA', 'FHA', 'Conventional', 'Jumbo', 'First-Time Buyer'],
  short_bio:
    'Senior Mortgage Advisor at Loan Factory, helping families and investors across Northeast Florida.',
  long_bio:
    'With over 20 years in finance, I founded The Legends Mortgage Team to bring real expertise, honest guidance, and competitive wholesale pricing to every client I serve in Northeast Florida. Whether you are a first-time buyer, a veteran using your VA benefit, or an investor building a portfolio, I am here to find the right loan at the right rate through our wholesale lender partners.',
  team_name: 'The Legends Mortgage Team',
  team_role: 'Team Leader',
  persona_summary:
    'Confident, plainspoken, family-first. Talks about strategy and value, never hype. Trusts the math. Speaks the language of Realtors and investors.',
  compliance_notes:
    'FL primary, GA secondary. No NJ/RI/MA/AZ exposure yet. All rate/APR posts must follow the Marketing Policy.',
  profile_image_url:
    'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=400&h=400&fit=crop&crop=face',
  ai_reference_image_url: undefined,
  persona_document_url: undefined,
  brand_voice_document_url: undefined,
  team_logo_url: undefined,
  compliance_approval_document_url: undefined,
  profile_completion_pct: 72,
  created_at: '2026-05-01T00:00:00Z',
  updated_at: '2026-05-20T00:00:00Z',
};

// --- Dashboard stats -----------------------------------------------------

export const dashboardStats: DashboardStats = {
  profile_completion_pct: 72,
  templates_available: 24,
  draft_posts: 3,
  pending_compliance_review: 2,
  published_team_assets: 17,
};

// --- Templates -----------------------------------------------------------

export const marketingTemplates: MarketingTemplate[] = [
  {
    id: 'tpl_va_education_1',
    title: 'VA Loan — Zero Down Explainer',
    category: 'VA Loans',
    format: 'Reel',
    description:
      '30-second reel explaining VA loan benefits — zero down, no PMI, competitive wholesale pricing. Plug-in style.',
    channels: ['Instagram', 'Facebook', 'TikTok'],
    thumbnail_color: 'navy',
    compliance_status: 'pre-approved',
    use_count: 142,
    shared_with_team: true,
    created_at: '2026-03-12T00:00:00Z',
  },
  {
    id: 'tpl_fha_firsttime_1',
    title: 'FHA — First-Time Buyer Down Payment Reality',
    category: 'FHA Loans',
    format: 'Carousel',
    description: 'Five-slide Instagram carousel walking through real FHA down payment options.',
    channels: ['Instagram', 'Facebook'],
    thumbnail_color: 'gold',
    compliance_status: 'pre-approved',
    use_count: 98,
    shared_with_team: true,
    created_at: '2026-03-15T00:00:00Z',
  },
  {
    id: 'tpl_dscr_investor_1',
    title: 'DSCR — Qualifying On Rental Income',
    category: 'DSCR and Investor',
    format: 'Static Post',
    description:
      'Static image post explaining how DSCR loans qualify on rental income with no personal DTI.',
    channels: ['Instagram', 'LinkedIn'],
    thumbnail_color: 'orange',
    compliance_status: 'pre-approved',
    use_count: 56,
    shared_with_team: true,
    created_at: '2026-03-20T00:00:00Z',
  },
  {
    id: 'tpl_recruit_1',
    title: 'Why I Joined Loan Factory',
    category: 'Recruiting',
    format: 'Video Script',
    description: 'Two-minute video script for LO recruiting. Wholesale broker positioning.',
    channels: ['LinkedIn', 'YouTube'],
    thumbnail_color: 'navy',
    compliance_status: 'pre-approved',
    use_count: 38,
    shared_with_team: true,
    created_at: '2026-04-01T00:00:00Z',
  },
  {
    id: 'tpl_realtor_1',
    title: 'Realtor Co-Marketing — Buyer Workshop',
    category: 'Realtor Partner',
    format: 'Flyer',
    description: 'Co-branded flyer template for a Saturday buyer workshop.',
    channels: ['Email', 'Facebook'],
    thumbnail_color: 'gold',
    compliance_status: 'needs-personalization',
    use_count: 21,
    shared_with_team: true,
    created_at: '2026-04-04T00:00:00Z',
  },
  {
    id: 'tpl_consumer_ed_1',
    title: 'Closing Costs Explained, Honestly',
    category: 'Consumer Education',
    format: 'Static Post',
    description:
      'Plain-language explainer about what closing costs actually cover. No "no closing costs" claims.',
    channels: ['Instagram', 'Facebook'],
    thumbnail_color: 'green',
    compliance_status: 'pre-approved',
    use_count: 73,
    shared_with_team: true,
    created_at: '2026-04-10T00:00:00Z',
  },
  {
    id: 'tpl_first_time_1',
    title: 'First-Time Buyer Roadmap — 6 Steps',
    category: 'First Time Buyer',
    format: 'Email',
    description: 'Multi-step nurture email walking new buyers through the process.',
    channels: ['Email'],
    thumbnail_color: 'navy',
    compliance_status: 'pre-approved',
    use_count: 64,
    shared_with_team: true,
    created_at: '2026-04-14T00:00:00Z',
  },
  {
    id: 'tpl_spanish_1',
    title: 'FHA en Español — Pago Inicial',
    category: 'Spanish Content',
    format: 'Reel',
    description: 'Spanish-language reel explaining FHA down payment minimums.',
    channels: ['Instagram', 'TikTok', 'Facebook'],
    thumbnail_color: 'orange',
    compliance_status: 'pre-approved',
    use_count: 19,
    shared_with_team: true,
    created_at: '2026-04-20T00:00:00Z',
  },
  {
    id: 'tpl_team_leader_1',
    title: 'Team Leader Spotlight Landing Page',
    category: 'Team Leader Marketing',
    format: 'Landing Page',
    description: 'Landing-page template introducing a Team Leader to their local market.',
    channels: ['Website'],
    thumbnail_color: 'purple',
    compliance_status: 'needs-personalization',
    use_count: 12,
    shared_with_team: true,
    created_at: '2026-05-01T00:00:00Z',
  },
  {
    id: 'tpl_ma_disclaimer_1',
    title: 'MA — Rate Post (with We Arrange Disclosure)',
    category: 'Consumer Education',
    format: 'Static Post',
    description:
      'Static post template that pre-bakes the "We arrange but do not make loans" MA disclosure for rate-mentioning content.',
    channels: ['Instagram', 'Facebook'],
    thumbnail_color: 'navy',
    compliance_status: 'state-restricted',
    state_restrictions: ['MA'],
    use_count: 8,
    shared_with_team: true,
    created_at: '2026-05-05T00:00:00Z',
  },
  {
    id: 'tpl_nj_disclaimer_1',
    title: 'NJ — Mortgage Post (with NJ Banking Disclosure)',
    category: 'Consumer Education',
    format: 'Static Post',
    description:
      'NJ-safe mortgage post template — no team name, includes "Licensed by the NJ Department of Banking and Insurance".',
    channels: ['Instagram', 'Facebook'],
    thumbnail_color: 'navy',
    compliance_status: 'state-restricted',
    state_restrictions: ['NJ'],
    use_count: 5,
    shared_with_team: true,
    created_at: '2026-05-07T00:00:00Z',
  },
  {
    id: 'tpl_ri_disclaimer_1',
    title: 'RI — Mortgage Post (with RI Broker Disclosures)',
    category: 'Consumer Education',
    format: 'Static Post',
    description:
      'RI-safe mortgage post — no team name, includes "RI licensed Mortgage Loan Originator" + "RI Licensed Loan Broker".',
    channels: ['Instagram', 'Facebook'],
    thumbnail_color: 'navy',
    compliance_status: 'state-restricted',
    state_restrictions: ['RI'],
    use_count: 4,
    shared_with_team: true,
    created_at: '2026-05-08T00:00:00Z',
  },
];

// --- Drafts --------------------------------------------------------------

export const contentDrafts: ContentDraft[] = [
  {
    id: 'draft_1',
    owner_id: 'user_jeremy',
    template_id: 'tpl_va_education_1',
    title: 'VA Loan Zero-Down Reel — June',
    campaign_goal: 'Educate veterans in Jacksonville on the VA zero-down benefit.',
    audience: 'Active duty and veterans, 25–45, Northeast Florida.',
    channels: ['Instagram', 'Facebook'],
    caption:
      'Veterans — your VA benefit covers ZERO down on a primary residence. No PMI, competitive wholesale rates through Loan Factory. DM "VA" and I\'ll walk you through eligibility. Jeremy McDonald, NMLS #1195266. Loan Factory, NMLS #320841. Equal Housing Lender.',
    visual_notes: 'Reel: opening hook over a Jacksonville waterfront B-roll, closeup talking head, closing CTA on gold band.',
    compliance_footer:
      'Jeremy McDonald | NMLS #1195266 | Loan Factory | NMLS #320841 | Equal Housing Lender',
    status: 'Needs Review',
    created_at: '2026-05-18T00:00:00Z',
    updated_at: '2026-05-19T00:00:00Z',
  },
  {
    id: 'draft_2',
    owner_id: 'user_jeremy',
    template_id: 'tpl_dscr_investor_1',
    title: 'DSCR Investor Carousel — Portfolio Builder',
    campaign_goal: 'Reach Jacksonville investors building 3–10 door rental portfolios.',
    audience: 'Buy-and-hold investors, 30–55, Northeast Florida.',
    channels: ['Instagram', 'LinkedIn'],
    caption:
      'Three DSCR myths costing investors deals — and the wholesale move that fixes all three. Jeremy McDonald, NMLS #1195266. Loan Factory, NMLS #320841.',
    visual_notes: 'Five-slide carousel. Navy backgrounds. Specific numbers, no superlatives.',
    compliance_footer:
      'Jeremy McDonald | NMLS #1195266 | Loan Factory | NMLS #320841 | Equal Housing Lender',
    status: 'Draft',
    created_at: '2026-05-19T00:00:00Z',
    updated_at: '2026-05-19T00:00:00Z',
  },
  {
    id: 'draft_3',
    owner_id: 'user_jeremy',
    title: 'Saturday Buyer Workshop — Realtor Co-Branded',
    campaign_goal: 'Drive 20 sign-ups for a co-marketed first-time buyer workshop.',
    audience: 'First-time buyers in Orange Park / Fleming Island.',
    channels: ['Email', 'Facebook'],
    caption:
      'Saturday June 14 — free 60-minute workshop covering FHA, conventional, and down payment options for first-time buyers in Northeast Florida. Hosted with Realtor [Partner Name]. RSVP in comments.',
    visual_notes: 'Co-branded flyer. Loan Factory wordmark equal-or-larger than personal name.',
    compliance_footer:
      'Jeremy McDonald | NMLS #1195266 | Loan Factory | NMLS #320841 | Equal Housing Lender',
    status: 'Draft',
    scheduled_for: '2026-06-10T15:00:00Z',
    created_at: '2026-05-20T00:00:00Z',
    updated_at: '2026-05-20T00:00:00Z',
  },
];

// --- Calendar ------------------------------------------------------------

export const calendarItems: ContentCalendarItem[] = [
  {
    id: 'cal_1',
    draft_id: 'draft_1',
    title: 'VA Loan Zero-Down Reel — June',
    channel: 'Instagram',
    status: 'Needs Review',
    scheduled_for: '2026-06-03T13:00:00Z',
    owner_display_name: 'Jeremy McDonald',
  },
  {
    id: 'cal_2',
    draft_id: 'draft_1',
    title: 'VA Loan Zero-Down Reel — June (FB)',
    channel: 'Facebook',
    status: 'Needs Review',
    scheduled_for: '2026-06-03T14:00:00Z',
    owner_display_name: 'Jeremy McDonald',
  },
  {
    id: 'cal_3',
    draft_id: 'draft_3',
    title: 'Saturday Buyer Workshop (Email)',
    channel: 'Email',
    status: 'Draft',
    scheduled_for: '2026-06-10T15:00:00Z',
    owner_display_name: 'Jeremy McDonald',
  },
  {
    id: 'cal_4',
    draft_id: 'draft_2',
    title: 'DSCR Investor Carousel',
    channel: 'Instagram',
    status: 'Draft',
    scheduled_for: '2026-06-05T17:00:00Z',
    owner_display_name: 'Jeremy McDonald',
  },
  {
    id: 'cal_5',
    draft_id: 'draft_1',
    title: 'Closing Costs Honestly — Educational',
    channel: 'Instagram',
    status: 'Scheduled',
    scheduled_for: '2026-06-07T16:30:00Z',
    owner_display_name: 'Jeremy McDonald',
  },
  {
    id: 'cal_6',
    draft_id: 'draft_1',
    title: 'Realtor Partner Spotlight',
    channel: 'LinkedIn',
    status: 'Approved',
    scheduled_for: '2026-06-08T12:00:00Z',
    owner_display_name: 'Jeremy McDonald',
  },
  {
    id: 'cal_7',
    draft_id: 'draft_2',
    title: 'First-Time Buyer Roadmap (Email)',
    channel: 'Email',
    status: 'Published',
    scheduled_for: '2026-05-15T14:00:00Z',
    owner_display_name: 'Jeremy McDonald',
  },
];

// --- Shared team library -------------------------------------------------

export const sharedTeamAssets: SharedTeamAsset[] = [
  {
    id: 'shared_1',
    kind: 'template',
    title: 'VA Loan Zero-Down Reel (master)',
    description: 'Team-wide approved VA reel template — drop in your face / your bio.',
    shared_by_display_name: 'Marketing',
    shared_at: '2026-04-12T00:00:00Z',
    preview_color: 'navy',
  },
  {
    id: 'shared_2',
    kind: 'caption',
    title: 'DSCR investor — three-myth opener',
    description: 'Pre-approved caption hook for DSCR carousels. Add your NMLS and adapt.',
    shared_by_display_name: 'Marketing',
    shared_at: '2026-04-20T00:00:00Z',
    preview_color: 'orange',
  },
  {
    id: 'shared_3',
    kind: 'brand-asset',
    title: 'Loan Factory wordmark — gold on navy',
    description: 'Master logo asset. Use on dark backgrounds only.',
    shared_by_display_name: 'Marketing',
    shared_at: '2026-03-01T00:00:00Z',
    preview_color: 'gold',
  },
  {
    id: 'shared_4',
    kind: 'brand-asset',
    title: 'Equal Housing Lender mark — SVG',
    description: 'Approved EHL mark. Required on every public mortgage asset.',
    shared_by_display_name: 'Marketing',
    shared_at: '2026-03-01T00:00:00Z',
    preview_color: 'navy',
  },
  {
    id: 'shared_5',
    kind: 'persona-file',
    title: 'Jeremy McDonald — Team voice doc',
    description: 'Tone, audience, do/dont list for the Legends team.',
    shared_by_display_name: 'Jeremy McDonald',
    shared_at: '2026-05-02T00:00:00Z',
    preview_color: 'navy',
  },
  {
    id: 'shared_6',
    kind: 'reference-image',
    title: 'Jacksonville waterfront B-roll set',
    description: 'Stock-license b-roll for local content. Approved for paid use.',
    shared_by_display_name: 'Marketing',
    shared_at: '2026-04-30T00:00:00Z',
    preview_color: 'gold',
  },
];

// --- Uploads (demo placeholders) ----------------------------------------

export const uploadedAssets: UploadedAsset[] = [
  {
    id: 'upload_1',
    owner_id: 'user_jeremy',
    bucket: 'profile-images',
    file_name: 'jeremy-headshot-2026.jpg',
    mime_type: 'image/jpeg',
    size_bytes: 482_311,
    uploaded_at: '2026-05-01T00:00:00Z',
    url: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=400&h=400&fit=crop&crop=face',
  },
];

// --- Settings ------------------------------------------------------------

export const defaultPlatformSettings: PlatformSettings = {
  demo_mode: true,
  team_sharing_enabled: true,
  notifications: {
    email_on_review_complete: true,
    email_on_team_shares: false,
    weekly_digest: true,
  },
  compliance_review: {
    require_marketing_approval: true,
    auto_attach_disclosures: true,
  },
  publishing_controls: {
    // Pilot guardrails — must stay false until external posting is approved.
    external_posting_enabled: false,
    email_sending_enabled: false,
    public_publish_requires_approval: true,
  },
};

// --- Builder templates (Team Leader picks one before profile inputs) ----

export const builderTemplates: BuilderTemplate[] = [
  {
    id: 'btpl_tl_modern',
    kind: 'team-leader-website',
    title: 'Modern Team Leader Website',
    description:
      'Headshot hero, bio, specialties, social proof, contact form. Built for Northeast Florida-style markets.',
    accent: 'orange',
    language: 'English',
    compliance_status: 'pre-approved',
    featured: true,
  },
  {
    id: 'btpl_tl_classic',
    kind: 'team-leader-website',
    title: 'Classic Team Leader Website',
    description:
      'Conservative layout — best for established LOs with a strong personal brand and long bio.',
    accent: 'black',
    language: 'English',
    compliance_status: 'pre-approved',
  },
  {
    id: 'btpl_landing_first_time',
    kind: 'landing-page',
    title: 'First-Time Buyer Landing Page',
    description:
      'Single-page landing focused on first-time buyer education and a contact opt-in. Plug into paid traffic.',
    accent: 'orange',
    language: 'English',
    compliance_status: 'pre-approved',
    featured: true,
  },
  {
    id: 'btpl_landing_va',
    kind: 'landing-page',
    title: 'VA Loan Landing Page',
    description: 'Veteran-focused landing page. Compliant VA language baked in.',
    accent: 'black',
    language: 'English',
    compliance_status: 'pre-approved',
  },
  {
    id: 'btpl_recruit_lo',
    kind: 'recruiting-page',
    title: 'LO Recruiting Page',
    description:
      'Why-join page for recruiting Loan Officers into your Team Leader group. Wholesale broker positioning.',
    accent: 'orange',
    language: 'English',
    compliance_status: 'pre-approved',
  },
  {
    id: 'btpl_realtor_partner',
    kind: 'realtor-partner-page',
    title: 'Realtor Partner Co-Branded Page',
    description:
      'Co-branded Realtor partnership page with workshop schedule + dual contact form.',
    accent: 'black',
    language: 'English',
    compliance_status: 'needs-personalization',
  },
  {
    id: 'btpl_consumer_ed',
    kind: 'consumer-education-page',
    title: 'Consumer Education Hub',
    description: 'Multi-section education page covering FHA, VA, conventional, and DSCR basics.',
    accent: 'gray',
    language: 'English',
    compliance_status: 'pre-approved',
  },
  {
    id: 'btpl_funnel_workshop',
    kind: 'funnel-page',
    title: 'Saturday Workshop Funnel',
    description:
      'Open-house-style funnel — RSVP page + reminder + follow-up. Designed for co-marketing with a Realtor.',
    accent: 'orange',
    language: 'English',
    compliance_status: 'needs-personalization',
    featured: true,
  },
  {
    id: 'btpl_es_first_time',
    kind: 'spanish-language-page',
    title: 'Primera Vivienda — Página en Español',
    description:
      'Spanish-language first-time-buyer page. Compliant copy reviewed for Spanish-speaking markets.',
    accent: 'orange',
    language: 'Spanish',
    compliance_status: 'pre-approved',
  },
  {
    id: 'btpl_investor_dscr',
    kind: 'investor-dscr-page',
    title: 'DSCR Investor Landing Page',
    description:
      'Single-page DSCR landing for portfolio builders. Qualifies on rental income — no personal DTI.',
    accent: 'black',
    language: 'English',
    compliance_status: 'pre-approved',
  },
];

// --- Submission audit trail (admin) -------------------------------------

export const initialAuditEvents: AuditEvent[] = [
  {
    id: 'evt_1',
    submission_id: '5',
    at: '2026-05-18T09:00:00Z',
    actor: 'Ana Martinez',
    action: 'Created',
  },
  {
    id: 'evt_2',
    submission_id: '5',
    at: '2026-05-19T15:24:00Z',
    actor: 'Ana Martinez',
    action: 'Submitted',
  },
  {
    id: 'evt_3',
    submission_id: '6',
    at: '2026-05-19T11:10:00Z',
    actor: 'David Kim',
    action: 'Created',
  },
];
