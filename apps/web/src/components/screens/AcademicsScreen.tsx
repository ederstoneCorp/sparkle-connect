import React, { useState } from 'react';
import { BookOpen, Download, Upload, Search, FileText, CheckCircle2, Users, School } from 'lucide-react';
import { useSparkle } from '../../context/SparkleContext';

interface RevisionResource {
  id: string;
  title: string;
  subject: string;
  university: string;
  year: number;
  type: 'past_paper' | 'cat_notes' | 'revision_guide' | 'formula_sheet';
  downloadCount: number;
  uploadedBy: string;
  uploadedAt: string;
  isVerified: boolean;
  fileSize: string;
}

const SAMPLE_RESOURCES: RevisionResource[] = [
  {
    id: 'res_1',
    title: 'Calculus I & II Comprehensive Revision Notes',
    subject: 'Mathematics',
    university: 'UoN',
    year: 2025,
    type: 'revision_guide',
    downloadCount: 347,
    uploadedBy: 'Mercy Wanjiku',
    uploadedAt: '3 days ago',
    isVerified: true,
    fileSize: '2.4 MB',
  },
  {
    id: 'res_2',
    title: 'Data Structures & Algorithms CAT 1 Prep',
    subject: 'Computer Science',
    university: 'Strathmore',
    year: 2026,
    type: 'cat_notes',
    downloadCount: 218,
    uploadedBy: 'Faith Chebet',
    uploadedAt: '1 week ago',
    isVerified: true,
    fileSize: '1.1 MB',
  },
  {
    id: 'res_3',
    title: 'Organic Chemistry Past Papers 2022-2025',
    subject: 'Chemistry',
    university: 'JKUAT',
    year: 2025,
    type: 'past_paper',
    downloadCount: 512,
    uploadedBy: 'George Kariuki',
    uploadedAt: '2 weeks ago',
    isVerified: true,
    fileSize: '5.8 MB',
  },
  {
    id: 'res_4',
    title: 'Quantitative Methods Formula Sheet & Worked Examples',
    subject: 'Statistics',
    university: 'KU',
    year: 2026,
    type: 'formula_sheet',
    downloadCount: 189,
    uploadedBy: 'Brian Mutua',
    uploadedAt: '5 days ago',
    isVerified: false,
    fileSize: '0.8 MB',
  },
  {
    id: 'res_5',
    title: 'Introduction to Economics: Macro & Micro Notes',
    subject: 'Economics',
    university: 'Egerton',
    year: 2025,
    type: 'revision_guide',
    downloadCount: 94,
    uploadedBy: 'Winnie Atieno',
    uploadedAt: '1 month ago',
    isVerified: false,
    fileSize: '3.2 MB',
  },
  {
    id: 'res_6',
    title: 'Digital Logic & Computer Architecture Past Papers',
    subject: 'Electrical Engineering',
    university: 'TUK',
    year: 2024,
    type: 'past_paper',
    downloadCount: 276,
    uploadedBy: 'Kevin Omondi',
    uploadedAt: '2 months ago',
    isVerified: true,
    fileSize: '4.1 MB',
  },
];

const TYPE_LABELS: Record<RevisionResource['type'], { label: string; color: string }> = {
  past_paper: { label: '📄 Past Paper', color: 'bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-800' },
  cat_notes: { label: '📝 CAT Notes', color: 'bg-amber-50 dark:bg-amber-900/20 text-amber-700 dark:text-amber-300 border-amber-200 dark:border-amber-800' },
  revision_guide: { label: '📚 Revision Guide', color: 'bg-purple-50 dark:bg-purple-900/20 text-purple-700 dark:text-purple-300 border-purple-200 dark:border-purple-800' },
  formula_sheet: { label: '🔢 Formula Sheet', color: 'bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800' },
};

