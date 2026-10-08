import React, { useState, useEffect } from 'react';
import { 
  Sliders, 
  Bell, 
  Megaphone, 
  BarChart3, 
  Heart, 
  Trophy, 
  Layers, 
  Share2, 
  Plus, 
  Edit, 
  Trash2, 
  Check, 
  X, 
  Eye, 
  EyeOff, 
  ArrowUp, 
  ArrowDown, 
  ExternalLink,
  Sparkles,
  HelpCircle,
  Save,
  CheckCircle2,
  RefreshCw
} from 'lucide-react';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Textarea } from '../../components/ui/Textarea';
import { Badge } from '../../components/ui/Badge';
import { Modal } from '../../components/ui/Modal';
import { ConfirmDialog } from '../../components/ui/ConfirmDialog';
import { ImageUpload } from '../../components/ui/ImageUpload';
import { PortalLayout } from '../../components/layout/PortalLayout';
import { useToast } from '../../context/ToastContext';
import { 
  HeroSlide, 
  Announcement, 
  Banner, 
  QuickStat, 
  CoreValue, 
  Achievement, 
  Popup, 
  SocialMedia 
} from '../../types';
import { 
  fetchHeroSlides, createHeroSlide, updateHeroSlide, deleteHeroSlide,
  fetchAnnouncements, createAnnouncement, updateAnnouncement, deleteAnnouncement,
  fetchBanners, createBanner, updateBanner, deleteBanner,
  fetchQuickStats, createQuickStat, updateQuickStat, deleteQuickStat,
  fetchCoreValues, createCoreValue, updateCoreValue, deleteCoreValue,
  fetchAchievements, createAchievement, updateAchievement, deleteAchievement,
  fetchPopups, createPopup, updatePopup, deletePopup,
  fetchSocialMedia, createSocialMedia, updateSocialMedia, deleteSocialMedia
} from '../../lib/dataService';

type CMSTab = 
  | 'hero_slides'
  | 'announcements'
  | 'banners'
  | 'quick_stats'
  | 'core_values'
  | 'achievements'
  | 'popups'
  | 'social_media';

