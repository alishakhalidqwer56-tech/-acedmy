// Database Enums
export type UserRole = 'admin' | 'teacher' | 'student' | 'parent';
export type AttendanceStatus = 'present' | 'absent' | 'late' | 'leave';
export type AdmissionStatus = 'pending' | 'approved' | 'rejected';
export type PostStatus = 'draft' | 'pending' | 'published';

// PROFILES
export interface Profile {
  id: string;
  full_name: string;
  email: string;
  role: UserRole;
  photo_url?: string | null;
  phone?: string | null;
  is_active: boolean;
  created_at?: string;
}

// STUDENTS
export interface Student {
  id: string;
  profile_id: string;
  roll_number?: string | null;
  date_of_birth?: string | null;
  address?: string | null;
  created_at?: string;
  profile?: Profile;
}

// PARENTS
export interface Parent {
  id: string;
  profile_id: string;
  occupation?: string | null;
  created_at?: string;
  profile?: Profile;
}

// PARENT-STUDENTS
export interface ParentStudent {
  id: string;
  parent_id: string;
  student_id: string;
}

// TEACHERS
export interface Teacher {
  id: string;
  profile_id: string;
  qualification?: string | null;
  experience?: string | null;
  specialization?: string | null;
  created_at?: string;
  profile?: Profile;
}

// COURSES
export interface Course {
  id: string;
  code?: string;
  title: string;
  description?: string | null;
  short_description?: string;
  full_description?: string;
  level?: string | null;
  grade_level?: string;
  category?: string | null;
  duration?: string | null;
  schedule?: string | null;
  credits?: number;
  department?: string;
  fee_info?: string | null;
  tuition_fee?: string;
  instructor_name?: string | null;
  instructor_title?: string;
  thumbnail_url?: string | null;
  image_url?: string;
  is_active?: boolean;
  featured?: boolean;
  capacity?: number;
  enrolled?: number;
  learning_outcomes?: string[];
  prerequisites?: string[];
  syllabus_modules?: {
    title: string;
    description: string;
  }[];
  created_at?: string;
}

// SUBJECTS
export interface Subject {
  id: string;
  name: string;
  course_id: string;
  created_at?: string;
}

// TERMS
export interface Term {
  id: string;
  name: string;
  academic_year: string;
  start_date?: string | null;
  end_date?: string | null;
  is_active?: boolean;
}

// CLASSES
export interface SchoolClass {
  id: string;
  name: string;
  course_id?: string | null;
  term_id?: string | null;
  created_at?: string;
}

// CLASS_SUBJECTS
export interface ClassSubject {
  id: string;
  class_id: string;
  subject_id: string;
  teacher_id?: string | null;
}

// CLASS_ENROLLMENTS
export interface ClassEnrollment {
  id: string;
  class_id: string;
  student_id: string;
  enrolled_at?: string;
}

// VIDEO_LECTURES
export interface VideoLecture {
  id: string;
  title: string;
  description?: string | null;
  video_url: string;
  course_id?: string | null;
  subject_id?: string | null;
  uploaded_by?: string | null;
  created_at?: string;
}

// ATTENDANCE
export interface Attendance {
  id: string;
  student_id: string;
  class_id?: string | null;
  date: string;
  status: AttendanceStatus;
  marked_by?: string | null;
  created_at?: string;
}

// GRADING_SCALES
export interface GradingScale {
  id: string;
  min_marks: number;
  max_marks: number;
  grade: string;
  gpa?: number | null;
  remarks?: string | null;
}

// RESULTS
export interface Result {
  id: string;
  student_id: string;
  subject_id?: string | null;
  term_id?: string | null;
  marks_obtained?: number | null;
  total_marks?: number | null;
  grade?: string | null;
  entered_by?: string | null;
  created_at?: string;
}

// ADMISSIONS
export interface Admission {
  id: string;
  student_name: string;
  date_of_birth?: string | null;
  gender?: string | null;
  email: string;
  phone?: string | null;
  address?: string | null;
  photo_url?: string | null;
  previous_school?: string | null;
  previous_class?: string | null;
  previous_grade?: string | null;
  parent_name?: string | null;
  guardian_relationship?: string | null;
  parent_relationship?: string | null;
  parent_phone?: string | null;
  whatsapp_number?: string | null;
  parent_whatsapp?: string | null;
  parent_email?: string | null;
  parent_occupation?: string | null;
  cnic_number?: string | null;
  parent_cnic?: string | null;
  program_applied?: string | null;
  class_grade_applying?: string | null;
  class_applying_for?: string | null;
  city?: string | null;
  province?: string | null;
  documents_url?: string[] | null;
  status: AdmissionStatus;
  admin_notes?: string | null;
  updated_by?: string | null;
  created_at?: string;
  updated_at?: string;
}

