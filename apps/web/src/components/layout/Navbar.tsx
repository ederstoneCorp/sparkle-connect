import React, { useState } from 'react';
import { useSparkle } from '../../context/SparkleContext';
import { useTheme } from '../../context/ThemeContext';
import {
  Sparkles,
  Bell,
  School,
  LogIn,
  Sun,
  Moon,
  LogOut,
  Map,
  ChevronDown,
  X,
} from 'lucide-react';
import { DarkModeToggle } from '../common/DarkModeToggle';

interface NavbarProps {
  onOpenUniversitySearch: () => void;
  onOpenCampusMap: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onOpenUniversitySearch, onOpenCampusMap }) => {
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

  const selectedUniversity = universities.find((u) => u.id === selectedUniversityId);

  return (
    <header className="sticky top-0 z-40 bg-white/95 dark:bg-sparkle-darkSurface/95 backdrop-blur-md border-b border-slate-200/80 dark:border-slate-700/60 shadow-sm animate-slide-down">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-3">

        {/* Brand / Logo */}
        <div className="flex items-center gap-3 shrink-0">
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

        {/* University Search Bar (center) */}
        <div className="flex-1 max-w-sm hidden md:flex items-center gap-2">
          {/* Search trigger button */}
          <button
            onClick={onOpenUniversitySearch}
            className="flex-1 flex items-center gap-2 pl-3 pr-2 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-600 hover:border-sparkle-purple/40 hover:bg-white dark:hover:bg-slate-700 transition-all text-left group"
          >
            <School className="w-4 h-4 text-slate-400 group-hover:text-sparkle-purple transition-colors shrink-0" />
            <span className="flex-1 text-xs font-semibold text-slate-500 dark:text-slate-400 group-hover:text-slate-700 dark:group-hover:text-slate-200 truncate transition-colors">
              {selectedUniversity ? selectedUniversity.name : 'All Kenyan Campuses'}
            </span>
            {selectedUniversityId !== 'ALL' && (
              <button
                onClick={(e) => { e.stopPropagation(); setSelectedUniversityId('ALL'); }}
                className="p-0.5 rounded-md text-slate-300 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-900/20 transition-colors"
                aria-label="Clear filter"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
            {selectedUniversityId === 'ALL' && (
              <ChevronDown className="w-3.5 h-3.5 text-slate-300 shrink-0" />
            )}
          </button>

          {/* Map button */}
          <button
            onClick={onOpenCampusMap}
            aria-label="Open campus map"
            title="View campuses on Kenya map"
            className="p-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-600 text-slate-500 dark:text-slate-400 hover:text-sparkle-blue hover:border-sparkle-blue/40 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-all"
          >
            <Map className="w-4 h-4" />
          </button>
        </div>

        {/* Right Action Icons & Profile */}
        <div className="flex items-center gap-1.5 sm:gap-2">

          {/* Mobile: search + map icons */}
          <button
            onClick={onOpenUniversitySearch}
            className="md:hidden p-2 text-slate-500 dark:text-slate-400 hover:text-sparkle-purple hover:bg-slate-100 dark:hover:bg-slate-700 rounded-xl transition-colors"
            aria-label="Search universities"
          >
            <School className="w-5 h-5" />
          </button>
          <button
            onClick={onOpenCampusMap}
            className="md:hidden p-2 text-slate-500 dark:text-slate-400 hover:text-sparkle-blue hover:bg-slate-100 dark:hover:bg-slate-700 rounded-xl transition-colors"
            aria-label="Open campus map"
          >
            <Map className="w-5 h-5" />
          </button>

          {/* Theme Toggle */}
          <DarkModeToggle />

          {/* Notifications */}
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
            <div className="flex items-center gap-1.5">
              <button
                onClick={() => setIsProfileModalOpen(true)}
                className="flex items-center gap-2 pl-2 pr-3 py-1.5 rounded-full hover:bg-slate-100 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-600 transition-all text-left"
              >
                <img
                  src={currentUser.avatarUrl || `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(currentUser.displayName)}`}
                  alt={currentUser.displayName}
                  className="w-7 h-7 rounded-full bg-slate-200 ring-2 ring-sparkle-purple/20 object-cover"
                />
                <div className="hidden lg:block text-left">
                  <p className="text-xs font-bold text-slate-800 dark:text-slate-100 leading-none truncate max-w-[110px]">
                    {currentUser.displayName}
                  </p>
                  <p className="text-[10px] text-sparkle-purple font-medium leading-tight">
                    {currentUser.university.shortName}
                    {currentUser.isVerifiedStudent && <span className="ml-1 text-emerald-500">✓</span>}
                  </p>
                </div>
              </button>
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
              <span className="hidden sm:inline">Sign In</span>
            </button>
          )}
        </div>

      </div>
    </header>
  );
};
