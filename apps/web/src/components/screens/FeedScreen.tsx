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
  Filter,
  Search,
  Check,
} from 'lucide-react';

interface FeedScreenProps {
  onOpenCreatePost: () => void;
}

const CATEGORIES: { label: string; value: PostCategory | 'ALL'; icon?: string }[] = [
  { label: '🔥 All Feeds', value: 'ALL' },
  { label: '🎓 Campus Life', value: 'CAMPUS_LIFE' },
  { label: '💻 Tech & Devs', value: 'TECH' },
  { label: '🤫 Secret Confessions', value: 'ANONYMOUS' },
  { label: '📚 Academics', value: 'ACADEMICS' },
  { label: '💼 Career', value: 'CAREER' },
  { label: '🚀 Hustles', value: 'ENTREPRENEURSHIP' },
];

export const FeedScreen: React.FC<FeedScreenProps> = ({ onOpenCreatePost }) => {
  const {
    posts,
    currentUser,
    toggleLikePost,
    addComment,
    selectedUniversityId,
    universities,
  } = useSparkle();

  const [activeCategory, setActiveCategory] = useState<PostCategory | 'ALL'>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedCommentsPostId, setExpandedCommentsPostId] = useState<string | null>(null);
  const [commentInputs, setCommentInputs] = useState<Record<string, string>>({});
  const [commentAnonMap, setCommentAnonMap] = useState<Record<string, boolean>>({});
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Filter posts
  const filteredPosts = posts.filter((post) => {
    // University filter (if not ALL and post is not anonymous)
    if (selectedUniversityId !== 'ALL' && !post.isAnonymous) {
      const selectedUniv = universities.find((u) => u.id === selectedUniversityId);
      if (selectedUniv && !post.authorUniversity.toLowerCase().includes(selectedUniv.shortName.toLowerCase())) {
        return false;
      }
    }

    // Category filter
    if (activeCategory !== 'ALL' && post.category !== activeCategory) {
      return false;
    }

    // Search query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchContent = post.content.toLowerCase().includes(q);
      const matchAuthor = post.authorName.toLowerCase().includes(q);
      const matchTags = post.tags ? post.tags.some((t: string) => t.toLowerCase().includes(q)) : false;
      if (!matchContent && !matchAuthor && !matchTags) return false;
    }

    return true;
  });

  const handleSendComment = (postId: string) => {
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
      <div className="bg-white rounded-2xl border border-slate-200/80 p-4 shadow-xs flex flex-col sm:flex-row gap-3 items-center justify-between">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search campus discussions or #tags..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-xs rounded-xl bg-slate-50 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-sparkle-purple/30 font-medium"
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

      {/* Category Pills Carousel */}
      <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1">
        {CATEGORIES.map((cat) => {
          const isActive = activeCategory === cat.value;
          return (
            <button
              key={cat.value}
              onClick={() => setActiveCategory(cat.value)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all border ${
                isActive
                  ? 'bg-sparkle-purple text-white border-sparkle-purple shadow-xs'
                  : 'bg-white text-slate-600 border-slate-200 hover:border-slate-300 hover:bg-slate-50'
              }`}
            >
              {cat.label}
            </button>
          );
        })}
      </div>

      {/* Posts Stream */}
      <div className="space-y-4">
        {filteredPosts.length === 0 ? (
          <div className="bg-white rounded-2xl border border-slate-200/80 p-12 text-center">
            <Flame className="w-10 h-10 text-slate-300 mx-auto mb-2" />
            <h4 className="font-extrabold text-sm text-slate-800">No campus posts found</h4>
            <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
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
          filteredPosts.map((post) => {
            const isCommentsOpen = expandedCommentsPostId === post.id;

            return (
              <article
                key={post.id}
                className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs transition-shadow hover:shadow-md"
              >
                {/* Author row */}
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div className="flex items-center gap-3">
                    <img
                      src={post.authorAvatar}
                      alt={post.authorName}
                      className="w-10 h-10 rounded-full bg-slate-100 object-cover ring-2 ring-slate-100"
                    />
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-extrabold text-sm text-slate-900">
                          {post.authorName}
                        </span>
                        {post.isAnonymous ? (
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-amber-50 text-amber-800 border border-amber-200 flex items-center gap-1">
                            <EyeOff className="w-3 h-3" /> Anonymous Confession
                          </span>
                        ) : (
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-sparkle-purple/10 text-sparkle-purple">
                            {post.authorUniversity}
                          </span>
                        )}
                      </div>
                      <p className="text-[11px] text-slate-500 font-medium">
                        {post.authorCourse} • {post.timeAgo}
                      </p>
                    </div>
                  </div>

                  <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                    #{post.category.replace('_', ' ')}
                  </span>
                </div>

                {/* Content body */}
                <p className="text-xs sm:text-sm text-slate-800 leading-relaxed font-normal whitespace-pre-line mb-3">
                  {post.content}
                </p>

                {/* Optional Media */}
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
                    {post.tags.map((tag: string, idx: number) => (
                      <span
                        key={idx}
                        className="text-[11px] font-semibold text-sparkle-purple bg-sparkle-purple/5 px-2 py-0.5 rounded-md"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                )}

                {/* Engagement bar */}
                <div className="flex items-center justify-between border-t border-slate-100 pt-3 text-xs text-slate-500 font-semibold">
                  <div className="flex items-center gap-4">
                    {/* Like button */}
                    <button
                      onClick={() => toggleLikePost(post.id)}
                      className={`flex items-center gap-1.5 transition-colors ${
                        (post.isLiked || post.isLikedByMe)
                          ? 'text-rose-600 font-bold'
                          : 'hover:text-rose-500'
                      }`}
                    >
                      <Heart
                        className={`w-4 h-4 ${(post.isLiked || post.isLikedByMe) ? 'fill-rose-600 text-rose-600' : ''}`}
                      />
                      <span>{post.likesCount}</span>
                    </button>

                    {/* Comments Toggle */}
                    <button
                      onClick={() =>
                        setExpandedCommentsPostId(isCommentsOpen ? null : post.id)
                      }
                      className="flex items-center gap-1.5 hover:text-sparkle-purple transition-colors"
                    >
                      <MessageCircle className="w-4 h-4" />
                      <span>{post.commentsCount} comments</span>
                    </button>
                  </div>

                  {/* Share button */}
                  <button
                    onClick={() => handleShare(post.id)}
                    className="flex items-center gap-1 hover:text-slate-800 transition-colors"
                  >
                    {copiedId === post.id ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-600" />
                        <span className="text-emerald-600 font-bold">Link Copied!</span>
                      </>
                    ) : (
                      <>
                        <Share2 className="w-3.5 h-3.5" />
                        <span>Share</span>
                      </>
                    )}
                  </button>
                </div>

                {/* Collapsible Comments Section */}
                {isCommentsOpen && (
                  <div className="mt-4 pt-3 border-t border-slate-100 space-y-3">
                    {/* List comments */}
                    <div className="space-y-2.5 max-h-60 overflow-y-auto">
                      {post.comments.length === 0 ? (
                        <p className="text-xs text-slate-400 italic">No comments yet. Start the thread!</p>
                      ) : (
                        post.comments.map((comment) => (
                          <div key={comment.id} className="bg-slate-50 p-2.5 rounded-xl text-xs space-y-1">
                            <div className="flex items-center justify-between">
                              <span className="font-bold text-slate-900">
                                {comment.authorName}
                              </span>
                              <span className="text-[10px] text-slate-400">{comment.timeAgo}</span>
                            </div>
                            <p className="text-slate-700 font-medium">{comment.content}</p>
                          </div>
                        ))
                      )}
                    </div>

                    {/* New Comment Input */}
                    <div className="pt-2">
                      <div className="flex items-center justify-between mb-1.5">
                        <label className="text-[11px] font-bold text-slate-500">
                          Reply as {commentAnonMap[post.id] ? 'Secret Comrade 🤫' : (currentUser?.displayName || 'Student')}
                        </label>
                        <button
                          type="button"
                          onClick={() =>
                            setCommentAnonMap((prev) => ({ ...prev, [post.id]: !prev[post.id] }))
                          }
                          className="text-[11px] font-semibold text-sparkle-purple hover:underline"
                        >
                          {commentAnonMap[post.id] ? 'Switch to Real Profile' : 'Switch to Anonymous'}
                        </button>
                      </div>

                      <div className="flex items-center gap-2">
                        <input
                          type="text"
                          placeholder="Write a comment..."
                          value={commentInputs[post.id] || ''}
                          onChange={(e) =>
                            setCommentInputs((prev) => ({ ...prev, [post.id]: e.target.value }))
                          }
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') handleSendComment(post.id);
                          }}
                          className="flex-1 px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-sparkle-purple/30 font-medium"
                        />
                        <button
                          onClick={() => handleSendComment(post.id)}
                          className="p-2 rounded-xl bg-sparkle-purple text-white hover:bg-sparkle-purple-dark transition-colors"
                        >
                          <Send className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
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