export const AdminWebsiteCMSPage: React.FC = () => {
  const { showToast } = useToast();
  const [activeTab, setActiveTab] = useState<CMSTab>('hero_slides');
  const [isLoading, setIsLoading] = useState(false);

  // Data states
  const [heroSlides, setHeroSlides] = useState<HeroSlide[]>([]);
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [banners, setBanners] = useState<Banner[]>([]);
  const [quickStats, setQuickStats] = useState<QuickStat[]>([]);
  const [coreValues, setCoreValues] = useState<CoreValue[]>([]);
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [popups, setPopups] = useState<Popup[]>([]);
  const [socialMedia, setSocialMedia] = useState<SocialMedia[]>([]);

  // Modal & Form States
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<any | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  // Form Fields
  const [formData, setFormData] = useState<any>({});

  const loadAllData = async () => {
    setIsLoading(true);
    try {
      const [slides, anns, bans, stats, vals, achs, pops, socs] = await Promise.all([
        fetchHeroSlides(false),
        fetchAnnouncements(false),
        fetchBanners('', false),
        fetchQuickStats(false),
        fetchCoreValues(false),
        fetchAchievements(false),
        fetchPopups(false),
        fetchSocialMedia(false)
      ]);
      setHeroSlides(slides);
      setAnnouncements(anns);
      setBanners(bans);
      setQuickStats(stats);
      setCoreValues(vals);
      setAchievements(achs);
      setPopups(pops);
      setSocialMedia(socs);
    } catch (err: any) {
      showToast(err.message || 'Error loading CMS data', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadAllData();
  }, []);

  const openAddModal = () => {
    setEditingItem(null);
    let defaults: any = {};
    switch (activeTab) {
      case 'hero_slides':
        defaults = {
          heading: '',
          subheading: '',
          description: '',
          image_url: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=1600&q=80',
          button1_text: 'Apply Now',
          button1_link: '/admissions',
          button2_text: 'View Programs',
          button2_link: '/courses',
          position: heroSlides.length + 1,
          is_active: true
        };
        break;
      case 'announcements':
        defaults = {
          text: '',
          link: '/admissions',
          is_active: true
        };
        break;
      case 'banners':
        defaults = {
          title: '',
          subtitle: '',
          image_url: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=1600&q=80',
          button_text: 'Learn More',
          button_link: '/admissions',
          position: banners.length + 1,
          is_active: true,
          page: 'home'
        };
        break;
      case 'quick_stats':
        defaults = {
          label: '',
          value: '',
          icon: 'users',
          position: quickStats.length + 1,
          is_active: true
        };
        break;
      case 'core_values':
        defaults = {
          title: '',
          description: '',
          icon: 'award',
          position: coreValues.length + 1,
          is_active: true
        };
        break;
      case 'achievements':
        defaults = {
          title: '',
          description: '',
          year: '2026',
          icon: 'trophy',
          position: achievements.length + 1,
          is_active: true
        };
        break;
      case 'popups':
        defaults = {
          title: '',
          message: '',
          image_url: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=800&q=80',
          button_text: 'Apply Now',
          button_link: '/admissions',
          show_once: true,
          is_active: true
        };
        break;
      case 'social_media':
        defaults = {
          platform: 'Facebook',
          url: 'https://facebook.com/girlsacademy',
          icon: 'facebook',
          followers_count: '5,000+',
          position: socialMedia.length + 1,
          is_active: true
        };
        break;
    }
    setFormData(defaults);
    setIsModalOpen(true);
  };

  const openEditModal = (item: any) => {
    setEditingItem(item);
    setFormData({ ...item });
    setIsModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingItem) {
        // Update
        switch (activeTab) {
          case 'hero_slides':
            await updateHeroSlide(editingItem.id, formData);
            break;
          case 'announcements':
            await updateAnnouncement(editingItem.id, formData);
            break;
          case 'banners':
            await updateBanner(editingItem.id, formData);
            break;
          case 'quick_stats':
            await updateQuickStat(editingItem.id, formData);
            break;
          case 'core_values':
            await updateCoreValue(editingItem.id, formData);
            break;
          case 'achievements':
            await updateAchievement(editingItem.id, formData);
            break;
          case 'popups':
            await updatePopup(editingItem.id, formData);
            break;
          case 'social_media':
            await updateSocialMedia(editingItem.id, formData);
            break;
        }
        showToast('Item updated successfully', 'success');
      } else {
        // Create
        switch (activeTab) {
          case 'hero_slides':
            await createHeroSlide(formData);
            break;
          case 'announcements':
            await createAnnouncement(formData);
            break;
          case 'banners':
            await createBanner(formData);
            break;
          case 'quick_stats':
            await createQuickStat(formData);
            break;
          case 'core_values':
            await createCoreValue(formData);
            break;
          case 'achievements':
            await createAchievement(formData);
            break;
          case 'popups':
            await createPopup(formData);
            break;
          case 'social_media':
            await createSocialMedia(formData);
            break;
        }
        showToast('New item added successfully', 'success');
      }
      setIsModalOpen(false);
      loadAllData();
    } catch (err: any) {
      showToast(err.message || 'Error saving item', 'error');
    }
  };

  const handleDelete = async () => {
    if (!deleteConfirmId) return;
    try {
      switch (activeTab) {
        case 'hero_slides':
          await deleteHeroSlide(deleteConfirmId);
          break;
        case 'announcements':
          await deleteAnnouncement(deleteConfirmId);
          break;
        case 'banners':
          await deleteBanner(deleteConfirmId);
          break;
        case 'quick_stats':
          await deleteQuickStat(deleteConfirmId);
          break;
        case 'core_values':
          await deleteCoreValue(deleteConfirmId);
          break;
        case 'achievements':
          await deleteAchievement(deleteConfirmId);
          break;
        case 'popups':
          await deletePopup(deleteConfirmId);
          break;
        case 'social_media':
          await deleteSocialMedia(deleteConfirmId);
          break;
      }
      showToast('Item deleted successfully', 'success');
      setDeleteConfirmId(null);
      loadAllData();
    } catch (err: any) {
      showToast(err.message || 'Error deleting item', 'error');
    }
  };

  const handleToggleActive = async (item: any) => {
    try {
      const updated = !item.is_active;
      switch (activeTab) {
        case 'hero_slides':
          await updateHeroSlide(item.id, { is_active: updated });
          break;
        case 'announcements':
          await updateAnnouncement(item.id, { is_active: updated });
          break;
        case 'banners':
          await updateBanner(item.id, { is_active: updated });
          break;
        case 'quick_stats':
          await updateQuickStat(item.id, { is_active: updated });
          break;
        case 'core_values':
          await updateCoreValue(item.id, { is_active: updated });
          break;
        case 'achievements':
          await updateAchievement(item.id, { is_active: updated });
          break;
        case 'popups':
          await updatePopup(item.id, { is_active: updated });
          break;
        case 'social_media':
          await updateSocialMedia(item.id, { is_active: updated });
          break;
      }
      showToast(`Status updated to ${updated ? 'Active' : 'Hidden'}`, 'info');
      loadAllData();
    } catch (err: any) {
      showToast(err.message || 'Error updating status', 'error');
    }
  };

  const tabsConfig = [
    { id: 'hero_slides', label: 'Hero Slides', icon: Sliders, count: heroSlides.length },
    { id: 'announcements', label: 'Announcements', icon: Bell, count: announcements.length },
    { id: 'banners', label: 'Banners', icon: Megaphone, count: banners.length },
    { id: 'quick_stats', label: 'Quick Stats', icon: BarChart3, count: quickStats.length },
    { id: 'core_values', label: 'Core Values', icon: Heart, count: coreValues.length },
    { id: 'achievements', label: 'Achievements', icon: Trophy, count: achievements.length },
    { id: 'popups', label: 'Popups & Ads', icon: Layers, count: popups.length },
    { id: 'social_media', label: 'Social Media', icon: Share2, count: socialMedia.length },
  ];

  return (
    <PortalLayout
      pageTitle="Website Content & Dynamic CMS"
      pageSubtitle="Live Supabase database management for hero slides, announcements, promotional banners, stats, core values, achievements, popups, and social accounts"
    >
      <div className="space-y-6">
        {/* Page Header Actions */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-[#2a2a3e] pb-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/15 border border-purple-500/30 text-purple-300 text-xs font-semibold mb-2">
            <Sparkles className="w-3.5 h-3.5 text-pink-400" />
            <span>Fully Dynamic Content Management System</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
            Website Content & CMS
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Manage all frontend banners, slides, announcements, statistics, values, and popups with live database synchronization.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            size="sm"
            onClick={loadAllData}
            isLoading={isLoading}
            leftIcon={<RefreshCw className="w-4 h-4" />}
          >
            Refresh Data
          </Button>
          <Button
            variant="primary"
            size="sm"
            onClick={openAddModal}
            leftIcon={<Plus className="w-4 h-4" />}
          >
            Add New Item
          </Button>
        </div>
      </div>

      {/* Tabs Bar */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none border-b border-[#2a2a3e]/60">
        {tabsConfig.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as CMSTab)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                isActive
                  ? 'bg-purple-600 text-white shadow-lg shadow-purple-900/40'
                  : 'bg-[#161625] text-slate-400 hover:text-white hover:bg-[#1f1f33] border border-[#2a2a3e]'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
              <span className={`px-1.5 py-0.5 rounded-md text-[10px] font-bold ${
                isActive ? 'bg-white/20 text-white' : 'bg-black/30 text-slate-400'
              }`}>
                {tab.count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Main Tab Content */}
      <div className="space-y-4">

        {/* 1. HERO SLIDES TAB */}
        {activeTab === 'hero_slides' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between text-xs text-slate-400">
              <span>Homepage hero carousel slides ({heroSlides.length} total)</span>
              <span className="text-purple-400">Auto-rotates every 5 seconds on the homepage</span>
            </div>

            {heroSlides.length === 0 ? (
              <Card className="p-12 text-center text-slate-400 bg-[#161625] border-[#2a2a3e]">
                No hero slides found. Click "Add New Item" to create the first slide.
              </Card>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {heroSlides.map((slide, idx) => (
                  <Card key={slide.id} className="p-0 overflow-hidden bg-[#161625] border-[#2a2a3e] flex flex-col justify-between group">
                    <div>
                      {/* Image Preview */}
                      <div className="relative aspect-[16/9] w-full overflow-hidden bg-black/40">
                        <img 
                          src={slide.image_url || 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=800&q=80'} 
                          alt={slide.heading} 
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute top-2.5 left-2.5 flex items-center gap-1.5">
                          <span className="px-2 py-0.5 rounded-md bg-black/70 text-white font-mono text-[10px]">
                            #{slide.position || idx + 1}
                          </span>
                          <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold ${
                            slide.is_active ? 'bg-emerald-500/80 text-white' : 'bg-rose-500/80 text-white'
                          }`}>
                            {slide.is_active ? 'Active' : 'Disabled'}
                          </span>
                        </div>
                      </div>

                      {/* Content Info */}
                      <div className="p-5 space-y-3">
                        {slide.subheading && (
                          <span className="text-[11px] font-semibold text-purple-400 block truncate">
                            {slide.subheading}
                          </span>
                        )}
                        <h3 className="text-base font-bold text-white line-clamp-2">
                          {slide.heading}
                        </h3>
                        <p className="text-xs text-slate-400 line-clamp-3">
                          {slide.description}
                        </p>

                        <div className="pt-2 flex flex-wrap gap-2 text-[11px] text-slate-300">
                          {slide.button1_text && (
                            <span className="px-2 py-1 rounded bg-[#202035] border border-[#2a2a3e]">
                              Button 1: <strong>{slide.button1_text}</strong> ({slide.button1_link})
                            </span>
                          )}
                          {slide.button2_text && (
                            <span className="px-2 py-1 rounded bg-[#202035] border border-[#2a2a3e]">
                              Button 2: <strong>{slide.button2_text}</strong> ({slide.button2_link})
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Card Actions */}
                    <div className="p-4 border-t border-[#2a2a3e] flex items-center justify-between bg-black/20">
                      <button
                        onClick={() => handleToggleActive(slide)}
                        className={`text-xs font-semibold px-2.5 py-1 rounded-lg transition-colors flex items-center gap-1 ${
                          slide.is_active 
                            ? 'text-emerald-400 hover:bg-emerald-500/10' 
                            : 'text-slate-400 hover:bg-white/5'
                        }`}
                      >
                        {slide.is_active ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
                        <span>{slide.is_active ? 'Visible' : 'Hidden'}</span>
                      </button>

                      <div className="flex items-center gap-1.5">
                        <button
                          onClick={() => openEditModal(slide)}
                          className="p-1.5 rounded-lg bg-[#202035] hover:bg-purple-600 text-slate-300 hover:text-white transition-colors"
                          title="Edit Slide"
                        >
                          <Edit className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => setDeleteConfirmId(slide.id)}
                          className="p-1.5 rounded-lg bg-[#202035] hover:bg-rose-600 text-slate-300 hover:text-white transition-colors"
                          title="Delete Slide"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </div>
        )}

        {/* 2. ANNOUNCEMENTS TAB */}
        {activeTab === 'announcements' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between text-xs text-slate-400">
              <span>Header announcement ticker notifications ({announcements.length} total)</span>
              <span className="text-purple-400">Displayed at the top of the website navbar</span>
            </div>

            <div className="space-y-3">
              {announcements.map((ann) => (
                <Card key={ann.id} className="p-4 bg-[#161625] border-[#2a2a3e] flex items-center justify-between gap-4">
                  <div className="space-y-1 flex-1">
                    <div className="flex items-center gap-2">
                      <span className={`w-2 h-2 rounded-full ${ann.is_active ? 'bg-emerald-400' : 'bg-slate-600'}`} />
                      <span className="text-sm font-semibold text-white">{ann.text}</span>
                    </div>
                    {ann.link && (
                      <span className="text-xs text-purple-400 flex items-center gap-1">
                        Link: {ann.link}
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      onClick={() => handleToggleActive(ann)}
                      className={`text-xs px-2.5 py-1 rounded-lg border transition-colors ${
                        ann.is_active 
                          ? 'border-emerald-500/40 text-emerald-300 bg-emerald-500/10' 
                          : 'border-slate-600 text-slate-400'
                      }`}
                    >
                      {ann.is_active ? 'Active' : 'Inactive'}
                    </button>
                    <button
                      onClick={() => openEditModal(ann)}
                      className="p-2 rounded-lg bg-[#202035] hover:bg-purple-600 text-slate-300 hover:text-white transition-colors"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => setDeleteConfirmId(ann.id)}
                      className="p-2 rounded-lg bg-[#202035] hover:bg-rose-600 text-slate-300 hover:text-white transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* 3. BANNERS TAB */}
        {activeTab === 'banners' && (
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {banners.map((ban) => (
                <Card key={ban.id} className="p-5 bg-[#161625] border-[#2a2a3e] space-y-4 flex flex-col justify-between">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-mono text-purple-400 uppercase">Page: {ban.page || 'home'}</span>
                      <Badge variant={ban.is_active ? 'emerald' : 'slate'}>
                        {ban.is_active ? 'Active' : 'Hidden'}
                      </Badge>
                    </div>

                    <h3 className="text-lg font-bold text-white">{ban.title}</h3>
                    {ban.subtitle && <p className="text-xs text-slate-300">{ban.subtitle}</p>}

                    {ban.image_url && (
                      <img src={ban.image_url} alt={ban.title} className="w-full h-32 object-cover rounded-xl" />
                    )}

                    <div className="text-xs text-slate-400">
                      Button: <strong>{ban.button_text || 'None'}</strong> → {ban.button_link}
                    </div>
                  </div>

                  <div className="pt-3 border-t border-[#2a2a3e] flex items-center justify-between">
                    <button
                      onClick={() => handleToggleActive(ban)}
                      className="text-xs text-slate-300 hover:text-white"
                    >
                      Toggle {ban.is_active ? 'Off' : 'On'}
                    </button>

                    <div className="flex items-center gap-2">
                      <Button variant="outline" size="sm" onClick={() => openEditModal(ban)}>
                        Edit
                      </Button>
                      <Button variant="danger" size="sm" onClick={() => setDeleteConfirmId(ban.id)}>
                        Delete
                      </Button>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* 4. QUICK STATS TAB */}
        {activeTab === 'quick_stats' && (
          <div className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {quickStats.map((stat) => (
                <Card key={stat.id} className="p-5 bg-[#161625] border-[#2a2a3e] space-y-3 flex flex-col justify-between">
                  <div className="space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-mono text-slate-400 uppercase">Icon: {stat.icon || 'star'}</span>
                      <span className="text-[10px] text-purple-400 font-bold">Pos #{stat.position}</span>
                    </div>
                    <div className="text-2xl font-bold text-white">{stat.value}</div>
                    <div className="text-xs text-slate-300 font-medium">{stat.label}</div>
                  </div>

                  <div className="pt-3 border-t border-[#2a2a3e] flex items-center justify-between">
                    <button onClick={() => openEditModal(stat)} className="text-xs text-purple-400 hover:underline">
                      Edit
                    </button>
                    <button onClick={() => setDeleteConfirmId(stat.id)} className="text-xs text-rose-400 hover:underline">
                      Delete
                    </button>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* 5. CORE VALUES TAB */}
        {activeTab === 'core_values' && (
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {coreValues.map((val) => (
                <Card key={val.id} className="p-5 bg-[#161625] border-[#2a2a3e] space-y-3 flex flex-col justify-between">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-mono text-pink-400">Icon: {val.icon}</span>
                      <span className="text-xs text-slate-400 font-bold">Position #{val.position}</span>
                    </div>
                    <h3 className="text-base font-bold text-white">{val.title}</h3>
                    <p className="text-xs text-slate-300 leading-relaxed">{val.description}</p>
                  </div>

                  <div className="pt-3 border-t border-[#2a2a3e] flex items-center justify-end gap-2">
                    <Button variant="outline" size="sm" onClick={() => openEditModal(val)}>
                      Edit
                    </Button>
                    <Button variant="danger" size="sm" onClick={() => setDeleteConfirmId(val.id)}>
                      Delete
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* 6. ACHIEVEMENTS TAB */}
        {activeTab === 'achievements' && (
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {achievements.map((ach) => (
                <Card key={ach.id} className="p-5 bg-[#161625] border-[#2a2a3e] space-y-3 flex flex-col justify-between">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="px-2 py-0.5 rounded-full bg-amber-500/15 text-amber-300 text-xs font-bold border border-amber-500/20">
                        {ach.year || 'Honor'}
                      </span>
                      <span className="text-xs text-slate-400">Position #{ach.position}</span>
                    </div>
                    <h3 className="text-base font-bold text-white">{ach.title}</h3>
                    <p className="text-xs text-slate-300 leading-relaxed">{ach.description}</p>
                  </div>

                  <div className="pt-3 border-t border-[#2a2a3e] flex items-center justify-end gap-2">
                    <Button variant="outline" size="sm" onClick={() => openEditModal(ach)}>
                      Edit
                    </Button>
                    <Button variant="danger" size="sm" onClick={() => setDeleteConfirmId(ach.id)}>
                      Delete
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* 7. POPUPS & ADS TAB */}
        {activeTab === 'popups' && (
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {popups.map((pop) => (
                <Card key={pop.id} className="p-5 bg-[#161625] border-[#2a2a3e] space-y-4">
                  <div className="flex items-center justify-between">
                    <Badge variant={pop.is_active ? 'emerald' : 'slate'}>
                      {pop.is_active ? 'Active Popup' : 'Disabled'}
                    </Badge>
                    <span className="text-xs text-slate-400">
                      Show Once: <strong>{pop.show_once ? 'Yes' : 'Every Visit'}</strong>
                    </span>
                  </div>

                  {pop.image_url && (
                    <img src={pop.image_url} alt={pop.title || ''} className="w-full h-36 object-cover rounded-xl" />
                  )}

                  <h3 className="text-lg font-bold text-white">{pop.title}</h3>
                  <p className="text-xs text-slate-300 leading-relaxed">{pop.message}</p>

                  <div className="text-xs text-purple-300">
                    CTA Button: <strong>{pop.button_text}</strong> ({pop.button_link})
                  </div>

                  <div className="pt-3 border-t border-[#2a2a3e] flex items-center justify-between">
                    <button onClick={() => handleToggleActive(pop)} className="text-xs text-slate-400 hover:text-white">
                      Toggle Active
                    </button>
                    <div className="flex items-center gap-2">
                      <Button variant="outline" size="sm" onClick={() => openEditModal(pop)}>Edit</Button>
                      <Button variant="danger" size="sm" onClick={() => setDeleteConfirmId(pop.id)}>Delete</Button>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* 8. SOCIAL MEDIA TAB */}
        {activeTab === 'social_media' && (
          <div className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {socialMedia.map((soc) => (
                <Card key={soc.id} className="p-5 bg-[#161625] border-[#2a2a3e] space-y-3 flex flex-col justify-between">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-base font-bold text-white">{soc.platform}</span>
                      <span className="text-[10px] text-purple-400 font-bold">Pos #{soc.position}</span>
                    </div>
                    <div className="text-xs text-slate-300 truncate">
                      {soc.followers_count || 'Link'}
                    </div>
                    <a href={soc.url} target="_blank" rel="noreferrer" className="text-xs text-purple-400 hover:underline truncate block">
                      {soc.url}
                    </a>
                  </div>

                  <div className="pt-3 border-t border-[#2a2a3e] flex items-center justify-between">
                    <button onClick={() => openEditModal(soc)} className="text-xs text-purple-400 hover:underline">
                      Edit
                    </button>
                    <button onClick={() => setDeleteConfirmId(soc.id)} className="text-xs text-rose-400 hover:underline">
                      Delete
                    </button>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        )}

      </div>

      {/* Add / Edit Item Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={`${editingItem ? 'Edit' : 'Add New'} ${tabsConfig.find(t => t.id === activeTab)?.label}`}
        maxWidth="lg"
      >
        <form onSubmit={handleSave} className="space-y-4">
          
          {/* Hero Slide Form */}
          {activeTab === 'hero_slides' && (
            <>
              <Input
                label="Main Headline *"
                required
                value={formData.heading || ''}
                onChange={(e) => setFormData({ ...formData, heading: e.target.value })}
                placeholder="e.g. Welcome to Girls Academy"
              />
              <Input
                label="Subheading Pill"
                value={formData.subheading || ''}
                onChange={(e) => setFormData({ ...formData, subheading: e.target.value })}
                placeholder="e.g. Admissions Open 2026-2027"
              />
              <Textarea
                label="Description Subtext"
                rows={3}
                value={formData.description || ''}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Highlight academic excellence, mentorship, and vision..."
              />
              <ImageUpload
                label="Slide Background Image (Upload Pic or Enter URL)"
                value={formData.image_url || ''}
                onChange={(url) => setFormData({ ...formData, image_url: url })}
                helperText="High-resolution hero banner photograph (16:9 recommended)"
              />
              <div className="grid grid-cols-2 gap-3">
                <Input
                  label="Button 1 Text"
                  value={formData.button1_text || ''}
                  onChange={(e) => setFormData({ ...formData, button1_text: e.target.value })}
                />
                <Input
                  label="Button 1 Link"
                  value={formData.button1_link || ''}
                  onChange={(e) => setFormData({ ...formData, button1_link: e.target.value })}
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <Input
                  label="Button 2 Text"
                  value={formData.button2_text || ''}
                  onChange={(e) => setFormData({ ...formData, button2_text: e.target.value })}
                />
                <Input
                  label="Button 2 Link"
                  value={formData.button2_link || ''}
                  onChange={(e) => setFormData({ ...formData, button2_link: e.target.value })}
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <Input
                  label="Display Position Order"
                  type="number"
                  value={formData.position || 1}
                  onChange={(e) => setFormData({ ...formData, position: parseInt(e.target.value) || 1 })}
                />
                <div className="flex items-center gap-2 pt-6">
                  <input
                    type="checkbox"
                    id="is_active_hero"
                    checked={formData.is_active !== false}
                    onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
                    className="w-4 h-4 rounded text-purple-600"
                  />
                  <label htmlFor="is_active_hero" className="text-xs text-white">Active (Visible)</label>
                </div>
              </div>
            </>
          )}

          {/* Announcements Form */}
          {activeTab === 'announcements' && (
            <>
              <Textarea
                label="Announcement Notice Text *"
                required
                rows={3}
                value={formData.text || ''}
                onChange={(e) => setFormData({ ...formData, text: e.target.value })}
                placeholder="e.g. Admissions Open for Session 2026-2027 — Limited Seats Available!"
              />
              <Input
                label="Target Link (optional)"
                value={formData.link || ''}
                onChange={(e) => setFormData({ ...formData, link: e.target.value })}
                placeholder="/admissions"
              />
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="is_active_ann"
                  checked={formData.is_active !== false}
                  onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
                  className="w-4 h-4 rounded text-purple-600"
                />
                <label htmlFor="is_active_ann" className="text-xs text-white">Active (Display in top ticker)</label>
              </div>
            </>
          )}

          {/* Banners Form */}
          {activeTab === 'banners' && (
            <>
              <Input
                label="Banner Title *"
                required
                value={formData.title || ''}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              />
              <Textarea
                label="Subtitle"
                rows={2}
                value={formData.subtitle || ''}
                onChange={(e) => setFormData({ ...formData, subtitle: e.target.value })}
              />
              <ImageUpload
                label="Banner Image Artwork (Upload Pic or Enter URL)"
                value={formData.image_url || ''}
                onChange={(url) => setFormData({ ...formData, image_url: url })}
                helperText="Promotional banner artwork for admission notices or events"
              />
              <div className="grid grid-cols-2 gap-3">
                <Input
                  label="Button Text"
                  value={formData.button_text || ''}
                  onChange={(e) => setFormData({ ...formData, button_text: e.target.value })}
                />
                <Input
                  label="Button Link"
                  value={formData.button_link || ''}
                  onChange={(e) => setFormData({ ...formData, button_link: e.target.value })}
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <Input
                  label="Target Page"
                  value={formData.page || 'home'}
                  onChange={(e) => setFormData({ ...formData, page: e.target.value })}
                />
                <Input
                  label="Position"
                  type="number"
                  value={formData.position || 1}
                  onChange={(e) => setFormData({ ...formData, position: parseInt(e.target.value) || 1 })}
                />
              </div>
            </>
          )}

          {/* Quick Stats Form */}
          {activeTab === 'quick_stats' && (
            <>
              <Input
                label="Statistic Label *"
                required
                value={formData.label || ''}
                onChange={(e) => setFormData({ ...formData, label: e.target.value })}
                placeholder="e.g. Total Students"
              />
              <Input
                label="Display Value *"
                required
                value={formData.value || ''}
                onChange={(e) => setFormData({ ...formData, value: e.target.value })}
                placeholder="e.g. 1,250+"
              />
              <Input
                label="Icon Name (users, book, graduation-cap, award, clock, star)"
                value={formData.icon || 'users'}
                onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
              />
              <Input
                label="Position Order"
                type="number"
                value={formData.position || 1}
                onChange={(e) => setFormData({ ...formData, position: parseInt(e.target.value) || 1 })}
              />
            </>
          )}

          {/* Core Values Form */}
          {activeTab === 'core_values' && (
            <>
              <Input
                label="Value Title *"
                required
                value={formData.title || ''}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="e.g. Academic Excellence"
              />
              <Textarea
                label="Description *"
                required
                rows={3}
                value={formData.description || ''}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              />
              <Input
                label="Icon Name (award, heart, shield, monitor, globe)"
                value={formData.icon || 'award'}
                onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
              />
              <Input
                label="Position"
                type="number"
                value={formData.position || 1}
                onChange={(e) => setFormData({ ...formData, position: parseInt(e.target.value) || 1 })}
              />
            </>
          )}

          {/* Achievements Form */}
          {activeTab === 'achievements' && (
            <>
              <Input
                label="Achievement Title *"
                required
                value={formData.title || ''}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              />
              <Textarea
                label="Description *"
                required
                rows={3}
                value={formData.description || ''}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              />
              <div className="grid grid-cols-2 gap-3">
                <Input
                  label="Year"
                  value={formData.year || '2026'}
                  onChange={(e) => setFormData({ ...formData, year: e.target.value })}
                />
                <Input
                  label="Icon (trophy, award, star, medal)"
                  value={formData.icon || 'trophy'}
                  onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
                />
              </div>
              <Input
                label="Position"
                type="number"
                value={formData.position || 1}
                onChange={(e) => setFormData({ ...formData, position: parseInt(e.target.value) || 1 })}
              />
            </>
          )}

          {/* Popups Form */}
          {activeTab === 'popups' && (
            <>
              <Input
                label="Popup Title *"
                required
                value={formData.title || ''}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="e.g. Admissions Open 2026-2027"
              />
              <Textarea
                label="Message *"
                required
                rows={3}
                value={formData.message || ''}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
              />
              <ImageUpload
                label="Popup Modal Artwork / Poster (Upload Pic or Enter URL)"
                value={formData.image_url || ''}
                onChange={(url) => setFormData({ ...formData, image_url: url })}
                helperText="Poster or flyer featured inside the visitor modal alert"
              />
              <div className="grid grid-cols-2 gap-3">
                <Input
                  label="Button Text"
                  value={formData.button_text || ''}
                  onChange={(e) => setFormData({ ...formData, button_text: e.target.value })}
                />
                <Input
                  label="Button Link"
                  value={formData.button_link || ''}
                  onChange={(e) => setFormData({ ...formData, button_link: e.target.value })}
                />
              </div>
              <div className="flex items-center gap-4 pt-2">
                <label className="flex items-center gap-2 text-xs text-white">
                  <input
                    type="checkbox"
                    checked={formData.show_once !== false}
                    onChange={(e) => setFormData({ ...formData, show_once: e.target.checked })}
                    className="w-4 h-4 rounded text-purple-600"
                  />
                  <span>Show only once per user session</span>
                </label>
                <label className="flex items-center gap-2 text-xs text-white">
                  <input
                    type="checkbox"
                    checked={formData.is_active !== false}
                    onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
                    className="w-4 h-4 rounded text-purple-600"
                  />
                  <span>Is Active</span>
                </label>
              </div>
            </>
          )}

          {/* Social Media Form */}
          {activeTab === 'social_media' && (
            <>
              <Input
                label="Platform Name *"
                required
                value={formData.platform || ''}
                onChange={(e) => setFormData({ ...formData, platform: e.target.value })}
                placeholder="e.g. Facebook, Instagram, YouTube, WhatsApp"
              />
              <Input
                label="Profile / Direct Link URL *"
                required
                value={formData.url || ''}
                onChange={(e) => setFormData({ ...formData, url: e.target.value })}
                placeholder="https://facebook.com/..."
              />
              <div className="grid grid-cols-2 gap-3">
                <Input
                  label="Preset Icon (facebook, instagram, youtube, twitter, linkedin, message-circle)"
                  value={formData.icon || 'facebook'}
                  onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
                />
                <Input
                  label="Followers / Text Badge"
                  value={formData.followers_count || ''}
                  onChange={(e) => setFormData({ ...formData, followers_count: e.target.value })}
                  placeholder="e.g. 5,200"
                />
              </div>
              <ImageUpload
                label="Or Custom Logo / Icon (Upload Pic or Enter URL)"
                value={formData.icon?.startsWith('data:') || formData.icon?.startsWith('http') ? formData.icon : ''}
                onChange={(url) => setFormData({ ...formData, icon: url })}
                helperText="Upload custom platform emblem or branding sticker"
              />
              <Input
                label="Position Order"
                type="number"
                value={formData.position || 1}
                onChange={(e) => setFormData({ ...formData, position: parseInt(e.target.value) || 1 })}
              />
            </>
          )}

          <div className="flex justify-end gap-3 pt-4 border-t border-[#2a2a3e]">
            <Button variant="ghost" size="md" type="button" onClick={() => setIsModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" size="md" type="submit" leftIcon={<Save className="w-4 h-4" />}>
              Save to Database
            </Button>
          </div>
        </form>
      </Modal>

      {/* Delete Confirmation Modal */}
      <ConfirmDialog
        isOpen={Boolean(deleteConfirmId)}
        onClose={() => setDeleteConfirmId(null)}
        onConfirm={handleDelete}
        title="Confirm Deletion"
        message="Are you sure you want to permanently delete this content item? This action will remove it from the Supabase database and frontend immediately."
        confirmText="Delete Item"
        variant="danger"
      />
      </div>
    </PortalLayout>
  );
};
