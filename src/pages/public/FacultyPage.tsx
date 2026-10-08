import React, { useState, useEffect } from 'react';
import { Mail, GraduationCap, Award, BookOpen, Sparkles } from 'lucide-react';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { SectionTitle } from '../../components/ui/SectionTitle';
import { fetchFacultyMembers } from '../../lib/dataService';

export const FacultyPage: React.FC = () => {
  const [faculty, setFaculty] = useState<any[]>([]);
  const [selectedDept, setSelectedDept] = useState('All');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    async function load() {
      try {
        const members = await fetchFacultyMembers();
        if (mounted && members) {
          setFaculty(members);
        }
      } catch (err) {
        console.warn('Error fetching faculty:', err);
      } finally {
        if (mounted) setLoading(false);
      }
    }
    load();
    return () => { mounted = false; };
  }, []);

  const departments = ['All', 'Science', 'Computer Science', 'Humanities', 'Commerce', 'Academic Leadership'];

  const filteredFaculty = selectedDept === 'All' 
    ? faculty 
    : faculty.filter(f => (f.department || '').toLowerCase().includes(selectedDept.toLowerCase()) || selectedDept.toLowerCase().includes((f.department || '').toLowerCase()));

  return (
    <div className="py-12 sm:py-16 space-y-16">
      {/* Hero */}
      <section className="px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto rounded-3xl bg-gradient-to-r from-[#171426] via-[#151522] to-[#201328] border border-[#2a2a3e] p-8 sm:p-14 text-center relative overflow-hidden">
          <div className="relative z-10 max-w-3xl mx-auto space-y-4">
            <span className="text-xs uppercase tracking-widest font-semibold px-3 py-1 rounded-full bg-purple-500/15 text-purple-300 border border-purple-500/30">
              Distinguished Faculty & Academic Mentors
            </span>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight">
              Distinguished <span className="text-gradient">Faculty & Mentors</span>
            </h1>
            <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
              Our distinguished female faculty members are devoted to scientific rigor, moral integrity, and stellar board examination success.
            </p>
          </div>
        </div>
      </section>

      {/* Department Filter */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-wrap items-center justify-center gap-2">
          {departments.map((dept) => (
            <button
              key={dept}
              onClick={() => setSelectedDept(dept)}
              className={`px-4 py-2 rounded-xl text-xs font-medium transition-all ${
                selectedDept === dept
                  ? 'bg-purple-600 text-white shadow-lg shadow-purple-900/30'
                  : 'bg-[#181827] text-slate-300 border border-[#2a2a3e] hover:border-purple-500/40'
              }`}
            >
              {dept}
            </button>
          ))}
        </div>
      </section>

      {/* Faculty Cards Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {filteredFaculty.map((member) => (
            <Card
              key={member.id}
              hoverable
              className="p-6 bg-[#181827] border-[#2a2a3e] flex flex-col justify-between group"
            >
              <div>
                <div className="flex items-center gap-4 mb-4">
                  <img
                    src={member.photo_url || member.avatar_url || 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=400&q=80'}
                    alt={member.full_name || member.name}
                    className="w-16 h-16 rounded-2xl object-cover border-2 border-purple-500/30 group-hover:border-purple-400 transition-colors shrink-0"
                  />
                  <div>
                    <h3 className="text-lg font-bold text-white group-hover:text-purple-300 transition-colors">
                      {member.full_name || member.name}
                    </h3>
                    <p className="text-xs text-purple-300 font-medium">{member.department || 'Faculty Teacher'}</p>
                    <span className="text-[11px] text-slate-400 block mt-0.5">{member.role === 'teacher' ? 'Teaching Faculty' : 'Senior Instructor'}</span>
                  </div>
                </div>

                <div className="space-y-3 text-xs text-slate-300">
                  <div className="p-3 rounded-xl bg-white/[0.02] border border-[#2a2a3e]">
                    <span className="text-slate-400 block text-[10px] uppercase font-semibold">Academic Credentials</span>
                    <span className="text-white font-medium mt-0.5 block">{member.qualification || member.qualifications || 'M.Phil / Master Degree'}</span>
                  </div>
                  {member.experience && (
                    <div className="text-[11px] text-slate-400 flex items-center gap-1.5">
                      <GraduationCap className="w-3.5 h-3.5 text-pink-400" />
                      <span>Experience: {member.experience}</span>
                    </div>
                  )}
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-[#2a2a3e] flex items-center justify-between text-xs text-slate-400">
                <span className="flex items-center gap-1.5">
                  <Award className="w-4 h-4 text-purple-400" />
                  Verified Faculty
                </span>
                {member.email && (
                  <a
                    href={`mailto:${member.email}`}
                    className="flex items-center gap-1 text-purple-400 hover:text-purple-300 transition-colors"
                  >
                    <Mail className="w-3.5 h-3.5" /> Email
                  </a>
                )}
              </div>
            </Card>
          ))}
        </div>
      </section>
    </div>
  );
};
