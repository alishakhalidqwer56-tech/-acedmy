import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  GraduationCap, 
  Menu, 
  X, 
  LogIn, 
  Sparkles,
  PhoneCall,
  ArrowRight,
  LayoutDashboard,
  ShieldCheck,
  Users,
  ChevronDown,
  BookOpen
} from 'lucide-react';
import { Button } from '../ui/Button';
import { useAuth } from '../../context/AuthContext';
import { useSite } from '../../context/SiteContext';
import { fetchAnnouncements } from '../../lib/dataService';
import { Announcement } from '../../types';

export const Navbar: React.FC = () => {
  const { user, role } = useAuth();
  const { settings } = useSite();
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [portalsOpen, setPortalsOpen] = useState(false);
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [activeAnnIndex, setActiveAnnIndex] = useState(0);
  const location = useLocation();
  const portalsDropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (portalsDropdownRef.current && !portalsDropdownRef.current.contains(event.target as Node)) {
        setPortalsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    let mounted = true;
    async function loadAnn() {
      try {
        const data = await fetchAnnouncements(true);
        if (mounted && data) setAnnouncements(data);
      } catch (e) {
        console.warn('Navbar announcements fallback:', e);
      }
    }
    loadAnn();
    return () => { mounted = false; };
  }, []);

  useEffect(() => {
    if (announcements.length <= 1) return;
    const timer = setInterval(() => {
      setActiveAnnIndex(prev => (prev + 1) % announcements.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [announcements.length]);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile drawer on route change
  useEffect(() => {
    setIsOpen(false);
  }, [location.pathname]);

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Results 2025 🏆', path: '/celebration-video' },
    { name: 'About', path: '/about' },
    { name: 'Courses', path: '/courses' },
    { name: 'Admissions', path: '/admissions' },
    { name: 'Faculty', path: '/faculty' },
    { name: 'Events', path: '/events' },
    { name: 'Contact', path: '/contact' },
  ];

  const isActive = (path: string) => {
    if (path === '/') return location.pathname === '/';
    return location.pathname.startsWith(path);
  };

  return (
    <>
      {/* Top micro-announcement bar */}
      <div className="bg-[#131124] border-b border-[#2a2a3e] text-xs py-1.5 px-4 hidden sm:block">
        <div className="max-w-7xl mx-auto flex items-center justify-between text-slate-400">
          <div className="flex items-center gap-2 truncate max-w-2xl">
            <span className="flex h-2 w-2 relative shrink-0">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-pink-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-pink-500"></span>
            </span>
            {announcements.length > 0 ? (
              <div className="truncate text-slate-200">
                <span className="text-pink-300 font-semibold mr-1.5">Notice:</span>
                {announcements[activeAnnIndex]?.link ? (
                  <Link to={announcements[activeAnnIndex].link!} className="text-slate-200 hover:text-purple-300 underline transition-colors">
                    {announcements[activeAnnIndex].text}
                  </Link>
                ) : (
                  <span>{announcements[activeAnnIndex]?.text}</span>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-1.5">
                <span className="text-amber-300 font-semibold">Admissions 2026-2027:</span>
                <span className="text-slate-200">Limited seats available. Apply online today.</span>
              </div>
            )}
          </div>
          <div className="flex items-center gap-3 text-[11px] shrink-0">
            <span className="flex items-center gap-1.5 hover:text-white transition-colors">
              <PhoneCall className="w-3 h-3 text-purple-400" /> {settings.phone_number || settings.academy_phone || '051-4861234'}
            </span>
            <span className="text-slate-600">•</span>
            <Link to="/student/dashboard" className="text-pink-300 hover:text-white font-medium flex items-center gap-1 transition-colors">
              <GraduationCap className="w-3 h-3 text-pink-400" /> Student Portal
            </Link>
            <span className="text-slate-600">•</span>
            <Link to="/admin/dashboard" className="text-amber-300 hover:text-white font-medium flex items-center gap-1 transition-colors">
              <ShieldCheck className="w-3 h-3 text-amber-400" /> Admin Portal
            </Link>
            <span className="text-slate-600">•</span>
            <Link to="/admissions" className="text-purple-400 hover:text-purple-300 font-medium transition-colors">
              Apply Now →
            </Link>
          </div>
        </div>
      </div>

      {/* Main Sticky Navbar */}
      <nav
        className={`sticky top-0 z-40 transition-all duration-300 ${
          isScrolled
            ? 'bg-[#0f0f14]/90 backdrop-blur-md border-b border-[#2a2a3e] shadow-xl shadow-black/40'
            : 'bg-[#0f0f14]/70 backdrop-blur-sm border-b border-[#2a2a3e]/50'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-3 group">
              <div className="relative w-11 h-11 rounded-xl bg-gradient-to-tr from-[#7c3aed] to-[#ec4899] p-0.5 shadow-lg shadow-purple-900/30 group-hover:scale-105 transition-transform duration-200">
                <div className="w-full h-full bg-[#131120] rounded-[10px] flex items-center justify-center overflow-hidden">
                  {settings.academy_logo_url ? (
                    <img src={settings.academy_logo_url} alt="Logo" className="w-full h-full object-cover" />
                  ) : (
                    <GraduationCap className="w-6 h-6 text-purple-400 group-hover:text-pink-400 transition-colors" />
                  )}
                </div>
              </div>
              <div>
                <span className="text-lg sm:text-xl font-bold tracking-tight text-white block">
                  {settings.logo_text_first || 'Girls'}<span className="text-gradient"> {settings.logo_text_second || 'Academy'}</span>
                </span>
                <span className="text-[10px] tracking-widest text-slate-400 uppercase font-medium block truncate max-w-[220px]">
                  {settings.tagline && !/[\u0600-\u06FF]/.test(settings.tagline)
                    ? settings.tagline.slice(0, 36) 
                    : 'Quality Education — Inspiring Leaders'}
                </span>
              </div>
            </Link>

            {/* Desktop Navigation Links */}
            <div className="hidden lg:flex items-center gap-1 xl:gap-2">
              {navLinks.map((link) => {
                const active = isActive(link.path);
                return (
                  <Link
                    key={link.path}
                    to={link.path}
                    className={`px-3 py-2 text-xs xl:text-sm font-medium rounded-lg transition-all duration-200 relative ${
                      active
                        ? 'text-white bg-white/5 font-semibold'
                        : 'text-slate-300 hover:text-white hover:bg-white/[0.03]'
                    }`}
                  >
                    {link.name}
                    {active && (
                      <span className="absolute bottom-0 left-2 right-2 h-0.5 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full" />
                    )}
                  </Link>
                );
              })}
            </div>

            {/* Right Action: Portals Dropdown & Actions */}
            <div className="hidden sm:flex items-center gap-3">
              
              {/* Dedicated Portals Menu Dropdown */}
              <div className="relative" ref={portalsDropdownRef}>
                <button
                  type="button"
                  onClick={() => setPortalsOpen(!portalsOpen)}
                  className="px-3.5 py-2 text-xs font-semibold rounded-xl bg-[#1a1829] hover:bg-[#221f36] border border-[#2e2b47] text-slate-200 hover:text-white flex items-center gap-2 transition-all shadow-sm cursor-pointer"
                >
                  <GraduationCap className="w-4 h-4 text-purple-400" />
                  <span>Portals</span>
                  <ChevronDown className={`w-3.5 h-3.5 text-slate-400 transition-transform ${portalsOpen ? 'rotate-180' : ''}`} />
                </button>

                {portalsOpen && (
                  <div className="absolute right-0 mt-2 w-64 rounded-2xl bg-[#161626] border border-[#2a2a3e] shadow-2xl p-2 z-50 animate-fade-in divide-y divide-white/5">
                    <div className="px-3 py-2">
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                        Select Academy Portal
                      </span>
                    </div>

                    <div className="py-1 space-y-1">
                      <Link
                        to="/student/dashboard"
                        onClick={() => setPortalsOpen(false)}
                        className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-white/5 text-slate-200 hover:text-white transition-colors group"
                      >
                        <div className="p-1.5 rounded-lg bg-pink-500/10 text-pink-400 border border-pink-500/20 group-hover:scale-105 transition-transform">
                          <GraduationCap className="w-4 h-4" />
                        </div>
                        <div>
                          <div className="text-xs font-bold text-white flex items-center gap-1.5">
                            Student Portal
                            <span className="text-[9px] px-1.5 py-0.2 rounded bg-pink-500/20 text-pink-300 font-semibold">Active</span>
                          </div>
                          <div className="text-[10px] text-slate-400">Attendance, Marks & Classes</div>
                        </div>
                      </Link>

                      <Link
                        to="/parent/dashboard"
                        onClick={() => setPortalsOpen(false)}
                        className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-white/5 text-slate-200 hover:text-white transition-colors group"
                      >
                        <div className="p-1.5 rounded-lg bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 group-hover:scale-105 transition-transform">
                          <Users className="w-4 h-4" />
                        </div>
                        <div>
                          <div className="text-xs font-bold text-white">Parent Portal</div>
                          <div className="text-[10px] text-slate-400">Child Progress & Fee Status</div>
                        </div>
                      </Link>

                      <Link
                        to="/admin/dashboard"
                        onClick={() => setPortalsOpen(false)}
                        className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-amber-500/10 text-slate-200 hover:text-white transition-colors group"
                      >
                        <div className="p-1.5 rounded-lg bg-amber-500/10 text-amber-400 border border-amber-500/25 group-hover:scale-105 transition-transform">
                          <ShieldCheck className="w-4 h-4" />
                        </div>
                        <div>
                          <div className="text-xs font-bold text-amber-300 flex items-center gap-1.5">
                            Admin Portal
                            <span className="text-[9px] px-1.5 py-0.2 rounded bg-amber-500/20 text-amber-300 font-semibold">Staff</span>
                          </div>
                          <div className="text-[10px] text-slate-400">Full System & Student Management</div>
                        </div>
                      </Link>

                      <Link
                        to="/teacher/dashboard"
                        onClick={() => setPortalsOpen(false)}
                        className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-white/5 text-slate-200 hover:text-white transition-colors group"
                      >
                        <div className="p-1.5 rounded-lg bg-purple-500/10 text-purple-400 border border-purple-500/20 group-hover:scale-105 transition-transform">
                          <BookOpen className="w-4 h-4" />
                        </div>
                        <div>
                          <div className="text-xs font-bold text-white">Teacher Portal</div>
                          <div className="text-[10px] text-slate-400">Class Marks & Attendance</div>
                        </div>
                      </Link>
                    </div>

                    <div className="p-2 pt-2.5">
                      <Link
                        to="/login"
                        onClick={() => setPortalsOpen(false)}
                        className="w-full py-1.5 px-3 rounded-lg bg-purple-600/20 hover:bg-purple-600/30 text-purple-300 text-[11px] font-semibold text-center block transition-colors border border-purple-500/30"
                      >
                        Sign In with Credentials →
                      </Link>
                    </div>
                  </div>
                )}
              </div>

              {/* My Dashboard button or Quick Login */}
              {user && role ? (
                <Link to={`/${role}/dashboard`}>
                  <Button
                    variant="primary"
                    size="sm"
                    leftIcon={<LayoutDashboard className="w-4 h-4" />}
                  >
                    My Dashboard ({role})
                  </Button>
                </Link>
              ) : (
                <Link to="/login">
                  <Button
                    variant="outline"
                    size="sm"
                    leftIcon={<LogIn className="w-4 h-4 text-purple-400" />}
                  >
                    Login
                  </Button>
                </Link>
              )}
              
              <Link to="/admissions" className="hidden md:inline-flex">
                <Button
                  variant={user ? "outline" : "primary"}
                  size="sm"
                  rightIcon={<ArrowRight className="w-3.5 h-3.5" />}
                >
                  Apply
                </Button>
              </Link>
            </div>

            {/* Mobile Hamburger Button */}
            <div className="flex sm:hidden items-center gap-2">
              <Link to="/login" className="mr-1">
                <button className="p-2 text-purple-400 hover:text-white rounded-lg bg-white/5 border border-[#2a2a3e]">
                  <LogIn className="w-4 h-4" />
                </button>
              </Link>
              <button
                onClick={() => setIsOpen(!isOpen)}
                className="p-2.5 rounded-xl bg-white/5 border border-[#2a2a3e] text-slate-300 hover:text-white hover:bg-white/10 transition-colors"
                aria-label="Toggle navigation"
              >
                {isOpen ? <X className="w-5 h-5 text-pink-400" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile slide-down drawer */}
        {isOpen && (
          <div className="lg:hidden bg-[#12121e] border-b border-[#2a2a3e] px-4 pt-3 pb-6 animate-fade-in shadow-2xl">
            <div className="flex flex-col space-y-1">
              {navLinks.map((link) => {
                const active = isActive(link.path);
                return (
                  <Link
                    key={link.path}
                    to={link.path}
                    className={`px-4 py-2.5 rounded-xl text-sm font-medium transition-colors flex items-center justify-between ${
                      active
                        ? 'bg-purple-600/20 text-white font-semibold border-l-2 border-purple-500'
                        : 'text-slate-300 hover:bg-white/5 hover:text-white'
                    }`}
                  >
                    <span>{link.name}</span>
                    {active && <span className="w-1.5 h-1.5 rounded-full bg-pink-400" />}
                  </Link>
                );
              })}

              {/* Mobile Portals Dedicated Links */}
              <div className="pt-4 border-t border-[#2a2a3e] space-y-2">
                <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400 px-2">
                  Campus Portals
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <Link
                    to="/student/dashboard"
                    className="p-2.5 rounded-xl bg-[#181827] border border-pink-500/30 flex items-center gap-2 text-xs font-semibold text-pink-300 hover:bg-pink-500/10"
                  >
                    <GraduationCap className="w-4 h-4 shrink-0 text-pink-400" />
                    <span>Student Portal</span>
                  </Link>
                  <Link
                    to="/parent/dashboard"
                    className="p-2.5 rounded-xl bg-[#181827] border border-cyan-500/30 flex items-center gap-2 text-xs font-semibold text-cyan-300 hover:bg-cyan-500/10"
                  >
                    <Users className="w-4 h-4 shrink-0 text-cyan-400" />
                    <span>Parent Portal</span>
                  </Link>
                  <Link
                    to="/admin/dashboard"
                    className="p-2.5 rounded-xl bg-[#181827] border border-amber-500/30 flex items-center gap-2 text-xs font-semibold text-amber-300 hover:bg-amber-500/10"
                  >
                    <ShieldCheck className="w-4 h-4 shrink-0 text-amber-400" />
                    <span>Admin Portal</span>
                  </Link>
                  <Link
                    to="/teacher/dashboard"
                    className="p-2.5 rounded-xl bg-[#181827] border border-purple-500/30 flex items-center gap-2 text-xs font-semibold text-purple-300 hover:bg-purple-500/10"
                  >
                    <BookOpen className="w-4 h-4 shrink-0 text-purple-400" />
                    <span>Teacher Portal</span>
                  </Link>
                </div>

                <div className="pt-2 flex flex-col gap-2">
                  <Link to="/login" className="w-full">
                    <Button variant="outline" size="md" className="w-full" leftIcon={<LogIn className="w-4 h-4" />}>
                      Portal Login
                    </Button>
                  </Link>
                  <Link to="/admissions" className="w-full">
                    <Button variant="primary" size="md" className="w-full" rightIcon={<ArrowRight className="w-4 h-4" />}>
                      Apply Now
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        )}
      </nav>
    </>
  );
};
