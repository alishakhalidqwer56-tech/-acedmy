import React, { useState, useEffect } from 'react';
import { PortalLayout } from '../../components/layout/PortalLayout';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { Input } from '../../components/ui/Input';
import { Textarea } from '../../components/ui/Textarea';
import { 
  FileText, 
  Plus, 
  Send, 
  CheckCircle2, 
  Clock, 
  Image as ImageIcon, 
  Tag, 
  Edit3, 
  Eye, 
  X,
  BookOpen,
  Pencil,
  Trash2
} from 'lucide-react';
import { fetchBlogPosts, createBlogPost, updateBlogPost, deleteBlogPost } from '../../lib/dataService';
import { BlogPost } from '../../types';
import { useAuth } from '../../context/AuthContext';

export const TeacherBlogPage: React.FC = () => {
  const { user } = useAuth();
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showEditor, setShowEditor] = useState(false);
  const [editingPost, setEditingPost] = useState<BlogPost | null>(null);
  const [deletingPost, setDeletingPost] = useState<BlogPost | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Form State
  const [title, setTitle] = useState('');
  const [excerpt, setExcerpt] = useState('');
  const [content, setContent] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [tags, setTags] = useState('STEM, Innovation');
  const [isSubmitting, setIsSubmitting] = useState(false);

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

  const handleSavePost = async (status: 'draft' | 'pending') => {
    if (!title.trim() || !content.trim()) {
      alert('Please provide a title and article body content.');
      return;
    }

    setIsSubmitting(true);
    try {
      const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
      const tagList = tags.split(',').map(t => t.trim()).filter(Boolean);

      await createBlogPost({
        title,
        slug,
        excerpt: excerpt || content.slice(0, 150) + '...',
        content,
        featured_image_url: imageUrl || 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=800&q=80',
        author_id: user?.id || 'demo-teacher-uid-2',
        status,
        tags: tagList
      });

      setToastMessage(status === 'pending' 
        ? 'Article submitted to the administrative editorial board for review!' 
        : 'Article draft successfully saved.');
      
      setShowEditor(false);
      setTitle('');
      setExcerpt('');
      setContent('');
      setImageUrl('');
      await loadPosts();
      setTimeout(() => setToastMessage(null), 4000);
    } catch (err: any) {
      alert('Error saving post: ' + err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const openEdit = (p: BlogPost) => {
    setEditingPost(p);
    setTitle(p.title);
    setExcerpt(p.excerpt || '');
    setContent(p.content || '');
    setImageUrl(p.featured_image_url || '');
    setTags(p.tags ? p.tags.join(', ') : 'STEM');
  };

  const handleUpdate = async (status?: 'draft' | 'pending') => {
    if (!editingPost) return;
    setIsSubmitting(true);
    try {
      const tagList = tags.split(',').map(t => t.trim()).filter(Boolean);
      await updateBlogPost(editingPost.id, {
        title,
        excerpt,
        content,
        featured_image_url: imageUrl,
        tags: tagList,
        ...(status ? { status } : {})
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

  const handleDelete = async () => {
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

  return (
    <PortalLayout
      pageTitle="Faculty Gazette & Research Authoring"
      pageSubtitle="Draft, edit, delete, or submit educational essays and laboratory breakthroughs for publication"
    >
      <div className="space-y-6">

        {/* Top Control Bar */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-base sm:text-lg font-bold text-white">Faculty Authoring Desk</h2>
            <p className="text-xs text-slate-400">Articles undergo peer review before appearing on the public Gazette</p>
          </div>
          <Button
            variant="primary"
            size="sm"
            onClick={() => {
              setTitle('');
              setExcerpt('');
              setContent('');
              setImageUrl('');
              setTags('STEM, Innovation');
              setShowEditor(true);
            }}
            leftIcon={<Plus className="w-4 h-4" />}
          >
            Author New Article
          </Button>
        </div>

        {/* Toast Notification */}
        {toastMessage && (
          <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 flex items-center gap-3 animate-fade-in text-xs font-semibold">
            <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-400" />
            <span>{toastMessage}</span>
          </div>
        )}

        {/* Articles List */}
        <div className="space-y-4">
          {posts.map((post) => (
            <Card key={post.id} className="p-5 bg-[#181827] border-[#2a2a3e] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-5 hover:border-purple-500/30 transition-colors">
              <div className="flex items-start gap-4 flex-1">
                <img
                  src={post.featured_image_url || 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=300&q=80'}
                  alt={post.title}
                  className="w-20 h-20 rounded-xl object-cover border border-[#2a2a3e] shrink-0"
                />
                <div className="space-y-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <Badge variant={
                      post.status === 'published' ? 'emerald' :
                      post.status === 'pending' ? 'amber' : 'slate'
                    } size="sm">
                      {post.status.toUpperCase()}
                    </Badge>
                    {post.tags?.map((t, idx) => (
                      <span key={idx} className="text-[10px] text-purple-400 font-medium">#{t}</span>
                    ))}
                  </div>
                  <h3 className="text-sm font-bold text-white">{post.title}</h3>
                  <p className="text-xs text-slate-400 line-clamp-1">{post.excerpt}</p>
                  <div className="text-[10px] text-slate-500 flex items-center gap-2 pt-1">
                    <span>Slug: /{post.slug}</span>
                    <span>•</span>
                    <span>Updated: {new Date(post.created_at || '').toLocaleDateString()}</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2 self-end sm:self-center">
                <Badge variant={post.status === 'published' ? 'emerald' : 'amber'}>
                  {post.status === 'published' ? 'Live on Gazette' : 'In Review'}
                </Badge>
                <button
                  onClick={() => openEdit(post)}
                  className="p-1.5 rounded-lg border border-purple-500/30 text-purple-300 hover:bg-purple-500/10 transition-colors"
                  title="Edit article"
                >
                  <Pencil className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => setDeletingPost(post)}
                  className="p-1.5 rounded-lg border border-rose-500/30 text-rose-400 hover:bg-rose-500/10 transition-colors"
                  title="Delete article"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </Card>
          ))}
        </div>

        {/* Article Authoring Modal */}
        {showEditor && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
            <div className="w-full max-w-2xl bg-[#181829] border border-[#2a2a3e] rounded-2xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col">
              <div className="p-5 border-b border-[#2a2a3e] flex items-center justify-between shrink-0">
                <div className="flex items-center gap-2.5">
                  <Edit3 className="w-5 h-5 text-purple-400" />
                  <h3 className="text-base font-bold text-white">Author Academic Article</h3>
                </div>
                <button
                  onClick={() => setShowEditor(false)}
                  className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-white/5"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="p-6 overflow-y-auto space-y-4 text-xs flex-1">
                <div>
                  <label className="block text-[11px] font-semibold text-slate-300 mb-1">Article Headline *</label>
                  <Input
                    required
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="e.g. Advancements in Machine Learning for Environmental Monitoring"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-300 mb-1">Tags (Comma-separated)</label>
                    <Input
                      value={tags}
                      onChange={(e) => setTags(e.target.value)}
                      placeholder="STEM, Biology, Robotics"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-slate-300 mb-1">Cover Image URL</label>
                    <Input
                      value={imageUrl}
                      onChange={(e) => setImageUrl(e.target.value)}
                      placeholder="https://images.unsplash.com/..."
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-300 mb-1">Executive Summary / Excerpt</label>
                  <Textarea
                    rows={2}
                    value={excerpt}
                    onChange={(e) => setExcerpt(e.target.value)}
                    placeholder="Brief 1-2 sentence hook displayed on catalog cards..."
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-300 mb-1">Full Article Body *</label>
                  <Textarea
                    rows={6}
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    placeholder="Write your scholarly essay or lab report here..."
                  />
                </div>
              </div>

              <div className="p-4 border-t border-[#2a2a3e] bg-[#141422] flex items-center justify-between shrink-0">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowEditor(false)}
                >
                  Discard
                </Button>

                <div className="flex items-center gap-3">
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={isSubmitting}
                    onClick={() => handleSavePost('draft')}
                  >
                    Save as Draft
                  </Button>
                  <Button
                    variant="primary"
                    size="sm"
                    isLoading={isSubmitting}
                    onClick={() => handleSavePost('pending')}
                    leftIcon={<Send className="w-4 h-4" />}
                  >
                    Submit for Admin Review
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Modal: Edit Article */}
        {editingPost && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
            <div className="w-full max-w-2xl bg-[#181829] border border-[#2a2a3e] rounded-2xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col">
              <div className="p-5 border-b border-[#2a2a3e] flex items-center justify-between shrink-0">
                <div className="flex items-center gap-2.5">
                  <Pencil className="w-5 h-5 text-purple-400" />
                  <h3 className="text-base font-bold text-white">Edit Academic Article</h3>
                </div>
                <button
                  onClick={() => setEditingPost(null)}
                  className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-white/5"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="p-6 overflow-y-auto space-y-4 text-xs flex-1">
                <div>
                  <label className="block text-[11px] font-semibold text-slate-300 mb-1">Article Headline *</label>
                  <Input
                    required
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-300 mb-1">Tags (Comma-separated)</label>
                    <Input
                      value={tags}
                      onChange={(e) => setTags(e.target.value)}
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-slate-300 mb-1">Cover Image URL</label>
                    <Input
                      value={imageUrl}
                      onChange={(e) => setImageUrl(e.target.value)}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-300 mb-1">Executive Summary / Excerpt</label>
                  <Textarea
                    rows={2}
                    value={excerpt}
                    onChange={(e) => setExcerpt(e.target.value)}
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-300 mb-1">Full Article Body *</label>
                  <Textarea
                    rows={6}
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                  />
                </div>
              </div>

              <div className="p-4 border-t border-[#2a2a3e] bg-[#141422] flex items-center justify-between shrink-0">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setEditingPost(null)}
                >
                  Cancel
                </Button>

                <div className="flex items-center gap-3">
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={isSubmitting}
                    onClick={() => handleUpdate('draft')}
                  >
                    Save Draft
                  </Button>
                  <Button
                    variant="primary"
                    size="sm"
                    isLoading={isSubmitting}
                    onClick={() => handleUpdate('pending')}
                  >
                    Save & Submit for Review
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Modal: Delete Confirmation */}
        {deletingPost && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
            <div className="w-full max-w-sm bg-[#181829] border border-rose-500/40 rounded-2xl shadow-2xl p-6 text-center space-y-4">
              <div className="w-12 h-12 rounded-full bg-rose-500/20 text-rose-400 flex items-center justify-center mx-auto border border-rose-500/30">
                <Trash2 className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-base font-bold text-white">Delete Article?</h3>
                <p className="text-xs text-slate-400 mt-1">
                  Are you sure you want to delete <span className="text-white font-semibold">"{deletingPost.title}"</span>?
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
