import { Course, EventItem, FacultyMember, SiteSettings, Testimonial } from '../types';

export const initialSiteSettings: SiteSettings = {
  id: 'settings-1',
  school_name: 'Girls Academy',
  tagline: 'Quality Education — Inspiring Women Leaders',
  motto: 'Knowledge, Character and Dignity',
  contact_email: 'info@girlsacademy.edu.pk',
  contact_phone: '051-4861234',
  emergency_phone: '0300-4861234',
  address: 'Street 5, Sector G-11/2',
  city_state: 'Islamabad, ICT',
  admissions_open: true,
  academic_year: '2026-2027',
  current_term: 'Term 1 (First Term): April – June',
  grading_scale: 'percentage',
  social_links: {
    facebook: 'https://facebook.com/girlsacademy',
    twitter: 'https://twitter.com/girlsacademy',
    instagram: 'https://instagram.com/girlsacademy',
    linkedin: 'https://linkedin.com/company/girlsacademy',
    youtube: 'https://youtube.com/girlsacademy',
  },
  announcement_banner: 'Admissions Open for Session 2026-2027! Merit scholarships available for top position holders in Matric and Intermediate.',
  total_students_enrolled: 1250,
  faculty_count: 48,
  national_rank: 'Top Position Holder Academy in BISE Board',
  accreditation: 'BISE & Federal Board Islamabad Affiliated'
};

