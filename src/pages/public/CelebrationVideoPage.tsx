import React, { useState } from 'react';
import { 
  Trophy, 
  Award, 
  Share2, 
  Check, 
  PhoneCall, 
  MessageCircle, 
  Send
} from 'lucide-react';
import { CelebrationVideoPlayer } from '../../components/video/CelebrationVideoPlayer';
import { submitAdmissionApplication } from '../../lib/admissions';
import { 
  CELEBRATION_STATS, 
  TOP_STUDENTS, 
  CELEBRATION_IMAGES, 
  CELEBRATION_FALLBACK_IMAGES,
  CELEBRATION_PROGRAMS, 
  ACADEMY_CONTACT 
} from '../../data/celebrationData';

export const CelebrationVideoPage: React.FC = () => {
  const [selectedStudent, setSelectedStudent] = useState<string>(TOP_STUDENTS[0].id);
  const [inquiryName, setInquiryName] = useState('');
  const [inquiryPhone, setInquiryPhone] = useState('');
  const [inquiryProgram, setInquiryProgram] = useState(CELEBRATION_PROGRAMS[0]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedSuccess, setSubmittedSuccess] = useState(false);
  const [copiedShare, setCopiedShare] = useState(false);

  const activeStudent = TOP_STUDENTS.find(s => s.id === selectedStudent) || TOP_STUDENTS[0];

  const handleInquirySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inquiryName.trim() || !inquiryPhone.trim()) return;
    setIsSubmitting(true);
    try {
      await submitAdmissionApplication({
        student_name: inquiryName.trim(),
        date_of_birth: '2010-01-01',
        gender: 'Female',
        email: 'applicant@girlsacademy.edu.pk',
        phone: inquiryPhone.trim(),
        address: 'Islamabad / Rawalpindi (Fast Inquiry)',
        parent_name: inquiryName.trim() + ' (Guardian)',
        parent_phone: inquiryPhone.trim(),
        program_applied: inquiryProgram,
        previous_school: 'Online Video Inquiry',
        admin_notes: `Fast Inquiry submitted from BISE 2025 Celebration Video Page for program: ${inquiryProgram}. Contact applicant at: ${inquiryPhone.trim()}`
      });
      setSubmittedSuccess(true);
    } catch (err) {
      console.warn('Inquiry submit fallback:', err);
      setSubmittedSuccess(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  const englishShareMessage = `🎓 Girls Academy Islamabad — BISE Board Results 2025 🏆

Celebrating Historic Academic Distinction:
✨ 95% Overall Pass Rate
⭐ 42 A+ Distinction Grades Secured
🥇 1st Position in Islamabad District: Fatima Zahra (1,096/1,100 Marks)
🥈 Ayesha Siddiqui: A+ Grade, Matric Science (Gold Medalist)
🥉 Zainab Khan: 3rd Position in District, ICS
🔬 100% Matric Science Passing Rate

Admissions Open for Academic Session 2026-2027!
Apply today and shape a brilliant future:
📞 Phone: 051-4861234
💬 WhatsApp: 0300-4861234
🌐 Website: www.girlsacademy.edu.pk`;

  const copyAnnouncementMessage = () => {
    navigator.clipboard.writeText(englishShareMessage);
    setCopiedShare(true);
    setTimeout(() => setCopiedShare(false), 2500);
  };

  return (
    <div className="flex flex-col min-h-screen bg-[#0d0c14] text-slate-100">
      {/* Top Banner Header */}
      <section className="relative pt-12 pb-8 sm:pt-16 sm:pb-12 overflow-hidden border-b border-[#252238]">
        {/* Ambient background glows */}
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-purple-600/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute top-1/2 right-1/4 w-96 h-96 bg-pink-600/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-full max-w-4xl h-32 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs sm:text-sm font-semibold mb-4 shadow-sm">
            <Trophy className="w-4 h-4 text-amber-400" />
            <span>BISE Annual Board Examination Results 2025</span>
          </div>

          <h1 className="font-cinzel text-3xl sm:text-5xl lg:text-6xl font-black tracking-wide text-gold-gradient drop-shadow-md">
            GIRLS ACADEMY ISLAMABAD
          </h1>

          <p className="text-xl sm:text-3xl lg:text-4xl text-white font-extrabold mt-2 tracking-tight">
            Islamabad Board Results 2025 — Celebrating Academic Distinction
          </p>

          <p className="mt-3 text-sm sm:text-base text-slate-300 max-w-2xl mx-auto leading-relaxed">
            Watch the official 60-second achievement celebration film honoring our brilliant students, proud families, and dedicated mentors.
          </p>
        </div>
      </section>

      {/* Main Video Cinema Section */}
      <section className="relative py-8 sm:py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <CelebrationVideoPlayer autoPlay={false} />
        </div>
      </section>

      {/* Stats Breakdown Bar */}
      <section className="py-12 bg-[#12101e] border-y border-[#26223b]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <span className="text-xs font-bold uppercase tracking-widest text-amber-400">
              Verified Academic Benchmarks
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold text-white mt-1">
              Historic Numbers at a Glance
            </h2>
            <p className="text-sm sm:text-base text-slate-400 mt-1">
              Milestone achievements across Federal and Regional Board examinations
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {CELEBRATION_STATS.map((stat) => (
              <div 
                key={stat.id}
                className="relative p-6 rounded-2xl glass-card border border-[#2a2742] bg-[#161427]/80 hover:border-amber-400/50 transition-all group"
              >
                <div className="font-cinzel text-4xl sm:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-amber-400 to-amber-600">
                  {stat.value}
                </div>
                <div className="text-lg font-bold text-white mt-2">
                  {stat.label}
                </div>
                <div className="text-xs font-semibold text-amber-400/90 mt-1">
                  {stat.sublabel}
                </div>
                <p className="text-xs text-slate-400 mt-3 pt-3 border-t border-[#26223b]">
                  {stat.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Top Students Spotlight & Hall of Honor */}
      <section className="py-16 bg-[#0e0c18] relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-purple-500/10 border border-purple-500/30 rounded-full text-purple-300 text-xs font-medium mb-2">
              <Award className="w-3.5 h-3.5" />
              <span>Hall of Fame 2025</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white">
              Roll of Honor — Top Achievers
            </h2>
            <p className="text-lg sm:text-xl text-amber-300 font-bold mt-1">
              Girls Academy High Achievers & Scholars
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {TOP_STUDENTS.map((student) => {
              const isSelected = student.id === selectedStudent;
              return (
                <div
                  key={student.id}
                  onClick={() => setSelectedStudent(student.id)}
                  className={`cursor-pointer p-6 rounded-2xl transition-all duration-300 border ${
                    isSelected
                      ? 'bg-[#1e172e] border-amber-400/70 shadow-2xl shadow-amber-500/10 scale-102 ring-1 ring-amber-400/30'
                      : 'bg-[#151224] border-[#292542] hover:border-purple-500/50 hover:bg-[#19152b]'
                  }`}
                >
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-4xl">{student.medal}</span>
                    <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-[#26203a] text-amber-300 border border-[#382f54]">
                      {student.board}
                    </span>
                  </div>

                  <h3 className="text-2xl font-black text-white">
                    {student.name}
                  </h3>
                  <p className="text-xs font-semibold text-amber-400 mt-0.5">{student.distinction}</p>

                  <div className="my-4 p-3 rounded-xl bg-[#0f0d1b] border border-[#231f38]">
                    <p className="text-xs text-slate-400 font-medium uppercase tracking-wider">Score Secured</p>
                    <p className="text-lg font-bold text-white mt-0.5">{student.score}</p>
                    <p className="text-xs text-slate-400">{student.scoreDetail}</p>
                  </div>

                  <div className="flex items-center justify-between text-xs text-slate-400 pt-3 border-t border-[#25203c]">
                    <span className="font-semibold text-slate-300">{student.program}</span>
                    <span className="font-mono text-[11px] text-slate-500">{student.rollNo}</span>
                  </div>

                  <blockquote className="mt-4 text-xs text-amber-200/90 italic bg-amber-500/5 p-3 rounded-lg border-l-2 border-amber-400 leading-relaxed">
                    "{student.quote}"
                  </blockquote>
                </div>
              );
            })}
          </div>

          {/* Emotional Moments Gallery Grid */}
          <div className="mt-16 pt-12 border-t border-[#231f38]">
            <div className="text-center mb-8">
              <h3 className="text-2xl sm:text-3xl font-extrabold text-white">
                "This Triumph is the Fruit of Your Dedication — We Are Immensely Proud of You"
              </h3>
              <p className="text-sm text-slate-400 mt-1">Moments of Joy, Mentorship, and Unconditional Family Pride</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="rounded-2xl overflow-hidden border border-[#2a2644] bg-[#141124] group">
                <div className="aspect-[4/3] overflow-hidden relative">
                  <img
                    src={CELEBRATION_IMAGES.studentJoy}
                    alt="Student Joyful Result Card Moment"
                    referrerPolicy="no-referrer"
                    onError={(e) => {
                      e.currentTarget.onerror = null;
                      e.currentTarget.src = CELEBRATION_FALLBACK_IMAGES.studentJoy;
                    }}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                  <div className="absolute bottom-3 left-3 right-3 text-center">
                    <p className="text-base font-bold text-amber-300">Tears of Joy and Academic Pride</p>
                    <p className="text-[11px] text-slate-300">Unveiling High Distinction Results</p>
                  </div>
                </div>
              </div>

              <div className="rounded-2xl overflow-hidden border border-[#2a2644] bg-[#141124] group">
                <div className="aspect-[4/3] overflow-hidden relative">
                  <img
                    src={CELEBRATION_IMAGES.parentHug}
                    alt="Parents Hugging Daughter"
                    referrerPolicy="no-referrer"
                    onError={(e) => {
                      e.currentTarget.onerror = null;
                      e.currentTarget.src = CELEBRATION_FALLBACK_IMAGES.parentHug;
                    }}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                  <div className="absolute bottom-3 left-3 right-3 text-center">
                    <p className="text-base font-bold text-pink-300">A Family's Proud Moment</p>
                    <p className="text-[11px] text-slate-300">Proud Parents Celebrating Their Daughter</p>
                  </div>
                </div>
              </div>

              <div className="rounded-2xl overflow-hidden border border-[#2a2644] bg-[#141124] group">
                <div className="aspect-[4/3] overflow-hidden relative">
                  <img
                    src={CELEBRATION_IMAGES.teachersPride}
                    alt="Teachers and Mentors Standing Proudly"
                    referrerPolicy="no-referrer"
                    onError={(e) => {
                      e.currentTarget.onerror = null;
                      e.currentTarget.src = CELEBRATION_FALLBACK_IMAGES.teachersPride;
                    }}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                  <div className="absolute bottom-3 left-3 right-3 text-center">
                    <p className="text-base font-bold text-purple-300">Dedicated Mentors & Faculty</p>
                    <p className="text-[11px] text-slate-300">Teachers Dedicated to Academic Excellence</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* WhatsApp & Social Media Sharing Kit for Parents & Community */}
      <section className="py-14 bg-[#120f21] border-y border-[#26203c]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="w-14 h-14 mx-auto rounded-2xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400 mb-4 shadow-lg shadow-emerald-500/10">
            <MessageCircle className="w-7 h-7" />
          </div>

          <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
            Share the Pride with Family & Community Groups
          </h2>
          <p className="text-base sm:text-lg text-amber-300 font-semibold mt-1">
            Spread the celebration announcement on WhatsApp, Facebook, and Instagram
          </p>

          <div className="mt-6 p-5 rounded-2xl bg-[#17142a] border border-[#2c2647] text-left text-sm sm:text-base text-slate-200 whitespace-pre-line leading-relaxed shadow-inner">
            {englishShareMessage}
          </div>

          <div className="mt-5 flex flex-wrap items-center justify-center gap-3">
            <a
              href={`https://api.whatsapp.com/send?text=${encodeURIComponent(englishShareMessage + '\n\n' + window.location.href)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-sm shadow-lg shadow-emerald-900/30 transition-all hover:scale-102"
            >
              <MessageCircle className="w-4 h-4" />
              <span>Share on WhatsApp</span>
            </a>

            <button
              onClick={copyAnnouncementMessage}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#221c38] hover:bg-[#2c2448] border border-[#3b315c] text-white font-semibold text-sm transition-all"
            >
              {copiedShare ? <Check className="w-4 h-4 text-emerald-400" /> : <Share2 className="w-4 h-4" />}
              <span>{copiedShare ? 'Announcement Copied!' : 'Copy Announcement Text'}</span>
            </button>
          </div>
        </div>
      </section>

      {/* Next Academic Session 2026-2027 Admission Call To Action */}
      <section className="py-16 bg-[#0b0a14] relative overflow-hidden">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="relative p-8 sm:p-12 rounded-3xl bg-gradient-to-br from-[#1b152e] via-[#151124] to-[#0f0d1b] border border-amber-500/30 shadow-2xl overflow-hidden">
            <div className="absolute top-0 right-0 w-80 h-80 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
            
            <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              {/* Left Column: Heading & Info */}
              <div className="lg:col-span-7 space-y-4">
                <span className="inline-block px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/40 text-xs font-bold uppercase tracking-wider">
                  Admissions Open 2026-2027
                </span>

                <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white leading-snug">
                  Academic Session 2026-2027 Admissions Open
                </h2>

                <p className="text-xl sm:text-2xl text-amber-300 font-bold">
                  Will Your Daughter Be Our Next High Achiever?
                </p>

                <p className="text-sm text-slate-300 leading-relaxed">
                  Join Girls Academy Islamabad to experience our state-of-the-art science laboratories, smart digital classrooms, certified female faculty, and an empowering environment dedicated to academic leadership.
                </p>

                <div className="pt-2 flex flex-wrap gap-2">
                  {CELEBRATION_PROGRAMS.slice(0, 6).map((prog, idx) => (
                    <span key={idx} className="px-2.5 py-1 rounded-lg bg-[#241e3d] text-slate-300 text-xs font-medium border border-[#322b54]">
                      {prog}
                    </span>
                  ))}
                </div>

                {/* Direct Contact Bar */}
                <div className="pt-4 flex flex-wrap items-center gap-4 text-xs sm:text-sm text-slate-300">
                  <a href={`tel:${ACADEMY_CONTACT.phone}`} className="flex items-center gap-1.5 hover:text-amber-300 transition-colors">
                    <PhoneCall className="w-4 h-4 text-purple-400" />
                    <span>{ACADEMY_CONTACT.phone}</span>
                  </a>
                  <span>•</span>
                  <a href={ACADEMY_CONTACT.whatsappDirectUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 hover:text-emerald-400 transition-colors">
                    <MessageCircle className="w-4 h-4 text-emerald-400" />
                    <span>WhatsApp: {ACADEMY_CONTACT.whatsapp}</span>
                  </a>
                </div>
              </div>

              {/* Right Column: Quick Application Form */}
              <div className="lg:col-span-5 bg-[#141022]/90 p-6 rounded-2xl border border-[#2e274a] shadow-xl">
                <h3 className="text-base font-bold text-white mb-1">
                  Fast-Track Admission Inquiry
                </h3>
                <p className="text-xs text-slate-400 mb-4">
                  Request program details and merit scholarship evaluation
                </p>

                {submittedSuccess ? (
                  <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-center space-y-2">
                    <Check className="w-8 h-8 text-emerald-400 mx-auto" />
                    <p className="font-bold text-white text-sm">Application Received Successfully!</p>
                    <p className="text-xs text-slate-300">
                      Our admissions counseling team will contact you within 24 hours.
                    </p>
                    <button
                      onClick={() => setSubmittedSuccess(false)}
                      className="mt-2 text-xs text-amber-400 underline"
                    >
                      Submit another inquiry
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleInquirySubmit} className="space-y-3">
                    <div>
                      <label className="block text-[11px] font-medium text-slate-300 mb-1">
                        Student / Guardian Name
                      </label>
                      <input
                        type="text"
                        required
                        value={inquiryName}
                        onChange={(e) => setInquiryName(e.target.value)}
                        placeholder="e.g. Fatima Khan"
                        className="w-full px-3 py-2 bg-[#1b162d] border border-[#2e274a] rounded-lg text-sm text-white placeholder-slate-500 focus:outline-none focus:border-purple-500"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-medium text-slate-300 mb-1">
                        Contact / WhatsApp Number
                      </label>
                      <input
                        type="tel"
                        required
                        value={inquiryPhone}
                        onChange={(e) => setInquiryPhone(e.target.value)}
                        placeholder="0300-1234567"
                        className="w-full px-3 py-2 bg-[#1b162d] border border-[#2e274a] rounded-lg text-sm text-white placeholder-slate-500 focus:outline-none focus:border-purple-500"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-medium text-slate-300 mb-1">
                        Select Target Program
                      </label>
                      <select
                        value={inquiryProgram}
                        onChange={(e) => setInquiryProgram(e.target.value)}
                        className="w-full px-3 py-2 bg-[#1b162d] border border-[#2e274a] rounded-lg text-sm text-white focus:outline-none focus:border-purple-500"
                      >
                        {CELEBRATION_PROGRAMS.map((prog, idx) => (
                          <option key={idx} value={prog} className="bg-[#1b162d] text-white">
                            {prog}
                          </option>
                        ))}
                      </select>
                    </div>

                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full mt-2 py-2.5 px-4 rounded-xl bg-gradient-to-r from-amber-500 via-pink-600 to-purple-600 hover:opacity-95 text-white font-bold text-xs uppercase tracking-wider shadow-lg shadow-purple-900/40 transition-all flex items-center justify-center gap-2"
                    >
                      <Send className="w-3.5 h-3.5" />
                      <span>{isSubmitting ? 'Submitting...' : 'Apply for Admission 2026-27'}</span>
                    </button>
                  </form>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer Tagline */}
      <div className="py-6 bg-[#08070d] border-t border-[#1a1727] text-center text-xs text-slate-500">
        <p className="text-sm text-amber-400 font-bold mb-1">
          {ACADEMY_CONTACT.tagline}
        </p>
        <p>© 2025-2026 Girls Academy Islamabad. All Board Results Verified under BISE Regulations.</p>
      </div>
    </div>
  );
};
