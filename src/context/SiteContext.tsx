import React, { createContext, useContext, useState, useEffect } from 'react';
import { fetchSiteSettingsData, updateSiteSettingsData } from '../lib/dataService';

export interface SiteSettingsState {
  school_name?: string;
  academy_name?: string;
  academic_year?: string;
  tagline?: string;
  academy_tagline?: string;
  admissions_open?: string;
  admission_open?: string;
  admission_last_date?: string;
  admission_instructions?: string;
  admissions_email?: string;
  academy_email?: string;
  contact_email?: string;
  phone_number?: string;
  academy_phone?: string;
  contact_phone?: string;
  emergency_phone?: string;
  academy_whatsapp?: string;
  campus_address?: string;
  academy_address?: string;
  academy_city?: string;
  academy_province?: string;
  facebook_url?: string;
  instagram_url?: string;
  youtube_url?: string;
  whatsapp_url?: string;
  hero_title?: string;
  hero_subtitle?: string;
  hero_image_url?: string;
  total_students?: string;
  total_teachers?: string;
  total_courses?: string;
  years_of_excellence?: string;
  about_story?: string;
  mission_statement?: string;
  vision_statement?: string;
  core_val_1_title?: string;
  core_val_1_desc?: string;
  core_val_2_title?: string;
  core_val_2_desc?: string;
  core_val_3_title?: string;
  core_val_3_desc?: string;
  core_val_4_title?: string;
  core_val_4_desc?: string;
  principal_name?: string;
  principal_designation?: string;
  principal_message?: string;
  principal_photo_url?: string;
  meta_title?: string;
  meta_description?: string;
  meta_keywords?: string;
  academy_logo_url?: string;
  favicon_url?: string;
  logo_text_first?: string;
  logo_text_second?: string;
  [key: string]: any;
}

interface SiteContextType {
  settings: SiteSettingsState;
  loading: boolean;
  updateSettings: (newSettings: Partial<SiteSettingsState>) => Promise<void>;
  refreshSettings: () => Promise<void>;
}

const defaultSettings: SiteSettingsState = {
  school_name: 'Girls Academy',
  academy_name: 'Girls Academy',
  academic_year: '2026-2027',
  tagline: 'Quality Education — Inspiring Women Leaders',
  academy_tagline: 'Quality Education — Inspiring Women Leaders',
  admissions_open: 'true',
  admission_open: 'true',
  admission_last_date: '31/03/2026',
  admission_instructions: 'Online admissions for Session 2026-2027 are now open. Please upload student B-Form, previous result card, and father/guardian CNIC.',
  admissions_email: 'info@girlsacademy.edu.pk',
  academy_email: 'info@girlsacademy.edu.pk',
  contact_email: 'info@girlsacademy.edu.pk',
  phone_number: '051-4861234',
  academy_phone: '051-4861234',
  contact_phone: '051-4861234',
  emergency_phone: '051-4861235',
  academy_whatsapp: '0300-4861234',
  campus_address: 'Street 5, Sector G-11/2, Islamabad, Pakistan',
  academy_address: 'Street 5, Sector G-11/2, Islamabad, Pakistan',
  academy_city: 'Islamabad',
  academy_province: 'Islamabad Capital Territory',
  about_story: 'Empowering future women leaders through academic excellence and values-based mentorship.',
  mission_statement: 'To provide premier quality, accessible, and comprehensive education to young women.',
  vision_statement: 'A flourishing society led by educated, confident, and visionary women leaders.',
  core_val_1_title: 'Academic Rigor',
  core_val_1_desc: 'World-class academic standards, modern STEM pedagogy, and stellar Board examination performance.',
  core_val_2_title: 'Integrity & Ethics',
  core_val_2_desc: 'High moral character, civic responsibility, and holistic character building.',
  core_val_3_title: 'Leadership & Service',
  core_val_3_desc: 'Preparing patriotic, talented, and impactful young women to serve society.',
  core_val_4_title: 'Empowerment & Respect',
  core_val_4_desc: 'Fostering confidence, innovation, and self-reliance among female students.',
  principal_name: 'Mrs. Raheela Perveen',
  principal_designation: 'Principal & Head of Institution (M.Ed, University of the Punjab)',
  principal_message: 'We firmly believe that every young woman possesses boundless potential that blooms with dedicated mentorship.',
  principal_photo_url: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=600&q=80',
  total_students: '1250',
  total_teachers: '48',
  total_courses: '10',
  years_of_excellence: '18',
  hero_title: 'Welcome to Girls Academy',
  hero_subtitle: 'Premier College for Women in Islamabad — Academic Excellence and Inspiring Leadership',
  hero_image_url: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=1600&q=80',
  facebook_url: 'https://facebook.com/girlsacademy',
  instagram_url: 'https://instagram.com/girlsacademy',
  youtube_url: 'https://youtube.com/girlsacademy',
  whatsapp_url: 'https://wa.me/923004861234',
  logo_text_first: 'Girls',
  logo_text_second: 'Academy'
};

const SiteContext = createContext<SiteContextType>({
  settings: defaultSettings,
  loading: true,
  updateSettings: async () => {},
  refreshSettings: async () => {}
});

export const SiteProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [settings, setSettings] = useState<SiteSettingsState>(defaultSettings);
  const [loading, setLoading] = useState(true);

  const loadSettings = async () => {
    try {
      const data = await fetchSiteSettingsData();
      if (data && Object.keys(data).length > 0) {
        const schoolName = data.school_name || 'Girls Academy';
        const parts = schoolName.split(' ');
        const first = parts[0] || 'Girls';
        const second = parts.slice(1).join(' ') || 'Academy';

        // Sanitize any Urdu remnants from stored data
        const cleanData: Record<string, string> = { ...data };
        Object.keys(cleanData).forEach(k => {
          if (typeof cleanData[k] === 'string' && /[\u0600-\u06FF]/.test(cleanData[k])) {
            cleanData[k] = (defaultSettings as any)[k] || '';
          }
        });

        setSettings({
          ...defaultSettings,
          ...cleanData,
          logo_text_first: first,
          logo_text_second: second
        });
        
        // Update document title dynamically
        if (schoolName) {
          document.title = `${schoolName} | Official Website & Campus Portal`;
        }
      }
    } catch (err) {
      console.warn('Error loading site settings:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSettings();
  }, []);

  const updateSettings = async (newSettings: Partial<SiteSettingsState>) => {
    const updated = { ...settings, ...newSettings };
    
    // Auto-update logo parts if school name changed
    if (newSettings.school_name) {
      const parts = newSettings.school_name.trim().split(' ');
      updated.logo_text_first = parts[0] || 'Girls';
      updated.logo_text_second = parts.slice(1).join(' ') || 'Academy';
      document.title = `${newSettings.school_name} | Official Website & Campus Portal`;
    }

    setSettings(updated);

    // Persist to Supabase and storage
    const payload: Record<string, string> = {};
    Object.entries(updated).forEach(([k, v]) => {
      if (typeof v === 'string') payload[k] = v;
    });

    await updateSiteSettingsData(payload);
  };

  return (
    <SiteContext.Provider
      value={{
        settings,
        loading,
        updateSettings,
        refreshSettings: loadSettings
      }}
    >
      {children}
    </SiteContext.Provider>
  );
};

export const useSite = () => useContext(SiteContext);
export const useSiteSettings = () => useContext(SiteContext);
