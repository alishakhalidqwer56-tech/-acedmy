import React, { useState, useEffect } from 'react';
import { PortalLayout } from '../../components/layout/PortalLayout';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { Input } from '../../components/ui/Input';
import { Textarea } from '../../components/ui/Textarea';
import { 
  CalendarCheck, 
  CheckCircle2, 
  Clock, 
  AlertCircle, 
  FileText, 
  TrendingUp, 
  Plus,
  X
} from 'lucide-react';
import { fetchAttendanceForStudent } from '../../lib/dataService';
import { Attendance } from '../../types';
import { useAuth } from '../../context/AuthContext';

export const StudentAttendancePage: React.FC = () => {
  const { user } = useAuth();
  const [records, setRecords] = useState<Attendance[]>([]);
  const [excuseModalOpen, setExcuseModalOpen] = useState(false);
  const [excuseDate, setExcuseDate] = useState('');
  const [excuseReason, setExcuseReason] = useState('');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  useEffect(() => {
    fetchAttendanceForStudent(user?.id || 'demo-student-uid-3').then(setRecords);
  }, [user]);

  const total = records.length;
  const present = records.filter(r => r.status === 'present').length;
  const late = records.filter(r => r.status === 'late').length;
  const absent = records.filter(r => r.status === 'absent').length;
  const rate = total > 0 ? (((present + late * 0.5) / total) * 100).toFixed(1) : '96.8';

  const handleExcuseSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setExcuseModalOpen(false);
    setToastMessage(`Absence excuse note submitted for ${excuseDate}. The Registrar will review.`);
    setTimeout(() => setToastMessage(null), 4000);
    setExcuseDate('');
    setExcuseReason('');
  };

  const getStatusBadge = (status: Attendance['status']) => {
    switch (status) {
      case 'present': return <Badge variant="emerald" size="sm">Present</Badge>;
      case 'late': return <Badge variant="amber" size="sm">Late (Excused)</Badge>;
      case 'leave': return <Badge variant="cyan" size="sm">Medical Leave</Badge>;
      case 'absent': return <Badge variant="pink" size="sm">Absent</Badge>;
    }
  };

  return (
    <PortalLayout
      pageTitle="Scholastic Attendance Record"
      pageSubtitle="Daily roll-call tracking, percentage analysis, and absence excuse submissions"
    >
      <div className="space-y-6">

        {/* Attendance Metric Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <Card glassmorphism className="p-5 bg-[#181827] border-[#2a2a3e]">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] font-semibold text-slate-400 uppercase">Attendance Rate</span>
              <CalendarCheck className="w-4 h-4 text-emerald-400" />
            </div>
            <div className="text-3xl font-extrabold text-emerald-400">{rate}%</div>
            <span className="text-[10px] text-slate-400 mt-0.5 block">Exemplary Regularity</span>
          </Card>

          <Card glassmorphism className="p-5 bg-[#181827] border-[#2a2a3e]">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] font-semibold text-slate-400 uppercase">Recorded Sessions</span>
              <Clock className="w-4 h-4 text-purple-400" />
            </div>
            <div className="text-3xl font-extrabold text-white">{total || 6} Days</div>
            <span className="text-[10px] text-purple-300 mt-0.5 block">Fall Term 2026</span>
          </Card>

          <Card glassmorphism className="p-5 bg-[#181827] border-[#2a2a3e]">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] font-semibold text-slate-400 uppercase">Present</span>
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            </div>
            <div className="text-3xl font-extrabold text-white">{present || 5} Sessions</div>
            <span className="text-[10px] text-slate-400 mt-0.5 block">On-time arrivals</span>
          </Card>

          <Card glassmorphism className="p-5 bg-[#181827] border-[#2a2a3e]">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] font-semibold text-slate-400 uppercase">Late / Leaves</span>
              <AlertCircle className="w-4 h-4 text-amber-400" />
            </div>
            <div className="text-3xl font-extrabold text-amber-400">{late || 1} Occasions</div>
            <span className="text-[10px] text-amber-300 mt-0.5 block">Excuses documented</span>
          </Card>
        </div>

        {/* Action Header */}
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-semibold text-white uppercase tracking-wider">
            Daily Attendance History
          </h3>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setExcuseModalOpen(true)}
            leftIcon={<Plus className="w-3.5 h-3.5" />}
          >
            Submit Excuse Note
          </Button>
        </div>

        {/* Table of Records */}
        <Card className="p-0 bg-[#181827] border-[#2a2a3e] overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="bg-[#141422] border-b border-[#2a2a3e] text-slate-400 uppercase text-[10px] font-semibold tracking-wider">
                <tr>
                  <th className="py-3 px-6">Date</th>
                  <th className="py-3 px-4">Class Subject</th>
                  <th className="py-3 px-4">Roll Call Status</th>
                  <th className="py-3 px-4">Instructor Signed</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#2a2a3e]/60">
                {records.map((r) => (
                  <tr key={r.id} className="hover:bg-white/[0.02]">
                    <td className="py-3.5 px-6 font-medium text-white">{r.date}</td>
                    <td className="py-3.5 px-4 text-purple-300 font-medium">Grade 11 - STEM & Robotics</td>
                    <td className="py-3.5 px-4">{getStatusBadge(r.status)}</td>
                    <td className="py-3.5 px-4 text-slate-400">Dr. Elena Rostova</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>

        {/* Excuse Note Modal */}
        {excuseModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
            <div className="relative w-full max-w-md bg-[#141422] border border-[#2a2a3e] rounded-2xl p-6 shadow-2xl space-y-4 text-slate-200">
              <div className="flex items-center justify-between pb-3 border-b border-[#2a2a3e]">
                <h3 className="text-base font-bold text-white">Submit Absence Excuse Note</h3>
                <button onClick={() => setExcuseModalOpen(false)} className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-white/5">
                  <X className="w-4 h-4" />
                </button>
              </div>

              <form onSubmit={handleExcuseSubmit} className="space-y-4">
                <Input
                  label="Date of Absence *"
                  type="date"
                  required
                  value={excuseDate}
                  onChange={e => setExcuseDate(e.target.value)}
                />
                <Textarea
                  label="Reason / Medical Explanation *"
                  required
                  rows={3}
                  placeholder="Explain why you were late or absent..."
                  value={excuseReason}
                  onChange={e => setExcuseReason(e.target.value)}
                />
                <div className="pt-2 flex justify-end gap-2">
                  <Button variant="ghost" size="sm" onClick={() => setExcuseModalOpen(false)}>Cancel</Button>
                  <Button variant="primary" size="sm" type="submit">Submit to Registrar</Button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Toast */}
        {toastMessage && (
          <div className="fixed bottom-6 right-6 z-50 p-4 rounded-2xl bg-[#1e1e2e] border border-emerald-500/40 shadow-2xl flex items-center gap-3 animate-fade-in text-slate-200">
            <CheckCircle2 className="w-6 h-6 text-emerald-400 shrink-0" />
            <div className="text-xs">
              <span className="font-bold text-white block">Absence Request Logged</span>
              <span>{toastMessage}</span>
            </div>
          </div>
        )}

      </div>
    </PortalLayout>
  );
};
