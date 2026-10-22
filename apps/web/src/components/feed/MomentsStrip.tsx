import React, { useState } from 'react';
import { Clock3, Plus, Sparkles, Trash2, X } from 'lucide-react';
import { useSparkle } from '../../context/SparkleContext';
import { SparkleMoment } from '../../types/models';

const MOMENT_COLORS = [
  '#6C3BFF',
  '#2878FF',
  '#F43F8C',
  '#FF6B35',
  '#087F5B',
  '#19172B',
];

const ageLabel = (createdAt: number) => {
  const minutes = Math.max(0, Math.floor((Date.now() - createdAt) / 60000));
  if (minutes < 1) return 'Just now';
  if (minutes < 60) return `${minutes}m ago`;
  return `${Math.floor(minutes / 60)}h ago`;
};

export const MomentsStrip: React.FC = () => {
  const { moments, currentUser, addMoment, markMomentViewed, deleteMoment, setIsAuthModalOpen } = useSparkle();
  const [isComposerOpen, setIsComposerOpen] = useState(false);
  const [caption, setCaption] = useState('');
  const [backgroundColor, setBackgroundColor] = useState(MOMENT_COLORS[0]);
  const [activeMoment, setActiveMoment] = useState<SparkleMoment | null>(null);

  const activeMoments = moments
    .filter((moment) => Date.now() - moment.createdAtTimestamp < 24 * 60 * 60 * 1000)
    .sort((a, b) => b.createdAtTimestamp - a.createdAtTimestamp);

  const openMoment = (moment: SparkleMoment) => {
    setActiveMoment(moment);
    markMomentViewed(moment.id);
  };

  const handleCreate = (event: React.FormEvent) => {
    event.preventDefault();
    if (!currentUser) {
      setIsComposerOpen(false);
      setIsAuthModalOpen(true);
      return;
    }
    if (!caption.trim()) return;
    addMoment(caption, backgroundColor);
    setCaption('');
    setIsComposerOpen(false);
  };

  return (
    <>
      <section className="rounded-2xl border border-slate-200/80 dark:border-slate-700/60 bg-white dark:bg-sparkle-darkSurface p-4 shadow-xs">
        <div className="mb-3 flex items-center justify-between gap-3">
          <div>
            <h3 className="text-sm font-extrabold text-slate-900 dark:text-white">Campus Moments</h3>
            <p className="mt-0.5 text-[11px] text-slate-500 dark:text-slate-400">Short updates that disappear after 24 hours</p>
          </div>
          <span className="inline-flex items-center gap-1 rounded-full bg-sparkle-purple/10 px-2.5 py-1 text-[10px] font-bold text-sparkle-purple dark:text-purple-300">
            <Clock3 className="h-3 w-3" /> 24 hours
          </span>
        </div>

        <div className="flex gap-3 overflow-x-auto pb-1 no-scrollbar">
          <button
            type="button"
            onClick={() => currentUser ? setIsComposerOpen(true) : setIsAuthModalOpen(true)}
            className="group relative flex h-32 w-24 shrink-0 flex-col items-center justify-center overflow-hidden rounded-2xl border border-dashed border-sparkle-purple/40 bg-sparkle-purple/5 px-2 text-center transition hover:bg-sparkle-purple/10 dark:bg-sparkle-purple/10"
          >
            {currentUser?.avatarUrl ? (
              <img src={currentUser.avatarUrl} alt="" className="mb-2 h-10 w-10 rounded-full border-2 border-sparkle-purple object-cover" />
            ) : (
              <span className="mb-2 flex h-10 w-10 items-center justify-center rounded-full bg-sparkle-purple text-white"><Plus className="h-5 w-5" /></span>
            )}
            <span className="text-[11px] font-extrabold text-slate-800 dark:text-slate-100">Add moment</span>
            <span className="mt-1 text-[9px] text-slate-500 dark:text-slate-400">Share an update</span>
          </button>

          {activeMoments.map((moment) => (
            <button
              type="button"
              key={moment.id}
              onClick={() => openMoment(moment)}
              className="relative flex h-32 w-24 shrink-0 flex-col justify-between overflow-hidden rounded-2xl p-2.5 text-left text-white shadow-sm transition hover:-translate-y-0.5"
              style={{ background: `linear-gradient(155deg, ${moment.backgroundColorHex}, #17152c)` }}
            >
              <span className="absolute inset-0 bg-black/5" />
              <span className="relative flex items-center gap-1.5">
                <img src={moment.authorAvatar} alt="" className="h-7 w-7 rounded-full border-2 border-white object-cover" />
                <span className="truncate text-[9px] font-extrabold">{moment.authorName.split(' ')[0]}</span>
              </span>
              <span className="relative line-clamp-4 break-words text-[11px] font-bold leading-snug">{moment.textCaption}</span>
              <span className="relative text-[9px] text-white/75">{ageLabel(moment.createdAtTimestamp)}</span>
            </button>
          ))}
          {activeMoments.length === 0 && (
            <div className="flex min-w-44 flex-col justify-center rounded-2xl bg-slate-50 px-4 dark:bg-slate-800/70">
              <Sparkles className="mb-2 h-4 w-4 text-sparkle-purple" />
              <p className="text-[11px] font-bold text-slate-700 dark:text-slate-200">Your campus, in the moment.</p>
              <p className="mt-1 text-[10px] leading-relaxed text-slate-500 dark:text-slate-400">Share the first update. Moments expire automatically after 24 hours.</p>
            </div>
          )}
        </div>
      </section>

      {isComposerOpen && (
        <div className="fixed inset-0 z-[70] flex items-center justify-center bg-slate-950/70 p-4 backdrop-blur-sm" role="dialog" aria-modal="true" aria-label="Create a moment">
          <form onSubmit={handleCreate} className="w-full max-w-md overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-2xl dark:border-slate-700 dark:bg-[#11101B]">
            <div className="flex items-center justify-between border-b border-slate-200 p-4 dark:border-slate-800">
              <div>
                <h3 className="font-extrabold text-slate-900 dark:text-white">Create a moment</h3>
                <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">Visible for 24 hours on this browser.</p>
              </div>
              <button type="button" onClick={() => setIsComposerOpen(false)} className="rounded-xl p-2 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800" aria-label="Close"><X className="h-4 w-4" /></button>
            </div>
            <div className="p-4">
              <div className="mb-4 flex min-h-40 items-center justify-center rounded-2xl p-5 text-center text-white" style={{ background: `linear-gradient(145deg, ${backgroundColor}, #17152c)` }}>
                <p className="break-words text-lg font-extrabold">{caption.trim() || 'What is happening on your campus?'}</p>
              </div>
              <label htmlFor="moment-caption" className="mb-1.5 block text-xs font-bold text-slate-700 dark:text-slate-300">Your update</label>
              <textarea id="moment-caption" required maxLength={240} rows={3} value={caption} onChange={(event) => setCaption(event.target.value)} placeholder="Share a quick campus update..." className="w-full resize-none rounded-xl border border-slate-200 bg-slate-50 p-3 text-sm outline-none focus:ring-2 focus:ring-sparkle-purple/30 dark:border-slate-700 dark:bg-slate-900 dark:text-white" />
              <div className="mt-3 flex items-center justify-between">
                <span className="text-[10px] text-slate-500">{caption.length}/240 characters</span>
                <div className="flex gap-2" aria-label="Choose moment background">
                  {MOMENT_COLORS.map((color) => <button key={color} type="button" aria-label={`Use background ${color}`} onClick={() => setBackgroundColor(color)} className={`h-6 w-6 rounded-full border-2 ${backgroundColor === color ? 'border-slate-900 ring-2 ring-sparkle-purple/30 dark:border-white' : 'border-white/80 dark:border-slate-700'}`} style={{ backgroundColor: color }} />)}
                </div>
              </div>
            </div>
            <div className="flex gap-2 border-t border-slate-200 p-4 dark:border-slate-800">
              <button type="button" onClick={() => setIsComposerOpen(false)} className="flex-1 rounded-xl border border-slate-200 px-4 py-2.5 text-xs font-bold text-slate-600 dark:border-slate-700 dark:text-slate-300">Cancel</button>
              <button type="submit" disabled={!caption.trim()} className="flex-1 rounded-xl bg-sparkle-purple px-4 py-2.5 text-xs font-extrabold text-white disabled:opacity-50">Share moment</button>
            </div>
          </form>
        </div>
      )}

      {activeMoment && (
        <div className="fixed inset-0 z-[70] flex items-center justify-center bg-slate-950/90 p-4 backdrop-blur-sm" role="dialog" aria-modal="true" aria-label="View moment" onClick={() => setActiveMoment(null)}>
          <div className="relative flex min-h-[min(70vh,560px)] w-full max-w-sm flex-col justify-between overflow-hidden rounded-3xl p-5 text-white shadow-2xl" style={{ background: `linear-gradient(145deg, ${activeMoment.backgroundColorHex}, #17152c)` }} onClick={(event) => event.stopPropagation()}>
            <div className="absolute left-4 right-4 top-4 h-1 overflow-hidden rounded-full bg-white/25"><div className="h-full w-full rounded-full bg-white" /></div>
            <div className="mt-3 flex items-center gap-3">
              <img src={activeMoment.authorAvatar} alt="" className="h-10 w-10 rounded-full border-2 border-white object-cover" />
              <div className="min-w-0 flex-1"><p className="truncate text-sm font-extrabold">{activeMoment.authorName}</p><p className="text-[11px] text-white/75">{activeMoment.authorUniversity} · {ageLabel(activeMoment.createdAtTimestamp)}</p></div>
              {currentUser?.id === activeMoment.authorId && <button type="button" aria-label="Delete moment" onClick={() => { deleteMoment(activeMoment.id); setActiveMoment(null); }} className="rounded-xl bg-white/10 p-2 hover:bg-white/20"><Trash2 className="h-4 w-4" /></button>}
              <button type="button" aria-label="Close moment" onClick={() => setActiveMoment(null)} className="rounded-xl bg-white/10 p-2 hover:bg-white/20"><X className="h-4 w-4" /></button>
            </div>
            <p className="whitespace-pre-wrap break-words text-center text-2xl font-black leading-snug">{activeMoment.textCaption}</p>
            <div className="text-center text-xs text-white/70">Sparkle Connect · Campus Moments</div>
          </div>
        </div>
      )}
    </>
  );
};
