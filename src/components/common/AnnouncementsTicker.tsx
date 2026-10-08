import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Bell, ChevronRight, Sparkles } from 'lucide-react';
import { Announcement } from '../../types';
import { fetchAnnouncements, defaultAnnouncements } from '../../lib/dataService';

export const AnnouncementsTicker: React.FC = () => {
  const [announcements, setAnnouncements] = useState<Announcement[]>(defaultAnnouncements);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    let mounted = true;
    async function load() {
      try {
        const data = await fetchAnnouncements(true);
        if (mounted && data && data.length > 0) {
          setAnnouncements(data);
        }
      } catch (err) {
        console.warn('Announcements ticker fallback:', err);
      }
    }
    load();

    const handleUpdate = () => { load(); };
    window.addEventListener('storage', handleUpdate);
    window.addEventListener('ga_announcements_updated', handleUpdate);
    window.addEventListener('ga_data_updated', handleUpdate);

    return () => { 
      mounted = false; 
      window.removeEventListener('storage', handleUpdate);
      window.removeEventListener('ga_announcements_updated', handleUpdate);
      window.removeEventListener('ga_data_updated', handleUpdate);
    };
  }, []);

  useEffect(() => {
    if (announcements.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % announcements.length);
    }, 4500);
    return () => clearInterval(interval);
  }, [announcements.length]);

  if (!announcements || announcements.length === 0) return null;

  const current = announcements[currentIndex];

  return (
    <div className="bg-[#121021] border-b border-[#2a2a3e] text-xs py-2 px-4 relative z-30 overflow-hidden">
      <div className="max-w-7xl mx-auto flex items-center justify-between text-slate-300 gap-4">
        
        {/* Left: Indicator & Animated Ticker Item */}
        <div className="flex items-center gap-2.5 truncate">
          <span className="flex h-2 w-2 relative shrink-0">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-pink-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-pink-500"></span>
          </span>

          <span className="text-[11px] font-bold text-pink-300 uppercase tracking-wider shrink-0 hidden sm:inline-flex items-center gap-1">
            <Bell className="w-3 h-3 text-pink-400" /> Live Notice:
          </span>

          <div className="truncate text-slate-200 transition-all duration-500">
            {current.link ? (
              <Link 
                to={current.link} 
                className="hover:text-purple-300 underline underline-offset-2 transition-colors font-medium truncate"
              >
                {current.text}
              </Link>
            ) : (
              <span className="truncate">{current.text}</span>
            )}
          </div>
        </div>

        {/* Right: Quick CTA Link */}
        <div className="shrink-0 flex items-center gap-3 text-[11px]">
          {current.link && (
            <Link 
              to={current.link}
              className="text-purple-400 hover:text-purple-300 font-semibold flex items-center gap-0.5 transition-colors"
            >
              <span>View Details</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          )}
        </div>

      </div>
    </div>
  );
};
