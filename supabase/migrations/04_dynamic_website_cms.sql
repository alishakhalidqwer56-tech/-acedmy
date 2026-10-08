-- =========================================================================
-- GIRLS ACADEMY - FULLY DYNAMIC WEBSITE CMS SCHEMA
-- Run this SQL in Supabase SQL Editor to enable all dynamic website features
-- =========================================================================

-- 1. BANNERS TABLE
create table if not exists banners (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  subtitle text,
  image_url text,
  button_text text,
  button_link text,
  position integer default 0,
  is_active boolean default true,
  page text default 'home',
  created_at timestamptz default now()
);

-- 2. SOCIAL MEDIA ACCOUNTS TABLE
create table if not exists social_media (
  id uuid primary key default gen_random_uuid(),
  platform text not null,
  url text not null,
  icon text not null,
  followers_count text,
  is_active boolean default true,
  position integer default 0,
  created_at timestamptz default now()
);

-- 3. HERO SLIDES TABLE (homepage rotating banners)
create table if not exists hero_slides (
  id uuid primary key default gen_random_uuid(),
  heading text not null,
  subheading text,
  description text,
  image_url text,
  button1_text text,
  button1_link text,
  button2_text text,
  button2_link text,
  is_active boolean default true,
  position integer default 0,
  created_at timestamptz default now()
);

-- 4. CORE VALUES TABLE
create table if not exists core_values (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text,
  icon text,
  position integer default 0,
  is_active boolean default true
);

-- 5. ACHIEVEMENTS TABLE
create table if not exists achievements (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text,
  year text,
  icon text,
  is_active boolean default true,
  position integer default 0
);

-- 6. QUICK STATS TABLE
create table if not exists quick_stats (
  id uuid primary key default gen_random_uuid(),
  label text not null,
  value text not null,
  icon text,
  position integer default 0,
  is_active boolean default true
);

-- 7. ANNOUNCEMENTS TICKER TABLE
create table if not exists announcements (
  id uuid primary key default gen_random_uuid(),
  text text not null,
  link text,
  is_active boolean default true,
  expires_at timestamptz,
  created_at timestamptz default now()
);

-- 8. POPUP / MODAL ADS TABLE
create table if not exists popups (
  id uuid primary key default gen_random_uuid(),
  title text,
  message text,
  image_url text,
  button_text text,
  button_link text,
  is_active boolean default true,
  show_once boolean default true,
  created_at timestamptz default now()
);

-- 9. CAMPUS POSTERS & FLYERS TABLE
create table if not exists posters (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  category text not null default 'Admissions',
  image_url text not null,
  description text,
  event_date text,
  target_audience text,
  is_active boolean default true,
  display_order integer default 0,
  created_at timestamptz default now()
);

-- Enable RLS on all new tables
alter table banners enable row level security;
alter table social_media enable row level security;
alter table hero_slides enable row level security;
alter table core_values enable row level security;
alter table achievements enable row level security;
alter table quick_stats enable row level security;
alter table announcements enable row level security;
alter table popups enable row level security;
alter table posters enable row level security;

-- Public read policies
drop policy if exists "Public read posters" on posters;
create policy "Public read posters" 
  on posters for select using (is_active = true);

-- Public read policies
drop policy if exists "Public read banners" on banners;
create policy "Public read banners" 
  on banners for select using (is_active = true);

drop policy if exists "Public read social media" on social_media;
create policy "Public read social media" 
  on social_media for select using (is_active = true);

drop policy if exists "Public read hero slides" on hero_slides;
create policy "Public read hero slides" 
  on hero_slides for select using (is_active = true);

drop policy if exists "Public read core values" on core_values;
create policy "Public read core values" 
  on core_values for select using (is_active = true);

drop policy if exists "Public read achievements" on achievements;
create policy "Public read achievements" 
  on achievements for select using (is_active = true);

drop policy if exists "Public read quick stats" on quick_stats;
create policy "Public read quick stats" 
  on quick_stats for select using (is_active = true);

drop policy if exists "Public read announcements" on announcements;
create policy "Public read announcements" 
  on announcements for select using (is_active = true);

drop policy if exists "Public read popups" on popups;
create policy "Public read popups" 
  on popups for select using (is_active = true);

-- Admin full access policies
drop policy if exists "Admin manage banners" on banners;
create policy "Admin manage banners" 
  on banners for all using (
  exists (select 1 from profiles 
  where id = auth.uid() and role = 'admin'));

drop policy if exists "Admin manage social media" on social_media;
create policy "Admin manage social media" 
  on social_media for all using (
  exists (select 1 from profiles 
  where id = auth.uid() and role = 'admin'));

drop policy if exists "Admin manage hero slides" on hero_slides;
create policy "Admin manage hero slides" 
  on hero_slides for all using (
  exists (select 1 from profiles 
  where id = auth.uid() and role = 'admin'));

drop policy if exists "Admin manage core values" on core_values;
create policy "Admin manage core values" 
  on core_values for all using (
  exists (select 1 from profiles 
  where id = auth.uid() and role = 'admin'));