export const AcademicsScreen: React.FC = () => {
  const { currentUser, universities, selectedUniversityId, setIsAuthModalOpen } = useSparkle();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState<RevisionResource['type'] | 'ALL'>('ALL');
  const [uploadToast, setUploadToast] = useState(false);

  const filteredResources = SAMPLE_RESOURCES.filter((r) => {
    if (selectedUniversityId !== 'ALL') {
      const u = universities.find((u) => u.id === selectedUniversityId);
      if (u && !r.university.toLowerCase().includes(u.shortName.toLowerCase())) return false;
    }
    if (selectedType !== 'ALL' && r.type !== selectedType) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      if (!r.title.toLowerCase().includes(q) && !r.subject.toLowerCase().includes(q)) return false;
    }
    return true;
  });

  const handleDownload = (resource: RevisionResource) => {
    if (!currentUser) {
      setIsAuthModalOpen(true);
      return;
    }
    // In production: trigger real download from Supabase Storage
    alert(`Downloading "${resource.title}"\n\nIn production this connects to Supabase Storage. Please connect VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in your environment.`);
  };

  const handleUpload = () => {
    if (!currentUser) {
      setIsAuthModalOpen(true);
      return;
    }
    setUploadToast(true);
    setTimeout(() => setUploadToast(false), 3000);
  };

  return (
    <div className="space-y-4">
      {/* Upload Toast */}
      {uploadToast && (
        <div className="fixed top-20 left-1/2 -translate-x-1/2 z-50 bg-sparkle-purple text-white px-5 py-3 rounded-2xl shadow-xl text-sm font-bold animate-slide-down">
          ✅ Upload feature coming soon! Connect Supabase Storage to enable.
        </div>
      )}

      {/* Header */}
      <div className="bg-gradient-to-r from-indigo-600 via-sparkle-purple to-sparkle-pink p-6 rounded-3xl text-white shadow-md relative overflow-hidden animate-fade-in">
        <div className="relative z-10 max-w-xl">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/15 text-[11px] font-bold mb-2">
            <BookOpen className="w-3.5 h-3.5" />
            <span>CAT & Exam Revision Hub</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black tracking-tight">
            Revision Notes & Past Papers
          </h2>
          <p className="text-xs text-white/90 mt-1 leading-relaxed">
            Access peer-shared CAT notes, past examination papers, and formula sheets across Kenyan universities.
          </p>
        </div>
        <button
          onClick={handleUpload}
          className="mt-4 sm:mt-0 sm:absolute sm:top-6 sm:right-6 px-4 py-2.5 rounded-xl bg-white text-indigo-800 font-extrabold text-xs shadow-md hover:bg-indigo-50 transition-all flex items-center gap-1.5"
        >
          <Upload className="w-4 h-4 text-indigo-700" />
          <span>Upload Resource</span>
        </button>
      </div>

      {/* Search & Filters */}
      <div className="bg-white dark:bg-sparkle-darkSurface rounded-2xl border border-slate-200/80 dark:border-slate-700/60 p-4 shadow-xs flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by title or subject..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-600 focus:outline-none focus:ring-2 focus:ring-indigo-500/30 font-medium dark:text-slate-200 dark:placeholder-slate-500"
          />
        </div>
        <div className="flex items-center gap-1.5 flex-wrap">
          {(['ALL', 'past_paper', 'cat_notes', 'revision_guide', 'formula_sheet'] as const).map((type) => (
            <button
              key={type}
              onClick={() => setSelectedType(type)}
              className={`px-3 py-1.5 rounded-xl text-[11px] font-bold whitespace-nowrap transition-all border ${
                selectedType === type
                  ? 'bg-indigo-600 text-white border-indigo-600'
                  : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-600 hover:bg-slate-50'
              }`}
            >
              {type === 'ALL' ? '📋 All Types' : TYPE_LABELS[type].label}
            </button>
          ))}
        </div>
      </div>

      {/* Resources Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredResources.map((resource, idx) => (
          <div
            key={resource.id}
            className={`bg-white dark:bg-sparkle-darkSurface rounded-2xl border border-slate-200/80 dark:border-slate-700/60 p-5 shadow-xs hover:shadow-md transition-all animate-stagger-${Math.min(idx + 1, 4) as 1|2|3|4}`}
          >
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-indigo-100 to-purple-100 dark:from-indigo-900/30 dark:to-purple-900/30 flex items-center justify-center shrink-0">
                <FileText className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2 mb-1">
                  <h3 className="font-extrabold text-sm text-slate-900 dark:text-slate-100 leading-snug">
                    {resource.title}
                  </h3>
                  {resource.isVerified && (
                    <span title="Peer Verified" className="shrink-0 inline-flex items-center">
                      <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                    </span>
                  )}
                </div>

                <div className="flex flex-wrap gap-1.5 mb-3">
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md border ${TYPE_LABELS[resource.type].color}`}>
                    {TYPE_LABELS[resource.type].label}
                  </span>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-600 flex items-center gap-1">
                    <School className="w-2.5 h-2.5" />
                    {resource.university}
                  </span>
                  <span className="text-[10px] text-slate-500 dark:text-slate-400 px-2 py-0.5">
                    {resource.subject} • {resource.year}
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <div className="text-[10px] text-slate-500 dark:text-slate-400 space-y-0.5">
                    <p className="flex items-center gap-1">
                      <Users className="w-3 h-3" />
                      {resource.downloadCount} downloads • {resource.fileSize}
                    </p>
                    <p>By {resource.uploadedBy} • {resource.uploadedAt}</p>
                  </div>
                  <button
                    onClick={() => handleDownload(resource)}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold text-xs transition-all shadow-xs"
                  >
                    <Download className="w-3 h-3" />
                    <span>Download</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredResources.length === 0 && (
        <div className="bg-white dark:bg-sparkle-darkSurface rounded-2xl border border-slate-200/80 dark:border-slate-700/60 p-12 text-center">
          <BookOpen className="w-10 h-10 text-slate-300 mx-auto mb-2" />
          <h4 className="font-extrabold text-sm text-slate-800 dark:text-slate-200">No resources found</h4>
          <p className="text-xs text-slate-500 mt-1">Be the first to upload revision notes for your campus!</p>
          <button onClick={handleUpload} className="mt-4 px-4 py-2 rounded-xl bg-indigo-600 text-white text-xs font-bold">
            Upload First Resource
          </button>
        </div>
      )}
    </div>
  );
};
