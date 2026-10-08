import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { 
  ArrowRight, 
  ShieldCheck, 
  GraduationCap, 
  Award, 
  ChevronLeft, 
  ChevronRight,
  Play,
  Sparkles,
  Pause,
  Clock
} from 'lucide-react';
import { Button } from '../ui/Button';
import { HeroSlide } from '../../types';
import { fetchHeroSlides, defaultHeroSlides } from '../../lib/dataService';

export const Hero: React.FC = () => {
  const [slides, setSlides] = useState<HeroSlide[]>(defaultHeroSlides);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [loading, setLoading] = useState(true);
  const timerRef = useRef<any>(null);

  useEffect(() => {
    let mounted = true;
    async function loadSlides() {
      try {
        const data = await fetchHeroSlides(true);
        if (mounted && data && data.length > 0) {
          setSlides(data);
        }
      } catch (err) {
        console.warn('Using default hero slides:', err);
      } finally {
        if (mounted) setLoading(false);
      }
    }
    loadSlides();

    const handleUpdate = () => { loadSlides(); };
    window.addEventListener('storage', handleUpdate);
    window.addEventListener('ga_hero_updated', handleUpdate);
    window.addEventListener('ga_data_updated', handleUpdate);

    return () => { 
      mounted = false; 
      window.removeEventListener('storage', handleUpdate);
      window.removeEventListener('ga_hero_updated', handleUpdate);
      window.removeEventListener('ga_data_updated', handleUpdate);
    };
  }, []);

  // Autoplay functionality (5 seconds interval)
  useEffect(() => {
    if (slides.length <= 1 || isPaused) return;

    timerRef.current = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % slides.length);
    }, 5500);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [slides.length, isPaused, currentIndex]);

  const currentSlide = slides[currentIndex] || slides[0] || defaultHeroSlides[0];

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev === 0 ? slides.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % slides.length);
  };

  return (
    <section 
      className="relative min-h-[580px] sm:min-h-[640px] lg:min-h-[720px] flex items-center justify-center overflow-hidden py-12 lg:py-20 select-none"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* Dynamic Slide Background Image with Smooth Crossfade & Dark Gradient Overlays */}
      <div className="absolute inset-0 z-0">
        <div 
          className="absolute inset-0 bg-cover bg-center transition-all duration-1000 transform scale-105"
          style={{
            backgroundImage: `url(${currentSlide.image_url || 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=1600&q=80'})`
          }}
        />
        {/* Dark radial and linear gradient overlay for crisp text readability */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#0d0d17] via-[#0d0d17]/85 to-[#0d0d17]/60" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0f0f12] via-transparent to-[#0d0d17]/50" />
      </div>

      {/* Decorative Glows */}
      <div className="absolute inset-0 pointer-events-none z-[1]">
        <div className="absolute top-1/4 left-1/3 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-purple-600/15 rounded-full blur-[140px]" />
        <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-pink-600/10 rounded-full blur-[120px]" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          
          {/* Main Slide Content Column */}
          <div className="lg:col-span-8 text-center lg:text-left space-y-6">
            
            {/* Top Badge / Subheading Pill */}
            {currentSlide.subheading && (
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-purple-500/15 border border-purple-500/30 text-xs sm:text-sm text-purple-300 shadow-sm backdrop-blur-md animate-fade-in">
                <Sparkles className="w-4 h-4 text-pink-400" />
                <span className="font-semibold">{currentSlide.subheading}</span>
              </div>
            )}

            {/* Dynamic Main Headline */}
            <h1 className="text-3xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-white leading-[1.15] animate-fade-in">
              {currentSlide.heading}
            </h1>

            {/* Dynamic Description */}
            {currentSlide.description && (
              <p className="text-sm sm:text-base md:text-lg text-slate-300 max-w-2xl mx-auto lg:mx-0 leading-relaxed font-normal">
                {currentSlide.description}
              </p>
            )}

            {/* CTA Buttons */}
            <div className="pt-2 flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
              {currentSlide.button1_text && (
                <Link to={currentSlide.button1_link || '/admissions'} className="w-full sm:w-auto">
                  <Button 
                    variant="primary" 
                    size="lg" 
                    className="w-full sm:w-auto bg-gradient-to-r from-purple-600 to-pink-600 hover:opacity-95 shadow-xl shadow-purple-950/40 text-white font-bold"
                    rightIcon={<ArrowRight className="w-4 h-4" />}
                  >
                    {currentSlide.button1_text}
                  </Button>
                </Link>
              )}

              {currentSlide.button2_text && (
                <Link to={currentSlide.button2_link || '/courses'} className="w-full sm:w-auto">
                  <Button 
                    variant="outline" 
                    size="lg" 
                    className="w-full sm:w-auto border-[#3b3b55] hover:bg-white/10"
                  >
                    {currentSlide.button2_text}
                  </Button>
                </Link>
              )}

              <Link to="/celebration-video" className="w-full sm:w-auto">
                <Button 
                  variant="ghost" 
                  size="md" 
                  className="w-full sm:w-auto text-amber-300 hover:text-amber-200 hover:bg-amber-500/10"
                  leftIcon={<Play className="w-3.5 h-3.5 fill-amber-300" />}
                >
                  Results 2025 Video
                </Button>
              </Link>
            </div>

            {/* Key Quality Assurances */}
            <div className="pt-6 border-t border-[#2a2a3e]/60 flex flex-wrap items-center justify-center lg:justify-start gap-6 text-xs text-slate-400">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-purple-400" />
                <span>BISE & FBISE Affiliated</span>
              </div>
              <div className="flex items-center gap-2">
                <Award className="w-4 h-4 text-pink-400" />
                <span>100% Board Pass Rate (A+/A)</span>
              </div>
              <div className="flex items-center gap-2">
                <GraduationCap className="w-4 h-4 text-indigo-400" />
                <span>Scholarships Available</span>
              </div>
            </div>

          </div>

          {/* Right Column: Slide Counter & Interactive Mini Card */}
          <div className="lg:col-span-4 hidden lg:flex flex-col items-end justify-center">
            <div className="p-5 rounded-2xl bg-[#141424]/80 border border-[#2a2a3e] backdrop-blur-md shadow-2xl max-w-xs w-full space-y-4">
              <div className="flex items-center justify-between text-xs text-slate-400 border-b border-[#2a2a3e] pb-3">
                <span className="font-semibold text-purple-300 flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5" /> Featured Banner
                </span>
                <span className="font-mono text-slate-300">
                  {String(currentIndex + 1).padStart(2, '0')} / {String(slides.length).padStart(2, '0')}
                </span>
              </div>
              
              <div className="text-xs text-slate-300 line-clamp-3">
                {currentSlide.heading}
              </div>

              {/* Slider Controls */}
              <div className="flex items-center justify-between pt-2">
                <div className="flex items-center gap-1.5">
                  <button
                    onClick={handlePrev}
                    aria-label="Previous Slide"
                    className="p-2 rounded-lg bg-[#1c1c30] hover:bg-purple-600 text-slate-300 hover:text-white transition-all cursor-pointer border border-[#2a2a3e]"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  <button
                    onClick={handleNext}
                    aria-label="Next Slide"
                    className="p-2 rounded-lg bg-[#1c1c30] hover:bg-purple-600 text-slate-300 hover:text-white transition-all cursor-pointer border border-[#2a2a3e]"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>

                <button
                  onClick={() => setIsPaused(!isPaused)}
                  className="text-[11px] text-slate-400 hover:text-white flex items-center gap-1 transition-colors"
                  title={isPaused ? 'Resume autoplay' : 'Pause autoplay'}
                >
                  {isPaused ? <Play className="w-3 h-3 fill-slate-400" /> : <Pause className="w-3 h-3" />}
                  <span>{isPaused ? 'Paused' : 'Auto'}</span>
                </button>
              </div>
            </div>
          </div>

        </div>

        {/* Mobile / Global Carousel Navigation Bar & Dots Indicator */}
        <div className="mt-8 pt-4 flex items-center justify-between lg:justify-start gap-4">
          <div className="flex items-center gap-2">
            {slides.map((slide, idx) => (
              <button
                key={slide.id || idx}
                onClick={() => setCurrentIndex(idx)}
                aria-label={`Go to slide ${idx + 1}`}
                className={`transition-all rounded-full cursor-pointer ${
                  currentIndex === idx 
                    ? 'w-8 h-2.5 bg-gradient-to-r from-purple-500 to-pink-500 shadow-md shadow-purple-500/50' 
                    : 'w-2.5 h-2.5 bg-slate-600 hover:bg-slate-400'
                }`}
              />
            ))}
          </div>

          <div className="flex lg:hidden items-center gap-2">
            <button
              onClick={handlePrev}
              aria-label="Previous slide"
              className="p-1.5 rounded-lg bg-[#1a1a2e] border border-[#2a2a3e] text-slate-300 hover:text-white transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={handleNext}
              aria-label="Next slide"
              className="p-1.5 rounded-lg bg-[#1a1a2e] border border-[#2a2a3e] text-slate-300 hover:text-white transition-colors"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

      </div>
    </section>
  );
};
