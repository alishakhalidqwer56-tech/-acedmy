import React, { useState, useEffect } from 'react';
import { PortalLayout } from '../../components/layout/PortalLayout';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { Input } from '../../components/ui/Input';
import { Textarea } from '../../components/ui/Textarea';
import { 
  Bell, 
  Send, 
  Users, 
  CheckCircle2, 
  Clock, 
  Radio, 
  AlertCircle,
  Plus,
  X,
  Pencil,
  Trash2
} from 'lucide-react';
import { fetchNotificationsForRole, sendBroadcastNotification, updateNotification, deleteNotification } from '../../lib/dataService';
import { Notification, UserRole } from '../../types';

export const AdminNotificationsPage: React.FC = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingNotification, setEditingNotification] = useState<Notification | null>(null);
  const [deletingNotification, setDeletingNotification] = useState<Notification | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Form State
  const [title, setTitle] = useState('');
  const [message, setMessage] = useState('');
  const [targetRole, setTargetRole] = useState<'all' | UserRole>('all');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    loadNotifications();
  }, []);

  const loadNotifications = async () => {
    setIsLoading(true);
    try {
      const all = await fetchNotificationsForRole();
      setNotifications(all);
    } finally {
      setIsLoading(false);
    }
  };

  const handleBroadcast = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !message.trim()) return;

    setIsSubmitting(true);
    try {
      await sendBroadcastNotification({
        title,
        message,
        recipient_role: targetRole === 'all' ? undefined : targetRole,
      });

      setToastMessage(`Broadcast successfully dispatched to ${targetRole === 'all' ? 'All Academy Portals' : targetRole.toUpperCase() + 'S'}!`);
      setShowModal(false);
      setTitle('');
      setMessage('');
      await loadNotifications();
      setTimeout(() => setToastMessage(null), 4000);
    } catch (err: any) {
      alert('Error broadcasting: ' + err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const openEdit = (n: Notification) => {
    setEditingNotification(n);
    setTitle(n.title);
    setMessage(n.message);
    setTargetRole((n.recipient_role as any) || 'all');
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingNotification) return;

    setIsSubmitting(true);
    try {
      await updateNotification(editingNotification.id, {
        title,
        message,
        recipient_role: targetRole === 'all' ? null : targetRole
      });

      setToastMessage('Notification updated successfully.');
      setEditingNotification(null);
      await loadNotifications();
      setTimeout(() => setToastMessage(null), 3000);
    } catch (err: any) {
      alert('Error updating notification: ' + err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!deletingNotification) return;
    setIsSubmitting(true);
    try {
      await deleteNotification(deletingNotification.id);
      setToastMessage('Notification removed from broadcast logs.');
      setDeletingNotification(null);
      await loadNotifications();
      setTimeout(() => setToastMessage(null), 3000);
    } finally {
      setIsSubmitting(false);
    }
  };

  const getRecipientBadge = (r?: UserRole | null) => {
    if (!r) return <Badge variant="purple">ALL ACADEMY</Badge>;
    switch (r) {
      case 'student': return <Badge variant="pink">STUDENTS ONLY</Badge>;
      case 'parent': return <Badge variant="cyan">PARENTS ONLY</Badge>;
      case 'teacher': return <Badge variant="emerald">FACULTY ONLY</Badge>;
      case 'admin': return <Badge variant="amber">ADMINS ONLY</Badge>;
    }
  };

  return (
    <PortalLayout
      pageTitle="Campus Broadcasts & Notification Dispatcher"
      pageSubtitle="Broadcast, edit, and manage targeted announcements, examination alerts, and weather advisories"
    >
      <div className="space-y-6">

        {/* Top Header */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-base sm:text-lg font-bold text-white">Institutional Dispatch History</h2>
            <p className="text-xs text-slate-400">Live notices delivered directly to user dashboard navigation bars</p>
          </div>
          <Button
            variant="primary"
            size="sm"
            onClick={() => {
              setTitle('');
              setMessage('');
              setTargetRole('all');
              setShowModal(true);
            }}
            leftIcon={<Radio className="w-4 h-4" />}
          >
            Create New Broadcast
          </Button>
        </div>

        {/* Toast */}
        {toastMessage && (
          <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 flex items-center gap-3 animate-fade-in text-xs font-semibold">
            <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-400" />
            <span>{toastMessage}</span>
          </div>
        )}

        {/* Notifications List */}
        <div className="space-y-3">
          {notifications.map((n) => (
            <Card key={n.id} className="p-4 bg-[#181827] border-[#2a2a3e] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="flex items-start gap-3.5 flex-1">
                <div className="p-2.5 rounded-xl bg-purple-500/10 text-purple-400 border border-purple-500/20 shrink-0 mt-0.5">
                  <Bell className="w-4 h-4" />
                </div>
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    {getRecipientBadge(n.recipient_role)}
                    <span className="text-[10px] text-slate-400 flex items-center gap-1">
                      <Clock className="w-3 h-3" /> {new Date(n.created_at || '').toLocaleDateString()}
                    </span>
                  </div>
                  <h3 className="text-sm font-bold text-white">{n.title}</h3>
                  <p className="text-xs text-slate-300 max-w-2xl">{n.message}</p>
                </div>
              </div>

              <div className="flex items-center gap-2 self-end sm:self-center">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[10px] font-semibold">
                  <CheckCircle2 className="w-3 h-3" /> Dispatched
                </span>
                <button
                  onClick={() => openEdit(n)}
                  className="p-1.5 rounded-lg border border-purple-500/30 text-purple-300 hover:bg-purple-500/10 transition-colors"
                  title="Edit notification"
                >
                  <Pencil className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => setDeletingNotification(n)}
                  className="p-1.5 rounded-lg border border-rose-500/30 text-rose-400 hover:bg-rose-500/10 transition-colors"
                  title="Delete notification"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </Card>
          ))}
        </div>

        {/* Modal: Dispatch Broadcast */}
        {showModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
            <div className="w-full max-w-lg bg-[#181829] border border-[#2a2a3e] rounded-2xl shadow-2xl overflow-hidden">
              <div className="p-5 border-b border-[#2a2a3e] flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Radio className="w-5 h-5 text-purple-400" />
                  <h3 className="text-base font-bold text-white">Broadcast Campus Announcement</h3>
                </div>
                <button
                  onClick={() => setShowModal(false)}
                  className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-white/5"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleBroadcast} className="p-5 space-y-4 text-xs">
                <div>
                  <label className="block text-[11px] font-semibold text-slate-300 mb-1">Target Portal Audience *</label>
                  <select
                    value={targetRole}
                    onChange={(e) => setTargetRole(e.target.value as any)}
                    className="w-full bg-[#11111d] border border-[#2a2a3e] text-white text-xs rounded-xl px-3 py-2.5 focus:outline-none focus:border-purple-500"
                  >
                    <option value="all">Broadcast to Entire Campus (Students, Parents, Teachers)</option>
                    <option value="student">Registered Scholars Only</option>
                    <option value="parent">Parents & Legal Guardians Only</option>
                    <option value="teacher">Faculty Teachers & Chairs Only</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-300 mb-1">Notice Headline *</label>
                  <Input
                    required
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="e.g. Schedule for Mid-Term STEM Practical Exhibitions"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-300 mb-1">Broadcast Message Body *</label>
                  <Textarea
                    required
                    rows={4}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Provide details regarding timings, room assignments, or instructions..."
                  />
                </div>

                <div className="pt-3 flex items-center justify-end gap-2 border-t border-[#2a2a3e]">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => setShowModal(false)}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    variant="primary"
                    size="sm"
                    isLoading={isSubmitting}
                    leftIcon={<Send className="w-4 h-4" />}
                  >
                    Dispatch Live Broadcast
                  </Button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Modal: Edit Broadcast */}
        {editingNotification && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
            <div className="w-full max-w-lg bg-[#181829] border border-[#2a2a3e] rounded-2xl shadow-2xl overflow-hidden">
              <div className="p-5 border-b border-[#2a2a3e] flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Pencil className="w-5 h-5 text-purple-400" />
                  <h3 className="text-base font-bold text-white">Edit Announcement</h3>
                </div>
                <button
                  onClick={() => setEditingNotification(null)}
                  className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-white/5"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleUpdate} className="p-5 space-y-4 text-xs">
                <div>
                  <label className="block text-[11px] font-semibold text-slate-300 mb-1">Target Portal Audience *</label>
                  <select
                    value={targetRole}
                    onChange={(e) => setTargetRole(e.target.value as any)}
                    className="w-full bg-[#11111d] border border-[#2a2a3e] text-white text-xs rounded-xl px-3 py-2.5 focus:outline-none focus:border-purple-500"
                  >
                    <option value="all">Broadcast to Entire Campus (Students, Parents, Teachers)</option>
                    <option value="student">Registered Scholars Only</option>
                    <option value="parent">Parents & Legal Guardians Only</option>
                    <option value="teacher">Faculty Teachers & Chairs Only</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-300 mb-1">Notice Headline *</label>
                  <Input
                    required
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-300 mb-1">Broadcast Message Body *</label>
                  <Textarea
                    required
                    rows={4}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                  />
                </div>

                <div className="pt-3 flex items-center justify-end gap-2 border-t border-[#2a2a3e]">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => setEditingNotification(null)}
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

        {/* Modal: Delete Broadcast */}
        {deletingNotification && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
            <div className="w-full max-w-sm bg-[#181829] border border-rose-500/40 rounded-2xl shadow-2xl p-6 text-center space-y-4">
              <div className="w-12 h-12 rounded-full bg-rose-500/20 text-rose-400 flex items-center justify-center mx-auto border border-rose-500/30">
                <Trash2 className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-base font-bold text-white">Delete Broadcast?</h3>
                <p className="text-xs text-slate-400 mt-1">
                  Are you sure you want to remove <span className="text-white font-semibold">"{deletingNotification.title}"</span> from portal history?
                </p>
              </div>
              <div className="flex items-center justify-center gap-3 pt-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setDeletingNotification(null)}
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
