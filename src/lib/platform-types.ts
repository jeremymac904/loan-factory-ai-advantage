// Types for the Ally-inspired marketing platform (the (platform) route group).
// These are intentionally separated from src/lib/types.ts so the public-facing
// Team Leader site stays narrowly typed around its own concerns.
//
// Phase 1 will swap mock data for Supabase reads — these shapes are the
// contract the persistence layer must conform to.

export type LoState =
  | 'AZ'
  | 'CA'
  | 'FL'
  | 'GA'
  | 'MA'
  | 'NJ'
  | 'NY'
  | 'RI'
  | 'TX'
  | 'WA'
  | 'OR'
  | 'CO'
  | 'NV'
  | 'NC'
  | 'SC'
  | 'OH';

export type ComplianceSeverity = 'info' | 'warning' | 'blocking';

export type TemplateCategory =
  | 'Recruiting'
  | 'Realtor Partner'
  | 'Consumer Education'
  | 'First Time Buyer'
  | 'VA Loans'
  | 'FHA Loans'
  | 'DSCR and Investor'
  | 'Spanish Content'
  | 'Team Leader Marketing';

export type TemplateFormat =
  | 'Reel'
  | 'Static Post'
  | 'Carousel'
  | 'Story'
  | 'Email'
  | 'Landing Page'
  | 'Flyer'
  | 'Video Script';

export type ContentChannel =
  | 'Instagram'
  | 'Facebook'
  | 'LinkedIn'
  | 'TikTok'
  | 'YouTube'
  | 'Email'
  | 'Website'
  | 'Google Business Profile';

export type ContentStatus =
  | 'Draft'
  | 'Needs Review'
  | 'Scheduled'
  | 'Approved'
  | 'Published'
  | 'Rejected';

// --- Profile -------------------------------------------------------------

export interface PlatformUserProfile {
  id: string;
  // Identity
  full_name: string;
  preferred_display_name: string;
  nmls_number: string;
  loan_factory_email: string;
  phone: string;
  personal_website?: string;
  // Licensure & geography
  licensed_states: LoState[];
  service_areas: string[];
  languages: string[];
  specialties: string[];
  // Bio
  short_bio: string;
  long_bio: string;
  // Team
  team_name?: string;
  team_role?: 'Team Leader' | 'Loan Officer' | 'Assistant';
  // AI / personalization
  persona_summary?: string;
  compliance_notes?: string;
  // Assets — when Supabase Storage is wired, these become signed URLs.
  profile_image_url?: string;
  ai_reference_image_url?: string;
  persona_document_url?: string;
  brand_voice_document_url?: string;
  team_logo_url?: string;
  compliance_approval_document_url?: string;
  // Computed-ish
  profile_completion_pct: number;
  // Bookkeeping
  created_at: string;
  updated_at: string;
}

// --- Templates -----------------------------------------------------------

export interface MarketingTemplate {
  id: string;
  title: string;
  category: TemplateCategory;
  format: TemplateFormat;
  description: string;
  channels: ContentChannel[];
  thumbnail_color: 'navy' | 'gold' | 'orange' | 'green' | 'purple';
  compliance_status: 'pre-approved' | 'needs-personalization' | 'state-restricted';
  state_restrictions?: LoState[];
  use_count: number;
  shared_with_team: boolean;
  created_at: string;
}

// --- Content drafts ------------------------------------------------------

export interface ContentDraft {
  id: string;
  owner_id: string;
  template_id?: string;
  title: string;
  campaign_goal: string;
  audience: string;
  channels: ContentChannel[];
  caption: string;
  visual_notes: string;
  compliance_footer: string;
  status: ContentStatus;
  scheduled_for?: string; // ISO
  compliance_checks?: ComplianceCheckResult[];
  created_at: string;
  updated_at: string;
}

// --- Calendar ------------------------------------------------------------

export interface ContentCalendarItem {
  id: string;
  draft_id: string;
  title: string;
  channel: ContentChannel;
  status: ContentStatus;
  scheduled_for: string; // ISO date with time
  owner_display_name: string;
}

// --- Team library --------------------------------------------------------

export type SharedAssetKind =
  | 'template'
  | 'caption'
  | 'brand-asset'
  | 'persona-file'
  | 'reference-image';

export interface SharedTeamAsset {
  id: string;
  kind: SharedAssetKind;
  title: string;
  description: string;
  shared_by_display_name: string;
  shared_at: string;
  preview_color?: 'navy' | 'gold' | 'orange';
  // For images / docs once Storage is wired
  asset_url?: string;
}

// --- Uploads -------------------------------------------------------------

export type UploadBucket =
  | 'profile-images'
  | 'reference-images'
  | 'persona-documents'
  | 'brand-assets'
  | 'compliance-documents';

export interface UploadedAsset {
  id: string;
  owner_id: string;
  bucket: UploadBucket;
  file_name: string;
  mime_type: string;
  size_bytes: number;
  uploaded_at: string;
  // Signed URL when Storage is wired; placeholder string in demo mode.
  url?: string;
}

// --- Compliance ----------------------------------------------------------

export type ComplianceRuleId =
  | 'required-disclosures'
  | 'company-nmls'
  | 'lo-nmls'
  | 'equal-housing'
  | 'rate-apr-parity'
  | 'prohibited-claims'
  | 'nj-licensing-disclosure'
  | 'ri-licensing-disclosure'
  | 'ma-rate-disclosure'
  | 'tx-disclosure'
  | 'az-license-display'
  | 'company-email-required'
  | 'team-name-restriction'
  | 'best-price-guarantee-tnc';

export interface ComplianceCheckResult {
  ruleId: ComplianceRuleId;
  rule: string;
  severity: ComplianceSeverity;
  message: string;
  suggestedFix?: string;
  /** When `true`, the user cannot submit until resolved. */
  blocking?: boolean;
}

// --- Dashboard stats -----------------------------------------------------

export interface DashboardStats {
  profile_completion_pct: number;
  templates_available: number;
  draft_posts: number;
  pending_compliance_review: number;
  published_team_assets: number;
}

// --- Settings ------------------------------------------------------------

export interface PlatformSettings {
  demo_mode: boolean;
  team_sharing_enabled: boolean;
  notifications: {
    email_on_review_complete: boolean;
    email_on_team_shares: boolean;
    weekly_digest: boolean;
  };
  compliance_review: {
    require_marketing_approval: boolean;
    auto_attach_disclosures: boolean;
  };
  publishing_controls: {
    /** External posting (FB/IG/LinkedIn/TikTok APIs) — must default to false during pilot. */
    external_posting_enabled: boolean;
    /** Outbound email sending — must default to false during pilot. */
    email_sending_enabled: boolean;
    /** Public publish requires Marketing approval. */
    public_publish_requires_approval: boolean;
  };
}
