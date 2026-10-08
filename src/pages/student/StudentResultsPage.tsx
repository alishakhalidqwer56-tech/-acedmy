import React, { useState, useEffect } from 'react';
import { PortalLayout } from '../../components/layout/PortalLayout';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { 
  Award, 
  TrendingUp, 
  BookOpen, 
  Download, 
  Printer, 
  Sparkles,
  CheckCircle2
} from 'lucide-react';
import { fetchResultsForStudent } from '../../lib/dataService';
import { Result } from '../../types';
import { useAuth } from '../../context/AuthContext';

export const StudentResultsPage: React.FC = () => {
  const { user, profile } = useAuth();
  const [results, setResults] = useState<Result[]>([]);

  useEffect(() => {
    fetchResultsForStudent(user?.id || 'demo-student-uid-3').then(setResults);
  }, [user]);

  const subjectNames: Record<string, string> = {
    'subj-1': 'Physics',
    'subj-2': 'Chemistry',
    'subj-3': 'Biology',
    'subj-4': 'Mathematics',
    'subj-5': 'Urdu Literature',
    'subj-6': 'English Compulsory',
    'subj-7': 'Ethics & Religious Studies',
    'subj-8': 'Pakistan Studies',
  };

  const totalMarksEarned = results.reduce((acc, r) => acc + (r.marks_obtained || 0), 0);
  const totalMaxMarks = results.reduce((acc, r) => acc + (r.total_marks || 100), 0);
  const overallPercentage = totalMaxMarks > 0 ? ((totalMarksEarned / totalMaxMarks) * 100).toFixed(1) : '95.6';

  return (
    <PortalLayout
      pageTitle="Academic Results & Grade Transcript"
      pageSubtitle="First Term Board-pattern Examination Benchmarks & Teacher Remarks"
    >
      <div className="space-y-6">

        {/* Top Summary Card */}
        <Card className="p-6 sm:p-8 bg-gradient-to-r from-[#21163b] via-[#161427] to-[#1c1229] border border-[#3f2560] flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/30 text-[11px] font-semibold mb-2">
              <Sparkles className="w-3.5 h-3.5 text-pink-400" />
              <span>First Term Exams 2026 • Grade A+ (Distinction)</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
              Total Marks: <span className="text-gradient">478 / 500 ({overallPercentage}%)</span>
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 mt-1">
              {profile?.full_name || 'Fatima Bibi'} secured high distinction honors in Matric Science examinations.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              size="sm"
              onClick={() => window.print()}
              leftIcon={<Printer className="w-3.5 h-3.5" />}
            >
              Print Transcript
            </Button>
            <Button
              variant="primary"
              size="sm"
              leftIcon={<Download className="w-3.5 h-3.5" />}
            >
              Download PDF Report
            </Button>
          </div>
        </Card>

        {/* Results Data Table */}
        <Card className="p-0 bg-[#181827] border-[#2a2a3e] overflow-hidden">
          <div className="p-4 sm:p-5 border-b border-[#2a2a3e] flex items-center justify-between">
            <h3 className="text-sm font-semibold text-white uppercase tracking-wider">
              Course Examination Breakdown
            </h3>
            <span className="text-xs text-purple-300 font-semibold">
              Average Score: {overallPercentage}%
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="bg-[#141422] border-b border-[#2a2a3e] text-slate-400 uppercase text-[10px] font-semibold tracking-wider">
                <tr>
                  <th className="py-3.5 px-6">Subject / Discipline</th>
                  <th className="py-3.5 px-4">Score</th>
                  <th className="py-3.5 px-4">Total</th>
                  <th className="py-3.5 px-4">Percentage</th>
                  <th className="py-3.5 px-4">Letter Grade</th>
                  <th className="py-3.5 px-4">Evaluation Remark</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#2a2a3e]/60">
                {results.map((r) => {
                  const pct = (((r.marks_obtained || 0) / (r.total_marks || 100)) * 100).toFixed(0);
                  return (
                    <tr key={r.id} className="hover:bg-white/[0.02] transition-colors">
                      <td className="py-4 px-6 font-bold text-white">
                        {subjectNames[r.subject_id || ''] || 'Advanced Honors Core'}
                      </td>
                      <td className="py-4 px-4 font-extrabold text-purple-300 text-sm">
                        {r.marks_obtained}
                      </td>
                      <td className="py-4 px-4 text-slate-400">
                        {r.total_marks || 100}
                      </td>
                      <td className="py-4 px-4 font-semibold text-emerald-400">
                        {pct}%
                      </td>
                      <td className="py-4 px-4">
                        <Badge variant="purple" size="md">{r.grade || 'A'}</Badge>
                      </td>
                      <td className="py-4 px-4 text-slate-400">
                        Exemplary analytical execution & capstone leadership
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </Card>

        {/* Academy Grading Scale Legend */}
        <Card className="p-6 bg-[#181827] border-[#2a2a3e]">
          <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">
            Institutional Grading Scale & Honors Standard
          </h4>
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-3 text-center text-xs">
            <div className="p-2.5 rounded-xl bg-purple-950/20 border border-purple-500/20">
              <span className="font-bold text-white block">A+ (4.0 GPA)</span>
              <span className="text-[10px] text-purple-300">95% – 100%</span>
            </div>
            <div className="p-2.5 rounded-xl bg-purple-950/20 border border-purple-500/20">
              <span className="font-bold text-white block">A (3.8 GPA)</span>
              <span className="text-[10px] text-purple-300">90% – 94%</span>
            </div>
            <div className="p-2.5 rounded-xl bg-white/[0.02] border border-white/5">
              <span className="font-bold text-white block">B+ (3.3 GPA)</span>
              <span className="text-[10px] text-slate-400">85% – 89%</span>
            </div>
            <div className="p-2.5 rounded-xl bg-white/[0.02] border border-white/5">
              <span className="font-bold text-white block">B (3.0 GPA)</span>
              <span className="text-[10px] text-slate-400">80% – 84%</span>
            </div>
            <div className="p-2.5 rounded-xl bg-white/[0.02] border border-white/5">
              <span className="font-bold text-white block">C+ (2.5 GPA)</span>
              <span className="text-[10px] text-slate-400">75% – 79%</span>
            </div>
            <div className="p-2.5 rounded-xl bg-white/[0.02] border border-white/5">
              <span className="font-bold text-white block">Pass (2.0 GPA)</span>
              <span className="text-[10px] text-slate-400">70% – 74%</span>
            </div>
          </div>
        </Card>

      </div>
    </PortalLayout>
  );
};
