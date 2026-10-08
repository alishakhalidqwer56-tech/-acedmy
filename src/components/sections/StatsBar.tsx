import React, { useEffect, useState } from 'react';
import { 
  Users, 
  BookOpen, 
  GraduationCap, 
  Award, 
  Clock, 
  Trophy, 
  Star, 
  ShieldCheck, 
  Sparkles,
  LucideIcon
} from 'lucide-react';
import { Card } from '../ui/Card';
import { QuickStat } from '../../types';
import { fetchQuickStats, defaultQuickStats } from '../../lib/dataService';

export const StatsBar: React.FC = () => {
  const [stats, setStats] = useState<QuickStat[]>(defaultQuickStats);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    async function loadStats() {
      try {
        const data = await fetchQuickStats(true);
        if (mounted && data && data.length > 0) {
          setStats(data);
        }
      } catch (err) {
        console.warn('Falling back to default quick stats:', err);
      } finally {
        if (mounted) setLoading(false);
      }
    }
    loadStats();
    return () => { mounted = false; };
  }, []);

  const getStatIcon = (iconName?: string | null): React.ReactNode => {
    const name = (iconName || '').toLowerCase().trim();
    switch (name) {
      case 'users':
      case 'students':
        return <Users className="w-5 h-5 text-purple-400" />;
      case 'book':
      case 'programs':
      case 'courses':
        return <BookOpen className="w-5 h-5 text-pink-400" />;
      case 'graduation-cap':
      case 'teachers':
      case 'faculty':
        return <GraduationCap className="w-5 h-5 text-indigo-400" />;
      case 'award':
      case 'medal':
        return <Award className="w-5 h-5 text-cyan-400" />;
      case 'trophy':
        return <Trophy className="w-5 h-5 text-amber-400" />;
      case 'star':
        return <Star className="w-5 h-5 text-amber-400" />;
      case 'shield':
        return <ShieldCheck className="w-5 h-5 text-emerald-400" />;
      case 'clock':
      case 'years':
        return <Clock className="w-5 h-5 text-blue-400" />;
      default:
        return <Sparkles className="w-5 h-5 text-purple-400" />;
    }
  };

  return (
    <section className="relative z-20 -mt-8 sm:-mt-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {stats.map((item, idx) => (
          <Card
            key={item.id || idx}
            glassmorphism
            className="p-5 sm:p-6 text-center sm:text-left flex flex-col justify-between border-[#2a2a3e] bg-[#141424]/90 hover:border-purple-500/40 transition-all duration-300 group shadow-xl"
          >
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                {item.label}
              </span>
              <div className="p-2 rounded-xl bg-white/[0.04] border border-white/10 group-hover:bg-purple-500/20 group-hover:border-purple-500/30 transition-colors">
                {getStatIcon(item.icon)}
              </div>
            </div>

            <div className="space-y-1">
              <div className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-white tracking-tight group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-white group-hover:to-purple-200 transition-all">
                {item.value}
              </div>
              <div className="text-[11px] text-slate-400 font-normal truncate">
                Verified Record
              </div>
            </div>
          </Card>
        ))}
      </div>
    </section>
  );
};
