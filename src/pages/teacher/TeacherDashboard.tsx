import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  BookOpen, 
  Users, 
  CalendarCheck, 
  Award, 
  Video, 
  FileText, 
  Sparkles, 
  ArrowRight,
  Clock,
  CheckCircle2,
  AlertCircle,
  Pencil,
  X
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { PortalLayout } from '../../components/layout/PortalLayout';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';

export const TeacherDashboard: React.FC = () => {
  const { profile, updateProfile } = useAuth();
  const teacherName = profile?.full_name || 'Mrs. Sana Malik';

  // Faculty Name Change State
  const [showNameModal, setShowNameModal] = useState(false);
  const [editNameInput, setEditNameInput] = useState(teacherName);
  const [isSavingName, setIsSavingName] = useState(false);
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  useEffect(() => {
    setEditNameInput(profile?.full_name || 'Mrs. Sana Malik');
  }, [profile]);

  const handleSaveName = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editNameInput.trim()) return;
    setIsSavingName(true);
    try {
      await updateProfile({ full_name: editNameInput.trim() });
      setShowNameModal(false);
      setToastMsg(`Faculty member name updated to "${editNameInput.trim()}" successfully!`);
      setTimeout(() => setToastMsg(null), 3500);
    } catch (err: any) {
      alert('Failed to update faculty name: ' + err.message);
    } finally {
      setIsSavingName(false);
    }
  };

  const assignedClasses = [
    { id: 'cls-1', name: 'Grade 10 (Matric Science) — Physics & Mechanics', section: 'Sec Rose (38 Students)', nextClass: 'Today, 09:00 AM' },
    { id: 'cls-2', name: 'Grade 11 (FSc Pre-Engineering) — Applied Physics', section: 'Sec Tulip (32 Students)', nextClass: 'Today, 11:30 AM' },
    { id: 'cls-3', name: 'ICS Computer Studies — Programming & Web Systems', section: 'Sec Lotus (30 Students)', nextClass: 'Tomorrow, 08:30 AM' },
  ];

  return (
    <PortalLayout
      pageTitle="Faculty Desk"
      pageSubtitle="Curriculum management, daily attendance logging, and student gradebook"
    >
      <div className="space-y-6">

        {/* Toast Alert */}
        {toastMsg && (
          <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 flex items-center gap-2 text-xs font-semibold animate-fade-in">
            <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-400" />
            <span>{toastMsg}</span>
          </div>
        )}
        
        {/* Welcome Card */}
        <Card className="relative overflow-hidden p-6 sm:p-8 bg-gradient-to-r from-[#21163b] via-[#171427] to-[#1c1228] border border-[#3e2560]">
          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/30 text-[11px] font-semibold mb-2">
                <Sparkles className="w-3.5 h-3.5 text-pink-400" />
                <span>Senior Faculty • Department of Science & Computing</span>
              </div>
              <div className="flex items-center gap-2.5">
                <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
                  Welcome, <span className="text-gradient">{profile?.full_name || teacherName}</span>
                </h2>
                <button
                  type="button"
                  onClick={() => {
                    setEditNameInput(profile?.full_name || teacherName);
                    setShowNameModal(true);
                  }}
                  className="p-1.5 rounded-xl border border-purple-500/30 text-purple-300 hover:bg-purple-500/10 transition-colors cursor-pointer"
                  title="Change your teacher display name"
                >
                  <Pencil className="w-4 h-4" />
                </button>
              </div>
              <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-xl">
                Daily classroom roll-call and board examination term evaluation marks can be updated directly from your faculty desk.
              </p>
            </div>
            
            <div className="flex flex-wrap items-center gap-3 shrink-0">
              <Button 
                variant="outline" 
                size="sm" 
                leftIcon={<Pencil className="w-3.5 h-3.5 text-purple-400" />}
                onClick={() => {
                  setEditNameInput(profile?.full_name || teacherName);
                  setShowNameModal(true);
                }}
              >
                Change Faculty Name
              </Button>
              <Link to="/teacher/attendance">
                <Button variant="primary" size="sm" rightIcon={<ArrowRight className="w-3.5 h-3.5" />}>
                  Mark Today's Attendance
                </Button>
              </Link>
            </div>
          </div>
        </Card>

        {/* 3 Stat Cards: Assigned Classes, Total Students, Pending Results */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
          <Card glassmorphism className="p-6 bg-[#181827] border-[#2a2a3e]">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Assigned Classes</span>
              <div className="p-2 rounded-xl bg-purple-500/10 text-purple-400 border border-purple-500/20">
                <BookOpen className="w-5 h-5" />
              </div>
            </div>
            <div className="text-3xl font-extrabold text-white">3 Sections</div>
            <div className="text-xs text-slate-400 mt-1">Science & Intermediate Wing</div>
          </Card>

          <Card glassmorphism className="p-6 bg-[#181827] border-[#2a2a3e]">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Enrolled Scholars</span>
              <div className="p-2 rounded-xl bg-pink-500/10 text-pink-400 border border-pink-500/20">
                <Users className="w-5 h-5" />
              </div>
            </div>
            <div className="text-3xl font-extrabold text-white">100 Scholars</div>
            <div className="text-xs text-purple-300 mt-1">Active board curriculum batches</div>
          </Card>

          <Card glassmorphism className="p-6 bg-[#181827] border-[#2a2a3e]">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Term Marks Entry</span>
              <div className="p-2 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20">
                <Award className="w-5 h-5" />
              </div>
            </div>
            <div className="text-3xl font-extrabold text-white">First Term</div>
            <div className="text-xs text-amber-300 mt-1">Board-pattern tests published</div>
          </Card>
        </div>

        {/* Quick Links: Mark Attendance, Enter Results, Upload Video */}
        <div>
          <h3 className="text-sm font-semibold text-white uppercase tracking-wider mb-3">
            Instruction Actions
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Link to="/teacher/attendance" className="p-5 rounded-2xl bg-[#181827] border border-[#2a2a3e] hover:border-purple-500/40 hover:bg-purple-600/10 transition-all flex items-center gap-4 group">
              <div className="p-3 rounded-xl bg-purple-500/10 text-purple-400 group-hover:scale-105 transition-transform">
                <CalendarCheck className="w-6 h-6" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-white">Mark Attendance</h4>
                <p className="text-xs text-slate-400 mt-0.5">One-click daily present/absent logs</p>
              </div>
            </Link>

            <Link to="/teacher/results" className="p-5 rounded-2xl bg-[#181827] border border-[#2a2a3e] hover:border-pink-500/40 hover:bg-pink-600/10 transition-all flex items-center gap-4 group">
              <div className="p-3 rounded-xl bg-pink-500/10 text-pink-400 group-hover:scale-105 transition-transform">
                <Award className="w-6 h-6" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-white">Enter Exam Results</h4>
                <p className="text-xs text-slate-400 mt-0.5">Submit student marks & letter grades</p>
              </div>
            </Link>

            <Link to="/teacher/videos" className="p-5 rounded-2xl bg-[#181827] border border-[#2a2a3e] hover:border-cyan-500/40 hover:bg-cyan-600/10 transition-all flex items-center gap-4 group">
              <div className="p-3 rounded-xl bg-cyan-500/10 text-cyan-400 group-hover:scale-105 transition-transform">
                <Video className="w-6 h-6" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-white">Upload Video Lecture</h4>
                <p className="text-xs text-slate-400 mt-0.5">Publish lecture streams & slide links</p>
              </div>
            </Link>
          </div>
        </div>

        {/* Assigned Classes Preview Table & Recent Activity */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-8 space-y-3">
            <h3 className="text-sm font-semibold text-white">Assigned Classes</h3>
            <div className="space-y-3">
              {assignedClasses.map((cls) => (
                <Card key={cls.id} className="p-4 bg-[#181827] border-[#2a2a3e] flex items-center justify-between gap-4">
                  <div>
                    <h4 className="text-sm font-bold text-white">{cls.name}</h4>
                    <p className="text-xs text-slate-400 mt-0.5">{cls.section}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-xs text-purple-300 font-medium hidden sm:inline">{cls.nextClass}</span>
                    <Link to="/teacher/attendance">
                      <Button variant="outline" size="sm">Roll Call</Button>
                    </Link>
                  </div>
                </Card>
              ))}
            </div>
          </div>

          <div className="lg:col-span-4 space-y-3">
            <h3 className="text-sm font-semibold text-white">Recent Activity</h3>
            <Card className="p-5 bg-[#181827] border-[#2a2a3e] text-center py-8">
              <CheckCircle2 className="w-8 h-8 text-emerald-400 mx-auto mb-2" />
              <h4 className="text-xs font-bold text-white">Attendance Synchronized</h4>
              <p className="text-[11px] text-slate-400 mt-1">
                Session roll-calls and grades are synchronized with live database persistence.
              </p>
            </Card>
          </div>
        </div>

        {/* Modal: Edit Faculty Name */}
        {showNameModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
            <div className="w-full max-w-md bg-[#181829] border border-purple-500/30 rounded-2xl shadow-2xl p-5 space-y-4">
              <div className="flex items-center justify-between border-b border-[#2a2a3e] pb-3">
                <div className="flex items-center gap-2">
                  <Pencil className="w-4 h-4 text-purple-400" />
                  <h3 className="text-base font-bold text-white">Update Faculty Display Name</h3>
                </div>
                <button 
                  onClick={() => setShowNameModal(false)} 
                  className="text-slate-400 hover:text-white"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleSaveName} className="space-y-4 text-xs">
                <div>
                  <label className="block text-[11px] font-semibold text-slate-300 mb-1">Faculty Full Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Mrs. Sana Malik"
                    value={editNameInput}
                    onChange={(e) => setEditNameInput(e.target.value)}
                    className="w-full bg-[#11111d] border border-[#2a2a3e] rounded-xl px-3 py-2.5 text-sm text-white focus:outline-none focus:border-purple-500"
                  />
                  <p className="text-[10px] text-slate-400 mt-1.5">
                    This updates your instructor credentials, lecture uploads, and attendance signatures across the institution.
                  </p>
                </div>

                <div className="pt-2 flex justify-end gap-2 border-t border-[#2a2a3e]">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    type="button" 
                    onClick={() => setShowNameModal(false)}
                  >
                    Cancel
                  </Button>
                  <Button 
                    variant="primary" 
                    size="sm" 
                    type="submit"
                    isLoading={isSavingName}
                    className="bg-purple-600 hover:bg-purple-500 text-white"
                  >
                    Save Changes
                  </Button>
                </div>
              </form>
            </div>
          </div>
        )}

      </div>
    </PortalLayout>
  );
};
