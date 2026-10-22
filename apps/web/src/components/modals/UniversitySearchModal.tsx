import React, { useState, useRef, useEffect, useCallback } from 'react';
import { useSparkle } from '../../context/SparkleContext';
import { University } from '../../types/models';
import {
  Search,
  X,
  MapPin,
  Globe,
  Users,
  Calendar,
  Building2,
  CheckCircle2,
  Map,
  ExternalLink,
  School,
  ChevronRight,
} from 'lucide-react';

interface UniversitySearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectUniversity: (id: string) => void;
  onOpenMap: () => void;
}

const TYPE_BADGE: Record<string, { label: string; color: string }> = {
  national: { label: 'Public National', color: 'bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-800' },
  private:  { label: 'Private',         color: 'bg-purple-50 dark:bg-purple-900/20 text-purple-700 dark:text-purple-300 border-purple-200 dark:border-purple-800' },
  technical:{ label: 'Technical',       color: 'bg-amber-50 dark:bg-amber-900/20 text-amber-700 dark:text-amber-300 border-amber-200 dark:border-amber-800' },
};

export const UniversitySearchModal: React.FC<UniversitySearchModalProps> = ({
  isOpen,
  onClose,
  onSelectUniversity,
  onOpenMap,
}) => {
  const { universities, selectedUniversityId } = useSparkle();
  const [query, setQuery] = useState('');
  const [highlighted, setHighlighted] = useState<University | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!isOpen) return;
    setQuery('');
    setHighlighted(null);
    setTimeout(() => inputRef.current?.focus(), 80);

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  const filtered = query.trim().length === 0
    ? universities
    : universities.filter((u) => {
        const q = query.toLowerCase();
        return (
          u.name.toLowerCase().includes(q) ||
          u.shortName.toLowerCase().includes(q) ||
          u.location.toLowerCase().includes(q) ||
          (u.type && u.type.toLowerCase().includes(q))
        );
      });

  const handleSelect = useCallback((id: string) => {
    onSelectUniversity(id);
    onClose();
  }, [onSelectUniversity, onClose]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') onClose();
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center pt-14 sm:pt-20 px-4"
      role="dialog"
      aria-modal="true"
      aria-label="Search universities"
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal Panel */}
      <div className="relative w-full max-w-2xl bg-white dark:bg-sparkle-darkSurface rounded-3xl shadow-2xl border border-slate-200/60 dark:border-slate-700/60 overflow-hidden animate-fade-in-up flex flex-col max-h-[80vh]">

        {/* Header + Search Bar */}
        <div className="p-4 border-b border-slate-100 dark:border-slate-700">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-sparkle-purple to-sparkle-blue flex items-center justify-center shrink-0">
              <School className="w-5 h-5 text-white" />
            </div>
            <div className="flex-1">
              <h2 className="font-extrabold text-sm text-slate-900 dark:text-slate-100 leading-none">
                Find Your Campus
              </h2>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                {universities.length} Kenyan universities registered
              </p>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => { onClose(); onOpenMap(); }}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-700 text-xs font-bold text-slate-700 dark:text-slate-200 hover:bg-sparkle-purple hover:text-white transition-all"
              >
                <Map className="w-3.5 h-3.5" />
                View Map
              </button>
              <button
                onClick={onClose}
                className="p-2 rounded-xl text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Search input */}
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Search by name, short name, location, or type..."
              className="w-full pl-10 pr-10 py-2.5 rounded-xl text-sm font-medium bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-600 focus:outline-none focus:ring-2 focus:ring-sparkle-purple/30 text-slate-800 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500"
            />
            {query && (
              <button
                onClick={() => setQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* "All Campuses" quick option */}
          <button
            onClick={() => handleSelect('ALL')}
            className={`mt-2 w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-bold transition-all border ${
              selectedUniversityId === 'ALL'
                ? 'bg-sparkle-purple/10 dark:bg-sparkle-purple/20 border-sparkle-purple text-sparkle-purple'
                : 'bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-600 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700'
            }`}
          >
            <div className="flex items-center gap-2">
              <Globe className="w-4 h-4" />
              <span>All Kenyan Campuses</span>
            </div>
            {selectedUniversityId === 'ALL' && <CheckCircle2 className="w-4 h-4 text-sparkle-purple" />}
          </button>
        </div>

        {/* Results list */}
        <div className="overflow-y-auto flex-1 p-2">
          {filtered.length === 0 ? (
            <div className="py-12 text-center">
              <School className="w-10 h-10 text-slate-300 mx-auto mb-2" />
              <p className="font-bold text-sm text-slate-700 dark:text-slate-300">No university found</p>
              <p className="text-xs text-slate-400 mt-1">Try a different keyword or browse the full map</p>
              <button
                onClick={() => { onClose(); onOpenMap(); }}
                className="mt-3 px-4 py-2 rounded-xl bg-sparkle-purple text-white text-xs font-bold"
              >
                Open Map View
              </button>
            </div>
          ) : (
            <div className="space-y-1">
              {/* Group: public national */}
              {['national', 'technical', 'private'].map((typeGroup) => {
                const group = filtered.filter((u) => u.type === typeGroup);
                if (group.length === 0) return null;
                return (
                  <div key={typeGroup}>
                    <p className="text-[10px] font-extrabold uppercase tracking-widest text-slate-400 dark:text-slate-500 px-3 py-1.5">
                      {typeGroup === 'national' ? '🏛️ Public / National' : typeGroup === 'technical' ? '⚙️ Technical' : '🏫 Private / Chartered'}
                    </p>
                    {group.map((u) => {
                      const isSelected = selectedUniversityId === u.id;
                      const isHovered = highlighted?.id === u.id;
                      return (
                        <button
                          key={u.id}
                          onClick={() => handleSelect(u.id)}
                          onMouseEnter={() => setHighlighted(u)}
                          onMouseLeave={() => setHighlighted(null)}
                          className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-left transition-all border ${
                            isSelected
                              ? 'bg-sparkle-purple/8 dark:bg-sparkle-purple/15 border-sparkle-purple/30'
                              : 'border-transparent hover:bg-slate-50 dark:hover:bg-slate-800'
                          }`}
                        >
                          {/* Icon */}
                          <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 text-sm font-black ${
                            isSelected
                              ? 'bg-sparkle-purple text-white'
                              : 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300'
                          }`}>
                            {u.shortName.slice(0, 2)}
                          </div>

                          {/* Name + location */}
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 flex-wrap">
                              <p className="text-xs font-extrabold text-slate-900 dark:text-slate-100 truncate max-w-[200px]">
                                {u.name}
                              </p>
                              {u.type && TYPE_BADGE[u.type] && (
                                <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded border ${TYPE_BADGE[u.type].color}`}>
                                  {TYPE_BADGE[u.type].label}
                                </span>
                              )}
                            </div>
                            <div className="flex items-center gap-3 mt-0.5 text-[10px] text-slate-500 dark:text-slate-400">
                              <span className="flex items-center gap-1">
                                <MapPin className="w-3 h-3" />{u.location}
                              </span>
                              {u.students && (
                                <span className="flex items-center gap-1">
                                  <Users className="w-3 h-3" />{u.students.toLocaleString()}
                                </span>
                              )}
                              {u.founded && (
                                <span className="flex items-center gap-1">
                                  <Calendar className="w-3 h-3" />Est. {u.founded}
                                </span>
                              )}
                            </div>
                          </div>

                          {/* Right side */}
                          <div className="flex items-center gap-1.5 shrink-0">
                            {u.website && (
                              <a
                                href={u.website}
                                target="_blank"
                                rel="noopener noreferrer"
                                onClick={(e) => e.stopPropagation()}
                                className="p-1.5 rounded-lg text-slate-400 hover:text-sparkle-blue hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors"
                                title="Open website"
                              >
                                <ExternalLink className="w-3.5 h-3.5" />
                              </a>
                            )}
                            {isSelected ? (
                              <CheckCircle2 className="w-4 h-4 text-sparkle-purple" />
                            ) : (
                              <ChevronRight className="w-4 h-4 text-slate-300 dark:text-slate-600" />
                            )}
                          </div>
                        </button>
                      );
                    })}
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-4 py-3 border-t border-slate-100 dark:border-slate-700 flex items-center justify-between">
          <p className="text-[10px] text-slate-400">
            {filtered.length} of {universities.length} universities shown
          </p>
          <button
            onClick={() => { onClose(); onOpenMap(); }}
            className="flex items-center gap-1.5 text-[11px] font-bold text-sparkle-purple hover:underline"
          >
            <Map className="w-3.5 h-3.5" />
            View on Kenya Map
          </button>
        </div>
      </div>
    </div>
  );
};
