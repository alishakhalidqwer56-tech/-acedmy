import React, { useState, useEffect } from 'react';
import { PortalLayout } from '../../components/layout/PortalLayout';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { 
  Award, 
  Lock, 
  Unlock, 
  CheckCircle2, 
  TrendingUp, 
  Plus, 
  Users, 
  Star, 
  FileCheck, 
  Search,
  Trash2,
  X,
  BookOpen
} from 'lucide-react';
import { 
  fetchAllResults, 
  saveStudentResult, 
  deleteStudentResult, 
  fetchAllUsers,
  initialTerms 
} from '../../lib/dataService';
import { Result, Profile } from '../../types';

export const AdminResultsPage: React.FC = () => {
  const [results, setResults] = useState<Result[]>([]);
  const [students, setStudents] = useState<Profile[]>([]);
  const [selectedTerm, setSelectedTerm] = useState('term-1');
  const [isTermLocked, setIsTermLocked] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  // Add Result Modal State
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedStudentId, setSelectedStudentId] = useState('demo-student-uid-3');
  const [customStudentName, setCustomStudentName] = useState('');
  const [selectedSubjectId, setSelectedSubjectId] = useState('subj-1');
  const [subjectTitle, setSubjectTitle] = useState('Physics');
  const [targetTermId, setTargetTermId] = useState('term-1');
  const [obtainedMarks, setObtainedMarks] = useState<number>(95);
  const [totalMarks, setTotalMarks] = useState<number>(100);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const subjectOptions = [
    { id: 'subj-1', name: 'Physics' },
    { id: 'subj-2', name: 'Chemistry' },
    { id: 'subj-3', name: 'Biology' },
    { id: 'subj-4', name: 'Mathematics' },
    { id: 'subj-5', name: 'Urdu Literature' },
    { id: 'subj-6', name: 'English Compulsory' },
    { id: 'subj-7', name: 'Ethics & Islamic Studies' },
    { id: 'subj-8', name: 'Pakistan Studies' },
    { id: 'subj-9', name: 'Computer Science' },
  ];

  const termNames: Record<string, string> = {
    'term-1': 'First Term (Fall)',
    'term-2': 'Mid-Term Examination',
    'term-3': 'Final Pre-Board Term',
  };

  const subjectNamesMap: Record<string, string> = {
    'subj-1': 'Physics',
    'subj-2': 'Chemistry',
    'subj-3': 'Biology',
    'subj-4': 'Mathematics',
    'subj-5': 'Urdu Literature',
    'subj-6': 'English Compulsory',
    'subj-7': 'Ethics & Islamic Studies',
    'subj-8': 'Pakistan Studies',
    'subj-9': 'Computer Science',
  };

  const loadData = async () => {
    const res = await fetchAllResults();
    setResults(res);
    const users = await fetchAllUsers('student');
    setStudents(users);
  };

  useEffect(() => {
    loadData();
  }, []);

  const honorsList = [
    { rank: 1, name: 'Fatima Bibi', roll: 'GA-10S-042', gpa: 'A+ (Distinction)', pct: '96.2%', honors: 'First Position — BISE Matric Science Stream' },
    { rank: 2, name: 'Ayesha Siddiqui', roll: 'GA-10S-043', gpa: 'A+ (Distinction)', pct: '94.8%', honors: 'Second Position & Science Lab Shield' },
    { rank: 3, name: 'Zainab Khan', roll: 'GA-10S-044', gpa: 'A+ (Distinction)', pct: '92.5%', honors: 'Third Position — FSc Pre-Med & Pre-Eng Wing' },
    { rank: 4, name: 'Maryam Nawaz', roll: 'GA-10S-045', gpa: 'A (Excellent)', pct: '88.4%', honors: 'High Merit Certificate' },
    { rank: 5, name: 'Hina Sheikh', roll: 'GA-10S-046', gpa: 'A (Excellent)', pct: '86.1%', honors: 'Academic Distinction' },
  ];

  const handleToggleLock = () => {
    const next = !isTermLocked;
    setIsTermLocked(next);
    setToastMessage(next
      ? 'Examination marks (First Term) are locked and published to student portals.'
      : 'Examination marks unlocked for faculty grade entries.');
    setTimeout(() => setToastMessage(null), 4000);
  };

  const handleCreateResult = async (e: React.FormEvent) => {
    e.preventDefault();
    if (obtainedMarks < 0 || totalMarks <= 0 || obtainedMarks > totalMarks) {
      alert('Please enter valid obtained and total marks.');
      return;
    }

    setIsSubmitting(true);
    try {
      const studentTargetId = selectedStudentId === 'custom' ? `student-${Date.now()}` : selectedStudentId;
      await saveStudentResult({
        student_id: studentTargetId,
        subject_id: selectedSubjectId,
        term_id: targetTermId,
        marks_obtained: Number(obtainedMarks),
        total_marks: Number(totalMarks),
        entered_by: 'Academic Admin Desk'
      });

      const matchedStudent = students.find(s => s.id === selectedStudentId);
      const studentLabel = matchedStudent ? matchedStudent.full_name : customStudentName || 'Student';

      setToastMessage(`Marks for ${studentLabel} in ${subjectNamesMap[selectedSubjectId] || 'Subject'} saved successfully!`);
      setShowAddModal(false);
      setCustomStudentName('');
      await loadData();
      setTimeout(() => setToastMessage(null), 4000);
    } catch (err: any) {
      alert('Error saving result: ' + err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteResult = async (id: string) => {
    if (!window.confirm('Are you sure you want to remove this examination result?')) return;
    try {
      await deleteStudentResult(id);
      setResults(prev => prev.filter(r => r.id !== id));
      setToastMessage('Result record removed successfully.');
      setTimeout(() => setToastMessage(null), 3000);
    } catch (err: any) {
      alert('Error deleting result: ' + err.message);
    }
  };

  const getStudentName = (sid: string) => {
    const found = students.find(s => s.id === sid);
    if (found) return found.full_name;
    if (sid === 'demo-student-uid-3') return 'Fatima Bibi';
    return `Scholar (${sid.slice(0, 8)})`;
  };

  const filteredResults = results.filter(r => {
    const sName = getStudentName(r.student_id).toLowerCase();
    const subName = (subjectNamesMap[r.subject_id || ''] || '').toLowerCase();
    const q = searchQuery.toLowerCase();
    return sName.includes(q) || subName.includes(q) || (r.grade || '').toLowerCase().includes(q);
  });

  return (
    <PortalLayout
      pageTitle="Examinations Governance & Academic Results"
      pageSubtitle="Supervise academic score distributions, publish student marks, and customize transcripts"
    >
      <div className="space-y-6">

        {/* 4 Overview Metrics */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="p-5 bg-[#181827] border-[#2a2a3e]">
            <div className="flex items-center justify-between text-slate-400 mb-2">
              <span className="text-xs font-semibold uppercase">Academy Average GPA</span>
              <TrendingUp className="w-4 h-4 text-emerald-400" />
            </div>
            <div className="text-2xl sm:text-3xl font-extrabold text-white">3.78</div>
            <div className="text-[11px] text-emerald-400 mt-1">+0.12 vs previous academic year</div>
          </Card>

          <Card className="p-5 bg-[#181827] border-[#2a2a3e]">
            <div className="flex items-center justify-between text-slate-400 mb-2">
              <span className="text-xs font-semibold uppercase">Dean’s Honor Scholars</span>
              <Award className="w-4 h-4 text-purple-400" />
            </div>
            <div className="text-2xl sm:text-3xl font-extrabold text-purple-400">342</div>
            <div className="text-[11px] text-slate-400 mt-1">Scholars with GPA &gt; 3.85</div>
          </Card>

          <Card className="p-5 bg-[#181827] border-[#2a2a3e]">
            <div className="flex items-center justify-between text-slate-400 mb-2">
              <span className="text-xs font-semibold uppercase">Total Score Entries</span>
              <FileCheck className="w-4 h-4 text-cyan-400" />
            </div>
            <div className="text-2xl sm:text-3xl font-extrabold text-cyan-400">{results.length}</div>
            <div className="text-[11px] text-slate-400 mt-1">Live recorded examinations</div>
          </Card>

          <Card className="p-5 bg-[#181827] border-[#2a2a3e]">
            <div className="flex items-center justify-between text-slate-400 mb-2">
              <span className="text-xs font-semibold uppercase">Term Governance</span>
              {isTermLocked ? <Lock className="w-4 h-4 text-amber-400" /> : <Unlock className="w-4 h-4 text-emerald-400" />}
            </div>
            <div className={`text-xl sm:text-2xl font-extrabold ${isTermLocked ? 'text-amber-400' : 'text-emerald-400'}`}>
              {isTermLocked ? 'TERM LOCKED' : 'OPEN EDIT'}
            </div>
            <div className="text-[11px] text-slate-400 mt-1">Fall 2026 Academic Term</div>
          </Card>
        </div>

        {/* Governance & Add Control Bar */}
        <Card className="p-4 bg-[#181827] border-[#2a2a3e] flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <span className="text-xs font-semibold text-slate-300">Target Term:</span>
            <select
              value={selectedTerm}
              onChange={(e) => setSelectedTerm(e.target.value)}
              className="bg-[#11111d] border border-[#2a2a3e] rounded-xl px-3 py-1.5 text-xs text-white focus:outline-none focus:border-purple-500"
            >
              {initialTerms.map(t => (
                <option key={t.id} value={t.id}>{t.name} ({t.academic_year})</option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-3">
            <Button
              variant="primary"
              size="sm"
              onClick={() => setShowAddModal(true)}
              leftIcon={<Plus className="w-4 h-4" />}
              className="bg-purple-600 hover:bg-purple-500 text-white"
            >
              Add Student Marks
            </Button>
            <Button
              variant={isTermLocked ? 'outline' : 'primary'}
              size="sm"
              onClick={handleToggleLock}
              leftIcon={isTermLocked ? <Unlock className="w-4 h-4" /> : <Lock className="w-4 h-4" />}
            >
              {isTermLocked ? 'Unlock Term' : 'Lock Transcripts'}
            </Button>
          </div>
        </Card>

        {/* Toast Notification */}
        {toastMessage && (
          <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 flex items-center gap-3 animate-fade-in text-xs font-semibold">
            <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-400" />
            <span>{toastMessage}</span>
          </div>
        )}

        {/* Results Data Table */}
        <Card className="p-0 overflow-hidden bg-[#181827] border-[#2a2a3e]">
          <div className="p-4 border-b border-[#2a2a3e] flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-purple-400" />
              <h3 className="text-sm font-bold text-white">Student Examination Transcripts ({results.length} Recorded)</h3>
            </div>
            
            <div className="relative w-full sm:w-64">
              <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Search student or subject..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-[#11111d] border border-[#2a2a3e] rounded-xl pl-9 pr-3 py-1.5 text-xs text-white placeholder-slate-400 focus:outline-none focus:border-purple-500"
              />
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#12121f] text-slate-400 uppercase tracking-wider text-[10px] border-b border-[#2a2a3e]">
                <tr>
                  <th className="p-4 font-semibold">Student Name</th>
                  <th className="p-4 font-semibold">Subject</th>
                  <th className="p-4 font-semibold">Term</th>
                  <th className="p-4 font-semibold text-center">Marks Obtained</th>
                  <th className="p-4 font-semibold text-center">Total Marks</th>
                  <th className="p-4 font-semibold text-center">Percentage</th>
                  <th className="p-4 font-semibold text-center">Grade</th>
                  <th className="p-4 font-semibold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#2a2a3e]">
                {filteredResults.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="p-8 text-center text-slate-500">
                      No results matched your search query. Click "+ Add Student Marks" to record new examination scores.
                    </td>
                  </tr>
                ) : (
                  filteredResults.map((r) => {
                    const obtained = r.marks_obtained || 0;
                    const total = r.total_marks || 100;
                    const pct = ((obtained / total) * 100).toFixed(1);
                    return (
                      <tr key={r.id} className="hover:bg-white/[0.02] transition-colors">
                        <td className="p-4 font-bold text-white">
                          {getStudentName(r.student_id)}
                        </td>
                        <td className="p-4 text-purple-300 font-medium">
                          {subjectNamesMap[r.subject_id || ''] || r.subject_id || 'General Subject'}
                        </td>
                        <td className="p-4 text-slate-400">
                          {termNames[r.term_id || 'term-1'] || r.term_id}
                        </td>
                        <td className="p-4 text-center font-mono font-bold text-emerald-400">
                          {obtained}
                        </td>
                        <td className="p-4 text-center font-mono text-slate-400">
                          {total}
                        </td>
                        <td className="p-4 text-center font-mono text-slate-300">
                          {pct}%
                        </td>
                        <td className="p-4 text-center">
                          <Badge variant={
                            r.grade === 'A+' ? 'amber' :
                            r.grade === 'A' ? 'purple' :
                            r.grade === 'B' ? 'cyan' : 'pink'
                          } size="sm">
                            {r.grade || 'A'}
                          </Badge>
                        </td>
                        <td className="p-4 text-right">
                          <button
                            onClick={() => handleDeleteResult(r.id)}
                            className="p-1.5 rounded-lg border border-rose-500/30 text-rose-400 hover:bg-rose-500/10 transition-colors cursor-pointer"
                            title="Remove result entry"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </Card>

        {/* Valedictorian & Academic Honors Leaderboard */}
        <Card className="p-0 overflow-hidden bg-[#181827] border-[#2a2a3e]">
          <div className="p-4 border-b border-[#2a2a3e] flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
              <h3 className="text-sm font-bold text-white">Dean’s Highest Honors & Valedictorian Rankings</h3>
            </div>
            <Badge variant="purple">Fall 2026 Cohort</Badge>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#12121f] text-slate-400 uppercase tracking-wider text-[10px] border-b border-[#2a2a3e]">
                <tr>
                  <th className="p-4 font-semibold text-center w-16">Rank</th>
                  <th className="p-4 font-semibold">Scholar Name</th>
                  <th className="p-4 font-semibold">Roll Number</th>
                  <th className="p-4 font-semibold text-center">Semester GPA</th>
                  <th className="p-4 font-semibold text-center">Average %</th>
                  <th className="p-4 font-semibold">Academic Distinction</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#2a2a3e]">
                {honorsList.map((h) => (
                  <tr key={h.rank} className="hover:bg-white/[0.02] transition-colors">
                    <td className="p-4 text-center">
                      <span className={`w-6 h-6 inline-flex items-center justify-center rounded-full font-bold text-xs ${
                        h.rank === 1 ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40' :
                        h.rank === 2 ? 'bg-slate-300/20 text-slate-200 border border-slate-300/40' :
                        h.rank === 3 ? 'bg-amber-700/20 text-amber-500 border border-amber-700/40' :
                        'text-slate-400'
                      }`}>
                        {h.rank}
                      </span>
                    </td>
                    <td className="p-4 font-bold text-white">{h.name}</td>
                    <td className="p-4 font-mono text-purple-300">{h.roll}</td>
                    <td className="p-4 text-center font-mono font-extrabold text-emerald-400">{h.gpa}</td>
                    <td className="p-4 text-center font-mono text-slate-300">{h.pct}</td>
                    <td className="p-4">
                      <Badge variant={h.rank === 1 ? 'amber' : 'purple'} size="sm">
                        {h.honors}
                      </Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>

        {/* Modal: Add Student Marks */}
        {showAddModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
            <div className="w-full max-w-md bg-[#181829] border border-purple-500/30 rounded-2xl shadow-2xl overflow-hidden">
              <div className="p-5 border-b border-[#2a2a3e] flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Award className="w-5 h-5 text-purple-400" />
                  <h3 className="text-base font-bold text-white">Record Student Examination Marks</h3>
                </div>
                <button
                  onClick={() => setShowAddModal(false)}
                  className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-white/5"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleCreateResult} className="p-5 space-y-4 text-xs">
                <div>
                  <label className="block text-[11px] font-semibold text-slate-300 mb-1">Select Student Scholar *</label>
                  <select
                    value={selectedStudentId}
                    onChange={(e) => setSelectedStudentId(e.target.value)}
                    className="w-full bg-[#11111d] border border-[#2a2a3e] rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-purple-500"
                  >
                    <option value="demo-student-uid-3">Fatima Bibi (Roll: GA-10S-042)</option>
                    {students.filter(s => s.id !== 'demo-student-uid-3').map(s => (
                      <option key={s.id} value={s.id}>{s.full_name} ({s.email})</option>
                    ))}
                    <option value="custom">+ Other / New Student Name</option>
                  </select>
                </div>

                {selectedStudentId === 'custom' && (
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-300 mb-1">Enter Student Full Name *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Ayesha Noor"
                      value={customStudentName}
                      onChange={(e) => setCustomStudentName(e.target.value)}
                      className="w-full bg-[#11111d] border border-[#2a2a3e] rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-purple-500"
                    />
                  </div>
                )}

                <div>
                  <label className="block text-[11px] font-semibold text-slate-300 mb-1">Academic Subject *</label>
                  <select
                    value={selectedSubjectId}
                    onChange={(e) => setSelectedSubjectId(e.target.value)}
                    className="w-full bg-[#11111d] border border-[#2a2a3e] rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-purple-500"
                  >
                    {subjectOptions.map(sub => (
                      <option key={sub.id} value={sub.id}>{sub.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-300 mb-1">Examination Term *</label>
                  <select
                    value={targetTermId}
                    onChange={(e) => setTargetTermId(e.target.value)}
                    className="w-full bg-[#11111d] border border-[#2a2a3e] rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-purple-500"
                  >
                    <option value="term-1">First Term Examination (Fall)</option>
                    <option value="term-2">Mid-Term Examination (Winter)</option>
                    <option value="term-3">Final Pre-Board Simulation</option>
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-300 mb-1">Marks Obtained *</label>
                    <input
                      type="number"
                      required
                      min={0}
                      max={totalMarks}
                      value={obtainedMarks}
                      onChange={(e) => setObtainedMarks(Number(e.target.value))}
                      className="w-full bg-[#11111d] border border-[#2a2a3e] rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-purple-500"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-300 mb-1">Total Marks *</label>
                    <input
                      type="number"
                      required
                      min={1}
                      value={totalMarks}
                      onChange={(e) => setTotalMarks(Number(e.target.value))}
                      className="w-full bg-[#11111d] border border-[#2a2a3e] rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-purple-500"
                    />
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-purple-500/10 border border-purple-500/20 text-[11px] text-purple-300 flex items-center justify-between">
                  <span>Calculated Percentage:</span>
                  <span className="font-bold text-white font-mono">
                    {totalMarks > 0 ? ((obtainedMarks / totalMarks) * 100).toFixed(1) : '0'}%
                  </span>
                </div>

                <div className="pt-2 flex items-center justify-end gap-2 border-t border-[#2a2a3e]">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => setShowAddModal(false)}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    variant="primary"
                    size="sm"
                    className="bg-purple-600 hover:bg-purple-500 text-white"
                    isLoading={isSubmitting}
                  >
                    Save & Publish Result
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
