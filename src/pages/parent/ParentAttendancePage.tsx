import React, { useState, useEffect } from 'react';
import { PortalLayout } from '../../components/layout/PortalLayout';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { 
  CalendarCheck, 
  CheckCircle2, 
  Clock, 
  AlertCircle, 
  Phone,
  ShieldCheck,
  TrendingUp 
} from 'lucide-react';
import { fetchAttendanceForStudent } from '../../lib/dataService';
import { Attendance } from '../../types';

export const ParentAttendancePage: React.FC = () => {
  const [records, setRecords] = useState<Attendance[]>([]);

  useEffect(() => {
    fetchAttendanceForStudent('demo-student-uid-3').then(setRecords);
  }, []);

  const total = records.length || 6;
  const present = records.filter(r => r.status === 'present').length || 5;

  return (
    <PortalLayout
      pageTitle="Daily & Monthly Attendance Record"
      pageSubtitle="Enrolled Scholar: Fatima Bibi (Roll: GA-10S-042) • Grade 10 Matric Science"
    >
      <div className="space-y-6">

        {/* Top Summary Banner */}
        <Card className="p-6 bg-[#181827] border-[#2a2a3e] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <img
              src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80"
              alt="Fatima Bibi"
              className="w-14 h-14 rounded-2xl object-cover border-2 border-cyan-500/40"
            />
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-white">Fatima Bibi</h3>
                <Badge variant="cyan">Class 10 (Matric Science)</Badge>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">Class Mentors: Mrs. Sana Malik / Dr. Farhat Yasmeen</p>
              <span className="text-[11px] text-emerald-400 font-medium flex items-center gap-1 mt-1">
                <CheckCircle2 className="w-3.5 h-3.5" /> 96.8% Overall Attendance (Excellent Attendance Standing)
              </span>
            </div>
          </div>

          <a href="tel:0514861234">
            <Button variant="outline" size="sm" leftIcon={<Phone className="w-3.5 h-3.5" />}>
              Contact Campus Administration
            </Button>
          </a>
        </Card>

        {/* Attendance Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <Card glassmorphism className="p-5 bg-[#181827] border-[#2a2a3e]">
            <span className="text-xs font-semibold text-slate-400 uppercase block">Regularity Rate</span>
            <div className="text-2xl sm:text-3xl font-extrabold text-emerald-400 mt-1">96.8%</div>
            <span className="text-[10px] text-slate-400 mt-0.5 block">Target exceeded (95%+)</span>
          </Card>
          <Card glassmorphism className="p-5 bg-[#181827] border-[#2a2a3e]">
            <span className="text-xs font-semibold text-slate-400 uppercase block">Total Sessions</span>
            <div className="text-2xl sm:text-3xl font-extrabold text-white mt-1">{total} Days</div>
            <span className="text-[10px] text-purple-300 mt-0.5 block">Current Fall Term</span>
          </Card>
          <Card glassmorphism className="p-5 bg-[#181827] border-[#2a2a3e]">
            <span className="text-xs font-semibold text-slate-400 uppercase block">Present Days</span>
            <div className="text-2xl sm:text-3xl font-extrabold text-white mt-1">{present} Days</div>
            <span className="text-[10px] text-slate-400 mt-0.5 block">On-time check-ins</span>
          </Card>
          <Card glassmorphism className="p-5 bg-[#181827] border-[#2a2a3e]">
            <span className="text-xs font-semibold text-slate-400 uppercase block">Unexcused Absences</span>
            <div className="text-2xl sm:text-3xl font-extrabold text-emerald-400 mt-1">0 Days</div>
            <span className="text-[10px] text-emerald-300 mt-0.5 block">Perfect compliance</span>
          </Card>
        </div>

        {/* Daily Log Table */}
        <Card className="p-0 bg-[#181827] border-[#2a2a3e] overflow-hidden">
          <div className="p-4 border-b border-[#2a2a3e] flex items-center justify-between">
            <h3 className="text-xs font-semibold text-slate-300 uppercase tracking-wider">
              Verified Daily Roll Call Log
            </h3>
            <span className="text-[11px] text-slate-500">Auto-synced with Teacher Desk</span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="bg-[#141422] border-b border-[#2a2a3e] text-slate-400 uppercase text-[10px] font-semibold">
                <tr>
                  <th className="py-3 px-6">Date</th>
                  <th className="py-3 px-4">Class Subject</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4">Faculty Verification</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#2a2a3e]/60">
                {records.map((r) => (
                  <tr key={r.id} className="hover:bg-white/[0.02]">
                    <td className="py-3.5 px-6 font-medium text-white">{r.date}</td>
                    <td className="py-3.5 px-4 text-purple-300">Grade 11 - STEM & Robotics</td>
                    <td className="py-3.5 px-4">
                      {r.status === 'present' ? <Badge variant="emerald" size="sm">Present</Badge> : <Badge variant="amber" size="sm">Late (Excused)</Badge>}
                    </td>
                    <td className="py-3.5 px-4 text-slate-400">Dr. Elena Rostova</td>
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
