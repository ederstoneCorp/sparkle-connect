import React, { useState } from 'react';
import { useSparkle } from '../../context/SparkleContext';
import { PostCategory } from '../../types/models';
import {
  Flame,
  Heart,
  MessageCircle,
  Share2,
  Send,
  EyeOff,
  Sparkles,
  Search,
  Check,
  ShieldCheck,
  Lock,
} from 'lucide-react';

interface FeedScreenProps {
  onOpenCreatePost: () => void;
}

const CATEGORIES: { label: string; value: PostCategory | 'ALL' }[] = [
  { label: '🔥 All Feeds', value: 'ALL' },
  { label: '🎓 Campus Life', value: 'CAMPUS_LIFE' },
  { label: '💻 Tech & Devs', value: 'TECH' },
  { label: '🤫 Confessions', value: 'ANONYMOUS' },
  { label: '📚 Academics', value: 'ACADEMICS' },
  { label: '💼 Career', value: 'CAREER' },
  { label: '🚀 Hustles', value: 'ENTREPRENEURSHIP' },
];

const CATEGORY_COLORS: Partial<Record<PostCategory | 'ALL', string>> = {
  ANONYMOUS: 'bg-amber-50 dark:bg-amber-900/20 text-amber-700 dark:text-amber-300 border-amber-200 dark:border-amber-800',
  TECH: 'bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-800',
  ACADEMICS: 'bg-indigo-50 dark:bg-indigo-900/20 text-indigo-700 dark:text-indigo-300 border-indigo-200 dark:border-indigo-800',
  CAREER: 'bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800',
  CAMPUS_LIFE: 'bg-rose-50 dark:bg-rose-900/20 text-rose-700 dark:text-rose-300 border-rose-200 dark:border-rose-800',
  OPPORTUNITIES: 'bg-purple-50 dark:bg-purple-900/20 text-purple-700 dark:text-purple-300 border-purple-200 dark:border-purple-800',
  ENTREPRENEURSHIP: 'bg-orange-50 dark:bg-orange-900/20 text-orange-700 dark:text-orange-300 border-orange-200 dark:border-orange-800',
};

