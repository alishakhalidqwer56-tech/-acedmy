import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  GraduationCap, 
  MapPin, 
  Phone, 
  Mail, 
  Heart, 
  ArrowRight,
  ShieldCheck,
  MessageCircle,
  ExternalLink
} from 'lucide-react';
import { useSite } from '../../context/SiteContext';
import { fetchSocialMedia, fetchCourses } from '../../lib/dataService';
import { SocialMedia, Course } from '../../types';

export const Footer: React.FC = () => {
  const { settings } = useSite();
  const [socials, setSocials] = useState<SocialMedia[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);

  useEffect(() => {
    let mounted = true;
    async function loadFooterData() {
      try {
        const [soc, crs] = await Promise.all([
          fetchSocialMedia(true),
          fetchCourses()
        ]);
        if (mounted) {
          if (soc && soc.length > 0) setSocials(soc);
          if (crs && crs.length > 0) setCourses(crs.slice(0, 5));
        }
      } catch (e) {
        console.warn('Footer dynamic load fallback:', e);
      }
    }
    loadFooterData();
    return () => { mounted = false; };
  }, []);

  const renderSocialIcon = (platform: string, iconName: string) => {
    const key = (platform + ' ' + iconName).toLowerCase();
    if (key.includes('facebook')) {
      return (
        <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
          <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
        </svg>
      );
    }
    if (key.includes('instagram')) {
      return (
        <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
          <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
        </svg>
      );
    }
    if (key.includes('youtube')) {
      return (
        <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
          <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
        </svg>
      );
    }
    return <MessageCircle className="w-4 h-4" />;
  };

  return (
    <footer className="bg-[#0b0b12] border-t border-[#2a2a3e] text-slate-400 text-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
          
          {/* Col 1: Brand Info */}
          <div className="lg:col-span-2 space-y-4">
            <Link to="/" className="flex items-center gap-3 group inline-flex">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#7c3aed] to-[#ec4899] p-0.5 shadow-md shadow-purple-900/30">
                <div className="w-full h-full bg-[#131120] rounded-[10px] flex items-center justify-center overflow-hidden">
                  {settings.academy_logo_url ? (
                    <img src={settings.academy_logo_url} alt="Logo" className="w-full h-full object-cover" />
                  ) : (
                    <GraduationCap className="w-5 h-5 text-purple-400" />
                  )}
                </div>
              </div>
              <span className="text-xl font-bold tracking-tight text-white">
                {settings.logo_text_first || 'Girls'}<span className="text-gradient"> {settings.logo_text_second || 'Academy'}</span>
              </span>
            </Link>
            <p className="text-slate-400 text-sm leading-relaxed max-w-sm">
              {settings.academy_tagline || settings.tagline || 'Empowering young women through world-class academic rigor, ethical leadership, and groundbreaking STEM mentorship.'}
            </p>
            <div className="flex items-center gap-3 pt-2">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/20 text-xs text-purple-300">
                <ShieldCheck className="w-3.5 h-3.5 text-purple-400" />
                <span>BISE & FBISE Affiliated</span>
              </div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-pink-500/10 border border-pink-500/20 text-xs text-pink-300">
                <span>Excellence for Girls</span>
              </div>
            </div>
          </div>

          {/* Col 2: Navigation Links */}
          <div className="space-y-3">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-white">Navigation</h4>
            <ul className="space-y-2 text-xs sm:text-sm">
              <li>
                <Link to="/" className="hover:text-purple-400 transition-colors">Home</Link>
              </li>
              <li>
                <Link to="/about" className="hover:text-purple-400 transition-colors">About Us</Link>
              </li>
              <li>
                <Link to="/courses" className="hover:text-purple-400 transition-colors">All Programs</Link>
              </li>
              <li>
                <Link to="/celebration-video" className="text-amber-400 hover:text-amber-300 font-medium flex items-center gap-1 transition-colors">
                  <span>BISE Results 2025 Video</span> 🏆
                </Link>
              </li>
              <li>
                <Link to="/admissions" className="hover:text-purple-400 transition-colors">Apply Online</Link>
              </li>
              <li>
                <Link to="/faculty" className="hover:text-purple-400 transition-colors">Faculty & Mentors</Link>
              </li>
            </ul>
          </div>

          {/* Col 3: Academic Programs Quick Links */}
          <div className="space-y-3">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-white">Programs</h4>
            <ul className="space-y-2 text-xs sm:text-sm">
              {courses.length > 0 ? (
                courses.map((c) => (
                  <li key={c.id}>
                    <Link to="/courses" className="hover:text-purple-400 transition-colors truncate block max-w-[180px]">
                      {c.title}
                    </Link>
                  </li>
                ))
              ) : (
                <>
                  <li><Link to="/courses" className="hover:text-purple-400 transition-colors">Matric Science</Link></li>
                  <li><Link to="/courses" className="hover:text-purple-400 transition-colors">FSc Pre-Medical</Link></li>
                  <li><Link to="/courses" className="hover:text-purple-400 transition-colors">ICS Computer Science</Link></li>
                  <li><Link to="/courses" className="hover:text-purple-400 transition-colors">I.Com Commerce</Link></li>
                  <li><Link to="/courses" className="hover:text-purple-400 transition-colors">Primary Program</Link></li>
                </>
              )}
            </ul>
          </div>

          {/* Col 4: Campus Contact & Social Media */}
          <div className="space-y-3">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-white">Campus Contact</h4>
            <ul className="space-y-2.5 text-xs sm:text-sm">
              <li className="flex items-start gap-2.5 text-slate-300">
                <MapPin className="w-4 h-4 text-purple-400 shrink-0 mt-0.5" />
                <span>{settings.campus_address || settings.academy_address || 'Street 5, Sector G-11/2, Islamabad, Pakistan'}</span>
              </li>
              <li className="flex items-center gap-2.5 text-slate-300">
                <Phone className="w-4 h-4 text-purple-400 shrink-0" />
                <span>{settings.phone_number || settings.academy_phone || '051-4861234'}</span>
              </li>
              <li className="flex items-center gap-2.5 text-slate-300">
                <Mail className="w-4 h-4 text-purple-400 shrink-0" />
                <span>{settings.admissions_email || settings.contact_email || 'info@girlsacademy.edu.pk'}</span>
              </li>
            </ul>

            {/* Dynamic Social Icons */}
            <div className="pt-3">
              <div className="text-xs font-medium text-slate-300 mb-2">Follow Our Journey</div>
              <div className="flex items-center gap-2 flex-wrap">
                {socials.map((s) => (
                  <a
                    key={s.id}
                    href={s.url}
                    target="_blank"
                    rel="noreferrer"
                    aria-label={s.platform}
                    title={`${s.platform} (${s.followers_count || 'Follow'})`}
                    className="w-8 h-8 rounded-lg bg-[#1e1e2e] border border-[#2a2a3e] flex items-center justify-center text-slate-300 hover:text-white hover:border-purple-500 hover:bg-purple-600/20 transition-all"
                  >
                    {renderSocialIcon(s.platform, s.icon)}
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Bottom copyright row */}
        <div className="mt-12 pt-8 border-t border-[#2a2a3e] flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <div>
            © {new Date().getFullYear()} {settings.school_name || 'Girls Academy'}. All rights reserved.
          </div>
          <div className="flex items-center gap-6">
            <Link to="/contact" className="hover:text-slate-300 transition-colors">Privacy Policy</Link>
            <Link to="/contact" className="hover:text-slate-300 transition-colors">Terms of Enrollment</Link>
            <Link to="/login" className="hover:text-purple-400 transition-colors">Portal Access</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};
