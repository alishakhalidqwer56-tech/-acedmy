import React, { useState, useEffect } from 'react';
import { 
  FolderPlus, 
  Search, 
  Filter, 
  CheckCircle2, 
  XCircle, 
  Clock, 
  Eye, 
  ExternalLink, 
  Send, 
  Check, 
  X, 
  Mail, 
  Phone, 
  FileText, 
  Download,
  AlertCircle,
  RefreshCw,
  ChevronLeft,
  ChevronRight,
  Trash2,
  Pencil,
  Plus,
  Upload,
  CalendarCheck
} from 'lucide-react';
import { PortalLayout } from '../../components/layout/PortalLayout';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Textarea } from '../../components/ui/Textarea';
import { Badge } from '../../components/ui/Badge';
import { Modal } from '../../components/ui/Modal';
import { ImageUpload } from '../../components/ui/ImageUpload';
import { Admission, AdmissionStatus, AttendanceStatus } from '../../types';
import { fetchAllAdmissions, updateAdmissionStatus, deleteAdmission, updateAdmissionDetails, createAdmission } from '../../lib/admissions';
import { markClassAttendance } from '../../lib/dataService';
import { useAuth } from '../../context/AuthContext';

export const AdminAdmissionsPage: React.FC = () => {
  const { profile } = useAuth();
  const [admissions, setAdmissions] = useState<Admission[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedStatusFilter, setSelectedStatusFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Detail Modal State
  const [selectedApplication, setSelectedApplication] = useState<Admission | null>(null);
  const [modalAdminNotes, setModalAdminNotes] = useState('');
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Edit & Delete State
  const [deletingAdmission, setDeletingAdmission] = useState<Admission | null>(null);
  const [editingAdmission, setEditingAdmission] = useState<Admission | null>(null);
  const [editStudentName, setEditStudentName] = useState('');
  const [editStudentPhone, setEditStudentPhone] = useState('');
  const [editParentName, setEditParentName] = useState('');
  const [editParentPhone, setEditParentPhone] = useState('');
  const [editProgram, setEditProgram] = useState('');
  const [editGrade, setEditGrade] = useState('');

  // Add Admission Modal State
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [addStudentName, setAddStudentName] = useState('');
  const [addEmail, setAddEmail] = useState('');
  const [addPhone, setAddPhone] = useState('');
  const [addDob, setAddDob] = useState('2010-05-15');
  const [addGender, setAddGender] = useState('Female');
  const [addProgram, setAddProgram] = useState('FSc Pre-Medical');
  const [addGrade, setAddGrade] = useState('Part 1 (Class 11)');
  const [addPreviousSchool, setAddPreviousSchool] = useState('');
  const [addMarks, setAddMarks] = useState('');
  const [addParentName, setAddParentName] = useState('');
  const [addParentPhone, setAddParentPhone] = useState('');
  const [addParentEmail, setAddParentEmail] = useState('');
  const [addAddress, setAddAddress] = useState('');
  const [addCity, setAddCity] = useState('Islamabad');
  const [addPhotoUrl, setAddPhotoUrl] = useState('');
  const [addStatus, setAddStatus] = useState<AdmissionStatus>('pending');
  const [addAdminNotes, setAddAdminNotes] = useState('Direct administrative entry.');
  const [isSubmittingAdd, setIsSubmittingAdd] = useState(false);

  // Record Attendance for Admission State
  const [attendanceTargetAdmission, setAttendanceTargetAdmission] = useState<Admission | null>(null);
  const [admissionAttendanceDate, setAdmissionAttendanceDate] = useState(new Date().toISOString().split('T')[0]);
  const [admissionAttendanceStatus, setAdmissionAttendanceStatus] = useState<AttendanceStatus>('present');
  const [admissionAttendanceClass, setAdmissionAttendanceClass] = useState('cls-10-sci');
  const [isSubmittingAttendance, setIsSubmittingAttendance] = useState(false);

  const resetAddForm = () => {
    setAddStudentName('');
    setAddEmail('');
    setAddPhone('');
    setAddDob('2010-05-15');
    setAddGender('Female');
    setAddProgram('FSc Pre-Medical');
    setAddGrade('Part 1 (Class 11)');
    setAddPreviousSchool('');
    setAddMarks('');
    setAddParentName('');
    setAddParentPhone('');
    setAddParentEmail('');
    setAddAddress('');
    setAddCity('Islamabad');
    setAddPhotoUrl('');
    setAddStatus('pending');
    setAddAdminNotes('Direct administrative entry.');
  };

  const handleCreateAdmission = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!addStudentName.trim()) return;
    setIsSubmittingAdd(true);
    try {
      const created = await createAdmission({
        student_name: addStudentName,
        email: addEmail,
        phone: addPhone,
        date_of_birth: addDob,
        gender: addGender,
        program_applied: addProgram,
        class_grade_applying: addGrade,
        previous_school: addPreviousSchool,
        previous_grade: addMarks,
        parent_name: addParentName,
        parent_phone: addParentPhone,
        parent_email: addParentEmail,
        address: addAddress,
        city: addCity,
        photo_url: addPhotoUrl || null,
        status: addStatus,
        admin_notes: addAdminNotes
      });
      setToastMessage(`New applicant "${created.student_name}" successfully registered!`);
      setIsAddModalOpen(false);
      resetAddForm();
      await loadAdmissions();
      setTimeout(() => setToastMessage(null), 3500);
    } catch (err) {
      console.error('Error creating admission:', err);
    } finally {
      setIsSubmittingAdd(false);
    }
  };

  const loadAdmissions = async () => {
    setLoading(true);
    try {
      const records = await fetchAllAdmissions({
        status: selectedStatusFilter,
        search: searchQuery
      });
      setAdmissions(records);
    } catch (err) {
      console.error('Error fetching admissions:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAdmissions();

    const handleSync = () => loadAdmissions();
    window.addEventListener('storage', handleSync);
    window.addEventListener('ga_admissions_updated', handleSync);
    return () => {
      window.removeEventListener('storage', handleSync);
      window.removeEventListener('ga_admissions_updated', handleSync);
    };
  }, [selectedStatusFilter, searchQuery]);

  // Open Review Modal
  const openReviewModal = (app: Admission) => {
    setSelectedApplication(app);
    setModalAdminNotes(app.admin_notes || '');
  };

  const closeReviewModal = () => {
    setSelectedApplication(null);
    setModalAdminNotes('');
  };

  // Status Action (Approve / Reject / Pending)
  const handleStatusChange = async (newStatus: AdmissionStatus) => {
    if (!selectedApplication) return;
    setIsUpdatingStatus(true);

    try {
      const updated = await updateAdmissionStatus(
        selectedApplication.id,
        newStatus,
        modalAdminNotes,
        profile?.full_name || 'Admin Officer'
      );

      // Show toast
      const toastText = newStatus === 'approved' 
        ? `Application for ${selectedApplication.student_name} Approved & Notification Dispatched!`
        : newStatus === 'rejected'
        ? `Application for ${selectedApplication.student_name} Marked as Not Accepted.`
        : `Application reset to Pending status.`;

      setToastMessage(toastText);
      setTimeout(() => setToastMessage(null), 4000);

      // Update in local state
      setAdmissions(prev => prev.map(a => a.id === updated.id ? updated : a));
      setSelectedApplication(updated);
    } catch (err: any) {
      alert('Error updating status: ' + err.message);
    } finally {
      setIsUpdatingStatus(false);
    }
  };

  const handleDeleteAdmission = async () => {
    if (!deletingAdmission) return;
    setIsUpdatingStatus(true);
    try {
      await deleteAdmission(deletingAdmission.id);
      setToastMessage(`Application for ${deletingAdmission.student_name} deleted successfully.`);
      setDeletingAdmission(null);
      if (selectedApplication?.id === deletingAdmission.id) setSelectedApplication(null);
      await loadAdmissions();
      setTimeout(() => setToastMessage(null), 3000);
    } finally {
      setIsUpdatingStatus(false);
    }
  };

  const handleSaveEditAdmission = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingAdmission) return;
    setIsUpdatingStatus(true);
    try {
      const updated = await updateAdmissionDetails(editingAdmission.id, {
        student_name: editStudentName,
        phone: editStudentPhone,
        parent_name: editParentName,
        parent_phone: editParentPhone,
        program_applied: editProgram,
        class_grade_applying: editGrade
      });
      setToastMessage(`Application details updated successfully!`);
      setEditingAdmission(null);
      if (selectedApplication?.id === editingAdmission.id) {
        setSelectedApplication({ ...selectedApplication, ...updated });
      }
      await loadAdmissions();
      setTimeout(() => setToastMessage(null), 3000);
    } finally {
      setIsUpdatingStatus(false);
    }
  };

  const handleRecordAdmissionAttendance = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!attendanceTargetAdmission) return;
    setIsSubmittingAttendance(true);
    try {
      await markClassAttendance([{
        student_id: attendanceTargetAdmission.id,
        class_id: admissionAttendanceClass,
        date: admissionAttendanceDate,
        status: admissionAttendanceStatus,
        marked_by: profile?.full_name || 'Academic Registrar'
      }]);
      setToastMessage(`Attendance for "${attendanceTargetAdmission.student_name}" marked as "${admissionAttendanceStatus.toUpperCase()}" on ${admissionAttendanceDate}!`);
      setAttendanceTargetAdmission(null);
      setTimeout(() => setToastMessage(null), 3500);
    } catch (err: any) {
      alert('Error marking attendance: ' + err.message);
    } finally {
      setIsSubmittingAttendance(false);
    }
  };

  // Metric Stats computation
  const totalCount = admissions.length;
  const pendingCount = admissions.filter(a => a.status === 'pending').length;
  const approvedCount = admissions.filter(a => a.status === 'approved').length;
  const rejectedCount = admissions.filter(a => a.status === 'rejected').length;

  // Pagination
  const totalPages = Math.ceil(admissions.length / itemsPerPage) || 1;
  const paginatedAdmissions = admissions.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const getStatusBadge = (status: AdmissionStatus) => {
    switch (status) {
      case 'approved':
        return <Badge variant="emerald" size="sm">Approved</Badge>;
      case 'rejected':
        return <Badge variant="pink" size="sm">Rejected</Badge>;
      case 'pending':
      default:
        return <Badge variant="amber" size="sm">Pending</Badge>;
    }
  };

  return (
    <PortalLayout
      pageTitle="Admissions Pipeline & Triage Desk"
      pageSubtitle="Review incoming dossiers, inspect transcripts, attach admin evaluation remarks, and issue admissions offers"
    >
      <div className="space-y-6">

        {/* 1. Stats Row Count Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <Card glassmorphism className="p-5 bg-[#181827] border-[#2a2a3e]">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] font-semibold text-slate-400 uppercase">Total Applications</span>
              <div className="p-2 rounded-xl bg-purple-500/10 text-purple-400 border border-purple-500/20">
                <FolderPlus className="w-4 h-4" />
              </div>
            </div>
            <div className="text-2xl sm:text-3xl font-extrabold text-white">{totalCount}</div>
            <span className="text-[10px] text-slate-400 mt-0.5 block">Academic Year 2026-2027</span>
          </Card>

          <Card glassmorphism className="p-5 bg-[#181827] border-[#2a2a3e]">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] font-semibold text-slate-400 uppercase">Pending Review</span>
              <div className="p-2 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20">
                <Clock className="w-4 h-4" />
              </div>
            </div>
            <div className="text-2xl sm:text-3xl font-extrabold text-amber-400">{pendingCount}</div>
            <span className="text-[10px] text-amber-300/80 mt-0.5 block">Awaiting board evaluation</span>
          </Card>

          <Card glassmorphism className="p-5 bg-[#181827] border-[#2a2a3e]">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] font-semibold text-slate-400 uppercase">Approved & Admitted</span>
              <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                <CheckCircle2 className="w-4 h-4" />
              </div>
            </div>
            <div className="text-2xl sm:text-3xl font-extrabold text-emerald-400">{approvedCount}</div>
            <span className="text-[10px] text-emerald-300/80 mt-0.5 block">Letters & grants issued</span>
          </Card>

          <Card glassmorphism className="p-5 bg-[#181827] border-[#2a2a3e]">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] font-semibold text-slate-400 uppercase">Not Accepted</span>
              <div className="p-2 rounded-xl bg-rose-500/10 text-rose-400 border border-rose-500/20">
                <XCircle className="w-4 h-4" />
              </div>
            </div>
            <div className="text-2xl sm:text-3xl font-extrabold text-rose-400">{rejectedCount}</div>
            <span className="text-[10px] text-rose-300/80 mt-0.5 block">Reapply in spring</span>
          </Card>
        </div>

        {/* 2. Filter & Search Bar */}
        <Card className="p-4 sm:p-5 bg-[#181827] border-[#2a2a3e]">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-center">
            
            {/* Search Input */}
            <div className="md:col-span-6">
              <Input
                placeholder="Search by student name, email, or program..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                leftIcon={<Search className="w-4 h-4 text-purple-400" />}
              />
            </div>

            {/* Status Filter Buttons */}
            <div className="md:col-span-6 flex items-center justify-end gap-1.5 flex-wrap">
              {['all', 'pending', 'approved', 'rejected'].map((st) => (
                <button
                  key={st}
                  onClick={() => { setSelectedStatusFilter(st); setCurrentPage(1); }}
                  className={`px-3 py-1.5 rounded-xl text-xs font-medium capitalize transition-all ${
                    selectedStatusFilter === st
                      ? 'bg-purple-600 text-white shadow-md shadow-purple-950/40'
                      : 'bg-white/[0.03] text-slate-400 hover:text-white border border-[#2a2a3e]'
                  }`}
                >
                  {st}
                </button>
              ))}

              <Button
                variant="outline"
                size="sm"
                onClick={loadAdmissions}
                title="Refresh admissions list"
                className="ml-2"
              >
                <RefreshCw className="w-3.5 h-3.5" />
              </Button>

              <Button
                variant="primary"
                size="sm"
                onClick={() => { resetAddForm(); setIsAddModalOpen(true); }}
                leftIcon={<Plus className="w-3.5 h-3.5" />}
                className="ml-2"
              >
                Add New Admission
              </Button>
            </div>

          </div>
        </Card>

        {/* 3. Admissions Data Table */}
        <Card className="p-0 bg-[#181827] border-[#2a2a3e] overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="bg-[#141422] border-b border-[#2a2a3e] text-slate-400 uppercase text-[10px] font-semibold tracking-wider">
                <tr>
                  <th className="py-3.5 px-4 sm:px-6">Applicant Name</th>
                  <th className="py-3.5 px-4">Program Applied</th>
                  <th className="py-3.5 px-4">Guardian Contact</th>
                  <th className="py-3.5 px-4">Date Submitted</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#2a2a3e]/60">
                {paginatedAdmissions.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="text-center py-12 text-slate-400">
                      No admission applications found matching this criteria.
                    </td>
                  </tr>
                ) : (
                  paginatedAdmissions.map((app) => (
                    <tr key={app.id} className="hover:bg-white/[0.02] transition-colors">
                      <td className="py-3.5 px-4 sm:px-6">
                        <div className="flex items-center gap-3">
                          <img
                            src={app.photo_url || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80'}
                            alt={app.student_name}
                            className="w-8 h-8 rounded-full object-cover border border-purple-500/30"
                          />
                          <div>
                            <span className="font-bold text-white block text-sm">{app.student_name}</span>
                            <span className="text-[11px] text-slate-400">{app.email}</span>
                          </div>
                        </div>
                      </td>
                      <td className="py-3.5 px-4">
                        <span className="font-medium text-purple-300 block">{app.program_applied || 'General STEM'}</span>
                        <span className="text-[10px] text-slate-500">{app.class_grade_applying || 'Secondary'}</span>
                      </td>
                      <td className="py-3.5 px-4">
                        <span className="text-slate-200 block">{app.parent_name || 'N/A'}</span>
                        <span className="text-[10px] text-slate-400">{app.parent_phone || app.phone || 'N/A'}</span>
                      </td>
                      <td className="py-3.5 px-4 text-slate-400">
                        {app.created_at ? new Date(app.created_at).toLocaleDateString() : 'Recent'}
                      </td>
                      <td className="py-3.5 px-4">
                        {getStatusBadge(app.status)}
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => openReviewModal(app)}
                            leftIcon={<Eye className="w-3.5 h-3.5" />}
                          >
                            Review
                          </Button>
                          <button
                            onClick={() => {
                              setAttendanceTargetAdmission(app);
                              setAdmissionAttendanceDate(new Date().toISOString().split('T')[0]);
                              setAdmissionAttendanceStatus('present');
                            }}
                            className="p-1.5 rounded-lg border border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/10 transition-colors"
                            title="Record attendance for this applicant"
                          >
                            <CalendarCheck className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => {
                              setEditingAdmission(app);
                              setEditStudentName(app.student_name);
                              setEditStudentPhone(app.phone || '');
                              setEditParentName(app.parent_name || '');
                              setEditParentPhone(app.parent_phone || '');
                              setEditProgram(app.program_applied || '');
                              setEditGrade(app.class_grade_applying || '');
                            }}
                            className="p-1.5 rounded-lg border border-purple-500/30 text-purple-300 hover:bg-purple-500/10 transition-colors"
                            title="Edit applicant information"
                          >
                            <Pencil className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => setDeletingAdmission(app)}
                            className="p-1.5 rounded-lg border border-rose-500/30 text-rose-400 hover:bg-rose-500/10 transition-colors"
                            title="Delete admission application"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination Controls */}
          <div className="p-4 border-t border-[#2a2a3e] flex items-center justify-between text-xs text-slate-400">
            <span>
              Showing {(currentPage - 1) * itemsPerPage + 1} - {Math.min(currentPage * itemsPerPage, admissions.length)} of {admissions.length} applications
            </span>
            <div className="flex items-center gap-2">
              <button
                disabled={currentPage === 1}
                onClick={() => setCurrentPage(p => Math.max(p - 1, 1))}
                className="p-1.5 rounded-lg border border-[#2a2a3e] hover:bg-white/5 disabled:opacity-40 disabled:cursor-not-allowed"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <span className="px-2 font-medium text-white">Page {currentPage} of {totalPages}</span>
              <button
                disabled={currentPage >= totalPages}
                onClick={() => setCurrentPage(p => Math.min(p + 1, totalPages))}
                className="p-1.5 rounded-lg border border-[#2a2a3e] hover:bg-white/5 disabled:opacity-40 disabled:cursor-not-allowed"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </Card>

        {/* 4. Application Detail Review Modal */}
        {selectedApplication && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fade-in">
            <div
              className="relative w-full max-w-3xl max-h-[92vh] overflow-y-auto bg-[#141422] border border-[#2a2a3e] rounded-2xl p-6 sm:p-8 shadow-2xl text-slate-200 space-y-6"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Modal Header */}
              <div className="flex items-start justify-between pb-4 border-b border-[#2a2a3e]">
                <div className="flex items-center gap-3.5">
                  <img
                    src={selectedApplication.photo_url || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80'}
                    alt={selectedApplication.student_name}
                    className="w-14 h-14 rounded-2xl object-cover border-2 border-purple-500/40"
                  />
                  <div>
                    <div className="flex items-center gap-2">
                      <h2 className="text-xl font-bold text-white">{selectedApplication.student_name}</h2>
                      {getStatusBadge(selectedApplication.status)}
                    </div>
                    <p className="text-xs text-purple-300 mt-0.5">{selectedApplication.program_applied}</p>
                    <span className="text-[11px] text-slate-400 block">ID: {selectedApplication.id}</span>
                  </div>
                </div>
                <button
                  onClick={closeReviewModal}
                  className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-white/5 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Applicant Info Breakdown */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                {/* Student Info */}
                <div className="p-4 rounded-xl bg-[#181827] border border-[#2a2a3e] space-y-2">
                  <span className="text-purple-400 font-bold uppercase text-[10px] tracking-wider block">Student Biographical Data</span>
                  <div><strong className="text-slate-400">Date of Birth:</strong> {selectedApplication.date_of_birth || 'N/A'} ({selectedApplication.gender || 'Female'})</div>
                  <div><strong className="text-slate-400">Previous School:</strong> {selectedApplication.previous_school || 'N/A'}</div>
                  <div><strong className="text-slate-400">Class Completed:</strong> {selectedApplication.previous_class || 'N/A'}</div>
                  <div><strong className="text-slate-400">Class Applying For:</strong> {selectedApplication.class_grade_applying || 'Grade 11'}</div>
                </div>

                {/* Parent Info */}
                <div className="p-4 rounded-xl bg-[#181827] border border-[#2a2a3e] space-y-2">
                  <span className="text-pink-400 font-bold uppercase text-[10px] tracking-wider block">Guardian & Identity Record</span>
                  <div><strong className="text-slate-400">Parent / Guardian:</strong> {selectedApplication.parent_name || 'N/A'} ({selectedApplication.guardian_relationship || 'Parent'})</div>
                  <div><strong className="text-slate-400">Phone:</strong> {selectedApplication.parent_phone || selectedApplication.phone || 'N/A'}</div>
                  <div><strong className="text-slate-400">Email:</strong> {selectedApplication.parent_email || selectedApplication.email}</div>
                  <div><strong className="text-slate-400">Occupation:</strong> {selectedApplication.parent_occupation || 'N/A'}</div>
                  {selectedApplication.cnic_number && (
                    <div><strong className="text-slate-400">National CNIC:</strong> {selectedApplication.cnic_number}</div>
                  )}
                </div>

                {/* Residence */}
                <div className="p-4 rounded-xl bg-[#181827] border border-[#2a2a3e] space-y-1 sm:col-span-2">
                  <span className="text-cyan-400 font-bold uppercase text-[10px] tracking-wider block">Residential Address</span>
                  <div className="text-slate-300">{selectedApplication.address}, {selectedApplication.city || 'Islamabad'}, {selectedApplication.province || 'ICT'}</div>
                </div>
              </div>

              {/* Attached Documents in Bucket */}
              <div className="space-y-2">
                <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                  Uploaded Documents in Bucket (admissions-documents)
                </h4>
                {(!selectedApplication.documents_url || selectedApplication.documents_url.length === 0) ? (
                  <p className="text-xs text-slate-500 italic p-3 rounded-xl bg-[#181827] border border-[#2a2a3e]">
                    No external documents attached to this application.
                  </p>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    {selectedApplication.documents_url.map((docUrl, idx) => (
                      <a
                        key={idx}
                        href={docUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="p-3 rounded-xl bg-[#181827] border border-[#2a2a3e] hover:border-purple-500/50 flex items-center justify-between text-xs text-slate-200 transition-colors group"
                      >
                        <div className="flex items-center gap-2 overflow-hidden">
                          <FileText className="w-4 h-4 text-purple-400 shrink-0" />
                          <span className="truncate">Applicant Document #{idx + 1}</span>
                        </div>
                        <ExternalLink className="w-3.5 h-3.5 text-slate-500 group-hover:text-purple-300 shrink-0" />
                      </a>
                    ))}
                  </div>
                )}
              </div>

              {/* Admin Evaluation Notes */}
              <div className="space-y-2">
                <label className="block text-xs font-semibold uppercase tracking-wider text-purple-300">
                  Admissions Council Remarks & Decision Notes
                </label>
                <Textarea
                  rows={3}
                  placeholder="Enter remarks for official record (these will be included in the automated notification dispatch)..."
                  value={modalAdminNotes}
                  onChange={(e) => setModalAdminNotes(e.target.value)}
                />
              </div>

              {/* Last Updated Timestamp */}
              <div className="flex items-center justify-between text-[11px] text-slate-500 pt-2 border-t border-[#2a2a3e]">
                <span>
                  Submitted: {selectedApplication.created_at ? new Date(selectedApplication.created_at).toLocaleString() : 'Recent'}
                </span>
                <span>
                  Last modified: {selectedApplication.updated_at ? new Date(selectedApplication.updated_at).toLocaleString() : 'Pending review'}
                </span>
              </div>

              {/* Action Buttons: Approve, Reject, Set Pending */}
              <div className="pt-2 flex flex-wrap items-center justify-between gap-3">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={closeReviewModal}
                >
                  Close
                </Button>

                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="border-emerald-500/40 text-emerald-300 hover:bg-emerald-500/10"
                    onClick={() => {
                      setAttendanceTargetAdmission(selectedApplication);
                      setAdmissionAttendanceDate(new Date().toISOString().split('T')[0]);
                      setAdmissionAttendanceStatus('present');
                    }}
                    leftIcon={<CalendarCheck className="w-3.5 h-3.5 text-emerald-400" />}
                  >
                    Record Attendance
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="border-rose-500/40 text-rose-400 hover:bg-rose-500/10"
                    onClick={() => {
                      setDeletingAdmission(selectedApplication);
                    }}
                    leftIcon={<Trash2 className="w-3.5 h-3.5" />}
                  >
                    Delete Application
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={isUpdatingStatus}
                    onClick={() => handleStatusChange('pending')}
                  >
                    Reset to Pending
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={isUpdatingStatus}
                    className="border-rose-500/50 text-rose-300 hover:bg-rose-500/10 hover:border-rose-500"
                    onClick={() => handleStatusChange('rejected')}
                    leftIcon={<XCircle className="w-4 h-4 text-rose-400" />}
                  >
                    Reject Application
                  </Button>
                  <Button
                    variant="primary"
                    size="sm"
                    disabled={isUpdatingStatus}
                    className="bg-gradient-to-r from-emerald-600 to-teal-500 hover:from-emerald-500 hover:to-teal-400"
                    onClick={() => handleStatusChange('approved')}
                    leftIcon={<CheckCircle2 className="w-4 h-4 text-white" />}
                  >
                    Approve & Issue Offer
                  </Button>
                </div>
              </div>

            </div>
          </div>
        )}

        {/* Modal: Edit Admission Information */}
        {editingAdmission && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
            <div className="w-full max-w-lg bg-[#181829] border border-[#2a2a3e] rounded-2xl shadow-2xl overflow-hidden">
              <div className="p-5 border-b border-[#2a2a3e] flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Pencil className="w-5 h-5 text-purple-400" />
                  <h3 className="text-base font-bold text-white">Edit Application Details</h3>
                </div>
                <button
                  onClick={() => setEditingAdmission(null)}
                  className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-white/5"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleSaveEditAdmission} className="p-5 space-y-4 text-xs">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-300 mb-1">Student Full Name *</label>
                    <Input
                      required
                      value={editStudentName}
                      onChange={(e) => setEditStudentName(e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-300 mb-1">Student Phone</label>
                    <Input
                      value={editStudentPhone}
                      onChange={(e) => setEditStudentPhone(e.target.value)}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-300 mb-1">Parent / Guardian Name</label>
                    <Input
                      value={editParentName}
                      onChange={(e) => setEditParentName(e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-300 mb-1">Parent Phone / WhatsApp</label>
                    <Input
                      value={editParentPhone}
                      onChange={(e) => setEditParentPhone(e.target.value)}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-300 mb-1">Program Applied</label>
                    <Input
                      value={editProgram}
                      onChange={(e) => setEditProgram(e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-300 mb-1">Class / Grade Applying</label>
                    <Input
                      value={editGrade}
                      onChange={(e) => setEditGrade(e.target.value)}
                    />
                  </div>
                </div>

                <div className="pt-3 flex items-center justify-end gap-2 border-t border-[#2a2a3e]">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => setEditingAdmission(null)}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    variant="primary"
                    size="sm"
                    isLoading={isUpdatingStatus}
                  >
                    Save Changes
                  </Button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Modal: Delete Admission Confirmation */}
        {deletingAdmission && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
            <div className="w-full max-w-sm bg-[#181829] border border-rose-500/40 rounded-2xl shadow-2xl p-6 text-center space-y-4">
              <div className="w-12 h-12 rounded-full bg-rose-500/20 text-rose-400 flex items-center justify-center mx-auto border border-rose-500/30">
                <Trash2 className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-base font-bold text-white">Delete Admission Record?</h3>
                <p className="text-xs text-slate-400 mt-1">
                  Are you sure you want to permanently delete application for <span className="text-white font-semibold">{deletingAdmission.student_name}</span>? This action cannot be undone.
                </p>
              </div>
              <div className="flex items-center justify-center gap-3 pt-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setDeletingAdmission(null)}
                >
                  Cancel
                </Button>
                <Button
                  variant="primary"
                  size="sm"
                  className="bg-rose-600 hover:bg-rose-700 text-white"
                  isLoading={isUpdatingStatus}
                  onClick={handleDeleteAdmission}
                >
                  Confirm Delete
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Modal: Add New Admission Application */}
        {isAddModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fade-in">
            <div className="w-full max-w-2xl bg-[#181829] border border-[#2a2a3e] rounded-2xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col">
              <div className="p-5 border-b border-[#2a2a3e] flex items-center justify-between shrink-0">
                <div className="flex items-center gap-2">
                  <div className="p-2 rounded-xl bg-purple-500/10 text-purple-400 border border-purple-500/20">
                    <Plus className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-white">Register New Admission</h3>
                    <p className="text-xs text-slate-400">Add applicant manually into database</p>
                  </div>
                </div>
                <button
                  onClick={() => setIsAddModalOpen(false)}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/5"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleCreateAdmission} className="p-6 overflow-y-auto space-y-4 text-xs flex-1">
                {/* 1. Student Info */}
                <div className="space-y-3">
                  <span className="text-[11px] font-bold text-purple-400 uppercase tracking-wider block">1. Student Details</span>
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-300 mb-1">Student Full Name *</label>
                    <Input
                      required
                      placeholder="e.g. Fatima Zahra"
                      value={addStudentName}
                      onChange={(e) => setAddStudentName(e.target.value)}
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] font-semibold text-slate-300 mb-1">Applicant Email</label>
                      <Input
                        type="email"
                        placeholder="fatima.zahra@example.com"
                        value={addEmail}
                        onChange={(e) => setAddEmail(e.target.value)}
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-semibold text-slate-300 mb-1">Contact Phone *</label>
                      <Input
                        placeholder="0300-1234567"
                        value={addPhone}
                        onChange={(e) => setAddPhone(e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] font-semibold text-slate-300 mb-1">Date of Birth</label>
                      <Input
                        type="date"
                        value={addDob}
                        onChange={(e) => setAddDob(e.target.value)}
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-semibold text-slate-300 mb-1">Gender</label>
                      <select
                        value={addGender}
                        onChange={(e) => setAddGender(e.target.value)}
                        className="w-full bg-[#11111d] border border-[#2a2a3e] text-white text-xs rounded-xl px-3 py-2.5 focus:outline-none focus:border-purple-500"
                      >
                        <option value="Female">Female</option>
                        <option value="Male">Male</option>
                      </select>
                    </div>
                  </div>

                  {/* Student Photo Upload */}
                  <div>
                    <ImageUpload
                      label="Student Photograph (Upload Pic or Enter URL)"
                      value={addPhotoUrl}
                      onChange={setAddPhotoUrl}
                      helperText="Official passport size photograph for student dossier"
                    />
                  </div>
                </div>

                {/* 2. Program & Academic History */}
                <div className="space-y-3 pt-3 border-t border-[#2a2a3e]">
                  <span className="text-[11px] font-bold text-purple-400 uppercase tracking-wider block">2. Academic Program</span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] font-semibold text-slate-300 mb-1">Program Applied *</label>
                      <select
                        value={addProgram}
                        onChange={(e) => setAddProgram(e.target.value)}
                        className="w-full bg-[#11111d] border border-[#2a2a3e] text-white text-xs rounded-xl px-3 py-2.5 focus:outline-none focus:border-purple-500"
                      >
                        <option value="FSc Pre-Medical">FSc Pre-Medical</option>
                        <option value="FSc Pre-Engineering">FSc Pre-Engineering</option>
                        <option value="ICS (Computer Science)">ICS (Computer Science)</option>
                        <option value="Matric Science (Class 9 & 10)">Matric Science (Class 9 & 10)</option>
                        <option value="I.Com (Commerce)">I.Com (Commerce)</option>
                        <option value="FA Humanities">FA Humanities</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-[11px] font-semibold text-slate-300 mb-1">Class / Grade Applying</label>
                      <Input
                        placeholder="e.g. Part 1 (Class 11)"
                        value={addGrade}
                        onChange={(e) => setAddGrade(e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] font-semibold text-slate-300 mb-1">Previous School / College</label>
                      <Input
                        placeholder="e.g. Army Public School Islamabad"
                        value={addPreviousSchool}
                        onChange={(e) => setAddPreviousSchool(e.target.value)}
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-semibold text-slate-300 mb-1">Previous Marks / Grade</label>
                      <Input
                        placeholder="e.g. 1024/1100 (93%)"
                        value={addMarks}
                        onChange={(e) => setAddMarks(e.target.value)}
                      />
                    </div>
                  </div>
                </div>

                {/* 3. Parent / Guardian Details */}
                <div className="space-y-3 pt-3 border-t border-[#2a2a3e]">
                  <span className="text-[11px] font-bold text-purple-400 uppercase tracking-wider block">3. Parent / Guardian Details</span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] font-semibold text-slate-300 mb-1">Parent / Father Name</label>
                      <Input
                        placeholder="e.g. Muhammad Zahra"
                        value={addParentName}
                        onChange={(e) => setAddParentName(e.target.value)}
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-semibold text-slate-300 mb-1">Parent Phone</label>
                      <Input
                        placeholder="0321-9876543"
                        value={addParentPhone}
                        onChange={(e) => setAddParentPhone(e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] font-semibold text-slate-300 mb-1">Residential Address</label>
                      <Input
                        placeholder="Street 14, Sector F-8/2"
                        value={addAddress}
                        onChange={(e) => setAddAddress(e.target.value)}
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-semibold text-slate-300 mb-1">City</label>
                      <Input
                        placeholder="Islamabad"
                        value={addCity}
                        onChange={(e) => setAddCity(e.target.value)}
                      />
                    </div>
                  </div>
                </div>

                {/* 4. Decision & Admin Notes */}
                <div className="space-y-3 pt-3 border-t border-[#2a2a3e]">
                  <span className="text-[11px] font-bold text-purple-400 uppercase tracking-wider block">4. Application Status & Evaluation</span>
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-300 mb-1">Initial Status</label>
                    <select
                      value={addStatus}
                      onChange={(e) => setAddStatus(e.target.value as AdmissionStatus)}
                      className="w-full bg-[#11111d] border border-[#2a2a3e] text-white text-xs rounded-xl px-3 py-2.5 focus:outline-none focus:border-purple-500"
                    >
                      <option value="pending">Pending Review</option>
                      <option value="approved">Approved & Admitted</option>
                      <option value="rejected">Not Accepted</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-slate-300 mb-1">Admin Internal Evaluation Notes</label>
                    <Textarea
                      rows={2}
                      value={addAdminNotes}
                      onChange={(e) => setAddAdminNotes(e.target.value)}
                      placeholder="Special merit remarks, fee concession info, interview date..."
                    />
                  </div>
                </div>

                <div className="pt-4 flex items-center justify-end gap-2 border-t border-[#2a2a3e]">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => setIsAddModalOpen(false)}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    variant="primary"
                    size="sm"
                    isLoading={isSubmittingAdd}
                    leftIcon={<Plus className="w-3.5 h-3.5" />}
                  >
                    Register Application
                  </Button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Modal: Record Attendance for Admission */}
        {attendanceTargetAdmission && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
            <div className="w-full max-w-md bg-[#181829] border border-emerald-500/40 rounded-2xl shadow-2xl overflow-hidden">
              <div className="p-5 border-b border-[#2a2a3e] flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <CalendarCheck className="w-5 h-5 text-emerald-400" />
                  <div>
                    <h3 className="text-base font-bold text-white">Record Admission Attendance</h3>
                    <p className="text-[11px] text-emerald-300">{attendanceTargetAdmission.student_name}</p>
                  </div>
                </div>
                <button
                  onClick={() => setAttendanceTargetAdmission(null)}
                  className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-white/5"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleRecordAdmissionAttendance} className="p-5 space-y-4 text-xs">
                <div className="p-3 rounded-xl bg-[#11111d] border border-[#2a2a3e] space-y-1">
                  <div className="text-slate-400 text-[11px]">Scholar Dossier:</div>
                  <div className="font-bold text-white text-sm">{attendanceTargetAdmission.student_name}</div>
                  <div className="text-slate-400 text-[11px]">Program: {attendanceTargetAdmission.program_applied || 'General'}</div>
                  <div className="text-slate-400 text-[11px]">Admission ID: {attendanceTargetAdmission.id}</div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-300 mb-1">Date *</label>
                    <input
                      type="date"
                      required
                      value={admissionAttendanceDate}
                      onChange={(e) => setAdmissionAttendanceDate(e.target.value)}
                      className="w-full bg-[#11111d] border border-[#2a2a3e] rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-slate-300 mb-1">Status *</label>
                    <select
                      value={admissionAttendanceStatus}
                      onChange={(e) => setAdmissionAttendanceStatus(e.target.value as AttendanceStatus)}
                      className="w-full bg-[#11111d] border border-[#2a2a3e] rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
                    >
                      <option value="present">Present (On-Time)</option>
                      <option value="late">Late Arrival</option>
                      <option value="leave">Approved Leave / Excused</option>
                      <option value="absent">Unexcused Absent</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-300 mb-1">Batch / Class Section</label>
                  <select
                    value={admissionAttendanceClass}
                    onChange={(e) => setAdmissionAttendanceClass(e.target.value)}
                    className="w-full bg-[#11111d] border border-[#2a2a3e] rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
                  >
                    <option value="cls-10-sci">Class 10 — Matric Science</option>
                    <option value="cls-9-sci">Class 9 — Matric Science</option>
                    <option value="cls-11-med">FSc 1st Year — Pre-Medical</option>
                    <option value="cls-12-eng">FSc 2nd Year — Pre-Engineering</option>
                    <option value="cls-admissions-orientation">New Admissions Orientation Batch 2026-2027</option>
                  </select>
                </div>

                <div className="pt-2 flex items-center justify-end gap-2 border-t border-[#2a2a3e]">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => setAttendanceTargetAdmission(null)}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    variant="primary"
                    size="sm"
                    className="bg-emerald-600 hover:bg-emerald-500 text-white"
                    isLoading={isSubmittingAttendance}
                  >
                    Save Attendance Record
                  </Button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Success Toast */}
        {toastMessage && (
          <div className="fixed bottom-6 right-6 z-50 p-4 rounded-2xl bg-[#1e1e2e] border border-emerald-500/40 shadow-2xl flex items-center gap-3 animate-fade-in text-slate-200">
            <CheckCircle2 className="w-6 h-6 text-emerald-400 shrink-0" />
            <div className="text-xs">
              <span className="font-bold text-white block">Admissions Status Updated</span>
              <span>{toastMessage}</span>
            </div>
          </div>
        )}

      </div>
    </PortalLayout>
  );
};
