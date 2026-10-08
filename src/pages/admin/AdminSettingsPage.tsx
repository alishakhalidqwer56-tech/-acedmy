import React, { useState, useEffect } from 'react';
import { PortalLayout } from '../../components/layout/PortalLayout';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { Input } from '../../components/ui/Input';
import { Textarea } from '../../components/ui/Textarea';
import { ImageUpload } from '../../components/ui/ImageUpload';
import { useToast } from '../../context/ToastContext';
import { useSite } from '../../context/SiteContext';
import { 
  Building2, 
  Phone, 
  Share2, 
  Home, 
  Info, 
  UserCheck, 
  Search, 
  Save, 
  CheckCircle2, 
  UploadCloud,
  Sparkles,
  KeyRound,
  Copy,
  Eye,
  EyeOff,
  ShieldCheck,
  Lock
} from 'lucide-react';
import { PAKISTAN_PROVINCES } from '../../types';

export const AdminSettingsPage: React.FC = () => {
  const { settings, updateSettings } = useSite();
  const toast = useToast();
  const [activeTab, setActiveTab] = useState<'identity' | 'contact' | 'social' | 'hero' | 'about' | 'admissions' | 'seo' | 'passwords'>('identity');

  // Form State
  const [formData, setFormData] = useState<Record<string, string>>({});
  const [savingSection, setSavingSection] = useState<string | null>(null);

  useEffect(() => {
    setFormData({
      // Section 1: Academy Identity
      academy_name: settings.academy_name || settings.school_name || 'Girls Academy',
      school_name: settings.academy_name || settings.school_name || 'Girls Academy',
      academy_tagline: settings.academy_tagline || settings.tagline || 'Empowering Young Minds for a Brighter Future',
      tagline: settings.academy_tagline || settings.tagline || 'Empowering Young Minds for a Brighter Future',
      academy_logo_url: settings.academy_logo_url || '',
      favicon_url: settings.favicon_url || '',

      // Section 2: Contact Info
      academy_phone: settings.academy_phone || settings.phone_number || '051-1234567',
      phone_number: settings.academy_phone || settings.phone_number || '051-1234567',
      academy_whatsapp: settings.academy_whatsapp || '0300-1234567',
      academy_email: settings.academy_email || settings.admissions_email || 'info@girlsacademy.edu.pk',
      admissions_email: settings.academy_email || settings.admissions_email || 'info@girlsacademy.edu.pk',
      academy_address: settings.academy_address || settings.campus_address || 'Street 1, Sector G-9, Islamabad, Pakistan',
      campus_address: settings.academy_address || settings.campus_address || 'Street 1, Sector G-9, Islamabad, Pakistan',
      academy_city: settings.academy_city || 'Islamabad',
      academy_province: settings.academy_province || 'Islamabad Capital Territory',

      // Section 3: Social Media
      facebook_url: settings.facebook_url || 'https://facebook.com/girlsacademy',
      instagram_url: settings.instagram_url || 'https://instagram.com/girlsacademy',
      youtube_url: settings.youtube_url || 'https://youtube.com/girlsacademy',
      whatsapp_url: settings.whatsapp_url || 'https://wa.me/923001234567',

      // Section 4: Homepage Content
      hero_title: settings.hero_title || 'Welcome to Girls Academy Islamabad',
      hero_subtitle: settings.hero_subtitle || 'Premier College and School Education for Future Women Leaders in Pakistan',
      hero_image_url: settings.hero_image_url || 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=1600&q=80',
      total_students: settings.total_students || '1,200+',
      total_teachers: settings.total_teachers || '45+',
      total_courses: settings.total_courses || '20+',
      years_of_excellence: settings.years_of_excellence || '15',

      // Section 5: About Page
      about_story: settings.about_story || 'Girls Academy Islamabad was founded with a profound vision: to deliver world-class academic rigour, leadership cultivation, and moral mentorship to female students across Pakistan. With state-of-the-art laboratory facilities and FBISE / BISE board affiliations, we provide complete science, computer science, and commerce streams.',
      mission_statement: settings.mission_statement || 'To empower girls and young women with knowledge, ethical leadership, critical thinking, and the confidence to lead across medicine, engineering, computing, and public service.',
      vision_statement: settings.vision_statement || 'To be Pakistan’s foremost institution for female scholarship, renowned for character development, innovation, and university placements.',
      core_val_1_title: settings.core_val_1_title || 'Academic Rigour',
      core_val_1_desc: settings.core_val_1_desc || 'Relentless pursuit of intellectual excellence through conceptual learning, weekly diagnostics, and board exam mastery.',
      core_val_2_title: settings.core_val_2_title || 'Moral Integrity & Islamic Values',
      core_val_2_desc: settings.core_val_2_desc || 'Instilling ethical responsibility, modesty, empathy, and service to humanity in every scholar.',
      core_val_3_title: settings.core_val_3_title || 'Digital & Scientific Mastery',
      core_val_3_desc: settings.core_val_3_desc || 'Modern robotics, laboratory experimentation, and computing facilities ensuring global competitiveness.',
      core_val_4_title: settings.core_val_4_title || 'Leadership & Oratory',
      core_val_4_desc: settings.core_val_4_desc || 'Cultivating fearless public speaking, declamation, debate, and collaborative problem-solving skills.',
      principal_name: settings.principal_name || 'Mrs. Fatima Khan',
      principal_designation: settings.principal_designation || 'Principal & Head of Institution (M.Phil Education, QAU)',
      principal_message: settings.principal_message || 'Assalamu Alaikum. At Girls Academy, we believe every daughter deserves holistic, future-ready education that combines academic excellence with high ethical values and digital readiness.',
      principal_photo_url: settings.principal_photo_url || 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=600&q=80',

      // Section 6: Admissions Settings
      admission_open: settings.admission_open ?? 'true',
      admissions_open: settings.admissions_open ?? 'true',
      admission_last_date: settings.admission_last_date || '31/12/2026',
      admission_instructions: settings.admission_instructions || 'Online admissions for Session 2026-2027 are now open. Upload clear copies of B-Form, previous mark sheets, and parent CNIC. Entrance test dates will be communicated via SMS and WhatsApp.',

      // Section 7: SEO & Meta
      meta_title: settings.meta_title || 'Girls Academy Islamabad | College & School Portal',
      meta_description: settings.meta_description || 'Official college management portal and website for Girls Academy Islamabad, offering Matric, FSc Pre-Medical, Pre-Engineering, and ICS education.',
      meta_keywords: settings.meta_keywords || 'Girls Academy, Islamabad College, FBISE school, FSc pre medical Islamabad, ICS computer science, girls education Pakistan',
    });
  }, [settings]);

  const handleChange = (key: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [key]: value,
      // sync aliases
      ...(key === 'academy_name' ? { school_name: value } : {}),
      ...(key === 'academy_tagline' ? { tagline: value } : {}),
      ...(key === 'academy_phone' ? { phone_number: value, contact_phone: value } : {}),
      ...(key === 'academy_email' ? { admissions_email: value, contact_email: value } : {}),
      ...(key === 'academy_address' ? { campus_address: value, address: value } : {}),
      ...(key === 'admission_open' ? { admissions_open: value } : {}),
    }));
  };

  const handleSaveSection = async (sectionName: string, keys: string[]) => {
    setSavingSection(sectionName);
    try {
      const payload: Record<string, string> = {};
      keys.forEach(k => {
        if (formData[k] !== undefined) payload[k] = formData[k];
      });

      // Also ensure aliases sync
      if (payload.academy_name) payload.school_name = payload.academy_name;
      if (payload.academy_tagline) payload.tagline = payload.academy_tagline;
      if (payload.academy_phone) {
        payload.phone_number = payload.academy_phone;
        payload.contact_phone = payload.academy_phone;
      }
      if (payload.academy_email) {
        payload.admissions_email = payload.academy_email;
        payload.contact_email = payload.academy_email;
      }
      if (payload.academy_address) {
        payload.campus_address = payload.academy_address;
        payload.address = payload.academy_address;
      }
      if (payload.admission_open) payload.admissions_open = payload.admission_open;

      await updateSettings(payload);
      toast.success(`${sectionName} saved successfully! Changes are live across the site.`);
    } catch (err: any) {
      toast.error(err.message || `Failed to save ${sectionName}`);
    } finally {
      setSavingSection(null);
    }
  };

  // Passwords Management State
  const [adminPass, setAdminPass] = useState(localStorage.getItem('ga_admin_secret_pass') || 'admin123');
  const [showAdminPass, setShowAdminPass] = useState(false);
  const [teacherPass, setTeacherPass] = useState(localStorage.getItem('ga_teacher_secret_pass') || 'teacher123');
  const [showTeacherPass, setShowTeacherPass] = useState(false);
  const [studentPass, setStudentPass] = useState(localStorage.getItem('ga_student_secret_pass') || 'student123');
  const [showStudentPass, setShowStudentPass] = useState(false);
  const [parentPass, setParentPass] = useState(localStorage.getItem('ga_parent_secret_pass') || 'parent123');
  const [showParentPass, setShowParentPass] = useState(false);

  const handleSavePassword = (role: 'admin' | 'teacher' | 'student' | 'parent', newPass: string) => {
    if (!newPass.trim() || newPass.trim().length < 4) {
      toast.error('Password must be at least 4 characters long.');
      return;
    }
    const key = `ga_${role}_secret_pass`;
    localStorage.setItem(key, newPass.trim());
    toast.success(`${role.charAt(0).toUpperCase() + role.slice(1)} password updated securely!`);
  };

  const copyCredentials = (roleName: string, email: string, pass: string) => {
    const text = `Girls Academy ${roleName} Access Credentials\nEmail: ${email}\nPassword: ${pass}\nPortal: ${window.location.origin}/login`;
    navigator.clipboard.writeText(text);
    toast.success(`${roleName} credentials copied to clipboard! You can privately send this via WhatsApp or SMS.`);
  };

  const tabs = [
    { id: 'identity', label: '1. Identity', icon: <Building2 className="w-4 h-4" /> },
    { id: 'contact', label: '2. Contact', icon: <Phone className="w-4 h-4" /> },
    { id: 'social', label: '3. Social Media', icon: <Share2 className="w-4 h-4" /> },
    { id: 'hero', label: '4. Homepage', icon: <Home className="w-4 h-4" /> },
    { id: 'about', label: '5. About Page', icon: <Info className="w-4 h-4" /> },
    { id: 'admissions', label: '6. Admissions', icon: <UserCheck className="w-4 h-4" /> },
    { id: 'seo', label: '7. SEO & Meta', icon: <Search className="w-4 h-4" /> },
    { id: 'passwords', label: '8. Access & Passwords', icon: <KeyRound className="w-4 h-4" /> },
  ] as const;

  return (
    <PortalLayout
      pageTitle="Site Settings & Institutional Governance"
      pageSubtitle="Comprehensive control center for all public website copy, contact info, branding, leadership message, and admissions."
    >
      <div className="space-y-6 max-w-6xl">
        {/* Navigation Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-2 border-b border-[#2a2a3e] scrollbar-thin">
          {tabs.map(t => (
            <button
              key={t.id}
              type="button"
              onClick={() => setActiveTab(t.id)}
              className={`px-4 py-2.5 rounded-xl text-xs font-semibold flex items-center gap-2 whitespace-nowrap transition-all cursor-pointer ${
                activeTab === t.id
                  ? 'bg-purple-600 text-white shadow-lg shadow-purple-900/30'
                  : 'bg-[#181827] text-slate-400 hover:text-white hover:bg-white/5 border border-[#2a2a3e]'
              }`}
            >
              {t.icon}
              <span>{t.label}</span>
            </button>
          ))}
        </div>

        {/* SECTION 1: ACADEMY IDENTITY */}
        {activeTab === 'identity' && (
          <Card className="p-6 bg-[#161625] border-[#2a2a3e] space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-[#2a2a3e]">
              <div>
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <Building2 className="w-5 h-5 text-purple-400" />
                  Section 1 — Academy Identity
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Institutional branding, name, tagline, logo and favicon updated dynamically sitewide.
                </p>
              </div>
              <Button
                type="button"
                variant="primary"
                size="sm"
                isLoading={savingSection === 'Identity'}
                onClick={() => handleSaveSection('Identity', ['academy_name', 'academy_tagline', 'academy_logo_url', 'favicon_url'])}
                leftIcon={<Save className="w-4 h-4" />}
              >
                Save Identity
              </Button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <Input
                label="Academy Name *"
                value={formData.academy_name || ''}
                onChange={(e) => handleChange('academy_name', e.target.value)}
                placeholder="Girls Academy"
                helperText="Updates navbar, footer, login headers and official portal branding"
              />
              <Input
                label="Academy Tagline *"
                value={formData.academy_tagline || ''}
                onChange={(e) => handleChange('academy_tagline', e.target.value)}
                placeholder="Empowering Young Minds for a Brighter Future"
                helperText="Displayed beneath the logo and on footer / hero sections"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <ImageUpload
                label="Academy Official Logo"
                value={formData.academy_logo_url || ''}
                onChange={(url) => handleChange('academy_logo_url', url)}
                helperText="Upload transparent PNG or WebP campus emblem"
              />
              <Input
                label="Favicon URL"
                value={formData.favicon_url || ''}
                onChange={(e) => handleChange('favicon_url', e.target.value)}
                placeholder="https://.../favicon.ico"
                helperText="Browser tab icon link"
              />
            </div>
          </Card>
        )}

        {/* SECTION 2: CONTACT INFORMATION */}
        {activeTab === 'contact' && (
          <Card className="p-6 bg-[#161625] border-[#2a2a3e] space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-[#2a2a3e]">
              <div>
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <Phone className="w-5 h-5 text-purple-400" />
                  Section 2 — Contact Information
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Pakistani phone format (03XX-XXXXXXX), landline, official email, and campus address.
                </p>
              </div>
              <Button
                type="button"
                variant="primary"
                size="sm"
                isLoading={savingSection === 'Contact Info'}
                onClick={() => handleSaveSection('Contact Info', ['academy_phone', 'academy_whatsapp', 'academy_email', 'academy_address', 'academy_city', 'academy_province'])}
                leftIcon={<Save className="w-4 h-4" />}
              >
                Save Contact Info
              </Button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
              <Input
                label="Landline / Desk Phone *"
                value={formData.academy_phone || ''}
                onChange={(e) => handleChange('academy_phone', e.target.value)}
                placeholder="051-1234567"
              />
              <Input
                label="Official WhatsApp Hotline *"
                value={formData.academy_whatsapp || ''}
                onChange={(e) => handleChange('academy_whatsapp', e.target.value)}
                placeholder="0300-1234567"
              />
              <Input
                label="Official Email Address *"
                type="email"
                value={formData.academy_email || ''}
                onChange={(e) => handleChange('academy_email', e.target.value)}
                placeholder="info@girlsacademy.edu.pk"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
              <div className="sm:col-span-1">
                <Input
                  label="City *"
                  value={formData.academy_city || ''}
                  onChange={(e) => handleChange('academy_city', e.target.value)}
                  placeholder="Islamabad"
                />
              </div>
              <div className="sm:col-span-1">
                <label className="block text-xs font-medium text-slate-300 mb-1.5">Province *</label>
                <select
                  value={formData.academy_province || 'Islamabad Capital Territory'}
                  onChange={(e) => handleChange('academy_province', e.target.value)}
                  className="w-full bg-[#141422] border border-[#2a2a3e] rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:ring-2 focus:ring-purple-500/50"
                >
                  {PAKISTAN_PROVINCES.map(p => (
                    <option key={p} value={p}>{p}</option>
                  ))}
                </select>
              </div>
              <div className="sm:col-span-1">
                <Input
                  label="Full Campus Street Address *"
                  value={formData.academy_address || ''}
                  onChange={(e) => handleChange('academy_address', e.target.value)}
                  placeholder="Street 1, Sector G-9, Islamabad, Pakistan"
                />
              </div>
            </div>
          </Card>
        )}

        {/* SECTION 3: SOCIAL MEDIA */}
        {activeTab === 'social' && (
          <Card className="p-6 bg-[#161625] border-[#2a2a3e] space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-[#2a2a3e]">
              <div>
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <Share2 className="w-5 h-5 text-purple-400" />
                  Section 3 — Social Media Channels
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Direct social links shown on the public footer, contact page, and header banners.
                </p>
              </div>
              <Button
                type="button"
                variant="primary"
                size="sm"
                isLoading={savingSection === 'Social Media'}
                onClick={() => handleSaveSection('Social Media', ['facebook_url', 'instagram_url', 'youtube_url', 'whatsapp_url'])}
                leftIcon={<Save className="w-4 h-4" />}
              >
                Save Social Links
              </Button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <Input
                label="Facebook Page URL"
                value={formData.facebook_url || ''}
                onChange={(e) => handleChange('facebook_url', e.target.value)}
                placeholder="https://facebook.com/girlsacademy"
              />
              <Input
                label="Instagram Profile URL"
                value={formData.instagram_url || ''}
                onChange={(e) => handleChange('instagram_url', e.target.value)}
                placeholder="https://instagram.com/girlsacademy"
              />
              <Input
                label="YouTube Channel URL"
                value={formData.youtube_url || ''}
                onChange={(e) => handleChange('youtube_url', e.target.value)}
                placeholder="https://youtube.com/girlsacademy"
              />
              <Input
                label="WhatsApp Chat URL (wa.me/)"
                value={formData.whatsapp_url || ''}
                onChange={(e) => handleChange('whatsapp_url', e.target.value)}
                placeholder="https://wa.me/923001234567"
              />
            </div>
          </Card>
        )}

        {/* SECTION 4: HOMEPAGE CONTENT */}
        {activeTab === 'hero' && (
          <Card className="p-6 bg-[#161625] border-[#2a2a3e] space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-[#2a2a3e]">
              <div>
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <Home className="w-5 h-5 text-purple-400" />
                  Section 4 — Homepage Content & Metrics
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Hero banners, headlines, and 4 institutional milestone counters.
                </p>
              </div>
              <Button
                type="button"
                variant="primary"
                size="sm"
                isLoading={savingSection === 'Homepage Content'}
                onClick={() => handleSaveSection('Homepage Content', ['hero_title', 'hero_subtitle', 'hero_image_url', 'total_students', 'total_teachers', 'total_courses', 'years_of_excellence'])}
                leftIcon={<Save className="w-4 h-4" />}
              >
                Save Homepage
              </Button>
            </div>

            <div className="space-y-4">
              <Input
                label="Hero Title Headline *"
                value={formData.hero_title || ''}
                onChange={(e) => handleChange('hero_title', e.target.value)}
                placeholder="Welcome to Girls Academy Islamabad"
              />
              <Textarea
                label="Hero Subtitle / Mission Statement *"
                rows={2}
                value={formData.hero_subtitle || ''}
                onChange={(e) => handleChange('hero_subtitle', e.target.value)}
                placeholder="Premier College and School Education for Future Women Leaders in Pakistan"
              />
              <ImageUpload
                label="Hero Background Image"
                value={formData.hero_image_url || ''}
                onChange={(url) => handleChange('hero_image_url', url)}
                helperText="High-resolution banner photo of students, laboratory or campus"
              />
            </div>

            <div className="pt-2">
              <h4 className="text-xs font-semibold text-purple-300 uppercase tracking-wider mb-3">
                Institutional Stats Bar Counters
              </h4>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <Input
                  label="Total Students"
                  value={formData.total_students || ''}
                  onChange={(e) => handleChange('total_students', e.target.value)}
                  placeholder="1,200+"
                />
                <Input
                  label="Total Teachers"
                  value={formData.total_teachers || ''}
                  onChange={(e) => handleChange('total_teachers', e.target.value)}
                  placeholder="45+"
                />
                <Input
                  label="Total Courses"
                  value={formData.total_courses || ''}
                  onChange={(e) => handleChange('total_courses', e.target.value)}
                  placeholder="20+"
                />
                <Input
                  label="Years of Excellence"
                  value={formData.years_of_excellence || ''}
                  onChange={(e) => handleChange('years_of_excellence', e.target.value)}
                  placeholder="15"
                />
              </div>
            </div>
          </Card>
        )}

        {/* SECTION 5: ABOUT PAGE */}
        {activeTab === 'about' && (
          <Card className="p-6 bg-[#161625] border-[#2a2a3e] space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-[#2a2a3e]">
              <div>
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <Info className="w-5 h-5 text-purple-400" />
                  Section 5 — About Page & Leadership Message
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Academy story, mission, vision, 4 core values, and principal's official message.
                </p>
              </div>
              <Button
                type="button"
                variant="primary"
                size="sm"
                isLoading={savingSection === 'About Page'}
                onClick={() => handleSaveSection('About Page', [
                  'about_story', 'mission_statement', 'vision_statement',
                  'core_val_1_title', 'core_val_1_desc',
                  'core_val_2_title', 'core_val_2_desc',
                  'core_val_3_title', 'core_val_3_desc',
                  'core_val_4_title', 'core_val_4_desc',
                  'principal_name', 'principal_designation', 'principal_message', 'principal_photo_url'
                ])}
                leftIcon={<Save className="w-4 h-4" />}
              >
                Save About Page
              </Button>
            </div>

            <Textarea
              label="Academy Founding Story *"
              rows={4}
              value={formData.about_story || ''}
              onChange={(e) => handleChange('about_story', e.target.value)}
              placeholder="Girls Academy Islamabad was founded with a profound vision..."
            />

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <Textarea
                label="Mission Statement *"
                rows={3}
                value={formData.mission_statement || ''}
                onChange={(e) => handleChange('mission_statement', e.target.value)}
              />
              <Textarea
                label="Vision Statement *"
                rows={3}
                value={formData.vision_statement || ''}
                onChange={(e) => handleChange('vision_statement', e.target.value)}
              />
            </div>

            {/* Core Values */}
            <div>
              <h4 className="text-xs font-semibold text-purple-300 uppercase tracking-wider mb-3">
                Core Values (4 Pillars)
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-4 rounded-xl bg-[#141422] border border-[#2a2a3e] space-y-2">
                  <Input
                    label="Value 1 Title"
                    value={formData.core_val_1_title || ''}
                    onChange={(e) => handleChange('core_val_1_title', e.target.value)}
                  />
                  <Textarea
                    label="Value 1 Description"
                    rows={2}
                    value={formData.core_val_1_desc || ''}
                    onChange={(e) => handleChange('core_val_1_desc', e.target.value)}
                  />
                </div>
                <div className="p-4 rounded-xl bg-[#141422] border border-[#2a2a3e] space-y-2">
                  <Input
                    label="Value 2 Title"
                    value={formData.core_val_2_title || ''}
                    onChange={(e) => handleChange('core_val_2_title', e.target.value)}
                  />
                  <Textarea
                    label="Value 2 Description"
                    rows={2}
                    value={formData.core_val_2_desc || ''}
                    onChange={(e) => handleChange('core_val_2_desc', e.target.value)}
                  />
                </div>
                <div className="p-4 rounded-xl bg-[#141422] border border-[#2a2a3e] space-y-2">
                  <Input
                    label="Value 3 Title"
                    value={formData.core_val_3_title || ''}
                    onChange={(e) => handleChange('core_val_3_title', e.target.value)}
                  />
                  <Textarea
                    label="Value 3 Description"
                    rows={2}
                    value={formData.core_val_3_desc || ''}
                    onChange={(e) => handleChange('core_val_3_desc', e.target.value)}
                  />
                </div>
                <div className="p-4 rounded-xl bg-[#141422] border border-[#2a2a3e] space-y-2">
                  <Input
                    label="Value 4 Title"
                    value={formData.core_val_4_title || ''}
                    onChange={(e) => handleChange('core_val_4_title', e.target.value)}
                  />
                  <Textarea
                    label="Value 4 Description"
                    rows={2}
                    value={formData.core_val_4_desc || ''}
                    onChange={(e) => handleChange('core_val_4_desc', e.target.value)}
                  />
                </div>
              </div>
            </div>

            {/* Principal's Message */}
            <div className="pt-4 border-t border-[#2a2a3e]">
              <h4 className="text-xs font-semibold text-purple-300 uppercase tracking-wider mb-3">
                Principal Profile & Message
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                <Input
                  label="Principal Name *"
                  value={formData.principal_name || ''}
                  onChange={(e) => handleChange('principal_name', e.target.value)}
                  placeholder="Mrs. Fatima Khan"
                />
                <Input
                  label="Principal Designation"
                  value={formData.principal_designation || ''}
                  onChange={(e) => handleChange('principal_designation', e.target.value)}
                  placeholder="Principal & Head of Institution (M.Phil Education, QAU)"
                />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
                <div className="sm:col-span-2">
                  <Textarea
                    label="Principal Official Address & Message *"
                    rows={5}
                    value={formData.principal_message || ''}
                    onChange={(e) => handleChange('principal_message', e.target.value)}
                  />
                </div>
                <div className="sm:col-span-1">
                  <ImageUpload
                    label="Principal Official Photograph"
                    value={formData.principal_photo_url || ''}
                    onChange={(url) => handleChange('principal_photo_url', url)}
                  />
                </div>
              </div>
            </div>
          </Card>
        )}

        {/* SECTION 6: ADMISSIONS SETTINGS */}
        {activeTab === 'admissions' && (
          <Card className="p-6 bg-[#161625] border-[#2a2a3e] space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-[#2a2a3e]">
              <div>
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <UserCheck className="w-5 h-5 text-purple-400" />
                  Section 6 — Admissions Settings
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Controls online admissions portal status, application deadline, and candidate instructions.
                </p>
              </div>
              <Button
                type="button"
                variant="primary"
                size="sm"
                isLoading={savingSection === 'Admissions Settings'}
                onClick={() => handleSaveSection('Admissions Settings', ['admission_open', 'admission_last_date', 'admission_instructions'])}
                leftIcon={<Save className="w-4 h-4" />}
              >
                Save Admissions Settings
              </Button>
            </div>

            <div className="p-4 rounded-2xl bg-[#141422] border border-[#2a2a3e] flex items-center justify-between">
              <div>
                <h4 className="text-sm font-semibold text-white">Online Admissions Window</h4>
                <p className="text-xs text-slate-400">
                  When enabled, "Apply Now" buttons are active across public pages and the 5-step form accepts submissions.
                </p>
              </div>
              <button
                type="button"
                onClick={() => handleChange('admission_open', formData.admission_open === 'true' ? 'false' : 'true')}
                className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                  formData.admission_open === 'true' ? 'bg-purple-600' : 'bg-slate-700'
                }`}
              >
                <span
                  className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out ${
                    formData.admission_open === 'true' ? 'translate-x-5' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <Input
                label="Admissions Deadline / Last Date (DD/MM/YYYY) *"
                value={formData.admission_last_date || ''}
                onChange={(e) => handleChange('admission_last_date', e.target.value)}
                placeholder="31/12/2026"
                helperText="Formatted as DD/MM/YYYY for Pakistani academic sessions"
              />
            </div>

            <Textarea
              label="Public Admission Instructions & Guidelines *"
              rows={4}
              value={formData.admission_instructions || ''}
              onChange={(e) => handleChange('admission_instructions', e.target.value)}
              placeholder="Online admissions for Session 2026-2027 are now open..."
            />
          </Card>
        )}

        {/* SECTION 7: SEO & META */}
        {activeTab === 'seo' && (
          <Card className="p-6 bg-[#161625] border-[#2a2a3e] space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-[#2a2a3e]">
              <div>
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <Search className="w-5 h-5 text-purple-400" />
                  Section 7 — Search Engine Optimization (SEO) & Meta Tags
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Search index tags, meta descriptions, and Google indexing keywords for the academy.
                </p>
              </div>
              <Button
                type="button"
                variant="primary"
                size="sm"
                isLoading={savingSection === 'SEO & Meta'}
                onClick={() => handleSaveSection('SEO & Meta', ['meta_title', 'meta_description', 'meta_keywords'])}
                leftIcon={<Save className="w-4 h-4" />}
              >
                Save SEO & Meta
              </Button>
            </div>

            <div className="space-y-4">
              <Input
                label="Search Engine Page Title *"
                value={formData.meta_title || ''}
                onChange={(e) => handleChange('meta_title', e.target.value)}
                placeholder="Girls Academy Islamabad | College & School Portal"
              />
              <Textarea
                label="Meta Description (150-160 characters recommended)"
                rows={3}
                value={formData.meta_description || ''}
                onChange={(e) => handleChange('meta_description', e.target.value)}
                placeholder="Official college management portal and website for Girls Academy Islamabad..."
              />
              <Input
                label="Meta Keywords (comma-separated)"
                value={formData.meta_keywords || ''}
                onChange={(e) => handleChange('meta_keywords', e.target.value)}
                placeholder="Girls Academy, Islamabad College, FBISE school, FSc pre medical Islamabad, ICS"
              />
            </div>
          </Card>
        )}

        {/* SECTION 8: ACCESS & PASSWORDS MANAGEMENT */}
        {activeTab === 'passwords' && (
          <div className="space-y-6">
            <Card className="p-6 bg-[#161625] border-purple-500/30 space-y-6">
              <div className="pb-4 border-b border-[#2a2a3e]">
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <KeyRound className="w-5 h-5 text-purple-400" />
                  Section 8 — Portal Access Control & Password Management
                </h3>
                <p className="text-xs text-slate-400 mt-1">
                  Manage secret login credentials for Administrators, Faculty Teachers, Students, and Parents.
                </p>
              </div>

              {/* Security Shield Guarantee Notice */}
              <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-start gap-3 text-xs text-emerald-200">
                <ShieldCheck className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <p className="font-semibold text-emerald-300">
                    High Security Protection: Passwords Hidden from Clients
                  </p>
                  <p className="text-[11px] leading-relaxed text-emerald-200/80">
                    یہ تمام پاس ورڈز کلائنٹس، سٹوڈنٹس اور پبلک وزیٹرز سے مکمل طور پر چھپے ہوئے ہیں۔ پبلک لاگ ان اسکرین پر کوئی پاس ورڈ ظاہر نہیں ہوتا۔ جس شخص کو آپ خود رسائی دیں گے، صرف وہی اپنے پاس ورڈ کے ذریعے پورٹل میں لاگ اِن ہو سکے گا۔
                  </p>
                </div>
              </div>

              {/* 4 Roles Credentials Cards Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                
                {/* 1. Admin Password Card */}
                <div className="p-5 rounded-2xl bg-[#121122] border border-amber-500/30 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-amber-400 uppercase tracking-wider flex items-center gap-1.5">
                      <Lock className="w-3.5 h-3.5" />
                      1. Administrator Secret Access
                    </span>
                    <Badge variant="amber">Master Role</Badge>
                  </div>
                  <div>
                    <label className="block text-[11px] text-slate-400 mb-1">Admin Email Address</label>
                    <input
                      type="text"
                      readOnly
                      value="admin@girlsacademy.edu.pk"
                      className="w-full bg-[#181829] border border-[#2d2a45] rounded-xl px-3 py-2 text-xs text-slate-300 select-all"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] text-slate-400 mb-1">Administrator Password</label>
                    <div className="relative">
                      <input
                        type={showAdminPass ? 'text' : 'password'}
                        value={adminPass}
                        onChange={(e) => setAdminPass(e.target.value)}
                        placeholder="Set Admin Password"
                        className="w-full bg-[#181829] border border-[#2d2a45] rounded-xl px-3 pr-10 py-2 text-xs text-white focus:outline-none focus:border-amber-500"
                      />
                      <button
                        type="button"
                        onClick={() => setShowAdminPass(!showAdminPass)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white cursor-pointer"
                      >
                        {showAdminPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>
                  <div className="pt-2 flex items-center gap-2">
                    <Button
                      type="button"
                      variant="primary"
                      size="sm"
                      onClick={() => handleSavePassword('admin', adminPass)}
                      className="w-full bg-gradient-to-r from-amber-600 to-rose-600 hover:from-amber-500 hover:to-rose-500 text-white"
                    >
                      Save Admin Password
                    </Button>
                  </div>
                </div>

                {/* 2. Teacher Password Card */}
                <div className="p-5 rounded-2xl bg-[#121122] border border-purple-500/30 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-purple-400 uppercase tracking-wider flex items-center gap-1.5">
                      <Lock className="w-3.5 h-3.5" />
                      2. Faculty / Teacher Portal
                    </span>
                    <Badge variant="purple">Faculty Role</Badge>
                  </div>
                  <div>
                    <label className="block text-[11px] text-slate-400 mb-1">Teacher Email Address</label>
                    <input
                      type="text"
                      readOnly
                      value="teacher@girlsacademy.edu.pk"
                      className="w-full bg-[#181829] border border-[#2d2a45] rounded-xl px-3 py-2 text-xs text-slate-300 select-all"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] text-slate-400 mb-1">Teacher Password</label>
                    <div className="relative">
                      <input
                        type={showTeacherPass ? 'text' : 'password'}
                        value={teacherPass}
                        onChange={(e) => setTeacherPass(e.target.value)}
                        placeholder="Set Teacher Password"
                        className="w-full bg-[#181829] border border-[#2d2a45] rounded-xl px-3 pr-10 py-2 text-xs text-white focus:outline-none focus:border-purple-500"
                      />
                      <button
                        type="button"
                        onClick={() => setShowTeacherPass(!showTeacherPass)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white cursor-pointer"
                      >
                        {showTeacherPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>
                  <div className="pt-2 flex items-center gap-2">
                    <Button
                      type="button"
                      variant="primary"
                      size="sm"
                      onClick={() => handleSavePassword('teacher', teacherPass)}
                      className="flex-1"
                    >
                      Save Password
                    </Button>
                    <button
                      type="button"
                      onClick={() => copyCredentials('Teacher', 'teacher@girlsacademy.edu.pk', teacherPass)}
                      className="p-2 rounded-xl bg-[#1e1c33] hover:bg-[#282645] border border-[#373359] text-purple-300 hover:text-white transition-colors cursor-pointer"
                      title="Copy credentials to send privately via WhatsApp"
                    >
                      <Copy className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* 3. Student Password Card */}
                <div className="p-5 rounded-2xl bg-[#121122] border border-pink-500/30 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-pink-400 uppercase tracking-wider flex items-center gap-1.5">
                      <Lock className="w-3.5 h-3.5" />
                      3. Student Portal Access
                    </span>
                    <Badge variant="emerald">Student Desk</Badge>
                  </div>
                  <div>
                    <label className="block text-[11px] text-slate-400 mb-1">Demo Student Email</label>
                    <input
                      type="text"
                      readOnly
                      value="student@girlsacademy.edu.pk"
                      className="w-full bg-[#181829] border border-[#2d2a45] rounded-xl px-3 py-2 text-xs text-slate-300 select-all"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] text-slate-400 mb-1">Student Access Password</label>
                    <div className="relative">
                      <input
                        type={showStudentPass ? 'text' : 'password'}
                        value={studentPass}
                        onChange={(e) => setStudentPass(e.target.value)}
                        placeholder="Set Student Password"
                        className="w-full bg-[#181829] border border-[#2d2a45] rounded-xl px-3 pr-10 py-2 text-xs text-white focus:outline-none focus:border-pink-500"
                      />
                      <button
                        type="button"
                        onClick={() => setShowStudentPass(!showStudentPass)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white cursor-pointer"
                      >
                        {showStudentPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>
                  <div className="pt-2 flex items-center gap-2">
                    <Button
                      type="button"
                      variant="primary"
                      size="sm"
                      onClick={() => handleSavePassword('student', studentPass)}
                      className="flex-1 bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-500 hover:to-purple-500 text-white"
                    >
                      Save Password
                    </Button>
                    <button
                      type="button"
                      onClick={() => copyCredentials('Student', 'student@girlsacademy.edu.pk', studentPass)}
                      className="p-2 rounded-xl bg-[#1e1c33] hover:bg-[#282645] border border-[#373359] text-pink-300 hover:text-white transition-colors cursor-pointer"
                      title="Copy credentials to send privately to student"
                    >
                      <Copy className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* 4. Parent Password Card */}
                <div className="p-5 rounded-2xl bg-[#121122] border border-blue-500/30 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-blue-400 uppercase tracking-wider flex items-center gap-1.5">
                      <Lock className="w-3.5 h-3.5" />
                      4. Parent & Guardian Portal
                    </span>
                    <Badge variant="cyan">Guardian Desk</Badge>
                  </div>
                  <div>
                    <label className="block text-[11px] text-slate-400 mb-1">Parent Email Address</label>
                    <input
                      type="text"
                      readOnly
                      value="parent@girlsacademy.edu.pk"
                      className="w-full bg-[#181829] border border-[#2d2a45] rounded-xl px-3 py-2 text-xs text-slate-300 select-all"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] text-slate-400 mb-1">Parent Access Password</label>
                    <div className="relative">
                      <input
                        type={showParentPass ? 'text' : 'password'}
                        value={parentPass}
                        onChange={(e) => setParentPass(e.target.value)}
                        placeholder="Set Parent Password"
                        className="w-full bg-[#181829] border border-[#2d2a45] rounded-xl px-3 pr-10 py-2 text-xs text-white focus:outline-none focus:border-blue-500"
                      />
                      <button
                        type="button"
                        onClick={() => setShowParentPass(!showParentPass)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white cursor-pointer"
                      >
                        {showParentPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>
                  <div className="pt-2 flex items-center gap-2">
                    <Button
                      type="button"
                      variant="primary"
                      size="sm"
                      onClick={() => handleSavePassword('parent', parentPass)}
                      className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white"
                    >
                      Save Password
                    </Button>
                    <button
                      type="button"
                      onClick={() => copyCredentials('Parent', 'parent@girlsacademy.edu.pk', parentPass)}
                      className="p-2 rounded-xl bg-[#1e1c33] hover:bg-[#282645] border border-[#373359] text-blue-300 hover:text-white transition-colors cursor-pointer"
                      title="Copy credentials to send privately to parent"
                    >
                      <Copy className="w-4 h-4" />
                    </button>
                  </div>
                </div>

              </div>
            </Card>
          </div>
        )}
      </div>
    </PortalLayout>
  );
};