export const initialCourses: Course[] = [
  {
    id: 'c-1',
    code: 'PRI-100',
    title: 'Primary Program (Nursery to Class 5)',
    category: 'School',
    level: 'Primary',
    grade_level: 'Nursery, KG, Class 1 – 5',
    duration: '7 Years',
    credits: 0,
    department: 'Primary & Junior Section',
    short_description: 'Comprehensive primary curriculum covering English, Mathematics, General Knowledge, Ethics, and foundational sciences.',
    full_description: 'The primary section is dedicated to foundational academic and moral development, with emphasis on linguistic fluency, basic scientific inquiry, and numeracy.',
    learning_outcomes: [
      'Proficiency in English communication, reading, and creative writing',
      'Ethical character development and moral consciousness',
      'Foundational arithmetic concepts and mental math mastery',
      'Scientific curiosity and observational habits'
    ],
    prerequisites: ['Age-appropriate admissions assessment for KG through Grade 5'],
    syllabus_modules: [
      { title: 'Module 1: Language Fluency (English & Literacy)', description: 'Phonics, vocabulary expansion, spelling, and sentence syntax.' },
      { title: 'Module 2: Mathematics & General Science', description: 'Numeracy, basic operations, shapes, and environmental awareness.' },
      { title: 'Module 3: Social Studies & Values', description: 'Civic responsibility, ethical etiquette, and character building.' }
    ],
    instructor_name: 'Mrs. Maryam Saeed (M.A. English / B.Ed)',
    instructor_title: 'Head of Primary Section',
    featured: true,
    capacity: 35,
    enrolled: 32,
    image_url: 'https://images.unsplash.com/photo-1509062522246-3755977927d7?auto=format&fit=crop&w=800&q=80',
    tuition_fee: 'Rs. 2,500 – 3,000/month',
    schedule: 'Mon-Sat, 8:00 AM – 1:00 PM',
    fee_info: 'Rs. 2,500 – 3,000/month'
  },
  {
    id: 'c-2',
    code: 'MID-200',
    title: 'Middle School Program (Class 6 – 8)',
    category: 'School',
    level: 'Middle',
    grade_level: 'Class 6, 7, 8',
    duration: '3 Years',
    credits: 0,
    department: 'Middle School Section',
    short_description: 'Middle school curriculum — English, Mathematics, General Science, Social Studies, Ethics, and Computer Science.',
    full_description: 'Builds a robust foundation for Matric examinations, integrating practical science laboratory experiments and modern computer coding.',
    learning_outcomes: [
      'Practical comprehension in scientific experiments and observational inquiries',
      'Principles of algebra, geometry, linear equations, and arithmetic',
      'Foundations of computer science, MS Office productivity, and digital literacy',
      'Introduction to Social Studies, Geography, and Pakistan History'
    ],
    prerequisites: ['Grade 5 completion report card or equivalent'],
    syllabus_modules: [
      { title: 'Module 1: Mathematics & Algebra', description: 'Sets, ratios, percentages, equations, and foundational geometry.' },
      { title: 'Module 2: General Science & Laboratory Practicals', description: 'Cell structures, respiratory systems, states of matter, and thermodynamics.' },
      { title: 'Module 3: Computer & Digital Skills', description: 'Hardware, operating systems, internet ethics, and introductory programming.' }
    ],
    instructor_name: 'Mrs. Uzma Bukhari (M.Sc Mathematics)',
    instructor_title: 'Middle Section Coordinator',
    featured: true,
    capacity: 35,
    enrolled: 30,
    image_url: 'https://images.unsplash.com/photo-1580582932707-520aed937b7b?auto=format&fit=crop&w=800&q=80',
    tuition_fee: 'Rs. 3,500/month',
    schedule: 'Mon-Sat, 8:00 AM – 2:00 PM',
    fee_info: 'Rs. 3,500/month'
  },
  {
    id: 'c-3',
    code: 'MAT-301',
    title: 'Matric Science (Class 9 – 10)',
    category: 'Matric',
    level: 'Secondary',
    grade_level: 'Class 9 (SSC Part 1) & Class 10 (SSC Part 2)',
    duration: '2 Years',
    credits: 0,
    department: 'Secondary Science Wing (BISE Board)',
    short_description: 'BISE Board Matric Science — Physics, Chemistry, Biology / Computer Science, Mathematics, English, Ethics, and Pakistan Studies.',
    full_description: 'Comprehensive curriculum strictly following BISE board standards. Weekly evaluations, past 10-year paper analysis, and pre-board examinations for top distinctions.',
    learning_outcomes: [
      'Complete mastery of Physics, Chemistry, and Biology board practicals',
      'High-scoring paper presentation skills tailored to board examiner rubrics',
      'Rapid numerical problem solving in physics and chemistry',
      'Achieving top A+ grades (90%+ marks) in BISE examinations'
    ],
    prerequisites: ['Minimum 70% marks in Grade 8'],
    syllabus_modules: [
      { title: 'SSC Part 1 (9th Grade Science)', description: 'Physics, Chemistry, Biology / Computer Science, Science Math, English, and Compulsory Ethics.' },
      { title: 'SSC Part 2 (10th Grade Science)', description: 'Physics, Chemistry, Biology, Mathematics, Pakistan Studies, English, and Board Model Papers.' },
      { title: 'Practical Laboratory Training (Board Labs)', description: 'Microscopy, acid-base titration, pendulum mechanics, vernier calipers, and chemical reactions.' }
    ],
    instructor_name: 'Dr. Farhat Yasmeen (Ph.D Biochemistry)',
    instructor_title: 'Head of Science Department (BISE Certified Examiner)',
    featured: true,
    capacity: 40,
    enrolled: 38,
    image_url: 'https://images.unsplash.com/photo-1532094349884-543bc11b234d?auto=format&fit=crop&w=800&q=80',
    tuition_fee: 'Rs. 4,500/month',
    schedule: 'Mon-Sat, 8:00 AM – 2:00 PM',
    fee_info: 'Rs. 4,500/month'
  },
  {
    id: 'c-4',
    code: 'MAT-302',
    title: 'Matric Arts (Class 9 – 10)',
    category: 'Matric',
    level: 'Secondary',
    grade_level: 'Class 9 & 10 (Arts Group)',
    duration: '2 Years',
    credits: 0,
    department: 'Arts & Humanities Wing',
    short_description: 'Matric General Group / Arts — General Science, Literature, History, Civics, and English.',
    full_description: 'Comprehensive curriculum nurturing literary, historical, and civic faculties, preparing students for FA and media studies.',
    learning_outcomes: [
      'Advanced proficiency in prose, poetry, and creative essay writing',
      'Analytical study of Pakistan movement, geography, and regional cultures',
      'General science, everyday nutrition, and public health principles'
    ],
    prerequisites: ['Grade 8 completion pass'],
    syllabus_modules: [
      { title: 'SSC Arts Module 1: Literature & History', description: 'Classical literature, formal essay composition, and milestones of Pakistan movement.' },
      { title: 'SSC Arts Module 2: General Science & Everyday Math', description: 'Foundational statistics, consumer mathematics, and everyday science.' }
    ],
    instructor_name: 'Prof. Bushra Rehman (M.A. Urdu & History)',
    instructor_title: 'Senior Lecturer Humanities & Social Sciences',
    featured: false,
    capacity: 35,
    enrolled: 26,
    image_url: 'https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?auto=format&fit=crop&w=800&q=80',
    tuition_fee: 'Rs. 4,000/month',
    schedule: 'Mon-Sat, 8:00 AM – 2:00 PM',
    fee_info: 'Rs. 4,000/month'
  },
  {
    id: 'c-5',
    code: 'MAT-303',
    title: 'Matric Commerce (Class 9 – 10)',
    category: 'Matric',
    level: 'Secondary',
    grade_level: 'Class 9 & 10 (Commerce Group)',
    duration: '2 Years',
    credits: 0,
    department: 'Commerce & Business Wing',
    short_description: 'Matric Commerce — Principles of Commerce, Accounting, Economics, Mathematics, English, and Pakistan Studies.',
    full_description: 'First stepping stone for students pursuing careers in business, banking, corporate finance, and Chartered Accountancy.',
    learning_outcomes: [
      'Foundations of bookkeeping, journals, and ledger balancing',
      'Commercial transactions, banking instruments, and business documents',
      'Economic concepts, market structures, and consumer theory'
    ],
    prerequisites: ['Grade 8 completion pass'],
    syllabus_modules: [
      { title: 'Module 1: Principles of Commerce & Business Structures', description: 'Sole proprietorships, partnerships, joint ventures, and distribution networks.' },
      { title: 'Module 2: Introductory Accounting & Economics', description: 'Cash books, trial balances, and economic laws of demand and supply.' }
    ],
    instructor_name: 'Mrs. Samina Tariq (M.Com)',
    instructor_title: 'Head of Commerce Department',
    featured: false,
    capacity: 30,
    enrolled: 22,
    image_url: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=800&q=80',
    tuition_fee: 'Rs. 4,000/month',
    schedule: 'Mon-Sat, 8:00 AM – 2:00 PM',
    fee_info: 'Rs. 4,000/month'
  },
  {
    id: 'c-6',
    code: 'HSC-401',
    title: 'FSc Pre-Medical (1st & 2nd Year)',
    category: 'FSc',
    level: 'Higher Secondary',
    grade_level: '1st Year (XI) & 2nd Year (XII)',
    duration: '2 Years',
    credits: 0,
    department: 'Higher Secondary Medical Sciences (BISE Board)',
    short_description: 'FSc Pre-Medical — Physics, Chemistry, Biology, English, Ethics, and Pakistan Studies with MDCAT coaching.',
    full_description: 'Premier gateway to medical and dental universities across Pakistan. High-tech biology/chemistry labs, MCQs practice, and pre-board simulations.',
    learning_outcomes: [
      'In-depth study of Cell Biology, genetics, human anatomy, and physiology',
      'High proficiency across organic, inorganic, and physical chemistry',
      'Speed solving for timed MDCAT multiple choice question papers',
      'Achieving 1,000+ marks in BISE board examinations'
    ],
    prerequisites: ['Minimum 75% marks in Matric Science (Biology)'],
    syllabus_modules: [
      { title: 'First Year (HSSC Part 1): Cell Biology & Mechanics', description: 'Biology (cell structures, biomolecules), Physics (mechanics, waves), Chemistry (states of matter, atomic structure).' },
      { title: 'Second Year (HSSC Part 2): Genetics & Electromagnetism', description: 'Biology (reproduction, genetics, biotechnology), Physics (current, electromagnetism), Chemistry (Organic chemistry).' },
      { title: 'Practical Examinations & MDCAT Focus Sessions', description: 'Past 10-year BISE board practicals and medical model test papers.' }
    ],
    instructor_name: 'Dr. Farhat Yasmeen & Prof. Shaista Jabeen',
    instructor_title: 'Director Pre-Medical Studies',
    featured: true,
    capacity: 45,
    enrolled: 44,
    image_url: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=800&q=80',
    tuition_fee: 'Rs. 5,500/month',
    schedule: 'Mon-Sat, 8:00 AM – 2:00 PM',
    fee_info: 'Rs. 5,500/month'
  },
  {
    id: 'c-7',
    code: 'HSC-402',
    title: 'FSc Pre-Engineering (1st & 2nd Year)',
    category: 'FSc',
    level: 'Higher Secondary',
    grade_level: '1st Year (XI) & 2nd Year (XII)',
    duration: '2 Years',
    credits: 0,
    department: 'Higher Secondary Engineering Wing',
    short_description: 'FSc Pre-Engineering — Mathematics, Physics, Chemistry with ECAT and university entrance exam prep.',
    full_description: 'Most trusted pre-engineering program for admission into top engineering universities (NUST, UET, GIKI, FAST). Intensive focus on calculus and mechanics.',
    learning_outcomes: [
      'Mastery of integration, derivatives, vectors, and analytical geometry',
      'Quantitative physics laws, circuit analysis, and wave optics',
      'Comprehensive preparation for engineering entrance exams (ECAT/NET)'
    ],
    prerequisites: ['70%+ marks in Matric Science with Mathematics'],
    syllabus_modules: [
      { title: 'First Year: Fundamentals of Calculus & Thermodynamics', description: 'Matrices, trigonometry, kinematics, vectors, and chemical equilibrium.' },
      { title: 'Second Year: Advanced Calculus & Nuclear Physics', description: 'Differentiation, integration, conic sections, and modern physics.' }
    ],
    instructor_name: 'Engr. Ayesha Siddiqui (M.Sc Applied Physics / UET)',
    instructor_title: 'Head of Pre-Engineering & Physics Lab',
    featured: true,
    capacity: 35,
    enrolled: 31,
    image_url: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=800&q=80',
    tuition_fee: 'Rs. 5,500/month',
    schedule: 'Mon-Sat, 8:00 AM – 2:00 PM',
    fee_info: 'Rs. 5,500/month'
  },
  {
    id: 'c-8',
    code: 'HSC-403',
    title: 'ICS — Computer Science (1st & 2nd Year)',
    category: 'ICS',
    level: 'Higher Secondary',
    grade_level: '1st & 2nd Year (Inter Computer Science)',
    duration: '2 Years',
    credits: 0,
    department: 'Computer Science & Software Technologies',
    short_description: 'Intermediate in Computer Science (ICS) — Computer Science, Mathematics, Physics / Statistics with Python and Web Development.',
    full_description: 'Premier gateway to software engineering, computer science, and data technology degrees. Modern computer laboratories with C++ and Python instruction.',
    learning_outcomes: [
      'Core principles of C++ and Object-Oriented Programming (OOP)',
      'Database Systems, SQL relational queries, and computer networks',
      'Mathematical modeling and algorithmic logic development'
    ],
    prerequisites: ['65%+ marks in Matric Science or Computer Science'],
    syllabus_modules: [
      { title: 'First Year (ICS Part 1): Computer Architecture & IT', description: 'Hardware, software, networks, and information security.' },
      { title: 'Second Year (ICS Part 2): C++ Programming & Databases', description: 'Loops, functions, arrays, pointers, relational databases, and SQL.' }
    ],
    instructor_name: 'Mrs. Sana Malik (MS Computer Science, NUST)',
    instructor_title: 'Head of Computer Science & Technology',
    featured: true,
    capacity: 40,
    enrolled: 39,
    image_url: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=800&q=80',
    tuition_fee: 'Rs. 5,000/month',
    schedule: 'Mon-Sat, 8:00 AM – 2:00 PM',
    fee_info: 'Rs. 5,000/month'
  },
  {
    id: 'c-9',
    code: 'HSC-404',
    title: 'I.Com — Commerce (1st & 2nd Year)',
    category: 'I.Com',
    level: 'Higher Secondary',
    grade_level: '1st & 2nd Year (Commerce)',
    duration: '2 Years',
    credits: 0,
    department: 'Commerce & Accounting Department',
    short_description: 'Intermediate in Commerce (I.Com) — Principles of Accounting, Economics, Principles of Commerce, Commercial Geography, and Business Math.',
    full_description: 'Comprehensive foundation for Chartered Accountancy (CA), ACCA, and BBA. Includes practical accounting workshops and spreadsheet modeling.',
    learning_outcomes: [
      'Final accounts, bank reconciliation, and bills of exchange',
      'Detailed concepts of micro and macro economics',
      'Business statistics, indexing, and commercial computation'
    ],
    prerequisites: ['Matriculation pass in any discipline'],
    syllabus_modules: [
      { title: 'First Year: Financial Accounting & Principles of Commerce', description: 'Journals, ledgers, trial balance, financial statements, and banking fundamentals.' },
      { title: 'Second Year: Advanced Accounting & Business Math', description: 'Partnership accounts, joint stock companies, and business statistics.' }
    ],
    instructor_name: 'Mrs. Samina Tariq (M.Com, Hailey College)',
    instructor_title: 'Senior Lecturer Financial Accounting',
    featured: false,
    capacity: 35,
    enrolled: 28,
    image_url: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=800&q=80',
    tuition_fee: 'Rs. 4,500/month',
    schedule: 'Mon-Sat, 8:00 AM – 2:00 PM',
    fee_info: 'Rs. 4,500/month'
  },
  {
    id: 'c-10',
    code: 'HSC-405',
    title: 'FA — Faculty of Arts (1st & 2nd Year)',
    category: 'FA',
    level: 'Higher Secondary',
    grade_level: '1st & 2nd Year (Humanities)',
    duration: '2 Years',
    credits: 0,
    department: 'Humanities & Social Sciences',
    short_description: 'FA Humanities — Advanced Literature, English, Civics, Economics, Education, and Psychology.',
    full_description: 'Balanced and comprehensive curriculum for careers in Law (LLB), Civil Services (CSS/PMS), Journalism, and Education.',
    learning_outcomes: [
      'Political science, constitutional framework, and democratic governance',
      'Application of foundational psychological and educational theories',
      'Articulate essay writing, critical discourse, and logical argumentation'
    ],
    prerequisites: ['Matriculation pass or equivalent'],
    syllabus_modules: [
      { title: 'First Year: Literature, Civics & Education', description: 'Educational systems, civic rights, duties, and classical literature.' },
      { title: 'Second Year: Pakistan Studies, Psychology & Economics', description: 'National history, behavioral psychology, and socio-economic dynamics.' }
    ],
    instructor_name: 'Prof. Bushra Rehman (M.A. Urdu / M.Ed)',
    instructor_title: 'Head of Social Sciences Department',
    featured: false,
    capacity: 35,
    enrolled: 25,
    image_url: 'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?auto=format&fit=crop&w=800&q=80',
    tuition_fee: 'Rs. 4,500/month',
    schedule: 'Mon-Sat, 8:00 AM – 2:00 PM',
    fee_info: 'Rs. 4,500/month'
  },
  {
    id: 'c-11',
    code: 'REL-101',
    title: 'Hifz-ul-Quran with Formal Education',
    category: 'School',
    level: 'Primary',
    grade_level: 'Class 3 – Class 7',
    duration: '3 Years',
    credits: 0,
    department: 'Islamic Studies & Quran Academy',
    short_description: 'Hifz-ul-Quran with Formal Schooling — Quranic memorization with Tajweed integrated with standard primary curriculum.',
    full_description: 'A balanced and prestigious program where students memorize the Holy Quran under certified teachers while concurrently learning English, Math, and General Sciences.',
    learning_outcomes: [
      'Complete Quranic memorization with correct phonetics and Tajweed',
      'Synchronized primary and middle school academic syllabus',
      'Practical character education and ethical habit formation'
    ],
    prerequisites: ['Fluent recitation readiness and parental commitment'],
    syllabus_modules: [
      { title: 'Daily Memorization & Revision', description: 'Memorization of new lessons with systematic cumulative revision.' },
      { title: 'Phonetics & Pronunciation Rules', description: 'Pronunciation rules, letter attributes, and recitation precision.' }
    ],
    instructor_name: 'Qaria Ayesha Siddiqua (Al-Shahada Al-Alamiya Certified)',
    instructor_title: 'Head Instructor Quranic Studies',
    featured: true,
    capacity: 25,
    enrolled: 24,
    image_url: 'https://images.unsplash.com/photo-1609599006353-e629aaabfeae?auto=format&fit=crop&w=800&q=80',
    tuition_fee: 'Rs. 3,000/month',
    schedule: 'Mon-Sat, 7:30 AM – 1:30 PM',
    fee_info: 'Rs. 3,000/month'
  },
  {
    id: 'c-12',
    code: 'SKL-102',
    title: 'Spoken English & Digital Skills',
    category: 'Skills',
    level: 'Secondary',
    grade_level: 'Class 8 – 12 & Alumnae',
    duration: '6 Months',
    credits: 0,
    department: 'Language & Digital Literacy Center',
    short_description: 'Spoken English, Presentation Skills, Graphic Design, and Office Automation.',
    full_description: 'Specialized vocational program empowering students with confident verbal communication, interview mastery, and digital Canva/Office productivity tools.',
    learning_outcomes: [
      'English communication fluency and public speaking confidence',
      'PowerPoint slide presentations and Canva graphic design',
      'Professional email drafting, resume design, and web research'
    ],
    prerequisites: ['Open to all students after Grade 8 or Matriculation'],
    syllabus_modules: [
      { title: 'Module 1: Spoken English & Conversational Fluency', description: 'Everyday situational dialogues, pronunciation drills, and self-confidence.' },
      { title: 'Module 2: Digital Tools & Graphic Design', description: 'MS Office, Google Workspace, Canva, and essential digital graphics.' }
    ],
    instructor_name: 'Mrs. Nida Farooq (TESOL Certified / M.A. English)',
    instructor_title: 'Instructor Language & Professional Skills',
    featured: false,
    capacity: 30,
    enrolled: 27,
    image_url: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=800&q=80',
    tuition_fee: 'Rs. 2,500/month',
    schedule: 'Afternoon, 2:30 PM – 4:00 PM',
    fee_info: 'Rs. 2,500/month'
  }
];

