import { supabase, isSupabaseConfigured, demoProfiles, defaultCourses, defaultEvents, defaultSiteSettings, defaultTestimonials } from './supabase';
export { defaultCourses, defaultEvents, defaultSiteSettings, defaultTestimonials };
import { 
  Course, 
  SchoolClass, 
  Subject, 
  Term, 
  VideoLecture, 
  Attendance, 
  Result, 
  EventItem,
  Profile, 
  BlogPost, 
  Notification, 
  FeeStructure, 
  GalleryItem,
  SiteSetting,
  UserRole,
  Student,
  ChatInquiry,
  GradingScale,
  Testimonial,
  ChatbotSettings,
    Admission,
  AdmissionStatus,
  HeroSlide,
  Banner,
  SocialMedia,
  CoreValue,
  Achievement,
  QuickStat,
  Announcement,
  Popup,
  Poster,
  BlogCategory,
  Teacher
} from '../types';

export type { ChatbotSettings, ChatbotFAQ } from '../types';

// ==========================================
// SEED DATA FOR STANDALONE & DEMO PERSISTENCE
// ==========================================

export const initialTerms: Term[] = [
  { id: 'term-1', name: 'Term 1 (First Term): April – June', academic_year: '2026-2027', start_date: '2026-04-01', end_date: '2026-06-30', is_active: true },
  { id: 'term-2', name: 'Mid-Year Exams: October', academic_year: '2026-2027', start_date: '2026-10-01', end_date: '2026-10-25', is_active: false },
  { id: 'term-3', name: 'Term 2 (Second Term / Annual): February – March', academic_year: '2026-2027', start_date: '2027-02-01', end_date: '2027-03-31', is_active: false },
];

export const initialClasses: SchoolClass[] = [
  { id: 'class-1', name: 'Class 9 (Science)', course_id: 'c-3', term_id: 'term-1' },
  { id: 'class-2', name: 'Class 10 (Science)', course_id: 'c-3', term_id: 'term-1' },
  { id: 'class-3', name: 'Class 9 (Arts)', course_id: 'c-4', term_id: 'term-1' },
  { id: 'class-4', name: 'Class 10 (Arts)', course_id: 'c-4', term_id: 'term-1' },
  { id: 'class-5', name: 'Class 9 (Commerce)', course_id: 'c-5', term_id: 'term-1' },
  { id: 'class-6', name: 'Class 10 (Commerce)', course_id: 'c-5', term_id: 'term-1' },
  { id: 'class-7', name: 'FSc Pre-Medical (1st Year)', course_id: 'c-6', term_id: 'term-1' },
  { id: 'class-8', name: 'FSc Pre-Medical (2nd Year)', course_id: 'c-6', term_id: 'term-1' },
  { id: 'class-9', name: 'FSc Pre-Engineering (1st Year)', course_id: 'c-7', term_id: 'term-1' },
  { id: 'class-10', name: 'FSc Pre-Engineering (2nd Year)', course_id: 'c-7', term_id: 'term-1' },
  { id: 'class-11', name: 'FA — Faculty of Arts (1st Year)', course_id: 'c-8', term_id: 'term-1' },
  { id: 'class-12', name: 'FA — Faculty of Arts (2nd Year)', course_id: 'c-8', term_id: 'term-1' },
  { id: 'class-13', name: 'ICS — Computer Science (1st Year)', course_id: 'c-9', term_id: 'term-1' },
  { id: 'class-14', name: 'ICS — Computer Science (2nd Year)', course_id: 'c-9', term_id: 'term-1' },
  { id: 'class-15', name: 'I.Com — Commerce (1st Year)', course_id: 'c-10', term_id: 'term-1' },
  { id: 'class-16', name: 'I.Com — Commerce (2nd Year)', course_id: 'c-10', term_id: 'term-1' },
  { id: 'class-17', name: 'Class 8 (Middle)', course_id: 'c-2', term_id: 'term-1' },
  { id: 'class-18', name: 'Class 7 (Middle)', course_id: 'c-2', term_id: 'term-1' },
  { id: 'class-19', name: 'Class 6 (Middle)', course_id: 'c-2', term_id: 'term-1' },
  { id: 'class-20', name: 'Class 5 (Primary)', course_id: 'c-1', term_id: 'term-1' },
  { id: 'class-21', name: 'Nursery / KG', course_id: 'c-1', term_id: 'term-1' },
];

export const initialSubjects: Subject[] = [
  // Primary (Class 1-5)
  { id: 'subj-p1', name: 'Urdu Language & Literature', course_id: 'c-1' },
  { id: 'subj-p2', name: 'English Language & Literature', course_id: 'c-1' },
  { id: 'subj-p3', name: 'Mathematics', course_id: 'c-1' },
  { id: 'subj-p4', name: 'General Knowledge (G.K.)', course_id: 'c-1' },
  { id: 'subj-p5', name: 'Ethics & Religious Studies', course_id: 'c-1' },
  { id: 'subj-p6', name: 'Quranic Studies & Recitation', course_id: 'c-1' },

  // Middle (Class 6-8)
  { id: 'subj-m1', name: 'Urdu Language & Literature', course_id: 'c-2' },
  { id: 'subj-m2', name: 'English Language & Literature', course_id: 'c-2' },
  { id: 'subj-m3', name: 'Mathematics', course_id: 'c-2' },
  { id: 'subj-m4', name: 'General Science', course_id: 'c-2' },
  { id: 'subj-m5', name: 'Social Studies', course_id: 'c-2' },
  { id: 'subj-m6', name: 'Ethics & Religious Studies', course_id: 'c-2' },
  { id: 'subj-m7', name: 'Computer Science', course_id: 'c-2' },

  // Matric Science (Class 9-10)
  { id: 'subj-1', name: 'Physics', course_id: 'c-3' },
  { id: 'subj-2', name: 'Chemistry', course_id: 'c-3' },
  { id: 'subj-3', name: 'Biology', course_id: 'c-3' },
  { id: 'subj-4', name: 'Mathematics', course_id: 'c-3' },
  { id: 'subj-5', name: 'Urdu Literature & Language', course_id: 'c-3' },
  { id: 'subj-6', name: 'English Compulsory & Composition', course_id: 'c-3' },
  { id: 'subj-7', name: 'Ethics & Values Compulsory', course_id: 'c-3' },
  { id: 'subj-8', name: 'Pakistan Studies & History', course_id: 'c-3' },

  // Matric Arts
  { id: 'subj-a1', name: 'General Science', course_id: 'c-4' },
  { id: 'subj-a2', name: 'Literature & Creative Writing', course_id: 'c-4' },
  { id: 'subj-a3', name: 'World & Regional History', course_id: 'c-4' },

  // Matric Commerce
  { id: 'subj-cm1', name: 'Principles of Principles of Commerce', course_id: 'c-5' },
  { id: 'subj-cm2', name: 'Economics', course_id: 'c-5' },
  { id: 'subj-cm3', name: 'Principles of Accounting', course_id: 'c-5' },

  // FSc Pre-Medical
  { id: 'subj-pm1', name: 'Biology & Cell Physiology', course_id: 'c-6' },
  { id: 'subj-pm2', name: 'Chemistry & Organic Synthesis', course_id: 'c-6' },
  { id: 'subj-pm3', name: 'Physics & Electromagnetism', course_id: 'c-6' },

  // FSc Pre-Engineering
  { id: 'subj-pe1', name: 'Advanced Mathematics & Calculus', course_id: 'c-7' },

  // FA
  { id: 'subj-fa1', name: 'Civics & Government', course_id: 'c-8' },
  { id: 'subj-fa2', name: 'Economics', course_id: 'c-8' },
  { id: 'subj-fa3', name: 'Education & Psychology', course_id: 'c-8' },

  // ICS
  { id: 'subj-ics1', name: 'Computer Science & Programming', course_id: 'c-9' },
  { id: 'subj-ics2', name: 'Mathematics & Statistics', course_id: 'c-9' },

  // I.Com
  { id: 'subj-icom1', name: 'Principles of Accounting', course_id: 'c-10' },
  { id: 'subj-icom2', name: 'Business Statistics & Math', course_id: 'c-10' },
];

export const initialVideoLectures: VideoLecture[] = [
  {
    id: 'vid-1',
    title: 'Physics Grade 9: Newton’s Laws of Motion & Kinematics',
    description: 'Equations of motion, conceptual principles, and comprehensive numerical solutions aligned with board syllabus.',
    video_url: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    course_id: 'c-3',
    subject_id: 'subj-1',
    uploaded_by: 'demo-teacher-uid-2',
    created_at: '2026-10-01T10:00:00Z'
  },
  {
    id: 'vid-2',
    title: 'Chemistry Grade 9: Atomic Structure & Electronic Configuration',
    description: 'Bohr atomic model, electronic sub-shells, and configurations of first 18 periodic elements.',
    video_url: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    course_id: 'c-3',
    subject_id: 'subj-2',
    uploaded_by: 'demo-teacher-uid-2',
    created_at: '2026-10-04T14:30:00Z'
  },
  {
    id: 'vid-3',
    title: 'Biology Grade 9: Cell Structure & Functions',
    description: 'Differences between plant and animal cells, microscopy observations, and biological diagram illustrations.',
    video_url: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    course_id: 'c-3',
    subject_id: 'subj-3',
    uploaded_by: 'demo-teacher-uid-2',
    created_at: '2026-10-05T09:15:00Z'
  },
  {
    id: 'vid-4',
    title: 'FSc Pre-Medical: Biological Molecules & Enzyme Kinetics',
    description: 'Essential MDCAT and board concepts in carbohydrates, proteins, lipids, and enzyme catalytic mechanisms.',
    video_url: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    course_id: 'c-6',
    subject_id: 'subj-pm1',
    uploaded_by: 'demo-teacher-uid-2',
    created_at: '2026-10-06T11:00:00Z'
  }
];

export const initialAttendanceRecords: Attendance[] = [
  { id: 'att-1', student_id: 'demo-student-uid-3', class_id: 'class-1', date: '2026-10-02', status: 'present', marked_by: 'demo-teacher-uid-2' },
  { id: 'att-2', student_id: 'demo-student-uid-3', class_id: 'class-1', date: '2026-10-03', status: 'present', marked_by: 'demo-teacher-uid-2' },
  { id: 'att-3', student_id: 'demo-student-uid-3', class_id: 'class-1', date: '2026-10-04', status: 'present', marked_by: 'demo-teacher-uid-2' },
  { id: 'att-4', student_id: 'demo-student-uid-3', class_id: 'class-1', date: '2026-10-05', status: 'present', marked_by: 'demo-teacher-uid-2' },
  { id: 'att-5', student_id: 'demo-student-uid-3', class_id: 'class-1', date: '2026-10-06', status: 'present', marked_by: 'demo-teacher-uid-2' },
  { id: 'att-6', student_id: 'demo-student-uid-3', class_id: 'class-1', date: '2026-10-07', status: 'present', marked_by: 'demo-teacher-uid-2' },
];

export const initialResults: Result[] = [
  {
    id: 'res-1',
    student_id: 'demo-student-uid-3',
    subject_id: 'subj-1',
    term_id: 'term-1',
    marks_obtained: 94,
    total_marks: 100,
    grade: 'A+',
    entered_by: 'demo-teacher-uid-2',
    created_at: '2026-10-02T16:00:00Z'
  },
  {
    id: 'res-2',
    student_id: 'demo-student-uid-3',
    subject_id: 'subj-2',
    term_id: 'term-1',
    marks_obtained: 88,
    total_marks: 100,
    grade: 'A',
    entered_by: 'demo-teacher-uid-2',
    created_at: '2026-10-03T16:00:00Z'
  },
  {
    id: 'res-3',
    student_id: 'demo-student-uid-3',
    subject_id: 'subj-3',
    term_id: 'term-1',
    marks_obtained: 96,
    total_marks: 100,
    grade: 'A+',
    entered_by: 'demo-teacher-uid-2',
    created_at: '2026-10-04T16:00:00Z'
  },
  {
    id: 'res-4',
    student_id: 'demo-student-uid-3',
    subject_id: 'subj-4',
    term_id: 'term-1',
    marks_obtained: 92,
    total_marks: 100,
    grade: 'A+',
    entered_by: 'demo-teacher-uid-2',
    created_at: '2026-10-05T16:00:00Z'
  }
];

export const initialBlogPosts: BlogPost[] = [
  {
    id: 'post-1',
    title: 'How to Prepare Effectively for Matric Board Examinations',
    slug: 'matric-exam-tayari',
    excerpt: 'Key strategies, study schedules, and tips to excel in BISE board examinations',
    content: 'Matriculation examinations represent a crucial milestone for students. Achieving top distinctions demands an organized revision timetable, in-depth past paper practice, and conceptual clarity. Dedicated four to five hours of disciplined study daily along with model exam practice guarantees high percentile scores.',
    featured_image_url: 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?auto=format&fit=crop&w=800&q=80',
    status: 'published',
    published_at: '2026-10-02T08:00:00Z',
    tags: ['Matric', 'Examinations', 'Guidance']
  },
  {
    id: 'post-2',
    title: 'Admissions in FSc Pre-Medical — Complete Guidance',
    slug: 'fsc-premedical-guide',
    excerpt: 'Comprehensive guide to FSc Pre-Medical subjects, laboratory skills, and MDCAT entrance prep',
    content: 'Following FSc Pre-Medical, securing admission into top medical universities hinges on high board marks and MDCAT performance. Our dedicated faculty trains scholars on conceptual reasoning to help them realize their dreams of becoming compassionate doctors.',
    featured_image_url: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=800&q=80',
    status: 'published',
    published_at: '2026-09-24T08:00:00Z',
    tags: ['FSc', 'Pre-Medical', 'MDCAT']
  },
  {
    id: 'post-3',
    title: 'Girls Academy Annual Academic Results Celebration',
    slug: 'salana-nataij-2025',
    excerpt: 'Girls Academy scholars secure benchmark distinctions across BISE board examinations',
    content: 'This academic year, 95% of Girls Academy scholars secured A and A+ grades with 1st position across the district. We warmly congratulate our brilliant position holders, their proud families, and our dedicated teachers whose mentorship made this victory possible.',
    featured_image_url: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=800&q=80',
    status: 'published',
    published_at: '2026-09-12T08:00:00Z',
    tags: ['Results', 'Success', 'Honors']
  },
  {
    id: 'post-4',
    title: 'Parenting Guide — Fostering Academic Excellence at Home',
    slug: 'waldain-guide',
    excerpt: 'Practical strategies for guardians to nurture curiosity, focus, and study habits at home',
    content: 'Parental encouragement plays a transformative role in academic development. Providing a calm study environment, positive motivation, balanced routines, and active communication with teachers empower young women to flourish.',
    featured_image_url: 'https://images.unsplash.com/photo-1577495508048-b635879837f1?auto=format&fit=crop&w=800&q=80',
    status: 'published',
    published_at: '2026-09-01T08:00:00Z',
    tags: ['Parenting', 'Guidance', 'Education']
  }
];

