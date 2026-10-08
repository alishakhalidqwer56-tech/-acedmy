import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  GraduationCap, 
  LayoutDashboard, 
  BookOpen, 
  Video, 
  CalendarCheck, 
  Award, 
  DollarSign, 
  Bell, 
  User, 
  Users, 
  FileText, 
  Settings, 
  LogOut, 
  Menu, 
  X, 
  ShieldCheck, 
  ExternalLink,
  ChevronRight,
  FolderPlus,
  Image,
  MessageSquare,
  Sliders,
  Pencil
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useSite } from '../../context/SiteContext';
import { UserRole } from '../../types';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';

interface PortalLayoutProps {
  children: React.ReactNode;
  pageTitle: string;
  pageSubtitle?: string;
}

export const PortalLayout: React.FC<PortalLayoutProps> = ({
  children,
  pageTitle,
  pageSubtitle,
}) => {
  const { profile, role, logout } = useAuth();
  const { settings } = useSite();
  const location = useLocation();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    navigate('/login', { replace: true });
  };

  // Nav configurations per role
  const getNavItems = (currentRole: UserRole | null) => {
    switch (currentRole) {
      case 'student':
        return [
          { name: 'Dashboard', path: '/student/dashboard', icon: <LayoutDashboard className="w-4 h-4" /> },
          { name: 'My Courses', path: '/student/courses', icon: <BookOpen className="w-4 h-4" /> },
          { name: 'Video Lectures', path: '/student/videos', icon: <Video className="w-4 h-4" /> },
          { name: 'Attendance', path: '/student/attendance', icon: <CalendarCheck className="w-4 h-4" /> },
          { name: 'Results & GPA', path: '/student/results', icon: <Award className="w-4 h-4" /> },
          { name: 'Fee Info', path: '/student/fees', icon: <DollarSign className="w-4 h-4" /> },
          { name: 'Notifications', path: '/student/notifications', icon: <Bell className="w-4 h-4" /> },
          { name: 'My Profile', path: '/student/profile', icon: <User className="w-4 h-4" /> },
        ];
      case 'parent':
        return [
          { name: 'Dashboard', path: '/parent/dashboard', icon: <LayoutDashboard className="w-4 h-4" /> },
          { name: "Child's Attendance", path: '/parent/attendance', icon: <CalendarCheck className="w-4 h-4" /> },
          { name: "Child's Results", path: '/parent/results', icon: <Award className="w-4 h-4" /> },
          { name: 'Fee Invoices', path: '/parent/fee', icon: <DollarSign className="w-4 h-4" /> },
          { name: 'Notifications', path: '/parent/notifications', icon: <Bell className="w-4 h-4" /> },
          { name: 'Parent Profile', path: '/parent/profile', icon: <User className="w-4 h-4" /> },
        ];
      case 'teacher':
        return [
          { name: 'Dashboard', path: '/teacher/dashboard', icon: <LayoutDashboard className="w-4 h-4" /> },
          { name: 'My Classes', path: '/teacher/classes', icon: <Users className="w-4 h-4" /> },
          { name: 'Mark Attendance', path: '/teacher/attendance', icon: <CalendarCheck className="w-4 h-4" /> },
          { name: 'Enter Results', path: '/teacher/results', icon: <Award className="w-4 h-4" /> },
          { name: 'Upload Videos', path: '/teacher/videos', icon: <Video className="w-4 h-4" /> },
          { name: 'Blog Posts', path: '/teacher/blog', icon: <FileText className="w-4 h-4" /> },
          { name: 'Notifications', path: '/teacher/notifications', icon: <Bell className="w-4 h-4" /> },
          { name: 'Faculty Profile', path: '/teacher/profile', icon: <User className="w-4 h-4" /> },
        ];
      case 'admin':
        return [
          { name: 'Dashboard', path: '/admin/dashboard', icon: <LayoutDashboard className="w-4 h-4" /> },
          { name: 'User Management', path: '/admin/users', icon: <Users className="w-4 h-4" /> },
          { name: 'Courses', path: '/admin/courses', icon: <BookOpen className="w-4 h-4" /> },
          { name: 'Subjects', path: '/admin/subjects', icon: <FileText className="w-4 h-4" /> },
          { name: 'Class Sections', path: '/admin/classes', icon: <Users className="w-4 h-4" /> },
          { name: 'Academic Terms', path: '/admin/terms', icon: <CalendarCheck className="w-4 h-4" /> },
          { name: 'Admissions', path: '/admin/admissions', icon: <FolderPlus className="w-4 h-4" /> },
          { name: 'Attendance Reports', path: '/admin/attendance', icon: <CalendarCheck className="w-4 h-4" /> },
          { name: 'Results Management', path: '/admin/results', icon: <Award className="w-4 h-4" /> },
          { name: 'Fee Structure', path: '/admin/fees', icon: <DollarSign className="w-4 h-4" /> },
          { name: 'Grading Scale', path: '/admin/grading', icon: <Award className="w-4 h-4" /> },
          { name: 'Campus Events', path: '/admin/events', icon: <CalendarCheck className="w-4 h-4" /> },
          { name: 'Blog Management', path: '/admin/blog', icon: <FileText className="w-4 h-4" /> },
          { name: 'Reviews & Testimonials', path: '/admin/testimonials', icon: <MessageSquare className="w-4 h-4" /> },
          { name: 'Campus Gallery', path: '/admin/gallery', icon: <Image className="w-4 h-4" /> },
          { name: 'Campus Posters', path: '/admin/posters', icon: <Image className="w-4 h-4" /> },
          { name: 'Notifications', path: '/admin/notifications', icon: <Bell className="w-4 h-4" /> },
          { name: 'Chatbot Settings', path: '/admin/chatbot', icon: <MessageSquare className="w-4 h-4" /> },
          { name: 'Client Inquiries', path: '/admin/inquiries', icon: <MessageSquare className="w-4 h-4" /> },
          { name: 'Website CMS (Dynamic)', path: '/admin/website-cms', icon: <Sliders className="w-4 h-4" /> },
          { name: 'Site Settings', path: '/admin/settings', icon: <Settings className="w-4 h-4" /> },
        ];
      default:
        return [];
    }
  };

  const navItems = getNavItems(role);

  const getRoleBadgeVariant = (r: UserRole | null): 'purple' | 'pink' | 'cyan' | 'amber' => {
    switch (r) {
      case 'admin': return 'amber';
      case 'teacher': return 'purple';
      case 'student': return 'pink';
      case 'parent': return 'cyan';
      default: return 'purple';
    }
  };

  const roleTitleMap = {
    admin: 'Administrator',
    teacher: 'Faculty Teacher',
    student: 'Registered Scholar',
    parent: 'Guardian / Parent',
  };

  const profileName = profile?.full_name || 'Academy Member';
  const profileRole = role ? roleTitleMap[role] : 'Member';
  const roleBadgeVariant = getRoleBadgeVariant(role);

  return (
    <div className="min-h-screen bg-[#0f0f12] text-slate-100 flex flex-col lg:flex-row">
      
      {/* 1. Desktop & Mobile Sidebar Drawer */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-[#141422] border-r border-[#2a2a3e] flex flex-col justify-between transition-transform duration-300 lg:translate-x-0 lg:static lg:h-screen lg:shrink-0 ${
          mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex flex-col h-full overflow-y-auto">
          {/* Logo / Brand Header */}
          <div className="p-5 border-b border-[#2a2a3e] flex items-center justify-between">
            <Link to="/" className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-[#7c3aed] to-[#ec4899] p-0.5 shadow-md">
                <div className="w-full h-full bg-[#131120] rounded-[10px] flex items-center justify-center">
                  <GraduationCap className="w-4 h-4 text-purple-400" />
                </div>
              </div>
              <div>
                <span className="text-base font-bold text-white block leading-tight">
                  {settings.logo_text_first || 'Girls'}<span className="text-gradient"> {settings.logo_text_second || 'Academy'}</span>
                </span>
                <span className="text-[10px] text-slate-400 font-medium tracking-wider uppercase block">
                  Campus Portal
                </span>
              </div>
            </Link>
            <button
              onClick={() => setMobileMenuOpen(false)}
              className="lg:hidden p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-white/5"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* User Profile Mini Card in Sidebar */}
          <Link
            to={`/${role || 'student'}/profile`}
            className="p-3 mx-3 my-3 rounded-2xl bg-[#1b1b2f] hover:bg-[#23233c] border border-[#2a2a3e] hover:border-purple-500/40 transition-all flex items-center gap-3 group"
            title="Click to edit your name and profile"
          >
            <img
              src={profile?.photo_url || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80'}
              alt={profileName}
              className="w-10 h-10 rounded-full object-cover border border-purple-500/40 shrink-0 group-hover:scale-105 transition-transform"
            />
            <div className="overflow-hidden flex-1">
              <div className="text-xs font-bold text-white truncate flex items-center justify-between">
                <span>{profileName}</span>
                <Pencil className="w-3 h-3 text-purple-400 opacity-60 group-hover:opacity-100 transition-opacity ml-1 shrink-0" />
              </div>
              <div className="mt-0.5 flex items-center justify-between">
                <Badge variant={roleBadgeVariant} size="sm">
                  {role ? role.toUpperCase() : 'USER'}
                </Badge>
                <span className="text-[10px] text-purple-300 font-medium">Edit Name →</span>
              </div>
            </div>
          </Link>

          {/* Nav Items List */}
          <nav className="flex-1 px-3 py-2 space-y-1">
            <div className="px-3 pb-2 text-[10px] font-semibold text-slate-500 uppercase tracking-widest">
              Navigation
            </div>
            {navItems.map((item) => {
              const active = location.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-medium transition-all ${
                    active
                      ? 'bg-purple-600/20 text-white font-semibold border-l-2 border-purple-500'
                      : 'text-slate-400 hover:text-white hover:bg-white/[0.04]'
                  }`}
                >
                  <span className={active ? 'text-purple-400' : 'text-slate-400'}>
                    {item.icon}
                  </span>
                  <span>{item.name}</span>
                </Link>
              );
            })}
          </nav>

          {/* Sidebar Footer Link to Public Website & Logout */}
          <div className="p-3 border-t border-[#2a2a3e] space-y-1">
            <Link
              to="/"
              className="flex items-center justify-between px-3 py-2 text-xs text-slate-400 hover:text-white hover:bg-white/[0.03] rounded-lg transition-colors"
            >
              <span className="flex items-center gap-2">
                <ExternalLink className="w-3.5 h-3.5" /> Public Website
              </span>
              <ChevronRight className="w-3 h-3 text-slate-600" />
            </Link>

            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-2.5 px-3 py-2 text-xs text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 rounded-lg transition-colors cursor-pointer"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Log Out</span>
            </button>
          </div>
        </div>
      </aside>

      {/* Backdrop for mobile menu */}
      {mobileMenuOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/70 backdrop-blur-sm lg:hidden"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      {/* 2. Main Portal Content Area */}
      <div className="flex-1 flex flex-col min-w-0 min-h-screen">
        
        {/* Top Header Bar */}
        <header className="sticky top-0 z-30 h-16 bg-[#12121e]/90 backdrop-blur-md border-b border-[#2a2a3e] px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          
          <div className="flex items-center gap-3">
            {/* Mobile Hamburger Button */}
            <button
              onClick={() => setMobileMenuOpen(true)}
              className="lg:hidden p-2 rounded-xl text-slate-300 hover:text-white hover:bg-white/5 border border-[#2a2a3e]"
              aria-label="Toggle menu"
            >
              <Menu className="w-5 h-5" />
            </button>
            <div>
              <h1 className="text-base sm:text-lg font-bold text-white tracking-tight leading-tight">
                {pageTitle}
              </h1>
              {pageSubtitle && (
                <p className="text-[11px] text-slate-400 hidden sm:block">
                  {pageSubtitle}
                </p>
              )}
            </div>
          </div>

          {/* Right Header Actions */}
          <div className="flex items-center gap-3">
            {/* Notification Bell */}
            <div className="relative">
              <button
                onClick={() => setNotificationsOpen(!notificationsOpen)}
                className="p-2 rounded-xl text-slate-300 hover:text-white hover:bg-white/5 border border-[#2a2a3e] relative transition-colors"
                title="Notifications"
              >
                <Bell className="w-4 h-4 text-purple-400" />
                <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-pink-500 ring-2 ring-[#12121e]" />
              </button>

              {/* Notification Dropdown Preview */}
              {notificationsOpen && (
                <div className="absolute right-0 mt-2 w-72 sm:w-80 rounded-2xl bg-[#181829] border border-[#2a2a3e] shadow-2xl p-4 text-xs z-50 animate-fade-in">
                  <div className="flex items-center justify-between pb-3 border-b border-white/5 font-semibold text-white">
                    <span>Recent Notifications</span>
                    <span className="text-[10px] text-purple-400">Mark all read</span>
                  </div>
                  <div className="py-3 space-y-2.5">
                    <div className="p-2.5 rounded-xl bg-purple-500/10 border border-purple-500/20 text-slate-300">
                      <div className="font-semibold text-white text-[11px]">Academic Term Calendar</div>
                      <div className="text-[10px] text-slate-400 mt-0.5">Fall Midterm examination schedule has been officially released.</div>
                    </div>
                    <div className="p-2.5 rounded-xl bg-white/[0.02] border border-white/5 text-slate-300">
                      <div className="font-semibold text-white text-[11px]">Campus Advisory</div>
                      <div className="text-[10px] text-slate-400 mt-0.5">STEM lab access hours extended this weekend.</div>
                    </div>
                  </div>
                  <button
                    onClick={() => setNotificationsOpen(false)}
                    className="w-full text-center text-[11px] text-slate-400 hover:text-purple-400 pt-2 border-t border-white/5"
                  >
                    Close
                  </button>
                </div>
              )}
            </div>

            {/* Profile Avatar / Link */}
            <Link
              to={`/${role || 'student'}/profile`}
              className="flex items-center gap-2 p-1 sm:px-3 sm:py-1.5 rounded-xl hover:bg-white/5 border border-transparent hover:border-[#2a2a3e] transition-all"
            >
              <img
                src={profile?.photo_url || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80'}
                alt={profileName}
                className="w-7 h-7 rounded-full object-cover border border-purple-500/40"
              />
              <span className="text-xs font-medium text-slate-200 hidden md:inline max-w-[120px] truncate">
                {profileName.split(' ')[0]}
              </span>
            </Link>

            {/* Logout button */}
            <Button
              variant="outline"
              size="sm"
              onClick={handleLogout}
              className="hidden sm:inline-flex"
              leftIcon={<LogOut className="w-3.5 h-3.5" />}
            >
              Sign Out
            </Button>
          </div>
        </header>

        {/* Main Viewport Content */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
          {children}
        </main>
      </div>

    </div>
  );
};
