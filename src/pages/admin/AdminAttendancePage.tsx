import React, { useState, useEffect } from 'react';
import { PortalLayout } from '../../components/layout/PortalLayout';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { 
  CalendarCheck, 
  Download, 
  Users, 
  AlertTriangle, 
  CheckCircle2, 
  Clock, 
  TrendingUp,
  Plus,
  X,
  Calendar,
  Trash2,
  Search,
  UserCheck
} from 'lucide-react';
import { 
  fetchAllAttendance, 
  markClassAttendance, 
  fetchAllUsers,
  deleteAttendanceRecord
} from '../../lib/dataService';
import { fetchAllAdmissions } from '../../lib/admissions';
import { Attendance, AttendanceStatus, Profile, Admission } from '../../types';

export const AdminAttendancePage: React.FC = () => {
  const [attendanceRecords, setAttendanceRecords] = useState<Attendance[]>([]);
  const [students, setStudents] = useState<Profile[]>([]);
  const [admissions, setAdmissions] = useState<Admission[]>([]);
  const [selectedDate, setSelectedDate] = useState('2026-10-07');
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Mark Attendance Modal
  const [showMarkModal, setShowMarkModal] = useState(false);
  const [markStudentId, setMarkStudentId] = useState('demo-student-uid-3');
  const [markClassId, setMarkClassId] = useState('cls-10-sci');
  const [markDate, setMarkDate] = useState(new Date().toISOString().split('T')[0]);
  const [markStatus, setMarkStatus] = useState<AttendanceStatus>('present');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const loadData = async () => {
    setIsLoading(true);
    try {
      const [att, stu, adm] = await Promise.all([
        fetchAllAttendance(),
        fetchAllUsers('student'),
        fetchAllAdmissions()
      ]);
      setAttendanceRecords(att);
      setStudents(stu);
      setAdmissions(adm);
    } catch (err) {
      console.error('Error loading attendance or admissions:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const getStudentMeta = (studentId: string) => {
    const s = students.find(u => u.id === studentId);
    if (s) {
      return {
        name: s.full_name,
        email: s.email,
        type: 'Enrolled Scholar',
        badgeVariant: 'purple' as const
      };
    }
    const a = admissions.find(adm => adm.id === studentId);
    if (a) {
      return {
        name: a.student_name,
        email: a.email,
        type: `Admitted Applicant (${a.program_applied || 'New'})`,
        badgeVariant: 'emerald' as const
      };
    }
    return {
      name: studentId,
      email: '',
      type: 'Direct Register',
      badgeVariant: 'slate' as const
    };
  };

  const classBreakdown = [
    { name: 'Grade 11 - STEM & Robotics', enrolled: 28, present: 27, late: 1, rate: '96.4%' },
    { name: 'Grade 11 - Pre-Med & Genetics', enrolled: 26, present: 25, late: 0, rate: '96.1%' },
    { name: 'Grade 12 - Senior Honors', enrolled: 30, present: 29, late: 1, rate: '96.6%' },
    { name: 'Grade 10 - Global Commerce', enrolled: 24, present: 23, late: 0, rate: '95.8%' },
    { name: 'Grade 9 - Foundation Science', enrolled: 32, present: 31, late: 1, rate: '96.8%' },
  ];

  const chronicAbsenceFlags = [
    { name: 'Sienna Bradley', class: 'Grade 10 Commerce', rate: '82.4%', absences: 8, parent: 'Mark Bradley (+92 300 555-901)' },
    { name: 'Kinsley Ward', class: 'Grade 9 Foundation', rate: '84.0%', absences: 7, parent: 'Helen Ward (+92 300 555-902)' },
  ];

  const handleExportCSV = () => {
    const csvContent = "data:text/csv;charset=utf-8," +
      "Date,Class,Student Name,Student ID,Type,Status\n" +
      attendanceRecords.map(r => {
        const meta = getStudentMeta(r.student_id);
        return `"${r.date}","${r.class_id || 'N/A'}","${meta.name}","${r.student_id}","${meta.type}","${r.status}"`;
      }).join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `girls_academy_attendance_${selectedDate}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleMarkAttendance = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await markClassAttendance([{
        student_id: markStudentId,
        class_id: markClassId,
        date: markDate,
        status: markStatus,
        marked_by: 'Academic Registrar'
      }]);

      const meta = getStudentMeta(markStudentId);
      setToastMessage(`Attendance for "${meta.name}" (${meta.type}) recorded as "${markStatus.toUpperCase()}" on ${markDate}!`);
      setShowMarkModal(false);
      await loadData();
      setTimeout(() => setToastMessage(null), 3500);
    } catch (err: any) {
      alert('Error recording attendance: ' + err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteRecord = async (recordId: string, scholarName: string) => {
    if (!window.confirm(`Delete attendance log for ${scholarName}?`)) return;
    try {
      await deleteAttendanceRecord(recordId);
      setAttendanceRecords(prev => prev.filter(r => r.id !== recordId));
      setToastMessage(`Attendance record removed successfully.`);
      setTimeout(() => setToastMessage(null), 3000);
    } catch (err) {
      console.error(err);
    }
  };

  const filteredAttendance = attendanceRecords.filter(r => {
    const meta = getStudentMeta(r.student_id);
    const q = searchQuery.toLowerCase();
    const matchesSearch = !q || meta.name.toLowerCase().includes(q) || meta.email.toLowerCase().includes(q) || r.student_id.toLowerCase().includes(q);
    const matchesDate = !selectedDate || r.date === selectedDate;
    return matchesSearch && matchesDate;
  });

  return (
    <PortalLayout
      pageTitle="Academy Attendance & Roll-Call Governance"
      pageSubtitle="Supervise daily scholar & admission roll-calls, record attendance for all applicants, and export logs"
    >
      <div className="space-y-6">

        {/* Toast Alert */}
        {toastMessage && (
          <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 flex items-center gap-2 text-xs font-semibold animate-fade-in">
            <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-400" />
            <span>{toastMessage}</span>
          </div>
        )}

        {/* 4 Overview Metrics */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="p-5 bg-[#181827] border-[#2a2a3e]">
            <div className="flex items-center justify-between text-slate-400 mb-2">
              <span className="text-xs font-semibold uppercase">Daily Attendance</span>
              <CalendarCheck className="w-4 h-4 text-emerald-400" />
            </div>
            <div className="text-2xl sm:text-3xl font-extrabold text-white">96.3%</div>
            <div className="text-[11px] text-emerald-400 mt-1 flex items-center gap-1">
              <TrendingUp className="w-3.5 h-3.5" /> High campus attendance rate
            </div>
          </Card>

          <Card className="p-5 bg-[#181827] border-[#2a2a3e]">
            <div className="flex items-center justify-between text-slate-400 mb-2">
              <span className="text-xs font-semibold uppercase">Total Scholars & Admissions</span>
              <Users className="w-4 h-4 text-purple-400" />
            </div>
            <div className="text-2xl sm:text-3xl font-extrabold text-purple-400">
              {students.length + admissions.length}
            </div>
            <div className="text-[11px] text-slate-400 mt-1">
              {students.length} Enrolled • {admissions.length} Admissions
            </div>
          </Card>

          <Card className="p-5 bg-[#181827] border-[#2a2a3e]">
            <div className="flex items-center justify-between text-slate-400 mb-2">
              <span className="text-xs font-semibold uppercase">Attendance Logs</span>
              <Clock className="w-4 h-4 text-cyan-400" />
            </div>
            <div className="text-2xl sm:text-3xl font-extrabold text-cyan-400">
              {attendanceRecords.length}
            </div>
            <div className="text-[11px] text-slate-400 mt-1">Total recorded sessions</div>
          </Card>

          <Card className="p-5 bg-[#181827] border-[#2a2a3e]">
            <div className="flex items-center justify-between text-slate-400 mb-2">
              <span className="text-xs font-semibold uppercase">Intervention Flags</span>
              <AlertTriangle className="w-4 h-4 text-amber-400" />
            </div>
            <div className="text-2xl sm:text-3xl font-extrabold text-amber-400">2</div>
            <div className="text-[11px] text-slate-400 mt-1">Scholars &lt; 85% threshold</div>
          </Card>
        </div>

        {/* Date Filter & Control Bar */}
        <Card className="p-4 bg-[#181827] border-[#2a2a3e] flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-slate-300">Filter Date:</span>
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="bg-[#11111d] border border-[#2a2a3e] rounded-xl px-3 py-1.5 text-xs text-white focus:outline-none focus:border-purple-500"
              />
              {selectedDate && (
                <button
                  onClick={() => setSelectedDate('')}
                  className="text-[11px] text-purple-400 hover:text-purple-300 underline"
                >
                  Show All Dates
                </button>
              )}
            </div>

            <div className="relative">
              <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-slate-500" />
              <input
                type="text"
                placeholder="Search scholar / applicant..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="bg-[#11111d] border border-[#2a2a3e] rounded-xl pl-8 pr-3 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-purple-500"
              />
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Button
              variant="primary"
              size="sm"
              onClick={() => setShowMarkModal(true)}
              leftIcon={<Plus className="w-4 h-4" />}
              className="bg-purple-600 hover:bg-purple-500 text-white"
            >
              + Record Attendance (Student / Admission)
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handleExportCSV}
              leftIcon={<Download className="w-4 h-4" />}
            >
              Export CSV
            </Button>
          </div>
        </Card>

        {/* Real-time Roll-Call Records Log Table */}
        <Card className="p-0 overflow-hidden bg-[#181827] border-[#2a2a3e]">
          <div className="p-4 border-b border-[#2a2a3e] flex items-center justify-between">
            <div className="flex items-center gap-2">
              <CalendarCheck className="w-4 h-4 text-purple-400" />
              <h3 className="text-sm font-bold text-white">Individual Scholar & Admission Attendance Log</h3>
            </div>
            <span className="text-xs text-slate-400">
              Showing {filteredAttendance.length} records {selectedDate ? `for ${selectedDate}` : '(all dates)'}
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#12121f] text-slate-400 uppercase tracking-wider text-[10px] border-b border-[#2a2a3e]">
                <tr>
                  <th className="p-4 font-semibold">Scholar / Applicant</th>
                  <th className="p-4 font-semibold">Category / Track</th>
                  <th className="p-4 font-semibold text-center">Date</th>
                  <th className="p-4 font-semibold text-center">Status</th>
                  <th className="p-4 font-semibold text-center">Class / Section</th>
                  <th className="p-4 font-semibold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#2a2a3e]">
                {filteredAttendance.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="p-8 text-center text-slate-400">
                      No attendance records found {selectedDate ? `for ${selectedDate}` : ''}. 
                      Click <strong className="text-purple-400 cursor-pointer" onClick={() => setShowMarkModal(true)}>+ Record Attendance</strong> to add student or admission roll-calls.
                    </td>
                  </tr>
                ) : (
                  filteredAttendance.map((record) => {
                    const meta = getStudentMeta(record.student_id);
                    return (
                      <tr key={record.id} className="hover:bg-white/[0.02] transition-colors">
                        <td className="p-4">
                          <div className="font-bold text-white text-xs">{meta.name}</div>
                          {meta.email && (
                            <div className="text-[10px] text-slate-400">{meta.email}</div>
                          )}
                          <div className="text-[10px] text-slate-500 font-mono">ID: {record.student_id}</div>
                        </td>
                        <td className="p-4">
                          <Badge variant={meta.badgeVariant} size="sm">
                            {meta.type}
                          </Badge>
                        </td>
                        <td className="p-4 text-center font-mono text-slate-300">
                          {record.date}
                        </td>
                        <td className="p-4 text-center">
                          <Badge
                            variant={
                              record.status === 'present' ? 'emerald' :
                              record.status === 'late' ? 'amber' :
                              record.status === 'leave' ? 'purple' : 'slate'
                            }
                            size="sm"
                          >
                            {record.status.toUpperCase()}
                          </Badge>
                        </td>
                        <td className="p-4 text-center font-mono text-slate-400 text-[11px]">
                          {record.class_id || 'Campus Roll-Call'}
                        </td>
                        <td className="p-4 text-right">
                          <button
                            onClick={() => handleDeleteRecord(record.id, meta.name)}
                            className="p-1.5 rounded-lg border border-rose-500/20 text-rose-400 hover:bg-rose-500/10 transition-colors"
                            title="Delete this attendance record"
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

        {/* Breakdown by Class Sections */}
        <Card className="p-0 overflow-hidden bg-[#181827] border-[#2a2a3e]">
          <div className="p-4 border-b border-[#2a2a3e] flex items-center justify-between">
            <h3 className="text-sm font-bold text-white">Class Section Roll-Call Breakdown</h3>
            <span className="text-xs text-slate-400">Term: Fall 2026</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#12121f] text-slate-400 uppercase tracking-wider text-[10px] border-b border-[#2a2a3e]">
                <tr>
                  <th className="p-4 font-semibold">Class Section</th>
                  <th className="p-4 font-semibold text-center">Enrolled</th>
                  <th className="p-4 font-semibold text-center">Present</th>
                  <th className="p-4 font-semibold text-center">Late</th>
                  <th className="p-4 font-semibold text-center">Daily Rate</th>
                  <th className="p-4 font-semibold text-center">Audit Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#2a2a3e]">
                {classBreakdown.map((c, idx) => (
                  <tr key={idx} className="hover:bg-white/[0.02] transition-colors">
                    <td className="p-4 font-bold text-white">{c.name}</td>
                    <td className="p-4 text-center font-mono text-slate-300">{c.enrolled}</td>
                    <td className="p-4 text-center font-mono text-emerald-400 font-bold">{c.present}</td>
                    <td className="p-4 text-center font-mono text-amber-400">{c.late}</td>
                    <td className="p-4 text-center">
                      <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-300 font-mono font-bold text-[11px] border border-emerald-500/20">
                        {c.rate}
                      </span>
                    </td>
                    <td className="p-4 text-center">
                      <span className="inline-flex items-center gap-1 text-[11px] text-emerald-400">
                        <CheckCircle2 className="w-3.5 h-3.5" /> Verified
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>

        {/* Chronic Absence Flags Table */}
        <Card className="p-5 bg-[#181827] border-amber-500/30 space-y-3">
          <div className="flex items-center gap-2 text-amber-400">
            <AlertTriangle className="w-5 h-5 shrink-0" />
            <h3 className="text-sm font-bold">Chronic Absenteeism Intervention Queue (&lt;85%)</h3>
          </div>
          <p className="text-xs text-slate-300">
            The regulatory threshold requires guardian outreach and academic dean review for students falling below 85% attendance.
          </p>

          <div className="divide-y divide-[#2a2a3e] pt-2">
            {chronicAbsenceFlags.map((flag, idx) => (
              <div key={idx} className="py-3 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                <div>
                  <div className="font-bold text-white text-xs">{flag.name}</div>
                  <div className="text-[11px] text-slate-400">{flag.class} • Guardian: {flag.parent}</div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="text-right">
                    <span className="text-rose-400 font-mono font-bold text-xs">{flag.rate}</span>
                    <span className="text-[10px] text-slate-500 block">({flag.absences} unexcused absences)</span>
                  </div>
                  <Button variant="outline" size="sm" className="text-xs border-amber-500/40 text-amber-300 hover:bg-amber-500/10">
                    Notify Guardian
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Modal: Record Attendance (Enrolled Students + Admissions) */}
        {showMarkModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
            <div className="w-full max-w-md bg-[#181829] border border-purple-500/30 rounded-2xl shadow-2xl overflow-hidden">
              <div className="p-5 border-b border-[#2a2a3e] flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <CalendarCheck className="w-5 h-5 text-purple-400" />
                  <h3 className="text-base font-bold text-white">Record Scholar / Admission Attendance</h3>
                </div>
                <button
                  onClick={() => setShowMarkModal(false)}
                  className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-white/5"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleMarkAttendance} className="p-5 space-y-4 text-xs">
                <div>
                  <label className="block text-[11px] font-semibold text-slate-300 mb-1">
                    Target Scholar or Admitted Applicant *
                  </label>
                  <select
                    value={markStudentId}
                    onChange={(e) => setMarkStudentId(e.target.value)}
                    className="w-full bg-[#11111d] border border-[#2a2a3e] rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-purple-500"
                  >
                    <optgroup label="Admitted Applicants & New Admissions">
                      {admissions.map(adm => (
                        <option key={adm.id} value={adm.id}>
                          {adm.student_name} ({adm.program_applied || 'New Admission'}) — [Admitted / Applicant]
                        </option>
                      ))}
                    </optgroup>
                    <optgroup label="Enrolled Regular Scholars">
                      <option value="demo-student-uid-3">Fatima Bibi (GA-10S-042)</option>
                      {students.filter(s => s.id !== 'demo-student-uid-3').map(s => (
                        <option key={s.id} value={s.id}>{s.full_name} ({s.email})</option>
                      ))}
                    </optgroup>
                  </select>
                  <span className="text-[10px] text-slate-400 mt-1 block">
                    You can record attendance for registered students AND any admitted applicants!
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-300 mb-1">Attendance Date *</label>
                    <input
                      type="date"
                      required
                      value={markDate}
                      onChange={(e) => setMarkDate(e.target.value)}
                      className="w-full bg-[#11111d] border border-[#2a2a3e] rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-purple-500"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-slate-300 mb-1">Status *</label>
                    <select
                      value={markStatus}
                      onChange={(e) => setMarkStatus(e.target.value as AttendanceStatus)}
                      className="w-full bg-[#11111d] border border-[#2a2a3e] rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-purple-500"
                    >
                      <option value="present">Present (On-Time)</option>
                      <option value="late">Late Arrival</option>
                      <option value="leave">Approved Leave / Excused</option>
                      <option value="absent">Unexcused Absent</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-300 mb-1">Class Section / Batch</label>
                  <select
                    value={markClassId}
                    onChange={(e) => setMarkClassId(e.target.value)}
                    className="w-full bg-[#11111d] border border-[#2a2a3e] rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-purple-500"
                  >
                    <option value="cls-10-sci">Class 10 — Matric Science (Sec Rose)</option>
                    <option value="cls-9-sci">Class 9 — Matric Science (Sec Tulip)</option>
                    <option value="cls-11-med">FSc 1st Year — Pre-Medical</option>
                    <option value="cls-12-eng">FSc 2nd Year — Pre-Engineering</option>
                    <option value="cls-admissions-orientation">New Admissions Orientation Batch 2026-2027</option>
                  </select>
                </div>

                <div className="pt-2 flex items-center justify-end gap-2 border-t border-[#2a2a3e]">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => setShowMarkModal(false)}
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
                    Confirm & Record
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
