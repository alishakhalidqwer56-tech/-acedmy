-- =========================================================================
-- GIRLS ACADEMY - PHASE 1 DATABASE MIGRATION
-- Tables: site_settings, courses, events, admissions, faculty, profiles
-- =========================================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. SITE_SETTINGS TABLE
CREATE TABLE IF NOT EXISTS public.site_settings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    school_name TEXT NOT NULL DEFAULT 'Girls Academy',
    tagline TEXT DEFAULT 'Inspiring Leadership, Empowering Minds, Shaping The Future',
    motto TEXT DEFAULT 'Scientia, Virtus et Gratia (Knowledge, Virtue & Grace)',
    contact_email TEXT DEFAULT 'admissions@girlsacademy.edu',
    contact_phone TEXT DEFAULT '+1 (800) 555-4475',
    emergency_phone TEXT DEFAULT '+1 (800) 555-4499',
    address TEXT DEFAULT '742 Academic Crest Boulevard',
    city_state TEXT DEFAULT 'Cambridge, MA 02138',
    admissions_open BOOLEAN DEFAULT TRUE,
    academic_year TEXT DEFAULT '2026-2027',
    current_term TEXT DEFAULT 'Fall Semester',
    grading_scale TEXT DEFAULT 'percentage',
    social_links JSONB DEFAULT '{"facebook": "#", "instagram": "#", "linkedin": "#", "youtube": "#"}'::jsonb,
    announcement_banner TEXT DEFAULT 'Admissions for Academic Year 2026-2027 are officially open. Merit scholarships available.',
    total_students_enrolled INTEGER DEFAULT 1450,
    faculty_count INTEGER DEFAULT 86,
    national_rank TEXT DEFAULT '#1 Ranked Girls College Prep',
    accreditation TEXT DEFAULT 'NEASC & Global Baccalaureate Accredited',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- 2. COURSES TABLE
CREATE TABLE IF NOT EXISTS public.courses (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    code TEXT NOT NULL UNIQUE,
    title TEXT NOT NULL,
    category TEXT NOT NULL,
    grade_level TEXT NOT NULL,
    duration TEXT NOT NULL,
    credits INTEGER NOT NULL DEFAULT 4,
    department TEXT NOT NULL,
    short_description TEXT NOT NULL,
    full_description TEXT NOT NULL,
    learning_outcomes JSONB DEFAULT '[]'::jsonb,
    prerequisites JSONB DEFAULT '[]'::jsonb,
    syllabus_modules JSONB DEFAULT '[]'::jsonb,
    instructor_name TEXT NOT NULL,
    instructor_title TEXT NOT NULL,
    instructor_avatar TEXT,
    featured BOOLEAN DEFAULT FALSE,
    capacity INTEGER DEFAULT 30,
    enrolled INTEGER DEFAULT 0,
    image_url TEXT NOT NULL,
    tuition_fee TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- 3. EVENTS TABLE
CREATE TABLE IF NOT EXISTS public.events (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title TEXT NOT NULL,
    category TEXT NOT NULL,
    date DATE NOT NULL,
    time TEXT NOT NULL,
    location TEXT NOT NULL,
    description TEXT NOT NULL,
    keynote_speaker TEXT,
    speaker_role TEXT,
    image_url TEXT NOT NULL,
    featured BOOLEAN DEFAULT FALSE,
    registration_deadline DATE,
    rsvp_required BOOLEAN DEFAULT TRUE,
    capacity INTEGER DEFAULT 150,
    registered_count INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- 4. ADMISSIONS INQUIRIES & APPLICATIONS TABLE
CREATE TABLE IF NOT EXISTS public.admissions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    student_name TEXT NOT NULL,
    parent_name TEXT NOT NULL,
    email TEXT NOT NULL,
    phone TEXT NOT NULL,
    grade_applying_for TEXT NOT NULL,
    current_school TEXT,
    program_interest TEXT NOT NULL,
    notes TEXT,
    status TEXT DEFAULT 'new' CHECK (status IN ('new', 'reviewed', 'contacted', 'admitted', 'rejected')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- 5. ROW LEVEL SECURITY (RLS) POLICIES
ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.courses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.admissions ENABLE ROW LEVEL SECURITY;

-- Public can read site_settings, courses, events
CREATE POLICY "Public read-only site_settings" ON public.site_settings
    FOR SELECT USING (true);

CREATE POLICY "Public read-only courses" ON public.courses
    FOR SELECT USING (true);

CREATE POLICY "Public read-only events" ON public.events
    FOR SELECT USING (true);

-- Anyone can submit admission inquiries
CREATE POLICY "Public insert admissions" ON public.admissions
    FOR INSERT WITH CHECK (true);

-- Admin update policies (authenticated admin)
CREATE POLICY "Admins full control site_settings" ON public.site_settings
    FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Admins full control courses" ON public.courses
    FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Admins full control events" ON public.events
    FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Admins view all admissions" ON public.admissions
    FOR SELECT USING (auth.role() = 'authenticated');
