import { createClient, User, Session } from '@supabase/supabase-js';
import { Course, EventItem, Profile, SiteSetting, Testimonial, UserRole } from '../types';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

export const isSupabaseConfigured = Boolean(
  supabaseUrl && 
  supabaseAnonKey && 
  supabaseUrl.startsWith('http') && 
  !supabaseUrl.includes('placeholder') &&
  !supabaseUrl.includes('mock-')
);

// Initialize Supabase client
export const supabase = isSupabaseConfigured
  ? createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true,
      }
    })
  : createClient('https://mock-app.supabase.co', 'mock-anon-key');

// Pre-seeded Demo Profiles for all 4 roles (supports instant offline testing & demonstration)
export const demoProfiles: Record<string, Profile> = {
  'admin@girlsacademy.edu.pk': {
    id: 'demo-admin-uid-1',
    full_name: 'Mrs. Raheela Perveen',
    email: 'admin@girlsacademy.edu.pk',
    role: 'admin',
    photo_url: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=400&q=80',
    phone: '051-4861234',
    is_active: true,
    created_at: '2026-01-15T08:00:00Z',
  },
  'teacher@girlsacademy.edu.pk': {
    id: 'demo-teacher-uid-2',
    full_name: 'Mrs. Sana Malik',
    email: 'teacher@girlsacademy.edu.pk',
    role: 'teacher',
    photo_url: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=400&q=80',
    phone: '0300-4861234',
    is_active: true,
    created_at: '2026-01-18T09:00:00Z',
  },
  'student@girlsacademy.edu.pk': {
    id: 'demo-student-uid-3',
    full_name: 'Fatima Bibi',
    email: 'student@girlsacademy.edu.pk',
    role: 'student',
    photo_url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
    phone: '0301-2345678',
    is_active: true,
    created_at: '2026-02-01T10:00:00Z',
  },
  'parent@girlsacademy.edu.pk': {
    id: 'demo-parent-uid-4',
    full_name: 'Mr. Mohammad Akram',
    email: 'parent@girlsacademy.edu.pk',
    role: 'parent',
    photo_url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80',
    phone: '0302-3456789',
    is_active: true,
    created_at: '2026-02-01T10:30:00Z',
  },
};

// Local storage session key for demo authentication persistence
export const LOCAL_DEMO_AUTH_KEY = 'girls_academy_demo_auth_profile';

/**
 * Fetch profile from `profiles` table by user id
 */
export async function getProfileById(userId: string): Promise<Profile | null> {
  if (!isSupabaseConfigured) {
    const saved = localStorage.getItem(LOCAL_DEMO_AUTH_KEY);
    if (saved) {
      try { return JSON.parse(saved); } catch { return null; }
    }
    return null;
  }

  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();

    if (error || !data) {
      console.warn('Profile fetch note:', error?.message);
      return null;
    }
    return data as Profile;
  } catch (err) {
    console.error('Error fetching profile:', err);
    return null;
  }
}

/**
 * Update profile in database
 */
export async function updateProfileRecord(userId: string, updates: Partial<Profile>): Promise<Profile> {
  if (!isSupabaseConfigured) {
    const saved = localStorage.getItem(LOCAL_DEMO_AUTH_KEY);
    let current: Profile = demoProfiles['student@girlsacademy.edu.pk'];
    if (saved) {
      try { current = JSON.parse(saved); } catch {}
    }
    const updated: Profile = { ...current, ...updates };
    localStorage.setItem(LOCAL_DEMO_AUTH_KEY, JSON.stringify(updated));
    return updated;
  }

  const { data, error } = await supabase
    .from('profiles')
    .update(updates)
    .eq('id', userId)
    .select()
    .single();

  if (error) {
    throw new Error(error.message);
  }
  return data as Profile;
}

