import React, { useState, useEffect } from 'react';
import { PortalLayout } from '../../components/layout/PortalLayout';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { Input } from '../../components/ui/Input';
import { Textarea } from '../../components/ui/Textarea';
import { ImageUpload } from '../../components/ui/ImageUpload';
import { 
  BookOpen, 
  Plus, 
  Search, 
  Edit, 
  Trash2, 
  CheckCircle2, 
  Clock, 
  DollarSign, 
  User, 
  X,
  Sparkles
} from 'lucide-react';
import { fetchAdminCourses, createCourse, updateCourse, deleteCourse } from '../../lib/dataService';
import { Course } from '../../types';

export const AdminCoursesPage: React.FC = () => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [isLoading, setIsLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingCourse, setEditingCourse] = useState<Course | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Form State
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('STEM');
  const [level, setLevel] = useState('College Prep / Advanced');
  const [duration, setDuration] = useState('1 Academic Year');
  const [feeInfo, setFeeInfo] = useState('$3,200 / term');
  const [instructor, setInstructor] = useState('Dr. Elena Rostova');
  const [schedule, setSchedule] = useState('Mon & Wed, 10:00 AM - 12:00 PM');
  const [description, setDescription] = useState('');
  const [thumbnailUrl, setThumbnailUrl] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    loadCourses();
  }, []);

  const loadCourses = async () => {
    setIsLoading(true);
    try {
      const data = await fetchAdminCourses();
      setCourses(data);
    } finally {
      setIsLoading(false);
    }
  };

  const handleOpenAdd = () => {
    setEditingCourse(null);
    setTitle('');
    setCategory('STEM');
    setLevel('College Prep / Advanced');
    setDuration('1 Academic Year');
    setFeeInfo('$3,200 / term');
    setInstructor('Dr. Elena Rostova');
    setSchedule('Mon & Wed, 10:00 AM - 12:00 PM');
    setDescription('');
    setThumbnailUrl('https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=800&q=80');
    setShowModal(true);
  };

  const handleOpenEdit = (c: Course) => {
    setEditingCourse(c);
    setTitle(c.title);
    setCategory(c.category || 'STEM');
    setLevel(c.level || 'Advanced');
    setDuration(c.duration || '1 Year');
    setFeeInfo(c.fee_info || '$3,200');
    setInstructor(c.instructor_name || 'Faculty Staff');
    setSchedule(c.schedule || 'Regular');
    setDescription(c.description || '');
    setThumbnailUrl(c.thumbnail_url || '');
    setShowModal(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    setIsSubmitting(true);
    try {
      if (editingCourse) {
        await updateCourse(editingCourse.id, {
          title,
          category,
          level,
          duration,
          fee_info: feeInfo,
          instructor_name: instructor,
          schedule,
          description,
          thumbnail_url: thumbnailUrl
        });
        setToastMessage(`Course "${title}" updated successfully.`);
      } else {
        await createCourse({
          title,
          category,
          level,
          duration,
          fee_info: feeInfo,
          instructor_name: instructor,
          schedule,
          description,
          thumbnail_url: thumbnailUrl,
          is_active: true
        });
        setToastMessage(`Course "${title}" added to academic curriculum catalog.`);
      }

      setShowModal(false);
      await loadCourses();
      setTimeout(() => setToastMessage(null), 4000);
    } catch (err: any) {
      alert('Error saving course: ' + err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (c: Course) => {
    if (!window.confirm(`Are you sure you want to delete course "${c.title}"?`)) return;
    await deleteCourse(c.id);
    setToastMessage(`Course "${c.title}" removed.`);
    await loadCourses();
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleToggleActive = async (c: Course) => {
    const next = !c.is_active;
    await updateCourse(c.id, { is_active: next });
    setCourses(prev => prev.map(item => item.id === c.id ? { ...item, is_active: next } : item));
  };

  const filtered = courses.filter(c => {
    const matchesCat = categoryFilter === 'all' || c.category === categoryFilter;
    const matchesSearch = c.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          (c.instructor_name && c.instructor_name.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCat && matchesSearch;
  });

  return (
    <PortalLayout
      pageTitle="Curriculum Catalog & Program Management"
      pageSubtitle="Configure academic courses, syllabi, tuition fees, and classroom capacities"
    >
      <div className="space-y-6">

        {/* Header Controls */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
          <div className="flex flex-1 items-center gap-3">
            <div className="relative flex-1 max-w-md">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
              <input
                type="text"
                placeholder="Search courses or instructors..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-[#181827] border border-[#2a2a3e] rounded-xl pl-10 pr-4 py-2 text-xs text-white placeholder-slate-400 focus:outline-none focus:border-purple-500"
              />
            </div>

            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="bg-[#181827] border border-[#2a2a3e] text-white text-xs rounded-xl px-3 py-2 focus:outline-none focus:border-purple-500"
            >
              <option value="all">All Disciplines</option>
              <option value="STEM">STEM</option>
              <option value="Medical Sciences">Medical Sciences</option>
              <option value="Business">Business</option>
              <option value="Humanities">Humanities</option>
            </select>
          </div>

          <Button
            variant="primary"
            size="sm"
            onClick={handleOpenAdd}
            leftIcon={<Plus className="w-4 h-4" />}
          >
            Create New Program
          </Button>
        </div>

        {/* Toast Notification */}
        {toastMessage && (
          <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 flex items-center gap-3 animate-fade-in text-xs font-semibold">
            <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-400" />
            <span>{toastMessage}</span>
          </div>
        )}

        {/* Courses Table */}
        <Card className="p-0 overflow-hidden bg-[#181827] border-[#2a2a3e]">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#12121f] text-slate-400 uppercase tracking-wider text-[10px] border-b border-[#2a2a3e]">
                <tr>
                  <th className="p-4 font-semibold">Course & Discipline</th>
                  <th className="p-4 font-semibold">Lead Instructor</th>
                  <th className="p-4 font-semibold">Duration & Schedule</th>
                  <th className="p-4 font-semibold">Tuition Schedule</th>
                  <th className="p-4 font-semibold text-center">Status</th>
                  <th className="p-4 font-semibold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#2a2a3e]">
                {filtered.map((c) => (
                  <tr key={c.id} className="hover:bg-white/[0.02] transition-colors">
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={c.thumbnail_url || 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=200&q=80'}
                          alt={c.title}
                          className="w-10 h-10 rounded-xl object-cover border border-[#2a2a3e] shrink-0"
                        />
                        <div>
                          <div className="font-bold text-white line-clamp-1">{c.title}</div>
                          <div className="flex items-center gap-2 mt-0.5">
                            <Badge variant="purple" size="sm">{c.category || 'STEM'}</Badge>
                            <span className="text-[10px] text-slate-400">{c.level}</span>
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="p-4 text-slate-300 font-medium">{c.instructor_name || 'Faculty Staff'}</td>
                    <td className="p-4 text-slate-400 text-[11px]">
                      <div>{c.duration}</div>
                      <div className="text-slate-500 text-[10px]">{c.schedule}</div>
                    </td>
                    <td className="p-4 text-slate-200 font-mono font-semibold">{c.fee_info || 'Free'}</td>
                    <td className="p-4 text-center">
                      <button
                        onClick={() => handleToggleActive(c)}
                        className={`px-2 py-0.5 rounded-full text-[10px] font-semibold cursor-pointer border ${
                          c.is_active ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30' : 'bg-slate-700/40 text-slate-400 border-slate-600'
                        }`}
                      >
                        {c.is_active ? 'Active' : 'Inactive'}
                      </button>
                    </td>
                    <td className="p-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => handleOpenEdit(c)}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/5 transition-colors"
                          title="Edit course"
                        >
                          <Edit className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleDelete(c)}
                          className="p-1.5 rounded-lg text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 transition-colors"
                          title="Delete course"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>

        {/* Modal: Create or Edit Course */}
        {showModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
            <div className="w-full max-w-xl bg-[#181829] border border-[#2a2a3e] rounded-2xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col">
              <div className="p-5 border-b border-[#2a2a3e] flex items-center justify-between shrink-0">
                <div className="flex items-center gap-2">
                  <BookOpen className="w-5 h-5 text-purple-400" />
                  <h3 className="text-base font-bold text-white">
                    {editingCourse ? 'Edit Academic Program' : 'Create New Academic Program'}
                  </h3>
                </div>
                <button
                  onClick={() => setShowModal(false)}
                  className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-white/5"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-4 text-xs flex-1">
                <div>
                  <label className="block text-[11px] font-semibold text-slate-300 mb-1">Program Title *</label>
                  <Input
                    required
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="e.g. Quantum Computing & Cryptography"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-300 mb-1">Academic Discipline</label>
                    <select
                      value={category}
                      onChange={(e) => setCategory(e.target.value)}
                      className="w-full bg-[#11111d] border border-[#2a2a3e] text-white text-xs rounded-xl px-3 py-2.5 focus:outline-none focus:border-purple-500"
                    >
                      <option value="STEM">STEM</option>
                      <option value="Medical Sciences">Medical Sciences</option>
                      <option value="Business">Business</option>
                      <option value="Humanities">Humanities</option>
                      <option value="Fine Arts">Fine Arts</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-slate-300 mb-1">Academic Level</label>
                    <Input
                      value={level}
                      onChange={(e) => setLevel(e.target.value)}
                      placeholder="e.g. Advanced Placement / College Prep"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-300 mb-1">Duration</label>
                    <Input
                      value={duration}
                      onChange={(e) => setDuration(e.target.value)}
                      placeholder="1 Academic Year"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-slate-300 mb-1">Tuition Schedule</label>
                    <Input
                      value={feeInfo}
                      onChange={(e) => setFeeInfo(e.target.value)}
                      placeholder="$3,200 / term"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-300 mb-1">Lead Instructor Name</label>
                    <Input
                      value={instructor}
                      onChange={(e) => setInstructor(e.target.value)}
                      placeholder="Dr. Elena Rostova"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-slate-300 mb-1">Meeting Schedule</label>
                    <Input
                      value={schedule}
                      onChange={(e) => setSchedule(e.target.value)}
                      placeholder="Mon & Wed, 10:00 AM"
                    />
                  </div>
                </div>

                <div>
                  <ImageUpload
                    label="Course Cover Image (Upload Pic or Enter URL)"
                    value={thumbnailUrl}
                    onChange={setThumbnailUrl}
                    helperText="Recommended 16:9 ratio image representing the program"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-300 mb-1">Curriculum Description</label>
                  <Textarea
                    rows={3}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Overview of lecture topics, laboratory experiments, and prerequisites..."
                  />
                </div>

                <div className="pt-3 border-t border-[#2a2a3e] flex items-center justify-end gap-3">
                  <Button type="button" variant="outline" size="sm" onClick={() => setShowModal(false)}>
                    Cancel
                  </Button>
                  <Button type="submit" variant="primary" size="sm" isLoading={isSubmitting}>
                    {editingCourse ? 'Save Changes' : 'Create Program'}
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
