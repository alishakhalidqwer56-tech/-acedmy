-- =========================================================================
-- GIRLS ACADEMY - PHASE 2 AUTHENTICATION & PROFILES TRIGGER MIGRATION
-- =========================================================================

-- Function to handle new user profile creation on auth.users insert
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, full_name, email, role)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'full_name', 'New User'),
    new.email,
    coalesce((new.raw_user_meta_data->>'role')::user_role, 'student')
  );
  return new;
end;
$$ language plpgsql security definer;

-- Trigger: auto-create profile on signup
drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- Ensure profiles table has RLS enabled
alter table public.profiles enable row level security;

-- Drop existing overlapping policies if any
drop policy if exists "Users can view own profile" on public.profiles;
drop policy if exists "Users can update own profile" on public.profiles;
drop policy if exists "Admin can view all profiles" on public.profiles;

-- 1. Users can read own profile
create policy "Users can view own profile"
  on public.profiles for select
  using (auth.uid() = id);

-- 2. Users can update own profile
create policy "Users can update own profile"
  on public.profiles for update
  using (auth.uid() = id);

-- 3. Admin can view and manage all profiles
create policy "Admin can view all profiles"
  on public.profiles for all
  using (
    exists (
      select 1 from public.profiles
      where id = auth.uid() and role = 'admin'
    )
  );
