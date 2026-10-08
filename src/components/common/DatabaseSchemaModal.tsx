import React, { useState } from 'react';
import { Database, Check, Copy, Shield, Server, CheckCircle2, AlertCircle } from 'lucide-react';
import { isSupabaseConfigured } from '../../lib/supabase';

interface DatabaseSchemaModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const DatabaseSchemaModal: React.FC<DatabaseSchemaModalProps> = ({ isOpen, onClose }) => {
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState<'tables' | 'sql' | 'cms_sql' | 'rls'>('tables');

  if (!isOpen) return null;

  const cmsSqlCode = `-- =========================================================================
-- GIRLS ACADEMY - FULLY DYNAMIC WEBSITE CMS MIGRATION
-- Run this in Supabase SQL Editor
-- =========================================================================

-- 1. BANNERS TABLE
create table if not exists banners (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  subtitle text,
  image_url text,
  button_text text,
  button_link text,
  position integer default 0,
  is_active boolean default true,
  page text default 'home',
  created_at timestamptz default now()
);

-- 2. SOCIAL MEDIA ACCOUNTS TABLE
create table if not exists social_media (
  id uuid primary key default gen_random_uuid(),
  platform text not null,
  url text not null,
  icon text not null,
  followers_count text,
  is_active boolean default true,
  position integer default 0,
  created_at timestamptz default now()
);

-- 3. HERO SLIDES TABLE
create table if not exists hero_slides (
  id uuid primary key default gen_random_uuid(),
  heading text not null,
  subheading text,
  description text,
  image_url text,
  button1_text text,
  button1_link text,
  button2_text text,
  button2_link text,
  is_active boolean default true,
  position integer default 0,
  created_at timestamptz default now()
);

-- 4. CORE VALUES TABLE
create table if not exists core_values (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text,
  icon text,
  position integer default 0,
  is_active boolean default true
);

-- 5. ACHIEVEMENTS TABLE
create table if not exists achievements (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text,
  year text,
  icon text,
  is_active boolean default true,
  position integer default 0
);

-- 6. QUICK STATS TABLE
create table if not exists quick_stats (
  id uuid primary key default gen_random_uuid(),
  label text not null,
  value text not null,
  icon text,
  position integer default 0,
  is_active boolean default true
);

-- 7. ANNOUNCEMENTS TICKER TABLE
create table if not exists announcements (
  id uuid primary key default gen_random_uuid(),
  text text not null,
  link text,
  is_active boolean default true,
  expires_at timestamptz,
  created_at timestamptz default now()
);

-- 8. POPUP / MODAL ADS TABLE
create table if not exists popups (
  id uuid primary key default gen_random_uuid(),
  title text,
  message text,
  image_url text,
  button_text text,
  button_link text,
  is_active boolean default true,
  show_once boolean default true,
  created_at timestamptz default now()
);

-- Enable RLS & Policies
alter table banners enable row level security;
alter table social_media enable row level security;
alter table hero_slides enable row level security;
alter table core_values enable row level security;
alter table achievements enable row level security;
alter table quick_stats enable row level security;
alter table announcements enable row level security;
alter table popups enable row level security;

create policy "Public read banners" on banners for select using (is_active = true);
create policy "Public read social media" on social_media for select using (is_active = true);
create policy "Public read hero slides" on hero_slides for select using (is_active = true);
create policy "Public read core values" on core_values for select using (is_active = true);
create policy "Public read achievements" on achievements for select using (is_active = true);
create policy "Public read quick stats" on quick_stats for select using (is_active = true);
create policy "Public read announcements" on announcements for select using (is_active = true);
create policy "Public read popups" on popups for select using (is_active = true);

create policy "Admin manage banners" on banners for all using (
  exists (select 1 from profiles where id = auth.uid() and role = 'admin'));
create policy "Admin manage social media" on social_media for all using (
  exists (select 1 from profiles where id = auth.uid() and role = 'admin'));
create policy "Admin manage hero slides" on hero_slides for all using (
  exists (select 1 from profiles where id = auth.uid() and role = 'admin'));
create policy "Admin manage core values" on core_values for all using (
  exists (select 1 from profiles where id = auth.uid() and role = 'admin'));
create policy "Admin manage achievements" on achievements for all using (
  exists (select 1 from profiles where id = auth.uid() and role = 'admin'));
create policy "Admin manage quick stats" on quick_stats for all using (
  exists (select 1 from profiles where id = auth.uid() and role = 'admin'));
create policy "Admin manage announcements" on announcements for all using (
  exists (select 1 from profiles where id = auth.uid() and role = 'admin'));
create policy "Admin manage popups" on popups for all using (
  exists (select 1 from profiles where id = auth.uid() and role = 'admin'));`;

