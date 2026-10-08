import React, { useState, useEffect } from 'react';
import { PortalLayout } from '../../components/layout/PortalLayout';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { Bell, Clock, Check } from 'lucide-react';
import { fetchNotificationsForRole, markNotificationAsRead } from '../../lib/dataService';
import { Notification } from '../../types';

export const TeacherNotificationsPage: React.FC = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [filter, setFilter] = useState<'all' | 'unread'>('all');

  const loadNotifications = () => {
    fetchNotificationsForRole('teacher').then(setNotifications);
  };

  useEffect(() => {
    loadNotifications();
  }, []);

  const handleMarkRead = async (id: string) => {
    await markNotificationAsRead(id);
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, is_read: true } : n));
  };

  const filtered = filter === 'unread' 
    ? notifications.filter(n => !n.is_read) 
    : notifications;

  return (
    <PortalLayout
      pageTitle="Faculty Notices & Staff Bulletins"
      pageSubtitle="Administrative directives, syllabus deadlines, and academic calendar announcements"
    >
      <div className="max-w-4xl space-y-6">
        {/* Filter bar */}
        <div className="flex items-center justify-between">
          <div className="flex gap-2">
            <button
              onClick={() => setFilter('all')}
              className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-all ${
                filter === 'all' ? 'bg-purple-600 text-white' : 'bg-white/[0.03] text-slate-400 border border-[#2a2a3e]'
              }`}
            >
              All Circulars ({notifications.length})
            </button>
            <button
              onClick={() => setFilter('unread')}
              className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-all ${
                filter === 'unread' ? 'bg-purple-600 text-white' : 'bg-white/[0.03] text-slate-400 border border-[#2a2a3e]'
              }`}
            >
              Unread ({notifications.filter(n => !n.is_read).length})
            </button>
          </div>
        </div>

        {/* Notifications List */}
        <div className="space-y-4">
          {filtered.length === 0 ? (
            <Card className="p-12 text-center text-slate-400">
              <Bell className="w-12 h-12 mx-auto text-slate-600 mb-3" />
              <p>No notifications to display.</p>
            </Card>
          ) : (
            filtered.map((n) => (
              <Card
                key={n.id}
                className={`p-5 border transition-all ${
                  n.is_read ? 'bg-[#181827] border-[#2a2a3e] opacity-80' : 'bg-[#1e1b38] border-purple-500/40 shadow-lg'
                }`}
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="space-y-1.5">
                    <div className="flex items-center gap-2">
                      <h4 className="text-sm font-bold text-white">{n.title}</h4>
                      {!n.is_read && <Badge variant="purple" size="sm">NEW</Badge>}
                    </div>
                    <p className="text-xs text-slate-300 leading-relaxed">{n.message}</p>
                    <span className="text-[10px] text-slate-500 flex items-center gap-1 pt-1">
                      <Clock className="w-3 h-3" /> {new Date(n.created_at || '').toLocaleDateString('en-PK', { day: '2-digit', month: 'short', year: 'numeric' })}
                    </span>
                  </div>

                  {!n.is_read && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleMarkRead(n.id)}
                      leftIcon={<Check className="w-3 h-3 text-purple-400" />}
                    >
                      Mark Read
                    </Button>
                  )}
                </div>
              </Card>
            ))
          )}
        </div>
      </div>
    </PortalLayout>
  );
};