// EVENTS
export interface EventItem {
  id: string;
  title: string;
  description?: string | null;
  category?: string;
  event_date?: string;
  date?: string;
  time?: string;
  location?: string;
  keynote_speaker?: string;
  speaker_role?: string;
  image_url?: string | null;
  is_upcoming?: boolean;
  featured?: boolean;
  registration_deadline?: string;
  rsvp_required?: boolean;
  capacity?: number;
  registered_count?: number;
  created_at?: string;
}

// BLOG CATEGORIES
export interface BlogCategory {
  id: string;
  name: string;
  slug: string;
}

// BLOG POSTS
export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt?: string | null;
  content?: string | null;
  featured_image_url?: string | null;
  author_id?: string | null;
  category_id?: string | null;
  tags?: string[] | null;
  status: PostStatus;
  published_at?: string | null;
  created_at?: string;
  updated_at?: string;
  author?: Profile;
  category?: BlogCategory;
}

// NOTIFICATIONS
export interface Notification {
  id: string;
  title: string;
  message: string;
  recipient_role?: UserRole | null;
  recipient_id?: string | null;
  is_read: boolean;
  created_at?: string;
}

// FEE_STRUCTURE
export interface FeeStructure {
  id: string;
  program: string;
  class_name?: string | null;
  amount: number;
  frequency?: string | null;
  description?: string | null;
  created_at?: string;
}

// GALLERY
export interface GalleryItem {
  id: string;
  title?: string | null;
  media_url: string;
  media_type: 'image' | 'video';
  album?: string | null;
  created_at?: string;
}

// CHATBOT SETTINGS
export interface ChatbotFAQ {
  question: string;
  answer: string;
}

export interface ChatbotSettings {
  id?: string;
  is_enabled: boolean;
  bot_name: string;
  welcome_message: string;
  primary_color: string;
  position: 'bottom-right' | 'bottom-left';
  faqs: ChatbotFAQ[];
  updated_at?: string;
}

// PAKISTAN CONSTANTS
export const PAKISTAN_PROVINCES = [
  'Punjab',
  'Sindh',
  'Khyber Pakhtunkhwa',
  'Balochistan',
  'Islamabad Capital Territory',
  'Azad Jammu & Kashmir',
  'Gilgit-Baltistan'
] as const;

export const PAKISTAN_CLASSES = [
  'Nursery',
  'KG (Katchi)',
  'Class 1',
  'Class 2',
  'Class 3',
  'Class 4',
  'Class 5',
  'Class 6',
  'Class 7',
  'Class 8',
  'Class 9 (Science)',
  'Class 9 (Arts)',
  'Class 9 (Commerce)',
  'Class 10 (Science)',
  'Class 10 (Arts)',
  'Class 10 (Commerce)',
  'FA/FSc Part 1 (1st Year)',
  'FA/FSc Part 2 (2nd Year)',
  'ICS Part 1 (1st Year)',
  'ICS Part 2 (2nd Year)',
  'I.Com Part 1 (1st Year)',
  'I.Com Part 2 (2nd Year)'
] as const;

export const PAKISTAN_PROGRAMS = [
  'Primary Program (Nursery to Class 5)',
  'Middle School Program (Class 6-8)',
  'Matric Science (Class 9-10)',
  'Matric Arts (Class 9-10)',
  'Matric Commerce (Class 9-10)',
  'FSc Pre-Medical (1st & 2nd Year)',
  'FSc Pre-Engineering (1st & 2nd Year)',
  'FA — Faculty of Arts (1st & 2nd Year)',
  'ICS — Computer Science (1st & 2nd Year)',
  'I.Com — Commerce (1st & 2nd Year)'
] as const;

export const PAKISTAN_BOARDS = [
  'BISE Islamabad',
  'Federal Board (FBISE)',
  'BISE Lahore',
  'BISE Rawalpindi',
  'BISE Multan',
  'AGA Khan Board'
] as const;