export const initialEvents: EventItem[] = [
  {
    id: 'evt-1',
    title: 'Annual Results & Honors Convocation 2025',
    category: 'Academic',
    date: '2026-03-15',
    time: '10:00 AM - 01:30 PM',
    location: 'Main Auditorium, Girls Academy Islamabad',
    description: 'Grand ceremony honoring top position holders in Matric and Intermediate board examinations. All parents and guardians cordially invited.',
    keynote_speaker: 'Mrs. Raheela Perveen',
    speaker_role: 'Principal Girls Academy (M.Ed, University of the Punjab)',
    image_url: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=800&q=80',
    featured: true,
    registration_deadline: '2026-03-12',
    rsvp_required: true,
    capacity: 450,
    registered_count: 390
  },
  {
    id: 'evt-2',
    title: 'Pakistan Resolution Day Commemoration',
    category: 'Cultural',
    date: '2026-03-23',
    time: '09:00 AM - 12:30 PM',
    location: 'Academy Grounds & Grand Hall',
    description: 'Prestigious commemoration of Pakistan Resolution Day featuring national anthems, student declamations, and historical exhibition models.',
    keynote_speaker: 'Prof. Bushra Rehman',
    speaker_role: 'Head of Urdu & Pakistan Studies',
    image_url: 'https://images.unsplash.com/photo-1577962917302-cd874c4e31d2?auto=format&fit=crop&w=800&q=80',
    featured: true,
    registration_deadline: '2026-03-20',
    rsvp_required: false,
    capacity: 500,
    registered_count: 420
  },
  {
    id: 'evt-3',
    title: 'Quarterly Parents-Teacher Meeting (PTM)',
    category: 'Admissions',
    date: '2026-04-10',
    time: '08:30 AM - 01:30 PM',
    location: 'All Classrooms, Girls Academy Campus',
    description: 'One-on-one consultation with parents regarding first quarter test performance and attendance records. Report cards distributed.',
    keynote_speaker: 'Mrs. Uzma Bukhari',
    speaker_role: 'Academic Coordinator',
    image_url: 'https://images.unsplash.com/photo-1577495508048-b635879837f1?auto=format&fit=crop&w=800&q=80',
    featured: true,
    registration_deadline: '2026-04-09',
    rsvp_required: true,
    capacity: 600,
    registered_count: 510
  },
  {
    id: 'evt-4',
    title: 'Annual Science & Tech Exhibition 2026',
    category: 'Academic',
    date: '2026-05-05',
    time: '09:30 AM - 03:00 PM',
    location: 'Science Labs & Computer Hall',
    description: 'Grand exhibition of student-engineered STEM models, robotics demonstrations, and chemistry projects with certificates awarded to top exhibits.',
    keynote_speaker: 'Dr. Farhat Yasmeen',
    speaker_role: 'Head of Science Department',
    image_url: 'https://images.unsplash.com/photo-1517048676732-d65bc937f952?auto=format&fit=crop&w=800&q=80',
    featured: false,
    registration_deadline: '2026-05-01',
    rsvp_required: true,
    capacity: 350,
    registered_count: 280
  },
  {
    id: 'evt-5',
    title: 'Inter-College Qirat & Speech Competition',
    category: 'Cultural',
    date: '2026-04-20',
    time: '09:00 AM - 01:00 PM',
    location: 'Central Auditorium, Girls Academy',
    description: 'Prestigious inter-college declamation and recitation competition among top girls institutions across Islamabad and Rawalpindi.',
    keynote_speaker: 'Qaria Ayesha Siddiqua',
    speaker_role: 'Chief Adjudicator & Department of Ethics',
    image_url: 'https://images.unsplash.com/photo-1609599006353-e629aaabfeae?auto=format&fit=crop&w=800&q=80',
    featured: false,
    registration_deadline: '2026-04-16',
    rsvp_required: true,
    capacity: 300,
    registered_count: 240
  },
  {
    id: 'evt-6',
    title: 'Pre-Board Mock Examination Series',
    category: 'Academic',
    date: '2026-01-10',
    time: '08:30 AM - 11:30 AM',
    location: 'Examination Halls (BISE Pattern)',
    description: 'Full paper simulation adhering to board standards, timed conditions, and detailed post-exam evaluation.',
    keynote_speaker: 'Controller of Examinations',
    speaker_role: 'Board Examination Cell',
    image_url: 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?auto=format&fit=crop&w=800&q=80',
    featured: false,
    registration_deadline: '2026-01-05',
    rsvp_required: false,
    capacity: 400,
    registered_count: 380
  }
];

