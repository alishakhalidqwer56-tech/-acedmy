import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Calendar, MapPin, ArrowRight, Clock } from 'lucide-react';
import { EventItem } from '../../types';
import { fetchEvents, defaultEvents } from '../../lib/dataService';
import { Card } from '../ui/Card';
import { SectionTitle } from '../ui/SectionTitle';
import { Button } from '../ui/Button';

export const LatestEvents: React.FC = () => {
  const [events, setEvents] = useState<EventItem[]>(defaultEvents.slice(0, 3));

  const loadEvents = async () => {
    try {
      const data = await fetchEvents();
      if (data && data.length > 0) {
        setEvents(data.slice(0, 3));
      }
    } catch (err) {
      console.warn('Failed to load events, using defaults:', err);
    }
  };

  useEffect(() => {
    loadEvents();

    const handleUpdate = () => { loadEvents(); };
    window.addEventListener('storage', handleUpdate);
    window.addEventListener('ga_data_updated', handleUpdate);

    return () => {
      window.removeEventListener('storage', handleUpdate);
      window.removeEventListener('ga_data_updated', handleUpdate);
    };
  }, []);

  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return {
        month: date.toLocaleString('default', { month: 'short' }).toUpperCase(),
        day: date.getDate(),
        year: date.getFullYear(),
        full: date.toLocaleDateString('default', { month: 'long', day: 'numeric', year: 'numeric' })
      };
    } catch {
      return { month: 'NOV', day: 15, year: 2026, full: 'November 15, 2026' };
    }
  };

  return (
    <section className="py-20 lg:py-24 bg-[#0d0d16] border-y border-[#2a2a3e]/60 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <SectionTitle
          badge="Campus Life"
          title="Upcoming Events & Highlights"
          subtitle="Join our community for guest symposiums, cultural celebrations, academic exhibitions, and open houses."
        />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
          {events.map((event) => {
            const dateObj = formatDate(event.event_date || event.date || '');
            return (
              <Card
                key={event.id}
                hoverable
                className="flex flex-col justify-between p-6 bg-[#181826] border-[#2a2a3e] group"
              >
                <div>
                  {/* Top Date Badge + Upcoming Tag */}
                  <div className="flex items-start justify-between gap-4 mb-4">
                    <div className="w-14 h-14 rounded-2xl bg-purple-500/10 border border-purple-500/30 flex flex-col items-center justify-center text-center shrink-0">
                      <span className="text-[10px] font-bold tracking-widest text-pink-400 leading-none">
                        {dateObj.month}
                      </span>
                      <span className="text-xl font-extrabold text-white leading-none mt-1">
                        {dateObj.day}
                      </span>
                    </div>
                    <span className="text-[11px] font-medium px-2.5 py-1 rounded-full bg-pink-500/10 text-pink-300 border border-pink-500/20">
                      Upcoming
                    </span>
                  </div>

                  {/* Title & Description */}
                  <h3 className="text-base sm:text-lg font-bold text-white group-hover:text-purple-300 transition-colors line-clamp-2">
                    {event.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-400 mt-2 line-clamp-3 leading-relaxed">
                    {event.description}
                  </p>
                </div>

                {/* Footer with date details & link */}
                <div className="mt-6 pt-4 border-t border-[#2a2a3e] flex items-center justify-between text-xs text-slate-400">
                  <span className="flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-purple-400" />
                    {dateObj.full}
                  </span>
                  <Link
                    to="/events"
                    className="text-purple-400 group-hover:text-pink-400 flex items-center gap-1 font-medium transition-colors"
                  >
                    Details <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </Card>
            );
          })}
        </div>

        <div className="mt-12 text-center">
          <Link to="/events">
            <Button
              variant="outline"
              size="md"
              rightIcon={<ArrowRight className="w-4 h-4" />}
            >
              View Full Events Calendar
            </Button>
          </Link>
        </div>

      </div>
    </section>
  );
};
