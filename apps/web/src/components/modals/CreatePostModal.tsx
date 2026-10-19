import React, { useState } from 'react';
import { useSparkle } from '../../context/SparkleContext';
import { PostCategory } from '../../types/models';
import { X, Sparkles, Image, Hash, EyeOff, Send } from 'lucide-react';

interface CreatePostModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CreatePostModal: React.FC<CreatePostModalProps> = ({ isOpen, onClose }) => {
  const { addPost, currentUser } = useSparkle();

  const [content, setContent] = useState('');
  const [category, setCategory] = useState<PostCategory>('CAMPUS_LIFE');
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [tagInput, setTagInput] = useState('');
  const [mediaUrl, setMediaUrl] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) return;

    const tags = tagInput
      .split(',')
      .map((t) => t.trim().replace(/^#/, ''))
      .filter((t) => t.length > 0);

    addPost(
      content.trim(),
      isAnonymous ? 'ANONYMOUS' : category,
      isAnonymous,
      tags,
      mediaUrl.trim() || undefined
    );

    setContent('');
    setTagInput('');
    setMediaUrl('');
    setIsAnonymous(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-slate-100 overflow-hidden my-8 animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="p-5 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-sparkle-purple/10 flex items-center justify-center text-sparkle-purple">
              <Sparkles className="w-4 h-4" />
            </div>
            <h3 className="font-extrabold text-base text-slate-900">Create Campus Post</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          {/* User info preview or anonymous switch */}
          <div className="flex items-center justify-between bg-slate-50 p-3 rounded-2xl border border-slate-200/80">
            <div className="flex items-center gap-2.5">
              <img
                src={
                  isAnonymous
                    ? 'https://api.dicebear.com/7.x/bottts/svg?seed=sparkle_anon'
                    : currentUser?.avatarUrl || 'https://api.dicebear.com/7.x/avataaars/svg?seed=sparkle'
                }
                alt=""
                className="w-8 h-8 rounded-full bg-slate-200 object-cover"
              />
              <div>
                <p className="text-xs font-bold text-slate-900">
                  {isAnonymous ? 'Secret Comrade 🤫' : currentUser?.displayName}
                </p>
                <p className="text-[10px] text-slate-500 font-medium">
                  {isAnonymous ? 'Identities hidden' : currentUser?.university.shortName}
                </p>
              </div>
            </div>

            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={isAnonymous}
                onChange={(e) => setIsAnonymous(e.target.checked)}
                className="w-4 h-4 rounded text-sparkle-purple focus:ring-sparkle-purple cursor-pointer"
              />
              <span className="text-xs font-bold text-slate-700 flex items-center gap-1">
                <EyeOff className="w-3.5 h-3.5 text-sparkle-orange" /> Confession / Anon
              </span>
            </label>
          </div>

          {/* Text Area */}
          <div>
            <textarea
              required
              rows={4}
              placeholder={
                isAnonymous
                  ? "Share an anonymous secret, campus crush, or unspoken university confession..."
                  : "What's happening on your campus today? Tech hackathon, study group, or exam updates..."
              }
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="w-full p-3.5 text-xs rounded-2xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-sparkle-purple/30 resize-none font-medium leading-relaxed"
            />
          </div>

          {/* Category Dropdown */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] font-bold text-slate-600 mb-1">Category</label>
              <select
                disabled={isAnonymous}
                value={category}
                onChange={(e) => setCategory(e.target.value as PostCategory)}
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-sparkle-purple/30 font-semibold disabled:bg-slate-100"
              >
                <option value="CAMPUS_LIFE">Campus Life</option>
                <option value="TECH">Tech & Coding</option>
                <option value="ACADEMICS">Academics & Exams</option>
                <option value="CAREER">Career & Internships</option>
                <option value="OPPORTUNITIES">Scholarships & Grants</option>
                <option value="ENTREPRENEURSHIP">Campus Hustles</option>
              </select>
            </div>

            {/* Tags Input */}
            <div>
              <label className="block text-[11px] font-bold text-slate-600 mb-1">
                Tags (comma-separated)
              </label>
              <div className="relative">
                <Hash className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="uon, hackathon, exams"
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  className="w-full pl-8 pr-2.5 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-sparkle-purple/30 font-medium"
                />
              </div>
            </div>
          </div>

          {/* Optional Image URL */}
          <div>
            <label className="block text-[11px] font-bold text-slate-600 mb-1">
              Image / Media URL (Optional)
            </label>
            <div className="relative">
              <Image className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
              <input
                type="url"
                placeholder="https://images.unsplash.com/..."
                value={mediaUrl}
                onChange={(e) => setMediaUrl(e.target.value)}
                className="w-full pl-8 pr-2.5 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-sparkle-purple/30 font-medium"
              />
            </div>
          </div>

          {/* Submit */}
          <div className="pt-2 flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-bold rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 text-xs font-extrabold rounded-xl bg-sparkle-purple hover:bg-sparkle-purple-dark text-white flex items-center gap-1.5 shadow-md shadow-sparkle-purple/20 transition-all"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Publish Post</span>
            </button>
          </div>
        </form>

      </div>
    </div>
  );
};
