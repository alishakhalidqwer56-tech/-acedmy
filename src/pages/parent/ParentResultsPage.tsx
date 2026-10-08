import React, { useState, useEffect } from 'react';
import { PortalLayout } from '../../components/layout/PortalLayout';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { 
  Award, 
  TrendingUp, 
  Download, 
  Printer, 
  CheckCircle2, 
  Sparkles 
} from 'lucide-react';
import { fetchResultsForStudent } from '../../lib/dataService';
import { Result } from '../../types';

export const ParentResultsPage: React.FC = () => {
  const [results, setResults] = useState<Result[]>([]);

  useEffect(() => {
    fetchResultsForStudent('demo-student-uid-3').then(setResults);
  }, []);

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

  return (
    <PortalLayout
      pageTitle="Academic Report Card & Performance Transcript"
      pageSubtitle="Scholar: Fatima Bibi • Examination: First Term Board Pattern"
    >
      <div className="space-y-6">

        {/* Top Report Card Banner */}
        <Card className="p-6 sm:p-8 bg-gradient-to-r from-[#171b30] via-[#141829] to-[#241733] border border-[#2e375c] flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 text-[11px] font-semibold mb-2">
              <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
              <span>Official Result Card • Class 10 (Matric Science)</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
              Overall Grade: <span className="text-gradient">A+ Distinction (478 / 500 • 95.6%)</span>
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 mt-1">
              Fatima Bibi secured overall 1st position in Matric Science examinations with 95.6% marks.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Button variant="outline" size="sm" onClick={() => window.print()} leftIcon={<Printer className="w-3.5 h-3.5" />}>
              Print Report
            </Button>
            <Button variant="primary" size="sm" leftIcon={<Download className="w-3.5 h-3.5" />}>
              Download Official PDF
            </Button>
          </div>
        </Card>

        {/* Grades Table with Teacher Remarks */}
        <Card className="p-0 bg-[#181827] border-[#2a2a3e] overflow-hidden">
          <div className="p-4 sm:p-5 border-b border-[#2a2a3e] flex items-center justify-between">
            <h3 className="text-sm font-semibold text-white uppercase tracking-wider">
              Subject Grades & Faculty Commentary
            </h3>
            <span className="text-xs text-cyan-300 font-semibold">Semester Marks Percentage: 95.0%</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="bg-[#141422] border-b border-[#2a2a3e] text-slate-400 uppercase text-[10px] font-semibold tracking-wider">
                <tr>
                  <th className="py-3.5 px-6">Subject</th>
                  <th className="py-3.5 px-4">Marks Earned</th>
                  <th className="py-3.5 px-4">Total Marks</th>
                  <th className="py-3.5 px-4">Grade</th>
                  <th className="py-3.5 px-6">Faculty Evaluator Remarks</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#2a2a3e]/60">
                {results.map((r) => (
                  <tr key={r.id} className="hover:bg-white/[0.02]">
                    <td className="py-4 px-6 font-bold text-white">
                      {subjectNames[r.subject_id || ''] || 'Advanced Honors Core'}
                    </td>
                    <td className="py-4 px-4 font-extrabold text-cyan-400 text-sm">
                      {r.marks_obtained}
                    </td>
                    <td className="py-4 px-4 text-slate-400">
                      {r.total_marks || 100}
                    </td>
                    <td className="py-4 px-4">
                      <Badge variant="cyan" size="md">{r.grade || 'A'}</Badge>
                    </td>
                    <td className="py-4 px-6 text-slate-300">
                      Exceptional laboratory insight, methodical data analysis, and inspiring team mentorship.
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
