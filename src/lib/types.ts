export type TeamLeaderStatus = 'draft' | 'pending_review' | 'approved' | 'published';

export interface TeamLeader {
  id: string;
  slug: string;
  status: TeamLeaderStatus;
  full_name: string;
  nmls_number: string;
  email: string;
  phone?: string;
  headshot_url?: string;
  bio: string;
  service_areas: string[];
  languages: string[];
  specialties: string[];
  google_review_url?: string;
  zillow_review_url?: string;
  additional_review_url?: string;
  template_id: string;
  marketing_notes?: string;
  approved_by?: string;
  approved_at?: string;
  published_url?: string;
  created_at: string;
  updated_at: string;
}

export interface BuilderFormData {
  full_name: string;
  nmls_number: string;
  email: string;
  phone: string;
  headshot_url: string;
  bio: string;
  service_areas: string[];
  languages: string[];
  specialties: string[];
  google_review_url: string;
  zillow_review_url: string;
  additional_review_url: string;
}
