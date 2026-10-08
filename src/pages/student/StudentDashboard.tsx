import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  BookOpen, 
  CalendarCheck, 
  Award, 
  ArrowRight, 
  Clock, 
  Sparkles, 
  Bell, 
  Video, 
  CheckCircle2, 
  TrendingUp,
  FileText,
  Pencil,
  Plus,
  Trash2,
  Check,
  Calendar,
  Tag,
  AlertCircle
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { PortalLayout } from '../../components/layout/PortalLayout';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { 
  fetchStudentPersonalNotes, 
  saveStudentPersonalNote, 
  deleteStudentPersonalNote,
  fetchStudentLeaveApplications,
  submitStudentLeaveApplication,
  fetchStudentGoals,
  saveStudentGoal,
  toggleStudentGoal,
  deleteStudentGoal,
  StudentPersonalNote,
  StudentLeaveApplication,
  StudentGoal
} from '../../lib/dataService';

export const StudentDashboard: React.FC = () => {
  const { user, profile, updateProfile } = useAuth();
  const studentId = user?.id || profile?.id || 'demo-student-uid-3';
  const studentName = profile?.full_name || 'Fatima Bibi';

  // Quick Name Change State
  const [showNameModal, setShowNameModal] = useState(false);
  const [editNameInput, setEditNameInput] = useState(studentName);
  const [isSavingName, setIsSavingName] = useState(false);
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  // Personalized Data States
  const [activeTab, setActiveTab] = useState<'notes' | 'leaves' | 'goals'>('notes');
  const [notes, setNotes] = useState<StudentPersonalNote[]>([]);
  const [leaves, setLeaves] = useState<StudentLeaveApplication[]>([]);
  const [goals, setGoals] = useState<StudentGoal[]>([]);

  useEffect(() => {
    setEditNameInput(profile?.full_name || 'Fatima Bibi');
  }, [profile]);

  const handleSaveName = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editNameInput.trim()) return;
    setIsSavingName(true);
    try {
      await updateProfile({ full_name: editNameInput.trim() });
      setShowNameModal(false);
      setToastMsg(`Scholar name updated to "${editNameInput.trim()}" successfully!`);
      setTimeout(() => setToastMsg(null), 3500);
    } catch (err: any) {
      alert('Failed to update name: ' + err.message);
    } finally {
      setIsSavingName(false);
    }
  };

  // Note Form
  const [showNoteModal, setShowNoteModal] = useState(false);
  const [noteTitle, setNoteTitle] = useState('');
  const [noteSubject, setNoteSubject] = useState('Physics');
  const [noteContent, setNoteContent] = useState('');
  const [noteTag, setNoteTag] = useState('Revision');

  // Leave Form
  const [showLeaveModal, setShowLeaveModal] = useState(false);
  const [leaveReason, setLeaveReason] = useState('');
  const [leaveStart, setLeaveStart] = useState('');
  const [leaveEnd, setLeaveEnd] = useState('');

  // Goal Form
  const [showGoalModal, setShowGoalModal] = useState(false);
  const [goalTitle, setGoalTitle] = useState('');
  const [goalGrade, setGoalGrade] = useState('A+');
  const [goalDeadline, setGoalDeadline] = useState('');

  useEffect(() => {
    setNotes(fetchStudentPersonalNotes(studentId));
    setLeaves(fetchStudentLeaveApplications(studentId));
    setGoals(fetchStudentGoals(studentId));
  }, [studentId]);

  const handleAddNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!noteTitle.trim() || !noteContent.trim()) return;
    const created = saveStudentPersonalNote({
      student_id: studentId,
      title: noteTitle.trim(),
      subject: noteSubject,
      content: noteContent.trim(),
      date: new Date().toISOString().split('T')[0],
      tag: noteTag
    });
    setNotes([created, ...notes]);
    setNoteTitle('');
    setNoteContent('');
    setShowNoteModal(false);
  };

  const handleDeleteNote = (noteId: string) => {
    deleteStudentPersonalNote(studentId, noteId);
    setNotes(notes.filter(n => n.id !== noteId));
  };

  const handleAddLeave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!leaveReason.trim() || !leaveStart) return;
    const created = submitStudentLeaveApplication({
      student_id: studentId,
      student_name: studentName,
      reason: leaveReason.trim(),
      start_date: leaveStart,
      end_date: leaveEnd || leaveStart
    });
    setLeaves([created, ...leaves]);
    setLeaveReason('');
    setLeaveStart('');
    setLeaveEnd('');
    setShowLeaveModal(false);
  };

  const handleAddGoal = (e: React.FormEvent) => {
    e.preventDefault();
    if (!goalTitle.trim()) return;
    const created = saveStudentGoal({
      student_id: studentId,
      title: goalTitle.trim(),
      target_grade: goalGrade,
      completed: false,
      deadline: goalDeadline || undefined
    });
    setGoals([created, ...goals]);
    setGoalTitle('');
    setGoalDeadline('');
    setShowGoalModal(false);
  };

  const handleToggleGoal = (id: string) => {
    toggleStudentGoal(studentId, id);
    setGoals(goals.map(g => g.id === id ? { ...g, completed: !g.completed } : g));
  };

  const handleDeleteGoal = (id: string) => {
    deleteStudentGoal(studentId, id);
    setGoals(goals.filter(g => g.id !== id));
  };

  const enrolledCoursesPreview = [
    { code: 'SCI-101', name: 'Matric Science — Physics & Kinematics', instructor: 'Mrs. Sana Malik', progress: '84%' },
    { code: 'CHEM-201', name: 'Chemistry — Chemical Bonding & Periodicity', instructor: 'Dr. Ayesha Tariq', progress: '78%' },
    { code: 'BIO-301', name: 'Biology — Cell Anatomy & Physiology', instructor: 'Dr. Fatima Al-Mansoor', progress: '92%' },
  ];

  return (
    <PortalLayout
      pageTitle="Scholar Dashboard"
      pageSubtitle="Academic progress, enrolled lecture schedules, and personalized study logs"
    >
      <div className="space-y-6">

        {/* Toast Alert */}
        {toastMsg && (
          <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 flex items-center gap-2 text-xs font-semibold animate-fade-in">
            <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-400" />
            <span>{toastMsg}</span>
          </div>
        )}
        
        {/* Welcome Card with Name and Edit Button */}
        <Card className="relative overflow-hidden p-6 sm:p-8 bg-gradient-to-r from-[#1b1531] via-[#161427] to-[#251329] border border-[#3c255e]">
          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/30 text-[11px] font-semibold mb-2">
                <Sparkles className="w-3.5 h-3.5 text-pink-400" />
                <span>Academic Session 2026-2027</span>
              </div>
              <div className="flex items-center gap-2.5">
                <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
                  Welcome back, <span className="text-gradient">{profile?.full_name || studentName}</span>
                </h2>
                <button
                  type="button"
                  onClick={() => {
                    setEditNameInput(profile?.full_name || studentName);
                    setShowNameModal(true);
                  }}
                  className="p-1.5 rounded-xl border border-purple-500/30 text-purple-300 hover:bg-purple-500/10 transition-colors cursor-pointer"
                  title="Change your displayed scholar name"
                >
                  <Pencil className="w-4 h-4" />
                </button>
              </div>
              <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-xl">
                Class 10 (Matric Science) • Roll No: GA-10S-042. Your attendance rate and grade transcript are actively updated.
              </p>
            </div>
            
            <div className="flex flex-wrap items-center gap-3 shrink-0">
              <Button 
                variant="outline" 
                size="sm" 
                leftIcon={<Pencil className="w-3.5 h-3.5 text-purple-400" />}
                onClick={() => {
                  setEditNameInput(profile?.full_name || studentName);
                  setShowNameModal(true);
                }}
              >
                Change My Name
              </Button>
              <Link to="/student/courses">
                <Button variant="primary" size="sm" rightIcon={<ArrowRight className="w-3.5 h-3.5" />}>
                  View Courses
                </Button>
              </Link>
            </div>
          </div>
        </Card>

        {/* 3 Stat Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
          <Card glassmorphism className="p-6 bg-[#181827] border-[#2a2a3e]">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Attendance Rate</span>
              <div className="p-2 rounded-xl bg-purple-500/10 text-purple-400 border border-purple-500/20">
                <CalendarCheck className="w-5 h-5" />
              </div>
            </div>
            <div className="text-3xl font-extrabold text-white">96.8%</div>
            <div className="flex items-center gap-1.5 text-xs text-emerald-400 mt-1 font-medium">
              <TrendingUp className="w-3.5 h-3.5" />
              <span>Perfect regularity recorded</span>
            </div>
          </Card>

          <Card glassmorphism className="p-6 bg-[#181827] border-[#2a2a3e]">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Enrolled Subjects</span>
              <div className="p-2 rounded-xl bg-pink-500/10 text-pink-400 border border-pink-500/20">
                <BookOpen className="w-5 h-5" />
              </div>
            </div>
            <div className="text-3xl font-extrabold text-white">8 Subjects</div>
            <div className="text-xs text-slate-400 mt-1">Matric Board Stream Active</div>
          </Card>

          <Card glassmorphism className="p-6 bg-[#181827] border-[#2a2a3e]">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Term Performance</span>
              <div className="p-2 rounded-xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
                <Award className="w-5 h-5" />
              </div>
            </div>
            <div className="text-3xl font-extrabold text-white">478 / 500</div>
            <div className="text-xs text-purple-300 mt-1 font-medium">Grade A+ (Distinction 95.6%)</div>
          </Card>
        </div>

        {/* Personalized Student Data Center */}
        <Card className="p-6 bg-[#181827] border-[#2a2a3e] space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-[#2a2a3e]">
            <div>
              <span className="text-[10px] font-bold text-pink-400 uppercase tracking-wider">Student Custom Workspace</span>
              <h3 className="text-base sm:text-lg font-bold text-white">My Academic Entries & Self-Service</h3>
            </div>

            <div className="flex items-center gap-1.5 bg-[#12121e] p-1 rounded-xl border border-[#2a2a3e]">
              <button
                type="button"
                onClick={() => setActiveTab('notes')}
                className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
                  activeTab === 'notes' ? 'bg-purple-600 text-white' : 'text-slate-400 hover:text-white'
                }`}
              >
                Study Notes ({notes.length})
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('leaves')}
                className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
                  activeTab === 'leaves' ? 'bg-purple-600 text-white' : 'text-slate-400 hover:text-white'
                }`}
              >
                Leave Requests ({leaves.length})
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('goals')}
                className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
                  activeTab === 'goals' ? 'bg-purple-600 text-white' : 'text-slate-400 hover:text-white'
                }`}
              >
                My Targets ({goals.length})
              </button>
            </div>
          </div>

          {/* TAB 1: STUDY NOTES */}
          {activeTab === 'notes' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <p className="text-xs text-slate-400">
                  Save your subject summaries, formulas, and personal revision pointers.
                </p>
                <Button
                  variant="primary"
                  size="sm"
                  onClick={() => setShowNoteModal(true)}
                  leftIcon={<Plus className="w-3.5 h-3.5" />}
                >
                  Add Study Note
                </Button>
              </div>

              {notes.length === 0 ? (
                <div className="p-8 text-center text-xs text-slate-500 bg-[#12121e] rounded-xl border border-dashed border-[#2a2a3e]">
                  No personal notes added yet. Click &quot;Add Study Note&quot; to create your first note!
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {notes.map((note) => (
                    <div
                      key={note.id}
                      className="p-4 rounded-xl bg-[#141422] border border-[#2a2a3e] hover:border-purple-500/30 transition-all flex flex-col justify-between"
                    >
                      <div>
                        <div className="flex items-center justify-between gap-2 mb-1.5">
                          <span className="px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-300 font-semibold text-[10px]">
                            {note.subject}
                          </span>
                          <span className="text-[10px] text-slate-500">{note.date}</span>
                        </div>
                        <h4 className="text-xs sm:text-sm font-bold text-white mb-1">{note.title}</h4>
                        <p className="text-xs text-slate-300 leading-relaxed whitespace-pre-wrap">{note.content}</p>
                      </div>
                      <div className="pt-3 mt-3 border-t border-[#2a2a3e] flex items-center justify-between">
                        <span className="text-[10px] text-slate-400">Tag: {note.tag || 'Notes'}</span>
                        <button
                          type="button"
                          onClick={() => handleDeleteNote(note.id)}
                          className="p-1 rounded text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 cursor-pointer"
                          title="Delete note"
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

          {/* TAB 2: LEAVE REQUESTS */}
          {activeTab === 'leaves' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <p className="text-xs text-slate-400">
                  Submit official absence requests directly to the faculty administration desk.
                </p>
                <Button
                  variant="primary"
                  size="sm"
                  onClick={() => setShowLeaveModal(true)}
                  leftIcon={<Plus className="w-3.5 h-3.5" />}
                >
                  Apply for Leave
                </Button>
              </div>

              {leaves.length === 0 ? (
                <div className="p-8 text-center text-xs text-slate-500 bg-[#12121e] rounded-xl border border-dashed border-[#2a2a3e]">
                  No leave requests submitted.
                </div>
              ) : (
                <div className="space-y-2.5">
                  {leaves.map((l) => (
                    <div
                      key={l.id}
                      className="p-3.5 rounded-xl bg-[#141422] border border-[#2a2a3e] flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
                    >
                      <div>
                        <div className="font-bold text-white">{l.reason}</div>
                        <div className="text-[11px] text-slate-400 mt-0.5">
                          Duration: <span className="text-purple-300 font-mono">{l.start_date}</span> to <span className="text-purple-300 font-mono">{l.end_date}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className={`px-2.5 py-1 rounded-full text-[10px] font-semibold ${
                          l.status === 'Approved' ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' :
                          l.status === 'Rejected' ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30' :
                          'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                        }`}>
                          {l.status}
                        </span>
                        <span className="text-[10px] text-slate-500">Submitted: {l.submitted_at}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 3: ACADEMIC GOALS */}
          {activeTab === 'goals' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <p className="text-xs text-slate-400">
                  Set academic goals, target percentages, and track your milestone completions.
                </p>
                <Button
                  variant="primary"
                  size="sm"
                  onClick={() => setShowGoalModal(true)}
                  leftIcon={<Plus className="w-3.5 h-3.5" />}
                >
                  Set New Goal
                </Button>
              </div>

              {goals.length === 0 ? (
                <div className="p-8 text-center text-xs text-slate-500 bg-[#12121e] rounded-xl border border-dashed border-[#2a2a3e]">
                  No academic goals set. Click &quot;Set New Goal&quot; to begin!
                </div>
              ) : (
                <div className="space-y-2">
                  {goals.map((g) => (
                    <div
                      key={g.id}
                      className="p-3.5 rounded-xl bg-[#141422] border border-[#2a2a3e] flex items-center justify-between gap-3 text-xs"
                    >
                      <div className="flex items-center gap-3">
                        <button
                          type="button"
                          onClick={() => handleToggleGoal(g.id)}
                          className={`w-5 h-5 rounded-md border flex items-center justify-center transition-colors cursor-pointer ${
                            g.completed
                              ? 'bg-emerald-500 border-emerald-400 text-white'
                              : 'border-slate-500 hover:border-purple-400'
                          }`}
                        >
                          {g.completed && <Check className="w-3.5 h-3.5" />}
                        </button>
                        <div>
                          <div className={`font-semibold text-white ${g.completed ? 'line-through text-slate-400' : ''}`}>
                            {g.title}
                          </div>
                          {g.deadline && (
                            <div className="text-[10px] text-slate-500 mt-0.5">Target Date: {g.deadline}</div>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <Badge variant="purple" size="sm">
                          Target: {g.target_grade}
                        </Badge>
                        <button
                          type="button"
                          onClick={() => handleDeleteGoal(g.id)}
                          className="p-1 rounded text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 cursor-pointer"
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
        </Card>

        {/* Modal: Add Note */}
        {showNoteModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
            <div className="w-full max-w-md bg-[#181829] border border-[#2a2a3e] rounded-2xl shadow-2xl p-5 space-y-4">
              <div className="flex items-center justify-between border-b border-[#2a2a3e] pb-3">
                <h3 className="text-base font-bold text-white">Add Personal Study Note</h3>
                <button onClick={() => setShowNoteModal(false)} className="text-slate-400 hover:text-white">✕</button>
              </div>

              <form onSubmit={handleAddNote} className="space-y-3 text-xs">
                <div>
                  <label className="block text-[11px] font-semibold text-slate-300 mb-1">Subject / Course *</label>
                  <select
                    value={noteSubject}
                    onChange={(e) => setNoteSubject(e.target.value)}
                    className="w-full bg-[#11111d] border border-[#2a2a3e] rounded-xl px-3 py-2 text-white focus:outline-none focus:border-purple-500"
                  >
                    <option value="Physics">Physics</option>
                    <option value="Chemistry">Chemistry</option>
                    <option value="Biology">Biology</option>
                    <option value="Mathematics">Mathematics</option>
                    <option value="English">English</option>
                    <option value="Computer Science">Computer Science</option>
                    <option value="General Studies">General Studies</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-300 mb-1">Note Title *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Chapter 3 Chemical Reactions Summary"
                    value={noteTitle}
                    onChange={(e) => setNoteTitle(e.target.value)}
                    className="w-full bg-[#11111d] border border-[#2a2a3e] rounded-xl px-3 py-2 text-white focus:outline-none focus:border-purple-500"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-300 mb-1">Note Details / Formulas *</label>
                  <textarea
                    required
                    rows={4}
                    placeholder="Enter detailed notes, definitions, or exam reminders..."
                    value={noteContent}
                    onChange={(e) => setNoteContent(e.target.value)}
                    className="w-full bg-[#11111d] border border-[#2a2a3e] rounded-xl p-3 text-white focus:outline-none focus:border-purple-500"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-300 mb-1">Tag / Category</label>
                  <input
                    type="text"
                    placeholder="e.g. Formula Sheet, Key Points, Exam Prep"
                    value={noteTag}
                    onChange={(e) => setNoteTag(e.target.value)}
                    className="w-full bg-[#11111d] border border-[#2a2a3e] rounded-xl px-3 py-2 text-white focus:outline-none focus:border-purple-500"
                  />
                </div>

                <div className="pt-2 flex justify-end gap-2 border-t border-[#2a2a3e]">
                  <Button variant="outline" size="sm" type="button" onClick={() => setShowNoteModal(false)}>
                    Cancel
                  </Button>
                  <Button variant="primary" size="sm" type="submit">
                    Save Note
                  </Button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Modal: Submit Leave */}
        {showLeaveModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
            <div className="w-full max-w-md bg-[#181829] border border-[#2a2a3e] rounded-2xl shadow-2xl p-5 space-y-4">
              <div className="flex items-center justify-between border-b border-[#2a2a3e] pb-3">
                <h3 className="text-base font-bold text-white">Apply for Student Leave</h3>
                <button onClick={() => setShowLeaveModal(false)} className="text-slate-400 hover:text-white">✕</button>
              </div>

              <form onSubmit={handleAddLeave} className="space-y-3 text-xs">
                <div>
                  <label className="block text-[11px] font-semibold text-slate-300 mb-1">Reason for Absence *</label>
                  <textarea
                    required
                    rows={3}
                    placeholder="Describe reason (e.g. medical appointment, urgent family affair)..."
                    value={leaveReason}
                    onChange={(e) => setLeaveReason(e.target.value)}
                    className="w-full bg-[#11111d] border border-[#2a2a3e] rounded-xl p-3 text-white focus:outline-none focus:border-purple-500"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-300 mb-1">From Date *</label>
                    <input
                      type="date"
                      required
                      value={leaveStart}
                      onChange={(e) => setLeaveStart(e.target.value)}
                      className="w-full bg-[#11111d] border border-[#2a2a3e] rounded-xl px-3 py-2 text-white focus:outline-none focus:border-purple-500"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-300 mb-1">To Date</label>
                    <input
                      type="date"
                      value={leaveEnd}
                      onChange={(e) => setLeaveEnd(e.target.value)}
                      className="w-full bg-[#11111d] border border-[#2a2a3e] rounded-xl px-3 py-2 text-white focus:outline-none focus:border-purple-500"
                    />
                  </div>
                </div>

                <div className="pt-2 flex justify-end gap-2 border-t border-[#2a2a3e]">
                  <Button variant="outline" size="sm" type="button" onClick={() => setShowLeaveModal(false)}>
                    Cancel
                  </Button>
                  <Button variant="primary" size="sm" type="submit">
                    Submit Leave Application
                  </Button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Modal: Add Goal */}
        {showGoalModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
            <div className="w-full max-w-md bg-[#181829] border border-[#2a2a3e] rounded-2xl shadow-2xl p-5 space-y-4">
              <div className="flex items-center justify-between border-b border-[#2a2a3e] pb-3">
                <h3 className="text-base font-bold text-white">Set Academic Goal</h3>
                <button onClick={() => setShowGoalModal(false)} className="text-slate-400 hover:text-white">✕</button>
              </div>

              <form onSubmit={handleAddGoal} className="space-y-3 text-xs">
                <div>
                  <label className="block text-[11px] font-semibold text-slate-300 mb-1">Goal Target Title *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Score 98% in BISE Physics Board Exam"
                    value={goalTitle}
                    onChange={(e) => setGoalTitle(e.target.value)}
                    className="w-full bg-[#11111d] border border-[#2a2a3e] rounded-xl px-3 py-2 text-white focus:outline-none focus:border-purple-500"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-300 mb-1">Target Benchmark</label>
                    <select
                      value={goalGrade}
                      onChange={(e) => setGoalGrade(e.target.value)}
                      className="w-full bg-[#11111d] border border-[#2a2a3e] rounded-xl px-3 py-2 text-white focus:outline-none focus:border-purple-500"
                    >
                      <option value="A+ (Distinction)">A+ (Distinction)</option>
                      <option value="A (High Merit)">A (High Merit)</option>
                      <option value="100% Completion">100% Completion</option>
                      <option value="Top Position">Top Position</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-300 mb-1">Target Date</label>
                    <input
                      type="date"
                      value={goalDeadline}
                      onChange={(e) => setGoalDeadline(e.target.value)}
                      className="w-full bg-[#11111d] border border-[#2a2a3e] rounded-xl px-3 py-2 text-white focus:outline-none focus:border-purple-500"
                    />
                  </div>
                </div>

                <div className="pt-2 flex justify-end gap-2 border-t border-[#2a2a3e]">
                  <Button variant="outline" size="sm" type="button" onClick={() => setShowGoalModal(false)}>
                    Cancel
                  </Button>
                  <Button variant="primary" size="sm" type="submit">
                    Add Goal
                  </Button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Modal: Edit Scholar Name */}
        {showNameModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
            <div className="w-full max-w-md bg-[#181829] border border-purple-500/30 rounded-2xl shadow-2xl p-5 space-y-4">
              <div className="flex items-center justify-between border-b border-[#2a2a3e] pb-3">
                <div className="flex items-center gap-2">
                  <Pencil className="w-4 h-4 text-purple-400" />
                  <h3 className="text-base font-bold text-white">Update Scholar Full Name</h3>
                </div>
                <button 
                  onClick={() => setShowNameModal(false)} 
                  className="text-slate-400 hover:text-white"
                >
                  ✕
                </button>
              </div>

              <form onSubmit={handleSaveName} className="space-y-4 text-xs">
                <div>
                  <label className="block text-[11px] font-semibold text-slate-300 mb-1">Scholar Full Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Fatima Bibi"
                    value={editNameInput}
                    onChange={(e) => setEditNameInput(e.target.value)}
                    className="w-full bg-[#11111d] border border-[#2a2a3e] rounded-xl px-3 py-2.5 text-sm text-white focus:outline-none focus:border-purple-500"
                  />
                  <p className="text-[10px] text-slate-400 mt-1.5">
                    This will update your academic portal identity, grade records, and certificate displays.
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
