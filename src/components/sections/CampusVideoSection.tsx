import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  Play, 
  Sparkles, 
  Trophy, 
  Award, 
  GraduationCap, 
  Maximize2, 
  ArrowRight, 
  CheckCircle2, 
  Star,
  Film,
  Volume2
} from 'lucide-react';
import { CelebrationVideoPlayer } from '../video/CelebrationVideoPlayer';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import { Card } from '../ui/Card';

export const CampusVideoSection: React.FC = () => {
  const [isPlayingInline, setIsPlayingInline] = useState(false);
  const [aspectRatio, setAspectRatio] = useState<'16:9' | '9:16'>('16:9');

  return (
    <section className="py-16 sm:py-24 relative overflow-hidden bg-gradient-to-b from-[#0f0f15] via-[#141422] to-[#0f0f15]">
      {/* Background Ambience Glow */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-purple-600/10 rounded-full blur-[140px]" />
        <div className="absolute top-1/4 right-1/4 w-[400px] h-[400px] bg-pink-600/10 rounded-full blur-[120px]" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-12 sm:mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-purple-500/15 border border-purple-500/30 text-purple-300 text-xs font-semibold">
            <Sparkles className="w-3.5 h-3.5 text-pink-400" />
            <span>Official Campus Broadcast & Video Tour</span>
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight">
            Celebration of <span className="text-gradient">Academic Glory</span>
          </h2>

          <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
            Witness our female scholars achieving top positions in Federal Board examinations, pioneering scientific research, and receiving prestigious gold medals.
          </p>
        </div>

        {/* Video Showcase Card */}
        <div className="max-w-5xl mx-auto">
          <div className="relative rounded-3xl overflow-hidden border border-[#2a2a3e] bg-[#12121f] shadow-2xl shadow-purple-950/30">
            {isPlayingInline ? (
              <div className="p-2 sm:p-4 bg-[#0a0a10]">
                <div className="flex items-center justify-between pb-3 px-2 border-b border-[#2a2a3e]/60 mb-3">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-pulse" />
                    <span className="text-xs font-bold text-white uppercase tracking-wider">
                      Now Playing: Academy Honors Reel
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setAspectRatio(aspectRatio === '16:9' ? '9:16' : '16:9')}
                      className="px-3 py-1 rounded-lg text-xs font-semibold bg-white/5 hover:bg-white/10 text-slate-300 border border-[#2a2a3e] transition-colors"
                    >
                      {aspectRatio === '16:9' ? 'Switch to Reel (9:16)' : 'Switch to Widescreen (16:9)'}
                    </button>
                    <Link
                      to="/celebration"
                      className="px-3 py-1 rounded-lg text-xs font-semibold bg-purple-600 hover:bg-purple-700 text-white flex items-center gap-1 transition-colors"
                    >
                      <Maximize2 className="w-3 h-3" /> Full Hub
                    </Link>
                  </div>
                </div>

                <div className="flex justify-center">
                  <div className={aspectRatio === '9:16' ? 'max-w-sm w-full' : 'w-full'}>
                    <CelebrationVideoPlayer 
                      initialAspectRatio={aspectRatio}
                      autoPlay={true}
                    />
                  </div>
                </div>
              </div>
            ) : (
              <div className="relative aspect-video w-full group cursor-pointer" onClick={() => setIsPlayingInline(true)}>
                {/* Background Poster Image */}
                <img
                  src="https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=1600&q=80"
                  alt="Girls Academy Celebration Video Thumbnail"
                  className="w-full h-full object-cover brightness-[0.45] group-hover:scale-102 transition-transform duration-700"
                />

                {/* Gradient Overlays */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#0d0d16] via-transparent to-black/40" />
                <div className="absolute inset-0 bg-gradient-to-r from-[#0d0d16]/80 via-transparent to-[#0d0d16]/80" />

                {/* Big Glowing Play Button */}
                <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center space-y-4">
                  <div className="relative group/btn">
                    <div className="absolute inset-0 rounded-full bg-gradient-to-r from-purple-600 to-pink-600 blur-xl opacity-70 group-hover/btn:opacity-100 transition-opacity animate-pulse" />
                    <button
                      type="button"
                      className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-gradient-to-tr from-purple-600 to-pink-500 text-white flex items-center justify-center shadow-2xl shadow-purple-950 group-hover/btn:scale-110 transition-transform duration-300"
                    >
                      <Play className="w-8 h-8 sm:w-10 sm:h-10 fill-white text-white ml-1" />
                    </button>
                  </div>

                  <div className="space-y-1.5 max-w-md">
                    <h3 className="text-xl sm:text-2xl font-bold text-white">
                      Watch Annual Honors & Celebration Video
                    </h3>
                    <p className="text-xs sm:text-sm text-slate-300">
                      Interactive 60-second celebration featuring gold medalists, board distinctions, STEM laboratories, and ceremonies.
                    </p>
                  </div>

                  <div className="inline-flex items-center gap-2 text-xs font-semibold text-purple-300 bg-black/50 px-4 py-1.5 rounded-full border border-purple-500/30 backdrop-blur-md">
                    <Volume2 className="w-3.5 h-3.5 text-pink-400" />
                    <span>Click to Play with Cinematic Audio & Fireworks</span>
                  </div>
                </div>

                {/* Bottom Overlay Badges */}
                <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between text-xs text-slate-300 pointer-events-none">
                  <div className="flex items-center gap-2">
                    <Badge variant="purple">60s Full HD</Badge>
                    <Badge variant="pink">Audio & Fireworks</Badge>
                  </div>
                  <span className="text-[11px] text-slate-400 hidden sm:inline">
                    Click anywhere to start video
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* Quick Metrics Bar Under Video */}
          <div className="mt-8 grid grid-cols-2 sm:grid-cols-4 gap-4">
            <Card className="p-4 text-center bg-[#151524] border-[#2a2a3e]">
              <div className="text-xl sm:text-2xl font-extrabold text-amber-400">1st Position</div>
              <div className="text-[11px] text-slate-400 mt-0.5">Federal Board HSSC 2026</div>
            </Card>
            <Card className="p-4 text-center bg-[#151524] border-[#2a2a3e]">
              <div className="text-xl sm:text-2xl font-extrabold text-purple-400">14 Gold Medals</div>
              <div className="text-[11px] text-slate-400 mt-0.5">Academic & Science Olympiads</div>
            </Card>
            <Card className="p-4 text-center bg-[#151524] border-[#2a2a3e]">
              <div className="text-xl sm:text-2xl font-extrabold text-pink-400">100% Pass Rate</div>
              <div className="text-[11px] text-slate-400 mt-0.5">Matric & Pre-Medical Cohort</div>
            </Card>
            <Card className="p-4 text-center bg-[#151524] border-[#2a2a3e]">
              <div className="text-xl sm:text-2xl font-extrabold text-emerald-400">PKR 5M+</div>
              <div className="text-[11px] text-slate-400 mt-0.5">Merit Scholarships Awarded</div>
            </Card>
          </div>

          {/* Link to Dedicated Celebration Experience */}
          <div className="mt-8 text-center">
            <Link
              to="/celebration"
              className="inline-flex items-center gap-2 text-xs sm:text-sm font-semibold text-purple-400 hover:text-purple-300 transition-colors"
            >
              <span>Explore full celebration broadcast, topper dossiers & video downloads</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};
