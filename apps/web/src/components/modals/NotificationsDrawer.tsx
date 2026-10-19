import React from 'react';
import { useSparkle } from '../../context/SparkleContext';
import { X, Bell, CheckCheck, Briefcase, MessageSquare, Flame } from 'lucide-react';

export const NotificationsDrawer: React.FC = () => {
  const {
    isNotificationsOpen,
    setIsNotificationsOpen,
    notifications,
    markNotificationAsRead,
    markAllNotificationsAsRead,
    unreadNotificationsCount,
  } = useSparkle();

  if (!isNotificationsOpen) return null;

  const getIcon = (type: string) => {
    switch (type) {
      case 'GIG_APPLICATION':
        return <Briefcase className="w-4 h-4 text-emerald-600" />;
      case 'MESSAGE':
        return <MessageSquare className="w-4 h-4 text-sparkle-blue" />;
      default:
        return <Flame className="w-4 h-4 text-sparkle-purple" />;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-slate-900/40 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="w-full max-w-sm bg-white h-full shadow-2xl flex flex-col border-l border-slate-200 animate-in slide-in-from-right duration-200">
        
        {/* Drawer Header */}
        <div className="p-4 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Bell className="w-5 h-5 text-sparkle-purple" />
            <h3 className="font-extrabold text-sm text-slate-900">Notifications</h3>
            {unreadNotificationsCount > 0 && (
              <span className="text-xs px-2 py-0.5 rounded-full bg-sparkle-purple text-white font-bold">
                {unreadNotificationsCount} new
              </span>
            )}
          </div>
          <div className="flex items-center gap-1">
            {unreadNotificationsCount > 0 && (
              <button
                onClick={markAllNotificationsAsRead}
                title="Mark all as read"
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
              >
                <CheckCheck className="w-4 h-4" />
              </button>
            )}
            <button
              onClick={() => setIsNotificationsOpen(false)}
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Notifications List */}
        <div className="flex-1 overflow-y-auto p-3 space-y-2">
          {notifications.length === 0 ? (
            <div className="py-12 text-center text-slate-400 text-xs">
              No notifications yet. You're all caught up!
            </div>
          ) : (
            notifications.map((n) => (
              <div
                key={n.id}
                onClick={() => markNotificationAsRead(n.id)}
                className={`p-3 rounded-2xl border transition-all cursor-pointer ${
                  n.isRead
                    ? 'bg-white border-slate-100 text-slate-600'
                    : 'bg-indigo-50/50 border-indigo-100 text-slate-900 shadow-xs'
                }`}
              >
                <div className="flex items-start gap-2.5">
                  <div className="p-2 rounded-xl bg-white shadow-xs border border-slate-100">
                    {getIcon(n.type)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-1">
                      <p className="text-xs font-bold truncate">{n.title}</p>
                      <span className="text-[10px] text-slate-400 shrink-0">{n.timestamp || n.timeAgo}</span>
                    </div>
                    <p className="text-xs text-slate-600 mt-0.5 leading-relaxed font-medium">
                      {n.body}
                    </p>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

      </div>
    </div>
  );
};
