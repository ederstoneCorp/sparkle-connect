import React, { useEffect, useState } from 'react';
import { useSparkle } from '../../context/SparkleContext';
import {
  X,
  ShieldCheck,
  Building,
  BookOpen,
  Calendar,
  LogOut,
  Sparkles,
  Mail,
  Camera,
  Edit3,
} from 'lucide-react';
import { AvatarEditModal } from './AvatarEditModal';
import { CourseSearchModal } from './CourseSearchModal';

export const ProfileModal: React.FC = () => {
  const {
    isProfileModalOpen,
    setIsProfileModalOpen,
    currentUser,
    signOut,
    updateCourse,
    updateProfile,
  } = useSparkle();

  const [isAvatarEditOpen, setIsAvatarEditOpen] = useState(false);
  const [isCourseSearchOpen, setIsCourseSearchOpen] = useState(false);
  const [isEditingDetails, setIsEditingDetails] = useState(false);
  const [editBio, setEditBio] = useState('');
  const [editFaculty, setEditFaculty] = useState('');
  const [editYear, setEditYear] = useState(1);
  const [profileSaveError, setProfileSaveError] = useState<string | null>(null);
  const [isSavingProfile, setIsSavingProfile] = useState(false);

  useEffect(() => {
    if (!currentUser) return;
    setEditBio(currentUser.bio);
    setEditFaculty(currentUser.faculty);
    setEditYear(currentUser.yearOfStudy);
  }, [currentUser]);

  const handleSaveProfileDetails = async (event: React.FormEvent) => {
    event.preventDefault();
    setProfileSaveError(null);
    setIsSavingProfile(true);
    const result = await updateProfile({ bio: editBio, faculty: editFaculty, yearOfStudy: editYear });
    setIsSavingProfile(false);
    if (!result.success) {
      setProfileSaveError(result.error || 'Could not save profile details.');
      return;
    }
    setIsEditingDetails(false);
  };

  if (!isProfileModalOpen || !currentUser) return null;

  return (
    <>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm overflow-y-auto">
        <div className="relative w-full max-w-lg bg-white dark:bg-sparkle-darkSurface rounded-3xl shadow-2xl border border-slate-100 dark:border-slate-700 overflow-hidden my-8 animate-in fade-in zoom-in-95 duration-200">
          
          {/* Cover & Avatar */}
          <div className="h-28 bg-gradient-to-r from-sparkle-purple via-indigo-600 to-sparkle-pink relative">
            <button
              onClick={() => setIsProfileModalOpen(false)}
              className="absolute top-4 right-4 p-1.5 rounded-full bg-black/20 hover:bg-black/40 text-white transition-colors"
              aria-label="Close Profile"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="px-6 pb-6 pt-0 relative">
            <div className="flex justify-between items-end -mt-12 mb-4">
              <div className="relative group cursor-pointer" onClick={() => setIsAvatarEditOpen(true)}>
                <img
                  src={currentUser.avatarUrl || `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(currentUser.displayName)}`}
                  alt={currentUser.displayName}
                  className="w-24 h-24 rounded-2xl border-4 border-white dark:border-slate-800 shadow-md bg-slate-100 object-cover group-hover:opacity-90 transition-opacity"
                />
                <div className="absolute inset-0 rounded-2xl bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white">
                  <Camera className="w-6 h-6" />
                </div>
                {currentUser.isVerifiedStudent && (
                  <div className="absolute -bottom-1 -right-1 p-1 bg-white dark:bg-slate-800 rounded-full shadow-xs">
                    <ShieldCheck className="w-5 h-5 text-emerald-500" />
                  </div>
                )}
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setIsAvatarEditOpen(true)}
                  className="px-3 py-1.5 rounded-xl border border-sparkle-purple/40 text-sparkle-purple hover:bg-sparkle-purple/10 font-bold text-xs flex items-center gap-1.5 transition-all"
                >
                  <Camera className="w-3.5 h-3.5" />
                  <span>Change Photo</span>
                </button>

            <button
              onClick={() => {
                setIsProfileModalOpen(false);
                signOut();
              }}
              className="px-3.5 py-2 rounded-xl border border-rose-200 dark:border-rose-800 text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-900/20 font-bold text-xs flex items-center gap-1.5 transition-all"
            >
              <LogOut className="w-4 h-4" />
              <span>Sign Out</span>
            </button>
          </div>

          {/* User Bio & Meta */}
          <div className="space-y-1 mb-4">
            <div className="flex items-center gap-2 flex-wrap">
              <h3 className="text-xl font-black text-slate-900 dark:text-slate-100">{currentUser.displayName}</h3>
              <span className="text-xs px-2 py-0.5 rounded-full bg-sparkle-purple/10 text-sparkle-purple font-bold">
                @{currentUser.username}
              </span>
              {currentUser.isVerifiedStudent && (
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-400 font-bold border border-emerald-200 dark:border-emerald-800 flex items-center gap-1">
                  <ShieldCheck className="w-3 h-3" /> Verified Student
                </span>
              )}
            </div>
            <p className="text-[11px] text-slate-500 dark:text-slate-500 flex items-center gap-1">
              <Mail className="w-3 h-3" />{currentUser.email}
            </p>
            {isEditingDetails ? (
              <form onSubmit={handleSaveProfileDetails} className="mt-3 space-y-3 rounded-2xl border border-slate-200 bg-slate-50 p-3 dark:border-slate-700 dark:bg-slate-900/60">
                <div>
                  <label htmlFor="profile-bio" className="mb-1 block text-[11px] font-bold text-slate-600 dark:text-slate-300">Bio</label>
                  <textarea id="profile-bio" rows={3} maxLength={300} value={editBio} onChange={(event) => setEditBio(event.target.value)} className="w-full rounded-xl border border-slate-200 bg-white p-2.5 text-xs outline-none focus:ring-2 focus:ring-sparkle-purple/30 dark:border-slate-700 dark:bg-slate-800 dark:text-white" />
                </div>
                <div>
                  <label htmlFor="profile-faculty" className="mb-1 block text-[11px] font-bold text-slate-600 dark:text-slate-300">Faculty / School</label>
                  <input id="profile-faculty" value={editFaculty} onChange={(event) => setEditFaculty(event.target.value)} maxLength={150} className="w-full rounded-xl border border-slate-200 bg-white p-2.5 text-xs outline-none focus:ring-2 focus:ring-sparkle-purple/30 dark:border-slate-700 dark:bg-slate-800 dark:text-white" />
                </div>
                <div>
                  <label htmlFor="profile-year" className="mb-1 block text-[11px] font-bold text-slate-600 dark:text-slate-300">Year of study</label>
                  <select id="profile-year" value={editYear} onChange={(event) => setEditYear(Number(event.target.value))} className="w-full rounded-xl border border-slate-200 bg-white p-2.5 text-xs dark:border-slate-700 dark:bg-slate-800 dark:text-white">
                    {[1, 2, 3, 4, 5, 6, 7].map((year) => <option key={year} value={year}>Year {year}</option>)}
                  </select>
                </div>
                {profileSaveError && <p role="alert" className="text-[11px] font-semibold text-rose-600">{profileSaveError}</p>}
                <div className="flex gap-2">
                  <button type="button" onClick={() => { setIsEditingDetails(false); setProfileSaveError(null); }} className="flex-1 rounded-xl border border-slate-200 px-3 py-2 text-xs font-bold dark:border-slate-700">Cancel</button>
                  <button type="submit" disabled={isSavingProfile} className="flex-1 rounded-xl bg-sparkle-purple px-3 py-2 text-xs font-extrabold text-white disabled:opacity-50">{isSavingProfile ? 'Saving...' : 'Save changes'}</button>
                </div>
              </form>
            ) : (
              <>
                <p className="mt-1 text-xs text-slate-600 dark:text-slate-400 leading-relaxed font-medium">{currentUser.bio}</p>
                <button type="button" onClick={() => { setEditBio(currentUser.bio); setEditFaculty(currentUser.faculty); setEditYear(currentUser.yearOfStudy); setIsEditingDetails(true); }} className="mt-2 inline-flex items-center gap-1 rounded-lg bg-sparkle-purple/10 px-2.5 py-1.5 text-[10px] font-bold text-sparkle-purple hover:bg-sparkle-purple/15">
                  <Edit3 className="h-3 w-3" /> Edit profile details
                </button>
              </>
            )}
          </div>

          {/* University Details Card */}
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700 space-y-2.5 mb-4">
            <div className="flex items-center gap-2 text-xs font-bold text-slate-800 dark:text-slate-200">
              <Building className="w-4 h-4 text-sparkle-purple shrink-0" />
              <span>{currentUser.university.name} ({currentUser.university.shortName})</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs text-slate-600 dark:text-slate-400">
                <BookOpen className="w-4 h-4 text-sparkle-orange shrink-0" />
                <span>{currentUser.course} • Year {currentUser.yearOfStudy}</span>
              </div>
              <button
                onClick={() => setIsCourseSearchOpen(true)}
                className="px-2.5 py-1 rounded-lg bg-sparkle-purple/10 hover:bg-sparkle-purple/20 text-sparkle-purple font-bold text-[10px] flex items-center gap-1 transition-all"
              >
                <Edit3 className="w-3 h-3" />
                <span>Change Course</span>
              </button>
            </div>
            <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-500">
              <Calendar className="w-4 h-4 text-slate-400 shrink-0" />
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
                    className="text-xs px-2.5 py-1 rounded-lg bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-300 font-semibold border border-emerald-200 dark:border-emerald-800"
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
                    className="text-xs px-2.5 py-1 rounded-lg bg-indigo-50 dark:bg-indigo-900/20 text-indigo-700 dark:text-indigo-300 font-semibold border border-indigo-200 dark:border-indigo-800"
                  >
                    {interest}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Platform Stats Footer */}
          <div className="border-t border-slate-200 dark:border-slate-700 pt-3 flex items-center gap-2 text-[11px] text-slate-500 dark:text-slate-400">
            <Sparkles className="w-3.5 h-3.5 text-sparkle-purple" />
            <span>Sparkle Connect • Kenyan Campus Network 🇰🇪</span>
          </div>
        </div>
      </div>
    </div>

    <AvatarEditModal
      isOpen={isAvatarEditOpen}
      onClose={() => setIsAvatarEditOpen(false)}
    />

    <CourseSearchModal
      isOpen={isCourseSearchOpen}
      onClose={() => setIsCourseSearchOpen(false)}
      onSelectCourse={(courseTitle) => updateCourse(courseTitle)}
      selectedUniversityId={currentUser.university.id}
    />
  </>
  );
};
