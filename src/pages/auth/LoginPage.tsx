import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useSearchParams, useLocation } from 'react-router-dom';
import { 
  GraduationCap, 
  Lock, 
  Mail, 
  ArrowRight, 
  ShieldCheck, 
  BookOpen, 
  Users, 
  AlertCircle, 
  Eye, 
  EyeOff,
  Sparkles
} from 'lucide-react';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { UserRole } from '../../types';
import { useAuth } from '../../context/AuthContext';

export const LoginPage: React.FC = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();

  // Determine initial selected portal
  const paramRole = searchParams.get('role');
  const isAdminParam = 
    location.pathname === '/admin-login' || 
    paramRole === 'admin' || 
    searchParams.get('admin') === 'true';

  const [selectedRole, setSelectedRole] = useState<UserRole>(
    isAdminParam 
      ? 'admin' 
      : (paramRole === 'parent' ? 'parent' : paramRole === 'teacher' ? 'teacher' : 'student')
  );

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Sync state if url param changes
  useEffect(() => {
    if (isAdminParam) {
      setSelectedRole('admin');
    } else if (paramRole && ['student', 'parent', 'teacher', 'admin'].includes(paramRole)) {
      setSelectedRole(paramRole as UserRole);
    }
  }, [isAdminParam, paramRole]);

  // Tab definitions
  const portalTabs: { id: UserRole; name: string; icon: React.ReactNode; color: string }[] = [
    { id: 'student', name: 'Student Portal', icon: <GraduationCap className="w-4 h-4" />, color: 'from-pink-500 to-purple-600' },
    { id: 'parent', name: 'Parent Portal', icon: <Users className="w-4 h-4" />, color: 'from-cyan-500 to-blue-600' },
    { id: 'admin', name: 'Admin Portal', icon: <ShieldCheck className="w-4 h-4" />, color: 'from-amber-500 to-orange-600' },
    { id: 'teacher', name: 'Teacher Portal', icon: <BookOpen className="w-4 h-4" />, color: 'from-purple-500 to-indigo-600' },
  ];

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setIsSubmitting(true);

    try {
      await login(email.trim(), password);
      navigate(`/${selectedRole}/dashboard`, { replace: true });
    } catch (err: any) {
      setErrorMessage(err.message || 'Invalid credentials. Please verify your email and password or contact the administration.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const getRoleMeta = () => {
    switch (selectedRole) {
      case 'admin':
        return {
          title: 'Administrator Portal',
          subtitle: 'Institutional control desk for staff, faculty records, and admissions.',
          emailPlaceholder: 'admin@girlsacademy.edu.pk',
          colorBadge: 'bg-amber-500/20 text-amber-300 border-amber-500/30',
          btnGradient: 'from-amber-600 to-orange-600 hover:from-amber-500 hover:to-orange-500 shadow-amber-900/30',
        };
      case 'parent':
        return {
          title: 'Parent & Guardian Portal',
          subtitle: 'Track your child’s daily attendance, terminal test marks, and tuition fees.',
          emailPlaceholder: 'parent@girlsacademy.edu.pk',
          colorBadge: 'bg-cyan-500/20 text-cyan-300 border-cyan-500/30',
          btnGradient: 'from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 shadow-cyan-900/30',
        };
      case 'teacher':
        return {
          title: 'Faculty & Teacher Portal',
          subtitle: 'Record class attendance, evaluate student marks, and post video lectures.',
          emailPlaceholder: 'teacher@girlsacademy.edu.pk',
          colorBadge: 'bg-purple-500/20 text-purple-300 border-purple-500/30',
          btnGradient: 'from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 shadow-purple-900/30',
        };
      case 'student':
      default:
        return {
          title: 'Student & Scholar Desk',
          subtitle: 'Access your coursework, video lectures, exams transcript, and fee status.',
          emailPlaceholder: 'student@girlsacademy.edu.pk',
          colorBadge: 'bg-pink-500/20 text-pink-300 border-pink-500/30',
          btnGradient: 'from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 shadow-purple-900/30',
        };
    }
  };

  const meta = getRoleMeta();

  return (
    <div className="min-h-[calc(100vh-10rem)] flex items-center justify-center px-4 py-12 relative">
      {/* Ambient background glow */}
      <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[520px] h-[520px] ${
        selectedRole === 'admin' ? 'bg-amber-600/10' :
        selectedRole === 'parent' ? 'bg-cyan-600/10' :
        selectedRole === 'teacher' ? 'bg-indigo-600/10' :
        'bg-purple-600/10'
      } rounded-full blur-[140px] pointer-events-none transition-colors duration-500`} />

      <div className="w-full max-w-lg relative z-10">
        
        {/* Header */}
        <div className="text-center mb-6">
          <Link to="/" className="inline-flex items-center gap-2.5 mb-3 group">
            <div className={`w-10 h-10 rounded-xl bg-gradient-to-tr ${
              selectedRole === 'admin' ? 'from-amber-500 to-orange-600' :
              selectedRole === 'parent' ? 'from-cyan-500 to-blue-600' :
              'from-[#7c3aed] to-[#ec4899]'
            } p-0.5 shadow-lg shadow-purple-900/30 transition-all`}>
              <div className="w-full h-full bg-[#131120] rounded-[10px] flex items-center justify-center">
                {selectedRole === 'admin' ? (
                  <ShieldCheck className="w-5 h-5 text-amber-400" />
                ) : (
                  <GraduationCap className="w-5 h-5 text-purple-400 group-hover:text-pink-400 transition-colors" />
                )}
              </div>
            </div>
            <span className="text-xl font-bold text-white">
              Girls<span className={selectedRole === 'admin' ? 'text-amber-400' : 'text-gradient'}>Academy</span>
            </span>
          </Link>

          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            {meta.title}
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-md mx-auto">
            {meta.subtitle}
          </p>
        </div>

        {/* 4 Portal Switcher Tabs */}
        <div className="mb-4">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5 p-1.5 bg-[#141422] border border-[#2a2a3e] rounded-2xl shadow-inner">
            {portalTabs.map((tab) => {
              const active = selectedRole === tab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => {
                    setSelectedRole(tab.id);
                    setErrorMessage(null);
                  }}
                  className={`py-2 px-2.5 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                    active
                      ? 'bg-[#221f36] text-white shadow-md border border-[#3f3b63]'
                      : 'text-slate-400 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <span className={active ? 'text-purple-400' : 'text-slate-400'}>
                    {tab.icon}
                  </span>
                  <span className="truncate">{tab.name.replace(' Portal', '')}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Login Card */}
        <Card className="p-6 sm:p-8 bg-[#181827] border-[#2a2a3e] shadow-2xl relative overflow-hidden">
          
          <div className="flex items-center justify-between pb-4 mb-4 border-b border-[#2a2a3e]">
            <div className="flex items-center gap-2">
              <span className={`px-2.5 py-1 rounded-full text-[11px] font-semibold border ${meta.colorBadge}`}>
                {selectedRole.toUpperCase()} LOGIN
              </span>
            </div>
            <span className="text-[11px] text-slate-400">Institutional Access</span>
          </div>

          {errorMessage && (
            <div className="mb-5 p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-xs text-rose-300 flex items-start gap-2.5 animate-fade-in">
              <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
              <span>{errorMessage}</span>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5">
                {selectedRole === 'admin'
                  ? 'Administrator Email'
                  : selectedRole === 'parent'
                  ? 'Registered Parent Email'
                  : selectedRole === 'teacher'
                  ? 'Faculty Member Email'
                  : 'Student Registration Email'}
              </label>
              <div className="relative">
                <input
                  type="email"
                  required
                  placeholder={meta.emailPlaceholder}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-[#12121e] border border-[#2a2a3e] rounded-xl pl-10 pr-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-purple-500 transition-colors"
                />
                <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-medium text-slate-300">Password</label>
                <Link
                  to="/forgot-password"
                  className="text-xs text-purple-400 hover:text-purple-300 transition-colors"
                >
                  Forgot password?
                </Link>
              </div>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  placeholder="Enter your security password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-[#12121e] border border-[#2a2a3e] rounded-xl pl-10 pr-10 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-purple-500 transition-colors"
                />
                <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white cursor-pointer"
                  aria-label="Toggle password visibility"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className={`w-full mt-2 py-3 px-4 rounded-xl font-medium text-xs text-white bg-gradient-to-r ${meta.btnGradient} transition-all flex items-center justify-center gap-2 shadow-lg cursor-pointer disabled:opacity-50`}
            >
              {isSubmitting ? 'Authenticating...' : `Sign In to ${selectedRole === 'student' ? 'Student Desk' : selectedRole === 'admin' ? 'Admin Desk' : selectedRole === 'parent' ? 'Parent Desk' : 'Teacher Desk'}`}
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          {/* Policy notes */}
          <div className="mt-6 pt-5 border-t border-[#2a2a3e] flex flex-col sm:flex-row items-center justify-between text-xs text-slate-400 gap-2">
            <span>Forgot credentials or need assistance?</span>
            <Link to="/contact" className="text-purple-400 hover:text-purple-300 underline">
              Contact Registrar Office
            </Link>
          </div>
        </Card>

        {/* Quick Portal Switch Hint */}
        <div className="mt-4 text-center text-xs text-slate-500">
          <span>Looking for a different portal? Select from the tabs above anytime.</span>
        </div>

      </div>
    </div>
  );
};