// Default initial data for Pakistan Girls Academy
export const defaultSiteSettings: Record<string, string> = {
  academy_name: 'Girls Academy',
  school_name: 'Girls Academy',
  academy_tagline: 'Quality Education — Inspiring Women Leaders',
  tagline: 'Quality Education — Inspiring Women Leaders',
  academy_email: 'info@girlsacademy.edu.pk',
  admissions_email: 'info@girlsacademy.edu.pk',
  contact_email: 'info@girlsacademy.edu.pk',
  academy_phone: '051-4861234',
  phone_number: '051-4861234',
  contact_phone: '051-4861234',
  academy_whatsapp: '0300-4861234',
  academy_address: 'Street 5, Sector G-11/2, Islamabad, Pakistan',
  campus_address: 'Street 5, Sector G-11/2, Islamabad, Pakistan',
  address: 'Street 5, Sector G-11/2, Islamabad, Pakistan',
  academy_city: 'Islamabad',
  city_state: 'Islamabad, ICT',
  academy_province: 'Islamabad Capital Territory',
  facebook_url: 'https://facebook.com/girlsacademy',
  instagram_url: 'https://instagram.com/girlsacademy',
  youtube_url: 'https://youtube.com/girlsacademy',
  whatsapp_url: 'https://wa.me/923004861234',
  hero_title: 'Welcome to Girls Academy',
  hero_subtitle: 'Premier College for Women in Islamabad — Academic Excellence and Leadership',
  hero_image_url: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=1600&q=80',
  total_students: '1250',
  total_teachers: '48',
  total_courses: '10',
  years_of_excellence: '18',
  about_story: 'Empowering future women leaders through academic excellence and values-based mentorship',
  principal_name: 'Mrs. Raheela Perveen',
  principal_designation: 'Principal & Head of Institution (M.Ed, University of the Punjab)',
  principal_message: 'We firmly believe that every young woman possesses limitless potential that blooms with dedicated mentorship.',
  principal_photo_url: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=600&q=80',
  admission_open: 'true',
  admissions_open: 'true',
  admission_last_date: '31/03/2026',
  admission_instructions: 'Online admissions for Session 2026-2027 are now open. Please upload student B-Form, previous report card, and father/guardian CNIC.',
  academic_year: '2026-2027',
  logo_text_first: 'Girls',
  logo_text_second: 'Academy'
};

