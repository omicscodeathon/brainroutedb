-- BrainRoute verification submission privacy update.
-- Paste this into the Supabase SQL editor after the base verification_submissions
-- table already exists.

alter table public.verification_submissions
  add column if not exists user_id uuid references auth.users(id) on delete set null;

alter table public.verification_submissions
  add column if not exists is_public boolean;

-- Existing submissions were previously visible publicly, so keep that behavior
-- unless a row already has an explicit value.
update public.verification_submissions
set is_public = true
where is_public is null;

alter table public.verification_submissions
  alter column is_public set default false;

alter table public.verification_submissions
  alter column is_public set not null;

alter table public.verification_submissions enable row level security;

create index if not exists idx_verification_submissions_user_id
on public.verification_submissions(user_id);

create index if not exists idx_verification_submissions_is_public
on public.verification_submissions(is_public);

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
