import { supabase, isSupabaseConfigured } from './supabase';
import { Admission, AdmissionStatus } from '../types';

const LOCAL_ADMISSIONS_KEY = 'girls_academy_admissions_records';

// Initial pre-seeded admission records for immediate demo/testing
// Initial pre-seeded admission records for immediate demo/testing
export const initialAdmissionRecords: Admission[] = [
  {
    id: 'adm-001',
    student_name: 'Mahnoor Fatima',
    date_of_birth: '2010-04-12',
    gender: 'Female',
    email: 'mahnoor.f@example.com',
    phone: '0300-1234567',
    address: 'House 14, Street 25, Sector G-10/2',
    city: 'Islamabad',
    province: 'Islamabad Capital Territory',
    photo_url: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=400&q=80',
    previous_school: 'Islamabad Model College for Girls',
    previous_class: 'Class 8 (Matric Track)',
    previous_grade: 'Class 8 (Grade A+)',
    parent_name: 'Muhammad Tariq',
    guardian_relationship: 'Father',
    parent_relationship: 'Father',
    parent_phone: '0300-1234567',
    whatsapp_number: '0300-1234567',
    parent_whatsapp: '0300-1234567',
    parent_email: 'tariq.m@example.com',
    parent_occupation: 'Senior Accounts Officer (Govt of Pakistan)',
    cnic_number: '61101-1234567-1',
    parent_cnic: '61101-1234567-1',
    program_applied: 'Matric Science (Class 9 & 10)',
    class_grade_applying: 'Class 9 (Matric Science)',
    class_applying_for: 'Class 9 (Matric Science)',
    documents_url: [
      'https://images.unsplash.com/photo-1586281380349-632531db7ed4?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1557804506-669a67965ba0?auto=format&fit=crop&w=800&q=80'
    ],
    status: 'pending',
    admin_notes: 'Previous marksheet shows 94% marks in Federal Board middle examinations. Interview scheduled.',
    created_at: '2026-10-05T14:32:00Z',
    updated_at: '2026-10-05T14:32:00Z'
  },
  {
    id: 'adm-002',
    student_name: 'Ayesha Tariq',
    date_of_birth: '2009-08-20',
    gender: 'Female',
    email: 'ayesha.t@example.com',
    phone: '0321-9876543',
    address: 'B-42, Westridge 1, Peshawar Road',
    city: 'Rawalpindi',
    province: 'Punjab',
    photo_url: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=400&q=80',
    previous_school: 'Army Public School & College (APS)',
    previous_class: 'Class 10 Matric',
    previous_grade: 'Matric (1045/1100)',
    parent_name: 'Brigadier (R) Tariq Bilal',
    guardian_relationship: 'Father',
    parent_relationship: 'Father',
    parent_phone: '0321-9876543',
    whatsapp_number: '0321-9876543',
    parent_whatsapp: '0321-9876543',
    parent_email: 'tariq.bilal@example.com',
    parent_occupation: 'Retired Army Officer & Consultant',
    cnic_number: '37405-9876543-1',
    parent_cnic: '37405-9876543-1',
    program_applied: 'FSc Pre-Medical (Intermediate Part 1 & 2)',
    class_grade_applying: 'FSc Pre-Medical Part 1',
    class_applying_for: 'FSc Pre-Medical Part 1',
    documents_url: [
      'https://images.unsplash.com/photo-1586281380349-632531db7ed4?auto=format&fit=crop&w=800&q=80'
    ],
    status: 'approved',
    admin_notes: 'Academic dossier verified. Qualified for Merit Scholarship for FBISE High Achievers.',
    created_at: '2026-10-03T11:15:00Z',
    updated_at: '2026-10-06T09:40:00Z'
  },
  {
    id: 'adm-003',
    student_name: 'Hania Imran',
    date_of_birth: '2010-01-14',
    gender: 'Female',
    email: 'hania.imran@example.com',
    phone: '0333-5551234',
    address: 'Flat 4B, Silver Oaks, F-10 Markaz',
    city: 'Islamabad',
    province: 'Islamabad Capital Territory',
    photo_url: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=400&q=80',
    previous_school: 'Beaconhouse School System',
    previous_class: 'Class 10 Matric',
    previous_grade: 'Matric (980/1100)',
    parent_name: 'Imran Ashraf',
    guardian_relationship: 'Father',
    parent_relationship: 'Father',
    parent_phone: '0333-5551234',
    whatsapp_number: '0333-5551234',
    parent_whatsapp: '0333-5551234',
    parent_email: 'imran.ashraf@example.com',
    parent_occupation: 'Software Architect',
    cnic_number: '61101-5551234-3',
    parent_cnic: '61101-5551234-3',
    program_applied: 'ICS - Computer Science & Software Basics',
    class_grade_applying: 'ICS Part 1',
    class_applying_for: 'ICS Part 1',
    documents_url: [
      'https://images.unsplash.com/photo-1586281380349-632531db7ed4?auto=format&fit=crop&w=800&q=80'
    ],
    status: 'pending',
    admin_notes: 'Coding and mathematics assessment scheduled for Saturday.',
    created_at: '2026-10-04T08:20:00Z',
    updated_at: '2026-10-04T08:20:00Z'
  },
  {
    id: 'adm-004',
    student_name: 'Dua Zahra',
    date_of_birth: '2009-11-30',
    gender: 'Female',
    email: 'dua.zahra@example.com',
    phone: '0345-7788990',
    address: 'House 88, Sector I-8/3',
    city: 'Islamabad',
    province: 'Islamabad Capital Territory',
    photo_url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
    previous_school: 'Roots Millennium School',
    previous_class: 'Class 10',
    previous_grade: 'Matric (820/1100)',
    parent_name: 'Syed Ali Raza',
    guardian_relationship: 'Father',
    parent_relationship: 'Father',
    parent_phone: '0345-7788990',
    whatsapp_number: '0345-7788990',
    parent_whatsapp: '0345-7788990',
    parent_email: 'ali.raza@example.com',
    parent_occupation: 'Civil Contractor',
    cnic_number: '61101-7788990-9',
    parent_cnic: '61101-7788990-9',
    program_applied: 'FSc Pre-Engineering (Intermediate Part 1 & 2)',
    class_grade_applying: 'FSc Pre-Engineering Part 1',
    class_applying_for: 'FSc Pre-Engineering Part 1',
    documents_url: [
      'https://images.unsplash.com/photo-1586281380349-632531db7ed4?auto=format&fit=crop&w=800&q=80'
    ],
    status: 'rejected',
    admin_notes: 'Prerequisite mathematics test marks did not meet the Pre-Engineering minimum cutoff of 60%.',
    created_at: '2026-09-28T16:00:00Z',
    updated_at: '2026-10-02T13:10:00Z'
  }
];

