create extension if not exists pgcrypto;

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text,
  full_name text,
  avatar_url text,
  role text default 'user',
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table if not exists public.user_prediction_runs (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  source_app text default 'brainroute_streamlit',
  input_mode text,
  batch_id uuid,
  molecule_name text,
  smiles text not null,
  canonical_smiles text,
  prediction_label text,
  prediction_probability double precision,
  confidence double precision,
  uncertainty double precision,
  model_name text,
  feature_set text,
  molecular_properties jsonb,
  model_outputs jsonb,
  raw_result jsonb,
  created_at timestamptz default now()
);

create table if not exists public.prediction_batches (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  source_app text default 'brainroute_streamlit',
  batch_name text,
  input_type text,
  total_molecules integer,
  successful_molecules integer,
  failed_molecules integer,
  summary_json jsonb,
  created_at timestamptz default now()
);

create table if not exists public.download_events (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete set null,
  download_type text not null,
  source_app text default 'brainroutedb',
  filter_state jsonb,
  record_count integer,
  created_at timestamptz default now()
);

create table if not exists public.auth_handoffs (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  code text unique not null,
  expires_at timestamptz not null,
  used_at timestamptz,
  created_at timestamptz default now()
);

alter table public.verification_submissions
  add column if not exists user_id uuid references auth.users(id) on delete set null;

alter table public.verification_submissions
  add column if not exists is_public boolean;

update public.verification_submissions
set is_public = true
where is_public is null;

alter table public.verification_submissions
  alter column is_public set default false;

alter table public.verification_submissions
  alter column is_public set not null;

alter table public.profiles enable row level security;
alter table public.user_prediction_runs enable row level security;
alter table public.prediction_batches enable row level security;
alter table public.download_events enable row level security;
alter table public.auth_handoffs enable row level security;
alter table public.verification_submissions enable row level security;

create index if not exists idx_verification_submissions_user_id
on public.verification_submissions(user_id);

create index if not exists idx_verification_submissions_is_public
on public.verification_submissions(is_public);

drop policy if exists "profiles_select_own" on public.profiles;
create policy "profiles_select_own"
on public.profiles for select
using (auth.uid() = id);

drop policy if exists "profiles_insert_own" on public.profiles;
create policy "profiles_insert_own"
on public.profiles for insert
with check (auth.uid() = id);

drop policy if exists "profiles_update_own" on public.profiles;
create policy "profiles_update_own"
on public.profiles for update
using (auth.uid() = id)
with check (auth.uid() = id);

drop policy if exists "prediction_runs_select_own" on public.user_prediction_runs;
create policy "prediction_runs_select_own"
on public.user_prediction_runs for select
using (auth.uid() = user_id);

drop policy if exists "prediction_runs_insert_own" on public.user_prediction_runs;
create policy "prediction_runs_insert_own"
on public.user_prediction_runs for insert
with check (auth.uid() = user_id);

drop policy if exists "prediction_batches_select_own" on public.prediction_batches;
create policy "prediction_batches_select_own"
on public.prediction_batches for select
using (auth.uid() = user_id);

drop policy if exists "prediction_batches_insert_own" on public.prediction_batches;
create policy "prediction_batches_insert_own"
on public.prediction_batches for insert
with check (auth.uid() = user_id);

drop policy if exists "download_events_select_own" on public.download_events;
create policy "download_events_select_own"
on public.download_events for select
using (auth.uid() = user_id);

drop policy if exists "download_events_insert_own" on public.download_events;
create policy "download_events_insert_own"
on public.download_events for insert
with check (auth.uid() = user_id);

drop policy if exists "auth_handoffs_select_own" on public.auth_handoffs;
create policy "auth_handoffs_select_own"
on public.auth_handoffs for select
using (auth.uid() = user_id);

drop policy if exists "auth_handoffs_insert_own" on public.auth_handoffs;
create policy "auth_handoffs_insert_own"
on public.auth_handoffs for insert
with check (auth.uid() = user_id);

drop policy if exists "auth_handoffs_update_own" on public.auth_handoffs;
create policy "auth_handoffs_update_own"
on public.auth_handoffs for update
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

drop policy if exists "verification_submissions_select_own" on public.verification_submissions;
drop policy if exists "verification_submissions_select_public_or_own" on public.verification_submissions;
create policy "verification_submissions_select_public_or_own"
on public.verification_submissions for select
to anon, authenticated
using (is_public = true or auth.uid() = user_id);

drop policy if exists "verification_submissions_insert_logged_in" on public.verification_submissions;
create policy "verification_submissions_insert_logged_in"
on public.verification_submissions for insert
to authenticated
with check (auth.uid() = user_id);

revoke insert, update, delete on public.verification_submissions from anon;
revoke update, delete on public.verification_submissions from authenticated;
grant select on public.verification_submissions to anon;
grant select, insert on public.verification_submissions to authenticated;
