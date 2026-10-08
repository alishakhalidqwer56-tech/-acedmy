import React, { useEffect, useState } from 'react';
import { 
  Award, 
  Heart, 
  ShieldCheck, 
  Monitor, 
  BookOpen, 
  Globe, 
  Sparkles, 
  CheckCircle2 
} from 'lucide-react';
import { Card } from '../ui/Card';
import { SectionTitle } from '../ui/SectionTitle';
import { CoreValue } from '../../types';
import { fetchCoreValues, defaultCoreValues } from '../../lib/dataService';

export const CoreValuesSection: React.FC = () => {
  const [values, setValues] = useState<CoreValue[]>(defaultCoreValues);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    async function load() {
      try {
        const data = await fetchCoreValues(true);
        if (mounted && data && data.length > 0) {
          setValues(data);
        }
      } catch (err) {
        console.warn('Falling back to default core values:', err);
      } finally {
        if (mounted) setLoading(false);
      }
    }
    load();
    return () => { mounted = false; };
  }, []);

  const renderIcon = (iconName?: string | null) => {
    const name = (iconName || '').toLowerCase().trim();
    switch (name) {
      case 'award':
        return <Award className="w-6 h-6 text-purple-400" />;
      case 'heart':
        return <Heart className="w-6 h-6 text-pink-400" />;
      case 'shield':
        return <ShieldCheck className="w-6 h-6 text-emerald-400" />;
      case 'monitor':
      case 'computer':
        return <Monitor className="w-6 h-6 text-cyan-400" />;
      case 'book':
        return <BookOpen className="w-6 h-6 text-indigo-400" />;
      case 'globe':
        return <Globe className="w-6 h-6 text-blue-400" />;
      default:
        return <Sparkles className="w-6 h-6 text-amber-400" />;
    }
  };

  return (
    <section className="py-20 lg:py-28 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <SectionTitle
          badge="Foundational Pillars"
          title="Our Core Institutional Values"
          subtitle="A steadfast commitment to moral integrity, academic brilliance, and holistic character mentorship for every female student."
        />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
          {values.map((val, idx) => (
            <Card
              key={val.id || idx}
              hoverable
              className="p-6 sm:p-7 flex flex-col justify-between border-[#2a2a3e] bg-[#171727] group hover:border-purple-500/40 transition-all duration-300"
            >
              <div className="space-y-4">
                <div className="w-12 h-12 rounded-2xl bg-white/[0.04] border border-white/10 flex items-center justify-center group-hover:scale-110 group-hover:bg-purple-600/20 group-hover:border-purple-500/30 transition-all">
                  {renderIcon(val.icon)}
                </div>

                <h3 className="text-lg font-bold text-white group-hover:text-purple-300 transition-colors">
                  {val.title}
                </h3>

                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-normal">
                  {val.description}
                </p>
              </div>

              <div className="pt-4 mt-4 border-t border-white/5 flex items-center gap-1.5 text-[11px] text-purple-400 font-semibold">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Pillar {idx + 1}</span>
              </div>
            </Card>
          ))}
        </div>

      </div>
    </section>
  );
};
