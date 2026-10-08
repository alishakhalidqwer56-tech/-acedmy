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
import { fetchGradingScales, createGradingScale, updateGradingScale, deleteGradingScale } from '../../lib/dataService';
import { GradingScale } from '../../types';
import { Award, Plus, Edit2, Trash2 } from 'lucide-react';

export const AdminGradingPage: React.FC = () => {
  const [scales, setScales] = useState<GradingScale[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const toast = useToast();

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingGrade, setEditingGrade] = useState<GradingScale | null>(null);
  const [minMarks, setMinMarks] = useState<number>(80);
  const [maxMarks, setMaxMarks] = useState<number>(89);
  const [grade, setGrade] = useState('A');
  const [gpa, setGpa] = useState<number>(4.0);
  const [remarks, setRemarks] = useState('Excellent');
  const [isSaving, setIsSaving] = useState(false);

  // Delete Confirm
  const [gradeToDelete, setGradeToDelete] = useState<GradingScale | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const loadData = async () => {
    setIsLoading(true);
    try {
      const data = await fetchGradingScales();
      setScales(data);
    } catch {
      toast.error('Failed to load grading scale');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const openAddModal = () => {
    setEditingGrade(null);
    setMinMarks(80);
    setMaxMarks(89);
    setGrade('A');
    setGpa(4.0);
    setRemarks('Excellent');
    setIsModalOpen(true);
  };

  const openEditModal = (g: GradingScale) => {
    setEditingGrade(g);
    setMinMarks(g.min_marks);
    setMaxMarks(g.max_marks);
    setGrade(g.grade);
    setGpa(g.gpa || 0);
    setRemarks(g.remarks || '');
    setIsModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!grade.trim()) {
      toast.warning('Please enter a grade letter');
      return;
    }
    if (minMarks < 0 || maxMarks > 100 || minMarks > maxMarks) {
      toast.warning('Min Marks must be <= Max Marks (0 to 100)');
      return;
    }

    setIsSaving(true);
    try {
      if (editingGrade) {
        await updateGradingScale(editingGrade.id, {
          min_marks: Number(minMarks),
          max_marks: Number(maxMarks),
          grade: grade.trim().toUpperCase(),
          gpa: Number(gpa),
          remarks: remarks.trim()
        });
        toast.success(`Grade "${grade}" updated!`);
      } else {
        await createGradingScale({
          min_marks: Number(minMarks),
          max_marks: Number(maxMarks),
          grade: grade.trim().toUpperCase(),
          gpa: Number(gpa),
          remarks: remarks.trim()
        });
        toast.success(`Grade "${grade}" added to scale!`);
      }
      setIsModalOpen(false);
      loadData();
    } catch {
      toast.error('Failed to save grading scale');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteConfirm = async () => {
    if (!gradeToDelete) return;
    setIsDeleting(true);
    try {
      await deleteGradingScale(gradeToDelete.id);
      toast.success(`Grade "${gradeToDelete.grade}" deleted`);
      setGradeToDelete(null);
      loadData();
    } catch {
      toast.error('Failed to delete grade tier');
    } finally {
      setIsDeleting(false);
    }
  };

  const columns: Column<GradingScale>[] = [
    {
      key: 'grade',
      header: 'Grade Letter',
      sortable: true,
      render: (g) => {
        const variant = 
          g.grade === 'A+' ? 'emerald' :
          g.grade === 'A' ? 'cyan' :
          g.grade === 'B' ? 'purple' :
          g.grade === 'C' ? 'amber' : 'pink';

        return (
          <Badge variant={variant} size="md" className="font-bold text-sm px-3">
            {g.grade}
          </Badge>
        );
      }
    },
    {
      key: 'marks_range',
      header: 'Marks Range',
      render: (g) => (
        <span className="font-semibold text-white">
          {g.min_marks}% — {g.max_marks}%
        </span>
      )
    },
    {
      key: 'gpa',
      header: 'GPA Equivalent',
      sortable: true,
      render: (g) => (
        <span className="text-purple-300 font-bold">{g.gpa?.toFixed(2) || '0.00'}</span>
      )
    },
    {
      key: 'remarks',
      header: 'Official Remarks',
      render: (g) => (
        <span className="text-xs text-slate-300">{g.remarks || '—'}</span>
      )
    },
    {
      key: 'actions',
      header: 'Actions',
      align: 'right',
      render: (g) => (
        <div className="flex items-center justify-end gap-2">
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => openEditModal(g)}
            className="p-1.5 text-slate-300 hover:text-white"
            title="Edit Grade"
          >
            <Edit2 className="w-3.5 h-3.5" />
          </Button>
          <Button
            type="button"
            variant="danger"
            size="sm"
            onClick={() => setGradeToDelete(g)}
            className="p-1.5"
            title="Delete Grade"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </Button>
        </div>
      )
    }
  ];

  return (
    <PortalLayout
      pageTitle="Grading Scale Standards"
      pageSubtitle="Pakistani Board (FBISE / BISE) and collegiate grading tiers, GPA conversions, and report card remarks"
    >
      <div className="space-y-5 max-w-6xl">
        <div className="flex justify-between items-center">
          <div>
            <h3 className="text-sm font-semibold text-white">Institutional Grading Benchmarks</h3>
            <p className="text-xs text-slate-400">Used for automated grade evaluation in result entry and student mark sheets</p>
          </div>
          <Button
            type="button"
            variant="primary"
            size="sm"
            onClick={openAddModal}
            leftIcon={<Plus className="w-4 h-4" />}
          >
            Add Grade Tier
          </Button>
        </div>

        <Table
          data={scales}
          columns={columns}
          pageSize={10}
          isLoading={isLoading}
          emptyMessage="No grading scale configured."
        />

        {/* Modal */}
        <Modal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          title={editingGrade ? 'Edit Grade Tier' : 'Add New Grade Tier'}
          maxWidth="md"
        >
          <form onSubmit={handleSave} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <Input
                label="Grade Letter *"
                required
                placeholder="A+"
                value={grade}
                onChange={(e) => setGrade(e.target.value)}
              />
              <Input
                label="GPA Equivalent (0.00 - 4.00) *"
                type="number"
                step="0.01"
                min={0}
                max={4}
                required
                value={gpa}
                onChange={(e) => setGpa(Number(e.target.value))}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <Input
                label="Minimum Marks (%) *"
                type="number"
                min={0}
                max={100}
                required
                value={minMarks}
                onChange={(e) => setMinMarks(Number(e.target.value))}
              />
              <Input
                label="Maximum Marks (%) *"
                type="number"
                min={0}
                max={100}
                required
                value={maxMarks}
                onChange={(e) => setMaxMarks(Number(e.target.value))}
              />
            </div>

            <Input
              label="Report Card Remarks *"
              required
              placeholder="e.g. Outstanding / Excellent / Good / Pass"
              value={remarks}
              onChange={(e) => setRemarks(e.target.value)}
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
                {editingGrade ? 'Save Changes' : 'Create Grade Tier'}
              </Button>
            </div>
          </form>
        </Modal>

        {/* Confirm Delete */}
        <ConfirmDialog
          isOpen={Boolean(gradeToDelete)}
          onClose={() => setGradeToDelete(null)}
          onConfirm={handleDeleteConfirm}
          title="Delete Grade Tier?"
          message={`Are you sure you want to delete grade "${gradeToDelete?.grade}" from the grading system?`}
          confirmText="Delete Tier"
          isLoading={isDeleting}
        />
      </div>
    </PortalLayout>
  );
};