export const defaultCourses: Course[] = [
  {
    id: 'c-1',
    title: 'Primary Program (Nursery – Class 5)',
    description: 'Primary Education — Core Subjects: English, Mathematics, General Science, Social Studies, and Ethics',
    level: 'Primary',
    category: 'School',
    duration: '7 Years',
    schedule: 'Mon-Sat, 8:00 AM – 1:00 PM',
    fee_info: 'Rs. 2,500 – 3,000/month',
    instructor_name: 'Primary Section Head',
    thumbnail_url: 'https://images.unsplash.com/photo-1509062522246-3755977927d7?auto=format&fit=crop&w=800&q=80',
    is_active: true
  },
  {
    id: 'c-2',
    title: 'Middle School (Class 6 – 8)',
    description: 'Middle School — English, Mathematics, Science, Social Studies, and Computer Science',
    level: 'Middle',
    category: 'School',
    duration: '3 Years',
    schedule: 'Mon-Sat, 8:00 AM – 2:00 PM',
    fee_info: 'Rs. 3,500/month',
    instructor_name: 'Middle Section Head',
    thumbnail_url: 'https://images.unsplash.com/photo-1580582932707-520aed937b7b?auto=format&fit=crop&w=800&q=80',
    is_active: true
  },
  {
    id: 'c-3',
    title: 'Matric Science (Class 9 – 10)',
    description: 'Matric Science — Physics, Chemistry, Biology, Mathematics | BISE Board',
    level: 'Secondary',
    category: 'Matric',
    duration: '2 Years',
    schedule: 'Mon-Sat, 8:00 AM – 2:00 PM',
    fee_info: 'Rs. 4,500/month',
    instructor_name: 'Science Department (BISE Specialist)',
    thumbnail_url: 'https://images.unsplash.com/photo-1532094349884-543bc11b234d?auto=format&fit=crop&w=800&q=80',
    is_active: true
  },
  {
    id: 'c-4',
    title: 'Matric Arts (Class 9 – 10)',
    description: 'Matric Arts — English, General Science, Civics, History | BISE Board',
    level: 'Secondary',
    category: 'Matric',
    duration: '2 Years',
    schedule: 'Mon-Sat, 8:00 AM – 2:00 PM',
    fee_info: 'Rs. 4,000/month',
    instructor_name: 'Arts Department',
    thumbnail_url: 'https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?auto=format&fit=crop&w=800&q=80',
    is_active: true
  },
  {
    id: 'c-5',
    title: 'Matric Commerce (Class 9 – 10)',
    description: 'Matric Commerce — Principles of Accounting, Economics, Commerce | BISE Board',
    level: 'Secondary',
    category: 'Matric',
    duration: '2 Years',
    schedule: 'Mon-Sat, 8:00 AM – 2:00 PM',
    fee_info: 'Rs. 4,000/month',
    instructor_name: 'Commerce Department',
    thumbnail_url: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=800&q=80',
    is_active: true
  },
  {
    id: 'c-6',
    title: 'FSc Pre-Medical (1st & 2nd Year)',
    description: 'FSc Pre-Medical — Physics, Chemistry, Biology | MDCAT Preparation',
    level: 'Higher Secondary',
    category: 'FSc',
    duration: '2 Years',
    schedule: 'Mon-Sat, 8:00 AM – 2:00 PM',
    fee_info: 'Rs. 5,500/month',
    instructor_name: 'FSc Science Department',
    thumbnail_url: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=800&q=80',
    is_active: true
  },
  {
    id: 'c-7',
    title: 'FSc Pre-Engineering (1st & 2nd Year)',
    description: 'FSc Pre-Engineering — Physics, Chemistry, Mathematics | ECAT Preparation',
    level: 'Higher Secondary',
    category: 'FSc',
    duration: '2 Years',
    schedule: 'Mon-Sat, 8:00 AM – 2:00 PM',
    fee_info: 'Rs. 5,500/month',
    instructor_name: 'FSc Science Department',
    thumbnail_url: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=800&q=80',
    is_active: true
  },
  {
    id: 'c-8',
    title: 'FA — Faculty of Arts (1st & 2nd Year)',
    description: 'FA Arts — English, Psychology, Civics, Education, Literature',
    level: 'Higher Secondary',
    category: 'FA',
    duration: '2 Years',
    schedule: 'Mon-Sat, 8:00 AM – 2:00 PM',
    fee_info: 'Rs. 4,500/month',
    instructor_name: 'Arts Department',
    thumbnail_url: 'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?auto=format&fit=crop&w=800&q=80',
    is_active: true
  },
  {
    id: 'c-9',
    title: 'ICS — Computer Science (1st & 2nd Year)',
    description: 'ICS Computer Science — Computer Science, Mathematics, Physics / Statistics',
    level: 'Higher Secondary',
    category: 'ICS',
    duration: '2 Years',
    schedule: 'Mon-Sat, 8:00 AM – 2:00 PM',
    fee_info: 'Rs. 5,000/month',
    instructor_name: 'Computer Science Department',
    thumbnail_url: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=800&q=80',
    is_active: true
  },
  {
    id: 'c-10',
    title: 'I.Com — Commerce (1st & 2nd Year)',
    description: 'I.Com Commerce — Principles of Accounting, Economics, Commerce, Business Statistics',
    level: 'Higher Secondary',
    category: 'I.Com',
    duration: '2 Years',
    schedule: 'Mon-Sat, 8:00 AM – 2:00 PM',
    fee_info: 'Rs. 4,500/month',
    instructor_name: 'Commerce Department',
    thumbnail_url: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=800&q=80',
    is_active: true
  }
];

