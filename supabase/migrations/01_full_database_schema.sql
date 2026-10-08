-- =========================================================================
-- GIRLS ACADEMY - COMPLETE PRODUCTION DATABASE SCHEMA (ALL TABLES & RLS)
-- =========================================================================

-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- 1. ENUMS
do $$ begin
  create type user_role as enum ('admin', 'teacher', 'student', 'parent');
exception
  when duplicate_object then null;
end $$;

do $$ begin
  create type attendance_status as enum ('present', 'absent', 'late', 'leave');
exception
  when duplicate_object then null;
end $$;

do $$ begin
  create type admission_status as enum ('pending', 'approved', 'rejected');
exception
  when duplicate_object then null;
end $$;

do $$ begin
  create type post_status as enum ('draft', 'pending', 'published');
end $$;

-- 2. PROFILES (linked to Supabase Auth)
create table if not exists profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text not null,
  email text unique not null,
  role user_role not null,
  photo_url text,
  phone text,
  is_active boolean default true,
  created_at timestamptz default now()
);

-- 3. STUDENTS
create table if not exists students (
  id uuid primary key default gen_random_uuid(),
  profile_id uuid references profiles(id) on delete cascade,
  roll_number text unique,
  date_of_birth date,
  address text,
  created_at timestamptz default now()
);

-- 4. PARENTS
create table if not exists parents (
  id uuid primary key default gen_random_uuid(),
  profile_id uuid references profiles(id) on delete cascade,
  occupation text,
  created_at timestamptz default now()
);

-- 5. PARENT-STUDENT LINK (one parent can have multiple children)
create table if not exists parent_students (
  id uuid primary key default gen_random_uuid(),
  parent_id uuid references parents(id) on delete cascade,
  student_id uuid references students(id) on delete cascade,
  unique(parent_id, student_id)
);

-- 6. TEACHERS
create table if not exists teachers (
  id uuid primary key default gen_random_uuid(),
  profile_id uuid references profiles(id) on delete cascade,
  qualification text,
  experience text,
  specialization text,
  created_at timestamptz default now()
);

-- 7. COURSES
create table if not exists courses (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text,
  level text,
  category text,
  duration text,
  schedule text,
  fee_info text,
  instructor_name text,
  thumbnail_url text,
  is_active boolean default true,
  created_at timestamptz default now()
);

-- 8. SUBJECTS
create table if not exists subjects (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  course_id uuid references courses(id) on delete cascade,
  created_at timestamptz default now()
);

-- 9. ACADEMIC TERMS
create table if not exists terms (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  academic_year text not null,
  start_date date,
  end_date date,
  is_active boolean default true
);

-- 10. CLASSES
create table if not exists classes (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  course_id uuid references courses(id),
  term_id uuid references terms(id),
  created_at timestamptz default now()
);

-- 11. CLASS-TEACHER-SUBJECT ASSIGNMENT
create table if not exists class_subjects (
  id uuid primary key default gen_random_uuid(),
  class_id uuid references classes(id) on delete cascade,
  subject_id uuid references subjects(id) on delete cascade,
  teacher_id uuid references teachers(id),
  unique(class_id, subject_id)
);

-- 12. CLASS ENROLLMENTS
create table if not exists class_enrollments (
  id uuid primary key default gen_random_uuid(),
  class_id uuid references classes(id) on delete cascade,
  student_id uuid references students(id) on delete cascade,
  enrolled_at timestamptz default now(),
  unique(class_id, student_id)
);

-- 13. VIDEO LECTURES
create table if not exists video_lectures (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text,
  video_url text not null,
  course_id uuid references courses(id),
  subject_id uuid references subjects(id),
  uploaded_by uuid references teachers(id),
  created_at timestamptz default now()
);

-- 14. ATTENDANCE
create table if not exists attendance (
  id uuid primary key default gen_random_uuid(),
  student_id uuid references students(id) on delete cascade,
  class_id uuid references classes(id),
  date date not null,
  status attendance_status not null,
  marked_by uuid references teachers(id),
  created_at timestamptz default now(),
  unique(student_id, class_id, date)
);

