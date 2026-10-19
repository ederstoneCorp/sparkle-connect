import React, { useState } from 'react';
import { useSparkle } from '../../context/SparkleContext';
import { Users, Search, Check, Plus, Globe, ShieldCheck } from 'lucide-react';

export const CommunitiesScreen: React.FC = () => {
  const { communities, toggleJoinCommunity, selectedUniversityId, universities } = useSparkle();
  const [searchQuery, setSearchQuery] = useState('');

  const filteredCommunities = communities.filter((c) => {
    if (selectedUniversityId !== 'ALL') {
      const selectedUniv = universities.find((u) => u.id === selectedUniversityId);
      const univ = (c as any).university || c.universityAffiliation || '';
      if (selectedUniv && !univ.toLowerCase().includes(selectedUniv.shortName.toLowerCase())) {
        return false;
      }
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      if (!c.name.toLowerCase().includes(q) && !c.description.toLowerCase().includes(q) && !c.category.toLowerCase().includes(q)) return false;
    }
    return true;
  });

  return (
    <div className="space-y-4">
      {/* Header & Search */}
      <div className="bg-white dark:bg-sparkle-darkSurface rounded-2xl border border-slate-200/80 dark:border-slate-700/60 p-4 shadow-xs flex flex-col sm:flex-row gap-3 items-center justify-between animate-slide-down">
        <div>
          <h2 className="text-base font-extrabold text-slate-900 dark:text-slate-100">Campus Clubs & Hubs</h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">Connect with student innovators, debate circles, and tech clubs</p>
        </div>

        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search clubs or societies..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-600 focus:outline-none focus:ring-2 focus:ring-sparkle-purple/30 font-medium dark:text-slate-200 dark:placeholder-slate-500"
          />
        </div>
      </div>

      {/* Communities Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredCommunities.length === 0 ? (
          <div className="col-span-full bg-white dark:bg-sparkle-darkSurface rounded-2xl border border-slate-200/80 dark:border-slate-700/60 p-12 text-center">
            <Users className="w-10 h-10 text-slate-300 mx-auto mb-2" />
            <h4 className="font-extrabold text-sm text-slate-800 dark:text-slate-200">No communities found</h4>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Try a different search or filter.</p>
          </div>
        ) : (
          filteredCommunities.map((c, idx) => (
            <div
              key={c.id}
              className={`bg-white dark:bg-sparkle-darkSurface rounded-2xl border border-slate-200/80 dark:border-slate-700/60 p-5 shadow-xs hover:shadow-md transition-all flex flex-col justify-between animate-stagger-${Math.min(idx + 1, 4) as 1|2|3|4}`}
            >
              <div>
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-sparkle-purple/20 to-sparkle-pink/20 flex items-center justify-center text-sparkle-purple font-black text-lg">
                      {c.name.charAt(0)}
                    </div>
                    <div>
                      <h3 className="font-extrabold text-sm text-slate-900 dark:text-slate-100 leading-snug">{c.name}</h3>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">
                        {(c as any).university || c.universityAffiliation} • <span className="text-sparkle-purple font-semibold">{c.category}</span>
                      </p>
                    </div>
                  </div>
                  <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 shrink-0">
                    {c.membersCount.toLocaleString()} members
                  </span>
                </div>

                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed font-normal mb-3">
                  {c.description}
                </p>

                {/* Tags */}
                {c.tags && c.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1 mb-3">
                    {c.tags.map((tag, i) => (
                      <span key={i} className="text-[10px] font-semibold px-1.5 py-0.5 rounded-md bg-sparkle-purple/5 dark:bg-sparkle-purple/10 text-sparkle-purple">
                        #{tag}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              <div className="pt-3 border-t border-slate-100 dark:border-slate-700 flex items-center justify-between">
                <span className="text-[11px] text-slate-400 dark:text-slate-500 flex items-center gap-1">
                  <Globe className="w-3.5 h-3.5" /> Open to Verified Students
                </span>

                <button
                  onClick={() => toggleJoinCommunity(c.id)}
                  className={`px-4 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                    c.isJoined
                      ? 'bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 hover:bg-rose-50 dark:hover:bg-rose-900/20 hover:text-rose-600 dark:hover:text-rose-400 border border-slate-200 dark:border-slate-600'
                      : 'bg-sparkle-purple text-white hover:bg-sparkle-purple-dark shadow-xs'
                  }`}
                >
                  {c.isJoined ? (
                    <><Check className="w-3.5 h-3.5 text-emerald-500" /><span>Joined</span></>
                  ) : (
                    <><Plus className="w-3.5 h-3.5" /><span>Join</span></>
                  )}
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
