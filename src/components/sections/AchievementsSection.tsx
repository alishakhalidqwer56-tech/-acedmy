import React, { useEffect, useState } from 'react';
import { 
  Trophy, 
  Award, 
  Star, 
  Medal, 
  Sparkles, 
  Calendar 
} from 'lucide-react';
import { Card } from '../ui/Card';
import { SectionTitle } from '../ui/SectionTitle';
import { Achievement } from '../../types';
import { fetchAchievements, defaultAchievements } from '../../lib/dataService';

export const AchievementsSection: React.FC = () => {
  const [achievements, setAchievements] = useState<Achievement[]>(defaultAchievements);

  useEffect(() => {
    let mounted = true;
    async function load() {
      try {
        const data = await fetchAchievements(true);
        if (mounted && data && data.length > 0) {
          setAchievements(data);
        }
      } catch (err) {
        console.warn('Achievements load fallback:', err);
      }
    }
    load();
    return () => { mounted = false; };
  }, []);

  const renderIcon = (iconName?: string | null) => {
    const name = (iconName || '').toLowerCase().trim();
    switch (name) {
      case 'trophy':
        return <Trophy className="w-6 h-6 text-amber-400" />;
      case 'award':
        return <Award className="w-6 h-6 text-purple-400" />;
      case 'star':
        return <Star className="w-6 h-6 text-pink-400" />;
      case 'medal':
        return <Medal className="w-6 h-6 text-cyan-400" />;
      default:
        return <Sparkles className="w-6 h-6 text-purple-400" />;
    }
  };

  return (
    <section className="py-16 lg:py-24 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <SectionTitle
          badge="Distinction & Honors"
          title="Milestones of Academic Excellence"
          subtitle="Honoring exceptional student achievements, national STEM competitions, and BISE board distinction ranks."
        />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {achievements.map((item, idx) => (
            <Card
              key={item.id || idx}
              hoverable
              className="p-6 bg-[#161626] border-[#2a2a3e] flex flex-col justify-between group hover:border-amber-500/40 transition-all duration-300"
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="w-12 h-12 rounded-2xl bg-white/[0.04] border border-white/10 flex items-center justify-center group-hover:scale-110 group-hover:bg-amber-500/10 group-hover:border-amber-500/30 transition-all">
                    {renderIcon(item.icon)}
                  </div>
                  {item.year && (
                    <span className="px-2.5 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-xs font-bold text-amber-300">
                      {item.year}
                    </span>
                  )}
                </div>

                <h3 className="text-base font-bold text-white group-hover:text-amber-200 transition-colors">
                  {item.title}
                </h3>

                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-normal">
                  {item.description}
                </p>
              </div>

              <div className="pt-4 mt-4 border-t border-white/5 text-[11px] text-slate-400 flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-amber-400" />
                <span>Honors Record</span>
              </div>
            </Card>
          ))}
        </div>

      </div>
    </section>
  );
};
