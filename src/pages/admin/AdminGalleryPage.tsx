import React, { useState, useEffect } from 'react';
import { PortalLayout } from '../../components/layout/PortalLayout';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { Input } from '../../components/ui/Input';
import { ImageUpload } from '../../components/ui/ImageUpload';
import { 
  Image as ImageIcon, 
  Upload, 
  Plus, 
  Trash2, 
  Pencil, 
  X, 
  CheckCircle2, 
  ExternalLink,
  Video,
  Film
} from 'lucide-react';
import { fetchGalleryItems, addGalleryItem, updateGalleryItem, deleteGalleryItem } from '../../lib/dataService';
import { GalleryItem } from '../../types';

export const AdminGalleryPage: React.FC = () => {
  const [items, setItems] = useState<GalleryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingItem, setEditingItem] = useState<GalleryItem | null>(null);
  const [deletingItem, setDeletingItem] = useState<GalleryItem | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form State
  const [title, setTitle] = useState('');
  const [mediaUrl, setMediaUrl] = useState('');
  const [mediaType, setMediaType] = useState<'image' | 'video'>('image');

  // Edit State
  const [editTitle, setEditTitle] = useState('');
  const [editMediaUrl, setEditMediaUrl] = useState('');
  const [editMediaType, setEditMediaType] = useState<'image' | 'video'>('image');

  useEffect(() => {
    loadGallery();
  }, []);

  const loadGallery = async () => {
    setLoading(true);
    try {
      const data = await fetchGalleryItems();
      setItems(data);
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!mediaUrl.trim()) return;

    setIsSubmitting(true);
    try {
      await addGalleryItem({
        title: title.trim() || 'Campus Gallery Item',
        media_url: mediaUrl.trim(),
        media_type: mediaType
      });

      setToastMessage('New media uploaded to gallery successfully!');
      setShowAddModal(false);
      setTitle('');
      setMediaUrl('');
      await loadGallery();
      setTimeout(() => setToastMessage(null), 3000);
    } catch (err: any) {
      alert('Error uploading item: ' + err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const openEdit = (item: GalleryItem) => {
    setEditingItem(item);
    setEditTitle(item.title || '');
    setEditMediaUrl(item.media_url);
    setEditMediaType(item.media_type || 'image');
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingItem) return;

    setIsSubmitting(true);
    try {
      await updateGalleryItem(editingItem.id, {
        title: editTitle,
        media_url: editMediaUrl,
        media_type: editMediaType
      });

      setToastMessage('Gallery media details updated.');
      setEditingItem(null);
      await loadGallery();
      setTimeout(() => setToastMessage(null), 3000);
    } catch (err: any) {
      alert('Error updating item: ' + err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!deletingItem) return;
    setIsSubmitting(true);
    try {
      await deleteGalleryItem(deletingItem.id);
      setToastMessage('Media item removed from gallery.');
      setDeletingItem(null);
      await loadGallery();
      setTimeout(() => setToastMessage(null), 3000);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <PortalLayout
      pageTitle="Campus Media & Photographic Gallery"
      pageSubtitle="Upload, caption, update, or remove campus photographs, laboratory exhibits, and ceremonial media"
    >
      <div className="space-y-6">

        {/* Top Control Bar */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-sm font-bold text-white">Media Archives ({items.length})</h2>
            <p className="text-xs text-slate-400">Photos and video captures displayed across the public academy portal</p>
          </div>

          <Button
            variant="primary"
            size="sm"
            onClick={() => setShowAddModal(true)}
            leftIcon={<Upload className="w-4 h-4" />}
          >
            Upload New Media
          </Button>
        </div>

        {/* Toast */}
        {toastMessage && (
          <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 flex items-center gap-3 animate-fade-in text-xs font-semibold">
            <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-400" />
            <span>{toastMessage}</span>
          </div>
        )}

        {/* Gallery Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
          {items.map((item) => (
            <Card key={item.id} className="p-0 overflow-hidden bg-[#181827] border-[#2a2a3e] group flex flex-col justify-between">
              <div className="relative aspect-video bg-[#10101a] overflow-hidden">
                {item.media_type === 'video' ? (
                  <div className="w-full h-full flex flex-col items-center justify-center bg-purple-950/20 text-purple-400">
                    <Film className="w-10 h-10 mb-1" />
                    <span className="text-[10px] font-semibold uppercase">Video Media</span>
                  </div>
                ) : (
                  <img
                    src={item.media_url}
                    alt={item.title || 'Campus Item'}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    onError={(e) => {
                      (e.target as any).src = 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=600&q=80';
                    }}
                  />
                )}
                <div className="absolute top-2 right-2">
                  <Badge variant={item.media_type === 'video' ? 'pink' : 'purple'} size="sm">
                    {item.media_type.toUpperCase()}
                  </Badge>
                </div>
              </div>

              <div className="p-4 space-y-3 flex-1 flex flex-col justify-between">
                <div>
                  <h4 className="font-bold text-white text-xs truncate" title={item.title || ''}>
                    {item.title || 'Untitled Photo'}
                  </h4>
                  <p className="text-[10px] text-slate-500 mt-0.5 truncate">
                    {item.media_url}
                  </p>
                </div>

                <div className="pt-2 border-t border-[#2a2a3e] flex items-center justify-end gap-2">
                  <button
                    onClick={() => openEdit(item)}
                    className="p-1.5 rounded-lg border border-purple-500/30 text-purple-300 hover:bg-purple-500/10 transition-colors"
                    title="Edit caption and URL"
                  >
                    <Pencil className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => setDeletingItem(item)}
                    className="p-1.5 rounded-lg border border-rose-500/30 text-rose-400 hover:bg-rose-500/10 transition-colors"
                    title="Delete media from gallery"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </Card>
          ))}
        </div>

        {/* Modal: Upload Media */}
        {showAddModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
            <div className="w-full max-w-md bg-[#181829] border border-[#2a2a3e] rounded-2xl shadow-2xl overflow-hidden">
              <div className="p-5 border-b border-[#2a2a3e] flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Upload className="w-5 h-5 text-purple-400" />
                  <h3 className="text-base font-bold text-white">Upload New Campus Media</h3>
                </div>
                <button
                  onClick={() => setShowAddModal(false)}
                  className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-white/5"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleCreate} className="p-5 space-y-4 text-xs">
                <div>
                  <label className="block text-[11px] font-semibold text-slate-300 mb-1">Title / Caption *</label>
                  <Input
                    required
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="e.g. Annual Convocation Ceremony or Science Exhibition"
                  />
                </div>

                <div>
                  <ImageUpload
                    label="Campus Photograph (Upload Pic or Enter URL) *"
                    value={mediaUrl}
                    onChange={setMediaUrl}
                    helperText="Campus life, science lab, sports ground, or event picture"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-300 mb-1">Media Type</label>
                  <select
                    value={mediaType}
                    onChange={(e) => setMediaType(e.target.value as any)}
                    className="w-full bg-[#11111d] border border-[#2a2a3e] text-white text-xs rounded-xl px-3 py-2.5 focus:outline-none focus:border-purple-500"
                  >
                    <option value="image">Photograph (Image)</option>
                    <option value="video">Video Lecture / Event Clip</option>
                  </select>
                </div>

                <div className="pt-2 flex items-center justify-end gap-2 border-t border-[#2a2a3e]">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => setShowAddModal(false)}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    variant="primary"
                    size="sm"
                    isLoading={isSubmitting}
                  >
                    Save & Publish to Gallery
                  </Button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Modal: Edit Media */}
        {editingItem && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
            <div className="w-full max-w-md bg-[#181829] border border-[#2a2a3e] rounded-2xl shadow-2xl overflow-hidden">
              <div className="p-5 border-b border-[#2a2a3e] flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Pencil className="w-5 h-5 text-purple-400" />
                  <h3 className="text-base font-bold text-white">Edit Gallery Media</h3>
                </div>
                <button
                  onClick={() => setEditingItem(null)}
                  className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-white/5"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleUpdate} className="p-5 space-y-4 text-xs">
                <div>
                  <label className="block text-[11px] font-semibold text-slate-300 mb-1">Title / Caption *</label>
                  <Input
                    required
                    value={editTitle}
                    onChange={(e) => setEditTitle(e.target.value)}
                  />
                </div>

                <div>
                  <ImageUpload
                    label="Campus Photograph (Upload Pic or Enter URL) *"
                    value={editMediaUrl}
                    onChange={setEditMediaUrl}
                    helperText="Campus life, science lab, sports ground, or event picture"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-300 mb-1">Media Type</label>
                  <select
                    value={editMediaType}
                    onChange={(e) => setEditMediaType(e.target.value as any)}
                    className="w-full bg-[#11111d] border border-[#2a2a3e] text-white text-xs rounded-xl px-3 py-2.5 focus:outline-none focus:border-purple-500"
                  >
                    <option value="image">Photograph (Image)</option>
                    <option value="video">Video Lecture / Event Clip</option>
                  </select>
                </div>

                <div className="pt-2 flex items-center justify-end gap-2 border-t border-[#2a2a3e]">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => setEditingItem(null)}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    variant="primary"
                    size="sm"
                    isLoading={isSubmitting}
                  >
                    Save Changes
                  </Button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Modal: Delete Confirmation */}
        {deletingItem && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
            <div className="w-full max-w-sm bg-[#181829] border border-rose-500/40 rounded-2xl shadow-2xl p-6 text-center space-y-4">
              <div className="w-12 h-12 rounded-full bg-rose-500/20 text-rose-400 flex items-center justify-center mx-auto border border-rose-500/30">
                <Trash2 className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-base font-bold text-white">Delete Media Item?</h3>
                <p className="text-xs text-slate-400 mt-1">
                  Are you sure you want to permanently delete <span className="text-white font-semibold">"{deletingItem.title || 'this media'}"</span> from the academy gallery?
                </p>
              </div>
              <div className="flex items-center justify-center gap-3 pt-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setDeletingItem(null)}
                >
                  Cancel
                </Button>
                <Button
                  variant="primary"
                  size="sm"
                  className="bg-rose-600 hover:bg-rose-700 text-white"
                  isLoading={isSubmitting}
                  onClick={handleDelete}
                >
                  Confirm Delete
                </Button>
              </div>
            </div>
          </div>
        )}

      </div>
    </PortalLayout>
  );
};
