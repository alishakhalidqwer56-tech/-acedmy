import React, { useState, useEffect } from 'react';
import { PortalLayout } from '../../components/layout/PortalLayout';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Textarea } from '../../components/ui/Textarea';
import { Modal } from '../../components/ui/Modal';
import { ConfirmDialog } from '../../components/ui/ConfirmDialog';
import { Table, Column } from '../../components/ui/Table';
import { Badge } from '../../components/ui/Badge';
import { useToast } from '../../context/ToastContext';
import { fetchFeeStructures, createFeeStructure, updateFeeStructure, deleteFeeStructure } from '../../lib/dataService';
import { FeeStructure, PAKISTAN_CLASSES } from '../../types';
import { DollarSign, Plus, Edit2, Trash2, Search } from 'lucide-react';

export const AdminFeePage: React.FC = () => {
  const [fees, setFees] = useState<FeeStructure[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const toast = useToast();

  // Add / Edit Modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingFee, setEditingFee] = useState<FeeStructure | null>(null);
  const [program, setProgram] = useState('');
  const [className, setClassName] = useState('');
  const [amount, setAmount] = useState<number>(15000);
  const [frequency, setFrequency] = useState('Monthly');
  const [description, setDescription] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  // Delete Confirm
  const [feeToDelete, setFeeToDelete] = useState<FeeStructure | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const loadData = async () => {
    setIsLoading(true);
    try {
      const data = await fetchFeeStructures();
      setFees(data);
    } catch {
      toast.error('Failed to load fee structure');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const openAddModal = () => {
    setEditingFee(null);
    setProgram('');
    setClassName(PAKISTAN_CLASSES[0] || 'Class 9 (Matric)');
    setAmount(15000);
    setFrequency('Monthly');
    setDescription('');
    setIsModalOpen(true);
  };

  const openEditModal = (f: FeeStructure) => {
    setEditingFee(f);
    setProgram(f.program);
    setClassName(f.class_name || '');
    setAmount(f.amount);
    setFrequency(f.frequency || 'Monthly');
    setDescription(f.description || '');
    setIsModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!program.trim()) {
      toast.warning('Please enter a program name');
      return;
    }
    if (amount <= 0) {
      toast.warning('Please enter a valid tuition fee amount');
      return;
    }

    setIsSaving(true);
    try {
      if (editingFee) {
        await updateFeeStructure(editingFee.id, {
          program: program.trim(),
          class_name: className.trim(),
          amount,
          frequency,
          description: description.trim()
        });
        toast.success(`Fee structure for "${program}" updated!`);
      } else {
        await createFeeStructure({
          program: program.trim(),
          class_name: className.trim(),
          amount,
          frequency,
          description: description.trim()
        });
        toast.success(`Fee record for "${program}" created!`);
      }
      setIsModalOpen(false);
      loadData();
    } catch {
      toast.error('Failed to save fee structure');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteConfirm = async () => {
    if (!feeToDelete) return;
    setIsDeleting(true);
    try {
      await deleteFeeStructure(feeToDelete.id);
      toast.success(`Fee record deleted.`);
      setFeeToDelete(null);
      loadData();
    } catch {
      toast.error('Failed to delete fee record');
    } finally {
      setIsDeleting(false);
    }
  };

  const filteredFees = fees.filter(f =>
    f.program.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (f.class_name && f.class_name.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const columns: Column<FeeStructure>[] = [
    {
      key: 'program',
      header: 'Program / Stream',
      sortable: true,
      render: (f) => (
        <div>
          <span className="font-semibold text-white block">{f.program}</span>
          {f.description && <span className="text-[11px] text-slate-400">{f.description}</span>}
        </div>
      )
    },
    {
      key: 'class_name',
      header: 'Class / Wing',
      sortable: true,
      render: (f) => (
        <Badge variant="purple" size="sm">{f.class_name || 'All Classes'}</Badge>
      )
    },
    {
      key: 'amount',
      header: 'Tuition Fee (PKR)',
      sortable: true,
      render: (f) => (
        <span className="font-bold text-emerald-400 text-sm">
          Rs. {Number(f.amount).toLocaleString('en-PK')}
        </span>
      )
    },
    {
      key: 'frequency',
      header: 'Billing Frequency',
      render: (f) => (
        <Badge variant="slate" size="sm">{f.frequency || 'Monthly'}</Badge>
      )
    },
    {
      key: 'actions',
      header: 'Actions',
      align: 'right',
      render: (f) => (
        <div className="flex items-center justify-end gap-2">
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => openEditModal(f)}
            className="p-1.5 text-slate-300 hover:text-white"
            title="Edit Fee"
          >
            <Edit2 className="w-3.5 h-3.5" />
          </Button>
          <Button
            type="button"
            variant="danger"
            size="sm"
            onClick={() => setFeeToDelete(f)}
            className="p-1.5"
            title="Delete Fee"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </Button>
        </div>
      )
    }
  ];

  return (
    <PortalLayout
      pageTitle="Fee Structure Management"
      pageSubtitle="Configure institutional tuition rates, laboratory dues, and payment frequency in PKR"
    >
      <div className="space-y-5 max-w-6xl">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          <div className="relative w-full sm:w-72">
            <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
            <input
              type="text"
              placeholder="Search programs..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-[#161625] border border-[#2a2a3e] rounded-xl pl-9 pr-4 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-purple-500"
            />
          </div>

          <Button
            type="button"
            variant="primary"
            size="sm"
            onClick={openAddModal}
            leftIcon={<Plus className="w-4 h-4" />}
          >
            Add Fee Schedule
          </Button>
        </div>

        <Table
          data={filteredFees}
          columns={columns}
          pageSize={10}
          isLoading={isLoading}
          emptyMessage="No fee structure entries found."
        />

        {/* Add/Edit Modal */}
        <Modal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          title={editingFee ? 'Edit Fee Schedule' : 'Add Fee Schedule'}
          maxWidth="md"
        >
          <form onSubmit={handleSave} className="space-y-4">
            <Input
              label="Academic Program *"
              required
              placeholder="e.g. FSc Pre-Medical (Part 1 & 2)"
              value={program}
              onChange={(e) => setProgram(e.target.value)}
            />

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5">Class / Wing *</label>
              <select
                value={className}
                onChange={(e) => setClassName(e.target.value)}
                className="w-full bg-[#141422] border border-[#2a2a3e] rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:ring-2 focus:ring-purple-500/50"
              >
                {PAKISTAN_CLASSES.map(cls => (
                  <option key={cls} value={cls}>{cls}</option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <Input
                label="Amount (PKR) *"
                type="number"
                required
                min={0}
                placeholder="18500"
                value={amount}
                onChange={(e) => setAmount(Number(e.target.value))}
              />

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1.5">Frequency *</label>
                <select
                  value={frequency}
                  onChange={(e) => setFrequency(e.target.value)}
                  className="w-full bg-[#141422] border border-[#2a2a3e] rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:ring-2 focus:ring-purple-500/50"
                >
                  <option value="Monthly">Monthly</option>
                  <option value="Quarterly">Quarterly</option>
                  <option value="Per Semester">Per Semester</option>
                  <option value="Annual">Annual</option>
                </select>
              </div>
            </div>

            <Textarea
              label="Fee Description & Inclusions"
              rows={3}
              placeholder="e.g. Includes laboratory access, science apparatus, and FBISE test series"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
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
                {editingFee ? 'Save Changes' : 'Create Schedule'}
              </Button>
            </div>
          </form>
        </Modal>

        {/* Confirm Delete */}
        <ConfirmDialog
          isOpen={Boolean(feeToDelete)}
          onClose={() => setFeeToDelete(null)}
          onConfirm={handleDeleteConfirm}
          title="Delete Fee Record?"
          message={`Are you sure you want to delete the fee schedule for "${feeToDelete?.program}"?`}
          confirmText="Delete Fee"
          isLoading={isDeleting}
        />
      </div>
    </PortalLayout>
  );
};
