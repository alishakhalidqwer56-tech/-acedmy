import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Clock, Award, ArrowRight, User } from 'lucide-react';
import { Course } from '../../types';
import { fetchCourses, defaultCourses } from '../../lib/dataService';
import { Card } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';
import { SectionTitle } from '../ui/SectionTitle';

export const FeaturedCourses: React.FC = () => {
  const [courses, setCourses] = useState<Course[]>(defaultCourses.slice(0, 3));
  const [loading, setLoading] = useState(false);

  const loadCourses = async () => {
    try {
      setLoading(true);
      const data = await fetchCourses();
      if (data && data.length > 0) {
        setCourses(data.slice(0, 3));
      }
    } catch (err) {
      console.warn('Failed to load courses, using fallback:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCourses();

    const handleUpdate = () => { loadCourses(); };
    window.addEventListener('storage', handleUpdate);
    window.addEventListener('ga_data_updated', handleUpdate);

    return () => {
      window.removeEventListener('storage', handleUpdate);
      window.removeEventListener('ga_data_updated', handleUpdate);
    };
  }, []);

  return (
    <section className="py-20 lg:py-28 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <SectionTitle
          badge="Signature Curriculum"
          title="Featured Academic Programs"
          subtitle="Explore rigorous programs designed to foster innovative inquiry, critical reasoning, and real-world impact."
        />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {courses.map((course) => (
            <Card
              key={course.id}
              hoverable
              className="flex flex-col justify-between overflow-hidden p-0 border-[#2a2a3e] bg-[#1a1a28] group"
            >
              {/* Image Thumbnail */}
              <div className="relative aspect-[16/9] w-full overflow-hidden bg-black/40">
                <img
                  src={course.thumbnail_url || 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=800&q=80'}
                  alt={course.title}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#1a1a28] via-transparent to-transparent" />
                
                {/* Level / Category Badge */}
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

              {/* Body */}
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
                <div className="pt-3 border-t border-[#2a2a3e] space-y-2 text-xs text-slate-300">
                  {course.instructor_name && (
                    <div className="flex items-center gap-2 text-slate-400">
                      <User className="w-3.5 h-3.5 text-purple-400" />
                      <span>{course.instructor_name}</span>
                    </div>
                  )}
                  <div className="flex items-center justify-between text-slate-400">
                    <span className="flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5 text-pink-400" />
                      {course.duration || 'Full Term'}
                    </span>
                    <span className="flex items-center gap-1 font-semibold text-purple-300">
                      <span>{course.fee_info || 'Scholarship Available'}</span>
                    </span>
                  </div>
                </div>

                {/* Action button */}
                <div className="pt-2">
                  <Link to={`/courses`}>
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full justify-between"
                      rightIcon={<ArrowRight className="w-3.5 h-3.5" />}
                    >
                      View Course Details
                    </Button>
                  </Link>
                </div>
              </div>
            </Card>
          ))}
        </div>

        {/* View All Courses link */}
        <div className="mt-12 text-center">
          <Link to="/courses">
            <Button
              variant="primary"
              size="md"
              rightIcon={<ArrowRight className="w-4 h-4" />}
            >
              Browse All Courses
            </Button>
          </Link>
        </div>

      </div>
    </section>
  );
};
