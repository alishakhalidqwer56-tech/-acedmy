import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Search, 
  Filter, 
  Clock, 
  User, 
  BookOpen, 
  Calendar,
  Sparkles,
  ArrowRight,
  CheckCircle2,
  X
} from 'lucide-react';
import { Course, Subject } from '../../types';
import { fetchCourses, fetchSubjects, defaultCourses } from '../../lib/dataService';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Spinner } from '../../components/ui/Spinner';

export const CoursesPage: React.FC = () => {
  const [courses, setCourses] = useState<Course[]>(defaultCourses);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedLevel, setSelectedLevel] = useState<string>('All');
  const [selectedCourseForModal, setSelectedCourseForModal] = useState<Course | null>(null);
  const [modalSubjects, setModalSubjects] = useState<Subject[]>([]);
  const [loadingSubjects, setLoadingSubjects] = useState(false);

  useEffect(() => {
    if (!selectedCourseForModal) {
      setModalSubjects([]);
      return;
    }
    let mounted = true;
    async function loadSubs() {
      try {
        setLoadingSubjects(true);
        const subs = await fetchSubjects(selectedCourseForModal?.id);
        if (mounted) setModalSubjects(subs);
      } catch (e) {
        console.warn('Error loading subjects:', e);
      } finally {
        if (mounted) setLoadingSubjects(false);
      }
    }
    loadSubs();
    return () => { mounted = false; };
  }, [selectedCourseForModal]);

  const loadCoursesData = async () => {
    try {
      setLoading(true);
      const data = await fetchCourses();
      if (data && data.length > 0) {
        setCourses(data);
      }
    } catch (err) {
      console.warn('Using default fallback courses:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCoursesData();

    const handleUpdate = () => { loadCoursesData(); };
    window.addEventListener('storage', handleUpdate);
    window.addEventListener('ga_data_updated', handleUpdate);

    return () => {
      window.removeEventListener('storage', handleUpdate);
      window.removeEventListener('ga_data_updated', handleUpdate);
    };
  }, []);

  // Filter categories and levels derived from course items
  const categories = ['All', 'School', 'Matric', 'FSc', 'ICS', 'I.Com', 'FA', 'Skills'];
  const levels = ['All', 'Primary', 'Middle', 'Secondary', 'Higher Secondary'];

  const filteredCourses = courses.filter((course) => {
    const matchesSearch = 
      course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (course.description && course.description.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (course.instructor_name && course.instructor_name.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesCategory = 
      selectedCategory === 'All' || 
      (course.category && course.category.toLowerCase().includes(selectedCategory.toLowerCase()));

    const matchesLevel = 
      selectedLevel === 'All' || 
      (course.level && course.level.toLowerCase().includes(selectedLevel.toLowerCase()));

    return matchesSearch && matchesCategory && matchesLevel;
  });

  return (
    <div className="py-12 sm:py-16 space-y-12">
      {/* 1. Page Hero */}
      <section className="px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto rounded-3xl bg-gradient-to-r from-[#171426] via-[#151522] to-[#201328] border border-[#2a2a3e] p-8 sm:p-14 text-center relative overflow-hidden">
          <div className="relative z-10 max-w-3xl mx-auto space-y-4">
            <span className="text-xs uppercase tracking-widest font-semibold px-3 py-1 rounded-full bg-purple-500/15 text-purple-300 border border-purple-500/30">
              Curriculum & Programs
            </span>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight">
              Academic <span className="text-gradient">Course Catalog</span>
            </h1>
            <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
              Explore our comprehensive Pakistani academic programs across Primary, Middle, BISE Matriculation, and Intermediate (FSc Pre-Medical, Pre-Engineering, ICS, I.Com, and FA).
            </p>
          </div>
        </div>
      </section>

      {/* 2. Filter Bar */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-[#181827] border border-[#2a2a3e] rounded-2xl p-5 shadow-lg space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
            
            {/* Search Input */}
            <div className="md:col-span-5">
              <Input
                placeholder="Search by title, keyword, or faculty..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                leftIcon={<Search className="w-4 h-4 text-purple-400" />}
              />
            </div>

            {/* Category Dropdown / Buttons */}
            <div className="md:col-span-4">
              <label className="block text-[11px] font-medium text-slate-400 mb-1">Filter by Category</label>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full bg-[#131320] border border-[#2a2a3e] text-sm text-slate-200 rounded-xl px-3.5 py-2.5 focus:outline-none focus:ring-2 focus:ring-purple-500/50"
              >
                {categories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat === 'All' ? 'All Categories' : cat}
                  </option>
                ))}
              </select>
            </div>

            {/* Level Dropdown */}
            <div className="md:col-span-3">
              <label className="block text-[11px] font-medium text-slate-400 mb-1">Academic Level</label>
              <select
                value={selectedLevel}
                onChange={(e) => setSelectedLevel(e.target.value)}
                className="w-full bg-[#131320] border border-[#2a2a3e] text-sm text-slate-200 rounded-xl px-3.5 py-2.5 focus:outline-none focus:ring-2 focus:ring-purple-500/50"
              >
                {levels.map((lvl) => (
                  <option key={lvl} value={lvl}>
                    {lvl === 'All' ? 'All Levels' : lvl}
                  </option>
                ))}
              </select>
            </div>

          </div>

          {/* Active Filter summary */}
          <div className="flex flex-wrap items-center justify-between text-xs text-slate-400 pt-2 border-t border-[#2a2a3e]/60">
            <span>
              Showing <strong className="text-white">{filteredCourses.length}</strong> available courses
            </span>
            {(searchQuery || selectedCategory !== 'All' || selectedLevel !== 'All') && (
              <button
                onClick={() => {
                  setSearchQuery('');
                  setSelectedCategory('All');
                  setSelectedLevel('All');
                }}
                className="text-pink-400 hover:text-pink-300 font-medium flex items-center gap-1 transition-colors"
              >
                <X className="w-3.5 h-3.5" /> Reset Filters
              </button>
            )}
          </div>
        </div>
      </section>

      {/* 3. Responsive Card Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {loading ? (
          <div className="py-20 flex justify-center">
            <Spinner label="Loading course catalog..." size="lg" />
          </div>
        ) : filteredCourses.length === 0 ? (
          <div className="text-center py-20 p-8 rounded-2xl bg-[#161624] border border-[#2a2a3e]">
            <BookOpen className="w-12 h-12 text-slate-500 mx-auto mb-3" />
            <h3 className="text-lg font-bold text-white">No courses match your criteria</h3>
            <p className="text-xs sm:text-sm text-slate-400 mt-1">
              Try adjusting your search terms or resetting the category and level filters.
            </p>
            <Button
              variant="outline"
              size="sm"
              className="mt-4"
              onClick={() => {
                setSearchQuery('');
                setSelectedCategory('All');
                setSelectedLevel('All');
              }}
            >
              Reset Filters
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
            {filteredCourses.map((course) => (
              <Card
                key={course.id}
                hoverable
                className="flex flex-col justify-between overflow-hidden p-0 border-[#2a2a3e] bg-[#1a1a28] group"
              >
                {/* Thumbnail */}
                <div className="relative aspect-[16/9] w-full overflow-hidden bg-black/40">
                  <img
                    src={course.thumbnail_url || 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=800&q=80'}
                    alt={course.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#1a1a28] via-transparent to-transparent" />
                  
                  <div className="absolute top-3 left-3 flex gap-2">
                    <Badge variant="purple">
                      {course.category || 'Academic'}
                    </Badge>
                    {course.level && (
                      <Badge variant="pink">
                        {course.level}
                      </Badge>
                    )}
                  </div>
                </div>

                {/* Content */}
                <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                  <div>
                    <h3 className="text-lg font-bold text-white group-hover:text-purple-300 transition-colors line-clamp-1">
                      {course.title}
                    </h3>
                    <p className="text-xs sm:text-sm text-slate-400 mt-2 line-clamp-2 leading-relaxed">
                      {course.description}
                    </p>
                  </div>

                  {/* Details */}
                  <div className="pt-3 border-t border-[#2a2a3e] space-y-2 text-xs">
                    {course.instructor_name && (
                      <div className="flex items-center gap-2 text-slate-300">
                        <User className="w-3.5 h-3.5 text-purple-400 shrink-0" />
                        <span>Faculty: {course.instructor_name}</span>
                      </div>
                    )}
                    <div className="flex items-center justify-between text-slate-400">
                      <span className="flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5 text-pink-400" />
                        {course.duration || 'Full Term'}
                      </span>
                      <span className="font-semibold text-purple-300">
                        {course.fee_info || 'Scholarship Available'}
                      </span>
                    </div>
                  </div>

                  {/* Enroll / Overview Actions */}
                  <div className="pt-2 grid grid-cols-2 gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setSelectedCourseForModal(course)}
                    >
                      Overview
                    </Button>
                    <Link to="/admissions" className="w-full">
                      <Button
                        variant="primary"
                        size="sm"
                        className="w-full"
                        rightIcon={<ArrowRight className="w-3.5 h-3.5" />}
                      >
                        Enroll Now
                      </Button>
                    </Link>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </section>

      {/* Course Detail Modal */}
      {selectedCourseForModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm animate-fade-in">
          <div 
            className="relative w-full max-w-2xl bg-[#161626] border border-[#2a2a3e] rounded-2xl p-6 sm:p-8 shadow-2xl text-slate-200 max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between pb-4 border-b border-[#2a2a3e]">
              <div>
                <div className="flex gap-2 mb-2">
                  <Badge variant="purple">{selectedCourseForModal.category}</Badge>
                  {selectedCourseForModal.level && (
                    <Badge variant="pink">{selectedCourseForModal.level}</Badge>
                  )}
                </div>
                <h2 className="text-xl sm:text-2xl font-bold text-white">
                  {selectedCourseForModal.title}
                </h2>
              </div>
              <button
                onClick={() => setSelectedCourseForModal(null)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/5 transition-colors"
              >
                ✕
              </button>
            </div>

            <div className="mt-5 space-y-5 text-sm">
              <p className="text-slate-300 leading-relaxed">
                {selectedCourseForModal.description}
              </p>

              <div className="grid grid-cols-2 gap-3 text-xs p-4 rounded-xl bg-white/[0.02] border border-[#2a2a3e]">
                <div>
                  <span className="text-slate-400 block">Instructor</span>
                  <span className="font-semibold text-white mt-0.5 block">{selectedCourseForModal.instructor_name || 'Department Chair'}</span>
                </div>
                <div>
                  <span className="text-slate-400 block">Schedule & Frequency</span>
                  <span className="font-semibold text-white mt-0.5 block">{selectedCourseForModal.schedule || 'Twice weekly'}</span>
                </div>
                <div>
                  <span className="text-slate-400 block">Duration</span>
                  <span className="font-semibold text-white mt-0.5 block">{selectedCourseForModal.duration || '2 Semesters'}</span>
                </div>
                <div>
                  <span className="text-slate-400 block">Tuition / Fee</span>
                  <span className="font-semibold text-purple-300 mt-0.5 block">{selectedCourseForModal.fee_info || 'Scholarships Available'}</span>
                </div>
              </div>

              {/* Dynamic Curriculum Subjects */}
              <div className="space-y-2">
                <h4 className="text-xs font-semibold uppercase tracking-wider text-pink-400 flex items-center justify-between">
                  <span>Curriculum Subjects ({modalSubjects.length})</span>
                  {loadingSubjects && <span className="text-[10px] text-slate-400 lowercase font-normal">fetching from database...</span>}
                </h4>
                {modalSubjects.length > 0 ? (
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {modalSubjects.map((sub) => (
                      <span key={sub.id} className="px-2.5 py-1 rounded-lg bg-[#1e1c30] border border-purple-500/20 text-purple-200 text-xs">
                        {sub.name}
                      </span>
                    ))}
                  </div>
                ) : (
                  <p className="text-xs text-slate-400 italic">Core STEM, Language & Humanities syllabus modules.</p>
                )}
              </div>

              <div className="space-y-2">
                <h4 className="text-xs font-semibold uppercase tracking-wider text-purple-400">
                  Course Key Features & Highlights
                </h4>
                <ul className="space-y-1.5 text-xs text-slate-300">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>Targeted preparation for A+ grades in BISE & Federal Board exams</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>Practical laboratory training and past 10-year model paper practice</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>Personalized mentoring under certified female faculty</span>
                  </li>
                </ul>
              </div>
            </div>

            <div className="mt-6 pt-5 border-t border-[#2a2a3e] flex items-center justify-end gap-3">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setSelectedCourseForModal(null)}
              >
                Close
              </Button>
              <Link to="/admissions" onClick={() => setSelectedCourseForModal(null)}>
                <Button
                  variant="primary"
                  size="sm"
                  rightIcon={<ArrowRight className="w-3.5 h-3.5" />}
                >
                  Apply & Enroll
                </Button>
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
