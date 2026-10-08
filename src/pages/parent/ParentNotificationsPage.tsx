import React, { useState, useEffect } from 'react';
import { PortalLayout } from '../../components/layout/PortalLayout';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { Bell, Clock, Check } from 'lucide-react';
import { fetchNotificationsForRole, markNotificationAsRead } from '../../lib/dataService';
import { Notification } from '../../types';

export const ParentNotificationsPage: React.FC = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);

  useEffect(() => {
    fetchNotificationsForRole('parent').then(setNotifications);
  }, []);

  const handleMarkRead = async (id: string) => {
    await markNotificationAsRead(id);
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, is_read: true } : n));
  };

  return (
    <PortalLayout
      pageTitle="Guardian Advisories & Circulars"
      pageSubtitle="Campus updates, examination calendars, and consultation bulletins"
    >
      <div className="max-w-4xl space-y-4">
        {notifications.map((n) => (
          <Card
            key={n.id}
            className={`p-5 border transition-all ${
              n.is_read ? 'bg-[#181827] border-[#2a2a3e] opacity-80' : 'bg-[#1a1f33] border-cyan-500/40 shadow-lg'
            }`}
          >
            <div className="flex items-start justify-between gap-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <h4 className="text-sm font-bold text-white">{n.title}</h4>
                  {!n.is_read && <Badge variant="cyan" size="sm">NEW</Badge>}
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">{n.message}</p>
                <span className="text-[10px] text-slate-500 flex items-center gap-1 pt-1">
                  <Clock className="w-3 h-3" /> {new Date(n.created_at || '').toLocaleDateString()}
                </span>
              </div>

              {!n.is_read && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleMarkRead(n.id)}
                  leftIcon={<Check className="w-3 h-3 text-cyan-400" />}
                >
                  Mark Read
                </Button>
              )}
            </div>
          </Card>
        ))}
      </div>
    </PortalLayout>
  );
};
