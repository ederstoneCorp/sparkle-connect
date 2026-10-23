import React, { useState } from 'react';
import { useSparkle } from '../../context/SparkleContext';
import { CampusPost } from '../../types/models';
import {
  Heart,
  MessageCircle,
  Share2,
  Bookmark,
  MoreVertical,
  Trash2,
  Edit2,
  MessageSquareOff,
  Flag,
  UserX,
  X,
  Lock,
  EyeOff,
  ShieldCheck,
  Send,
  ChevronLeft,
  ChevronRight,
  Maximize2,
  Check,
} from 'lucide-react';

interface PostCardProps {
  post: CampusPost;
  categoryColorClass?: string;
}

export const PostCard: React.FC<PostCardProps> = ({ post, categoryColorClass }) => {
  const {
    currentUser,
    toggleLikePost,
    addComment,
    deletePost,
    updatePostCaption,
    toggleCommentsDisabled,
    toggleSavePost,
    setIsAuthModalOpen,
  } = useSparkle();

  const [isCommentsOpen, setIsCommentsOpen] = useState(false);
  const [commentText, setCommentText] = useState('');
  const [isCommentAnon, setIsCommentAnon] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const [isEditingCaption, setIsEditingCaption] = useState(false);
  const [editedCaption, setEditedCaption] = useState(post.content);
  const [showReportModal, setShowReportModal] = useState(false);
  const [reportReason, setReportReason] = useState('Inappropriate Content');
  const [reportSubmitted, setReportSubmitted] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const [isCopied, setIsCopied] = useState(false);

  const isAuthor = currentUser && (currentUser.id === post.authorId || currentUser.id === 'user_holdstone');

  const postImages = post.images && post.images.length > 0 ? post.images : post.mediaUrl ? [post.mediaUrl] : [];

  const handleLike = () => {
    if (!currentUser) {
      setIsAuthModalOpen(true);
      return;
    }
    toggleLikePost(post.id);
  };

  const handleCommentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser) {
      setIsAuthModalOpen(true);
      return;
    }
    if (!commentText.trim()) return;
    addComment(post.id, commentText.trim(), isCommentAnon);
    setCommentText('');
  };

  const handleShare = () => {
    navigator.clipboard?.writeText(window.location.href);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  const handleSaveEditCaption = () => {
    if (editedCaption.trim()) {
      updatePostCaption(post.id, editedCaption.trim());
    }
    setIsEditingCaption(false);
  };

  const handleReport = (e: React.FormEvent) => {
    e.preventDefault();
    setReportSubmitted(true);
    setTimeout(() => {
      setShowReportModal(false);
      setReportSubmitted(false);
    }, 1500);
  };

  return (
    <article className="bg-white dark:bg-sparkle-darkSurface rounded-2xl border border-slate-200/80 dark:border-slate-700/60 p-5 shadow-xs transition-shadow hover:shadow-md relative">
      
      {/* Anonymous confession notice */}
      {post.isAnonymous && (
        <div className="flex items-center gap-2 mb-3 p-2.5 rounded-xl bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800">
          <Lock className="w-4 h-4 text-amber-600 dark:text-amber-400" />
          <p className="text-[11px] font-bold text-amber-700 dark:text-amber-300">
            Anonymous Confession — Identity fully protected 🔒
          </p>
        </div>
      )}

      {/* Header: Author & Options */}
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="flex items-center gap-3">
          {post.isAnonymous ? (
            <div className="w-10 h-10 rounded-full bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center shrink-0">
              <EyeOff className="w-5 h-5 text-amber-600" />
            </div>
          ) : (
            <img
              src={
                post.authorAvatar && !['FC', 'KO', 'AH', 'GK', 'MW', 'DK', 'DM', 'LA', 'PK', 'KU'].includes(post.authorAvatar)
                  ? post.authorAvatar
                  : `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(post.authorName)}`
              }
              alt={post.authorName}
              className="w-10 h-10 rounded-full bg-slate-100 object-cover ring-2 ring-slate-100 dark:ring-slate-700 shrink-0"
            />
          )}

          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <span className="font-extrabold text-sm text-slate-900 dark:text-slate-100">
                {post.authorName}
              </span>
              {!post.isAnonymous && post.isAuthorVerified && (
                <span className="inline-flex items-center gap-1 text-[10px] font-bold px-1.5 py-0.5 rounded-md bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800">
                  <ShieldCheck className="w-3 h-3" /> Verified
                </span>
              )}
              {!post.isAnonymous && post.authorUniversity && (
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-md border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300">
                  {post.authorUniversity}
                </span>
              )}
            </div>

            <p className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">
              {!post.isAnonymous && post.authorCourse && `${post.authorCourse} • `}
              {post.timeAgo}
              {post.visibility && (
                <span className="ml-1 text-[10px] text-slate-400 font-normal">
                  • {post.visibility === 'PUBLIC' ? '🌍 Public' : post.visibility === 'CONNECTIONS' ? '👥 Connections' : post.visibility === 'PRIVATE' ? '🔒 Private' : '🏛️ Campus'}
                </span>
              )}
            </p>
          </div>
        </div>

        {/* Right side Category pill & 3-dots Menu */}
        <div className="flex items-center gap-2">
          <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md border ${categoryColorClass || 'bg-slate-100 text-slate-600'}`}>
            #{post.category.replace('_', ' ')}
          </span>

          <div className="relative">
            <button
              onClick={() => setShowMenu(!showMenu)}
              className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              aria-label="Post options"
            >
              <MoreVertical className="w-4 h-4" />
            </button>

            {showMenu && (
              <div className="absolute right-0 top-full mt-1 w-48 bg-white dark:bg-slate-800 rounded-xl shadow-xl border border-slate-100 dark:border-slate-700 py-1.5 z-30 animate-in fade-in zoom-in-95 duration-100">
                {isAuthor && (
                  <>
                    <button
                      onClick={() => { setShowMenu(false); setIsEditingCaption(true); }}
                      className="w-full px-3 py-2 text-left text-xs font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700 flex items-center gap-2"
                    >
                      <Edit2 className="w-3.5 h-3.5 text-slate-400" />
                      <span>Edit Caption</span>
                    </button>
                    <button
                      onClick={() => { setShowMenu(false); toggleCommentsDisabled(post.id); }}
                      className="w-full px-3 py-2 text-left text-xs font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700 flex items-center gap-2"
                    >
                      <MessageSquareOff className="w-3.5 h-3.5 text-slate-400" />
                      <span>{post.commentsDisabled ? 'Enable Comments' : 'Disable Comments'}</span>
                    </button>
                    <button
                      onClick={() => { setShowMenu(false); deletePost(post.id); }}
                      className="w-full px-3 py-2 text-left text-xs font-semibold text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-900/20 flex items-center gap-2"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>Delete Post</span>
                    </button>
                    <div className="border-t border-slate-100 dark:border-slate-700 my-1" />
                  </>
                )}
                <button
                  onClick={() => { setShowMenu(false); setShowReportModal(true); }}
                  className="w-full px-3 py-2 text-left text-xs font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700 flex items-center gap-2"
                >
                  <Flag className="w-3.5 h-3.5 text-slate-400" />
                  <span>Report Post</span>
                </button>
                <button
                  onClick={() => { setShowMenu(false); alert(`Blocked interactions from ${post.authorName}`); }}
                  className="w-full px-3 py-2 text-left text-xs font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700 flex items-center gap-2"
                >
                  <UserX className="w-3.5 h-3.5 text-slate-400" />
                  <span>Block User</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Caption Content or Edit Form */}
      {isEditingCaption ? (
        <div className="mb-3 space-y-2">
          <textarea
            rows={3}
            value={editedCaption}
            onChange={(e) => setEditedCaption(e.target.value)}
            className="w-full p-2.5 text-xs rounded-xl border border-sparkle-purple focus:outline-none focus:ring-1 focus:ring-sparkle-purple bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 font-medium"
          />
          <div className="flex justify-end gap-2">
            <button
              onClick={() => setIsEditingCaption(false)}
              className="px-3 py-1 text-xs rounded-lg border border-slate-200 dark:border-slate-700 font-bold"
            >
              Cancel
            </button>
            <button
              onClick={handleSaveEditCaption}
              className="px-3 py-1 text-xs rounded-lg bg-sparkle-purple text-white font-bold"
            >
              Save
            </button>
          </div>
        </div>
      ) : (
        <p className="text-xs sm:text-sm text-slate-800 dark:text-slate-200 leading-relaxed font-normal whitespace-pre-line mb-3">
          {post.content}
        </p>
      )}

      {/* Multi-Image Display Grid / Carousel */}
      {postImages.length > 0 && (
        <div className="mb-3 rounded-2xl overflow-hidden bg-slate-100 dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700">
          {postImages.length === 1 ? (
            /* 1 Single Large Image */
            <div
              onClick={() => setLightboxIndex(0)}
              className="relative max-h-96 w-full overflow-hidden cursor-pointer group"
            >
              <img
                src={postImages[0]}
                alt="Post media"
                className="w-full h-full object-cover group-hover:scale-[1.01] transition-transform duration-200"
                loading="lazy"
              />
              <div className="absolute top-2 right-2 p-1.5 rounded-full bg-black/50 text-white opacity-0 group-hover:opacity-100 transition-opacity">
                <Maximize2 className="w-3.5 h-3.5" />
              </div>
            </div>
          ) : postImages.length === 2 ? (
            /* 2 Images Split Screen */
            <div className="grid grid-cols-2 gap-1 h-64">
              {postImages.map((img, idx) => (
                <div
                  key={idx}
                  onClick={() => setLightboxIndex(idx)}
                  className="relative h-full overflow-hidden cursor-pointer group"
                >
                  <img
                    src={img}
                    alt={`Attachment ${idx + 1}`}
                    className="w-full h-full object-cover group-hover:scale-[1.02] transition-transform duration-200"
                    loading="lazy"
                  />
                </div>
              ))}
            </div>
          ) : postImages.length === 3 ? (
            /* 3 Images: 1 Large Left, 2 Stacked Right */
            <div className="grid grid-cols-3 gap-1 h-72">
              <div
                onClick={() => setLightboxIndex(0)}
                className="col-span-2 h-full overflow-hidden cursor-pointer group"
              >
                <img
                  src={postImages[0]}
                  alt="Attachment 1"
                  className="w-full h-full object-cover group-hover:scale-[1.02] transition-transform duration-200"
                  loading="lazy"
                />
              </div>
              <div className="grid grid-rows-2 gap-1 h-full">
                {postImages.slice(1, 3).map((img, idx) => (
                  <div
                    key={idx}
                    onClick={() => setLightboxIndex(idx + 1)}
                    className="relative h-full overflow-hidden cursor-pointer group"
                  >
                    <img
                      src={img}
                      alt={`Attachment ${idx + 2}`}
                      className="w-full h-full object-cover group-hover:scale-[1.02] transition-transform duration-200"
                      loading="lazy"
                    />
                  </div>
                ))}
              </div>
            </div>
          ) : (
            /* 4+ Images: 2x2 Grid with Overlay Badge */
            <div className="grid grid-cols-2 gap-1 h-72">
              {postImages.slice(0, 4).map((img, idx) => (
                <div
                  key={idx}
                  onClick={() => setLightboxIndex(idx)}
                  className="relative h-full overflow-hidden cursor-pointer group"
                >
                  <img
                    src={img}
                    alt={`Attachment ${idx + 1}`}
                    className="w-full h-full object-cover group-hover:scale-[1.02] transition-transform duration-200"
                    loading="lazy"
                  />
                  {idx === 3 && postImages.length > 4 && (
                    <div className="absolute inset-0 bg-black/60 flex items-center justify-center text-white font-extrabold text-lg">
                      +{postImages.length - 4}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Tags */}
      {post.tags && post.tags.length > 0 && (
        <div className="flex flex-wrap gap-1.5 mb-3">
          {post.tags.map((tag, idx) => (
            <span
              key={idx}
              className="text-[10px] font-semibold text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded-full"
            >
              #{tag}
            </span>
          ))}
        </div>
      )}

      {/* Engagement Actions Row */}
      <div className="flex items-center justify-between border-t border-slate-100 dark:border-slate-800 pt-3">
        <div className="flex items-center gap-4">
          {/* Like */}
          <button
            onClick={handleLike}
            className={`flex items-center gap-1.5 text-xs font-bold transition-colors ${
              post.isLiked || post.isLikedByMe
                ? 'text-[#831843]'
                : 'text-slate-500 dark:text-slate-400 hover:text-[#831843]'
            }`}
          >
            <Heart
              className={`w-4 h-4 ${post.isLiked || post.isLikedByMe ? 'fill-[#831843]' : ''}`}
            />
            <span>{post.likesCount}</span>
          </button>

          {/* Comments */}
          <button
            onClick={() => setIsCommentsOpen(!isCommentsOpen)}
            className="flex items-center gap-1.5 text-xs font-bold text-slate-500 dark:text-slate-400 hover:text-sparkle-purple transition-colors"
          >
            <MessageCircle className="w-4 h-4" />
            <span>{post.comments ? post.comments.length : post.commentsCount}</span>
          </button>

          {/* Bookmark / Save */}
          <button
            onClick={() => toggleSavePost(post.id)}
            className={`text-slate-400 hover:text-sparkle-purple transition-colors ${
              post.isSaved || post.isSavedByMe ? 'text-sparkle-purple' : ''
            }`}
            title="Save post"
          >
            <Bookmark
              className={`w-4 h-4 ${post.isSaved || post.isSavedByMe ? 'fill-sparkle-purple' : ''}`}
            />
          </button>
        </div>

        {/* Share */}
        <button
          onClick={handleShare}
          className="flex items-center gap-1 text-xs font-bold text-slate-500 dark:text-slate-400 hover:text-sparkle-purple transition-colors"
        >
          {isCopied ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Share2 className="w-3.5 h-3.5" />}
          <span>{isCopied ? 'Link Copied!' : 'Share'}</span>
        </button>
      </div>

      {/* Instagram-style Likes summary */}
      {post.likesCount > 0 && (
        <p className="text-xs font-bold text-slate-900 dark:text-slate-100 mt-2 mb-1">
          {post.likesCount === 1 ? '1 like' : `${post.likesCount} likes`}
        </p>
      )}

      {/* Expanded Comments Section */}
      {isCommentsOpen && (
        <div className="mt-3 pt-3 border-t border-slate-100 dark:border-slate-800 space-y-3 animate-in fade-in duration-150">
          <div className="flex items-center justify-between text-xs font-bold text-slate-700 dark:text-slate-300">
            <span>Comments</span>
            <button
              onClick={() => setIsCommentsOpen(false)}
              className="text-slate-400 hover:text-slate-600 flex items-center gap-0.5 text-[11px]"
            >
              <X className="w-3 h-3" /> Close
            </button>
          </div>

          {post.commentsDisabled ? (
            <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/80 text-center text-xs text-slate-500 font-medium">
              Comments have been disabled for this campus post.
            </div>
          ) : (
            <>
              {/* Comment list */}
              <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
                {(!post.comments || post.comments.length === 0) ? (
                  <p className="text-xs text-slate-400 text-center py-2">
                    No comments yet. Start the conversation!
                  </p>
                ) : (
                  post.comments.map((comment) => (
                    <div
                      key={comment.id}
                      className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-700/60 text-xs"
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-bold text-slate-800 dark:text-slate-200">
                          {comment.isAnonymous ? 'Secret Comrade 🤫' : comment.authorName}
                        </span>
                        <span className="text-[10px] text-slate-400">{comment.timeAgo}</span>
                      </div>
                      <p className="text-slate-700 dark:text-slate-300">{comment.content}</p>
                    </div>
                  ))
                )}
              </div>

              {/* Add Comment Input */}
              <form onSubmit={handleCommentSubmit} className="flex gap-2">
                <input
                  type="text"
                  placeholder={isCommentAnon ? 'Comment anonymously...' : 'Write a comment...'}
                  value={commentText}
                  onChange={(e) => setCommentText(e.target.value)}
                  className="flex-1 px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-1 focus:ring-sparkle-purple font-medium"
                />
                <button
                  type="button"
                  onClick={() => setIsCommentAnon(!isCommentAnon)}
                  className={`p-2 rounded-xl border text-xs font-bold transition-colors ${
                    isCommentAnon
                      ? 'bg-amber-50 dark:bg-amber-900/20 text-amber-600 border-amber-300'
                      : 'border-slate-200 dark:border-slate-700 text-slate-500'
                  }`}
                  title="Toggle anonymous comment"
                >
                  <EyeOff className="w-4 h-4" />
                </button>
                <button
                  type="submit"
                  className="px-3 py-2 rounded-xl bg-sparkle-purple text-white text-xs font-bold hover:bg-sparkle-purple-dark transition-colors flex items-center justify-center"
                >
                  <Send className="w-3.5 h-3.5" />
                </button>
              </form>
            </>
          )}
        </div>
      )}

      {/* Fullscreen Multi-Image Lightbox Modal with 'X' button and arrow navigation */}
      {lightboxIndex !== null && (
        <div className="fixed inset-0 z-60 flex items-center justify-center bg-black/90 backdrop-blur-md p-4 animate-in fade-in duration-200">
          {/* Header Bar */}
          <div className="absolute top-4 left-4 right-4 flex items-center justify-between text-white z-10">
            <span className="text-xs font-bold bg-black/60 px-3 py-1.5 rounded-full">
              {lightboxIndex + 1} / {postImages.length}
            </span>
            <button
              onClick={() => setLightboxIndex(null)}
              className="p-2 rounded-full bg-white/20 hover:bg-white/40 text-white transition-colors"
              aria-label="Close image viewer"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Previous image arrow */}
          {postImages.length > 1 && (
            <button
              onClick={() => setLightboxIndex((prev) => (prev !== null && prev > 0 ? prev - 1 : postImages.length - 1))}
              className="absolute left-4 top-1/2 -translate-y-1/2 p-2.5 rounded-full bg-black/60 hover:bg-black/80 text-white transition-colors z-10"
              aria-label="Previous image"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>
          )}

          {/* Current Lightbox Image */}
          <div className="max-w-4xl max-h-[85vh] flex items-center justify-center">
            <img
              src={postImages[lightboxIndex]}
              alt={`Full view ${lightboxIndex + 1}`}
              className="max-w-full max-h-[85vh] object-contain rounded-xl shadow-2xl"
            />
          </div>

          {/* Next image arrow */}
          {postImages.length > 1 && (
            <button
              onClick={() => setLightboxIndex((prev) => (prev !== null && prev < postImages.length - 1 ? prev + 1 : 0))}
              className="absolute right-4 top-1/2 -translate-y-1/2 p-2.5 rounded-full bg-black/60 hover:bg-black/80 text-white transition-colors z-10"
              aria-label="Next image"
            >
              <ChevronRight className="w-6 h-6" />
            </button>
          )}
        </div>
      )}

      {/* Moderation / Report Modal */}
      {showReportModal && (
        <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="relative w-full max-w-md bg-white dark:bg-slate-800 rounded-3xl p-5 shadow-2xl border border-slate-100 dark:border-slate-700">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-700">
              <h4 className="font-extrabold text-sm text-slate-900 dark:text-slate-100 flex items-center gap-2">
                <Flag className="w-4 h-4 text-rose-500" />
                Report Post
              </h4>
              <button
                onClick={() => setShowReportModal(false)}
                className="p-1 rounded-full hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-400"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {reportSubmitted ? (
              <div className="py-6 text-center space-y-2">
                <ShieldCheck className="w-10 h-10 text-emerald-500 mx-auto" />
                <p className="font-bold text-xs text-slate-800 dark:text-slate-200">
                  Report submitted to Campus Moderation
                </p>
                <p className="text-[11px] text-slate-500">
                  Thank you for keeping Sparkle Connect safe and authentic.
                </p>
              </div>
            ) : (
              <form onSubmit={handleReport} className="py-3 space-y-3">
                <p className="text-xs text-slate-600 dark:text-slate-400 font-medium">
                  Why are you reporting this post?
                </p>
                {[
                  'Inappropriate Content',
                  'Harassment or Bullying',
                  'Spam or Commercial Solicitation',
                  'Impersonation or Fake Student',
                  'Academic Dishonesty / Scam',
                ].map((reason) => (
                  <label key={reason} className="flex items-center gap-2 text-xs font-semibold text-slate-700 dark:text-slate-300 cursor-pointer">
                    <input
                      type="radio"
                      name="report_reason"
                      value={reason}
                      checked={reportReason === reason}
                      onChange={() => setReportReason(reason)}
                      className="text-rose-600 focus:ring-rose-500"
                    />
                    <span>{reason}</span>
                  </label>
                ))}
                <div className="pt-2 flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setShowReportModal(false)}
                    className="px-3.5 py-1.5 rounded-xl border text-xs font-bold"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-1.5 rounded-xl bg-rose-600 text-white text-xs font-bold hover:bg-rose-700"
                  >
                    Submit Report
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

    </article>
  );
};
