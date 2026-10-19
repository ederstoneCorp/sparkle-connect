import React from 'react';
import { useSparkle } from '../../context/SparkleContext';
import {
  Sparkles,
  Bell,
  Search,
  School,
  LogIn,
  ChevronDown,
} from 'lucide-react';

export const Navbar: React.FC = () => {
  const {
    currentUser,
    universities,
    selectedUniversityId,
    setSelectedUniversityId,
    setIsAuthModalOpen,
    setIsProfileModalOpen,
    setIsNotificationsOpen,
    unreadNotificationsCount,
  } = useSparkle();

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200/80 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        
        {/* Brand / Logo */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-sparkle-purple to-sparkle-pink flex items-center justify-center text-white shadow-md shadow-sparkle-purple/20">
            <Sparkles className="w-5 h-5 animate-pulse" />
          </div>
          <div className="hidden sm:block">
            <div className="flex items-center gap-1.5">
              <span className="font-extrabold text-xl tracking-tight bg-gradient-to-r from-sparkle-purple via-sparkle-purple-light to-sparkle-pink bg-clip-text text-transparent">
                Sparkle Connect
              </span>
              <span className="text-xs px-1.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 font-semibold border border-emerald-200">
                🇰🇪 KE
              </span>
            </div>
            <p className="text-[11px] text-slate-500 font-medium -mt-0.5">
              Kenyan University Campus Network & Gigs
            </p>
          </div>
        </div>

        {/* University Filter Selector */}
        <div className="flex-1 max-w-xs md:max-w-sm hidden md:flex items-center gap-2">
          <div className="relative w-full">
            <School className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            <select
              value={selectedUniversityId}
              onChange={(e) => setSelectedUniversityId(e.target.value)}
              className="w-full pl-9 pr-8 py-2 text-xs font-semibold text-slate-700 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-sparkle-purple/30 transition-all cursor-pointer appearance-none"
            >
              <option value="ALL">All Kenyan Campuses</option>
              {universities.map((u) => (
                <option key={u.id} value={u.id}>
                  {u.shortName} • {u.name}
                </option>
              ))}
            </select>
            <ChevronDown className="w-4 h-4 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>
        </div>

        {/* Right Action Icons & Profile */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Notifications Button */}
          <button
            onClick={() => setIsNotificationsOpen(true)}
            aria-label="Open notifications"
            className="relative p-2 text-slate-600 hover:text-sparkle-purple hover:bg-slate-100 rounded-xl transition-colors"
          >
            <Bell className="w-5 h-5" />
            {unreadNotificationsCount > 0 && (
              <span className="absolute top-1.5 right-1.5 w-4 h-4 rounded-full bg-sparkle-orange text-white text-[10px] font-bold flex items-center justify-center animate-bounce">
                {unreadNotificationsCount}
              </span>
            )}
          </button>

          {/* User Profile / Auth Button */}
          {currentUser ? (
            <button
              onClick={() => setIsProfileModalOpen(true)}
              className="flex items-center gap-2.5 pl-2 pr-3 py-1.5 rounded-full hover:bg-slate-100 border border-slate-200 transition-all text-left"
            >
              <img
                src={currentUser.avatarUrl || 'https://api.dicebear.com/7.x/avataaars/svg?seed=sparkle'}
                alt={currentUser.displayName}
                className="w-7 h-7 rounded-full bg-slate-200 ring-2 ring-sparkle-purple/20 object-cover"
              />
              <div className="hidden lg:block text-left">
                <p className="text-xs font-bold text-slate-800 leading-none truncate max-w-[120px]">
                  {currentUser.displayName}
                </p>
                <p className="text-[10px] text-sparkle-purple font-medium leading-tight">
                  {currentUser.university.shortName}
                </p>
              </div>
            </button>
          ) : (
            <button
              onClick={() => setIsAuthModalOpen(true)}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-sparkle-purple to-sparkle-purple-dark hover:shadow-md hover:shadow-sparkle-purple/25 transition-all"
            >
              <LogIn className="w-4 h-4" />
              <span>Sign In</span>
            </button>
          )}
        </div>

      </div>
    </header>
  );
};
