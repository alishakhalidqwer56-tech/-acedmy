import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Image as ImageIcon, 
  Sparkles, 
  ExternalLink, 
  ZoomIn, 
  X, 
  Calendar, 
  ArrowRight,
  Filter
} from 'lucide-react';
import { Card } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';
import { SectionTitle } from '../ui/SectionTitle';
import { Poster } from '../../types';
import { fetchPosters, defaultPosters } from '../../lib/dataService';

export const PostersSection: React.FC = () => {
  const [posters, setPosters] = useState<Poster[]>(defaultPosters);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [zoomedPoster, setZoomedPoster] = useState<Poster | null>(null);
  const [loading, setLoading] = useState(true);

  const loadPosters = async () => {
    try {
      const data = await fetchPosters(true);
      if (data && data.length > 0) {
        setPosters(data);
      }
    } catch (err) {
      console.warn('Fallback posters:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPosters();

    const handleUpdate = () => loadPosters();
    window.addEventListener('storage', handleUpdate);
    window.addEventListener('ga_posters_updated', handleUpdate);
    window.addEventListener('ga_data_updated', handleUpdate);

    return () => {
      window.removeEventListener('storage', handleUpdate);
      window.removeEventListener('ga_posters_updated', handleUpdate);
      window.removeEventListener('ga_data_updated', handleUpdate);
    };
  }, []);

  // Dynamically extract categories from all active posters
  const rawCategories = Array.from(new Set(posters.map(p => p.category?.trim()).filter(Boolean) as string[]));
  const categories = ['All', ...(rawCategories.length > 0 ? rawCategories : ['Admissions', 'Academic Notice', 'Competition', 'Sports Gala'])];

  const filtered = selectedCategory === 'All' 
    ? posters 
    : posters.filter(p => p.category?.toLowerCase() === selectedCategory.toLowerCase());

  return (
    <section className="py-16 sm:py-24 bg-[#0f0e1a] relative overflow-hidden">
      {/* Background glow effects */}
      <div className="absolute top-1/2 left-0 w-96 h-96 bg-purple-600/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-pink-600/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-12">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <SectionTitle
            badge="Campus Flyers & Official Notices"
            title="Promotional Posters & Bulletins"
            subtitle="Explore our latest admissions notices, academic topper flyers, event announcements, and institutional achievements."
            align="left"
          />

          {/* Category Tabs */}
          <div className="flex flex-wrap items-center gap-2 bg-[#161625] p-1.5 rounded-2xl border border-[#2a2a3e]">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                  selectedCategory === cat
                    ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-md'
                    : 'text-slate-400 hover:text-white hover:bg-white/5'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Posters Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {filtered.map((poster) => (
            <Card
              key={poster.id}
              className="group overflow-hidden bg-[#161526] border-[#29263f] hover:border-purple-500/50 transition-all duration-300 flex flex-col justify-between"
            >
              <div className="relative aspect-[3/4] w-full overflow-hidden bg-[#0d0d17]">
                <img
                  src={poster.image_url}
                  alt={poster.title}
                  onError={(e) => {
                    e.currentTarget.onerror = null;
                    e.currentTarget.src = 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=1200&q=80';
                  }}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />

                {/* Overlay on hover */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-between p-4">
                  <div className="flex justify-end">
                    <button
                      onClick={() => setZoomedPoster(poster)}
                      className="p-2 rounded-xl bg-purple-600 text-white hover:bg-purple-500 shadow-lg cursor-pointer transform hover:scale-110 transition-transform"
                      title="Enlarge Poster"
                    >
                      <ZoomIn className="w-4 h-4" />
                    </button>
                  </div>

                  {poster.target_link && (
                    <Link
                      to={poster.target_link}
                      className="w-full py-2 px-3 rounded-xl bg-white text-slate-900 font-semibold text-xs text-center flex items-center justify-center gap-1.5 shadow-lg hover:bg-purple-50 transition-colors"
                    >
                      <span>Take Action</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  )}
                </div>

                <div className="absolute top-3 left-3">
                  <Badge variant="purple" className="shadow-md">
                    {poster.category}
                  </Badge>
                </div>
              </div>

              <div className="p-4 space-y-2">
                <h3 className="font-bold text-sm text-white group-hover:text-purple-300 transition-colors line-clamp-2">
                  {poster.title}
                </h3>
                {poster.description && (
                  <p className="text-xs text-slate-400 line-clamp-2">
                    {poster.description}
                  </p>
                )}
              </div>
            </Card>
          ))}
        </div>

        {/* Lightbox / Zoom Modal */}
        {zoomedPoster && (
          <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4">
            <div className="relative max-w-3xl w-full bg-[#161528] rounded-3xl border border-[#35334e] overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">
              <div className="p-4 border-b border-[#29273f] flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-bold text-white">{zoomedPoster.title}</h4>
                  <p className="text-xs text-purple-400">{zoomedPoster.category}</p>
                </div>
                <button
                  onClick={() => setZoomedPoster(null)}
                  className="p-2 rounded-xl bg-white/10 text-white hover:bg-white/20 transition-colors cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="overflow-auto p-4 flex items-center justify-center bg-[#0d0d17]">
                <img
                  src={zoomedPoster.image_url}
                  alt={zoomedPoster.title}
                  className="max-h-[65vh] w-auto object-contain rounded-xl shadow-lg"
                />
              </div>

              {zoomedPoster.description && (
                <div className="p-4 bg-[#141324] border-t border-[#29273f] flex items-center justify-between">
                  <p className="text-xs text-slate-300 max-w-xl">{zoomedPoster.description}</p>
                  {zoomedPoster.target_link && (
                    <Link
                      to={zoomedPoster.target_link}
                      onClick={() => setZoomedPoster(null)}
                      className="px-4 py-2 rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 text-white text-xs font-semibold shrink-0"
                    >
                      Visit Linked Page
                    </Link>
                  )}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </section>
  );
};
