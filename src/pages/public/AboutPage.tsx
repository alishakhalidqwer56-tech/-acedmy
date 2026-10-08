import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  Compass, 
  Target, 
  Sparkles, 
  ShieldCheck, 
  Heart, 
  Globe, 
  Award, 
  Quote,
  CheckCircle2,
  Users,
  GraduationCap,
  ArrowRight,
  BookOpen,
  Trophy,
  Star,
  Monitor
} from 'lucide-react';
import { Card } from '../../components/ui/Card';
import { SectionTitle } from '../../components/ui/SectionTitle';
import { useSite } from '../../context/SiteContext';
import { 
  fetchCoreValues, 
  fetchAchievements, 
  fetchQuickStats, 
  fetchFacultyMembers,
  defaultCoreValues,
  defaultAchievements,
  defaultQuickStats
} from '../../lib/dataService';
import { CoreValue, Achievement, QuickStat } from '../../types';

export const AboutPage: React.FC = () => {
  const { settings } = useSite();
  const [coreValues, setCoreValues] = useState<CoreValue[]>(defaultCoreValues);
  const [achievements, setAchievements] = useState<Achievement[]>(defaultAchievements);
  const [stats, setStats] = useState<QuickStat[]>(defaultQuickStats);
  const [faculty, setFaculty] = useState<any[]>([]);

  useEffect(() => {
    let mounted = true;
    async function loadData() {
      try {
        const [cv, ach, qs, fac] = await Promise.all([
          fetchCoreValues(true),
          fetchAchievements(true),
          fetchQuickStats(true),
          fetchFacultyMembers()
        ]);
        if (mounted) {
          if (cv && cv.length > 0) setCoreValues(cv);
          if (ach && ach.length > 0) setAchievements(ach);
          if (qs && qs.length > 0) setStats(qs);
          if (fac && fac.length > 0) setFaculty(fac.slice(0, 4));
        }
      } catch (e) {
        console.warn('Error loading About page dynamic data:', e);
      }
    }
    loadData();
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
      case 'trophy':
        return <Trophy className="w-6 h-6 text-amber-400" />;
      case 'star':
        return <Star className="w-6 h-6 text-amber-400" />;
      case 'globe':
        return <Globe className="w-6 h-6 text-blue-400" />;
      default:
        return <Sparkles className="w-6 h-6 text-purple-400" />;
    }
  };

  return (
    <div className="py-12 sm:py-16 space-y-20 lg:space-y-28">
      {/* 1. Hero Banner with Page Title Overlay */}
      <section className="relative px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto relative rounded-3xl overflow-hidden border border-[#2a2a3e] bg-[#161626]">
          <div className="relative aspect-[21/9] min-h-[300px] sm:min-h-[380px] w-full overflow-hidden">
            <img
              src={settings.hero_image_url || 'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?auto=format&fit=crop&w=1600&q=80'}
              alt="Girls Academy Campus Architecture"
              className="w-full h-full object-cover brightness-50"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#0f0f16] via-[#0f0f16]/60 to-transparent" />
            
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-6 sm:p-12">
              <span className="text-xs uppercase tracking-widest font-semibold px-3 py-1 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/30 mb-4">
                Our Heritage & Purpose
              </span>
              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold text-white tracking-tight">
                About <span className="text-gradient">{settings.school_name || 'Girls Academy'}</span>
              </h1>
              <p className="mt-4 text-sm sm:text-base md:text-lg text-slate-300 max-w-2xl leading-relaxed">
                {settings.academy_tagline || settings.tagline || 'Quality Education — Inspiring Women Leaders'}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Academy Story */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          <div className="lg:col-span-6 space-y-5">
            <div className="inline-flex items-center gap-2 text-xs font-semibold text-purple-400 uppercase tracking-widest">
              <Sparkles className="w-4 h-4 text-pink-400" />
              <span>Academic Heritage & Excellence</span>
            </div>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white tracking-tight">
              A Legacy of Uncompromising Ambition & Scholastic Innovation
            </h2>
            <div className="text-sm sm:text-base text-slate-300 space-y-4 leading-relaxed font-normal">
              <p>
                {settings.about_story || 'Empowering future women leaders through academic excellence, character building, and world-class STEM and humanities mentorship.'}
              </p>
              <p>
                At Girls Academy, students are nurtured within an environment tailored exclusively to female scholastic ambition. Our comprehensive curriculum prepares young scholars for distinction in BISE Board examinations, MDCAT, ECAT, and top university admissions.
              </p>
            </div>
          </div>

          <div className="lg:col-span-6 relative">
            <div className="relative rounded-2xl overflow-hidden border border-[#2a2a3e] p-2 bg-[#1b1b2a] shadow-xl">
              <img
                src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=1000&q=80"
                alt="Students collaborating at Girls Academy"
                className="rounded-xl w-full object-cover aspect-[4/3]"
              />
              
              {/* Quick Stats Grid Under Story Photo */}
              <div className="p-4 grid grid-cols-2 sm:grid-cols-4 gap-3 text-center border-t border-[#2a2a3e] mt-2">
                {stats.map((s, idx) => (
                  <div key={s.id || idx}>
                    <div className="text-base sm:text-lg font-bold text-white">{s.value}</div>
                    <div className="text-[10px] text-slate-400 truncate">{s.label}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Mission & Vision */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionTitle
          badge="Guiding Principles"
          title="Our Mission & Strategic Vision"
          subtitle="Clear commitments driving every classroom discussion, laboratory experiment, and campus initiative."
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
          {/* Mission Card */}
          <Card
            glassmorphism
            className="p-8 sm:p-10 border-purple-500/30 flex flex-col justify-between space-y-6 bg-[#161426]"
          >
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-purple-500/20 border border-purple-500/30 flex items-center justify-center text-purple-400">
                <Target className="w-6 h-6" />
              </div>
              <h3 className="text-2xl font-bold text-white">Our Mission</h3>
              <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
                {settings.mission_statement || 'To educate, inspire, and elevate talented young women into visionary leaders of high moral character, equipped with intellectual dexterity, technical mastery, and courageous civic purpose.'}
              </p>
            </div>
            <ul className="space-y-2.5 text-xs sm:text-sm text-slate-400 border-t border-[#2a2a3e] pt-4">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-purple-400 shrink-0" />
                <span>Foster fearlessness in mathematics, engineering, and medical sciences</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-purple-400 shrink-0" />
                <span>Cultivate articulate voice through competitive oratory and debate</span>
              </li>
            </ul>
          </Card>

          {/* Vision Card */}
          <Card
            glassmorphism
            className="p-8 sm:p-10 border-pink-500/30 flex flex-col justify-between space-y-6 bg-[#161426]"
          >
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-pink-500/20 border border-pink-500/30 flex items-center justify-center text-pink-400">
                <Compass className="w-6 h-6" />
              </div>
              <h3 className="text-2xl font-bold text-white">Our Vision</h3>
              <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
                {settings.vision_statement || 'To be the preeminent institution for female intellectual development — establishing an enduring standard where every graduate breaks historical barriers across science, law, arts, and technology.'}
              </p>
            </div>
            <ul className="space-y-2.5 text-xs sm:text-sm text-slate-400 border-t border-[#2a2a3e] pt-4">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-pink-400 shrink-0" />
                <span>Establish advanced STEM research and digital learning facilities</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-pink-400 shrink-0" />
                <span>Ensure merit scholarships for academically exceptional young women</span>
              </li>
            </ul>
          </Card>
        </div>
      </section>

      {/* 4. Core Values Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionTitle
          badge="Pillars of Character"
          title="Our Core Values"
          subtitle="Timeless virtues instilled in every scholar from matriculation through graduation."
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {coreValues.map((val, idx) => (
            <Card
              key={val.id || idx}
              className="p-6 bg-[#181826] border-[#2a2a3e] flex flex-col justify-between hover:border-purple-500/40 transition-colors"
            >
              <div>
                <div className="p-3 w-fit rounded-xl bg-white/[0.04] border border-[#2a2a3e] mb-4">
                  {renderIcon(val.icon)}
                </div>
                <h4 className="text-lg font-bold text-white mb-2">{val.title}</h4>
                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-normal">
                  {val.description}
                </p>
              </div>
            </Card>
          ))}
        </div>
      </section>

      {/* 5. Institutional Achievements */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionTitle
          badge="Honors & Records"
          title="Institutional Achievements"
          subtitle="Historic milestones of board positions, science fairs, and national distinction."
        />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {achievements.map((item, idx) => (
            <Card
              key={item.id || idx}
              className="p-6 bg-[#161626] border-[#2a2a3e] flex flex-col justify-between hover:border-amber-500/40 transition-all"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="p-2.5 rounded-xl bg-white/[0.04] border border-white/10">
                    {renderIcon(item.icon)}
                  </div>
                  {item.year && (
                    <span className="px-2.5 py-0.5 rounded-full bg-amber-500/15 text-amber-300 text-xs font-bold border border-amber-500/20">
                      {item.year}
                    </span>
                  )}
                </div>
                <h4 className="text-base font-bold text-white">{item.title}</h4>
                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">{item.description}</p>
              </div>
            </Card>
          ))}
        </div>
      </section>

      {/* 6. Principal's Message */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="rounded-3xl bg-[#1a1a2b] border border-[#2a2a3e] p-8 sm:p-12 lg:p-16 relative overflow-hidden shadow-2xl">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            
            <div className="lg:col-span-5 flex justify-center">
              <div className="relative w-64 sm:w-72 aspect-[3/4] rounded-2xl overflow-hidden border-2 border-purple-500/30 shadow-2xl">
                <img
                  src={settings.principal_photo_url || 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=600&q=80'}
                  alt={settings.principal_name || 'Principal'}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                <div className="absolute bottom-4 left-4 right-4 text-center">
                  <h4 className="text-lg font-bold text-white">{settings.principal_name || 'Mrs. Raheela Perveen'}</h4>
                  <p className="text-xs text-purple-300">{settings.principal_designation || 'Principal & Head of Institution'}</p>
                </div>
              </div>
            </div>

            <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/20 text-purple-300 text-xs font-semibold">
                <Quote className="w-3.5 h-3.5 text-pink-400" />
                <span>Message from Leadership</span>
              </div>
              <h3 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
                "Quality education, strong values, and a bright future are the right of every daughter."
              </h3>
              <div className="text-sm sm:text-base text-slate-300 space-y-4 leading-relaxed font-normal">
                <p>
                  {settings.principal_message || 'We firmly believe that every young woman possesses boundless potential that blooms with dedicated mentorship. Our faculty strives each day to cultivate confident scholars who excel academically and lead ethically.'}
                </p>
              </div>

              <div className="pt-2">
                <Link to="/contact">
                  <button className="px-5 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-semibold shadow-lg shadow-purple-900/40 transition-colors">
                    Schedule an Appointment with Administration →
                  </button>
                </Link>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 7. Faculty Team Snippet */}
      {faculty.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionTitle
            badge="Academic Mentors"
            title="Meet Our Distinguished Faculty"
            subtitle="Devoted educators with masters and doctoral credentials shaping the next generation."
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {faculty.map((f) => (
              <Card key={f.id} className="p-5 text-center bg-[#171727] border-[#2a2a3e] hover:border-purple-500/40 transition-all">
                <img
                  src={f.photo_url || 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=400&q=80'}
                  alt={f.full_name}
                  className="w-20 h-20 rounded-full mx-auto object-cover border-2 border-purple-500/40 mb-3"
                />
                <h4 className="text-sm font-bold text-white">{f.full_name}</h4>
                <p className="text-xs text-purple-300 mt-0.5">{f.department || 'Faculty Teacher'}</p>
                <p className="text-[11px] text-slate-400 mt-1">{f.qualification || 'M.Phil / Master'}</p>
              </Card>
            ))}
          </div>

          <div className="text-center mt-8">
            <Link to="/faculty" className="inline-flex items-center gap-2 text-xs font-semibold text-purple-400 hover:text-purple-300 transition-colors">
              <span>View All Department Faculty & Mentors</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </section>
      )}

    </div>
  );
};