function getStoredAdmissions(): Admission[] {
  const local = localStorage.getItem(LOCAL_ADMISSIONS_KEY);
  if (local) {
    try {
      return JSON.parse(local);
    } catch {}
  }
  localStorage.setItem(LOCAL_ADMISSIONS_KEY, JSON.stringify(initialAdmissionRecords));
  return initialAdmissionRecords;
}

function saveStoredAdmissions(admissions: Admission[]) {
  localStorage.setItem(LOCAL_ADMISSIONS_KEY, JSON.stringify(admissions));
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new Event('storage'));
    window.dispatchEvent(new CustomEvent('ga_admissions_updated'));
  }
}

/**
 * Upload a file to Supabase Storage bucket: admissions-documents
 */
export async function uploadAdmissionFile(
  file: File,
  folder: 'photos' | 'documents' = 'documents',
  onProgress?: (percent: number) => void
): Promise<string> {
  const fileExt = file.name.split('.').pop() || 'dat';
  const fileName = `${folder}/${Date.now()}_${Math.random().toString(36).substring(2, 9)}.${fileExt}`;

  if (onProgress) onProgress(30);

  if (isSupabaseConfigured) {
    const { data, error } = await supabase.storage
      .from('admissions-documents')
      .upload(fileName, file, {
        cacheControl: '3600',
        upsert: false
      });

    if (error) {
      console.warn('Storage upload warning, fallback to object preview:', error.message);
      if (onProgress) onProgress(100);
      return URL.createObjectURL(file);
    }

    if (onProgress) onProgress(100);
    const { data: publicData } = supabase.storage
      .from('admissions-documents')
      .getPublicUrl(data.path);

    return publicData.publicUrl || URL.createObjectURL(file);
  }

  // Standalone simulation with realistic progress delay
  await new Promise(r => setTimeout(r, 400));
  if (onProgress) onProgress(80);
  await new Promise(r => setTimeout(r, 300));
  if (onProgress) onProgress(100);

  return URL.createObjectURL(file);
}

/**
 * Submit complete multi-step admission application
 */
