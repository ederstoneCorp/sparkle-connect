import React, { useState, useRef } from 'react';
import { useSparkle } from '../../context/SparkleContext';
import { PostCategory, PostVisibility } from '../../types/models';
import {
  X,
  Sparkles,
  Image as ImageIcon,
  Hash,
  EyeOff,
  Send,
  Upload,
  Camera,
  Globe,
  Users,
  Building,
  Lock,
  MessageSquareOff,
  ChevronLeft,
  ChevronRight,
  Maximize2,
  CheckCircle2,
} from 'lucide-react';
import { compressImage, formatFileSize, CompressionResult } from '../../utils/imageCompression';

interface CreatePostModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface AttachedImage {
  id: string;
  dataUrl: string;
  originalSize: number;
  compressedSize: number;
  reductionPercentage: number;
}

export const CreatePostModal: React.FC<CreatePostModalProps> = ({ isOpen, onClose }) => {
  const { addPost, currentUser } = useSparkle();

  const [content, setContent] = useState('');
  const [category, setCategory] = useState<PostCategory>('CAMPUS_LIFE');
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [visibility, setVisibility] = useState<PostVisibility>('CAMPUS_COMMUNITY');
  const [commentsDisabled, setCommentsDisabled] = useState(false);
  const [tagInput, setTagInput] = useState('');
  const [attachedImages, setAttachedImages] = useState<AttachedImage[]>([]);
  const [isCompressing, setIsCompressing] = useState(false);
  const [compressionStatus, setCompressionStatus] = useState<string | null>(null);
  const [previewModalImage, setPreviewModalImage] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const handleImageSelect = async (files: FileList | null) => {
    if (!files || files.length === 0) return;

    const availableSlots = 5 - attachedImages.length;
    if (availableSlots <= 0) return;

    const filesToProcess = Array.from(files).slice(0, availableSlots);
    setIsCompressing(true);
    setCompressionStatus(`Compressing ${filesToProcess.length} image(s)...`);

    const newAttached: AttachedImage[] = [];

    for (let i = 0; i < filesToProcess.length; i++) {
      const file = filesToProcess[i];
      try {
        const result: CompressionResult = await compressImage(file, 1440, 1440, 0.82);
        newAttached.push({
          id: `img_${Date.now()}_${i}`,
          dataUrl: result.dataUrl,
          originalSize: result.originalSize,
          compressedSize: result.compressedSize,
          reductionPercentage: result.reductionPercentage,
        });
      } catch (err) {
        console.error('Error compressing image:', err);
      }
    }

    setAttachedImages((prev) => [...prev, ...newAttached]);
    setIsCompressing(false);
    setCompressionStatus(null);
  };

  const removeImage = (id: string) => {
    setAttachedImages((prev) => prev.filter((img) => img.id !== id));
  };

  const moveImage = (index: number, direction: 'left' | 'right') => {
    const targetIdx = direction === 'left' ? index - 1 : index + 1;
    if (targetIdx < 0 || targetIdx >= attachedImages.length) return;

    const updated = [...attachedImages];
    const temp = updated[index];
    updated[index] = updated[targetIdx];
    updated[targetIdx] = temp;
    setAttachedImages(updated);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim() && attachedImages.length === 0) return;

    const tags = tagInput
      .split(',')
      .map((t) => t.trim().replace(/^#/, ''))
      .filter((t) => t.length > 0);

    const imageUrls = attachedImages.map((img) => img.dataUrl);

    addPost(
      content.trim() || '📸 Campus update',
      isAnonymous ? 'ANONYMOUS' : category,
      isAnonymous,
      tags,
      imageUrls.length > 0 ? imageUrls[0] : undefined,
      imageUrls,
      visibility,
      commentsDisabled
    );

    // Reset form
    setContent('');
    setTagInput('');
    setAttachedImages([]);
    setIsAnonymous(false);
    setVisibility('CAMPUS_COMMUNITY');
    setCommentsDisabled(false);
    onClose();
  };

  return (
    <>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm overflow-y-auto animate-in fade-in duration-200">
        <div className="relative w-full max-w-lg bg-white dark:bg-sparkle-darkSurface rounded-3xl shadow-2xl border border-slate-100 dark:border-slate-700 overflow-hidden my-8">
          
          {/* Header with 'X' Quick-Close button */}
          <div className="p-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-sparkle-purple/10 flex items-center justify-center text-sparkle-purple">
                <Sparkles className="w-4 h-4" />
              </div>
              <h3 className="font-extrabold text-base text-slate-900 dark:text-slate-100">
                Create Campus Post
              </h3>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
              aria-label="Close modal"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Form Body */}
          <form onSubmit={handleSubmit} className="p-5 space-y-4">
            
            {/* User identity & Visibility row */}
            <div className="flex items-center justify-between bg-slate-50 dark:bg-slate-800/80 p-3 rounded-2xl border border-slate-200/80 dark:border-slate-700">
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
                  <p className="text-xs font-bold text-slate-900 dark:text-slate-100">
                    {isAnonymous ? 'Secret Comrade 🤫' : currentUser?.displayName}
                  </p>
                  <p className="text-[10px] text-slate-500 dark:text-slate-400 font-medium">
                    {isAnonymous ? 'Identities hidden' : currentUser?.university.shortName}
                  </p>
                </div>
              </div>

              {/* Visibility Selector */}
              <div className="relative">
                <select
                  value={visibility}
                  onChange={(e) => setVisibility(e.target.value as PostVisibility)}
                  className="px-2.5 py-1 text-xs rounded-xl border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-700 dark:text-slate-200 font-bold focus:outline-none focus:ring-2 focus:ring-sparkle-purple/30 cursor-pointer"
                >
                  <option value="CAMPUS_COMMUNITY">🏛️ Campus Only</option>
                  <option value="PUBLIC">🌍 Public</option>
                  <option value="CONNECTIONS">👥 Connections</option>
                  <option value="PRIVATE">🔒 Private</option>
                </select>
              </div>
            </div>

            {/* Text Area */}
            <div>
              <textarea
                required={attachedImages.length === 0}
                rows={4}
                placeholder={
                  isAnonymous
                    ? "Share an anonymous secret, campus crush, or unspoken university confession..."
                    : "What's happening on your campus today? Tech hackathon, study group, or exam updates..."
                }
                value={content}
                onChange={(e) => setContent(e.target.value)}
                className="w-full p-3.5 text-xs rounded-2xl border border-slate-200 dark:border-slate-700 bg-transparent text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-sparkle-purple/30 resize-none font-medium leading-relaxed placeholder:text-slate-400"
              />
            </div>

            {/* Client-Side Attached Images Previewer */}
            {attachedImages.length > 0 && (
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs text-slate-600 dark:text-slate-400 font-bold">
                  <span>Attached Photos ({attachedImages.length}/5)</span>
                  <span className="text-[11px] text-emerald-600 dark:text-emerald-400 font-medium flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" /> Compressed for fast loading
                  </span>
                </div>

                <div className="flex gap-2.5 overflow-x-auto pb-1.5 scrollbar-thin">
                  {attachedImages.map((img, idx) => (
                    <div
                      key={img.id}
                      className="relative shrink-0 w-24 h-24 rounded-xl overflow-hidden border border-slate-200 dark:border-slate-700 group bg-slate-100"
                    >
                      <img
                        src={img.dataUrl}
                        alt={`Attachment ${idx + 1}`}
                        className="w-full h-full object-cover"
                      />

                      {/* Tap to view full preview */}
                      <button
                        type="button"
                        onClick={() => setPreviewModalImage(img.dataUrl)}
                        className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white"
                        title="Click to preview"
                      >
                        <Maximize2 className="w-4 h-4" />
                      </button>

                      {/* Remove 'X' button */}
                      <button
                        type="button"
                        onClick={() => removeImage(img.id)}
                        className="absolute top-1 right-1 p-1 rounded-full bg-black/60 hover:bg-black/90 text-white transition-colors"
                        title="Remove photo"
                      >
                        <X className="w-3 h-3" />
                      </button>

                      {/* Reorder Arrows */}
                      <div className="absolute bottom-1 left-1 right-1 flex justify-between opacity-0 group-hover:opacity-100 transition-opacity pointer-events-auto">
                        {idx > 0 && (
                          <button
                            type="button"
                            onClick={(e) => { e.stopPropagation(); moveImage(idx, 'left'); }}
                            className="p-0.5 rounded bg-black/60 text-white hover:bg-black/80"
                          >
                            <ChevronLeft className="w-3 h-3" />
                          </button>
                        )}
                        <span className="text-[9px] bg-black/60 text-white px-1 rounded font-bold ml-auto mr-auto">
                          {idx + 1}
                        </span>
                        {idx < attachedImages.length - 1 && (
                          <button
                            type="button"
                            onClick={(e) => { e.stopPropagation(); moveImage(idx, 'right'); }}
                            className="p-0.5 rounded bg-black/60 text-white hover:bg-black/80"
                          >
                            <ChevronRight className="w-3 h-3" />
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Compression Feedback Indicator */}
            {isCompressing && (
              <div className="p-2.5 rounded-xl bg-sparkle-purple/10 border border-sparkle-purple/20 flex items-center gap-2 text-sparkle-purple text-xs font-semibold animate-pulse">
                <Sparkles className="w-4 h-4 animate-spin" />
                <span>{compressionStatus}</span>
              </div>
            )}

            {/* Photo Selection Buttons & Inputs */}
            <input
              ref={fileInputRef}
              type="file"
              multiple
              accept="image/jpeg,image/png,image/webp,image/gif"
              onChange={(e) => handleImageSelect(e.target.files)}
              className="hidden"
            />
            <input
              ref={cameraInputRef}
              type="file"
              accept="image/*"
              capture="environment"
              onChange={(e) => handleImageSelect(e.target.files)}
              className="hidden"
            />

            <div className="flex items-center gap-2">
              <button
                type="button"
                disabled={attachedImages.length >= 5 || isCompressing}
                onClick={() => fileInputRef.current?.click()}
                className="flex-1 py-2 px-3 rounded-xl border border-slate-200 dark:border-slate-700 hover:border-sparkle-purple hover:bg-sparkle-purple/5 dark:hover:bg-sparkle-purple/10 text-slate-700 dark:text-slate-300 font-bold text-xs flex items-center justify-center gap-1.5 transition-all disabled:opacity-50"
              >
                <Upload className="w-3.5 h-3.5 text-sparkle-purple" />
                <span>Add Photos ({attachedImages.length}/5)</span>
              </button>

              <button
                type="button"
                disabled={attachedImages.length >= 5 || isCompressing}
                onClick={() => cameraInputRef.current?.click()}
                className="py-2 px-3 rounded-xl border border-slate-200 dark:border-slate-700 hover:border-emerald-500 hover:bg-emerald-50/40 text-slate-700 dark:text-slate-300 font-bold text-xs flex items-center justify-center gap-1.5 transition-all disabled:opacity-50"
                title="Capture from camera"
              >
                <Camera className="w-3.5 h-3.5 text-emerald-600" />
                <span className="hidden sm:inline">Camera</span>
              </button>
            </div>

            {/* Category & Tags Input */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-400 mb-1">Category</label>
                <select
                  disabled={isAnonymous}
                  value={category}
                  onChange={(e) => setCategory(e.target.value as PostCategory)}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-sparkle-purple/30 font-semibold disabled:bg-slate-100"
                >
                  <option value="CAMPUS_LIFE">Campus Life</option>
                  <option value="TECH">Tech & Coding</option>
                  <option value="ACADEMICS">Academics & Exams</option>
                  <option value="CAREER">Career & Internships</option>
                  <option value="OPPORTUNITIES">Scholarships & Grants</option>
                  <option value="ENTREPRENEURSHIP">Campus Hustles</option>
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-400 mb-1">
                  Tags (comma-separated)
                </label>
                <div className="relative">
                  <Hash className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    placeholder="uon, hackathon, exams"
                    value={tagInput}
                    onChange={(e) => setTagInput(e.target.value)}
                    className="w-full pl-8 pr-2.5 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-transparent text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-sparkle-purple/30 font-medium"
                  />
                </div>
              </div>
            </div>

            {/* Toggles: Comments & Anonymous */}
            <div className="flex items-center justify-between pt-1">
              <label className="flex items-center gap-2 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={commentsDisabled}
                  onChange={(e) => setCommentsDisabled(e.target.checked)}
                  className="w-4 h-4 rounded text-sparkle-purple focus:ring-sparkle-purple cursor-pointer"
                />
                <span className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1">
                  <MessageSquareOff className="w-3.5 h-3.5 text-sparkle-orange" /> Disable Comments
                </span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={isAnonymous}
                  onChange={(e) => setIsAnonymous(e.target.checked)}
                  className="w-4 h-4 rounded text-sparkle-purple focus:ring-sparkle-purple cursor-pointer"
                />
                <span className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1">
                  <EyeOff className="w-3.5 h-3.5 text-sparkle-pink" /> Confession / Anon
                </span>
              </label>
            </div>

            {/* Submit & Cancel */}
            <div className="pt-2 flex justify-end gap-2 border-t border-slate-100 dark:border-slate-800">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-xs font-bold rounded-xl border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isCompressing || (!content.trim() && attachedImages.length === 0)}
                className="px-5 py-2 text-xs font-extrabold rounded-xl bg-sparkle-purple hover:bg-sparkle-purple-dark text-white flex items-center gap-1.5 shadow-md shadow-sparkle-purple/20 transition-all disabled:opacity-50"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Publish Post</span>
              </button>
            </div>
          </form>

        </div>
      </div>

      {/* Enlarged Photo Preview Lightbox Modal with 'X' button */}
      {previewModalImage && (
        <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-150">
          <div className="relative max-w-2xl w-full max-h-[85vh] flex flex-col items-center justify-center">
            <button
              onClick={() => setPreviewModalImage(null)}
              className="absolute -top-12 right-0 p-2 rounded-full bg-white/20 hover:bg-white/40 text-white transition-colors"
              aria-label="Close photo preview"
            >
              <X className="w-6 h-6" />
            </button>
            <img
              src={previewModalImage}
              alt="Enlarged attachment preview"
              className="max-w-full max-h-[80vh] object-contain rounded-2xl shadow-2xl"
            />
          </div>
        </div>
      )}
    </>
  );
};
