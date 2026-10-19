import React from 'react';
import { useSparkle } from '../../context/SparkleContext';
import {
  Flame,
  Briefcase,
  Users,
  Calendar,
  MessageSquare,
  ShieldCheck,
  TrendingUp,
  MapPin,
} from 'lucide-react';

interface SidebarProps {
  onOpenCreatePost: () => void;
  onOpenCreateGig: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ onOpenCreatePost, onOpenCreateGig }) => {
  const {
    activeTab,
    setActiveTab,
    unreadMessagesCount,
    currentUser,
    selectedUniversityId,
    universities,
    setSelectedUniversityId,
  } = useSparkle();

  const navItems = [
    {
      id: 'feed' as const,
      label: 'Campus Feed',
      icon: Flame,
      badge: null,
      description: 'Trending news & confessions',
    },
    {
      id: 'gigs' as const,
      label: 'Student Gigs',
      icon: Briefcase,
      badge: 'KES Earn',
      badgeColor: 'bg-emerald-50 text-emerald-700 border-emerald-200',
      description: 'Earn KES freelancing',
    },
    {
      id: 'communities' as const,
      label: 'Communities',
      icon: Users,
      badge: null,
      description: 'Campus clubs & circles',
    },
    {
      id: 'events' as const,
      label: 'Events & Meetups',
      icon: Calendar,
      badge: null,
      description: 'Hackathons & summits',
    },
    {
      id: 'messages' as const,
      label: 'Messages',
      icon: MessageSquare,
      badge: unreadMessagesCount > 0 ? `${unreadMessagesCount}` : null,
      badgeColor: 'bg-sparkle-purple text-white',
      description: 'Direct comrade chats',
    },
  ];

  const currentUniv = universities.find((u) => u.id === selectedUniversityId);

  return (
    <aside className="w-64 shrink-0 hidden md:flex flex-col gap-6 sticky top-20 self-start">
      {/* Navigation Links */}
      <nav className="bg-white rounded-2xl border border-slate-200/80 p-3 shadow-xs space-y-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;

          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center justify-between px-3.5 py-3 rounded-xl font-medium transition-all text-left ${
                isActive
                  ? 'bg-sparkle-purple text-white shadow-md shadow-sparkle-purple/20'
                  : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
              }`}
            >
              <div className="flex items-center gap-3">
                <Icon className={`w-5 h-5 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                <div>
                  <span className="text-sm font-bold block leading-tight">{item.label}</span>
                  <span className={`text-[11px] block leading-tight ${isActive ? 'text-white/80' : 'text-slate-400'}`}>
                    {item.description}
                  </span>
                </div>
              </div>

              {item.badge && (
                <span
                  className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                    item.badgeColor || 'bg-slate-100 text-slate-700 border-slate-200'
                  }`}
                >
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </nav>

      {/* Quick Action Buttons */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-4 shadow-xs space-y-2.5">
        <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">Quick Actions</h4>
        <button
          onClick={onOpenCreatePost}
          className="w-full py-2.5 px-3 rounded-xl bg-gradient-to-r from-sparkle-purple to-sparkle-purple-dark text-white font-bold text-xs flex items-center justify-center gap-2 hover:shadow-md hover:shadow-sparkle-purple/20 transition-all"
        >
          <Flame className="w-4 h-4" />
          <span>New Campus Post</span>
        </button>

        <button
          onClick={onOpenCreateGig}
          className="w-full py-2.5 px-3 rounded-xl bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100 font-bold text-xs flex items-center justify-center gap-2 transition-all"
        >
          <Briefcase className="w-4 h-4 text-emerald-600" />
          <span>Post a Student Gig</span>
        </button>
      </div>

      {/* University Scope Badge */}
      <div className="bg-gradient-to-br from-slate-900 to-slate-800 text-white rounded-2xl p-4 shadow-sm relative overflow-hidden">
        <div className="absolute right-0 top-0 translate-x-3 -translate-y-3 opacity-10 text-white">
          <TrendingUp className="w-28 h-28" />
        </div>
        <div className="flex items-center gap-2 text-sparkle-mint text-xs font-bold uppercase tracking-wider mb-1">
          <ShieldCheck className="w-4 h-4" />
          <span>Verified Network</span>
        </div>
        <h5 className="font-extrabold text-sm mb-1">
          {currentUniv ? currentUniv.name : 'All Kenyan Universities'}
        </h5>
        <p className="text-xs text-slate-300 leading-relaxed mb-3">
          Join verified peers across UoN, KU, Strathmore, JKUAT, Egerton, and more.
        </p>
        <div className="flex items-center justify-between text-[11px] text-slate-400 border-t border-slate-700/60 pt-2.5">
          <span className="flex items-center gap-1">
            <MapPin className="w-3.5 h-3.5 text-sparkle-orange" /> Kenya Hub
          </span>
          <span className="font-mono text-sparkle-mint">100% Student-First</span>
        </div>
      </div>
    </aside>
  );
};
