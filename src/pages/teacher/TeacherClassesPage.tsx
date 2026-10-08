import React, { useState } from 'react';
import { PortalLayout } from '../../components/layout/PortalLayout';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { Users, BookOpen, Clock, CalendarCheck, Award, FileSpreadsheet } from 'lucide-react';
import { Link } from 'react-router-dom';

export const TeacherClassesPage: React.FC = () => {
  const [selectedClass, setSelectedClass] = useState('cls-1');

  const classes = [
    { id: 'cls-1', name: 'Class 10 (Matric Science - BISE)', code: 'MAT-301', students: 38, schedule: 'Mon-Sat, 08:30 AM' },
    { id: 'cls-2', name: 'FSc Pre-Medical (1st Year)', code: 'HSC-401', students: 44, schedule: 'Mon-Sat, 09:30 AM' },
    { id: 'cls-3', name: 'ICS Computer Science (2nd Year)', code: 'HSC-403', students: 39, schedule: 'Mon-Sat, 11:00 AM' },
  ];

  const rosters: Record<string, { roll: string; name: string; email: string; attendance: string }[]> = {
    'cls-1': [
      { roll: 'GA-10S-042', name: 'Fatima Bibi', email: 'student@girlsacademy.edu.pk', attendance: '96.8%' },
      { roll: 'GA-10S-043', name: 'Ayesha Siddiqui', email: 'ayesha.s@girlsacademy.edu.pk', attendance: '98.0%' },
      { roll: 'GA-10S-044', name: 'Zainab Khan', email: 'zainab.k@girlsacademy.edu.pk', attendance: '95.5%' },
      { roll: 'GA-10S-045', name: 'Maryam Nawaz', email: 'maryam.n@girlsacademy.edu.pk', attendance: '100%' },
    ],
    'cls-2': [
      { roll: 'GA-11M-011', name: 'Khadija Rehman', email: 'khadija.r@girlsacademy.edu.pk', attendance: '94.2%' },
      { roll: 'GA-11M-012', name: 'Fatima Zahra', email: 'fatima.z@girlsacademy.edu.pk', attendance: '97.1%' },
    ],
    'cls-3': [
      { roll: 'GA-12C-081', name: 'Hina Sheikh', email: 'hina.s@girlsacademy.edu.pk', attendance: '99.0%' },
      { roll: 'GA-12C-082', name: 'Laiba Tariq', email: 'laiba.t@girlsacademy.edu.pk', attendance: '92.5%' },
    ]
  };

  const currentRoster = rosters[selectedClass] || rosters['cls-1'];

  return (
    <PortalLayout
      pageTitle="Assigned Classes & Student Rosters"
      pageSubtitle="Supervise class sections, weekly schedules, and enrolled student directories"
    >
      <div className="space-y-6">

        {/* Classes Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {classes.map((c) => (
            <Card
              key={c.id}
              onClick={() => setSelectedClass(c.id)}
              className={`p-5 cursor-pointer transition-all ${
                selectedClass === c.id
                  ? 'bg-[#1f1a38] border-purple-500 ring-2 ring-purple-500/30'
                  : 'bg-[#181827] border-[#2a2a3e] hover:border-purple-500/40'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <Badge variant="purple">{c.code}</Badge>
                <span className="text-xs text-purple-300 font-medium">{c.students} Scholars</span>
              </div>
              <h3 className="text-sm font-bold text-white mt-1">{c.name}</h3>
              <p className="text-xs text-slate-400 mt-2 flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-pink-400" /> {c.schedule}
              </p>
            </Card>
          ))}
        </div>

        {/* Selected Roster Table */}
        <Card className="p-0 bg-[#181827] border-[#2a2a3e] overflow-hidden">
          <div className="p-4 sm:p-5 border-b border-[#2a2a3e] flex items-center justify-between">
            <div>
              <h3 className="text-sm font-semibold text-white uppercase tracking-wider">
                Class Roster ({currentRoster.length} Enrolled)
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">Verified via class_enrollments join table</p>
            </div>

            <div className="flex gap-2">
              <Link to="/teacher/attendance">
                <Button variant="primary" size="sm" leftIcon={<CalendarCheck className="w-3.5 h-3.5" />}>
                  Take Attendance
                </Button>
              </Link>
              <Link to="/teacher/results">
                <Button variant="outline" size="sm" leftIcon={<Award className="w-3.5 h-3.5" />}>
                  Enter Grades
                </Button>
              </Link>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="bg-[#141422] border-b border-[#2a2a3e] text-slate-400 uppercase text-[10px] font-semibold">
                <tr>
                  <th className="py-3 px-6">Roll Number</th>
                  <th className="py-3 px-4">Student Name</th>
                  <th className="py-3 px-4">Email</th>
                  <th className="py-3 px-4">Attendance Rate</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#2a2a3e]/60">
                {currentRoster.map((s) => (
                  <tr key={s.roll} className="hover:bg-white/[0.02]">
                    <td className="py-3.5 px-6 font-mono text-purple-300">{s.roll}</td>
                    <td className="py-3.5 px-4 font-bold text-white">{s.name}</td>
                    <td className="py-3.5 px-4 text-slate-400">{s.email}</td>
                    <td className="py-3.5 px-4 font-semibold text-emerald-400">{s.attendance}</td>
                    <td className="py-3.5 px-4 text-right">
                      <Button variant="ghost" size="sm">View Dossier</Button>
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
