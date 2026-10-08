import React, { useState, useEffect } from 'react';
import { PortalLayout } from '../../components/layout/PortalLayout';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { Input } from '../../components/ui/Input';
import { Textarea } from '../../components/ui/Textarea';
import { ImageUpload } from '../../components/ui/ImageUpload';
import { 
  FileText, 
  CheckCircle2, 
  XCircle, 
  Eye, 
  Clock, 
  Filter, 
  AlertCircle,
  X,
  Send,
  ExternalLink,
  Plus,
  Pencil,
  Trash2
} from 'lucide-react';
import { fetchBlogPosts, updateBlogPostStatus, createBlogPost, updateBlogPost, deleteBlogPost } from '../../lib/dataService';
import { BlogPost } from '../../types';

export const AdminBlogPage: React.FC = () => {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [filterStatus, setFilterStatus] = useState<'all' | 'pending' | 'published' | 'draft'>('all');
  const [previewPost, setPreviewPost] = useState<BlogPost | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingPost, setEditingPost] = useState<BlogPost | null>(null);
  const [deletingPost, setDeletingPost] = useState<BlogPost | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form State
  const [formTitle, setFormTitle] = useState('');
  const [formSlug, setFormSlug] = useState('');
  const [formExcerpt, setFormExcerpt] = useState('');
  const [formContent, setFormContent] = useState('');
  const [formImage, setFormImage] = useState('');

  useEffect(() => {
    loadPosts();
  }, []);

  const loadPosts = async () => {
    setIsLoading(true);
    try {
      const all = await fetchBlogPosts('all');
      setPosts(all);
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdateStatus = async (id: string, status: 'published' | 'draft') => {
    await updateBlogPostStatus(id, status);
    setToastMessage(status === 'published' 
      ? 'Article approved and published live to the public Gazette!' 
      : 'Article status updated to draft.');
    await loadPosts();
    if (previewPost?.id === id) setPreviewPost(null);
    setTimeout(() => setToastMessage(null), 4000);
  };

  const handleCreatePost = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formTitle.trim()) return;

    setIsSubmitting(true);
    try {
      await createBlogPost({
        title: formTitle.trim(),
        slug: formSlug.trim() || formTitle.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
        excerpt: formExcerpt.trim(),
        content: formContent.trim(),
        featured_image_url: formImage.trim() || 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=600&q=80',
        status: 'published'
      });

      setToastMessage('New article published to the Gazette successfully!');
      setShowAddModal(false);
      setFormTitle('');
      setFormSlug('');
      setFormExcerpt('');
      setFormContent('');
      setFormImage('');
      await loadPosts();
      setTimeout(() => setToastMessage(null), 3000);
    } catch (err: any) {
      alert('Error publishing post: ' + err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const openEdit = (p: BlogPost) => {
    setEditingPost(p);
    setFormTitle(p.title);
    setFormSlug(p.slug);
    setFormExcerpt(p.excerpt || '');
    setFormContent(p.content || '');
    setFormImage(p.featured_image_url || '');
  };

  const handleSaveEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingPost) return;

    setIsSubmitting(true);
    try {
      await updateBlogPost(editingPost.id, {
        title: formTitle,
        slug: formSlug,
        excerpt: formExcerpt,
        content: formContent,
        featured_image_url: formImage
      });

      setToastMessage('Article updated successfully.');
      setEditingPost(null);
      await loadPosts();
      setTimeout(() => setToastMessage(null), 3000);
    } catch (err: any) {
      alert('Error updating article: ' + err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeletePost = async () => {
    if (!deletingPost) return;
    setIsSubmitting(true);
    try {
      await deleteBlogPost(deletingPost.id);
      setToastMessage(`Article "${deletingPost.title}" deleted.`);
      setDeletingPost(null);
      await loadPosts();
      setTimeout(() => setToastMessage(null), 3000);
    } finally {
      setIsSubmitting(false);
    }
  };

  const filtered = posts.filter(p => filterStatus === 'all' || p.status === filterStatus);
  const pendingCount = posts.filter(p => p.status === 'pending').length;

  return (
    <PortalLayout
      pageTitle="Gazette & Blog Editorial Desk"
      pageSubtitle="Review, edit, publish, or remove scholarly faculty articles and student research essays"
    >
      <div className="space-y-6">

        {/* Top Control Bar */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value as any)}
              className="bg-[#181827] border border-[#2a2a3e] text-white text-xs rounded-xl px-3 py-2 focus:outline-none focus:border-purple-500"
            >
              <option value="all">All Articles ({posts.length})</option>
              <option value="pending">Pending Review ({pendingCount})</option>
              <option value="published">Live Published</option>
              <option value="draft">Faculty Drafts</option>
            </select>

            {pendingCount > 0 && (
              <Badge variant="amber" size="md">
                {pendingCount} Pending Editorial Approval
              </Badge>
            )}
          </div>

          <Button
            variant="primary"
            size="sm"
            onClick={() => {
              setFormTitle('');
              setFormSlug('');
              setFormExcerpt('');
              setFormContent('');
              setFormImage('');
              setShowAddModal(true);
            }}
            leftIcon={<Plus className="w-4 h-4" />}
          >
            Create New Article
          </Button>
        </div>

        {/* Toast */}
        {toastMessage && (
          <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 flex items-center gap-3 animate-fade-in text-xs font-semibold">
            <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-400" />
            <span>{toastMessage}</span>
          </div>
        )}

        {/* Posts Table / Cards */}
        <div className="space-y-4">
          {filtered.map((post) => (
            <Card key={post.id} className="p-5 bg-[#181827] border-[#2a2a3e] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-5 hover:border-purple-500/30 transition-colors">
              <div className="flex items-start gap-4 flex-1">
                <img
                  src={post.featured_image_url || 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=300&q=80'}
                  alt={post.title}
                  className="w-20 h-20 rounded-xl object-cover border border-[#2a2a3e] shrink-0"
                />
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <Badge variant={
                      post.status === 'published' ? 'emerald' :
                      post.status === 'pending' ? 'amber' : 'slate'
                    } size="sm">
                      {post.status.toUpperCase()}
                    </Badge>
                    <span className="text-[10px] text-slate-400">Slug: /{post.slug}</span>
                  </div>
                  <h3 className="text-sm font-bold text-white">{post.title}</h3>
                  <p className="text-xs text-slate-400 line-clamp-1">{post.excerpt}</p>
                  <div className="text-[10px] text-slate-500 pt-1">
                    Created: {new Date(post.created_at || '').toLocaleDateString()}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2 self-end sm:self-center">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setPreviewPost(post)}
                  leftIcon={<Eye className="w-3.5 h-3.5" />}
                >
                  Inspect
                </Button>

                {post.status === 'pending' && (
                  <Button
                    variant="primary"
                    size="sm"
                    onClick={() => handleUpdateStatus(post.id, 'published')}
                    leftIcon={<CheckCircle2 className="w-3.5 h-3.5" />}
                  >
                    Approve & Publish
                  </Button>
                )}

                {post.status === 'published' && (
                  <Button
                    variant="outline"
                    size="sm"
                    className="text-amber-400 border-amber-500/30 hover:bg-amber-500/10"
                    onClick={() => handleUpdateStatus(post.id, 'draft')}
                  >
                    Unpublish
                  </Button>
                )}

                <button
                  onClick={() => openEdit(post)}
                  className="p-2 rounded-lg border border-purple-500/30 text-purple-300 hover:bg-purple-500/10 transition-colors"
                  title="Edit article"
                >
                  <Pencil className="w-3.5 h-3.5" />
                </button>

                <button
                  onClick={() => setDeletingPost(post)}
                  className="p-2 rounded-lg border border-rose-500/30 text-rose-400 hover:bg-rose-500/10 transition-colors"
                  title="Delete article"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </Card>
          ))}
        </div>

        {/* Modal: Create Article */}
        {showAddModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fade-in">
            <div className="w-full max-w-2xl bg-[#181829] border border-[#2a2a3e] rounded-2xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col">
              <div className="p-5 border-b border-[#2a2a3e] flex items-center justify-between shrink-0">
                <div className="flex items-center gap-2">
                  <Plus className="w-5 h-5 text-purple-400" />
                  <h3 className="text-base font-bold text-white">Create New Gazette Article</h3>
                </div>
                <button
                  onClick={() => setShowAddModal(false)}
                  className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-white/5"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleCreatePost} className="p-6 overflow-y-auto space-y-4 text-xs flex-1">
                <div>
                  <label className="block text-[11px] font-semibold text-slate-300 mb-1">Article Headline *</label>
                  <Input
                    required
                    value={formTitle}
                    onChange={(e) => setFormTitle(e.target.value)}
                    placeholder="e.g. Breakthroughs in Quantum Photonic Encryption"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-300 mb-1">Custom Slug (optional)</label>
                  <Input
                    value={formSlug}
                    onChange={(e) => setFormSlug(e.target.value)}
                    placeholder="e.g. quantum-photonic-encryption"
                  />
                </div>

                <div>
                  <ImageUpload
                    label="Featured Article Image (Upload Pic or Enter URL)"
                    value={formImage}
                    onChange={setFormImage}
                    helperText="High-resolution banner artwork for the article"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-300 mb-1">Executive Summary / Excerpt *</label>
                  <Textarea
                    required
                    rows={2}
                    value={formExcerpt}
                    onChange={(e) => setFormExcerpt(e.target.value)}
                    placeholder="Brief 1-2 sentence preview for directory cards..."
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-300 mb-1">Full Article Body *</label>
                  <Textarea
                    required
                    rows={8}
                    value={formContent}
                    onChange={(e) => setFormContent(e.target.value)}
                    placeholder="Enter full scholarly body..."
                  />
                </div>

                <div className="pt-3 flex items-center justify-end gap-2 border-t border-[#2a2a3e]">
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
                    Publish Article Live
                  </Button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Modal: Edit Article */}
        {editingPost && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fade-in">
            <div className="w-full max-w-2xl bg-[#181829] border border-[#2a2a3e] rounded-2xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col">
              <div className="p-5 border-b border-[#2a2a3e] flex items-center justify-between shrink-0">
                <div className="flex items-center gap-2">
                  <Pencil className="w-5 h-5 text-purple-400" />
                  <h3 className="text-base font-bold text-white">Edit Gazette Article</h3>
                </div>
                <button
                  onClick={() => setEditingPost(null)}
                  className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-white/5"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleSaveEdit} className="p-6 overflow-y-auto space-y-4 text-xs flex-1">
                <div>
                  <label className="block text-[11px] font-semibold text-slate-300 mb-1">Article Headline *</label>
                  <Input
                    required
                    value={formTitle}
                    onChange={(e) => setFormTitle(e.target.value)}
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-300 mb-1">Slug</label>
                  <Input
                    value={formSlug}
                    onChange={(e) => setFormSlug(e.target.value)}
                  />
                </div>

                <div>
                  <ImageUpload
                    label="Featured Article Image (Upload Pic or Enter URL)"
                    value={formImage}
                    onChange={setFormImage}
                    helperText="High-resolution banner artwork for the article"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-300 mb-1">Executive Summary *</label>
                  <Textarea
                    required
                    rows={2}
                    value={formExcerpt}
                    onChange={(e) => setFormExcerpt(e.target.value)}
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-300 mb-1">Full Article Body *</label>
                  <Textarea
                    required
                    rows={8}
                    value={formContent}
                    onChange={(e) => setFormContent(e.target.value)}
                  />
                </div>

                <div className="pt-3 flex items-center justify-end gap-2 border-t border-[#2a2a3e]">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => setEditingPost(null)}
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

        {/* Modal: Delete Article Confirmation */}
        {deletingPost && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
            <div className="w-full max-w-sm bg-[#181829] border border-rose-500/40 rounded-2xl shadow-2xl p-6 text-center space-y-4">
              <div className="w-12 h-12 rounded-full bg-rose-500/20 text-rose-400 flex items-center justify-center mx-auto border border-rose-500/30">
                <Trash2 className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-base font-bold text-white">Delete Article?</h3>
                <p className="text-xs text-slate-400 mt-1">
                  Are you sure you want to permanently delete <span className="text-white font-semibold">"{deletingPost.title}"</span>?
                </p>
              </div>
              <div className="flex items-center justify-center gap-3 pt-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setDeletingPost(null)}
                >
                  Cancel
                </Button>
                <Button
                  variant="primary"
                  size="sm"
                  className="bg-rose-600 hover:bg-rose-700 text-white"
                  isLoading={isSubmitting}
                  onClick={handleDeletePost}
                >
                  Confirm Delete
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Modal: Inspect Article */}
        {previewPost && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fade-in">
            <div className="w-full max-w-2xl bg-[#181829] border border-[#2a2a3e] rounded-2xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col">
              <div className="p-5 border-b border-[#2a2a3e] flex items-center justify-between shrink-0">
                <div className="flex items-center gap-2">
                  <FileText className="w-5 h-5 text-purple-400" />
                  <h3 className="text-base font-bold text-white line-clamp-1">{previewPost.title}</h3>
                </div>
                <button
                  onClick={() => setPreviewPost(null)}
                  className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-white/5"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="p-6 overflow-y-auto space-y-4 text-xs flex-1 text-slate-300">
                <img
                  src={previewPost.featured_image_url || ''}
                  alt={previewPost.title}
                  className="w-full h-48 object-cover rounded-xl border border-[#2a2a3e]"
                />

                <div className="flex items-center gap-2">
                  <Badge variant={previewPost.status === 'published' ? 'emerald' : 'amber'}>
                    {previewPost.status.toUpperCase()}
                  </Badge>
                  <span className="text-slate-400">Slug: /{previewPost.slug}</span>
                </div>

                <div className="p-3.5 rounded-xl bg-[#12121e] border border-[#2a2a3e] font-serif italic text-slate-300">
                  {previewPost.excerpt}
                </div>

                <div className="whitespace-pre-line leading-relaxed text-slate-200">
                  {previewPost.content}
                </div>
              </div>

              <div className="p-4 border-t border-[#2a2a3e] flex items-center justify-end gap-2 shrink-0">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setPreviewPost(null)}
                >
                  Close
                </Button>
              </div>
            </div>
          </div>
        )}

      </div>
    </PortalLayout>
  );
};
