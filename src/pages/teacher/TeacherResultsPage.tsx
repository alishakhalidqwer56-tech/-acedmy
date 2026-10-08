import React, { useState, useEffect } from 'react';
import { PortalLayout } from '../../components/layout/PortalLayout';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { Input } from '../../components/ui/Input';
import { 
  Award, 
  Save, 
  CheckCircle2, 
  Search, 
  SlidersHorizontal,
  Calculator,
  AlertCircle
} from 'lucide-react';
import { 
  initialClasses, 
  initialSubjects, 
  initialTerms, 
  saveStudentResult,
  fetchResultsForStudent 
} from '../../lib/dataService';
import { useAuth } from '../../context/AuthContext';
import { Result } from '../../types';

interface StudentGradeEntry {
  studentId: string;
  studentName: string;
  rollNumber: string;
  marks: number;
  totalMarks: number;
  grade: string;
  remarks: string;
}

export const TeacherResultsPage: React.FC = () => {
  const { user } = useAuth();
  const [selectedClass, setSelectedClass] = useState(initialClasses[0]?.id || 'class-1');
  const [selectedSubject, setSelectedSubject] = useState(initialSubjects[0]?.id || 'subj-1');
  const [selectedTerm, setSelectedTerm] = useState(initialTerms[0]?.id || 'term-1');
  const [isSaving, setIsSaving] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const [students, setStudents] = useState<StudentGradeEntry[]>([
    { studentId: 'demo-student-uid-3', studentName: 'Fatima Bibi', rollNumber: 'GA-10S-042', marks: 96, totalMarks: 100, grade: 'A+', remarks: 'Outstanding (Mumtaz) — Excellent BISE paper presentation.' },
    { studentId: 'usr-43', studentName: 'Ayesha Siddiqui', rollNumber: 'GA-10S-043', marks: 91, totalMarks: 100, grade: 'A+', remarks: 'Outstanding (Mumtaz) — Top marks in numericals.' },
    { studentId: 'usr-44', studentName: 'Zainab Khan', rollNumber: 'GA-10S-044', marks: 84, totalMarks: 100, grade: 'A', remarks: 'Excellent (Bahtar) — Consistent lab performance.' },
    { studentId: 'usr-45', studentName: 'Maryam Nawaz', rollNumber: 'GA-10S-045', marks: 76, totalMarks: 100, grade: 'B', remarks: 'Good (Acha) — Capable student.' },
    { studentId: 'usr-46', studentName: 'Hina Sheikh', rollNumber: 'GA-10S-046', marks: 68, totalMarks: 100, grade: 'C', remarks: 'Satisfactory (Qabil-e-Qabool).' },
  ]);

  const calculateGrade = (marks: number, total: number = 100): string => {
    const pct = (marks / total) * 100;
    if (pct >= 90) return 'A+';
    if (pct >= 80) return 'A';
    if (pct >= 70) return 'B';
    if (pct >= 60) return 'C';
    if (pct >= 50) return 'D';
    if (pct >= 33) return 'E';
    return 'F';
  };

  const handleMarksChange = (studentId: string, newMarks: number) => {
    const clamped = Math.max(0, Math.min(100, newMarks || 0));
    setStudents(prev => prev.map(s => {
      if (s.studentId === studentId) {
        return {
          ...s,
          marks: clamped,
          grade: calculateGrade(clamped, s.totalMarks)
        };
      }
      return s;
    }));
  };

  const handleRemarksChange = (studentId: string, remarks: string) => {
    setStudents(prev => prev.map(s => s.studentId === studentId ? { ...s, remarks } : s));
  };

  const handleSaveGradebook = async () => {
    setIsSaving(true);
    try {
      for (const s of students) {
        await saveStudentResult({
          student_id: s.studentId,
          subject_id: selectedSubject,
          term_id: selectedTerm,
          marks_obtained: s.marks,
          total_marks: s.totalMarks,
          entered_by: user?.id || 'demo-teacher-uid-2'
        });
      }
      setToastMessage('Gradebook evaluation successfully saved & published to student records!');
      setTimeout(() => setToastMessage(null), 4500);
    } catch (err: any) {
      alert('Error saving results: ' + err.message);
    } finally {
      setIsSaving(false);
    }
  };

  const averageClassScore = Math.round(
    students.reduce((acc, curr) => acc + curr.marks, 0) / (students.length || 1)
  );

  return (
    <PortalLayout
      pageTitle="Gradebook & Examination Results Entry"
      pageSubtitle="Enter marks, auto-compute letter grades, and publish evaluations for academic terms"
    >
      <div className="space-y-6">

        {/* Filters and Selection Bar */}
        <Card className="p-5 bg-[#181827] border-[#2a2a3e] space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-[11px] font-semibold text-slate-400 mb-1">Class Section</label>
              <select
                value={selectedClass}
                onChange={(e) => setSelectedClass(e.target.value)}
                className="w-full bg-[#11111d] border border-[#2a2a3e] text-white text-xs rounded-xl px-3 py-2.5 focus:outline-none focus:border-purple-500"
              >
                {initialClasses.map(c => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-slate-400 mb-1">Subject Module</label>
              <select
                value={selectedSubject}
                onChange={(e) => setSelectedSubject(e.target.value)}
                className="w-full bg-[#11111d] border border-[#2a2a3e] text-white text-xs rounded-xl px-3 py-2.5 focus:outline-none focus:border-purple-500"
              >
                {initialSubjects.map(s => (
                  <option key={s.id} value={s.id}>{s.name}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-slate-400 mb-1">Academic Term</label>
              <select
                value={selectedTerm}
                onChange={(e) => setSelectedTerm(e.target.value)}
                className="w-full bg-[#11111d] border border-[#2a2a3e] text-white text-xs rounded-xl px-3 py-2.5 focus:outline-none focus:border-purple-500"
              >
                {initialTerms.map(t => (
                  <option key={t.id} value={t.id}>{t.name} ({t.academic_year})</option>
                ))}
              </select>
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-4 pt-3 border-t border-[#2a2a3e]">
            <div className="flex items-center gap-4 text-xs text-slate-400">
              <span>Roster Size: <strong className="text-white">{students.length} Students</strong></span>
              <span>Class Mean: <strong className="text-emerald-400">{averageClassScore}%</strong></span>
              <span>Grading Scale: <strong className="text-purple-400">Standard 4.0 Weighted</strong></span>
            </div>

            <Button
              variant="primary"
              size="sm"
              isLoading={isSaving}
              onClick={handleSaveGradebook}
              leftIcon={<Save className="w-4 h-4" />}
            >
              Save & Publish Gradebook
            </Button>
          </div>
        </Card>

        {/* Toast Banner */}
        {toastMessage && (
          <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 flex items-center gap-3 animate-fade-in text-xs font-semibold">
            <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-400" />
            <span>{toastMessage}</span>
          </div>
        )}

        {/* Gradebook Table */}
        <Card className="p-0 overflow-hidden bg-[#181827] border-[#2a2a3e]">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#12121f] text-slate-400 uppercase tracking-wider text-[10px] border-b border-[#2a2a3e]">
                <tr>
                  <th className="p-4 font-semibold">Roll No.</th>
                  <th className="p-4 font-semibold">Student Name</th>
                  <th className="p-4 font-semibold w-28">Marks (/100)</th>
                  <th className="p-4 font-semibold text-center w-20">Grade</th>
                  <th className="p-4 font-semibold">Instructor Evaluative Remarks</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#2a2a3e]">
                {students.map((st) => (
                  <tr key={st.studentId} className="hover:bg-white/[0.02] transition-colors">
                    <td className="p-4 font-mono text-purple-300 font-semibold">{st.rollNumber}</td>
                    <td className="p-4 font-bold text-white">{st.studentName}</td>
                    <td className="p-4">
                      <input
                        type="number"
                        min="0"
                        max="100"
                        value={st.marks}
                        onChange={(e) => handleMarksChange(st.studentId, parseFloat(e.target.value))}
                        className="w-20 bg-[#11111d] border border-[#2a2a3e] rounded-lg px-2.5 py-1.5 text-white font-mono text-xs focus:outline-none focus:border-purple-500 font-bold"
                      />
                    </td>
                    <td className="p-4 text-center">
                      <span className={`px-2 py-1 rounded-md text-[11px] font-extrabold ${
                        st.grade.startsWith('A') ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' :
                        st.grade.startsWith('B') ? 'bg-purple-500/20 text-purple-300 border border-purple-500/30' :
                        'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                      }`}>
                        {st.grade}
                      </span>
                    </td>
                    <td className="p-4">
                      <input
                        type="text"
                        value={st.remarks}
                        onChange={(e) => handleRemarksChange(st.studentId, e.target.value)}
                        placeholder="Enter qualitative feedback..."
                        className="w-full bg-[#11111d] border border-[#2a2a3e] rounded-lg px-3 py-1.5 text-slate-300 text-xs focus:outline-none focus:border-purple-500"
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>

      </div>
    </PortalLayout>
  );
};
