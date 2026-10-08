import React, { useState, useEffect } from 'react';
import { PortalLayout } from '../../components/layout/PortalLayout';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { Input } from '../../components/ui/Input';
import { Textarea } from '../../components/ui/Textarea';
import { 
  Video, 
  Upload, 
  Play, 
  Trash2, 
  CheckCircle2, 
  ExternalLink, 
  Clock, 
  Plus, 
  X, 
  FileVideo,
  Pencil
} from 'lucide-react';
import { 
  fetchVideoLectures, 
  createVideoLecture, 
  updateVideoLecture,
  deleteVideoLecture,
  initialClasses, 
  initialSubjects 
} from '../../lib/dataService';
import { defaultCourses } from '../../lib/supabase';
import { VideoLecture } from '../../types';
import { useAuth } from '../../context/AuthContext';

export const TeacherVideosPage: React.FC = () => {
  const { user } = useAuth();
  const [lectures, setLectures] = useState<VideoLecture[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingLecture, setEditingLecture] = useState<VideoLecture | null>(null);
  const [activeVideo, setActiveVideo] = useState<VideoLecture | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Form State
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [courseId, setCourseId] = useState(defaultCourses[0]?.id || 'c-1');
  const [subjectId, setSubjectId] = useState(initialSubjects[0]?.id || 'subj-1');
  const [videoUrl, setVideoUrl] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Edit Form State
  const [editTitle, setEditTitle] = useState('');
  const [editDescription, setEditDescription] = useState('');
  const [editCourseId, setEditCourseId] = useState('');
  const [editVideoUrl, setEditVideoUrl] = useState('');

  useEffect(() => {
    loadLectures();
  }, []);

  const loadLectures = async () => {
    setIsLoading(true);
    try {
      const data = await fetchVideoLectures();
      setLectures(data);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !videoUrl.trim()) return;

    setIsSubmitting(true);
    try {
      // Normalize youtube urls to embed format if applicable
      let formattedUrl = videoUrl;
      if (videoUrl.includes('youtube.com/watch?v=')) {
        const vidId = videoUrl.split('watch?v=')[1]?.split('&')[0];
        if (vidId) formattedUrl = `https://www.youtube.com/embed/${vidId}`;
      } else if (videoUrl.includes('youtu.be/')) {
        const vidId = videoUrl.split('youtu.be/')[1]?.split('?')[0];
        if (vidId) formattedUrl = `https://www.youtube.com/embed/${vidId}`;
      }

      await createVideoLecture({
        title,
        description,
        video_url: formattedUrl,
        course_id: courseId,
        subject_id: subjectId,
        uploaded_by: user?.id || 'demo-teacher-uid-2'
      });

      setToastMessage('Video lecture published successfully to student portals!');
      setShowAddModal(false);
      setTitle('');
      setDescription('');
      setVideoUrl('');
      await loadLectures();
      setTimeout(() => setToastMessage(null), 4000);
    } catch (err: any) {
      alert('Error publishing lecture: ' + err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to remove this video lecture?')) return;
    await deleteVideoLecture(id);
    setToastMessage('Video lecture removed.');
    await loadLectures();
    setTimeout(() => setToastMessage(null), 3000);
  };

  const openEditModal = (vid: VideoLecture) => {
    setEditingLecture(vid);
    setEditTitle(vid.title);
    setEditDescription(vid.description || '');
    setEditCourseId(vid.course_id || defaultCourses[0]?.id || 'c-1');
    setEditVideoUrl(vid.video_url);
  };

  const handleUpdateLecture = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingLecture) return;

    setIsSubmitting(true);
    try {
      let formattedUrl = editVideoUrl;
      if (editVideoUrl.includes('youtube.com/watch?v=')) {
        const vidId = editVideoUrl.split('watch?v=')[1]?.split('&')[0];
        if (vidId) formattedUrl = `https://www.youtube.com/embed/${vidId}`;
      } else if (editVideoUrl.includes('youtu.be/')) {
        const vidId = editVideoUrl.split('youtu.be/')[1]?.split('?')[0];
        if (vidId) formattedUrl = `https://www.youtube.com/embed/${vidId}`;
      }

      await updateVideoLecture(editingLecture.id, {
        title: editTitle,
        description: editDescription,
        course_id: editCourseId,
        video_url: formattedUrl
      });

      setToastMessage('Video lecture details updated.');
      setEditingLecture(null);
      await loadLectures();
      setTimeout(() => setToastMessage(null), 3000);
    } catch (err: any) {
      alert('Error updating lecture: ' + err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <PortalLayout
      pageTitle="Video Lectures & Digital Repository"
      pageSubtitle="Upload recorded lectures, stream YouTube/Cloudflare links, and link them to course modules"
    >
      <div className="space-y-6">

        {/* Top Header Controls */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-base sm:text-lg font-bold text-white">Faculty Lecture Library</h2>
            <p className="text-xs text-slate-400">Streamable video archives attached to enrolled students</p>
          </div>
          <Button
            variant="primary"
            size="sm"
            onClick={() => setShowAddModal(true)}
            leftIcon={<Plus className="w-4 h-4" />}
          >
            Publish New Lecture
          </Button>
        </div>

        {/* Toast Banner */}
        {toastMessage && (
          <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 flex items-center gap-3 animate-fade-in text-xs font-semibold">
            <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-400" />
            <span>{toastMessage}</span>
          </div>
        )}

        {/* Video Lectures Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {lectures.map((vid) => {
            const course = defaultCourses.find(c => c.id === vid.course_id);
            const subject = initialSubjects.find(s => s.id === vid.subject_id);

            return (
              <Card key={vid.id} className="p-5 bg-[#181827] border-[#2a2a3e] flex flex-col justify-between space-y-4 hover:border-purple-500/40 transition-colors">
                <div className="space-y-3">
                  {/* Thumbnail / Play trigger */}
                  <div 
                    className="relative aspect-video rounded-xl bg-purple-950/40 border border-purple-500/30 overflow-hidden flex items-center justify-center group cursor-pointer"
                    onClick={() => setActiveVideo(vid)}
                  >
                    <div className="w-12 h-12 rounded-full bg-purple-600/80 group-hover:bg-purple-600 flex items-center justify-center text-white shadow-xl transition-all group-hover:scale-110">
                      <Play className="w-5 h-5 ml-0.5 fill-current" />
                    </div>
                    <div className="absolute bottom-2 left-2 px-2 py-0.5 rounded bg-black/70 text-[10px] font-mono text-purple-300">
                      Stream Ready
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center gap-2 mb-1.5">
                      <Badge variant="purple" size="sm">{course?.category || 'Curriculum'}</Badge>
                      <span className="text-[10px] text-slate-400 truncate">{subject?.name || 'Subject'}</span>
                    </div>
                    <h3 className="text-sm font-bold text-white line-clamp-1">{vid.title}</h3>
                    <p className="text-xs text-slate-400 mt-1 line-clamp-2">{vid.description}</p>
                  </div>
                </div>

                <div className="pt-3 border-t border-[#2a2a3e] flex items-center justify-between text-xs text-slate-400">
                  <div className="flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-slate-500" />
                    <span>{new Date(vid.created_at || '').toLocaleDateString()}</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setActiveVideo(vid)}
                      className="p-1.5 rounded-lg text-purple-400 hover:text-purple-300 hover:bg-purple-500/10 transition-colors"
                      title="Play lecture preview"
                    >
                      <Play className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => openEditModal(vid)}
                      className="p-1.5 rounded-lg text-cyan-400 hover:text-cyan-300 hover:bg-cyan-500/10 transition-colors"
                      title="Edit lecture"
                    >
                      <Pencil className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(vid.id)}
                      className="p-1.5 rounded-lg text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 transition-colors"
                      title="Delete lecture"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>

        {/* Modal: Publish Video Lecture */}
        {showAddModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fade-in">
            <div className="w-full max-w-lg bg-[#181829] border border-[#2a2a3e] rounded-2xl shadow-2xl overflow-hidden">
              <div className="p-5 border-b border-[#2a2a3e] flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <FileVideo className="w-5 h-5 text-purple-400" />
                  <h3 className="text-base font-bold text-white">Publish Digital Video Lecture</h3>
                </div>
                <button 
                  onClick={() => setShowAddModal(false)}
                  className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-white/5"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="p-5 space-y-4 text-xs">
                <div>
                  <label className="block text-[11px] font-semibold text-slate-300 mb-1">Lecture Title *</label>
                  <Input
                    required
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="e.g. Lecture 04: Advanced Convolutional Neural Networks"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-300 mb-1">Program Course</label>
                    <select
                      value={courseId}
                      onChange={(e) => setCourseId(e.target.value)}
                      className="w-full bg-[#11111d] border border-[#2a2a3e] text-white text-xs rounded-xl px-3 py-2.5 focus:outline-none focus:border-purple-500"
                    >
                      {defaultCourses.map(c => (
                        <option key={c.id} value={c.id}>{c.title}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-slate-300 mb-1">Subject</label>
                    <select
                      value={subjectId}
                      onChange={(e) => setSubjectId(e.target.value)}
                      className="w-full bg-[#11111d] border border-[#2a2a3e] text-white text-xs rounded-xl px-3 py-2.5 focus:outline-none focus:border-purple-500"
                    >
                      {initialSubjects.map(s => (
                        <option key={s.id} value={s.id}>{s.name}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-300 mb-1">Video Streaming URL *</label>
                  <Input
                    required
                    value={videoUrl}
                    onChange={(e) => setVideoUrl(e.target.value)}
                    placeholder="https://www.youtube.com/watch?v=... or direct MP4/Cloudflare stream"
                  />
                  <span className="text-[10px] text-slate-400 mt-1 block">Supports YouTube unlisted videos, Vimeo, or CDN streams. URLs are securely stored without bloating the DB.</span>
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-300 mb-1">Lecture Synopsis & Reading Notes</label>
                  <Textarea
                    rows={3}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Key concepts covered, prerequisite slides, and lab assignments..."
                  />
                </div>

                <div className="pt-3 border-t border-[#2a2a3e] flex items-center justify-end gap-3">
                  <Button type="button" variant="outline" size="sm" onClick={() => setShowAddModal(false)}>
                    Cancel
                  </Button>
                  <Button type="submit" variant="primary" size="sm" isLoading={isSubmitting} leftIcon={<Upload className="w-4 h-4" />}>
                    Publish to Student Portals
                  </Button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Video Player Modal */}
        {activeVideo && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fade-in">
            <div className="w-full max-w-3xl bg-[#141422] border border-[#2a2a3e] rounded-2xl shadow-2xl overflow-hidden">
              <div className="p-4 border-b border-[#2a2a3e] flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Video className="w-4 h-4 text-purple-400" />
                  <span className="text-xs font-bold text-white line-clamp-1">{activeVideo.title}</span>
                </div>
                <button
                  onClick={() => setActiveVideo(null)}
                  className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-white/5"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="aspect-video w-full bg-black">
                <iframe
                  src={activeVideo.video_url}
                  title={activeVideo.title}
                  className="w-full h-full border-0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </div>

              <div className="p-4 text-xs text-slate-300 space-y-1">
                <p className="font-semibold text-white">Lecture Notes:</p>
                <p className="text-slate-400 text-[11px]">{activeVideo.description || 'No lecture description attached.'}</p>
              </div>
            </div>
          </div>
        )}

        {/* Modal: Edit Video Lecture */}
        {editingLecture && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fade-in">
            <div className="w-full max-w-lg bg-[#181829] border border-[#2a2a3e] rounded-2xl shadow-2xl overflow-hidden">
              <div className="p-5 border-b border-[#2a2a3e] flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <Pencil className="w-5 h-5 text-purple-400" />
                  <h3 className="text-base font-bold text-white">Edit Video Lecture</h3>
                </div>
                <button 
                  onClick={() => setEditingLecture(null)}
                  className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-white/5"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleUpdateLecture} className="p-5 space-y-4 text-xs">
                <div>
                  <label className="block text-[11px] font-semibold text-slate-300 mb-1">Lecture Title *</label>
                  <Input
                    required
                    value={editTitle}
                    onChange={(e) => setEditTitle(e.target.value)}
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-300 mb-1">Program Course</label>
                  <select
                    value={editCourseId}
                    onChange={(e) => setEditCourseId(e.target.value)}
                    className="w-full bg-[#11111d] border border-[#2a2a3e] text-white text-xs rounded-xl px-3 py-2.5 focus:outline-none focus:border-purple-500"
                  >
                    {defaultCourses.map(c => (
                      <option key={c.id} value={c.id}>{c.title}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-300 mb-1">Streaming Video URL *</label>
                  <Input
                    required
                    value={editVideoUrl}
                    onChange={(e) => setEditVideoUrl(e.target.value)}
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-300 mb-1">Syllabus & Lecture Summary</label>
                  <Textarea
                    rows={3}
                    value={editDescription}
                    onChange={(e) => setEditDescription(e.target.value)}
                  />
                </div>

                <div className="pt-3 flex items-center justify-end gap-2 border-t border-[#2a2a3e]">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => setEditingLecture(null)}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    variant="primary"
                    size="sm"
                    isLoading={isSubmitting}
                  >
                    Save Changes
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
