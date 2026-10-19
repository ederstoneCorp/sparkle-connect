import React, { useState } from 'react';
import { useSparkle } from '../../context/SparkleContext';
import { Gig } from '../../types/models';
import {
  Briefcase,
  Search,
  Plus,
  Clock,
  CheckCircle2,
  Send,
  Building,
  User,
  Sparkles,
} from 'lucide-react';

interface GigsScreenProps {
  onOpenCreateGig: () => void;
  onApplyGig: (gig: Gig) => void;
}

const GIG_CATEGORIES = [
  { label: 'All Gigs', value: 'ALL' },
  { label: '💻 Software & Web', value: 'TECH' },
  { label: '🎨 Design & UI/UX', value: 'DESIGN' },
  { label: '✍️ Writing & Research', value: 'WRITING' },
  { label: '📖 Peer Tutoring', value: 'TUTORING' },
  { label: '📸 Media & Photo', value: 'MEDIA' },
];

export const GigsScreen: React.FC<GigsScreenProps> = ({ onOpenCreateGig, onApplyGig }) => {
  const { gigs, selectedUniversityId, universities } = useSparkle();

  const [activeCategory, setActiveCategory] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredGigs = gigs.filter((gig) => {
    // University filter
    if (selectedUniversityId !== 'ALL') {
      const selectedUniv = universities.find((u) => u.id === selectedUniversityId);
      const univ = gig.publisherUniversity || gig.clientUniversity || '';
      if (selectedUniv && !univ.toLowerCase().includes(selectedUniv.shortName.toLowerCase())) {
        return false;
      }
    }

    // Category filter
    if (activeCategory !== 'ALL' && gig.category !== activeCategory) {
      return false;
    }

    // Search query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchTitle = gig.title.toLowerCase().includes(q);
      const matchDesc = gig.description.toLowerCase().includes(q);
      const matchSkills = gig.skillsRequired.some((s) => s.toLowerCase().includes(q));
      if (!matchTitle && !matchDesc && !matchSkills) return false;
    }

    return true;
  });

  return (
    <div className="space-y-4">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-emerald-600 via-teal-600 to-sparkle-purple p-6 rounded-3xl text-white shadow-md relative overflow-hidden">
        <div className="relative z-10 max-w-xl">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/15 text-[11px] font-bold mb-2 backdrop-blur-xs">
            <Sparkles className="w-3.5 h-3.5 text-sparkle-mint" />
            <span>Campus Gig Marketplace • M-Pesa Ready</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black tracking-tight">
            Earn KES while studying at Kenyan Universities
          </h2>
          <p className="text-xs text-white/90 mt-1 leading-relaxed">
            Find peer-to-peer coding, design, academic writing, and event gigs. Post a task or apply directly.
          </p>
        </div>

        <button
          onClick={onOpenCreateGig}
          className="mt-4 sm:mt-0 sm:absolute sm:top-6 sm:right-6 px-4 py-2.5 rounded-xl bg-white text-emerald-800 font-extrabold text-xs shadow-md hover:bg-emerald-50 transition-all flex items-center gap-1.5"
        >
          <Plus className="w-4 h-4 text-emerald-700" />
          <span>Post a Student Gig</span>
        </button>
      </div>

      {/* Search & Category Filter */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-4 shadow-xs flex flex-col sm:flex-row gap-3 items-center justify-between">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search gigs by keyword, tech, or skill..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-xs rounded-xl bg-slate-50 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/30 font-medium"
          />
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar w-full sm:w-auto pb-1 sm:pb-0">
          {GIG_CATEGORIES.map((cat) => (
            <button
              key={cat.value}
              onClick={() => setActiveCategory(cat.value)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all border ${
                activeCategory === cat.value
                  ? 'bg-emerald-600 text-white border-emerald-600 shadow-xs'
                  : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Gigs List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredGigs.length === 0 ? (
          <div className="col-span-full bg-white rounded-2xl border border-slate-200/80 p-12 text-center">
            <Briefcase className="w-10 h-10 text-slate-300 mx-auto mb-2" />
            <h4 className="font-extrabold text-sm text-slate-800">No gigs found in this category</h4>
            <p className="text-xs text-slate-500 mt-1">Try switching filters or be the first to post a gig.</p>
            <button
              onClick={onOpenCreateGig}
              className="mt-4 px-4 py-2 rounded-xl bg-emerald-600 text-white text-xs font-bold"
            >
              Post First Gig
            </button>
          </div>
        ) : (
          filteredGigs.map((gig) => (
            <div
              key={gig.id}
              className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs hover:shadow-md transition-all flex flex-col justify-between"
            >
              <div>
                {/* Top Badge & Budget */}
                <div className="flex items-center justify-between gap-2 mb-3">
                  <span className="text-xs font-black px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200">
                    {gig.budgetKes ? `KES ${gig.budgetKes.toLocaleString()}` : gig.compensation}
                  </span>
                  <div className="flex items-center gap-1.5 text-[11px] text-slate-500 font-semibold">
                    <Clock className="w-3.5 h-3.5 text-slate-400" />
                    <span>{gig.deadline}</span>
                  </div>
                </div>

                {/* Title & Desc */}
                <h3 className="font-extrabold text-sm text-slate-900 mb-2 leading-snug">
                  {gig.title}
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed font-normal mb-4 line-clamp-3">
                  {gig.description}
                </p>

                {/* Required Skills */}
                <div className="flex flex-wrap gap-1.5 mb-4">
                  {gig.skillsRequired.map((skill, idx) => (
                    <span
                      key={idx}
                      className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-slate-100 text-slate-700"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>

              {/* Client footer & apply button */}
              <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <img
                    src={gig.publisherAvatar || gig.clientAvatar || 'https://api.dicebear.com/7.x/avataaars/svg?seed=sparkle'}
                    alt={gig.publisherName || gig.clientName || 'Client'}
                    className="w-7 h-7 rounded-full bg-slate-100 object-cover"
                  />
                  <div className="leading-tight">
                    <p className="text-xs font-bold text-slate-800 truncate max-w-[120px]">
                      {gig.publisherName || gig.clientName}
                    </p>
                    <p className="text-[10px] text-slate-500">
                      {gig.publisherUniversity || gig.clientUniversity}
                    </p>
                  </div>
                </div>

                {(gig.hasApplied || gig.isApplied) ? (
                  <span className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-bold">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Applied</span>
                  </span>
                ) : (
                  <button
                    onClick={() => onApplyGig(gig)}
                    className="px-3.5 py-1.5 rounded-xl bg-sparkle-purple hover:bg-sparkle-purple-dark text-white font-extrabold text-xs shadow-xs transition-all flex items-center gap-1"
                  >
                    <Send className="w-3 h-3" />
                    <span>Apply Now</span>
                  </button>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
