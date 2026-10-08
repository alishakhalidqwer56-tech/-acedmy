import React, { useState, useEffect } from 'react';
import { Calendar, MapPin, Clock, ArrowRight, User, CheckCircle2, Image as ImageIcon, Sparkles } from 'lucide-react';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { SectionTitle } from '../../components/ui/SectionTitle';
import { fetchEvents, fetchGalleryItems, defaultEvents } from '../../lib/dataService';
import { EventItem, GalleryItem } from '../../types';

export const EventsPage: React.FC = () => {
  const [events, setEvents] = useState<EventItem[]>(defaultEvents);
  const [gallery, setGallery] = useState<GalleryItem[]>([]);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [rsvpEvent, setRsvpEvent] = useState<string | null>(null);
  const [rsvpSuccess, setRsvpSuccess] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    async function load() {
      try {
        const [evData, galData] = await Promise.all([
          fetchEvents(),
          fetchGalleryItems()
        ]);
        if (mounted) {
          if (evData && evData.length > 0) setEvents(evData);
          if (galData && galData.length > 0) setGallery(galData);
        }
      } catch (e) {
        console.warn('Events load fallback:', e);
      } finally {
        if (mounted) setLoading(false);
      }
    }
    load();

    const handleUpdate = () => { load(); };
    window.addEventListener('storage', handleUpdate);
    window.addEventListener('ga_data_updated', handleUpdate);

    return () => { 
      mounted = false; 
      window.removeEventListener('storage', handleUpdate);
      window.removeEventListener('ga_data_updated', handleUpdate);
    };
  }, []);

  const categories = ['All', 'Upcoming', 'Past', 'Academic', 'Cultural', 'Sports'];

  const filteredEvents = events.filter((e) => {
    if (selectedCategory === 'All') return true;
    if (selectedCategory === 'Upcoming') return e.is_upcoming !== false;
    if (selectedCategory === 'Past') return e.is_upcoming === false;
    return (e.category || '').toLowerCase() === selectedCategory.toLowerCase();
  });

  const handleRsvp = (id: string) => {
    setRsvpEvent(id);
    setTimeout(() => {
      setRsvpSuccess(true);
      setTimeout(() => {
        setRsvpSuccess(false);
        setRsvpEvent(null);
      }, 3000);
    }, 600);
  };

  return (
    <div className="py-12 sm:py-16 space-y-16">
      {/* Hero */}
      <section className="px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto rounded-3xl bg-gradient-to-r from-[#171426] via-[#151522] to-[#201328] border border-[#2a2a3e] p-8 sm:p-14 text-center relative overflow-hidden">
          <div className="relative z-10 max-w-3xl mx-auto space-y-4">
            <span className="text-xs uppercase tracking-widest font-semibold px-3 py-1 rounded-full bg-purple-500/15 text-purple-300 border border-purple-500/30">
              Campus Highlights & Convocations
            </span>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight">
              Events & <span className="text-gradient">Academic Symposiums</span>
            </h1>
            <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
              Explore Girls Academy campus seminars, convocation ceremonies, STEM exhibitions, and inter-college academic competitions.
            </p>
          </div>
        </div>
      </section>

      {/* Category Filter */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-wrap items-center justify-center gap-2">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 rounded-xl text-xs font-medium transition-all ${
                selectedCategory === cat
                  ? 'bg-purple-600 text-white shadow-lg shadow-purple-900/30'
                  : 'bg-[#181827] text-slate-300 border border-[#2a2a3e] hover:border-purple-500/40'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </section>

      {/* Event Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {filteredEvents.map((event) => (
            <Card
              key={event.id}
              hoverable
              className="p-0 overflow-hidden bg-[#181827] border-[#2a2a3e] flex flex-col justify-between group"
            >
              <div>
                {/* Event Image */}
                <div className="relative aspect-[16/9] w-full overflow-hidden bg-black/40">
                  <img
                    src={event.image_url || 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=800&q=80'}
                    alt={event.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute top-3 right-3 flex gap-1.5">
                    <Badge variant={event.is_upcoming !== false ? 'purple' : 'slate'}>
                      {event.is_upcoming !== false ? 'Upcoming' : 'Past Event'}
                    </Badge>
                  </div>
                </div>

                <div className="p-6 space-y-4">
                  <h3 className="text-lg font-bold text-white group-hover:text-purple-300 transition-colors">
                    {event.title}
                  </h3>

                  <div className="space-y-2 text-xs text-slate-300">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-3.5 h-3.5 text-pink-400 shrink-0" />
                      <span>{event.date || event.event_date ? new Date(event.date || event.event_date!).toLocaleDateString() : 'Scheduled'}</span>
                    </div>
                    {event.location && (
                      <div className="flex items-center gap-2">
                        <MapPin className="w-3.5 h-3.5 text-purple-400 shrink-0" />
                        <span>{event.location}</span>
                      </div>
                    )}
                  </div>

                  <p className="text-xs sm:text-sm text-slate-400 leading-relaxed line-clamp-3">
                    {event.description}
                  </p>
                </div>
              </div>

              <div className="p-6 pt-0 mt-2">
                {rsvpSuccess && rsvpEvent === event.id ? (
                  <div className="p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-center text-xs text-emerald-300 font-semibold flex items-center justify-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4" /> RSVP Confirmed!
                  </div>
                ) : (
                  <Button
                    variant={event.is_upcoming !== false ? 'primary' : 'outline'}
                    size="sm"
                    className="w-full"
                    onClick={() => handleRsvp(event.id)}
                  >
                    {event.is_upcoming !== false ? 'RSVP / Register Interest' : 'View Highlights'}
                  </Button>
                )}
              </div>
            </Card>
          ))}
        </div>
      </section>

      {/* Event Photos & Campus Gallery Section */}
      {gallery.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
          <SectionTitle
            badge="Visual Gallery"
            title="Event Photos & Campus Life"
            subtitle="Memorable moments from academic debates, science exhibitions, sports galas, and guest lectures."
          />

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {gallery.map((item) => (
              <div 
                key={item.id} 
                className="relative aspect-square rounded-2xl overflow-hidden border border-[#2a2a3e] bg-[#161625] group hover:border-purple-500/40 transition-all shadow-md"
              >
                <img
                  src={item.media_url}
                  alt={item.title || 'Campus Moment'}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-3">
                  <span className="text-xs font-semibold text-white truncate">{item.title || 'Campus Event Photo'}</span>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

    </div>
  );
};