export const initialFaculty: FacultyMember[] = [
  {
    id: 'fac-1',
    name: 'Mrs. Raheela Perveen',
    designation: 'Principal & Chief Educational Advisor',
    department: 'Administration & Academic Leadership',
    qualifications: 'M.Ed, M.Sc Botany (University of the Punjab, Lahore)',
    experience_years: 24,
    bio: 'Dedicated for 24+ years to female empowerment, character building, and stellar board examination success. Former Vice Principal at Islamabad Model College.',
    email: 'principal@girlsacademy.edu.pk',
    avatar_url: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=600&q=80',
    specialization: ['Curriculum Design', 'Academic Management', 'Board Exam Strategy'],
    featured: true
  },
  {
    id: 'fac-2',
    name: 'Mrs. Sana Malik',
    designation: 'Head of Computer Science & ICS',
    department: 'Computer Science & Technology',
    qualifications: 'MS Computer Science (NUST Islamabad), BS CS (FAST-NUCES)',
    experience_years: 12,
    bio: 'Expert in computer science, Python, C++, and modern coding curricula. Pioneer of the campus smart computer labs and e-learning portals.',
    email: 'sana.malik@girlsacademy.edu.pk',
    avatar_url: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=600&q=80',
    specialization: ['C++ Programming', 'Database Systems', 'Web & Mobile Applications'],
    featured: true
  },
  {
    id: 'fac-3',
    name: 'Dr. Farhat Yasmeen',
    designation: 'Head of Science Department (Pre-Medical)',
    department: 'Department of Biology & Chemistry',
    qualifications: 'Ph.D. Biochemistry (Quaid-i-Azam University Islamabad)',
    experience_years: 18,
    bio: 'Senior board examiner and mentor who guided hundreds of pre-medical scholars to King Edward, RMU, and leading medical universities.',
    email: 'farhat.yasmeen@girlsacademy.edu.pk',
    avatar_url: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&w=600&q=80',
    specialization: ['Cell Biology', 'Organic Chemistry', 'MDCAT Coaching'],
    featured: true
  },
  {
    id: 'fac-4',
    name: 'Engr. Ayesha Siddiqui',
    designation: 'Senior Lecturer Physics & Math (Pre-Engineering)',
    department: 'Department of Physics & Engineering Sciences',
    qualifications: 'M.Sc Applied Physics (UET Lahore), B.Ed',
    experience_years: 14,
    bio: 'Specialist in making intricate mathematical physics problems intuitive and crystal clear. Lead instructor for ECAT preparations.',
    email: 'ayesha.siddiqui@girlsacademy.edu.pk',
    avatar_url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=80',
    specialization: ['Electromagnetism', 'Mechanics', 'Laboratory Practicals'],
    featured: true
  },
  {
    id: 'fac-5',
    name: 'Prof. Bushra Rehman',
    designation: 'Head of Languages, Pakistan Studies & Humanities',
    department: 'Department of Humanities & Social Sciences',
    qualifications: 'M.A. Urdu Literature (Gold Medalist), M.A. Islamic Studies',
    experience_years: 19,
    bio: 'Distinguished scholar of history and languages, coaching scholars in national declamation and essay contests.',
    email: 'bushra.rehman@girlsacademy.edu.pk',
    avatar_url: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=600&q=80',
    specialization: ['Literature & Prose', 'Pakistan Studies & History', 'Public Speaking & Debates'],
    featured: false
  },
  {
    id: 'fac-6',
    name: 'Mrs. Samina Tariq',
    designation: 'Head of Commerce & Finance',
    department: 'Department of Commerce (I.Com & Matric)',
    qualifications: 'M.Com (Hailey College of Commerce, University of the Punjab)',
    experience_years: 11,
    bio: 'Accomplished instructor in corporate accounting, financial analysis, and mercantile law for business students.',
    email: 'samina.tariq@girlsacademy.edu.pk',
    avatar_url: 'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?auto=format&fit=crop&w=600&q=80',
    specialization: ['Principles of Accounting', 'Principles of Commerce', 'Business Statistics'],
    featured: false
  }
];

