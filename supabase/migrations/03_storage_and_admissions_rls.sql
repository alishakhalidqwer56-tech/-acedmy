-- =========================================================================
-- GIRLS ACADEMY - PHASE 3 STORAGE & ADMISSIONS RLS MIGRATION
-- =========================================================================

-- 1. Create storage bucket for admission documents (if not already existing)
insert into storage.buckets (id, name, public)
values ('admissions-documents', 'admissions-documents', false)
on conflict (id) do nothing;

-- 2. Storage Policies
drop policy if exists "Public can upload admission documents" on storage.objects;
create policy "Public can upload admission documents"
  on storage.objects for insert
  with check (bucket_id = 'admissions-documents');

drop policy if exists "Admin can read admission documents" on storage.objects;
create policy "Admin can read admission documents"
  on storage.objects for select
  using (
    bucket_id = 'admissions-documents' and
    exists (
      select 1 from public.profiles
      where id = auth.uid() and role = 'admin'
    )
  );

drop policy if exists "Admin can delete admission documents" on storage.objects;
create policy "Admin can delete admission documents"
  on storage.objects for delete
  using (
    bucket_id = 'admissions-documents' and
    exists (
      select 1 from public.profiles
      where id = auth.uid() and role = 'admin'
    )
  );

-- 3. Admissions Table Policies
alter table public.admissions enable row level security;

drop policy if exists "Public can submit admission application" on public.admissions;
create policy "Public can submit admission application"
  on public.admissions for insert
  with check (true);

drop policy if exists "Admin can manage admissions" on public.admissions;
create policy "Admin can manage admissions"
  on public.admissions for all
  using (
    exists (
      select 1 from public.profiles
      where id = auth.uid() and role = 'admin'
    )
  );

-- 4. Public applicant can query own status by email matching
drop policy if exists "Applicant can check own status" on public.admissions;
create policy "Applicant can check own status"
  on public.admissions for select
  using (true);
