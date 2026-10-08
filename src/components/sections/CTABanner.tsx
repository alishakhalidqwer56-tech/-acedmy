import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Sparkles, Send } from 'lucide-react';
import { Button } from '../ui/Button';

export const CTABanner: React.FC = () => {
  return (
    <section className="py-16 lg:py-20 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative rounded-3xl overflow-hidden bg-gradient-to-r from-[#21153b] via-[#1a142e] to-[#2e1329] border border-[#3b235d] p-8 sm:p-12 lg:p-16 shadow-2xl text-center lg:text-left">
          
          {/* Subtle background glow */}
          <div className="absolute top-0 right-0 w-80 h-80 bg-pink-500/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-80 h-80 bg-purple-500/15 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-8 space-y-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/30 text-xs font-semibold uppercase tracking-wider">
                <Sparkles className="w-3.5 h-3.5 text-pink-400" />
                <span>Admissions 2026-2027</span>
              </div>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight leading-tight">
                Ready to Start Your Journey <br className="hidden sm:inline" />
                at <span className="text-gradient">Girls Academy</span>?
              </h2>
              <p className="text-sm sm:text-base text-slate-300 max-w-2xl leading-relaxed">
                Take the first step toward transformative learning, university scholarship preparation, and a lifelong sisterhood of visionary leaders.
              </p>
            </div>

            <div className="lg:col-span-4 flex flex-col sm:flex-row lg:flex-col items-center justify-center lg:items-end gap-3.5">
              <Link to="/admissions" className="w-full sm:w-auto lg:w-full">
                <Button
                  variant="primary"
                  size="lg"
                  className="w-full shadow-lg shadow-purple-950/60"
                  rightIcon={<ArrowRight className="w-4 h-4" />}
                >
                  Apply for Admission
                </Button>
              </Link>
              <Link to="/contact" className="w-full sm:w-auto lg:w-full">
                <Button
                  variant="outline"
                  size="md"
                  className="w-full"
                  leftIcon={<Send className="w-4 h-4 text-purple-400" />}
                >
                  Schedule Campus Visit
                </Button>
              </Link>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};