export const FeedScreen: React.FC<FeedScreenProps> = ({ onOpenCreatePost }) => {
  const {
    posts,
    currentUser,
    toggleLikePost,
    addComment,
    selectedUniversityId,
    universities,
    setIsAuthModalOpen,
  } = useSparkle();

  const [activeCategory, setActiveCategory] = useState<PostCategory | 'ALL'>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedCommentsPostId, setExpandedCommentsPostId] = useState<string | null>(null);
  const [commentInputs, setCommentInputs] = useState<Record<string, string>>({});
  const [commentAnonMap, setCommentAnonMap] = useState<Record<string, boolean>>({});
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const filteredPosts = posts.filter((post) => {
    if (selectedUniversityId !== 'ALL' && !post.isAnonymous) {
      const selectedUniv = universities.find((u) => u.id === selectedUniversityId);
      if (selectedUniv && !post.authorUniversity.toLowerCase().includes(selectedUniv.shortName.toLowerCase())) {
        return false;
      }
    }
    if (activeCategory !== 'ALL' && post.category !== activeCategory) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchContent = post.content.toLowerCase().includes(q);
      const matchAuthor = post.authorName.toLowerCase().includes(q);
      const matchTags = post.tags ? post.tags.some((t: string) => t.toLowerCase().includes(q)) : false;
      if (!matchContent && !matchAuthor && !matchTags) return false;
    }
    return true;
  });

  const handleLikePost = (postId: string) => {
    if (!currentUser) { setIsAuthModalOpen(true); return; }
    toggleLikePost(postId);
  };

  const handleSendComment = (postId: string) => {
    if (!currentUser) { setIsAuthModalOpen(true); return; }
    const text = commentInputs[postId];
    if (!text || !text.trim()) return;
    const isAnon = !!commentAnonMap[postId];
    addComment(postId, text.trim(), isAnon);
    setCommentInputs((prev) => ({ ...prev, [postId]: '' }));
  };

  const handleShare = (postId: string) => {
    navigator.clipboard?.writeText(window.location.href);
    setCopiedId(postId);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="space-y-4">
      {/* Search & Top Action Bar */}
      <div className="bg-white dark:bg-sparkle-darkSurface rounded-2xl border border-slate-200/80 dark:border-slate-700/60 p-4 shadow-xs flex flex-col sm:flex-row gap-3 items-center justify-between animate-slide-down">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search campus discussions or #tags..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-600 focus:outline-none focus:ring-2 focus:ring-sparkle-purple/30 font-medium dark:text-slate-200 dark:placeholder-slate-500"
          />
        </div>

        <button
          onClick={onOpenCreatePost}
          className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-sparkle-purple hover:bg-sparkle-purple-dark text-white font-extrabold text-xs shadow-md shadow-sparkle-purple/20 flex items-center justify-center gap-2 transition-all"
        >
          <Sparkles className="w-4 h-4" />
          <span>What's on your mind?</span>
        </button>
      </div>

      {/* Category Pills */}
      <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1 animate-fade-in">
        {CATEGORIES.map((cat) => {
          const isActive = activeCategory === cat.value;
          return (
            <button
              key={cat.value}
              onClick={() => setActiveCategory(cat.value)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all border ${
                isActive
                  ? 'bg-sparkle-purple text-white border-sparkle-purple shadow-xs'
                  : 'bg-white dark:bg-sparkle-darkSurface text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-600 hover:border-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700'
              }`}
            >
              {cat.label}
            </button>
          );
        })}
      </div>

      {/* Anonymous Confessions Banner (when filter active) */}
      {activeCategory === 'ANONYMOUS' && (
        <div className="bg-gradient-to-r from-amber-500 to-orange-500 text-white p-4 rounded-2xl flex items-start gap-3 animate-fade-in">
          <Lock className="w-5 h-5 shrink-0 mt-0.5" />
          <div>
            <p className="font-extrabold text-sm">#Anonymous Confessions & Mental Health</p>
            <p className="text-xs text-white/90 mt-0.5 leading-relaxed">
              This is a moderated safe space for Kenyan students. Your identity is fully hidden — even from admins at the DB level. Be kind to fellow comrades. 🫂
            </p>
          </div>
        </div>
      )}

      {/* Posts Stream */}
      <div className="space-y-4">
        {filteredPosts.length === 0 ? (
          <div className="bg-white dark:bg-sparkle-darkSurface rounded-2xl border border-slate-200/80 dark:border-slate-700/60 p-12 text-center">
            <Flame className="w-10 h-10 text-slate-300 mx-auto mb-2" />
            <h4 className="font-extrabold text-sm text-slate-800 dark:text-slate-200">No campus posts found</h4>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-sm mx-auto">
              Be the first to share an update or switch your university filter.
            </p>
            <button
              onClick={onOpenCreatePost}
              className="mt-4 px-4 py-2 rounded-xl bg-sparkle-purple text-white text-xs font-bold"
            >
              Start Conversation
            </button>
          </div>
        ) : (
          filteredPosts.map((post, idx) => {
            const isCommentsOpen = expandedCommentsPostId === post.id;
            const catColor = CATEGORY_COLORS[post.category] || 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-600';

            return (
              <article
                key={post.id}
                className={`bg-white dark:bg-sparkle-darkSurface rounded-2xl border border-slate-200/80 dark:border-slate-700/60 p-5 shadow-xs transition-shadow hover:shadow-md animate-stagger-${Math.min(idx + 1, 4) as 1|2|3|4}`}
              >
                {/* Anonymous confession header */}
                {post.isAnonymous && (
                  <div className="flex items-center gap-2 mb-3 p-2.5 rounded-xl bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800">
                    <Lock className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                    <p className="text-[11px] font-bold text-amber-700 dark:text-amber-300">
                      Anonymous Confession — Identity fully protected 🔒
                    </p>
                  </div>
                )}

                {/* Author row */}
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div className="flex items-center gap-3">
                    {post.isAnonymous ? (
                      <div className="w-10 h-10 rounded-full bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center">
                        <EyeOff className="w-5 h-5 text-amber-600" />
                      </div>
                    ) : (
                      <img
                        src={post.authorAvatar && !['FC','KO','AH','GK','MW','DK','DM','LA','PK','KU'].includes(post.authorAvatar)
                          ? post.authorAvatar
                          : `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(post.authorName)}`}
                        alt={post.authorName}
                        className="w-10 h-10 rounded-full bg-slate-100 object-cover ring-2 ring-slate-100 dark:ring-slate-700"
                      />
                    )}
                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-extrabold text-sm text-slate-900 dark:text-slate-100">
                          {post.authorName}
                        </span>
                        {!post.isAnonymous && post.isAuthorVerified && (
                          <span title="Verified Student" className="inline-flex items-center gap-1 text-[10px] font-bold px-1.5 py-0.5 rounded-md bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800">
                            <ShieldCheck className="w-3 h-3" /> Verified
                          </span>
                        )}
                        {!post.isAnonymous && (
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md border ${catColor}`}>
                            {post.authorUniversity}
                          </span>
                        )}
                      </div>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">
                        {!post.isAnonymous && post.authorCourse && `${post.authorCourse} • `}{post.timeAgo}
                      </p>
                    </div>
                  </div>

                  <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md border ${catColor}`}>
                    #{post.category.replace('_', ' ')}
                  </span>
                </div>

                {/* Content */}
                <p className="text-xs sm:text-sm text-slate-800 dark:text-slate-200 leading-relaxed font-normal whitespace-pre-line mb-3">
                  {post.content}
                </p>

                {/* Media */}
                {post.mediaUrl && (
                  <div className="mb-3 rounded-xl overflow-hidden max-h-80 bg-slate-100">
                    <img
                      src={post.mediaUrl}
                      alt="Post visual"
                      className="w-full h-full object-cover"
                      loading="lazy"
                    />
                  </div>
                )}

                {/* Tags */}
                {post.tags && post.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 mb-4">
                    {post.tags.map((tag: string, i: number) => (
                      <span key={i} className="text-[11px] font-semibold text-sparkle-purple bg-sparkle-purple/5 dark:bg-sparkle-purple/10 px-2 py-0.5 rounded-md">
                        #{tag}
                      </span>
                    ))}
                  </div>
                )}

                {/* Engagement bar */}
                <div className="flex items-center justify-between border-t border-slate-100 dark:border-slate-700 pt-3 text-xs text-slate-500 dark:text-slate-400 font-semibold">
                  <div className="flex items-center gap-4">
                    <button
                      onClick={() => handleLikePost(post.id)}
                      className={`flex items-center gap-1.5 transition-colors ${
                        (post.isLiked || post.isLikedByMe)
                          ? 'text-rose-600 font-bold'
                          : 'hover:text-rose-500'
                      }`}
                    >
                      <Heart className={`w-4 h-4 ${(post.isLiked || post.isLikedByMe) ? 'fill-rose-600 text-rose-600' : ''}`} />
                      <span>{post.likesCount}</span>
                    </button>

                    <button
                      onClick={() => setExpandedCommentsPostId(isCommentsOpen ? null : post.id)}
                      className="flex items-center gap-1.5 hover:text-sparkle-purple transition-colors"
                    >
                      <MessageCircle className="w-4 h-4" />
                      <span>{post.commentsCount || post.comments.length}</span>
                    </button>

                    <button
                      onClick={() => handleShare(post.id)}
                      className="flex items-center gap-1.5 hover:text-sparkle-blue transition-colors"
                    >
                      {copiedId === post.id ? (
                        <><Check className="w-4 h-4 text-emerald-500" /><span className="text-emerald-500">Copied!</span></>
                      ) : (
                        <><Share2 className="w-4 h-4" /><span>{post.sharesCount || 0}</span></>
                      )}
                    </button>
                  </div>
                </div>

                {/* Comments section */}
                {isCommentsOpen && (
                  <div className="mt-4 space-y-3 border-t border-slate-100 dark:border-slate-700 pt-4">
                    {post.comments.map((comment) => (
                      <div key={comment.id} className="flex gap-2.5">
                        <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-sparkle-purple/20 to-sparkle-pink/20 flex items-center justify-center text-[10px] font-black text-sparkle-purple shrink-0">
                          {comment.isAnonymous ? '🔒' : comment.authorName.charAt(0)}
                        </div>
                        <div className="flex-1 bg-slate-50 dark:bg-slate-800 rounded-xl px-3 py-2">
                          <div className="flex items-center gap-2 mb-0.5">
                            <span className="text-[11px] font-bold text-slate-800 dark:text-slate-200">
                              {comment.authorName}
                            </span>
                            <span className="text-[10px] text-slate-400">{comment.timeAgo}</span>
                          </div>
                          <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed">{comment.content}</p>
                        </div>
                      </div>
                    ))}

                    {/* Comment Input */}
                    <div className="flex gap-2.5 items-start">
                      <div className="w-7 h-7 rounded-full bg-sparkle-purple/10 flex items-center justify-center text-sparkle-purple text-[10px] font-black shrink-0">
                        {currentUser ? currentUser.displayName.charAt(0) : '?'}
                      </div>
                      <div className="flex-1 relative">
                        <input
                          type="text"
                          placeholder={post.isAnonymous ? 'Reply anonymously...' : 'Add a comment...'}
                          value={commentInputs[post.id] || ''}
                          onChange={(e) => setCommentInputs((prev) => ({ ...prev, [post.id]: e.target.value }))}
                          onKeyDown={(e) => { if (e.key === 'Enter') handleSendComment(post.id); }}
                          className="w-full pl-3 pr-10 py-2 text-xs rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-600 focus:outline-none focus:ring-2 focus:ring-sparkle-purple/30 dark:text-slate-200 dark:placeholder-slate-500"
                        />
                        <button
                          onClick={() => handleSendComment(post.id)}
                          className="absolute right-2 top-1/2 -translate-y-1/2 text-sparkle-purple hover:text-sparkle-purple-dark"
                        >
                          <Send className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

                    {/* Anonymous comment toggle */}
                    {currentUser && (
                      <button
                        onClick={() => setCommentAnonMap((prev) => ({ ...prev, [post.id]: !prev[post.id] }))}
                        className={`text-[10px] font-bold flex items-center gap-1 transition-colors ${
                          commentAnonMap[post.id] ? 'text-amber-600' : 'text-slate-400 hover:text-slate-600'
                        }`}
                      >
                        <EyeOff className="w-3 h-3" />
                        {commentAnonMap[post.id] ? 'Anonymous mode ON' : 'Comment anonymously'}
                      </button>
                    )}
                  </div>
                )}
              </article>
            );
          })
        )}
      </div>
    </div>
  );
};