export const initialNotifications: Notification[] = [
  {
    id: 'notif-1',
    title: 'Admissions Open 2026-2027',
    message: 'Admissions for Academic Session 2026-2027 are officially open. Submit your online application today.',
    recipient_role: 'student',
    is_read: false,
    created_at: '2026-10-06T10:00:00Z'
  },
  {
    id: 'notif-2',
    title: 'Monthly Fee Due Reminder',
    message: 'Please submit the monthly tuition fee by the 10th of the month via online portal or designated bank branches.',
    recipient_role: 'student',
    is_read: true,
    created_at: '2026-10-05T14:00:00Z'
  },
  {
    id: 'notif-3',
    title: 'Pre-Board Examination Schedule',
    message: 'Pre-Board examination simulations for Matric and Intermediate commence on January 10th adhering to BISE formats.',
    recipient_role: 'student',
    is_read: false,
    created_at: '2026-10-06T09:00:00Z'
  },
  {
    id: 'notif-4',
    title: 'Parents-Teacher Meeting (PTM) Notice',
    message: 'The quarterly Parents-Teacher Conference is scheduled for April 10th at 10:00 AM in respective classrooms.',
    recipient_role: 'parent',
    is_read: false,
    created_at: '2026-10-07T08:30:00Z'
  },
  {
    id: 'notif-5',
    title: 'Faculty Daily Attendance Notice',
    message: 'All teaching faculty members are requested to mark daily morning classroom attendance by 8:30 AM.',
    recipient_role: 'teacher',
    is_read: false,
    created_at: '2026-10-07T08:00:00Z'
  },
  {
    id: 'notif-6',
    title: 'New Applications Under Review',
    message: 'Fresh online admission applications for Session 2026-2027 have been received and are pending merit review.',
    recipient_role: 'admin',
    is_read: false,
    created_at: '2026-10-07T07:15:00Z'
  }
];

export const initialFeeStructure: FeeStructure[] = [
  { id: 'fee-1', program: 'Primary Program', class_name: 'Nursery / KG', amount: 2500, frequency: 'Monthly', description: 'Monthly Tuition Fee' },
  { id: 'fee-2', program: 'Primary Program', class_name: 'Class 1 – 5', amount: 3000, frequency: 'Monthly', description: 'Monthly Tuition Fee' },
  { id: 'fee-3', program: 'Primary Program', class_name: 'Nursery – Class 5', amount: 5000, frequency: 'One-time', description: 'Admission Fee (One-Time)' },
  { id: 'fee-4', program: 'Primary Program', class_name: 'Nursery – Class 5', amount: 3000, frequency: 'Annual', description: 'Annual Development Charges' },
  { id: 'fee-5', program: 'Middle School', class_name: 'Class 6 – 8', amount: 3500, frequency: 'Monthly', description: 'Monthly Tuition Fee' },
  { id: 'fee-6', program: 'Middle School', class_name: 'Class 6 – 8', amount: 7000, frequency: 'One-time', description: 'Admission Fee (One-Time)' },
  { id: 'fee-7', program: 'Middle School', class_name: 'Class 6 – 8', amount: 4500, frequency: 'Annual', description: 'Annual Fund & Charges' },
  { id: 'fee-8', program: 'Matric Science', class_name: 'Class 9 – 10', amount: 4500, frequency: 'Monthly', description: 'Monthly Tuition (Includes Science Lab)' },
  { id: 'fee-9', program: 'Matric Arts', class_name: 'Class 9 – 10', amount: 4000, frequency: 'Monthly', description: 'Monthly Tuition Fee' },
  { id: 'fee-10', program: 'Matric Commerce', class_name: 'Class 9 – 10', amount: 4000, frequency: 'Monthly', description: 'Monthly Tuition Fee' },
  { id: 'fee-11', program: 'Matric (All)', class_name: 'Class 9 – 10', amount: 8000, frequency: 'One-time', description: 'Admission Fee (One-Time)' },
  { id: 'fee-12', program: 'Matric (All)', class_name: 'Class 9 – 10', amount: 5000, frequency: 'Annual', description: 'Annual Fund & Charges' },
  { id: 'fee-13', program: 'FSc Pre-Medical', class_name: '1st & 2nd Year', amount: 5500, frequency: 'Monthly', description: 'Monthly Tuition (Includes Lab & MDCAT)' },
  { id: 'fee-14', program: 'FSc Pre-Engineering', class_name: '1st & 2nd Year', amount: 5500, frequency: 'Monthly', description: 'Monthly Tuition (Includes Math & Physics Lab)' },
  { id: 'fee-15', program: 'FA', class_name: '1st & 2nd Year', amount: 4500, frequency: 'Monthly', description: 'Monthly Tuition Fee' },
  { id: 'fee-16', program: 'ICS', class_name: '1st & 2nd Year', amount: 5000, frequency: 'Monthly', description: 'Monthly Tuition (Includes Computer Lab)' },
  { id: 'fee-17', program: 'I.Com', class_name: '1st & 2nd Year', amount: 4500, frequency: 'Monthly', description: 'Monthly Tuition Fee' },
  { id: 'fee-18', program: 'FSc/FA/ICS/I.Com', class_name: '1st & 2nd Year', amount: 10000, frequency: 'One-time', description: 'Admission Fee (One-Time)' },
  { id: 'fee-19', program: 'FSc/FA/ICS/I.Com', class_name: '1st & 2nd Year', amount: 6000, frequency: 'Annual', description: 'Annual Fund & Charges' },
];

