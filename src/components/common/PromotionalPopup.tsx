import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { X, Sparkles, ArrowRight } from 'lucide-react';
import { Popup } from '../../types';
import { fetchPopups } from '../../lib/dataService';
import { Button } from '../ui/Button';

export const PromotionalPopup: React.FC = () => {
  const [activePopup, setActivePopup] = useState<Popup | null>(null);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    let mounted = true;
    async function checkPopup() {
      try {
        const popups = await fetchPopups(true);
        if (mounted && popups && popups.length > 0) {
          const popup = popups[0];
          // Check if user already saw this popup
          const storageKey = `ga_popup_seen_${popup.id}`;
          if (popup.show_once && sessionStorage.getItem(storageKey)) {
            return;
          }

          // Delay appearance by 1.5s for seamless first impression
          setTimeout(() => {
            if (mounted) {
              setActivePopup(popup);
              setIsOpen(true);
            }
          }, 1500);
        }
      } catch (err) {
        console.warn('Popup check error:', err);
      }
    }

    checkPopup();
    return () => { mounted = false; };
  }, []);

  const handleClose = () => {
    if (activePopup) {
      sessionStorage.setItem(`ga_popup_seen_${activePopup.id}`, 'true');
    }
    setIsOpen(false);
  };

  if (!isOpen || !activePopup) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
      <div 
        className="relative w-full max-w-lg overflow-hidden bg-[#161628] border border-purple-500/30 rounded-3xl shadow-2xl text-slate-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={handleClose}
          aria-label="Close Announcement"
          className="absolute top-3.5 right-3.5 z-20 p-2 rounded-full bg-black/60 hover:bg-black text-slate-300 hover:text-white transition-colors cursor-pointer border border-white/10"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Media Image */}
        {activePopup.image_url && (
          <div className="relative aspect-[16/9] w-full overflow-hidden bg-black/40">
            <img 
              src={activePopup.image_url} 
              alt={activePopup.title || 'Academy Announcement'} 
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#161628] via-transparent to-black/30" />
          </div>
        )}

        {/* Content Body */}
        <div className="p-6 sm:p-8 space-y-4 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/30 text-xs font-semibold uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5 text-pink-400" />
            <span>Special Announcement</span>
          </div>

          {activePopup.title && (
            <h3 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight leading-snug">
              {activePopup.title}
            </h3>
          )}

          {activePopup.message && (
            <p className="text-sm text-slate-300 leading-relaxed font-normal">
              {activePopup.message}
            </p>
          )}

          <div className="pt-2 flex flex-col sm:flex-row gap-3 justify-center">
            {activePopup.button_text && (
              <Link 
                to={activePopup.button_link || '/admissions'} 
                onClick={handleClose}
                className="w-full sm:w-auto"
              >
                <Button
                  variant="primary"
                  size="md"
                  className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold"
                  rightIcon={<ArrowRight className="w-4 h-4" />}
                >
                  {activePopup.button_text}
                </Button>
              </Link>
            )}

            <Button
              variant="outline"
              size="md"
              onClick={handleClose}
              className="w-full sm:w-auto border-[#2a2a3e] hover:bg-white/5"
            >
              Dismiss
            </Button>
          </div>
        </div>

      </div>
    </div>
  );
};
