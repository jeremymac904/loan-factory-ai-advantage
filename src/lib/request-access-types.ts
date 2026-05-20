// Types for the /request-access intake workflow.
//
// Demo-mode contract: anything submitted lives in browser state until
// Supabase auth + the access_requests table land. The shape here is the
// contract a Phase 1 server action will conform to.

export type AccessRequestStatus =
  | 'new'
  | 'needs-info'
  | 'approved'
  | 'rejected'
  | 'workspace-created'
  | 'in-setup'
  | 'ready-for-review'
  | 'live'
  | 'archived';

export type RequesterRole =
  | 'Team Leader'
  | 'Group Leader'
  | 'Loan Officer'
  | 'Marketing'
  | 'Corporate Coach'
  | 'Other';

export type GroupType =
  | 'Solo LO'
  | 'Team'
  | 'Group'
  | 'Branch'
  | 'Corporate';

export interface AccessRequestInput {
  full_name: string;
  preferred_display_name: string;
  loan_factory_email: string;
  phone: string;
  nmls_number: string;
  licensed_states: string;
  current_role: RequesterRole | '';
  is_team_or_group_leader: boolean;
  corporate_coach?: string;
  team_name?: string;
  group_type: GroupType | '';
  primary_markets: string;
  languages_served: string;
  loan_focus_areas: string;
  expected_team_members: string;
  is_pilot_request: boolean;
  marketing_goals: string;
  current_website?: string;
  google_business_profile_url?: string;
  social_profile_links?: string;
  support_needs: string;
  notes?: string;
}

export interface AccessRequest extends AccessRequestInput {
  id: string;
  status: AccessRequestStatus;
  submitted_at: string;
  updated_at: string;
  reviewer?: string;
  reviewer_notes?: string;
}

export const APPROVAL_AUDIENCE = [
  'Jeremy McDonald',
  'Victoria',
  'Andre',
  'Marketing',
  'Duyen (or assigned Marketing reviewer)',
] as const;