export const initialGallery: GalleryItem[] = [
  { id: 'gal-1', title: 'Robotics Team World Championship Rover Testing', media_url: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=800&q=80', media_type: 'image' },
  { id: 'gal-2', title: 'Life Sciences Molecular Wet Lab Experimentation', media_url: 'https://images.unsplash.com/photo-1532094349884-543bc11b234d?auto=format&fit=crop&w=800&q=80', media_type: 'image' },
  { id: 'gal-3', title: 'Chamber Orchestra Winter Symphony Rehearsals', media_url: 'https://images.unsplash.com/photo-1465847899084-d164df4dedc6?auto=format&fit=crop&w=800&q=80', media_type: 'image' },
  { id: 'gal-4', title: 'Campus Quadrangle Autumn Study Session', media_url: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=800&q=80', media_type: 'image' },
  { id: 'gal-5', title: 'Women in Leadership Model UN Assembly', media_url: 'https://images.unsplash.com/photo-1577962917302-cd874c4e31d2?auto=format&fit=crop&w=800&q=80', media_type: 'image' },
  { id: 'gal-6', title: 'Athletics Fencing Championship Finalists', media_url: 'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?auto=format&fit=crop&w=800&q=80', media_type: 'image' },
];

// Urdu Detection & Purge Engine
export const HAS_URDU_CHAR = /[\u0600-\u06FF]/;

// Storage persistence helpers with cross-tab/cross-component syncing
function getLocal<T>(key: string, fallback: T): T {
  if (typeof window === 'undefined' || !window.localStorage) return fallback;
  const item = localStorage.getItem(key);
  if (item) {
    try { 
      return JSON.parse(item); 
    } catch {}
  }
  localStorage.setItem(key, JSON.stringify(fallback));
  return fallback;
}

function setLocal<T>(key: string, data: T): void {
  if (typeof window === 'undefined' || !window.localStorage) return;
  localStorage.setItem(key, JSON.stringify(data));
  // Notify all listeners
  window.dispatchEvent(new Event('storage'));
  window.dispatchEvent(new CustomEvent('ga_data_updated', { detail: { key } }));
}

// ==========================================
// DATA SERVICE FUNCTIONS
// ==========================================

// --- VIDEO LECTURES ---
export async function fetchVideoLectures(courseId?: string): Promise<VideoLecture[]> {
  if (isSupabaseConfigured) {
    try {
      let q = supabase.from('video_lectures').select('*').order('created_at', { ascending: false });
      if (courseId) q = q.eq('course_id', courseId);
      const { data, error } = await q;
      if (!error && data && data.length > 0) return data as VideoLecture[];
    } catch {}
  }
  const all = getLocal('ga_video_lectures', initialVideoLectures);
  return courseId ? all.filter(v => v.course_id === courseId) : all;
}

export async function createVideoLecture(lecture: Omit<VideoLecture, 'id' | 'created_at'>): Promise<VideoLecture> {
  const newLec: VideoLecture = {
    ...lecture,
    id: `vid-${Date.now()}`,
    created_at: new Date().toISOString()
  };
  if (isSupabaseConfigured) {
    try {
      const { data, error } = await supabase.from('video_lectures').insert([newLec]).select().single();
      if (!error && data) return data as VideoLecture;
    } catch {}
  }
  const all = getLocal('ga_video_lectures', initialVideoLectures);
  all.unshift(newLec);
  setLocal('ga_video_lectures', all);
  return newLec;
}

// --- ATTENDANCE ---
export async function fetchAttendanceForStudent(studentId: string): Promise<Attendance[]> {
  if (isSupabaseConfigured) {
    try {
      const { data, error } = await supabase.from('attendance').select('*').eq('student_id', studentId).order('date', { ascending: false });
      if (!error && data && data.length > 0) return data as Attendance[];
    } catch {}
  }
  const all = getLocal('ga_attendance', initialAttendanceRecords);
  return all.filter(a => a.student_id === studentId);
}

export async function markClassAttendance(records: Omit<Attendance, 'id' | 'created_at'>[]): Promise<void> {
  if (isSupabaseConfigured) {
    try {
      await supabase.from('attendance').upsert(records, { onConflict: 'student_id,class_id,date' });
    } catch {}
  }
  const all = getLocal('ga_attendance', initialAttendanceRecords);
  records.forEach(r => {
    const idx = all.findIndex(a => a.student_id === r.student_id && a.class_id === r.class_id && a.date === r.date);
    const item: Attendance = { ...r, id: idx !== -1 ? all[idx].id : `att-${Date.now()}-${Math.random()}` };
    if (idx !== -1) all[idx] = item;
    else all.unshift(item);
  });
  setLocal('ga_attendance', all);
}

// --- RESULTS ---
export async function fetchResultsForStudent(studentId: string): Promise<Result[]> {
  if (isSupabaseConfigured) {
    try {
      const { data, error } = await supabase.from('results').select('*').eq('student_id', studentId);
      if (!error && data && data.length > 0) return data as Result[];
    } catch {}
  }
  const all = getLocal('ga_results', initialResults);
  return all.filter(r => r.student_id === studentId);
}

export async function saveStudentResult(result: Omit<Result, 'id' | 'created_at'>): Promise<Result> {
  // calculate letter grade as per Pakistani BISE standard (33% passing)
  const marks = result.marks_obtained || 0;
  const total = result.total_marks || 100;
  const pct = (marks / total) * 100;
  let grade = 'F';
  if (pct >= 90) grade = 'A+';
  else if (pct >= 80) grade = 'A';
  else if (pct >= 70) grade = 'B';
  else if (pct >= 60) grade = 'C';
  else if (pct >= 50) grade = 'D';
  else if (pct >= 33) grade = 'E';
  else grade = 'F';

  const newRes: Result = {
    ...result,
    grade,
    id: `res-${Date.now()}`,
    created_at: new Date().toISOString()
  };

  if (isSupabaseConfigured) {
    try {
      const { data, error } = await supabase.from('results').upsert([newRes]).select().single();
      if (!error && data) return data as Result;
    } catch {}
  }

  const all = getLocal('ga_results', initialResults);
  const idx = all.findIndex(r => r.student_id === result.student_id && r.subject_id === result.subject_id && r.term_id === result.term_id);
  if (idx !== -1) all[idx] = newRes;
  else all.unshift(newRes);
  setLocal('ga_results', all);
  return newRes;
}

// --- USERS / PROFILES ---
export async function fetchAllUsers(roleFilter?: UserRole): Promise<Profile[]> {
  if (isSupabaseConfigured) {
    try {
      let q = supabase.from('profiles').select('*').order('created_at', { ascending: false });
      if (roleFilter) q = q.eq('role', roleFilter);
      const { data, error } = await q;
      if (!error && data && data.length > 0) return data as Profile[];
    } catch {}
  }
  const defaultList: Profile[] = Object.values(demoProfiles);
  const all = getLocal('ga_users', defaultList);
  return roleFilter ? all.filter(u => u.role === roleFilter) : all;
}

export async function createUserAccount(user: {
  full_name: string;
  email: string;
  role: UserRole;
  phone?: string;
  password?: string;
}): Promise<Profile> {
  const newProf: Profile = {
    id: `usr-${Date.now()}`,
    full_name: user.full_name,
    email: user.email.toLowerCase(),
    role: user.role,
    phone: user.phone || null,
    photo_url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80',
    is_active: true,
    created_at: new Date().toISOString()
  };

  if (isSupabaseConfigured) {
    try {
      // Call Edge Function with service role
      await supabase.functions.invoke('create-user-account', {
        body: user
      });
    } catch {}
  }

  const all = getLocal('ga_users', Object.values(demoProfiles));
  all.unshift(newProf);
  setLocal('ga_users', all);
  return newProf;
}

// --- BLOG POSTS ---
export async function fetchBlogPosts(status?: 'published' | 'pending' | 'draft' | 'all'): Promise<BlogPost[]> {
  if (isSupabaseConfigured) {
    try {
      let q = supabase.from('blog_posts').select('*').order('created_at', { ascending: false });
      if (status && status !== 'all') q = q.eq('status', status);
      const { data, error } = await q;
      if (!error && data && data.length > 0) return data as BlogPost[];
    } catch {}
  }
  const all = getLocal('ga_blog_posts', initialBlogPosts);
  if (!status || status === 'all') return all;
  return all.filter(p => p.status === status);
}

export async function createBlogPost(post: Omit<BlogPost, 'id' | 'created_at' | 'updated_at'>): Promise<BlogPost> {
  const newPost: BlogPost = {
    ...post,
    id: `post-${Date.now()}`,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  };
  if (isSupabaseConfigured) {
    try {
      const { data, error } = await supabase.from('blog_posts').insert([newPost]).select().single();
      if (!error && data) return data as BlogPost;
    } catch {}
  }
  const all = getLocal('ga_blog_posts', initialBlogPosts);
  all.unshift(newPost);
  setLocal('ga_blog_posts', all);
  return newPost;
}

export async function updateBlogPostStatus(id: string, status: 'published' | 'pending' | 'draft'): Promise<void> {
  if (isSupabaseConfigured) {
    try {
      await supabase.from('blog_posts').update({ status, published_at: status === 'published' ? new Date().toISOString() : null }).eq('id', id);
    } catch {}
  }
  const all = getLocal('ga_blog_posts', initialBlogPosts);
  const p = all.find(x => x.id === id);
  if (p) {
    p.status = status;
    p.published_at = status === 'published' ? new Date().toISOString() : undefined;
    setLocal('ga_blog_posts', all);
  }
}

// --- NOTIFICATIONS ---
export async function fetchNotificationsForRole(role?: UserRole | null): Promise<Notification[]> {
  if (isSupabaseConfigured) {
    try {
      let q = supabase.from('notifications').select('*').order('created_at', { ascending: false });
      if (role) q = q.or(`recipient_role.eq.${role},recipient_role.is.null`);
      const { data, error } = await q;
      if (!error && data && data.length > 0) return data as Notification[];
    } catch {}
  }
  const all = getLocal('ga_notifications', initialNotifications);
  if (!role) return all;
  return all.filter(n => !n.recipient_role || n.recipient_role === role);
}

export async function markNotificationAsRead(id: string): Promise<void> {
  if (isSupabaseConfigured) {
    try {
      await supabase.from('notifications').update({ is_read: true }).eq('id', id);
    } catch {}
  }
  const all = getLocal('ga_notifications', initialNotifications);
  const n = all.find(x => x.id === id);
  if (n) {
    n.is_read = true;
    setLocal('ga_notifications', all);
  }
}

export async function sendBroadcastNotification(notification: Omit<Notification, 'id' | 'created_at' | 'is_read'>): Promise<Notification> {
  const newNotif: Notification = {
    ...notification,
    id: `notif-${Date.now()}`,
    is_read: false,
    created_at: new Date().toISOString()
  };
  if (isSupabaseConfigured) {
    try {
      const { data, error } = await supabase.from('notifications').insert([newNotif]).select().single();
      if (!error && data) return data as Notification;
    } catch {}
  }
  const all = getLocal('ga_notifications', initialNotifications);
  all.unshift(newNotif);
  setLocal('ga_notifications', all);
  return newNotif;
}

// --- GALLERY ---
export async function fetchGalleryItems(): Promise<GalleryItem[]> {
  if (isSupabaseConfigured) {
    try {
      const { data, error } = await supabase.from('gallery').select('*').order('created_at', { ascending: false });
      if (!error && data && data.length > 0) return data as GalleryItem[];
    } catch {}
  }
  return getLocal('ga_gallery', initialGallery);
}

export async function addGalleryItem(item: Omit<GalleryItem, 'id' | 'created_at'>): Promise<GalleryItem> {
  const newItm: GalleryItem = {
    ...item,
    id: `gal-${Date.now()}`,
    created_at: new Date().toISOString()
  };
  if (isSupabaseConfigured) {
    try {
      const { data, error } = await supabase.from('gallery').insert([newItm]).select().single();
      if (!error && data) return data as GalleryItem;
    } catch {}
  }
  const all = getLocal('ga_gallery', initialGallery);
  all.unshift(newItm);
  setLocal('ga_gallery', all);
  return newItm;
}

// --- FEE STRUCTURE ---
export async function fetchFeeStructures(): Promise<FeeStructure[]> {
  if (isSupabaseConfigured) {
    try {
      const { data, error } = await supabase.from('fee_structure').select('*');
      if (!error && data && data.length > 0) return data as FeeStructure[];
    } catch {}
  }
  return getLocal('ga_fee_structure', initialFeeStructure);
}

// --- COURSES CRUD ---
export async function fetchAdminCourses(): Promise<Course[]> {
  if (isSupabaseConfigured) {
    try {
      const { data, error } = await supabase.from('courses').select('*').order('created_at', { ascending: false });
      if (!error && data && data.length > 0) return data as Course[];
    } catch {}
  }
  return getLocal('ga_admin_courses', defaultCourses);
}
export const fetchCourses = fetchAdminCourses;

export async function createCourse(course: Omit<Course, 'id'>): Promise<Course> {
  const newCourse: Course = {
    ...course,
    id: `c-${Date.now()}`
  };
  if (isSupabaseConfigured) {
    try {
      const { data, error } = await supabase.from('courses').insert([newCourse]).select().single();
      if (!error && data) return data as Course;
    } catch {}
  }
  const all = getLocal('ga_admin_courses', defaultCourses);
  all.unshift(newCourse);
  setLocal('ga_admin_courses', all);
  return newCourse;
}

export async function updateCourse(id: string, updates: Partial<Course>): Promise<void> {
  if (isSupabaseConfigured) {
    try {
      await supabase.from('courses').update(updates).eq('id', id);
    } catch {}
  }
  const all = getLocal('ga_admin_courses', defaultCourses);
  const idx = all.findIndex(c => c.id === id);
  if (idx !== -1) {
    all[idx] = { ...all[idx], ...updates };
    setLocal('ga_admin_courses', all);
  }
}

export async function deleteCourse(id: string): Promise<void> {
  if (isSupabaseConfigured) {
    try {
      await supabase.from('courses').delete().eq('id', id);
    } catch {}
  }
  const all = getLocal('ga_admin_courses', defaultCourses);
  const filtered = all.filter(c => c.id !== id);
  setLocal('ga_admin_courses', filtered);
}

// --- EVENTS CRUD ---
export async function fetchAdminEvents(): Promise<EventItem[]> {
  if (isSupabaseConfigured) {
    try {
      const { data, error } = await supabase.from('events').select('*').order('date', { ascending: true });
      if (!error && data && data.length > 0) return data as EventItem[];
    } catch {}
  }
  return getLocal('ga_admin_events', defaultEvents);
}
export const fetchEvents = fetchAdminEvents;

export async function createEvent(event: Omit<EventItem, 'id'>): Promise<EventItem> {
  const newEvent: EventItem = {
    ...event,
    id: `ev-${Date.now()}`
  };
  if (isSupabaseConfigured) {
    try {
      const { data, error } = await supabase.from('events').insert([newEvent]).select().single();
      if (!error && data) return data as EventItem;
    } catch {}
  }
  const all = getLocal('ga_admin_events', defaultEvents);
  all.unshift(newEvent);
  setLocal('ga_admin_events', all);
  return newEvent;
}

export async function updateEvent(id: string, updates: Partial<EventItem>): Promise<void> {
  if (isSupabaseConfigured) {
    try {
      await supabase.from('events').update(updates).eq('id', id);
    } catch {}
  }
  const all = getLocal('ga_admin_events', defaultEvents);
  const idx = all.findIndex(e => e.id === id);
  if (idx !== -1) {
    all[idx] = { ...all[idx], ...updates };
    setLocal('ga_admin_events', all);
  }
}

export async function deleteEvent(id: string): Promise<void> {
  if (isSupabaseConfigured) {
    try {
      await supabase.from('events').delete().eq('id', id);
    } catch {}
  }
  const all = getLocal('ga_admin_events', defaultEvents);
  setLocal('ga_admin_events', all.filter(e => e.id !== id));
}

// --- VIDEO LECTURE DELETE ---
export async function deleteVideoLecture(id: string): Promise<void> {
  if (isSupabaseConfigured) {
    try {
      await supabase.from('video_lectures').delete().eq('id', id);
    } catch {}
  }
  const all = getLocal('ga_video_lectures', initialVideoLectures);
  setLocal('ga_video_lectures', all.filter(v => v.id !== id));
}

// --- ALL RESULTS (FOR GOVERNANCE) ---
export async function fetchAllResults(): Promise<Result[]> {
  if (isSupabaseConfigured) {
    try {
      const { data, error } = await supabase.from('results').select('*');
      if (!error && data && data.length > 0) return data as Result[];
    } catch {}
  }
  return getLocal('ga_results', initialResults);
}

export async function deleteStudentResult(id: string): Promise<void> {
  if (isSupabaseConfigured) {
    try {
      await supabase.from('results').delete().eq('id', id);
    } catch {}
  }
  const all = getLocal('ga_results', initialResults);
  setLocal('ga_results', all.filter(r => r.id !== id));
}

// --- ALL ATTENDANCE (FOR AUDIT & REPORTING) ---
export async function fetchAllAttendance(): Promise<Attendance[]> {
  if (isSupabaseConfigured) {
    try {
      const { data, error } = await supabase.from('attendance').select('*').order('date', { ascending: false });
      if (!error && data && data.length > 0) return data as Attendance[];
    } catch {}
  }
  return getLocal('ga_attendance', initialAttendanceRecords);
}

// --- SITE SETTINGS ---
export async function fetchSiteSettingsData(): Promise<Record<string, string>> {
  let result: Record<string, string> = {};
  if (isSupabaseConfigured) {
    try {
      const { data, error } = await supabase.from('site_settings').select('*');
      if (!error && data && data.length > 0) {
        data.forEach((r: any) => { result[r.key] = r.value; });
      }
    } catch {}
  }
  if (!result || Object.keys(result).length === 0) {
    result = getLocal('ga_site_settings', defaultSiteSettings);
  }

  // Ensure every field has zero Urdu
  let hasUrdu = false;
  Object.keys(result).forEach(key => {
    if (typeof result[key] === 'string' && HAS_URDU_CHAR.test(result[key])) {
      result[key] = defaultSiteSettings[key] || 'Quality Education — Inspiring Women Leaders';
      hasUrdu = true;
    }
  });
  if (hasUrdu) {
    setLocal('ga_site_settings', result);
  }
  return result;
}

export async function updateSiteSettingsData(newSettings: Record<string, string>): Promise<void> {
  if (isSupabaseConfigured) {
    try {
      const rows = Object.entries(newSettings).map(([key, value]) => ({ key, value }));
      await supabase.from('site_settings').upsert(rows, { onConflict: 'key' });
    } catch {}
  }
  setLocal('ga_site_settings', newSettings);
}

// --- USER STATUS TOGGLE ---
export async function toggleUserStatus(id: string, is_active: boolean): Promise<void> {
  if (isSupabaseConfigured) {
    try {
      await supabase.from('profiles').update({ is_active }).eq('id', id);
    } catch {}
  }
  const all = getLocal<Profile[]>('ga_users', Object.values(demoProfiles));
  const u = all.find(x => x.id === id);
  if (u) {
    u.is_active = is_active;
    setLocal('ga_users', all);
  }
}

// --- USER PASSWORD MANAGEMENT ---
export function getUserCustomPassword(email: string): string | null {
  const passwords = getLocal<Record<string, string>>('ga_user_passwords', {});
  return passwords[email.trim().toLowerCase()] || null;
}

export async function setUserPassword(email: string, newPassword: string): Promise<void> {
  const cleanEmail = email.trim().toLowerCase();
  const passwords = getLocal<Record<string, string>>('ga_user_passwords', {});
  passwords[cleanEmail] = newPassword;
  setLocal('ga_user_passwords', passwords);

  // Sync role-specific legacy keys for demo logins
  if (cleanEmail.includes('admin')) {
    localStorage.setItem('ga_admin_secret_pass', newPassword);
  } else if (cleanEmail.includes('teacher')) {
    localStorage.setItem('ga_teacher_secret_pass', newPassword);
  } else if (cleanEmail.includes('parent')) {
    localStorage.setItem('ga_parent_secret_pass', newPassword);
  } else if (cleanEmail.includes('student')) {
    localStorage.setItem('ga_student_secret_pass', newPassword);
  }
}

// --- USER EDIT & DELETE ---
export async function updateUserAccount(id: string, updates: Partial<Profile>): Promise<void> {
  if (isSupabaseConfigured) {
    try {
      await supabase.from('profiles').update(updates).eq('id', id);
    } catch (err) {
      console.warn('Supabase update user warning:', err);
    }
  }
  const all = getLocal<Profile[]>('ga_users', Object.values(demoProfiles));
  const index = all.findIndex(u => u.id === id);
  if (index !== -1) {
    all[index] = { ...all[index], ...updates };
    setLocal('ga_users', all);
  }
  // If editing demo profiles directly, keep demoProfiles updated in memory/storage
  const matchingKey = Object.keys(demoProfiles).find(k => demoProfiles[k].id === id);
  if (matchingKey) {
    demoProfiles[matchingKey] = { ...demoProfiles[matchingKey], ...updates };
  }
}

export async function deleteUserAccount(id: string): Promise<void> {
  if (isSupabaseConfigured) {
    try {
      await supabase.from('profiles').delete().eq('id', id);
    } catch (err) {
      console.warn('Supabase delete user warning:', err);
    }
  }
  const all = getLocal<Profile[]>('ga_users', Object.values(demoProfiles));
  setLocal('ga_users', all.filter(u => u.id !== id));
}

// ==========================================
// STUDENT PERSONALIZED DATA CRUD
// ==========================================
export interface StudentPersonalNote {
  id: string;
  student_id: string;
  title: string;
  subject: string;
  content: string;
  date: string;
  tag?: string;
}

export interface StudentLeaveApplication {
  id: string;
  student_id: string;
  student_name: string;
  reason: string;
  start_date: string;
  end_date: string;
  status: 'Pending' | 'Approved' | 'Rejected';
  submitted_at: string;
}

export interface StudentGoal {
  id: string;
  student_id: string;
  title: string;
  target_grade: string;
  completed: boolean;
  deadline?: string;
}

export function fetchStudentPersonalNotes(studentId: string): StudentPersonalNote[] {
  const defaultNotes: StudentPersonalNote[] = [
    {
      id: 'note-1',
      student_id: studentId,
      title: 'Physics Kinematics Key Formulas',
      subject: 'Physics',
      content: 'v = u + at, s = ut + 0.5at^2, 2as = v^2 - u^2. Revise numerical problems from chapter 2.',
      date: '2026-10-06',
      tag: 'Formula Sheet'
    },
    {
      id: 'note-2',
      student_id: studentId,
      title: 'Biology Plant vs Animal Cell Diagrams',
      subject: 'Biology',
      content: 'Focus on chloroplast structure, vacuole size, and cell wall differences for upcoming term assessment.',
      date: '2026-10-04',
      tag: 'Diagrams'
    }
  ];
  return getLocal<StudentPersonalNote[]>(`ga_student_notes_${studentId}`, defaultNotes);
}

export function saveStudentPersonalNote(note: Omit<StudentPersonalNote, 'id'>): StudentPersonalNote {
  const newNote: StudentPersonalNote = {
    ...note,
    id: `sn-${Date.now()}`
  };
  const list = fetchStudentPersonalNotes(note.student_id);
  list.unshift(newNote);
  setLocal(`ga_student_notes_${note.student_id}`, list);
  return newNote;
}

export function deleteStudentPersonalNote(studentId: string, noteId: string): void {
  const list = fetchStudentPersonalNotes(studentId);
  setLocal(`ga_student_notes_${studentId}`, list.filter(n => n.id !== noteId));
}

export function fetchStudentLeaveApplications(studentId: string): StudentLeaveApplication[] {
  const defaultLeaves: StudentLeaveApplication[] = [
    {
      id: 'leave-1',
      student_id: studentId,
      student_name: 'Fatima Bibi',
      reason: 'Family wedding event attendance in Lahore',
      start_date: '2026-10-15',
      end_date: '2026-10-16',
      status: 'Approved',
      submitted_at: '2026-10-02'
    }
  ];
  return getLocal<StudentLeaveApplication[]>(`ga_student_leaves_${studentId}`, defaultLeaves);
}

export function submitStudentLeaveApplication(leave: Omit<StudentLeaveApplication, 'id' | 'status' | 'submitted_at'>): StudentLeaveApplication {
  const newLeave: StudentLeaveApplication = {
    ...leave,
    id: `leave-${Date.now()}`,
    status: 'Pending',
    submitted_at: new Date().toISOString().split('T')[0]
  };
  const list = fetchStudentLeaveApplications(leave.student_id);
  list.unshift(newLeave);
  setLocal(`ga_student_leaves_${leave.student_id}`, list);
  return newLeave;
}

export function fetchStudentGoals(studentId: string): StudentGoal[] {
  const defaultGoals: StudentGoal[] = [
    { id: 'g-1', student_id: studentId, title: 'Achieve 98% in BISE Matric Physics', target_grade: 'A+', completed: false, deadline: '2026-11-20' },
    { id: 'g-2', student_id: studentId, title: 'Complete All Chemistry Lab Practical Files', target_grade: 'Completed', completed: true, deadline: '2026-10-10' },
    { id: 'g-3', student_id: studentId, title: 'Read English Compulsory Grammar Handbook', target_grade: 'A', completed: false, deadline: '2026-10-30' },
  ];
  return getLocal<StudentGoal[]>(`ga_student_goals_${studentId}`, defaultGoals);
}

export function saveStudentGoal(goal: Omit<StudentGoal, 'id'>): StudentGoal {
  const newGoal: StudentGoal = {
    ...goal,
    id: `goal-${Date.now()}`
  };
  const list = fetchStudentGoals(goal.student_id);
  list.unshift(newGoal);
  setLocal(`ga_student_goals_${goal.student_id}`, list);
  return newGoal;
}

export function toggleStudentGoal(studentId: string, goalId: string): void {
  const list = fetchStudentGoals(studentId);
  const updated = list.map(g => g.id === goalId ? { ...g, completed: !g.completed } : g);
  setLocal(`ga_student_goals_${studentId}`, updated);
}

export function deleteStudentGoal(studentId: string, goalId: string): void {
  const list = fetchStudentGoals(studentId);
  setLocal(`ga_student_goals_${studentId}`, list.filter(g => g.id !== goalId));
}

// ==========================================
// PARENT PERSONALIZED DATA CRUD
// ==========================================
export interface ParentChildData {
  child_name: string;
  roll_number: string;
  grade_class: string;
  section: string;
  blood_group?: string;
  emergency_phone?: string;
  doctor_note?: string;
}

export interface ParentFeePaymentRecord {
  id: string;
  parent_id: string;
  invoice_number: string;
  child_name: string;
  amount_paid: number;
  bank_name: string;
  slip_reference: string;
  payment_date: string;
  status: 'Verified' | 'Under Review';
}

export interface ParentFeedbackItem {
  id: string;
  parent_id: string;
  parent_name: string;
  subject: string;
  message: string;
  submitted_at: string;
  status: 'Received' | 'Answered';
}

export function fetchParentChildData(parentId: string): ParentChildData {
  const defaultData: ParentChildData = {
    child_name: 'Fatima Bibi',
    roll_number: 'GA-10S-042',
    grade_class: 'Class 10 (Matric Science)',
    section: 'Section Rose',
    blood_group: 'B+',
    emergency_phone: '0302-3456789',
    doctor_note: 'No known allergies. Fits medical clearance.'
  };
  return getLocal<ParentChildData>(`ga_parent_child_${parentId}`, defaultData);
}

export function saveParentChildData(parentId: string, data: ParentChildData): ParentChildData {
  setLocal(`ga_parent_child_${parentId}`, data);
  return data;
}

export function fetchParentFeePayments(parentId: string): ParentFeePaymentRecord[] {
  const defaultPayments: ParentFeePaymentRecord[] = [
    {
      id: 'pay-1',
      parent_id: parentId,
      invoice_number: 'INV-2026-1042',
      child_name: 'Fatima Bibi',
      amount_paid: 4500,
      bank_name: 'Habib Bank Limited (HBL) - Sector G-11',
      slip_reference: 'HBL-982341-PK',
      payment_date: '2026-10-04',
      status: 'Verified'
    }
  ];
  return getLocal<ParentFeePaymentRecord[]>(`ga_parent_payments_${parentId}`, defaultPayments);
}

export function submitParentFeePayment(payment: Omit<ParentFeePaymentRecord, 'id' | 'status'>): ParentFeePaymentRecord {
  const newPayment: ParentFeePaymentRecord = {
    ...payment,
    id: `pay-${Date.now()}`,
    status: 'Under Review'
  };
  const list = fetchParentFeePayments(payment.parent_id);
  list.unshift(newPayment);
  setLocal(`ga_parent_payments_${payment.parent_id}`, list);
  return newPayment;
}

export function fetchParentFeedback(parentId: string): ParentFeedbackItem[] {
  const defaultFeedback: ParentFeedbackItem[] = [
    {
      id: 'fb-1',
      parent_id: parentId,
      parent_name: 'Mr. Mohammad Akram',
      subject: 'Inquiry regarding Saturday STEM Practical Timings',
      message: 'Kindly advise if the physics laboratory sessions on Saturdays start at 9:00 AM or 10:00 AM.',
      submitted_at: '2026-10-05',
      status: 'Answered'
    }
  ];
  return getLocal<ParentFeedbackItem[]>(`ga_parent_feedback_${parentId}`, defaultFeedback);
}

export function submitParentFeedback(feedback: Omit<ParentFeedbackItem, 'id' | 'status' | 'submitted_at'>): ParentFeedbackItem {
  const newFb: ParentFeedbackItem = {
    ...feedback,
    id: `fb-${Date.now()}`,
    status: 'Received',
    submitted_at: new Date().toISOString().split('T')[0]
  };
  const list = fetchParentFeedback(feedback.parent_id);
  list.unshift(newFb);
  setLocal(`ga_parent_feedback_${feedback.parent_id}`, list);
  return newFb;
}

// --- BLOG EDIT & DELETE ---
export async function updateBlogPost(id: string, updates: Partial<BlogPost>): Promise<BlogPost> {
  const now = new Date().toISOString();
  let updatedPost: BlogPost | null = null;
  if (isSupabaseConfigured) {
    try {
      const { data, error } = await supabase.from('blog_posts').update({ ...updates, updated_at: now }).eq('id', id).select().single();
      if (!error && data) updatedPost = data as BlogPost;
    } catch {}
  }
  const all = getLocal<BlogPost[]>('ga_blog_posts', initialBlogPosts);
  const idx = all.findIndex(p => p.id === id);
  if (idx !== -1) {
    all[idx] = { ...all[idx], ...updates, updated_at: now };
    setLocal('ga_blog_posts', all);
    if (!updatedPost) updatedPost = all[idx];
  }
  return updatedPost || { id, ...updates } as BlogPost;
}

export async function deleteBlogPost(id: string): Promise<void> {
  if (isSupabaseConfigured) {
    try {
      await supabase.from('blog_posts').delete().eq('id', id);
    } catch {}
  }
  const all = getLocal<BlogPost[]>('ga_blog_posts', initialBlogPosts);
  setLocal('ga_blog_posts', all.filter(p => p.id !== id));
}

// --- VIDEO LECTURE EDIT ---
export async function updateVideoLecture(id: string, updates: Partial<VideoLecture>): Promise<void> {
  if (isSupabaseConfigured) {
    try {
      await supabase.from('video_lectures').update(updates).eq('id', id);
    } catch {}
  }
  const all = getLocal<VideoLecture[]>('ga_video_lectures', initialVideoLectures);
  const idx = all.findIndex(v => v.id === id);
  if (idx !== -1) {
    all[idx] = { ...all[idx], ...updates };
    setLocal('ga_video_lectures', all);
  }
}

// --- RESULTS EDIT & DELETE ---
export async function updateResultRecord(id: string, marks_obtained: number, grade?: string): Promise<void> {
  if (isSupabaseConfigured) {
    try {
      await supabase.from('results').update({ marks_obtained, grade }).eq('id', id);
    } catch {}
  }
  const all = getLocal<Result[]>('ga_results', initialResults);
  const idx = all.findIndex(r => r.id === id);
  if (idx !== -1) {
    all[idx] = { ...all[idx], marks_obtained, grade: grade || all[idx].grade };
    setLocal('ga_results', all);
  }
}

export async function deleteResultRecord(id: string): Promise<void> {
  if (isSupabaseConfigured) {
    try {
      await supabase.from('results').delete().eq('id', id);
    } catch {}
  }
  const all = getLocal<Result[]>('ga_results', initialResults);
  setLocal('ga_results', all.filter(r => r.id !== id));
}

// --- ATTENDANCE EDIT & DELETE ---
export async function updateAttendanceRecord(id: string, status: Attendance['status']): Promise<void> {
  if (isSupabaseConfigured) {
    try {
      await supabase.from('attendance').update({ status }).eq('id', id);
    } catch {}
  }
  const all = getLocal<Attendance[]>('ga_attendance', initialAttendanceRecords);
  const idx = all.findIndex(a => a.id === id);
  if (idx !== -1) {
    all[idx] = { ...all[idx], status };
    setLocal('ga_attendance', all);
  }
}

export async function deleteAttendanceRecord(id: string): Promise<void> {
  if (isSupabaseConfigured) {
    try {
      await supabase.from('attendance').delete().eq('id', id);
    } catch {}
  }
  const all = getLocal<Attendance[]>('ga_attendance', initialAttendanceRecords);
  setLocal('ga_attendance', all.filter(a => a.id !== id));
}

// --- NOTIFICATIONS EDIT & DELETE ---
export async function updateNotification(id: string, updates: Partial<Notification>): Promise<void> {
  if (isSupabaseConfigured) {
    try {
      await supabase.from('notifications').update(updates).eq('id', id);
    } catch {}
  }
  const all = getLocal<Notification[]>('ga_notifications', initialNotifications);
  const idx = all.findIndex(n => n.id === id);
  if (idx !== -1) {
    all[idx] = { ...all[idx], ...updates };
    setLocal('ga_notifications', all);
  }
}

export async function deleteNotification(id: string): Promise<void> {
  if (isSupabaseConfigured) {
    try {
      await supabase.from('notifications').delete().eq('id', id);
    } catch {}
  }
  const all = getLocal<Notification[]>('ga_notifications', initialNotifications);
  setLocal('ga_notifications', all.filter(n => n.id !== id));
}

// --- GALLERY EDIT & DELETE ---
export async function updateGalleryItem(id: string, updates: Partial<GalleryItem>): Promise<void> {
  if (isSupabaseConfigured) {
    try {
      await supabase.from('gallery').update(updates).eq('id', id);
    } catch {}
  }
  const all = getLocal<GalleryItem[]>('ga_gallery', initialGallery);
  const idx = all.findIndex(g => g.id === id);
  if (idx !== -1) {
    all[idx] = { ...all[idx], ...updates };
    setLocal('ga_gallery', all);
  }
}

export async function deleteGalleryItem(id: string): Promise<void> {
  if (isSupabaseConfigured) {
    try {
      await supabase.from('gallery').delete().eq('id', id);
    } catch {}
  }
  const all = getLocal<GalleryItem[]>('ga_gallery', initialGallery);
  setLocal('ga_gallery', all.filter(g => g.id !== id));
}

// --- CHAT INQUIRIES (CLIENT CHATBOT LEADS) ---
export const initialInquiries: ChatInquiry[] = [
  {
    id: 'inq-1',
    name: 'Mrs. Fatima Zahra',
    contact: '+92 300 1234567',
    message: 'Seeking admission for Grade 9 pre-medical for Fall 2026 session.',
    status: 'new',
    created_at: new Date(Date.now() - 3600000 * 2).toISOString()
  },
  {
    id: 'inq-2',
    name: 'Tariq Mehmood',
    contact: 'tariq.m@example.com',
    message: 'Inquiring about robotics lab facilities and merit scholarship eligibility.',
    status: 'contacted',
    created_at: new Date(Date.now() - 3600000 * 24).toISOString()
  }
];

export async function fetchChatInquiries(): Promise<ChatInquiry[]> {
  if (isSupabaseConfigured) {
    try {
      const { data, error } = await supabase.from('chat_inquiries').select('*').order('created_at', { ascending: false });
      if (!error && data && data.length > 0) return data as ChatInquiry[];
    } catch {}
  }
  return getLocal<ChatInquiry[]>('ga_chat_inquiries', initialInquiries);
}

export async function saveChatInquiry(inquiry: Omit<ChatInquiry, 'id' | 'status' | 'created_at'>): Promise<ChatInquiry> {
  const newInq: ChatInquiry = {
    ...inquiry,
    id: `inq-${Date.now()}`,
    status: 'new',
    created_at: new Date().toISOString()
  };
  if (isSupabaseConfigured) {
    try {
      await supabase.from('chat_inquiries').insert([newInq]);
    } catch {}
  }
  const all = getLocal<ChatInquiry[]>('ga_chat_inquiries', initialInquiries);
  all.unshift(newInq);
  setLocal('ga_chat_inquiries', all);
  return newInq;
}

export async function updateChatInquiryStatus(id: string, status: ChatInquiry['status']): Promise<void> {
  if (isSupabaseConfigured) {
    try {
      await supabase.from('chat_inquiries').update({ status }).eq('id', id);
    } catch {}
  }
  const all = getLocal<ChatInquiry[]>('ga_chat_inquiries', initialInquiries);
  const idx = all.findIndex(i => i.id === id);
  if (idx !== -1) {
    all[idx].status = status;
    setLocal('ga_chat_inquiries', all);
  }
}

export async function deleteChatInquiry(id: string): Promise<void> {
  if (isSupabaseConfigured) {
    try {
      await supabase.from('chat_inquiries').delete().eq('id', id);
    } catch {}
  }
  const all = getLocal<ChatInquiry[]>('ga_chat_inquiries', initialInquiries);
  setLocal('ga_chat_inquiries', all.filter(i => i.id !== id));
}

// ==========================================
// TERMS CRUD
// ==========================================
export async function fetchTerms(): Promise<Term[]> {
  if (isSupabaseConfigured) {
    try {
      const { data, error } = await supabase.from('terms').select('*').order('start_date', { ascending: true });
      if (!error && data && data.length > 0) return data as Term[];
    } catch {}
  }
  return getLocal<Term[]>('ga_terms', initialTerms);
}

export async function createTerm(term: Omit<Term, 'id'>): Promise<Term> {
  const newTerm: Term = { ...term, id: `term-${Date.now()}` };
  if (isSupabaseConfigured) {
    try {
      const { data, error } = await supabase.from('terms').insert([newTerm]).select().single();
      if (!error && data) return data as Term;
    } catch {}
  }
  const all = getLocal<Term[]>('ga_terms', initialTerms);
  all.push(newTerm);
  setLocal('ga_terms', all);
  return newTerm;
}

export async function updateTerm(id: string, updates: Partial<Term>): Promise<void> {
  if (isSupabaseConfigured) {
    try {
      await supabase.from('terms').update(updates).eq('id', id);
    } catch {}
  }
  const all = getLocal<Term[]>('ga_terms', initialTerms);
  const idx = all.findIndex(t => t.id === id);
  if (idx !== -1) {
    all[idx] = { ...all[idx], ...updates };
    setLocal('ga_terms', all);
  }
}

export async function deleteTerm(id: string): Promise<void> {
  if (isSupabaseConfigured) {
    try {
      await supabase.from('terms').delete().eq('id', id);
    } catch {}
  }
  const all = getLocal<Term[]>('ga_terms', initialTerms);
  setLocal('ga_terms', all.filter(t => t.id !== id));
}

// ==========================================
// CLASSES CRUD
// ==========================================
export async function fetchClasses(): Promise<SchoolClass[]> {
  if (isSupabaseConfigured) {
    try {
      const { data, error } = await supabase.from('classes').select('*').order('name', { ascending: true });
      if (!error && data && data.length > 0) return data as SchoolClass[];
    } catch {}
  }
  return getLocal<SchoolClass[]>('ga_classes', initialClasses);
}

export async function createClass(cls: Omit<SchoolClass, 'id' | 'created_at'>): Promise<SchoolClass> {
  const newClass: SchoolClass = { ...cls, id: `class-${Date.now()}`, created_at: new Date().toISOString() };
  if (isSupabaseConfigured) {
    try {
      const { data, error } = await supabase.from('classes').insert([newClass]).select().single();
      if (!error && data) return data as SchoolClass;
    } catch {}
  }
  const all = getLocal<SchoolClass[]>('ga_classes', initialClasses);
  all.push(newClass);
  setLocal('ga_classes', all);
  return newClass;
}

export async function updateClass(id: string, updates: Partial<SchoolClass>): Promise<void> {
  if (isSupabaseConfigured) {
    try {
      await supabase.from('classes').update(updates).eq('id', id);
    } catch {}
  }
  const all = getLocal<SchoolClass[]>('ga_classes', initialClasses);
  const idx = all.findIndex(c => c.id === id);
  if (idx !== -1) {
    all[idx] = { ...all[idx], ...updates };
    setLocal('ga_classes', all);
  }
}

export async function deleteClass(id: string): Promise<void> {
  if (isSupabaseConfigured) {
    try {
      await supabase.from('classes').delete().eq('id', id);
    } catch {}
  }
  const all = getLocal<SchoolClass[]>('ga_classes', initialClasses);
  setLocal('ga_classes', all.filter(c => c.id !== id));
}

// ==========================================
// SUBJECTS CRUD
// ==========================================
export async function fetchSubjects(courseId?: string): Promise<Subject[]> {
  if (isSupabaseConfigured) {
    try {
      let q = supabase.from('subjects').select('*').order('name', { ascending: true });
      if (courseId) q = q.eq('course_id', courseId);
      const { data, error } = await q;
      if (!error && data && data.length > 0) return data as Subject[];
    } catch {}
  }
  const all = getLocal<Subject[]>('ga_subjects', initialSubjects);
  return courseId ? all.filter(s => s.course_id === courseId) : all;
}

export async function createSubject(subj: Omit<Subject, 'id' | 'created_at'>): Promise<Subject> {
  const newSubj: Subject = { ...subj, id: `subj-${Date.now()}`, created_at: new Date().toISOString() };
  if (isSupabaseConfigured) {
    try {
      const { data, error } = await supabase.from('subjects').insert([newSubj]).select().single();
      if (!error && data) return data as Subject;
    } catch {}
  }
  const all = getLocal<Subject[]>('ga_subjects', initialSubjects);
  all.push(newSubj);
  setLocal('ga_subjects', all);
  return newSubj;
}

export async function updateSubject(id: string, updates: Partial<Subject>): Promise<void> {
  if (isSupabaseConfigured) {
    try {
      await supabase.from('subjects').update(updates).eq('id', id);
    } catch {}
  }
  const all = getLocal<Subject[]>('ga_subjects', initialSubjects);
  const idx = all.findIndex(s => s.id === id);
  if (idx !== -1) {
    all[idx] = { ...all[idx], ...updates };
    setLocal('ga_subjects', all);
  }
}

export async function deleteSubject(id: string): Promise<void> {
  if (isSupabaseConfigured) {
    try {
      await supabase.from('subjects').delete().eq('id', id);
    } catch {}
  }
  const all = getLocal<Subject[]>('ga_subjects', initialSubjects);
  setLocal('ga_subjects', all.filter(s => s.id !== id));
}

// ==========================================
// GRADING SCALES (PAKISTAN STANDARD)
// ==========================================
export const defaultGradingScales: GradingScale[] = [
  { id: 'gr-1', min_marks: 90, max_marks: 100, grade: 'A+', gpa: 4.00, remarks: 'Outstanding' },
  { id: 'gr-2', min_marks: 80, max_marks: 89, grade: 'A', gpa: 4.00, remarks: 'Excellent' },
  { id: 'gr-3', min_marks: 70, max_marks: 79, grade: 'B', gpa: 3.00, remarks: 'Good' },
  { id: 'gr-4', min_marks: 60, max_marks: 69, grade: 'C', gpa: 2.00, remarks: 'Satisfactory' },
  { id: 'gr-5', min_marks: 50, max_marks: 59, grade: 'D', gpa: 1.00, remarks: 'Pass' },
  { id: 'gr-6', min_marks: 33, max_marks: 49, grade: 'E', gpa: 0.50, remarks: 'Minimum Pass' },
  { id: 'gr-7', min_marks: 0, max_marks: 32, grade: 'F', gpa: 0.00, remarks: 'Fail' },
];

export async function fetchGradingScales(): Promise<GradingScale[]> {
  if (isSupabaseConfigured) {
    try {
      const { data, error } = await supabase.from('grading_scales').select('*').order('min_marks', { ascending: false });
      if (!error && data && data.length > 0) return data as GradingScale[];
    } catch {}
  }
  return getLocal<GradingScale[]>('ga_grading_scales', defaultGradingScales);
}

export async function createGradingScale(scale: Omit<GradingScale, 'id'>): Promise<GradingScale> {
  const newScale: GradingScale = { ...scale, id: `gr-${Date.now()}` };
  if (isSupabaseConfigured) {
    try {
      const { data, error } = await supabase.from('grading_scales').insert([newScale]).select().single();
      if (!error && data) return data as GradingScale;
    } catch {}
  }
  const all = getLocal<GradingScale[]>('ga_grading_scales', defaultGradingScales);
  all.push(newScale);
  all.sort((a, b) => b.min_marks - a.min_marks);
  setLocal('ga_grading_scales', all);
  return newScale;
}

export async function updateGradingScale(id: string, updates: Partial<GradingScale>): Promise<void> {
  if (isSupabaseConfigured) {
    try {
      await supabase.from('grading_scales').update(updates).eq('id', id);
    } catch {}
  }
  const all = getLocal<GradingScale[]>('ga_grading_scales', defaultGradingScales);
  const idx = all.findIndex(g => g.id === id);
  if (idx !== -1) {
    all[idx] = { ...all[idx], ...updates };
    all.sort((a, b) => b.min_marks - a.min_marks);
    setLocal('ga_grading_scales', all);
  }
}

export async function deleteGradingScale(id: string): Promise<void> {
  if (isSupabaseConfigured) {
    try {
      await supabase.from('grading_scales').delete().eq('id', id);
    } catch {}
  }
  const all = getLocal<GradingScale[]>('ga_grading_scales', defaultGradingScales);
  setLocal('ga_grading_scales', all.filter(g => g.id !== id));
}

// ==========================================
// FEE STRUCTURE CRUD
// ==========================================
export async function createFeeStructure(fee: Omit<FeeStructure, 'id' | 'created_at'>): Promise<FeeStructure> {
  const newFee: FeeStructure = { ...fee, id: `fee-${Date.now()}`, created_at: new Date().toISOString() };
  if (isSupabaseConfigured) {
    try {
      const { data, error } = await supabase.from('fee_structure').insert([newFee]).select().single();
      if (!error && data) return data as FeeStructure;
    } catch {}
  }
  const all = getLocal<FeeStructure[]>('ga_fee_structure', initialFeeStructure);
  all.push(newFee);
  setLocal('ga_fee_structure', all);
  return newFee;
}

export async function updateFeeStructure(id: string, updates: Partial<FeeStructure>): Promise<void> {
  if (isSupabaseConfigured) {
    try {
      await supabase.from('fee_structure').update(updates).eq('id', id);
    } catch {}
  }
  const all = getLocal<FeeStructure[]>('ga_fee_structure', initialFeeStructure);
  const idx = all.findIndex(f => f.id === id);
  if (idx !== -1) {
    all[idx] = { ...all[idx], ...updates };
    setLocal('ga_fee_structure', all);
  }
}

export async function deleteFeeStructure(id: string): Promise<void> {
  if (isSupabaseConfigured) {
    try {
      await supabase.from('fee_structure').delete().eq('id', id);
    } catch {}
  }
  const all = getLocal<FeeStructure[]>('ga_fee_structure', initialFeeStructure);
  setLocal('ga_fee_structure', all.filter(f => f.id !== id));
}

// ==========================================
// TESTIMONIALS CRUD
// ==========================================
export async function fetchTestimonials(): Promise<Testimonial[]> {
  if (isSupabaseConfigured) {
    try {
      const { data, error } = await supabase.from('testimonials').select('*');
      if (!error && data && data.length > 0) return data as Testimonial[];
    } catch {}
  }
  return getLocal<Testimonial[]>('ga_testimonials', defaultTestimonials);
}

export async function createTestimonial(testimonial: Omit<Testimonial, 'id'>): Promise<Testimonial> {
  const newT: Testimonial = { ...testimonial, id: `t-${Date.now()}` };
  if (isSupabaseConfigured) {
    try {
      const { data, error } = await supabase.from('testimonials').insert([newT]).select().single();
      if (!error && data) return data as Testimonial;
    } catch {}
  }
  const all = getLocal<Testimonial[]>('ga_testimonials', defaultTestimonials);
  all.unshift(newT);
  setLocal('ga_testimonials', all);
  return newT;
}

export async function updateTestimonial(id: string, updates: Partial<Testimonial>): Promise<void> {
  if (isSupabaseConfigured) {
    try {
      await supabase.from('testimonials').update(updates).eq('id', id);
    } catch {}
  }
  const all = getLocal<Testimonial[]>('ga_testimonials', defaultTestimonials);
  const idx = all.findIndex(t => t.id === id);
  if (idx !== -1) {
    all[idx] = { ...all[idx], ...updates };
    setLocal('ga_testimonials', all);
  }
}

export async function deleteTestimonial(id: string): Promise<void> {
  if (isSupabaseConfigured) {
    try {
      await supabase.from('testimonials').delete().eq('id', id);
    } catch {}
  }
  const all = getLocal<Testimonial[]>('ga_testimonials', defaultTestimonials);
  setLocal('ga_testimonials', all.filter(t => t.id !== id));
}

// ==========================================
// CHATBOT SETTINGS (DATABASE DRIVEN)
// ==========================================
export const defaultChatbotSettings: ChatbotSettings = {
  is_enabled: true,
  bot_name: 'GA Student Assistant',
  welcome_message: 'Welcome to Girls Academy Islamabad! I am your campus AI advisor. How may I assist you today?',
  primary_color: '#7c3aed',
  position: 'bottom-right',
  faqs: [
    { question: 'How can I apply for admission?', answer: 'You can apply online via the Admissions section on our website. The online inquiry and application form is free of charge.' },
    { question: 'What is the fee structure?', answer: 'Primary: Rs. 3,000/mo | Middle: Rs. 3,500/mo | Matric: Rs. 4,000-4,500/mo | FSc/FA/ICS: Rs. 4,500-5,500/mo. Merit scholarships available.' },
    { question: 'What are the campus timings?', answer: 'Regular classes run Monday through Friday from 8:00 AM to 2:00 PM, with dedicated tutorial sessions on Saturdays.' },
    { question: 'Which educational board is the Academy affiliated with?', answer: 'Girls Academy is officially affiliated with BISE Islamabad and the Federal Board of Education (FBISE).' },
    { question: 'Which academic programs are offered?', answer: 'We offer Primary, Middle, Matric (Science, Arts, Commerce), FSc (Pre-Medical & Pre-Engineering), FA, ICS (Computer Science), and I.Com.' },
    { question: 'What are your official contact details?', answer: 'Phone: 051-4861234 | WhatsApp: 0300-4861234 | Email: info@girlsacademy.edu.pk | Campus: Sector G-11/2, Islamabad.' },
    { question: 'What is the admission deadline?', answer: 'Admissions for Session 2026-2027 are currently open through March 31, 2026. Early application is recommended as seats are limited.' },
    { question: 'When is the monthly fee due?', answer: 'Monthly tuition fees are payable by the 10th of every calendar month through designated bank branches or the online parent portal.' },
    { question: 'Is hostel accommodation provided?', answer: 'Hostel accommodation is currently unavailable. Dedicated, GPS-tracked transport van service is available across all Islamabad and Rawalpindi sectors.' },
    { question: 'How can students check term results?', answer: 'Exam and quiz results are accessible anytime through the Student and Parent Portals in your dashboard.' }
  ]
};

export async function fetchChatbotSettings(): Promise<ChatbotSettings> {
  let config: ChatbotSettings | null = null;
  if (isSupabaseConfigured) {
    try {
      const { data, error } = await supabase.from('chatbot_settings').select('*').single();
      if (!error && data) config = data as ChatbotSettings;
    } catch {}
  }
  if (!config) {
    config = getLocal<ChatbotSettings>('ga_chatbot_settings', defaultChatbotSettings);
  }

  // Ensure config has zero Urdu characters in bot_name, welcome_message, or faqs
  const rawStr = JSON.stringify(config);
  if (HAS_URDU_CHAR.test(rawStr) || !config.faqs || config.faqs.length === 0) {
    config = { ...defaultChatbotSettings };
    setLocal('ga_chatbot_settings', config);
  }

  return config;
}

export async function updateChatbotSettings(settings: Partial<ChatbotSettings>): Promise<ChatbotSettings> {
  const current = await fetchChatbotSettings();
  const updated: ChatbotSettings = { ...current, ...settings, updated_at: new Date().toISOString() };
  if (isSupabaseConfigured) {
    try {
      await supabase.from('chatbot_settings').upsert([updated]);
    } catch {}
  }
  setLocal('ga_chatbot_settings', updated);
  return updated;
}

// ==========================================
// STUDENTS & LINKED CHILDREN
// ==========================================
export const defaultStudents: (Student & { profile: Profile })[] = [
  {
    id: 'demo-student-uid-3',
    profile_id: 'demo-student-uid-3',
    roll_number: '2025-001',
    date_of_birth: '2010-04-12',
    address: 'Street 5, Sector G-11/2, Islamabad',
    profile: demoProfiles['student@girlsacademy.edu.pk']
  }
];

export async function fetchStudents(): Promise<(Student & { profile: Profile })[]> {
  return defaultStudents;
}

export async function fetchChildrenForParent(parentId: string): Promise<(Student & { profile: Profile })[]> {
  // Returns linked child (e.g. Zainab Fatima for demo parent Tariq Mahmood)
  return defaultStudents;
}


// ==========================================
// DYNAMIC WEBSITE CMS DATA & OPERATIONS
// ==========================================

export const defaultHeroSlides: HeroSlide[] = [
  {
    id: 'hero-1',
    heading: 'Welcome to Girls Academy',
    subheading: 'Quality Education for Girls in Islamabad, Pakistan',
    description: 'Empowering future women leaders through academic excellence, character building, and world-class STEM mentorship.',
    image_url: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=1600&q=80',
    button1_text: 'Apply Now',
    button1_link: '/admissions',
    button2_text: 'Learn More',
    button2_link: '/about',
    position: 1,
    is_active: true
  },
  {
    id: 'hero-2',
    heading: 'Admissions Open 2026-2027',
    subheading: 'Limited seats available — Enroll today',
    description: 'Admissions open for Nursery to Class 10 and Intermediate (FSc Pre-Medical, Pre-Engineering, ICS, I.Com & FA).',
    image_url: 'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?auto=format&fit=crop&w=1600&q=80',
    button1_text: 'Apply Now',
    button1_link: '/admissions',
    button2_text: 'View Programs',
    button2_link: '/courses',
    position: 2,
    is_active: true
  },
  {
    id: 'hero-3',
    heading: 'BISE Results 2025 — 95% Pass Rate',
    subheading: 'Our students achieve excellence every year',
    description: '1st Position & 42 A+ Grades in Islamabad. Congratulations to our teachers, parents, and brilliant scholars.',
    image_url: 'https://images.unsplash.com/photo-1577495508048-b635879837f1?auto=format&fit=crop&w=1600&q=80',
    button1_text: 'View Programs',
    button1_link: '/courses',
    button2_text: 'Contact Us',
    button2_link: '/contact',
    position: 3,
    is_active: true
  }
];

export async function fetchHeroSlides(onlyActive: boolean = false): Promise<HeroSlide[]> {
  if (isSupabaseConfigured) {
    try {
      let query = supabase.from('hero_slides').select('*').order('position', { ascending: true });
      if (onlyActive) {
        query = query.eq('is_active', true);
      }
      const { data, error } = await query;
      if (!error && data && data.length > 0) {
        setLocal('ga_hero_slides', data);
        return data as HeroSlide[];
      }
    } catch (e) {
      console.warn('Hero slides Supabase error:', e);
    }
  }
  const all = getLocal<HeroSlide[]>('ga_hero_slides', defaultHeroSlides);
  const filtered = onlyActive ? all.filter(s => s.is_active) : all;
  return filtered.sort((a, b) => a.position - b.position);
}

export async function createHeroSlide(slide: Omit<HeroSlide, 'id'>): Promise<HeroSlide> {
  const newId = 'hero-' + Date.now();
  const newRecord: HeroSlide = { ...slide, id: newId, created_at: new Date().toISOString() };
  if (isSupabaseConfigured) {
    try {
      const { data, error } = await supabase.from('hero_slides').insert([slide]).select().single();
      if (!error && data) {
        const all = getLocal<HeroSlide[]>('ga_hero_slides', defaultHeroSlides);
        setLocal('ga_hero_slides', [...all, data]);
        return data as HeroSlide;
      }
    } catch (e) {
      console.warn('Supabase createHeroSlide error:', e);
    }
  }
  const all = getLocal<HeroSlide[]>('ga_hero_slides', defaultHeroSlides);
  setLocal('ga_hero_slides', [...all, newRecord]);
  return newRecord;
}

export async function updateHeroSlide(id: string, updates: Partial<HeroSlide>): Promise<HeroSlide> {
  if (isSupabaseConfigured) {
    try {
      const { data, error } = await supabase.from('hero_slides').update(updates).eq('id', id).select().single();
      if (!error && data) {
        const all = getLocal<HeroSlide[]>('ga_hero_slides', defaultHeroSlides);
        setLocal('ga_hero_slides', all.map(s => s.id === id ? data : s));
        return data as HeroSlide;
      }
    } catch (e) {
      console.warn('Supabase updateHeroSlide error:', e);
    }
  }
  const all = getLocal<HeroSlide[]>('ga_hero_slides', defaultHeroSlides);
  const updatedList = all.map(s => s.id === id ? { ...s, ...updates } : s);
  setLocal('ga_hero_slides', updatedList);
  return updatedList.find(s => s.id === id)!;
}

export async function deleteHeroSlide(id: string): Promise<void> {
  if (isSupabaseConfigured) {
    try {
      await supabase.from('hero_slides').delete().eq('id', id);
    } catch (e) {
      console.warn('Supabase deleteHeroSlide error:', e);
    }
  }
  const all = getLocal<HeroSlide[]>('ga_hero_slides', defaultHeroSlides);
  setLocal('ga_hero_slides', all.filter(s => s.id !== id));
}

// ------------------------------------------
// QUICK STATS
// ------------------------------------------
export const defaultQuickStats: QuickStat[] = [
  { id: 'qs-1', label: 'Total Students', value: '1,250+', icon: 'users', position: 1, is_active: true },
  { id: 'qs-2', label: 'Programs Offered', value: '10+', icon: 'book', position: 2, is_active: true },
  { id: 'qs-3', label: 'Qualified Teachers', value: '48+', icon: 'graduation-cap', position: 3, is_active: true },
  { id: 'qs-4', label: 'Years of Excellence', value: '18+', icon: 'award', position: 4, is_active: true }
];

export async function fetchQuickStats(onlyActive: boolean = false): Promise<QuickStat[]> {
  if (isSupabaseConfigured) {
    try {
      let query = supabase.from('quick_stats').select('*').order('position', { ascending: true });
      if (onlyActive) query = query.eq('is_active', true);
      const { data, error } = await query;
      if (!error && data && data.length > 0) {
        setLocal('ga_quick_stats', data);
        return data as QuickStat[];
      }
    } catch (e) {
      console.warn('Supabase quick_stats fetch error:', e);
    }
  }
  const all = getLocal<QuickStat[]>('ga_quick_stats', defaultQuickStats);
  const filtered = onlyActive ? all.filter(q => q.is_active) : all;
  return filtered.sort((a, b) => a.position - b.position);
}

export async function createQuickStat(stat: Omit<QuickStat, 'id'>): Promise<QuickStat> {
  const newId = 'qs-' + Date.now();
  const newRecord: QuickStat = { ...stat, id: newId };
  if (isSupabaseConfigured) {
    try {
      const { data, error } = await supabase.from('quick_stats').insert([stat]).select().single();
      if (!error && data) {
        const all = getLocal<QuickStat[]>('ga_quick_stats', defaultQuickStats);
        setLocal('ga_quick_stats', [...all, data]);
        return data as QuickStat;
      }
    } catch (e) {
      console.warn('Supabase createQuickStat error:', e);
    }
  }
  const all = getLocal<QuickStat[]>('ga_quick_stats', defaultQuickStats);
  setLocal('ga_quick_stats', [...all, newRecord]);
  return newRecord;
}

export async function updateQuickStat(id: string, updates: Partial<QuickStat>): Promise<QuickStat> {
  if (isSupabaseConfigured) {
    try {
      const { data, error } = await supabase.from('quick_stats').update(updates).eq('id', id).select().single();
      if (!error && data) {
        const all = getLocal<QuickStat[]>('ga_quick_stats', defaultQuickStats);
        setLocal('ga_quick_stats', all.map(q => q.id === id ? data : q));
        return data as QuickStat;
      }
    } catch (e) {
      console.warn('Supabase updateQuickStat error:', e);
    }
  }
  const all = getLocal<QuickStat[]>('ga_quick_stats', defaultQuickStats);
  const updatedList = all.map(q => q.id === id ? { ...q, ...updates } : q);
  setLocal('ga_quick_stats', updatedList);
  return updatedList.find(q => q.id === id)!;
}

export async function deleteQuickStat(id: string): Promise<void> {
  if (isSupabaseConfigured) {
    try {
      await supabase.from('quick_stats').delete().eq('id', id);
    } catch (e) {
      console.warn('Supabase deleteQuickStat error:', e);
    }
  }
  const all = getLocal<QuickStat[]>('ga_quick_stats', defaultQuickStats);
  setLocal('ga_quick_stats', all.filter(q => q.id !== id));
}

// ------------------------------------------
// SOCIAL MEDIA
// ------------------------------------------
export const defaultSocialMedia: SocialMedia[] = [
  { id: 'sm-1', platform: 'Facebook', url: 'https://facebook.com/girlsacademy', icon: 'facebook', followers_count: '5,200', position: 1, is_active: true },
  { id: 'sm-2', platform: 'Instagram', url: 'https://instagram.com/girlsacademy', icon: 'instagram', followers_count: '3,800', position: 2, is_active: true },
  { id: 'sm-3', platform: 'YouTube', url: 'https://youtube.com/girlsacademy', icon: 'youtube', followers_count: '2,100', position: 3, is_active: true },
  { id: 'sm-4', platform: 'WhatsApp', url: 'https://wa.me/923004861234', icon: 'message-circle', followers_count: 'Chat Now', position: 4, is_active: true }
];

export async function fetchSocialMedia(onlyActive: boolean = false): Promise<SocialMedia[]> {
  if (isSupabaseConfigured) {
    try {
      let query = supabase.from('social_media').select('*').order('position', { ascending: true });
      if (onlyActive) query = query.eq('is_active', true);
      const { data, error } = await query;
      if (!error && data && data.length > 0) {
        setLocal('ga_social_media', data);
        return data as SocialMedia[];
      }
    } catch (e) {
      console.warn('Supabase social_media fetch error:', e);
    }
  }
  const all = getLocal<SocialMedia[]>('ga_social_media', defaultSocialMedia);
  const filtered = onlyActive ? all.filter(s => s.is_active) : all;
  return filtered.sort((a, b) => a.position - b.position);
}

export async function createSocialMedia(item: Omit<SocialMedia, 'id'>): Promise<SocialMedia> {
  const newId = 'sm-' + Date.now();
  const newRecord: SocialMedia = { ...item, id: newId, created_at: new Date().toISOString() };
  if (isSupabaseConfigured) {
    try {
      const { data, error } = await supabase.from('social_media').insert([item]).select().single();
      if (!error && data) {
        const all = getLocal<SocialMedia[]>('ga_social_media', defaultSocialMedia);
        setLocal('ga_social_media', [...all, data]);
        return data as SocialMedia;
      }
    } catch (e) {
      console.warn('Supabase createSocialMedia error:', e);
    }
  }
  const all = getLocal<SocialMedia[]>('ga_social_media', defaultSocialMedia);
  setLocal('ga_social_media', [...all, newRecord]);
  return newRecord;
}

export async function updateSocialMedia(id: string, updates: Partial<SocialMedia>): Promise<SocialMedia> {
  if (isSupabaseConfigured) {
    try {
      const { data, error } = await supabase.from('social_media').update(updates).eq('id', id).select().single();
      if (!error && data) {
        const all = getLocal<SocialMedia[]>('ga_social_media', defaultSocialMedia);
        setLocal('ga_social_media', all.map(s => s.id === id ? data : s));
        return data as SocialMedia;
      }
    } catch (e) {
      console.warn('Supabase updateSocialMedia error:', e);
    }
  }
  const all = getLocal<SocialMedia[]>('ga_social_media', defaultSocialMedia);
  const updatedList = all.map(s => s.id === id ? { ...s, ...updates } : s);
  setLocal('ga_social_media', updatedList);
  return updatedList.find(s => s.id === id)!;
}

export async function deleteSocialMedia(id: string): Promise<void> {
  if (isSupabaseConfigured) {
    try {
      await supabase.from('social_media').delete().eq('id', id);
    } catch (e) {
      console.warn('Supabase deleteSocialMedia error:', e);
    }
  }
  const all = getLocal<SocialMedia[]>('ga_social_media', defaultSocialMedia);
  setLocal('ga_social_media', all.filter(s => s.id !== id));
}

// ------------------------------------------
// ANNOUNCEMENTS
// ------------------------------------------
export const defaultAnnouncements: Announcement[] = [
  { id: 'ann-1', text: 'Admissions Open for Session 2026-2027 — Limited Seats Available!', link: '/admissions', is_active: true, created_at: new Date().toISOString() },
  { id: 'ann-2', text: 'BISE Results 2025: 95% Pass Rate — Congratulations to all students!', link: '/celebration-video', is_active: true, created_at: new Date().toISOString() },
  { id: 'ann-3', text: 'Last date for admissions: 31 March 2026', link: '/admissions', is_active: true, created_at: new Date().toISOString() },
  { id: 'ann-4', text: 'Monthly fee due by 10th of every month', link: '/courses', is_active: true, created_at: new Date().toISOString() }
];

export async function fetchAnnouncements(onlyActive: boolean = false): Promise<Announcement[]> {
  if (isSupabaseConfigured) {
    try {
      let query = supabase.from('announcements').select('*').order('created_at', { ascending: false });
      if (onlyActive) query = query.eq('is_active', true);
      const { data, error } = await query;
      if (!error && data && data.length > 0) {
        setLocal('ga_announcements', data);
        return data as Announcement[];
      }
    } catch (e) {
      console.warn('Supabase announcements fetch error:', e);
    }
  }
  const all = getLocal<Announcement[]>('ga_announcements', defaultAnnouncements);
  return onlyActive ? all.filter(a => a.is_active) : all;
}

export async function createAnnouncement(ann: Omit<Announcement, 'id'>): Promise<Announcement> {
  const newId = 'ann-' + Date.now();
  const newRecord: Announcement = { ...ann, id: newId, created_at: new Date().toISOString() };
  if (isSupabaseConfigured) {
    try {
      const { data, error } = await supabase.from('announcements').insert([ann]).select().single();
      if (!error && data) {
        const all = getLocal<Announcement[]>('ga_announcements', defaultAnnouncements);
        setLocal('ga_announcements', [data, ...all]);
        return data as Announcement;
      }
    } catch (e) {
      console.warn('Supabase createAnnouncement error:', e);
    }
  }
  const all = getLocal<Announcement[]>('ga_announcements', defaultAnnouncements);
  setLocal('ga_announcements', [newRecord, ...all]);
  return newRecord;
}

export async function updateAnnouncement(id: string, updates: Partial<Announcement>): Promise<Announcement> {
  if (isSupabaseConfigured) {
    try {
      const { data, error } = await supabase.from('announcements').update(updates).eq('id', id).select().single();
      if (!error && data) {
        const all = getLocal<Announcement[]>('ga_announcements', defaultAnnouncements);
        setLocal('ga_announcements', all.map(a => a.id === id ? data : a));
        return data as Announcement;
      }
    } catch (e) {
      console.warn('Supabase updateAnnouncement error:', e);
    }
  }
  const all = getLocal<Announcement[]>('ga_announcements', defaultAnnouncements);
  const updatedList = all.map(a => a.id === id ? { ...a, ...updates } : a);
  setLocal('ga_announcements', updatedList);
  return updatedList.find(a => a.id === id)!;
}

export async function deleteAnnouncement(id: string): Promise<void> {
  if (isSupabaseConfigured) {
    try {
      await supabase.from('announcements').delete().eq('id', id);
    } catch (e) {
      console.warn('Supabase deleteAnnouncement error:', e);
    }
  }
  const all = getLocal<Announcement[]>('ga_announcements', defaultAnnouncements);
  setLocal('ga_announcements', all.filter(a => a.id !== id));
}

// ------------------------------------------
// CORE VALUES
// ------------------------------------------
export const defaultCoreValues: CoreValue[] = [
  { id: 'cv-1', title: 'Academic Excellence', description: 'We maintain the highest standards of education with BISE affiliated curriculum', icon: 'award', position: 1, is_active: true },
  { id: 'cv-2', title: 'Islamic Values', description: 'Nurturing students with strong moral and character foundation', icon: 'heart', position: 2, is_active: true },
  { id: 'cv-3', title: 'Safe Environment', description: 'A secure, disciplined and supportive environment exclusively for girls', icon: 'shield', position: 3, is_active: true },
  { id: 'cv-4', title: 'Modern Facilities', description: 'State-of-the-art labs, library, and digital classrooms', icon: 'monitor', position: 4, is_active: true }
];

export async function fetchCoreValues(onlyActive: boolean = false): Promise<CoreValue[]> {
  if (isSupabaseConfigured) {
    try {
      let query = supabase.from('core_values').select('*').order('position', { ascending: true });
      if (onlyActive) query = query.eq('is_active', true);
      const { data, error } = await query;
      if (!error && data && data.length > 0) {
        setLocal('ga_core_values', data);
        return data as CoreValue[];
      }
    } catch (e) {
      console.warn('Supabase core_values fetch error:', e);
    }
  }
  const all = getLocal<CoreValue[]>('ga_core_values', defaultCoreValues);
  const filtered = onlyActive ? all.filter(c => c.is_active) : all;
  return filtered.sort((a, b) => a.position - b.position);
}

export async function createCoreValue(val: Omit<CoreValue, 'id'>): Promise<CoreValue> {
  const newId = 'cv-' + Date.now();
  const newRecord: CoreValue = { ...val, id: newId };
  if (isSupabaseConfigured) {
    try {
      const { data, error } = await supabase.from('core_values').insert([val]).select().single();
      if (!error && data) {
        const all = getLocal<CoreValue[]>('ga_core_values', defaultCoreValues);
        setLocal('ga_core_values', [...all, data]);
        return data as CoreValue;
      }
    } catch (e) {
      console.warn('Supabase createCoreValue error:', e);
    }
  }
  const all = getLocal<CoreValue[]>('ga_core_values', defaultCoreValues);
  setLocal('ga_core_values', [...all, newRecord]);
  return newRecord;
}

export async function updateCoreValue(id: string, updates: Partial<CoreValue>): Promise<CoreValue> {
  if (isSupabaseConfigured) {
    try {
      const { data, error } = await supabase.from('core_values').update(updates).eq('id', id).select().single();
      if (!error && data) {
        const all = getLocal<CoreValue[]>('ga_core_values', defaultCoreValues);
        setLocal('ga_core_values', all.map(c => c.id === id ? data : c));
        return data as CoreValue;
      }
    } catch (e) {
      console.warn('Supabase updateCoreValue error:', e);
    }
  }
  const all = getLocal<CoreValue[]>('ga_core_values', defaultCoreValues);
  const updatedList = all.map(c => c.id === id ? { ...c, ...updates } : c);
  setLocal('ga_core_values', updatedList);
  return updatedList.find(c => c.id === id)!;
}

export async function deleteCoreValue(id: string): Promise<void> {
  if (isSupabaseConfigured) {
    try {
      await supabase.from('core_values').delete().eq('id', id);
    } catch (e) {
      console.warn('Supabase deleteCoreValue error:', e);
    }
  }
  const all = getLocal<CoreValue[]>('ga_core_values', defaultCoreValues);
  setLocal('ga_core_values', all.filter(c => c.id !== id));
}

// ------------------------------------------
// ACHIEVEMENTS
// ------------------------------------------
export const defaultAchievements: Achievement[] = [
  { id: 'ach-1', title: 'BISE Board Top Positions', description: 'Multiple 1st, 2nd, and 3rd positions in Federal & BISE Islamabad board exams.', year: '2025', icon: 'trophy', position: 1, is_active: true },
  { id: 'ach-2', title: '100% Matric Science Pass Rate', description: 'All students scored A+ and A grades in Matric Science examination.', year: '2025', icon: 'award', position: 2, is_active: true },
  { id: 'ach-3', title: 'National STEM & Robotics Award', description: 'First place in National Inter-College Girls Science & Robotics Exhibition.', year: '2024', icon: 'star', position: 3, is_active: true },
  { id: 'ach-4', title: 'Excellence in Female Leadership', description: 'Recognized by Federal Directorate of Education for holistic character mentoring.', year: '2023', icon: 'medal', position: 4, is_active: true }
];

export async function fetchAchievements(onlyActive: boolean = false): Promise<Achievement[]> {
  if (isSupabaseConfigured) {
    try {
      let query = supabase.from('achievements').select('*').order('position', { ascending: true });
      if (onlyActive) query = query.eq('is_active', true);
      const { data, error } = await query;
      if (!error && data && data.length > 0) {
        setLocal('ga_achievements', data);
        return data as Achievement[];
      }
    } catch (e) {
      console.warn('Supabase achievements fetch error:', e);
    }
  }
  const all = getLocal<Achievement[]>('ga_achievements', defaultAchievements);
  const filtered = onlyActive ? all.filter(a => a.is_active) : all;
  return filtered.sort((a, b) => a.position - b.position);
}

export async function createAchievement(ach: Omit<Achievement, 'id'>): Promise<Achievement> {
  const newId = 'ach-' + Date.now();
  const newRecord: Achievement = { ...ach, id: newId };
  if (isSupabaseConfigured) {
    try {
      const { data, error } = await supabase.from('achievements').insert([ach]).select().single();
      if (!error && data) {
        const all = getLocal<Achievement[]>('ga_achievements', defaultAchievements);
        setLocal('ga_achievements', [...all, data]);
        return data as Achievement;
      }
    } catch (e) {
      console.warn('Supabase createAchievement error:', e);
    }
  }
  const all = getLocal<Achievement[]>('ga_achievements', defaultAchievements);
  setLocal('ga_achievements', [...all, newRecord]);
  return newRecord;
}

export async function updateAchievement(id: string, updates: Partial<Achievement>): Promise<Achievement> {
  if (isSupabaseConfigured) {
    try {
      const { data, error } = await supabase.from('achievements').update(updates).eq('id', id).select().single();
      if (!error && data) {
        const all = getLocal<Achievement[]>('ga_achievements', defaultAchievements);
        setLocal('ga_achievements', all.map(a => a.id === id ? data : a));
        return data as Achievement;
      }
    } catch (e) {
      console.warn('Supabase updateAchievement error:', e);
    }
  }
  const all = getLocal<Achievement[]>('ga_achievements', defaultAchievements);
  const updatedList = all.map(a => a.id === id ? { ...a, ...updates } : a);
  setLocal('ga_achievements', updatedList);
  return updatedList.find(a => a.id === id)!;
}

export async function deleteAchievement(id: string): Promise<void> {
  if (isSupabaseConfigured) {
    try {
      await supabase.from('achievements').delete().eq('id', id);
    } catch (e) {
      console.warn('Supabase deleteAchievement error:', e);
    }
  }
  const all = getLocal<Achievement[]>('ga_achievements', defaultAchievements);
  setLocal('ga_achievements', all.filter(a => a.id !== id));
}

// ------------------------------------------
// BANNERS
// ------------------------------------------
export const defaultBanners: Banner[] = [
  {
    id: 'ban-1',
    title: 'Admissions Open for Academic Session 2026-2027',
    subtitle: 'Secure your seat today in Islamabad premier college for women. Scholarships available for high achievers.',
    image_url: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=1600&q=80',
    button_text: 'Apply for Admission',
    button_link: '/admissions',
    position: 1,
    is_active: true,
    page: 'home',
    created_at: new Date().toISOString()
  }
];

export async function fetchBanners(page: string = 'home', onlyActive: boolean = false): Promise<Banner[]> {
  if (isSupabaseConfigured) {
    try {
      let query = supabase.from('banners').select('*').order('position', { ascending: true });
      if (page) query = query.eq('page', page);
      if (onlyActive) query = query.eq('is_active', true);
      const { data, error } = await query;
      if (!error && data && data.length > 0) {
        setLocal('ga_banners', data);
        return data as Banner[];
      }
    } catch (e) {
      console.warn('Supabase banners fetch error:', e);
    }
  }
  const all = getLocal<Banner[]>('ga_banners', defaultBanners);
  let filtered = page ? all.filter(b => !b.page || b.page === page) : all;
  if (onlyActive) filtered = filtered.filter(b => b.is_active);
  return filtered.sort((a, b) => a.position - b.position);
}

export async function createBanner(banner: Omit<Banner, 'id'>): Promise<Banner> {
  const newId = 'ban-' + Date.now();
  const newRecord: Banner = { ...banner, id: newId, created_at: new Date().toISOString() };
  if (isSupabaseConfigured) {
    try {
      const { data, error } = await supabase.from('banners').insert([banner]).select().single();
      if (!error && data) {
        const all = getLocal<Banner[]>('ga_banners', defaultBanners);
        setLocal('ga_banners', [...all, data]);
        return data as Banner;
      }
    } catch (e) {
      console.warn('Supabase createBanner error:', e);
    }
  }
  const all = getLocal<Banner[]>('ga_banners', defaultBanners);
  setLocal('ga_banners', [...all, newRecord]);
  return newRecord;
}

export async function updateBanner(id: string, updates: Partial<Banner>): Promise<Banner> {
  if (isSupabaseConfigured) {
    try {
      const { data, error } = await supabase.from('banners').update(updates).eq('id', id).select().single();
      if (!error && data) {
        const all = getLocal<Banner[]>('ga_banners', defaultBanners);
        setLocal('ga_banners', all.map(b => b.id === id ? data : b));
        return data as Banner;
      }
    } catch (e) {
      console.warn('Supabase updateBanner error:', e);
    }
  }
  const all = getLocal<Banner[]>('ga_banners', defaultBanners);
  const updatedList = all.map(b => b.id === id ? { ...b, ...updates } : b);
  setLocal('ga_banners', updatedList);
  return updatedList.find(b => b.id === id)!;
}

export async function deleteBanner(id: string): Promise<void> {
  if (isSupabaseConfigured) {
    try {
      await supabase.from('banners').delete().eq('id', id);
    } catch (e) {
      console.warn('Supabase deleteBanner error:', e);
    }
  }
  const all = getLocal<Banner[]>('ga_banners', defaultBanners);
  setLocal('ga_banners', all.filter(s => s.id !== id));
}

// ------------------------------------------
// POPUPS / MODAL ADS
// ------------------------------------------
export const defaultPopups: Popup[] = [
  {
    id: 'pop-1',
    title: 'Admissions Open 2026-2027',
    message: 'Online admissions are now open for Nursery to Class 10 and FSc / ICS / I.Com. Early bird merit scholarships available!',
    image_url: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=800&q=80',
    button_text: 'Apply Online Now',
    button_link: '/admissions',
    is_active: true,
    show_once: true,
    created_at: new Date().toISOString()
  }
];

export async function fetchPopups(onlyActive: boolean = false): Promise<Popup[]> {
  if (isSupabaseConfigured) {
    try {
      let query = supabase.from('popups').select('*').order('created_at', { ascending: false });
      if (onlyActive) query = query.eq('is_active', true);
      const { data, error } = await query;
      if (!error && data && data.length > 0) {
        setLocal('ga_popups', data);
        return data as Popup[];
      }
    } catch (e) {
      console.warn('Supabase popups fetch error:', e);
    }
  }
  const all = getLocal<Popup[]>('ga_popups', defaultPopups);
  return onlyActive ? all.filter(p => p.is_active) : all;
}

export async function createPopup(popup: Omit<Popup, 'id'>): Promise<Popup> {
  const newId = 'pop-' + Date.now();
  const newRecord: Popup = { ...popup, id: newId, created_at: new Date().toISOString() };
  if (isSupabaseConfigured) {
    try {
      const { data, error } = await supabase.from('popups').insert([popup]).select().single();
      if (!error && data) {
        const all = getLocal<Popup[]>('ga_popups', defaultPopups);
        setLocal('ga_popups', [data, ...all]);
        return data as Popup;
      }
    } catch (e) {
      console.warn('Supabase createPopup error:', e);
    }
  }
  const all = getLocal<Popup[]>('ga_popups', defaultPopups);
  setLocal('ga_popups', [newRecord, ...all]);
  return newRecord;
}

export async function updatePopup(id: string, updates: Partial<Popup>): Promise<Popup> {
  if (isSupabaseConfigured) {
    try {
      const { data, error } = await supabase.from('popups').update(updates).eq('id', id).select().single();
      if (!error && data) {
        const all = getLocal<Popup[]>('ga_popups', defaultPopups);
        setLocal('ga_popups', all.map(p => p.id === id ? data : p));
        return data as Popup;
      }
    } catch (e) {
      console.warn('Supabase updatePopup error:', e);
    }
  }
  const all = getLocal<Popup[]>('ga_popups', defaultPopups);
  const updatedList = all.map(p => p.id === id ? { ...p, ...updates } : p);
  setLocal('ga_popups', updatedList);
  return updatedList.find(p => p.id === id)!;
}

export async function deletePopup(id: string): Promise<void> {
  if (isSupabaseConfigured) {
    try {
      await supabase.from('popups').delete().eq('id', id);
    } catch (e) {
      console.warn('Supabase deletePopup error:', e);
    }
  }
  const all = getLocal<Popup[]>('ga_popups', defaultPopups);
  setLocal('ga_popups', all.filter(p => p.id !== id));
}

// ------------------------------------------
// BLOG CATEGORIES
// ------------------------------------------
export const defaultBlogCategories: BlogCategory[] = [
  { id: 'cat-1', name: 'Academic Research', slug: 'academic-research' },
  { id: 'cat-2', name: 'STEM & Innovation', slug: 'stem-innovation' },
  { id: 'cat-3', name: 'Leadership & Mentorship', slug: 'leadership' },
  { id: 'cat-4', name: 'Campus Life & Events', slug: 'campus-life' }
];

export async function fetchBlogCategories(): Promise<BlogCategory[]> {
  if (isSupabaseConfigured) {
    try {
      const { data, error } = await supabase.from('blog_categories').select('*');
      if (!error && data && data.length > 0) {
        return data as BlogCategory[];
      }
    } catch (e) {
      console.warn('Supabase blog_categories fetch error:', e);
    }
  }
  return defaultBlogCategories;
}

// ------------------------------------------
// FACULTY / TEACHERS WITH PROFILES
// ------------------------------------------
export async function fetchFacultyMembers(): Promise<(Profile & { qualification?: string; department?: string; experience?: string })[]> {
  if (isSupabaseConfigured) {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*, teachers(*)')
        .eq('role', 'teacher')
        .eq('is_active', true);
      if (!error && data && data.length > 0) {
        return data.map((d: any) => ({
          ...d,
          qualification: d.teachers?.[0]?.qualification || 'M.Phil / Master Degree',
          department: d.teachers?.[0]?.specialization || 'Academic Faculty',
          experience: d.teachers?.[0]?.experience || '10+ Years'
        }));
      }
    } catch (e) {
      console.warn('Supabase faculty fetch error:', e);
    }
  }

  // Fallback from initialFaculty in mockData
  const { initialFaculty } = await import('../data/mockData');
  return initialFaculty.map(f => ({
    id: f.id,
    full_name: f.name,
    email: f.email,
    role: 'teacher' as UserRole,
    photo_url: f.avatar_url,
    phone: '051-4861234',
    is_active: true,
    qualification: f.qualifications,
    department: f.department,
    experience: `${f.experience_years} Years`
  }));
}

// ------------------------------------------
// POSTERS & CAMPUS FLYERS CRUD
// ------------------------------------------
export const defaultPosters: Poster[] = [
  {
    id: 'poster-1',
    title: 'Admissions Open 2026-2027: Matric & Intermediate Programs',
    category: 'Admissions',
    image_url: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=1200&q=80',
    description: 'Admissions open for Class 9, Class 10, FSc Pre-Medical, Pre-Engineering, and ICS. Merit scholarships up to 100% available.',
    event_date: 'Deadline: 15 November 2026',
    target_audience: 'Aspiring Female Scholars & Parents',
    is_active: true,
    display_order: 1,
    created_at: '2026-10-01T10:00:00Z',
  },
  {
    id: 'poster-2',
    title: 'Annual Science & Robotics Exhibition 2026',
    category: 'Competition',
    image_url: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=1200&q=80',
    description: 'Showcasing revolutionary STEM prototypes, artificial intelligence applications, and renewable energy research projects designed by our students.',
    event_date: '28 October 2026',
    target_audience: 'All Students, Teachers & Guests',
    is_active: true,
    display_order: 2,
    created_at: '2026-10-02T10:00:00Z',
  },
  {
    id: 'poster-3',
    title: 'Federal Board High Achievers & Gold Medalist Ceremony',
    category: 'Academic Notice',
    image_url: 'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?auto=format&fit=crop&w=1200&q=80',
    description: 'Honoring top position holders and distinction awardees of Federal Board SSC & HSSC examinations 2026.',
    event_date: '10 November 2026',
    target_audience: 'High Achievers & Proud Families',
    is_active: true,
    display_order: 3,
    created_at: '2026-10-03T10:00:00Z',
  },
  {
    id: 'poster-4',
    title: 'Inter-College Women Athletics & Badminton Championship',
    category: 'Sports Gala',
    image_url: 'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?auto=format&fit=crop&w=1200&q=80',
    description: 'Annual sports festival encouraging physical fitness, leadership qualities, and teamwork in female youth.',
    event_date: '05 December 2026',
    target_audience: 'College Athletes & Enthusiasts',
    is_active: true,
    display_order: 4,
    created_at: '2026-10-04T10:00:00Z',
  }
];

export async function fetchPosters(onlyActive = false): Promise<Poster[]> {
  if (isSupabaseConfigured) {
    try {
      let query = supabase.from('posters').select('*').order('display_order', { ascending: true });
      if (onlyActive) query = query.eq('is_active', true);
      const { data, error } = await query;
      if (!error && data && data.length > 0) return data as Poster[];
    } catch {}
  }
  const all = getLocal('ga_admin_posters', defaultPosters);
  return onlyActive ? all.filter(p => p.is_active) : all;
}

export async function createPoster(poster: Omit<Poster, 'id'>): Promise<Poster> {
  const newPoster: Poster = {
    ...poster,
    id: `poster-${Date.now()}`,
    is_active: poster.is_active !== undefined ? poster.is_active : true,
    display_order: poster.display_order ?? 1,
    created_at: new Date().toISOString()
  };
  if (isSupabaseConfigured) {
    try {
      const { data, error } = await supabase.from('posters').insert([newPoster]).select().single();
      if (!error && data) return data as Poster;
    } catch {}
  }
  const all = getLocal<Poster[]>('ga_admin_posters', defaultPosters);
  all.unshift(newPoster);
  setLocal('ga_admin_posters', all);
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent('ga_posters_updated'));
  }
  return newPoster;
}

export async function updatePoster(id: string, updates: Partial<Poster>): Promise<void> {
  if (isSupabaseConfigured) {
    try {
      await supabase.from('posters').update(updates).eq('id', id);
    } catch {}
  }
  const all = getLocal<Poster[]>('ga_admin_posters', defaultPosters);
  const idx = all.findIndex(p => p.id === id);
  if (idx !== -1) {
    all[idx] = { ...all[idx], ...updates };
    setLocal('ga_admin_posters', all);
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('ga_posters_updated'));
    }
  }
}

export async function deletePoster(id: string): Promise<void> {
  if (isSupabaseConfigured) {
    try {
      await supabase.from('posters').delete().eq('id', id);
    } catch {}
  }
  const all = getLocal<Poster[]>('ga_admin_posters', defaultPosters);
  const filtered = all.filter(p => p.id !== id);
  setLocal('ga_admin_posters', filtered);
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent('ga_posters_updated'));
  }
}

