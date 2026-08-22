import React, { useEffect, useState } from 'react';
import api from '../services/api';
import { X, Bell, CheckCircle2, Clock } from 'lucide-react';

const NotificationDrawer = ({ open, onClose }) => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (open) {
      fetchNotifications();
    }
  }, [open]);

  const fetchNotifications = async () => {
    try {
      setLoading(true);
      const res = await api.get('/notifications');
      setNotifications(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleMarkAsRead = async (id) => {
    try {
      await api.put(`/notifications/${id}/read`);
      setNotifications(notifications.map(n => n.id === id ? { ...n, read: true } : n));
    } catch (err) {
      console.error(err);
    }
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-slate-900/40 backdrop-blur-xs flex justify-end">
      <div className="w-full max-w-md bg-white h-full shadow-2xl flex flex-col animate-in slide-in-from-right duration-200">
        <div className="p-4 border-b border-slate-200 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Bell className="w-5 h-5 text-blue-600" />
            <h3 className="font-bold text-slate-800">Notifications</h3>
          </div>
          <button onClick={onClose} className="p-1 rounded-lg text-slate-400 hover:bg-slate-100">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {loading ? (
            <p className="text-sm text-slate-500 text-center py-8">Loading notifications...</p>
          ) : notifications.length === 0 ? (
            <div className="text-center py-12">
              <Bell className="w-10 h-10 text-slate-300 mx-auto mb-2" />
              <p className="text-sm text-slate-500 font-medium">No new notifications</p>
            </div>
          ) : (
            notifications.map((n) => {
              const isRead = n.read ?? n.isRead ?? false;
              return (
                <div
                  key={n.id}
                  onClick={() => !isRead && handleMarkAsRead(n.id)}
                  className={`p-3.5 rounded-2xl border transition-all cursor-pointer ${
                    isRead ? 'bg-slate-50 border-slate-200 text-slate-500' : 'bg-blue-50/50 border-blue-200 text-slate-800 font-medium'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2 mb-1">
                    <span className="text-sm font-semibold">{n.title}</span>
                    {!isRead && <span className="w-2 h-2 rounded-full bg-blue-600"></span>}
                  </div>
                <p className="text-xs text-slate-600 mb-2 leading-relaxed">{n.message}</p>
                <div className="flex items-center gap-1 text-[10px] text-slate-400">
                  <Clock className="w-3 h-3" /> {new Date(n.createdAt).toLocaleString()}
                </div>
              </div>
            );
          })
          )}
        </div>
      </div>
    </div>
  );
};

export default NotificationDrawer;