-- 15. GRADING SCALE
create table if not exists grading_scales (
  id uuid primary key default gen_random_uuid(),
  min_marks integer not null,
  max_marks integer not null,
  grade text not null,
  gpa numeric(3,2)
);

-- 16. RESULTS
create table if not exists results (
  id uuid primary key default gen_random_uuid(),
  student_id uuid references students(id) on delete cascade,
  subject_id uuid references subjects(id),
  term_id uuid references terms(id),
  marks_obtained numeric(5,2),
  total_marks numeric(5,2),
  grade text,
  entered_by uuid references teachers(id),
  created_at timestamptz default now(),
  unique(student_id, subject_id, term_id)
);

-- 17. ADMISSIONS
create table if not exists admissions (
  id uuid primary key default gen_random_uuid(),
  student_name text not null,
  date_of_birth date,
  gender text,
  email text not null,
  phone text,
  address text,
  parent_name text,
  parent_phone text,
  program_applied text,
  previous_school text,
  documents_url text[],
  status admission_status default 'pending',
  admin_notes text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- 18. EVENTS
create table if not exists events (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text,
  event_date timestamptz,
  image_url text,
  is_upcoming boolean default true,
  created_at timestamptz default now()
);

-- 19. BLOG CATEGORIES
create table if not exists blog_categories (
  id uuid primary key default gen_random_uuid(),
  name text unique not null,
  slug text unique not null
);

-- 20. BLOG POSTS
create table if not exists blog_posts (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  slug text unique not null,
  excerpt text,
  content text,
  featured_image_url text,
  author_id uuid references profiles(id),
  category_id uuid references blog_categories(id),
  tags text[],
  status post_status default 'draft',
  published_at timestamptz,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- 21. NOTIFICATIONS
create table if not exists notifications (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  message text not null,
  recipient_role user_role,
  recipient_id uuid references profiles(id),
  is_read boolean default false,
  created_at timestamptz default now()
);

-- 22. FEE STRUCTURE
create table if not exists fee_structure (
  id uuid primary key default gen_random_uuid(),
  program text not null,
  class_name text,
  amount numeric(10,2) not null,
  frequency text,
  description text,
  created_at timestamptz default now()
);

-- 23. GALLERY
create table if not exists gallery (
  id uuid primary key default gen_random_uuid(),
  title text,
  media_url text not null,
  media_type text default 'image',
  created_at timestamptz default now()
);

-- 24. SITE SETTINGS
create table if not exists site_settings (
  id uuid primary key default gen_random_uuid(),
  key text unique not null,
  value text,
  updated_at timestamptz default now()
);

-- =========================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- =========================================================================

alter table profiles enable row level security;
alter table students enable row level security;
alter table parents enable row level security;
alter table parent_students enable row level security;
alter table teachers enable row level security;
alter table courses enable row level security;
alter table subjects enable row level security;
alter table terms enable row level security;
alter table classes enable row level security;
alter table class_subjects enable row level security;
alter table class_enrollments enable row level security;
alter table video_lectures enable row level security;
alter table attendance enable row level security;
alter table grading_scales enable row level security;
alter table results enable row level security;
alter table admissions enable row level security;
alter table events enable row level security;
alter table blog_categories enable row level security;
alter table blog_posts enable row level security;
alter table notifications enable row level security;
alter table fee_structure enable row level security;
alter table gallery enable row level security;
alter table site_settings enable row level security;

-- Public SELECT allowed on courses, events, blog_posts (published), blog_categories, gallery, site_settings, fee_structure
create policy "Public courses select" on courses for select using (is_active = true);
create policy "Public events select" on events for select using (true);
create policy "Public blog_categories select" on blog_categories for select using (true);
create policy "Public blog_posts select" on blog_posts for select using (status = 'published');
create policy "Public fee_structure select" on fee_structure for select using (true);
create policy "Public gallery select" on gallery for select using (true);
create policy "Public site_settings select" on site_settings for select using (true);

-- Public insert on admissions (inquiries)
create policy "Public admissions insert" on admissions for insert with check (true);

-- Helper function to check current user's role from profiles table
create or replace function get_auth_role()
returns user_role as $$
  select role from profiles where id = auth.uid();
$$ language sql security definer;

-- Admin Full Access Policy across all tables
create policy "Admin full access profiles" on profiles for all using (get_auth_role() = 'admin');
create policy "Admin full access students" on students for all using (get_auth_role() = 'admin');
create policy "Admin full access parents" on parents for all using (get_auth_role() = 'admin');
create policy "Admin full access parent_students" on parent_students for all using (get_auth_role() = 'admin');
create policy "Admin full access teachers" on teachers for all using (get_auth_role() = 'admin');
create policy "Admin full access courses" on courses for all using (get_auth_role() = 'admin');
create policy "Admin full access subjects" on subjects for all using (get_auth_role() = 'admin');
create policy "Admin full access terms" on terms for all using (get_auth_role() = 'admin');
create policy "Admin full access classes" on classes for all using (get_auth_role() = 'admin');
create policy "Admin full access class_subjects" on class_subjects for all using (get_auth_role() = 'admin');
create policy "Admin full access class_enrollments" on class_enrollments for all using (get_auth_role() = 'admin');
create policy "Admin full access video_lectures" on video_lectures for all using (get_auth_role() = 'admin');
create policy "Admin full access attendance" on attendance for all using (get_auth_role() = 'admin');
create policy "Admin full access grading_scales" on grading_scales for all using (get_auth_role() = 'admin');
create policy "Admin full access results" on results for all using (get_auth_role() = 'admin');
create policy "Admin full access admissions" on admissions for all using (get_auth_role() = 'admin');
create policy "Admin full access events" on events for all using (get_auth_role() = 'admin');
create policy "Admin full access blog_categories" on blog_categories for all using (get_auth_role() = 'admin');
create policy "Admin full access blog_posts" on blog_posts for all using (get_auth_role() = 'admin');
create policy "Admin full access notifications" on notifications for all using (get_auth_role() = 'admin');
create policy "Admin full access fee_structure" on fee_structure for all using (get_auth_role() = 'admin');
create policy "Admin full access gallery" on gallery for all using (get_auth_role() = 'admin');
create policy "Admin full access site_settings" on site_settings for all using (get_auth_role() = 'admin');

-- Teachers can INSERT/UPDATE attendance, results, video_lectures, blog_posts
create policy "Teacher manage attendance" on attendance for all
  using (get_auth_role() = 'teacher');

create policy "Teacher manage results" on results for all
  using (get_auth_role() = 'teacher');

create policy "Teacher manage video_lectures" on video_lectures for all
  using (get_auth_role() = 'teacher');

create policy "Teacher manage blog_posts" on blog_posts for all
  using (get_auth_role() = 'teacher');

-- Students can SELECT own rows in attendance, results, class_enrollments
create policy "Student view own attendance" on attendance for select
  using (
    student_id in (select id from students where profile_id = auth.uid())
  );

create policy "Student view own results" on results for select
  using (
    student_id in (select id from students where profile_id = auth.uid())
  );

create policy "Student view own enrollments" on class_enrollments for select
  using (
    student_id in (select id from students where profile_id = auth.uid())
  );

-- Parents can SELECT rows linked to their child via parent_students
create policy "Parent view linked child attendance" on attendance for select
  using (
    student_id in (
      select ps.student_id from parent_students ps
      join parents p on p.id = ps.parent_id
      where p.profile_id = auth.uid()
    )
  );

create policy "Parent view linked child results" on results for select
  using (
    student_id in (
      select ps.student_id from parent_students ps
      join parents p on p.id = ps.parent_id
      where p.profile_id = auth.uid()
    )
  );
