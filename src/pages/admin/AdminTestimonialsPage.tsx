import React, { useState, useEffect } from 'react';
import { PortalLayout } from '../../components/layout/PortalLayout';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Textarea } from '../../components/ui/Textarea';
import { ImageUpload } from '../../components/ui/ImageUpload';
import { Modal } from '../../components/ui/Modal';
import { ConfirmDialog } from '../../components/ui/ConfirmDialog';
import { Table, Column } from '../../components/ui/Table';
import { Badge } from '../../components/ui/Badge';
import { useToast } from '../../context/ToastContext';
import { fetchTestimonials, createTestimonial, updateTestimonial, deleteTestimonial } from '../../lib/dataService';
import { Testimonial, PAKISTAN_CLASSES } from '../../types';
import { MessageSquareQuote, Plus, Edit2, Trash2, CheckCircle2 } from 'lucide-react';

export const AdminTestimonialsPage: React.FC = () => {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const toast = useToast();

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<Testimonial | null>(null);
  const [studentName, setStudentName] = useState('');
  const [studentClass, setStudentClass] = useState('');
  const [quote, setQuote] = useState('');
  const [avatarUrl, setAvatarUrl] = useState('');
  const [isActive, setIsActive] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  // Delete Confirm
  const [itemToDelete, setItemToDelete] = useState<Testimonial | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const loadData = async () => {
    setIsLoading(true);
    try {
      const data = await fetchTestimonials();
      setTestimonials(data);
    } catch {
      toast.error('Failed to load testimonials');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const openAddModal = () => {
    setEditingItem(null);
    setStudentName('');
    setStudentClass('FSc Pre-Medical (FBISE Position Holder)');
    setQuote('');
    setAvatarUrl('https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80');
    setIsActive(true);
    setIsModalOpen(true);
  };

  const openEditModal = (t: Testimonial) => {
    setEditingItem(t);
    setStudentName(t.student_name || t.author || '');
    setStudentClass(t.student_class || t.role || '');
    setQuote(t.quote);
    setAvatarUrl(t.avatar_url || '');
    setIsActive(true);
    setIsModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!studentName.trim()) {
      toast.warning('Please enter the student or parent name');
      return;
    }
    if (!quote.trim()) {
      toast.warning('Please enter the testimonial text');
      return;
    }

    setIsSaving(true);
    try {
      if (editingItem) {
        await updateTestimonial(editingItem.id, {
          student_name: studentName.trim(),
          student_class: studentClass.trim(),
          quote: quote.trim(),
          avatar_url: avatarUrl
        });
        toast.success('Testimonial updated successfully!');
      } else {
        await createTestimonial({
          student_name: studentName.trim(),
          student_class: studentClass.trim(),
          quote: quote.trim(),
          avatar_url: avatarUrl
        });
        toast.success('Testimonial published!');
      }
      setIsModalOpen(false);
      loadData();
    } catch {
      toast.error('Failed to save testimonial');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteConfirm = async () => {
    if (!itemToDelete) return;
    setIsDeleting(true);
    try {
      await deleteTestimonial(itemToDelete.id);
      toast.success('Testimonial deleted successfully');
      setItemToDelete(null);
      loadData();
    } catch {
      toast.error('Failed to delete testimonial');
    } finally {
      setIsDeleting(false);
    }
  };

  const columns: Column<Testimonial>[] = [
    {
      key: 'student_name',
      header: 'Author / Student',
      sortable: true,
      render: (t) => (
        <div className="flex items-center gap-3">
          <img
            src={t.avatar_url || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80'}
            alt="Author"
            className="w-9 h-9 rounded-full object-cover border border-[#2a2a3e]"
          />
          <div>
            <span className="font-semibold text-white block">{t.student_name || t.author}</span>
            <span className="text-[11px] text-purple-400">{t.student_class || t.role}</span>
          </div>
        </div>
      )
    },
    {
      key: 'quote',
      header: 'Testimonial Message',
      render: (t) => (
        <p className="text-xs text-slate-300 line-clamp-2 italic">
          "{t.quote}"
        </p>
      )
    },
    {
      key: 'actions',
      header: 'Actions',
      align: 'right',
      render: (t) => (
        <div className="flex items-center justify-end gap-2">
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => openEditModal(t)}
            className="p-1.5 text-slate-300 hover:text-white"
            title="Edit Testimonial"
          >
            <Edit2 className="w-3.5 h-3.5" />
          </Button>
          <Button
            type="button"
            variant="danger"
            size="sm"
            onClick={() => setItemToDelete(t)}
            className="p-1.5"
            title="Delete Testimonial"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </Button>
        </div>
      )
    }
  ];

  return (
    <PortalLayout
      pageTitle="Testimonials Management"
      pageSubtitle="Curate success stories, parent reviews, and FBISE position-holder testimonials for public showcase"
    >
      <div className="space-y-5 max-w-6xl">
        <div className="flex justify-between items-center">
          <div>
            <h3 className="text-sm font-semibold text-white">Student & Parent Success Reviews</h3>
            <p className="text-xs text-slate-400">Featured on the official homepage and about section</p>
          </div>
          <Button
            type="button"
            variant="primary"
            size="sm"
            onClick={openAddModal}
            leftIcon={<Plus className="w-4 h-4" />}
          >
            Add Testimonial
          </Button>
        </div>

        <Table
          data={testimonials}
          columns={columns}
          pageSize={10}
          isLoading={isLoading}
          emptyMessage="No testimonials available."
        />

        {/* Modal */}
        <Modal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          title={editingItem ? 'Edit Testimonial' : 'Add Student / Parent Testimonial'}
          maxWidth="md"
        >
          <form onSubmit={handleSave} className="space-y-4">
            <Input
              label="Student / Author Name *"
              required
              placeholder="e.g. Zainab Fatima"
              value={studentName}
              onChange={(e) => setStudentName(e.target.value)}
            />

            <Input
              label="Class / Credential Badge *"
              required
              placeholder="e.g. FSc Pre-Medical (FBISE Position Holder)"
              value={studentClass}
              onChange={(e) => setStudentClass(e.target.value)}
            />

            <Textarea
              label="Testimonial Quote *"
              required
              rows={4}
              placeholder="Describe experience, academic growth, faculty mentorship, and achievements..."
              value={quote}
              onChange={(e) => setQuote(e.target.value)}
            />

            <ImageUpload
              label="Student / Parent Photograph"
              value={avatarUrl}
              onChange={(url) => setAvatarUrl(url)}
            />

            <div className="flex justify-end gap-3 pt-3 border-t border-[#2a2a3e]">
              <Button
                type="button"
                variant="ghost"
                onClick={() => setIsModalOpen(false)}
                disabled={isSaving}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                variant="primary"
                isLoading={isSaving}
              >
                {editingItem ? 'Save Changes' : 'Publish Testimonial'}
              </Button>
            </div>
          </form>
        </Modal>

        {/* Confirm Delete */}
        <ConfirmDialog
          isOpen={Boolean(itemToDelete)}
          onClose={() => setItemToDelete(null)}
          onConfirm={handleDeleteConfirm}
          title="Delete Testimonial?"
          message={`Are you sure you want to delete the testimonial from "${itemToDelete?.student_name || itemToDelete?.author}"?`}
          confirmText="Delete Testimonial"
          isLoading={isDeleting}
        />
      </div>
    </PortalLayout>
  );
};