export async function submitAdmissionApplication(application: Omit<Admission, 'id' | 'status' | 'created_at' | 'updated_at'>): Promise<Admission> {
  const newAdmission: Admission = {
    ...application,
    id: `adm-${Date.now().toString().slice(-6)}`,
    status: 'pending',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };

  if (isSupabaseConfigured) {
    try {
      const { data, error } = await supabase
        .from('admissions')
        .insert([{
          student_name: newAdmission.student_name,
          date_of_birth: newAdmission.date_of_birth,
          gender: newAdmission.gender,
          email: newAdmission.email,
          phone: newAdmission.phone,
          address: newAdmission.address,
          parent_name: newAdmission.parent_name,
          parent_phone: newAdmission.parent_phone,
          program_applied: newAdmission.program_applied,
          previous_school: newAdmission.previous_school,
          documents_url: newAdmission.documents_url,
          status: 'pending',
          admin_notes: newAdmission.admin_notes
        }])
        .select()
        .single();

      if (!error && data) {
        newAdmission.id = data.id;
      }
    } catch (e) {
      console.warn('Supabase insert note:', e);
    }

    // Trigger Edge Function to notify admin
    try {
      await supabase.functions.invoke('notify-admin-new-application', {
        body: newAdmission
      });
    } catch {}
  }

  // Also update local storage for immediate synchronization
  const list = getStoredAdmissions();
  list.unshift(newAdmission);
  saveStoredAdmissions(list);

  return newAdmission;
}

/**
 * Fetch all admissions with optional filtering and search
 */
export async function fetchAllAdmissions(options?: {
  status?: string;
  search?: string;
}): Promise<Admission[]> {
  let records: Admission[] = [];

  if (isSupabaseConfigured) {
    try {
      let query = supabase.from('admissions').select('*').order('created_at', { ascending: false });
      if (options?.status && options.status !== 'all') {
        query = query.eq('status', options.status.toLowerCase());
      }
      if (options?.search) {
        query = query.ilike('student_name', `%${options.search}%`);
      }
      const { data, error } = await query;
      if (!error && data && data.length > 0) {
        records = data as Admission[];
      } else {
        records = getStoredAdmissions();
      }
    } catch {
      records = getStoredAdmissions();
    }
  } else {
    records = getStoredAdmissions();
  }

  // In-memory filter fallback
  if (options?.status && options.status !== 'all') {
    records = records.filter(r => r.status.toLowerCase() === options.status!.toLowerCase());
  }
  if (options?.search) {
    const s = options.search.toLowerCase();
    records = records.filter(r => 
      r.student_name.toLowerCase().includes(s) ||
      r.email.toLowerCase().includes(s) ||
      (r.program_applied && r.program_applied.toLowerCase().includes(s))
    );
  }

  return records;
}

/**
 * Update admission status, admin notes, and trigger notification & emails
 */
export async function updateAdmissionStatus(
  id: string,
  newStatus: AdmissionStatus,
  adminNotes: string,
  updatedBy: string = 'Dr. Clara Beauchamp'
): Promise<Admission> {
  const now = new Date().toISOString();
  let updatedRecord: Admission | null = null;

  // 1. Update in local storage
  const list = getStoredAdmissions();
  const targetIndex = list.findIndex(a => a.id === id);
  if (targetIndex !== -1) {
    list[targetIndex] = {
      ...list[targetIndex],
      status: newStatus,
      admin_notes: adminNotes,
      updated_by: updatedBy,
      updated_at: now
    };
    saveStoredAdmissions(list);
    updatedRecord = list[targetIndex];
  }

  // 2. Update in Supabase
  if (isSupabaseConfigured) {
    try {
      const { data, error } = await supabase
        .from('admissions')
        .update({
          status: newStatus,
          admin_notes: adminNotes,
          updated_at: now
        })
        .eq('id', id)
        .select()
        .single();

      if (!error && data) {
        updatedRecord = data as Admission;
      }

      // Trigger Edge Function to email applicant
      if (updatedRecord) {
        await supabase.functions.invoke('send-admission-email', {
          body: {
            applicantEmail: updatedRecord.email,
            applicantName: updatedRecord.student_name,
            status: newStatus,
            adminNotes: adminNotes,
            programApplied: updatedRecord.program_applied || 'Academic Program'
          }
        });
      }

      // Insert in notifications table
      await supabase.from('notifications').insert([{
        title: `Admission ${newStatus === 'approved' ? 'Approved' : 'Rejected'}`,
        message: `Application for ${updatedRecord?.program_applied || 'program'} has been marked as ${newStatus}.`,
        recipient_role: 'admin',
        is_read: false
      }]);
    } catch (err) {
      console.warn('Supabase status update note:', err);
    }
  }

  return updatedRecord || {
    id,
    student_name: 'Applicant',
    email: '',
    status: newStatus,
    admin_notes: adminNotes,
    updated_at: now
  };
}

/**
 * Check application status by email
 */
