import React from 'react';
import { useSparkle } from '../../context/SparkleContext';
import { useTheme } from '../../context/ThemeContext';
import {
  Sparkles,
  Bell,
  School,
  LogIn,
  ChevronDown,
  Sun,
  Moon,
  LogOut,
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
    signOut,
  } = useSparkle();
  const { isDark, toggleTheme } = useTheme();

  return (
    <header className="sticky top-0 z-40 bg-white/95 dark:bg-sparkle-darkSurface/95 backdrop-blur-md border-b border-slate-200/80 dark:border-slate-700/60 shadow-xs animate-slide-down">
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
              <span className="text-xs px-1.5 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 font-semibold border border-emerald-200 dark:border-emerald-800">
                🇰🇪 KE
              </span>
            </div>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 font-medium -mt-0.5">
              Kenyan University Campus Network &amp; Gigs
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
              className="w-full pl-9 pr-8 py-2 text-xs font-semibold text-slate-700 dark:text-slate-200 bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-sparkle-purple/30 transition-all cursor-pointer appearance-none"
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
          {/* Theme Toggle Button */}
          <button
            onClick={toggleTheme}
            aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
            className="p-2 text-slate-600 dark:text-slate-300 hover:text-sparkle-purple dark:hover:text-sparkle-purple-light hover:bg-slate-100 dark:hover:bg-slate-700 rounded-xl transition-colors"
          >
            {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
          </button>

          {/* Notifications Button */}
          <button
            onClick={() => setIsNotificationsOpen(true)}
            aria-label="Open notifications"
            className="relative p-2 text-slate-600 dark:text-slate-300 hover:text-sparkle-purple dark:hover:text-sparkle-purple-light hover:bg-slate-100 dark:hover:bg-slate-700 rounded-xl transition-colors"
          >
            <Bell className="w-5 h-5" />
            {unreadNotificationsCount > 0 && (
              <span className="absolute top-1.5 right-1.5 w-4 h-4 rounded-full bg-sparkle-orange text-white text-[10px] font-bold flex items-center justify-center animate-bounce">
                {unreadNotificationsCount}
              </span>
            )}
          </button>

          {/* Conditional Auth / Profile */}
          {currentUser ? (
            <div className="flex items-center gap-2">
              <button
                onClick={() => setIsProfileModalOpen(true)}
                className="flex items-center gap-2.5 pl-2 pr-3 py-1.5 rounded-full hover:bg-slate-100 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-600 transition-all text-left"
              >
                <img
                  src={currentUser.avatarUrl || `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(currentUser.displayName)}`}
                  alt={currentUser.displayName}
                  className="w-7 h-7 rounded-full bg-slate-200 ring-2 ring-sparkle-purple/20 object-cover"
                />
                <div className="hidden lg:block text-left">
                  <p className="text-xs font-bold text-slate-800 dark:text-slate-100 leading-none truncate max-w-[120px]">
                    {currentUser.displayName}
                  </p>
                  <p className="text-[10px] text-sparkle-purple font-medium leading-tight">
                    {currentUser.university.shortName}
                    {currentUser.isVerifiedStudent && (
                      <span className="ml-1 text-emerald-500">✓</span>
                    )}
                  </p>
                </div>
              </button>
              {/* Quick Sign Out */}
              <button
                onClick={signOut}
                aria-label="Sign out"
                className="p-2 text-slate-400 dark:text-slate-500 hover:text-rose-500 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-900/20 rounded-xl transition-colors"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
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
