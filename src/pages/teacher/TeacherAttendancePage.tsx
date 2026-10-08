import React, { useState } from 'react';
import { PortalLayout } from '../../components/layout/PortalLayout';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { Input } from '../../components/ui/Input';
import { 
  CalendarCheck, 
  CheckCircle2, 
  Save, 
  Check, 
  X, 
  Clock, 
  AlertCircle,
  Plus,
  Trash2,
  RotateCcw
} from 'lucide-react';
import { markClassAttendance } from '../../lib/dataService';
import { AttendanceStatus } from '../../types';
import { useAuth } from '../../context/AuthContext';

interface StudentRoll {
  id: string;
  roll: string;
  name: string;
  status: AttendanceStatus;
}

export const TeacherAttendancePage: React.FC = () => {
  const { user } = useAuth();
  const [selectedDate, setSelectedDate] = useState('2026-10-07');
  const [selectedClass, setSelectedClass] = useState('class-1');
  const [isSaving, setIsSaving] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [showAddStudent, setShowAddStudent] = useState(false);
  const [newStudentName, setNewStudentName] = useState('');
  const [newStudentRoll, setNewStudentRoll] = useState('');

  const [roster, setRoster] = useState<StudentRoll[]>([
    { id: 'demo-student-uid-3', roll: 'GA-10S-042', name: 'Fatima Bibi', status: 'present' },
    { id: 'usr-43', roll: 'GA-10S-043', name: 'Ayesha Siddiqui', status: 'present' },
    { id: 'usr-44', roll: 'GA-10S-044', name: 'Zainab Khan', status: 'present' },
    { id: 'usr-45', roll: 'GA-10S-045', name: 'Maryam Nawaz', status: 'present' },
    { id: 'usr-46', roll: 'GA-10S-046', name: 'Hina Sheikh', status: 'present' },
  ]);

  const setStatus = (id: string, status: AttendanceStatus) => {
    setRoster(prev => prev.map(s => s.id === id ? { ...s, status } : s));
  };

  const markAll = (status: AttendanceStatus) => {
    setRoster(prev => prev.map(s => ({ ...s, status })));
  };

  const handleAddStudent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newStudentName.trim()) return;

    const newStudent: StudentRoll = {
      id: `usr-${Date.now()}`,
      name: newStudentName.trim(),
      roll: newStudentRoll.trim() || `GA-2026-${Math.floor(100 + Math.random() * 900)}`,
      status: 'present'
    };

    setRoster(prev => [...prev, newStudent]);
    setNewStudentName('');
    setNewStudentRoll('');
    setShowAddStudent(false);
    setToastMessage(`Scholar ${newStudent.name} added to roll call roster.`);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleRemoveStudent = (id: string, name: string) => {
    if (!window.confirm(`Remove ${name} from this section's roll call?`)) return;
    setRoster(prev => prev.filter(s => s.id !== id));
    setToastMessage(`${name} removed from roster.`);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const records = roster.map(s => ({
        student_id: s.id,
        class_id: selectedClass,
        date: selectedDate,
        status: s.status,
        marked_by: user?.id || 'demo-teacher-uid-2'
      }));

      await markClassAttendance(records);
      setToastMessage(`Roll call for ${selectedDate} successfully saved & synced to Supabase!`);
      setTimeout(() => setToastMessage(null), 4000);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <PortalLayout
      pageTitle="Daily Roll Call & Attendance Register"
      pageSubtitle="Mark attendance by class section with live guardian portal synchronization"
    >
      <div className="space-y-6">

        {/* Controls Card */}
        <Card className="p-5 bg-[#181827] border-[#2a2a3e] flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-4">
            <div className="w-48">
              <label className="block text-[11px] font-semibold text-slate-400 mb-1">Select Class</label>
              <select
                value={selectedClass}
                onChange={e => setSelectedClass(e.target.value)}
                className="w-full bg-[#131320] border border-[#2a2a3e] rounded-xl px-3 py-2 text-xs text-white"
              >
                <option value="class-1">Grade 11 - STEM & Robotics</option>
                <option value="class-2">Grade 11 - Pre-Med & Genetics</option>
                <option value="class-3">Grade 12 - Senior Honors</option>
              </select>
            </div>

            <div className="w-40">
              <label className="block text-[11px] font-semibold text-slate-400 mb-1">Date</label>
              <input
                type="date"
                value={selectedDate}
                onChange={e => setSelectedDate(e.target.value)}
                className="w-full bg-[#131320] border border-[#2a2a3e] rounded-xl px-3 py-2 text-xs text-white"
              />
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowAddStudent(true)}
              leftIcon={<Plus className="w-3.5 h-3.5" />}
            >
              Add Scholar
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => markAll('present')}
            >
              Mark All Present
            </Button>
            <Button
              variant="primary"
              size="sm"
              isLoading={isSaving}
              onClick={handleSave}
              leftIcon={<Save className="w-3.5 h-3.5" />}
            >
              Save Roll Call
            </Button>
          </div>
        </Card>

        {/* Interactive Roll Table */}
        <Card className="p-0 bg-[#181827] border-[#2a2a3e] overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="bg-[#141422] border-b border-[#2a2a3e] text-slate-400 uppercase text-[10px] font-semibold">
                <tr>
                  <th className="py-3 px-6">Roll #</th>
                  <th className="py-3 px-4">Scholar Name</th>
                  <th className="py-3 px-4 text-center">Status Toggles</th>
                  <th className="py-3 px-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#2a2a3e]/60">
                {roster.map((s) => (
                  <tr key={s.id} className="hover:bg-white/[0.02]">
                    <td className="py-4 px-6 font-mono text-purple-300 font-semibold">{s.roll}</td>
                    <td className="py-4 px-4 font-bold text-white">{s.name}</td>
                    <td className="py-4 px-4">
                      <div className="flex items-center justify-center gap-2">
                        {(['present', 'late', 'leave', 'absent'] as AttendanceStatus[]).map((st) => (
                          <button
                            key={st}
                            type="button"
                            onClick={() => setStatus(s.id, st)}
                            className={`px-3 py-1.5 rounded-lg text-[11px] font-semibold capitalize transition-all ${
                              s.status === st
                                ? st === 'present' ? 'bg-emerald-600 text-white shadow-md' :
                                  st === 'late' ? 'bg-amber-600 text-white shadow-md' :
                                  st === 'leave' ? 'bg-cyan-600 text-white shadow-md' :
                                  'bg-rose-600 text-white shadow-md'
                                : 'bg-white/[0.03] text-slate-400 hover:text-white border border-[#2a2a3e]'
                            }`}
                          >
                            {st}
                          </button>
                        ))}
                      </div>
                    </td>
                    <td className="py-4 px-4 text-right">
                      <button
                        onClick={() => handleRemoveStudent(s.id, s.name)}
                        className="p-1.5 rounded-lg border border-rose-500/30 text-rose-400 hover:bg-rose-500/10 transition-colors"
                        title="Remove scholar from roll call"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>

        {/* Modal: Add Student to Section */}
        {showAddStudent && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
            <div className="w-full max-w-sm bg-[#181829] border border-[#2a2a3e] rounded-2xl shadow-2xl overflow-hidden">
              <div className="p-5 border-b border-[#2a2a3e] flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Plus className="w-5 h-5 text-purple-400" />
                  <h3 className="text-base font-bold text-white">Add Scholar to Section</h3>
                </div>
                <button
                  onClick={() => setShowAddStudent(false)}
                  className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-white/5"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleAddStudent} className="p-5 space-y-4 text-xs">
                <div>
                  <label className="block text-[11px] font-semibold text-slate-300 mb-1">Scholar Full Name *</label>
                  <Input
                    required
                    value={newStudentName}
                    onChange={(e) => setNewStudentName(e.target.value)}
                    placeholder="e.g. Layla Noor"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-300 mb-1">Roll / Student ID</label>
                  <Input
                    value={newStudentRoll}
                    onChange={(e) => setNewStudentRoll(e.target.value)}
                    placeholder="e.g. GA-2026-048"
                  />
                </div>

                <div className="pt-2 flex items-center justify-end gap-2 border-t border-[#2a2a3e]">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => setShowAddStudent(false)}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    variant="primary"
                    size="sm"
                  >
                    Add to Roll Call
                  </Button>
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
              <span className="font-bold text-white block">Attendance Notice</span>
              <span>{toastMessage}</span>
            </div>
          </div>
        )}

      </div>
    </PortalLayout>
  );
};
