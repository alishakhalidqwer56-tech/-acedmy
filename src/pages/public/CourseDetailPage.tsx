import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { 
  ArrowLeft, 
  Clock, 
  User, 
  Calendar, 
  Award, 
  CheckCircle2, 
  BookOpen, 
  ArrowRight,
  ShieldCheck,
  Sparkles
} from 'lucide-react';
import { defaultCourses } from '../../lib/supabase';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';

export const CourseDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const course = defaultCourses.find(c => c.id === id) || defaultCourses[0];

  return (
    <div className="py-12 sm:py-16 space-y-12">
      {/* Top Breadcrumb */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Link to="/courses" className="inline-flex items-center gap-2 text-xs text-slate-400 hover:text-white transition-colors">
          <ArrowLeft className="w-4 h-4" /> Back to Academic Courses
        </Link>
      </div>

      {/* Hero Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="rounded-3xl bg-[#181827] border border-[#2a2a3e] overflow-hidden grid grid-cols-1 lg:grid-cols-12 shadow-2xl">
          <div className="lg:col-span-7 p-8 sm:p-12 flex flex-col justify-between space-y-6">
            <div>
              <div className="flex flex-wrap items-center gap-2 mb-3">
                <Badge variant="purple">{course.category || 'Academic'}</Badge>
                {course.level && <Badge variant="pink">{course.level}</Badge>}
                <Badge variant="cyan">Code: {course.id.toUpperCase()}</Badge>
              </div>
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight leading-tight">
                {course.title}
              </h1>
              <p className="text-sm sm:text-base text-slate-300 mt-4 leading-relaxed font-normal">
                {course.description}
              </p>
            </div>

            <div className="pt-4 border-t border-[#2a2a3e] grid grid-cols-2 sm:grid-cols-3 gap-4 text-xs text-slate-300">
              <div>
                <span className="text-slate-500 block text-[10px] uppercase font-semibold">Duration</span>
                <span className="font-semibold text-white mt-0.5 block flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-pink-400" /> {course.duration || 'Full Term'}
                </span>
              </div>
              <div>
                <span className="text-slate-500 block text-[10px] uppercase font-semibold">Faculty Chair</span>
                <span className="font-semibold text-white mt-0.5 block flex items-center gap-1.5">
                  <User className="w-3.5 h-3.5 text-purple-400" /> {course.instructor_name || 'Senior Fellow'}
                </span>
              </div>
              <div>
                <span className="text-slate-500 block text-[10px] uppercase font-semibold">Tuition</span>
                <span className="font-semibold text-purple-300 mt-0.5 block flex items-center gap-1.5">
                  {course.fee_info || 'Merit Scholarship Available'}
                </span>
              </div>
            </div>

            <div className="pt-2 flex flex-wrap items-center gap-3">
              <Link to="/admissions">
                <Button variant="primary" size="lg" rightIcon={<ArrowRight className="w-4 h-4" />}>
                  Enroll & Apply Now
                </Button>
              </Link>
              <Link to="/contact">
                <Button variant="outline" size="lg">
                  Inquire with Faculty Chair
                </Button>
              </Link>
            </div>
          </div>

          <div className="lg:col-span-5 relative aspect-[4/3] lg:aspect-auto bg-black/40">
            <img
              src={course.thumbnail_url || 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=1000&q=80'}
              alt={course.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#181827] via-transparent to-transparent lg:bg-gradient-to-r lg:from-[#181827] lg:via-transparent lg:to-transparent" />
          </div>
        </div>
      </section>

      {/* Curriculum Details */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          <div className="lg:col-span-8 space-y-6">
            <Card className="p-6 sm:p-8 bg-[#181827] border-[#2a2a3e] space-y-4">
              <h2 className="text-xl font-bold text-white">Course Overview & Learning Outcomes</h2>
              <p className="text-sm text-slate-300 leading-relaxed">
                This course is tailored specifically for high-achieving scholars aiming for elite university matriculation. Instruction integrates rigorous theoretical frameworks with intensive hands-on lab experimentation.
              </p>
              
              <div className="pt-4 border-t border-[#2a2a3e] space-y-2.5">
                <h3 className="text-xs font-semibold uppercase tracking-wider text-purple-400">
                  Key Scholastic Outcomes
                </h3>
                <ul className="space-y-2 text-xs sm:text-sm text-slate-300">
                  <li className="flex items-start gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    <span>Independent capstone inquiry with publication-grade manuscript evaluation</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    <span>Mastery of collegiate research tools, data visualization, and analytical reasoning</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    <span>Direct mentorship and recommendation letter eligibility from department fellows</span>
                  </li>
                </ul>
              </div>
            </Card>

            {/* Modules Outline */}
            <Card className="p-6 sm:p-8 bg-[#181827] border-[#2a2a3e] space-y-4">
              <h2 className="text-xl font-bold text-white">Syllabus Modules Outline</h2>
              <div className="space-y-3 pt-2">
                <div className="p-4 rounded-xl bg-white/[0.02] border border-[#2a2a3e]">
                  <span className="text-[10px] text-pink-400 font-bold uppercase">Module 1 • Weeks 1-6</span>
                  <h4 className="text-sm font-bold text-white mt-0.5">Foundational Principles & Scientific Method</h4>
                  <p className="text-xs text-slate-400 mt-1">Core paradigms, statistical evaluation, and safe laboratory protocol.</p>
                </div>
                <div className="p-4 rounded-xl bg-white/[0.02] border border-[#2a2a3e]">
                  <span className="text-[10px] text-purple-400 font-bold uppercase">Module 2 • Weeks 7-12</span>
                  <h4 className="text-sm font-bold text-white mt-0.5">Applied Investigations & Technical Labs</h4>
                  <p className="text-xs text-slate-400 mt-1">Experimental setups, data synthesis, and peer review seminars.</p>
                </div>
                <div className="p-4 rounded-xl bg-white/[0.02] border border-[#2a2a3e]">
                  <span className="text-[10px] text-cyan-400 font-bold uppercase">Module 3 • Weeks 13-18</span>
                  <h4 className="text-sm font-bold text-white mt-0.5">Capstone Research Presentation & Defense</h4>
                  <p className="text-xs text-slate-400 mt-1">Defend original inquiry findings before an academic review board.</p>
                </div>
              </div>
            </Card>
          </div>

          <div className="lg:col-span-4 space-y-6">
            <Card className="p-6 bg-[#181827] border-[#2a2a3e] space-y-4">
              <h3 className="text-base font-bold text-white">Schedule & Modality</h3>
              <div className="space-y-3 text-xs text-slate-300">
                <div className="flex justify-between py-1.5 border-b border-white/5">
                  <span className="text-slate-400">Class Schedule</span>
                  <span className="font-semibold text-white">{course.schedule || 'Mon & Wed, 10am'}</span>
                </div>
                <div className="flex justify-between py-1.5 border-b border-white/5">
                  <span className="text-slate-400">Campus Location</span>
                  <span className="font-semibold text-white">Science & Technology Wing, Girls Academy</span>
                </div>
                <div className="flex justify-between py-1.5 border-b border-white/5">
                  <span className="text-slate-400">Curriculum Board</span>
                  <span className="font-semibold text-purple-300">BISE / FBISE Approved</span>
                </div>
                <div className="flex justify-between py-1.5">
                  <span className="text-slate-400">Prerequisites</span>
                  <span className="font-semibold text-white">Previous Class Report Card</span>
                </div>
              </div>

              <Link to="/admissions" className="block pt-2">
                <Button variant="primary" size="md" className="w-full">
                  Apply for this Course
                </Button>
              </Link>
            </Card>
          </div>

        </div>
      </section>
    </div>
  );
};