  const sqlCode = `-- Phase 1 Schema for Girls Academy
CREATE TABLE IF NOT EXISTS public.site_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  school_name TEXT NOT NULL,
  tagline TEXT,
  admissions_open BOOLEAN DEFAULT true,
  academic_year TEXT DEFAULT '2026-2027',
  contact_email TEXT,
  contact_phone TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.courses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  code TEXT NOT NULL UNIQUE,
  title TEXT NOT NULL,
  category TEXT NOT NULL,
  grade_level TEXT NOT NULL,
  duration TEXT NOT NULL,
  credits INT DEFAULT 4,
  instructor_name TEXT NOT NULL,
  capacity INT DEFAULT 30,
  enrolled INT DEFAULT 0,
  image_url TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS public.events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  category TEXT NOT NULL,
  date DATE NOT NULL,
  time TEXT NOT NULL,
  location TEXT NOT NULL,
  rsvp_required BOOLEAN DEFAULT true,
  registered_count INT DEFAULT 0
);

CREATE TABLE IF NOT EXISTS public.admissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_name TEXT NOT NULL,
  parent_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  grade_applying_for TEXT NOT NULL,
  status TEXT DEFAULT 'new'
);

-- RLS Enforcement
ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.courses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.admissions ENABLE ROW LEVEL SECURITY;`;

