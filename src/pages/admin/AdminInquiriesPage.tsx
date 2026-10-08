import React, { useState, useEffect } from 'react';
import { PortalLayout } from '../../components/layout/PortalLayout';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { 
  MessageSquare, 
  Search, 
  Trash2, 
  CheckCircle2, 
  Phone, 
  Mail, 
  Clock, 
  ExternalLink,
  User,
  Filter,
  Check,
  RefreshCw
} from 'lucide-react';
import { fetchChatInquiries, updateChatInquiryStatus, deleteChatInquiry } from '../../lib/dataService';
import { ChatInquiry } from '../../types';

export const AdminInquiriesPage: React.FC = () => {
  const [inquiries, setInquiries] = useState<ChatInquiry[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<'all' | 'new' | 'contacted' | 'resolved'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [deletingInquiry, setDeletingInquiry] = useState<ChatInquiry | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [isUpdating, setIsUpdating] = useState(false);

  useEffect(() => {
    loadInquiries();
  }, []);

  const loadInquiries = async () => {
    setLoading(true);
    try {
      const data = await fetchChatInquiries();
      setInquiries(data);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (id: string, newStatus: ChatInquiry['status']) => {
    setIsUpdating(true);
    try {
      await updateChatInquiryStatus(id, newStatus);
      setToastMessage(`Inquiry marked as ${newStatus.toUpperCase()}.`);
      setInquiries(prev => prev.map(i => i.id === id ? { ...i, status: newStatus } : i));
      setTimeout(() => setToastMessage(null), 3000);
    } finally {
      setIsUpdating(false);
    }
  };

  const handleDelete = async () => {
    if (!deletingInquiry) return;
    setIsUpdating(true);
    try {
      await deleteChatInquiry(deletingInquiry.id);
      setToastMessage(`Inquiry from ${deletingInquiry.name} deleted.`);
      setDeletingInquiry(null);
      await loadInquiries();
      setTimeout(() => setToastMessage(null), 3000);
    } finally {
      setIsUpdating(false);
    }
  };

  const filtered = inquiries.filter(item => {
    const matchesStatus = statusFilter === 'all' || item.status === statusFilter;
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          item.contact.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          item.message.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const getStatusBadge = (s: string) => {
    switch (s) {
      case 'new': return <Badge variant="pink">NEW INQUIRY</Badge>;
      case 'contacted': return <Badge variant="cyan">CONTACTED</Badge>;
      case 'resolved': return <Badge variant="emerald">RESOLVED</Badge>;
      default: return <Badge variant="purple">{s.toUpperCase()}</Badge>;
    }
  };

  return (
    <PortalLayout
      pageTitle="Client Chatbot Inquiries & Lead Management"
      pageSubtitle="Questions and callback requests submitted by prospective parents and scholars through the Academy AI Chatbot"
    >
      <div className="space-y-6">

        {/* Top Control Bar */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3 flex-1 max-w-lg">
            <div className="relative flex-1">
              <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Search by client name, phone, email, or question..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-[#181827] border border-[#2a2a3e] rounded-xl pl-10 pr-4 py-2 text-xs text-white placeholder-slate-400 focus:outline-none focus:border-purple-500"
              />
            </div>

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as any)}
              className="bg-[#181827] border border-[#2a2a3e] text-white text-xs rounded-xl px-3 py-2 focus:outline-none focus:border-purple-500"
            >
              <option value="all">All Inquiries ({inquiries.length})</option>
              <option value="new">New ({inquiries.filter(i => i.status === 'new').length})</option>
              <option value="contacted">Contacted ({inquiries.filter(i => i.status === 'contacted').length})</option>
              <option value="resolved">Resolved ({inquiries.filter(i => i.status === 'resolved').length})</option>
            </select>
          </div>

          <Button
            variant="outline"
            size="sm"
            onClick={loadInquiries}
            leftIcon={<RefreshCw className="w-3.5 h-3.5" />}
          >
            Refresh List
          </Button>
        </div>

        {/* Toast */}
        {toastMessage && (
          <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 flex items-center gap-3 animate-fade-in text-xs font-semibold">
            <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-400" />
            <span>{toastMessage}</span>
          </div>
        )}

        {/* Inquiries Table */}
        <Card className="p-0 overflow-hidden bg-[#181827] border-[#2a2a3e]">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#12121f] text-slate-400 uppercase tracking-wider text-[10px] border-b border-[#2a2a3e]">
                <tr>
                  <th className="p-4 font-semibold">Client / Parent</th>
                  <th className="p-4 font-semibold">Contact Info</th>
                  <th className="p-4 font-semibold">Question / Inquiry Details</th>
                  <th className="p-4 font-semibold">Received</th>
                  <th className="p-4 font-semibold text-center">Status</th>
                  <th className="p-4 font-semibold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#2a2a3e]">
                {filtered.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="text-center py-12 text-slate-500">
                      No client chatbot inquiries found matching this search.
                    </td>
                  </tr>
                ) : (
                  filtered.map((item) => (
                    <tr key={item.id} className="hover:bg-white/[0.02] transition-colors">
                      <td className="p-4">
                        <div className="flex items-center gap-2.5">
                          <div className="w-8 h-8 rounded-full bg-purple-500/20 text-purple-400 flex items-center justify-center font-bold text-xs shrink-0">
                            {item.name.charAt(0)}
                          </div>
                          <span className="font-bold text-white block">{item.name}</span>
                        </div>
                      </td>
                      <td className="p-4">
                        <div className="flex items-center gap-2">
                          <span className="text-slate-200 font-mono text-[11px]">{item.contact}</span>
                          <a
                            href={item.contact.includes('@') ? `mailto:${item.contact}` : `tel:${item.contact}`}
                            className="p-1 rounded bg-white/5 hover:bg-purple-600/20 text-purple-400 transition-colors"
                            title="Direct Contact"
                          >
                            <ExternalLink className="w-3 h-3" />
                          </a>
                        </div>
                      </td>
                      <td className="p-4 max-w-xs">
                        <p className="text-slate-300 text-xs leading-relaxed line-clamp-2" title={item.message}>
                          "{item.message}"
                        </p>
                      </td>
                      <td className="p-4 text-slate-400 text-[11px] whitespace-nowrap">
                        {item.created_at ? new Date(item.created_at).toLocaleDateString() : 'Recent'}
                      </td>
                      <td className="p-4 text-center">
                        {getStatusBadge(item.status)}
                      </td>
                      <td className="p-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          {item.status !== 'contacted' && (
                            <button
                              onClick={() => handleStatusChange(item.id, 'contacted')}
                              className="px-2 py-1 rounded-lg border border-cyan-500/30 text-cyan-300 hover:bg-cyan-500/10 text-[11px] font-semibold transition-colors"
                              title="Mark as contacted"
                            >
                              Contacted
                            </button>
                          )}
                          {item.status !== 'resolved' && (
                            <button
                              onClick={() => handleStatusChange(item.id, 'resolved')}
                              className="px-2 py-1 rounded-lg border border-emerald-500/30 text-emerald-300 hover:bg-emerald-500/10 text-[11px] font-semibold transition-colors"
                              title="Mark as resolved"
                            >
                              Resolve
                            </button>
                          )}
                          <button
                            onClick={() => setDeletingInquiry(item)}
                            className="p-1.5 rounded-lg border border-rose-500/30 text-rose-400 hover:bg-rose-500/10 transition-colors"
                            title="Delete inquiry"
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
        </Card>

        {/* Modal: Delete Inquiry Confirmation */}
        {deletingInquiry && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
            <div className="w-full max-w-sm bg-[#181829] border border-rose-500/40 rounded-2xl shadow-2xl p-6 text-center space-y-4">
              <div className="w-12 h-12 rounded-full bg-rose-500/20 text-rose-400 flex items-center justify-center mx-auto border border-rose-500/30">
                <Trash2 className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-base font-bold text-white">Delete Client Inquiry?</h3>
                <p className="text-xs text-slate-400 mt-1">
                  Are you sure you want to delete inquiry from <span className="text-white font-semibold">{deletingInquiry.name}</span>?
                </p>
              </div>
              <div className="flex items-center justify-center gap-3 pt-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setDeletingInquiry(null)}
                >
                  Cancel
                </Button>
                <Button
                  variant="primary"
                  size="sm"
                  className="bg-rose-600 hover:bg-rose-700 text-white"
                  isLoading={isUpdating}
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