export async function checkAdmissionStatusByEmail(email: string): Promise<Admission[]> {
  const cleanEmail = email.trim().toLowerCase();

  if (isSupabaseConfigured) {
    try {
      const { data, error } = await supabase
        .from('admissions')
        .select('*')
        .ilike('email', cleanEmail)
        .order('created_at', { ascending: false });

      if (!error && data && data.length > 0) {
        return data as Admission[];
      }
    } catch {}
  }

  const list = getStoredAdmissions();
  return list.filter(a => a.email.toLowerCase() === cleanEmail);
}

/**
 * Delete admission application
 */
export async function deleteAdmission(id: string): Promise<void> {
  if (isSupabaseConfigured) {
    try {
      await supabase.from('admissions').delete().eq('id', id);
    } catch (err) {
      console.warn('Supabase delete admission warning:', err);
    }
  }
  const list = getStoredAdmissions();
  saveStoredAdmissions(list.filter(a => a.id !== id));
}

/**
 * Update full admission application details
 */
export async function updateAdmissionDetails(
  id: string, 
  updates: Partial<Admission>
): Promise<Admission> {
  const now = new Date().toISOString();
  let updatedRecord: Admission | null = null;

  if (isSupabaseConfigured) {
    try {
      const { data, error } = await supabase
        .from('admissions')
        .update({ ...updates, updated_at: now })
        .eq('id', id)
        .select()
        .single();
      if (!error && data) {
        updatedRecord = data as Admission;
      }
    } catch (err) {
      console.warn('Supabase update admission details note:', err);
    }
  }

  const list = getStoredAdmissions();
  const index = list.findIndex(a => a.id === id);
  if (index !== -1) {
    list[index] = { ...list[index], ...updates, updated_at: now };
    saveStoredAdmissions(list);
    if (!updatedRecord) updatedRecord = list[index];
  }

  return updatedRecord || { id, ...updates } as Admission;
}

/**
 * Admin: Create a new admission directly
 */
export async function createAdmission(admissionData: Partial<Admission>): Promise<Admission> {
  const now = new Date().toISOString();
  const newAdmission: Admission = {
    id: `adm-${Date.now().toString().slice(-6)}`,
    student_name: admissionData.student_name || 'New Applicant',
    date_of_birth: admissionData.date_of_birth || '2010-01-01',
    gender: admissionData.gender || 'Female',
    email: admissionData.email || '',
    phone: admissionData.phone || '',
    address: admissionData.address || '',
    city: admissionData.city || 'Islamabad',
    province: admissionData.province || 'Islamabad Capital Territory',
    photo_url: admissionData.photo_url || null,
    previous_school: admissionData.previous_school || null,
    previous_class: admissionData.previous_class || null,
    previous_grade: admissionData.previous_grade || null,
    parent_name: admissionData.parent_name || '',
    guardian_relationship: admissionData.guardian_relationship || 'Father',
    parent_phone: admissionData.parent_phone || '',
    whatsapp_number: admissionData.whatsapp_number || admissionData.phone || '',
    parent_whatsapp: admissionData.parent_whatsapp || admissionData.parent_phone || '',
    parent_email: admissionData.parent_email || '',
    parent_occupation: admissionData.parent_occupation || '',
    cnic_number: admissionData.cnic_number || '',
    parent_cnic: admissionData.parent_cnic || '',
    program_applied: admissionData.program_applied || 'Matric Science',
    class_grade_applying: admissionData.class_grade_applying || 'Class 9',
    class_applying_for: admissionData.class_applying_for || 'Class 9',
    documents_url: admissionData.documents_url || [],
    status: admissionData.status || 'pending',
    admin_notes: admissionData.admin_notes || 'Manually entered by Administration.',
    created_at: now,
    updated_at: now
  };

  if (isSupabaseConfigured) {
    try {
      const { data, error } = await supabase
        .from('admissions')
        .insert([{
          student_name: newAdmission.student_name,
          date_of_birth: newAdmission.date_of_birth,
          gender: newAdmission.gender,
          email: newAdmission.email,
          phone: newAdmission.phone,
          address: newAdmission.address,
          parent_name: newAdmission.parent_name,
          parent_phone: newAdmission.parent_phone,
          program_applied: newAdmission.program_applied,
          previous_school: newAdmission.previous_school,
          documents_url: newAdmission.documents_url,
          status: newAdmission.status,
          admin_notes: newAdmission.admin_notes
        }])
        .select()
        .single();

      if (!error && data) {
        newAdmission.id = data.id;
      }
    } catch (e) {
      console.warn('Supabase create admission note:', e);
    }
  }

  const list = getStoredAdmissions();
  list.unshift(newAdmission);
  saveStoredAdmissions(list);

  return newAdmission;
}

