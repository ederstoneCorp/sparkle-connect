import React from 'react';
import { useSparkle } from '../../context/SparkleContext';
import { CalendarDays, BriefcaseBusiness, Users, ArrowRight, Sparkles, MapPin, BookOpen } from 'lucide-react';

/**
 * Desktop companion rail inspired by the Android tablet/desktop layout.
 * Uses the same live context as the primary screens so shortcuts stay in sync.
 */
export const RightSecondaryWidgets: React.FC = () => {
  const { gigs, events, communities, setActiveTab, setIsProfileModalOpen, currentUser } = useSparkle();
  const upcomingEvents = events.slice(0, 3);
  const featuredGigs = gigs.slice(0, 3);
  const featuredCommunities = communities.slice(0, 3);

  return (
    <aside className="hidden xl:flex w-72 shrink-0 flex-col gap-4 sticky top-20 max-h-[calc(100vh-6rem)] overflow-y-auto no-scrollbar">
      {currentUser && (
        <button
          onClick={() => setIsProfileModalOpen(true)}
          className="flex items-center gap-3 rounded-2xl border border-slate-200/80 dark:border-slate-700/60 bg-white dark:bg-sparkle-darkSurface p-4 text-left shadow-xs hover:border-sparkle-purple/40 transition-colors"
        >
          <img src={currentUser.avatarUrl || `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(currentUser.displayName)}`} alt="" className="h-11 w-11 rounded-xl object-cover bg-slate-100" />
          <span className="min-w-0 flex-1">
            <span className="block truncate text-sm font-extrabold text-slate-900 dark:text-slate-100">{currentUser.displayName}</span>
            <span className="block truncate text-xs text-slate-500 dark:text-slate-400">{currentUser.university.shortName} · Year {currentUser.yearOfStudy}</span>
            <span className="mt-1 block text-[10px] font-bold text-sparkle-purple">View your profile</span>
          </span>
          <ArrowRight className="h-4 w-4 text-slate-400" />
        </button>
      )}

      <section className="rounded-2xl border border-slate-200/80 dark:border-slate-700/60 bg-white dark:bg-sparkle-darkSurface p-4 shadow-xs">
        <div className="mb-3 flex items-center justify-between">
          <h3 className="flex items-center gap-2 text-sm font-extrabold text-slate-900 dark:text-slate-100"><CalendarDays className="h-4 w-4 text-sparkle-purple" /> Campus events</h3>
          <button onClick={() => setActiveTab('events')} className="text-[11px] font-bold text-sparkle-purple hover:underline">View all</button>
        </div>
        {upcomingEvents.length ? <div className="space-y-3">
          {upcomingEvents.map((event) => (
            <button key={event.id} onClick={() => setActiveTab('events')} className="block w-full rounded-xl bg-slate-50 dark:bg-slate-800/70 p-3 text-left hover:bg-sparkle-purple/5 transition-colors">
              <span className="block text-xs font-bold leading-snug text-slate-800 dark:text-slate-100">{event.title}</span>
              <span className="mt-1 flex items-center gap-1 text-[10px] text-slate-500 dark:text-slate-400"><MapPin className="h-3 w-3 shrink-0" />{event.location || event.venue || event.university}</span>
              <span className="mt-1 block text-[10px] font-semibold text-sparkle-purple">{event.date || event.dateString || 'Date to be announced'}</span>
            </button>
          ))}
        </div> : <p className="text-xs text-slate-500 dark:text-slate-400">New campus events will appear here.</p>}
      </section>

      <section className="rounded-2xl border border-slate-200/80 dark:border-slate-700/60 bg-white dark:bg-sparkle-darkSurface p-4 shadow-xs">
        <div className="mb-3 flex items-center justify-between">
          <h3 className="flex items-center gap-2 text-sm font-extrabold text-slate-900 dark:text-slate-100"><BriefcaseBusiness className="h-4 w-4 text-emerald-600" /> Student gigs</h3>
          <button onClick={() => setActiveTab('gigs')} className="text-[11px] font-bold text-sparkle-purple hover:underline">Explore</button>
        </div>
        {featuredGigs.length ? <div className="space-y-3">
          {featuredGigs.map((gig) => (
            <button key={gig.id} onClick={() => setActiveTab('gigs')} className="block w-full text-left group">
              <span className="block text-xs font-bold text-slate-800 dark:text-slate-100 group-hover:text-sparkle-purple">{gig.title}</span>
              <span className="mt-1 block text-[10px] text-slate-500 dark:text-slate-400">{gig.category} · {gig.compensation || (gig.budgetKes ? `KES ${gig.budgetKes.toLocaleString()}` : 'Compensation varies')}</span>
            </button>
          ))}
        </div> : <p className="text-xs text-slate-500 dark:text-slate-400">Student opportunities will appear here.</p>}
      </section>

      <section className="rounded-2xl border border-slate-200/80 dark:border-slate-700/60 bg-white dark:bg-sparkle-darkSurface p-4 shadow-xs">
        <div className="mb-3 flex items-center justify-between">
          <h3 className="flex items-center gap-2 text-sm font-extrabold text-slate-900 dark:text-slate-100"><Users className="h-4 w-4 text-sparkle-blue" /> Campus communities</h3>
          <button onClick={() => setActiveTab('communities')} className="text-[11px] font-bold text-sparkle-purple hover:underline">Browse</button>
        </div>
        <div className="space-y-3">
          {featuredCommunities.map((community) => (
            <button key={community.id} onClick={() => setActiveTab('communities')} className="flex w-full items-center gap-2 text-left">
              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-sparkle-purple/10 text-sparkle-purple"><Users className="h-4 w-4" /></span>
              <span className="min-w-0 flex-1">
                <span className="block truncate text-xs font-bold text-slate-800 dark:text-slate-100">{community.name}</span>
                <span className="block text-[10px] text-slate-500 dark:text-slate-400">{community.membersCount.toLocaleString()} members</span>
              </span>
            </button>
          ))}
          {!featuredCommunities.length && <p className="text-xs text-slate-500 dark:text-slate-400">Find your campus circles here.</p>}
        </div>
      </section>

      <section className="rounded-2xl bg-gradient-to-br from-sparkle-purple to-sparkle-pink p-4 text-white shadow-md">
        <Sparkles className="mb-2 h-5 w-5" />
        <h3 className="text-sm font-extrabold">Keep campus moving</h3>
        <p className="mt-1 text-xs leading-relaxed text-white/85">Share an update, find your next opportunity, or connect with students across Kenya.</p>
        <div className="mt-3 grid grid-cols-2 gap-2">
          <button onClick={() => setActiveTab('academics')} className="flex items-center justify-center gap-1 rounded-lg bg-white/15 px-2 py-2 text-[10px] font-bold hover:bg-white/25"><BookOpen className="h-3.5 w-3.5" />Academics</button>
          <button onClick={() => setActiveTab('messages')} className="flex items-center justify-center gap-1 rounded-lg bg-white/15 px-2 py-2 text-[10px] font-bold hover:bg-white/25"><ArrowRight className="h-3.5 w-3.5" />Messages</button>
        </div>
      </section>
    </aside>
  );
};