export const PAKISTAN_TERMS = [
  'Term 1 (First Term): April – June',
  'Mid-Year Exams: October',
  'Term 2 (Second Term / Annual): February – March'
] as const;

export const PAKISTAN_EXAM_TYPES = [
  'Monthly Test (Maheena War Imtihan)',
  'First Term Examination',
  'Mid-Term Examination',
  'Annual Examination (Salana Imtihan)',
  'Pre-Board Examination (SSC / HSSC)',
  'Board Examination (BISE / Federal Board)'
] as const;

// SITE_SETTINGS
export interface SiteSetting {
  id: string;
  key: string;
  value: string;
  updated_at?: string;
}

export interface SiteSettings {
  id?: string;
  school_name: string;
  tagline: string;
  motto?: string;
  contact_email: string;
  contact_phone: string;
  emergency_phone?: string;
  address: string;
  city_state: string;
  admissions_open: boolean;
  academic_year: string;
  current_term?: string;
  grading_scale?: string;
  social_links?: {
    facebook?: string;
    twitter?: string;
    instagram?: string;
    linkedin?: string;
    youtube?: string;
  };
  announcement_banner?: string;
  total_students_enrolled?: number;
  faculty_count?: number;
  national_rank?: string;
  accreditation?: string;
}

// FACULTY MEMBER
export interface FacultyMember {
  id: string;
  name: string;
  designation: string;
  department: string;
  qualifications: string;
  experience_years: number;
  bio: string;
  email: string;
  avatar_url: string;
  specialization: string[];
  featured?: boolean;
}

// Testimonials
export interface Testimonial {
  id: string;
  quote: string;
  student_name?: string;
  author?: string;
  student_class?: string;
  role?: string;
  achievement?: string;
  avatar_url?: string;
  year?: string;
  rating?: number;
}

// CHATBOT CLIENT INQUIRY
export interface ChatInquiry {
  id: string;
  name: string;
  contact: string;
  message: string;
  status: 'new' | 'contacted' | 'resolved';
  created_at: string;
}

// ==========================================
// DYNAMIC WEBSITE CMS INTERFACES
// ==========================================

// HERO SLIDES (homepage rotating hero banners)
export interface HeroSlide {
  id: string;
  heading: string;
  subheading?: string | null;
  description?: string | null;
  image_url?: string | null;
  button1_text?: string | null;
  button1_link?: string | null;
  button2_text?: string | null;
  button2_link?: string | null;
  is_active: boolean;
  position: number;
  created_at?: string;
}

// BANNERS (promotional / CTA banners)
export interface Banner {
  id: string;
  title: string;
  subtitle?: string | null;
  image_url?: string | null;
  button_text?: string | null;
  button_link?: string | null;
  position: number;
  is_active: boolean;
  page?: string | null;
  created_at?: string;
}

// SOCIAL MEDIA ACCOUNTS
export interface SocialMedia {
  id: string;
  platform: string;
  url: string;
  icon: string;
  followers_count?: string | null;
  is_active: boolean;
  position: number;
  created_at?: string;
}

// CORE VALUES
export interface CoreValue {
  id: string;
  title: string;
  description?: string | null;
  icon?: string | null;
  position: number;
  is_active: boolean;
}

// ACHIEVEMENTS
export interface Achievement {
  id: string;
  title: string;
  description?: string | null;
  year?: string | null;
  icon?: string | null;
  is_active: boolean;
  position: number;
}

// QUICK STATS
export interface QuickStat {
  id: string;
  label: string;
  value: string;
  icon?: string | null;
  position: number;
  is_active: boolean;
}

// ANNOUNCEMENTS TICKER
export interface Announcement {
  id: string;
  text: string;
  link?: string | null;
  is_active: boolean;
  expires_at?: string | null;
  created_at?: string;
}

// POPUP / MODAL ADS
export interface Popup {
  id: string;
  title?: string | null;
  message?: string | null;
  image_url?: string | null;
  button_text?: string | null;
  button_link?: string | null;
  is_active: boolean;
  show_once: boolean;
  created_at?: string;
}

// POSTERS & CAMPUS FLYERS
export interface Poster {
  id: string;
  title: string;
  category: string;
  image_url: string;
  description?: string | null;
  event_date?: string | null;
  target_audience?: string | null;
  target_link?: string | null;
  is_active: boolean;
  display_order: number;
  created_at?: string;
}


