-- Loan Factory AI Advantage — Team Leader Profiles
-- Run this in the Supabase SQL editor or via `supabase db push`

create table if not exists team_leader_profiles (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz default now(),
  updated_at timestamptz default now(),
  slug text unique not null,
  status text not null default 'draft', -- draft | pending_review | approved | published
  full_name text not null,
  nmls_number text not null,
  email text,
  phone text,
  headshot_url text,
  bio text,
  service_areas text[],
  languages text[],
  specialties text[],
  google_review_url text,
  zillow_review_url text,
  additional_review_url text,
  template_id text default 'modern-professional',
  marketing_notes text,
  approved_by text,
  approved_at timestamptz,
  published_url text
);

-- Enable Row Level Security
alter table team_leader_profiles enable row level security;

-- Public can read only published profiles
create policy "Published profiles are public"
  on team_leader_profiles for select
  using (status = 'published');

-- Service role has full access (used by admin server routes)
create policy "Service role has full access"
  on team_leader_profiles for all
  using (auth.role() = 'service_role');

-- Helpful indexes
create index if not exists team_leader_profiles_status_idx
  on team_leader_profiles (status);

create index if not exists team_leader_profiles_slug_idx
  on team_leader_profiles (slug);

-- Auto-update updated_at on row updates
create or replace function set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

drop trigger if exists trg_team_leader_profiles_updated_at on team_leader_profiles;
create trigger trg_team_leader_profiles_updated_at
  before update on team_leader_profiles
  for each row execute function set_updated_at();