export const initialTestimonials: Testimonial[] = [
  {
    id: 'test-1',
    quote: 'The dedicated guidance of Girls Academy faculty enabled me to secure 1,050 marks in Matric and a top board rank. I am now proudly pursuing FSc Pre-Medical.',
    author: 'Fatima Zahra (Scholar)',
    role: 'FSc Pre-Medical (2nd Year)',
    achievement: '1,050 / 1,100 Marks — BISE Board',
    avatar_url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80',
    year: '2025'
  },
  {
    id: 'test-2',
    quote: 'The environment here is exceptionally safe, inspiring, and dignified. The smart computer lab and student portal keep us on track every single day.',
    author: 'Ayesha Siddiqui (Scholar)',
    role: 'ICS Computer Science (1st Year)',
    achievement: 'Software Engineering Entry Qualifier',
    avatar_url: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=300&q=80',
    year: '2025'
  },
  {
    id: 'test-3',
    quote: 'As a father, an empowering and respectful academic setting was paramount for my daughter. Girls Academy has surpassed all our expectations.',
    author: 'Muhammad Akram Khan (Parent)',
    role: 'Parent of 10th Grade Scholar',
    achievement: 'Daughter Ranked 1st in Class',
    avatar_url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80',
    year: '2026'
  }
];

export const admissionsFAQ = [
  {
    q: 'What documents are required for admission into Matric and Intermediate?',
    a: 'Applicants require student NADRA B-Form, previous school report/leaving certificate, father/guardian CNIC copy, and 4 passport-size photographs.'
  },
  {
    q: 'Are there fee concessions or merit scholarships available for students?',
    a: 'Yes. The Academy grants 50% to 100% merit scholarships to scholars securing 85%+ marks, as well as dedicated financial aid for deserving families.'
  },
  {
    q: 'Which educational board is the Academy affiliated with?',
    a: 'Girls Academy is officially affiliated with the Federal Board (FBISE) and Board of Intermediate & Secondary Education (BISE).'
  },
  {
    q: 'Is safe transport facility available for commuting scholars?',
    a: 'Yes. A safe dedicated van fleet equipped with GPS tracking covers all major sectors across Islamabad and Rawalpindi.'
  },
  {
    q: 'How can parents view student attendance and fee status online?',
    a: 'Through our online Parent Portal, guardians can conveniently track daily attendance, examination grades, teacher feedback, and fee vouchers.'
  }
];
