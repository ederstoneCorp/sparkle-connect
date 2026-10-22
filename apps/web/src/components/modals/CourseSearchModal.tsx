import React, { useState, useRef, useEffect, useCallback } from 'react';
import { KENYAN_UNIVERSITIES_COURSES, CourseRecord } from '../../lib/coursesData';
import { useSparkle } from '../../context/SparkleContext';
import { Search, X, BookOpen, GraduationCap, Building2, CheckCircle2, PlusCircle, AlertCircle } from 'lucide-react';

interface CourseSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectCourse: (courseTitle: string) => void;
  selectedUniversityId?: string;
}

export const CourseSearchModal: React.FC<CourseSearchModalProps> = ({
  isOpen,
  onClose,
  onSelectCourse,
  selectedUniversityId,
}) => {
  const { universities } = useSparkle();
  const [query, setQuery] = useState('');
  const [levelFilter, setLevelFilter] = useState<string>('ALL');
  const [uniFilter, setUniFilter] = useState<string>(selectedUniversityId || 'ALL');
  const [showManualForm, setShowManualForm] = useState(false);
  const [manualTitle, setManualTitle] = useState('');
  const [manualLevel, setManualLevel] = useState<'Degree' | 'Diploma' | 'Certificate' | 'Postgraduate'>('Degree');
  const [manualDept, setManualDept] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  const [customCourses, setCustomCourses] = useState<CourseRecord[]>([]);

  useEffect(() => {
    if (isOpen) {
      setQuery('');
      setShowManualForm(false);
      setUniFilter(selectedUniversityId || 'ALL');
      setTimeout(() => inputRef.current?.focus(), 80);
    }
  }, [isOpen, selectedUniversityId]);

  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  const allCourses = [...KENYAN_UNIVERSITIES_COURSES, ...customCourses];

  const filtered = allCourses.filter((c) => {
    if (uniFilter !== 'ALL' && c.universityId !== uniFilter) return false;
    if (levelFilter !== 'ALL' && c.qualificationLevel !== levelFilter) return false;
    if (query.trim()) {
      const q = query.toLowerCase();
      return (
        c.title.toLowerCase().includes(q) ||
        c.shortName.toLowerCase().includes(q) ||
        c.universityName.toLowerCase().includes(q) ||
        c.department.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const handleSelect = useCallback((course: CourseRecord) => {
    onSelectCourse(course.title);
    onClose();
  }, [onSelectCourse, onClose]);

  const handleManualSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!manualTitle.trim()) return;

    const matchedUniv = universities.find((u) => u.id === uniFilter) || universities[0];

    const newCourse: CourseRecord = {
      id: `custom_course_${Date.now()}`,
      title: manualTitle.trim(),
      shortName: manualTitle.trim().slice(0, 25),
      qualificationLevel: manualLevel,
      universityId: matchedUniv.id,
      universityName: matchedUniv.name,
      department: manualDept.trim() || 'General Department',
      isVerified: false,
    };

    setCustomCourses((prev) => [...prev, newCourse]);
    onSelectCourse(newCourse.title);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-2xl bg-white dark:bg-sparkle-darkSurface rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-700 overflow-hidden flex flex-col max-h-[85vh]">

        {/* Header */}
        <div className="p-4 border-b border-slate-100 dark:border-slate-700 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-sparkle-purple to-sparkle-blue flex items-center justify-center text-white">
              <GraduationCap className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-extrabold text-sm text-slate-900 dark:text-slate-100">
                Kenyan University Course Directory
              </h2>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                Select your accredited course or enter manually
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Filters & Search Bar */}
        <div className="p-4 border-b border-slate-100 dark:border-slate-700 space-y-3 bg-slate-50/50 dark:bg-slate-800/50">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search by course name, abbreviation (e.g. BBIT, BSc CS), or faculty..."
              className="w-full pl-10 pr-10 py-2.5 rounded-xl text-xs font-medium bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-sparkle-purple/30"
            />
            {query && (
              <button
                onClick={() => setQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          <div className="flex flex-wrap gap-2 items-center">
            <select
              value={uniFilter}
              onChange={(e) => setUniFilter(e.target.value)}
              className="px-3 py-1.5 rounded-xl text-xs font-semibold bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 focus:outline-none"
            >
              <option value="ALL">🏛️ All Kenyan Universities</option>
              {universities.map((u) => (
                <option key={u.id} value={u.id}>{u.name} ({u.shortName})</option>
              ))}
            </select>

            <select
              value={levelFilter}
              onChange={(e) => setLevelFilter(e.target.value)}
              className="px-3 py-1.5 rounded-xl text-xs font-semibold bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 focus:outline-none"
            >
              <option value="ALL">🎓 All Qualification Levels</option>
              <option value="Degree">Degree</option>
              <option value="Diploma">Diploma</option>
              <option value="Certificate">Certificate</option>
              <option value="Postgraduate">Postgraduate</option>
            </select>

            <button
              onClick={() => setShowManualForm(!showManualForm)}
              className="ml-auto px-3 py-1.5 rounded-xl bg-sparkle-purple/10 text-sparkle-purple text-xs font-bold hover:bg-sparkle-purple/20 transition-all flex items-center gap-1.5"
            >
              <PlusCircle className="w-3.5 h-3.5" />
              {showManualForm ? 'Cancel Manual' : 'Course Not Listed? Enter Manually'}
            </button>
          </div>
        </div>

        {/* Manual Entry Form */}
        {showManualForm && (
          <form onSubmit={handleManualSubmit} className="p-4 bg-sparkle-purple/5 border-b border-sparkle-purple/20 space-y-3">
            <div className="flex items-center gap-2 text-xs font-extrabold text-sparkle-purple">
              <AlertCircle className="w-4 h-4" />
              <span>Add Custom / Unverified Course</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <input
                type="text"
                placeholder="Course Title (e.g. BSc Cybersecurity)"
                value={manualTitle}
                onChange={(e) => setManualTitle(e.target.value)}
                required
                className="px-3 py-2 rounded-xl text-xs font-medium bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-100"
              />
              <select
                value={manualLevel}
                onChange={(e) => setManualLevel(e.target.value as any)}
                className="px-3 py-2 rounded-xl text-xs font-medium bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-100"
              >
                <option value="Degree">Degree</option>
                <option value="Diploma">Diploma</option>
                <option value="Certificate">Certificate</option>
                <option value="Postgraduate">Postgraduate</option>
              </select>
            </div>
            <input
              type="text"
              placeholder="Department / Faculty (optional)"
              value={manualDept}
              onChange={(e) => setManualDept(e.target.value)}
              className="w-full px-3 py-2 rounded-xl text-xs font-medium bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-100"
            />
            <button
              type="submit"
              className="w-full py-2 rounded-xl bg-sparkle-purple text-white text-xs font-bold hover:bg-sparkle-purple-dark transition-all flex items-center justify-center gap-1.5"
            >
              <CheckCircle2 className="w-4 h-4" />
              Save Course to Profile (Unverified)
            </button>
          </form>
        )}

        {/* Results List */}
        <div className="flex-1 overflow-y-auto p-3 space-y-2">
          {filtered.length === 0 ? (
            <div className="py-12 text-center text-slate-400">
              <BookOpen className="w-10 h-10 mx-auto mb-2 opacity-40" />
              <p className="text-xs font-bold text-slate-700 dark:text-slate-300">No courses match your search</p>
              <p className="text-[11px] mt-1">Try broadening your search or click "Course Not Listed? Enter Manually"</p>
            </div>
          ) : (
            filtered.map((course) => (
              <button
                key={course.id}
                onClick={() => handleSelect(course)}
                className="w-full text-left p-3 rounded-2xl border border-slate-100 dark:border-slate-700/60 hover:border-sparkle-purple/40 hover:bg-sparkle-purple/5 transition-all flex items-start justify-between group"
              >
                <div className="space-y-1 min-w-0 pr-3">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-xs font-extrabold text-slate-900 dark:text-slate-100 group-hover:text-sparkle-purple">
                      {course.title}
                    </span>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300">
                      {course.qualificationLevel}
                    </span>
                    {!course.isVerified && (
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-amber-50 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300">
                        User-Submitted (Unverified)
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-3 text-[11px] text-slate-500 dark:text-slate-400">
                    <span className="flex items-center gap-1 font-semibold text-sparkle-purple">
                      <Building2 className="w-3.5 h-3.5" />
                      {course.universityName}
                    </span>
                    <span>•</span>
                    <span>{course.department}</span>
                  </div>
                </div>
                <div className="w-8 h-8 rounded-xl bg-slate-100 dark:bg-slate-700 flex items-center justify-center text-slate-400 group-hover:bg-sparkle-purple group-hover:text-white transition-all shrink-0">
                  <CheckCircle2 className="w-4 h-4" />
                </div>
              </button>
            ))
          )}
        </div>

        {/* Footer */}
        <div className="p-3 border-t border-slate-100 dark:border-slate-700 flex items-center justify-between text-[11px] text-slate-400">
          <span>{filtered.length} accredited Kenyan courses available</span>
          <span>Verified CUE Directory</span>
        </div>
      </div>
    </div>
  );
};