  const copySql = () => {
    navigator.clipboard.writeText(sqlCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
      <div 
        className="relative w-full max-w-3xl max-h-[90vh] overflow-y-auto bg-[#141420] border border-purple-500/30 rounded-2xl p-6 shadow-2xl text-slate-200"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between pb-4 border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-purple-500/10 text-purple-400 border border-purple-500/20">
              <Database className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                Supabase Architecture & Schema
                <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-pink-500/20 text-pink-300 border border-pink-500/30">
                  Phase 1–3 Complete
                </span>
              </h2>
              <p className="text-xs text-slate-400">PostgreSQL backend with Row-Level Security (RLS) & Auth Triggers</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-white/5 transition-colors"
          >
            ✕
          </button>
        </div>

        {/* Supabase Status Banner */}
        <div className="mt-4 p-4 rounded-xl bg-white/[0.03] border border-white/10 flex items-start justify-between gap-4">
          <div className="flex items-start gap-3">
            <Server className="w-5 h-5 text-indigo-400 shrink-0 mt-0.5" />
            <div>
              <div className="text-sm font-semibold text-white flex items-center gap-2">
                Database Client Status:
                {isSupabaseConfigured ? (
                  <span className="flex items-center gap-1 text-emerald-400 text-xs font-medium">
                    <CheckCircle2 className="w-3.5 h-3.5" /> Connected to Supabase
                  </span>
                ) : (
                  <span className="flex items-center gap-1 text-amber-400 text-xs font-medium">
                    <AlertCircle className="w-3.5 h-3.5" /> Standalone Mode (Mock & Local Fallback Active)
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-400 mt-1">
                {isSupabaseConfigured 
                  ? 'Active environment variables detected. Live database synchronization enabled.'
                  : 'To link your personal Supabase project, supply VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in your .env configuration.'}
              </p>
            </div>
          </div>
        </div>

        {/* Tab switch */}
        <div className="flex gap-2 mt-4 border-b border-white/10 pb-2">
          <button
            onClick={() => setActiveTab('tables')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
              activeTab === 'tables' ? 'bg-purple-600 text-white' : 'text-slate-400 hover:text-white'
            }`}
          >
            Phase 1 Tables
          </button>
          <button
            onClick={() => setActiveTab('sql')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
              activeTab === 'sql' ? 'bg-purple-600 text-white' : 'text-slate-400 hover:text-white'
            }`}
          >
            Core Schema
          </button>
          <button
            onClick={() => setActiveTab('cms_sql')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
              activeTab === 'cms_sql' ? 'bg-purple-600 text-white' : 'text-slate-400 hover:text-white'
            }`}
          >
            Dynamic CMS SQL (New)
          </button>
          <button
            onClick={() => setActiveTab('rls')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
              activeTab === 'rls' ? 'bg-purple-600 text-white' : 'text-slate-400 hover:text-white'
            }`}
          >
            RLS & Security Rules
          </button>
        </div>

        {/* Tab Contents */}
        <div className="mt-4">
          {activeTab === 'tables' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
              <div className="p-3.5 rounded-xl bg-purple-950/20 border border-purple-500/20">
                <div className="font-semibold text-purple-300 mb-1">1. site_settings</div>
                <p className="text-slate-400 mb-2">College metadata, admissions status, terms, contact details, grading policy.</p>
                <code className="text-[11px] text-purple-200/80 block bg-black/40 p-2 rounded">
                  school_name, admissions_open, academic_year, contact_email, total_students
                </code>
              </div>
              <div className="p-3.5 rounded-xl bg-pink-950/20 border border-pink-500/20">
                <div className="font-semibold text-pink-300 mb-1">2. courses</div>
                <p className="text-slate-400 mb-2">Curriculum offerings, credits, prerequisites, instructor, syllabus outline.</p>
                <code className="text-[11px] text-pink-200/80 block bg-black/40 p-2 rounded">
                  code, title, category, grade_level, credits, syllabus_modules, instructor_name
                </code>
              </div>
              <div className="p-3.5 rounded-xl bg-indigo-950/20 border border-indigo-500/20">
                <div className="font-semibold text-indigo-300 mb-1">3. events</div>
                <p className="text-slate-400 mb-2">Academic symposiums, campus open houses, arts galas, RSVP tracking.</p>
                <code className="text-[11px] text-indigo-200/80 block bg-black/40 p-2 rounded">
                  title, category, date, time, location, rsvp_required, capacity, registered_count
                </code>
              </div>
              <div className="p-3.5 rounded-xl bg-emerald-950/20 border border-emerald-500/20">
                <div className="font-semibold text-emerald-300 mb-1">4. admissions</div>
                <p className="text-slate-400 mb-2">Incoming prospective student inquiries, contact info, grade levels, status workflow.</p>
                <code className="text-[11px] text-emerald-200/80 block bg-black/40 p-2 rounded">
                  student_name, parent_name, email, grade_applying_for, program_interest, status
                </code>
              </div>
              <div className="p-3.5 rounded-xl bg-amber-950/20 border border-amber-500/20 md:col-span-2">
                <div className="font-semibold text-amber-300 mb-1">Dynamic Website CMS Tables (Active)</div>
                <p className="text-slate-400 mb-2">Hero slides, quick stats, core values, achievements, banners, social media, announcements ticker, modal popups.</p>
                <code className="text-[11px] text-amber-200/80 block bg-black/40 p-2 rounded">
                  hero_slides, quick_stats, core_values, achievements, banners, social_media, announcements, popups
                </code>
              </div>
            </div>
          )}

          {activeTab === 'sql' && (
            <div className="relative">
              <button
                onClick={() => {
                  navigator.clipboard.writeText(sqlCode);
                  setCopied(true);
                  setTimeout(() => setCopied(false), 2500);
                }}
                className="absolute top-2 right-2 flex items-center gap-1.5 px-2.5 py-1 text-xs rounded bg-purple-600/80 hover:bg-purple-600 text-white font-medium shadow transition-colors"
              >
                {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                {copied ? 'Copied!' : 'Copy SQL'}
              </button>
              <pre className="p-4 rounded-xl bg-black/60 text-slate-300 font-mono text-[11px] overflow-x-auto max-h-64 border border-white/10">
                {sqlCode}
              </pre>
            </div>
          )}

          {activeTab === 'cms_sql' && (
            <div className="relative">
              <button
                onClick={() => {
                  navigator.clipboard.writeText(cmsSqlCode);
                  setCopied(true);
                  setTimeout(() => setCopied(false), 2500);
                }}
                className="absolute top-2 right-2 flex items-center gap-1.5 px-2.5 py-1 text-xs rounded bg-purple-600/80 hover:bg-purple-600 text-white font-medium shadow transition-colors"
              >
                {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                {copied ? 'Copied!' : 'Copy CMS SQL'}
              </button>
              <pre className="p-4 rounded-xl bg-black/60 text-slate-300 font-mono text-[11px] overflow-x-auto max-h-64 border border-white/10">
                {cmsSqlCode}
              </pre>
            </div>
          )}

          {activeTab === 'rls' && (
            <div className="space-y-3 text-xs">
              <div className="flex items-start gap-3 p-3 rounded-xl bg-white/[0.02] border border-white/10">
                <Shield className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <div>
                  <span className="font-semibold text-white">Public Read Policies: </span>
                  <span className="text-slate-400">Anonymous visitors can query published courses, events, and public site settings.</span>
                </div>
              </div>
              <div className="flex items-start gap-3 p-3 rounded-xl bg-white/[0.02] border border-white/10">
                <Shield className="w-4 h-4 text-purple-400 shrink-0 mt-0.5" />
                <div>
                  <span className="font-semibold text-white">Anonymous Inquiries: </span>
                  <span className="text-slate-400">Prospective applicants can insert admission requests without full account login.</span>
                </div>
              </div>
              <div className="flex items-start gap-3 p-3 rounded-xl bg-white/[0.02] border border-white/10">
                <Shield className="w-4 h-4 text-pink-400 shrink-0 mt-0.5" />
                <div>
                  <span className="font-semibold text-white">Admin Privileges: </span>
                  <span className="text-slate-400">Modification of course catalogs, events, and site configurations is restricted to verified administrators via Supabase Auth JWT.</span>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="mt-6 pt-4 border-t border-white/10 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 text-xs font-semibold rounded-lg bg-white/10 hover:bg-white/20 text-white transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
