import React, { useState, useEffect } from 'react';
import { PortalLayout } from '../../components/layout/PortalLayout';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Modal } from '../../components/ui/Modal';
import { ConfirmDialog } from '../../components/ui/ConfirmDialog';
import { Table, Column } from '../../components/ui/Table';
import { useToast } from '../../context/ToastContext';
import { 
  fetchSubjects, 
  createSubject, 
  updateSubject, 
  deleteSubject, 
  fetchAdminCourses 
} from '../../lib/dataService';
import { Subject, Course } from '../../types';
import { BookOpen, Plus, Edit2, Trash2, Search } from 'lucide-react';

export const AdminSubjectsPage: React.FC = () => {
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [selectedCourseFilter, setSelectedCourseFilter] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [isLoading, setIsLoading] = useState(true);
  const toast = useToast();

  // Add / Edit Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingSubject, setEditingSubject] = useState<Subject | null>(null);
  const [subjectName, setSubjectName] = useState('');
  const [courseId, setCourseId] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  // Delete Confirm Dialog state
  const [subjectToDelete, setSubjectToDelete] = useState<Subject | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const loadData = async () => {
    setIsLoading(true);
    try {
      const [subs, crs] = await Promise.all([
        fetchSubjects(),
        fetchAdminCourses()
      ]);
      setSubjects(subs);
      setCourses(crs);
    } catch {
      toast.error('Failed to load academic subjects');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const openAddModal = () => {
    setEditingSubject(null);
    setSubjectName('');
    setCourseId(courses[0]?.id || '');
    setIsModalOpen(true);
  };

  const openEditModal = (subject: Subject) => {
    setEditingSubject(subject);
    setSubjectName(subject.name);
    setCourseId(subject.course_id);
    setIsModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!subjectName.trim()) {
      toast.warning('Please enter a subject name');
      return;
    }
    if (!courseId) {
      toast.warning('Please select a course for this subject');
      return;
    }

    setIsSaving(true);
    try {
      if (editingSubject) {
        await updateSubject(editingSubject.id, {
          name: subjectName.trim(),
          course_id: courseId
        });
        toast.success(`Subject "${subjectName}" updated successfully!`);
      } else {
        await createSubject({
          name: subjectName.trim(),
          course_id: courseId
        });
        toast.success(`Subject "${subjectName}" created successfully!`);
      }
      setIsModalOpen(false);
      loadData();
    } catch {
      toast.error('Failed to save subject');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteConfirm = async () => {
    if (!subjectToDelete) return;
    setIsDeleting(true);
    try {
      await deleteSubject(subjectToDelete.id);
      toast.success(`Subject "${subjectToDelete.name}" deleted.`);
      setSubjectToDelete(null);
      loadData();
    } catch {
      toast.error('Failed to delete subject');
    } finally {
      setIsDeleting(false);
    }
  };

  // Filtered subjects
  const filteredSubjects = subjects.filter(sub => {
    const matchesCourse = selectedCourseFilter === 'all' || sub.course_id === selectedCourseFilter;
    const matchesSearch = sub.name.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCourse && matchesSearch;
  });

  const getCourseTitle = (cId: string) => {
    const found = courses.find(c => c.id === cId);
    return found ? found.title : 'Unassigned Course';
  };

  const columns: Column<Subject>[] = [
    {
      key: 'name',
      header: 'Subject Name',
      sortable: true,
      render: (s) => (
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-purple-500/15 border border-purple-500/30 text-purple-400 flex items-center justify-center">
            <BookOpen className="w-4 h-4" />
          </div>
          <span className="font-semibold text-white">{s.name}</span>
        </div>
      )
    },
    {
      key: 'course_id',
      header: 'Assigned Academic Course',
      sortable: true,
      render: (s) => (
        <span className="text-xs text-slate-300 font-medium bg-[#141422] px-3 py-1.5 rounded-lg border border-[#2a2a3e]">
          {getCourseTitle(s.course_id)}
        </span>
      )
    },
    {
      key: 'actions',
      header: 'Actions',
      align: 'right',
      render: (s) => (
        <div className="flex items-center justify-end gap-2">
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => openEditModal(s)}
            className="p-1.5 text-slate-300 hover:text-white"
            title="Edit Subject"
          >
            <Edit2 className="w-3.5 h-3.5" />
          </Button>
          <Button
            type="button"
            variant="danger"
            size="sm"
            onClick={() => setSubjectToDelete(s)}
            className="p-1.5"
            title="Delete Subject"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </Button>
        </div>
      )
    }
  ];

  return (
    <PortalLayout
      pageTitle="Academic Subject Management"
      pageSubtitle="Configure subjects across intermediate, secondary matric, and college academic programs"
    >
      <div className="space-y-5 max-w-6xl">
        {/* Controls Bar */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          <div className="flex flex-col sm:flex-row items-center gap-2.5 flex-1">
            <div className="relative w-full sm:w-64">
              <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
              <input
                type="text"
                placeholder="Search subjects..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-[#161625] border border-[#2a2a3e] rounded-xl pl-9 pr-4 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-purple-500"
              />
            </div>

            <select
              value={selectedCourseFilter}
              onChange={(e) => setSelectedCourseFilter(e.target.value)}
              className="w-full sm:w-64 bg-[#161625] border border-[#2a2a3e] rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-purple-500"
            >
              <option value="all">All Courses ({courses.length})</option>
              {courses.map(c => (
                <option key={c.id} value={c.id}>{c.title}</option>
              ))}
            </select>
          </div>

          <Button
            type="button"
            variant="primary"
            size="sm"
            onClick={openAddModal}
            leftIcon={<Plus className="w-4 h-4" />}
          >
            Add New Subject
          </Button>
        </div>

        {/* Table */}
        <Table
          data={filteredSubjects}
          columns={columns}
          pageSize={10}
          isLoading={isLoading}
          emptyMessage="No academic subjects match your filter."
        />

        {/* Add/Edit Modal */}
        <Modal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          title={editingSubject ? 'Edit Subject' : 'Add New Academic Subject'}
          maxWidth="md"
        >
          <form onSubmit={handleSave} className="space-y-4">
            <Input
              label="Subject Name *"
              required
              placeholder="e.g. Biology & Genetics Lab"
              value={subjectName}
              onChange={(e) => setSubjectName(e.target.value)}
            />

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5">Academic Course *</label>
              <select
                value={courseId}
                onChange={(e) => setCourseId(e.target.value)}
                className="w-full bg-[#141422] border border-[#2a2a3e] rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-purple-500"
              >
                {courses.map(c => (
                  <option key={c.id} value={c.id}>{c.title} ({c.level || c.category})</option>
                ))}
              </select>
            </div>

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
                {editingSubject ? 'Save Changes' : 'Create Subject'}
              </Button>
            </div>
          </form>
        </Modal>

        {/* Confirm Delete Dialog */}
        <ConfirmDialog
          isOpen={Boolean(subjectToDelete)}
          onClose={() => setSubjectToDelete(null)}
          onConfirm={handleDeleteConfirm}
          title="Delete Subject?"
          message={`Are you sure you want to permanently remove "${subjectToDelete?.name}"? Any linked teacher assignments will be disconnected.`}
          confirmText="Delete Subject"
          isLoading={isDeleting}
        />
      </div>
    </PortalLayout>
  );
};