export const defaultEvents: EventItem[] = [
  {
    id: 'e-1',
    title: 'Annual Results & Honors Convocation',
    description: 'Grand convocation celebrating board results and top position holders. All parents and guardians invited.',
    event_date: '2026-03-15T10:00:00+05:00',
    date: '15/03/2026',
    location: 'Main Auditorium, Girls Academy',
    image_url: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=800&q=80',
    is_upcoming: true
  },
  {
    id: 'e-2',
    title: 'Pakistan Resolution Day Commemoration',
    description: 'Special commemoration ceremony featuring patriotic anthems and student declamations.',
    event_date: '2026-03-23T09:00:00+05:00',
    date: '23/03/2026',
    location: 'School Ground',
    image_url: 'https://images.unsplash.com/photo-1577962917302-cd874c4e31d2?auto=format&fit=crop&w=800&q=80',
    is_upcoming: true
  },
  {
    id: 'e-3',
    title: 'Parents-Teacher Meeting (PTM)',
    description: 'Consultations regarding quarterly academic progress, report cards, and student feedback.',
    event_date: '2026-04-10T10:00:00+05:00',
    date: '10/04/2026',
    location: 'Classrooms, Girls Academy',
    image_url: 'https://images.unsplash.com/photo-1577495508048-b635879837f1?auto=format&fit=crop&w=800&q=80',
    is_upcoming: true
  },
  {
    id: 'e-4',
    title: 'Annual Science & Tech Exhibition',
    description: 'Showcase of innovative robotics and STEM projects designed by students. Awards presented.',
    event_date: '2026-05-05T11:00:00+05:00',
    date: '05/05/2026',
    location: 'Science Lab, Girls Academy',
    image_url: 'https://images.unsplash.com/photo-1517048676732-d65bc937f952?auto=format&fit=crop&w=800&q=80',
    is_upcoming: true
  },
  {
    id: 'e-5',
    title: 'Inter-College Declamation & Recitation Contest',
    description: 'Annual inter-college recitation and speech competition with awards.',
    event_date: '2026-04-20T09:00:00+05:00',
    date: '20/04/2026',
    location: 'Main Hall, Girls Academy',
    image_url: 'https://images.unsplash.com/photo-1609599006353-e629aaabfeae?auto=format&fit=crop&w=800&q=80',
    is_upcoming: true
  },
  {
    id: 'e-6',
    title: 'Pre-Board Mock Examination Series',
    description: 'Pre-board examination simulations for Matric and Intermediate students.',
    event_date: '2026-01-10T08:00:00+05:00',
    date: '10/01/2026',
    location: 'Examination Hall',
    image_url: 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?auto=format&fit=crop&w=800&q=80',
    is_upcoming: false
  },
  {
    id: 'e-7',
    title: 'Annual Sports & Athletics Gala',
    description: 'Annual athletics meet, badminton tournaments, and track events for students.',
    event_date: '2026-11-15T09:00:00+05:00',
    date: '15/11/2026',
    location: 'School Ground',
    image_url: 'https://images.unsplash.com/photo-1465847899084-d164df4dedc6?auto=format&fit=crop&w=800&q=80',
    is_upcoming: true
  }
];

export const defaultTestimonials: Testimonial[] = [
  {
    id: 't-1',
    quote: 'Girls Academy transformed my academic journey. The teachers are incredibly hardworking and supportive. I secured an A+ grade in Matric.',
    student_name: 'Fatima Zahra',
    student_class: 'FSc Pre-Medical (2nd Year)',
    avatar_url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80'
  },
  {
    id: 't-2',
    quote: 'The campus environment is exceptional — completely safe, empowering, and top-tier in academic quality.',
    student_name: 'Ayesha Siddiqui',
    student_class: 'Matric Science (Class 10)',
    avatar_url: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=200&q=80'
  },
  {
    id: 't-3',
    quote: 'The Computer Science faculty is outstanding. The digital e-learning portal and labs are immensely helpful.',
    student_name: 'Zainab Khan',
    student_class: 'ICS (2nd Year)',
    avatar_url: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=200&q=80'
  },
  {
    id: 't-4',
    quote: 'The admission process was smooth and straightforward. The fee is affordable and education standard is world-class.',
    student_name: 'Maryam Nawaz',
    student_class: 'FA (1st Year)',
    avatar_url: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=200&q=80'
  },
  {
    id: 't-5',
    quote: 'My daughter secured an A+ grade from Girls Academy. We are deeply grateful to this prestigious institution.',
    student_name: 'Hina Sheikh',
    student_class: 'I.Com (2nd Year)',
    avatar_url: 'https://images.unsplash.com/photo-1567532939604-b6b5b0db2604?auto=format&fit=crop&w=200&q=80'
  }
];
