import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Sparkles, Megaphone } from 'lucide-react';
import { Button } from '../ui/Button';
import { Banner } from '../../types';
import { fetchBanners, defaultBanners } from '../../lib/dataService';

export const BannersSection: React.FC<{ page?: string }> = ({ page = 'home' }) => {
  const [banners, setBanners] = useState<Banner[]>(defaultBanners);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    async function load() {
      try {
        const data = await fetchBanners(page, true);
        if (mounted && data && data.length > 0) {
          setBanners(data);
        }
      } catch (err) {
        console.warn('Banner load fallback:', err);
      } finally {
        if (mounted) setLoading(false);
      }
    }
    load();

    const handleUpdate = () => { load(); };
    window.addEventListener('storage', handleUpdate);
    window.addEventListener('ga_banners_updated', handleUpdate);
    window.addEventListener('ga_data_updated', handleUpdate);

    return () => { 
      mounted = false; 
      window.removeEventListener('storage', handleUpdate);
      window.removeEventListener('ga_banners_updated', handleUpdate);
      window.removeEventListener('ga_data_updated', handleUpdate);
    };
  }, [page]);

  if (!banners || banners.length === 0) return null;

  return (
    <section className="py-12 lg:py-16 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {banners.map((banner) => (
          <div 
            key={banner.id}
            className="relative rounded-3xl overflow-hidden border border-[#3b235d] shadow-2xl p-8 sm:p-12 lg:p-16 text-center lg:text-left"
            style={{
              backgroundImage: banner.image_url ? `linear-gradient(to right, rgba(17,14,30,0.95), rgba(17,14,30,0.85)), url(${banner.image_url})` : undefined,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
            }}
          >
            {/* Ambient Lighting */}
            <div className="absolute top-0 right-0 w-80 h-80 bg-pink-500/10 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-80 h-80 bg-purple-500/15 rounded-full blur-3xl pointer-events-none" />

            <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              <div className="lg:col-span-8 space-y-4">
                <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/30 text-xs font-semibold uppercase tracking-wider">
                  <Megaphone className="w-3.5 h-3.5 text-pink-400" />
                  <span>Promotional Notice</span>
                </div>
                
                <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-white tracking-tight leading-tight">
                  {banner.title}
                </h2>

                {banner.subtitle && (
                  <p className="text-sm sm:text-base text-slate-300 max-w-2xl leading-relaxed">
                    {banner.subtitle}
                  </p>
                )}
              </div>

              <div className="lg:col-span-4 flex flex-col sm:flex-row lg:flex-col items-center justify-center lg:items-end gap-3.5">
                {banner.button_text && (
                  <Link to={banner.button_link || '/admissions'} className="w-full sm:w-auto lg:w-full">
                    <Button
                      variant="primary"
                      size="lg"
                      className="w-full shadow-lg shadow-purple-950/60 bg-gradient-to-r from-purple-600 via-pink-600 to-amber-500 text-white font-bold"
                      rightIcon={<ArrowRight className="w-4 h-4" />}
                    >
                      {banner.button_text}
                    </Button>
                  </Link>
                )}
              </div>
            </div>

          </div>
        ))}
      </div>
    </section>
  );
};
