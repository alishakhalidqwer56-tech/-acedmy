import React, { useState, useEffect } from 'react';
import { PortalLayout } from '../../components/layout/PortalLayout';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Modal } from '../../components/ui/Modal';
import { ConfirmDialog } from '../../components/ui/ConfirmDialog';
import { Table, Column } from '../../components/ui/Table';
import { Badge } from '../../components/ui/Badge';
import { useToast } from '../../context/ToastContext';
import { fetchTerms, createTerm, updateTerm, deleteTerm } from '../../lib/dataService';
import { Term } from '../../types';
import { Calendar, Plus, Edit2, Trash2, CheckCircle2, XCircle } from 'lucide-react';

export const AdminTermsPage: React.FC = () => {
  const [terms, setTerms] = useState<Term[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const toast = useToast();

  // Add / Edit Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTerm, setEditingTerm] = useState<Term | null>(null);
  const [termName, setTermName] = useState('');
  const [academicYear, setAcademicYear] = useState('2026-2027');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [isActive, setIsActive] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  // Delete Confirm Dialog state
  const [termToDelete, setTermToDelete] = useState<Term | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const loadData = async () => {
    setIsLoading(true);
    try {
      const data = await fetchTerms();
      setTerms(data);
    } catch {
      toast.error('Failed to load academic terms');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const openAddModal = () => {
    setEditingTerm(null);
    setTermName('');
    setAcademicYear('2026-2027');
    setStartDate('2026-08-15');
    setEndDate('2026-11-20');
    setIsActive(true);
    setIsModalOpen(true);
  };

  const openEditModal = (t: Term) => {
    setEditingTerm(t);
    setTermName(t.name);
    setAcademicYear(t.academic_year);
    setStartDate(t.start_date || '');
    setEndDate(t.end_date || '');
    setIsActive(Boolean(t.is_active));
    setIsModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!termName.trim()) {
      toast.warning('Please enter a term name');
      return;
    }

    setIsSaving(true);
    try {
      if (editingTerm) {
        await updateTerm(editingTerm.id, {
          name: termName.trim(),
          academic_year: academicYear.trim(),
          start_date: startDate || null,
          end_date: endDate || null,
          is_active: isActive
        });
        toast.success(`Term "${termName}" updated successfully!`);
      } else {
        await createTerm({
          name: termName.trim(),
          academic_year: academicYear.trim(),
          start_date: startDate || null,
          end_date: endDate || null,
          is_active: isActive
        });
        toast.success(`Term "${termName}" created successfully!`);
      }
      setIsModalOpen(false);
      loadData();
    } catch {
      toast.error('Failed to save academic term');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteConfirm = async () => {
    if (!termToDelete) return;
    setIsDeleting(true);
    try {
      await deleteTerm(termToDelete.id);
      toast.success(`Term "${termToDelete.name}" deleted.`);
      setTermToDelete(null);
      loadData();
    } catch {
      toast.error('Failed to delete term');
    } finally {
      setIsDeleting(false);
    }
  };

  const columns: Column<Term>[] = [
    {
      key: 'name',
      header: 'Term Name',
      sortable: true,
      render: (t) => (
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-purple-500/15 border border-purple-500/30 text-purple-400 flex items-center justify-center">
            <Calendar className="w-4 h-4" />
          </div>
          <span className="font-semibold text-white">{t.name}</span>
        </div>
      )
    },
    {
      key: 'academic_year',
      header: 'Academic Year',
      sortable: true,
      render: (t) => (
        <Badge variant="cyan" size="sm">{t.academic_year}</Badge>
      )
    },
    {
      key: 'start_date',
      header: 'Start Date',
      render: (t) => (
        <span className="text-xs text-slate-300">{t.start_date || '—'}</span>
      )
    },
    {
      key: 'end_date',
      header: 'End Date',
      render: (t) => (
        <span className="text-xs text-slate-300">{t.end_date || '—'}</span>
      )
    },
    {
      key: 'is_active',
      header: 'Status',
      align: 'center',
      render: (t) => t.is_active ? (
        <Badge variant="emerald" size="sm">Active Session</Badge>
      ) : (
        <Badge variant="slate" size="sm">Inactive</Badge>
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
            title="Edit Term"
          >
            <Edit2 className="w-3.5 h-3.5" />
          </Button>
          <Button
            type="button"
            variant="danger"
            size="sm"
            onClick={() => setTermToDelete(t)}
            className="p-1.5"
            title="Delete Term"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </Button>
        </div>
      )
    }
  ];

  return (
    <PortalLayout
      pageTitle="Academic Term Management"
      pageSubtitle="Configure Pakistan school academic terms (Term 1, Term 2, Annual Exams) and calendar periods"
    >
      <div className="space-y-5 max-w-6xl">
        <div className="flex justify-between items-center">
          <div>
            <h3 className="text-sm font-semibold text-white">Institutional Terms & Examination Periods</h3>
            <p className="text-xs text-slate-400">Controls grade card term selectors and schedule calendars</p>
          </div>
          <Button
            type="button"
            variant="primary"
            size="sm"
            onClick={openAddModal}
            leftIcon={<Plus className="w-4 h-4" />}
          >
            Add Academic Term
          </Button>
        </div>

        <Table
          data={terms}
          columns={columns}
          pageSize={10}
          isLoading={isLoading}
          emptyMessage="No terms configured."
        />

        {/* Add/Edit Modal */}
        <Modal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          title={editingTerm ? 'Edit Academic Term' : 'Create New Academic Term'}
          maxWidth="md"
        >
          <form onSubmit={handleSave} className="space-y-4">
            <Input
              label="Term Name *"
              required
              placeholder="e.g. Term 1 (First Term) or Annual Exam"
              value={termName}
              onChange={(e) => setTermName(e.target.value)}
            />

            <Input
              label="Academic Year *"
              required
              placeholder="2026-2027"
              value={academicYear}
              onChange={(e) => setAcademicYear(e.target.value)}
            />

            <div className="grid grid-cols-2 gap-4">
              <Input
                label="Start Date"
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
              />
              <Input
                label="End Date"
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
              />
            </div>

            <div className="flex items-center justify-between p-3.5 rounded-xl bg-[#141422] border border-[#2a2a3e]">
              <div>
                <span className="text-xs font-semibold text-white block">Active Term Status</span>
                <span className="text-[11px] text-slate-400">Set as current default term for marks & attendance</span>
              </div>
              <input
                type="checkbox"
                checked={isActive}
                onChange={(e) => setIsActive(e.target.checked)}
                className="w-4 h-4 accent-purple-600 rounded"
              />
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
                {editingTerm ? 'Save Changes' : 'Create Term'}
              </Button>
            </div>
          </form>
        </Modal>

        {/* Confirm Delete */}
        <ConfirmDialog
          isOpen={Boolean(termToDelete)}
          onClose={() => setTermToDelete(null)}
          onConfirm={handleDeleteConfirm}
          title="Delete Academic Term?"
          message={`Are you sure you want to delete "${termToDelete?.name}"?`}
          confirmText="Delete Term"
          isLoading={isDeleting}
        />
      </div>
    </PortalLayout>
  );
};
