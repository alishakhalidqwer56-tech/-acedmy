import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Users, 
  CalendarCheck, 
  Award, 
  DollarSign, 
  Bell, 
  Sparkles, 
  CheckCircle2, 
  GraduationCap, 
  ArrowRight,
  TrendingUp,
  FileCheck,
  Pencil,
  Plus,
  Send,
  CreditCard,
  Calendar,
  AlertCircle,
  X
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { PortalLayout } from '../../components/layout/PortalLayout';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import {
  fetchParentChildData,
  saveParentChildData,
  fetchParentFeePayments,
  submitParentFeePayment,
  fetchParentFeedback,
  submitParentFeedback,
  fetchStudentLeaveApplications,
  submitStudentLeaveApplication,
  ParentChildData,
  ParentFeePaymentRecord,
  ParentFeedbackItem,
  StudentLeaveApplication
} from '../../lib/dataService';

export const ParentDashboard: React.FC = () => {
  const { user, profile, updateProfile } = useAuth();
  const parentId = user?.id || profile?.id || 'demo-parent-uid-4';
  const parentName = profile?.full_name || 'Mr. Mohammad Akram';

  // Parent Name Change State
  const [showParentNameModal, setShowParentNameModal] = useState(false);
  const [editParentNameInput, setEditParentNameInput] = useState(parentName);
  const [isSavingParentName, setIsSavingParentName] = useState(false);

  // Child customized data
  const [child, setChild] = useState<ParentChildData>({
    child_name: 'Fatima Bibi',
    roll_number: 'GA-10S-042',
    grade_class: 'Class 10 (Matric Science) • BISE Board',
    section: 'Section Rose',
    blood_group: 'B+',
    emergency_phone: '0302-3456789',
    doctor_note: 'No allergies recorded.'
  });

  // Modals & Forms
  const [showChildModal, setShowChildModal] = useState(false);
  const [editChildName, setEditChildName] = useState('');
  const [editChildRoll, setEditChildRoll] = useState('');
  const [editChildClass, setEditChildClass] = useState('');
  const [editChildSection, setEditChildSection] = useState('');

  // Parent Workspace Tabs
  const [activeTab, setActiveTab] = useState<'leaves' | 'fees' | 'feedback'>('leaves');
  const [leaves, setLeaves] = useState<StudentLeaveApplication[]>([]);
  const [feePayments, setFeePayments] = useState<ParentFeePaymentRecord[]>([]);
  const [feedbacks, setFeedbacks] = useState<ParentFeedbackItem[]>([]);

  // Leave Form
  const [showLeaveModal, setShowLeaveModal] = useState(false);
  const [leaveReason, setLeaveReason] = useState('');
  const [leaveStart, setLeaveStart] = useState('');
  const [leaveEnd, setLeaveEnd] = useState('');

  // Fee Voucher Form
  const [showFeeModal, setShowFeeModal] = useState(false);
  const [invNumber, setInvNumber] = useState('INV-2026-1042');
  const [feeAmount, setFeeAmount] = useState(4500);
  const [bankName, setBankName] = useState('HBL Sector G-11');
  const [slipRef, setSlipRef] = useState('');

  // Feedback Form
  const [showFeedbackModal, setShowFeedbackModal] = useState(false);
  const [fbSubject, setFbSubject] = useState('');
  const [fbMessage, setFbMessage] = useState('');

  const [toastMsg, setToastMsg] = useState<string | null>(null);

  useEffect(() => {
    const data = fetchParentChildData(parentId);
    setChild(data);
    setEditChildName(data.child_name);
    setEditChildRoll(data.roll_number);
    setEditChildClass(data.grade_class);
    setEditChildSection(data.section);

    setLeaves(fetchStudentLeaveApplications(parentId));
    setFeePayments(fetchParentFeePayments(parentId));
    setFeedbacks(fetchParentFeedback(parentId));
  }, [parentId]);

  useEffect(() => {
    setEditParentNameInput(profile?.full_name || 'Mr. Mohammad Akram');
  }, [profile]);

  const handleSaveParentName = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editParentNameInput.trim()) return;
    setIsSavingParentName(true);
    try {
      await updateProfile({ full_name: editParentNameInput.trim() });
      setShowParentNameModal(false);
      setToastMsg(`Guardian name updated to "${editParentNameInput.trim()}" successfully!`);
      setTimeout(() => setToastMsg(null), 3500);
    } catch (err: any) {
      alert('Failed to update guardian name: ' + err.message);
    } finally {
      setIsSavingParentName(false);
    }
  };

  const handleSaveChildData = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editChildName.trim()) return;
    const updated = saveParentChildData(parentId, {
      ...child,
      child_name: editChildName.trim(),
      roll_number: editChildRoll.trim() || child.roll_number,
      grade_class: editChildClass.trim() || child.grade_class,
      section: editChildSection.trim() || child.section
    });
    setChild(updated);
    setShowChildModal(false);
    setToastMsg(`Child profile updated to ${updated.child_name}!`);
    setTimeout(() => setToastMsg(null), 3500);
  };

  const handleApplyLeave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!leaveReason.trim() || !leaveStart) return;
    const created = submitStudentLeaveApplication({
      student_id: parentId,
      student_name: child.child_name,
      reason: leaveReason.trim(),
      start_date: leaveStart,
      end_date: leaveEnd || leaveStart
    });
    setLeaves([created, ...leaves]);
    setLeaveReason('');
    setLeaveStart('');
    setLeaveEnd('');
    setShowLeaveModal(false);
    setToastMsg('Leave request officially submitted to School Principal!');
    setTimeout(() => setToastMsg(null), 3500);
  };

  const handleSubmitFee = (e: React.FormEvent) => {
    e.preventDefault();
    if (!slipRef.trim()) return;
    const created = submitParentFeePayment({
      parent_id: parentId,
      invoice_number: invNumber,
      child_name: child.child_name,
      amount_paid: feeAmount,
      bank_name: bankName,
      slip_reference: slipRef.trim(),
      payment_date: new Date().toISOString().split('T')[0]
    });
    setFeePayments([created, ...feePayments]);
    setSlipRef('');
    setShowFeeModal(false);
    setToastMsg('Fee payment voucher reference submitted for verification!');
    setTimeout(() => setToastMsg(null), 3500);
  };

  const handleSubmitFeedback = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fbSubject.trim() || !fbMessage.trim()) return;
    const created = submitParentFeedback({
      parent_id: parentId,
      parent_name: parentName,
      subject: fbSubject.trim(),
      message: fbMessage.trim()
    });
    setFeedbacks([created, ...feedbacks]);
    setFbSubject('');
    setFbMessage('');
    setShowFeedbackModal(false);
    setToastMsg('Your inquiry has been delivered to Academy Administration.');
    setTimeout(() => setToastMsg(null), 3500);
  };

  return (
    <PortalLayout
      pageTitle="Parent & Guardian Connect"
      pageSubtitle="Supervise scholastic growth, child attendance regularity, and fee clearances"
    >
      <div className="space-y-6">
        
        {/* Toast Notification */}
        {toastMsg && (
          <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 flex items-center gap-2 text-xs font-semibold animate-fade-in">
            <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-400" />
            <span>{toastMsg}</span>
          </div>
        )}

        {/* Welcome Card */}
        <Card className="relative overflow-hidden p-6 sm:p-8 bg-gradient-to-r from-[#141b2e] via-[#121626] to-[#1e132e] border border-[#233559]">
          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 text-[11px] font-semibold mb-2">
                <Users className="w-3.5 h-3.5 text-cyan-400" />
                <span>Guardian Portal • Academic Year 2026-2027</span>
              </div>
              <div className="flex items-center gap-2.5">
                <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
                  Welcome, <span className="text-gradient">{profile?.full_name || parentName}</span>
                </h2>
                <button
                  type="button"
                  onClick={() => {
                    setEditParentNameInput(profile?.full_name || parentName);
                    setShowParentNameModal(true);
                  }}
                  className="p-1.5 rounded-xl border border-cyan-500/30 text-cyan-300 hover:bg-cyan-500/10 transition-colors cursor-pointer"
                  title="Change your guardian display name"
                >
                  <Pencil className="w-4 h-4" />
                </button>
              </div>
              <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-xl">
                Direct guardian portal for <strong className="text-white">{child.child_name}</strong>. Real-time grades, attendance logs, and fee settlement verified by administration.
              </p>
            </div>
            
            <div className="flex flex-wrap items-center gap-3 shrink-0">
              <Button 
                variant="outline" 
                size="sm" 
                leftIcon={<Pencil className="w-3.5 h-3.5 text-cyan-400" />}
                onClick={() => {
                  setEditParentNameInput(profile?.full_name || parentName);
                  setShowParentNameModal(true);
                }}
              >
                Change Guardian Name
              </Button>
              <Link to="/parent/attendance">
                <Button variant="primary" size="sm" rightIcon={<ArrowRight className="w-3.5 h-3.5" />}>
                  Child Attendance
                </Button>
              </Link>
            </div>
          </div>
        </Card>

        {/* Child Overview Card with Customization Button */}
        <Card className="p-6 sm:p-8 bg-[#181827] border-[#2a2a3e]">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-[#2a2a3e]">
            <div className="flex items-center gap-4">
              <img
                src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80"
                alt={child.child_name}
                className="w-16 h-16 rounded-2xl object-cover border-2 border-cyan-500/40 shrink-0"
              />
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-lg sm:text-xl font-bold text-white">{child.child_name}</h3>
                  <Badge variant="cyan">{child.roll_number}</Badge>
                </div>
                <p className="text-xs text-purple-300 font-medium mt-0.5">{child.grade_class} • {child.section}</p>
                <span className="text-[11px] text-emerald-400 font-medium block mt-1 flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" /> First Term Examination — Distinction Standing
                </span>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setEditChildName(child.child_name);
                  setEditChildRoll(child.roll_number);
                  setEditChildClass(child.grade_class);
                  setEditChildSection(child.section);
                  setShowChildModal(true);
                }}
                leftIcon={<Pencil className="w-3.5 h-3.5 text-cyan-400" />}
              >
                Customize Child Info
              </Button>
              <Link to="/parent/results">
                <Button variant="primary" size="sm" leftIcon={<Award className="w-3.5 h-3.5" />}>
                  Progress Report
                </Button>
              </Link>
            </div>
          </div>

          {/* Child Stat Metrics Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-6">
            <div className="p-4 rounded-xl bg-white/[0.02] border border-[#2a2a3e]">
              <span className="text-xs text-slate-400 block">Class Attendance</span>
              <div className="text-2xl font-bold text-white mt-1 flex items-center gap-2">
                96.8%
                <span className="text-[10px] text-emerald-400 font-medium px-2 py-0.5 rounded-full bg-emerald-500/10">Regular</span>
              </div>
              <span className="text-[11px] text-slate-500 mt-0.5 block">0 unexcused absences</span>
            </div>

            <div className="p-4 rounded-xl bg-white/[0.02] border border-[#2a2a3e]">
              <span className="text-xs text-slate-400 block">Cumulative Score</span>
              <div className="text-2xl font-bold text-cyan-400 mt-1">
                478 / 500 (95.6%)
              </div>
              <span className="text-[11px] text-slate-500 mt-0.5 block">Board A+ High Merit</span>
            </div>

            <div className="p-4 rounded-xl bg-white/[0.02] border border-[#2a2a3e]">
              <span className="text-xs text-slate-400 block">Tuition Account</span>
              <div className="text-2xl font-bold text-white mt-1 flex items-center gap-1.5">
                <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                <span className="text-base text-slate-200">Cleared</span>
              </div>
              <span className="text-[11px] text-slate-500 mt-0.5 block">Monthly invoice settled</span>
            </div>
          </div>
        </Card>

        {/* Parent Personalized Self-Service Data Desk */}
        <Card className="p-6 bg-[#181827] border-[#2a2a3e] space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-[#2a2a3e]">
            <div>
              <span className="text-[10px] font-bold text-cyan-400 uppercase tracking-wider">Guardian Self-Service Desk</span>
              <h3 className="text-base sm:text-lg font-bold text-white">Requests, Fee Slips & School Feedback</h3>
            </div>

            <div className="flex items-center gap-1.5 bg-[#12121e] p-1 rounded-xl border border-[#2a2a3e]">
              <button
                type="button"
                onClick={() => setActiveTab('leaves')}
                className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
                  activeTab === 'leaves' ? 'bg-cyan-600 text-white' : 'text-slate-400 hover:text-white'
                }`}
              >
                Leave Requests ({leaves.length})
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('fees')}
                className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
                  activeTab === 'fees' ? 'bg-cyan-600 text-white' : 'text-slate-400 hover:text-white'
                }`}
              >
                Fee Slips ({feePayments.length})
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('feedback')}
                className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
                  activeTab === 'feedback' ? 'bg-cyan-600 text-white' : 'text-slate-400 hover:text-white'
                }`}
              >
                Inquiries & Feedback ({feedbacks.length})
              </button>
            </div>
          </div>

          {/* TAB 1: LEAVE APPLICATIONS */}
          {activeTab === 'leaves' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <p className="text-xs text-slate-400">
                  Submit official leave applications on behalf of your daughter directly to the school principal.
                </p>
                <Button
                  variant="primary"
                  size="sm"
                  onClick={() => setShowLeaveModal(true)}
                  leftIcon={<Plus className="w-3.5 h-3.5" />}
                >
                  Submit Leave for Child
                </Button>
              </div>

              {leaves.length === 0 ? (
                <div className="p-8 text-center text-xs text-slate-500 bg-[#12121e] rounded-xl border border-dashed border-[#2a2a3e]">
                  No leave requests submitted yet.
                </div>
              ) : (
                <div className="space-y-2.5">
                  {leaves.map((l) => (
                    <div
                      key={l.id}
                      className="p-3.5 rounded-xl bg-[#141422] border border-[#2a2a3e] flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
                    >
                      <div>
                        <div className="font-bold text-white flex items-center gap-2">
                          <span>{l.reason}</span>
                          <span className="text-[10px] text-cyan-300">({l.student_name})</span>
                        </div>
                        <div className="text-[11px] text-slate-400 mt-0.5">
                          Date Range: <span className="text-cyan-300 font-mono">{l.start_date}</span> to <span className="text-cyan-300 font-mono">{l.end_date}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className={`px-2.5 py-1 rounded-full text-[10px] font-semibold ${
                          l.status === 'Approved' ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' :
                          l.status === 'Rejected' ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30' :
                          'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                        }`}>
                          {l.status}
                        </span>
                        <span className="text-[10px] text-slate-500">Submitted: {l.submitted_at}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 2: FEE PAYMENTS SLIPS */}
          {activeTab === 'fees' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <p className="text-xs text-slate-400">
                  Notify administration about bank transfers or uploaded tuition deposit receipts.
                </p>
                <Button
                  variant="primary"
                  size="sm"
                  onClick={() => setShowFeeModal(true)}
                  leftIcon={<Plus className="w-3.5 h-3.5" />}
                >
                  Submit Payment Slip
                </Button>
              </div>

              {feePayments.length === 0 ? (
                <div className="p-8 text-center text-xs text-slate-500 bg-[#12121e] rounded-xl border border-dashed border-[#2a2a3e]">
                  No fee receipts recorded.
                </div>
              ) : (
                <div className="space-y-2.5">
                  {feePayments.map((p) => (
                    <div
                      key={p.id}
                      className="p-3.5 rounded-xl bg-[#141422] border border-[#2a2a3e] flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
                    >
                      <div>
                        <div className="font-bold text-white flex items-center gap-2">
                          <span>Invoice {p.invoice_number}</span>
                          <span className="text-emerald-400 font-mono">Rs. {p.amount_paid.toLocaleString()}</span>
                        </div>
                        <div className="text-[11px] text-slate-400 mt-0.5">
                          Bank: {p.bank_name} • Ref: <span className="font-mono text-cyan-300">{p.slip_reference}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className={`px-2.5 py-1 rounded-full text-[10px] font-semibold ${
                          p.status === 'Verified' ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' :
                          'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                        }`}>
                          {p.status}
                        </span>
                        <span className="text-[10px] text-slate-500">{p.payment_date}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 3: FEEDBACK & INQUIRIES */}
          {activeTab === 'feedback' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <p className="text-xs text-slate-400">
                  Send notes, queries, or schedule a parent-teacher consultation meeting.
                </p>
                <Button
                  variant="primary"
                  size="sm"
                  onClick={() => setShowFeedbackModal(true)}
                  leftIcon={<Send className="w-3.5 h-3.5" />}
                >
                  Send Inquiry
                </Button>
              </div>

              {feedbacks.length === 0 ? (
                <div className="p-8 text-center text-xs text-slate-500 bg-[#12121e] rounded-xl border border-dashed border-[#2a2a3e]">
                  No messages submitted.
                </div>
              ) : (
                <div className="space-y-2.5">
                  {feedbacks.map((fb) => (
                    <div
                      key={fb.id}
                      className="p-3.5 rounded-xl bg-[#141422] border border-[#2a2a3e] space-y-1 text-xs"
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-white">{fb.subject}</span>
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                          fb.status === 'Answered' ? 'bg-emerald-500/20 text-emerald-300' : 'bg-cyan-500/20 text-cyan-300'
                        }`}>
                          {fb.status}
                        </span>
                      </div>
                      <p className="text-xs text-slate-300 leading-relaxed">{fb.message}</p>
                      <div className="text-[10px] text-slate-500 pt-1">Date: {fb.submitted_at}</div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </Card>

        {/* Modal: Customize Child Info */}
        {showChildModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
            <div className="w-full max-w-md bg-[#181829] border border-cyan-500/30 rounded-2xl shadow-2xl p-5 space-y-4">
              <div className="flex items-center justify-between border-b border-[#2a2a3e] pb-3">
                <h3 className="text-base font-bold text-white">Customize Linked Child Record</h3>
                <button onClick={() => setShowChildModal(false)} className="text-slate-400 hover:text-white">✕</button>
              </div>

              <form onSubmit={handleSaveChildData} className="space-y-3 text-xs">
                <div>
                  <label className="block text-[11px] font-semibold text-slate-300 mb-1">Daughter / Child Name *</label>
                  <input
                    type="text"
                    required
                    value={editChildName}
                    onChange={(e) => setEditChildName(e.target.value)}
                    className="w-full bg-[#11111d] border border-[#2a2a3e] rounded-xl px-3 py-2 text-white focus:outline-none focus:border-cyan-500"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-300 mb-1">Roll Number</label>
                    <input
                      type="text"
                      value={editChildRoll}
                      onChange={(e) => setEditChildRoll(e.target.value)}
                      className="w-full bg-[#11111d] border border-[#2a2a3e] rounded-xl px-3 py-2 text-white focus:outline-none focus:border-cyan-500"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-300 mb-1">Class / Grade</label>
                    <input
                      type="text"
                      value={editChildClass}
                      onChange={(e) => setEditChildClass(e.target.value)}
                      className="w-full bg-[#11111d] border border-[#2a2a3e] rounded-xl px-3 py-2 text-white focus:outline-none focus:border-cyan-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-300 mb-1">Section</label>
                  <input
                    type="text"
                    value={editChildSection}
                    onChange={(e) => setEditChildSection(e.target.value)}
                    className="w-full bg-[#11111d] border border-[#2a2a3e] rounded-xl px-3 py-2 text-white focus:outline-none focus:border-cyan-500"
                  />
                </div>

                <div className="pt-2 flex justify-end gap-2 border-t border-[#2a2a3e]">
                  <Button variant="outline" size="sm" type="button" onClick={() => setShowChildModal(false)}>
                    Cancel
                  </Button>
                  <Button variant="primary" size="sm" type="submit">
                    Save Child Details
                  </Button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Modal: Submit Leave for Child */}
        {showLeaveModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
            <div className="w-full max-w-md bg-[#181829] border border-[#2a2a3e] rounded-2xl shadow-2xl p-5 space-y-4">
              <div className="flex items-center justify-between border-b border-[#2a2a3e] pb-3">
                <h3 className="text-base font-bold text-white">Apply for Child Leave</h3>
                <button onClick={() => setShowLeaveModal(false)} className="text-slate-400 hover:text-white">✕</button>
              </div>

              <form onSubmit={handleApplyLeave} className="space-y-3 text-xs">
                <div>
                  <label className="block text-[11px] font-semibold text-slate-300 mb-1">Student</label>
                  <input
                    disabled
                    value={child.child_name}
                    className="w-full bg-[#11111d] border border-[#2a2a3e] rounded-xl px-3 py-2 text-slate-400 cursor-not-allowed"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-300 mb-1">Reason for Absence *</label>
                  <textarea
                    required
                    rows={3}
                    placeholder="Enter reason (e.g. sick leave with doctor advice, family travel)..."
                    value={leaveReason}
                    onChange={(e) => setLeaveReason(e.target.value)}
                    className="w-full bg-[#11111d] border border-[#2a2a3e] rounded-xl p-3 text-white focus:outline-none focus:border-cyan-500"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-300 mb-1">From Date *</label>
                    <input
                      type="date"
                      required
                      value={leaveStart}
                      onChange={(e) => setLeaveStart(e.target.value)}
                      className="w-full bg-[#11111d] border border-[#2a2a3e] rounded-xl px-3 py-2 text-white focus:outline-none focus:border-cyan-500"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-300 mb-1">To Date</label>
                    <input
                      type="date"
                      value={leaveEnd}
                      onChange={(e) => setLeaveEnd(e.target.value)}
                      className="w-full bg-[#11111d] border border-[#2a2a3e] rounded-xl px-3 py-2 text-white focus:outline-none focus:border-cyan-500"
                    />
                  </div>
                </div>

                <div className="pt-2 flex justify-end gap-2 border-t border-[#2a2a3e]">
                  <Button variant="outline" size="sm" type="button" onClick={() => setShowLeaveModal(false)}>
                    Cancel
                  </Button>
                  <Button variant="primary" size="sm" type="submit">
                    Submit Application
                  </Button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Modal: Submit Fee Voucher */}
        {showFeeModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
            <div className="w-full max-w-md bg-[#181829] border border-[#2a2a3e] rounded-2xl shadow-2xl p-5 space-y-4">
              <div className="flex items-center justify-between border-b border-[#2a2a3e] pb-3">
                <h3 className="text-base font-bold text-white">Record Fee Payment Voucher</h3>
                <button onClick={() => setShowFeeModal(false)} className="text-slate-400 hover:text-white">✕</button>
              </div>

              <form onSubmit={handleSubmitFee} className="space-y-3 text-xs">
                <div>
                  <label className="block text-[11px] font-semibold text-slate-300 mb-1">Invoice Number</label>
                  <input
                    type="text"
                    required
                    value={invNumber}
                    onChange={(e) => setInvNumber(e.target.value)}
                    className="w-full bg-[#11111d] border border-[#2a2a3e] rounded-xl px-3 py-2 text-white focus:outline-none focus:border-cyan-500"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-300 mb-1">Amount Paid (PKR) *</label>
                    <input
                      type="number"
                      required
                      value={feeAmount}
                      onChange={(e) => setFeeAmount(Number(e.target.value))}
                      className="w-full bg-[#11111d] border border-[#2a2a3e] rounded-xl px-3 py-2 text-white focus:outline-none focus:border-cyan-500"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-300 mb-1">Bank Name / Branch</label>
                    <input
                      type="text"
                      required
                      value={bankName}
                      onChange={(e) => setBankName(e.target.value)}
                      className="w-full bg-[#11111d] border border-[#2a2a3e] rounded-xl px-3 py-2 text-white focus:outline-none focus:border-cyan-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-300 mb-1">Deposit Slip / Transaction Reference *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. HBL-982341-PK or Online Trx ID"
                    value={slipRef}
                    onChange={(e) => setSlipRef(e.target.value)}
                    className="w-full bg-[#11111d] border border-[#2a2a3e] rounded-xl px-3 py-2 text-white focus:outline-none focus:border-cyan-500"
                  />
                </div>

                <div className="pt-2 flex justify-end gap-2 border-t border-[#2a2a3e]">
                  <Button variant="outline" size="sm" type="button" onClick={() => setShowFeeModal(false)}>
                    Cancel
                  </Button>
                  <Button variant="primary" size="sm" type="submit">
                    Submit Verification
                  </Button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Modal: Feedback / Inquiry */}
        {showFeedbackModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
            <div className="w-full max-w-md bg-[#181829] border border-[#2a2a3e] rounded-2xl shadow-2xl p-5 space-y-4">
              <div className="flex items-center justify-between border-b border-[#2a2a3e] pb-3">
                <h3 className="text-base font-bold text-white">Send Message to School Administration</h3>
                <button onClick={() => setShowFeedbackModal(false)} className="text-slate-400 hover:text-white">✕</button>
              </div>

              <form onSubmit={handleSubmitFeedback} className="space-y-3 text-xs">
                <div>
                  <label className="block text-[11px] font-semibold text-slate-300 mb-1">Subject / Query Topic *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Request for Parent-Teacher Meeting"
                    value={fbSubject}
                    onChange={(e) => setFbSubject(e.target.value)}
                    className="w-full bg-[#11111d] border border-[#2a2a3e] rounded-xl px-3 py-2 text-white focus:outline-none focus:border-cyan-500"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-300 mb-1">Detailed Message *</label>
                  <textarea
                    required
                    rows={4}
                    placeholder="Write your note or query to the faculty/administration..."
                    value={fbMessage}
                    onChange={(e) => setFbMessage(e.target.value)}
                    className="w-full bg-[#11111d] border border-[#2a2a3e] rounded-xl p-3 text-white focus:outline-none focus:border-cyan-500"
                  />
                </div>

                <div className="pt-2 flex justify-end gap-2 border-t border-[#2a2a3e]">
                  <Button variant="outline" size="sm" type="button" onClick={() => setShowFeedbackModal(false)}>
                    Cancel
                  </Button>
                  <Button variant="primary" size="sm" type="submit">
                    Send to Principal
                  </Button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Modal: Edit Guardian Full Name */}
        {showParentNameModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
            <div className="w-full max-w-md bg-[#181829] border border-cyan-500/30 rounded-2xl shadow-2xl p-5 space-y-4">
              <div className="flex items-center justify-between border-b border-[#2a2a3e] pb-3">
                <div className="flex items-center gap-2">
                  <Pencil className="w-4 h-4 text-cyan-400" />
                  <h3 className="text-base font-bold text-white">Update Guardian Full Name</h3>
                </div>
                <button 
                  onClick={() => setShowParentNameModal(false)} 
                  className="text-slate-400 hover:text-white"
                >
                  ✕
                </button>
              </div>

              <form onSubmit={handleSaveParentName} className="space-y-4 text-xs">
                <div>
                  <label className="block text-[11px] font-semibold text-slate-300 mb-1">Guardian Full Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Mr. Mohammad Akram"
                    value={editParentNameInput}
                    onChange={(e) => setEditParentNameInput(e.target.value)}
                    className="w-full bg-[#11111d] border border-[#2a2a3e] rounded-xl px-3 py-2.5 text-sm text-white focus:outline-none focus:border-cyan-500"
                  />
                  <p className="text-[10px] text-slate-400 mt-1.5">
                    This updates your guardian profile, school fee communications, and parent-teacher meeting records.
                  </p>
                </div>

                <div className="pt-2 flex justify-end gap-2 border-t border-[#2a2a3e]">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    type="button" 
                    onClick={() => setShowParentNameModal(false)}
                  >
                    Cancel
                  </Button>
                  <Button 
                    variant="primary" 
                    size="sm" 
                    type="submit"
                    isLoading={isSavingParentName}
                    className="bg-cyan-600 hover:bg-cyan-500 text-white"
                  >
                    Save Changes
                  </Button>
                </div>
              </form>
            </div>
          </div>
        )}

      </div>
    </PortalLayout>
  );
};
