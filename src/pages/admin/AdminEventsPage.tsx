import React, { useState, useEffect } from 'react';
import { PortalLayout } from '../../components/layout/PortalLayout';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { Input } from '../../components/ui/Input';
import { Textarea } from '../../components/ui/Textarea';
import { ImageUpload } from '../../components/ui/ImageUpload';
import { 
  Calendar, 
  Plus, 
  Clock, 
  MapPin, 
  Edit, 
  Trash2, 
  CheckCircle2, 
  Users, 
  X,
  Sparkles
} from 'lucide-react';
import { fetchAdminEvents, createEvent, updateEvent, deleteEvent } from '../../lib/dataService';
import { EventItem } from '../../types';

export const AdminEventsPage: React.FC = () => {
  const [events, setEvents] = useState<EventItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingEvent, setEditingEvent] = useState<EventItem | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Form State
  const [title, setTitle] = useState('');
  const [date, setDate] = useState('2026-10-25');
  const [time, setTime] = useState('10:00 AM - 02:00 PM');
  const [location, setLocation] = useState('Rosalind Franklin STEM Auditorium');
  const [category, setCategory] = useState('Academic');
  const [description, setDescription] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    loadEvents();
  }, []);

  const loadEvents = async () => {
    setIsLoading(true);
    try {
      const data = await fetchAdminEvents();
      setEvents(data);
    } finally {
      setIsLoading(false);
    }
  };

  const handleOpenAdd = () => {
    setEditingEvent(null);
    setTitle('');
    setDate('2026-10-25');
    setTime('10:00 AM - 02:00 PM');
    setLocation('Rosalind Franklin STEM Auditorium');
    setCategory('Academic');
    setDescription('');
    setImageUrl('https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=800&q=80');
    setShowModal(true);
  };

  const handleOpenEdit = (ev: EventItem) => {
    setEditingEvent(ev);
    setTitle(ev.title);
    setDate(ev.date || ev.event_date || '2026-10-25');
    setTime(ev.time || '10:00 AM');
    setLocation(ev.location || 'Main Quad');
    setCategory(ev.category || 'Academic');
    setDescription(ev.description || '');
    setImageUrl(ev.image_url || '');
    setShowModal(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !date.trim()) return;

    setIsSubmitting(true);
    try {
      if (editingEvent) {
        await updateEvent(editingEvent.id, {
          title,
          date,
          time,
          location,
          category,
          description,
          image_url: imageUrl
        });
        setToastMessage(`Event "${title}" updated successfully.`);
      } else {
        await createEvent({
          title,
          date,
          time,
          location,
          category,
          description,
          image_url: imageUrl,
          is_upcoming: true
        });
        setToastMessage(`Campus event "${title}" published to public portal.`);
      }

      setShowModal(false);
      await loadEvents();
      setTimeout(() => setToastMessage(null), 4000);
    } catch (err: any) {
      alert('Error saving event: ' + err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (ev: EventItem) => {
    if (!window.confirm(`Are you sure you want to cancel and remove "${ev.title}"?`)) return;
    await deleteEvent(ev.id);
    setToastMessage(`Event "${ev.title}" removed.`);
    await loadEvents();
    setTimeout(() => setToastMessage(null), 3000);
  };

  return (
    <PortalLayout
      pageTitle="Campus Events Administration & Calendar"
      pageSubtitle="Schedule academic symposiums, open houses, competitions, and manage guest registrations"
    >
      <div className="space-y-6">

        {/* Header Controls */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-base sm:text-lg font-bold text-white">Institutional Event Schedules</h2>
            <p className="text-xs text-slate-400">Events published here appear on public pages and student calendars</p>
          </div>
          <Button
            variant="primary"
            size="sm"
            onClick={handleOpenAdd}
            leftIcon={<Plus className="w-4 h-4" />}
          >
            Create New Campus Event
          </Button>
        </div>

        {/* Toast */}
        {toastMessage && (
          <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 flex items-center gap-3 animate-fade-in text-xs font-semibold">
            <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-400" />
            <span>{toastMessage}</span>
          </div>
        )}

        {/* Events Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {events.map((ev) => (
            <Card key={ev.id} className="p-5 bg-[#181827] border-[#2a2a3e] flex flex-col justify-between space-y-4 hover:border-purple-500/30 transition-colors">
              <div className="space-y-2.5">
                <div className="flex items-center justify-between">
                  <Badge variant="purple" size="sm">{ev.category || 'Campus'}</Badge>
                  <span className="text-xs font-mono font-bold text-pink-400">{ev.date}</span>
                </div>

                <h3 className="text-sm font-bold text-white">{ev.title}</h3>
                <p className="text-xs text-slate-400 line-clamp-2">{ev.description}</p>

                <div className="space-y-1 pt-2 border-t border-[#2a2a3e] text-xs text-slate-400">
                  <div className="flex items-center gap-2">
                    <Clock className="w-3.5 h-3.5 text-slate-500" />
                    <span>{ev.time || 'TBA'}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="w-3.5 h-3.5 text-slate-500" />
                    <span className="truncate">{ev.location || 'Main Campus'}</span>
                  </div>
                </div>
              </div>

              <div className="pt-3 border-t border-[#2a2a3e] flex items-center justify-between">
                <span className="text-[10px] text-emerald-400 flex items-center gap-1 font-semibold">
                  <CheckCircle2 className="w-3 h-3" /> Registration Open
                </span>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleOpenEdit(ev)}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/5 transition-colors"
                    title="Edit event"
                  >
                    <Edit className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => handleDelete(ev)}
                    className="p-1.5 rounded-lg text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 transition-colors"
                    title="Cancel event"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </Card>
          ))}
        </div>

        {/* Modal: Create or Edit Event */}
        {showModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
            <div className="w-full max-w-lg bg-[#181829] border border-[#2a2a3e] rounded-2xl shadow-2xl overflow-hidden">
              <div className="p-5 border-b border-[#2a2a3e] flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-purple-400" />
                  <h3 className="text-base font-bold text-white">
                    {editingEvent ? 'Edit Campus Event' : 'Create Campus Event'}
                  </h3>
                </div>
                <button
                  onClick={() => setShowModal(false)}
                  className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-white/5"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="p-5 space-y-4 text-xs">
                <div>
                  <label className="block text-[11px] font-semibold text-slate-300 mb-1">Event Title *</label>
                  <Input
                    required
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="e.g. Annual Women in STEM Innovation Fair"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-300 mb-1">Date *</label>
                    <Input
                      type="date"
                      required
                      value={date}
                      onChange={(e) => setDate(e.target.value)}
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-slate-300 mb-1">Time Schedule</label>
                    <Input
                      value={time}
                      onChange={(e) => setTime(e.target.value)}
                      placeholder="10:00 AM - 02:00 PM"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-300 mb-1">Event Category</label>
                    <select
                      value={category}
                      onChange={(e) => setCategory(e.target.value)}
                      className="w-full bg-[#11111d] border border-[#2a2a3e] text-white text-xs rounded-xl px-3 py-2.5 focus:outline-none focus:border-purple-500"
                    >
                      <option value="Academic">Academic</option>
                      <option value="STEM & Robotics">STEM & Robotics</option>
                      <option value="Admissions">Admissions</option>
                      <option value="Cultural & Arts">Cultural & Arts</option>
                      <option value="Leadership">Leadership</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-slate-300 mb-1">Campus Venue / Location</label>
                    <Input
                      value={location}
                      onChange={(e) => setLocation(e.target.value)}
                      placeholder="Auditorium / Quad"
                    />
                  </div>
                </div>

                <div>
                  <ImageUpload
                    label="Event Banner / Poster (Upload Pic or Enter URL)"
                    value={imageUrl}
                    onChange={setImageUrl}
                    helperText="Official event flyer, poster artwork, or campus stage banner"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-300 mb-1">Event Description & Program Details</label>
                  <Textarea
                    rows={3}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Guest speaker details, agenda, and participant instructions..."
                  />
                </div>

                <div className="pt-3 border-t border-[#2a2a3e] flex items-center justify-end gap-3">
                  <Button type="button" variant="outline" size="sm" onClick={() => setShowModal(false)}>
                    Cancel
                  </Button>
                  <Button type="submit" variant="primary" size="sm" isLoading={isSubmitting}>
                    {editingEvent ? 'Save Changes' : 'Publish Campus Event'}
                  </Button>
                </div>
              </form>
            </div>
          </div>
        )}

      </div>
    </PortalLayout>
  );
};
