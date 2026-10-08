import React, { useState, useEffect } from 'react';
import { PortalLayout } from '../../components/layout/PortalLayout';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Modal } from '../../components/ui/Modal';
import { Badge } from '../../components/ui/Badge';
import { useToast } from '../../context/ToastContext';
import { fetchVideoLectures, fetchAdminCourses, fetchSubjects } from '../../lib/dataService';
import { VideoLecture, Course, Subject } from '../../types';
import { Video, Play, Calendar, BookOpen, Clock, X } from 'lucide-react';

export const StudentVideosPage: React.FC = () => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [selectedCourseId, setSelectedCourseId] = useState<string>('');
  const [videoLectures, setVideoLectures] = useState<VideoLecture[]>([]);
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [activeVideo, setActiveVideo] = useState<VideoLecture | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const toast = useToast();

  useEffect(() => {
    async function init() {
      setIsLoading(true);
      try {
        const [crs, vids, subs] = await Promise.all([
          fetchAdminCourses(),
          fetchVideoLectures(),
          fetchSubjects()
        ]);
        setCourses(crs);
        setVideoLectures(vids);
        setSubjects(subs);
        if (crs.length > 0) {
          setSelectedCourseId(crs[0].id);
        }
      } catch {
        toast.error('Failed to load recorded lectures');
      } finally {
        setIsLoading(false);
      }
    }
    init();
  }, []);

  const filteredVideos = videoLectures.filter(v => 
    !selectedCourseId || v.course_id === selectedCourseId || !v.course_id
  );

  const getSubjectName = (subjId?: string | null) => {
    const s = subjects.find(x => x.id === subjId);
    return s ? s.name : 'Core Curriculum';
  };

  // Convert youtube links to embed format
  const getEmbedUrl = (url: string) => {
    if (!url) return '';
    if (url.includes('youtube.com/watch?v=')) {
      const id = url.split('v=')[1]?.split('&')[0];
      return `https://www.youtube.com/embed/${id}?autoplay=1`;
    }
    if (url.includes('youtu.be/')) {
      const id = url.split('youtu.be/')[1]?.split('?')[0];
      return `https://www.youtube.com/embed/${id}?autoplay=1`;
    }
    return url;
  };

  return (
    <PortalLayout
      pageTitle="Video Lectures & Class Recordings"
      pageSubtitle="Access recorded laboratory sessions, past paper workshops, and conceptual lectures on-demand"
    >
      <div className="space-y-6 max-w-6xl">
        {/* Course Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-[#2a2a3e]">
          {courses.map(c => (
            <button
              key={c.id}
              onClick={() => setSelectedCourseId(c.id)}
              className={`px-4 py-2.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                selectedCourseId === c.id
                  ? 'bg-purple-600 text-white shadow-lg shadow-purple-900/30'
                  : 'bg-[#181827] text-slate-400 hover:text-white hover:bg-white/5 border border-[#2a2a3e]'
              }`}
            >
              {c.title}
            </button>
          ))}
        </div>

        {/* Video Lectures Grid */}
        {isLoading ? (
          <div className="text-center py-16 text-slate-400">Loading lecture video streams...</div>
        ) : filteredVideos.length === 0 ? (
          <Card className="p-12 text-center text-slate-400 bg-[#161625] border-[#2a2a3e]">
            <Video className="w-10 h-10 text-slate-600 mx-auto mb-3" />
            <h4 className="text-white font-semibold mb-1">No Lectures Recorded Yet</h4>
            <p className="text-xs">Your course teachers will upload video lectures and revision walkthroughs here.</p>
          </Card>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredVideos.map(vid => (
              <Card
                key={vid.id}
                hoverable
                onClick={() => setActiveVideo(vid)}
                className="bg-[#161625] border-[#2a2a3e] p-0 overflow-hidden cursor-pointer group flex flex-col justify-between"
              >
                <div>
                  {/* Thumbnail / Player Banner */}
                  <div className="relative aspect-video bg-[#12121e] flex items-center justify-center overflow-hidden">
                    <img
                      src="https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=600&q=80"
                      alt={vid.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300 opacity-60"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
                    <div className="absolute w-12 h-12 rounded-full bg-purple-600/90 text-white flex items-center justify-center shadow-xl group-hover:scale-110 group-hover:bg-purple-500 transition-all">
                      <Play className="w-5 h-5 ml-0.5" />
                    </div>
                    <div className="absolute bottom-2.5 left-3">
                      <Badge variant="purple" size="sm">
                        {getSubjectName(vid.subject_id)}
                      </Badge>
                    </div>
                  </div>

                  {/* Body */}
                  <div className="p-4 space-y-2">
                    <h4 className="text-sm font-semibold text-white group-hover:text-purple-300 transition-colors line-clamp-2">
                      {vid.title}
                    </h4>
                    {vid.description && (
                      <p className="text-xs text-slate-400 line-clamp-2">
                        {vid.description}
                      </p>
                    )}
                  </div>
                </div>

                <div className="px-4 py-3 border-t border-[#2a2a3e]/60 flex items-center justify-between text-[11px] text-slate-400">
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5 text-purple-400" />
                    {new Date(vid.created_at || '').toLocaleDateString('en-GB')}
                  </span>
                  <span className="text-purple-400 font-medium group-hover:underline">
                    Watch Lecture →
                  </span>
                </div>
              </Card>
            ))}
          </div>
        )}

        {/* Video Player Modal */}
        <Modal
          isOpen={Boolean(activeVideo)}
          onClose={() => setActiveVideo(null)}
          title={activeVideo?.title}
          description={getSubjectName(activeVideo?.subject_id)}
          maxWidth="4xl"
        >
          {activeVideo && (
            <div className="space-y-4">
              <div className="relative aspect-video w-full rounded-2xl overflow-hidden bg-black border border-[#2a2a3e]">
                {activeVideo.video_url.includes('youtube.com') || activeVideo.video_url.includes('youtu.be') ? (
                  <iframe
                    src={getEmbedUrl(activeVideo.video_url)}
                    title={activeVideo.title}
                    className="w-full h-full border-0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                ) : (
                  <video
                    src={activeVideo.video_url}
                    controls
                    autoPlay
                    className="w-full h-full object-contain"
                  >
                    Your browser does not support the video tag.
                  </video>
                )}
              </div>

              {activeVideo.description && (
                <div className="p-4 rounded-xl bg-[#141422] border border-[#2a2a3e] text-xs text-slate-300 leading-relaxed">
                  <span className="font-semibold text-white block mb-1">Lecture Description & Study Notes:</span>
                  {activeVideo.description}
                </div>
              )}
            </div>
          )}
        </Modal>
      </div>
    </PortalLayout>
  );
};
