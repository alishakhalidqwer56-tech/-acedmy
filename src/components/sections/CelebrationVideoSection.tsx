import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Trophy, 
  Award, 
  Play, 
  Sparkles, 
  ArrowRight, 
  CheckCircle2,
  Users
} from 'lucide-react';
import { CelebrationVideoPlayer } from '../video/CelebrationVideoPlayer';
import { Button } from '../ui/Button';

export const CelebrationVideoSection: React.FC = () => {
  return (
    <section className="py-16 sm:py-24 bg-gradient-to-b from-[#0c0b14] via-[#120f22] to-[#0c0b14] relative overflow-hidden border-y border-[#26223b]">
      {/* Glow Effects */}
      <div className="absolute top-1/4 left-1/3 w-96 h-96 bg-purple-600/15 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-amber-500/10 rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-12">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-semibold shadow-sm">
            <Trophy className="w-4 h-4 text-amber-400" />
            <span>Official BISE Annual Results Celebration Film</span>
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight">
            Watch Our <span className="text-gold-gradient">Historic Board Distinction</span> Film
          </h2>

          <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
            Experience the thrilling 60-second celebration honoring our 1st position district topper Fatima Zahra, gold medalists, proud parents, and our devoted faculty mentors.
          </p>
        </div>

        {/* Video Cinema Player Card */}
        <div className="max-w-5xl mx-auto rounded-3xl p-2 sm:p-4 bg-gradient-to-b from-purple-500/20 via-[#19152b] to-[#120f22] border border-purple-500/30 shadow-2xl">
          <CelebrationVideoPlayer autoPlay={false} />
        </div>

        {/* Video Footer Highlights & CTA */}
        <div className="max-w-4xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-6 p-6 rounded-2xl bg-[#161426] border border-[#2c2842]">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center shrink-0">
              <Award className="w-6 h-6 text-amber-400" />
            </div>
            <div>
              <h4 className="text-white font-bold text-sm">Want to see all position holders & full ceremony?</h4>
              <p className="text-xs text-slate-400">View individual topper scorecards, parent feedback, and admission benefits.</p>
            </div>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <Link to="/celebration-video">
              <Button variant="primary" size="sm" className="bg-gradient-to-r from-amber-500 to-purple-600 hover:from-amber-600 hover:to-purple-700 text-white font-semibold flex items-center gap-2">
                <span>View Full Showcase</span>
                <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};
