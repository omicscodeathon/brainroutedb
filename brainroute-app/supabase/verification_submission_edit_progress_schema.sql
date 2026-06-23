-- BrainRoute verification submission edit/progress update.
-- Paste this into the Supabase SQL editor after the base verification_submissions
-- table and the prior verification_submission_privacy_schema.sql changes exist.

alter table public.verification_submissions
  add column if not exists user_id uuid references auth.users(id) on delete set null;

alter table public.verification_submissions
  add column if not exists is_public boolean default false;

alter table public.verification_submissions
  add column if not exists molecule_information text;

alter table public.verification_submissions
  add column if not exists progress_status text;

alter table public.verification_submissions
  add column if not exists updated_at timestamptz default now();

update public.verification_submissions
set progress_status = case
  when coalesce(verified_by_admin, false) = true then 'accepted'
  else 'submitted'
end
where progress_status is null or progress_status = '';

alter table public.verification_submissions
  alter column progress_status set default 'submitted';

alter table public.verification_submissions
  alter column progress_status set not null;

do $$
begin
  if not exists (
    select 1
    from pg_constraint
    where conname = 'verification_submissions_progress_status_check'
      and conrelid = 'public.verification_submissions'::regclass
  ) then
    alter table public.verification_submissions
      add constraint verification_submissions_progress_status_check
      check (
        progress_status in (
          'submitted',
          'in_review',
          'accepted',
          'denied',
          'more_information_requested'
        )
      );
  end if;
end $$;

create index if not exists idx_verification_submissions_progress_status
on public.verification_submissions(progress_status);

create index if not exists idx_verification_submissions_user_progress
on public.verification_submissions(user_id, progress_status);

alter table public.verification_submissions enable row level security;

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

drop policy if exists "verification_submissions_update_own" on public.verification_submissions;
create policy "verification_submissions_update_own"
on public.verification_submissions for update
to authenticated
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

revoke insert, update, delete on public.verification_submissions from anon;
revoke insert, update, delete on public.verification_submissions from authenticated;

grant select on public.verification_submissions to anon;
grant select on public.verification_submissions to authenticated;

grant insert (
  molecule_id,
  molecule_name,
  smiles,
  molecule_information,
  paper_doi,
  lab_name,
  institution_name,
  experiment_description,
  experiment_data,
  technique_used,
  permeability_result,
  file_urls,
  submitted_by,
  user_id,
  is_public
) on public.verification_submissions to authenticated;

grant update (
  molecule_id,
  molecule_name,
  smiles,
  molecule_information,
  paper_doi,
  lab_name,
  institution_name,
  experiment_description,
  experiment_data,
  technique_used,
  permeability_result,
  file_urls,
  submitted_by,
  is_public,
  updated_at
) on public.verification_submissions to authenticated;
