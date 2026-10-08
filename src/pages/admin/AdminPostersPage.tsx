import React, { useState, useEffect } from 'react';
import { 
  Image as ImageIcon, 
  Plus, 
  Search, 
  Edit, 
  Trash2, 
  CheckCircle2, 
  Calendar, 
  Users, 
  Eye, 
  EyeOff, 
  X, 
  ExternalLink,
  Sparkles,
  Download,
  RefreshCw,
  Tag
} from 'lucide-react';
import { PortalLayout } from '../../components/layout/PortalLayout';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { Input } from '../../components/ui/Input';
import { Textarea } from '../../components/ui/Textarea';
import { Modal } from '../../components/ui/Modal';
import { ConfirmDialog } from '../../components/ui/ConfirmDialog';
import { ImageUpload } from '../../components/ui/ImageUpload';
import { useToast } from '../../context/ToastContext';
import { Poster } from '../../types';
import { 
  fetchPosters, 
  createPoster, 
  updatePoster, 
  deletePoster 
} from '../../lib/dataService';

export const AdminPostersPage: React.FC = () => {
  const { showToast } = useToast();
  const [posters, setPosters] = useState<Poster[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  // Modal States
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPoster, setEditingPoster] = useState<Poster | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const [previewPoster, setPreviewPoster] = useState<Poster | null>(null);

  // Form Fields
  const [formData, setFormData] = useState<Partial<Poster>>({
    title: '',
    category: 'Admissions',
    image_url: '',
    description: '',
    event_date: '',
    target_audience: 'All Students & Parents',
    is_active: true,
    display_order: 1
  });

  const loadPosters = async () => {
    setIsLoading(true);
    try {
      const data = await fetchPosters(false);
      setPosters(data);
    } catch (err: any) {
      showToast(err.message || 'Error loading campus posters', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadPosters();
    const handleFocus = () => loadPosters();
    window.addEventListener('focus', handleFocus);
    window.addEventListener('storage', handleFocus);
    return () => {
      window.removeEventListener('focus', handleFocus);
      window.removeEventListener('storage', handleFocus);
    };
  }, []);

  const categories = [
    'All',
    'Admissions',
    'Academic Notice',
    'Competition',
    'Sports Gala',
    'Annual Function',
    'Workshop'
  ];

  const handleOpenAdd = () => {
    setEditingPoster(null);
    setFormData({
      title: '',
      category: 'Admissions',
      image_url: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=1200&q=80',
      description: '',
      event_date: 'Deadline: 15 November 2026',
      target_audience: 'Aspiring Female Scholars & Parents',
      is_active: true,
      display_order: posters.length + 1
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (p: Poster) => {
    setEditingPoster(p);
    setFormData({ ...p });
    setIsModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title?.trim() || !formData.image_url?.trim()) {
      showToast('Poster title and image are required.', 'error');
      return;
    }

    try {
      if (editingPoster) {
        await updatePoster(editingPoster.id, formData);
        showToast('Campus poster updated successfully!', 'success');
      } else {
        await createPoster({
          title: formData.title,
          category: formData.category || 'Admissions',
          image_url: formData.image_url,
          description: formData.description || '',
          event_date: formData.event_date || '',
          target_audience: formData.target_audience || 'All Students',
          is_active: formData.is_active !== false,
          display_order: formData.display_order || 1
        });
        showToast('New campus poster added successfully!', 'success');
      }
      setIsModalOpen(false);
      loadPosters();
    } catch (err: any) {
      showToast(err.message || 'Failed to save poster', 'error');
    }
  };

  const handleDelete = async () => {
    if (!deleteConfirmId) return;
    try {
      await deletePoster(deleteConfirmId);
      showToast('Poster deleted successfully.', 'info');
      setDeleteConfirmId(null);
      loadPosters();
    } catch (err: any) {
      showToast(err.message || 'Failed to delete poster', 'error');
    }
  };

  const handleToggleActive = async (p: Poster) => {
    try {
      await updatePoster(p.id, { is_active: !p.is_active });
      showToast(`Poster set to ${!p.is_active ? 'Active' : 'Hidden'}.`, 'info');
      loadPosters();
    } catch (err: any) {
      showToast(err.message || 'Error updating status', 'error');
    }
  };

  const filteredPosters = posters.filter((p) => {
    const matchesSearch = 
      p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (p.description || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (p.category || '').toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = 
      selectedCategory.toLowerCase() === 'all' || 
      (p.category || '').toLowerCase() === selectedCategory.toLowerCase();
    return matchesSearch && matchesCategory;
  });

  return (
    <PortalLayout
      pageTitle="Campus Notice Board & Posters"
      pageSubtitle="Publish, modify, and manage official academy posters, event flyers, and high-resolution bulletin announcements"
    >
      <div className="space-y-6">
        {/* Top Control Bar */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Badge variant="purple">
              {posters.filter(p => p.is_active).length} Active Posters
            </Badge>
            <span className="text-xs text-slate-400">
              Total {posters.length} flyers in database
            </span>
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto">
            <Button
              variant="outline"
              size="sm"
              onClick={loadPosters}
              isLoading={isLoading}
              leftIcon={<RefreshCw className="w-3.5 h-3.5" />}
            >
              Refresh
            </Button>
            <Button
              variant="primary"
              size="sm"
              onClick={handleOpenAdd}
              leftIcon={<Plus className="w-4 h-4" />}
            >
              Add New Poster
            </Button>
          </div>
        </div>

        {/* Filter and Search Bar */}
        <Card className="p-4 bg-[#161625] border-[#2a2a3e]">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-center">
            <div className="md:col-span-6">
              <Input
                placeholder="Search posters by title, notice, or category..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                leftIcon={<Search className="w-4 h-4 text-purple-400" />}
              />
            </div>
            <div className="md:col-span-6 flex items-center justify-end gap-1.5 flex-wrap">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-all ${
                    selectedCategory.toLowerCase() === cat.toLowerCase()
                      ? 'bg-purple-600 text-white shadow-md shadow-purple-950/40'
                      : 'bg-white/[0.03] text-slate-400 hover:text-white border border-[#2a2a3e]'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>
        </Card>

        {/* Posters Grid */}
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <Card key={i} className="h-80 bg-[#161625] border-[#2a2a3e] animate-pulse" />
            ))}
          </div>
        ) : filteredPosters.length === 0 ? (
          <Card className="p-12 text-center bg-[#161625] border-[#2a2a3e] space-y-4">
            <div className="w-16 h-16 rounded-2xl bg-purple-500/10 text-purple-400 flex items-center justify-center mx-auto border border-purple-500/20">
              <ImageIcon className="w-8 h-8" />
            </div>
            <h3 className="text-lg font-bold text-white">No Campus Posters Found</h3>
            <p className="text-xs text-slate-400 max-w-sm mx-auto">
              No posters match the current filter or search criteria. Click below to add the first poster.
            </p>
            <Button variant="primary" size="sm" onClick={handleOpenAdd} leftIcon={<Plus className="w-4 h-4" />}>
              Add Campus Poster
            </Button>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredPosters.map((poster) => (
              <Card
                key={poster.id}
                className={`overflow-hidden flex flex-col justify-between border transition-all group ${
                  poster.is_active 
                    ? 'bg-[#161625] border-[#2a2a3e] hover:border-purple-500/50' 
                    : 'bg-[#12121d] border-[#222230] opacity-75'
                }`}
              >
                <div>
                  {/* Poster Image Artwork */}
                  <div className="relative aspect-[4/3] overflow-hidden bg-black/40 border-b border-[#2a2a3e]">
                    <img
                      src={poster.image_url}
                      alt={poster.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute top-3 left-3">
                      <Badge variant="purple">{poster.category}</Badge>
                    </div>
                    <div className="absolute top-3 right-3 flex items-center gap-1.5">
                      <button
                        onClick={() => handleToggleActive(poster)}
                        className={`p-1.5 rounded-lg text-xs font-medium backdrop-blur-md transition-colors ${
                          poster.is_active 
                            ? 'bg-emerald-500/80 text-white hover:bg-emerald-600' 
                            : 'bg-slate-700/80 text-slate-300 hover:bg-slate-600'
                        }`}
                        title={poster.is_active ? 'Click to hide from website' : 'Click to make live on website'}
                      >
                        {poster.is_active ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
                      </button>
                      <button
                        onClick={() => setPreviewPoster(poster)}
                        className="p-1.5 rounded-lg bg-black/60 hover:bg-black/90 text-white backdrop-blur-md transition-colors"
                        title="View Full Resolution"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  {/* Poster Content */}
                  <div className="p-5 space-y-3">
                    <h3 className="text-base font-bold text-white line-clamp-2 leading-snug">
                      {poster.title}
                    </h3>
                    {poster.description && (
                      <p className="text-xs text-slate-300 line-clamp-2 leading-relaxed">
                        {poster.description}
                      </p>
                    )}

                    <div className="pt-2 space-y-1.5 text-[11px] text-slate-400 border-t border-[#2a2a3e]/60">
                      {poster.event_date && (
                        <div className="flex items-center gap-1.5 text-purple-300 font-medium">
                          <Calendar className="w-3.5 h-3.5 text-purple-400" />
                          <span>{poster.event_date}</span>
                        </div>
                      )}
                      {poster.target_audience && (
                        <div className="flex items-center gap-1.5">
                          <Users className="w-3.5 h-3.5 text-slate-500" />
                          <span>{poster.target_audience}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Card Actions Footer */}
                <div className="p-4 bg-[#12121e] border-t border-[#2a2a3e] flex items-center justify-between">
                  <span className="text-[10px] text-slate-500 font-mono">
                    Priority: #{poster.display_order}
                  </span>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleOpenEdit(poster)}
                      leftIcon={<Edit className="w-3 h-3" />}
                    >
                      Edit
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-rose-400 hover:text-rose-300 hover:bg-rose-500/10"
                      onClick={() => setDeleteConfirmId(poster.id)}
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}

        {/* Add / Edit Poster Modal */}
        <Modal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          title={`${editingPoster ? 'Edit' : 'Add New'} Campus Poster / Flyer`}
          maxWidth="lg"
        >
          <form onSubmit={handleSave} className="space-y-4">
            <div>
              <label className="block text-[11px] font-semibold text-slate-300 mb-1">Poster Title / Headline *</label>
              <Input
                required
                placeholder="e.g. Admissions Open 2026-2027: Merit Scholarships"
                value={formData.title || ''}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-semibold text-slate-300 mb-1">Category *</label>
                <select
                  value={formData.category || 'Admissions'}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="w-full bg-[#11111d] border border-[#2a2a3e] text-white text-xs rounded-xl px-3 py-2.5 focus:outline-none focus:border-purple-500"
                >
                  <option value="Admissions">Admissions</option>
                  <option value="Academic Notice">Academic Notice</option>
                  <option value="Competition">Competition & STEM</option>
                  <option value="Sports Gala">Sports Gala</option>
                  <option value="Annual Function">Annual Function</option>
                  <option value="Workshop">Workshop / Seminar</option>
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-300 mb-1">Event Date or Deadline</label>
                <Input
                  placeholder="e.g. 15 November 2026"
                  value={formData.event_date || ''}
                  onChange={(e) => setFormData({ ...formData, event_date: e.target.value })}
                />
              </div>
            </div>

            {/* Poster Image Upload */}
            <div>
              <ImageUpload
                label="Poster Artwork Image (Upload Pic or Enter URL) *"
                value={formData.image_url || ''}
                onChange={(url) => setFormData({ ...formData, image_url: url })}
                helperText="Upload official promotional poster, banner, or bulletin photo"
              />
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-slate-300 mb-1">Description / Key Highlights</label>
              <Textarea
                rows={3}
                placeholder="Details about eligibility, program offerings, venue, prizes, or instructions..."
                value={formData.description || ''}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-semibold text-slate-300 mb-1">Target Audience</label>
                <Input
                  placeholder="e.g. Matric & FSc Scholars, Parents"
                  value={formData.target_audience || ''}
                  onChange={(e) => setFormData({ ...formData, target_audience: e.target.value })}
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-300 mb-1">Display Priority Order</label>
                <Input
                  type="number"
                  value={formData.display_order || 1}
                  onChange={(e) => setFormData({ ...formData, display_order: parseInt(e.target.value) || 1 })}
                />
              </div>
            </div>

            <div className="pt-2">
              <label className="flex items-center gap-2 text-xs text-white cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.is_active !== false}
                  onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
                  className="w-4 h-4 rounded text-purple-600"
                />
                <span>Active & Live on Website</span>
              </label>
            </div>

            <div className="pt-4 flex items-center justify-end gap-2 border-t border-[#2a2a3e]">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setIsModalOpen(false)}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                variant="primary"
                size="sm"
                leftIcon={<Plus className="w-3.5 h-3.5" />}
              >
                {editingPoster ? 'Save Changes' : 'Publish Poster'}
              </Button>
            </div>
          </form>
        </Modal>

        {/* Lightbox / Inspect Poster Modal */}
        {previewPoster && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md animate-fade-in">
            <div className="relative max-w-4xl max-h-[90vh] bg-[#141422] border border-[#2a2a3e] rounded-3xl overflow-hidden flex flex-col">
              <div className="p-4 border-b border-[#2a2a3e] flex items-center justify-between">
                <div>
                  <h3 className="text-base font-bold text-white">{previewPoster.title}</h3>
                  <span className="text-xs text-purple-400">{previewPoster.category}</span>
                </div>
                <button
                  onClick={() => setPreviewPoster(null)}
                  className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/5"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              <div className="p-4 overflow-auto max-h-[75vh] flex items-center justify-center">
                <img
                  src={previewPoster.image_url}
                  alt={previewPoster.title}
                  className="max-h-[70vh] object-contain rounded-xl shadow-2xl"
                />
              </div>
              <div className="p-4 bg-[#11111d] border-t border-[#2a2a3e] flex items-center justify-between">
                <p className="text-xs text-slate-300 max-w-lg">{previewPoster.description}</p>
                <a
                  href={previewPoster.image_url}
                  target="_blank"
                  rel="noreferrer"
                  download
                  className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-semibold flex items-center gap-1.5 transition-colors"
                >
                  <Download className="w-4 h-4" /> Download Artwork
                </a>
              </div>
            </div>
          </div>
        )}

        {/* Delete Confirm Dialog */}
        <ConfirmDialog
          isOpen={Boolean(deleteConfirmId)}
          onClose={() => setDeleteConfirmId(null)}
          onConfirm={handleDelete}
          title="Delete Campus Poster"
          message="Are you sure you want to permanently delete this campus poster? It will be removed from the notice board and website immediately."
          confirmText="Delete Poster"
          variant="danger"
        />
      </div>
    </PortalLayout>
  );
};
