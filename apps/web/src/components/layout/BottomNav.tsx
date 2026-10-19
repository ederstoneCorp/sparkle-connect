import React from 'react';
import { useSparkle } from '../../context/SparkleContext';
import { Flame, Briefcase, Users, Calendar, MessageSquare, BookOpen } from 'lucide-react';

export const BottomNav: React.FC = () => {
  const { activeTab, setActiveTab, unreadMessagesCount } = useSparkle();

  const tabs = [
    { id: 'feed' as const, label: 'Feed', icon: Flame },
    { id: 'gigs' as const, label: 'Gigs', icon: Briefcase },
    { id: 'communities' as const, label: 'Clubs', icon: Users },
    { id: 'academics' as const, label: 'Academia', icon: BookOpen },
    { id: 'events' as const, label: 'Events', icon: Calendar },
    { id: 'messages' as const, label: 'Messages', icon: MessageSquare, badge: unreadMessagesCount },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 md:hidden bg-white dark:bg-sparkle-darkSurface border-t border-slate-200 dark:border-slate-700 px-2 pb-safe flex items-center justify-around shadow-lg">
      {tabs.map((tab) => {
        const Icon = tab.icon;
        const isActive = activeTab === (tab.id as string);
        return (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`flex flex-col items-center gap-0.5 py-2.5 px-2 rounded-xl transition-all flex-1 relative ${
              isActive
                ? 'text-sparkle-purple'
                : 'text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300'
            }`}
          >
            <Icon className={`w-5 h-5 ${isActive ? 'scale-110' : ''} transition-transform`} />
            <span className={`text-[9px] font-bold tracking-tight ${isActive ? 'text-sparkle-purple' : ''}`}>
              {tab.label}
            </span>
            {tab.badge && tab.badge > 0 && (
              <span className="absolute top-1.5 right-2 w-3.5 h-3.5 rounded-full bg-sparkle-orange text-white text-[8px] font-black flex items-center justify-center">
                {tab.badge}
              </span>
            )}
            {isActive && (
              <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-4 h-0.5 rounded-full bg-sparkle-purple" />
            )}
          </button>
        );
      })}
    </nav>
  );
};
