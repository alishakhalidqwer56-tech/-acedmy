import React, { useState, useEffect } from 'react';
import { PortalLayout } from '../../components/layout/PortalLayout';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { 
  BookOpen, 
  Video, 
  Clock, 
  Play, 
  FileText, 
  Download, 
  CheckCircle2, 
  X,
  ExternalLink
} from 'lucide-react';
import { defaultCourses } from '../../lib/supabase';
import { fetchVideoLectures } from '../../lib/dataService';
import { VideoLecture, Course } from '../../types';

export const StudentCoursesPage: React.FC = () => {
  const [courses] = useState<Course[]>(defaultCourses.slice(0, 3));
  const [videoLectures, setVideoLectures] = useState<VideoLecture[]>([]);
  const [activeVideo, setActiveVideo] = useState<VideoLecture | null>(null);

  useEffect(() => {
    fetchVideoLectures().then(setVideoLectures);
  }, []);

  return (
    <PortalLayout
      pageTitle="Enrolled Programs & Lecture Library"
      pageSubtitle="Access syllabus outlines, study slides, and streamed digital video lectures"
    >
      <div className="space-y-8">
        
        {/* Enrolled Courses */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-lg font-bold text-white">Active Semester Courses</h2>
              <p className="text-xs text-slate-400">Curricula currently enrolled for Fall 2026</p>
            </div>
            <Badge variant="purple">3 Active Courses</Badge>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {courses.map((c) => (
              <Card key={c.id} className="p-0 overflow-hidden bg-[#181827] border-[#2a2a3e] flex flex-col justify-between group">
                <div className="relative aspect-[16/9] w-full overflow-hidden bg-black/40">
                  <img
                    src={c.thumbnail_url || 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=600&q=80'}
                    alt={c.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute top-3 left-3 flex gap-2">
                    <Badge variant="purple">{c.category || 'STEM'}</Badge>
                  </div>
                </div>

                <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                  <div>
                    <h3 className="text-sm font-bold text-white line-clamp-1">{c.title}</h3>
                    <p className="text-xs text-slate-400 mt-1 line-clamp-2">{c.description}</p>
                  </div>

                  <div className="pt-3 border-t border-[#2a2a3e] text-xs text-slate-400 space-y-1">
                    <div><strong>Instructor:</strong> {c.instructor_name}</div>
                    <div><strong>Schedule:</strong> {c.schedule || 'Twice weekly'}</div>
                  </div>

                  <div className="pt-2">
                    <Button variant="outline" size="sm" className="w-full" leftIcon={<FileText className="w-3.5 h-3.5" />}>
                      Download Syllabus PDF
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>

        {/* Video Lectures Library */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-lg font-bold text-white">Digital Video Lectures</h2>
              <p className="text-xs text-slate-400">Stream recorded lectures published by faculty chairs</p>
            </div>
            <Badge variant="pink">{videoLectures.length} Lectures Available</Badge>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {videoLectures.map((vid) => (
              <Card key={vid.id} className="p-5 bg-[#181827] border-[#2a2a3e] flex flex-col justify-between space-y-4 hover:border-purple-500/40 transition-colors">
                <div className="space-y-3">
                  <div className="relative aspect-video rounded-xl bg-purple-950/30 border border-purple-500/20 overflow-hidden flex items-center justify-center group cursor-pointer"
                       onClick={() => setActiveVideo(vid)}>
                    <div className="w-12 h-12 rounded-full bg-purple-600/80 group-hover:bg-purple-600 flex items-center justify-center text-white shadow-xl transition-all group-hover:scale-110">
                      <Play className="w-5 h-5 ml-0.5 fill-current" />
                    </div>
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-white line-clamp-1">{vid.title}</h3>
                    <p className="text-xs text-slate-400 mt-1 line-clamp-2">{vid.description}</p>
                  </div>
                </div>

                <div className="pt-3 border-t border-[#2a2a3e] flex items-center justify-between text-xs text-slate-400">
                  <span className="flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-pink-400" />
                    {new Date(vid.created_at || '').toLocaleDateString()}
                  </span>
                  <button
                    onClick={() => setActiveVideo(vid)}
                    className="text-purple-400 hover:text-purple-300 font-medium flex items-center gap-1"
                  >
                    Watch Stream <Play className="w-3 h-3" />
                  </button>
                </div>
              </Card>
            ))}
          </div>
        </div>

        {/* Video Player Modal */}
        {activeVideo && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md animate-fade-in">
            <div className="relative w-full max-w-4xl bg-[#141422] border border-[#2a2a3e] rounded-2xl overflow-hidden shadow-2xl space-y-4 p-6"
                 onClick={e => e.stopPropagation()}>
              <div className="flex items-center justify-between pb-3 border-b border-[#2a2a3e]">
                <div>
                  <h3 className="text-lg font-bold text-white">{activeVideo.title}</h3>
                  <p className="text-xs text-slate-400">{activeVideo.description}</p>
                </div>
                <button onClick={() => setActiveVideo(null)} className="p-2 text-slate-400 hover:text-white rounded-lg hover:bg-white/5">
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Stream Frame */}
              <div className="relative aspect-video rounded-xl overflow-hidden bg-black border border-[#2a2a3e]">
                <iframe
                  src={activeVideo.video_url}
                  title={activeVideo.title}
                  className="w-full h-full"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </div>

              <div className="flex items-center justify-between text-xs text-slate-400 pt-2">
                <span>Stored in Supabase Video Registry • High Definition</span>
                <Button variant="outline" size="sm" onClick={() => setActiveVideo(null)}>
                  Close Player
                </Button>
              </div>
            </div>
          </div>
        )}

      </div>
    </PortalLayout>
  );
};
