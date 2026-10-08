import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  GraduationCap, 
  Calendar, 
  User, 
  Mail, 
  Phone, 
  Upload, 
  CheckCircle2, 
  ArrowRight, 
  ArrowLeft, 
  FileText, 
  Trash2, 
  Sparkles, 
  AlertCircle, 
  MapPin, 
  Building, 
  HelpCircle,
  Clock,
  ShieldCheck,
  Search
} from 'lucide-react';
import { Card } from '../../components/ui/Card';
import { Input } from '../../components/ui/Input';
import { Textarea } from '../../components/ui/Textarea';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { defaultCourses } from '../../lib/supabase';
import { fetchCourses } from '../../lib/dataService';
import { useSite } from '../../context/SiteContext';
import { uploadAdmissionFile, submitAdmissionApplication } from '../../lib/admissions';
import { PAKISTAN_PROVINCES, PAKISTAN_CLASSES, PAKISTAN_PROGRAMS, Course } from '../../types';

export const AdmissionsPage: React.FC = () => {
  const { settings } = useSite();
  const [courses, setCourses] = useState<Course[]>(defaultCourses);
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submittedApplicationId, setSubmittedApplicationId] = useState<string>('');

  useEffect(() => {
    let mounted = true;
    async function loadPrograms() {
      try {
        const data = await fetchCourses();
        if (mounted && data && data.length > 0) {
          setCourses(data);
          if (data[0]?.title) {
            setProgramApplied(data[0].title);
          }
        }
      } catch (e) {
        console.warn('Fallback courses for admissions:', e);
      }
    }
    loadPrograms();
    return () => { mounted = false; };
  }, []);

  // Step 1: Student Info
  const [studentName, setStudentName] = useState('');
  const [dateOfBirth, setDateOfBirth] = useState('');
  const [gender] = useState('Female'); // Locked to Female (Girls Academy)
  const [bFormNumber, setBFormNumber] = useState('');
  const [studentPhotoUrl, setStudentPhotoUrl] = useState<string>('');
  const [studentPhotoUploading, setStudentPhotoUploading] = useState(false);
  const [previousSchool, setPreviousSchool] = useState('');
  const [previousClass, setPreviousClass] = useState('Class 8');
  const [previousMarksPct, setPreviousMarksPct] = useState('85');

  // Step 2: Parent / Guardian Info
  const [parentName, setParentName] = useState('');
  const [guardianRelationship, setGuardianRelationship] = useState('Father');
  const [parentPhone, setParentPhone] = useState('');
  const [whatsappNumber, setWhatsappNumber] = useState('');
  const [parentEmail, setParentEmail] = useState('');
  const [parentOccupation, setParentOccupation] = useState('');
  const [cnicNumber, setCnicNumber] = useState('');

  // Step 3: Program & Address
  const [programApplied, setProgramApplied] = useState<string>(PAKISTAN_PROGRAMS[2]); // Matric Science
  const [classGradeApplying, setClassGradeApplying] = useState<string>('Class 9 (Science)');
  const [residentialAddress, setResidentialAddress] = useState('');
  const [city, setCity] = useState('Islamabad');
  const [province, setProvince] = useState<string>('Islamabad Capital Territory');

  // Step 4: Documents Upload
  interface UploadedDoc {
    name: string;
    type: 'certificate' | 'birth_certificate' | 'parent_cnic' | 'photo';
    url: string;
    progress: number;
  }
  const [uploadedDocs, setUploadedDocs] = useState<UploadedDoc[]>([]);
  const [isUploadingDoc, setIsUploadingDoc] = useState(false);

  // Step 5: Review confirmation
  const [isConfirmed, setIsConfirmed] = useState(false);

  // Inline Validation Errors per step
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Pakistani CNIC auto-formatter (00000-0000000-0)
  const formatIdentity = (val: string) => {
    let raw = val.replace(/\D/g, '').slice(0, 13);
    let formatted = raw;
    if (raw.length > 5 && raw.length <= 12) {
      formatted = `${raw.slice(0, 5)}-${raw.slice(5)}`;
    } else if (raw.length > 12) {
      formatted = `${raw.slice(0, 5)}-${raw.slice(5, 12)}-${raw.slice(12, 13)}`;
    }
    return formatted;
  };

  const handleCnicChange = (val: string) => {
    setCnicNumber(formatIdentity(val));
  };

  const handleBFormChange = (val: string) => {
    setBFormNumber(formatIdentity(val));
  };

  // Pakistani Phone auto-formatter (03XX-XXXXXXX)
  const handlePhoneChange = (val: string, setter: (v: string) => void) => {
    let raw = val.replace(/\D/g, '').slice(0, 11);
    if (raw.length > 4) {
      setter(`${raw.slice(0, 4)}-${raw.slice(4)}`);
    } else {
      setter(raw);
    }
  };

  // Step 1 Photo Upload
  const handlePhotoSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setErrors(prev => ({ ...prev, photo: 'Photo must be an image file (PNG, JPG, WebP)' }));
      return;
    }
    if (file.size > 2 * 1024 * 1024) {
      setErrors(prev => ({ ...prev, photo: 'Profile photo size must be less than 2MB' }));
      return;
    }

    setErrors(prev => ({ ...prev, photo: '' }));
    setStudentPhotoUploading(true);
    try {
      const url = await uploadAdmissionFile(file, 'photos');
      setStudentPhotoUrl(url);
    } catch {
      setErrors(prev => ({ ...prev, photo: 'Failed to upload photo' }));
    } finally {
      setStudentPhotoUploading(false);
    }
  };

  // Step 4 Document Upload
  const handleDocUpload = async (e: React.ChangeEvent<HTMLInputElement>, type: UploadedDoc['type']) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const file = files[0];
    if (file.size > 5 * 1024 * 1024) {
      setErrors(prev => ({ ...prev, docs: 'Each document must be under 5MB' }));
      return;
    }

    // Check certificate limit of 3
    if (type === 'certificate') {
      const count = uploadedDocs.filter(d => d.type === 'certificate').length;
      if (count >= 3) {
        setErrors(prev => ({ ...prev, docs: 'Maximum 3 certificates allowed' }));
        return;
      }
    }

    setErrors(prev => ({ ...prev, docs: '' }));
    setIsUploadingDoc(true);

    const tempDoc: UploadedDoc = {
      name: file.name,
      type,
      url: '',
      progress: 20
    };
    setUploadedDocs(prev => [...prev, tempDoc]);

    try {
      const url = await uploadAdmissionFile(file, 'documents', (percent) => {
        setUploadedDocs(prev => prev.map(d => d.name === file.name ? { ...d, progress: percent } : d));
      });

      setUploadedDocs(prev => prev.map(d => d.name === file.name ? { ...d, url, progress: 100 } : d));
    } catch {
      setErrors(prev => ({ ...prev, docs: `Failed to upload ${file.name}` }));
      setUploadedDocs(prev => prev.filter(d => d.name !== file.name));
    } finally {
      setIsUploadingDoc(false);
    }
  };

  const removeDoc = (name: string) => {
    setUploadedDocs(prev => prev.filter(d => d.name !== name));
  };

  // Step Validation logic
  const validateStep = (step: number): boolean => {
    const newErrors: Record<string, string> = {};

    if (step === 1) {
      if (!studentName.trim()) newErrors.studentName = 'Student full name is required';
      if (!dateOfBirth) newErrors.dateOfBirth = 'Date of birth is required';
      if (!previousSchool.trim()) newErrors.previousSchool = 'Previous school name is required';
      if (!previousClass.trim()) newErrors.previousClass = 'Previous grade/class is required';
    }

    if (step === 2) {
      if (!parentName.trim()) newErrors.parentName = 'Parent/Guardian full name is required';
      if (!parentPhone.trim()) newErrors.parentPhone = 'Contact phone number is required';
      if (!parentEmail.trim() || !parentEmail.includes('@')) newErrors.parentEmail = 'Valid email address is required';
      if (cnicNumber && cnicNumber.length < 15) {
        newErrors.cnicNumber = 'CNIC format must be 00000-0000000-0 (13 digits)';
      }
    }

    if (step === 3) {
      if (!programApplied) newErrors.programApplied = 'Please select a program';
      if (!classGradeApplying.trim()) newErrors.classGradeApplying = 'Class applying for is required';
      if (!residentialAddress.trim()) newErrors.residentialAddress = 'Residential address is required';
      if (!city.trim()) newErrors.city = 'City is required';
      if (!province.trim()) newErrors.province = 'Province/State is required';
    }

    if (step === 4) {
      const hasCertificate = uploadedDocs.some(d => d.type === 'certificate');
      if (!hasCertificate) {
        newErrors.docs = 'Please upload at least one academic certificate/marksheet';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(prev => Math.min(prev + 1, 5));
    }
  };

  const handleBack = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
  };

  // Final Step 5 Submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isConfirmed) {
      setErrors({ confirm: 'Please confirm that all information provided is accurate.' });
      return;
    }

    setIsSubmitting(true);
    setErrors({});

    try {
      const docUrls = uploadedDocs.map(d => d.url).filter(Boolean);
      const application = await submitAdmissionApplication({
        student_name: studentName,
        date_of_birth: dateOfBirth,
        gender,
        email: parentEmail, // primary contact email
        phone: parentPhone,
        address: residentialAddress,
        photo_url: studentPhotoUrl || null,
        previous_school: previousSchool,
        previous_class: previousClass,
        previous_grade: previousClass,
        parent_name: parentName,
        guardian_relationship: guardianRelationship,
        parent_relationship: guardianRelationship,
        parent_phone: parentPhone,
        whatsapp_number: whatsappNumber || parentPhone,
        parent_whatsapp: whatsappNumber || parentPhone,
        parent_email: parentEmail,
        parent_occupation: parentOccupation,
        cnic_number: cnicNumber,
        parent_cnic: cnicNumber,
        program_applied: programApplied,
        class_grade_applying: classGradeApplying,
        class_applying_for: classGradeApplying,
        city,
        province,
        documents_url: docUrls,
        admin_notes: `B-Form: ${bFormNumber || 'N/A'}. Online Admission Application submitted.`
      });

      setSubmittedApplicationId(application.id);
      setSubmitSuccess(true);
    } catch (err: any) {
      setErrors({ submit: err.message || 'Error submitting application. Please try again.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const stepLabels = [
    'Student Details',
    'Parent & Guardian',
    'Academic Stream',
    'Document Uploads',
    'Review & Submit'
  ];

  return (
    <div className="py-12 sm:py-16 space-y-12">
      
      {/* 1. Header Banner */}
      <section className="px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto rounded-3xl bg-gradient-to-r from-[#171426] via-[#151522] to-[#201328] border border-[#2a2a3e] p-8 sm:p-12 text-center relative overflow-hidden">
          <div className="relative z-10 max-w-2xl mx-auto space-y-3">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-purple-500/15 text-purple-300 border border-purple-500/30 text-xs uppercase tracking-widest font-semibold">
              <Sparkles className="w-3.5 h-3.5 text-pink-400" />
              <span>Admissions Session {settings.academic_year || '2026-2027'}</span>
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
              <span className="text-emerald-300 font-bold">
                {settings.admissions_open === 'false' || settings.admission_open === 'false' ? 'Admissions Closed' : 'Admissions Open'}
              </span>
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight">
              Online <span className="text-gradient">Admissions Portal</span>
            </h1>

            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              {settings.admission_instructions || 'Online admissions for Session 2026-2027 are now open. Complete the formal 5-step application to apply.'}
            </p>

            {settings.admission_last_date && (
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-lg bg-amber-500/10 border border-amber-500/20 text-xs text-amber-300 font-medium">
                <Clock className="w-3.5 h-3.5 text-amber-400" />
                <span>Last Date for Application: <strong>{settings.admission_last_date}</strong></span>
              </div>
            )}

            <div className="pt-2 flex justify-center">
              <Link to="/admissions/status" className="text-xs text-purple-400 hover:text-purple-300 font-medium flex items-center gap-1.5 transition-colors">
                <Search className="w-3.5 h-3.5" /> Already applied? Check Application Status
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Multi-Step Form Container */}
      <section className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <Card className="p-6 sm:p-10 bg-[#161625] border-[#2a2a3e] shadow-2xl">
          
          {submitSuccess ? (
            /* Success Screen */
            <div className="text-center py-8 space-y-5 animate-fade-in">
              <div className="w-20 h-20 rounded-3xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 mx-auto">
                <CheckCircle2 className="w-10 h-10" />
              </div>
              <div>
                <Badge variant="emerald" size="md">Application ID: {submittedApplicationId}</Badge>
                <h2 className="text-2xl sm:text-3xl font-extrabold text-white mt-3">
                  Application Received Successfully!
                </h2>
                <p className="text-sm font-semibold text-emerald-300 mt-1">
                  Our admissions counseling team will contact you shortly.
                </p>
                <p className="text-xs sm:text-sm text-slate-300 max-w-lg mx-auto mt-2 leading-relaxed">
                  Your online admission application has been registered successfully. Our admissions committee will reach out to you via WhatsApp and email shortly.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-white/[0.02] border border-[#2a2a3e] max-w-md mx-auto text-xs text-slate-300 space-y-2 text-left">
                <div className="flex justify-between">
                  <span className="text-slate-400">Applicant Name:</span>
                  <span className="font-semibold text-white">{studentName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Selected Program:</span>
                  <span className="font-semibold text-purple-300">{programApplied}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Applying Class:</span>
                  <span className="font-semibold text-white">{classGradeApplying}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Attached Documents:</span>
                  <span className="font-semibold text-emerald-400">{uploadedDocs.length} Files Attached</span>
                </div>
              </div>

              <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-3">
                <Link to="/admissions/status">
                  <Button variant="primary" size="md" leftIcon={<Search className="w-4 h-4" />}>
                    Check Admission Status
                  </Button>
                </Link>
                <Link to="/">
                  <Button variant="outline" size="md">
                    Return to Homepage
                  </Button>
                </Link>
              </div>
            </div>
          ) : (
            <div>
              {/* Progress Stepper Header */}
              <div className="mb-8">
                <div className="flex items-center justify-between text-xs font-semibold text-slate-400 mb-2">
                  <span>Step {currentStep} of 5: <strong className="text-white">{stepLabels[currentStep - 1]}</strong></span>
                  <span className="text-purple-400">{Math.round((currentStep / 5) * 100)}% Complete</span>
                </div>
                {/* Progress bar */}
                <div className="w-full h-2 rounded-full bg-[#1e1e2e] overflow-hidden border border-[#2a2a3e]">
                  <div
                    className="h-full bg-gradient-to-r from-purple-500 to-pink-500 transition-all duration-300 rounded-full"
                    style={{ width: `${(currentStep / 5) * 100}%` }}
                  />
                </div>
              </div>

              {/* Step Forms */}
              <form onSubmit={handleSubmit} className="space-y-6">

                {/* ================= STEP 1: Student Personal Info ================= */}
                {currentStep === 1 && (
                  <div className="space-y-5 animate-fade-in">
                    <div>
                      <h3 className="text-lg font-bold text-white">Student Personal Information</h3>
                      <p className="text-xs text-slate-400">Please enter official student name and B-Form identity details.</p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <Input
                        label="Full Name *"
                        required
                        placeholder="e.g. Fatima Zahra"
                        value={studentName}
                        onChange={(e) => setStudentName(e.target.value)}
                        error={errors.studentName}
                        leftIcon={<User className="w-4 h-4" />}
                      />
                      <Input
                        label="Date of Birth (DD/MM/YYYY) *"
                        type="date"
                        required
                        value={dateOfBirth}
                        onChange={(e) => setDateOfBirth(e.target.value)}
                        error={errors.dateOfBirth}
                        leftIcon={<Calendar className="w-4 h-4" />}
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-medium text-slate-300 mb-1.5">Gender *</label>
                        <select
                          value="Female"
                          disabled
                          className="w-full bg-[#141422] border border-[#2a2a3e] rounded-xl px-4 py-2.5 text-sm text-purple-300 cursor-not-allowed font-medium"
                        >
                          <option value="Female">Female Only — Girls Academy</option>
                        </select>
                        <p className="text-[11px] text-purple-400 mt-1">Girls Academy: Exclusively dedicated to female scholars.</p>
                      </div>

                      <Input
                        label="B-Form Number (00000-0000000-0) *"
                        required
                        placeholder="61101-1234567-1"
                        value={bFormNumber}
                        onChange={(e) => handleBFormChange(e.target.value)}
                        helperText="13-digit NADRA B-Form Identity Number"
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <div className="sm:col-span-1">
                        <Input
                          label="Previous School / College *"
                          required
                          placeholder="e.g. Islamabad Model School / APS"
                          value={previousSchool}
                          onChange={(e) => setPreviousSchool(e.target.value)}
                          error={errors.previousSchool}
                          leftIcon={<Building className="w-4 h-4" />}
                        />
                      </div>
                      <div className="sm:col-span-1">
                        <label className="block text-xs font-medium text-slate-300 mb-1.5">Previous Grade / Class *</label>
                        <select
                          value={previousClass}
                          onChange={(e) => setPreviousClass(e.target.value)}
                          className="w-full bg-[#141422] border border-[#2a2a3e] rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:ring-2 focus:ring-purple-500/50"
                        >
                          {PAKISTAN_CLASSES.map(cls => (
                            <option key={cls} value={cls}>{cls}</option>
                          ))}
                        </select>
                      </div>
                      <div className="sm:col-span-1">
                        <Input
                          label="Previous Marks (%) *"
                          type="number"
                          min="0"
                          max="100"
                          required
                          placeholder="85"
                          value={previousMarksPct}
                          onChange={(e) => setPreviousMarksPct(e.target.value)}
                          helperText="Percentage of marks secured in previous examination"
                        />
                      </div>
                    </div>

                    {/* Photo Upload */}
                    <div>
                      <label className="block text-xs font-medium text-slate-300 mb-1.5">
                        Passport Size Photo (Blue/White Background)
                      </label>
                      <div className="flex items-center gap-3">
                        {studentPhotoUrl ? (
                          <div className="relative">
                            <img
                              src={studentPhotoUrl}
                              alt="Student Preview"
                              className="w-14 h-14 rounded-xl object-cover border border-purple-500/40"
                            />
                            <button
                              type="button"
                              onClick={() => setStudentPhotoUrl('')}
                              className="absolute -top-1.5 -right-1.5 w-4 h-4 rounded-full bg-rose-500 text-white flex items-center justify-center text-[10px]"
                            >
                              ✕
                            </button>
                          </div>
                        ) : (
                          <label className="flex-1 flex items-center justify-center gap-2 p-3 rounded-xl border border-dashed border-[#2a2a3e] hover:border-purple-500/50 bg-[#141422] cursor-pointer text-xs text-slate-300 transition-colors">
                            <Upload className="w-4 h-4 text-purple-400" />
                            <span>{studentPhotoUploading ? 'Uploading...' : 'Upload Passport Photo (Max 2MB)'}</span>
                            <input
                              type="file"
                              accept="image/*"
                              className="hidden"
                              onChange={handlePhotoSelect}
                              disabled={studentPhotoUploading}
                            />
                          </label>
                        )}
                      </div>
                      {errors.photo && <p className="text-xs text-rose-400 mt-1">{errors.photo}</p>}
                    </div>
                  </div>
                )}

                {/* ================= STEP 2: Parent / Guardian Info ================= */}
                {currentStep === 2 && (
                  <div className="space-y-5 animate-fade-in">
                    <div>
                      <h3 className="text-lg font-bold text-white">Parent / Guardian Information</h3>
                      <p className="text-xs text-slate-400">Provide contact numbers, WhatsApp line, and CNIC details.</p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <Input
                        label="Father / Guardian Name *"
                        required
                        placeholder="e.g. Mohammad Akram"
                        value={parentName}
                        onChange={(e) => setParentName(e.target.value)}
                        error={errors.parentName}
                        leftIcon={<User className="w-4 h-4" />}
                      />
                      <div>
                        <label className="block text-xs font-medium text-slate-300 mb-1.5">Relationship *</label>
                        <select
                          value={guardianRelationship}
                          onChange={(e) => setGuardianRelationship(e.target.value)}
                          className="w-full bg-[#141422] border border-[#2a2a3e] rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:ring-2 focus:ring-purple-500/50"
                        >
                          <option value="Father">Father</option>
                          <option value="Mother">Mother</option>
                          <option value="Guardian">Guardian</option>
                        </select>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <Input
                        label="Mobile Contact Number (03XX-XXXXXXX) *"
                        type="tel"
                        required
                        placeholder="0300-1234567"
                        value={parentPhone}
                        onChange={(e) => handlePhoneChange(e.target.value, setParentPhone)}
                        error={errors.parentPhone}
                        leftIcon={<Phone className="w-4 h-4" />}
                      />
                      <Input
                        label="WhatsApp Number"
                        type="tel"
                        placeholder="0300-1234567"
                        value={whatsappNumber}
                        onChange={(e) => handlePhoneChange(e.target.value, setWhatsappNumber)}
                        leftIcon={<Phone className="w-4 h-4" />}
                        helperText="For official attendance and notification alerts"
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <Input
                        label="Email Address *"
                        type="email"
                        required
                        placeholder="parent@example.com"
                        value={parentEmail}
                        onChange={(e) => setParentEmail(e.target.value)}
                        error={errors.parentEmail}
                        leftIcon={<Mail className="w-4 h-4" />}
                      />
                      <Input
                        label="Guardian Occupation"
                        placeholder="e.g. Civil Officer, Business, Teacher"
                        value={parentOccupation}
                        onChange={(e) => setParentOccupation(e.target.value)}
                      />
                    </div>

                    <div>
                      <Input
                        label="Guardian CNIC (00000-0000000-0) *"
                        required
                        placeholder="61101-1234567-1"
                        value={cnicNumber}
                        onChange={(e) => handleCnicChange(e.target.value)}
                        error={errors.cnicNumber}
                        helperText="13-digit NADRA CNIC of parent or guardian"
                      />
                    </div>
                  </div>
                )}

                {/* ================= STEP 3: Program Selection & Address ================= */}
                {currentStep === 3 && (
                  <div className="space-y-5 animate-fade-in">
                    <div>
                      <h3 className="text-lg font-bold text-white">Target Program & Residential Address</h3>
                      <p className="text-xs text-slate-400">Specify the academic program and full residential address.</p>
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-slate-300 mb-1.5">
                        Target Academic Program *
                      </label>
                      <select
                        value={programApplied}
                        onChange={(e) => setProgramApplied(e.target.value)}
                        className="w-full bg-[#141422] border border-[#2a2a3e] rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:ring-2 focus:ring-purple-500/50"
                      >
                        {courses && courses.length > 0 ? (
                          courses.map(course => (
                            <option key={course.id} value={course.title}>
                              {course.title}
                            </option>
                          ))
                        ) : (
                          PAKISTAN_PROGRAMS.map(prog => (
                            <option key={prog} value={prog}>
                              {prog}
                            </option>
                          ))
                        )}
                      </select>
                      {errors.programApplied && <p className="text-xs text-rose-400 mt-1">{errors.programApplied}</p>}
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-slate-300 mb-1.5">
                        Grade / Class Applying For *
                      </label>
                      <select
                        value={classGradeApplying}
                        onChange={(e) => setClassGradeApplying(e.target.value)}
                        className="w-full bg-[#141422] border border-[#2a2a3e] rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:ring-2 focus:ring-purple-500/50"
                      >
                        {PAKISTAN_CLASSES.map(cls => (
                          <option key={cls} value={cls}>
                            {cls}
                          </option>
                        ))}
                      </select>
                    </div>

                    <Textarea
                      label="Full Residential Address *"
                      required
                      rows={3}
                      placeholder="House No, Street, Sector / Area, Islamabad"
                      value={residentialAddress}
                      onChange={(e) => setResidentialAddress(e.target.value)}
                      error={errors.residentialAddress}
                    />

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <Input
                        label="City *"
                        required
                        placeholder="e.g. Islamabad / Rawalpindi"
                        value={city}
                        onChange={(e) => setCity(e.target.value)}
                        error={errors.city}
                        leftIcon={<MapPin className="w-4 h-4" />}
                      />
                      <div>
                        <label className="block text-xs font-medium text-slate-300 mb-1.5">Province / Territory *</label>
                        <select
                          value={province}
                          onChange={(e) => setProvince(e.target.value)}
                          className="w-full bg-[#141422] border border-[#2a2a3e] rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:ring-2 focus:ring-purple-500/50"
                        >
                          {PAKISTAN_PROVINCES.map(p => (
                            <option key={p} value={p}>
                              {p}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                  </div>
                )}

                {/* ================= STEP 4: Document Upload ================= */}
                {currentStep === 4 && (
                  <div className="space-y-5 animate-fade-in">
                    <div>
                      <h3 className="text-lg font-bold text-white">Official Documents Upload</h3>
                      <p className="text-xs text-slate-400">
                        Upload previous report card, student B-Form, and guardian CNIC (PDF or Image, Max 5MB)
                      </p>
                    </div>

                    {errors.docs && (
                      <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-xs text-rose-300 flex items-center gap-2">
                        <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
                        <span>{errors.docs}</span>
                      </div>
                    )}

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      {/* Document Type 1: Marksheet */}
                      <label className="p-4 rounded-2xl bg-[#141422] border border-dashed border-[#2a2a3e] hover:border-purple-500/50 cursor-pointer flex flex-col items-center text-center transition-colors">
                        <Upload className="w-6 h-6 text-purple-400 mb-2" />
                        <span className="text-xs font-bold text-white">Previous Grade Mark Sheet / Transcript *</span>
                        <span className="text-[10px] text-slate-400 mt-1">Previous Marksheet (Max 5MB)</span>
                        <input
                          type="file"
                          accept=".pdf,image/*"
                          className="hidden"
                          onChange={(e) => handleDocUpload(e, 'certificate')}
                          disabled={isUploadingDoc}
                        />
                      </label>

                      {/* Document Type 2: B-Form */}
                      <label className="p-4 rounded-2xl bg-[#141422] border border-dashed border-[#2a2a3e] hover:border-pink-500/50 cursor-pointer flex flex-col items-center text-center transition-colors">
                        <FileText className="w-6 h-6 text-pink-400 mb-2" />
                        <span className="text-xs font-bold text-white">Student B-Form / CNIC Document</span>
                        <span className="text-[10px] text-slate-400 mt-1">B-Form / CNIC Copy</span>
                        <input
                          type="file"
                          accept=".pdf,image/*"
                          className="hidden"
                          onChange={(e) => handleDocUpload(e, 'birth_certificate')}
                          disabled={isUploadingDoc}
                        />
                      </label>

                      {/* Document Type 3: Father CNIC */}
                      <label className="p-4 rounded-2xl bg-[#141422] border border-dashed border-[#2a2a3e] hover:border-cyan-500/50 cursor-pointer flex flex-col items-center text-center transition-colors">
                        <ShieldCheck className="w-6 h-6 text-cyan-400 mb-2" />
                        <span className="text-xs font-bold text-white">Father / Guardian CNIC Document</span>
                        <span className="text-[10px] text-slate-400 mt-1">Father's CNIC Copy</span>
                        <input
                          type="file"
                          accept=".pdf,image/*"
                          className="hidden"
                          onChange={(e) => handleDocUpload(e, 'parent_cnic')}
                          disabled={isUploadingDoc}
                        />
                      </label>
                    </div>

                    {/* Uploaded File List */}
                    {uploadedDocs.length > 0 && (
                      <div className="space-y-2 pt-2">
                        <h4 className="text-xs font-semibold uppercase text-slate-400">Attached Documents</h4>
                        {uploadedDocs.map((doc) => (
                          <div
                            key={doc.name}
                            className="p-3 rounded-xl bg-white/[0.02] border border-[#2a2a3e] flex items-center justify-between gap-3 text-xs"
                          >
                            <div className="flex items-center gap-2.5 overflow-hidden">
                              <FileText className="w-4 h-4 text-purple-400 shrink-0" />
                              <span className="text-white truncate max-w-xs">{doc.name}</span>
                              <Badge variant="purple" size="sm">{doc.type.replace('_', ' ')}</Badge>
                            </div>

                            <div className="flex items-center gap-3">
                              {doc.progress < 100 ? (
                                <span className="text-purple-400">{doc.progress}%</span>
                              ) : (
                                <span className="text-emerald-400 flex items-center gap-1">
                                  <CheckCircle2 className="w-3.5 h-3.5" /> Uploaded
                                </span>
                              )}
                              <button
                                type="button"
                                onClick={() => removeDoc(doc.name)}
                                className="p-1 text-slate-500 hover:text-rose-400 transition-colors"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {/* ================= STEP 5: Review & Submit ================= */}
                {currentStep === 5 && (
                  <div className="space-y-6 animate-fade-in">
                    <div>
                      <h3 className="text-lg font-bold text-white">Review Application Dossier</h3>
                      <p className="text-xs text-slate-400">Verify all entries before final cryptographic submission.</p>
                    </div>

                    {errors.submit && (
                      <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-xs text-rose-300 flex items-center gap-2">
                        <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
                        <span>{errors.submit}</span>
                      </div>
                    )}

                    {/* Summary Cards */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                      <div className="p-4 rounded-xl bg-[#141422] border border-[#2a2a3e] space-y-1.5">
                        <span className="text-purple-400 font-semibold block uppercase tracking-wider text-[10px]">Student Information</span>
                        <div><strong>Name:</strong> {studentName}</div>
                        <div><strong>DOB:</strong> {dateOfBirth} ({gender})</div>
                        <div><strong>Previous:</strong> {previousSchool} ({previousClass})</div>
                      </div>

                      <div className="p-4 rounded-xl bg-[#141422] border border-[#2a2a3e] space-y-1.5">
                        <span className="text-pink-400 font-semibold block uppercase tracking-wider text-[10px]">Parent / Guardian</span>
                        <div><strong>Name:</strong> {parentName} ({guardianRelationship})</div>
                        <div><strong>Phone:</strong> {parentPhone}</div>
                        <div><strong>Email:</strong> {parentEmail}</div>
                        {cnicNumber && <div><strong>CNIC:</strong> {cnicNumber}</div>}
                      </div>

                      <div className="p-4 rounded-xl bg-[#141422] border border-[#2a2a3e] space-y-1.5 sm:col-span-2">
                        <span className="text-cyan-400 font-semibold block uppercase tracking-wider text-[10px]">Academic Enrollment & Location</span>
                        <div><strong>Program:</strong> {programApplied}</div>
                        <div><strong>Class Applying For:</strong> {classGradeApplying}</div>
                        <div><strong>Residence:</strong> {residentialAddress}, {city}, {province}</div>
                        <div><strong>Attached Files:</strong> {uploadedDocs.length} documents uploaded to bucket</div>
                      </div>
                    </div>

                    {/* Confirmation Checkbox */}
                    <div className="p-4 rounded-xl bg-purple-950/20 border border-purple-500/20 space-y-2">
                      <label className="flex items-start gap-2.5 cursor-pointer text-xs text-slate-200">
                        <input
                          type="checkbox"
                          checked={isConfirmed}
                          onChange={(e) => setIsConfirmed(e.target.checked)}
                          className="mt-0.5 rounded border-[#2a2a3e] text-purple-600 focus:ring-purple-500"
                        />
                        <span>
                          I confirm that all information provided in this admission dossier is accurate and authentic to the best of my knowledge. I understand that misrepresentation will invalidate enrollment.
                        </span>
                      </label>
                      {errors.confirm && <p className="text-xs text-rose-400 ml-6">{errors.confirm}</p>}
                    </div>
                  </div>
                )}

                {/* Navigation Buttons: Back and Next / Submit */}
                <div className="pt-6 border-t border-[#2a2a3e] flex items-center justify-between">
                  {currentStep > 1 ? (
                    <Button
                      type="button"
                      variant="outline"
                      size="md"
                      onClick={handleBack}
                      leftIcon={<ArrowLeft className="w-4 h-4" />}
                    >
                      Back
                    </Button>
                  ) : <div />}

                  {currentStep < 5 ? (
                    <Button
                      type="button"
                      variant="primary"
                      size="md"
                      onClick={handleNext}
                      rightIcon={<ArrowRight className="w-4 h-4" />}
                    >
                      Continue to Next Step
                    </Button>
                  ) : (
                    <Button
                      type="submit"
                      variant="primary"
                      size="lg"
                      isLoading={isSubmitting}
                      disabled={!isConfirmed}
                      rightIcon={<CheckCircle2 className="w-4 h-4" />}
                    >
                      Submit Official Application
                    </Button>
                  )}
                </div>

              </form>
            </div>
          )}

        </Card>
      </section>

    </div>
  );
};