drop policy if exists "Admin manage achievements" on achievements;
create policy "Admin manage achievements" 
  on achievements for all using (
  exists (select 1 from profiles 
  where id = auth.uid() and role = 'admin'));

drop policy if exists "Admin manage quick stats" on quick_stats;
create policy "Admin manage quick stats" 
  on quick_stats for all using (
  exists (select 1 from profiles 
  where id = auth.uid() and role = 'admin'));

drop policy if exists "Admin manage announcements" on announcements;
create policy "Admin manage announcements" 
  on announcements for all using (
  exists (select 1 from profiles 
  where id = auth.uid() and role = 'admin'));

drop policy if exists "Admin manage popups" on popups;
create policy "Admin manage popups" 
  on popups for all using (
  exists (select 1 from profiles 
  where id = auth.uid() and role = 'admin'));

-- Storage bucket for banners
insert into storage.buckets (id, name, public) 
  values ('banners', 'banners', true)
  on conflict (id) do nothing;

drop policy if exists "Public read banners storage" on storage.objects;
create policy "Public read banners storage" 
  on storage.objects for select 
  using (bucket_id = 'banners');

drop policy if exists "Admin upload banners storage" on storage.objects;
create policy "Admin upload banners storage" 
  on storage.objects for insert 
  with check (bucket_id = 'banners' and
  exists (select 1 from profiles 
  where id = auth.uid() and role = 'admin'));

-- Insert default data
insert into quick_stats 
  (label, value, icon, position) values
('Total Students', '1,250+', 'users', 1),
('Programs Offered', '10+', 'book', 2),
('Qualified Teachers', '48+', 'graduation-cap', 3),
('Years of Excellence', '18+', 'award', 4)
on conflict do nothing;

insert into social_media 
  (platform, url, icon, followers_count, position) values
('Facebook', 'https://facebook.com/girlsacademy', 'facebook', '5,200', 1),
('Instagram', 'https://instagram.com/girlsacademy', 'instagram', '3,800', 2),
('YouTube', 'https://youtube.com/girlsacademy', 'youtube', '2,100', 3),
('WhatsApp', 'https://wa.me/923004861234', 'message-circle', 'Chat Now', 4)
on conflict do nothing;

insert into hero_slides 
  (heading, subheading, button1_text, button1_link, button2_text, button2_link, position) values
('Welcome to Girls Academy',
 'Quality Education for Girls in Islamabad, Pakistan',
 'Apply Now', '/admissions',
 'Learn More', '/about', 1),
('Admissions Open 2026-2027',
 'Limited seats available — Enroll today',
 'Apply Now', '/admissions',
 'View Programs', '/courses', 2),
('BISE Results 2025 — 95% Pass Rate',
 'Our students achieve excellence every year',
 'View Programs', '/courses',
 'Contact Us', '/contact', 3)
on conflict do nothing;

insert into announcements (text, is_active) values
('Admissions Open for Session 2026-2027 — Limited Seats Available!', true),
('BISE Results 2025: 95% Pass Rate — Congratulations to all students!', true),
('Last date for admissions: 31 March 2026', true),
('Monthly fee due by 10th of every month', true)
on conflict do nothing;

insert into core_values 
  (title, description, icon, position) values
('Academic Excellence', 
 'We maintain the highest standards of education with BISE affiliated curriculum', 
 'award', 1),
('Islamic Values', 
 'Nurturing students with strong moral and character foundation', 
 'heart', 2),
('Safe Environment', 
 'A secure, disciplined and supportive environment exclusively for girls', 
 'shield', 3),
('Modern Facilities', 
 'State-of-the-art labs, library, and digital classrooms', 
 'monitor', 4)
on conflict do nothing;

insert into achievements
  (title, description, year, icon, position) values
('BISE Board Top Positions', 'Multiple 1st, 2nd, and 3rd positions in Federal & BISE Islamabad board exams.', '2025', 'trophy', 1),
('100% Matric Science Pass Rate', 'All students scored A+ and A grades in Matric Science examination.', '2025', 'award', 2),
('National STEM & Robotics Award', 'First place in National Inter-College Girls Science & Robotics Exhibition.', '2024', 'star', 3),
('Excellence in Female Leadership', 'Recognized by Federal Directorate of Education for holistic character mentoring.', '2023', 'medal', 4)
on conflict do nothing;

insert into banners
  (title, subtitle, image_url, button_text, button_link, position, is_active, page) values
('Admissions Open for Academic Session 2026-2027',
 'Secure your seat today in Islamabad premier college for women. Scholarships available for high achievers.',
 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=1600&q=80',
 'Apply for Admission', '/admissions', 1, true, 'home')
on conflict do nothing;

insert into popups
  (title, message, image_url, button_text, button_link, is_active, show_once) values
('Admissions Open 2026-2027',
 'Online admissions are now open for Nursery to Class 10 and FSc / ICS / I.Com. Early bird merit scholarships available!',
 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=800&q=80',
 'Apply Online Now', '/admissions', true, true)
on conflict do nothing;
