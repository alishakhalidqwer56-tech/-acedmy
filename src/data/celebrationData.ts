// Celebration Video Data and Metadata for Girls Academy Islamabad - BISE Board Results 2025
// 100% English Content - Zero Urdu

import trophyImg from '../assets/images/trophy_golden_spotlight_1791439736560.jpg';
import studentJoyImg from '../assets/images/celebration_result_card_1791439753927.jpg';
import parentHugImg from '../assets/images/parent_hug_emotional_1791439765634.jpg';
import teachersPrideImg from '../assets/images/teacher_proud_mentors_1791439781376.jpg';

export interface CelebrationStat {
  id: string;
  value: number | string;
  displayValue: string;
  targetNumber?: number;
  suffix?: string;
  label: string;
  sublabel: string;
  glowColor: 'purple' | 'pink' | 'gold' | 'gradient';
  description: string;
}

export interface TopStudent {
  id: string;
  rank: 1 | 2 | 3;
  medal: string;
  name: string;
  score: string;
  scoreDetail: string;
  program: string;
  quote: string;
  rollNo: string;
  board: string;
  distinction: string;
}

export const CELEBRATION_STATS: CelebrationStat[] = [
  {
    id: 'pass-rate',
    value: '95%',
    displayValue: '95',
    targetNumber: 95,
    suffix: '%',
    label: 'Students Passed',
    sublabel: 'Overall Pass Rate',
    glowColor: 'purple',
    description: 'Consistent academic supremacy across Federal and Regional Board exams',
  },
  {
    id: 'a-plus',
    value: '42',
    displayValue: '42',
    targetNumber: 42,
    suffix: '',
    label: 'A+ Grades Secured',
    sublabel: 'Distinction Achievers',
    glowColor: 'pink',
    description: 'Outstanding top-tier grades with exemplary percentile standings',
  },
  {
    id: 'first-pos',
    value: '1st Position',
    displayValue: '1st',
    label: '1st Position in District',
    sublabel: 'Top Board Honor',
    glowColor: 'gold',
    description: 'Secured overall First Position across Islamabad District',
  },
  {
    id: 'science-rate',
    value: '100%',
    displayValue: '100',
    targetNumber: 100,
    suffix: '%',
    label: 'Matric Science Pass Rate',
    sublabel: '100% First Division',
    glowColor: 'gradient',
    description: 'Flawless 100% passing rate in Matric Science with distinction',
  },
];

export const TOP_STUDENTS: TopStudent[] = [
  {
    id: 'fatima-zahra',
    rank: 1,
    medal: '🥇',
    name: 'Fatima Zahra',
    score: '1,096 / 1,100 Marks',
    scoreDetail: '99.6% Overall Marks · District Champion',
    program: 'FSc Pre-Medical',
    distinction: 'Overall 1st Position in Islamabad District',
    quote: 'The unwavering encouragement of my teachers and the prayers of my parents turned this dream into reality.',
    rollNo: 'BISE-ISB-92810',
    board: 'BISE Islamabad',
  },
  {
    id: 'ayesha-siddiqui',
    rank: 2,
    medal: '🥈',
    name: 'Ayesha Siddiqui',
    score: 'A+ Grade (1,084 Marks)',
    scoreDetail: '98.5% Marks · Gold Medalist',
    program: 'Matric Science',
    distinction: 'High Distinction Gold Medalist',
    quote: 'Girls Academy provided the confidence, laboratory resources, and rigorous academic guidance I needed to succeed.',
    rollNo: 'BISE-ISB-84729',
    board: 'BISE Islamabad',
  },
  {
    id: 'zainab-khan',
    rank: 3,
    medal: '🥉',
    name: 'Zainab Khan',
    score: '3rd Position in District',
    scoreDetail: '1,072 / 1,100 Marks · Computer Science Honors',
    program: 'ICS (Computer Science)',
    distinction: 'District 3rd Position in ICS',
    quote: 'State-of-the-art tech labs and inspiring female faculty empowered me to aspire for leadership in technology.',
    rollNo: 'BISE-ISB-73618',
    board: 'BISE Islamabad',
  },
];

export const CELEBRATION_FALLBACK_IMAGES = {
  trophy: 'https://images.unsplash.com/photo-1579373903781-fd5c0c30c4cd?auto=format&fit=crop&w=1000&q=80',
  studentJoy: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=1000&q=80',
  parentHug: 'https://images.unsplash.com/photo-1511895426328-dc8714191300?auto=format&fit=crop&w=1000&q=80',
  teachersPride: 'https://images.unsplash.com/photo-1577495508048-b635879837f1?auto=format&fit=crop&w=1000&q=80',
};

export const CELEBRATION_IMAGES = {
  trophy: trophyImg || '/assets/images/trophy_golden_spotlight_1791439736560.jpg',
  studentJoy: studentJoyImg || '/assets/images/celebration_result_card_1791439753927.jpg',
  parentHug: parentHugImg || '/assets/images/parent_hug_emotional_1791439765634.jpg',
  teachersPride: teachersPrideImg || '/assets/images/teacher_proud_mentors_1791439781376.jpg',
};

export const CELEBRATION_PROGRAMS = [
  'Matric (Science / Computer)',
  'FSc (Pre-Medical)',
  'FSc (Pre-Engineering)',
  'FA (Humanities & Social Sciences)',
  'ICS (Computer Science & AI)',
  'I.Com (Commerce & Accounting)',
  'Middle School (Grades 6-8)',
  'Primary School (Grades 1-5)',
];

export const ACADEMY_CONTACT = {
  phone: '051-4861234',
  whatsapp: '0300-4861234',
  whatsappDirectUrl: 'https://wa.me/923004861234?text=Hello%2C%20I%20would%20like%20to%20inquire%20about%20admissions%20for%20session%202026-2027%20at%20Girls%20Academy%20Islamabad.',
  website: 'www.girlsacademy.edu.pk',
  campusAddress: 'Sector F-8/4, Near Margalla Avenue, Islamabad, Pakistan',
  tagline: 'Excellence in Education — Inspiring Women Leaders',
  taglineSub: 'Quality Academic Mentorship · Empowering Future Generations',
};
