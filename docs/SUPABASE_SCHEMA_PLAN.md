# Supabase schema plan

The work that ends demo mode. The current schema is in [`supabase/schema.sql`](../supabase/schema.sql) and seed data in [`supabase/seed.sql`](../supabase/seed.sql). This document is the **plan** — what shape the data layer needs to take to support the full pilot workflow.

---

## Current state (Phase 0)

One table:

```sql
team_leader_profiles (
  id            uuid primary key,
  created_at    timestamptz,
  updated_at    timestamptz,
  slug          text unique,
  status        text default 'draft',   -- draft | pending_review | approved | published
  full_name     text,
  nmls_number   text,
  email         text,
  phone         text,
  headshot_url  text,
  bio           text,
  service_areas text[],
  languages     text[],
  specialties   text[],
  google_review_url      text,
  zillow_review_url      text,
  additional_review_url  text,
  template_id   text default 'modern-professional',
  marketing_notes text,
  approved_by   text,
  approved_at   timestamptz,
  published_url text
)
```

RLS:
- `Published profiles are public` — anon can `select` where `status = 'published'`.
- `Service role has full access` — service role can do anything.

This is enough to back `/showcase`, `/site/[slug]`, and a basic admin loop. It is not enough for the full pilot.

---

## Phase 1 additions (persistence cutover)

When we wire the builder and admin to Supabase, we need:

### `submission_events` (audit log)

Append-only event log for every state transition on a Team Leader profile. Required by Marketing to defend approvals to compliance.

```sql
create table submission_events (
  id           uuid primary key default gen_random_uuid(),
  created_at   timestamptz default now(),
  profile_id   uuid references team_leader_profiles(id) on delete cascade,
  event_type   text not null,    -- submitted | approved | revised | published | unpublished
  actor        text,             -- email of the actor (Team Leader or Marketing reviewer)
  notes        text,
  payload      jsonb             -- snapshot of the row at event time
);

create index submission_events_profile_idx on submission_events (profile_id, created_at desc);
alter table submission_events enable row level security;
create policy "Service role only" on submission_events for all
  using (auth.role() = 'service_role');
```

### Slug generation

The builder needs server-side slug generation with collision handling. Function:

```sql
create or replace function generate_team_leader_slug(p_full_name text)
returns text language plpgsql as $$
declare
  base_slug text;
  candidate text;
  i int := 0;
begin
  base_slug := lower(regexp_replace(p_full_name, '[^a-zA-Z0-9]+', '-', 'g'));
  base_slug := trim(both '-' from base_slug);
  candidate := base_slug;
  while exists (select 1 from team_leader_profiles where slug = candidate) loop
    i := i + 1;
    candidate := base_slug || '-' || i;
  end loop;
  return candidate;
end;
$$;
```

Call from the server action when inserting a new profile if the Team Leader did not specify one.

### `published_at` column

Separate from `approved_at` because approval and publish are distinct events (TERA may need 24h to wire DNS).

```sql
alter table team_leader_profiles
  add column if not exists published_at timestamptz,
  add column if not exists published_by text;
```

---

## Phase 2 additions (review loop)

### `contact_submissions` (leads from `/site/[slug]`)

```sql
create table contact_submissions (
  id           uuid primary key default gen_random_uuid(),
  created_at   timestamptz default now(),
  profile_id   uuid references team_leader_profiles(id) on delete cascade,
  first_name   text,
  last_name    text,
  email        text,
  phone        text,
  loan_type    text,
  message      text,
  source_url   text,
  user_agent   text,
  ip_hash      text          -- for rate limiting / abuse detection, never raw IP
);

create index contact_submissions_profile_idx on contact_submissions (profile_id, created_at desc);
alter table contact_submissions enable row level security;
create policy "Service role only" on contact_submissions for all
  using (auth.role() = 'service_role');
```

Borrower data is PII. Reads always go through a server route with the Team Leader's authenticated session — never client-side.

### Storage bucket for real headshots

```
bucket: headshots
policy: read public, write service-role only
path:   {profile_id}/{filename}
```

Replace the Unsplash placeholders in `mock-data.ts` only after a real headshot is uploaded to this bucket.

### Marketing reviewer accounts

Supabase auth with email/password or magic link. `/admin` gates on a row in:

```sql
create table marketing_reviewers (
  user_id uuid primary key references auth.users on delete cascade,
  role    text default 'reviewer',   -- reviewer | admin
  created_at timestamptz default now()
);
```

---

## Phase 3 additions (pilot launch)

### `site_analytics_daily` (rolled-up page views per TL site)

Avoid pulling raw GA every request. Materialized view or a nightly job that summarizes:

```sql
create table site_analytics_daily (
  profile_id   uuid references team_leader_profiles(id) on delete cascade,
  date         date,
  page_views   int,
  contact_form_submits int,
  primary key (profile_id, date)
);
```

---

## RLS posture

The whole RLS design is built around three principals:

| Principal | Reads | Writes |
| --- | --- | --- |
| **anon** (public visitor) | `team_leader_profiles where status='published'` | none |
| **authenticated** (Marketing reviewer) | their own `marketing_reviewers` row, all profiles | none directly — all writes go through service-role server routes |
| **service_role** (server actions) | everything | everything |

Writes from the browser must always go through a Next.js server action or route handler that calls Supabase with the service role key from `SUPABASE_SERVICE_ROLE_KEY`. **Never** expose the service role key to the browser.

---

## Migration discipline

- Every schema change ships as an additive migration file in `supabase/migrations/`. Never edit `schema.sql` in place after Phase 1 launch — that file becomes the historical baseline.
- New columns are nullable or have defaults so existing rows do not break.
- Destructive changes (drop column, change type) require an explicit pilot pause + Marketing approval.

---

## Open questions for Marketing

These need answers before Phase 2 ships:

1. Should the contact form on `/site/[slug]` also CC Marketing on every lead, or only the Team Leader?
2. Retention policy for `contact_submissions` — keep forever, or auto-purge after N days?
3. Who has admin (vs. reviewer) role in `marketing_reviewers`?
4. Per-state licensing display: is the Team Leader's full state list authoritative from NMLS, or do they self-enter it?
