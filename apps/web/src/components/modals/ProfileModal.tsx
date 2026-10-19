import React from 'react';
import { useSparkle } from '../../context/SparkleContext';
import {
  X,
  ShieldCheck,
  Building,
  BookOpen,
  Calendar,
  LogOut,
  Users,
  Award,
  Sparkles,
} from 'lucide-react';

export const ProfileModal: React.FC = () => {
  const {
    isProfileModalOpen,
    setIsProfileModalOpen,
    currentUser,
    currentAccountId,
    accounts,
    switchAccount,
    signOut,
  } = useSparkle();

  if (!isProfileModalOpen || !currentUser) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-slate-100 overflow-hidden my-8 animate-in fade-in zoom-in-95 duration-200">
        
        {/* Cover & Avatar */}
        <div className="h-28 bg-gradient-to-r from-sparkle-purple via-indigo-600 to-sparkle-pink relative">
          <button
            onClick={() => setIsProfileModalOpen(false)}
            className="absolute top-4 right-4 p-1.5 rounded-full bg-black/20 hover:bg-black/40 text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="px-6 pb-6 pt-0 relative">
          <div className="flex justify-between items-end -mt-12 mb-4">
            <div className="relative">
              <img
                src={currentUser.avatarUrl || 'https://api.dicebear.com/7.x/avataaars/svg?seed=sparkle'}
                alt={currentUser.displayName}
                className="w-24 h-24 rounded-2xl border-4 border-white shadow-md bg-slate-100 object-cover"
              />
              {currentUser.isVerifiedStudent && (
                <div className="absolute -bottom-1 -right-1 p-1 bg-white rounded-full shadow-xs">
                  <ShieldCheck className="w-5 h-5 text-sparkle-mint fill-sparkle-mint/20" />
                </div>
              )}
            </div>

            <button
              onClick={() => {
                setIsProfileModalOpen(false);
                signOut();
              }}
              className="px-3.5 py-2 rounded-xl border border-rose-200 text-rose-600 hover:bg-rose-50 font-bold text-xs flex items-center gap-1.5 transition-all"
            >
              <LogOut className="w-4 h-4" />
              <span>Sign Out</span>
            </button>
          </div>

          {/* User Bio & Meta */}
          <div className="space-y-1 mb-4">
            <div className="flex items-center gap-2">
              <h3 className="text-xl font-black text-slate-900">{currentUser.displayName}</h3>
              <span className="text-xs px-2 py-0.5 rounded-full bg-sparkle-purple/10 text-sparkle-purple font-bold">
                @{currentUser.username}
              </span>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed font-medium">{currentUser.bio}</p>
          </div>

          {/* University Details Card */}
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-2 mb-4">
            <div className="flex items-center gap-2 text-xs font-bold text-slate-800">
              <Building className="w-4 h-4 text-sparkle-purple" />
              <span>{currentUser.university.name} ({currentUser.university.shortName})</span>
            </div>
            <div className="flex items-center gap-2 text-xs text-slate-600">
              <BookOpen className="w-4 h-4 text-sparkle-orange" />
              <span>{currentUser.course} • Year {currentUser.yearOfStudy}</span>
            </div>
            <div className="flex items-center gap-2 text-xs text-slate-500">
              <Calendar className="w-4 h-4 text-slate-400" />
              <span>Joined {currentUser.joinedDate}</span>
            </div>
          </div>

          {/* Skills & Interests Tags */}
          <div className="space-y-2.5 mb-5">
            <div>
              <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1.5">
                Skills & Talents
              </p>
              <div className="flex flex-wrap gap-1.5">
                {currentUser.skills.map((skill, idx) => (
                  <span
                    key={idx}
                    className="text-xs px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-700 font-semibold border border-emerald-200"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>

            <div>
              <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1.5">
                Interests & Focus
              </p>
              <div className="flex flex-wrap gap-1.5">
                {currentUser.interests.map((interest, idx) => (
                  <span
                    key={idx}
                    className="text-xs px-2.5 py-1 rounded-lg bg-indigo-50 text-indigo-700 font-semibold border border-indigo-200"
                  >
                    {interest}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Switch Recorded Accounts */}
          <div className="border-t border-slate-200 pt-3">
            <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-2">
              Switch Student Account (Saved in DB)
            </p>
            <div className="space-y-1.5 max-h-36 overflow-y-auto">
              {accounts.map((acc) => {
                const isSelected = acc.id === currentAccountId;
                return (
                  <button
                    key={acc.id}
                    onClick={() => switchAccount(acc.id)}
                    className={`w-full flex items-center justify-between p-2 rounded-xl text-left border transition-all ${
                      isSelected
                        ? 'border-sparkle-purple bg-sparkle-purple/5 font-bold'
                        : 'border-slate-200 hover:bg-slate-50'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <img
                        src={acc.profile.avatarUrl || 'https://api.dicebear.com/7.x/avataaars/svg?seed=sparkle'}
                        alt=""
                        className="w-6 h-6 rounded-full bg-slate-200 object-cover"
                      />
                      <div>
                        <p className="text-xs font-bold text-slate-800 leading-none">
                          {acc.profile.displayName}
                        </p>
                        <p className="text-[10px] text-slate-500 leading-tight">
                          {acc.email} • {acc.profile.university.shortName}
                        </p>
                      </div>
                    </div>
                    {isSelected && (
                      <span className="text-[10px] font-bold text-sparkle-purple px-2 py-0.5 rounded-full bg-sparkle-purple/10">
                        Active
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};
