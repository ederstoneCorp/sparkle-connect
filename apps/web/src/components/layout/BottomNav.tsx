import React from 'react';
import { useSparkle } from '../../context/SparkleContext';
import {
  Flame,
  Briefcase,
  Users,
  Calendar,
  MessageSquare,
} from 'lucide-react';

export const BottomNav: React.FC = () => {
  const { activeTab, setActiveTab, unreadMessagesCount } = useSparkle();

  const navItems = [
    { id: 'feed' as const, label: 'Feed', icon: Flame },
    { id: 'gigs' as const, label: 'Gigs', icon: Briefcase },
    { id: 'communities' as const, label: 'Clubs', icon: Users },
    { id: 'events' as const, label: 'Events', icon: Calendar },
    {
      id: 'messages' as const,
      label: 'Chats',
      icon: MessageSquare,
      badge: unreadMessagesCount > 0 ? unreadMessagesCount : null,
    },
  ];

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-lg border-t border-slate-200/90 shadow-lg px-2 py-1 flex items-center justify-around safe-bottom">
      {navItems.map((item) => {
        const Icon = item.icon;
        const isActive = activeTab === item.id;

        return (
          <button
            key={item.id}
            onClick={() => setActiveTab(item.id)}
            className={`flex flex-col items-center justify-center flex-1 py-1.5 transition-colors relative ${
              isActive ? 'text-sparkle-purple font-bold' : 'text-slate-500 hover:text-slate-700'
            }`}
          >
            <div className="relative">
              <Icon className={`w-5 h-5 ${isActive ? 'stroke-[2.5px]' : 'stroke-2'}`} />
              {item.badge && (
                <span className="absolute -top-1.5 -right-2 bg-sparkle-purple text-white text-[9px] font-black w-4 h-4 rounded-full flex items-center justify-center">
                  {item.badge}
                </span>
              )}
            </div>
            <span className="text-[11px] mt-0.5 tracking-tight">{item.label}</span>
          </button>
        );
      })}
    </nav>
  );
};
