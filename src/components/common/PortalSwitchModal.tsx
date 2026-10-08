import React, { useState } from 'react';
import { UserRole } from '../../types';
import { 
  GraduationCap, 
  Users, 
  BookOpen, 
  ShieldCheck, 
  ArrowRight, 
  Lock, 
  Calendar, 
  Award, 
  Video, 
  FileCheck,
  CheckCircle2
} from 'lucide-react';

interface PortalSwitchModalProps {
  isOpen: boolean;
  onClose: () => void;
  activeRole: UserRole | null;
  onSelectRole: (role: UserRole) => void;
}

export const PortalSwitchModal: React.FC<PortalSwitchModalProps> = ({
  isOpen,
  onClose,
  activeRole,
  onSelectRole
}) => {
  const [selectedPreview, setSelectedPreview] = useState<UserRole>('student');

  if (!isOpen) return null;

  const rolesList: {
    id: UserRole;
    name: string;
    badge: string;
    icon: React.ReactNode;
    color: string;
    border: string;
    description: string;
    features: string[];
  }[] = [
    {
      id: 'student',
      name: 'Student Portal',
      badge: 'Academic Hub',
      icon: <GraduationCap className="w-6 h-6 text-pink-400" />,
      color: 'from-pink-500/20 to-purple-500/10',
      border: 'border-pink-500/30',
      description: 'Centralized desk for registered academy scholars to access course materials, watch lectures, and view real-time grades.',
      features: [
        'Enrolled course syllabi & lecture slides',
        'Video lecture library (streamed & unlisted archives)',
        'Personal attendance breakdown & absence excuses',
        'Semester term report card & GPA breakdown'
      ]
    },
    {
      id: 'parent',
      name: 'Parent Portal',
      badge: 'Guardian Connect',
      icon: <Users className="w-6 h-6 text-cyan-400" />,
      color: 'from-cyan-500/20 to-blue-500/10',
      border: 'border-cyan-500/30',
      description: 'Secure window for guardians linked via the parent_students join table to monitor their daughters’ scholastic growth.',
      features: [
        'Multi-child switcher (single parent account linked to multiple daughters)',
        'Daily and monthly attendance statistics',
        'Published exam results & faculty commentary',
        'Fee structure invoices & online tuition settlements'
      ]
    },
    {
      id: 'teacher',
      name: 'Teacher / Faculty Portal',
      badge: 'Instruction Desk',
      icon: <BookOpen className="w-6 h-6 text-violet-400" />,
      color: 'from-violet-500/20 to-purple-500/10',
      border: 'border-violet-500/30',
      description: 'Streamlined workspace for professors to log lecture attendance, evaluate exams, and host digital study resources.',
      features: [
        'One-click daily attendance marking by class section',
        'Gradebook entry with configurable grading weights',
        'Video lecture uploads & external stream linking',
        'Publish departmental blogs and study advisories'
      ]
    },
    {
      id: 'admin',
      name: 'Admin Command Center',
      badge: 'Master Control',
      icon: <ShieldCheck className="w-6 h-6 text-amber-400" />,
      color: 'from-amber-500/20 to-rose-500/10',
      border: 'border-amber-500/30',
      description: 'Full supervisory authority to manage system parameters, enrollments, admissions pipeline, and staff rosters.',
      features: [
        'Site configuration & academic term manager',
        'Admissions pipeline & student application triage',
        'Course catalog & curriculum authoring',
        'User management (service-role accounts, RLS security audit)'
      ]
    }
  ];

  const currentRoleObj = rolesList.find(r => r.id === selectedPreview)!;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fade-in">
      <div 
        className="relative w-full max-w-4xl max-h-[92vh] overflow-y-auto bg-[#131320] border border-white/10 rounded-2xl p-6 md:p-8 shadow-2xl text-slate-200"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between pb-4 border-b border-white/10">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs uppercase tracking-wider font-semibold text-purple-400">Architecture Preview</span>
              <span className="text-[11px] px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/30">
                Phase 2 Auth Foundation
              </span>
            </div>
            <h2 className="text-xl md:text-2xl font-bold text-white mt-1">
              Girls Academy Role-Based Portals
            </h2>
            <p className="text-xs md:text-sm text-slate-400 mt-0.5">
              Select any role to preview its designated workflows and interfaces.
            </p>
          </div>
          <button 
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white rounded-lg hover:bg-white/5 transition-colors"
          >
            ✕
          </button>
        </div>

        {/* 4 Role Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-6">
          {rolesList.map((role) => {
            const isSelected = selectedPreview === role.id;
            const isCurrentActive = activeRole === role.id;
            return (
              <button
                key={role.id}
                onClick={() => setSelectedPreview(role.id)}
                className={`flex flex-col text-left p-4 rounded-xl border transition-all relative overflow-hidden ${
                  isSelected 
                    ? `bg-gradient-to-b ${role.color} ${role.border} ring-2 ring-purple-500/50 shadow-lg` 
                    : 'bg-white/[0.03] border-white/10 hover:border-white/20'
                }`}
              >
                {isCurrentActive && (
                  <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-emerald-400 ring-4 ring-emerald-400/20"></span>
                )}
                <div className="mb-3">{role.icon}</div>
                <div className="text-xs font-semibold text-purple-300 uppercase tracking-wider text-[10px]">{role.badge}</div>
                <div className="text-sm font-bold text-white mt-0.5">{role.name}</div>
              </button>
            );
          })}
        </div>

        {/* Detail View of Selected Role */}
        <div className="mt-6 p-6 rounded-2xl bg-white/[0.02] border border-white/10">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-white/10">
            <div>
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-lg bg-white/5 border border-white/10">
                  {currentRoleObj.icon}
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white">{currentRoleObj.name}</h3>
                  <p className="text-xs text-slate-400">{currentRoleObj.description}</p>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={() => {
                  onSelectRole(currentRoleObj.id);
                  onClose();
                }}
                className="gradient-btn px-4 py-2 rounded-xl text-xs font-semibold text-white flex items-center gap-2"
              >
                Enter {currentRoleObj.name} Preview
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          <div className="mt-5">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-3">
              Core Capabilities in this Portal
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {currentRoleObj.features.map((feat, idx) => (
                <div key={idx} className="flex items-start gap-2.5 p-3 rounded-xl bg-black/30 border border-white/5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span className="text-xs text-slate-300">{feat}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Mock Peek Card */}
          <div className="mt-5 p-4 rounded-xl bg-purple-950/20 border border-purple-500/20 flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="flex items-center gap-3 text-xs text-purple-200">
              <Lock className="w-4 h-4 text-purple-400 shrink-0" />
              <span>
                <strong>Upcoming Phase 2:</strong> Live Supabase Auth with Row Level Security, email/password credentials, password reset, and role verification.
              </span>
            </div>
          </div>
        </div>

        <div className="mt-6 flex items-center justify-between text-xs text-slate-400">
          <span>Security: Protected by PostgreSQL Row Level Security (RLS)</span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-slate-300 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
