import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Users, 
  GraduationCap, 
  BookOpen, 
  FolderPlus, 
  FileText, 
  Settings, 
  ShieldCheck, 
  ArrowRight,
  TrendingUp,
  Clock,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { PortalLayout } from '../../components/layout/PortalLayout';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';

export const AdminDashboard: React.FC = () => {
  const { profile } = useAuth();
  const adminName = profile?.full_name || 'Dr. Clara Beauchamp';

  const stats = [
    { label: 'Total Students', value: '1,450', sub: '+12% from last year', icon: <GraduationCap className="w-5 h-5 text-purple-400" /> },
    { label: 'Faculty Teachers', value: '86', sub: 'Full & Associate Staff', icon: <Users className="w-5 h-5 text-pink-400" /> },
    { label: 'Registered Parents', value: '1,380', sub: 'Verified Guardian Links', icon: <Users className="w-5 h-5 text-cyan-400" /> },
    { label: 'Academic Courses', value: '38', sub: 'STEM, Arts, Languages', icon: <BookOpen className="w-5 h-5 text-indigo-400" /> },
    { label: 'Pending Admissions', value: '14', sub: 'Applications in Review', icon: <FolderPlus className="w-5 h-5 text-amber-400" /> },
    { label: 'Pending Blog Posts', value: '3', sub: 'Awaiting Editorial Approval', icon: <FileText className="w-5 h-5 text-emerald-400" /> },
  ];

  const recentAdmissions = [
    { name: 'Elena Rostova (Jr.)', grade: 'Grade 9 Foundation', date: 'Oct 06, 2026', status: 'Pending Review' },
    { name: 'Chloe Vance', grade: 'Grade 11 Pre-Med', date: 'Oct 05, 2026', status: 'Pending Review' },
    { name: 'Sophia Sterling-Hayes', grade: 'Grade 10 STEM', date: 'Oct 04, 2026', status: 'In Interview' },
  ];

  return (
    <PortalLayout
      pageTitle="Supervisory Command Center"
      pageSubtitle="Institutional oversight, admissions pipeline, curriculum authoring, and security audits"
    >
      <div className="space-y-6">
        
        {/* Welcome Card */}
        <Card className="relative overflow-hidden p-6 sm:p-8 bg-gradient-to-r from-[#22183c] via-[#1b152e] to-[#2b1632] border border-[#442767]">
          <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30 text-[11px] font-semibold mb-2">
                <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
                <span>Super Administrator Privilege Active</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
                Welcome, <span className="text-gradient">{adminName}</span>
              </h2>
              <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-xl">
                All 24 Supabase tables are active with Row Level Security enforced. You have 14 pending admission inquiries to triage.
              </p>
            </div>
            
            {/* Quick action buttons */}
            <div className="flex flex-wrap sm:flex-nowrap items-center gap-2.5">
              <Link to="/admin/admissions">
                <Button variant="primary" size="md" rightIcon={<ArrowRight className="w-4 h-4" />}>
                  Approve Admissions
                </Button>
              </Link>
            </div>
          </div>
        </Card>

        {/* 6 Stat Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {stats.map((s, idx) => (
            <Card key={idx} glassmorphism className="p-5 bg-[#181827] border-[#2a2a3e]">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[11px] sm:text-xs font-semibold text-slate-400 uppercase tracking-wider">{s.label}</span>
                <div className="p-2 rounded-xl bg-white/[0.03] border border-white/5">
                  {s.icon}
                </div>
              </div>
              <div className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">{s.value}</div>
              <div className="text-[10px] sm:text-xs text-slate-400 mt-1">{s.sub}</div>
            </Card>
          ))}
        </div>

        {/* Quick Actions Row */}
        <div>
          <h3 className="text-sm font-semibold text-white uppercase tracking-wider mb-3">
            Administrative Modules
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <Link to="/admin/users" className="p-4 rounded-2xl bg-[#181827] border border-[#2a2a3e] hover:border-purple-500/40 hover:bg-purple-600/10 transition-all text-center flex flex-col items-center gap-2 group">
              <Users className="w-5 h-5 text-purple-400 group-hover:scale-110 transition-transform" />
              <span className="text-xs font-semibold text-white">User Management</span>
            </Link>
            <Link to="/admin/admissions" className="p-4 rounded-2xl bg-[#181827] border border-[#2a2a3e] hover:border-amber-500/40 hover:bg-amber-600/10 transition-all text-center flex flex-col items-center gap-2 group">
              <FolderPlus className="w-5 h-5 text-amber-400 group-hover:scale-110 transition-transform" />
              <span className="text-xs font-semibold text-white">Admissions Desk</span>
            </Link>
            <Link to="/admin/courses" className="p-4 rounded-2xl bg-[#181827] border border-[#2a2a3e] hover:border-pink-500/40 hover:bg-pink-600/10 transition-all text-center flex flex-col items-center gap-2 group">
              <BookOpen className="w-5 h-5 text-pink-400 group-hover:scale-110 transition-transform" />
              <span className="text-xs font-semibold text-white">Course Catalog</span>
            </Link>
            <Link to="/admin/settings" className="p-4 rounded-2xl bg-[#181827] border border-[#2a2a3e] hover:border-cyan-500/40 hover:bg-cyan-600/10 transition-all text-center flex flex-col items-center gap-2 group">
              <Settings className="w-5 h-5 text-cyan-400 group-hover:scale-110 transition-transform" />
              <span className="text-xs font-semibold text-white">Site Settings</span>
            </Link>
          </div>
        </div>

        {/* Two Preview Sections: Recent Admissions & Blog Pending Approval */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* Recent Admissions (7 cols) */}
          <div className="lg:col-span-7 space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold text-white">Recent Admission Inquiries</h3>
              <Link to="/admin/admissions" className="text-xs text-amber-400 hover:text-amber-300">
                All 14 Inquiries →
              </Link>
            </div>

            <div className="space-y-3">
              {recentAdmissions.map((ad, idx) => (
                <Card key={idx} className="p-4 bg-[#181827] border-[#2a2a3e] flex items-center justify-between gap-4">
                  <div>
                    <h4 className="text-xs sm:text-sm font-bold text-white">{ad.name}</h4>
                    <p className="text-[11px] text-slate-400 mt-0.5">{ad.grade} • Received {ad.date}</p>
                  </div>
                  <Badge variant="amber">{ad.status}</Badge>
                </Card>
              ))}
            </div>
          </div>

          {/* Recent Blog Posts Pending Approval (5 cols) */}
          <div className="lg:col-span-5 space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold text-white">Blog Drafts for Review</h3>
              <Link to="/admin/blog" className="text-xs text-purple-400 hover:text-purple-300">
                Editorial Desk →
              </Link>
            </div>

            <Card className="p-5 bg-[#181827] border-[#2a2a3e] space-y-3">
              <div className="p-3 rounded-xl bg-white/[0.02] border border-white/5">
                <span className="text-[10px] text-pink-400 font-semibold uppercase">STEM Department</span>
                <h4 className="text-xs font-bold text-white mt-1">Autonomous Sensor Deployments in Boston Harbor</h4>
                <p className="text-[11px] text-slate-400 mt-0.5">Author: Dr. Elena Rostova</p>
                <div className="mt-2.5 flex items-center gap-2">
                  <Button variant="primary" size="sm">Approve Post</Button>
                  <Button variant="outline" size="sm">Review</Button>
                </div>
              </div>
            </Card>
          </div>

        </div>

      </div>
    </PortalLayout>
  );
};
