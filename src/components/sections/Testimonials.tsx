import React, { useEffect, useState } from 'react';
import { 
  Quote, 
  Star, 
  MessageSquarePlus, 
  X, 
  CheckCircle2, 
  Sparkles,
  Heart,
  Send,
  UserCheck
} from 'lucide-react';
import { Testimonial } from '../../types';
import { fetchTestimonials, createTestimonial } from '../../lib/dataService';
import { defaultTestimonials } from '../../lib/supabase';
import { Card } from '../ui/Card';
import { SectionTitle } from '../ui/SectionTitle';
import { Button } from '../ui/Button';

export const Testimonials: React.FC = () => {
  const [testimonials, setTestimonials] = useState<Testimonial[]>(defaultTestimonials);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedSuccess, setSubmittedSuccess] = useState(false);

  // Form State
  const [name, setName] = useState('');
  const [role, setRole] = useState('Student');
  const [rating, setRating] = useState(5);
  const [quote, setQuote] = useState('');
  const [avatarUrl, setAvatarUrl] = useState('');

  const loadTestimonials = async () => {
    try {
      const data = await fetchTestimonials();
      if (data && data.length > 0) {
        setTestimonials(data);
      }
    } catch (e) {
      console.warn('Testimonials load fallback:', e);
    }
  };

  useEffect(() => {
    loadTestimonials();

    const handleSync = () => loadTestimonials();
    window.addEventListener('storage', handleSync);
    window.addEventListener('ga_testimonials_updated', handleSync);
    window.addEventListener('ga_data_updated', handleSync);

    return () => {
      window.removeEventListener('storage', handleSync);
      window.removeEventListener('ga_testimonials_updated', handleSync);
      window.removeEventListener('ga_data_updated', handleSync);
    };
  }, []);

  const handleReviewSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !quote.trim()) return;

    setIsSubmitting(true);
    try {
      const newReview = await createTestimonial({
        student_name: name.trim(),
        author: name.trim(),
        student_class: role.trim(),
        role: role.trim(),
        quote: quote.trim(),
        rating,
        year: '2026',
        avatar_url: avatarUrl.trim() || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
      });

      setTestimonials(prev => [newReview, ...prev]);
      setSubmittedSuccess(true);
      setTimeout(() => {
        setSubmittedSuccess(false);
        setIsModalOpen(false);
        setName('');
        setQuote('');
        setRating(5);
        setAvatarUrl('');
      }, 1800);
    } catch (err) {
      console.warn('Review save error:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="py-20 lg:py-28 relative overflow-hidden bg-gradient-to-b from-[#0e0d18] via-[#121124] to-[#0e0d18] border-t border-[#25223a]">
      {/* Background ambient light */}
      <div className="absolute top-1/2 left-1/4 w-96 h-96 bg-purple-600/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 right-1/4 w-96 h-96 bg-pink-600/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header with "Write Review" button */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <SectionTitle
            badge="Voices of Scholars & Parents"
            title="Empowered Journeys & Academic Pride"
            subtitle="Hear directly from our scholars, parents, and alumni on how Girls Academy shaped their future and values."
            align="left"
            className="mb-0"
          />

          <button
            onClick={() => setIsModalOpen(true)}
            className="inline-flex items-center gap-2 px-5 py-3 rounded-2xl bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white font-semibold text-xs sm:text-sm shadow-xl shadow-purple-950/40 hover:scale-105 active:scale-95 transition-all cursor-pointer shrink-0 border border-white/10"
          >
            <MessageSquarePlus className="w-4 h-4" />
            <span>Write a Review / اپنا ریویو دیں</span>
          </button>
        </div>

        {/* Testimonials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
          {testimonials.map((item) => (
            <Card
              key={item.id}
              className="flex flex-col justify-between p-6 sm:p-8 relative border-[#2a2a3e] bg-[#171727]/90 hover:border-purple-500/40 transition-all duration-300 group shadow-lg"
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="w-10 h-10 rounded-xl bg-purple-500/15 border border-purple-500/30 flex items-center justify-center text-purple-400">
                    <Quote className="w-5 h-5 text-pink-400 group-hover:scale-110 transition-transform" />
                  </div>
                  
                  {/* Star Rating Display */}
                  <div className="flex items-center gap-1 bg-amber-500/10 border border-amber-500/20 px-2.5 py-1 rounded-full">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        className={`w-3.5 h-3.5 ${
                          star <= (item.rating || 5)
                            ? 'text-amber-400 fill-amber-400'
                            : 'text-slate-600'
                        }`}
                      />
                    ))}
                  </div>
                </div>

                <p className="text-slate-300 text-sm sm:text-base leading-relaxed italic">
                  "{item.quote}"
                </p>
              </div>

              <div className="mt-6 pt-5 border-t border-[#2a2a3e] flex items-center gap-3.5">
                <img
                  src={item.avatar_url || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80'}
                  alt={item.student_name || item.author || 'Scholar'}
                  onError={(e) => {
                    e.currentTarget.onerror = null;
                    e.currentTarget.src = 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80';
                  }}
                  className="w-11 h-11 rounded-full object-cover border-2 border-purple-500/40 shrink-0"
                />
                <div>
                  <h4 className="text-sm font-bold text-white flex items-center gap-1.5">
                    <span>{item.student_name || item.author}</span>
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                  </h4>
                  <p className="text-xs text-purple-300 font-medium">
                    {item.student_class || item.role}
                  </p>
                </div>
              </div>
            </Card>
          ))}
        </div>

      </div>

      {/* =========================================================================
          SUBMIT REVIEW MODAL
          ========================================================================= */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
          <div className="relative w-full max-w-lg bg-[#181628] border border-purple-500/30 rounded-3xl shadow-2xl p-6 sm:p-8 text-white overflow-hidden">
            
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-4 border-b border-[#2d2947]">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-xl bg-purple-500/20 border border-purple-500/40 flex items-center justify-center text-purple-300">
                  <Sparkles className="w-5 h-5 text-pink-400" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white">Share Your Review</h3>
                  <p className="text-xs text-slate-400">Your feedback inspires future scholars!</p>
                </div>
              </div>

              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {submittedSuccess ? (
              <div className="py-12 text-center space-y-3">
                <div className="w-16 h-16 mx-auto rounded-full bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400 animate-bounce">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <h4 className="text-xl font-bold text-white">Thank You for Your Review!</h4>
                <p className="text-sm text-slate-300">
                  آپ کا ریویو ویب سائٹ پر کامیابی سے شامل کر دیا گیا ہے۔
                </p>
              </div>
            ) : (
              <form onSubmit={handleReviewSubmit} className="mt-5 space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                    Your Full Name / آپ کا نام *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Fatima Tariq / Mrs. Nasreen"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full bg-[#121122] border border-[#2d2947] rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-purple-500"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                      Your Role / تعلق *
                    </label>
                    <select
                      value={role}
                      onChange={(e) => setRole(e.target.value)}
                      className="w-full bg-[#121122] border border-[#2d2947] rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-purple-500"
                    >
                      <option value="Student (Class 10)">Student (Class 10)</option>
                      <option value="Student (FSc Pre-Medical)">Student (FSc Pre-Medical)</option>
                      <option value="Student (ICS Computer)">Student (ICS Computer Science)</option>
                      <option value="Proud Parent">Proud Parent / ولی</option>
                      <option value="Academy Alumna">Academy Alumna (Graduate)</option>
                      <option value="Campus Visitor">Campus Visitor</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                      Rating / درجہ بندی *
                    </label>
                    <div className="flex items-center gap-1.5 py-2 px-3 bg-[#121122] border border-[#2d2947] rounded-xl">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          type="button"
                          onClick={() => setRating(star)}
                          className="cursor-pointer transition-transform hover:scale-125"
                        >
                          <Star
                            className={`w-5 h-5 ${
                              star <= rating
                                ? 'text-amber-400 fill-amber-400'
                                : 'text-slate-600'
                            }`}
                          />
                        </button>
                      ))}
                      <span className="text-xs font-bold text-amber-400 ml-1.5">{rating}.0 / 5</span>
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                    Your Review / تاثرات *
                  </label>
                  <textarea
                    required
                    rows={4}
                    placeholder="Describe your learning experience, faculty mentorship, campus discipline, or board exam preparation..."
                    value={quote}
                    onChange={(e) => setQuote(e.target.value)}
                    className="w-full bg-[#121122] border border-[#2d2947] rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-purple-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                    Profile Photo URL (Optional)
                  </label>
                  <input
                    type="url"
                    placeholder="https://images.unsplash.com/... or leave blank for default avatar"
                    value={avatarUrl}
                    onChange={(e) => setAvatarUrl(e.target.value)}
                    className="w-full bg-[#121122] border border-[#2d2947] rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-purple-500"
                  />
                </div>

                <div className="pt-2 flex items-center justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="px-4 py-2.5 rounded-xl border border-[#2d2947] text-xs text-slate-400 hover:text-white hover:bg-white/5 transition-colors cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting || !name.trim() || !quote.trim()}
                    className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white font-semibold text-xs shadow-lg shadow-purple-900/30 flex items-center gap-2 cursor-pointer disabled:opacity-50"
                  >
                    {isSubmitting ? (
                      <span>Publishing...</span>
                    ) : (
                      <>
                        <Send className="w-3.5 h-3.5" />
                        <span>Publish Review</span>
                      </>
                    )}
                  </button>
                </div>
              </form>
            )}

          </div>
        </div>
      )}
    </section>
  );
};
